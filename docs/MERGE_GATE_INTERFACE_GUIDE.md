# Merge Gate Interface - Implementation Guide

**Version**: 1.0.0  
**Date**: 2026-02-12  
**Authority**: MERGE_GATE_INTERFACE_STANDARD.md, MERGE_GATE_PHILOSOPHY.md v2.0, OPOJD v2.0  
**Status**: Active

---

## Overview

This implementation provides a **unified, explicit, and auditable merge gate interface** for the Living Agent System (LAS) v6.x.0, enforcing OPOJD v2.0 complete handover doctrine with evidence-based validation.

## Core Principle

**CI is confirmatory, NOT diagnostic.**

Agents validate locally BEFORE creating PRs. Merge gates confirm what the agent already proved.

---

## Architecture

### Standard Workflow: `merge-gate-interface.yml`

Implements MERGE_GATE_INTERFACE_STANDARD.md with three required jobs:

1. **`merge-gate/verdict`** - Evidence and gate compliance validation
2. **`governance/alignment`** - Governance artifact integrity verification
3. **`stop-and-fix/enforcement`** - Stop-and-fix doctrine compliance

### Validation Scripts: `.github/scripts/`

Reusable scripts that agents execute locally and CI runs for confirmation:

1. **`validate-scope-to-diff.sh`** - Validates SCOPE_DECLARATION.md matches git diff (BL-027)
2. **`validate-yaml.sh`** - Validates YAML syntax with zero warnings (BL-028)
3. **`check-evidence.sh`** - Checks for PREHANDOVER_PROOF evidence keywords

### Templates: `governance/templates/`

Templates for agents to create evidence artifacts:

1. **`PREHANDOVER_PROOF_TEMPLATE.md`** - Evidence capture template per OPOJD v2.0
2. **`SCOPE_DECLARATION_TEMPLATE.md`** - Scope declaration template per BL-027

---

## Agent Workflow

### Step 1: Implement Changes

Agent makes code/governance changes per assigned task.

### Step 2: Pre-Handover Validation (MANDATORY)

**Agent MUST validate ALL applicable gates locally before creating PR:**

```bash
# Gate 1: Scope-to-Diff Validation
.github/scripts/validate-scope-to-diff.sh

# Gate 2: YAML Syntax Validation (if YAML modified)
.github/scripts/validate-yaml.sh

# Gate 3: Build (if code changes)
pnpm build

# Gate 4: Tests (if code changes)
pnpm test

# Gate 5: Linting (if code changes)
pnpm lint
```

**Exit code MUST be 0 for ALL gates.** If any gate fails, agent MUST fix immediately (Stop-and-Fix).

### Step 3: Create Evidence Artifacts

**Agent MUST create two files:**

1. **`SCOPE_DECLARATION.md`** - Document all changed files
   - Use `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` as template
   - List every file modified, added, or deleted
   - Must match `git diff --name-only origin/main...HEAD` exactly (script uses origin/main with fallback to main)

2. **`PREHANDOVER_PROOF.md`** - Document all gate validations
   - Use `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` as template
   - Include: Gate name, exact command, exit code, output excerpt, timestamp
   - Document Stop-and-Fix compliance (if issues encountered)
   - Capture improvement suggestions (OPOJD v2.0 requirement)

### Step 4: Create Pull Request

Only after:
- ✅ All gates pass locally (exit code 0)
- ✅ SCOPE_DECLARATION.md created
- ✅ PREHANDOVER_PROOF.md created with all gate evidence

---

## Evidence-Based Validation Pattern

### Two Validation Modes

#### Mode 1: Evidence-Based (Preferred)

**When agent provides PREHANDOVER_PROOF.md:**

1. Gate reads PREHANDOVER_PROOF.md
2. Gate searches for gate-specific keywords
3. If found → SKIP execution, PASS gate immediately
4. **Fast, agent-proven quality**

**Benefits:**
- ✅ Faster CI execution (skips re-validation)
- ✅ Trusts agent evidence (agent already validated)
- ✅ Encourages proper pre-gate validation

#### Mode 2: Script Execution (Fallback)

**When no PREHANDOVER_PROOF found:**

1. Gate runs validation script
2. Exit code must be 0 to pass
3. **Slower, CI-validated quality**

**Used for:**
- Agent didn't provide PREHANDOVER_PROOF
- Legacy PRs before evidence-based model
- Non-agent PR contributors

---

## Scope-to-Diff Exact Set Comparison (BL-027)

### Overview

The scope-to-diff validation script performs **exact set comparison** between files changed in git diff and files declared in SCOPE_DECLARATION.md. The validation succeeds ONLY when both sets match exactly.

### Validation Logic

**Step 1: Extract Changed Files**
```bash
# Uses origin/main if available, falls back to main
git diff --name-only origin/main...HEAD | sort
```

**Step 2: Extract Declared Files**
```bash
grep -E '^\s*-\s+`[^`]+`\s+-\s+' SCOPE_DECLARATION.md | sed 's/.*`\([^`]*\)`.*/\1/' | sort
```

