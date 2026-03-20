# MMM Strategy — Maturity Model Management Convergence Strategy

**Document Type**: Product and Architecture Strategy  
**Status**: DRAFT — For CS2 review, refinement, and canonisation  
**Version**: 0.1.0  
**Date**: 2026-03-20  
**Owner**: CS2 / Johan Ras  
**Product**: MMM — Maturity Model Management  
**Supersedes (conceptually, not yet canonically)**:
- MAT — Manual Audit Tool
- Maturity Roadmap
- selected legacy maturity capabilities from `apps/maturion-maturity-legacy`

---

## 0. Executive Summary

This strategy defines the convergence path for the Maturion maturity capability into a single new canonical product: **MMM — Maturity Model Management**.

The purpose of MMM is to replace the current fragmented maturity landscape, where:
- the **Maturity Roadmap** contains the broader maturity governance, dashboard, approval, and action-planning logic,
- **MAT** contains portable audit execution, evidence capture, criteria upload, AI-assisted scoring, and executable reporting logic,
- and the **legacy maturity app** contains valuable framework-generation, document handling, knowledge, and reusable UI assets.

The strategy is to **create a new canonical maturity product**, not to continue patching one app into another.

MMM will:
- retain the **Maturity Roadmap** as the primary conceptual backbone,
- absorb the most valuable and proven capabilities from **MAT**,
- harvest the strongest reusable assets from the **legacy maturity platform**,
- depend centrally on **AIMC** for AI functionality,
- depend on the **Knowledge Upload Centre** for governed knowledge/document ingestion,
- and use the existing **app builder / shared platform model** to accelerate assembly of the new product.

At completion:
- **MMM becomes the only canonical maturity product**
- **MAT and Maturity Roadmap are dissolved as standalone app identities**
- both remain only as source artifacts for migration traceability, historical reference, and controlled decommissioning

---

## 1. Why MMM is Necessary

### 1.1 Current Problem

The current maturity capability is distributed across multiple apps and conceptual models:

- **Maturity Roadmap** owns most of the maturity governance, workflow, scoring, dashboard, and action-planning intent
- **MAT** owns portable audit execution, evidence capture, reporting, criteria upload, AI-assisted assessment, and mobile/field usage intent
- **legacy maturity** owns valuable but partially migrated capabilities, especially:
  - AI-assisted new criteria creation
  - reusable knowledge and document handling components
  - UI patterns and module assets
  - practical implementation knowledge from prior build work

This has created duplication, especially around:
- Domain → MPS → Criteria structures
- evidence concepts
- scoring concepts
- findings and recommendations
- upload and ingestion flows
- AI usage patterns
- overlapping interfaces

### 1.2 The Strategic Decision

The correct move is **not**:
- to keep MAT and Roadmap as parallel products,
- or to bolt MAT into Roadmap as a partial patch,
- or to preserve legacy as a destination architecture.

The correct move is to define a new canonical product:
- **MMM — Maturity Model Management**

MMM will be:
- the **canonical owner of maturity frameworks**
- the **canonical owner of the maturity hierarchy**
- the **canonical home of evidence-linked maturity operations**
- the **canonical front door for both imported and AI-generated maturity models**
- the **shared maturity platform** from which downstream outputs are produced

---

## 2. Strategic Vision

MMM is the unified maturity platform for the Maturion ecosystem.

It provides one governed platform that allows an organisation to:

1. enter its organisational information
2. choose whether to:
   - create a brand-new maturity model with AI
   - upload and preserve an existing maturity model verbatim
3. produce a structured maturity framework using the shared:
   - Domain
   - MPS
   - Criteria
   hierarchy
4. manage evidence directly at criterion level
5. generate findings and recommendations
6. decide whether to:
   - export an executable report
   - export an implementation plan to PIT
7. operate a live maturity dashboard and action roadmap over time

In simple terms:

- **Roadmap DNA remains the main product backbone**
- **MAT DNA becomes a portable audit and evidence execution mode**
- **legacy criteria-generation becomes a framework-authoring mode**
- **AIMC remains the AI centre**
- **the Knowledge Upload Centre remains the common governed ingestion path**
- **PIT remains the implementation execution destination**

---

## 3. Product Positioning

MMM is not just a “married version” of MAT and Roadmap.  
It is the **next canonical maturity product**.

