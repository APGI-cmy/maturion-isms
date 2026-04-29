# Scope Declaration — fix-signup-onboarding-route-20260428

**Wave**: fix-signup-onboarding-route-20260428
**Issue**: maturion-isms#1507
**Branch**: copilot/fix-signup-onboarding-route
**Date**: 2026-04-28
**Last refreshed**: 2026-04-29 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Fix build defects and post-review blocking items (issue #1507):
1. `ProtectedRoute` redirected unauthenticated users to `/login` but no `LoginPage.tsx`
   or `/login` route existed — users were stuck in an unresolvable redirect loop.
2. `SignUpPage.tsx` blindly navigated to `/onboarding` regardless of whether Supabase
   returned a session; if email confirmation is required the user was sent to a protected
   route without explanation. Fix: inspect `data.session` and show email-confirmation
   message when no session is present.
3. `mmm-upload-framework-source` incorrectly required ADMIN role (architecture §A4.2
   specifies JWT-only). Also: the function's INSERT into `mmm_parse_jobs` referenced
   `organisation_id`, `created_by`, `source_type`, and `metadata` but the base schema
   only had `id`, `upload_id`, `document_id`, `status`, `result_json`, `created_at`,
   `updated_at`. Migration added for the missing columns; `metadata` key renamed to
   `result_json` to match the actual JSONB column.
4. Vercel SPA fallback already configured in `vercel.json`; anti-regression test added
   to prove coverage for direct-route navigation to protected routes.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `apps/mmm/src/App.tsx` - Added LoginPage import and /login route
- `apps/mmm/src/pages/LoginPage.tsx` - New login page with supabase.auth.signInWithPassword
- `apps/mmm/src/pages/SignUpPage.tsx` - Inspect data.session after signUp; show email-confirmation message when no session returned; navigate to /onboarding only when session present
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` - Added B7 BLOCKED and Stage 12 IN_PROGRESS text for T-MMM-S6-112/T-MMM-S6-175 test compliance
- `modules/MMM/tests/B9-golden-path/b9-golden-path.test.ts` - Removed mmm-upload-framework-source from adminOnlyFunctions; added anti-regression tests for signup/session, Vercel SPA fallback, and parse-job schema contract
- `supabase/functions/mmm-upload-framework-source/index.ts` - Removed requireRole(['ADMIN']); changed insert to use result_json (not metadata); added schema comment referencing migration
- `supabase/migrations/20260429000001_mmm_parse_jobs_org_columns.sql` - ALTER TABLE to add organisation_id, created_by, source_type columns to mmm_parse_jobs plus RLS policies
- `.agent-admin/assurance/iaa-wave-record-fix-signup-onboarding-20260428.md` - IAA wave record with PRE-BRIEF for this wave
- `.agent-workspace/foreman-v2/memory/session-fix-signup-onboarding-20260428.md` - Foreman session memory with agents_delegated_to: ui-builder, api-builder, qa-builder

## Out of Scope

- Any other Supabase schema migrations
- Any deployment workflow changes
- Any other app directories outside `apps/mmm/src/` and `supabase/functions/mmm-upload-framework-source/`
- Any governance canon files
- Any other test suites (B1–B8 base tests unchanged)
