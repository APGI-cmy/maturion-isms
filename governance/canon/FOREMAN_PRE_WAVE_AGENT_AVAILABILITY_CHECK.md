# Foreman Pre-Wave Agent Availability Check Protocol

**Type**: PUBLIC_API TIER-0  
**Version**: 1.0.0  
**Effective Date**: 2026-02-17  
**Authority**: Supreme - Canonical  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Purpose**: Define mandatory pre-flight agent availability check protocol for all wave executions

---

## 1. Purpose

This protocol establishes the **mandatory pre-flight agent availability check** that Foreman agents MUST execute before starting any wave execution.

This check prevents:
- Wave execution with unavailable builder agents
- Substitution of generic coding agents for specialized builders
- Governance violations through agent bypass
- Wasted time and rework from incorrect agent assignments
- Constitutional sandbox violations

**Authority**: BL-031 (Agent Discovery Failure - Wave 5.5)

---

## 2. Scope

This protocol applies to:
- **ALL Foreman agents** across the Maturion ecosystem
- **ALL wave executions** (Wave 0 through Wave N)
- **ALL builder assignments** (api-builder, ui-builder, qa-builder, schema-builder, integration-builder, etc.)

This protocol does NOT apply to:
- Non-wave Foreman operations (governance maintenance, ripple, etc.)
- Agent operations that do not require builder delegation
- Emergency CS2-authorized override scenarios (must be documented)

---

## 3. Core Requirements

### 3.1 Pre-Wave Authorization Gate

**MANDATORY**: Before starting ANY wave execution, Foreman MUST:

1. **Review Wave Plan**
   - Load wave plan from implementation plan artifact
   - Identify ALL wave steps and assignments
   - Extract list of required builder agents

2. **Verify Builder Availability**
   - For EACH required builder agent:
     - Check presence in GitHub Copilot agent selection list
     - Verify agent file exists at correct path (`.github/agents/[builder-name].agent.md`)
     - Confirm YAML frontmatter is valid and GitHub-compatible
   - Document verification results

3. **Halt on Missing Builders**
   - If ANY required builder is unavailable in agent selection list:
     - **HALT wave execution immediately** (do NOT proceed)
     - **DO NOT substitute** with generic coding agent
     - **DO NOT substitute** with different builder type
     - Follow escalation protocol (Section 4)

4. **Document Verification**
   - Record agent availability check in wave planning evidence
   - Include verification timestamp
   - List all verified builders
   - Note any issues detected and resolved

### 3.2 Verification Evidence

**Required Evidence Fields**:
```markdown
## Pre-Wave Agent Availability Check

**Date**: YYYY-MM-DD HH:MM:SS UTC  
**Wave**: [Wave number and description]  
**Foreman**: [Foreman agent identifier]

### Required Builders
- [ ] api-builder (verified in agent list: YES/NO)
- [ ] ui-builder (verified in agent list: YES/NO)
- [ ] qa-builder (verified in agent list: YES/NO)
- [ ] schema-builder (verified in agent list: YES/NO)
- [ ] integration-builder (verified in agent list: YES/NO)

### Verification Status
✅ ALL required builders available - Wave authorized to proceed
OR
❌ [N] builders unavailable - Wave HALTED, escalation initiated

### Issues Detected
[List any YAML, file location, or recognition issues]

### Evidence Attachments
- Screenshot of GitHub agent selection list
- Builder contract file paths verified
- YAML frontmatter validation results
```

---

## 4. Escalation Protocol

### 4.1 Builder Unavailable - Immediate Actions

When a required builder is detected as unavailable:

**Step 1: HALT Wave Execution**
- Stop all wave planning and execution activities
- Do NOT create builder task assignments
- Do NOT proceed with workarounds

**Step 2: Create Discovery Failure Issue**

Create issue with template:
```markdown
Title: [BUG][LIVING AGENT] [builder-name] agent file present but missing from agent list

## Summary
Required builder agent `[builder-name]` is present in `.github/agents/` but NOT visible in GitHub Copilot agent selection list.

## Context
- **Wave**: [Wave number]
- **Repository**: [repo name]
- **Agent File**: `.github/agents/[builder-name].agent.md`
- **Detection**: Pre-wave agent availability check (FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md v1.0.0)

## Investigation Required
- [ ] Verify YAML frontmatter compliance (BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md)
- [ ] Check file location and permissions
- [ ] Validate GitHub Copilot parser compatibility
- [ ] Review agent contract for non-standard fields

## Impact
- Wave execution HALTED
- Cannot proceed until builder available
- Governance violation risk if bypassed

## Evidence
- [Attach screenshot of agent list showing missing builder]
- [Attach agent contract file content]
- [Attach YAML validation results]

## Assignment
- **Assignee**: CS2 (constitutional agent contract authority)
- **Priority**: HIGH (blocking wave execution)

## References
- BL-031: Pre-Flight Builder Agent Availability Check
- FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md v1.0.0
- BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md
```

**Step 3: Wait for Fix**
- Wait for CS2 to investigate and fix agent contract
- Wait for fix PR to merge
- Do NOT attempt workarounds

**Step 4: Re-verify and Resume**
- After fix PR merges, re-run agent availability check
- Verify builder now appears in agent selection list
- Document resolution in wave planning evidence
- Resume wave execution ONLY after verification passes

### 4.2 Prohibited Actions

**NEVER** do any of the following when a builder is unavailable:

❌ **Start wave execution** with missing builders  
❌ **Substitute generic coding agent** for missing specialized builder  
❌ **Substitute different builder type** (e.g., api-builder for ui-builder)  
❌ **Proceed with "workaround" agents**  
❌ **Skip or defer agent availability check**  
❌ **Create builder task assignments** before verification passes

**Consequence**: Governance violation, potential CATASTROPHIC FAILURE if pattern repeats (BL-031)

---

## 5. GitHub Agent List Verification Procedure

### 5.1 Manual Verification (Current Standard)

Until automated verification is available:

1. **Access GitHub Copilot Agent Selection**
   - Open GitHub Copilot workspace for target repository
   - Navigate to agent selection interface
   - View list of available agents

2. **Visual Inspection**
   - Locate each required builder in agent list
   - Verify agent name matches expected identifier
   - Take screenshot as evidence

3. **Document Results**
   - Record verification timestamp
   - List verified agents
   - Attach screenshot to wave planning evidence

### 5.2 Automated Verification (Future Enhancement)

Recommended future enhancement:
- GitHub API or CLI query for agent list
- Automated comparison with required builders
- Deterministic pass/fail result
- Integration into merge gate validation

---

## 6. YAML Frontmatter Compliance Requirements

### 6.1 GitHub Copilot Parser Compatibility

All builder agent contracts MUST:
- Use standard YAML frontmatter delimiters (`---`)
- Include only GitHub-compatible fields
- Follow BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md

### 6.2 Prohibited Fields

**NEVER include** non-standard fields that break GitHub parser:
- ❌ `assigned_waves` (non-standard metadata)
- ❌ Custom metadata fields not in spec
- ❌ Fields not documented in AGENT_FILE_SCHEMA.md

**Root Cause (BL-031)**: ui-builder contract included `assigned_waves` field, causing GitHub parser to reject file and hide agent from selection list.

### 6.3 Validation Requirements

Before any PR modifying builder agent contracts merges:
- Validate YAML frontmatter against compliance spec
- Test agent recognition in GitHub agent list
- Verify no non-standard fields present
- Document validation results

---

## 7. Integration with Foreman Agent Contracts

### 7.1 LOCKED Section Requirement

ALL Foreman agent contracts MUST include LOCKED section:

```markdown
## 🔒 Pre-Wave Authorization Gate — Agent Availability Check (LOCKED)

**Authority**: FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md v1.0.0  
**Learning**: BL-031 (Agent Discovery Failure)  
**Priority**: FM_H (Foreman High - Constitutional Mandate)

**MANDATORY BEFORE WAVE EXECUTION**:

Before starting ANY wave, Foreman MUST verify all assigned builder agents are available:

1. [ ] Review wave task assignments from implementation plan
2. [ ] Identify all builder agents required
3. [ ] Verify EACH builder appears in GitHub agent selection list
4. [ ] If ANY builder unavailable:
   - [ ] HALT wave execution (do NOT proceed)
   - [ ] Create issue: "[BUG][LIVING AGENT] [builder-name] agent file present but missing from agent list"
   - [ ] Investigate: YAML frontmatter compliance, file location, GitHub recognition
   - [ ] Assign to CS2 for agent contract fix
   - [ ] Wait for fix PR to merge
   - [ ] Re-verify agent availability
   - [ ] Resume wave ONLY after all builders available
5. [ ] Document agent availability verification in wave planning evidence

**PROHIBITED**:
- ❌ Starting wave with unavailable builders
- ❌ Substituting generic coding agent for missing builder
- ❌ Substituting other builder types
- ❌ Proceeding with "workaround" agents

**Consequence**: Governance violation, CATASTROPHIC FAILURE if repeated

**References**:
- BL-031: Pre-Flight Builder Agent Availability Check
- FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md v1.0.0
- BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md
```

