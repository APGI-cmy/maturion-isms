# AGENT BASELINE MANAGEMENT PROTOCOL

## Status
**Type**: Canonical Governance Protocol  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories, All Work

---

## 1. Purpose

This protocol establishes the **canonical definition of agent baselines**, their role in self-governing agent systems, and the mandatory procedures for baseline management, validation, and drift reconciliation.

Agent baselines are the **constitutional foundation** that enables:
- Agent self-governance and autonomous operation
- Foreman (FM) orchestration and builder supervision
- Living Agent System v5.0.0 lifecycle compliance
- Governance drift detection and prevention
- Constitutional authority enforcement
- Cross-repository consistency

**Core Principle**: Baselines are **immutable constitutional references** that define what agents must be, not what they currently are. Agents validate against baselines; baselines do not adapt to agents.

**Critical Invariant**: Baselines are **CS2-only authority**. No agent, including FM, may modify baselines without explicit CS2 approval.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Governance as canonical memory
- **LIVING_AGENT_SYSTEM.md** — Agent lifecycle, wake-up, memory, and working contract generation
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** — Universal agent self-governance check before every job
- **PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md** — Mandatory pre-work gap detection and attestation
- **AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md** — Agent contract authority hierarchy
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** — Locked sections and protection enforcement
- **GOVERNANCE_RIPPLE_MODEL.md** — Governance change propagation
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** — Cross-repo governance alignment
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** — CS2 direct authority model

---

## 3. What Are Agent Baselines?

### 3.1 Definition

**Agent Baseline** is a canonical agent contract file (`.agent` file) in the governance repository that defines:
- Agent identity (type, class, mission)
- Constitutional authority boundaries
- Mandatory responsibilities and prohibitions
- Governance loading requirements
- Wake-up and closure protocol references
- Memory management rules
- Escalation criteria
- Integration points with canonical governance

**Baseline Scope**: Agent baselines exist in the `maturion-foreman-governance` repository under:
- `governance/agents/<agent-type>.agent`
- `.github/agents/<agent-type>.agent` (consumer repository copies)

### 3.2 Why Baselines Exist

Baselines serve **four critical functions**:

#### 3.2.1 Constitutional Foundation
- Define **what an agent must be** to operate within governance
- Establish **authority boundaries** and escalation criteria
- Encode **prohibited actions** and safety constraints
- Specify **mandatory protocols** (wake-up, memory, closure)

#### 3.2.2 Self-Governance Enablement
- Enable agents to **self-validate** contract currency before work
- Provide **gap detection** criteria (missing governance artifacts)
- Define **auto-remediation** vs. **escalation** decision rules
- Support **drift detection** and reconciliation

#### 3.2.3 Living Agent System Integration
- Specify **wake-up protocol** requirements (LIVING_AGENT_SYSTEM.md §1)
- Define **memory management** boundaries (LIVING_AGENT_SYSTEM.md §2-3)
- Establish **working contract generation** inputs (LIVING_AGENT_SYSTEM.md §4)
- Document **session closure** and handover obligations (LIVING_AGENT_SYSTEM.md §5)

#### 3.2.4 Cross-Repository Consistency
- Ensure **identical behavior** across all consumer repositories
- Enable **atomic layer-down** of governance changes
- Support **ripple validation** and compliance auditing
- Prevent **agent contract drift** across ecosystem

### 3.3 Baselines vs. Agent Instances

| Dimension | Baseline (Canonical) | Agent Instance (Consumer Repo) |
|-----------|---------------------|--------------------------------|
| **Location** | `maturion-foreman-governance` | Consumer repo `.github/agents/` |
| **Authority** | CS2 ONLY | CS2 via layer-down |
| **Purpose** | Constitutional definition | Operational copy |
| **Modification** | CS2 approval required | NEVER modified directly |
| **Validation** | N/A (is the standard) | Validates against baseline |
| **Lifecycle** | Upgraded via governance ripple | Updated via layer-down |
| **Drift** | Cannot drift (is source) | Must reconcile if drifts |

