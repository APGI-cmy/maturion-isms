# IAA Wave Record — PIT Stage 11 Builder Appointment

**Wave ID**: pit-stage11-builder-appointment
**Date**: 2026-05-21
**Branch**: copilot/execute-pit-stage-11-appointment
**Issue**: #1729 — Foreman: Execute PIT Stage 11 builder appointment with readiness proof and authorization boundary
**PR**: #1730
**IAA Version**: 6.2.0 / Contract 2.10.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**STOP-AND-FIX**: ACTIVE
**Current HEAD SHA (pre-brief time)**: 7a63bafba10d3bd37cf12e2d75fd47ea91050767

---

IAA_PREFLIGHT_BRIEF
PR: #1730
ISSUE: #1729
WAVE: pit-stage11-builder-appointment
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA

EXPECTED_QA_SCOPE:
- `modules/pit/11-builder-appointment/stage11-builder-appointment.md` (NEW — formal appointment artifact)
- `modules/pit/11-builder-appointment/builder-readiness-proof-pack.md` (UPDATED — concrete execution evidence tables)
- `modules/pit/11-builder-appointment/stage8-hardening-acknowledgement.md` (UPDATED — all 8 artifacts acknowledged with execution use statements)
- `modules/pit/11-builder-appointment/stage11-appointment-preconditions.md` (UPDATED — TBD references replaced with actual evidence paths)
- `modules/pit/BUILD_PROGRESS_TRACKER.md` (UPDATED — Stage 11 appointment recorded)
- `.agent-admin/assurance/iaa-wave-record-pit-stage11-builder-appointment-20260521.md` (this file)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (UPDATED)
- `.admin/prs/pr-1730.json` (NEW)
- `.agent-admin/scope-declarations/pr-1730.md` (NEW)

EXPECTED_FAILURE_MODES:
- Stage 11 appointment artifact overclaims BUILD execution authority
- Build Authorization claimed as CLEARED without explicit CS2 clearance reference
- Stage 12 started or implied by any artifact
- Readiness proof pack tables left with placeholder text instead of concrete execution evidence
- Stage 8 hardening acknowledgements contain acknowledgement-only rows (no execution use/proof statements)
- Builder appointment names a candidate not backed by concrete evidence
- GREEN test claims, live deployed evidence claims, or FUNCTIONAL_PASS claims introduced
- Tracker records Stage 11 as gate-passed before all Stage 11 appointment evidence is complete

FOREMAN_INSTRUCTIONS:
- Keep this wave docs/governance/appointment evidence only
- Keep Stage 12 NOT_STARTED
- Keep Build Authorization NOT CLEARED (Build Authorization clearance is a separate CS2-gated step)
- Appointed builder must be pit-specialist (PIT domain specialist per specialist-registry.md)
- Proof pack must contain concrete execution evidence tables — not placeholders
- Stage 8 hardening ack must name artifacts by exact path with execution use statements
- All precondition TBD references must be replaced with actual evidence paths from this wave
- Tracker update must record appointment posture and explicit NOT CLEARED build authorization

ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS:
- ECAP_REQUIRED: NO (docs/governance-only appointment wave)
- ECAP_EXPECTED_ARTIFACTS: none unless protected governance paths expand

CURRENT_HEAD_CI_EXPECTATIONS:
- Preflight evidence/admin parity gates must see active wave-record + wave-current-tasks binding for PR #1730
- Scope declaration parity must match exact changed-file set
- Stage posture checks must preserve Stage 12 NOT_STARTED and Build Authorization NOT CLEARED
- IAA final assurance: NOT_REQUIRED (docs/governance-only PR scope; no implementation/runtime diff)

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- POLC mode: Stage 11 appointment governance execution
- pit-specialist is builder candidate — provides execution readiness evidence
- Foreman creates formal appointment artifact after reviewing pit-specialist evidence
- No build execution claim
- No Build Authorization clearance claim

IAA_WILL_QA:
- Stage 11 appointment artifact names appointed builder, records appointment authority, references issue/PR, confirms Stage 11 is not Stage 12
- Builder readiness proof pack contains concrete (not placeholder) execution evidence in all required tables
- Stage 8 hardening acknowledgement contains non-trivial execution use statements for all 8 artifacts
- Preconditions document references actual evidence paths (no TBD)
- Tracker correctly records Stage 11 appointment outcome with Build Authorization status preserved as NOT CLEARED
- No runtime code, test code, migration, deployment config, CI, GREEN claim, live evidence, or FUNCTIONAL_PASS claim introduced

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

