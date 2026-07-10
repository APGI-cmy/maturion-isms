# Builder Appointment - APW Public Chat Route Telemetry v0.1

Wave ID: APW-PUBLIC-CHAT-ROUTE-TELEMETRY-V01
Repository: APGI-cmy/maturion-isms
Authority: CS2 - Johan Ras
Date: 2026-07-10
Status: ACTIVE FOR THIS WAVE ONLY

## Appointment

The builder is appointed to add safe public-chat route telemetry required for controlled-preview evidence capture.

## Allowed work

- Add one successful-response telemetry log line to the public chat route.
- Log only route, page, and history count.
- Add regression coverage proving telemetry is emitted.
- Add regression guards proving prompt and answer text are not logged.
- Add PR-scoped governance evidence after the replacement PR number is assigned.

## Prohibited work

- No routing decision changes.
- No prompt-handling changes.
- No answer-generation changes.
- No environment-variable changes.
- No database, Supabase, registry, retrieval, embedding, or agent-contract changes.
- No logging of prompts, answers, headers, cookies, tokens, credentials, IP addresses, tenant data, customer data, or user identity.

## Allowed paths

- `apps/mat-ai-gateway/routers/ai_routes.py`
- `apps/mat-ai-gateway/tests/test_public_chat.py`
- `.agent-admin/assurance/`
- `.agent-admin/builder-appointments/`
- `.agent-admin/scope-declarations/`
- `.agent-admin/control/delegation-orders/`

## Handover condition

The wave may be handed over only when tests and governance gates are green and the safe telemetry boundary is verified.
