# IAA Wave Record — PIT Stage 9 Gate-Pass + Stage 10 Initiation

**Wave ID**: pit-stage9-gate-pass-stage10-initiate-20260519
**Date**: 2026-05-19
**Branch**: copilot/stage-9-gate-pass-checklist
**Issue**: maturion-isms#1687
**PR**: #1689
**IAA Version**: 6.2.0 / Contract 2.10.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**STOP-AND-FIX**: ACTIVE

---

IAA_PREFLIGHT_BRIEF
PR: #1689
ISSUE: #1687
WAVE: pit-stage9-gate-pass-stage10-initiate-20260519
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD

EXPECTED_QA_SCOPE:
- modules/pit/BUILD_PROGRESS_TRACKER.md
- modules/pit/09-builder-checklist/stage9-gate-pass-review.md
- modules/pit/10-iaa-pre-brief/iaa-pre-brief.md
- .admin/prs/pr-1689.json
- .agent-admin/scope-declarations/pr-1689.md
- .agent-admin/assurance/iaa-wave-record-pit-stage9-gate-pass-stage10-initiate-20260519.md
- .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-pit-stage9-gate-pass-stage10-initiate-20260519.md
- .agent-workspace/execution-ceremony-admin-agent/bundles/session-pit-stage9-gate-pass-stage10-initiate-20260519.md
- .agent-workspace/foreman-v2/memory/PREHANDOVER-session-pit-stage9-gate-pass-stage10-initiate-20260519.md
- .agent-workspace/foreman-v2/memory/session-pit-stage9-gate-pass-stage10-initiate-20260519.md
- .agent-workspace/foreman-v2/parking-station/suggestions-log.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md

EXPECTED_FAILURE_MODES:
- Stage 9 gate-pass not evidenced before Stage 10 initiated (OVL-PBG-008, OVL-PBG-013)
- Issue number inconsistency across admin artifacts (A-026, A-028)
- Scope declaration file count mismatch vs actual diff (A-026)
- PREHANDOVER iaa_audit_token set to PENDING instead of pr-reference format (A-029)
- IAA pre-brief claims IAA acceptance (prohibited — OVL-PBG-004)
- Build Authorization cleared prematurely (Stage 9 non-goals clause)
- Builder appointment implied before Stage 11 (POLC breach)

FOREMAN_INSTRUCTIONS:
- Ensure all 12 changed files are listed in scope declaration and pr-1689.json scope array.
- Confirm PREHANDOVER iaa_audit_token uses pr-reference format (not PENDING).
- Do not claim IAA acceptance in Stage 10 pre-brief.
- Stage 11 and Stage 12 must remain NOT_STARTED in all artifacts.
- Build Authorization must remain NOT CLEARED in all artifacts.
- All artifacts must be committed and pushed before IAA final invocation (A-021).