**Triggered by**: Foreman PRE-BRIEF request (Phase 1 Step 1.8) — IAA-authored pre-brief v2 (2026-05-21)
**Action**: PRE-BRIEF
**IAA Pre-Brief Mode**: ACTIVE — Phase 1–4 assurance NOT executed in this artifact
**IAA Preflight Version**: 6.2.0 / Contract 2.10.0
**Current HEAD SHA at pre-brief time**: 7a63bafba10d3bd37cf12e2d75fd47ea91050767

---

### Qualifying Tasks

Qualifying tasks: PIT Stage 11 — formal builder appointment; fill all builder readiness proof pack execution tables; fill all Stage 8 hardening acknowledgement rows with concrete execution use statements; replace all preconditions TBD references with actual evidence paths; update BUILD_PROGRESS_TRACKER.md to record Stage 11 GATE_PASSED — BUILDER_APPOINTED with Build Authorization preserved as NOT CLEARED.

### PR Category Classification (Trigger Table §Step 8)

```
TRIGGER: modules/pit/BUILD_PROGRESS_TRACKER.md modified → PRE_BUILD_STAGE_MODEL
TRIGGER: modules/pit/11-builder-appointment/ artifacts created/modified → PRE_BUILD_STAGE_MODEL
TRIGGER: .agent-workspace/foreman-v2/personal/wave-current-tasks.md → governed workspace
CLASSIFICATION: PRE_BUILD_STAGE_MODEL — IAA MANDATORY
FINAL_ASSURANCE_REQUIRED: YES ⚠️
```

> **⚠️ CORRECTION TO WAVE RECORD v1 (foreman pre-population)**:
> The initial wave record (foreman-generated at template time) declared `FINAL_ASSURANCE_REQUIRED: NO`.
> This is incorrect. The trigger table §Step 8 is unambiguous: any PR that modifies
> `modules/*/BUILD_PROGRESS_TRACKER.md` or files that define or advance a module's pre-build
> lifecycle stage = `PRE_BUILD_STAGE_MODEL` → IAA MANDATORY.
> This is a governance-only wave, but the PRE_BUILD_STAGE_MODEL trigger activates IAA for
> all PRs advancing stage posture, regardless of runtime code presence.
> **FINAL_ASSURANCE_REQUIRED: YES — Foreman must invoke IAA final assurance before merge.**
> SIMPLIFIED_ADMIN_ASSURANCE overlay (OVL-SAA-001–008) applies (no runtime product code in diff).
> STRICT_MERGE_POSTURE (OVL-SMP-001–003) applies universally.

### Applicable Overlays at Final Assurance

```
PRIMARY: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-019 + OVL-PBG-ADM-001)
SECONDARY: SIMPLIFIED_ADMIN_ASSURANCE (OVL-SAA-001 through OVL-SAA-008)
UNIVERSAL: STRICT_MERGE_POSTURE (OVL-SMP-001 through OVL-SMP-003)
PRE_BRIEF_ASSURANCE: OVL-INJ-001, OVL-INJ-ADM-003
```

### Stage-Readiness View (OVL-INJ-ADM-003)

Current PIT stage posture per `modules/pit/BUILD_PROGRESS_TRACKER.md` at pre-brief time:

