# LIVING AGENT GOVERNANCE HEALTH CHECKS

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document establishes the **canonical protocol for dynamic, agent-driven governance discovery and health checking at wake-up**. It defines how agents must detect drift, missing canon, new governance, pending canon references, and session risks automatically before starting work.

This protocol exists to ensure:
- **Zero stale context** - Agents always work with current governance
- **Automatic drift detection** - Governance misalignment caught at wake-up
- **Dynamic discovery** - Agents find new/updated governance without manual intervention
- **Session-safe start** - Environment validated before work begins
- **Self-healing** - Agents auto-remediate within authority bounds

**Core Principle**: Every agent session begins with comprehensive health checks. No agent works with stale or incomplete governance context.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle, wake-up phase requirements
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check workflow
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent class validation requirements
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and properties
- **SELF_ALIGNMENT_AUTHORITY_MODEL.md** - Self-alignment vs escalation boundaries

---

## 3. Scope

### 3.1 In Scope

✅ **Covered by this protocol**:
- Wake-up health check procedure (before every session)
- Governance discovery (canonical sources, new artifacts)
- Drift detection (agent contract, governance inventory, canon)
- Environment health validation (repo state, dependencies)
- Pending canon reference detection
- Auto-remediation (within self-alignment authority)
- Health status reporting and logging

### 3.2 Out of Scope

❌ **NOT covered by this protocol**:
- Agent contract schema (see `.agent.schema.md`)
- Governance ripple execution (see GOVERNANCE_RIPPLE_MODEL.md)
- Session closure (see LIVING_AGENT_SYSTEM.md closure phase)
- Specific tool implementations (bash, python, etc.)

---

## 4. Wake-Up Health Check Workflow

### 4.1 Overview

**Trigger**: At the start of EVERY agent session, BEFORE any work begins.

**Execution**: Automated via wake-up protocol script (`.github/scripts/wake-up-protocol.sh` or equivalent).

**Output**: 
- Working contract (`working-contract.md`) with session-specific context
- Environment health report (`environment-health.json`)
- Console confirmation of readiness state
- Escalation files (if issues detected outside self-alignment authority)

### 4.2 Health Check Phases

The wake-up health check consists of **7 sequential phases**:

```
Phase 1: Self-Identification
      ↓
Phase 2: Memory Scan
      ↓
Phase 3: Governance Discovery
      ↓
Phase 4: Environment Health Check
      ↓
Phase 5: Drift Detection & Analysis
      ↓
Phase 6: Auto-Remediation (if applicable)
      ↓
Phase 7: Working Contract Generation
```

---

## 5. Phase 1: Self-Identification

### 5.1 Purpose

Load agent identity, class, mission, and authority boundaries.

### 5.2 Procedure

1. **Read Agent Contract**
   - Location: `.github/agents/<agent-name>.agent.md` or `governance/agents/<agent-name>.agent.md`
   - Extract: Agent class (overseer, liaison, builder, foreman)
   - Extract: Agent mission and responsibilities
   - Extract: Authority boundaries (from Section 13: LOCKED SECTIONS per `.agent.schema.md`)

2. **Validate Agent Contract**
   - Schema compliance (per `.agent.schema.md`)
   - Required sections present
   - Locked sections present (if agent contract)

3. **Load Authority Model**
   - Reference: SELF_ALIGNMENT_AUTHORITY_MODEL.md
   - Identify: Self-alignment authority for this agent class
   - Identify: Escalation triggers for this agent class

### 5.3 Success Criteria

✅ Agent contract loaded successfully  
✅ Agent class identified  
✅ Authority boundaries understood  
✅ No schema violations detected

### 5.4 Failure Handling

❌ **If agent contract missing or invalid**:
- Log error to console
- Create escalation: `escalation-missing-agent-contract-YYYYMMDD-HHMMSS.md`
- **HALT** - Cannot proceed without agent identity

---

## 6. Phase 2: Memory Scan

### 6.1 Purpose

