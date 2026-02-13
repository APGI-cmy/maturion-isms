# MANUAL AUDIT TOOL (MAT) – OFFLINE/SYNC ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| TRS References   | TR-045, TR-046, TR-015, TR-036             |

---

## 1. Service Worker Architecture (TR-045)

### Registration

- Service Worker registered on first visit via `navigator.serviceWorker.register('/sw.js')`
- Built with Workbox (vite-plugin-pwa integration)
- Update strategy: Skip waiting + claim clients for immediate activation

### Caching Strategy

| Resource Type | Strategy | Cache Name | TTL |
|---|---|---|---|
| App shell (HTML) | Cache-first | mat-app-shell | Until SW update |
| Static assets (JS, CSS, images) | Cache-first | mat-static-v1 | Until build hash changes |
| API responses (GET) | Network-first | mat-api-cache | 1 hour |
| API mutations (POST, PUT, DELETE) | Queue for sync | mat-mutation-queue | Until synced |
| Evidence files | Cache API / OPFS | mat-evidence-cache | Until synced |
| i18n translation files | Cache-first | mat-i18n | Until SW update |

### Offline Capability

- App shell always available offline (cache-first)
- API GET requests served from cache when offline
- API mutations queued in IndexedDB for later sync
- Evidence files stored in Cache API or OPFS
- Offline duration: 72+ hours without connectivity

### Lifecycle

1. **Install**: Pre-cache app shell and critical assets
2. **Activate**: Clean old caches, take control of all clients
3. **Fetch**: Intercept requests, apply caching strategy
4. **Sync**: On reconnect, process mutation queue
5. **Update**: New SW version detected → notify user → skip waiting

---

## 2. Offline Data Storage (TR-015)

### IndexedDB Database: `mat-offline-db`

#### Object Stores

| Store | Key Path | Indexes | Purpose |
|---|---|---|---|
| audits | id | organisation_id, status | Cached audit data |
| domains | id | audit_id | Cached domain hierarchy |
| mps | id | domain_id, audit_id | Cached MPS data |
| criteria | id | mps_id, audit_id, status | Cached criteria data |
| evidence_queue | id | criterion_id, sync_status, created_at | Offline-captured evidence |
| mutation_queue | id | timestamp, entity_type, sync_status | Queued API mutations |
| sync_log | id | timestamp, status | Sync operation history |

### Capacity

- Minimum 1,000 evidence items before sync required (per FR-047)
- Minimum 2GB reserved storage capacity
- Storage estimate checked via `navigator.storage.estimate()`
- If storage < 500MB available, warn user to sync

### File Storage (Cache API / OPFS)

- Evidence files (photos, documents, recordings) stored in OPFS when available
- Fallback to Cache API for browsers without OPFS support
- Files keyed by: `{audit_id}/{criterion_id}/{evidence_type}/{uuid}.{ext}`
- File metadata stored in IndexedDB evidence_queue store

---

## 3. Sync Protocol (TR-046)

### Sync Trigger

- `navigator.onLine` event listener
- Periodic sync check every 60 seconds (when online)
- Manual sync button in UI
- Background sync API (where browser supports it)

### Sync Process

```
1. Detect online status
2. Check mutation_queue for pending items
3. Sort by timestamp (oldest first)
4. For each mutation:
   a. Update sync_status → 'syncing'
   b. Send to Supabase API
   c. If success:
      - Update sync_status → 'synced'
      - Remove from queue
   d. If conflict (409):
      - Apply last-writer-wins resolution
      - Store both versions in audit trail
      - Update sync_status → 'synced'
   e. If failure (5xx, network):
      - Increment retry_count
      - Update sync_status → 'failed'
      - Apply exponential backoff
      - If retry_count > 5 → flag for manual resolution
5. Sync evidence files:
   a. Upload files from OPFS/Cache API to Supabase Storage
   b. Compute SHA-256 hash on upload
   c. Update evidence record with storage URL
6. Update sync_log with results
7. Notify user of sync completion/failures
```

### Idempotency

- Client generates UUIDs for all offline records
- Server uses UUID as deduplication key (`INSERT ... ON CONFLICT DO NOTHING`)
- Retrying a sync operation produces the same result

### Conflict Resolution

- **Detection**: Server checks `updated_at` timestamp against client version
- **Strategy**: Last-writer-wins (client timestamp wins if newer)
- **History**: Both versions stored in audit trail for transparency
- **User Notification**: Conflicts shown in sync status UI; user can review

### Sync Status (per item)

| Status | Meaning |
|---|---|
| pending | Created offline, not yet synced |
| syncing | Currently being synced |
| synced | Successfully synced to server |
| failed | Sync failed after retries |

### Partial Sync Recovery

- If connectivity drops during sync, remaining items synced on next connection
- Each item synced independently (one failure doesn't block others)
- Sync progress percentage shown in UI

### Retry Strategy

- Max 5 retries per item
- Exponential backoff: 1s, 2s, 4s, 8s, 16s
- After 5 failures → flag for manual resolution

---

## 4. PWA Implementation (TR-036)

### Web App Manifest

```json
{
  "name": "MAT - Manual Audit Tool",
  "short_name": "MAT",
  "description": "AI-assisted structured audit execution platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a1a2e",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/desktop.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" },
    { "src": "/screenshots/mobile.png", "sizes": "375x812", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

### Install Prompt

- `beforeinstallprompt` event captured
- Custom install banner shown after first successful audit creation
- Supported on iOS (Add to Home Screen), Android (Chrome install), Chrome desktop

### Push Notifications (optional)

- Sync completion notification
- Alert notifications (watchdog thresholds exceeded)
- Requires explicit user permission
- Firebase Cloud Messaging or Web Push API

---

## 5. Offline User Experience

### Online/Offline Indicator

- Visual indicator in app header showing connection status
- Color: Green (online), Yellow (syncing), Red (offline)
- Tooltip showing sync queue count and last sync time

### Offline-Available Features

| Feature | Offline | Notes |
|---|---|---|
| View audit data | ✅ | From IndexedDB cache |
| Navigate hierarchy | ✅ | Cached domain/MPS/criteria |
| Capture text evidence | ✅ | Stored in IndexedDB |
| Record voice | ✅ | MediaRecorder → OPFS |
| Take photos | ✅ | Camera → OPFS |
| Upload documents | ✅ | File → OPFS |
| Record video | ✅ | MediaRecorder → OPFS |
| AI scoring | ❌ | Requires API connection |
| Report generation | ❌ | Requires API connection |
| Dashboard (real-time) | ❌ | Shows cached snapshot |
| User management | ❌ | Requires API connection |

### Data Freshness

- Timestamps on all cached data shown to user
- "Last synced: X minutes ago" displayed in header
- Stale data warning if > 24 hours since last sync
