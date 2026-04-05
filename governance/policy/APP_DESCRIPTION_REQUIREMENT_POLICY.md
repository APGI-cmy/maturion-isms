# APP DESCRIPTION REQUIREMENT POLICY

## Status
Canonical Governance Policy  
Version: v2.0  
Authority: Johan Ras  
Applies To: All Applications, All Repositories  
Required By: Issue - Enforce App Description → FRS Structural Alignment; Issue - Canon Update: Add App Description Template Guidance for Oversight Prevention  
Updated: 2026-03-20 — Added §5.3 Mandatory Governance Sections (24 sections); §19 App Description Template; §20 Module Creation Checklist Reference

---

## 1. Purpose

This policy establishes **App Descriptions as mandatory upstream authority artifacts** for all applications in the Maturion ecosystem.

App Descriptions define the **root identity, purpose, and scope** of an application and **precede all downstream specifications**, including Functional Requirement Specifications (FRS), architecture compilation, and build authorization.

**Constitutional Principle**:
> **No Architecture or Functional Requirement Specification may exist without an authoritative App Description.**

The App Description is the **first artifact** in the canonical flow:

```
App Description (Authoritative)
    ↓
Functional Requirement Specification (Derived)
    ↓
Technical Requirements Specification (TRS)
    ↓
Architecture Compilation
    ↓
Build Authorization
    ↓
Implementation
```

---

## 2. Constitutional Authority

This policy derives authority from:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Build Model Section 5.1 (Requirement Specification Pre-Architecture)
- **REQUIREMENT_SPECIFICATION_GOVERNANCE.md** - Requirements-First principle
- **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md** - Architecture cannot exist without clear requirements
- **One-Time Build Law** - Completeness requires upstream clarity

---

## 3. Core Requirements

### 3.1 App Descriptions Are MANDATORY

**Rule**: Every application MUST have an authoritative App Description.

**Rationale**: App Descriptions define product intent, which precedes functional specifications. Without product intent, requirements cannot be correctly derived.

**Enforcement**: 
- Architecture compilation MUST NOT proceed without validated App Description
- Build Authorization Gate MUST validate App Description existence
- FRS MUST explicitly reference and derive from App Description

### 3.2 App Descriptions Define Authoritative Product Intent

**Rule**: App Descriptions are the **single source of truth** for:
- Application purpose
- Application scope
- Success criteria
- Product vision

**Implications**:
- FRS requirements MUST align with App Description
- Architecture MUST derive True North from App Description
- No FRS requirement may contradict App Description intent
- Scope changes require App Description update first

### 3.3 App Descriptions MUST Exist BEFORE Downstream Artifacts

**Ordering Rule**: App Description creation precedes:
1. **Functional Requirement Specifications (FRS)**
2. **Technical Requirements Specification (TRS)**
3. **Architecture Compilation**
4. **Build Authorization**
5. **Implementation**

**Blocking Rule**: No downstream artifact may be created without an approved, authoritative App Description.

---

## 4. App Description Canonical Location

### 4.1 Canonical Location (REQUIRED)

**Rule**: The authoritative App Description MUST be located at:

```
docs/governance/{APP}_APP_DESCRIPTION.md
```

Where `{APP}` is the application name (e.g., `FOREMAN_APP_DESCRIPTION.md`, `PARTPULSE_APP_DESCRIPTION.md`).

**Rationale**: 
- Governance artifacts must have predictable, canonical locations
- Centralized governance documentation ensures discoverability
- Audit and compliance require consistent artifact locations

### 4.2 Root Location (OPTIONAL)

**Rule**: A convenience duplicate MAY exist at:

```
/APP_DESCRIPTION.md
```

(At repository root)

**Constraints**:
- Root location is **OPTIONAL ONLY**
- Root version is a **convenience duplicate** for developer access
- Canonical governance location is `docs/governance/{APP}_APP_DESCRIPTION.md`
- **All governance references MUST use the canonical location**
- If root duplicate exists, it MUST be kept in sync with canonical version

**Recommendation**: Use symbolic link or automated sync to maintain consistency if root duplicate is used.

