/**
 * Lucara Diamond Control Standard (LDCS) — Canonical Seed Data
 *
 * Source: modules/mat/Lucara_Diamond_Control_Standard_seed_info.md
 * Version: LDCS v4 (2021-11-16)
 *
 * Structure: 5 Domains → 25 MPS → Criteria (Required Actions)
 *
 * This file is the authoritative canonical seed for the MAT app.
 * It is used by the seed-ldcs-criteria Edge Function to populate
 * the domains, mini_performance_standards, and criteria tables.
 *
 * NUMBERING NOTE: Criterion numbers exactly mirror the LDCS source document.
 * Apparent gaps (e.g., 6.11, 8.7, 10.11) are intentional — those numbers are
 * either sub-criteria entries or guidance notes in the source that are not
 * Required Actions, and are therefore excluded from this seed.
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
              'The Security Policy will be a short document outlining the company\'s and individual\'s obligations regarding Security.',
          },
          {
            number: '1.3',
            title:
              'The Policy will be incorporated into the operation\'s induction process for all personnel, contractors and visitors.',
          },
          {
            number: '1.4',
            title:
              'HODs and leaders at all levels will endeavour to make the Security Policy relevant to their place of operation.',
          },
          {
            number: '1.4.1',
            title:
              'Through setting a limited number of Golden Rules that define applicable security requirements based on the associated risk profile.',
          },
          {
            number: '1.4.2',
            title:
              'Through short awareness and training sessions on aspects of Security conducted at least bi-weekly.',
          },
          {
            number: '1.5',
            title:
              'Specific Security accountabilities and performance measures will be documented within role descriptions for those in high-risk diamond areas.',
          },
          {
            number: '1.6',
            title:
              'Leadership teams in high-risk diamond areas will regularly assess the Security culture and adherence to security protocols.',
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
            number: '2.2',
            title:
              'The Chain of Custody Matrix lists all accountable and responsible people from MD and GM to Mining Operations and Support Services.',
          },
          {
            number: '2.3',
            title:
              'The chain of custody document will be reviewed at least annually and in the event of any personnel or process changes.',
          },
          {
            number: '2.4',
            title:
              'Managers in the chain of custody will be accountable for the effective delivery of Security in their area of control.',
          },
          {
            number: '2.5',
            title:
              'Security roles and responsibilities are to be clearly defined and presented in the form of a RACI chart.',
          },
          {
            number: '2.6',
            title:
              'The DCC will be chaired by the most senior executive and have responsibility for ensuring an effective Security programme.',
          },
          {
            number: '2.7',
            title:
              'The DCC will have a clear mandate and charter endorsed by the MD of Lucara Botswana and most senior executive.',
          },
          {
            number: '2.8',
            title:
              'The DCC will meet at least four times a year with minutes, actions, decisions and individual accountabilities recorded.',
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
              'In handling and accounting for diamonds, operations will seek to give a single individual responsibility for only one of: custody, authorisations, record keeping, or reconciliation.',
          },
          {
            number: '3.2',
            title:
              'Operations will ensure separation of duties between Security Operations, Technical Security Systems provisioning and Investigations.',
          },
          {
            number: '3.3',
            title:
              'The security function will be organisationally distinct from the operational management of the diamond recovery or handling process.',
          },
          {
            number: '3.4',
            title:
              'Security personnel will not be involved in the process or operational management of diamond areas.',
          },
          {
            number: '3.5',
            title:
              'Lucara Botswana will have a person designated as the Risk Manager: Security responsible for security operations at KDM and DTP.',
          },
          {
            number: '3.6',
            title:
              'The Risk Manager: Security is accountable for the delivery of security at both operations in accordance with this standard.',
          },
          {
            number: '3.7',
            title:
              'The Risk Manager: Security will report independently and directly to the most senior executive of the operation.',
          },
          {
            number: '3.8',
            title:
              'The Risk Manager: Security will have regular interaction with the most senior executive not less than twice monthly.',
          },
          {
            number: '3.9',
            title:
              'The Risk Manager: Security will support HODs in achieving Security in their areas through enforcing the intent of this standard.',
          },
          {
            number: '3.10',
            title:
              'The Risk Manager: Security will use metrics to improve security effectiveness and report on performance to the DCC.',
          },
          {
            number: '3.11',
            title:
              'There will be complete and current security procedures and post orders in place for all roles as defined by the review dates.',
          },
          {
            number: '3.12',
            title:
              'Where the Risk Manager: Security has other roles (e.g., Airport/Airstrip Manager), majority of time should be spent on Security issues.',
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
            number: '4.2',
            title:
              'The Enterprise Risk Management (ERM) Policy outlines Lucara Botswana\'s risk management process and responsibilities.',
          },
          {
            number: '4.3',
            title:
              'The ERM Policy should be read in conjunction with the Lucara Botswana Enterprise Risk Management Framework.',
          },
          {
            number: '4.4',
            title:
              'The ERM Policy and Framework should serve as the basis for Security Risk Management assessments.',
          },
          {
            number: '4.5',
            title:
              'All personnel should utilise existing risk processes like daily task risk assessments, PTOs, RCAs and associated software.',
          },
          {
            number: '4.6',
            title:
              'The basic format and structure of risk registers will be consistent as defined in the ERM Framework and Policy.',
          },
          {
            number: '4.7',
            title:
              'Risk register examples include: Risk Impact Rating, Likelihood/Probability Rating, Control Effectiveness, Speed of Onset, Risk Trending.',
          },
          {
            number: '4.8',
            title:
              'Controls or action plans will be developed to manage Security risks to as low as reasonably practical (ALARP).',
          },
          {
            number: '4.9',
            title:
              'Risk registers will be current and regularly reviewed.',
          },
          {
            number: '4.10',
            title:
              'The status of all high and very high risks will be reviewed and updated at least annually.',
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
          {
            number: '5.3',
            title:
              'There will be periodic checks by the legal appointee/Head of Department to ensure compliance with applicable legal requirements.',
          },
          {
            number: '5.4',
            title:
              'Legal and other requirements will inform associated direct or indirect security controls and associated procedures.',
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
            number: '6.2',
            title:
              'Establish In-Situ DSFD — Revenue Distributions per facie/source.',
          },
          {
            number: '6.3',
            title:
              'Establish In-Situ DSFD — strive for total content curve but at minimum establish a baseline for monitoring.',
          },
          {
            number: '6.4',
            title:
              'Establish In-Situ DSFD — Use Diamond Footprints and Revenue Footprints for key production nodes.',
          },
          {
            number: '6.5',
            title:
              'Granulometry analysis will be applied to liberation to balance recovery and damage avoidance.',
          },
          {
            number: '6.6',
            title:
              'Implement process modelling to determine optimum liberation circuit settings.',
          },
          {
            number: '6.7',
            title:
              'Determine settings and operating parameters specific to liberation of diamonds from different ore types.',
          },
          {
            number: '6.8',
            title:
              'Blasting parameters will be optimised and applied to maximise diamond liberation and minimise diamond damage.',
          },
          {
            number: '6.9',
            title:
              'Evaluate liberation performance and trends monthly.',
          },
          {
            number: '6.10',
            title:
              'Ensure routine equipment monitoring and assessment is in place and functioning for all liberation circuit equipment.',
          },
          {
            number: '6.12',
            title:
              'Ad hoc sampling and assessment of all diamond concentration points in the process.',
          },
          {
            number: '6.13',
            title:
              'Production will be routinely reconciled with the head feed to ensure mass balance is maintained.',
          },
          {
            number: '6.14',
            title:
              'Regular tailings audits will be carried out to determine free diamond content in tailings.',
          },
          {
            number: '6.15',
            title:
              'Compare In-Situ DSFDs, adjusted for ROM and stockpile sources, with actual recoveries.',
          },
          {
            number: '6.16',
            title:
              'Utilise DSFDs and stone counts to check for unexpected changes to the diamond population.',
          },
          {
            number: '6.17',
            title:
              'Utilise In-Situ DSFDs, Diamond Footprints and Revenue Footprints to calibrate the process.',
          },
          {
            number: '6.18',
            title:
              'Production batches will be tracked daily and daily MCF (Mass Concentration Factor) calculated.',
          },
          {
            number: '6.19',
            title:
              'Maintain database of complete conceptual and as-installed process flow diagrams.',
          },
          {
            number: '6.20',
            title:
              'Maintain database of all equipment design specifications with design basis and performance expectations.',
          },
          {
            number: '6.27',
            title:
              'Document Standard Operating Procedures (SOPs) for all circuits and major equipment items.',
          },
          {
            number: '6.28',
            title:
              'Ensure all documentation and databases are kept up to date and readily accessible.',
          },
          {
            number: '6.33',
            title:
              'Use Management Information Systems (MIS) data historian to capture and store real-time process data.',
          },
          {
            number: '6.34',
            title:
              'Use MIS data to routinely analyse process performance to ensure targets are being met.',
          },
          {
            number: '6.43',
            title:
              'Process operational audits — regular internal audits of process conformance to procedures and standards.',
          },
          {
            number: '6.44',
            title:
              'Process audits — annual external audits of process conformance to design basis and LDCS.',
          },
          {
            number: '6.50',
            title:
              'Formally review cut-off sizes at least annually.',
          },
          {
            number: '6.75',
            title:
              'Stock accounting takes place by means of a single electronic diamond stock accounting system.',
          },
          {
            number: '6.77',
            title:
              'Production data will be used to identify discrepancies and initiate investigations.',
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
            number: '7.2',
            title:
              'Process plants will be established on hard concrete bases with full containment capability for diamond product.',
          },
          {
            number: '7.3',
            title:
              'For operations and maintenance tasks with significant security implications, two-person accountability will be applied.',
          },
          {
            number: '7.4',
            title:
              'The Process Manager and Engineering Manager will determine the list of authorised process parameter adjustments.',
          },
          {
            number: '7.5',
            title:
              'The process flow will be used to confirm that no manipulations that could reduce recovery have been made.',
          },
          {
            number: '7.6',
            title:
              'There are likely to be more manipulations that could adversely affect recovery — these should be identified and controlled.',
          },
          {
            number: '7.7',
            title:
              'Power failures/blackouts can cause severe degradation of process performance — procedures will be in place to manage this.',
          },
          {
            number: '7.8',
            title:
              'Operating and maintenance processes and practices will be developed with Security in mind.',
          },
          {
            number: '7.9',
            title:
              'Task level documentation for operations and maintenance will be developed, maintained and used.',
          },
          {
            number: '7.10',
            title:
              'Task level documentation will include guidance for significant risk activities and processes.',
          },
          {
            number: '7.11',
            title:
              'Documentation for significant risk processes, plant and equipment will address security implications.',
          },
          {
            number: '7.13',
            title:
              'Infrastructure, plant and equipment will be maintained, inspected and serviced to the relevant standards.',
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
            number: '8.2',
            title:
              'Unplanned Maintenance: A procedure will be in place that ensures security controls are maintained during unplanned maintenance.',
          },
          {
            number: '8.3',
            title:
              'Equipment and machinery will be classified according to Security risk and will be maintained accordingly.',
          },
          {
            number: '8.4',
            title:
              'Security personnel shall attend maintenance planning meetings and review maintenance schedules.',
          },
          {
            number: '8.5',
            title:
              'Demarcation and adhering to demarcation: the storage of equipment and materials in diamond areas will be strictly controlled.',
          },
          {
            number: '8.6',
            title:
              'Following maintenance or the change-out of equipment, all waste and debris will be removed from diamond areas.',
          },
          {
            number: '8.8',
            title:
              'Equipment in high-risk areas resulting in spillage will be repaired immediately and the spillage recovered.',
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
            number: '9.2',
            title:
              'The organisation should develop, approve, publish, communicate and implement a change control procedure.',
          },
          {
            number: '9.3',
            title:
              'Operations and Security will develop joint procedures in the management of change for diamond areas.',
          },
          {
            number: '9.4',
            title:
              'Operating sites will have a management of change process that covers all aspects of change in diamond areas.',
          },
          {
            number: '9.5',
            title:
              'All people on site will be trained to identify the change management requirements and follow the established procedure.',
          },
          {
            number: '9.6',
            title:
              'Workplace design and engineering in high-risk diamond areas will incorporate security requirements from the outset.',
          },
          {
            number: '9.7',
            title:
              'Management of change is critical to the upkeep of technical systems — security must be included in all change processes.',
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
            number: '10.2',
            title:
              'Early warning detection systems shall report unauthorised access attempts in real time.',
          },
          {
            number: '10.3',
            title:
              'All diamond handling areas and associated process units will be covered by CCTV surveillance.',
          },
          {
            number: '10.4',
            title:
              'Security systems design will be integrated and automated, providing an auditable trail of all diamond handling activities.',
          },
          {
            number: '10.5',
            title:
              'Access control data will be submitted to predictive trend and pattern analysis to identify anomalies.',
          },
          {
            number: '10.6',
            title:
              'For each occurrence where diamonds are accessed or processed outside normal procedures, a formal record will be kept.',
          },
          {
            number: '10.7',
            title:
              'All procedures will be current, signed off, readily available, communicated and reviewed continually.',
          },
          {
            number: '10.8',
            title:
              'There will be a procedure governing the opening and closing of diamond safes and vaults.',
          },
          {
            number: '10.9',
            title:
              'Diamond movement between buildings and facilities should be conducted in accordance with a formal product movement procedure.',
          },
          {
            number: '10.10',
            title:
              'There will be a procedure governing reporting and recording of all incidents during diamond sorting and sales.',
          },
          {
            number: '10.11',
            title:
              'System information contained in the Stock Management System will be provided in a clear unambiguous format, and reports collated with other security information.',
          },
          {
            number: '10.12',
            title:
              'Sales operations will establish reconciliation points, report anomalies, conduct regular audits, and provide information for investigations.',
          },
          {
            number: '10.14',
            title:
              'All weighing discrepancies that are out of tolerance (OTL) should be recorded and investigated.',
          },
          {
            number: '10.17',
            title:
              'The principle of "two-person accountability" should always be applied during diamond weighing and handling.',
          },
          {
            number: '10.21',
            title:
              'Diamond batches will always be accompanied by systems generated documentation.',
          },
          {
            number: '10.29',
            title:
              'A well-defined procedure involving the principles of "two-person accountability" will be in place for weight reconciliation.',
          },
          {
            number: '10.32',
            title:
              'Diamond reconciliation system access will be subject to biometric authentication.',
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
            number: '11.2',
            title:
              'Technical control of people accessing and egressing controlled areas will be in place.',
          },
          {
            number: '11.3',
            title:
              'Perimeter security and protection measures should be in place for all trading operation areas.',
          },
          {
            number: '11.4',
            title:
              'Physical barriers, the minimum design specifications of which are detailed in Annex F, will be in place.',
          },
          {
            number: '11.5',
            title:
              'All procedures will be current, signed off, readily available, communicated and reviewed continually.',
          },
          {
            number: '11.6',
            title:
              'Material handling systems and processes should be designed to minimise the opportunity for theft.',
          },
          {
            number: '11.7',
            title:
              'A procedure governing the opening and removal of diamonds from secure storage will be in place.',
          },
          {
            number: '11.8',
            title:
              'The procedure governing opening and removal of diamonds from technical sorting equipment must require that external technicians may not handle diamonds directly, and all purging and faults must be reported via the security incident management system.',
          },
          {
            number: '11.9',
            title:
              'There will be a procedure governing reporting and recording of all incidents during trading operations.',
          },
          {
            number: '11.14',
            title:
              'When or wherever two-person accountability and/or next level approval is required, this will be clearly documented.',
          },
          {
            number: '11.17',
            title:
              'Individual user access to diamond stock control programmes will be controlled using biometric authentication and defined user fields.',
          },
          {
            number: '11.22',
            title:
              'The transfer of diamond stock between two different stock accounting systems will be governed by a formal procedure.',
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
            number: '12.2',
            title:
              'The community programme will establish regular meetings with local community representatives.',
          },
          {
            number: '12.3',
            title:
              'There will be a formal and effective grievance procedure that is accessible to the local community.',
          },
          {
            number: '12.4',
            title:
              'Each Lucara Botswana operation will conduct a human rights and community impact assessment.',
          },
          {
            number: '12.5',
            title:
              'Where Government Security forces are used in support of Lucara Botswana operations, their conduct will be monitored.',
          },
          {
            number: '12.6',
            title:
              'Where there is significant risk of allegations of human rights abuses, a formal risk assessment will be conducted.',
          },
          {
            number: '12.7',
            title:
              'Where public security forces use Firearms, Lucara Botswana will comply with the Voluntary Principles on Security and Human Rights.',
          },
          {
            number: '12.8',
            title:
              'Lucara Botswana operations will provide training and resources to ensure human rights obligations are met.',
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
          {
            number: '13.6',
            title:
              'Where there is a requirement for interventions into the diamond process, additional security measures will be in place.',
          },
          {
            number: '13.7',
            title:
              'Security awareness training delivered to those people working in diamond areas will include LDCS requirements.',
          },
          {
            number: '13.8',
            title:
              'All departments should produce Standard Operating Procedures (SOPs) for their activities in diamond areas.',
          },
          {
            number: '13.9',
            title:
              'The SOPs for higher security risk diamond areas will be developed jointly with the Security department.',
          },
          {
            number: '13.10',
            title:
              'The SOPs for higher security risk diamond areas should be reviewed at least annually.',
          },
          {
            number: '13.11',
            title:
              'The operation is encouraged to develop a short list of Golden Rules for diamond areas.',
          },
          {
            number: '13.12',
            title:
              'The Human Resources team will develop a clearly understood and transparent disciplinary procedure.',
          },
          {
            number: '13.13',
            title:
              'The Human Resources team will inform the security team within one working day of any employee leaving diamond areas.',
          },
          {
            number: '13.14',
            title:
              'All employees that have worked in diamond areas will be asked for an exit interview.',
          },
          {
            number: '13.15',
            title:
              'People leaving employment within diamond areas or Lucara Botswana will have their access rights removed immediately.',
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
            number: '14.2',
            title:
              'All employees should have a basic understanding of the security requirements applicable to their role.',
          },
          {
            number: '14.3',
            title:
              'All employees should know how to report security incidents and/or suspected wrongdoing.',
          },
          {
            number: '14.4',
            title:
              'An employee engagement survey should be conducted at least every two years to assess security culture.',
          },
          {
            number: '14.5',
            title:
              'All leaders/HODs/Chain of Custody Owners at the operation should be able to answer key security questions about their area.',
          },
          {
            number: '14.6',
            title:
              'The security department will assist Leaders/HODs in developing and delivering Security communications.',
          },
          {
            number: '14.7',
            title:
              'The Risk Manager: Security will brief all new managers and Heads of Department on their security responsibilities.',
          },
          {
            number: '14.8',
            title:
              'Each operation will determine working languages in diamond areas to ensure communications are effective.',
          },
          {
            number: '14.9',
            title:
              'Each operation should develop signage supporting security requirements to be posted prominently at diamond area entry points.',
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
            number: '15.2',
            title:
              'An incident escalation procedure should be developed and followed.',
          },
          {
            number: '15.3',
            title:
              'All incidents, including near hits, should be reported.',
          },
          {
            number: '15.4',
            title:
              'All incidents will be classified and reported based on maximum potential severity.',
          },
          {
            number: '15.5',
            title:
              'All recordable losses, significant incidents and near misses will be analysed and lessons shared.',
          },
          {
            number: '15.6',
            title:
              'External reporting of incidents to regulators will occur in accordance with legal requirements.',
          },
          {
            number: '15.7',
            title:
              'For each incident, an accountable leader will be responsible for ensuring corrective actions are implemented.',
          },
          {
            number: '15.8',
            title:
              'Investigations will be supported by competent people, appropriate tools and resources.',
          },
          {
            number: '15.9',
            title:
              'There will be a process for recording, approving and implementing corrective actions from incident investigations.',
          },
          {
            number: '15.10',
            title:
              'There will be a process for reviewing the status and effectiveness of corrective actions from incident investigations.',
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
            number: '16.2',
            title:
              'Evidence that input was received from stakeholders and accommodated in the physical security design.',
          },
          {
            number: '16.3',
            title:
              'Procedures that support the physical security policy must be in place, aligned, approved, implemented and reviewed.',
          },
          {
            number: '16.4',
            title:
              'The physical security design will be based on a risk assessment covering operations, threats, vulnerabilities and prioritised risks.',
          },
          {
            number: '16.5',
            title:
              'Risk awareness is reflected within the various levels of the organisation from senior management to employee level.',
          },
          {
            number: '16.6',
            title:
              'A mechanism to identify and mitigate critical risks supported by a formal risk management process.',
          },
          {
            number: '16.8',
            title:
              'Risk management and risk assessment practices are integrated in the management of change process.',
          },
          {
            number: '16.9',
            title:
              'Risk mitigation implementation is well supported by a quality assurance process.',
          },
          {
            number: '16.10',
            title:
              'The physical security controls outlined in Annex F will be in place at all Lucara Botswana diamond operations.',
          },
          {
            number: '16.11',
            title:
              'Diamond facilities will have perimeter protection measures in place commensurate with the risk.',
          },
          {
            number: '16.12',
            title:
              'The organisation must develop, communicate, implement and review access control procedures.',
          },
          {
            number: '16.13',
            title:
              'The access control procedure must contain minimum requirements for authorisation and access management.',
          },
          {
            number: '16.14',
            title:
              'Access and egress patterns for all people, vehicles and equipment into diamond areas will be monitored and analysed.',
          },
          {
            number: '16.15',
            title:
              'Reasons for access into high-risk areas, processes and machines will be authorised and recorded.',
          },
          {
            number: '16.16',
            title:
              'Reasons for access into high-risk areas will be based on a "need to enter" principle.',
          },
          {
            number: '16.17',
            title:
              'Visual chain of custody of interactions between product and people in diamond handling areas will be maintained.',
          },
          {
            number: '16.18',
            title:
              'Camera placement and application will be fit for purpose, based on functional requirements, technical specifications, recording and redundancy.',
          },
          {
            number: '16.19',
            title:
              'A fixed camera footprint will be used for diamond areas and PTZ cameras for perimeter and access monitoring.',
          },
          {
            number: '16.20',
            title:
              'Standby, portable cameras should be readily available inside high-risk diamond areas.',
          },
          {
            number: '16.21',
            title:
              'At dedicated entry points of the mine and all diamond handling areas, searching of people will be conducted.',
          },
          {
            number: '16.22',
            title:
              'A zone-based security model (White, Green, Blue, Red areas) will be applied to all Lucara Botswana facilities.',
          },
          {
            number: '16.23',
            title:
              'The red or high-risk area in a mining concession must comply with minimum physical security design specifications.',
          },
          {
            number: '16.25',
            title:
              'The surveillance room and security data equipment room will be physically secured and access controlled.',
          },
          {
            number: '16.26',
            title:
              'The use and distribution of keys and padlocks will be tightly controlled with an auditable record.',
          },
          {
            number: '16.30',
            title:
              'The placement of a seal will not be considered as providing a substitute for physical security measures.',
          },
          {
            number: '16.31',
            title:
              'The selection of seals will be based on the security requirement and the level of detection needed.',
          },
          {
            number: '16.32',
            title:
              'The Risk Manager (Security) will arrange for regular, random seal audits to verify seal integrity.',
          },
          {
            number: '16.33',
            title:
              'All personnel, personal possessions, items, equipment and vehicles will be subject to searching on exit from diamond areas.',
          },
          {
            number: '16.34',
            title:
              'Movement of personnel, goods, equipment and vehicles into and out of diamond areas will be recorded.',
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
            number: '17.2',
            title:
              'The technical security controls detailed in Annex G will be implemented and maintained.',
          },
          {
            number: '17.3',
            title:
              'All security electronic controls will be monitored on a live basis to ensure availability and functionality.',
          },
          {
            number: '17.4',
            title:
              'Security control equipment and security panels will be fitted with tamper detection and alarms.',
          },
          {
            number: '17.5',
            title:
              'Lucara Botswana users of the security network and systems will be subject to identity and access management controls.',
          },
          {
            number: '17.6',
            title:
              'Passwords will comply with Lucara Botswana IT Security Policy.',
          },
          {
            number: '17.7',
            title:
              'Admin accounts will not be used unless required by technical staff performing administrative functions.',
          },
          {
            number: '17.8',
            title:
              'In the event of a power failure all security systems in the Red Area will remain operational using UPS.',
          },
          {
            number: '17.9',
            title:
              'In the event that the power failure will last for periods longer than UPS backup, a generator will provide power.',
          },
          {
            number: '17.10',
            title:
              'All Lucara Botswana security systems are to have spike and surge protection fitted.',
          },
          {
            number: '17.11',
            title:
              'Continuity of power supply will be provided for all technical security systems.',
          },
          {
            number: '17.12',
            title:
              'Computing and electronic equipment that contributes to the security system will be kept within the environmental parameters recommended by the manufacturer.',
          },
          {
            number: '17.13',
            title:
              'All decisions surrounding the maintenance, design and removal of security systems will involve the Risk Manager: Security.',
          },
          {
            number: '17.14',
            title:
              'A preventative maintenance plan will be in place to test and maintain all security systems.',
          },
          {
            number: '17.15',
            title:
              'Technical systems will have a dedicated resource to oversee their management and maintenance.',
          },
          {
            number: '17.17',
            title:
              'A dedicated fault reporting mechanism will be in place allowing reporting, logging, communication and interrogation of asset faults.',
          },
          {
            number: '17.18',
            title:
              'All high-risk security equipment will have a disaster recovery plan in place.',
          },
          {
            number: '17.21',
            title:
              'A comprehensive and accurate inventory is maintained containing systems information, vulnerabilities, failures, downtime and protocols.',
          },
          {
            number: '17.25',
            title:
              'The organisation has designed and implemented suitable malware controls, policies, architectures and records.',
          },
          {
            number: '17.28',
            title:
              'Clear-desk clear-screen policies and procedures are in place and compliance is monitored.',
          },
          {
            number: '17.30',
            title:
              'An auditable redundancy strategy is in place to ensure continuity of security systems.',
          },
          {
            number: '17.31',
            title:
              'Technical architectures/designs provide for multi-factor authentication, access control, encryption and asset inventory.',
          },
          {
            number: '17.35',
            title:
              'The information security policy lays out the organisation\'s information security objectives and continuous improvement commitment.',
          },
          {
            number: '17.36',
            title:
              'The Information Security Management System (ISMS) scope clearly defines what is included and excluded.',
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
            number: '18.2',
            title:
              'Lucara Botswana operations will observe the applicable Lucara Botswana policies on security operations.',
          },
          {
            number: '18.3',
            title:
              'These policies and their application will form part of all security personnel training and induction.',
          },
          {
            number: '18.4',
            title:
              'Included in the training will be all identified stakeholders including private security providers and public security.',
          },
          {
            number: '18.5',
            title:
              'While Public Security is not directly under Lucara Botswana management, their conduct will be monitored.',
          },
          {
            number: '18.6',
            title:
              'The Risk Manager (Security) will report directly to the senior most manager at the operation.',
          },
          {
            number: '18.7',
            title:
              'All Lucara Botswana Security and Private Security contractors will be licensed, insured and compliant with applicable laws.',
          },
          {
            number: '18.8',
            title:
              'The procurement of private security contractors will comply with VPSHR and include relevant contractual requirements.',
          },
          {
            number: '18.9',
            title:
              'Have a written protocol in place with public security that defines roles, responsibilities and rules of engagement.',
          },
          {
            number: '18.10',
            title:
              'The written protocol with public security may include but need not be limited to a formal contract, jointly agreed procedure, signed-off minutes of meetings, or a memorandum of understanding.',
          },
          {
            number: '18.11',
            title:
              'Risk officers including private security providers will receive comprehensive training covering all key security competencies.',
          },
          {
            number: '18.15',
            title:
              'There will be a process in place to inform artisanal miners of the legal consequences of trespassing.',
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
            number: '19.2',
            title:
              'In all cases, local regulatory or legal requirements will be observed for product shipment.',
          },
          {
            number: '19.3',
            title:
              'A product shipment risk assessment will take place if there are any changes to the standard shipment procedure.',
          },
          {
            number: '19.4',
            title:
              'All persons involved with the Product Shipment Services must be trained and vetted.',
          },
          {
            number: '19.5',
            title:
              'If any part of the product shipment process is outsourced, a written contractual agreement will be in place.',
          },
          {
            number: '19.6',
            title:
              'Any product shipment contractor used by Lucara Botswana is subject to audit and compliance checks.',
          },
          {
            number: '19.7',
            title:
              'Insurance should be in place for Product Shipment covering full replacement value.',
          },
          {
            number: '19.8',
            title:
              'As part of Security Governance, the insurance policy must be reviewed annually to ensure adequacy.',
          },
          {
            number: '19.9',
            title:
              'The Risk Manager (Security) will develop a protocol together with the product shipment contractor.',
          },
          {
            number: '19.10',
            title:
              'The product shipment contractor will comply with minimum criteria for security, personnel, communications and protocols.',
          },
          {
            number: '19.11',
            title:
              'The sealing of the product into tamper-resistant containers before shipment will follow a formal procedure.',
          },
          {
            number: '19.13',
            title:
              'The receipt of product shipments and their initial processing will follow a formal verification procedure.',
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
            number: '20.2',
            title:
              'The Risk Manager (Security) is to ensure that surveillance personnel are trained and qualified.',
          },
          {
            number: '20.3',
            title:
              'The Risk Manager (Security) will maintain a profile for each surveillance operator.',
          },
          {
            number: '20.4',
            title:
              'Transfer into or out of the surveillance function from any other security function will be formally managed.',
          },
          {
            number: '20.5',
            title:
              'Effective surveillance requires knowledge of processes, physical layout, people and procedures.',
          },
          {
            number: '20.6',
            title:
              'All surveillance personnel will be conversant and compliant with local legislation and surveillance obligations.',
          },
          {
            number: '20.7',
            title:
              'Surveillance will be conducted from a secure facility.',
          },
          {
            number: '20.8',
            title:
              'The areas where surveillance control data or imagery is stored or processed will be physically secured.',
          },
          {
            number: '20.9',
            title:
              'Access to surveillance and control facilities is to be limited to authorised personnel only.',
          },
          {
            number: '20.10',
            title:
              'Standard Operating Procedures will be established that allow the surveillance function to operate consistently and effectively.',
          },
          {
            number: '20.11',
            title:
              'The Risk Manager (Security) is to implement a Quality Management System for the surveillance function.',
          },
          {
            number: '20.12',
            title:
              'Where there is any breach of the safety standards and it is captured on surveillance, it will be reported immediately.',
          },
          {
            number: '20.13',
            title:
              'Any safety or security incident whether observed in real time or retrospectively will be reported immediately.',
          },
          {
            number: '20.14',
            title:
              'Incident reports will be generated for every instance of a break in process integrity in diamond areas.',
          },
          {
            number: '20.25',
            title:
              'Data and CCTV footage gathered by the surveillance function is the property of Lucara Botswana.',
          },
          {
            number: '20.30',
            title:
              'Data and imagery should be stored and retained for a period to fit local legislation and audit requirements.',
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
            number: '21.2',
            title:
              'Included in the BCP and BCM software is also the management of change and improvement process.',
          },
          {
            number: '21.3',
            title:
              'Major risks are identified as part of the risk management process and captured in the risk register.',
          },
          {
            number: '21.4',
            title:
              'Major risks are clearly defined in the risk management process with controls and action plans.',
          },
          {
            number: '21.5',
            title:
              'Trigger action response plans (TARPs) have been compiled for each major risk identified.',
          },
          {
            number: '21.6',
            title:
              'The TARP forms the underpinnings of the business resilience plan for each major risk.',
          },
          {
            number: '21.7',
            title:
              'Operations will include in their planning and documentation responses to natural disasters, cybercrime and civil emergencies.',
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
            number: '22.2',
            title:
              'An effective document control process will be in place covering version control, distribution, storage and disposal.',
          },
          {
            number: '22.3',
            title:
              'The security framework will be appropriately documented including charter, strategy plans, resilience plans, SOPs, security plans and technical diagrams.',
          },
          {
            number: '22.4',
            title:
              'Metrics will be developed for Security activities so that performance can be measured and reported to management.',
          },
          {
            number: '22.5',
            title:
              'Metrics for Technical Security Systems will be used and include camera availability, server restarts, maintenance and key faults.',
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
            number: '23.2',
            title:
              'An escalation procedure and matrix should be included in the investigations procedure.',
          },
          {
            number: '23.3',
            title:
              'The line manager of the area impacted by the incident is accountable for ensuring the investigation is conducted.',
          },
          {
            number: '23.4',
            title:
              'All incidents of failures in Security will be recorded in the incident management system.',
          },
          {
            number: '23.5',
            title:
              'Where general issues are identified that lead to losses such as poor process adherence, corrective action will be taken.',
          },
          {
            number: '23.6',
            title:
              'Security incidents other than those involving Diamonds, such as theft of other assets, will also be investigated.',
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
            number: '24.2',
            title:
              'At planned intervals, operating sites will internally evaluate and review the Security programme.',
          },
          {
            number: '24.3',
            title:
              'Periodic external independent audits and reviews will be planned and conducted.',
          },
          {
            number: '24.4',
            title:
              'Operating sites will have a systematic process to manage issues and actions arising from audits and reviews.',
          },
          {
            number: '24.5',
            title:
              'An annual audit plan approved by the Chief Risk Officer will be in place for all Lucara Botswana operations.',
          },
          {
            number: '24.6',
            title:
              'Lucara Botswana operating sites will complete security framework management reviews covering policy suitability, risk management and performance.',
          },
          {
            number: '24.7',
            title:
              'The review will identify areas for improvement and clearly state reasons for change, extent of change, timeline and accountability.',
          },
          {
            number: '24.8',
            title:
              'Records of completed management reviews will be retained with agreed actions and accountability.',
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
            number: '25.2',
            title:
              'Formal and regular interactions with Government and Local Law Enforcement agencies will be maintained.',
          },
          {
            number: '25.3',
            title:
              'Formal meetings should be held at least once per quarter with key government and law enforcement stakeholders.',
          },
          {
            number: '25.4',
            title:
              'The MD Lucara should be briefed in detail on the discussions during meetings with government stakeholders.',
          },
          {
            number: '25.5',
            title:
              'Regular interactions (at least monthly) should be maintained with industry intelligence networks.',
          },
          {
            number: '25.7',
            title:
              'Persons assigned to the intelligence support activities should be vetted and trained for the role.',
          },
          {
            number: '25.8',
            title:
              'The security incident reporting system should be analysed on a regular basis to identify intelligence patterns.',
          },
          {
            number: '25.9',
            title:
              'Other systems like the access control system and seal management system should be analysed to generate intelligence.',
          },
        ],
      },
    ],
  },
];

/**
 * Convenience accessor: total count of criteria across all domains and MPS
 */
export function countLdcsCriteria(): number {
  return LDCS_SEED.reduce(
    (total, domain) =>
      total +
      domain.mini_performance_standards.reduce(
        (mpsTotal, mps) => mpsTotal + mps.criteria.length,
        0,
      ),
    0,
  );
}

/**
 * Convenience accessor: total count of MPS across all domains
 */
export function countLdcsMps(): number {
  return LDCS_SEED.reduce(
    (total, domain) => total + domain.mini_performance_standards.length,
    0,
  );
}
