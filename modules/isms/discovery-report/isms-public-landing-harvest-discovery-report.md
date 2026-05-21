# ISMS Public Landing — Harvest Discovery Report

**Issue:** #1727  
**PR:** #1728  
**Author:** mat-specialist (delegated by Foreman)  
**Date:** 2026-05-21  
**Status:** DISCOVERY COMPLETE — READY FOR PRE-BUILD WORKLIST EXECUTION  
**Scope:** Public landing, marketing pages, free assessment, subscribe, auth, onboarding, MMM handoff, PIT placeholder

---

## Executive Summary

This report captures the full discovery findings for the ISMS Public Landing harvest. The ISMS portal (`apps/isms-portal`) is the **top-level platform entry point** — it owns all user-facing public pages, marketing content, and the pre-subscription funnel. MMM (Maturion Maturity Module) and PIT (Project Implementation Tracking) are downstream modules that ISMS hands off to _after_ onboarding.

**Harvest Status at time of discovery:**
- ✅ All 7 required marketing info pages are present in `isms-portal` (6 harvested from legacy + 1 newly created, with route canonicalisation applied)
- ✅ Legacy redirect shims are in place in `isms-portal/src/App.tsx`
- ✅ `MaturityRoadmapInfo.tsx` is newly created — no legacy equivalent
- ⚠️ Auth boundary bug in legacy has been **correctly NOT carried forward** — portal has all marketing pages as fully public
- ❌ Onboarding route (`/onboarding`) is missing from `isms-portal`
- ❌ MMM handoff route/contract is undefined
- ❌ `PIT_ENTRY` constant (`/pit`) not yet reserved in `routes.ts` — public PIT marketing stub (`/marketing/project-implementation`) is already present
- ❌ Dashboard is a stub (inline JSX placeholder, no real component)
- ❌ `MATURITY_SETUP` constant exists in `routes.ts` but has no wired route in `App.tsx`

---

## A. Legacy File Inventory

**Source:** `apps/maturion-maturity-legacy/src/`

### A.1 Public-Scope Pages (relevant to ISMS Landing harvest)

| # | File | Legacy Route | Legacy Auth | Purpose |
|---|------|-------------|-------------|---------|
| 1 | `pages/Index.tsx` | `/` | Public | Platform landing page |
| 2 | `pages/FreeAssessment.tsx` | `/free-assessment` | **ProtectedRoute** ⚠️ | Free 15-min maturity assessment landing |
| 3 | `pages/Subscribe.tsx` | `/subscribe` | Public | Subscription/pricing page |
| 4 | `pages/SubscribeCheckout.tsx` | `/subscribe/checkout` | Public | Checkout / payment flow |
| 5 | `pages/Journey.tsx` | `/journey` | **ProtectedRoute** ⚠️ | Maturity journey walkthrough (6-domain hexagon) |
| 6 | `pages/ModulesOverview.tsx` | `/modules` | Not wired in legacy App.tsx | Module catalogue |
| 7 | `pages/RiskManagementInfo.tsx` | `/risk-management-info` | **ProtectedRoute** ⚠️ | Marketing: Risk Management module |
| 8 | `pages/PITInfo.tsx` | `/pit-info` | **ProtectedRoute** ⚠️ | Marketing: PIT module |
| 9 | `pages/DataAnalyticsInfo.tsx` | `/data-analytics-info` | **ProtectedRoute** ⚠️ | Marketing: Data Analytics & Assurance |
| 10 | `pages/DataExtractionInfo.tsx` | `/data-extraction-info` | **ProtectedRoute** ⚠️ | Marketing: Systems Integration |
| 11 | `pages/SkillsDevelopmentInfo.tsx` | `/skills-development-info` | **ProtectedRoute** ⚠️ | Marketing: Skills Development |
| 12 | `pages/IncidentManagementInfo.tsx` | `/incident-management-info` | **ProtectedRoute** ⚠️ | Marketing: Incident Intelligence Hub |
| 13 | `pages/NotFound.tsx` | `*` catch-all | Public | 404 page |

> **Auth anomaly note:** In legacy, routes 2, 5, 7–12 are wrapped in `<ProtectedRoute><AppLayout>…</AppLayout></ProtectedRoute>`. This is architecturally incorrect — marketing/exploration pages should never require authentication. These pages are pre-subscription content intended to help unauthenticated visitors decide whether to subscribe. The ISMS portal has **correctly removed** the ProtectedRoute wrapper for all of these.

### A.2 Backend / Admin / MMM Pages (scoped OUT of ISMS landing harvest)

| # | File | Legacy Route | Notes |
|---|------|-------------|-------|
| 14 | `pages/Dashboard.tsx` | `/dashboard` | Full MMM dashboard — deferred to MMM module |
| 15 | `pages/Assessment.tsx` | `/assessment` | Live assessment execution — deferred to MMM |
| 16 | `pages/AssessmentFramework.tsx` | `/assessment-framework` | Framework config — MMM |
| 17 | `pages/AuditStructureConfig.tsx` | `/assessment/framework` | Audit structure — MMM |
| 18 | `pages/DomainAuditBuilder.tsx` | `/audit/domain/:domainId` | Domain audit — MMM |
| 19 | `pages/MaturitySetup.tsx` | `/maturity/setup` | Onboarding/setup wizard — MMM handoff target |
| 20 | `pages/QASignOff.tsx` / `QASignOffDynamic.tsx` | `/qa-signoff` | QA workflow — MMM |
| 21 | `pages/TeamPage.tsx` | `/team` | Team management — post-subscription |
| 22 | `pages/OrganizationSettings.tsx` | `/organization/settings` | Org settings — post-subscription |
| 23 | `pages/MilestoneDetail.tsx` | `/milestones/:id` | Milestone detail — MMM |
| 24 | `pages/MaturionKnowledgeBase.tsx` | `/maturion/knowledge-base` | AI KB — post-subscription |
| 25 | `pages/MaturionUploads.tsx` | `/maturion/uploads` | Uploads — post-subscription |
| 26 | `pages/InvitationAcceptance.tsx` | `/accept-invitation` | Invitation flow — post-subscription |
| 27 | `pages/AdminConfig.tsx` | `/admin/config` | Admin — discard from ISMS landing |
| 28 | `pages/AdminHealthChecker.tsx` | `/admin/health-checker` | Admin — discard |
| 29 | `pages/AdminWorkflowDashboard.tsx` | `/admin/workflow` | Admin — discard |
| 30 | `pages/AdminSecurityDashboard.tsx` | (unrouted) | Admin — discard |
| 31 | `pages/UserFieldMatrix.tsx` | `/admin/user-matrix` | Admin — discard |
| 32 | `pages/QADashboard.tsx` / `UnifiedQADashboard.tsx` / `QATestDashboard.tsx` | `/qa-dashboard` | QA tooling — discard |
| 33 | `pages/WatchdogDashboard.tsx` | `/watchdog` | Monitoring — discard |
| 34 | `pages/DataSourcesManagement.tsx` | `/data-sources` | Data mgmt — discard |
| 35 | `pages/TestSuite.tsx` | `/test-suite` | Dev tooling — discard |
| 36 | `pages/ProcessIntegrityAuditBuilder.tsx` | (unrouted) | MMM — defer |
| 37 | `pages/ProtectionAuditBuilder.tsx` | (unrouted) | MMM — defer |

