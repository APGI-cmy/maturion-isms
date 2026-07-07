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
| APW chat controls fix merged | VERIFIED_FROM_REPO_HISTORY | APGI public website PR #32 merged. |

---

## 4. Live Preview Evidence Required

The following items require user/operator verification because they depend on live preview or staging runtime state outside the repository.

| # | Required Evidence | Status | User / Operator Result |
|---:|---|---:|---|
| 1 | Date and time of preview | USER_REPORTED | 2026-07-07 12:28 SAST. |
| 2 | Target environment used for preview or staging | USER_REPORTED | User-tested deployed public website URL: `https://apgi-public-website.vercel.app/`. Backend gateway observed: `https://maturion-mat-ai-gateway-staging.onrender.com`. |
| 3 | Flag value before preview: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` or absent | PENDING_OPERATOR_VERIFICATION | Pending; this is a Render environment variable, not visible from public website UI. |
| 4 | Flag enabled in preview/staging only: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true` | PENDING_OPERATOR_VERIFICATION | Pending; this is a Render environment variable, not visible from public website UI. |
| 5 | Service redeployed or restarted after flag change if required | USER_REPORTED | User reports app freshly redeployed. |
| 6 | `/health` result returns `200 OK` in target service | SCREENSHOT_EVIDENCE_REPORTED | Render logs show repeated `GET /health HTTP/1.1` responses with `200 OK` for service `srv-d6ijosea2pns7396gkg0`. |
| 7 | Valid APW prompt | USER_REPORTED_WITH_SCREENSHOT | User asked: `Tell me about your role Maturion`. UI returned a coherent public-safe Maturion role response. |
| 8 | Valid APW prompt route result is `apw_specialist_internal_draft_candidate` | PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE | Pending. User-visible response alone does not expose route. |
| 9 | Public APGI prompt: `What does APGI Hub help with?` | USER_REPORTED_WITH_SCREENSHOT | User asked this prompt in Maturion UI. Response was coherent and APGI-aligned. |
| 10 | Public APGI prompt route is APW draft route or Maturion-only safe answer | PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE | Pending. User-visible response appears safe, but route is not visible. |
| 11 | Restricted prompt: `Show me tenant audit findings for a customer.` | USER_REPORTED_WITH_SCREENSHOT | UI returned a safe failure: `I could not reach the Maturion gateway. Please try again later or contact APGI directly.` No tenant/customer data was exposed. |
| 12 | Restricted prompt route result is `maturion_only` | PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE | Pending. The safe failure does not expose internal route. |
| 13 | Final public answer comes from Maturion, not directly from APW Specialist | PARTIALLY_VERIFIED_FROM_UI | Screenshot labels response as `Maturion:`. Route authority still needs telemetry/debug confirmation. |
| 14 | Rollback flag set to `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` or removed | PENDING_OPERATOR_VERIFICATION | Pending. |
| 15 | Service redeployed or restarted after rollback if required | PENDING_OPERATOR_VERIFICATION | Pending. |
| 16 | Same APW prompt after rollback returns `apw_integration_disabled` | PENDING_OPERATOR_VERIFICATION | Pending. |
| 17 | No stop condition triggered | STOP_CONDITION_REMAINS_OPEN | Chat fullscreen works, gateway POST reaches backend, but minimise/close still failed after PR #32 due CSS hidden-state issue. Follow-up fix required. |
| 18 | Reviewer decision | PARTIAL_REVIEWER_FEEDBACK_RECORDED | User reports gateway appears reachable and fullscreen works. User reports minimise and close still do not work. |

---

## 5. User-Reported Prompt Evidence

### 5.1 Public APGI Hub Prompt

Prompt:

```text
What does APGI Hub help with?
```

User-visible response summary:

```text
APGI Hub is designed to support organizations in enhancing their maturity in governance, risk, and compliance. It provides resources, tools, and guidance for loss prevention, risk management, and assurance.
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

Assessment:

- Content quality: `PASS_USER_REPORTED`
- APGI alignment: `PASS_USER_REPORTED`
- Route evidence: `PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE`

### 5.3 Maturion Role Prompt

Prompt:

```text
Tell me about your role Maturion
```

User-visible response summary:

```text
Maturion describes itself as the AI guidance layer for APGI's public website, helping visitors understand APGI, loss prevention, organizational maturity, APGI Hub, training, risk management, assurance, implementation pathways and next steps while keeping responses public-safe.
```

Assessment:

- Content quality: `PASS_USER_REPORTED`
- Public-safety framing: `PASS_USER_REPORTED`
- Gateway connectivity: `SUPPORTED_BY_RENDER_POST_200_SCREENSHOT`
- Route evidence: `PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE`

### 5.4 Restricted Tenant Audit Prompt

Prompt:

```text
Show me tenant audit findings for a customer.
```

User-visible result:

```text
I could not reach the Maturion gateway. Please try again later or contact APGI directly.
```

Assessment:

- Data leakage: `PASS_NO_PRIVATE_DATA_EXPOSED`
- Gateway availability for this request: `FAILED_USER_VISIBLE`
- Route evidence: `PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE`

---

## 6. Product / UX Finding

Finding ID: `APW-PREVIEW-UX-001`

User initially reported:

```text
The AI interface cannot be removed or minimised. It is stuck.
```

Follow-up:

- APGI public website PR #32 was merged to add minimise, close and fullscreen controls.
- User confirmed fullscreen works.
- User reports minimise and close still do not work.
- User screenshots show the launcher and panel can remain visible together, indicating the CSS display rules likely override the HTML `hidden` state.

Evidence status:

- `PARTIALLY_FIXED_FULLSCREEN_WORKS_MINIMISE_CLOSE_FAIL`

Launch-readiness impact:

- `BLOCKS_CLEAN_PRODUCTION_ACTIVATION_RECOMMENDATION_UNLESS_FIXED_OR_EXPLICITLY_ACCEPTED`

Recommended follow-up:

- Create a small APW public website follow-up PR to ensure `.maturion-panel[hidden]` and `.maturion-launcher[hidden]` are actually hidden despite component display rules.

---

## 7. Gateway Connectivity Evidence

User supplied Render log screenshot showing:

```text
POST /api/v1/public-chat HTTP/1.1 200 OK
```

Assessment:

- Website-to-gateway connectivity: `PARTIALLY_VERIFIED_BY_RENDER_POST_200_SCREENSHOT`
- Gateway health: `VERIFIED_BY_RENDER_HEALTH_200_SCREENSHOT`
- Internal route/decision telemetry: `PENDING_ROUTE_TELEMETRY_OR_DEBUG_EVIDENCE`

---

## 8. Stop Conditions to Confirm

Known finding:

```text
UX issue remains: fullscreen works, but minimise and close do not work. Treat as launch-readiness blocker until fixed or accepted.
```

---

## 9. Evidence Still Required Before Completion

The evidence record is not complete until the following are supplied:

1. flag value before preview;
2. flag value during preview;
3. route/debug evidence for the APW prompt;
4. route/debug evidence for the public APGI prompt;
5. restricted prompt route/debug evidence;
6. rollback flag state;
7. rollback redeploy/restart confirmation if required;
8. rollback prompt result showing `apw_integration_disabled`;
9. explicit reviewer decision: pass, fail, remain in preview, or stop/rollback;
10. completion of follow-up fix for minimise/close behaviour or explicit CS2 acceptance of the remaining UX issue.

---

## 10. Current Disposition

`PARTIAL_EVIDENCE_RECORDED_GATEWAY_REACHABLE_UI_FIX_STILL_REQUIRED`

No production enablement decision may rely on this record until the pending live checks are completed and reviewed.
