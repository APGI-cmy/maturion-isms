import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
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

  let body: { request_id?: string; domain_id?: string; message?: string; comment_type?: string } = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }
  if (!body.request_id || !body.domain_id || !body.message || !body.comment_type) {
    return jsonResponse({ error: 'request_id, domain_id, comment_type, and message are required.' }, 400);
  }

  const { error: insertError } = await supabase.from('mmm_domain_approval_comments').insert({
    request_id: body.request_id,
    organisation_id: claims.orgId,
    domain_id: body.domain_id,
    author_id: claims.userId,
    author_role: claims.role,
    comment_type: body.comment_type,
    message: body.message,
  });
  if (insertError) {
    return jsonResponse({ error: insertError.message || 'Failed to write domain approval comment.' }, 500);
  }

  await supabase.from('mmm_audit_logs').insert({
    action_type: 'DOMAIN_L2_COMMENT',
    actor_id: claims.userId,
    target_entity_type: 'domain',
    target_entity_id: body.domain_id,
    after_state: {
      request_id: body.request_id,
      comment_type: body.comment_type,
      message: body.message,
    },
  });

  return jsonResponse({ ok: true }, 200);
});
