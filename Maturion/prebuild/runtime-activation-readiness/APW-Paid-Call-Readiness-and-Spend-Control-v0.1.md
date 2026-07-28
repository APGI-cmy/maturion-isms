# APW Paid-Call Readiness and Spend Control v0.1

**Artifact ID**: APW-PAID-CALL-READINESS-001  
**Version**: 0.1.0  
**Status**: NO-GO — PAID CALLS REMAIN DISABLED  
**Authority**: CS2 — Johan Ras  
**Repository**: `APGI-cmy/maturion-isms`  
**Last Updated**: 2026-07-27

## 1. Purpose

Define the mandatory safeguards, evidence and approval boundary required before any production change to:

```text
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=true
```

This wave is governance and readiness only. It does not authorise paid calls, change Render variables, alter production infrastructure or appoint an implementation builder.

## 2. Current verified production state

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

The APW public integration is active in static zero-cost containment mode. Public and restricted production smoke tests passed with `model=none` and zero tokens.

## 3. Current readiness finding

```text
NO_GO_ENABLE_PAID_CALLS
```

The existing runtime includes useful controls:

- paid calls default off;
- restricted requests remain static and zero-token;
- model allowlist restricted to `gpt-4o-mini`;
- output-token ceiling;
- numeric token telemetry without prompt or answer content;
- a configured daily-call ceiling.

However, the current daily-call ceiling is process-local. It resets when the service restarts and is not shared across workers or replicas. The public endpoint also has no durable per-client rate limit, no shared daily spend ledger and no durable spend circuit breaker.

Therefore the existing ceiling is not sufficient as the sole production cost boundary for anonymous public traffic.

## 4. Mandatory controls before paid-call approval

### 4.1 Durable shared usage ledger

Usage and call counts must be persisted in a shared store keyed by at least:

- UTC date;
- environment;
- service;
- model;
- route class;
- anonymised client/rate-limit key where lawful and appropriate.

The control must remain effective across restarts, workers and replicas.

### 4.2 Atomic daily call and token budgets

The system must enforce atomically:

- maximum paid calls per day;
- maximum input tokens per day;
- maximum output tokens per day;
- maximum total tokens per day.

Concurrent requests must not exceed the configured limits through race conditions.

### 4.3 Per-client abuse controls

The public endpoint must enforce a bounded request rate and burst allowance. The implementation must avoid storing prompt content and must minimise personal data.

At minimum, it must prevent one anonymous source from consuming the full public budget rapidly.

### 4.4 Durable circuit breaker

The runtime must fail closed to static containment when any of the following occurs:

- shared budget exhausted;
- usage ledger unavailable;
- atomic budget check fails;
- provider errors exceed a bounded threshold;
- token telemetry is absent or malformed;
- an unapproved model is requested;
- CS2 or operator disables paid calls.

### 4.5 Provider-side budget control

The OpenAI project or organisation used by this service must have an operator-confirmed spend alert and hard or practical monthly budget boundary appropriate to the approved experiment.

Repository controls cannot substitute for provider-side financial controls.

### 4.6 Bounded observation window

Any initial paid-call activation must be time-bounded and low-volume. The first window must specify:

- start and stop time;
- maximum calls;
- maximum tokens;
- approved model;
- approved public prompts;
- named operator;
- live log and usage monitoring;
- immediate rollback procedure.

### 4.7 Cost and quality evidence

The readiness wave must capture:

- actual prompt, completion and total token counts without storing prompt or answer content;
- actual provider cost for the bounded window;
- response quality assessment;
- restricted-route zero-token proof;
- budget-exhaustion static-fallback proof;
- restart/multi-worker durability proof;
- rate-limit and concurrency proof.

## 5. QA-to-RED requirements

Before implementation, executable tests must prove the current runtime fails the future contract for intended reasons, including:

1. budget survives process restart;
2. two workers share one budget;
3. concurrent requests cannot overspend;
4. per-client rate limit is enforced;
5. shared-store outage fails closed;
6. exhausted call budget returns static containment;
7. exhausted token budget returns static containment;
8. restricted requests remain zero-token;
9. unapproved model override remains blocked;
10. telemetry excludes prompt and answer content.

The RED suite must not be made green by weakening assertions or mocking away the shared enforcement boundary.

## 6. Implementation boundary

A later implementation wave may add the minimum durable controls necessary to satisfy the approved QA contract. It must not:

- enable paid calls in production;
- change the approved model without CS2 authority;
- add private or tenant retrieval to the public endpoint;
- weaken private-request classification;
- log prompt or answer content;
- broaden unrelated AI routes;
- mutate live production data outside the approved usage-ledger scope.

## 7. Required governance sequence

1. approve this readiness contract;
2. publish IAA prebrief;
3. appoint a bounded QA builder;
4. commit executable QA-to-RED;
5. obtain independent IAA confirmation of the RED contract;
6. appoint the implementation builder;
7. build durable controls to GREEN;
8. complete Foreman QP and ECAP;
9. obtain independent final IAA;
10. approve a separate bounded production paid-call window;
11. execute live verification and rollback proof;
12. decide whether paid calls remain enabled, are adjusted or are disabled.

## 8. Current decision boundary

```text
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

This value must remain false in staging and production until a later explicit CS2 decision after the safeguards above are implemented and independently assured.

## 9. Proposed next decision

```text
AUTHORISE_APW_PAID_CALL_QA_TO_RED_READINESS_WAVE
```

This proposed decision would authorise only the prebrief, QA-builder appointment and executable RED contract. It would not authorise implementation or paid model use.
