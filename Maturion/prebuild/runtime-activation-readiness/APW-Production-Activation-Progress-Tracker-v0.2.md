# APW Production Activation Progress Tracker v0.2

**Artifact ID**: APW-PRODUCTION-ACTIVATION-TRACKER-002  
**Version**: 0.2.0  
**Status**: APW ZERO-COST PRODUCTION ACTIVATION VERIFIED — PAID CALLS DISABLED  
**Authority**: CS2 — Johan Ras  
**Repository**: `APGI-cmy/maturion-isms`  
**Last Updated**: 2026-07-27

## Current state

- PR #1951 merged: staging verification and rollback evidence ratified.
- PR #1967 merged at `82246cd4110cda801e4b4a5b60da9dadfef19909`: AI cost containment and model restrictions ratified.
- Production target confirmed as `maturion-isms` running `apps/mat-ai-gateway` from `main`.
- Production deployment is `Live` and `/health` returns `{"status":"ok"}`.
- CS2 approved:

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED
```

- Verified production state:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

- Public and restricted production smoke tests both returned static containment with `model=none` and zero tokens.
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
| 13 | IN PROGRESS | Final review and merge of PR #1971 |
| 14 | BLOCKED | Any bounded paid-call enablement decision |

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

## Current decision boundary

The APW public integration is active in zero-cost mode.

Paid model calls remain prohibited:

```text
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

A separate governed wave and explicit CS2 approval are required before that value may change.

## Next action

```text
REVIEW_AND_MERGE_PR_1971_THEN_KEEP_PAID_CALLS_DISABLED
```
