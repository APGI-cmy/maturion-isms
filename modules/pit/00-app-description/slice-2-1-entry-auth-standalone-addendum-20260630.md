# PIT App Description Addendum - Entry, Signup, Auth and Standalone Journey

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Stage 1 App Description addendum |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | ADDENDUM - PENDING REVIEW |
| Parent authority | `docs/governance/PIT_APP_DESCRIPTION.md` and `modules/pit/00-app-description/app-description.md` |

---

## 1. Purpose

This addendum clarifies the PIT product identity for integrated and standalone use.

The approved PIT App Description defines PIT as the Maturion execution engine for projects, milestones, deliverables, tasks, evidence, accountability and progress. This addendum clarifies that PIT must support both integrated platform use and standalone module use while remaining under the Maturion ISMS umbrella.

---

## 2. Product clarification

PIT must support two valid acquisition and use modes:

### 2.1 Integrated ISMS module mode

The user enters through the Maturion ISMS platform and accesses PIT as one module inside a broader subscription or bundle.

Canonical journey:

```text
ISMS landing -> module selection -> subscription -> signup/auth -> onboarding -> dashboard -> PIT runtime
```

### 2.2 Standalone PIT app mode

The user may choose PIT as a standalone subscribed app without buying the full ISMS bundle.

Canonical journey:

```text
PIT-branded entry -> signup/auth or sign in -> PIT subscription/entitlement -> PIT onboarding -> PIT workspace
```

Standalone PIT remains under Maturion governance, identity, entitlement, audit and subscription control. It is not a separate uncontrolled product.

---

## 3. Identity rule

PIT must use a shared Maturion account model.

A user may be entitled to:

- PIT only;
- PIT plus selected modules;
- full ISMS bundle;
- administrative or CS2-level platform access.

PIT must not create a disconnected identity silo.

---

## 4. Future role model foundation

PIT must accommodate at least these role families:

- subscriber / organisation owner;
- platform or organisation administrator;
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

The exact technical role names may be refined in TRS and Architecture. Functional distinction between these role families is binding.

---

## 5. Boundary rule

A PIT-branded standalone journey is allowed.

A duplicate generic ISMS public landing page on the PIT deployment host is not allowed.

PIT may have a branded entry experience, but it must preserve:

- Maturion umbrella governance;
- shared account model;
- entitlement checks;
- auditability;
- route protection;
- subscription traceability;
- no misleading separation from ISMS governance.

---

## 6. Downstream propagation

This addendum requires updates to:

- UX Workflow & Wiring Spec;
- FRS;
- TRS;
- Architecture;
- QA-to-Red;
- implementation plan / wave definition before any runtime implementation.

---

## 7. Non-build notice

This addendum is not build authorization. It clarifies the upstream App Description intent for Slice 2.1 specification work only.
