# APW Production Activation Progress Tracker v0.2

**Artifact ID**: APW-PRODUCTION-ACTIVATION-TRACKER-002  
**Version**: 0.2.1  
**Status**: APW ZERO-COST PRODUCTION ACTIVE — PAID-CALL READINESS WAVE OPEN  
**Authority**: CS2 — Johan Ras  
**Repository**: `APGI-cmy/maturion-isms`  
**Last Updated**: 2026-07-27

## Current state

- PR #1951 merged: staging verification and rollback evidence ratified.
- PR #1967 merged: AI cost containment and model restrictions ratified.
- PR #1971 merged at `8e81cbb656cb8e06e2455bc202136c04ce953fbb`: zero-cost production activation evidence ratified.
- Production target is `maturion-isms`, running `apps/mat-ai-gateway` from `main`.
- Production deployment is `Live` and `/health` returns `{"status":"ok"}`.
- Verified production state:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

- Public and restricted production smoke tests returned static containment with `model=none` and zero tokens.
- Production telemetry contained route-safe metadata only and no prompt or answer content, private data, credentials, tokens, secrets or environment values.

## Progress

| Step | Status | Evidence |
|---:|---|---|
| 1 | COMPLETE | APW controlled-preview and routing foundations merged |
| 2 | COMPLETE | Private-request classifier hardening merged in PR #1942 |
| 3 | COMPLETE | Staging verification and rollback proof merged in PR #1951 |
| 4 | COMPLETE | Cost containment and low-cost model enforcement merged in PR #1967 |
| 5 | COMPLETE | Production target identified as `maturion-isms` |
| 6 | COMPLETE | Production health and rollback access confirmed |
| 7 | COMPLETE | Production safeguards installed |
| 8 | COMPLETE | Explicit CS2 zero-cost activation decision recorded |
| 9 | COMPLETE | APW integration enabled while paid calls remained disabled |
| 10 | COMPLETE | Public route zero-token smoke test passed |
| 11 | COMPLETE | Restricted route zero-token smoke test passed |
| 12 | COMPLETE | Production route-safe telemetry and zero-token proof captured |
| 13 | COMPLETE | PR #1971 reviewed and merged |
| 14 | IN PROGRESS | Paid-call readiness and spend-control contract |
| 15 | BLOCKED | QA-to-RED appointment and executable contract pending CS2 authority |
| 16 | BLOCKED | Durable spend-control implementation |
| 17 | BLOCKED | Any bounded production paid-call window |

## Verified production outcome

### Public APW route

```text
route=apw_specialist_internal_draft_candidate
response_mode=static_containment
containment_reason=paid_calls_disabled
model=none
total_tokens=0
```

### Restricted route

```text
route=maturion_only
response_mode=static_containment
containment_reason=restricted_request_static_response
model=none
total_tokens=0
```

## Paid-call readiness finding

The existing daily-call ceiling is process-local. It resets on restart and is not shared across workers or replicas. The anonymous public endpoint also lacks a durable per-client rate limit, shared token budget and shared circuit breaker.

Therefore:

```text
NO_GO_ENABLE_PAID_CALLS
```

The readiness contract is:

`Maturion/prebuild/runtime-activation-readiness/APW-Paid-Call-Readiness-and-Spend-Control-v0.1.md`

## Current decision boundary

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

The APW integration remains active in zero-cost mode. Paid model calls remain prohibited.

## Next proposed decision

```text
AUTHORISE_APW_PAID_CALL_QA_TO_RED_READINESS_WAVE
```

This would authorise only the IAA prebrief, QA-builder appointment and executable RED contract. It would not authorise implementation, Render changes or paid model use.
