#!/bin/bash
# ECAP / Admin Ceremony Gate
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md
# Purpose: Hard CI gate for protected-path PRs. Classifies changed files and fails
#          when ECAP/admin ceremony is required but absent or unevidenced.
#          IAA PASS on a protected-path PR without ECAP evidence is also rejected.
# Violation class: ECAP-GATE-001
# Issue: maturion-isms#1503

set -euo pipefail

echo "=== ECAP / Admin Ceremony Gate ==="
echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0, EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md"
echo "Violation class: ECAP-GATE-001"
echo ""

# ----------------------------------------------------------------
# Environment variables (set by caller / GitHub Actions workflow)
# ----------------------------------------------------------------
BASE_SHA="${BASE_SHA:-}"
HEAD_SHA="${HEAD_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_LABELS="${PR_LABELS:-}"
ASSURANCE_DIR=".agent-admin/assurance"
PREHANDOVER_DIR=".agent-admin/prehandover"

is_admin_only_path() {
  local file="$1"
  [[ "$file" =~ ^\.admin/ ]] || \
  [[ "$file" =~ ^\.agent-admin/ ]] || \
  [[ "$file" =~ ^\.agent-workspace/.*/bundles/ ]] || \
  [[ "$file" =~ ^\.agent-workspace/.*/memory/(PREHANDOVER-|session-).+\.md$ ]]
}

is_substantive_path() {
  local file="$1"
  [[ "$file" =~ ^\.github/agents/.*\.md$ ]] && return 0
  [[ "$file" =~ ^\.github/scripts/ ]] && return 0
  [[ "$file" =~ ^\.github/workflows/ ]] && return 0
  [[ "$file" =~ ^governance/canon/ ]] && return 0
  [[ "$file" =~ ^governance/checklists/ ]] && return 0
  [[ "$file" =~ ^governance/templates/ ]] && return 0
  [[ "$file" == "governance/CANON_INVENTORY.json" ]] && return 0
  [[ "$file" =~ ^(modules|apps|packages)/[^/]+/src/ ]] && return 0
  [[ "$file" =~ ^(modules|apps|packages)/[^/]+/tests?/ ]] && return 0
  [[ "$file" =~ ^supabase/functions/ ]] && return 0
  [[ "$file" =~ ^supabase/migrations/ ]] && return 0
  is_admin_only_path "$file" && return 1
  return 1
}

resolve_substantive_head_sha() {
  local base_sha="$1"
  local head_sha="$2"
  local commit changed_files file

  while IFS= read -r commit; do
    [ -z "$commit" ] && continue
    changed_files="$(git diff-tree --no-commit-id --name-only -r "$commit" 2>/dev/null || true)"
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      if is_substantive_path "$file"; then
        echo "$commit"
        return 0
      fi
    done <<< "$changed_files"
  done < <(git rev-list "${base_sha}..${head_sha}" 2>/dev/null || true)

  echo "$head_sha"
}

is_symbolic_runtime_head_marker() {
  local value
  value="$(echo "$1" | tr '[:lower:]' '[:upper:]')"
  [[ "$value" == "ACTIVE_HEAD_RESOLVED_BY_GATE" || "$value" == "CURRENT_HEAD" || "$value" == "GITHUB_PR_HEAD_SHA" || "$value" == "CURRENT" || "$value" == "HEAD" ]]
}

is_literal_commit_sha() {
  local value="$1"
  [[ "$value" =~ ^[0-9a-fA-F]{7,40}$ ]] || return 1
  git rev-parse --verify "${value}^{commit}" >/dev/null 2>&1
}

sha_matches() {
  local a="$1"
  local b="$2"
  [[ -z "$a" || -z "$b" ]] && return 1
  is_literal_commit_sha "$a" || return 1
  is_literal_commit_sha "$b" || return 1
  [[ "$a" == "$b" || "$a" == "${b:0:${#a}}" || "$b" == "${a:0:${#b}}" ]]
}

# ----------------------------------------------------------------
# CS2 sign-off bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"CS sign-off: approved"* ]]; then
  echo "✅ PASS — PR carries 'CS sign-off: approved' label."
  echo "   ECAP/admin ceremony gate waived per CS2 supreme authority."
  exit 0
fi

