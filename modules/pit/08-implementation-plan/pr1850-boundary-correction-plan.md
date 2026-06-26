# PIT Stage 8 Addendum — PR #1850 Boundary Correction Plan

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 8 - Implementation Plan alignment addendum |
| Status | ACTIVE PRE-BUILD PLANNING ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; post-PR #1847 W8.2 evidence failed on canonical navigation/entitlement loop |
| Applies to | `modules/pit/08-implementation-plan/implementation-plan.md` |
| Authority consumed | PR #1850 boundary artifacts; PIT boundary RED tests |

---

## 1. Purpose

This addendum aligns the PIT implementation plan with the PR #1850 boundary strategy.

It defines the correction planning sequence before build-to-green work. It does not implement the correction and does not appoint a builder.

---

## 2. Correction classification

The observed W8.2 defect spans the ISMS/PIT boundary:

- ISMS owns public landing, modules overview, marketing, subscription, auth, onboarding, dashboard, and entitlement summary.
- PIT owns `/pit/tracker` runtime and PIT admin/QA route behavior after handoff.

Therefore the implementation plan must classify any future correction as either:

1. **PIT-only**: only PIT runtime guards, PIT runtime shell, or PIT route behavior changes are needed; or
2. **Cross-module**: ISMS-owned cards, checkout, onboarding, dashboard entitlement state, subscription logic, auth, or host canonicalization must change.

A PIT-only builder must not perform cross-module work.

---

## 3. Required pre-build sequence before correction build

```text
PR #1850 boundary artifacts adopted
  -> PIT pre-build alignment addenda filed
  -> ISMS pre-build alignment completed by ISMS agent
  -> PIT/ISMS defect scope classified as PIT-only or cross-module
  -> QA-to-red boundary tests confirmed red
  -> Builder appointment issued for the correct scope
  -> Build to green
  -> Production evidence captured on canonical ISMS host
```

---

## 4. W8.2 correction work packages

| Work package | Owner classification | Notes |
|---|---|---|
| Host policy decision for `maturion-pit.vercel.app` | Cross-module / deployment governance | Decide redirect-only, deep-link-only, canonical-host-only, or standalone-runtime |
| ISMS dashboard entitlement persistence after mock checkout/onboarding | ISMS or cross-module | PIT cannot own this alone |
| PIT runtime route entitlement guard | PIT if guard only; cross-module if shared context changes | Must consume ISMS entitlement result |
| Public landing and `/modules` card behavior | ISMS | PIT supplies descriptor only |
| `/marketing/project-implementation` subscription CTA behavior | ISMS | PIT supplies descriptor/content only |
| Role-aware PIT admin/QA route checks | PIT | Must be retested after entitlement handoff |
| Production evidence pack | Foreman/QP with builder evidence input | Canonical ISMS host required |

---

## 5. Evidence required before W8.2 progression

Future build-to-green evidence must include:

1. canonical ISMS host full journey screenshots;
2. URL trace from public card to marketing to subscription/auth/onboarding/dashboard to `/pit/tracker`;
3. dashboard entitlement visible before clicking PIT;
4. non-entitled direct `/pit/tracker` redirect behavior;
5. entitled direct `/pit/tracker` shell render;
6. role-aware admin and QA matrix after entitlement handoff;
7. PIT host root behavior matching approved host policy;
8. no Supabase/billing fixture regressions;
9. QP/final evidence disposition without completion overclaim.

---

## 6. Non-completion notice

This plan addendum does not authorize implementation, does not appoint a builder, does not make RED tests green, and does not support W8.2 completion or Stage 12 completion language.
