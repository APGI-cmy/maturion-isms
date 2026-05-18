# Public/Private Route Boundary Map — ISMS Public Landing Harvest

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §16.4 and §16.5
**Version**: v1.0.0

---

## 1. Route Boundary Authority

> ⚠️ **MANDATORY**: Public routes MUST NOT be wrapped in ProtectedRoute.
> The legacy App.tsx incorrectly wrapped several marketing routes in ProtectedRoute.
> That pattern must NOT be copied.

---

## 2. Public Routes (Unauthenticated)

These routes MUST be accessible without authentication in `apps/isms-portal/src/App.tsx`:

| Route | Component | Legacy Route | Notes |
|---|---|---|---|
| `/` | `Index` | `/` | ISMS main landing page — no auth required |
| `/modules` | `ModulesOverview` | `/modules` | Module discovery overview — no auth required |
| `/journey` | `Journey` | `/journey` (was ProtectedRoute ❌) | ISMS domain journey — NOW PUBLIC |
| `/free-assessment` | `FreeAssessment` | `/free-assessment` (was ProtectedRoute ❌) | Free assessment — NOW PUBLIC |
| `/subscribe` | `Subscribe` | `/subscribe` | Subscription/pricing — no auth required |
| `/subscribe/checkout` | `SubscribeCheckout` | `/subscribe/checkout` | Checkout — no auth required |
| `/marketing/maturity-roadmap` | `MaturityRoadmapInfo` (placeholder) | N/A (new) | MMM marketing page — PUBLIC |
| `/marketing/risk-management` | `RiskManagementInfo` | `/risk-management-info` (was ProtectedRoute ❌) | Risk Management marketing — NOW PUBLIC |
| `/marketing/project-implementation` | `PITInfo` | `/pit-info` (was ProtectedRoute ❌) | PIT marketing — NOW PUBLIC |
| `/marketing/data-analytics-assurance` | `DataAnalyticsInfo` | `/data-analytics-info` (was ProtectedRoute ❌) | Data Analytics marketing — NOW PUBLIC |
| `/marketing/systems-integration` | `DataExtractionInfo` | `/data-extraction-info` (was ProtectedRoute ❌) | RADAM marketing — NOW PUBLIC |
| `/marketing/skills-development` | `SkillsDevelopmentInfo` | `/skills-development-info` (was ProtectedRoute ❌) | Skills marketing — NOW PUBLIC |
| `/marketing/incident-intelligence` | `IncidentManagementInfo` | `/incident-management-info` (was ProtectedRoute ❌) | Incident marketing — NOW PUBLIC |
| `/auth` | `LoginForm` (or placeholder) | `/auth` | Auth entry — no auth required |
| `/accept-invitation` | `InvitationAcceptance` (placeholder) | `/accept-invitation` | Invitation — no auth required |

### Legacy Route Redirects (backward compatibility)

For backward compatibility, maintain redirects from legacy routes to new canonical routes:

| Legacy Route | Redirect To | Type |
|---|---|---|
| `/risk-management-info` | `/marketing/risk-management` | 301 redirect |
| `/pit-info` | `/marketing/project-implementation` | 301 redirect |
| `/data-analytics-info` | `/marketing/data-analytics-assurance` | 301 redirect |
| `/data-extraction-info` | `/marketing/systems-integration` | 301 redirect |
| `/skills-development-info` | `/marketing/skills-development` | 301 redirect |
| `/incident-management-info` | `/marketing/incident-intelligence` | 301 redirect |

---

## 3. Private Routes (Authenticated — ProtectedRoute required)

These routes MUST be wrapped in ProtectedRoute in `apps/isms-portal/src/App.tsx`:

| Route | Component | Notes |
|---|---|---|
| `/dashboard` | `Dashboard` | User dashboard — requires auth |
| `/assessment` | `Assessment` | Full assessment workspace — requires auth |
| `/assessment/framework` | `AuditStructureConfig` | Assessment framework — requires auth |
| `/maturity/setup` | `MaturitySetup` | Maturity workspace setup — requires auth |
| `/team` | `TeamPage` | Team management — requires auth |
| `/organization/settings` | `OrganizationSettings` | Org settings — requires auth |
| `/maturion/knowledge-base` | `MaturionKnowledgeBase` | AI knowledge base — requires auth |
| `/maturion/uploads` | `MaturionUploads` | Document uploads — requires auth |
| `/admin/*` | Admin pages | Requires auth + admin role |
| `/qa-dashboard` | `UnifiedQADashboard` | QA tools — requires auth |
| `/watchdog` | `WatchdogDashboard` | Watchdog — requires auth |
| `/audit/domain/:domainId` | `DomainAuditBuilder` | Domain audit — requires auth |
| `/milestones/:id` | `MilestoneDetail` | Milestone detail — requires auth |

---

## 4. Route Implementation Pattern

```tsx
// PUBLIC route (NO ProtectedRoute wrapper):
<Route path={ROUTES.JOURNEY} element={<Journey />} />
<Route path={ROUTES.FREE_ASSESSMENT} element={<FreeAssessment />} />
<Route path={ROUTES.RISK_MANAGEMENT_INFO} element={<RiskManagementInfo />} />

// PRIVATE route (WITH ProtectedRoute wrapper):
<Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

> **Note**: The AppLayout wrapper (sidebar navigation) is also private. Marketing pages do NOT use AppLayout.

---

## 5. Route Constants (routes.ts)

New and updated route constants for `apps/isms-portal/src/lib/routes.ts`:

```typescript
// Public marketing routes (NEW)
MARKETING_MATURITY_ROADMAP: '/marketing/maturity-roadmap',
MARKETING_RISK_MANAGEMENT: '/marketing/risk-management',
MARKETING_PROJECT_IMPLEMENTATION: '/marketing/project-implementation',
MARKETING_DATA_ANALYTICS: '/marketing/data-analytics-assurance',
MARKETING_SYSTEMS_INTEGRATION: '/marketing/systems-integration',
MARKETING_SKILLS_DEVELOPMENT: '/marketing/skills-development',
MARKETING_INCIDENT_INTELLIGENCE: '/marketing/incident-intelligence',
MODULES: '/modules',

// Legacy routes (kept for backward compat redirect)
RISK_MANAGEMENT_INFO: '/risk-management-info',
PIT_INFO: '/pit-info',
DATA_ANALYTICS_INFO: '/data-analytics-info',
SKILLS_DEVELOPMENT_INFO: '/skills-development-info',
INCIDENT_MANAGEMENT_INFO: '/incident-management-info',
DATA_EXTRACTION_INFO: '/data-extraction-info',
```

---

## 6. Route Boundary Violation Prevention

### 6.1 Pre-commit checklist

Before every UI commit, verify:
- [ ] `grep -r "ProtectedRoute" apps/isms-portal/src/pages/` returns only private workspace pages
- [ ] All `/marketing/` routes are accessible in browser without login
- [ ] `/free-assessment` is accessible without login
- [ ] `/journey` is accessible without login
- [ ] `/modules` is accessible without login
- [ ] Visiting `/dashboard` without auth redirects to `/auth`

### 6.2 Anti-patterns that are BLOCKED

```tsx
// ❌ BLOCKED — must never appear in isms-portal App.tsx for marketing pages
<Route path={ROUTES.JOURNEY} element={<ProtectedRoute><Journey /></ProtectedRoute>} />
<Route path={ROUTES.FREE_ASSESSMENT} element={<ProtectedRoute><FreeAssessment /></ProtectedRoute>} />
<Route path={ROUTES.RISK_MANAGEMENT_INFO} element={<ProtectedRoute><RiskManagementInfo /></ProtectedRoute>} />
```

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
