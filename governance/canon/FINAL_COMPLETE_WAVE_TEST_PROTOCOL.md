# FINAL COMPLETE WAVE TEST (FCWT) PROTOCOL

## Status
**Type**: Tier-1 Canonical Governance Standard  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-17  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Foreman Instances, All Wave Executions, All Application Repositories, All Builders, All QA/Audit Processes

---

## 1. Purpose

This protocol establishes the **Final Complete Wave Test (FCWT)** as the mandatory last build/test step before audit sign-off and production readiness of any MAT application or application module.

The FCWT exists to ensure:
- **Complete functional validation**: All QA-to-Red tests GREEN PLUS comprehensive real-world testing
- **Full workflow verification**: Every user workflow, edge case, and error state validated
- **Production readiness proof**: Application demonstrated working under realistic load and data conditions
- **Formal handover**: Evidence-based contract of application completeness and functional closure
- **Audit compliance**: Complete documentation trail for sign-off and release approval

**Critical Governance Gap Addressed**: Applications were previously marked "complete" based solely on automated test pass rates, without comprehensive functional testing, stress testing, or formal demonstration of working application under realistic conditions.

---

## 2. Constitutional Authority

This protocol derives authority from and integrates with:

- **FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** - Three definitions of "fully functional" (design, app, delivery)
- **WAVE_MODEL.md** - Wave closure and certification requirements
- **BUILD_PHILOSOPHY.md** - One-Time Build Law: delivered means working 100%
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** - Structural governance prevents repeat failures
- **MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md** - Wave closure certification
- **QA_CATALOG_ALIGNMENT_GATE_CANON.md** - QA-to-Red test registry and alignment

---

## 3. FCWT Definition

### 3.1 What FCWT Is

**Final Complete Wave Test (FCWT)** is a comprehensive, evidence-based validation phase that occurs **after all development and QA-to-Red tests are GREEN**, serving as the authoritative final checkpoint before application audit sign-off.

**FCWT combines:**
1. **Automated validation**: Full QA-to-Red test suite execution (100% GREEN required)
2. **Functional validation**: All user workflows tested end-to-end with real data
3. **Stress validation**: Application tested under realistic and adversarial conditions
4. **UX validation**: User experience, accessibility, performance, cross-device testing
5. **Documentation validation**: Complete walkthrough, evidence trail, and handover artifacts
6. **Closure certification**: Formal handover contract against functional completeness definitions

### 3.2 FCWT Authority and Execution

**Who Performs FCWT:**
- **Primary**: UI Builder (for UI-centric applications) OR dedicated QA agent (per FM assignment)
- **Supervision**: Foreman (FM) - non-delegable oversight authority
- **Final Approval**: CS2 (for production release sign-off)

**When FCWT Executes:**
- **Timing**: After ALL waves complete, after ALL QA-to-Red tests GREEN, before audit sign-off
- **Frequency**: Once per application/module before production release
- **Blocking Authority**: Application CANNOT proceed to audit/production without FCWT PASS

### 3.3 FCWT vs. QA-to-Red Testing

| Dimension | QA-to-Red Testing | FCWT |
|-----------|------------------|------|
| **Purpose** | Component/feature validation during build | Complete application validation before release |
| **Scope** | Individual features, modules, integration points | Entire application end-to-end |
| **Automation** | Automated test suite | Automated PLUS manual PLUS creative testing |
| **Data** | Minimal test fixtures | Realistic seed data (50+ entries across domains) |
| **Coverage** | Happy path + known edge cases | Happy path + edge + error + adversarial + stress |
| **Evidence** | Test results, code coverage | Test results + video walkthrough + screenshots + logs + data tables |
| **Timing** | During wave execution | After all waves complete |
| **Authority** | Builder + FM validation | FM supervision + CS2 sign-off |

---

## 4. FCWT Protocol Steps

### Step 1: Pre-FCWT Validation (FM Responsibility)

**Entry Criteria** (ALL must be TRUE before FCWT begins):
- ✅ All application waves complete and closed
- ✅ All QA-to-Red tests GREEN (100%, zero test debt)
- ✅ All wave closure certifications issued
- ✅ Application builds and deploys successfully
- ✅ All acceptance criteria from FRS/TRS met
- ✅ No critical defects or blocking issues

**FM Actions:**
- [ ] Verify all waves closed with complete certifications
- [ ] Run full QA-to-Red suite and confirm 100% GREEN
- [ ] Validate application launches without errors
- [ ] Confirm deployment configuration valid
- [ ] Assign FCWT executor (UI Builder or QA agent)
- [ ] Provide FCWT checklist and templates

