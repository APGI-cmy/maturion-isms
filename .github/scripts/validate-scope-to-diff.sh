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

# Locate the active scope declaration file.
# Priority: per-PR file (.agent-admin/scope-declarations/pr-<PR_NUMBER>.md)
#           > root SCOPE_DECLARATION.md (if not archival)
SCOPE_FILE=""
PR_NUMBER="${PR_NUMBER:-}"

# Pattern for per-PR scope files
PER_PR_SCOPE_PATTERN="^\.agent-admin/scope-declarations/pr-[0-9]+\.md$"

if [ -n "$PR_NUMBER" ] && \
   [ -f ".agent-admin/scope-declarations/pr-${PR_NUMBER}.md" ]; then
  SCOPE_FILE=".agent-admin/scope-declarations/pr-${PR_NUMBER}.md"
  echo "ℹ️  Using per-PR scope file: $SCOPE_FILE"
fi

if [ -z "$SCOPE_FILE" ]; then
  # Try to discover per-PR file from diff
  DIFF_CANDIDATE=""
  if git rev-parse origin/main >/dev/null 2>&1; then
    DIFF_CANDIDATE=$(git diff --name-only origin/main...HEAD 2>/dev/null | \
      grep -E "$PER_PR_SCOPE_PATTERN" | head -1 || true)
  elif git rev-parse main >/dev/null 2>&1; then
    DIFF_CANDIDATE=$(git diff --name-only main...HEAD 2>/dev/null | \
      grep -E "$PER_PR_SCOPE_PATTERN" | head -1 || true)
  fi
  if [ -n "$DIFF_CANDIDATE" ] && [ -f "$DIFF_CANDIDATE" ]; then
    SCOPE_FILE="$DIFF_CANDIDATE"
    echo "ℹ️  Discovered per-PR scope file from diff: $SCOPE_FILE"
  fi
fi

if [ -z "$SCOPE_FILE" ]; then
  # Legacy fallback: root SCOPE_DECLARATION.md (skip if archival)
  if [ -f "SCOPE_DECLARATION.md" ]; then
    if grep -q "ARCHIVAL" "SCOPE_DECLARATION.md" 2>/dev/null; then
      echo "❌ Root SCOPE_DECLARATION.md is archival — no active per-PR scope file found."
      echo ""
      echo "BL-027 requires an active per-PR scope declaration for scope-to-diff validation."
      echo ""
      echo "Remediation:"
      if [ -n "$PR_NUMBER" ]; then
        echo "  1. Create .agent-admin/scope-declarations/pr-${PR_NUMBER}.md"
      else
        echo "  1. Create .agent-admin/scope-declarations/pr-<PR_NUMBER>.md"
      fi
      echo "     using template: governance/canon/scope-declaration.template.md"
      echo "  2. Add the per-PR scope file to this PR's diff if it is not already included"
      echo "  3. List ALL changed files in the FILES_CHANGED section"
      echo "  4. Run this script again to validate"
      echo ""
      exit 1
    fi
    SCOPE_FILE="SCOPE_DECLARATION.md"
    echo "ℹ️  Falling back to root SCOPE_DECLARATION.md (legacy)"
  fi
fi

# Check if scope file exists
if [ -z "$SCOPE_FILE" ]; then
    echo "❌ No scope declaration file found."
    echo ""
    echo "Required by: SCOPE_DECLARATION_SCHEMA.md v2.0.0 (maturion-isms#1521)"
    echo ""
    echo "Remediation:"
    echo "  1. Create .agent-admin/scope-declarations/pr-<PR_NUMBER>.md"
    echo "     using template: governance/canon/scope-declaration.template.md"
    echo "  2. List ALL changed files in the FILES_CHANGED section"
    echo "  3. Run this script again to validate"
    echo ""
    exit 1
fi

echo "✓ Scope file: $SCOPE_FILE"

# Get list of changed files from git diff
# Try origin/main first, fall back to main if origin/main doesn't exist
if git rev-parse origin/main >/dev/null 2>&1; then
    CHANGED_FILES=$(git diff --name-only origin/main...HEAD 2>/dev/null | sort)
else
    CHANGED_FILES=$(git diff --name-only main...HEAD 2>/dev/null | sort)
fi

if [ -z "$CHANGED_FILES" ]; then
    CHANGED_COUNT=0
else
    CHANGED_COUNT=$(echo "$CHANGED_FILES" | wc -l)
fi

echo "✓ Found $CHANGED_COUNT changed files in git diff"

# Extract files from scope declaration file.
# Handles both the v2 per-PR format (bare list items) and the legacy format.
# Format 1 (v2): - `path/to/file.ext` (with or without trailing description)
# Format 2 (legacy): - `path/to/file.ext` - Description
SCOPE_FILES=$(grep -E '^\s*-\s+`[^`]+`' "$SCOPE_FILE" 2>/dev/null | sed 's/.*`\([^`]*\)`.*/\1/' | sort || true)

