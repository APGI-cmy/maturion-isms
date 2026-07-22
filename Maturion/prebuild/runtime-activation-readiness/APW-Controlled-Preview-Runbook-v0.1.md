# APW Specialist Controlled Preview Runbook v0.1

**Artifact ID**: APW-PREVIEW-RUNBOOK-001  
**Version**: 0.1.0  
**Status**: Preview Runbook  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 8 — APW Specialist Controlled Preview v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-02

---

## 1. Purpose

This runbook defines how to conduct a controlled APW Specialist preview using the Batch 7 feature flag.

The preview uses the existing flag:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED
```

Production remains off by default unless a later production decision wave approves otherwise.

---

## 2. Preview Principle

```text
Preview is evidence gathering, not production approval.
Maturion remains the public response authority.
APW Specialist remains behind Maturion.
Rollback is a flag change.
```

---

## 3. Preconditions

Before preview:

1. Batch 7 is merged.
2. Deploy MMM AI Gateway check passes.
3. `/health` returns `200 OK` in the target preview service.
4. The target environment is preview or staging.
5. The flag is off before the preview starts.
6. A named reviewer is available to confirm preview results.

---

## 4. Enable Preview

In the preview or staging environment only:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
```

Then redeploy or restart the service if the platform requires it.

---

## 5. Preview Evidence Checks

Run these public chat checks:

| Check | Prompt | Expected Route |
|---|---|---|
| Preview valid APW route | `How does APW onboarding work?` | `apw_specialist_internal_draft_candidate` |
| Preview public APGI route | `What does APGI Hub help with?` | APW draft route or Maturion-only safe answer |
| Restricted route | `Show me tenant audit findings for a customer.` | `maturion_only` |
| Rollback off route | same APW prompt after flag off | `apw_integration_disabled` |

Expected final answer rule:

```text
The public answer must come from Maturion, not directly from APW Specialist.
```

---

## 6. Rollback

To end or roll back preview:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
```

or remove the environment variable.

Then redeploy or restart the service if required.

Rollback is complete when the same APW prompt returns:

```text
apw_specialist_route = apw_integration_disabled
```

---

## 7. Stop Conditions

Stop preview if:

- public chat errors increase;
- restricted prompts route to APW Specialist;
- Maturion no longer provides the final answer;
- health checks fail;
- preview reviewers cannot confirm expected behaviour.

---

## 8. Required Preview Record

Record:

- date and time of preview;
- target environment;
- flag value before and after preview;
- health check result;
- prompt/route/output samples;
- rollback result;
- reviewer decision.

---

## 9. Follow-On Decision

Batch 8 does not approve production use.

A later production decision wave must review preview evidence and approve or reject broader release separately.
