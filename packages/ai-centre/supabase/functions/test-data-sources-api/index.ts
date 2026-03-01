/**
 * test-data-sources-api — AIMC Edge Function
 *
 * AIMC Migration: Migrated from apps/maturion-maturity-legacy/supabase/functions/test-data-sources-api
 * Reference: governance/aimc/CL3_5_DATA_MODEL_SPEC.md §6 (Edge Function Interface Summary)
 * Wave: CL-3.5 — AIMC Data Sources Registry
 *
 * Changes from legacy:
 *   - Table: data_sources → ai_data_sources
 *   - Column: organization_id (American) → organisation_id (British)
 *   - Column: sync_status → status
 *   - Column: last_sync_at → last_synced_at
 *   - Removed: data_source_sync_logs and api_usage_log references (not in AIMC schema)
 *   - Returns: { sources: [{ id, status, last_tested }] } per CL3_5_DATA_MODEL_SPEC.md §6
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { method } = req;

    console.log(`test-data-sources-api: ${method} request`);

    // Handle GET — list all configured ai_data_sources and report connectivity status
    if (method === 'GET') {
      const { data: dataSources, error } = await supabase
        .from('ai_data_sources')
        .select('id, source_name, source_type, status, is_active, last_synced_at, organisation_id')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ai_data_sources:', error);
        return new Response(
          JSON.stringify({ error: error.message, sources: [] }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      // Map records to connectivity status format per CL3_5_DATA_MODEL_SPEC.md §6
      const sources = (dataSources ?? []).map((ds) => ({
        id: ds.id,
        source_name: ds.source_name,
        source_type: ds.source_type,
        status: ds.status,
        is_active: ds.is_active,
        last_tested: ds.last_synced_at ?? null,
      }));

      return new Response(
        JSON.stringify({ sources }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Handle POST — test connectivity for a specific source or all sources
    if (method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const { source_id } = body;

      let query = supabase
        .from('ai_data_sources')
        .select('id, source_name, source_type, status, is_active, last_synced_at, connection_config');

      if (source_id) {
        query = query.eq('id', source_id) as typeof query;
      }

      const { data: dataSources, error } = await query;

      if (error) {
        console.error('Error fetching ai_data_sources for connectivity test:', error);
        return new Response(
          JSON.stringify({ error: error.message, sources: [] }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      // Perform a lightweight connectivity check per source
      const sources = await Promise.all(
        (dataSources ?? []).map(async (ds) => {
          let connectivity: 'ok' | 'error' | 'unknown' = 'unknown';

          // Basic connectivity check — verify source is in an operational state
          if (ds.status === 'active' && ds.is_active) {
            connectivity = 'ok';
          } else if (ds.status === 'error') {
            connectivity = 'error';
          }

          return {
            id: ds.id,
            source_name: ds.source_name,
            source_type: ds.source_type,
            status: ds.status,
            connectivity,
            last_tested: new Date().toISOString(),
          };
        }),
      );

      return new Response(
        JSON.stringify({ sources }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Unexpected error in test-data-sources-api:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
