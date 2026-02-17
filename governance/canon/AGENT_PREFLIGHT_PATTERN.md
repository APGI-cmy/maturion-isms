# AGENT PREFLIGHT PATTERN

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-17  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document defines the **canonical preflight check pattern** that all Maturion agents MUST implement to block default behaviors and establish constitutional boundaries BEFORE any work begins.

### Core Principle

> **Constitutional violations must be prevented, not detected.**  
> Preflight is the agent's firewall against governance drift.

**Preflight failures = Session halt. No exceptions.**

---

## 2. Constitutional Authority

This pattern is mandated by:
- **AGENT_CONTRACT_ARCHITECTURE.md** - 4-phase agent structure (Phase 1: Preflight)
- **BUILD_PHILOSOPHY.md** - Constitutional execution discipline
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance supremacy
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance requirements

---

## 3. Preflight Check Categories

All agents MUST implement these 5 preflight check categories in order:

```
1. Identity Verification
        ↓
2. Boundary Establishment
        ↓
3. Default Behavior Blocking
        ↓
4. Governance State Validation
        ↓
5. Role-Specific Sandbox
```

---

## 4. Category 1: Identity Verification

### 4.1 Purpose

Confirm the agent knows WHO it is, WHAT it does, and HOW it operates.

### 4.2 Mandatory Checks

```bash
# Check 1.1: Agent Type Confirmed
AGENT_TYPE="<agent-type>"
if [ "$AGENT_TYPE" != "foreman" ] && [ "$AGENT_TYPE" != "builder" ] && \
   [ "$AGENT_TYPE" != "governance-repo-administrator" ] && \
   [ "$AGENT_TYPE" != "CodexAdvisor-agent" ] && \
   [ "$AGENT_TYPE" != "governance-liaison" ]; then
    PREFLIGHT_FAIL "Unknown agent type: $AGENT_TYPE"
fi

# Check 1.2: Agent Class Confirmed
AGENT_CLASS="<class>"  # supervisor | implementer | administrator | overseer | liaison
if [ -z "$AGENT_CLASS" ]; then
    PREFLIGHT_FAIL "Agent class not defined"
fi

# Check 1.3: Contract Version Valid
CONTRACT_VERSION="<version>"
if [ -z "$CONTRACT_VERSION" ]; then
    PREFLIGHT_FAIL "Contract version not defined"
fi

# Check 1.4: Execution Mode Verified
EXECUTION_MODE="orchestration"  # orchestration | implementation
if [ "$EXECUTION_MODE" = "orchestration" ]; then
    CODE_WRITING_ALLOWED=false
else
    CODE_WRITING_ALLOWED=true
fi
```

### 4.3 Success Criteria

- Agent type is recognized and valid
- Agent class matches contract metadata
- Contract version is defined
- Execution mode is explicit (not defaulted)

---

## 5. Category 2: Boundary Establishment

### 5.1 Purpose

Define and lock the agent's read/write scope, escalation paths, and prohibited actions.

### 5.2 Mandatory Checks

```bash
# Check 2.1: Read Scope Defined
READ_SCOPE=("**/*")  # Default: read all
if [ ${#READ_SCOPE[@]} -eq 0 ]; then
    PREFLIGHT_FAIL "Read scope not defined"
fi

# Check 2.2: Write Scope Defined and Limited
WRITE_SCOPE=(
    "architecture/**"
    "qa/**"
    ".agent-workspace/**"
)
if [ ${#WRITE_SCOPE[@]} -eq 0 ]; then
    PREFLIGHT_FAIL "Write scope not defined"
fi

# Check 2.3: Escalation-Required Paths Identified
ESCALATION_REQUIRED=(
    "governance/canon/**"
    ".github/agents/**"
    ".github/workflows/**"
    "BUILD_PHILOSOPHY.md"
)
if [ ${#ESCALATION_REQUIRED[@]} -eq 0 ]; then
    PREFLIGHT_WARN "No escalation-required paths defined (unusual)"
fi

# Check 2.4: Prohibited Actions Explicit
PROHIBITED_ACTIONS=(
    "force-push"
    "rebase-with-force"
    "bypass-merge-gates"
    "direct-canon-modification"
)
if [ ${#PROHIBITED_ACTIONS[@]} -eq 0 ]; then
    PREFLIGHT_FAIL "Prohibited actions not defined"
fi
```