### 3.1 What MMM is

MMM is:
- a maturity framework authoring platform
- a maturity framework import platform
- a maturity evidence and scoring platform
- a portable audit and evidence-capture platform
- a maturity dashboard and action-planning platform
- a report and implementation-plan output platform

### 3.2 What MMM is not

MMM is not:
- a thin wrapper around Roadmap
- a renamed MAT
- a preserved legacy app
- a local AI stack separate from AIMC
- a duplicated structure owner beside other apps

---

## 4. Canonical Ownership Model

This section is critical. MMM must only succeed if ownership is explicit.

### 4.1 MMM will canonically own

- maturity frameworks
- domains
- MPSs
- criteria
- maturity-level definitions as applied to frameworks
- framework versioning
- criterion-linked evidence management
- findings and recommendations
- maturity scoring state
- maturity dashboard publication state
- roadmap / maturity action derivation
- report/export decisioning
- audit-to-roadmap convergence logic

### 4.2 AIMC will canonically own

- AI routing
- provider abstraction
- AI personas and advisory structure
- central knowledge services
- knowledge upload governance
- analysis/advisory capabilities
- telemetry and AI governance
- model/provider lifecycle governance

### 4.3 PIT will canonically own

- implementation planning execution
- downstream implementation actions
- operational plan execution and tracking
- implementation workflow after export from MMM

### 4.4 MAT and Roadmap after MMM

Once MMM is approved and adopted:
- **MAT no longer remains a standalone canonical module**
- **Maturity Roadmap no longer remains a standalone canonical module**
- both become:
  - source artifacts,
  - migration references,
  - decommission candidates,
  - and traceability anchors only

---

## 5. Core Principle: Keep the Roadmap Backbone

The new MMM app description should be built primarily on the **Maturity Roadmap** concept and flow.

The reason is that Roadmap already carries the strongest foundation for:
- customer attraction
- free assessment entry flow
- organisation onboarding
- maturity governance
- domain/MPS/criteria orchestration
- approvals
- dashboard publication
- live maturity state
- evidence intent
- user invitation hierarchy
- PIT-linked action planning

Therefore:

> **MMM should preserve the Roadmap as the dominant conceptual skeleton.**

However, it must be elevated and extended so that it also becomes:
- the front door for verbatim criteria upload
- the front door for AI-generated criteria creation
- the home of criterion-level evidence management
- the home of portable walkabout evidence capture
- the owner of report-vs-PIT branching logic

---

## 6. Core Principle: MAT is Dissolved, but Its Best Capabilities Survive

MAT should not survive as a standalone product identity.

However, several MAT capabilities remain strategically valuable and should be harvested into MMM.

### 6.1 MAT capabilities to preserve

- criteria upload and parsing flow
- portable/manual audit logic
- walkabout evidence capture
- mobile-first or mobile-capable evidence capture
- evidence modal and evidence collection experience
- criterion-linked evidence handling
- findings and recommendation generation
- executable report generation path
- offline / low-connectivity field collection patterns where still valuable
- human-in-the-loop scoring and confirmation patterns

### 6.2 MAT capabilities not to preserve as separate ownership

- separate ownership of Domain / MPS / Criteria
- separate maturity engine
- separate dashboard ownership
- separate standalone app identity
- separate AI routing or provider logic
- separate user invitation model where Roadmap already covers it better

### 6.3 Strategic interpretation

MAT becomes, in effect:
- an **Audit Workbench / Field Audit Mode** within MMM
- not a peer product beside MMM

---

## 7. User Entry Model

### 7.1 Front Door

The maturity model remains the primary customer attraction entry point.

It invites users to:
- do the free assessment
- understand their current maturity state
- onboard organisationally
- proceed into MMM’s structured maturity workflow

This logic remains based on the Roadmap concept.

### 7.2 The decisive fork

A core new decision point must be introduced immediately after organisation information is uploaded.

At that point, the user selects one of two primary framework-origin modes:

#### Mode A — Verbatim Upload
The organisation already has an existing maturity standard or criteria model and wants to:
- upload it
- preserve it
- extract it into the MMM hierarchy
- use it substantially as-is

#### Mode B — New Criteria Creation
The organisation does not have a mature model and wants MMM + AI to:
- generate the maturity framework from scratch
- create domains
- create MPSs
- create criteria
- apply governance and authoring rules during creation

