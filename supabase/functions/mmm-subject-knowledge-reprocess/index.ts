/**
 * Supabase Edge Function: mmm-subject-knowledge-reprocess
 *
 * Route: POST /api/dmc/subject-knowledge/reprocess
 * Purpose: re-index existing subject-knowledge document into ai_knowledge.
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
  sanitizeKnowledgeInsertPayload,
  sanitizeForPostgresJson,
  sanitizeForPostgresText,
  sha256Hex,
} from '../_shared/mmm-subject-knowledge.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const AI_GATEWAY_URL = (Deno.env.get('AI_GATEWAY_URL') ?? '').replace(/\/+$/, '');
const KUC_BASE_URL = (Deno.env.get('KUC_BASE_URL') ?? '').replace(/\/+$/, '');
const AI_PARSE_TIMEOUT_MS = 120_000;

type ReprocessBody = {
  document_id?: string;
  background?: boolean;
};

type AiParseResult = {
  domains?: Array<Record<string, unknown>>;
  mini_performance_standards?: Array<Record<string, unknown>>;
  confidence_score?: number;
};

type ReprocessClaims = {
  userId: string;
  orgId: string;
  role: string;
};

type SubjectKnowledgeDocument = {
  id: string;
  organisation_id: string;
  title: string | null;
  file_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  storage_bucket: string;
  storage_path: string;
  document_role: string | null;
  scope_type: string | null;
  upload_notes: string | null;
};

type ReprocessResult = {
  accepted?: boolean;
  status?: string;
  success?: boolean;
  error?: string;
  document_id: string;
  chunk_count?: number;
  kuc_success?: boolean;
  kuc_fallback?: boolean;
  kuc_error?: string | null;
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

function deriveSourceModeFromSafeFields(params: {
  title?: string | null;
  uploadNotes?: string | null;
}): 'VERBATIM' | 'HYBRID' | 'GENERATED' {
  const text = `${params.title ?? ''}\n${params.uploadNotes ?? ''}`.toUpperCase();
  if (text.includes('VERBATIM SOURCE') || text.includes('AUTHORITATIVE VERBATIM')) return 'VERBATIM';
  if (text.includes('HYBRID SOURCE') || text.includes('HYBRID')) return 'HYBRID';
  return 'GENERATED';
}

function buildSafeReprocessTags(params: {
  scopeType?: string | null;
  sourceMode: 'VERBATIM' | 'HYBRID' | 'GENERATED';
}): string[] {
  const tags = [`source_mode:${params.sourceMode}`];
  if ((params.scopeType ?? '').toLowerCase() === 'organisation_context') {
    tags.unshift('organisation_context', 'mode_source');
  }
  return tags;
}

function domainNameForMpsNumber(number: number): string {
  if (number >= 1 && number <= 5) return 'Leadership and Governance';
  if (number >= 6 && number <= 11) return 'Process Integrity';
  if (number >= 12 && number <= 15) return 'People and Culture';
  if (number >= 16 && number <= 21) return 'Protection';
  return 'Proof';
}

function domainCodeForMpsNumber(number: number): string {
  if (number >= 1 && number <= 5) return 'D001';
  if (number >= 6 && number <= 11) return 'D002';
  if (number >= 12 && number <= 15) return 'D003';
  if (number >= 16 && number <= 21) return 'D004';
  return 'D005';
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
  const confidence = typeof parseResult?.confidence_score === 'number' ? parseResult.confidence_score : null;
  const mpsList = Array.isArray(parseResult?.mini_performance_standards)
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

  const normalizedFull = extractedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const realMpsStart = normalizedFull.search(/\n\s*Leadership\s+and\s+Governance\s*\n\s*MPS\s*1\s*[–-]/i);
  const normalized = realMpsStart >= 0 ? normalizedFull.slice(realMpsStart) : normalizedFull;
  const mpsMatches = [...normalized.matchAll(/(?:^|\n)\s*MPS\s*([A-Za-z0-9.]+)\s*[–-]\s*([^\n]+)(?:\n|$)/gi)];
  for (let i = 0; i < mpsMatches.length; i += 1) {
    const current = mpsMatches[i];
    const start = current.index ?? 0;
    const end = i + 1 < mpsMatches.length ? (mpsMatches[i + 1].index ?? normalized.length) : normalized.length;
    const block = normalized.slice(start, end);
    const intentMatch = block.match(
      /Intent\s*(?::|\n|(?=[A-Z]))\s*([\s\S]*?)(?:\n\s*Required\s+Actions|\n\s*Required\s+Actions|\n\s*MPS\s*[A-Za-z0-9.]+\s*[–-]|$)/i,
    );
    const intent = sanitizeForPostgresText((intentMatch?.[1] ?? '').replace(/\s+/g, ' ').trim());
    if (!intent || intent.length < 24) continue;
    const rawNumber = sanitizeForPostgresText(String(current[1] ?? '').trim());
    const numberDigits = rawNumber.match(/\d+/)?.[0] ?? rawNumber;
    const mpsNumber = Number.parseInt(numberDigits, 10);
    const title = sanitizeForPostgresText(String(current[2] ?? '').trim());
    rows.push({
      organisation_id: organisationId,
      document_id: documentId,
      framework_id: frameworkId,
      source_mode: sourceMode,
      domain_name: domainNameForMpsNumber(Number.isFinite(mpsNumber) ? mpsNumber : 1),
      mps_code: rawNumber.toUpperCase().includes('MPS')
        ? rawNumber.toUpperCase()
        : `${domainCodeForMpsNumber(Number.isFinite(mpsNumber) ? mpsNumber : 1)}.MPS${numberDigits.padStart(3, '0')}`,
      mps_title: title,
      intent_verbatim: intent,
      source_anchor: `MPS ${rawNumber}`,
      confidence: 0.71,
      extracted_at: new Date().toISOString(),
    });
  }
  return rows;
}

async function runReprocessPipeline(params: {
  supabase: ReturnType<typeof createClient>;
  doc: SubjectKnowledgeDocument;
  claims: ReprocessClaims;
  documentId: string;
}): Promise<ReprocessResult> {
  const { supabase, doc, claims, documentId } = params;
  try {
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from(doc.storage_bucket)
      .download(doc.storage_path);

    if (downloadError || !fileBlob) {
      throw new Error(downloadError?.message ?? 'Unable to download source file for reprocess.');
    }

    const documentRole = normalizeSubjectDocumentRole(doc.document_role);
    const kucResult = await uploadToKuc(
      fileBlob,
      documentRole as 'criteria_source' | 'evidence' | 'knowledge_source' | 'guidance' | 'template',
      claims.orgId,
      claims.userId,
      {
        filename: doc.file_name,
        mime_type: doc.mime_type,
        size_bytes: Number(doc.file_size ?? 0),
        upload_context: 'subject_knowledge',
      },
    );

    const aiParse = await tryAiGatewayParseText({
      supabase,
      storageBucket: doc.storage_bucket,
      storagePath: doc.storage_path,
      tenantId: claims.orgId,
    });
    const sourceMode = deriveSourceModeFromSafeFields({
      title: doc.title,
      uploadNotes: doc.upload_notes,
    });
    const tags = buildSafeReprocessTags({ scopeType: doc.scope_type, sourceMode });
    const isOrgContext = (doc.scope_type ?? '').toLowerCase() === 'organisation_context';
    const orgVerbatim = isOrgContext && sourceMode === 'VERBATIM';

    const extractedText = await extractBestEffortText({
      mimeType: doc.mime_type,
      fileBlob,
      fallbackText: [
        `Subject knowledge document: ${doc.title ?? doc.file_name}`,
        `MIME type: ${doc.mime_type}`,
        doc.upload_notes ? `Uploader notes: ${doc.upload_notes}` : '',
      ].filter(Boolean).join('\n'),
      kucClassification: kucResult.kuc_classification,
      aiParsedText: orgVerbatim ? null : aiParse.text,
    });

    const chunkPayloads = await buildChunkPayloads({
      organisationId: claims.orgId,
      documentId,
      sourceDocumentName: doc.file_name,
      source: 'mmm-dmc-reprocess',
      content: extractedText,
      documentRole,
      domain: 'subject_knowledge',
      module: 'mmm',
      metadata: {
        storage_bucket: doc.storage_bucket,
        storage_path: doc.storage_path,
        tags,
        kuc_classification: kucResult.kuc_classification ?? null,
      },
    });

    await supabase.from('ai_knowledge').delete().eq('document_id', documentId);
    if (chunkPayloads.length > 0) {
      const { error: chunkError } = await supabase.from('ai_knowledge').insert(chunkPayloads);
      if (chunkError) {
        const lower = (chunkError.message ?? '').toLowerCase();
        if (lower.includes('invalid input syntax for type json')) {
          const slim = chunkPayloads.map((payload) => ({
            ...sanitizeKnowledgeInsertPayload(payload),
            metadata: { document_role: documentRole, retry_mode: 'json_slim_fallback' },
          }));
          const { error: retryError } = await supabase.from('ai_knowledge').insert(slim);
          if (retryError) {
            const retryLower = (retryError.message ?? '').toLowerCase();
            if (retryLower.includes('invalid input syntax for type json')) {
              const minimal = chunkPayloads.map((payload) => ({
                ...sanitizeKnowledgeInsertPayload(payload),
                metadata: {},
              }));
              const { error: finalRetryError } = await supabase.from('ai_knowledge').insert(minimal);
              if (finalRetryError) {
                const finalRetryLower = (finalRetryError.message ?? '').toLowerCase();
                if (finalRetryLower.includes('invalid input syntax for type json')) {
                  const noMetadata = chunkPayloads.map(omitKnowledgeMetadataColumn);
                  const { error: noMetadataError } = await supabase.from('ai_knowledge').insert(noMetadata);
                  if (noMetadataError) {
                    throw new Error(noMetadataError.message || 'Unable to persist ai_knowledge chunks (metadata column omitted).');
                  }
                } else {
                  throw new Error(finalRetryError.message || 'Unable to persist ai_knowledge chunks (minimal json retry failed).');
                }
              }
            } else {
              throw new Error(retryError.message || 'Unable to persist ai_knowledge chunks (json retry failed).');
            }
          }
        } else {
          throw new Error(chunkError.message || 'Unable to persist ai_knowledge chunks.');
        }
      }
    }

    const frameworkId = null;
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

    const fileHash = await sha256Hex(`${doc.file_name}:${doc.storage_bucket}:${doc.storage_path}:${doc.file_size ?? 0}`);
    const isOrgVerbatim = isOrgContext && sourceMode === 'VERBATIM';
    const hasExtractedChunks = chunkPayloads.length > 0;
    const completionUpdate = {
      processing_status: hasExtractedChunks ? 'completed' : 'failed',
      processing_error: !kucResult.success && !kucResult.fallback
        ? sanitizeForPostgresText(`KUC upload failed: ${kucResult.error ?? 'Unknown KUC error'}`)
        : null,
      chunk_count: chunkPayloads.length,
      content_hash: fileHash,
      kuc_upload_id: kucResult.kuc_classification?.upload_id ?? null,
      kuc_parse_job_id: kucResult.kuc_classification?.parse_job_id ?? null,
      kuc_classification: sanitizeForPostgresJson(kucResult.kuc_classification ?? null),
      updated_by: claims.userId,
      updated_at: new Date().toISOString(),
    };
    if (isOrgVerbatim && verbatimRows.length === 0) {
      const headingCount = (extractedText.match(/(?:^|\n)\s*MPS\s*[A-Za-z0-9.]+\s*[–-]/gi) ?? []).length;
      const kucTextCandidate = sanitizeForPostgresText(
        String((kucResult.kuc_classification as Record<string, unknown> | null)?.extracted_text ?? ''),
      ).trim();
      completionUpdate.processing_error =
        `VERBATIM source index warning: no extractable MPS intent statements were indexed; chunk fallback remains available. ` +
        `(chars=${extractedText.length}, mps_headings=${headingCount}, ai_summary_chars=${aiParse.text?.length ?? 0}, ` +
        `kuc_success=${kucResult.success}, kuc_error=${kucResult.error ?? 'none'}, kuc_chars=${kucTextCandidate.length}, ` +
        `kuc_base_url_present=${KUC_BASE_URL ? 'yes' : 'no'})`;
    }

    const { error: completionError } = await supabase
      .from('mmm_subject_knowledge_documents')
      .update(completionUpdate)
      .eq('id', documentId);

    if (completionError) {
      const lower = (completionError.message ?? '').toLowerCase();
      if (lower.includes('invalid input syntax for type json')) {
        const { error: slimCompletionError } = await supabase
          .from('mmm_subject_knowledge_documents')
          .update({
            ...completionUpdate,
            kuc_classification: null,
          })
          .eq('id', documentId);
        if (slimCompletionError) {
          throw new Error(`final-document-update(json-slim-fallback): ${slimCompletionError.message}`);
        }
      } else {
        throw new Error(`final-document-update: ${completionError.message}`);
      }
    }

    return {
      document_id: documentId,
      chunk_count: chunkPayloads.length,
      kuc_success: kucResult.success,
      kuc_fallback: kucResult.fallback,
      kuc_error: kucResult.error,
    };
  } catch (error) {
    const message = sanitizeForPostgresText(error instanceof Error ? error.message : 'Unexpected reprocess error.');
    await supabase
      .from('mmm_subject_knowledge_documents')
      .update({
        processing_status: 'failed',
        processing_error: message,
        updated_by: claims.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    return {
      success: false,
      error: message,
      document_id: documentId,
    };
  }
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

  let claims: ReprocessClaims;
  try {
    claims = await validateJWT(req, supabase);
  } catch (response) {
    return response as Response;
  }

  let body: ReprocessBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const documentId = (body.document_id ?? '').trim();
  if (!documentId) {
    return jsonResponse({ error: 'document_id is required' }, 400);
  }

  const { data: doc, error: docError } = await supabase
    .from('mmm_subject_knowledge_documents')
    .select('id,organisation_id,title,file_name,mime_type,file_size,storage_bucket,storage_path,document_role,scope_type,upload_notes')
    .eq('id', documentId)
    .eq('organisation_id', claims.orgId)
    .is('archived_at', null)
    .maybeSingle();

  if (docError || !doc) {
    return jsonResponse({ error: docError?.message ?? 'Document not found.' }, 404);
  }

  // Organisation-context sources are allowed for standard admins as well; global subject knowledge remains superuser-only.
  const role = (claims.role ?? '').trim().toUpperCase();
  const isSuperuser = ['ADMIN', 'OWNER', 'SUPERUSER', 'BACKOFFICE_ADMIN', 'LEAD_AUDITOR'].includes(role);
  const isOrgContext = (doc.scope_type ?? '').toLowerCase() === 'organisation_context';
  if (!isSuperuser && !isOrgContext) {
    return jsonResponse(
      {
        error: 'Insufficient role for subject knowledge reprocess',
        actual: claims.role,
      },
      403,
    );
  }

  await supabase
    .from('mmm_subject_knowledge_documents')
    .update({
      processing_status: 'processing',
      processing_error: null,
      updated_by: claims.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  const background = body.background === true;
  if (background) {
    // For organisation-context uploads, return immediately with durable `processing` state and
    // finish the heavy pipeline in the worker so the browser does not have to keep the request
    // open just to persist follow-up mode context.
    // deno-lint-ignore no-explicit-any
    (EdgeRuntime as any).waitUntil(runReprocessPipeline({
      supabase,
      doc: doc as SubjectKnowledgeDocument,
      claims,
      documentId,
    }));
    return jsonResponse(
      {
        accepted: true,
        status: 'processing',
        document_id: documentId,
      },
      202,
    );
  }

  const result = await runReprocessPipeline({
    supabase,
    doc: doc as SubjectKnowledgeDocument,
    claims,
    documentId,
  });
  return jsonResponse(result, 200);
});
