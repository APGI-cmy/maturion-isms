# PIT Architecture Addendum - Entry, Signup, Auth and Standalone Journey

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Stage 5 Architecture addendum |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | ADDENDUM - PENDING REVIEW |
| Derived from | App Description, UX, FRS and TRS Slice 2.1 addenda |

---

## 1. Purpose

This addendum defines the architecture direction for integrated and standalone PIT entry, signup/auth, entitlement, onboarding and role journeys.

---

## 2. Architecture principle

PIT may present a standalone branded module entry journey, but identity, entitlement, subscription, role authorization, audit and governance remain Maturion platform capabilities.

The architecture must not create a disconnected PIT-only identity silo.

---

## 3. Journey architecture

### 3.1 Integrated ISMS module mode

```text
ISMS public surface
  -> ISMS module/subscription selection
  -> shared signup/auth
  -> organisation onboarding
  -> ISMS dashboard
  -> PIT runtime
```

### 3.2 Standalone PIT app mode

```text
PIT branded entry surface
  -> shared signup/auth or sign in
  -> PIT-only or bundle entitlement selection
  -> PIT onboarding/workspace setup
  -> PIT runtime
```

---

## 4. Guard stack

Runtime route guards must evaluate in this order:

```text
1. authentication
2. entitlement
3. role / permission
4. page state
```

Expected route outcomes:

| Actor state | Expected outcome |
|---|---|
| Unauthenticated | Sign in / account creation |
| Authenticated, no PIT entitlement | Subscribe / entitlement selection |
| Entitled, unauthorized role | Permission denied |
| Entitled, authorized role | Runtime page |

---

## 5. Host boundary

The PIT deployment host may route users to a PIT-branded entry journey in future.

It must not render a duplicate generic ISMS public landing page.

Allowed:

```text
maturion-pit.vercel.app -> PIT-branded entry under Maturion governance
```

Not allowed:

```text
maturion-pit.vercel.app -> copy of generic ISMS landing page
```

---

## 6. Role architecture foundation

The role/permission architecture must support at least:

- organisation owner / subscriber;
- PIT administrator;
- project manager;
- milestone manager;
- deliverable manager;
- task manager / task owner;
- evidence contributor;
- reviewer / approver;
- viewer;
- auditor / assurance reviewer;
- CS2 / platform super administrator.

Role names may be normalized in implementation, but the architecture must preserve functional separation.

---

## 7. Entitlement architecture foundation

Entitlement evaluation must support:

- PIT-only entitlement;
- full ISMS bundle entitlement;
- future selected-module combinations;
- organisation-level entitlement;
- user-level role authorization within an entitled organisation/workspace.

---

## 8. Audit architecture foundation

Future implementation must support audit/event hooks for:

- account creation;
- sign in;
- entitlement grant/change;
- onboarding completion;
- role assignment/change;
- permission denied events;
- standalone entry journey start;
- integrated entry journey start.

---

## 9. Non-build notice

This architecture addendum does not authorize runtime implementation, database changes, production auth changes, production billing changes or release readiness claims.
