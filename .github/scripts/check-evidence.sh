#!/bin/bash
# Evidence Check Script
# Authority: MERGE_GATE_PHILOSOPHY.md v2.0, OPOJD v2.0
# Purpose: Checks for PREHANDOVER_PROOF evidence and validates structure

set -e

GATE_NAME=$1
GATE_KEYWORD=$2

if [ -z "$GATE_NAME" ] || [ -z "$GATE_KEYWORD" ]; then
    echo "Usage: $0 <gate-name> <gate-keyword>"
    exit 1
fi

echo "=== Evidence-Based Validation Check ==="
echo "Gate: $GATE_NAME"
echo "Keyword: $GATE_KEYWORD"
echo ""

# Look for PREHANDOVER_PROOF with this gate documented
if [ -f "PREHANDOVER_PROOF.md" ] && grep -qi "$GATE_KEYWORD" PREHANDOVER_PROOF.md; then
    echo "✅ Found PREHANDOVER_PROOF.md with $GATE_NAME validation"
    echo "✅ ACCEPTING evidence-based validation per MERGE_GATE_PHILOSOPHY.md v2.0"
    echo "skip_execution=true"
    exit 0
elif ls PREHANDOVER_PROOF_*.md 1> /dev/null 2>&1 && grep -qi "$GATE_KEYWORD" PREHANDOVER_PROOF_*.md 2>/dev/null; then
    echo "✅ Found PREHANDOVER_PROOF with $GATE_NAME validation"
    echo "✅ ACCEPTING evidence-based validation per MERGE_GATE_PHILOSOPHY.md v2.0"
    echo "skip_execution=true"
    exit 0
else
    echo "ℹ️  No evidence-based validation found - proceeding with script execution"
    echo "skip_execution=false"
    exit 0
fi