### 7.3 Strategic expectation

Although both modes must be first-class, the expected dominant usage pattern is:

- **new criteria creation = majority path**
- **verbatim import = minority path**

The design should therefore:
- support both robustly
- but optimise the UX for new criteria creation

---

## 8. Common Ingestion Path

Both framework-origin modes should use the same governed ingestion mechanism.

### 8.1 One common upload path

All document uploads should occur through the common document management / knowledge upload infrastructure.

This prevents:
- duplicated upload logic
- duplicated parsing entry points
- fragmented document governance

### 8.2 Metadata extension

The document upload layer should include expanded metadata to support MMM routing.

At minimum, uploaded items should carry metadata such as:
- organisation-specific vs generic
- source role
- origin mode
- framework status
- intended use in MMM

### 8.3 Minimum recommended metadata taxonomy

Suggested metadata model:

- `scope_type`
  - `organisation_specific`
  - `generic`
  - `sector_specific`
  - `framework_reference`

- `origin_mode`
  - `verbatim_import`
  - `ai_generated`
  - `hybrid`

- `document_role`
  - `criteria_source`
  - `knowledge_source`
  - `evidence`
  - `guidance`
  - `template`

- `framework_status`
  - `draft`
  - `approved`
  - `published`
  - `superseded`

This allows MMM to distinguish:
- content used to generate or import frameworks
- content used as knowledge or guidance
- content used as evidence
- content used generically across multiple organisations

---

## 9. Unified Framework Model

MMM must unify the framework model so that both new and imported maturity models land in the same structure.

### 9.1 Canonical hierarchy

The core hierarchy remains:

- Domain
- MPS
- Criteria

This is shared regardless of origin:
- AI-generated
- verbatim-imported
- hybrid-composed

### 9.2 Strategic rule

There may never again be two separate canonical copies of:
- domains
- MPSs
- criteria

All such entities must live in MMM as the single source of truth.

### 9.3 Hybrid mode

In practice, a third mode will likely also be valuable:

- import an existing framework
- then let AI complete, enrich, or normalize missing parts

This should be retained conceptually as a future or optional supported mode.

---

## 10. Evidence Management Strategy

This is one of the most important convergence points.

### 10.1 Core decision

The evidence management capability from MAT should be patched directly into the Roadmap-driven MMM experience.

### 10.2 UX model

Within MMM:
- the user drills into a criterion
- clicks the criterion
- opens the evidence management modal or evidence workspace
- uploads, captures, links, or reviews evidence directly there

### 10.3 Why this matters

This achieves several goals at once:
- preserves the strongest MAT evidence UX
- anchors evidence exactly where it belongs: at criterion level
- avoids a disconnected evidence app
- makes evidence usable for both:
  - maturity governance
  - auditing
  - ongoing operational maturity
  - portable field capture

### 10.4 Portable evidence capture

The old MAT portable behavior should survive as part of MMM:
- walkabout evidence collection
- mobile-capable evidence upload
- field-based capture
- audit evidence collection in motion

This should be treated as:
- a capability of MMM
- not a separate module identity

---

## 11. Findings, Recommendations, and Output Fork

Both Roadmap and MAT currently converge on findings and recommendations.

MMM should make this explicit and formal.

### 11.1 Shared findings model

MMM should produce one shared findings and recommendations model, based on:
- criterion
- maturity position
- evidence
- rationale
- finding
- recommendation
- target state
- owner / responsibility
- priority / severity where relevant

### 11.2 Output fork

After findings and recommendations are available, MMM introduces a clear user decision:

#### Option A — Create Report
Use the findings and recommendations to generate an executable audit/report output.

#### Option B — Export to PIT
Use the same findings and recommendations to generate an implementation plan for PIT.

### 11.3 Strategic rule

These are not two separate truths.

They are:
- one shared finding model
- two downstream output/rendering destinations

This avoids:
- double data entry
- duplicated recommendation logic
- divergence between audit outcome and implementation planning

---

## 12. MMM Operating Modes

MMM should be understood as one product with multiple operating modes.

### 12.1 Framework Authoring Mode
For organisations creating a new maturity model from scratch.

Includes:
- AI-assisted framework creation
- domain generation
- MPS generation
- criteria generation
- rule-based authoring governance
- review and approval before publication

