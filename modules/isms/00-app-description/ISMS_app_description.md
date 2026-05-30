# ISMS — Integrated Security Management System
## App Description Working Draft (Non-Canonical Module Artifact)

## Status Header

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact Type | App Description (Working Draft / Module Support Artifact) |
| Status | Non-canonical draft for issue implementation |
| Version | v1.2.0 |
| Scope | Top-level ISMS front door, shared platform context, and module routing authority |
| Applies To | ISMS landing/navigation layer and all downstream module interface contracts |
| Canonical File | `docs/governance/ISMS_APP_DESCRIPTION.md` |
| Module-Stage Artifact | `modules/isms/00-app-description/app-description.md` |

> **Authority note:** Canonical App Description authority for ISMS resides in `docs/governance/ISMS_APP_DESCRIPTION.md`. This file is a non-canonical working draft and must not be treated as the authoritative reference.

---

## 1) Product identity

ISMS is the **top-level integrated product** for the Maturion ecosystem.  
It is the **public front door**, **module discovery surface**, and **ecosystem spine** that connects all security capabilities under one governed experience.

ISMS is not a single specialist module. It is the unifying product shell that provides:
- first-touch public entry,
- subscription and onboarding transition,
- shared user/organisation context,
- shared AI assistant access,
- cross-module routing and integration continuity.

---

## 2) Purpose and vision

ISMS exists to provide one integrated security management system where organisations can discover, adopt, and operate a complete security capability stack through a common platform experience.

Vision outcomes:
- one coherent journey from public discovery to private operations,
- one ecosystem-level identity and navigation model,
- one shared context model for user, organisation, and governance state,
- one integrated assistant model ("Ask Maturion") across modules,
- one cross-module evidence/reporting posture for executives, implementers, and auditors.

---

## 3) ISMS as top-level front-door product

### Authoritative position

ISMS is the **top-level product authority** for:
1. public landing and module discovery UX,
2. subscription/sign-up/get-to-know-you entry path,
3. shared navigation shell and route handoff,
4. cross-module context continuity (user, org, role, tenant),
5. cross-module dashboard/reporting framing.

### Explicit correction to ecosystem positioning

- **MMM is a module within ISMS** (Maturity Roadmap capability), not the whole platform.
- PIT, Risk, Incident, RADAM, Skills, and Data/Remote Assurance are also modules within ISMS.
- ISMS remains the upstream product container and front door for all of them.

---

## 4) Public landing page architecture

The public ISMS landing architecture is a staged funnel:

1. **Platform narrative layer** — what ISMS is and why it exists.
2. **Module discovery layer** — card-based discovery of capabilities.
3. **Evaluation layer** — guided preview and “Ask Maturion” explanations.
4. **Conversion layer** — subscription/package selection.
5. **Identity layer** — account creation and organisation onboarding.
6. **Private entry layer** — controlled handoff into subscribed module workspaces.

---

## 5) Module discovery card model

Each public module card must include:
- one-line value proposition,
- hover preview detail,
- click-through behavior,
- Ask Maturion affordance,
- subscription/sign-up path note.

### Required module cards (minimum authority set)

| Module Card | One-line Value Proposition | Hover Preview Detail | Click-Through Behavior | Ask Maturion Affordance | Subscription / Sign-up Path Note |
|---|---|---|---|---|---|
| **Maturity Roadmap / MMM** | Build, assess, and improve maturity using governed Domain→MPS→Criteria models. | Shows baseline assessment, framework setup/import, evidence-led scoring, and roadmap/report branching. | Opens MMM overview and maturity journey entry page within ISMS context. | “Ask Maturion about my maturity baseline and next-level priorities.” | Free assessment and guided onboarding route into subscribed MMM workspace. |
| **Risk Management** | Identify, score, prioritise, and treat enterprise security risk. | Shows threat/vulnerability logic, control effectiveness, and risk treatment planning. | Opens Risk module overview and controlled route handoff from ISMS shell. | “Ask Maturion to explain top risks and treatment options.” | Subscription unlocks full risk register, workflows, and cross-link to PIT/MMM. |
| **Project Implementation Tracker / PIT** | Turn findings and strategies into governed execution work. | Shows project→milestone→deliverable→task structure with evidence-backed completion. | Opens PIT overview and implementation execution workspace route. | “Ask Maturion to convert recommendations into executable implementation plans.” | Subscription provides governed execution spaces and module-connected project tracking. |
| **Incident & Intelligence Hub** | Capture incidents and intelligence signals to improve control decisions. | Shows incident logging, investigation support, and threat-drift signal flow. | Opens Incident & Intelligence overview and response workflow entry route. | “Ask Maturion to summarise incident patterns and response priorities.” | Subscription enables full incident lifecycle and cross-module evidence linkage. |
| **Data Analytics & Remote Assurance** | Continuously validate control performance with data-driven assurance. | Shows integrations, anomaly detection, assurance scoring, and live signal ingestion. | Opens analytics/assurance module overview for data and control monitoring. | “Ask Maturion what the latest assurance signals imply for risk and maturity.” | Subscription enables connector setup, analytics dashboards, and assurance workflows. |
| **Systems Integration / RADAM** | Connect operational systems to produce trusted automation and evidence streams. | Shows system connectors, telemetry ingestion, and cross-system logic checks. | Opens RADAM/system integration overview and connector onboarding route. | “Ask Maturion which integrations should be prioritised first.” | Subscription unlocks integration setup, governed sync, and evidence feed activation. |
| **Skills Development Portal** | Build workforce capability aligned to controls, evidence, and maturity outcomes. | Shows learning pathways, role-based upskilling, and competency evidence. | Opens skills/training overview and capability development routes. | “Ask Maturion which skills gaps block current maturity progression.” | Subscription enables managed learning paths linked to module objectives and audits. |

