#!/bin/bash
# refresh-scope-and-validate.sh
# Authority: AGENT_HANDOVER_AUTOMATION.md §4.3g, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Final pre-handover compliance helper.
#   Step 1 — Shows the live final diff so the agent can verify / refresh
#             SCOPE_DECLARATION.md (root) before the last commit.
#   Step 2 — Runs validate-scope-to-diff.sh (BL-027 exact-set match).
#   Step 3 — Runs validate-governance-evidence-exactness.sh (PATH-MISMATCH,
#             COUNT-MISMATCH, HASH-INCOMPLETE, VERSION-MISMATCH checks).
#   Step 4 — Verifies commit order: SCOPE_DECLARATION.md must be the most
#             recent commit (AAP-28 final-step discipline, git log check).
#   Step 5 — Prints a PREHANDOVER Evidence Exactness Gate snippet ready for
#             copy-paste into the proof.
#
# Usage (run from repository root after all implementation edits are committed):
#   .github/scripts/refresh-scope-and-validate.sh
#
# Exit codes:
#   0 — all checks PASS; safe to invoke IAA
#   1 — one or more checks FAIL; IAA must NOT be invoked until resolved
#
# NOTE: This script does NOT auto-rewrite SCOPE_DECLARATION.md.
#       The producing agent is responsible for refreshing the declaration
#       from the live diff output shown below, committing it, and then
#       re-running this script to confirm all checks pass (§4.3g rule).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo '.')"
cd "${REPO_ROOT}"

TIMESTAMP="$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
OVERALL_EXIT=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  §4.3g Pre-Handover Scope-Refresh and Evidence-Exactness Helper"
echo "  Authority: AGENT_HANDOVER_AUTOMATION.md §4.3g"
echo "  Timestamp: ${TIMESTAMP}"
echo "  Branch:    $(git branch --show-current 2>/dev/null || echo 'unknown')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 — Live final diff for scope verification
# ─────────────────────────────────────────────────────────────────────────────
echo "── STEP 1: LIVE DIFF (for SCOPE_DECLARATION.md verification) ──"
echo ""

DIFF_BASE=""
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  DIFF_BASE="origin/main...HEAD"
elif git rev-parse --verify main >/dev/null 2>&1; then
  DIFF_BASE="main...HEAD"
fi

if [ -z "${DIFF_BASE}" ]; then
  echo "   ⚠️  No diff base found (origin/main or main not available)."
  echo "   Run: git fetch origin main before this script."
else
  DIFF_FILES=$(git diff --name-only "${DIFF_BASE}" 2>/dev/null || true)
  DIFF_COUNT=$(echo "${DIFF_FILES}" | grep -c . 2>/dev/null || echo 0)
  echo "   Diff base: ${DIFF_BASE}"
  echo "   Changed files (${DIFF_COUNT} total):"
  if [ -n "${DIFF_FILES}" ]; then
    echo "${DIFF_FILES}" | while IFS= read -r f; do echo "     - \`${f}\`"; done
  else
    echo "     (no files changed)"
  fi
  echo ""
  echo "   ✏️  ACTION REQUIRED: Verify that SCOPE_DECLARATION.md lists exactly the"
  echo "   files above — no more, no less. If it does not, refresh it now and commit"
  echo "   before running this script again. (§4.3g Rule: scope refresh is the FINAL"
  echo "   committed action before IAA invocation.)"
fi
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 — validate-scope-to-diff.sh (BL-027)
# ─────────────────────────────────────────────────────────────────────────────
echo "── STEP 2: SCOPE-TO-DIFF VALIDATION (BL-027) ──"
echo ""

SCOPE_EXIT=0
if [ -f "${SCRIPT_DIR}/validate-scope-to-diff.sh" ]; then
  bash "${SCRIPT_DIR}/validate-scope-to-diff.sh" 2>&1 || SCOPE_EXIT=$?
else
  SCOPE_EXIT=127
  echo "   ❌ validate-scope-to-diff.sh not found at ${SCRIPT_DIR}/validate-scope-to-diff.sh."
  echo "   REMEDIATION: Step 2 is a mandatory gate. Restore or add"
  echo "   validate-scope-to-diff.sh in ${SCRIPT_DIR}, then re-run this script."
fi

