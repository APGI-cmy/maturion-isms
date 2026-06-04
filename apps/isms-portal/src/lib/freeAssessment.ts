export type MaturityLevel = 'Basic' | 'Reactive' | 'Compliant' | 'Proactive' | 'Resilient';

export type AssessmentDomainId =
  | 'leadership-governance'
  | 'process-integrity'
  | 'people-culture'
  | 'protection'
  | 'proof';

export interface AssessmentDomain {
  id: AssessmentDomainId;
  name: string;
  summary: string;
}

export interface AssessmentQuestion {
  id: string;
  domainId: AssessmentDomainId;
  mps: string;
  question: string;
}

export interface AssessmentAnswerOption {
  value: number;
  label: string;
  descriptor: string;
}

export interface DomainResult {
  domainId: AssessmentDomainId;
  domainName: string;
  score: number;
  level: MaturityLevel;
  nextLevel: MaturityLevel | null;
  answeredQuestions: number;
  improvementParagraph: string;
}

export interface AssessmentContext {
  organisationName: string;
  sector: string;
}

export interface AssessmentReport {
  overallScore: number;
  overallLevel: MaturityLevel;
  domainResults: DomainResult[];
  executiveSummary: string;
  resilienceSummary: string;
  generatedAt: string;
}

export const maturityLevels: MaturityLevel[] = [
  'Basic',
  'Reactive',
  'Compliant',
  'Proactive',
  'Resilient',
];

export const assessmentDomains: AssessmentDomain[] = [
  {
    id: 'leadership-governance',
    name: 'Leadership and Governance',
    summary: 'Accountability, ownership, chain of custody, risk management and regulatory control.',
  },
  {
    id: 'process-integrity',
    name: 'Process Integrity',
    summary: 'Operational control, recovery, sales, change and failure-management processes.',
  },
  {
    id: 'people-culture',
    name: 'People and Culture',
    summary: 'Human rights, reliable people, engagement and learning culture.',
  },
  {
    id: 'protection',
    name: 'Protection',
    summary: 'Physical control, technical systems, operations, logistics, monitoring and recovery.',
  },
  {
    id: 'proof',
    name: 'Proof',
    summary: 'Evidence, reviews, investigations, metrics and management information.',
  },
];

export const answerOptions: AssessmentAnswerOption[] = [
  {
    value: 1,
    label: 'Person-dependent',
    descriptor: 'Mostly informal, inconsistent or dependent on individual effort.',
  },
  {
    value: 2,
    label: 'Event-led',
    descriptor: 'Controls exist in places, but updates mainly follow incidents, audits or pressure.',
  },
  {
    value: 3,
    label: 'Minimum controlled',
    descriptor: 'The required control exists, is documented, communicated and evidenced.',
  },
  {
    value: 4,
    label: 'Risk-led improvement',
    descriptor: 'Owners use risk reviews, metrics and trends to improve before failure.',
  },
  {
    value: 5,
    label: 'Embedded and recoverable',
    descriptor: 'Controls are embedded into routines or systems, monitored and resilient to disruption.',
  },
];

const questionRows: Array<[string, AssessmentDomainId, string, string]> = [
  ['mps-01', 'leadership-governance', 'MPS 1 - Leadership', 'How do leadership expectations become visible, understood and reinforced in daily work?'],
  ['mps-02', 'leadership-governance', 'MPS 2 - Chain of Custody and Security Control Committee', 'How reliably are accountable owners, decisions and actions recorded and followed through?'],
  ['mps-03', 'leadership-governance', 'MPS 3 - Separation of Duties', 'How consistently are custody, recording, reconciliation and approval duties separated?'],
  ['mps-04', 'leadership-governance', 'MPS 4 - Risk Management', 'How does the organisation keep risks current and linked to controls, owners and changes?'],
  ['mps-05', 'leadership-governance', 'MPS 5 - Legal and Regulatory Requirements', 'How reliably are obligations identified, assigned, reviewed and converted into controls?'],
  ['mps-06', 'process-integrity', 'MPS 6 - Quality Assurance and Process Integrity', 'How well can the organisation prove that process controls operate as intended?'],
  ['mps-07', 'process-integrity', 'MPS 7 - Process Control and Operational Failure Management', 'When abnormal conditions occur, how consistently are causes and actions closed?'],
  ['mps-08', 'process-integrity', 'MPS 8 - Maintenance and Housekeeping', 'How well are maintenance, housekeeping and waste-control activities managed?'],
  ['mps-09', 'process-integrity', 'MPS 9 - Management of Change', 'Before changes are made, how reliably are risks assessed, approved and monitored?'],
  ['mps-10', 'process-integrity', 'MPS 10 - Sales Controls, Ethics and Fraud Prevention', 'How consistently are sales, stock-control and ethics controls evidenced?'],
  ['mps-11-trading', 'process-integrity', 'MPS 11 - Trading Operations', 'How well are trading, sorting, handling and movement activities controlled?'],
  ['mps-11-human-rights', 'people-culture', 'MPS 11 - Human Rights and Community', 'How consistently are human-rights and community impacts managed?'],
  ['mps-12', 'people-culture', 'MPS 12 - Reliable People', 'How reliably are screening, vetting, induction, training and exit controls applied?'],
  ['mps-13', 'people-culture', 'MPS 13 - Engagement and Communication', 'How effectively are expectations communicated, understood and refreshed?'],
  ['mps-14', 'people-culture', 'MPS 14 - Continuous Improvement', 'After weak signals or reviews, how consistently does the organisation learn and improve?'],
  ['mps-15', 'protection', 'MPS 15 - Physical Security', 'How well are physical controls designed and maintained according to risk?'],
  ['mps-16', 'protection', 'MPS 16 - Technical Systems', 'How reliably do technical systems and recovery arrangements keep operating when stressed?'],
  ['mps-17', 'protection', 'MPS 17 - Security Operations', 'How consistently do operational routines, escalation and oversight operate to a measurable standard?'],
  ['mps-18', 'protection', 'MPS 18 - Secure Transport and Logistics', 'How well are product movements, handovers and route controls managed?'],
  ['mps-19', 'protection', 'MPS 19 - Surveillance and Analysis', 'How effectively does monitoring move from observation to analysis, response and feedback?'],
  ['mps-20', 'protection', 'MPS 20 - Resilience and Recovery', 'If a major disruption occurs, how well can the organisation continue, recover and learn?'],
  ['mps-21', 'proof', 'MPS 21 - Documentation and Metrics', 'How trustworthy, current and decision-useful are documents, metrics and records?'],
  ['mps-22', 'proof', 'MPS 22 - Investigations into Suspected Wrongdoing', 'When wrongdoing is suspected, how consistently are investigations controlled and converted into action?'],
  ['mps-23', 'proof', 'MPS 23 - Audits and Review', 'How reliably do audit and management-review activities test whether controls work?'],
  ['mps-24', 'proof', 'MPS 24 - Security Information Management and Analysis', 'How well is information collected, analysed, shared and used for decisions?'],
];