---

## 6) Subscription/sign-up/get-to-know-you flow

The ISMS-owned conversion and onboarding sequence is:

1. public module exploration,
2. package/subscription selection,
3. payment and account creation,
4. get-to-know-you profile capture (user + organisation),
5. tenant and role initialisation,
6. first module route handoff based on selected package and readiness.

Get-to-know-you minimum context includes:
- user role and responsibilities,
- organisation structure and operating context,
- industry/region and threat profile,
- preferred module starting points,
- AI personalisation preferences.

---

## 7) Module ownership boundaries

## 7.1 Boundary law (issue-intent alignment)

**ISMS owns top-level landing/navigation context. MMM/PIT/Risk/etc own their stated domains.**

## 7.2 Ownership table

| Ownership Area | Canonical Owner |
|---|---|
| Public landing, module discovery, front-door conversion | **ISMS** |
| Subscription/sign-up/get-to-know-you orchestration | **ISMS** |
| Shared shell navigation and route handoff | **ISMS** |
| Shared user/org/tenant context envelope | **ISMS** |
| Shared assistant entry point and cross-module AI continuity | **ISMS + AIMC integration model** |
| Maturity framework and maturity operations | **MMM module** |
| Project implementation execution | **PIT module** |
| Risk scoring/treatment workflows | **Risk Management module** |
| Incident and intelligence workflows | **Incident & Intelligence module** |
| Systems integration and automated feeds (RADAM) | **Systems Integration / RADAM module** |
| Skills and competency workflows | **Skills Development module** |
| Data analytics and remote assurance operations | **Data/Remote Assurance module** |

## 7.3 Explicit boundary statements

- ISMS owns the top-level ecosystem landing/navigation context.
- MMM owns maturity roadmap, maturity frameworks, domains, MPS, criteria, evidence-linked maturity scoring, and maturity dashboard behaviour.
- PIT owns implementation execution, tasks, milestones, project progress, and implementation evidence return.
- Risk Management owns risk identification/assessment registers and related risk workflows.
- Incident & Intelligence owns incident intake, investigation signals, and intelligence/drift feeds.
- Data Analytics & Remote Assurance owns analytics, assurance dashboards, system signal interpretation, and continuous assurance views.
- Systems Integration / RADAM owns system connectors, data extraction, automation hooks, and cross-system checks.
- Skills Development Portal owns learning, qualifications, micro-learning, competency tracking, certificates, and training evidence.

---

## 8) Module links (authoritative pointers)

- MMM (Maturity): `modules/MMM/00-app-description/MMM_app_description.md`
- PIT: `modules/pit/00-app-description/app-description.md`
- Risk Management: `modules/risk-management/00-app-description/app-description.md`
- Incident & Intelligence: `modules/incident-intelligence/00-app-description/app-description.md`
- Systems Integration / RADAM (current system anchor): `modules/xdetect/00-app-description/app-description.md`
- Skills Development (current skills/training anchor): `modules/course-crafter/00-app-description/app-description.md`
- Data/Remote Assurance: governed by ISMS integration authority in this document until dedicated module authority file is published.

---

## 9) Shared user/org context model

ISMS must maintain a shared context envelope across modules:

- tenant/org identity,
- user identity and role graph,
- organisational hierarchy and assignment scope,
- active cycle/journey context,
- cross-module permissions envelope,
- cross-module auditability context (who/what/when/where).

Modules consume this context but do not redefine top-level identity and tenant authority.

---

## 10) Shared AI / Maturion assistant model

“Ask Maturion” is platform-wide and must behave as a shared assistant surface:

- ISMS provides the global assistant entry context.
- Module routes provide domain execution context.
- Assistant responses must remain context-aware to user, org, role, and active module.
- Cross-module prompts may recommend routing, but module execution remains within module ownership boundaries.

---

## 11) Shared evidence, audit, dashboard, and reporting concepts

ISMS defines the shared concepts; modules provide domain payloads.

Shared concepts:
- evidence lineage and traceability,
- event and decision audit trails,
- cross-module executive dashboard framing,
- consolidated reporting posture (maturity/risk/implementation/incidents/assurance),
- governance visibility across modules without collapsing ownership boundaries.

---

## 12) Module integration and routing model

### Integration principle

ISMS routes users into modules while preserving shared context and return-path continuity.

### Routing pattern (authoritative)

`Public Landing -> Module Card -> Module Overview -> Subscribe/Sign-up -> Context Init -> Module Workspace -> Cross-Module Hand-off (when needed) -> Executive Roll-up`

### Handoff rules

1. ISMS performs entry and context handshake.
2. Target module performs domain workflow and data operations.
3. Cross-module handoffs are explicit, logged, and permission-checked.
4. User can always return to ISMS shell without losing context continuity.

---

## 13) Security, roles, permissions, and audit-trail principles

1. role-based access control across all modules,
2. least privilege by default,
3. tenant isolation and organisation boundary enforcement,
4. immutable audit logging for material actions,
5. explicit approval/escalation paths for sensitive operations,
6. shared governance observability from ISMS shell without domain data ownership drift.

---

## 14) Future expansion hooks

ISMS must support controlled expansion without redefining top-level authority:

- new module card registration in discovery model,
- standardised route-handoff contract for new modules,
- extensible shared context envelope,
- pluggable integrations and evidence feeds,
- future mobile, API marketplace, and external ecosystem entry points.

---

## 15) Explicit downstream MMM app-description adjustment list

To align MMM with this ISMS top-level authority, MMM downstream updates should:

1. explicitly state MMM is a **module inside ISMS**, not ecosystem front door.
2. replace any “platform front door” wording with “maturity domain module entry via ISMS”.
3. keep MMM as canonical owner of maturity framework/content operations only.
4. reference ISMS ownership of public landing, conversion flow, and shared shell navigation.
5. reference ISMS shared context envelope (user/org/tenant) as upstream dependency.
6. reference shared “Ask Maturion” model as platform-level, with MMM domain specialization.
7. preserve MMM internal authority (Domain/MPS/Criteria/evidence/maturity scoring) while affirming route handoff origin from ISMS.

---

## 16) Legacy Pre-Subscription Harvest Authority

> **Authority for issue #1645, issue #1727, and all future ISMS public-landing/marketing harvest waves.**

### 16.1 Original workflow-map authority

The user-provided original ISMS/Maturity Roadmap workflow map is now an explicit authority input for the ISMS public app layer.

The intended pre-subscription flow is:

```text
Pre-subscription
  -> Main landing page
    -> Maturity Roadmap / MMM
      -> Journey page
      -> Free assessment
    -> Risk Management
      -> Explanation / marketing page
    -> Project Implementation Tracker / PIT
      -> Explanation / marketing page
    -> Data Analytics & Remote Assurance
      -> Explanation / marketing page
    -> Skills Development Portal
      -> Explanation / marketing page
    -> Incident & Intelligence Hub
      -> Explanation / marketing page
    -> Systems Integration / RADAM
      -> Explanation / marketing page
  -> Subscribe page
    -> Sign-up / authentication
      -> Get-to-know-you onboarding
        -> Subscribed module workspace entry
```

This flow is a governing ISMS app requirement. The public app must let a potential subscriber browse, learn, compare, perform a practical pre-subscription exercise where available, subscribe, create an account, provide organisation context, and only then enter subscribed private module workspaces.

The Maturity Roadmap / MMM branch currently has the richest legacy implementation because the legacy build was originally maturity-led. The other module branches must preserve the same ISMS pattern even where their practical pre-subscription exercise is not yet designed.

### 16.2 Pre-subscription intent

The pre-subscription layer exists so an unauthenticated visitor can:

1. understand the ISMS house model and platform purpose;
2. browse the major capability modules;
3. read explanation / marketing content for each module;
4. use hover / click / Ask Maturion style learning affordances to move from short explanations to deeper subject-matter understanding;
5. take the free Maturity Roadmap / MMM assessment as the first practical exercise;
6. review subscription options;
7. complete checkout or sign-up;
8. provide get-to-know-you organisation and user context;
9. enter the subscribed module workspace with ISMS context already established.

This layer precedes MMM private build/configuration. It is not the MMM workspace itself.

### 16.3 Approved legacy harvest sources

The following legacy source files (located in `apps/maturion-maturity-legacy/src/`) are **approved harvest sources** for the ISMS public landing and module marketing pages:

