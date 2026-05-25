export interface LegacyCriteriaBlueprint {
  codeSuffix: string;
  statement: string;
  maturityLevelTarget: number;
}

export interface LegacyMpsBlueprint {
  number: number;
  title: string;
  codeSuffix: string;
  intent: string;
  criteria: LegacyCriteriaBlueprint[];
}

export interface LegacyDomainBlueprint {
  slug: string;
  name: string;
  code: string;
  sortOrder: number;
  mps: LegacyMpsBlueprint[];
}

export const LEGACY_DOMAIN_BLUEPRINTS: LegacyDomainBlueprint[] = [
  {
    slug: 'leadership-governance',
    name: 'Leadership and Governance',
    code: 'D001',
    sortOrder: 1,
    mps: [
      {
        number: 1,
        title: 'Leadership',
        codeSuffix: 'MPS001',
        intent:
          'Establish leadership ownership, accountability, and governance direction for the maturity programme.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'A documented governance charter defines leadership responsibilities, decision rights, and review cadence.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 2,
        title: 'Chain of Custody and Security Control Committee',
        codeSuffix: 'MPS002',
        intent:
          'Define chain-of-custody and committee oversight controls for key framework decisions and evidence.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'A control committee reviews and records chain-of-custody checkpoints for high-impact controls and evidence.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 3,
        title: 'Separation of Duties',
        codeSuffix: 'MPS003',
        intent:
          'Separate critical governance and assurance duties to prevent conflicts of interest.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'A documented duty-separation matrix assigns independent owner, reviewer, and approver roles for control decisions.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 4,
        title: 'Risk Management',
        codeSuffix: 'MPS004',
        intent:
          'Embed continuous risk identification and mitigation reviews into governance routines.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'A governance-owned risk register and mitigation cadence are reviewed and actioned on a defined cycle.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 5,
        title: 'Legal and Regulatory Requirements',
        codeSuffix: 'MPS005',
        intent:
          'Track and govern legal and regulatory obligations through a controlled compliance register.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'A compliance obligations register maps legal requirements to accountable owners and control evidence.',
            maturityLevelTarget: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'process-integrity',
    name: 'Process Integrity',
    code: 'D002',
    sortOrder: 2,
    mps: [
      {
        number: 6,
        title: 'Process Governance',
        codeSuffix: 'MPS001',
        intent:
          'Define process ownership and controlled lifecycle governance for operational procedures.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Process owners are formally assigned and accountable for design, approval, and maintenance of critical procedures.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 7,
        title: 'Process Control Integrity',
        codeSuffix: 'MPS002',
        intent:
          'Ensure process execution controls are documented, monitored, and periodically reviewed.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Execution controls include measurable checkpoints and periodic integrity reviews with tracked remediation actions.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 8,
        title: 'Change and Version Control',
        codeSuffix: 'MPS003',
        intent:
          'Apply formal version control and change approvals to critical process artifacts.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Process artifacts are versioned, with approved change records and rollback traceability.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 9,
        title: 'Operational Quality Checks',
        codeSuffix: 'MPS004',
        intent:
          'Introduce quality checkpoints and exception handling across key process stages.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Quality gates and exception workflows are embedded into each critical process stage and monitored for conformance.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 10,
        title: 'Process Performance Review',
        codeSuffix: 'MPS005',
        intent:
          'Review process outcomes against defined KPIs and remediation actions.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Process performance dashboards are reviewed with documented corrective actions against KPI targets.',
            maturityLevelTarget: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'people-culture',
    name: 'People and Culture',
    code: 'D003',
    sortOrder: 3,
    mps: [
      {
        number: 11,
        title: 'Competency and Skills Baseline',
        codeSuffix: 'MPS001',
        intent:
          'Define and maintain baseline competency expectations for role-critical functions.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Role profiles include required competencies and periodic skills validation against control responsibilities.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 12,
        title: 'Training and Awareness',
        codeSuffix: 'MPS002',
        intent:
          'Operate a structured training and awareness programme aligned to governance controls.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Training plans cover control obligations, with completion evidence and recurring refresh cycles.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 13,
        title: 'Role Accountability Culture',
        codeSuffix: 'MPS003',
        intent:
          'Reinforce personal accountability for control execution and evidence quality.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Accountability expectations are embedded in role objectives and reflected in periodic performance reviews.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 14,
        title: 'Performance and Behavior Reinforcement',
        codeSuffix: 'MPS004',
        intent:
          'Measure and reinforce behavior that supports maturity control objectives.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Behavioral reinforcement mechanisms track and reward sustained compliance with maturity control behaviors.',
            maturityLevelTarget: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'protection',
    name: 'Protection',
    code: 'D004',
    sortOrder: 4,
    mps: [
      {
        number: 15,
        title: 'Access Control Governance',
        codeSuffix: 'MPS001',
        intent:
          'Define and monitor access control governance for sensitive systems and data.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Access models are documented, approved, and periodically recertified for critical systems.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 16,
        title: 'Data Protection Controls',
        codeSuffix: 'MPS002',
        intent:
          'Apply data protection controls for storage, processing, and transfer activities.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Data protection controls are defined across lifecycle stages with evidence of implementation and monitoring.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 17,
        title: 'Threat Prevention and Detection',
        codeSuffix: 'MPS003',
        intent:
          'Implement preventive and detective controls for relevant threat scenarios.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Threat controls include prevention and detection mechanisms with monitored alerts and response procedures.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 18,
        title: 'Incident Preparedness',
        codeSuffix: 'MPS004',
        intent:
          'Establish response readiness for protection incidents and control failures.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Incident response playbooks, drills, and post-incident reviews are maintained and periodically executed.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 19,
        title: 'Third-Party Protection Assurance',
        codeSuffix: 'MPS005',
        intent:
          'Extend protection governance to key third-party dependencies.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Third-party protection obligations are contractually defined and periodically assessed for compliance.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 20,
        title: 'Protection Control Monitoring',
        codeSuffix: 'MPS006',
        intent:
          'Continuously monitor protection control effectiveness and drift.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Control monitoring includes scheduled health checks and tracked remediation for degraded protection controls.',
            maturityLevelTarget: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'proof-it-works',
    name: 'Proof It Works',
    code: 'D005',
    sortOrder: 5,
    mps: [
      {
        number: 21,
        title: 'Evidence Architecture',
        codeSuffix: 'MPS001',
        intent:
          'Define a repeatable evidence model for maturity claims and control outcomes.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Evidence models define required artifacts, ownership, retention, and traceability rules for maturity claims.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 22,
        title: 'Testing and Validation Cadence',
        codeSuffix: 'MPS002',
        intent:
          'Run a routine testing cadence for control effectiveness validation.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Validation testing follows a defined cadence with documented outcomes and tracked corrective actions.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 23,
        title: 'Metrics and Traceability',
        codeSuffix: 'MPS003',
        intent:
          'Track maturity outcomes with metrics traceable to controls and evidence.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Outcome metrics map to controls and evidence records, enabling audit-ready traceability.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 24,
        title: 'Assurance Review',
        codeSuffix: 'MPS004',
        intent:
          'Perform assurance reviews that challenge and validate compiled maturity outputs.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Independent assurance reviews validate control claims and challenge unresolved evidence gaps.',
            maturityLevelTarget: 3,
          },
        ],
      },
      {
        number: 25,
        title: 'Continuous Improvement Proof Loop',
        codeSuffix: 'MPS005',
        intent:
          'Use findings and evidence to drive documented continuous improvement cycles.',
        criteria: [
          {
            codeSuffix: 'C001',
            statement:
              'Improvement loops capture findings, planned changes, and proof-of-effectiveness outcomes.',
            maturityLevelTarget: 3,
          },
        ],
      },
    ],
  },
];

export function normalizeDomainKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