### 12.2 Framework Import Mode
For organisations bringing an existing framework into MMM.

Includes:
- verbatim upload
- parsing and extraction
- structure validation
- mapping to canonical hierarchy
- human review and approval

### 12.3 Audit / Field Evidence Mode
This is the surviving MAT DNA inside MMM.

Includes:
- portable evidence collection
- walkabout auditing
- mobile evidence capture
- criterion-linked findings capture
- optional offline/low-connectivity support
- audit-style usage of evidence modal/workbench

### 12.4 Maturity Operations Mode
This is the surviving Roadmap DNA inside MMM.

Includes:
- live maturity state
- evidence-linked scoring
- approvals
- dashboard publication
- findings and recommendations
- maturity tracking over time
- current-to-target maturity movement

### 12.5 Output Mode
Includes:
- report generation
- PIT export
- milestone/action generation
- other downstream maturity outputs as needed

---

## 13. Shared Platform Dependencies

MMM should not try to own all platform concerns internally.

### 13.1 AIMC dependency
MMM depends on AIMC for:
- advisory AI
- analysis AI
- criteria generation assistance
- document understanding
- evidence support functions
- scoring assistance
- AI governance and telemetry

### 13.2 Knowledge Upload Centre dependency
MMM depends on the central upload and knowledge infrastructure for:
- document ingestion
- knowledge-source classification
- routing and governance
- generic vs organisation-specific content control

### 13.3 App Builder dependency
MMM should use the app builder and shared platform patterns for:
- reusable UI scaffolds
- workflow wiring
- shared forms
- shared routing
- shared admin/management patterns
- consistent implementation acceleration

### 13.4 Shared services dependency
MMM should reuse:
- auth
- RLS
- reporting infrastructure
- workflow engine where applicable
- AI service access patterns
- common governance and telemetry components

---

## 14. AI Strategy for MMM

MMM must not create its own local or uncontrolled AI stack.

### 14.1 Strategic rule
All AI functionality in MMM must be routed through AIMC.

### 14.2 Expected AI roles in MMM
AI should support:
- creation of new domains, MPSs, and criteria
- interpretation of uploaded criteria documents
- normalization of imported frameworks
- assistance in evidence understanding
- assistance in scoring recommendations
- assistance in findings/recommendation generation
- advisory support during user interaction

### 14.3 Human oversight
All AI actions affecting framework, scoring, or official outputs must remain subject to:
- human review
- human confirmation or override
- audit trail
- structured justification where needed

### 14.4 No duplicated AI routing
MMM may never implement:
- its own direct provider logic
- its own fallback logic outside AIMC
- its own ungoverned prompt and model routing layer

### 14.5 Platform AI feature obligations

In addition to routing AI through AIMC, MMM must also comply with the Maturion platform AI feature baseline.

This means MMM should be designed to accommodate, where appropriate:

- embedded AI assistant/chat
- context-aware AI guidance in the interface
- governed AI task routing
- explicit AI capability declaration in agent configuration
- dual-pattern AI usage across front-office and back-office contexts where relevant

These platform AI features must be reflected in the app description as native product/application requirements, not treated merely as optional later enhancements. :contentReference[oaicite:12]{index=12}
---

## 15. Strategic Treatment of Legacy Assets

Legacy is not the destination.  
Legacy is a **harvest source**.

### 15.1 Principle
Any valuable legacy component should be:
- identified
- mapped
- harvested
- upgraded if required
- rehomed into MMM, AIMC, or shared platform services
- then formally retired in legacy once the new equivalent is verified

### 15.2 Types of assets likely to be harvested

From legacy maturity:
- AI framework-creation capability
- document handling/upload patterns
- knowledge ingestion patterns
- reusable UI components
- maturity-related workflows
- possibly useful auth and operational scaffolding patterns where still relevant

From MAT:
- evidence modal and evidence management components
- mobile evidence capture patterns
- criteria upload/parsing interfaces
- report logic
- AI/human assessment interaction patterns
- scoring review interfaces
- audit execution concepts

From Roadmap:
- core flow and onboarding
- free assessment journey
- governance structure
- approval hierarchy
- dashboard and publication logic
- maturity-to-action pathway
- user invitation and role logic

---

## 16. Supersession and Dissolution Strategy

This must be explicit from the outset.