| Stage | Name | Status | Evidence Reference |
|-------|------|--------|--------------------|
| 1 | App Description | ✅ GATE_PASSED — CS2_APPROVED_AUTHORITATIVE | maturion-isms#1540; `modules/pit/00-app-description/app-description.md` |
| 2 | UX Workflow & Wiring Spec | ⚠️ NOT_STARTED | CS2-accepted deviation — carried through Stages 3–10 without rejection; PIT is mgmt tracking tool (advisory flag OVL-PBG-010 — not appointment blocker) |
| 3 | FRS | ⚠️ DRAFT_HARDENED v0.2 | Pending CS2 approval; not gate-passed (pre-build sequencing carried via CS2-approved exception chain) |
| 4 | TRS | ⚠️ DRAFT_CREATED | Pre-build sequencing same exception chain |
| 5 | Architecture | ✅ GATE_PASSED | maturion-isms#1255 / PR #1576; `modules/pit/04-architecture/` |
| 5b | LFV Package | ✅ GATE_PASSED — MERGED | maturion-isms#1623 / PR #1624 |
| 6 | QA-to-Red | ✅ GATE_PASSED | maturion-isms#1625 / PR #1626; 147-test catalog |
| 7 | PBFAG | ✅ GATE_PASSED | Pre-build package; `modules/pit/07-pbfag/` |
| 8 | Implementation Plan | ✅ GATE_PASSED | maturion-isms#1679; 2026-05-19; `modules/pit/08-implementation-plan/` |
| 9 | Builder Checklist | ✅ GATE_PASSED | maturion-isms#1687; 2026-05-19; `modules/pit/09-builder-checklist/` |
| 10 | IAA Pre-Brief | ✅ GATE_PASSED — IAA PRE-BRIEF ACCEPTED | maturion-isms#1698 / PR #1701; 2026-05-20; readiness-only, Build Auth NOT CLEARED |
| 11 | Builder Appointment | 🔄 NOT_STARTED → target GATE_PASSED — BUILDER_APPOINTED | This wave |
| 12 | Build | 🔴 NOT_STARTED (must remain) | Stage 12 cannot start without separate Build Authorization clearance |

**Stages 1, 5, 5b, 6, 7, 8, 9, 10 = GATE_PASSED ✅**
**Stages 2, 3, 4 = NOT_STARTED/DRAFT — CS2-accepted deviation carried through prior gate-passes**
**Stage 11 = this wave's target**
**Stage 12 = NOT_STARTED — must remain NOT_STARTED**
**Build Authorization = NOT CLEARED — must remain NOT CLEARED throughout this wave**

### Anti-Regression Obligations

```
ANTI_REGRESSION_001: Build Authorization NOT CLEARED — must not change to CLEARED in any artifact
ANTI_REGRESSION_002: Stage 12 NOT_STARTED — must not advance in any artifact
ANTI_REGRESSION_003: RED baseline acknowledgement — CS2 Option B (147 tests; maturion-isms#1714 / PR #1715)
  must be preserved in builder proof pack (not rolled back to 144-only claim)
ANTI_REGRESSION_004: Stage 10 IAA PRE-BRIEF ACCEPTED posture preserved in tracker update
ANTI_REGRESSION_005: No FUNCTIONAL_PASS, GREEN_CLAIM, or LIVE_EVIDENCE claim introduced
```

### FAIL-ONLY-ONCE Rules Active for This Wave

| Rule | Application |
|------|-------------|
| A-003 | Ambiguity resolves to mandatory invocation — Final assurance IS required (PRE_BUILD_STAGE_MODEL trigger) |
| A-021 | Producing agent (pit-specialist/Foreman) must commit and push ALL artifacts BEFORE invoking IAA final assurance |
| A-022 | IAA re-evaluates trigger categories against ALL commits in PR at final invocation |
| A-026 | SCOPE_DECLARATION at `.agent-admin/scope-declarations/pr-1730.md` must exactly match `git diff --name-only origin/main...HEAD` |
| A-028 | SCOPE_DECLARATION must use list format; trimmed to current PR diff only |
| A-029 | If a PREHANDOVER proof is included, `iaa_audit_token` must use expected reference format — NOT `PENDING` |

### EXPECTED_QA_SCOPE (Files IAA will verify at final assurance)

```
MANDATORY (must exist and be non-placeholder):
- modules/pit/11-builder-appointment/stage11-builder-appointment.md (NEW — formal appointment artifact)
- modules/pit/11-builder-appointment/builder-readiness-proof-pack.md (UPDATED — all tables fully populated, no _(candidate fills)_ rows)
- modules/pit/11-builder-appointment/stage8-hardening-acknowledgement.md (UPDATED — all 8 rows, no _(required)_ cells)
- modules/pit/11-builder-appointment/stage11-appointment-preconditions.md (UPDATED — all TBD replaced with actual paths)
- modules/pit/BUILD_PROGRESS_TRACKER.md (UPDATED — Stage 11 GATE_PASSED, Build Auth NOT CLEARED, Stage 12 NOT_STARTED)

ADMIN/CEREMONY:
- .agent-admin/assurance/iaa-wave-record-pit-stage11-builder-appointment-20260521.md (this file — must reference final IAA token at closure)
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md (UPDATED)
- .admin/prs/pr-1730.json (NEW)
- .agent-admin/scope-declarations/pr-1730.md (NEW — must match final diff exactly)
```

