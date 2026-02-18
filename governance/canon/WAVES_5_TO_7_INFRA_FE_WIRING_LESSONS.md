# WAVES 5-7 INFRASTRUCTURE, FRONTEND & WIRING LESSONS

## Status
**Type**: Tier-1 Canonical Governance Learning  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-18  
**Owner**: Governance Repository Administrator  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Foreman Instances, All Builders, All Wave Executions, All Architecture Documents

---

## 1. Purpose

This canon documents critical lessons learned from MAT (Maturion Asset Tracker) Waves 5-7 regarding recurring failures to deliver complete, working, deployed infrastructure components despite clear requirements and architectural specifications.

**Critical Pattern Identified**: Architecture and requirements explicitly specified frontend applications, backend deployments, and UI-to-API wiring, but wave closures occurred without these deliverables being:
1. Implemented at all
2. Deployed to target platforms
3. Wired together and tested end-to-end
4. Demonstrated as working systems

**Governance Gap**: Existing wave closure gates validated test pass rates but NOT existence of deployable, working applications.

This canon exists to:
- **Document the failure pattern** across Waves 5-7
- **Institutionalize prevention measures** into templates, checklists, and gates
- **Enforce deliverable verification** before wave closure
- **Prevent recurrence** through structural governance changes

**Constitutional Integration**: This canon operationalizes:
- **BUILD_PHILOSOPHY.md** - One-Time Build Law (systems must work at first build)
- **FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** - Deliverables must physically exist and work
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** - Structural governance prevents repeat failures

---

## 2. Cross-Wave Failure Pattern Analysis

### 2.1 Wave 5.5 — Missing React App Scaffolding & Wiring

**Deviation Reference**: Internal deviation tracking (referenced in issue description)

**What Was Required** (per Architecture & FRS):
- React application scaffolded and launchable
- UI component library integrated
- API client configured for backend calls
- Development and production build configurations
- Deployment to Vercel/target platform

**What Was Delivered**:
- ❌ No React app scaffolded
- ❌ No UI component library integrated
- ❌ No API client implementation
- ❌ No deployment configuration
- ✅ Backend tests passing (but disconnected from nonexistent frontend)

**Impact**:
- Wave closed as "complete" based on backend tests
- Frontend implementation required complete rebuild
- Violated One-Time Build Law
- User workflows unusable (no UI exists)

**Root Cause**:
- Wave closure gate validated test pass rate only
- No verification of deliverable physical existence
- No requirement for working deployment demonstration
- Architecture completeness not enforced at closure

---

### 2.2 Wave 5.6 — Missing UI Wiring & Integration Tests

**Deviation Reference**: Internal deviation tracking (referenced in issue description)

**What Was Required** (per Architecture & TRS):
- UI-to-API integration wiring
- E2E tests covering user workflows
- Component integration tests
- API error handling in UI
- CORS configuration and testing

**What Was Delivered**:
- ❌ No UI-to-API wiring implemented
- ❌ No E2E tests written or executed
- ❌ No integration tests for API client
- ❌ CORS not configured
- ✅ Unit tests passing (but isolated, no integration)

**Impact**:
- Frontend and backend exist but disconnected
- No verification that systems work together
- Post-closure rework required to wire systems
- Production deployment blocked

**Root Cause**:
- Wiring and integration treated as "optional polish"
- E2E tests not enforced as mandatory
- Wave closure allowed without integration verification
- "Components work in isolation" accepted as "complete"

---

### 2.3 Wave 5.7 — Missing Backend (Supabase) Deployment

**Deviation Reference**: Issue #13 (APGI-cmy/maturion-foreman-governance)

**What Was Required** (per Architecture):
- Supabase project provisioned
- Database schema deployed
- Database seeded with test data
- API deployed to production
- API accessible from frontend

**What Was Delivered**:
- ❌ Supabase project not provisioned
- ❌ Database schema not deployed
- ❌ No database seeding
- ❌ API not deployed to production
- ✅ API code exists (but only in local development)

**Impact**:
- "Complete" wave had no production backend
- Frontend (if it existed) had no backend to call
- Production deployment impossible
- Complete infrastructure setup required post-closure

**Root Cause**:
- Deployment treated as separate concern from "code complete"
- No verification of infrastructure provisioning
- No requirement for accessible deployment URLs
- "Code exists and tests pass" conflated with "system deployed"

---

## 3. Common Failure Patterns Across Waves 5-7