### A.3 Legacy Route Constants (`apps/maturion-maturity-legacy/src/lib/routes.ts`)

The legacy `ROUTES` object contains:
- Core navigation: `HOME`, `MODULES`, `DASHBOARD`
- Maturity: `MATURITY_SETUP` (`/maturity/setup`), `MATURITY_BUILD_LEGACY` (`/maturity/build`)
- Assessment: `FREE_ASSESSMENT` (`/free-assessment`), `ASSESSMENT`, `ASSESSMENT_FRAMEWORK`
- Module info: `RISK_MANAGEMENT_INFO`, `PIT_INFO`, `DATA_ANALYTICS_INFO`, `SKILLS_DEVELOPMENT_INFO`, `INCIDENT_MANAGEMENT_INFO`, `DATA_EXTRACTION_INFO` — all using old flat paths with no `/marketing/` prefix
- Auth/subscription: `JOURNEY`, `SUBSCRIBE`, `SUBSCRIBE_CHECKOUT`, `AUTH`, `INVITATION_ACCEPTANCE`

**Notable absences:**
- ❌ No `MARKETING_*` constants — the `/marketing/` prefix namespace is entirely absent
- ❌ No `MARKETING_MATURITY_ROADMAP` — this route does not exist in legacy at all
- ❌ No onboarding route constant
- ❌ No MMM handoff constant

---

## B. Current isms-portal Inventory

**Source:** `apps/isms-portal/src/`

### B.1 Page Files Present

| # | File | Portal Route | Auth | Notes |
|---|------|-------------|------|-------|
| 1 | `pages/Index.tsx` | `/` | Public | Full ISMS landing — hero, module grid, 6-domain grid, CTAs |
| 2 | `pages/FreeAssessment.tsx` | `/free-assessment` | Public ✅ | Pre-subscription free assessment (auth wall removed) |
| 3 | `pages/Subscribe.tsx` | `/subscribe` | Public | Subscription/pricing page with assessment result display |
| 4 | `pages/SubscribeCheckout.tsx` | `/subscribe/checkout` | Public | Checkout with card and EFT payment options |
| 5 | `pages/Journey.tsx` | `/journey` | Public ✅ | Maturity journey walkthrough (auth wall removed) |
| 6 | `pages/ModulesOverview.tsx` | `/modules` | Public | Module catalogue (uses `ROUTES.*` constants, no hardcoded paths) |
| 7 | `pages/RiskManagementInfo.tsx` | `/marketing/risk-management` | Public ✅ | Marketing info (legacy: `/risk-management-info`, auth wall removed) |
| 8 | `pages/PITInfo.tsx` | `/marketing/project-implementation` | Public ✅ | Marketing info (legacy: `/pit-info`, auth wall removed) |
| 9 | `pages/DataAnalyticsInfo.tsx` | `/marketing/data-analytics-assurance` | Public ✅ | Marketing info (legacy: `/data-analytics-info`, auth wall removed) |
| 10 | `pages/DataExtractionInfo.tsx` | `/marketing/systems-integration` | Public ✅ | Marketing info (legacy: `/data-extraction-info`, auth wall removed) |
| 11 | `pages/SkillsDevelopmentInfo.tsx` | `/marketing/skills-development` | Public ✅ | Marketing info (legacy: `/skills-development-info`, auth wall removed) |
| 12 | `pages/IncidentManagementInfo.tsx` | `/marketing/incident-intelligence` | Public ✅ | Marketing info (legacy: `/incident-management-info`, auth wall removed) |
| 13 | `pages/MaturityRoadmapInfo.tsx` | `/marketing/maturity-roadmap` | Public | **NEW** — no legacy equivalent; well-formed stub with features/benefits/CTAs |
| 14 | `pages/NotFound.tsx` | `*` catch-all | Public | 404 page |

### B.2 Dashboard (Stub)

| Route | Auth | Implementation |
|-------|------|---------------|
| `/dashboard` | ProtectedRoute ✅ | **Inline JSX stub** — renders `<div>Dashboard content will be implemented in the next phase.</div>` directly inside `App.tsx`. No `Dashboard.tsx` file exists in `isms-portal/src/pages/`. |

### B.3 Route Constants (`apps/isms-portal/src/lib/routes.ts`)

The portal `ROUTES` object contains:
- Core: `HOME`, `MODULES`, `FREE_ASSESSMENT`, `SUBSCRIBE`, `SUBSCRIBE_CHECKOUT`, `JOURNEY`, `AUTH`, `DASHBOARD`
- Post-subscription stubs: `ASSESSMENT`, `MATURITY_SETUP`
- **Marketing canonical**: `MARKETING_MATURITY_ROADMAP`, `MARKETING_RISK_MANAGEMENT`, `MARKETING_PROJECT_IMPLEMENTATION`, `MARKETING_DATA_ANALYTICS`, `MARKETING_SYSTEMS_INTEGRATION`, `MARKETING_SKILLS_DEVELOPMENT`, `MARKETING_INCIDENT_INTELLIGENCE`
- **Legacy shim redirects**: `RISK_MANAGEMENT_INFO`, `PIT_INFO`, `DATA_ANALYTICS_INFO`, `SKILLS_DEVELOPMENT_INFO`, `INCIDENT_MANAGEMENT_INFO`, `DATA_EXTRACTION_INFO`