### 5.3 Success Criteria

- Read scope explicitly defined (even if "**/*")
- Write scope limited and specific
- Escalation paths identified
- Prohibited actions enumerated

---

## 6. Category 3: Default Behavior Blocking

### 6.1 Purpose

**Explicitly disable default LLM behaviors that violate governance.**

This is the core innovation: agents default to governance-aligned behavior, not LLM defaults.

### 6.2 Mandatory Blocks

```bash
# Block 3.1: Code Writing (for orchestration agents)
if [ "$EXECUTION_MODE" = "orchestration" ] && [ "$CODE_WRITING_ALLOWED" = true ]; then
    PREFLIGHT_FAIL "Code writing MUST be disabled for orchestration agents"
fi

# Block 3.2: Direct Canon Modification
CANON_WRITE_ALLOWED=false
if [ "$AGENT_CLASS" != "administrator" ]; then
    # Non-administrator agents CANNOT write canon directly
    for path in "${WRITE_SCOPE[@]}"; do
        if [[ "$path" == governance/canon/* ]]; then
            PREFLIGHT_FAIL "Canon write scope detected for non-administrator agent"
        fi
    done
fi

# Block 3.3: Force Push and Rebase
GIT_FORCE_ALLOWED=false
if [ "$GIT_FORCE_ALLOWED" = true ]; then
    PREFLIGHT_FAIL "Force push MUST be disabled per AGENT_CONTRACT_PROTECTION_PROTOCOL.md"
fi

# Block 3.4: Merge Gate Bypass
MERGE_GATE_BYPASS_ALLOWED=false
if [ "$MERGE_GATE_BYPASS_ALLOWED" = true ]; then
    PREFLIGHT_FAIL "Merge gate bypass MUST be disabled"
fi

# Block 3.5: Direct Main Push
DIRECT_MAIN_PUSH_ALLOWED=false
if [ "$DIRECT_MAIN_PUSH_ALLOWED" = true ]; then
    PREFLIGHT_FAIL "Direct main push MUST be disabled (PR-only writes)"
fi
```

### 6.3 Role-Specific Blocks

**Foreman-Specific**:
```bash
# Foreman MUST NOT write production code
if [ "$AGENT_TYPE" = "foreman" ]; then
    PRODUCTION_CODE_WRITE=false
    if [ "$PRODUCTION_CODE_WRITE" = true ]; then
        PREFLIGHT_FAIL "Foreman MUST NOT write production code (builders implement)"
    fi
fi
```

**Builder-Specific**:
```bash
# Builder MUST NOT create Red QA
if [ "$AGENT_TYPE" = "builder" ]; then
    RED_QA_CREATION=false
    if [ "$RED_QA_CREATION" = true ]; then
        PREFLIGHT_FAIL "Builder MUST NOT create Red QA (Foreman creates Red)"
    fi
    
    # Builder MUST NOT self-approve
    SELF_APPROVAL=false
    if [ "$SELF_APPROVAL" = true ]; then
        PREFLIGHT_FAIL "Builder MUST NOT approve own PRs (Foreman verdicts)"
    fi
fi
```

### 6.4 Success Criteria

- Code writing explicitly disabled (orchestration agents)
- Canon modification blocked (non-administrators)
- Force push/rebase disabled
- Merge gate bypass disabled
- Direct main push disabled
- Role-specific prohibitions enforced

---

## 7. Category 4: Governance State Validation

### 7.1 Purpose

Verify the governance system is in a healthy, non-degraded state before allowing work.

### 7.2 Mandatory Checks

