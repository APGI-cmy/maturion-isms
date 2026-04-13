# IAA Verdict File — Session 140 / Wave 14 Batch A / 2026-03-04 (RE-INVOCATION — ASSURANCE-TOKEN)

## Artifact Header

| Field | Value |
|-------|-------|
| Token Reference | `IAA-session-140-wave14-batchA-20260304-PASS` |
| Session ID | session-140 (re-invocation — STOP-AND-FIX resolved) |
| Date | 2026-03-04 |
| IAA Agent Version | independent-assurance-agent v6.2.0 / contract v2.1.0 |
| PR Branch | `copilot/implement-onboarding-and-assignment` |
| Wave | Wave 14 Batch A |
| PR Category | AAWP_MAT |
| Invoking Agent | foreman-v2-agent |
| Producing Agents | schema-builder (migrations), ui-builder (React), foreman-v2-agent (governance/scope fix) |
| Adoption Phase | PHASE_B_BLOCKING — Hard gate ACTIVE |
| Authority | CS2 only (@APGI-cmy) |

---

## Re-Invocation Context

**Prior verdict**: REJECTION-PACKAGE (`IAA-session-140-wave14-batchA-20260304-REJECTION`)
**Prior failure**: A-026 / BL-027 — SCOPE_DECLARATION.md stale (did not match `git diff --name-only origin/main...HEAD`)
**STOP-AND-FIX resolution**: SCOPE_DECLARATION.md updated and committed at HEAD `37bfc9d` — all 14 changed files declared
**A-030 carve-out applied**: Correction addendum committed; prior rejection documented in session memory (session-140-20260304.md); PREHANDOVER proof remains immutable (read-only post-commit per §4.3b)

---

## IAA Agent Response (verbatim)

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/implement-onboarding-and-assignment (Wave 14 Batch A — session-140 RE-INVOCATION)
All 57 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-140-wave14-batchA-20260304-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate
═══════════════════════════════════════
```

---

## Checks Summary

| Layer | Total | PASS | FAIL |
|-------|-------|------|------|
| FAIL-ONLY-ONCE learning (A-001, A-002, A-021, A-022, A-026, A-028, A-029, A-030) | 8 | 8 | 0 |
| Core invariants (CORE-001–022) | 22 | 22 | 0 |
| AAWP_MAT overlay (BD-001–024 + CST/CWT/FCWT) | 27 | 27 | 0 |
| **Total** | **57** | **57** | **0** |

---

## A-026 Resolution Verification (Independent IAA Validation)

| Check | Result |
|-------|--------|
| `git diff --name-only origin/main...HEAD` file count | 14 files |
| `SCOPE_DECLARATION.md` declared file count | 14 files |
| `validate-scope-to-diff.sh` output | ✅ Exact set comparison PASSED — 0 missing, 0 extra |
| Sorted diff comparison (`diff /tmp/diff_files.txt /tmp/scope_files.txt`) | EXACT MATCH — 0 differences |
| A-028 format compliance | ✅ List format used; Wave 14 Batch A content only; no prior-wave entries |

---

## Merge Gate Parity Check (§4.3)

| Check | Result |
|-------|--------|
| merge-gate/verdict | PASS ✅ |
| governance/alignment | PASS ✅ |
| stop-and-fix/enforcement | PASS ✅ |

---

## Substantive Review Summary (from prior invocation + re-invocation verification)

**SQL Migrations (4 files) — all P0 watch points resolved:**
- ✅ WP-001: `record_onboarding_complete()` trigger uses `v_user_id := auth.uid()` with NULL guard + `VALUES (v_user_id, NEW.id)`
- ✅ WP-002: INSERT policy added to `onboarding_completions`: `WITH CHECK (user_id = auth.uid())`
- ✅ WP-003: INSERT policies on all 4 assignment tables; UPDATE policy on `audit_invitations` for accept-invite flow
- ✅ WP-004: Migration 000008 `IF EXISTS` guards for Batch B table dependencies
- ✅ WP-005: Dual SELECT policies documented as intentional; harmless (PostgreSQL combines with OR)
- ✅ All migrations idempotent (`IF NOT EXISTS` throughout)
- ✅ FK integrity with `ON DELETE CASCADE`
- ✅ `cascade_exclude_to_children()` — `OLD.excluded IS DISTINCT FROM NEW.excluded` handles NULL correctly
- ✅ `responsibility_cascade` VIEW COALESCE hierarchy correct
- ✅ `create_report_gate` VIEW correctly filters `WHERE c.excluded IS NOT TRUE`
- ✅ CHECK constraints on `audit_invitations` (status, scope_type values)

**Frontend (2 files) — routing and data-testid verified:**
- ✅ WP-006: `/onboarding` inside ProtectedRoute but OUTSIDE OnboardingGuard — no infinite redirect
- ✅ WP-007: `useCreateOrganisation` upserts `profiles.organisation_id` (useSettings.ts line 184)
- ✅ `data-testid="onboarding-guard"`, `data-testid="onboarding-step-1"`, `data-testid="onboarding-step-2"`
- ✅ WCAG: `role="status"`, `aria-live="polite"`, `aria-required`, `role="alert"` present
- ✅ No hardcoded secrets; no injection vectors

**Test results:**
- ✅ 37/37 Batch A RED gate tests GREEN (T-W14-UX-001 through T-W14-UX-015)
- ✅ CodeQL: 0 alerts

---

## CST Advisory (Standing — carried from first invocation)

Cross-boundary integration point: SQL migrations → React frontend via Supabase RLS + hooks.
Foreman **must commission a CST** before Wave 14 full completion (Batch B merged) covering:
- Complete migration sequence 000000–000008
- All frontend routes (onboarding, invitation acceptance, assignment views, responsibility cascade display)
Per `COMBINED_TESTING_PATTERN.md` §4.2.

---

## CWT Carry-Forward Mandate

CWT is required before Wave 14 IBWR completion. This PR is Batch A only — CWT is not required here.
Foreman must ensure CWT PASS is recorded in the Wave 14 IBWR artifact before wave closure.
Per `COMBINED_TESTING_PATTERN.md` §5.2.

---

## Verdict

**ASSURANCE-TOKEN — all 57 checks PASS. Merge permitted (subject to CS2 approval).**
**Token reference**: `IAA-session-140-wave14-batchA-20260304-PASS`
**Re-invocation of**: prior REJECTION-PACKAGE `IAA-session-140-wave14-batchA-20260304-REJECTION`
**STOP-AND-FIX**: fully resolved — A-026/BL-027 finding cleared.

---

*Authority: CS2 (Johan Ras / @APGI-cmy). Merge authority: CS2 ONLY.*
*IAA adoption phase: PHASE_B_BLOCKING — hard gate active.*

PHASE_B_BLOCKING_TOKEN: IAA-session-140-wave14-batchA-20260304-PASS