**Notable absences:**
- ❌ `ONBOARDING` — no `/onboarding` route constant
- ❌ `MMM_HANDOFF` — no handoff route constant or target URL
- ❌ `PIT_ENTRY` — no `/pit` placeholder constant for future authenticated PIT entry (public marketing stub `/marketing/project-implementation` is already wired)
- ❌ `MATURITY_SETUP` is defined but **not wired** as a Route in `App.tsx`

---

## C. Route-by-Route Desired State

| Legacy Route | Legacy Auth | Portal Route | Portal Auth | Desired Route | Desired Auth | Status | Action |
|---|---|---|---|---|---|---|---|
| `/` | Public | `/` | Public | `/` | Public | ✅ Done | None |
| `/auth` | Public | `/auth` | Public | `/auth` | Public | ✅ Done | None |
| `/free-assessment` | **ProtectedRoute** ⚠️ | `/free-assessment` | Public | `/free-assessment` | Public | ✅ Done | Auth wall removed in portal |
| `/subscribe` | Public | `/subscribe` | Public | `/subscribe` | Public | ✅ Done | None |
| `/subscribe/checkout` | Public | `/subscribe/checkout` | Public | `/subscribe/checkout` | Public | ✅ Done | None |
| `/journey` | **ProtectedRoute** ⚠️ | `/journey` | Public | `/journey` | Public | ✅ Done | Auth wall removed in portal |
| `/modules` | Not wired | `/modules` | Public | `/modules` | Public | ✅ Done | Added to portal |
| `/risk-management-info` | **ProtectedRoute** ⚠️ | redirect → `/marketing/risk-management` | Public | `/marketing/risk-management` | Public | ✅ Done | Canonical route + redirect shim |
| `/pit-info` | **ProtectedRoute** ⚠️ | redirect → `/marketing/project-implementation` | Public | `/marketing/project-implementation` | Public | ✅ Done | Canonical route + redirect shim |
| `/data-analytics-info` | **ProtectedRoute** ⚠️ | redirect → `/marketing/data-analytics-assurance` | Public | `/marketing/data-analytics-assurance` | Public | ✅ Done | Canonical route + redirect shim |
| `/data-extraction-info` | **ProtectedRoute** ⚠️ | redirect → `/marketing/systems-integration` | Public | `/marketing/systems-integration` | Public | ✅ Done | Canonical route + redirect shim |
| `/skills-development-info` | **ProtectedRoute** ⚠️ | redirect → `/marketing/skills-development` | Public | `/marketing/skills-development` | Public | ✅ Done | Canonical route + redirect shim |
| `/incident-management-info` | **ProtectedRoute** ⚠️ | redirect → `/marketing/incident-intelligence` | Public | `/marketing/incident-intelligence` | Public | ✅ Done | Canonical route + redirect shim |
| *(no legacy equivalent)* | n/a | `/marketing/maturity-roadmap` | Public | `/marketing/maturity-roadmap` | Public | ✅ Done | New page created (MaturityRoadmapInfo.tsx) |
| `/dashboard` | ProtectedRoute | `/dashboard` (inline stub) | ProtectedRoute | `/dashboard` | ProtectedRoute | ⚠️ Partial | Dashboard.tsx file missing; only inline stub exists |
| `/maturity/setup` | ProtectedRoute | *(constant defined, not wired)* | — | `/maturity/setup` | ProtectedRoute | ❌ Missing | Add Route + Dashboard.tsx or redirect to MMM |
| *(no legacy equivalent)* | n/a | *(missing)* | — | `/onboarding` | Public or ProtectedRoute | ❌ Missing | Onboarding route required post-subscribe |
| *(no legacy equivalent)* | n/a | *(missing)* | — | `/mmm` or `/maturity` | ProtectedRoute | ❌ Missing | MMM handoff target post-onboarding |
| *(no legacy equivalent)* | n/a | *(missing)* | — | `/pit` (reserved) | ProtectedRoute | ❌ Missing | `PIT_ENTRY: '/pit'` constant not yet in `routes.ts`; public marketing stub `/marketing/project-implementation` is done |
| `/accept-invitation` | Public | *(missing)* | — | `/accept-invitation` | Public | ❌ Missing | InvitationAcceptance.tsx not harvested |

---

## D. CTA Wiring Map

