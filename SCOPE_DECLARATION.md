# Scope Declaration — foreman-v2-agent Sessions 099–100 — Wave audit-field-sync

**PR**: `copilot/sync-frontend-backend-audit-fields`
**Sessions**: session-099, session-100
**Wave**: audit-field-sync
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md)

## Environment Note

This PR is checked out in a shallow clone. In CI (`fetch-depth: 0`), `git diff --name-only origin/main...HEAD`
shows all 35 files listed below. In the shallow-clone sandbox, it shows 0 (empty-PR path, exit 0).
This declaration satisfies BL-027 for non-shallow CI environments.

## Files Declared

### Added

- `.agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md` - IAA Pre-Brief for wave audit-field-sync
- `.agent-admin/assurance/iaa-token-session-136-wave-audit-field-sync-20260304.md` - IAA ASSURANCE-TOKEN session-136
- `.agent-admin/assurance/iaa-token-session-137-wave-audit-field-sync-v2-20260304.md` - IAA ASSURANCE-TOKEN session-137 (session-100 invocation)
- `.agent-admin/assurance/rejection-package-session-133-wave-audit-field-sync-20260304.md` - IAA REJECTION-PACKAGE session-133
- `.agent-admin/assurance/rejection-package-session-134-wave-audit-field-sync-20260304.md` - IAA REJECTION-PACKAGE session-134
- `.agent-admin/assurance/rejection-package-session-135-wave-audit-field-sync-20260304.md` - IAA REJECTION-PACKAGE session-135
- `.agent-admin/prehandover/CORRECTION_ADDENDUM_TASK_AFS_001.md` - Correction addendum for TASK-AFS-001 (A-029 fix)
- `.agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_001.md` - PREHANDOVER proof for TASK-AFS-001 (qa-builder)
- `.agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_002.md` - PREHANDOVER proof for TASK-AFS-002 (ui-builder)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-099-wave-audit-field-sync-20260304.md` - Foreman PREHANDOVER session-099
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-100-wave-audit-field-sync-v2-20260304.md` - Foreman PREHANDOVER session-100
- `.agent-workspace/foreman-v2/memory/session-099-20260304.md` - Foreman session memory session-099
- `.agent-workspace/foreman-v2/memory/session-100-20260304.md` - Foreman session memory session-100
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave-current-tasks for audit-field-sync
- `.agent-workspace/independent-assurance-agent/memory/.archive/LEGACY_BOUNDARY.md` - IAA archive: legacy boundary
- `.agent-workspace/independent-assurance-agent/memory/.archive/breach-registry.md` - IAA archive: breach registry
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-097-20260304.md` - IAA archive: session-097
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-098-20260304.md` - IAA archive: session-098
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-098b-20260304.md` - IAA archive: session-098b
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-099-20260304.md` - IAA archive: session-099
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-100-20260304.md` - IAA archive: session-100
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-124-20260304.md` - IAA archive: session-124
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-125-20260304.md` - IAA archive: session-125
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-126-20260304.md` - IAA archive: session-126
- `.agent-workspace/independent-assurance-agent/memory/session-133-20260304.md` - IAA session memory session-133
- `.agent-workspace/independent-assurance-agent/memory/session-134-20260304.md` - IAA session memory session-134
- `.agent-workspace/independent-assurance-agent/memory/session-135-20260304.md` - IAA session memory session-135
- `.agent-workspace/independent-assurance-agent/memory/session-136-20260304.md` - IAA session memory session-136
- `.agent-workspace/independent-assurance-agent/memory/session-137-20260304.md` - IAA session memory session-137 (session-100 invocation)
- `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` - Column drift guard tests (net-schema simulation)

### Modified

- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Foreman parking station (sessions 099-100 entries)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station
- `modules/mat/frontend/src/components/audits/AuditList.tsx` - AuditList renders organisation_name
- `modules/mat/frontend/src/lib/hooks/useAudits.ts` - Fix field mapping + Audit interface nullable types
- `SCOPE_DECLARATION.md` - This file — scope declaration for sessions 099-100
