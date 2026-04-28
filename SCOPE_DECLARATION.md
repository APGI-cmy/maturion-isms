# Scope Declaration — hard-gate-iaa-ecap-20260428

**Wave**: hard-gate-iaa-ecap-20260428
**Issue**: maturion-isms#1518
**Branch**: copilot/hard-gate-pr-merge-iaa-token
**Date**: 2026-04-28
**Last refreshed**: 2026-04-28 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Add hard CI gates for IAA final assurance and ECAP/admin ceremony evidence
(maturion-isms#1518). Adds two gate scripts, a test suite, two new CI jobs in
preflight-evidence-gate.yml, and specific step-by-step injection instructions in
foreman-reanchor.yml.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `.github/scripts/iaa-final-assurance-gate.sh` - Hard CI gate: fails implementation PRs without a current PR-specific IAA final assurance token in .agent-admin/assurance/
- `.github/scripts/ecap-admin-ceremony-gate.sh` - Hard CI gate: fails protected-path PRs without ECAP/admin ceremony evidence
- `.github/scripts/iaa-final-assurance-gate.test.sh` - 15-case test suite covering all acceptance criteria from maturion-isms#1518
- `.github/workflows/preflight-evidence-gate.yml` - Added preflight/iaa-final-assurance and preflight/ecap-admin-ceremony CI jobs
- `.github/workflows/foreman-reanchor.yml` - Updated injection comment with specific ECAP (E-1–E-4) and IAA final assurance (I-1–I-4) step-by-step instructions

## Out of Scope

- Any application source code changes
- Any Supabase schema migrations or functions
- Any governance canon files
