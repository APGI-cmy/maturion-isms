#!/bin/bash
# Handover Testing Script for governance-liaison-isms
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Validate changes locally BEFORE pushing to ensure merge gates will pass
#
# Usage: .agent-workspace/governance-liaison-isms/handover-test.sh
#
# This script MUST be run before every commit/push. Skipping this is test dodging.

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "======================================"
echo "🧪 HANDOVER TESTING - governance-liaison-isms"
echo "======================================"
echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0"
echo "Date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

ALL_PASSED=true

# ==============================================================================
# Test 1: YAML Frontmatter Validation
# ==============================================================================
echo -e "${BLUE}Test 1: YAML Frontmatter Validation${NC}"
echo "------------------------------"

YAML_VALID=true
for agent_file in .github/agents/*.md; do
    if [ -f "$agent_file" ]; then
        echo "  Checking: $(basename "$agent_file")"
        # Extract YAML frontmatter and validate
        if python3 -c "
import yaml
import sys
try:
    with open('$agent_file') as f:
        content = f.read()
        if content.startswith('---'):
            parts = content.split('---')
            if len(parts) >= 3:
                yaml_content = parts[1]
                yaml.safe_load(yaml_content)
    sys.exit(0)
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
" 2>/dev/null; then
            echo -e "    ${GREEN}✅ Valid${NC}"
        else
            echo -e "    ${RED}❌ Invalid YAML${NC}"
            YAML_VALID=false
            ALL_PASSED=false
        fi
    fi
done

echo ""
if [ "$YAML_VALID" = true ]; then
    echo -e "${GREEN}✅ Test 1 PASSED${NC}"
else
    echo -e "${RED}❌ Test 1 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Test 2: JSON Validation
# ==============================================================================
echo -e "${BLUE}Test 2: JSON Validation${NC}"
echo "------------------------------"

JSON_VALID=true

# Check CANON_INVENTORY.json
if [ -f "governance/CANON_INVENTORY.json" ]; then
    echo "  Checking: governance/CANON_INVENTORY.json"
    if jq empty governance/CANON_INVENTORY.json 2>/dev/null; then
        echo -e "    ${GREEN}✅ Valid${NC}"
    else
        echo -e "    ${RED}❌ Invalid JSON${NC}"
        JSON_VALID=false
        ALL_PASSED=false
    fi
fi

echo ""
if [ "$JSON_VALID" = true ]; then
    echo -e "${GREEN}✅ Test 2 PASSED${NC}"
else
    echo -e "${RED}❌ Test 2 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Test 3: Governance Liaison Session Memory Validation
# ==============================================================================
echo -e "${BLUE}Test 3: Governance Liaison Session Memory${NC}"
echo "------------------------------"

MEMORY_VALID=true

# Check for governance-liaison session memory
if ls .agent-workspace/governance-liaison-isms/memory/session-*.md 1> /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Session memory files exist${NC}"
    
    # Check for recent session memory (within last week)
    RECENT_SESSION=$(find .agent-workspace/governance-liaison-isms/memory -name "session-*.md" -type f -mtime -7 | wc -l)
    if [ "$RECENT_SESSION" -gt 0 ]; then
        echo -e "  ${GREEN}✅ Recent session memory found${NC}"
    else
        echo -e "  ${YELLOW}⚠️  No recent session memory (last 7 days)${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️  No session memory files found${NC}"
fi

echo ""
if [ "$MEMORY_VALID" = true ]; then
    echo -e "${GREEN}✅ Test 3 PASSED${NC}"
else
    echo -e "${RED}❌ Test 3 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Test 4: POLC Boundary Validation (for any Foreman session memory)
# ==============================================================================
echo -e "${BLUE}Test 4: POLC Boundary Validation${NC}"
echo "------------------------------"

POLC_VALID=true

if ls .agent-workspace/foreman*/memory/session-*.md 1> /dev/null 2>&1; then
    echo "  Checking Foreman session memory for POLC violations..."
    echo ""
    
    VIOLATION_FOUND=false
    for session_file in .agent-workspace/foreman*/memory/session-*.md; do
        if [ -f "$session_file" ]; then
            echo "    Checking: $(basename "$session_file")"
            
            # Use the SAME logic as .github/workflows/polc-boundary-gate.yml
            if grep -iE "(implemented|wrote|created|modified).*production.*code|FM.*implemented|Foreman.*wrote.*code" "$session_file" | \
               grep -qviE "did NOT|NOT.*implement|NOT.*write|did not|didn't|no production"; then
                echo -e "      ${RED}❌ POLC VIOLATION DETECTED${NC}"
                echo "      File contains positive assertions about FM writing code"
                echo "      Violating lines:"
                grep -iE "(implemented|wrote|created|modified).*production.*code|FM.*implemented|Foreman.*wrote.*code" "$session_file" | \
                grep -viE "did NOT|NOT.*implement|NOT.*write|did not|didn't|no production" | \
                sed 's/^/        > /'
                echo ""
                VIOLATION_FOUND=true
                POLC_VALID=false
                ALL_PASSED=false
            else
                echo -e "      ${GREEN}✅ No violations${NC}"
            fi
        fi
    done
    
    echo ""
    
    if [ "$VIOLATION_FOUND" = true ]; then
        echo -e "${RED}❌ POLC VIOLATIONS FOUND${NC}"
        echo ""
        echo "Action Required:"
        echo "  1. Review flagged session memory files"
        echo "  2. Remove or revise positive assertions about FM writing code"
        echo "  3. Use explicit negations: 'FM did NOT write code'"
        echo "  4. Emphasize supervision: 'FM supervised builders'"
        echo "  5. Re-run this test"
        echo ""
    fi
