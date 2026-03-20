/**
 * process-document-v2 — Pipeline 2 (Knowledge Ingestion) Edge Function
 *
 * Wave    : DCKIS-IMPL-002 (carried from DCKIS-IMPL-001)
 * Test IDs: T-KU-007, T-KU-008, T-KU-011, T-KU-012
 * Path    : packages/ai-centre/supabase/functions/process-document-v2/index.ts
 *
 * Replaces the legacy process-document Edge Function with:
 * - Smart Chunk Reuse: skip re-chunking if chunked_from_tester flag is set (T-KU-007)
 * - Scope isolation: does NOT write to criteria, domains, or mini_performance_standards (T-KU-008)
 * - Chunk-splitting with CHUNK_SIZE=2000 and CHUNK_OVERLAP=200 (T-KU-011)
 * - Embedding API call with 1536-dimension specification (T-KU-012)
 *
 * HARD CONSTRAINT (ADR-005):
 * This function is Pipeline 2 ONLY. It MUST NOT reference or write to:
 *   - criteria table
 *   - domains table
 *   - mini_performance_standards table
 * It writes exclusively to ai_knowledge.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// ─── Configuration Constants ──────────────────────────────────────────────────

/** Default chunk size in characters (matches DocumentChunkTester default) */
const CHUNK_SIZE = 2000;

/** Default chunk overlap in characters (matches DocumentChunkTester default) */
const CHUNK_OVERLAP = 200;

/** Embedding vector dimensions — must match ai_knowledge.embedding vector(1536) column */
const EMBEDDING_DIM = 1536;

/** Maximum number of chunks to process in a single invocation */
const MAX_CHUNKS_PER_INVOCATION = 500;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProcessDocumentV2Request {
  /** The text content of the document to process */
  content: string;
  /** AIMC source taxonomy value (e.g. 'ISO27001', 'NIST', 'general') */
  source: string;
  /** Original document file name for source_document_name column */
  source_document_name?: string;
  /** Organisation ID for RLS scoping */
  organisation_id: string;
  /**
   * Smart Chunk Reuse flag (T-KU-007):
   * When true, `pre_validated_chunks` contains pre-chunked text from DocumentChunkTester.
   * The function skips its own chunking step and uses the provided chunks directly.
   */
  chunked_from_tester?: boolean;
  /**
   * Pre-validated chunks from DocumentChunkTester.
   * Only used when chunked_from_tester is true.
   */
  pre_validated_chunks?: string[];
}

interface ChunkRecord {
  index: number;
  content: string;
  chunkSize: number;
  chunkOverlap: number;
}

// ─── Chunk Splitting ──────────────────────────────────────────────────────────

/**
 * Split document text into overlapping chunks.
 * Uses CHUNK_SIZE=2000 and CHUNK_OVERLAP=200 (T-KU-011).
 */
function chunkText(
  text: string,
  chunkSize: number = CHUNK_SIZE,
  chunkOverlap: number = CHUNK_OVERLAP,
): ChunkRecord[] {
  if (!text || !text.trim()) return [];

  const chunks: ChunkRecord[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length && index < MAX_CHUNKS_PER_INVOCATION) {
    const end = Math.min(start + chunkSize, text.length);
    const content = text.slice(start, end);
    chunks.push({
      index,
      content,
      chunkSize,
      chunkOverlap,
    });
    index += 1;
    start += chunkSize - chunkOverlap;
    if (start >= text.length) break;
  }

  return chunks;
}

// ─── Embedding ────────────────────────────────────────────────────────────────

/**
 * Generate an embedding vector for a text chunk.
 * Uses the OpenAI text-embedding-3-small model which produces 1536-dimension vectors
 * matching the ai_knowledge.embedding vector(1536) column (T-KU-012).
 */
