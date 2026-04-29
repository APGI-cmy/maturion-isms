#!/bin/bash
# Merge-Ready Claim Gate
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_HANDOVER_AUTOMATION.md
# Purpose: Hard CI gate that fails when a PR body or PREHANDOVER proof contains
#          merge-ready / handover-ready language while the lifecycle assurance
#          state is blocked (IAA or ECAP required but not completed).
#
#          Agents must not mark a PR as merge-ready while:
#            - preflight/iaa-final-assurance is red
#            - preflight/ecap-admin-ceremony is red
#            - lifecycle says handover_allowed: false or merge_ready_allowed: false
#            - final IAA token does not match current HEAD SHA
#
#          This gate detects premature merge-ready claims from PR body text,
#          PREHANDOVER proof files, and foreman session memory files.
#
# Required env vars:
#   BASE_SHA               PR base SHA
#   HEAD_SHA               PR head SHA
#   PR_NUMBER              PR number (integer)
#   PR_LABELS              comma-separated PR labels
#   PR_BODY                PR body text
#   EXPECTED_ISSUE_NUMBER  governing issue number
#
# Violation class: MERGE-READY-001
# Issue: maturion-isms#1519

set -euo pipefail

echo "=== Merge-Ready Claim Gate ==="
echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0"
echo "Violation class: MERGE-READY-001"
echo ""

# ----------------------------------------------------------------
# Environment variables
# ----------------------------------------------------------------
BASE_SHA="${BASE_SHA:-}"
HEAD_SHA="${HEAD_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_LABELS="${PR_LABELS:-}"
PR_BODY="${PR_BODY:-}"
EXPECTED_ISSUE_NUMBER="${EXPECTED_ISSUE_NUMBER:-}"
ASSURANCE_DIR=".agent-admin/assurance"
PREHANDOVER_DIR=".agent-admin/prehandover"

# ----------------------------------------------------------------
# CS2 sign-off bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"CS sign-off: approved"* ]]; then
  echo "✅ PASS — PR carries 'CS sign-off: approved' — merge-ready claim gate waived."
  exit 0
fi

# ----------------------------------------------------------------
# Automated governance PR bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"governance"* ]] && \
   [[ "$PR_LABELS" == *"automated"* ]] && \
   [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  echo "✅ PASS — Automated governance alignment PR — merge-ready claim gate bypassed."
  exit 0
fi

# ----------------------------------------------------------------
# Require BASE_SHA
# ----------------------------------------------------------------
if [ -z "$BASE_SHA" ]; then
  echo "❌ ERROR: BASE_SHA env var not set."
  exit 1
fi

echo "PR Number    : ${PR_NUMBER:-<not provided>}"
echo "HEAD SHA     : ${HEAD_SHA:0:12}..."
echo ""

# ----------------------------------------------------------------
# Step 1: Determine if lifecycle is blocked
#         (re-run same detection as iaa-final-assurance-gate.sh
#          and ecap-admin-ceremony-gate.sh, without failing here —
#          we only need to know if the lifecycle is blocked)
# ----------------------------------------------------------------
echo "--- Step 1: Lifecycle Blocked State Detection ---"
echo ""

CHANGED_FILES=$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || \
                git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null || true)

IMPLEMENTATION_CHANGED=false
PROTECTED_PATH_TOUCHED=false

while IFS= read -r file; do
  [ -z "$file" ] && continue

  if [[ "$file" =~ ^\.agent-workspace/ ]] || [[ "$file" =~ ^\.agent-admin/ ]]; then continue; fi
  if [[ "$file" =~ \.md$ ]]; then continue; fi
  if [[ "$file" =~ ^\.github/ ]]; then continue; fi
  if [[ "$file" =~ ^governance/ ]] || [[ "$file" =~ ^SCOPE_DECLARATION ]]; then continue; fi

  if [[ "$file" =~ ^(modules|apps|packages)/[^/]+/src/ ]] || \
     [[ "$file" =~ ^(modules|apps|packages)/[^/]+/tests?/ ]] || \
     [[ "$file" =~ ^supabase/functions/ ]] || \
     [[ "$file" =~ ^supabase/migrations/ ]] || \
     [[ "$file" =~ \.(ts|tsx|js|jsx|py|sql)$ ]]; then
    IMPLEMENTATION_CHANGED=true
  fi

