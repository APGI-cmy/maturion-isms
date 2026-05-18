# Builder Checklist — ISMS Public Landing Harvest

**Stage**: 8 (Builder Checklist)
**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Builder**: ui-builder
**Authority**: foreman-v2-agent contract v6.2.0 Phase 3 Step 3.3
**Version**: v1.0.0

---

## 1. Pre-Build Checklist (Builder must confirm before starting)

| # | Item | Confirmed |
|---|---|---|
| B-PRE-1 | Read harvest-map.md in full | [ ] |
| B-PRE-2 | Read route-boundary-map.md in full — understand PUBLIC vs PRIVATE | [ ] |
| B-PRE-3 | Read module-card-inventory.md in full — understand all 7 card specs | [ ] |
| B-PRE-4 | Read ux-journey-contract.md in full — understand the sacred journey sequence | [ ] |
| B-PRE-5 | Read implementation-map.md in full — understand all files to create | [ ] |
| B-PRE-6 | Read accessibility-requirements.md in full | [ ] |
| B-PRE-7 | Read verification-plan.md in full — know the QP criteria | [ ] |
| B-PRE-8 | Read ISMS_app_description.md §16 — understand the authority model | [ ] |
| B-PRE-9 | Confirm: legacy source is at `apps/maturion-maturity-legacy/src/` | [ ] |
| B-PRE-10 | Confirm: target app is `apps/isms-portal/src/` | [ ] |

---

## 2. Implementation Checklist

### 2.1 App Infrastructure

| # | Task | Done |
|---|---|---|
| B-INF-1 | Set up `apps/isms-portal/package.json` with required dependencies | [ ] |
| B-INF-2 | Create `apps/isms-portal/index.html` with `<html lang="en">` and Vite entry | [ ] |
| B-INF-3 | Create `apps/isms-portal/vite.config.ts` with `@/` path alias | [ ] |
| B-INF-4 | Create `apps/isms-portal/tailwind.config.ts` matching maturion-maturity-legacy | [ ] |
| B-INF-5 | Create `apps/isms-portal/src/main.tsx` with ReactDOM.createRoot | [ ] |
| B-INF-6 | Create `apps/isms-portal/src/index.css` with Tailwind directives | [ ] |
| B-INF-7 | Create `apps/isms-portal/src/App.tsx` with full routing | [ ] |
| B-INF-8 | Create `apps/isms-portal/src/lib/routes.ts` with all route constants | [ ] |

### 2.2 Public Landing Page

| # | Task | Done |
|---|---|---|
| B-LAND-1 | Create `apps/isms-portal/src/pages/Index.tsx` (harvest from legacy) | [ ] |
| B-LAND-2 | Include hero section with primary CTA | [ ] |
| B-LAND-3 | Include all 7 module discovery cards | [ ] |
| B-LAND-4 | Include feature promise cards | [ ] |
| B-LAND-5 | Include ISMS journey/domains section | [ ] |
| B-LAND-6 | Remove all console.log debug statements | [ ] |
| B-LAND-7 | Remove useToast on page load | [ ] |
| B-LAND-8 | Update module card names to canonical ISMS names | [ ] |
| B-LAND-9 | Update module card routes to `/marketing/<module>` pattern | [ ] |
| B-LAND-10 | Free Assessment CTA routes to `/free-assessment` | [ ] |

### 2.3 Module Marketing Pages

| # | Task | Done |
|---|---|---|
| B-MKTG-1 | Create `RiskManagementInfo.tsx` → `/marketing/risk-management` | [ ] |
| B-MKTG-2 | Create `PITInfo.tsx` → `/marketing/project-implementation` | [ ] |
| B-MKTG-3 | Create `DataAnalyticsInfo.tsx` → `/marketing/data-analytics-assurance` | [ ] |
| B-MKTG-4 | Create `DataExtractionInfo.tsx` → `/marketing/systems-integration` | [ ] |
| B-MKTG-5 | Create `SkillsDevelopmentInfo.tsx` → `/marketing/skills-development` | [ ] |
| B-MKTG-6 | Create `IncidentManagementInfo.tsx` → `/marketing/incident-intelligence` | [ ] |
| B-MKTG-7 | Each page has: badge, icon header, features list, benefits cards, Subscribe CTA | [ ] |
| B-MKTG-8 | Each page has: back navigation → `/` | [ ] |
| B-MKTG-9 | Update internal navigation links to `/marketing/*` routes | [ ] |

