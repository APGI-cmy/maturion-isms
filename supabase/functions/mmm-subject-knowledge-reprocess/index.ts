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
  sanitizeForPostgresJson,
  sanitizeForPostgresText,
  sha256Hex,
} from '../_shared/mmm-subject-knowledge.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const AI_GATEWAY_URL = (Deno.env.get('AI_GATEWAY_URL') ?? '').replace(/\/+$/, '');
const AI_PARSE_TIMEOUT_MS = 120_000;

type ReprocessBody = {
  document_id?: string;
};

async function tryAiGatewayParseText(params: {
  supabase: ReturnType<typeof createClient>;
  storageBucket: string;
  storagePath: string;
  tenantId: string;
}): Promise<string | null> {
  const { supabase, storageBucket, storagePath, tenantId } = params;
  if (!AI_GATEWAY_URL) return null;

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(storageBucket)
    .createSignedUrl(storagePath, 60 * 10);
  if (signedUrlError || !signedUrlData?.signedUrl) {
    return null;
  }

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
    if (!response.ok) return null;
    const parseResult = await response.json();
    return buildKnowledgeTextFromAiParseResult(parseResult);
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
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

  let claims: { userId: string; orgId: string; role: string };
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

    const aiParsedText = await tryAiGatewayParseText({
      supabase,
      storageBucket: doc.storage_bucket,
      storagePath: doc.storage_path,
      tenantId: claims.orgId,
    });

    const extractedText = await extractBestEffortText({
      mimeType: doc.mime_type,
      fileBlob,
      fallbackText: [
        `Subject knowledge document: ${doc.title ?? doc.file_name}`,
        `MIME type: ${doc.mime_type}`,
        doc.upload_notes ? `Uploader notes: ${doc.upload_notes}` : '',
      ].filter(Boolean).join('\n'),
      kucClassification: kucResult.kuc_classification,
      aiParsedText,
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
        tags: [],
        kuc_classification: kucResult.kuc_classification ?? null,
      },
    });

    await supabase.from('ai_knowledge').delete().eq('document_id', documentId);
    if (chunkPayloads.length > 0) {
      const { error: chunkError } = await supabase.from('ai_knowledge').insert(chunkPayloads);
      if (chunkError) {
        const lower = (chunkError.message ?? '').toLowerCase();
        // Retry path for strict json parser failures on legacy edge-case metadata payloads.
        if (lower.includes('invalid input syntax for type json')) {
          const slim = chunkPayloads.map((payload) => ({
            ...payload,
            metadata: { document_role: documentRole, retry_mode: 'json_slim_fallback' },
          }));
          const { error: retryError } = await supabase.from('ai_knowledge').insert(slim);
          if (retryError) {
            const retryLower = (retryError.message ?? '').toLowerCase();
            if (retryLower.includes('invalid input syntax for type json')) {
              // Final fallback: insert with empty metadata object.
              const minimal = chunkPayloads.map((payload) => ({
                ...payload,
                metadata: {},
              }));
              const { error: finalRetryError } = await supabase.from('ai_knowledge').insert(minimal);
              if (finalRetryError) {
                throw new Error(finalRetryError.message || 'Unable to persist ai_knowledge chunks (minimal json retry failed).');
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

    const fileHash = await sha256Hex(`${doc.file_name}:${doc.storage_bucket}:${doc.storage_path}:${doc.file_size ?? 0}`);
    const completionUpdate = {
      processing_status: 'completed',
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

    const { error: completionError } = await supabase
      .from('mmm_subject_knowledge_documents')
      .update(completionUpdate)
      .eq('id', documentId);

    if (completionError) {
      const lower = (completionError.message ?? '').toLowerCase();
      if (lower.includes('invalid input syntax for type json')) {
        // Final fallback: write completion state without KUC classification blob.
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

    return jsonResponse(
      {
        document_id: documentId,
        chunk_count: chunkPayloads.length,
        kuc_success: kucResult.success,
        kuc_fallback: kucResult.fallback,
        kuc_error: kucResult.error,
      },
      200,
    );
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

    return jsonResponse({ error: message, document_id: documentId }, 500);
  }
});
