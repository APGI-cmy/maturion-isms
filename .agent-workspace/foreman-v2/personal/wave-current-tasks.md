# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave WF-Dispatch — Workflow Manual Dispatch Fix
**Session**: session-157-wave-wf-dispatch-20260306
**Date**: 2026-03-06
**Issue**: copilot/fix-workflow-trigger-conditions — fix: allow deploy-production and cwt jobs to run on workflow_dispatch
**Branch**: copilot/fix-workflow-trigger-conditions
**CS2 Authorization**: `@foreman-v2-agent please take over and complete this job` — posted by @APGI-cmy in PR/issue
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger

---

## Wave Context

The workflow `.github/workflows/deploy-mat-ai-gateway.yml` had `workflow_dispatch:` in its
`on:` triggers but the `deploy-production` and `cwt` jobs had `if:` conditions that only
allowed them to run on `push` to `main`. A previous Copilot session (non-ISMS agent) made
the 2-line code fix. The Foreman is now taking over to provide the governance ceremony
required by the governance-ceremony-gate for `.github/workflows/**` changes.

**POLC NOTE**: The implementation was performed by a non-ISMS general-purpose Copilot agent
before Foreman was assigned. No builder delegation is needed — the change is already applied
and correct. This session's scope is: QP evaluation of the existing change + governance
ceremony completion (PREHANDOVER proof + session memory + IAA audit + token ceremony +
SCOPE_DECLARATION + PR body governance block).

---

## Tasks

| ID | Task | Builder | IAA Qualifying? |
|----|------|---------|-----------------|
| TASK-WFD-001 | QP evaluate the 2-line workflow change against the problem statement spec | Foreman (QP mode) | YES — touches .github/workflows/** (governance-ceremony gate) |
| TASK-WFD-002 | Clear SCOPE_DECLARATION.md per A-029 and write correct scope (1 workflow file + governance artifacts) | Foreman (governance artifact) | YES |
| TASK-WFD-003 | Write PREHANDOVER proof (session-157) | Foreman (Phase 4) | YES |
| TASK-WFD-004 | Write session memory (session-157) | Foreman (Phase 4) | YES |
| TASK-WFD-005 | Invoke IAA Final Audit | IAA (independent-assurance-agent) | YES — mandatory |
| TASK-WFD-006 | Token ceremony: IAA writes iaa-token-session-157-wave-wf-dispatch-20260306.md | IAA (independent-assurance-agent) | YES |
| TASK-WFD-007 | Update PR body with ## Governance block | Foreman (via report_progress) | YES |

---

## Acceptance Criteria

- `deploy-production` job `if:` condition at line 146 matches spec exactly: `(github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'`
- `cwt` job `if:` condition at line 209 matches spec exactly: `(github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'`
- `deploy-preview` job `if:` condition at line 57 UNCHANGED: `github.event_name == 'pull_request'`
- No other lines in the workflow file changed
- SCOPE_DECLARATION.md cleared and rewritten with correct scope
- PREHANDOVER proof exists at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-157-wave-wf-dispatch-20260306.md`
- IAA token exists at `.agent-admin/assurance/iaa-token-session-157-wave-wf-dispatch-20260306.md`
- PR body contains `## Governance` block with IAA Category, IAA Audit Token, PREHANDOVER Proof

---

*Authority: CS2 (@APGI-cmy) | Wave WF-Dispatch | 2026-03-06*