---

## 5. App Description Content Requirements

### 5.1 Required Sections

Every App Description MUST include:

1. **Status Header**
   - Version
   - Status: `Authoritative | Draft | Superseded`
   - Owner (identified by name/role)
   - Approval Date
   - Last Updated

2. **Application Identity**
   - Application name
   - Purpose statement (what the app does)
   - Target users/audience
   - Core value proposition

3. **Scope Definition**
   - What is in scope
   - What is explicitly out of scope
   - Boundaries and constraints

4. **Success Criteria**
   - How to measure successful delivery
   - Key outcomes expected
   - Definition of "done" for the application

5. **Strategic Context**
   - Why this application exists
   - Business or operational driver
   - Relationship to other applications or systems

### 5.2 Optional Sections

App Description MAY include:
- High-level feature list (non-exhaustive)
- User personas
- Key use cases
- Non-functional priorities (performance, security, etc.)
- Future evolution considerations

---

### 5.3 Mandatory Governance Sections

> **Origin**: These 24 sections are derived from post-mortem analysis of 55+ governance oversights and process failures documented in the MAT module `modules/mat/BUILD_PROGRESS_TRACKER.md` (compiled 2026-03-09). Each section targets a specific recurring failure class. Every App Description for every module **MUST** include all 24 sections.

**Rationale**: Absence of these sections has repeatedly caused partial delivery, ambiguous ownership, missed implementation steps, and non-functional releases despite passing tests. Canonically mandating these sections enables auditability, traceability, test-first rigor, and prevents omission or governance boundary violations in successor builds.

Every App Description **MUST** include the following 24 sections. Omission of any section constitutes a governance defect blocking Build Authorization.

---

#### §AD-01 — Build Lifecycle Stages

**Requirement**: The App Description MUST define the canonical build lifecycle order.

**Content**: Explicit, ordered list of stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0: App Description → UX Workflow & Wiring Spec → FRS → TRS → Architecture → QA-to-Red → PBFAG → Implementation Plan → Builder Checklist → IAA Pre-Brief → Builder Appointment → Build. A prohibition statement that skipping or reordering stages is forbidden without documented CS2 approval is required.

**Evidence of Compliance**: All downstream stages reference this section; Foreman gate checks lifecycle order before allocating builders.

---

#### §AD-02 — Requirements Derivation Chain

**Requirement**: The App Description MUST specify the required traceability chain.

**Content**: A derivation diagram or table showing: App Description → UX Workflow & Wiring Spec → FRS → TRS → Architecture, with citations of the cross-linking artifact names expected at each transition. Gaps in the chain are a blocking defect.

**Evidence of Compliance**: Each downstream artifact contains explicit "derived from" statements referencing the upstream artifact by filename and version.

---

#### §AD-03 — Technology Stack

**Requirement**: The App Description MUST list the authoritative technology stack.

**Content**: All frameworks, languages, databases, infrastructure components, and external services. This section of the App Description is the **upstream authoritative baseline** for technology choices. The TRS is the **downstream authoritative realization** of that baseline (e.g., specific versions, deployment patterns, and additional constraints) and MUST remain consistent with the App Description. Any discrepancy between App Description and TRS is a **blocking defect** that MUST be resolved (by updating one or both artifacts so they align) **before Architecture commences**; TRS may refine or add constraints but may not contradict the App Description.

**Evidence of Compliance**: TRS and Architecture cross-reference this section; conflicts raise a blocking issue.

---

#### §AD-04 — Deliverable Artifacts

**Requirement**: The App Description MUST contain an explicit, checklisted list of all expected deliverables.

**Content**: Every deliverable output must be named, including (but not limited to): the deployable application itself, documentation artifacts, test suites, migration scripts, deployment runbooks, and governance evidence. The presence of "Is the deployable app a non-negotiable deliverable?" as a line item is mandatory.

**Evidence of Compliance**: PREHANDOVER proof closes every listed deliverable.

---

#### §AD-05 — Component Definition of Done

**Requirement**: The App Description MUST define "done" for every component at the component level.

