# APW AI Cost Containment and Model Routing Remediation v0.1

**Artifact ID**: APW-AI-COST-CONTAINMENT-001  
**Version**: 0.1.0  
**Status**: IMPLEMENTED — REVIEW PENDING  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-23

## 1. Purpose

This remediation freezes uncontrolled public-chat model consumption and aligns the APW/Maturion public runtime with the Maturion Cost Optimization Policy.

Production activation remains paused.

## 2. Root cause addressed

The public-chat endpoint previously called OpenAI for every accepted request, including when the APW Specialist integration flag was disabled. The runtime also lacked:

- a paid-call kill switch;
- a strict low-cost model allowlist;
- a daily paid-call ceiling;
- actual token-usage telemetry;
- regression tests proving zero paid calls on containment paths.

## 3. Implemented controls

### 3.1 Default-off paid calls

Paid public-chat model calls now require:

```text
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=true
```

If absent or false, the runtime returns a bounded static Maturion answer and performs no paid model call.

### 3.2 Zero-call containment paths

The runtime performs no paid model call when:

- `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false`;
- the request routes to `maturion_only`;
- paid calls are disabled;
- the daily paid-call ceiling has been reached.

### 3.3 Low-cost model allowlist

The only approved public-chat model in this wave is:

```text
gpt-4o-mini
```

`MATURION_PUBLIC_CHAT_MODEL` may be set only to an approved allowlisted value. Any unapproved value falls back to `gpt-4o-mini`.

### 3.4 Token and request ceilings

Optional environment controls:

```text
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=100
```

The output ceiling is clamped to a maximum of 500 tokens. The daily call counter is process-local and therefore a first containment layer, not a final distributed quota system.

### 3.5 Safe usage telemetry

The runtime logs only:

- route;
- page;
- history count;
- response mode;
- containment reason;
- model identifier or `none`;
- prompt, completion and total token counts.

It does not log prompt or answer content.

## 4. Render service configuration

The variables in this remediation belong on the Render service running:

```text
apps/mat-ai-gateway
```

For the currently confirmed staging environment, this is:

```text
maturion-mat-ai-gateway-staging
https://maturion-mat-ai-gateway-staging.onrender.com
```

Recommended staging values after this PR is merged and deployed:

```text
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

Do not add these variables to `maturion-kuc-staging`.

Do not enable paid calls during this remediation review.

## 5. GitHub Models strategy

The repository already contains a GitHub Models adapter and AIMC advisory routing that prefers `github-models` before OpenAI. However, the public MAT AI gateway is a separate Python runtime and does not yet use that adapter.

This wave therefore contains the immediate cost leak first. A subsequent provider-routing wave should:

1. expose a provider-neutral public-chat interface;
2. prefer GitHub Models for approved T1 advisory work;
3. use OpenAI only as an explicitly governed fallback;
4. log provider, model, token usage and estimated cost;
5. prohibit silent fallback when budget ceilings are reached.

## 6. Regression evidence required

The PR must prove:

- flag-off requests make zero paid model calls;
- restricted requests make zero paid model calls;
- paid calls are default-off;
- a zero daily limit blocks paid calls;
- unapproved model IDs fall back to `gpt-4o-mini`;
- telemetry omits prompt and answer content;
- existing APW route safety remains intact.

## 7. Current disposition

```text
COST_CONTAINMENT_IMPLEMENTED_PRODUCTION_ACTIVATION_PAUSED_REVIEW_REQUIRED
```
