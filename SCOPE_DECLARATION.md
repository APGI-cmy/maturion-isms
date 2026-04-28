# Scope Declaration — wave-mps-source-verification

**Wave**: wave-mps-source-verification
**Issue**: CS2 clarification — verify canonical generic MPS source pack in AIMC/KUC before static question bank (related: PR #1500)
**Branch**: copilot/verify-generic-mps-source-documents
**Date**: 2026-04-28
**Last refreshed**: 2026-04-28 (Track A scope — pure research/workspace artifacts)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Track A research wave: verify whether the 25 generic MPS Word source documents exist in the
current AIMC/KUC/MMM storage system before accepting the static question bank in PR #1500.
This commit contains: wave-current-tasks.md, migration gap analysis, scope declaration, session memory,
and updated root SCOPE_DECLARATION.md. No application code is changed. No schema is changed.
No governance canon files are modified.

Track B (implementation) is BLOCKED pending CS2 DB verification gate — separate PR/scope when approved.

## Changed Files

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task tracker (recreated for wave-mps-source-verification)
- `.agent-workspace/foreman-v2/personal/mps-migration-gap-analysis-20260428.md` - Migration gap analysis document (Track A deliverable); contains schema investigation findings, DB verification SQL for CS2, and decision tree
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mps-source-verification-20260428.md` - Wave scope declaration
- `.agent-workspace/foreman-v2/memory/session-mps-source-verification-20260428.md` - Foreman session memory; agents_delegated_to: IAA (pre-brief only)
- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)

## Out of Scope

- Any application code (apps/, modules/, supabase/, packages/)
- Any schema/migration changes
- Any Edge Function changes
- Any deployment workflow changes
- Any governance canon files (.github/agents/, governance/)
- Track B implementation (separate PR after CS2 gate)
