# AGENT_INDUCTION_PROTOCOL

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-17

---

## Purpose

Defines the **canonical Induction phase** (Phase 2) of the four-phase agent contract architecture. This phase loads dynamic governance context, verifies canonical alignment, detects degraded states, and generates session-specific working contracts.

## Problem This Solves

Traditional agent contracts are:
- **Static**: Same contract every session, no awareness of changes
- **Context-free**: No memory of prior sessions, learnings, or patterns
- **Manually maintained**: Require CS2 updates for every governance change
- **Degraded-unaware**: Cannot auto-detect placeholder hashes or alignment failures

**Induction solves this** by loading current state dynamically at session start, enabling agents to adapt to governance changes, remember prior work, and auto-escalate degraded states.

## Induction Phase Structure

Phase 2 consists of a single mandatory section:

```markdown
## PHASE 2: INDUCTION SCRIPT (DYNAMIC GOVERNANCE/MEMORY LOAD)

### 2.1 Session Wake-Up Protocol
```

## Section 2.1: Session Wake-Up Protocol

**Purpose**: Execute a priority-coded, deterministic script that loads identity, memories, canonical state, environment health, and generates a working contract.

**Template**:

```markdown
### 2.1 Session Wake-Up Protocol

**Executable**: `.github/scripts/wake-up-protocol.sh <agent-type>`

**Priority-Coded Induction Sequence**:

```bash
#!/bin/bash
# <Agent Type> Wake-Up Protocol v6.2.0
# Priority-driven session initialization

AGENT_TYPE="<agent-type>"
SESSION_ID="$(date +%Y%m%d-%H%M%S)"
WORKSPACE=".agent-workspace/${AGENT_TYPE}"

echo "🔵 <AGENT NAME> WAKE-UP PROTOCOL - Session ${SESSION_ID}"

# <Agent>_H: Load canonical identity
echo "[<Agent>_H] Loading agent identity..."
AGENT_ID="<agent-id>"
AGENT_CLASS="<class>"
AGENT_VERSION="6.2.0"
CONTRACT_VERSION="<version>"

# <Agent>_H: Verify CANON_INVENTORY integrity (CRITICAL - degraded mode check)
echo "[<Agent>_H] Verifying CANON_INVENTORY integrity..."
if ! jq -e '.constitutional_canon' governance/CANON_INVENTORY.json > /dev/null 2>&1; then
  echo "❌ [<Agent>_H] CANON_INVENTORY missing or invalid - DEGRADED MODE"
  echo "ACTION: Creating CS2 escalation..."
  mkdir -p "${WORKSPACE}/escalation-inbox"
  cat > "${WORKSPACE}/escalation-inbox/degraded-canon-$(date +%Y%m%d).md" <<EOF
# ESCALATION: CANON_INVENTORY Degraded State

## Type
BLOCKER

## Description
CANON_INVENTORY.json missing or invalid during wake-up.
Cannot verify governance alignment.

## Context
Session: ${SESSION_ID}
Agent: <agent-type>
Wake-up phase: CANON_INVENTORY verification

## Recommendation
CS2 to verify/restore CANON_INVENTORY.json with proper PUBLIC_API hashes.

## Priority
<Agent>_H (CRITICAL - blocks all execution)
EOF
  exit 1
fi

# <Agent>_H: Check for placeholder hashes (degraded alignment)
echo "[<Agent>_H] Checking for placeholder PUBLIC_API hashes..."
PLACEHOLDER_COUNT=$(jq '(.constitutional_canon // []) | [.[] | .public_api_hash? | select(. == "placeholder" or . == "TBD" or (type == "string" and length < 64))] | length' governance/CANON_INVENTORY.json)
if [ "${PLACEHOLDER_COUNT}" -gt 0 ]; then
  echo "⚠️  [<Agent>_H] ${PLACEHOLDER_COUNT} placeholder hashes detected - DEGRADED ALIGNMENT"
  echo "ACTION: Failing alignment gate and escalating to CS2..."
  # Mark degraded state for merge gate to detect
  mkdir -p .agent-admin/governance
  cat > .agent-admin/governance/degraded-alignment-$(date +%Y%m%d).json <<EOF
{
  "status": "DEGRADED",
  "reason": "placeholder_hashes_in_canon_inventory",
  "placeholder_count": ${PLACEHOLDER_COUNT},
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "agent": "${AGENT_TYPE}",
  "session": "${SESSION_ID}",
  "action": "FAIL_ALIGNMENT_GATE_AND_BLOCK_MERGE"
}
EOF
fi

