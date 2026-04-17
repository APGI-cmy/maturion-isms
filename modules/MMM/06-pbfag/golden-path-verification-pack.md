# MMM — Golden Path Verification Pack

## Stage 7 — Pre-Build Gate Artifact (D4)

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Golden Path Verification Pack (Stage 7 PBFAG — D4)
- **Status**: COMPLETE
- **Version**: 0.1.0
- **Date**: 2026-04-15
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (delegated by foreman-v2-agent)
- **Issue**: maturion-isms#1387
- **Wave**: mmm-stage7-pbfag-20260415
- **Anti-Regression Obligations**: NBR-001 (TanStack Query mutation cache invalidation) and NBR-002 (Supabase RLS silent write block) embedded per IAA pre-brief §5

---

## 0. Purpose

This Golden Path Verification Pack defines the canonical end-to-end proving workflows
that Stage 12 (Build Execution) must demonstrate before the build wave may be closed.
It defines:

1. **Canonical Golden Paths** — the complete workflows that must succeed
2. **Minimum Success-Path Coverage** — what constitutes a passing demonstration
3. **Boundary-Path Proving Requirements** — edge cases and error paths that must be verified
4. **Minimum Verification Evidence** — what artefacts of proof must exist
5. **Anti-Regression Obligations** — NBR-001 and NBR-002 mandatory verification steps

All golden paths in this pack derive from and are traceable to the QA-to-Red catalog
(T-MMM-S6-001 through T-MMM-S6-176). Where a QA-to-Red test serves as the primary
vehicle for proving a golden path, the test ID is cited.

---

## 1. Canonical Golden Paths

### GP-001 — Unauthenticated Attraction, Free Assessment, and Subscription

**Canonical Workflow**: A new, unauthenticated user discovers MMM, completes a free
assessment, receives their baseline maturity score, and subscribes.

**Steps**:
1. Unauthenticated user navigates to MMM landing page (`/`)
2. Landing page renders fully; heading, maturity explanation, and "Start Free Assessment" CTA visible
3. User clicks "Start Free Assessment" → navigated to `/free-assessment` (no auth wall)
4. Free assessment collects domain-level maturity responses (no sign-up required)
5. System calculates `baseline_maturity` score; stores in `free_assessments` against `session_id`
6. Results screen displays: maturity level badge, level description paragraph, current vs next-level explanation
7. "Subscribe to continue" CTA is presented
8. User clicks CTA → navigated to subscription/sign-up flow (`/subscribe`)
9. Subscription created: `profiles` and `subscriptions` records exist; `profile_id` linked
10. `session_id` from free assessment linked to new `profiles.id` (`free_assessments.profile_id` non-null)
11. User redirected to organisation onboarding (`/onboarding`)
12. `organisations.baseline_maturity_locked = true`; subsequent modification of `baseline_maturity` returns HTTP 409

**QA-to-Red References**: T-MMM-S6-001, T-MMM-S6-003, T-MMM-S6-004, T-MMM-S6-005,
T-MMM-S6-006, T-MMM-S6-007, T-MMM-S6-008, T-MMM-S6-012, T-MMM-S6-013, T-MMM-S6-020

**Pass Criteria**: All 10 steps complete without error; no authentication wall before step 8;
`baseline_maturity` non-null in DB; subscription records created; `session_id` linkage confirmed.

**Fail Criteria**: Any step blocked by auth wall; `baseline_maturity` null; records missing;
`session_id` orphaned after sign-up.

---

### GP-002 — Organisation Onboarding → Mode A (Verbatim Upload) → Framework Published

**Canonical Workflow**: An authenticated subscriber completes organisation onboarding,
selects Mode A (verbatim upload), uploads a standards framework document, reviews
extracted criteria, and publishes the framework.

**Steps**:
1. Authenticated user navigates to `/onboarding`
2. Onboarding form presented; all mandatory field groups visible (name, industry, hierarchy, maturity intent, operating context)
3. Missing mandatory field → POST returns HTTP 422 with validation errors (gate enforced)
4. All fields completed → `organisations.onboarding_complete = true`
5. User navigated to framework-origin fork (`/framework/fork`)
6. Fork presents exactly two options: "Upload Existing Framework" (Mode A) and "Create New Framework" (Mode B)
7. User selects Mode A → navigated to `/frameworks/:id/upload`; `frameworks.origin_mode = 'verbatim_import'`
8. User uploads framework document (PDF or Word, ≤ 50 MB); upload routes through KUC pipeline
9. Upload begins processing within ≤ 3 s; metadata extraction completes within ≤ 30 s for ≤ 10 MB
10. Extracted `domains`, `mpss`, `criteria` records created in DB with `framework_id` FK; `origin_mode = 'verbatim_import'`
11. User navigates to framework review (`/frameworks/:id/review`); can edit extracted criteria
12. ADMIN user publishes framework (`/frameworks/:id/publish`); immutable snapshot created; `frameworks.status = 'published'`
13. `frameworks.published_at` timestamp set; version locked; subsequent modification of published criteria rejected

