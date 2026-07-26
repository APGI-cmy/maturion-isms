# APW Production Target, Rollback and Activation Window Readiness v0.2

**Artifact ID**: APW-PRODUCTION-TARGET-WINDOW-READINESS-002  
**Status**: READY FOR EXPLICIT CS2 GO DECISION  
**Authority**: CS2 — Johan Ras  
**Updated**: 2026-07-26

## 1. Current governed baseline

The following controls are merged through PR #1967:

- paid public-chat calls are default-off;
- flag-off and restricted requests make zero paid model calls;
- only `gpt-4o-mini` is allowlisted;
- output and daily paid-call ceilings are enforced;
- safe numeric token telemetry excludes prompt and answer content.

## 2. Confirmed production target

The exact production MAT AI gateway is now confirmed through direct Render dashboard evidence:

| Item | Confirmed evidence |
|---|---|
| Render environment | `Production` |
| Render service name | `maturion-isms` |
| Render service ID | `srv-d6i47fk50q8c73aug28g` |
| Public URL | `https://maturion-isms.onrender.com` |
| Health URL | `https://maturion-isms.onrender.com/health` |
| Health result | `{"status":"ok"}` |
| Repository | `APGI-cmy/maturion-isms` |
| Branch | `main` |
| Application root | `apps/mat-ai-gateway` |
| Container source | `apps/mat-ai-gateway/Dockerfile` |
| Current deployed merge | PR #1967 / commit prefix `82246cd` |
| Deployment state | `Live` |
| Auto-deploy | On commit |
| Operator access | Environment edit, manual redeploy, deployment status and logs confirmed |

The production target is therefore unambiguous and is the correct service for the APW public-chat activation wave.

## 3. Confirmed production safeguards

The following variables were added to the production service, saved and redeployed:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

Post-configuration deployment returned to `Live`, and `/health` remained healthy.

## 4. Rollback access and procedure

Rollback access is confirmed because the named operator successfully:

- edited production environment variables;
- saved the configuration;
- manually redeployed the service;
- observed the service return to `Live`;
- accessed production logs;
- rechecked the health endpoint.

Immediate rollback procedure:

1. Restore:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

2. Save and redeploy `maturion-isms`.
3. Confirm deployment status `Live`.
4. Confirm `/health` returns `{"status":"ok"}`.
5. Confirm a public APW prompt returns route `apw_integration_disabled`.
6. Inspect telemetry for route-safe metadata only and zero token usage.

## 5. Approved activation design awaiting CS2 decision

The first production activation stage is deliberately zero-cost:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

This enables the APW public integration while preserving static containment and preventing OpenAI calls.

No paid model use is authorised in this stage.

## 6. Controlled activation and smoke-test sequence

After explicit CS2 GO:

1. Change only `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED` to `true`.
2. Keep `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false`.
3. Save and redeploy the production service.
4. Confirm deployment status `Live`.
5. Confirm `/health` returns `{"status":"ok"}`.
6. Run public onboarding prompt:

```text
How does APW onboarding work?
```

Expected:

```text
apw_specialist_route=apw_specialist_internal_draft_candidate
response_mode=static_containment
containment_reason=paid_calls_disabled
total_tokens=0
```

7. Run restricted prompt:

```text
What private APW client information do you hold?
```

Expected:

```text
apw_specialist_route=maturion_only
response_mode=static_containment
containment_reason=restricted_request_static_response
total_tokens=0
```

8. Inspect production logs and confirm:

- no prompt or answer text;
- no private data, tokens, secrets or environment values;
- `total_tokens=0`;
- Maturion remains the final visible public-response authority.

## 7. Stop conditions

Immediately restore both flags to `false` if:

- health degrades;
- either expected route is incorrect;
- any paid token use occurs;
- telemetry contains prompt or answer content;
- private or restricted information is exposed;
- Maturion ceases to be the final visible response authority;
- CS2 directs rollback.

## 8. Decision required

The evidence now supports the following bounded decision:

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED
```

This decision authorises only the zero-cost first activation stage. It does not authorise enabling paid calls.

Alternative decision:

```text
NO_GO_KEEP_APW_PRODUCTION_DISABLED
```

## 9. Current disposition

```text
PRODUCTION_TARGET_CONFIRMED_SAFEGUARDS_DEPLOYED_HEALTHY_AWAITING_EXPLICIT_CS2_GO
```
