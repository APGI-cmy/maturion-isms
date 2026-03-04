# Scope Declaration — foreman-v2-agent Session-099 — Wave audit-field-sync

**PR**: `copilot/sync-frontend-backend-audit-fields`
**Session**: session-099
**Wave**: audit-field-sync
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md)
**Task**: Orchestrate full frontend/backend sync for Audit form fields after broken PR #897
**Issue**: Orchestrate full frontend/backend sync for Audit form fields after broken PR #897

---

## Files Declared

### Implementation (TASK-AFS-002 — ui-builder)
- `modules/mat/frontend/src/lib/hooks/useAudits.ts` — Audit interface + useCreateAudit field mapping fix
- `modules/mat/frontend/src/components/audits/AuditList.tsx` — organisation_name display added

### Tests (TASK-AFS-001 — qa-builder)
- `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` — Column drift guard + RED gate tests T-AFS-COL-001 to T-AFS-COL-005

### Foreman Governance Artifacts
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — Wave task list updated for audit-field-sync
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-099-wave-audit-field-sync-20260304.md` — Foreman PREHANDOVER proof
- `SCOPE_DECLARATION.md` — This file

### IAA Artifacts
- `.agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md` — IAA Pre-Brief (generated before delegation)
- `.agent-admin/assurance/rejection-package-session-133-wave-audit-field-sync-20260304.md` — IAA REJECTION-PACKAGE (ceremony findings — remediated)
- `.agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_001.md` — TASK-AFS-001 PREHANDOVER proof (corrected v2)
- `.agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_002.md` — TASK-AFS-002 PREHANDOVER proof

---

## IAA Token
IAA ASSURANCE-TOKEN: to be recorded in Foreman PREHANDOVER proof after re-invocation.
