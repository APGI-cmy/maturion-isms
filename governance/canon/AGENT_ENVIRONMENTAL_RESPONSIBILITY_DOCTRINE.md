# AGENT ENVIRONMENTAL RESPONSIBILITY DOCTRINE

## Status
**Type**: Constitutional Canon  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.1.0  
**Effective Date**: 2026-02-14  
**Last Updated**: 2026-02-14  
**Owner**: Maturion Engineering Leadership  
**Precedence**: Tier-0 Constitutional Canon - Supreme Authority  
**Applies To**: All Agents, All Repositories, All Sessions  
**Layer-Down Status**: PUBLIC_API (ripples to all consumer repositories)

---

## 1. Purpose

This constitutional canon establishes the mandatory pre-task environmental health scanning, autonomous remediation, escalation, and full auditability requirements for all agents in the Living Agent System. It ensures agents are truly autonomous and responsible for their operating environment before beginning any work.

**Core Principle**: Every agent MUST verify and remediate their environment health BEFORE starting any work. Agents are responsible stewards of their workspace, not just task executors.

This doctrine ensures:
- **Pre-Task Health Scanning**: Agents scan their environment before work begins
- **Autonomous Remediation**: Agents fix common issues without human intervention
- **Intelligent Escalation**: Agents escalate only what they cannot autonomously resolve
- **Full Auditability**: All environment checks, remediations, and escalations are logged
- **Session Continuity**: Environment health state persists across sessions
- **Zero Environment Debt**: Agents leave their environment in a safe, healthy state

---

## 2. Constitutional Authority

This doctrine derives authority from and implements:
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle and wake-up protocol foundation
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check requirements
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance as canonical memory
- **CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md** - Canon verification obligations
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** - Learning capture requirements

This doctrine is a **Tier-0 Constitutional Canon** and takes precedence over all agent contract provisions, except where explicitly deferred to CS2 authority.

---

## 3. Core Definitions

### 3.1 Environment Health

**Environment Health** encompasses:
- **Workspace Structure**: Proper directory structure per LIVING_AGENT_SYSTEM.md
- **Memory Integrity**: Memory files present, rotated correctly, not corrupted
- **Governance Alignment**: CANON_INVENTORY.json present and valid
- **Git State**: Working tree clean or expected state, branch known
- **Escalation Inbox**: Pending escalations identified and acknowledged
- **Personal Learning Files**: Lessons, patterns, anti-patterns files exist
- **Context Files**: Big-picture context files present and readable
- **Environment Health Log**: Previous health check status available

### 3.2 Autonomous Remediation

**Autonomous Remediation** is the agent's authority to:
- Create missing workspace directories
- Initialize missing personal learning files with templates
- Rotate memory files when > 5 sessions exist
- Create missing context files with appropriate templates
- Fix file permissions on workspace files
- Clean up temporary files in agent workspace
- Archive old escalations to `resolved/` subdirectory
- Validate and repair `.gitignore` entries for workspace

### 3.3 Escalation-Required Issues

