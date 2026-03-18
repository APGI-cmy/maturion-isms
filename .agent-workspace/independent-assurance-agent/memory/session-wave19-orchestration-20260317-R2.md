# IAA Session Memory — Wave 19 Audit R2

**Session ID**: session-wave19-orchestration-20260317-R2
**Date**: 2026-03-17
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING

---

## Session Fields

```yaml
session_id: session-wave19-orchestration-20260317-R2
date: 2026-03-17
pr_reviewed: "Wave 19 — MAT Criteria Parsing Holistic Repair (branch: copilot/wave-19-holistic-mat-criteria-repair, issue #1137)"
invoking_agent: foreman-v2-agent
producing_agent: "qa-builder (Batches A, F), schema-builder (Batch B), api-builder (Batch C), ui-builder (Batch D), integration-builder (Batch E)"
producing_agent_class: builder

pr_category: AAWP_MAT (PRIMARY) / CI_WORKFLOW (SECONDARY)
checks_executed: 19
checks_passed: 18
checks_failed: 1
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave19-orchestration-20260317-REJECTION-R2
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-wave19-orchestration-20260317 (R1 REJECTION-PACKAGE — context for R2)
  - session-wave18-postmerge-hotfix-20260315-AUDIT
  - session-wave16-full-batch-20260310
  - session-wave16-orchestration-20260309-R2
  - session-wave16-orchestration-20260309

failures_cited:
  - check: A-032 / SCHEMA-COLUMN-COMPLIANCE
    description: >
      Migration 20260317000003_parse_write_back_atomic_rpc.sql INSERT into
      public.criteria uses column `name` which does NOT exist. Cumulative criteria
      columns through all migrations: id, mps_id, domain_id, audit_id,
      organisation_id, number(TEXT), description, guidance, excluded, sort_order,
      title (Wave 17), intent_statement (Wave 18), source_anchor (Wave 18),
      created_at, updated_at. The column for criterion label is `title`, not `name`.
      The builders' A-032 self-check in the migration header documented function
      creation only — column name cross-reference was not completed.
      Note: Edge Function direct upsert uses correct `title` column.
      RPC is currently not called by Edge Function (dormant defect).
    fix: >
      In migration 000003, change `name,` to `title,` in INSERT column list AND
      `v_crit->>'name',` to `v_crit->>'title',` in VALUES clause.
      Update A-032 self-check comment to document column name verification.
      Commit, push, re-invoke IAA (R3).
```

---

## R1 Resolutions Confirmed

All 6 R1 failures verified as resolved in R2 invocation:
- CORE-021/A-021: HEAD 2ff6fc87 = origin ✅
- CORE-013/CORE-018: PREHANDOVER committed at 2ff6fc87, 158 lines, non-empty ✅
- CORE-015: Session memory committed at 2ff6fc87 ✅
- CORE-016/A-029: `iaa_audit_token: IAA-session-wave19-orchestration-20260317-PASS` present ✅
- CORE-022/A-026: SCOPE_DECLARATION overwritten with Wave 19 list, A-031 carve-out present ✅
- OVL-AM-CWT-01: CWT PASS recorded in PREHANDOVER with scope ✅

---

## FAIL-ONLY-ONCE Rules Applied

```yaml
fail_only_once_rules_applied:
  - rule: A-001
    outcome: "PASS — PREHANDOVER proof committed and non-empty at 2ff6fc87"
  - rule: A-021
    outcome: "PASS — all commits pushed, HEAD matches origin"
  - rule: A-026
    outcome: "PASS — SCOPE_DECLARATION current with Wave 19 file list"
  - rule: A-029
    outcome: "PASS — iaa_audit_token pre-populated in PREHANDOVER"
  - rule: A-031
    outcome: "PASS — A-031 carve-out note present; IAA ceremony files excluded from SCOPE_DECLARATION"
  - rule: A-032
    outcome: >
      FAIL — parse_write_back_atomic RPC INSERT into criteria uses column `name`
      which does not exist. Correct column is `title` (Wave 17 DDL).
      Builders' A-032 self-check comment was incomplete — documented function
      creation only, did not cross-reference column names against cumulative DDL.
```

---

## Build Quality Note

