# CODE COVERAGE THRESHOLD CANON

## Status
**Type**: Tier-1 Canonical Governance Standard
**Authority**: CS2 (Johan Ras)
**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Owner**: Maturion Engineering Leadership (Johan Ras)
**Layer-Down Status**: PUBLIC_API
**Applies To**: All Foreman Instances, All Application Repositories, All Wave Executions, All Builders, All QA/Audit Processes

---

## 1. Purpose

This document establishes **mandatory code coverage thresholds** for all Maturion application repositories. Previously, only "100% GREEN" (all tests pass) was enforced, without any minimum code coverage percentage requirement. This left integration-critical paths potentially untested as long as a small, passing test suite existed.

This canon closes the coverage governance gap by:
- Defining minimum coverage thresholds by project type and test layer (unit, integration, e2e)
- Establishing coverage reporting requirements
- Mandating pre-merge enforcement of coverage thresholds
- Providing a clear exception process for legacy codebases and transitional periods

**Canonical Gap Addressed**: No governance requirement for minimum code coverage percentages existed. The "100% GREEN" standard only guaranteed that all written tests pass — it placed no floor on how much code was covered by those tests.

---

## 2. Constitutional Authority

This canon derives authority from and integrates with:

- **LIVING_AGENT_SYSTEM.md v6.2.0** — Supreme governance authority
- **BUILD_PHILOSOPHY.md** — One-Time Build Law: delivered means working 100%
- **FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md** — FCWT validation requirements
- **QA_CATALOG_ALIGNMENT_GATE_CANON.md** — QA-to-Red test registry and alignment
- **COMBINED_TESTING_PATTERN.md** — CST/CWT integration testing model

---

## 3. Coverage Threshold Definitions

### 3.1 Test Layers

This canon governs the following test layers:

| Layer | Definition | Examples |
|-------|-----------|---------|
| **Unit** | Tests of individual functions, classes, or modules in isolation (no external dependencies) | Function tests, class method tests, pure logic tests |
| **Integration** | Tests of multiple components working together (may use real DB, real API calls, or realistic stubs) | Service integration tests, API endpoint tests, DB query tests |
| **E2E** | End-to-end tests of complete user workflows in a production-like environment | Browser-driven workflow tests, full-stack scenario tests |

---

## 4. Mandatory Coverage Thresholds by Project Type

### REQ-CCT-001 — Web Application (User-Facing UI + Backend)

**Minimum Coverage Thresholds**:

| Test Layer | Statement Coverage | Branch Coverage | Function Coverage |
|------------|-------------------|----------------|------------------|
| Unit | 80% | 75% | 85% |
| Integration | 70% | 65% | 75% |
| E2E | 60% (critical paths) | N/A | N/A |

**Combined Floor**: Total statement coverage (unit + integration combined) MUST be ≥ 80%.

**Gate**: Pre-merge. BLOCKING if below threshold.

---

### REQ-CCT-002 — API Service / Backend Only

**Minimum Coverage Thresholds**:

| Test Layer | Statement Coverage | Branch Coverage | Function Coverage |
|------------|-------------------|----------------|------------------|
| Unit | 85% | 80% | 90% |
| Integration | 75% | 70% | 80% |
| E2E | N/A (API-only services use integration layer as highest) | N/A | N/A |

**Combined Floor**: Total statement coverage (unit + integration combined) MUST be ≥ 85%.

**Gate**: Pre-merge. BLOCKING if below threshold.

---

### REQ-CCT-003 — AIMC Module

**Minimum Coverage Thresholds**:

Given the critical coordination role of AIMC modules, higher thresholds apply:

| Test Layer | Statement Coverage | Branch Coverage | Function Coverage |
|------------|-------------------|----------------|------------------|
| Unit | 90% | 85% | 95% |
| Integration | 80% | 75% | 85% |
| Contract Tests | 100% of integration points | N/A | N/A |

**Combined Floor**: Total statement coverage (unit + integration combined) MUST be ≥ 90%.

**Gate**: Pre-merge. BLOCKING if below threshold.

---

### REQ-CCT-004 — Mobile Application

**Minimum Coverage Thresholds**:

| Test Layer | Statement Coverage | Branch Coverage | Function Coverage |
|------------|-------------------|----------------|------------------|
| Unit | 80% | 75% | 85% |
| Integration | 65% | 60% | 70% |
| E2E | 50% (critical paths) | N/A | N/A |

**Combined Floor**: Total statement coverage (unit + integration combined) MUST be ≥ 75%.

**Gate**: Pre-merge. BLOCKING if below threshold.

---

### REQ-CCT-005 — Governance Scripts / Tooling

**Minimum Coverage Thresholds**:

| Test Layer | Statement Coverage | Branch Coverage | Function Coverage |
|------------|-------------------|----------------|------------------|
| Unit | 75% | 70% | 80% |
| Integration | 60% | 55% | 65% |

**Combined Floor**: Total statement coverage MUST be ≥ 70%.

**Gate**: Pre-merge. BLOCKING if below threshold.

---

### REQ-CCT-006 — New Features in Existing Codebases (Delta Coverage)

**Requirement**: For PRs that add new features to an existing codebase:

1. **New code delta coverage**: Any new code introduced by the PR MUST meet the thresholds applicable to its project type (REQ-CCT-001 through REQ-CCT-005)
2. **Overall coverage must not regress**: The PR MUST NOT reduce overall statement coverage by more than 2 percentage points from the main branch baseline
3. **New public API surface**: 100% of new public functions/methods MUST be covered by at least one test

**Gate**: Pre-merge. BLOCKING for delta coverage violations and regressions > 2%.

---

## 5. Coverage Reporting Requirements

### REQ-CCT-007 — Coverage Report Format

**Requirement**: All coverage reports MUST be:

1. **Machine-readable**: JSON or XML format for CI parsing (e.g., Cobertura XML, Istanbul JSON, JaCoCo XML)
2. **Human-readable**: HTML report for reviewer reference
3. **Published as CI artifacts**: Coverage report uploaded to CI artifacts on every PR
4. **Summarized in PR comment**: Bot comment on PR showing current vs. threshold coverage

**Evidence Required**: Coverage report files in CI artifacts; PR comment showing coverage summary.

---

### REQ-CCT-008 — Coverage Tool Requirements

**Requirement**: Each application repository MUST use a coverage tool that:

1. Measures line/statement coverage, branch coverage, and function coverage independently
2. Produces output in a standard format (Cobertura XML, LCOV, Istanbul, JaCoCo)
3. Can be configured with coverage thresholds that fail the build on violation
4. Integrates with the CI pipeline without manual triggering

**Approved Tooling Examples** (not exhaustive):

| Language | Recommended Coverage Tool |
|----------|--------------------------|
| JavaScript / TypeScript | c8, Istanbul (nyc), Vitest coverage |
| Python | coverage.py, pytest-cov |
| Java / Kotlin | JaCoCo |
| Go | Built-in `go test -cover` |
| Ruby | SimpleCov |
| Swift | Xcode code coverage |

**FM Approval**: The coverage tool choice requires FM sign-off as part of project setup.

---

### REQ-CCT-009 — Coverage Baseline Registration

**Requirement**: Each application repository MUST register its coverage baseline in the project's quality configuration file. This baseline MUST include:

1. Project type (to determine which REQ-CCT-001 to REQ-CCT-005 applies)
2. Current overall coverage percentages (statement, branch, function) at the time of baseline registration
3. Target coverage milestones (if current coverage is below threshold due to an approved exception)
4. Date of baseline registration

**File**: `qa/coverage-baseline.json` or equivalent in the project root.

---

## 6. Pre-Merge Enforcement

### REQ-CCT-010 — Pre-Merge Coverage Gate

**Requirement**: The CI pipeline for every application repository MUST include a coverage gate that:

1. Runs the full test suite (unit + integration) on every PR
2. Measures coverage against the thresholds applicable to the project type
3. **FAILS** the PR if any threshold is not met
4. Posts a coverage summary comment on the PR

**Gate**: Pre-merge. BLOCKING.

**Implementation**: The coverage threshold MUST be configured in the test runner / coverage tool configuration (e.g., `jest.config.js` coverageThreshold, `pytest.ini` fail_under, `.coveragerc` fail-under). Hard-coding thresholds in CI script is acceptable if configuration file approach is not available.

---

