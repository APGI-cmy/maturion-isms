# Scope Declaration — wave-mps-source-verification

**Wave**: wave-mps-source-verification
**Issue**: maturion-isms#1501
**Branch**: copilot/verify-generic-mps-source-documents
**Date**: 2026-04-28
**Last refreshed**: 2026-04-29 (refreshed post CS2 DB verification — commit 46942fd; addresses maturion-isms#1501)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Track A research wave (addresses maturion-isms#1501): verify whether the 25 generic MPS Word source
documents exist in the current AIMC/KUC/MMM storage system. CS2 DB verification COMPLETE —
result: LIKELY_ABSENT. Migration gap confirmed. Track B (implementation) is BLOCKED pending CS2
re-upload of 25 generic MPS Word documents into mmm-framework-sources bucket — separate PR/scope
when approved. No application code is changed. No schema is changed. No governance canon files
are modified.

## Changed Files

- `.agent-admin/assurance/iaa-wave-record-wave-mps-source-verification-20260428.md` - IAA wave record (PRE-BRIEF; Track A = EXEMPT; Track B = AAWP_MAT conditional)
- `.agent-workspace/foreman-v2/memory/session-mps-source-verification-20260428.md` - Foreman session memory; agents_delegated_to: IAA (pre-brief only)
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station log (appended entry for this session)
- `.agent-workspace/foreman-v2/personal/mps-migration-gap-analysis-20260428.md` - Migration gap analysis document (Track A deliverable); contains schema investigation findings, DB verification SQL for CS2, and decision tree
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mps-source-verification-20260428.md` - Wave scope declaration
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task tracker (recreated for wave-mps-source-verification)
- `.agent-workspace/independent-assurance-agent/memory/session-077-20260428.md` - IAA session memory (PRE-BRIEF session 077)
- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)

## Out of Scope

- Any application code (apps/, modules/, supabase/, packages/)
- Any schema/migration changes
- Any Edge Function changes
- Any deployment workflow changes
- Any governance canon files (.github/agents/, governance/)
- Track B implementation (separate PR after CS2 gate)
