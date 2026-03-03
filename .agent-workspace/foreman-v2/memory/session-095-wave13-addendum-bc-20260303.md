# Session Memory — Session 095 — Wave 13 Addendum B+C — 2026-03-03

## Preamble

```
fail_only_once_attested: true
fail_only_once_version: 2.4.0
unresolved_breaches: none
open_improvements_reviewed: [S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011, S-012, S-013, S-014, S-015, S-016]
```

---

## Session Identity

| Field | Value |
|---|---|
| Session ID | session-095 |
| Date | 2026-03-03 |
| Agent | foreman-v2-agent v6.2.0 |
| Contract | 2.5.0 |
| Issue | Wave 13 Governance Failure: Post-deployment audit schema/cache miss + profile save broken |
| Branch | copilot/fix-audit-schema-cache-miss |

---

## Prior Sessions Reviewed

`prior_sessions_reviewed: [session-092-add-env-parity-20260302, session-092-ripple-cleanup-20260303, session-093-20260303, session-093-fix-agent-gate-20260303, session-094-wave13addendum-20260303]`

`unresolved_items_from_prior_sessions: none`

---

## Roles Invoked

`roles_invoked: [POLC-Orchestration, Quality-Professor]`

`mode_transitions: [POLC-Orchestration → Quality-Professor (after each builder handover) → POLC-Orchestration]`

---

## Agents Delegated To

| Agent | Task | Deliverable | QP Verdict |
|---|---|---|---|
| schema-builder | Task 13.B.1 — `audit_period_start`/`audit_period_end` migration | `20260303000000_audits_add_period_columns.sql` | PASS |
| ui-builder | Task 13.B.2 — `useSettings.ts` table name fix (`user_profiles`→`profiles`) | `useSettings.ts` 2-line fix | PASS |
| schema-builder | Task 13.C.1 — missing table migrations (evidence, scores, org_settings, storage buckets) | 4 migration files | PASS |
| qa-builder | Task 13.C.2 — column-level + drift-detection tests T-W13-SCH-5 to T-W13-SCH-12 | 8 GREEN tests | PASS |

`agents_delegated_to: [schema-builder (Tasks 13.B.1 and 13.C.1), ui-builder (Task 13.B.2), qa-builder (Task 13.C.2)]`

---

## Escalations Triggered

`escalations_triggered: none`

---

## Separation Violations Detected

`separation_violations_detected: none`

---

## Key Outcomes This Session

### Immediate Fixes (Wave 13 Addendum B)
1. **INC-W13-AUDIT-SCHEMA-001 RESOLVED**: Migration `20260303000000_audits_add_period_columns.sql` adds `audit_period_start` and `audit_period_end` DATE columns to production `audits` table
2. **INC-W13-PROFILE-TABLE-001 RESOLVED**: `useSettings.ts` `useUserProfile()` and `useUpdateUserProfile()` now use `.from('profiles')` (correct table)

### Full Table Pathway Audit (Wave 13 Addendum C — New Requirement)
3. **Complete audit performed**: All `.from('...')` calls in MAT frontend enumerated (9 DB tables + 2 storage buckets); cross-checked against migrations + data-architecture.md
4. **Additional migrations created**:
   - `20260303000001_evidence_table.sql` — `evidence` table (was missing entirely)
   - `20260303000002_scores_table.sql` — `scores` table (was missing; architecture drift documented)
   - `20260303000003_organisation_settings_table.sql` — `organisation_settings` table (was missing)
   - `20260303000004_storage_buckets.sql` — `audit-documents` + `organisation-assets` storage buckets
5. **T-W13-SCH-5 to T-W13-SCH-12 tests GREEN**: 8 new file-based tests catch table name drift and missing migrations going forward — T-W13-SCH-11 is a structural drift guard that will fail if any hook references a table absent from migrations

### Governance Documentation Updated
6. `BUILD_PROGRESS_TRACKER.md` — Wave 13 Addendum B + Addendum C sections added (full audit table, incident registry, WGI-07/08/09)
7. `RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` — §8 addendum added (F-02 column gap, F-10 table name drift, WGI-05/06)

---

## Suggestions for Improvement

**WGI-07 (closed)**: A mandatory table pathway audit (enumerate every `.from('...')` in frontend, cross-check migration + architecture + test) must be a required pre-wave-close gate item. T-W13-SCH-11 now provides structural enforcement: any new hook that references a table without a migration will fail the test suite.

**New improvement suggestion**: Add T-W13-SCH-11 as a required CI gate check (not just a test in the wave13 test suite) so that any PR adding a new Supabase table reference without a corresponding migration is blocked at the PR level. This converts the pathway audit from a periodic governance activity to a continuous automated enforcement.

---

## Parking Station Append

*(Appended to `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`)*

`| 2026-03-03 | foreman-v2-agent | session-095 | [SESSION-END] | Table pathway audit: T-W13-SCH-11 drift guard added; consider promoting to a CI gate blocking any PR that adds a hook referencing an absent migration | PREHANDOVER-session-095-wave13-addendum-bc-20260303.md |`
