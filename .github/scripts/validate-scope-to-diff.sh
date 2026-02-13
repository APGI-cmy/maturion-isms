#!/bin/bash
# Scope-to-Diff Validation Script
# Authority: MERGE_GATE_PHILOSOPHY.md (BL-027), SCOPE_TO_DIFF_RULE.md
# Purpose: Validates that SCOPE_DECLARATION.md matches git diff exactly via set comparison
#
# This script performs EXACT SET COMPARISON between:
#   1. Files changed in git diff (git diff --name-only origin/main...HEAD)
#   2. Files declared in SCOPE_DECLARATION.md
#
# Validation succeeds ONLY if both sets match exactly (no missing files, no extra files).
#
# Usage Examples:
#   # Standard usage (from repository root):
#   .github/scripts/validate-scope-to-diff.sh
#
#   # Check what files should be declared:
#   git diff --name-only origin/main...HEAD | sort
#
#   # Extract what files are currently declared:
#   grep -E '^\s*-\s+`[^`]+`' SCOPE_DECLARATION.md | sed 's/.*`\([^`]*\)`.*/\1/' | sort
#
# Exit Codes:
#   0 = Validation passed (exact match)
#   1 = Validation failed (SCOPE_DECLARATION.md missing, malformed, or mismatch detected)

set -e

echo "=== Scope-to-Diff Validation (BL-027) ==="
echo "Authority: MERGE_GATE_PHILOSOPHY.md, SCOPE_TO_DIFF_RULE.md"
echo "Mode: Exact Set Comparison"
echo ""

# Check if SCOPE_DECLARATION.md exists
if [ ! -f "SCOPE_DECLARATION.md" ]; then
    echo "❌ SCOPE_DECLARATION.md not found"
    echo ""
    echo "Required by: MERGE_GATE_PHILOSOPHY.md (BL-027)"
    echo ""
    echo "Remediation:"
    echo "  1. Create SCOPE_DECLARATION.md using governance/templates/SCOPE_DECLARATION_TEMPLATE.md"
    echo "  2. List ALL changed files from: git diff --name-only origin/main...HEAD"
    echo "  3. Run this script again to validate"
    echo ""
    exit 1
fi

echo "✓ SCOPE_DECLARATION.md exists"

# Get list of changed files from git diff
CHANGED_FILES=$(git diff --name-only origin/main...HEAD 2>/dev/null | sort)
if [ -z "$CHANGED_FILES" ]; then
    CHANGED_COUNT=0
else
    CHANGED_COUNT=$(echo "$CHANGED_FILES" | wc -l)
fi

echo "✓ Found $CHANGED_COUNT changed files in git diff"

# Extract files from SCOPE_DECLARATION.md
# Improved parser: Looks for lines with backtick-wrapped paths (canonical format)
# Format: - `path/to/file.ext` - Description
# Also supports legacy format: - path/to/file.ext (without backticks)
SCOPE_FILES=$(grep -E '^\s*-\s+`[^`]+`' SCOPE_DECLARATION.md 2>/dev/null | sed 's/.*`\([^`]*\)`.*/\1/' | sort || true)

# Fallback: Try extracting files without backticks (legacy format)
if [ -z "$SCOPE_FILES" ]; then
    SCOPE_FILES=$(grep -E '^\s*-\s+[^\s`].*\.(md|ts|tsx|js|jsx|json|yml|yaml|sh|py|toml|txt|html|css|lock|gitignore|env)' SCOPE_DECLARATION.md 2>/dev/null | sed 's/^\s*-\s*\([^\s]*\).*/\1/' | sort || true)
fi

if [ -z "$SCOPE_FILES" ]; then
    SCOPE_COUNT=0
else
    SCOPE_COUNT=$(echo "$SCOPE_FILES" | wc -l)
fi

echo "✓ Found $SCOPE_COUNT files declared in SCOPE_DECLARATION.md"

# Handle empty PR case
if [ "$CHANGED_COUNT" -eq 0 ] && [ "$SCOPE_COUNT" -eq 0 ]; then
    echo ""
    echo "⚠️  No changes detected (empty PR)"
    echo "   Both git diff and SCOPE_DECLARATION.md are empty"
    exit 0
fi

