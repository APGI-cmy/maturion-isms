# Escalation: Agent Contract Ripple — CS2 Approval Required

## Type
BLOCKER

## Escalation ID
ESC-AGENTFILE-61AB7B83-20260304

## Status
OPEN

## Description
A governance layer-down (canonical commit `61ab7b83d2bae691f1a861581871bbb28c07d578`,
triggered by "Add mandatory step for committing artifacts before IAA") includes a change to
the agent contract file (`.github/agents/CodexAdvisor-agent.md`).

Per **A-009** (FAIL-ONLY-ONCE rule) and **AGCFPP-001**:
- Agent files in ripple payloads are **escalation triggers**, NOT layer-down targets.
- Only CS2 (Johan Ras) + CodexAdvisor-agent may authorize and merge agent contract changes.
- The automated ripple workflow correctly excluded the agent file from the layer-down.
- This escalation documents the pending agent contract update for CS2 review.

The local diff gate in `ripple-integration.yml` confirmed no agent files were included in
the consumer-side layer-down. The canonical change to `CodexAdvisor-agent.md` requires
explicit CS2 review and a separate authorized PR per AGCFPP-001.

## Context

- Session: session-045-20260304
- Source issue: APGI-cmy/maturion-isms#876
- Canonical commit: `61ab7b83d2bae691f1a861581871bbb28c07d578`
- Trigger: `Add mandatory step for committing artifacts before IAA`
- Agent file changed: `.github/agents/CodexAdvisor-agent.md`
- Workflow run: https://github.com/APGI-cmy/maturion-isms/actions/runs/22661048016
- Ripple PR (governance canon files only): #879 (merged), #880 (merged)
- Agent file escalation ref: ESC-AGENTFILE-61AB7B83-20260304

## Prior Related Escalations

- ESC-AGENTFILE-E77B00C7-20260303 (session-040): `CodexAdvisor-agent.md` previously escalated
- ESC-AGENTFILE-6523FE8D-20260304 (session-044): foreman-v2.agent.md + independent-assurance-agent.md escalated

## Recommendation

1. CS2 reviews the diff of `CodexAdvisor-agent.md` at canonical commit `61ab7b83d2bae691f1a861581871bbb28c07d578`
2. CS2 coordinates with CodexAdvisor-agent for AGCFPP-001 compliance
3. Authorized PR created with the agent contract change
4. Move this file to `escalation-archive/` after resolution

## Evidence

- Drift report: `.agent-admin/governance/drift-report-align-20260304-082246.md`
- Layer-down receipts: `.agent-admin/ripple/layer-down-received-20260304T082251Z.json`, `.agent-admin/ripple/layer-down-received-20260304T082252Z.json`
- Ripple log entry (automated): `.agent-admin/governance/ripple-log.json` (last entry)

---
Created: 2026-03-04 | Authority: CS2 | Session: session-045-20260304