| Legacy File | Legacy Purpose | Harvest Classification | Target in isms-portal | ISMS Meaning |
|---|---|---|---|---|
| `src/pages/Index.tsx` | Public landing page | **HARVEST** | `apps/isms-portal/src/pages/Index.tsx` | Main ISMS front door and module discovery surface |
| `src/pages/FreeAssessment.tsx` | Free maturity assessment | **HARVEST** | `apps/isms-portal/src/pages/FreeAssessment.tsx` | Practical pre-subscription exercise for Maturity Roadmap / MMM |
| `src/pages/Subscribe.tsx` | Subscription/pricing page | **HARVEST** | `apps/isms-portal/src/pages/Subscribe.tsx` | Package selection and conversion step |
| `src/pages/SubscribeCheckout.tsx` | Checkout flow | **HARVEST** | `apps/isms-portal/src/pages/SubscribeCheckout.tsx` | Payment / subscription completion step |
| `src/pages/RiskManagementInfo.tsx` | Risk marketing/explanation page | **HARVEST** | `apps/isms-portal/src/pages/RiskManagementInfo.tsx` | Risk Management public explanation branch |
| `src/pages/PITInfo.tsx` | PIT marketing/explanation page | **HARVEST** | `apps/isms-portal/src/pages/PITInfo.tsx` | Project Implementation Tracker public explanation branch |
| `src/pages/DataAnalyticsInfo.tsx` | Analytics marketing/explanation page | **HARVEST** | `apps/isms-portal/src/pages/DataAnalyticsInfo.tsx` | Data Analytics & Remote Assurance public explanation branch |
| `src/pages/DataExtractionInfo.tsx` | Data extraction / systems page | **HARVEST** | `apps/isms-portal/src/pages/DataExtractionInfo.tsx` | Systems Integration / RADAM public explanation branch |
| `src/pages/SkillsDevelopmentInfo.tsx` | Skills marketing/explanation page | **HARVEST** | `apps/isms-portal/src/pages/SkillsDevelopmentInfo.tsx` | Skills Development Portal public explanation branch |
| `src/pages/IncidentManagementInfo.tsx` | Incident marketing/explanation page | **HARVEST** | `apps/isms-portal/src/pages/IncidentManagementInfo.tsx` | Incident & Intelligence Hub public explanation branch |
| `src/pages/Journey.tsx` | Maturity journey / house model walkthrough | **HARVEST + ADAPT** | `apps/isms-portal/src/pages/Journey.tsx` | Public learning page explaining the maturity journey and house/domain model |
| `src/pages/ModulesOverview.tsx` | Module catalogue | **HARVEST + ADAPT** | `apps/isms-portal/src/pages/ModulesOverview.tsx` | Public catalogue of ISMS modules |
| `src/pages/MaturityRoadmapInfo.tsx` | No legacy equivalent | **CREATE** | `apps/isms-portal/src/pages/MaturityRoadmapInfo.tsx` | Public MMM/Maturity Roadmap marketing page required by ISMS module-card model |
| `src/pages/MaturitySetup.tsx` | Post-subscription maturity setup | **DEFER** | N/A for public harvest | Private MMM workspace handoff target, not public landing content |
| `src/pages/Assessment.tsx` | Authenticated assessment execution | **DEFER / BOUNDARY REVIEW** | N/A until handoff resolved | Private MMM assessment route unless a public-lite assessment flow is explicitly designed |
| `src/pages/Dashboard.tsx` | Authenticated dashboard | **DEFER** | N/A for public harvest | Private workspace/dashboard content |
| `src/App.tsx` | Legacy routing | **ADAPT** | `apps/isms-portal/src/App.tsx` | Routing concepts may be harvested, but auth boundaries must be corrected |
| `src/lib/routes.ts` | Legacy route constants | **HARVEST + ADAPT** | `apps/isms-portal/src/lib/routes.ts` | Canonical ISMS route constants and legacy redirects |

### 16.4 Legacy public-scope inventory and boundary correction

The legacy app already contains the core pre-subscription source components. Discovery confirmed these public-scope legacy pages:

