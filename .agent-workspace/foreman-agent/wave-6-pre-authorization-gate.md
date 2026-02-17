# Wave 6 Pre-Wave Authorization Gate

**Foreman**: foreman-agent  
**Wave**: 6 — Deployment & Commissioning  
**Module**: MAT (Manual Audit Tool)  
**Date**: 2026-02-17  
**Status**: BLOCKED (See Section 6)

---

## 1. Architecture Review

### 1.1 Architecture Documents Frozen and Complete

✅ **Deployment Architecture** (`modules/mat/02-architecture/deployment-architecture.md` v1.0.0):
- Section 3.1: Frontend deployment target (Vercel, Node.js 20 LTS)
- Section 3.2: Backend deployment (Supabase Cloud, managed PostgreSQL 15+)
- Section 3.4: CI/CD pipeline (GitHub Actions)
- Section 4.1: Frontend entry point (`apps/mat-frontend/src/main.tsx`)
- Section 5.1: Environment variables defined (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL)

✅ **Implementation Plan** (`modules/mat/03-implementation-plan/implementation-plan.md` v1.4.0):
- Section 2.7: Wave 6 tasks defined (6.1, 6.2, 6.3, 6.4)
- Sequential execution required (6.1 → 6.2 → 6.3 → 6.4)
- Builder assignments clear (api-builder for 6.1-6.3, qa-builder for 6.4)
- Acceptance criteria documented for each task
- Escalation rules defined

✅ **Test Strategy** (`modules/mat/02-architecture/test-strategy.md`):
- CWT (Combined Wave Test) defined
- 98 MAT tests in TEST_REGISTRY (MAT-T-0001 through MAT-T-0098)
- End-to-end validation required on production
- Security and performance validation required

### 1.2 Requirements Mapping

**Task 6.1: Vercel Project Provisioning & Configuration**
- Architecture Refs: deployment-architecture.md §3.1, §3.4
- FRS Refs: FR-070 (React app deployment), FR-071 (PWA support)
- TRS Refs: TR-001 (React 18+, Vite 5+), TR-006 (TypeScript strict)
- Acceptance Criteria: 4 criteria defined (Vercel project, vercel.json, env vars, CI/CD)

**Task 6.2: Staging Deployment & Health Validation**
- Architecture Refs: deployment-architecture.md §3.1-§3.5, system-architecture.md §3.2
- Dependencies: Task 6.1 complete
- Acceptance Criteria: 5 criteria defined (staging URL, health check, env vars, DB migrations, smoke tests)

**Task 6.3: Production Deployment**
- Architecture Refs: deployment-architecture.md §3.1
- Dependencies: Task 6.2 complete
- Acceptance Criteria: 5 criteria defined (production URL, env vars, DB migrations, no test artifacts, CI/CD archive)

**Task 6.4: CWT on Production & Formal Sign-Over**
- Architecture Refs: test-strategy.md, COMBINED_TESTING_PATTERN.md
- Test Registry: MAT-T-0001 through MAT-T-0098 (98 tests total)
- Dependencies: Task 6.3 complete
- Acceptance Criteria: 6 criteria defined (100% test pass, E2E validation, security, performance, sign-over, evidence)

### 1.3 Architecture Completeness Check

✅ **All requirements documented**: FR-070, FR-071, TR-001, TR-006, TR-071  
✅ **All design decisions recorded**: Vercel platform, React 18+, Vite 5+, TypeScript strict  
✅ **Edge cases identified**: No test artifacts in production, zero-downtime deployment, rollback strategy  
✅ **Acceptance criteria clear**: 20 total criteria across 4 tasks (4 + 5 + 5 + 6)  
✅ **Dependencies mapped**: Sequential execution (6.1 → 6.2 → 6.3 → 6.4)

---

## 2. QA-to-Red Validation Strategy

### 2.1 Deployment Validation Tests (QA-to-Red for Wave 6)

Wave 6 is unique: it's not feature development (which has QA-to-Red unit tests), but deployment and commissioning. The QA-to-Red equivalent is **deployment validation checklists** and **health checks** that must pass before proceeding.

