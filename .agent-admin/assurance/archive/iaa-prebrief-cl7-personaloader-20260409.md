# IAA Pre-Brief — Wave CL-7: LKIAC-L3 PersonaLoader Improvements (New Session — 2026-04-09)

**Pre-Brief ID**: IAA-PREBRIEF-CL7-PERSONALOADER-20260409
**Supersedes**: IAA-PREBRIEF-CL7-PERSONALOADER-20260405 (prior session — different branch/issue)
**Prior Pre-Brief on file**: `.agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260405.md`
**Date**: 2026-04-09
**Wave**: CL-7 (LKIAC-L3 — PersonaLoader Improvements)
**Branch**: `copilot/cl-7-lkiac-l3-personaloader-improvements`
**Issue**: maturion-isms#1326
**Prior Issue (closed)**: maturion-isms#1226 (2026-04-05 session)
**CS2 Authorization Reference**: maturion-isms#1326 opened by @APGI-cmy (2026-04-09)
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief Mode**: PHASE_0 — Pre-Brief only. Phases 1–4 assurance NOT executed this session.

---

## ⚠️ CONTEXT DELTA — Why a New Pre-Brief Is Required

This is NOT a continuation of the 2026-04-05 session. A new pre-brief is mandatory because:

| Dimension | Prior Session (2026-04-05) | This Session (2026-04-09) |
|-----------|---------------------------|--------------------------|
| Issue | maturion-isms#1226 | maturion-isms#1326 |
| Branch | `copilot/cl-7-personaloader-improvements` | `copilot/cl-7-lkiac-l3-personaloader-improvements` |
| IAA token issued | `IAA-session-cl7-personaloader-20260405-R2-PASS` (OLD BRANCH) | NOT YET ISSUED — new invocation required |
| PREHANDOVER proof on branch | YES — committed in 780bd05 (OLD BRANCH) | NO — not present on new branch |
| Session memory on branch | YES — committed in 780bd05 (OLD BRANCH) | NO — not present on new branch |
| Implementation committed | YES | YES — carried in f6d7b67 ("Initial plan") |

The prior ASSURANCE-TOKEN (`IAA-session-cl7-personaloader-20260405-R2-PASS`) does **NOT** transfer to this new branch or issue. IAA must be re-invoked for this session, and all ceremony artifacts must be produced for and committed to `copilot/cl-7-lkiac-l3-personaloader-improvements`.

---

## Phase 0 Execution Confirmation

**Step 0.1 — Invocation context**: Confirmed. PRE-BRIEF mode active. Phases 1–4 assurance NOT executed this session.

**Step 0.2 — Wave current tasks loaded**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` read.
Wave CL-7 confirmed. 5 deliverables (D1–D5) all marked complete (✅). T6 (QP evaluation + PREHANDOVER proof) and T7 (IAA final audit + token) marked pending (❌).

**Step 0.3 — Task classification**: All 5 deliverables assessed against IAA Trigger Table v2.4.0.

**Step 0.3b — Anti-regression obligations**: See §3 below. Recurring CERT-001 pattern from prior session is the primary elevated risk for this session.

**Step 0.3c — Ceremony-admin appointment check**: `ceremony_admin_appointed` field is ABSENT from wave-current-tasks.md. No ceremony-admin in scope. ECAP three-role split checks are N/A for this wave.

---

## 1. Qualifying Task Classification

| Task ID | Summary | IAA Trigger Category | Qualifying? |
|---------|---------|---------------------|-------------|
| CL-7-D1 | RED gate tests — `PersonaValidationError` on invalid YAML front-matter → `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | AAWP_MAT | ✅ YES |
| CL-7-D2 | RED gate tests — persona registry sync CI integration test → same test file | AAWP_MAT + CI_WORKFLOW boundary | ✅ YES |
| CL-7-D3 | Implementation — `PersonaValidationError` type + runtime YAML validation → `PersonaLoader.ts`, `types/index.ts` | AAWP_MAT | ✅ YES |
| CL-7-D4 | CI workflow — `.github/workflows/persona-registry-sync.yml` | CI_WORKFLOW | ✅ YES |
| CL-7-D5 | Scheduled workflow — `.github/workflows/persona-freshness-review.yml` | CI_WORKFLOW | ✅ YES |