| # | Legacy Page | Legacy Route | Legacy Auth State | ISMS Desired State |
|---|---|---|---|---|
| 1 | `Index.tsx` | `/` | Public | Public ISMS landing |
| 2 | `FreeAssessment.tsx` | `/free-assessment` | Incorrectly protected | Public free assessment |
| 3 | `Subscribe.tsx` | `/subscribe` | Public | Public subscription page |
| 4 | `SubscribeCheckout.tsx` | `/subscribe/checkout` | Public | Public checkout page |
| 5 | `Journey.tsx` | `/journey` | Incorrectly protected | Public journey / house model page |
| 6 | `ModulesOverview.tsx` | `/modules` | Not wired in legacy | Public module catalogue |
| 7 | `RiskManagementInfo.tsx` | `/risk-management-info` | Incorrectly protected | Public `/marketing/risk-management` |
| 8 | `PITInfo.tsx` | `/pit-info` | Incorrectly protected | Public `/marketing/project-implementation` |
| 9 | `DataAnalyticsInfo.tsx` | `/data-analytics-info` | Incorrectly protected | Public `/marketing/data-analytics-assurance` |
| 10 | `DataExtractionInfo.tsx` | `/data-extraction-info` | Incorrectly protected | Public `/marketing/systems-integration` |
| 11 | `SkillsDevelopmentInfo.tsx` | `/skills-development-info` | Incorrectly protected | Public `/marketing/skills-development` |
| 12 | `IncidentManagementInfo.tsx` | `/incident-management-info` | Incorrectly protected | Public `/marketing/incident-intelligence` |

The legacy `App.tsx` wrapped `/journey`, `/free-assessment`, and the module explanation pages in `ProtectedRoute`. This is explicitly rejected for ISMS. These routes are pre-subscription learning, marketing, and conversion assets and must remain public.

### 16.5 Main landing page harvest requirements

`src/pages/Index.tsx` is the **primary ISMS public landing harvest source**.

It already contains:
- Hero section with "Your Complete Audit & Improvement Journey" narrative;
- Start Free Assessment CTA;
- feature promise cards (15-Minute Start, Expert Guidance, Complete Transparency);
- Integrated ISMS Journey section;
- Maturity / module discovery cards;
- professional enablement card;
- operational excellence / domain cards;
- footer CTA.

This content must be **modernised** into the isms-portal app structure:
- rename journey/module card references to current canonical module names;
- update navigation to point to correct ISMS routes, not legacy routes;
- route Maturity Roadmap / MMM to `/marketing/maturity-roadmap`;
- route Risk, PIT, Data/Analytics, Systems/RADAM, Skills, and Incident to `/marketing/*` routes;
- preserve the visual hierarchy and buyer-learning journey;
- remove debug `console.log` statements;
- remove legacy welcome `useToast` on page load;
- preserve accessibility and responsiveness obligations.

### 16.6 Journey page and house-model learning authority

`src/pages/Journey.tsx` is a required public learning page.

Its purpose is to let a visitor fiddle around with, read about, and understand the Maturion maturity journey / house model before subscribing.

The page must explain the maturity/domain structure at a public-friendly level and provide onward routes to:
- Maturity Roadmap / MMM marketing page;
- free assessment;
- subscription page;
- other module explanation pages where relevant.

The public Journey page may explain the Maturity Roadmap concept, maturity levels, and domain model, but it must not become the authenticated MMM configuration workspace. Deep audit configuration, Domain→MPS→Criteria editing, evidence upload, approval, publication, and scoring remain MMM private module responsibilities.

### 16.7 Free assessment harvest authority

`src/pages/FreeAssessment.tsx` is the approved public practical exercise for the Maturity Roadmap / MMM branch.

The free assessment must:
- remain public and unauthenticated;
- clearly state that it is tied to Maturity Roadmap / MMM;
- capture enough high-level information to produce an indicative maturity baseline;
- feed the subscription path with visible value;
- preserve the user’s assessed maturity baseline for later get-to-know-you / MMM first-run context where technically available;
- route onward to subscribe, sign-up, or a clearly governed public assessment result flow.

The free assessment does not replace authenticated MMM assessment execution. It is a pre-subscription teaser, baseline, and conversion bridge.

If a user subscribes without completing the free assessment, the post-subscription onboarding / MMM first-run flow should prompt the user to complete or confirm an initial maturity baseline before starting private audit configuration.

### 16.8 Module marketing/explanation pages

The following pages serve as **marketing/explanation harvest sources** for their respective modules. They must be harvested, kept public/unauthenticated, and renamed to current canonical names:

| Legacy Name | Current Canonical Name | Route | Notes |
|---|---|---|---|
| RiskManagementInfo | Risk Management module marketing | `/marketing/risk-management` | Must explain risk as both a standalone module and maturity evidence contributor |
| PITInfo | Project Implementation Tracker marketing | `/marketing/project-implementation` | Must explain implementation tracking and future handoff from MMM recommendations |
| DataAnalyticsInfo | Data Analytics & Remote Assurance marketing | `/marketing/data-analytics-assurance` | Must explain assurance signals and maturity/risk evidence value |
| DataExtractionInfo | Systems Integration / RADAM marketing | `/marketing/systems-integration` | Must explain data extraction, integrations, and evidence stream activation |
| SkillsDevelopmentInfo | Skills Development Portal marketing | `/marketing/skills-development` | Must explain skills pathways, role competence, and evidence of capability |
| IncidentManagementInfo | Incident & Intelligence Hub marketing | `/marketing/incident-intelligence` | Must explain incident lifecycle, intelligence signals, and maturity/risk feedback |
| MaturityRoadmapInfo | Maturity Roadmap / MMM marketing | `/marketing/maturity-roadmap` | Must be created/adapted as the public MMM branch; legacy had no separate equivalent |

