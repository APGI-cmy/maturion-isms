# MMM — Maturity Model Management
## Unified App Description for the Canonical Maturity Platform

---

## Status Header (REQUIRED)

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: App Description (Upstream Authority)
- **Status**: Draft (Governance Gaps Resolved — pending CS2 approval)
- **Version**: v0.2.0
- **Owner**: Johan Ras
- **Authority**: Johan Ras / CS2
- **Applies To**: MMM module within the Maturion ecosystem
- **Approval Date**: N/A
- **Last Updated**: 2026-04-03
- **Supersedes / Replaces Conceptually**:
  - MAT — Manual Audit Tool
  - Maturity Roadmap
  - selected maturity capabilities from `apps/maturion-maturity-legacy`

> **Governance Note:** This document is intended to become the new canonical upstream app description for the maturity capability. Once approved, no downstream FRS, TRS, QA, or implementation artifacts should derive canonically from MAT or Maturity Roadmap except for migration traceability.

---

## 0. Document Purpose

This document defines **MMM — Maturity Model Management** as the new canonical maturity platform within the Maturion ecosystem.

MMM is the deliberate convergence of:
- the **Maturity Roadmap** governance, onboarding, live maturity, approval, dashboard, and action-planning model
- the **MAT** portable audit, evidence capture, criteria upload, AI-assisted assessment, and report-generation model
- selected **legacy maturity** capabilities, especially framework generation, knowledge/document handling, and reusable UI/workflow assets

This document is intended to be the upstream authority for:
- Functional Requirement Specification (FRS)
- Technical Requirement Specification (TRS)
- architecture design
- data models
- UI/UX design
- AI routing and governance
- QA-to-Red and QA-to-Green planning
- watchdog, telemetry, and compliance artifacts
- implementation wave planning

MMM is not a patch to MAT or Roadmap.  
MMM is the new canonical maturity capability.
This document is intended not only to define product behavior, but also to serve as a one-time-build constitutional foundation from which downstream requirements, architecture, QA, and wave implementation must be derived without omission of known historical failure modes.

---

## 1. Product Identity

### 1.1 Module Name
**MMM — Maturity Model Management**

### 1.2 Platform Position
MMM is the canonical maturity platform in the Maturion ecosystem.

### 1.3 Primary Objective
Enable organisations to:
- assess their current maturity
- create or import a maturity framework
- manage a canonical Domain → MPS → Criteria hierarchy
- attach and manage evidence at criterion level
- generate findings and recommendations
- maintain a live operational maturity state
- publish a maturity dashboard
- produce either:
  - an executable report
  - or an implementation plan via PIT

### 1.4 Strategic Role
MMM is:
- the **canonical owner of maturity frameworks**
- the **canonical owner of the Domain / MPS / Criteria structure**
- the **canonical home of criterion-linked evidence management**
- the **canonical home of live maturity scoring**
- the **canonical source of maturity findings and recommendations**
- the **front door for both AI-generated and verbatim-imported maturity models**

---

## 2. Product Vision

MMM is the unified maturity platform for the Maturion ecosystem.

It provides one governed platform that allows an organisation to:

1. enter organisational information
2. complete a free maturity assessment
3. establish a locked baseline maturity position
4. choose whether to:
   - create a new maturity model with AI
   - upload an existing maturity model verbatim
5. compile or import a structured maturity framework
6. manage maturity at:
   - Domain level
   - MPS level
   - Criteria level
7. manage evidence directly at criterion level
8. capture evidence in-office or in the field
9. generate findings and recommendations
10. choose whether to:
   - create a formal report
   - export an implementation plan to PIT
11. operate a live maturity dashboard over time

MMM must support both:
- **framework authoring**
- **maturity operations**

within one canonical product.

---

## 3. Canonical Ownership Model

### 3.1 MMM Canonically Owns
- maturity frameworks
- framework versioning
- domains
- MPSs
- criteria
- maturity-level application to frameworks
- criterion-level evidence management
- evidence-linked scoring state
- findings and recommendations
- dashboard publication state
- roadmap/action derivation
- report/export branching logic
- audit-to-roadmap convergence logic
- user role model for maturity framework management

### 3.2 AIMC Canonically Owns
- AI routing
- model/provider abstraction
- AI personas and advisory structure
- central knowledge services
- governed knowledge/document ingestion controls
- AI telemetry and lifecycle governance
- AI oversight integration patterns

### 3.3 PIT Canonically Owns
- implementation plan execution
- downstream action management
- implementation progress tracking
- implementation evidence as returned to MMM

### 3.4 Watchdog Canonically Owns
- AI oversight
- model drift visibility
- override monitoring
- integrity monitoring
- quality and runtime observability escalation

### 3.5 MAT and Roadmap after MMM
Once MMM is approved and adopted:
- MAT is no longer a standalone canonical module
- Maturity Roadmap is no longer a standalone canonical module
- both survive only as:
  - source references
  - migration anchors
  - traceability artifacts
  - controlled decommission references

---

## 4. Module Position in the Ecosystem

| Module | Role Relative to MMM |
|---|---|
| **MMM** | Canonical maturity platform |
| **AIMC** | Central AI platform and AI governance layer |
| **PIT** | Implementation execution destination |
| **RADAM** | Automation and systems evidence source |
| **Watchdog** | AI and integrity oversight |
| **Risk Management** | Evidence source |
| **Incident Management** | Evidence source |
| **Knowledge Upload Centre** | Common governed upload and classification layer |
| **App Builder / Shared Platform** | Shared implementation scaffolding and reusable system capability |

---

## 5. Core Product Philosophy

### 5.1 Roadmap Backbone
MMM retains the Maturity Roadmap as its dominant conceptual skeleton:
- pre-subscription attraction
- free assessment journey
- organisation onboarding
- governance model
- approval logic
- live maturity engine
- dashboard/publication model
- user hierarchy
- PIT-linked action logic

### 5.2 MAT Harvested Capability
MMM absorbs the strongest MAT capabilities as work modes within the same product:
- criteria upload/parsing
- portable field audit behavior
- mobile/walkabout evidence capture
- findings and recommendations
- report generation
- human-confirmed AI scoring
- criterion-level evidence interaction

