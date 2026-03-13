# IAA Pre-Brief — Wave 13: Live Deployment Wiring Regression Fix & Continuous Improvement

**Pre-Brief ID**: `iaa-prebrief-wave13-live-deployment-fix`
**Date**: 2026-03-12
**Wave**: 13 — Live Deployment Wiring Regression Fix & Continuous Improvement
**Branch**: `copilot/mat-wave-13-live-deployment-fix`
**IAA Session**: `session-wave13-prebrief-20260312`
**Triggering Request**: IAA PRE-BRIEF REQUEST — Wave 13 Execution Start
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy), assigns foreman-v2-agent — valid per foreman contract §2.1
**Implementation Plan Reference**: `modules/mat/03-implementation-plan/implementation-plan.md §2.14`
**RCA Reference**: `modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` (MAT-RCA-002)
**IAA Adoption Phase**: PHASE_B_BLOCKING — all verdicts are hard-blocking

---

## Phase 0 Pre-Brief — Execution Record

**Invocation mode**: PRE-BRIEF (Phase 0 only)
**Action taken**: Generate Pre-Brief artifact — DO NOT execute Phases 1–4 assurance
**Post-brief**: IAA enters STANDBY — awaiting each sub-task handover invocation

---

## Step 0.2 — Wave Tasks Extracted from wave-current-tasks.md

**Status at pre-brief time**: `wave-current-tasks.md` is currently populated with `wave-status-sweep-20260312` — the prior completed wave. It is NOT yet updated to Wave 13.

**⚠️ PRE-BRIEF BLOCKER — FOREMAN ACTION REQUIRED**: `wave-current-tasks.md` MUST be updated to declare Wave 13 task register BEFORE the first builder task is committed. This is a mandatory governance step (FAIL-ONLY-ONCE A-021, A-026 — committed files must match declared state before IAA invocation).

Wave 13 tasks extracted from **implementation-plan.md §2.14** (authoritative source until wave-current-tasks.md is updated):

| # | Task ID | Description | Builder | Test IDs | Dependency |
|---|---------|-------------|---------|----------|------------|
| 1 | T-W13-13.1 | Schema Migration Verification & CI Schema Gate | schema-builder | T-W13-SCH-1–4, T-W13-CI-1–2 | Entry criteria only |
| 2 | T-W13-13.2 | Authentication Session Wiring Fix | api-builder | T-W13-AUTH-1–4 | 13.1 COMPLETE |
| 3 | T-W13-13.3 | Frontend UI Wiring Fix (All Major Pages) | ui-builder | T-W13-WIRE-1–8 | 13.2 COMPLETE |
| 4 | T-W13-13.4 | Full E2E Wiring Verification CWT | integration-builder + qa-builder | T-W13-E2E-1–5 | 13.3 COMPLETE |
| 5 | T-W13-13.5 | CI E2E Auth Smoke Test Gate | integration-builder | T-W13-CI-3 | 13.4 COMPLETE |

**Execution Start session delivers (per CS2 issue scope)**:
1. `wave-current-tasks.md` updated to Wave 13 task register (foreman-v2-agent)
2. qa-builder RED tests (all 24 test IDs: T-W13-SCH-1–4, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5, T-W13-CI-1–3)
3. schema-builder Task 13.1 implementation (CI schema gate + env var audit)

---

## Step 0.3 — Qualifying Task Classification

Applying trigger table `iaa-trigger-table.md` v2.1.0 to all Wave 13 tasks:

| Task | Trigger Categories | IAA Required? | Rationale |
|------|--------------------|---------------|-----------|
| **Execution Start** (wave-current-tasks.md + RED tests + Task 13.1) | `AAWP_MAT` + `CI_WORKFLOW` = `MIXED` | **YES — MANDATORY** | MAT deliverables (RED test suite, schema migrations) + CI workflow changes (schema gate job added to pipeline) |
| **Task 13.1** | `AAWP_MAT` + `CI_WORKFLOW` = `MIXED` | **YES — MANDATORY** | Schema migration files (`supabase/migrations/**`) + CI pipeline modifications (T-W13-CI-1–2) |
| **Task 13.2** | `AAWP_MAT` | **YES — MANDATORY** | MAT API layer changes (auth session wiring); modules/mat path pattern |
| **Task 13.3** | `AAWP_MAT` | **YES — MANDATORY** | MAT frontend changes (UI wiring, all major pages); modules/mat path pattern |
| **Task 13.4** | `AAWP_MAT` | **YES — MANDATORY** | CWT — full E2E wiring verification against live deployment |
| **Task 13.5** | `AAWP_MAT` + `CI_WORKFLOW` = `MIXED` | **YES — MANDATORY** | CI E2E auth smoke test gate (T-W13-CI-3) added to deploy pipeline |

