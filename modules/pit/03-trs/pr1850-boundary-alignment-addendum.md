# PIT Stage 4 Addendum — PR #1850 Boundary Alignment

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 4 - Technical Requirements Specification alignment addendum |
| Status | ACTIVE PRE-BUILD ALIGNMENT ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; W8.2 needs canonical host, entitlement, and route-boundary technical constraints |
| Applies to | `modules/pit/03-trs/technical-requirements-specification.md` |
| Authority consumed | `modules/pit/04-architecture/platform-module-boundary-linkup-strategy.md`; `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |

---

## 1. Purpose

This addendum aligns the PIT TRS with the PR #1850 ISMS/module boundary strategy.

It defines technical requirements for future PIT linkup correction work. It does not implement them.

---

## 2. Boundary technical requirements

### PIT-TR-BND-001 — Canonical host validation

PIT deployed evidence for public-to-runtime handoff shall identify the host under test.

For W8.2 correction evidence, the canonical host is:

```text
https://maturion-isms-portal.vercel.app
```

Evidence captured only on `https://maturion-pit.vercel.app` shall not prove canonical ISMS journey continuity unless a governed host strategy says otherwise.

### PIT-TR-BND-002 — Origin-aware state rule

The implementation and test design shall account for browser-origin scoping of local storage, session storage, and cookies.

No PIT test may treat entitlement state on `maturion-pit.vercel.app` as equivalent to entitlement state on `maturion-isms-portal.vercel.app` unless a governed cross-origin state mechanism exists.

### PIT-TR-BND-003 — Entitlement source of truth

The PIT runtime route shall consume the ISMS shared entitlement result for `project-implementation`.

PIT shall not introduce a separate entitlement persistence mechanism for W8.2 correction work.

### PIT-TR-BND-004 — Route guard ordering

For `/pit/tracker`, entitlement and authentication checks must produce predictable outcomes:

- non-entitled users route to ISMS-owned subscription/upgrade path;
- authenticated and entitled users render the PIT runtime shell;
- unauthenticated users must be handled consistently with the ISMS auth contract without losing intended destination where supported.

### PIT-TR-BND-005 — Module host policy

Any PIT-specific host must be governed as one of:

- redirect-only module host;
- deep-link-only module host;
- canonical-host-only integrated shell;
- later approved standalone-runtime host.

A PIT host must not accidentally expose a duplicate ISMS public acquisition journey.

### PIT-TR-BND-006 — Cross-module code-change restriction

A PIT implementation PR shall not modify ISMS-owned public landing, modules overview, subscription, checkout, auth, onboarding, or dashboard logic unless the PR is explicitly classified as cross-module and the builder appointment includes that scope.

### PIT-TR-BND-007 — Evidence instrumentation

W8.2 correction evidence shall capture:

- host and URL at each step;
- entitlement state shown by ISMS dashboard;
- route transition from dashboard/card to `/pit/tracker`;
- non-entitled direct-route behavior;
- entitled direct-route behavior;
- role-aware admin/QA route behavior after entitlement handoff.

---

## 3. Technical acceptance interpretation

Route registration, page rendering, and green CI are insufficient for this linkup defect.

Technical acceptance requires proving that the canonical ISMS host can establish and preserve entitlement through checkout/auth/onboarding/dashboard into the PIT runtime route.

---

## 4. Non-completion notice

This addendum defines technical constraints only. It does not create implementation, migrations, tests, deployment configuration, or production readiness evidence.
