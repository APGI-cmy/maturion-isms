# IAA Pre-Brief Artifact — Wave 16.2 Gap Remediation

**Artifact Type**: IAA Pre-Brief (Phase 0)
**Wave**: wave-16.2-gap-remediation
**Wave Title**: Wave 16.2 Gap Remediation: CriteriaModal Backend, Audio Playback, Audit Context, Confirmation Dialogs
**Branch**: copilot/fix-criteria-modal-backend
**Issue**: maturion-isms#1076
**Date Produced**: 2026-03-11
**Produced By**: independent-assurance-agent (Phase 0 — Pre-Brief mode)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief Protocol**: IAA_PRE_BRIEF_PROTOCOL.md §Trigger
**Source**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — wave-16.2-gap-remediation section

---

## Step 0.1 — Pre-Brief Invocation Confirmed

This session was triggered by a comment containing `IAA_PRE_BRIEF_PROTOCOL.md §Trigger`. Entering
PRE-BRIEF mode. Phase 1–4 assurance will NOT be executed in this session. This artifact is the
sole output of this invocation.

---

## Step 0.2 — Wave Scope (from wave-current-tasks.md)

**Wave Number**: wave-16.2-gap-remediation
**Session**: session-wave-16.2-gap-remediation-20260311
**Tasks Declared**: 7 (4 DONE, 3 PENDING/IN PROGRESS)

### All Declared Tasks

| ID | Task | Builder | Status |
|----|------|---------|--------|
| T-W162-GAP-001 | Verify GAP-009 implementation (CriteriaModal.tsx) | QP scan | ✅ DONE |
| T-W162-GAP-002 | Verify GAP-014 implementation (EvidenceCollection.tsx) | QP scan | ✅ DONE |
| T-W162-GAP-003 | Verify GAP-015 implementation (AuditContext.tsx + App.tsx) | QP scan | ✅ DONE |
| T-W162-GAP-004 | Verify GAP-024 implementation (AuditList.tsx + EvidenceCollection.tsx) | QP scan | ✅ DONE |
| T-W162-VITEST-001 | Add ui-wiring tests to vitest config | qa-builder | 🔄 PENDING |
| T-W162-QA-001 | Confirm wave162r tests GREEN | qa-builder | 🔄 PENDING |
| T-W162-GOV-001 | Governance ceremony | foreman-v2-agent | 🔄 IN PROGRESS |

---

## Step 0.3 — Trigger Category Classification

IAA Trigger Table v2.1.0 applied. Classification decision flow executed for all declared tasks.

### Classification Results

| Task ID | Task Summary | IAA Trigger Category | IAA Required? |
|---------|-------------|---------------------|---------------|
| T-W162-GAP-001 | Verify GAP-009 — CriteriaModal wired to real hooks | AAWP_MAT | YES — MANDATORY |
| T-W162-GAP-002 | Verify GAP-014 — Audio player in EvidenceCollection | AAWP_MAT | YES — MANDATORY |
| T-W162-GAP-003 | Verify GAP-015 — AuditContext global provider | AAWP_MAT | YES — MANDATORY |
| T-W162-GAP-004 | Verify GAP-024 — Confirmation dialogs (no window.confirm) | AAWP_MAT | YES — MANDATORY |
| T-W162-VITEST-001 | Add `../tests/ui-wiring/**/*.test.ts` to vitest config | AAWP_MAT | YES — MANDATORY |
| T-W162-QA-001 | Confirm all 13 wave162r tests GREEN | AAWP_MAT | YES — MANDATORY |
| T-W162-GOV-001 | Governance ceremony (PREHANDOVER, session memory, SCOPE_DECLARATION) | AAWP_MAT | YES — MANDATORY |

**Wave-level classification**: **AAWP_MAT** (sole trigger category)

**Classification rationale**:
- No `.github/agents/*.md` files in scope → NOT AGENT_CONTRACT
- No `governance/canon/` or `CANON_INVENTORY.json` files in scope → NOT CANON_GOVERNANCE
- No `.github/workflows/` files in scope → NOT CI_WORKFLOW
- No `.agent-workspace/*/knowledge/` files in scope → NOT KNOWLEDGE_GOVERNANCE
- All deliverable artifacts touch `modules/mat/` (frontend src, test files, vitest config) → AAWP_MAT
- AMBIGUITY CHECK: Classification unambiguous. Single category confirmed.

---

## Step 0.4 — Pre-Brief Artifact: Required Phases, Evidence, Checks at Handover

### 4.1 Required Phases at IAA Invocation (Handover)

When foreman-v2-agent invokes IAA at handover, IAA will execute:
- **Phase 1**: Identity & Preflight
- **Phase 2**: Alignment (category re-classification per FAIL-ONLY-ONCE A-022)
- **Phase 3**: Assurance Work — ALL checks below
- **Phase 4**: Merge Gate Parity, Verdict & Handover

### 4.2 Core Invariants Checks (CORE-001 to CORE-022)

IAA will run all core invariants from `iaa-core-invariants-checklist.md` v2.6.0.

Key core checks with specific relevance to this wave:

| Check | Relevance |
|-------|-----------|
| CORE-001 (PR description completeness) | PREHANDOVER must cite all 7 tasks |
| CORE-007 (Zero new failing tests) | All 13 wave162r tests must be GREEN |
| CORE-010 (No TODO/stub in production paths) | vitest.config.ts addition must be clean |
| CORE-013 (IAA invocation evidence) | This pre-brief artifact satisfies OVL-INJ-001 |
| CORE-015 (Test count non-regression) | 13 new tests must be net-additive, no tests removed |
| CORE-016 (PREHANDOVER proof immutability) | PREHANDOVER must be committed before IAA invocation; read-only post-commit per A-029 |
| CORE-018 (Evidence artifact sweep) | All 6 required ceremony artifacts must be committed |
| CORE-019 (No REJECTION-PACKAGE reuse) | Fresh invocation required; no reuse of prior tokens |
| CORE-022 (Secret field naming) | `secret_env_var:` pattern compliance — N/A (no agent contracts) |

### 4.3 AAWP_MAT Overlay Checks (FFA Checks)

IAA will execute all BD-001 through BD-024 checks from `iaa-category-overlays.md` v3.4.0.

**Gap-specific FFA checks** (as declared in test file header `T-W162R-QA-001`):

| FFA Check ID | Check Name | Specific Assertion |
|--------------|-----------|-------------------|
| BD-001 | Full scope delivered | All 13 tests T-W162R-009a/b/c, T-W162R-014a/b, T-W162R-015a/b/c/d, T-W162R-024a/b/c/d must PASS. vitest.config.ts must include `../tests/ui-wiring/**/*.test.ts`. |
| BD-002 | No stub/TODO in production paths | CriteriaModal.tsx must NOT contain "Interview recording interface will be implemented in Task 5.6.4" or equivalent placeholder. |
| BD-003 | One-time build compliance | All 4 gaps must work end-to-end from merge without additional fixes required. |
| BD-005 | End-to-end wiring verified | GAP-009: `useCriterionScore` hook is imported AND called (not just imported). GAP-015: `useAuditContext()` is called in ≥2 consuming pages, not just defined. |
| BD-006 | Writers and readers confirmed | GAP-015: `AuditContext` has a confirmed writer (AuditProvider setter) and ≥2 confirmed readers (consuming pages). No orphaned context. |
| BD-009 | Cross-component integration fit | GAP-015: No double-state — pages that previously managed local `auditId` state must use `useAuditContext()` instead; IAA will scan for duplicate `const [auditId` declarations in consuming pages. |
| BD-011 | 100% test pass rate | All 13 wave162r tests GREEN. Zero failures. Test run output evidence required in PREHANDOVER. |
| BD-012 | Zero test debt | No `.skip()`, `.only()`, `test.todo()`, or commented-out tests in `wave162r-frontend-ux-gaps.test.ts`. |
| BD-013 | No test dodging | GAP-024: `window.confirm` spy test must use a real spy pattern; confirm() spy must verify the function is NOT called (not vacuous). |
| BD-016 | No hardcoded secrets | No API keys or tokens introduced in vitest env configuration. |
| BD-018 | Audio src safety (injection) | GAP-014: `<audio>` src attribute must use `signed_url` from the evidence record, not a user-controlled raw input. IAA will check for XSS/injection safety on the audio src binding. |
| BD-019 | ARIA accessibility compliance | GAP-014: Audio `<audio>` element must have ARIA labels (e.g. `aria-label`). GAP-024: Confirmation dialogs must have `role="alertdialog"` and ARIA-labelled confirm/cancel controls per WCAG 2.1 §4.1.2. |
| BD-022 | Architecture alignment | GAP-024: Confirmation dialog pattern must match `CriteriaUpload.tsx` inline confirmation banner pattern (state-based, not `window.confirm`). IAA will cross-check both implementations. |

**Additional FFA check — vitest config wiring**:

| Check | Assertion |
|-------|-----------|
| BD-005 (vitest wiring) | `modules/mat/frontend/vitest.config.ts` must include `../tests/ui-wiring/**/*.test.ts`. **Scope note**: Root `vitest.config.ts` at repo root already includes `modules/mat/tests/**/*.test.ts` which WOULD match the test file. The frontend-specific config at `modules/mat/frontend/vitest.config.ts` must also include the pattern for frontend-dir test runs. Both configs should be consistent. |

### 4.4 PRE_BRIEF_ASSURANCE Overlay Checks

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| OVL-INJ-001 | Pre-Brief Artifact Existence | **THIS ARTIFACT** (`.agent-admin/assurance/iaa-prebrief-wave-16.2-gap-remediation-20260311.md`) committed BEFORE any builder task artifact on the branch. |
| OVL-INJ-ADM-001 | Pre-Brief non-empty | This artifact is non-empty and non-stub. ✅ |
| OVL-INJ-ADM-002 | Pre-Brief references correct wave | This artifact declares `wave-16.2-gap-remediation`. Must match wave-current-tasks.md. ✅ |

### 4.5 CST/CWT Assessment (per COMBINED_TESTING_PATTERN.md)

| Assessment | Determination |
|------------|--------------|
| **CST warranted?** | No CST required. This wave is a **pure frontend UX remediation** with no new backend API, new schema table, new migration, or new cross-module integration boundary. The 4 gaps were implemented in prior waves and are already present in main. The primary deliverable (vitest config wiring) does not create a new integration boundary. |
| **CWT required?** | YES — Per `COMBINED_TESTING_PATTERN.md` §5.2, a CWT is mandatory before IBWR completion. This wave is Wave 16.2R and follows Wave 16.2 (PR #1038 merged). **CWT scope: Wave 16.2R + all cumulative waves through Wave 16**. CWT PASS evidence must be present in the PREHANDOVER proof before IAA issues ASSURANCE-TOKEN. |
| **FCWT required?** | NOT at this wave. FCWT is reserved for production sign-over (Task 6.4). Wave 16.2R is not the final wave. |

---

## Step 0.4 (continued) — Required Evidence Artifacts at Handover

The producing agent (foreman-v2-agent / qa-builder) MUST provide ALL of the following in the
PREHANDOVER proof before IAA is invoked. Missing evidence = immediate REJECTION-PACKAGE.

### Mandatory Evidence Bundle

| # | Artifact | Required Content | Location |
|---|---------|-----------------|----------|
| 1 | **SCOPE_DECLARATION.md** | Exact list of changed files matching `git diff --name-only origin/main...HEAD`. Per A-026: stale SCOPE_DECLARATION = BL-027 merge gate parity failure. | Repo root |
| 2 | **vitest config diff** | Git diff showing `../tests/ui-wiring/**/*.test.ts` added to `modules/mat/frontend/vitest.config.ts` include array. | In PREHANDOVER |
| 3 | **Test run output** | Full `vitest run` output showing all 13 tests PASS (T-W162R-009a/b/c, T-W162R-014a/b, T-W162R-015a/b/c/d, T-W162R-024a/b/c/d). Zero failures. | In PREHANDOVER |
| 4 | **GAP-009 scan** | Code snippet or grep output confirming: (a) `import { useCriterionScore }` present in CriteriaModal.tsx; (b) no "Interview recording interface will be implemented in Task 5.6.4" string; (c) findings textarea has `value=` attribute. | In PREHANDOVER |
| 5 | **GAP-014 scan** | Code snippet confirming: (a) `<audio` element present in EvidenceCollection.tsx; (b) `signed_url` used as src; (c) `aria-label` present; (d) conditional on `type === 'audio'` or `type === 'interview'`. | In PREHANDOVER |
| 6 | **GAP-015 scan** | Code snippet confirming: (a) `AuditContext.tsx` exists; (b) `AuditProvider` wraps router in `App.tsx`; (c) `useAuditContext()` called in ≥2 consuming pages (e.g. CriteriaManagementPage, ScoringPage). | In PREHANDOVER |
| 7 | **GAP-024 scan** | Code snippet confirming: (a) no `window.confirm` in AuditList.tsx; (b) no `window.confirm` in EvidenceCollection.tsx; (c) `role="alertdialog"` present in confirmation dialogs. | In PREHANDOVER |
| 8 | **CWT PASS evidence** | CWT run output (or reference to prior CWT PASS token if cumulative regression covers this wave's scope). Scope: all waves through Wave 16.2R. | In PREHANDOVER |
| 9 | **Pre-IAA commit gate** | `git status` (clean working tree) + `git log --oneline -5` showing all artifacts committed before IAA invocation per A-021. | In PREHANDOVER |
| 10 | **IAA Pre-Brief reference** | Reference to this artifact: `.agent-admin/assurance/iaa-prebrief-wave-16.2-gap-remediation-20260311.md` | In PREHANDOVER |
| 11 | **Ceremony files committed** | Confirmation that all 6 expected ceremony files are committed (wave-current-tasks.md, pre-brief, PREHANDOVER, session memory, SCOPE_DECLARATION, + IAA token placeholder per A-029). | In PREHANDOVER |

---

## Step 0.4 (continued) — PREHANDOVER Proof Structure Required

The PREHANDOVER proof must be at:
`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-16.2-gap-remediation-20260311.md`

### Required Sections

```markdown
# PREHANDOVER Proof — wave-16.2-gap-remediation

## Wave Reference
wave: wave-16.2-gap-remediation
session: session-wave-16.2-gap-remediation-20260311
branch: copilot/fix-criteria-modal-backend
issue: maturion-isms#1076

## Pre-IAA Commit Gate (A-021)
git status: [must show clean working tree]
git log --oneline -5: [must show all artifacts committed]

## SCOPE_DECLARATION.md Alignment (A-026)
[git diff --name-only output — must match SCOPE_DECLARATION.md exactly]

## IAA Pre-Brief Confirmation (OVL-INJ-001)
Pre-brief artifact: .agent-admin/assurance/iaa-prebrief-wave-16.2-gap-remediation-20260311.md
Status: COMMITTED ✅

## T-W162-VITEST-001 Evidence
[git diff of modules/mat/frontend/vitest.config.ts showing include pattern added]

## T-W162-QA-001 Evidence — Test Run Output
[Full vitest run output — must show 13/13 tests PASS, 0 failures]
Test IDs confirmed GREEN:
- T-W162R-009a ✅
- T-W162R-009b ✅
- T-W162R-009c ✅
- T-W162R-014a ✅
- T-W162R-014b ✅
- T-W162R-015a ✅
- T-W162R-015b ✅
- T-W162R-015c ✅
- T-W162R-015d ✅
- T-W162R-024a ✅
- T-W162R-024b ✅
- T-W162R-024c ✅
- T-W162R-024d ✅

## GAP Implementation Scans

### GAP-009: CriteriaModal.tsx
[Code evidence: useCriterionScore import + controlled textarea + no placeholder string]

### GAP-014: EvidenceCollection.tsx — Audio Player
[Code evidence: <audio> element + signed_url src + aria-label + type conditional]

### GAP-015: AuditContext.tsx — Global Context
[Code evidence: AuditContext.tsx exists + AuditProvider in App.tsx + ≥2 consumers with useAuditContext()]

### GAP-024: Confirmation Dialogs
[Code evidence: no window.confirm() in AuditList.tsx or EvidenceCollection.tsx + role="alertdialog"]

## CWT Evidence (COMBINED_TESTING_PATTERN.md §5.2)
[CWT run output or reference to prior CWT PASS token with scope declaration]
CWT scope: Waves through Wave 16.2R

## IAA Token Placeholder (A-029)
Expected reference token: IAA-session-wave-16.2-gap-remediation-20260311-PENDING
[Token file path: .agent-admin/assurance/iaa-token-session-wave-16.2-gap-remediation-20260311.md]
```

---

## Step 0.5 — Scope Blockers and Governance Conflicts

### Confirmed: No Hard Blockers

IAA has reviewed the wave scope, issue body, and wave-current-tasks.md. No hard blockers
preventing work from proceeding are visible at this time.

### Observation 1 — Root vitest.config.ts Already Covers the Test (Non-Blocking)

**Finding**: The root `vitest.config.ts` at the repo root already includes
`modules/mat/tests/**/*.test.ts` in its include patterns. The wave162r test file at
`modules/mat/tests/ui-wiring/wave162r-frontend-ux-gaps.test.ts` would already be matched
by this root pattern.

**Impact**: When running `vitest run` from the repo root (standard CI behaviour), the tests
are likely already picked up. The change to `modules/mat/frontend/vitest.config.ts` is
additionally required for frontend-directory-scoped test runs.

**Required action**: qa-builder should add `../tests/ui-wiring/**/*.test.ts` to
`modules/mat/frontend/vitest.config.ts` as specified, AND verify that running
`vitest run` (from root or within `modules/mat/frontend/`) picks up all 13 tests.
Test run evidence in PREHANDOVER must show all 13 tests discovered and GREEN.

**IAA will verify at handover**: That the PREHANDOVER test run output shows all 13 test IDs
individually listed as PASS — not just "N tests passed" aggregate output.

### Observation 2 — Prior Wave Context (Informational)

**Wave 16-2R** (SHA b46f0f5d, 635e502e, b2acbc1f, 01507329) committed the 4 gap
implementations and the RED test suite in prior sessions. The current wave is the
**closure wave** — wiring the tests and confirming GREEN.

**IAA note**: The wave-current-tasks.md declares all 4 gaps as "✅ IMPLEMENTED". IAA
will independently verify each implementation at handover using source-code scans
(not relying solely on the Foreman's claim). Per the Orientation Mandate (90/10 rule):
IAA's primary effort is confirming the build works and tests pass — the gap scans are
the substantive review, not ceremony admin.

### Observation 3 — CWT Mandatory Before IBWR

Per `COMBINED_TESTING_PATTERN.md`, a CWT is required before IBWR completion. If this
wave closes with an IBWR, the IBWR must contain CWT PASS evidence. IAA will issue
REJECTION-PACKAGE if CWT evidence is absent from the IBWR artifact.

---

## Step 0.6 — Summary for Invoking Agent

**Pre-Brief status**: COMPLETE ✅

**Wave trigger category**: `AAWP_MAT` (sole category — no AGENT_CONTRACT, CANON_GOVERNANCE,
CI_WORKFLOW, or KNOWLEDGE_GOVERNANCE triggers in scope)

**Qualifying tasks**: All 7 declared tasks are qualifying (AAWP_MAT). No task is exempt.

**FFA checks declared**: BD-001, BD-002, BD-003, BD-005, BD-006, BD-009, BD-011, BD-012,
BD-013, BD-016, BD-018, BD-019, BD-022 (plus standard BD-TIER-4 security checks BD-015
through BD-016, and all CORE invariants)

**PREHANDOVER structure**: Specified above in Step 0.4. 11 mandatory evidence items.

**Scope blockers**: None (3 informational observations — non-blocking)

**Governance conflicts**: None detected

**CWT gate**: Mandatory before IBWR completion. Discretionary CST: not required (no new
cross-boundary integration introduced).

**IAA invocation instruction** (for foreman-v2-agent):

> When all tasks are DONE and all evidence is committed, invoke IAA via:
> `task(agent_type: "independent-assurance-agent")` with the PREHANDOVER proof path and PR number.
> IAA will execute Phases 1–4 and issue either ASSURANCE-TOKEN or REJECTION-PACKAGE.
> This pre-brief artifact satisfies OVL-INJ-001 and must be committed BEFORE qa-builder
> is delegated T-W162-VITEST-001 or T-W162-QA-001.

---

**Pre-Brief Artifact Hash**: n/a (governance record only)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — verdicts are hard-blocking
**This artifact is READ-ONLY once committed.**
