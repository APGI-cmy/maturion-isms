# Scope Declaration — pr1607-rejection-first-handover-protocol-20260511

**Wave**: pr1607-rejection-first-handover-protocol-20260511
**Issue**: maturion-isms#1606
**PR**: #1607
**Branch**: copilot/re-establish-failed-gate-protocol
**Date**: 2026-05-11
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)
**IAA Pre-Brief**: .agent-admin/assurance/iaa-wave-record-pr1607-rejection-first-handover-protocol-20260511.md

## Scope Decision

Reinstate rejection-first handover protocol and current-head gate enforcement. Planned work is limited to governed agent contracts, checkpoint workflow/script logic, regression coverage, and the PR #1607 governance evidence required to satisfy scope and ECAP preflight gates.

## Approved Artifact Paths

```yaml
approved_artifact_paths:
  - ".agent-admin/assurance/iaa-wave-record-pr1607-rejection-first-handover-protocol-20260511.md"
  - ".agent-admin/prehandover/proof-pr-1607-ecap-admin-ceremony-20260511.md"
  - ".agent-admin/scope-declarations/pr-1607.md"
  - ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1607-ecap-admin-ceremony-20260511.md"
  - ".agent-workspace/foreman-v2/personal/scope-declaration-wave-pr1607-rejection-first-handover-protocol-20260511.md"
  - ".agent-workspace/foreman-v2/personal/wave-current-tasks.md"
  - ".github/agents/execution-ceremony-admin-agent.md"
  - ".github/agents/foreman-v2-agent.md"
  - ".github/agents/independent-assurance-agent.md"
  - ".github/scripts/pre-handover-checkpoint.js"
  - ".github/scripts/pre-handover-checkpoint.test.sh"
  - ".github/workflows/handover-claim-gate.yml"
  - "governance/checklists/phase4-role-separation-operational-guidance.md"
```

## Out of Scope

- Application runtime source files
- Supabase migrations and schema changes
- New governance canon families
- Non-listed evidence artifacts

## Build Authorization

```yaml
build_authorization: CLEARED FOR GOVERNANCE HARDENING
implementation_blocked: NO
builder_delegation: execution-ceremony-admin-agent
architecture_gate_pass: N/A — governance hardening wave
qa_to_red_gate_pass: Targeted regression coverage in .github/scripts/pre-handover-checkpoint.test.sh
pbfag_pass: N/A — governance hardening wave
deployment_authorisation: NONE
```

*This scope declaration records the active PR #1607 governance remediation wave and authorizes the ECAP evidence artifacts required by preflight gates.*