Wave 19 substantive quality remains STRONG:
- 14/14 T-W19-NNN PASS (vitest 316ms, independently verified by IAA)
- All 12 GAP-PARSE-001 through GAP-PARSE-012 addressed in production files
- Edge Function uses `title` correctly (direct upsert path unaffected)
- Migration 000001 (criteria.number TEXT) — correct and idempotent
- Migration 000002 (MPS intent_statement/guidance) — correct and idempotent
- AD-W19-001 honoured: mps.number stays INTEGER ✅
- CodeQL 0 alerts per api-builder evidence
- R2 failure is a single DDL column name fix — R3 should be a clean PASS

---

## Learning Notes

1. **A-032 self-check by builders must include column name cross-reference, not just function creation.**
   Migration 000003 had an `A-032 DDL self-check` comment that documented "Function created:
   parse_write_back_atomic" and "Assertion test: T-W19-008" — but critically did NOT cross-check
   whether the INSERT column names match the actual cumulative DDL. This is exactly the gap
   A-032 was designed to prevent. The builders performed a partial self-check.
   IAA's independent cumulative DDL audit is what caught this: `criteria.name` → should be `criteria.title`.

2. **A-032 applies to dormant code paths.** The RPC function is not currently called by the
   Edge Function (which uses direct supabase-js upsert with correct `title` column). However,
   A-032 is unconditional — "mocked tests do NOT satisfy; non-existent column = REJECTION-PACKAGE."
   Dead code with a column name bug is still an A-032 violation. The function would fail at
   runtime the moment any client calls it.

3. **File-based tests do not substitute for DDL column validation.** T-W19-008 checks that
   the migration file contains the RPC function — it does not execute the SQL against a live DB
   or validate column names. This is a known limitation of the file-based test pattern. IAA's
   A-032 check fills this gap by reading DDL directly and cross-referencing against cumulative
   migration history.

4. **The naming inconsistency pattern (`name` vs `title`) is a cross-wave trap.** The Wave 17
   migration (`20260311000001_criteria_add_title_column.sql`) added `title` to criteria.
   Other tables (mini_performance_standards, domains) use `name`. When Batch C api-builder
   wrote the RPC, they likely copied the MPS INSERT pattern (which correctly uses `name`)
   and applied it to criteria (which uses `title`). This is a subtle trap in cross-table
   schema consistency. Consider adding a schema reference card to the builder knowledge base.

---

## Suggestions for Improvement (MANDATORY — must not be blank)

1. **Builder A-032 self-check template should require column-level verification.**
   The migration header comment template for A-032 self-checks should require builders
   to explicitly list EACH column name in every INSERT/SELECT, cross-referenced against
   the cumulative DDL. The current practice of documenting "function created" and
   "assertion test" without verifying column names defeats the purpose of A-032.
   Suggested template addition:
   ```
   -- A-032 DDL self-check:
   --   Table: <table_name>
   --   Operation: INSERT / SELECT / UPDATE
   --   Columns used: <explicit list, each verified against cumulative DDL>
   --   Cumulative DDL source: <list migations that define each column>
   --   All columns confirmed to exist: YES
   ```

2. **Schema reference card for IAA and builders.**
   A committed `docs/schema-column-reference.md` listing the current cumulative column
   set for each core table (domains, mini_performance_standards, criteria, criteria_documents,
   audit_logs, etc.) would serve as a quick-reference for both builders writing migrations
   and IAA cross-checking DDL. This would make A-032 violations much easier to catch
   self-service before IAA invocation.

3. **R3 should be a clean PASS.** The single fix (2 word changes + comment update in
   migration 000003) is low-risk. The rest of Wave 19 is production-ready.

---

## Fail-Only-Once Updates

The following update is recommended to CS2/CodexAdvisor based on this session:

**Proposed strengthening of A-032**: Add to A-032 rule text:
"Builders' A-032 self-check comments in migration DDL MUST include explicit column-by-column
verification, not just function-creation documentation. A migration with A-032 self-check
comment that does not list each column name individually has not satisfied A-032 self-check."

This would encode the lesson from this session: the presence of an `-- A-032 DDL self-check:`
comment is not sufficient — it must contain the actual column name verification.

---

## Parking Station Entry

See `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Session**: session-wave19-orchestration-20260317-R2 | Date: 2026-03-17
