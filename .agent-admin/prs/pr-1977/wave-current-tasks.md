# PR #1977 Wave Current Tasks

PR: #1977
WAVE: APW-DURABLE-PAID-CALL-RUNTIME-IMPLEMENTATION-V01
STATUS: CS2_AUTHORISED — IAA_PREFLIGHT_PREPARATION
CS2_AUTHORITY: Johan Ras
CS2_DECISION: AUTHORISE_APW_DURABLE_PAID_CALL_RUNTIME_IMPLEMENTATION_WAVE
DATE: 2026-07-28

## Authorised sequence

1. Commit this PR-scoped task set.
2. Commit the canonical independent IAA pre-flight brief.
3. Appoint the bounded runtime builder only after the prebrief exists.
4. Implement the durable usage authority, atomic reservations, privacy-safe client limiter, shared circuit breaker, provider-failure reconciliation and safe telemetry in later commits.
5. Add migration and deployment artefacts without applying them to any live environment.
6. Build APW-RED-PAID-001..016 to GREEN.
7. Preserve all existing public-chat regression tests and zero-cost containment behaviour.
8. Complete Foreman QP and ECAP evidence.
9. Freeze the implementation head and obtain independent final IAA.
10. Return to CS2 before deployment, infrastructure mutation or paid-call activation.

## Active tasks

- [x] Record explicit CS2 authorisation.
- [x] Confirm PR #1976 merged with final IAA PASS.
- [x] Confirm production remains in zero-cost containment mode.
- [x] Confirm `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` remains mandatory.
- [ ] Commit canonical independent IAA prebrief.
- [ ] Appoint bounded runtime builder.
- [ ] Implement shared persistent usage authority and atomic reservation flow.
- [ ] Implement privacy-safe per-client limiter and shared fail-closed circuit breaker.
- [ ] Implement provider-failure reconciliation and route-safe telemetry.
- [ ] Add unapplied database migration and operator configuration contract.
- [ ] Build APW-RED-PAID-001..016 to GREEN.
- [ ] Run the full existing gateway regression suite.
- [ ] Complete QP and ECAP.
- [ ] Obtain independent final IAA.

## Runtime delivery requirements

- one shared durable budget authority across restarts, workers and replicas;
- atomic call and token reservation before provider invocation;
- durable daily call and token ceilings;
- privacy-safe anonymous-client rate limiting using non-reversible keyed hashes;
- shared fail-closed circuit breaker;
- provider-failure reservation reconciliation;
- safe containment reasons for call, token, client and circuit limits;
- telemetry limited to non-sensitive budget metadata;
- provider-budget evidence and bounded observation-window gates;
- no raw prompt, answer, IP address, credential, secret, token or environment value in logs.

## Strict boundary

This wave authorises repository implementation only. It does not authorise applying a migration, changing Supabase, Render, Vercel or OpenAI configuration, deploying any branch, enabling paid calls, accessing private or tenant data, broadening the model allowlist or changing Maturion final public-response authority.

The required live state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```
