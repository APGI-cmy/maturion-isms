# IAA Pre-Brief — Wave 16 Full-Batch Build

**Pre-Brief ID**: IAA-PREBRIEF-wave16-full-batch-20260310
**Wave**: wave16-full-batch — Wave 16 Full-Batch Build: All Actionable Sub-Waves
**Branch**: copilot/orchestrate-wave-16-build-another-one
**Date**: 2026-03-10
**Produced by**: independent-assurance-agent v6.2.0
**Requested by**: foreman-v2-agent (wave full-batch invocation)
**Authority**: CS2 (@APGI-cmy) — Issue: "Orchestrate full-batch Wave 16 build: Implement all
actionable sub-waves, update progress tracker"
**Prior kick-off pre-brief**: `.agent-admin/assurance/iaa-prebrief-wave16.md` (PR #1034)
**wave-current-tasks.md committed at**: SHA 5652df5
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## § 0 — Pre-Brief Mode Confirmation

This document is a **PRE-BRIEF artifact only**.
IAA is NOT executing Phase 2–4 assurance in this session.
Full assurance (ASSURANCE-TOKEN or REJECTION-PACKAGE) will be issued **per sub-wave PR**
at handover when the Foreman invokes IAA with the completed PREHANDOVER proof on each
sub-wave branch.

This pre-brief declares all trigger categories, FFA checks, PREHANDOVER structures, and
governance blockers visible NOW — before any builder delegation begins.

---

## § 1 — Wave Scope Review

**Source**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (SHA 5652df5,
read in full)

### Sub-Wave Register (Actionable This Batch)

| Sub-Wave | Title | Gaps | Builders | Priority | IAA Triggers |
|----------|-------|------|----------|----------|-------------|
| **16.6** | Schema + Audit Completeness | GAP-011, 012, 016, 017, 019 | qa-builder → schema-builder + api-builder | HIGH | AAWP_MAT + **A-032** |
| **16.1** | Evidence Collection Page Wire | GAP-003 | qa-builder → ui-builder | CRITICAL | AAWP_MAT |
| **16.8** | Documentation Gaps | GAP-018 | mat-specialist | MEDIUM | AAWP_MAT (docs-mode) |
| **16.2** | Frontend UX Completeness | GAP-006,007,008,009,014,015,020,024,025 | qa-builder → ui-builder | HIGH | AAWP_MAT |
| **16.7** | ARC Portal Frontend | GAP-013 | qa-builder → ui-builder | HIGH | AAWP_MAT |

### Sub-Wave Register (Blocked / Parked — Not Actioned This Batch)

| Sub-Wave | Title | Status | Reason |
|----------|-------|--------|--------|
| 16.3 | AI Scoring Edge Function | BLOCKED | Awaiting Wave 16.5 (AIMC Waves 3-4) |
| 16.4 | Report Generation Edge Function | BLOCKED | Awaiting Wave 16.5 + 16.3 |
| 16.5 | AIMC Scoring+Reporting Wiring | BLOCKED | Awaiting AIMC Waves 3-4 (external) |
| 16.9 | Future Considerations | PARKED | CS2 architectural decision pending |

---

## § 2 — Pre-Brief Mode Confirmation (Step 0.1)

Invocation mode: **PRE-BRIEF** — triggered by `[IAA PRE-BRIEF REQUEST]` comment from
foreman-v2-agent. This is not a Phase 2–4 assurance invocation. IAA does NOT issue
ASSURANCE-TOKEN or REJECTION-PACKAGE in this session.

---

## § 3 — Trigger Category Declaration (Step 0.3)

All sub-waves in this batch are **AAWP_MAT** (primary). Secondary trigger categories
are declared per sub-wave below. A-022 (re-evaluate trigger categories on every invocation)
is pre-applied here for each expected sub-wave PR.

### 3.1 — Sub-Wave 16.6 Trigger Categories

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY** | Supabase schema migrations (`scores`, `audit_scores`, `evidence_submissions`); API handler update (`POST /api/ai/request` JWT auth — GAP-017); audit logging expansion (GAP-016) |
| **A-032 SCHEMA COLUMN COMPLIANCE** | **YES — MANDATORY** | Sub-wave 16.6 introduces INSERT/SELECT/UPDATE on `scores`, `audit_scores`, and `evidence_submissions` tables. IAA MUST read migration DDL directly and cross-check every column name. Mocked tests do NOT satisfy. Silent try/catch does NOT exempt. |
| AGENT_CONTRACT | NO | No `.github/agents/` files expected |
| CANON_GOVERNANCE | NO | No `governance/canon/` files expected |
| CI_WORKFLOW | **WATCHPOINT** | If schema-builder adds a new Supabase migration CI step or modifies `.github/workflows/`, category escalates to CI_WORKFLOW (MANDATORY). Foreman must alert IAA if this occurs. |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` changes expected |
| MIXED | **APPLICABLE IF WATCHPOINT TRIGGERS** | AAWP_MAT + CI_WORKFLOW = MIXED; IAA trigger covers both |

### 3.2 — Sub-Wave 16.1 Trigger Categories

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY** | Frontend component: `/evidence` page wired from stub to real EvidenceCollectionPage (GAP-003); hooks; API wiring |
| AGENT_CONTRACT | NO | Not expected |
| CI_WORKFLOW | **WATCHPOINT** | If ui-builder modifies Playwright config or e2e workflow → CI_WORKFLOW trigger activates |
| A-032 | NO | No schema migrations expected in 16.1 |

### 3.3 — Sub-Wave 16.2 Trigger Categories

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY** | 9 frontend UX gap fixes (GAP-006,007,008,009,014,015,020,024,025); React components, hooks, loading states, error handling, empty state UI |
| A-032 | **WATCHPOINT** | If 16.2 introduces any new INSERT/SELECT calls on named Supabase tables (e.g., for loading state data), A-032 activates. IAA will check at PR review. |
| CI_WORKFLOW | **WATCHPOINT** | If new test workflows added |

### 3.4 — Sub-Wave 16.7 Trigger Categories

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY** | ARC Portal frontend — new UI for feedback approval workflow (GAP-013); React components consuming existing feedback endpoints |
| A-032 | **WATCHPOINT** | If 16.7 introduces INSERT/SELECT on `audit_scores` or `scores` tables from frontend hooks, A-032 activates (coordinates with 16.6 schema) |

### 3.5 — Sub-Wave 16.8 Trigger Categories

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — DOCS-MODE** | `mat-ai-gateway` deployment runbook (GAP-018); documentation only; no executable code expected |
| CI_WORKFLOW | NO | Documentation only |
| A-032 | NO | No schema operations |
| **QP Gate** | **WAIVED** | Documentation-only deliverable; no tests added or modified; explicit waiver declaration required in PREHANDOVER proof |

### 3.6 — Foreman Governance Artifacts (Each PR)

| Category | Triggered? | Basis |
|----------|-----------|-------|
| AAWP_MAT | YES — MIXED | BUILD_PROGRESS_TRACKER.md updates per sub-wave closure |
| ADMIN | YES — Subsumed | SCOPE_DECLARATION.md (A-026 compliance per sub-wave PR) |

### 3.7 — Summary: Categories Applicable to This Full Batch

| Category | Active? | Notes |
|----------|---------|-------|
| **AAWP_MAT** | ✅ YES — ALL sub-waves | PRIMARY trigger for every actionable sub-wave |
| **A-032 Schema Column Compliance** | ✅ MANDATORY for 16.6 | IAA reads DDL directly |
| AGENT_CONTRACT | ❌ Not expected | Alert IAA immediately if any `.github/agents/` file is touched |
| CANON_GOVERNANCE | ❌ Not expected | Alert IAA immediately if `governance/canon/` is touched |
| CI_WORKFLOW | ⚠️ WATCHPOINT | Activates if `.github/workflows/` is modified by any builder |
| KNOWLEDGE_GOVERNANCE | ❌ Not expected | Alert IAA immediately if `.agent-workspace/*/knowledge/` is touched |
| MIXED | ⚠️ As applicable | Any triggering + non-triggering file mix activates MIXED |

---

## § 4 — Qualifying Tasks and IAA Invocation Plan

### 4.1 — Qualifying Tasks (IAA Applies)

| Task ID | Summary | IAA Trigger Category | Required at Handover |
|---------|---------|---------------------|---------------------|
| **T-W16.6-SCH-001** | RED QA suite for Schema + Audit Completeness (GAP-011,012,016,017,019) | AAWP_MAT | Full FFA + CORE sweep + **A-032 DDL read** |
| **T-W16.6-SCH-002** | GREEN implementation: schema-builder + api-builder | AAWP_MAT + A-032 | Full FFA + A-032 migration DDL cross-check |
| **T-W16.1-UI-001** | RED QA suite for Evidence Collection Page Wire (GAP-003) | AAWP_MAT | Full FFA + CORE sweep |
| **T-W16.1-UI-002** | GREEN implementation: ui-builder (Evidence Collection) | AAWP_MAT | Full FFA + wiring verification |
| **T-W16.8-DOC-001** | Documentation: mat-ai-gateway deployment runbook (GAP-018) | AAWP_MAT (docs-mode) | CORE sweep + QP waiver |
| **T-W16.2-UI-001** | RED QA suite for Frontend UX Completeness (9 gaps) | AAWP_MAT | Full FFA + CORE sweep |
| **T-W16.2-UI-002** | GREEN implementation: ui-builder (UX completeness) | AAWP_MAT | Full FFA + wiring verification |
| **T-W16.7-UI-001** | RED QA suite for ARC Portal Frontend (GAP-013) | AAWP_MAT | Full FFA + CORE sweep |
| **T-W16.7-UI-002** | GREEN implementation: ui-builder (ARC Portal) | AAWP_MAT | Full FFA + wiring verification |
| **BUILD_PROGRESS_TRACKER updates** | Per sub-wave completion | AAWP_MAT (MIXED) | CORE-018 sweep per PR |

### 4.2 — Not Qualifying (Blocked/Parked — IAA Not Triggered)

| Task ID | Summary | Reason |
|---------|---------|--------|
| T-W16.3-API-001/002 | AI Scoring Edge Function | BLOCKED — external dependency (AIMC Waves 3-4) |
| T-W16.4-API-001/002 | Report Generation Edge Function | BLOCKED — dependency cascade |
| T-W16.5-INT-001/002 | AIMC Scoring+Reporting Wiring | BLOCKED — external dependency |
| T-W16.9-PARKED | Future Considerations | PARKED — CS2 decision |

---

## § 5 — FFA Checks IAA Will Run at Final Handover (Per Sub-Wave)

This section declares the complete FFA check set for each sub-wave. These checks apply at
the **GREEN implementation PR** stage. The RED QA PR receives its own FFA sweep.

### 5.1 — Core Invariants (ALL sub-waves, every PR)

The following CORE checks apply to every sub-wave PR (both RED and GREEN stages):

| Check ID | Description | Notes for This Batch |
|----------|-------------|---------------------|
| CORE-005 | Governance block present | Verify all PR artifacts reference governance correctly |
| CORE-006 | CANON_INVENTORY alignment | Any governance references resolve to non-null hashes |
| CORE-007 | No placeholder content | No STUB/TODO/FIXME/TBD in delivered code or artifacts (iaa_audit_token pre-populated reference exempt per A-029) |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof must reference THIS Pre-Brief artifact AND sub-wave pre-brief (A-001) |
| CORE-014 | No class exemption claim | No class exempts from IAA (A-002) |
| CORE-015 | Session memory present | Foreman + builder session memory on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated token file at `.agent-admin/assurance/iaa-token-session-NNN-wave16-subXX-YYYYMMDD.md` |
| CORE-017 | No unauthorized `.github/agents/` modifications | diff must not touch agent contracts |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof + session memory + iaa_audit_token field + token file all present |
| CORE-019 | IAA token cross-verification | Token file references current PR; first-invocation exception per A-029 |
| CORE-020 | Zero partial pass | No assumed passes; absent evidence = FAIL |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE; no "minor" exceptions |

CORE-001 through CORE-004, CORE-008 through CORE-012, CORE-022: **NOT APPLICABLE** — no
agent contract files in scope. If any sub-wave PR contains `.github/agents/` modifications,
these checks ACTIVATE immediately and the PR category escalates to AGENT_CONTRACT.

### 5.2 — AAWP_MAT Overlay: Sub-Wave 16.6 (Schema + Audit Completeness)

> **A-032 MANDATORY EXTENSION**: For all migrations containing INSERT, SELECT, or UPDATE
> on `scores`, `audit_scores`, or `evidence_submissions`: IAA MUST read the migration DDL
> SQL directly. Column names in application code and tests must exactly match migration DDL.
> Silent try/catch does NOT exempt. Mocked tests do NOT satisfy.

#### BD-TIER-1 — Delivery Completeness (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T1-W16.6-001 | GAP-011 closed: `scores` INSERT/UPDATE/SELECT RLS policies present and non-trivially permissive |
| BD-T1-W16.6-002 | GAP-012 closed: `audit_scores` INSERT/UPDATE/SELECT RLS policies present |
| BD-T1-W16.6-003 | GAP-016 closed: audit logging extended beyond criteria parsing — evidence submission, score recording, AI requests all produce audit_log entries |
| BD-T1-W16.6-004 | GAP-017 closed: `POST /api/ai/request` requires valid JWT — unauthenticated requests return 401 |
| BD-T1-W16.6-005 | GAP-019 closed: `evidence_submissions` table migration present — not just referenced in code |

#### BD-TIER-2 — Wiring & Integration Verification (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T2-W16.6-001 | Migration DDL column names exactly match all INSERT/SELECT/UPDATE calls in application code — **A-032 DDL cross-check** |
| BD-T2-W16.6-002 | JWT validation for `POST /api/ai/request` is real middleware — not just documented; verified by a test asserting 401 on unauthenticated call |
| BD-T2-W16.6-003 | Audit log extension does not break existing audit log consumers (criteria parsing path still produces entries) |
| BD-T2-W16.6-004 | RLS policies do not inadvertently block service-role operations (Supabase service role bypass confirmed or explicitly documented) |
| BD-T2-W16.6-005 | `evidence_submissions` migration applied in correct order — no FK dependencies on tables not yet created |

#### BD-TIER-3 — Test Quality & Zero Debt (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T3-W16.6-001 | RED gate tests (T-W16.6-SCH-001) confirmed FAILING before GREEN build — RED evidence in PREHANDOVER |
| BD-T3-W16.6-002 | GREEN gate: all T-W16.6-SCH-001 tests now PASSING; zero skipped/todo/stub |
| BD-T3-W16.6-003 | RLS policy tests test actual row-level rejection (not just that the policy exists) |
| BD-T3-W16.6-004 | JWT auth test verifies 401 return code with no token AND 200/expected with valid token |
| BD-T3-W16.6-005 | QP 100%: no warnings, no skipped tests, zero test debt in sub-wave test suite |

#### BD-TIER-4 — Security Review (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T4-W16.6-001 | No secrets or credentials committed in migration files or API handler |
| BD-T4-W16.6-002 | GAP-017 JWT fix: token validation uses standard Supabase JWT verification — not a custom/trivial check |
| BD-T4-W16.6-003 | RLS policies use `auth.uid()` for user-facing access — not insecure `true` bypass policies |
| BD-T4-W16.6-004 | `evidence_submissions` migration does not expose data to unauthenticated roles (anon role SELECT denied) |

#### BD-TIER-5 — Code Quality (IAA Uses Judgement)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T5-W16.6-001 | Schema-builder follows existing migration naming convention (timestamp-prefix, lowercase) |
| BD-T5-W16.6-002 | API handler changes consistent with existing API surface patterns — no one-off approaches |

#### FFA Summary Template (Sub-Wave 16.6)

```
FFA Result (Sub-Wave 16.6):
  FFA-01 Delivery Completeness: [PASS|FAIL] — <GAP-011/012/016/017/019 status>
  FFA-02 Wiring Verification: [PASS|FAIL] — <DDL column match, JWT wiring, audit log>
  FFA-03 Integration Fit: [PASS|FAIL] — <RLS + existing consumer compatibility>
  FFA-04 Security: [PASS|FAIL] — <JWT, RLS, anon-role denial>
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL] — <migration naming, pattern consistency>
  FFA-06 One-Time Build: [PASS|FAIL] — <will deliver functional result first time?>
  FFA-A032: [PASS|FAIL] — <DDL read confirmed; all INSERT/SELECT columns verified>
  FFA-CARRY-FORWARD: [NONE|ISSUED]
```

---

### 5.3 — AAWP_MAT Overlay: Sub-Wave 16.1 (Evidence Collection Page Wire)

#### BD-TIER-1 — Delivery Completeness (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T1-W16.1-001 | GAP-003 closed: `/evidence` route renders a real, functional EvidenceCollectionPage component — not a stub, placeholder, or TODO component |
| BD-T1-W16.1-002 | EvidenceCollectionPage displays evidence list from the real API/Supabase query (not hardcoded mock data) |
| BD-T1-W16.1-003 | Evidence submission workflow is reachable and functional from the wired page |

#### BD-TIER-2 — Wiring & Integration Verification (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T2-W16.1-001 | Route `/evidence` resolves to EvidenceCollectionPage in the router config — not a lazy-loaded placeholder |
| BD-T2-W16.1-002 | EvidenceCollectionPage hook calls real API endpoint (or real Supabase query) — not a mock/stub hook |
| BD-T2-W16.1-003 | After 16.6 merge: EvidenceCollectionPage uses the `evidence_submissions` schema correctly — column names match DDL (coordinate with 16.6 A-032) |

#### BD-TIER-3 — Test Quality & Zero Debt (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T3-W16.1-001 | RED gate: T-W16.1-UI-001 confirmed FAILING before build — RED evidence in PREHANDOVER |
| BD-T3-W16.1-002 | GREEN gate: tests pass — route renders real component, loads evidence, handles empty state |
| BD-T3-W16.1-003 | Loading state and error state tested (not just happy path) |
| BD-T3-W16.1-004 | QP 100%: no warnings, no skipped |

#### BD-TIER-4 — Security

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T4-W16.1-001 | `/evidence` page only accessible to authenticated users — route guard present |
| BD-T4-W16.1-002 | No user-supplied data rendered without sanitisation in EvidenceCollectionPage |

#### FFA Summary Template (Sub-Wave 16.1)

```
FFA Result (Sub-Wave 16.1):
  FFA-01 Delivery Completeness: [PASS|FAIL] — <GAP-003: real component wired, not stub>
  FFA-02 Wiring Verification: [PASS|FAIL] — <router, hook, API wiring confirmed>
  FFA-03 Integration Fit: [PASS|FAIL] — <evidence_submissions schema compatibility>
  FFA-04 Security: [PASS|FAIL] — <auth guard, sanitisation>
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL]
  FFA-06 One-Time Build: [PASS|FAIL]
  FFA-CARRY-FORWARD: [NONE|ISSUED]
```

---

### 5.4 — AAWP_MAT Overlay: Sub-Wave 16.8 (Documentation — Docs-Mode)

> **QP Gate WAIVED**: Documentation-only deliverable. No tests are added or modified.
> Explicit waiver declaration REQUIRED in PREHANDOVER proof:
> "QP gate: WAIVED — no tests added or modified in this session.
> Rationale: documentation-only deliverable (mat-ai-gateway deployment runbook, GAP-018)."

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T1-W16.8-001 | GAP-018 closed: `mat-ai-gateway` deployment runbook present in repository as a committed file |
| BD-T1-W16.8-002 | Runbook covers: deployment prerequisites, environment variables, deployment steps, rollback procedure |
| BD-T1-W16.8-003 | No placeholder sections (STUB/TODO/TBD) remain in delivered runbook |
| BD-T1-W16.8-004 | Runbook file path declared in SCOPE_DECLARATION.md and matches `git diff --name-only` (A-026) |
| BD-T4-W16.8-001 | No secrets, API keys, or credentials embedded in runbook content |

---

### 5.5 — AAWP_MAT Overlay: Sub-Wave 16.2 (Frontend UX Completeness)

> **Dependency gate**: 16.2 GREEN build must only begin after 16.1 GREEN merge confirmed.
> PREHANDOVER proof must declare: "Wave 16.1 merged at: [SHA]" before IAA invocation.

#### BD-TIER-1 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T1-W16.2-001 | All 9 UX gaps addressed: GAP-006,007,008,009,014,015,020,024,025 — each gap has a corresponding implementation element |
| BD-T1-W16.2-002 | No gap left as partial fix or TODO — each gap either CLOSED (fully functional) or explicitly deferred with CS2 approval cited |

#### BD-TIER-2 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T2-W16.2-001 | UX fixes wire to real data (not mock) — loading states, error states, empty states all functional |
| BD-T2-W16.2-002 | No regression to 16.1 wiring (Evidence Collection page still functional post-16.2) |

#### BD-TIER-3 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T3-W16.2-001 | RED gate confirmed FAILING before GREEN build |
| BD-T3-W16.2-002 | GREEN gate: all 9 gap tests PASSING; QP 100% |
| BD-T3-W16.2-003 | A-032 watchpoint: if any hook in 16.2 introduces INSERT/SELECT on named table, IAA reads DDL |

#### BD-TIER-4 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T4-W16.2-001 | All new UX paths respect auth guards |
| BD-T4-W16.2-002 | No secrets committed |

#### FFA Summary Template (Sub-Wave 16.2)

```
FFA Result (Sub-Wave 16.2):
  FFA-01 Delivery Completeness: [PASS|FAIL] — <all 9 UX gaps status>
  FFA-02 Wiring Verification: [PASS|FAIL] — <real data, no regression to 16.1>
  FFA-03 Integration Fit: [PASS|FAIL] — <16.1 compatibility confirmed>
  FFA-04 Security: [PASS|FAIL] — <auth guards, no secrets>
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL]
  FFA-06 One-Time Build: [PASS|FAIL]
  FFA-A032-WATCHPOINT: [NOT TRIGGERED|TRIGGERED — DDL checked]
  FFA-CARRY-FORWARD: [NONE|ISSUED]
```

---

### 5.6 — AAWP_MAT Overlay: Sub-Wave 16.7 (ARC Portal Frontend)

> **Dependency gate**: 16.7 PREHANDOVER proof must declare 16.1 merge SHA. If 16.2 is also
> merged by this point, declare 16.2 SHA too.

#### BD-TIER-1 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T1-W16.7-001 | GAP-013 closed: ARC Portal frontend exists and is accessible — feedback approval workflow UI present |
| BD-T1-W16.7-002 | Feedback approval workflow is functional end-to-end in the UI — not a static mockup |

#### BD-TIER-2 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T2-W16.7-001 | ARC Portal UI consumes the existing feedback approval endpoints — no new API invented |
| BD-T2-W16.7-002 | A-032 watchpoint: if portal UI hooks call INSERT/SELECT on `audit_scores`, IAA reads 16.6 migration DDL to confirm column compatibility |

#### BD-TIER-3 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T3-W16.7-001 | RED gate confirmed FAILING before GREEN build |
| BD-T3-W16.7-002 | GREEN gate: ARC portal renders, loads feedback, approves feedback — all PASSING; QP 100% |

#### BD-TIER-4 (Blocking)

| Check ID | What IAA Verifies |
|----------|------------------|
| BD-T4-W16.7-001 | ARC Portal only accessible to authenticated users with correct role (not all authenticated users) |
| BD-T4-W16.7-002 | No secrets committed |

#### FFA Summary Template (Sub-Wave 16.7)

```
FFA Result (Sub-Wave 16.7):
  FFA-01 Delivery Completeness: [PASS|FAIL] — <GAP-013: ARC portal present and functional>
  FFA-02 Wiring Verification: [PASS|FAIL] — <existing endpoints consumed correctly>
  FFA-03 Integration Fit: [PASS|FAIL] — <audit_scores DDL compatibility if triggered>
  FFA-04 Security: [PASS|FAIL] — <role-gated access, no secrets>
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL]
  FFA-06 One-Time Build: [PASS|FAIL]
  FFA-A032-WATCHPOINT: [NOT TRIGGERED|TRIGGERED — DDL checked against 16.6 migration]
  FFA-CARRY-FORWARD: [NONE|ISSUED]
```

---

### 5.7 — CST / CWT / FCWT Obligations (MANDATORY — Per COMBINED_TESTING_PATTERN.md)

| Test Type | When Required | Blocking? | IAA Action |
|-----------|--------------|-----------|------------|
| **CST — 16.1 + 16.6 Convergence** | When BOTH 16.1 and 16.6 GREEN PRs are merged | Advisory–Blocking | IAA will prompt Foreman to commission CST: "Evidence Collection Page consuming `evidence_submissions` schema and RLS — cross-boundary integration test required" |
| **CST — 16.2 + 16.7 Convergence** | When 16.2 and 16.7 complete | Discretionary | IAA evaluates: if ARC portal accesses `audit_scores` table (16.6 schema), CST is required |
| **CWT — Before Wave 16 IBWR** | After all actionable sub-wave QA passes | **MANDATORY — HARD GATE** | CWT must cover all implemented sub-waves (16.1, 16.2, 16.6, 16.7, 16.8). IBWR CANNOT close without CWT PASS verdict. |
| FCWT | Not this wave | N/A | Not applicable — not a production sign-over wave |

**CST Prompt wording IAA will use at 16.1+16.6 convergence:**
> "Sub-waves 16.1 (Evidence Collection Page) and 16.6 (Schema + Audit Completeness) have both
> landed. The frontend is now consuming the `evidence_submissions` schema and RLS policies
> introduced in 16.6 — this is a cross-architectural-boundary integration point.
> Per `COMBINED_TESTING_PATTERN.md` §4.2, a CST checkpoint is warranted before proceeding
> to 16.2/16.7. Please commission CST covering the 16.1+16.6 integration and record the
> result in the wave reconciliation artefact before further delegation."

---

## § 6 — PREHANDOVER Proof Structure (Per Sub-Wave)

Each sub-wave PR requires its own dedicated PREHANDOVER proof committed on the branch before
IAA invocation. The following template sections are mandatory. Absent required fields =
**CORE-018 REJECTION-PACKAGE** at handover.

### 6.1 — Mandatory PREHANDOVER Proof Template (All Sub-Waves)

```markdown
# PREHANDOVER Proof — [session-ID]
# Sub-Wave: [16.X — descriptive name]
# Branch: [branch name]
# Date: [YYYY-MM-DD]

## Header
- session_id: [session-wave16-subXX-YYYYMMDD]
- wave: wave16-full-batch
- sub_wave: [16.X]
- branch: [branch name]
- date: [YYYY-MM-DD]
- producing_agent: [foreman-v2-agent / builder agent]
- pr_category: AAWP_MAT

## § 1 — Scope Declaration Evidence (A-026)
- SCOPE_DECLARATION.md: current state
- Files committed: [explicit list — must match git diff --name-only origin/main...HEAD]
- A-026 compliance: CONFIRMED — paste git diff --name-only output
- A-031 carve-out: [APPLICABLE — if prior IAA ceremony files excluded / NOT APPLICABLE]

## § 2 — CS2 Authorization Evidence
- Issue: "Orchestrate full-batch Wave 16 build: Implement all actionable sub-waves"
- Opened by: @APGI-cmy
- Prior kick-off PR: #1034 (merged to main)
- wave-current-tasks.md SHA: 5652df5

## § 3 — Wave 16 Pre-Brief References
- IAA wave16 kick-off pre-brief: .agent-admin/assurance/iaa-prebrief-wave16.md
- IAA wave16-full-batch pre-brief: .agent-admin/assurance/iaa-prebrief-wave16-full-batch.md
- Sub-wave pre-brief: [.agent-admin/assurance/iaa-prebrief-wave16-subXX-YYYYMMDD.md] OR
  INLINE DECLARATION: "Pre-brief requirements satisfied by iaa-prebrief-wave16-full-batch.md §5.X"

## § 4 — RED Gate Evidence (Required for all except 16.8)
- RED gate task ID: [T-W16.X-XXX-001]
- RED tests confirmed FAILING: [YES — paste failing test names and error output excerpt]
- RED gate commit SHA: [SHA]
- Builder delegation commenced: [after RED gate — YES]

## § 5 — Dependency Gate Evidence (Sub-waves 16.2, 16.7 only)
- Wave 16.1 merged at: [SHA] (required for 16.2 and 16.7)
- Wave 16.2 merged at: [SHA] (required for 16.7 if 16.2 complete)
- [OMIT SECTION if not applicable to this sub-wave]

## § 6 — QP Gate
- QP result: [PASS — all tests GREEN, zero skipped/todo/stub/warning] OR
  [WAIVED — documentation-only deliverable (16.8 only)]
- Test output excerpt confirming 100% pass: [paste]

## § 7 — A-032 Schema Column Compliance (Sub-wave 16.6 ONLY)
- Migration files read by IAA: [list migration filenames]
- Tables with INSERT/SELECT/UPDATE: [scores, audit_scores, evidence_submissions]
- Column names in DDL vs application code: [CONFIRMED MATCH]
- [OMIT SECTION for all sub-waves except 16.6 unless A-032 watchpoint triggered]

## § 8 — Pre-IAA Commit Gate (A-021)
- git status output: [paste — must show clean working tree]
- git log --oneline -5: [paste — confirm all declared files in recent commits]

## § 9 — BUILD_PROGRESS_TRACKER.md Evidence
- Previous version: [vX.X]
- New version: [vX.X]
- Sub-wave [16.X] status updated to: [IN PROGRESS / COMPLETE]
- Diff excerpt: [paste relevant BUILD_PROGRESS_TRACKER diff]

## § 10 — Ceremony Artifacts on Branch
- Foreman session memory: [path] — PRESENT
- Builder session memory: [path] — PRESENT
- PREHANDOVER proof (this file): [path] — PRESENT
- IAA full-batch pre-brief: .agent-admin/assurance/iaa-prebrief-wave16-full-batch.md — PRESENT

## § 11 — IAA Audit Token
iaa_audit_token: IAA-session-[NNN]-wave16-sub[XX]-[YYYYMMDD]-PASS
expected_token_file: .agent-admin/assurance/iaa-token-session-[NNN]-wave16-sub[XX]-[YYYYMMDD].md

[A-029 compliance: token reference pre-populated at commit time.
 PREHANDOVER proof is READ-ONLY post-commit per §4.3b.
 IAA creates the dedicated token file. Do NOT edit this proof after commit.]
```

### 6.2 — Additional Fields for Sub-Wave 16.6 PREHANDOVER

Sub-wave 16.6 PREHANDOVER **MUST** also include:

```markdown
## § 12 — A-032 Migration DDL Evidence (MANDATORY for 16.6)
- scores table migration file: [filename + commit SHA]
  - Columns declared in DDL: [list all column names]
  - INSERT/SELECT/UPDATE calls in application code referencing these columns: [confirm match]
- audit_scores table migration file: [filename + commit SHA]
  - Columns declared in DDL: [list all column names]
  - Application code cross-check: [confirm match]
- evidence_submissions table migration file: [filename + commit SHA]
  - Columns declared in DDL: [list all column names]
  - Application code cross-check: [confirm match]
- GAP-017 JWT middleware test: [paste test output showing 401 on unauthenticated + 200 on authenticated]
```

---

## § 7 — Scope Blockers and Governance Conflicts

### 7.1 — A-026 Risk (Standing — Highest Recurrence Rate)

> **⚠️ A-026 Pre-Invocation Risk — MOST COMMON REJECTION-PACKAGE CAUSE**:
> `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` **exactly**
> before invoking IAA for each sub-wave PR.
>
> Required action before EACH IAA invocation:
> 1. Run `git diff --name-only origin/main...HEAD`
> 2. Overwrite `SCOPE_DECLARATION.md` with the exact output (list format — A-028)
> 3. Check: prior-wave entries from wave15 or earlier have been trimmed (A-028)
> 4. Commit the update
> 5. Add A-031 carve-out note if any prior IAA ceremony files are excluded
> 6. Only THEN invoke IAA

### 7.2 — A-032 Risk (Sub-Wave 16.6 — Blocking)

> **⚠️ A-032 MANDATORY for sub-wave 16.6**:
> Schema migrations for `scores`, `audit_scores`, and `evidence_submissions` must be read
> by IAA directly as DDL. Application code column references (INSERT, SELECT, UPDATE) must
> exactly match the DDL. This is not satisfiable by test mocks or try/catch wrapping.
>
> If any 16.6 migration is added, amended, or split into multiple files:
> — All migration files must be listed in PREHANDOVER proof § 12.
> — All column names must be enumerated.
> — IAA will not accept a blanket "schema matches" claim without reading the SQL.

### 7.3 — Wave-Level Dependency Blockers

| Blocker | Sub-Waves Affected | Resolution Required |
|---------|-------------------|-------------------|
| AIMC Waves 3-4 not delivered | 16.3, 16.4, 16.5 | Monitor AIMC; unblock when AIMC signals delivery |
| CS2 architectural decision | 16.9 | Escalate to @APGI-cmy; do not action without CS2 directive |
| 16.1 must merge before 16.2 | 16.2 | 16.2 PREHANDOVER must declare 16.1 merge SHA |
| 16.1 must merge before 16.7 | 16.7 | 16.7 PREHANDOVER must declare 16.1 merge SHA |
| 16.6 must merge before 16.1 uses `evidence_submissions` | 16.1 wiring | If 16.1 and 16.6 develop in parallel: 16.1 may use a feature branch; final wiring verified in CST |

### 7.4 — GAP-017 Security Priority Watchpoint

> **⚠️ GAP-017 — `POST /api/ai/request` lacks JWT authentication**:
> This is a **security gap** (unauthenticated AI requests). Sub-wave 16.6 must close this
> with real JWT middleware — not a documentation-only fix.
> IAA will verify at handover that:
> - The fix is implemented as real middleware (not just a code comment)
> - A test asserts 401 on unauthenticated call
> - The JWT validation uses Supabase-standard verification (not a trivially-bypassable custom check)
>
> A partial fix (e.g., "middleware added but not enforced") = REJECTION-PACKAGE under
> CORE-021 Zero-Severity-Tolerance.

### 7.5 — A-021 Pre-IAA Commit Gate (Standing)

> All work must be committed AND pushed before invoking IAA.
> IAA checks git status (clean working tree) and git log (declared files in recent commits).
> Working-tree-only fixes = REJECTION-PACKAGE on CORE-018.

### 7.6 — No CANON_INVENTORY Conflicts (Current State)

No `governance/canon/` files are expected to be modified in any actionable sub-wave.
CORE-006 will PASS trivially for all sub-wave PRs unless a builder introduces unexpected
canon changes — in which case CANON_GOVERNANCE trigger activates.

### 7.7 — No Agent Contract Conflicts (Current State)

No `.github/agents/` files are expected to be modified in any sub-wave.
CORE-017 is NOT APPLICABLE for all sub-wave PRs (confirmed per wave-current-tasks.md scope).
Alert IAA immediately if any builder touches agent contract files.

---

## § 8 — Per Sub-Wave IAA Invocation Plan

Each actionable sub-wave requires **its own IAA invocation** at handover. This pre-brief
covers the wave-level declaration. Sub-wave-specific pre-briefs may be inline (declaring
"requirements satisfied by iaa-prebrief-wave16-full-batch.md §5.X") or as separate files.

| Sub-Wave | IAA Invocation Required? | Token File Path (Expected) |
|----------|--------------------------|---------------------------|
| 16.6 RED gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub06-red-YYYYMMDD.md` |
| 16.6 GREEN gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub06-YYYYMMDD.md` |
| 16.1 RED gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub01-red-YYYYMMDD.md` |
| 16.1 GREEN gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub01-YYYYMMDD.md` |
| 16.8 (doc) | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub08-YYYYMMDD.md` |
| 16.2 RED gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub02-red-YYYYMMDD.md` |
| 16.2 GREEN gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub02-YYYYMMDD.md` |
| 16.7 RED gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub07-red-YYYYMMDD.md` |
| 16.7 GREEN gate | YES | `.agent-admin/assurance/iaa-token-session-NNN-wave16-sub07-YYYYMMDD.md` |
| Wave 16 IBWR | YES — mandatory CWT evidence | `.agent-admin/assurance/iaa-token-session-NNN-wave16-ibwr-YYYYMMDD.md` |

**Cross-PR token reuse is PROHIBITED** (FAIL-ONLY-ONCE A-016). Each sub-wave PR must have
its own dedicated token file.

---

## § 9 — Summary

| Item | Value |
|------|-------|
| Wave | wave16-full-batch |
| Pre-Brief ID | IAA-PREBRIEF-wave16-full-batch-20260310 |
| IAA Triggered | YES — MANDATORY (AAWP_MAT primary; A-032 for 16.6) |
| Adoption Phase | PHASE_B_BLOCKING — Hard gate ACTIVE |
| Actionable sub-waves | 16.1, 16.2, 16.6, 16.7, 16.8 |
| Blocked sub-waves | 16.3, 16.4, 16.5 (AIMC); 16.9 (CS2 decision) |
| IAA invocations required | 10 (2 per sub-wave for RED+GREEN, except 16.8 = 1; plus IBWR) |
| A-032 MANDATORY | Sub-wave 16.6 (scores, audit_scores, evidence_submissions) |
| A-032 WATCHPOINTS | Sub-waves 16.2, 16.7 (activate if INSERT/SELECT on named tables) |
| GAP-017 security priority | Sub-wave 16.6 — JWT auth middleware — hard gate |
| CST required | At 16.1+16.6 convergence (MANDATORY per COMBINED_TESTING_PATTERN.md §4.2) |
| CWT required | Before Wave 16 IBWR (CONSTITUTIONAL — HARD GATE) |
| FCWT | Not applicable this wave |
| Pre-Brief artifact path | `.agent-admin/assurance/iaa-prebrief-wave16-full-batch.md` |
| Prior kick-off pre-brief | `.agent-admin/assurance/iaa-prebrief-wave16.md` (PR #1034) |
| wave-current-tasks.md SHA | 5652df5 |

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*IAA Agent: independent-assurance-agent v6.2.0 | Knowledge v2.7.0*
*LIVING_AGENT_SYSTEM.md v6.2.0 | IAA Adoption Phase: PHASE_B_BLOCKING*
*Pre-Brief mode — no verdict issued. Full assurance at each sub-wave handover.*
