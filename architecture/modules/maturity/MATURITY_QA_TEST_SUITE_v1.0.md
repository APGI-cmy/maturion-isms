# 📘 **MATURITY MODULE – QA TEST SUITE v1.0**

**Version:** 1.0  
**Status:** Approved by Foreman  
**Scope:** Defines all tests required for Maturity Module compliance with ISMS architecture, True North, Build Philosophy, and Migration Map.  
**Modules Covered:** Maturity (Domains, MPS, Criteria, Evidence, Approval, Reporting, Free Assessment)

---

# 0. QA Philosophy

QA follows the Maturion rule:

> **Architecture → QA → Build → QA → Release**
> 
> Nothing is considered valid unless it passes QA with **100% success**.  
> Broken architecture → update architecture → update QA → rebuild.

This test suite is mandatory.  
Builders MUST write tests before implementation (TDD + architecture-driven).

---

# 1. TEST CATEGORIES

The QA suite consists of:

1. Architecture Conformity Tests
2. Routing Tests
3. Component Rendering & UI Tests
4. State & Data Flow Tests
5. Data Model & Supabase Tests
6. Approval Workflow Tests
7. Evidence Lifecycle Tests
8. AI Behavioral Tests
9. Integration Tests (PIT, Analytics, Skills)
10. Security & RLS Tests
11. Watchdog Tests
12. Regression Tests

Each test category is documented below.

---

# 2. ARCHITECTURE CONFORMITY TESTS

These tests ensure the implementation matches the architecture document **exactly**.

## **2.1 Required Folders Exist**

```
architecture/modules/maturity/
├── MATURITY_MODULE_ARCHITECTURE_v1.0.md
├── MATURITY_QA_TEST_SUITE_v1.0.md
└── changelog.md

apps/web/app/(portal)/maturity/
├── page.tsx                    # Maturity Overview
├── domains/
│   └── [domainId]/
│       ├── page.tsx            # Domain Overview
│       └── mps/
│           └── [mpsId]/
│               ├── page.tsx    # MPS Manager
│               └── criteria/
│                   └── [criteriaId]/
│                       └── page.tsx  # Criteria Editor
├── evidence/
│   └── page.tsx                # Evidence Manager
├── approval/
│   └── page.tsx                # Approval Console
├── reporting/
│   └── page.tsx                # Reporting Dashboard
└── free-assessment/
    └── page.tsx                # Free Assessment

apps/web/components/maturity/
├── domains/
├── mps/
├── criteria/
├── evidence/
├── approval/
├── reporting/
└── shared/

packages/supabase/src/schema/maturity/
├── domains.ts
├── mps.ts
├── criteria.ts
├── evidence.ts
├── approvals.ts
└── index.ts
```

### Tests:

- [ ] Folder structure exists
- [ ] No legacy folders remain (e.g., `agents/`, deprecated component structures)
- [ ] File count matches architecture (no missing required files)

---

# 3. ROUTING TESTS

Ensure all Maturity routes resolve correctly inside the ISMS portal.

## **3.1 Route Map**

| Route | Component | Purpose |
|-------|-----------|---------|
| `/maturity` | Maturity Overview | Landing page with domain house |
| `/maturity/domains/[domainId]` | Domain Overview | Domain detail & MPS list |
| `/maturity/domains/[domainId]/mps/[mpsId]` | MPS Manager | MPS detail & criteria list |
| `/maturity/domains/[domainId]/mps/[mpsId]/criteria/[criteriaId]` | Criteria Editor | Criteria editing & evidence tagging |
| `/maturity/evidence` | Evidence Manager | Upload, tag, manage evidence |
| `/maturity/approval` | Approval Console | Approve criteria, MPS, domains |
| `/maturity/reporting` | Reporting Dashboard | Analytics & export |
| `/maturity/free-assessment` | Free Assessment | Public maturity snapshot |

### Tests:

- [ ] All routes render without crashing
- [ ] Breadcrumb updates correctly
- [ ] URL parameters load correct objects
- [ ] Errors handled when IDs do not exist

---

# 4. COMPONENT RENDERING TESTS

Each core screen MUST render successfully.

## Screens to test:

### ✔ Maturity Overview

- [ ] Domain house visualization loads
- [ ] All 5 domains visible
- [ ] Domain cards show correct status
- [ ] AI side panel visible

### ✔ Domain Overview

- [ ] Domain header displays correctly
- [ ] MPS list loads
- [ ] Progress indicators visible
- [ ] Add MPS button functional

### ✔ MPS Manager

- [ ] MPS header loads
- [ ] Criteria list displays
- [ ] Add criteria button functional
- [ ] Edit mode toggle works

### ✔ Criteria Editor

- [ ] Criteria form loads
- [ ] 5 maturity levels displayed
- [ ] Evidence tagging panel visible
- [ ] Save/cancel buttons functional

### ✔ Evidence Manager

- [ ] File upload zone visible
- [ ] Evidence list displays
- [ ] Filter controls functional
- [ ] Evidence preview works

### ✔ Approval Console

- [ ] Pending approvals list loads
- [ ] Approval actions visible
- [ ] Comments/notes section functional
- [ ] Approval history displays

### ✔ Reporting Dashboard

- [ ] Charts render correctly
- [ ] Domain heatmap displays
- [ ] Export functionality works
- [ ] Time-series comparisons functional

### ✔ Free Assessment

- [ ] Assessment form loads
- [ ] Organization profiling questions visible
- [ ] Submit button functional
- [ ] Results snapshot generates

### Tests:

- [ ] All required controls visible
- [ ] Skeleton loaders appear during fetch
- [ ] Error boundaries trigger correctly
- [ ] AI side panel visible & context-aware

