# PIT Stage 12 Slice 2 Builder Reconfirmation

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Issue | #1868 |
| Date | 2026-06-30 |
| Builder | `pit-specialist` |
| Status | BUILDER RECONFIRMED FOR SLICE 2 PLANNING - IMPLEMENTATION NOT YET STARTED |

---

## 1. Purpose

This artifact reconfirms the existing PIT Stage 12 builder for Slice 2 planning.

It does not authorize runtime implementation by itself. Implementation may start only after the complete Slice 2 governance pack is merged or accepted and the implementation PR is opened under the declared scope.

---

## 2. Builder appointment basis

The PIT build tracker records Stage 11 as gate-passed and `pit-specialist` as the appointed builder for Stage 12.

Slice 2 remains inside PIT Stage 12 runtime scope and does not require a different builder classification if it stays within the confirmed PIT-only runtime boundaries.

---

## 3. Builder scope for Slice 2

`pit-specialist` may implement, once build starts:

- PIT runtime hub improvements at `/pit/tracker`;
- Project Register foundation at `/projects`;
- Create Project foundation at `/projects/new`;
- PIT-specific navigation and state messaging for those runtime surfaces;
- tests and evidence specific to those routes.

---

## 4. Builder prohibitions

`pit-specialist` may not implement in Slice 2:

- ISMS public landing, module cards, subscription, checkout, auth, onboarding, dashboard, or entitlement handoff changes;
- Supabase schema, RLS, or persistence unless separate data-scope approval exists;
- billing or payment changes;
- PIT host public acquisition behavior;
- non-PIT module runtime behavior;
- full Stage 12 completion or production readiness claims.

---

## 5. Required acknowledgement before implementation PR

The builder implementation PR must acknowledge:

```text
I have read the Slice 2 scope declaration, IAA pre-brief contract, QA-to-Green criteria, and implementation checklist. I will keep implementation within PIT-only runtime scope.
```

---

## 6. Disposition

```text
pit-specialist is reconfirmed as the recommended Slice 2 builder.
Implementation remains pending until the governance pack is accepted.
```
