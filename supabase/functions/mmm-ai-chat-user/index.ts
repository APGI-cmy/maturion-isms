/**
 * Supabase Edge Function: mmm-ai-chat-user
 *
 * Route: POST /api/ai/chat-user
 * Purpose: End-user contextual AI assistant route (separate from admin /api/ai/chat).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';
import { callAimc } from '../_shared/mmm-aimc-client.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const AIMC_BASE_URL = (
  Deno.env.get('AIMC_BASE_URL') ??
  Deno.env.get('AI_GATEWAY_URL') ??
  ''
).replace(/\/+$/, '');
const AIMC_SERVICE_TOKEN = Deno.env.get('AIMC_SERVICE_TOKEN') ?? '';

async function tryOpenAICompatChat(message: string): Promise<{ reply: string } | null> {
  if (!AIMC_BASE_URL || !AIMC_SERVICE_TOKEN) {
    return null;
  }

  const endpoint = `${AIMC_BASE_URL}/v1/chat/completions`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${AIMC_SERVICE_TOKEN}`,
    },
    body: JSON.stringify({
      model: 'auto',
      messages: [{ role: 'user', content: message }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as Record<string, unknown>;
  const choices = (payload.choices as Array<Record<string, unknown>> | undefined) ?? [];
  const first = choices[0];
  const msg = (first?.message as Record<string, unknown> | undefined) ?? {};
  const content = (msg.content as string | undefined) ?? '';
  if (!content.trim()) {
    return null;
  }
  return { reply: content };
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

  let body: {
    message?: string;
    conversation_id?: string;
    context?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const message = body.message?.trim();
  if (!message) {
    return jsonResponse({ error: 'message is required' }, 400);
  }

  const aimcResult = await callAimc(
    'chat',
    claims.orgId,
    claims.userId,
    {
      message,
      conversation_id: body.conversation_id ?? null,
      assistant_scope: 'end_user',
      ...(body.context ?? {}),
    },
  );

  if (aimcResult.fallback) {
    return jsonResponse(
      {
        fallback: true,
        reason: aimcResult.fallback_reason,
        message: 'AI features temporarily unavailable',
      },
      503,
    );
  }

  if (!aimcResult.success) {
    const err = (aimcResult.error ?? '').toLowerCase();
    if (err.includes('http 404')) {
      const openAiCompat = await tryOpenAICompatChat(message);
      if (openAiCompat) {
        return jsonResponse(
          {
            reply: openAiCompat.reply,
            request_id: `compat-${crypto.randomUUID()}`,
            compat_fallback: true,
          },
          200,
        );
      }
    }
    return jsonResponse({ error: 'AIMC call failed', detail: aimcResult.error }, 502);
  }

  const aiData = (aimcResult.data as Record<string, unknown>) ?? {};
  await supabase.from('mmm_ai_interactions').insert({
    organisation_id: claims.orgId,
    actor_id: claims.userId,
    interaction_type: 'USER_CHAT',
    operation: 'chat',
    aimc_request_id: aimcResult.request_id,
    model_id: (aiData.model_id as string | undefined) ?? 'aimc-routed',
    model_version: (aiData.model_version as string | undefined) ?? null,
    confidence: (aiData.confidence as number | undefined) ?? null,
    created_at: new Date().toISOString(),
  }).catch((err: Error) => console.warn(`[mmm-ai-chat-user] ai_interactions warn: ${err.message}`));

  return jsonResponse(
    {
      reply: (aiData.reply as string | undefined) ?? (aiData.message as string | undefined) ?? '',
      request_id: aimcResult.request_id,
    },
    200,
  );
});
