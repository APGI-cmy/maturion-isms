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
  buildChunkPayloads,
  isTextLikeMimeType,
  normalizeSubjectDocumentRole,
  requireSubjectKnowledgeSuperuser,
  sha256Hex,
} from '../_shared/mmm-subject-knowledge.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

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
};

function fallbackContentFromMetadata(body: UploadBody): string {
  const parts = [
    `Subject knowledge upload: ${body.title ?? body.file_name ?? 'Untitled document'}`,
    `MIME type: ${body.mime_type ?? 'unknown'}`,
    body.upload_notes ? `Uploader notes: ${body.upload_notes}` : '',
  ].filter(Boolean);
  return parts.join('\n');
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

  if (!fileName || !storageBucket || !storagePath || !title) {
    return jsonResponse(
      { error: 'title, file_name, storage_bucket, and storage_path are required.' },
      400,
    );
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

    let extractedText = '';
    if (isTextLikeMimeType(mimeType)) {
      extractedText = (await fileBlob.text()).trim();
    }
    if (!extractedText) {
      extractedText = fallbackContentFromMetadata(body);
    }

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
        throw new Error(chunkError.message || 'Unable to persist ai_knowledge chunks.');
      }
    }

    const updatePayload: Record<string, unknown> = {
      processing_status: 'completed',
      processing_error: null,
      chunk_count: chunkPayloads.length,
      content_hash: fileHash,
      kuc_upload_id: kucResult.kuc_classification?.upload_id ?? null,
      kuc_parse_job_id: kucResult.kuc_classification?.parse_job_id ?? null,
      kuc_classification: kucResult.kuc_classification ?? null,
      updated_by: claims.userId,
      updated_at: new Date().toISOString(),
    };

    if (!kucResult.success && !kucResult.fallback) {
      updatePayload.processing_error = `KUC upload failed: ${kucResult.error ?? 'Unknown KUC error'}`;
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