Each marketing page structure must include:
1. badge or status marker;
2. icon + module name header;
3. one-paragraph module description;
4. key features list;
5. benefits cards;
6. CTA to subscribe;
7. optional CTA to free assessment where relevant;
8. back navigation to ISMS landing or module catalogue;
9. Ask Maturion affordance where available.

### 16.9 Practical exercise pattern for non-MMM modules

The Maturity Roadmap branch currently uses the free assessment as its practical pre-subscription exercise.

Future module branches may define equivalent practical exercises, but they are not required to block the initial public harvest. Examples may include:
- Risk Management: lightweight risk posture self-check;
- PIT: implementation readiness checklist;
- Data Analytics & Remote Assurance: assurance-data readiness check;
- Systems Integration / RADAM: integration readiness scan;
- Skills Development: role/skills gap self-check;
- Incident & Intelligence: incident response readiness self-check.

Until those exercises are designed and governed, each non-MMM module branch must at minimum provide a public explanation page and a route into subscription.

### 16.10 Public/unauthenticated route authority

**Marketing routes must remain unauthenticated.** No `ProtectedRoute` wrapper for any of the following:

| Route | Public Status | Note |
|---|---|---|
| `/` | PUBLIC | ISMS main landing page |
| `/modules` | PUBLIC | Module overview/discovery |
| `/journey` | PUBLIC | ISMS journey and domain discovery |
| `/free-assessment` | PUBLIC | Free assessment tied to MMM/Maturity Roadmap |
| `/subscribe` | PUBLIC | Subscription/pricing page |
| `/subscribe/checkout` | PUBLIC | Checkout flow |
| `/marketing/maturity-roadmap` | PUBLIC | MMM/Maturity Roadmap module marketing |
| `/marketing/risk-management` | PUBLIC | Risk Management module marketing |
| `/marketing/project-implementation` | PUBLIC | PIT module marketing |
| `/marketing/data-analytics-assurance` | PUBLIC | Data Analytics & Remote Assurance marketing |
| `/marketing/systems-integration` | PUBLIC | Systems Integration / RADAM marketing |
| `/marketing/skills-development` | PUBLIC | Skills Development Portal marketing |
| `/marketing/incident-intelligence` | PUBLIC | Incident & Intelligence Hub marketing |
| `/auth` | PUBLIC | Authentication entry |
| `/accept-invitation` | PUBLIC | Invitation acceptance |

**Private (authenticated) routes** remain in `ProtectedRoute` as before, including `/dashboard`, `/assessment`, `/maturity/setup`, `/team`, `/organization/settings`, admin routes, and module workspaces.

### 16.11 Route protection correction mandate

> ⚠️ **DO NOT blindly copy legacy route protection from `App.tsx`.**

In the legacy `apps/maturion-maturity-legacy/src/App.tsx`, the following routes are incorrectly wrapped in `ProtectedRoute`:

```text
/journey
/free-assessment
/risk-management-info
/pit-info
/data-analytics-info
/skills-development-info
/incident-management-info
/data-extraction-info
```

These are **public marketing and pre-subscription exploration routes** in the ISMS authority model. They must be **public and unauthenticated** in the isms-portal `App.tsx`.

Harvest UI/content/layout concepts from the legacy pages; **correct the routing boundaries**.

### 16.12 Harvest, adapt, defer, discard classification

| Classification | Definition | Examples |
|---|---|---|
| **HARVEST** | Copy directly with minimal changes; adapt naming/imports | Index hero sections, free assessment, subscription pages, module marketing page structures |
| **HARVEST + ADAPT** | Copy content but modernise: rename, reroute, update imports, correct auth boundaries | Journey, ModulesOverview, App routing, routes constants |
| **CREATE** | New public asset required by ISMS authority where legacy has no equivalent | MaturityRoadmapInfo public MMM marketing page; future module practical exercise pages |
| **DEFER** | Not included in this public wave; scheduled for module-specific or post-subscription wave | MaturitySetup, authenticated assessment execution, dashboard, evidence management |
| **DISCARD** | Legacy pattern that must NOT be carried forward | ProtectedRoute wrapping of marketing pages, debug console logs, welcome toast on public landing load |

### 16.13 ISMS→module→subscribe→get-to-know-you sequence preservation

