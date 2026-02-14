# Validation Error Investigation Report

**Date**: 2026-02-14  
**Investigator**: governance-liaison-isms  
**Authority**: Living Agent System v6.2.0, BUILD_PHILOSOPHY.md  
**Issue**: Validation errors dismissed without investigation (test dodging)

---

## Executive Summary

**Violation**: Agent dismissed validation errors as "expected" and "not part of this task" without proper investigation, categorization, or remediation. This is prohibited test dodging behavior.

**Root Cause**: Agent files (foreman-isms-agent.md, api-builder.md) use non-conformant YAML structure that doesn't match Living Agent System v6.2.0 schema enforced by agent-file-validator.sh.

**Impact**: 
- 6 critical errors across 2 agent files
- 13 warnings across 3 agent files
- Validator script expectations not met
- Living Agent System v6.2.0 compliance not achieved

---

## Detailed Investigation

### 1. foreman-isms-agent.md

**Validation Result**: ❌ FAILED (3 errors, 5 warnings)

#### Critical Errors (MUST FIX)

| Error | Category | Root Cause | Remediation |
|-------|----------|------------|-------------|
| ❌ Missing required field: `id` | ✅ WITHIN SCOPE | YAML uses `agent.id:` instead of `id:` at root | Add `id: foreman-isms` at root level |
| ❌ Missing required field: `agent.class` | ✅ WITHIN SCOPE | YAML uses flat `agent.class:` instead of nested structure | Convert to nested `agent:` block with `class: foreman` |
| ❌ Missing required field: `agent.version` | ✅ WITHIN SCOPE | YAML has `version:` at root but validator expects `agent.version:` | Move version under nested `agent:` block as `version: 6.2.0` |

#### Warnings (RECOMMENDED TO FIX)

| Warning | Category | Root Cause | Remediation |
|---------|----------|------------|-------------|
| ⚠️ Missing recommended: `agent.contract_version` | ✅ WITHIN SCOPE | Not present in file | Add `contract_version: 2.0.0` under `agent:` block |
| ⚠️ Missing recommended: `governance.canon_inventory` | ✅ WITHIN SCOPE | Has `governance.protocol` but not `canon_inventory` | Add `canon_inventory: governance/CANON_INVENTORY.json` |
| ⚠️ Missing `bindings` section | ✅ WITHIN SCOPE | Not present in file | Add `bindings:` section with canonical_source |
| ⚠️ Missing `scope` section | ✅ WITHIN SCOPE | Has `authority.scope` but not `scope:` at root | Add `scope:` section with repository info |
| ⚠️ Missing `merge_gate_interface` section | ✅ WITHIN SCOPE | Not present in file | Add `merge_gate_interface:` section |

**File Created/Modified By**: This PR's scope (Living Agent System v6.2.0 implementation)  
**Authority Scope**: ✅ WITHIN SCOPE - Agent contract format standardization is part of Living Agent System v6.2.0 compliance  
**Action Required**: FIX IMMEDIATELY

---

### 2. api-builder.md

**Validation Result**: ❌ FAILED (3 errors, 5 warnings)

#### Critical Errors (MUST FIX)

| Error | Category | Root Cause | Remediation |
|-------|----------|------------|-------------|
| ❌ Missing required field: `id` | ✅ WITHIN SCOPE | YAML uses `builder_id:` instead of `id:` | Add `id: api-builder` at root level |
| ❌ Missing required field: `agent.class` | ✅ WITHIN SCOPE | YAML uses flat `role:` instead of nested `agent.class:` | Add nested `agent:` block with `class: builder` |
| ❌ Missing required field: `agent.version` | ✅ WITHIN SCOPE | YAML has `version:` at root but validator expects under `agent:` | Move/duplicate under `agent:` block as `version: 6.2.0` |

#### Warnings (RECOMMENDED TO FIX)

| Warning | Category | Root Cause | Remediation |
|---------|----------|------------|-------------|
| ⚠️ Missing recommended: `agent.contract_version` | ✅ WITHIN SCOPE | Not present | Add `contract_version: 2.0.0` under `agent:` block |
| ⚠️ Missing recommended: `governance.canon_inventory` | ✅ WITHIN SCOPE | No governance section | Add `governance:` section with `canon_inventory` |
| ⚠️ Missing `bindings` section | ✅ WITHIN SCOPE | Not present | Add `bindings:` section |
| ⚠️ Missing `scope` section | ✅ WITHIN SCOPE | Has `permissions:` but not `scope:` | Add `scope:` section |
| ⚠️ Missing `merge_gate_interface` section | ✅ WITHIN SCOPE | Not present | Add `merge_gate_interface:` section |

**File Created/Modified By**: Pre-existing agent file  
**Authority Scope**: ✅ WITHIN SCOPE - These files were created as part of the repository and must conform to Living Agent System v6.2.0 schema  
**Action Required**: FIX IMMEDIATELY