**Overall Wave Category**: MIXED (AAWP_MAT + CI_WORKFLOW). IAA invocation at handover: **MANDATORY**.

**Ambiguity check**: CLEAR — all 5 deliverables produce unambiguously triggering artifacts. No AGENT_CONTRACT trigger (no `.github/agents/*.md` files modified).

---

## 2. Implementation Status Verification (as of 2026-04-09)

IAA has verified the following against the current HEAD of `copilot/cl-7-lkiac-l3-personaloader-improvements` (f6d7b67):

| Deliverable | File | Status on Branch |
|------------|------|-----------------|
| CL-7-D1/D2 | `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | ✅ Committed — CL-7-T-001 through T-013 present |
| CL-7-D3 | `packages/ai-centre/src/personas/PersonaLoader.ts` | ✅ Committed — `PersonaValidationError` thrown on all 6 required field failures |
| CL-7-D3 | `packages/ai-centre/src/types/index.ts` | ✅ Committed — `PersonaValidationError` class exported |
| CL-7-D4 | `.github/workflows/persona-registry-sync.yml` | ✅ Committed — bi-directional sync check, exit 1 on violations, `workflow_dispatch` present |
| CL-7-D5 | `.github/workflows/persona-freshness-review.yml` | ✅ Committed — 90-day threshold, date validation, exit 1 on violations, `workflow_dispatch` present |

**Prior IAA substantive assessment (carried forward)**: The 2026-04-05 R2 session confirmed all 5 deliverables substantively correct. The implementation is bit-for-bit identical on this branch. Zero functional rework required.

**What IS required**: Governance ceremony artifacts (T6: PREHANDOVER proof + T7: IAA re-invocation and token) are absent from this branch and must be produced.

---

## 3. Anti-Regression Obligations (FAIL-ONLY-ONCE §Step 0.3b)

### 3.1 Recurring Pattern — CERT-001: Files Not Committed to Branch

**Prior incident (2026-04-05 R1 session)**: PREHANDOVER proof and session memory were produced but NOT committed to the branch. IAA issued REJECTION-PACKAGE solely on this basis. The implementation was substantively correct but the PR was blocked until files were committed (resolved in 780bd05 on the OLD branch).

**Anti-regression obligation for this session**:
- Foreman MUST verify ALL governance artifacts are `git add`-ed AND `git commit`-ed to `copilot/cl-7-lkiac-l3-personaloader-improvements` before invoking IAA
- IAA WILL run `git ls-files` and `git log --all --name-only` to confirm files are on the branch — not just present on disk
- A file that exists on disk but shows as `??` in `git status` = CERT-001 failure = REJECTION-PACKAGE
- **Structural prevention**: Foreman must include a self-check step before IAA invocation: confirm `git status` shows CLEAN (no untracked governance artifacts)

**Mechanism**: IAA will apply FAIL-ONLY-ONCE A-001 (invocation evidence check) with particular scrutiny to whether PREHANDOVER proof and session memory are on-branch via `git ls-files`, not merely on-disk.

### 3.2 No New Anti-Regression Patterns from Prior Sessions

No additional recurring patterns from sessions reviewed that are specifically relevant to this wave's artifact types. Learning note from R2: "Re-invocation token naming — use -R2 suffix on re-invocation token files" — carried forward as structural awareness, no new FFA rule required.

---

## 4. Declared Trigger Categories

| Category | Triggered By | Mandatory? |
|----------|-------------|-----------|
| AAWP_MAT | CL-7-D1, CL-7-D2, CL-7-D3 | YES — MANDATORY |
| CI_WORKFLOW | CL-7-D4, CL-7-D5 | YES — MANDATORY |
| MIXED | Combined AAWP_MAT + CI_WORKFLOW | YES — MANDATORY |

---

## 5. FFA Checks IAA Will Run at Handover

### 5.1 High-Frequency Miss Checks (HFMC-01 through HFMC-06 — Step 3.1b)

| Check | Description | Specific CL-7 Application |
|-------|------------|--------------------------|
| HFMC-01 | Ripple: canon/governance changes ripple correctly | Only new workflow files — no canon ripple expected. Verify `.github/workflows/` additions do not require CANON_INVENTORY update. |
| HFMC-02 | Scope parity: all declared deliverables present in diff | All 5 D1–D5 must appear in `git diff` relative to main. |
| HFMC-03 | Artifacts committed: governance artifacts on branch (not just on disk) | **ELEVATED — recurring failure**. PREHANDOVER proof + session memory must appear in `git ls-files`. |
| HFMC-04 | Pre-brief: pre-brief artifact present and referenced in PREHANDOVER | This file (IAA-PREBRIEF-CL7-PERSONALOADER-20260409) must be referenced. |
| HFMC-05 | Token ceremony: IAA token field pre-populated in PREHANDOVER proof | `iaa_audit_token` must contain expected reference (non-PENDING, non-empty). |
| HFMC-06 | Evidence bundle: all 4 components present (PREHANDOVER, session memory, iaa_audit_token, dedicated token file) | All 4 must be present before Phase 3 overlay checks proceed. |

### 5.2 Universal Ceremony Gate (CERT — 4 checks)

| Check ID | Check | Specifics |
|----------|-------|-----------|
| CERT-001 | PREHANDOVER proof committed to branch | `git ls-files` confirms presence on `copilot/cl-7-lkiac-l3-personaloader-improvements` |
| CERT-002 | Session memory committed to branch | Same — `git ls-files` confirmation, not just on-disk |
| CERT-003 | FAIL-ONLY-ONCE attestation declared | `fail_only_once_attested: true` and version in session memory preamble |
| CERT-004 | IAA audit token field present in PREHANDOVER | `iaa_audit_token` field non-empty, non-PENDING, pre-populated with expected reference |

### 5.3 Core Invariants (CORE — all 23 applied; key checks for this wave)

| Check ID | Applicability | CL-7 Application |
|----------|--------------|-----------------|
| CORE-005 | Governance block | Session memory and PREHANDOVER must contain governance block |
| CORE-007 | No placeholder content | No TODOs/stubs in production paths — verify no regressions since 2026-04-05 |
| CORE-013 | IAA invocation evidence | PREHANDOVER must reference this pre-brief (IAA-PREBRIEF-CL7-PERSONALOADER-20260409) AND acknowledge prior token |
| CORE-015 | Session memory on branch | Per CERT-002 — `git ls-files` check |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file written by IAA after audit (not by Foreman) |
| CORE-018 | Complete evidence artifact sweep | All 4 items: PREHANDOVER proof, session memory, `iaa_audit_token` field, dedicated token file — all present before overlays proceed |
| CORE-019 | IAA token cross-verification | Prior R2 token referenced; this session will produce R3 or new token if different branch naming used |
| CORE-023 | Workflow integrity ripple check | D4 and D5 are new workflows — syntax validity, trigger correctness, no broken job dependencies |

### 5.4 FUNCTIONAL-BEHAVIOUR-REGISTRY Checks (BUILD_AAWP_MAT)

IAA will read `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` v1.1.0 (NBR-001 through NBR-005) and apply all applicable patterns to the CL-7 diff. The `PersonaLoader.ts` changes involve async error throwing — NBR patterns related to swallowed errors and silent failures are directly applicable.

### 5.5 BUILD_DELIVERABLE Overlay (AAWP_MAT — CL-7-D1, D2, D3)

**Note**: The prior R2 session confirmed all BD checks PASS. These carry forward with identity verification (no-change check between sessions):

| Check ID | Check | Prior Status | This Session |
|----------|-------|-------------|--------------|
| BD-000 | User Journey Trace (6 journeys confirmed) | ✅ PASS | Re-verify — implementation unchanged |
| BD-001 | Full scope delivered (D1–D3) | ✅ PASS | Re-verify scope completeness |
| BD-002 | No stub/TODO in production paths | ✅ PASS | Re-scan for new stubs since f6d7b67 |
| BD-003 | One-time build compliance | ✅ PASS | Re-verify PersonaLoader end-to-end |
| BD-004 | No leftover debt from previous jobs | ✅ PASS | CL-1 tests remain GREEN — re-confirm |

### 5.6 CI_WORKFLOW Overlay (CL-7-D4, D5)

| Check ID | Check | Prior Status | This Session |
|----------|-------|-------------|--------------|
| OVL-CI-001 | Workflow policy correctness | ✅ PASS | Re-verify — no changes since 2026-04-05 |
| OVL-CI-002 | Merge gate integrity | ✅ PASS | Re-verify additive only |
| OVL-CI-003 | Silent failure risk (no `continue-on-error`) | ✅ PASS | Re-confirm exit 1 on violations |
| OVL-CI-004 | Environment parity (`workflow_dispatch` present) | ✅ PASS | Re-confirm both D4 and D5 |
| OVL-CI-005 | CI evidence (S-033 exception — YAML syntax, pattern parity, `workflow_dispatch`) | ✅ PASS | PREHANDOVER must explicitly re-invoke S-033 for new session |

---

## 6. Required PREHANDOVER Proof Structure (New Session)

The Foreman MUST produce a NEW PREHANDOVER proof for this session. The prior proof
(`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl7-personaloader-wave-cl7-20260405.md`)
was for the OLD branch and issue — it MUST NOT be reused. A new proof is required.

### 6.1 Required YAML Preamble

```yaml
# PREHANDOVER PROOF — CL-7: LKIAC-L3 PersonaLoader Improvements (New Session 2026-04-09)