### 5.3 Legacy Harvest Principle
Legacy is a harvest source, not the destination architecture.

### 5.4 One Canonical Hierarchy Rule
There may never again be multiple canonical owners of:
- Domains
- MPSs
- Criteria

MMM is the single source of truth.

---

## 6. User Entry Journey

### 6.1 Pre-Subscription Flow

The maturity capability remains the primary customer attraction flow.

The user journey is:

1. Landing page
2. Maturity module explanation/tutorial page
3. Free assessment
4. Subscribe
5. Sign-up
6. Get to know you / organisation onboarding
7. Entry into MMM

### 6.2 Free Assessment
The free assessment is the practical exercise for the maturity capability.

It serves to:
- introduce the product
- establish a baseline maturity state
- help the user understand current position
- feed the AI’s initial situational awareness
- create the starting point for MMM operations

### 6.3 Locked Baseline Rule
The user enters MMM with a locked preliminary maturity state established by the free assessment.

If the user subscribes without completing the free assessment:
- MMM should prompt completion before framework configuration begins

### 6.4 Maturity Context Persistence
MMM and Maturion AI must always remain aware of:
- the organisation’s current maturity level
- current domain maturity
- target level
- current-to-next-level gap

This awareness must remain active across all MMM workflows.

---

## 7. Organisation Setup and Entry Fork

### 7.1 Organisation Setup
After subscription and sign-up, the organisation provides:
- organisation name
- organisational context
- industry / sector
- hierarchy / site / operation data as relevant
- maturity intent and operating context
- other onboarding fields required for AI contextualisation

### 7.2 Framework-Origin Decision Fork
Immediately after organisation information is captured, MMM presents a required fork:

#### Mode A — Verbatim Upload
For organisations that already have a maturity standard or criteria model and want to:
- upload it
- preserve it substantially as-is
- extract it into MMM’s canonical hierarchy
- use it as the organisation’s framework

#### Mode B — New Criteria Creation
For organisations that do not have an existing maturity model and want MMM + AI to:
- generate a new framework from scratch
- create Domains
- create MPSs
- create Criteria
- apply authoring rules and governance logic

### 7.3 Strategic Usage Expectation
Both modes are first-class, but the expected dominant usage path is:
- **new criteria creation** as the main path
- **verbatim upload** as the less frequent path

### 7.4 Hybrid Mode
A future or optional supported mode may allow:
- import of an existing standard
- then AI normalization, enhancement, or controlled completion of missing parts

---

## 8. Common Upload and Ingestion Model

### 8.1 Common Upload Path
Both framework-origin modes must use the same governed upload/document-management infrastructure.

This prevents:
- duplicate upload flows
- fragmented document governance
- duplicated classification logic

### 8.2 Document Roles
Uploaded items must be classified by role. At minimum:

- `criteria_source`
- `knowledge_source`
- `evidence`
- `guidance`
- `template`

### 8.3 Metadata Requirements
At minimum, uploaded content should support metadata such as:

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

### 8.4 Pipeline Separation Rule
MMM must distinguish clearly between:
- framework/criteria compilation inputs
- knowledge ingestion inputs
- evidence inputs

These may share the same governed upload infrastructure, but must not collapse into one undifferentiated processing path.

---

## 9. Core Structural Model

### 9.1 Mandatory Hierarchy
All maturity frameworks must be structured as:

1. **Domain**
2. **MPS — Mini Performance Standard**
3. **Criteria**

### 9.2 Numbering Rules
The structure must support immutable hierarchical numbering once approved:

- Domain: `1`, `2`, `3`
- MPS: `1.1`, `1.2`
- Criteria: `1.1.1`, `1.1.2`
- Evidence anchor (if displayed in UI): `1.1.1.1`

Changes after approval must be append-only or fully audit-trailed through governance.

### 9.3 Shared Regardless of Origin
This hierarchy must be shared regardless of whether the framework came from:
- AI generation
- verbatim import
- hybrid composition

### 9.4 Building Block Model

| Layer | Component |
|---|---|
| Layer 1 | Domains |
| Layer 2 | MPSs and Intent Statements |
| Layer 3 | Assessment Criteria |
| Layer 4 | Maturity Level Descriptors and Level Evaluator |
| Layer 5 | Evidence Management |
| Layer 6 | Human Review / Approval / Override |

---

## 10. The Five Canonical Audit Domains

MMM starts with the five-domain Roadmap model as the backbone:

1. Leadership and Governance
2. Process Integrity
3. People and Culture
4. Protection
5. Proof it Works

This domain architecture remains the default MMM maturity structure unless:
- an imported framework requires variation
- an approved configuration mode introduces a controlled variant

---

## 11. Framework Authoring Mode

### 11.1 Purpose
Framework Authoring Mode is used when an organisation needs MMM + AI to generate a maturity framework from scratch.

### 11.2 Outputs
This mode produces:
- Domains
- MPSs
- Intent Statements
- Criteria
- Level descriptors
- structure summary
- current-state vs target-state framing

### 11.3 Authoring Requirements
AI-generated framework elements must be:
- industry-specific
- organisation-specific
- aligned to international best practice
- reflective of real business context
- aware of the organisation’s current maturity level
- governed by authoring rules and human approval

### 11.4 MPS Requirements
Each domain should support a minimum configurable number of MPSs, with the initial Roadmap expectation being at least five per domain unless an approved framework variation applies.

### 11.5 AI Proposed Altering Mechanism
For AI-generated structures, the user must have:
- Edit
- Delete
- Recompile
- AI chat assistance

This mechanism must be consistently available where AI proposes:
- MPSs
- Intent Statements
- Criteria
- level descriptors
- other configurable framework elements

---

## 12. Framework Import Mode

### 12.1 Purpose
Framework Import Mode is used when an organisation already has a maturity standard or criteria model.

### 12.2 Expected Behavior
MMM should:
- accept uploaded criteria/source documents
- parse them into Domain → MPS → Criteria structure
- preserve verbatim source meaning where required
- flag ambiguity for human review
- avoid hallucinating new criteria
- allow approval and correction before publication

### 12.3 No Hallucination Rule
AI may not invent criteria in verbatim-import mode.