**Content**: "Exists and works" policy — a component is only done when it is fully functional in the running application, not merely when source code exists. Each major component must be named with a definition-of-done statement covering: implemented, integrated, tested (red-green), manually verified in browser, and PREHANDOVER-proved.

**Evidence of Compliance**: Foreman verifies component-level done criteria during wave closure.

---

#### §AD-06 — Test-First Guarantee

**Requirement**: The App Description MUST mandate test-first development for every build wave, including remediation.

**Content**: Every build wave (including bug-fix and remediation waves) must be preceded by a QA-to-Red test suite. Code-first development is explicitly prohibited. This section must name the QA agent/role responsible and the minimum passing threshold before builder allocation.

**Evidence of Compliance**: Wave planning record shows QA-to-Red date preceding builder allocation date for every wave.

---

#### §AD-07 — Physical Verification Gate

**Requirement**: The App Description MUST mandate browser-based physical verification for all UI waves.

**Content**: Every wave that delivers or modifies a user-facing interface requires browser-based user-path verification. Screenshots and walkthrough evidence must be filed before the wave is closed. The role responsible for execution (typically Foreman or delegated agent) must be named.

**Evidence of Compliance**: PREHANDOVER proof includes a "Physical Verification" section with links to screenshots or screen-capture evidence.

---

#### §AD-08 — PBFAG Checklist

**Requirement**: The App Description MUST mandate the Pre-Build Functionality Assessment Gate (PBFAG).

**Content**: An explicit checklist of at minimum 8 checks, required between QA-to-Red completion and builder allocation for every wave. Checks must cover: test-suite completeness, prior-wave defect closure, auth wiring readiness, schema alignment, RLS coverage, and PREHANDOVER proof from prior wave.

**Evidence of Compliance**: PBFAG completion artifact filed for every wave before builder allocation is recorded.

---

#### §AD-09 — Agent Authority Chain

**Requirement**: The App Description MUST operationalize constitutional agent boundaries.

**Content**: Named rules for this module, for example: "Only CodexAdvisor writes agent contracts for this module", "Foreman is the only role that may allocate builders", "Builder agents may not modify governance artifacts". Gating points where authority transitions must be verified before proceeding must be explicit.

**Evidence of Compliance**: Violations of the authority chain are escalated to CS2; no builder begins without Foreman allocation evidence.

---

#### §AD-10 — Schema-to-Hook Validation

**Requirement**: The App Description MUST mandate column-by-column schema/migration validation.

**Content**: All schema changes and migrations must be cross-verified with data-architecture and with the hooks/queries that consume each column. No migration may be merged without a schema-to-hook alignment check confirming no orphaned columns and no missing hook coverage.

**Evidence of Compliance**: Schema-to-hook validation artifact filed for every migration-containing wave.

---

#### §AD-11 — Table Pathway Audit

**Requirement**: The App Description MUST mandate a Table Pathway Audit before closing any wave that touches the database.

**Content**: An inventory of every `.from('...')` database/table usage within the wave scope, cross-referenced with the migration coverage and test coverage for that table. The audit must confirm every table in scope is migrated, tested, and covered by RLS policy.

**Evidence of Compliance**: Table Pathway Audit artifact filed and approved before wave closure sign-off.

---

#### §AD-12 — RLS Audit Gate

**Requirement**: The App Description MUST mandate a Row-Level Security (RLS) audit gate before production deployment.

**Content**: A table-by-table review of CRUD policy coverage for every table the application reads or writes. RLS must be fully in place before production deployment is authorized. The audit must name the agent/role responsible and the sign-off authority.

**Evidence of Compliance**: RLS Audit Gate completion artifact filed; production deployment is blocked until sign-off is recorded.

---

#### §AD-13 — Auth Wiring Checklist

**Requirement**: The App Description MUST mandate an authentication wiring checklist for every wave.

**Content**: Mandatory coverage items: AuthProvider wrapping root component, ProtectedRoute or HOC on all authenticated routes, login/logout flows tested end-to-end, real Supabase (or equivalent) auth integration — no mock auth in production builds. Any deviation must be documented and CS2-approved.

