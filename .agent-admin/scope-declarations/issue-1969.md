# Scope Declaration — Issue #1969 Foreman Bootstrap Fail-Closed Repair

**Status:** AUTHORIZED / CS2-EXTENDED / IN PROGRESS
**CS2 authority:** Johan Ras, 2026-07-26  
**Base SHA:** `36c7f42a1a9d23fe4fd9d9f7f12a7ef7beada919`  
**Branch:** `agent/foreman-bootstrap-fail-closed-1969`  
**Issue:** #1969  
**Module/product impact:** governance bootstrap only; no MMM runtime or infrastructure mutation

## Authorized outcome

Restore the missing Foreman Tier 2 session-memory template and ensure the wake-up/bootstrap path fails nonzero whenever any Tier 2 file declared as required by the active agent contract is missing. Under the 2026-07-26 CS2 extension, also correct the prehandover gate so truthful pending/negative fields in ordinary session memories do not create a pre-IAA deadlock, while actual positive handover/readiness claims remain fail-closed.

## Initial carrier

This first commit creates only the scope declaration required to open a draft PR and obtain a stable PR number. The PR-scoped task carrier, canonical IAA pre-brief, appointment/delegation record, implementation changes, regression evidence, QP, ECAP and final IAA evidence must be added in governed order.

## Planned file scope

- `.agent-admin/scope-declarations/issue-1969.md` - this bounded authority and scope carrier.
- `.agent-admin/prs/pr-<PR_NUMBER>/wave-current-tasks.md` - PR-scoped task and acceptance register.
- `.agent-admin/assurance/iaa-wave-record-foreman-bootstrap-repair-1969-20260726.md` - canonical pre-brief and final assurance carrier.
- `.agent-admin/builder-appointments/issue-1969-governance-repair.md` - bounded execution appointment/delegation.
- `.agent-workspace/foreman-v2/knowledge/session-memory-template.md` - restored Tier 2 template.
- `.github/scripts/foreman-prehandover-lane-gate.js` - semantic positive-claim detection for ordinary session memories while explicit PREHANDOVER paths remain lane intent.
- `.github/scripts/wake-up-protocol.sh` - fail-closed Tier 2 required-file validation.
- Focused executable regression test and CI wiring paths determined from repository convention before implementation.
- PR-scoped QP, ECAP, session/prehandover, and exact-head evidence paths required by the live gates.

## Non-scope

- `.github/agents/foreman-v2-agent.md`
- product/runtime code
- MMM descriptor or approval implementation
- Supabase/Vercel changes
- #1959 remediation before governance-repair closure
- direct push to `main`
- control weakening, waiver, or risk acceptance
- bypass of the current-head handover control for explicit PREHANDOVER artifacts or positive readiness/handover claims

## Extended acceptance boundary

- `handover_allowed: false` and `final_iaa_verdict: PENDING` in an ordinary session-memory carrier are truthful evidence and do not activate the lane by themselves.
- An explicit PREHANDOVER artifact activates the lane regardless of its wording.
- An actual positive readiness/handover claim in an ordinary scanned carrier activates the lane.
- Positive claims require the existing valid current-head `handover-allowed.json`; no control requirement is removed or weakened.

## Stop conditions

The wave remains blocked if the canonical pre-brief is missing, ordered authority cannot be proven, tests do not cover the negative path, CI is not green at the frozen head, or independent IAA does not PASS.
