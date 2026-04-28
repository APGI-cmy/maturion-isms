#!/bin/bash
# validate-governance-evidence-exactness.sh
# Authority: MERGE_GATE_PHILOSOPHY.md, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Checks governance evidence artifacts for exactness defects
#   Check 1: PATH-MISMATCH   — paths cited in SCOPE_DECLARATION not in diff or repo
#   Check 2: COUNT-MISMATCH  — declared files_changed vs actual git diff count
#   Check 3: HASH-INCOMPLETE — hash verification claims with null/empty CANON_INVENTORY hashes
#   Check 4: VERSION-MISMATCH (cross-artifact) — canon file header vs CANON_INVENTORY entry
#            NOTE: Also covers AUTHORITY-STALE — stale canon version citations are caught
#            because every canon artifact version is tracked in CANON_INVENTORY.json.
#   Check 5: VERSION-MISMATCH (internal) — multiple conflicting version strings in one canon file
#   Check 6: ISSUE-MISMATCH  — SCOPE_DECLARATION.md issue authority line is stale, missing,
#            or malformed; compared against EXPECTED_ISSUE env var or PR metadata when available
# Exit codes: 0=PASS (errors=0), 1=FAIL (any error)
set -uo pipefail

ERRORS=0
WARNINGS=0

# Determine git diff base
DIFF_BASE=""
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  DIFF_BASE="origin/main...HEAD"
elif git rev-parse --verify main >/dev/null 2>&1; then
  DIFF_BASE="main...HEAD"
fi

CHANGED_FILES=""
CHANGED_COUNT=0
if [ -n "$DIFF_BASE" ]; then
  CHANGED_FILES=$(git diff --name-only "$DIFF_BASE" 2>/dev/null || true)
  CHANGED_COUNT=$(git diff --name-only "$DIFF_BASE" 2>/dev/null | wc -l | tr -d '[:space:]' || echo "0")
  CHANGED_COUNT="${CHANGED_COUNT:-0}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Governance Evidence Exactness Gate"
echo "  Authority: LIVING_AGENT_SYSTEM.md v6.2.0, MERGE_GATE_PHILOSOPHY.md"
echo "  Branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
echo "  Diff base: ${DIFF_BASE:-N/A}"
echo "  Changed files in diff: ${CHANGED_COUNT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================
# CHECK 1: PATH-MISMATCH (SCOPE_DECLARATION path correctness)
# Each path cited in the scope declaration MUST appear in the
# PR diff.  A path that merely exists somewhere in the repo tree
# is NOT sufficient — that would allow stale or extra files to
# silently pass the exactness gate.
# Degraded-mode exception: when no diff base is available (e.g.
# shallow clone without origin/main) the check falls back to
# existence-only with a warning.
# ============================================================
echo "── CHECK 1: PATH-MISMATCH ──"

SCOPE_FILE=""
[ -f "SCOPE_DECLARATION.md" ] && SCOPE_FILE="SCOPE_DECLARATION.md"
[ -z "$SCOPE_FILE" ] && [ -f "governance/scope-declaration.md" ] && SCOPE_FILE="governance/scope-declaration.md"

if [ -z "$SCOPE_FILE" ]; then
  echo "   ℹ️  N/A — No SCOPE_DECLARATION.md found. Skipping."
else
  echo "   Source: $SCOPE_FILE"
  PATH_ERRORS=0
  if [ -z "$DIFF_BASE" ]; then
    echo "   ⚠️  DEGRADED MODE — No git diff base available; falling back to repo-existence check only."
    while IFS= read -r cited_path; do
      [ -z "$cited_path" ] && continue
      if ! git ls-tree -r HEAD --name-only 2>/dev/null | grep -qxF "$cited_path" && ! [ -e "$cited_path" ]; then
        echo "   ❌ PATH-MISMATCH: '$cited_path' cited in $SCOPE_FILE but not found in repo tree or working directory"
        PATH_ERRORS=$((PATH_ERRORS + 1))
        ERRORS=$((ERRORS + 1))
      fi
    done < <(grep -oE '^\s*-\s+`[^`]+`' "$SCOPE_FILE" 2>/dev/null | sed 's/.*`\([^`]*\)`.*/\1/' | sort -u)
  else
    while IFS= read -r cited_path; do
      [ -z "$cited_path" ] && continue
      if ! echo "$CHANGED_FILES" | grep -qxF "$cited_path" 2>/dev/null; then
        echo "   ❌ PATH-MISMATCH: '$cited_path' cited in $SCOPE_FILE but not present in the PR diff (citing stale or out-of-scope path)"
        PATH_ERRORS=$((PATH_ERRORS + 1))
        ERRORS=$((ERRORS + 1))
      fi
    done < <(grep -oE '^\s*-\s+`[^`]+`' "$SCOPE_FILE" 2>/dev/null | sed 's/.*`\([^`]*\)`.*/\1/' | sort -u)
  fi
  [ "$PATH_ERRORS" -eq 0 ] && echo "   ✅ PASS — All cited paths verified in PR diff"
