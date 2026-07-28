# Independent IAA Final — APW Paid-Call QA-to-RED Readiness PR #1976

**IAA record**: IAA-APW-PAID-CALL-QA-RED-1976-FINAL  
**PR**: #1976  
**Wave**: APW-PAID-CALL-QA-TO-RED-READINESS-V01  
**Assurance head**: `348723cbb55c4e08068f67c8e97f360499419edd`  
**Authority retained by**: CS2 — Johan Ras  
**Date**: 2026-07-28

## Independence statement

This assurance disposition evaluates the frozen QA package against the committed IAA prebrief and does not implement the future runtime safeguards, enable paid calls, mutate infrastructure or broaden the authorised scope.

## Evidence reviewed

- PR-scoped task set and CS2 authority;
- canonical IAA prebrief;
- bounded QA-builder appointment;
- machine-readable delegation-order record;
- scope declaration;
- 16-case one-to-one RED inventory;
- isolated executable RED contract;
- dedicated RED evidence workflow;
- existing GREEN public-chat regression;
- Foreman QP and ECAP evidence;
- exact-head governance, security and deployment checks.

## Assurance findings

### IAA-1976-001 — authority and ancestry

PASS.

The prebrief is a strict ancestor of the appointment. The appointment is a strict ancestor of the first gate-detected implementation-like QA artifact. The machine record identifies the correct first QA artifact commit and the Builder Delegation Order Gate passes.

### IAA-1976-002 — executable inventory completeness

PASS.

All `APW-RED-PAID-001..016` identifiers have a one-to-one executable mapping covering persistent ledger authority, atomic call/token reservation, restart/multi-worker safety, per-client abuse control, shared circuit breaking, provider-failure reconciliation, safe telemetry, provider-budget evidence and observation-window authority.

### IAA-1976-003 — truthful RED state

PASS.

Workflow run `30336850708` proves the complete RED contract executes and fails only because the durable future capability is absent. The workflow rejects collection, import, syntax, fixture, file, connection and network errors. No live provider or environment mutation is used.

### IAA-1976-004 — existing regression preservation

PASS.

The existing public-chat regression suite runs separately and remains GREEN. Existing zero-call privacy paths, default-off paid calls, model allowlisting, output ceilings, interim local containment and safe telemetry are preserved.

### IAA-1976-005 — lane separation

PASS.

Intentional RED tests are isolated from ordinary GREEN discovery. The normal gateway workflow passes, and the dedicated RED workflow treats the expected 16 failures as successful QA evidence without weakening ordinary build checks.

### IAA-1976-006 — scope and safety boundary

PASS.

No durable runtime implementation, migration, live data mutation, Render/Vercel/Supabase/OpenAI configuration change, model expansion, private retrieval, Maturion authority change or paid-call enablement is included.

Required state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

## Final verdict

```text
FINAL_ASSURANCE_PASS — PR_1976_QA_TO_RED_MAY_BE_MERGED — RUNTIME_BUILDER_APPOINTMENT_MAY_BE_PROPOSED_SEPARATELY
```

IAA token:

```text
IAA-APW-PAID-CALL-QA-RED-1976-20260728-PASS
```

## Conditions retained

- PR #1976 must remain QA/readiness only.
- Paid calls remain disabled.
- The runtime implementation must use a separate issue/branch/PR and a fresh prebrief/appointment/delegation sequence.
- Durable safeguards must build the 16 RED cases to GREEN without weakening existing regressions.
- Infrastructure or production activation requires later explicit CS2 authority.