**Critical Rule**: Agent instances in consumer repositories are **read-only operational copies** of baselines. They MUST match baselines exactly or escalate drift for CS2 resolution.

---

## 4. Baseline Update Authority (CS2 Only)

### 4.1 Authority Hierarchy

**ONLY CS2 may update agent baselines.**

**Who CANNOT Update Baselines**:
- ❌ Foreman (FM) — Enforces baselines, cannot modify
- ❌ Builders — Implement features, cannot modify
- ❌ Governance-Liaison — Propagates baselines, cannot modify
- ❌ Governance-Repo-Administrator — Maintains inventory, cannot modify
- ❌ CodexAdvisor — Oversees execution, cannot modify
- ❌ Any other agent or automated system

**Rationale**: Baselines encode constitutional authority. Allowing agents to modify their own authority boundaries would violate the Governance Supremacy Rule (GSR).

### 4.2 When Baselines May Be Updated

Baseline updates are authorized ONLY under these conditions:

#### 4.2.1 Governance Canon Upgrade
- **Trigger**: New canonical governance artifacts introduced
- **Example**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md (this file) added → all baselines updated to reference it
- **Process**: CS2 updates baselines → governance ripple → layer-down

#### 4.2.2 Living Agent System Evolution
- **Trigger**: LIVING_AGENT_SYSTEM.md protocol changes (e.g., v1.0.0 → v2.0.0)
- **Example**: New wake-up protocol steps added
- **Process**: CS2 updates baselines → governance ripple → layer-down

#### 4.2.3 Agent Contract Schema Change
- **Trigger**: `.agent.schema.md` schema evolution
- **Example**: New Section 14 added to schema
- **Process**: CS2 updates baselines → governance ripple → layer-down

#### 4.2.4 Agent Role Evolution
- **Trigger**: Agent responsibilities expand or contract
- **Example**: FM granted new authority domain
- **Process**: CS2 reviews, updates FM_ROLE_CANON.md and baseline → ripple

#### 4.2.5 Security or Compliance Requirement
- **Trigger**: Critical security vulnerability or compliance gap identified
- **Example**: New prohibited action discovered (agent could bypass governance)
- **Process**: CS2 emergency update → immediate ripple → urgent layer-down

**Forbidden Updates**:
- ❌ Cosmetic changes ("improving readability")
- ❌ Agent-requested convenience changes
- ❌ Temporary workarounds or exceptions
- ❌ Per-repository customizations

### 4.3 Baseline Update Process

```
┌──────────────────────────────────────────────────────┐
│ CS2 BASELINE UPDATE WORKFLOW                         │
└──────────────────────────────────────────────────────┘

Step 1: Trigger Identification
   → Governance canon upgrade, schema change, role evolution, security issue

Step 2: Constitutional Review
   → CS2 validates change against GOVERNANCE_PURPOSE_AND_SCOPE.md
   → Ensures change maintains constitutional integrity
   → Confirms no authority boundary violations

Step 3: Baseline Update (maturion-foreman-governance)
   → CS2 updates agent baseline file(s)
   → Updates VERSION and LAST_UPDATED metadata
   → Documents change in CHANGELOG section

Step 4: Governance Ripple Execution
   → Execute GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md
   → Update GOVERNANCE_ARTIFACT_INVENTORY.md
   → Validate all cross-references
   → Update templates and examples

Step 5: Layer-Down Execution
   → Governance-Liaison propagates to all consumer repos
   → Atomic update (all-or-nothing per repo)
   → Baseline validation executed in each repo

Step 6: Verification
   → All agents re-validate against new baseline
   → Drift reconciliation if needed
   → No work proceeds until validation passes
```

---

## 5. Baseline Validation Protocol

### 5.1 When Validation Occurs

Agent baseline validation is **MANDATORY** at:

1. **Session Start (Wake-Up)** — LIVING_AGENT_SYSTEM.md §1 wake-up phase
2. **Pre-Work Check** — PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md before every job
3. **Post-Layer-Down** — After governance-liaison updates agent files
4. **Drift Detection** — When agent detects potential baseline misalignment
5. **Escalation Resolution** — After CS2 resolves agent contract drift

### 5.2 Validation Checks

Agent MUST perform these checks:

#### Check 1: File Existence
```bash
# Baseline exists in governance repository
[ -f "governance/agents/<agent-type>.agent" ]

# Instance exists in consumer repository
[ -f ".github/agents/<agent-type>.agent" ]
```

#### Check 2: Version Currency
```bash
# Extract version from baseline and instance
BASELINE_VERSION=$(grep "^Version:" governance/agents/<agent-type>.agent)
INSTANCE_VERSION=$(grep "^Version:" .github/agents/<agent-type>.agent)

# Validate match
[ "$BASELINE_VERSION" == "$INSTANCE_VERSION" ]
```

#### Check 3: Content Integrity
```bash
# Compare LOCKED sections (must be identical)
# See AGENT_CONTRACT_PROTECTION_PROTOCOL.md for LOCKED section list
diff <(grep -A 50 "^## Section X" baseline) \
     <(grep -A 50 "^## Section X" instance)
```

#### Check 4: Governance References
```bash
# Validate all referenced canonical files exist
grep -E "^\*\*Authority\*\*:|^- \*\*|^See:" .github/agents/<agent-type>.agent \
  | extract_referenced_files \
  | while read FILE; do
      [ -f "governance/canon/$FILE" ] || echo "MISSING: $FILE"
    done
```

#### Check 5: Mandatory Sections
```bash
# Per .agent.schema.md, validate all mandatory sections present
for SECTION in "Identity" "Authority" "Responsibilities" "Prohibitions" \
               "Wake-Up Protocol" "Memory Management" "Escalation Criteria"; do
  grep -q "^## $SECTION" .github/agents/<agent-type>.agent || echo "MISSING: $SECTION"
done
```

### 5.3 Validation Outcomes

#### ✅ PASS — Agent may proceed
- All checks pass
- Baseline and instance are synchronized
- No governance gaps detected
- Agent continues to work phase

#### ⚠️ WARN — Auto-remediation attempted
- Minor drift detected (e.g., outdated version)
- Agent has auto-remediation authority per PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md
- Agent updates instance from baseline
- Re-validates
- If pass → proceed; if fail → escalate

#### ❌ FAIL — Agent MUST escalate, DO NOT PROCEED
- Critical drift detected (LOCKED section mismatch)
- Missing canonical governance files
- Baseline version ahead of instance by >1 minor version
- Agent lacks auto-remediation authority
- **Mandatory Action**: Agent MUST stop, create escalation file, await CS2 resolution

---

## 6. Drift Reconciliation Protocol

### 6.1 What Is Baseline Drift?

**Baseline Drift** occurs when:
- Agent instance file differs from canonical baseline
- Agent instance references outdated governance
- Agent instance has local modifications
- Agent instance is missing mandatory sections

**Drift Sources**:
- Incomplete layer-down propagation
- Manual local modifications (governance violation)
- Merge conflict resolution errors
- Governance ripple not executed

### 6.2 Drift Detection

Agents detect drift via:
1. **Automatic**: Pre-work governance self-test (PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md)
2. **Automatic**: Wake-up phase validation (LIVING_AGENT_SYSTEM.md §1.6)
3. **Manual**: Human review of governance-gap-analyzer.sh output
4. **Trigger**: CI/CD baseline validation workflow failure

### 6.3 Drift Severity Classification

#### Level 1: Minor Drift (Auto-Remediable)
- **Example**: Version number mismatch (instance v1.0.0, baseline v1.1.0)
- **Allowed Response**: Agent auto-updates instance from baseline
- **Authority**: PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md §5 auto-remediation

#### Level 2: Moderate Drift (Escalation Required)
- **Example**: Non-LOCKED section content differs
- **Allowed Response**: Agent MUST escalate to CS2
- **Prohibited**: Agent MAY NOT modify instance
- **Rationale**: Content changes may reflect intentional customization (forbidden) or incomplete ripple

