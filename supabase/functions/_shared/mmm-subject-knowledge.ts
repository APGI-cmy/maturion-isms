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
  return input
    .replace(/\u0000/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

export function sanitizeForPostgresJson<T>(value: T): T {
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
    payloads.push({
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
    });
  }

  return payloads;
}