### 3.1 Missing Deliverable Detection Failure

**Pattern**: Wave closure gates validated test pass rates but NOT deliverable existence.

**Consequence**: Waves closed with critical components missing:
- Frontend applications not scaffolded
- Backend services not deployed
- Integration wiring not implemented
- Infrastructure not provisioned

**Systemic Issue**: No automated or manual check asking "Does X physically exist and work?"

---

### 3.2 "Tests Pass" ≠ "System Works" Conflation

**Pattern**: 100% GREEN test results accepted as proof of completeness, even when:
- Tests only covered backend logic (no frontend)
- Tests were unit tests (no integration)
- Tests ran in local environment (no deployment verification)
- Tests mocked external dependencies (no real infrastructure)

**Consequence**: High test coverage provided false confidence in completeness.

**Systemic Issue**: Test-centric validation without deliverable-centric validation.

---

### 3.3 Deployment Deferred to "Later"

**Pattern**: Code implementation treated as wave scope, deployment treated as separate "DevOps" concern.

**Consequence**:
- Code exists but not deployed
- No verification of deployment feasibility
- Production blockers discovered post-closure
- Infrastructure setup became separate project

**Systemic Issue**: "Build" and "Deploy" artificially separated; One-Time Build Law not enforced end-to-end.

---

### 3.4 Architecture Completeness Not Enforced

**Pattern**: Architecture documents specified frontend, backend, wiring, and deployment, but implementation plans did not enforce delivery of all components.

**Consequence**:
- Partial implementation accepted as complete
- Missing components not flagged as blockers
- Architecture-to-implementation traceability broken

**Systemic Issue**: No validation that implementation plan deliverables matched architecture requirements.

---

## 4. Prevention Measures Institutionalized

### 4.1 Architecture Template Updates

**File**: `governance/templates/minimum-architecture-template.md`

**Updates Made**:

#### 4.1.1 Section 4.1.1 — Infrastructure Deployment Validation
- Added **Pre-Wave Validation Checklist** requiring:
  - Frontend infrastructure configured
  - Backend infrastructure configured
  - Database provisioned
  - Deployment tested before wave start
- Added **Post-Deployment Validation** requirements
- Added **Evidence Requirements for Wave Closure**
- Added **Prohibited Patterns** list

#### 4.1.2 Section 4.11.1 — Frontend-Backend Wiring
- Added **Frontend Application Scaffolding** checklist
- Added **UI → API Integration Wiring** validation points
- Added **Backend Deployment Configuration** requirements
- Added **UI Wiring Tests** as MANDATORY
- Added **Deployment Evidence Requirements**

#### 4.1.3 Section 4.12.1 — Mandatory Workflow Evidence
- Added requirement for working frontend URL
- Added requirement for working backend API URL
- Added requirement for integrated data flow demonstration
- Added E2E test coverage requirement
- Added evidence artifact structure template
- Added **Critical Rule**: Architecture approval requires live demonstration

---

### 4.2 Build Progress Tracker Updates

