#!/bin/bash
# validate-mmm-ui-evidence-pack.sh
# Authority: governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md
# Purpose: CI gate — validates Live UI Evidence Pack (LUIEP) per Rules U-001 through U-008
#   Step 1: Scan for prohibited completion phrases in PREHANDOVER proof / wave-current-tasks
#   Step 2: If no phrase found → PASS (gate not triggered)
#   Step 3: If phrase found → locate LUIEP artifact
#   Step 4: If no artifact → FAIL INC-MMM-LUIEP-MISSING-001
#   Step 5: Validate all 10 required LUIEP top-level fields
#   Step 6: Validate route inventory coverage (all required app routes)
#   Step 7: Validate network/API evidence (endpoint list, status codes)
#   Step 8: Validate operational status matrix
#   Step 9: All checks pass → PASS
# Exit codes: 0=PASS, 1=FAIL
set -uo pipefail

ERRORS=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MMM Live UI Evidence Pack Gate (LUIEP)"
echo "  Authority: governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md"
echo "  Version: 1.2.0"
echo "  Branch: ${BRANCH:-$(git branch --show-current 2>/dev/null || echo 'unknown')}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================
# STEP 1: Scan for prohibited completion phrases
# ============================================================
echo "── STEP 1: Scan for prohibited completion phrases ──"

PROHIBITED_PHRASES=(
  "handover ready"
  "operationally closed"
  "L2 complete"
  "L3 complete"
  "deployment commissioned"
  "operational-complete"
  "merge ready"
  "merge-ready"
  "build complete"
  "build completed"
  "user journey complete"
  "final_state: COMPLETE"
  "final_state:COMPLETE"
)

BASE_SHA="${BASE_SHA:-}"

FOUND_PHRASE=""
FOUND_FILE=""

# 1a. Scan markdown files new/modified in this PR (diff-based when BASE_SHA
#     available) or fall back to the current active-wave task file only.
#     This avoids false positives from historical governance reference docs.
if [ -n "$BASE_SHA" ]; then
  # Scan only operational state files (PREHANDOVER proofs, wave-current-tasks)
  # that are new/modified in this PR. All governance docs, canon files, trackers,
  # templates, scope declarations and assurance artifacts are excluded because they
  # legitimately contain the prohibited phrases as definitional vocabulary.
  CHANGED_MD_FILES=$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null \
    | grep -E '\.md$' \
    | grep -E '(^\.agent-admin/prehandover/proof-|/wave-current-tasks\.md$|^\.agent-admin/prehandover/PREHANDOVER)' \
    || true)
  while IFS= read -r md_file; do
    [ -z "$md_file" ] && continue
    [ ! -f "$md_file" ] && continue
    for phrase in "${PROHIBITED_PHRASES[@]}"; do
      if grep -qiF "$phrase" "$md_file" 2>/dev/null; then
        FOUND_PHRASE="$phrase"
        FOUND_FILE="$md_file"
        break 2
      fi
    done
  done <<< "$CHANGED_MD_FILES"
else
  # Fallback: scan only current active-wave task file and any PREHANDOVER proofs.
  FALLBACK_TARGETS=()
  [ -f ".agent-workspace/foreman-v2/personal/wave-current-tasks.md" ] && \
    FALLBACK_TARGETS+=(".agent-workspace/foreman-v2/personal/wave-current-tasks.md")
  if [ -d ".agent-admin/prehandover" ]; then
    while IFS= read -r -d '' f; do
      FALLBACK_TARGETS+=("$f")
    done < <(find ".agent-admin/prehandover" -maxdepth 1 -type f -name "proof-*.md" -print0 2>/dev/null)
  fi
  for md_file in "${FALLBACK_TARGETS[@]:-}"; do
    [ -z "$md_file" ] && continue
    [ ! -f "$md_file" ] && continue
    for phrase in "${PROHIBITED_PHRASES[@]}"; do
      if grep -qiF "$phrase" "$md_file" 2>/dev/null; then
        FOUND_PHRASE="$phrase"
        FOUND_FILE="$md_file"
        break 2
      fi
    done
  done
fi

# Note: PR_BODY is intentionally NOT scanned. The PR description is a
# human-readable changelog and may legitimately reference prohibited phrases
# (e.g. when describing a fix to this very gate). Only committed operational
# state documents (PREHANDOVER proof files, wave-current-tasks.md) are
# authoritative sources for completion claims.

