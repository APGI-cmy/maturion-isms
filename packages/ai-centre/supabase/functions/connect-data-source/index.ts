/**
 * connect-data-source — AIMC Edge Function
 *
 * AIMC Migration: Migrated from apps/maturion-maturity-legacy/supabase/functions/connect-data-source
 * Reference: governance/aimc/CL3_5_DATA_MODEL_SPEC.md §6 (Edge Function Interface Summary)
 * Wave: CL-3.5 — AIMC Data Sources Registry
 *
 * Changes from legacy:
 *   - Table: data_sources → ai_data_sources
 *   - Column: organization_id (American) → organisation_id (British)
 *   - Column: sync_status → status
 *   - Column: last_sync_at → last_synced_at
 *   - Removed: data_source_sync_logs references (not in AIMC schema)
 *   - Payload: now accepts source_name, source_type, connection_config, credentials?
 *   - Returns: { id, status }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_SOURCE_TYPES = ['supabase', 'google_drive', 'sharepoint', 'api'] as const;
type SourceType = typeof VALID_SOURCE_TYPES[number];

interface ConnectDataSourceRequest {
  source_name: string;
  source_type: SourceType;
  connection_config: Record<string, unknown>;
  organisation_id: string;
  credentials?: string;
}

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

    const body: ConnectDataSourceRequest = await req.json();
    const { source_name, source_type, connection_config, credentials, organisation_id } = body;

    // Validate required fields (organisation_id is NOT NULL per CL3_5_DATA_MODEL_SPEC.md §3.1)
    if (!source_name || !source_type || !connection_config || !organisation_id) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: source_name, source_type, connection_config, organisation_id',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Validate source_type
    if (!VALID_SOURCE_TYPES.includes(source_type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid source_type. Must be one of: ${VALID_SOURCE_TYPES.join(', ')}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    console.log('Connecting data source:', { source_name, source_type, organisation_id });

    // Upsert the ai_data_sources record
    const insertPayload: Record<string, unknown> = {
      source_name,
      source_type,
      connection_config,
      organisation_id,
      status: 'inactive',
      is_active: false,
    };

    if (credentials) {
      insertPayload.credentials_encrypted = credentials;
    }

    const { data, error } = await supabase
      .from('ai_data_sources')
      .insert(insertPayload)
      .select('id, status')
      .single();

    if (error) {
      console.error('Error inserting ai_data_sources record:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create data source', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({ id: data.id, status: data.status }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error('Unexpected error in connect-data-source:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