IAA_WILL_QA:
- Active preflight brief structure, PR binding (#1689), and current-head relevance.
- Stage 9 gate-pass evidence present before Stage 10 initiated (OVL-PBG-008, OVL-PBG-013).
- Scope declaration matches diff exactly — all 12 files declared (A-026, A-028).
- Build Authorization remains NOT CLEARED throughout all artifacts.
- No builder appointment, implementation start, or FUNCTIONAL_PASS claim in any artifact.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

**Triggered by**: CS2 / @APGI-cmy via Foreman PRE-BRIEF request — Phase 0 IAA contract
**IAA Pre-Brief Mode**: ACTIVE — Phase 1–4 assurance NOT executed in this artifact
**Date issued**: 2026-05-19
**IAA Version**: 6.2.0 / Contract 2.10.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

### Step 0.2 — Qualifying Tasks (from wave-current-tasks.md)

All 7 wave tasks qualify under trigger category **PRE_BUILD_STAGE_MODEL**:

| # | Task | Category Trigger |
|---|------|-----------------|
| 1 | Review Stage 9 builder-checklist.md against gate-pass requirements | PRE_BUILD_STAGE_MODEL — Stage 9 Builder Checklist (OVL-PBG-013) |
| 2 | Gate-pass Stage 9 + tick Stage 9 tracker guardrails | PRE_BUILD_STAGE_MODEL — BUILD_PROGRESS_TRACKER.md advance |
| 3 | Create Stage 9 gate-pass review artifact | PRE_BUILD_STAGE_MODEL — pre-build stage governance artifact |
| 4 | Create Stage 10 IAA Pre-Brief artifact | PRE_BUILD_STAGE_MODEL — Stage 10 initiation (OVL-PBG-004) |
| 5 | Update Stage 10 status to ACTIVE — INITIATED in tracker | PRE_BUILD_STAGE_MODEL — BUILD_PROGRESS_TRACKER.md advance |
| 6 | Create PR admin JSON and scope declaration for PR #1689 | Ceremony artifact (A-021, A-026, A-028) |
| 7 | IAA Final Assurance invocation and token ceremony | IAA Ceremony (A-001, A-029) |

### Applicable Overlay

**Primary**: `PRE_BUILD_STAGE_MODEL` — OVL-PBG-001 through OVL-PBG-019 + OVL-PBG-ADM-001 apply at assurance time.
**Supplemental**: `GOVERNANCE_EVIDENCE` overlay (OVL-GE-001–004) applies to any evidence claims in gate-pass review artifact.
**No ECAP/Ceremony overlay** (ACR-01–16) unless `ceremony_admin_appointed` changes from PENDING to YES before final assurance.

### Anti-Regression Obligations

| Rule | Applies? | Description |
|------|----------|-------------|
| A-001 | YES | IAA invocation evidence must be present in PR artifacts |
| A-021 | YES | All artifacts must be committed and pushed before IAA final invocation |
| A-026 | YES | SCOPE_DECLARATION must match actual `git diff` exactly |
| A-028 | YES | SCOPE_DECLARATION must use list format; prior-wave entries trimmed |
| A-029 | YES | PREHANDOVER proof `iaa_audit_token` must use pr-reference format (not `PENDING`) |
| A-031 | CONDITIONAL | If IAA ceremony artifacts appear in diff, A-031 carve-out must be documented in SCOPE_DECLARATION |
| A-036 | YES | No future-dated factual completion claims in any artifact |
| A-037 | YES | Evidence-type discipline — no static code cited for operational/deployment facts |
| OVL-PBG-009 | ADVISORY | Directory numbering audit: `09-iaa-pre-brief/` exists but issue requires `10-iaa-pre-brief/` — flag as structural note |
| NBR-001–005 | NO | Not applicable — docs-only wave, no runtime code changes |

---

### IAA_PREFLIGHT_BRIEF

```
PR: #1689
ISSUE: See NOTE below — issue number discrepancy flagged
WAVE: pit-stage9-gate-pass-stage10-initiate-20260519
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
TRIGGER_CATEGORY: PRE_BUILD_STAGE_MODEL
OVERLAY: OVL-PBG-001 through OVL-PBG-019, OVL-PBG-ADM-001
ECAP_REQUIRED: NO (ceremony_admin_appointed: PENDING — governance-only wave)
ANTI_REGRESSION: A-001, A-021, A-026, A-028, A-029, A-031 (conditional), A-036, A-037
```

**⚠️ ISSUE NUMBER DISCREPANCY — FOREMAN MUST RESOLVE BEFORE FINAL ASSURANCE**:
Wave-current-tasks.md declares `Issue: #1681`. GitHub issue #1681 is titled "Record RED and align MMM pre-build artifacts for 5-domain framework configuration workspace" (MMM module — unrelated to PIT). The PR body content correctly describes PIT Stage 9/10 work and internally references issue maturion-isms#1679. Foreman must confirm the authoritative governing issue number for PR #1689, correct it in wave-current-tasks.md if needed, and ensure all admin artifacts (pr-1689.json, scope-declarations/pr-1689.md, PREHANDOVER proof) are keyed to the correct issue number.

---

#### EXPECTED_QA_SCOPE

Files IAA expects to be present and committed when final assurance is invoked:

```
modules/pit/BUILD_PROGRESS_TRACKER.md                        (Stage 9 GATE_PASSED + Stage 10 ACTIVE)
modules/pit/09-builder-checklist/builder-checklist.md        (existing — may be confirmed as-is)
modules/pit/09-builder-checklist/stage9-gate-pass-review.md  (NEW — gate-pass review artifact)
modules/pit/10-iaa-pre-brief/iaa-pre-brief.md               (NEW — Stage 10 IAA Pre-Brief; see PATH NOTE)
.admin/prs/pr-1689.json                                      (PR admin manifest)
.agent-admin/scope-declarations/pr-1689.md                   (scope declaration — must match diff)
.agent-admin/assurance/iaa-wave-record-pit-stage9-gate-pass-stage10-initiate-20260519.md (this file)
.agent-workspace/foreman-v2/memory/PREHANDOVER-session-pit-stage9-gate-pass-stage10-initiate-20260519.md
.agent-workspace/foreman-v2/memory/session-pit-stage9-gate-pass-stage10-initiate-20260519.md
```

**⚠️ PATH NOTE — `10-iaa-pre-brief/` vs `09-iaa-pre-brief/`**: The PIT module directory currently contains `modules/pit/09-iaa-pre-brief/` (existing, apparently empty). The issue and BUILD_PROGRESS_TRACKER declare Stage 10 as IAA Pre-Brief and the expected artifact path as `modules/pit/10-iaa-pre-brief/iaa-pre-brief.md`. Foreman must resolve this before creating the artifact:
- Option A: Create at `modules/pit/10-iaa-pre-brief/iaa-pre-brief.md` as the issue requires (preferred — aligned with tracker stage numbers)
- Option B: If `09-iaa-pre-brief/` is the canonical location, update the tracker and issue reference to match
- IAA will flag OVL-PBG-009 (legacy directory numbering) as an advisory finding at assurance time regardless — this is expected and non-blocking provided the chosen path is consistent across all artifacts.

---

#### EXPECTED_FAILURE_MODES

Ranked by likelihood, these are the patterns IAA will specifically examine:

| # | Failure Mode | Root Cause | FAIL-ONLY-ONCE Ref |
|---|-------------|------------|-------------------|
| FM-01 | Stage 10 initiated without Stage 9 gate-pass being fully evidenced | Builder checklist not checked against all 19 gate criteria listed in issue before tracker advance | OVL-PBG-008, OVL-PBG-013 |
| FM-02 | `iaa-pre-brief.md` path inconsistent (created in `09-iaa-pre-brief/` vs required `10-iaa-pre-brief/`) | Directory naming legacy mismatch | OVL-PBG-009 (advisory) |
| FM-03 | Issue number discrepancy not resolved (PR admin artifacts keyed to #1681 MMM issue) | Wave-current-tasks.md has incorrect issue reference | A-026, A-028 |
| FM-04 | Stage 10 IAA Pre-Brief claims IAA has accepted/approved the package | Pre-brief written as if IAA response already received | OVL-PBG-004 — IAA Pre-Brief must NOT claim IAA acceptance unless IAA response artifact is actually filed |
| FM-05 | Build Authorization inadvertently changed from NOT CLEARED | Governance slip in tracker update | Stage 9 non-goals clause |
| FM-06 | Builder appointment implied or builder candidate named | Stage 9 gate-pass creates false builder appointment impression | OVL-PBG-013 — builder appointment is Stage 11 only |
| FM-07 | FUNCTIONAL_PASS or GREEN test claim introduced | Agent claims tests pass without evidence | A-037, OVL-GE-003 |
| FM-08 | PREHANDOVER proof missing or incomplete ceremony | Foreman delivers without PREHANDOVER proof | A-015 |
| FM-09 | Scope declaration doesn't match actual diff | Files committed but not declared, or declared but not committed | A-021, A-026 |
| FM-10 | Future-dated completion claims in stage9-gate-pass-review.md | Review artifact written with future date or prospective language presented as past | A-036 |
| FM-11 | `iaa_audit_token` in PREHANDOVER set to `PENDING` instead of pr-reference format | Old pattern (replaced by A-029) | A-029 |
| FM-12 | Stage 10 pre-brief missing required sections (< 7 of 7 from issue requirements) | Incomplete pre-brief: missing known-delivery-risks, IAA challenge questions, etc. | OVL-PBG-004, PRE_BRIEF_ASSURANCE overlay (OVL-INJ-ADM-003) |
| FM-13 | Stage 11 or Stage 12 status altered | Scope creep — should remain NOT_STARTED | Hard boundary per issue |
| FM-14 | Duplicate directory artifacts (`08-builder-checklist/` alongside `09-builder-checklist/`) cause path confusion | Legacy migration artefact | OVL-PBG-009 advisory |

---

#### FOREMAN_INSTRUCTIONS

1. **Resolve issue number discrepancy first**: Confirm governing issue number for PR #1689. If it is NOT #1681 (MMM), correct wave-current-tasks.md and all admin artifacts before final assurance. Issue #1681 is an MMM artifact — it must not bind PIT governance records.

2. **Stage 9 gate-pass sequence**:
   a. Review `modules/pit/09-builder-checklist/builder-checklist.md` against ALL 19 gate-pass criteria listed in the PR body (issue requirements section "Stage 9 gate-pass review requirements").
   b. Create `modules/pit/09-builder-checklist/stage9-gate-pass-review.md` — record each criterion, evidence found, PASS/FAIL verdict, and review authority.
   c. Only if ALL 19 criteria PASS: update `modules/pit/BUILD_PROGRESS_TRACKER.md` Stage 9 status to `GATE_PASSED — BUILDER_CHECKLIST_COMPLETE_AND_APPROVED`.
   d. Explicitly state in the tracker and review artifact that Stage 9 gate-pass does NOT appoint a builder, does NOT clear Build Authorization, does NOT claim FUNCTIONAL_PASS.

3. **Stage 10 initiation (only after Stage 9 gate-pass)**:
   a. Create `modules/pit/10-iaa-pre-brief/iaa-pre-brief.md` (preferred path per tracker alignment).
   b. Stage 10 pre-brief MUST include all 7 required sections from the issue: (1) Stage 1–9 artifact pack references, (2) known delivery risks, (3) visual/rendering risk controls, (4) route/auth/onboarding risk controls, (5) denied-path risk controls, (6) live deployment/PBFAG evidence expectations, (7) IAA challenge questions.
   c. Stage 10 pre-brief MUST NOT claim IAA has accepted/approved — it is Foreman's initiation document only. IAA's response is a separate artifact.
   d. Update tracker: Stage 10 = `ACTIVE — INITIATED`. Stage 11 and Stage 12 remain `NOT_STARTED`. Build Authorization remains `NOT CLEARED`.

4. **Directory naming**: If creating `10-iaa-pre-brief/` directory, ensure it is consistent with tracker references. Document the `09-iaa-pre-brief/` legacy directory as a structural note. Do NOT delete `09-iaa-pre-brief/` without CS2 approval.

5. **Ceremony artifacts**:
   - PREHANDOVER proof: use pr-reference format for `iaa_audit_token` (not `PENDING`) per A-029.
   - Scope declaration: list-format, exact match to diff, A-031 carve-out note if IAA wave-record appears in diff.
   - PR admin: `pr-1689.json` keyed to correct issue number and this wave ID.

6. **Commit before invoking IAA**: All artifacts committed and pushed (CI run initiated) before calling IAA for final assurance per A-021. Partial/working-tree state = A-021 FAIL.

7. **Hard boundaries** — Foreman must not in any artifact:
   - Start build execution
   - Appoint a builder
   - Start Stage 11 or Stage 12
   - Clear Build Authorization
   - Claim FUNCTIONAL_PASS
   - Claim tests are GREEN
   - Claim live deployed evidence exists
   - Modify runtime/source code
   - Create database migrations
   - Create deployment config
   - Install or activate GitHub workflows

---

#### ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS

```
ECAP_REQUIRED: NO
CEREMONY_ADMIN_APPOINTED: PENDING (governance-only wave; appointment deferred to handover phase only)
ACR_CHECKS_01_16: NOT APPLICABLE at this time
```

Expected ceremony artifacts (standard governance):
- `PREHANDOVER-session-pit-stage9-gate-pass-stage10-initiate-20260519.md`
- `session-pit-stage9-gate-pass-stage10-initiate-20260519.md`

If `ceremony_admin_appointed` changes to YES before final assurance, ACR-01 through ACR-16 will activate. Notify IAA.

---

#### CURRENT_HEAD_CI_EXPECTATIONS

```
BRANCH: copilot/stage-9-gate-pass-checklist
CURRENT_HEAD_SHA: db1d298fa52b6466bc36c4ab1cc8bc0e3a74f68f (Initial plan — 0 file changes)
CI_EXPECTATIONS: Docs-only wave — no TypeScript compile, no test suite required
```

Since this is a docs/governance-only wave:
- CI must reach a stable state (no failing checks that would block merge) before IAA invocation
- No TypeScript compile failures expected (no `.ts` files changed)
- No test suite runs expected (no test files changed)
- Any existing lint/format checks on `.md` files must pass
- IAA will verify CI status at `merge_gate_parity` step (Phase 4 Step 4.1) at final assurance

---

#### POLC_AND_BUILDER_DELEGATION_EXPECTATIONS

```
POLC_STATUS: Foreman is POLC supervisor — no builder delegated, no builder appointed
BUILDER_DELEGATION: NOT IN SCOPE for this wave
BUILD_AUTHORIZATION: NOT CLEARED — must remain NOT CLEARED in ALL artifacts
STAGE_11_BUILDER_APPOINTMENT: NOT_STARTED — must not be advanced by this wave
STAGE_12_BUILD: NOT_STARTED — must not be advanced by this wave
```

Key POLC obligations:
- Stage 9 gate-pass is Foreman authority. It confirms the checklist artifact is complete and binding for future candidates. It does NOT appoint any specific builder.
- Stage 10 initiation is Foreman authority. It prepares the pre-brief context for IAA challenge. It does NOT constitute IAA acceptance.
- Stage 11 (Builder Appointment) requires explicit CS2 authorization and IAA ASSURANCE-TOKEN for the full pre-build package. It must NOT begin in this wave.
- Any artifact that names a specific builder candidate, implies appointment, or frames Stage 11 as in-progress = POLC breach.

---

#### IAA_WILL_QA

At final assurance (Phase 3 PRE_BUILD_STAGE_MODEL overlay), IAA will execute:

**OVL-PBG-001–002**: Module manifest slug and tracker identity consistency  
**OVL-PBG-006**: BUILD_PROGRESS_TRACKER uses full 12-stage model  
**OVL-PBG-008**: Stage gating respected — Stage 9 gate-pass evidence present before Stage 10 initiated  
**OVL-PBG-009**: Directory numbering audit — `09-iaa-pre-brief/` vs `10-iaa-pre-brief/` flagged as advisory  
**OVL-PBG-013**: Builder Checklist gate criteria all satisfied before Stage 9 advances  
**OVL-PBG-004**: IAA Pre-Brief artifact exists at declared path, content covers all 7 sections  
**OVL-INJ-ADM-003**: Stage-readiness view declared in IAA pre-brief (Stages 1–9 completeness)  
**CORE-020**: Zero partial pass — no assumed passes on any check  
**CORE-021**: Zero severity tolerance — any finding = REJECTION-PACKAGE  
**A-001**: IAA invocation evidence present in PR artifacts  
**A-021**: All artifacts committed and pushed before IAA invocation  
**A-026/A-028**: Scope declaration matches diff exactly, list format, trimmed  
**A-029**: PREHANDOVER `iaa_audit_token` uses pr-reference format  
**A-031**: A-031 carve-out noted if IAA wave-record in diff  
**A-036**: No future-dated factual claims in any artifact  
**Hard boundary verification**: No builder appointment, no implementation start, no Build Authorization change, no FUNCTIONAL_PASS claim in any artifact  
**Issue number consistency**: All admin artifacts keyed to the same correct governing issue number  
**Stage 10 pre-brief acknowledgement posture**: Pre-brief MUST NOT claim IAA acceptance unless IAA response artifact filed  

---

#### STAGE-READINESS VIEW (Stages 1–9 Pre-Brief Assessment)

Based on current `modules/pit/BUILD_PROGRESS_TRACKER.md` (verified on branch `copilot/stage-9-gate-pass-checklist`):

| Stage | Name | Tracker Status | IAA Pre-Brief Assessment |
|-------|------|---------------|--------------------------|
| Stage 1 | App Description | CS2_APPROVED_AUTHORITATIVE (2026-05-06) | ✅ COMPLETE |
| Stage 2 | UX Workflow & Wiring Spec | CS2_APPROVED_RECONFIRMED | ✅ COMPLETE |
| Stage 3 | FRS | DRAFT_HARDENED_CS2_RECONFIRMED | ✅ COMPLETE (baseline locked) |
| Stage 4 | TRS | CS2 Stage 4 approved (tracker header) | ✅ COMPLETE |
| Stage 5 | Architecture | GATE_PASSED (Foreman/CS2) | ✅ COMPLETE |
| Stage 6 | QA-to-Red | GATE_PASSED (Foreman/CS2) | ✅ COMPLETE |
| Stage 7 | PBFAG | GATE_PASSED — PBFAG_COMPLETE_AND_APPROVED | ✅ COMPLETE |
| Stage 8 | Implementation Plan | GATE_PASSED — IMPLEMENTATION_PLAN_COMPLETE_AND_APPROVED (2026-05-19) | ✅ COMPLETE |
| Stage 9 | Builder Checklist | ACTIVE — INITIATED (builder-checklist.md exists) | 🟡 IN PROGRESS — gate-pass pending this wave |
| Stage 10 | IAA Pre-Brief | NOT_STARTED | ⬜ NOT STARTED — initiation pending Stage 9 gate-pass |
| Stage 11 | Builder Appointment | NOT_STARTED | 🔴 BLOCKED — must not start; Build Authorization NOT CLEARED |
| Stage 12 | Build | NOT_STARTED | 🔴 BLOCKED — must not start |

**Blockers preventing Stage 11 builder appointment** (all required before Stage 11):
1. Stage 9 gate-pass not yet recorded
2. Stage 10 IAA Pre-Brief not yet filed
3. IAA ASSURANCE-TOKEN for full pre-build package not yet issued
4. CS2 explicit Build Authorization not yet granted

---

#### RESULT: PREFLIGHT_BRIEF_COMPLETE

```
QUALIFYING_TASKS: 7 (all under PRE_BUILD_STAGE_MODEL)
APPLICABLE_OVERLAY: PRE_BUILD_STAGE_MODEL (OVL-PBG-001–019, OVL-PBG-ADM-001)
ANTI_REGRESSION_OBLIGATIONS: YES — A-001, A-021, A-026, A-028, A-029, A-031 (conditional), A-036, A-037, OVL-PBG-009 (advisory)
ECAP_REQUIRED: NO (ceremony_admin_appointed: PENDING)
ISSUE_DISCREPANCY_FLAG: YES — wave-current-tasks.md issue #1681 is MMM not PIT; Foreman must resolve before final assurance
PATH_DISCREPANCY_FLAG: YES — 09-iaa-pre-brief/ exists; 10-iaa-pre-brief/ expected per tracker; Foreman must resolve
PREFLIGHT_BRIEF_COMPLETE: YES
PRE_BRIEF_SHA: to be populated on commit
```

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: PENDING — REJECTION-PACKAGE issued; token withheld pending fix and re-invocation

---

## REJECTION_HISTORY

### Entry 1 — 2026-05-19

**IAA Session**: IAA-session-pit-stage9-gate-pass-stage10-initiate-20260519-REJECTED-20260519
**Date**: 2026-05-19
**PR**: #1689
**Wave**: pit-stage9-gate-pass-stage10-initiate-20260519

**Finding**: ACR-03 AUTO-REJECT — Issue number inconsistency in ceremony artifact.
`wave-current-tasks.md` contains stale `#1681` (MMM — unrelated module) references in:
- Task 1 description: `"issue #1681 checklist items"` (should be `#1687`)
- Wave Completion Gate row 1: `"(maturion-isms#1681)"` (should be `#1687`)
- Wave Completion Gate row 2: `"(maturion-isms#1681)"` (should be `#1687`)
Pre-brief FM-03 explicitly flagged this and instructed Foreman to resolve before IAA invocation. Not resolved at final assurance time.

**Fix required**:
1. Update `wave-current-tasks.md` Task 1 description: `#1681` → `#1687`
2. Update Wave Completion Gate row 1: `(maturion-isms#1681)` → `(maturion-isms#1687)`
3. Update Wave Completion Gate row 2: `(maturion-isms#1681)` → `(maturion-isms#1687)`
4. Commit fix, confirm git status clean, re-invoke IAA final assurance.

**Classification**: Ceremony → Systemic (recurring copy-paste from prior wave; prior wave task descriptions carried into new wave-current-tasks.md without issue number update)
**Prevention**: wave-current-tasks.md template hardening — add explicit `governing_issue:` metadata field separate from task description text to prevent stale carry-forward.

**HANDOVER_ALLOWED**: no
**RESULT**: REJECTED_BACK_TO_PRODUCER

