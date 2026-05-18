# Page/Route Implementation Map — ISMS Public Landing Harvest

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §16; route-boundary-map.md; module-card-inventory.md
**Version**: v1.0.0

---

## 1. Implementation Scope Overview

This wave implements the public-facing ISMS app layer in `apps/isms-portal/`.

**Target app directory**: `apps/isms-portal/src/`

---

## 2. App Infrastructure Files

| File | Action | Notes |
|---|---|---|
| `apps/isms-portal/package.json` | UPDATE | Add react-router-dom, lucide-react, shadcn/ui, vite dependencies |
| `apps/isms-portal/index.html` | CREATE | Basic HTML shell with Vite entry point |
| `apps/isms-portal/vite.config.ts` | CREATE | Vite config with path aliases (@/) |
| `apps/isms-portal/tailwind.config.ts` | CREATE | Tailwind config matching maturion-maturity-legacy pattern |
| `apps/isms-portal/tsconfig.json` | UPDATE | Ensure path aliases configured |
| `apps/isms-portal/src/main.tsx` | CREATE | ReactDOM entry point |
| `apps/isms-portal/src/App.tsx` | CREATE | Main router with all routes |
| `apps/isms-portal/src/index.css` | CREATE | Global styles with Tailwind directives |
| `apps/isms-portal/src/lib/routes.ts` | CREATE | Route constants (see Section 4) |

---

## 3. Page Files

### 3.1 Public Landing and Discovery Pages

| Page File | Route | Action | Legacy Source | Priority |
|---|---|---|---|---|
| `src/pages/Index.tsx` | `/` | CREATE (harvest) | `Index.tsx` | P0 — must deliver |
| `src/pages/ModulesOverview.tsx` | `/modules` | CREATE (harvest+adapt) | `ModulesOverview.tsx` | P1 |
| `src/pages/Journey.tsx` | `/journey` | CREATE (harvest+adapt) | `Journey.tsx` | P1 |

### 3.2 Assessment and Subscription Pages

| Page File | Route | Action | Legacy Source | Priority |
|---|---|---|---|---|
| `src/pages/FreeAssessment.tsx` | `/free-assessment` | CREATE (harvest) | `FreeAssessment.tsx` | P0 — must deliver |
| `src/pages/Subscribe.tsx` | `/subscribe` | CREATE (harvest) | `Subscribe.tsx` | P0 — must deliver |
| `src/pages/SubscribeCheckout.tsx` | `/subscribe/checkout` | CREATE (harvest) | `SubscribeCheckout.tsx` | P0 — must deliver |

### 3.3 Module Marketing Pages

| Page File | Route | Action | Legacy Source | Priority |
|---|---|---|---|---|
| `src/pages/RiskManagementInfo.tsx` | `/marketing/risk-management` | CREATE (harvest) | `RiskManagementInfo.tsx` | P0 |
| `src/pages/PITInfo.tsx` | `/marketing/project-implementation` | CREATE (harvest) | `PITInfo.tsx` | P0 |
| `src/pages/DataAnalyticsInfo.tsx` | `/marketing/data-analytics-assurance` | CREATE (harvest) | `DataAnalyticsInfo.tsx` | P0 |
| `src/pages/DataExtractionInfo.tsx` | `/marketing/systems-integration` | CREATE (harvest) | `DataExtractionInfo.tsx` | P0 |
| `src/pages/SkillsDevelopmentInfo.tsx` | `/marketing/skills-development` | CREATE (harvest) | `SkillsDevelopmentInfo.tsx` | P0 |
| `src/pages/IncidentManagementInfo.tsx` | `/marketing/incident-intelligence` | CREATE (harvest) | `IncidentManagementInfo.tsx` | P0 |

### 3.4 Placeholder Pages

| Page File | Route | Action | Notes | Priority |
|---|---|---|---|---|
| `src/pages/NotFound.tsx` | `*` | CREATE | 404 Not Found page | P0 |

### 3.5 Deferred / Future Wave Pages

| Page File | Route | Notes |
|---|---|---|
| `MaturitySetup.tsx` | `/maturity/setup` | Deferred — belongs to MMM workspace wave |
| `Dashboard.tsx` | `/dashboard` | Deferred — post-subscription private workspace |
| `Assessment.tsx` | `/assessment` | Deferred — full assessment workspace (private) |
| `MaturityRoadmapInfo.tsx` | `/marketing/maturity-roadmap` | Placeholder acceptable — full MMM marketing page in future wave |

---

## 4. Route Constants (routes.ts)

Target content for `apps/isms-portal/src/lib/routes.ts`:

```typescript
export const ROUTES = {
  // Core public
  HOME: '/',
  MODULES: '/modules',
  JOURNEY: '/journey',
  
  // Assessment and subscription (public)
  FREE_ASSESSMENT: '/free-assessment',
  SUBSCRIBE: '/subscribe',
  SUBSCRIBE_CHECKOUT: '/subscribe/checkout',
  
  // Auth (public)
  AUTH: '/auth',
  INVITATION_ACCEPTANCE: '/accept-invitation',
  
  // Module marketing routes (public)
  MARKETING_MATURITY_ROADMAP: '/marketing/maturity-roadmap',
  MARKETING_RISK_MANAGEMENT: '/marketing/risk-management',
  MARKETING_PROJECT_IMPLEMENTATION: '/marketing/project-implementation',
  MARKETING_DATA_ANALYTICS: '/marketing/data-analytics-assurance',
  MARKETING_SYSTEMS_INTEGRATION: '/marketing/systems-integration',
  MARKETING_SKILLS_DEVELOPMENT: '/marketing/skills-development',
  MARKETING_INCIDENT_INTELLIGENCE: '/marketing/incident-intelligence',
  
  // Legacy route aliases (backward compat — keep for redirects)
  RISK_MANAGEMENT_INFO: '/risk-management-info',
  PIT_INFO: '/pit-info',
  DATA_ANALYTICS_INFO: '/data-analytics-info',
  SKILLS_DEVELOPMENT_INFO: '/skills-development-info',
  INCIDENT_MANAGEMENT_INFO: '/incident-management-info',
  DATA_EXTRACTION_INFO: '/data-extraction-info',
  
  // Private routes (ProtectedRoute required)
  DASHBOARD: '/dashboard',
  MATURITY_SETUP: '/maturity/setup',
  ASSESSMENT: '/assessment',
  TEAM: '/team',
  ORGANIZATION_SETTINGS: '/organization/settings',
  MATURION_KNOWLEDGE_BASE: '/maturion/knowledge-base',
  MATURION_UPLOADS: '/maturion/uploads',
  ADMIN_CONFIG: '/admin/config',
  QA_DASHBOARD: '/qa-dashboard',
  WATCHDOG: '/watchdog',
} as const;
```

---

## 5. App.tsx Routing Structure

The `apps/isms-portal/src/App.tsx` must follow this routing structure:

```tsx
// PUBLIC routes — NO ProtectedRoute
<Route path={ROUTES.HOME} element={<Index />} />
<Route path={ROUTES.MODULES} element={<ModulesOverview />} />
<Route path={ROUTES.JOURNEY} element={<Journey />} />
<Route path={ROUTES.FREE_ASSESSMENT} element={<FreeAssessment />} />
<Route path={ROUTES.SUBSCRIBE} element={<Subscribe />} />
<Route path={ROUTES.SUBSCRIBE_CHECKOUT} element={<SubscribeCheckout />} />
<Route path={ROUTES.AUTH} element={<AuthPage />} />

// Marketing routes — PUBLIC, NO ProtectedRoute
<Route path={ROUTES.MARKETING_RISK_MANAGEMENT} element={<RiskManagementInfo />} />
<Route path={ROUTES.MARKETING_PROJECT_IMPLEMENTATION} element={<PITInfo />} />
<Route path={ROUTES.MARKETING_DATA_ANALYTICS} element={<DataAnalyticsInfo />} />
<Route path={ROUTES.MARKETING_SYSTEMS_INTEGRATION} element={<DataExtractionInfo />} />
<Route path={ROUTES.MARKETING_SKILLS_DEVELOPMENT} element={<SkillsDevelopmentInfo />} />
<Route path={ROUTES.MARKETING_INCIDENT_INTELLIGENCE} element={<IncidentManagementInfo />} />

// Legacy route redirects
<Route path={ROUTES.RISK_MANAGEMENT_INFO} element={<Navigate to={ROUTES.MARKETING_RISK_MANAGEMENT} replace />} />
// ... (other legacy redirects)

// PRIVATE routes — WITH ProtectedRoute
<Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// ...

// Catch-all
<Route path="*" element={<NotFound />} />
```

---

## 6. Component and Hook Stubs Needed

The harvested pages reference hooks/contexts that may not exist in isms-portal yet. The following need to be created as minimal stubs or implemented:

| Hook/Context | Used In | Stub Strategy |
|---|---|---|
| `useAuth` (AuthContext) | `Index.tsx` | Simple stub: `{ user: null, signOut: async () => {} }` |
| `useSubscriptionModules` | `Subscribe.tsx` | Simple stub returning empty modules array |
| `useToast` | `Index.tsx`, `Subscribe.tsx` | Minimal toast hook stub or remove usage |
| `ProtectedRoute` component | `App.tsx` | Simple redirect-to-auth wrapper |

---

## 7. Page Implementation Priority

| Priority | Pages | Reason |
|---|---|---|
| P0 — Must deliver | `Index.tsx`, `FreeAssessment.tsx`, `Subscribe.tsx`, `RiskManagementInfo.tsx`, all other module marketing pages, `NotFound.tsx` | Core acceptance criteria |
| P1 — Should deliver | `ModulesOverview.tsx`, `Journey.tsx`, `SubscribeCheckout.tsx` | Important UX completeness |
| P2 — Acceptable placeholder | `MaturityRoadmapInfo.tsx` | Future MMM wave will fully implement |
| Deferred | Private workspace pages | Out of scope for this wave |

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
