# ISMS P1.3 Real Preview Deploy Verification

Date: 2026-06-16
Evidence PR: pending
Verification PR: #1819
Verification PR merge commit: `52606466798c5bf39509ae6c0fad136dff1d21f6`
Governing issue: #1817
Gate model: PR #1800 transition model; this artifact records implementation/deployment evidence and does not assert handover posture.

## Scope

P1.3 records the first ISMS-specific real Vercel preview deployment verification after app-specific ISMS Vercel secrets were configured.

This evidence slice records the proof from PR #1819. It does not change application behavior, routes, runtime persistence, auth/payment, live AI provider integration, production deployment configuration, MMM workflow ownership, or PIT workflow ownership.

## Preconditions

Owner configured the ISMS app-specific Vercel secrets before PR #1819 was verified:

- `ISMS_VERCEL_ORG_ID`
- `ISMS_VERCEL_PROJECT_ID`
- `ISMS_VERCEL_TOKEN`
- `ISMS_VERCEL_AUTOMATION_BYPASS_SECRET`

## Verification PR

PR #1819: `Verify ISMS real Vercel preview deploy`

Merged on 2026-06-16 with merge commit:

- `52606466798c5bf39509ae6c0fad136dff1d21f6`

The PR intentionally touched the ISMS app path to trigger the ISMS-only Vercel workflow without changing runtime feature behavior.

## Preview evidence

Vercel GitHub integration reported the ISMS portal preview as `Ready`.

Preview URL:

- `https://maturion-isms-portal-git-foreman-ism-d5f042-rassie-ras-projects.vercel.app`

Vercel project:

- `maturion-isms-portal`

## GitHub Actions evidence

Workflow:

- `Deploy ISMS Portal to Vercel`

Verified path:

- `ISMS Workflow Boundary Guard` passed.
- `Build ISMS Portal` passed.
- `Deploy ISMS Preview` detected the configured ISMS secrets.
- `Deploy ISMS Preview` performed a real Vercel deploy rather than the previous missing-secret skip path.
- `ISMS SPA smoke test` passed.
- `Comment ISMS preview URL on PR` passed.
- `Deploy ISMS Production` was skipped, as expected for a pull request event.

The latest PR-head workflow run before merge also showed the following checks passing:

- `Deploy ISMS Portal to Vercel`
- `Preflight Evidence Gate`
- `CodeQL`
- `Routing Governance Check`
- `Stub Detection Check`
- `POLC Boundary Validation`
- `Actions Deprecation Gate`
- `Foreman Pre-Handover Lane Gate`
- `Builder Delegation Order Gate`
- `Merge Gate Required Checks Alignment`
- `ECAP Admin Boundary Gate`
- `Wave 7 Governance Validation`

## Smoke-test caveat

Vercel preview protection returned protected-preview posture for smoke access. The workflow was updated during PR #1819 to treat HTTP `401`/`403` as Vercel preview protection posture rather than SPA routing failure.

Hard failures remain:

- HTTP `404` route misses;
- HTTP `5xx` runtime/server failures;
- unexpected non-2xx/3xx, non-401/403 statuses.

This means P1.3 proves that the ISMS Vercel deploy path performs a real preview deployment and that the workflow can distinguish protected-preview access posture from route/runtime failure. It does not prove public unauthenticated access to protected Vercel preview URLs.

## Monorepo caveat

Vercel's GitHub integration still reported PIT preview activity on PR #1819, even though the ISMS-owned GitHub Actions workflow is path-scoped to ISMS.

Related coordination issues remain active:

- #1815 — MMM workflow split coordination
- #1816 — PIT workflow split coordination

This evidence should not be interpreted as MMM or PIT workflow ownership resolution.

## Out of scope

The following remain future-gated or separately appointed work:

- production auth/payment hardening;
- live AI provider integration;
- runtime Supabase persistence hooks;
- production audit writer invocation;
- MMM workflow split implementation;
- PIT workflow split implementation;
- bundle-size review;
- canonical App Description path mismatch cleanup.

## Result

P1.3 evidence records that ISMS app-specific Vercel secrets enabled a real PR preview deploy path and smoke-test run for the ISMS portal.

This is an implementation/deployment evidence record under the PR #1800 transition model. Handover/completion/merge-readiness posture is not asserted by this artifact.
