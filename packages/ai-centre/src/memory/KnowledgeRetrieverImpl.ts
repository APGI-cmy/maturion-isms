/**
 * KnowledgeRetrieverImpl — in-memory KnowledgeRetriever with ARC approval filter
 *
 * Wave 9.5 — Governance: Knowledge Base Inventory + ARC Protocol
 *
 * Provides a correct, fully-functional in-memory implementation of the
 * KnowledgeRetriever interface. Filters retrieved entries to return ONLY
 * those with approvalStatus === 'approved', per the ARC Knowledge Promotion
 * Protocol. Entries with 'pending', 'retired', or undefined approvalStatus
 * are excluded from context window injection.
 *
 * Supabase wiring is EXPLICITLY DEFERRED to a future wave.
 * The AAWP wave plan records this deferral:
 *   Wave 9.5 scope: in-memory implementation, correct interface, approval filter,
 *                   full test coverage.
 *   Future wave scope: replace in-memory store with real Supabase client querying
 *     the ai_knowledge table with approval_status = 'approved' filter
 *     (see supabase/migrations/006_ai_knowledge_metadata.sql for the schema).
 *     Organisation-level tenant isolation must be enforced by the query filter
 *     `organisation_id = organisationId AND approval_status = 'approved'`.
 *
 * TODO(Future): Replace in-memory `entries` store with Supabase client calls
 * to the `ai_knowledge` table with WHERE approval_status = 'approved' AND
 * organisation_id = organisationId filter. Vector similarity search via pgvector
 * for the `query` parameter (GRS-030). The constructor must accept a SupabaseClient.
 * See supabase/migrations/006_ai_knowledge_metadata.sql for the full schema.
 *
 * References:
 *   ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md §4.2
 *   Issue #658 — Wave 9.5 | GRS-030 | APS §7.4 | AAD §8.1
 */
import type { KnowledgeEntry, KnowledgeRetriever } from '../types/index.js';

export class KnowledgeRetrieverImpl implements KnowledgeRetriever {
  private readonly entries: KnowledgeEntry[];

  constructor(entries: KnowledgeEntry[]) {
    this.entries = entries;
  }

  /**
   * Retrieve knowledge entries filtered to approved-only items.
   *
   * Per ARC Knowledge Promotion Protocol (Wave 9.5):
   * - Only entries with approvalStatus === 'approved' are returned.
   * - Entries with 'pending', 'retired', or undefined approvalStatus are excluded.
   * - The query and organisationId parameters are ignored in the in-memory implementation
   *   (Supabase wiring deferred — see class-level TODO).
   *
   * @param _query          The search query (deferred — vector similarity search in future wave).
   * @param _organisationId The organisation scope (deferred — tenant isolation in future wave).
   * @param limit           Optional maximum number of results to return.
   * @returns               Array of approved KnowledgeEntry items.
   */
  async retrieve(
    _query: string,
    _organisationId: string,
    limit?: number,
  ): Promise<KnowledgeEntry[]> {
    const approved = this.entries.filter(
      (entry) => entry.approvalStatus === 'approved',
    );
    return limit !== undefined ? approved.slice(0, limit) : approved;
  }
}