# <Agent>_M: Load last 5 session memories
echo "[<Agent>_M] Loading session memories (last 5)..."
mkdir -p "${WORKSPACE}/memory"
MEMORIES=$(ls -t "${WORKSPACE}/memory"/session-*.md 2>/dev/null | head -5)
if [ -n "${MEMORIES}" ]; then
  echo "✅ [<Agent>_M] Found $(echo "${MEMORIES}" | wc -l) recent memories"
  echo "${MEMORIES}" | while read memory; do
    echo "  - $(basename "${memory}")"
  done
else
  echo "ℹ️  [<Agent>_M] No prior memories found (first session)"
fi

# <Agent>_M: Load personal learnings
echo "[<Agent>_M] Loading personal learnings..."
if [ -f "${WORKSPACE}/personal/lessons-learned.md" ]; then
  LESSON_COUNT=$(grep -c "^### Lesson:" "${WORKSPACE}/personal/lessons-learned.md" 2>/dev/null || echo 0)
  echo "✅ [<Agent>_M] Loaded ${LESSON_COUNT} lessons learned"
fi

if [ -f "${WORKSPACE}/personal/patterns.md" ]; then
  PATTERN_COUNT=$(grep -c "^## Pattern:" "${WORKSPACE}/personal/patterns.md" 2>/dev/null || echo 0)
  echo "✅ [<Agent>_M] Loaded ${PATTERN_COUNT} patterns observed"
fi

# <Agent>_H: Load environment health state
echo "[<Agent>_H] Checking environment health..."
mkdir -p "${WORKSPACE}"
if [ ! -f "${WORKSPACE}/environment-health.json" ]; then
  cat > "${WORKSPACE}/environment-health.json" <<EOF
{
  "last_check": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment_health_status": "UNKNOWN",
  "session_id": "${SESSION_ID}",
  "agent": "${AGENT_TYPE}",
  "checks": {}
}
EOF
fi

# <Agent>_M: Check for escalations from other agents
echo "[<Agent>_M] Checking escalation inbox..."
UNRESOLVED_ESCALATIONS=$(find "${WORKSPACE}/escalation-inbox" -name "*.md" 2>/dev/null | grep -v "/resolved/" || echo "")
ESCALATION_COUNT=$(echo "${UNRESOLVED_ESCALATIONS}" | grep -c . || echo 0)
if [ "${ESCALATION_COUNT}" -gt 0 ]; then
  echo "⚠️  [<Agent>_M] ${ESCALATION_COUNT} unresolved escalations found"
  echo "${UNRESOLVED_ESCALATIONS}" | while read esc; do
    echo "  - $(basename "${esc}")"
  done
else
  echo "✅ [<Agent>_M] No pending escalations"
fi

# <Agent>_H: Generate session-specific working contract
echo "[<Agent>_H] Generating working contract for session ${SESSION_ID}..."
cat > "${WORKSPACE}/working-contract.md" <<EOF
# Working Contract - Session ${SESSION_ID}

## Agent Identity
- Type: ${AGENT_TYPE}
- Class: ${AGENT_CLASS}
- Version: ${AGENT_VERSION}
- Contract: ${CONTRACT_VERSION}

## Session Context
- Session ID: ${SESSION_ID}
- Canon State: $([ "${PLACEHOLDER_COUNT}" -gt 0 ] && echo "DEGRADED (${PLACEHOLDER_COUNT} placeholders)" || echo "ALIGNED")
- Prior Sessions: $(echo "${MEMORIES}" | wc -l)
- Pending Escalations: ${ESCALATION_COUNT}

## Mandate for This Session
<Agent-specific mandate based on current state>

## Degraded Mode
$([ "${PLACEHOLDER_COUNT}" -gt 0 ] && echo "⚠️  DEGRADED ALIGNMENT DETECTED - Alignment gate will FAIL, merge will BLOCK" || echo "✅ Canonical alignment verified")

## References
- CANON_INVENTORY: governance/CANON_INVENTORY.json
- Memory: ${WORKSPACE}/memory/
- Escalations: ${WORKSPACE}/escalation-inbox/

---
Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Authority: LIVING_AGENT_SYSTEM.md v6.2.0
EOF

echo "✅ [<Agent>_H] Working contract generated"
echo "✅ <AGENT NAME> WAKE-UP COMPLETE"
```
\`\`\`

**Commentary**: This induction script is **executable and dynamic**. It:
- Uses priority codes (<Agent>_H/M/L) to sequence critical vs. optional checks
- Generates a session-specific working contract, not a static file
- Auto-detects degraded alignment and creates escalations
- Loads memories, lessons, and patterns from prior sessions
- Fails fast on critical issues (missing canon, placeholder hashes)
- Maintains continuity across sessions via memory system
```