**QA-to-Red References**: T-MMM-S6-014, T-MMM-S6-015, T-MMM-S6-016, T-MMM-S6-017,
T-MMM-S6-018, T-MMM-S6-021 through T-MMM-S6-035

**Pass Criteria**: Organisation record created; onboarding gate enforced; Mode A pathway
navigates correctly; upload processes within SLA; extracted criteria in DB; framework
published with immutable snapshot.

**Fail Criteria**: Framework fork accessible without onboarding; upload bypasses KUC;
extraction fails silently; published framework remains mutable.

---

### GP-003 — Organisation Onboarding → Mode B (AI Generation) → Framework Published

**Canonical Workflow**: An authenticated subscriber selects Mode B (AI-assisted new
criteria creation), works with AI to define domains and criteria, reviews the generated
framework, and publishes.

**Steps**:
1. Authenticated, onboarded user at framework-origin fork selects "Create New Framework" (Mode B)
2. Navigated to `/frameworks/:id/generate`; `frameworks.origin_mode = 'ai_generated'`
3. AI generation interface loads; user provides organisational context to AI
4. MMM Edge Function calls AIMC with maturity context payload; AIMC returns domain/criteria proposals
5. AI proposals stored in `score_proposals` (not directly in `criteria`); user reviews proposals
6. User accepts, rejects, or modifies proposals; accepted proposals written to `domains`, `mpss`, `criteria`
7. Hybrid mode (OQ-009 RESOLVED): user may mix AI-generated and manually authored criteria
8. Framework review (`/frameworks/:id/review`); final criteria set confirmed
9. ADMIN publishes framework; immutable snapshot created
10. AIMC call telemetry visible in admin AI telemetry view

**QA-to-Red References**: T-MMM-S6-019, T-MMM-S6-036 through T-MMM-S6-050,
T-MMM-S6-121 through T-MMM-S6-128

**Pass Criteria**: Mode B navigation correct; AIMC called with correct payload (including
maturity context); proposals in `score_proposals`; human review gate enforced before
`criteria` write; hybrid criteria allowed; published snapshot immutable.

**Fail Criteria**: Direct provider calls from frontend; AI proposals written directly to
`criteria` without human review; AIMC calls missing `maturity_context`; AIMC circuit
not opening on repeated failures.

---

### GP-004 — Audit Workbench: Full Assessment Execution with Score Cascade

**Canonical Workflow**: An authenticated ASSESSOR initiates an audit session against a
published framework, walks all criteria, uploads evidence, AI evaluates evidence, human
confirms score, and scoring cascade completes.

**Steps**:
1. ASSESSOR navigates to audit workbench (`/audit/:sessionId`)
2. Audit session loads framework context (all criteria) within ≤ 2 s for frameworks ≤ 500 criteria
3. ASSESSOR responds to criteria one by one; responses captured with `criterion_id`, `response`, `timestamp`
4. ASSESSOR uploads evidence for a criterion; upload routes through KUC pipeline; `evidence_refs` created
5. ASSESSOR triggers AI evidence evaluation; Edge Function calls AIMC with evidence payload and maturity context
6. AIMC returns evaluation; MMM stores result in `score_proposals` (NOT directly in `maturity_scores`)
7. ASSESSOR reviews AI proposal; confirms or overrides score
8. On human confirmation: `maturity_scores` record created/updated for that criterion
9. Scoring cascade triggers: criterion score → MPS score → domain score → organisation maturity → dashboard
10. Full cascade (6-step) completes within ≤ 2 s from event receipt at Edge Function layer
11. Real-time update: `<ConnectivityBanner>` absent (online state); second browser session sees dashboard updated within ≤ 3 s

**QA-to-Red References**: T-MMM-S6-051 through T-MMM-S6-080, T-MMM-S6-094 through T-MMM-S6-097

