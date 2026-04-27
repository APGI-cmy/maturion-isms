# Scope Declaration — Wave: harden-qa-deployment-workflow-20260427

**Agent**: foreman-v2-agent v6.2.0
**Wave**: harden-qa-deployment-workflow-20260427
**Issue**: maturion-isms#1479
**Branch**: copilot/harden-qa-handover-requirements
**Date**: 2026-04-27
**CS2 Authorization**: Confirmed — issue opened by @APGI-cmy
**SB-001 Resolution**: Both template paths declared (Tier 2 knowledge + canon template) per IAA Pre-Brief SB-001 resolution

## Approved Artifact Paths

The following paths are approved for this wave. All agent-created files must match an entry in this list.

```yaml
approved_artifact_paths:
  # Wave infrastructure
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-harden-qa-deployment-workflow-20260427.md

  # IAA Pre-Brief wave record (IAA-authored, A-031 carve-out)
  - .agent-admin/assurance/iaa-wave-record-harden-qa-deployment-workflow-20260427.md

  # D1 — New canon document
  - governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md

  # D2 — New checklist
  - governance/checklists/deployment-workflow-qa-checklist.md

  # D3 — PREHANDOVER template updates (both paths — SB-001 resolution)
  - .agent-workspace/foreman-v2/knowledge/prehandover-template.md
  - governance/templates/PREHANDOVER_PROOF_TEMPLATE.md

  # D4 — FAIL-ONLY-ONCE update
  - .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md

  # D5 — CANON_INVENTORY update
  - governance/CANON_INVENTORY.json

  # Phase 4 ceremony artifacts (no ECAP)
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-074-harden-qa-deployment-workflow-20260427.md
  - .agent-workspace/foreman-v2/memory/session-074-20260427.md
  - .agent-admin/prehandover/proof-session-074-harden-qa-deployment-workflow-20260427.md
```

## Undeclared Paths Policy

Any file created or modified on this branch that does not match an entry in `approved_artifact_paths[]` above is a scope violation and will fail the governance-artifact-gate CI check.