The canonical user journey sequence must be preserved:

```text
ISMS Public Landing (/)
  -> Module Discovery Card click
    -> Module Marketing/Explanation Page (/marketing/<module>)
      -> Optional Practical Exercise where available
        -> Subscribe CTA
          -> Subscription/Package Selection (/subscribe)
            -> Checkout (/subscribe/checkout)
              -> Account Creation (/auth)
                -> Get-To-Know-You profile (/onboarding or MMM first-run)
                  -> Subscribed Module Workspace entry
```

This sequence is **sacred** and must not be broken in this or any subsequent wave.

### 16.14 Get-to-know-you and subscribed-module entry authority

The get-to-know-you stage is an ISMS-owned context initialisation step.

It must collect, or confirm, enough information to initialise:
- tenant / organisation identity;
- user identity and primary role;
- organisation size, structure, operating context, industry, and region;
- threat / risk profile at a high level;
- selected subscription package and enabled modules;
- preferred starting module;
- initial maturity baseline where available;
- AI personalisation preferences.

After get-to-know-you, the private landing experience may visually resemble the public landing page with module cards and tutorial affordances, but access state changes:
- subscribed modules become available for workspace navigation;
- unsubscribed modules remain visible as learning / marketing / upsell surfaces;
- attempts to enter an unsubscribed module should route through explanation → subscription → sign-up / upgrade → get-to-know-you update → module page loop;
- all module access must remain permission-checked and logged.

### 16.15 MMM module identity statement

> **MMM remains the Maturity Roadmap module page. MMM is NOT the ISMS landing page.**

- The ISMS landing page (`/`) is the **top-level platform front door**.
- MMM (`/marketing/maturity-roadmap` for public; `/maturity/setup` or other governed MMM entry for private) is the **Maturity Roadmap module** within ISMS.
- The Free Assessment at `/free-assessment` is tied to MMM/Maturity Roadmap because it assesses maturity domains.
- MMM's own module card on the ISMS landing page must clearly link to the MMM/Maturity Roadmap module, not replace the ISMS landing experience.
- Deep MMM build flows — audit configuration, Domain→MPS→Criteria generation, evidence upload/connect, approval loops, publication, scoring, and dashboard — are downstream MMM responsibilities, not public ISMS harvest scope.

### 16.16 Immediate known gaps to preserve for downstream planning

The discovery work identified the following gaps that must be captured for downstream UX/FRS/TRS planning:

| Gap | Impact | Required downstream decision |
|---|---|---|
| `/onboarding` route missing | Subscribe/sign-up/get-to-know-you loop is incomplete | Define ISMS onboarding page and context contract |
| MMM handoff contract undefined | Post-onboarding route into MMM is unclear | Decide whether MMM is internal route or separate deployment handoff |
| `FreeAssessment.tsx` may route to `/assessment` | Can create public-to-private broken route if `/assessment` is not wired | Define public result flow vs authenticated MMM assessment route |
| `MATURITY_SETUP` defined but not always wired | MMM private entry may be missing | Wire or redirect according to MMM handoff decision |
| PIT has public marketing only | No authenticated PIT entry point yet | Reserve future `/pit` or governed PIT route |
| Non-MMM practical exercises absent | Other modules lack equivalent teaser exercises | Define future module-specific practical exercises if needed |

These gaps do not invalidate the harvest. They define the next pre-build and implementation obligations.

---

## 17) Non-goals for the original app-description issue (#1637)

