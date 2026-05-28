// deno-lint-ignore-file no-explicit-any

type SupabaseClientLike = {
  from: (table: string) => any;
};

export type FallbackSourceType = 'VERBATIM' | 'GENERATED' | 'HYBRID';

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

export function toFallbackSourceType(value: unknown, fallback: FallbackSourceType): FallbackSourceType {
  return value === 'VERBATIM' || value === 'GENERATED' || value === 'HYBRID' ? value : fallback;
}

export function buildFallbackFrameworkStructure(sourceType: FallbackSourceType): ProposedDomain[] {
  const sourceDescriptor = sourceType === 'HYBRID'
    ? 'hybrid source'
    : sourceType === 'VERBATIM'
    ? 'uploaded source'
    : 'AI-generated source';

  return [
    {
      name: 'Leadership and Governance',
      code: 'LEADERSHIP_GOVERNANCE',
      mps: [
        {
          name: 'Leadership',
          code: 'MPS_001_LEADERSHIP',
          intent_statement:
            'Establish clear leadership accountability and governance ownership for the maturity programme.',
          criteria: [
            {
              name:
                `A documented governance charter defines leadership responsibilities and decision authority (${sourceDescriptor}).`,
              code: 'MPS_001_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Chain of Custody and Security Control Committee',
          code: 'MPS_002_CHAIN_OF_CUSTODY',
          intent_statement:
            'Define chain-of-custody and oversight controls for sensitive maturity evidence and decisions.',
          criteria: [
            {
              name:
                `A formal control committee reviews and records chain-of-custody checkpoints for key controls (${sourceDescriptor}).`,
              code: 'MPS_002_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Separation of Duties',
          code: 'MPS_003_SEPARATION_OF_DUTIES',
          intent_statement:
            'Prevent conflicts of interest by separating critical duties across governance and assurance roles.',
          criteria: [
            {
              name:
                `A documented duty-separation matrix assigns independent owner, reviewer, and approver roles (${sourceDescriptor}).`,
              code: 'MPS_003_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Risk Management',
          code: 'MPS_004_RISK_MANAGEMENT',
          intent_statement:
            'Embed risk identification, review, and mitigation into leadership governance routines.',
          criteria: [
            {
              name:
                `A risk register and mitigation cadence are formally reviewed by governance leadership (${sourceDescriptor}).`,
              code: 'MPS_004_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Legal and Regulatory Requirements',
          code: 'MPS_005_LEGAL_REGULATORY',
          intent_statement:
            'Ensure legal and regulatory obligations are captured, owned, and continuously tracked in governance.',
          criteria: [
            {
              name:
                `A compliance obligations register maps statutory requirements to accountable governance owners (${sourceDescriptor}).`,
              code: 'MPS_005_C001',
              maturity_level_target: 3,
            },
          ],
        },
      ],
    },
    {
      name: 'Process Integrity',
      code: 'PROCESS_INTEGRITY',
      mps: [
        {
          name: 'Process Governance',
          code: 'MPS_006_PROCESS_GOVERNANCE',
          intent_statement:
            'Define process ownership and controlled lifecycle governance for operational procedures.',
          criteria: [
            {
              name:
                `Process owners are assigned and accountable for design and maintenance of critical procedures (${sourceDescriptor}).`,
              code: 'MPS_006_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Process Control Integrity',
          code: 'MPS_007_PROCESS_CONTROL',
          intent_statement:
            'Ensure process execution controls are documented, monitored, and periodically reviewed.',
          criteria: [
            {
              name:
                `Execution controls include checkpoints and integrity reviews with tracked remediation actions (${sourceDescriptor}).`,
              code: 'MPS_007_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Change and Version Control',
          code: 'MPS_008_CHANGE_VERSION',
          intent_statement:
            'Apply formal version control and change approvals to critical process artifacts.',
          criteria: [
            {
              name:
                `Process artifacts are versioned and governed through approved change records (${sourceDescriptor}).`,
              code: 'MPS_008_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Operational Quality Checks',
          code: 'MPS_009_QUALITY_CHECKS',
          intent_statement:
            'Introduce quality checkpoints and exception handling across key process stages.',
          criteria: [
            {
              name:
                `Quality gates and exception workflows are embedded into critical process stages (${sourceDescriptor}).`,
              code: 'MPS_009_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Process Performance Review',
          code: 'MPS_010_PROCESS_PERFORMANCE',
          intent_statement:
            'Review process outcomes against defined KPIs and remediation actions.',
          criteria: [
            {
              name:
                `Process performance dashboards are reviewed with documented corrective actions (${sourceDescriptor}).`,
              code: 'MPS_010_C001',
              maturity_level_target: 3,
            },
          ],
        },
      ],
    },
    {
      name: 'People and Culture',
      code: 'PEOPLE_CULTURE',
      mps: [
        {
          name: 'Competency and Skills Baseline',
          code: 'MPS_011_COMPETENCY_SKILLS',
          intent_statement:
            'Define and maintain baseline competency expectations for role-critical functions.',
          criteria: [
            {
              name:
                `Role profiles include required competencies and periodic skills validation (${sourceDescriptor}).`,
              code: 'MPS_011_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Training and Awareness',
          code: 'MPS_012_TRAINING_AWARENESS',
          intent_statement:
            'Operate a structured training and awareness programme aligned to governance controls.',
          criteria: [
            {
              name:
                `Training plans cover control obligations with completion evidence and refresh cycles (${sourceDescriptor}).`,
              code: 'MPS_012_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Role Accountability Culture',
          code: 'MPS_013_ACCOUNTABILITY_CULTURE',
          intent_statement:
            'Reinforce personal accountability for control execution and evidence quality.',
          criteria: [
            {
              name:
                `Accountability expectations are embedded in role objectives and reviews (${sourceDescriptor}).`,
              code: 'MPS_013_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Performance and Behavior Reinforcement',
          code: 'MPS_014_BEHAVIOR_REINFORCEMENT',
          intent_statement:
            'Measure and reinforce behavior that supports maturity control objectives.',
          criteria: [
            {
              name:
                `Behavioral reinforcement mechanisms track sustained compliance behavior (${sourceDescriptor}).`,
              code: 'MPS_014_C001',
              maturity_level_target: 3,
            },
          ],
        },
      ],
    },
    {
      name: 'Protection',
      code: 'PROTECTION',
      mps: [
        {
          name: 'Access Control Governance',
          code: 'MPS_015_ACCESS_CONTROL',
          intent_statement:
            'Define and monitor access control governance for sensitive systems and data.',
          criteria: [
            {
              name:
                `Access models are documented, approved, and periodically recertified (${sourceDescriptor}).`,
              code: 'MPS_015_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Data Protection Controls',
          code: 'MPS_016_DATA_PROTECTION',
          intent_statement:
            'Apply data protection controls for storage, processing, and transfer activities.',
          criteria: [
            {
              name:
                `Data protection controls are defined across lifecycle stages and monitored (${sourceDescriptor}).`,
              code: 'MPS_016_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Threat Prevention and Detection',
          code: 'MPS_017_THREAT_PREVENTION',
          intent_statement:
            'Implement preventive and detective controls for relevant threat scenarios.',
          criteria: [
            {
              name:
                `Threat controls include prevention and detection with monitored alerts (${sourceDescriptor}).`,
              code: 'MPS_017_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Incident Preparedness',
          code: 'MPS_018_INCIDENT_PREPAREDNESS',
          intent_statement:
            'Establish response readiness for protection incidents and control failures.',
          criteria: [
            {
              name:
                `Incident response playbooks and drills are maintained and tested (${sourceDescriptor}).`,
              code: 'MPS_018_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Third-Party Protection Assurance',
          code: 'MPS_019_THIRD_PARTY_PROTECTION',
          intent_statement:
            'Extend protection governance to key third-party dependencies.',
          criteria: [
            {
              name:
                `Third-party protection obligations are defined and periodically assessed (${sourceDescriptor}).`,
              code: 'MPS_019_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Protection Control Monitoring',
          code: 'MPS_020_PROTECTION_MONITORING',
          intent_statement:
            'Continuously monitor protection control effectiveness and drift.',
          criteria: [
            {
              name:
                `Protection controls are monitored with health checks and tracked remediation (${sourceDescriptor}).`,
              code: 'MPS_020_C001',
              maturity_level_target: 3,
            },
          ],
        },
      ],
    },
    {
      name: 'Proof It Works',
      code: 'PROOF_IT_WORKS',
      mps: [
        {
          name: 'Evidence Architecture',
          code: 'MPS_021_EVIDENCE_ARCHITECTURE',
          intent_statement:
            'Define a repeatable evidence model for maturity claims and control outcomes.',
          criteria: [
            {
              name:
                `Evidence models define required artifacts, ownership, and traceability rules (${sourceDescriptor}).`,
              code: 'MPS_021_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Testing and Validation Cadence',
          code: 'MPS_022_TESTING_VALIDATION',
          intent_statement:
            'Run a routine testing cadence for control effectiveness validation.',
          criteria: [
            {
              name:
                `Validation testing follows a defined cadence with documented outcomes (${sourceDescriptor}).`,
              code: 'MPS_022_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Metrics and Traceability',
          code: 'MPS_023_METRICS_TRACEABILITY',
          intent_statement:
            'Track maturity outcomes with metrics traceable to controls and evidence.',
          criteria: [
            {
              name:
                `Outcome metrics map to controls and evidence records for audit-ready traceability (${sourceDescriptor}).`,
              code: 'MPS_023_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Assurance Review',
          code: 'MPS_024_ASSURANCE_REVIEW',
          intent_statement:
            'Perform assurance reviews that challenge and validate compiled maturity outputs.',
          criteria: [
            {
              name:
                `Independent assurance reviews validate control claims and unresolved evidence gaps (${sourceDescriptor}).`,
              code: 'MPS_024_C001',
              maturity_level_target: 3,
            },
          ],
        },
        {
          name: 'Continuous Improvement Proof Loop',
          code: 'MPS_025_IMPROVEMENT_LOOP',
          intent_statement:
            'Use findings and evidence to drive documented continuous improvement cycles.',
          criteria: [
            {
              name:
                `Improvement loops capture findings, planned changes, and proof-of-effectiveness outcomes (${sourceDescriptor}).`,
              code: 'MPS_025_C001',
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

  for (const [di, domain] of proposedDomains.entries()) {
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

    for (const [mi, mps] of domain.mps.entries()) {
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

      for (const [ci, criterion] of mps.criteria.entries()) {
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
