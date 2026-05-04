#!/bin/bash
# PR Assurance Lifecycle Determination
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_HANDOVER_AUTOMATION.md
# Purpose: Machine logic that determines the required assurance states for a PR,
#          writes a durable per-PR lifecycle state artifact, and reports the
#          lifecycle state so that downstream gates and label/comment automation
#          can act on it without advisory self-certification.
#
#          This script is the single authoritative source of lifecycle state for
#          a PR.  It does NOT itself block the PR (the individual gate scripts do
#          that) but it:
#            1. Writes .agent-admin/lifecycle/pr-<PR_NUMBER>-assurance-state.json
#            2. Outputs structured lifecycle state to stdout for CI consumers
#            3. Sets GitHub Actions outputs (when GITHUB_OUTPUT is set) so that
#               downstream jobs can read iaa_blocked, ecap_blocked, etc.
#            4. Provides the human-readable lifecycle state report with explicit
#               required-next-action instructions.
#
# Required env vars:
#   BASE_SHA               PR base SHA
#   HEAD_SHA               PR head SHA
#   PR_NUMBER              PR number (integer)
#   PR_LABELS              comma-separated PR labels
#   PR_BODY                PR body text
#   EXPECTED_ISSUE_NUMBER  governing issue number
#
# Violation class: IAA-LIFECYCLE-001
# Issue: maturion-isms#1514

set -euo pipefail

echo "=== PR Assurance Lifecycle Determination ==="
echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0"
echo "Issue: maturion-isms#1514"
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
LIFECYCLE_DIR=".agent-admin/lifecycle"

# ----------------------------------------------------------------
# Helper: set_output <key> <value>
# Writes to GITHUB_OUTPUT if available, or prints to stdout.
# ----------------------------------------------------------------
set_output() {
  local key="$1"
  local value="$2"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    echo "${key}=${value}" >> "$GITHUB_OUTPUT"
  fi
  echo "  [output] ${key}=${value}"
}

# ----------------------------------------------------------------
# CS2 sign-off bypass — write waived artifact before exiting
# ----------------------------------------------------------------
write_waived_artifact() {
  local reason="$1"
  mkdir -p "${LIFECYCLE_DIR}"
  local _pr_num="${PR_NUMBER:-0}"
  local _lf="${LIFECYCLE_DIR}/pr-${_pr_num}-assurance-state.json"
  jq -n \
    --argjson pr "${_pr_num}" \
    --arg head_sha "${HEAD_SHA:-}" \
    --arg reason "$reason" \
    '{
      pr: $pr,
      head_sha: (if $head_sha == "" then null else $head_sha end),
      waived: true,
      waiver_reason: $reason,
      iaa_required: false,
      iaa_invoked: false,
      ecap_required: false,
      ecap_invoked: false,
      handover_allowed: true,
      merge_ready_allowed: true
    }' > "$_lf"
  echo "Lifecycle artifact written (waived): ${_lf}"
}

if [[ "$PR_LABELS" == *"CS sign-off: approved"* ]]; then
  echo "✅ PR carries 'CS sign-off: approved' — lifecycle determination: waived."
  write_waived_artifact "CS sign-off: approved"
  set_output "iaa_required"        "false"
  set_output "iaa_invoked"         "false"
  set_output "iaa_blocked"         "false"
  set_output "ecap_required"       "false"
  set_output "ecap_invoked"        "false"
  set_output "ecap_blocked"        "false"
  set_output "handover_allowed"    "true"
  set_output "merge_ready_allowed" "true"
  set_output "lifecycle_status"    "assurance-ready"
  exit 0
fi

