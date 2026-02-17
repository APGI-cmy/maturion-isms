# RCA — Wave 5.5 Agent Contract Deviation (2026-02-17)

## Deviation Summary
**Wave**: 5.5 (Frontend Application Assembly)  
**Date**: 2026-02-17  
**Severity**: HIGH (governance violation, build delay)  
**Impact**: 1 PR closed, 3 issues created, ~2 hours wasted, governance transgression  
**Status**: RESOLVED (PR #291 merged, ui-builder available, PR #293 correct approach)

---

## What Happened (Timeline)

1. **2026-02-17 11:00**: Issue #287 created for Wave 5.5 implementation
2. **2026-02-17 11:15**: PR #288 created using **generic coding agent** (WRONG)
   - Foreman agent did NOT supervise
   - ui-builder was NOT used (despite being assigned in implementation plan)
   - Generic coding agent attempted to write production code directly
3. **2026-02-17 11:30**: User detected governance violation
   - Foreman MUST supervise builders (POLC model)
   - Generic coding agents prohibited from production code
   - Wrong agent architecture = constitutional violation
4. **2026-02-17 11:45**: PR #288 CLOSED with governance transgression comment
5. **2026-02-17 12:00**: Root cause investigation revealed:
   - ui-builder agent file present (`.github/agents/ui-builder.md`)
   - ui-builder NOT appearing in GitHub agent selection list
   - YAML frontmatter issue suspected (non-standard `assigned_waves` field)
6. **2026-02-17 12:15**: Issue #290 created (agent discovery bug)
7. **2026-02-17 12:30**: PR #291 created (fix ui-builder YAML frontmatter)
8. **2026-02-17 13:00**: Issue #292 created (resubmit Wave 5.5 with correct agent)
9. **2026-02-17 13:15**: PR #293 created using **Foreman agent** (CORRECT)
   - Foreman supervises using POLC model
   - ui-builder assigned as implementation agent
   - Governance compliance from start

---

## Root Cause Analysis (5 Whys)

### **Why did we use the wrong agent?**
→ ui-builder was not available in GitHub agent selection list

### **Why was ui-builder not available?**
→ ui-builder agent file had YAML frontmatter issue preventing GitHub recognition

### **Why did the YAML frontmatter have an issue?**
→ `assigned_waves` field was included (non-standard field, breaks GitHub Copilot parser)

### **Why was a non-standard field included?**
→ Agent contract template included Wave assignments in YAML metadata instead of body text

### **Why didn't we detect this before Wave 5.5?**
→ **NO PRE-FLIGHT AGENT AVAILABILITY CHECK** before wave execution

---

## Root Root Cause (Governance Gap)

**MISSING GOVERNANCE PROTOCOL**: No mandatory pre-flight check for builder agent availability before Foreman starts wave execution.

**Consequence**: Foreman cannot execute POLC supervision if assigned builder is unavailable in agent list.

---

## Impact Assessment

### **Time Wasted**
- PR #288 creation and closure: 30 minutes
- RCA and issue creation: 30 minutes
- PR #291 creation (ui-builder fix): 45 minutes
- PR #293 resubmission: 15 minutes
- **Total**: ~2 hours build delay

### **Governance Violations**
1. ❌ Generic coding agent used for production code (constitutional violation)
2. ❌ Foreman did not supervise builder (POLC model violation)
3. ❌ Wrong agent architecture (Living Agent System v6.2.0 violation)

### **Rework Required**
- 1 PR closed (wasted work)
- 3 issues created (tracking overhead)
- 1 agent contract fix PR (governance remediation)
- 1 wave resubmission PR (correct approach)

### **Risk**
- Pattern could repeat in future waves if not documented
- Other builder agents may have same YAML frontmatter issue
- Future builds may waste time on same root cause

---

## Remediation Actions Taken

### **Immediate (Completed)**
1. ✅ PR #288 closed with governance violation comment
2. ✅ Issue #290 created (agent discovery bug)
3. ✅ PR #291 created (fix ui-builder YAML frontmatter)
4. ✅ Issue #292 created (resubmit Wave 5.5 correctly)
5. ✅ PR #293 created using Foreman agent with POLC supervision

### **Short-Term (In Progress)**
1. 🟡 Verify all builder agents appear in GitHub agent list
2. 🟡 Audit all builder agent YAML frontmatter for non-standard fields
3. 🟡 Document YAML frontmatter compliance requirements in governance

---

## Prevention Measures (MUST IMPLEMENT)

### **1. Pre-Flight Agent Availability Check (MANDATORY)**

**New Governance Protocol**: `governance/canon/FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md`

**Requirement**: Before Foreman starts any wave, MUST verify all assigned builder agents are available in GitHub agent selection list.

**Checklist**:
```markdown
## Pre-Wave Authorization Gate — Agent Availability Check

- [ ] Review wave task assignments from implementation plan
- [ ] Identify all builder agents required for wave
- [ ] Verify EACH builder agent appears in GitHub agent selection list
- [ ] If ANY builder unavailable:
  - [ ] HALT wave execution
  - [ ] Create issue: Agent discovery failure
  - [ ] Investigate YAML frontmatter compliance
  - [ ] Fix agent contract
  - [ ] Re-verify agent availability
  - [ ] Resume wave execution ONLY after all builders available
```

**Authority**: This checklist becomes LOCKED section in Foreman agent contract

---

### **2. Builder Agent Contract Validation (MANDATORY)**

**New Governance Protocol**: `governance/specs/BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md`

**Requirement**: All builder agent contracts MUST use only documented, GitHub-compatible YAML frontmatter fields.

**Prohibited Fields** (breaks GitHub Copilot parser):
- ❌ `assigned_waves` (wave assignments belong in body, not YAML)
- ❌ Custom metadata fields not in canonical schema
- ❌ Non-standard nested structures

**Permitted Fields** (GitHub-compatible):
```yaml
id: [agent-id]
description: [brief description]
agent:
  id: [agent-id]
  class: [builder|liaison|advisor|foreman]
  version: [semantic version]
  contract_version: [semantic version]
governance:
  protocol: LIVING_AGENT_SYSTEM
  canon_inventory: governance/CANON_INVENTORY.json
merge_gate_interface:
  required_checks: [list]
scope:
  repository: [owner/repo]
  read_access: [paths]
  write_access: [paths]
prohibitions: [list]
metadata:
  canonical_home: [repo]
  authority: CS2
  last_updated: [date]
```

**Enforcement**: Merge gate validation of builder agent contracts

---

### **3. Post-Recruitment Verification (MANDATORY)**

**Updated Foreman POLC Protocol**:

**After recruiting builder, Foreman MUST**:
1. Verify builder agent appears in active session agent list
2. Verify builder agent contract loaded (check for recognition errors)
3. If builder not recognized:
   - HALT immediately
   - Escalate to CS2
   - Do NOT substitute with generic coding agent
   - Do NOT proceed with wave until builder available

---

### **4. Learning Loop Entry (COMPLETED)**

**File**: `governance/memory/BOOTSTRAP_EXECUTION_LEARNINGS.md`

**Entry**:
```markdown
## BL-030: Pre-Flight Builder Agent Availability Check (2026-02-17)

**Context**: Wave 5.5 execution attempted with ui-builder agent that was not available in GitHub agent list due to YAML frontmatter non-standard field.

**Failure**: Generic coding agent used instead, violating Foreman supervision model and Living Agent System architecture.

**Learning**: Foreman MUST verify all assigned builders are available in agent list BEFORE starting wave execution.

**Prevention**:
1. LOCKED section in Foreman contract: Pre-Wave Agent Availability Check
2. YAML frontmatter compliance spec for builder contracts
3. Merge gate validation of builder agent YAML
4. Post-recruitment verification protocol

**Authority**: RCA_WAVE_5.5_AGENT_CONTRACT_DEVIATION.md

**Status**: CANONICAL (must ripple to all consumer repos)
```

---

## Evidence References

**Issues**:
- Issue #287: [FRONTEND] Wave 5.5 — MAT Frontend Application Assembly
- Issue #290: [BUG] ui-builder agent file present but missing from agent list
- Issue #292: [FRONTEND] Wave 5.5 — MAT Frontend Application Assembly (RESUBMISSION)

**Pull Requests**:
- PR #288: [WIP] Implement Wave 5.5 frontend application assembly (CLOSED - governance violation)
- PR #291: [WIP] Fix ui-builder agent missing from agent list (MERGED)
- PR #293: [WIP] Implement Wave 5.5 for MAT frontend application assembly (CORRECT)

**RCA Documents**:
- This document: `modules/mat/05-build-evidence/RCA_WAVE_5.5_AGENT_CONTRACT_DEVIATION.md`

**Governance Updates**:
- BL-030: Pre-Flight Builder Agent Availability Check
- FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md (to be created)
- BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md (to be created)

---

## Post-Mortem Lessons (FOR NEXT BUILD)

### **NEVER REPEAT**
1. ❌ NEVER start wave without verifying builder agent availability
2. ❌ NEVER use generic coding agent as builder substitute
3. ❌ NEVER bypass Foreman supervision model
4. ❌ NEVER include non-standard YAML frontmatter fields in agent contracts

### **ALWAYS DO**
1. ✅ ALWAYS run pre-flight agent availability check before wave starts
2. ✅ ALWAYS validate builder agent YAML frontmatter compliance
3. ✅ ALWAYS verify builder recognition after recruitment
4. ✅ ALWAYS halt and escalate if builder unavailable (no substitutions)
5. ✅ ALWAYS document deviations with RCA for learning loops

---

**Severity**: HIGH (governance violation)  
**Recurrence Risk**: MEDIUM (without prevention measures)  
**Recurrence Risk (with prevention)**: LOW  
**Authority**: CS2 (CodexAdvisor acting as CS2)  
**Date**: 2026-02-17  
**Status**: RESOLVED (prevention measures documented, awaiting canonization)

---

**END OF RCA**
