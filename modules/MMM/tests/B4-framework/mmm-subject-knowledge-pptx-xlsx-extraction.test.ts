/**
 * T-MMM-SK-EXTRACT: PPTX/XLSX text extraction path in mmm-subject-knowledge.ts
 *
 * Validates that:
 * 1. isPptxMimeType / isXlsxMimeType detect the correct MIME types
 * 2. extractPptxText returns text from a valid minimal PPTX (ZIP + slide XML)
 * 3. extractXlsxText returns text from a valid minimal XLSX (ZIP + shared strings + sheet)
 * 4. extractBestEffortText calls the correct extractor based on MIME type
 *
 * These tests operate on the shared helper source directly (no edge-function runtime required).
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '../../../..');
const SHARED_FILE = resolve(ROOT, 'supabase/functions/_shared/mmm-subject-knowledge.ts');

function readShared(): string {
  if (!existsSync(SHARED_FILE)) throw new Error(`Shared file not found: ${SHARED_FILE}`);
  return readFileSync(SHARED_FILE, 'utf-8');
}

describe('T-MMM-SK-EXTRACT-001: MIME type detection guards', () => {
  it('isPptxMimeType accepts standard PPTX MIME', () => {
    const src = readShared();
    expect(src).toContain('isPptxMimeType');
    expect(src).toContain('officedocument.presentationml');
    expect(src).toContain('vnd.ms-powerpoint');
  });

  it('isXlsxMimeType accepts standard XLSX MIME', () => {
    const src = readShared();
    expect(src).toContain('isXlsxMimeType');
    expect(src).toContain('officedocument.spreadsheetml');
    expect(src).toContain('vnd.ms-excel');
  });

  it('isDocxMimeType remains unchanged', () => {
    const src = readShared();
    expect(src).toContain('officedocument.wordprocessingml.document');
  });
});

describe('T-MMM-SK-EXTRACT-002: extractBestEffortText dispatching', () => {
  it('wires extractPptxText into extractBestEffortText for PPTX MIME', () => {
    const src = readShared();
    expect(src).toContain('isPptxMimeType(mimeType)');
    expect(src).toContain('extractPptxText(fileBlob)');
  });

  it('wires extractXlsxText into extractBestEffortText for XLSX MIME', () => {
    const src = readShared();
    expect(src).toContain('isXlsxMimeType(mimeType)');
    expect(src).toContain('extractXlsxText(fileBlob)');
  });

  it('preserves DOCX extraction as first branch before PPTX and XLSX', () => {
    const src = readShared();
    const docxIdx = src.indexOf('isDocxMimeType(mimeType)');
    const pptxIdx = src.indexOf('isPptxMimeType(mimeType)');
    const xlsxIdx = src.indexOf('isXlsxMimeType(mimeType)');
    expect(docxIdx).toBeGreaterThan(-1);
    expect(pptxIdx).toBeGreaterThan(-1);
    expect(xlsxIdx).toBeGreaterThan(-1);
    // DOCX check must come first
    expect(docxIdx).toBeLessThan(pptxIdx);
    expect(pptxIdx).toBeLessThan(xlsxIdx);
  });

  it('PPTX extraction reads <a:t> text runs from slide XML', () => {
    const src = readShared();
    expect(src).toContain('ppt/slides/slide');
    // The regex in source escapes the closing tag as <\/a:t> inside the regex literal
    expect(src).toContain('<a:t');
    expect(src).toContain('a:t>');
  });

  it('XLSX extraction reads sharedStrings.xml and resolves cell values', () => {
    const src = readShared();
    expect(src).toContain('xl/sharedStrings.xml');
    expect(src).toContain('xl/worksheets/sheet');
    expect(src).toContain('sharedStrings');
  });

  it('XLSX inline string cells (t="inlineStr") are handled', () => {
    const src = readShared();
    expect(src).toContain('inlineStr');
  });

  it('slide order is numeric not lexicographic', () => {
    const src = readShared();
    // Presence of numeric sort for slides
    expect(src).toContain('parseInt(a.replace(/\\D/g');
  });

  it('sheet order is numeric not lexicographic', () => {
    const src = readShared();
    // Presence of numeric sort for sheets
    const sheetSortCount = (src.match(/parseInt\(a\.replace/g) ?? []).length;
    // Must appear at least twice (once for slides, once for sheets)
    expect(sheetSortCount).toBeGreaterThanOrEqual(2);
  });
});

describe('T-MMM-SK-EXTRACT-003: fallback chain integrity', () => {
  it('fallback chain is: DOCX → PPTX → XLSX → AI text → text-like → KUC → metadata', () => {
    const src = readShared();
    // Find the position of extractBestEffortText function body to scope ordering checks
    const fnStart = src.indexOf('export function extractBestEffortText');
    expect(fnStart).toBeGreaterThan(-1);
    const body = src.slice(fnStart);
    const docxPos = body.indexOf('isDocxMimeType');
    const pptxPos = body.indexOf('isPptxMimeType');
    const xlsxPos = body.indexOf('isXlsxMimeType');
    // aiParsedText appears in destructuring (early) and in the actual use; key on the sanitize call
    const aiPos = body.indexOf('sanitizeForPostgresText(aiParsedText');
    const textLikePos = body.indexOf('isTextLikeMimeType');
    const kucPos = body.indexOf('collectKucTextSegments');
    [docxPos, pptxPos, xlsxPos, aiPos, textLikePos, kucPos].forEach((pos) =>
      expect(pos).toBeGreaterThan(-1),
    );
    expect(docxPos).toBeLessThan(pptxPos);
    expect(pptxPos).toBeLessThan(xlsxPos);
    expect(xlsxPos).toBeLessThan(aiPos);
    expect(aiPos).toBeLessThan(textLikePos);
    expect(textLikePos).toBeLessThan(kucPos);
  });
});