Load recent session memories to provide continuity and context.

### 6.2 Procedure

1. **Scan Memory Directory**
   - Location: `.agent-workspace/<agent-id>/memory/`
   - Find: Last 5 session memory files (`session-*.md`)
   - Sort: By date (most recent first)

2. **Extract Key Information**
   - Tasks completed in recent sessions
   - Patterns discovered
   - Lessons learned
   - Escalations created
   - Governance gaps identified

3. **Load Escalation Inbox**
   - Location: `.agent-workspace/<agent-id>/escalation-inbox/`
   - Find: Pending escalations (unresolved)
   - Count: Number of pending escalations

4. **Load Big Picture Context**
   - Location: `.agent-workspace/<agent-id>/context/system-purpose.md`
   - Create if missing (bootstrap)

### 6.3 Success Criteria

✅ Memory directory scanned  
✅ Last 5 sessions summarized  
✅ Escalation inbox checked  
✅ Big picture context loaded

### 6.4 Failure Handling

⚠️ **If memory directory missing**:
- Create directory structure
- Initialize empty memory (first session)
- Log: "No previous sessions found - bootstrapping memory"

---

## 7. Phase 3: Governance Discovery

### 7.1 Purpose

Discover canonical governance sources, load current governance, detect new or updated artifacts.

### 7.2 Procedure

1. **Identify Governance Repository**
   - Primary: `maturion-foreman-governance` repo
   - Local: Check if current repo is governance repo
   - Remote: If consumer repo, identify governance source

2. **Load Governance Inventory**
   - File: `GOVERNANCE_ARTIFACT_INVENTORY.md`
   - Count: Total governance artifacts
   - Extract: Artifact list, categories, locations

3. **Load Canon Manifest**
   - File: `governance/CANON_INVENTORY.json` (if exists)
   - Fallback: Scan `governance/canon/` directory
   - Count: Constitutional canon artifacts
   - Extract: Canon file list, versions

4. **Detect New Governance**
   - Compare: Current inventory vs last session inventory (from memory)
   - Identify: New artifacts added since last session
   - Identify: Artifacts updated since last session (version changes)

5. **Validate Critical Canon Presence**
   - Required canon (per AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md):
     - `BUILD_PHILOSOPHY.md`
     - `FM_ROLE_CANON.md` (or `governance/maturion/FM_ROLE_CANON.md`)
     - `WAVE_MODEL.md`
     - `LIVING_AGENT_SYSTEM.md`
     - `AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md`
     - `GOVERNANCE_ARTIFACT_TAXONOMY.md`
     - `SELF_ALIGNMENT_AUTHORITY_MODEL.md`
   - Verify: Each required canon exists and is readable

6. **Detect Pending Canon References**
   - Scan: Agent contract and recent work for references to non-existent files
   - Example: References to files marked "PENDING" or "TBD"
   - Flag: Pending canon references that may affect work

### 7.3 Success Criteria

✅ Governance repository identified  
✅ Governance inventory loaded  
✅ Canon manifest loaded  
✅ New governance detected (if any)  
✅ Critical canon validated  
✅ Pending references identified (if any)

### 7.4 Failure Handling

❌ **If governance inventory missing**:
- Log warning: "GOVERNANCE_ARTIFACT_INVENTORY.md not found"
- Attempt: Scan `governance/` directory as fallback
- Flag: Inventory drift (governance not fully tracked)

❌ **If critical canon missing**:
- Log error: "Critical canon missing: <file>"
- Create escalation: `escalation-missing-critical-canon-YYYYMMDD-HHMMSS.md`
- **HALT** or **WARN** depending on agent class and work type

⚠️ **If pending canon referenced**:
- Log warning: "Work may reference pending canon: <file>"
- Include in working contract: Limitation note
- Proceed with caution (validate assumptions)

---

## 8. Phase 4: Environment Health Check

### 8.1 Purpose

Validate repository state, dependencies, and environment readiness before work begins.