**Blocking**: If any entry criterion fails, FCWT CANNOT begin. Remediate and re-validate.

---

### Step 2: QA-to-Red Suite Compilation and Execution

**Purpose**: Establish baseline that all automated tests AND static analysis gates pass before manual/creative testing.

**Required Actions:**
1. **Compile full test suite**
   - Gather all QA-to-Red tests from all waves
   - Verify test suite completeness against QA Catalog
   - Ensure all tests enabled (no skips, no stubs)

2. **Execute full test suite**
   - Run complete suite in clean environment
   - Capture full test output and logs
   - Document execution time and resource usage

3. **Validate 100% GREEN**
   - ALL tests must pass
   - Zero failures, zero warnings, zero skipped tests
   - If any test fails, STOP FCWT and remediate

4. **Execute lint validation (MANDATORY)**
   - Run linter (e.g., yarn lint, npm run lint, eslint)
   - Validate ZERO errors
   - Validate ZERO warnings
   - Capture lint output
   - If ANY lint issue found, STOP FCWT and remediate

5. **Execute type-check validation (if applicable)**
   - Run type-checker (e.g., yarn type-check, tsc --noEmit, mypy)
   - Validate ZERO type errors
   - Capture type-check output
   - If ANY type error found, STOP FCWT and remediate

6. **Execute build validation (MANDATORY)**
   - Run build command (e.g., yarn build, npm run build)
   - Validate build succeeds (exit code 0)
   - Verify build artifacts generated
   - Capture build output
   - If build fails, STOP FCWT and remediate

**Evidence Required:**
- 📋 Complete test execution log
- 📋 Test results summary (pass/fail counts, coverage)
- 📋 Screenshot of GREEN test dashboard
- 📋 Test execution timestamp and environment details
- 📋 **Lint execution output (0 errors, 0 warnings)**
- 📋 **Type-check execution output (0 errors, if applicable)**
- 📋 **Build execution output (successful build)**
- 📋 **CLI evidence for ALL static analysis gates (lint/type/build)**

**Blocking**: **Any test failure OR any lint/type/build failure BLOCKS FCWT progression**. Return to development, fix issue, re-run ALL gates (tests + lint + type + build) until 100% GREEN.

**Wave 5.6 Learning**: "QA-to-Red test results alone are NOT sufficient. All lint/static/code quality gates must be zero-defect before any work is handed over. This enforces code and deployment integrity and prevents silent failures."

**Authority**: 
- Issue: "Governance Policy Update: Mandatory Lint/Static Analysis Gates Before Handover"
- `BUILD_PHILOSOPHY.md` — One-Time Build Law: delivered means 100% working
- `WE_ONLY_FAIL_ONCE_DOCTRINE.md` — Structural governance prevents repeat failures

---

### Step 3: Seed Data Population

**Purpose**: Populate database with realistic, comprehensive test data to enable real-world scenario testing.

**Required Data Volumes** (minimum for MAT application):
- ✅ 50+ Audit entries across multiple domains
- ✅ 100+ Criteria across different frameworks (NIST, ISO, CIS, etc.)
- ✅ 200+ Evidence items (documents, files, links, notes)
- ✅ Multiple user roles and permissions configured
- ✅ Representative data distribution (different statuses, dates, relationships)

**Data Characteristics:**
- **Realistic**: Data reflects actual production usage patterns
- **Comprehensive**: All entity types, all relationships, all statuses represented
- **Edge cases included**: Empty fields, maximum lengths, special characters, boundary values
- **Temporal diversity**: Data spans multiple time periods (created dates, modified dates)

**Required Actions:**
1. **Create seed data scripts** (if not exist)
   - Database population scripts
   - API-based data creation scripts
   - Manual data entry procedures (if required)

2. **Populate database**
   - Run seed scripts in test environment
   - Verify data created successfully
   - Validate data relationships and integrity

3. **Document seed data**
   - Data schema documentation
   - Record counts per entity type
   - Sample data examples
   - Data generation methodology

**Evidence Required:**
- 📋 Seed data scripts (committed to codebase)
- 📋 Database dump or export (snapshot of seed data)
- 📋 Data summary table (entity types, counts, distributions)
- 📋 Data integrity validation results

