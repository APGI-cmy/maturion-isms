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

function findChunkOverlap(previous: string, next: string): number {
  const maxOverlap = Math.min(previous.length, next.length, 1000);
  for (let length = maxOverlap; length >= 40; length -= 1) {
    if (previous.endsWith(next.slice(0, length))) return length;
  }
  return 0;
}

export function mergeOverlappingTextChunks(chunks: string[]): string {
  const normalizedChunks = chunks
    .map((chunk) => chunk.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))
    .filter((chunk) => chunk.trim().length > 0);
  if (normalizedChunks.length === 0) return '';

  let merged = normalizedChunks[0];
  for (const chunk of normalizedChunks.slice(1)) {
    const overlap = findChunkOverlap(merged, chunk);
    merged += overlap > 0 ? chunk.slice(overlap) : `\n${chunk}`;
  }
  return merged;
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

function significantTitleTokens(value: string): Set<string> {
  const stopWords = new Set(['and', 'the', 'of', 'for', 'with', 'mps', 'intent']);
  return new Set(
    normalizeVerbatimLookup(value)
      .split(' ')
      .filter((token) => token.length >= 3 && !stopWords.has(token)),
  );
}

function titleMatchesMpsName(title: string, mpsName: string): boolean {
  const mpsNameLookup = normalizeVerbatimLookup(mpsName);
  const titleLookup = normalizeVerbatimLookup(title);
  if (
    !mpsNameLookup ||
    titleLookup === mpsNameLookup
  ) {
    return true;
  }

  const expectedTokens = significantTitleTokens(mpsName);
  const actualTokens = significantTitleTokens(title);
  if (expectedTokens.size === 0 || actualTokens.size === 0) return false;

  let overlap = 0;
  for (const token of expectedTokens) {
    if (actualTokens.has(token)) overlap += 1;
  }
  const overlapRatio = overlap / Math.min(expectedTokens.size, actualTokens.size);

  return overlap >= 2 && overlapRatio >= 0.5;
}

function containsNumberedActionsForOrdinal(block: string, ordinal: number): boolean {
  const requiredActions = extractRequiredActionsBlock(block);
  if (!requiredActions) return false;
  return new RegExp(`(?:^|\\n)\\s*${ordinal}\\.\\d+\\s+`, 'i').test(requiredActions);
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
      const headingEnd = start + String(match[0] ?? '').length;
      const end = findNextMpsHeadingIndex(text, headingEnd);
      const block = text.slice(start, end);
      const titleMatches = titleMatchesMpsName(String(match[1] ?? ''), mpsName);
      const hasMatchingNumberedActions = containsNumberedActionsForOrdinal(block, ordinal);
      if ((titleMatches || hasMatchingNumberedActions) && /Required\s+Actions/i.test(block)) {
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
    /Required\s+Actions\s*([\s\S]*?)(?=(?:\n\s*(?:Guidance|Standard\s+of\s+Proof|Maturity\s+Level|Scoring|Evidence|Domain:|MPS\s*[A-Za-z0-9.]+\s*[\u2013-])|$))/i,
  );
  const block = match?.[1]?.trim() ?? '';
  return block.length > 0 ? block : null;
}

type ParsedActionLine = {
  number: string | null;
  text: string;
};

function parseActionLine(raw: string): ParsedActionLine | null {
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  if (trimmed.length < 24) return null;
  if (/^(required actions?|guidance|intent|standard of proof|maturity level)$/i.test(trimmed)) return null;
  if (/^page\s+\d+/i.test(trimmed)) return null;
  if (/^mps\s+\d+/i.test(trimmed)) return null;
  if (/^:\s*these actions are mandatory\b/i.test(trimmed)) return null;
  if (/^these actions are mandatory\b/i.test(trimmed)) return null;

  const numbered = trimmed.match(/^(\d+(?:\.\d+)+)\s+(.+)$/);
  if (numbered) {
    return {
      number: numbered[1],
      text: numbered[2].trim(),
    };
  }

  return {
    number: null,
    text: trimmed.replace(/^\s*(?:[-*\u2022]|\d+[.)]|[a-z][.)])\s+/i, '').trim(),
  };
}

function directChildLines(lines: ParsedActionLine[], parent: ParsedActionLine, parentIndex: number): ParsedActionLine[] {
  if (parent.number) {
    const prefix = `${parent.number}.`;
    return lines
      .slice(parentIndex + 1)
      .filter((line) => line.number?.startsWith(prefix))
      .filter((line) => line.number?.slice(prefix.length).includes('.') === false);
  }

  const children: ParsedActionLine[] = [];
  for (const line of lines.slice(parentIndex + 1)) {
    if (/^through\b/i.test(line.text)) {
      children.push(line);
      continue;
    }
    break;
  }
  return children.length >= 2 ? children : [];
}

function joinParentAndChild(parent: string, child: string): string {
  const parentStem = parent.replace(/[.;:]\s*$/, '').trim();
  const childStem = child.replace(/^[A-Z]/, (letter) => letter.toLowerCase());
  return `${parentStem} ${childStem}`.replace(/\s+/g, ' ').trim();
}

function cleanRequiredActionLines(block: string): string[] {
  const seen = new Set<string>();
  const lines = block
    .split('\n')
    .map(parseActionLine)
    .filter((line): line is ParsedActionLine => Boolean(line));
  const evidenceStatements: string[] = [];
  const consumedChildIndexes = new Set<number>();

  for (let index = 0; index < lines.length; index += 1) {
    if (consumedChildIndexes.has(index)) continue;
    const line = lines[index];
    const children = directChildLines(lines, line, index);
    if (children.length > 0) {
      for (const child of children) {
        const childIndex = lines.indexOf(child);
        if (childIndex >= 0) consumedChildIndexes.add(childIndex);
        evidenceStatements.push(joinParentAndChild(line.text, child.text));
      }
      continue;
    }

    evidenceStatements.push(line.text);
  }

  const deduped: string[] = [];
  for (const statement of evidenceStatements) {
    const key = normalizeVerbatimLookup(statement);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(statement);
  }
  return deduped;
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
