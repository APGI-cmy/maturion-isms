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
  const trimmed = content.trim();
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
  const payloads: Array<Record<string, unknown>> = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const contentHash = await sha256Hex(`${documentId}:${index}:${chunk}`);
    payloads.push({
      organisation_id: organisationId,
      content: chunk,
      source,
      domain,
      module,
      approval_status: approvalStatus,
      chunk_index: index,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
      source_document_name: sourceDocumentName,
      document_id: documentId,
      content_hash: contentHash,
      metadata: {
        ...metadata,
        document_role: documentRole,
      },
    });
  }

  return payloads;
}