**Declared active trigger categories for Wave 13**: `AAWP_MAT`, `CI_WORKFLOW`, `MIXED`

No task is EXEMPT. All 5 sub-tasks and the Execution Start session require IAA invocation.

**PBFAG Status Check**: Per implementation plan §1.5, PBFAG must be recorded before builders are appointed. The Execution Start session must deliver `modules/mat/05-build-evidence/PBFAG-mat-YYYYMMDD.md` OR reference a prior PBFAG covering Wave 13 scope. IAA will check this at first handover.

---

## Step 0.4 — Pre-Brief: Per-Task Artifact Declarations

---

### TASK: Execution Start (wave-current-tasks.md + RED tests + Task 13.1)

```yaml
task_id: "W13-EXEC-START"
task_summary: >
  Wave start governance setup + qa-builder RED test suite (24 tests) + schema-builder
  Task 13.1 implementation (schema existence CI gate + env var audit CI gate).
  Delivered in a single Execution Start session per CS2 issue scope.
iaa_trigger_category: MIXED (AAWP_MAT + CI_WORKFLOW)
required_phases: [Phase 2 Alignment, Phase 3 Assurance, Phase 4 Verdict]
required_evidence_artifacts:
  - wave-current-tasks.md updated to Wave 13 register (committed to branch)
  - qa-builder RED test files (all 24 test IDs present, confirmed RED/failing)
  - schema-builder Task 13.1 delivered artifacts (migration SQL, CI schema check job)
  - SCOPE_DECLARATION.md matching git diff --name-only origin/main...HEAD exactly (A-026)
  - PREHANDOVER proof with iaa_audit_token pre-populated as reference (A-029)
  - Session memory file committed to branch
  - CI run URL demonstrating committed state (A-021)
  - PBFAG-mat-YYYYMMDD.md at modules/mat/05-build-evidence/ OR prior PBFAG reference
  - IAA Pre-Brief artifact reference (this file) cited in PREHANDOVER proof
applicable_overlays:
  - BUILD_DELIVERABLE (BD-001 through BD-024)
  - CI_WORKFLOW (OVL-CI-001 through OVL-CI-005 for CI gate changes)
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001 — this pre-brief artifact must be present)
specific_rules:
  - A-021: CI run URL required — committed and pushed before IAA invocation
  - A-026: SCOPE_DECLARATION.md must match diff exactly
  - A-032: Schema Column Compliance — IAA must read migration DDL directly for T-W13-SCH-1–4
  - CORE-023: Workflow Integrity Ripple — ACTIVE (CI workflow file changes + schema migration files)
  - BD-011: All 24 RED test IDs must be confirmed RED/failing at handover (not yet GREEN — GREEN comes later)
  - BD-012: Zero test debt — no .skip(), .only(), or commented-out tests permitted
  - OVL-AM-CWT-01: CWT wave-level mandate noted — T-W13-E2E-1–5 IS the CWT; will be verified at Task 13.4 handover
notes:
  - "RED tests submitted as RED is correct at this stage — IAA will verify they are genuinely failing, not vacuous passes"
  - "schema-builder Task 13.1 CI changes: IAA will verify CI workflow syntax valid and schema check job correctly positioned before CWT"
```

---

### TASK 13.1 — Schema Migration Verification & CI Schema Gate

