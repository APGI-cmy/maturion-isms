/**
 * Lucara Diamond Control Standard (LDCS) — Canonical Seed Data
 *
 * Source: modules/mat/Lucara_Diamond_Control_Standard_seed_info.md
 * Version: LDCS v4 (2021-11-16)
 *
 * Structure: 5 Domains → 25 MPS → 1–2 representative criteria per MPS
 *
 * This file is the authoritative canonical seed for the MAT frontend.
 * 1–2 representative Required Actions per MPS are included verbatim from
 * the LDCS source document. Full criteria population is done via AI
 * document parsing in a future issue.
 *
 * Used by: seed runner (see modules/mat/frontend/src/data/run-ldcs-seed.ts)
 * Also available in: modules/mat/src/data/ldcs-seed.ts (extended version)
 *
 * Architecture: modules/mat/02-architecture/data-architecture.md
 * FRS: FR-004 (Criteria Upload & Seed)
 * TRS: TR-047 (Criteria Management)
 * Wave: Wave 6 — Canonical Seed
 */

export interface LdcsCriterion {
  number: string;
  title: string;
}

export interface LdcsMps {
  number: string;
  name: string;
  intent: string;
  criteria: LdcsCriterion[];
}

export interface LdcsDomain {
  name: string;
  sort_order: number;
  mini_performance_standards: LdcsMps[];
}

