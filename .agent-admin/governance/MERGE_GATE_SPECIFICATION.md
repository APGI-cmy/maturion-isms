# Merge Gate Specification

**Date**: 2026-02-16  
**Version**: 1.1.0  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md  
**Issue**: #193 - Implement POLC Boundary Validation Gate

---

## Overview

This document specifies all merge gates enforced in the maturion-isms repository, including the newly implemented POLC Boundary Validation Gate.

---

## Standard Merge Gate Interface

**Workflow**: `.github/workflows/merge-gate-interface.yml`

### Required Checks (3)

1. **`Merge Gate Interface / merge-gate/verdict`**
   - **Purpose**: Validates evidence artifacts, gate compliance, PREHANDOVER_PROOF
   - **Checks**: Scope-to-Diff (BL-027), YAML Syntax (BL-028), BUILD_PROGRESS_TRACKER Update (BL-029)
   - **Authority**: MERGE_GATE_INTERFACE_STANDARD.md, MERGE_GATE_PHILOSOPHY.md v2.0

2. **`Merge Gate Interface / governance/alignment`**
   - **Purpose**: Verifies canonical governance alignment, drift detection
   - **Checks**: sync_state.json, CANON_INVENTORY.json structure and validity
   - **Authority**: GOVERNANCE_RIPPLE_MODEL.md, AGENT_RIPPLE_AWARENESS_OBLIGATION.md

3. **`Merge Gate Interface / stop-and-fix/enforcement`**
   - **Purpose**: Enforces zero test debt, zero warnings
   - **Checks**: Stop-and-fix compliance documentation in PREHANDOVER_PROOF
   - **Authority**: STOP_AND_FIX_DOCTRINE.md, ZERO_TEST_DEBT.md

---

## POLC Boundary Validation Gate (NEW)

**Workflow**: `.github/workflows/polc-boundary-gate.yml`  
**Issue**: #193  
**Date Added**: 2026-02-16

### Purpose

Detect and prevent Foreman from writing production code; ensure builder delegation model is followed.

### Required Check

**`Merge Gate Interface / polc-boundary/validation`**

### Implementation Details

#### Check 1: Detect Foreman-Authored Implementation Commits

**Logic**:
1. Get all commits in PR
2. Identify commits by Foreman (`copilot-swe-agent[bot]`, `Copilot`, `copilot`)
3. Check files changed against patterns:
   - **Production code (PROHIBITED)**:
     - `modules/**/src/**/*.{ts,tsx,js,jsx}`
     - `modules/**/tests/**/*.test.{ts,tsx,js,jsx}`
     - `apps/**/src/**/*.{ts,tsx,js,jsx}`
     - `packages/**/src/**/*.{ts,tsx,js,jsx}`
   - **Allowed files**:
     - `modules/**/02-architecture/**/*.md`
     - `.agent-workspace/**`
     - `.agent-admin/**`
     - `governance/**`
     - `BUILD_PROGRESS_TRACKER.md`
4. **FAIL** if Foreman modified production/test code

**Exit Code**: 1 (fail) if violation detected, 0 (pass) otherwise

**Failure Message**:
```
❌ POLC BOUNDARY VIOLATION DETECTED

Foreman authored commits modifying production code.

Files:
  - [list of files]

Commits:
  - [list of commit SHAs]

Foreman MUST NOT write production code. Builders implement; Foreman supervises.

Action Required:
  1. Close this PR
  2. Create builder delegation issues
  3. Assign builders to implement
  4. Foreman supervises (does not implement)

Override: CS2 only
```

---

#### Check 2: Validate Builder Involvement

**Logic**:
1. Check if production code was changed
2. If yes, check for builder commits (api-builder, ui-builder, schema-builder, integration-builder, qa-builder)
3. OR check for builder completion reports (`.agent-workspace/{builder}/**/*COMPLETION*`)
4. If production code changed but NO builder evidence → **WARN**

**Exit Code**: 0 (pass with warning)

**Warning Message**:
```
⚠️  WARNING: NO BUILDER INVOLVEMENT DETECTED

Production code changed but no builder artifacts found.

Expected: Builder commits OR completion reports in .agent-workspace/

If Foreman supervised builders, where are the builder artifacts?
If Foreman wrote code directly, this is a POLC violation.

This is a WARNING. Manual review required.
```

---

#### Check 3: Validate Session Memory Presence

**Logic**:
1. Check for `.agent-workspace/foreman*/memory/session-*.md` created in PR
2. Validate session memory doesn't contain evidence of FM writing code
3. **FAIL** if missing or if POLC violation detected in memory

**Exit Code**: 1 (fail) if missing or violation found, 0 (pass) otherwise

**Failure Message (Missing)**:
```
❌ SESSION MEMORY REQUIRED

Every Foreman session MUST create session memory.

Expected: .agent-workspace/foreman*/memory/session-NNN-YYYYMMDD.md

Session memory must document:
  - Builder delegation (if implementation work occurred)
  - POLC supervision evidence
  - Decisions and lessons learned

Per Living Agent System v6.2.0.
```

**Failure Message (POLC Violation)**:
```
❌ SESSION MEMORY INDICATES POLC VIOLATION

Session memory contains evidence that Foreman wrote production code.
This violates the POLC-Only Constraint.
```

---

#### Check 4: Validate Evidence Artifact Bundle

**Logic**:
1. Check for `.agent-admin/` directory
2. Check required subdirectories: `prehandover/`, `gates/`, `improvements/`
3. **FAIL** if `.agent-admin/` missing

**Exit Code**: 1 (fail) if missing, 0 (pass) otherwise

**Failure Message**:
```
❌ EVIDENCE ARTIFACT BUNDLE REQUIRED

Expected structure:
  .agent-admin/prehandover/
  .agent-admin/gates/
  .agent-admin/improvements/

Per EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md
```

---

## Override Authority

**POLC Boundary Violations**: CS2 (Johan) only

All other gate failures can be addressed through standard remediation (fix and re-run gates).

---

## Branch Protection Configuration

To enforce these gates, add the following required status checks to the `main` branch protection rules:

### Required Status Checks
1. `Merge Gate Interface / merge-gate/verdict`
2. `Merge Gate Interface / governance/alignment`
3. `Merge Gate Interface / stop-and-fix/enforcement`
4. `Merge Gate Interface / polc-boundary/validation` ← NEW

### Configuration
- **Require status checks to pass before merging**: ✅ Enabled
- **Require branches to be up to date before merging**: ✅ Enabled
- **Do not allow bypassing the above settings**: ✅ Enabled (except for CS2)

---

## Testing & Verification

### Smoke Test Scenarios

1. **Test: Foreman writes production code**
   - Expected: Check 1 FAILS
   - Result: Merge blocked

2. **Test: Builder writes production code**
   - Expected: Check 1 PASSES, Check 2 PASSES
   - Result: Merge allowed (if other gates pass)

3. **Test: Missing session memory**
   - Expected: Check 3 FAILS
   - Result: Merge blocked

4. **Test: Missing evidence bundle**
   - Expected: Check 4 FAILS
   - Result: Merge blocked

### Comprehensive Testing

See Issue #194 for comprehensive gate verification requirements.

---

## References

### Governance Canon
- `LIVING_AGENT_SYSTEM.md` v6.2.0
- `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- `MERGE_GATE_INTERFACE_STANDARD.md`
- `MERGE_GATE_PHILOSOPHY.md` v2.0
- `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`

### Evidence
- Issue #191 (RCA - Wave 5 POLC Violation)
- Issue #192 (Agent Contract - Gate Specification)
- Issue #193 (Gate Implementation) ← THIS ISSUE
- PR #183, PR #190 (POLC violations prevented by this gate)

### Related Issues
- Issue #194 (Gate Verification - blocked by this)
- Issue #195 (Wave 5 Re-Execution - blocked by this)

---

## Changelog

### Version 1.1.0 (2026-02-16)
- Added POLC Boundary Validation Gate specification
- Documented 4 required checks (Foreman commits, builder involvement, session memory, evidence bundle)
- Added override authority (CS2 only)
- Added branch protection configuration
- Added testing scenarios

### Version 1.0.0 (2026-02-12)
- Initial specification for standard merge gate interface
- Documented 3 existing required checks

---

*END OF MERGE GATE SPECIFICATION v1.1.0*
