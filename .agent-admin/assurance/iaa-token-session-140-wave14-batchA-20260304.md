# IAA Verdict File — Session 140 / Wave 14 Batch A / 2026-03-04

## Artifact Header

| Field | Value |
|-------|-------|
| Token Reference | `IAA-session-140-wave14-batchA-20260304` |
| Session ID | session-140 |
| Date | 2026-03-04 |
| IAA Agent Version | independent-assurance-agent v6.2.0 / contract v2.1.0 |
| PR Branch | `copilot/implement-onboarding-and-assignment` |
| Wave | Wave 14 Batch A |
| PR Category | AAWP_MAT |
| Invoking Agent | foreman-v2-agent |
| Producing Agents | schema-builder (migrations), ui-builder (React), foreman-v2-agent (governance) |
| Adoption Phase | PHASE_B_BLOCKING — Hard gate ACTIVE |
| Authority | CS2 only (@APGI-cmy) |

---

## IAA Agent Response (verbatim)

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-onboarding-and-assignment (Wave 14 Batch A — session-140)
1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  A-026 / BL-027: SCOPE_DECLARATION.md stale — merge gate parity failure

  Finding:
    SCOPE_DECLARATION.md currently reflects session-101 / wave-bd022-bd017
    (PR: copilot/fix-organisation-name-type-mismatch). The file has not been
    updated for Wave 14 Batch A. Zero matches for "wave14", "Wave 14",
    "onboarding", "assignment", "20260305", or "session-140" in the file.

    Per FAIL-ONLY-ONCE A-026: SCOPE_DECLARATION.md must match
    `git diff --name-only origin/main...HEAD` exactly before IAA invocation.
    The current branch diff contains 10 files; SCOPE_DECLARATION.md is not
    in the diff and does not list any of those files.

    This is a BL-027 merge gate parity failure. Local gate check:
    merge-gate/verdict = FAIL, stop-and-fix/enforcement = FAIL.

  Fix required:
    Update SCOPE_DECLARATION.md to declare Wave 14 Batch A scope, listing
    all 10 files in the current branch diff:
      - .agent-admin/assurance/iaa-prebrief-wave14-batchA.md
      - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-140-wave14-batchA-20260304.md
      - .agent-workspace/foreman-v2/memory/session-140-wave14-batchA-20260304.md
      - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
      - apps/maturion-maturity-legacy/supabase/migrations/20260305000000_wave14_onboarding_support.sql
      - apps/maturion-maturity-legacy/supabase/migrations/20260305000001_wave14_invitations_assignments.sql
      - apps/maturion-maturity-legacy/supabase/migrations/20260305000002_wave14_excluded_columns.sql
      - apps/maturion-maturity-legacy/supabase/migrations/20260305000008_wave14_new_tables_rls.sql
      - modules/mat/frontend/src/App.tsx
      - modules/mat/frontend/src/pages/OnboardingPage.tsx

    Commit the updated SCOPE_DECLARATION.md.
    Re-invoke IAA.
    Note: SCOPE_DECLARATION.md will then appear as modified in the diff —
    include it in the declaration (A-028 format compliance: list format,
    prior-wave entries trimmed).

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate.
═══════════════════════════════════════
```

---

## Checks Summary

| Layer | Total | PASS | FAIL |
|-------|-------|------|------|
| FAIL-ONLY-ONCE learning | 5 | 5 | 0 |
| Core invariants (CORE-001–022) | 22 | 22 | 0 |
| AAWP_MAT overlay (BD-001–023 + CST/CWT/FCWT) | 23 | 23 | 0 |
| A-026 BL-027 merge gate parity | 1 | 0 | **1** |
| **Total** | **51** | **50** | **1** |

---

## Substantive Review — Positive Findings (documented for completeness)

The substantive 90% review of the Wave 14 Batch A deliverables confirms:

**SQL Migrations (4 files):**
- ✅ WP-001 resolved: `record_onboarding_complete()` trigger uses `v_user_id := auth.uid()` with NULL guard and `VALUES (v_user_id, NEW.id)` — correct.
- ✅ WP-002 resolved: `onboarding_completions_insert` policy added with `WITH CHECK (user_id = auth.uid())` — correct.
- ✅ WP-003 resolved: INSERT policies added to all 4 assignment tables; UPDATE policy on `audit_invitations` for accept-invite flow — correct.
- ✅ `cascade_exclude_to_children()` uses `OLD.excluded IS DISTINCT FROM NEW.excluded` — handles NULL correctly. Domain→MPS+Criteria cascade and MPS→Criteria cascade both implemented.
- ✅ `responsibility_cascade` VIEW COALESCE hierarchy (criteria→MPS→domain→lead auditor) correct.
- ✅ `create_report_gate` VIEW correctly filters `WHERE c.excluded IS NOT TRUE`.
- ✅ All migrations fully idempotent (`IF NOT EXISTS` throughout).
- ✅ FK integrity: all `ON DELETE CASCADE` where appropriate.
- ✅ `audit_invitations`: `CHECK (status IN ('pending', 'accepted'))` and `CHECK (scope_type IN ('domain', 'criteria'))` defensive constraints present.
- ✅ WP-004: Migration 000008 uses IF EXISTS table guards for Batch B tables — correct.
- ✅ WP-005: Dual SELECT policies on `audit_invitations` / `domain_assignments` documented as intentional redundancy — harmless (PostgreSQL combines with OR).
- ℹ️ Advisory: Migration 000008 header comment lists `mps_level_descriptors` and `domain_level_descriptors` as part of "11 org-scoped Wave 14 tables" but provides no IF EXISTS guards for them in the SQL. These are Batch B tables. Batch B migrations should include RLS for these tables. Not a blocking finding.

**Frontend (2 files):**
- ✅ WP-006 resolved: `/onboarding` route is inside `ProtectedRoute` but OUTSIDE `OnboardingGuard` — no infinite redirect possible. Routing structure correct.
- ✅ WP-007 resolved: `useCreateOrganisation` upserts `profiles.organisation_id` at line 184 of `useSettings.ts` — confirmed by code inspection.
- ✅ `OnboardingGuard` has `data-testid="onboarding-guard"` sentinel for test assertions.
- ✅ `OnboardingPage` step-1 form has `data-testid="onboarding-step-1"`, step-2 has `data-testid="onboarding-step-2"`.
- ✅ WCAG: `role="status"`, `aria-live="polite"`, `aria-required`, `role="alert"` present throughout.
- ✅ No hardcoded secrets. No injection vectors.

**Test results:**
- ✅ 37/37 Batch A RED gate tests GREEN (T-W14-UX-001 through T-W14-UX-015).
- ✅ CodeQL: 0 alerts.

**Governance:**
- ✅ PREHANDOVER proof: complete, all bundle artifacts listed.
- ✅ IAA Pre-Brief: committed at SHA d4b782e.
- ✅ POLC breach (SELF-BREACH-SESSION-140-001) recorded in session memory and PREHANDOVER.
- ✅ CANON_INVENTORY: 191 entries, zero placeholder hashes.

---

## CST Advisory (from OVL-AM-CST-01 evaluation)

This subwave closes a cross-boundary integration point (SQL migrations → React frontend via Supabase RLS + hooks). The 37 Batch A tests cover the integration surface adequately for Batch A.

**Recommendation for Foreman**: Before Wave 14 full completion (Batch B + Batch A combined), commission a CST covering the complete migration sequence (000000–000008) and all frontend routes (onboarding, invitation acceptance, assignment views, responsibility cascade display). Per `COMBINED_TESTING_PATTERN.md` §4.2.

---

## A-026 Fix Path (for re-invocation)

The fix is administrative and does not touch any functional deliverable:

1. Update `SCOPE_DECLARATION.md` to:
   - Header: `Session 140 — Wave 14 Batch A`
   - PR: `copilot/implement-onboarding-and-assignment`
   - Wave: `Wave 14 Batch A — Onboarding, Assignment, Exclude Cascade, Org-Isolation Foundations`
   - List all 10 files in the diff (Added section)
   - Trim prior-wave entry (A-028 format compliance)
2. Commit `SCOPE_DECLARATION.md`.
3. Verify `git diff --name-only origin/main...HEAD` now includes `SCOPE_DECLARATION.md` and all 10+ Wave 14 Batch A files.
4. Re-invoke IAA with updated PREHANDOVER proof referencing this correction.

Per A-030 (CORE-019 re-invocation carve-out): a correction addendum committed on the branch satisfies the re-invocation path for immutable PREHANDOVER scenarios. The PREHANDOVER proof (`iaa_audit_token: IAA-session-140-wave14-batchA-20260304-PASS`) pre-populated reference remains valid for the re-invocation — IAA will write the ASSURANCE-TOKEN to this same file path upon PASS.

---

## Verdict

**REJECTION-PACKAGE — 1 failure. Merge blocked.**
**Token reference**: `IAA-session-140-wave14-batchA-20260304-REJECTION`
**Re-invocation path**: Foreman updates SCOPE_DECLARATION.md, commits, re-invokes IAA.

---

*Authority: CS2 (Johan Ras / @APGI-cmy). Merge authority: CS2 ONLY.*
*IAA adoption phase: PHASE_B_BLOCKING — hard gate active.*