**Escalation-Required Issues** that agents MUST NOT autonomously fix:
- Missing or invalid CANON_INVENTORY.json
- Corrupted memory files (content unreadable)
- Missing agent contract file
- Git repository corruption
- Uncommitted changes in protected files (governance/canon/*, .github/agents/*)
- Branch protection violations
- Workspace permissions failures that cannot be self-remediated
- Environment health failures that block wake-up protocol completion

---

## 4. Mandatory Pre-Task Environment Scan

### 4.1 When Environment Scan Applies

**Trigger**: BEFORE EVERY SESSION - All agents MUST perform environment health scanning as part of the wake-up protocol.

**Integration Point**: Environment scan is Step 4.5 in the wake-up protocol (after Environment Check, before Gap Analysis).

**No Exceptions**: This scan is mandatory regardless of:
- Agent type or role
- Job urgency or priority
- Previous successful health checks
- Confidence in environment state

### 4.2 Environment Scan Workflow

```
STEP 4.5: ENVIRONMENT HEALTH SCAN (Mandatory Pre-Task Check)
     ┌──────────────────┐
     │ Scan Workspace   │
     │ Structure        │
     └────────┬─────────┘
              ↓
     ┌──────────────────┐
     │ Check Memory     │
     │ Integrity        │
     └────────┬─────────┘
              ↓
     ┌──────────────────┐
     │ Validate         │
     │ Learning Files   │
     └────────┬─────────┘
              ↓
     ┌──────────────────┐
     │ Verify Context   │
     │ Files            │
     └────────┬─────────┘
              ↓
   ┌──────────┴────────────┐
   │                       │
HEALTHY               DEGRADED
   │                       │
   ↓                       ↓
┌──────────┐      ┌────────────────┐
│ Log      │      │ Attempt        │
│ HEALTHY  │      │ Autonomous     │
│ Continue │      │ Remediation    │
└──────────┘      └────────┬───────┘
                           ↓
                  ┌────────┴────────┐
                  │                 │
            REMEDIATED        FAILED TO
                  │           REMEDIATE
                  ↓                 ↓
          ┌───────────┐    ┌──────────────┐
          │ Log       │    │ HALT Work    │
          │ REMEDIATED│    │ Create       │
          │ Continue  │    │ Escalation   │
          └───────────┘    │ Block Session│
                           │ Log CRITICAL │
                           └──────────────┘
```

### 4.3 Environment Scan Checklist

Agents MUST check the following in order:

**1. Workspace Structure**
- [ ] `.agent-workspace/<agent-type>/` exists
- [ ] `memory/` subdirectory exists
- [ ] `memory/.archive/` subdirectory exists
- [ ] `personal/` subdirectory exists
- [ ] `context/` subdirectory exists
- [ ] `escalation-inbox/` subdirectory exists
- [ ] `escalation-inbox/resolved/` subdirectory exists

**2. Memory Integrity**
- [ ] At least 0 session files exist in `memory/` (first session is valid)
- [ ] Maximum 5 session files exist in `memory/` (rotation required if > 5)
- [ ] Session files are readable and not corrupted
- [ ] Archived sessions are in `memory/.archive/` if applicable

**3. Personal Learning Files**
- [ ] `personal/lessons-learned.md` exists
- [ ] `personal/patterns.md` exists
- [ ] `personal/efficiency-log.md` exists
- [ ] `personal/anti-patterns.md` exists

**4. Context Files**
- [ ] `context/system-purpose.md` exists
- [ ] `context/architecture.md` exists
- [ ] `context/agent-role.md` exists

**5. Environment Health Log**
- [ ] `environment-health.json` exists (from previous session) OR is first session
- [ ] If exists, file is valid JSON and readable

**6. Escalation Inbox**
- [ ] Check for pending escalations in `escalation-inbox/`
- [ ] Log count of pending escalations

**7. Git State**
- [ ] Working tree state known (clean or expected changes)
- [ ] Current branch identified
- [ ] No unexpected changes in protected paths

---

## 5. Autonomous Remediation Rules

### 5.1 Remediation Authority

Agents have **full autonomous authority** to remediate the following issues:

#### 5.1.1 Missing Workspace Directories
**Issue**: Required workspace subdirectories do not exist  
**Remediation**: Create missing directories with `mkdir -p`  
**Logging**: `[REMEDIATED] Created missing workspace directory: <path>`

#### 5.1.2 Missing Personal Learning Files
**Issue**: Required personal learning files do not exist  
**Remediation**: Create files from templates (see Section 8)  
**Logging**: `[REMEDIATED] Initialized missing personal file: <filename>`

#### 5.1.3 Missing Context Files
**Issue**: Required context files do not exist  
**Remediation**: Create files from templates (see Section 8)  
**Logging**: `[REMEDIATED] Initialized missing context file: <filename>`

#### 5.1.4 Memory Rotation Required
**Issue**: More than 5 session files exist in `memory/`  
**Remediation**: Move oldest sessions to `memory/.archive/` keeping only 5 most recent  
**Logging**: `[REMEDIATED] Rotated N old session files to archive`

#### 5.1.5 Old Resolved Escalations
**Issue**: Resolved escalations still in `escalation-inbox/` (not in `resolved/`)  
**Remediation**: Move resolved escalations to `escalation-inbox/resolved/`  
**Logging**: `[REMEDIATED] Archived N resolved escalations`

### 5.2 Remediation Procedure

```bash
# Pseudo-code for autonomous remediation
for each HEALTH_CHECK in CHECKLIST:
    result = perform_check(HEALTH_CHECK)
    
    if result == FAIL:
        if issue in AUTONOMOUS_REMEDIATION_AUTHORITY:
            success = attempt_remediation(issue)
            
            if success:
                log("[REMEDIATED] Fixed: " + issue)
                environment_health_log.append({
                    "timestamp": NOW,
                    "issue": issue,
                    "remediation": "autonomous",
                    "status": "success"
                })
            else:
                log("[FAILED REMEDIATION] Could not fix: " + issue)
                escalate_to_cs2(issue)
                HALT_SESSION()
        else:
            log("[ESCALATION REQUIRED] Issue requires CS2: " + issue)
            escalate_to_cs2(issue)
            HALT_SESSION()
```

---

## 6. Escalation Requirements

### 6.1 Escalation Triggers

Agents MUST escalate (create escalation file and HALT session) when:

1. **Missing CANON_INVENTORY.json**: Cannot verify governance alignment
2. **Corrupted Memory Files**: Session files exist but cannot be read
3. **Missing Agent Contract**: Own `.agent.md` file not found
4. **Git Repository Corruption**: Git commands fail or repository state invalid
5. **Protected File Changes**: Uncommitted changes in `governance/canon/*` or `.github/agents/*`
6. **Failed Autonomous Remediation**: Attempted fix failed and cannot proceed
7. **Workspace Permission Failures**: Cannot create/write to workspace directories
8. **Environment Health CRITICAL**: Multiple health checks failed and cannot remediate

### 6.2 Escalation File Format

Agents MUST create escalation files in `.agent-workspace/<agent-type>/escalation-inbox/` with this format:

**Filename**: `blocker-environment-YYYYMMDD-HHMMSS.md`

**Content**:
```markdown
# Environment Health Escalation

## Type
ENVIRONMENT_HEALTH_CRITICAL

## Issue Summary
<One-line description of the issue>

## Environment Scan Results
<Output from health scan showing what failed>

## Attempted Remediation
<What autonomous remediation was attempted, if any>

## Impact
- Cannot proceed with session
- Work HALTED pending remediation
- Agent workspace in degraded state

## Recommendation
<Specific action needed from CS2 or human operator>

## Session Context
- **Agent**: <agent-type>
- **Session**: <timestamp>
- **Branch**: <branch-name>
- **Task**: <task description if available>

---
Created: <timestamp> | Authority: AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md v1.0.0
```

### 6.3 Escalation Response Time

- **CRITICAL** escalations (session halted): CS2 response required within 4 hours
- **HIGH** escalations (degraded mode): CS2 response required within 24 hours
- **MEDIUM** escalations (advisory): CS2 response required within 72 hours

---

## 7. Environment Health Logging

### 7.1 Environment Health JSON Format

Agents MUST update `environment-health.json` after each health scan:

```json
{
  "timestamp": "2026-02-14T08:00:00Z",
  "session_id": "20260214-080000",
  "agent": {
    "type": "governance-repo-administrator",
    "id": "gov-admin-001",
    "class": "administrator"
  },
  "environment": {
    "workspace_structure": "HEALTHY",
    "memory_integrity": "HEALTHY",
    "personal_learning_files": "HEALTHY",
    "context_files": "HEALTHY",
    "escalation_inbox": "HEALTHY",
    "git_state": "HEALTHY"
  },
  "remediation_log": [
    {
      "timestamp": "2026-02-14T08:00:05Z",
      "issue": "missing_personal_file",
      "file": "personal/lessons-learned.md",
      "action": "created_from_template",
      "status": "success"
    }
  ],
  "overall_health": "HEALTHY",
  "session_can_proceed": true,
  "escalations_created": [],
  "next_scan_required": "2026-02-15T08:00:00Z"
}
```

### 7.2 Health Status Values

- **HEALTHY**: All checks passed, no issues detected
- **REMEDIATED**: Issues detected and successfully fixed autonomously
- **DEGRADED**: Issues detected, some remediations failed, session can proceed with caution
- **CRITICAL**: Issues detected that block session start, escalation required

### 7.3 Audit Trail

All environment health scans, remediations, and escalations MUST be logged in:
1. `environment-health.json` (current state)
2. Session memory file (historical record)
3. Console output during wake-up protocol (real-time visibility)

---

## 8. Template Files for Autonomous Remediation

### 8.1 Personal Learning File Templates

#### `personal/lessons-learned.md`
```markdown
# Lessons Learned

*Mistakes to avoid in future sessions*

---

*(No lessons yet - first session)*
```

#### `personal/patterns.md`
```markdown
# Recurring Patterns

*Patterns observed across sessions*

---

*(No patterns yet - first session)*
```

#### `personal/efficiency-log.md`
```markdown
# Efficiency Log

*Process improvements and optimization opportunities*

---

*(No efficiency notes yet - first session)*
```

#### `personal/anti-patterns.md`
```markdown
# Anti-Patterns

*Things that don't work - avoid these*

---

*(No anti-patterns documented yet - first session)*
```

### 8.2 Context File Templates

#### `context/system-purpose.md`
```markdown
# System Purpose

*This file should contain the overall purpose and goals of the system this agent operates within.*

## Repository Context

[To be populated during first session or from agent contract]

---

*(Initialized by environment health scan)*
```

#### `context/architecture.md`
```markdown
# System Architecture

*This file should contain high-level architecture understanding.*

## Repository Structure

[To be populated during first session]

---

*(Initialized by environment health scan)*
```

#### `context/agent-role.md`
```markdown
# Agent Role

*This agent's role, responsibilities, and integration points*

## Primary Responsibilities

[To be populated from agent contract]

---

*(Initialized by environment health scan)*
```

---

## 9. Integration with Wake-Up Protocol

### 9.1 Enhanced Wake-Up Protocol Sequence

The wake-up protocol (`.github/scripts/wake-up-protocol.sh`) MUST be updated to include:

**Current Steps**:
1. Self-Identification
2. Memory Scan
3. Context Load
4. Environment Check
5. Gap Analysis
6. Working Contract Generation
7. Escalation Check
8. Health Assessment

**NEW Step 4.5** (inserted after Step 4, before Step 5):
**4.5. Environment Health Scan & Remediation**
- Execute environment health checklist
- Attempt autonomous remediation for any issues
- Log all remediations
- Create escalation if remediation fails
- Update environment-health.json
- HALT if CRITICAL issues detected

### 9.2 Wake-Up Protocol Script Enhancement

Add to `.github/scripts/wake-up-protocol.sh`:

```bash
###############################################################################
# Step 4.5: Environment Health Scan & Remediation (NEW)
###############################################################################

environment_health_scan() {
    log_info "Step 4.5: Environment Health Scan & Remediation"
    
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local health_status="HEALTHY"
    local remediation_log=()
    
    # Check workspace structure
    local required_dirs=(
        "${agent_workspace}/memory"
        "${agent_workspace}/memory/.archive"
        "${agent_workspace}/personal"
        "${agent_workspace}/context"
        "${agent_workspace}/escalation-inbox"
        "${agent_workspace}/escalation-inbox/resolved"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            log_warning "Missing directory: $dir"
            mkdir -p "$dir"
            log_success "[REMEDIATED] Created directory: $dir"
            health_status="REMEDIATED"
            remediation_log+=("{\"issue\": \"missing_directory\", \"path\": \"$dir\", \"status\": \"created\"}")
        fi
    done
    
    # Check personal learning files
    check_and_create_file "${agent_workspace}/personal/lessons-learned.md" \
        "# Lessons Learned\n\n*Mistakes to avoid in future sessions*\n\n---\n\n*(No lessons yet - first session)*"
    
    check_and_create_file "${agent_workspace}/personal/patterns.md" \
        "# Recurring Patterns\n\n*Patterns observed across sessions*\n\n---\n\n*(No patterns yet - first session)*"
    
    check_and_create_file "${agent_workspace}/personal/efficiency-log.md" \
        "# Efficiency Log\n\n*Process improvements and optimization opportunities*\n\n---\n\n*(No efficiency notes yet - first session)*"
    
    check_and_create_file "${agent_workspace}/personal/anti-patterns.md" \
        "# Anti-Patterns\n\n*Things that don't work - avoid these*\n\n---\n\n*(No anti-patterns documented yet - first session)*"
    
    # Check context files
    check_and_create_file "${agent_workspace}/context/system-purpose.md" \
        "# System Purpose\n\n*Repository and system context*\n\n---\n\n*(Initialized by environment health scan)*"
    
    check_and_create_file "${agent_workspace}/context/architecture.md" \
        "# System Architecture\n\n*High-level architecture understanding*\n\n---\n\n*(Initialized by environment health scan)*"
    
    check_and_create_file "${agent_workspace}/context/agent-role.md" \
        "# Agent Role: ${AGENT_TYPE}\n\n${AGENT_DESCRIPTION}\n\n---\n\n*(Initialized by environment health scan)*"
    
    # Check memory rotation (max 5 sessions)
    local memory_dir="${agent_workspace}/memory"
    local session_count=$(find "$memory_dir" -maxdepth 1 -name "session-*.md" 2>/dev/null | wc -l)
    
    if [ "$session_count" -gt 5 ]; then
        log_warning "Memory rotation required: $session_count sessions (max 5)"
        local sessions_to_archive=$((session_count - 5))
        find "$memory_dir" -maxdepth 1 -name "session-*.md" | sort | head -n "$sessions_to_archive" | while read -r session; do
            mv "$session" "$memory_dir/.archive/"
            log_success "[REMEDIATED] Archived session: $(basename "$session")"
        done
        health_status="REMEDIATED"
    fi
    
    # Check CANON_INVENTORY.json (ESCALATION if missing)
    if [ ! -f "$CANON_INVENTORY_MANIFEST" ]; then
        log_error "CRITICAL: CANON_INVENTORY.json missing - cannot verify governance alignment"
        create_environment_escalation "missing_canon_inventory" \
            "CANON_INVENTORY.json not found at $CANON_INVENTORY_MANIFEST" \
            "Session HALTED - cannot proceed without governance alignment verification"
        health_status="CRITICAL"
        return 1
    fi
    
    # Log overall health status
    log_success "Environment Health: $health_status"
    export ENVIRONMENT_HEALTH_STATUS="$health_status"
}

check_and_create_file() {
    local filepath="$1"
    local content="$2"
    
    if [ ! -f "$filepath" ]; then
        log_warning "Missing file: $filepath"
        echo -e "$content" > "$filepath"
        log_success "[REMEDIATED] Created file: $(basename "$filepath")"
        health_status="REMEDIATED"
    fi
}

create_environment_escalation() {
    local issue_type="$1"
    local summary="$2"
    local impact="$3"
    
    local escalation_file="${WORKSPACE_ROOT}/${AGENT_TYPE}/escalation-inbox/blocker-environment-${SESSION_TIMESTAMP}.md"
    
    cat > "$escalation_file" <<EOF
# Environment Health Escalation

## Type
ENVIRONMENT_HEALTH_CRITICAL

## Issue Summary
$summary

## Issue Type
$issue_type

## Impact
$impact

## Attempted Remediation
Autonomous remediation not authorized for this issue type.

## Recommendation
CS2 intervention required to resolve critical environment issue.

## Session Context
- **Agent**: ${AGENT_TYPE}
- **Session**: ${SESSION_TIMESTAMP}
- **Branch**: ${CURRENT_BRANCH}

---
Created: $(date -u +"%Y-%m-%dT%H:%M:%SZ") | Authority: AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md v1.0.0
EOF
    
    log_error "Escalation created: $escalation_file"
}
```

---

## 10. LOCKED Section Requirement for All Agent Contracts

### 10.1 Mandatory LOCKED Section

All agent contracts (`.github/agents/*.agent.md`) MUST include a LOCKED section titled:

```markdown
## Environmental Responsibility (LOCKED)

**Authority**: AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md v1.0.0  
**Status**: LOCKED - Cannot be modified without CS2 approval

This agent MUST:
1. Execute environment health scan during wake-up protocol (Step 4.5)
2. Attempt autonomous remediation for issues within authority
3. Create escalation and HALT session for issues requiring CS2
4. Log all environment checks, remediations, and escalations
5. Update environment-health.json after each scan
6. Maintain audit trail in session memory

**Autonomous Remediation Authority**:
- Create missing workspace directories
- Initialize missing personal learning files
- Initialize missing context files
- Rotate memory files (keep 5 most recent)
- Archive resolved escalations

**Escalation Required For**:
- Missing CANON_INVENTORY.json
- Corrupted memory files
- Missing agent contract file
- Git repository corruption
- Protected file changes
- Failed autonomous remediation
- Workspace permission failures

**Non-Compliance**: Attempting to skip environment health scan or bypass escalation requirements violates constitutional canon and will result in session termination and CS2 review.
```

### 10.2 LOCKED Section Protection

The LOCKED section:
- MUST be present in all agent contracts
- CANNOT be modified by agents (even by governance-repo-administrator)
- CANNOT be modified by governance-liaison agents
- CAN ONLY be modified by CS2 through constitutional canon update
- MUST reference this doctrine by name and version
- MUST be validated by `.github/scripts/check_locked_sections.py`

---

## 11. Ripple Requirements

### 11.1 Layer-Down Ripple Obligations

This doctrine is marked as `PUBLIC_API` and MUST ripple to all consumer repositories:
- APGI-cmy/maturion-foreman-office-app
- APGI-cmy/PartPulse
- APGI-cmy/maturion-isms
- APGI-cmy/R_Roster

### 11.2 Ripple Content

Consumer repositories MUST receive:
1. Full copy of this doctrine in `governance/canon/`
2. Updated CANON_INVENTORY.json entry with full SHA256 hash
3. Enhanced wake-up-protocol.sh script with environment health scan
4. Updated agent contracts with LOCKED Environmental Responsibility section
5. Ripple log entry documenting the change

### 11.3 Ripple Validation

Consumer repositories MUST validate:
- [ ] Doctrine file present in governance/canon/
- [ ] CANON_INVENTORY.json updated with correct hash
- [ ] Wake-up protocol script includes Step 4.5
- [ ] All agent contracts include LOCKED section
- [ ] Alignment gate passes with new doctrine hash

---

## 12. Compliance Enforcement

### 12.1 Merge Gate Enforcement

The **governance/alignment** merge gate MUST:
- Verify environment-health.json exists and is recent (< 24 hours old)
- Verify environment health status is HEALTHY or REMEDIATED
- Block merge if status is DEGRADED or CRITICAL
- Verify LOCKED section exists in all agent contracts
- Verify wake-up protocol includes environment health scan

### 12.2 CI/CD Validation

CI/CD workflows MUST:
- Execute `.github/scripts/wake-up-protocol.sh` for all agent-initiated PRs
- Fail if environment health scan returns CRITICAL status
- Log environment health status in build artifacts
- Archive environment-health.json as build artifact

### 12.3 Audit Requirements

Audit reviews MUST verify:
- Environment health scans occurred before each session
- Remediations were logged and appropriate
- Escalations were created when required
- No environment health scan bypasses occurred
- LOCKED sections were not modified without CS2 approval

---

## 13. Exceptions and Waivers

### 13.1 No Exceptions Permitted

There are **NO exceptions** to environment health scanning. All agents MUST perform the scan.

### 13.2 Temporary Waivers

CS2 may grant **temporary waivers** (max 7 days) for:
- Critical production incidents requiring immediate agent action
- Environment health scan blocking due to false positive
- Governance ripple propagation delays causing CRITICAL escalations

Waivers MUST:
- Be documented in writing by CS2
- Include expiration date (max 7 days)
- Specify exact scope and reason
- Be logged in `.agent-workspace/waivers/`
- Be revoked immediately when issue is resolved

### 13.3 Degraded Mode Operation

If environment health scan returns DEGRADED (not CRITICAL), agents MAY proceed with:
- **Reduced Scope**: Only execute assigned task, no self-align or extra work
- **Increased Logging**: All actions logged with justification
- **CS2 Notification**: Escalation created (but not blocking)
- **Session Memory Required**: Session must be captured even if partial completion

---

## 14. Escalation Path

### 14.1 For Agent Environment Issues

**Level 1**: Autonomous remediation (immediate, automatic)  
**Level 2**: Escalation to governance-repo-administrator (CRITICAL issues)  
**Level 3**: Escalation to CS2 (governance-repo-administrator cannot resolve)

### 14.2 For Doctrine Interpretation

**Level 1**: Governance-repo-administrator interprets within documented bounds  
**Level 2**: Ambiguous cases escalated to CS2 with structured doc  
**Level 3**: CS2 issues clarification or updates doctrine

### 14.3 For Doctrine Updates

**Process**: Constitutional canon change (CS2 approval required)  
**Ripple**: Mandatory layer-down ripple to all consumers  
**Timeline**: Ripple must complete within 7 days of CS2 approval

---

## 15. Learning File Staleness Enforcement

### 15.1 Purpose

This section addresses the risk of personal learning files remaining as placeholders indefinitely, bypassing the learning capture intent foundational to agent self-evolution and governance.

**Problem**: The autonomous remediation authority (Section 5.1.2) allows agents to create learning files with placeholder templates. Without enforcement, these files may never be updated with real learnings, undermining:
- Post-mortem reviews (failures may repeat undetected)
- Pattern recognition across agent lifecycles
- The constitutional requirement for continuous learning capture

### 15.2 Learning File Staleness Definition

**Stale Learning File**: A personal learning file that:
1. Contains only placeholder content (e.g., "No lessons yet - first session")
2. Has remained unchanged for N or more agent sessions (N = 3)
3. Lacks justification for emptiness

**Personal Learning Files Subject to Enforcement**:
- `personal/lessons-learned.md` - Mistakes to avoid
- `personal/patterns.md` - Recurring positive patterns
- `personal/anti-patterns.md` - Things that don't work
- `personal/efficiency-log.md` - Process improvements

### 15.3 Detection Mechanism

**Automated Detection**: `.github/scripts/check-learning-file-staleness.sh`

**Detection Criteria**:
1. File content analysis for placeholder markers:
   - "No lessons yet - first session"
   - "No patterns yet - first session"
   - "No efficiency notes yet - first session"
   - "No anti-patterns documented yet - first session"
2. Minimal content check (< 3 non-header lines)
3. Session count tracking from memory directory

**Session Count Calculation**:
```
Total Sessions = Active Sessions (memory/) + Archived Sessions (memory/.archive/)
```

### 15.4 Enforcement Thresholds

| Sessions | Status | Action |
|----------|--------|--------|
| 0-1 | ACCEPTABLE | Placeholder allowed for first/second session |
| 2 | WARNING | Warn agent during session closure |
| 3+ | STALE | Fail CI/CD, block merge |

### 15.5 CI/CD Integration

**Workflow**: `.github/workflows/learning-file-staleness-gate.yml`

**Job Name**: `learning-capture/staleness`

**Trigger Events**:
- `pull_request` (opened, synchronize, reopened)
- `push` to main branch

**Failure Behavior**:
- Block merge if stale files detected
- Provide clear error messages with file names and session counts
- Reference this doctrine and MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md

**Evidence-Based Bypass**: Per BL-027/BL-028, if PREHANDOVER_PROOF documents learning file validation, skip redundant execution.

### 15.6 Session Closure Integration

**Enhanced Session Closure** (`.github/scripts/session-closure.sh`):

**Step 4 - Update Personal Learnings** now includes:
1. **Staleness Check**: Scan all learning files for placeholder content
2. **Warning Display**: Prominent warning if stale files detected
3. **Interactive Capture**: Prompt for lessons, patterns, anti-patterns
4. **Explicit Justification**: If no learnings, require WHY (e.g., "No failures encountered")
5. **Session Memory**: Log learning file update status in session memory

**Warning Display Format**:
```
═══════════════════════════════════════════════════════════════
  LEARNING CAPTURE WARNING
═══════════════════════════════════════════════════════════════
The following learning files still have placeholder content:
  - lessons-learned.md
  - patterns.md
  
Learning capture is MANDATORY per:
  - AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md v1.1.0
  - MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md

Placeholder files beyond 3 sessions will cause CI failures.
═══════════════════════════════════════════════════════════════
```

### 15.7 Acceptable Empty File Justifications

Agents MAY maintain empty/minimal learning files IF explicitly documented:

**Acceptable Justifications**:
- "No failures encountered in last N sessions - all processes worked as expected"
- "No new patterns detected - existing patterns remain applicable"
- "No anti-patterns discovered - development proceeded smoothly"
- "Efficiency baseline established - no optimization opportunities identified"

**Documentation Method**: Replace placeholder with explicit statement:
```markdown
# Lessons Learned

## Session Status (Updated: 2026-02-14)

No lessons learned in last 3 sessions. All processes executed without failures or unexpected behaviors. Existing patterns (see patterns.md) remain sufficient.

---
```

### 15.8 Remediation Requirements

**For Agents with Stale Files**:
1. Review session memories for last N sessions
2. Extract actual learnings, patterns, or anti-patterns
3. Update learning files with real content
4. If genuinely no learnings exist, document explicit justification
5. Commit updated files to PR

**For Governance Administrators**:
- Monitor staleness trends across agents
- Escalate persistent staleness (> 5 sessions) to CS2
- Propose doctrine refinements if patterns emerge

### 15.9 Escalation Path

**Level 1**: Agent self-remediates during session closure  
**Level 2**: CI gate blocks merge, requires file updates  
**Level 3**: Persistent staleness (> 5 sessions) escalated to governance administrator  
**Level 4**: Governance administrator escalates to CS2 if agent pattern indicates systemic issue

### 15.10 Audit and Reporting

**Audit Trail**:
- Learning file update timestamps in session memory
- Staleness warnings logged in session closure output
- CI gate results archived in workflow artifacts
- Escalations documented in `.agent-workspace/<agent>/escalation-inbox/`

**Reporting**:
- Monthly learning capture effectiveness report
- Staleness trend analysis across agents
- Correlation with incident rates and governance gap discovery

---

## 16. Version History

| Version | Date       | Changes                                                           | Authority    |
|---------|------------|-------------------------------------------------------------------|--------------|
| 1.0.0   | 2026-02-14 | Initial constitutional canon creation                             | CS2 (Johan)  |
| 1.1.0   | 2026-02-14 | Added learning file staleness enforcement (Section 15)            | CS2 (Johan)  |

---

## 17. References

- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle and wake-up protocol
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check procedures
- **CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md** - Canon verification requirements
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** - Learning capture obligations
- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple propagation requirements
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Authority hierarchy

---

**Authority**: Constitutional Canon | CS2 (Johan Ras) | Version 1.1.0 | Effective 2026-02-14  
**File**: governance/canon/AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md