# ============================================================
# STEP 2: If no prohibited phrase found → PASS (gate not triggered)
# ============================================================
if [ -z "$FOUND_PHRASE" ]; then
  echo "   ✅ No prohibited completion phrases detected — LUIEP gate not triggered."
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ LUIEP GATE: PASS (gate not triggered)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi

echo "   ⚠️  Prohibited phrase detected: '$FOUND_PHRASE' in: $FOUND_FILE"
echo "   LUIEP gate triggered — proceeding to artifact validation."
echo ""

# ============================================================
# STEP 3: Locate LUIEP artifact
# ============================================================
echo "── STEP 3: Locate LUIEP artifact ──"

LUIEP_FILE=""

# First prefer an explicit wave-specific artifact path cited in PREHANDOVER proof.
if [ -d ".agent-admin/prehandover" ]; then
  while IFS= read -r -d '' PROOF_REF; do
    LUIEP_PATH_CITED=$(grep -oE "luiep_artifact_path:\s*.+" "$PROOF_REF" 2>/dev/null | \
      sed 's/luiep_artifact_path:\s*//' | tr -d '[:space:]' | head -1 || true)
    if [ -n "$LUIEP_PATH_CITED" ] && [ -f "$LUIEP_PATH_CITED" ] && \
       [ "$(basename "$LUIEP_PATH_CITED")" != "mmm-ui-evidence-pack-template.md" ]; then
      LUIEP_FILE="$LUIEP_PATH_CITED"
      break
    fi
  done < <(find .agent-admin/prehandover -maxdepth 2 -type f -name "proof-*.md" -print0 2>/dev/null)
fi

# If no explicit path is available, search for a non-template evidence pack file.
if [ -z "$LUIEP_FILE" ] && [ -d "modules/MMM/12-phase4-ecap" ]; then
  LUIEP_FILE=$(find "modules/MMM/12-phase4-ecap" -maxdepth 5 -type f \
    -name "*evidence-pack*.md" ! -name "mmm-ui-evidence-pack-template.md" \
    2>/dev/null | head -1 || true)
fi
# ============================================================
# STEP 4: If no LUIEP artifact found → FAIL
# ============================================================
if [ -z "$LUIEP_FILE" ]; then
  echo "::error::LUIEP Gate FAIL (INC-MMM-LUIEP-MISSING-001): Prohibited completion phrase detected but no Live UI Evidence Pack artifact found. See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md Rule U-001."
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ❌ LUIEP GATE: FAIL (INC-MMM-LUIEP-MISSING-001)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi

echo "   ✅ LUIEP artifact found: $LUIEP_FILE"
echo ""

# ============================================================
# STEP 5: Validate all 10 required LUIEP fields
# ============================================================
echo "── STEP 5: Validate LUIEP artifact fields ──"
echo "   Artifact: $LUIEP_FILE"
echo ""

# Helper: check field presence
check_field_present() {
  local field="$1"
  local file="$2"
  if grep -q "${field}:" "$file" 2>/dev/null; then
    echo "   ✅ Field present: ${field}"
    return 0
  else
    echo "   ❌ Field MISSING: ${field}"
    echo "::error::LUIEP Gate FAIL: Required field '${field}' not found in $file. See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md §4."
    ERRORS=$((ERRORS + 1))
    return 1
  fi
}

# Determine if we need strict e2e check (triggered by L3-equivalent completion phrases)
STRICT_E2E=false
if printf '%s' "$FOUND_PHRASE" | grep -qiE "L3 complete|operationally closed|operational-complete"; then
  STRICT_E2E=true
fi

# --- Field 1: deployment_url ---
check_field_present "deployment_url" "$LUIEP_FILE"

# --- Field 2: deployment_url_confirmed (MUST be YES) ---
if grep -q "deployment_url_confirmed:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "deployment_url_confirmed:" "$LUIEP_FILE" | head -1 | sed 's/.*deployment_url_confirmed:\s*//' | tr -d '[:space:]"'"'")
  if [ "$val" = "YES" ]; then
    echo "   ✅ deployment_url_confirmed: YES"
  else
    echo "   ❌ deployment_url_confirmed: '$val' (MUST be YES)"
    echo "::error::LUIEP Gate FAIL: 'deployment_url_confirmed' must be YES, got '$val' in $LUIEP_FILE."
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ❌ Field MISSING: deployment_url_confirmed"
  echo "::error::LUIEP Gate FAIL: Required field 'deployment_url_confirmed' not found in $LUIEP_FILE."
  ERRORS=$((ERRORS + 1))
fi

