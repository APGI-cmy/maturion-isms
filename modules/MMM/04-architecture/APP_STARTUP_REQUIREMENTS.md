# MMM — Application Startup Requirements

**Module**: MMM (Maturity Management Module)  
**Version**: 1.0.0  
**Stage**: Architecture (Stage 5)  
**Date**: 2026-04-14  
**Authority**: TR-064 (FR-072, TR-051)  
**Status**: COMPLETE

---

## Overview

This document specifies the application startup requirements for the MMM module, including the
commissioning state machine and the five readiness checks (CHK-001 through CHK-005) that must
pass before the application enters the ACTIVATED state.

**Source requirements**: TR-051 (commissioning state machine), TR-064 (APP_STARTUP_REQUIREMENTS.md
artifact), FR-072 (commissioning model).  
**Architecture reference**: §A4.3 — Business Logic Layer (commissioning state machine); §A8.4
— Environment Variables and Configuration Management.

---

## Commissioning State Machine

The MMM application progresses through four states during startup. The ACTIVATED state
(fully operational) is only reachable after all five commissioning checks pass.

```
INSTALLED
    │
    │  [All environment variables present — CHK-001 + CHK-002]
    ▼
VALIDATED
    │
    │  [AIMC gateway reachable — CHK-003]
    │  [RLS policies active — CHK-004]
    │  [Storage bucket accessible — CHK-005]
    ▼
COMMISSIONED
    │
    │  [Health endpoint reports all services UP]
    ▼
ACTIVATED
    │
    [Application fully operational — serving requests]
```

**Failure behaviour**: Any check failure halts the commissioning sequence. The application
renders a degraded/maintenance view. The `/api/health` endpoint continues to respond and
reports the failing check(s). No user-facing routes are served in a non-ACTIVATED state.

**Fatal configuration errors** (as per §A4.3): Commissioning state machine failure renders
a maintenance/degraded screen rather than allowing partial operation.

---

## Commissioning Checks (CHK-001 through CHK-005)

### CHK-001 — Supabase Connectivity

- **Description**: Verify that the `VITE_SUPABASE_URL` environment variable is present and
  that the Supabase project is reachable via a health ping.
- **Validation**:
  1. Assert `VITE_SUPABASE_URL` is set and non-empty.
  2. Assert `VITE_SUPABASE_ANON_KEY` is set and non-empty.
  3. Assert `SUPABASE_SERVICE_ROLE_KEY` is set and non-empty (Edge Function scope).
  4. Perform HTTP GET to `${VITE_SUPABASE_URL}/rest/v1/` with `apikey: ${VITE_SUPABASE_ANON_KEY}` header.
  5. Assert HTTP 200 response within 5 seconds.
- **Failure action**:
  - Halt commissioning sequence at INSTALLED state.
  - Set `/api/health` response: `{ "status": "DOWN", "services": { "database": "DOWN" }, "commissioning": { "state": "INSTALLED", "failedCheck": "CHK-001" } }`.
  - Render maintenance screen with message: *"Database connection unavailable. Contact your system administrator."*
  - Do not expose environment variable values in any error response or log output.
- **Covered by**: TR-051 (commissioning check 1), TR-053 (environment variable requirement), §A8.4

---

### CHK-002 — Supabase Schema Currency

- **Description**: Verify that the Supabase database schema is current — i.e., the migration
  version matches the expected version for this application release.
- **Validation**:
  1. Query `SELECT version FROM supabase_migrations ORDER BY version DESC LIMIT 1` via service role.
  2. Compare returned migration version against `EXPECTED_MIGRATION_VERSION` constant defined in
     the commissioning Edge Function.
  3. Assert versions match (equality check).
- **Failure action**:
  - Halt commissioning sequence at VALIDATED state (environment variables present, schema not current).
  - Set `/api/health` response: `{ "status": "DEGRADED", "services": { "database": "DEGRADED" }, "commissioning": { "state": "VALIDATED", "failedCheck": "CHK-002", "detail": "Schema migration mismatch" } }`.
  - Render maintenance screen with message: *"Database schema is not current. A migration may be pending."*
  - Log migration version mismatch to Edge Function structured log (versions only, no data).