### 8.2 Procedure

1. **Git Repository Health**
   ```bash
   # Check for uncommitted changes
   git status --porcelain
   
   # Check current branch
   git rev-parse --abbrev-ref HEAD
   
   # Check if up-to-date with origin
   git fetch --dry-run
   
   # Check for trailing whitespace (governance quality)
   git diff --check
   ```

2. **Governance Artifact Validation**
   ```bash
   # Validate JSON files
   find governance -name "*.json" -exec jq empty {} \;
   
   # Validate YAML files
   find governance -name "*.yml" -o -name "*.yaml" -exec yamllint {} \;
   
   # Check markdown syntax (if linter available)
   find governance -name "*.md" -exec markdownlint {} \;
   ```

3. **Dependency Check** (if applicable)
   - Node: Check `package.json` and `node_modules/`
   - Python: Check `requirements.txt` and virtual env
   - Other: Check language-specific dependencies

4. **CI/CD Workflow Health** (if applicable)
   - Validate `.github/workflows/*.yml` syntax
   - Check for workflow errors (if CI history available)

5. **Protected File Detection**
   - Scan for uncommitted changes to protected files
   - Protected patterns:
     - `.github/workflows/`
     - `BUILD_PHILOSOPHY.md`
     - `FM_ROLE_CANON.md`
     - `WAVE_MODEL.md`
     - Agent contracts (`.agent.md`)

### 8.3 Success Criteria

✅ Repository in clean state  
✅ No uncommitted changes (or documented if expected)  
✅ No trailing whitespace  
✅ All JSON/YAML valid  
✅ Dependencies up-to-date (if checked)  
✅ No protected file modifications uncommitted

### 8.4 Failure Handling

❌ **If repository dirty (uncommitted changes)**:
- Log warning: "Uncommitted changes detected"
- List: Files with changes
- **Decide**: Proceed if changes are expected (in-progress work), halt if unexpected

❌ **If JSON/YAML invalid**:
- Log error: "Invalid JSON/YAML: <file>"
- **HALT** - Environment not safe
- Create escalation: `escalation-invalid-governance-syntax-YYYYMMDD-HHMMSS.md`

❌ **If protected files modified**:
- Log warning: "Protected files modified: <files>"
- Flag: Requires CS2 approval before merge
- Proceed if agent authorized for protected changes, else escalate

---

## 9. Phase 5: Drift Detection & Analysis

### 9.1 Purpose

Detect governance drift, agent contract misalignment, inventory inconsistencies, and stale context.

### 9.2 Drift Types

**Type A: Agent Contract Drift**
- Agent contract version mismatch
- Agent contract references missing governance
- Agent locked sections modified (if protected)

**Type B: Governance Inventory Drift**
- Governance files exist but not tracked in inventory
- Inventory references non-existent files
- Inventory metadata stale (last updated date)

**Type C: Canon Version Drift**
- Agent contract expects specific canon version
- Current canon version differs
- Breaking changes in canon since last session

**Type D: Cross-Repository Drift**
- Consumer repo governance version lags governance repo
- Layer-down not completed for recent governance updates
- Ripple pending but not executed

### 9.3 Drift Detection Procedure

1. **Agent Contract Drift**
   ```bash
   # Check agent contract version vs governance canon versions
   # Compare locked sections integrity
   # Validate governance references in agent contract
   ```

2. **Inventory Drift**
   ```bash
   # Scan governance/ directory
   # Compare with GOVERNANCE_ARTIFACT_INVENTORY.md
   # Identify untracked files
   # Identify phantom entries (inventory references missing files)
   ```

3. **Canon Version Drift**
   ```bash
   # Extract version from agent contract dependencies
   # Extract version from canon file headers
   # Compare versions
   # Flag breaking changes (major version bump)
   ```

4. **Cross-Repository Drift** (if consumer repo)
   ```bash
   # Check GOVERNANCE_INVENTORY.json (consumer repo)
   # Compare governance_version with governance repo version
   # Check layer-down status file (if exists)
   # Identify pending ripple
   ```

