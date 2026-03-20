/**
 * DocumentChunkTester — Pipeline 2 (Knowledge Ingestion) chunk preview UI
 *
 * Wave    : DCKIS-IMPL-002
 * Test IDs: T-KU-002
 *
 * Provides local text-splitting preview with configurable chunk size and overlap.
 * No API calls required — purely client-side chunk preview.
 *
 * Smart Chunk Reuse: When the user is satisfied with the chunk preview,
 * they can pass the pre-validated chunks to process-document-v2 via the
 * `chunked_from_tester` flag to skip server-side re-chunking.
 */

import React, { useState, useCallback } from 'react';

/** Default chunk size in characters (matches process-document-v2 CHUNK_SIZE) */
const DEFAULT_CHUNK_SIZE = 2000;

/** Default chunk overlap in characters (matches process-document-v2 CHUNK_OVERLAP) */
const DEFAULT_CHUNK_OVERLAP = 200;

/** Maximum number of chunk previews to display in the UI */
const MAX_PREVIEW_CHUNKS = 20;

interface ChunkPreview {
  index: number;
  content: string;
  charCount: number;
}

/**
 * Split text into overlapping chunks of the specified size.
 * This mirrors the logic in process-document-v2 (Smart Chunk Reuse).
 */
function chunkText(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
): ChunkPreview[] {
  if (!text.trim()) return [];
  const chunks: ChunkPreview[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const content = text.slice(start, end);
    chunks.push({ index, content, charCount: content.length });
    index += 1;
    start += chunkSize - chunkOverlap;
    if (start >= text.length) break;
  }

  return chunks;
}

export function DocumentChunkTester(): React.ReactElement {
  const [chunkSize, setChunkSize] = useState<number>(DEFAULT_CHUNK_SIZE);
  const [chunkOverlap, setChunkOverlap] = useState<number>(DEFAULT_CHUNK_OVERLAP);
  const [inputText, setInputText] = useState<string>('');
  const [chunks, setChunks] = useState<ChunkPreview[]>([]);
  const [hasPreview, setHasPreview] = useState<boolean>(false);

  const handleGeneratePreview = useCallback((): void => {
    const generated = chunkText(inputText, chunkSize, chunkOverlap);
    setChunks(generated);
    setHasPreview(true);
  }, [inputText, chunkSize, chunkOverlap]);

  function handleChunkSizeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setChunkSize(value);
    }
  }

  function handleChunkOverlapChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setChunkOverlap(value);
    }
  }

  const displayChunks = chunks.slice(0, MAX_PREVIEW_CHUNKS);
  const truncated = chunks.length > MAX_PREVIEW_CHUNKS;

  return (
    <section
      aria-labelledby="chunk-tester-heading"
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h2
        id="chunk-tester-heading"
        className="text-lg font-semibold text-gray-900 mb-1"
      >
        🔬 Chunk Preflight Tester
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Preview how your document will be split into chunks before uploading.
        Validated chunks can be passed directly to the pipeline via Smart Chunk Reuse
        (
        <code className="text-xs bg-gray-100 px-1 rounded">chunked_from_tester: true</code>
        ).
      </p>

      {/* Configuration controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="chunk-size-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chunk Size (characters)
          </label>
          <input
            id="chunk-size-input"
            type="number"
            min={100}
            max={8000}
            step={100}
            value={chunkSize}
            onChange={handleChunkSizeChange}
            aria-describedby="chunk-size-hint"
            className="block w-full rounded-md border-gray-300 border shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
          />
          <p id="chunk-size-hint" className="mt-1 text-xs text-gray-500">
            Default: {DEFAULT_CHUNK_SIZE} characters
          </p>
        </div>
        <div>
          <label
            htmlFor="chunk-overlap-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chunk Overlap (characters)
          </label>
          <input
            id="chunk-overlap-input"
            type="number"
            min={0}
            max={500}
            step={10}
            value={chunkOverlap}
            onChange={handleChunkOverlapChange}
            aria-describedby="chunk-overlap-hint"
            className="block w-full rounded-md border-gray-300 border shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
          />
          <p id="chunk-overlap-hint" className="mt-1 text-xs text-gray-500">
            Default: {DEFAULT_CHUNK_OVERLAP} characters
          </p>
        </div>
      </div>

      {/* Text input */}
      <div className="mb-4">
        <label
          htmlFor="chunk-text-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sample Text
        </label>
        <textarea
          id="chunk-text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="Paste a sample of your document text here to preview how it will be split into chunks…"
          aria-describedby="chunk-text-hint"
          className="block w-full rounded-md border-gray-300 border shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2 font-mono text-xs"
        />
        <p id="chunk-text-hint" className="mt-1 text-xs text-gray-500">
          Paste representative text to validate chunk boundaries before uploading.
        </p>
      </div>

      {/* Preview button */}
      <button
        type="button"
        onClick={handleGeneratePreview}
        disabled={!inputText.trim()}
        aria-disabled={!inputText.trim()}
        className="mb-4 inline-flex items-center px-4 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Generate Preview
      </button>

      {/* Chunk preview results */}
      {hasPreview && (
        <div aria-live="polite" aria-label="Chunk preview results">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {chunks.length === 0
                ? 'No chunks generated (empty text).'
                : `${chunks.length} chunk${chunks.length === 1 ? '' : 's'} generated`}
            </span>
            {truncated && (
              <span className="text-xs text-gray-500">
                (showing first {MAX_PREVIEW_CHUNKS})
              </span>
            )}
          </div>
          {displayChunks.length > 0 && (
            <ol
              aria-label="Chunk preview list"
              className="space-y-2 max-h-96 overflow-y-auto"
            >
              {displayChunks.map((chunk) => (
                <li
                  key={chunk.index}
                  className="rounded-md border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Chunk {chunk.index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {chunk.charCount} chars
                    </span>
                  </div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
                    {chunk.content.slice(0, 300)}
                    {chunk.content.length > 300 && (
                      <span className="text-gray-400"> …[truncated]</span>
                    )}
                  </pre>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