if [ "${SCOPE_EXIT}" -ne 0 ]; then
  OVERALL_EXIT=1
  echo "   ❌ SCOPE-TO-DIFF: FAIL (exit ${SCOPE_EXIT})"
  echo "   ACTION: Refresh SCOPE_DECLARATION.md from the diff shown in Step 1, commit,"
  echo "   and re-run this script before proceeding."
else
  echo "   ✅ SCOPE-TO-DIFF: PASS"
fi
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3 — validate-governance-evidence-exactness.sh
# ─────────────────────────────────────────────────────────────────────────────
echo "── STEP 3: EVIDENCE EXACTNESS VALIDATION ──"
echo ""

EXACTNESS_EXIT=0
EXACTNESS_OUTPUT=""
if [ -f "${SCRIPT_DIR}/validate-governance-evidence-exactness.sh" ]; then
  EXACTNESS_OUTPUT=$(bash "${SCRIPT_DIR}/validate-governance-evidence-exactness.sh" 2>&1) || EXACTNESS_EXIT=$?
  echo "${EXACTNESS_OUTPUT}"
else
  EXACTNESS_EXIT=1
  echo "   ❌ validate-governance-evidence-exactness.sh not found at ${SCRIPT_DIR}."
  echo "   ACTION: Restore the required validator and re-run this script before invoking IAA."
fi

if [ "${EXACTNESS_EXIT}" -ne 0 ]; then
  OVERALL_EXIT=1
  echo "   ❌ EVIDENCE EXACTNESS: FAIL (exit ${EXACTNESS_EXIT})"
  echo "   ACTION: Fix all errors reported above, refresh SCOPE_DECLARATION.md if needed,"
  echo "   and re-run this script before invoking IAA."
else
  echo "   ✅ EVIDENCE EXACTNESS: PASS"
fi
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4 — Commit-order verification (AAP-28)
# Verifies that SCOPE_DECLARATION.md was refreshed as the FINAL committed
# action before PREHANDOVER/IAA invocation (§4.3g Rule, AAP-28 discipline).
# ─────────────────────────────────────────────────────────────────────────────
echo "── STEP 4: COMMIT-ORDER VERIFICATION (AAP-28) ──"
echo ""
echo "   Recent commit history (git log --oneline -5):"
RECENT_LOG=$(git log --oneline -5 2>/dev/null || echo "(unable to read git log)")
echo "${RECENT_LOG}" | while IFS= read -r line; do echo "     ${line}"; done
echo ""

SCOPE_ORDER_OK=0
LAST_COMMIT_FILES=$(git diff-tree --no-commit-id -r --name-only HEAD 2>/dev/null || true)
if echo "${LAST_COMMIT_FILES}" | grep -qx "SCOPE_DECLARATION.md"; then
  SCOPE_ORDER_OK=1
  echo "   ✅ COMMIT-ORDER: PASS — SCOPE_DECLARATION.md is present in the most"
  echo "   recent commit, satisfying the §4.3g / AAP-28 final-step requirement."
else
  OVERALL_EXIT=1
  echo "   ❌ COMMIT-ORDER: FAIL — SCOPE_DECLARATION.md was NOT the last committed"
  echo "   action. Files in most recent commit:"
  if [ -n "${LAST_COMMIT_FILES}" ]; then
    echo "${LAST_COMMIT_FILES}" | while IFS= read -r f; do echo "     - \`${f}\`"; done
  else
    echo "     (no files found in last commit)"
  fi
  echo "   ACTION (AAP-28): Refresh SCOPE_DECLARATION.md from the diff shown in"
  echo "   Step 1, commit it as the final change, and re-run this script."
  echo "   VERIFY: git log --oneline -5 must show SCOPE_DECLARATION.md in the top entry."
