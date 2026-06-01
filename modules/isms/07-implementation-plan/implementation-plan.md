# ISMS Stage 8 — Implementation Plan

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Implementation Plan |
| Stage | Stage 8 |
| Version | v0.1.0 |
| Wave | `isms-stage8-implementation-plan-20260601` |
| Status | COMPLETE — Planning artifact only |

---

## 1. Purpose

This implementation plan turns the approved ISMS pre-build chain into a sequenced build plan.

It authorizes planning only. It does not authorize runtime build execution, implementation handover, production deployment, or builder appointment.

---

## 2. Authority Chain

This plan derives from:

- `modules/isms/00-app-description/ISMS_app_description.md`
- `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`
- `modules/isms/02-frs/functional-requirements.md`
- `modules/isms/03-trs/technical-requirements-specification.md`
- `modules/isms/04-architecture/architecture-reconciliation-stage5.md`
- `modules/isms/04-architecture/architecture-completeness-gap-analysis.md`
- `modules/isms/04-architecture/architecture-remediation-pack.md`
- `modules/isms/05-qa-to-red/qa-to-red-catalog.md`
- `modules/isms/06-pbfag/pre-build-functionality-assessment-gate.md`
- `modules/isms/06-pbfag/pbfag-amendment-architecture-remediation-acceptance.md`

---

## 3. Build Principles

1. Each build wave must deliver fully wired functionality inside its declared scope.
2. No wave may claim completion for future wiring.
3. Each wave must carry RED tests into GREEN evidence for its own scope.
4. Each wave must preserve public/private route boundaries.
5. Each wave must include build/lint/test/CI evidence before handover.
6. Legacy source remains read-only unless explicitly authorized.
7. Implementation transfer remains blocked until Stage 9, Stage 10, Stage 11, and required gate evidence are complete.

---

## 4. Implementation Waves

| Wave | Name | Main Scope | QA Domains |
|---|---|---|---|
| W1 | Route Registry, Public Pages, Redirects | Public shell, route constants, module marketing routes, legacy redirects | D1, D2 |
| W2 | Free Assessment Result Flow | Public assessment, response capture, result state, conversion path | D3 |
| W3 | Subscribe, Checkout Mock, Auth, Onboarding | Subscription selection, checkout transition, auth entry, onboarding shell | D4 |
| W4 | Shared Context, Entitlement, MMM Handoff | ISMS context provider, entitlement checks, protected module entry | D5 |
| W5 | Ask Maturion Adapter | Safe public/private AI adapter and prompt seed wiring | D6 |
| W6 | Backend Boundary, Persistence, Schema/RLS, Audit | Edge/backend registry, no-function/use decisions, Supabase schema, RLS, hooks, audit writer, env alignment | D7, D8, D9 |
| W7 | Deployment, Runtime, Env, CI Hardening | Deployment target, SPA fallback, env validation, CI evidence | D10 |
| W8 | Cumulative Regression and PBFAG Rerun | Full regression, architecture completeness update, PBFAG rerun | D11 + all prior |

---

## 5. Wave Detail

### W1 — Route Registry, Public Pages, Redirects

Likely files:

- `apps/isms-portal/src/App.tsx`
- `apps/isms-portal/src/lib/routes.ts`
- `apps/isms-portal/src/lib/moduleCards.ts`
- `apps/isms-portal/src/pages/Index.tsx`
- `apps/isms-portal/src/pages/ModulesOverview.tsx`
- `apps/isms-portal/src/pages/Journey.tsx`
- `apps/isms-portal/src/pages/marketing/*`

Outcomes:

- public routes render without authentication;
- private route placeholders are protected;
- legacy marketing routes redirect to canonical `/marketing/*` pages;
- module cards route only to public marketing pages.

Evidence:

- route verification results;
- build/lint/test logs;
- PR CI green.

### W2 — Free Assessment Result Flow

Likely files:

- `apps/isms-portal/src/pages/FreeAssessment.tsx`
- `apps/isms-portal/src/lib/freeAssessment.ts`
- `apps/isms-portal/src/context/AssessmentContext.tsx` or equivalent

Outcomes:

- public assessment works without authentication;
- user can answer high-level questions;
- indicative baseline is produced;
- result routes to subscribe/auth/onboarding path;
- no public result dead-ends into private `/assessment`.

Evidence:

- assessment flow evidence;
- result-state evidence;
- build/lint/test logs;
- PR CI green.

### W3 — Subscribe, Checkout Mock, Auth, Onboarding

Likely files:

- `apps/isms-portal/src/pages/Subscribe.tsx`
- `apps/isms-portal/src/pages/SubscribeCheckout.tsx`
- `apps/isms-portal/src/pages/Auth.tsx`
- `apps/isms-portal/src/pages/Onboarding.tsx`
- `apps/isms-portal/src/lib/subscription.ts`