- **Covered by**: TR-051 (commissioning check 2), TR-050 (schema migrations), §A8.4 (CHK-002 reference)

---

### CHK-003 — AIMC Gateway Reachability

- **Description**: Verify that the AIMC gateway is reachable at the configured `AIMC_BASE_URL`
  via its health endpoint.
- **Validation**:
  1. Assert `AIMC_BASE_URL` is set and non-empty (Edge Function scope).
  2. Assert `AIMC_SERVICE_TOKEN` is set and non-empty (Edge Function scope).
  3. Perform HTTP GET to `${AIMC_BASE_URL}/health` with `Authorization: Bearer ${AIMC_SERVICE_TOKEN}` header.
  4. Assert HTTP 200 response within 5 seconds.
  5. Assert response body contains `{ "status": "ok" }` or equivalent AIMC health format.
- **Failure action**:
  - Do NOT halt full commissioning (AIMC unavailability is a degraded-mode condition, not a fatal error).
  - Set circuit breaker to OPEN state for all AIMC-dependent Edge Functions.
  - Set `/api/health` response: `{ "status": "DEGRADED", "services": { "aimc": "DOWN" }, "commissioning": { "state": "COMMISSIONED", "failedCheck": "CHK-003", "detail": "AIMC gateway unreachable — AI features degraded" } }`.
  - Allow application to enter COMMISSIONED state; AI-dependent features return graceful fallback responses.
  - Log AIMC reachability failure to structured log (URL only, no token).
- **Degraded-mode behaviour**: All `mmm-ai-*` Edge Functions return `{ "status": "degraded", "message": "AI features temporarily unavailable" }` while circuit breaker is OPEN.
- **Covered by**: TR-051 (commissioning check 3), TR-009 (circuit breaker), §A8.3 (AIMC topology), §A8.6 (non-testable config)

---

### CHK-004 — RLS Policies Active

- **Description**: Verify that required Row-Level Security policies are active on the Supabase
  database by performing a spot-check query via a non-privileged user context.
- **Validation**:
  1. Using a test service role session, execute a spot-check query:
     `SELECT COUNT(*) FROM pg_policies WHERE tablename = 'mmm_evidence' AND policyname LIKE 'org_isolation%'`.
  2. Assert COUNT > 0 (at least one org isolation policy exists on `mmm_evidence`).
  3. Perform a second check: query `information_schema.tables` to confirm RLS is enabled:
     `SELECT row_security FROM information_schema.tables WHERE table_name = 'mmm_evidence'`.
  4. Assert `row_security = 'YES'`.
- **Failure action**:
  - Halt commissioning sequence; do not allow application to enter ACTIVATED state.
  - Set `/api/health` response: `{ "status": "DOWN", "services": { "database": "DOWN" }, "commissioning": { "state": "COMMISSIONED", "failedCheck": "CHK-004", "detail": "RLS policies not active — data isolation not guaranteed" } }`.
  - Render maintenance screen with message: *"Security configuration error. Contact your system administrator immediately."*
  - Emit CRITICAL-level structured log entry: `"CHK-004 FAIL: RLS not active on mmm_evidence"`.
- **Covered by**: TR-051 (commissioning check 4), TR-031 (RLS baseline), TR-032 (data isolation), §A5.3, §A8.6

---

### CHK-005 — Storage Bucket Accessibility

- **Description**: Verify that the `mmm-evidence` Supabase Storage bucket is accessible and
  that the service role key can perform operations against it.
- **Validation**:
  1. Using the service role key, perform a Supabase Storage API call to list objects in the
     `mmm-evidence` bucket: `GET /storage/v1/object/list/mmm-evidence` with service role auth.
  2. Assert HTTP 200 response (bucket exists and service role has access).
  3. Verify that an unauthenticated request to `mmm-evidence` returns HTTP 400 or 401
     (bucket is not publicly accessible).