### 16.1 Intent
The intention is that, once MMM is created and approved:
- MAT is dissolved as a standalone app identity
- Maturity Roadmap is dissolved as a standalone app identity

### 16.2 What remains
They remain only as:
- source documents
- migration references
- traceability anchors
- decommission-controlled legacy artifacts

### 16.3 Decommission rule
No module or legacy component may be retired until:
- its equivalent in MMM is confirmed
- its data/state migration path is confirmed
- its governance status is recorded
- its deprecation status is logged

### 16.4 Naming transition
As an early governance step:
- MAT and Maturity Roadmap may be renamed or treated operationally as `legacy`
- MMM becomes the forward product identity
- but formal canonical supersession should only occur once the MMM app description is complete and approved

---

## 17. Canonical Data/Concept Separation

To prevent future confusion, MMM must distinguish the following:

### 17.1 Framework
The maturity model itself:
- domains
- MPSs
- criteria
- descriptors
- version
- publication state

### 17.2 Assessment Run
A specific audit or review activity performed against a framework version.

### 17.3 Evidence State
The body of evidence linked to the framework and its criteria.

### 17.4 Operational Maturity State
The live maturity position currently reflected by approved evidence and governance decisions.

### 17.5 Action State
The implementation and remediation path, including PIT-oriented action planning.

This separation is essential to avoid:
- score drift
- duplicate truth
- report/roadmap inconsistency
- historical overwrite
- poor traceability

---

## 18. Versioning Strategy

MMM must implement strong versioning from day one.

At minimum:
- framework version
- publication version
- assessment run version or instance identity
- evidence timestamps and evidence currency
- output versioning for reports and PIT exports

This is necessary because:
- the framework may evolve
- evidence changes over time
- findings may be updated
- reports must remain defensible
- PIT plans must trace back to the exact maturity basis that produced them

---

## 19. Governance Rules for the MMM Build

The MMM build must follow the existing ecosystem discipline.

### 19.1 Build derivation chain

The build sequence remains:

1. Strategy  
2. App Description  
3. FRS  
4. TRS  
5. QA-to-Red suite  
6. PBFAG / pre-build gate  
7. QA-to-Green build execution  
8. Wave implementation plan  
9. Build execution  
10. validation, audit, and convergence reviews

### 19.2 Additional mandatory step
For MMM specifically, one additional artifact should be inserted between Strategy and App Description or directly after the App Description structure is settled:

- **Canonical Ownership and Migration Map**

This artifact should define:
- what MMM owns
- what AIMC owns
- what PIT owns
- what is harvested from MAT
- what is harvested from Roadmap
- what is harvested from legacy
- what is retired
- what is parallel-run temporarily
- what remains traceability-only

### 19.3 Strategic rule
No implementation may begin before:
- the MMM app description is stabilised,
- the ownership map is explicit,
- and the QA-to-Red discipline is in place.

### 19.4 Cross-app completeness rule

In addition to product-specific strategy requirements, MMM must also satisfy the mandatory cross-app component baseline applicable to all Maturion applications.

Accordingly, the MMM app description cannot be considered complete unless it explicitly accommodates:

- agent-system requirements
- watchdog and QIW oversight requirements
- performance and telemetry requirements
- feedback and learning-loop requirements
- compliance and governance evidence requirements
- startup and commissioning requirements
- architecture completeness requirements
- platform AI feature requirements :contentReference[oaicite:13]{index=13}

---

## 19A. Mandatory Cross-App Governance Baseline for MMM

MMM is not only a product convergence initiative.  
It is also a new canonical Maturion application and must therefore fully comply with the mandatory cross-app governance baseline defined in the Maturion canon. These requirements are not optional implementation extras; they are part of the minimum definition of a complete, commissionable Maturion app. :contentReference[oaicite:1]{index=1}

Accordingly, the MMM App Description, FRS, TRS, QA-to-Red suite, wave plan, and implementation build must all explicitly accommodate the following mandatory cross-app component categories.

### 19A.1 Agent System and Contracts

MMM must be created as a governed application with the required agent-operating structure, including:

- `.agent` file
- `.agent-workspace/` structure
- wake-up and session-closure compatibility
- any agent class-specific requirements applicable to the app build or operational mode

This requirement applies both to the application repository/build environment and to any embedded AI operating assumptions reflected in the MMM app design. :contentReference[oaicite:2]{index=2}

