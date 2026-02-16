#!/bin/bash
# Pre-Handover Validation Script for Foreman-ISMS
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md
# Purpose: Validate ALL changes locally BEFORE pushing to ensure merge gates will pass
#
# Usage: .agent-workspace/foreman-isms/prehandover-validation.sh
#
# This script MUST be run before every commit/push. Skipping this is TEST DODGING and is PROHIBITED.
#
# Per Issue #193 and the POLC Gate Failure RCA:
# "Pre-handover checks duplicate all merge gate logic but were not, in practice, run or honored before submission."
# This script enforces "stop and fix" discipline.

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "======================================"
echo "🧪 PRE-HANDOVER VALIDATION - Foreman-ISMS"
echo "======================================"
echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0"
echo "Date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""
echo "⚠️  This validation MUST pass before pushing."
echo "⚠️  Failing to run this script is TEST DODGING."
echo "⚠️  Red gates = STOP AND FIX ONLY."
echo ""

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

ALL_PASSED=true

# ==============================================================================
# Check 1: POLC Boundary Validation - Session Memory
# (Duplicates .github/workflows/polc-boundary-gate.yml Check 3)
# ==============================================================================
echo -e "${BLUE}Check 1: POLC Boundary Validation - Session Memory${NC}"
echo "------------------------------"
echo "Duplicating merge gate check: .github/workflows/polc-boundary-gate.yml Check 3"
echo ""

POLC_VIOLATION_IN_MEMORY=false
VIOLATION_FILES=""

if ls .agent-workspace/foreman*/memory/session-*.md 1> /dev/null 2>&1; then
    echo "Session memory files found. Validating POLC compliance..."
    echo ""
    
    for session_file in .agent-workspace/foreman*/memory/session-*.md; do
        if [ -f "$session_file" ]; then
            echo "  Checking: $(basename "$session_file")"
            
            # Use the EXACT SAME logic as .github/workflows/polc-boundary-gate.yml
            # Check for indicators that FM wrote code (positive assertions only)
            # Skip lines with negations (NOT, did not, didn't, no)
            if grep -iE "(implemented|wrote|created|modified).*production.*code|FM.*implemented|Foreman.*wrote.*code" "$session_file" | \
               grep -qviE "did NOT|NOT.*implement|NOT.*write|did not|didn't|no production"; then
                echo -e "    ${RED}❌ POLC VIOLATION DETECTED${NC}"
                echo "    Session memory contains evidence that FM wrote production code"
                echo "    Violating lines:"
                grep -iE "(implemented|wrote|created|modified).*production.*code|FM.*implemented|Foreman.*wrote.*code" "$session_file" | \
                grep -viE "did NOT|NOT.*implement|NOT.*write|did not|didn't|no production" | \
                sed 's/^/      > /'
                echo ""
                POLC_VIOLATION_IN_MEMORY=true
                VIOLATION_FILES="${VIOLATION_FILES}\n    - ${session_file}"
                ALL_PASSED=false
            else
                echo -e "    ${GREEN}✅ PASS${NC}"
            fi
        fi
    done
    
    echo ""
    
    if [ "$POLC_VIOLATION_IN_MEMORY" = true ]; then
        echo -e "${RED}❌ CHECK 1 FAILED - SESSION MEMORY INDICATES POLC VIOLATION${NC}"
        echo ""
        echo "Files with violations:${VIOLATION_FILES}"
        echo ""
        echo "⛔ STOP AND FIX:"
        echo "  1. Review flagged session memory files"
        echo "  2. Remove positive assertions about FM writing code"
        echo "  3. Use explicit negations that the gate recognizes:"
        echo "     ✅ GOOD: 'FM did NOT write production code'"
        echo "     ✅ GOOD: 'FM did NOT implement features'"
        echo "     ❌ BAD:  'FM wrote ZERO production code' (ZERO not recognized as negation)"
        echo "     ❌ BAD:  'FM implemented no code' ('implemented' triggers before 'no')"
        echo "  4. Emphasize supervision: 'FM supervised builders'"
        echo "  5. Re-run this validation script"
        echo ""
        echo "Per FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md:"
        echo "  Foreman may NEVER write production code. Supervisory only."
        echo ""
    else
        echo -e "${GREEN}✅ CHECK 1 PASSED${NC}"
        echo "All session memory files comply with POLC boundaries."
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  No Foreman session memory files found${NC}"
    echo ""
    echo "Expected: .agent-workspace/foreman*/memory/session-*.md"
    echo ""
    echo "Session memory is REQUIRED per Living Agent System v6.2.0"
    echo "If this is a Foreman session, create session memory before pushing."
    echo ""
    ALL_PASSED=false