#### Level 3: Critical Drift (Immediate Halt)
- **Example**: LOCKED section mismatch, missing mandatory sections
- **Allowed Response**: Agent MUST halt, escalate immediately, DO NOT PROCEED
- **Prohibited**: Agent MAY NOT continue work or modify instance
- **Rationale**: LOCKED section drift indicates constitutional integrity violation

### 6.4 Drift Reconciliation Workflow

```
┌────────────────────────────────────────────────────────┐
│ DRIFT RECONCILIATION WORKFLOW                          │
└────────────────────────────────────────────────────────┘

Agent detects drift
   ↓
Classify severity (Level 1/2/3)
   ↓
┌──────────────────────────────────────────────────────┐
│ Level 1 (Minor)                                      │
│   → Agent auto-remediates (copies baseline →        │
│      instance)                                        │
│   → Re-validates                                      │
│   → If pass: proceed                                  │
│   → If fail: escalate to Level 2                     │
└──────────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────────┐
│ Level 2 (Moderate)                                   │
│   → Agent creates escalation file:                   │
│       .agent-workspace/<agent>/escalation-inbox/     │
│         baseline-drift-YYYYMMDD.md                   │
│   → Agent HALTS work (does not proceed)              │
│   → CS2 investigates                                  │
│   → CS2 options:                                      │
│       a) Update instance from baseline (approved)    │
│       b) Update baseline if local change valid       │
│          (rare)                                       │
│       c) Revert local change and update from         │
│          baseline                                     │
│   → Agent re-validates after CS2 resolution           │
└──────────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────────┐
│ Level 3 (Critical)                                   │
│   → Agent IMMEDIATELY HALTS                           │
│   → Agent creates URGENT escalation:                  │
│       escalation-inbox/CRITICAL-baseline-drift-      │
│         YYYYMMDD.md                                   │
│   → Agent DOES NOT PROCEED under any condition       │
│   → CS2 URGENT investigation required                 │
│   → Root cause analysis (RCA) mandatory               │
│   → Governance ripple re-execution may be required    │
│   → All work in consumer repo HALTED until resolved   │
└──────────────────────────────────────────────────────┘
```

### 6.5 Drift Escalation Template

Agents MUST use this template when escalating drift:

```markdown
# BASELINE DRIFT ESCALATION — [AGENT_TYPE]

**Date**: YYYY-MM-DD HH:MM:SS UTC  
**Agent**: <agent-type>  
**Repository**: <owner>/<repo>  
**Severity**: Level 1 / Level 2 / Level 3  

---

## Drift Detection

**Validation Check Failed**: <check name>  
**Expected (Baseline)**: <baseline value/content>  
**Actual (Instance)**: <instance value/content>  

## Attempted Auto-Remediation

**Auto-Remediation Authorized**: Yes / No  
**Auto-Remediation Attempted**: Yes / No  
**Auto-Remediation Result**: Success / Failure / N/A  

## Impact Assessment

**Work Blocked**: Yes / No  
**Governance Integrity Risk**: Low / Medium / High / Critical  
**Cross-Repository Impact**: Isolated / Ripple Required  

## Agent Recommendation

<Agent's assessment of cause and proposed resolution>

## CS2 Decision Required

- [ ] Approve instance update from baseline
- [ ] Investigate root cause (RCA required)
- [ ] Re-execute governance ripple
- [ ] Update baseline (rare)
- [ ] Other: ___________________

---
**Authority**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md §6.5
```

---

## 7. Protocol for Updating Baselines After Agent File Upgrades

### 7.1 Trigger Scenarios

Baselines MUST be updated when:
1. **Agent Contract Schema Upgrade** — `.agent.schema.md` version bump
2. **Living Agent System Version Change** — LIVING_AGENT_SYSTEM.md v1.0.0 → v2.0.0
3. **New Canonical Governance** — New canon files added that agents must reference
4. **Agent Role Expansion/Contraction** — Agent responsibilities change
5. **Security or Compliance Mandate** — Critical governance gap identified

### 7.2 Update Execution Process

