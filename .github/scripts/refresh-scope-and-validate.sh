#!/bin/bash
# refresh-scope-and-validate.sh
# Authority: AGENT_HANDOVER_AUTOMATION.md §4.3g, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Final pre-handover compliance helper.
#   Step 1 — Shows the live final diff so the agent can verify / refresh
#             SCOPE_DECLARATION.md (root) before the last commit.
#   Step 2 — Runs validate-scope-to-diff.sh (BL-027 exact-set match).
#   Step 3 — Runs validate-governance-evidence-exactness.sh (PATH-MISMATCH,
#             COUNT-MISMATCH, HASH-INCOMPLETE, VERSION-MISMATCH checks).
#   Step 4 — Prints a PREHANDOVER Evidence Exactness Gate snippet ready for
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
set -uo pipefail

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
  echo "   ⚠️  validate-scope-to-diff.sh not found at ${SCRIPT_DIR}. Skipping."
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
  echo "   ⚠️  validate-governance-evidence-exactness.sh not found at ${SCRIPT_DIR}. Skipping."
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
# STEP 4 — PREHANDOVER snippet
# ─────────────────────────────────────────────────────────────────────────────
echo "── STEP 4: PREHANDOVER Evidence Exactness Gate Snippet ──"
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
  echo "**Scope refreshed after final edit**: YES"
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
  # Parse check results from output
  if echo "${EXACTNESS_OUTPUT}" | grep -q "PATH-MISMATCH"; then
    if echo "${EXACTNESS_OUTPUT}" | grep -q "❌ PATH-MISMATCH"; then
      echo "| PATH-MISMATCH (Check 1) | ❌ FAIL — see output above |"
    else
      echo "| PATH-MISMATCH (Check 1) | ✅ PASS |"
    fi
  fi
  if echo "${EXACTNESS_OUTPUT}" | grep -q "COUNT-MISMATCH"; then
    if echo "${EXACTNESS_OUTPUT}" | grep -q "❌ COUNT-MISMATCH"; then
      echo "| COUNT-MISMATCH (Check 2) | ❌ FAIL — see output above |"
    else
      echo "| COUNT-MISMATCH (Check 2) | ✅ PASS / ℹ️ N/A |"
    fi
  fi
  if echo "${EXACTNESS_OUTPUT}" | grep -q "HASH-INCOMPLETE"; then
    if echo "${EXACTNESS_OUTPUT}" | grep -q "❌ HASH-INCOMPLETE"; then
      echo "| HASH-INCOMPLETE (Check 3) | ❌ FAIL — see output above |"
    else
      echo "| HASH-INCOMPLETE (Check 3) | ✅ PASS / ℹ️ N/A |"
    fi
  fi
  if echo "${EXACTNESS_OUTPUT}" | grep -q "VERSION-MISMATCH"; then
    if echo "${EXACTNESS_OUTPUT}" | grep -q "❌ VERSION-MISMATCH"; then
      echo "| VERSION-MISMATCH cross-artifact (Check 4) | ❌ FAIL — see output above |"
    else
      echo "| VERSION-MISMATCH cross-artifact (Check 4) | ✅ PASS / ℹ️ N/A |"
    fi
  fi
else
  echo "**Exit code**: ${EXACTNESS_EXIT} (FAIL)"
  echo "**Scope refreshed after final edit**: [YES / NO — confirm after fixing failures]"
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
