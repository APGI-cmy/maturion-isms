/**
 * query-data-source — AIMC Edge Function
 *
 * AIMC Migration: Migrated from apps/maturion-maturity-legacy/supabase/functions/query-data-source
 * Reference: governance/aimc/CL3_5_DATA_MODEL_SPEC.md §6 (Edge Function Interface Summary)
 * Wave: CL-3.5 — AIMC Data Sources Registry
 *
 * Changes from legacy:
 *   - Table: data_sources → ai_data_sources
 *   - Column: organization_id (American) → organisation_id (British)
 *   - Column: sync_status → status
 *   - Column: last_sync_at → last_synced_at
 *   - Removed: data_source_sync_logs and api_usage_log references (not in AIMC schema)
 *   - Payload: reads source_id (not data_source_id) per CL3_5_DATA_MODEL_SPEC.md §6
 *   - Returns: { results }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QueryDataSourceRequest {
  source_id: string;
  query: string;
  parameters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

// Allowlist of queryable AIMC tables for supabase-type sources.
// Using an allowlist prevents arbitrary table access (injection protection).
const ALLOWED_AIMC_TABLES = [
  'ai_data_sources',
  'ai_knowledge',
  'ai_memory',
  'ai_telemetry',
  'ai_episodic_memory',
  'ai_feedback_pipeline',
  'ai_knowledge_metadata',
] as const;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body: QueryDataSourceRequest = await req.json();
    const { source_id, query, parameters = {}, limit = 100, offset = 0 } = body;

    if (!source_id || !query) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: source_id, query' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    console.log('Executing query against ai_data_source:', { source_id, query });

    // Fetch data source configuration from ai_data_sources
    const { data: dataSource, error: fetchError } = await supabase
      .from('ai_data_sources')
      .select('id, source_type, connection_config, status, is_active, organisation_id')
      .eq('id', source_id)
      .single();

    if (fetchError || !dataSource) {
      return new Response(
        JSON.stringify({ error: 'Data source not found', details: fetchError?.message }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    if (!dataSource.is_active) {
      return new Response(
        JSON.stringify({ error: 'Data source is not active' }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Execute query against the data source
    // The query execution strategy varies by source_type
    let results: unknown[] = [];

    switch (dataSource.source_type) {
      case 'supabase': {
        // Validate query is an allowed table name before use (injection protection).
        // The query param specifies which AIMC table to read from.
        if (!(ALLOWED_AIMC_TABLES as readonly string[]).includes(query)) {
          return new Response(
            JSON.stringify({
              error: `Invalid query target. Must be one of: ${ALLOWED_AIMC_TABLES.join(', ')}`,
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            },
          );
        }
        const { data, error } = await supabase
          .from(query)
          .select('*')
          .range(offset, offset + limit - 1);

        if (!error && data) {
          results = data;
        }
        break;
      }
      case 'google_drive':
      case 'sharepoint':
      case 'api':
      default: {
        // For external sources, return a placeholder — actual integration
        // requires source-specific credentials and endpoints from connection_config
        results = [];
        break;
      }
    }

    return new Response(
      JSON.stringify({ results }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error('Unexpected error in query-data-source:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