# ----------------------------------------------------------------
# Automated governance PR bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"governance"* ]] && \
   [[ "$PR_LABELS" == *"automated"* ]] && \
   [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  echo "✅ Automated governance alignment PR — lifecycle determination: waived."
  write_waived_artifact "automated governance alignment PR"
  set_output "iaa_required"        "false"
  set_output "iaa_invoked"         "false"
  set_output "iaa_blocked"         "false"
  set_output "ecap_required"       "false"
  set_output "ecap_invoked"        "false"
  set_output "ecap_blocked"        "false"
  set_output "handover_allowed"    "true"
  set_output "merge_ready_allowed" "true"
  set_output "lifecycle_status"    "assurance-ready"
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
echo "Issue Number : ${EXPECTED_ISSUE_NUMBER:-<not provided>}"
echo ""

# ----------------------------------------------------------------
# Helper: is_impl_file <file>
# Returns 0 if the file is an implementation/assurance-control file
# that requires IAA; returns 1 otherwise.
# Used both in the Step 1 classifier and in post-review delta checking.
# ----------------------------------------------------------------
is_impl_file() {
  local f="$1"
  # Exclude agent workspace / admin evidence artifacts
  [[ "$f" =~ ^\.agent-workspace/ ]] && return 1
  [[ "$f" =~ ^\.agent-admin/ ]] && return 1
  # Exclude markdown docs, governance prose, PREHANDOVER proofs
  [[ "$f" =~ \.md$ ]] && return 1
  # Assurance-control files: include
  [[ "$f" =~ ^\.github/scripts/.*assurance.*\.sh$ ]] && return 0
  [[ "$f" =~ ^\.github/scripts/.*iaa.*\.sh$ ]] && return 0
  [[ "$f" =~ ^\.github/scripts/.*ecap.*\.sh$ ]] && return 0
  [[ "$f" =~ ^\.github/scripts/.*merge-ready.*\.sh$ ]] && return 0
  [[ "$f" == ".github/workflows/preflight-evidence-gate.yml" ]] && return 0
  [[ "$f" == ".github/workflows/iaa-prebrief-inject.yml" ]] && return 0
  # Exclude all other .github/ tooling
  [[ "$f" =~ ^\.github/ ]] && return 1
  # Exclude governance / SCOPE_DECLARATION
  [[ "$f" =~ ^governance/ ]] && return 1
  [[ "$f" =~ ^SCOPE_DECLARATION ]] && return 1
  # Implementation patterns
  [[ "$f" =~ ^(modules|apps|packages)/[^/]+/src/ ]] && return 0
  [[ "$f" =~ ^(modules|apps|packages)/[^/]+/tests?/ ]] && return 0
  [[ "$f" =~ ^supabase/functions/ ]] && return 0
  [[ "$f" =~ ^supabase/migrations/ ]] && return 0
  [[ "$f" =~ \.(ts|tsx|js|jsx|py|sql)$ ]] && return 0
  return 1
}

# ----------------------------------------------------------------
# Helper: check_delta_assurance_valid <prior_sha> <current_sha>
# Returns 0 if a committed delta-assurance block binds prior_sha →
# <da_current_sha> as non-substantive, where <da_current_sha> is an
# ancestor of current_sha and no implementation files were changed
# between <da_current_sha> and current_sha (i.e. only evidence/doc
# commits occurred after the delta-assurance was written).
# ----------------------------------------------------------------
check_delta_assurance_valid() {
  local prior_sha="$1"
  local current_sha="$2"
  while IFS= read -r df; do
    [ -z "$df" ] && continue
    [ ! -f "$df" ] && continue
    grep -qi "prior_reviewed_sha:[[:space:]]\+${prior_sha}" "$df" 2>/dev/null || continue
    grep -qi "delta_classification:[[:space:]]\+non-substantive" "$df" 2>/dev/null || continue

    # Extract the current_head_sha the delta-assurance block was written against
    local da_current_sha
    da_current_sha=$(grep -i "current_head_sha:" "$df" 2>/dev/null | head -1 | \
      grep -oE '[0-9a-fA-F]{7,40}' | head -1 || true)
    [ -z "$da_current_sha" ] && continue
    # da_current_sha must be reachable from (ancestor of or equal to) current HEAD_SHA
    git rev-parse --verify "${da_current_sha}^{commit}" >/dev/null 2>&1 || continue
    git merge-base --is-ancestor "$da_current_sha" "$current_sha" >/dev/null 2>&1 || continue

    # After da_current_sha up to current HEAD_SHA, only non-implementation files may change
    # (e.g. the delta-assurance artifact itself — which is in .agent-admin/ and is excluded)
    if [ "$da_current_sha" != "$current_sha" ]; then
      local da_post_impl=false
      local da_pf
      while IFS= read -r da_pf; do
        [ -z "$da_pf" ] && continue
        is_impl_file "$da_pf" && { da_post_impl=true; break; }
      done <<< "$(git diff "$da_current_sha" "$current_sha" --name-only 2>/dev/null || true)"
      [ "$da_post_impl" = true ] && continue
    fi

    echo "  ✅ Delta-assurance block covers gap ${prior_sha:0:12}→${current_sha:0:12}: $df"
    return 0
  done <<< "${DELTA_ASSURANCE_FILES_IN_PR:-}"
  return 1
}

# ----------------------------------------------------------------
# Step 1: Classify changed files
# ----------------------------------------------------------------
echo "--- Step 1: File Classification ---"
echo ""

CHANGED_FILES=$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || \
                git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null || true)