# --- Field 3: ui_renders_correctly (MUST be YES for L2/L3 claims) ---
if grep -q "ui_renders_correctly:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "ui_renders_correctly:" "$LUIEP_FILE" | head -1 | sed 's/.*ui_renders_correctly:\s*//' | tr -d '[:space:]"'"'" | sed 's/PENDING.*/PENDING/')
  if [ "$val" = "YES" ]; then
    echo "   ✅ ui_renders_correctly: YES"
  else
    echo "   ❌ ui_renders_correctly: '$val' (MUST be YES, not PENDING or NO)"
    echo "::error::LUIEP Gate FAIL: 'ui_renders_correctly' must be YES, got '$val' in $LUIEP_FILE. See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md §4."
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ❌ Field MISSING: ui_renders_correctly"
  echo "::error::LUIEP Gate FAIL: Required field 'ui_renders_correctly' not found in $LUIEP_FILE. See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md §4."
  ERRORS=$((ERRORS + 1))
fi

# --- Field 4: auth_flow_confirmed (MUST be YES for L2/L3 claims) ---
if grep -q "auth_flow_confirmed:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "auth_flow_confirmed:" "$LUIEP_FILE" | head -1 | sed 's/.*auth_flow_confirmed:\s*//' | tr -d '[:space:]"'"'" | sed 's/PENDING.*/PENDING/')
  if [ "$val" = "YES" ]; then
    echo "   ✅ auth_flow_confirmed: YES"
  else
    echo "   ❌ auth_flow_confirmed: '$val' (MUST be YES, not PENDING or NO)"
    echo "::error::LUIEP Gate FAIL: 'auth_flow_confirmed' must be YES, got '$val' in $LUIEP_FILE. See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md §4."
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ❌ Field MISSING: auth_flow_confirmed"
  echo "::error::LUIEP Gate FAIL: Required field 'auth_flow_confirmed' not found in $LUIEP_FILE. See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md §4."
  ERRORS=$((ERRORS + 1))
fi

# --- Field 5: e2e_workflow_confirmed (conditionally MUST be YES) ---
if grep -q "e2e_workflow_confirmed:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "e2e_workflow_confirmed:" "$LUIEP_FILE" | head -1 | sed 's/.*e2e_workflow_confirmed:\s*//' | tr -d '[:space:]"'"'")
  if [ "$STRICT_E2E" = true ] && [ "$val" != "YES" ]; then
    echo "   ❌ e2e_workflow_confirmed: '$val' (MUST be YES when L3 complete or operationally closed)"
    echo "::error::LUIEP Gate FAIL: 'e2e_workflow_confirmed' must be YES when PREHANDOVER uses 'L3 complete' or 'operationally closed'. Got '$val' in $LUIEP_FILE."
    ERRORS=$((ERRORS + 1))
  else
    echo "   ✅ e2e_workflow_confirmed: $val"
  fi
else
  echo "   ❌ Field MISSING: e2e_workflow_confirmed"
  echo "::error::LUIEP Gate FAIL: Required field 'e2e_workflow_confirmed' not found in $LUIEP_FILE."
  ERRORS=$((ERRORS + 1))
fi

# --- Field 6: e2e_workflow_description ---
check_field_present "e2e_workflow_description" "$LUIEP_FILE"

# --- Field 7: screenshots_provided (MUST be YES) ---
if grep -q "screenshots_provided:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "screenshots_provided:" "$LUIEP_FILE" | head -1 | sed 's/.*screenshots_provided:\s*//' | tr -d '[:space:]"'"'")
  if [ "$val" = "YES" ]; then
    echo "   ✅ screenshots_provided: YES"
  else
    echo "   ❌ screenshots_provided: '$val' (MUST be YES)"
    echo "::error::LUIEP Gate FAIL: 'screenshots_provided' must be YES, got '$val' in $LUIEP_FILE."
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ❌ Field MISSING: screenshots_provided"
  echo "::error::LUIEP Gate FAIL: Required field 'screenshots_provided' not found in $LUIEP_FILE."
  ERRORS=$((ERRORS + 1))
fi

