# IAA Pre-Brief — Wave CL-7: LKIAC-L3 PersonaLoader Improvements

**Pre-Brief ID**: IAA-PREBRIEF-CL7-PERSONALOADER-20260405
**Date**: 2026-04-05
**Wave**: CL-7 (LKIAC-L3 — PersonaLoader Improvements)
**Branch**: `copilot/cl-7-personaloader-improvements`
**Issue**: maturion-isms#1226
**CS2 Authorization Reference**: maturion-isms#1221 (2026-04-05)
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief Mode**: PHASE_0 — Pre-Brief only. Phases 1–4 assurance NOT executed in this session.

---

## Phase 0 Execution Confirmation

**Step 0.1 — Invocation context**: Confirmed. This session was triggered by a `[IAA PRE-BRIEF REQUEST]` comment with explicit wave-start context. PRE-BRIEF mode is active. Phases 1–4 assurance will NOT execute this session.

**Step 0.2 — Wave current tasks loaded**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` read. Wave CL-7 confirmed. 5 deliverables declared (CL-7-D1 through CL-7-D5), all status PENDING at wave start.

**Step 0.3 — Task classification**: All 5 deliverables assessed against the IAA Trigger Table v2.1.0. Classification results below.

---

## 1. Qualifying Task Classification

| Task ID | Summary | IAA Trigger Category | Qualifying? |
|---------|---------|---------------------|-------------|
| CL-7-D1 | RED gate test: `PersonaValidationError` thrown on missing/invalid YAML fields → `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | AAWP_MAT (ai-centre package path; executable test behaviour) | ✅ YES |
| CL-7-D2 | RED gate test: persona registry sync CI check integration test | AAWP_MAT + CI_WORKFLOW boundary (CI integration test output) | ✅ YES |
| CL-7-D3 | Implementation: `PersonaValidationError` type + runtime YAML front-matter validation in `PersonaLoader.ts` | AAWP_MAT (`packages/ai-centre/src/personas/PersonaLoader.ts` — core runtime behaviour change) | ✅ YES |
| CL-7-D4 | CI check: persona registry sync workflow → `.github/workflows/` | CI_WORKFLOW (new workflow file) | ✅ YES |
| CL-7-D5 | Scheduled workflow: flag overdue quarterly persona reviews → `.github/workflows/` | CI_WORKFLOW (new scheduled workflow) | ✅ YES |

**Overall Wave Category**: MIXED (AAWP_MAT + CI_WORKFLOW). Per trigger table §Classification Decision Flow: any triggering artifact activates IAA for the full PR. IAA invocation at handover is **MANDATORY**.

---

## 2. Declared Trigger Categories

| Category | Triggered By | Mandatory? |
|----------|-------------|-----------|
| AAWP_MAT | CL-7-D1, CL-7-D2, CL-7-D3 (packages/ai-centre paths, runtime behaviour) | YES — MANDATORY |
| CI_WORKFLOW | CL-7-D4, CL-7-D5 (.github/workflows/ new files) | YES — MANDATORY |
| MIXED | Combined AAWP_MAT + CI_WORKFLOW in one PR | YES — MANDATORY |

**Ambiguity check**: CLEAR — all 5 deliverables produce unambiguously triggering artifacts. No ambiguity rule invocation required.

**No AGENT_CONTRACT trigger**: This wave does not modify any `.github/agents/*.md` or governance/agents/ file. AGENT_CONTRACT overlay does not apply unless the PR diff at handover reveals unexpected agent contract changes.

---

## 3. FFA Checks IAA Will Run at Handover

### 3.1 Universal Ceremony Gate (CERT — 4 checks)

| Check ID | Check Name | What IAA Verifies |
|----------|-----------|------------------|
| CERT-001 | PREHANDOVER proof exists | File present in PR bundle at root or declared path |
| CERT-002 | Session memory exists | Session memory file present in `.agent-workspace/*/memory/` |
| CERT-003 | FAIL-ONLY-ONCE attestation declared | `fail_only_once_attested: true` in session memory preamble |
| CERT-004 | IAA audit token field present | `iaa_audit_token` field exists in PREHANDOVER proof (non-empty, non-TBD) |

### 3.2 Core Invariants Checklist (CORE-001 through CORE-023)

All 23 CORE checks applied. Key checks for this wave:

| Check ID | Applicability | Why It Matters for CL-7 |
|----------|--------------|------------------------|
| CORE-005 | Governance block in all artifacts | Session memory and PREHANDOVER must reference governance correctly |
| CORE-006 | CANON_INVENTORY alignment | Any new governance file references must be in CANON_INVENTORY |
| CORE-007 | No placeholder content | PersonaLoader.ts and new workflow files must be complete — no TODOs/stubs in production paths |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof must reference this Pre-Brief artifact path and declare expected IAA token reference |
| CORE-015 | Session memory present | Each builder agent (qa-builder, api-builder, integration-builder) must produce session memory |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-cl7-personaloader-YYYYMMDD.md` must exist at audit time |
| CORE-018 | Complete evidence artifact sweep | All: PREHANDOVER proof, session memory, iaa_audit_token field, dedicated token file — must be present before overlay checks proceed |
| CORE-020 | Zero partial pass rule | No assumed passes; all 5 deliverables verified individually |
| CORE-021 | Zero-severity-tolerance | No "minor" or "cosmetic" findings — any finding = REJECTION-PACKAGE |
| CORE-023 | Workflow integrity ripple check | D4 and D5 add new workflow files → IAA verifies syntax validity, trigger correctness, and no broken job dependencies |

### 3.3 BUILD_DELIVERABLE Overlay (AAWP_MAT — for CL-7-D1, D2, D3)

| Check ID | Check Name | Application to CL-7 |
|----------|-----------|---------------------|
| BD-000-A/B/C/D | User Journey Trace | Runtime validation path: `PersonaLoader.load(agentId)` → YAML parse → missing field → throws `PersonaValidationError`. Each step must be traceable in the diff. |
| BD-001 | Full scope delivered | All 3 AAWP_MAT deliverables (D1, D2, D3) must be present in the diff — no partial delivery |
| BD-002 | No stub/TODO in production paths | PersonaLoader.ts implementation must be complete — no TODOs, no throw-later stubs |
| BD-003 | One-time build compliance | If merged and deployed today, `PersonaLoader.load()` must throw `PersonaValidationError` for any persona missing required YAML fields — end-to-end, first time |
| BD-004 | No leftover debt from previous jobs | CL-1 tests in PersonaLoader.test.ts must remain GREEN (D3 must not break existing passing tests) |

**BD-000 Journey Declarations Required at Handover** (PREHANDOVER must state):
- Journey 1: API consumer calls `PersonaLoader.load(agentId)` → persona file has missing required YAML fields → system parses front-matter → `PersonaValidationError` is thrown → caller receives typed error.
- Journey 2: API consumer calls `PersonaLoader.load(agentId)` → persona file has valid YAML front-matter → system parses and validates → persona content returned normally.
- Journey 3: CI check runs persona registry sync validation → out-of-sync persona detected → CI step fails and PR is blocked.
- Edge cases that must be declared and implemented: missing front-matter delimiter entirely, partially present fields, malformed YAML, empty persona file.

### 3.4 CI_WORKFLOW Overlay (for CL-7-D4, D5)

| Check ID | Check Name | Application to CL-7 |
|----------|-----------|---------------------|
| OVL-CI-001 | Workflow policy correctness | D4 must actually detect persona registry out-of-sync (not just run and pass silently). D5 must actually compare `last_reviewed` dates against 90-day threshold. |
| OVL-CI-002 | Merge gate integrity | D4 and D5 must not weaken any existing merge gate checks. New checks should be additive, not replacing. |
| OVL-CI-003 | Silent failure risk | Both workflows must fail with non-zero exit codes on policy violations — no `continue-on-error` or swallowed failures. |
| OVL-CI-004 | Environment parity | Scheduled workflow (D5) must use `workflow_dispatch` as well as `schedule` to allow manual invocation and post-merge validation. |
| OVL-CI-005 | CI evidence present | **Inherent Limitation Exception (S-033) expected to apply** for D4 and D5 as new scheduled/CI workflows whose triggers are not satisfied by this PR's file changes. PREHANDOVER must explicitly invoke the S-033 exception with: (1) YAML syntax validation evidence, (2) pattern parity evidence, and (3) confirmation of `workflow_dispatch` on the modified workflow. Bare claim of "CI passed" without these three points = REJECTION-PACKAGE. |

### 3.5 FAIL-ONLY-ONCE Rules Applied at Handover

| Rule | Application |
|------|-------------|
| A-001 | IAA invocation evidence (this Pre-Brief) must be referenced in PREHANDOVER proof |
| A-002 | No class exemption claims — all builder agents subject to IAA |
| A-003 | Any ambiguity about scope → mandatory IAA invocation |
| A-029 | PREHANDOVER proof `iaa_audit_token` pre-populated with expected reference; dedicated token file written by IAA post-verdict; PREHANDOVER is read-only after commit |

---

## 4. Required PREHANDOVER Proof Structure

The producing agent(s) MUST include a PREHANDOVER proof committed to the branch before invoking IAA. The proof must contain **all** of the following fields:

```yaml
# PREHANDOVER PROOF — CL-7: LKIAC-L3 PersonaLoader Improvements

