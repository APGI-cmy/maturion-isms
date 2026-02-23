/**
 * PersistentMemoryAdapter — STUB (Wave 4 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 4 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-008 | APS §7.2 | AAD §5.6
 */
import type {
  PersistentMemoryAdapter as IPersistentMemoryAdapter,
  PersistedMemoryEntry,
} from '../types/index.js';

export class PersistentMemoryAdapter implements IPersistentMemoryAdapter {
  async retrieve(_params: {
    organisationId: string;
    sessionId?: string;
    limit?: number;
  }): Promise<PersistedMemoryEntry[]> {
    throw new Error('NOT_IMPLEMENTED: PersistentMemoryAdapter.retrieve()');
  }

  async persist(_entry: PersistedMemoryEntry): Promise<void> {
    throw new Error('NOT_IMPLEMENTED: PersistentMemoryAdapter.persist()');
  }

  async pruneExpired(_organisationId: string): Promise<number> {
    throw new Error('NOT_IMPLEMENTED: PersistentMemoryAdapter.pruneExpired()');
  }
}