If uncertain:
- flag for human review
- show source anchor
- show rationale for structural interpretation

### 12.4 Coverage Rule
Every relevant source content block must be either:
- mapped into the framework structure
- or explicitly classified as non-framework content

### 12.5 Human Review Requirement
Imported frameworks must be human-reviewed and approved before becoming active/published.

---

## 13. Intent Statements

### 13.1 Role
An Intent Statement describes what the organisation seeks to achieve through a given MPS.

### 13.2 Placement
Intent Statements appear beneath or attached to the relevant MPS.

### 13.3 UI Behavior
- collapsible
- readable in-place
- editable through the AI Proposed Altering Mechanism
- approvable through the approval workflow

---

## 14. Assessment Criteria

### 14.1 Strategic Importance
Assessment Criteria are the most important layer of MMM.

### 14.2 Role
Criteria define the actual maturity expectations to be assessed and evidenced.

### 14.3 Sources
Criteria may originate from:
- AI generation from organisational context and guidance
- imported existing standards
- hybrid composition

### 14.4 Criteria Card Requirements
Each criterion should support:

- statement / neutral control statement
- sequence number
- summary of evidence state
- current maturity level
- what is achieved vs what remains
- tutorial/help component
- AI chat assistance
- evidence entry/access
- findings and recommendations access
- level-descriptor visibility
- approval state visibility

### 14.5 Tutorial Model
At all relevant levels, MMM should support the tutorial pattern:
- Hover → short explanation
- Click → paragraph explanation
- Ask Maturion → guided AI explanation and linked learning/help

### 14.6 Learning / Certification Links
Where relevant, tutorial and AI flows may also link to:
- short courses
- certifications
- credits toward professional development routes

---

## 15. Maturity Model

### 15.1 Mandatory Five-Level Scale
Each criterion is evaluated against a five-level maturity scale:

1. Basic
2. Reactive
3. Compliant
4. Proactive
5. Resilient

### 15.2 Global and Local Definitions
MMM must support:
- global maturity DNA definitions
- criterion-specific maturity descriptors

### 15.3 Descriptor Expectations
For each criterion, MMM should provide a description of what the criterion looks like at each level.

### 15.4 Example Definitions
The baseline interpretation is:

- **Basic**: little or nothing is in place
- **Reactive**: something exists, but inconsistently or only in reaction to events
- **Compliant**: requirements are largely in place and managed properly
- **Proactive**: requirements are strengthened through anticipation, risk response, and forward-looking behavior
- **Resilient**: automation, integration, intelligence, self-maintenance, and stronger systemic capability exist

### 15.5 Evidence Capability Constraint
Document-only evidence may justify at most a **Compliant** level.  
Higher maturity levels require stronger, live, integrated, or automated evidence patterns.

---

## 16. Continuous Live Maturity Engine

### 16.1 Core Rule
MMM is not a static audit model.  
It is a **continuous, live, evidence-driven maturity engine**.

### 16.2 Required Behaviors
Maturity state must update as evidence:
- is uploaded
- is connected
- is re-evaluated
- becomes stale
- is approved
- is rejected
- is overridden
- is superseded

### 16.3 Scoring Levels
MMM must support live or refresh-cycle recalculation at:
- criterion level
- MPS level
- domain level
- overall organisation level

### 16.4 Output Impact
These recalculations affect:
- the live dashboard
- current-state vs target-state visibility
- findings and recommendations
- report readiness
- PIT export readiness

---

## 17. Evidence Management

### 17.1 Core Convergence Decision
Evidence management from MAT is absorbed directly into MMM and anchored at criterion level.

### 17.2 Evidence Workspace Trigger
When the user clicks into a criterion, they should be able to open an evidence management modal or workspace.

### 17.3 Supported Evidence Types
Evidence types must include:

- uploaded files/documents
- photos/images
- voice/audio
- interview/conversation content
- evidence links
- system/database integrations
- PIT-linked implementation evidence
- Risk Management evidence
- Incident Management evidence
- other approved evidence integrations

### 17.4 Evidence Classification
Evidence must distinguish between:

#### Uploaded Evidence
User-provided, file-based, manually attached evidence.

#### Connected / Live Evidence
Evidence coming from linked systems, structured integrations, or active databases.

### 17.5 Evidence Source Integrity
Each evidence item must carry source integrity context, including where applicable:
- source system
- uploaded/provided by
- date
- provenance
- linkage target
- currency/review date

### 17.6 Evidence Decision Flow
The evidence flow must support:
- upload/connect
- AI evaluation
- human acceptance
- human query
- escalation
- override
- re-evaluation
- audit trail logging

### 17.7 Re-Evaluate Evidence
Users must be able to trigger re-evaluation when:
- better evidence is uploaded
- stale evidence is refreshed
- AI interpretation is disputed
- system-linked evidence changes materially

### 17.8 Evidence Non-Acceptance Paths
MMM must support at least these paths:

- evidence sufficient but AI rating disputed
- evidence insufficient due to budget/resource/skills constraints
- criterion claimed not relevant
- evidence itself deemed not relevant to the criterion

### 17.9 Budget / Resource / Skills Path
Where the organisation cannot yet comply because of budget, resource, or skills limitations:
- the item is tracked as an open maturity gap
- due dates may be postponed with reasons
- PIT may receive the corresponding implementation task

### 17.10 Evidence Freshness and Staleness
Each evidence item must support:
- effective date
- review frequency
- stale flagging
- re-evaluation trigger behavior

Stale evidence may reduce maturity state if the underlying requirement is no longer supportable.

### 17.11 Human Override Logging
All human overrides of AI evidence interpretation or AI scoring must be logged and retained for self-learning, oversight, and traceability.

### 17.12 Independent Auditor Flow
MMM should support escalation to an independent auditor process where required, with:
- controlled invitation
- scoped access
- temporary rights
- findings submission
- resolution handling
- audit-trail recording

---

## 18. Audit / Field Evidence Mode

### 18.1 Purpose
This is the surviving MAT DNA inside MMM.

### 18.2 Role
Audit / Field Evidence Mode allows the user to:
- collect evidence while moving through the organisation
- perform walkabouts
- record voice observations
- attach files and images
- capture findings at criterion level
- work in a more audit-centric operating pattern

