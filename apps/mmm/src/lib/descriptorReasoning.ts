import {
  retrieveDescriptorLearningRecords,
  type DescriptorLearningRecord,
  type DescriptorLearningRetrievalContext,
  type DescriptorSourceMode,
  type RankedDescriptorLearningRecord,
} from './descriptorLearningRetrieval';

export type DescriptorMaturityLevel = 'Basic' | 'Reactive' | 'Compliant' | 'Proactive' | 'Resilient';

export type DescriptorGenerationContext = {
  tenantId: string;
  frameworkId?: string | null;
  criterionId?: string | null;
  criterionCode?: string | null;
  criterionText: string;
  domainName?: string | null;
  mpsName?: string | null;
  intentStatement?: string | null;
  sourceMode: DescriptorSourceMode;
  learningRecords?: DescriptorLearningRecord[];
};

export type DescriptorReasoningResult = {
  sourceMode: DescriptorSourceMode;
  originalCriterionText: string;
  cleanedActionableClause: string;
  evidenceStateClause: string;
  grammarShape: string;
  learningApplied: boolean;
  fallbackMethodologyApplied: boolean;
  retrievedLearningRecords: RankedDescriptorLearningRecord[];
  descriptors: Array<{
    level: DescriptorMaturityLevel;
    descriptorText: string;
  }>;
};

const MATURITY_STATES: Array<{ level: DescriptorMaturityLevel; suffix: string }> = [
  {
    level: 'Basic',
    suffix:
      'is absent, weak, outdated, inconsistent, fragmented, or person-dependent. Records do not yet show repeatable ownership, communication, execution, review, or reliable evidence retention.',
  },
  {
    level: 'Reactive',
    suffix:
      'exists in some form, but records show activity mainly after incidents, audits, management pressure, or visible non-conformance. Evidence supports response and correction, but not stable ownership, prevention, or sustained control.',
  },
  {
    level: 'Compliant',
    suffix:
      'is current, complete, traceable, approved where required, and available for auditor verification at the required minimum cadence.',
  },
  {
    level: 'Proactive',
    suffix:
      'shows owner-led, risk-based review and improvement. Records include metrics or trends, incident or change learning, accountable actions, and evidence that control effectiveness is improved before failures recur.',
  },
  {
    level: 'Resilient',
    suffix:
      'is embedded into routines, systems, monitoring, and escalation so the control remains effective during staff turnover, abnormal operations, or disruption.',
  },
];

