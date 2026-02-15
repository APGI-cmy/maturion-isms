#!/usr/bin/env bash
#
# validate-tracker-update.sh
#
# Purpose: Validates that BUILD_PROGRESS_TRACKER.md is updated in wave completion PRs
# Gate: BL-029 - BUILD_PROGRESS_TRACKER Update Enforcement
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, BUILD_PHILOSOPHY.md (Audit Trail Discipline)
# Issue: [Governance] Enforce BUILD_PROGRESS_TRACKER updates in wave completion PRs
#
# Trigger: This gate applies when IBWR evidence is detected in the PR
# Required: BUILD_PROGRESS_TRACKER.md MUST be modified in wave completion PRs
#
# Usage:
#   ./validate-tracker-update.sh
#   Exit 0 = PASS (tracker updated or not required)
#   Exit 1 = FAIL (tracker update required but missing)
#

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "BL-029: BUILD_PROGRESS_TRACKER Update"
echo "======================================"
echo ""

# Step 1: Detect if this is a wave completion PR (IBWR evidence present)
echo "Step 1: Checking for IBWR evidence..."

IBWR_FILES=$(git diff --name-only main...HEAD 2>/dev/null | grep -E '\.agent-workspace/.*/evidence/.*IBWR\.md$' || true)

if [ -z "$IBWR_FILES" ]; then
  echo -e "${GREEN}✓ No IBWR evidence detected${NC}"
  echo "  This is not a wave completion PR"
  echo "  BUILD_PROGRESS_TRACKER update not required"
  echo ""
  echo -e "${GREEN}PASS: Gate not applicable${NC}"
  exit 0
fi

echo -e "${YELLOW}⚠ IBWR evidence detected:${NC}"
echo "$IBWR_FILES" | sed 's/^/  - /'
echo ""
echo "  This is a wave completion PR"
echo "  BUILD_PROGRESS_TRACKER update is REQUIRED"
echo ""

# Step 2: Check if BUILD_PROGRESS_TRACKER.md was modified
echo "Step 2: Checking for BUILD_PROGRESS_TRACKER.md modifications..."

TRACKER_MODIFICATIONS=$(git diff --name-only main...HEAD 2>/dev/null | grep -E 'BUILD_PROGRESS_TRACKER\.md$' || true)

if [ -z "$TRACKER_MODIFICATIONS" ]; then
  echo -e "${RED}✗ BUILD_PROGRESS_TRACKER.md NOT modified${NC}"
  echo ""
  echo "ERROR: Wave completion PR detected but BUILD_PROGRESS_TRACKER.md not updated"
  echo ""
  echo "IBWR Evidence Files Found:"
  echo "$IBWR_FILES" | sed 's/^/  - /'
  echo ""
  echo "Required Action:"
  echo "  1. Update BUILD_PROGRESS_TRACKER.md in the affected module(s)"
  echo "  2. Document wave/task completion with:"
  echo "     - Completion date"
  echo "     - Deliverables and components"
  echo "     - Tests turned GREEN"
  echo "     - Evidence artifact references"
  echo "     - Any process deviations or lessons learned"
  echo "  3. Update 'Last Updated' field at top of tracker"
  echo ""
  echo "Template: governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md"
  echo "Reference: governance/templates/IBWR_TEMPLATE.md (Section 4)"
  echo ""
  echo -e "${RED}FAIL: BUILD_PROGRESS_TRACKER update required${NC}"
  exit 1
fi

echo -e "${GREEN}✓ BUILD_PROGRESS_TRACKER.md modified${NC}"
echo "  Tracker files updated:"
echo "$TRACKER_MODIFICATIONS" | sed 's/^/  - /'
echo ""

# Step 3: Validate tracker modifications are substantial (not just whitespace)
echo "Step 3: Validating tracker modifications are substantial..."

for tracker in $TRACKER_MODIFICATIONS; do
  DIFF_SIZE=$(git diff main...HEAD -- "$tracker" 2>/dev/null | grep -E '^\+[^+]' | wc -l)
  
  if [ "$DIFF_SIZE" -lt 5 ]; then
    echo -e "${RED}✗ Insufficient changes in $tracker${NC}"
    echo "  Only $DIFF_SIZE lines added"
    echo "  Expected substantial documentation of wave completion"
    echo ""
    echo -e "${RED}FAIL: Tracker modifications too minimal${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ $tracker has $DIFF_SIZE lines added${NC}"
done

echo ""
echo "Step 4: Final validation..."
echo -e "${GREEN}✓ All validations passed${NC}"
echo ""
echo -e "${GREEN}PASS: BUILD_PROGRESS_TRACKER properly updated${NC}"
exit 0