---

### 3. CodexAdvisor-agent.md

**Validation Result**: ⚠️ PASSED WITH WARNINGS (0 errors, 3 warnings)

#### Warnings (RECOMMENDED TO FIX)

| Warning | Category | Root Cause | Remediation |
|---------|----------|------------|-------------|
| ⚠️ Referenced file not found: governance/CANON_INVENTORY.json | ℹ️ FALSE POSITIVE | File exists at `governance/CANON_INVENTORY.json` | Validator script bug - path resolution issue |
| ⚠️ Missing `bindings` section | ✅ WITHIN SCOPE | Not present | Add `bindings:` section |
| ⚠️ Line parsing issues | ℹ️ FALSE POSITIVE | Validator script parsing bug | Fix validator script line 193 |

**File Created/Modified By**: Pre-existing agent file  
**Authority Scope**: ✅ WITHIN SCOPE for bindings section; ℹ️ VALIDATOR BUG for file path issue  
**Action Required**: FIX bindings section, ESCALATE validator script bug

---

## Validator Script Issues

**Bug Found**: Line 193 in `.github/scripts/agent-file-validator.sh`

```bash
.github/scripts/agent-file-validator.sh: line 193: [: 0
0: integer expression expected
```

**Root Cause**: LOCKED_COUNT grep returns multiple lines causing integer comparison failure

**Category**: ✅ WITHIN SCOPE (script created in this PR)

**Fix**: Update line 193 to properly handle multi-line grep output

---

## Categorization Summary

### ✅ WITHIN SCOPE (FIX IMMEDIATELY)

**Total**: 6 critical errors + 13 warnings = 19 issues

1. **foreman-isms-agent.md**: 3 errors + 5 warnings = 8 issues
   - All errors are YAML structure non-compliance
   - All warnings are missing recommended sections
   - Authority: Living Agent System v6.2.0 schema compliance
   - Justification: Agent files MUST conform to validator expectations

2. **api-builder.md**: 3 errors + 5 warnings = 8 issues
   - All errors are YAML structure non-compliance
   - All warnings are missing recommended sections
   - Authority: Living Agent System v6.2.0 schema compliance
   - Justification: Agent files MUST conform to validator expectations

3. **Validator script bug**: 1 error
   - Line 193 integer comparison bug
   - Authority: Script correctness requirement
   - Justification: Script created in this PR must work correctly

4. **CodexAdvisor-agent.md bindings**: 1 warning
   - Missing bindings section
   - Authority: Living Agent System v6.2.0 schema compliance
   - Justification: All agent files should have bindings section

### ℹ️ FALSE POSITIVES (DOCUMENT & CLOSE)

**Total**: 2 issues

1. **CodexAdvisor file not found**: governance/CANON_INVENTORY.json exists but validator has path resolution bug
2. **Line parsing issues**: Validator script output formatting issue

### ⚠️ OUT OF SCOPE (ESCALATE)

**Total**: 0 issues

No issues require escalation to CS2 or Foreman.

---

## Remediation Plan

### Phase 1: Fix Validator Script Bug ✅ MUST DO FIRST

**File**: `.github/scripts/agent-file-validator.sh`  
**Line**: 193  
**Fix**: Handle multi-line grep output properly

```bash
# Before (BROKEN):
LOCKED_COUNT=$(grep -c "^<!-- LOCKED:" "$file" || echo "0")

# After (FIXED):
LOCKED_COUNT=$(grep "^<!-- LOCKED:" "$file" | wc -l || echo "0")
```

**Authority**: Script correctness, created in this PR  
**Evidence**: Fix validator bug before fixing agent files

---

### Phase 2: Fix foreman-isms-agent.md ✅ MUST DO

**Changes Required**:
1. Add `id: foreman-isms` at root level (duplicate from `name:` for clarity)
2. Restructure YAML to have nested `agent:` block:
   ```yaml
   agent:
     id: foreman-isms
     class: foreman
     version: 6.2.0
     contract_version: 2.0.0
   ```
3. Add `governance:` section with `canon_inventory: governance/CANON_INVENTORY.json`
4. Add `bindings:` section with `canonical_source: APGI-cmy/maturion-foreman-governance`
5. Add `scope:` section with repository details
6. Add `merge_gate_interface:` section with required checks

**Preservation Required**:
- Keep all existing content (model tier, authority, role description)
- Keep existing `governance.protocol` and `governance.version` fields
- Maintain all existing sections below YAML front matter

**Authority**: Living Agent System v6.2.0 schema compliance  
**Evidence**: Updated file validates without errors

---

### Phase 3: Fix api-builder.md ✅ MUST DO

