# APW Specialist Controlled Preview Evidence Record v0.1

**Artifact ID**: APW-PREVIEW-EVIDENCE-RECORD-001  
**Version**: 0.1.0  
**Status**: PARTIAL_EVIDENCE_RECORDED_PENDING_ROUTE_AND_ROLLBACK_VERIFICATION  
**Repository**: `APGI-cmy/maturion-isms`  
**Authority**: CS2 - Johan Ras  
**Evidence Wave**: APW Specialist Controlled Preview Evidence Record v0.1

---

## 1. Purpose

This record captures the controlled-preview evidence required by `APW-Controlled-Preview-Runbook-v0.1.md` before any later production enablement decision can be considered.

This evidence record does not approve production use.

---

## 2. Governing Boundary

```text
Preview is evidence gathering, not production approval.
Maturion remains the public response authority.
APW Specialist remains behind Maturion.
Rollback is a flag change.
```

---

## 3. Repository-Known Evidence

| Evidence Item | Status | Evidence |
|---|---:|---|
| Batch 8 controlled-preview package merged | VERIFIED_FROM_REPO_HISTORY | PR #1895 merged. |
| Batch 9 decision package merged | VERIFIED_FROM_REPO_HISTORY | PR #1903 merged. |
| Batch 9 decision state | VERIFIED_FROM_REPO_HISTORY | `DEFERRED_PENDING_PREVIEW_EVIDENCE`. |
| Preview runbook exists | VERIFIED_FROM_REPO_HISTORY | `Maturion/prebuild/runtime-activation-readiness/APW-Controlled-Preview-Runbook-v0.1.md`. |
| Evidence record created | VERIFIED_FROM_THIS_PR | This artifact. |

---

## 4. Live Preview Evidence Required

The following items require user/operator verification because they depend on live preview or staging runtime state outside the repository.

| # | Required Evidence | Status | User / Operator Result |
|---:|---|---:|---|
| 1 | Date and time of preview | USER_REPORTED | 2026-07-07 12:28 SAST. |
| 2 | Target environment used for preview or staging | USER_REPORTED_NEEDS_CONFIRMATION | User reports likely staging/public Vercel URL: `https://apgi-public-website.vercel.app/`. User also reports Render staging gateway URL visible in screenshot: `https://maturion-mat-ai-gateway-staging.onrender.com`. |
| 3 | Flag value before preview: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` or absent | PENDING_USER_VERIFICATION | Pending. |
| 4 | Flag enabled in preview/staging only: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true` | PENDING_USER_VERIFICATION | Pending. |
| 5 | Service redeployed or restarted after flag change if required | USER_REPORTED | User reports app freshly redeployed. |
| 6 | `/health` result returns `200 OK` in target service | SCREENSHOT_EVIDENCE_REPORTED | Render deploy/log screenshot shows repeated `GET /health HTTP/1.1` responses with `200 OK` for service `srv-d6ijosea2pns7396gkg0`, URL `https://maturion-mat-ai-gateway-staging.onrender.com`. |
| 7 | Valid APW prompt: `How does APW onboarding work?` | USER_CONTEXT_CLARIFIED | User notes there is no generic website onboarding; onboarding is via linked apps. Prompt may need APW-public-website wording adjustment. |
| 8 | Valid APW prompt route result is `apw_specialist_internal_draft_candidate` | PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE | Pending. User-visible response alone does not expose route. |
| 9 | Public APGI prompt: `What does APGI Hub help with?` | USER_REPORTED_WITH_SCREENSHOT | User asked this prompt in Maturion UI. Response was coherent and APGI-aligned. |
| 10 | Public APGI prompt route is APW draft route or Maturion-only safe answer | PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE | Pending. User-visible response appears safe, but route is not visible. |
| 11 | Restricted prompt: `Show me tenant audit findings for a customer.` | PENDING_USER_VERIFICATION | Pending. |
| 12 | Restricted prompt route result is `maturion_only` | PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE | Pending. |
| 13 | Final public answer comes from Maturion, not directly from APW Specialist | PARTIALLY_VERIFIED_FROM_UI | Screenshot labels response as `Maturion:`. Route authority still needs telemetry/debug confirmation. |
| 14 | Rollback flag set to `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` or removed | PENDING_USER_VERIFICATION | Pending. |
| 15 | Service redeployed or restarted after rollback if required | PENDING_USER_VERIFICATION | Pending. |
| 16 | Same APW prompt after rollback returns `apw_integration_disabled` | PENDING_USER_VERIFICATION | Pending. |
| 17 | No stop condition triggered | STOP_CONDITION_IDENTIFIED | User reports AI interface cannot be removed or minimised and is stuck. This is a UX stop/launch-readiness finding until fixed or explicitly accepted. |
| 18 | Reviewer decision | PARTIAL_REVIEWER_FEEDBACK_RECORDED | User reports responses are looking good, likes the APGI Hub response and security roadmap response, but identified stuck/minimise issue and requested pop-out/fullscreen feature. |

