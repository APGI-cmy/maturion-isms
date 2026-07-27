# PR #1976 Wave Current Tasks

PR: #1976
WAVE: APW-PAID-CALL-QA-TO-RED-READINESS-V01
STATUS: CS2_AUTHORISED — IAA_PREFLIGHT_PREPARATION
CS2_AUTHORITY: Johan Ras
CS2_DECISION: AUTHORISE_APW_PAID_CALL_QA_TO_RED_READINESS_WAVE
DATE: 2026-07-27

## Authorised sequence

1. Commit this PR-scoped task set.
2. Commit the canonical IAA pre-flight brief.
3. Appoint the bounded `qa-builder` only after the prebrief exists.
4. Commit the QA-to-RED contract and executable RED inventory only after appointment.
5. Preserve raw RED output and prove failures arise from missing durable spend controls rather than harness defects.
6. Run the existing GREEN gateway regression suite separately and prove no regression.
7. Complete Foreman QP and ECAP evidence.
8. Freeze the QA head and obtain independent final IAA.
9. Propose runtime-builder appointment only after an IAA PASS.

## Active tasks

- [x] Record explicit CS2 authorisation.
- [x] Confirm production remains active in zero-cost mode.
- [x] Confirm `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false` remains mandatory.
- [ ] Commit canonical IAA prebrief.
- [ ] Appoint bounded QA builder.
- [ ] Commit one-to-one RED inventory and executable tests.
- [ ] Capture intended RED output with zero harness failures.
- [ ] Re-run existing GREEN regression suite.
- [ ] Complete QP and ECAP.
- [ ] Obtain independent final IAA.

## Required RED capability areas

- shared persistent usage ledger;
- atomic call and token reservation;
- durable daily call and token ceilings;
- per-client anonymous abuse controls;
- restart- and multi-worker-safe enforcement;
- durable fail-closed circuit breaker;
- provider-failure reservation release and failure recording;
- safe response and telemetry reasons for client, call, token and circuit limits;
- bounded provider-side budget evidence and activation-window controls.

## Strict boundary

This wave does not authorise runtime implementation, schema or infrastructure mutation, production environment changes, paid model calls, new retrieval sources, private or tenant data access, or any change to Maturion as final public-response authority.

The required production state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```