**FM Input Protocol**: If seed data requires domain knowledge or specific scenarios:
- **Executor MUST prompt FM/owner for data requirements**
- **FCWT BLOCKS until FM/owner provides guidance**
- **Document all FM/owner inputs and rationale**

---

### Step 4: Major Use-Case Flow Testing

**Purpose**: Validate all critical user workflows operate correctly end-to-end.

**Required Test Coverage** (for MAT application):

1. **Audit Management Flows**
   - Create new audit
   - Configure audit settings
   - Add criteria to audit
   - Assign evidence to criteria
   - Score criteria
   - Generate audit report
   - Archive/close audit

2. **Evidence Management Flows**
   - Upload document evidence
   - Create link evidence
   - Create note evidence
   - Tag evidence
   - Search evidence
   - Update evidence
   - Delete evidence
   - Bulk evidence operations

3. **Criteria Management Flows**
   - Import criteria from frameworks
   - Create custom criteria
   - Edit criteria
   - Assign criteria to audits
   - Score criteria (compliant, non-compliant, partial, N/A)
   - Add criteria notes and recommendations

4. **Reporting Flows**
   - Generate summary reports
   - Generate detailed reports
   - Export reports (PDF, Excel, etc.)
   - Schedule automated reports
   - Share reports with stakeholders

5. **Settings/Configuration Flows**
   - User profile management
   - Permission/role configuration
   - Framework selection
   - Integration settings
   - Notification preferences

**Testing Methodology:**
- [ ] Execute each workflow end-to-end
- [ ] Use realistic data from seed dataset
- [ ] Verify expected outcomes at each step
- [ ] Capture screenshots of key screens
- [ ] Record any errors or unexpected behavior

**Evidence Required:**
- 📋 Test case list with pass/fail status
- 📋 Screenshots of successful workflow completions
- 📋 Video walkthrough of all major workflows (recommended)
- 📋 Detailed test log with timestamps and outcomes

---

### Step 5: Edge/Corner/Error Case Testing

**Purpose**: Validate application handles boundary conditions, errors, and exceptional cases gracefully.

**Required Test Categories:**

1. **Empty State Testing**
   - New user with no data
   - Empty audit (no criteria)
   - Empty evidence library
   - No search results
   - Verify appropriate empty state messaging

2. **Boundary Value Testing**
   - Maximum field lengths
   - Minimum values (e.g., zero scores)
   - Maximum entity counts (e.g., 1000+ criteria)
   - Large file uploads
   - Long-running operations

3. **Error State Testing**
   - Invalid input validation
   - Failed file uploads
   - Network errors/timeouts
   - Server errors (simulate if possible)
   - Permission denied scenarios
   - Concurrent edit conflicts

4. **Data Integrity Testing**
   - Duplicate data handling
   - Orphaned references
   - Circular dependencies (if applicable)
   - Data migration/import errors

5. **Large Data Set Testing**
   - Application with 100+ audits
   - Audit with 500+ criteria
   - Evidence library with 1000+ items
   - Search/filter performance with large datasets

**Testing Methodology:**
- [ ] Attempt to "break" the application
- [ ] Enter invalid data in all input fields
- [ ] Perform actions out of expected sequence
- [ ] Simulate network failures (if feasible)
- [ ] Test performance degradation with large data

**Evidence Required:**
- 📋 Edge case test matrix (case, expected behavior, actual behavior)
- 📋 Error handling screenshots
- 📋 Performance metrics for large data tests
- 📋 Documented issues/defects found (if any)

---

### Step 6: UX/Workflow/Accessibility Testing

**Purpose**: Validate user experience quality, workflow efficiency, and accessibility compliance.

**Required UX Validations:**

1. **Navigation and Workflow**
   - [ ] All navigation paths intuitive and functional
   - [ ] Breadcrumbs/back navigation work correctly
   - [ ] No dead ends or confusing flows
   - [ ] Consistent layout and UI patterns
   - [ ] Loading states and feedback clear

2. **Mobile/Responsive Testing** (per TRS mobile-first requirement)
   - [ ] Test on mobile viewport (375px, 414px widths)
   - [ ] Test on tablet viewport (768px, 1024px widths)
   - [ ] Test on desktop viewport (1920px width)
   - [ ] Touch interactions work correctly
   - [ ] No horizontal scrolling on mobile
   - [ ] All features accessible on all screen sizes

3. **Performance Testing**
   - [ ] Page load times < 2 seconds (per TRS)
   - [ ] Interactions responsive (< 100ms feedback)
   - [ ] Large list rendering performant
   - [ ] File upload/download reasonable speed
   - [ ] No memory leaks or resource exhaustion

