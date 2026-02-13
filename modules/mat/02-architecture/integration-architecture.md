# MANUAL AUDIT TOOL (MAT) – INTEGRATION ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| Governance       | Domain 3.6                                 |
| TRS Requirements | TR-016 through TR-021                      |

---

## 1. External Services Inventory

| Service | Purpose | Protocol | Auth | Criticality |
|---------|---------|----------|------|-------------|
| Supabase Auth | Authentication, MFA, session management | HTTPS REST | API Key + JWT | Critical (P0) |
| Supabase PostgREST | CRUD operations with RLS | HTTPS REST | JWT Bearer | Critical (P0) |
| Supabase Realtime | Live dashboard/review table updates | WebSocket | JWT | High (P0) |
| Supabase Storage | Evidence file storage | HTTPS REST | JWT + Signed URLs | Critical (P0) |
| Supabase Edge Functions | Serverless business logic | HTTPS REST | JWT | Critical (P0) |
| OpenAI GPT-4 Turbo | Document parsing, maturity scoring, report generation | HTTPS REST | API Key | Critical (P0) |
| OpenAI GPT-4 Vision | Image interpretation | HTTPS REST | API Key | High (P0) |
| OpenAI Whisper | Audio/video transcription | HTTPS REST | API Key | High (P0) |
| OpenAI GPT-4o Mini | Cost-optimized routine tasks | HTTPS REST | API Key | Medium (P1) |
| PIT Module | Audit findings export | HTTPS REST | Service-role token | Low (P2) |
| Maturity Roadmap Module | Maturity data export | HTTPS REST | Service-role token | Low (P2) |

---

## 2. Supabase Integration (TR-016)

- **Client SDK**: `@supabase/supabase-js` v2+
- **Auth**: JWT tokens with MFA support
- **Database**: PostgREST for CRUD operations, all through RLS
- **Storage**: Supabase Storage SDK for file upload/download with signed URLs
- **Realtime**: Channel subscriptions for dashboard and review table updates
- **Edge Functions**: `supabase.functions.invoke()` for serverless logic
- **CRITICAL**: No service-role key in frontend code; all frontend calls through RLS-protected anon key

