/**
 * MMM Subject Knowledge Helpers
 *
 * Shared helpers for DMC subject-knowledge edge functions:
 * - superuser role boundary checks
 * - document-role normalization
 * - text chunking + hashing for ai_knowledge inserts
 */

import { jsonResponse } from './mmm-auth.ts';

export const SUBJECT_SUPERUSER_ROLES = new Set([
  'ADMIN',
  'OWNER',
  'SUPERUSER',
  'BACKOFFICE_ADMIN',
  'LEAD_AUDITOR',
]);

export const SUBJECT_DOCUMENT_ROLES = new Set([
  'criteria_source',
  'evidence',
  'knowledge_source',
  'guidance',
  'template',
]);

export function requireSubjectKnowledgeSuperuser(role: string): void {
  const normalized = role.trim().toUpperCase();
  if (!SUBJECT_SUPERUSER_ROLES.has(normalized)) {
    throw jsonResponse(
      {
        error: 'Insufficient role for subject knowledge operation',
        required_any_of: [...SUBJECT_SUPERUSER_ROLES],
        actual: role,
      },
      403,
    );
  }
}

export function normalizeSubjectDocumentRole(input: string | null | undefined): string {
  if (!input) return 'knowledge_source';
  const normalized = input.trim().toLowerCase();
  if (!SUBJECT_DOCUMENT_ROLES.has(normalized)) {
    return 'knowledge_source';
  }
  return normalized;
}

export function isTextLikeMimeType(mimeType: string): boolean {
  const normalized = mimeType.toLowerCase();
  return (
    normalized.startsWith('text/') ||
    normalized.includes('json') ||
    normalized.includes('xml') ||
    normalized.includes('csv') ||
    normalized.includes('markdown')
  );
}

function toObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function collectKucTextSegments(input: unknown, acc: string[]): void {
  if (!input) return;
  if (typeof input === 'string') {
    const text = sanitizeForPostgresText(input).trim();
    if (text.length > 0) acc.push(text);
    return;
  }
  if (Array.isArray(input)) {
    for (const item of input) collectKucTextSegments(item, acc);
    return;
  }
  const obj = toObject(input);
  if (!obj) return;

  const textKeys = [
    'text',
    'content',
    'extracted_text',
    'raw_text',
    'markdown',
    'parsed_text',
  ];
  for (const key of textKeys) {
    const value = obj[key];
    if (typeof value === 'string') {
      const text = sanitizeForPostgresText(value).trim();
      if (text.length > 0) acc.push(text);
    }
  }

  const nestedKeys = ['chunks', 'pages', 'segments', 'sections', 'results', 'data'];
  for (const key of nestedKeys) {
    collectKucTextSegments(obj[key], acc);
  }
}

export function extractBestEffortText(params: {
  mimeType: string;
  fileBlob: Blob;
  fallbackText: string;
  kucClassification?: unknown;
  aiParsedText?: string | null;
}): Promise<string> {
  const { mimeType, fileBlob, fallbackText, kucClassification, aiParsedText } = params;
  return (async () => {
    const aiText = sanitizeForPostgresText(aiParsedText ?? '').trim();
    if (aiText.length > 0) return aiText;

    if (isTextLikeMimeType(mimeType)) {
      const rawText = sanitizeForPostgresText(await fileBlob.text()).trim();
      if (rawText.length > 0) return rawText;
    }

    const kucSegments: string[] = [];
    collectKucTextSegments(kucClassification, kucSegments);
    const kucText = sanitizeForPostgresText(kucSegments.join('\n\n')).trim();
    if (kucText.length > 0) return kucText;

    return sanitizeForPostgresText(fallbackText).trim();
  })();
}

export function buildKnowledgeTextFromAiParseResult(parseResult: unknown): string {
  const root = toObject(parseResult);
  if (!root) return '';

  const parts: string[] = [];
  const domains = Array.isArray(root.domains) ? root.domains : [];
  for (const domain of domains) {
    const d = toObject(domain);
    if (!d) continue;
    const name = sanitizeForPostgresText(String(d.name ?? '')).trim();
    if (name) parts.push(`Domain: ${name}`);
  }

  const mps = Array.isArray(root.mini_performance_standards) ? root.mini_performance_standards : [];
  for (const item of mps) {
    const row = toObject(item);
    if (!row) continue;
    const number = sanitizeForPostgresText(String(row.number ?? '')).trim();
    const name = sanitizeForPostgresText(String(row.name ?? '')).trim();
    const intent = sanitizeForPostgresText(String(row.intent_statement ?? '')).trim();
    const guidance = sanitizeForPostgresText(String(row.guidance ?? '')).trim();
    if (number || name) parts.push(`MPS ${number}${name ? ` - ${name}` : ''}`.trim());
    if (intent) parts.push(`Intent: ${intent}`);
    if (guidance) parts.push(`Guidance: ${guidance}`);
  }

  const criteria = Array.isArray(root.criteria) ? root.criteria : [];
  for (const item of criteria) {
    const row = toObject(item);
    if (!row) continue;
    const number = sanitizeForPostgresText(String(row.number ?? '')).trim();
    const mpsNumber = sanitizeForPostgresText(String(row.mps_number ?? '')).trim();
    const title = sanitizeForPostgresText(String(row.title ?? '')).trim();
    const description = sanitizeForPostgresText(String(row.description ?? '')).trim();
    const intent = sanitizeForPostgresText(String(row.intent_statement ?? '')).trim();
    const guidance = sanitizeForPostgresText(String(row.guidance ?? '')).trim();
    if (number || title) parts.push(`Criteria ${number}${title ? ` - ${title}` : ''}`.trim());
    if (mpsNumber) parts.push(`Criteria MPS: ${mpsNumber}`);
    if (description) parts.push(`Description: ${description}`);
    if (intent) parts.push(`Intent: ${intent}`);
    if (guidance) parts.push(`Guidance: ${guidance}`);
  }

  return sanitizeForPostgresText(parts.join('\n\n')).trim();
}