### 9.4 Success Criteria

✅ Drift detection scan completed  
✅ Drift identified (if any)  
✅ Drift severity classified (CRITICAL, HIGH, MEDIUM, LOW)  
✅ Auto-remediation feasible (within self-alignment authority)

### 9.5 Failure Handling

⚠️ **If drift detected**:
- Proceed to Phase 6: Auto-Remediation (if within authority)
- Create escalation (if outside authority)
- Document drift in working contract

---

## 10. Phase 6: Auto-Remediation

### 10.1 Purpose

Auto-correct governance drift within self-alignment authority bounds (per SELF_ALIGNMENT_AUTHORITY_MODEL.md).

### 10.2 Auto-Remediation Rules

**Liaison May Auto-Remediate**:
- Inventory drift (update GOVERNANCE_ARTIFACT_INVENTORY.md)
- Broken cross-references (file moved, renamed)
- Syntax errors (JSON, YAML, Markdown formatting)
- Canon manifest sync (update CANON_INVENTORY.json)

**Liaison MUST Escalate**:
- Agent contract drift (protected per AGENT_CONTRACT_PROTECTION_PROTOCOL.md)
- Canon version breaking changes
- Constitutional interpretation questions
- Cross-repository drift requiring coordination

**Builder/Foreman May Auto-Remediate**:
- N/A (governance drift remediation is liaison domain)

**Overseer May Auto-Remediate**:
- Cross-repository coordination (layer-down initiation)
- Quality gate synchronization

### 10.3 Auto-Remediation Procedure

1. **Identify Remediable Drift**
   - Check drift type against self-alignment authority
   - Verify: Drift within authority bounds
   - Verify: Auto-remediation safe (no constitutional impact)

2. **Execute Remediation**
   - Fix inventory drift (update inventory file)
   - Fix broken cross-references (update paths)
   - Fix syntax errors (correct JSON/YAML/Markdown)
   - Sync canon manifest (if drift detected)

3. **Validate Remediation**
   - Re-run health checks (Phase 4)
   - Verify: Drift resolved
   - Verify: No new issues introduced

4. **Document Remediation**
   - Log: What was remediated and why
   - Include in working contract: Auto-remediation summary
   - Commit: Changes with clear commit message (if session will modify repo)

### 10.4 Success Criteria

✅ Remediable drift identified  
✅ Auto-remediation executed  
✅ Drift resolved  
✅ Validation passed

### 10.5 Failure Handling

❌ **If auto-remediation outside authority**:
- Create escalation: `escalation-drift-remediation-YYYYMMDD-HHMMSS.md`
- Include: Drift details, severity, recommended action
- Proceed with warning: Working contract notes drift limitation

❌ **If auto-remediation fails**:
- Log error: "Auto-remediation failed: <reason>"
- Escalate: `escalation-remediation-failure-YYYYMMDD-HHMMSS.md`
- **HALT** or proceed with warning (depending on drift severity)

---

## 11. Phase 7: Working Contract Generation

### 11.1 Purpose

Generate session-specific working contract with complete context, boundaries, mandate, and health status.

### 11.2 Working Contract Structure

```markdown
# Working Contract - Session <N>

**Agent**: <agent-id>  
**Class**: <agent-class>  
**Time**: <timestamp>  
**Session**: <session-number>

## My Identity
- Class: <overseer|liaison|builder|foreman>
- Mission: <agent mission>
- Authority: <self-alignment authority summary>

## Environment Status
- Health: ✅ SAFE | ⚠️ WARNINGS | ❌ UNSAFE
- Repository: <branch>, <status>
- Governance: ✅ <N> artifacts loaded
- Canon: ✅ <N> constitutional documents
- Memories: <N> sessions available
- Escalations: <N> pending

## Governance Context
- Governance Version: <version>
- Critical Canon:
  - BUILD_PHILOSOPHY.md: v<X.Y.Z>
  - FM_ROLE_CANON.md: v<X.Y.Z>
  - WAVE_MODEL.md: v<X.Y.Z>
  - LIVING_AGENT_SYSTEM.md: v<X.Y.Z>
  - (others...)
- New Since Last Session: <list or "None">

## Drift Detected
- <drift-type>: <description> | **Remediated** or **ESCALATED**
- (or "None")

## What I Can Do (This Session)
✅ <authority-1>
✅ <authority-2>
...

## What I Cannot Do (This Session)
❌ <prohibition-1>
❌ <prohibition-2>
...

## Session Mandate
✅ Environment health validated
✅ Governance loaded and current
✅ Drift detected and remediated (or escalated)
✅ Memory scanned
✅ Ready for work

## Limitations/Warnings
⚠️ <limitation-1> (if any)
⚠️ <limitation-2> (if any)

**REMEMBER**: <agent-class-specific reminders>

---
Authority: LIVING_AGENT_SYSTEM.md | Session: <N>
```

### 11.3 Success Criteria

✅ Working contract generated  
✅ All health check results included  
✅ Drift status documented  
✅ Authority boundaries clear  
✅ Limitations documented (if any)

---

## 12. Health Check Output & Logging

### 12.1 Console Output

**During wake-up, output to console**:

```
🚀 WAKING UP: <agent-id>

📋 STEP 1: Reading my identity...
  ✓ I am: <agent-class> - <agent-mission>

🧠 STEP 2: Scanning session memories...
  📂 Found <N> previous sessions
    → <date>: <task-summary>
    ...

📦 STEP 3: Discovering governance...
  ✓ Loaded <N> governance artifacts
  ✓ Loaded <N> constitutional documents
  ✓ New since last session: <N> artifacts

🏥 STEP 4: Environment health check...
  ✅ Repository: Clean, no uncommitted changes
  ✅ JSON/YAML: All valid
  ✅ Dependencies: Up-to-date

🔍 STEP 5: Drift detection...
  ✓ Agent contract: Aligned
  ⚠️  Inventory drift: 3 untracked files detected
  ✓ Canon versions: Current

🔧 STEP 6: Auto-remediation...
  ✓ Updated GOVERNANCE_ARTIFACT_INVENTORY.md
  ✓ Drift resolved

📜 STEP 7: Generating working contract...
  ✓ Working contract: .agent-workspace/<agent-id>/working-contract.md

╔═══════════════════════════════════════════════╗
║  WAKE-UP COMPLETE - READ YOUR WORKING CONTRACT
╚═══════════════════════════════════════════════╝

📖 cat .agent-workspace/<agent-id>/working-contract.md
```

### 12.2 Health Status File

**Generate**: `.agent-workspace/<agent-id>/environment-health.json`

```json
{
  "timestamp": "2026-02-08T12:00:00Z",
  "session_id": "session-001-20260208",
  "agent_id": "governance-repo-administrator",
  "agent_class": "liaison",
  "health_status": "SAFE",
  "checks": {
    "self_identification": { "status": "PASS" },
    "memory_scan": { "status": "PASS", "sessions_found": 3 },
    "governance_discovery": { "status": "PASS", "artifacts_loaded": 441, "canon_loaded": 120 },
    "environment_health": { "status": "PASS" },
    "drift_detection": { 
      "status": "WARN", 
      "drifts": [
        { "type": "inventory_drift", "severity": "MEDIUM", "remediated": true }
      ]
    },
    "auto_remediation": { "status": "PASS", "remediations": 1 }
  },
  "governance_version": "5.0.0",
  "critical_canon_versions": {
    "BUILD_PHILOSOPHY.md": "1.0.0",
    "FM_ROLE_CANON.md": "1.0.0",
    "WAVE_MODEL.md": "1.0.0",
    "LIVING_AGENT_SYSTEM.md": "1.0.0"
  },
  "escalations_pending": 0,
  "warnings": [],
  "working_contract_path": ".agent-workspace/governance-repo-administrator/working-contract.md"
}
```