**Task 6.1 Validation** (Vercel Provisioning):
- [ ] Vercel project exists and is linked to repository
- [ ] vercel.json exists and matches deployment-architecture.md §3.1
- [ ] .vercelignore excludes non-deployment files
- [ ] VITE_SUPABASE_URL environment variable set
- [ ] VITE_SUPABASE_ANON_KEY environment variable set
- [ ] VITE_API_BASE_URL environment variable set
- [ ] GitHub Actions workflow exists for Vercel deployment
- [ ] Workflow triggers on merge to main

**Task 6.2 Validation** (Staging Deployment):
- [ ] Staging deployment accessible at preview URL
- [ ] GET /health returns 200 (or index.html if SPA)
- [ ] Application renders in browser (visual smoke test)
- [ ] Supabase connection functional (auth, storage, realtime)
- [ ] Critical user flows navigable (audit, criteria, evidence, dashboard)
- [ ] No console errors in browser DevTools
- [ ] TypeScript compilation successful (dist/ folder built)

**Task 6.3 Validation** (Production Deployment):
- [ ] Production deployment accessible at production URL
- [ ] Application renders in browser (visual smoke test)
- [ ] All environment variables present and correct
- [ ] Database migrations applied (schema matches data-architecture.md)
- [ ] No test-only artifacts (no seed data, no test users)
- [ ] CI/CD artifacts archived (workflow logs, deployment logs)

**Task 6.4 Validation** (CWT on Production):
- [ ] All 98 MAT tests executed on production environment
- [ ] 100% test pass rate (zero failures, zero skipped)
- [ ] End-to-end user flows validated (audit creation, criteria upload, evidence capture, scoring, dashboard)
- [ ] Security validated (RLS cross-org isolation, auth flows, MFA)
- [ ] Performance validated (response times, load handling per performance-architecture.md)
- [ ] Formal sign-over completed by governance agent or product owner
- [ ] Closure evidence documented in BUILD_PROGRESS_TRACKER.md

### 2.2 Combined Wave Test (CWT) Test Suite

**Authority**: governance/canon/COMBINED_TESTING_PATTERN.md v1.0.0

**Test Registry**: governance/TEST_REGISTRY.json

**MAT Test Coverage** (98 tests total):
- MAT-T-0001 to MAT-T-0006: Audit lifecycle tests (6 tests)
- MAT-T-0007 to MAT-T-0014: Criteria management tests (8 tests)
- MAT-T-0015 to MAT-T-0025: Evidence collection tests (11 tests)
- MAT-T-0026 to MAT-T-0039: AI scoring tests (14 tests)
- MAT-T-0042 to MAT-T-0050: Security/RLS tests (9 tests)
- MAT-T-0051 to MAT-T-0055: Offline sync tests (5 tests)
- MAT-T-0056 to MAT-T-0058: Evidence offline sync tests (3 tests)
- MAT-T-0059 to MAT-T-0062: Watchdog tests (4 tests)
- MAT-T-0063 to MAT-T-0066: Integration tests (4 tests)
- MAT-T-0067 to MAT-T-0068: Performance tests (2 tests)
- MAT-T-0069 to MAT-T-0081: Dashboard/reporting tests (13 tests)
- MAT-T-0082: Data privacy compliance test (1 test)
- MAT-T-0083 to MAT-T-0098: Wiring invariants (16 tests)

**CWT Execution Approach**:
1. Run all existing MAT tests from modules/mat/tests/ against production environment
2. Execute end-to-end user flows manually (audit creation → criteria → evidence → scoring → dashboard)
3. Validate security (RLS cross-org isolation, auth flows, MFA)
4. Validate performance (response times, load handling)
5. Document all results in PREHANDOVER_PROOF.md

---

## 3. Builder Task Assignments

### 3.1 Task 6.1: Vercel Project Provisioning & Configuration

