# APW Production Target, Rollback and Activation Window Readiness v0.2

**Artifact ID**: APW-PRODUCTION-TARGET-WINDOW-READINESS-002  
**Status**: CS2 GO APPROVED — ZERO-COST PRODUCTION ACTIVATION EXECUTION IN PROGRESS  
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

The exact production MAT AI gateway is confirmed through direct Render dashboard evidence:

| Item | Confirmed evidence |
|---|---|
| Render environment | `Production` |
| Render service name | `maturion-isms` |
| Render service ID | `srv-d6i47fk50q8c73aug28g` |
| Public URL | `https://maturion-isms.onrender.com` |
| Health URL | `https://maturion-isms.onrender.com/health` |
| Health result before activation | `{"status":"ok"}` |
| Repository | `APGI-cmy/maturion-isms` |
| Branch | `main` |
| Application root | `apps/mat-ai-gateway` |
| Container source | `apps/mat-ai-gateway/Dockerfile` |
| Current deployed merge | PR #1967 / commit prefix `82246cd` |
| Deployment state before activation | `Live` |
| Auto-deploy | On commit |
| Operator access | Environment edit, manual redeploy, deployment status and logs confirmed |

## 3. Confirmed production safeguards

The following variables were installed in production and verified before activation:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

## 4. Explicit CS2 activation decision

Decision authority: Johan Ras / CS2  
Decision date: 2026-07-26

Decision:

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED
```

Decision statement:

> As CS2, I approve `GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED`. This authorises changing only `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED` to `true` on the confirmed production service `maturion-isms`, while `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED` remains `false`. No paid model calls are authorised. The service must be redeployed, health reverified, the governed public and restricted zero-token smoke tests completed, and immediate rollback performed if any stop condition occurs.

## 5. Operator execution state

The operator has changed the confirmed production service to:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

The staging MAT AI gateway was also set to `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true` while paid calls remain `false`. This does not authorise paid use and does not replace the required production evidence. Staging should be restored to its preferred idle state after the production verification window unless separately retained for a governed test.

Production redeployment, post-activation health and smoke-test evidence remain pending.

## 6. Rollback access and procedure

Immediate rollback procedure:

1. Restore production:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

2. Save and redeploy `maturion-isms`.
3. Confirm deployment status `Live`.
4. Confirm `/health` returns `{"status":"ok"}`.
5. Confirm a public APW prompt returns route `apw_integration_disabled`.
6. Inspect telemetry for route-safe metadata only and zero token usage.

## 7. Controlled production smoke-test sequence

After the production deployment returns to `Live`:

1. Confirm `/health` returns `{"status":"ok"}`.
2. Run public onboarding prompt:

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

3. Run restricted prompt:

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

4. Inspect production logs and confirm:

- no prompt or answer text;
- no private data, tokens, secrets or environment values;
- `total_tokens=0`;
- Maturion remains the final visible public-response authority.

## 8. Stop conditions

Immediately restore both production flags to `false` if:

- health degrades;
- either expected route is incorrect;
- any paid token use occurs;
- telemetry contains prompt or answer content;
- private or restricted information is exposed;
- Maturion ceases to be the final visible response authority;
- CS2 directs rollback.

## 9. Current disposition

```text
CS2_GO_RECORDED_PRODUCTION_FLAG_ENABLED_PAID_CALLS_DISABLED_REDEPLOY_HEALTH_AND_ZERO_TOKEN_PROOF_PENDING
```