The original issue (#1637) did **not** implement:

- UI implementation,
- MMM code changes,
- PIT code changes,
- Risk/Incident/RADAM/Skills code changes,
- workflow/database/deployment implementation.

Issue #1637 was a **single-file authority definition update** only.

---

## 18) Source Alignment

| Source | How it informed this document |
|---|---|
| User-provided original workflow map and Maturity Roadmap narrative | Established the public pre-subscription journey: main landing, module branches, journey/learning pages, free assessment, subscribe, sign-up, get-to-know-you, and subscribed module entry. |
| `modules/isms/_legacy/original/Integrated_ISMS_Architecture_v1.1.md` | Provided platform-level purpose/vision, landing architecture, module-card behavior, onboarding flow, shared AI, and security principles. |
| `modules/isms/_legacy/original/INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md` | Informed hub-and-spoke integration logic, module responsibility separation, linear operational flow, and routing backbone concepts. |
| `apps/maturion-maturity-legacy/src/App.tsx` | Confirmed legacy pre-subscription pages and the route-protection anomaly that must be corrected in ISMS. |
| `apps/maturion-maturity-legacy/src/pages/*` | Provided harvestable public landing, free assessment, journey, subscription, checkout, and module explanation page concepts. |
| `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md` | Confirmed legacy file inventory, current portal inventory, CTA wiring, MMM handoff gaps, and PIT placeholder decisions. |
| `apps/isms-portal/README.md` | Confirmed single unified portal direction, shared auth/context model, and integrated cross-module workflow expectations. |
| `modules/isms/00-app-description/app-description.md` | Highlighted prior ISMS description gap/stub context and need for authoritative top-level articulation. |
| `modules/MMM/00-app-description/MMM_app_description.md` | Informed MMM domain scope and ownership model, and drove explicit boundary corrections so MMM is positioned as an ISMS module rather than the whole platform shell. |

---

## 19) Authority statement

Downstream FRS, TRS, UX, Architecture, Implementation Plan, QA, and module-package alignment for ISMS top-level behavior must derive from this document and the Stage 1 §AD-01–§AD-24 traceability mapping below unless and until this App Description is formally superseded.

---

## 20) Stage 1 mandatory AD-01–AD-24 traceability

This top-level platform authority uses the numbered sections above as the primary narrative structure. The following matrix provides the mandatory Stage 1 mapping required for downstream traceability. Where a requirement is not owned at top-level platform authority, it is marked **N/A** with justification and delegated to downstream module App Descriptions and derived artefacts.

| AD ID | Coverage status | Traceability / justification |
|---|---|---|
| §AD-01 | Addressed | Covered by the document title, status header, product identity, and canonical file metadata defining the app and its authority scope. |
| §AD-02 | Addressed | Covered by the status header and top-level scope statements defining this as the ISMS platform authority. |
| §AD-03 | Addressed | Covered by the product identity and purpose sections describing ISMS as the integrated platform front door. |
| §AD-04 | Addressed | Covered by the scope and applies-to statements defining the landing/navigation layer and downstream module interface authority. |
| §AD-05 | Addressed | Covered by the platform vision, user entry, module routing, and shared experience narrative in the main body. |
| §AD-06 | Addressed | Covered by the sections describing intended users, cross-module actors, and top-level interaction responsibilities. |
| §AD-07 | Addressed | Covered by the functional platform responsibilities, landing behavior, onboarding intent, and module access/routing descriptions. |
| §AD-08 | Addressed | Covered by the boundary statements that distinguish top-level platform authority from MMM, PIT, Risk, Incident, RADAM, Skills, and implementation concerns. |
| §AD-09 | Addressed | Covered by the integration and hub-and-spoke descriptions that explain relationships between the ISMS shell and downstream modules. |
| §AD-10 | Addressed | Covered by the shared context/authentication/navigation principles described for the unified portal experience. |
| §AD-11 | Addressed | Covered by the UX and user-flow intent already established for the ISMS landing layer and module-card navigation model, expanded by Section 16 workflow-map authority. |
| §AD-12 | Addressed | Covered by the shared AI/platform principles and cross-module orchestration statements in the existing narrative. |
| §AD-13 | Addressed | Covered by the security principles and platform-level governance expectations referenced from source-aligned legacy architecture. |
| §AD-14 | Addressed | Covered by the constraints and explicit exclusions section, including what this issue does not authorize or implement. |
| §AD-15 | Addressed | Covered by the dependency and downstream derivation model: module packages, FRS/TRS/UX/Architecture, and shared platform contracts. |
| §AD-16 | Addressed | Covered by the platform ownership/authority language and the statement that this file is the governing top-level App Description. |
| §AD-17 | Addressed | Covered by Source Alignment, which traces this authority to legacy and current source documents. |
| §AD-18 | Addressed | Covered by Authority statement, which defines downstream derivation obligations. |
| §AD-19 | Addressed | This section itself provides the mandatory Stage 1 traceability mechanism required for governance validation. |
| §AD-20 | N/A — top-level platform authority | Detailed module-specific functional decomposition belongs in downstream module App Descriptions and derived FRS/TRS artefacts, not in this cross-platform authority file. |
| §AD-21 | N/A — top-level platform authority | Detailed technical solution design, build implementation, and deployment architecture are intentionally excluded here and must be specified in downstream architecture/TRS artefacts. |
| §AD-22 | N/A — top-level platform authority | Detailed test design, verification procedures, and acceptance evidence belong in derived QA and implementation artefacts rather than this Stage 1 authority document. |
| §AD-23 | Addressed | Covered by the explicit exclusions and downstream derivation rules that constrain how later artefacts may elaborate this platform authority. |
| §AD-24 | Addressed | Covered by the canonical-file declaration, version/status metadata, source alignment, and this complete traceability matrix for governance gate verification. |

**Top-level authority note:** Any downstream artefact claiming derivation from this App Description must preserve traceability back to the relevant AD rows above and must not contradict the scope, boundary, and authority constraints defined in this file.
