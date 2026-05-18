# Verification Plan and Screenshot Evidence Checklist — ISMS Public Landing Harvest

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §16; Acceptance Criteria from issue #1645
**Version**: v1.0.0

---

## 1. Verification Requirements from Issue #1645

All of the following must be verified before this issue can close:

| Verification ID | Requirement | Verified By |
|---|---|---|
| V-1 | ISMS_APP_DESCRIPTION_UPDATED: yes | Document review |
| V-2 | LEGACY_HARVEST_SECTION_PRESENT: yes | Document review |
| V-3 | PREBUILD_PACKAGE_PRESENT: yes | Document review |
| V-4 | PUBLIC_ROUTE_MAP_PRESENT: yes | Document review |
| V-5 | ISMS_LANDING_LOADS_PUBLICLY: yes | Live/screenshot |
| V-6 | MODULE_CARDS_VISIBLE: yes | Live/screenshot |
| V-7 | MODULE_CARDS_CLICKABLE: yes | Live/interactive |
| V-8 | MODULE_MARKETING_PAGES_PUBLIC: yes | Live/screenshot |
| V-9 | MMM_CARD_ROUTES_TO_MATURITY_ROADMAP: yes | Live/interactive |
| V-10 | FREE_ASSESSMENT_ROUTE_PUBLIC: yes | Live/screenshot |
| V-11 | SUBSCRIPTION_ROUTE_PUBLIC: yes | Live/screenshot |
| V-12 | NO_AUTH_REQUIRED_FOR_MARKETING_PAGES: yes | Live/interactive |
| V-13 | FUNCTIONAL_PASS: yes | All above pass |

---

## 2. Build Verification

### 2.1 Compilation

```bash
# From apps/isms-portal directory:
pnpm install
pnpm run build   # Must complete without errors
pnpm run typecheck  # No TypeScript errors
```

Expected: Zero compilation errors. Zero TypeScript errors.

### 2.2 Test Suite

```bash
# From apps/isms-portal directory:
pnpm run test   # All tests GREEN
```

Expected: All existing tests GREEN. No regressions.

---

## 3. Route Verification Checklist

### 3.1 Public Route Access (No Auth Required)

For each of the following routes, verify:
- [ ] Route loads without redirecting to `/auth`
- [ ] Page renders visible content
- [ ] No authentication-related error messages

| Route | Expected Behavior | Screenshot Required |
|---|---|---|
| `/` | ISMS landing page renders with hero, module cards | YES |
| `/modules` | Module overview page renders | YES |
| `/journey` | Journey page renders (domain cards visible) | YES |
| `/free-assessment` | Free assessment form renders | YES |
| `/subscribe` | Subscription pricing page renders | YES |
| `/subscribe/checkout` | Checkout form renders | YES |
| `/marketing/risk-management` | Risk Management marketing page renders | YES |
| `/marketing/project-implementation` | PIT marketing page renders | YES |
| `/marketing/data-analytics-assurance` | Data Analytics marketing page renders | YES |
| `/marketing/systems-integration` | Systems Integration / RADAM page renders | YES |
| `/marketing/skills-development` | Skills Development page renders | YES |
| `/marketing/incident-intelligence` | Incident & Intelligence page renders | YES |

### 3.2 Legacy Route Redirects

| Legacy Route | Expected Redirect | Verified |
|---|---|---|
| `/risk-management-info` | → `/marketing/risk-management` | [ ] |
| `/pit-info` | → `/marketing/project-implementation` | [ ] |
| `/data-analytics-info` | → `/marketing/data-analytics-assurance` | [ ] |
| `/data-extraction-info` | → `/marketing/systems-integration` | [ ] |
| `/skills-development-info` | → `/marketing/skills-development` | [ ] |
| `/incident-management-info` | → `/marketing/incident-intelligence` | [ ] |

---

## 4. Module Card Verification

### 4.1 All 7 Cards Present on Landing Page

