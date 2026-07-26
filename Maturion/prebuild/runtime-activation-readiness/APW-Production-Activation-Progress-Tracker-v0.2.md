# APW Production Activation Progress Tracker v0.2

**Artifact ID**: APW-PRODUCTION-ACTIVATION-TRACKER-002  
**Status**: ACTIVE — COST CONTAINMENT MERGED, PRODUCTION TARGET CONFIRMATION PENDING  
**Authority**: CS2 — Johan Ras  
**Updated**: 2026-07-26

## Current state

- PR #1951 merged: staging verification and rollback evidence ratified.
- PR #1967 merged at `82246cd4110cda801e4b4a5b60da9dadfef19909`: AI cost containment and model restrictions ratified.
- Staging service confirmed healthy.
- Staging settings confirmed:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=25
```

## Progress

| Step | Status | Evidence |
|---:|---|---|
| 1 | COMPLETE | APW controlled-preview and routing foundations merged |
| 2 | COMPLETE | Private-request classifier hardening merged in PR #1942 |
| 3 | COMPLETE | Staging verification and rollback proof merged in PR #1951 |
| 4 | COMPLETE | Cost containment and low-cost model enforcement merged in PR #1967 |
| 5 | COMPLETE | Staging remains flag-off and paid-calls-off |
| 6 | IN PROGRESS | Exact production MAT AI gateway service identification |
| 7 | BLOCKED | Production rollback-access confirmation |
| 8 | BLOCKED | Controlled activation window approval |
| 9 | BLOCKED | Production APW activation with paid calls disabled |
| 10 | BLOCKED | Production zero-token smoke tests and telemetry inspection |
| 11 | BLOCKED | Separate decision on bounded paid-call enablement |

## Current decision

```text
NO_GO_KEEP_APW_PRODUCTION_DISABLED
```

Reason:

```text
PRODUCTION_TARGET_SERVICE_NAME_URL_AND_DEPLOY_SOURCE_NOT_YET_CONFIRMED
```

## Next action

Inspect the Render service believed to be production and capture its Overview, Settings/deploy source, environment flags and `/health` result. Do not change any value during this inspection.