- **Failure action**:
  - Halt commissioning sequence; do not allow application to enter ACTIVATED state.
  - Set `/api/health` response: `{ "status": "DOWN", "services": { "storage": "DOWN" }, "commissioning": { "state": "COMMISSIONED", "failedCheck": "CHK-005", "detail": "Evidence storage bucket inaccessible" } }`.
  - Render maintenance screen with message: *"Evidence storage unavailable. Contact your system administrator."*
  - Log failure with bucket name only; do not log credentials.
- **Covered by**: TR-051 (commissioning check 5), TR-047 (Supabase Storage bucket config), §A8.2 (storage topology), §A8.6

---

## Check Summary Table

| Check | Name | Blocking | Failure State | Architecture Ref |
|-------|------|----------|---------------|-----------------|
| CHK-001 | Supabase Connectivity | ✅ FATAL — halts at INSTALLED | `database: DOWN` | §A8.4, §A7.1 |
| CHK-002 | Supabase Schema Currency | ✅ FATAL — halts at VALIDATED | `database: DEGRADED` | §A8.4, §A8.5 |
| CHK-003 | AIMC Gateway Reachability | ⚠️ DEGRADED — circuit breaker OPEN | `aimc: DOWN` | §A8.3, §A4.5 |
| CHK-004 | RLS Policies Active | ✅ FATAL — halts at COMMISSIONED | `database: DOWN` | §A5.3, §A7.2 |
| CHK-005 | Storage Bucket Accessibility | ✅ FATAL — halts at COMMISSIONED | `storage: DOWN` | §A8.2 |

**Legend**:  
✅ FATAL = application does not reach ACTIVATED state; maintenance screen displayed.  
⚠️ DEGRADED = application reaches ACTIVATED state with reduced capability; AI features unavailable.

---

## Health Endpoint Contract

The `/api/health` Edge Function (TR-052) reports commissioning state and per-service status:

```json
{
  "status": "UP | DEGRADED | DOWN",
  "version": "string",
  "timestamp": "ISO8601",
  "commissioning": {
    "state": "INSTALLED | VALIDATED | COMMISSIONED | ACTIVATED",
    "failedCheck": "CHK-001 | CHK-002 | CHK-003 | CHK-004 | CHK-005 | null"
  },
  "services": {
    "database": "UP | DEGRADED | DOWN",
    "auth": "UP | DEGRADED | DOWN",
    "storage": "UP | DEGRADED | DOWN",
    "aimc": "UP | DEGRADED | DOWN",
    "pit": "UP | DEGRADED | DOWN"
  }
}
```

**Rollback trigger**: `services.database = DOWN` or `services.auth = DOWN` in production
health response → rollback consideration (per §A8.6).

---

## Commissioning Check Implementation Location

| Check | Implementation | Edge Function |
|-------|---------------|---------------|
| CHK-001 | Supabase connectivity health ping | `mmm-commissioning-check` |
| CHK-002 | Migration version query | `mmm-commissioning-check` |
| CHK-003 | AIMC health endpoint call | `mmm-commissioning-check` |
| CHK-004 | RLS spot-check query | `mmm-commissioning-check` |
| CHK-005 | Storage bucket list operation | `mmm-commissioning-check` |

All five checks are implemented within the `mmm-commissioning-check` Edge Function
(see architecture.md §A4.1 Edge Function registry). This function is invoked:
1. At application startup (before ACTIVATED state).
2. Periodically by the health endpoint (TR-052) for ongoing monitoring.
3. Post-deployment as a CI/CD gate step (§A8.5).

---

## CI/CD Integration (§A8.5)

The commissioning check is integrated into the CI/CD pipeline as follows:

1. **Post-deploy step**: After Vercel preview/production deployment, invoke
   `mmm-commissioning-check` Edge Function via HTTP.
2. **Gate condition**: Deployment pipeline fails if commissioning state ≠ ACTIVATED
   (with CHK-003 as an exception — DEGRADED is acceptable for CI where AIMC is not
   connected in test environment).
3. **Reported in**: Vercel deployment status + pipeline summary log.

---

*Commissioning check implementation occurs in Build Stage (Stage 6+). This document covers Architecture-stage specification only.*