**Step 3: Set Comparison**
- **Missing files**: Files in git diff but NOT in SCOPE_DECLARATION.md
- **Extra files**: Files in SCOPE_DECLARATION.md but NOT in git diff
- **Success**: Zero missing files AND zero extra files

### Example: Successful Validation

```
=== Scope-to-Diff Validation (BL-027) ===
Authority: MERGE_GATE_PHILOSOPHY.md, SCOPE_TO_DIFF_RULE.md
Mode: Exact Set Comparison

✓ SCOPE_DECLARATION.md exists
✓ Found 3 changed files in git diff
✓ Found 3 files declared in SCOPE_DECLARATION.md

--- Performing Exact Set Comparison ---

✅ Exact set comparison PASSED

Summary:
  Changed files (git diff):     3
  Declared files (SCOPE_DECLARATION): 3
  Missing files:                0
  Extra files:                  0

✅ All changed files are declared in SCOPE_DECLARATION.md
✅ No extra files declared
✅ Exact match confirmed
```

### Example: Failed Validation (Missing Files)

```
❌ MISSING FILES: 2 file(s) in git diff but NOT declared in SCOPE_DECLARATION.md

The following files are changed in git but missing from SCOPE_DECLARATION.md:
   - src/utils/helper.ts
   - tests/helper.test.ts

Remediation:
  Add these files to SCOPE_DECLARATION.md in the appropriate section (Added/Modified/Deleted)
```

### Example: Failed Validation (Extra Files)

```
❌ EXTRA FILES: 1 file(s) declared in SCOPE_DECLARATION.md but NOT in git diff

The following files are declared but not present in git diff:
   - docs/old-guide.md

Remediation:
  Remove these files from SCOPE_DECLARATION.md or verify they are committed to the branch
```

### Troubleshooting

**Issue**: "Git diff is empty but SCOPE_DECLARATION.md declares N files"

**Possible causes:**
- Files listed in SCOPE_DECLARATION.md are not committed to the branch
- Wrong branch or git state
- Stale SCOPE_DECLARATION.md from previous changes

**Solution:**
1. Run `git diff --name-only origin/main...HEAD` to see actual changes (or `main...HEAD` if origin/main unavailable)
2. Verify files are committed: `git log --oneline -5 --name-only`
3. Update SCOPE_DECLARATION.md to match current branch state
4. Re-run `.github/scripts/validate-scope-to-diff.sh`

**Issue**: "Missing files reported but I listed them in SCOPE_DECLARATION.md"

**Possible causes:**
- File path in SCOPE_DECLARATION.md doesn't match actual path (typo, wrong directory)
- Missing backticks around file paths (canonical format requires backticks)
- Extra spaces or formatting issues

**Solution:**
1. Check exact file path: `git diff --name-only origin/main...HEAD | grep filename` (or `main...HEAD` if origin/main unavailable)
2. Ensure canonical format: `` - `path/to/file.ext` - Description ``
3. Verify no typos in path (case-sensitive)
4. Copy-paste exact path from git diff output

**Issue**: "Extra files reported but they are changed"