# --- Field 8: cs2_sign_off (MUST be a YYYY-MM-DD date; any PENDING variant is rejected) ---
if grep -q "cs2_sign_off:" "$LUIEP_FILE" 2>/dev/null; then
  # Strip surrounding quotes/spaces, then truncate at first whitespace so
  # "PENDING — to be filled…" becomes "PENDING" for the pattern check.
  raw_val=$(grep "^cs2_sign_off:" "$LUIEP_FILE" | head -1 | sed 's/^cs2_sign_off:\s*//' | tr -d '"'"'" | sed "s/[[:space:]].*//" )
  val=$(printf '%s' "$raw_val" | tr -d '[:space:]')
  if [ -z "$val" ] || printf '%s' "$val" | grep -qiE "^PENDING"; then
    echo "   ❌ cs2_sign_off: '$raw_val' (MUST NOT be PENDING or empty — requires YYYY-MM-DD date)"
    echo "::error::LUIEP Gate FAIL: 'cs2_sign_off' must be a YYYY-MM-DD date, not PENDING or empty. Got '$raw_val' in $LUIEP_FILE."
    ERRORS=$((ERRORS + 1))
  elif ! printf '%s' "$val" | grep -qE "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"; then
    echo "   ❌ cs2_sign_off: '$val' (MUST be a YYYY-MM-DD date)"
    echo "::error::LUIEP Gate FAIL: 'cs2_sign_off' must be in YYYY-MM-DD format, got '$val' in $LUIEP_FILE."
    ERRORS=$((ERRORS + 1))
  else
    echo "   ✅ cs2_sign_off: $val"
  fi
else
  echo "   ❌ Field MISSING: cs2_sign_off"
  echo "::error::LUIEP Gate FAIL: Required field 'cs2_sign_off' not found in $LUIEP_FILE."
  ERRORS=$((ERRORS + 1))
fi

# --- Field 9: evidence_pack_version ---
check_field_present "evidence_pack_version" "$LUIEP_FILE"

# --- Field 10: evidence_pack_date ---
check_field_present "evidence_pack_date" "$LUIEP_FILE"

echo ""

# ============================================================
# STEP 6: Route inventory and per-route screenshot validation
# (Rule U-006)
# ============================================================
echo "── STEP 6: Route inventory coverage (Rule U-006) ──"

REQUIRED_ROUTES=(
  '"/"'
  '"/login"'
  '"/signup"'
  '"/forgot-password"'
  '"/reset-password"'
  '"/onboarding"'
  '"/dashboard"'
  '"/frameworks"'
  '"/frameworks/upload"'
)

# Check route_inventory section is present
if grep -q "route_inventory:" "$LUIEP_FILE" 2>/dev/null; then
  echo "   ✅ route_inventory section present"
else
  echo "   ❌ route_inventory section MISSING"
  echo "::error::LUIEP Gate FAIL: 'route_inventory' section not found in $LUIEP_FILE. Rule U-006 requires all app routes to be inventoried with per-route screenshot references."
  ERRORS=$((ERRORS + 1))
fi

# Check each required route is listed in the file
for route in "${REQUIRED_ROUTES[@]}"; do
  # Match route as YAML value — allows both single- and double-quote delimiters
  # Route value is already quoted in REQUIRED_ROUTES, e.g. '"/"', so strip quotes for pattern
  route_path=$(printf '%s' "$route" | tr -d '"'"'")
  if grep -qE "route:[[:space:]]*['\"]?${route_path//\//\\/}['\"]?" "$LUIEP_FILE" 2>/dev/null; then
    echo "   ✅ Route in inventory: $route_path"
  else
    echo "   ❌ Required route MISSING from inventory: $route_path"
    echo "::error::LUIEP Gate FAIL: Required route '$route_path' not found in route_inventory in $LUIEP_FILE. Rule U-006."
    ERRORS=$((ERRORS + 1))
  fi
done

