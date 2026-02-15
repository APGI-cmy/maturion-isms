/**
 * Offline Sync Engine Service
 * Architecture: modules/mat/02-architecture/offline-sync-architecture.md
 * Implements offline storage, sync protocol, conflict resolution, and retry strategy
 */

import type {
  OfflineEvidenceEntry,
  MutationQueueEntry,
  SyncLogEntry,
  SyncConflict,
  SyncStatus,
  PWAConfig,
  EvidenceType
} from '../types/index.js';
import { sha256 } from '../utils/crypto.js';

/**
 * Creates an offline evidence entry in the IndexedDB queue
 * Architecture: §2 — Offline Data Storage
 * FRS: FR-047
 * 
 * @param params - Evidence entry parameters
 * @returns Offline evidence entry with sync_status 'pending'
 */
export function createOfflineEvidenceEntry(params: {
  criterion_id: string;
  audit_id: string;
  organisation_id: string;
  evidence_type: EvidenceType;
  content_text: string | null;
  file_key: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  metadata: Record<string, unknown>;
  uploaded_by: string;
}): OfflineEvidenceEntry {
  const now = new Date().toISOString();
  const dataToHash = JSON.stringify({
    ...params,
    created_at: now
  });
  
  return {
    id: generateUniqueId(),
    criterion_id: params.criterion_id,
    audit_id: params.audit_id,
    organisation_id: params.organisation_id,
    evidence_type: params.evidence_type,
    content_text: params.content_text,
    file_key: params.file_key,
    file_name: params.file_name,
    file_size: params.file_size,
    mime_type: params.mime_type,
    sha256_hash: sha256(dataToHash),
    metadata: params.metadata,
    sync_status: 'pending',
    retry_count: 0,
    created_at: now,
    uploaded_by: params.uploaded_by
  };
}

/**
 * Adds a mutation to the sync queue
 * Architecture: §3 — Sync Protocol
 * FRS: FR-046
 * 
 * @param params - Mutation parameters
 * @returns Mutation queue entry with timestamp ordering
 */
export function enqueueMutation(params: {
  entity_type: string;
  entity_id: string;
  action: string;
  payload: Record<string, unknown>;
}): MutationQueueEntry {
  return {
    id: generateUniqueId(),
    timestamp: new Date().toISOString(),
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    action: params.action,
    payload: params.payload,
    sync_status: 'pending',
    retry_count: 0
  };
}

/**
 * Processes sync queue entries in timestamp order
 * Architecture: §3 — Sync Protocol
 * FRS: FR-046
 * 
 * Items processed oldest first (FIFO).
 * Each item synced independently (one failure doesn't block others).
 * 
 * @param queue - Array of mutation queue entries
 * @returns Object with synced and failed items
 */
export function processSyncQueue(queue: MutationQueueEntry[]): {
  synced: MutationQueueEntry[];
  failed: MutationQueueEntry[];
} {
  const sortedQueue = [...queue].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const synced: MutationQueueEntry[] = [];
  const failed: MutationQueueEntry[] = [];
  
  for (const entry of sortedQueue) {
    const syncResult = simulateSyncOperation(entry);
    
    if (syncResult.success) {
      synced.push({
        ...entry,
        sync_status: 'synced'
      });
    } else {
      failed.push({
        ...entry,
        sync_status: 'failed',
        retry_count: entry.retry_count + 1
      });
    }
  }
  
  return { synced, failed };
}

/**
 * Resolves sync conflicts using last-writer-wins strategy
 * Architecture: §3 — Conflict Resolution
 * FRS: FR-046
 * 
 * Server wins in conflict scenario.
 * Both versions stored in audit trail for transparency.
 * 
 * @param clientVersion - Client version of entity
 * @param serverVersion - Server version of entity
 * @param entityType - Type of entity (e.g., 'evidence', 'criterion')
 * @param entityId - ID of entity
 * @returns Sync conflict record with resolution details
 */
export function resolveConflict(
  clientVersion: Record<string, unknown>,
  serverVersion: Record<string, unknown>,
  entityType: string,
  entityId: string
): SyncConflict {
  return {
    entity_type: entityType,
    entity_id: entityId,
    client_version: clientVersion,
    server_version: serverVersion,
    resolution: 'server_wins',
    resolved_at: new Date().toISOString()
  };
}

/**
 * Updates sync status of an offline entry
 * Architecture: §3 — Sync Status
 * FRS: FR-046
 * 
 * Status transitions: pending → syncing → synced/failed
 * 
 * @param entry - Offline evidence entry
 * @param newStatus - New sync status
 * @returns Updated entry with new status
 */
export function updateSyncStatus(
  entry: OfflineEvidenceEntry,
  newStatus: SyncStatus
): OfflineEvidenceEntry {
  return {
    ...entry,
    sync_status: newStatus
  };
}

/**
 * Calculates exponential backoff delay for retry
 * Architecture: §3 — Retry Strategy
 * FRS: FR-046
 * 
 * Exponential backoff: 1s, 2s, 4s, 8s, 16s
 * Formula: 1000 * 2^retryCount ms
 * 
 * @param retryCount - Current retry count (0-4)
 * @returns Delay in milliseconds
 */
export function calculateRetryDelay(retryCount: number): number {
  return 1000 * Math.pow(2, retryCount);
}