**Evidence of Compliance**: Auth Wiring Checklist artifact filed for each wave; PREHANDOVER proof references it.

---

#### §AD-14 — AI Integration Requirements

**Requirement**: The App Description MUST specify AI integration compliance requirements.

**Content**: All AI/LLM calls within the application must route via the AIMC Gateway. Direct provider calls (e.g., direct OpenAI, Anthropic, or equivalent API calls from client or server) are prohibited. Architecture compliance must be testable (e.g., no direct API key usage outside the gateway). The AIMC Gateway endpoint must be named.

**Evidence of Compliance**: Architecture diagram shows all AI calls routing through AIMC Gateway; test verifies no direct provider calls exist.

---

#### §AD-15 — Edge Function Registry

**Requirement**: The App Description MUST mandate an Edge Function Registry for all serverless invocations.

**Content**: Every `supabase.functions.invoke` call (or equivalent) must point to a listed, named, deployed Edge Function in the registry. The registry must be filed before PREHANDOVER. Calls to unregistered or non-deployed functions are a blocking defect.

**Evidence of Compliance**: Edge Function Registry artifact filed; PREHANDOVER proof references registry and confirms all invocations match registered functions.

---

#### §AD-16 — Deployment Wave

**Requirement**: The App Description MUST mandate a Deployment and Commissioning wave as the final implementation wave.

**Content**: Every implementation plan must include an explicit Deployment & Commissioning wave. This wave must include: production environment provisioning, configuration injection, Combined Wave Test (CWT) execution, production smoke testing, and CWT closure report. No module may be declared complete without a CWT closure.

**Evidence of Compliance**: Deployment wave is listed in the implementation plan; CWT closure report is filed.

---

#### §AD-17 — Secret Naming Convention

**Requirement**: The App Description MUST specify the secret and environment variable naming convention.

**Content**: All environment variable names follow UPPERCASE invariant. `.env.example` is the canonical reference for all required environment variables — it must be complete and up to date. Secret naming must be cross-checked in the deployment wave. No production deployment may use environment variables not listed in `.env.example`.

**Evidence of Compliance**: `.env.example` validated during deployment wave; naming deviations are a blocking defect.

---

#### §AD-18 — Deployment Runbook

**Requirement**: The App Description MUST mandate deployment runbooks for all deployable components.

**Content**: Every deployable component requires an explicit runbook covering: deployment steps, rollback steps, re-deploy instructions, and environment-specific notes. Runbooks must be filed in the repository under `docs/runbooks/` or equivalent canonical location before the deployment wave closes.

**Evidence of Compliance**: Runbooks exist for all deployable components; deployment wave closure references runbook location.

---

#### §AD-19 — Notification/UX Patterns

**Requirement**: The App Description MUST specify the UX pattern for user-facing notifications.

**Content**: Use of `alert()` for user notifications is prohibited. A toast notification system (or equivalent UX framework) is required and must be named. Integration of the notification system must be confirmed before UI waves are closed. The App Description must name the library or pattern adopted.

**Evidence of Compliance**: No `alert()` calls in production code; toast system integration confirmed in physical verification.

---

#### §AD-20 — Shared State Architecture

**Requirement**: The App Description MUST specify the cross-page and cross-session state management architecture.

**Content**: The state management approach must be named (e.g., React Context, Redux, Zustand, or equivalent). Any global state flows — including authentication state, user preferences, and cross-component data — must be explicitly described. Ambiguity in state ownership is a blocking defect.

**Evidence of Compliance**: Architecture confirms state management approach; code review validates no undocumented global state patterns.

---

#### §AD-21 — API Authentication

**Requirement**: The App Description MUST mandate authentication for all user/session-context API endpoints.

**Content**: Every API endpoint that depends on user or session context must require JWT (or equivalent) authentication. Unauthenticated access to session-scoped endpoints is a security defect. A PREHANDOVER check verifying endpoint authentication must be required.

**Evidence of Compliance**: PREHANDOVER proof includes API authentication audit; all session-scoped endpoints validated.

---

#### §AD-22 — Audit Log Design

