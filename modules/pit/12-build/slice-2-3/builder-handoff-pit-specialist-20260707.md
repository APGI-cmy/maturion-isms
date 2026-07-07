# PIT Stage 12 Slice 2.3 Builder Handoff - pit-specialist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.3 - Entry Journey Implementation |
| Issue | #1896 |
| Date | 2026-07-07 |
| Foreman status | Delegating implementation to builder |
| Builder | `pit-specialist` |
| Runtime implementation in this commit | Not performed by Foreman |

---

## 1. Purpose

This handoff opens the Slice 2.3 implementation lane and delegates the build to `pit-specialist` under the accepted governance pack merged in PR #1904.

Foreman does not build runtime behavior in this handoff commit.

---

## 2. Accepted control baseline

The builder must use the following accepted controls:

- PR #1888 - Slice 2.1 entry/signup/standalone specification baseline;
- PR #1894 - Slice 2.2 implementation planning and QA-to-Green baseline;
- PR #1897 - Stage 12 tracker/governance update;
- PR #1904 - Slice 2.3 implementation governance pack;
- Issue #1896 - Slice 2.3 implementation issue;
- `modules/pit/06-qa-to-red/slice-2-1-entry-auth-standalone-red-tests-20260630.md`;
- `modules/pit/12-build/slice-2-2/qa-to-green-criteria-20260701.md`;
- `modules/pit/12-build/slice-2-3/scope-declaration-20260702.md`;
- `.agent-admin/assurance/iaa-wave-record-pit-stage12-slice2-3-20260702.md`;
- `modules/pit/12-build/slice-2-3/builder-appointment-delegation-20260702.md`;
- `modules/pit/12-build/slice-2-3/implementation-checklist-20260702.md`;
- `modules/pit/12-build/slice-2-3/evidence-expectations-20260702.md`.

---

## 3. Delegated build scope

`pit-specialist` is delegated to implement only the Slice 2.3 entry journey work:

- PIT-branded standalone entry;
- shared signup or sign-in journey;
- PIT subscription and entitlement selection;
- PIT onboarding or workspace setup;
- authentication before entitlement before role permission ordering;
- PIT-only and full-bundle entitlement behavior;
- role-aware route and navigation outcomes;
- tests, verification notes, and browser evidence mapped to `PIT-RED-ENTRY-001` through `PIT-RED-ENTRY-020`.

---

## 4. Builder constraints

The builder must not:

- expand into unrelated PIT project CRUD work;
- change unrelated MMM, Risk, RADAM or ISMS modules;
- create a duplicate generic ISMS public landing page on the PIT host;
- create a disconnected PIT-only identity silo;
- bypass Maturion shared identity, entitlement, role or host-boundary governance;
- claim full PIT completion;
- claim Stage 12 completion;
- claim production readiness;
- claim release readiness;
- claim functional pass;
- claim handover completion.

---

## 5. Required builder return package

The builder implementation PR must return:

- changed runtime files with implementation notes;
- tests or verification evidence mapped to the accepted RED/GREEN baseline;
- browser evidence for positive and negative entry journey paths;
- disclosure of any mocked, deferred or not-yet-implemented behavior;
- no completion claim beyond Slice 2.3 implementation evidence.

---

## 6. Post-builder sequence

After builder output, Foreman must perform QP review before ECAP or IAA final assurance.

The sequence remains:

```text
pit-specialist builds to green
-> Foreman QP review
-> ECAP administrative evidence
-> IAA final assurance
-> CS2 merge decision
```