**Pass Criteria**: Session loads within SLA; evidence upload routes through KUC; AI
proposals in `score_proposals`; human gate enforced before `maturity_scores` write;
cascade completes within 2 s; real-time update within 3 s.

**Fail Criteria**: AI score written directly to `maturity_scores` without human confirmation;
cascade timeout; real-time subscription not triggering; evidence upload bypasses KUC.

**Connectivity sub-path** (queue-and-sync):
- With `connectivityStore.isOffline = true`: evidence capture events queued in
  `auditQueueStore` / `localStorage` key `mmm_audit_queue`
- `<ConnectivityBanner>` visible with queue depth indicator
- On connectivity restore: all queued events POST to `/api/audit/sync-queue`; queue cleared
- No evidence event lost during connectivity interruption

---

### GP-005 — Assessment Complete → Findings Generated → Report Produced

**Canonical Workflow**: Assessment session complete; MMM generates findings and
recommendations; ASSESSOR reviews findings; report produced.

**Steps**:
1. Assessment flagged complete; findings generation triggered
2. MMM generates findings records (one shared findings model, FR-046)
3. Findings screen (`/assessments/:id/findings`) presents findings grouped by domain/severity
4. ASSESSOR reviews; findings are not modifiable at this screen (read-only view for ASSESSOR role)
5. ADMIN may annotate findings per role permissions
6. Report generation triggered (`/assessments/:id/report`)
7. Report produced in configured output format; download available
8. `report_jobs` record created with status tracking

**QA-to-Red References**: T-MMM-S6-081 through T-MMM-S6-093

**Pass Criteria**: Findings generated from assessment data; findings screen accessible;
report generated; download functional; role restrictions on findings editing enforced.

**Fail Criteria**: Findings screen blank; report generation fails; ASSESSOR can modify
findings they should not.

---

### GP-006 — Assessment Complete → PIT Export

**Canonical Workflow**: Assessment findings exported to PIT; export job tracked;
PIT receives and acknowledges.

**Steps**:
1. ASSESSOR/ADMIN navigates to export screen (`/assessments/:id/export`)
2. MMM Edge Function POSTs `mmm_export_payload` v1.0 to `PIT_BASE_URL/import` with Bearer `PIT_SERVICE_TOKEN`
3. Payload includes findings array with `finding_id`, `domain_id`, `severity`, `recommendation_text`, `evidence_refs`
4. `mmm_export_jobs` record created with status `submitted`
5. PIT returns acknowledgement; `mmm_export_jobs.status` updated to `confirmed`
6. Export failure scenario: PIT unavailable → `mmm_export_jobs.status = 'failed'`; error surfaced in UI
7. PIT export failure does NOT block findings screen or report generation

**QA-to-Red References**: T-MMM-S6-088, T-MMM-S6-089, T-MMM-S6-090, T-MMM-S6-109,
T-MMM-S6-110, T-MMM-S6-111

**Pass Criteria**: Export payload structure matches contract (v1.0); Bearer auth used;
export job tracked; PIT unavailability handled gracefully without blocking other flows.

**Fail Criteria**: Payload missing required fields; auth bypassed; export failure blocks
findings screen; no `mmm_export_jobs` tracking.

---

### GP-007 — Live Dashboard: Real-Time Scoring Cascade

**Canonical Workflow**: Two simultaneous users; one updates a criterion score; the other's
dashboard updates in real-time within SLA.

**Steps**:
1. User A has `LiveDashboard` (`/dashboard`) open with Supabase Realtime subscription active
2. User B (ASSESSOR) confirms a criterion score in audit workbench → `maturity_scores` updated
3. Scoring cascade triggers server-side (criterion → MPS → domain → org → dashboard)
4. Supabase Realtime event emitted on `maturity_scores` change
5. User A's `LiveDashboard` receives event via TanStack Query `invalidateQueries` or Supabase RT subscription
6. Dashboard re-renders with updated domain/organisation scores within ≤ 3 s of event commit
7. Dashboard renders fully populated organisation maturity view within ≤ 1.5 s (cached) / ≤ 3 s (cache miss)

**QA-to-Red References**: T-MMM-S6-094 through T-MMM-S6-097, T-MMM-S6-130, T-MMM-S6-132

**Pass Criteria**: Real-time update visible in ≤ 3 s; no manual refresh required; cache
performance within SLA.

**Fail Criteria**: Dashboard not updating without refresh; update exceeds 3 s; stale data
persisted in TanStack Query cache after mutation without invalidation.

---

### GP-008 — Role Boundary Paths (ADMIN, ASSESSOR, VIEWER)