```yaml
task_id: "T-W13-13.1"
task_summary: >
  schema-builder delivers: schema existence verification for all 6 required tables
  (audits, criteria, mps, domains, evidence, user_profiles), env var audit for all
  required Supabase/Vercel env vars, and CI gates T-W13-CI-1 and T-W13-CI-2 added
  to deploy pipeline.
iaa_trigger_category: MIXED (AAWP_MAT + CI_WORKFLOW)
required_phases: [Phase 2 Alignment, Phase 3 Assurance, Phase 4 Verdict]
required_evidence_artifacts:
  - Schema migration files (supabase/migrations/) confirming required tables
  - CI deploy workflow modified to include schema check job (T-W13-CI-1) and env var audit job (T-W13-CI-2)
  - Test run evidence: T-W13-SCH-1, T-W13-SCH-2, T-W13-SCH-3, T-W13-SCH-4 GREEN
  - Test run evidence: T-W13-CI-1, T-W13-CI-2 GREEN
  - 559+ baseline regression tests still GREEN
  - SCOPE_DECLARATION.md matching diff (A-026)
  - PREHANDOVER proof with iaa_audit_token pre-populated (A-029)
  - Session memory file
  - CI run URL (A-021)
applicable_overlays:
  - BUILD_DELIVERABLE (BD-001 through BD-024)
  - CI_WORKFLOW (OVL-CI-001 through OVL-CI-005)
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
specific_rules:
  - A-032: Schema Column Compliance — IAA MUST read migration DDL directly and cross-check every column
  - CORE-023: Workflow Integrity Ripple — ACTIVE (CI workflow modified + migration files changed)
  - BD-005: E2E wiring — schema tables must be shown to have both writers and readers wired (BD-006)
  - BD-015: RLS policies — each new/verified table must have complete RLS (SELECT/INSERT/UPDATE/DELETE per role)
  - OVL-CI-001 through OVL-CI-004: CI workflow structure, job dependencies, gate positioning verified
notes:
  - "T-W13-SCH-4 (env var audit) requires Vercel production deployment evidence — not just local assertion"
  - "CI schema check job must run BEFORE CWT job in pipeline order — IAA will verify job dependency chain"
```

---

### TASK 13.2 — Authentication Session Wiring Fix

```yaml
task_id: "T-W13-13.2"
task_summary: >
  api-builder fixes auth session wiring: real Supabase login establishes valid session,
  session token forwarded to audit create and profile update API calls, RLS permits
  INSERT/SELECT for authenticated users.
iaa_trigger_category: AAWP_MAT
required_phases: [Phase 2 Alignment, Phase 3 Assurance, Phase 4 Verdict]
required_evidence_artifacts:
  - API/auth layer changes (modules/mat/ path)
  - Test run evidence: T-W13-AUTH-1, T-W13-AUTH-2, T-W13-AUTH-3, T-W13-AUTH-4 GREEN
  - T-W13-SCH-1–4 and T-W13-CI-1–2 still GREEN (regression check)
  - 559+ baseline regression tests still GREEN
  - SCOPE_DECLARATION.md matching diff (A-026)
  - PREHANDOVER proof with iaa_audit_token pre-populated (A-029)
  - Session memory file
  - CI run URL (A-021)
applicable_overlays:
  - BUILD_DELIVERABLE (BD-001 through BD-024)
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
specific_rules:
  - BD-007: Auth guards applied end-to-end — every protected route must have auth verification
  - BD-005: E2E wiring — session token forwarding path must be traceable in code (not mocked)
  - BD-013: No test dodging — auth tests must assert on real session, not pre-injected token
  - PBFAG check 9: E2E auth wiring check — real login against live deployment (not mocked)
  - CORE-023: Assess if any workflow paths reference affected auth files
notes:
  - "Tests that mock auth or use pre-injected tokens do NOT satisfy T-W13-AUTH-1 per PBFAG check 9"
  - "IAA will verify the auth session is a real Supabase session, not a stubbed bearer token"
```

---

### TASK 13.3 — Frontend UI Wiring Fix

