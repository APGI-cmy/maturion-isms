# Builder Appointment - PIT Host Policy Redirect

Wave: `wave-pit-host-policy-redirect-20260626`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
CS2 Authority: Johan Ras
Appointed builder: `ui-builder`
Appointment status: `APPOINTED`

## Preconditions

IAA pre-brief is recorded in `.agent-admin/assurance/iaa-wave-record-wave-pit-host-policy-redirect-20260626.md`.

## Builder task

Implement canonical-host redirect behavior so the PIT deployment host no longer renders a duplicate ISMS public acquisition surface.

## Required behavior

- Requests on the PIT deployment host redirect to the canonical ISMS host equivalent.
- Path, query string, and hash are preserved.
- Canonical ISMS host does not redirect away from itself.
- PIT runtime remains canonical under the ISMS host.

## Allowed files

- `apps/isms-portal/src/App.tsx`
- `apps/isms-portal/src/lib/pitHostPolicy.ts`
- `apps/isms-portal/src/lib/pitHostPolicy.test.ts`

## Prohibited work

- No PIT runtime feature implementation.
- No Supabase changes.
- No billing/provider/payment changes.
- No Vercel workflow ownership changes.
- No W8.2 closure claim.

RESULT: BUILDER_APPOINTED