fi
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5 — PREHANDOVER snippet
# ─────────────────────────────────────────────────────────────────────────────
echo "── STEP 5: PREHANDOVER Evidence Exactness Gate Snippet ──"
echo ""
echo "   Copy the block below and paste it into the '## Evidence Exactness Gate'"
echo "   section of your PREHANDOVER proof (replaces the placeholder text)."
echo ""
echo "────────────────── COPY FROM HERE ──────────────────"
echo ""
echo "**Timestamp (check run)**: ${TIMESTAMP}"
echo "**Command**: \`.github/scripts/validate-governance-evidence-exactness.sh\`"
if [ "${EXACTNESS_EXIT}" -eq 0 ]; then
  echo "**Exit code**: 0 (PASS)"
  if [ "${OVERALL_EXIT}" -eq 0 ] && [ "${SCOPE_ORDER_OK}" -eq 1 ]; then
    echo "**Scope refreshed after final edit**: YES"
  else
    echo "**Scope refreshed after final edit**: NO — BLOCKED (commit-order check failed; see Step 4)"
  fi
  echo ""
  # Print last 20 lines of exactness output as summary
  SUMMARY=$(echo "${EXACTNESS_OUTPUT}" | tail -20 2>/dev/null || echo "See above output")
  echo "**Output summary**:"
  echo '```'
  echo "${SUMMARY}"
  echo '```'
  echo ""
  echo "| Defect Class | Check Result |"
  echo "|---|---|"
  # Helper: emit one table row; $1=keyword $2=label $3=pass-text
  _check_row() {
    local keyword="$1" label="$2" pass_text="$3"
    # Check presence in output once; reuse result for the FAIL sub-check
    local present=0 failed=0
    echo "${EXACTNESS_OUTPUT}" | grep -q "${keyword}" && present=1 || true
    [ "${present}" -eq 1 ] && echo "${EXACTNESS_OUTPUT}" | grep -q "❌ ${keyword}" && failed=1 || true
    if [ "${present}" -eq 1 ]; then
      if [ "${failed}" -eq 1 ]; then
        echo "| ${label} | ❌ FAIL — see output above |"
      else
        echo "| ${label} | ${pass_text} |"
      fi
    fi
  }
  _check_row "PATH-MISMATCH"    "PATH-MISMATCH (Check 1)"                   "✅ PASS"
  _check_row "COUNT-MISMATCH"   "COUNT-MISMATCH (Check 2)"                  "✅ PASS / ℹ️ N/A"
  _check_row "HASH-INCOMPLETE"  "HASH-INCOMPLETE (Check 3)"                 "✅ PASS / ℹ️ N/A"
  _check_row "VERSION-MISMATCH" "VERSION-MISMATCH cross-artifact (Check 4)" "✅ PASS / ℹ️ N/A"
else
  echo "**Exit code**: ${EXACTNESS_EXIT} (FAIL)"
  echo "**Scope refreshed after final edit**: [YES / NO — confirm after fixing failures above (Step 4 commit-order check required)]"
  echo ""
  echo "**Output summary**: ❌ EVIDENCE EXACTNESS GATE FAILED — fix errors above and re-run."
  echo ""
  echo "| Defect Class | Check Result |"
  echo "|---|---|"
  echo "| PATH-MISMATCH (Check 1) | ❌ FAIL / ✅ PASS — [see output above] |"
  echo "| COUNT-MISMATCH (Check 2) | ❌ FAIL / ✅ PASS / ℹ️ N/A |"
  echo "| HASH-INCOMPLETE (Check 3) | ❌ FAIL / ✅ PASS / ℹ️ N/A |"
  echo "| VERSION-MISMATCH cross-artifact (Check 4) | ❌ FAIL / ✅ PASS / ℹ️ N/A |"
fi
echo ""
echo "────────────────── COPY TO HERE ──────────────────"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# FINAL RESULT
# ─────────────────────────────────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "${OVERALL_EXIT}" -eq 0 ]; then
  echo "  ✅ §4.3g PRE-HANDOVER SCOPE-REFRESH AND EXACTNESS GATE: PASS"
  echo "  All checks pass. Proceed to §4.3c → §4.3d → §4.3e → §4.3f → IAA invocation."
  echo "  Paste the PREHANDOVER snippet above into your proof's ## Evidence Exactness Gate section."
else
  echo "  ❌ §4.3g PRE-HANDOVER SCOPE-REFRESH AND EXACTNESS GATE: FAIL"
  echo "  Fix all errors listed above. Refresh SCOPE_DECLARATION.md from the live diff,"
  echo "  commit it as the final change, then re-run this script. IAA must NOT be invoked"
  echo "  until this script exits 0."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit "${OVERALL_EXIT}"
