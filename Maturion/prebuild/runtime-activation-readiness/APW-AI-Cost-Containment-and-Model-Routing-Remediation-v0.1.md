# APW AI Cost Containment and Model Routing Remediation v0.1

**Artifact ID**: APW-AI-COST-CONTAINMENT-001  
**Version**: 0.1.0  
**Status**: IMPLEMENTED — FINAL REVIEW PENDING  
**Authority**: CS2 — Johan Ras  
**PR**: #1967  
**Date**: 2026-07-26

## 1. Purpose

This remediation freezes uncontrolled public-chat model consumption and aligns the APW/Maturion public runtime with the Maturion Cost Optimization Policy. Production activation remains paused.

## 2. Root cause addressed

The public-chat endpoint previously called OpenAI for every accepted request, including when the APW Specialist integration flag was disabled. The runtime lacked a paid-call kill switch, strict low-cost model allowlist, daily paid-call ceiling, actual token-usage telemetry, and regression tests proving zero paid calls on containment paths.

## 3. Implemented controls

### Default-off paid calls

Paid model calls require:

```text
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=true
```

When absent or false, the runtime returns a bounded static Maturion answer and performs no paid model call.

### Zero-call containment paths

No paid model call occurs when:

- `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false`;
- the request routes to `maturion_only`;
- paid calls are disabled;
- the daily paid-call ceiling has been reached.

### Low-cost model allowlist

The only approved public-chat model in this wave is:

```text
gpt-4o-mini
```

Unapproved values fall back to `gpt-4o-mini`.

### Token and request ceilings

```text
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

The output value is clamped to 1–500 tokens. The daily counter is process-local and is explicitly recorded as a first containment layer, not a distributed billing quota.

### Safe telemetry

The runtime logs route, page, history count, response mode, containment reason, model identifier and numeric token usage. It does not log prompt or answer content.

## 4. Confirmed staging configuration

The variables belong on:

```text
maturion-mat-ai-gateway-staging
https://maturion-mat-ai-gateway-staging.onrender.com
```

Confirmed operator values:

```text
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

Do not add them to `maturion-kuc-staging`. Paid calls remain disabled.

## 5. Regression contract

The PR proves:

- flag-off requests make zero paid model calls;
- restricted requests make zero paid model calls;
- paid calls are default-off;
- a zero daily limit blocks paid calls;
- unapproved model IDs fall back to `gpt-4o-mini`;
- telemetry omits prompt and answer content;
- existing public APW and private-request routing remain intact.

## 6. GitHub Models follow-up

The repository already has a GitHub Models adapter for parts of AIMC, but this Python public gateway does not yet use that adapter. A separate governed provider-neutral routing wave should evaluate GitHub Models-first routing for suitable T1 public advisory work without weakening the controls in this remediation.

## 7. Boundary

This PR does not activate production, enable paid calls, mutate Render/Vercel/Supabase, add data sources or change Maturion final-response authority.

## 8. Current disposition

```text
COST_CONTAINMENT_IMPLEMENTED_PAID_CALLS_DISABLED_PRODUCTION_ACTIVATION_PAUSED
```