```yaml
task_id: "T-W13-13.3"
task_summary: >
  ui-builder fixes all 8 major page wiring failures: audit create→list, criteria
  upload enabling, hierarchy display, evidence modal with live data, evidence count
  updates, scoring/reports/dashboard non-empty rendering.
iaa_trigger_category: AAWP_MAT
required_phases: [Phase 2 Alignment, Phase 3 Assurance, Phase 4 Verdict]
required_evidence_artifacts:
  - Frontend component changes (modules/mat/frontend/ path)
  - Test run evidence: T-W13-WIRE-1 through T-W13-WIRE-8 GREEN
  - All prior task tests (T-W13-SCH-1–4, T-W13-CI-1–2, T-W13-AUTH-1–4) still GREEN
  - 559+ baseline regression tests still GREEN
  - SCOPE_DECLARATION.md matching diff (A-026)
  - PREHANDOVER proof with iaa_audit_token pre-populated (A-029)
  - Session memory file
  - CI run URL (A-021)
applicable_overlays:
  - BUILD_DELIVERABLE (BD-001 through BD-024)
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
specific_rules:
  - BD-003: One-time build compliance — every page must render non-empty content after real login (PBFAG check 12)
  - BD-005: E2E wiring — frontend→API→DB chain must be traceable for each of the 8 wiring tests
  - BD-010: No orphaned deliverables — all new/modified components must be consumed by pages
  - CORE-023: Workflow Integrity Ripple — assess if frontend source changes affect build workflow paths
  - PBFAG check 11: E2E full-flow wiring — real API calls, not mocked responses
notes:
  - "T-W13-WIRE-4 (evidence modal with live data) — IAA will verify the modal fetches live context, not static/mock data"
  - "T-W13-WIRE-6/7/8 (scoring/reports/dashboard) — must demonstrate non-empty content, not placeholder"
```

---

### TASK 13.4 — Full E2E Wiring Verification CWT

```yaml
task_id: "T-W13-13.4"
task_summary: >
  integration-builder + qa-builder execute CWT: full audit lifecycle E2E, settings
  profile update, settings dropdowns persistence, AIMC/AI chat access check, Vercel
  health check. All 5 E2E tests run against live deployment URL.
iaa_trigger_category: AAWP_MAT
required_phases: [Phase 2 Alignment, Phase 3 Assurance, Phase 4 Verdict]
required_evidence_artifacts:
  - CWT execution evidence: T-W13-E2E-1 through T-W13-E2E-5 GREEN against live Vercel URL
  - All prior task tests (T-W13-SCH-1–4, T-W13-CI-1–2, T-W13-AUTH-1–4, T-W13-WIRE-1–8) still GREEN
  - 559+ baseline regression tests still GREEN
  - CWT scope declaration (waves covered, modules covered, scenarios covered) — OVL-AM-CWT-01
  - SCOPE_DECLARATION.md matching diff (A-026)
  - PREHANDOVER proof with iaa_audit_token pre-populated (A-029)
  - Session memory file
  - CI run URL (A-021)
applicable_overlays:
  - BUILD_DELIVERABLE (BD-001 through BD-024)
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
specific_rules:
  - OVL-AM-CWT-01: CWT PASS verdict is MANDATORY — absence = REJECTION-PACKAGE (no exceptions)
  - T-W13-E2E-1 must use real HTTP requests to live Vercel URL (not localhost, not mocks)
  - T-W13-E2E-5 (Vercel health check) must demonstrate all required env vars present + migrations applied
  - BD-011: 100% test pass rate across all 20 accumulated W13 tests at this stage
  - PBFAG check 9, 11, 12: All E2E auth wiring, full-flow wiring, and major page content checks must be satisfied by CWT results
notes:
  - "This task IS the CWT for Wave 13 — OVL-AM-CWT-01 is self-satisfying here but must be formally documented in PREHANDOVER proof"
  - "T-W13-E2E-4 (AIMC/AI chat): 'graceful coming soon' is acceptable if gated — IAA will verify the message is meaningful, not an error state"
```

---

### TASK 13.5 — CI E2E Auth Smoke Test Gate