| User Action | Source Page/Component | Destination Route | Auth Required | Module Ownership | Status |
|---|---|---|---|---|---|
| "Start Your Free Assessment" (hero CTA) | `Index.tsx` | `/free-assessment` | No | ISMS | ✅ Wired |
| "Start Your Free Assessment" (bottom CTA) | `Index.tsx` | `/free-assessment` | No | ISMS | ✅ Wired |
| "Modules" nav button | `Index.tsx` header | `/modules` | No | ISMS | ✅ Wired |
| "Journey" nav button | `Index.tsx` header | `/journey` | No | ISMS | ✅ Wired |
| "Sign In" nav button | `Index.tsx` header | `/auth` | No | ISMS | ✅ Wired |
| Module card click — Maturity Roadmap | `Index.tsx` ISMS_MODULES grid | `/marketing/maturity-roadmap` | No | ISMS → MMM | ✅ Wired |
| Module card click — Risk Management | `Index.tsx` ISMS_MODULES grid | `/marketing/risk-management` | No | ISMS | ✅ Wired |
| Module card click — Project Implementation | `Index.tsx` ISMS_MODULES grid | `/marketing/project-implementation` | No | ISMS | ✅ Wired |
| Module card click — Data Analytics | `Index.tsx` ISMS_MODULES grid | `/marketing/data-analytics-assurance` | No | ISMS | ✅ Wired |
| Module card click — Systems Integration | `Index.tsx` ISMS_MODULES grid | `/marketing/systems-integration` | No | ISMS | ✅ Wired |
| Module card click — Skills Development | `Index.tsx` ISMS_MODULES grid | `/marketing/skills-development` | No | ISMS | ✅ Wired |
| Module card click — Incident Intelligence | `Index.tsx` ISMS_MODULES grid | `/marketing/incident-intelligence` | No | ISMS | ✅ Wired |
| "Start Free Assessment" CTA | `MaturityRoadmapInfo.tsx` | `/free-assessment` | No | ISMS | ✅ Wired |
| "View Plans" CTA | `MaturityRoadmapInfo.tsx` | `/subscribe` | No | ISMS | ✅ Wired |
| "Subscribe to Maturity Roadmap" CTA | `MaturityRoadmapInfo.tsx` | `/subscribe` | No | ISMS | ✅ Wired |
| "Get Started" / CTA on all marketing info pages | `RiskManagementInfo`, `PITInfo`, etc. | `/subscribe` | No | ISMS | ✅ Wired |
| "Select plan" / "Subscribe" button | `Subscribe.tsx` | `/subscribe/checkout` | No | ISMS | ✅ Wired |
| "Complete checkout" / payment | `SubscribeCheckout.tsx` | *(post-checkout)* → `/onboarding` or `/dashboard` | Yes (post-payment) | ISMS | ❌ Missing — target undefined |
| "Begin assessment" (free assessment) | `FreeAssessment.tsx` | `/assessment` | No | ISMS/MMM boundary | ⚠️ Partial — `/assessment` not wired in portal App.tsx |
| Sign up / account creation | `Subscribe.tsx` / `SubscribeCheckout.tsx` | `/auth` → `/onboarding` | Becomes required | ISMS | ❌ Missing — no onboarding route |
| Onboarding completion | `(future) Onboarding.tsx` | `/maturity/setup` or MMM handoff URL | Yes | ISMS → MMM | ❌ Missing — MMM handoff contract undefined |
| PIT card / interest | `Index.tsx` or `ModulesOverview.tsx` | `/marketing/project-implementation` | No | ISMS | ✅ Wired (marketing stub) — `PIT_ENTRY: '/pit'` constant still needed for future authenticated PIT entry |
| Dashboard access (post-login) | `(future) Dashboard.tsx` | `/dashboard` | Yes | ISMS/MMM | ⚠️ Stub only — no real Dashboard.tsx component |

---

## E. MMM Handoff Contract

### E.1 Current State

The ISMS portal has no defined MMM (Maturion Maturity Module) handoff contract. The legacy app had a `/maturity/setup` route that acted as a setup wizard, but this was never harvested into `isms-portal`. The ISMS portal's `routes.ts` defines `MATURITY_SETUP: '/maturity/setup'` but the route is **not wired** in `App.tsx`.

### E.2 Required Contract

