# Scope Declaration — harden-iaa-ecap-lifecycle-20260429

**Wave**: harden-iaa-ecap-lifecycle-20260429
**Issue**: maturion-isms#1514
**Branch**: copilot/harden-iaa-ecap-invocation
**Date**: 2026-04-29
**Last refreshed**: 2026-04-30T12:21 (re-trigger CI with updated PR body containing Addresses maturion-isms#1514; 38 tests)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Harden IAA/ECAP invocation from advisory workflow injection to mandatory execution
lifecycle (issue #1514). Move from "agent was told to invoke IAA/ECAP" to
"machine proves IAA/ECAP actually happened before handover/merge" by adding:
1. Per-PR lifecycle state determination script and durable JSON artifact.
2. Hard CI gate blocking premature merge-ready claims while lifecycle is blocked.
3. GitHub Actions jobs for lifecycle label and comment management.
4. Extended test coverage for both new scripts.
5. Lifecycle state reporting in the IAA pre-brief injection comment.
6. Mandatory governing-issue validation when IAA/ECAP is required.
7. Assurance-control .github/scripts and key workflow changes classified as IAA-triggering.
8. Wave-record ## TOKEN validated with same reviewed-SHA ancestry check as standalone tokens.
10. Post-IAA implementation change detection: token is rejected if impl files were changed after reviewed SHA, unless a committed delta-assurance block (`iaa-delta-assurance-*.md`) bridges the gap as non-substantive.
11. Merge-ready claim patterns narrowed: bare `merge.ready`/`merge_ready`/`handover.ready`/`handover_ready` replaced with context-anchored patterns to prevent false positives on script filenames (e.g. `merge-ready-claim-gate.sh`) and variable names (e.g. `MERGE_READY_ALLOWED`).

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `.github/scripts/pr-assurance-lifecycle.sh` - New/extended: assurance-control file classifier; mandatory EXPECTED_ISSUE_NUMBER; wave-record SHA ancestry check; ECAP bundle PASS verdict validation; writes lifecycle JSON artifact; sets step outputs
- `.github/scripts/merge-ready-claim-gate.sh` - New: hard gate blocking merge-ready/handover-ready claims while lifecycle is blocked (MERGE-READY-001)
- `.github/scripts/iaa-final-assurance-gate.test.sh` - Extended: 15 new tests for lifecycle, merge-ready-claim, assurance-control, wave-record SHA, ECAP verdict, post-IAA impl change gates, and merge-ready false-positive prevention (38 total)
- `.github/workflows/preflight-evidence-gate.yml` - Extended: three new jobs (pr-assurance-lifecycle, merge-ready-claim, manage-lifecycle-labels); per-job write permissions for label/comment management
- `.github/workflows/iaa-prebrief-inject.yml` - Extended: injection comment now includes lifecycle state reporting section (IAA/ECAP required, artifacts, handover allowed, required next actions)

## Out of Scope

- Any application source files (apps/, modules/, supabase/)
- Any governance canon files
- Any other CI workflows or scripts beyond preflight-evidence-gate.yml and iaa-prebrief-inject.yml