# Fallback: Try extracting files without backticks (legacy format)
if [ -z "$SCOPE_FILES" ]; then
    SCOPE_FILES=$(grep -E '^\s*-\s+[^\s`].*\.(md|ts|tsx|js|jsx|json|yml|yaml|sh|py|toml|txt|html|css|lock|gitignore|env)' "$SCOPE_FILE" 2>/dev/null | sed 's/^\s*-\s*\([^\s]*\).*/\1/' | sort || true)
fi

if [ -z "$SCOPE_FILES" ]; then
    SCOPE_COUNT=0
else
    SCOPE_COUNT=$(echo "$SCOPE_FILES" | wc -l)
fi

echo "✓ Found $SCOPE_COUNT files declared in $SCOPE_FILE"

# Handle empty PR case
if [ "$CHANGED_COUNT" -eq 0 ] && [ "$SCOPE_COUNT" -eq 0 ]; then
    echo ""
    echo "⚠️  No changes detected (empty PR)"
    echo "   Both git diff and $SCOPE_FILE are empty"
    exit 0
fi

# Validate scope file is not empty when changes exist
if [ "$CHANGED_COUNT" -gt 0 ] && [ "$SCOPE_COUNT" -eq 0 ]; then
    echo ""
    echo "❌ $SCOPE_FILE is empty or malformed"
    echo ""
    echo "Git diff shows $CHANGED_COUNT changed files, but $SCOPE_FILE declares 0 files."
    echo ""
    echo "Remediation:"
    echo "  1. Ensure $SCOPE_FILE contains file declarations in format:"
    echo "     - \`path/to/file.ext\`"
    echo "  2. List all files from: git diff --name-only origin/main...HEAD"
    echo ""
    exit 1
fi

# Validate git diff is not empty when scope declaration exists
if [ "$CHANGED_COUNT" -eq 0 ] && [ "$SCOPE_COUNT" -gt 0 ]; then
    echo ""
    echo "❌ Git diff is empty but $SCOPE_FILE declares $SCOPE_COUNT files"
    echo ""
    echo "This indicates $SCOPE_FILE contains files not present in git diff."
    echo ""
    echo "Remediation:"
    echo "  1. Verify you're on the correct branch"
    echo "  2. Check git diff --name-only origin/main...HEAD output"
    echo "  3. Update $SCOPE_FILE to match actual changes"
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
    echo "❌ MISSING FILES: $MISSING_COUNT file(s) in git diff but NOT declared in $SCOPE_FILE"
    echo ""
    echo "The following files are changed in git but missing from $SCOPE_FILE:"
    echo "$MISSING_FILES" | while IFS= read -r file; do
        [ -n "$file" ] && echo "   - $file"
    done
    echo ""
    echo "Remediation:"
    echo "  Add these files to $SCOPE_FILE in the FILES_CHANGED section"
    echo ""
fi

if [ "$EXTRA_COUNT" -gt 0 ]; then
    HAS_ERRORS=true
    echo "❌ EXTRA FILES: $EXTRA_COUNT file(s) declared in $SCOPE_FILE but NOT in git diff"
    echo ""
    echo "The following files are declared but not present in git diff:"
    echo "$EXTRA_FILES" | while IFS= read -r file; do
        [ -n "$file" ] && echo "   - $file"
    done
    echo ""
    echo "Remediation:"
    echo "  Remove these files from $SCOPE_FILE or verify they are committed to the branch"
    echo ""
fi

if [ "$HAS_ERRORS" = true ]; then
    echo "❌ Scope-to-Diff validation FAILED"
    echo ""
    echo "Summary:"
    echo "  Changed files (git diff):        $CHANGED_COUNT"
    echo "  Declared files ($SCOPE_FILE): $SCOPE_COUNT"
    echo "  Missing from declaration:        $MISSING_COUNT"
    echo "  Extra in declaration:            $EXTRA_COUNT"
    echo ""
    echo "Authority: MERGE_GATE_PHILOSOPHY.md (BL-027)"
    echo "Required: Exact match between git diff and $SCOPE_FILE"
    echo ""
    exit 1
fi

# Success case
echo "✅ Exact set comparison PASSED"
echo ""
echo "Summary:"
echo "  Changed files (git diff):        $CHANGED_COUNT"
echo "  Declared files ($SCOPE_FILE): $SCOPE_COUNT"
echo "  Missing files:                   0"
echo "  Extra files:                     0"
echo ""
echo "✅ All changed files are declared in $SCOPE_FILE"
echo "✅ No extra files declared"
echo "✅ Exact match confirmed"
echo ""
exit 0
