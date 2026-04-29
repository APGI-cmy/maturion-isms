# Scope Declaration — hard-gate-iaa-ecap-20260428

**Wave**: hard-gate-iaa-ecap-20260428
**Issue**: maturion-isms#1503
**Branch**: copilot/hard-gate-pr-merge-iaa-token
**Date**: 2026-04-28
**Last refreshed**: 2026-04-29 (post-review hardening per blocking review comment #4341480842)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Add hard CI gates for IAA final assurance and ECAP/admin ceremony evidence
(maturion-isms#1503). Adds two gate scripts, a test suite, two new CI jobs in
preflight-evidence-gate.yml, and specific step-by-step injection instructions in
foreman-reanchor.yml.

## Changed Files

- `.agent-admin/assurance/iaa-wave-record-wave-mps-source-verification-20260428.md` - IAA wave record (PRE-BRIEF; Track A = EXEMPT; Track B = AAWP_MAT conditional)
- `.agent-workspace/foreman-v2/memory/session-mps-source-verification-20260428.md` - Foreman session memory; agents_delegated_to: IAA (pre-brief only)
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station log (appended entry for this session)
- `.agent-workspace/foreman-v2/personal/mps-migration-gap-analysis-20260428.md` - Migration gap analysis document (Track A deliverable); contains schema investigation findings, DB verification SQL for CS2, and decision tree
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mps-source-verification-20260428.md` - Wave scope declaration
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task tracker (recreated for wave-mps-source-verification)
- `.agent-workspace/independent-assurance-agent/memory/session-077-20260428.md` - IAA session memory (PRE-BRIEF session 077)
- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `.github/scripts/iaa-final-assurance-gate.sh` - Hard CI gate: fails implementation PRs without a current PR-specific IAA final assurance token in .agent-admin/assurance/
- `.github/scripts/ecap-admin-ceremony-gate.sh` - Hard CI gate: fails protected-path PRs without ECAP/admin ceremony evidence
- `.github/scripts/iaa-final-assurance-gate.test.sh` - 23-case test suite covering all acceptance criteria from maturion-isms#1503
- `.github/workflows/preflight-evidence-gate.yml` - Added preflight/iaa-final-assurance and preflight/ecap-admin-ceremony CI jobs
- `.github/workflows/foreman-reanchor.yml` - Updated injection comment with specific ECAP (E-1–E-4) and IAA final assurance (I-1–I-4) step-by-step instructions

## Out of Scope

- Any application source code changes
- Any Supabase schema migrations or functions
- Any governance canon files