```bash
# Check 4.1: CANON_INVENTORY.json Exists
CANON_INVENTORY="${REPO_ROOT}/governance/CANON_INVENTORY.json"
if [ ! -f "$CANON_INVENTORY" ]; then
    PREFLIGHT_FAIL "CRITICAL: CANON_INVENTORY.json missing - cannot verify governance alignment"
fi

# Check 4.2: CANON_INVENTORY.json Valid JSON
if ! jq empty "$CANON_INVENTORY" 2>/dev/null; then
    PREFLIGHT_FAIL "CRITICAL: CANON_INVENTORY.json is invalid JSON"
fi

# Check 4.3: No Placeholder Hashes (Degraded Mode Check)
# Per REQ-SS-004: Degraded alignment when CANON_INVENTORY contains placeholder/truncated hashes
PLACEHOLDER_HASHES=$(jq -r '.canons[] | select(.file_hash_sha256 | length < 64) | .filename' "$CANON_INVENTORY" 2>/dev/null)
if [ -n "$PLACEHOLDER_HASHES" ]; then
    PREFLIGHT_FAIL "DEGRADED MODE: Placeholder/truncated hashes detected in CANON_INVENTORY.json:\n$PLACEHOLDER_HASHES"
fi

# Check 4.4: Merge Gate Interface Configured
MERGE_GATE_WORKFLOW="${REPO_ROOT}/.github/workflows/merge-gate-interface.yml"
if [ ! -f "$MERGE_GATE_WORKFLOW" ]; then
    PREFLIGHT_WARN "Merge Gate Interface workflow not found (may be OK for non-governance repos)"
fi

# Check 4.5: Required Governance Artifacts Present
REQUIRED_ARTIFACTS=(
    "governance/CANON_INVENTORY.json"
    "governance/CONSUMER_REPO_REGISTRY.json"
    "governance/GATE_REQUIREMENTS_INDEX.json"
)
for artifact in "${REQUIRED_ARTIFACTS[@]}"; do
    if [ ! -f "${REPO_ROOT}/${artifact}" ]; then
        PREFLIGHT_WARN "Expected governance artifact missing: $artifact"
    fi
done
```

### 7.3 Success Criteria

- CANON_INVENTORY.json exists and valid
- No placeholder/truncated hashes (non-degraded mode)
- Merge gate interface present (governance repos)
- Required governance artifacts available

---

## 8. Category 5: Role-Specific Sandbox

### 8.1 Purpose

Establish agent-class-specific constraints and capabilities.

### 8.2 Foreman Sandbox

```bash
if [ "$AGENT_TYPE" = "foreman" ]; then
    # Foreman owns QA creation
    QA_OWNERSHIP=true
    
    # Foreman owns merge verdicts
    MERGE_VERDICT_AUTHORITY=true
    
    # Foreman supervises, never implements
    SUPERVISOR_MODE=true
    IMPLEMENTER_MODE=false
    
    # Foreman can appoint builders
    BUILDER_APPOINTMENT_AUTHORITY=true
    
    # Foreman CANNOT write production code
    PRODUCTION_CODE_SCOPE=()
    
    echo "[PREFLIGHT] Foreman sandbox established:"
    echo "  - QA ownership: $QA_OWNERSHIP"
    echo "  - Merge verdict authority: $MERGE_VERDICT_AUTHORITY"
    echo "  - Supervisor mode: $SUPERVISOR_MODE"
    echo "  - Builder appointment: $BUILDER_APPOINTMENT_AUTHORITY"
    echo "  - Production code writing: DISABLED"
fi
```

### 8.3 Builder Sandbox

```bash
if [ "$AGENT_TYPE" = "builder" ]; then
    # Builder implements architecture
    IMPLEMENTER_MODE=true
    
    # Builder CANNOT create Red QA
    RED_QA_AUTHORITY=false
    
    # Builder works Architecture Red → Green
    ARCHITECTURE_TO_GREEN_MANDATE=true
    
    # Builder CANNOT self-approve
    SELF_APPROVAL_AUTHORITY=false
    
    # Builder reports to Foreman
    SUPERVISOR="foreman"
    
    echo "[PREFLIGHT] Builder sandbox established:"
    echo "  - Implementer mode: $IMPLEMENTER_MODE"
    echo "  - Red QA authority: $RED_QA_AUTHORITY"
    echo "  - Architecture → Green: $ARCHITECTURE_TO_GREEN_MANDATE"
    echo "  - Self-approval: $SELF_APPROVAL_AUTHORITY"
    echo "  - Supervisor: $SUPERVISOR"
fi
```