## Wake-Up Protocol Components

### Component 1: Agent Identity Load (Priority_H)

**Purpose**: Establish who the agent is for this session.

**Required Variables**:
- `AGENT_TYPE`: Agent type identifier (e.g., `foreman`, `governance-repo-administrator`)
- `AGENT_ID`: Unique agent identifier
- `AGENT_CLASS`: Agent class (supervisor, builder, overseer, administrator, qa)
- `AGENT_VERSION`: Living Agent System version (6.2.0)
- `CONTRACT_VERSION`: Agent contract version (e.g., 2.0.0)

**Example**:
```bash
echo "[FM_H] Loading agent identity..."
AGENT_ID="foreman"
AGENT_CLASS="supervisor"
AGENT_VERSION="6.2.0"
CONTRACT_VERSION="2.0.0"
```

### Component 2: CANON_INVENTORY Integrity Check (Priority_H)

**Purpose**: Verify canonical governance is present and valid. HALT if missing.

**Required Checks**:
1. File exists: `governance/CANON_INVENTORY.json`
2. Valid JSON structure
3. Contains `constitutional_canon` array

**Failure Action**: Create CS2 escalation, EXIT 1 (HALT execution)

**Example**:
```bash
if ! jq -e '.constitutional_canon' governance/CANON_INVENTORY.json > /dev/null 2>&1; then
  echo "❌ [FM_H] CANON_INVENTORY missing or invalid - DEGRADED MODE"
  # Create escalation (see template above)
  exit 1
fi
```

### Component 3: Placeholder Hash Detection (Priority_H)

**Purpose**: Detect degraded alignment state when PUBLIC_API hashes are placeholder/truncated.

**Detection Logic**:
```bash
PLACEHOLDER_COUNT=$(jq '
  (.constitutional_canon // []) | 
  [.[] | .public_api_hash? | 
   select(. == "placeholder" or . == "TBD" or (type == "string" and length < 64))
  ] | length
' governance/CANON_INVENTORY.json)
```

**Degraded State Actions** (when `PLACEHOLDER_COUNT > 0`):
1. Log degraded state to console
2. Create `.agent-admin/governance/degraded-alignment-*.json` marker file
3. Continue execution BUT merge gate will detect marker and FAIL

**Why Not HALT?**: Allows agent to document the issue and create evidence before session ends.

### Component 4: Session Memory Load (Priority_M)

**Purpose**: Load context from last 5 sessions for continuity.

**Memory Location**: `.agent-workspace/<agent-type>/memory/session-*.md`

**Load Logic**:
```bash
mkdir -p "${WORKSPACE}/memory"
MEMORIES=$(ls -t "${WORKSPACE}/memory"/session-*.md 2>/dev/null | head -5)
if [ -n "${MEMORIES}" ]; then
  echo "✅ [FM_M] Found $(echo "${MEMORIES}" | wc -l) recent memories"
else
  echo "ℹ️  [FM_M] No prior memories found (first session)"
fi
```

### Component 5: Personal Learning Load (Priority_M)

**Purpose**: Load accumulated lessons and patterns from prior sessions.

**Learning Files**:
- `${WORKSPACE}/personal/lessons-learned.md`
- `${WORKSPACE}/personal/patterns.md`

**Load Logic**:
```bash
if [ -f "${WORKSPACE}/personal/lessons-learned.md" ]; then
  LESSON_COUNT=$(grep -c "^### Lesson:" "${WORKSPACE}/personal/lessons-learned.md" 2>/dev/null || echo 0)
  echo "✅ [FM_M] Loaded ${LESSON_COUNT} lessons learned"
fi
```

### Component 6: Environment Health Check (Priority_H)

**Purpose**: Record environment health state for monitoring.

**Health File**: `${WORKSPACE}/environment-health.json`

**Initial State**:
```json
{
  "last_check": "2026-02-17T10:30:00Z",
  "environment_health_status": "UNKNOWN",
  "session_id": "20260217-103000",
  "agent": "foreman",
  "checks": {}
}
```

**Status Values**: `UNKNOWN`, `HEALTHY`, `DEGRADED`, `UNSAFE`

### Component 7: Escalation Inbox Check (Priority_M)

**Purpose**: Check for unresolved escalations from other agents or prior sessions.

**Escalation Location**: `${WORKSPACE}/escalation-inbox/*.md`

**Check Logic**:
```bash
UNRESOLVED_ESCALATIONS=$(find "${WORKSPACE}/escalation-inbox" -name "*.md" 2>/dev/null | grep -v "/resolved/" || echo "")
ESCALATION_COUNT=$(echo "${UNRESOLVED_ESCALATIONS}" | grep -c . || echo 0)
if [ "${ESCALATION_COUNT}" -gt 0 ]; then
  echo "⚠️  [FM_M] ${ESCALATION_COUNT} unresolved escalations found"
fi
```