# Check per-route screenshot coverage — count non-PENDING screenshot_ref entries
REQUIRED_ROUTE_COUNT=${#REQUIRED_ROUTES[@]}
SCREENSHOT_COUNT=$(grep "screenshot_ref:" "$LUIEP_FILE" 2>/dev/null \
  | grep -v -i "pending" | wc -l | tr -d '[:space:]' || echo "0")
if ! [[ "$SCREENSHOT_COUNT" =~ ^[0-9]+$ ]]; then SCREENSHOT_COUNT=0; fi
if [ "$SCREENSHOT_COUNT" -ge "$REQUIRED_ROUTE_COUNT" ]; then
  echo "   ✅ Per-route screenshots: $SCREENSHOT_COUNT confirmed (≥ $REQUIRED_ROUTE_COUNT required)"
else
  echo "   ❌ Per-route screenshots: $SCREENSHOT_COUNT confirmed, $REQUIRED_ROUTE_COUNT required (one per route)"
  echo "::error::LUIEP Gate FAIL: Per-route screenshot coverage insufficient — $SCREENSHOT_COUNT non-PENDING 'screenshot_ref' entries found, $REQUIRED_ROUTE_COUNT required (one per required route). Rule U-006."
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================================
# STEP 7: Network/API evidence validation (Rule U-007)
# ============================================================
echo "── STEP 7: Network/API evidence (Rule U-007) ──"

if grep -q "network_api_evidence:" "$LUIEP_FILE" 2>/dev/null; then
  # Check at least one non-PENDING endpoint entry exists
  API_ENTRY_COUNT=$(grep "endpoint:" "$LUIEP_FILE" 2>/dev/null \
    | grep -v -i "pending" | wc -l | tr -d '[:space:]' || echo "0")
  if ! [[ "$API_ENTRY_COUNT" =~ ^[0-9]+$ ]]; then API_ENTRY_COUNT=0; fi
  if [ "$API_ENTRY_COUNT" -gt 0 ]; then
    echo "   ✅ network_api_evidence: $API_ENTRY_COUNT confirmed endpoint(s)"
  else
    echo "   ❌ network_api_evidence: all endpoints are PENDING (no confirmed API evidence)"
    echo "::error::LUIEP Gate FAIL: 'network_api_evidence' section has no confirmed (non-PENDING) endpoint entries in $LUIEP_FILE. Rule U-007 requires network/API evidence with status codes and backend URLs."
    ERRORS=$((ERRORS + 1))
  fi
  # Check at least one non-PENDING status_code entry
  STATUS_COUNT=$(grep "status_code:" "$LUIEP_FILE" 2>/dev/null \
    | grep -v -i "pending" | wc -l | tr -d '[:space:]' || echo "0")
  if ! [[ "$STATUS_COUNT" =~ ^[0-9]+$ ]]; then STATUS_COUNT=0; fi
  if [ "$STATUS_COUNT" -gt 0 ]; then
    echo "   ✅ network_api_evidence: $STATUS_COUNT confirmed status_code(s)"
  else
    echo "   ❌ network_api_evidence: no confirmed status_code entries (all PENDING)"
    echo "::error::LUIEP Gate FAIL: 'status_code' fields in network_api_evidence are all PENDING in $LUIEP_FILE. Rule U-007 requires confirmed HTTP status codes for each API endpoint."
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ❌ network_api_evidence section MISSING"
  echo "::error::LUIEP Gate FAIL: 'network_api_evidence' section not found in $LUIEP_FILE. Rule U-007 requires network/API evidence with status codes and backend URLs."
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================================
# STEP 8: Operational status matrix validation (Rule U-008)
# ============================================================
echo "── STEP 8: Operational status matrix (Rule U-008) ──"

if ! grep -q "operational_status_matrix:" "$LUIEP_FILE" 2>/dev/null; then
  echo "   ❌ operational_status_matrix section MISSING"
  echo "::error::LUIEP Gate FAIL: 'operational_status_matrix' section not found in $LUIEP_FILE. Rule U-008 requires an operational status matrix covering all required routes."
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ operational_status_matrix section present"

  # Extract the operational_status_matrix section to a temp file for isolated validation
  MATRIX_TMPFILE=$(mktemp)
  python3 -c "
import re, sys
try:
    content = open(sys.argv[1]).read()
    m = re.search(r'^operational_status_matrix:.*?(?=^[a-zA-Z_]|\Z)', content, re.MULTILINE | re.DOTALL)
    print(m.group(0) if m else '')
except Exception:
    pass
" "$LUIEP_FILE" > "$MATRIX_TMPFILE" 2>/dev/null

  # Check all 9 required routes are present in the matrix
  for route in "${REQUIRED_ROUTES[@]}"; do
    route_path=$(printf '%s' "$route" | tr -d '"'"'")
    if grep -qE "route:[[:space:]]*['\"]?${route_path//\//\\/}['\"]?" "$MATRIX_TMPFILE" 2>/dev/null; then
      echo "   ✅ Matrix row for route: $route_path"
    else
      echo "   ❌ Matrix row MISSING for route: $route_path"
      echo "::error::LUIEP Gate FAIL: Required route '$route_path' not found in operational_status_matrix in $LUIEP_FILE. Rule U-008."
      ERRORS=$((ERRORS + 1))
    fi
  done

  # Check expected_behavior: present in matrix (one per route)
  EB_COUNT=$(grep -c "expected_behavior:" "$MATRIX_TMPFILE" 2>/dev/null | tr -d '[:space:]' || echo "0")
  [[ "$EB_COUNT" =~ ^[0-9]+$ ]] || EB_COUNT=0
  if [ "$EB_COUNT" -ge "$REQUIRED_ROUTE_COUNT" ]; then
    echo "   ✅ expected_behavior: $EB_COUNT entries (≥ $REQUIRED_ROUTE_COUNT required)"
  else
    echo "   ❌ expected_behavior: $EB_COUNT entries, $REQUIRED_ROUTE_COUNT required (one per route)"
    echo "::error::LUIEP Gate FAIL: 'expected_behavior' entries insufficient in operational_status_matrix ($EB_COUNT found, $REQUIRED_ROUTE_COUNT required). Rule U-008."
    ERRORS=$((ERRORS + 1))
  fi

  # Check observed_behavior: present in matrix (one per route)
  OB_COUNT=$(grep -c "observed_behavior:" "$MATRIX_TMPFILE" 2>/dev/null | tr -d '[:space:]' || echo "0")
  [[ "$OB_COUNT" =~ ^[0-9]+$ ]] || OB_COUNT=0
  if [ "$OB_COUNT" -ge "$REQUIRED_ROUTE_COUNT" ]; then
    echo "   ✅ observed_behavior: $OB_COUNT entries (≥ $REQUIRED_ROUTE_COUNT required)"
  else
    echo "   ❌ observed_behavior: $OB_COUNT entries, $REQUIRED_ROUTE_COUNT required (one per route)"
    echo "::error::LUIEP Gate FAIL: 'observed_behavior' entries insufficient in operational_status_matrix ($OB_COUNT found, $REQUIRED_ROUTE_COUNT required). Rule U-008."
    ERRORS=$((ERRORS + 1))
  fi

  # Check pass_fail: entries with valid PASS or FAIL values (one per route)
  PF_COUNT=$(grep "pass_fail:" "$MATRIX_TMPFILE" 2>/dev/null | grep -cE "[\"']?(PASS|FAIL)[\"']?" | tr -d '[:space:]' || echo "0")
  [[ "$PF_COUNT" =~ ^[0-9]+$ ]] || PF_COUNT=0
  if [ "$PF_COUNT" -ge "$REQUIRED_ROUTE_COUNT" ]; then
    echo "   ✅ pass_fail (PASS/FAIL): $PF_COUNT entries (≥ $REQUIRED_ROUTE_COUNT required)"
  else
    echo "   ❌ pass_fail: $PF_COUNT valid PASS/FAIL entries, $REQUIRED_ROUTE_COUNT required (one per route)"
    echo "::error::LUIEP Gate FAIL: 'pass_fail' entries with PASS or FAIL values insufficient in operational_status_matrix ($PF_COUNT found, $REQUIRED_ROUTE_COUNT required). Rule U-008."
    ERRORS=$((ERRORS + 1))
  fi

  # Check screenshot_ref: present and non-PENDING in matrix (one per route)
  MATRIX_SS_COUNT=$(grep "screenshot_ref:" "$MATRIX_TMPFILE" 2>/dev/null \
    | grep -v -i "pending" | wc -l | tr -d '[:space:]' || echo "0")
  [[ "$MATRIX_SS_COUNT" =~ ^[0-9]+$ ]] || MATRIX_SS_COUNT=0
  if [ "$MATRIX_SS_COUNT" -ge "$REQUIRED_ROUTE_COUNT" ]; then
    echo "   ✅ screenshot_ref (matrix): $MATRIX_SS_COUNT confirmed (≥ $REQUIRED_ROUTE_COUNT required)"
  else
    echo "   ❌ screenshot_ref (matrix): $MATRIX_SS_COUNT confirmed, $REQUIRED_ROUTE_COUNT required (one per route)"
    echo "::error::LUIEP Gate FAIL: 'screenshot_ref' entries insufficient or PENDING in operational_status_matrix ($MATRIX_SS_COUNT found, $REQUIRED_ROUTE_COUNT required). Rule U-008."
    ERRORS=$((ERRORS + 1))
  fi

  rm -f "$MATRIX_TMPFILE"
fi

echo ""

# ============================================================
# STEP 9: Summary
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -gt 0 ]; then
  echo "  ❌ LUIEP GATE: FAIL — $ERRORS field check(s) failed."
  echo "  See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md for remediation."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
else
  echo "  ✅ LUIEP gate PASS — all required fields and coverage checks confirmed."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi
