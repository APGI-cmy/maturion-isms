
## Status
Canonical Governance Template  
Version: v1.1  
Authority: Johan Ras  
Applies To: All Architecture Documents  
Required By: Issue - Enforce App Description → FRS Structural Alignment; APP_DESCRIPTION_REQUIREMENT_POLICY.md v2.0 §AD traceability

---

## Purpose

This template defines the **minimum required structure** for all architecture documents in the Maturion ecosystem.

Architecture documents that do not conform to this template are **incomplete** and MUST NOT proceed to implementation.

This template ensures:
- True North derivation from App Description
- Upstream authority traceability
- Completeness per ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md
- Implementation readiness
- Audit and compliance readiness

---

## How to Use This Template

1. Copy this template to create a new architecture document
2. Replace placeholders (e.g., `{APP}`, `{VERSION}`, etc.) with actual values
3. Complete all REQUIRED sections
4. Complete OPTIONAL sections if applicable
5. Validate completeness per ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md
6. Obtain approval before proceeding to implementation

**Placeholder Conventions**:
- `{APP}` = Application name (e.g., `FOREMAN`, `PARTPULSE`)
- `{VERSION}` = Version number (e.g., `1.0`, `2.1`)
- `{DATE}` = ISO 8601 date (e.g., `2025-12-22`)
- `{BUILD_ID}` = Build identifier (e.g., `BUILD_001`)

---

## Template Structure

---

# {APP} ARCHITECTURE

## Metadata (REQUIRED)

**Application**: {APP}  
**Architecture Version**: {VERSION}  
**Build ID**: {BUILD_ID}  
**Status**: `Draft | Approved | Implemented | Superseded`  
**Architect**: {NAME/ROLE}  
**Approval Date**: {DATE} or `N/A`  
**Approved By**: {APPROVER} or `N/A`  
**Last Updated**: {DATE}

---

## Section 0: Upstream Authority and Derivation (REQUIRED)

### App Description Reference

**This architecture is derived from and must align with:**

- **App Description**: `docs/governance/{APP}_APP_DESCRIPTION.md`
- **App Description Version**: {VERSION}
- **App Description Status**: `Authoritative`
- **App Description Approval Date**: {DATE}

**Derivation Statement**:
> This architecture implements the application purpose, scope, and success criteria defined in `{APP}_APP_DESCRIPTION.md` version {VERSION}. All architecture design decisions align with the App Description and do not contradict its intent.

### Functional Requirement Specification Reference

**This architecture implements requirements from:**

- **FRS Document**: `requirements/{APP}_FRS.md` (or appropriate location)
- **FRS Version**: {VERSION}
- **FRS Status**: `Approved`

**FRS Derivation**: The FRS is derived from the App Description (as documented in FRS header/Section 0).

**Traceability**: All architecture elements trace to FRS requirements, which trace to App Description.

---

## Section 1: True North (REQUIRED)

### True North Statement

**True North**: {Concise statement of the core purpose and strategic goal}

**Example**:
> Enable Johan to have complete situational awareness of all builds and governance across the Maturion ecosystem in real-time with drill-down capability from system to root cause.

### Derivation from App Description

**This True North is derived from `{APP}_APP_DESCRIPTION.md` version {VERSION}.**

**Alignment Confirmation**:
- [ ] True North aligns with App Description purpose
- [ ] True North aligns with App Description success criteria
- [ ] No contradiction with App Description intent

**Specific Alignment Details**:
{Explain how True North maps to App Description purpose and success criteria}

---

## Section 2: System Overview (REQUIRED)

### Purpose and Scope

**Purpose**: {What this application does}

**Scope**:
- **In Scope**: {What is included}
- **Out of Scope**: {What is explicitly excluded}

**Target Users**: {Who uses this application}

### High-Level Architecture

{Provide high-level architecture diagram or description}

**Key Components**:
1. {Component 1} - {Purpose}
2. {Component 2} - {Purpose}
3. {Component N} - {Purpose}

---

## Section 3: Component Decomposition (REQUIRED)

### Component Responsibilities