### 19A.2 Watchdog and Oversight

MMM must include Watchdog-compatible oversight and Quality Integrity Watchdog (QIW) compatibility where applicable.

This includes support for monitored quality/integrity channels across at least:

- build
- lint
- test
- deploy
- runtime

MMM must be designed so that QA, operational anomalies, integrity concerns, and governance breaches can be surfaced through the appropriate watchdog and oversight mechanisms. :contentReference[oaicite:3]{index=3}

### 19A.3 Performance Measurement

MMM must include a formal performance-measurement baseline covering both AI and application performance.

This must include, where applicable:

- AI performance metrics
  - token usage
  - latency
  - cost
- application metrics
  - p50 latency
  - p95 latency
  - p99 latency
  - throughput
  - error rates
- relevant service metrics for critical MMM services and dependencies

Because MMM will be AI-enabled, evidence-heavy, and operationally important, performance measurement must be treated as a first-class design requirement, not a post-build optimisation concern. :contentReference[oaicite:4]{index=4}

### 19A.4 Observability and Telemetry

MMM must ship with baseline observability and telemetry capabilities required for a governed Maturion application.

This includes, at minimum:

- `/api/health`
- structured JSON logging
- runtime telemetry
- dashboard/status APIs as appropriate, including patterns such as:
  - `/api/[app]/status`
  - `/metrics`
  - `/health`

The app description and downstream specs must explicitly account for the telemetry needs of:

- framework creation/import
- evidence operations
- AI interactions
- findings and recommendation generation
- dashboard publication
- report generation
- PIT export pathways :contentReference[oaicite:5]{index=5}

### 19A.5 Feedback and Learning

MMM must integrate into the Maturion feedback and learning-loop model.

This includes accommodation for:

- Tier-0 / Tier-1 learning integration where applicable
- BL / FL-CI learning structures where applicable
- layer-up feedback mechanisms
- continuous improvement recording in `.agent-admin/improvements/`

This requirement applies both to:
- app-quality/process learning
- and to structured operational improvement feedback arising from app usage and QA outcomes :contentReference[oaicite:6]{index=6}

### 19A.6 Compliance and Governance Evidence

MMM must distinguish clearly between:

1. **business evidence**
   - evidence uploaded and managed by users against maturity criteria

and

2. **application governance evidence**
   - evidence proving that MMM itself is a governed and compliant Maturion application

MMM must include the required application governance evidence and compliance artifacts, including:

- `.agent-admin/` bundle
  - prehandover
  - gates
  - RCA
  - improvements
  - governance materials
- compliance baseline artifacts such as:
  - `COMPLIANCE_SCOPE.md`
  - `CONTROL_MAPPING.md`
  - `EVIDENCE_CATALOG.md`
  - `AUDIT_REPORT.md`
- `GOVERNANCE_INVENTORY.json`

This distinction is critical and must remain explicit throughout the app description and downstream specifications. :contentReference[oaicite:7]{index=7}

### 19A.7 Startup and Commissioning

MMM must be designed as an application that is progressively commissioned under governance, not merely built and deployed.

The MMM delivery must therefore accommodate:

- `APP_STARTUP_REQUIREMENTS.md`
- runtime readiness verification
- progressive activation states:
  - `INSTALLED`
  - `VALIDATED`
  - `COMMISSIONED`
  - `ACTIVATED`

The app description and TRS must explicitly reflect that MMM is only considered operational once it has passed the required commissioning readiness criteria. :contentReference[oaicite:8]{index=8}

### 19A.8 Architecture Completeness

MMM must satisfy the architecture-completeness baseline for Maturion apps.

This includes explicit accommodation for:

- deployment target declaration
- `.env.example`
- build entrypoints
- runtime entrypoints
- dependency manifest
- lock file
- consistent error-handling and recovery patterns

These are baseline completeness requirements and must be assumed from the outset in the MMM app design. :contentReference[oaicite:9]{index=9}

### 19A.9 Platform AI Features

Because MMM is an AI-enabled Maturion application, it must also include the required platform AI feature baseline.

This includes:

- embedded AI assistant / chat capability where appropriate
- context-aware AI in the user interface
- agent file entries defining relevant `ai_capabilities`
- AI task routing through governed platform patterns
- support for the dual-pattern model where applicable:
  - back-office AI usage
  - front-office AI usage

