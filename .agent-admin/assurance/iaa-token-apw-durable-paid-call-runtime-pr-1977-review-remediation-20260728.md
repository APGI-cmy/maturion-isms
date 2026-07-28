# Independent IAA Review-Remediation Addendum — PR #1977

**IAA Token**: `IAA-APW-DURABLE-PAID-CALL-RUNTIME-1977-REVIEW-20260728-PASS`  
**PR**: #1977  
**Corrected implementation head assessed**: `1096e0ff0521311ef4834dff6259c50eeef8b455`  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-07-28  
**Verdict**: PASS

## 1. Purpose

This addendum independently reassesses the durable paid-call implementation after eight substantive review conversations were raised against the earlier assured head. It supplements, rather than erases, the original final IAA record.

## 2. Review findings assessed

The review findings were valid and covered:

- incomplete reservation of total provider token exposure;
- attacker-controlled `X-Forwarded-For` use in client bucketing;
- failure-streak divergence between the in-memory and SQL adapters;
- missing per-client release after provider failure;
- ignored `{reconciled: false}` RPC results;
- misleading documentation of external and internal containment reasons.

Duplicate reviewer findings were treated as the same underlying controls, producing eight resolved conversations across five defect clusters.

## 3. Corrective assurance

PASS:

- the effective production entrypoint builds the complete provider message set before reservation;
- the reserved token amount conservatively covers UTF-8 prompt bytes plus the maximum completion-token allowance;
- concurrent requests therefore reserve a safe upper bound before provider invocation;
- client bucketing uses only the server-observed request peer and no longer consumes caller-supplied forwarding headers;
- successful in-memory reconciliation resets the consecutive-failure count;
- failed in-memory reconciliation releases global call capacity, token capacity and the client bucket;
- unknown or duplicate reconciliation fails closed;
- Supabase reconciliation requires an explicit `{reconciled: true}` result;
- UTC date boundaries are used for durable budget-day selection;
- the compatibility contract now distinguishes the external `daily_call_limit_reached` alias from the internal `durable_daily_call_limit_reached` reason.

## 4. Executable evidence

The corrected implementation head passed:

- `APW-RED-PAID-001..016` GREEN contract;
- focused concurrent call and token reservation tests;
- failure-release and consecutive-failure-reset tests;
- unknown and duplicate reconciliation fail-closed tests;
- Supabase unreconciled-RPC rejection tests;
- complete prompt-and-completion reservation test;
- forwarding-header non-trust test;
- existing public-chat regression;
- complete MAT AI Gateway regression and lint;
- CodeQL Python and JavaScript/TypeScript;
- all PR governance and delegation gates.

## 5. Conversation disposition

All eight review conversations were resolved after the corrected exact-head checks completed successfully.

## 6. Residual boundary

This PASS applies only to repository merge readiness. It does not authorise:

- applying the Supabase migration;
- changing Supabase, Render, Vercel or OpenAI configuration;
- deploying the durable runtime;
- marking provider-budget evidence verified;
- approving a paid-call observation window;
- enabling paid calls.

The required live state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

## 7. Final disposition

```text
IAA_REVIEW_REMEDIATION_PASS — FULLY_FUNCTIONAL_REPOSITORY_DELIVERY_CONFIRMED — MERGE_ELIGIBLE — DEPLOYMENT_AND_PAID_CALLS_NO_GO
```

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
