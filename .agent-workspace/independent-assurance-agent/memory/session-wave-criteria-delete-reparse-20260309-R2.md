# IAA Session Memory — session-wave-criteria-delete-reparse-20260309-R2

## Session Metadata

```yaml
session_id: session-wave-criteria-delete-reparse-20260309-R2
date: 2026-03-09
agent_version: independent-assurance-agent v6.2.0 (contract v2.2.0)
pr_reviewed: copilot/add-document-delete-reparse-function
wave: wave-criteria-delete-reparse
invoking_agent: foreman-v2-agent
producing_agent: api-builder, ui-builder, qa-builder, schema-builder, foreman-v2-agent
producing_agent_class: builder + foreman
pr_category: AAWP_MAT
checks_executed: 36
checks_passed: 36
checks_failed: 0
merge_gate_parity_result: PASS
verdict: ASSURANCE-TOKEN
token_reference: IAA-session-wave-criteria-delete-reparse-20260309-R2-PASS
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave-criteria-delete-reparse-20260309 (R1 — REJECTION-PACKAGE)
  - session-wave-session-refresh-auth-fix-20260309-R2
  - session-wave-mat-gov-process-20260309-R2
  - session-wave-upload-doclist-fix-20260308-R2
  - session-T-W15R-QA-001-R3-wave15r-qa001-20260308
```

---

## Invocation Summary

IAA was invoked as R2 STOP-AND-FIX audit for wave-criteria-delete-reparse. R1 REJECTION-PACKAGE
identified BD-015 (5 missing RLS policies) and BD-003 (derived: one-time build compliance).
R2 delivers full resolution:
- Migration `20260309000003_criteria_delete_reparse_rls.sql` adds all 5 required RLS policies
- 7 new T-DEL-015 test assertions verify migration content
- Governance overlay §5 updated with RLS gap closure note

All 36 checks PASS. ASSURANCE-TOKEN issued.

---

## STOP-AND-FIX Resolution Verification

| R1 Finding | R2 Resolution | Verified |
|-----------|--------------|---------|
| BD-015: `domains_delete_org_isolation` missing | Policy present in 20260309000003 with IF NOT EXISTS guard | ✅ |
| BD-015: `criteria_documents_insert_org_isolation` missing | Policy present in 20260309000003 with IF NOT EXISTS guard | ✅ |
| BD-015: `criteria_documents_update_org_isolation` missing | Policy present in 20260309000003 with IF NOT EXISTS guard | ✅ |
| BD-015: `criteria_documents_delete_org_isolation` missing | Policy present in 20260309000003 with IF NOT EXISTS guard | ✅ |
| BD-015: `audit_logs_delete_org_isolation` missing | Policy present in 20260309000003 with IF NOT EXISTS guard | ✅ |
| BD-003: One-time build FAIL (derived) | Resolved by BD-015 fix | ✅ |

---

## Checks Executed

| Phase | Checks | Pass | Fail |
|-------|--------|------|------|
| FAIL-ONLY-ONCE learning | 2 | 2 | 0 |
| Core invariants | 14 | 14 | 0 |
| AAWP_MAT overlay (BD + FFA) | 19 | 19 | 0 |
| Merge gate parity §4.3 | 3 | 3 | 0 |
| **Total** | **36** | **36** | **0** |

---

## Failures Cited

None. All findings from R1 resolved.

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001: IAA invocation evidence present | Yes — PREHANDOVER-R2 has `iaa_audit_token` field with expected reference | PASS |
| A-002: No class exception claims | Yes — no exemption claims found | PASS |

---

## fail_only_once_updates

None this session. No new recurring patterns identified.

---

## Learning Notes

1. **R2 migration quality**: The R2 fix migration (`20260309000003`) is well-constructed — each policy block is clearly sectioned with inline comments explaining which hook operation requires the policy. This is the correct documentation pattern for RLS migrations: the reader immediately understands the business reason for each policy. Future QA should reward this level of documentation.

2. **Idempotent guard count**: The migration has 6 `IF NOT EXISTS` guard instances for 5 policies. This is because the `criteria_documents` UPDATE policy requires a dual check (USING + WITH CHECK) but still counts as one policy — the guard structure is correct. IAA verified the count manually — no overcounting.

3. **No conflict with existing policies**: Cross-reference of existing migrations confirmed that prior waves only added SELECT/INSERT/UPDATE (not DELETE) on `domains`, SELECT only on `criteria_documents`, and SELECT/INSERT only on `audit_logs`. The R2 migration fills exactly the gaps identified in R1 without disturbing existing grants.

4. **STOP-AND-FIX cycle operated correctly**: R1 REJECTION-PACKAGE issued 2026-03-09 for BD-015. R2 resolves fully, no partial fixes, no deferred items. The two-round cycle demonstrates the STOP-AND-FIX mandate working as intended.

5. **Test assertion approach**: T-DEL-015 reads the actual migration file on disk and asserts content presence. This is a structural test (not a Supabase integration test) — correct approach for this codebase given no local Supabase instance in CI. The assertions are not vacuous: they verify specific named strings that must be present for the feature to function.

---

## Suggestions for Improvement

**Suggestion 1 (Pre-Brief timing)**: This wave again had a GOV-BREACH-AIMC-W5-002 (code committed before pre-brief). This is the Nth occurrence of this pattern across recent waves. The STOP-AND-FIX cycle adds avoidable round-trips. Recommend CS2 consider whether the IAA pre-brief injection workflow should be strengthened to block branch push until pre-brief is confirmed, rather than relying on agent self-compliance.

**Suggestion 2 (RLS gap detection at task-planning time)**: BD-015 (missing RLS) is a recurring finding category. The pre-brief task classification could explicitly flag "this task touches tables X, Y, Z — confirm RLS covers all mutation operations planned" as a mandatory pre-brief checklist item. This would surface the gap before build rather than at assurance, eliminating R2 cycles for this category.

---

## open_rejection_packages_from_prior_sessions

- IAA-REJECT-wave-criteria-delete-reparse-20260309 (R1): **RESOLVED** — R2 ASSURANCE-TOKEN issued.

---

## Token file

`.agent-admin/assurance/iaa-token-session-wave-criteria-delete-reparse-20260309-R2.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | Contract: 2.2.0
