# GOVERNANCE RIPPLE DETECTION PROTOCOL

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

This document establishes the **canonical protocol for governance ripple signaling, detection, and response**. It defines how ripple is triggered, how agents detect ripple requirements, response time SLAs, and audit mechanisms.

This protocol exists to ensure:
- **Automatic ripple detection** - No manual tracking of governance changes
- **Reliable signaling** - Ripple requirements are clearly communicated
- **Timely response** - Ripple executed within defined SLA
- **Complete audit trail** - All ripple events tracked and verifiable
- **Zero missed ripple** - Governance changes propagate to all affected artifacts

**Core Principle**: Governance changes ripple automatically and reliably. Ripple is detected, not requested.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution requirements and workflow
- **AGENT_RIPPLE_AWARENESS_OBLIGATION.md** - Agent ripple awareness requirements
- **CROSS_REPOSITORY_RIPPLE_AWARENESS_MODEL.md** - Cross-repo ripple propagation
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and ripple triggers
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent responsibilities for ripple

---

## 3. Scope

### 3.1 In Scope

✅ **Covered by this protocol**:
- Ripple signaling mechanisms (how ripple is communicated)
- Ripple detection mechanisms (how agents detect ripple)
- Ripple trigger events (what changes trigger ripple)
- Ripple response SLA (time to execution)
- Ripple audit trail (tracking and verification)
- Ripple status tracking (in-progress, completed, failed)

### 3.2 Out of Scope

❌ **NOT covered by this protocol**:
- Ripple execution workflow (see GOVERNANCE_RIPPLE_MODEL.md)
- Ripple implementation details (see GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md)
- Agent-specific ripple responsibilities (see AGENT_RIPPLE_AWARENESS_OBLIGATION.md)
- Cross-repository layer-down details (see CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md)

---

## 4. Ripple Trigger Events

### 4.1 Mandatory Ripple Triggers

**Ripple MUST be executed when**:

1. **Constitutional Canon Changes** (Type 1 artifacts - see GOVERNANCE_ARTIFACT_TAXONOMY.md)
   - Any semantic change to constitutional canon
   - Examples: BUILD_PHILOSOPHY.md, FM_ROLE_CANON.md, WAVE_MODEL.md, LIVING_AGENT_SYSTEM.md
   - Even syntax changes if they affect interpretation

2. **Canonical Governance Documentation** (Type 2 artifacts - canon tier)
   - Changes to canonical protocols, models, policies
   - Examples: Agent protocols, gate protocols, authority models
   - If PUBLIC_API (affects multiple repos or agents)

3. **Governance Scripts with Behavioral Changes** (Type 3 artifacts)
   - Changes affecting governance automation behavior
   - Examples: Wake-up protocol, ripple script, validation scripts
   - Not for pure bug fixes (minor corrections)

4. **Canonical Governance Templates** (Type 4 artifacts - PUBLIC_API)
   - Changes to canonical templates
   - Examples: Agent contract template, wave report template
   - If widely used across repos

5. **Agent Contract Changes** (Protected artifacts)
   - Changes to `.agent.md` files in governance repo
   - Changes to `.agent.schema.md`
   - Agent contract protection protocol updates

6. **Inventory Schema Changes**
   - Changes to GOVERNANCE_INVENTORY_SCHEMA.json
   - Changes to CANON_INVENTORY.json schema
   - Changes affecting inventory structure

### 4.2 Optional Ripple Triggers

**Ripple MAY be executed when**:

1. **Operational Runbooks** (Type 2 artifacts - operational tier)
   - If runbook widely referenced
   - If change affects multiple agent classes

2. **Non-Canonical Templates** (Type 4 artifacts - INTERNAL)
   - If template used in multiple locations
   - At liaison discretion

3. **High-Impact Evidence** (Type 5 artifacts - rarely)
   - If evidence reveals systemic governance gap
   - If evidence changes governance interpretation

### 4.3 No Ripple Required

**Ripple NOT required for**:

1. **Application Code** (Type 6 artifacts)
2. **Application Tests** (Type 7 artifacts)
3. **Governance Evidence** (Type 5 artifacts - most cases)
4. **Minor Syntax Corrections** (typos, formatting)
5. **Documentation Clarifications** (non-semantic)

---

## 5. Ripple Signaling Mechanisms

### 5.1 Primary Signaling: PR Label

**Mechanism**: GitHub PR label `governance-ripple-required`