export const LDCS_SEED: LdcsDomain[] = [
  {
    name: 'Leadership and Governance',
    sort_order: 1,
    mini_performance_standards: [
      {
        number: 'MPS 1',
        name: 'Leadership',
        intent:
          'To set clear expectations for Security Management that are codified with a policy and supporting procedures which are consistently applied by leaders at all levels.',
        criteria: [
          {
            number: '1.1',
            title:
              'A Security Policy signed by the most senior executive for Lucara Botswana should be prominently displayed at KDM and DTP.',
          },
          {
            number: '1.2',
            title:
              "The Security Policy will be a short document outlining the company's and individual's obligations regarding Security.",
          },
        ],
      },
      {
        number: 'MPS 2',
        name: 'Chain of Custody and Diamond Control Committee',
        intent:
          'To provide clear accountability for the custody of diamond material from the ore body to the point of onward shipping to the customer.',
        criteria: [
          {
            number: '2.1',
            title:
              'The chain of custody for each operation will be set out in matrix form with an accountable manager named for each part.',
          },
          {
            number: '2.6',
            title:
              'The DCC will be chaired by the most senior executive and have responsibility for ensuring an effective Security programme.',
          },
        ],
      },
      {
        number: 'MPS 3',
        name: 'Separation of Duties',
        intent:
          'To reduce the risks of error and fraud by dividing or allocating tasks among various individuals.',
        criteria: [
          {
            number: '3.1',
            title:
              'In handling and accounting for diamonds, operations will give a single individual responsibility for only one of: custody, authorisations, record keeping, or reconciliation.',
          },
          {
            number: '3.3',
            title:
              'The security function will be organisationally distinct from the operational management of the diamond recovery or handling process.',
          },
        ],
      },
      {
        number: 'MPS 4',
        name: 'Risk Management',
        intent:
          'To ensure that we focus our efforts and resources on the greatest risks using a common Lucara Botswana risk management approach.',
        criteria: [
          {
            number: '4.1',
            title:
              'Lucara Botswana has formulated and adopted a Risk Management Policy and Framework.',
          },
          {
            number: '4.11',
            title:
              'Critical Controls will be identified for high and very high risks in diamond areas and resourced to be effective and resilient.',
          },
        ],
      },
      {
        number: 'MPS 5',
        name: 'Legal and Regulatory Requirements',
        intent:
          'To ensure that Lucara Botswana is aware of and complies with all relevant legal and regulatory requirements.',
        criteria: [
          {
            number: '5.1',
            title:
              'Each operating site will have a legal appointee responsible for identifying and monitoring compliance with applicable legal and regulatory requirements.',
          },
          {
            number: '5.2',
            title:
              'A legal register or similar document should be centrally available identifying all relevant legal and regulatory requirements.',
          },
        ],
      },
    ],
  },
  {
    name: 'Process Integrity',
    sort_order: 2,
    mini_performance_standards: [
      {
        number: 'MPS 6',
        name: 'Diamond Value Management',
        intent:
          'To ensure that the maximum value is recovered from the ore body and that losses are minimised throughout the process.',
        criteria: [
          {
            number: '6.1',
            title:
              'Establish In-Situ Diamond Size Frequency Distributions (DSFD) — particle size distribution per facie/source.',
          },
          {
            number: '6.13',
            title:
              'Production will be routinely reconciled with the head feed to ensure mass balance is maintained.',
          },
        ],
      },
      {
        number: 'MPS 7',
        name: 'Process Control',
        intent:
          'To ensure that operational failures are minimised and the process of mining, liberating, washing, recovering, sorting and selling diamond is clearly understood, in control, measured and reconciled throughout.',
        criteria: [
          {
            number: '7.3',
            title:
              'For operations and maintenance tasks with significant security implications, two-person accountability will be applied.',
          },
          {
            number: '7.14',
            title:
              'When in diamond areas, specific behaviours will be included in procedures to minimise theft opportunity.',
          },
        ],
      },
      {
        number: 'MPS 8',
        name: 'Maintenance and Housekeeping',
        intent:
          'To ensure that maintenance and housekeeping activities in diamond areas are conducted in a manner that minimises loss.',
        criteria: [
          {
            number: '8.1',
            title:
              'Planned Maintenance Shutdowns: A procedure will be in place that ensures security controls are maintained during shutdowns.',
          },
          {
            number: '8.4',
            title:
              'Security personnel shall attend maintenance planning meetings and review maintenance schedules.',
          },
        ],
      },
      {
        number: 'MPS 9',
        name: 'Management of Change',
        intent:
          'To ensure that changes to processes, procedures and equipment in diamond areas are managed in a controlled manner.',
        criteria: [
          {
            number: '9.1',
            title:
              'Change management procedures for any modifications to procedures in diamond areas will be in place.',
          },
          {
            number: '9.5',
            title:
              'All people on site will be trained to identify the change management requirements and follow the established procedure.',
          },
        ],
      },
      {
        number: 'MPS 10',
        name: 'Sales and Auction Process',
        intent:
          'To ensure that the sale and auction of diamonds is conducted in a secure, controlled and auditable manner.',
        criteria: [
          {
            number: '10.1',
            title:
              'All diamond processing operations should be conducted inside an enclosed and fully access-controlled environment.',
          },
          {
            number: '10.17',
            title:
              'The principle of "two-person accountability" should always be applied during diamond weighing and handling.',
          },
        ],
      },
      {
        number: 'MPS 11',
        name: 'Trading Operations',
        intent:
          'To ensure that diamond trading operations are conducted in a secure, controlled and auditable manner.',
        criteria: [
          {
            number: '11.1',
            title:
              'Records of all access transactions to trading operations should be kept and analysed on a regular basis.',
          },
          {
            number: '11.14',
            title:
              'When or wherever two-person accountability and/or next level approval is required, this will be clearly documented.',
          },
        ],
      },
    ],
  },
  {
    name: 'People and Culture',
    sort_order: 3,
    mini_performance_standards: [
      {
        number: 'MPS 12',
        name: 'Human Rights and Community',
        intent:
          'To ensure that Lucara Botswana operations respect the human rights of all stakeholders and maintain positive community relations.',
        criteria: [
          {
            number: '12.1',
            title:
              'Lucara Botswana operations will establish a community programme to manage relationships with the local community.',
          },
          {
            number: '12.4',
            title:
              'Each Lucara Botswana operation will conduct a human rights and community impact assessment.',
          },
        ],
      },
      {
        number: 'MPS 13',
        name: 'Reliable People',
        intent:
          'To ensure that all personnel in diamond areas are reliable, trained and subject to appropriate vetting and monitoring.',
        criteria: [
          {
            number: '13.3',
            title:
              'Induction processes including Security issues will be in place at all Lucara Botswana operations.',
          },
          {
            number: '13.5',
            title:
              'All personnel working in diamond areas (including Security personnel) will be subject to regular random searches.',
          },
        ],
      },
      {
        number: 'MPS 14',
        name: 'Engagement and Communication',
        intent:
          'To ensure that all stakeholders are engaged and informed about security requirements and obligations.',
        criteria: [
          {
            number: '14.1',
            title:
              'There will be an effective two-way Security communications programme in place at all Lucara Botswana operations.',
          },
          {
            number: '14.3',
            title:
              'All employees should know how to report security incidents and/or suspected wrongdoing.',
          },
        ],
      },
      {
        number: 'MPS 15',
        name: 'Continuous Improvement',
        intent:
          'To ensure that Security performance is regularly reviewed and continuously improved.',
        criteria: [
          {
            number: '15.1',
            title:
              'Each site should have a system and procedure for managing Security incidents and near misses.',
          },
          {
            number: '15.11',
            title:
              'Learnings from significant Security incidents will be shared across Lucara Botswana operations.',
          },
        ],
      },
    ],
  },
  {
    name: 'Protection',
    sort_order: 4,
    mini_performance_standards: [
      {
        number: 'MPS 16',
        name: 'Physical Security',
        intent:
          'To ensure that physical security controls protect diamond areas, people and assets from theft and loss.',
        criteria: [
          {
            number: '16.1',
            title:
              'A security policy must be in place, published, communicated, monitored and reviewed at least annually.',
          },
          {
            number: '16.22',
            title:
              'A zone-based security model (White, Green, Blue, Red areas) will be applied to all Lucara Botswana facilities.',
          },
        ],
      },
      {
        number: 'MPS 17',
        name: 'Technical Systems',
        intent:
          'To ensure that technical security systems effectively support the protection of diamonds and diamond operations.',
        criteria: [
          {
            number: '17.1',
            title:
              'In high-risk areas, controls will be selected and placed only based on a formal risk assessment.',
          },
          {
            number: '17.14',
            title:
              'A preventative maintenance plan will be in place to test and maintain all security systems.',
          },
        ],
      },
      {
        number: 'MPS 18',
        name: 'Security Operations (Patrolling and Guarding)',
        intent:
          'To ensure that security operations are conducted in a professional, effective and human-rights compliant manner.',
        criteria: [
          {
            number: '18.1',
            title:
              'All security personnel (employees and contractors) will be trained, vetted and assessed for suitability.',
          },
          {
            number: '18.8',
            title:
              'The procurement of private security contractors will comply with VPSHR and include relevant contractual requirements.',
          },
        ],
      },
      {
        number: 'MPS 19',
        name: 'Product Shipment',
        intent:
          'To ensure that the shipment of diamond product is conducted in a secure, auditable and insurance-compliant manner.',
        criteria: [
          {
            number: '19.1',
            title:
              'An approved and signed off procedure governing the manner in which diamond product is shipped will be in place.',
          },
          {
            number: '19.7',
            title:
              'Insurance should be in place for Product Shipment covering full replacement value.',
          },
        ],
      },
      {
        number: 'MPS 20',
        name: 'Surveillance and Analysis',
        intent:
          'To ensure that surveillance activities effectively detect and deter theft and loss in diamond operations.',
        criteria: [
          {
            number: '20.1',
            title:
              'Evidence that the use and placement of surveillance cameras are fit for purpose based on a formal assessment.',
          },
          {
            number: '20.7',
            title: 'Surveillance will be conducted from a secure facility.',
          },
        ],
      },
      {
        number: 'MPS 21',
        name: 'Resilience and Recovery',
        intent:
          'To ensure that Lucara Botswana operations can recover quickly from significant security incidents and disruptions.',
        criteria: [
          {
            number: '21.1',
            title:
              'A Business Continuity Plan (BCP) will be in place covering functions, skillsets, equipment, documentation, suppliers and IT systems.',
          },
          {
            number: '21.5',
            title:
              'Trigger action response plans (TARPs) have been compiled for each major risk identified.',
          },
        ],
      },
    ],
  },
  {
    name: 'Proof',
    sort_order: 5,
    mini_performance_standards: [
      {
        number: 'MPS 22',
        name: 'Documentation and Metrics',
        intent:
          'To ensure that security activities are documented, measured and reported to management in a timely and accurate manner.',
        criteria: [
          {
            number: '22.1',
            title:
              'Security framework documents will be prepared in a style and format consistent with Lucara Botswana document standards.',
          },
          {
            number: '22.4',
            title:
              'Metrics will be developed for Security activities so that performance can be measured and reported to management.',
          },
        ],
      },
      {
        number: 'MPS 23',
        name: 'Investigations into Suspected Wrongdoing',
        intent:
          'To ensure that investigations into suspected wrongdoing are conducted in a fair, objective and legally compliant manner.',
        criteria: [
          {
            number: '23.1',
            title:
              'The organisation should develop, approve, publish, communicate, implement and review a procedure governing security investigations.',
          },
          {
            number: '23.7',
            title:
              'In all cases investigations and inquiries will be fair, objective and legally compliant, analysing root cause and preserving evidence.',
          },
        ],
      },
      {
        number: 'MPS 24',
        name: 'Audits and Review',
        intent:
          'To ensure that the Security programme is regularly audited and reviewed to confirm effectiveness and identify improvements.',
        criteria: [
          {
            number: '24.1',
            title:
              'Lucara Botswana workplaces will carry out regular planned area inspections to confirm security standards are being maintained.',
          },
          {
            number: '24.5',
            title:
              'An annual audit plan approved by the Chief Risk Officer will be in place for all Lucara Botswana operations.',
          },
        ],
      },
      {
        number: 'MPS 25',
        name: 'Intelligence',
        intent:
          'To ensure that Lucara Botswana has access to timely and accurate intelligence to support security decision-making.',
        criteria: [
          {
            number: '25.1',
            title:
              'Lucara Botswana should have an internal capability to support the collection and analysis of security intelligence.',
          },
          {
            number: '25.5',
            title:
              'Regular interactions (at least monthly) should be maintained with industry intelligence networks.',
          },
        ],
      },
    ],
  },
];