**Requirement**: The App Description MUST specify the audit logging strategy.

**Content**: The App Description must state: (a) which action types will be logged (e.g., create, update, delete, auth events), (b) how audit logs are queried or surfaced (admin view, export), and (c) the deduplication strategy (event ID, idempotency keys). Audit log design must be approved before Architecture commences.

**Evidence of Compliance**: Architecture includes audit log schema; audit log design is referenced in TRS.

---

#### §AD-23 — Tracker Update Requirement

**Requirement**: The App Description MUST mandate that the module progress tracker is updated at every wave closure.

**Content**: The module `BUILD_PROGRESS_TRACKER.md` (or equivalent) must be updated as part of every wave PR/merge. Wave closure is explicitly prohibited unless the tracker reflects the current wave status. The tracker update is not optional — it is a gate condition.

**Evidence of Compliance**: PREHANDOVER proof includes tracker update confirmation for every wave (e.g., checklist items and linked tracker diffs). Future enforcement: repository-level or centralized merge-gate automation (e.g., Foreman / Quality Professor / QP-FAIL-007) SHALL be configured to fail merges when the tracker is stale.

---

#### §AD-24 — State Persistence Specification

**Requirement**: The App Description MUST specify the data persistence model for every user setting and device state.

**Content**: For each piece of user-configurable or device-specific state, the App Description must specify: (a) storage location (local storage, session storage, database, cookie), (b) retention policy (session, permanent, TTL-based), and (c) ownership (which component or service is authoritative). Ambiguity in state persistence is a blocking defect.

**Evidence of Compliance**: Architecture references this specification; implementation review confirms alignment.

---

> **Checklist Reference**: See `governance/checklists/APP_DESCRIPTION_CREATION_CHECKLIST.md` for the executable checklist format of all 24 mandatory sections above.
>
> **Template Reference**: See `governance/templates/APP_DESCRIPTION_TEMPLATE.md` for the full App Description template incorporating all mandatory sections.
>
> **Evidence/Taxonomy Source**: MAT module `modules/mat/BUILD_PROGRESS_TRACKER.md` (55+ errors and process failures, 2026-03-09). The 24 sections above map to the root causes documented in that tracker.

---

## 6. App Description Approval and Authority

### 6.1 Approval Authority

**Rule**: App Descriptions MUST be approved by:
- **Johan (Human Authority)** - Final approval for all applications
- **OR** Designated Product Owner (if delegated by Johan)

### 6.2 Status: Authoritative

**Rule**: An App Description is considered **Authoritative** when:
- All required sections are complete
- Approval from designated authority is documented
- Status field is set to `Authoritative`
- Version is identified

**Non-Authoritative App Descriptions**:
- Status: `Draft` - Under development, not yet approved
- Status: `Superseded` - Replaced by newer version

**Blocking Rule**: Only App Descriptions with status `Authoritative` may be used as upstream authority for FRS, Architecture, or Build.

---

## 7. App Description Versioning and Evolution

### 7.1 Immutability After Approval

**Rule**: Once marked `Authoritative`, App Descriptions are **immutable**.

**Rationale**: Immutability ensures:
- Audit trail integrity
- Traceability stability
- Downstream artifacts reference stable source

### 7.2 Creating New Versions

To update an authoritative App Description:
1. Create new version with incremented version number
2. Reference previous version (Supersedes)
3. Follow full approval process
4. Mark previous version as `Superseded`
5. Update all downstream references (FRS, Architecture) to new version

---

## 8. Relationship to Functional Requirement Specifications (FRS)

### 8.1 Derivation Requirement

**Rule**: Every FRS MUST explicitly state derivation from App Description.

**Required Statement Location**: FRS header or Section 0 (preamble)

**Example Derivation Statement**:
> "This Functional Requirement Specification is derived from `FOREMAN_APP_DESCRIPTION.md` version 1.2, approved 2025-12-15. All requirements herein implement the application purpose, scope, and success criteria defined in that authoritative document."

### 8.2 Alignment Validation