---

# 5. STATE & DATA FLOW TESTS

Tests ensuring state consistency across nested pages.

### Required tests:

- [ ] Domain state persists across navigation
- [ ] MPS list refreshes on CRUD operations
- [ ] Criteria editor state persists
- [ ] Evidence uploads do not reset form state
- [ ] Contexts correctly pass user role & org

---

# 6. DATA MODEL & SUPABASE TESTS

Validate correct behavior of all data models.

## **6.1 Domain Tests**

- [ ] Create domain
- [ ] Rename domain
- [ ] Domain deletion blocked (system domain)

## **6.2 MPS Tests**

- [ ] Create MPS
- [ ] Update MPS
- [ ] Archive MPS
- [ ] MPS must belong to a domain

## **6.3 Criteria Tests**

- [ ] Create criteria
- [ ] Validate structure (title, description, 1–5 levels)
- [ ] Reject invalid criteria (missing levels)
- [ ] Update criteria
- [ ] Soft-delete criteria

## **6.4 Evidence Tests**

- [ ] Upload file
- [ ] Save metadata
- [ ] Tag to criteria
- [ ] Evidence deletion with audit log
- [ ] RLS enforcement (only authorized users can view)

---

# 7. APPROVAL WORKFLOW TESTS

Approval chain:

```
Implementer → Supervisor → Approver → Auditor
```

### Required tests:

- [ ] Implementer cannot approve
- [ ] Supervisor can only approve if criteria complete
- [ ] Approver can only approve full MPS
- [ ] Auditor can freeze final maturity cycle
- [ ] Cannot approve without evidence
- [ ] Rejection resets lower-level approvals
- [ ] Approval audit log created on each action

---

# 8. EVIDENCE LIFECYCLE TESTS

Critical area for ISMS compliance.

### Tests:

- [ ] Upload
- [ ] Classify
- [ ] AI evaluation
- [ ] Score generation
- [ ] Attach to criteria
- [ ] Approval
- [ ] Revision
- [ ] Archive

### Negative tests:

- [ ] Upload unsupported file types
- [ ] Evidence with missing metadata
- [ ] Duplicate evidence prevention

---

# 9. AI BEHAVIORAL TESTS

AI MUST obey:

- Evidence-first rule
- No hallucinations
- Maturity model structure
- Domain → MPS → Criteria hierarchy
- Strict format compliance
- Model routing rules
- Abort on insufficient context

### Required tests:

## **9.1 Criteria Generation**

- [ ] AI produces criteria with all five levels
- [ ] No ambiguous language
- [ ] No cross-domain contamination

## **9.2 Evidence Scoring**

- [ ] AI detects missing evidence
- [ ] AI produces justified scoring
- [ ] Watchdog flags anomalies

## **9.3 MPS Generation**

- [ ] AI maintains domain boundaries

## **9.4 Routing**

- [ ] Simple tasks → 4.1-mini
- [ ] Complex tasks → 4o / 5
- [ ] Coding tasks → o3-coder
- [ ] Evidence tasks → GPT-5 only

---

# 10. INTEGRATION TESTS

## **10.1 PIT Integration**

- [ ] Failing criteria generate PIT tasks
- [ ] Updates reflect instantly
- [ ] MPS completion closes PIT items
- [ ] Domain approval triggers PIT milestone updates

## **10.2 Analytics**

- [ ] Maturity scores feed analytics
- [ ] Time-based comparisons
- [ ] Domain heatmaps generated

## **10.3 Risk**

- [ ] Low maturity updates risk profile

## **10.4 Skills**

- [ ] Skills Portal receives training recommendations

---

# 11. SECURITY & RLS TESTS

### Required:

- [ ] Users can access only their organization's data
- [ ] Roles properly enforced
- [ ] External auditors → read-only except audit notes
- [ ] Evidence files protected by storage policies
- [ ] All Supabase RLS policies validated
- [ ] No bypass via direct API route

---

# 12. WATCHDOG TESTS

Watchdog monitors:

- AI hallucinations
- Model routing failures
- RLS violations
- Evidence scoring anomalies
- Missing structure in generated criteria
- Broken approval chains

### Tests must cover:

- [ ] Simulated AI hallucination
- [ ] Simulated AI routing failure
- [ ] Invalid maturity structure
- [ ] Slow response detection
- [ ] Evidence-data mismatch

---

# 13. REGRESSION TESTS

After each update:

- [ ] Run all architecture tests
- [ ] Run all integration tests
- [ ] Run UI tests
- [ ] Run security tests
- [ ] Confirm no regressions in:
  - [ ] Criteria structure
  - [ ] Evidence lifecycle
  - [ ] Approval flow
  - [ ] Analytics feed
  - [ ] PIT triggers

---

# 14. Test Coverage Requirements

Minimum coverage:

- **90%** module-level logic
- **100%** of all critical flows
- **100%** of RLS and AI tests
- **100%** of approval workflow tests
- **100%** of evidence lifecycle tests

---

## Implementation Notes

1. **Test Framework**: Use Vitest (latest stable) for unit tests, Playwright (latest stable) for E2E tests
2. **CI/CD Integration**: All tests must pass before merge
3. **Test Data**: Use factories for consistent test data generation
4. **Mocking**: Mock Supabase and AI services for unit tests
5. **Documentation**: Each test file must include clear descriptions
6. **Version Compatibility**: Test framework versions should align with project dependencies in package.json

---

## Sign-off

- [ ] All tests documented
- [ ] Test plan reviewed by Tech Lead
- [ ] QA suite approved by Foreman
- [ ] Builders have access to test specifications
- [ ] CI/CD pipeline configured to run test suite

---

**End of QA Test Suite v1.0**
