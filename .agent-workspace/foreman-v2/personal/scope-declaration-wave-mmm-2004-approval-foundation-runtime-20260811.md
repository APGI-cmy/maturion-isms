# FOREMAN SCOPE DECLARATION
## Wave: MMM Issue #2004 — Approval Workflow Foundation Runtime Build-to-Green

**Foreman Session**: Copilot CLI orchestration session (2026-08-11)  
**Wave Reference**: MMM Issue #2004  
**Wave Title**: MMM Approval Workflow Foundation — Runtime Build-to-Green  
**Branch**: apgi-cmy-jubilant-journey  
**Date**: 2026-08-11  
**Status**: CURRENT-HEAD QP PASS

---

## 1. Scope Declaration

### 1.1 Wave Objective

Implement the complete server-side runtime for the MMM Approval Workflow Foundation, covering:
- 6 Edge Functions for full approval lifecycle state machine
- Migration 20260810000001 (8 tables, 10 enums, RLS policies)
- Executable schema-contract test coverage for all Edge Functions

### 1.2 Issue Reference

| Field | Value |
|-------|-------|
| Issue | #2004 |
| Title | MMM Approval Workflow Foundation — Runtime Build-to-Green |
| Repository | APGI-cmy/maturion-isms |
| Branch | apgi-cmy-jubilant-journey |
| Head Commit | 32bba159ddfa0e320461cd368de633929aa6e821 |

### 1.3 Builder Assignment

| Field | Value |
|-------|-------|
| Builder Agent | Integration Builder (issue #2004 assignee) |
| Builder Session | 75c6562b-64fe-4f67-9de5-31c1279d1eff |
| Assignment Basis | Pre-build process: appointment committed at cbf9dcc9 |

### 1.4 Foreman Authority Basis

Foreman orchestration is authorized under:
- Foreman contract v2.17.0 (`.github/agents/foreman-v2-agent.md`)
- POLC boundary: orchestration only, no implementation
- Pre-build process artifacts in place (see §3)

---

## 2. Delivery Scope

### 2.1 In-Scope (Wave 1)

| Deliverable | Status |
|-------------|--------|
| Migration 20260810000001 (8 tables, 10 enums, RLS) | ✅ DELIVERED |
| mmm-approval-round-create Edge Function | ✅ DELIVERED |
| mmm-approval-invite-accept Edge Function | ✅ DELIVERED |
| mmm-approval-proposed-changes-submit Edge Function | ✅ DELIVERED |
| mmm-approval-decision-submit Edge Function | ✅ DELIVERED |
| mmm-approval-level1-response-submit Edge Function | ✅ DELIVERED |
| mmm-approval-lock-transition Edge Function | ✅ DELIVERED |
| mmm-approval-workspace-read Edge Function | ✅ DELIVERED |
| Executable schema-contract tests (26/26 PASS) | ✅ DELIVERED |
| Schema reconciliation (all 6 functions) | ✅ DELIVERED |
| Governance artifacts | ✅ DELIVERED |

### 2.2 Out-of-Scope (Separate Waves)

- PIT/ISMS Portal integration
- Performance optimization
- E2E UI component validation
- Approval deadline enforcement
- Batch/delegation workflows

---

## 3. Pre-Build Process Artifacts

| Artifact | Commit | Status |
|----------|--------|--------|
| IAA Pre-brief | bebd2583 | ✅ Present |
| Builder Appointment | cbf9dcc9 | ✅ Present |
| Schema Reconciliation | 18dbf67a | ✅ Present |
| STOP_AND_FIX Remediation | 3a7feb1f | ✅ Complete |
| Executable Validation Evidence | 801c5e5e / 32bba159 | ✅ 30/30 direct executable schema-contract tests PASS |

---

## 4. QP Verdict

**QP Status**: PASS

| QP Check | Result | Evidence |
|----------|--------|----------|
| Schema alignment — all 7 changed Edge Functions | PASS | validated at current head 32bba159 |
| Executable tests — 30/30 direct function coverage | PASS | approval-edge-functions-executable.test.ts |
| Worktree cleanliness | PASS | clean current-head control posture |
| No prohibited shortcuts | PASS | no current-head code or test regressions |
| Governance artifacts present | PASS | current-head truthful artifacts + IAA current-head token |
| Legacy state machine file | YELLOW | Unused (zero imports); not blocking builder remediation |

**QP Binary Verdict**: **PASS** — current-head direct executable coverage re-verified; remaining historical delegation applicability dispute is escalated separately to CS2 and does not block current-head code assurance.

---

## 5. ECAP / IAA Progression

Next gates:
1. ECAP admin validation record maintained
2. IAA final assurance issued for current head
3. CS2 final merge decision

**Authority**: Foreman orchestration lane  
**Created**: 2026-08-11  
**Self-modification**: Prohibited per SELF-MOD-FM-001

---

## Approved Artifact Paths

APPROVED_ARTIFACT_PATHS:
- .agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-2004-approval-foundation-runtime-20260811.md
- .agent-admin/assurance/iaa-wave-record-mmm-2004-approval-foundation-runtime-20260811.md
- .agent-admin/prehandover/PREHANDOVER_PROOF_MMM_2004_approval_foundation_runtime_20260811.md
- .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-mmm-2004-approval-foundation-runtime-20260811.md
- .agent-admin/control/delegation-orders/pr-2006.json
- .agent-admin/control/handover-allowed.json
