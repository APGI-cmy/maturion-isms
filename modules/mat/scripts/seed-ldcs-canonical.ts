/**
 * LDCS Canonical Seed Script — MAT Supabase Preview
 *
 * Seeds the Lucara Diamond Control Standard (LDCS) v4 (2021-11-16)
 * Domain → MPS → Criteria structure into the MAT Supabase preview
 * instance using the Supabase JS client API (no raw SQL).
 *
 * Source: modules/mat/Lucara_Diamond_Control_Standard_seed_info.md
 * Issue:  Seed Canonical LDCS into MAT Supabase (PREVIEW — pre-test gating)
 * Agent:  mat-specialist (criteria-generator-agent workflow)
 *
 * Usage:
 *   SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> \
 *     npx tsx modules/mat/scripts/seed-ldcs-canonical.ts
 *
 * Optional env vars:
 *   ORG_ID — organisation UUID to scope records (leave blank for canonical / unscoped seed)
 *   DRY_RUN=true — print payload without writing to database
 */

import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const ORG_ID: string | undefined = process.env.ORG_ID || undefined;
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!DRY_RUN) {
  if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required');
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = DRY_RUN
  ? null
  : createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

// ---------------------------------------------------------------------------
// LDCS Canonical Data
// Source: Lucara Diamond Control Standard v4 (2021-11-16)
// ---------------------------------------------------------------------------

interface DomainSeed {
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  mps: MpsSeed[];
}

interface MpsSeed {
  number: number;
  name: string;
  intent: string;
  sort_order: number;
  criteria: CriteriaSeed[];
}

interface CriteriaSeed {
  number: string;
  title: string;
  description: string;
  sort_order: number;
}

const LDCS_DOMAINS: DomainSeed[] = [
  {
    slug: 'leadership-governance',
    name: 'Leadership and Governance',
    description:
      'Establishes the security governance framework, leadership accountability, ' +
      'chain of custody, separation of duties, risk management, and legal compliance.',
    sort_order: 1,
    mps: [
      {
        number: 1,
        name: 'Leadership',
        intent:
          'To set clear expectations for Security Management that are codified with a policy ' +
          'and supporting procedures which are consistently applied by leaders at all levels.',
        sort_order: 1,
        criteria: [
          {
            number: '1.1',
            title: 'Security Policy Display and Communication',
            description:
              'A Security Policy signed by the most senior executive is prominently displayed ' +
              'and communicated via accessible channels to all staff, contractors and visitors.',
            sort_order: 1,
          },
          {
            number: '1.2',
            title: 'Security Policy Content Requirements',
            description:
              'The Security Policy outlines the company\'s obligations and the individual\'s ' +
              'obligations regarding Security and security-related activities.',
            sort_order: 2,
          },
          {
            number: '1.3',
            title: 'Induction and Compliance Recording',
            description:
              'The Policy is incorporated into the operation\'s induction process for all ' +
              'personnel, contractors and visitors, with a process for recording understanding ' +
              'and agreement to comply.',
            sort_order: 3,
          },
          {
            number: '1.4',
            title: 'Leadership Security Relevance',
            description:
              'Heads of Department and leaders at all levels endeavour to make the Security ' +
              'Policy relevant through Golden Rules and regular security awareness sessions ' +
              'conducted at least bi-weekly.',
            sort_order: 4,
          },
          {
            number: '1.5',
            title: 'Role-Specific Security Accountabilities',
            description:
              'Specific Security accountabilities and performance measures are documented ' +
              'within role descriptions for those in high-risk diamond areas, security and management.',
            sort_order: 5,
          },
          {
            number: '1.6',
            title: 'Security Culture Assessment',
            description:
              'Leadership teams in high-risk diamond areas regularly assess the Security ' +
              'culture and adherence to security protocols, especially during high-risk activities.',
            sort_order: 6,
          },
        ],
      },
      {
        number: 2,
        name: 'Chain of Custody and Diamond Control Committee',
        intent:
          'To provide clear accountability for the custody of diamond material from the ore ' +
          'body to the point of onward shipping to the customer — the chain of custody.',
        sort_order: 2,
        criteria: [
          {
            number: '2.1',
            title: 'Chain of Custody Matrix',
            description:
              'The chain of custody for each operation is set out in matrix form with an ' +
              'accountable manager named for each part of the chain and applicable controls listed.',
            sort_order: 1,
          },
          {
            number: '2.2',
            title: 'Diamond Control Committee (DCC) Establishment',
            description:
              'A Diamond Control Committee (DCC) is formally established with documented ' +
              'membership, terms of reference, meeting frequency and decision-making authority.',
            sort_order: 2,
          },
          {
            number: '2.3',
            title: 'DCC Meeting Cadence and Records',
            description:
              'The DCC meets at regular planned intervals, with minutes and action items ' +
              'recorded and distributed to relevant stakeholders.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 3,
        name: 'Separation of Duties',
        intent:
          'To prevent fraud and error by distributing critical security and diamond-handling ' +
          'responsibilities among various individuals.',
        sort_order: 3,
        criteria: [
          {
            number: '3.1',
            title: 'Four-Component Separation Principle',
            description:
              'In handling and accounting for diamonds, a single individual is assigned ' +
              'responsibility for only one of: custody of diamonds or diamond data, ' +
              'authorisations, record keeping, and reconciliation.',
            sort_order: 1,
          },
          {
            number: '3.2',
            title: 'Role Segregation Documentation',
            description:
              'Separation of duties is evidenced in role descriptions, organisational charts, ' +
              'and operational procedures for all diamond-handling activities.',
            sort_order: 2,
          },
          {
            number: '3.3',
            title: 'Compensating Controls for Small Teams',
            description:
              'Where full separation is not possible due to operational constraints, ' +
              'compensating controls (dual verification, audit logs, supervision) are implemented ' +
              'and documented.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 4,
        name: 'Risk Management',
        intent:
          'To ensure that efforts and resources are focused on the greatest risks by identifying, ' +
          'evaluating and controlling risks using a common Lucara Botswana risk management approach.',
        sort_order: 4,
        criteria: [
          {
            number: '4.1',
            title: 'Risk Management Policy',
            description:
              'Lucara Botswana has formulated and adopted a Risk Management Policy that ' +
              'establishes the framework and accountability for managing security risks.',
            sort_order: 1,
          },
          {
            number: '4.2',
            title: 'Risk Register Maintenance',
            description:
              'A current risk register is maintained for diamond security, updated at ' +
              'defined intervals and reviewed following significant incidents or changes.',
            sort_order: 2,
          },
          {
            number: '4.3',
            title: 'Risk Treatment Plans',
            description:
              'Documented risk treatment plans exist for identified high and critical risks, ' +
              'with assigned owners and target completion dates.',
            sort_order: 3,
          },
          {
            number: '4.4',
            title: 'Risk Review Cadence',
            description:
              'Formal risk reviews are conducted at planned intervals with outputs reported ' +
              'to the DCC and senior leadership.',
            sort_order: 4,
          },
        ],
      },
      {
        number: 5,
        name: 'Legal and Regulatory Requirements',
        intent:
          'To establish standards for how Lucara operates and that Lucara complies with all ' +
          'legal, regulatory, and other associated requirements.',
        sort_order: 5,
        criteria: [
          {
            number: '5.1',
            title: 'Legal and Regulatory Register',
            description:
              'A register of applicable legal, regulatory, and internal policy obligations ' +
              'is maintained, reviewed and updated at defined intervals.',
            sort_order: 1,
          },
          {
            number: '5.2',
            title: 'Compliance Monitoring and Reporting',
            description:
              'A process exists to monitor compliance with identified legal and regulatory ' +
              'requirements, with non-compliances tracked and escalated appropriately.',
            sort_order: 2,
          },
          {
            number: '5.3',
            title: 'Regulatory Change Awareness',
            description:
              'A mechanism is in place to identify and assess the impact of changes to ' +
              'applicable laws and regulations on diamond control operations.',
            sort_order: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'process-integrity',
    name: 'Process Integrity',
    description:
      'Ensures operational processes for mining, recovering, sorting and selling diamonds ' +
      'are controlled, measured and reconciled to prevent loss and maintain value.',
    sort_order: 2,
    mps: [
      {
        number: 6,
        name: 'Diamond Value Management',
        intent:
          'To ensure operational processes are in control and measured so that variations in ' +
          'expected production and revenue recovery provide triggers for increased security and ' +
          'managerial focus.',
        sort_order: 1,
        criteria: [
          {
            number: '6.1',
            title: 'Diamond Liberation Controls',
            description:
              'Controls are in place to monitor diamond liberation during mining and to ensure ' +
              'that exposed diamond-rich ore is handled with appropriate security measures.',
            sort_order: 1,
          },
          {
            number: '6.2',
            title: 'Diamond Value Management Committee',
            description:
              'A Diamond Value Management (DVM) Committee is formally established with ' +
              'defined membership, terms of reference and meeting cadence.',
            sort_order: 2,
          },
          {
            number: '6.3',
            title: 'Production and Revenue Reconciliation',
            description:
              'Regular reconciliation of expected versus actual production and revenue is ' +
              'conducted, with variances investigated and reported to the DCC.',
            sort_order: 3,
          },
          {
            number: '6.4',
            title: 'Process Anomaly Response',
            description:
              'Documented triggers and response procedures exist for process variations that ' +
              'indicate potential loss or security breach in the diamond value chain.',
            sort_order: 4,
          },
        ],
      },
      {
        number: 7,
        name: 'Process Control',
        intent:
          'To ensure that operational failures are minimised and the process of mining, ' +
          'liberating, washing, recovering, sorting and selling diamonds is clearly understood, ' +
          'in control, measured and reconciled throughout.',
        sort_order: 2,
        criteria: [
          {
            number: '7.1',
            title: 'Kimberlite Mining Controls',
            description:
              'Mining of kimberlite deposits is coordinated with security measures to prevent ' +
              'diamond loss during ore extraction and handling.',
            sort_order: 1,
          },
          {
            number: '7.2',
            title: 'Process Flow Documentation',
            description:
              'A documented process flow map exists for the complete diamond processing chain, ' +
              'identifying all control points and responsible parties.',
            sort_order: 2,
          },
          {
            number: '7.3',
            title: 'Measurement and Reconciliation Points',
            description:
              'Defined measurement and reconciliation points exist throughout the processing ' +
              'chain with records maintained and reviewed regularly.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 8,
        name: 'Maintenance and Housekeeping',
        intent:
          'To ensure that diamond-handling areas are kept tidy and subject to an orderly ' +
          'maintenance regime where unplanned maintenance is minimised.',
        sort_order: 3,
        criteria: [
          {
            number: '8.1',
            title: 'Planned Maintenance Programme',
            description:
              'A planned preventative maintenance programme exists for all diamond-handling ' +
              'equipment and areas, with records of completion and sign-off.',
            sort_order: 1,
          },
          {
            number: '8.2',
            title: 'Unplanned Maintenance Security Controls',
            description:
              'All unplanned maintenance in diamond-handling areas requires prior security ' +
              'authorisation, with enhanced supervision and logging during execution.',
            sort_order: 2,
          },
          {
            number: '8.3',
            title: 'Housekeeping Standards',
            description:
              'Documented housekeeping standards are maintained and inspected at regular ' +
              'intervals for all diamond-handling areas.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 9,
        name: 'Management of Change',
        intent:
          'To ensure that changes to procedures, equipment, or systems in diamond areas are ' +
          'assessed for security impact and appropriately controlled.',
        sort_order: 4,
        criteria: [
          {
            number: '9.1',
            title: 'Change Management Procedure',
            description:
              'Change management procedures exist for all modifications to procedures in ' +
              'diamond areas, requiring security review and approval before implementation.',
            sort_order: 1,
          },
          {
            number: '9.2',
            title: 'Change Impact Assessment',
            description:
              'A security impact assessment is completed for all proposed changes to ' +
              'diamond-handling areas, equipment, or processes.',
            sort_order: 2,
          },
          {
            number: '9.3',
            title: 'Change Record and Communication',
            description:
              'All approved changes are documented and communicated to affected personnel, ' +
              'with post-implementation reviews conducted at defined intervals.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 10,
        name: 'Sales and Auction Process',
        intent:
          'To protect the integrity of diamond sales batches, preserve diamond value, eliminate ' +
          'diamond loss, ensure the longevity for the demand for diamonds and customer retention.',
        sort_order: 5,
        criteria: [
          {
            number: '10.1',
            title: 'Sales Area Access Control',
            description:
              'All diamond processing and sales operations are conducted inside a secured ' +
              'area with documented access control, transaction logging and dual-person oversight.',
            sort_order: 1,
          },
          {
            number: '10.2',
            title: 'Sales Batch Integrity Verification',
            description:
              'A documented procedure for verifying the integrity of diamond sales batches ' +
              'exists, including pre-sale and post-sale reconciliation.',
            sort_order: 2,
          },
          {
            number: '10.3',
            title: 'Customer and Buyer Due Diligence',
            description:
              'Due diligence processes are in place for all customers and buyers to comply ' +
              'with anti-money-laundering and Know Your Customer (KYC) requirements.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 11,
        name: 'Trading Operations',
        intent:
          'To apply diamond trading-specific controls over and above those stipulated under MPS 10, ' +
          'governing all trading operations and associated custody transfers.',
        sort_order: 6,
        criteria: [
          {
            number: '11.1',
            title: 'Trading Operations Access Records',
            description:
              'Records of all access transactions to trading operations are maintained, ' +
              'reviewed and available for audit.',
            sort_order: 1,
          },
          {
            number: '11.2',
            title: 'Trading Procedure Compliance',
            description:
              'Trading operations are conducted strictly in accordance with documented ' +
              'procedures, with evidence of compliance maintained.',
            sort_order: 2,
          },
          {
            number: '11.3',
            title: 'Trading Reconciliation',
            description:
              'Reconciliation of all diamond trading transactions is completed and ' +
              'discrepancies are investigated and reported in a timely manner.',
            sort_order: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'people-culture',
    name: 'People and Culture',
    description:
      'Develops a positive security culture through reliable people, human rights compliance, ' +
      'effective communication and continuous improvement.',
    sort_order: 3,
    mps: [
      {
        number: 12,
        name: 'Human Rights and Community',
        intent:
          'To act in a manner that demonstrates respect for human rights and benefits the ' +
          'communities affected by or surrounding Lucara operations.',
        sort_order: 1,
        criteria: [
          {
            number: '12.1',
            title: 'Community Engagement Programme',
            description:
              'A formal community engagement and support programme exists, with documented ' +
              'activities and outcomes for communities affected by Lucara operations.',
            sort_order: 1,
          },
          {
            number: '12.2',
            title: 'Voluntary Principles Compliance',
            description:
              'Operations subscribe to and apply the Voluntary Principles for Security and ' +
              'Human Rights, with evidence of implementation in security contracting and conduct.',
            sort_order: 2,
          },
          {
            number: '12.3',
            title: 'Human Rights Grievance Mechanism',
            description:
              'An accessible grievance mechanism exists for communities and individuals to ' +
              'report human rights concerns, with a documented process for response and resolution.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 13,
        name: 'Reliable People',
        intent:
          'To develop a positive, sustainable Security culture by recruiting and retaining ' +
          'people of integrity and providing requisite training for competence and awareness.',
        sort_order: 2,
        criteria: [
          {
            number: '13.1',
            title: 'Pre-Employment Vetting',
            description:
              'All personnel in diamond-entrusted roles undergo documented pre-employment ' +
              'vetting including identity checks, criminal background checks, and employment history verification.',
            sort_order: 1,
          },
          {
            number: '13.2',
            title: 'Security Induction and Training',
            description:
              'All personnel receive security induction training and role-specific security ' +
              'training appropriate to their access and responsibilities, with records maintained.',
            sort_order: 2,
          },
          {
            number: '13.3',
            title: 'Ongoing Personnel Reliability Monitoring',
            description:
              'A process exists for ongoing monitoring of personnel reliability, including ' +
              'periodic re-vetting for high-risk roles and reporting channels for behavioural concerns.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 14,
        name: 'Engagement and Communication',
        intent:
          'To communicate effectively with stakeholders and engage all personnel in contributing ' +
          'to security success — security is not a security-only responsibility.',
        sort_order: 3,
        criteria: [
          {
            number: '14.1',
            title: 'Two-Way Security Communications',
            description:
              'An effective two-way security communications process is in place, enabling ' +
              'personnel to report concerns and receive security updates from management.',
            sort_order: 1,
          },
          {
            number: '14.2',
            title: 'Security Awareness Programme',
            description:
              'A structured security awareness programme is in place covering all personnel, ' +
              'with content updated to reflect current threats and lessons learned.',
            sort_order: 2,
          },
          {
            number: '14.3',
            title: 'Stakeholder Communication Plan',
            description:
              'A documented stakeholder communication plan identifies key security stakeholders, ' +
              'communication frequency and channels for security-related information.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 15,
        name: 'Continuous Improvement',
        intent:
          'To ensure continuous improvement in the approach to Security using knowledge gained ' +
          'from incidents, non-conformities, new operations and management reviews.',
        sort_order: 4,
        criteria: [
          {
            number: '15.1',
            title: 'Security Incident Management System',
            description:
              'A system and procedure for managing security incidents exists, ensuring ' +
              'all incidents are recorded, investigated and lessons identified.',
            sort_order: 1,
          },
          {
            number: '15.2',
            title: 'Non-Conformance and Corrective Action Tracking',
            description:
              'Non-conformances against the LDCS are recorded, root causes analysed, and ' +
              'corrective actions tracked to closure.',
            sort_order: 2,
          },
          {
            number: '15.3',
            title: 'Management Review of the Standard',
            description:
              'Formal management reviews of the LDCS and its MPS are conducted at planned ' +
              'intervals, with outputs informing updates to the standard.',
            sort_order: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'protection',
    name: 'Protection',
    description:
      'Delivers physical security, technical systems, security operations, product shipment, ' +
      'surveillance and resilience measures to protect people, product and property.',
    sort_order: 4,
    mps: [
      {
        number: 16,
        name: 'Physical Security',
        intent:
          'To ensure that adequate physical security measures are in place that are integrated ' +
          'with people, procedures and technical systems.',
        sort_order: 1,
        criteria: [
          {
            number: '16.1',
            title: 'Security Policy in Place',
            description:
              'A security policy is in place, implemented, understood by all relevant ' +
              'personnel, and reviewed at planned intervals.',
            sort_order: 1,
          },
          {
            number: '16.2',
            title: 'Physical Barriers and Layered Perimeter',
            description:
              'Layered physical perimeter controls are in place for diamond-handling areas, ' +
              'documented in a site security plan with periodic effectiveness reviews.',
            sort_order: 2,
          },
          {
            number: '16.3',
            title: 'Access Control for Diamond Areas',
            description:
              'Documented access control procedures govern entry to all diamond-handling ' +
              'areas, with access logs maintained and reviewed regularly.',
            sort_order: 3,
          },
          {
            number: '16.4',
            title: 'Physical Search Procedures',
            description:
              'Documented and consistently applied search procedures exist for all persons ' +
              'and vehicles entering or leaving diamond-handling areas.',
            sort_order: 4,
          },
        ],
      },
      {
        number: 17,
        name: 'Technical Systems',
        intent:
          'To ensure that the technical systems on which security relies are fit for purpose, ' +
          'well maintained, resilient and proactively managed to optimise performance.',
        sort_order: 2,
        criteria: [
          {
            number: '17.1',
            title: 'Technical Controls Selection and Placement',
            description:
              'In high-risk areas, controls are selected and placed based on documented ' +
              'risk assessment, with evidence of selection rationale.',
            sort_order: 1,
          },
          {
            number: '17.2',
            title: 'Technical System Maintenance and Calibration',
            description:
              'A maintenance and calibration schedule exists for all security technical ' +
              'systems, with records of service, faults, and remediation.',
            sort_order: 2,
          },
          {
            number: '17.3',
            title: 'Technical System Resilience and Redundancy',
            description:
              'Critical technical security systems have documented resilience and redundancy ' +
              'measures tested at defined intervals.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 18,
        name: 'Security Operations (Patrolling and Guarding)',
        intent:
          'To ensure that security operations are conducted in accordance with Lucara\'s code of ' +
          'ethics and the Voluntary Principles on Security and Human Rights.',
        sort_order: 3,
        criteria: [
          {
            number: '18.1',
            title: 'Security Personnel Fitness Standards',
            description:
              'All security personnel meet documented fitness-for-duty standards including ' +
              'physical, psychological and integrity requirements.',
            sort_order: 1,
          },
          {
            number: '18.2',
            title: 'Patrolling and Guarding Procedures',
            description:
              'Documented patrolling and guarding procedures exist for all diamond-handling ' +
              'areas with records of patrol completion and any incidents observed.',
            sort_order: 2,
          },
          {
            number: '18.3',
            title: 'Security Personnel Training and Certification',
            description:
              'All security personnel hold current relevant certifications and have received ' +
              'training aligned to the Voluntary Principles and operational requirements.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 19,
        name: 'Product Shipment',
        intent:
          'To ensure that diamond product shipments are conducted safely and securely, maintaining ' +
          'the chain of custody and appropriate controls throughout.',
        sort_order: 4,
        criteria: [
          {
            number: '19.1',
            title: 'Shipment Procedure',
            description:
              'An approved and signed-off procedure governing product shipment is in place, ' +
              'implemented and reviewed annually.',
            sort_order: 1,
          },
          {
            number: '19.2',
            title: 'Shipment Chain of Custody Documentation',
            description:
              'Documentation maintains the chain of custody throughout the shipment process, ' +
              'with sign-off at each custody transfer point.',
            sort_order: 2,
          },
          {
            number: '19.3',
            title: 'Shipment Security Escort Requirements',
            description:
              'Requirements for security escort during product shipment are documented, ' +
              'reviewed based on threat assessment, and consistently applied.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 20,
        name: 'Surveillance and Analysis',
        intent:
          'To detect and respond to security threats through appropriately selected, trained, ' +
          'and motivated surveillance personnel focused on the risks.',
        sort_order: 5,
        criteria: [
          {
            number: '20.1',
            title: 'Surveillance Camera Placement Evidence',
            description:
              'Evidence demonstrates that the use and placement of surveillance cameras are ' +
              'based on risk assessment with documented coverage rationale.',
            sort_order: 1,
          },
          {
            number: '20.2',
            title: 'Surveillance Monitoring Procedures',
            description:
              'Documented procedures govern surveillance monitoring activities, including ' +
              'response protocols for identified anomalies or alarms.',
            sort_order: 2,
          },
          {
            number: '20.3',
            title: 'Surveillance Recording and Retention',
            description:
              'Surveillance recordings are retained for a defined period consistent with ' +
              'operational and investigative requirements, with access controls on recordings.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 21,
        name: 'Resilience and Recovery',
        intent:
          'To identify, mitigate, control, and recover from incidents that can disrupt ' +
          'Lucara Botswana\'s business operations.',
        sort_order: 6,
        criteria: [
          {
            number: '21.1',
            title: 'Business Continuity Plans',
            description:
              'All departments complete a Business Continuity Plan (BCP) based on Lucara ' +
              'Botswana\'s BCM policy, assessing the six pillars of business continuity.',
            sort_order: 1,
          },
          {
            number: '21.2',
            title: 'BCP Testing and Review',
            description:
              'Business Continuity Plans are tested and reviewed at defined intervals with ' +
              'results documented and actions tracked to completion.',
            sort_order: 2,
          },
          {
            number: '21.3',
            title: 'Incident Response Procedures',
            description:
              'Documented incident response procedures exist for security-relevant disruption ' +
              'scenarios, with defined escalation paths and recovery time objectives.',
            sort_order: 3,
          },
        ],
      },
    ],
  },
  {
    slug: 'proof',
    name: 'Proof',
    description:
      'Confirms the efficient application of the LDCS through documentation, metrics, ' +
      'investigations, audits and intelligence activities.',
    sort_order: 5,
    mps: [
      {
        number: 22,
        name: 'Documentation and Metrics',
        intent:
          'To ensure that security framework documents and metrics are fit for purpose, ' +
          'controlled and accessible by appropriate personnel.',
        sort_order: 1,
        criteria: [
          {
            number: '22.1',
            title: 'Security Framework Document Preparation',
            description:
              'Security framework documents are prepared in a consistent style and format, ' +
              'describing operations and providing the basis for management of change, audits and metrics.',
            sort_order: 1,
          },
          {
            number: '22.2',
            title: 'Document Control and Version Management',
            description:
              'A document control procedure ensures that security framework documents are ' +
              'version-controlled, reviewed at planned intervals, and accessible to appropriate personnel.',
            sort_order: 2,
          },
          {
            number: '22.3',
            title: 'Security Metrics Reporting',
            description:
              'Defined security metrics are collected, analysed and reported to senior ' +
              'leadership and the DCC at defined intervals.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 23,
        name: 'Investigations into Suspected Wrongdoing',
        intent:
          'To ensure that information or evidence collected can be used by subsequent internal ' +
          'or criminal investigations, incidents are recorded and investigated correctly.',
        sort_order: 2,
        criteria: [
          {
            number: '23.1',
            title: 'Investigation Procedure',
            description:
              'A documented investigation procedure exists for incidents involving suspected ' +
              'serious wrongdoing, ensuring evidence integrity and proper notification.',
            sort_order: 1,
          },
          {
            number: '23.2',
            title: 'Evidence Handling and Chain of Custody',
            description:
              'Procedures for evidence collection, handling and preservation maintain chain ' +
              'of custody and admissibility for potential legal proceedings.',
            sort_order: 2,
          },
          {
            number: '23.3',
            title: 'Investigation Reporting and Escalation',
            description:
              'A defined escalation path exists for investigations involving suspected serious ' +
              'wrongdoing, including notification to authorities where legally required.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 24,
        name: 'Audits and Review',
        intent:
          'To confirm the efficient application of this Standard at all Lucara Botswana ' +
          'operations and the continued relevance of the Minimum Performance Standards.',
        sort_order: 3,
        criteria: [
          {
            number: '24.1',
            title: 'Regular Planned Audits',
            description:
              'Lucara Botswana workplaces carry out regular planned area audits to assess ' +
              'compliance with the LDCS, with findings recorded and actioned.',
            sort_order: 1,
          },
          {
            number: '24.2',
            title: 'Audit Scope and Schedule',
            description:
              'A documented audit schedule covers all MPS at defined frequencies, with ' +
              'audit scope and criteria communicated to auditees in advance.',
            sort_order: 2,
          },
          {
            number: '24.3',
            title: 'Audit Findings Tracking and Closure',
            description:
              'Audit findings are recorded in a tracking register with assigned owners, ' +
              'target dates and evidence of closure reviewed by management.',
            sort_order: 3,
          },
        ],
      },
      {
        number: 25,
        name: 'Intelligence',
        intent:
          'To ensure that Lucara\'s Security Team plays a supportive role to Government criminal ' +
          'intelligence capability and that intelligence supports proactive security management.',
        sort_order: 4,
        criteria: [
          {
            number: '25.1',
            title: 'Intelligence Collection and Management',
            description:
              'A process exists for the collection, analysis and management of security ' +
              'intelligence relevant to diamond operations and threats.',
            sort_order: 1,
          },
          {
            number: '25.2',
            title: 'Government and External Intelligence Liaison',
            description:
              'Documented relationships with Government intelligence agencies and relevant ' +
              'external bodies support proactive security threat awareness.',
            sort_order: 2,
          },
          {
            number: '25.3',
            title: 'Intelligence-Driven Security Adjustments',
            description:
              'A process exists for translating intelligence findings into security ' +
              'operational adjustments, with changes documented and communicated.',
            sort_order: 3,
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seeding functions
// ---------------------------------------------------------------------------

type InsertResult = { inserted: number; errors: string[] };

async function seedDomains(): Promise<Map<string, string>> {
  const domainIdMap = new Map<string, string>();

  for (const domain of LDCS_DOMAINS) {
    const payload = {
      name: domain.name,
      description: domain.description,
      sort_order: domain.sort_order,
      ...(ORG_ID ? { org_id: ORG_ID } : {}),
    };

    if (DRY_RUN) {
      console.log('[DRY-RUN] Would upsert domain:', payload);
      domainIdMap.set(domain.slug, `dry-run-domain-${domain.sort_order}`);
      continue;
    }

    const { data, error } = await supabase!
      .from('domains')
      .upsert(payload, { onConflict: ORG_ID ? 'org_id,name' : 'name' })
      .select('id')
      .single();

    if (error) {
      // Fallback: try insert only
      const { data: inserted, error: insertError } = await supabase!
        .from('domains')
        .insert(payload)
        .select('id')
        .single();

      if (insertError) {
        console.error(`  ✗ Domain "${domain.name}": ${insertError.message}`);
        continue;
      }
      domainIdMap.set(domain.slug, inserted!.id);
    } else {
      domainIdMap.set(domain.slug, data!.id);
    }

    console.log(`  ✓ Domain: ${domain.name}`);
  }

  return domainIdMap;
}

async function seedMPS(
  domainIdMap: Map<string, string>
): Promise<Map<number, string>> {
  const mpsIdMap = new Map<number, string>();

  for (const domain of LDCS_DOMAINS) {
    const domainId = domainIdMap.get(domain.slug);
    if (!domainId) {
      console.error(`  ✗ No domain ID for slug "${domain.slug}", skipping MPS`);
      continue;
    }

    for (const mps of domain.mps) {
      const payload = {
        domain_id: domainId,
        number: String(mps.number),
        name: mps.name,
        description: mps.intent,
        sort_order: mps.sort_order,
        ...(ORG_ID ? { org_id: ORG_ID } : {}),
      };

      if (DRY_RUN) {
        console.log('[DRY-RUN] Would upsert MPS:', { ...payload, domain: domain.name });
        mpsIdMap.set(mps.number, `dry-run-mps-${mps.number}`);
        continue;
      }

      const { data, error } = await supabase!
        .from('mps')
        .upsert(payload, { onConflict: ORG_ID ? 'org_id,number' : 'domain_id,number' })
        .select('id')
        .single();

      if (error) {
        const { data: inserted, error: insertError } = await supabase!
          .from('mps')
          .insert(payload)
          .select('id')
          .single();

        if (insertError) {
          console.error(`  ✗ MPS ${mps.number} "${mps.name}": ${insertError.message}`);
          continue;
        }
        mpsIdMap.set(mps.number, inserted!.id);
      } else {
        mpsIdMap.set(mps.number, data!.id);
      }

      console.log(`  ✓ MPS ${mps.number}: ${mps.name}`);
    }
  }

  return mpsIdMap;
}

async function seedCriteria(mpsIdMap: Map<number, string>): Promise<InsertResult> {
  let inserted = 0;
  const errors: string[] = [];

  for (const domain of LDCS_DOMAINS) {
    for (const mps of domain.mps) {
      const mpsId = mpsIdMap.get(mps.number);
      if (!mpsId) {
        errors.push(`No MPS ID for MPS ${mps.number}, skipping criteria`);
        continue;
      }

      for (const criterion of mps.criteria) {
        const payload = {
          mps_id: mpsId,
          number: criterion.number,
          title: criterion.title,
          description: criterion.description,
          sort_order: criterion.sort_order,
          status: 'not_started',
          ...(ORG_ID ? { org_id: ORG_ID } : {}),
        };

        if (DRY_RUN) {
          console.log('[DRY-RUN] Would upsert criterion:', {
            number: criterion.number,
            title: criterion.title,
          });
          inserted++;
          continue;
        }

        const { data, error } = await supabase!
          .from('criteria')
          .upsert(payload, { onConflict: ORG_ID ? 'org_id,number' : 'mps_id,number' })
          .select('id')
          .single();

        if (error) {
          const { error: insertError } = await supabase!
            .from('criteria')
            .insert(payload);

          if (insertError) {
            errors.push(`Criterion ${criterion.number}: ${insertError.message}`);
            continue;
          }
        }

        inserted++;
        console.log(`  ✓ Criterion ${criterion.number}: ${criterion.title}`);
      }
    }
  }

  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  LDCS Canonical Seed — MAT Supabase Preview                      ║');
  console.log('║  Lucara Diamond Control Standard v4 (2021-11-16)                 ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Mode:       ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  if (!DRY_RUN) {
    console.log(`Target URL: ${SUPABASE_URL}`);
  }
  console.log(`Org scope:  ${ORG_ID ?? 'none (canonical/unscoped)'}`);
  console.log('');

  const totals = {
    domains: LDCS_DOMAINS.length,
    mps: LDCS_DOMAINS.reduce((sum, d) => sum + d.mps.length, 0),
    criteria: LDCS_DOMAINS.reduce(
      (sum, d) => sum + d.mps.reduce((s, m) => s + m.criteria.length, 0),
      0
    ),
  };

  console.log(`Seeding: ${totals.domains} domains, ${totals.mps} MPS, ${totals.criteria} criteria`);
  console.log('');

  // Step 1: Domains
  console.log('Step 1: Seeding domains...');
  const domainIdMap = await seedDomains();
  console.log(`  → ${domainIdMap.size} / ${LDCS_DOMAINS.length} domains seeded`);
  console.log('');

  // Step 2: MPS
  console.log('Step 2: Seeding MPS...');
  const mpsIdMap = await seedMPS(domainIdMap);
  console.log(`  → ${mpsIdMap.size} / ${totals.mps} MPS seeded`);
  console.log('');

  // Step 3: Criteria
  console.log('Step 3: Seeding criteria...');
  const criteriaResult = await seedCriteria(mpsIdMap);
  console.log(`  → ${criteriaResult.inserted} / ${totals.criteria} criteria seeded`);

  if (criteriaResult.errors.length > 0) {
    console.log('');
    console.log('Errors encountered:');
    criteriaResult.errors.forEach((e) => console.log(`  ✗ ${e}`));
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  SEED COMPLETE                                                    ║');
  console.log(`║  Domains:  ${String(domainIdMap.size).padEnd(3)} / ${totals.domains}                                             ║`);
  console.log(`║  MPS:      ${String(mpsIdMap.size).padEnd(3)} / ${totals.mps}                                            ║`);
  console.log(`║  Criteria: ${String(criteriaResult.inserted).padEnd(3)} / ${totals.criteria}                                            ║`);
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (criteriaResult.errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
