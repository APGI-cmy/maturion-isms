# PIT Stage 12 Slice 2.2 Scope Declaration

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.2 - Entry, Signup, Auth Implementation Planning |
| Issue | #1891 |
| Date | 2026-07-01 |
| Status | SCOPE DECLARED - PLANNING ONLY |
| Runtime implementation | Not authorized by this artifact |

---

## 1. Purpose

Slice 2.2 prepares the implementation of the merged Slice 2.1 Entry, Signup, Auth and Standalone Journey Specification baseline.

This slice is a planning and control slice. It must translate the Slice 2.1 QA-to-Red baseline into QA-to-Green criteria, builder instructions, implementation controls and evidence expectations.

---

## 2. Governing upstream artifacts

This slice derives from:

- PR #1888 - Slice 2.1 specification baseline;
- Issue #1891 - Slice 2.2 planning issue;
- `modules/pit/06-qa-to-red/slice-2-1-entry-auth-standalone-red-tests-20260630.md`;
- `modules/pit/12-build/slice-2-1/traceability-matrix-20260630.md`;
- App Description, UX, FRS, TRS and Architecture addenda filed under Slice 2.1.

---

## 3. In scope

Slice 2.2 may define planning controls for future implementation of:

- PIT-branded standalone entry under the Maturion ISMS umbrella;
- shared signup/auth or sign-in path;
- PIT subscription/entitlement selection;
- PIT-specific onboarding/workspace setup;
- authentication before entitlement before role guard ordering;
- PIT-only and full-bundle entitlement behavior;
- role-aware route and navigation behavior;
- future browser evidence for PIT-RED-ENTRY-001 through PIT-RED-ENTRY-020.

---

## 4. Out of scope

Slice 2.2 must not implement:

- runtime UI;
- production auth provider integration;
- billing provider integration;
- Supabase schema or RLS;
- production role administration;
- host redirect or host policy changes;
- account invitation runtime;
- project CRUD;
- PIT completion or Stage 12 completion claims.

---

## 5. Deliverables

This planning pack must file:

- scope declaration;
- builder reconfirmation;
- QA-to-Green criteria;
- implementation checklist;
- evidence expectations;
- governance pack index.

---

## 6. Acceptance criteria

Slice 2.2 is accepted only when:

- the builder is reconfirmed for later implementation planning;
- PIT-RED-ENTRY-001 through PIT-RED-ENTRY-020 are mapped to QA-to-Green criteria;
- implementation sequencing is defined;
- evidence expectations are clear;
- no runtime implementation is included;
- non-completion wording is preserved.