done <<< "$CHANGED_FILES"

while IFS= read -r file; do
  [ -z "$file" ] && continue
  if [[ "$file" =~ ^\.github/agents/.*\.md$ ]] || \
     [[ "$file" =~ ^governance/canon/ ]] || \
     [[ "$file" =~ ^governance/checklists/ ]] || \
     [[ "$file" =~ ^governance/templates/ ]] || \
     [[ "$file" == "governance/CANON_INVENTORY.json" ]]; then
    PROTECTED_PATH_TOUCHED=true
  fi
done <<< "$CHANGED_FILES"

IAA_REQUIRED=false
ECAP_REQUIRED=false
[ "$IMPLEMENTATION_CHANGED" = true ] && IAA_REQUIRED=true
[ "$PROTECTED_PATH_TOUCHED" = true ] && ECAP_REQUIRED=true

# Check if valid IAA token is present (simplified check — full validation in iaa-final-assurance-gate.sh)
IAA_INVOKED=false
if [ -z "$EXPECTED_ISSUE_NUMBER" ] && [ -n "$PR_BODY" ]; then
  EXPECTED_ISSUE_NUMBER=$(echo "$PR_BODY" | \
    grep -ioE '(closes|fixes|resolves|addresses)[[:space:]]+(maturion-isms)?#([0-9]+)' | \
    grep -oE '[0-9]+$' | head -1 || true)
fi

TOKEN_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-token-.*\.md$" || true)
WAVE_RECORD_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-wave-record-.*\.md$" || true)

for token_file in $TOKEN_FILES_IN_PR $WAVE_RECORD_FILES_IN_PR; do
  [ -z "$token_file" ] && continue
  [ ! -f "$token_file" ] && continue

  head -15 "$token_file" 2>/dev/null | grep -qi "REJECTION[-.]PACKAGE" && continue

  TV=$(grep "PHASE_B_BLOCKING_TOKEN:" "$token_file" 2>/dev/null | head -1 | \
    sed 's/.*PHASE_B_BLOCKING_TOKEN://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
  [ -z "$TV" ] || [ "$TV" = "PENDING" ] && continue

  VL=$(grep -iE "Verdict" "$token_file" 2>/dev/null | head -1 || true)
  echo "$VL" | grep -qi "PASS" || continue

  PR_NUM_IN_TOKEN=$(grep -iE '^[[:space:]]*(-[[:space:]]*)?\*\*PR\*\*:[[:space:]]*' "$token_file" 2>/dev/null | \
    head -1 | grep -oE '#?[0-9]+' | head -1 | tr -d '#' || true)
  [ -n "$PR_NUMBER" ] && [ -n "$PR_NUM_IN_TOKEN" ] && [ "$PR_NUM_IN_TOKEN" != "$PR_NUMBER" ] && continue

  IAA_INVOKED=true
  break
done

# Check if valid ECAP evidence is present
ECAP_INVOKED=false
ECAP_BUNDLE_DIR=".agent-workspace/execution-ceremony-admin-agent/bundles"
ECAP_BUNDLES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ECAP_BUNDLE_DIR}/PREHANDOVER-.*\.md$" || true)
[ -n "$ECAP_BUNDLES_IN_PR" ] && ECAP_INVOKED=true

