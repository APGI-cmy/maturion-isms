# IAA Session Memory — session-wave-criteria-delete-reparse-20260309

## Session Metadata

```yaml
session_id: session-wave-criteria-delete-reparse-20260309
date: 2026-03-09
agent_version: independent-assurance-agent v6.2.0 (contract v2.2.0)
pr_reviewed: copilot/add-document-delete-reparse-function
wave: wave-criteria-delete-reparse
invoking_agent: foreman-v2-agent
producing_agent: api-builder, ui-builder, qa-builder, foreman-v2-agent
producing_agent_class: builder + foreman
pr_category: AAWP_MAT
checks_executed: 33
checks_passed: 31
checks_failed: 2
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-REJECT-wave-criteria-delete-reparse-20260309
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave-session-refresh-auth-fix-20260309-R2
  - session-wave-session-refresh-auth-fix-20260309
  - session-wave-upload-doclist-fix-20260308-R2
  - session-wave-upload-doclist-fix-20260308
  - session-wave15-schemadrift-20260307
```

---

## Invocation Summary

IAA was invoked for a final audit of wave-criteria-delete-reparse. Pre-Brief was available (commit
`5030d8b`). POLC violation GOV-BREACH-AIMC-W5-002 (code committed before pre-brief) was acknowledged
and documented. 33 checks executed: 31 PASS, 2 FAIL.

---

## Failures Cited

### BD-015 — RLS Policies Incomplete (PRIMARY FINDING)

The new mutation hooks (`useDeleteCriteriaDocument`, `useReparseCriteriaDocument`) perform DELETE
and upsert (INSERT + UPDATE) operations on three RLS-enabled tables. The following RLS policies
are absent from ALL migrations across the repository:

| Table | Operation | Missing Policy |
|-------|-----------|---------------|
| `public.domains` | DELETE | `domains_delete_org_isolation` |
| `public.criteria_documents` | INSERT (upsert) | `criteria_documents_insert_org_isolation` |
| `public.criteria_documents` | UPDATE (upsert) | `criteria_documents_update_org_isolation` |
| `public.criteria_documents` | DELETE | `criteria_documents_delete_org_isolation` |
| `public.audit_logs` | DELETE | `audit_logs_delete_org_isolation` |

**Fix**: Add migration `20260309000003_criteria_delete_reparse_rls.sql` with all 5 policies
using idempotent `DO $$ IF NOT EXISTS` guards following the pattern in `fix_rls_remaining_tables.sql`.

### BD-003 — One-Time Build Compliance FAIL (DERIVED FROM BD-015)

The feature will not function at runtime due to BD-015. Resolved by fixing BD-015.

---

## Checks That PASSED (Notable)

- Tests 29/29 GREEN confirmed locally ✅
- ESLint 0 warnings confirmed locally ✅
- Hook implementations clean, well-factored, audit-scoped ✅
- `useCallback` wrapping resolves ESLint CI issue correctly ✅
- Auth session refresh before Edge Function — correct pattern ✅
- TypeScript strictness — no `any` casts ✅
- PREHANDOVER proof: correct A-029 §4.3b architecture (pre-populated expected reference) ✅
- Session memory: complete and well-structured ✅
- A-032 (unique constraint): migration creates UNIQUE INDEX on (audit_id, file_path) — verified ✅
- IAA Pre-Brief: committed retroactively at `5030d8b`, POLC violation acknowledged ✅
- Evidence artifact sweep: CORE-018 PASS (all 4 conditions satisfied, First Invocation Exception applied for token file) ✅

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | IAA invocation evidence check | PASS — PREHANDOVER present with token reference |
| A-002 | No-class-exceptions check | PASS — AAWP_MAT category, no contract changes |
| A-026 | SCOPE_DECLARATION matches diff | PASS — personal SCOPE_DECLARATION covers 5 deliverable files (ceremony artifacts excluded per convention) |
| A-029 | PREHANDOVER proof immutability §4.3b | PASS — pre-populated expected reference, token written to dedicated file |
| A-031 | IAA ceremony artifact carve-out | N/A — No prior rejection ceremony for this PR |
| A-032 | Schema column compliance | PASS — all columns verified in migration DDL |

---

## fail_only_once_updates

No new FAIL-ONLY-ONCE rules triggered by this session. However, observing the following:

**Pattern for learning**: The BD-015 pattern (RLS mutation policies missing) has now been observed
in multiple waves:
- wave-audit-log-column-fix (INC-ALCF-001 — missing columns)
- wave-criteria-delete-reparse (missing DELETE/INSERT/UPDATE RLS policies)

**Consideration**: IAA should proactively check, for any PR introducing new mutation hooks (useMutation
with DELETE or upsert operations), that DELETE/INSERT/UPDATE RLS policies exist alongside SELECT policies.
This is distinct from A-032 (column names) — this is a "full CRUD policy coverage" check. The current
BD-015 check captures this but its wording focuses on "table created or modified" — it should be
broadened to explicitly include "new hooks performing operations on existing tables."

Parking station entry added for this pattern.

---

## Learning Notes

1. **RLS DELETE policy gap is subtle**: The `fix_rls_remaining_tables.sql` (GAP-007) added INSERT and 
   UPDATE policies for `domains` but not DELETE. The `audit_logs_table.sql` added SELECT and INSERT 
   but not DELETE. The `criteria_documents_processing_status.sql` added only SELECT. When reviewing 
   AAWP/MAT PRs that add mutation hooks, IAA should immediately scan for CRUD policy completeness 
   on all tables the hooks touch, not just the tables the PR creates.

2. **High-quality implementation, single infrastructure gap**: The implementation code (hooks + UI + tests)
   is genuinely well-written. The gap is purely in the migration layer. This confirms the 90% substantive
   review principle — IAA found the real issue by reading the code and cross-checking migrations, not 
   by focusing on ceremony.

3. **Pre-Brief retroactive process works**: The retroactive Pre-Brief (commit `5030d8b`) functioned
   correctly as a roadmap for IAA — the §4/§6 FFA checks and §8 SCOPE_DECLARATION requirements were 
   accurate and helpful. GOV-BREACH-AIMC-W5-002 acknowledged, documented, and not determinative.

---

## Suggestions for Improvement (Mandatory — must not be blank)

**Concrete improvement for IAA knowledge**: BD-015 check wording in `iaa-category-overlays.md` 
should be augmented to explicitly state: "For any PR introducing mutation hooks (useMutation with
INSERT/UPDATE/DELETE operations) touching existing Supabase tables: verify SELECT, INSERT, UPDATE, 
and DELETE policies exist for all mutation operation types. The absence of a DELETE policy on a 
table that was created by a prior migration is NOT covered by CORE-006 (which only checks 
expected_artifacts). This gap must be caught by BD-015." This would have been a useful explicit
prompt during the overlay check for this wave.

---

## Parking Station Entry

See `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` for entry:
`| 2026-03-09 | independent-assurance-agent | session-wave-criteria-delete-reparse-20260309 | Phase 3 BD-015 | Augment BD-015 check wording: explicitly cover mutation-hook RLS CRUD coverage on existing tables, not only newly created tables | session-wave-criteria-delete-reparse-20260309.md |`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | Contract: 2.2.0