```
┌──────────────────────────────────────────────────────────┐
│ BASELINE UPDATE AFTER AGENT FILE UPGRADE                 │
└──────────────────────────────────────────────────────────┘

Step 1: CS2 Approval
   → Governance change approved (new canon, schema, role)
   → CS2 reviews impact on all agent types

Step 2: Baseline Update
   → CS2 updates baseline(s) in maturion-foreman-governance
   → Version bump (MAJOR.MINOR.PATCH per semantic versioning)
   → CHANGELOG section updated with rationale

Step 3: Governance Ripple
   → Execute GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md
   → Update GOVERNANCE_ARTIFACT_INVENTORY.md
   → Validate all cross-references
   → Update agent contract templates

Step 4: Layer-Down Coordination
   → Create layer-down issue for governance-liaison
   → Governance-liaison propagates to ALL consumer repos
   → Atomic update per repository

Step 5: Agent Re-Validation
   → All agents perform baseline validation
   → Drift reconciliation if needed
   → Work resumes after validation passes

Step 6: Post-Update Audit
   → CS2 verifies all consumer repos updated
   → Governance-gap-analyzer.sh run across all repos
   → Inventory updated with new baseline versions
```

### 7.3 Backward Compatibility

**Principle**: Baseline updates SHOULD maintain backward compatibility when possible.

**Breaking Changes** (require MAJOR version bump):
- LOCKED section structure changes
- Mandatory section additions
- Authority boundary changes
- Prohibited action additions

**Non-Breaking Changes** (MINOR version bump):
- New optional sections
- Clarifications to existing content
- Additional canonical governance references
- Documentation improvements

**Patch Changes** (PATCH version bump):
- Typo fixes
- Broken link repairs
- Metadata updates (dates, version references)

---

## 8. Integration with Living Agent System v5.0.0

### 8.1 Wake-Up Phase Integration

Per LIVING_AGENT_SYSTEM.md §1, agent wake-up MUST include baseline validation:

```bash
# Wake-Up Protocol (Step 6: Baseline Validation)
echo "🔍 Step 6: Baseline Validation"

# Identify agent type
AGENT_TYPE=$(basename $(dirname $0))

# Validate against canonical baseline
if [ -f "governance/agents/${AGENT_TYPE}.agent" ]; then
  BASELINE_VERSION=$(grep "^Version:" governance/agents/${AGENT_TYPE}.agent | cut -d' ' -f2)
  INSTANCE_VERSION=$(grep "^Version:" .github/agents/${AGENT_TYPE}.agent | cut -d' ' -f2)
  
  if [ "$BASELINE_VERSION" != "$INSTANCE_VERSION" ]; then
    echo "  ⚠️  DRIFT DETECTED: Baseline v$BASELINE_VERSION, Instance v$INSTANCE_VERSION"
    echo "  → Auto-remediation authorized: Updating instance..."
    cp "governance/agents/${AGENT_TYPE}.agent" ".github/agents/${AGENT_TYPE}.agent"
    echo "  ✅ Instance updated to v$BASELINE_VERSION"
  else
    echo "  ✅ Baseline validation PASSED (v$BASELINE_VERSION)"
  fi
else
  echo "  ⚠️  Governance repository baseline not found (consumer repo)"
  echo "  → Using instance baseline as reference"
fi
```

### 8.2 Working Contract Generation Integration

Per LIVING_AGENT_SYSTEM.md §4, working contract MUST reflect baseline validation status:

```markdown
## Baseline Validation Status
- **Agent Type**: <agent-type>
- **Baseline Version**: v<version>
- **Instance Version**: v<version>
- **Validation Result**: ✅ PASS / ⚠️ DRIFT (remediated) / ❌ FAIL (escalated)
- **Last Validated**: YYYY-MM-DD HH:MM:SS UTC

## Baseline-Derived Authority
<Extract authority boundaries from validated baseline>

## Baseline-Derived Prohibitions
<Extract prohibitions from validated baseline>
```

### 8.3 Session Closure Integration

