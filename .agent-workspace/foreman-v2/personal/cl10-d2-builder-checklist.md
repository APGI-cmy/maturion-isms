# Builder Checklist — CL-10-D2 | Sub-Module Routing Compliance CI Check

**Wave**: CL-10 (Re-execution) | Issue: maturion-isms#1313
**Builder**: integration-builder
**Deliverable**: CL-10-D2 — `.github/workflows/sub-module-routing-check.yml`
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md`
**Stage 9 Artifact**: This file (Builder Checklist)
**Date**: 2026-04-09

---

## Pre-Delivery Requirements (Foreman-Verified)

- [x] Architecture frozen: AIMC AAD GRS-016 defines compliance requirement
- [x] RED QA mandate: Integration-builder MUST commit RED tests BEFORE workflow file (two commits)
- [x] IAA Pre-Brief: Committed at SHA 7794c4d
- [x] Implementation Plan: concurrent-prebuild-and-legacy-plan.md §1.4
- [x] D1 baseline: routing-governance-check.yml ✅ in base
- [x] D3 baseline: stub-detection-check.yml ✅ in base

---

## Deliverable Specification

### CL-10-D2: Sub-Module Routing Compliance CI Check

**File**: `.github/workflows/sub-module-routing-check.yml`

**Purpose**: Enforce GRS-016 at the package.json dependency level. Scan all
`modules/*/package.json` and `apps/*/package.json` for direct AI provider SDK
dependencies. Fail PR if any are found.

**What to check**:
- `dependencies` AND `devDependencies` in each package.json
- Banned packages: `openai`, `@anthropic-ai/sdk`, and any `@langchain/*`
- Scan paths: `modules/*/package.json` + `apps/*/package.json`
- Exclude: `apps/maturion-maturity-legacy/` (legacy GOV exemption)

**Authority**: GOV-001, GOV-002, GRS-016
**Wave**: CL-10 — maturion-isms#1313

---

## RED Gate Requirements (MANDATORY — commit before workflow)

Integration-builder MUST add RED tests to:
`modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts`

New tests (extend after T-C-010-009):
- **T-C-010-010**: `sub-module-routing-check.yml` workflow file exists
- **T-C-010-011**: Workflow contains `openai` detection pattern in package.json scan
- **T-C-010-012**: Workflow contains `@anthropic-ai/sdk` detection pattern

These tests will be RED (fail) before the workflow file is created (Commit 1).
These tests will be GREEN after the workflow file is created (Commit 2).

**MANDATORY commit ordering**:
1. Commit 1: Add T-C-010-010, T-C-010-011, T-C-010-012 to routing-governance-ci.test.ts (RED)
2. Commit 2: Add sub-module-routing-check.yml workflow (tests become GREEN)

---

## Workflow YAML Requirements

```yaml
name: Sub-Module Routing Compliance Check
on:
  pull_request:
    paths:
      - 'modules/**/package.json'
      - 'apps/**/package.json'
  workflow_dispatch: {}

permissions:
  contents: read

jobs:
  sub-module-routing-check:
    name: "AIMC Compliance / sub-module-routing-check"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Check module package.json files for banned AI provider dependencies
        run: |
          # Scan modules/ and apps/ package.json for direct provider SDK dependencies
          # Authority: GOV-001, GOV-002, GRS-016
          # Excluded: apps/maturion-maturity-legacy (legacy GOV exemption)
```

**YAML requirements**:
- `workflow_dispatch: {}` MUST be present (OVL-CI-005 S-033 exception)
- Pattern must check BOTH `dependencies` and `devDependencies`
- Use `jq` or Python to parse JSON reliably
- Baseline MUST be clean (zero violations on current codebase before PR merge)
- Additive-only: must not modify existing CI workflows

---

## Acceptance Criteria

- [ ] Commit 1: RED gate tests T-C-010-010, T-C-010-011, T-C-010-012 committed and FAILING
- [ ] Commit 2: sub-module-routing-check.yml committed, all tests GREEN
- [ ] YAML syntax valid (yamllint/python yaml.safe_load)
- [ ] Baseline clean: zero violations on current codebase
- [ ] `workflow_dispatch: {}` present
- [ ] Both `dependencies` and `devDependencies` scanned
- [ ] `@langchain/*` wildcard covered
- [ ] Legacy exclusion documented with GOV reference
- [ ] PREHANDOVER proof at: `.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2-YYYYMMDD.md`

---

## IAA Pre-Brief Key Requirements (for integration-builder)

Per iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md:

1. OVL-CI-005 S-033 exception: include yamllint output + `workflow_dispatch:` evidence
2. SCOPE_DECLARATION.md parity with `git diff origin/main...HEAD --name-only`
3. A-033: all artifacts committed to git before PREHANDOVER (not disk-only)
4. A-031 Exempt section: carve-out for IAA pre-brief and ceremony artifacts
5. Pattern parity: cross-reference against routing-governance-check.yml pattern approach
