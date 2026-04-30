#!/bin/bash
# enforce-scope-declaration-policy.sh
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, SCOPE_DECLARATION_SCHEMA.md v2.0.0
# Purpose: Enforces per-PR scope declaration model introduced by maturion-isms#1521.
#   Gate A — ROOT-REWRITE-BLOCKED : root SCOPE_DECLARATION.md must NOT be modified
#             unless the PR carries a migration exemption.
#   Gate B — PER-PR-SCOPE-REQUIRED : for agent/Copilot PRs the per-PR scope
#             declaration must exist at .agent-admin/scope-declarations/pr-<N>.md
#             and must contain the required fields.
#
# Migration exemptions (Gate A only — Gate B still applies):
#   (a) PR label 'scope-declaration-migration'
#   (b) PR body contains CS2 waiver phrase:
#       'CS2-SCOPE-MIGRATION-WAIVER' or 'CS2 waiver' (case-insensitive)
#
# Environment variables (passed by the GitHub Actions workflow):
#   BASE_SHA      — PR base commit SHA (required)
#   PR_NUMBER     — GitHub PR number (required for Gate B)
#   PR_LABELS     — comma-separated PR label names
#   PR_BODY       — full PR body text
#   ENFORCE_SCOPE — set to 'false' to skip Gate B (for non-agent PRs)
#
# Exit codes: 0=PASS, 1=FAIL
set -uo pipefail

ERRORS=0

BASE_SHA="${BASE_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_LABELS="${PR_LABELS:-}"
PR_BODY="${PR_BODY:-}"
ENFORCE_SCOPE="${ENFORCE_SCOPE:-true}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Scope Declaration Policy Gate"
echo "  Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521"
echo "  PR Number : ${PR_NUMBER:-<not provided>}"
if [ -n "$BASE_SHA" ]; then
  echo "  Base SHA  : ${BASE_SHA:0:12}..."
else
  echo "  Base SHA  : <not provided>"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ----------------------------------------------------------------
# CS2 sign-off bypass (supreme authority — skip both gates)
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"CS sign-off: approved"* ]]; then
  echo "✅ PASS — PR carries 'CS sign-off: approved' label."
  echo "   Scope declaration policy gate waived per CS2 supreme authority."
  exit 0
fi

# ----------------------------------------------------------------
# Automated governance PR bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"governance"* ]] && \
   [[ "$PR_LABELS" == *"automated"* ]] && \
   [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  echo "✅ PASS — Automated governance alignment PR — scope policy gate bypassed."
  exit 0
fi

# ----------------------------------------------------------------
# Detect migration exemption (used in Gate A)
# ----------------------------------------------------------------
MIGRATION_EXEMPT=false
if [[ "$PR_LABELS" == *"scope-declaration-migration"* ]]; then
  MIGRATION_EXEMPT=true
  echo "ℹ️  Migration exemption: PR label 'scope-declaration-migration' found."
fi
if ! $MIGRATION_EXEMPT; then
  if echo "$PR_BODY" | grep -qiE 'CS2-SCOPE-MIGRATION-WAIVER|CS2 waiver'; then
    MIGRATION_EXEMPT=true
    echo "ℹ️  Migration exemption: CS2 waiver phrase detected in PR body."
  fi
fi

# ----------------------------------------------------------------
# Detect changed files
# ----------------------------------------------------------------
CHANGED_FILES=""
if [ -n "$BASE_SHA" ]; then
  CHANGED_FILES=$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || \
                  git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null || true)
elif git rev-parse --verify origin/main >/dev/null 2>&1; then
  CHANGED_FILES=$(git diff --name-only "origin/main...HEAD" 2>/dev/null || true)
elif git rev-parse --verify main >/dev/null 2>&1; then
  CHANGED_FILES=$(git diff --name-only "main...HEAD" 2>/dev/null || true)
fi

# ============================================================
# GATE A: ROOT-REWRITE-BLOCKED
# Root SCOPE_DECLARATION.md must NOT be modified unless the
# PR carries a valid migration exemption.
# ============================================================
echo "── GATE A: ROOT-REWRITE-BLOCKED ──"

ROOT_SCOPE_MODIFIED=false
if echo "$CHANGED_FILES" | grep -qxF "SCOPE_DECLARATION.md" 2>/dev/null; then
  ROOT_SCOPE_MODIFIED=true
fi

if $ROOT_SCOPE_MODIFIED; then
  if $MIGRATION_EXEMPT; then
    echo "   ⚠️  Root SCOPE_DECLARATION.md is modified — migration exemption GRANTED."
    echo "   ✅ GATE A: PASS (migration exemption applies)"
  else
    echo "   ❌ ROOT-REWRITE-BLOCKED: Root SCOPE_DECLARATION.md was modified by this PR."
    echo "      Normal PRs must NOT rewrite the root scope declaration."
    echo "      Write your scope declaration to: .agent-admin/scope-declarations/pr-${PR_NUMBER:-<PR_NUMBER>}.md"
    echo ""
    echo "      Migration exemption options:"
    echo "        (a) Add PR label: 'scope-declaration-migration'"
    echo "        (b) Include 'CS2-SCOPE-MIGRATION-WAIVER' in the PR body"
    echo "      Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ✅ GATE A: PASS — Root SCOPE_DECLARATION.md not modified."
