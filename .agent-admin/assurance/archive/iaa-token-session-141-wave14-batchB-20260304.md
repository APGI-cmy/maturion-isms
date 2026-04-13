# IAA Token — Session 141 / Wave 14 Batch B / 2026-03-04

## Header

| Field | Value |
|-------|-------|
| session_id | session-141 |
| date | 2026-03-04 |
| agent | independent-assurance-agent v6.2.0 |
| contract | 2.1.0 |
| pr_reviewed | copilot/implement-evidence-interaction-model (Wave 14 Batch B — Issue #909) |
| invoking_agent | foreman-v2-agent |
| producing_agents | schema-builder (TASK-W14-BB-001, -003, -009), ui-builder (TASK-W14-BB-002, -004, -005, -006, -007, -008) |
| producing_agent_class | builder |
| verdict | **REJECTION-PACKAGE** |
| adoption_phase | PHASE_B_BLOCKING |

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: Wave 14 Batch B / Branch: copilot/implement-evidence-interaction-model / Issue #909
6 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-018 / A-021: PREHANDOVER proof and session memory NOT committed.
    Finding: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-141-wave14-batchB-20260304.md
             and session-141-wave14-batchB-20260304.md are untracked working-tree files.
             They do not appear in git diff --name-only origin/main...HEAD.
    Fix: git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-141-wave14-batchB-20260304.md
              .agent-workspace/foreman-v2/memory/session-141-wave14-batchB-20260304.md
         git commit -m "chore(handover): commit Wave 14 Batch B PREHANDOVER proof and session memory"
         git push

  CORE-015: Session memory not committed (same root cause as CORE-018 above).
    Fix: Same as CORE-018 fix above.

  A-026 / BL-027: SCOPE_DECLARATION.md not updated for session-141 / Wave 14 Batch B.
    Finding: SCOPE_DECLARATION.md still reflects session-140 / Wave 14 Batch A content.
             None of the Batch B files (migrations 000003/000004/000006, EvidenceUploadPanel,
             CriteriaCard, EmbeddedAIAssistant, AuditResultsTable, AuditManagementPage,
             DashboardPage) are declared. SCOPE_DECLARATION.md is not in the branch diff.
    Fix: Update SCOPE_DECLARATION.md to declare all Wave 14 Batch B files (list format per A-028).
         Commit and push.

  BD-002 / W14-BB-008-R05: Create Report button in DashboardPage.tsx has no onClick handler.
    Finding: DashboardPage.tsx renders <button data-testid="create-report-button"> with
             disabled logic but ZERO onClick handling. Clicking the button does nothing.
             No INSERT is ever triggered on audit_reports. Core feature is a stub.
    Fix: Add onClick handler that calls supabase.from('audit_reports').insert({
           audit_id: <selectedAuditId>,
           organisation_id: <userOrgId>,
           storage_path: '<pending_path>',
           status: 'generating'
         }). Wire to display confirmation or trigger report generation flow.
         NOTE on storage_path NOT NULL constraint (W14-BB-009-R02): the audit_reports table
         requires storage_path NOT NULL. The handler must supply a placeholder path on INSERT
         (e.g., 'reports/{orgId}/{auditId}/pending.pdf') and update it once generation completes,
         OR the migration must allow storage_path to be nullable initially. Resolve this
         schema/handler contract explicitly.

  BD-005 / W14-BB-008-R02: useAuditMetrics hook missing Wave 14 evaluation metrics.
    Finding: useAuditMetrics.ts AuditMetrics interface has no submittedCount,
             outstandingCount, or excludedCount fields. DashboardPage accesses
             metrics?.submittedCount, metrics?.outstandingCount, metrics?.excludedCount —
             all undefined, all resolve to 0 via ?? 0. Create Report gate is permanently
             enabled regardless of actual evaluation state. The gate is non-functional.
    Fix: Extend useAuditMetrics (or create useEvaluationMetrics hook) to query:
         - submittedCount: COUNT from criteria_evaluations WHERE status IN ('confirmed','overridden')
         - outstandingCount: COUNT of non-excluded criteria NOT IN
           (SELECT criteria_id FROM criteria_evaluations WHERE status IN ('confirmed','overridden'))
         - excludedCount: COUNT of criteria WHERE excluded = true
         Add these to AuditMetrics interface and return from hook.

  BD-005 / W14-BB-007-R02: AuditManagementPage wires AuditResultsTable with hardcoded
    empty values (auditId="" and criteria={[]}).
    Finding: Results tab always renders an empty table — no audit data is ever loaded.
             Per W14-BB-007-R02, the table must be scoped to the currently selected audit.
    Fix: Introduce selectedAuditId state (or receive from page context/router) and a hook
         such as useAuditResults(selectedAuditId) to fetch criteria evaluations. Pass real
         auditId and populated criteria array to AuditResultsTable.

  BD-005 / W14-BB-001-R02 / CHAIN-BB-01: EvidenceItem.type TypeScript union does not match
    DB evidence_type_check constraint — runtime constraint violations for 'image' and 'link'.
    Finding: TypeScript EvidenceItem.type has 'image' and 'link' — NOT in DB CHECK constraint.
             DB constraint has 'photo', 'audio', 'interview' — NOT in TypeScript type union.
             Uploading evidence of type 'image' or 'link' from the UI will produce a DB
             constraint violation at INSERT time. CHAIN-BB-01 is broken for 2 of 7 evidence
             tile types.
    Fix: Reconcile types. Recommended: update TypeScript EvidenceItem.type to 'photo' instead
         of 'image' (update EVIDENCE_TYPES array label accordingly); add 'audio' type tile;
         decide whether 'link' is persisted to DB (add to DB CHECK) or UI-only (handle
         separately). Ensure EvidenceItem.type union exactly matches DB CHECK constraint for
         all persisted evidence types.

This PR must not be opened until ALL 6 failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

---

## Checks Executed

| Check | Result |
|-------|--------|
| CORE-007 (no placeholders in this PR's diff) | PASS ✅ |
| CORE-013 (IAA invocation evidence — §4.3b first invocation) | PASS ✅ |
| CORE-015 (session memory present — committed) | FAIL ❌ |
| CORE-017 (no .github/agents modifications) | PASS ✅ |
| CORE-018 (evidence artifact sweep) | FAIL ❌ |
| CORE-019 (IAA token cross-verification — first invocation) | PASS ✅ |
| BD-001 (full scope delivered — all 9 artifacts present) | PASS ✅ |
| BD-002 (no stubs in production — Create Report handler) | FAIL ❌ |
| BD-005 (wiring: useAuditMetrics missing metrics) | FAIL ❌ |
| BD-005 (wiring: AuditManagementPage empty auditId/criteria) | FAIL ❌ |
| BD-005 (wiring: EvidenceItem type vs DB CHECK mismatch) | FAIL ❌ |
| BD-011 (40/40 Batch B tests GREEN — verified by run) | PASS ✅ |
| A-026 / BL-027 (SCOPE_DECLARATION.md current) | FAIL ❌ |

**Total: 6 FAIL / 7 PASS — 13 checks executed**

---

## What Passes (For Context)

- All 3 SQL migrations: idempotency guards (IF NOT EXISTS / DO $$ guards) ✅
- `criteria_evaluations` RLS: SELECT + INSERT + UPDATE + DELETE all present ✅
- `audit_reports` RLS: SELECT + INSERT both present (W14-BB-009-R05) ✅
- `storage.objects` policy for `reports` bucket present (W14-BB-009-R06) ✅
- RLS uses `auth.uid() + profiles JOIN` pattern throughout (not current_setting) ✅
- `evidence_type_check` carries forward all prior types + adds 'file' and 'voice' ✅ (but TypeScript type is misaligned — separate failure)
- `evaluation_overrides` FK to `criteria_evaluations.id` present (W14-BB-003-R02) ✅
- `contextPayload` is used in AI session initialisation via `useEffect` (W14-BB-005-R02) ✅
- `data-testid="ai-context-indicator"` present when contextPayload set (W14-BB-005) ✅
- `data-testid` attributes present on all CriteriaCard guidance sections ✅
- EvidenceUploadPanel storage path format `${organisationId}/${auditId}/criteria/${criterionId}/` matches RLS `split_part(name,'/',1) = organisation_id` pattern ✅
- EvidenceUploadPanel exported and referenced by AuditManagementPage/CriteriaCard ✅
- AuditResultsTable imported and used by AuditManagementPage ✅ (but with empty data — separate failure)
- POLC boundary maintained: foreman orchestrated only, did not implement ✅
- Wave 14 Batch B tests: 40/40 GREEN (verified by IAA independent run) ✅

---

## Fix Priority (for re-submission)

1. **Fix 1 (governance — quick)**: Commit PREHANDOVER proof + session memory + update SCOPE_DECLARATION.md → push
2. **Fix 2 (substance — critical)**: Add `onClick` handler to Create Report button in DashboardPage
3. **Fix 3 (substance — critical)**: Extend `useAuditMetrics` to return `submittedCount`, `outstandingCount`, `excludedCount`
4. **Fix 4 (substance — critical)**: Wire AuditManagementPage Results tab with real `selectedAuditId` state + evaluation data hook
5. **Fix 5 (substance — critical)**: Reconcile `EvidenceItem.type` TypeScript union with DB `evidence_type_check` constraint

After all 5 fixes: ensure tests remain 40/40 GREEN, commit, push, re-invoke IAA.

---

## Token Reference

`IAA-session-141-wave14-batchB-20260304-REJECTION`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING
**Date**: 2026-03-04