### 8.4 Administrator Sandbox

```bash
if [ "$AGENT_TYPE" = "governance-repo-administrator" ]; then
    # Administrator maintains canon inventory
    CANON_INVENTORY_STEWARD=true
    
    # Administrator executes ripple
    RIPPLE_EXECUTION_AUTHORITY=true
    
    # Administrator protects constitutional files
    PROTECTED_FILE_ENFORCEMENT=true
    
    # Administrator CANNOT change canon semantics without CS2
    CANON_SEMANTIC_CHANGE_AUTHORITY=false
    CANON_SYNTAX_FIX_AUTHORITY=true
    
    echo "[PREFLIGHT] Administrator sandbox established:"
    echo "  - Canon inventory steward: $CANON_INVENTORY_STEWARD"
    echo "  - Ripple execution: $RIPPLE_EXECUTION_AUTHORITY"
    echo "  - Protected file enforcement: $PROTECTED_FILE_ENFORCEMENT"
    echo "  - Canon semantic changes: REQUIRES CS2 APPROVAL"
fi
```

### 8.5 Liaison Sandbox

```bash
if [ "$AGENT_TYPE" = "governance-liaison" ]; then
    # Liaison synchronizes governance cross-repo
    CROSS_REPO_READ=true
    CROSS_REPO_WRITE=false  # Read-only unless specific write scope
    
    # Liaison reports drift
    DRIFT_DETECTION_AUTHORITY=true
    DRIFT_REMEDIATION_AUTHORITY=false  # Report, don't fix
    
    # Liaison escalates misalignment
    ALIGNMENT_MONITORING=true
    
    echo "[PREFLIGHT] Liaison sandbox established:"
    echo "  - Cross-repo read: $CROSS_REPO_READ"
    echo "  - Cross-repo write: $CROSS_REPO_WRITE"
    echo "  - Drift detection: $DRIFT_DETECTION_AUTHORITY"
    echo "  - Alignment monitoring: $ALIGNMENT_MONITORING"
fi
```

### 8.6 Overseer Sandbox (CodexAdvisor)

```bash
if [ "$AGENT_TYPE" = "CodexAdvisor-agent" ]; then
    # Overseer monitors all repos
    MULTI_REPO_VISIBILITY=true
    
    # Overseer validates governance compliance
    GOVERNANCE_COMPLIANCE_VALIDATION=true
    
    # Overseer approves layer-down proposals
    LAYER_DOWN_APPROVAL_AUTHORITY=true
    
    # Overseer CANNOT make changes directly
    DIRECT_MODIFICATION_AUTHORITY=false
    ESCALATION_CREATION_AUTHORITY=true
    
    echo "[PREFLIGHT] Overseer sandbox established:"
    echo "  - Multi-repo visibility: $MULTI_REPO_VISIBILITY"
    echo "  - Governance validation: $GOVERNANCE_COMPLIANCE_VALIDATION"
    echo "  - Layer-down approval: $LAYER_DOWN_APPROVAL_AUTHORITY"
    echo "  - Direct modifications: $DIRECT_MODIFICATION_AUTHORITY"
fi
```

### 8.7 Success Criteria

- Role-specific capabilities established
- Role-specific prohibitions enforced
- Authority boundaries explicit
- Sandbox configuration logged

---

## 9. Preflight Execution Flow

### 9.1 Script Structure

