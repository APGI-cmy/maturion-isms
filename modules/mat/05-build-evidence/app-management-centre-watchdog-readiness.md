# MAT — App Management Centre Watchdog Readiness

**Title**: MAT — App Management Centre Watchdog Readiness  
**Date**: 2026-03-05  
**Module**: MAT (Manual Audit Tool)  
**Author**: mat-specialist (supervised by foreman-v2-agent)  
**Issue**: #909 — Wave 14 UX Workflow Gap Remediation  
**Status**: ✅ READY FOR INTEGRATION (schema complete, hooks defined)

---

## 1. Purpose

This document describes the current state of MAT's readiness for future integration with the `app_management_centre` watchdog and monitoring subsystem. It defines the expected health check surface, key event hooks, monitoring surfaces available today, the integration interface contract, and the dependencies required before full watchdog integration can be activated.

This document is a living reference for the team responsible for implementing the `app_management_centre` module and its MAT integration adapter.

---

## 2. Health Check Endpoints

The following health check interface is defined for future implementation. These endpoints should be surfaced by the MAT API layer and consumed by the `app_management_centre` watchdog on a configurable polling interval.

### 2.1 Defined Endpoint

```
GET /api/health/mat
```

**Response schema**:
```json
{
  "status": "healthy" | "degraded" | "offline",
  "timestamp": "<ISO-8601>",
  "checks": {
    "auth": {
      "status": "healthy" | "degraded" | "offline",
      "latency_ms": 42
    },
    "schema": {
      "status": "healthy" | "degraded" | "offline",
      "tables_reachable": ["audits", "criteria", "criteria_evaluations"]
    },
    "workflow": {
      "status": "healthy" | "degraded" | "offline",
      "pipeline": "create_audit → evidence → evaluate → report"
    }
  }
}
```

### 2.2 Health Check Surface

| Check Name | Description | Test Pattern Reference |
|------------|-------------|----------------------|
| **Authentication health** | Supabase auth service reachability; validates that `getAuthenticatedClient()` returns a valid session | T-W13-E2E-3 pattern (requires live deployment) |
| **Schema health** | Confirms the `audits` table is reachable via the MAT API layer; validates that RLS-protected queries return expected structure | T-W13-E2E-2 pattern (requires live deployment) |
| **MAT workflow health** | End-to-end pipeline reachability: Create audit → Submit evidence → Trigger AI evaluation → Generate report | Wave 14 full-pipeline integration pattern |

### 2.3 Status Definitions

| Status | Meaning | Watchdog Action |
|--------|---------|----------------|
| `healthy` | All checks passing within acceptable latency | No action |
| `degraded` | One or more checks failing or exceeding latency threshold, but core function available | Alert + log |
| `offline` | Core function unavailable; audits cannot be created or evaluated | Incident trigger |

---

## 3. Key Event Hooks (Monitoring Surfaces)

The following application events are defined as the primary monitoring surface for the `app_management_centre` watchdog. These events are emitted by the MAT application layer at key lifecycle transitions.

> **Current state**: Events are architecturally defined. Emission requires Edge Function deployment to the live Supabase environment (see Section 6 — Dependencies).

### 3.1 Event Catalogue

| Event Name | Trigger Point | Payload |
|------------|--------------|---------|
| `mat.audit.created` | New audit record inserted into `public.audits` | `{ audit_id: UUID, organisation_id: UUID }` |
| `mat.evidence.submitted` | Evidence item confirmed in `public.evidence_items` | `{ audit_id: UUID, criteria_id: UUID }` |
| `mat.evaluation.triggered` | AI evaluation record created in `public.criteria_evaluations` | `{ criteria_evaluation_id: UUID }` |
| `mat.report.generated` | Report record inserted into `public.audit_reports` | `{ audit_report_id: UUID, organisation_id: UUID }` |
| `mat.onboarding.completed` | Organisation onboarding state transitions to `completed` in `public.organisation_onboarding_state` | `{ organisation_id: UUID }` |

### 3.2 Subscription Pattern

The `app_management_centre` watchdog should subscribe to MAT events using the following pattern:

```typescript
// Pseudocode — implementation via Edge Function or Supabase Realtime
watchdog.subscribeToEvents([
  'mat.audit.created',
  'mat.evidence.submitted',
  'mat.evaluation.triggered',
  'mat.report.generated',
  'mat.onboarding.completed'
]);
```

Event delivery guarantees and retry semantics are to be defined by the `app_management_centre` architecture team at integration time.

---

## 4. Monitoring Surfaces (Current State)

The following monitoring capabilities are available today within the MAT module, prior to any `app_management_centre` integration:

### 4.1 Supabase RLS Coverage

All 13 new org-scoped tables introduced in Wave 14 have `SELECT` RLS policies enforcing organisation-scoped data isolation. RLS coverage can be verified by the watchdog against the Supabase `pg_policies` system catalogue.

| Coverage | Status | Source |
|----------|--------|--------|
| All 13 Wave 14 new tables — RLS SELECT policies | ✅ CONFIRMED | GAP-W15 / `20260305000008_wave14_new_tables_rls.sql` |
| Org-isolation pattern | JOIN to `public.audits` on `organisation_id` | Consistent across all new table policies |

### 4.2 Schema Completeness

| Metric | Value | Source |
|--------|-------|--------|
| Migration files covering all 15 GAPs | 9 migrations | Wave 14 Batch A–C delivery |
| Tables introduced in Wave 14 | 13 new tables | Across all 9 migration files |
| Schema version (Wave 14 final) | `20260305000008` | `20260305000008_wave14_new_tables_rls.sql` |

### 4.3 Test Coverage

| Metric | Value | Date |
|--------|-------|------|
| Total passing vitest tests (file-based CI) | 706+ | 2026-03-05 |
| Wave 14-specific tests GREEN | 16 (T-W14-UX-001–016) | 2026-03-05 |
| Regressions against prior wave baseline | Zero | 2026-03-05 |

### 4.4 Score Computation

The `aggregate_scores` table (delivered by GAP-W13 / `20260305000007_wave14_scoring_tables.sql`) is the primary polling target for the watchdog to retrieve per-organisation and per-audit maturity scores.

| Column | Description | Watchdog Use |
|--------|-------------|-------------|
| `organisation_id` | Organisation scope | Filter for org-specific score retrieval |
| `audit_id` | Audit scope | Retrieve score per audit |
| `domain_id` | Domain scope | Per-domain score breakdown |
| `computed_score` | Aggregate maturity score | Primary monitoring metric |
| `scoring_rule_id` | FK to `scoring_rules` | Identifies scoring methodology applied |
| `computed_at` | Timestamp of last computation | Staleness check |

The watchdog can poll `aggregate_scores` directly via the Supabase API (subject to RLS) to detect stale scores (where `computed_at` is older than a configurable threshold) and trigger re-computation alerts.

---

## 5. Integration Interface Contract (Future)

The following interface contract defines what the `app_management_centre` module must implement to monitor MAT effectively. This contract is versioned at v1.0 and is subject to revision when the `app_management_centre` module is scaffolded.

```typescript
/**
 * MATWatchdogContract v1.0
 * Interface that app_management_centre implements to monitor the MAT module.
 */
interface MATWatchdogContract {
  /**
   * Performs a health check against the MAT API.
   * Returns the current health status of MAT subsystems.
   */
  healthCheck(): Promise<HealthStatus>;

  /**
   * Subscribes to a set of MAT lifecycle events.
   * Returns a stream of typed event payloads.
   *
   * @param events - Array of event names from the MAT event catalogue
   *                 (e.g., ['mat.audit.created', 'mat.report.generated'])
   */
  subscribeToEvents(events: string[]): EventStream;

  /**
   * Retrieves current audit lifecycle metrics for an organisation.
   *
   * @param organisation_id - UUID of the target organisation
   * @returns Metrics including submitted, outstanding, and excluded criteria counts
   */
  getAuditMetrics(organisation_id: UUID): Promise<AuditMetrics>;

  /**
   * Retrieves system-wide MAT metrics (not scoped to a single organisation).
   * Intended for platform-level observability.
   */
  getSystemMetrics(): Promise<SystemMetrics>;
}

/**
 * Supporting type definitions
 */

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'offline';
  timestamp: string; // ISO-8601
  checks: {
    auth: CheckResult;
    schema: CheckResult;
    workflow: CheckResult;
  };
}

interface CheckResult {
  status: 'healthy' | 'degraded' | 'offline';
  latency_ms?: number;
  detail?: string;
}

interface AuditMetrics {
  organisation_id: string;
  active_audits: number;
  submitted_criteria: number;   // criteria_evaluations.status IN ('confirmed','overridden')
  outstanding_criteria: number; // criteria with no evaluation or status='pending_review'
  excluded_criteria: number;    // criteria WHERE excluded=true
  latest_score: number | null;  // from aggregate_scores
  score_computed_at: string | null; // ISO-8601
}

interface SystemMetrics {
  total_active_audits: number;
  total_organisations: number;
  evaluations_last_24h: number;
  reports_generated_last_7d: number;
  schema_version: string; // e.g., '20260305000008'
}
```

---

## 6. Dependencies for Full Integration

The following dependencies must be satisfied before full watchdog integration can be activated:

| Dependency | Status | Notes |
|------------|--------|-------|
| **Running Supabase environment** | 🔵 NOT AVAILABLE IN CI | Required for health check endpoint calls and event emission; available in production deployment only. File-based CI tests cannot exercise these surfaces. |
| **Edge Function deployment** | 🔵 FUTURE | MAT event emission (`mat.audit.created`, `mat.report.generated`, etc.) requires Supabase Edge Functions to be deployed and configured for the live environment. |
| **`app_management_centre` module scaffold** | 🔵 FUTURE WAVE | The `app_management_centre` module has not yet been scaffolded. Integration requires that module to implement `MATWatchdogContract v1.0` (Section 5). |
| **`GET /api/health/mat` endpoint implementation** | 🔵 FUTURE | The health endpoint is defined in this document but not yet implemented. Implementation is a future wave task for api-builder under `app_management_centre` integration scope. |
| **Event subscription infrastructure** | 🔵 FUTURE | Supabase Realtime or a dedicated event bus must be configured in the live environment before watchdog event subscriptions can be activated. |

### Current Readiness Checklist

| Item | Ready? | Notes |
|------|--------|-------|
| Schema: all monitored tables exist | ✅ YES | 9 migrations delivered, all 13 new tables present |
| RLS: all tables org-isolated | ✅ YES | GAP-W15 closed; `20260305000008` migration applied |
| Score data available for polling | ✅ YES | `aggregate_scores` table ready |
| `data-testid` anchors for UI monitoring | ✅ YES | All key interactive elements tagged (Section 3 of Assurance Report) |
| Event catalogue defined | ✅ YES | Section 3 of this document |
| Integration interface contract defined | ✅ YES | Section 5 of this document |
| Health endpoint implemented | ⏳ FUTURE | Requires live deployment scope |
| Edge Functions deployed | ⏳ FUTURE | Requires production Supabase environment |
| `app_management_centre` module scaffolded | ⏳ FUTURE | Separate wave |

---

## 7. References

| Reference | Location |
|-----------|----------|
| Wave 14 Post-Implementation Assurance Report | `modules/mat/05-build-evidence/wave14-postimplementation-assurance-report.md` |
| GAP-W15 — RLS migration | `apps/maturion-maturity-legacy/supabase/migrations/20260305000008_wave14_new_tables_rls.sql` |
| GAP-W13 — Scoring tables migration | `apps/maturion-maturity-legacy/supabase/migrations/20260305000007_wave14_scoring_tables.sql` |
| T-W13-E2E-2, T-W13-E2E-3 (health check patterns) | `modules/mat/tests/wave13/` |
| Foreman v2 Agent Contract | `.github/agents/foreman-v2-agent.md` |
| IAA Pre-Brief (Batch C) | `.agent-admin/assurance/iaa-prebrief-wave14-batchC.md` |
| Wave 14 Issue | GitHub Issue #909 |

---

*This document was authored by mat-specialist under foreman-v2-agent supervision for Wave 14 Batch C. It is a documentation-only artifact classified EXEMPT by the IAA Pre-Brief (iaa-prebrief-wave14-batchC.md). It does not constitute executable code and contains no Supabase secrets or credentials.*
