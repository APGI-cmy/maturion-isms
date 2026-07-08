# PIT Stage 12 Slice 2.3 Builder Handoff - pit-specialist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.3 - Entry Journey Implementation |
| Issue | #1896 |
| Date | 2026-07-07 |
| Status | BUILDER HANDOFF FILED |
| Appointed builder | `pit-specialist` |
| Runtime implementation | Delegated to builder; not performed by Foreman |

---

## 1. Purpose

This handoff opens the Slice 2.3 implementation lane and delegates the build to `pit-specialist` under the accepted governance pack merged in PR #1904.

---

## 2. Accepted control baseline

The builder must use PR #1888, PR #1894, PR #1897, PR #1904, Issue #1896, the Slice 2.1 QA-to-Red artifact, the Slice 2.2 QA-to-Green artifact, and the merged Slice 2.3 governance pack.

---

## 3. Delegated build scope

`pit-specialist` is delegated to implement only the Slice 2.3 entry journey work: PIT entry, signup or sign-in journey, PIT access selection, onboarding or workspace setup, guard ordering, role-aware navigation, and evidence mapped to `PIT-RED-ENTRY-001` through `PIT-RED-ENTRY-020`.

---

## 4. Builder constraints

The builder must keep the work inside Slice 2.3, preserve the Maturion shared identity and access model, and avoid any full PIT, Stage 12, production, release, functional-pass, or handover completion claim.

---

## 5. Required builder return package

The builder implementation PR must return changed runtime files, verification evidence, browser evidence expectations, disclosure of deferred behavior, and no completion claim beyond Slice 2.3 implementation evidence.

---

## 6. Post-builder sequence

```text
pit-specialist builds to green
-> Foreman QP review
-> ECAP administrative evidence
-> IAA final assurance
-> CS2 merge decision
```
