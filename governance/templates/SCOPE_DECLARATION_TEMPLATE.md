# Scope Declaration

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Purpose**: Declare all files changed in this PR for scope-to-diff validation  
**PR**: [PR Number]  
**Date**: [YYYY-MM-DD]

---

## Changed Files

The following files are modified, added, or deleted in this PR:

**IMPORTANT**: Use canonical format with backticks around file paths:
```markdown
- `path/to/file.ext` - Brief description
```

### Added Files

- [List any newly created files here]

**Example**:
- `.github/scripts/validate-scope-to-diff.sh` - Scope-to-diff validation script
- `docs/NEW_FEATURE_GUIDE.md` - Documentation for new feature
- `tests/new-feature.test.ts` - Test suite for new feature

### Modified Files

- [List any modified files here]

**Example**:
- `.github/agents/foreman-isms-agent.md` - Updated with gate declarations
- `package.json` - Added new dependencies
- `src/index.ts` - Implemented new feature logic

### Deleted Files

- [List any deleted files, or state "None"]

**Example**:
- `src/legacy/old-module.ts` - Removed deprecated module
- `docs/DEPRECATED_GUIDE.md` - Removed outdated documentation

Or simply: **None**

---

## Scope Rationale

**Task**: [Brief description of what this PR accomplishes]

**Why these files**: [Explain why each file needed to be changed]

**Out of Scope**: [Explicitly state what is NOT changed, if relevant]

---

## Validation

This scope declaration MUST match `git diff --name-only origin/main...HEAD` exactly per BL-027.

**Base Reference**: Always use `origin/main` as the base branch. The validation script automatically falls back to `main` if `origin/main` doesn't exist in your local repository.

**Validation Method**: Exact set comparison (no missing files, no extra files)

**Step 1: Check Changed Files**
```bash
git diff --name-only origin/main...HEAD | sort
```

**Step 2: Validate Exact Match**
```bash
.github/scripts/validate-scope-to-diff.sh
```

**Expected Result**: 
```
✅ Exact set comparison PASSED
  Changed files (git diff):     [N]
  Declared files (SCOPE_DECLARATION): [N]
  Missing files:                0
  Extra files:                  0
```

**Validation Status**: ✅ MATCHES / ❌ NEEDS UPDATE

**Exit Code**: [0 = pass, 1 = fail]

---

## Tips for Accurate Declaration

1. **Copy paths from git diff** to avoid typos:
   ```bash
   git diff --name-only origin/main...HEAD
   ```

2. **Use backticks** around file paths (canonical format with description):
   ```markdown
   - `path/to/file.ext` - Description
   ```
   
   **Note**: The validation script requires backticks around paths AND a dash before the description.

3. **Include ALL changed files** (no exceptions):
   - Source code files
   - Test files
   - Documentation files
   - Configuration files
   - This SCOPE_DECLARATION.md file itself

4. **Validate immediately** after creating this file:
   ```bash
   .github/scripts/validate-scope-to-diff.sh
   ```

5. **Document validation** in PREHANDOVER_PROOF.md with exact command and exit code

---

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Required by**: Merge Gate Interface (merge-gate/verdict job)  
**Validation**: Exact set comparison (`.github/scripts/validate-scope-to-diff.sh`)
