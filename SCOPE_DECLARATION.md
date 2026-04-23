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

## Changed Files

### Added

- `.agent-admin/assurance/iaa-wave-record-actions-deprecation-gate-20260423-20260423.md` - IAA Pre-Brief wave record
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-actions-deprecation-gate-20260423.md` - Foreman personal scope declaration
- `.github/dependabot.yml` - Dependabot configuration for GitHub Actions monitoring
- `.github/workflows/actions-deprecation-gate.yml` - CI gate for deprecated/banned action versions
- `.github/actions/setup/action.yml` - Composite action for common workflow primitives
- `docs/ACTIONS_UPGRADE_POLICY.md` - Repository policy for GitHub Actions dependency management

### Modified

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated to current wave identity
- `SCOPE_DECLARATION.md` - This file

## Out of Scope

- Any files not listed above