```yaml
task_id: "T-W13-13.5"
task_summary: >
  integration-builder adds CI E2E auth smoke test gate (T-W13-CI-3) as final job in
  deploy pipeline. All 24 Wave 13 tests GREEN. All 559+ baseline tests GREEN.
  Wave 13 COMPLETE.
iaa_trigger_category: MIXED (AAWP_MAT + CI_WORKFLOW)
required_phases: [Phase 2 Alignment, Phase 3 Assurance, Phase 4 Verdict]
required_evidence_artifacts:
  - CI deploy workflow modified to include T-W13-CI-3 as final gate job
  - Test run evidence: T-W13-CI-3 GREEN
  - ALL 24 Wave 13 tests GREEN (T-W13-SCH-1–4, T-W13-CI-1–3, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5)
  - 559+ baseline regression tests still GREEN
  - IBWR (In-Build Wave Reconciliation) artifact or equivalent wave closure document
  - CWT PASS evidence present in IBWR (T-W13-E2E-1–5 already complete from Task 13.4)
  - SCOPE_DECLARATION.md matching diff (A-026)
  - PREHANDOVER proof with iaa_audit_token pre-populated (A-029)
  - Session memory file
  - CI run URL (A-021)
applicable_overlays:
  - BUILD_DELIVERABLE (BD-001 through BD-024)
  - CI_WORKFLOW (OVL-CI-001 through OVL-CI-005)
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
specific_rules:
  - CORE-023: Workflow Integrity Ripple — ACTIVE (CI workflow changes for T-W13-CI-3 gate job)
  - OVL-CI-001 through OVL-CI-004: CI workflow structure, auth smoke test job positioning verified
  - OVL-AM-CWT-01: CWT PASS must be present in IBWR (carried forward from Task 13.4)
  - A-029b: Carry-Forward Mandate — all 24 W13 tests GREEN must be explicitly evidenced; no "assume GREEN from prior sessions"
  - Wave 13 COMPLETE declaration: ALL acceptance criteria from implementation-plan.md §2.14 must be checked off
notes:
  - "T-W13-CI-3 must be the FINAL job in the deploy pipeline — IAA will verify job dependency chain"
  - "Wave 13 is not COMPLETE until all 24 tests are GREEN AND this CI gate is confirmed running in production pipeline"
```

---

## Step 0.3 — Declared Active Trigger Categories: Summary

| Category | Applies To | IAA Hard-Gate? |
|----------|------------|----------------|
| `AAWP_MAT` | All 5 sub-tasks + Execution Start | **YES — MANDATORY (PHASE_B_BLOCKING)** |
| `CI_WORKFLOW` | Execution Start, Task 13.1, Task 13.5 | **YES — MANDATORY (PHASE_B_BLOCKING)** |
| `MIXED` | Execution Start, Task 13.1, Task 13.5 (both AAWP_MAT + CI_WORKFLOW) | **YES — AMBIGUITY RULE: most restrictive applies** |

No task qualifies as EXEMPT.

---

## Step 0.3 — FFA Checks Declared (at Handover for Each Sub-Task)

The following checks will be run by IAA at every sub-task handover. This is the declared FFA (Functional Fitness Assessment) check list for Wave 13:

### Core Invariants (applied to every handover) — CORE-001 to CORE-023

| Check | Wave 13 Applicability | Priority |
|-------|-----------------------|----------|
| CORE-001 to CORE-012 | N/A — no agent contract changes in Wave 13 scope | SKIP (record N/A) |
| CORE-013 | IAA invocation evidence in PR artifacts | MANDATORY |
| CORE-014 | No class exemption claim | MANDATORY |
| CORE-015 | Session memory present | MANDATORY |
| CORE-016 | Dedicated IAA token file exists (§4.3b) | MANDATORY |
| CORE-017 | No unauthorised .github/agents/ modifications | MANDATORY |
| CORE-018 | Complete evidence artifact sweep (PREHANDOVER + session memory + iaa_audit_token + token file) | MANDATORY |
| CORE-019 | IAA token cross-verification | MANDATORY |
| CORE-020 | Zero partial pass rule | MANDATORY |
| CORE-021 | Zero-severity-tolerance | MANDATORY |
| CORE-022 | N/A — no agent contract changes | SKIP (record N/A) |
| CORE-023 | Workflow integrity ripple check — **ACTIVE** for Execution Start, Task 13.1, Task 13.5; assess for 13.2–13.4 | MANDATORY |

### BUILD_DELIVERABLE Overlay (BD-001 to BD-024) — All Tasks

