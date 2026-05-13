// deno-lint-ignore-file no-explicit-any

type SupabaseClientLike = {
  from: (table: string) => any;
};

type ProposedDomain = {
  name: string;
  code: string;
  mps: Array<{
    name: string;
    code: string;
    intent_statement: string;
    criteria: Array<{
      name: string;
      code: string;
      maturity_level_target: number;
    }>;
  }>;
};

export function buildFallbackFrameworkStructure(sourceType = 'framework'): ProposedDomain[] {
  const label = sourceType === 'HYBRID'
    ? 'Hybrid'
    : sourceType === 'VERBATIM'
    ? 'Uploaded'
    : 'Generated';

  return [
    {
      name: `${label} Governance Domain`,
      code: 'GOV',
      mps: [
        {
          name: `${label} Framework Management`,
          code: 'GOV_MGMT',
          intent_statement: 'Maintain a structured maturity framework with reviewable criteria.',
          criteria: [
            {
              name: `${label} framework criteria are defined and reviewable`,
              code: 'GOV_MGMT_C01',
              maturity_level_target: 3,
            },
          ],
        },
      ],
    },
  ];
}

export async function insertProposedFrameworkStructure(
  supabase: SupabaseClientLike,
  frameworkId: string,
  proposedDomains: ProposedDomain[],
): Promise<number> {
  let domainCount = 0;

  for (let di = 0; di < proposedDomains.length; di++) {
    const domain = proposedDomains[di];
    const { data: proposedDomain, error: domError } = await supabase
      .from('mmm_proposed_domains')
      .insert({
        framework_id: frameworkId,
        name: domain.name,
        code: domain.code,
        sort_order: di + 1,
        source: 'AI',
      })
      .select()
      .single();

    if (domError || !proposedDomain) {
      throw new Error(`proposed_domain_insert_failed:${domError?.message ?? 'unknown'}`);
    }
    domainCount++;

    for (let mi = 0; mi < domain.mps.length; mi++) {
      const mps = domain.mps[mi];
      const { data: proposedMPS, error: mpsError } = await supabase
        .from('mmm_proposed_mps')
        .insert({
          proposed_domain_id: proposedDomain.id,
          name: mps.name,
          code: mps.code,
          sort_order: mi + 1,
          intent_statement: mps.intent_statement,
          source: 'AI',
        })
        .select()
        .single();

      if (mpsError || !proposedMPS) {
        throw new Error(`proposed_mps_insert_failed:${mpsError?.message ?? 'unknown'}`);
      }

      for (let ci = 0; ci < mps.criteria.length; ci++) {
        const criterion = mps.criteria[ci];
        const { error: critError } = await supabase
          .from('mmm_proposed_criteria')
          .insert({
            proposed_mps_id: proposedMPS.id,
            name: criterion.name,
            code: criterion.code,
            sort_order: ci + 1,
            maturity_level_target: criterion.maturity_level_target,
            source: 'AI',
          });

        if (critError) {
          throw new Error(`proposed_criteria_insert_failed:${critError.message}`);
        }
      }
    }
  }

  return domainCount;
}