### 18.3 Mobile Capability
MMM must support mobile-capable field evidence creation.

### 18.4 Offline / Low Connectivity
Offline capability may be required as an operating mode where field conditions demand it.

At minimum, MMM should support:
- local queueing
- timestamp preservation
- sync on reconnect
- duplicate prevention
- sync status tracking

### 18.5 Criterion Modal / Workspace
Each criterion should support a focused work area for:
- findings
- voice
- evidence
- conversation/interview
- AI score proposal
- human confirmation or override

---

## 19. Findings and Recommendations

### 19.1 Shared Findings Model
MMM must produce one shared findings and recommendations model.

Each finding should be able to reference:
- criterion
- evidence
- maturity position
- rationale
- gap to next level
- recommendation
- owner/responsibility
- priority/severity
- due date / target date where applicable

### 19.2 Shared Across Modes
The same shared finding model should support:
- maturity operations
- field audit mode
- reporting
- PIT export

### 19.3 No Duplicate Truth Rule
Report generation and PIT export must not create separate incompatible versions of findings.

---

## 20. Output Fork

### 20.1 Decision Point
Once findings and recommendations are available, MMM should let the user choose:

#### Option A — Create Report
Generate a report-oriented output.

#### Option B — Export to PIT
Generate an implementation-oriented action plan.

### 20.2 Report Output
Report generation should support:
- executive summary
- methodology
- framework structure
- findings by Domain / MPS / Criteria
- maturity definitions
- evidence references
- recommendations
- target-state path
- tasks / ownership / dates where appropriate

### 20.3 PIT Export
PIT export should package:
- findings
- recommendations
- implementation tasks
- reason codes
- priorities
- due dates
- open constraints
- linked maturity targets

### 20.4 Shared Truth Rule
These are two renderings of one shared maturity finding model.

---

## 21. Approval and Governance Workflow

### 21.1 Three-Tier Approval Structure
MMM must support the three-tier approval pattern:

#### Level 1 — User Approval
- user confirms the item
- not fully locked
- audit trail required
- available at MPS / Intent Statement / Criteria levels as appropriate

#### Level 2 — Domain-Level Approval
- domain is submitted for broader sign-off
- changes require controlled unlock/review
- back-and-forth communication must be tracked
- locked pending higher approval once accepted

#### Level 3 — Executive Sign-Off
- full framework or published maturity standard receives highest-level sign-off
- changes may cascade back down if required
- final sign-off locks the framework for publication
- may trigger PIT-related policy/action implementation flow

### 21.2 Audit Trail Requirement
All approval actions must be audit-trailed, including:
- approve
- reject
- suggest alternative
- unlock
- resubmit
- override
- final sign-off

---

## 22. Publication and Live Operations

### 22.1 Publication Event
Once the framework has been configured and approved, MMM supports publication.

### 22.2 Publication Effects
Publication activates:
- the live maturity platform
- evidence activity
- dashboard publication
- achievement tracking
- current-to-target maturity movement
- PIT handoff capability

### 22.3 Celebration Feature
Publication and major maturity milestones should be treated as significant product moments and may include celebratory UX patterns.

---

## 23. Live Dashboard — Operational Maturity House

### 23.1 Core Visualization
MMM should retain the Roadmap “Operational Maturity House” dashboard concept.

### 23.2 House Structure
Suggested mapping:

- Roof → Leadership and Governance
- Wall → Process Integrity
- Wall → People and Culture
- Wall → Protection
- Foundation → Proof it Works

### 23.3 Dashboard Panels
The dashboard should include:
- Current State
- Working On / Next State
- overall maturity level
- domain-level maturity indicators

### 23.4 Drill-Down
The dashboard should support:
- domain-level drill-down
- MPS-level drill-down
- criterion-level drill-down
- achieved vs outstanding visibility at each level

### 23.5 Company Hierarchy Filtering
MMM should support filtering by:
- section
- subsection
- site
- operation
- subsidiary
- other hierarchy units as configured

### 23.6 Achievement Feed
MMM should support a live achievement feed showing:
- latest maturity movements
- criterion achievements
- MPS achievements
- domain achievements
- overall level-up moments

### 23.7 Company-Wide Visibility
The dashboard is intended not only for specialists, but for broad internal visibility, including shared-screen or office-display use cases.

### 23.8 Wow Factor Requirement
The dashboard should be designed as a strong internal engagement artifact, not merely a reporting widget.

---

## 24. Roles, Permissions, and Invitations

### 24.1 Core Roles
MMM should support at least:

- Main User / Implementation Lead
- Domain User
- MPS User
- Evidence Manager
- Approver
- Executive Sign-Off User
- Independent Auditor (scoped/temporary)
- other roles as needed by formal design

### 24.2 Invitation Model
- original user signs up
- subsequent users are invited
- invitations are role/scoped
- write permissions are limited to assigned areas
- read rights may be broad, subject to governance rules

### 24.3 Scope-Based Rights
Permissions are scoped to:
- whole framework
- domain
- MPS
- criterion
- evidence set
- approval scope

### 24.4 Inheritance Rule
If lower-level responsibility is not assigned, responsibility remains with the last assigned higher level.

### 24.5 Approval Escalation
Approvals escalate one level up.

### 24.6 Ambiguity Preservation Note
Where the source legacy wording uses overlapping concepts such as “implementation users” or “build users,” final role naming should be confirmed during FRS derivation.

---

## 25. UI / UX Principles

### 25.1 Drill-Down and Context
Users must always know where they are:
- current Domain
- current MPS
- current Criterion
- current evidence context

### 25.2 Wireframe / Structure Navigation
MMM should provide a structure-aware navigation experience showing the user’s current place in the full framework.

### 25.3 Collapsibility
The user must be able to:
- expand all
- collapse sections
- focus on one layer or one branch

### 25.4 Multi-Screen / Detached Work
Where supported, detached or moved windows/work areas must preserve context.

### 25.5 Tutorial and Help Model
Hover / Click / Ask Maturion should be consistently available at relevant structural layers.

---

## 26. AI Strategy

### 26.1 Strategic Rule
All AI functionality in MMM must route through AIMC.

