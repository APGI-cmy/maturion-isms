#!/bin/bash
# Wake-Up Protocol - Living Agent System v6.2.0
# Authority: LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md v1.0.0
# Purpose: Execute agent wake-up with health checks, memory loading, governance validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
AGENT_ID="${1:-governance-liaison-isms}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
WORKSPACE="$REPO_ROOT/.agent-workspace/$AGENT_ID"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_DATE=$(date -u +"%Y%m%d")

# Ensure workspace exists
mkdir -p "$WORKSPACE/memory" "$WORKSPACE/context" "$WORKSPACE/escalation-inbox" "$WORKSPACE/personal"

# Initialize status variables
HEALTH_STATUS="SAFE"
WARNINGS=()
ERRORS=()
DRIFTS=()

echo ""
echo "🚀 WAKING UP: $AGENT_ID"
echo ""

# =============================================================================
# Phase 1: Self-Identification
# =============================================================================
echo -e "${BLUE}📋 STEP 1: Reading my identity...${NC}"

AGENT_FILE=""
if [ -f "$REPO_ROOT/.github/agents/${AGENT_ID}-agent.md" ]; then
    AGENT_FILE="$REPO_ROOT/.github/agents/${AGENT_ID}-agent.md"
elif [ -f "$REPO_ROOT/.github/agents/${AGENT_ID}.agent.md" ]; then
    AGENT_FILE="$REPO_ROOT/.github/agents/${AGENT_ID}.agent.md"
elif [ -f "$REPO_ROOT/governance/agents/${AGENT_ID}.agent.md" ]; then
    AGENT_FILE="$REPO_ROOT/governance/agents/${AGENT_ID}.agent.md"
fi

if [ -z "$AGENT_FILE" ] || [ ! -f "$AGENT_FILE" ]; then
    echo -e "  ${RED}❌ Agent contract not found for: $AGENT_ID${NC}"
    ERRORS+=("Agent contract missing")
    HEALTH_STATUS="UNSAFE"
else
    # Extract agent class from agent file
    AGENT_CLASS=$(grep -m 1 "^  class:" "$AGENT_FILE" | awk '{print $2}' || echo "unknown")
    AGENT_VERSION=$(grep -m 1 "^  version:" "$AGENT_FILE" | awk '{print $2}' || echo "unknown")
    
    echo -e "  ${GREEN}✓ I am: $AGENT_CLASS (v$AGENT_VERSION)${NC}"
    echo "  📄 Contract: $AGENT_FILE"
fi

# =============================================================================
# Phase 2: Memory Scan
# =============================================================================
echo ""
echo -e "${BLUE}🧠 STEP 2: Scanning session memories...${NC}"

SESSION_COUNT=$(find "$WORKSPACE/memory" -name "session-*.md" 2>/dev/null | wc -l || echo "0")
ESCALATION_COUNT=$(find "$WORKSPACE/escalation-inbox" -name "*.md" 2>/dev/null | wc -l || echo "0")

echo "  📂 Found $SESSION_COUNT previous session(s)"
if [ "$SESSION_COUNT" -gt 0 ]; then
    # Show last 3 sessions
    find "$WORKSPACE/memory" -name "session-*.md" | sort -r | head -3 | while read -r session; do
        SESSION_NAME=$(basename "$session" .md)
        echo "    → $SESSION_NAME"
    done
fi