Per LIVING_AGENT_SYSTEM.md §5, session closure MUST record baseline validation outcomes:

```markdown
## Session Memory: Baseline Management

**Baseline Validation Performed**: Yes / No  
**Validation Result**: PASS / DRIFT / FAIL  
**Drift Severity**: None / Level 1 / Level 2 / Level 3  
**Auto-Remediation Attempted**: Yes / No  
**Auto-Remediation Result**: Success / Failure / N/A  
**Escalation Created**: Yes / No  
**Escalation File**: <path> / N/A  
```

---

## 9. Compliance and Enforcement

### 9.1 Mandatory Requirements

**ALL agents MUST**:
- ✅ Validate against baseline at session start (LIVING_AGENT_SYSTEM.md)
- ✅ Validate against baseline before every job (PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md)
- ✅ Halt work if baseline validation fails critically
- ✅ Escalate drift to CS2 when auto-remediation fails
- ✅ Document baseline validation in session memories
- ✅ Never modify baselines without CS2 approval

**ALL governance-liaison agents MUST**:
- ✅ Execute atomic layer-down of baseline updates
- ✅ Validate baselines after layer-down
- ✅ Report layer-down success/failure to CS2
- ✅ Halt layer-down if validation fails

**CS2 MUST**:
- ✅ Review and approve all baseline updates
- ✅ Execute governance ripple after baseline changes
- ✅ Coordinate layer-down across all consumer repos
- ✅ Resolve escalated drift issues
- ✅ Conduct post-update audit

### 9.2 Audit Trail Requirements

**Per AUDIT_READINESS_MODEL.md**, baseline management MUST maintain:
- Baseline version history with timestamps and CS2 approver
- Drift escalation log with resolution outcomes
- Layer-down execution log per repository
- Validation failure log with root cause analysis
- Auto-remediation attempt log with success/failure rates

### 9.3 Violations and Consequences

**Prohibited Actions**:
- ❌ Agent modifies baseline without CS2 approval
- ❌ Agent proceeds with work despite baseline validation failure
- ❌ Agent skips pre-work baseline validation
- ❌ Governance-liaison performs partial layer-down (must be atomic)
- ❌ Human manually edits agent instance without baseline update

**Consequences**:
- Immediate work halt
- Governance incident creation (CATASTROPHIC_FAILURE_PROTOCOL.md)
- Root cause analysis mandatory
- Governance ripple re-execution required
- Process improvement mandatory (MANDATORY_PROCESS_IMPROVEMENT_REFLECTION_PROTOCOL.md)

---

## 10. Relationship to Other Governance

### 10.1 Integration Points

This protocol integrates with:

| Governance Artifact | Integration |
|---------------------|-------------|
| **LIVING_AGENT_SYSTEM.md** | Baseline validation in wake-up phase |
| **AGENT_SELF_GOVERNANCE_PROTOCOL.md** | Universal self-governance check includes baseline validation |
| **PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md** | Pre-work check validates baseline currency |
| **AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md** | Authority hierarchy for baseline updates |
| **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** | LOCKED sections immutability enforcement |
| **GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md** | Baseline updates trigger ripple |
| **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** | Baseline propagation to consumer repos |
| **CS2_AGENT_FILE_AUTHORITY_MODEL.md** | CS2-only baseline modification authority |

### 10.2 Precedence

**This protocol has CONSTITUTIONAL PRECEDENCE** in matters of:
- Baseline modification authority (CS2 only)
- Drift reconciliation procedures
- Validation failure handling

**This protocol is SUBORDINATE to**:
- GOVERNANCE_PURPOSE_AND_SCOPE.md (overall governance authority)
- Build philosophy and zero-test-debt mandates

---

## 11. Versioning and Evolution

### 11.1 Protocol Versioning

**Current Version**: 1.0.0 (2026-02-08)

**Version History**:
- **v1.0.0** (2026-02-08) — Initial canonical protocol establishing baseline management, validation, drift reconciliation, CS2-only authority, Living Agent System integration

### 11.2 Future Evolution

