# Scope Declaration — Wave: token-session-coherence-hardening-20260420

**Wave**: token-session-coherence-hardening-20260420
**Branch**: copilot/canonize-active-final-state-token
**Issue**: maturion-isms#1422
**Date**: 2026-04-20
**Agent**: foreman-v2-agent

APPROVED_ARTIFACT_PATHS:
- governance/checklists/execution-ceremony-admin-anti-patterns.md
- governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md
- governance/checklists/execution-ceremony-admin-checklist.md
- governance/canon/AGENT_HANDOVER_AUTOMATION.md
- governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
- governance/templates/execution-ceremony-admin/PREHANDOVER.template.md
- governance/CANON_INVENTORY.json
- .github/workflows/preflight-evidence-gate.yml
- .agent-workspace/foreman-v2/personal/wave-current-tasks-token-session-coherence-20260420.md
- .agent-workspace/foreman-v2/personal/scope-declaration-wave-token-session-coherence-20260420.md
- .agent-admin/assurance/iaa-wave-record-token-session-coherence-hardening-20260420-20260420.md
- .agent-admin/prehandover/proof-token-session-coherence-20260420.md
- .agent-workspace/foreman-v2/memory/session-token-session-coherence-20260420.md
- .agent-workspace/foreman-v2/parking-station/suggestions-log.md
- .agent-workspace/independent-assurance-agent/memory/session-token-session-coherence-hardening-20260420.md

## Rationale

This wave introduces governance hardening for active final-state token/session coherence per
issue maturion-isms#1422. Changes are governance documentation only — no code, schema, or
migrations. This wave also includes a CI hardening fix to `.github/workflows/preflight-evidence-gate.yml`
to make the HFMC-01 parser resilient against empty intermediate grep results.

## BLOCKER-B Notice (CS2 Action Required)

Per IAA Pre-Brief BLOCKER-B and SELF-MOD-IAA-001:
`governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` modification (adding ACR-16) falls
under the structural self-assurance / independence prohibition. CS2 must post a CS2-DIRECT-REVIEW
comment on the PR for this specific file before merge.