IMPLEMENTATION_CHANGED=false
PROTECTED_PATH_TOUCHED=false
IMPL_FILE_LIST=""
PROTECTED_FILE_LIST=""

while IFS= read -r file; do
  [ -z "$file" ] && continue

  if is_impl_file "$file"; then
    # Distinguish assurance-control files for display
    if [[ "$file" =~ ^\.github/ ]]; then
      IMPL_FILE_LIST="${IMPL_FILE_LIST}\n  - ${file} [assurance-control]"
    else
      IMPL_FILE_LIST="${IMPL_FILE_LIST}\n  - ${file}"
    fi
    IMPLEMENTATION_CHANGED=true
    continue
  fi

  # Protected path classification (kept inline for protected-path detection)
  if [[ "$file" =~ ^\.github/agents/.*\.md$ ]]; then
    PROTECTED_PATH_TOUCHED=true
    PROTECTED_FILE_LIST="${PROTECTED_FILE_LIST}\n  [AGENT-CONTRACT] ${file}"
  elif [[ "$file" =~ ^governance/canon/ ]]; then
    PROTECTED_PATH_TOUCHED=true
    PROTECTED_FILE_LIST="${PROTECTED_FILE_LIST}\n  [CANON-DOC] ${file}"
  elif [[ "$file" =~ ^governance/checklists/ ]]; then
    PROTECTED_PATH_TOUCHED=true
    PROTECTED_FILE_LIST="${PROTECTED_FILE_LIST}\n  [CHECKLIST] ${file}"
  elif [[ "$file" =~ ^governance/templates/ ]]; then
    PROTECTED_PATH_TOUCHED=true
    PROTECTED_FILE_LIST="${PROTECTED_FILE_LIST}\n  [TEMPLATE] ${file}"
  elif [[ "$file" == "governance/CANON_INVENTORY.json" ]]; then
    PROTECTED_PATH_TOUCHED=true
    PROTECTED_FILE_LIST="${PROTECTED_FILE_LIST}\n  [CANON-INVENTORY] ${file}"
  fi

done <<< "$CHANGED_FILES"

if [ "$IMPLEMENTATION_CHANGED" = true ]; then
  echo "Implementation files changed:"
  echo -e "$IMPL_FILE_LIST"
  echo ""
fi
if [ "$PROTECTED_PATH_TOUCHED" = true ]; then
  echo "Protected-path files changed:"
  echo -e "$PROTECTED_FILE_LIST"
  echo ""
fi

# ----------------------------------------------------------------
# Step 2: Determine required assurance states
# ----------------------------------------------------------------
echo "--- Step 2: Assurance State Determination ---"
echo ""

IAA_REQUIRED=false
ECAP_REQUIRED=false

if [ "$IMPLEMENTATION_CHANGED" = true ]; then
  IAA_REQUIRED=true
  echo "IAA required: YES (implementation/substantive files changed)"
else
  echo "IAA required: NO (no implementation/substantive files detected)"
fi

if [ "$PROTECTED_PATH_TOUCHED" = true ]; then
  ECAP_REQUIRED=true
  echo "ECAP required: YES (protected governance paths changed)"
else
  echo "ECAP required: NO (no protected governance paths detected)"
fi
echo ""

# ----------------------------------------------------------------
# Step 3a: Find IAA token candidates
# ----------------------------------------------------------------
echo "--- Step 3a: IAA Token Candidate Search ---"
echo ""

IAA_INVOKED=false
IAA_ARTIFACT_PATH="null"
IAA_VERDICT="null"
IAA_REVIEWED_SHA="null"

# Only tokens introduced or modified by this PR count (same as iaa-final-assurance-gate.sh)
TOKEN_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-token-.*\.md$" || true)

WAVE_RECORD_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-wave-record-.*\.md$" || true)

# Delta-assurance blocks committed by this PR (used to bridge post-review impl commits)
DELTA_ASSURANCE_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-delta-assurance-.*\.md$" || true)

# ----------------------------------------------------------------
# Step 3b: Validate governing issue number — mandatory when IAA/ECAP is required
# ----------------------------------------------------------------
echo "--- Step 3b: Governing Issue Validation ---"
echo ""

