/**
 * MAT Test Suite — CAT-06: offline sync
 *
 * Build-to-Green: Tests validate offline sync engine implementation.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it, expect } from 'vitest';
import {
  createOfflineEvidenceEntry,
  enqueueMutation,
  processSyncQueue,
  resolveConflict,
  updateSyncStatus,
  calculateRetryDelay,
  shouldRetry,
  processEvidenceSync,
  getOfflineDbConfig,
  getPWAConfig,
  detectOnlineStatus
} from '../../src/services/offline-sync.js';

describe('CAT-06: offline sync', () => {
  it('MAT-T-0047: Offline Evidence Capture', () => {
    // Architecture: §3.5, §3.12 Path 12 — Offline Evidence Capture
    // FRS: FR-047
    // TRS: TR-015, TR-045
    // Type: integration | Priority: P0
    const entry = createOfflineEvidenceEntry({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'photo',
      content_text: null,
      file_key: 'audit-001/crit-001/photo/photo1.jpg',
      file_name: 'photo1.jpg',
      file_size: 2048000,
      mime_type: 'image/jpeg',
      metadata: { gps_lat: 52.52, gps_lng: 13.405 },
      uploaded_by: 'user-001'
    });

    expect(entry.id).toBeDefined();
    expect(entry.sync_status).toBe('pending');
    expect(entry.retry_count).toBe(0);
    expect(entry.sha256_hash).toBeDefined();
    expect(entry.sha256_hash.length).toBe(64);
    expect(entry.evidence_type).toBe('photo');
    expect(entry.criterion_id).toBe('crit-001');

    const dbConfig = getOfflineDbConfig();
    expect(dbConfig.name).toBe('mat-offline-db');
    const evidenceStore = dbConfig.stores.find(s => s.name === 'evidence_queue');
    expect(evidenceStore).toBeDefined();
    expect(evidenceStore!.indexes).toContain('sync_status');
    expect(evidenceStore!.indexes).toContain('criterion_id');
  });

  it('MAT-T-0048: Auto Sync on Reconnect', () => {
    // Architecture: §3.5, §3.12 Path 12
    // FRS: FR-048
    // TRS: TR-046
    // Type: integration | Priority: P0
    const mutation1 = enqueueMutation({
      entity_type: 'evidence',
      entity_id: 'ev-001',
      action: 'create',
      payload: { criterion_id: 'crit-001', content_text: 'Offline evidence 1' }
    });

    const mutation2 = enqueueMutation({
      entity_type: 'evidence',
      entity_id: 'ev-002',
      action: 'create',
      payload: { criterion_id: 'crit-002', content_text: 'Offline evidence 2' }
    });

    expect(mutation1.sync_status).toBe('pending');
    expect(mutation2.sync_status).toBe('pending');

    const result = processSyncQueue([mutation2, mutation1]);

    expect(result.synced).toHaveLength(2);
    expect(result.failed).toHaveLength(0);
    expect(result.synced[0].sync_status).toBe('synced');
    expect(result.synced[1].sync_status).toBe('synced');
    // Verify FIFO ordering (oldest first)
    expect(new Date(result.synced[0].timestamp).getTime())
      .toBeLessThanOrEqual(new Date(result.synced[1].timestamp).getTime());

    // Verify conflict resolution
    const conflict = resolveConflict(
      { content_text: 'client version', updated_at: '2026-01-01T10:00:00Z' },
      { content_text: 'server version', updated_at: '2026-01-01T11:00:00Z' },
      'evidence',
      'ev-001'
    );
    expect(conflict.resolution).toBe('server_wins');
    expect(conflict.client_version).toBeDefined();
    expect(conflict.server_version).toBeDefined();

    // Verify retry logic
    expect(calculateRetryDelay(0)).toBe(1000);
    expect(calculateRetryDelay(1)).toBe(2000);
    expect(calculateRetryDelay(2)).toBe(4000);
    expect(calculateRetryDelay(3)).toBe(8000);
    expect(calculateRetryDelay(4)).toBe(16000);

    expect(shouldRetry({ ...mutation1, retry_count: 4 })).toBe(true);
    expect(shouldRetry({ ...mutation1, retry_count: 5 })).toBe(false);

    // Verify evidence sync processing
    const offlineEntry = createOfflineEvidenceEntry({
      criterion_id: 'crit-001',
      audit_id: 'audit-001',
      organisation_id: 'org-001',
      evidence_type: 'text',
      content_text: 'Offline text',
      file_key: null,
      file_name: null,
      file_size: null,
      mime_type: null,
      metadata: {},
      uploaded_by: 'user-001'
    });
    const syncLog = processEvidenceSync([offlineEntry]);
    expect(syncLog.status).toBe('completed');
    expect(syncLog.items_total).toBe(1);
    expect(syncLog.items_synced).toBe(1);
    expect(syncLog.items_failed).toBe(0);

    // Verify sync status transitions
    const syncing = updateSyncStatus(offlineEntry, 'syncing');
    expect(syncing.sync_status).toBe('syncing');
    const synced = updateSyncStatus(syncing, 'synced');
    expect(synced.sync_status).toBe('synced');
  });

  it('MAT-T-0064: PWA Support', () => {
    // Architecture: §3.1, §3.5
    // FRS: FR-063
    // TRS: TR-036
    // Type: e2e | Priority: P1
    const pwaConfig = getPWAConfig();

    expect(pwaConfig.name).toBe('MAT - Manual Audit Tool');
    expect(pwaConfig.short_name).toBe('MAT');
    expect(pwaConfig.display).toBe('standalone');
    expect(pwaConfig.offline_capable).toBe(true);
    expect(pwaConfig.service_worker_path).toBe('/sw.js');
    expect(pwaConfig.icons.length).toBeGreaterThanOrEqual(2);

    const maskableIcon = pwaConfig.icons.find(i => i.purpose === 'maskable');
    expect(maskableIcon).toBeDefined();

    const dbConfig = getOfflineDbConfig();
    expect(dbConfig.stores.length).toBe(7);
    expect(dbConfig.stores.map(s => s.name)).toContain('audits');
    expect(dbConfig.stores.map(s => s.name)).toContain('evidence_queue');
    expect(dbConfig.stores.map(s => s.name)).toContain('mutation_queue');
    expect(dbConfig.stores.map(s => s.name)).toContain('sync_log');

    const isOnline = detectOnlineStatus();
    expect(typeof isOnline).toBe('boolean');
  });
});