**Rule**: FRS MUST align with App Description in:
- **Purpose**: FRS requirements must implement App Description purpose
- **Scope**: FRS scope must not exceed App Description scope
- **Success Criteria**: FRS acceptance criteria must map to App Description success criteria

**Contradiction Rule**: No FRS requirement may contradict App Description intent. If contradiction is discovered, App Description takes precedence and FRS must be corrected.

### 8.3 Traceability

**Rule**: Traceability matrix MUST exist showing:
- App Description → FRS derivation
- App Description success criteria → FRS acceptance criteria
- App Description scope boundaries → FRS scope boundaries

---

## 9. Relationship to Architecture Compilation

### 9.1 Architecture Input Requirement

**Rule**: Architecture Compilation MUST validate App Description before proceeding.

**Validation Requirements** (per ARCHITECTURE_COMPILATION_CONTRACT.md):
- App Description exists at canonical location
- Status is `Authoritative`
- Owner is identified
- Version is identified
- Approval status is confirmed

### 9.2 True North Derivation

**Rule**: Architecture "True North" MUST be derived from App Description.

**Required Statement** (per minimum-architecture-template.md):
> "This True North is derived from `{APP}_APP_DESCRIPTION.md` version {X.Y}."

**Alignment Confirmation**:
- Architecture must confirm no contradiction with App Description intent
- Architecture must reference App Description file explicitly

---

## 10. Relationship to Build Authorization Gate

### 10.1 Build Precondition

**Rule**: Build Authorization Gate MUST validate App Description before build may proceed.

**Blocking Conditions** (per BUILD_AUTHORIZATION_GATE.md):
- App Description missing
- App Description not authoritative
- FRS does not reference App Description
- Derivation lineage unclear

### 10.2 Evidence Requirements

**Rule**: Build Authorization Gate MUST require evidence:
- `architecture/builds/<build-id>/app-description-validation.md`
- FRS header or Section 0 showing derivation statement

---

## 11. Enforcement

### 11.1 Pre-FRS Enforcement

**Gate**: No FRS may be created without approved, authoritative App Description.

**Validation**:
- FRS creation checklist includes App Description validation
- FRS references App Description explicitly
- FRS derivation statement is present

### 11.2 Pre-Architecture Enforcement

**Gate**: No Architecture Compilation may proceed without validated App Description.

**Validation** (per ARCHITECTURE_COMPILATION_CONTRACT.md Section III):
- App Description exists
- App Description is authoritative
- FRS references App Description
- Alignment checklist is complete

### 11.3 Pre-Build Enforcement

**Gate**: No Build Authorization may be granted without validated App Description → FRS → Architecture lineage.

**Validation** (per BUILD_AUTHORIZATION_GATE.md Precondition 1):
- App Description exists and is authoritative
- FRS explicitly states derivation from App Description
- Evidence artifacts exist

---

## 12. Integration with Other Governance Artifacts

This policy integrates with:
- **ARCHITECTURE_COMPILATION_CONTRACT.md** - Defines App Description as Input #1
- **BUILD_AUTHORIZATION_GATE.md** - Defines App Description validation as Precondition 1
- **minimum-architecture-template.md** - Requires True North derivation from App Description
- **app-description-frs-alignment-checklist.md** - Defines validation procedure
- **REQUIREMENT_SPECIFICATION_GOVERNANCE.md** - FRS as downstream artifact
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Requirement Specification as first step

---

## 13. Explicit Non-Goals

This policy does NOT:
- Define module-specific content within template placeholder fields (module-specific content is authored per-module by the responsible agent/owner, not by this policy)
- Implement CI workflow changes (structural policy only)
- Modify runtime behavior
- Change existing approved App Descriptions retroactively

> **Note**: v1.0 of this policy stated "Define App Description content format in detail (deferred to template or schema)" as a non-goal. v2.0 explicitly supersedes that deferral: §5.3 now defines the 24 mandatory governance sections and §19/§20 reference the canonical template and checklist. The remaining non-goal is that this policy does not prescribe the *module-specific content* within placeholder fields — that is the responsibility of the authoring agent/owner.

---

## 14. Migration and Retroactive Application

### 14.1 Existing Applications Without App Descriptions