---

## 13. Escalation Triggers

### 13.1 HALT Session (Cannot Proceed)

**Escalate and HALT if**:
- Agent contract missing or invalid
- Critical canon missing (BUILD_PHILOSOPHY, FM_ROLE_CANON, etc.)
- Environment unsafe (invalid JSON/YAML, corrupted governance)
- Drift outside self-alignment authority AND high severity

### 13.2 WARN and Proceed (Non-Blocking)

**Escalate but proceed if**:
- Inventory drift (remediable but high volume)
- Pending canon references (work may be affected)
- Non-critical governance missing
- Cross-repository drift (layer-down needed)

---

## 14. Implementation Guidance

### 14.1 Wake-Up Protocol Script

**Location**: `.github/scripts/wake-up-protocol.sh` (or language-specific)

**Requirements**:
- Execute all 7 phases sequentially
- Generate working contract and health status JSON
- Output clear console summary
- Exit with code 0 (success) or non-zero (failure)

**Example Structure**:

```bash
#!/bin/bash
# Wake-Up Protocol - Living Agent System

AGENT_ID="<agent-id>"
WORKSPACE=".agent-workspace/$AGENT_ID"
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")

# Phase 1: Self-Identification
echo "📋 STEP 1: Reading my identity..."
# ... (load agent contract, validate schema)

# Phase 2: Memory Scan
echo "🧠 STEP 2: Scanning session memories..."
# ... (scan memory directory, load last 5 sessions)

# Phase 3: Governance Discovery
echo "📦 STEP 3: Discovering governance..."
# ... (load inventory, canon manifest, detect new)

# Phase 4: Environment Health Check
echo "🏥 STEP 4: Environment health check..."
# ... (git status, JSON/YAML validation, etc.)

# Phase 5: Drift Detection
echo "🔍 STEP 5: Drift detection..."
# ... (detect agent, inventory, canon, cross-repo drift)

# Phase 6: Auto-Remediation
echo "🔧 STEP 6: Auto-remediation..."
# ... (remediate within authority, escalate if outside)

# Phase 7: Working Contract Generation
echo "📜 STEP 7: Generating working contract..."
# ... (generate working contract from template)

echo "╔═════════════════════════════════════════════╗"
echo "║  WAKE-UP COMPLETE"
echo "╚═════════════════════════════════════════════╝"

exit 0
```

### 14.2 Agent Integration

**In agent instructions/contract**:

```markdown
## Before Starting Any Work

MANDATORY: Execute wake-up protocol

```bash
bash .github/scripts/wake-up-protocol.sh
cat .agent-workspace/<agent-id>/working-contract.md
```

Read your working contract. It contains:
- Current governance context
- Your authority boundaries
- Environment health status
- Drift status and remediations
- Session mandate and limitations

**Follow your working contract, not your agent file.**
```

---

## 15. Validation & Maintenance

### 15.1 Protocol Validation

This protocol MUST be validated:
- **Before use**: Wake-up script tested in all agent classes
- **After updates**: All agents re-validate wake-up procedure
- **Quarterly**: CS2 reviews for gaps, ambiguities, improvements

### 15.2 Protocol Evolution

**Changes to this protocol**:
- **MUST** be approved by CS2 (Johan Ras)
- **MUST** trigger governance ripple (affects all agents)
- **MUST** update GOVERNANCE_ARTIFACT_INVENTORY.md
- **MUST** notify all agents and update wake-up scripts

---

## 16. Cross-References

### 16.1 Primary Dependencies

- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle, wake-up phase
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check workflow
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent class definitions
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types
- **SELF_ALIGNMENT_AUTHORITY_MODEL.md** - Auto-remediation authority

### 16.2 Supporting Protocols

- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** - Protected artifact rules
- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** - Cross-repo governance

---

## 17. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial canonical protocol addressing GAP-004 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly)
