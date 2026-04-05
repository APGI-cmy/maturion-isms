# BUILD PROGRESS TRACKER

**Module**: [Module Name]  
**Module Slug**: [module-slug]  
**Last Updated**: [YYYY-MM-DD]  
**Updated By**: [Agent/Person Name]

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

### Stage 1: App Description
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/01-app-description/`  
**Key Artifacts**:
- [ ] `app-description.md` - Authoritative intent, scope, users, outputs, constraints
- [ ] All §AD-01–§AD-24 sections per `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 complete
- [ ] App Description approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/02-ux-workflow-wiring-spec/`  
**Key Artifacts**:
- [ ] `ux-workflow-wiring-spec.md` — Complete user journey maps, screen interactions, data flows, wiring
- [ ] All primary and secondary user paths documented
- [ ] Explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs
- [ ] Approved by Foreman and client/user representative
- [ ] No gap between stated journeys and wired system behaviour

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage] (Mandatory for user-facing builds; Wiring Spec Only for non-user-facing builds)

---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/03-frs/`  
**Key Artifacts**:
- [ ] `functional-requirements.md` - Verifiable requirements derived from App Description + UX Workflow & Wiring Spec
- [ ] Derivation statements from both upstream artifacts included
- [ ] 100% §AD traceability confirmed; no TBD items
- [ ] FRS approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/04-trs/`  
**Key Artifacts**:
- [ ] `technical-requirements-specification.md` - Technical constraints, performance requirements, integration requirements
- [ ] `frs-to-trs-traceability.md` - Traceability matrix linking FRS to TRS
- [ ] Tool validation and quality gate definitions
- [ ] TRS approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 5: Architecture
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/05-architecture/`  
**Key Artifacts**:
- [ ] `architecture.md` - Structures and decisions that satisfy FRS and TRS
- [ ] All TRS requirements traceable to architecture components
- [ ] Architecture completeness checklist per `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` PASS
- [ ] Architecture approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 6: QA-to-Red
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/06-qa-to-red/`  
**Key Artifacts**:
- [ ] Full RED test suite derived from FRS + TRS + Architecture
- [ ] Coverage of all user journeys from Stage 2
- [ ] QA Catalog alignment confirmed
- [ ] RED QA suite signed off by Foreman (no implementation started)

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 7: PBFAG (Pre-Build Functionality Assessment Gate)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] PASS  
**Location**: `modules/[module-slug]/07-pbfag/`  
**Key Artifacts**:
- [ ] PBFAG checklist completed — all checks PASS
- [ ] Change-Propagation Audit complete
- [ ] Runtime/Deployment Contract filed
- [ ] Golden Path Verification Pack defined
- [ ] All external dependencies confirmed available
- [ ] PBFAG PASS recorded by Foreman

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 8: Implementation Plan
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/08-implementation-plan/`  
**Key Artifacts**:
- [ ] `implementation-plan.md` - Delivery wave breakdown with explicit scope per wave
- [ ] Wave sequencing with dependency declarations
- [ ] No placeholder waves or TBD scope entries
- [ ] Implementation Plan approved by Foreman

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 9: Builder Checklist
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] PASS  
**Location**: `modules/[module-slug]/09-builder-checklist/`  
**Key Artifacts**:
- [ ] Builder Checklist completed for each builder candidate
- [ ] Builder agent contracts verified as current
- [ ] Scope, RED QA, and architecture comprehension confirmed
- [ ] Protocol compliance (STOP-AND-FIX, evidence, merge gate) confirmed
- [ ] Foreman role-fit confirmation recorded
- [ ] Builder Checklist PASS for all appointed builders

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 10: IAA Pre-Brief
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/10-iaa-pre-brief/`  
**Key Artifacts**:
- [ ] IAA Pre-Brief invoked by Foreman with full context
- [ ] IAA Pre-Brief artifact filed (acceptance criteria per task)
- [ ] ASSURANCE-TOKEN or PHASE_A_ADVISORY status recorded
- [ ] Pre-Brief acknowledged by Foreman and all designated builders

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 11: Builder Appointment
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/11-builder-appointment/`  
**Key Artifacts**:
- [ ] `builder-contract.md` - Explicit builder agent contract
- [ ] Formal appointment issued by Foreman after all Stages 1–10 gate-passed
- [ ] Appointment recorded in module tracker
- [ ] Builder appointed by FM

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 12: Build Execution & Evidence
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/12-build-evidence/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence (QA-to-Green per wave)
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

#### 5.1 Critical Deliverable Validation (Waves 5-7 Lessons)

**Frontend Application Deliverables** (if UI required):
- [ ] React app (or framework) exists at documented path
- [ ] App launches successfully in development mode
- [ ] Production build succeeds without errors
- [ ] App deployed to staging/production environment
- [ ] Deployment URL accessible and functional
- [ ] UI components render correctly
- [ ] Routing works (if multi-page app)

**Backend Application Deliverables** (if backend required):
- [ ] API server code exists at documented path
- [ ] API server starts successfully
- [ ] Database schema deployed
- [ ] Database seeded with test data
- [ ] API endpoints respond correctly
- [ ] API deployed to staging/production
- [ ] API URL accessible and functional

**UI-to-Backend Wiring Validation** (MANDATORY if both exist):
- [ ] Frontend can successfully call backend API
- [ ] Authentication/authorization flow works
- [ ] Data flows from UI → API → Database → API → UI
- [ ] Error handling works (backend errors shown in UI)
- [ ] CORS configured correctly (no browser errors)
- [ ] E2E tests covering full workflows PASSING

**Infrastructure Deployment Evidence** (REQUIRED):
- [ ] Frontend deployment URL documented and accessible
- [ ] Backend deployment URL documented and accessible
- [ ] Database connection string configured (secrets secured)
- [ ] Environment variables configured in deployment platforms
- [ ] Health check endpoints verified
- [ ] At least ONE complete workflow demonstrated with screenshots/video

**Prohibition - Wave Closure WITHOUT**:
- ❌ Frontend deployment (if UI specified in requirements)
- ❌ Backend deployment (if API specified in requirements)
- ❌ Database deployment (if data persistence required)
- ❌ Working E2E workflow demonstration
- ❌ UI wiring tests (if both UI and backend exist)

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

## Current Stage Summary

**Current Stage**: [Stage Number and Name]  
**Overall Progress**: [X]% complete  
**Blockers**: [List any blockers or dependencies]  
**Next Steps**: [What needs to happen next]

---

## Governance Compliance

- [ ] All stages proceeding in order (no skipped stages)
- [ ] Traceability maintained (App Description → UX Workflow & Wiring Spec → FRS → TRS → Architecture)
- [ ] All required approvals obtained
- [ ] Evidence artifacts created for each stage
- [ ] Module manifest up to date

---

## Notes and Observations

[Any additional notes, lessons learned, or observations about this module's progress through the lifecycle]

---

**Template Version**: 1.0.0 (includes TRS stage)  
**Template Authority**: MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md  
**Last Template Update**: 2026-02-13