### EXPECTED_FAILURE_MODES

```
FM-001: stage11-builder-appointment.md overclaims Build Authorization clearance or Stage 12 start
FM-002: Builder readiness proof pack tables still contain _(candidate fills)_ placeholders at final assurance
FM-003: Stage 8 hardening acknowledgement has _(required)_ cells instead of concrete execution use statements
FM-004: Preconditions document still has TBD verification references at final assurance
FM-005: BUILD_PROGRESS_TRACKER.md declares Stage 11 GATE_PASSED before all proof tables are complete
FM-006: Any artifact introduces GREEN test claim, LIVE evidence claim, or FUNCTIONAL_PASS claim
FM-007: Stage 12 advanced or Build Authorization declared CLEARED in any artifact
FM-008: SCOPE_DECLARATION does not match actual PR diff (A-026 violation)
FM-009: Producing agent invokes IAA before committing/pushing final artifacts (A-021 violation)
FM-010: Appointed builder is not pit-specialist or appointment lacks authority reference (issue #1729)
FM-011: Stage 11 appointment artifact is missing — only proof pack components committed without formal appointment
FM-012: RED baseline acknowledgement uses 144 only, rolling back CS2 Option B (147; maturion-isms#1714)
```

### FOREMAN_INSTRUCTIONS (IAA Guidance to Producing Agent)

```
1. Keep this wave docs/governance/appointment evidence only — no runtime code, tests, migrations, CI changes
2. pit-specialist is the builder candidate — pit-specialist must fill ALL proof pack tables with concrete evidence
3. Foreman creates stage11-builder-appointment.md AFTER reviewing pit-specialist deliverables
4. All _(candidate fills)_ table rows → pit-specialist fills with actual routes/screens/states/timeline/data/API/RLS/denied-paths/LFV/failure-modes
5. All _(required)_ cells in stage8-hardening-acknowledgement.md → concrete execution use statements + extracted blocker/condition + proof evidence artifacts
6. All TBD references in stage11-appointment-preconditions.md → actual evidence paths to committed artifacts
7. BUILD_PROGRESS_TRACKER.md: Stage 11 → GATE_PASSED — BUILDER_APPOINTED | Stage 12 stays NOT_STARTED | Build Auth stays NOT CLEARED
8. SCOPE_DECLARATION at .agent-admin/scope-declarations/pr-1730.md → must be updated to match final git diff exactly before IAA invocation
9. COMMIT AND PUSH before invoking IAA final assurance (A-021)
10. IAA final assurance IS required before merge — invoke IAA after all artifacts are complete and committed
```

### ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS

```
ECAP_REQUIRED: NO
ECAP_EXPECTED_ARTIFACTS: none
CEREMONY_ADMIN_APPOINTED: NOT_REQUIRED
Rationale: Docs/governance-only appointment wave. No protected governance paths beyond BUILD_PROGRESS_TRACKER.md
  advancement and module/11-builder-appointment/ artifacts.
```

### CURRENT_HEAD_CI_EXPECTATIONS

```
CI_AT_FINAL_ASSURANCE:
- Preflight evidence/admin parity gates must see:
  · Active wave-record at .agent-admin/assurance/iaa-wave-record-pit-stage11-builder-appointment-20260521.md
  · PR #1730 admin manifest at .admin/prs/pr-1730.json
  · Scope declaration at .agent-admin/scope-declarations/pr-1730.md
- Scope declaration parity gate: scope-declaration must match git diff exactly (validate-scope-to-diff.sh)
- Stage posture check: Stage 12 NOT_STARTED | Build Auth NOT CLEARED
- No new CI workflow changes expected — CI change would elevate category to CI_WORKFLOW
- RED test count: 147 catalog expected (CS2 Option B) — no test count changes from this wave
```

