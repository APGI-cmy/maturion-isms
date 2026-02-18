# BUILD PROGRESS TRACKER

**Module**: [Module Name]  
**Module Slug**: [module-slug]  
**Last Updated**: [YYYY-MM-DD]  
**Updated By**: [Agent/Person Name]

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages.

### Stage 0: App Description
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [x] COMPLETE  
**Location**: `modules/[module-slug]/00-app-description/`  
**Key Artifacts**:
- [ ] `app-description.md` - Authoritative intent, scope, users, outputs, constraints
- [ ] App Description approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 1: Functional Requirements Specification (FRS)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/01-frs/`  
**Key Artifacts**:
- [ ] `functional-requirements.md` - Verifiable requirements derived from App Description
- [ ] Derivation statement from App Description included
- [ ] FRS approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 1.5: Technical Requirements Specification (TRS)
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/01.5-trs/`  
**Key Artifacts**:
- [ ] `technical-requirements-specification.md` - Technical constraints, performance requirements, integration requirements
- [ ] `frs-to-trs-traceability.md` - Traceability matrix linking FRS to TRS
- [ ] Tool validation and quality gate definitions
- [ ] TRS approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 2: Architecture
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/02-architecture/`  
**Key Artifacts**:
- [ ] `architecture.md` - Structures and decisions that satisfy FRS and TRS
- [ ] QA strategy included
- [ ] True North derived from App Description
- [ ] References to TRS technical constraints
- [ ] Architecture approved by designated authority

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 3: Implementation Plan
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/03-implementation-plan/`  
**Key Artifacts**:
- [ ] `implementation-plan.md` - Phased plan, acceptance criteria, evidence plan
- [ ] Dependencies identified and documented
- [ ] Risks and mitigation strategies documented

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 4: Builder Appointment
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/04-builder-appointment/`  
**Key Artifacts**:
- [ ] `builder-contract.md` - Explicit builder agent contract
- [ ] Responsibilities, constraints, and deliverables defined
- [ ] Builder appointed by FM

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 5: Build Execution & Evidence
**Status**: [ ] NOT_STARTED | [ ] IN_PROGRESS | [ ] COMPLETE  
**Location**: `modules/[module-slug]/05-build-evidence/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

**Completion Date**: [YYYY-MM-DD or N/A]  
**Notes**: [Any relevant notes about this stage]

---

### Stage 5.1: Critical Deliverable Validation (Wave Closure Gate)

**Authority**: `governance/canon/WAVES_5_TO_7_INFRA_FE_WIRING_LESSONS.md`, `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md`

**Purpose**: Verify physical existence, deployment, and integration of all deliverables before wave closure.

#### Frontend Application Deliverables (if UI required)
- [ ] Frontend application scaffolded at documented path (e.g., `apps/[module]-frontend/`)
- [ ] Frontend builds without errors (`npm run build` or equivalent)
- [ ] Frontend launches successfully (development mode)
- [ ] Frontend deployed to staging/production environment
- [ ] Frontend deployment URL documented and accessible
- [ ] UI component library integrated (e.g., Tailwind, Shadcn/UI)
- [ ] Routing configured and functional
- [ ] PWA manifest and service worker (if required)
- [ ] Responsive design validated (mobile, tablet, desktop)
- [ ] Frontend health check endpoint verified (if applicable)

#### Backend Application Deliverables (if API required)
- [ ] Backend API implemented at documented path
- [ ] Backend builds without errors
- [ ] Backend launches successfully (development mode)
- [ ] Backend deployed to staging/production environment
- [ ] Backend deployment URL documented and accessible
- [ ] API endpoints documented (OpenAPI/Swagger if applicable)
- [ ] Backend health check endpoint returns 200 OK
- [ ] Environment variables documented in `.env.example`
- [ ] Database migrations executed successfully
- [ ] Authentication/authorization configured

#### Infrastructure Deployment Evidence (if applicable)
- [ ] Database provisioned and schema deployed
- [ ] Database connection verified from backend
- [ ] Seed data loaded (if required)
- [ ] Storage buckets/services provisioned (if required)
- [ ] Cloud resources documented with IDs/URLs
- [ ] Infrastructure configuration files committed (e.g., `vercel.json`, `Dockerfile`)
- [ ] Deployment platform accounts configured
- [ ] Environment variables set in deployment platform
- [ ] SSL/TLS certificates configured (if required)
- [ ] Domain/subdomain configured (if required)