fi
echo ""

# ============================================================
# GATE B: PER-PR-SCOPE-REQUIRED
# For agent/Copilot PRs, a per-PR scope declaration must exist
# at .agent-admin/scope-declarations/pr-<PR_NUMBER>.md and must
# contain the minimum required fields.
# ============================================================
echo "── GATE B: PER-PR-SCOPE-REQUIRED ──"

if [ "$ENFORCE_SCOPE" = "false" ]; then
  echo "   ℹ️  ENFORCE_SCOPE=false — Gate B skipped (non-agent PR)."
  echo ""
else
  if [ -z "$PR_NUMBER" ]; then
    echo "   ⚠️  PR_NUMBER not set — cannot locate per-PR scope file. Gate B skipped."
    echo ""
  else
    PER_PR_SCOPE_FILE=".agent-admin/scope-declarations/pr-${PR_NUMBER}.md"

    if [ ! -f "$PER_PR_SCOPE_FILE" ]; then
      echo "   ❌ PER-PR-SCOPE-REQUIRED: Per-PR scope declaration not found."
      echo "      Expected: $PER_PR_SCOPE_FILE"
      echo ""
      echo "      Create the file using the template at:"
      echo "        governance/canon/scope-declaration.template.md"
      echo "      Required fields: PR_NUMBER, ISSUE, BRANCH, OWNER, DATE_UTC,"
      echo "        RESPONSIBILITY_DOMAIN, IN_SCOPE, OUT_OF_SCOPE, FILES_CHANGED"
      echo "      Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521"
      ERRORS=$((ERRORS + 1))
    else
      echo "   ✅ Per-PR scope file found: $PER_PR_SCOPE_FILE"

      # Validate required fields
      FIELD_ERRORS=0

      # Check PR_NUMBER field
      if ! grep -qE "^PR_NUMBER:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: PR_NUMBER field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        # Validate it matches the actual PR number
        DECLARED_PR=$(grep -oE "^PR_NUMBER:[[:space:]]*[0-9]+" "$PER_PR_SCOPE_FILE" 2>/dev/null | \
          grep -oE "[0-9]+$" || true)
        if [ -n "$DECLARED_PR" ] && [ "$DECLARED_PR" != "$PR_NUMBER" ]; then
          echo "   ❌ FIELD-MISMATCH: PR_NUMBER in $PER_PR_SCOPE_FILE is '$DECLARED_PR' but PR is #${PR_NUMBER}"
          FIELD_ERRORS=$((FIELD_ERRORS + 1))
        else
          echo "   ✅ PR_NUMBER field present"
        fi
      fi

      # Check ISSUE field
      if ! grep -qE "^ISSUE:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: ISSUE field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        echo "   ✅ ISSUE field present"
      fi

      # Check BRANCH field
      if ! grep -qE "^BRANCH:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: BRANCH field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        echo "   ✅ BRANCH field present"
      fi

      # Check OWNER field
      if ! grep -qE "^OWNER:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: OWNER field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        echo "   ✅ OWNER field present"
      fi

      # Check FILES_CHANGED count field
      if ! grep -qE "^FILES_CHANGED:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: FILES_CHANGED count field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        echo "   ✅ FILES_CHANGED count field present"
      fi

      # Check OUT_OF_SCOPE section
      if ! grep -qE "^OUT_OF_SCOPE:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: OUT_OF_SCOPE field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        echo "   ✅ OUT_OF_SCOPE field present"
      fi

      # Check DATE_UTC or last-refreshed timestamp
      if ! grep -qiE "^DATE_UTC:" "$PER_PR_SCOPE_FILE" 2>/dev/null; then
        echo "   ❌ FIELD-MISSING: DATE_UTC field absent in $PER_PR_SCOPE_FILE"
        FIELD_ERRORS=$((FIELD_ERRORS + 1))
      else
        echo "   ✅ DATE_UTC field present"
      fi

      if [ "$FIELD_ERRORS" -gt 0 ]; then
        echo "   ❌ $FIELD_ERRORS required field(s) missing in $PER_PR_SCOPE_FILE"
        ERRORS=$((ERRORS + FIELD_ERRORS))
      else
        echo "   ✅ GATE B: PASS — Per-PR scope declaration valid."
      fi
    fi
  fi
fi

# ============================================================
# SUMMARY
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -gt 0 ]; then
  echo "  ❌ SCOPE DECLARATION POLICY GATE: FAIL"
  echo "  $ERRORS error(s)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
else
  echo "  ✅ SCOPE DECLARATION POLICY GATE: PASS"
  echo "  0 errors"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