### POLC_AND_BUILDER_DELEGATION_EXPECTATIONS

```
POLC_MODE: Stage 11 appointment governance execution
DELEGATION_PATH: pit-specialist provides execution readiness evidence → Foreman reviews → Foreman creates formal appointment artifact
BUILD_EXECUTION_CLAIM: PROHIBITED in this wave
BUILD_AUTHORIZATION_CLEARANCE_CLAIM: PROHIBITED in this wave (separate CS2-gated step)
STAGE_12_START: PROHIBITED in this wave
pit-specialist authority: Stage 11 builder candidate evidence provider — NOT Stage 12 executor
Foreman authority: Formally appoints builder after evidence review — does NOT clear Build Authorization
CS2 authority: Only entity that can clear Build Authorization and authorize Stage 12 start
```

### IAA_WILL_QA (Final Assurance Checklist Preview)

At final assurance, IAA will verify:

**PRE_BUILD_GATES (OVL-PBG-001–OVL-PBG-013 applicable):**
- OVL-PBG-001: `modules/pit/module.manifest.json` slug `pit` matches directory name
- OVL-PBG-002: BUILD_PROGRESS_TRACKER module name/slug matches manifest
- OVL-PBG-006: BUILD_PROGRESS_TRACKER still contains full 12-stage model
- OVL-PBG-008: Stage gating respected — Stage 11 can only be claimed GATE_PASSED after all Stage 11 preconditions are met (note: Stages 1, 5–10 all GATE_PASSED ✅; Stages 2–4 are CS2-accepted deviation)
- OVL-PBG-012: PBFAG confirmed before builder delegation ✅ (Stage 7 GATE_PASSED in prior waves)
- OVL-PBG-013: Builder Checklist confirmed before appointment ✅ (Stage 9 GATE_PASSED in prior waves)
- OVL-PBG-004: This pre-brief artifact exists at `.agent-admin/assurance/iaa-wave-record-pit-stage11-builder-appointment-20260521.md` ✅ (satisfies IAA Pre-Brief existence requirement)

