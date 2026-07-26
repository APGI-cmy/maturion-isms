# APW Production Target, Rollback and Activation Window Readiness v0.2

**Artifact ID**: APW-PRODUCTION-TARGET-WINDOW-READINESS-002  
**Status**: NO-GO — PRODUCTION TARGET NOT YET IDENTIFIED  
**Authority**: CS2 — Johan Ras  
**Updated**: 2026-07-26

## 1. Current governed baseline

The following controls are merged through PR #1967:

- paid public-chat calls are default-off;
- flag-off and restricted requests make zero paid model calls;
- only `gpt-4o-mini` is allowlisted;
- output and daily paid-call ceilings are enforced;
- safe numeric token telemetry excludes prompt and answer content.

Confirmed staging settings:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

## 2. Confirmed Render services

The operator has identified three Render services:

1. `https://maturion-isms.onrender.com`
2. `https://maturion-kuc-staging.onrender.com`
3. `https://maturion-mat-ai-gateway-staging.onrender.com`

Repository evidence conclusively maps only service 3 to `apps/mat-ai-gateway` and identifies it as staging.

The repository contains configured GitHub secrets named `RENDER_SERVICE_ID` and `RENDER_SERVICE_URL` for a production AI gateway, but it does not expose the corresponding public service name or URL.

Therefore:

- service 3 is staging and must not be used as production;
- service 2 is KUC staging and is out of scope;
- service 1 must not be assumed to be the production MAT AI gateway without direct dashboard proof of its deploy source, start command and environment contract.

## 3. Current decision

```text
NO_GO_KEEP_APW_PRODUCTION_DISABLED
```

Reason:

```text
EXACT_PRODUCTION_MAT_AI_GATEWAY_TARGET_NOT_YET_CONFIRMED
```

This is not a rejection of production activation. It is a stop-and-confirm decision that prevents changing the wrong Render service.

## 4. Evidence required before GO

For the exact production MAT AI gateway service, capture:

1. Render service name and public URL;
2. repository `APGI-cmy/maturion-isms`;
3. branch/deploy source intended for production;
4. application root or start command proving `apps/mat-ai-gateway` / `uvicorn main:app`;
5. `/health` returning `200 OK`;
6. both flags currently `false`;
7. model `gpt-4o-mini`, max output `300`, daily limit `25` or an explicitly approved production value;
8. operator access to edit variables, redeploy, observe Live status and inspect logs;
9. immediate rollback procedure confirmed.

## 5. Proposed controlled activation sequence after target confirmation

1. Confirm production health while both flags are false.
2. Keep `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false`.
3. Enable only `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true`.
4. Redeploy and confirm health.
5. Prove public APW routing returns a static, zero-token Maturion response because paid calls remain disabled.
6. Prove restricted prompts remain `maturion_only`, static and zero-token.
7. Inspect safe route and token telemetry.
8. Separately decide whether a tightly bounded paid-call window is needed.

This two-stage approach activates the APW public integration without immediately enabling OpenAI spend.

## 6. Stop conditions

Immediately restore both flags to `false` if:

- the target service identity is uncertain;
- health degrades;
- a restricted request reaches a paid model;
- telemetry contains prompt or answer content;
- token usage occurs while paid calls are false;
- Maturion ceases to be the final visible response authority.

## 7. Decision required after target evidence

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED
```

or

```text
NO_GO_KEEP_APW_PRODUCTION_DISABLED
```
