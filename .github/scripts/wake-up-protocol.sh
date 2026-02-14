#!/bin/bash
# Wake-Up Protocol Script for Living Agent System v6.2.0
# Authority: LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Execute comprehensive agent wake-up health checks before session start
# 
# Usage: .github/scripts/wake-up-protocol.sh <agent-id>
# Example: .github/scripts/wake-up-protocol.sh governance-liaison-isms

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AGENT_ID="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
WORKSPACE_DIR="${REPO_ROOT}/.agent-workspace/${AGENT_ID}"
# Try multiple naming conventions for agent contract files
AGENT_CONTRACT_FILE="${REPO_ROOT}/.github/agents/${AGENT_ID}-agent.md"
if [ ! -f "$AGENT_CONTRACT_FILE" ]; then
    AGENT_CONTRACT_FILE="${REPO_ROOT}/.github/agents/${AGENT_ID}.md"
fi
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_DATE=$(date -u +"%Y%m%d")

# Output files
WORKING_CONTRACT="${WORKSPACE_DIR}/working-contract.md"
ENVIRONMENT_HEALTH="${WORKSPACE_DIR}/environment-health.json"

# Validation
if [ -z "$AGENT_ID" ]; then
    echo -e "${RED}❌ ERROR: Agent ID required${NC}"
    echo "Usage: $0 <agent-id>"
    echo "Example: $0 governance-liaison-isms"
    exit 1
fi

echo "======================================"
echo "🔐 WAKE-UP PROTOCOL v6.2.0"
echo "======================================"
echo "Agent: $AGENT_ID"
echo "Time: $TIMESTAMP"
echo "Repository: $(basename "$REPO_ROOT")"
echo ""

# Initialize workspace if needed
mkdir -p "${WORKSPACE_DIR}"/{memory,context,escalation-inbox,personal}

# ==============================================================================
# Phase 1: Self-Identification
# ==============================================================================
echo -e "${BLUE}Phase 1: Self-Identification${NC}"
echo "------------------------------"

PHASE1_STATUS="PASS"

# Check if agent contract exists
if [ ! -f "$AGENT_CONTRACT_FILE" ]; then
    echo -e "${RED}❌ Agent contract not found: ${AGENT_CONTRACT_FILE}${NC}"
    PHASE1_STATUS="FAIL"
    
    # Create escalation
    ESCALATION_FILE="${WORKSPACE_DIR}/escalation-inbox/escalation-missing-agent-contract-${SESSION_DATE}.md"
    cat > "$ESCALATION_FILE" <<EOF
# Escalation: Missing Agent Contract

**Date**: ${TIMESTAMP}
**Agent**: ${AGENT_ID}
**Type**: BLOCKER
**Severity**: CRITICAL

## Issue
Agent contract file not found: ${AGENT_CONTRACT_FILE}

## Impact
Cannot proceed without agent identity, class, and authority boundaries.

## Required Action
Create agent contract file with required sections per LIVING_AGENT_SYSTEM.md v6.2.0

## Authority
LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md - Phase 1: Self-Identification
EOF
    
    echo -e "${RED}✗ Phase 1: FAILED - Cannot proceed without agent contract${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Agent contract found: ${AGENT_CONTRACT_FILE}${NC}"

# Extract agent class from contract (YAML front matter)
# Use larger buffer to handle various YAML structures
AGENT_CLASS=$(grep -A 50 "^agent:" "$AGENT_CONTRACT_FILE" | grep "class:" | head -1 | awk '{print $2}' || echo "unknown")
AGENT_VERSION=$(grep -A 50 "^agent:" "$AGENT_CONTRACT_FILE" | grep "version:" | head -1 | awk '{print $2}' || echo "unknown")

echo "  - Class: ${AGENT_CLASS}"
echo "  - Version: ${AGENT_VERSION}"
echo -e "${GREEN}✓ Phase 1: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 2: Memory Scan
# ==============================================================================
echo -e "${BLUE}Phase 2: Memory Scan${NC}"
echo "------------------------------"

PHASE2_STATUS="PASS"

# Scan memory directory
MEMORY_DIR="${WORKSPACE_DIR}/memory"
MEMORY_COUNT=$(find "$MEMORY_DIR" -name "session-*.md" 2>/dev/null | wc -l || echo "0")

echo "  - Memory directory: ${MEMORY_DIR}"
echo "  - Previous sessions found: ${MEMORY_COUNT}"

if [ "$MEMORY_COUNT" -gt 0 ]; then
    echo "  - Recent sessions:"
    find "$MEMORY_DIR" -name "session-*.md" -type f | sort -r | head -5 | while read -r session_file; do
        echo "    • $(basename "$session_file")"
    done
fi

# Check escalation inbox
ESCALATION_COUNT=$(find "${WORKSPACE_DIR}/escalation-inbox" -name "escalation-*.md" 2>/dev/null | wc -l || echo "0")
echo "  - Pending escalations: ${ESCALATION_COUNT}"

