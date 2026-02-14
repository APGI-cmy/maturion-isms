#!/bin/bash
# Agent File Validator - Living Agent System v6.2.0
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Validate agent contract files for schema compliance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
AGENT_FILE="${1}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

if [ -z "$AGENT_FILE" ]; then
    echo "Usage: $0 <agent-file.md>"
    echo ""
    echo "Example:"
    echo "  $0 .github/agents/governance-liaison-isms-agent.md"
    echo "  $0 .github/agents/*.md  # Validate all agent files"
    exit 1
fi

# Validation counters
ERRORS=0
WARNINGS=0

echo ""
echo -e "${BLUE}🔍 AGENT FILE VALIDATOR${NC}"
echo ""

# =============================================================================
# Function: Validate Agent File
# =============================================================================
validate_agent_file() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo -e "${BLUE}Validating: $filename${NC}"
    
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo -e "  ${RED}❌ File not found${NC}"
        ERRORS=$((ERRORS + 1))
        return
    fi
    
    # Check if file is readable
    if [ ! -r "$file" ]; then
        echo -e "  ${RED}❌ File not readable${NC}"
        ERRORS=$((ERRORS + 1))
        return
    fi
    
    # Check YAML front matter
    if ! grep -q "^---$" "$file"; then
        echo -e "  ${YELLOW}⚠️  No YAML front matter found${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "  ✓ YAML front matter present"
        
        # Extract and validate YAML section
        YAML_SECTION=$(awk '/^---$/{flag=!flag;next}flag' "$file" | head -n 100)
        
        # Check for required fields in YAML
        if echo "$YAML_SECTION" | grep -q "^id:"; then
            AGENT_ID=$(echo "$YAML_SECTION" | grep "^id:" | head -1 | awk '{print $2}')
            echo "  ✓ Agent ID: $AGENT_ID"
        else
            echo -e "  ${RED}❌ Missing required field: id${NC}"
            ERRORS=$((ERRORS + 1))
        fi
        
        if echo "$YAML_SECTION" | grep -q "^  class:"; then
            AGENT_CLASS=$(echo "$YAML_SECTION" | grep "^  class:" | awk '{print $2}')
            echo "  ✓ Agent class: $AGENT_CLASS"
            
            # Validate agent class value
            case "$AGENT_CLASS" in
                liaison|builder|foreman|overseer|advisor)
                    ;;
                *)
                    echo -e "  ${YELLOW}⚠️  Unknown agent class: $AGENT_CLASS${NC}"
                    WARNINGS=$((WARNINGS + 1))
                    ;;
            esac
        else
            echo -e "  ${RED}❌ Missing required field: agent.class${NC}"
            ERRORS=$((ERRORS + 1))
        fi
        
        if echo "$YAML_SECTION" | grep -q "^  version:"; then
            AGENT_VERSION=$(echo "$YAML_SECTION" | grep "^  version:" | awk '{print $2}')
            echo "  ✓ Agent version: $AGENT_VERSION"
            
            # Check if version matches expected
            if [ "$AGENT_VERSION" != "6.2.0" ]; then
                echo -e "  ${YELLOW}⚠️  Version mismatch: Expected 6.2.0, found $AGENT_VERSION${NC}"
                WARNINGS=$((WARNINGS + 1))
            fi
        else
            echo -e "  ${RED}❌ Missing required field: agent.version${NC}"
            ERRORS=$((ERRORS + 1))
        fi
        
        if echo "$YAML_SECTION" | grep -q "^  contract_version:"; then
            CONTRACT_VERSION=$(echo "$YAML_SECTION" | grep "^  contract_version:" | awk '{print $2}')
            echo "  ✓ Contract version: $CONTRACT_VERSION"
        else
            echo -e "  ${YELLOW}⚠️  Missing recommended field: agent.contract_version${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
    
    # Check for governance section
    if grep -q "^governance:" "$file"; then
        echo "  ✓ Governance section present"
        
        # Check for canon_inventory reference
        if grep -q "canon_inventory:" "$file"; then
            CANON_PATH=$(grep "canon_inventory:" "$file" | awk '{print $2}')
            echo "  ✓ Canon inventory: $CANON_PATH"
            
            # Verify the referenced file exists
            if [ -f "$REPO_ROOT/$CANON_PATH" ]; then
                echo "    ✓ File exists: $CANON_PATH"
            else
                echo -e "    ${YELLOW}⚠️  Referenced file not found: $CANON_PATH${NC}"
                WARNINGS=$((WARNINGS + 1))
            fi
        else
            echo -e "  ${YELLOW}⚠️  Missing recommended field: governance.canon_inventory${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "  ${YELLOW}⚠️  Missing governance section${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check for bindings section
    if grep -q "^bindings:" "$file"; then
        echo "  ✓ Bindings section present"
        
        # Check for canonical_source
        if grep -q "canonical_source:" "$file"; then
            CANONICAL_SOURCE=$(grep "canonical_source:" "$file" | awk '{print $2}')
            echo "  ✓ Canonical source: $CANONICAL_SOURCE"
        else
            echo -e "  ${YELLOW}⚠️  Missing recommended field: bindings.canonical_source${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "  ${YELLOW}⚠️  Missing bindings section${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check for scope section
    if grep -q "^scope:" "$file"; then
        echo "  ✓ Scope section present"
        
        # Check for repository
        if grep -q "repository:" "$file"; then
            REPOSITORY=$(grep "repository:" "$file" | head -1 | awk '{print $2}')
            echo "  ✓ Repository: $REPOSITORY"
        fi
    else
        echo -e "  ${YELLOW}⚠️  Missing scope section${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check for merge_gate_interface section
    if grep -q "^merge_gate_interface:" "$file"; then
        echo "  ✓ Merge gate interface section present"
    else
        echo -e "  ${YELLOW}⚠️  Missing merge_gate_interface section${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check markdown structure
    if grep -q "^# " "$file"; then
        echo "  ✓ Has main heading"
    else
        echo -e "  ${YELLOW}⚠️  No main heading found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check for LOCKED sections (if this is an agent contract)
    LOCKED_COUNT=$(grep -c "^<!-- LOCKED:" "$file" || echo "0")
    if [ "$LOCKED_COUNT" -gt 0 ]; then
        echo "  ✓ Contains $LOCKED_COUNT LOCKED section(s)"
    fi
    
    # File size check
    FILE_SIZE=$(wc -c < "$file")
    if [ "$FILE_SIZE" -lt 1000 ]; then
        echo -e "  ${YELLOW}⚠️  File size suspiciously small: $FILE_SIZE bytes${NC}"
        WARNINGS=$((WARNINGS + 1))
    elif [ "$FILE_SIZE" -gt 100000 ]; then
        echo -e "  ${YELLOW}⚠️  File size large: $FILE_SIZE bytes${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "  ✓ File size: $FILE_SIZE bytes"
    fi
    
    echo ""
}

# =============================================================================
# Main Validation
# =============================================================================

# If wildcard, expand and validate all
if [[ "$AGENT_FILE" == *"*"* ]]; then
    FILES=$(ls $AGENT_FILE 2>/dev/null || echo "")
    if [ -z "$FILES" ]; then
        echo -e "${RED}No files matching pattern: $AGENT_FILE${NC}"
        exit 1
    fi
    
    for file in $FILES; do
        validate_agent_file "$file"
    done
else
    validate_agent_file "$AGENT_FILE"
fi

# =============================================================================
# Summary
# =============================================================================

echo "╔═══════════════════════════════════════════════╗"
if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo -e "║  ${GREEN}✅ VALIDATION PASSED${NC}                      ║"
elif [ "$ERRORS" -eq 0 ]; then
    echo -e "║  ${YELLOW}⚠️  VALIDATION PASSED WITH WARNINGS${NC}       ║"
else
    echo -e "║  ${RED}❌ VALIDATION FAILED${NC}                       ║"
fi
echo "╚═══════════════════════════════════════════════╝"
echo ""

if [ "$ERRORS" -gt 0 ] || [ "$WARNINGS" -gt 0 ]; then
    echo "Summary:"
    [ "$ERRORS" -gt 0 ] && echo -e "  ${RED}❌ Errors: $ERRORS${NC}"
    [ "$WARNINGS" -gt 0 ] && echo -e "  ${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
    echo ""
fi

# Exit with appropriate code
if [ "$ERRORS" -gt 0 ]; then
    exit 1
else
    exit 0
fi