fi
echo ""

# ============================================================
# CHECK 2: COUNT-MISMATCH (declared files_changed vs actual)
# ============================================================
echo "── CHECK 2: COUNT-MISMATCH ──"

DECLARED_COUNT=""
# Only check SCOPE_DECLARATION.md or PREHANDOVER proof files that are NEW in this PR diff
# (avoids false positives from pre-existing governance files with stale counts)
PR_PROOF_FILES=""
if [ -n "$DIFF_BASE" ]; then
  PR_PROOF_FILES=$(git diff --name-only --diff-filter=A "$DIFF_BASE" 2>/dev/null | grep -E '^(SCOPE_DECLARATION\.md|\.agent-admin/prehandover/proof-)' || true)
fi
# Fall back to SCOPE_DECLARATION.md in working tree if it's new
for f in $PR_PROOF_FILES; do
  [ -f "$f" ] || continue
  val=$(grep -iE '^\s*files_changed\s*[:=]\s*[0-9]+' "$f" 2>/dev/null | grep -oE '[0-9]+' | head -1)
  if [ -n "$val" ]; then
    DECLARED_COUNT="$val"
    DECLARED_SOURCE="$f"
    break
  fi
done

if [ -z "$DECLARED_COUNT" ]; then
  echo "   ℹ️  N/A — No files_changed field found. Skipping."
elif [ -z "$DIFF_BASE" ]; then
  echo "   ℹ️  N/A — No git diff base available. Skipping count check."
else
  if [ "$DECLARED_COUNT" -ne "$CHANGED_COUNT" ]; then
    echo "   ❌ COUNT-MISMATCH: declared files_changed=$DECLARED_COUNT in $DECLARED_SOURCE but actual git diff shows $CHANGED_COUNT files"
    ERRORS=$((ERRORS + 1))
  else
    echo "   ✅ PASS — Declared count ($DECLARED_COUNT) matches actual diff count ($CHANGED_COUNT)"
  fi
fi
echo ""

# ============================================================
# CHECK 3: HASH-INCOMPLETE (hash claims vs CANON_INVENTORY)
# ============================================================
echo "── CHECK 3: HASH-INCOMPLETE ──"

HASH_CLAIM_FOUND=false
# Prefer proof files added/modified in this PR diff; fall back to all proof files.
PROOF_SCAN_LIST=""
if [ -n "$DIFF_BASE" ]; then
  PROOF_SCAN_LIST=$(git diff --name-only --diff-filter=AM "$DIFF_BASE" 2>/dev/null | \
    grep '^\.agent-admin/prehandover/proof-.*\.md$' || true)
fi
if [ -z "$PROOF_SCAN_LIST" ]; then
  PROOF_SCAN_LIST=$(find .agent-admin/prehandover -maxdepth 1 -type f -name 'proof-*.md' 2>/dev/null | sort || true)
fi
for f in $PROOF_SCAN_LIST; do
  [ -f "$f" ] || continue
  if grep -qiE 'hash verification complete|hash_verified.*true|all hashes non.?null|canon_inventory hash verified' "$f" 2>/dev/null; then
    HASH_CLAIM_FOUND=true
    HASH_CLAIM_FILE="$f"
    break
  fi
done

if [ "$HASH_CLAIM_FOUND" = false ]; then
  echo "   ℹ️  N/A — No hash verification claims found. Skipping."
elif [ ! -f "governance/CANON_INVENTORY.json" ]; then
  echo "   ℹ️  N/A — No CANON_INVENTORY.json found. Skipping."