| Check | Specific Wave 13 Focus |
|-------|------------------------|
| BD-001 | All 24 test IDs implemented and present in diff |
| BD-002 | No stub/TODO in schema migrations, auth fixes, CI jobs |
| BD-003 | One-time build: auth+schema+UI all wired — no immediate follow-on patch needed |
| BD-004 | No leftover debt from Wave 12 failures visible in touched files |
| BD-005 | Full chain: frontend→API→Supabase→DB traceable for each failing gap |
| BD-006 | Schema tables: writers (INSERT) and readers (SELECT) both present |
| BD-007 | Auth guards on all protected routes and API calls |
| BD-008 | FK relationships in migrations have application-layer handling |
| BD-009 | Cross-component fit: Task 13.2 auth fix must not break 13.1 schema expectations |
| BD-010 | No orphaned components, migrations, or CI jobs |
| BD-011 | 100% test pass rate — all 24 W13 tests GREEN at wave completion |
| BD-012 | Zero test debt — no .skip(), .only(), test.todo() |
| BD-013 | No test dodging — auth tests must assert real session, not vacuous pass |
| BD-014 | No deprecated API usage introduced |
| BD-015 | RLS policies complete for all schema tables (all roles: SELECT/INSERT/UPDATE/DELETE) |
| BD-016 | No hardcoded secrets, API keys, or env vars in committed code |
| BD-017 | Input validation present on user-controlled inputs |
| BD-018 | No SQL injection, XSS, or command injection vectors |
| BD-019 | ISO 27001 compliance for data classification (ISMS context — mandatory) |
| BD-020 to BD-024 | Code quality, architecture fitness, FFA summary |

### CI_WORKFLOW Overlay (OVL-CI-001 to OVL-CI-005) — Tasks 13.1, 13.5, Exec Start

| Check | Specific Wave 13 Focus |
|-------|------------------------|
| OVL-CI-001 | Workflow YAML syntax valid after schema gate + auth smoke test additions |
| OVL-CI-002 | Job dependency chain correct: schema check → CWT → auth smoke test (in that order) |
| OVL-CI-003 | No workflow change creates a silent bypass of existing gates |
| OVL-CI-004 | New CI jobs use correct runner, permissions, and env var references |
| OVL-CI-005 | No inherent limitation exception applies (OVL-CI-005 documented exception) |

### PRE_BRIEF_ASSURANCE Overlay (OVL-INJ-001) — All Tasks

| Check | Specific Wave 13 Focus |
|-------|------------------------|
| OVL-INJ-001 | This pre-brief artifact (`iaa-prebrief-wave13-live-deployment-fix.md`) is committed and cited in PREHANDOVER proof before any builder task artifacts are committed |

### Combined Testing Pattern (OVL-AM-CWT-01) — Task 13.4 / Wave Completion

| Check | Specific Wave 13 Focus |
|-------|------------------------|
| OVL-AM-CWT-01 | CWT PASS verdict present with scope declared (T-W13-E2E-1–5 against live Vercel URL) — **MANDATORY before wave closure** |

---

## Step 0.5 — PREHANDOVER Proof Structure Required (Per Sub-Task)

Every sub-task PREHANDOVER proof MUST contain the following structure and fields. Deviation = REJECTION-PACKAGE:

```markdown
# PREHANDOVER Proof — Wave 13 Task [N.N] — [Task Name]

## Session Identity
- session_id: [e.g. session-wave13-task131-20260312]
- wave: 13
- task: [13.1 / 13.2 / 13.3 / 13.4 / 13.5 / Execution Start]
- branch: copilot/mat-wave-13-live-deployment-fix
- producing_agent: [agent name]
- producing_agent_class: [builder / foreman]
- date: [YYYY-MM-DD]

## Scope Declaration
- SCOPE_DECLARATION.md matches `git diff --name-only origin/main...HEAD`: [YES — evidence: git diff output]
  *(A-026 compliance — exact match required)*

## Deliverables Committed
- [List every file committed with path]

## Pre-IAA Commit Confirmation (A-021)
- Git status: [output showing clean working tree]
- Git log (last 3): [commits showing all deliverables pushed]
- CI run URL: [link to CI run triggered by this push]

## Test Run Evidence
- Test IDs confirmed GREEN: [list each T-W13-XXX-N — GREEN]
- Test IDs confirmed RED (for Execution Start RED delivery): [list each T-W13-XXX-N — RED]
- Baseline regression count: [559+ tests] — [GREEN / FAIL count]
- Test run command: [pnpm test or equivalent]

## IAA Pre-Brief Artifact Reference
- File: `.agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md`
- Committed: [YES — commit SHA]

## wave-current-tasks.md Status
- Updated to Wave 13: [YES — confirmed]
- Current wave status: [task X of 5 COMPLETE]

## PBFAG Reference (required at Execution Start only)
- PBFAG file: `modules/mat/05-build-evidence/PBFAG-mat-[YYYYMMDD].md` — [PRESENT / PRIOR WAVE REFERENCE]

## CWT Evidence (required at Task 13.4 and 13.5)
- CWT scope: Waves 0–13, all modules
- CWT test IDs: T-W13-E2E-1–5
- CWT verdict: [PASS / FAIL]
- CWT evidence: [test run output or CI URL]

## Session Memory Reference
- File: `.agent-workspace/[builder]/memory/session-wave13-task[N]-[YYYYMMDD].md`
- Committed: [YES — commit SHA]

## IAA Audit Token (A-029 — pre-populated reference, immutable post-commit)
iaa_audit_token: "IAA-session-wave13-task[N]-[YYYYMMDD]-PASS"
*(This field is pre-populated with expected reference format. IAA writes dedicated token file post-verdict. This proof is READ-ONLY after commit.)*

## Schema Column Compliance Note (A-032 — Task 13.1 only)
- Migration DDL reviewed: [YES — file: supabase/migrations/YYYYMMDDXXXXXXXX_wave13_schema_gate.sql]
- Columns cross-checked against INSERT/SELECT operations: [YES — all match]

## Carry-Forward Mandate (A-029b)
- All prior Wave 13 task tests confirmed GREEN in this session: [YES — test run evidence above]
- No leftover items from prior tasks: [YES / list any exceptions]
```