**Possible causes:**
- Files not staged or committed yet
- Files in .gitignore (won't appear in git diff)
- Files only in working directory

**Solution:**
1. Stage and commit changes: `git add . && git commit -m "message"`
2. Verify files committed: `git diff --name-only origin/main...HEAD` (or `main...HEAD` if origin/main unavailable)
3. Update SCOPE_DECLARATION.md to match committed files
4. Re-run validation

### Best Practices

1. **Create SCOPE_DECLARATION.md FIRST** before finalizing PR
   - Use `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` as template
   
2. **Use canonical format** for file declarations:
   ```markdown
   - `path/to/file.ext` - Brief description
   ```

3. **Copy paths from git diff** to avoid typos:
   ```bash
   # Uses origin/main if available, falls back to main
   git diff --name-only origin/main...HEAD | sort
   ```

4. **Validate immediately** after creating SCOPE_DECLARATION.md:
   ```bash
   .github/scripts/validate-scope-to-diff.sh
   ```

5. **Document in PREHANDOVER_PROOF** with exact command and output:
   ```markdown
   ### Gate 1: Scope-to-Diff Validation (BL-027)
   
   **Command Executed**:
   ```bash
   .github/scripts/validate-scope-to-diff.sh
   ```
   
   **Exit Code**: 0
   
   **Summary**: Exact set comparison passed. All 3 changed files declared, no extra files.
   ```

---

## Gate Keywords

For evidence-based validation, PREHANDOVER_PROOF must contain these keywords:

| Gate | Keywords |
|------|----------|
| Scope-to-Diff | `"Scope Declaration"` OR `"scope-to-diff"` |
| YAML Validation | `"yamllint"` OR `"YAML"` |
| Build Success | `"build"` OR `"compilation"` |
| Test Execution | `"test"` OR `"100% GREEN"` |
| Linting | `"lint"` OR `"zero warnings"` |
| Governance Integrity | `"Governance.*Integrity"` OR `"artifact.*validation"` |

---

## Gate Failure Handling

### If Gate Fails During Agent Validation

1. **Stop-and-Fix**: Agent fixes issue immediately
2. **Re-validate**: Agent re-runs ALL gates after fix
3. **Document**: Agent documents fix iterations in PREHANDOVER_PROOF
4. **Escalate**: If unable to resolve after 3 attempts → Escalate to FM

### If Gate Fails in CI (After PR Creation)

This indicates agent didn't validate properly before handover:

1. **Classification**: Gate failure = agent coordination gap, not gate defect
2. **Response**: Work returned to agent for completion
3. **Re-education**: Agent re-trained on pre-handover validation requirements

---

## Prohibited Behaviors

**Agents CANNOT:**
- ❌ Create PR without running gate scripts locally
- ❌ Provide PREHANDOVER_PROOF without actual command execution
- ❌ Claim "CI will validate" instead of local validation
- ❌ Hand over with known gate failures expecting "CI to catch them"
- ❌ Skip gate validation due to "script complexity"
- ❌ Use mental validation instead of script execution

**Required Behaviors:**
- ✅ Proactively enumerate all applicable gates
- ✅ Find and execute gate validation scripts
- ✅ Document results completely in PREHANDOVER_PROOF
- ✅ Escalate if gate script broken/unclear (not skip)

---

## Integration with Canonical Governance

### Constitutional Authority

This implementation enforces:

- **MERGE_GATE_PHILOSOPHY.md v2.0** - Pre-handover gate duplication mandate
- **OPOJD v2.0** - Complete job handover doctrine
- **MERGE_GATE_INTERFACE_STANDARD.md** - Standard workflow interface
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent-specific gate requirements
- **PR_GATE_PRECONDITION_RULE.md** - No handover without green gates
- **STOP_AND_FIX_DOCTRINE.md** - Zero tolerance for defects

### Foreman Authority

Per FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md:

- **FM owns merge gate readiness** (not builders)
- FM may fix gate misalignments autonomously (within authority)
- FM MUST escalate gate issues requiring CS2 approval
- Merge gate failures = FM coordination gaps (not builder defects)

---

## Examples

### Example 1: Complete PREHANDOVER_PROOF (CORRECT)

```markdown
### Gate 1: Scope-to-Diff Validation (BL-027)

**Status**: ✅ PASS

**Command Executed**:
```bash
.github/scripts/validate-scope-to-diff.sh
```

**Exit Code**: 0

**Output**:
```
✅ Scope-to-Diff validation PASSED
   All changed files documented in SCOPE_DECLARATION.md
```

**Timestamp**: 2026-02-12 16:30:00 UTC
```

### Example 2: Incomplete Evidence (VIOLATION)

```markdown
### Gate 1: Scope-to-Diff

I validated the scope declaration and it looks good.
```

❌ **VIOLATION**: No command executed, no exit code, no actual output, no timestamp.

---

## Troubleshooting

### "Gate failed but I tested locally"

**Possible causes:**
- Different environment (dependencies, versions)
- Didn't run exact command from validation script
- Ran partial validation, not full gate script

**Solution:**
- Run EXACT command from `.github/scripts/validate-*.sh`
- Verify exit code is 0 (not just "looks good")
- Document actual command output in PREHANDOVER_PROOF

### "I don't know which gates apply to my PR"

**Solution:**
- Check `.github/agents/foreman-isms-agent.md` Category 4.5
- Universal gates: scope-to-diff, YAML (all PRs)
- Code gates: build, test, lint (code PRs only)
- Governance gates: artifact integrity (governance PRs only)

### "Gate script is broken"

**Solution:**
- DO NOT skip gate validation
- Coordinate with FM per CROSS_AGENT_COORDINATION_PROTOCOL.md
- FM reviews and fixes gate (or escalates to CS2)
- Agent WAITS for fix, then validates
- Agent completes job AFTER gate validation succeeds

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-12 | Initial implementation of unified merge gate interface |

---

## References

### Canonical Governance
- `governance/canon/MERGE_GATE_PHILOSOPHY.md` v2.0 - Philosophy and patterns
- `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` - Interface standard
- `governance/canon/FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` - FM gate authority
- `governance/canon/AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md` - Agent requirements
- `governance/opojd/OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md` v2.0 - Complete handover
- `governance/policy/PR_GATE_FAILURE_HANDLING_PROTOCOL.md` - Failure handling

### Implementation
- `.github/workflows/merge-gate-interface.yml` - Unified workflow
- `.github/scripts/*.sh` - Validation scripts
- `governance/templates/*.md` - Evidence templates

### Agent Contracts
- `.github/agents/foreman-isms-agent.md` Category 4.5 - Gate declarations

---

**Authority**: MERGE_GATE_INTERFACE_STANDARD.md, MERGE_GATE_PHILOSOPHY.md v2.0, OPOJD v2.0  
**Status**: Active and Enforced  
**Compliance**: Living Agent System v6.x.0