**Canonical Workflow**: All three role types (ADMIN, ASSESSOR, VIEWER) are verified to
access their permitted actions and be blocked from unpermitted actions.

**Steps (ADMIN)**:
1. ADMIN accesses `/settings/team`; can invite/remove users and change roles
2. ADMIN accesses `/frameworks/:id/publish`; can publish frameworks
3. ADMIN accesses `/admin/ai-chat` and `/admin/ai-telemetry`; admin-only routes accessible
4. ADMIN can annotate findings

**Steps (ASSESSOR)**:
1. ASSESSOR accesses `/audit/:sessionId`; can capture responses and upload evidence
2. ASSESSOR CANNOT access `/settings/team` → HTTP 403 or redirect
3. ASSESSOR CANNOT access `/admin/*` routes → HTTP 403 or redirect
4. ASSESSOR CANNOT publish frameworks → publish action absent or blocked

**Steps (VIEWER)**:
1. VIEWER accesses `/dashboard`; read-only view
2. VIEWER accesses `/assessments/:id/findings`; read-only view
3. VIEWER CANNOT initiate audit sessions → HTTP 403 or redirect
4. VIEWER CANNOT access `/settings/team`, `/admin/*` → HTTP 403 or redirect

**QA-to-Red References**: T-MMM-S6-113 through T-MMM-S6-120

**Pass Criteria**: All permitted actions succeed; all forbidden actions blocked with correct
HTTP status; role restrictions enforced at both frontend route guard AND API/Edge Function
middleware levels.

**Fail Criteria**: Any role bypass discovered; admin routes accessible to non-ADMIN;
audit write actions accessible to VIEWER; restrictions enforced only at frontend (not API).

---

### GP-009 — ⚠️ NBR-001: TanStack Query Mutation Cache Invalidation

> **Anti-Regression Obligation — NBR-001 (from IAA pre-brief §5)**
> This golden path is MANDATORY and addresses the known regression pattern
> where TanStack Query mutations do not trigger `invalidateQueries`, causing
> stale data to remain in the cache after a write operation.

**Canonical Workflow**: For every MMM mutation operation, verify that the mutation
triggers the correct TanStack Query `invalidateQueries` call, ensuring the cache
is updated and the UI reflects the post-mutation state.

**Minimum Coverage — Mutation Categories to Verify**:

| Mutation | Query Key(s) to Invalidate | Verify Method |
|----------|--------------------------|--------------|
| Criterion score confirmed (`maturity_scores` insert/update) | `['maturity-scores', orgId]`, `['dashboard', orgId]` | Integration test: confirm re-fetch triggered post-mutation |
| Evidence uploaded and attached to criterion | `['evidence', criterionId]`, `['audit-session', sessionId]` | Integration test: confirm stale evidence list not shown post-upload |
| Framework criteria modified during review | `['framework', frameworkId]`, `['criteria', frameworkId]` | Integration test: confirm criteria list refreshes post-edit |
| Framework published | `['frameworks', orgId]`, `['framework', frameworkId]` | Integration test: confirm published status reflected immediately |
| Team member role changed | `['team', orgId]` | Integration test: confirm role badge updates without refresh |
| Findings generated | `['findings', assessmentId]` | Integration test: confirm findings appear without manual refresh |
| PIT export submitted | `['export-jobs', assessmentId]` | Integration test: confirm export status updates in UI |
| Organisation onboarding completed | `['org', orgId]`, `['onboarding-state']` | Integration test: confirm fork screen accessible post-mutation |

**Step-by-Step Verification Protocol (per mutation)**:
1. Intercept the mutation call; confirm it completes successfully (HTTP 200/201/204)
2. Confirm that `queryClient.invalidateQueries()` is called with the correct query key(s) in the `onSuccess` callback
3. Confirm that TanStack Query issues a re-fetch for the invalidated query key(s)
4. Confirm that the UI reflects the post-mutation state without requiring a manual page refresh
5. If using optimistic updates: confirm that rollback occurs correctly on mutation failure

**QA-to-Red Reference**: All mutation-bearing tests in D1–D7; cross-cutting in D10
(T-MMM-S6-153–164)

**Pass Criteria**: All 8 mutation categories verified; `invalidateQueries` confirmed in
code review and integration test execution; no stale cache states reproduced.

**Fail Criteria**: Any mutation that does not invalidate its corresponding query key;
any UI that requires manual refresh to reflect a write operation; any optimistic update
that does not roll back on failure.