if [ "$ECAP_INVOKED" = false ]; then
  PREHANDOVER_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
    | grep -E "^${PREHANDOVER_DIR}/proof-.*\.md$|^\.agent-workspace/foreman-v2/memory/PREHANDOVER-.*\.md$" \
    || true)
  while IFS= read -r pf; do
    [ -z "$pf" ] && continue
    [ ! -f "$pf" ] && continue
    WAIVER=$(grep -iE "^[[:space:]]*ecap_waiver_ref:" "$pf" 2>/dev/null | head -1 | \
      sed 's/.*ecap_waiver_ref://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
    if [ -n "$WAIVER" ] && ! echo "$WAIVER" | grep -qiE "^N/A$|^none$|^-$|^\[\]$|^null$"; then
      ECAP_INVOKED=true
      break
    fi
  done <<< "$PREHANDOVER_IN_PR"
fi

# Determine blocked state
LIFECYCLE_BLOCKED=false
IAA_BLOCKED_STATE=""
ECAP_BLOCKED_STATE=""

if [ "$IAA_REQUIRED" = true ] && [ "$IAA_INVOKED" = false ]; then
  LIFECYCLE_BLOCKED=true
  IAA_BLOCKED_STATE="iaa-blocked"
fi
if [ "$ECAP_REQUIRED" = true ] && [ "$ECAP_INVOKED" = false ]; then
  LIFECYCLE_BLOCKED=true
  ECAP_BLOCKED_STATE="ecap-blocked"
fi

echo "IAA required:  ${IAA_REQUIRED} | invoked: ${IAA_INVOKED} | blocked: ${IAA_REQUIRED}"
echo "ECAP required: ${ECAP_REQUIRED} | invoked: ${ECAP_INVOKED} | blocked: ${ECAP_REQUIRED}"
echo "Lifecycle blocked: ${LIFECYCLE_BLOCKED}"
echo ""

if [ "${LIFECYCLE_BLOCKED}" = false ]; then
  echo "✅ Lifecycle is NOT blocked — merge-ready claim gate: not required."
  exit 0
fi

echo "⚠️  Lifecycle is BLOCKED — scanning PR body and PREHANDOVER proofs for"
echo "   premature merge-ready / handover-ready language..."
echo ""

# ----------------------------------------------------------------
# Step 2: Define merge-ready / handover-ready patterns
# ----------------------------------------------------------------
# These patterns match common language agents use to claim merge-readiness.
# The patterns are case-insensitive and cover common variants.
MERGE_READY_PATTERNS=(
  "merge.ready"
  "merge_ready"
  "ready.for.merge"
  "ready.to.merge"
  "approved.for.merge"
  "release.merge.gate"
  "merge.permitted"
  "merge.gate.released"
  "merge.authority.*CS2"
  "Awaiting CS2 review.*[Mm]erge"
  "handover.ready"
  "handover_ready"
  "ready.for.handover"
  "HANDOVER.*COMPLETE"
  "HANDOVER.*PASS"
  "handover.*released"
  "Merge gate released"
  "merge_ready_allowed.*true"
  "PREHANDOVER.*PASS.*merge"
)

# ----------------------------------------------------------------
# Step 3: Check PR body
# ----------------------------------------------------------------
echo "--- Step 3: PR Body Check ---"
echo ""

FAIL=false
FAIL_REASONS=""

if [ -n "$PR_BODY" ]; then
  for pattern in "${MERGE_READY_PATTERNS[@]}"; do
    if echo "$PR_BODY" | grep -qiE "$pattern"; then
      echo "  ❌ Premature merge-ready claim detected in PR body:"
      echo "     Pattern matched: $pattern"
      FAIL=true
      FAIL_REASONS="${FAIL_REASONS}\n  - PR body contains merge-ready/handover-ready language (pattern: ${pattern})"
      break
    fi
  done

  if [ "$FAIL" = false ]; then
    echo "  ✅ No merge-ready / handover-ready language found in PR body."
  fi
else
  echo "  ℹ️  PR body not provided — skipping PR body check."
fi
echo ""

# ----------------------------------------------------------------
# Step 4: Check PREHANDOVER proofs and foreman session memory
# ----------------------------------------------------------------
echo "--- Step 4: PREHANDOVER Proof and Foreman Memory Check ---"
echo ""

# Check PREHANDOVER proofs and foreman memory files introduced by this PR
PROOF_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep -E "^${PREHANDOVER_DIR}/proof-.*\.md$|^\.agent-workspace/foreman-v2/memory/PREHANDOVER-.*\.md$" \
  || true)

