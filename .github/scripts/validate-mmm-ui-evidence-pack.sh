#!/bin/bash
# validate-mmm-ui-evidence-pack.sh
# Authority: governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md
# Purpose: CI gate — validates Live UI Evidence Pack (LUIEP) per Rule U-001
#   Step 1: Scan for prohibited completion phrases in agent workspace/admin/ecap dirs
#   Step 2: If no phrase found → PASS (gate not triggered)
#   Step 3: If phrase found → locate LUIEP artifact
#   Step 4: If no artifact → FAIL INC-MMM-LUIEP-MISSING-001
#   Step 5: Validate all 10 required LUIEP fields
#   Step 6: All checks pass → PASS
# Exit codes: 0=PASS, 1=FAIL
set -uo pipefail

ERRORS=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MMM Live UI Evidence Pack Gate (LUIEP)"
echo "  Authority: governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md"
echo "  Version: 1.0.0"
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

# 1b. Check PR_BODY env var if set
if [ -z "$FOUND_PHRASE" ] && [ -n "${PR_BODY:-}" ]; then
  for phrase in "${PROHIBITED_PHRASES[@]}"; do
    if printf '%s' "$PR_BODY" | grep -qiF "$phrase" 2>/dev/null; then
      FOUND_PHRASE="$phrase"
      FOUND_FILE="PR_BODY"
      break
    fi
  done
fi

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

# Search for evidence pack files in modules/MMM/12-phase4-ecap/
if [ -d "modules/MMM/12-phase4-ecap" ]; then
  LUIEP_FILE=$(find "modules/MMM/12-phase4-ecap" -maxdepth 5 -type f \
    \( -name "mmm-ui-evidence-pack-template.md" -o -name "*evidence-pack*.md" \) \
    2>/dev/null | head -1 || true)
fi

# If not found, check PREHANDOVER proof files for luiep_artifact_path or evidence_pack_version
if [ -z "$LUIEP_FILE" ]; then
  PROOF_REF=$(find .agent-admin/prehandover -maxdepth 2 -type f -name "proof-*.md" 2>/dev/null \
    -exec grep -lE "evidence_pack_version:|luiep_artifact_path:" {} \; 2>/dev/null | head -1 || true)
  if [ -n "$PROOF_REF" ]; then
    # Try to extract path from luiep_artifact_path field
    LUIEP_PATH_CITED=$(grep -oE "luiep_artifact_path:\s*.+" "$PROOF_REF" 2>/dev/null | \
      sed 's/luiep_artifact_path:\s*//' | tr -d '[:space:]' | head -1 || true)
    if [ -n "$LUIEP_PATH_CITED" ] && [ -f "$LUIEP_PATH_CITED" ]; then
      LUIEP_FILE="$LUIEP_PATH_CITED"
    fi
  fi
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

# Determine if we need strict e2e check (triggered by L3 or operationally closed)
STRICT_E2E=false
if printf '%s' "$FOUND_PHRASE" | grep -qiE "L3 complete|operationally closed"; then
  STRICT_E2E=true
fi

# --- Field 1: deployment_url ---
check_field_present "deployment_url" "$LUIEP_FILE"

# --- Field 2: deployment_url_confirmed (MUST be YES) ---
if grep -q "deployment_url_confirmed:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "deployment_url_confirmed:" "$LUIEP_FILE" | head -1 | sed 's/.*deployment_url_confirmed:\s*//' | tr -d '[:space:]')
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

# --- Field 3: ui_renders_correctly ---
check_field_present "ui_renders_correctly" "$LUIEP_FILE"

# --- Field 4: auth_flow_confirmed ---
check_field_present "auth_flow_confirmed" "$LUIEP_FILE"

# --- Field 5: e2e_workflow_confirmed (conditionally MUST be YES) ---
if grep -q "e2e_workflow_confirmed:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "e2e_workflow_confirmed:" "$LUIEP_FILE" | head -1 | sed 's/.*e2e_workflow_confirmed:\s*//' | tr -d '[:space:]')
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
  val=$(grep "screenshots_provided:" "$LUIEP_FILE" | head -1 | sed 's/.*screenshots_provided:\s*//' | tr -d '[:space:]')
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

# --- Field 8: cs2_sign_off (MUST NOT be PENDING or empty) ---
if grep -q "cs2_sign_off:" "$LUIEP_FILE" 2>/dev/null; then
  val=$(grep "cs2_sign_off:" "$LUIEP_FILE" | head -1 | sed 's/.*cs2_sign_off:\s*//' | tr -d '[:space:]')
  if [ -z "$val" ] || [ "$val" = "PENDING" ]; then
    echo "   ❌ cs2_sign_off: '$val' (MUST NOT be PENDING or empty)"
    echo "::error::LUIEP Gate FAIL: 'cs2_sign_off' must not be PENDING or empty. Got '$val' in $LUIEP_FILE."
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
# STEP 6: Summary
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -gt 0 ]; then
  echo "  ❌ LUIEP GATE: FAIL — $ERRORS field check(s) failed."
  echo "  See governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md for remediation."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
else
  echo "  ✅ LUIEP gate PASS — all required fields confirmed."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi
