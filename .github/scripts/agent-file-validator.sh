#!/bin/bash
# Agent File Validator for Living Agent System v6.2.0
# Authority: AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Validate agent contract files for compliance with schema and standards
#
# Usage: .github/scripts/agent-file-validator.sh [--verbose] [file1.md file2.md ...]
# Example: .github/scripts/agent-file-validator.sh .github/agents/*.md

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERBOSE=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Parse options
FILES_TO_VALIDATE=()
while [[ $# -gt 0 ]]; do
    case $1 in
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            FILES_TO_VALIDATE+=("$1")
            shift
            ;;
    esac
done

# If no files specified, find all agent files
if [ ${#FILES_TO_VALIDATE[@]} -eq 0 ]; then
    cd "$REPO_ROOT"
    while IFS= read -r file; do
        # Skip schema files and archive directories
        if [[ "$file" != *"SCHEMA"* ]] && [[ "$file" != *"_archive"* ]]; then
            FILES_TO_VALIDATE+=("$file")
        fi
    done < <(find .github/agents -name "*.md" -type f 2>/dev/null)
fi

echo "======================================"
echo "🔍 AGENT FILE VALIDATOR v6.2.0"
echo "======================================"
echo "Files to validate: ${#FILES_TO_VALIDATE[@]}"
echo ""

# Counters
TOTAL_FILES=0
VALID_FILES=0
INVALID_FILES=0
CRITICAL_ERRORS=0
WARNINGS=0

# ==============================================================================
# Validation Functions
# ==============================================================================

# Check YAML front matter
check_yaml_frontmatter() {
    local file="$1"
    local errors=0
    
    # Check if file starts with ---
    if ! head -1 "$file" | grep -q "^---"; then
        echo -e "${RED}  ❌ YAML front matter missing (must start with ---)${NC}"
        errors=$((errors + 1))
    fi
    
    # Extract YAML front matter
    local yaml_content
    yaml_content=$(awk '/^---$/{if(++count==2){exit}next}count==1' "$file")
    
    if [ -z "$yaml_content" ]; then
        echo -e "${RED}  ❌ YAML front matter is empty${NC}"
        errors=$((errors + 1))
        return $errors
    fi
    
    # Check required fields
    local required_fields=("id" "agent" "governance" "scope")
    
    for field in "${required_fields[@]}"; do
        if ! echo "$yaml_content" | grep -q "^${field}:"; then
            echo -e "${RED}  ❌ Required field missing: ${field}${NC}"
            errors=$((errors + 1))
        fi
    done
    
    # Check agent subfields
    if echo "$yaml_content" | grep -q "^agent:"; then
        local agent_fields=("id" "class" "version" "contract_version")
        for field in "${agent_fields[@]}"; do
            if ! echo "$yaml_content" | grep -A 10 "^agent:" | grep -q "  ${field}:"; then
                echo -e "${RED}  ❌ Agent field missing: agent.${field}${NC}"
                errors=$((errors + 1))
            fi
        done
    fi
    
    # Check governance subfields
    if echo "$yaml_content" | grep -q "^governance:"; then
        local gov_fields=("protocol" "canon_inventory")
        for field in "${gov_fields[@]}"; do
            if ! echo "$yaml_content" | grep -A 10 "^governance:" | grep -q "  ${field}:"; then
                echo -e "${YELLOW}  ⚠️  Governance field missing: governance.${field}${NC}"
                WARNINGS=$((WARNINGS + 1))
            fi
        done
        
        # Check for Living Agent System protocol
        if echo "$yaml_content" | grep -A 10 "^governance:" | grep -q "protocol: LIVING_AGENT_SYSTEM"; then
            if [ "$VERBOSE" = true ]; then
                echo -e "${GREEN}  ✓ Living Agent System protocol declared${NC}"
            fi
        fi
    fi
    
    # Check scope subfields
    if echo "$yaml_content" | grep -q "^scope:"; then
        if ! echo "$yaml_content" | grep -A 10 "^scope:" | grep -q "repository:"; then
            echo -e "${RED}  ❌ Scope field missing: scope.repository${NC}"
            errors=$((errors + 1))
        fi
    fi
    
    return $errors
}

# Check for LOCKED sections (if applicable)
check_locked_sections() {
    local file="$1"
    local errors=0
    
    # Count LOCKED section markers
    local locked_start_count
    local locked_end_count
    
    locked_start_count=$(grep -c "<!-- LOCKED:" "$file" || echo "0")
    locked_end_count=$(grep -c "<!-- END LOCKED -->" "$file" || echo "0")
    
    if [ "$locked_start_count" -ne "$locked_end_count" ]; then
        echo -e "${RED}  ❌ Unmatched LOCKED section markers (start: ${locked_start_count}, end: ${locked_end_count})${NC}"
        errors=$((errors + 1))
    elif [ "$locked_start_count" -gt 0 ]; then
        if [ "$VERBOSE" = true ]; then
            echo -e "${GREEN}  ✓ ${locked_start_count} LOCKED sections properly marked${NC}"
        fi
    fi
    
    return $errors
}

# Check for required canonical references
check_canonical_references() {
    local file="$1"
    local warnings=0
    
    # Check for canonical bindings section
    if ! grep -q "^bindings:" "$file" && ! grep -q "canonical_source:" "$file"; then
        echo -e "${YELLOW}  ⚠️  No canonical source bindings found${NC}"
        warnings=$((warnings + 1))
    fi
    
    return $warnings
}

# Check merge gate interface requirements
check_merge_gate_interface() {
    local file="$1"
    local warnings=0
    
    # Check for merge_gate_interface section
    if ! grep -q "merge_gate_interface:" "$file"; then
        echo -e "${YELLOW}  ⚠️  No merge_gate_interface configuration found${NC}"
        warnings=$((warnings + 1))
        return $warnings
    fi
    
    # Check for required_checks
    if ! grep -A 5 "merge_gate_interface:" "$file" | grep -q "required_checks:"; then
        echo -e "${YELLOW}  ⚠️  No required_checks in merge_gate_interface${NC}"
        warnings=$((warnings + 1))
    fi
    
    return $warnings
}

# Check file structure and markdown validity
check_file_structure() {
    local file="$1"
    local errors=0
    
    # Check file is readable
    if [ ! -r "$file" ]; then
        echo -e "${RED}  ❌ File not readable${NC}"
        errors=$((errors + 1))
        return $errors
    fi
    
    # Check file is not empty
    if [ ! -s "$file" ]; then
        echo -e "${RED}  ❌ File is empty${NC}"
        errors=$((errors + 1))
        return $errors
    fi
    
    # Check for basic markdown structure
    if ! grep -q "^#" "$file"; then
        echo -e "${YELLOW}  ⚠️  No markdown headers found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    return $errors
}

# ==============================================================================
# Main Validation Loop
# ==============================================================================

for file in "${FILES_TO_VALIDATE[@]}"; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    echo -e "${BLUE}Validating: ${file}${NC}"
    echo "----------------------------------------"
    
    FILE_ERRORS=0
    FILE_WARNINGS=0
    
    # Run all validation checks
    struct_errors=0
    yaml_errors=0
    locked_errors=0
    ref_warnings=0
    gate_warnings=0
    
    check_file_structure "$file" && struct_errors=0 || struct_errors=$?
    FILE_ERRORS=$((FILE_ERRORS + struct_errors))
    
    check_yaml_frontmatter "$file" && yaml_errors=0 || yaml_errors=$?
    FILE_ERRORS=$((FILE_ERRORS + yaml_errors))
    
    check_locked_sections "$file" && locked_errors=0 || locked_errors=$?
    FILE_ERRORS=$((FILE_ERRORS + locked_errors))
    
    check_canonical_references "$file" && ref_warnings=0 || ref_warnings=$?
    FILE_WARNINGS=$((FILE_WARNINGS + ref_warnings))
    
    check_merge_gate_interface "$file" && gate_warnings=0 || gate_warnings=$?
    FILE_WARNINGS=$((FILE_WARNINGS + gate_warnings))
    
    # Report file status
    if [ "$FILE_ERRORS" -eq 0 ]; then
        if [ "$FILE_WARNINGS" -eq 0 ]; then
            echo -e "${GREEN}✅ VALID - No errors or warnings${NC}"
            VALID_FILES=$((VALID_FILES + 1))
        else
            echo -e "${YELLOW}⚠️  VALID WITH WARNINGS - ${FILE_WARNINGS} warning(s)${NC}"
            VALID_FILES=$((VALID_FILES + 1))
        fi
    else
        echo -e "${RED}❌ INVALID - ${FILE_ERRORS} critical error(s)${NC}"
        INVALID_FILES=$((INVALID_FILES + 1))
        CRITICAL_ERRORS=$((CRITICAL_ERRORS + FILE_ERRORS))
    fi
    
    echo ""
done

# ==============================================================================
# Summary Report
# ==============================================================================

echo "======================================"
echo "📊 VALIDATION SUMMARY"
echo "======================================"
echo ""
echo "Files validated: ${TOTAL_FILES}"
echo -e "${GREEN}✅ Valid: ${VALID_FILES}${NC}"
echo -e "${RED}❌ Invalid: ${INVALID_FILES}${NC}"
echo ""
echo -e "${RED}Critical errors: ${CRITICAL_ERRORS}${NC}"
echo -e "${YELLOW}Warnings: ${WARNINGS}${NC}"
echo ""

if [ "$CRITICAL_ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✅ VALIDATION PASSED - All agent files are valid${NC}"
    echo ""
    echo "Living Agent System v6.2.0 compliance: ✅ VERIFIED"
    exit 0
else
    echo -e "${RED}❌ VALIDATION FAILED - ${CRITICAL_ERRORS} critical error(s) detected${NC}"
    echo ""
    echo "Required Actions:"
    echo "  1. Review errors above for each invalid file"
    echo "  2. Fix YAML front matter structure and required fields"
    echo "  3. Ensure LOCKED sections are properly marked"
    echo "  4. Re-run validation after fixes"
    echo ""
    echo "Authority: AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md, LIVING_AGENT_SYSTEM.md v6.2.0"
    exit 1
fi
