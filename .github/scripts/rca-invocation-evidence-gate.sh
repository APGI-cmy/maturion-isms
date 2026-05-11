#!/bin/bash
# RCA Invocation Evidence Gate
# Purpose: If RCA_REQUIRED marker is active, require a valid RCA assessment artifact.

set -euo pipefail

PR_NUMBER="${PR_NUMBER:-}"
RCA_REQUIRED="${RCA_REQUIRED:-no}"

echo "=== RCA Invocation Evidence Gate ==="

if [[ "$RCA_REQUIRED" != "yes" ]]; then
  echo "✅ PASS — RCA_REQUIRED marker is not active for this PR."
  exit 0
fi

if [[ -z "$PR_NUMBER" ]]; then
  echo "❌ FAIL — PR_NUMBER is required when RCA_REQUIRED is active."
  exit 1
fi

RCA_ARTIFACT_PATH=".agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-${PR_NUMBER}.md"

if [[ ! -f "$RCA_ARTIFACT_PATH" ]]; then
  echo "❌ FAIL — RCA_REQUIRED is active but RCA assessment artifact is missing."
  echo "Expected: $RCA_ARTIFACT_PATH"
  exit 1
fi

if [[ ! -s "$RCA_ARTIFACT_PATH" ]]; then
  echo "❌ FAIL — RCA assessment artifact exists but is empty: $RCA_ARTIFACT_PATH"
  exit 1
fi

if ! grep -qi "ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT" "$RCA_ARTIFACT_PATH"; then
  echo "❌ FAIL — Missing assessment header 'ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT'."
  exit 1
fi

required_fields=(
  "PR"
  "Issue"
  "Failure trigger"
  "Failure class"
  "Root cause"
  "Was this already covered by existing guidance"
  "Lowest effective fix layer"
  "Corrective action required"
  "Regression needed"
  "Tier 2 update needed"
  "Template update needed"
  "Gate update needed"
  "Canon issue needed"
  "Agent contract review needed"
  "Product backlog item needed"
  "Owner for correction"
  "IAA review required"
  "CS2 final overview required"
  "RCA verdict"
)

fail=false
for field in "${required_fields[@]}"; do
  if ! grep -qiE "^${field}:[[:space:]]*[^[:space:]].*$" "$RCA_ARTIFACT_PATH"; then
    echo "❌ Missing or empty required field: ${field}:"
    fail=true
  fi
done

if [[ "$fail" == "true" ]]; then
  echo ""
  echo "❌ FAIL — RCA assessment artifact is incomplete: $RCA_ARTIFACT_PATH"
  exit 1
fi

echo "✅ PASS — RCA assessment artifact is present and complete: $RCA_ARTIFACT_PATH"
