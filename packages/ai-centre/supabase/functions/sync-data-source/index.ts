/**
 * sync-data-source — AIMC Edge Function
 *
 * AIMC Migration: Migrated from apps/maturion-maturity-legacy/supabase/functions/sync-data-source
 * Reference: governance/aimc/CL3_5_DATA_MODEL_SPEC.md §6 (Edge Function Interface Summary)
 * Wave: CL-3.5 — AIMC Data Sources Registry
 *
 * Changes from legacy:
 *   - Table: data_sources → ai_data_sources
 *   - Column: organization_id (American) → organisation_id (British)
 *   - Column: sync_status → status (status set to 'syncing' on trigger)
 *   - Column: last_sync_at → last_synced_at
 *   - Removed: data_source_sync_logs references (not in AIMC schema)
 *   - Payload: reads source_id (not data_source_id) per CL3_5_DATA_MODEL_SPEC.md §6
 *   - Returns: { job_id }
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

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body = await req.json();
    const { source_id } = body;

    if (!source_id) {
      return new Response(
        JSON.stringify({ error: 'source_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    console.log(`Starting sync for ai_data_source: ${source_id}`);

    // Verify the data source exists in ai_data_sources
    const { data: dataSource, error: fetchError } = await supabase
      .from('ai_data_sources')
      .select('id, status, source_type')
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

    // Update status to 'syncing' in ai_data_sources
    const { error: updateError } = await supabase
      .from('ai_data_sources')
      .update({
        status: 'syncing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', source_id);

    if (updateError) {
      console.error('Error updating status to syncing:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update sync status', details: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Generate a job_id for status polling
    const job_id = crypto.randomUUID();

    console.log(`Sync job ${job_id} started for source ${source_id}`);

    return new Response(
      JSON.stringify({ job_id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error('Unexpected error in sync-data-source:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
