# IAA Wave Record — wave-mmm-descriptor-generation-hardening-2026-07-01

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF
PR: #1885
WAVE: wave-mmm-descriptor-generation-hardening-2026-07-01
WAVE_TASKS_PATH: .agent-admin/prs/pr-1885/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD

EXPECTED_QA_SCOPE:
- Descriptor generation grounding path in apps/mmm CriteriaManagement.
- Deterministic gerund and grammar normalization output behavior.
- Regression coverage in modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx.
- Negative-path checks for malformed descriptor inputs and normalization stability.

EXPECTED_FAILURE_MODES:
- Ungoverned foreman direct patch recurrence (LOCAL-GOV-2026-07-01-FOREMAN-DIRECT-IMPLEMENTATION).
- Delegation-order breach (implementation commit before canonical pre-brief and appointment).
- Descriptor output drift (non-deterministic grammar or gerund normalization).
- Claimed green without complete MMM QA evidence.

FOREMAN_INSTRUCTIONS:
- Preserve delegation order proof: pre-brief -> builder appointment -> first implementation commit.
- Enforce builder-only delivery ownership and block foreman direct implementation.
- Keep scope limited to descriptor grounding and deterministic grammar normalization for MMM.
- Require executable MMM evidence before QP pass or handover posture.

IAA_WILL_QA:
- Verify descriptor grounding and deterministic grammar normalization behavior at runtime.
- Verify regression coverage for modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx.
- Verify delegation-order coherence and builder-only ownership evidence.
- Verify QP and ECAP handover evidence integrity before final token issuance.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## IAA Assurance Verdict

Date: 2026-07-01  
PR: #1885 — Harden MMM descriptor generation grammar and subject-knowledge grounding  
Head SHA reviewed: `833c72cbd77c982d09a1710617ab2b6e6aceb7b6`  
Invocation agent: foreman-v2-agent  
Producing agent(s): ui-builder + foreman-v2-agent + execution-ceremony-admin-agent  
Class: AAWP_MAT (product-facing BUILD/T2)  
Ceremony-admin appointed: YES  
STOP-AND-FIX: ACTIVE

Independence: CONFIRMED (IAA did not produce implementation artifacts in this PR scope).

### Check Summary

- FAIL-ONLY-ONCE:
  - A-001 invocation evidence present: PASS ✅ (canonical IAA pre-brief in this wave record)
  - A-002 class-exemption violation: PASS ✅ (not an agent-contract PR)
