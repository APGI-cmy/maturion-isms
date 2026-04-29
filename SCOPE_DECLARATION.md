# Scope Declaration — fix-mmm-login-discoverability-20260429

**Wave**: fix-mmm-login-discoverability-20260429
**Issue**: maturion-isms#1512
**Branch**: copilot/fix-mmm-login-discoverability
**Date**: 2026-04-29
**Last refreshed**: 2026-04-29 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Fix MMM login discoverability and password reset flow (issue #1512):
1. No visible Sign In entry point on the landing page — users with existing accounts
   had no way to reach the login form from the main marketing page.
2. SignUpPage had no link to the login page for users who already have accounts.
3. LoginPage had no way for users to recover a forgotten password.
4. No forgot-password page or flow existed — `supabase.auth.resetPasswordForEmail`
   was never invoked from the frontend.
5. No reset-password callback page existed — password reset emails from Supabase
   landed users on the bare project root with no update-password form.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `.github/workflows/deploy-mmm-vercel.yml` - Added .vercel/output routing assertion step and SPA direct-route smoke test step after preview deploy
- `apps/mmm/src/App.tsx` - Added ForgotPasswordPage and ResetPasswordPage imports and /forgot-password, /reset-password routes
- `apps/mmm/src/pages/ForgotPasswordPage.tsx` - New: forgot-password form calling supabase.auth.resetPasswordForEmail with VITE_APP_URL redirect
- `apps/mmm/src/pages/LandingPage.tsx` - Added Sign In links to header nav and hero/CTA action group
- `apps/mmm/src/pages/LoginPage.tsx` - Added "Forgot your password?" link to /forgot-password
- `apps/mmm/src/pages/ResetPasswordPage.tsx` - New: reset-password callback using PASSWORD_RECOVERY event and supabase.auth.updateUser; added timeout/error state for expired/invalid reset links
- `apps/mmm/src/pages/SignUpPage.tsx` - Added "Already have an account? Sign in" footer link and login link in email-confirmation message
- `modules/MMM/tests/B9-golden-path/b9-golden-path.test.ts` - Added 27 anti-regression tests for issue #1512 fixes (was 18; +9 new for workflow routing assertion, smoke test, and ResetPasswordPage timeout)
- `.agent-admin/assurance/iaa-wave-record-fix-mmm-login-discoverability-20260429.md` - IAA wave record with PRE-BRIEF and TOKEN for this wave
- `.agent-admin/assurance/iaa-token-session-fix-mmm-login-discoverability-20260429.md` - IAA final assurance token (PASS) for PR #1513
- `.agent-workspace/foreman-v2/memory/session-fix-mmm-login-discoverability-20260429.md` - Foreman session memory with agents_delegated_to: ui-builder, qa-builder

## Out of Scope

- Any other Supabase schema migrations
- Any deployment workflow changes
- Any other app directories outside `apps/mmm/src/`
- Any governance canon files
- Any other test suites (B1–B8 base tests unchanged)