# Validate SCOPE_DECLARATION.md is not empty when changes exist
if [ "$CHANGED_COUNT" -gt 0 ] && [ "$SCOPE_COUNT" -eq 0 ]; then
    echo ""
    echo "❌ SCOPE_DECLARATION.md is empty or malformed"
    echo ""
    echo "Git diff shows $CHANGED_COUNT changed files, but SCOPE_DECLARATION.md declares 0 files."
    echo ""
    echo "Remediation:"
    echo "  1. Ensure SCOPE_DECLARATION.md contains file declarations in format:"
    echo "     - \`path/to/file.ext\` - Description"
    echo "  2. List all files from: git diff --name-only origin/main...HEAD"
    echo ""
    exit 1
fi

# Validate git diff is not empty when scope declaration exists
if [ "$CHANGED_COUNT" -eq 0 ] && [ "$SCOPE_COUNT" -gt 0 ]; then
    echo ""
    echo "❌ Git diff is empty but SCOPE_DECLARATION.md declares $SCOPE_COUNT files"
    echo ""
    echo "This indicates SCOPE_DECLARATION.md contains files not present in git diff."
    echo ""
    echo "Remediation:"
    echo "  1. Verify you're on the correct branch"
    echo "  2. Check git diff --name-only origin/main...HEAD output"
    echo "  3. Update SCOPE_DECLARATION.md to match actual changes"
    echo ""
    exit 1
fi

echo ""
echo "--- Performing Exact Set Comparison ---"
echo ""

# Perform exact set comparison
# Find files in git diff but NOT in scope declaration (MISSING)
MISSING_FILES=$(comm -23 <(echo "$CHANGED_FILES") <(echo "$SCOPE_FILES") | grep -v '^$' || true)
MISSING_COUNT=0
if [ -n "$MISSING_FILES" ]; then
    MISSING_COUNT=$(echo "$MISSING_FILES" | wc -l)
fi

# Find files in scope declaration but NOT in git diff (EXTRA)
EXTRA_FILES=$(comm -13 <(echo "$CHANGED_FILES") <(echo "$SCOPE_FILES") | grep -v '^$' || true)
EXTRA_COUNT=0
if [ -n "$EXTRA_FILES" ]; then
    EXTRA_COUNT=$(echo "$EXTRA_FILES" | wc -l)
fi

# Report results
HAS_ERRORS=false

if [ "$MISSING_COUNT" -gt 0 ]; then
    HAS_ERRORS=true
    echo "❌ MISSING FILES: $MISSING_COUNT file(s) in git diff but NOT declared in SCOPE_DECLARATION.md"
    echo ""
    echo "The following files are changed in git but missing from SCOPE_DECLARATION.md:"
    echo "$MISSING_FILES" | while IFS= read -r file; do
        [ -n "$file" ] && echo "   - $file"
    done
    echo ""
    echo "Remediation:"
    echo "  Add these files to SCOPE_DECLARATION.md in the appropriate section (Added/Modified/Deleted)"
    echo ""
fi

if [ "$EXTRA_COUNT" -gt 0 ]; then
    HAS_ERRORS=true
    echo "❌ EXTRA FILES: $EXTRA_COUNT file(s) declared in SCOPE_DECLARATION.md but NOT in git diff"
    echo ""
    echo "The following files are declared but not present in git diff:"
    echo "$EXTRA_FILES" | while IFS= read -r file; do
        [ -n "$file" ] && echo "   - $file"
    done
    echo ""
    echo "Remediation:"
    echo "  Remove these files from SCOPE_DECLARATION.md or verify they are committed to the branch"
    echo ""
fi

if [ "$HAS_ERRORS" = true ]; then
    echo "❌ Scope-to-Diff validation FAILED"
    echo ""
    echo "Summary:"
    echo "  Changed files (git diff):     $CHANGED_COUNT"
    echo "  Declared files (SCOPE_DECLARATION): $SCOPE_COUNT"
    echo "  Missing from declaration:     $MISSING_COUNT"
    echo "  Extra in declaration:         $EXTRA_COUNT"
    echo ""
    echo "Authority: MERGE_GATE_PHILOSOPHY.md (BL-027)"
    echo "Required: Exact match between git diff and SCOPE_DECLARATION.md"
    echo ""
    exit 1
fi

# Success case
echo "✅ Exact set comparison PASSED"
echo ""
echo "Summary:"
echo "  Changed files (git diff):     $CHANGED_COUNT"
echo "  Declared files (SCOPE_DECLARATION): $SCOPE_COUNT"
echo "  Missing files:                0"
echo "  Extra files:                  0"
echo ""
echo "✅ All changed files are declared in SCOPE_DECLARATION.md"
echo "✅ No extra files declared"
echo "✅ Exact match confirmed"
echo ""
exit 0