if [ "$ESCALATION_COUNT" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️  $ESCALATION_COUNT pending escalation(s)${NC}"
    WARNINGS+=("$ESCALATION_COUNT pending escalations")
    if [ "$HEALTH_STATUS" == "SAFE" ]; then
        HEALTH_STATUS="WARNINGS"
    fi
fi

# =============================================================================
# Phase 3: Governance Discovery
# =============================================================================
echo ""
echo -e "${BLUE}📦 STEP 3: Discovering governance...${NC}"

CANON_INVENTORY="$REPO_ROOT/governance/CANON_INVENTORY.json"
GOVERNANCE_COUNT=0
CANON_COUNT=0

if [ -f "$CANON_INVENTORY" ]; then
    # Count artifacts from CANON_INVENTORY.json
    if command -v jq &> /dev/null; then
        CANON_COUNT=$(jq '.artifacts | length' "$CANON_INVENTORY" 2>/dev/null || echo "0")
        echo "  ✓ Loaded $CANON_COUNT canonical artifact(s)"
    else
        echo "  ⚠️  jq not available - cannot parse CANON_INVENTORY.json"
        WARNINGS+=("jq not available for JSON parsing")
    fi
else
    echo -e "  ${YELLOW}⚠️  CANON_INVENTORY.json not found${NC}"
    WARNINGS+=("CANON_INVENTORY.json missing")
fi

# Count governance files
if [ -d "$REPO_ROOT/governance" ]; then
    GOVERNANCE_COUNT=$(find "$REPO_ROOT/governance" -type f -name "*.md" | wc -l || echo "0")
    echo "  ✓ Found $GOVERNANCE_COUNT governance document(s)"
fi

# Check for critical canon files
CRITICAL_CANON=(
    "governance/canon/LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md"
    "governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md"
    "governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md"
)

MISSING_CANON=()
for canon in "${CRITICAL_CANON[@]}"; do
    if [ ! -f "$REPO_ROOT/$canon" ]; then
        MISSING_CANON+=("$canon")
    fi
done

if [ ${#MISSING_CANON[@]} -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️  Missing critical canon: ${#MISSING_CANON[@]} file(s)${NC}"
    for missing in "${MISSING_CANON[@]}"; do
        echo "    - $missing"
        WARNINGS+=("Missing critical canon: $missing")
    done
fi

# =============================================================================
# Phase 4: Environment Health Check
# =============================================================================
echo ""
echo -e "${BLUE}🏥 STEP 4: Environment health check...${NC}"

# Git status check
if command -v git &> /dev/null; then
    cd "$REPO_ROOT"
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        echo "  ℹ️  Repository has uncommitted changes"
    else
        echo "  ✅ Repository: Clean, no uncommitted changes"
    fi
    
    # Check current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    echo "  📍 Branch: $CURRENT_BRANCH"
fi

# JSON validation
JSON_ERRORS=0
if command -v jq &> /dev/null; then
    while IFS= read -r json_file; do
        if ! jq empty "$json_file" 2>/dev/null; then
            echo -e "  ${RED}❌ Invalid JSON: $json_file${NC}"
            JSON_ERRORS=$((JSON_ERRORS + 1))
            ERRORS+=("Invalid JSON: $json_file")
        fi
    done < <(find "$REPO_ROOT/governance" -name "*.json" 2>/dev/null || true)
    
    if [ "$JSON_ERRORS" -eq 0 ]; then
        JSON_COUNT=$(find "$REPO_ROOT/governance" -name "*.json" 2>/dev/null | wc -l || echo "0")
        if [ "$JSON_COUNT" -gt 0 ]; then
            echo "  ✅ JSON: All $JSON_COUNT file(s) valid"
        fi
    else
        HEALTH_STATUS="UNSAFE"
    fi
fi

# =============================================================================
# Phase 5: Drift Detection
# =============================================================================
echo ""
echo -e "${BLUE}🔍 STEP 5: Drift detection...${NC}"

# Check agent contract alignment
if [ -n "$AGENT_FILE" ] && [ "$AGENT_VERSION" != "unknown" ]; then
    EXPECTED_VERSION="6.2.0"
    if [ "$AGENT_VERSION" == "$EXPECTED_VERSION" ]; then
        echo "  ✓ Agent contract: Aligned (v$AGENT_VERSION)"
    else
        echo -e "  ${YELLOW}⚠️  Agent contract: Version mismatch (expected v$EXPECTED_VERSION, found v$AGENT_VERSION)${NC}"
        DRIFTS+=("Agent contract version: $AGENT_VERSION (expected $EXPECTED_VERSION)")
        WARNINGS+=("Agent contract version drift")
    fi
fi

# Check for governance inventory drift (placeholder - would need more complex logic)
if [ -f "$REPO_ROOT/GOVERNANCE_ARTIFACT_INVENTORY.md" ]; then
    echo "  ✓ Governance inventory: Present"
else
    echo -e "  ${YELLOW}⚠️  GOVERNANCE_ARTIFACT_INVENTORY.md not found${NC}"
    WARNINGS+=("GOVERNANCE_ARTIFACT_INVENTORY.md missing")
fi

# Check for CANON_INVENTORY placeholder hashes (degraded mode detection)
if [ -f "$CANON_INVENTORY" ] && command -v jq &> /dev/null; then
    # Check for placeholder or truncated hashes
    PLACEHOLDER_COUNT=$(jq -r '.artifacts | to_entries[] | select(.value.sha256 | length < 64) | .key' "$CANON_INVENTORY" 2>/dev/null | wc -l || echo "0")
    
    if [ "$PLACEHOLDER_COUNT" -gt 0 ]; then
        echo -e "  ${RED}❌ DEGRADED MODE: $PLACEHOLDER_COUNT placeholder hash(es) detected in CANON_INVENTORY.json${NC}"
        ERRORS+=("DEGRADED MODE: Placeholder hashes in CANON_INVENTORY.json")
        HEALTH_STATUS="UNSAFE"
        DRIFTS+=("CANON_INVENTORY has $PLACEHOLDER_COUNT placeholder hashes")
    else
        echo "  ✓ CANON_INVENTORY: All hashes valid (no placeholders)"
    fi
fi

# =============================================================================
# Phase 6: Auto-Remediation
# =============================================================================
echo ""
echo -e "${BLUE}🔧 STEP 6: Auto-remediation...${NC}"

# For this implementation, we'll focus on detection rather than automatic fixes
# Actual remediation would require more sophisticated logic based on agent authority

if [ ${#DRIFTS[@]} -eq 0 ]; then
    echo "  ✓ No remediable drift detected"
else
    echo "  ℹ️  Drift detected (remediation requires manual intervention):"
    for drift in "${DRIFTS[@]}"; do
        echo "    - $drift"
    done
fi

# =============================================================================
# Phase 7: Working Contract Generation
# =============================================================================
echo ""
echo -e "${BLUE}📜 STEP 7: Generating working contract...${NC}"

WORKING_CONTRACT="$WORKSPACE/working-contract.md"
SESSION_NUMBER=$(printf "%03d" $((SESSION_COUNT + 1)))

cat > "$WORKING_CONTRACT" << EOF
# Working Contract - Session $SESSION_NUMBER

**Agent**: $AGENT_ID  
**Class**: ${AGENT_CLASS:-unknown}  
**Time**: $TIMESTAMP  
**Session**: session-$SESSION_NUMBER-$SESSION_DATE

## My Identity
- Class: ${AGENT_CLASS:-unknown}
- Version: ${AGENT_VERSION:-unknown}
- Contract: $AGENT_FILE

## Environment Status
- Health: $HEALTH_STATUS
- Repository: Branch $CURRENT_BRANCH
- Governance: ✅ $GOVERNANCE_COUNT documents loaded
- Canon: ✅ $CANON_COUNT canonical artifacts
- Memories: $SESSION_COUNT sessions available
- Escalations: $ESCALATION_COUNT pending

## Governance Context
- CANON_INVENTORY.json: $([ -f "$CANON_INVENTORY" ] && echo "✅ Present" || echo "❌ Missing")
- Critical Canon Files: $((${#CRITICAL_CANON[@]} - ${#MISSING_CANON[@]}))/${#CRITICAL_CANON[@]} present

$(if [ ${#MISSING_CANON[@]} -gt 0 ]; then
    echo "### Missing Critical Canon"
    for missing in "${MISSING_CANON[@]}"; do
        echo "- ⚠️ $missing"
    done
fi)

## Drift Detected
$(if [ ${#DRIFTS[@]} -eq 0 ]; then
    echo "✅ None"
else
    for drift in "${DRIFTS[@]}"; do
        echo "- ⚠️ $drift"
    done
fi)

## What I Can Do (This Session)
✅ Receive governance ripple events
✅ Execute layer-down protocol for governance alignment
✅ Update governance inventories within authority
✅ Create session memories and evidence artifacts
✅ Escalate issues beyond my authority to CS2

## What I Cannot Do (This Session)
❌ Modify my own agent contract
❌ Interpret governance policy (escalate to CS2)
❌ Cross repository boundaries to modify canonical source
❌ Make architecture, builder, or enforcement decisions
❌ Push directly to main (use PR-only workflow)

## Session Mandate
$([ "$HEALTH_STATUS" == "SAFE" ] && echo "✅" || echo "⚠️") Environment health validated
✅ Governance loaded and scanned
$([ ${#DRIFTS[@]} -eq 0 ] && echo "✅" || echo "⚠️") Drift status documented
✅ Memory scanned ($SESSION_COUNT sessions)
$([ "$HEALTH_STATUS" == "SAFE" ] && echo "✅ Ready for work" || echo "⚠️ Ready with warnings")

## Warnings/Limitations
$(if [ ${#WARNINGS[@]} -eq 0 ]; then
    echo "✅ None"
else
    for warning in "${WARNINGS[@]}"; do
        echo "⚠️ $warning"
    done
fi)

$(if [ ${#ERRORS[@]} -gt 0 ]; then
    echo "## Errors"
    for error in "${ERRORS[@]}"; do
        echo "❌ $error"
    done
fi)

**REMEMBER**: I am a governance liaison. I maintain local governance alignment with canonical governance repository. I layer down canon, update inventories, and escalate to CS2 when needed.

---
Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | Session: $SESSION_NUMBER | Generated: $TIMESTAMP
EOF

echo "  ✓ Working contract: $WORKING_CONTRACT"

# Generate environment health JSON
ENVIRONMENT_HEALTH="$WORKSPACE/environment-health.json"

cat > "$ENVIRONMENT_HEALTH" << EOF
{
  "timestamp": "$TIMESTAMP",
  "session_id": "session-$SESSION_NUMBER-$SESSION_DATE",
  "agent_id": "$AGENT_ID",
  "agent_class": "${AGENT_CLASS:-unknown}",
  "agent_version": "${AGENT_VERSION:-unknown}",
  "health_status": "$HEALTH_STATUS",
  "checks": {
    "self_identification": { "status": "$([ -n "$AGENT_FILE" ] && echo "PASS" || echo "FAIL")" },
    "memory_scan": { "status": "PASS", "sessions_found": $SESSION_COUNT, "escalations_pending": $ESCALATION_COUNT },
    "governance_discovery": { "status": "PASS", "governance_docs": $GOVERNANCE_COUNT, "canon_artifacts": $CANON_COUNT },
    "environment_health": { "status": "$([ "$JSON_ERRORS" -eq 0 ] && echo "PASS" || echo "FAIL")" },
    "drift_detection": { 
      "status": "$([ ${#DRIFTS[@]} -eq 0 ] && echo "PASS" || echo "WARN")", 
      "drifts_detected": ${#DRIFTS[@]}
    }
  },
  "warnings_count": ${#WARNINGS[@]},
  "errors_count": ${#ERRORS[@]},
  "working_contract_path": "$WORKING_CONTRACT"
}
EOF

echo "  ✓ Environment health: $ENVIRONMENT_HEALTH"

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "╔═══════════════════════════════════════════════╗"
if [ "$HEALTH_STATUS" == "SAFE" ]; then
    echo -e "║  ${GREEN}✅ WAKE-UP COMPLETE - READY FOR WORK${NC}      ║"
elif [ "$HEALTH_STATUS" == "WARNINGS" ]; then
    echo -e "║  ${YELLOW}⚠️  WAKE-UP COMPLETE - READY WITH WARNINGS${NC} ║"
else
    echo -e "║  ${RED}❌ WAKE-UP COMPLETE - UNSAFE ENVIRONMENT${NC}   ║"
fi
echo "╚═══════════════════════════════════════════════╝"
echo ""

if [ ${#WARNINGS[@]} -gt 0 ] || [ ${#ERRORS[@]} -gt 0 ]; then
    echo "Summary:"
    [ ${#ERRORS[@]} -gt 0 ] && echo "  ❌ Errors: ${#ERRORS[@]}"
    [ ${#WARNINGS[@]} -gt 0 ] && echo "  ⚠️  Warnings: ${#WARNINGS[@]}"
    [ ${#DRIFTS[@]} -gt 0 ] && echo "  🔍 Drifts: ${#DRIFTS[@]}"
    echo ""
fi

echo "📖 Read your working contract:"
echo "   cat $WORKING_CONTRACT"
echo ""

# Exit with appropriate code
if [ "$HEALTH_STATUS" == "UNSAFE" ]; then
    exit 1
else
    exit 0
fi