**How**:
1. **Agent detects ripple trigger** - During work or at PR creation
2. **Agent adds label** - `governance-ripple-required` to PR
3. **CI detects label** - GitHub Actions workflow triggered
4. **Ripple workflow executes** - Automated or manual ripple process

**Advantages**:
- Simple, clear, visible
- Automatable via CI/CD
- Auditable via GitHub history

**Example**:
```yaml
name: Governance Ripple Detection

on:
  pull_request:
    types: [opened, labeled, synchronize]

jobs:
  detect-ripple:
    if: contains(github.event.pull_request.labels.*.name, 'governance-ripple-required')
    runs-on: ubuntu-latest
    steps:
      - name: Notify Ripple Required
        run: echo "Governance ripple detected - triggering ripple workflow"
      - name: Execute Ripple Workflow
        run: bash .github/scripts/governance-ripple.sh
```

### 5.2 Secondary Signaling: PR Description Section

**Mechanism**: Dedicated section in PR description

**How**:
1. **Agent includes ripple section** in PR description:
   ```markdown
   ## Governance Ripple Required
   
   **Trigger**: Constitutional canon changed (BUILD_PHILOSOPHY.md)
   **Artifacts Affected**: All builder agents, all repos with Build-to-Green
   **Ripple Status**: PENDING
   **Ripple Owner**: governance-liaison
   ```

2. **CI parses PR description** - Detects `## Governance Ripple Required` section
3. **Ripple workflow triggered** - If section present

**Advantages**:
- More detailed information
- Self-documenting
- Human-readable

### 5.3 Tertiary Signaling: Ripple File in PR

**Mechanism**: Commit a ripple signal file in the PR

**How**:
1. **Agent creates file** - `governance/ripple/RIPPLE_REQUIRED_<pr-number>.md`
2. **CI detects file** - Workflow triggered by presence of file in `governance/ripple/`
3. **Ripple executed** - Based on file content
4. **File updated** - Ripple status tracked in file

**Advantages**:
- Explicit, hard to miss
- Can include detailed ripple plan
- Trackable in git history

**Example File**:
```markdown
# Governance Ripple Required

**PR**: #1234
**Date**: 2026-02-08
**Author**: governance-liaison
**Status**: PENDING

## Trigger
Constitutional canon changed: BUILD_PHILOSOPHY.md v2.0.0

## Artifacts Affected
- All builder agent contracts (30+ agents)
- All consumer repo governance inventories (5 repos)
- All builder gate protocols

## Ripple Plan
1. Update GOVERNANCE_ARTIFACT_INVENTORY.md
2. Notify all consumer repos via layer-down
3. Create ripple report
4. Update ripple status to COMPLETE

## Ripple Execution
- [ ] Inventory updated
- [ ] Repos notified
- [ ] Report generated
- [ ] Status updated
```

---

## 6. Ripple Detection Mechanisms

### 6.1 Agent-Driven Detection

**When**: During agent work session (before or after changes)

**How**:
1. **Agent reviews changes** - Identifies files modified
2. **Agent consults taxonomy** - Checks artifact type per GOVERNANCE_ARTIFACT_TAXONOMY.md
3. **Agent checks ripple trigger matrix** - Determines if ripple required
4. **Agent signals ripple** - Via PR label, description, or ripple file

**Responsibility**: ALL agents MUST perform ripple detection per AGENT_RIPPLE_AWARENESS_OBLIGATION.md

### 6.2 CI-Driven Detection

**When**: On PR open, update, or commit

**How**:
1. **CI workflow triggered** - On PR events
2. **CI scans changed files** - Extracts file paths
3. **CI classifies artifacts** - Per GOVERNANCE_ARTIFACT_TAXONOMY.md patterns (Section 14)
4. **CI checks ripple matrix** - Determines if ripple required
5. **CI signals ripple** - Adds label, creates comment, or fails check

**Example CI Logic**:
```yaml
- name: Detect Ripple Requirement
  id: ripple-detect
  run: |
    CHANGED_FILES=$(git diff --name-only origin/main...HEAD)
    RIPPLE_REQUIRED=false
    
    # Check for constitutional canon changes
    if echo "$CHANGED_FILES" | grep -qE "governance/canon/.*_CANON.md|BUILD_PHILOSOPHY.md|FM_ROLE_CANON.md|WAVE_MODEL.md|LIVING_AGENT_SYSTEM.md"; then
      RIPPLE_REQUIRED=true
    fi
    
    # Check for canonical protocol changes
    if echo "$CHANGED_FILES" | grep -qE "governance/canon/.*_PROTOCOL.md|governance/canon/.*_MODEL.md"; then
      RIPPLE_REQUIRED=true
    fi
    
    # Check for agent contract changes
    if echo "$CHANGED_FILES" | grep -qE ".agent.md$|.agent.schema.md$"; then
      RIPPLE_REQUIRED=true
    fi
    
    echo "ripple_required=$RIPPLE_REQUIRED" >> $GITHUB_OUTPUT
    
- name: Add Ripple Label
  if: steps.ripple-detect.outputs.ripple_required == 'true'
  run: gh pr edit ${{ github.event.pull_request.number }} --add-label governance-ripple-required
```

### 6.3 Human Review Detection

**When**: During CS2 or human code review

**How**:
1. **Reviewer identifies ripple trigger** - During PR review
2. **Reviewer adds label** - `governance-ripple-required`
3. **Reviewer requests ripple** - Via PR comment
4. **Agent executes ripple** - In response to reviewer request

---

## 7. Ripple Response SLA

### 7.1 Response Time Requirements

**Ripple MUST be initiated within**:

| Artifact Type | SLA (Time to Ripple Start) | Owner |
|---------------|----------------------------|-------|
| Constitutional Canon | **24 hours** | Liaison (governance repo) |
| Canonical Protocols/Models | **48 hours** | Liaison (governance repo) |
| Governance Scripts | **72 hours** | Liaison or Builder |
| Agent Contracts | **24 hours** | Liaison (governance repo) |
| Cross-Repository (Layer-Down) | **7 days** | Overseer + Liaisons |

**Ripple MUST be completed within**:

| Scope | SLA (Time to Ripple Complete) | Owner |
|-------|------------------------------|-------|
| Single Repository (Governance) | **3 days** | Liaison |
| Cross-Repository (2-5 repos) | **14 days** | Overseer + Liaisons |
| Cross-Repository (5+ repos) | **30 days** | Overseer + Liaisons |

### 7.2 SLA Tracking

**Track ripple SLA via**:
1. **Ripple signal timestamp** - When PR labeled or file created
2. **Ripple start timestamp** - When ripple execution begins
3. **Ripple complete timestamp** - When ripple report generated

**Monitor SLA via**:
- GitHub issue with `ripple-tracking` label
- Ripple status dashboard (if automated)
- Weekly ripple audit report

### 7.3 SLA Escalation

**If SLA breached**:
1. **Notify CS2** - Via escalation issue
2. **Explain delay** - Root cause analysis
3. **Provide new timeline** - Revised completion estimate
4. **Take corrective action** - Address blockers

---

## 8. Ripple Status Tracking

### 8.1 Ripple States

**Ripple transitions through states**:

```
DETECTED → PENDING → IN_PROGRESS → VALIDATING → COMPLETE → CLOSED
                ↓
           ESCALATED (if blocked)
```

**State Definitions**:

- **DETECTED** - Ripple trigger identified (PR labeled or CI detected)
- **PENDING** - Ripple acknowledged, awaiting execution
- **IN_PROGRESS** - Ripple execution in progress (artifacts being updated)
- **VALIDATING** - Ripple execution complete, validation in progress
- **COMPLETE** - Ripple validated, report generated, ready to close
- **CLOSED** - Ripple merged, PR closed, complete audit trail
- **ESCALATED** - Ripple blocked or requires CS2 intervention

### 8.2 Status Tracking Mechanisms

**Option 1: Ripple File Status**

Update ripple file (`governance/ripple/RIPPLE_REQUIRED_<pr-number>.md`) with status:

```markdown
**Status**: IN_PROGRESS
**Started**: 2026-02-08 12:00:00 UTC
**Progress**:
- [x] Inventory updated
- [x] Repos notified
- [ ] Report generated (in progress)
- [ ] Status updated
```

**Option 2: GitHub Issue Tracking**

Create GitHub issue with label `ripple-tracking`:

```markdown
# Ripple Tracking: PR #1234

**Trigger**: BUILD_PHILOSOPHY.md v2.0.0
**Status**: IN_PROGRESS
**SLA**: 3 days (due 2026-02-11)

## Progress
- [x] Ripple detected (2026-02-08 10:00 UTC)
- [x] Ripple started (2026-02-08 12:00 UTC)
- [ ] Artifacts updated
- [ ] Report generated
- [ ] Validation complete
```

**Option 3: PR Comment Updates**

Bot or agent posts comment on PR with ripple status:

```markdown
🔄 **Governance Ripple Status**: IN_PROGRESS

**Started**: 2026-02-08 12:00 UTC
**SLA**: 3 days (due 2026-02-11)
**Progress**: 50% (2 of 4 steps complete)

See ripple report: governance/ripple/ripple-report-pr-1234.md
```

---

## 9. Ripple Audit Trail

### 9.1 Audit Requirements

**Ripple audit trail MUST include**:

1. **Trigger Information**
   - What artifact changed (file, version)
   - Who made the change (author, agent)
   - When change was made (timestamp)
   - Why ripple required (trigger type)

2. **Detection Information**
   - How ripple detected (agent, CI, human)
   - When ripple detected (timestamp)
   - Who detected ripple (agent, reviewer)

3. **Execution Information**
   - When ripple started (timestamp)
   - What artifacts affected (list)
   - What changes made (summary)
   - Who executed ripple (agent, liaison)

4. **Validation Information**
   - Validation performed (checklist)
   - Validation results (pass/fail)
   - Validation timestamp

5. **Completion Information**
   - Ripple report generated (link)
   - SLA met (yes/no)
   - Final status (COMPLETE/ESCALATED)
   - Completion timestamp

### 9.2 Audit Artifacts

**Generate audit artifacts**:

1. **Ripple Report** - `governance/ripple/ripple-report-<pr-number>-<date>.md`
   - Complete ripple execution summary
   - Artifacts affected and changes made
   - Validation results
   - SLA tracking

2. **Ripple Manifest** - `governance/ripple/RIPPLE_MANIFEST.json` (aggregate tracking)
   - JSON array of all ripple events
   - Searchable, parseable
   - Historical record

3. **Git Commit History**
   - Ripple commits clearly labeled
   - Example: `[RIPPLE] Update inventory for BUILD_PHILOSOPHY.md v2.0.0`

---

## 10. Ripple Detection Examples

### 10.1 Example 1: Constitutional Canon Change

**Scenario**: Liaison updates BUILD_PHILOSOPHY.md (semantic change)

**Detection**:
1. **Agent (Liaison)** - Identifies change as Type 1 artifact (constitutional canon)
2. **Agent consults taxonomy** - GOVERNANCE_ARTIFACT_TAXONOMY.md Section 11 (Ripple Trigger Matrix)
3. **Agent confirms trigger** - Constitutional canon → Ripple REQUIRED
4. **Agent signals ripple** - Adds PR label `governance-ripple-required`
5. **CI validates** - Workflow detects label, confirms ripple requirement

**Execution**:
- Liaison executes ripple per GOVERNANCE_RIPPLE_MODEL.md
- Updates inventory, notifies repos, generates report
- Updates PR with ripple report link

### 10.2 Example 2: Governance Script Bug Fix

**Scenario**: Liaison fixes minor bug in validation script (non-behavioral change)

**Detection**:
1. **Agent (Liaison)** - Identifies change as Type 3 artifact (governance script)
2. **Agent evaluates impact** - Bug fix, no behavioral change
3. **Agent consults taxonomy** - GOVERNANCE_ARTIFACT_TAXONOMY.md Section 11
4. **Agent determines** - No ripple required (minor bug fix)
5. **Agent documents** - PR description explains why ripple not needed

**Execution**:
- No ripple executed
- PR merged after validation

### 10.3 Example 3: Agent Contract Update

**Scenario**: CS2 approves agent contract schema change

**Detection**:
1. **CI detects** - `.agent.schema.md` file modified
2. **CI classifies** - Protected artifact, canonical template
3. **CI consults taxonomy** - Agent contracts → Ripple REQUIRED
4. **CI signals** - Adds label `governance-ripple-required`, creates comment

**Execution**:
- Liaison (with CS2 approval) executes ripple
- Updates all agent contracts to new schema
- Notifies all repos with agent contracts
- Generates comprehensive ripple report

---

## 11. Ripple Failure Handling

### 11.1 Ripple Execution Failures

**If ripple execution fails**:

1. **Identify Failure Cause**
   - Technical issue (script error, dependency missing)
   - Authority issue (outside self-alignment bounds)
   - Scope issue (ripple scope too large)

2. **Escalate if Needed**
   - Technical failures → Liaison or Builder fixes
   - Authority conflicts → Escalate to CS2
   - Scope overload → Escalate to Overseer or CS2

3. **Update Ripple Status**
   - Change status to ESCALATED
   - Document failure reason
   - Provide resolution timeline

4. **Resume Ripple**
   - After blockers resolved
   - Complete ripple execution
   - Update status to COMPLETE