if [ -z "$PROOF_FILES_IN_PR" ]; then
  echo "  ℹ️  No PREHANDOVER proof or foreman memory files introduced by this PR."
else
  while IFS= read -r proof_file; do
    [ -z "$proof_file" ] && continue
    [ ! -f "$proof_file" ] && continue

    echo "  Checking: $proof_file"
    FOUND_IN_FILE=false

    for pattern in "${MERGE_READY_PATTERNS[@]}"; do
      if grep -qiE "$pattern" "$proof_file" 2>/dev/null; then
        echo "    ❌ Premature merge-ready language found:"
        echo "       Pattern: $pattern"
        echo "       Line: $(grep -iE "$pattern" "$proof_file" | head -1)"
        FAIL=true
        FOUND_IN_FILE=true
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: contains merge-ready/handover-ready language (pattern: ${pattern})"
        break
      fi
    done

    if [ "$FOUND_IN_FILE" = false ]; then
      echo "    ✅ No merge-ready / handover-ready language found."
    fi
  done <<< "$PROOF_FILES_IN_PR"
fi
echo ""

# ----------------------------------------------------------------
# Step 5: Verdict
# ----------------------------------------------------------------
echo "--- Step 5: Verdict ---"
echo ""

if [ "$FAIL" = true ]; then
  echo "❌ FAIL — Merge-Ready Claim Gate: BLOCKED"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "🚨 MERGE-READY-001: PREMATURE MERGE-READY CLAIM WHILE LIFECYCLE BLOCKED"
  echo ""
  echo "Lifecycle blocked state:"
  [ -n "$ECAP_BLOCKED_STATE" ] && echo "  - ECAP required but not completed (${ECAP_BLOCKED_STATE})"
  [ -n "$IAA_BLOCKED_STATE"  ] && echo "  - IAA required but not completed (${IAA_BLOCKED_STATE})"
  echo ""
  echo "Premature merge-ready claims:"
  echo -e "$FAIL_REASONS"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Agents MUST NOT mark a PR as merge-ready or handover-ready while:"
  echo "  - preflight/iaa-final-assurance is red"
  echo "  - preflight/ecap-admin-ceremony is red"
  echo "  - lifecycle shows handover_allowed: false or merge_ready_allowed: false"
  echo ""
  echo "Required actions:"
  if [ -n "$ECAP_BLOCKED_STATE" ]; then
    echo "  1. Complete ECAP ceremony first:"
    echo "     task(agent_type: 'execution-ceremony-admin-agent')"
  fi
  if [ -n "$IAA_BLOCKED_STATE" ]; then
    echo "  2. Obtain IAA final assurance:"
    echo "     task(agent_type: 'independent-assurance-agent')"
    echo "     Provide: PR #${PR_NUMBER:-NNN}, issue #${EXPECTED_ISSUE_NUMBER:-NNN}, HEAD ${HEAD_SHA:-<sha>}"
  fi
  echo ""
  echo "  3. Only after ALL lifecycle gates are GREEN:"
  echo "     Remove merge-ready/handover-ready claims from PR body and PREHANDOVER."
  echo "     Then CI will confirm assurance-ready state."
  echo ""
  echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | AGENT_HANDOVER_AUTOMATION.md"
  echo "Violation: MERGE-READY-001 (premature merge-ready while lifecycle blocked)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 1
fi

echo "✅ PASS — Merge-Ready Claim Gate passed."
echo "   No premature merge-ready / handover-ready claims found while lifecycle is blocked."