4. **Accessibility Testing** (if specified in TRS)
   - [ ] Keyboard navigation functional
   - [ ] Screen reader compatibility (basic test)
   - [ ] Color contrast meets WCAG guidelines
   - [ ] Focus indicators visible
   - [ ] Form labels and ARIA attributes present

**Testing Methodology:**
- [ ] Test on multiple devices/browsers (if feasible)
- [ ] Simulate slow network conditions
- [ ] Navigate application using only keyboard
- [ ] Use browser DevTools for performance profiling

**Evidence Required:**
- 📋 UX test checklist with results
- 📋 Screenshots from different viewports
- 📋 Performance metrics (page load times, interaction timings)
- 📋 Accessibility audit results (browser DevTools or axe)
- 📋 UX issues/friction points identified

---

### Step 7: Adversarial/Stress Testing

**Purpose**: Attempt to break the application through creative, adversarial usage.

**Required Adversarial Tests:**

1. **Security Probing**
   - [ ] Attempt SQL injection in input fields
   - [ ] Attempt XSS attacks in text fields
   - [ ] Test authentication bypass attempts
   - [ ] Test authorization boundary violations
   - [ ] Upload malicious files (if applicable)

2. **Boundary Exploitation**
   - [ ] Submit forms with all fields empty
   - [ ] Submit forms with maximum length strings
   - [ ] Rapid-fire button clicking
   - [ ] Concurrent operations on same data
   - [ ] Delete entities referenced by other entities

3. **Workflow Violations**
   - [ ] Skip required steps in workflows
   - [ ] Access restricted URLs directly
   - [ ] Manipulate URL parameters
   - [ ] Back/forward browser navigation mid-workflow
   - [ ] Refresh page during operations

4. **Resource Exhaustion**
   - [ ] Create maximum entities allowed
   - [ ] Upload maximum file sizes
   - [ ] Perform bulk operations
   - [ ] Open multiple simultaneous connections

**Testing Methodology:**
- [ ] Think like an attacker or malicious user
- [ ] Try unexpected input combinations
- [ ] Test recovery from crashes/errors
- [ ] Verify security controls block exploits

**Evidence Required:**
- 📋 Adversarial test log (actions attempted, results)
- 📋 Security test results (exploits blocked/allowed)
- 📋 Application recovery evidence (graceful degradation)
- 📋 Critical defects identified (if any)

**Blocking**: Critical security vulnerabilities discovered during FCWT MUST be remediated before sign-off.

---

### Step 8: Documentation and Evidence Compilation

**Purpose**: Create comprehensive documentation trail for audit and handover.

**Required Documentation:**

1. **Video Walkthrough** (HIGHLY RECOMMENDED)
   - [ ] Screen recording demonstrating all major features
   - [ ] Narration explaining workflows
   - [ ] Duration: 10-30 minutes (comprehensive but concise)
   - [ ] Covers happy paths and key error scenarios
   - [ ] Uploaded to persistent location (YouTube unlisted, Google Drive, etc.)

2. **Screenshot Collection**
   - [ ] Screenshots of all major screens/views
   - [ ] Before/after states for operations
   - [ ] Error messages and validation
   - [ ] Empty states and boundary conditions
   - [ ] Mobile/responsive views

3. **Test Execution Log**
   - [ ] Chronological log of all tests performed
   - [ ] Test names, timestamps, outcomes
   - [ ] Issues discovered and resolution status
   - [ ] Environment details (browser, OS, version)

4. **Data Tables**
   - [ ] Test scenario matrix (scenario, steps, expected, actual, status)
   - [ ] Coverage matrix (requirement, test coverage, status)
   - [ ] Defect log (issue, severity, status, resolution)
   - [ ] Performance metrics table

5. **Test Artifacts Archive**
   - [ ] QA-to-Red test results
   - [ ] Seed data scripts and dumps
   - [ ] Test data tables
   - [ ] Screenshots and videos
   - [ ] All FCWT evidence files

**Evidence Structure:**
```
.fcwt-evidence/
├── test-results/
│   ├── qa-to-red-full-suite-YYYYMMDD.log
│   └── qa-summary.md
├── seed-data/
│   ├── seed-scripts.sql
│   ├── seed-data-summary.md
│   └── database-snapshot.dump
├── functional-tests/
│   ├── use-case-test-log.md
│   ├── edge-case-test-matrix.md
│   └── adversarial-test-log.md
├── ux-tests/
│   ├── ux-test-checklist.md
│   ├── performance-metrics.md
│   └── accessibility-audit.md
├── media/
│   ├── screenshots/
│   └── walkthrough-video.mp4
└── fcwt-summary-report.md
```

