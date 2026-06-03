export type VerbatimExtractedCriterion = {
  code: string;
  statement: string;
};

export function normalizeVerbatimLookup(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function isSourceFaithfulStatement(sourceText: string, candidate: string): boolean {
  const source = normalizeVerbatimLookup(sourceText);
  const probe = normalizeVerbatimLookup(candidate);
  return probe.length >= 24 && source.includes(probe);
}

export function extractMpsOrdinal(mpsCode: string, fallbackName = ''): number | null {
  const combined = `${mpsCode} ${fallbackName}`;
  const mpsMatch = combined.match(/\bMPS\s*0*(\d{1,3})\b/i);
  if (mpsMatch?.[1]) return Number.parseInt(mpsMatch[1], 10);

  const trailingDigits = combined.match(/\b0*(\d{1,3})\b(?!.*\b\d+\b)/);
  if (trailingDigits?.[1]) return Number.parseInt(trailingDigits[1], 10);
  return null;
}

function buildCriterionCode(mpsCode: string, index: number): string {
  const suffix = `C${String(index).padStart(3, '0')}`;
  if (mpsCode.includes('.')) return `${mpsCode}.${suffix}`;
  return `${mpsCode}-${suffix}`;
}

function findNextMpsHeadingIndex(text: string, startFrom: number): number {
  const nextHeading = text.slice(startFrom).search(/\n\s*MPS\s*[A-Za-z0-9.]+\s*[\u2013-]\s*[^\n]+/i);
  return nextHeading >= 0 ? startFrom + nextHeading : text.length;
}

function collectCandidateMpsBlocks(params: {
  text: string;
  mpsCode: string;
  mpsName: string;
  domainName: string;
}): string[] {
  const { text, mpsCode, mpsName, domainName } = params;
  const ordinal = extractMpsOrdinal(mpsCode, mpsName);
  const mpsNameLookup = normalizeVerbatimLookup(mpsName);
  const domainLookup = normalizeVerbatimLookup(domainName);
  const blocks: string[] = [];

  if (ordinal !== null) {
    const headingRegex = new RegExp(
      `(?:^|\\n)\\s*MPS\\s*0*${ordinal}\\s*[\\u2013-]\\s*([^\\n]+)(?:\\n|$)`,
      'gi',
    );
    for (const match of text.matchAll(headingRegex)) {
      const start = match.index ?? 0;
      const end = findNextMpsHeadingIndex(text, start + 1);
      const block = text.slice(start, end);
      const blockLookup = normalizeVerbatimLookup(block.slice(0, 500));
      const titleLookup = normalizeVerbatimLookup(String(match[1] ?? ''));
      const titleMatches =
        !mpsNameLookup ||
        titleLookup.includes(mpsNameLookup) ||
        mpsNameLookup.includes(titleLookup) ||
        blockLookup.includes(mpsNameLookup);
      if (titleMatches && /Required\s+Actions/i.test(block)) {
        blocks.push(block);
      }
    }
  }

  if (blocks.length > 0) return blocks;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const lineLookup = normalizeVerbatimLookup(lines[i] ?? '');
    if (!lineLookup.includes(mpsNameLookup) && !lineLookup.includes(domainLookup)) continue;
    const start = Math.max(0, i - 4);
    const end = Math.min(lines.length, i + 80);
    const block = lines.slice(start, end).join('\n');
    if (/Required\s+Actions/i.test(block)) {
      blocks.push(block);
    }
  }

  return blocks;
}

function extractRequiredActionsBlock(mpsBlock: string): string | null {
  const match = mpsBlock.match(
    /Required\s+Actions\s*([\s\S]*?)(?=\n\s*(?:Guidance|Standard\s+of\s+Proof|Maturity\s+Level|Scoring|Evidence|Domain:|MPS\s*[A-Za-z0-9.]+\s*[\u2013-]|$))/i,
  );
  const block = match?.[1]?.trim() ?? '';
  return block.length > 0 ? block : null;
}

function cleanRequiredActionLines(block: string): string[] {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const raw of block.split('\n')) {
    const line = raw
      .replace(/^\s*(?:[-*\u2022]|\d+[.)]|[a-z][.)])\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (line.length < 24) continue;
    if (/^(required actions?|guidance|intent|standard of proof|maturity level)$/i.test(line)) continue;
    if (/^page\s+\d+/i.test(line)) continue;
    if (/^mps\s+\d+/i.test(line)) continue;
    const key = normalizeVerbatimLookup(line);
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(line);
  }
  return lines;
}

export function extractVerbatimCriteriaFromKnowledge(params: {
  content: string;
  mpsCode: string;
  mpsName: string;
  domainName: string;
}): VerbatimExtractedCriterion[] {
  const text = params.content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const candidateBlocks = collectCandidateMpsBlocks({
    text,
    mpsCode: params.mpsCode,
    mpsName: params.mpsName,
    domainName: params.domainName,
  });

  for (const block of candidateBlocks) {
    const requiredActions = extractRequiredActionsBlock(block);
    if (!requiredActions) continue;
    const actionLines = cleanRequiredActionLines(requiredActions);
    if (actionLines.length === 0) continue;
    return actionLines.map((statement, idx) => ({
      code: buildCriterionCode(params.mpsCode, idx + 1),
      statement,
    }));
  }

  return [];
}
