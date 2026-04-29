# Scope Declaration — harden-iaa-ecap-lifecycle-20260429

**Wave**: harden-iaa-ecap-lifecycle-20260429
**Issue**: maturion-isms#1519
**Branch**: copilot/harden-iaa-ecap-invocation
**Date**: 2026-04-29
**Last refreshed**: 2026-04-29 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Harden IAA/ECAP invocation from advisory workflow injection to mandatory execution
lifecycle (issue #1519). Move from "agent was told to invoke IAA/ECAP" to
"machine proves IAA/ECAP actually happened before handover/merge" by adding:
1. Per-PR lifecycle state determination script and durable JSON artifact.
2. Hard CI gate blocking premature merge-ready claims while lifecycle is blocked.
3. GitHub Actions jobs for lifecycle label and comment management.
4. Extended test coverage for both new scripts.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `.github/scripts/pr-assurance-lifecycle.sh` - New: machine logic determines IAA/ECAP required states, writes .agent-admin/lifecycle/pr-<N>-assurance-state.json, sets step outputs
- `.github/scripts/merge-ready-claim-gate.sh` - New: hard gate blocking merge-ready/handover-ready claims while lifecycle is blocked (MERGE-READY-001)
- `.github/scripts/iaa-final-assurance-gate.test.sh` - Extended: 7 new tests for lifecycle and merge-ready-claim gates (30 total)
- `.github/workflows/preflight-evidence-gate.yml` - Extended: three new jobs (pr-assurance-lifecycle, merge-ready-claim, manage-lifecycle-labels); per-job write permissions for label/comment management

## Out of Scope

- Any application source files (apps/, modules/, supabase/)
- Any governance canon files
- Any other CI workflows or scripts beyond preflight-evidence-gate.yml