**Critical PREHANDOVER rules:**
1. **A-029 compliance**: `iaa_audit_token` MUST be pre-populated at commit time — not filled in "after IAA responds". Format: `IAA-session-wave13-task[N]-YYYYMMDD-PASS`
2. **A-021 compliance**: Commit and push MUST be done BEFORE invoking IAA. Working-tree-only fixes do not count.
3. **A-026 compliance**: SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` output exactly — git evidence required in proof
4. **A-029b compliance**: Every handover must explicitly confirm all prior Wave 13 tests remain GREEN (carry-forward mandate)

---

## Step 0.5 — Scope Blockers and Governance Conflicts Visible Now

### BLOCKER-1: wave-current-tasks.md Not Updated to Wave 13 (MANDATORY — FIX BEFORE FIRST BUILDER COMMIT)

**Status**: `wave-current-tasks.md` is currently in `wave-status-sweep-20260312` state. Wave 13 is not yet declared in this file.

**Impact**: A-021 and A-026 will both FAIL if any builder commit is made before this file is updated. IAA will reject any handover where wave-current-tasks.md does not declare Wave 13 as the active wave.

**Required action**: foreman-v2-agent must update `wave-current-tasks.md` with Wave 13 task register as the FIRST commit of the Execution Start session, before any builder task artifacts are committed.

---

### BLOCKER-2: PBFAG Record Required Before First Builder Appointment Beyond RED Tests

**Status**: No `modules/mat/05-build-evidence/PBFAG-mat-YYYYMMDD.md` for Wave 13 has been observed.

**Impact**: Per implementation plan §1.5, PBFAG is a gate requirement before builders are appointed for implementation. The qa-builder RED test phase and foreman governance setup are permitted, but schema-builder (Task 13.1 implementation) cannot proceed without PBFAG PASS.

**Required action**: Foreman must produce PBFAG for Wave 13 and record it in `modules/mat/05-build-evidence/PBFAG-mat-YYYYMMDD.md` before appointing schema-builder to Task 13.1 GREEN implementation.

**Note**: The Execution Start session MAY bundle PBFAG with governance setup since CS2 has explicitly declared Task 13.1 as part of this session. IAA will accept this provided PBFAG is included in the committed artifacts.

---

### ADVISORY-1: 24 RED Tests Must Be Genuinely RED — Not Vacuous Passes

**Risk**: qa-builder has delivered RED test suites in prior waves where tests passed vacuously (BD-013 violation). IAA will inspect every RED test to verify genuine failure assertion.

**Required**: Each RED test must fail because the target functionality is NOT wired — not because of an incorrect assertion or empty mock.

---

### ADVISORY-2: CI Workflow Changes Require CORE-023 Ripple Check

**Risk**: Tasks 13.1 and 13.5 both modify the CI deploy workflow. Every CI workflow change in this wave must be verified against all existing workflow jobs to ensure no silent breakage.

**Required**: Builder producing agent must declare in PREHANDOVER proof that existing CI jobs remain unaffected. IAA will verify workflow YAML syntax and job dependency chain.

---

### ADVISORY-3: Sequential Dependency Chain — No Parallel Execution

The implementation plan declares strict sequential execution: 13.1→13.2→13.3→13.4→13.5. Each task has an explicit "Entry" criterion requiring the prior task to be COMPLETE (all tests GREEN). IAA will reject any handover where the prior task's tests are not confirmed GREEN in the same test run evidence.

---

### ADVISORY-4: CWT Mandate (OVL-AM-CWT-01) — Must Be Formally Documented

Task 13.4 IS the CWT for Wave 13. However, the CWT PASS evidence must be explicitly documented in the Task 13.4 PREHANDOVER proof under "CWT Evidence" and carried forward into the Task 13.5 IBWR/closure document. The CWT scope must declare: Waves 0–13, all MAT modules, T-W13-E2E-1–5 scenarios.

---

### ADVISORY-5: A-033 — CORE-018 Verification Must Use Git, Not Disk

When invoking IAA, the producing agent must ensure all evidence files are committed and verified via `git ls-tree HEAD` — not just present on the working filesystem. Files present on disk but not committed will fail CORE-018.

---

## Pre-Brief Summary

| Wave 13 Sub-Task | Trigger Category | IAA Required | FFA Checks | Key Specific Rules |
|-----------------|------------------|--------------|------------|--------------------|
| Execution Start | MIXED | MANDATORY | CORE-013–023, BD-001–024, OVL-CI-001–005, OVL-INJ-001 | A-021, A-026, A-032, CORE-023, OVL-AM-CWT-01 (noted for 13.4) |
| Task 13.1 — Schema Gate | MIXED | MANDATORY | CORE-013–023, BD-001–024, OVL-CI-001–005, OVL-INJ-001 | A-021, A-026, A-032, CORE-023, BD-015 |
| Task 13.2 — Auth Fix | AAWP_MAT | MANDATORY | CORE-013–023, BD-001–024, OVL-INJ-001 | A-021, A-026, BD-007, BD-013, PBFAG-9 |
| Task 13.3 — UI Wiring | AAWP_MAT | MANDATORY | CORE-013–023, BD-001–024, OVL-INJ-001 | A-021, A-026, BD-003, BD-005, CORE-023 |
| Task 13.4 — CWT | AAWP_MAT | MANDATORY | CORE-013–023, BD-001–024, OVL-INJ-001 | A-021, A-026, OVL-AM-CWT-01 (MANDATORY), PBFAG-9/11/12 |
| Task 13.5 — CI Auth Smoke | MIXED | MANDATORY | CORE-013–023, BD-001–024, OVL-CI-001–005, OVL-INJ-001 | A-021, A-026, CORE-023, OVL-AM-CWT-01 (carry-forward), A-029b |

**Total qualifying tasks**: 6 (Execution Start + 5 sub-tasks) — all requiring IAA hard-gate under PHASE_B_BLOCKING

**Total test IDs under IAA oversight**: 24 (T-W13-SCH-1–4, T-W13-CI-1–3, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5)

**Blockers requiring immediate action**: 2 (wave-current-tasks.md update; PBFAG record)

---

## Governance Note for Producing Agents

IAA is in STANDBY for Wave 13. This pre-brief is active and covers all 5 sub-tasks.

**Producing agents must**:
1. Cite this file (`iaa-prebrief-wave13-live-deployment-fix.md`) in every Wave 13 PREHANDOVER proof under "IAA Pre-Brief Artifact Reference"
2. Follow the PREHANDOVER proof structure declared in Step 0.5 above
3. Resolve BLOCKER-1 (wave-current-tasks.md) and BLOCKER-2 (PBFAG) before first IAA invocation
4. Invoke IAA by commenting on the Wave 13 PR after committing and pushing each sub-task's artifacts

IAA will not accept a handover that does not cite this pre-brief file.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Contract Version**: 2.2.0
**Adoption Phase**: PHASE_B_BLOCKING — verdicts are hard-blocking
**STOP-AND-FIX Mandate**: ACTIVE
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE
**Generated**: 2026-03-12
