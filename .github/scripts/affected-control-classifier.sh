#!/bin/bash
# affected-control-classifier.sh
# Purpose: Classify control surface of PR diff and emit a required-controls pre-alert.
# Authority: maturion-isms#1640
#
# Runs early in the preflight pipeline as an informational step.
# For PRs touching governance/canon/**, governance/templates/**,
# .agent-workspace/independent-assurance-agent/**,
# .github/scripts/**, or .github/workflows/**, the pre-alert explicitly declares:
#   ECAP_REQUIRED, IAA_REQUIRED, CANON_INVENTORY_SYNC_REQUIRED,
#   PRODUCT_DELIVERY_REQUIRED, GOVERNING_ISSUE_REQUIRED, HANDOVER_ALLOWED
#
# Exit code: 0 always (informational — downstream gates provide the actual blocks).

set -uo pipefail

BASE_SHA="${BASE_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Affected-Control Classifier"
echo "  Authority: maturion-isms#1640"
echo "  Purpose: pre-alert required controls for governance-controlled PRs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

compute_changed_files() {
  if [ -n "$BASE_SHA" ]; then
    git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null
  elif git rev-parse origin/main >/dev/null 2>&1; then
    git diff --name-only "origin/main...HEAD" 2>/dev/null
  else
    git diff --name-only HEAD~1...HEAD 2>/dev/null || true
  fi
}

CHANGED_FILES="$(compute_changed_files || true)"

if [ -z "$CHANGED_FILES" ]; then
  echo "ℹ️  No changed files detected — classifier N/A."
  exit 0
fi

# ── Control surface classification ──────────────────────────────────────────

CANON_CHANGED=false
TEMPLATE_CHANGED=false
IAA_AGENT_CHANGED=false
GATE_SCRIPT_CHANGED=false
PRODUCT_CODE_CHANGED=false

while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    governance/canon/*)
      CANON_CHANGED=true
      ;;
    governance/templates/*)
      TEMPLATE_CHANGED=true
      ;;
    .agent-workspace/independent-assurance-agent/*)
      IAA_AGENT_CHANGED=true
      ;;
    .github/scripts/*|.github/workflows/*)
      GATE_SCRIPT_CHANGED=true
      ;;
    .github/*|governance/*|docs/*|.agent-admin/*|.agent-workspace/*|.functional-delivery/pr-template.md)
      # Non-product governance/admin paths — no product code flag
      ;;
    *)
      # Any file not excluded above may be product code
      if [[ "$file" =~ \.(tsx|jsx|ts|js|py|go|sql)$ ]] || \
         [[ "$file" =~ ^(apps|packages|supabase|api|modules)/ ]]; then
        PRODUCT_CODE_CHANGED=true
      fi
      ;;
  esac
done <<< "$CHANGED_FILES"

GOVERNANCE_CONTROLLED_CHANGED=false
if [ "$CANON_CHANGED" = true ] || [ "$TEMPLATE_CHANGED" = true ] || [ "$IAA_AGENT_CHANGED" = true ] || [ "$GATE_SCRIPT_CHANGED" = true ]; then
  GOVERNANCE_CONTROLLED_CHANGED=true
fi

if [ "$GOVERNANCE_CONTROLLED_CHANGED" = false ]; then
  echo "ℹ️  No governance-controlled control surfaces affected (governance/canon/**, governance/templates/**, .agent-workspace/independent-assurance-agent/**, .github/scripts/**, .github/workflows/**)."
  echo "   Affected-control pre-alert: N/A"
  echo ""
  echo "Changed files:"
  echo "$CHANGED_FILES" | sed 's/^/  - /'
  exit 0
fi

# ── Emit pre-alert ────────────────────────────────────────────────────────────

echo "⚠️  Governance-controlled control surfaces detected in PR diff."
echo ""
echo "Changed control-surface files:"
echo "$CHANGED_FILES" | grep -E '^(governance/canon/|governance/templates/|\.agent-workspace/independent-assurance-agent/|\.github/scripts/|\.github/workflows/)' | sed 's/^/  - /' || true
echo ""

# Determine PRODUCT_DELIVERY_REQUIRED
if [ "$PRODUCT_CODE_CHANGED" = true ]; then
  PRODUCT_DELIVERY_REQUIRED="yes — product code also changed in this PR"
else
  PRODUCT_DELIVERY_REQUIRED="no — only governance/canon/template/IAA-agent/gate-script control surfaces changed"
fi

# CANON_INVENTORY_SYNC_REQUIRED only when governance/canon/** is touched
if [ "$CANON_CHANGED" = true ]; then
  CANON_INVENTORY_SYNC_REQUIRED="yes"
else
  CANON_INVENTORY_SYNC_REQUIRED="no — no governance/canon/** files changed"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AFFECTED-CONTROL PRE-ALERT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ECAP_REQUIRED:                 yes"
echo "  IAA_REQUIRED:                  yes"
echo "  CANON_INVENTORY_SYNC_REQUIRED: ${CANON_INVENTORY_SYNC_REQUIRED}"
echo "  PRODUCT_DELIVERY_REQUIRED:     ${PRODUCT_DELIVERY_REQUIRED}"
echo "  GOVERNING_ISSUE_REQUIRED:      explicit"
echo "  HANDOVER_ALLOWED:              no until preflight green"
echo ""
echo "  Control surfaces triggered:"
[ "$CANON_CHANGED" = true ]    && echo "    - governance/canon/**      → CANON_GOVERNANCE class"
[ "$TEMPLATE_CHANGED" = true ] && echo "    - governance/templates/**  → CANON_GOVERNANCE class"
[ "$IAA_AGENT_CHANGED" = true ] && echo "    - .agent-workspace/independent-assurance-agent/** → AGENT_CONTRACT class"
[ "$GATE_SCRIPT_CHANGED" = true ] && echo "    - .github/scripts/**       → GATE_CONTROL class"
[ "$GATE_SCRIPT_CHANGED" = true ] && echo "    - .github/workflows/**     → GATE_CONTROL class (if changed)"
echo ""
echo "  Required agents:"
echo "    - execution-ceremony-admin-agent  (ECAP_REQUIRED)"
echo "    - independent-assurance-agent     (IAA_REQUIRED)"
[ "$CANON_CHANGED" = true ] && echo "    - CANON_INVENTORY sync required before IAA invocation"
echo ""
echo "  Evidence gates:"
echo "    - preflight/evidence-exactness         (governing issue must be explicit)"
echo "    - preflight/ecap-admin-ceremony        (ECAP proof required)"
echo "    - preflight/iaa-final-assurance        (IAA token required)"
[ "$CANON_CHANGED" = true ] && echo "    - preflight/evidence-exactness hash check (CANON_INVENTORY hashes must be non-null)"
echo ""
echo "  Note: product-delivery/functional-delivery evidence (.functional-delivery/pr-<n>.md)"
echo "        is NOT required from PR body language alone for governance-controlled PRs."
echo "        It IS required if product code is also changed."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