Outcomes:

- subscribe accepts optional source context;
- checkout mock success routes unauthenticated users to `/auth`;
- authenticated checkout success routes to `/onboarding`;
- onboarding captures required context;
- onboarding completion routes to dashboard or preferred module placeholder.

Evidence:

- transition path verification;
- onboarding validation evidence;
- build/lint/test logs;
- PR CI green.

### W4 — Shared Context, Entitlement, MMM Handoff

Likely files:

- `apps/isms-portal/src/context/IsmsContext.tsx`
- `apps/isms-portal/src/lib/entitlements.ts`
- `apps/isms-portal/src/lib/handoff.ts`
- `apps/isms-portal/src/pages/Dashboard.tsx`
- `apps/isms-portal/src/pages/MaturitySetup.tsx`

Outcomes:

- shared context provider exists;
- entitlement checks control private module access;
- unsubscribed modules route to explanation/upgrade;
- subscribed MMM routes to `/maturity/setup` with handoff payload;
- future module private routes are reserved/protected.

Evidence:

- context/handoff evidence;
- protected route evidence;
- build/lint/test logs;
- PR CI green.

### W5 — Ask Maturion Adapter

Likely files:

- `apps/isms-portal/src/lib/askMaturionAdapter.ts`
- `apps/isms-portal/src/components/AskMaturionButton.tsx`
- `apps/isms-portal/src/lib/aiPromptSeeds.ts`

Outcomes:

- public prompts are educational only;
- authenticated prompts use filtered context;
- AI cannot bypass entitlements or route guards;
- AI failure has non-blocking fallback;
- module cards have prompt seeds or explicit deferred markers.

Evidence:

- adapter contract evidence;
- fallback evidence;
- build/lint/test logs;
- PR CI green.

### W6 — Backend Boundary, Persistence, Schema/RLS, Audit

Likely files:

- `modules/isms/04-architecture/edge-function-registry.md` or equivalent amendment to architecture remediation artifacts
- `supabase/migrations/*`
- `apps/isms-portal/src/lib/supabase/*`
- `apps/isms-portal/src/hooks/*`
- `apps/isms-portal/src/lib/audit.ts`
- `.env.example`

Outcomes:

- D7 backend-boundary RED tests are owned by this wave;
- edge function registry exists or explicit no-edge-function decision is recorded;
- any edge/backend invocation has caller, input, output, auth, error, and deploy-status mapping;
- schemas exist for required persisted objects or explicit no-persistence waiver exists;
- RLS policies exist for tenant-scoped tables;
- schema-to-hook matrix passes;
- audit writer exists or explicit non-production stub is marked;
- `.env.example` matches env registry.

Evidence:

- edge/backend registry evidence;
- no-unregistered-function-invocation evidence;
- migration evidence;
- RLS evidence;
- schema-to-hook evidence;
- build/lint/test logs;
- PR CI green.

### W7 — Deployment, Runtime, Env, CI Hardening

Likely files:

- deployment config files once provider is selected;
- `.env.example`;
- CI workflow updates if required;
- `apps/isms-portal/package.json` if scripts need alignment.

Outcomes:

- deployment target selected;
- SPA fallback documented/configured;
- env validation exists;
- build/lint/test commands pass;
- route verification checks exist;
- rollback/redeploy strategy documented.

Evidence:

- CI logs;
- deployment preview evidence if applicable;
- build/lint/test logs;
- route verification evidence.

### W8 — Cumulative Regression and PBFAG Rerun

Outcomes:

- all prior wave QA is green;
- architecture completeness is green or waived item-by-item;
- PBFAG is rerun or amended;
- Stage 9 Builder Checklist can be finalized;
- implementation transfer remains subject to Stage 10/11/12 gates.

Evidence:

- cumulative QA report;
- CI green;
- PBFAG rerun/amendment.

---

## 6. Dependency Order

```text
W1 -> W2 -> W3 -> W4 -> W5 -> W6 -> W7 -> W8
```

W6 may not begin production persistence work until backend-boundary, schema, and RLS decisions are approved.

W7 may not finalize production deployment until provider and environment decisions are approved.

---

## 7. Handover Rules

Each implementation wave must produce:

- scope declaration;
- builder appointment for that wave;
- QA-to-Green evidence for mapped RED tests;
- build/lint/test logs;
- CI status inspection;
- Foreman QP;
- ECAP where accepted by repository gates;
- IAA wave record/token;
- PR review resolution;
- merge only after required gates pass.

---

## 8. Stage 8 Disposition

This implementation plan is sufficient to proceed to Stage 9 Builder Checklist after PR approval and CI pass.

It does not authorize implementation execution.