export const assessmentQuestions: AssessmentQuestion[] = questionRows.map(
  ([id, domainId, mps, question]) => ({ id, domainId, mps, question }),
);

const levelNarratives: Record<MaturityLevel, string> = {
  Basic: 'exposed and person-dependent',
  Reactive: 'responsive but still event-led',
  Compliant: 'controlled at the minimum baseline',
  Proactive: 'risk-led and improvement-oriented',
  Resilient: 'embedded, monitored and recoverable',
};

export function scoreToLevel(score: number): MaturityLevel {
  if (score < 1.8) return 'Basic';
  if (score < 2.6) return 'Reactive';
  if (score < 3.4) return 'Compliant';
  if (score < 4.2) return 'Proactive';
  return 'Resilient';
}

export function nextMaturityLevel(level: MaturityLevel): MaturityLevel | null {
  const index = maturityLevels.indexOf(level);
  return index >= 0 && index < maturityLevels.length - 1 ? maturityLevels[index + 1] : null;
}

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function createImprovementParagraph(domain: AssessmentDomain, level: MaturityLevel, nextLevel: MaturityLevel | null): string {
  if (!nextLevel) {
    return `${domain.name} is already presenting as resilient. Protect that advantage through monitoring, recovery testing, exception closure and leadership review.`;
  }

  const actions: Record<MaturityLevel, string> = {
    Basic: 'define accountable owners',
    Reactive: 'stabilise controls so action is not only event-led',
    Compliant: 'prove that controls are implemented and evidenced',
    Proactive: 'connect controls to metrics, trends and improvement',
    Resilient: 'embed controls into routines with monitoring, escalation and recovery evidence',
  };

  return `${domain.name} currently appears ${levelNarratives[level]}. To move toward ${nextLevel}, the organisation should ${actions[nextLevel]}. To achieve resilience, this domain must become independent of single individuals, supported by objective evidence, monitored for exceptions and capable of recovering during abnormal operations.`;
}

export function createAssessmentReport(
  answers: Record<string, number>,
  context: AssessmentContext,
  generatedAt = new Date().toISOString(),
): AssessmentReport {
  const domainResults = assessmentDomains.map((domain) => {
    const questions = assessmentQuestions.filter((question) => question.domainId === domain.id);
    const values = questions
      .map((question) => answers[question.id])
      .filter((value): value is number => typeof value === 'number');
    const average = values.length ? roundScore(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
    const level = scoreToLevel(average || 1);
    const nextLevel = nextMaturityLevel(level);

    return {
      domainId: domain.id,
      domainName: domain.name,
      score: average,
      level,
      nextLevel,
      answeredQuestions: values.length,
      improvementParagraph: createImprovementParagraph(domain, level, nextLevel),
    };
  });

  const answeredScores = domainResults.filter((result) => result.answeredQuestions > 0).map((result) => result.score);
  const overallScore = answeredScores.length
    ? roundScore(answeredScores.reduce((sum, score) => sum + score, 0) / answeredScores.length)
    : 0;
  const overallLevel = scoreToLevel(overallScore || 1);
  const orgName = context.organisationName.trim() || 'the organisation';
  const sector = context.sector.trim() || 'its sector';

  return {
    overallScore,
    overallLevel,
    domainResults,
    generatedAt,
    executiveSummary: `${orgName} presents an indicative ${overallLevel} operational maturity profile for ${sector}. This free assessment is a directional marketing report, not a formal audit opinion. It helps ESCO and senior stakeholders see where to focus next to move from minimum control presence toward operational excellence and resilience.`,
    resilienceSummary: `Subscribing to the Maturity Roadmap gives ${orgName} a structured path to operational excellence. The full roadmap uses sector-specific performance criteria across the five domains, built from approximately 900 to 1000 performance standards, to establish minimum performance expectations, assess evidence and guide improvement. AI-assisted analysis can then compare operating reality against the maturity descriptors, prioritise gaps and turn the assessment into a practical resilience programme rather than a once-off questionnaire.`,
  };
}

export function allQuestionsAnswered(answers: Record<string, number>): boolean {
  return assessmentQuestions.every((question) => typeof answers[question.id] === 'number');
}
