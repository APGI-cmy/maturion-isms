# Foreman QP - PIT Stage 12 Slice 1

Issue: maturion-isms#1770

## Disposition

QP status: READY FOR PR REVIEW, subject to CI and reviewer validation.

## Scope check

The implementation is limited to Stage 8 W8.1 runtime shell and route foundation work. It does not implement full PIT business functionality and does not claim Stage 12 completion.

## Evidence checked

- Scope declaration filed.
- Builder execution confirmation filed under existing Stage 11 pit-specialist appointment.
- Runtime code added in apps/isms-portal.
- W8.1 route registry and tests added.
- Slice evidence filed under modules/pit/12-build.

## Guardrail checks

- No FUNCTIONAL_PASS claim.
- No CS2 L3 claim.
- No deployed LFV completion claim.
- No direct provider SDK import introduced by this slice.
- No placeholder expect(true).toBe(true) test introduced.
- Remaining Stage 12 closure evidence remains open.

## Required before merge

- GitHub CI gates reviewed honestly.
- Any Copilot or reviewer comments resolved or explicitly accepted as follow-up.
- Vercel/external status failures, if present, must be disclosed and not represented as passing.
