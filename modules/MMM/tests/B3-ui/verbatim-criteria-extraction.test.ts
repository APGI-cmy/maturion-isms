import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  extractMpsOrdinal,
  extractVerbatimCriteriaFromKnowledge,
  isSourceFaithfulStatement,
  mergeOverlappingTextChunks,
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

  it('merges overlapped ai_knowledge chunks before extracting criteria', () => {
    const sourceText = `
Leadership and Governance
MPS 1 - Leadership
Intent
To set clear expectations for Security Management that are codified with a policy and supporting procedures.
Required Actions
A Security Policy signed by the most senior executive for Lucara Botswana should be prominently displayed in all locations.
The Security Policy will be a short document that will at least outline the company's obligations and the individual's obligations regarding Security and/or security related activities.
The Policy will be incorporated into the operation's induction process for all personnel, contractors and visitors.
The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace.
Through setting a limited number of Golden Rules that define applicable security requirements based on the associated risk profile and acceptable risk tolerance
Through short awareness and training sessions on aspects of Security conducted at least bi-weekly or as often as security incidents and matters are brought to their attention.
Leadership teams in high-risk diamond areas will regularly assess the Security culture and adherence to security protocols of their workplaces.
MPS 2 - Chain of Custody and Diamond Control Committee
Intent
To provide clear accountability for custody.
Required Actions
The chain of custody for each operation will be set out in matrix form.
`;
    const cut = sourceText.indexOf("The Security Policy will be a short") + 44;
    const chunkA = sourceText.slice(0, cut);
    const chunkB = sourceText.slice(cut - 140);
    const merged = mergeOverlappingTextChunks([chunkA, chunkB]);

    const criteria = extractVerbatimCriteriaFromKnowledge({
      content: merged,
      mpsCode: 'D001.MPS001',
      mpsName: 'Leadership',
      domainName: 'Leadership and Governance',
    });

    expect(criteria.map((criterion) => criterion.statement)).toContain(
      "The Security Policy will be a short document that will at least outline the company's obligations and the individual's obligations regarding Security and/or security related activities.",
    );
    expect(criteria.map((criterion) => criterion.statement)).toContain(
      'The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace through setting a limited number of Golden Rules that define applicable security requirements based on the associated risk profile and acceptable risk tolerance',
    );
    expect(criteria.map((criterion) => criterion.statement)).toContain(
      'The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace through short awareness and training sessions on aspects of Security conducted at least bi-weekly or as often as security incidents and matters are brought to their attention.',
    );
    expect(criteria.some((criterion) => criterion.statement === 'The Security Policy will be a short')).toBe(false);
    expect(criteria.some((criterion) => criterion.statement.startsWith('visitors on entry'))).toBe(false);
  });

  it('uses child clauses as evidence-bearing criteria and skips the parent stem as standalone evidence', () => {
    const sourceText = `
Leadership and Governance
MPS 1 - Leadership
Intent
To set clear expectations for Security Management.
Required Actions
1.3 The Policy will be incorporated into the operation's induction process for all personnel.
1.4 The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace.
1.4.1 Through setting a limited number of Golden Rules that define applicable security requirements based on the associated risk profile and acceptable risk tolerance
1.4.2 Through short awareness and training sessions on aspects of Security conducted at least bi-weekly.
1.5 Where possible and applicable, specific Security accountabilities will be documented.
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

    expect(criteria.map((criterion) => criterion.statement)).toContain(
      'The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace through setting a limited number of Golden Rules that define applicable security requirements based on the associated risk profile and acceptable risk tolerance',
    );
    expect(criteria.map((criterion) => criterion.statement)).toContain(
      'The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace through short awareness and training sessions on aspects of Security conducted at least bi-weekly.',
    );
    expect(criteria.map((criterion) => criterion.statement)).not.toContain(
      'The Heads of Department / HODs, Superintendents, etc. - leaders at all levels - will endeavour to make the Security Policy relevant to their place of operation / workplace.',
    );
  });

  it('skips format-instruction Required Actions text and extracts later MPS criteria despite title wording drift', () => {
    const sourceText = `
Leadership and Governance
Format of Minimum Performance Standards
Intent: The reason why it is done.
Required Actions: These actions are mandatory and should be implemented.
Guidance: Guidance can be used to explain considerations.

MPS 1 - Leadership
Intent
To set clear expectations for Security Management.
Required Actions
1.1 A Security Policy signed by the most senior executive should be prominently displayed.

MPS 2 - Chain of Custody and Diamond Control Commi ttee Intent
To provide clear accountability for the custody of diamond material.
Required Actions
2.1 The chain of custody for each operation will be set out in matrix form, with an accountable manager named for each part of the chain.
2.2 The chain of custody document will be reviewed at least annually and in the event of any personnel or process changes.
2.7 The DCC will have a clear mandate and charter. As a minimum this will include:
2.7.1 Developing and approving joint operations and security procedures in high-risk areas.
2.7.2 Reviewing the human aspects of the teams working in high-risk areas.
2.8 The DCC will meet at least four times a year. Minutes will be taken of these meetings.
Guidance
Reserved.
`;

    const criteria = extractVerbatimCriteriaFromKnowledge({
      content: sourceText,
      mpsCode: 'D001.MPS002',
      mpsName: 'Chain of Custody and Security Control Committee',
      domainName: 'Leadership and Governance',
    });

    expect(criteria.map((criterion) => criterion.statement)).toEqual([
      'The chain of custody for each operation will be set out in matrix form, with an accountable manager named for each part of the chain.',
      'The chain of custody document will be reviewed at least annually and in the event of any personnel or process changes.',
      'The DCC will have a clear mandate and charter. As a minimum this will include developing and approving joint operations and security procedures in high-risk areas.',
      'The DCC will have a clear mandate and charter. As a minimum this will include reviewing the human aspects of the teams working in high-risk areas.',
      'The DCC will meet at least four times a year. Minutes will be taken of these meetings.',
    ]);
    expect(criteria.map((criterion) => criterion.statement)).not.toContain(
      ': These actions are mandatory and should be implemented.',
    );
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
    expect(src).toContain('mergeOverlappingTextChunks');
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