This requirement sits alongside, and does not replace, the strategic rule that MMM must consume AI through AIMC rather than building a separate uncontrolled AI layer. :contentReference[oaicite:10]{index=10}

### 19A.10 Strategic Implication

The mandatory cross-app baseline must be treated as a binding design input for MMM.

Therefore:

- the MMM App Description must include these cross-app obligations explicitly
- the FRS must translate them into functional and operational requirements
- the TRS must translate them into technical implementation requirements
- the QA-to-Red suite must test for their presence and completeness
- the wave implementation plan must allocate delivery responsibility for them

No MMM specification should be treated as complete unless these cross-app obligations have been explicitly incorporated. :contentReference[oaicite:11]{index=11}

---

## 20. QA-to-Red Strategy for MMM

This is not a side activity. It is central to success.

### 20.1 Why it matters
MMM is a convergence build. That means the main risks are:
- assumed completeness
- hidden wiring gaps
- duplicated logic
- placeholder survivorship
- reintroducing old defects under a new name

### 20.2 Strategic use of QA-to-Red
The QA-to-Red suite for MMM should serve as:
- a gap analysis instrument
- a migration quality instrument
- a component-harvest verification mechanism
- a build-to-green acceptance mechanism

### 20.3 Required use
The QA suite should explicitly classify:
- what is already green in harvested components
- what is partially usable but red in MMM context
- what must be redesigned
- what remains blocked on upstream dependencies

### 20.4 Practical interpretation
Rather than just testing the new MMM app, QA-to-Red should also answer:
- which legacy components are worth keeping
- which MAT components are worth keeping
- which Roadmap components are sufficient as-is
- which must be retired or rebuilt

This turns QA into a real strategic convergence instrument.

---

## 21. Wave-Based Implementation Strategy

Once strategy, app description, FRS, TRS, and QA-to-Red are complete, MMM should proceed via wave implementation planning.

### 21.1 Principle
The wave plan should be derived from:
- canonical product scope
- harvested component inventory
- QA-to-Red results
- governance dependencies
- AIMC/PIT/shared platform dependencies

### 21.2 Expected wave pattern
The MMM wave plan will likely include:
- governance foundation
- schema and ownership model
- framework authoring
- framework import
- evidence modal and evidence management
- portable/mobile evidence capture
- findings and recommendation engine
- report generation
- PIT export
- dashboard and publication
- permissions and invitation flows
- final wiring and convergence verification

### 21.3 Rule
No wave may begin without:
- RED tests for that wave
- explicit owner/builder assignment
- clear entry/exit criteria
- dependency status confirmed
- approval gate declared

---

## 22. Proposed Structure of the MMM App Description

When the strategy is complete and frozen, the MMM app description should be written as a new canonical document, not as a patch note.

It should contain at least:

1. Purpose and positioning  
2. Product vision  
3. Canonical ownership model  
4. User entry flow  
5. Organisation setup  
6. The fork:
   - verbatim upload
   - new criteria creation  
7. Common document/upload pipeline  
8. Canonical framework model  
9. Domain → MPS → Criteria model  
10. Evidence management model  
11. Findings and recommendations  
12. Report vs PIT output fork  
13. Portable audit / field evidence mode  
14. Maturity operations and dashboard  
15. Roles and permissions  
16. AI and AIMC integration  
17. Knowledge and metadata governance  
18. Versioning and traceability  
19. Migration and decommission rules  
20. Open design issues / confirmation items  
21. Mandatory Cross-App Governance Components  
22. Agent and AI Operating Model  
23. Watchdog / QIW / Oversight  
24. Observability, Telemetry, and Metrics  
25. Startup, Commissioning, and Activation  
26. Compliance Baseline and Governance Evidence  
27. Architecture Completeness Requirements
    
---

## 23. Immediate Strategic Decisions Already Agreed

This strategy records the following working decisions:

1. A completely new product, **MMM**, should be created.
2. The current goal is **not** to repair MAT or Roadmap independently.
3. The **Maturity Roadmap** remains the primary conceptual backbone.
4. **MAT is dissolved** as a standalone product but its strongest capabilities are harvested.
5. The **evidence management modal/workflow** from MAT is a key capability to preserve.
6. Portable/walkabout/mobile evidence capture survives inside MMM.
7. The user enters through the maturity model flow and free assessment journey.
8. A key fork occurs after organisation information upload:
   - verbatim upload
   - new criteria creation