**Appointment artifact quality (SUBSTANCE):**
- stage11-builder-appointment.md: names pit-specialist as appointed builder, references authority (issue #1729), records appointment date, confirms Stage 11 NOT Stage 12, confirms Build Auth NOT CLEARED
- builder-readiness-proof-pack.md: ALL 8 tables fully populated; NO `_(candidate fills)_` rows; evidence is concrete (routes named, states listed, API touchpoints specified, RLS impacts described, failure modes named with mitigations)
- stage8-hardening-acknowledgement.md: ALL 8 artifact rows filled with: acknowledgement text + concrete execution use statement + extracted blocker/condition + proof evidence artifact name
- stage11-appointment-preconditions.md: ALL TBD verification references replaced with actual evidence artifact paths (evidence must be the artifacts produced in this wave)
- BUILD_PROGRESS_TRACKER.md: Stage 11 = GATE_PASSED — BUILDER_APPOINTED | Stage 12 = NOT_STARTED | Build Auth = NOT CLEARED | Classification header updated

**Anti-regression:**
- No runtime code, test code, migration, deployment config, CI change in diff
- No GREEN claim, FUNCTIONAL_PASS claim, LIVE evidence claim
- RED baseline: CS2 Option B (147) acknowledged — no rollback to 144-only claim
- Stage 12 remains NOT_STARTED in ALL artifacts
- Build Authorization remains NOT CLEARED in ALL artifacts

**SIMPLIFIED_ADMIN_ASSURANCE (OVL-SAA-001–008):**
- OVL-SAA-004: No runtime product code in diff → product-delivery evidence model correctly suppressed
- OVL-SAA-008: Risk identification — appointment artifact must include non-overclaim statement

**STRICT_MERGE_POSTURE (OVL-SMP-001–003):**
- All three conditions verified simultaneously at final assurance

### RESULT

```
RESULT: PREFLIGHT_BRIEF_COMPLETE
PRE_BRIEF_STATUS: IAA-AUTHORED AND COMMITTED
FINAL_ASSURANCE_REQUIRED: YES — invoke IAA after all artifacts are committed and pushed
APPLICABLE_TRIGGER: PRE_BUILD_STAGE_MODEL
APPLICABLE_OVERLAYS_AT_FINAL: PRE_BUILD_GATES + SIMPLIFIED_ADMIN_ASSURANCE + STRICT_MERGE_POSTURE
CEREMONY_ADMIN_REQUIRED: NO
ECAP_REQUIRED: NO
STAGE_12_BOUNDARY: NOT_STARTED — must remain
BUILD_AUTH_BOUNDARY: NOT CLEARED — must remain
APPOINTED_BUILDER: pit-specialist (to be formally confirmed in stage11-builder-appointment.md)
```

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: PENDING — REJECTION-PACKAGE issued; re-invocation required after fixes
FINAL_ASSURANCE_REQUIRED: YES (corrected from foreman pre-population; PRE_BUILD_STAGE_MODEL trigger)
EXPECTED_TOKEN_REFERENCE: IAA-pit-stage11-builder-appointment-20260521-PASS (issued on next passing invocation)
TOKEN_FILE_DESTINATION: see ## TOKEN section of this wave record (written by IAA on passing invocation per NO-STANDALONE-TOKEN-001 / Step 4.2b)

---

## REJECTION_HISTORY

### REJECTION-PACKAGE — R1 — 2026-05-21

**IAA Session**: session-iaa-pit-stage11-builder-appointment-20260521-R1  
**PR**: #1730  
**Date**: 2026-05-21  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  
**Checks Run**: 25 checks — 23 PASS, 2 FAIL  
**Verdict**: REJECTION-PACKAGE

**FAILURE 1**:
- Check: A-029 (FAIL-ONLY-ONCE Phase 3.1)
- Finding: PREHANDOVER proof `iaa_audit_token` field contains `PENDING_FINAL_ASSURANCE` — this is the OLD PENDING pattern explicitly prohibited by A-029 for post-2026-03-04 proofs. The field must be pre-populated at commit time with the expected reference `IAA-pit-stage11-builder-appointment-20260521-PASS`.
- Evidence: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-pit-stage11-builder-appointment-20260521.md` — `iaa_audit_token: PENDING_FINAL_ASSURANCE`
- Fix required: Foreman must add a new commit updating `iaa_audit_token: PENDING_FINAL_ASSURANCE` → `iaa_audit_token: IAA-pit-stage11-builder-appointment-20260521-PASS` in the PREHANDOVER file before re-invoking IAA.
- Classification: Ceremony

**FAILURE 2**:
- Check: OVL-SAA-002 / wave-current-tasks.md consistency (SIMPLIFIED_ADMIN_ASSURANCE Phase 3.3)
- Finding: Wave-current-tasks.md tasks 6 (pit-specialist delegation) and 7 (QP review) remain marked `⏳` (pending) while PREHANDOVER confirms QP VERDICT: PASS and all 5 deliverables committed. Additionally, task 9 (IAA final assurance) retains the pre-correction wording "likely N/A" when the pre-brief (IAA-authored, same wave) explicitly corrected this to REQUIRED (PRE_BUILD_STAGE_MODEL trigger applies to all BUILD_PROGRESS_TRACKER.md advancements).
- Evidence: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — tasks 6, 7 = ⏳; task 9 = "likely N/A" vs. pre-brief FINAL_ASSURANCE_REQUIRED: YES
- Fix required: Foreman must add a new commit updating tasks 6 and 7 from ⏳ to ✅, and correcting task 9 wording to reflect IAA final assurance IS REQUIRED (not "likely N/A").
- Classification: Ceremony

**Systemic Prevention Note (NO-REPEAT-PREVENTABLE-001)**:
Both failures are preventable. Structural prevention actions:
1. A-029 pattern: Foreman session memory template should include `iaa_audit_token: [EXPECTED_REFERENCE]` as a fill-at-commit instruction (not PENDING). Template hardening target: `.agent-workspace/foreman-v2/` PREHANDOVER template.
2. wave-current-tasks consistency: Foreman must mark tasks as ✅ immediately when builder deliverables are committed and QP review is complete — before invoking IAA. QP gate step is part of the delivery sequence, not optional.

**HANDOVER_ALLOWED**: no  
**RESULT**: REJECTED_BACK_TO_PRODUCER  
**Re-invocation**: Required after both fixes committed and pushed.