```bash
#!/bin/bash
###############################################################################
# Agent Preflight Check
# Authority: AGENT_PREFLIGHT_PATTERN.md v1.0.0
###############################################################################

set -euo pipefail

PREFLIGHT_STATUS="PASS"
PREFLIGHT_ERRORS=()
PREFLIGHT_WARNINGS=()

PREFLIGHT_FAIL() {
    PREFLIGHT_STATUS="FAIL"
    PREFLIGHT_ERRORS+=("$1")
    echo "[PREFLIGHT FAIL] $1" >&2
}

PREFLIGHT_WARN() {
    PREFLIGHT_WARNINGS+=("$1")
    echo "[PREFLIGHT WARN] $1" >&2
}

PREFLIGHT_PASS() {
    echo "[PREFLIGHT PASS] $1"
}

# Category 1: Identity Verification
echo "=== PREFLIGHT: Category 1 - Identity Verification ==="
# ... checks ...

# Category 2: Boundary Establishment
echo "=== PREFLIGHT: Category 2 - Boundary Establishment ==="
# ... checks ...

# Category 3: Default Behavior Blocking
echo "=== PREFLIGHT: Category 3 - Default Behavior Blocking ==="
# ... checks ...

# Category 4: Governance State Validation
echo "=== PREFLIGHT: Category 4 - Governance State Validation ==="
# ... checks ...

# Category 5: Role-Specific Sandbox
echo "=== PREFLIGHT: Category 5 - Role-Specific Sandbox ==="
# ... checks ...

# Final Status
echo ""
echo "=== PREFLIGHT RESULT ==="
if [ "$PREFLIGHT_STATUS" = "PASS" ]; then
    echo "✅ PREFLIGHT PASSED"
    if [ ${#PREFLIGHT_WARNINGS[@]} -gt 0 ]; then
        echo "⚠️  Warnings: ${#PREFLIGHT_WARNINGS[@]}"
        for warning in "${PREFLIGHT_WARNINGS[@]}"; do
            echo "  - $warning"
        done
    fi
    exit 0
else
    echo "❌ PREFLIGHT FAILED"
    echo "Errors: ${#PREFLIGHT_ERRORS[@]}"
    for error in "${PREFLIGHT_ERRORS[@]}"; do
        echo "  - $error"
    done
    
    # Create escalation
    create_preflight_escalation "${PREFLIGHT_ERRORS[@]}"
    
    exit 1
fi
```

### 9.2 Integration Points

**Option 1: Standalone Script**
```bash
.github/scripts/preflight-<agent-type>.sh
```

**Option 2: Embedded in Wake-Up Protocol**
```bash
# In .github/scripts/wake-up-protocol.sh
source .github/scripts/preflight-${AGENT_TYPE}.sh || exit 1
```

**Option 3: Agent Contract Embedded**
```markdown
## Phase 1: PREFLIGHT

Execute preflight checks:
```bash
# Preflight checks embedded here...
```
\`\`\`
```

---

## 10. Escalation on Failure

### 10.1 Preflight Failure Escalation

When preflight fails, create escalation:

```bash
create_preflight_escalation() {
    local errors=("$@")
    local escalation_file="${WORKSPACE_ROOT}/${AGENT_TYPE}/escalation-inbox/preflight-failure-$(date +%Y%m%d-%H%M%S).md"
    
    mkdir -p "$(dirname "$escalation_file")"
    
    cat > "$escalation_file" <<EOF
# Preflight Failure Escalation

## Type
PREFLIGHT_FAILURE

## Agent
- Type: ${AGENT_TYPE}
- Class: ${AGENT_CLASS}
- Session: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

## Failure Reason

Preflight checks failed. Session HALTED per AGENT_PREFLIGHT_PATTERN.md.

### Errors

$(for error in "${errors[@]}"; do echo "- $error"; done)

### Warnings

$(for warning in "${PREFLIGHT_WARNINGS[@]}"; do echo "- $warning"; done)

## Impact

Agent cannot proceed to Induction phase. Work blocked until preflight issues resolved.

## Recommended Action

1. Review preflight errors above
2. Resolve governance state issues (e.g., CANON_INVENTORY.json)
3. Update agent contract if boundary changes needed
4. Re-run wake-up protocol

## Authority

- AGENT_CONTRACT_ARCHITECTURE.md v1.0.0 (Phase 1: Preflight)
- AGENT_PREFLIGHT_PATTERN.md v1.0.0
- LIVING_AGENT_SYSTEM.md v1.0.0

---
Created: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
    
    echo "[ESCALATION] Created preflight failure escalation: $escalation_file"
}
```

---

## 11. Testing Preflight

### 11.1 Test Scenarios

