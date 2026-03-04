# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave 14 / Governance Remediation: UX Workflow Gaps (issue #909)
**Session ID**: session-099
**Date**: 2026-03-04
**Branch**: copilot/governance-remediation-fix
**CS2 Authorization**: Issue #909 opened by @APGI-cmy (CS2 direct); assigns foreman-v2-agent

---

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | FRS addendum FR-089–FR-102 (GAP-W01–W14) | foreman-v2-agent (planning artifact) | 🟢 DONE | this PR |
| 2 | TRS addendum TR-089–TR-102 (GAP-W01–W14) | foreman-v2-agent (planning artifact) | 🟢 DONE | this PR |
| 3 | RED QA suite spec document (wave14-ux-gap-red-suite.md) | foreman-v2-agent (spec) + qa-builder (implementation) | 🟡 IN PROGRESS | this PR |
| 4 | Implementation plan updated with Wave 14 gap waves | foreman-v2-agent (planning artifact) | 🟢 DONE | this PR |
| 5 | BUILD_PROGRESS_TRACKER.md governance failure heading + gap log | foreman-v2-agent (planning artifact) | 🟢 DONE | this PR |
| 6 | RED test files implementation (T-W14-UX-001 to T-W14-UX-016) | qa-builder | 🔴 PENDING | TBD |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [ ] All tasks above show 🟢 DONE
- [ ] All PRs have ASSURANCE-TOKEN
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

---

<!-- original template content below -->
# Wave Current Tasks — foreman-v2-agent (ORIGINAL TEMPLATE — DO NOT USE)

**Wave**: Wave postbuild-fails-02 / MAT Supabase RLS Full Remediation
**Session ID**: session-098
**Date**: 2026-03-04
**Branch**: copilot/add-wave-next-entry-supabase-rls
**CS2 Authorization**: Issue #897 — Wave Next: Foreman to orchestrate remediation for Supabase RLS failures and record all failed states

---

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | Add 'Wave postbuild-fails-02' entry to implementation-plan.md defining full RLS remediation scope | foreman (governance doc) | 🟢 DONE | modules/mat/03-implementation-plan/implementation-plan.md v2.4.0 |
| 2 | Record ALL failures from supabase-sync-audit-20260304.md in BUILD_PROGRESS_TRACKER.md (GAP-001–GAP-005 + remaining unverified tables) | foreman (governance doc) | 🟢 DONE | modules/mat/BUILD_PROGRESS_TRACKER.md — all 13 GAPs recorded |
| 3 | Update App Description, FRS, TRS — mark all RLS-incomplete sections as RED / Needs Remediation (FR-084–FR-088, TR-084–TR-088) | foreman (governance doc) | 🟢 DONE | App Desc v1.4 §21 / FRS v1.8.0 / TRS v1.7.0 — all 🔴 NEEDS REMEDIATION |
| 4 | RED gate QA tests T-PBF2-001 to T-PBF2-008 — assert RLS policies exist for 8 remaining tables | qa-builder | 🟢 DONE | modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts — 8/8 GREEN |
| 5 | RLS policy migrations for all remaining tables (organisations INSERT/UPDATE, domains INSERT/UPDATE, criteria INSERT/UPDATE, evidence INSERT/UPDATE/DELETE, scores INSERT/UPDATE, organisation_settings INSERT/UPDATE, audit_scores INSERT/UPDATE, mini_performance_standards read-only guard) | schema-builder | 🟢 DONE (IAA ASSURANCE-TOKEN received) | apps/maturion-maturity-legacy/supabase/migrations/20260304000004_fix_rls_remaining_tables.sql — T-PBF2-001 to T-PBF2-008 ALL GREEN |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [x] All tasks above show 🟢 DONE
- [x] All PRs have ASSURANCE-TOKEN (pending IAA post-handover — Step 4.3a in progress)
- [x] Session memory written (session-098-20260304.md)
- [x] PREHANDOVER proof committed (PREHANDOVER-session-098-wave-postbuild-fails-02-20260304.md)
- [ ] CS2 notified for merge approval

---

## Scope Summary

This wave is the follow-on remediation to Wave postbuild-fails-01 (PR #895). That wave fixed the two
P0 production blockers (profiles RLS + audits RLS INSERT). This wave addresses the FULL audit:

### Failures Recorded in supabase-sync-audit-20260304.md (complete list)

| ID | Table | Gap | Priority | Fixed in Wave |
|----|-------|-----|----------|---------------|
| GAP-001 | profiles | No INSERT policy | 🔴 P0 | postbuild-fails-01 ✅ |
| GAP-002 | profiles | No UPDATE policy | 🔴 P0 | postbuild-fails-01 ✅ |
| GAP-003 | profiles | No SELECT policy | 🔴 P0 | postbuild-fails-01 ✅ |
| GAP-004 | audits | No INSERT policy | 🔴 P0 | postbuild-fails-01 ✅ |
| GAP-005 | (trigger) | No handle_new_user() | 🔴 P0 | postbuild-fails-01 ✅ |
| GAP-006 | organisations | No documented policies | 🟡 HIGH | postbuild-fails-02 ✅ |
| GAP-007 | domains | SELECT only, no INSERT/UPDATE | 🟡 HIGH | postbuild-fails-02 ✅ |
| GAP-008 | mini_performance_standards | No documented policies | 🟡 HIGH | postbuild-fails-02 ✅ |
| GAP-009 | criteria | SELECT only, no INSERT/UPDATE | 🟡 HIGH | postbuild-fails-02 ✅ |
| GAP-010 | evidence | No documented policies | 🔴 P0 | postbuild-fails-02 ✅ |
| GAP-011 | scores | No documented policies | 🔴 P0 | postbuild-fails-02 ✅ |
| GAP-012 | organisation_settings | No documented policies | 🟡 HIGH | postbuild-fails-02 ✅ |
| GAP-013 | audit_scores | No documented policies | 🟡 HIGH | postbuild-fails-02 ✅ |

### Untested Paths (from audit hook cross-reference)

| Hook | Table | Test ID | Status |
|------|-------|---------|--------|
| useUpdateUserProfile | profiles | T-PBF-002 | ✅ GREEN (postbuild-fails-01) |
| useUserProfile | profiles | T-PBF-004 | ✅ GREEN (postbuild-fails-01) |
| useCreateAudit | audits | T-PBF-003 | ✅ GREEN (postbuild-fails-01) |
| useEvidence / useCreateEvidence | evidence | T-PBF2-001 | 🔴 RED — untested |
| useScores / useSubmitScore | scores | T-PBF2-002 | 🔴 RED — untested |
| useAuditScores | audit_scores | T-PBF2-003 | 🔴 RED — untested |
| useOrganisationSettings | organisation_settings | T-PBF2-004 | 🔴 RED — untested |
| useCriteria / useCreateCriteria | criteria | T-PBF2-005 | 🔴 RED — untested |
| useDomains | domains | T-PBF2-006 | 🔴 RED — untested |
| useOrganisations | organisations | T-PBF2-007 | 🔴 RED — untested |
| useMiniPerformanceStandards | mini_performance_standards | T-PBF2-008 | 🔴 RED — untested |
