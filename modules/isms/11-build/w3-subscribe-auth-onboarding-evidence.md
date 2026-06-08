# ISMS W3 Build Evidence — Subscribe, Checkout Mock, Auth, Onboarding

| Field | Value |
|---|---|
| Wave | W3 — Subscribe, Checkout Mock, Auth, Onboarding |
| Branch | `foreman/isms-w3-subscribe-auth-onboarding` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-08 |

---

## Scope delivered

Runtime scope:

- `apps/isms-portal/src/lib/subscription.ts`
- `apps/isms-portal/src/context/AuthContext.tsx`
- `apps/isms-portal/src/components/auth/LoginForm.tsx`
- `apps/isms-portal/src/pages/Onboarding.tsx`
- `apps/isms-portal/src/App.tsx`
- `apps/isms-portal/src/components/checkout/CheckoutForm.tsx`
- `apps/isms-portal/src/components/checkout/EFTPaymentSection.tsx`
- `apps/isms-portal/src/pages/SubscribeCheckout.tsx`

Governance scope:

- `.agent-admin/builder-appointments/isms-stage11-w3-subscribe-auth-onboarding-builder-appointment.md`
- `modules/isms/11-build/w3-subscribe-auth-onboarding-evidence.md`

---

## User journey

The W3 journey supports:

1. public subscription selection;
2. checkout mock with card or EFT mock completion;
3. pending checkout context persisted locally;
4. unauthenticated mock checkout completion routes to `/auth` and then `/onboarding`;
5. authenticated mock checkout completion routes directly to `/onboarding`;
6. onboarding captures required organisation context;
7. onboarding completion stores local onboarding profile and routes toward protected dashboard placeholder.

---

## D4 QA mapping

| Requirement | Evidence |
|---|---|
| W3-001 Subscribe page with package options | Existing Subscribe page preserved. |
| W3-002 Optional source journey context | Subscription helper preserves `source` in selection/search helpers. |
| W3-003 Checkout mock or provider placeholder | Card/EFT checkout components explicitly state W3 non-production mock status. |
| W3-004 Unauthenticated checkout success to auth | `SubscribeCheckout` routes unauthenticated completion to `ROUTES.AUTH` with `from: ROUTES.ONBOARDING`. |
| W3-005 Authenticated checkout success to onboarding | `SubscribeCheckout` routes authenticated completion to `ROUTES.ONBOARDING`. |
| W3-006 Onboarding shell and required fields | `Onboarding.tsx` captures organisation, sector, primary goal and responsible person. |
| W3-007 Required onboarding field validation | Submit disabled until `isOnboardingProfileComplete` passes. |
| W3-008 D4 RED mapping | This section maps W3 work to D4. |
| W3-009 Evidence | CI/review/build/lint/test evidence remains pending PR checks. |

---

## Known partials

- Authentication is a local mock only.
- Checkout is a non-production mock only.
- Onboarding profile is stored in local storage only.
- No entitlement, paid subscription, private MMM handoff, backend persistence, RLS, audit writer or production auth/payment provider is introduced.
- W4-W8 remain unappointed and unauthorized.

---

## Non-scope confirmation

W3 does not implement W4 entitlement/MMM handoff, W5 Ask Maturion, W6 backend/persistence/RLS/audit, W7 deployment hardening, or W8 cumulative regression/PBFAG rerun.

---

## Evidence still required before merge

- Build/lint/test results or CI equivalents.
- CI status inspection.
- PR-scoped functional-delivery evidence.
- IAA prebrief/wave record.
- Review conversation disposition.