### 7.2 Contract Protection

This LOCKED section is protected by:
- AGENT_CONTRACT_PROTECTION_PROTOCOL.md
- Merge gate validation
- CS2 approval requirement for modification

---

## 8. Compliance and Enforcement

### 8.1 Merge Gate Integration

**Gate**: Pre-Wave Authorization Gate  
**Trigger**: Any PR containing wave planning artifacts or builder task assignments

**Validation**:
- [ ] Evidence of agent availability check present
- [ ] All required builders verified available
- [ ] Verification timestamp within 24 hours of wave start
- [ ] No prohibited actions detected (substitutions, workarounds)

**Failure Consequences**:
- Block merge until evidence provided
- Escalate to CS2 if governance violation detected
- Document failure in incident log

### 8.2 Audit Requirements

**Periodic Audit** (monthly or per-wave):
- Review all wave planning evidence for agent availability checks
- Verify compliance with verification procedure
- Identify any bypasses or workarounds
- Report compliance metrics to CS2

---

## 9. Learning Loop Integration

### 9.1 Bootstrap Learning BL-031

This protocol implements prevention measures for:

**BL-031: Pre-Flight Builder Agent Availability Check**
- **Failure Pattern**: Wave started without verifying builder availability
- **Consequence**: 2 hours wasted, governance violations, rework required
- **Prevention**: Mandatory pre-wave check (this protocol)
- **Repetition Consequence**: CATASTROPHIC FAILURE

### 9.2 "We Only Fail Once" Doctrine

Under WE_ONLY_FAIL_ONCE_DOCTRINE.md:
- BL-031 documented and canonized
- Prevention protocol created (this document)
- LOCKED into Foreman contracts
- Merge gate enforcement enabled
- **If pattern repeats**: CATASTROPHIC FAILURE triggered

---

## 10. Cross-Repository Applicability

### 10.1 Layer-Down Propagation

This protocol MUST be propagated to ALL consumer repositories with Foreman agents:
- maturion-isms (MAT build)
- maturion-foreman-office-app (FO build)
- Any future repositories with Foreman agents

### 10.2 Ripple Execution

When this protocol is created or updated:
1. Update CANON_INVENTORY.json with full SHA256 hash
2. Execute layer-down ripple to all consumer repos
3. Update Foreman agent contracts in consumer repos
4. Verify compliance across ecosystem
5. Document ripple completion

---

## 11. Related Documents

**Constitutional Canon**:
- LIVING_AGENT_SYSTEM.md v6.2.0 - Living Agent framework
- AGENT_CONTRACT_PROTECTION_PROTOCOL.md - LOCKED section protection
- WE_ONLY_FAIL_ONCE_DOCTRINE.md - Learning promotion rule
- BOOTSTRAP_EXECUTION_LEARNINGS.md - BL-031 entry

**Operational Canon**:
- BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md - YAML compliance requirements
- AGENT_FILE_SCHEMA.md - Agent contract schema
- FM_BUILDER_APPOINTMENT_PROTOCOL.md - Builder assignment protocol
- FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md - Wave planning

**Evidence**:
- RCA: modules/mat/05-build-evidence/RCA_WAVE_5.5_AGENT_CONTRACT_DEVIATION.md
- Issues: APGI-cmy/maturion-isms#290, #292
- PRs: APGI-cmy/maturion-isms#288, #291, #293

---

## 12. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Governance-Repo-Administrator | Initial canonical protocol creation implementing BL-031 prevention measures |

---

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0 | Approved by CS2 (Johan Ras) | File: governance/canon/FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md
