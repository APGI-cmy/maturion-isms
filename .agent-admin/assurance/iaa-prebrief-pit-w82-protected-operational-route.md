# IAA Pre-Brief — PIT W8.2 Protected Operational Route

| Field | Value |
|---|---|
| Governing issue | `#1810` |
| Reference PR | `#1813` |
| Scope | Implementation-only protected PIT operational access route |
| Status | PRE-BRIEF_COMPLETE |
| W8.2 posture | `W8.2_NOT_READY` |

## PRE-BRIEF

This pre-brief authorizes a small implementation wave to add a protected PIT operational entry route without subscription or billing fixtures.

## Authorized implementation scope

- Add `ROUTES.PIT = /pit`.
- Add `ROUTES.PIT_TRACKER = /pit/tracker`.
- Add `/pit` redirect to `/pit/tracker`.
- Add protected `/pit/tracker` shell route using the existing `ProtectedRoute`, `PitErrorBoundary`, and `PitShell` pattern.
- Preserve `/subscribe` and `/subscribe/checkout` as commercial subscription routes.

## Explicit exclusions

- No Supabase writes.
- No fake subscription state.
- No billing fixtures.
- No auth user creation.
- No W8.2 completion claim.
- No handover or merge-readiness claim in this artifact.

## Risk notes

The work touches `apps/isms-portal/**`, so ISMS Portal Vercel deployment ownership applies under `MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md`.

## Required checks before any completion language

- Foreman QP after builder implementation.
- ECAP admin validation if required.
- Pre-handover gate before any completion/readiness wording.
- IAA final assurance before CS2 review.

RESULT: PRE-BRIEF_COMPLETE