---

### Step 9: FCWT Summary Report and Handover

**Purpose**: Consolidate all FCWT results into formal handover artifact.

**Required Report Sections:**

1. **Executive Summary**
   - FCWT start/end dates
   - Executor and supervisor
   - Overall PASS/FAIL verdict
   - Critical findings summary

2. **Test Coverage Summary**
   - QA-to-Red results (pass rate, test count)
   - Functional test coverage (workflows tested)
   - Edge case coverage
   - UX/performance test results
   - Adversarial test results

3. **Evidence Inventory**
   - List all evidence artifacts with locations
   - Video walkthrough link
   - Screenshot inventory
   - Test data locations

4. **Issues and Resolutions**
   - Defects discovered during FCWT
   - Severity classification
   - Resolution status (fixed, deferred, accepted)
   - Rationale for any deferred/accepted issues

5. **Functional Completeness Declaration**
   - Statement of compliance with FULLY_FUNCTIONAL_DELIVERY_STANDARD.md Section 3.2 (Fully Functional App)
   - Statement of compliance with FULLY_FUNCTIONAL_DELIVERY_STANDARD.md Section 3.3 (Fully Functional Delivery)
   - Evidence references supporting each criterion

6. **Handover Contract Checklist** (see Section 5 below)

**Report Template**: Use `governance/templates/FCWT_SUMMARY_REPORT.template.md`

---

### Step 10: FM Validation and Certification

**Purpose**: FM validates FCWT results and issues certification for audit sign-off.

**FM Validation Actions:**
- [ ] Review FCWT summary report
- [ ] Verify all evidence artifacts present and complete
- [ ] Validate all test results (100% GREEN for QA-to-Red)
- [ ] Review video walkthrough
- [ ] Confirm functional completeness criteria met
- [ ] Validate any issues/defects resolved or documented
- [ ] Check handover contract checklist complete

**FM Certification Requirements:**
- [ ] All FCWT steps completed with evidence
- [ ] All critical defects resolved
- [ ] Application meets all three "fully functional" definitions (FULLY_FUNCTIONAL_DELIVERY_STANDARD.md)
- [ ] Handover contract signed

**FM Issues Certification:**
```markdown
## FCWT Certification

**Application**: [App Name]
**FCWT Executor**: [Agent Name]
**FCWT Supervisor**: [FM Name]
**FCWT Start Date**: [YYYY-MM-DD]
**FCWT End Date**: [YYYY-MM-DD]

### Certification Statement

I certify that the Final Complete Wave Test (FCWT) for [App Name] has been completed in accordance with FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md and that the application meets all criteria for production readiness.

**Evidence Summary**:
- QA-to-Red: 100% GREEN ([X] tests pass, 0 failures)
- Functional Testing: [X] workflows validated
- UX Testing: Mobile-first, responsive, performant
- Adversarial Testing: No critical vulnerabilities
- Documentation: Complete (video walkthrough, screenshots, logs)

**Functional Completeness**: VERIFIED per FULLY_FUNCTIONAL_DELIVERY_STANDARD.md

**Handover Contract**: SIGNED (see handover artifact)

**Verdict**: ✅ FCWT PASS - Application ready for audit sign-off

**Foreman Signature**: [FM Name]
**Certification Date**: [YYYY-MM-DD]
```

**Blocking**: If FM cannot certify PASS, FCWT executor must remediate issues and repeat affected steps.

---

## 5. FCWT Handover Contract

### 5.1 Handover Against "Fully Functional" Definitions

The FCWT handover MUST explicitly validate against all three definitions from FULLY_FUNCTIONAL_DELIVERY_STANDARD.md:

#### 5.1.1 Fully Functional Design (Section 3.1)
**Handover Validation:**
- [ ] Architecture was implementation-ready (builder implemented without guesswork)
- [ ] All user-facing components were completely specified
- [ ] All deployment requirements were explicit
- [ ] QA Catalog was derivable from architecture
- [ ] Implementing design exactly produced working system

**Evidence**: Reference architecture documents, implementation plan, QA Catalog alignment

---