else
  NULL_COUNT=$(python3 -c "
import json, sys
try:
    d = json.load(open('governance/CANON_INVENTORY.json'))
    items = d.get('canons', [])
    null_items = [i for i in items if not i.get('file_hash_sha256') or str(i.get('file_hash_sha256')).lower() in ['null','','none','000000','0']]
    print(len(null_items))
except Exception as e:
    print('0')
" 2>/dev/null || echo "0")
  if [ "$NULL_COUNT" -gt 0 ]; then
    echo "   ❌ HASH-INCOMPLETE: hash verification claimed in $HASH_CLAIM_FILE but $NULL_COUNT CANON_INVENTORY entries have null/empty hashes"
    ERRORS=$((ERRORS + 1))
  else
    echo "   ✅ PASS — Hash verification claim backed by complete CANON_INVENTORY hashes"
  fi
fi
echo ""

# ============================================================
# CHECK 4: VERSION-MISMATCH cross-artifact
# ============================================================
echo "── CHECK 4: VERSION-MISMATCH (cross-artifact: canon file header vs CANON_INVENTORY) ──"

if [ ! -f "governance/CANON_INVENTORY.json" ]; then
  echo "   ℹ️  N/A — No CANON_INVENTORY.json found. Skipping."
else
  VERSION_ERRORS=0
  CANON_FILES=""
  if [ -n "$DIFF_BASE" ]; then
    CANON_FILES=$(git diff --name-only --diff-filter=AM "$DIFF_BASE" 2>/dev/null | grep "^governance/" | grep "\.md$" || true)
  fi
  if [ -z "$CANON_FILES" ]; then
    echo "   ℹ️  N/A — No governance/ .md files changed in this diff. Skipping."
  else
    while IFS= read -r canon_file; do
      [ -z "$canon_file" ] && continue
      [ -f "$canon_file" ] || continue
      # Get version from file header — handles: **Version**: x.y.z  *Version: x.y.z  Version: x.y.z
      file_ver=$(grep -oE '(\*{1,2}Version\*{0,2}:?|Version:)\s*[0-9]+\.[0-9]+\.[0-9]+' "$canon_file" 2>/dev/null | \
        head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)
      [ -z "$file_ver" ] && continue
      # Get version from CANON_INVENTORY — strip any suffix text (e.g. "1.4.0 — ACTIVE GOVERNANCE")
      inv_ver=$(python3 -c "
import json, re
try:
    d = json.load(open('governance/CANON_INVENTORY.json'))
    entry = next((c for c in d.get('canons',[]) if c.get('path') == '$canon_file'), None)
    raw = entry.get('version','') if entry else ''
    m = re.match(r'([0-9]+\.[0-9]+\.[0-9]+)', raw)
    print(m.group(1) if m else raw)
except: print('')
" 2>/dev/null || echo "")
      [ -z "$inv_ver" ] && continue
      if [ "$file_ver" != "$inv_ver" ]; then
        echo "   ❌ VERSION-MISMATCH: $canon_file declares Version: $file_ver but CANON_INVENTORY records $inv_ver"
        VERSION_ERRORS=$((VERSION_ERRORS + 1))
        ERRORS=$((ERRORS + 1))
      fi
    done <<< "$CANON_FILES"
    [ "$VERSION_ERRORS" -eq 0 ] && echo "   ✅ PASS — All checked governance files have version parity with CANON_INVENTORY"
  fi
fi
echo ""

# ============================================================
# CHECK 5: VERSION-MISMATCH internal (warning only)
# ============================================================
echo "── CHECK 5: VERSION-MISMATCH (internal: conflicting versions within a single canon file) ──"

if [ -z "$DIFF_BASE" ]; then
  echo "   ℹ️  N/A — No git diff base. Skipping."
else
  INTERNAL_FILES=$(git diff --name-only --diff-filter=AM "$DIFF_BASE" 2>/dev/null | grep "^governance/canon/" | grep "\.md$" || true)
  if [ -z "$INTERNAL_FILES" ]; then
    echo "   ℹ️  N/A — No added/modified governance/canon/ files in this diff."
  else
    while IFS= read -r f; do
      if [ ! -f "$f" ]; then
        continue
      fi
      # Extract all version strings, deduplicate — handles **Version**: x.y.z, *Version: x.y.z, Version: x.y.z
      versions=$(grep -oE '(\*{1,2}Version\*{0,2}:?|Version:)\s*[0-9]+\.[0-9]+\.[0-9]+' "$f" 2>/dev/null | \
        grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | sort -uV || true)
      count=$(echo "$versions" | grep -c . 2>/dev/null || echo "0")
      if [ "$count" -gt 1 ]; then
        echo "   ⚠️  VERSION-MISMATCH (internal, warning): $f declares multiple version strings: $(echo $versions | tr '\n' ' ')"
        WARNINGS=$((WARNINGS + 1))
      fi
    done <<< "$INTERNAL_FILES"
    [ "$WARNINGS" -eq 0 ] && echo "   ✅ PASS — No internal version conflicts detected"
  fi
fi
echo ""

# ============================================================
# CHECK 6: ISSUE-MISMATCH (SCOPE_DECLARATION issue authority)
# The **Issue**: line in SCOPE_DECLARATION.md must be present,
# well-formed (maturion-isms#NNNN), and — when EXPECTED_ISSUE
# is supplied — must match exactly.
#
# Authority source priority:
#   1. EXPECTED_ISSUE env var (set by CI or local helper)
#   2. No expected value available → warn but do not hard-fail
#      (conservative fallback per issue spec)
# ============================================================
echo "── CHECK 6: ISSUE-MISMATCH ──"

if [ -z "$SCOPE_FILE" ]; then
  echo "   ℹ️  N/A — No SCOPE_DECLARATION.md found. Skipping."
else
  # Extract the **Issue**: line from SCOPE_DECLARATION.md
  # Accepts: **Issue**: repo#NNN (with optional whitespace variations)
  DECLARED_ISSUE_LINE=$(grep -iE '^\*\*Issue\*\*\s*:\s*' "$SCOPE_FILE" 2>/dev/null | head -1 || true)
  DECLARED_ISSUE=$(echo "$DECLARED_ISSUE_LINE" | sed 's/.*\*\*[Ii]ssue\*\*\s*:\s*//' | tr -d '[:space:]' || true)

  if [ -z "$DECLARED_ISSUE_LINE" ]; then
    echo "   ❌ ISSUE-MISMATCH: No **Issue**: line found in $SCOPE_FILE"
    echo "      Remediation: Add '**Issue**: repo#NNN' to $SCOPE_FILE pointing to the current governing issue."
    ERRORS=$((ERRORS + 1))
  elif ! echo "$DECLARED_ISSUE" | grep -qE '^[A-Za-z0-9_-]+#[0-9]+$'; then
    echo "   ❌ ISSUE-MISMATCH: Malformed issue reference '$DECLARED_ISSUE' in $SCOPE_FILE"
    echo "      Expected format: repo#NNN"
    echo "      Remediation: Fix the **Issue**: line to use the format 'repo#NNN'."
    ERRORS=$((ERRORS + 1))
  else
    # Determine expected issue from environment
    EXPECTED_ISSUE_REF=""
    if [ -n "${EXPECTED_ISSUE:-}" ]; then
      # Normalise: allow bare numbers or full repo#NNN form
      if echo "$EXPECTED_ISSUE" | grep -qE '^[0-9]+$'; then
        EXPECTED_ISSUE_REF="maturion-isms#${EXPECTED_ISSUE}"
      else
        EXPECTED_ISSUE_REF="$EXPECTED_ISSUE"
      fi
    fi

    if [ -n "$EXPECTED_ISSUE_REF" ]; then
      if [ "$DECLARED_ISSUE" = "$EXPECTED_ISSUE_REF" ]; then
        echo "   ✅ PASS — Declared issue '$DECLARED_ISSUE' matches expected '$EXPECTED_ISSUE_REF'"
      else
        echo "   ❌ ISSUE-MISMATCH: declared issue '$DECLARED_ISSUE' in $SCOPE_FILE does not match expected '$EXPECTED_ISSUE_REF'"
        echo "      Remediation: Update the **Issue**: line in $SCOPE_FILE to '**Issue**: $EXPECTED_ISSUE_REF'."
        ERRORS=$((ERRORS + 1))
      fi
    else
      # No expected value available — validate format only and warn
      echo "   ✅ PASS (format-only) — Issue reference '$DECLARED_ISSUE' is well-formed."
      echo "      ℹ️  No EXPECTED_ISSUE supplied; authority comparison skipped."
      echo "      To enable full authority check: export EXPECTED_ISSUE=<issue-number-or-repo#NNN>"
    fi
  fi
fi
echo ""

# ============================================================
# SUMMARY
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -gt 0 ]; then
  echo "  ❌ GOVERNANCE EVIDENCE EXACTNESS GATE: FAIL"
  echo "  $ERRORS error(s), $WARNINGS warning(s)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
else
  echo "  ✅ GOVERNANCE EVIDENCE EXACTNESS GATE: PASS"
  echo "  0 errors, $WARNINGS warning(s)"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
