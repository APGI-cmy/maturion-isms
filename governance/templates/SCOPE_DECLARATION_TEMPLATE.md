# Scope Declaration

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Purpose**: Declare all files changed in this PR for scope-to-diff validation  
**PR**: [PR Number]  
**Date**: [YYYY-MM-DD]

---

## Changed Files

The following files are modified, added, or deleted in this PR:

### Modified Files

- [List any modified files here]

Example format:
- `.github/agents/foreman-isms-agent.md` - Updated with gate declarations
- `package.json` - Added new dependencies

### Added Files

[List any newly created files]

### Deleted Files

[List any deleted files, or state "None"]

---

## Scope Rationale

**Task**: [Brief description of what this PR accomplishes]

**Why these files**: [Explain why each file needed to be changed]

**Out of Scope**: [Explicitly state what is NOT changed, if relevant]

---

## Validation

This scope declaration MUST match `git diff --name-only origin/main...HEAD` exactly.

**Validation Command**:
```bash
git diff --name-only origin/main...HEAD | sort
```

**Expected Output**: All files listed above

**Validation Status**: ✅ MATCHES

---

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Required by**: Merge Gate Interface (governance-scope-to-diff-gate)