| Card | Present | Clickable | Routes Correctly |
|---|---|---|---|
| Maturity Roadmap / MMM | [ ] | [ ] | → `/marketing/maturity-roadmap` |
| Risk Management | [ ] | [ ] | → `/marketing/risk-management` |
| Project Implementation Tracker / PIT | [ ] | [ ] | → `/marketing/project-implementation` |
| Data Analytics & Remote Assurance | [ ] | [ ] | → `/marketing/data-analytics-assurance` |
| Systems Integration / RADAM | [ ] | [ ] | → `/marketing/systems-integration` |
| Skills Development Portal | [ ] | [ ] | → `/marketing/skills-development` |
| Incident & Intelligence Hub | [ ] | [ ] | → `/marketing/incident-intelligence` |

### 4.2 Free Assessment CTA

- [ ] "Start Free Assessment" (or equivalent) CTA visible on landing page
- [ ] CTA routes to `/free-assessment`
- [ ] Free assessment page indicates Maturity Roadmap / MMM tie

---

## 5. Screenshot Evidence Requirements

### 5.1 Required Screenshots

The following screenshots MUST be attached to the PR and/or handover evidence:

| Screenshot ID | Page | Viewport | Description |
|---|---|---|---|
| SS-1 | `/` (desktop) | 1440px | Full above-fold hero section |
| SS-2 | `/` (desktop) | 1440px | Module discovery cards grid (all 7 visible) |
| SS-3 | `/` (mobile) | 375px | Mobile layout of hero and first module card |
| SS-4 | `/free-assessment` | 1440px | Assessment form loaded (no auth required) |
| SS-5 | `/subscribe` | 1440px | Subscription pricing page |
| SS-6 | `/marketing/risk-management` | 1440px | Risk Management marketing page |
| SS-7 | `/marketing/project-implementation` | 1440px | PIT marketing page |
| SS-8 | Network tab / browser console | 1440px | No auth redirect error for `/journey` route |
| SS-9 | `/journey` | 1440px | Journey page loaded (public, no auth) |
| SS-10 | `/modules` | 1440px | Modules overview page |

### 5.2 Screenshot Naming Convention

```
ss-<ID>-<page>-<viewport>-<date>.png
Examples:
  ss-1-landing-desktop-1440-20260514.png
  ss-3-landing-mobile-375-20260514.png
  ss-4-free-assessment-desktop-1440-20260514.png
```

---

## 6. Functional Verification Matrix

| Functional Check | Method | Expected Result | Verified |
|---|---|---|---|
| Landing page loads publicly | Navigate to `/` in incognito mode | Page renders with hero and module cards | [ ] |
| All 7 module cards present | Visual inspection of `/` | 7 cards visible in grid | [ ] |
| Module card click works | Click each card | Routes to correct marketing page | [ ] |
| Marketing pages load publicly | Navigate to each `/marketing/*` in incognito | Each page renders content | [ ] |
| Free assessment public | Navigate to `/free-assessment` in incognito | Assessment form renders | [ ] |
| Subscribe page public | Navigate to `/subscribe` in incognito | Pricing page renders | [ ] |
| MMM card routes correctly | Click Maturity Roadmap card | Routes to `/marketing/maturity-roadmap` | [ ] |
| No auth redirect for marketing | Navigate to each marketing page in incognito | No redirect to `/auth` | [ ] |
| Legacy routes redirect | Navigate to `/risk-management-info` | Redirects to `/marketing/risk-management` | [ ] |
| Dashboard requires auth | Navigate to `/dashboard` in incognito | Redirects to `/auth` | [ ] |
| Build passes | `pnpm run build` | Zero errors | [ ] |
| Type check passes | `pnpm run typecheck` | Zero errors | [ ] |

---

## 7. QA Pass Criteria

This wave's QP evaluation will use the following pass criteria:

```
QP PASS requires:
- [ ] All 13 V-* verification items: YES
- [ ] All required screenshots submitted (SS-1 through SS-10)
- [ ] Build: zero errors
- [ ] TypeScript: zero errors  
- [ ] Zero console.log debug statements in production code
- [ ] All marketing routes confirmed PUBLIC in code review
- [ ] Legacy route redirects functioning
```

Any unchecked item = QP FAIL → REJECTION_NOTICE to ui-builder.

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
