# IAA Pre-Brief Artifact — Wave 15R Implementation (Criteria Parsing Pipeline Remediation)

**Pre-Brief Reference**: `IAA-PREBRIEF-WAVE15R-IMPL-20260308`
**Wave**: wave15r-impl
**Wave Full Name**: Wave 15R Implementation — Criteria Parsing Pipeline Remediation
**Branch**: `copilot/commission-api-ui-qa-builders`
**Issue**: maturion-isms#997 — Wave 15R: Foreman orchestration — commission api-builder, ui-builder, and qa-builder for end-to-end criteria parsing pipeline
**Pre-Brief Invocation Date**: 2026-03-08
**IAA Session**: session-prebrief-wave15r-impl-20260308
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Remediation Context**: INC-WAVE15-PARSE-001 — OPEN

> **Note on wave-current-tasks.md**: The current `wave-current-tasks.md` reflects wave15r-gov (Issue #996).
> It has not yet been updated for this implementation wave. Per prior session learning
> (session-prebrief-wave15r-20260308), a CS2-authored issue body is an acceptable authoritative
> substitute for a stale `wave-current-tasks.md`. Issue #997 (authored by @APGI-cmy) is the
> governing scope document for this pre-brief.

---

## Phase 0 Execution — Pre-Brief Mode Confirmed

**Invocation mode**: PRE-BRIEF (Phase 0 only). Phases 1–4 assurance will NOT be executed this session.
**Trigger**: `[IAA PRE-BRIEF REQUEST]` in invoking comment.
**CS2 Authorisation**: Issue #997 opened directly by @APGI-cmy.

---

## Step 0.3 — Qualifying Task Classification

All tasks in wave15r-impl were evaluated against the IAA Trigger Table v2.1.0.

| Task ID | Task Summary | Trigger Category | IAA Required? |
|---------|-------------|-----------------|--------------|
| T-W15R-API-001 | Verify `invoke-ai-parse-criteria` Edge Function deployed + returns HTTP 200 | AAWP_MAT | YES — MANDATORY |
| T-W15R-API-002 | Confirm `AI_GATEWAY_URL` resolves correctly — env var validation + log evidence | AAWP_MAT | YES — MANDATORY |
| T-W15R-API-003 | End-to-end verification: Edge Function → AI Gateway → DB write-back | AAWP_MAT | YES — MANDATORY |
| T-W15R-API-004 | Fix any stub issues in `apps/mat-ai-gateway/services/parsing.py` | AAWP_MAT (conditional) | YES — MANDATORY if diffs exist |
| T-W15R-IMPL-PLAN | Update `modules/mat/03-implementation-plan/implementation-plan.md` with findings | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-001 | Add uploaded documents list to `CriteriaUpload.tsx` with parse status badge | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-002 | Add per-document "Parse Now" retry button | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-003 | Add inline error log per document (FR-103 full implementation) | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-004 | Connect `useParseStatus` polling hook to real Edge Function status | AAWP_MAT | YES — MANDATORY |
| T-W15R-QA-001 | Write 5 RED→GREEN tests (T-W15R-UX-001 to T-W15R-UX-005) for Wave 15R UX features | AAWP_MAT | YES — MANDATORY |
| T-W15R-QA-002 | Confirm all 14 original Wave 15 tests remain GREEN (regression) | AAWP_MAT | YES — MANDATORY |
| T-W15R-QA-003 | All 5 new Wave 15R tests GREEN after Batch B implementation | AAWP_MAT | YES — MANDATORY |

**Total qualifying tasks**: 12 (all tasks qualify — AAWP_MAT)
**Non-qualifying tasks**: 0

---

## Step 0.4 — IAA Trigger Categories Declared

### Primary Category

**AAWP_MAT** — All tasks in this wave deliver or verify executable MAT application behaviour:
- `supabase/functions/invoke-ai-parse-criteria/` (Edge Function deployment verification)
- `apps/mat-ai-gateway/services/parsing.py` (AI Gateway service)
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` (UI component)
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` (hook wiring)
- `modules/mat/tests/wave15r/` (new test directory)
- `modules/mat/03-implementation-plan/implementation-plan.md` (wave documentation)

### Secondary Category

**None** — No agent contracts, CI/workflow files, or canon files are in scope for this wave.

> **Ambiguity Check**: IAA verified — no `.github/agents/*.md` modifications, no
> `governance/canon/` modifications, no `.github/workflows/` modifications are declared in scope.
> If any builder agent includes such files in their PR diff, this pre-brief must be re-evaluated
> and the trigger category upgraded to MIXED.

**Active trigger**: AAWP_MAT (single category — no mixed category conditions present)

---

## Step 0.5 — FFA Checks IAA Will Run at Handover

### Core Invariants (CORE-001 to CORE-022 — all applied)

Per `iaa-core-invariants-checklist.md` v2.8.0:

| Check ID | Check Name | Relevance for This Wave |
|----------|-----------|------------------------|
| CORE-005 | Governance block present | All PR artifacts |
| CORE-006 | CANON_INVENTORY alignment | PR artifacts |
| CORE-007 | No placeholder content | Production code, hooks, tests — BD-002 companion |
| CORE-013 | IAA invocation evidence | PREHANDOVER must reference this pre-brief token |
| CORE-014 | No class exemption claim | Confirming Foreman/builders did not claim IAA exemption |
| CORE-015 | Session memory present | Each builder agent's session memory must be in PR bundle |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated token file must exist |
| CORE-017 | No unauthorised `.github/agents/` modifications | Verify builders did not touch agent contracts |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER + session memory + iaa_audit_token + token file |
| CORE-019 | IAA token cross-verification | First invocation — token file will be created this session |
| CORE-020 | Zero partial pass rule | All evidence must be complete and verifiable |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE |

> CORE-001 to CORE-004, CORE-008 to CORE-012, CORE-022: Apply to AGENT_CONTRACT category only — not
> applicable for a pure AAWP_MAT PR. IAA will confirm no agent contract artifacts are present; if any
> are found, these checks activate.

### AAWP_MAT BUILD_DELIVERABLE Overlay (BD-001 to BD-024)

Per `iaa-category-overlays.md` v3.1.0 — AAWP_MAT overlay:

**Tier 1 — Delivery Completeness (Blocking)**

| Check ID | Check Name | Wave 15R Specific Focus |
|----------|-----------|------------------------|
| BD-001 | Full scope delivered | All 12 qualifying tasks must appear in the PR diff. INC-WAVE15-PARSE-001 scope: Edge Function deployed, env var set, UI complete, tests GREEN. |
| BD-002 | No stub/TODO in production paths | `parsing.py` shows no stubs on pre-brief scan — confirmed at handover. `CriteriaUpload.tsx` alert() calls and any incomplete hooks must be replaced. |
| BD-003 | One-time build compliance | "If merged and deployed today — does the full parse pipeline work end-to-end?" This is the primary INC-WAVE15-PARSE-001 close condition. |
| BD-004 | No leftover debt | `alert()` calls in CriteriaUpload.tsx noted on pre-brief scan — must be replaced with proper state. |

**Tier 2 — Wiring & Integration Verification (Blocking)**

| Check ID | Check Name | Wave 15R Specific Focus |
|----------|-----------|------------------------|
| BD-005 | End-to-end wiring verified | IAA will trace: CriteriaUpload.tsx → triggerParsing mutate → Edge Function → AI Gateway parsing.py → DB write-back → useParseStatus poll → UI status badge. Every link must exist. |
| BD-006 | Writers and readers confirmed | criteria_documents table: confirmed writer (parsing.py → DB write-back), confirmed reader (useParseStatus hook) — IAA will verify both paths. |
| BD-007 | Auth guards applied | Edge Function must authenticate caller. UI component must be under auth route. |
| BD-008 | FK and relational integrity | N/A for this wave (no new migrations declared in scope). IAA will confirm if api-builder adds migrations. |
| BD-009 | Cross-component integration fit | useParseStatus hook (exists at line 176 of useCriteria.ts) must be correctly wired to CriteriaUpload.tsx. Interface contract between hook and component verified. |
| BD-010 | No orphaned deliverables | wave15r test directory must be consumed by a test runner. All new UI subcomponents must be rendered. |

**Tier 3 — Test Quality & Zero Debt (Blocking)**

| Check ID | Check Name | Wave 15R Specific Focus |
|----------|-----------|------------------------|
| BD-011 | 100% test pass rate | All 19 tests (14 original + 5 new) must PASS. Zero failures. Run output evidence required. |
| BD-012 | Zero test debt | No `.skip()`, `.only()`, `test.todo()` in wave15r tests. |
| BD-013 | No test dodging | RED→GREEN tests must assert on actual Edge Function HTTP 200 + actual DB write-back. Mock-only tests that cannot fail on broken wiring = test dodging. |
| BD-014 | No deprecation accumulation | Verify new test framework or library versions introduced are non-deprecated. |

**Tier 4 — Security Review (Blocking)**

| Check ID | Check Name | Wave 15R Specific Focus |
|----------|-----------|------------------------|
| BD-015 | RLS policies complete | No new tables declared in scope. IAA confirms no new table migrations in diff. |
| BD-016 | No hardcoded secrets | `AI_GATEWAY_URL` must come from env var ONLY — confirmed in existing code. IAA verifies no hardcoded URL strings introduced by any batch. |
| BD-017 | Input validation present | CriteriaUpload retry button must validate file/document reference before invoking Edge Function. |
| BD-018 | No obvious injection vectors | Edge Function URL construction must continue using trusted env var base (existing SSRF mitigation preserved). |
| BD-019 | International standards compliance | FR-103 (error surfacing) is a compliance requirement — inline error log must be user-facing, not console-only. |

**Tier 5 — Code Quality & Architecture Fitness**

| Check ID | Check Name | Wave 15R Specific Focus |
|----------|-----------|------------------------|
| BD-020 | Clean coding structure | CriteriaUpload.tsx must not become a God component. If document list and retry logic significantly bloat it — extraction candidate flagged. |
| BD-021 | International coding best practice | TypeScript strict mode: useParseStatus hook typing, document list typing, status badge types must be explicit. No `any`. |
| BD-022 | Architecture alignment | Implementation must match `modules/mat/02-architecture/system-architecture.md §4` criteria parsing pipeline specification. |
| BD-023 | Technology currency | No deprecated Supabase client methods, no deprecated React patterns. |
| BD-024 | Could it be done better | IAA will apply senior-engineer judgement: if the document list + status badge + retry button warrant a separate `DocumentParseStatus` component, IAA will flag. |

### FFA Summary (issued at handover)

At handover, IAA will produce:

```
FFA Result:
  FFA-01 Delivery Completeness: [PASS|FAIL] — INC-WAVE15-PARSE-001 close condition
  FFA-02 Wiring Verification: [PASS|FAIL] — Full parse pipeline chain traced
  FFA-03 Integration Fit: [PASS|FAIL] — useParseStatus → CriteriaUpload fit
  FFA-04 Security: [PASS|FAIL] — SSRF mitigation preserved, no hardcoded secrets
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL] — Component size, TypeScript strictness
  FFA-06 One-Time Build: [PASS|FAIL] — "Merged today → works in production?" answer
  FFA-CARRY-FORWARD: [NONE|ISSUED] — Any pre-existing broken state outside this wave's scope
```

### CST/CWT/FCWT Obligations (per knowledge/index.md §CST/CWT)

| Gate | Trigger Condition | Mandatory | When |
|------|-----------------|-----------|------|
| **CST Batch A→B** | Batch A closes: Edge Function verified, AI_GATEWAY_URL confirmed, end-to-end wiring confirmed | YES — cross-boundary integration: backend (Edge Function + AI Gateway) integrates with frontend (CriteriaUpload) | Before ui-builder starts Batch B |
| **CST Batch B→C** | Batch B closes: UI features complete (document list, retry button, error log, useParseStatus wired) | YES — frontend integration with verified backend | Before qa-builder starts Batch C |
| **CWT Wave 15R** | All batches complete, all 19 tests GREEN | MANDATORY before IBWR completion | After Batch C QP PASS |

> **IAA CST Mandate**: Per `COMBINED_TESTING_PATTERN.md` §4.2 and knowledge/index.md §CST/CWT Orchestration:
> The Batch A→B transition is a cross-architectural-boundary integration point (backend API service
> integrating with frontend component via hook). A CST checkpoint is warranted before ui-builder starts
> work. Foreman must record CST evidence (QP PASS from Batch A) before commissioning Batch B.
>
> **IAA CWT Mandate**: Per `COMBINED_TESTING_PATTERN.md` §5.2:
> CWT is a constitutional requirement before IBWR completion. No CWT PASS evidence in the IBWR =
> REJECTION-PACKAGE (OVL-AM-CWT-01).

---

## Step 0.6 — PREHANDOVER Proof Structure Required

IAA declares the following mandatory PREHANDOVER proof structure for wave15r-impl.

### Ceremony Model Options

The Foreman must select one of two ceremony models before work begins:

**Option A — Batch-Level PRs (Recommended)**
- Three separate PRs: one per batch (api-builder, ui-builder, qa-builder)
- Each batch has its own PREHANDOVER proof and IAA invocation
- Batch B PR cannot be opened until Batch A ASSURANCE-TOKEN is received
- Batch C PR cannot be opened until Batch B ASSURANCE-TOKEN is received
- Final consolidated PR or wave summary after Batch C ASSURANCE-TOKEN

**Option B — Single Consolidated PR**
- Single PREHANDOVER proof submitted after ALL batches complete
- PREHANDOVER proof must contain QP PASS evidence sections for each batch
- Single IAA invocation at the end covering all three batches
- Foreman must maintain internal QP gates between batches before proceeding

> **IAA Preference Declaration**: Option A is preferred for this wave due to the remediation
> context (INC-WAVE15-PARSE-001). Batch-level isolation ensures that if Batch A (api-builder)
> cannot achieve QP PASS, the wave is halted cleanly rather than producing a large partially-
> complete PR. However, IAA accepts Option B if Foreman declares this choice in the PREHANDOVER.

### Mandatory PREHANDOVER Proof Fields

Regardless of ceremony model, the PREHANDOVER proof MUST contain:

```
## Wave Identification
- wave_slug: wave15r-impl
- issue: maturion-isms#997
- branch: copilot/commission-api-ui-qa-builders
- iaa_prebrief_ref: IAA-PREBRIEF-WAVE15R-IMPL-20260308
- ceremony_model: [OPTION_A_BATCH_LEVEL | OPTION_B_CONSOLIDATED]

## INC-WAVE15-PARSE-001 Closure Declaration
- incident_id: INC-WAVE15-PARSE-001
- closure_status: [CLOSED | OPEN — must be CLOSED at handover]
- closure_evidence:
  - edge_function_deployed: [YES — with deployment log/URL evidence]
  - ai_gateway_url_confirmed: [YES — with log evidence from Edge Function runtime]
  - end_to_end_verified: [YES — with test run or curl evidence]
  - ui_complete: [YES — document list, retry button, error log present in diff]

## Batch A QP Evidence (api-builder)
- T-W15R-API-001: [PASS — with HTTP 200 evidence from deployed Edge Function]
- T-W15R-API-002: [PASS — with log evidence showing AI_GATEWAY_URL resolved]
- T-W15R-API-003: [PASS — with end-to-end trace evidence]
- T-W15R-API-004: [PASS — parsing.py stub issues fixed | N/A — no stubs found]
- T-W15R-IMPL-PLAN: [PASS — implementation-plan.md updated with findings]
- QP_BATCH_A: [PASS | FAIL]

## Batch B QP Evidence (ui-builder) [gate: QP_BATCH_A = PASS required]
- T-W15R-UI-001: [PASS — document list with parse status badge present in diff]
- T-W15R-UI-002: [PASS — per-document "Parse Now" retry button present in diff]
- T-W15R-UI-003: [PASS — inline error log present, alert() removed]
- T-W15R-UI-004: [PASS — useParseStatus hook connected, polling confirmed]
- QP_BATCH_B: [PASS | FAIL]

## Batch C QP Evidence (qa-builder) [gate: QP_BATCH_B = PASS required]
- T-W15R-QA-001: [5 tests written — T-W15R-UX-001 to T-W15R-UX-005]
- T-W15R-QA-002: [14 original Wave 15 tests GREEN — run output attached]
- T-W15R-QA-003: [5 new Wave 15R tests GREEN — run output attached]
- QP_BATCH_C: [PASS | FAIL]

## Test Suite Evidence
- test_run_output: [attached — showing 19 tests PASS, 0 FAIL]
- original_wave15_tests: [14 GREEN — modules/mat/tests/wave15/]
- new_wave15r_tests: [5 GREEN — modules/mat/tests/wave15r/]

## CST Evidence
- cst_batch_a_to_b: [PASS — evidence: <description>]
- cst_batch_b_to_c: [PASS — evidence: <description>]

## CWT Evidence [mandatory before IBWR]
- cwt_status: [PASS | NOT YET RUN — REJECTION-PACKAGE if missing]
- cwt_scope: [all waves through Wave 15R, all MAT modules]

## Session Memory Files
- api-builder session: [file path]
- ui-builder session: [file path]
- qa-builder session: [file path]

## SCOPE_DECLARATION.md Alignment
- scope_declaration_path: SCOPE_DECLARATION.md
- matches_pr_diff: [YES — verified against git diff --name-only origin/main...HEAD]

## Pre-IAA Commit Gate
- all_deliverables_committed: [YES]
- git_status_clean: [YES — no unstaged changes]
- git_log_evidence: [last 3 commits listed]

## IAA Audit Token
- iaa_prebrief_ref: IAA-PREBRIEF-WAVE15R-IMPL-20260308
- iaa_audit_token: IAA-session-wave15r-impl-[YYYYMMDD]-PASS
  [pre-populate with expected format at commit time — per A-029]
```

---

## Step 0.7 — Scope Blockers and Governance Conflicts Visible Now

| # | Blocker | Severity | Rule | Resolution Required |
|---|---------|----------|------|---------------------|
| **B-001** | `wave-current-tasks.md` reflects wave15r-gov, not wave15r-impl | **ADVISORY** | A-026 modified | Issue #997 (CS2-authored) is the governing scope document. Foreman must update `wave-current-tasks.md` to wave15r-impl BEFORE committing the PREHANDOVER proof. Non-blocking for now; blocking if stale at IAA invocation. |
| **B-002** | INC-WAVE15-PARSE-001 is OPEN — Edge Function was never deployed to production | **HARD** | BD-001, BD-003 | api-builder must provide deployment evidence: Edge Function must be deployed AND return HTTP 200 for a valid test input. Code-only evidence (the function exists in `supabase/functions/`) is insufficient — T-W15R-API-001 requires live deployment confirmation. |
| **B-003** | `AI_GATEWAY_URL` env var not set in production runtime | **HARD** | BD-005, BD-016 | api-builder must confirm the env var is set in the Supabase Edge Function runtime AND provide log evidence of it being read correctly (T-W15R-API-002). Config-file-only evidence is insufficient — runtime log evidence required. |
| **B-004** | `CriteriaUpload.tsx` uses `alert()` for success feedback | **HARD** (BD-002/BD-004) | BD-002, BD-004 | This is leftover Wave 15 debt visible in the codebase now. `alert()` calls must be replaced with proper React state. This is within scope of T-W15R-UI-003 (FR-103 full implementation). ui-builder must address. |
| **B-005** | `modules/mat/tests/wave15r/` does not exist | **EXPECTED** | BD-001 | qa-builder must create this directory. Not a blocker — it's part of the scope. Confirming IAA will verify this directory exists and contains exactly 5 tests at handover. |
| **B-006** | `parsing.py` (340 lines, full implementation) — no stubs found on pre-brief scan | **INFORMATIONAL** | T-W15R-API-004 scope | api-builder should verify T-W15R-API-004 is a no-op (no stub issues found). If no diff is produced for `parsing.py`, api-builder must explicitly document this in the PREHANDOVER ("T-W15R-API-004: N/A — no stubs found in parsing.py on inspection"). An empty diff without explanation is not acceptable. |
| **B-007** | Batch gating model not yet declared by Foreman | **ADVISORY** | PREHANDOVER model | Foreman must declare Option A (batch-level PRs) or Option B (consolidated PR) before commissioning api-builder. Ambiguity in the ceremony model = ambiguity in when IAA is invoked = governance gap. |
| **B-008** | No CWT evidence exists for Wave 15R (wave not yet started) | **EXPECTED** | OVL-AM-CWT-01 | CWT is a wave-completion requirement. This is expected at pre-brief — CWT will be commissioned after Batch C QP PASS. Confirming IAA will hard-fail IBWR if CWT PASS evidence is absent. |

---

## Step 0.8 — Pre-Brief Summary Table

| Field | Value |
|-------|-------|
| Wave | wave15r-impl |
| Issue | maturion-isms#997 |
| Branch | copilot/commission-api-ui-qa-builders |
| Pre-Brief Ref | IAA-PREBRIEF-WAVE15R-IMPL-20260308 |
| Qualifying Tasks | 12 (all tasks qualify) |
| Trigger Category | AAWP_MAT (single category) |
| Core Checks at Handover | CORE-001 to CORE-022 (CORE-001–004, 008–012, 022 activate only if AGENT_CONTRACT artifacts present) |
| Overlay Checks at Handover | BD-001 to BD-024 (AAWP_MAT BUILD_DELIVERABLE) + FFA Summary |
| CST Gates Declared | 2 (Batch A→B, Batch B→C) |
| CWT Obligation | MANDATORY — before IBWR |
| Hard Blockers | B-002 (Edge Function deployment), B-003 (AI_GATEWAY_URL runtime evidence), B-004 (alert() removal) |
| Advisory Items | B-001 (wave-current-tasks.md), B-007 (ceremony model declaration) |
| Adoption Phase | PHASE_B_BLOCKING — hard gate ACTIVE |

---

## Pre-Brief Completion Confirmation

✅ Phase 0 Step 0.1 — Pre-Brief invocation confirmed  
✅ Phase 0 Step 0.2 — Issue #997 read (CS2-authored authoritative scope)  
✅ Phase 0 Step 0.3 — All 12 qualifying tasks classified  
✅ Phase 0 Step 0.4 — Pre-Brief artifact generated  
⏳ Phase 0 Step 0.5 — Artifact to be committed (this session)  
⏳ Phase 0 Step 0.6 — Reply to confirming comment (pending commit)

**Phases 1–4 assurance**: NOT executed this session. Pre-Brief only.
**Next IAA invocation**: At PREHANDOVER handover — triggered by Foreman after all batches complete and PREHANDOVER proof committed.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | Contract: 2.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
