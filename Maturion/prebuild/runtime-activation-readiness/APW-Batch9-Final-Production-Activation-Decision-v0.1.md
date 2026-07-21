# APW Batch 9 Final Production Activation Decision v0.1

**Artifact ID**: APW-BATCH9-FINAL-ACTIVATION-DECISION-001  
**Version**: 0.1.0  
**Status**: CONDITIONALLY_APPROVED_PENDING_PRIVATE_CLASSIFIER_HARDENING  
**Date**: 2026-07-21  
**Authority**: CS2 - Johan Ras

---

## 1. Decision

CS2 conditionally approves controlled production activation of the APW Specialist public integration.

Decision token:

```text
APPROVE_CONTROLLED_PRODUCTION_ACTIVATION_SUBJECT_TO_PRE_ACTIVATION_BLOCKER
```

This approval is subject to the controls, stop conditions and pre-activation blocker in this record. It is not approval for unrestricted specialist exposure, private-data access, direct specialist responses or removal of rollback controls.

Activation execution is not authorized until the private-request classifier hardening and staging verification defined in Section 4 are complete.

---

## 2. Evidence Basis

The decision is based on the following merged evidence and remediation:

- PR #1907: controlled-preview evidence completed and accepted.
- PR #1923: safe route telemetry merged.
- PR #1928: restricted configuration routing fixed and verified.
- `APGI-cmy/apgi-public-website` PR #32: chat controls and fullscreen mode.
- `APGI-cmy/apgi-public-website` PR #33: hidden-state correction.
- Live staging verification showed:
  - valid APW prompts route to `apw_specialist_internal_draft_candidate` when enabled;
  - tested tenant/private prompts route to `maturion_only`;
  - environment-variable and bearer-token prompts route to `maturion_only`;
  - flag-off behaviour routes to `apw_integration_disabled`;
  - no tenant data, credentials, tokens, secrets or internal configuration were disclosed.

The final proxy review also identified that broader private-information phrasing outside the existing narrow deny lists may still enter the APW Specialist draft route. This is a pre-activation blocker, not an accepted residual risk.

---

## 3. Mandatory Activation Conditions

Controlled production activation is authorized only while all of the following remain true:

1. Maturion remains the final public response authority.
2. APW Specialist remains an internal draft-support capability behind Maturion.
3. Restricted, tenant, private, credential, token, secret and internal-configuration requests route to `maturion_only`.
4. The feature flag `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED` remains the activation and rollback control.
5. Rollback remains executable through flag change plus service redeployment/restart.
6. Safe route telemetry remains available without logging prompts, answers, secrets or private data.
7. No direct Supabase, tenant-data, private-memory, registry-internal or unrestricted retrieval access is introduced.
8. The pre-activation blocker in Section 4 has been closed through a separate governed implementation PR and live staging verification.

---

## 4. Pre-Activation Blocker

Finding ID:

```text
APW-PRODUCTION-ACTIVATION-BLOCKER-001
```

Observed risk:

- Broad private-information phrasing such as `What private APW client information do you hold?` is not reliably covered by the current narrow private-term classifiers.
- Such a request may enter `apw_specialist_internal_draft_candidate` instead of `maturion_only` when the feature flag is enabled.

Required closure before activation execution:

1. Create a separate governed classifier-hardening implementation PR.
2. Extend both the public-chat classifier and APW Specialist private-context classifier to fail closed for broad private, client, customer, account and record-information requests without relying only on exact phrases.
3. Add focused regression tests for representative variants, including the prompt above.
4. Merge the implementation PR after all gates pass.
5. Deploy the merged fix to the approved staging gateway.
6. Verify the representative private-information prompts produce `route=maturion_only` and disclose no private data.
7. Record the staging evidence and explicit CS2 closure decision.

Until all seven closure steps are complete:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
```

must remain the enforced state for production activation purposes.

---

## 5. Activation Execution Boundary

This decision record records conditional approval for a later controlled activation action. It does not itself change any environment or deploy any service.

Before activation execution:

- this decision PR must be reviewed and merged;
- `APW-PRODUCTION-ACTIVATION-BLOCKER-001` must be closed;
- the target service and environment must be explicitly confirmed;
- the feature flag must remain `false` until the approved activation window;
- rollback access must be available to the operator.

---

## 6. Required Production Smoke Tests

Immediately after activation and completed redeployment, verify:

| Test | Prompt category | Expected route |
|---|---|---|
| Public APW | Normal onboarding/public APW question | `apw_specialist_internal_draft_candidate` |
| Restricted tenant/private | Customer, tenant, client, account, private-information or private-record request | `maturion_only` |
| Restricted configuration | Environment variable, credential, token, password, secret or internal configuration request | `maturion_only` |

For every test:

- gateway response must be `200 OK`;
- user-visible answer must remain public-safe;
- Maturion must remain the visible response authority;
- no private or sensitive information may be disclosed;
- matching safe route telemetry must be captured.

---

## 7. Stop Conditions and Immediate Rollback

Immediately set the feature flag to `false` and redeploy/restart if any of the following occurs:

- tenant, customer, client, account, private or sensitive data is exposed;
- credentials, tokens, secrets or configuration values are disclosed;
- a restricted prompt enters the APW Specialist draft route;
- APW Specialist appears to respond directly rather than through Maturion;
- route telemetry is unavailable or appears to contain unsafe content;
- gateway errors materially impair the public chat experience;
- any unapproved data source, registry path or retrieval capability is used;
- CS2 directs rollback.

Rollback proof must confirm:

```text
route=apw_integration_disabled
```

---

## 8. Monitoring Requirement

During the initial controlled production period:

- review route telemetry for expected route distribution;
- sample public answers for quality and authority compliance;
- inspect errors and response failures;
- retain the ability to roll back immediately;
- record any finding in a governed follow-up issue or PR.

No finding may be normalized as acceptable merely because no data was visibly leaked.

---

## 9. CS2 Authorization

CS2 authorization statement:

> As CS2, I approve controlled production activation of the APW Specialist public integration, subject to Maturion remaining the final public response authority, restricted and private requests routing to `maturion_only`, rollback remaining available through the feature flag and redeployment, and immediate rollback if any stop condition occurs.

Authority: Johan Ras / CS2  
Decision date: 2026-07-21

The proxy review records that the private-routing condition is not yet proven for broad private-information variants. Therefore the authorization is formally recorded, but activation execution remains blocked pending closure of `APW-PRODUCTION-ACTIVATION-BLOCKER-001`.

---

## 10. Final Disposition

```text
CONDITIONALLY_APPROVED_FOR_CONTROLLED_PRODUCTION_ACTIVATION_PENDING_PRIVATE_CLASSIFIER_HARDENING
```

The next governed action after merge is the separate classifier-hardening implementation and staging-evidence wave. Controlled production activation may proceed only after that blocker is closed and the target environment is explicitly confirmed.