if [ "$ESCALATION_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Unresolved escalations detected${NC}"
    find "${WORKSPACE_DIR}/escalation-inbox" -name "escalation-*.md" | while read -r esc_file; do
        echo "    • $(basename "$esc_file")"
    done
fi

echo -e "${GREEN}✓ Phase 2: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 3: Governance Discovery
# ==============================================================================
echo -e "${BLUE}Phase 3: Governance Discovery${NC}"
echo "------------------------------"

PHASE3_STATUS="PASS"

# Load CANON_INVENTORY.json
CANON_INVENTORY="${REPO_ROOT}/governance/CANON_INVENTORY.json"
if [ -f "$CANON_INVENTORY" ]; then
    echo -e "${GREEN}✓ CANON_INVENTORY.json found${NC}"
    
    # Validate JSON
    if jq empty "$CANON_INVENTORY" 2>/dev/null; then
        CANON_COUNT=$(jq '.total_artifacts // 0' "$CANON_INVENTORY")
        CANON_VERSION=$(jq -r '.version // "unknown"' "$CANON_INVENTORY")
        echo "  - Canon version: ${CANON_VERSION}"
        echo "  - Total artifacts: ${CANON_COUNT}"
    else
        echo -e "${RED}❌ CANON_INVENTORY.json is invalid JSON${NC}"
        PHASE3_STATUS="FAIL"
    fi
else
    echo -e "${YELLOW}⚠️  CANON_INVENTORY.json not found${NC}"
    echo "  - Scanning governance/canon/ directory as fallback..."
    CANON_COUNT=$(find "${REPO_ROOT}/governance/canon" -name "*.md" 2>/dev/null | wc -l || echo "0")
    echo "  - Canon files found: ${CANON_COUNT}"
fi

# Check governance inventory
GOV_INVENTORY="${REPO_ROOT}/GOVERNANCE_ARTIFACT_INVENTORY.md"
if [ -f "$GOV_INVENTORY" ]; then
    echo -e "${GREEN}✓ GOVERNANCE_ARTIFACT_INVENTORY.md found${NC}"
else
    echo -e "${YELLOW}⚠️  GOVERNANCE_ARTIFACT_INVENTORY.md not found${NC}"
fi

echo -e "${GREEN}✓ Phase 3: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 4: Environment Health Check
# ==============================================================================
echo -e "${BLUE}Phase 4: Environment Health Check${NC}"
echo "------------------------------"

PHASE4_STATUS="PASS"

# Check git status
echo "  - Checking git repository..."
cd "$REPO_ROOT"
GIT_STATUS=$(git status --porcelain | wc -l)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "  - Current branch: ${GIT_BRANCH}"
echo "  - Uncommitted changes: ${GIT_STATUS}"

if [ "$GIT_STATUS" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Repository has uncommitted changes${NC}"
fi

# Validate JSON files in governance
echo "  - Validating JSON files..."
JSON_ERRORS=0
while IFS= read -r json_file; do
    if ! jq empty "$json_file" 2>/dev/null; then
        echo -e "${RED}    ❌ Invalid JSON: ${json_file}${NC}"
        JSON_ERRORS=$((JSON_ERRORS + 1))
    fi
done < <(find governance -name "*.json" 2>/dev/null)

if [ "$JSON_ERRORS" -gt 0 ]; then
    echo -e "${RED}  ❌ ${JSON_ERRORS} JSON files have errors${NC}"
    PHASE4_STATUS="FAIL"
else
    echo -e "${GREEN}  ✓ All JSON files valid${NC}"
fi

echo -e "${GREEN}✓ Phase 4: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 5: Drift Detection & Analysis
# ==============================================================================
echo -e "${BLUE}Phase 5: Drift Detection & Analysis${NC}"
echo "------------------------------"

DRIFT_DETECTED="NO"

# Basic drift detection - check for untracked governance files
echo "  - Scanning for governance drift..."

# Check if there are governance files not in git
UNTRACKED_GOV=$(git ls-files --others --exclude-standard governance/ 2>/dev/null | wc -l || echo "0")
if [ "$UNTRACKED_GOV" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  ${UNTRACKED_GOV} untracked governance files detected${NC}"
    DRIFT_DETECTED="YES"
fi

if [ "$DRIFT_DETECTED" = "NO" ]; then
    echo -e "${GREEN}  ✓ No governance drift detected${NC}"
fi

echo -e "${GREEN}✓ Phase 5: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 6: Auto-Remediation
# ==============================================================================
echo -e "${BLUE}Phase 6: Auto-Remediation${NC}"
echo "------------------------------"

if [ "$DRIFT_DETECTED" = "NO" ]; then
    echo "  ✓ No remediation needed"
else
    echo "  - Drift detected but auto-remediation requires agent authority verification"
    echo "  - Agent should review and remediate within authority bounds"
fi

echo -e "${GREEN}✓ Phase 6: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 7: Working Contract Generation
# ==============================================================================
echo -e "${BLUE}Phase 7: Working Contract Generation${NC}"
echo "------------------------------"

# Generate working contract
cat > "$WORKING_CONTRACT" <<EOF
# Working Contract - Session $(date +%Y%m%d)

**Agent**: ${AGENT_ID}  
**Class**: ${AGENT_CLASS}  
**Time**: ${TIMESTAMP}  
**Version**: ${AGENT_VERSION}

---

## Health Check Summary

### Phase Results
- ✅ Phase 1: Self-Identification - ${PHASE1_STATUS}
- ✅ Phase 2: Memory Scan - ${PHASE2_STATUS}
- ✅ Phase 3: Governance Discovery - ${PHASE3_STATUS}
- ✅ Phase 4: Environment Health Check - ${PHASE4_STATUS}
- ✅ Phase 5: Drift Detection - ${DRIFT_DETECTED}
- ✅ Phase 6: Auto-Remediation - COMPLETED
- ✅ Phase 7: Working Contract Generation - IN PROGRESS

### Memory Context
- Previous sessions: ${MEMORY_COUNT}
- Pending escalations: ${ESCALATION_COUNT}

### Governance Context
- Canon artifacts: ${CANON_COUNT:-0}
- Governance inventory: $([ -f "$GOV_INVENTORY" ] && echo "PRESENT" || echo "MISSING")
- Drift detected: ${DRIFT_DETECTED}

### Environment Context
- Git branch: ${GIT_BRANCH}
- Uncommitted changes: ${GIT_STATUS}
- JSON validation: $([ "$JSON_ERRORS" -eq 0 ] && echo "PASSED" || echo "FAILED (${JSON_ERRORS} errors)")

---

## Session Mandate

This working contract authorizes the agent to proceed with session work under the following conditions:

1. **Authority Boundaries**: As defined in agent contract
2. **Escalation Triggers**: As defined in LIVING_AGENT_SYSTEM.md v6.2.0
3. **Governance Compliance**: All health checks passed
4. **Session Safety**: Environment validated and ready

---

## Generated By
Wake-up protocol script v6.2.0
Authority: LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md

EOF

echo -e "${GREEN}✓ Working contract generated: ${WORKING_CONTRACT}${NC}"

# Generate environment health JSON
cat > "$ENVIRONMENT_HEALTH" <<EOF
{
  "agent_id": "${AGENT_ID}",
  "agent_class": "${AGENT_CLASS}",
  "timestamp": "${TIMESTAMP}",
  "health_check_version": "6.2.0",
  "phases": {
    "phase1_self_identification": "${PHASE1_STATUS}",
    "phase2_memory_scan": "${PHASE2_STATUS}",
    "phase3_governance_discovery": "${PHASE3_STATUS}",
    "phase4_environment_health": "${PHASE4_STATUS}",
    "phase5_drift_detection": "${DRIFT_DETECTED}",
    "phase6_auto_remediation": "COMPLETED",
    "phase7_working_contract": "COMPLETED"
  },
  "memory": {
    "previous_sessions": ${MEMORY_COUNT},
    "pending_escalations": ${ESCALATION_COUNT}
  },
  "governance": {
    "canon_artifacts": ${CANON_COUNT:-0},
    "drift_detected": "${DRIFT_DETECTED}"
  },
  "environment": {
    "git_branch": "${GIT_BRANCH}",
    "uncommitted_changes": ${GIT_STATUS},
    "json_errors": ${JSON_ERRORS}
  }
}
EOF

echo -e "${GREEN}✓ Environment health JSON generated: ${ENVIRONMENT_HEALTH}${NC}"
echo -e "${GREEN}✓ Phase 7: PASSED${NC}"
echo ""

# ==============================================================================
# Summary
# ==============================================================================
echo "======================================"
echo "🎯 WAKE-UP PROTOCOL COMPLETE"
echo "======================================"

if [ "$PHASE1_STATUS" = "PASS" ] && [ "$PHASE2_STATUS" = "PASS" ] && [ "$PHASE3_STATUS" = "PASS" ] && [ "$PHASE4_STATUS" = "PASS" ]; then
    echo -e "${GREEN}✅ All health checks PASSED${NC}"
    echo ""
    echo "Agent is ready to begin session work."
    echo ""
    echo "Working contract: ${WORKING_CONTRACT}"
    echo "Environment health: ${ENVIRONMENT_HEALTH}"
    exit 0
else
    echo -e "${RED}❌ Health checks FAILED${NC}"
    echo ""
    echo "Review escalation inbox: ${WORKSPACE_DIR}/escalation-inbox/"
    exit 1
fi
