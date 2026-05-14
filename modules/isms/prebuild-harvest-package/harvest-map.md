# Legacy Harvest Map — ISMS Pre-Subscription Landing

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §16
**Version**: v1.0.0

---

## 1. Legacy Source Location

All legacy files are located in:

```
apps/maturion-maturity-legacy/src/
```

This directory is **read-only** for this wave — source for reference and harvest only.
Do NOT modify files in `apps/maturion-maturity-legacy/`.

---

## 2. File-by-File Harvest Classification

### 2.1 PRIMARY HARVEST — ISMS Public Landing

| Legacy File | Classification | Target File | Harvest Scope |
|---|---|---|---|
| `src/pages/Index.tsx` | **HARVEST** | `apps/isms-portal/src/pages/Index.tsx` | Full page — hero, feature cards, domain cards, module discovery, journey section, footer CTA |
| `src/lib/routes.ts` | **HARVEST + ADAPT** | `apps/isms-portal/src/lib/routes.ts` | Route constants — add marketing routes, keep existing routes, correct route names |
| `src/App.tsx` | **ADAPT** | `apps/isms-portal/src/App.tsx` | Routing structure — ADD public routes for marketing pages, DO NOT copy ProtectedRoute pattern for marketing pages |

### 2.2 HARVEST — Subscription Flow

| Legacy File | Classification | Target File | Harvest Scope |
|---|---|---|---|
| `src/pages/Subscribe.tsx` | **HARVEST** | `apps/isms-portal/src/pages/Subscribe.tsx` | Full page — subscription tier cards, pricing, module selection |
| `src/pages/SubscribeCheckout.tsx` | **HARVEST + ADAPT** | `apps/isms-portal/src/pages/SubscribeCheckout.tsx` | Checkout form structure, payment intent flow |

### 2.3 HARVEST — Free Assessment

| Legacy File | Classification | Target File | Harvest Scope |
|---|---|---|---|
| `src/pages/FreeAssessment.tsx` | **HARVEST** | `apps/isms-portal/src/pages/FreeAssessment.tsx` | Full assessment form — 5 domains × 5 questions, results display. Must be PUBLIC route. |

### 2.4 HARVEST — Module Marketing/Explanation Pages

| Legacy File | Classification | Target File | Canonical Name | Route |
|---|---|---|---|---|
| `src/pages/RiskManagementInfo.tsx` | **HARVEST** | `apps/isms-portal/src/pages/RiskManagementInfo.tsx` | Risk Management Framework | `/marketing/risk-management` |
| `src/pages/PITInfo.tsx` | **HARVEST** | `apps/isms-portal/src/pages/PITInfo.tsx` | Project Implementation Tracker | `/marketing/project-implementation` |
| `src/pages/DataAnalyticsInfo.tsx` | **HARVEST** | `apps/isms-portal/src/pages/DataAnalyticsInfo.tsx` | Data Analytics & Remote Assurance | `/marketing/data-analytics-assurance` |
| `src/pages/DataExtractionInfo.tsx` | **HARVEST** | `apps/isms-portal/src/pages/DataExtractionInfo.tsx` | Systems Integration / RADAM | `/marketing/systems-integration` |
| `src/pages/SkillsDevelopmentInfo.tsx` | **HARVEST** | `apps/isms-portal/src/pages/SkillsDevelopmentInfo.tsx` | Skills Development Portal | `/marketing/skills-development` |
| `src/pages/IncidentManagementInfo.tsx` | **HARVEST** | `apps/isms-portal/src/pages/IncidentManagementInfo.tsx` | Incident & Intelligence Hub | `/marketing/incident-intelligence` |

### 2.5 HARVEST + ADAPT — Supporting Pages

| Legacy File | Classification | Target File | Notes |
|---|---|---|---|
| `src/pages/Journey.tsx` | **HARVEST + ADAPT** | `apps/isms-portal/src/pages/Journey.tsx` | ISMS journey and domain discovery. Keep domain structure, update route links. |
| `src/pages/ModulesOverview.tsx` | **HARVEST + ADAPT** | `apps/isms-portal/src/pages/ModulesOverview.tsx` | Module overview page. Rename module cards to canonical names. |

### 2.6 DEFER — Post-Subscription Pages