# Attempt to derive EXPECTED_ISSUE_NUMBER from PR body if not already set
if [ -z "$EXPECTED_ISSUE_NUMBER" ] && [ -n "$PR_BODY" ]; then
  EXPECTED_ISSUE_NUMBER=$(echo "$PR_BODY" | \
    grep -ioE '(closes|fixes|resolves|addresses)[[:space:]]+(maturion-isms)?#([0-9]+)' | \
    grep -oE '[0-9]+$' | head -1 || true)
fi

if [ -n "$EXPECTED_ISSUE_NUMBER" ]; then
  echo "Governing issue: maturion-isms#${EXPECTED_ISSUE_NUMBER}"
else
  if [ "$IAA_REQUIRED" = true ] || [ "$ECAP_REQUIRED" = true ]; then
    echo "❌ EXPECTED_ISSUE_NUMBER is empty and IAA/ECAP is required."
    echo "   Set the EXPECTED_ISSUE_NUMBER env var in CI (repo variable) or"
    echo "   link the governing issue in the PR body with 'closes/fixes/resolves/addresses maturion-isms#N'."
    echo "   Issue validation cannot be skipped for PRs requiring IAA/ECAP."
    exit 1
  else
    echo "ℹ️  EXPECTED_ISSUE_NUMBER not provided — informational only for this doc-only PR."
  fi
fi
echo ""