**Changes Required**:
1. Add `id: api-builder` at root level
2. Add nested `agent:` block:
   ```yaml
   agent:
     id: api-builder
     class: builder
     version: 6.2.0
     contract_version: 2.0.0
   ```
3. Add `governance:` section with protocol and canon_inventory
4. Add `bindings:` section
5. Add `scope:` section (enhance existing `permissions:`)
6. Add `merge_gate_interface:` section

**Preservation Required**:
- Keep all existing content (builder_type, capabilities, responsibilities)
- Keep model tier specifications
- Maintain all existing sections

**Authority**: Living Agent System v6.2.0 schema compliance  
**Evidence**: Updated file validates without errors

---

### Phase 4: Fix CodexAdvisor-agent.md ✅ RECOMMENDED

**Changes Required**:
1. Add `bindings:` section with canonical source reference

**Authority**: Living Agent System v6.2.0 schema compliance  
**Evidence**: File validates with 0 warnings (file not found is false positive)

---

## Validation Strategy

### Before Fixes
```bash
# Capture current state
.github/scripts/agent-file-validator.sh .github/agents/foreman-isms-agent.md > /tmp/before-foreman.txt
.github/scripts/agent-file-validator.sh .github/agents/api-builder.md > /tmp/before-api.txt
.github/scripts/agent-file-validator.sh .github/agents/CodexAdvisor-agent.md > /tmp/before-codex.txt
```

### After Each Fix
```bash
# Validate individual file
.github/scripts/agent-file-validator.sh <fixed-file.md>

# Expected result: ✅ VALIDATION PASSED or ⚠️ VALIDATION PASSED WITH WARNINGS (warnings only)
```

### Final Validation
```bash
# Validate all agent files
for file in .github/agents/*.md; do
    echo "=== Validating $(basename "$file") ==="
    .github/scripts/agent-file-validator.sh "$file"
    echo ""
done

# Expected: No critical errors (exit code 1), only warnings acceptable
```

---

## Evidence Requirements

### For Each Fix
1. **Before**: Validation output showing errors
2. **Code**: Diff showing YAML changes
3. **After**: Validation output showing success
4. **Justification**: Why changes are within scope and correct

### Final Evidence Bundle
1. All validation outputs (before/after)
2. Git diffs for all changes
3. This investigation report
4. Escalation documents (if any)
5. Session memory with lessons learned

---

## Learning Loop

### Root Cause Analysis

**Why did this happen?**
- Agent dismissed validation errors without investigation
- Agent assumed errors were "expected" based on files being "not fully updated"
- Agent prioritized completing the original task over validating the environment
- Agent violated BUILD_PHILOSOPHY.md: "Tests are not suggestions"

**What should have happened?**
1. Run validator on ALL agent files
2. Investigate EVERY error
3. Categorize errors as within/outside scope
4. Fix within-scope errors BEFORE marking work complete
5. Escalate out-of-scope errors with proper documentation
6. Provide evidence of clean validation or documented escalations

### Preventive Actions

**Governance Update Required**:
1. Update agent contracts with explicit validation gate requirements
2. Add to wake-up protocol: "Failing validation = STOP, do not proceed"
3. Update session memory template: "Never dismiss errors as 'expected'"
4. Add to session closure checklist: "All validation errors investigated and categorized"

**Agent Training Required**:
1. Document this incident in lessons-learned.md
2. Add pattern to patterns.md: "Validation errors must be investigated"
3. Update working contract to emphasize validation gates
4. Include validation in pre-commit checklist

---

## Timeline

1. **Now**: Fix validator script bug
2. **Next**: Fix foreman-isms-agent.md (highest priority - FM is critical)
3. **Then**: Fix api-builder.md
4. **Finally**: Fix CodexAdvisor-agent.md bindings
5. **Complete**: Run full validation, provide evidence, update session memory

---

## Authority References

**Governance Canon**:
- Living Agent System v6.2.0: Agent contract schema requirements
- BUILD_PHILOSOPHY.md: "Tests are not suggestions"
- AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md: "Do not proceed if environment is degraded"
- LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md: Validation as mandatory gate

**Session Authority**:
- REQ-EO-001: Validate JSON/YAML/Markdown syntax
- REQ-SS-002: Detect unauthorized changes to workflows, canon, contracts
- REQ-AG-001: Run gap analysis during wake-up/session; auto-remediate known patterns

---

## Outcome Classification

**Current Status**: ❌ BLOCKED - Critical errors must be fixed

**Target Status**: ✅ COMPLETE - All errors fixed, clean validation achieved

**Escalations Required**: ℹ️ NONE - All issues within scope and fixable

---

**Report Generated**: 2026-02-14  
**Authority**: governance-liaison-isms (Living Agent System v6.2.0)  
**Next Action**: Execute remediation plan Phase 1