### Component 8: Working Contract Generation (Priority_H)

**Purpose**: Generate session-specific working contract with current state.

**Working Contract Location**: `${WORKSPACE}/working-contract.md`

**Template**:
```markdown
# Working Contract - Session <session-id>

## Agent Identity
- Type: <agent-type>
- Class: <class>
- Version: <version>
- Contract: <contract-version>

## Session Context
- Session ID: <session-id>
- Canon State: <ALIGNED|DEGRADED (N placeholders)>
- Prior Sessions: <count>
- Pending Escalations: <count>

## Mandate for This Session
<Agent-specific mandate based on current state>

## Degraded Mode
<Degraded state warning if placeholders detected, else "Canonical alignment verified">

## References
- CANON_INVENTORY: governance/CANON_INVENTORY.json
- Memory: .agent-workspace/<agent>/memory/
- Escalations: .agent-workspace/<agent>/escalation-inbox/

---
Generated: <timestamp>
Authority: LIVING_AGENT_SYSTEM.md v6.2.0
```

**Note**: Working contract is **ephemeral** (not committed to git), regenerated each session.

## Wake-Up Protocol Exit Codes

| Exit Code | Meaning | Action |
|-----------|---------|--------|
| **0** | Success - ready to proceed | Continue to Build phase |
| **1** | Critical failure (missing CANON_INVENTORY) | HALT - cannot proceed |
| **2** | Environment unsafe | HALT - requires manual intervention |

**Note**: Placeholder hash detection does NOT exit 1 - it marks degraded state and continues.

## Induction Validation Checklist

Before proceeding to Build (Phase 3), verify wake-up protocol completed:

- [ ] **Agent identity loaded**: Type, class, version, contract version recorded
- [ ] **CANON_INVENTORY verified**: File present, valid JSON, constitutional_canon exists
- [ ] **Placeholder check executed**: Degraded state marked if placeholders found
- [ ] **Session memories loaded**: Last 5 sessions (or noted if first session)
- [ ] **Personal learnings loaded**: Lessons and patterns counted
- [ ] **Environment health checked**: Status file exists
- [ ] **Escalation inbox scanned**: Unresolved escalations counted
- [ ] **Working contract generated**: Session-specific contract created

## Wake-Up Protocol Customization by Agent Class

### Supervisor (Foreman)

**Additional Checks**:
- Verify `BUILD_PHILOSOPHY.md` present
- Check for builder task queue in workspace
- Scan for pending Red QA specs

### Builder

**Additional Checks**:
- Verify Foreman has appointed task
- Load Red QA test suite specification
- Check for 100% GREEN requirement

### Overseer (CodexAdvisor)

**Additional Checks**:
- Verify approval gate configuration
- Load `CONSUMER_REPO_REGISTRY.json`
- Check for pending advisory requests

### Administrator (Governance)

**Additional Checks**:
- Verify `CONSUMER_REPO_REGISTRY.json` present
- Check for pending ripple propagations
- Scan for canon update requests

### QA

**Additional Checks**:
- Verify test framework available
- Check for coverage requirements
- Scan for flaky test reports

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Correct Pattern |
|--------------|--------------|-----------------|
| **Static working contract** | Doesn't adapt to changes | Generate fresh each session |
| **No degraded mode check** | Misses placeholder hashes | Always check for placeholders |
| **Manual memory load** | Inconsistent, error-prone | Automated memory scan |
| **Ignoring escalations** | Missed handoffs from other agents | Always scan escalation inbox |
| **No exit codes** | Can't detect failure | Exit 1 on critical failures |
| **Embedding full contract** | Unmaintainable | Reference external script |

## Enforcement & Compliance

**Merge Gate Validation**:
- Governance alignment gate verifies wake-up protocol was called
- Checks for `.agent-admin/governance/degraded-alignment-*.json` marker
- If degraded marker present → FAIL gate, BLOCK merge

**Session Closure Validation**:
- Verifies `working-contract.md` was generated
- Checks timestamp is recent (<24 hours old)
- Confirms environment health status updated

## Authority & Version

**Authority Source**: `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md`  
**Prototype Source**: Foreman v2.0.0 Induction phase  
**Approval**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-17

## Related Canon

- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-phase overview
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Living Agent framework
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` - Phase 1 template
- `governance/canon/AGENT_PRIORITY_SYSTEM.md` - Priority codes
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` - Phase 4 template

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-17  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
