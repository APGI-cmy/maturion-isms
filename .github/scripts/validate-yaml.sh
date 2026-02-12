#!/bin/bash
# YAML Validation Script
# Authority: MERGE_GATE_PHILOSOPHY.md (BL-028)
# Purpose: Validates YAML syntax with zero warnings

set -e

echo "=== YAML Syntax Validation (BL-028) ==="
echo ""

# Find all YAML files
YAML_FILES=$(find .github governance -name "*.yml" -o -name "*.yaml" 2>/dev/null || echo "")

if [ -z "$YAML_FILES" ]; then
    echo "ℹ️  No YAML files found to validate"
    exit 0
fi

# Check if yamllint is available
if ! command -v yamllint &> /dev/null; then
    echo "⚠️  yamllint not found - installing..."
    pip install --quiet yamllint || {
        echo "❌ Failed to install yamllint"
        exit 1
    }
fi

echo "✓ yamllint available"

# Run yamllint with strict configuration
WARNINGS=0
echo "$YAML_FILES" | while read -r file; do
    if [ -f "$file" ]; then
        echo "  Checking: $file"
        if ! yamllint -d relaxed "$file" 2>&1 | grep -q "warning\|error"; then
            echo "    ✓ Valid"
        else
            echo "    ❌ Has warnings/errors"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
done

if [ $WARNINGS -gt 0 ]; then
    echo ""
    echo "❌ YAML validation FAILED: $WARNINGS file(s) with warnings/errors"
    echo "   Required by: MERGE_GATE_PHILOSOPHY.md (BL-028)"
    echo "   Remediation: Fix all YAML warnings and errors"
    exit 1
fi

echo ""
echo "✅ YAML validation PASSED: All files valid, zero warnings"
exit 0