**Builder Instruction**: Every new mutation hook introduced in Stage 12 must include
an explicit `onSuccess` callback that calls `queryClient.invalidateQueries()` with the
correct key(s). This is NOT optional. Code review must fail any mutation hook that
lacks this invalidation.

---

### GP-010 — ⚠️ NBR-002: Supabase RLS Silent Write Block Detection

> **Anti-Regression Obligation — NBR-002 (from IAA pre-brief §5)**
> This golden path is MANDATORY and addresses the known regression pattern
> where Supabase RLS policies silently block write operations (INSERT/UPDATE/DELETE)
> without returning an error to the application, causing silent data loss and phantom
> success confirmations in the UI.

**Canonical Workflow**: For every write operation in MMM (INSERT, UPDATE, DELETE), verify
that the application detects and surfaces an RLS-induced write block rather than silently
treating it as a success.

**Minimum Coverage — Write Operations to Verify RLS Blocks**:

| Write Operation | Table | RLS Block Scenario | Expected Behaviour |
|----------------|-------|-------------------|-------------------|
| Create criterion score | `maturity_scores` | VIEWER role attempts write | API returns error; UI surfaces error; no phantom success |
| Create evidence record | `evidence` | Cross-org write attempt | RLS blocks; application detects empty result; error surfaced |
| Publish framework | `frameworks` | ASSESSOR role attempts publish | RLS blocks UPDATE; error surfaced; published status NOT shown |
| Insert domain/criteria | `domains`, `criteria` | Attempt with mismatched `organisation_id` | RLS blocks; error surfaced |
| Insert `mmm_export_jobs` | `mmm_export_jobs` | VIEWER role attempts export | RLS blocks; export NOT shown as submitted |
| Update `organisations` | `organisations` | Non-ADMIN attempts field update | RLS blocks UPDATE; error surfaced; no phantom success |
| Insert findings | `findings` | VIEWER attempts finding creation | RLS blocks; error surfaced |
| Insert audit session | `audit_sessions` | VIEWER attempts session creation | RLS blocks; error surfaced |

**Step-by-Step Verification Protocol (per write operation)**:
1. Confirm that the Supabase client call for the write operation **checks the row count** returned by Supabase (not just absence of `error`). A silent RLS block returns `data: []` with `error: null` — this is the regression pattern.
2. Confirm that the application code throws/handles the case where Supabase returns `data: []` on an expected INSERT or UPDATE.
3. For each table, run an integration test that attempts a write from a role/context that RLS should block.
4. Confirm that the blocked write is surfaced to the user as an error (toast, inline message, or navigation to error state).
5. Confirm that no "success" UI state (e.g. "Published", "Saved", "Exported") is shown when the write was silently blocked.

**QA-to-Red Reference**: T-MMM-S6-139 through T-MMM-S6-152 (D9 Security tests); specific
RLS tests within boundary domain tests

**Pass Criteria**: All 8 write operations verified; Supabase row count check confirmed
in code review; RLS blocks surfaced as errors in integration tests; no phantom success states.

**Fail Criteria**: Any write operation that treats `data: []` with `error: null` as success;
any phantom "Published", "Saved", or "Exported" state after a silent RLS block.

**Builder Instruction**: All Supabase write calls must use the following pattern:
```typescript
const { data, error } = await supabase.from('table').insert(payload).select();
if (error) throw error;
if (!data || data.length === 0) throw new Error('RLS_WRITE_BLOCKED: no rows written');
```
Code review must fail any write call that does not check the returned row count.

---

## 2. Minimum Success-Path Coverage

For the Stage 12 build wave to be closed, the following minimum success-path coverage
must be demonstrated:

| Golden Path | Minimum Evidence Required |
|-------------|--------------------------|
| GP-001 | E2E test PASSING: full flow from landing page through subscription completion; DB records confirmed |
| GP-002 | E2E test PASSING: onboarding → Mode A upload → framework published; DB state confirmed |
| GP-003 | E2E test PASSING: Mode B AI generation → human review → framework published; AIMC mock confirmed |
| GP-004 | E2E test PASSING: audit session → evidence upload → AI eval → human score confirmation → cascade; timing evidence |
| GP-005 | Integration test PASSING: findings generated; report download functional |
| GP-006 | Integration test PASSING: PIT export payload matches contract; export job tracked; failure handled |
| GP-007 | Integration test PASSING: two-session real-time update within 3 s; dashboard render within SLA |
| GP-008 | Integration tests PASSING: all three roles; blocked actions return correct status |
| GP-009 (NBR-001) | Code review confirmation + integration test per mutation category (8 categories); `invalidateQueries` calls present |
| GP-010 (NBR-002) | Code review confirmation + integration test per write operation (8 operations); row count check present |