session_id: session-cl7-personaloader-20260409
wave: CL-7
branch: copilot/cl-7-lkiac-l3-personaloader-improvements
issue: maturion-isms#1326
cs2_authorization: maturion-isms#1326 opened by @APGI-cmy (2026-04-09)
architecture_ref: governance/aimc/AIMC_PERSONA_LIFECYCLE.md (current version on main)
producing_agents:
  - agent: foreman-v2-agent
    deliverables: [T6 — QP evaluation and PREHANDOVER proof]
prior_session_ref: maturion-isms#1226 (branch: copilot/cl-7-personaloader-improvements)
prior_iaa_token_ref: IAA-session-cl7-personaloader-20260405-R2-PASS
iaa_prebrief_ref: .agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260409.md
iaa_audit_token: IAA-session-cl7-personaloader-20260409-PASS  # pre-populated expected ref
fail_only_once_attested: true
fail_only_once_version: v2.5.0
```

### 6.2 Required Evidence Sections (named headings — all mandatory)

1. `## Scope-to-Diff Verification` — Cross-reference each deliverable (CL-7-D1 through D5) against `git diff main...HEAD`. Every declared deliverable must map to a visible diff entry.

2. `## Context Delta Declaration` — Explicitly state: "This PREHANDOVER proof is for issue maturion-isms#1326 on branch `copilot/cl-7-lkiac-l3-personaloader-improvements`. The implementation is carried from prior session (maturion-isms#1226, token IAA-session-cl7-personaloader-20260405-R2-PASS). No functional changes have been made since that token was issued."