session_id: session-cl7-personaloader-YYYYMMDD
wave: CL-7
branch: copilot/cl-7-personaloader-improvements
issue: maturion-isms#1226
cs2_authorization: maturion-isms#1221 (2026-04-05)
architecture_ref: governance/aimc/AIMC_PERSONA_LIFECYCLE.md
producing_agents:
  - agent: qa-builder
    deliverables: [CL-7-D1, CL-7-D2]
  - agent: api-builder
    deliverables: [CL-7-D3]
  - agent: integration-builder
    deliverables: [CL-7-D4, CL-7-D5]
iaa_prebrief_ref: .agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260405.md
iaa_audit_token: IAA-session-cl7-personaloader-YYYYMMDD-PASS  # pre-populated expected ref
fail_only_once_attested: true
fail_only_once_version: v4.0.0 (or current version at build time)
```

**Required evidence sections** (must be present as named headings in the PREHANDOVER proof):

1. `## Scope-to-Diff Verification` — Cross-reference each deliverable (CL-7-D1 through D5) against the actual PR diff. Every declared deliverable must map to a visible diff entry. Any undeclared diff change must be explained.
2. `## User Journey Declarations` — Per BD-000: explicit journey statements for all 3 application behaviour flows listed in §3.3 above, including edge case declarations.
3. `## Test Evidence` — RED gate confirmation: CL-7-D1 and D2 tests FAIL before D3 implementation, GREEN after. Evidence of test run output (file or log reference).
4. `## CI_WORKFLOW Evidence (OVL-CI-005)` — For D4 and D5: YAML syntax validation output, pattern parity statement, and `workflow_dispatch` confirmation. S-033 exception must be explicitly invoked.
5. `## No-Regression Statement` — Confirmation that CL-1 tests (existing PersonaLoader.test.ts tests) remain GREEN post-D3 implementation.
6. `## Session Memory References` — File paths for all builder agent session memories committed to this branch.

**PREHANDOVER proof file path**: root-level file named `PREHANDOVER_PROOF_CL7_PERSONALOADER.md` (or equivalent clearly named file at root of working directory). Must be committed before IAA is invoked.

**IMMUTABILITY NOTICE**: Per A-029 §4.3b — once committed, the PREHANDOVER proof is READ-ONLY. IAA will NOT edit it. IAA writes its verdict to a separate dedicated token file.

---

## 5. Scope Blockers and Governance Conflicts Identified

### ⚠️ BLOCKER-1 — Test File Path Discrepancy (MUST RESOLVE BEFORE BUILD STARTS)

