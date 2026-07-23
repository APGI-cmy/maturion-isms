# Builder Appointment - APW Private-Request Classifier Hardening v0.1

Wave ID: APW-PRIVATE-REQUEST-CLASSIFIER-HARDENING-V01
Repository: APGI-cmy/maturion-isms
Authority: CS2 - Johan Ras
Date: 2026-07-21
Status: ACTIVE FOR THIS WAVE ONLY

## Appointment

The builder is appointed to remediate `APW-PRODUCTION-ACTIVATION-BLOCKER-001` by aligning and hardening private-request classification for the APW public integration.

## Allowed work

- Introduce one shared fail-closed private-request policy.
- Apply it to the public-chat route gate and APW Specialist adapter.
- Add regression tests for broad private, confidential, customer, client, account and record wording.
- Preserve public onboarding routing, configuration/token restrictions and flag-off rollback.
- Add PR-scoped scope and delegation evidence after PR creation.

## Prohibited work

- No environment or feature-flag changes.
- No Render, Vercel or Supabase changes.
- No deployment or production activation.
- No direct APW Specialist public authority.
- No unrelated refactoring.

## Handover condition

The remediation may be handed over only when all regression and governance checks are green and the blocker phrase routes to `maturion_only` at the public endpoint.