- CORE-020 Zero partial pass rule: FAIL ❌ (required handover evidence absent)
- CORE-021 Zero-severity-tolerance: FAIL ❌ (blocking findings present)
- BUILD_DELIVERABLE functional checks (sampled against changed scope + test execution): PASS ✅
  - Deterministic gerund normalization implemented in `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
  - Criterion-scoped MMM subject knowledge grounding implemented
  - `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx` updated with regression coverage
  - Local verification: `pnpm exec vitest run --config vitest.mmm-b4.config.ts modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx` → 56/56 PASS
- Governance ordering / scope discipline:
  - Delegation order proof coherent (`pre-brief -> builder appointment -> first implementation commit`): PASS ✅
  - Changed files remain within declared implementation + governance control scope: PASS ✅
- ACR auto-reject checks (ceremony-admin = YES):
  - ACR-01 ECAP reconciliation summary in Tier 3 proof bundle: FAIL ❌ (no active PREHANDOVER proof bundle committed for this wave/PR)
  - ACR-08 stale artifact path reference: FAIL ❌ (`.agent-admin/ecap/wave-mmm-descriptor-generation-hardening-2026-07-01-pr-1885-ecap-20260701.md` exists locally but is not tracked at current HEAD)
  - ACR-09 gate set identified in proof bundle: FAIL ❌ (no `gate_set_checked` evidence in active bundle)
  - ACR-16 PREHANDOVER `iaa_audit_token` / active-bundle coherence final-state linkage: FAIL ❌ (no active PREHANDOVER artifact with resolvable token field)

MERGE GATE PARITY:
- `merge-gate/verdict`: PASS ✅ (CI)
- `governance/alignment`: PASS ✅ (CI)
- `stop-and-fix/enforcement`: PASS ✅ (CI)
- Local parity decision: FAIL ❌ (IAA blocking findings remain unresolved)

Result: **REJECTION-PACKAGE**

## REJECTION_HISTORY

### 2026-07-01 — IAA-RJ-PR1885-20260701

- PR: #1885
- Head SHA: `833c72cbd77c982d09a1710617ab2b6e6aceb7b6`
PHASE_B_BLOCKING_TOKEN: IAA-RJ-PR1885-20260701-FAIL
- Finding summary:
  1. Required active PREHANDOVER proof bundle for this wave/PR is not committed/resolvable.
  2. ECAP artifact path is stale at current HEAD (`.agent-admin/ecap/wave-mmm-descriptor-generation-hardening-2026-07-01-pr-1885-ecap-20260701.md` is untracked).
  3. ACR-01/08/09/16 evidence chain cannot be satisfied without active PREHANDOVER artifact fields (`gate_set_checked`, resolvable `iaa_audit_token`, active-bundle coherence linkage) and committed ECAP evidence.
  4. Under CORE-020, missing mandatory evidence is a blocking fail.
- Fix required:
  1. Commit active PREHANDOVER proof artifact for PR #1885 and this wave with explicit gate inventory (`gate_set_checked`) and final-state coherence fields.
  2. Commit the ECAP re-validation artifact on branch head (or replace with committed canonical path) and ensure reconciliation summary is linked in active bundle.
  3. Re-invoke IAA at current head after artifact chain is complete.
- Classification:
  - F-001: Ceremony
  - F-002: Ceremony
  - F-003: Ceremony
  - F-004: Systemic (preventable recurring ceremony-evidence completeness miss; upstream prevention action: template hardening + CI enforcement for required active-bundle PREHANDOVER and ECAP tracked-path checks)

IAA_REJECTION_NOTICE:
- RCA_REVIEW: REFER_BACK
- HANDOVER_ALLOWED: no
- RESULT: REJECTED_BACK_TO_PRODUCER

### 2026-07-01 — IAA-RJ-PR1885-20260701-R2

- PR: #1885
- Head SHA: `5176eca4709d8de296c0b07493ad57c886d392be`
PHASE_B_BLOCKING_TOKEN: IAA-RJ-PR1885-20260701-R2-FAIL
- Finding summary:
  1. Active-bundle head coherence is stale: PREHANDOVER and ECAP artifacts still declare `833c72cbd77c982d09a1710617ab2b6e6aceb7b6` while branch HEAD is `5176eca4709d8de296c0b07493ad57c886d392be`.
  2. Active-bundle contradiction remains in wave tracker: task state/checklist still show IN PROGRESS and open `[ ]` items for Foreman QP + ECAP while PREHANDOVER declares `QP VERDICT: PASS` and `ecap_result: PASS`.
  3. Final assurance token not yet recorded in active bundle (`wave-current-tasks.md` still open for IAA token), so complete-state coherence is not satisfied.
- Fix required:
  1. Reconcile active-bundle head reference fields to current HEAD across PREHANDOVER/ECAP/wave-state artifacts.
  2. Resolve wave task-tracker contradictions so task/checklist status matches declared QP/ECAP state.
  3. Re-run IAA only after active-bundle state is internally coherent at current HEAD.
- Classification:
  - F-005: Ceremony
  - F-006: Ceremony
  - F-007: Systemic (recurring active-bundle state coherence drift; prevention action: enforce active-bundle consistency gate before IAA re-invocation)

IAA_REJECTION_NOTICE:
- RCA_REVIEW: REFER_BACK
- HANDOVER_ALLOWED: no
- RESULT: REJECTED_BACK_TO_PRODUCER

### 2026-07-01 — IAA-PR1885-20260701-R3-FINAL

- PR: #1885
- Head SHA: `64ad593ec83f7816d1e81655cd28d067e72e72ab`
- Invocation: foreman-v2-agent
- Produced by: ui-builder + foreman-v2-agent + execution-ceremony-admin-agent
- Category: AAWP_MAT (product-facing BUILD/T2)
- Ceremony-admin: YES
- Independence: CONFIRMED

Check outcomes:
- FAIL-ONLY-ONCE A-001: PASS ✅
- FAIL-ONLY-ONCE A-002: PASS ✅
- CORE-020: PASS ✅
- CORE-021: PASS ✅
- BUILD_DELIVERABLE overlay: PASS ✅
- ACR-01 through ACR-16 (ECAP-involved active bundle): PASS ✅
- MERGE GATE PARITY: PASS ✅ (`merge-gate/verdict`, `governance/alignment`, `stop-and-fix/enforcement`)
- Local verification: `pnpm exec vitest run --config vitest.mmm-b4.config.ts modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx` → PASS (56/56)

Result: ASSURANCE-TOKEN

## TOKEN

### 2026-07-01 — IAA-PR1885-20260701-R3-FINAL

PHASE_B_BLOCKING_TOKEN: IAA-session-304-20260701-PASS

- PR: #1885 — Harden MMM descriptor generation grammar and subject-knowledge grounding
- Head SHA: `64ad593ec83f7816d1e81655cd28d067e72e72ab`
- Merge gate parity: PASS
- Verdict: ASSURANCE-TOKEN
- Adoption phase: PHASE_B_BLOCKING