---

## 3. Boundary-Path Proving Requirements

Beyond the canonical success paths, the following boundary conditions must be verified:

| Boundary Path | Scenario | Required Proof |
|--------------|---------|---------------|
| BP-001 | AIMC unavailable (circuit breaker) | 5 consecutive AIMC failures → circuit opens → fallback UI shown; no unhandled exception |
| BP-002 | PIT endpoint unavailable | PIT export fails → `export_jobs.status = 'failed'` → error surfaced → findings/report NOT blocked |
| BP-003 | File upload exceeds 50 MB | Upload rejected at boundary with clear error message; no partial upload committed |
| BP-004 | Audit workbench: connectivity lost mid-session | Evidence captured → queued in `localStorage`; `<ConnectivityBanner>` visible; sync on reconnect |
| BP-005 | Concurrent score update race condition | Two ASSESSORs update same criterion simultaneously → last-write-wins OR optimistic locking error surfaced (not silent data corruption) |
| BP-006 | Framework configuration gated before baseline established | `/framework/fork` accessible only when `baseline_maturity_locked = true`; redirect to free assessment if not |
| BP-007 | Published framework immutability | Any attempt to modify criteria of a published framework → HTTP 409; no modification persisted |
| BP-008 | Cross-organisation data access attempt | User from Org A cannot read or write any data from Org B; RLS enforced |
| BP-009 | ASSESSOR attempts ADMIN-only route | `/admin/*` → HTTP 403; no data leakage |
| BP-010 | Session expiry mid-audit | Expired JWT → graceful redirect to login; no data loss from queued events |

---

## 4. Minimum Verification Evidence Required

The following evidence artefacts must exist when Stage 12 is submitted for IAA sign-off:

| Evidence Type | Description | Format |
|--------------|-------------|--------|
| E1 | Vitest unit test results | CI log output confirming ≥ 80% coverage on business logic; all tests PASS |
| E2 | Playwright E2E test results | CI log output; all GP-001–GP-008 E2E tests PASS |
| E3 | NBR-001 mutation audit | Code review checklist confirming `invalidateQueries` present for all 8 mutation categories; integration test results |
| E4 | NBR-002 RLS write-block audit | Code review checklist confirming row count check in all 8 write operations; integration test results |
| E5 | Boundary-path test results | Integration/E2E test results for BP-001 through BP-010 |
| E6 | Performance evidence | k6 load test report confirming TR-002 p95 SLAs; Lighthouse CI results confirming TR-001 TTI |
| E7 | Security scan | SAST scan results: zero HIGH or CRITICAL findings |
| E8 | TypeScript/ESLint clean | `tsc --strict --noEmit` zero warnings; `eslint --max-warnings 0` zero warnings |
| E9 | Deployment confirmation | Staging deployment URL accessible; health endpoint responding within TR-010 SLA |
| E10 | WCAG audit | Accessibility audit results: WCAG 2.1 AA pass on all interactive components |

---

## 5. QA-to-Red Test Mapping Summary

| Golden Path | Primary QA-to-Red Tests |
|-------------|------------------------|
| GP-001 | T-MMM-S6-001–008, T-MMM-S6-012–013, T-MMM-S6-020 |
| GP-002 | T-MMM-S6-014–019, T-MMM-S6-021–035 |
| GP-003 | T-MMM-S6-019, T-MMM-S6-036–050, T-MMM-S6-121–128 |
| GP-004 | T-MMM-S6-051–080, T-MMM-S6-094–097 |
| GP-005 | T-MMM-S6-081–093 |
| GP-006 | T-MMM-S6-088–090, T-MMM-S6-109–111 |
| GP-007 | T-MMM-S6-094–097, T-MMM-S6-130, T-MMM-S6-132 |
| GP-008 | T-MMM-S6-113–120 |
| GP-009 (NBR-001) | Cross-cutting; all mutation-bearing tests in D1–D7, D10 |
| GP-010 (NBR-002) | T-MMM-S6-139–152 (D9); boundary tests in D5 |

---

*End of MMM Stage 7 — Golden Path Verification Pack*

**Produced by**: mat-specialist | **Wave**: mmm-stage7-pbfag-20260415 | **Date**: 2026-04-15
