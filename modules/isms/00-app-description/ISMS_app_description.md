# ISMS — Integrated Security Management System
## Top-Level App Description (Platform Authority)

## Status Header

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact Type | App Description (Top-Level Platform Authority) |
| Status | Authoritative Draft for issue implementation |
| Version | v1.0.0 |
| Scope | Top-level ISMS front door, shared platform context, and module routing authority |
| Applies To | ISMS landing/navigation layer and all downstream module interface contracts |
| Canonical File | `modules/isms/00-app-description/ISMS_app_description.md` |

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

## 16) Non-goals for this issue

This issue does **not** implement:

- UI implementation,
- MMM code changes,
- PIT code changes,
- Risk/Incident/RADAM/Skills code changes,
- workflow/database/deployment implementation.

This issue is a **single-file authority definition update** only.

---

## 17) Source Alignment

| Source | How it informed this document |
|---|---|
| `modules/isms/_legacy/original/Integrated_ISMS_Architecture_v1.1.md` | Provided platform-level purpose/vision, landing architecture, module-card behavior, onboarding flow, shared AI, and security principles. |
| `modules/isms/_legacy/original/INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md` | Informed hub-and-spoke integration logic, module responsibility separation, linear operational flow, and routing backbone concepts. |
| `apps/isms-portal/README.md` | Confirmed single unified portal direction, shared auth/context model, and integrated cross-module workflow expectations. |
| `modules/isms/00-app-description/app-description.md` | Highlighted prior ISMS description gap/stub context and need for authoritative top-level articulation. |
| `modules/MMM/00-app-description/MMM_app_description.md` | Informed MMM domain scope and ownership model, and drove explicit boundary corrections so MMM is positioned as an ISMS module rather than the whole platform shell. |

---

## 18) Authority statement

Downstream FRS, TRS, UX, Architecture, Implementation Plan, QA, and module-package alignment for ISMS top-level behavior must derive from this document unless and until it is formally superseded.