export function chunkText(content: string, chunkSize = 2000, chunkOverlap = 200): string[] {
  const trimmed = sanitizeForPostgresText(content).trim();
  if (!trimmed) return [];
  if (trimmed.length <= chunkSize) return [trimmed];

  const chunks: string[] = [];
  let cursor = 0;
  while (cursor < trimmed.length) {
    const end = Math.min(cursor + chunkSize, trimmed.length);
    chunks.push(trimmed.slice(cursor, end));
    if (end >= trimmed.length) break;
    cursor = Math.max(0, end - chunkOverlap);
  }
  return chunks;
}

/**
 * Remove characters that Postgres text/jsonb rejects (notably NULL) and normalize line endings.
 * This is required for DMC ingestion/reprocess paths that may receive binary-adjacent text payloads.
 */
export function sanitizeForPostgresText(input: string): string {
  if (!input) return '';
  const normalized = input
    .replace(/\u0000/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  return typeof normalized.toWellFormed === 'function'
    ? normalized.toWellFormed()
    : normalized;
}

export function sanitizeForPostgresJson<T>(value: T): T {
  if (value === undefined) {
    return null as T;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    return null as T;
  }
  if (typeof value === 'symbol' || typeof value === 'function') {
    return null as T;
  }
  if (typeof value === 'string') {
    return sanitizeForPostgresText(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForPostgresJson(item)) as T;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, sanitizeForPostgresJson(v)]);
    return Object.fromEntries(entries) as T;
  }
  return value;
}

export function sanitizeKnowledgeInsertPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return {
    organisation_id: sanitizeForPostgresText(String(payload.organisation_id ?? '')),
    content: sanitizeForPostgresText(String(payload.content ?? '')),
    source: sanitizeForPostgresText(String(payload.source ?? '')),
    domain: sanitizeForPostgresText(String(payload.domain ?? '')),
    module: sanitizeForPostgresText(String(payload.module ?? '')),
    approval_status: sanitizeForPostgresText(String(payload.approval_status ?? 'approved')),
    chunk_index: Number.isFinite(Number(payload.chunk_index)) ? Number(payload.chunk_index) : 0,
    chunk_size: Number.isFinite(Number(payload.chunk_size)) ? Number(payload.chunk_size) : 2000,
    chunk_overlap: Number.isFinite(Number(payload.chunk_overlap)) ? Number(payload.chunk_overlap) : 200,
    source_document_name: sanitizeForPostgresText(String(payload.source_document_name ?? '')),
    document_id: sanitizeForPostgresText(String(payload.document_id ?? '')),
    content_hash: sanitizeForPostgresText(String(payload.content_hash ?? '')),
    metadata: sanitizeForPostgresJson(payload.metadata ?? {}),
  };
}

export function omitKnowledgeMetadataColumn(payload: Record<string, unknown>): Record<string, unknown> {
  const sanitized = sanitizeKnowledgeInsertPayload(payload);
  delete sanitized.metadata;
  return sanitized;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export async function buildChunkPayloads(params: {
  organisationId: string;
  documentId: string;
  sourceDocumentName: string;
  source: string;
  content: string;
  documentRole: string;
  domain?: string;
  module?: string;
  metadata?: Record<string, unknown>;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  chunkSize?: number;
  chunkOverlap?: number;
}): Promise<Array<Record<string, unknown>>> {
  const {
    organisationId,
    documentId,
    sourceDocumentName,
    source,
    content,
    documentRole,
    domain = 'subject_knowledge',
    module = 'mmm',
    metadata = {},
    approvalStatus = 'approved',
    chunkSize = 2000,
    chunkOverlap = 200,
  } = params;

  const chunks = chunkText(content, chunkSize, chunkOverlap);
  const safeDocumentRole = sanitizeForPostgresText(documentRole);
  const safeSourceDocumentName = sanitizeForPostgresText(sourceDocumentName);
  const safeSource = sanitizeForPostgresText(source);
  const safeDomain = sanitizeForPostgresText(domain);
  const safeModule = sanitizeForPostgresText(module);
  const safeMetadata = sanitizeForPostgresJson(metadata);
  const payloads: Array<Record<string, unknown>> = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const contentHash = await sha256Hex(`${documentId}:${index}:${chunk}`);
    payloads.push(sanitizeKnowledgeInsertPayload({
      organisation_id: organisationId,
      content: chunk,
      source: safeSource,
      domain: safeDomain,
      module: safeModule,
      approval_status: approvalStatus,
      chunk_index: index,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
      source_document_name: safeSourceDocumentName,
      document_id: documentId,
      content_hash: contentHash,
      metadata: {
        ...safeMetadata,
        document_role: safeDocumentRole,
      },
    }));
  }

  return payloads;
}
