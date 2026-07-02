# PIT UX / Workflow / Wiring Addendum - Entry, Signup, Auth and Standalone Journey

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Stage 2 UX Workflow & Wiring addendum |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | ADDENDUM - PENDING REVIEW |
| Derived from | PIT App Description addendum for Slice 2.1 |

---

## 1. Purpose

This addendum defines the required UX and route wiring for PIT entry, signup, authentication, onboarding and standalone module use.

---

## 2. Entry modes

### 2.1 Integrated ISMS entry

```text
ISMS public landing
  -> module selection or PIT marketing
  -> subscription selection
  -> signup/auth
  -> organisation onboarding
  -> ISMS dashboard
  -> PIT runtime
```

### 2.2 Standalone PIT entry

```text
PIT-branded entry route
  -> signup/auth or sign in
  -> PIT subscription/entitlement selection
  -> PIT-specific onboarding
  -> PIT workspace hub
```

Both modes must use shared Maturion identity and entitlement logic. Entitlement selection may be presented before or after account creation in the commercial UX, but protected PIT runtime access must always evaluate authentication first, then entitlement, then role permission.

---

## 3. Required UX screens / states

Slice 2.1 requires specification coverage for the following screens:

| Screen | Purpose | Required states |
|---|---|---|
| PIT branded entry | Standalone PIT module entry under ISMS umbrella | default, signed-in, signed-out, no entitlement, error |
| Sign in / create account | Shared Maturion account entry | default, validation error, pending, success, failure |
| Subscription/entitlement selection | PIT-only or bundle entitlement choice | default, no selection, pending, success, failure |
| PIT onboarding | PIT-specific organisational/project context capture | default, incomplete, complete, validation error, failure |
| PIT workspace hub | Post-auth/entitled runtime landing | loading, empty, permission denied, error, data |
| Project register | Project workspace foundation | loading, empty, permission denied, error, data |
| Create project | Creator-only intake foundation | loading, permission denied, validation, error, data/foundation |

---

## 4. Route/wiring rules

The following route categories must be defined before implementation:

| Category | Required behavior |
|---|---|
| Public PIT entry | Allows PIT branded entry without pretending to be the generic ISMS landing |
| Sign in / signup | Shared Maturion account model; no PIT-only identity silo |
| Subscribe | Supports PIT-only and bundle entitlement |
| Onboarding | Captures useful PIT-specific context or is combined with account setup |
| Dashboard/hub | Routes entitled users to appropriate module workspace |
| Standalone PIT host | May route to PIT branded entry; must not render duplicate generic ISMS landing |
| Runtime routes | Auth -> entitlement -> role guard order |

---

## 5. Role UX expectations

Role-specific experiences must be designed for:

- project manager;
- milestone manager;
- deliverable manager;
- task manager / task owner;
- evidence contributor;
- reviewer / approver;
- viewer;
- auditor;
- PIT administrator;
- organisation owner;
- CS2/platform administrator.

At minimum, route navigation must not display actions that a user's role cannot perform.

---

## 6. Onboarding rule

The current standalone onboarding page is not sufficient as the long-term entry model.

Before implementation, the product design must decide whether onboarding is:

1. combined with sign-in/account setup;
2. a post-auth organisation setup step;
3. a PIT-specific setup step after PIT-only subscription;
4. a dashboard-managed organisation profile step.

---

## 7. Non-build notice

This addendum defines UX/wiring obligations only. It does not authorize runtime implementation.
