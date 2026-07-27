# PR #1976 Wave Current Tasks

PR: #1976
WAVE: APW-PAID-CALL-QA-TO-RED-READINESS-V01
STATUS: QA_TO_RED_COMMITTED — RED_AND_GREEN_EVIDENCE_PENDING
CS2_AUTHORITY: Johan Ras
CS2_DECISION: AUTHORISE_APW_PAID_CALL_QA_TO_RED_READINESS_WAVE
DATE: 2026-07-27

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-prebrief-apw-paid-call-qa-to-red-readiness-v01.md
IAA_PREFLIGHT_BRIEF_COMMIT: 9a3d9c784875c7546cfccc3b3d6cb2808230ea8f
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_QA: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes
BUILDER_APPOINTMENT_PATH: .agent-admin/builder-appointments/apw-paid-call-qa-to-red-readiness-v0.1.md
BUILDER_APPOINTMENT_COMMIT: 26950a0a80326937f2070e2e5be41a5299964758
RED_INVENTORY_COMMIT: 44a4e437b46da3679e1c65b431a725f60cf32daf
FIRST_EXECUTABLE_RED_COMMIT: 3ebdb5439240942162e019ec871bf1d7ded6c906

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
- [x] Commit canonical IAA prebrief.
- [x] Appoint bounded QA builder.
- [x] Commit one-to-one 16-case RED inventory and executable tests.
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