Every preflight implementation MUST pass these tests:

**Test 1: Identity Verification**
- Valid agent type → PASS
- Invalid agent type → FAIL
- Missing agent class → FAIL
- Missing contract version → FAIL

**Test 2: Boundary Establishment**
- Write scope defined → PASS
- Write scope empty → FAIL
- Escalation paths defined → PASS

**Test 3: Default Behavior Blocking**
- Orchestration agent with code writing enabled → FAIL
- Force push enabled → FAIL
- Merge gate bypass enabled → FAIL

**Test 4: Governance State Validation**
- CANON_INVENTORY.json missing → FAIL
- Placeholder hashes in CANON_INVENTORY.json → FAIL (degraded mode)
- Valid CANON_INVENTORY.json → PASS

**Test 5: Role-Specific Sandbox**
- Foreman with production code scope → FAIL
- Builder with Red QA authority → FAIL
- Administrator with canon semantic change authority → WARN (requires CS2)

### 11.2 Test Execution

```bash
# Run preflight test suite
.github/scripts/test-preflight.sh <agent-type>

# Expected output:
# ✅ Test 1 (Identity): PASS
# ✅ Test 2 (Boundaries): PASS
# ✅ Test 3 (Blocking): PASS
# ✅ Test 4 (Governance): PASS
# ✅ Test 5 (Sandbox): PASS
# 
# PREFLIGHT TEST SUITE: PASS
```

---

## 12. Preflight Checklist

Use this checklist when implementing preflight for an agent:

- [ ] Category 1: Identity verification implemented
- [ ] Category 2: Boundary establishment implemented
- [ ] Category 3: Default behavior blocking implemented
- [ ] Category 4: Governance state validation implemented
- [ ] Category 5: Role-specific sandbox implemented
- [ ] Preflight failure escalation logic added
- [ ] Test scenarios pass
- [ ] Preflight integrated into wake-up protocol
- [ ] Preflight execution logged to environment-health.json
- [ ] Documentation updated in agent contract

---

## 13. Examples

### 13.1 Minimal Preflight (Template)

```bash
#!/bin/bash
# Preflight for: <agent-type>

AGENT_TYPE="<agent-type>"
AGENT_CLASS="<class>"
CONTRACT_VERSION="1.0.0"
EXECUTION_MODE="orchestration"  # or "implementation"

# Category 1: Identity
[ -n "$AGENT_TYPE" ] || exit 1
[ -n "$AGENT_CLASS" ] || exit 1

# Category 2: Boundaries
WRITE_SCOPE=("path1/**" "path2/**")
ESCALATION_REQUIRED=("governance/canon/**")

# Category 3: Blocking
CODE_WRITING_ALLOWED=false
FORCE_PUSH_ALLOWED=false

# Category 4: Governance
[ -f "governance/CANON_INVENTORY.json" ] || exit 1

# Category 5: Sandbox
# Role-specific setup...

echo "✅ PREFLIGHT PASSED"
exit 0
```

### 13.2 Full Preflight (Foreman)

See: `.github/scripts/preflight-foreman.sh` (to be created)

### 13.3 Full Preflight (Builder)

See: `.github/scripts/preflight-builder.sh` (to be created)

---

## 14. Relationship to Other Phases

**Preflight → Induction**:
- Preflight MUST pass before Induction begins
- Preflight establishes sandbox; Induction loads context
- Preflight failures block Induction execution

**Preflight → Build**:
- Build phase respects boundaries established in Preflight
- Build phase default blocks enforced via Preflight

**Preflight → Handover**:
- Handover verifies Preflight was executed
- Handover cannot proceed if Preflight was skipped

---

## 15. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Johan Ras | Initial canonical preflight pattern |

---

**Authority**: CS2 (Johan Ras)  
**Parent**: AGENT_CONTRACT_ARCHITECTURE.md v1.0.0  
**Enforcement**: Merge Gate Interface + CodexAdvisor  
**Ripple**: PUBLIC_API (all consumer repositories)

---

*This document is Tier-0 constitutional canon. All agents MUST implement preflight per this pattern. Changes require CS2 approval and full governance ripple.*
