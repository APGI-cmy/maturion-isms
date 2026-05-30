# IAA Gap Review — ISMS Stage 5 Fully Functional Delivery Readiness

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Review Type | Independent gap review against fully functional build delivery |
| Date | 2026-05-29 |
| Status | MATERIAL GAPS FOUND |

---

## 1. Disposition

Stage 5 Architecture Reconciliation is acceptable for pre-build progression to Stage 6 QA-to-Red.

It is not yet sufficient for implementation handover or fully functional build delivery.

---

## 2. Positive Findings

- Public and private route boundaries are identified.
- Route ownership and target component patterns are defined.
- Onboarding is resolved architecturally as `/onboarding`.
- Checkout transition is resolved at architecture level.
- MMM initial handoff is resolved as `/maturity/setup` for portal implementation.
- Future private module routes are reserved.
- Shared context domains are listed.
- Entitlement concept is described.
- Ask Maturion public/private boundary is described.
- Audit event minimum contract is defined.
- TRS-to-Architecture traceability exists.

---

## 3. Material Gaps Before Fully Functional Build Delivery

### GAP-FFD-001 — Route wiring is specified but not implemented

The architecture defines public and protected routes, but implementation has not yet proven that routes exist, render, and guard correctly.

Required downstream evidence:

- route constants exist;
- App router wires every public and protected route;
- public routes load without auth;
- protected routes require auth;
- legacy redirects work.

### GAP-FFD-002 — Component inventory is target-pattern only

The architecture lists target files/components, but does not prove those files exist or are wired.

Required downstream evidence:

- page/component existence audit;
- import/wiring audit;
- module card config audit;
- public CTA route audit.

### GAP-FFD-003 — AI capability boundary is conceptual

Ask Maturion has a public/private boundary, but there is no adapter contract, prompt contract, context payload schema, permission filter, fallback behavior, or test plan.

Required downstream evidence:

- AI context adapter specification;
- public prompt whitelist or safe prompt contract;
- authenticated context payload contract;
- permission filtering rules;
- AI failure/fallback behavior;
- tests or QA checks.

### GAP-FFD-004 — Edge function registry is absent for ISMS

The architecture does not identify whether ISMS public landing, onboarding, free assessment, subscription, audit, or AI flows use edge functions.

Required downstream evidence:

- edge function registry;
- invocation-to-function mapping;
- deployed/pending status;
- no unregistered function invocation check.

### GAP-FFD-005 — Supabase schema/data model is not defined

Entitlements, onboarding context, audit events, free assessment results, and handoff records are described conceptually, but no schema or persistence model is defined.

Required downstream evidence:

- table/model list;
- ownership per table;
- migration plan;
- schema-to-hook validation plan;
- seed/mock-data policy for early build waves.

### GAP-FFD-006 — RLS/tenant isolation is not designed

The architecture says production persistence requires tenant isolation, but does not define table-level RLS requirements.

Required downstream evidence:

- RLS design per table;
- CRUD policy matrix;
- tenant boundary tests;
- unauthenticated vs authenticated access matrix.

### GAP-FFD-007 — Subscription and payment provider are not specified

Checkout transition is architecturally resolved, but provider, callback route, payment state, subscription state, and entitlement activation are not specified.

Required downstream evidence:

- subscription provider decision or explicit mock strategy;
- checkout callback route contract;
- entitlement activation contract;
- failure/retry/cancel flow.

### GAP-FFD-008 — Free assessment persistence/result flow is incomplete

The architecture allows public result/session state but does not define exact result page, persistence behavior, or transition into onboarding/MMM.

Required downstream evidence:

- public result route or component;
- result state model;
- handoff into subscribe/onboarding;
- explicit rule preventing dead-end to private `/assessment`.

### GAP-FFD-009 — Audit storage is not defined

The audit event contract is defined, but destination/storage, retention, and read access are not.

Required downstream evidence:

- audit storage decision;
- event write mechanism;
- event read/admin access rule;
- retention/change-control rule.

### GAP-FFD-010 — Testing strategy is not yet RED

Stage 6 QA-to-Red has not yet created failing tests for routes, redirects, context, entitlement, free assessment, onboarding, AI, edge functions, schemas, or RLS.

Required downstream evidence:

- QA-to-Red test catalogue;
- route verification tests;
- auth guard tests;
- module card CTA tests;
- onboarding state tests;
- handoff payload tests;
- audit event tests;
- AI boundary tests;
- schema/RLS tests where persistence exists.

### GAP-FFD-011 — CI/build gates are specified but not run

The package has build, lint, and test commands, but no implementation run evidence exists for this wave.

Required downstream evidence:

- build log;
- lint log;
- test log;
- CI run or honest CI-unavailable record.

---

## 4. Independent Conclusion

Stage 5 should stand as an architecture reconciliation milestone.

Do not treat Stage 5 as sufficient for fully functional build delivery.

Stage 6 QA-to-Red must be expanded to include the fully functional delivery gaps above before PBFAG or implementation handover can be recommended.

---

## 5. Disposition

PASS FOR PRE-BUILD PROGRESSION.

FAIL FOR IMPLEMENTATION HANDOVER.

Proceed to Stage 6 QA-to-Red with the gaps above as mandatory coverage inputs.