### 11.2 Ripple SLA Breaches

**If ripple SLA breached**:

1. **Notify CS2** - Immediately
2. **Provide RCA** - Root cause analysis
3. **Provide Revised Timeline** - New completion estimate
4. **Take Corrective Action** - Address root causes
5. **Update Tracking** - Document SLA breach and resolution

---

## 12. Cross-Repository Ripple

### 12.1 Cross-Repo Ripple Detection

**When governance change affects multiple repos**:

1. **Governance Repo Liaison** - Detects ripple trigger
2. **Liaison signals cross-repo ripple** - Via label or ripple file
3. **Liaison notifies Overseer** - Cross-repo coordination needed
4. **Overseer initiates layer-down** - Per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md
5. **Consumer Repo Liaisons** - Execute local ripple

### 12.2 Cross-Repo Tracking

**Track cross-repo ripple via**:

1. **Governance Repo** - Central ripple report
   - Lists all affected repos
   - Tracks layer-down status per repo
   - Aggregates completion status

2. **Consumer Repos** - Local ripple reports
   - Documents local changes
   - References governance repo ripple
   - Reports completion to Overseer

3. **Overseer Dashboard** - Cross-repo ripple status
   - Shows ripple progress across all repos
   - Identifies blockers
   - Tracks SLA

---

## 13. Automation & Tooling

### 13.1 Recommended Automation

**Automate where possible**:

1. **Ripple Detection** (CI/CD)
   - File path pattern matching
   - Artifact type classification
   - Ripple trigger evaluation
   - Label/comment automation

2. **Ripple Tracking** (Bot or Workflow)
   - Status updates
   - SLA monitoring
   - Progress reporting
   - Notifications

3. **Ripple Reporting** (Script)
   - Report generation
   - Manifest updates
   - Audit trail creation

### 13.2 Manual Ripple Workflow (Fallback)

**If automation unavailable**:

1. **Agent manually detects** - Reviews changes, identifies trigger
2. **Agent manually signals** - Adds PR label or creates ripple file
3. **Agent manually executes** - Per GOVERNANCE_RIPPLE_MODEL.md
4. **Agent manually reports** - Creates ripple report
5. **Agent manually tracks** - Updates status in PR or issue

---

## 14. Validation & Maintenance

### 14.1 Protocol Validation

This protocol MUST be validated:
- **Before use**: Ripple detection and signaling tested
- **After updates**: All agents re-validate ripple awareness
- **Monthly**: CS2 reviews ripple SLA metrics, audit trail

### 14.2 Protocol Evolution

**Changes to this protocol**:
- **MUST** be approved by CS2 (Johan Ras)
- **MUST** trigger governance ripple (meta-ripple!)
- **MUST** update GOVERNANCE_ARTIFACT_INVENTORY.md
- **MUST** notify all agents and update ripple workflows

---

## 15. Cross-References

### 15.1 Primary Dependencies

- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution workflow
- **AGENT_RIPPLE_AWARENESS_OBLIGATION.md** - Agent ripple responsibilities
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and ripple triggers
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent ripple gate requirements

### 15.2 Supporting Protocols

- **CROSS_REPOSITORY_RIPPLE_AWARENESS_MODEL.md** - Cross-repo ripple
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** - Layer-down mechanics
- **GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md** - Ripple execution checklist

---

## 16. Summary Decision Tree

**When making governance change**:

```
┌─────────────────────────────────┐
│ What artifact type am I changing?│
└──────────┬──────────────────────┘
           │
           ├─ Type 1 (Canon) → Ripple REQUIRED
           ├─ Type 2 (Doc - Canon) → Ripple REQUIRED
           ├─ Type 2 (Doc - Operational) → Ripple OPTIONAL
           ├─ Type 3 (Script - Behavioral) → Ripple REQUIRED
           ├─ Type 3 (Script - Bug fix) → No ripple
           ├─ Type 4 (Template - Canon) → Ripple REQUIRED
           ├─ Type 4 (Template - Operational) → Ripple OPTIONAL
           ├─ Type 5 (Evidence) → No ripple
           ├─ Type 6 (App Code) → No ripple
           └─ Type 7 (App Tests) → No ripple

If Ripple REQUIRED:
  1. Add PR label: governance-ripple-required
  2. Document in PR description
  3. Execute ripple per GOVERNANCE_RIPPLE_MODEL.md
  4. Generate ripple report
  5. Track to completion
```

---

## 17. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial canonical protocol addressing GAP-005 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly)