3. `## User Journey Declarations` — Per BD-000: re-declare all 6 journeys (PREHANDOVER must not rely on the prior session's declaration — self-contained artifact required):
   - Journey 1: `PersonaLoader.load(agentId)` → missing required YAML field → `PersonaValidationError` thrown
   - Journey 2: `PersonaLoader.load(agentId)` → valid YAML → persona returned normally
   - Journey 3: CI check — persona registry out-of-sync → step fails
   - Journey 4 (edge): No YAML front-matter delimiter → `PersonaValidationError` thrown
   - Journey 5 (edge): Blank (empty string) required field → `PersonaValidationError` thrown
   - Journey 6 (edge): Valid persona file with all 6 fields present → no error

4. `## No-Regression Statement` — Confirm CL-1 tests in PersonaLoader.test.ts remain GREEN. Include test count reference.

5. `## CI_WORKFLOW Evidence (S-033 Exception)` — For D4 and D5: all three required items:
   - (1) YAML syntax validation evidence
   - (2) Pattern parity statement (compared against existing workflow patterns)
   - (3) Confirmation `workflow_dispatch` is present in both files
   Bare statement "CI passed" is NOT sufficient — all three items required.

6. `## Session Memory Reference` — File path of Foreman's session memory committed to this branch.

7. `## Artifact Commit Confirmation` — Explicit statement: "I have verified via `git ls-files` that PREHANDOVER proof and session memory are committed to branch `copilot/cl-7-lkiac-l3-personaloader-improvements` and appear in `git status` as clean (no `??` untracked files among governance artifacts)."

### 6.3 PREHANDOVER Proof File Path

The proof MUST be committed to the branch at a clearly named root-level path:
`PREHANDOVER_PROOF_CL7_PERSONALOADER_SESSION2.md` or equivalent root-level file.

Do NOT reuse `PREHANDOVER_PROOF_CL7_PERSONALOADER.md` without a session suffix — the old filename (if cherry-picked or recreated) will cause CERT-001 confusion.

**IMMUTABILITY NOTICE (A-029 §4.3b)**: Once committed, PREHANDOVER proof is READ-ONLY. IAA will NOT edit it. IAA writes its verdict to a separate dedicated token file at `.agent-admin/assurance/iaa-token-session-cl7-personaloader-20260409.md`.

---

## 7. Scope Blockers and Advisories

### ⚠️ BLOCKER-1 — Governance Artifacts Not on New Branch (Must Resolve Before IAA Invocation)

**Issue**: The new branch `copilot/cl-7-lkiac-l3-personaloader-improvements` currently has ONLY the "Initial plan" commit (f6d7b67). No PREHANDOVER proof, no Foreman session memory, and no IAA token artifacts are committed to this branch.

**Required action (T6)**:
1. Foreman produces a NEW PREHANDOVER proof per §6.2 above
2. Foreman produces a NEW session memory file at `.agent-workspace/foreman-v2/memory/session-cl7-personaloader-20260409.md`
3. Both files are staged and committed to `copilot/cl-7-lkiac-l3-personaloader-improvements`
4. Foreman verifies via `git status` (clean — no `??` for governance artifacts) and `git ls-files` (files present)
5. ONLY THEN invoke IAA

**IAA position**: CERT-001 is the exact failure pattern from the prior session. IAA will apply it with elevated scrutiny. Any governance artifact present on disk but not committed = REJECTION-PACKAGE.

---

### ⚠️ BLOCKER-2 — Prior ASSURANCE-TOKEN Does Not Transfer (Branch Scope Binding)

**Issue**: The prior ASSURANCE-TOKEN `IAA-session-cl7-personaloader-20260405-R2-PASS` was issued for branch `copilot/cl-7-personaloader-improvements`. IAA tokens are branch-scoped. This token CANNOT be used as merge authorization for `copilot/cl-7-lkiac-l3-personaloader-improvements`.

**Required action**: IAA must be re-invoked on this branch. The prior token should be referenced in the PREHANDOVER proof as context/history, but a NEW ASSURANCE-TOKEN must be issued before this PR can be opened.

**IAA position**: This is a hard governance requirement. CS2 may grant an explicit waiver if the two branches are confirmed bit-for-bit identical in implementation files. Absent explicit CS2 waiver, IAA re-invocation is mandatory.

---

### ℹ️ ADVISORY-1 — Test File Path: BLOCKER-1 from Prior Pre-Brief is RESOLVED

The prior pre-brief (20260405) flagged a test file path discrepancy. This is now confirmed RESOLVED: tests are at `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` (correct path). No action required.

---

### ℹ️ ADVISORY-2 — Architecture Reference Version

Architecture reference: use `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` (current version on main). The prior advisory about v1.0.1 vs v1.1.0 is RESOLVED — the PREHANDOVER proof for this session should cite the current version.

---

### ℹ️ ADVISORY-3 — OVL-CI-005 S-033 Exception Pre-Declared

D4 (`persona-registry-sync.yml`) and D5 (`persona-freshness-review.yml`) are scheduled/dispatch workflows. S-033 Inherent Limitation Exception applies. PREHANDOVER must include all three required evidence items per §6.2 item 5. This advisory carries forward unchanged from the prior pre-brief.

---

### ℹ️ ADVISORY-4 — `wave-current-tasks.md` Has Unstaged Modification

`git status` shows `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` as modified (`M`) but not staged. Foreman should include this file in the governance artifact commit (same commit as PREHANDOVER proof + session memory). IAA will note its commit status during CERT-001 check.

---

## 8. Does the Existing Pre-Brief (20260405) Suffice?

**Answer: NO — a new pre-brief IS required, and this document is that new pre-brief.**

Reasons:
1. The issue number changed (#1226 → #1326) — the canonical CS2 authorization reference changed
2. The branch name changed — the PREHANDOVER proof path pattern changes accordingly
3. The prior session's context is now history — this session's Foreman is a new orchestration instance
4. The CERT-001 recurring failure pattern must be explicitly declared as anti-regression in the new pre-brief (it was not yet a known recurring pattern at the time of the prior pre-brief)
5. The prior pre-brief's BLOCKER-1 (test file path) is resolved; new BLOCKER-1 (governance artifacts not on branch) replaces it

The prior pre-brief (IAA-PREBRIEF-CL7-PERSONALOADER-20260405) remains in the assurance artifact record as historical context. Substantive FFA check results from that session carry forward (BD-000 through OVL-CI-005 all confirmed PASS). This new pre-brief inherits those confirmations and requires only governance ceremony re-execution (T6 + T7), not substantive rework.

---

## 9. Summary — IAA Invocation Requirements at Handover

| Requirement | Detail |
|------------|--------|
| IAA invocation mandatory | YES — MIXED trigger (AAWP_MAT + CI_WORKFLOW) |
| Adoption phase | PHASE_B_BLOCKING — hard gate |
| Pre-Brief reference for PREHANDOVER proof | `.agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260409.md` |
| Expected IAA token file path | `.agent-admin/assurance/iaa-token-session-cl7-personaloader-20260409.md` |
| PREHANDOVER proof must be committed before IAA invocation | YES — and confirmed via `git ls-files` (not just on disk) |
| `iaa_audit_token` in PREHANDOVER proof | Pre-populate: `IAA-session-cl7-personaloader-20260409-PASS` |
| Total FFA checks at handover | HFMC: 6 + CERT: 4 + CORE: 23 + BD: ~10 + CI: 5 + FBR: ~5 = ~53 checks |
| PHASE_A_ADVISORY | NO — Phase B blocking. REJECTION-PACKAGE prevents PR from being opened. |
| Ceremony-admin appointed | NO — ECAP three-role split checks N/A |

---

## 10. Pre-Brief Completion Confirmation

> "New Pre-Brief artifact generated for Wave CL-7 (LKIAC-L3 PersonaLoader Improvements) — Session 2026-04-09.
>
> This pre-brief supersedes IAA-PREBRIEF-CL7-PERSONALOADER-20260405 for this session's context.
> The prior pre-brief remains as historical record.
>
> Qualifying tasks found: **5 of 5** (CL-7-D1 through CL-7-D5 are all IAA-triggering).
> Trigger categories declared: **AAWP_MAT + CI_WORKFLOW (MIXED)**.
> IAA mandatory at handover: **YES — PHASE_B_BLOCKING hard gate**.
> Anti-regression obligations: **CERT-001 elevated risk — see §3**.
> Ceremony-admin: **NOT APPOINTED — ECAP N/A**.
> Scope blockers: **2 blockers (BLOCKER-1: governance artifacts not on branch; BLOCKER-2: prior token not transferable) + 4 informational advisories**.
>
> Foreman must:
> 1. Produce NEW PREHANDOVER proof per §6.2 (T6)
> 2. Produce NEW session memory for this session
> 3. Commit BOTH to branch `copilot/cl-7-lkiac-l3-personaloader-improvements` (including wave-current-tasks.md)
> 4. Verify `git ls-files` confirms all governance artifacts on branch
> 5. Invoke IAA (T7)
>
> Phase 0 complete. Phases 1–4 not executed — this is a Pre-Brief session only."

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA**: independent-assurance-agent v6.2.0 | Contract 2.5.0
**Pre-Brief generated**: 2026-04-09
**Next IAA invocation**: At wave handover, when T6 artifacts are committed and branch is clean.
