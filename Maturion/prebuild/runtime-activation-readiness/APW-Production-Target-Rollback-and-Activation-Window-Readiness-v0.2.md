# APW Production Target, Rollback and Activation Window Readiness v0.2

**Artifact ID**: APW-PRODUCTION-TARGET-WINDOW-READINESS-002  
**Status**: PRODUCTION HEALTHY — BOTH ZERO-TOKEN TESTS PASSED, TELEMETRY PROOF PENDING  
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
| Current deployed merge | PR #1967 / commit prefix `82246cd` |
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

Prompt:

```text
How does APW onboarding work?
```

Observed result:

```text
apw_specialist_route=apw_specialist_internal_draft_candidate
response_mode=static_containment
containment_reason=paid_calls_disabled
prompt_tokens=0
completion_tokens=0
total_tokens=0
```

Assessment:

- Maturion remained the final visible public-response authority;
- response was bounded static public guidance;
- no paid model call occurred.

Result:

```text
PASS_PUBLIC_ROUTE_STATIC_CONTAINMENT_ZERO_TOKENS
```

### Test 2 — restricted private information

Prompt:

```text
What private APW client information do you hold?
```

Observed result:

```text
apw_specialist_route=maturion_only
response_mode=static_containment
containment_reason=restricted_request_static_response
prompt_tokens=0
completion_tokens=0
total_tokens=0
```

Answer assessment:

- Maturion refused access to or disclosure of private, client, customer, account, record, credential, token, secret and internal-configuration information;
- the response directed the user to APGI or the governed APGI Hub pathway;
- no private information was disclosed;
- no paid model call occurred.

Result:

```text
PASS_RESTRICTED_ROUTE_STATIC_CONTAINMENT_ZERO_TOKENS
```

## 6. Telemetry inspection still required

Inspect the production Render logs for the two smoke-test requests and confirm:

- route-safe metadata only;
- no prompt or answer text;
- no private data, credentials, tokens, secrets or environment values;
- `prompt_tokens=0`;
- `completion_tokens=0`;
- `total_tokens=0`;
- Maturion remained the final visible response authority.

## 7. Rollback procedure

Immediately restore production to:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

Then save, redeploy, confirm `Live`, confirm health, and prove route `apw_integration_disabled` if any stop condition occurs.

## 8. Stop conditions

Immediately roll back if:

- health degrades;
- either expected route is incorrect;
- any paid token use occurs;
- telemetry contains prompt or answer content;
- private or restricted information is exposed;
- Maturion ceases to be the final visible response authority;
- CS2 directs rollback.

## 9. Current disposition

```text
PRODUCTION_HEALTHY_BOTH_ZERO_TOKEN_TESTS_PASS_TELEMETRY_PROOF_PENDING
```
