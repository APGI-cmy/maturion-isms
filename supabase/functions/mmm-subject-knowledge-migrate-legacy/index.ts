/**
 * Supabase Edge Function: mmm-subject-knowledge-migrate-legacy
 *
 * Route: POST /api/dmc/subject-knowledge/migrate-legacy
 * Purpose: idempotent legacy backfill from legacy ai_documents(+chunks) to
 *          MMM canonical tables: mmm_subject_knowledge_documents + ai_knowledge.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';
import {
  buildChunkPayloads,
  normalizeSubjectDocumentRole,
  requireSubjectKnowledgeSuperuser,
} from '../_shared/mmm-subject-knowledge.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const LEGACY_SUPABASE_URL = Deno.env.get('LEGACY_SUPABASE_URL') ?? '';
const LEGACY_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('LEGACY_SUPABASE_SERVICE_ROLE_KEY') ?? '';

type RequestBody = {
  limit?: number;
  dry_run?: boolean;
};

type LegacyDocument = {
  id: string;
  title: string | null;
  file_name: string | null;
  file_path: string | null;
  mime_type: string | null;
  file_size: number | null;
  document_type: string | null;
  tags: string[] | null;
  upload_notes: string | null;
  processing_status: string | null;
};

type LegacyChunk = {
  content: string;
  chunk_index: number | null;
};

async function createMigrationRun(
  supabase: ReturnType<typeof createClient>,
  organisationId: string,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('mmm_subject_knowledge_migration_runs')
    .insert({
      organisation_id: organisationId,
      started_by: userId,
      status: 'running',
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    throw new Error(error?.message ?? 'Unable to create migration run record.');
  }
  return data.id as string;
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
  if (!LEGACY_SUPABASE_URL || !LEGACY_SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse(
      {
        error:
          'LEGACY_SUPABASE_URL and LEGACY_SUPABASE_SERVICE_ROLE_KEY are required for automated migration.',
      },
      500,
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const legacy = createClient(LEGACY_SUPABASE_URL, LEGACY_SUPABASE_SERVICE_ROLE_KEY);

  let claims: { userId: string; orgId: string; role: string };
  try {
    claims = await validateJWT(req, supabase);
    requireSubjectKnowledgeSuperuser(claims.role);
  } catch (response) {
    return response as Response;
  }

  let body: RequestBody = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const limit = Math.max(1, Math.min(1000, Math.floor(body.limit ?? 500)));
  const dryRun = Boolean(body.dry_run);

  let runId = '';
  try {
    runId = await createMigrationRun(supabase, claims.orgId, claims.userId);
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 500);
  }

  const failures: Array<Record<string, unknown>> = [];
  let migratedCount = 0;
  let dedupedCount = 0;

  try {
    const { data: legacyDocs, error: legacyError } = await legacy
      .from('ai_documents')
      .select('id,title,file_name,file_path,mime_type,file_size,document_type,tags,upload_notes,processing_status')
      .is('deleted_at', null)
      .eq('context_level', 'global')
      .limit(limit);

    if (legacyError) {
      throw new Error(legacyError.message || 'Unable to read legacy ai_documents.');
    }

    const docs = (legacyDocs ?? []) as LegacyDocument[];
    if (!dryRun) {
      for (const doc of docs) {
        try {
          const fileName = (doc.file_name ?? doc.title ?? `legacy-${doc.id}`).trim();
          const title = (doc.title ?? fileName).trim();
          const mimeType = doc.mime_type ?? 'application/octet-stream';
          const fileSize = Number(doc.file_size ?? 0);
          const documentRole = normalizeSubjectDocumentRole(doc.document_type ?? 'knowledge_source');

          const { data: upsertedDoc, error: upsertError } = await supabase
            .from('mmm_subject_knowledge_documents')
            .upsert(
              {
                organisation_id: claims.orgId,
                uploaded_by: claims.userId,
                updated_by: claims.userId,
                title,
                file_name: fileName,
                mime_type: mimeType,
                file_size: fileSize,
                storage_bucket: 'mmm-subject-knowledge',
                storage_path: doc.file_path ?? `legacy/${doc.id}/${fileName}`,
                document_role: documentRole,
                scope_type: 'subject_knowledge',
                processing_status: 'completed',
                tags: doc.tags ?? [],
                upload_notes: doc.upload_notes ?? null,
                legacy_document_id: doc.id,
              },
              { onConflict: 'legacy_document_id' },
            )
            .select('id')
            .single();

          if (upsertError || !upsertedDoc?.id) {
            throw new Error(upsertError?.message ?? 'Upsert failed.');
          }

          const targetDocumentId = upsertedDoc.id as string;
          const { data: existingKnowledge } = await supabase
            .from('ai_knowledge')
            .select('id')
            .eq('document_id', targetDocumentId)
            .limit(1);

          if (existingKnowledge && existingKnowledge.length > 0) {
            dedupedCount += 1;
          }

          const { data: legacyChunks, error: chunkReadError } = await legacy
            .from('ai_document_chunks')
            .select('content,chunk_index')
            .eq('document_id', doc.id)
            .order('chunk_index', { ascending: true });

          if (chunkReadError) {
            throw new Error(chunkReadError.message || 'Unable to read legacy chunks.');
          }

          const chunks = (legacyChunks ?? []) as LegacyChunk[];
          const combinedContent =
            chunks.length > 0
              ? chunks.map((chunk) => chunk.content ?? '').join('\n')
              : `Legacy subject knowledge document: ${title}`;

          const payloads = await buildChunkPayloads({
            organisationId: claims.orgId,
            documentId: targetDocumentId,
            sourceDocumentName: fileName,
            source: 'legacy-ai-documents-migration',
            content: combinedContent,
            documentRole,
            domain: 'subject_knowledge',
            module: 'legacy',
            metadata: {
              legacy_document_id: doc.id,
              migrated_by: claims.userId,
              migration_run_id: runId,
            },
          });

          await supabase.from('ai_knowledge').delete().eq('document_id', targetDocumentId);
          if (payloads.length > 0) {
            const { error: insertError } = await supabase.from('ai_knowledge').insert(payloads);
            if (insertError) {
              throw new Error(insertError.message || 'Unable to insert migrated ai_knowledge rows.');
            }
          }

          await supabase
            .from('mmm_subject_knowledge_documents')
            .update({
              chunk_count: payloads.length,
              processing_status: 'completed',
              processing_error: null,
              updated_by: claims.userId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', targetDocumentId);

          migratedCount += 1;
        } catch (error) {
          failures.push({
            legacy_document_id: doc.id,
            error: error instanceof Error ? error.message : 'Unknown migration error',
          });
        }
      }
    }

    const status = failures.length > 0 ? 'failed' : 'completed';
    await supabase
      .from('mmm_subject_knowledge_migration_runs')
      .update({
        status,
        scanned_count: docs.length,
        migrated_count: migratedCount,
        deduped_count: dedupedCount,
        failed_count: failures.length,
        failure_report: failures,
        completed_at: new Date().toISOString(),
      })
      .eq('id', runId);

    return jsonResponse(
      {
        migration_run_id: runId,
        dry_run: dryRun,
        scanned_count: docs.length,
        migrated_count: migratedCount,
        deduped_count: dedupedCount,
        failed_count: failures.length,
        failures,
      },
      200,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Legacy migration failed.';
    await supabase
      .from('mmm_subject_knowledge_migration_runs')
      .update({
        status: 'failed',
        failure_report: [{ error: message }],
        failed_count: 1,
        completed_at: new Date().toISOString(),
      })
      .eq('id', runId);

    return jsonResponse({ error: message, migration_run_id: runId }, 500);
  }
});