### REQ-CCT-011 — Coverage Gate in Merge Gate Interface

**Requirement**: The **Merge Gate Interface** (governance/alignment gate workflow) MUST check that:

1. A coverage report artifact exists for the PR
2. The coverage report shows all thresholds met or a documented exception is present
3. The project type is registered (REQ-CCT-009) to determine applicable thresholds

**Integration**: The coverage gate result MUST be reported as part of the `merge-gate/verdict` check context.

---

## 7. Architecture Document Requirement

### REQ-CCT-012 — Coverage Documented in Architecture/QA Files

**Requirement**: The coverage thresholds applicable to a project MUST be documented in:

1. The project's `architecture/` documentation (referencing this canon)
2. The project's QA runbook or `qa/` directory
3. The `README.md` or `CONTRIBUTING.md` (summary only, linking to full canon)

**Evidence Required**: Architecture/QA documentation references coverage requirements.

---

## 8. Coverage Exception Process

### REQ-CCT-013 — Exception Request Process

If a project cannot meet the required coverage thresholds, the following exception process applies:

**Step 1 — Identify the Gap**
Document which threshold(s) cannot be met, the current actual coverage, and the technical reason (e.g., legacy untestable code, generated code, infrastructure boundary).

**Step 2 — Obtain FM Approval**
FM may approve a time-bounded exception (maximum 4 weeks) for:
- New repositories in early build phase (first 2 waves)
- Legacy code being progressively refactored
- Technical constraints that are scheduled to be resolved

**Step 3 — Obtain CS2 Approval for Extended Exceptions**
CS2 approval is required if:
- Exception extends beyond 4 weeks
- Exception covers > 20% of the codebase
- Exception is requested for AIMC modules

**Step 4 — Register the Exception**
All approved exceptions MUST be registered in:
- The project's `qa/coverage-baseline.json` (under an `exceptions` key)
- The PR description (for any PR merged during the exception window)

**Step 5 — Remediation Milestone**
Every exception MUST have a remediation milestone (wave or sprint target) for achieving the required threshold. If the milestone is missed, a new CS2 escalation is required.

---

### REQ-CCT-014 — Exclusions from Coverage Measurement

The following may be excluded from coverage measurement with FM approval:

| Category | Exclusion Allowed | Conditions |
|----------|------------------|------------|
| Vendored / generated code | YES | Must be in a designated `vendor/` or `generated/` directory |
| Configuration files | YES | JSON, YAML, ENV files with no executable logic |
| Type definition files | YES | `.d.ts`, stub files with no runtime logic |
| Database migration files | YES (partial) | Migration logic should have at minimum integration test coverage |
| Test files themselves | YES | Test code is not counted in application coverage |

**All other code is subject to the coverage thresholds.**

---

## 9. Coverage Improvement Plan

### REQ-CCT-015 — Coverage Improvement for Below-Threshold Projects

**Requirement**: Any application repository currently below the applicable threshold MUST:

1. Document the current coverage and the gap to the threshold
2. Create a coverage improvement plan with milestones (FM-approved)
3. Demonstrate measurable improvement at each wave closure
4. Achieve the threshold by the end of the wave containing the coverage improvement plan

**Evidence Required**: Coverage improvement plan in `qa/` directory; wave closure evidence showing milestone progress.

---

## 10. Responsibility Matrix

| Role | Responsibility |
|------|---------------|
| Builder | Write tests to meet coverage thresholds; configure coverage tooling; register baseline |
| Foreman (FM) | Approve coverage tooling choice; approve exceptions; verify gate compliance |
| QA Agent | Validate coverage reports during QA phases; identify coverage gaps |
| governance-repo-administrator | Maintain this canon; track compliance across repos; execute ripple on updates |
| CS2 | Approve threshold changes; approve extended coverage exceptions |

---

## 11. Authority Reference

This document is part of the **Maturion Canonical Governance System**.

**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Supreme Authority**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Approved By**: CS2 (Johan Ras)
**Maintained By**: governance-repo-administrator

All requirements in this document are **mandatory** unless explicitly noted as advisory. Violations of BLOCKING requirements prevent merge to main.

---

*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | CODE_COVERAGE_THRESHOLD_CANON.md v1.0.0*