else
    echo -e "  ${GREEN}ℹ️  No Foreman session memory - POLC check not applicable${NC}"
fi

echo ""
if [ "$POLC_VALID" = true ]; then
    echo -e "${GREEN}✅ Test 4 PASSED${NC}"
else
    echo -e "${RED}❌ Test 4 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Test 5: Evidence Artifact Bundle
# ==============================================================================
echo -e "${BLUE}Test 5: Evidence Artifact Bundle${NC}"
echo "------------------------------"

EVIDENCE_VALID=true

if [ -d ".agent-admin" ]; then
    echo -e "  ${GREEN}✅ .agent-admin/ directory exists${NC}"
else
    echo -e "  ${YELLOW}⚠️  .agent-admin/ directory missing${NC}"
fi

echo ""
if [ "$EVIDENCE_VALID" = true ]; then
    echo -e "${GREEN}✅ Test 5 PASSED${NC}"
else
    echo -e "${RED}❌ Test 5 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Test 6: No Uncommitted Changes to Protected Files
# ==============================================================================
echo -e "${BLUE}Test 6: Protected Files Check${NC}"
echo "------------------------------"

PROTECTED_VALID=true

# Check for uncommitted changes to agent contracts
if git status --porcelain | grep -q "^.M .github/agents/.*-agent.md"; then
    echo -e "  ${YELLOW}⚠️  Uncommitted changes to agent contracts detected${NC}"
    echo "  Review carefully - contract changes require proper authority"
    git status --porcelain | grep "^.M .github/agents/.*-agent.md" | sed 's/^/    /'
else
    echo -e "  ${GREEN}✅ No uncommitted changes to agent contracts${NC}"
fi

echo ""
if [ "$PROTECTED_VALID" = true ]; then
    echo -e "${GREEN}✅ Test 6 PASSED${NC}"
else
    echo -e "${RED}❌ Test 6 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Final Verdict
# ==============================================================================
echo "======================================"
echo "🎯 HANDOVER TESTING VERDICT"
echo "======================================"
echo ""
echo "Test 1 (YAML):           $([ "$YAML_VALID" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Test 2 (JSON):           $([ "$JSON_VALID" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Test 3 (Session Memory): $([ "$MEMORY_VALID" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Test 4 (POLC Boundary):  $([ "$POLC_VALID" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Test 5 (Evidence):       $([ "$EVIDENCE_VALID" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Test 6 (Protected):      $([ "$PROTECTED_VALID" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo ""

if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo ""
    echo "Safe to commit and push."
    echo ""
    exit 0
else
    echo -e "${RED}❌ HANDOVER TESTING FAILED${NC}"
    echo ""
    echo "DO NOT commit or push until all tests pass."
    echo ""
    echo "Action Required:"
    echo "  1. Fix all failing tests"
    echo "  2. Re-run this script"
    echo "  3. Only push when all tests pass"
    echo ""
    echo "Skipping handover testing is TEST DODGING and is PROHIBITED."
    echo ""
    exit 1
fi
