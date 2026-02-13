# Scope Declaration

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Purpose**: Declare all files changed in this PR for scope-to-diff validation  
**PR**: Enhance scope-to-diff validation with exact set comparison  
**Date**: 2026-02-13

---

## Changed Files

The following files are modified, added, or deleted in this PR:

### Added Files

- `PREHANDOVER_PROOF.md` - Evidence bundle for this PR

### Modified Files

- `.github/scripts/validate-scope-to-diff.sh` - Enhanced with exact set comparison logic
- `docs/MERGE_GATE_INTERFACE_GUIDE.md` - Added detailed section on scope-to-diff validation
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` - Enhanced with examples and guidance
- `SCOPE_DECLARATION.md` - Updated for this PR

### Deleted Files

None

---

## Scope Rationale

**Task**: Enhance the scope-to-diff validation script to perform exact set comparison as required by MERGE_GATE_PHILOSOPHY.md (BL-027).

**Why these files**: 
- `.github/scripts/validate-scope-to-diff.sh`: Core implementation of exact set comparison algorithm with detailed error reporting
- `docs/MERGE_GATE_INTERFACE_GUIDE.md`: User-facing documentation with examples, troubleshooting, and best practices
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md`: Template improvements to guide users in creating accurate scope declarations
- `SCOPE_DECLARATION.md`: Required evidence artifact for this PR

**Out of Scope**: 
- No changes to workflow files (merge-gate-interface.yml already implements evidence-based validation pattern)
- No changes to agent contract files (foreman-isms-agent.md already declares scope-to-diff gate in Category 4.5)
- No changes to other validation scripts (yaml, evidence scripts work independently)

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
