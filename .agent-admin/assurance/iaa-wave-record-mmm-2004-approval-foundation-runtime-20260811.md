# IAA WAVE RECORD
## Wave: MMM Issue #2004 — Approval Workflow Foundation Runtime Build-to-Green

**Wave Reference**: MMM Issue #2004  
**Repository**: APGI-cmy/maturion-isms  
**Branch**: apgi-cmy-jubilant-journey  
**Head Commit**: 31be19b58883da97f9919f556f4459830a44bad4  
**Date**: 2026-08-11  
**Status**: BLOCKED CHECKPOINT RECORD — NOT AN IAA VERDICT

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

This record is retained only as a current-head checkpoint of builder-visible facts. It does **not** constitute an IAA pre-brief approval, IAA final assurance, or wave authorization record for current-head handover.

**7 Edge Functions** are in current PR scope against migration `20260810000001_mmm_approval_workflow_foundation.sql`:

1. `mmm-approval-round-create` — Creates round, approvers, invitations, audit events; state: draft→invited
2. `mmm-approval-invite-accept` — Token validation, user binding; state: invited→in_review; with explicit 500 on lookup failure before any NOT NULL audit insert
3. `mmm-approval-proposed-changes-submit` — Immutable snapshot; schema-aligned audit events
4. `mmm-approval-decision-submit` — L2/L3 consensus + domain lock; correct decision_at field
5. `mmm-approval-level1-response-submit` — L1 decision + learning events; correct null approval_level
6. `mmm-approval-lock-transition` — Service-role lock transitions; UUID actor_id
7. `mmm-approval-workspace-read` — Workspace read path with JWT/RLS filtering

**Migration**: 8 tables, 10 enums, org-level RLS via mmm_current_user_org_id()

### 1.3 Executable Test Evidence

| Test File | Tests | Status |
|-----------|-------|--------|
| approval-edge-functions-executable.test.ts | stale | ⚠️ Needs rerun after seven-function expansion at current head |
| approval-foundation-contract.test.ts | not reasserted here | ⚠️ No positive claim |
| approval-workflow-foundation-red.test.ts | not reasserted here | ⚠️ No positive claim |
| sidebar-context-and-mps-approval.test.ts | not reasserted here | ⚠️ No positive claim |
| **Total** | **current-head verdict pending** | **❌ BLOCKED** |

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

IAA is independent of Foreman and builder. No IAA verdict is created or implied by this record. IAA must:
1. Independently verify the 26 direct Edge Function tests cover all material schema paths
2. Independently verify the audit lookup guard exists and returns 500 before NOT NULL write
3. Independently verify RLS enforcement cannot be bypassed client-side
4. Independently verify immutability constraints on audit/proposed_changes tables
5. Binary verdict: ASSURANCE-TOKEN (PASS) or REJECTION-PACKAGE (FAIL with named items)

**IAA Non-Substitution**: Foreman cannot substitute for IAA verdict. IAA must issue independently.

---

## 3. CURRENT BLOCKERS

1. Foreman STOP_AND_FIX requires current-head-only truthful artifacts and removal of stale positive claims.
2. Seven-function direct executable coverage is required; prior suite omitted `mmm-approval-workspace-read`.
3. CS2 must resolve the non-retroactive prebrief/delegation breach for Issue #2004 integration-builder lane.
4. No ECAP or IAA progression may be claimed until the above conditions are cleared by their proper authorities.

---

## 4. PRE-HANDOVER GATE CHECKLIST

| Gate | Status | Evidence |
|------|--------|----------|
| Worktree clean at current head | ⏳ PENDING | Re-check after builder remediation commit |
| Builder QP PASS | ❌ BLOCKED | Active Foreman STOP_AND_FIX at current head |
| IAA pre-brief present and applicable | ❌ DISPUTED | CS2 must resolve Issue #2004 lane applicability/order |
| Admin artifacts truthful at current head | ❌ BLOCKED | stale positive artifacts must not stand |
| ECAP admin validation | 🚫 NOT STARTED | No self-created ECAP state permitted |
| IAA final assurance | 🚫 NOT STARTED | No self-created IAA verdict permitted |
| handover-allowed record | 🚫 BLOCKED | must remain false until proper gate progression |
| PR open at head | ⏳ PENDING | Out of scope for this checkpoint |
| Required CI checks green | ⏳ PENDING | Cannot be claimed here |

---

## 5. WAVE RECORD STATUS

| Stage | Status | Date |
|-------|--------|------|
| Pre-brief | ⚠️ DISPUTED | historical artifact exists; applicability/order unresolved |
| Builder appointment | ⚠️ DISPUTED | historical artifact exists; applicability/order unresolved |
| Build execution | ✅ COMPLETE | implementation commits exist on branch |
| Foreman QP | ❌ STOP_AND_FIX | current head requires remediation |
| ECAP admin validation | 🚫 NOT STARTED | — |
| IAA final assurance | 🚫 NOT STARTED | — |
| CS2 merge decision | ⏳ PENDING | — |

---

**Checkpoint Authority**: Builder-authored blocked-state record only  
**IAA Independence**: REQUIRED — only IAA may issue IAA verdicts  
**ECAP Boundary**: Admin artifacts only; no readiness authority  
**CS2 Merge Authority**: Reserved — no autonomous merge