async function createEmbedding(text: string): Promise<number[]> {
  const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: EMBEDDING_DIM, // 1536 dimensions matching vector(1536) column
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenAI embedding API request failed: ${response.status} ${response.statusText} — ${errorBody}`,
    );
  }

  const result = await response.json() as {
    data: Array<{ embedding: number[]; index: number }>;
  };

  const embedding = result.data[0]?.embedding;
  if (!embedding || embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Expected ${EMBEDDING_DIM}-dimension embedding, received ${embedding?.length ?? 0} dimensions`,
    );
  }

  return embedding;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  let body: ProcessDocumentV2Request;
  try {
    body = await req.json() as ProcessDocumentV2Request;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  const {
    content,
    source,
    source_document_name,
    chunked_from_tester = false,
    pre_validated_chunks,
  } = body;

  // Validate required fields (organisation_id resolved server-side from JWT)
  if (!content || !source) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: content, source' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  // Validate Authorization header and resolve organisation_id server-side
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Authorization header with Bearer token is required' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: 'Supabase configuration missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  // Use caller's JWT to authenticate (validates token; prevents arbitrary org writes)
  const userToken = authHeader.replace('Bearer ', '');
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabaseUser = createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });

  // Resolve organisation_id from profiles — trusted server-side source
  const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !user?.id) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single();
  const organisation_id = profile?.organisation_id as string | undefined;
  if (profileError || !organisation_id) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: organisation_id could not be resolved from user profile' }),
      { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }

  try {
    let chunks: string[];

    /**
     * Smart Chunk Reuse (T-KU-007):
     * If chunked_from_tester is true, skip re-chunking and use pre-validated chunks
     * directly from DocumentChunkTester. This avoids redundant processing for
     * documents that have already had their chunk boundaries validated.
     */
    if (chunked_from_tester && pre_validated_chunks && pre_validated_chunks.length > 0) {
      // Smart Chunk Reuse path: use pre-validated chunks from DocumentChunkTester
      // Enforce the same max-chunk limit as the standard path to prevent excessive cost.
      if (pre_validated_chunks.length > MAX_CHUNKS_PER_INVOCATION) {
        return new Response(
          JSON.stringify({
            error: `Too many pre_validated_chunks provided: maximum allowed is ${MAX_CHUNKS_PER_INVOCATION}`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
      }
      chunks = pre_validated_chunks;
    } else {
      // Standard path: split the document text into chunks
      const chunkRecords = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP);
      chunks = chunkRecords.map((c) => c.content);
    }

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkContent = chunks[i];
      if (!chunkContent) continue;

      try {
        // Generate embedding for this chunk (1536-dimension vector, T-KU-012)
        const embedding = await createEmbedding(chunkContent);

        // Insert chunk into ai_knowledge table
        // SCOPE ISOLATION (T-KU-008): ONLY writes to ai_knowledge
        // NEVER writes to: criteria, domains, mini_performance_standards
        const { error: insertError } = await supabaseAdmin
          .from('ai_knowledge')
          .insert({
            organisation_id,
            source,
            content: chunkContent,
            embedding,
            source_document_name: source_document_name ?? null,
            chunk_index: i,
            // Store the configured chunking parameters used during ingestion.
            // For tester-provided chunks, these match the tester's configuration.
            chunk_size: CHUNK_SIZE,
            chunk_overlap: CHUNK_OVERLAP,
            approval_status: 'pending',
          });

        if (insertError) {
          errors.push(`Chunk ${i}: ${insertError.message}`);
        } else {
          successCount += 1;
        }
      } catch (chunkError) {
        const message =
          chunkError instanceof Error ? chunkError.message : String(chunkError);
        errors.push(`Chunk ${i} embedding/insert failed: ${message}`);
      }
    }

    const response = {
      success: errors.length === 0,
      chunks_processed: chunks.length,
      chunks_inserted: successCount,
      chunked_from_tester,
      errors: errors.length > 0 ? errors : undefined,
    };

    return new Response(JSON.stringify(response), {
      status: errors.length > 0 && successCount === 0 ? 500 : 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: `Processing failed: ${message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }
});
