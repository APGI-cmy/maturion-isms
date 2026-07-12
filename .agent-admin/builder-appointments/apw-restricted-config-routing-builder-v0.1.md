# Builder Appointment - APW Restricted Configuration Routing v0.1

Wave ID: APW-RESTRICTED-CONFIG-ROUTING-V01
Repository: APGI-cmy/maturion-isms
Authority: CS2 - Johan Ras
Date: 2026-07-10
Status: ACTIVE FOR THIS WAVE ONLY

## Appointment

The builder is appointed to correct the public-chat classifier so sensitive configuration requests never enter the APW Specialist draft route.

## Allowed work

- Extend the existing private/restricted term classifier.
- Add focused regression tests for environment variables, credentials, API keys, tokens, passwords, secrets, and internal configuration requests.
- Preserve existing public APW, tenant-data, and flag-off routes.
- Add PR-scoped governance evidence after the PR number is assigned.

## Prohibited work

- No answer-generation changes.
- No telemetry changes.
- No environment changes.
- No database, Supabase, registry, retrieval, embedding, or agent-contract changes.
- No broad refactor of the public chat service.

## Allowed paths

- `apps/mat-ai-gateway/services/public_chat.py`
- `apps/mat-ai-gateway/tests/test_apw_preview.py`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`
- `.agent-admin/scope-declarations/`
- `.agent-admin/control/delegation-orders/`

## Handover condition

The wave may be handed over only when the focused tests and all governance gates are green and route behaviour is unchanged outside the stated classifier correction.
