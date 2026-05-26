/**
 * Supabase Edge Function: mmm-subject-knowledge-list
 *
 * Route: POST /api/dmc/subject-knowledge/list
 * Purpose: Canonical DMC inventory endpoint backed by MMM/AIMC knowledge schema.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';
import { requireSubjectKnowledgeSuperuser } from '../_shared/mmm-subject-knowledge.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type SubjectKnowledgeDocument = {
  id: string;
  organisation_id: string;
  title: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  storage_bucket: string;
  storage_path: string;
  document_role: string;
  scope_type: string;
  processing_status: string;
  chunk_count: number;
  tags: unknown;
  upload_notes: string | null;
  created_at: string;
  updated_at: string;
  kuc_upload_id: string | null;
  kuc_parse_job_id: string | null;
  kuc_classification: unknown;
};

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

  const { data, error } = await supabase
    .from('mmm_subject_knowledge_documents')
    .select('id,organisation_id,title,file_name,mime_type,file_size,storage_bucket,storage_path,document_role,scope_type,processing_status,chunk_count,tags,upload_notes,created_at,updated_at,kuc_upload_id,kuc_parse_job_id,kuc_classification')
    .eq('organisation_id', claims.orgId)
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message || 'Failed to load subject knowledge inventory.' }, 500);
  }

  const documents = (data ?? []) as SubjectKnowledgeDocument[];
  const stats = {
    total_documents: documents.length,
    processing: documents.filter((doc) => doc.processing_status === 'processing').length,
    pending: documents.filter((doc) => doc.processing_status === 'pending').length,
    completed: documents.filter((doc) => doc.processing_status === 'completed').length,
    failed: documents.filter((doc) => doc.processing_status === 'failed').length,
    total_chunks: documents.reduce((sum, doc) => sum + (doc.chunk_count ?? 0), 0),
  };

  return jsonResponse({ documents, stats }, 200);
});
