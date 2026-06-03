import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  extractMpsOrdinal,
  extractVerbatimCriteriaFromKnowledge,
  isSourceFaithfulStatement,
} from '../../../../apps/mmm/src/lib/verbatimCriteriaExtraction';

const ROOT = resolve(__dirname, '../../../..');

function readFile(relPath: string): string {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return readFileSync(abs, 'utf-8');
}

describe('T-MMM-DMC-028: VERBATIM criteria copy Required Actions from organisation source', () => {
  it('extracts Required Actions from the matching MPS block as uploaded-source criteria', () => {
    const sourceText = `
Leadership and Governance
MPS 1 - Leadership
Intent
To set clear expectations for Security Management.
Required Actions
A Security Policy signed by the most senior executive must be prominently displayed.
The Security Policy will outline the company's obligations and the individual's obligations regarding Security.
Leaders at all levels will endeavour to apply the Security Policy consistently.
Guidance
This section contains implementation guidance that must not become criteria.

MPS 2 - Chain of Custody and Security Control Committee
Intent
To define governance forums.
Required Actions
This second MPS action must not be returned for MPS 1.
`;

    const criteria = extractVerbatimCriteriaFromKnowledge({
      content: sourceText,
      mpsCode: 'D001.MPS001',
      mpsName: 'Leadership',
      domainName: 'Leadership and Governance',
    });

    expect(criteria).toEqual([
      {
        code: 'D001.MPS001.C001',
        statement: 'A Security Policy signed by the most senior executive must be prominently displayed.',
      },
      {
        code: 'D001.MPS001.C002',
        statement:
          "The Security Policy will outline the company's obligations and the individual's obligations regarding Security.",
      },
      {
        code: 'D001.MPS001.C003',
        statement: 'Leaders at all levels will endeavour to apply the Security Policy consistently.',
      },
    ]);
  });

  it('skips table-of-contents MPS headings and extracts the real Required Actions section', () => {
    const sourceText = `
MPS 1 - Leadership13
MPS 2 - Chain of Custody and Diamond Control Committee14
Overview
Format of Minimum Performance Standards
Required Actions: These actions are mandatory and should be implemented.
Leadership and Governance
MPS 1 - Leadership
Intent
To set clear expectations for Security Management that are codified with a policy and supporting procedures.
Required Actions
A Security Policy signed by the most senior executive for Lucara Botswana should be prominently displayed.
The Security Policy will be a short document that outlines company and individual obligations.
Guidance
Guidance reserved.
MPS 2 - Chain of Custody and Diamond Control Committee
Intent
To provide clear accountability for custody.
Required Actions
The chain of custody for each operation will be set out in matrix form.
`;

    const criteria = extractVerbatimCriteriaFromKnowledge({
      content: sourceText,
      mpsCode: 'D001.MPS001',
      mpsName: 'Leadership',
      domainName: 'Leadership and Governance',
    });

    expect(criteria).toEqual([
      {
        code: 'D001.MPS001.C001',
        statement:
          'A Security Policy signed by the most senior executive for Lucara Botswana should be prominently displayed.',
      },
      {
        code: 'D001.MPS001.C002',
        statement:
          'The Security Policy will be a short document that outlines company and individual obligations.',
      },
    ]);
  });

  it('extracts Required Actions when the MPS block ends without a Guidance heading', () => {
    const sourceText = `
Leadership and Governance
MPS 1 - Leadership
Intent
To set clear expectations for Security Management that are codified with a policy and supporting procedures.
Required Actions
A Security Policy signed by the most senior executive for Lucara Botswana should be prominently displayed.
The Security Policy will be a short document that outlines company and individual obligations.
MPS 2 - Chain of Custody and Diamond Control Committee
Intent
To provide clear accountability for custody.
Required Actions
The chain of custody for each operation will be set out in matrix form.
`;

    const criteria = extractVerbatimCriteriaFromKnowledge({
      content: sourceText,
      mpsCode: 'D001.MPS001',
      mpsName: 'Leadership',
      domainName: 'Leadership and Governance',
    });

    expect(criteria).toEqual([
      {
        code: 'D001.MPS001.C001',
        statement:
          'A Security Policy signed by the most senior executive for Lucara Botswana should be prominently displayed.',
      },
      {
        code: 'D001.MPS001.C002',
        statement:
          'The Security Policy will be a short document that outlines company and individual obligations.',
      },
    ]);
  });

  it('resolves MPS ordinals from MMM codes without coupling to document filenames', () => {
    expect(extractMpsOrdinal('D001.MPS001', 'Leadership')).toBe(1);
    expect(extractMpsOrdinal('MPS 12', 'Training')).toBe(12);
    expect(extractMpsOrdinal('D004.MPS021', 'Security Technology')).toBe(21);
  });

  it('rejects generic/hybrid statements that do not appear in the source text', () => {
    const sourceText = 'Required Actions\nA Security Policy signed by the most senior executive must be displayed.';
    expect(
      isSourceFaithfulStatement(
        sourceText,
        'A documented governance charter defines leadership responsibilities and decision authority',
      ),
    ).toBe(false);
    expect(
      isSourceFaithfulStatement(
        sourceText,
        'A Security Policy signed by the most senior executive must be displayed.',
      ),
    ).toBe(true);
  });

  it('wires CriteriaManagement to ai_knowledge before proposed/fallback criteria in VERBATIM mode', () => {
    const src = readFile('apps/mmm/src/components/assessment/CriteriaManagement.tsx');
    expect(src).toContain('extractVerbatimCriteriaFromKnowledge');
    expect(src).toContain(".from('ai_knowledge')");
    expect(src).toContain('const primaryVerbatimSourceDoc = modeContext.mode_source_documents.find');
    expect(src).toContain("doc.tags.some((tag) => tag === 'source_mode:VERBATIM')");
    expect(src).toContain('isSourceFaithfulStatement(processedVerbatimText, criterion.statement)');
    expect(src).toContain('no source Required Actions could be extracted');
  });

  it('records the QA red gate and architecture rule for source-faithful criteria', () => {
    const qa = readFile('modules/MMM/05-qa-to-red/dmc-subject-knowledge-qa-to-red.md');
    const arch = readFile('modules/MMM/04-architecture/dmc-subject-knowledge-architecture-addendum.md');
    expect(qa).toContain('T-MMM-DMC-028');
    expect(qa).toContain('VERBATIM Criteria Must Copy Required Actions From Organisation Source');
    expect(arch).toContain('VERBATIM criteria extraction');
    expect(arch).toContain('Required Actions');
  });
});