fi

# ==============================================================================
# Check 2: Foreman Implementation Commits Detection
# (Duplicates .github/workflows/polc-boundary-gate.yml Check 1)
# ==============================================================================
echo -e "${BLUE}Check 2: Foreman Implementation Commits Detection${NC}"
echo "------------------------------"
echo "Duplicating merge gate check: .github/workflows/polc-boundary-gate.yml Check 1"
echo ""

# Check for uncommitted changes first
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    echo ""
    echo "Checking staged/unstaged changes for production code modifications..."
    echo ""
    
    VIOLATION_FOUND=false
    
    # Check staged files
    STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || true)
    if [ -n "$STAGED_FILES" ]; then
        echo "Staged files:"
        while IFS= read -r file; do
            echo "  - $file"
            
            # Production code patterns (PROHIBITED for FM)
            if [[ "$file" =~ ^modules/.*/src/.*\.(ts|tsx|js|jsx)$ ]] || \
               [[ "$file" =~ ^modules/.*/tests/.*\.test\.(ts|tsx|js|jsx)$ ]] || \
               [[ "$file" =~ ^apps/.*/src/.*\.(ts|tsx|js|jsx)$ ]] || \
               [[ "$file" =~ ^packages/.*/src/.*\.(ts|tsx|js|jsx)$ ]]; then
                
                # Skip allowed files
                if [[ "$file" =~ ^modules/.*/02-architecture/ ]] || \
                   [[ "$file" =~ ^\.agent-workspace/ ]] || \
                   [[ "$file" =~ ^\.agent-admin/ ]] || \
                   [[ "$file" =~ ^governance/ ]] || \
                   [[ "$file" =~ BUILD_PROGRESS_TRACKER\.md$ ]]; then
                    continue
                fi
                
                echo -e "    ${RED}❌ PROHIBITED: Foreman cannot modify production code: $file${NC}"
                VIOLATION_FOUND=true
                ALL_PASSED=false
            fi
        done <<< "$STAGED_FILES"
    fi
    
    # Check unstaged files
    UNSTAGED_FILES=$(git diff --name-only 2>/dev/null || true)
    if [ -n "$UNSTAGED_FILES" ]; then
        echo ""
        echo "Unstaged files:"
        while IFS= read -r file; do
            echo "  - $file"
            
            # Same production code patterns check
            if [[ "$file" =~ ^modules/.*/src/.*\.(ts|tsx|js|jsx)$ ]] || \
               [[ "$file" =~ ^modules/.*/tests/.*\.test\.(ts|tsx|js|jsx)$ ]] || \
               [[ "$file" =~ ^apps/.*/src/.*\.(ts|tsx|js|jsx)$ ]] || \
               [[ "$file" =~ ^packages/.*/src/.*\.(ts|tsx|js|jsx)$ ]]; then
                
                if [[ "$file" =~ ^modules/.*/02-architecture/ ]] || \
                   [[ "$file" =~ ^\.agent-workspace/ ]] || \
                   [[ "$file" =~ ^\.agent-admin/ ]] || \
                   [[ "$file" =~ ^governance/ ]] || \
                   [[ "$file" =~ BUILD_PROGRESS_TRACKER\.md$ ]]; then
                    continue
                fi
                
                echo -e "    ${RED}❌ PROHIBITED: Foreman cannot modify production code: $file${NC}"
                VIOLATION_FOUND=true
                ALL_PASSED=false
            fi
        done <<< "$UNSTAGED_FILES"
    fi
    
    echo ""
    
    if [ "$VIOLATION_FOUND" = true ]; then
        echo -e "${RED}❌ CHECK 2 FAILED - FOREMAN MODIFYING PRODUCTION CODE${NC}"
        echo ""
        echo "⛔ STOP AND FIX:"
        echo "  1. Revert production code changes"
        echo "  2. Create builder delegation issues"
        echo "  3. Assign builders to implement"
        echo "  4. Foreman supervises (does NOT implement)"
        echo ""
        echo "Per FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md:"
        echo "  'Foreman plans, organizes, leads, and controls.'"
        echo "  'Foreman does NOT implement production code.'"
        echo ""
    else
        echo -e "${GREEN}✅ CHECK 2 PASSED${NC}"
        echo "No production code changes by Foreman detected."
        echo ""
    fi