### Supabase Connection Configuration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  }
)
```

---

## 3. AI Service Integration (TR-017)

- **AI Gateway**: FastAPI service mediates ALL AI API calls
- **Flow**: Frontend → Supabase Edge Function → AI Gateway → OpenAI API
- **Model Routing**:

  | Task Type | Primary Model | Fallback Model | Max Tokens | Temperature |
  |-----------|--------------|----------------|------------|-------------|
  | document_parsing | gpt-4-turbo | gpt-4o-mini | 4096 | 0.1 |
  | transcription | whisper-1 | N/A | N/A | N/A |
  | scoring | gpt-4-turbo | gpt-4o-mini | 2048 | 0.2 |
  | image_analysis | gpt-4-vision-preview | gpt-4-turbo | 2048 | 0.1 |
  | report_generation | gpt-4-turbo | gpt-4o-mini | 8192 | 0.3 |
  | routine | gpt-4o-mini | N/A | 1024 | 0.1 |

- **Secrets**: API keys in environment variables or secret manager
- **Logging**: Every invocation logged with model, tokens, latency, cost, timestamp, task_type, audit_id, criterion_id
- **Retry**: Exponential backoff (base 1s, max 60s, max 5 retries, with jitter)
- **Circuit Breaker**: Opens at >10% error rate over 5-minute window; half-open after 30s; closes after 3 consecutive successes
- **Fallback**: Switch to fallback model when circuit breaker open; if fallback fails → manual mode offered to user
- **Token Tracking**: Usage tracked per model, per organisation for cost monitoring

---

## 4. PIT Module Integration (TR-018)

- **Endpoint**: `GET /api/v1/audits/{audit_id}/findings/export?format=pit`
- **Response Schema**: OpenAPI 3.1 specification
- **Auth**: Supabase service-role token for inter-module calls
- **RLS**: Organisation isolation enforced on export queries
- **Versioning**: `/v1/` with backward compatibility guarantee
- **Response Format**:

  ```json
  {
    "audit_id": "uuid",
    "export_timestamp": "ISO8601",
    "schema_version": "1.0.0",
    "findings": [
      {
        "criterion_id": "uuid",
        "criterion_number": "1.1.1",
        "maturity_level": "compliant",
        "findings_summary": "...",
        "gap_analysis": { "immediate": "...", "medium_term": "...", "long_term": "..." },
        "evidence_count": 5,
        "confidence": 0.85
      }
    ]
  }
  ```

---

## 5. Maturity Roadmap Integration (TR-019)

- **Maturity Export**: `GET /api/v1/audits/{audit_id}/maturity/export?format=roadmap`
- **Historical Comparison**: `GET /api/v1/organisations/{org_id}/maturity/history`
- **Response Schema**: OpenAPI 3.1
- **Auth**: Service-role token
- **RLS**: Organisation isolation enforced
- **Versioning**: `/v1/` with backward compatibility

---

## 6. External System Data Exchange (TR-021)

- **DOCX**: `docx` npm library with template support
- **PDF**: Puppeteer (HTML-to-PDF) or `@react-pdf/renderer`
- **XLSX**: `exceljs` library
- **JSON**: Versioned schema with JSON Schema validation
- **CSV**: RFC 4180 compliant for tabular data
- **Metadata**: All exports include export timestamp, audit version, schema version

---

## 7. Dependency Failure Modes

| Dependency | Failure Mode | Detection | Mitigation | Degraded Behavior |
|-----------|-------------|-----------|------------|-------------------|
| Supabase Auth | Auth service down | HTTP 5xx, timeout >5s | Cached JWT valid for 1hr; retry with backoff | Read-only mode with cached session |
| Supabase PostgREST | Database unavailable | HTTP 5xx, connection timeout | Retry 3x with 1s backoff | Offline mode with cached data |
| Supabase Realtime | WebSocket disconnect | Connection lost event | Auto-reconnect with backoff (1s, 2s, 4s...) | Polling fallback every 30s |
| Supabase Storage | Storage service error | HTTP 5xx on upload | Retry 3x; queue for later | Local file cache; sync later |
| OpenAI API | Rate limit (429) | HTTP 429 response | Exponential backoff + circuit breaker | Queue requests; delay processing |
| OpenAI API | Service unavailable (5xx) | HTTP 5xx | Circuit breaker → fallback model | Manual scoring mode |
| OpenAI API | Timeout | No response >120s | Cancel + retry with smaller payload | Queue for retry; notify user |
| PIT Module | Export endpoint down | HTTP 5xx, timeout | Retry 3x; cache last successful export | Show cached/stale export data |
| Maturity Roadmap | Export endpoint down | HTTP 5xx, timeout | Retry 3x | Show cached history data |

---

## 8. Retry and Timeout Strategies

| Service | Timeout | Max Retries | Backoff | Jitter |
|---------|---------|------------|---------|--------|
| Supabase Auth | 10s | 3 | Linear 1s | ±500ms |
| Supabase PostgREST | 30s | 3 | Linear 1s | ±500ms |
| Supabase Storage | 120s (upload) | 3 | Exponential 2s base | ±1s |
| OpenAI API | 120s | 5 | Exponential 1s base, max 60s | ±2s |
| PIT Module | 30s | 3 | Linear 2s | ±1s |
| Maturity Roadmap | 30s | 3 | Linear 2s | ±1s |

---

## 9. Circuit Breaker Configuration

```
AI Gateway Circuit Breaker:
  - Window: 5 minutes
  - Error Threshold: 10% of requests
  - State: CLOSED → OPEN (>10% errors) → HALF-OPEN (30s) → CLOSED (3 successes)
  - Fallback: Switch to fallback model
  - Manual Mode: If fallback also fails, offer manual scoring to user
  - Metrics: Error rate, state, transitions logged to watchdog_metrics table
```

---

## 10. Startup Order and Dependency Resolution

1. Supabase (PostgreSQL, Auth, Storage, Realtime) — must be available first
2. AI Gateway containers — health check against /health endpoint
3. Frontend deployment — verifies Supabase connectivity on load
4. Edge Functions — available on-demand (cold start ~200ms)

---

## 11. Shutdown and Failure Cascades

- **Supabase down**: Frontend enters offline mode; AI Gateway queues requests; all mutations stored locally
- **AI Gateway down**: Frontend shows "AI unavailable" status; manual scoring mode available; no AI features
- **OpenAI API down**: Circuit breaker activates; fallback model tried; then manual mode
- **Frontend CDN down**: Service Worker serves cached app shell; offline functionality continues
- **Network partition**: Service Worker captures all mutations; sync on reconnect
