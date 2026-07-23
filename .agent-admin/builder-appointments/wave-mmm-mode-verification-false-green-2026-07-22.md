# Builder Appointment — MMM Mode Verification False-Green Hotfix

- **Issue:** #1948
- **Date:** 2026-07-22
- **Builder lane:** `builder/issue-1948-mmm-verification-false-green`
- **Appointed role:** Builder
- **Scope:** Correct the MMM live verification workflow so functional failure produces a failing check and PR preview verification cannot silently use a Vercel dashboard/login origin.

## Authorised paths

- `.github/workflows/mmm-live-dashboard-diagnosis.yml`
- `scripts/mmm-live-dashboard-diagnosis/validate-preview-url.mjs`
- `scripts/mmm-live-dashboard-diagnosis/validate-preview-url.test.mjs`
- `modules/MMM/05-qa-to-red/mmm-mode-verification-false-green-qa-to-red.md`
- `.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json`

## Required outcome

1. Resolve only an MMM application preview host for PR verification.
2. Reject Vercel dashboard, inspector, login, and unrelated hosts.
3. Fail fast when the effective redirected host differs from the expected MMM preview host.
4. Treat verification exit code `1` as a failed GitHub check.
5. Preserve artifact upload and PR summary comments on failure.
6. Keep product runtime, Supabase schema, and Vercel project configuration out of scope.

## Prohibited actions

- Do not weaken required checks.
- Do not convert functional failure to success.
- Do not modify MMM descriptor runtime code.
- Do not alter Vercel project settings or secrets.
