import { describe, expect, it } from 'vitest';
import {
  allQuestionsAnswered,
  assessmentDomains,
  assessmentQuestions,
  createAssessmentReport,
  nextMaturityLevel,
  scoreToLevel,
} from './freeAssessment';

describe('free assessment scoring model', () => {
  it('maps score thresholds to maturity levels', () => {
    expect(scoreToLevel(1)).toBe('Basic');
    expect(scoreToLevel(1.79)).toBe('Basic');
    expect(scoreToLevel(1.8)).toBe('Reactive');
    expect(scoreToLevel(2.59)).toBe('Reactive');
    expect(scoreToLevel(2.6)).toBe('Compliant');
    expect(scoreToLevel(3.39)).toBe('Compliant');
    expect(scoreToLevel(3.4)).toBe('Proactive');
    expect(scoreToLevel(4.19)).toBe('Proactive');
    expect(scoreToLevel(4.2)).toBe('Resilient');
  });

  it('returns the next maturity level until the resilient ceiling', () => {
    expect(nextMaturityLevel('Basic')).toBe('Reactive');
    expect(nextMaturityLevel('Reactive')).toBe('Compliant');
    expect(nextMaturityLevel('Compliant')).toBe('Proactive');
    expect(nextMaturityLevel('Proactive')).toBe('Resilient');
    expect(nextMaturityLevel('Resilient')).toBeNull();
  });

  it('requires all questions to be answered before report generation', () => {
    const partialAnswers = { [assessmentQuestions[0].id]: 3 };
    const completeAnswers = Object.fromEntries(
      assessmentQuestions.map((question) => [question.id, 4]),
    );

    expect(allQuestionsAnswered(partialAnswers)).toBe(false);
    expect(allQuestionsAnswered(completeAnswers)).toBe(true);
  });

  it('creates an overall and per-domain report from completed answers', () => {
    const answers = Object.fromEntries(
      assessmentQuestions.map((question) => [question.id, 4]),
    );

    const report = createAssessmentReport(
      answers,
      {
        organisationName: 'Example Mine',
        sector: 'diamond mining',
      },
      '2026-06-04T00:00:00.000Z',
    );

    expect(report.overallScore).toBe(4);
    expect(report.overallLevel).toBe('Proactive');
    expect(report.domainResults).toHaveLength(assessmentDomains.length);
    expect(report.executiveSummary).toContain('Example Mine');
    expect(report.resilienceSummary).toContain('Maturity Roadmap');
    expect(report.domainResults.every((result) => result.improvementParagraph.length > 0)).toBe(true);
  });
});
