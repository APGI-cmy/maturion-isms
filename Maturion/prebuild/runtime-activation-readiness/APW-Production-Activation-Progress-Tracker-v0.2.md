# APW Production Activation Progress Tracker v0.2

**Artifact ID**: APW-PRODUCTION-ACTIVATION-TRACKER-002  
**Status**: ACTIVE — PRODUCTION TARGET CONFIRMED, AWAITING EXPLICIT CS2 GO  
**Authority**: CS2 — Johan Ras  
**Updated**: 2026-07-26

## Current state

- PR #1951 merged: staging verification and rollback evidence ratified.
- PR #1967 merged at `82246cd4110cda801e4b4a5b60da9dadfef19909`: AI cost containment and model restrictions ratified.
- Exact production MAT AI gateway confirmed:

```text
Service: maturion-isms
URL: https://maturion-isms.onrender.com
Repository: APGI-cmy/maturion-isms
Branch: main
Root directory: apps/mat-ai-gateway
Health: {"status":"ok"}
Deployment: Live
```

- Production safeguards confirmed and deployed:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

- Operator access to edit variables, redeploy, observe Live status, inspect logs and execute rollback is confirmed.

## Progress

| Step | Status | Evidence |
|---:|---|---|
| 1 | COMPLETE | APW controlled-preview and routing foundations merged |
| 2 | COMPLETE | Private-request classifier hardening merged in PR #1942 |
| 3 | COMPLETE | Staging verification and rollback proof merged in PR #1951 |
| 4 | COMPLETE | Cost containment and low-cost model enforcement merged in PR #1967 |
| 5 | COMPLETE | Production target identified as `maturion-isms` |
| 6 | COMPLETE | Production health confirmed |
| 7 | COMPLETE | Production containment variables installed with both switches false |
| 8 | COMPLETE | Rollback, redeploy and log access confirmed |
| 9 | READY | Explicit CS2 decision for zero-cost activation |
| 10 | BLOCKED | Enable APW integration only and redeploy |
| 11 | BLOCKED | Production zero-token smoke tests and telemetry inspection |
| 12 | BLOCKED | Separate decision on bounded paid-call enablement |

## Decision now required

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION_WITH_PAID_CALLS_DISABLED
```

This authorises only:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

It does not authorise any paid model call.

Alternative:

```text
NO_GO_KEEP_APW_PRODUCTION_DISABLED
```

## Next action after GO

Change only the APW integration flag to `true`, redeploy production, verify health, then run the two governed zero-token smoke tests and inspect safe telemetry.
