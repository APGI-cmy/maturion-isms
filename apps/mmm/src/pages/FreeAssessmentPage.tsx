/**
 * FreeAssessmentPage — Generic MPS-Level Psychometric Questionnaire
 *
 * Assessment version: generic-mps-baseline-v1
 * Structure: 5 domains × 5 MPSs × 1 diagnostic question = 25 questions total
 * Scoring: A=0.0 (reactive), B=0.5 (developing), C=1.0 (systematic)
 * Questions are industry-agnostic and evidence/behaviour-oriented.
 *
 * AIMC/KUC note: Generic MPS content not yet available in AIMC/KUC knowledge store.
 * This ships a static v1 question bank as an interim implementation.
 * Follow-up required: maturion-isms — ingest generic-mps-baseline-v1 through KUC path.
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useFreeAssessmentStore } from '@/store/freeAssessmentStore';

export const ASSESSMENT_VERSION = 'generic-mps-baseline-v1';

type ChoiceValue = 'A' | 'B' | 'C';

interface MpsQuestion {
  mps_id: string;
  mps_name: string;
  question_id: string;
  question: string;
  options: { value: ChoiceValue; text: string }[];
}

interface DomainSection {
  domain_id: string;
  domain_name: string;
  mpss: MpsQuestion[];
}

export const QUESTION_BANK: DomainSection[] = [
  {
    domain_id: 'leadership-governance',
    domain_name: 'Leadership and Governance',
    mpss: [
      {
        mps_id: 'leadership-accountability',
        mps_name: 'Leadership Accountability',
        question_id: 'LG-01-Q1',
        question: 'When a significant control failure is discovered, what typically happens?',
        options: [
          { value: 'A', text: 'It is handled informally and may not be documented.' },
          { value: 'B', text: 'It is sometimes recorded but follow-up is inconsistent.' },
          { value: 'C', text: 'It is formally recorded, ownership is assigned, and tracked to closure with a review for recurrence.' },
        ],
      },
      {
        mps_id: 'ownership-custody',
        mps_name: 'Ownership and Custody of Critical Processes',
        question_id: 'LG-02-Q1',
        question: 'How are critical processes and assets assigned and maintained?',
        options: [
          { value: 'A', text: 'Ownership is assumed rather than formally defined.' },
          { value: 'B', text: 'Some processes have named owners, but accountability is not consistently enforced.' },
          { value: 'C', text: 'Every critical process and asset has a named, accountable owner with documented responsibilities.' },
        ],
      },
      {
        mps_id: 'separation-of-duties',
        mps_name: 'Separation of Duties and Independent Oversight',
        question_id: 'LG-03-Q1',
        question: 'How does your organisation prevent individuals from controlling an entire process end-to-end?',
        options: [
          { value: 'A', text: 'There is no deliberate separation; individuals may control whole processes.' },
          { value: 'B', text: 'Some separation exists but is not consistently documented or enforced.' },
          { value: 'C', text: 'Formal separation of duties is defined, documented, and independently verified.' },
        ],
      },
      {
        mps_id: 'risk-governance',
        mps_name: 'Risk Governance and Decision-Making',
        question_id: 'LG-04-Q1',
        question: 'How are risk decisions escalated and approved in your organisation?',
        options: [
          { value: 'A', text: 'Risk decisions are made informally, often by whoever is available.' },
          { value: 'B', text: 'There is an informal escalation path, but it is not consistently followed.' },
          { value: 'C', text: 'A defined risk governance framework exists with clear escalation paths, approval authorities, and documented decisions.' },
        ],
      },
      {
        mps_id: 'legal-regulatory',
        mps_name: 'Legal, Regulatory, and Policy Obligations',
        question_id: 'LG-05-Q1',
        question: 'How does your organisation track and respond to its legal and regulatory obligations?',
        options: [
          { value: 'A', text: 'Obligations are tracked informally and may not be up to date.' },
          { value: 'B', text: 'A register exists but is not regularly reviewed or linked to operational controls.' },
          { value: 'C', text: 'A current, complete register of obligations is linked to controls with assigned owners and review cycles.' },
        ],
      },
    ],
  },
  {
    domain_id: 'process-integrity',
    domain_name: 'Process Integrity',
    mpss: [
      {
        mps_id: 'process-definition',
        mps_name: 'Process Definition and Standardisation',
        question_id: 'PI-01-Q1',
        question: 'How are core operational processes documented in your organisation?',
        options: [
          { value: 'A', text: 'Processes are mostly undocumented or exist only in people\'s heads.' },
          { value: 'B', text: 'Some key processes are documented, but coverage is incomplete.' },
          { value: 'C', text: 'All core processes are formally documented, version-controlled, and accessible to relevant staff.' },
        ],
      },
      {
        mps_id: 'process-control',
        mps_name: 'Process Control and Operational Discipline',
        question_id: 'PI-02-Q1',
        question: 'When a process step is skipped or varied in practice, what happens?',
        options: [
          { value: 'A', text: 'Variations are common and generally go unnoticed.' },
          { value: 'B', text: 'Some variations are noticed but not always acted upon.' },
          { value: 'C', text: 'Variations trigger a documented deviation record and a review to determine if the procedure needs updating.' },
        ],
      },
      {
        mps_id: 'quality-assurance',
        mps_name: 'Quality Assurance and Performance Monitoring',
        question_id: 'PI-03-Q1',
        question: 'How does your organisation know whether its key processes are performing adequately?',
        options: [
          { value: 'A', text: 'Performance is assessed informally and reactively.' },
          { value: 'B', text: 'Some metrics exist but are not regularly reviewed or acted upon.' },
          { value: 'C', text: 'Key performance indicators are defined, measured, reported, and used in decision-making.' },
        ],
      },
      {
        mps_id: 'management-of-change',
        mps_name: 'Management of Change',
        question_id: 'PI-04-Q1',
        question: 'How are changes to critical processes or systems introduced?',
        options: [
          { value: 'A', text: 'Changes are made informally without a structured review.' },
          { value: 'B', text: 'Some changes go through review, but the process is inconsistently applied.' },
          { value: 'C', text: 'All changes follow a defined process including risk assessment, approval, testing, and rollback planning.' },
        ],
      },
      {
        mps_id: 'maintenance-resilience',
        mps_name: 'Maintenance, Housekeeping, and Operational Resilience',
        question_id: 'PI-05-Q1',
        question: 'How does your organisation ensure that critical systems and facilities are maintained?',
        options: [
          { value: 'A', text: 'Maintenance is reactive; things are fixed when they break.' },
          { value: 'B', text: 'There is some scheduled maintenance, but it is not fully documented or consistently completed.' },
          { value: 'C', text: 'A formal preventive maintenance schedule exists, is tracked to completion, and maintenance records are retained.' },
        ],
      },
    ],
  },
  {
    domain_id: 'people-culture',
    domain_name: 'People and Culture',
    mpss: [
      {
        mps_id: 'competence-readiness',
        mps_name: 'Competence and Role Readiness',
        question_id: 'PC-01-Q1',
        question: 'How does your organisation verify that people in critical roles have the required competence?',
        options: [
          { value: 'A', text: 'Competence is assumed based on title or tenure.' },
          { value: 'B', text: 'Some roles have competence requirements, but verification is inconsistent.' },
          { value: 'C', text: 'Requirements are defined for all critical roles, verified before appointment, and reassessed periodically.' },
        ],
      },
      {
        mps_id: 'screening-onboarding',
        mps_name: 'Screening, Onboarding, and Entrusted-Role Control',
        question_id: 'PC-02-Q1',
        question: 'What controls are in place when someone is appointed to a position of trust?',
        options: [
          { value: 'A', text: 'Minimal or no background screening; onboarding is informal.' },
          { value: 'B', text: 'Some screening is done but is not consistently applied to all trust roles.' },
          { value: 'C', text: 'Defined screening requirements are applied to all trust positions; onboarding includes access control and accountability acknowledgement.' },
        ],
      },
      {
        mps_id: 'training-awareness',
        mps_name: 'Training and Awareness',
        question_id: 'PC-03-Q1',
        question: 'How does your organisation ensure that staff understand their obligations related to security and compliance?',
        options: [
          { value: 'A', text: 'Training is ad hoc and awareness levels are unknown.' },
          { value: 'B', text: 'Some training exists but attendance and comprehension are not tracked.' },
          { value: 'C', text: 'A structured training programme exists, attendance is recorded, comprehension is tested, and refresher cycles are defined.' },
        ],
      },
      {
        mps_id: 'engagement-reporting',
        mps_name: 'Engagement, Communication, and Reporting Culture',
        question_id: 'PC-04-Q1',
        question: 'When a staff member notices something that looks wrong, what typically happens?',
        options: [
          { value: 'A', text: 'There is no formal channel; concerns may be ignored or discouraged.' },
          { value: 'B', text: 'People can report concerns, but feedback and follow-up are inconsistent.' },
          { value: 'C', text: 'A clear, accessible reporting channel exists; reports are acknowledged, acted on, and reporters are protected from retaliation.' },
        ],
      },
      {
        mps_id: 'ethics-consequence',
        mps_name: 'Ethics and Consequence Management',
        question_id: 'PC-05-Q1',
        question: 'How does your organisation respond when a conduct or ethics breach is confirmed?',
        options: [
          { value: 'A', text: 'Responses are informal and inconsistent; outcomes are not documented.' },
          { value: 'B', text: 'Some processes exist but are not applied consistently across the organisation.' },
          { value: 'C', text: 'A formal consequence management process exists, is consistently applied, and outcomes are documented.' },
        ],
      },
    ],
  },
  {
    domain_id: 'protection',
    domain_name: 'Protection',
    mpss: [
      {
        mps_id: 'physical-environmental',
        mps_name: 'Physical and Environmental Protection',
        question_id: 'PR-01-Q1',
        question: 'How does your organisation protect critical physical assets and environments?',
        options: [
          { value: 'A', text: 'Physical security is basic and largely undocumented.' },
          { value: 'B', text: 'Some physical controls exist but coverage and documentation are incomplete.' },
          { value: 'C', text: 'Physical and environmental controls are formally defined, regularly inspected, and tested.' },
        ],
      },
      {
        mps_id: 'access-control',
        mps_name: 'Access Control and Identity Assurance',
        question_id: 'PR-02-Q1',
        question: 'How is access to sensitive systems and areas granted and reviewed?',
        options: [
          { value: 'A', text: 'Access is granted based on request; there is no formal review process.' },
          { value: 'B', text: 'Access is somewhat controlled, but reviews are infrequent or incomplete.' },
          { value: 'C', text: 'Access follows a defined provisioning process, is reviewed on a defined cycle, and revoked promptly when no longer required.' },
        ],
      },
      {
        mps_id: 'technical-monitoring',
        mps_name: 'Technical Systems and Monitoring',
        question_id: 'PR-03-Q1',
        question: 'How does your organisation detect abnormal or unauthorised activity on its technical systems?',
        options: [
          { value: 'A', text: 'Detection is reactive; issues are noticed when something breaks or is reported.' },
          { value: 'B', text: 'Some monitoring tools are in place but are not consistently reviewed.' },
          { value: 'C', text: 'Continuous monitoring is in place, with defined alerting thresholds and a reviewed log of events.' },
        ],
      },
      {
        mps_id: 'security-operations',
        mps_name: 'Security Operations and Response',
        question_id: 'PR-04-Q1',
        question: 'When a security incident occurs, how does your organisation respond?',
        options: [
          { value: 'A', text: 'Response is ad hoc with no defined process.' },
          { value: 'B', text: 'There is a general response process but it has not been formally tested.' },
          { value: 'C', text: 'A formal incident response plan exists, has been tested, roles are assigned, and exercises are conducted regularly.' },
        ],
      },
      {
        mps_id: 'transport-handover',
        mps_name: 'Transport, Movement, and Handover Control',
        question_id: 'PR-05-Q1',
        question: 'How does your organisation control the movement and handover of critical assets or information?',
        options: [
          { value: 'A', text: 'Handovers are informal and unrecorded.' },
          { value: 'B', text: 'Some documentation exists but is not consistently applied.' },
          { value: 'C', text: 'All movements and handovers of critical assets are formally recorded, authorised, and reconciled.' },
        ],
      },
    ],
  },
  {
    domain_id: 'proof-it-works',
    domain_name: 'Proof it Works',
    mpss: [
      {
        mps_id: 'documentation-records',
        mps_name: 'Documentation and Records',
        question_id: 'PW-01-Q1',
        question: 'How does your organisation manage its critical records and documentation?',
        options: [
          { value: 'A', text: 'Records are created informally with no consistent retention or retrieval process.' },
          { value: 'B', text: 'Some documentation standards exist but are not uniformly followed.' },
          { value: 'C', text: 'A records management policy defines creation, storage, retention, and retrieval; compliance is audited.' },
        ],
      },
      {
        mps_id: 'metrics-reporting',
        mps_name: 'Metrics and Management Reporting',
        question_id: 'PW-02-Q1',
        question: 'How does leadership receive information about the effectiveness of controls?',
        options: [
          { value: 'A', text: 'Reporting is informal and reactive; leadership learns of issues when things go wrong.' },
          { value: 'B', text: 'Some management reports are produced, but they are inconsistent in coverage or frequency.' },
          { value: 'C', text: 'Regular, structured management reports cover key control areas, trends, and open issues, reviewed in formal governance forums.' },
        ],
      },
      {
        mps_id: 'auditability',
        mps_name: 'Auditability and Independent Assurance',
        question_id: 'PW-03-Q1',
        question: 'When asked to demonstrate that a control is working, what evidence can your organisation produce?',
        options: [
          { value: 'A', text: 'Evidence is largely unavailable or would need to be reconstructed.' },
          { value: 'B', text: 'Some evidence exists but is incomplete or not consistently maintained.' },
          { value: 'C', text: 'Contemporaneous, auditable evidence is routinely produced and retained as a normal part of operations.' },
        ],
      },
      {
        mps_id: 'incident-learning',
        mps_name: 'Incident Learning and Continuous Improvement',
        question_id: 'PW-04-Q1',
        question: 'After a significant incident or near-miss, what typically happens?',
        options: [
          { value: 'A', text: 'The immediate issue is resolved and operations resume without formal review.' },
          { value: 'B', text: 'A review sometimes occurs but findings are not always acted upon.' },
          { value: 'C', text: 'A formal root cause analysis is conducted, improvement actions are assigned with owners and deadlines, and closure is verified.' },
        ],
      },
      {
        mps_id: 'resilience-recovery',
        mps_name: 'Resilience, Recovery, and Evidence of Effectiveness',
        question_id: 'PW-05-Q1',
        question: 'How confident is your organisation that it could continue operating after a significant disruption?',
        options: [
          { value: 'A', text: 'There is no tested recovery plan; recovery would be improvised.' },
          { value: 'B', text: 'Plans exist but have not been tested in practice.' },
          { value: 'C', text: 'Business continuity and recovery plans are tested on a defined schedule, results are documented, and gaps are remediated.' },
        ],
      },
    ],
  },
];

export default function FreeAssessmentPage() {
  const navigate = useNavigate();
  const setResult = useFreeAssessmentStore((s) => s.setResult);
  const [domainIndex, setDomainIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ChoiceValue>>({});

  const currentDomain = QUESTION_BANK[domainIndex];
  const totalDomains = QUESTION_BANK.length;
  const answeredInDomain = currentDomain.mpss.filter(
    (m) => responses[m.question_id] !== undefined,
  ).length;
  const domainComplete = answeredInDomain === currentDomain.mpss.length;
  const isLastDomain = domainIndex === totalDomains - 1;

  const totalQuestions = QUESTION_BANK.reduce((n, d) => n + d.mpss.length, 0);
  const totalAnswered = Object.keys(responses).length;

  const mutation = useMutation({
    mutationFn: async () => {
      const unanswered = QUESTION_BANK.flatMap((d) => d.mpss).filter(
        (m) => !responses[m.question_id],
      );
      if (unanswered.length > 0) {
        throw new Error('Please answer all questions before submitting.');
      }
      const assessmentResponses = QUESTION_BANK.flatMap((domain) =>
        domain.mpss.map((mps) => ({
          domain_id: domain.domain_id,
          mps_id: mps.mps_id,
          question_id: mps.question_id,
          response: responses[mps.question_id] as ChoiceValue,
        })),
      );
      const res = await fetch('/api/assessment/free/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_version: ASSESSMENT_VERSION,
          responses: assessmentResponses,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      return res.json();
    },
    onSuccess: (data) => {
      const domainNameMap = Object.fromEntries(
        QUESTION_BANK.map((d) => [d.domain_id, d.domain_name]),
      );
      const domainScores = (data.baseline_result.domain_scores ?? []).map(
        (ds: { domain_id: string; score: number }) => ({
          domain_id: ds.domain_id,
          domain_name: domainNameMap[ds.domain_id] ?? ds.domain_id,
          score: ds.score,
        }),
      );
      setResult(
        data.session_token,
        data.baseline_result.baseline_maturity,
        domainScores,
      );
      navigate('/free-assessment/result');
    },
  });

  const handleAnswer = (question_id: string, value: ChoiceValue) => {
    setResponses((prev) => ({ ...prev, [question_id]: value }));
  };

  return (
    <main className="assessment-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title">Free Maturity Assessment</h1>
          <p className="page-header__subtitle">
            This is a baseline diagnostic, not a certified audit. Answer based on what
            actually happens in your organisation, not what you would like to happen.
          </p>
        </div>

        <div className="assessment-progress" aria-label="Assessment progress">
          <span className="assessment-progress__label">
            Domain {domainIndex + 1} of {totalDomains}: <strong>{currentDomain.domain_name}</strong>
          </span>
          <span className="assessment-progress__count">
            {totalAnswered} / {totalQuestions} questions answered
          </span>
          <div className="assessment-progress__bar" role="progressbar"
            aria-valuenow={totalAnswered} aria-valuemin={0} aria-valuemax={totalQuestions}>
            <div
              className="assessment-progress__fill"
              style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="domain-section">
          <h2 className="domain-section__title">{currentDomain.domain_name}</h2>

          {currentDomain.mpss.map((mps) => (
            <div key={mps.question_id} className="mps-card" data-mps-id={mps.mps_id}>
              <p className="mps-card__mps-name">{mps.mps_name}</p>
              <p className="mps-card__question">{mps.question}</p>
              <div className="choice-group">
                {mps.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`choice-option${responses[mps.question_id] === opt.value ? ' choice-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={mps.question_id}
                      value={opt.value}
                      checked={responses[mps.question_id] === opt.value}
                      onChange={() => handleAnswer(mps.question_id, opt.value)}
                    />
                    <span className="choice-option__label">{opt.value}.</span>
                    <span className="choice-option__text">{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="assessment-nav">
          {domainIndex > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setDomainIndex((i) => i - 1)}
              disabled={mutation.isPending}
            >
              ← Previous Domain
            </button>
          )}

          {!isLastDomain ? (
            <button
              className="btn btn-primary"
              onClick={() => setDomainIndex((i) => i + 1)}
              disabled={!domainComplete || mutation.isPending}
            >
              Next Domain →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => mutation.mutate()}
              disabled={totalAnswered < totalQuestions || mutation.isPending}
            >
              {mutation.isPending ? 'Submitting…' : 'Submit Assessment'}
            </button>
          )}
        </div>

        {mutation.isError && (
          <p className="assessment-error" role="alert">
            Submission failed. Please try again.
          </p>
        )}
      </div>
    </main>
  );
}