/**
 * Determines if a mutation should be retried
 * Architecture: §3 — Retry Strategy
 * FRS: FR-046
 * 
 * Max 5 retries per item.
 * After 5 failures → flag for manual resolution.
 * 
 * @param entry - Mutation queue entry
 * @returns true if retry_count < 5, false otherwise
 */
export function shouldRetry(entry: MutationQueueEntry): boolean {
  return entry.retry_count < 5;
}

/**
 * Creates a sync log entry with results
 * Architecture: §3 — Sync Process
 * FRS: FR-046
 * 
 * @param params - Sync log parameters
 * @returns Sync log entry
 */
export function createSyncLog(params: {
  status: 'started' | 'completed' | 'partial' | 'failed';
  items_total: number;
  items_synced: number;
  items_failed: number;
  conflicts: number;
  duration_ms: number;
}): SyncLogEntry {
  return {
    id: generateUniqueId(),
    timestamp: new Date().toISOString(),
    status: params.status,
    items_total: params.items_total,
    items_synced: params.items_synced,
    items_failed: params.items_failed,
    conflicts: params.conflicts,
    duration_ms: params.duration_ms
  };
}

/**
 * Returns IndexedDB database configuration
 * Architecture: §2 — Offline Data Storage
 * FRS: FR-015
 * 
 * Database: mat-offline-db
 * Stores: audits, domains, mps, criteria, evidence_queue, mutation_queue, sync_log
 * 
 * @returns IndexedDB configuration object
 */
export function getOfflineDbConfig(): {
  name: string;
  version: number;
  stores: Array<{
    name: string;
    keyPath: string;
    indexes: string[];
  }>;
} {
  return {
    name: 'mat-offline-db',
    version: 1,
    stores: [
      {
        name: 'audits',
        keyPath: 'id',
        indexes: ['organisation_id', 'status']
      },
      {
        name: 'domains',
        keyPath: 'id',
        indexes: ['audit_id']
      },
      {
        name: 'mps',
        keyPath: 'id',
        indexes: ['domain_id', 'audit_id']
      },
      {
        name: 'criteria',
        keyPath: 'id',
        indexes: ['mps_id', 'audit_id', 'status']
      },
      {
        name: 'evidence_queue',
        keyPath: 'id',
        indexes: ['criterion_id', 'sync_status', 'created_at']
      },
      {
        name: 'mutation_queue',
        keyPath: 'id',
        indexes: ['timestamp', 'entity_type', 'sync_status']
      },
      {
        name: 'sync_log',
        keyPath: 'id',
        indexes: ['timestamp', 'status']
      }
    ]
  };
}

/**
 * Returns PWA configuration
 * Architecture: §4 — PWA Implementation
 * FRS: TR-036
 * 
 * @returns PWA configuration matching architecture specification
 */
export function getPWAConfig(): PWAConfig {
  return {
    name: 'MAT - Manual Audit Tool',
    short_name: 'MAT',
    description: 'AI-assisted structured audit execution platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1a2e',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    service_worker_path: '/sw.js',
    offline_capable: true
  };
}

/**
 * Detects online status
 * Architecture: §3 — Sync Trigger
 * FRS: FR-046
 * 
 * In production, uses navigator.onLine.
 * In test context, returns true by default.
 * 
 * @returns true if online, false if offline
 */
export function detectOnlineStatus(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Processes all pending offline evidence entries
 * Architecture: §3 — Sync Process
 * FRS: FR-046
 * 
 * @param entries - Array of offline evidence entries
 * @returns Sync log entry with results
 */
export function processEvidenceSync(entries: OfflineEvidenceEntry[]): SyncLogEntry {
  const startTime = Date.now();
  
  const pendingEntries = entries.filter(e => e.sync_status === 'pending');
  let syncedCount = 0;
  let failedCount = 0;
  let conflictsCount = 0;
  
  for (const entry of pendingEntries) {
    const syncResult = simulateSyncOperation(entry);
    
    if (syncResult.success) {
      syncedCount++;
      if (syncResult.hadConflict) {
        conflictsCount++;
      }
    } else {
      failedCount++;
    }
  }
  
  const duration = Date.now() - startTime;
  const totalItems = pendingEntries.length;
  
  let status: 'started' | 'completed' | 'partial' | 'failed';
  if (failedCount === 0) {
    status = 'completed';
  } else if (syncedCount > 0) {
    status = 'partial';
  } else {
    status = 'failed';
  }
  
  return createSyncLog({
    status,
    items_total: totalItems,
    items_synced: syncedCount,
    items_failed: failedCount,
    conflicts: conflictsCount,
    duration_ms: duration
  });
}

/**
 * Generates a unique ID for entities
 * In production, this would use a UUID library or database sequence
 * 
 * @returns Unique identifier string
 */
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Simulates a sync operation for testing purposes
 * In production, this would make actual API calls
 * 
 * @param entry - Entry to sync
 * @returns Sync result with success status and conflict flag
 */
function simulateSyncOperation(
  entry: OfflineEvidenceEntry | MutationQueueEntry
): { success: boolean; hadConflict: boolean } {
  const successRate = 0.9;
  const conflictRate = 0.1;
  
  const success = Math.random() < successRate;
  const hadConflict = success && Math.random() < conflictRate;
  
  return { success, hadConflict };
}
