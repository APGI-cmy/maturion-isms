# Scope Declaration — actions-deprecation-gate-20260423

**Wave**: actions-deprecation-gate-20260423
**Issue**: maturion-isms#1458
**Branch**: copilot/add-github-actions-deprecation-detection
**Date**: 2026-04-23
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)
**IAA Pre-Brief**: .agent-admin/assurance/iaa-wave-record-actions-deprecation-gate-20260423-20260423.md

## Scope Decision

GitHub Actions deprecation hardening: Dependabot configuration, deprecation detection CI gate,
composite action standardization, policy documentation, governance artifacts.

## Approved Artifact Paths

```yaml
approved_artifact_paths:
  # New implementation artifacts (qa-builder scope)
  - ".github/dependabot.yml"
  - ".github/workflows/actions-deprecation-gate.yml"
  - ".github/actions/setup/action.yml"
  - "docs/ACTIONS_UPGRADE_POLICY.md"
  # Governance artifacts (Foreman scope)
  - ".agent-admin/assurance/iaa-wave-record-actions-deprecation-gate-20260423-20260423.md"
  - ".agent-workspace/foreman-v2/personal/wave-current-tasks.md"
  - ".agent-workspace/foreman-v2/personal/scope-declaration-wave-actions-deprecation-gate-20260423.md"
  - "SCOPE_DECLARATION.md"
  # Phase 4 ceremony artifacts (ECAP scope)
  - ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-actions-deprecation-gate-20260423.md"
  - ".agent-workspace/execution-ceremony-admin-agent/bundles/session-actions-deprecation-gate-20260423.md"
  - ".agent-workspace/foreman-v2/memory/PREHANDOVER-session-actions-deprecation-gate-20260423.md"
  - ".agent-workspace/foreman-v2/memory/session-actions-deprecation-gate-20260423.md"
  - ".agent-workspace/independent-assurance-agent/memory/session-actions-deprecation-gate-20260423.md"
  - ".agent-workspace/foreman-v2/parking-station/suggestions-log.md"
```

## Out of Scope

- Any application code files not listed above
- Any supabase migrations
- Any module-level source files
- Any other workflow files (existing workflows must not be modified)
