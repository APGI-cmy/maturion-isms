/**
 * RED Gate QA Suite — Wave 9.5 KnowledgeRetriever Approval Filter
 *
 * Wave 9.5 — Governance: Knowledge Base Inventory + ARC Protocol
 *
 * ALL TESTS MUST FAIL (RED) until Wave 9.5 api-builder creates:
 *   `packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts`
 *
 * Do NOT modify these tests to pass without a corresponding implementation.
 * Tests verify that KnowledgeRetrieverImpl filters entries by approvalStatus,
 * returning ONLY entries with approvalStatus === 'approved'.
 *
 * References:
 *   ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md §4.2
 *   ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md §5.2
 *   Issue #658 — Wave 9.5: KnowledgeRetriever Approval Filter
 *
 * Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-069-20260227
 *
 * Test IDs: W9.5-T-001 through W9.5-T-007
 */

import { describe, it, expect } from 'vitest';
import type { KnowledgeEntry } from '../../types/index.js';
// RED: KnowledgeRetrieverImpl does not exist yet.
// This import will fail at collection time until Wave 9.5 api-builder creates the file.
import { KnowledgeRetrieverImpl } from '../../memory/KnowledgeRetrieverImpl.js';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Wave 9.5 — KnowledgeRetriever Approval Filter (RED gate)', () => {
  // -------------------------------------------------------------------------
  // W9.5-T-001: All approved entries are returned
  // -------------------------------------------------------------------------

  it('W9.5-T-001: retrieve() with only approved entries returns all of them', async () => {
    const entries: KnowledgeEntry[] = [
      { content: 'ISO 27001 A.9 Access Control', source: 'iso27001', approvalStatus: 'approved' },
      { content: 'NIST SP 800-53 AC-2 Account Management', source: 'nist', approvalStatus: 'approved' },
      { content: 'PCI DSS Requirement 8', source: 'pci-dss', approvalStatus: 'approved' },
    ];
    const retriever = new KnowledgeRetrieverImpl(entries);

    const results = await retriever.retrieve('query', 'org-001');

    expect(results).toHaveLength(3);
    expect(results.every(e => e.approvalStatus === 'approved')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // W9.5-T-002: Mixed approved/pending — only approved returned
  // -------------------------------------------------------------------------

  it('W9.5-T-002: retrieve() with mixed approved/pending returns only approved entries', async () => {
    const entries: KnowledgeEntry[] = [
      { content: 'Approved entry A', source: 'doc-a', approvalStatus: 'approved' },
      { content: 'Pending entry B', source: 'doc-b', approvalStatus: 'pending' },
      { content: 'Approved entry C', source: 'doc-c', approvalStatus: 'approved' },
      { content: 'Pending entry D', source: 'doc-d', approvalStatus: 'pending' },
    ];
    const retriever = new KnowledgeRetrieverImpl(entries);

    const results = await retriever.retrieve('query', 'org-001');

    expect(results).toHaveLength(2);
    expect(results.map(e => e.content)).toContain('Approved entry A');
    expect(results.map(e => e.content)).toContain('Approved entry C');
    expect(results.map(e => e.content)).not.toContain('Pending entry B');
    expect(results.map(e => e.content)).not.toContain('Pending entry D');
  });

  // -------------------------------------------------------------------------
  // W9.5-T-003: Mixed approved/retired — only approved returned
  // -------------------------------------------------------------------------

  it('W9.5-T-003: retrieve() with mixed approved/retired returns only approved entries', async () => {
    const entries: KnowledgeEntry[] = [
      { content: 'Approved entry X', source: 'doc-x', approvalStatus: 'approved' },
      { content: 'Retired entry Y', source: 'doc-y', approvalStatus: 'retired' },
      { content: 'Approved entry Z', source: 'doc-z', approvalStatus: 'approved' },
    ];
    const retriever = new KnowledgeRetrieverImpl(entries);

    const results = await retriever.retrieve('query', 'org-001');

    expect(results).toHaveLength(2);
    expect(results.map(e => e.content)).toContain('Approved entry X');
    expect(results.map(e => e.content)).toContain('Approved entry Z');
    expect(results.map(e => e.content)).not.toContain('Retired entry Y');
  });

  // -------------------------------------------------------------------------
  // W9.5-T-004: Only pending entries — empty array returned
  // -------------------------------------------------------------------------

  it('W9.5-T-004: retrieve() with only pending entries returns empty array', async () => {
    const entries: KnowledgeEntry[] = [
      { content: 'Pending A', source: 'doc-a', approvalStatus: 'pending' },
      { content: 'Pending B', source: 'doc-b', approvalStatus: 'pending' },
    ];
    const retriever = new KnowledgeRetrieverImpl(entries);

    const results = await retriever.retrieve('query', 'org-001');

    expect(results).toHaveLength(0);
  });

  // -------------------------------------------------------------------------
  // W9.5-T-005: Only retired entries — empty array returned
  // -------------------------------------------------------------------------

  it('W9.5-T-005: retrieve() with only retired entries returns empty array', async () => {
    const entries: KnowledgeEntry[] = [
      { content: 'Retired A', source: 'doc-a', approvalStatus: 'retired' },
      { content: 'Retired B', source: 'doc-b', approvalStatus: 'retired' },
    ];
    const retriever = new KnowledgeRetrieverImpl(entries);

    const results = await retriever.retrieve('query', 'org-001');

    expect(results).toHaveLength(0);
  });

  // -------------------------------------------------------------------------
  // W9.5-T-006: Entries with undefined approvalStatus are excluded (treated as pending)
  // -------------------------------------------------------------------------

  it('W9.5-T-006: retrieve() excludes entries with undefined approvalStatus (treated as pending)', async () => {
    const entries: KnowledgeEntry[] = [
      { content: 'Approved entry', source: 'doc-a', approvalStatus: 'approved' },
      { content: 'No status entry', source: 'doc-b' },
    ];
    const retriever = new KnowledgeRetrieverImpl(entries);

    const results = await retriever.retrieve('query', 'org-001');

    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('Approved entry');
  });

  // -------------------------------------------------------------------------
  // W9.5-T-007: KnowledgeEntry type supports optional approvalStatus field
  // -------------------------------------------------------------------------

  it('W9.5-T-007: KnowledgeEntry type supports optional approvalStatus field', () => {
    // Compile-time verification that KnowledgeEntry accepts approvalStatus.
    // If the type extension is missing, TypeScript compilation will fail this test.
    const entry: KnowledgeEntry = {
      content: 'ISO 27001 risk assessment procedure',
      source: 'iso27001',
      approvalStatus: 'approved',
    };

    expect(entry.approvalStatus).toBe('approved');

    const entryWithoutStatus: KnowledgeEntry = {
      content: 'Pending knowledge item',
      source: 'doc',
    };

    expect(entryWithoutStatus.approvalStatus).toBeUndefined();
  });
});