**File**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`

**Updates Made**:

#### Section 5.1 — Critical Deliverable Validation
- Added **Frontend Application Deliverables** checklist
- Added **Backend Application Deliverables** checklist
- Added **UI-to-Backend Wiring Validation** checklist
- Added **Infrastructure Deployment Evidence** requirements
- Added **Prohibition - Wave Closure WITHOUT** list

**Key Addition**: Explicit prohibition against wave closure without:
- Frontend deployment (if UI specified)
- Backend deployment (if API specified)
- Database deployment (if data persistence required)
- Working E2E workflow demonstration
- UI wiring tests (if both UI and backend exist)

---

### 4.3 FULLY_FUNCTIONAL_DELIVERY_STANDARD.md Integration

**File**: `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md`

**Existing Standard Strengthened By**:
- Waves 5-7 lessons validate standard's necessity
- Provides concrete historical examples of standard violations
- Demonstrates consequences of non-enforcement
- Reinforces Section 3.2 "Fully Functional App" definition
- Reinforces Section 4.2 "Wave Completion Gate" requirements

**Cross-Reference Added**: This lessons canon MUST be read alongside FULLY_FUNCTIONAL_DELIVERY_STANDARD.md

---

### 4.4 Post-Mortem Template Updates

**File**: `governance/templates/POST_MORTEM_GAP_ANALYSIS.template.md`

**Updates Recommended** (to be implemented separately):
- Add section: "Infrastructure Deployment Validation"
- Add section: "Frontend/Backend Wiring Verification"
- Add section: "Deliverable Physical Existence Check"
- Add checklist: "Artifact Existence Validation"

---

## 5. Enforcement Mechanisms

### 5.1 Pre-Wave Authorization Gate (Foreman)

**Gate Owner**: Foreman (FM)

**Required Validations BEFORE wave authorization**:

1. **Architecture Review**:
   - [ ] Architecture specifies deployment targets
   - [ ] Infrastructure requirements documented
   - [ ] Frontend scaffolding approach defined (if UI required)
   - [ ] Backend deployment platform specified (if API required)
   - [ ] Wiring architecture complete (if both UI and backend)

2. **Implementation Plan Review**:
   - [ ] Deliverables list includes frontend app (if required)
   - [ ] Deliverables list includes backend deployment (if required)
   - [ ] Deliverables list includes E2E tests (if required)
   - [ ] Deliverables list includes deployment configurations
   - [ ] Acceptance criteria include "working deployment"

3. **Infrastructure Readiness**:
   - [ ] Deployment platform accounts created
   - [ ] Database instances provisioned (if required)
   - [ ] Environment variables documented
   - [ ] Deployment configuration files exist

**Gate Failure Response**:
- BLOCK wave authorization
- Document missing requirements
- Update architecture or implementation plan
- Re-validate before authorization

---

### 5.2 Wave Closure Gate (Foreman) — CRITICAL UPDATES

**Gate Owner**: Foreman (FM) - non-delegable

**Required Validations BEFORE wave closure** (NEW):

1. **Physical Deliverable Verification**:
   - [ ] ALL deliverables from implementation plan physically exist in codebase
   - [ ] If frontend required: Frontend app exists at documented path
   - [ ] If backend required: Backend API exists at documented path
   - [ ] If database required: Database schema files exist
   - [ ] All deliverables buildable without errors

2. **Deployment Verification** (NEW - Waves 5-7 Lesson):
   - [ ] Frontend deployed to staging/production (if required)
   - [ ] Backend deployed to staging/production (if required)
   - [ ] Database schema deployed (if required)
   - [ ] Deployment URLs documented and accessible
   - [ ] Health check endpoints return 200 OK

3. **Integration Wiring Verification** (NEW - Waves 5-7 Lesson):
   - [ ] Frontend can call backend API (if both exist)
   - [ ] Backend can connect to database (if both exist)
   - [ ] CORS configured and tested
   - [ ] Authentication flow works
   - [ ] At least ONE complete workflow demonstrated

4. **E2E Test Verification** (NEW - Waves 5-7 Lesson):
   - [ ] E2E tests written for critical workflows
   - [ ] E2E tests executed and PASSING
   - [ ] E2E tests run against deployed environment (not just localhost)
   - [ ] Test results documented in evidence

5. **Evidence Artifact Collection** (NEW - Waves 5-7 Lesson):
   - [ ] Frontend deployment URL documented
   - [ ] Backend deployment URL documented
   - [ ] Screenshots/video of working workflows
   - [ ] E2E test execution logs
   - [ ] Database verification (data persisted)

**Prohibited Responses** (Updated):
- ❌ "Tests pass, wave complete" (if deployments missing)
- ❌ "Backend works locally, will deploy later"
- ❌ "Frontend scaffolded, wiring can be added later"
- ❌ "Code exists, deployment is separate concern"
- ❌ Closing wave with TODO items for infrastructure

**Critical Rule Enhanced**: **"Tested" ≠ "Deployed" ≠ "Working"**. All three MUST be verified.

---

### 5.3 Automated Gate Checks (CI/CD)

**Implementation**: Merge Gate Interface workflow additions

**Required Automated Checks** (to be implemented):

1. **Deliverable Existence Check**:
   - Script verifies all deliverables from implementation plan exist
   - Fails if: Any listed deliverable missing from codebase
   - Evidence: File path verification report

2. **Build Success Check**:
   - Script attempts to build frontend (if exists)
   - Script attempts to build backend (if exists)
   - Fails if: Any build fails
   - Evidence: Build output logs

3. **Deployment Configuration Check**:
   - Script verifies deployment config files exist
   - Script validates environment variable documentation
   - Fails if: Missing or incomplete
   - Evidence: Configuration validation report

4. **E2E Test Execution Check**:
   - Script runs E2E tests against deployed environment
   - Fails if: Any E2E test fails or no E2E tests found
   - Evidence: Test execution results

---

## 6. Learning Integration into Agent Contracts

### 6.1 Foreman Agent Contract Updates

**File**: `.github/agents/foreman-v2.agent.md`

**Required Updates**:

1. **Pre-Wave Authorization Section**:
   - Add infrastructure readiness validation
   - Add frontend scaffolding verification (if UI required)
   - Add backend deployment verification (if API required)
   - Reference this canon as authority

2. **Wave Closure Section**:
   - Add deployment verification protocol
   - Add wiring validation protocol
   - Add E2E test execution requirement
   - Add evidence collection checklist
   - Reference FULLY_FUNCTIONAL_DELIVERY_STANDARD.md

3. **Prohibited Actions**:
   - Add "Closing wave without frontend deployment (if required)"
   - Add "Closing wave without backend deployment (if required)"
   - Add "Accepting local-only verification without deployment"

---

### 6.2 Builder Agent Contract Updates

**Files**: All builder agents (ui-builder, api-builder, etc.)

**Required Updates**:

1. **Deliverable Requirements**:
   - Add explicit requirement for deployment configuration
   - Add explicit requirement for E2E test coverage
   - Add requirement to document deployment URLs

2. **Handover Evidence**:
   - Add deployment URL to handover checklist
   - Add E2E test results to handover evidence
   - Add working workflow demonstration

---

## 7. Success Metrics

This canon is successful when:

- ✅ Zero waves closed without all required deployments
- ✅ Zero waves closed without E2E tests for critical workflows
- ✅ Zero waves closed without working deployment URLs
- ✅ 100% of wave closures include infrastructure deployment verification
- ✅ 100% of wave closures with UI+backend include wiring tests
- ✅ No post-wave "we need to deploy it" rework required

**Failure Indicators** (require governance review):
- ❌ Wave closed but frontend not deployed (if required)
- ❌ Wave closed but backend not deployed (if required)
- ❌ Wave closed but systems not wired together (if both exist)
- ❌ Wave closed without E2E test demonstration
- ❌ "We'll deploy it later" accepted at wave closure

---

## 8. Cross-References and Dependencies

### 8.1 Constitutional Canon Dependencies

| Canon File | Integration Point |
|------------|------------------|
| **BUILD_PHILOSOPHY.md** | One-Time Build Law: deployed = working at first build |
| **FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** | Sections 3.1, 3.2, 3.3, 4.2 directly apply to Waves 5-7 failures |
| **WE_ONLY_FAIL_ONCE_DOCTRINE.md** | Structural governance prevents Waves 5-7 pattern recurrence |
| **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md** | Section 4.1, 4.11, 4.12 strengthened by this canon |

### 8.2 Template Updates Affected

| Template | Sections Updated | Authority |
|----------|-----------------|-----------|
| **minimum-architecture-template.md** | 4.1.1, 4.11.1, 4.12.1 | This canon |
| **BUILD_PROGRESS_TRACKER_TEMPLATE.md** | Stage 5.1 | This canon |
| **POST_MORTEM_GAP_ANALYSIS.template.md** | (Pending) | This canon |

### 8.3 Agent Contracts Affected

| Agent Contract | Updates Required | Status |
|---------------|-----------------|--------|
| **foreman-v2.agent.md** | Pre-wave & closure gates | Pending |
| **ui-builder.md** | Deployment evidence | Pending |
| **api-builder.md** | Deployment evidence | Pending |

---

## 9. Deviation Chain Documentation

This canon institutionalizes lessons from the following deviation chain:

1. **Wave 5.5 Deviation** (Internal Tracking)
   - Issue: Missing React app scaffolding
   - Impact: Frontend not implemented despite architecture
   - Learning: Frontend scaffolding must be verified at wave start and closure

2. **Wave 5.6 Deviation** (Internal Tracking)
   - Issue: Missing UI wiring and integration tests
   - Impact: Frontend and backend disconnected
   - Learning: Wiring tests mandatory when both UI and backend exist

3. **Wave 5.7 Deviation** (Issue #13)
   - Issue: Missing backend (Supabase) deployment
   - Impact: No production backend despite "complete" wave
   - Learning: Deployment verification mandatory at wave closure

**Pattern Recognized**: Recurring failure to deliver complete, deployed, wired systems despite clear requirements.

**Governance Response**: This canon + template updates + gate strengthening.

---

## 10. Enforcement Timeline

**Immediate** (applies to all active and future waves):
- ✅ Architecture template updates (Section 4)
- ✅ Build progress tracker updates (Section 4.2)
- ✅ This canon created and approved

**Short-Term** (within 1 sprint):
- [ ] Foreman agent contract updates (Section 6.1)
- [ ] Builder agent contract updates (Section 6.2)
- [ ] Post-mortem template updates (Section 4.4)
- [ ] Ripple to consumer repositories

**Medium-Term** (within 1 month):
- [ ] Automated gate checks implemented (Section 5.3)
- [ ] CI/CD workflow updates
- [ ] Evidence artifact automation

---

## 11. Lessons Learned Summary

### 11.1 Core Lessons

**Lesson 1: "Exists" Must Be Verified Physically**
- Architecture specifying frontend ≠ frontend exists
- Must verify physical existence at wave closure

**Lesson 2: "Tests Pass" ≠ "System Works"**
- High test coverage can mask missing deliverables
- Must verify deployment, not just test results

**Lesson 3: "Code Complete" ≠ "Deployed"**
- Code existing locally ≠ working in production
- Deployment must be part of wave scope, not deferred

**Lesson 4: Integration Cannot Be Assumed**
- Frontend + Backend ≠ Integrated System
- Wiring tests mandatory when both exist

**Lesson 5: Architecture Completeness Must Be Enforced**
- Architecture defining components ≠ components delivered
- Traceability from architecture to deliverables required

---

### 11.2 Preventive Patterns Established

**Pattern 1: Pre-Wave Infrastructure Validation**
- Verify deployment platforms configured BEFORE wave start
- Verify infrastructure accounts created and accessible

**Pattern 2: Deliverable Physical Verification**
- Check file existence at documented paths
- Attempt to build/run deliverables
- Verify launchability, not just file presence

**Pattern 3: Deployment URL Documentation**
- Require working URLs for frontend and backend
- Access URLs and verify 200 OK responses
- Demonstrate workflows using deployed URLs

**Pattern 4: E2E Test Execution Against Deployed Environment**
- Run E2E tests against staging/production URLs
- Not just localhost
- Verify deployed systems work together

**Pattern 5: Evidence-First Wave Closure**
- Screenshots/video of working workflows required
- Deployment URLs required
- E2E test logs required
- No closure without complete evidence bundle

---

## 12. Governance Hygiene Note

This canon reflects **reactive institutionalization** of lessons learned from failures. The ideal state is **proactive governance** where such failures never occur.

**Improvement Opportunity**: Strengthen architecture approval process to prevent waves from starting without complete deployment and wiring specifications.

**Future State**: Architecture approval should include verification that:
- Deployment platforms are ready
- Integration patterns are defined
- E2E test strategy is documented
- Evidence requirements are clear

This would shift enforcement from wave closure (reactive) to wave authorization (proactive).

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-18 | Governance Repository Administrator | Initial canon creation institutionalizing Waves 5-7 lessons on infrastructure, frontend scaffolding, backend deployment, and UI wiring validation |

---

**END OF WAVES 5-7 LESSONS CANON**

**Authority**: CS2 (Johan Ras) | **Version**: 1.0.0 | **Effective**: 2026-02-18

---

## Appendix A: Quick Reference Checklist for Wave Closure

### Infrastructure Deployment Validation
- [ ] Frontend deployed to staging/production (if required)
- [ ] Backend deployed to staging/production (if required)
- [ ] Database provisioned and schema deployed (if required)
- [ ] Deployment URLs documented and accessible
- [ ] Health check endpoints verified

### Frontend-Backend Wiring Validation
- [ ] Frontend can call backend API (if both exist)
- [ ] Backend can connect to database (if both exist)
- [ ] CORS configured and tested
- [ ] Authentication flow works
- [ ] At least ONE complete workflow demonstrated

### E2E Test Validation
- [ ] E2E tests written for critical workflows
- [ ] E2E tests executed against deployed environment
- [ ] E2E tests PASSING (100% GREEN)
- [ ] Test results documented in evidence

### Evidence Artifact Collection
- [ ] Frontend deployment URL documented
- [ ] Backend deployment URL documented
- [ ] Screenshots/video of working workflows
- [ ] E2E test execution logs
- [ ] Database verification (data persisted)

**Critical Rule**: ALL checkboxes MUST be checked before wave closure approval.
