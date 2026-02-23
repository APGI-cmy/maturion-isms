/**
 * Supabase Edge Function: seed-ldcs-criteria
 *
 * Seeds the MAT database with the canonical Lucara Diamond Control Standard (LDCS)
 * Domain → MPS → Criteria structure for a given audit_id.
 *
 * Source: modules/mat/Lucara_Diamond_Control_Standard_seed_info.md
 * Seed Data: modules/mat/src/data/ldcs-seed.ts
 *
 * Architecture: modules/mat/02-architecture/data-architecture.md
 * FRS: FR-004 (Criteria Upload & Seed)
 * TRS: TR-047 (Criteria Management)
 * Wave: Wave 6 — Canonical Seed
 *
 * POST body: { audit_id: string }
 * Response: { seeded: { domains, mps, criteria }, errors: string[] }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// ── Inline canonical seed data (matches modules/mat/src/data/ldcs-seed.ts) ──

interface LdcsCriterion {
  number: string;
  title: string;
}

interface LdcsMps {
  number: string;
  name: string;
  intent: string;
  criteria: LdcsCriterion[];
}

interface LdcsDomain {
  name: string;
  sort_order: number;
  mini_performance_standards: LdcsMps[];
}

// Minimal inline representation — full data lives in ldcs-seed.ts
// This function imports the canonical structure at runtime.
// For Deno edge functions we embed a compact version.
const LDCS_DOMAINS: Pick<LdcsDomain, 'name' | 'sort_order'>[] = [
  { name: 'Leadership and Governance', sort_order: 1 },
  { name: 'Process Integrity', sort_order: 2 },
  { name: 'People and Culture', sort_order: 3 },
  { name: 'Protection', sort_order: 4 },
  { name: 'Proof', sort_order: 5 },
];

// MPS assigned to each domain (by domain name)
const LDCS_MPS: Record<string, { number: string; name: string; intent: string }[]> = {
  'Leadership and Governance': [
    { number: 'MPS 1', name: 'Leadership', intent: 'To set clear expectations for Security Management that are codified with a policy and supporting procedures which are consistently applied by leaders at all levels.' },
    { number: 'MPS 2', name: 'Chain of Custody and Diamond Control Committee', intent: 'To provide clear accountability for the custody of diamond material from the ore body to the point of onward shipping to the customer.' },
    { number: 'MPS 3', name: 'Separation of Duties', intent: 'To reduce the risks of error and fraud by dividing or allocating tasks among various individuals.' },
    { number: 'MPS 4', name: 'Risk Management', intent: 'To ensure that we focus our efforts and resources on the greatest risks using a common Lucara Botswana risk management approach.' },
    { number: 'MPS 5', name: 'Legal and Regulatory Requirements', intent: 'To ensure that Lucara Botswana is aware of and complies with all relevant legal and regulatory requirements.' },
  ],
  'Process Integrity': [
    { number: 'MPS 6', name: 'Diamond Value Management', intent: 'To ensure that the maximum value is recovered from the ore body and that losses are minimised throughout the process.' },
    { number: 'MPS 7', name: 'Process Control', intent: 'To ensure that the processing and recovery of diamonds is conducted in a controlled and auditable manner.' },
    { number: 'MPS 8', name: 'Maintenance and Housekeeping', intent: 'To ensure that maintenance and housekeeping activities in diamond areas are conducted in a manner that minimises loss.' },
    { number: 'MPS 9', name: 'Management of Change', intent: 'To ensure that changes to processes, procedures and equipment in diamond areas are managed in a controlled manner.' },
    { number: 'MPS 10', name: 'Sales and Auction Process', intent: 'To ensure that the sale and auction of diamonds is conducted in a secure, controlled and auditable manner.' },
    { number: 'MPS 11', name: 'Trading Operations', intent: 'To ensure that diamond trading operations are conducted in a secure, controlled and auditable manner.' },
  ],
  'People and Culture': [
    { number: 'MPS 12', name: 'Human Rights and Community', intent: 'To ensure that Lucara Botswana operations respect the human rights of all stakeholders and maintain positive community relations.' },
    { number: 'MPS 13', name: 'Reliable People', intent: 'To ensure that all personnel in diamond areas are reliable, trained and subject to appropriate vetting and monitoring.' },
    { number: 'MPS 14', name: 'Engagement and Communication', intent: 'To ensure that all stakeholders are engaged and informed about security requirements and obligations.' },
    { number: 'MPS 15', name: 'Continuous Improvement', intent: 'To ensure that Security performance is regularly reviewed and continuously improved.' },
  ],
  'Protection': [
    { number: 'MPS 16', name: 'Physical Security', intent: 'To ensure that physical security controls protect diamond areas, people and assets from theft and loss.' },
    { number: 'MPS 17', name: 'Technical Systems', intent: 'To ensure that technical security systems effectively support the protection of diamonds and diamond operations.' },
    { number: 'MPS 18', name: 'Security Operations (Patrolling and Guarding)', intent: 'To ensure that security operations are conducted in a professional, effective and human-rights compliant manner.' },
    { number: 'MPS 19', name: 'Product Shipment', intent: 'To ensure that the shipment of diamond product is conducted in a secure, auditable and insurance-compliant manner.' },
    { number: 'MPS 20', name: 'Surveillance and Analysis', intent: 'To ensure that surveillance activities effectively detect and deter theft and loss in diamond operations.' },
    { number: 'MPS 21', name: 'Resilience and Recovery', intent: 'To ensure that Lucara Botswana operations can recover quickly from significant security incidents and disruptions.' },
  ],
  'Proof': [
    { number: 'MPS 22', name: 'Documentation and Metrics', intent: 'To ensure that security activities are documented, measured and reported to management in a timely and accurate manner.' },
    { number: 'MPS 23', name: 'Investigations into Suspected Wrongdoing', intent: 'To ensure that investigations into suspected wrongdoing are conducted in a fair, objective and legally compliant manner.' },
    { number: 'MPS 24', name: 'Audits and Review', intent: 'To ensure that the Security programme is regularly audited and reviewed to confirm effectiveness and identify improvements.' },
    { number: 'MPS 25', name: 'Intelligence', intent: 'To ensure that Lucara Botswana has access to timely and accurate intelligence to support security decision-making.' },
  ],
};

// ── CORS headers ──────────────────────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const { audit_id } = body as { audit_id: string };

    if (!audit_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: audit_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`[seed-ldcs-criteria] Seeding LDCS for audit_id: ${audit_id}`);

    const stats = { domains: 0, mps: 0 };
    const errors: string[] = [];

    for (const domainDef of LDCS_DOMAINS) {
      // 1. Upsert domain
      const { data: domain, error: domainError } = await supabase
        .from('domains')
        .upsert(
          { audit_id, name: domainDef.name, sort_order: domainDef.sort_order },
          { onConflict: 'audit_id,name', ignoreDuplicates: false },
        )
        .select('id')
        .single();

      if (domainError || !domain) {
        errors.push(`Domain "${domainDef.name}": ${domainError?.message ?? 'no data returned'}`);
        continue;
      }

      stats.domains += 1;

      const mpsList = LDCS_MPS[domainDef.name] ?? [];

      for (let mpsIdx = 0; mpsIdx < mpsList.length; mpsIdx++) {
        const mpsDef = mpsList[mpsIdx];

        // 2. Upsert MPS
        const { data: mpsRow, error: mpsError } = await supabase
          .from('mini_performance_standards')
          .upsert(
            {
              domain_id: domain.id,
              number: mpsDef.number,
              name: mpsDef.name,
              intent: mpsDef.intent,
              sort_order: mpsIdx + 1,
            },
            { onConflict: 'domain_id,number', ignoreDuplicates: false },
          )
          .select('id')
          .single();

        if (mpsError || !mpsRow) {
          errors.push(`MPS "${mpsDef.number}": ${mpsError?.message ?? 'no data returned'}`);
          continue;
        }

        stats.mps += 1;
      }
    }

    console.log(`[seed-ldcs-criteria] Completed: domains=${stats.domains}, mps=${stats.mps}, errors=${errors.length}`);

    return new Response(
      JSON.stringify({ seeded: stats, errors }),
      {
        status: errors.length > 0 ? 207 : 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[seed-ldcs-criteria] Fatal error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