| Legacy File | Classification | Reason |
|---|---|---|
| `src/pages/MaturitySetup.tsx` | **DEFER** | Post-subscription maturity workspace setup. Belongs to MMM module workflow. Not in this wave. |

---

## 3. Content Section Classification

### 3.1 Index.tsx — Content Sections

| Section | Classification | Action |
|---|---|---|
| Header (logo, nav, sign-in/out buttons) | HARVEST | Keep structure; update button targets to isms-portal routes |
| Hero section ("Your Complete Audit & Improvement Journey") | HARVEST | Keep as-is; update CTA to `/free-assessment` |
| Start Free Assessment CTA button | HARVEST | Keep; route to `/free-assessment` |
| Feature promise cards (15-Minute Start, Expert Guidance, Transparency) | HARVEST | Keep as-is |
| ISMS Journey section (six domain cards) | HARVEST | Keep structure; update domain names to canonical ISMS names |
| Module/tool discovery cards | HARVEST + ADAPT | Keep card structure; rename to canonical module names; update routes to `/marketing/<module>` |
| Professional enablement card ("Security Skills Accelerator") | HARVEST | Keep; link to `/marketing/skills-development` |
| Operational excellence domain cards | HARVEST | Keep; these are the 6 ISMS domains |
| Footer CTA | HARVEST | Keep; update navigation |
| Console.log debug statements | DISCARD | Remove all console.log entries |
| useToast on page load | DISCARD | Remove welcome toast on landing (UX anti-pattern) |

### 3.2 Module Marketing Pages — Standard Structure

All module marketing pages share a standard structure. Harvest and preserve:

```text
1. Badge ("Coming Soon" or "Available") — top right
2. Icon + module name header
3. One-paragraph module description
4. Key Features list (CheckCircle items)
5. Benefits cards (3-card grid: icon, title, description)
6. CTA section: "Subscribe to unlock" / "Learn more" buttons
7. Back to home navigation
```

---

## 4. Naming Corrections

| Legacy Name | Canonical Name (isms-portal) |
|---|---|
| "Maturity Development Journey" (card) | "Maturity Roadmap / MMM" |
| "Risk Management Framework" (card) | "Risk Management" |
| "Action Management System" (card) | "Project Implementation Tracker / PIT" |
| "Access Analytics" (card) | "Data Analytics & Remote Assurance" |
| "Video Surveillance Analysis" (card) | "Systems Integration / RADAM" |
| "Security Skills Accelerator" (card) | "Skills Development Portal" |
| "Process Integrity Testing" (PITInfo title) | "Project Implementation Tracker (PIT)" |
| Six domain names | Keep as-is: Leadership & Governance, Process Integrity, People & Culture, Protection, Proof it Works, Enablement |

---

## 5. Import and Dependency Notes

### 5.1 Required dependencies in isms-portal

The legacy pages use the following imports that must be available in isms-portal:
- `@/components/ui/button` ✓ (shadcn/ui)
- `@/components/ui/card` ✓ (shadcn/ui)
- `@/components/ui/badge` ✓ (shadcn/ui)
- `react-router-dom` (useNavigate) ✓
- `lucide-react` icons ✓

### 5.2 Dependencies to check/add for isms-portal

The following legacy dependencies may need to be added:
- `@/hooks/useSubscriptionModules` — Subscribe.tsx uses this; needs to exist or be stubbed
- `@/contexts/AuthContext` — Index.tsx uses useAuth; needs to exist or be stubbed
- `@/hooks/use-toast` — used in Index.tsx; needs to exist or be removed
- `@/components/ui/switch` — Subscribe.tsx uses Switch; needs to be available

---

## 6. Files to Create New (Not Harvested)

| New File | Purpose |
|---|---|
| `apps/isms-portal/src/App.tsx` | New main app router with all routes |
| `apps/isms-portal/src/main.tsx` | App entry point |
| `apps/isms-portal/index.html` | App HTML shell |
| `apps/isms-portal/vite.config.ts` | Vite build configuration |
| `apps/isms-portal/tailwind.config.ts` | Tailwind configuration |
| `apps/isms-portal/src/index.css` | Global styles |
| `apps/isms-portal/src/pages/NotFound.tsx` | 404 page |
| `apps/isms-portal/package.json` | App package.json (update with required deps) |

These files need to be set up as part of the isms-portal app scaffolding.

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
