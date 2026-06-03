# PIT Stage 12 Slice 1 Runtime Shell Evidence

Issue: maturion-isms#1770

## Slice status

Status: IN PROGRESS / PR READY FOR REVIEW

This slice creates the first PIT runtime foundation in the ISMS portal. It does not claim Stage 12 completion or FUNCTIONAL_PASS.

## Runtime evidence in this PR

- Added W8.1 route constants for login, signup, password recovery, invite acceptance, dashboard, projects, project creation, and onboarding.
- Added PIT W8.1 route registry with public/protected route classification.
- Added PIT shell placeholder with five-state-ready runtime container.
- Added PIT runtime error boundary to avoid white-screen failures.
- Wired public auth/invite route foundations.
- Wired protected PIT dashboard/projects/project creation/onboarding foundations through ProtectedRoute.
- Preserved intended destination when unauthenticated users hit protected routes.
- Added route registry tests for W8.1 counts, paths, protected boundary, and no direct provider route expansion.

## Tests

Expected local command: pnpm --filter isms-portal test:run

CI status must be checked on the PR. This evidence file does not claim tests are green until CI or local output confirms it.

## Known gaps carried forward

- No deployed LFV evidence yet.
- No CS2 L3 live verification yet.
- No business-domain data/RLS/evidence/report/notification/audit/timeline functionality yet.
- No FUNCTIONAL_PASS claim.

## RED baseline note

The 147-test baseline remains binding. This slice only begins W8.1 coverage and does not retire the remaining Stage 12 RED obligations.