For each component, define:
- **Component Name**
- **Purpose**
- **Responsibilities** (what it does)
- **Interfaces** (how it interacts with other components)
- **Dependencies** (what it depends on)

**Component 1: {NAME}**
- Purpose: {What it does}
- Responsibilities: {Specific responsibilities}
- Interfaces: {APIs, events, data contracts}
- Dependencies: {What it depends on}

{Repeat for all components}

---

## Section 4: Completeness Domains (REQUIRED)

**This section addresses all 13 mandatory completeness domains per ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md.**

### 4.1 Deployment Target Declaration

**Target Platform**: {e.g., Vercel, AWS Lambda, Docker on Azure}  
**Platform Version Constraints**: {Required platform/runtime versions}  
**Platform-Specific Configuration**: {Settings unique to platform}  
**Deployment Entry Point**: {How application starts}  
**Platform Limitations**: {Constraints, e.g., timeouts, cold starts}

#### 4.1.1 Infrastructure Deployment Validation (Waves 5-7 Lessons)

**Pre-Wave Validation Checklist** (MANDATORY before wave authorization):

**Frontend Infrastructure**:
- [ ] Deployment platform account created (Vercel/Netlify/etc.)
- [ ] Project configured in deployment platform
- [ ] Build settings configured and tested
- [ ] Environment variables configured in platform
- [ ] Custom domain configured (if applicable)
- [ ] Preview deployment URL generated and accessible
- [ ] Production deployment configuration documented

**Backend Infrastructure**:
- [ ] Database platform account created (Supabase/PostgreSQL/etc.)
- [ ] Database instance provisioned
- [ ] Database schema creation scripts ready
- [ ] Database migration tool configured
- [ ] API hosting platform configured (Vercel/AWS/etc.)
- [ ] API deployment tested and accessible
- [ ] Database connection string configured in API

**Critical Post-Deployment Validation**:
- [ ] Frontend deploys successfully to production
- [ ] Backend API deploys successfully to production
- [ ] Database schema deployed and seeded
- [ ] Frontend can connect to backend API
- [ ] Backend can connect to database
- [ ] Health check endpoints return 200 OK
- [ ] At least one complete user workflow works end-to-end