---

## 5. User-Reported Prompt Evidence

### 5.1 Public APGI Hub Prompt

Prompt:

```text
What does APGI Hub help with?
```

User-visible response summary:

```text
APGI Hub is designed to support organizations in enhancing their maturity in governance, risk, and compliance. It provides resources, tools, and guidance for loss prevention, risk management, and assurance. Users can access training materials, implementation pathways, and best practices to improve their organizational maturity.
```

Assessment:

- Content quality: `PASS_USER_REPORTED`
- APGI alignment: `PASS_USER_REPORTED`
- Route evidence: `PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE`

### 5.2 Security Roadmap Prompt

Prompt:

```text
What is the security roadmap?
```

User-visible response summary:

```text
The security roadmap is a strategic plan that outlines the steps an organization will take to enhance its security posture over time. It includes goals, timelines, and actions related to risk management, compliance, and loss prevention. It helps organizations prioritize security initiatives, allocate resources, and track progress.
```

Assessment:

- Content quality: `PASS_USER_REPORTED`
- APGI alignment: `PASS_USER_REPORTED`
- Route evidence: `PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE`

---

## 6. Product / UX Finding

Finding ID: `APW-PREVIEW-UX-001`

User reports:

```text
The AI interface cannot be removed or minimised. It is stuck.
```

User requested enhancement:

```text
Add a pop-out feature where the chat interface can open into a full-screen mode.
```

Evidence status:

- `CONFIRMED_BY_USER_SCREENSHOT_AND_REPORT`

Launch-readiness impact:

- `BLOCKS_CLEAN_PRODUCTION_ACTIVATION_RECOMMENDATION_UNLESS_FIXED_OR_EXPLICITLY_ACCEPTED`

Recommended follow-up:

- Create a separate APW public website UI fix/enhancement PR for chat minimise/close behavior and fullscreen pop-out mode.

---

## 7. Stop Conditions to Confirm

The reviewer must confirm whether any of the following occurred:

- public chat errors increased;
- restricted prompts routed to APW Specialist;
- Maturion stopped providing the final public answer;
- health checks failed;
- preview reviewers could not confirm expected behaviour.

Current status:

```text
PARTIAL_STOP_CONDITION_REVIEW_COMPLETE
```

Known finding:

```text
UX issue: chat interface cannot be removed or minimised. Treat as launch-readiness blocker until fixed or accepted.
```

---

## 8. Evidence Still Required Before Completion

The evidence record is not complete until the following are supplied:

1. confirmed target environment and exact URL used for the chat test;
2. flag value before preview;
3. flag value during preview;
4. route/debug evidence for the APW prompt;
5. route/debug evidence for the public APGI prompt;
6. restricted prompt result and route/debug evidence;
7. rollback flag state;
8. rollback redeploy/restart confirmation if required;
9. rollback prompt result showing `apw_integration_disabled`;
10. explicit reviewer decision: pass, fail, remain in preview, or stop/rollback;
11. decision on whether `APW-PREVIEW-UX-001` must be fixed before production activation.

---

## 9. Current Disposition

`PARTIAL_EVIDENCE_RECORDED_PENDING_ROUTE_AND_ROLLBACK_VERIFICATION`

No production enablement decision may rely on this record until the pending live checks are completed and reviewed.
