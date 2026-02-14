# AGENT SELF-GOVERNANCE PROTOCOL

## Status
**Type**: Canonical Governance Protocol  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-01-21  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Applies To**: All Agents, All Repositories

---

## 1. Purpose

This protocol establishes the **universal agent self-governance check** that MUST be performed by every agent before starting any work. It codifies the mandatory procedure for detecting and handling governance drift, agent contract misalignment, and escalation requirements.

This protocol ensures that:
- All agents verify their own contract currency before work
- Agents identify canonical governance sources correctly
- Gap analysis is performed systematically
- Self-align vs. escalate decisions follow explicit rules
- Governance drift is detected and corrected automatically when authorized
- All work includes mandatory self-governance attestation

**Core Principle**: Every agent MUST verify alignment with canonical governance before proceeding with any work. No exceptions.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance as canonical memory
- **AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md** - Agent context currency requirements
- **AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md** - Agent contract authority model
- **GOVERNANCE_RIPPLE_MODEL.md** - Governance change propagation
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** - Cross-repo governance alignment
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Granular authority hierarchy
- **.agent.schema.md** - Agent contract structure and validation

---

## 3. Scope

### 3.1 In Scope

✅ **Covered by this protocol**:
- Universal self-governance check procedure (before every job)
- Agent-specific alignment rules per agent type
- Canonical governance source identification
- Gap analysis procedure
- Self-align vs. escalate decision criteria
- Error and drift handling workflows
- Mandatory self-governance attestation in all work reports/PRs
- Inventory and workflow artifact ripple requirements
- Diagrams and workflow documentation

### 3.2 Out of Scope

❌ **NOT covered by this protocol**:
- Implementation mechanisms for synchronisation (see AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md)
- Agent recruitment process (see AGENT_RECRUITMENT.md)
- CI/CD implementation details
- Specific tooling choices

---

## 4. Universal Self-Governance Check (MANDATORY)

### 4.1 When This Check Applies

**Trigger**: BEFORE EVERY JOB - All agents MUST perform this check before starting any work assignment.

**No Exceptions**: This check is mandatory regardless of:
- Agent type or role
- Job urgency or priority
- Previous successful alignment checks
- Confidence in contract currency

**Rationale**: Governance changes can occur between jobs. Currency must be verified before each work session.

---

### 4.2 Universal Self-Governance Check Workflow

```
BEFORE EVERY JOB
     ┌────────────┐
     │ Step 1:    │
     │ Read own   │
     │ .agent file│
     │ (read-only)│
     └─────┬──────┘
           ↓
     ┌─────────────┐
     │ Step 2:     │
     │ Identify    │
     │ canonical   │
     │ governance  │
     │ source(s)   │
     └─────┬───────┘
           ↓
     ┌─────────────┐
     │ Step 3:     │
     │ Perform gap │
     │ analysis    │
     │ (own file   │
     │ vs canon)   │
     └─────┬───────┘
           ↓
   ┌───────┴──────────┐
   │                  │
ALIGNED          MISALIGNED
   │                  │
   ↓                  ↓
┌──────┐      ┌────────────────┐
│Step 4│      │ Step 4:        │
│Proceed      │ Check self-    │
│with    │      │ align authority│
│work    │      └────┬───────────┘
└──────┘            │
                     ├──────────────────────┐
                     │                      │
            AUTHORIZED TO              NOT AUTHORIZED
            SELF-ALIGN                 TO SELF-ALIGN
                     │                      │
                     ↓                      ↓
            ┌─────────────────┐    ┌──────────────────┐
            │ Step 5:         │    │ Step 5:          │
            │ Self-align      │    │ HALT work        │
            │ (layer down     │    │ Close PR/job     │
            │ canonical       │    │ Escalate to CS2  │
            │ artifacts)      │    │                  │
            └────┬────────────┘    │ Message:         │
                 │                 │ "Cannot proceed  │
                 ↓                 │ - agent file not │
            ┌─────────────┐       │ current"         │
            │ Step 6:     │       │                  │
            │ Return to   │       │ Wait for CS2     │
            │ Step 1      │       │ to update        │
            │ (verify     │       │ contract         │
            │ alignment)  │       │                  │
            └────┬────────┘       │ Job restarts     │
                 │                 │ after alignment  │
                 ↓                 └──────────────────┘
            ┌─────────┐
            │ Proceed │
            │ with    │
            │ work    │
            └─────────┘
```

---

### 4.3 Step-by-Step Procedure

#### Step 1: Read Own Agent File (Read-Only)

**Action**: Agent reads its own `.agent` file from the repository.

**Location**:
- Governance-repo-administrator: `maturion-foreman-governance/.github/agents/governance-repo-administrator.agent.md`
- Governance-liaison: `<consumer-repo>/.github/agents/governance-liaison.agent.md`
- FM Agent: `<consumer-repo>/.github/agents/foreman.agent.md`
- Builder Agents: `<consumer-repo>/.github/agents/<builder-name>.agent.md`

**Requirements**:
- ✅ Read-only access (MUST NOT modify)
- ✅ Parse frontmatter for version, authority, governance_binding
- ✅ Extract canonical governance references

**Prohibited**:
- ❌ Modifying own contract
- ❌ Caching contract content across sessions
- ❌ Inferring contract intent beyond explicit content

---

#### Step 2: Identify Canonical Governance Source(s)

**Action**: Determine which canonical governance repository and version the agent should align with.

**Canonical Source Identification Rules**:

| Agent Type | Canonical Source |
|------------|------------------|
| **governance-repo-administrator** | `maturion-foreman-governance` (THIS repo, main branch) |
| **governance-liaison** | `maturion-foreman-governance` governance/canon/* (latest from main) |
| **FM Agent** | Local repo governance/ directory (seeded from canonical) |
| **Builder Agents** | Local repo governance/ directory (seeded from canonical) |

**Version Checking**:
- Read `GOVERNANCE_ALIGNMENT.md` or `GOVERNANCE_ARTIFACT_INVENTORY.md` in local repo
- Compare local governance version against canonical governance version
- Check last-updated timestamps on inventory files

**Escalation**: If canonical source cannot be determined, HALT and escalate.

---

#### Step 3: Perform Gap Analysis

**Action**: Compare own contract against canonical governance to detect misalignment.

**Gap Analysis Checks**:

**Check 1: Own Contract Alignment**
- Compare agent's contract version against expected version in canonical source
- Check if contract references current canonical governance documents
- Verify governance_binding field points to correct source
- Check for contract structural changes (schema version)

**Check 2: Local Repository Governance Alignment** (governance-liaison and governance-repo-admin only)
- Compare local governance/canon/* against canonical maturion-foreman-governance/governance/canon/*
- Check GOVERNANCE_ARTIFACT_INVENTORY.md for version markers
- Verify workflow automation scripts, CI YAML files, validators match canonical
- Check for missing or outdated governance artifacts

**Gap Classification**:
- **ALIGNED**: Own contract current AND (if applicable) local repo governance current
- **MISALIGNED (Self)**: Own contract not current
- **MISALIGNED (Repo)**: Local repo governance not current (governance-liaison/governance-repo-admin only)

---

#### Step 4: Check Self-Align Authority

**Action**: Determine if agent is authorized to self-align or must escalate.

**Self-Align Authority Matrix**:

| Agent Type | Check 1: Own Contract Misaligned | Check 2: Local Repo Governance Misaligned |
|------------|----------------------------------|-------------------------------------------|
| **governance-liaison** | **HALT & ESCALATE** to CS2 | **SELF-ALIGN** (layer down all canon, workflow, automation artifacts) |
| **FM Agent** | **HALT & ESCALATE** to CS2 | **HALT & ESCALATE** (FM may not layer down) |
| **Builder Agents** | **HALT & ESCALATE** to FM, then CS2 | N/A (no authority to check repo governance) |
| **governance-repo-administrator** | **HALT & ESCALATE** to CS2 (own contract changes require formal process) | **SELF-ALIGN** (update canonical inventory, ripple to consumers) |

**Decision Rule**:
- IF (agent can self-align for detected gap) → PROCEED to Step 5 (Self-Align)
- IF (agent CANNOT self-align) → PROCEED to Step 5 (Escalate)

---

#### Step 5A: Self-Align (Authorized Agents Only)

**Action**: Layer down canonical governance artifacts to restore alignment.

**Self-Align Procedure for governance-liaison**:
1. Identify all outdated or missing governance artifacts in local repo
2. Copy latest canonical governance/canon/* files from maturion-foreman-governance
3. Copy latest workflow automation (scripts/, .github/workflows/, validators)
4. Update GOVERNANCE_ARTIFACT_INVENTORY.md with new versions and timestamps
5. Update GOVERNANCE_ALIGNMENT.md with alignment confirmation
6. Commit changes with message: "Governance layer-down: <canonical-version>"
7. Return to Step 1 to verify alignment

**Self-Align Procedure for governance-repo-administrator**:
1. Update GOVERNANCE_ARTIFACT_INVENTORY.md (mark new canon files, update timestamps)
2. Create ripple plan for consumer repos (office-app, PartPulse, R_Roster)
3. Document ripple requirements in tracking log
4. Create downstream issues/PRs for governance-liaison agents in consumer repos
5. Return to Step 1 to verify alignment

**Requirements**:
- ✅ Layer down ALL affected artifacts (canon + workflow + automation + inventories)
- ✅ Update all version markers and timestamps
- ✅ Preserve audit trail (commit messages, PR descriptions)
- ✅ Re-verify alignment after self-align

**Prohibited**:
- ❌ Selective layer-down (cherry-picking)
- ❌ Modifying canonical artifacts during layer-down
- ❌ Skipping workflow/automation artifacts
- ❌ Proceeding without re-verification

---

#### Step 5B: Escalate (Required When Not Authorized)

**Action**: HALT work, close job/PR, escalate to authority, wait for resolution.

**Escalation Procedure**:
1. **HALT**: Stop all work immediately
2. **Close**: Close current PR or job with clear status message
3. **Message**: Provide explicit reason:
   - "Cannot proceed - agent contract not current (Check 1 failed)"
   - "Cannot proceed - repository governance misaligned (Check 2 failed)"
4. **Escalate**: Notify appropriate authority:
   - Builder → FM (then CS2 if FM cannot resolve)
   - FM → CS2
   - governance-liaison (own contract) → CS2
   - governance-repo-administrator (own contract) → CS2
5. **Wait**: Do NOT proceed until authority updates contract/governance
6. **Resume**: After alignment, job restarts from Step 1

**Escalation Message Template**:
```
SELF-GOVERNANCE CHECK FAILED

Agent: <agent-name>
Repository: <repo-name>
Check Failed: <Check 1: Own Contract | Check 2: Repository Governance>
Reason: <specific misalignment detected>

This agent is NOT authorized to self-align for this type of misalignment.

ACTION REQUIRED:
- CS2 (or designated authority) must update <contract/governance>
- Agent will resume work after alignment is restored

Escalated to: <CS2 | FM | governance-repo-administrator>
```

---

#### Step 6: Proceed with Work

**Action**: After alignment verified, proceed with assigned work.

**Requirements**:
- ✅ Self-governance check PASSED (aligned OR successfully self-aligned)
- ✅ Attestation prepared for work report/PR
- ✅ Evidence of check recorded

**Mandatory Attestation**: All progress reports and PRs MUST include self-governance check results (see Section 7).

---

## 5. Agent-Specific Rules

### 5.1 Governance-Liaison Agent

**Authority**: Operates in consumer repositories (office-app, PartPulse, R_Roster)

**Check 1: Own Contract Alignment** (vs canonical in governance repo)
- **Source**: `maturion-foreman-governance/.github/agents/governance-liaison.agent.md` (or profile)
- **If Misaligned**: **HALT & ESCALATE to CS2**
- **Rationale**: governance-liaison cannot modify own contract

**Check 2: Local Repo Governance Alignment** (vs canonical governance canon)
- **Source**: `maturion-foreman-governance/governance/canon/*`, workflow files, scripts, inventories
- **If Misaligned**: **SELF-ALIGN IMMEDIATELY**
  - Layer down newest canon artifacts
  - Layer down workflow automation (scripts, CI YAML, validators)
  - Layer down inventories and tracking files
  - Update GOVERNANCE_ALIGNMENT.md
- **Rationale**: governance-liaison authorized to maintain local governance alignment

**Escalate ONLY If**: Cannot resolve alignment issue autonomously (e.g., conflict, missing canonical source)

---

### 5.2 FM Agent

**Authority**: Operates in consumer repositories (office-app, PartPulse, R_Roster, etc.)

**Check 1: Own Contract Alignment** (vs local governance in repo)
- **Source**: Local repo `governance/agents/foreman-profile.md` or similar
- **If Misaligned**: **HALT & ESCALATE to CS2**
- **Rationale**: FM cannot modify own contract

**Check 2: Repository Overview** (ensures builder agents & governance are current)
- **Check**: Verify builders have current contracts, governance artifacts are current
- **If Misaligned**: **HALT & ESCALATE**
- **Rationale**: FM may not layer down governance (that's governance-liaison's role)

**Special Rule**: FM MUST NOT self-align governance artifacts. If repo governance is out of date, FM must escalate to governance-liaison or CS2.

---

### 5.3 Builder Agents

**Authority**: Operate in consumer repositories under FM supervision

**Check 1: Own Contract Alignment** (vs local repo governance)
- **Source**: Local repo governance profile or `.github/agents/<builder>.agent.md`
- **If Misaligned**: **HALT & ESCALATE to FM, then CS2**
- **Rationale**: Builders cannot modify own contracts

**Check 2: N/A**
- Builders do NOT perform repository governance alignment checks
- Builders trust FM and governance-liaison to maintain repo governance

**Special Rule**: Builders MUST NOT self-align anything. All alignment is escalated.

---

### 5.4 Governance-Repo-Administrator

**Authority**: Operates in canonical governance repository (maturion-foreman-governance)

**Check 1: Own Contract Alignment** (vs canonical in governance repo)
- **Source**: THIS repo `/.github/agents/governance-repo-administrator.agent.md`
- **If Misaligned**: **HALT & ESCALATE to CS2**
- **Rationale**: Own contract changes require formal change process (Issue → Proposal → CS2 Approval → Implementation)

**Check 2: Canonical Governance Completeness**
- **Check**: Verify canonical governance/canon/* is current, inventory is accurate
- **If Misaligned**: **SELF-ALIGN**
  - Update GOVERNANCE_ARTIFACT_INVENTORY.md
  - Mark last-updated timestamps
  - Create ripple plan for consumer repos
  - Track propagation status

**Special Responsibilities**:
- On any canon update: Update inventories, mark timestamps, ripple to consumers
- Maintain diagrams and workflow documentation
- Track ripple propagation to all consumer repos

---

## 6. What Must Be Rippled (Superset)

### 6.1 Governance Canon Files

**Location**: `governance/canon/*.md`

**Ripple Requirement**: ALL canon files must ripple to consumer repos when created or modified.

**Includes**:
- All governance policies, models, protocols
- Agent profiles
- Schemas
- Authority models

---

### 6.2 Workflow Automation Files

**Location**: `.github/workflows/*.yml`, `.github/scripts/*`, `scripts/*`

**Ripple Requirement**: ALL workflow and automation files tied to governance enforcement must ripple.

**Includes**:
- PR gate workflows
- Validation scripts
- Locked section checkers
- Scope validators
- Agent contract validators

---

### 6.3 Inventory and Tracking Files

**Location**: `GOVERNANCE_ARTIFACT_INVENTORY.md`, `governance/*/INVENTORY.md`

**Ripple Requirement**: ALL inventory files must ripple with version markers and last-updated timestamps.

**Includes**:
- Main inventory (GOVERNANCE_ARTIFACT_INVENTORY.md)
- Repo-specific inventories
- Alignment tracking files (GOVERNANCE_ALIGNMENT.md)

---

### 6.4 Diagrams and Workflow Documentation

**Location**: `governance/diagrams/*.md`

**Ripple Requirement**: Workflow diagrams must ripple when processes change.

**Includes**:
- Self-governance check workflows
- Inventory ripple process diagrams
- Error/drift handling workflows
- Authority hierarchy diagrams

---

### 6.5 CI Workflow Files and Validators

**Location**: `.github/workflows/*-gate.yml`, `.github/scripts/check_*.py`

**Ripple Requirement**: CI workflows tied to governance enforcement must ripple.

**Includes**:
- PR gate workflows
- Governance validation workflows
- Locked section protection gates
- Scope-to-diff validation gates

---

## 7. Mandatory Self-Governance Attestation

### 7.1 Attestation Requirement

**Requirement**: ALL agents MUST include self-governance check attestation in all progress reports, PRs, and PREHANDOVER_PROOF documents.

**When**: Before creating PR, in each progress report, in final handover proof.

**Rationale**: Provides audit trail that agent verified alignment before work.

---

### 7.2 Attestation Format

**Minimal Attestation** (for progress reports):
```markdown
### Self-Governance Check (Mandatory)
- [x] Step 1: Read own .agent file
- [x] Step 2: Identified canonical governance source: <source>
- [x] Step 3: Gap analysis performed
- [x] Step 4: Alignment status: ALIGNED | SELF-ALIGNED | ESCALATED
- [x] Evidence: <brief description or N/A if aligned>
```

**Full Attestation** (for PREHANDOVER_PROOF):
```markdown
## Pre-Job Self-Governance Check (MANDATORY)

**Protocol**: AGENT_SELF_GOVERNANCE_PROTOCOL.md v1.0.0

### Step 1: Read Own Agent File
- Agent: <agent-name>
- Contract Location: <path-to-.agent-file>
- Contract Version: <version>
- Timestamp: <ISO 8601 timestamp>

### Step 2: Identify Canonical Governance Source
- Canonical Source: <maturion-foreman-governance | local-repo-governance>
- Source Version: <commit-SHA or version tag>
- Inventory File: <GOVERNANCE_ARTIFACT_INVENTORY.md or similar>

### Step 3: Gap Analysis
- Check 1 (Own Contract): ALIGNED | MISALIGNED
- Check 2 (Repo Governance): ALIGNED | MISALIGNED | N/A
- Detected Gaps: <description or "None">

### Step 4: Self-Align Authority Check
- Authority Status: AUTHORIZED | NOT_AUTHORIZED | N/A
- Decision: PROCEED | SELF-ALIGN | ESCALATE

### Step 5: Action Taken
- Action: <PROCEEDED | SELF-ALIGNED | ESCALATED>
- Self-Align Details: <if applicable: files updated, commit SHA>
- Escalation Details: <if applicable: escalation target, message sent>

### Step 6: Alignment Verification
- Final Status: ALIGNED
- Verification Timestamp: <ISO 8601 timestamp>

**Conclusion**: Self-governance check PASSED. Agent authorized to proceed with work.
```

---

### 7.3 Attestation Storage

**Location**: All attestations must be stored in:
- Progress report PR descriptions
- PREHANDOVER_PROOF document
- Commit messages (brief form)
- Ripple tracking logs (for governance-repo-administrator)

**Retention**: Indefinite (part of audit trail)

---

## 8. Inventory Ripple and Reference Process

### 8.1 Inventory Update Triggers

**When governance canon or workflow logic changes**:
1. governance-repo-administrator updates inventories:
   - `GOVERNANCE_ARTIFACT_INVENTORY.md` (main)
   - `governance/[repo-specific]/INVENTORY.md` (if applicable)
   - Last-updated markers applied
2. Canon, inventory, and workflow artifacts rippled to all consumer repos
3. All agents in consumer repos scan inventories FIRST before any job
4. All progress/PR/proof reports attest that self-governance protocol was followed

---

### 8.2 Inventory Ripple Workflow

```
When canonical governance changes:

┌─────────────────────────────────────────────────────────┐
│ Step 1: governance-repo-administrator detects change    │
│ (new canon file, workflow update, etc.)                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Update GOVERNANCE_ARTIFACT_INVENTORY.md         │
│ - Add new canon file entry                              │
│ - Mark last-updated timestamp                           │
│ - Increment version markers                             │
│ - Document ripple requirement                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Create ripple plan                              │
│ - Identify affected consumer repos                      │
│   (office-app, PartPulse, R_Roster)                     │
│ - List all artifacts to ripple:                         │
│   * Canon files                                         │
│   * Workflow automation                                 │
│   * Inventories                                         │
│   * Diagrams                                            │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Create downstream issues/PRs                    │
│ - For each consumer repo:                               │
│   * Create issue in consumer repo                       │
│   * Assign to governance-liaison                        │
│   * Include canon file list                             │
│   * Include reason and priority                         │
│   * Reference canonical version                         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 5: governance-liaison in consumer repo             │
│ - Receives issue notification                           │
│ - Performs self-governance check                        │
│ - Detects Check 2 misalignment (repo governance)        │
│ - Self-aligns (layers down artifacts)                   │
│ - Updates local GOVERNANCE_ALIGNMENT.md                 │
│ - Creates PR with alignment confirmation                │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 6: Verify ripple completion                        │
│ - governance-repo-administrator tracks:                 │
│   * Which consumer repos completed ripple               │
│   * Ripple PR status per consumer                       │
│   * Inventory alignment confirmation                    │
│ - Mark ripple complete when all consumers updated       │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Error and Drift Handling

### 9.1 Alignment Check Failure Handling

**When any agent fails alignment check**:

```
┌─────────────────────────────────────────────────────────┐
│ Agent detects MISALIGNED status in Step 3               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Check: Is agent authorized to self-align for this gap?  │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
         YES                             NO
           │                              │
           ↓                              ↓
┌─────────────────────┐      ┌───────────────────────────┐
│ Self-Align Path     │      │ Escalation Path           │
│                     │      │                           │
│ 1. Layer down       │      │ 1. HALT work immediately  │
│    artifacts        │      │ 2. Close PR/job           │
│ 2. Update inventory │      │ 3. Create clear message:  │
│ 3. Commit changes   │      │    "Cannot proceed -      │
│ 4. Re-verify        │      │    agent file not current"│
│ 5. Return to Step 1 │      │ 4. Escalate to authority: │
│                     │      │    - Builder → FM/CS2     │
│                     │      │    - FM → CS2             │
│                     │      │    - g-liaison → CS2      │
│                     │      │    - g-repo-admin → CS2   │
│                     │      │ 5. WAIT for CS2 to update │
│                     │      │    contract/governance    │
│                     │      │ 6. Job restarts after     │
│                     │      │    alignment restored     │
└─────────────────────┘      └───────────────────────────┘
```

---

### 9.2 Escalation Message Requirements

**Required Elements**:
1. Clear statement: "Cannot proceed - agent file not current" OR "Cannot proceed - repository governance misaligned"
2. Agent name and repository
3. Check that failed (Check 1 or Check 2)
4. Specific misalignment detected
5. Escalation target (CS2, FM, governance-liaison)
6. Action required from authority

**Prohibited**:
- ❌ Proceeding with work despite misalignment
- ❌ Attempting unauthorized self-modification
- ❌ Inferring governance intent to bypass check
- ❌ Suppressing alignment failures

---

### 9.3 Post-Alignment Job Restart

**After authority restores alignment**:
1. Job restarts from beginning
2. Agent performs self-governance check again (Step 1)
3. Verification confirms ALIGNED status
4. Agent proceeds with work
5. Attestation documents alignment was restored

**Audit Trail**: Both failure and resolution must be documented in job evidence.

---

## 10. Diagrams and Workflow Documentation

### 10.1 Required Diagrams

All workflow diagrams required by this protocol are maintained in `governance/diagrams/`:

1. **agent-self-governance-check-workflow.md** - Universal self-governance check (Section 4.2)
2. **inventory-ripple-process-workflow.md** - Inventory ripple and reference process (Section 8.2)
3. **error-drift-handling-workflow.md** - Error and drift handling (Section 9.1)
4. **agent-authority-hierarchy-diagram.md** - Self-align authority matrix (Section 5)

**Maintenance Responsibility**: governance-repo-administrator maintains diagrams as part of canon maintenance.

**Ripple Requirement**: Diagrams ripple to consumer repos when processes change.

---

### 10.2 Diagram Update Triggers

**When to update diagrams**:
- Self-governance check procedure changes
- Agent-specific rules change
- Authority hierarchy changes
- Ripple process changes
- Error/drift handling changes

**Update Process**:
1. governance-repo-administrator updates diagram in governance/diagrams/
2. Updates GOVERNANCE_ARTIFACT_INVENTORY.md with new timestamp
3. Ripples updated diagram to consumer repos
4. Documents change in CHANGELOG.md

---

## 11. Integration with Existing Governance

### 11.1 AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md

This protocol (AGENT_SELF_GOVERNANCE_PROTOCOL.md) **extends and operationalizes** AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md by:
- Defining the universal self-governance check workflow
- Specifying agent-specific alignment rules
- Providing self-align vs. escalate decision criteria
- Adding mandatory attestation requirements

**Relationship**: AGENT_SELF_GOVERNANCE_PROTOCOL.md is the operational procedure; AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md is the foundational authority model.

---

### 11.2 GOVERNANCE_RIPPLE_MODEL.md

This protocol implements ripple requirements by:
- Defining inventory ripple workflow
- Specifying what artifacts must ripple (canon + workflow + automation + inventories)
- Establishing governance-repo-administrator ripple responsibilities
- Tracking ripple propagation to consumer repos

---

### 11.3 AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md

This protocol enforces authority hierarchy by:
- Prohibiting self-modification for all agents
- Defining self-align authority per agent type
- Establishing escalation paths based on authority levels
- Requiring CS2 approval for agent contract changes

---

### 11.4 CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md

This protocol implements layer-down requirements by:
- Defining governance-liaison self-align procedure
- Specifying canonical source identification
- Establishing GOVERNANCE_ALIGNMENT.md requirements
- Tracking consumer repo alignment status

---

## 12. Success Criteria

This protocol is successful when:
- ✅ ALL agents perform self-governance check before every job
- ✅ Governance drift detected and corrected automatically (when authorized)
- ✅ Unauthorized agents escalate correctly (no silent failures)
- ✅ ALL progress reports include self-governance attestation
- ✅ Canonical governance ripples reliably to all consumer repos
- ✅ Inventories remain current with version markers and timestamps
- ✅ Workflow diagrams accurately reflect current processes
- ✅ Audit trail captures all alignment checks, self-align actions, and escalations

---

## 13. Non-Negotiable Invariants

1. **Universal applicability**: ALL agents MUST perform self-governance check before EVERY job
2. **Self-modification prohibition**: ABSOLUTE for ALL agents
3. **Escalation mandate**: Unauthorized agents MUST escalate, never proceed
4. **Attestation requirement**: ALL work reports MUST include self-governance attestation
5. **Ripple completeness**: ALL affected artifacts MUST ripple (canon + workflow + automation + inventories)
6. **Inventory currency**: Inventories MUST be updated with every canon change
7. **Diagram accuracy**: Workflow diagrams MUST reflect current processes

---

## 14. Prohibited Actions

1. ❌ Skipping self-governance check before work
2. ❌ Proceeding with work despite misalignment
3. ❌ Self-modifying own contract
4. ❌ Unauthorized self-alignment
5. ❌ Selective ripple (cherry-picking artifacts)
6. ❌ Omitting self-governance attestation from work reports
7. ❌ Inferring governance intent to bypass alignment check
8. ❌ Suppressing alignment failures

---

## 15. Conclusion

The Agent Self-Governance Protocol establishes the foundational discipline for all agent operations: verify alignment with canonical governance before proceeding with work. This protocol ensures governance drift is detected early, corrected systematically when authorized, and escalated correctly when not authorized.

**Governance defines structure. Alignment ensures correctness. Attestation provides auditability.**

---

**End of AGENT_SELF_GOVERNANCE_PROTOCOL.md**

---

**Document Metadata**:
- Policy ID: AGENT_SELF_GOVERNANCE_PROTOCOL_V1
- Authority: Canonical Governance Protocol
- Effective Date: 2026-01-21
- Required By: GOVERNANCE_PURPOSE_AND_SCOPE.md
- Integration: AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md, GOVERNANCE_RIPPLE_MODEL.md, AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md, CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md
- Maintained By: governance-repo-administrator
- Diagrams: governance/diagrams/ (agent-self-governance-check-workflow.md, inventory-ripple-process-workflow.md, error-drift-handling-workflow.md, agent-authority-hierarchy-diagram.md)
