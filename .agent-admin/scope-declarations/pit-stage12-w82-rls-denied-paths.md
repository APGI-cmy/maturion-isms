# PIT Stage 12 W8.2 Scope Declaration

SCOPE_SCHEMA_VERSION: 1
PR_NUMBER: TBD
ISSUE: 1774
BRANCH: pit-stage12-w82-rls-denied-paths
OWNER: APGI-cmy
DATE_UTC: 2026-06-04

## Authority

- W8.2 issue: #1774
- Stage 12 authorization: #1767
- Stage 12 kickoff: #1768
- W8.1 hydrated smoke evidence: #1780
- Appointed builder: pit-specialist
- Build Authorization: CLEARED by CS2
- Binding RED baseline: 147 tests

## IN_SCOPE

- Add W8.2 admin route constants.
- Wire protected admin shell routes for `/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log`, and `/qa-dashboard`.
- Add a local W8.2 access decision helper for tenant and role boundaries.
- Add tests for unauthenticated, cross-org denied, role denied, and allowed decisions.
- File W8.2 foundation evidence.

## OUT_OF_SCOPE

- Full W8.2 completion.
- Supabase policy migration execution.
- Live identity role matrix execution.
- W8.3 project hierarchy.
- W8.5 evidence workflow.
- W8.6 timeline engine.
- Stage 12 completion.
- FUNCTIONAL_PASS.

## FILES_CHANGED

- apps/isms-portal/src/lib/routes.ts
- apps/isms-portal/src/lib/pitAccess.ts
- apps/isms-portal/src/lib/pitAccess.test.ts
- apps/isms-portal/src/App.tsx
- modules/pit/12-build/w82-rls-denied-path-evidence.md

## Exit posture

This PR starts W8.2 with a narrow implementation foundation. It may be accepted as a W8.2 foundation slice only if CI passes and review confirms no overclaim.