### 26.2 AI Responsibilities in MMM
AI may support:
- free assessment interpretation
- framework generation
- imported framework interpretation
- evidence understanding
- maturity scoring recommendations
- findings and recommendations assistance
- dashboard explanations
- contextual guidance
- learning and help flows

### 26.3 Human Oversight Rule
AI must remain subject to:
- human confirmation
- human override
- audit trail
- governance controls
- watchdog visibility

### 26.4 No Local AI Stack Rule
MMM may not build a separate uncontrolled AI layer outside AIMC.

### 26.5 Platform AI Features
MMM should include, where appropriate:
- embedded AI assistant/chat
- context-aware AI in the UI
- governed AI routing
- explicit AI capability declaration in agent config
- front-office and back-office AI patterns where applicable

### 26.6 AI Governance Requirements
The system should support:
- confidence visibility
- model/version traceability
- override tracking
- AI decision logging
- ISO 42001-aligned oversight expectations

### 26.7 AI Merge Gate Requirement

All MMM code changes that introduce or modify AI features must pass the **Maturion platform AI merge gate** before merge. This gate validates:
- AI feature compliance with the platform AI capability model
- AI safety and governance checks
- AI performance baseline requirements

The platform AI merge gate is governed by `governance/canon/PLATFORM_AI_REQUIREMENTS.md` and enforced via an associated validation script (to be created and registered in `.github/workflows/`).

No AI feature change may be merged without a passing AI merge gate result.

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §5 (Platform AI Features) — AI merge gate*

---

## 27. Knowledge and Guidance Model

### 27.1 Shared Knowledge Dependence
MMM depends on the central knowledge upload/knowledge store model rather than private isolated knowledge silos.

### 27.2 Guidance Role
Guidance documents may inform framework generation, but guidance should not automatically become canonical framework content without governance and human review.

### 27.3 Distinction Rule
Guidance, framework source documents, and maturity evidence must remain distinct content classes.

---

## 28. Canonical Data/Concept Separation

MMM must distinguish clearly between:

### 28.1 Framework
The maturity model itself:
- domains
- MPSs
- criteria
- descriptors
- publication state
- version

### 28.2 Assessment Run / Audit Activity
A specific audit or review activity against a framework version.

### 28.3 Evidence State
The evidence linked to criteria and their maturity assessment.

### 28.4 Operational Maturity State
The live maturity position currently reflected by evidence and decisions.

### 28.5 Action State
The implementation/remediation path, including PIT-linked actions.

This separation is mandatory to avoid duplicate truth and broken traceability.

---

## 29. Versioning and Traceability

MMM must support versioning of at least:
- framework version
- publication version
- assessment run or audit instance
- evidence timestamps and currency
- report version
- PIT export version

This is necessary to preserve:
- defensibility
- historical comparison
- report integrity
- implementation traceability
- governance auditability

---

## 30. Migration and Decommission Rules

### 30.1 Supersession Rule
MMM is intended to supersede MAT and Maturity Roadmap as the canonical maturity capability.

### 30.2 Controlled Dissolution
MAT and Roadmap may not be dissolved until:
- MMM equivalent capability is confirmed
- migration path is known
- traceability is retained
- governance status is recorded

### 30.3 No New Canonical Requirement Drift
No new canonical requirements should be added to MAT or Roadmap after MMM strategy approval unless explicitly mirrored into MMM.

---

## 31. Mandatory Cross-App Governance Components

MMM must fully comply with the Maturion mandatory cross-app baseline.

This includes, at minimum:
- Agent System & Contracts
- Watchdog & Oversight
- Performance Measurement
- Observability & Telemetry
- Feedback & Learning
- Compliance & Evidence
- Startup & Commissioning
- Architecture Completeness
- Platform AI Features

These are not optional extras.

### 31.1 Layer-Down Registration

MMM must be registered in `governance/CONSUMER_REPO_REGISTRY.json` when that registry is established as the Maturion layer-down coordination mechanism (registry to be created). Registration is required to:
- declare MMM as a consumer of governance canon documents
- establish ripple obligations (MMM must receive and process all governance-ripple events from the canonical governance repository)
- enable layer-up feedback from MMM to the canonical governance source

Until the registry is established, MMM's ripple obligations are declared here: any change to `governance/canon/` documents that MMM depends on must be reflected in MMM's local governance files within the same PR wave or the next scheduled governance alignment wave.

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` — Layer-down propagation rules*

### 31.2 PR-Level Evidence Bundle Requirement

Every MMM pull request that delivers wave work must include a complete evidence bundle. The minimum required evidence bundle per PR is:

1. **PREHANDOVER proof** — committed under `.agent-admin/prehandover/` as the PR's prehandover evidence record
2. **Gate results** — machine-readable CI/merge gate results JSON committed under `.agent-admin/gates/`
3. **CI capture** — link or reference to the passing CI run that confirms all required checks passed
4. **RCA (when applicable)** — formal root cause analysis for any failure encountered during the wave, stored under `.agent-admin/` as part of the PR evidence bundle

PRs without a complete evidence bundle must be rejected at the merge gate.

*Implements: `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` — evidence bundle completeness requirements*

### 31.3 Merge Gate Requirements

All MMM wave PRs must pass the following governance-mandated merge gate categories:

- **Verdict Gate** — Binary pass/fail verdict aggregating all merge gate checks; must be GREEN before merge
- **Alignment Gate** — Confirms governance artifact alignment, CANON_INVENTORY hash validity, and layer-down compliance
- **Stop-and-Fix Gate** — Blocks merge if any STOP-AND-FIX condition is detected (open breaches, failing QA, missing evidence)

These gates are not optional. A PR that has not passed all three gate categories must not be merged under any instruction.

*Implements: `governance/canon/FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` — merge gate categories and enforcement*

---

## 32. Agent and AI Operating Model

MMM must include:
- `.agent`
- `.agent-workspace/`
- wake-up/session closure compatibility
- relevant `ai_capabilities`
- compatibility with agent-governed build and operational patterns

### 32.1 Back-Office AI Admin Interface

MMM must include a **two-pane back-office AI administration interface**, separate from the end-user chat interface:

**Pane 1 — Admin AI Chat**:
- Dedicated admin AI chat interface for operational queries, diagnostics, and governance reporting
- Accessible only to administrators (not end users)
- Supports natural-language queries about system state, compliance posture, and user activity

**Pane 2 — AI Telemetry Dashboard**:
- Real-time AI usage telemetry visible to administrators
- Displays: token usage, latency, cost, error rates, and AI interaction volume
- Distinct from the QIW dashboard (see Section 33)

This admin interface is required separately from the end-user AI chat and assessment assistance features.

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §3 (Performance Measurement) — back-office AI admin requirement*

### 32.2 Agent Class Requirements

MMM's agent operating model must reference class-specific requirements:

- **Builder agents** (api-builder, ui-builder, schema-builder, qa-builder, integration-builder): must follow `governance/canon/AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md` for all build wave deliverables
- **Foreman agent** (foreman-v2-agent): must apply POLC-Orchestration model per `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- **Liaison agent** (governance-liaison-isms-agent): must process governance ripple events per `governance/canon/AGENT_HANDOVER_AUTOMATION.md`