#### 5.1.2 Fully Functional App (Section 3.2)
**Handover Validation:**
- [ ] Application physically exists in codebase at documented path
- [ ] Application launches and operates without errors
- [ ] All requirements (FRS → TRS → Architecture) implemented 100%
- [ ] All user workflows operational
- [ ] Application meets all TRS quality standards (performance, UX, accessibility)
- [ ] Application is deployment-ready with valid configuration

**Evidence**: FCWT test results, video walkthrough, deployment verification

---

#### 5.1.3 Fully Functional Delivery (Section 3.3)
**Handover Validation:**
- [ ] Production-deployable system complete and works 100%
- [ ] Zero major rework required
- [ ] 100% GREEN test results, zero test debt
- [ ] All acceptance criteria met
- [ ] System works in target environment without fixes
- [ ] All operational requirements met (monitoring, logging, error handling)
- [ ] One-Time Build Law observed: system works completely at first build

**Evidence**: FCWT certification, all test evidence, deployment validation

---

### 5.2 Handover Contract Template

**Template Location**: `governance/templates/FCWT_HANDOVER_CONTRACT.template.md`

**Required Handover Elements:**
1. **Application Identification**
   - Application name, version, repository
   - Deployment location, configuration
   - Documentation locations

2. **Functional Completeness Declaration**
   - Statement of 100% requirement fulfillment
   - Traceability matrix (requirements → implementation → tests)
   - List of any deferred/descoped requirements (with CS2 approval)

3. **Quality Assurance Declaration**
   - QA-to-Red results: 100% GREEN
   - FCWT results: PASS
   - Test coverage metrics
   - Zero test debt confirmation

4. **Evidence Archive**
   - Location of .fcwt-evidence/ directory
   - Video walkthrough URL
   - Test data dumps
   - Documentation locations

5. **Known Issues and Limitations**
   - List of minor issues accepted for release
   - Technical debt items (if any)
   - Future enhancement recommendations

6. **Sign-Off Section**
   - FCWT Executor signature and date
   - FM Supervisor signature and date
   - CS2 Audit Approval signature and date (post-FCWT)

---

## 6. Test Debt Policy for FCWT

### 6.1 FCWT-Specific Test Creation

**Scenario**: FCWT executor discovers missing test coverage or needs to create new tests for FCWT validation.

**Governance Policy**:
- ✅ FCWT executor MAY create new tests/tables/functions **during FCWT only**
- ✅ Purpose: Enable comprehensive FCWT validation without blocking on build waves
- ⚠️  **Test debt clearing policy**: All FCWT-created tests MUST be cleared after sign-off
- ⚠️  **Clearing authority**: FM or CS2 determines whether tests integrate into permanent suite or are archived

**Required Documentation**:
- [ ] List all tests/functions created during FCWT
- [ ] Mark as "FCWT-specific" or "proposed for permanent suite"
- [ ] Include in handover documentation

**Post-Sign-Off Actions**:
1. **FM reviews FCWT-created tests**
2. **Decision: Integrate OR Archive**
   - **Integrate**: Tests provide ongoing value, add to QA Catalog
   - **Archive**: Tests were FCWT-specific, move to archive
3. **Test debt cleared**: Either integrated or archived, not left in limbo

---

### 6.2 FM/Owner Input Protocol

**Scenario**: FCWT executor needs domain knowledge, test data, or requirements clarification from FM/owner.

**Required Protocol**:
1. **Executor identifies need** (e.g., "What scenarios should I test for audit workflow?")
2. **Executor creates input request**
   - Document: `.fcwt-evidence/fm-input-requests/request-NNN.md`
   - Contents: Question, context, required information, urgency
3. **Executor BLOCKS FCWT progression** until FM/owner provides input
4. **FM/owner provides input**
   - Response documented in same file
   - Includes rationale and any additional context
5. **Executor proceeds** using FM/owner guidance
6. **Input documented in handover**: All FM/owner inputs listed in final report

**Blocking Authority**: FCWT executor MUST NOT proceed with guesswork. If critical information unavailable, ESCALATE to CS2.

---

## 7. Evidence Chain Requirements

### 7.1 Mandatory FCWT Evidence

**ALL of the following MUST be present in `.fcwt-evidence/` directory:**

1. **Test Results**
   - ✅ QA-to-Red full suite execution log
   - ✅ Functional test results
   - ✅ Edge case test matrix
   - ✅ UX test results
   - ✅ Adversarial test log

2. **Seed Data**
   - ✅ Seed data scripts/procedures
   - ✅ Database snapshot or export
   - ✅ Data summary documentation