check_token_valid() {
  local tf="$1"
  [ -z "$tf" ] || [ ! -f "$tf" ] && return 1

  # Must not be a REJECTION-PACKAGE
  head -15 "$tf" 2>/dev/null | grep -qi "REJECTION[-.]PACKAGE\|REJECTION-PACKAGE" && return 1

  # PHASE_B_BLOCKING_TOKEN must be present, non-empty, non-PENDING
  local tv
  tv=$(grep "PHASE_B_BLOCKING_TOKEN:" "$tf" 2>/dev/null | head -1 | \
    sed 's/.*PHASE_B_BLOCKING_TOKEN://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
  [ -z "$tv" ] && return 1
  [ "$tv" = "PENDING" ] && return 1

  # Verdict must contain PASS
  local vl
  vl=$(grep -iE "Verdict" "$tf" 2>/dev/null | head -1 || true)
  echo "$vl" | grep -qi "PASS" || return 1

  # Reviewed SHA must be present, resolve to a commit, and be reachable from HEAD_SHA
  local reviewed_sha
  reviewed_sha=$(grep -iE 'Reviewed[[:space:]]+SHA' "$tf" 2>/dev/null | head -1 | \
    grep -oE '[0-9a-fA-F]{7,40}' | head -1 || true)
  [ -z "$reviewed_sha" ] && return 1
  git rev-parse --verify "${reviewed_sha}^{commit}" >/dev/null 2>&1 || return 1
  if [ -n "$HEAD_SHA" ]; then
    git rev-parse --verify "${HEAD_SHA}^{commit}" >/dev/null 2>&1 || return 1
    git merge-base --is-ancestor "$reviewed_sha" "$HEAD_SHA" >/dev/null 2>&1 || return 1

    # Post-review implementation change check: if reviewed_sha != HEAD_SHA, verify that
    # no implementation files were changed after the review.  Evidence-only commits
    # (assurance artifacts, docs, governance) between reviewed_sha and HEAD are fine.
    # If implementation files were changed after the review, a committed
    # delta-assurance block (iaa-delta-assurance-*.md) must explicitly bind the prior
    # reviewed SHA to the current HEAD and classify the delta as non-substantive.
    if [ "$reviewed_sha" != "$HEAD_SHA" ]; then
      local post_review_file
      local has_post_review_impl=false
      while IFS= read -r post_review_file; do
        [ -z "$post_review_file" ] && continue
        is_impl_file "$post_review_file" && { has_post_review_impl=true; break; }
      done <<< "$(git diff "$reviewed_sha" "$HEAD_SHA" --name-only 2>/dev/null || true)"
      if [ "$has_post_review_impl" = true ]; then
        if ! check_delta_assurance_valid "$reviewed_sha" "$HEAD_SHA"; then
          echo "  ❌ Implementation files changed after reviewed SHA ${reviewed_sha:0:12}; no delta-assurance block found"
          return 1
        fi
      fi
    fi
  fi
  # PR reference must match (if PR_NUMBER set)
  local pr_num
  pr_num=$(grep -iE '^[[:space:]]*(-[[:space:]]*)?\*\*PR\*\*:[[:space:]]*' "$tf" 2>/dev/null | \
    head -1 | grep -oE '#?[0-9]+' | head -1 | tr -d '#' || true)
  [ -z "$pr_num" ] && return 1
  [ -n "$PR_NUMBER" ] && [ "$pr_num" != "$PR_NUMBER" ] && return 1

  # Issue reference must match (if EXPECTED_ISSUE_NUMBER set)
  local iss_num
  iss_num=$(grep -iE '^[[:space:]]*(-[[:space:]]*)?\*\*Issue\*\*:[[:space:]]*' "$tf" 2>/dev/null | \
    head -1 | grep -oE '[0-9]+' | tail -1 || true)
  [ -z "$iss_num" ] && return 1
  [ -n "$EXPECTED_ISSUE_NUMBER" ] && [ "$iss_num" != "$EXPECTED_ISSUE_NUMBER" ] && return 1

  return 0
}

while IFS= read -r token_file; do
  [ -z "$token_file" ] && continue
  [ ! -f "$token_file" ] && continue
  if check_token_valid "$token_file"; then
    IAA_INVOKED=true
    IAA_ARTIFACT_PATH="$token_file"
    IAA_VERDICT="PASS"
    IAA_REVIEWED_SHA=$(grep -iE '^[[:space:]]*(-[[:space:]]*)?\*\*(Reviewed SHA|Review SHA|HEAD SHA|Commit SHA)\*\*:[[:space:]]*' \
      "$token_file" 2>/dev/null | head -1 | \
      sed 's/.*\*\*[^*]*\*\*://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
    echo "✅ Valid IAA token found: $token_file (verdict: PASS)"
    break
  fi
done <<< "$TOKEN_FILES_IN_PR"

# Also check wave record files if no token found yet
if [ "$IAA_INVOKED" = false ]; then
  while IFS= read -r wave_file; do
    [ -z "$wave_file" ] && continue
    [ ! -f "$wave_file" ] && continue
    if ! grep -q "^## TOKEN" "$wave_file" 2>/dev/null; then continue; fi

    WR_TV=$(awk '/^## TOKEN/{found=1} found && /PHASE_B_BLOCKING_TOKEN:/{print; exit}' \
      "$wave_file" 2>/dev/null | \
      sed 's/.*PHASE_B_BLOCKING_TOKEN://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
    [ -z "$WR_TV" ] || [ "$WR_TV" = "PENDING" ] && continue

    WR_VL=$(awk '/^## TOKEN/{f=1} f && /Verdict/{print; exit}' "$wave_file" 2>/dev/null || true)
    echo "$WR_VL" | grep -qi "PASS" || continue

    WR_PR=$(awk '/^## TOKEN/{f=1} f && /\*\*PR\*\*:/{print; exit}' "$wave_file" 2>/dev/null | \
      grep -oE '#?[0-9]+' | head -1 | tr -d '#' || true)
    [ -z "$WR_PR" ] && continue
    [ -n "$PR_NUMBER" ] && [ "$WR_PR" != "$PR_NUMBER" ] && continue

    WR_ISS=$(awk '/^## TOKEN/{f=1} f && /\*\*Issue\*\*:/{print; exit}' "$wave_file" 2>/dev/null | \
      grep -oE '[0-9]+' | tail -1 || true)
    [ -z "$WR_ISS" ] && continue
    [ -n "$EXPECTED_ISSUE_NUMBER" ] && [ "$WR_ISS" != "$EXPECTED_ISSUE_NUMBER" ] && continue

    # Reviewed SHA must be present, resolve to a commit, and be reachable from HEAD_SHA
    # (same enforcement as check_token_valid for standalone iaa-token files)
    WR_REVIEWED_SHA=$(awk '/^## TOKEN/{f=1} f && /Reviewed[[:space:]]+SHA|HEAD SHA reviewed/{print; exit}' \
      "$wave_file" 2>/dev/null | grep -oE '[0-9a-fA-F]{7,40}' | head -1 || true)
    [ -z "$WR_REVIEWED_SHA" ] && continue
    git rev-parse --verify "${WR_REVIEWED_SHA}^{commit}" >/dev/null 2>&1 || continue
    if [ -n "$HEAD_SHA" ]; then
      git rev-parse --verify "${HEAD_SHA}^{commit}" >/dev/null 2>&1 || continue
      git merge-base --is-ancestor "$WR_REVIEWED_SHA" "$HEAD_SHA" >/dev/null 2>&1 || continue

      # Post-review implementation change check (same as check_token_valid)
      if [ "$WR_REVIEWED_SHA" != "$HEAD_SHA" ]; then
        wr_has_post_impl=false
        wr_post_file=""
        while IFS= read -r wr_post_file; do
          [ -z "$wr_post_file" ] && continue
          is_impl_file "$wr_post_file" && { wr_has_post_impl=true; break; }
        done <<< "$(git diff "$WR_REVIEWED_SHA" "$HEAD_SHA" --name-only 2>/dev/null || true)"
        if [ "$wr_has_post_impl" = true ]; then
          if ! check_delta_assurance_valid "$WR_REVIEWED_SHA" "$HEAD_SHA"; then
            echo "  ❌ Wave record: implementation files changed after reviewed SHA ${WR_REVIEWED_SHA:0:12}; no delta-assurance block"
            continue
          fi
        fi
      fi
    fi

    IAA_INVOKED=true
    IAA_ARTIFACT_PATH="$wave_file"
    IAA_VERDICT="PASS"
    IAA_REVIEWED_SHA="$WR_REVIEWED_SHA"
    echo "✅ Valid IAA token in wave record ## TOKEN: $wave_file"
    break
  done <<< "$WAVE_RECORD_FILES_IN_PR"
fi

if [ "$IAA_INVOKED" = false ] && [ "$IAA_REQUIRED" = true ]; then
  echo "❌ No valid current IAA token found for this PR."
fi
echo ""

# ----------------------------------------------------------------
# Step 4: Check current ECAP evidence
# ----------------------------------------------------------------
echo "--- Step 4: ECAP Evidence Check ---"
echo ""

ECAP_INVOKED=false
ECAP_ARTIFACT_PATH="null"
ECAP_VERDICT="null"

ECAP_BUNDLE_DIR=".agent-workspace/execution-ceremony-admin-agent/bundles"

# ECAP bundles committed by this PR
ECAP_BUNDLES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ECAP_BUNDLE_DIR}/PREHANDOVER-.*\.md$" || true)

# PREHANDOVER proof files with ecap_waiver_ref
PREHANDOVER_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep -E "^${PREHANDOVER_DIR}/proof-.*\.md$|^\.agent-workspace/foreman-v2/memory/PREHANDOVER-.*\.md$" \
  || true)

if [ -n "$ECAP_BUNDLES_IN_PR" ]; then
  while IFS= read -r ecap_bundle; do
    [ -z "$ecap_bundle" ] && continue
    [ ! -f "$ecap_bundle" ] && continue

    # Require a PASS-like verdict in the bundle
    # Check merge_gate_verdict / admin_ceremony_compliance / QP VERDICT fields
    ECAP_BUNDLE_VERDICT=$(grep -iE \
      "^[[:space:]]*(merge_gate_verdict|admin_ceremony_compliance|ecap_verdict)[[:space:]]*:" \
      "$ecap_bundle" 2>/dev/null | head -1 | \
      sed 's/.*:[[:space:]]*//' || true)
    if ! echo "$ECAP_BUNDLE_VERDICT" | grep -qiE "PASS|CS2_WAIVER"; then
      # Fallback: look for bold QP VERDICT / OPOJD PASS line
      if ! grep -qiE "\*\*QP VERDICT.*PASS\*\*|\*\*OPOJD.*PASS\*\*|ecap_verdict.*PASS" \
           "$ecap_bundle" 2>/dev/null; then
        echo "❌ ECAP bundle found but no PASS verdict detected: $ecap_bundle"
        continue
      fi
    fi

    # Require the bundle to reference the current PR or issue (if known)
    if [ -n "$PR_NUMBER" ]; then
      BUNDLE_PR=$(grep -iE "^[[:space:]]*pr:[[:space:]]*" "$ecap_bundle" 2>/dev/null | \
        head -1 | grep -oE '[0-9]+' | head -1 || true)
      # "TBD" pr field is allowed (bundle assembled before PR was opened)
      if [ -n "$BUNDLE_PR" ] && [ "$BUNDLE_PR" != "$PR_NUMBER" ] && \
         ! grep -qiE "^[[:space:]]*pr:[[:space:]]*(TBD|N/A)" "$ecap_bundle" 2>/dev/null; then
        echo "❌ ECAP bundle PR reference ($BUNDLE_PR) does not match current PR ($PR_NUMBER): $ecap_bundle"
        continue
      fi
    fi

    ECAP_INVOKED=true
    ECAP_ARTIFACT_PATH="$ecap_bundle"
    ECAP_VERDICT="PASS"
    echo "✅ ECAP bundle artifact with PASS verdict found: $ECAP_ARTIFACT_PATH"
    break
  done <<< "$ECAP_BUNDLES_IN_PR"
fi

# Check for CS2 waiver in PREHANDOVER proofs
if [ "$ECAP_INVOKED" = false ]; then
  while IFS= read -r pf; do
    [ -z "$pf" ] && continue
    [ ! -f "$pf" ] && continue

    WAIVER=$(grep -iE "^[[:space:]]*ecap_waiver_ref:" "$pf" 2>/dev/null | head -1 | \
      sed 's/.*ecap_waiver_ref://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
    if [ -n "$WAIVER" ] && ! echo "$WAIVER" | grep -qiE "^N/A$|^none$|^-$|^\[\]$|^null$"; then
      ECAP_INVOKED=true
      ECAP_ARTIFACT_PATH="$WAIVER"
      ECAP_VERDICT="CS2_WAIVER"
      echo "✅ CS2 waiver found in PREHANDOVER: $WAIVER"
      break
    fi

    # ecap_required: false with waiver is treated as ECAP not needed
    ECAP_REQ_FIELD=$(grep -iE "^[[:space:]]*ecap_required:" "$pf" 2>/dev/null | head -1 | \
      sed 's/.*ecap_required://I;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)
    if echo "$ECAP_REQ_FIELD" | grep -qiE "^false$|^no$" && [ -z "$WAIVER" ]; then
      # Without a waiver this is a self-certified claim — not accepted
      :
    fi
  done <<< "$PREHANDOVER_IN_PR"
fi

if [ "$ECAP_INVOKED" = false ] && [ "$ECAP_REQUIRED" = true ]; then
  echo "❌ No valid current ECAP evidence found for this PR."
fi
echo ""

# ----------------------------------------------------------------
# Step 5: Derive lifecycle state
# ----------------------------------------------------------------
echo "--- Step 5: Lifecycle State ---"
echo ""

IAA_BLOCKED=false
ECAP_BLOCKED=false
HANDOVER_ALLOWED=false
MERGE_READY_ALLOWED=false
LIFECYCLE_STATUS="blocked"

if [ "$IAA_REQUIRED" = true ] && [ "$IAA_INVOKED" = false ]; then
  IAA_BLOCKED=true
fi
if [ "$ECAP_REQUIRED" = true ] && [ "$ECAP_INVOKED" = false ]; then
  ECAP_BLOCKED=true
fi

if [ "$IAA_BLOCKED" = false ] && [ "$ECAP_BLOCKED" = false ]; then
  HANDOVER_ALLOWED=true
  MERGE_READY_ALLOWED=true
  LIFECYCLE_STATUS="assurance-ready"
fi

# ----------------------------------------------------------------
# Step 6: Write lifecycle artifact
# ----------------------------------------------------------------
mkdir -p "${LIFECYCLE_DIR}"
PR_NUM="${PR_NUMBER:-0}"
LIFECYCLE_FILE="${LIFECYCLE_DIR}/pr-${PR_NUM}-assurance-state.json"

jq -n \
  --argjson pr "${PR_NUM}" \
  --arg issue "${EXPECTED_ISSUE_NUMBER:-}" \
  --arg head_sha "${HEAD_SHA:-}" \
  --argjson implementation_changed "${IMPLEMENTATION_CHANGED}" \
  --argjson iaa_required "${IAA_REQUIRED}" \
  --argjson iaa_invoked "${IAA_INVOKED}" \
  --arg iaa_artifact_path "${IAA_ARTIFACT_PATH:-}" \
  --arg iaa_reviewed_sha "${IAA_REVIEWED_SHA:-}" \
  --arg iaa_verdict "${IAA_VERDICT:-}" \
  --argjson ecap_required "${ECAP_REQUIRED}" \
  --argjson ecap_invoked "${ECAP_INVOKED}" \
  --arg ecap_artifact_path "${ECAP_ARTIFACT_PATH:-}" \
  --arg ecap_verdict "${ECAP_VERDICT:-}" \
  --argjson handover_allowed "${HANDOVER_ALLOWED}" \
  --argjson merge_ready_allowed "${MERGE_READY_ALLOWED}" \
  '{
    pr: $pr,
    issue: (if $issue == "" then null else $issue end),
    head_sha: (if $head_sha == "" then null else $head_sha end),
    implementation_changed: $implementation_changed,
    iaa_required: $iaa_required,
    iaa_invoked: $iaa_invoked,
    iaa_artifact_path: (if $iaa_artifact_path == "" then null else $iaa_artifact_path end),
    iaa_reviewed_sha: (if $iaa_reviewed_sha == "" then null else $iaa_reviewed_sha end),
    iaa_verdict: $iaa_verdict,
    ecap_required: $ecap_required,
    ecap_invoked: $ecap_invoked,
    ecap_artifact_path: (if $ecap_artifact_path == "" then null else $ecap_artifact_path end),
    ecap_verdict: $ecap_verdict,
    handover_allowed: $handover_allowed,
    merge_ready_allowed: $merge_ready_allowed
  }' > "$LIFECYCLE_FILE"
echo "Lifecycle artifact written: ${LIFECYCLE_FILE}"
echo ""
cat "${LIFECYCLE_FILE}"
echo ""

# ----------------------------------------------------------------
# Step 7: Set GitHub Actions outputs
# ----------------------------------------------------------------
set_output "iaa_required"        "${IAA_REQUIRED}"
set_output "iaa_invoked"         "${IAA_INVOKED}"
set_output "iaa_blocked"         "${IAA_BLOCKED}"
set_output "ecap_required"       "${ECAP_REQUIRED}"
set_output "ecap_invoked"        "${ECAP_INVOKED}"
set_output "ecap_blocked"        "${ECAP_BLOCKED}"
set_output "handover_allowed"    "${HANDOVER_ALLOWED}"
set_output "merge_ready_allowed" "${MERGE_READY_ALLOWED}"
set_output "lifecycle_status"    "${LIFECYCLE_STATUS}"
set_output "lifecycle_file"      "${LIFECYCLE_FILE}"
echo ""

# ----------------------------------------------------------------
# Step 8: Human-readable lifecycle state report
# ----------------------------------------------------------------
echo "--- Lifecycle State Report ---"
echo ""
echo "IAA required:        ${IAA_REQUIRED}"
echo "IAA invoked:         ${IAA_INVOKED}"
echo "Current IAA artifact: ${IAA_ARTIFACT_PATH}"
echo "IAA blocked:         ${IAA_BLOCKED}"
echo ""
echo "ECAP required:       ${ECAP_REQUIRED}"
echo "ECAP invoked:        ${ECAP_INVOKED}"
echo "Current ECAP bundle: ${ECAP_ARTIFACT_PATH}"
echo "ECAP blocked:        ${ECAP_BLOCKED}"
echo ""
echo "Handover allowed:       ${HANDOVER_ALLOWED}"
echo "Merge-ready allowed:    ${MERGE_READY_ALLOWED}"
echo ""

if [ "${LIFECYCLE_STATUS}" = "assurance-ready" ]; then
  echo "✅ LIFECYCLE STATUS: assurance-ready"
  echo "   All required assurance evidence is present and current."
  echo "   Handover and merge are permitted (subject to CS2 approval)."
else
  echo "❌ LIFECYCLE STATUS: BLOCKED"
  echo ""
  if [ "${ECAP_BLOCKED}" = true ]; then
    echo "  ECAP required but not completed — label: ecap-blocked"
    echo "  Protected governance paths changed but no committed ECAP bundle or CS2 waiver found."
  fi
  if [ "${IAA_BLOCKED}" = true ]; then
    echo "  IAA required but not completed — label: iaa-blocked"
    echo "  Implementation files changed but no current PR-specific IAA token found."
  fi
  echo ""
  echo "Required next actions:"
  if [ "${ECAP_BLOCKED}" = true ]; then
    echo "  1. Invoke execution-ceremony-admin-agent for ECAP ceremony"
    echo "     task(agent_type: 'execution-ceremony-admin-agent')"
    if [ "${IAA_BLOCKED}" = true ]; then
      echo "  2. Invoke independent-assurance-agent for final assurance after ECAP"
      echo "     task(agent_type: 'independent-assurance-agent')"
      echo "     Provide: PR #${PR_NUMBER:-NNN}, issue #${EXPECTED_ISSUE_NUMBER:-NNN}, HEAD SHA ${HEAD_SHA:-<sha>}"
    fi
  elif [ "${IAA_BLOCKED}" = true ]; then
    echo "  Invoke independent-assurance-agent for final assurance"
    echo "  task(agent_type: 'independent-assurance-agent')"
    echo "  Provide: PR #${PR_NUMBER:-NNN}, issue #${EXPECTED_ISSUE_NUMBER:-NNN}, HEAD SHA ${HEAD_SHA:-<sha>}"
  fi
fi
