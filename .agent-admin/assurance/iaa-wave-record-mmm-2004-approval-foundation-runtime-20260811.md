# IAA WAVE RECORD
## Wave: MMM Issue #2004 — Approval Workflow Foundation Runtime Build-to-Green

**Wave Reference**: MMM Issue #2004  
**Repository**: APGI-cmy/maturion-isms  
**Branch**: apgi-cmy-jubilant-journey  
**Head Commit**: 19f8373c  
**Date**: 2026-08-11  
**Status**: IAA PRE-BRIEF BINDING — AWAITING IAA FINAL ASSURANCE

---

## 1. IAA PRE-BRIEF PACKAGE

### 1.1 Wave Identity

| Field | Value |
|-------|-------|
| Issue | #2004 |
| Title | MMM Approval Workflow Foundation — Runtime Build-to-Green |
| Builder | Integration Builder (session 75c6562b) |
| Foreman | Copilot CLI orchestration (2026-08-11) |
| Pre-brief Commit | bebd2583 |
| Appointment Commit | cbf9dcc9 |

### 1.2 What Was Built

**6 Edge Functions** implementing the full MMM Approval Workflow state machine against migration `20260810000001_mmm_approval_workflow_foundation.sql`:

1. `mmm-approval-round-create` — Creates round, approvers, invitations, audit events; state: draft→invited
2. `mmm-approval-invite-accept` — Token validation, user binding; state: invited→in_review; with explicit 500 on lookup failure before any NOT NULL audit insert
3. `mmm-approval-proposed-changes-submit` — Immutable snapshot; schema-aligned audit events
4. `mmm-approval-decision-submit` — L2/L3 consensus + domain lock; correct decision_at field
5. `mmm-approval-level1-response-submit` — L1 decision + learning events; correct null approval_level
6. `mmm-approval-lock-transition` — Service-role lock transitions; UUID actor_id

**Migration**: 8 tables, 10 enums, org-level RLS via mmm_current_user_org_id()

### 1.3 Executable Test Evidence

| Test File | Tests | Status |
|-----------|-------|--------|
| approval-edge-functions-executable.test.ts | 26/26 | ✅ PASS |
| approval-foundation-contract.test.ts | 10/10 | ✅ PASS |
| approval-workflow-foundation-red.test.ts | 8/8 | ✅ PASS |
| sidebar-context-and-mps-approval.test.ts | 15/15 | ✅ PASS |
| **Total** | **59/59** | **✅ PASS** |

### 1.4 Schema Reconciliation Evidence

All critical schema mismatches fixed (from STOP_AND_FIX at commit 516ac3f5):

| Fix | Function | Before | After |
|-----|----------|--------|-------|
| Status enum | round-create | 'drafted' | 'draft' |
| Timestamp field | all functions | timestamp | actor_role + details |
| Non-existent columns | round-create | framework_id etc. | removed |
| Decision timestamp | decision-submit | decided_at | decision_at |
| Organisation lookup | invite-accept | invitations.org_id | round.org_id |
| Accepted timestamp | invite-accept | updated_at | accepted_invite_at |
| Actor ID type | lock-transition | string 'system' | UUID '00000000...' |
| Null lookup guard | invite-accept | no guard | explicit 500 before audit |

### 1.5 Security Model

- Zero client-side bypass: all state transitions enforced server-side
- RLS: org-level isolation on all tables via mmm_current_user_org_id()
- Immutability: audit events and proposed changes immutable
- Idempotency: notification events use idempotency keys

### 1.6 Known Non-Blocking Issues

| Item | Risk | Disposition |
|------|------|-------------|
| Legacy state machine file (approvalWorkflowStateMachine.ts) | None — zero imports confirmed | Delete in Wave 2 |
| UI E2E validation | Minor — components wired to functions | Post-handover validation |

---

## 2. IAA INDEPENDENCE DECLARATION

IAA is independent of Foreman and builder. IAA must:
1. Independently verify the 26 direct Edge Function tests cover all material schema paths
2. Independently verify the audit lookup guard exists and returns 500 before NOT NULL write
3. Independently verify RLS enforcement cannot be bypassed client-side
4. Independently verify immutability constraints on audit/proposed_changes tables
5. Binary verdict: ASSURANCE-TOKEN (PASS) or REJECTION-PACKAGE (FAIL with named items)

**IAA Non-Substitution**: Foreman cannot substitute for IAA verdict. IAA must issue independently.

---

## 3. ECAP ADMIN BOUNDARY

### 3.1 Admin Artifacts for ECAP Review

| Artifact | Location | Status |
|----------|----------|--------|
| Scope declaration | .agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-2004-* | ✅ Created |
| IAA pre-brief binding | This file (§1) | ✅ Created |
| Builder appointment | Commit cbf9dcc9 | ✅ Committed |
| Pre-brief | Commit bebd2583 | ✅ Committed |
| Remediation evidence | FOREMAN_REMEDIATION_EVIDENCE_MMM_2004.md | ✅ Committed |
| QP verdict | Foreman scope declaration §4 | ✅ Recorded |

### 3.2 ECAP Boundary Rule

ECAP validates admin artifacts only. ECAP cannot:
- Substitute for IAA assurance verdict
- Claim build readiness (that is Foreman/QP domain)
- Override IAA or Foreman authority

---

## 4. PRE-HANDOVER GATE CHECKLIST

| Gate | Status | Evidence |
|------|--------|----------|
| Worktree clean at 19f8373c | ✅ PASS | git status clean |
| Builder QP PASS | ✅ PASS | Foreman QP verdict (scope declaration §4) |
| IAA pre-brief present and bound | ✅ PASS | This file + commit bebd2583 |
| Admin artifacts present | ✅ PASS | Scope declaration + IAA wave record |
| ECAP admin validation | ⏳ PENDING | Awaiting ECAP review |
| IAA final assurance | ⏳ PENDING | Awaiting IAA verdict |
| handover-allowed record | ⏳ PENDING | To be created after IAA PASS |
| PR open at head | ⏳ PENDING | No open PR yet for apgi-cmy-jubilant-journey |
| Required CI checks green | ⏳ PENDING | PR must be opened to run checks |

---

## 5. WAVE RECORD STATUS

| Stage | Status | Date |
|-------|--------|------|
| Pre-brief | ✅ COMPLETE | Prior to build (bebd2583) |
| Builder appointment | ✅ COMPLETE | cbf9dcc9 |
| Build execution | ✅ COMPLETE | Multiple commits through 19f8373c |
| Foreman QP | ✅ PASS | 2026-08-11 |
| ECAP admin validation | ⏳ PENDING | — |
| IAA final assurance | ⏳ PENDING | — |
| CS2 merge decision | ⏳ PENDING | — |

---

**Wave Authority**: Foreman (Copilot CLI, 2026-08-11)  
**IAA Independence**: REQUIRED — IAA must issue independently  
**ECAP Boundary**: Admin artifacts only; no readiness authority  
**CS2 Merge Authority**: Reserved — no autonomous merge