3. **Media Evidence**
   - ✅ Video walkthrough (link if hosted externally)
   - ✅ Screenshot collection (all major screens)

4. **Documentation**
   - ✅ FCWT summary report
   - ✅ Test data tables
   - ✅ Issues/defects log
   - ✅ Performance metrics

5. **Handover Contract**
   - ✅ Signed handover contract
   - ✅ Functional completeness checklist
   - ✅ FM certification

### 7.2 Evidence Retention

**Location**: Application repository `.fcwt-evidence/` directory (committed to version control)

**Retention Policy**:
- ✅ Evidence preserved permanently in repository
- ✅ Video walkthroughs stored externally with persistent links
- ✅ Large data dumps may be stored externally with documented access

**Audit Access**: CS2 and auditors MUST have access to complete evidence archive for sign-off validation.

---

## 8. FCWT as Formal Closure Checkpoint

### 8.1 Integration with Wave Model

**FCWT Position in Lifecycle:**
```
ALL WAVES COMPLETE (CLOSED)
  ↓
FCWT PLANNING (FM assigns executor, provides templates)
  ↓
FCWT EXECUTION (Steps 1-10 per this protocol)
  ↓
FCWT VALIDATION (FM certification)
  ↓
POST-MORTEM / CANONIZATION (lessons learned, governance updates)
  ↓
AUDIT SIGN-OFF (CS2 approval for production release)
  ↓
PRODUCTION RELEASE
```

**Blocking Authority**: 
- **No post-mortem until FCWT PASS**
- **No audit sign-off until FCWT certified**
- **No production release until audit approved**

---

### 8.2 Post-FCWT Activities

**After FCWT PASS certification:**

1. **Post-Mortem Execution**
   - Review entire build process (all waves + FCWT)
   - Capture lessons learned
   - Identify governance improvements
   - Document build effectiveness metrics

2. **Canonization**
   - Promote significant learnings to governance canon
   - Update agent contracts based on insights
   - Ripple governance updates to consumer repos

3. **Artifact Generation**
   - Finalize all build documentation
   - Create release notes
   - Update deployment guides
   - Archive build evidence

4. **Audit Preparation**
   - Compile audit evidence package
   - Prepare audit presentation
   - Provide access to FCWT evidence
   - Schedule CS2 audit review

---

## 9. FCWT Failure Response

### 9.1 FCWT Failure Definition

**FCWT FAILS if ANY of the following occur:**

- ❌ Any QA-to-Red test fails during Step 2
- ❌ Critical functional workflow doesn't work (Step 4)
- ❌ Critical security vulnerability discovered (Step 7)
- ❌ Application doesn't meet TRS quality standards (Step 6)
- ❌ Evidence artifacts incomplete or missing (Step 8)
- ❌ Fully Functional Delivery criteria not met (Step 9)

### 9.2 Failure Response Protocol

**When FCWT FAILS:**

1. **IMMEDIATE STOP**
   - Halt FCWT execution
   - Document failure point and details
   - Assess severity and scope

2. **REMEDIATION**
   - Create defect/task for issue resolution
   - Assign to appropriate builder
   - Fix issue with evidence
   - Re-run affected tests

3. **RE-VALIDATION**
   - After fix, re-run QA-to-Red suite (if impacted)
   - Re-test affected FCWT steps
   - Confirm GREEN status

4. **LEARNING CAPTURE**
   - Document root cause of failure
   - Why didn't earlier testing catch this?
   - Create FL-CI or BL entry
   - Update governance if pattern detected

5. **RESUME FCWT**
   - Continue from failure point (or restart if appropriate)
   - Complete all remaining steps
   - Ensure all evidence updated

**Escalation**: If FCWT fails multiple times or reveals fundamental issues, ESCALATE to CS2 for governance review.

---

## 10. Success Metrics

This protocol is successful when:

- ✅ Zero applications approved for production without FCWT PASS
- ✅ 100% of FCWT executions produce complete evidence archives
- ✅ All audits have video walkthroughs and comprehensive documentation
- ✅ Zero post-release defects that should have been caught in FCWT
- ✅ Audit sign-off process streamlined with FCWT evidence
- ✅ Applications proven functional under realistic conditions before release

**Failure Indicators** (require governance review):
- ❌ FCWT skipped or rushed
- ❌ FCWT evidence incomplete
- ❌ Production defects discovered that FCWT should have caught
- ❌ Audit delays due to missing FCWT documentation
- ❌ FCWT treated as formality rather than comprehensive validation

