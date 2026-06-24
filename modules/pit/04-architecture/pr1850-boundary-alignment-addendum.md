# PIT Stage 5 Addendum — PR #1850 Boundary Alignment

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 5 - Architecture alignment addendum |
| Status | ACTIVE PRE-BUILD ALIGNMENT ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; PIT integrated-shell deployment must not become duplicate ISMS public front door |
| Applies to | `modules/pit/04-architecture/architecture.md`; `modules/pit/04-architecture/platform-module-boundary-linkup-strategy.md` |
| Authority consumed | `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |

---

## 1. Purpose

This addendum aligns PIT architecture with the PR #1850 boundary strategy.

The existing PIT architecture remains the runtime architecture authority for PIT-owned module surfaces. This addendum constrains host, shell, route, and entitlement assumptions for linkup work.

---

## 2. Architectural boundary decision

PIT architecture must distinguish three surfaces:

| Surface | Architectural owner | Notes |
|---|---|---|
| ISMS public/platform shell | ISMS | Landing, modules, marketing, subscription, auth, onboarding, dashboard |
| Shared shell context | ISMS shared platform | Identity, role, entitlement, org context, dashboard card state |
| PIT runtime | PIT | `/pit/tracker`, PIT project/work/admin/QA runtime behavior where scoped |

PIT is currently hosted through an integrated shell. Integrated shell means PIT can render inside the ISMS portal package. It does not mean PIT owns the ISMS public shell.

---

## 3. Host-mode architecture

For W8.2 correction design, the PIT host must be classified before implementation as one of:

1. redirect-only module host;
2. deep-link-only module host;
3. canonical-host-only integrated shell;
4. approved standalone-runtime host with governed cross-origin state.

Until that classification is implemented and verified, production evidence must use the canonical ISMS host for public-to-runtime journey proof.

---

## 4. Runtime entry architecture

The PIT runtime entry route is:

```text
/pit/tracker
```

The runtime entry architecture must consume:

- authenticated user from shared auth context;
- `project-implementation` entitlement from shared ISMS entitlement context;
- role information from shared role context;
- org/tenant context from shared platform context where applicable.

PIT must not fork these contexts for W8.2 correction.

---

## 5. Architecture acceptance implications

A build is architecturally incomplete if any of these remain true:

- PIT host exposes a duplicate public acquisition journey by accident;
- entitlement works only on the PIT host but not on the canonical ISMS host;
- checkout/auth/onboarding does not produce a visible Project Implementation entitlement on the ISMS dashboard;
- entitled dashboard/card navigation sends users back to subscription;
- `/pit/tracker` renders in isolation but cannot be reached from the canonical ISMS journey;
- PIT implementation modifies ISMS-owned shell behavior without cross-module governance.

---

## 6. Non-completion notice

This addendum is architectural alignment only. It does not implement redirects, guards, shared context, or deployment policy. It does not close W8.2 or Stage 12.