The MMM handoff is the bridge between ISMS (which owns the user's pre-subscription journey, checkout, auth, and onboarding) and MMM (which owns the maturity assessment execution, domain scoring, and improvement roadmap).

**Trigger point:** After the user completes ISMS onboarding, ISMS must hand the authenticated session to MMM.

**Proposed Contract:**

```
ISMS Responsibility (boundary ends):
  Route: /onboarding
  Trigger: Successful checkout + account creation
  Action: Collect org name, org size, industry, primary contact
  Exit: Navigate to MMM entry point

MMM Responsibility (boundary begins):
  Entry Route: /maturity/setup  OR  external MMM app URL (TBD)
  Input Contract:
    - user_id (from Supabase auth session)
    - org_id (created during ISMS onboarding)
    - subscription_tier (from ISMS checkout)
    - redirect_source: 'isms-onboarding'
  MMM Action: Load MaturitySetup wizard, bind to org_id
```

**Open decisions for pre-build specification:**
1. Is MMM a separate Vercel deployment or a route within `isms-portal`?
2. If same deployment: wire `/maturity/setup` as a ProtectedRoute in `isms-portal/src/App.tsx`
3. If separate deployment: define the cross-app redirect with session token pass-through
4. What org data does ISMS collect during onboarding vs. what MMM collects during setup?
5. Does the free assessment (`/free-assessment`) navigate to `/assessment` inside ISMS portal, or does it redirect to MMM? Currently `FreeAssessment.tsx` navigates to `/assessment` which is **unrouted** in the portal.

### E.3 Immediate Gap

`ROUTES.ASSESSMENT` (`/assessment`) is defined in `isms-portal/src/lib/routes.ts` but has **no corresponding Route element** in `App.tsx`. The `FreeAssessment.tsx` CTA calls `navigate('/assessment')` which will hit the `NotFound` catch-all. This is a broken link that must be resolved.

---

## F. PIT Placeholder / Handoff Decision Register

### F.1 Current State

PIT (Project Implementation Tracking) is represented in the ISMS landing as:
- A module card on `Index.tsx` — links to `/marketing/project-implementation`
- A `PITInfo.tsx` marketing page at `/marketing/project-implementation`
- A redirect shim from `/pit-info` → `/marketing/project-implementation`

The `PITInfo.tsx` page (both legacy and portal) is a **"Coming Soon" marketing page** explaining the PIT module capabilities. There is no live PIT application entry point.

### F.2 Decision Register

| Decision | Options | Status | Recommendation |
|---|---|---|---|
| PIT entry point route | `/marketing/project-implementation` (current — public marketing stub ✅ Done), `/pit` (future authenticated entry) | OPEN | Retain `/marketing/project-implementation` as the public marketing stub; add `PIT_ENTRY: '/pit'` as the reserved constant for the future authenticated PIT entry |
| PIT app ownership | Separate app (`apps/pit-portal`), sub-route in ISMS, sub-route in MMM | OPEN | Separate app; ISMS holds placeholder only |
| PIT marketing stub content | `PITInfo.tsx` at `/marketing/project-implementation` | ✅ Done | No change needed |
| PIT CTA post-interest | "Notify me" / waitlist vs. "Coming Soon" badge | OPEN | Add `PIT_PLACEHOLDER` constant, wire "Notify Me" CTA to email capture or waitlist |
| PIT legacy redirect | `/pit-info` → `/marketing/project-implementation` | ✅ Done | Retain shim |

### F.3 Proposed Placeholder Route Addition

Add to `isms-portal/src/lib/routes.ts`:
```
PIT_ENTRY: '/pit',  // Future live PIT entry — placeholder, ProtectedRoute when wired
```

The `/marketing/project-implementation` route remains the public marketing stub. `/pit` will be the authenticated entry point, wired when PIT is ready.

---

## G. Harvest / Adapt / Defer / Discard Matrix

| File | Legacy Path | Portal Path | Status | Action | Notes |
|---|---|---|---|---|---|
| `Index.tsx` | `apps/maturion-maturity-legacy/src/pages/Index.tsx` | `apps/isms-portal/src/pages/Index.tsx` | Already harvested | `already harvested` | New ISMS-branded version written from scratch; not a direct copy |
| `FreeAssessment.tsx` | `apps/maturion-maturity-legacy/src/pages/FreeAssessment.tsx` | `apps/isms-portal/src/pages/FreeAssessment.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; `useToast` / `useEffect` toast removed; MMM attribution note added |
| `Subscribe.tsx` | `apps/maturion-maturity-legacy/src/pages/Subscribe.tsx` | `apps/isms-portal/src/pages/Subscribe.tsx` | Already harvested | `harvest + adapt` | Retained subscription logic; minor `catch` clause cleanup (removed `console.error`) |
| `SubscribeCheckout.tsx` | `apps/maturion-maturity-legacy/src/pages/SubscribeCheckout.tsx` | `apps/isms-portal/src/pages/SubscribeCheckout.tsx` | Already harvested | `harvest + adapt` | Checkout structure preserved; adapted to isms-portal component imports |
| `Journey.tsx` | `apps/maturion-maturity-legacy/src/pages/Journey.tsx` | `apps/isms-portal/src/pages/Journey.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; `useToast` dependency cleaned; large page — content parity confirmed |
| `ModulesOverview.tsx` | `apps/maturion-maturity-legacy/src/pages/ModulesOverview.tsx` | `apps/isms-portal/src/pages/ModulesOverview.tsx` | Already harvested | `harvest + adapt` | Legacy used hardcoded routes and `useAuth` / `useOrganization` hooks; portal version uses `ROUTES.*` constants and removes auth hooks |
| `RiskManagementInfo.tsx` | `apps/maturion-maturity-legacy/src/pages/RiskManagementInfo.tsx` | `apps/isms-portal/src/pages/RiskManagementInfo.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; route renamed `/marketing/risk-management`; legacy redirect shim added |
| `PITInfo.tsx` | `apps/maturion-maturity-legacy/src/pages/PITInfo.tsx` | `apps/isms-portal/src/pages/PITInfo.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; route renamed `/marketing/project-implementation`; legacy redirect shim added |
| `DataAnalyticsInfo.tsx` | `apps/maturion-maturity-legacy/src/pages/DataAnalyticsInfo.tsx` | `apps/isms-portal/src/pages/DataAnalyticsInfo.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; route renamed `/marketing/data-analytics-assurance`; legacy redirect shim added |
| `DataExtractionInfo.tsx` | `apps/maturion-maturity-legacy/src/pages/DataExtractionInfo.tsx` | `apps/isms-portal/src/pages/DataExtractionInfo.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; route renamed `/marketing/systems-integration`; legacy redirect shim added |
| `SkillsDevelopmentInfo.tsx` | `apps/maturion-maturity-legacy/src/pages/SkillsDevelopmentInfo.tsx` | `apps/isms-portal/src/pages/SkillsDevelopmentInfo.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; route renamed `/marketing/skills-development`; legacy redirect shim added |
| `IncidentManagementInfo.tsx` | `apps/maturion-maturity-legacy/src/pages/IncidentManagementInfo.tsx` | `apps/isms-portal/src/pages/IncidentManagementInfo.tsx` | Already harvested | `harvest + adapt` | Auth wall removed; route renamed `/marketing/incident-intelligence`; legacy redirect shim added |
| `MaturityRoadmapInfo.tsx` | *(no legacy equivalent)* | `apps/isms-portal/src/pages/MaturityRoadmapInfo.tsx` | New, complete | `new (no legacy)` | Freshly authored; well-formed with features, benefits, and 2 CTAs; covers ISO 27001/NIST alignment |
| `NotFound.tsx` | `apps/maturion-maturity-legacy/src/pages/NotFound.tsx` | `apps/isms-portal/src/pages/NotFound.tsx` | Already harvested | `harvest + adapt` | Minor branding/import adaptations |
| `Dashboard.tsx` | `apps/maturion-maturity-legacy/src/pages/Dashboard.tsx` | *(inline stub in App.tsx)* | Stub only | `defer` | Full dashboard belongs to MMM scope; ISMS portal needs minimal post-login landing stub until MMM handoff |
| `MaturitySetup.tsx` | `apps/maturion-maturity-legacy/src/pages/MaturitySetup.tsx` | *(not in portal pages)* | Not harvested | `defer` | MMM onboarding wizard; belongs in MMM scope |
| `Assessment.tsx` | `apps/maturion-maturity-legacy/src/pages/Assessment.tsx` | *(not in portal pages)* | Not harvested | `defer` | Full assessment execution — MMM scope |
| `AssessmentFramework.tsx` | `apps/maturion-maturity-legacy/src/pages/AssessmentFramework.tsx` | *(not in portal pages)* | Not harvested | `defer` | MMM scope |
| `AuditStructureConfig.tsx` | `apps/maturion-maturity-legacy/src/pages/AuditStructureConfig.tsx` | *(not in portal pages)* | Not harvested | `defer` | MMM scope |
| `DomainAuditBuilder.tsx` | `apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx` | *(not in portal pages)* | Not harvested | `defer` | MMM scope |
| `QASignOff.tsx` / `QASignOffDynamic.tsx` | `apps/maturion-maturity-legacy/src/pages/QASign*.tsx` | *(not in portal pages)* | Not harvested | `defer` | MMM/QA scope |
| `TeamPage.tsx` | `apps/maturion-maturity-legacy/src/pages/TeamPage.tsx` | *(not in portal pages)* | Not harvested | `defer` | Post-subscription; ISMS org management scope |
| `OrganizationSettings.tsx` | `apps/maturion-maturity-legacy/src/pages/OrganizationSettings.tsx` | *(not in portal pages)* | Not harvested | `defer` | Post-subscription; ISMS org settings scope |
| `MilestoneDetail.tsx` | `apps/maturion-maturity-legacy/src/pages/MilestoneDetail.tsx` | *(not in portal pages)* | Not harvested | `defer` | MMM milestone scope |
| `MaturionKnowledgeBase.tsx` | `apps/maturion-maturity-legacy/src/pages/MaturionKnowledgeBase.tsx` | *(not in portal pages)* | Not harvested | `defer` | AI knowledge base; post-subscription scope |
| `MaturionUploads.tsx` | `apps/maturion-maturity-legacy/src/pages/MaturionUploads.tsx` | *(not in portal pages)* | Not harvested | `defer` | AI uploads; post-subscription scope |
| `InvitationAcceptance.tsx` | `apps/maturion-maturity-legacy/src/pages/InvitationAcceptance.tsx` | *(not in portal pages)* | Not harvested | `harvest + adapt` | Should be in ISMS portal — invitation acceptance is pre-auth ISMS scope |
| `AdminConfig.tsx` | `apps/maturion-maturity-legacy/src/pages/AdminConfig.tsx` | *(not in portal pages)* | Not harvested | `discard` | Admin tooling — not needed in ISMS public landing |
| `AdminHealthChecker.tsx` | `apps/maturion-maturity-legacy/src/pages/AdminHealthChecker.tsx` | *(not in portal pages)* | Not harvested | `discard` | Admin tooling |
| `AdminWorkflowDashboard.tsx` | `apps/maturion-maturity-legacy/src/pages/AdminWorkflowDashboard.tsx` | *(not in portal pages)* | Not harvested | `discard` | Admin tooling |
| `AdminSecurityDashboard.tsx` | `apps/maturion-maturity-legacy/src/pages/AdminSecurityDashboard.tsx` | *(not in portal pages)* | Not harvested | `discard` | Admin tooling — not even wired in legacy |
| `UserFieldMatrix.tsx` | `apps/maturion-maturity-legacy/src/pages/UserFieldMatrix.tsx` | *(not in portal pages)* | Not harvested | `discard` | Admin tooling |
| `UnifiedQADashboard.tsx` / `QADashboard.tsx` / `QATestDashboard.tsx` | legacy pages | *(not in portal pages)* | Not harvested | `discard` | Dev/QA tooling |
| `WatchdogDashboard.tsx` | `apps/maturion-maturity-legacy/src/pages/WatchdogDashboard.tsx` | *(not in portal pages)* | Not harvested | `discard` | Monitoring tooling |
| `DataSourcesManagement.tsx` | `apps/maturion-maturity-legacy/src/pages/DataSourcesManagement.tsx` | *(not in portal pages)* | Not harvested | `discard` | Data management tooling |
| `TestSuite.tsx` | `apps/maturion-maturity-legacy/src/pages/TestSuite.tsx` | *(not in portal pages)* | Not harvested | `discard` | Dev tooling |
| `ProcessIntegrityAuditBuilder.tsx` | `apps/maturion-maturity-legacy/src/pages/ProcessIntegrityAuditBuilder.tsx` | *(not in portal pages)* | Not harvested | `defer` | Unrouted in legacy; MMM internal tooling |
| `ProtectionAuditBuilder.tsx` | `apps/maturion-maturity-legacy/src/pages/ProtectionAuditBuilder.tsx` | *(not in portal pages)* | Not harvested | `defer` | Unrouted in legacy; MMM internal tooling |

---

## H. Resulting 12-Stage Pre-Build Worklist

The following 12 stages represent the ordered pre-build tasks required to bring `isms-portal` to a complete and production-ready public landing with correct handoff boundaries.

> **Priority classification:** 🔴 Blocker | 🟠 High | 🟡 Medium | 🟢 Low / Enhancement

---

### Stage 1 — Fix broken `/assessment` route (FreeAssessment CTA) 🔴

**Problem:** `FreeAssessment.tsx` calls `navigate('/assessment')`. The route `/assessment` is defined in `ROUTES.ASSESSMENT` but **not wired as a Route element** in `isms-portal/src/App.tsx`. Users who click "Start Assessment" land on the 404 page.

**Action:** Decide and implement one of:
- (a) Wire `/assessment` as a redirect to MMM's entry point (if MMM is a separate deployment)
- (b) Wire `/assessment` as an ISMS-owned bridge page that transitions to the MMM free-assessment execution route

**Files affected:** `apps/isms-portal/src/App.tsx`, `apps/isms-portal/src/pages/FreeAssessment.tsx`

---

### Stage 2 — Define and wire `ONBOARDING` route 🔴

**Problem:** After a user completes checkout (`/subscribe/checkout`), there is no defined next step. The checkout page has no post-payment navigation target. An onboarding flow (collect org details) must exist before any module handoff.

**Action:**
1. Add `ONBOARDING: '/onboarding'` to `apps/isms-portal/src/lib/routes.ts`
2. Create `apps/isms-portal/src/pages/Onboarding.tsx` — minimal org data collection form (org name, size, industry)
3. Wire `<Route path={ROUTES.ONBOARDING} element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />` in `App.tsx`
4. Update `SubscribeCheckout.tsx` post-payment success handler to `navigate(ROUTES.ONBOARDING)`

**Files affected:** `routes.ts`, `App.tsx`, `SubscribeCheckout.tsx`, new `Onboarding.tsx`

---

### Stage 3 — Define and wire MMM handoff route 🔴

**Problem:** After onboarding, ISMS must hand the user to MMM. The handoff target is undefined. `ROUTES.MATURITY_SETUP` exists but is not wired in `App.tsx`.

**Action:**
1. Resolve deployment architecture decision (same app vs. separate Vercel deployment)
2. **If same app:** Wire `<Route path={ROUTES.MATURITY_SETUP} element={<ProtectedRoute><MaturitySetup /></ProtectedRoute>} />` (importing from `apps/maturion-maturity-legacy` or a future `apps/mmm-portal`)
3. **If separate app:** Add `MMM_ENTRY_URL` as an environment variable and update `Onboarding.tsx` exit to `window.location.href = import.meta.env.VITE_MMM_URL`
4. Document the chosen handoff contract in `modules/isms/04-architecture/`

**Files affected:** `routes.ts`, `App.tsx`, `Onboarding.tsx`

---

### Stage 4 — Harvest `InvitationAcceptance.tsx` 🟠

**Problem:** The invitation acceptance flow (`/accept-invitation`) is present in legacy and wired as a public route but is **absent from `isms-portal`**. Users accepting org invitations via email will 404.

**Action:**
1. Copy `apps/maturion-maturity-legacy/src/pages/InvitationAcceptance.tsx` to `apps/isms-portal/src/pages/InvitationAcceptance.tsx`
2. Update imports to use `isms-portal` path aliases and `ROUTES` constants
3. Add `INVITATION_ACCEPTANCE: '/accept-invitation'` to `isms-portal/src/lib/routes.ts`
4. Wire `<Route path={ROUTES.INVITATION_ACCEPTANCE} element={<InvitationAcceptance />} />` in `App.tsx`

**Files affected:** `routes.ts`, `App.tsx`, new `InvitationAcceptance.tsx`

---

### Stage 5 — Create real `Dashboard.tsx` component (post-login landing) 🟠

**Problem:** The `/dashboard` route renders an inline JSX stub directly inside `App.tsx`. There is no `Dashboard.tsx` file in `apps/isms-portal/src/pages/`. This is a code quality issue and will block post-login UX.

**Action:**
1. Create `apps/isms-portal/src/pages/Dashboard.tsx` with appropriate ISMS post-login content:
   - Welcome message with org name
   - Quick links to subscribed modules
   - MMM handoff CTA (if onboarding not yet complete)
   - "Your subscription" summary
2. Replace the inline stub in `App.tsx` with `import Dashboard from './pages/Dashboard'`
3. Ensure the route remains ProtectedRoute

**Files affected:** `App.tsx`, new `Dashboard.tsx`

---

### Stage 6 — Add `PIT_ENTRY` route constant and placeholder wiring 🟡

**Problem:** PIT has a marketing page but no defined entry-point route constant for the future live PIT application. The Index page module grid routes PIT interest to the marketing page only.

**Action:**
1. Add `PIT_ENTRY: '/pit'` to `isms-portal/src/lib/routes.ts` (comment: `// Future PIT entry — placeholder, wire when PIT app ready`)
2. No Route element needed yet — the constant serves as the reserved namespace
3. Update `Index.tsx` and `ModulesOverview.tsx` to reference `ROUTES.PIT_ENTRY` for the "Launch" CTA (post-subscription) vs. `ROUTES.MARKETING_PROJECT_IMPLEMENTATION` for the "Learn More" CTA (pre-subscription)

**Files affected:** `routes.ts`, `Index.tsx`, `ModulesOverview.tsx`

---

### Stage 7 — Audit and fix all hardcoded route strings 🟡

**Problem:** Several pages may contain hardcoded route strings (e.g., `navigate('/assessment')` in `FreeAssessment.tsx`) instead of using `ROUTES.*` constants. This creates a maintenance risk.

**Action:**
1. Search all files in `apps/isms-portal/src/` for hardcoded route strings
2. Replace all hardcoded strings with the appropriate `ROUTES.*` constant
3. For any route string that has no matching constant, either add the constant or document why none is needed

**Known instances:**
- `FreeAssessment.tsx` line 17: `navigate('/assessment')` — use `ROUTES.ASSESSMENT`
- Any other occurrences to be found during audit

**Files affected:** Multiple pages TBD from audit

---

### Stage 8 — Complete `AuthContext` consolidation 🟡

**Problem:** The legacy app uses `@/contexts/AuthContext` (note: `contexts` plural). The portal uses `@/context/AuthContext` (singular). This is already consistent within each app, but:
- Legacy `ModulesOverview.tsx` imports `useAuth` from `@/contexts/AuthContext` — this import was correctly removed in the portal version
- Any future harvest of legacy pages that import from `@/contexts/` must update the import path to `@/context/`

**Action:**
1. Document the canonical path: `@/context/AuthContext` for `isms-portal`
2. Add an ESLint rule or barrel file that catches legacy import path if any legacy pages are later harvested

**Files affected:** `(documentation + lint config)`

---

### Stage 9 — Review and lock `ModulesOverview.tsx` module routing 🟡

**Problem:** The portal `ModulesOverview.tsx` maps module cards to `ROUTES.MARKETING_*` routes (e.g., `MARKETING_MATURITY_ROADMAP`). Once MMM is live, the "Maturity Development" card should navigate to the live MMM entry point (e.g., `/maturity/setup`) for subscribed users, not the marketing page. The portal version currently has `isSubscribed: false` for all modules, so all route to marketing pages.

**Action:**
1. Implement subscription-aware routing in `ModulesOverview.tsx`:
   - If `isSubscribed === true` → route to live module entry point (e.g., `ROUTES.MATURITY_SETUP`)
   - If `isSubscribed === false` → route to marketing page (e.g., `ROUTES.MARKETING_MATURITY_ROADMAP`)
2. Connect `isSubscribed` to actual Supabase subscription data (deferred to subscription integration task)
3. For now: document the routing logic as a TODO comment in `ModulesOverview.tsx`

**Files affected:** `ModulesOverview.tsx`

---

### Stage 10 — Add `MATURITY_ROADMAP_ENTRY` route constant for post-subscription module access 🟡

**Problem:** Currently `ROUTES.MATURITY_SETUP` (`/maturity/setup`) is intended as the MMM entry point for subscribed users. However there is ambiguity: is `/maturity/setup` the one-time setup wizard, or the ongoing module entry? These should be two distinct routes.

**Action:**
1. Add `MATURITY_DASHBOARD: '/maturity/dashboard'` (or confirm MMM owns its own routing)
2. Clarify in architecture docs:
   - `/maturity/setup` = one-time org setup wizard (runs once post-subscribe)
   - `/maturity/dashboard` = ongoing MMM entry point (runs every session after setup)
3. Update `Onboarding.tsx` exit and `Dashboard.tsx` "Go to Maturity" CTA accordingly

**Files affected:** `routes.ts`, architecture documentation

---

### Stage 11 — Write `isms-portal` E2E smoke tests for public routes 🟢

**Problem:** No end-to-end or smoke tests exist for the ISMS portal public landing routes. All 14 public routes should be covered.

**Action:**
1. Create `apps/isms-portal/src/__tests__/public-routes.test.tsx` (or equivalent in the project's test structure)
2. Cover: GET `/`, `/auth`, `/free-assessment`, `/subscribe`, `/subscribe/checkout`, `/journey`, `/modules`, all 7 `/marketing/*` routes, all 6 legacy redirect routes (assert client-side navigation to canonical marketing route via React Router `<Navigate>`), `*` → 404
3. Assert: no ProtectedRoute wrappers on any public route, correct component renders, correct page titles

**Files affected:** new test file

---

### Stage 12 — Update `apps/isms-portal` README and architecture docs 🟢

**Problem:** The ISMS portal has no developer-facing README explaining the routing architecture, the ISMS→MMM boundary, or the harvest decisions made in this discovery.

**Action:**
1. Create `apps/isms-portal/README.md` covering:
   - Purpose: ISMS is the platform landing + pre-subscription funnel
   - Route inventory (summary table)
   - Auth boundaries: public vs. ProtectedRoute
   - MMM handoff contract summary
   - PIT placeholder policy
2. Add a reference to this discovery report

**Files affected:** new `apps/isms-portal/README.md`

---

## Appendix: Key Questions — Answered

### 1. Which legacy files are exact harvest candidates (same content, no route changes)?

**None.** Every harvested file required at least one adaptation:
- Auth wall removal (ProtectedRoute / AppLayout unwrapping)
- Route renaming (flat `/info` → `/marketing/` prefix)
- Import path updates (`@/contexts/` → `@/context/`, etc.)
- Legacy hook cleanup (`useToast` in FreeAssessment, `useAuth` in ModulesOverview)

### 2. Which files were "harvest + adapt" (needed route/auth changes)?

All 12 public/marketing page files: `FreeAssessment`, `Subscribe`, `SubscribeCheckout`, `Journey`, `ModulesOverview`, `RiskManagementInfo`, `PITInfo`, `DataAnalyticsInfo`, `DataExtractionInfo`, `SkillsDevelopmentInfo`, `IncidentManagementInfo`. Plus `NotFound`. Every one required adaptation.

### 3. Which files should be deferred (admin pages, MMM-specific, PIT-specific)?

**Defer to MMM scope:** `Dashboard`, `MaturitySetup`, `Assessment`, `AssessmentFramework`, `AuditStructureConfig`, `DomainAuditBuilder`, `QASignOff`/`QASignOffDynamic`, `MilestoneDetail`, `ProcessIntegrityAuditBuilder`, `ProtectionAuditBuilder`

**Defer to ISMS post-subscription scope:** `TeamPage`, `OrganizationSettings`, `MaturionKnowledgeBase`, `MaturionUploads`

### 4. Which files should be discarded (not relevant to ISMS landing)?

`AdminConfig`, `AdminHealthChecker`, `AdminWorkflowDashboard`, `AdminSecurityDashboard`, `UserFieldMatrix`, `UnifiedQADashboard`, `QADashboard`, `QATestDashboard`, `WatchdogDashboard`, `DataSourcesManagement`, `TestSuite`

### 5. What is the required MMM handoff contract after sign-up/onboarding?

See Section E. In brief:
- ISMS owns: landing → marketing → free assessment → subscribe → checkout → account creation → onboarding
- MMM entry point: `/maturity/setup` (wired as ProtectedRoute)
- Handoff payload: `{ user_id, org_id, subscription_tier, redirect_source: 'isms-onboarding' }`
- Architecture decision (same app vs. separate deployment) must be resolved before Stage 3

### 6. What PIT route/handoff placeholder should remain until PIT entry is finalised?

- Marketing stub: `/marketing/project-implementation` (PITInfo.tsx) — keep as-is
- Reserved entry constant: `ROUTES.PIT_ENTRY = '/pit'` — add to routes.ts, no Route element yet
- Legacy redirect: `/pit-info` → `/marketing/project-implementation` — keep as-is

### 7. Which routes are still missing from isms-portal?

| Missing Route | Why Needed |
|---|---|
| `/onboarding` | Post-checkout user onboarding (org data collection) |
| `/maturity/setup` (wired) | MMM handoff — constant exists but Route not wired |
| `/assessment` (wired) | FreeAssessment CTA navigates here; currently 404s |
| `/accept-invitation` | InvitationAcceptance.tsx not harvested |
| `/pit` (placeholder constant) | Reserved PIT entry namespace |

### 8. What are the remaining gaps that need to be addressed?

In priority order:
1. 🔴 `/assessment` route is broken (FreeAssessment CTA 404s)
2. 🔴 No onboarding route/page after checkout
3. 🔴 MMM handoff target undefined / unresolved architecture decision
4. 🟠 `InvitationAcceptance.tsx` not harvested — invitation emails 404
5. 🟠 `Dashboard.tsx` is an inline stub — no real page file
6. 🟡 Hardcoded route strings in `FreeAssessment.tsx` and potentially others
7. 🟡 Subscription-aware routing in `ModulesOverview.tsx` (all modules currently show `isSubscribed: false`)
8. 🟡 `PIT_ENTRY` constant missing from routes.ts
9. 🟢 No E2E smoke tests for public routes
10. 🟢 No developer README for `isms-portal`

---

*End of ISMS Public Landing Harvest Discovery Report*  
*Prepared for issue #1727 / PR #1728*
