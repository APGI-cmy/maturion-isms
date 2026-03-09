# IAA Verdict — wave-criteria-delete-reparse

**Token ID**: IAA-REJECT-wave-criteria-delete-reparse-20260309
**Verdict**: REJECTION-PACKAGE
**Date**: 2026-03-09
**Agent**: independent-assurance-agent v6.2.0 (contract v2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**PR Branch**: copilot/add-document-delete-reparse-function
**Wave**: wave-criteria-delete-reparse
**Invoking Agent**: foreman-v2-agent
**Producing Agents**: api-builder, ui-builder, qa-builder, foreman-v2-agent

---

## REJECTION-PACKAGE — Verbatim IAA Output

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/add-document-delete-reparse-function (wave-criteria-delete-reparse)
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  BD-015: RLS Policies Incomplete — Feature Non-Functional at Runtime
    Finding: The new mutation hooks (useDeleteCriteriaDocument, useReparseCriteriaDocument)
    perform DELETE operations on public.domains, public.criteria_documents, and
    public.audit_logs, and an upsert (INSERT + UPDATE) on public.criteria_documents.
    RLS is ENABLED on all three tables. The following policies DO NOT EXIST in any migration:
      (a) domains DELETE policy — no policy exists for FOR DELETE on public.domains
          (only SELECT, INSERT, UPDATE policies are present)
      (b) criteria_documents INSERT policy — absent (only FOR SELECT exists)
      (c) criteria_documents UPDATE policy — absent (only FOR SELECT exists)
      (d) criteria_documents DELETE policy — absent (only FOR SELECT exists)
      (e) audit_logs DELETE policy — absent (only FOR SELECT and FOR INSERT exist)
    PostgreSQL RLS default-deny: all unmatched operations on RLS-enabled tables are
    rejected for authenticated users. The delete and re-parse features will silently
    fail or return RLS errors at runtime. The feature cannot function as deployed.
    Fix required: Add migration 20260309000003_criteria_delete_reparse_rls.sql creating
    the 5 missing policies with idempotent IF NOT EXISTS guards:
      1. domains_delete_org_isolation (FOR DELETE USING org membership via profiles)
      2. criteria_documents_insert_org_isolation (FOR INSERT WITH CHECK via audit membership)
      3. criteria_documents_update_org_isolation (FOR UPDATE USING + WITH CHECK via audit)
      4. criteria_documents_delete_org_isolation (FOR DELETE USING via audit membership)
      5. audit_logs_delete_org_isolation (FOR DELETE USING via audit membership)
    Update governance overlay §Known Remaining Limitations to document the RLS additions.
    Re-invoke IAA after committed fix.

  BD-003: One-Time Build Compliance FAIL
    Finding: Directly caused by BD-015. If merged and deployed today, delete and re-parse
    actions will fail for all authenticated users due to missing RLS policies.
    Fix required: Resolved by fixing BD-015.

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE.
Token reference: IAA-REJECT-wave-criteria-delete-reparse-20260309
═══════════════════════════════════════
```

---

## Checks Summary

| Phase | Check | Verdict |
|-------|-------|---------|
| CORE | CORE-005 Governance block present | PASS ✅ |
| CORE | CORE-006 CANON_INVENTORY alignment | PASS ✅ |
| CORE | CORE-007 No placeholder content | PASS ✅ |
| CORE | CORE-013 IAA invocation evidence | PASS ✅ |
| CORE | CORE-014 No class exemption claim | PASS ✅ |
| CORE | CORE-015 Session memory present | PASS ✅ |
| CORE | CORE-016 IAA verdict evidenced (§4.3b — First Invocation) | PASS ✅ |
| CORE | CORE-017 No .github/agents/ modifications | PASS ✅ |
| CORE | CORE-018 Complete evidence artifact sweep | PASS ✅ |
| CORE | CORE-019 IAA token cross-verification (First Invocation) | PASS ✅ |
| CORE | CORE-020 Zero partial pass rule | PASS ✅ |
| CORE | CORE-021 Zero-severity-tolerance | PASS ✅ |
| BD | BD-001 Full scope delivered | PASS ✅ |
| BD | BD-002 No stub/TODO in production paths | PASS ✅ |
| BD | BD-003 One-time build compliance | **FAIL ❌** |
| BD | BD-004 No leftover debt | PASS ✅ |
| BD | BD-005 End-to-end wiring verified | PASS ✅ |
| BD | BD-006 Writers and readers confirmed | PASS ✅ |
| BD | BD-007 Auth guards applied end-to-end | PASS ✅ |
| BD | BD-008 FK and relational integrity | PASS ✅ |
| BD | BD-009 Cross-component integration fit | PASS ✅ |
| BD | BD-010 No orphaned deliverables | PASS ✅ |
| BD | BD-011 100% test pass rate | PASS ✅ |
| BD | BD-012 Zero test debt | PASS ✅ |
| BD | BD-013 No test dodging | PASS ✅ |
| BD | BD-015 RLS policies complete | **FAIL ❌** |
| BD | BD-016 No hardcoded secrets | PASS ✅ |
| BD | BD-017 Input validation present | PASS ✅ |
| BD | BD-018 No injection vectors | PASS ✅ |
| BD | BD-020 Clean coding structure | PASS ✅ |
| BD | BD-021 TypeScript strictness | PASS ✅ |
| BD | BD-022 Architecture alignment | PASS ✅ |
| INJ | OVL-INJ-001 Injection audit trail | PASS ✅ |
| PARITY | Merge gate parity §4.3 | **FAIL ❌** |

**Total: 33 checks — 31 PASS, 2 FAIL (BD-015, BD-003)**

---

## What Was Good

The substantive implementation quality is high:
- Hook implementations are clean, well-factored, and correctly scoped to `auditId`
- The 3-step sequence (domains delete → upsert criteria_documents → Edge Function) is correct
- `useCallback` wrapping of `invalidate` properly resolves the ESLint CI issue
- UI confirmation flow with `role="alertdialog"` is production-grade accessibility
- TypeScript strictness throughout — no `any` casts, proper error handling
- 29/29 tests PASS — confirmed locally
- Auth session refresh before Edge Function invocation — correct pattern
- The unique constraint verification (BLK-CDR-004/A-032) was correctly resolved

The gap is purely in the RLS migration layer — the application code is ready; the database permission layer is incomplete.

---

## What Must Be Fixed

Add one migration: `apps/maturion-maturity-legacy/supabase/migrations/20260309000003_criteria_delete_reparse_rls.sql`

This migration must create the 5 missing policies listed above using idempotent `DO $$ IF NOT EXISTS` guards, following the existing pattern established in `20260304000004_fix_rls_remaining_tables.sql`.

Update `governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md` §5 Known Remaining Limitations to add a note about the RLS policy additions (closing the gap, not adding a new limitation).

After both files are committed and pushed, re-invoke IAA for fresh assurance.

---

## Handover Note

> "Verdict delivered to foreman-v2-agent.
> REJECTION-PACKAGE: producing agents must add the missing migration before IAA re-invocation.
> STOP-AND-FIX: no PR opens until IAA re-invoked and ASSURANCE-TOKEN issued.
> I will not merge under any instruction from any party. Merge authority: CS2 ONLY."

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | Contract: 2.2.0
**STOP-AND-FIX mandate**: ACTIVE