---

## 11. Agent Responsibilities

### 11.1 Foreman (FM)

**Pre-FCWT:**
- ✅ Validate all waves complete and certified
- ✅ Assign FCWT executor
- ✅ Provide FCWT templates and checklists
- ✅ Define any custom test scenarios required

**During FCWT:**
- ✅ Monitor FCWT progress
- ✅ Respond to FM/owner input requests
- ✅ Review interim results
- ✅ Approve test debt creation (if needed)

**Post-FCWT:**
- ✅ Validate FCWT evidence complete
- ✅ Issue FCWT certification
- ✅ Approve handover contract
- ✅ Submit to CS2 for audit sign-off

### 11.2 FCWT Executor (UI Builder or QA Agent)

**Responsibilities:**
- ✅ Execute all 10 FCWT protocol steps
- ✅ Create comprehensive evidence trail
- ✅ Document all tests and results
- ✅ Create video walkthrough
- ✅ Generate FCWT summary report
- ✅ Prepare handover contract
- ✅ Respond to FM validation feedback

### 11.3 Governance Repository Administrator

**Responsibilities:**
- ✅ Maintain FCWT protocol in CANON_INVENTORY
- ✅ Ripple FCWT updates to consumer repositories
- ✅ Validate FCWT evidence archives exist
- ✅ Enforce FCWT gate in merge workflows (if automated)

### 11.4 CS2 (Johan Ras)

**Responsibilities:**
- ✅ Approve FCWT protocol and updates
- ✅ Review FCWT evidence for audit sign-off
- ✅ Approve production release after FCWT validation
- ✅ Enforce FCWT compliance
- ✅ Review FCWT failures and governance gaps

---

## 12. Integration with Related Canon

This FCWT protocol integrates with:

| Canon File | Integration Point |
|------------|------------------|
| **FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** | Three "fully functional" definitions validated in handover |
| **WAVE_MODEL.md** | FCWT positioned as post-wave, pre-audit checkpoint |
| **BUILD_PHILOSOPHY.md** | One-Time Build Law: FCWT proves delivery = working 100% |
| **MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md** | FCWT certification format and evidence requirements |
| **QA_CATALOG_ALIGNMENT_GATE_CANON.md** | QA-to-Red test suite compilation and execution |
| **POST_MORTEM_PROTOCOL.md** | FCWT triggers post-mortem and canonization |
| **WE_ONLY_FAIL_ONCE_DOCTRINE.md** | FCWT failures trigger learning and governance updates |

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | CS2 (Johan Ras) | Initial FCWT protocol creation establishing comprehensive final testing and handover requirements |

---

**END OF FINAL COMPLETE WAVE TEST PROTOCOL**

**Authority**: CS2 (Johan Ras) | **Version**: 1.0.0 | **Effective**: 2026-02-17

---

## Appendix A: FCWT Quick Reference Checklist

### Pre-FCWT Validation (FM)
- [ ] All waves complete and closed
- [ ] All QA-to-Red tests 100% GREEN
- [ ] Application builds and deploys successfully
- [ ] FCWT executor assigned
- [ ] Templates provided

### FCWT Execution Steps
- [ ] Step 1: Pre-FCWT validation complete
- [ ] Step 2: QA-to-Red suite 100% GREEN
- [ ] Step 3: Seed data populated (50+ entries)
- [ ] Step 4: All major workflows tested
- [ ] Step 5: Edge/error cases tested
- [ ] Step 6: UX/performance/accessibility validated
- [ ] Step 7: Adversarial testing complete
- [ ] Step 8: Documentation compiled (video, screenshots, logs)
- [ ] Step 9: FCWT summary report created
- [ ] Step 10: FM certification issued

### Evidence Archive Complete
- [ ] Test results (QA-to-Red, functional, edge, UX, adversarial)
- [ ] Seed data (scripts, dumps, documentation)
- [ ] Media (video walkthrough, screenshots)
- [ ] Documentation (summary report, data tables, logs)
- [ ] Handover contract (signed, with functional completeness validation)

### FM Certification
- [ ] All evidence reviewed and validated
- [ ] Functional completeness criteria met
- [ ] No critical defects blocking release
- [ ] FCWT PASS certification issued
- [ ] Ready for audit sign-off

---

**Critical Reminder**: **FCWT is not optional, not a formality, and not negotiable.** It is the mandatory gateway to production release, ensuring applications are truly complete, functional, and ready for real-world use.
