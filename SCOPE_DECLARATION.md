# Scope Declaration — fix-signup-onboarding-route-20260428

**Wave**: fix-signup-onboarding-route-20260428
**Issue**: maturion-isms#1507
**Branch**: copilot/fix-signup-onboarding-route
**Date**: 2026-04-28
**Last refreshed**: 2026-04-29 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Fix two build defects shipped in B3/B7 waves:
1. `ProtectedRoute` redirected unauthenticated users to `/login` but no `LoginPage.tsx`
   or `/login` route existed — users were stuck in an unresolvable redirect loop.
2. `mmm-upload-framework-source` incorrectly required ADMIN role. Architecture §A4.2
   specifies JWT-only (any authenticated user may upload a framework source document);
   the ADMIN gate belongs only on `mmm-framework-publish`.

Also fixes pre-existing B8 test failures (T-MMM-S6-112 / T-MMM-S6-175) by updating
`BUILD_PROGRESS_TRACKER.md` with correct phrase patterns, and corrects the B9 test
that misclassified `mmm-upload-framework-source` as an admin-only function.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `apps/mmm/src/App.tsx` - Added LoginPage import and /login route
- `apps/mmm/src/pages/LoginPage.tsx` - New login page with supabase.auth.signInWithPassword
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` - Added B7 BLOCKED and Stage 12 IN_PROGRESS text for T-MMM-S6-112/T-MMM-S6-175 test compliance
- `modules/MMM/tests/B9-golden-path/b9-golden-path.test.ts` - Removed mmm-upload-framework-source from adminOnlyFunctions; added 7 anti-regression tests for issue #1507
- `supabase/functions/mmm-upload-framework-source/index.ts` - Removed requireRole(['ADMIN']); JWT-only per architecture §A4.2
- `.agent-admin/assurance/iaa-wave-record-fix-signup-onboarding-20260428.md` - IAA wave record with PRE-BRIEF for this wave
- `.agent-workspace/foreman-v2/memory/session-fix-signup-onboarding-20260428.md` - Foreman session memory with agents_delegated_to: ui-builder, api-builder, qa-builder

## Out of Scope

- Any Supabase schema migrations
- Any deployment workflow changes
- Any other app directories outside `apps/mmm/src/` and `supabase/functions/mmm-upload-framework-source/`
- Any governance canon files
- Any other test suites (B1–B8 unchanged)