**Planned Enhancements**:
- Automated baseline validation CI/CD workflows
- Machine-readable baseline diff analysis
- Baseline validation dashboard for CS2
- Predictive drift detection (anomaly detection)

### 11.3 Maintenance Authority

**Protocol Owner**: CS2 (Johan Ras)  
**Review Frequency**: Annually or upon major Living Agent System upgrade  
**Amendment Process**: CS2 approval → governance ripple → layer-down

---

## 12. Summary

**What are baselines?**  
Canonical agent contract files defining constitutional authority, responsibilities, and Living Agent System integration.

**Why do they exist?**  
Enable self-governance, prevent drift, ensure cross-repo consistency, enforce constitutional authority.

**Who has update authority?**  
CS2 ONLY. No agent may modify baselines.

**When are baselines updated?**  
Governance canon upgrade, Living Agent System evolution, agent role change, security/compliance mandate.

**What happens if validation fails?**  
Level 1 (minor): auto-remediate. Level 2 (moderate): escalate. Level 3 (critical): HALT and escalate urgently.

**Drift reconciliation process?**  
Detect → classify severity → auto-remediate or escalate → CS2 resolves → re-validate → resume work.

**Living Agent System integration?**  
Validation in wake-up phase, working contract generation, session closure documentation.

---

**Authority**: GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Version**: 1.0.0  
**Effective**: 2026-02-08  
**Owner**: CS2 (Johan Ras)

---

## Appendix A: Baseline Validation Checklist

```markdown
## Pre-Work Baseline Validation Checklist

**Agent**: <agent-type>  
**Session**: <session-id>  
**Date**: YYYY-MM-DD HH:MM:SS UTC

- [ ] Step 1: Baseline file exists (governance/agents/<agent>.agent)
- [ ] Step 2: Instance file exists (.github/agents/<agent>.agent)
- [ ] Step 3: Version match (baseline == instance)
- [ ] Step 4: LOCKED sections match (byte-for-byte)
- [ ] Step 5: Mandatory sections present
- [ ] Step 6: Canonical governance references valid
- [ ] Step 7: Schema compliance (.agent.schema.md)
- [ ] Step 8: No local modifications detected
- [ ] Step 9: Auto-remediation attempted (if needed)
- [ ] Step 10: Escalation created (if validation failed)

**Result**: ✅ PASS / ⚠️ DRIFT (remediated) / ❌ FAIL (escalated)

---
**Authority**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md Appendix A
```

---

## Appendix B: Drift Root Cause Analysis Template

```markdown
# BASELINE DRIFT ROOT CAUSE ANALYSIS

**Incident ID**: DRIFT-YYYYMMDD-NNN  
**Agent**: <agent-type>  
**Repository**: <owner>/<repo>  
**Detection Date**: YYYY-MM-DD  
**Severity**: Level 1 / 2 / 3

---

## Timeline

| Timestamp | Event |
|-----------|-------|
| YYYY-MM-DD HH:MM | Drift detected during <wake-up/pre-work/validation> |
| YYYY-MM-DD HH:MM | Auto-remediation attempted / escalated |
| YYYY-MM-DD HH:MM | CS2 investigation started |
| YYYY-MM-DD HH:MM | Root cause identified |
| YYYY-MM-DD HH:MM | Resolution implemented |
| YYYY-MM-DD HH:MM | Validation re-executed (PASS) |

## Root Cause

**Category**: Incomplete layer-down / Manual modification / Merge conflict / Other  
**Description**: <Detailed explanation of why drift occurred>

## Contributing Factors

- <Factor 1>
- <Factor 2>
- <Factor 3>

## Resolution

**Action Taken**: <Description of resolution>  
**Ripple Required**: Yes / No  
**Layer-Down Re-Executed**: Yes / No

## Prevention

**Process Improvement Required**: Yes / No  
**Governance Update Required**: Yes / No  
**Tooling Enhancement Required**: Yes / No

**Prevention Measures**:
- <Measure 1>
- <Measure 2>
- <Measure 3>

---
**Authority**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md Appendix B
```
