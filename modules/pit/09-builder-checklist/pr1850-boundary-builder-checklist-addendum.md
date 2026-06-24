# PIT Stage 9 Addendum — PR #1850 Boundary Builder Checklist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 9 - Builder Checklist alignment addendum |
| Status | ACTIVE BUILDER CHECKLIST ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; W8.2 correction requires agent/build scope boundary before implementation |
| Applies to | `modules/pit/09-builder-checklist/builder-checklist.md` |
| Authority consumed | PR #1850 boundary artifacts; PIT boundary RED tests; PIT boundary correction plan |

---

## 1. Purpose

This addendum defines additional builder acknowledgements required before any future PIT W8.2 correction builder is appointed.

It does not appoint a builder and does not authorize implementation.

---

## 2. Mandatory builder acknowledgements

Before appointment, the builder must acknowledge:

- [ ] I have read `modules/pit/04-architecture/platform-module-boundary-linkup-strategy.md`.
- [ ] I have read `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`.
- [ ] I understand that ISMS owns public landing, `/modules`, marketing, subscription, checkout, auth, onboarding, dashboard, and entitlement summary surfaces.
- [ ] I understand that PIT owns runtime surfaces only after the ISMS handoff, including `/pit/tracker` and PIT-scoped admin/QA behavior.
- [ ] I will not modify ISMS-owned public/subscription/auth/onboarding/dashboard behavior unless the appointment explicitly classifies the work as cross-module.
- [ ] I will not use `maturion-pit.vercel.app` local storage as proof of canonical ISMS entitlement continuity.
- [ ] I will make the PIT boundary RED tests green only through the scope assigned in the builder appointment.
- [ ] I will preserve role-aware admin/QA route behavior while correcting entitlement/linkup behavior.
- [ ] I will not claim W8.2 completion, Stage 12 completion, production readiness, functional pass, or RLS final pass.

---

## 3. Builder scope decision required

The builder appointment must explicitly state one of:

```text
PIT-only correction appointment
```

or

```text
Cross-module ISMS/PIT correction appointment
```

A PIT-only correction appointment cannot include changes to ISMS-owned public acquisition, checkout, auth, onboarding, dashboard, or entitlement persistence logic.

---

## 4. Required evidence acknowledgement

The builder must understand that post-build evidence must be captured on the canonical ISMS host and must include the complete journey into `/pit/tracker` without a subscription loop.

---

## 5. Non-completion notice

This checklist addendum is pre-build readiness only. It does not appoint a builder or authorize build execution.
