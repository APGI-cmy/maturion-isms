# APW Specialist Controlled Preview Evidence Record v0.1

**Artifact ID**: APW-PREVIEW-EVIDENCE-RECORD-001  
**Version**: 0.1.0  
**Status**: PENDING_USER_VERIFICATION  
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
| 1 | Date and time of preview | PENDING_USER_VERIFICATION | Pending |
| 2 | Target environment used for preview or staging | PENDING_USER_VERIFICATION | Pending |
| 3 | Flag value before preview: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` or absent | PENDING_USER_VERIFICATION | Pending |
| 4 | Flag enabled in preview/staging only: `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true` | PENDING_USER_VERIFICATION | Pending |
| 5 | Service redeployed or restarted after flag change if required | PENDING_USER_VERIFICATION | Pending |
| 6 | `/health` result returns `200 OK` in target service | PENDING_USER_VERIFICATION | Pending |
| 7 | Valid APW prompt: `How does APW onboarding work?` | PENDING_USER_VERIFICATION | Pending |
| 8 | Valid APW prompt route result is `apw_specialist_internal_draft_candidate` | PENDING_USER_VERIFICATION | Pending |
| 9 | Public APGI prompt: `What does APGI Hub help with?` | PENDING_USER_VERIFICATION | Pending |
| 10 | Public APGI prompt route is APW draft route or Maturion-only safe answer | PENDING_USER_VERIFICATION | Pending |
| 11 | Restricted prompt: `Show me tenant audit findings for a customer.` | PENDING_USER_VERIFICATION | Pending |
| 12 | Restricted prompt route result is `maturion_only` | PENDING_USER_VERIFICATION | Pending |
| 13 | Final public answer comes from Maturion, not directly from APW Specialist | PENDING_USER_VERIFICATION | Pending |
| 14 | Rollback flag set to `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false` or removed | PENDING_USER_VERIFICATION | Pending |
| 15 | Service redeployed or restarted after rollback if required | PENDING_USER_VERIFICATION | Pending |
| 16 | Same APW prompt after rollback returns `apw_integration_disabled` | PENDING_USER_VERIFICATION | Pending |
| 17 | No stop condition triggered | PENDING_USER_VERIFICATION | Pending |
| 18 | Reviewer decision | PENDING_USER_VERIFICATION | Pending |

---

## 5. Stop Conditions to Confirm

The reviewer must confirm whether any of the following occurred:

- public chat errors increased;
- restricted prompts routed to APW Specialist;
- Maturion stopped providing the final public answer;
- health checks failed;
- preview reviewers could not confirm expected behaviour.

Current status: `PENDING_USER_VERIFICATION`.

---

## 6. Evidence Capture Format

When the user/operator supplies evidence, update this record with:

```text
Preview date/time:
Target environment:
Flag before preview:
Flag during preview:
Health result:
Prompt sample 1:
Route sample 1:
Output sample 1:
Prompt sample 2:
Route sample 2:
Output sample 2:
Restricted prompt sample:
Restricted route:
Rollback flag state:
Rollback route result:
Stop conditions triggered: yes/no
Reviewer decision:
Reviewer notes:
```

---

## 7. Current Disposition

`PREVIEW_EVIDENCE_RECORD_CREATED_PENDING_USER_VERIFICATION`

No production enablement decision may rely on this record until the pending live checks are completed and reviewed.
