# PIT Stage 12 W8.1 Deployed LFV Evidence

Issue: maturion-isms#1775
Branch: pit-w81-deploy-evidence

## Purpose

Close the remaining W8.1 deployed-evidence gap after PR #1777.

## Routes requiring deployed direct-load and refresh evidence

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/invite/:token`
- `/dashboard`
- `/projects`
- `/projects/new`
- `/onboarding`

## Harness

`apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs`

Run command:

```text
PIT_W81_BASE_URL=<deployed-preview-or-live-url> node apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs
```

## Evidence status

| Evidence item | Status | Notes |
|---|---|---|
| Direct-load checks | PENDING_RUNTIME_CAPTURE | Requires deployed preview/live URL execution. |
| Refresh checks | PENDING_RUNTIME_CAPTURE | Browser refresh evidence must be captured manually or by browser automation. |
| Deep-link screenshots | PENDING_RUNTIME_CAPTURE | Attach screenshots or file paths after capture. |
| Auth redirect HAR/equivalent | PENDING_RUNTIME_CAPTURE | Capture protected route access and redirect to `/login` with intended destination state. |
| Shell-state screenshots | PENDING_RUNTIME_CAPTURE | Capture data/empty/loading/permission-denied/network-error states where available. |
| Route coverage ledger | FILED | `modules/pit/12-build/w81-route-coverage-ledger.md` |
| Auth journey pass matrix | FILED | `modules/pit/12-build/w81-auth-journey-pass-matrix.md` |

## Current finding

This PR adds the repeatable deployed-smoke harness and the W8.1 deployed-evidence ledger. It does not claim the runtime captures are complete unless the harness output and screenshots/HARs are attached during review.

## W8.1 exit posture

W8.1 may be declared fully exited only after the PENDING_RUNTIME_CAPTURE rows above are replaced with PASS evidence from a deployed preview/live environment.