# ----------------------------------------------------------------
# Automated governance PR bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"governance"* ]] && \
   [[ "$PR_LABELS" == *"automated"* ]] && \
   [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  echo "✅ PASS — Automated governance alignment PR — ECAP gate bypassed."
  exit 0
fi

# ----------------------------------------------------------------
# MMM Simple PR Admin Model bypass — requires_ecap: false
# Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0
# When the active manifest declares requires_ecap: false,
# the ECAP/admin ceremony gate is waived. Stronger controls are
# preserved: governance-change and agent-contract-change types are
# forced to requires_ecap: true by validate-simple-pr-admin.sh.
# Manifest resolution: per-PR (.admin/prs/pr-N.json) preferred,
# legacy (.admin/pr.json) used as fallback during migration.
# ----------------------------------------------------------------
ADMIN_MANIFEST=""
if [ -n "${PR_NUMBER:-}" ] && [ -f ".admin/prs/pr-${PR_NUMBER}.json" ]; then
  ADMIN_MANIFEST=".admin/prs/pr-${PR_NUMBER}.json"
elif [ -f ".admin/pr.json" ]; then
  ADMIN_MANIFEST=".admin/pr.json"
fi
if [ -n "$ADMIN_MANIFEST" ] && command -v python3 >/dev/null 2>&1; then
  ADMIN_REQUIRES_ECAP=$(python3 -c "
import json, sys
try:
    m = json.load(open('${ADMIN_MANIFEST}'))
    v = m.get('requires_ecap')
    print('false' if v is False else 'true')
except Exception:
    print('invalid')
" 2>/dev/null || echo "invalid")
  if [ "$ADMIN_REQUIRES_ECAP" = "false" ]; then
    echo "✅ PASS — ${ADMIN_MANIFEST} declares requires_ecap: false."
    echo "   ECAP/admin ceremony gate waived per MMM Simple PR Admin Model."
    echo "   Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §CI gate integration"
    exit 0
  fi
fi

# ----------------------------------------------------------------
# Require BASE_SHA
# ----------------------------------------------------------------
if [ -z "$BASE_SHA" ]; then
  echo "❌ ERROR: BASE_SHA env var not set. This gate requires the PR base SHA."
  exit 1
fi

echo "PR Number: ${PR_NUMBER:-<not provided>}"
echo "HEAD SHA : ${HEAD_SHA:0:12}..."
echo ""

# ----------------------------------------------------------------
# Step 1: Classify changed files — detect protected paths
# ----------------------------------------------------------------
echo "--- Step 1: Protected Path Classification ---"
echo ""

# Protected-path categories that require ECAP/admin ceremony.
# These are governance artifacts that the admin ceremony is designed to protect:
#   - Agent contract files (.github/agents/*.md): require CodexAdvisor + ECAP oversight
#   - Canonical governance documents (governance/canon/**): require ECAP QC-001
#   - Governance checklists (governance/checklists/**): require ECAP review
#   - Governance templates (governance/templates/**): require ECAP review
#   - Canon inventory (governance/CANON_INVENTORY.json): requires ECAP review
#
# NOT protected paths (governance tooling, not ceremony artifacts):
#   - .github/workflows/*.yml: CI workflow additions/changes are governance tooling PRs;
#     they follow normal CS2 review rather than agent wave ceremony.
#   - .github/scripts/*.sh: governance helper scripts — same rationale as workflows.

AGENT_CONTRACT_CHANGED=false   # .github/agents/*.md
CANON_DOC_CHANGED=false        # governance/canon/**
CHECKLIST_CHANGED=false        # governance/checklists/**
TEMPLATE_CHANGED=false         # governance/templates/**
CANON_INVENTORY_CHANGED=false  # governance/CANON_INVENTORY.json

PROTECTED_FILES_LIST=""
UNPROTECTED_FILES_LIST=""
PROTECTED_PATH_TOUCHED=false

CHANGED_FILES=$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || \
                git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null || true)

if [ -z "$CHANGED_FILES" ]; then
  echo "ℹ️  No changed files detected — ECAP gate: not applicable."
  exit 0
fi

while IFS= read -r file; do
  [ -z "$file" ] && continue

  IS_PROTECTED=false

  if [[ "$file" =~ ^\.github/agents/.*\.md$ ]]; then
    AGENT_CONTRACT_CHANGED=true
    IS_PROTECTED=true
    PROTECTED_FILES_LIST="${PROTECTED_FILES_LIST}\n  [AGENT-CONTRACT] ${file}"
  elif [[ "$file" =~ ^governance/canon/ ]]; then
    CANON_DOC_CHANGED=true
    IS_PROTECTED=true
    PROTECTED_FILES_LIST="${PROTECTED_FILES_LIST}\n  [CANON-DOC] ${file}"
  elif [[ "$file" =~ ^governance/checklists/ ]]; then
    CHECKLIST_CHANGED=true
    IS_PROTECTED=true
    PROTECTED_FILES_LIST="${PROTECTED_FILES_LIST}\n  [CHECKLIST] ${file}"
  elif [[ "$file" =~ ^governance/templates/ ]]; then
    TEMPLATE_CHANGED=true
    IS_PROTECTED=true
    PROTECTED_FILES_LIST="${PROTECTED_FILES_LIST}\n  [TEMPLATE] ${file}"
  elif [[ "$file" == "governance/CANON_INVENTORY.json" ]]; then
    CANON_INVENTORY_CHANGED=true
    IS_PROTECTED=true
    PROTECTED_FILES_LIST="${PROTECTED_FILES_LIST}\n  [CANON-INVENTORY] ${file}"
  fi

  if [ "$IS_PROTECTED" = true ]; then
    PROTECTED_PATH_TOUCHED=true
  else
    UNPROTECTED_FILES_LIST="${UNPROTECTED_FILES_LIST}\n  - ${file}"
  fi

done <<< "$CHANGED_FILES"

if [ -n "$PROTECTED_FILES_LIST" ]; then
  echo "Protected-path files changed:"
  echo -e "$PROTECTED_FILES_LIST"
  echo ""
fi
if [ -n "$UNPROTECTED_FILES_LIST" ]; then
  echo "Other files changed (not protected-path):"
  echo -e "$UNPROTECTED_FILES_LIST"
  echo ""
fi

if [ "$PROTECTED_PATH_TOUCHED" = false ]; then
  echo "ℹ️  No protected paths changed — ECAP/admin ceremony gate: not required."
  exit 0
fi

echo "⚠️  Protected paths touched — ECAP/admin ceremony evidence REQUIRED."
echo ""
echo "Protected path categories:"
[ "$AGENT_CONTRACT_CHANGED" = true ]   && echo "  [AGENT-CONTRACT]   .github/agents/*.md — agent contract changes"
[ "$CANON_DOC_CHANGED" = true ]        && echo "  [CANON-DOC]        governance/canon/** — canonical governance documents"
[ "$CHECKLIST_CHANGED" = true ]        && echo "  [CHECKLIST]        governance/checklists/** — governance checklists"
[ "$TEMPLATE_CHANGED" = true ]         && echo "  [TEMPLATE]         governance/templates/** — governance templates"
[ "$CANON_INVENTORY_CHANGED" = true ]  && echo "  [CANON-INVENTORY]  governance/CANON_INVENTORY.json — canon inventory"
echo ""

SUBSTANTIVE_HEAD_SHA="$(resolve_substantive_head_sha "$BASE_SHA" "${HEAD_SHA:-HEAD}")"
echo "Runtime head SHA    : ${HEAD_SHA:0:12}"
echo "Substantive head SHA: ${SUBSTANTIVE_HEAD_SHA:0:12}"
echo ""

# ----------------------------------------------------------------
# Step 2: Locate ECAP evidence artifacts introduced by this PR
# ----------------------------------------------------------------
echo "--- Step 2: ECAP Evidence Search ---"
echo ""

# Find PREHANDOVER proof files new/modified by this PR
PREHANDOVER_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${PREHANDOVER_DIR}/proof-.*\.md$" || true)

# Also check foreman session PREHANDOVER files in memory
FOREMAN_PREHANDOVER_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^\.agent-workspace/foreman-v2/memory/PREHANDOVER-.*\.md$" || true)

# Check ECAP bundles committed by this PR
ECAP_BUNDLES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^\.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-.*\.md$" || true)

# Only PREHANDOVER proof files should be validated for PREHANDOVER ECAP YAML fields.
ALL_PROOF_FILES="${PREHANDOVER_IN_PR}"$'\n'"${FOREMAN_PREHANDOVER_IN_PR}"
# Deduplicate and remove empty lines
ALL_PROOF_FILES=$(echo "$ALL_PROOF_FILES" | sort -u | grep -v '^[[:space:]]*$' || true)

# Track ECAP bundles separately because they are additional evidence artifacts
# and may not contain the same YAML fields as PREHANDOVER proof files.
ECAP_BUNDLE_FILES=$(echo "$ECAP_BUNDLES_IN_PR" | sort -u | grep -v '^[[:space:]]*$' || true)

PROOF_COUNT=0
if [ -n "$ALL_PROOF_FILES" ]; then
  PROOF_COUNT=$(echo "$ALL_PROOF_FILES" | wc -l | tr -d ' ')
fi
echo "PREHANDOVER proof files in this PR: ${PROOF_COUNT}"
if [ "${PROOF_COUNT}" -gt 0 ] && [ -n "$ALL_PROOF_FILES" ]; then
  echo "$ALL_PROOF_FILES" | while IFS= read -r f; do [ -n "$f" ] && echo "  - $f"; done
fi

ECAP_BUNDLE_COUNT=0
if [ -n "$ECAP_BUNDLE_FILES" ]; then
  ECAP_BUNDLE_COUNT=$(echo "$ECAP_BUNDLE_FILES" | wc -l | tr -d ' ')
fi
echo "ECAP bundle files in this PR: ${ECAP_BUNDLE_COUNT}"
if [ "${ECAP_BUNDLE_COUNT}" -gt 0 ] && [ -n "$ECAP_BUNDLE_FILES" ]; then
  echo "$ECAP_BUNDLE_FILES" | while IFS= read -r f; do [ -n "$f" ] && echo "  - $f"; done
fi
echo ""

# ----------------------------------------------------------------
# Step 3: Validate ECAP evidence fields
# ----------------------------------------------------------------
echo "--- Step 3: ECAP Evidence Validation ---"
echo ""

ECAP_EVIDENCE_FOUND=false
ECAP_WAIVER_FOUND=false
FAIL=false
FAIL_REASONS=""

if [ "${PROOF_COUNT}" -eq 0 ] || [ -z "$ALL_PROOF_FILES" ]; then
  echo "❌ No PREHANDOVER proof or ECAP bundle files found in this PR"
  FAIL=true
  FAIL_REASONS="${FAIL_REASONS}\n  - No PREHANDOVER proof with ECAP evidence found (protected paths were changed)"
else
  while IFS= read -r proof_file; do
    [ -z "$proof_file" ] && continue
    [ ! -f "$proof_file" ] && continue

    echo "Checking proof file: $proof_file"

    # ── Check for CS2 waiver ────────────────────────────────────────────────
    WAIVER_VALUE=$(grep -iE "^[[:space:]]*ecap_waiver_ref:" "$proof_file" 2>/dev/null | head -1 | \
      sed 's/.*ecap_waiver_ref://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
    if [ -n "$WAIVER_VALUE" ] && \
       ! echo "$WAIVER_VALUE" | grep -qiE "^N/A$|^none$|^-$|^\[\]$"; then
      echo "  ✅ CS2 waiver found: ecap_waiver_ref = $WAIVER_VALUE"
      ECAP_WAIVER_FOUND=true
      ECAP_EVIDENCE_FOUND=true
      continue
    fi

    # ── Check protected_path_touched ────────────────────────────────────────
    PPATH_VALUE=$(grep -iE "^[[:space:]]*protected_path_touched:" "$proof_file" 2>/dev/null | \
      head -1 | sed 's/.*protected_path_touched://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

    # ── Check ecap_required ─────────────────────────────────────────────────
    ECAP_REQ_VALUE=$(grep -iE "^[[:space:]]*ecap_required:" "$proof_file" 2>/dev/null | head -1 | \
      sed 's/.*ecap_required://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

    # ── Check ecap_invoked ──────────────────────────────────────────────────
    ECAP_INV_VALUE=$(grep -iE "^[[:space:]]*ecap_invoked:" "$proof_file" 2>/dev/null | head -1 | \
      sed 's/.*ecap_invoked://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

    # ── Check ceremony_admin_appointed ─────────────────────────────────────
    CEREMONY_VALUE=$(grep -iE "^[[:space:]]*ceremony_admin_appointed:" "$proof_file" 2>/dev/null | \
      head -1 | sed 's/.*ceremony_admin_appointed://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

    # ── Check ecap_verdict ──────────────────────────────────────────────────
    ECAP_VERD_VALUE=$(grep -iE "^[[:space:]]*ecap_verdict:" "$proof_file" 2>/dev/null | head -1 | \
      sed 's/.*ecap_verdict://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

    echo "  protected_path_touched  : ${PPATH_VALUE:-<not set>}"
    echo "  ecap_required           : ${ECAP_REQ_VALUE:-<not set>}"
    echo "  ecap_invoked            : ${ECAP_INV_VALUE:-<not set>}"
    echo "  ceremony_admin_appointed: ${CEREMONY_VALUE:-<not set>}"
    echo "  ecap_verdict            : ${ECAP_VERD_VALUE:-<not set>}"

    # ── Anti-self-certification: reject N/A claims without justification ────
    for field_name in "ecap_required" "ecap_invoked" "ecap_verdict"; do
      field_val=""
      case "$field_name" in
        ecap_required) field_val="$ECAP_REQ_VALUE" ;;
        ecap_invoked)  field_val="$ECAP_INV_VALUE" ;;
        ecap_verdict)  field_val="$ECAP_VERD_VALUE" ;;
      esac
      if echo "$field_val" | grep -qiE "^N/A$"; then
        echo "  ❌ ${field_name}: N/A is not an acceptable value when protected paths are touched [ECAP-GATE-002]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ${field_name} = N/A (must be explicit true/false/PASS)"
        FAIL=true
      fi
    done

    # ── Case A: ecap_required explicitly false with ceremony_admin_appointed NO ─
    if echo "$ECAP_REQ_VALUE" | grep -qiE "^false$|^no$|^NO$" || \
       echo "$CEREMONY_VALUE" | grep -qiE "^NO$|^false$|^not required$|^not applicable$"; then
      # ECAP not required — check this is not contradicted by protected path evidence
      # The gate already confirmed protected paths were touched, so explicit false/NO
      # must be supported by a CS2 waiver or IAA pre-brief justification.
      # Without a waiver, we treat "ecap_required: false" as a self-certified claim
      # and require an explicit waiver reference.
      echo "  ⚠️  ecap_required/ceremony_admin_appointed set to false/NO"
      echo "      Protected paths were touched — this claim requires a populated ecap_waiver_ref"

      ECAP_WAIVER_REF="$(grep -iE '^[[:space:]]*ecap_waiver_ref[[:space:]]*:' "$proof_file" 2>/dev/null | head -n1 | sed -E 's/^[[:space:]]*ecap_waiver_ref[[:space:]]*:[[:space:]]*//; s/[[:space:]]+$//; s/^"(.*)"$/\1/; s/^'\''(.*)'\''$/\1/')"
      if [ -n "$ECAP_WAIVER_REF" ] && ! echo "$ECAP_WAIVER_REF" | grep -qiE '^N/A$'; then
        echo "  ✅ Explicit waiver reference found: $ECAP_WAIVER_REF"
        ECAP_EVIDENCE_FOUND=true
      else
        echo "  ❌ Missing populated ecap_waiver_ref for ecap_required: false on protected-path PR [ECAP-GATE-003]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ecap_required=false/NO but ecap_waiver_ref is missing or empty"
        FAIL=true
      fi
      continue
    fi

    # ── Case B: ecap_invoked true + ecap_verdict PASS — ALSO requires ECAP bundle ─
    if echo "$ECAP_INV_VALUE" | grep -qiE "^true$|^yes$|^YES$" || \
       echo "$CEREMONY_VALUE" | grep -qiE "^true$|^yes$|^execution-ceremony"; then
      IDENTITY_CHECK_MARKER=$(grep -iE "^[[:space:]]*ECAP_IDENTITY_BINDING_CHECK([[:space:]]*|:)" "$proof_file" 2>/dev/null | head -1 || true)
      IDENTITY_ALL_MATCH=$(grep -iE "^[[:space:]]*ALL_MATCH:[[:space:]]*" "$proof_file" 2>/dev/null | head -1 | \
        sed -E 's/^[^:]+:[[:space:]]*//;s/[[:space:]]*$//' || true)
      IDENTITY_RUNTIME_SHA=$(grep -iE "^[[:space:]]*(CURRENT_HEAD_SHA|RUNTIME_HEAD_SHA):[[:space:]]*" "$proof_file" 2>/dev/null | head -1 | \
        sed -E 's/^[^:]+:[[:space:]]*//;s/[[:space:]]*$//' || true)
      IDENTITY_EVIDENCE_SHA=$(grep -iE "^[[:space:]]*EVIDENCE_SUBJECT_SHA:[[:space:]]*" "$proof_file" 2>/dev/null | head -1 | \
        sed -E 's/^[^:]+:[[:space:]]*//;s/[[:space:]]*$//' || true)
      if [ -z "$IDENTITY_EVIDENCE_SHA" ]; then
        IDENTITY_EVIDENCE_SHA=$(grep -iE "^[[:space:]]*(-[[:space:]]*)?\\*\\*(Reviewed SHA|Review SHA|HEAD SHA|Commit SHA)\\*\\*:[[:space:]]*" "$proof_file" 2>/dev/null | head -1 | \
          sed -E 's/.*\\*\\*[^*]*\\*\\*:[[:space:]]*//;s/[[:space:]]*$//' || true)
      fi
      if [ -z "$IDENTITY_EVIDENCE_SHA" ]; then
        IDENTITY_EVIDENCE_SHA=$(grep -iE "^[[:space:]]*(HEAD_SHA|COMMIT_SHA):[[:space:]]*" "$proof_file" 2>/dev/null | head -1 | \
          sed -E 's/^[^:]+:[[:space:]]*//;s/[[:space:]]*$//' || true)
      fi
      if [ -z "$IDENTITY_CHECK_MARKER" ]; then
        echo "  ❌ Missing ECAP_IDENTITY_BINDING_CHECK block [ECAP-GATE-006]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP_IDENTITY_BINDING_CHECK block missing"
        FAIL=true
      elif ! echo "$IDENTITY_ALL_MATCH" | grep -qiE "^yes$"; then
        echo "  ❌ ECAP identity binding ALL_MATCH must be yes [ECAP-GATE-007]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP identity binding ALL_MATCH is not yes"
        FAIL=true
      elif [ -n "$IDENTITY_RUNTIME_SHA" ]; then
        if is_symbolic_runtime_head_marker "$IDENTITY_RUNTIME_SHA"; then
          :
        elif ! is_literal_commit_sha "$IDENTITY_RUNTIME_SHA"; then
          echo "  ❌ ECAP runtime identity SHA is invalid (must be symbolic marker or literal commit SHA) [ECAP-GATE-008]"
          FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: runtime identity SHA (${IDENTITY_RUNTIME_SHA}) is neither approved symbolic marker nor literal commit SHA"
          FAIL=true
        elif ! sha_matches "$IDENTITY_RUNTIME_SHA" "$HEAD_SHA"; then
          echo "  ❌ ECAP runtime identity SHA does not match current runtime head [ECAP-GATE-008]"
          FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: runtime identity SHA ${IDENTITY_RUNTIME_SHA:0:12} does not match runtime HEAD ${HEAD_SHA:0:12}"
          FAIL=true
        fi
      fi

      if [ -z "$IDENTITY_EVIDENCE_SHA" ]; then
        echo "  ❌ ECAP evidence subject SHA missing (literal substantive SHA required) [ECAP-GATE-009]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: missing ECAP evidence subject SHA (EVIDENCE_SUBJECT_SHA/Reviewed SHA/HEAD SHA/Commit SHA)"
        FAIL=true
      elif is_symbolic_runtime_head_marker "$IDENTITY_EVIDENCE_SHA"; then
        echo "  ❌ ECAP evidence subject SHA cannot be a symbolic runtime marker [ECAP-GATE-009]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP evidence subject SHA uses symbolic marker (${IDENTITY_EVIDENCE_SHA}); literal substantive SHA required"
        FAIL=true
      elif ! is_literal_commit_sha "$IDENTITY_EVIDENCE_SHA"; then
        echo "  ❌ ECAP evidence subject SHA is not a valid commit SHA [ECAP-GATE-009]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP evidence subject SHA (${IDENTITY_EVIDENCE_SHA}) is not a valid commit SHA"
        FAIL=true
      elif sha_matches "$IDENTITY_EVIDENCE_SHA" "$SUBSTANTIVE_HEAD_SHA"; then
        :
      elif git merge-base --is-ancestor "$IDENTITY_EVIDENCE_SHA" "$SUBSTANTIVE_HEAD_SHA" 2>/dev/null; then
        echo "  ❌ ECAP evidence subject SHA is stale (substantive changes occurred after review) [ECAP-GATE-009]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP evidence subject SHA ${IDENTITY_EVIDENCE_SHA:0:12} is older than substantive head ${SUBSTANTIVE_HEAD_SHA:0:12}"
        FAIL=true
      else
        echo "  ❌ ECAP evidence subject SHA does not match substantive head [ECAP-GATE-009]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP evidence subject SHA ${IDENTITY_EVIDENCE_SHA:0:12} does not match substantive head ${SUBSTANTIVE_HEAD_SHA:0:12}"
        FAIL=true
      fi
      if echo "$ECAP_VERD_VALUE" | grep -qiE "^PASS$|^pass$|^PASS_WITH_CS2_WAIVER$"; then
        # PREHANDOVER claims ECAP invoked and passed, but a real ECAP bundle artifact
        # must also be committed — PREHANDOVER fields alone are not ceremony evidence.
        if [ -n "$ECAP_BUNDLE_FILES" ]; then
          echo "  ✅ ECAP invoked (verdict PASS) and ECAP bundle artifact committed"
          ECAP_EVIDENCE_FOUND=true
        else
          echo "  ❌ PREHANDOVER claims ecap_invoked=true + ecap_verdict=PASS but no ECAP bundle"
          echo "      artifact committed under .agent-workspace/execution-ceremony-admin-agent/bundles/"
          echo "      PREHANDOVER self-certification fields alone are not accepted evidence. [ECAP-GATE-005]"
          FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ecap_invoked=true/ecap_verdict=PASS but no committed ECAP bundle"
          FAIL=true
        fi
        continue
      elif [ -z "$ECAP_VERD_VALUE" ]; then
        # ecap_invoked but no verdict yet — FAIL
        echo "  ❌ ecap_invoked=true but ecap_verdict missing [ECAP-GATE-004]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ecap_invoked=true but ecap_verdict not recorded"
        FAIL=true
      else
        echo "  ❌ ecap_verdict is not PASS: $ECAP_VERD_VALUE [ECAP-GATE-004]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ecap_verdict = ${ECAP_VERD_VALUE} (expected PASS)"
        FAIL=true
      fi
    elif [ -z "$ECAP_INV_VALUE" ] && [ -z "$CEREMONY_VALUE" ]; then
      # Neither ecap_invoked nor ceremony_admin_appointed set
      echo "  ❌ ECAP evidence fields not recorded (ecap_invoked and ceremony_admin_appointed both absent) [ECAP-GATE-001]"
      FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ecap evidence fields absent (protected paths were changed)"
      FAIL=true
    else
      echo "  ❌ ECAP invocation evidence unclear or incomplete [ECAP-GATE-001]"
      FAIL_REASONS="${FAIL_REASONS}\n  - ${proof_file}: ECAP evidence unclear — ecap_invoked=${ECAP_INV_VALUE:-<unset>}"
      FAIL=true
    fi

    echo ""
  done <<< "$ALL_PROOF_FILES"
fi

# ── Check: IAA must not pass if ECAP required but unevidenced ───────────────
echo ""
echo "--- Step 4: IAA-ECAP Coherence Check ---"
echo ""

# Find IAA token files in this PR
IAA_TOKENS_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-token-.*\.md$" || true)

if [ -n "$IAA_TOKENS_IN_PR" ] && \
   [ "$ECAP_EVIDENCE_FOUND" = false ] && \
   [ "$FAIL" = true ]; then
  # IAA claimed PASS but ECAP evidence is missing
  while IFS= read -r token_file; do
    [ -z "$token_file" ] && continue
    [ ! -f "$token_file" ] && continue

    if ! head -10 "$token_file" 2>/dev/null | grep -qi "REJECTION[-.]PACKAGE"; then
      TOKEN_VALUE=$(grep "PHASE_B_BLOCKING_TOKEN:" "$token_file" 2>/dev/null | head -1 | \
        sed 's/.*PHASE_B_BLOCKING_TOKEN://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
      if [ -n "$TOKEN_VALUE" ] && [ "$TOKEN_VALUE" != "PENDING" ]; then
        echo "⚠️  IAA token found with PASS verdict but ECAP evidence is absent or invalid:"
        echo "   Token: $token_file"
        echo "   This IAA PASS is INVALID — IAA must not approve a protected-path PR"
        echo "   when ECAP/admin ceremony was required but not evidenced. [ECAP-IAA-001]"
        echo ""
        FAIL_REASONS="${FAIL_REASONS}\n  - IAA claims PASS ($token_file) but ECAP evidence absent/invalid on protected-path PR"
        FAIL=true
      fi
    fi
  done <<< "$IAA_TOKENS_IN_PR"
else
  echo "ℹ️  IAA-ECAP coherence: ${ECAP_EVIDENCE_FOUND:-false} ECAP evidence / no conflicting IAA PASS."
fi

# ----------------------------------------------------------------
# Step 5: Verdict
# ----------------------------------------------------------------
echo ""
echo "--- Step 5: Verdict ---"
echo ""

if [ "$FAIL" = true ] && [ "$ECAP_EVIDENCE_FOUND" = false ] && [ "$ECAP_WAIVER_FOUND" = false ]; then
  echo "❌ FAIL — ECAP / Admin Ceremony Gate: BLOCKED"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "🚨 ECAP-GATE-001: PROTECTED-PATH PR WITHOUT ECAP/ADMIN CEREMONY EVIDENCE"
  echo ""
  echo "Protected paths changed:"
  echo -e "$PROTECTED_FILES_LIST"
  echo ""
  echo "Failure reasons:"
  echo -e "$FAIL_REASONS"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "REQUIRED ACTIONS — this PR CANNOT pass governance unless ECAP evidence"
  echo "exists and is committed as part of this PR:"
  echo ""
  echo "STEP 1 — Classify changed paths BEFORE invoking IAA"
  echo "  git diff --name-only \$(git merge-base origin/main HEAD)...HEAD"
  echo "  Identify which of these protected categories are affected:"
  echo "    [AGENT-CONTRACT] .github/agents/*.md"
  echo "    [CANON-DOC]      governance/canon/**"
  echo "    [CHECKLIST]      governance/checklists/**"
  echo "    [TEMPLATE]       governance/templates/**"
  echo "    [CANON-INV]      governance/CANON_INVENTORY.json"
  echo ""
  echo "STEP 2 — Record ECAP fields in PREHANDOVER proof (before IAA invocation)"
  echo "  Add to .agent-admin/prehandover/proof-<slug>.md:"
  echo "    protected_path_touched: true"
  echo "    ecap_required: true"
  echo "    ecap_invoked: <true | false>"
  echo "    ecap_verdict: <PASS | FAIL | N/A-with-justification>"
  echo "    # OR if waived by CS2:"
  echo "    ecap_waiver_ref: <reference to CS2 waiver comment/artifact>"
  echo ""
  echo "STEP 3 — Invoke execution-ceremony-admin-agent (if ecap_required: true)"
  echo "  task(agent_type: 'execution-ceremony-admin-agent')"
  echo "  Provide: changed-file classification, PREHANDOVER draft, scope declaration"
  echo "  ECAP must produce a bundle artifact before IAA final assurance invocation"
  echo ""
  echo "STEP 4 — Update PREHANDOVER proof with ECAP outcome"
  echo "  After ECAP invocation, record in PREHANDOVER proof:"
  echo "    ecap_invoked: true"
  echo "    ecap_verdict: PASS"
  echo "    # OR if waived by CS2:"
  echo "    ecap_waiver_ref: <CS2 waiver reference>"
  echo ""
  echo "STEP 5 — Only then invoke IAA for final assurance"
  echo "  IAA will reject a PR where ECAP was required but not evidenced."
  echo "  Ensure ECAP evidence is committed BEFORE invoking IAA."
  echo ""
  echo "Anti-self-certification rule:"
  echo "  - 'ecap_required: N/A' is NOT acceptable when protected paths are touched"
  echo "  - Foreman PREHANDOVER claims alone are not ECAP evidence"
  echo "  - An IAA PASS token on a protected-path PR without ECAP evidence is invalid"
  echo ""
  echo "CS2 waiver path (exceptional circumstances only):"
  echo "  Request CS2 (@APGI-cmy) to provide an explicit waiver with justification."
  echo "  Record the waiver reference in ecap_waiver_ref field."
  echo ""
  echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md"
  echo "Violation: ECAP-GATE-001 (protected-path PR without ECAP evidence)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 1
elif [ "$FAIL" = true ]; then
  echo "❌ FAIL — ECAP / Admin Ceremony Gate: validation errors found"
  echo ""
  echo "Failure reasons:"
  echo -e "$FAIL_REASONS"
  echo ""
  exit 1
fi

echo "✅ PASS — ECAP / Admin Ceremony Gate passed."
if [ "$ECAP_WAIVER_FOUND" = true ]; then
  echo "   CS2 waiver confirmed — ECAP ceremony requirement waived."
else
  echo "   ECAP/admin ceremony evidence confirmed for protected-path changes."
fi
