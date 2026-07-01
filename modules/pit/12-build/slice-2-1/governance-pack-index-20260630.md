# PIT Stage 12 Slice 2.1 Governance Pack Index

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Slice | Stage 12 Slice 2.1 - Entry, Signup, Auth and Standalone Journey Specification |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | GOVERNANCE PACK FILED |

---

## 1. Included artifacts

This pack files the following artifacts:

- `modules/pit/12-build/slice-2-1/scope-declaration-20260630.md`
- `modules/pit/00-app-description/slice-2-1-entry-auth-standalone-addendum-20260630.md`
- `modules/pit/01-ux-workflow-wiring-spec/slice-2-1-entry-auth-wiring-addendum-20260630.md`
- `modules/pit/02-frs/slice-2-1-entry-auth-frs-addendum-20260630.md`
- `modules/pit/03-trs/slice-2-1-entry-auth-trs-addendum-20260630.md`
- `modules/pit/04-architecture/slice-2-1-entry-auth-architecture-addendum-20260630.md`
- `modules/pit/06-qa-to-red/slice-2-1-entry-auth-standalone-red-tests-20260630.md`
- `modules/pit/12-build/slice-2-1/traceability-note-20260630.md`
- `modules/pit/12-build/slice-2-1/iaa-prebrief-contract-20260630.md`
- `modules/pit/12-build/slice-2-1/builder-hold-notice-20260630.md`
- `modules/pit/12-build/slice-2-1/evidence-expectations-20260630.md`

---

## 2. Design decision

PIT must support both:

1. integrated ISMS module use; and
2. standalone PIT app use under the Maturion ISMS umbrella.

Standalone PIT use requires signup/auth/account handling, but must remain governed by shared Maturion identity, subscription, entitlement, role and audit controls.

---

## 3. Build status

```text
Specification only.
Runtime implementation not authorized.
```

---

## 4. Next step after merge

After this governance pack is reviewed and merged, open a later implementation-planning slice that derives QA-to-Green from the new RED baseline.
