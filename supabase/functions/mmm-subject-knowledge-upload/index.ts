/**
 * Supabase Edge Function: mmm-subject-knowledge-upload
 *
 * Route: POST /api/dmc/subject-knowledge/upload
 * Purpose: register uploaded subject-knowledge document and index it into ai_knowledge.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';
import { uploadToKuc } from '../_shared/mmm-kuc-client.ts';
import {
  buildKnowledgeTextFromAiParseResult,
  buildChunkPayloads,
  extractBestEffortText,
  normalizeSubjectDocumentRole,
  omitKnowledgeMetadataColumn,
  requireSubjectKnowledgeSuperuser,
  sanitizeKnowledgeInsertPayload,
  sanitizeForPostgresJson,
  sanitizeForPostgresText,
  sha256Hex,
} from '../_shared/mmm-subject-knowledge.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const KUC_BASE_URL = (Deno.env.get('KUC_BASE_URL') ?? '').replace(/\/+$/, '');

type UploadBody = {
  title?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  storage_bucket?: string;
  storage_path?: string;
  document_role?: string;
  tags?: string[];
  upload_notes?: string | null;
  replace_existing?: boolean;
};

function fallbackContentFromMetadata(body: UploadBody): string {
  const parts = [
    `Subject knowledge upload: ${body.title ?? body.file_name ?? 'Untitled document'}`,
    `MIME type: ${body.mime_type ?? 'unknown'}`,
    body.upload_notes ? `Uploader notes: ${body.upload_notes}` : '',
  ].filter(Boolean);
  return parts.join('\n');
}

const AI_GATEWAY_URL = (Deno.env.get('AI_GATEWAY_URL') ?? '').replace(/\/+$/, '');
const AI_PARSE_TIMEOUT_MS = 120_000;

type AiParseResult = {
  domains?: Array<Record<string, unknown>>;
  mini_performance_standards?: Array<Record<string, unknown>>;
  confidence_score?: number;
};

async function tryAiGatewayParseText(params: {
  supabase: ReturnType<typeof createClient>;
  storageBucket: string;
  storagePath: string;
  tenantId: string;
}): Promise<{ text: string | null; parseResult: AiParseResult | null }> {
  const { supabase, storageBucket, storagePath, tenantId } = params;
  if (!AI_GATEWAY_URL) return { text: null, parseResult: null };

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(storageBucket)
    .createSignedUrl(storagePath, 60 * 10);
  if (signedUrlError || !signedUrlData?.signedUrl) return { text: null, parseResult: null };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_PARSE_TIMEOUT_MS);
  try {
    const response = await fetch(`${AI_GATEWAY_URL}/api/v1/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_url: signedUrlData.signedUrl,
        tenant_id: tenantId,
        file_path: storagePath,
      }),
      signal: controller.signal,
    });
    if (!response.ok) return { text: null, parseResult: null };
    const parseResult = (await response.json()) as AiParseResult;
    return { text: buildKnowledgeTextFromAiParseResult(parseResult), parseResult };
  } catch {
    return { text: null, parseResult: null };
  } finally {
    clearTimeout(timeoutId);
  }
}

function deriveSourceModeFromTags(tags: string[]): 'VERBATIM' | 'HYBRID' | 'GENERATED' {
  if (tags.includes('source_mode:VERBATIM')) return 'VERBATIM';
  if (tags.includes('source_mode:HYBRID')) return 'HYBRID';
  return 'GENERATED';
}

function isOrganisationVerbatimSource(tags: string[]): boolean {
  return tags.includes('organisation_context') && tags.includes('source_mode:VERBATIM');
}

function buildVerbatimIndexRows(params: {
  organisationId: string;
  documentId: string;
  frameworkId: string | null;
  sourceMode: 'VERBATIM' | 'HYBRID' | 'GENERATED';
  parseResult: AiParseResult | null;
  extractedText: string;
}): Array<Record<string, unknown>> {
  const { organisationId, documentId, frameworkId, sourceMode, parseResult, extractedText } = params;
  if (!parseResult) return [];
  const confidence = typeof parseResult.confidence_score === 'number' ? parseResult.confidence_score : null;
  const mpsList = Array.isArray(parseResult.mini_performance_standards)
    ? parseResult.mini_performance_standards
    : [];
  const rows: Array<Record<string, unknown>> = [];
  for (const mps of mpsList) {
    const domainName = sanitizeForPostgresText(String(mps.domain_name ?? '')).trim();
    const mpsCode = sanitizeForPostgresText(String(mps.number ?? '')).trim();
    const mpsTitle = sanitizeForPostgresText(String(mps.name ?? '')).trim();
    const intent = sanitizeForPostgresText(String(mps.intent_statement ?? '')).trim();
    if (!domainName || !mpsCode || !mpsTitle || !intent) continue;
    rows.push({
      organisation_id: organisationId,
      document_id: documentId,
      framework_id: frameworkId,
      source_mode: sourceMode,
      domain_name: domainName,
      mps_code: mpsCode,
      mps_title: mpsTitle,
      intent_verbatim: intent,
      source_anchor: null,
      confidence,
      extracted_at: new Date().toISOString(),
    });
  }
  if (rows.length > 0) return rows;

  // Deterministic fallback parser for LDCS-like verbatim docs where AI parse omits intent_statement.
  const normalized = extractedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const mpsMatches = [...normalized.matchAll(/(?:^|\n)\s*MPS\s*([A-Za-z0-9.]+)\s*[–-]\s*([^\n]+)(?:\n|$)/gi)];
  for (let i = 0; i < mpsMatches.length; i += 1) {
    const current = mpsMatches[i];
    const start = current.index ?? 0;
    const end = i + 1 < mpsMatches.length ? (mpsMatches[i + 1].index ?? normalized.length) : normalized.length;
    const block = normalized.slice(start, end);
    const intentMatch = block.match(
      /Intent\s*(?::|\n)\s*([\s\S]*?)(?:\n\s*Required\s+Actions|\n\s*MPS\s*[A-Za-z0-9.]+\s*[–-]|$)/i,
    );
    const intent = sanitizeForPostgresText((intentMatch?.[1] ?? '').replace(/\s+/g, ' ').trim());
    if (!intent || intent.length < 24) continue;
    const rawNumber = sanitizeForPostgresText(String(current[1] ?? '').trim());
    const numberDigits = rawNumber.match(/\d+/)?.[0] ?? rawNumber;
    const title = sanitizeForPostgresText(String(current[2] ?? '').trim());
    rows.push({
      organisation_id: organisationId,
      document_id: documentId,
      framework_id: frameworkId,
      source_mode: sourceMode,
      domain_name: 'Leadership and Governance',
      mps_code: rawNumber.toUpperCase().includes('MPS')
        ? rawNumber.toUpperCase()
        : `D001.MPS${numberDigits.padStart(3, '0')}`,
      mps_title: title,
      intent_verbatim: intent,
      source_anchor: `MPS ${rawNumber}`,
      confidence: 0.71,
      extracted_at: new Date().toISOString(),
    });
  }
  return rows;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Service configuration error' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let claims: { userId: string; orgId: string; role: string };
  try {
    claims = await validateJWT(req, supabase);
    requireSubjectKnowledgeSuperuser(claims.role);
  } catch (response) {
    return response as Response;
  }

  let body: UploadBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const fileName = (body.file_name ?? '').trim();
  const storageBucket = (body.storage_bucket ?? '').trim();
  const storagePath = (body.storage_path ?? '').trim();
  const mimeType = (body.mime_type ?? 'application/octet-stream').trim();
  const title = (body.title ?? fileName).trim();
  const fileSize = Number.isFinite(body.file_size) ? Number(body.file_size) : 0;
  const documentRole = normalizeSubjectDocumentRole(body.document_role);
  const tags = Array.isArray(body.tags) ? body.tags.filter((tag) => typeof tag === 'string') : [];
  const replaceExisting = body.replace_existing === true;

  if (!fileName || !storageBucket || !storagePath || !title) {
    return jsonResponse(
      { error: 'title, file_name, storage_bucket, and storage_path are required.' },
      400,
    );
  }

  const { data: duplicate } = await supabase
    .from('mmm_subject_knowledge_documents')
    .select('id,file_name,file_size')
    .eq('organisation_id', claims.orgId)
    .eq('file_name', fileName)
    .is('archived_at', null)
    .maybeSingle();

  if (duplicate && !replaceExisting) {
    return jsonResponse(
      {
        error: `Duplicate file already exists (${fileName}).`,
        code: 'DUPLICATE_FILE',
        duplicate_document_id: duplicate.id,
      },
      409,
    );
  }

  if (duplicate && replaceExisting) {
    await supabase
      .from('mmm_subject_knowledge_documents')
      .update({
        archived_at: new Date().toISOString(),
        updated_by: claims.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', duplicate.id);
  }

  const { data: inserted, error: insertError } = await supabase
    .from('mmm_subject_knowledge_documents')
    .insert({
      organisation_id: claims.orgId,
      uploaded_by: claims.userId,
      updated_by: claims.userId,
      title,
      file_name: fileName,
      mime_type: mimeType,
      file_size: fileSize,
      storage_bucket: storageBucket,
      storage_path: storagePath,
      document_role: documentRole,
      scope_type: 'subject_knowledge',
      processing_status: 'processing',
      tags,
      upload_notes: body.upload_notes ?? null,
    })
    .select('id')
    .single();

  if (insertError || !inserted?.id) {
    return jsonResponse({ error: insertError?.message ?? 'Unable to create subject knowledge document.' }, 500);
  }

  const documentId = inserted.id as string;

  try {
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from(storageBucket)
      .download(storagePath);

    if (downloadError || !fileBlob) {
      await supabase
        .from('mmm_subject_knowledge_documents')
        .update({
          processing_status: 'failed',
          processing_error: downloadError?.message ?? 'Unable to read file from storage.',
          updated_by: claims.userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);
      return jsonResponse(
        { error: downloadError?.message ?? 'Unable to read file from storage.' },
        502,
      );
    }

    const kucResult = await uploadToKuc(
      fileBlob,
      documentRole as 'criteria_source' | 'evidence' | 'knowledge_source' | 'guidance' | 'template',
      claims.orgId,
      claims.userId,
      {
        filename: fileName,
        mime_type: mimeType,
        size_bytes: fileSize,
        upload_context: 'subject_knowledge',
      },
    );

    const aiParse = await tryAiGatewayParseText({
      supabase,
      storageBucket,
      storagePath,
      tenantId: claims.orgId,
    });
    const orgVerbatim = isOrganisationVerbatimSource(tags);

    const extractedText = await extractBestEffortText({
      mimeType,
      fileBlob,
      fallbackText: fallbackContentFromMetadata(body),
      kucClassification: kucResult.kuc_classification,
      // For organisation VERBATIM source, use full extracted corpus first (file/KUC) rather than
      // AI parse summary text to preserve raw "Intent/Required Actions" blocks.
      aiParsedText: orgVerbatim ? null : aiParse.text,
    });

    const fileHash = await sha256Hex(`${fileName}:${storageBucket}:${storagePath}:${fileSize}`);
    const chunkPayloads = await buildChunkPayloads({
      organisationId: claims.orgId,
      documentId,
      sourceDocumentName: fileName,
      source: 'mmm-dmc-upload',
      content: extractedText,
      documentRole,
      domain: 'subject_knowledge',
      module: 'mmm',
      metadata: {
        storage_bucket: storageBucket,
        storage_path: storagePath,
        title,
        tags,
        kuc_classification: kucResult.kuc_classification ?? null,
      },
    });

    await supabase.from('ai_knowledge').delete().eq('document_id', documentId);

    if (chunkPayloads.length > 0) {
      const { error: chunkError } = await supabase.from('ai_knowledge').insert(chunkPayloads);
      if (chunkError) {
        const lower = (chunkError.message ?? '').toLowerCase();
        if (!lower.includes('invalid input syntax for type json')) {
          throw new Error(chunkError.message || 'Unable to persist ai_knowledge chunks.');
        }

        const minimal = chunkPayloads.map((payload) => ({
          ...sanitizeKnowledgeInsertPayload(payload),
          metadata: {},
        }));
        const { error: minimalError } = await supabase.from('ai_knowledge').insert(minimal);
        if (minimalError) {
          const minimalLower = (minimalError.message ?? '').toLowerCase();
          if (!minimalLower.includes('invalid input syntax for type json')) {
            throw new Error(minimalError.message || 'Unable to persist ai_knowledge chunks (minimal json retry failed).');
          }

          const noMetadata = chunkPayloads.map(omitKnowledgeMetadataColumn);
          const { error: noMetadataError } = await supabase.from('ai_knowledge').insert(noMetadata);
          if (noMetadataError) {
            throw new Error(noMetadataError.message || 'Unable to persist ai_knowledge chunks (metadata column omitted).');
          }
        }
      }
    }

    const frameworkIdTag = tags.find((tag) => tag.startsWith('framework_id:')) ?? null;
    const frameworkId = frameworkIdTag ? frameworkIdTag.replace('framework_id:', '').trim() : null;
    const sourceMode = deriveSourceModeFromTags(tags);
    const verbatimRows = buildVerbatimIndexRows({
      organisationId: claims.orgId,
      documentId,
      frameworkId,
      sourceMode,
      parseResult: aiParse.parseResult,
      extractedText,
    });
    await supabase.from('mmm_org_source_verbatim_index').delete().eq('document_id', documentId);
    if (verbatimRows.length > 0) {
      const { error: indexError } = await supabase
        .from('mmm_org_source_verbatim_index')
        .upsert(verbatimRows, { onConflict: 'document_id,domain_name,mps_code' });
      if (indexError) {
        throw new Error(indexError.message || 'Unable to persist verbatim source index rows.');
      }
    }

    const isOrgVerbatim = tags.includes('organisation_context') && sourceMode === 'VERBATIM';
    const updatePayload: Record<string, unknown> = {
      processing_status: isOrgVerbatim && verbatimRows.length === 0 ? 'failed' : 'completed',
      processing_error: null,
      chunk_count: chunkPayloads.length,
      content_hash: fileHash,
      kuc_upload_id: kucResult.kuc_classification?.upload_id ?? null,
      kuc_parse_job_id: kucResult.kuc_classification?.parse_job_id ?? null,
      kuc_classification: sanitizeForPostgresJson(kucResult.kuc_classification ?? null),
      updated_by: claims.userId,
      updated_at: new Date().toISOString(),
    };

    if (!kucResult.success && !kucResult.fallback) {
      updatePayload.processing_error = sanitizeForPostgresText(`KUC upload failed: ${kucResult.error ?? 'Unknown KUC error'}`);
    }
    if (isOrgVerbatim && verbatimRows.length === 0) {
      const headingCount = (extractedText.match(/(?:^|\n)\s*MPS\s*[A-Za-z0-9.]+\s*[–-]/gi) ?? []).length;
      const kucTextCandidate = sanitizeForPostgresText(
        String((kucResult.kuc_classification as Record<string, unknown> | null)?.extracted_text ?? ''),
      ).trim();
      updatePayload.processing_error =
        `VERBATIM source parse failed: no extractable MPS intent statements found. ` +
        `(chars=${extractedText.length}, mps_headings=${headingCount}, ai_summary_chars=${aiParse.text?.length ?? 0}, ` +
        `kuc_success=${kucResult.success}, kuc_error=${kucResult.error ?? 'none'}, kuc_chars=${kucTextCandidate.length}, ` +
        `kuc_base_url_present=${KUC_BASE_URL ? 'yes' : 'no'})`;
    }

    await supabase
      .from('mmm_subject_knowledge_documents')
      .update(updatePayload)
      .eq('id', documentId);

    return jsonResponse(
      {
        document_id: documentId,
        chunk_count: chunkPayloads.length,
        kuc_success: kucResult.success,
        kuc_fallback: kucResult.fallback,
        kuc_error: kucResult.error,
      },
      201,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected subject knowledge indexing error.';
    await supabase
      .from('mmm_subject_knowledge_documents')
      .update({
        processing_status: 'failed',
        processing_error: message,
        updated_by: claims.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    return jsonResponse({ error: message, document_id: documentId }, 500);
  }
});
