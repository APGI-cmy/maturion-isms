# Active Evidence Boundary Cleanup Report

**Date**: 2026-05-22  
**Repo**: `maturion-isms`  
**Role**: CodexAdvisor  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

## Purpose

Reduce governance noise from historical PR artifacts without deleting or rewriting protected records.

## Changes Made

1. Added `.agent-admin/ACTIVE_EVIDENCE_BOUNDARY.md`.
2. Added `.functional-delivery/ACTIVE_EVIDENCE_BOUNDARY.md`.
3. Updated `preflight/product-delivery-gates` current-head injection so it targets only active PR evidence instead of every historical `.functional-delivery/pr-*.md` record.
4. Updated `pre-handover-checkpoint` to prefer resolver-selected active PR artifacts before broad legacy fallback scanning.
5. Updated `producer-next-action-guidance` resolver-selected artifact fetching to include `activeState.wave_tasks_path`.

## Preserved Records

No historical assurance token, prehandover proof, ECAP bundle, scope declaration, session memory, or functional-delivery record was deleted or rewritten.

Historical records remain governance evidence and may contain older PR references, old SHAs, and failure records from their original context.

## Resulting Rule

Active PR checks should treat the following as primary current evidence:

- `.agent-admin/prs/pr-<ACTIVE_PR_NUMBER>/active-state.json`
- `.agent-admin/prs/pr-<ACTIVE_PR_NUMBER>/wave-current-tasks.md`
- `.agent-admin/scope-declarations/pr-<ACTIVE_PR_NUMBER>.md`
- `.admin/prs/pr-<ACTIVE_PR_NUMBER>.json`
- `.functional-delivery/pr-<ACTIVE_PR_NUMBER>.md`
- resolver-selected active-state artifact paths

Broad directory scans are legacy fallback only.

## Verification

- `git diff --check`: PASS, with line-ending warnings only.
- `node -c .github/scripts/pre-handover-checkpoint.js`: PASS.
- `node -c .github/scripts/resolve-active-pr-state.js`: PASS.
- `node .github/scripts/resolve-active-pr-state.js`: PASS in local main context.

The bash regression scripts could not be run in this Windows environment because `bash.exe` resolved to WSL and no `/bin/bash` runtime is installed.

## Remaining Cleanup Candidates

1. Add a dedicated regression test for active-only current-head injection.
2. Consider adding active-state path discovery to any remaining workflow that broad-fetches `.agent-admin/prehandover`.
3. After PR #1742 lands, re-check producer guidance for duplicate or stale STOP_AND_FIX comments.