function stripDescriptorGuidanceNotes(value: string): string {
  return value
    .replace(/\s*\((?:Note|Guidance|Reference):[^)]*\)/gi, '')
    .replace(/\s*\[(?:Note|Guidance|Reference):[^\]]*\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripCriterionBoilerplate(value: string): string {
  return value
    .replace(/\s+\[uploaded_source\]$/i, '')
    .replace(/\s*\(hybrid source\)\.?$/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[.;:,]+$/g, '')
    .trim();
}

function inferPlural(subject: string): boolean {
  const lower = subject.trim().toLowerCase();
  if (!lower) return false;
  if (/\band\b|\/|,/.test(lower)) return true;
  if (/\b(?:schemes?|measures?|procedures?|policies?|metrics?|roles?|responsibilities|changes)\b/.test(lower)) return true;
  const lastToken = lower.split(/\s+/).slice(-1)[0]?.replace(/[^a-z]/g, '') ?? '';
  if (!lastToken) return false;
  if (/(ss|us|is)$/.test(lastToken)) return false;
  return /(ies|ses|xes|zes|ches|shes|s)$/.test(lastToken);
}

export function classifyDescriptorGrammarShape(criterionText: string): string {
  const clean = stripCriterionBoilerplate(stripDescriptorGuidanceNotes(criterionText));
  if (/^Review and approval of\b/i.test(clean)) return 'nominal_review_and_approval';
  if (/^(Assessing|Reviewing)\b/i.test(clean)) return 'leading_gerund';
  if (/\b(?:are|is)\s+to\s+be\b/i.test(clean)) return 'passive_instruction_state';
  if (/\b(?:should|will|shall|must)\s+be\b/i.test(clean)) return 'instruction_word_state';
  if (/^To\s+\w+/i.test(clean)) return 'infinitive_purpose_clause';
  return 'standard_clause';
}

export function cleanCriterionForDescriptorReasoning(criterionText: string): string {
  return stripCriterionBoilerplate(stripDescriptorGuidanceNotes(criterionText));
}

export function reconstructEvidenceStateClause(criterionText: string): string {
  let text = cleanCriterionForDescriptorReasoning(criterionText);

  text = text.replace(/^Review and approval of\s+(.+?)\s+for\s+(.+)$/i, (_match, object: string, qualifier: string) => {
    const normalizedObject = object.trim();
    return `${normalizedObject} ${inferPlural(normalizedObject) ? 'are' : 'is'} reviewed and approved for ${qualifier.trim()}`;
  });

  text = text.replace(/^Assessing\s+(.+?)\s+for\s+their\s+impact\s+on\s+Security$/i, (_match, subject: string) => {
    return `${subject.trim()} are assessed for their impact on Security`;
  });

  text = text.replace(/^Assessing\s+(.+?)\s+for\s+its\s+impact\s+on\s+Security$/i, (_match, subject: string) => {
    return `${subject.trim()} is assessed for its impact on Security`;
  });

  text = text.replace(/\bare\s+to\s+be\b/gi, 'are');
  text = text.replace(/\bis\s+to\s+be\b/gi, 'is');
  text = text.replace(/\bshould\s+be\b/gi, (match, offset: number, full: string) => {
    const before = full.slice(0, offset).trim();
    return inferPlural(before) ? 'are' : 'is';
  });
  text = text.replace(/\bwill\s+be\b/gi, (match, offset: number, full: string) => {
    const before = full.slice(0, offset).trim();
    return inferPlural(before) ? 'are' : 'is';
  });
  text = text.replace(/\bshall\s+be\b/gi, (match, offset: number, full: string) => {
    const before = full.slice(0, offset).trim();
    return inferPlural(before) ? 'are' : 'is';
  });
  text = text.replace(/\bmust\s+be\b/gi, (match, offset: number, full: string) => {
    const before = full.slice(0, offset).trim();
    return inferPlural(before) ? 'are' : 'is';
  });

  return text.replace(/\s+/g, ' ').replace(/[.;:,]+$/g, '').trim();
}

function buildRetrievalContext(context: DescriptorGenerationContext): DescriptorLearningRetrievalContext {
  return {
    tenantId: context.tenantId,
    frameworkId: context.frameworkId ?? null,
    criterionId: context.criterionId ?? null,
    sourceMode: context.sourceMode,
    grammarShape: classifyDescriptorGrammarShape(context.criterionText),
  };
}

export function generateDescriptorReasoningResult(context: DescriptorGenerationContext): DescriptorReasoningResult {
  const grammarShape = classifyDescriptorGrammarShape(context.criterionText);
  const cleanedActionableClause = cleanCriterionForDescriptorReasoning(context.criterionText);
  const evidenceStateClause = reconstructEvidenceStateClause(context.criterionText);
  const retrievedLearningRecords = retrieveDescriptorLearningRecords(
    context.learningRecords ?? [],
    buildRetrievalContext(context),
    7,
  );

  const learningApplied = retrievedLearningRecords.length > 0;

  return {
    sourceMode: context.sourceMode,
    originalCriterionText: context.criterionText,
    cleanedActionableClause,
    evidenceStateClause,
    grammarShape,
    learningApplied,
    fallbackMethodologyApplied: !learningApplied,
    retrievedLearningRecords,
    descriptors: MATURITY_STATES.map(({ level, suffix }) => ({
      level,
      descriptorText: `Evidence that ${evidenceStateClause} ${suffix}`,
    })),
  };
}