#### UI-to-Backend Wiring Validation (if both UI and backend exist)
- [ ] Frontend can successfully call backend API
- [ ] API client configured with correct base URL
- [ ] CORS configured and tested
- [ ] Authentication flow works end-to-end
- [ ] At least ONE complete user workflow demonstrated
- [ ] Error handling implemented (API errors displayed in UI)
- [ ] Loading states implemented in UI
- [ ] Data persistence verified (data flows from UI → API → Database → UI)

#### Data Model to Physical Schema Mapping
- [ ] All entities in data model have corresponding database tables
- [ ] Database schema matches architecture specifications
- [ ] Relationships (foreign keys) implemented
- [ ] Indexes created per performance requirements
- [ ] RLS policies deployed (if using Supabase/Postgres RLS)
- [ ] Database constraints enforced
- [ ] Migration scripts version-controlled
- [ ] Schema documentation up-to-date

#### API to Deployed Endpoint Validation
- [ ] All API routes from architecture are implemented
- [ ] API routes accessible at documented endpoints
- [ ] API authentication/authorization works
- [ ] API error responses follow documented format
- [ ] API rate limiting configured (if required)
- [ ] API versioning implemented (if required)
- [ ] API monitoring/logging configured

#### End-to-End Integration Test Validation
- [ ] E2E tests written for critical user workflows
- [ ] E2E tests executed against DEPLOYED environment (not just localhost)
- [ ] E2E tests passing (100% GREEN)
- [ ] E2E test results documented in evidence
- [ ] Integration tests cover UI-API-Database data flow
- [ ] Error scenario tests passing
- [ ] Performance tests passing (if required)

#### Evidence of Functional Live Deployment
- [ ] Screenshots/video of working application
- [ ] Deployment URLs documented (frontend, backend, database)
- [ ] User workflow demonstration recorded
- [ ] Test execution logs from deployed environment
- [ ] Database verification (data persisted correctly)
- [ ] Performance metrics captured (load times, response times)
- [ ] No critical errors in production logs
- [ ] Accessibility validation passed (if required)

#### Prohibition - Wave Closure WITHOUT:
**Authority**: `governance/canon/WAVES_5_TO_7_INFRA_FE_WIRING_LESSONS.md` Section 5.2

Wave closure is **PROHIBITED** without:
- ❌ Frontend deployment (if UI specified in architecture)
- ❌ Backend deployment (if API specified in architecture)
- ❌ Database deployment (if data persistence required)
- ❌ Working E2E workflow demonstration
- ❌ UI wiring tests (if both UI and backend exist)
- ❌ Deployment URL documentation
- ❌ Evidence bundle (screenshots, videos, logs)

**Critical Rule**: **"Tested" ≠ "Deployed" ≠ "Working"**. All three MUST be verified before wave closure.

**Completion Date**: [YYYY-MM-DD or N/A]  
**Wave Closure Certified By**: [Foreman Name]  
**Evidence Location**: [Path to evidence bundle]

---

## Current Stage Summary

**Current Stage**: [Stage Number and Name]  
**Overall Progress**: [X]% complete  
**Blockers**: [List any blockers or dependencies]  
**Next Steps**: [What needs to happen next]

---

## Governance Compliance

- [ ] All stages proceeding in order (no skipped stages)
- [ ] Traceability maintained (App Description → FRS → TRS → Architecture)
- [ ] All required approvals obtained
- [ ] Evidence artifacts created for each stage
- [ ] Module manifest up to date

---

## Notes and Observations

[Any additional notes, lessons learned, or observations about this module's progress through the lifecycle]

---

**Template Version**: 2.0.0 (includes Wave 5-7 lessons: infra deployment, UI wiring, E2E validation)  
**Template Authority**: MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md, WAVES_5_TO_7_INFRA_FE_WIRING_LESSONS.md  
**Last Template Update**: 2026-02-18