**Evidence Requirements for Wave Closure**:
- Working frontend URL (e.g., https://app.example.com)
- Working backend API URL (e.g., https://api.example.com)
- Database connection verification screenshot
- E2E workflow demonstration video/screenshots
- Deployment configuration files committed to repo

**Prohibited Patterns** (Deviation Prevention):
- ❌ Wave closure without deployed frontend
- ❌ Wave closure without deployed backend
- ❌ "We'll deploy it later" deferral
- ❌ Missing database deployment
- ❌ Untested deployment configuration

### 4.2 Runtime Entrypoint and Filesystem Expectations

**Application Entry Point**: {Primary entry file(s)}  
**Build Output Location**: {Where compiled artifacts are placed}  
**Static Asset Paths**: {Where static files are served from}  
**Configuration File Locations**: {Where config files must be placed}  
**Data Persistence Paths**: {Where data is stored if filesystem persistence used}  
**Filesystem Constraints**: {Read-only, ephemeral, volume mounts}

### 4.3 Environment Variable Requirements and Provider Constraints

**Required Environment Variables**: {Complete list}  
**Optional Environment Variables**: {Variables with default behavior}  
**Variable Purposes**: {What each variable controls}  
**Value Constraints**: {Valid value ranges, formats}  
**Provider-Specific Variables**: {Platform-specific variables}  
**Variable Precedence**: {How variables from different sources interact}  
**Secrets Management**: {Which variables are sensitive}  
**Variable Validation**: {How and when validated}

**`.env.example` File**: MANDATORY - Must exist at repository root (or location specified by platform)  
**See**: ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md Section 3.3 for `.env.example` format requirements

### 4.4 Database and Data Migration Strategy

**Data Persistence Mechanism**: {Database type, ORM, filesystem, external service}  
**Schema Definition Location**: {Where schema is defined}  
**Migration Tool**: {How schema changes are applied}  
**Migration Execution Timing**: {When migrations run}  
**Migration Responsibility**: {Who/what executes migrations}  
**Migration Rollback Strategy**: {How to undo migrations}  
**Data Seeding**: {Initial data requirements}  
**Backup Strategy**: {How data is backed up}

### 4.5 Non-Testable Configuration Failure Boundaries

**Non-Testable Configuration**: {Config that cannot be tested in CI}  
**Runtime-Only Verification**: {What can only be verified after deployment}  
**Manual Verification Steps**: {Post-deployment manual checks}  
**Failure Detection Strategy**: {How config failures are detected}  
**Rollback Triggers**: {What signals indicate failure requiring rollback}

### 4.6 Integration and External Dependencies

**External Services**: {All services app depends on}  
**Dependency Contracts**: {Expected interfaces, API versions, auth}  
**Dependency Failure Modes**: {What happens when dependency unavailable}  
**Retry and Timeout Strategies**: {How app handles transient failures}  
**Circuit Breaker Requirements**: {When to stop retrying}  
**Degraded Mode Behavior**: {What functionality remains when dependencies fail}

### 4.7 Security and Compliance Controls

**Authentication Mechanism**: {How users/systems are authenticated}  
**Authorization Model**: {How access control decisions are made}  
**Data Encryption**: {At-rest and in-transit encryption}  
**Secrets Management**: {How sensitive data is stored and accessed}  
**Input Validation and Sanitization**: {How untrusted input is handled}  
**Audit Logging**: {What actions are logged}  
**Compliance Mappings**: {ISO 27001, NIST, or other controls implemented}

### 4.8 Performance and Scalability Constraints

**Expected Load**: {Concurrent users, requests/sec, data volume}  
**Response Time Targets**: {Max latency for key operations}  
**Resource Limits**: {CPU, memory, storage constraints}  
**Scaling Strategy**: {Horizontal vs vertical, auto-scaling triggers}  
**Bottlenecks**: {Known performance bottlenecks and mitigation}

### 4.9 Error Handling and Observability

**Error Classification**: {How errors are categorized}  
**Error Responses**: {What error info is returned}  
**Logging Strategy**: {What is logged, levels, storage}  
**Monitoring and Alerting**: {Key metrics, health checks, alert thresholds}  
**Debugging Support**: {How to diagnose failures in production}

### 4.10 Test Strategy and QA Domains

**QA Domains**: {Which QA domains from QA_POLICY_MASTER.md apply}  
**Test Scope**: {What is tested at unit, integration, e2e levels}  
**Test Data Strategy**: {How test data is generated, managed, isolated}  
**Non-Testable Boundaries**: {What cannot be tested - see 4.5}  
**Test Environment Requirements**: {Environments needed for testing}

### 4.11 Wiring & Interconnectivity Architecture

**System Wiring Diagram**: {Complete logical diagram showing all component connections}  
**Explicit Connection Definitions**:
- Component-to-component connections
- Direction of data/control flow
- Sync vs async interactions
- Error and timeout propagation paths
**Connection Ownership**: {Producer/consumer for each connection}  
**Startup Order**: {Definition of startup order and dependency resolution}  
**Shutdown and Failure Cascades**: {Shutdown sequences and failure cascades}

#### 4.11.1 Frontend-Backend Wiring (REQUIRED if UI exists)

**Critical Validation Points** (Waves 5-7 Lessons - Deviations #9, #12, #13):

**Frontend Application Scaffolding**:
- [ ] React app (or chosen framework) scaffolded and launches successfully
- [ ] UI component library/design system integrated
- [ ] Routing configured (if multi-page app)
- [ ] Build configuration (Vite/Webpack/etc.) complete and tested
- [ ] Development server runs without errors
- [ ] Production build succeeds without errors

**UI → API Integration Wiring**:
- [ ] API client library configured (fetch/axios/tRPC/etc.)
- [ ] API endpoint URLs configurable (env variables)
- [ ] Authentication token handling implemented
- [ ] API error handling implemented in UI
- [ ] CORS configuration documented and tested
- [ ] Request/response payload validation in place

**Backend Deployment Configuration**:
- [ ] Backend deployment target specified (Supabase/Vercel/AWS/etc.)
- [ ] Database schema deployed and seeded
- [ ] Database migration strategy tested
- [ ] Backend API accessible from deployment URL
- [ ] Environment variables configured in deployment platform
- [ ] Health check endpoints implemented and verified

**UI Wiring Tests** (MANDATORY - cannot skip):
- [ ] E2E tests covering critical user workflows
- [ ] Integration tests for API client → backend
- [ ] Component tests for UI state management
- [ ] Visual regression tests (if applicable)
- [ ] Mobile/responsive tests (if applicable)

**Deployment Evidence Requirements**:
- Working deployment URL for frontend application
- Working API endpoint URL for backend
- Database connection verification
- Seeded test data confirmation
- End-to-end workflow demonstration (screenshots/video)

### 4.12 End-to-End Functional Paths

**Primary User Workflows**: {Main user-facing functionality - complete path}  
**Secondary/Administrative Workflows**: {Management, config, admin actions}  
**Error and Failure Scenarios**: {How failures propagate and are handled}  
**Degraded/Partial Availability Scenarios**: {Behavior when dependencies unavailable}

**Path Tracing**: Each path must trace through all layers:
> UI → API → Domain Logic → Data → External Dependencies → Response → Observability

#### 4.12.1 Mandatory Workflow Evidence (Waves 5-7 Lessons)

**For EVERY primary user workflow, provide**:
- [ ] **Working Frontend**: Live deployment URL showing UI
- [ ] **Working Backend**: Live API endpoint responding to requests
- [ ] **Integrated Data Flow**: Demonstrated data persistence and retrieval
- [ ] **E2E Test Coverage**: Automated test covering full workflow
- [ ] **Evidence Artifacts**:
  - Screenshot/video of workflow execution
  - Test execution logs showing GREEN status
  - Deployment URLs (frontend + backend)
  - Database query results showing persisted data

**Example Evidence Structure**:
```markdown
## Workflow: User Login
- Frontend URL: https://app.example.com/login
- API Endpoint: https://api.example.com/auth/login
- E2E Test: tests/e2e/auth/login.spec.ts (✅ PASSING)
- Evidence:
  - Screenshot: evidence/login-flow.png
  - Test Log: evidence/login-test-results.txt
  - Database Verification: User record created in auth.users table
```

**Critical Rule**: Architecture approval REQUIRES live demonstration of at least ONE complete end-to-end workflow with working frontend, backend, and data persistence.

### 4.13 Wave-Based One-Time Build Model (If Applicable)

**Wave Plan**: {Complete list of waves if using wave-based delivery}

**For Each Wave**:
- Scope definition (what is included)
- Included components (explicit list)
- Included wiring (connections within and across waves)
- Excluded components (explicit list of what is NOT in this wave)

**Cumulative Wiring Map**: {Diagram showing wiring growth per wave}

**QA Strategy**:
- Wave-isolated tests (tests for wave N only)
- Cumulative regression tests (tests for waves 1…N combined)

**Completeness Validation**: Each wave MUST satisfy One-Time Build Law (100% complete within scope)

---

### 4.14 APP_DESCRIPTION_REQUIREMENT_POLICY Coverage (REQUIRED)

> **Policy Reference**: `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0  
> **Rule**: This architecture MUST explicitly address all applicable §AD sections listed below. Each checkbox confirms that the architecture contains design decisions or referenced artifacts satisfying the corresponding policy requirement. Unchecked items with no justification are **blocking defects** that prevent Architecture approval.

#### §AD-10 through §AD-16 Coverage

| §AD Section | Policy Title | Architecture Coverage | Status |
|-------------|-------------|----------------------|--------|
| §AD-10 | Schema-to-Hook Validation | {Architecture section or TRS §4.1 reference} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-11 | Table Pathway Audit | {Architecture section or TRS §4.2 reference} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-12 | RLS Audit Gate | {Architecture section or TRS §4.3 reference} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-13 | Auth Wiring Checklist | {Architecture section — auth component design} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-14 | AI Integration Requirements | {Architecture section — AIMC Gateway routing} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-15 | Edge Function Registry | {Architecture section or TRS §4.4 reference} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-16 | Deployment Wave | {Architecture section — deployment wave plan} | ✅ Covered / ❌ Not Covered / N/A |

#### §AD-20 through §AD-22 Coverage

| §AD Section | Policy Title | Architecture Coverage | Status |
|-------------|-------------|----------------------|--------|
| §AD-20 | Shared State Architecture | {Architecture section or TRS §4.6 reference} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-21 | API Authentication | {Architecture section — JWT/auth on all session-scoped endpoints} | ✅ Covered / ❌ Not Covered / N/A |
| §AD-22 | Audit Log Design | {Architecture section or TRS §4.7 reference} | ✅ Covered / ❌ Not Covered / N/A |

#### §AD Policy Coverage Checkboxes

**§AD-10 through §AD-16**:
- [ ] **§AD-10 Schema-to-Hook Validation**: Architecture mandates schema-to-hook alignment check for every migration wave
- [ ] **§AD-11 Table Pathway Audit**: Architecture mandates Table Pathway Audit before closing any database-touching wave
- [ ] **§AD-12 RLS Audit Gate**: Architecture mandates RLS table-by-table audit before production deployment; production deployment gate references RLS sign-off
- [ ] **§AD-13 Auth Wiring Checklist**: Architecture includes auth wiring design — AuthProvider, ProtectedRoute/HOC, login/logout flows, and Supabase auth integration are explicitly designed
- [ ] **§AD-14 AI Integration Requirements**: Architecture confirms all AI/LLM calls route via AIMC Gateway; no direct provider calls — OR — documented as `N/A` (no AI integration): {justification}
- [ ] **§AD-15 Edge Function Registry**: Architecture mandates Edge Function Registry before PREHANDOVER — OR — documented as `N/A` (no edge functions): {justification}
- [ ] **§AD-16 Deployment Wave**: Architecture includes an explicit Deployment & Commissioning wave covering production provisioning, configuration injection, CWT execution, production smoke testing, and CWT closure

**§AD-20 through §AD-22**:
- [ ] **§AD-20 Shared State Architecture**: Architecture explicitly names and designs the state management approach; all global state flows (auth state, user preferences, cross-component data) are described; no ambiguous state ownership
- [ ] **§AD-21 API Authentication**: Architecture mandates JWT (or equivalent) authentication on all user/session-context API endpoints; unauthenticated access to session-scoped endpoints is explicitly prohibited; PREHANDOVER check for endpoint authentication is required
- [ ] **§AD-22 Audit Log Design**: Architecture includes audit log schema; logged action types, query/surfacing mechanism, and deduplication strategy are explicitly specified; audit log design is approved before Architecture commences

**Coverage Completion Gate**: All checkboxes above must be checked, or items must be documented as `N/A` with explicit justification. Any unchecked item without justification **blocks Architecture approval**.

---

## Section 5: QA Strategy (REQUIRED)

### QA Domains

**Applicable QA Domains** (per QA_POLICY_MASTER.md):
- [ ] Architecture Conformance
- [ ] Integration
- [ ] Functional
- [ ] UX (if applicable)
- [ ] Security
- [ ] Performance (if applicable)
- [ ] Compliance (if applicable)

### Test Coverage

**Unit Tests**: {What is unit tested}  
**Integration Tests**: {What is integration tested}  
**End-to-End Tests**: {What is e2e tested}  
**Manual Tests**: {What requires manual verification}

### QA Evidence Requirements

**Evidence to be Generated**:
- Test execution results
- Coverage reports
- Performance benchmarks (if applicable)
- Security scan results
- Compliance validation reports (if applicable)

**Evidence Location**: `architecture/builds/{BUILD_ID}/evidence/`

---

## Section 6: Traceability (REQUIRED)

### App Description → FRS → Architecture Mapping

**App Description Success Criteria → FRS Requirements**:
| App Description Criterion | FRS Requirement ID | Status |
|---------------------------|-------------------|--------|
| {Criterion 1}             | REQ-YYYY-NNNN     | Mapped |

**FRS Requirements → Architecture Elements**:
| FRS Requirement ID | Architecture Element | Component | Status |
|-------------------|----------------------|-----------|--------|
| REQ-YYYY-NNNN     | {Element}            | {Component} | Mapped |

### Architecture → Implementation Mapping

**Architecture Elements → Implementation Components**:
| Architecture Element | Implementation File/Module | Status |
|---------------------|---------------------------|--------|
| {Element}           | {File path}                | Planned |

### Architecture → QA Mapping

**Architecture Elements → QA Tests**:
| Architecture Element | Test Type | Test Location | Status |
|---------------------|-----------|---------------|--------|
| {Element}           | {Unit/Integration/E2E} | {Path} | Planned |

---

## Section 7: Evidence Requirements (REQUIRED)

### Required Evidence Artifacts

**Evidence to be Generated During Build**:
1. `app-description-validation.md` - App Description validation evidence
2. `frs-alignment-validation.md` - FRS alignment validation evidence
3. `architecture-completeness-validation.md` - Completeness validation evidence
4. `traceability-matrix.md` - Complete traceability matrix
5. `governance-compliance-validation.md` - Governance/compliance validation evidence
6. `BUILD_AUTHORIZATION_CERTIFICATE.md` - Build authorization certificate (if authorized)
7. Test execution results
8. Coverage reports
9. Security scan results (if applicable)
10. Performance benchmark results (if applicable)

**Evidence Storage Location**: `architecture/builds/{BUILD_ID}/`

---

## Section 8: Approval and Sign-Off (REQUIRED)

### Completeness Validation

**Completeness Checklist** (per ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md):
- [ ] All 13 completeness domains addressed (Sections 4.1–4.13)
- [ ] True North derived from App Description
- [ ] Upstream references complete
- [ ] Traceability complete
- [ ] QA strategy complete
- [ ] Evidence requirements defined
- [ ] No TODOs or ambiguities
- [ ] APP_DESCRIPTION_REQUIREMENT_POLICY §AD-10–§AD-16 coverage checkboxes complete (Section 4.14)
- [ ] APP_DESCRIPTION_REQUIREMENT_POLICY §AD-20–§AD-22 coverage checkboxes complete (Section 4.14)

### Architecture Approval

**Approval Required From**:
- [ ] Foreman (FM) - Architecture complete and correct
- [ ] Governance Administrator - Governance compliance validated
- [ ] Johan (or delegated authority) - Final approval

**Approval Date**: {DATE}  
**Approved By**: {APPROVER}

**Status After Approval**: `Approved` → Ready for Build Authorization Gate

---

## Section 9: Change History (REQUIRED)

| Version | Date | Change Description | Changed By | Approval |
|---------|------|-------------------|------------|----------|
| {VERSION} | {DATE} | {Description} | {Person} | {Approver} |

**Supersedes**: {Previous version if any}  
**Superseded By**: {New version if superseded}

---

**End of Architecture Document**

---

**Document Metadata**:
- Architecture ID: {APP}_ARCHITECTURE_{VERSION}
- Required By: APP_DESCRIPTION_REQUIREMENT_POLICY.md, ARCHITECTURE_COMPILATION_CONTRACT.md
- Enforcement: BUILD_AUTHORIZATION_GATE.md, Governance Administrator
- Integration: ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md, QA_POLICY_MASTER.md

---

## Notes for Architects

1. **Do not skip sections** - All REQUIRED sections must be completed
2. **Be explicit** - Avoid ambiguity, assumptions, or "standard practice" references
3. **Trace upstream** - Always reference App Description and FRS explicitly
4. **Validate completeness** - Use ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md checklist
5. **Generate evidence** - Document all validation activities
6. **Seek approval** - Do not proceed without proper approval

**This template ensures One-Time Build Law compliance by enforcing architectural completeness before implementation.**
