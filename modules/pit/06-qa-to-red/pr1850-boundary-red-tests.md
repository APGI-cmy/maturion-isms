# PIT Stage 6 Addendum — PR #1850 Boundary RED Tests

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 6 - QA-to-Red alignment addendum |
| Status | ACTIVE RED ADDENDUM - ALL TESTS RED UNTIL IMPLEMENTED |
| Date | 2026-06-24 |
| Trigger | Post-PR #1847 production evidence showed canonical ISMS journey still loops back to subscription after mock checkout/onboarding |
| Applies to | `modules/pit/06-qa-to-red/qa-to-red-plan.md`; RED suite catalog and route/role matrices on next full Stage 6 revision |
| Authority consumed | PR #1850 boundary artifacts |

---

## 1. Purpose

This addendum adds boundary/linkup RED tests for the PIT W8.2 correction wave.

These tests are not implementation. They define failing acceptance criteria that must be made green before PIT W8.2 can progress from the current NOT_READY posture.

---

## 2. RED test convention

Boundary tests use the prefix:

```text
PIT-RED-BND
```

They supplement the existing 147-test baseline and must be reconciled into the full RED suite during the next Stage 6 catalog update.

---

## 3. Boundary RED tests

| RED Test ID | Source | Route / Surface | Actor / State | Precondition | Action | Expected RED | Expected GREEN | Evidence |
|---|---|---|---|---|---|---|---|---|
| PIT-RED-BND-001 | PR1850 boundary | ISMS `/` | Non-entitled | Cleared/incognito browser on canonical ISMS host | Click Project Implementation Tracker card | Card routes incorrectly or ambiguous host used | Routes to `/marketing/project-implementation` on canonical ISMS host | Screenshot + URL trace |
| PIT-RED-BND-002 | PR1850 boundary | `/marketing/project-implementation` | Non-entitled | On ISMS marketing page | Click Subscribe / CTA | CTA loops or points to PIT host unexpectedly | Routes to ISMS-owned subscription/checkout path | Screenshot + URL trace |
| PIT-RED-BND-003 | PR1850 boundary | Checkout/auth/onboarding | Mock full-bundle user | Start from canonical ISMS host | Complete mock checkout, sign in, complete baseline | Dashboard says no entitlement | ISMS dashboard shows Project Implementation / full mock bundle entitlement active | Screenshots across journey |
| PIT-RED-BND-004 | PR1850 boundary | ISMS dashboard | Entitled user | Dashboard shows PIT entitlement active | Click PIT / Project Implementation Tracker card | User returns to subscription page | User reaches `/pit/tracker` | Screenshot + URL trace |
| PIT-RED-BND-005 | PR1850 boundary | `/pit/tracker` | Non-entitled | Canonical ISMS host, no entitlement | Direct-load `/pit/tracker` | Ambiguous or broken route behavior | Predictable ISMS subscription/upgrade route | Screenshot + HAR/URL trace |
| PIT-RED-BND-006 | PR1850 boundary | `/pit/tracker` | Entitled | Canonical ISMS host, entitlement visible | Direct-load `/pit/tracker` | Subscription loop or missing runtime shell | PIT runtime shell renders with Project Implementation Tracker title | Screenshot |
| PIT-RED-BND-007 | PR1850 boundary | `maturion-pit.vercel.app` root | Any | Visit PIT host root | Observe public landing behavior | Duplicate ISMS public acquisition journey appears without governed host strategy | Redirect/deep-link/canonical-host behavior matches approved host model | Screenshot + URL trace |
| PIT-RED-BND-008 | PR1850 boundary | `/modules` | Entitled and non-entitled | Canonical ISMS host | Click Project Implementation Tracker card | State/routing differs from `/` card unexpectedly | Non-entitled routes to marketing; entitled routes to `/pit/tracker` | Screenshots + URL trace |
| PIT-RED-BND-009 | PR1850 boundary | Admin routes | project_manager/org_admin/cs2_admin | Entitlement state available where needed | Visit `/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log` | Role boundaries regress | project_manager denied; org_admin and cs2_admin allowed | Role matrix evidence |
| PIT-RED-BND-010 | PR1850 boundary | `/qa-dashboard` | project_manager/org_admin/cs2_admin | Entitlement/auth state available where needed | Visit `/qa-dashboard` | QA route exposes to non-cs2 roles or blocks cs2_admin | Only cs2_admin allowed | Role matrix evidence |

---

## 4. Blocking gate

W8.2 remains NOT_READY while any PIT-RED-BND test is red or unexecuted.

Rendering `/pit/tracker` alone is not sufficient. The canonical ISMS journey must establish entitlement and reach the PIT runtime without looping.

---

## 5. Non-completion notice

This addendum adds RED tests only. It does not implement tests, does not mark any test green, and does not support completion, production readiness, functional pass, RLS final pass, or Stage 12 closure language.