fi

# ==============================================================================
# Check 3: Evidence Artifact Bundle Presence
# (Duplicates .github/workflows/polc-boundary-gate.yml Check 4)
# ==============================================================================
echo -e "${BLUE}Check 3: Evidence Artifact Bundle${NC}"
echo "------------------------------"
echo "Duplicating merge gate check: .github/workflows/polc-boundary-gate.yml Check 4"
echo ""

if [ -d ".agent-admin" ]; then
    echo -e "${GREEN}✅ .agent-admin/ directory exists${NC}"
    
    # Check required subdirectories (not strict - may be created during workflow)
    if [ -d ".agent-admin/prehandover" ]; then
        echo -e "  ${GREEN}✅ .agent-admin/prehandover/ exists${NC}"
    else
        echo -e "  ${YELLOW}ℹ️  .agent-admin/prehandover/ not found (may be created during CI)${NC}"
    fi
    
    if [ -d ".agent-admin/gates" ]; then
        echo -e "  ${GREEN}✅ .agent-admin/gates/ exists${NC}"
    else
        echo -e "  ${YELLOW}ℹ️  .agent-admin/gates/ not found (may be created during CI)${NC}"
    fi
    
    if [ -d ".agent-admin/improvements" ]; then
        echo -e "  ${GREEN}✅ .agent-admin/improvements/ exists${NC}"
    else
        echo -e "  ${YELLOW}ℹ️  .agent-admin/improvements/ not found (may be created during CI)${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ CHECK 3 PASSED${NC}"
    echo ""
else
    echo -e "${RED}❌ .agent-admin/ directory missing${NC}"
    echo ""
    echo -e "${RED}❌ CHECK 3 FAILED${NC}"
    echo ""
    echo "Expected structure:"
    echo "  .agent-admin/prehandover/"
    echo "  .agent-admin/gates/"
    echo "  .agent-admin/improvements/"
    echo ""
    echo "Per EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md"
    echo ""
    ALL_PASSED=false
fi

# ==============================================================================
# Check 4: Governance Alignment
# ==============================================================================
echo -e "${BLUE}Check 4: Governance Alignment${NC}"
echo "------------------------------"

GOVERNANCE_VALID=true

# Check CANON_INVENTORY.json exists and is valid JSON
if [ -f "governance/CANON_INVENTORY.json" ]; then
    echo "  Checking: governance/CANON_INVENTORY.json"
    if jq empty governance/CANON_INVENTORY.json 2>/dev/null; then
        echo -e "    ${GREEN}✅ Valid JSON${NC}"
    else
        echo -e "    ${RED}❌ Invalid JSON${NC}"
        GOVERNANCE_VALID=false
        ALL_PASSED=false
    fi
else
    echo -e "  ${RED}❌ governance/CANON_INVENTORY.json missing${NC}"
    GOVERNANCE_VALID=false
    ALL_PASSED=false
fi

echo ""
if [ "$GOVERNANCE_VALID" = true ]; then
    echo -e "${GREEN}✅ CHECK 4 PASSED${NC}"
else
    echo -e "${RED}❌ CHECK 4 FAILED${NC}"
fi
echo ""

# ==============================================================================
# Final Verdict
# ==============================================================================
echo "======================================"
echo "🎯 PRE-HANDOVER VALIDATION VERDICT"
echo "======================================"
echo ""

if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo ""
    echo "Safe to commit and push."
    echo ""
    echo "Merge gates should pass (barring external issues)."
    echo ""
    exit 0
else
    echo -e "${RED}❌ PRE-HANDOVER VALIDATION FAILED${NC}"
    echo ""
    echo "⛔ STOP AND FIX - DO NOT PUSH"
    echo ""
    echo "Per Issue #193 POLC Gate Failure RCA:"
    echo "  'Pre-handover checks were not run or honored before submission.'"
    echo "  'This constitutes a critical governance/process failure.'"
    echo ""
    echo "Action Required:"
    echo "  1. Fix ALL failing checks above"
    echo "  2. Re-run this validation script"
    echo "  3. Only push when ALL checks pass"
    echo ""
    echo "Override Authority: CS2 ONLY for POLC violations"
    echo ""
    echo "Skipping pre-handover validation is:"
    echo "  - TEST DODGING (prohibited)"
    echo "  - GOVERNANCE VIOLATION (prohibited)"
    echo "  - STOP-AND-FIX BYPASS (prohibited)"
    echo ""
    exit 1
fi
