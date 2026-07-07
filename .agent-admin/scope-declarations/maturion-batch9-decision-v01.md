# Scope Declaration — Batch 9 Decision v0.1

**Scope ID**: APW-BATCH9-DECISION-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 9 — APW Specialist Production Activation Decision v0.1  
**Date**: 2026-07-02  
**Authority**: CS2 — Johan Ras  
**Operating Role**: Foreman-led governed delivery  
**Task Type**: production activation decision wave — evidence review and go/no-go disposition only  
**Affected Scope**: APW Specialist public integration decision record and governance evidence  
**Implementation Status**: Decision wave only; no production environment switch is changed by this PR

---

## 1. Purpose

This wave follows Batch 8 and records the governed Batch 9 decision boundary for APW Specialist public integration.

It answers:

```text
Is there sufficient controlled preview evidence to approve broader production activation of the APW Specialist public integration, or must activation remain deferred pending more evidence?
```

---

## 2. Source Authority

This scope is governed by:

- Batch 1 Runtime Agent Network prebuild;
- Batch 2 Runtime Knowledge Grounding prebuild;
- Batch 3 APW Specialist prebuild;
- Batch 4 Runtime Activation Readiness Pack;
- Batch 5 APW Specialist Red Tests + Stubs;
- Batch 6 APW Specialist Build-to-Green;
- Batch 7 Public APW Maturion Integration;
- Batch 8 Controlled Preview package;
- `Maturion/prebuild/runtime-activation-readiness/APW-Controlled-Preview-Runbook-v0.1.md`;
- Foreman operating model and PR scope discipline.

---

## 3. In Scope

This wave may:

1. review whether Batch 8 preview evidence exists and is sufficient;
2. record a production activation decision state;
3. define required go/no-go criteria;
4. define monitoring and rollback expectations for any later production enablement;
5. preserve Maturion as final public response authority;
6. preserve APW Specialist as a governed helper behind Maturion;
7. record whether activation is approved, deferred, or rejected;
8. provide governance evidence for the decision wave.

---

## 4. Out of Scope

This wave does not:

- change production environment variables;
- enable production by default;
- create or mutate Supabase tables, policies, functions, migrations or data;
- create or mutate runtime registry records;
- create embeddings, vector search, retrieval services, or database-backed knowledge operations;
- expose APW Specialist directly to public users;
- let APW Specialist produce final public answers;
- grant Maturion or APW Specialist CS2 authority;
- change `.github/agents` contracts;
- perform live provider calls from this PR;
- override missing preview evidence.

---

## 5. Required Evidence for Approval

Production activation may only be approved if there is a preview evidence record showing:

1. target preview or staging environment;
2. flag value before preview;
3. `APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true` preview state;
4. `/health` result for the target service;
5. valid APW prompt route result;
6. public APGI prompt route result;
7. restricted prompt route result;
8. rollback flag-off result;
9. reviewer confirmation;
10. no stop condition triggered.

---

## 6. Initial Decision Boundary

At the start of this wave, no live preview evidence record has been verified in this PR.

Therefore, this wave must not approve broader production activation unless that evidence is added and reviewed in-scope.

---

## 7. Success Criteria

This wave succeeds when:

1. the decision record is created;
2. the decision is explicit and evidence-based;
3. missing evidence is not hidden or treated as passed;
4. rollback and monitoring expectations are documented;
5. Maturion remains final public response authority;
6. APW Specialist remains behind Maturion;
7. no production configuration is changed by this PR;
8. PR-bound scope, PR-scoped delegation evidence and IAA prebrief are present after PR number assignment.

---

## 8. Expected Disposition Options

The decision record must select one of:

- `APPROVED_FOR_PRODUCTION_ENABLEMENT` — only if all evidence is present and accepted;
- `DEFERRED_PENDING_PREVIEW_EVIDENCE` — if preview evidence is absent or incomplete;
- `REMAIN_IN_CONTROLLED_PREVIEW` — if evidence is partially acceptable but not sufficient for broader enablement;
- `REJECTED_OR_ROLLBACK_REQUIRED` — if preview evidence shows unsafe behaviour.
