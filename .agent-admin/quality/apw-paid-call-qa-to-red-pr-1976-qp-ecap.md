# APW Paid-Call QA-to-RED — Foreman QP and ECAP Evidence

**PR**: #1976  
**Wave**: APW-PAID-CALL-QA-TO-RED-READINESS-V01  
**Authority**: CS2 — Johan Ras  
**Reviewed head**: `472bda1d0d14d9abb6f28444d57afd668f46bf02`  
**Date**: 2026-07-28

## Foreman Quality Professor review

### Scope integrity

PASS.

The PR contains governance, readiness, QA-to-RED, workflow and evidence artifacts only. It does not implement the persistent usage ledger, rate limiter, circuit breaker, token reservation, provider integration changes, live schema, Render configuration, Vercel configuration, Supabase mutation or paid-call enablement.

### Delegation order

PASS.

- task set: `19d037b20f3a710c5ee26ad8d417d356d6f1faa6`;
- IAA prebrief: `9a3d9c784875c7546cfccc3b3d6cb2808230ea8f`;
- QA-builder appointment: `26950a0a80326937f2070e2e5be41a5299964758`;
- first gate-detected implementation-like QA artifact: `44a4e437b46da3679e1c65b431a725f60cf32daf`;
- executable RED contract: `3ebdb5439240942162e019ec871bf1d7ded6c906`.

Builder Delegation Order Gate run `30336850624` passed on the reviewed head.

### RED evidence

PASS.

Dedicated workflow: `APW Paid-Call RED Evidence`  
Workflow run: `30336850708`  
Job: `red-evidence` / `90203509120`

The workflow proved:

- 16 cases collected;
- 16 intentional failures;
- zero unexpected passes;
- zero collection, import, syntax, fixture, file or network errors;
- no live environment dependency;
- no real provider call;
- raw RED output uploaded as an artifact.

### GREEN regression

PASS.

The same exact-head workflow ran the existing `tests/test_public_chat.py` regression separately and the step completed successfully. This preserves:

- integration-disabled zero-call behaviour;
- restricted-request zero-call behaviour;
- paid calls default-off;
- `gpt-4o-mini` allowlisting;
- output ceiling behaviour;
- interim process-local containment;
- prompt/answer-safe telemetry.

### CI correction

PASS.

The intentional RED suite is isolated at:

```text
.agent-admin/qa-to-red/pr-1976/test_public_chat_durable_spend_red.py
```

It is not discovered by the ordinary GREEN gateway test suite. The dedicated workflow interprets the expected 16 RED failures as successful QA evidence, while the normal gateway deployment workflow remains GREEN.

## ECAP administrative validation

Result: `ADMIN_VALIDATED`

Validated:

- PR-scoped task record exists;
- IAA prebrief exists and precedes appointment;
- appointment exists and precedes QA implementation-like artifacts;
- machine-readable delegation evidence is valid;
- scope declaration is bounded;
- RED inventory maps all 16 IDs one-to-one;
- dedicated RED workflow passed;
- ordinary gateway workflow passed;
- Preflight, POLC, ECAP, Foreman Pre-Handover, IAA alignment, Wave 7, routing, stub and merge-alignment gates passed;
- production paid-call flag remains required to be `false`;
- no runtime-builder appointment is included.

## QP disposition

```text
QP_PASS — QA_TO_RED_COMPLETE — RUNTIME_IMPLEMENTATION_REMAINS_NO_GO_PENDING_INDEPENDENT_IAA
```

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