**Builder**: api-builder  
**Scope**: Create Vercel project, configure vercel.json, set environment variables, configure CI/CD  
**Allowed Paths**:
- Create: `vercel.json` (repository root)
- Create: `.vercelignore` (repository root)
- Create: `.github/workflows/deploy-mat-vercel.yml` (CI/CD workflow)
- Modify: `apps/mat-frontend/package.json` (if deployment scripts needed)
- Read: `apps/mat-frontend/.env.example` (source of truth for env vars)
- Read: `modules/mat/02-architecture/deployment-architecture.md`

**Prohibited Paths**:
- ❌ modules/mat/src/** (component implementations)
- ❌ modules/mat/tests/** (existing tests)
- ❌ governance/** (canonical documents)
- ❌ .github/agents/foreman-agent.md (Foreman contract)

**Escalation Boundaries**:
- Vercel credentials unavailable → escalate to CS2
- Environment variable values unknown → escalate to Foreman/CS2
- Architecture ambiguities → escalate to Foreman

### 3.2 Task 6.2: Staging Deployment & Health Validation

**Builder**: api-builder  
**Scope**: Deploy to Vercel staging, validate health, smoke test critical flows  
**Allowed Paths**:
- Read: Vercel staging URL (deployed application)
- Execute: Manual smoke testing (browser-based)
- Document: Staging validation results in PREHANDOVER_PROOF.md

**Prohibited Paths**:
- ❌ Production environment (not yet validated)
- ❌ Database modifications (read-only validation)

**Escalation Boundaries**:
- Staging deployment fails → RCA, fix, escalate if blocked
- Health check fails → RCA, fix, escalate if blocked
- Critical flows broken → RCA, escalate to Foreman

### 3.3 Task 6.3: Production Deployment

**Builder**: api-builder  
**Scope**: Deploy to Vercel production, validate health, verify no test artifacts  
**Allowed Paths**:
- Read: Vercel production URL (deployed application)
- Execute: Manual production validation (browser-based)
- Document: Production deployment results in PREHANDOVER_PROOF.md

**Prohibited Paths**:
- ❌ Database seed data insertion (production must be clean)
- ❌ Test-only code deployment (production must be production-ready)

**Escalation Boundaries**:
- Production deployment fails → HALT, RCA, escalate to CS2
- Production health check fails → HALT, RCA, escalate to CS2
- Test artifacts present → HALT, clean, re-deploy, escalate if blocked

### 3.4 Task 6.4: CWT on Production & Formal Sign-Over

**Builder**: qa-builder  
**Scope**: Execute all 98 MAT tests on production, validate E2E flows, issue sign-over  
**Allowed Paths**:
- Execute: modules/mat/tests/** (all test suites)
- Execute: End-to-end user flows on production URL
- Document: CWT results in PREHANDOVER_PROOF.md
- Create: Formal sign-over certificate

**Prohibited Paths**:
- ❌ Production code modifications (read-only validation)
- ❌ Database modifications (read-only validation)

**Escalation Boundaries**:
- Any test fails → HALT, RCA, escalate to Foreman
- Security issues discovered → HALT, escalate to CS2
- Performance issues discovered → HALT, escalate to Foreman/CS2

---

## 4. Evidence Requirements

### 4.1 Session Memory Files

**Required**:
- `.agent-workspace/api-builder/memory/session-task-6.1-20260217.md` (Task 6.1)
- `.agent-workspace/api-builder/memory/session-task-6.2-20260217.md` (Task 6.2)
- `.agent-workspace/api-builder/memory/session-task-6.3-20260217.md` (Task 6.3)
- `.agent-workspace/qa-builder/memory/session-task-6.4-20260217.md` (Task 6.4)
- `.agent-workspace/foreman-agent/memory/session-wave-6-20260217.md` (Foreman supervision)

### 4.2 PREHANDOVER_PROOF

**Required Sections**:
1. Deployment Configuration Evidence (vercel.json, env vars, CI/CD workflow)
2. Staging Validation Results (health check, smoke tests)
3. Production Validation Results (health check, E2E flows)
4. CWT Test Results (all 98 tests, 100% GREEN)
5. Security Validation Results (RLS, auth, MFA)
6. Performance Validation Results (response times, load handling)
7. Formal Sign-Over Certificate (governance agent or product owner signature)

### 4.3 Wave Closure Certification

**Foreman will issue Wave Closure Certification after all criteria validated**:

1. **Deliverable Completeness**: All 4 tasks complete (6.1, 6.2, 6.3, 6.4)
2. **Functional Completeness**: Production deployment live and functional
3. **Quality Completeness**: All 98 tests GREEN, zero failures, zero skipped
4. **Fully Functional Delivery**: End-to-end flows validated on production
5. **Zero Major Rework**: No regressions, no architectural changes, no scope creep

---

## 5. Risk Assessment & Mitigation

### 5.1 High-Risk Areas

**Risk 1: Vercel Credentials Unavailable**
- **Probability**: HIGH (agent environment may not have Vercel access)
- **Impact**: BLOCKER (cannot provision Vercel project)
- **Mitigation**: Escalate to CS2 for Vercel credentials or manual provisioning
- **Detection**: Immediate (Task 6.1 start)

**Risk 2: Environment Variable Values Unknown**
- **Probability**: MEDIUM (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY may not be known)
- **Impact**: BLOCKER (cannot deploy without env vars)
- **Mitigation**: Escalate to CS2 for Supabase credentials
- **Detection**: Task 6.1 (environment variable configuration)

**Risk 3: Production Deployment Fails**
- **Probability**: LOW-MEDIUM (deployment architecture well-defined)
- **Impact**: HIGH (Wave 6 blocked)
- **Mitigation**: RCA, rollback, fix, re-deploy
- **Detection**: Task 6.3 (production deployment)

**Risk 4: CWT Test Failures on Production**
- **Probability**: LOW (all 98 tests passed in previous waves)
- **Impact**: HIGH (Wave 6 blocked until fixed)
- **Mitigation**: RCA, fix, re-deploy, re-test
- **Detection**: Task 6.4 (CWT execution)

**Risk 5: Security Vulnerabilities Discovered**
- **Probability**: LOW (security validated in previous waves)
- **Impact**: CRITICAL (must fix before sign-over)
- **Mitigation**: HALT, RCA, security patch, re-deploy, re-validate
- **Detection**: Task 6.4 (security validation)

### 5.2 Escalation Triggers (HALT Conditions)

**Immediate HALT and escalate to CS2**:
- ❌ Vercel credentials unavailable
- ❌ Supabase credentials unavailable (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- ❌ Production deployment fails
- ❌ CWT <100% GREEN on production
- ❌ Security vulnerabilities discovered
- ❌ Architecture ambiguities prevent implementation
- ❌ Scope creep or scope expansion requests

---

## 6. Pre-Wave Authorization Gate Decision

### 6.1 Gate Criteria Assessment

✅ **Architecture Frozen**: deployment-architecture.md v1.0.0, implementation-plan.md v1.4.0  
✅ **Requirements Complete**: FR-070, FR-071, TR-001, TR-006, TR-071 all documented  
✅ **Acceptance Criteria Clear**: 20 criteria defined across 4 tasks  
✅ **Dependencies Validated**: Wave 5.5 complete (certified 2026-02-17)  
✅ **Builder Agents Available**: api-builder, qa-builder agents present  
✅ **QA Strategy Defined**: Deployment validation checklists + CWT (98 tests)  
✅ **Escalation Boundaries Documented**: Vercel credentials, env vars, production access  
❌ **Vercel Credentials Available**: UNKNOWN (high-risk blocker)  
❌ **Supabase Credentials Available**: UNKNOWN (high-risk blocker)

### 6.2 Gate Decision

**Status**: ⚠️ **CONDITIONAL APPROVAL WITH ESCALATION REQUIREMENT**

**Rationale**:
- Architecture is complete and frozen ✅
- QA strategy is comprehensive ✅
- Builder assignments are clear ✅
- Evidence requirements are documented ✅
- **BUT**: Vercel and Supabase credentials are required to proceed, and their availability is unknown

**Escalation Required**:
Before proceeding with Task 6.1, Foreman **MUST** escalate to CS2 to confirm:
1. Vercel account credentials or access method for api-builder
2. Supabase project URL (VITE_SUPABASE_URL value)
3. Supabase anonymous key (VITE_SUPABASE_ANON_KEY value)
4. Approval to proceed with production deployment

**Approved Scope**:
- ✅ api-builder may proceed with Task 6.1 (Vercel provisioning) **AFTER** credentials confirmed
- ✅ api-builder may proceed with Task 6.2 (staging deployment) **AFTER** Task 6.1 complete
- ✅ api-builder may proceed with Task 6.3 (production deployment) **AFTER** Task 6.2 complete
- ✅ qa-builder may proceed with Task 6.4 (CWT & sign-over) **AFTER** Task 6.3 complete

**Prohibitions**:
- ❌ No code modifications to modules/mat/src/** or modules/mat/tests/**
- ❌ No governance document modifications
- ❌ No Foreman contract modifications (.github/agents/foreman-agent.md)
- ❌ No partial delivery (all 4 tasks must complete)
- ❌ No test debt accumulation (100% GREEN required)

---

## 7. Next Steps

### 7.1 Immediate Actions (Foreman)

1. **ESCALATE TO CS2**: Request Vercel and Supabase credentials
2. **CREATE ESCALATION DOCUMENT**: Document credential requirements in `.agent-workspace/foreman-agent/escalation-inbox/wave-6-credentials-20260217.md`
3. **WAIT FOR CS2 APPROVAL**: Do not proceed until credentials confirmed
4. **RECRUIT API-BUILDER**: Once approved, recruit api-builder for Task 6.1

### 7.2 Pending Actions (After Credential Approval)

1. Recruit api-builder for Task 6.1 (Vercel provisioning)
2. Monitor api-builder execution (Task 6.1)
3. Validate Task 6.1 deliverables (vercel.json, env vars, CI/CD)
4. Recruit api-builder for Task 6.2 (staging deployment)
5. Monitor api-builder execution (Task 6.2)
6. Validate Task 6.2 deliverables (staging health, smoke tests)
7. Recruit api-builder for Task 6.3 (production deployment)
8. Monitor api-builder execution (Task 6.3)
9. Validate Task 6.3 deliverables (production health, no test artifacts)
10. Recruit qa-builder for Task 6.4 (CWT & sign-over)
11. Monitor qa-builder execution (Task 6.4)
12. Validate Task 6.4 deliverables (100% test pass, formal sign-over)
13. Execute Wave Completion Gate (POLC Checking phase)
14. Issue Wave Closure Certification (5 mandatory criteria)
15. Create session memory and PREHANDOVER_PROOF
16. Update BUILD_PROGRESS_TRACKER.md

---

## 8. Governance Compliance

**Constitutional Requirements**:
- ✅ Foreman supervises (POLC), builders implement (verified)
- ✅ Zero Test Debt enforced (100% GREEN required)
- ✅ Pre-Wave Authorization Gate executed (this document)
- ✅ Architecture frozen before implementation (deployment-architecture.md v1.0.0)
- ✅ QA-to-Red strategy defined (deployment validation checklists + CWT)
- ✅ Escalation boundaries documented (Vercel credentials, Supabase credentials)

**POLC Model**:
- ✅ **PLANNING**: Pre-Wave Authorization Gate executed (this document)
- ⏳ **ORGANIZING**: Pending (builder recruitment after credential approval)
- ⏳ **LEADING**: Pending (builder supervision during execution)
- ⏳ **CHECKING**: Pending (Wave Completion Gate after all tasks complete)

---

**Authority**: FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md v1.0.0, FULLY_FUNCTIONAL_DELIVERY_STANDARD.md v1.0.0  
**Created**: 2026-02-17  
**Status**: CONDITIONAL APPROVAL (escalation required)  
**Next Action**: Escalate to CS2 for Vercel and Supabase credentials
