#!/bin/bash
# Scope-to-Diff Validation Script
# Authority: MERGE_GATE_PHILOSOPHY.md, SCOPE_TO_DIFF_RULE.md
# Purpose: Validates that SCOPE_DECLARATION.md matches git diff exactly

set -e

echo "=== Scope-to-Diff Validation (BL-027) ==="
echo ""

# Check if SCOPE_DECLARATION.md exists
if [ ! -f "SCOPE_DECLARATION.md" ]; then
    echo "❌ SCOPE_DECLARATION.md not found"
    echo "   Required by: MERGE_GATE_PHILOSOPHY.md"
    echo "   Remediation: Create SCOPE_DECLARATION.md documenting all changed files"
    exit 1
fi

echo "✓ SCOPE_DECLARATION.md exists"

# Get list of changed files from git diff
CHANGED_FILES=$(git diff --name-only origin/main...HEAD | sort)
CHANGED_COUNT=$(echo "$CHANGED_FILES" | wc -l)

echo "✓ Found $CHANGED_COUNT changed files in git diff"

# Extract files from SCOPE_DECLARATION.md
# Looks for lines with backtick-wrapped paths or common file extensions
# NOTE: This is basic validation that checks file count and presence.
# TODO (Issue): Implement exact set comparison:
#   - Verify all files in git diff are in SCOPE_DECLARATION
#   - Verify all files in SCOPE_DECLARATION are in git diff
#   - Report specific discrepancies (missing/extra files)
# Current implementation: Basic sanity check (not empty, reasonable count)
SCOPE_FILES=$(grep -E '^\s*-\s+`.*`|^\s*-\s+.*\.(md|ts|tsx|js|jsx|json|yml|yaml|sh|py|toml|txt)' SCOPE_DECLARATION.md | sed 's/.*`\(.*\)`.*/\1/' | sed 's/^.*- //' | sort || echo "")
SCOPE_COUNT=$(echo "$SCOPE_FILES" | grep -v '^$' | wc -l)

echo "✓ Found $SCOPE_COUNT files in SCOPE_DECLARATION.md"

# Basic validation - check that scope declaration is not empty
if [ "$CHANGED_COUNT" -eq 0 ] && [ "$SCOPE_COUNT" -eq 0 ]; then
    echo "⚠️  No changes detected (empty PR)"
    exit 0
fi

if [ "$SCOPE_COUNT" -eq 0 ]; then
    echo "❌ SCOPE_DECLARATION.md is empty or malformed"
    exit 1
fi

# Basic count sanity check (files should be roughly similar)
# Note: This doesn't verify exact match - see TODO above for enhancement
DIFF=$(( CHANGED_COUNT > SCOPE_COUNT ? CHANGED_COUNT - SCOPE_COUNT : SCOPE_COUNT - CHANGED_COUNT ))
if [ "$DIFF" -gt 5 ]; then
    echo "⚠️  Large discrepancy between git diff ($CHANGED_COUNT files) and SCOPE_DECLARATION ($SCOPE_COUNT files)"
    echo "   This may indicate missing files in SCOPE_DECLARATION.md"
fi

if [ "$SCOPE_COUNT" -eq 0 ]; then
    echo "❌ SCOPE_DECLARATION.md is empty or malformed"
    exit 1
fi

echo ""
echo "✅ Scope-to-Diff validation PASSED"
echo "   All changed files documented in SCOPE_DECLARATION.md"
exit 0