*Implements: `governance/canon/LIVING_AGENT_SYSTEM.md` §5 — agent class definitions and boundaries*

---

## 33. Watchdog / QIW / Oversight

MMM must support Watchdog and QIW-aligned visibility across:
- build
- lint
- test
- deploy
- runtime

MMM must expose enough telemetry and behavior for:
- AI oversight
- integrity monitoring
- anomaly visibility
- quality review

### 33.1 QIW Dashboard Requirements

MMM must implement a **Quality Integrity Watchdog (QIW) dashboard** with the following required capabilities:

1. **Real-Time Color Dashboard**: Live color-coded status indicators for all monitored pipeline stages (build, lint, test, deploy, runtime). Each stage must display: GREEN (healthy), AMBER (degraded), or RED (failure/blocked).

2. **7-Day Trend Display**: Historical trend visualization covering at least the last 7 days for each monitored metric, enabling regression detection and pattern visibility.

3. **QIW API**: A programmatic API endpoint exposing QIW status and trend data, enabling integration with external oversight systems, agent oversight queries, and automated escalation pipelines.

These three capabilities are required. The QIW API endpoint must be stable and version-controlled.

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §2 (Watchdog & Oversight)*

---

## 34. Observability, Telemetry, and Metrics

MMM must include:
- `/api/health`
- structured JSON logging
- runtime telemetry
- status/metrics endpoints as appropriate
- app health visibility
- AI performance visibility
- workflow/event observability for critical paths

Telemetry must cover at least:
- free assessment flow
- framework creation/import
- evidence operations
- AI interactions
- findings generation
- report generation
- PIT export
- dashboard publication

---

## 35. Performance Measurement and Service-Level Expectations

MMM must define and monitor:
- AI token usage
- AI latency
- AI cost
- p50 / p95 / p99 latency
- throughput
- error rates
- service-level behavior for critical workflows

Critical workflow performance expectations should be specified downstream in FRS/TRS.

### 35.1 Inter-Service Performance Requirements

MMM must additionally define and monitor:

- **Inter-service latency** — end-to-end latency for all cross-service calls (MMM → AI gateway, MMM → database, MMM → authentication provider), with p50/p95/p99 targets to be specified in FRS/TRS
- **Circuit breaker requirements** — MMM must implement circuit breaker patterns for all external service dependencies. Circuit breakers must:
  - open after a configurable failure threshold
  - provide fallback behavior (graceful degradation, not hard failure)
  - expose circuit state via the health/metrics endpoint

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §3 (Performance Measurement)*

---

## 36. Feedback and Learning

MMM must integrate with the Maturion learning-loop model, including:
- continuous improvement recording
- `.agent-admin/improvements/`
- layer-up feedback
- quality/process learning
- AI-improvement feedback from human overrides and operational outcomes

---

## 37. Compliance Baseline and Governance Evidence

### 37.0 Compliance Standard Baseline

MMM is required to comply with the following governance frameworks:

- **ISO 27001** — Information Security Management System requirements
- **ISO 31000** — Risk Management principles and guidelines
- **NIST CSF** — Cybersecurity Framework (National Institute of Standards and Technology)

These standards are not optional. Compliance evidence must be traceable per Section 37.3 below.

MMM must clearly distinguish:

### 37.1 Business Evidence
Evidence uploaded by users against maturity criteria.

### 37.2 Application Governance Evidence
Evidence proving MMM itself is a governed Maturion application.

MMM must accommodate required governance artifacts such as:
- `.agent-admin/` — governed evidence workspace; mandatory subdirectories are defined by canonical evidence-bundle governance and include at minimum:
  - `.agent-admin/assurance/` — IAA pre-brief artifacts, assurance tokens, and audit records
  - `.agent-admin/evidence/` — compliance evidence artifacts and evidence catalog
  - `.agent-admin/gates/` — merge, readiness, and governance gate records
  - `.agent-admin/governance/` — governance decisions, inventories, and related control artifacts
  - `.agent-admin/improvements/` — learning loop improvement suggestions and resolutions
  - `.agent-admin/prehandover/` — prehandover records and handoff evidence bundles
- `COMPLIANCE_SCOPE.md`
- `CONTROL_MAPPING.md`
- `EVIDENCE_CATALOG.md`
- `AUDIT_REPORT.md`
- `GOVERNANCE_INVENTORY.json`

### 37.3 Control Traceability Rule

Every compliance control within MMM must be fully traceable across the delivery chain:

**Architecture → QA → Runtime → Evidence**

This means:
- Every control must be declared in the architecture document (this App Description or FRS/TRS)
- Every control must have a corresponding QA test or assertion
- Every control must have a runtime check or enforcement mechanism
- Every control must produce traceable evidence artifact(s)

Controls without end-to-end traceability are incomplete and must be addressed before any compliance claim is made.

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §6 (Compliance & Evidence)*

---

## 38. Startup, Commissioning, and Activation

MMM must be designed for progressive commissioning, not merely deployment.

Required commissioning model:
- INSTALLED
- VALIDATED
- COMMISSIONED
- ACTIVATED

### 38.1 APP_STARTUP_REQUIREMENTS.md Mandate