9. Both paths use the governed document/upload system.
10. Metadata must distinguish at least generic vs organisation-specific content, and should likely be extended further.
11. Findings and recommendations become one shared model with two output destinations:
   - report
   - PIT export
12. AIMC remains the central AI platform.
13. The Knowledge Upload Centre remains central and shared.
14. The build process remains:
   - Strategy
   - App Description
   - FRS
   - TRS
   - QA-to-Red
   - wave plan
   - build
15. After MMM is completed, MAT and Roadmap are intended to be fully dissolved as standalone app identities.

---

## 24. Risks

### 24.1 Risk: building “one more app”
If MMM is created without explicit ownership rules, it may become just another overlapping module.

**Mitigation**: define canonical ownership and dissolution rules early.

### 24.2 Risk: preserving duplicate structure owners
If MAT/Roadmap/legacy structures continue to coexist, the current duplication problem will survive under a new label.

**Mitigation**: Domain/MPS/Criteria must have one canonical owner only: MMM.

### 24.3 Risk: underestimating MAT’s surviving value
Reducing MAT only to a modal would miss its portable execution and field-audit strengths.

**Mitigation**: preserve MAT as a mode/capability, not as a separate app.

### 24.4 Risk: upload model ambiguity
If metadata and routing are not designed early, generic/organisation-specific content will become confused.

**Mitigation**: define upload metadata taxonomy in the app description and FRS.

### 24.5 Risk: strategy-to-build drift
A good strategy can still collapse into patchwork during implementation.

**Mitigation**: strong QA-to-Red and explicit harvesting map before any builder delegation.

---

## 25. Open Confirmation Items

These items should be revisited during app-description drafting:

1. Will MMM be a distinct top-level app under `apps/`, or a named module under a shared portal shell?
2. Will the term “MAT” survive at all as a user-facing mode name, or be fully retired?
3. Will offline support remain mandatory, or only mobile capture without true offline sync?
4. How much of the old report-generation logic is retained versus redesigned?
5. Will hybrid framework mode be first release or later release?
6. What exact metadata schema is mandatory at MVP versus later?
7. What exact deprecation states will be used for MAT and Roadmap during transition?
8. What is the first canonical version number and folder location of the MMM app description?
9. How much of the legacy knowledge/upload UI is directly reusable versus only conceptually reusable?
10. Which existing UI components are mature enough to harvest immediately into the first QA-to-Red map?

---

## 26. Next Steps

### Stage 1 — Finalise Strategy
- refine this strategy
- capture missing lessons learned
- agree the ownership model
- agree the convergence boundary
- freeze the strategy sufficiently for app-description drafting

### Stage 2 — Gather source inputs
Use as the main drafting inputs:
- MAT app description
- Maturity Roadmap app description
- this MMM strategy

### Stage 3 — Draft the new MMM app description
Create a new canonical app description that:
- preserves the Roadmap backbone
- absorbs the chosen MAT capabilities
- records the new forked framework-origin model
- clearly defines evidence, findings, outputs, and AIMC dependency

### Stage 4 — Switch to critique mode
After drafting:
- perform strict evaluation
- identify omissions
- identify assumptions
- identify over-invention
- identify weak ownership boundaries
- refine iteratively until fit for canonisation

### Stage 5 — Derive downstream specs
Then proceed to:
- FRS
- TRS
- QA-to-Red suite
- harvesting / reuse map
- QA-to-Green target set
- wave implementation plan

---

## 27. Final Strategic Statement

MMM is the strategic convergence of the Maturion maturity capability.

It is the deliberate replacement of fragmented maturity ownership with one canonical product that:
- attracts organisations through the maturity journey,
- allows them to create or import maturity frameworks,
- manages maturity through a shared Domain → MPS → Criteria model,
- handles evidence at criterion level,
- supports portable field capture and auditing,
- generates findings and recommendations,
- and branches those outcomes into either reports or implementation plans.

The Roadmap provides the backbone.  
MAT provides the portable audit and evidence strengths.  
Legacy provides valuable harvestable assets.  
AIMC provides the governed AI core.  
PIT remains the implementation destination.

**MMM becomes the new canonical maturity platform.**

---
