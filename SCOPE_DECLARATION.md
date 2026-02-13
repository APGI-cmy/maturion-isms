# Scope Declaration

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Purpose**: Declare all files changed in this PR for scope-to-diff validation  
**PR**: Normalize base reference and doc/script consistency (BL-027 follow-up)  
**Date**: 2026-02-13

---

## Changed Files

The following files are modified, added, or deleted in this PR:

### Added Files

None

### Modified Files

- `.github/scripts/validate-scope-to-diff.sh` - Normalized base branch references in comments and remediation messages
- `docs/MERGE_GATE_INTERFACE_GUIDE.md` - Updated command examples to clarify fallback behavior and match script parser
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` - Added fallback clarification and updated command examples
- `SCOPE_DECLARATION.md` - Updated for this PR with normalized references

### Deleted Files

None

---

## Scope Rationale

**Task**: Normalize documentation and script comments for consistency regarding base branch references (BL-027 follow-up).

**Why these files**: 
- `.github/scripts/validate-scope-to-diff.sh`: Updated comments to clarify origin/main with fallback to main; fixed parser regex documentation
- `docs/MERGE_GATE_INTERFACE_GUIDE.md`: Updated command examples to mention fallback behavior; updated extraction command to match actual script parser
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md`: Added explicit note about fallback behavior in validation section
- `SCOPE_DECLARATION.md`: Updated to reflect current PR scope

**Out of Scope**: 
- No logic changes to validation algorithm (zero-tolerance policy unchanged)
- No changes to workflow files or agent contracts
- Optional test stubs deferred (good-first-issue for future work)

---

## Validation

This scope declaration MUST match `git diff --name-only origin/main...HEAD` exactly per BL-027.

**Note**: The validation script uses origin/main if available, with automatic fallback to main if origin/main doesn't exist.

**Validation Method**: Exact set comparison (no missing files, no extra files)

**Step 1: Check Changed Files**
```bash
# Uses origin/main if available, falls back to main
git diff --name-only origin/main...HEAD | sort
# (or main...HEAD if origin/main unavailable)
```

**Output**:
```
.github/scripts/validate-scope-to-diff.sh
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
