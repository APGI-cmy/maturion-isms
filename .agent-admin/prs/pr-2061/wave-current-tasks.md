# PR #2061 Wave Current Tasks — W0 Safety Envelope and Decision-Record Containment

PR: #2061  
Issue: #2053 — W0: safety envelope and decision-record containment  
Wave: W0-SAFETY-CONTAINMENT-20261004  
Branch: copilot/implement-safety-envelope-containment  
Base branch: main  
Initial planning head SHA: d2485fa5d502bf8800a7df94bc3caef69cda30da  
CS2 authorization: PR #2061 comment 5978529004 (2026-10-04)  
Status: QA_TO_RED_ACCEPTED_IMPLEMENTATION_ROUTE_NOT_AUTHORIZED
iaa_prebrief_path: `.agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md`

## Wave boundary

- In scope: W0 control baseline, PR/work-item-scoped safety-envelope and decision-record design/validation, fail-closed kill-switch/circuit-breaker QA-to-RED, and a bounded QA route.
- Out of scope: active-CS2 activation, live merge action, successor dispatch, protected Tier 1/2/3 or CANON edits, product/database/deployment changes, automatic reset, spend telemetry, and pilot-concurrency changes.
- Limits requiring exact enforcement when implemented: maximum active work items `1`, material remediation attempts `1`, dispatch runtime `30 minutes`, total work-item runtime `2 hours`, and runtime-only spend control.
- Derived stage-attempt, merge-attempt, and expiry defaults are proposal-only until an explicit CS2 decision activates them.

## Qualifying task checklist

- [ ] W0-2053-A — Establish the truthful FO-001–FO-019 control/evidence baseline and frozen W0 scope.
      owner: foreman-v2-agent
      status: IN_PROGRESS
      evidence: `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md`

- [ ] W0-2053-B — Produce the canonical IAA pre-brief for this PR-scoped wave record.
      owner: independent-assurance-agent
      status: COMPLETE
      evidence: `.agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md`

- [ ] W0-2053-C — Create executable QA-to-RED coverage only for the frozen safety-envelope, decision-record, and kill-switch/circuit-breaker requirements.
      owner: qa-builder
      status: RED_BASELINE_ACCEPTED_BY_FOREMAN_QP
      evidence: `.agent-admin/evidence/pr-2061-w0-qa-to-red.md`
      qp_review: PASS — 32 controller and 5 workflow RED failures are attributable to absent required behavior; 9 controller and 3 workflow pre-existing tests remain green.
      constraints: No implementation builder appointment in this intake stage; no controller behavior or activation change.

## Required order

1. Canonical IAA pre-brief is committed and bound to PR #2061 / work item `W0-2053`.
2. Foreman appoints `qa-builder` for W0-2053-C only.
3. QA builder returns executable RED evidence.
4. Foreman evaluates the RED baseline. An implementation-builder appointment requires a separate accepted route and is not authorized by this record.

## IAA Tokens Received This Wave

| PR # | Token | Date |
|---|---|---|
| #2061 | Not applicable at intake; pre-brief pending | — |

## Current blockers

| ID | Classification | Owner | Required remediation | Status |
|---|---|---|---|---|
| W0-BLK-002 | Bounded W3 controller defect | W3 controller route | Scope historic-reference identity scans to the active PR/work item; do not modify archival #2048/#2057 records. | RECORDED_FOR_W3 |
| W0-BLK-003 | Deliberate authorization boundary | CS2 / future governed builder route | A separate implementation-builder route may be considered only after this accepted RED baseline; it is not authorized by this intake-stage instruction. | OPEN |

This record is an intermediate intake gate, not a handover, completion, final assurance, or merge-readiness claim.