### 2.4 Assessment and Subscription Flow

| # | Task | Done |
|---|---|---|
| B-SUB-1 | Create `FreeAssessment.tsx` → `/free-assessment` (PUBLIC) | [ ] |
| B-SUB-2 | Free assessment clearly indicates MMM/Maturity Roadmap tie | [ ] |
| B-SUB-3 | Create `Subscribe.tsx` → `/subscribe` (PUBLIC) | [ ] |
| B-SUB-4 | Create `SubscribeCheckout.tsx` → `/subscribe/checkout` (PUBLIC) | [ ] |

### 2.5 Supporting Pages

| # | Task | Done |
|---|---|---|
| B-SUPP-1 | Create `Journey.tsx` → `/journey` (PUBLIC) | [ ] |
| B-SUPP-2 | Create `ModulesOverview.tsx` → `/modules` (PUBLIC) | [ ] |
| B-SUPP-3 | Create `NotFound.tsx` → `*` catch-all | [ ] |

### 2.6 Route Configuration

| # | Task | Done |
|---|---|---|
| B-ROUTE-1 | All marketing routes are PUBLIC (no ProtectedRoute wrapper) | [ ] |
| B-ROUTE-2 | `/journey` is PUBLIC (no ProtectedRoute wrapper) | [ ] |
| B-ROUTE-3 | `/free-assessment` is PUBLIC (no ProtectedRoute wrapper) | [ ] |
| B-ROUTE-4 | Legacy route redirects implemented | [ ] |
| B-ROUTE-5 | All routes use ROUTES.* constants | [ ] |

---

## 3. MANDATORY INVARIANTS (Builder must never violate)

> ⚠️ These are hard rules. Any violation is a QP FAIL.

| # | Invariant |
|---|---|
| INV-1 | NO marketing page may be wrapped in ProtectedRoute |
| INV-2 | `/free-assessment` must be PUBLIC |
| INV-3 | `/journey` must be PUBLIC |
| INV-4 | Module card names must use canonical ISMS names (see module-card-inventory.md) |
| INV-5 | Free Assessment must indicate Maturity Roadmap / MMM tie |
| INV-6 | MMM card routes to `/marketing/maturity-roadmap` (NOT `/maturity/setup` or `/`) |
| INV-7 | Zero console.log debug statements in production code |
| INV-8 | No wide useToast welcome message on landing page load |
| INV-9 | Legacy source files (`apps/maturion-maturity-legacy/`) must NOT be modified |
| INV-10 | All route constants must be defined in `src/lib/routes.ts` |

---

## 4. Post-Build Checklist (Builder must confirm before handover)

| # | Item | Done |
|---|---|---|
| B-POST-1 | `pnpm run build` passes with zero errors | [ ] |
| B-POST-2 | TypeScript type check passes with zero errors | [ ] |
| B-POST-3 | All existing tests still pass | [ ] |
| B-POST-4 | All 13 V-* verification items from verification-plan.md satisfied | [ ] |
| B-POST-5 | All required screenshots (SS-1 through SS-10) captured and attached | [ ] |
| B-POST-6 | All INV-1 through INV-10 invariants confirmed compliant | [ ] |
| B-POST-7 | Route boundary verification checklist in verification-plan.md completed | [ ] |

---

## 5. Handover Trigger

Only trigger handover when ALL post-build checklist items are checked.
Any unchecked item = premature handover = REJECTION_NOTICE from Foreman QP.

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