**Issue**: The wave scope (in both the pre-brief request and issue #1226) specifies the test file path as:
> `packages/ai-centre/src/personas/PersonaLoader.test.ts`

However, the **actual existing test file** is at:
> `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts`

**Risk**: If qa-builder writes CL-7-D1 tests to `src/personas/PersonaLoader.test.ts`, the tests will be in an unreachable location outside the established `__tests__` convention, and the existing CL-1 tests in `src/__tests__/personas/` will NOT be co-located with the new CL-7 tests. This may also break test discovery.

**Required action**: Foreman must confirm the authoritative target path before qa-builder begins D1. IAA recommendation: use the existing `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` file and add CL-7 tests to it (consistent with CL-1 test precedent). If a separate file is intended, Foreman must explicitly authorize and explain in the wave-start issue.

**IAA position**: This is an advisory blocker. Build may proceed with foreman confirmation. IAA will fail any PREHANDOVER proof that references a test file not aligned with the established `__tests__/` convention unless explicit CS2/Foreman authorization for deviation is documented.

---

### ⚠️ ADVISORY-1 — Architecture Version Reference (Non-blocking — Verify at Build Time)

**Issue**: Issue #1226 states "Architecture: Frozen per `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` v1.0.1". However, the actual file on `main` at the time of this Pre-Brief is at **v1.1.0**.

**Assessment**: v1.1.0 is the more recent and authoritative version. The v1.0.1 reference in the issue is likely a stale copy from an earlier planning artifact. The substantive content (§5 YAML schema, §5.4 validation requirements, `PersonaValidationError` requirements) is present in v1.1.0 and is the correct reference.

**Required action**: Builder agents must use `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` (current version on `main`, v1.1.0) as the authoritative architecture reference. All deliverables should cite v1.1.0, not v1.0.1. PREHANDOVER proof should reference the current version.

**IAA position**: Advisory only — this does not block the build. IAA will not issue REJECTION-PACKAGE solely on this basis. If at handover the PREHANDOVER proof cites v1.0.1, IAA will note it as an accuracy finding and require correction.

---

### ℹ️ INFORMATION-1 — PersonaValidationError Type Absent from types/index.ts

**Observation**: As of wave-start, `PersonaValidationError` does NOT exist in `packages/ai-centre/src/types/index.ts`. Only `PersonaNotFoundError` is present. CL-7-D3 must create this type as part of the implementation deliverable.

**Assessment**: This is expected and correct — D1 (RED gate tests) should reference `PersonaValidationError` before it exists, causing test compilation failure (RED gate). D3 introduces the type. This is the intended QA-first → build-to-green sequence.

**IAA expectation at handover**: `PersonaValidationError` must be exported from `packages/ai-centre/src/types/index.ts` (consistent with `PersonaNotFoundError` pattern at line 370). The class must follow the same `Error` extension pattern. IAA will check this in BD-002 (no stubs) and BD-003 (end-to-end functional).

---

### ℹ️ INFORMATION-2 — CANON_INVENTORY Does Not Contain AIMC_PERSONA_LIFECYCLE.md

**Observation**: `governance/CANON_INVENTORY.json` (198 canon entries checked) does not contain an entry for `governance/aimc/AIMC_PERSONA_LIFECYCLE.md`. This file is a governance artifact that is the frozen architecture reference for this wave.

**Assessment**: AIMC governance files in `governance/aimc/` appear to be managed separately from the canonical governance layer in `governance/canon/`. This is consistent with the existing pattern — no aimc/ files appear in CANON_INVENTORY. This is not a new gap introduced by CL-7.

**IAA position**: Advisory note only. If CL-7 produces any new governance artifacts (e.g., updated registry, new governance file), the builder/foreman must confirm whether CANON_INVENTORY registration is required per CORE-006. IAA will check this at handover.

---

### ℹ️ INFORMATION-3 — OVL-CI-005 S-033 Exception Pre-Declared for D4 and D5

**Observation**: CL-7-D4 (persona registry sync workflow) and CL-7-D5 (quarterly review scheduled workflow) are new `.github/workflows/` files. Their trigger conditions (`schedule:`, `workflow_dispatch:`) mean they cannot be fully exercised within this PR.

**IAA expectation**: The S-033 Inherent Limitation Exception applies. The PREHANDOVER proof MUST contain all three required evidence items (YAML syntax validation, pattern parity, `workflow_dispatch` presence). A bare statement that "the workflow looks correct" does NOT satisfy OVL-CI-005.

---

## 6. Summary — IAA Invocation Requirements at Handover

| Requirement | Detail |
|------------|--------|
| IAA invocation mandatory | YES — MIXED trigger (AAWP_MAT + CI_WORKFLOW) |
| Adoption phase | PHASE_B_BLOCKING — hard gate |
| Pre-Brief reference for PREHANDOVER proof | `.agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260405.md` |
| Expected IAA token file path | `.agent-admin/assurance/iaa-token-session-cl7-personaloader-YYYYMMDD.md` |
| PREHANDOVER proof must be committed before IAA invocation | YES — read-only once committed (A-029) |
| PREHANDOVER proof `iaa_audit_token` | Pre-populate with expected reference: `IAA-session-cl7-personaloader-YYYYMMDD-PASS` |
| Total FFA checks at handover | CERT: 4 + CORE: 23 + BD overlay: ~10 + CI overlay: 5 = approximately 42 checks |
| PHASE_A_ADVISORY | NO — Phase B blocking is active. REJECTION-PACKAGE prevents PR from being opened. |

---

## 7. Pre-Brief Completion Confirmation

> "Pre-Brief artifact generated for Wave CL-7 (LKIAC-L3 PersonaLoader Improvements).
>
> Qualifying tasks found: **5 of 5** (CL-7-D1 through CL-7-D5 are all IAA-triggering).
> Trigger categories declared: **AAWP_MAT + CI_WORKFLOW (MIXED)**.
> IAA mandatory at handover: **YES — PHASE_B_BLOCKING hard gate**.
> Scope blockers identified: **1 blocking advisory (test file path discrepancy — BLOCKER-1)** + 3 informational advisories.
>
> Foreman must resolve BLOCKER-1 before qa-builder begins CL-7-D1.
>
> Phase 0 complete. Phases 1–4 not executed — this is a Pre-Brief session only."

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA**: independent-assurance-agent v6.2.0 | Contract 2.3.0
**Pre-Brief generated**: 2026-04-05
**Next IAA invocation**: At wave handover, when all 5 deliverables are complete and PREHANDOVER proof is committed.
