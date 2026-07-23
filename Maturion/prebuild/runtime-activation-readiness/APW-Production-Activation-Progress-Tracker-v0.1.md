# APW Production Activation Progress Tracker v0.1

**Artifact ID**: APW-PRODUCTION-ACTIVATION-TRACKER-001  
**Version**: 0.1.0  
**Status**: ACTIVE — PRODUCTION TARGET AND ACTIVATION WINDOW READINESS  
**Authority**: CS2 — Johan Ras  
**Last Updated**: 2026-07-23  
**Repository**: `APGI-cmy/maturion-isms`

> **Document Role**: PRIMARY LIVE CONTROL DOCUMENT for APW Specialist controlled production activation.  
> **Update Rule**: Update this tracker after every approval, remediation PR, staging verification, blocker decision, activation action, rollback action, or monitoring finding.

---

## 1. Current Live Status

The governed staging-verification and blocker-closure wave is complete and repository-ratified through merged PR #1951.

Verified final staging outcomes:

- all eleven route tests passed;
- restricted and private prompts routed to `maturion_only`;
- valid public APW prompts routed to `apw_specialist_internal_draft_candidate` while enabled;
- Maturion remained the visible final public response authority;
- the staging flag was restored to `false`;
- rollback returned `apw_integration_disabled`;
- health remained `{"status":"ok"}`;
- Render route telemetry contained safe metadata only and no prompt or answer content.

The blocker is closed:

```text
CLOSE_APW_PRODUCTION_ACTIVATION_BLOCKER_001
```

This does **not** itself activate production.

The production feature flag must remain:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
```

Current phase:

```text
PRODUCTION_TARGET_ROLLBACK_AND_ACTIVATION_WINDOW_READINESS
```

---

## 2. Progress Summary

| Step | Deliverable / Decision | Status | Evidence |
|---:|---|---|---|
| 1 | Controlled-preview implementation and evidence | COMPLETE | PR #1907 merged |
| 2 | Safe route telemetry implementation | COMPLETE | PR #1923 merged |
| 3 | Restricted configuration routing fix | COMPLETE | PR #1928 merged |
| 4 | Conditional controlled production-activation decision | COMPLETE | PR #1938 merged |
| 5 | Private-request classifier hardening | COMPLETE | PR #1942 merged |
| 6 | Staging route verification and rollback proof | COMPLETE | PR #1951 merged; merge commit `de0de27f7c8c20de84df8803261fc9466ba2cd07` |
| 7 | Telemetry-content verification | COMPLETE | Safe metadata-only Render sample accepted in PR #1951 |
| 8 | Close `APW-PRODUCTION-ACTIVATION-BLOCKER-001` | COMPLETE | CS2 decision ratified by merged PR #1951 |
| 9 | Open production target/readiness wave | COMPLETE | Branch `apw-production-target-activation-window-v01` opened |
| 10 | Confirm exact production Render service and environment | NEXT | Direct dashboard confirmation required |
| 11 | Confirm production health and current flag-off state | PENDING | Must show `/health` OK and flag `false` |
| 12 | Confirm immediate rollback access | PENDING | Flag edit, redeploy/restart, deployment and log access |
| 13 | Approve controlled activation window | PENDING | Date, time, timezone, operator and CS2 availability |
| 14 | Approve production smoke-test and monitoring plan | PENDING | Governed readiness record required |
| 15 | Explicit CS2 production `GO` / `NO-GO` decision | BLOCKED | Requires steps 10–14 |
| 16 | Execute controlled production activation | BLOCKED | Separate explicit execution step only after `GO` |
| 17 | Production smoke tests and initial monitoring | BLOCKED | Immediately follows activation |
| 18 | Final production evidence and closeout | BLOCKED | Requires accepted production observation evidence |

---

## 3. Production Readiness Requirements

The active readiness record is:

```text
Maturion/prebuild/runtime-activation-readiness/APW-Production-Target-Rollback-and-Activation-Window-Readiness-v0.1.md
```

It must confirm:

1. exact Render production service identity;
2. production base URL and health URL;
3. production health before activation;
4. production flag remains `false` before activation;
5. operator can edit the flag and redeploy/restart;
6. operator can monitor deployment status and safe telemetry;
7. an approved activation window is reserved;
8. the production smoke-test and initial-monitoring plan is accepted;
9. an explicit CS2 `GO` decision is recorded.

---

## 4. Activation Boundary

Production activation is prohibited until all readiness items are complete and CS2 issues:

```text
GO_CONTROLLED_APW_PRODUCTION_ACTIVATION
```

A readiness PR or merged governance record does not itself authorize changing the production feature flag.

Any actual production flag change and redeployment must be treated as a separate controlled execution step with immediate rollback available.

---

## 5. Next Action

```text
CONFIRM_EXACT_PRODUCTION_RENDER_TARGET_HEALTH_FLAG_STATE_AND_ROLLBACK_ACCESS
```