MMM must define and maintain `APP_STARTUP_REQUIREMENTS.md` (to be created during FRS/TRS stage). This file must specify a **Platform Requirements Section** declaring:
- minimum platform versions and dependencies
- environment variable requirements
- infrastructure pre-conditions
- dependency health prerequisites

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §7 (Startup & Commissioning)*

### 38.2 Runtime Readiness Verification Requirements

MMM must include a **runtime readiness verification** sequence before any service is considered ACTIVE. This sequence must contain a minimum of 5 checks, with the concrete checks defined in `APP_STARTUP_REQUIREMENTS.md` during the FRS/TRS stage. All defined readiness checks must pass before the activation gate is released.

The readiness verification sequence must cover, at minimum:
1. platform dependency and connectivity validation
2. authentication and access pre-condition validation
3. external/integrated service reachability validation
4. governance and required artifact availability validation
5. environment and configuration completeness validation

If any defined readiness check fails, the service must NOT proceed to ACTIVATED state. Failures must be reported with the specific check name and failure reason.

*Implements: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` §7 (Startup & Commissioning) — runtime readiness gates*

---

## 39. Architecture Completeness Requirements

MMM must be born architecturally complete, including:
- deployment target declaration
- `.env.example`
- build entrypoints
- runtime entrypoints
- dependency manifest
- lockfile
- error-handling/recovery patterns

The architecture completeness baseline above is supplemented by the one-time-build and delivery-governance requirements that follow. These are mandatory for MMM and are not optional downstream process preferences.

---

## 39A. Build Lifecycle Stages

The following sections define MMM's mandatory one-time-build delivery doctrine.

The minimum required sequence is:

1. Strategy  
2. App Description  
3. FRS  
4. TRS  
5. Architecture  
6. QA-to-Red  
7. PBFAG  
8. Wave Plan  
9. Build Waves  
10. Physical Verification  
11. Deployment Wave  
12. Commissioning / Activation

No implementation work may bypass this derivation chain.

### 39A.1 Failure Promotion and RCA Requirement

MMM must implement the Maturion **Failure Promotion Rule** and **We-Only-Fail-Once Doctrine**:

- Any failure that escapes a quality gate and reaches a later stage must be promoted to a formal incident and recorded in the FAIL-ONLY-ONCE breach registry.
- A formal Root Cause Analysis (RCA) is required for any escaped failure.
- The RCA must be committed to `.agent-admin/rca/` before the affected wave can be closed.

*Implements:*
- `governance/canon/FAILURE_PROMOTION_RULE.md` — failure promotion and incident escalation
- `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` — zero-recurrence mandate and RCA requirement

---

## 39B. Requirements Derivation Chain

MMM must follow a strict requirements derivation chain:

- App Description defines canonical product and governance intent
- FRS derives functional requirements from the App Description
- TRS derives technical requirements from the FRS
- Architecture derives implementation design from the TRS

Architecture may not begin on unresolved or contradictory upstream requirements.

---

## 39C. Technology Stack Authority Rule

The technology stack for MMM must be authoritatively declared in the TRS.

Any discrepancy between App Description, FRS, TRS, Architecture, or historical source material must be resolved before implementation begins.

No architecture or build work may proceed while stack ambiguity exists.

---

## 39D. Deliverable Artifacts

The MMM build is not considered complete unless all required artifacts are explicitly delivered.

Deliverables must include at minimum:

- the application itself
- App Description
- FRS
- TRS
- Architecture artifacts
- QA-to-Red / QA-to-Green suite
- deployment artifacts
- runbooks
- compliance/governance artifacts
- tracker updates
- required agent/admin artifacts

The phrase "done" may never mean that only files exist. It must mean usable deliverables exist.

---

## 39E. Component Definition of Done

Every MMM component must have a strict Definition of Done.

A component is only "done" when it is:

- functionally wired
- integrated
- test-covered as required
- physically verified where UI is involved
- connected to real dependencies where intended
- compliant with auth, RLS, telemetry, and error-handling requirements
- reflected accurately in tracker and governance artifacts

File presence alone does not qualify as completion.

---

## 39F. Test-First Guarantee

MMM must follow a test-first build discipline.

For every build wave:

- QA-to-Red must exist before implementation begins
- remediation tests must exist for known prior oversights
- wave-close is prohibited until relevant red-to-green evidence exists

This is mandatory for both backend and UI-facing work.

---

## 39G. Physical Verification Gate

For every UI-affecting build wave, browser-based physical verification is mandatory.

Physical verification must confirm at minimum:

- the screen renders
- the intended interaction works
- data wiring is real
- state persists as intended
- no placeholder-only behavior is being passed as complete

Component-level logic is not enough. Real browser verification is required.

---

## 39H. PBFAG Gate

Before builder appointment or implementation wave start, MMM must pass the PBFAG gate.

The PBFAG checklist must include at minimum:

- upstream artifacts present and coherent
- unresolved contradictions surfaced
- QA-to-Red prepared
- dependencies identified
- auth model defined
- schema impact understood
- edge/service impact understood
- tracker ready for wave execution

No builder appointment should occur before this gate is satisfied.

---

## 39I. Agent Authority Chain

MMM must explicitly define and respect the agent authority chain.

This includes:

- constitutional boundaries
- operational gates
- what agents may and may not decide
- where human approval is mandatory
- how wake-up, session closure, and handoff discipline are preserved

This section must align with the mandatory cross-app agent model already defined earlier in the document.

---

## 39J. Schema-to-Hook Validation

For every schema-affecting wave, MMM must require schema-to-hook validation.

This means:

- every new or changed column must be mapped to the consuming hook, service, and form state
- no schema change is considered complete until usage wiring is verified
- migration success is not enough; application-path usage must also be verified

This requirement is especially critical for evidence, findings, framework, approval, and dashboard state.

---

## 39K. Table Pathway Audit

Before any build wave is closed, MMM must enumerate and verify all database access pathways relevant to that wave.

This includes explicit auditing of:

- every `.from()` call
- all mutation and query pathways
- their calling hooks and services
- their auth and RLS implications
- their error handling and telemetry behavior

No wave should close while unknown table pathways remain.

This includes explicit auditing of all database access pathways, including every query/mutation entrypoint (for example, `.from()` calls where applicable), their calling hooks/services, their auth/RLS implications, and their error-handling and telemetry behavior.

---

## 39L. RLS Audit Gate

MMM may not be considered deployable unless row-level security and access control are fully audited for all relevant CRUD paths.

This requires:

- create, read, update, and delete pathway review
- role and scope validation
- invitation, approval, and evidence access review
- service/user boundary review
- deployment-blocking status if coverage is incomplete

---

## 39M. Auth Wiring Checklist

MMM must require a full auth wiring checklist before any protected user journey is marked complete.

At minimum this includes:

- AuthProvider or equivalent root wiring
- ProtectedRoute or protected layout behavior
- real login flow
- session persistence
- logout flow
- role and scope propagation
- protected API access behavior

Mock auth or partial auth does not satisfy completion.

---

## 39N. AI Integration Rule

All AI integration in MMM must occur through the AIMC gateway and approved platform routing only.

No direct provider calls may exist in MMM application code unless explicitly approved by canon and reflected in TRS.

This applies to:

- chat
- framework generation
- evidence interpretation
- scoring support
- findings generation
- advisory flows

---

## 39O. Edge Function Registry

Every edge, serverless, or backend function used by MMM must be explicitly registered and verified.

The registry must include:

- function name
- purpose
- caller
- auth model
- deployment status
- environment dependency
- health or verification status

No hidden or ad hoc function usage is allowed.

---

## 39P. Deployment Wave Requirement

MMM must include a dedicated deployment wave.

This wave must verify:

- production build readiness
- environment readiness
- deployment artifact correctness
- service wiring
- health endpoints
- runtime verification
- commissioning prerequisites
- final CWT or production validation as required by governance

Deployment is not an afterthought. It is a first-class wave.

---

## 39Q. Secret Naming Convention

All secrets and environment variables for MMM must follow canonical naming rules.

At minimum:

- production secrets must use consistent uppercase naming
- `.env.example` must be canonical and complete
- secret usage must match runtime code exactly
- no undocumented secret dependency is allowed

---

## 39R. Deployment Runbook

Every deployable MMM component must have a runbook.

Runbooks must cover at minimum:

- deploy steps
- rollback steps
- dependency prerequisites
- environment variables
- health verification
- post-deploy checks
- failure recovery steps

---

## 39S. Notification and UX Messaging Patterns

MMM must not rely on raw `alert()` patterns or undefined feedback behavior.

The app description must require a consistent notification model covering:

- success
- error
- warning
- long-running operations
- background sync and update states
- evidence upload outcomes
- approval outcomes
- export and report outcomes

A toast or notification system, or approved equivalent, must be specified downstream.

---

## 39T. Shared State Architecture

MMM must define a shared state architecture for cross-page and cross-workflow behavior.

This must explicitly cover state ownership for:

- framework context
- current organisation
- current domain, MPS, and criterion context
- evidence modal or workspace state
- findings draft state
- report and export state
- user preferences
- AI interaction context

State location may not be left implicit.

---

## 39U. API Authentication Rule

All user-contextual MMM endpoints must require proper authenticated access, typically JWT-based or an approved equivalent.

No user-contextual API may be treated as complete without:

- authenticated identity
- scope-aware authorization
- auditability
- error handling
- telemetry

---

## 39V. Audit Log Design

MMM must define an explicit audit log design.

This must include:

- action types
- actor identity
- target entity
- timestamping
- before/after logic where relevant
- deduplication rules
- query and access patterns
- retention expectations
- escalation-significant events

This is particularly important for:

- framework edits
- evidence decisions
- scoring changes
- overrides
- approvals
- PIT exports
- report generation

---

## 39W. Tracker Update Requirement

Every MMM implementation wave and PR must update the relevant tracker artifacts.

Tracker updates must reflect:

- what changed
- what remains blocked
- red/green movement
- dependency status
- validation status
- deviations from plan
- remediation items

No wave is complete if the tracker is stale.

---

## 39X. State Persistence Specification

MMM must explicitly define where every user-facing setting and stateful preference lives.

This includes:

- organisation selection
- framework selection
- current navigation position
- dashboard filters
- evidence workspace drafts
- offline queue state
- AI conversation context where retained
- UI preferences
- role and scope context where cached

The app description must state that this persistence model is mandatory and must be specified downstream.

---

## 40. Security and Integrity Principles

MMM should support:
- strong authentication and authorization
- row-level or scope-based access control
- append-only or fully audited changes where required
- evidence integrity controls
- audit trail logging
- tamper awareness where appropriate
- secure storage and secure transport
- privacy compliance obligations as specified downstream

---

## 41. Open Design / Confirmation Items

The following require confirmation during FRS/TRS derivation:

1. **RESOLVED**: MMM will be delivered as a **distinct top-level application** within the Maturion portal shell, deployed as its own service with a dedicated deployment target, domain path, and platform version constraints. This decision enables deployment target declaration and platform version constraints to be specified in the FRS and TRS.
2. Will the label “MAT” survive anywhere as a user-facing work mode name?
3. Is true offline capability mandatory, or only mobile/portable capture?
4. What portion of old report-generation logic is retained versus redesigned?
5. Is hybrid framework mode MVP or later?
6. What metadata schema is mandatory at MVP?
7. Which existing components are directly harvestable vs conceptually reusable only?
8. What exact first canonical version and folder structure will be used?
9. Which dashboard elements are MVP and which are staged?
10. Which approval/escalation variants require phase-based rollout?
11. Which one-time-build governance sections are mandatory at MVP enforcement level versus mandatory as downstream FRS/TRS derived controls?

---

## 42. Final Statement

MMM is the canonical maturity platform for the Maturion ecosystem.

It combines:
- the Roadmap’s governance, dashboard, and maturity-operations backbone
- MAT’s portable audit, evidence, and reporting strengths
- selected legacy authoring and document-handling strengths
- AIMC’s governed AI capability
- PIT’s implementation execution path

MMM is the product through which organisations:
- enter the maturity journey
- create or import their framework
- manage evidence at criterion level
- maintain a live maturity position
- generate findings and recommendations
- and convert maturity insight into either reports or implementation action

**MMM becomes the one canonical maturity capability.**

---