**Rule**: Existing applications without App Descriptions MUST create them before next architecture update or build.

**Process**:
1. Review existing documentation (README, FRS, architecture) to extract intent
2. Create App Description at canonical location
3. Obtain approval from Johan or designated authority
4. Update FRS and Architecture to reference App Description
5. Validate alignment using app-description-frs-alignment-checklist.md

### 14.2 Existing Applications With Informal Descriptions

**Rule**: Applications with informal descriptions (e.g., README.md with purpose statement) MAY formalize into App Description.

**Process**:
1. Extract relevant content
2. Structure per App Description requirements (Section 5)
3. Place at canonical location
4. Obtain approval
5. Update downstream references

---

## 15. Compliance and Audit

### 15.1 Audit Criteria

Compliance with this policy is verified by:
- App Description exists at canonical location for all applications
- App Description status is `Authoritative`
- FRS explicitly references App Description
- Architecture True North derived from App Description
- Alignment checklist exists and is complete

### 15.2 Non-Compliance Consequences

Failure to comply with this policy constitutes:
- **Governance violation** - Incomplete upstream authority
- **Architecture incompleteness** - Cannot proceed without App Description
- **Build blocking condition** - Build Authorization Gate blocks
- **Audit failure** - Traceability gap

---

## 16. Continuous Improvement

This policy is subject to:
- Learning promotion from downstream failures
- Feedback from FRS and Architecture processes
- Audit findings
- Compliance requirements evolution

Updates to this policy require:
- Documented rationale
- Governance Administrator review
- Johan approval

---

## 17. Success Criteria

This policy is successful when:
- All applications have authoritative App Descriptions
- FRS derivation from App Description is explicit and validated
- Architecture True North aligns with App Description
- Build Authorization Gate validates lineage
- Traceability is complete and auditable
- Governance is machine-checkable
- All 24 mandatory governance sections (§5.3) are present and validated in every App Description

---

## 18. Guiding Principle

> **You cannot specify what you have not first defined.**  
> **Product intent precedes requirements.**

App Descriptions are not bureaucracy. They are **clarity at the root of system definition** and guarantee structural integrity across all downstream artifacts.

Governance must enforce order before complexity.

---

## 19. App Description Full Template

A complete, machine-readable App Description template incorporating all mandatory sections (§5.1 and §5.3) is available at:

```
governance/templates/APP_DESCRIPTION_TEMPLATE.md
```

This template:
- Provides a fill-in-the-blanks structure for every required and mandatory section
- Includes inline guidance notes for each section
- Must be used as the starting point for every new module's App Description
- Is version-controlled and updated whenever §5.3 mandatory sections change

---

## 20. Module Creation Checklist

A checklist artifact for verifying App Description completeness at new module creation time is available at:

```
governance/checklists/APP_DESCRIPTION_CREATION_CHECKLIST.md
```

This checklist:
- Maps every required section (§5.1) and every mandatory governance section (§5.3) to a binary pass/fail check
- Must be completed and filed before Build Authorization is granted
- Is the gate artifact for Pre-FRS and Pre-Architecture enforcement (§11.1, §11.2)

---

**End of APP DESCRIPTION REQUIREMENT POLICY**

---

**Document Metadata**:
- Policy ID: APP_DESCRIPTION_REQUIREMENT_POLICY_V2.0
- Authority: Canonical Governance Policy
- Required By: Issue - Enforce App Description → FRS Structural Alignment; Issue - Canon Update: Add App Description Template Guidance for Oversight Prevention
- Enforcement: Architecture Compilation Contract, Build Authorization Gate, Governance Administrator
- Integration: ARCHITECTURE_COMPILATION_CONTRACT.md, BUILD_AUTHORIZATION_GATE.md, minimum-architecture-template.md, app-description-frs-alignment-checklist.md, APP_DESCRIPTION_TEMPLATE.md, APP_DESCRIPTION_CREATION_CHECKLIST.md
- Version History: v1.0 — initial; v2.0 — added §5.3 (24 mandatory governance sections), §19 (template reference), §20 (checklist reference)
