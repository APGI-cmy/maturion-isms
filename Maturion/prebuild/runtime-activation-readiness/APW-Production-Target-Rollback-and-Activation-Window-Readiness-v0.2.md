# APW Production Target, Rollback and Activation Window Readiness v0.2

**Artifact ID**: APW-PRODUCTION-TARGET-WINDOW-READINESS-002  
**Version**: 0.2.0  
**Status**: ZERO-COST APW PRODUCTION ACTIVATION VERIFIED  
**Authority**: CS2 — Johan Ras  
**Repository**: `APGI-cmy/maturion-isms`  
**Last Updated**: 2026-07-27

## 1. Current governed baseline

The following controls are merged through PR #1967:

- paid public-chat calls are default-off;
- flag-off and restricted requests make zero paid model calls;
- only `gpt-4o-mini` is allowlisted;
- output and daily paid-call ceilings are enforced;
- safe numeric token telemetry excludes prompt and answer content.

## 2. Confirmed production target

| Item | Confirmed evidence |
|---|---|
| Render environment | `Production` |
| Render service name | `maturion-isms` |
| Render service ID | `srv-d6i47fk50q8c73aug28g` |
| Public URL | `https://maturion-isms.onrender.com` |
| Health URL | `https://maturion-isms.onrender.com/health` |
| Repository | `APGI-cmy/maturion-isms` |
| Branch | `main` |
| Application root | `apps/mat-ai-gateway` |
| Container source | `apps/mat-ai-gateway/Dockerfile` |
| Deployed merge | PR #1967 / commit prefix `82246cd` |
| Deployment state | `Live` |
| Operator access | Environment edit, manual redeploy, deployment status and logs confirmed |

## 3. Explicit CS2 activation decision

Decision authority: Johan Ras / CS2  
Decision date: 2026-07-26

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED
```

Authorised production state:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

No paid model use is authorised.

## 4. Production execution evidence

The operator changed only the APW integration flag to `true`, kept paid calls `false`, saved the production configuration and redeployed `maturion-isms`.

| Check | Result | Evidence |
|---|---|---|
| Production deployment returned to `Live` | PASS | Operator-confirmed Render deployment |
| Production health | PASS | `https://maturion-isms.onrender.com/health` returned `{"status":"ok"}` |
| Paid calls remain disabled | PASS | `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` |

## 5. Production zero-token smoke tests

### Test 1 — public APW onboarding

```text
apw_specialist_route=apw_specialist_internal_draft_candidate
response_mode=static_containment
containment_reason=paid_calls_disabled
model=none
prompt_tokens=0
completion_tokens=0
total_tokens=0
```

Result:

```text
PASS_PUBLIC_ROUTE_STATIC_CONTAINMENT_ZERO_TOKENS
```

### Test 2 — restricted private information

```text
apw_specialist_route=maturion_only
response_mode=static_containment
containment_reason=restricted_request_static_response
model=none
prompt_tokens=0
completion_tokens=0
total_tokens=0
```

Result:

```text
PASS_RESTRICTED_ROUTE_STATIC_CONTAINMENT_ZERO_TOKENS
```

## 6. Production telemetry proof

The production Render logs showed the following route-safe metadata:

```text
public_chat_route route=apw_specialist_internal_draft_candidate page=/apw history_count=0 response_mode=static_containment containment_reason=paid_calls_disabled model=none prompt_tokens=0 completion_tokens=0 total_tokens=0
```

```text
public_chat_route route=maturion_only page=/apw history_count=0 response_mode=static_containment containment_reason=restricted_request_static_response model=none prompt_tokens=0 completion_tokens=0 total_tokens=0
```

Telemetry inspection result:

```text
PASS_PRODUCTION_ROUTE_SAFE_METADATA_ONLY_ZERO_TOKENS
```

Confirmed absent:

- prompt or question text;
- answer text;
- private or tenant data;
- credentials, tokens or secrets;
- environment-variable names or values.

## 7. Current production state

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

This is an active, zero-cost public integration state. The APW route is available, but paid model use remains prohibited.

## 8. Rollback procedure

Immediately restore production to:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

Then save, redeploy, confirm `Live`, confirm health, and prove route `apw_integration_disabled` if any stop condition occurs.

## 9. Stop conditions

Immediate rollback is mandatory if any of the following occurs:

- the production health endpoint degrades or stops returning `{"status":"ok"}`;
- a public onboarding request does not return `apw_specialist_internal_draft_candidate` in static containment;
- a private or restricted request does not return `maturion_only` in static containment;
- `model` is anything other than `none` while paid calls remain disabled;
- `prompt_tokens`, `completion_tokens` or `total_tokens` is non-zero;
- telemetry contains prompt text, answer text, private data, credentials, tokens, secrets or environment values;
- private, client, customer, account, record, credential, token, secret or internal-configuration information is exposed;
- Maturion ceases to be the final visible public-response authority;
- an unapproved data source or retrieval path is used;
- CS2 directs rollback.

## 10. Remaining boundary

Changing `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED` to `true` requires a separate governed wave, explicit CS2 approval, bounded budget, call ceiling, observation window and rollback plan.

## 11. Final disposition

```text
ZERO_COST_APW_PRODUCTION_ACTIVATION_VERIFIED_PAID_CALLS_REMAIN_PROHIBITED
```
