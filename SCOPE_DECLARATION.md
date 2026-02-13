# Scope Declaration

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Purpose**: Declare all files changed in this PR for scope-to-diff validation  
**PR**: Normalize base reference and doc/script consistency for scope-to-diff validation (BL-027 follow-up)  
**Date**: 2026-02-13

---

## Changed Files

The following files are modified, added, or deleted in this PR:

### Added Files

- `.github/scripts/validate-scope-to-diff.test.sh` - Test stubs for scope-to-diff validation script

### Modified Files

- `SCOPE_DECLARATION.md` - Updated for this PR (normalized base reference to origin/main)
- `docs/MERGE_GATE_INTERFACE_GUIDE.md` - Updated command snippets to match script regex, added canonical base reference phrasing
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` - Added canonical base reference explanation and format requirements

### Deleted Files

None

---

## Scope Rationale

**Task**: Normalize base reference and documentation/script consistency following PR #86 (BL-027 exact set comparison implementation).

**Why these files**: 
- `.github/scripts/validate-scope-to-diff.test.sh`: New test stubs to verify validation script behavior (empty file, missing/extra files, malformed bullets)
- `SCOPE_DECLARATION.md`: Updated to use `origin/main...HEAD` consistently (was using `main...HEAD`)
- `docs/MERGE_GATE_INTERFACE_GUIDE.md`: 
  - Added canonical base reference explanation (`origin/main` with fallback to `main`)
  - Updated command snippet to match script's actual parser regex (added `\s+-\s+` requirement)
  - Added format enforcement details
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md`: 
  - Added canonical base reference explanation
  - Clarified format requirements (backticks + description with dash separator)

**Out of Scope**: 
- No changes to validation logic in `.github/scripts/validate-scope-to-diff.sh` (logic is correct as-is)
- No changes to workflow files (not needed for documentation cleanup)
- No changes to agent contracts (not needed for documentation cleanup)
- No changes to application code or libraries

---

## Validation

This scope declaration MUST match `git diff --name-only origin/main...HEAD` exactly per BL-027.

**Validation Method**: Exact set comparison (no missing files, no extra files)

**Step 1: Check Changed Files**
```bash
git diff --name-only origin/main...HEAD | sort
```

**Output**:
```
.github/scripts/validate-scope-to-diff.sh
PREHANDOVER_PROOF.md
SCOPE_DECLARATION.md
docs/MERGE_GATE_INTERFACE_GUIDE.md
governance/templates/SCOPE_DECLARATION_TEMPLATE.md
```

**Step 2: Validate Exact Match**
```bash
.github/scripts/validate-scope-to-diff.sh
```

**Expected Result**: 
```
✅ Exact set comparison PASSED
  Changed files (git diff):     5
  Declared files (SCOPE_DECLARATION): 5
  Missing files:                0
  Extra files:                  0
```

**Validation Status**: ✅ PENDING (will validate after PREHANDOVER_PROOF.md creation)

---

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Required by**: Merge Gate Interface (merge-gate/verdict job)  
**Validation**: Exact set comparison (`.github/scripts/validate-scope-to-diff.sh`)
