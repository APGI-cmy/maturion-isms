/**
 * MemoryLifecycle — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-030 | APS §7.3, §7.5 | AAD §5.7
 */
import type {
  MemoryLifecycle as IMemoryLifecycle,
  AssembledContextSegment,
  AssembleContextWindowParams,
  AICentreRequest,
  AICentreResponse,
  SessionMemoryStore,
  PersistentMemoryAdapter,
} from '../types/index.js';

export interface MemoryLifecycleDeps {
  sessionStore: SessionMemoryStore;
  persistentAdapter: PersistentMemoryAdapter;
}

export class MemoryLifecycle implements IMemoryLifecycle {
  constructor(_deps: MemoryLifecycleDeps) {
    // Wave 2 implementation pending
  }

  async assembleContextWindow(
    _params: AssembleContextWindowParams,
  ): Promise<AssembledContextSegment[]> {
    throw new Error('NOT_IMPLEMENTED: MemoryLifecycle.assembleContextWindow()');
  }

  async recordTurn(_params: {
    request: AICentreRequest;
    response: AICentreResponse;
  }): Promise<void> {
    throw new Error('NOT_IMPLEMENTED: MemoryLifecycle.recordTurn()');
  }

  pruneSession(_sessionId: string): void {
    throw new Error('NOT_IMPLEMENTED: MemoryLifecycle.pruneSession()');
  }

  async pruneExpiredPersistentMemory(_organisationId: string): Promise<number> {
    throw new Error(
      'NOT_IMPLEMENTED: MemoryLifecycle.pruneExpiredPersistentMemory()',
    );
  }
}
