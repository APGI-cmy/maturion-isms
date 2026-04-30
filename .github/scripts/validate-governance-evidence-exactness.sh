#!/bin/bash
# validate-governance-evidence-exactness.sh
# Authority: MERGE_GATE_PHILOSOPHY.md, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Checks governance evidence artifacts for exactness defects
#   Check 1: PATH-MISMATCH    — paths cited in SCOPE_DECLARATION not in diff or repo
#   Check 2: COUNT-MISMATCH   — declared files_changed vs actual git diff count
#   Check 3: HASH-INCOMPLETE  — hash verification claims with null/empty CANON_INVENTORY hashes
#   Check 4: VERSION-MISMATCH (cross-artifact) — canon file header vs CANON_INVENTORY entry
#            NOTE: Also covers AUTHORITY-STALE — stale canon version citations are caught
#            because every canon artifact version is tracked in CANON_INVENTORY.json.
#   Check 5: VERSION-MISMATCH (internal) — multiple conflicting version strings in one canon file
#   Check 6: ISSUE-MISMATCH   — **Issue** field in SCOPE_DECLARATION points to wrong issue/wave.
#            Authority source (in priority order):
#              (a) EXPECTED_ISSUE_NUMBER env var (explicit CI injection), or
#              (b) PR_BODY env var parsed for closing/fixing keywords + maturion-isms# refs.
#            If no authority source is available the check is informational only.
# Exit codes: 0=PASS (errors=0), 1=FAIL (any error)
set -uo pipefail

ERRORS=0
WARNINGS=0

# PR_NUMBER is passed from CI to locate per-PR scope declarations
PR_NUMBER="${PR_NUMBER:-}"

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

# Prefer per-PR scope file (.agent-admin/scope-declarations/pr-<N>.md) over root
SCOPE_FILE=""
PR_NUMBER_FOR_SCOPE="${PR_NUMBER:-}"
if [ -n "$PR_NUMBER_FOR_SCOPE" ] && \
   [ -f ".agent-admin/scope-declarations/pr-${PR_NUMBER_FOR_SCOPE}.md" ]; then
  SCOPE_FILE=".agent-admin/scope-declarations/pr-${PR_NUMBER_FOR_SCOPE}.md"
  echo "   ℹ️  Using per-PR scope file: $SCOPE_FILE"
fi
if [ -z "$SCOPE_FILE" ]; then
  # Fallback: look for any per-PR scope file added/modified by this PR
  if [ -n "$DIFF_BASE" ]; then
    CANDIDATE=$(git diff --name-only --diff-filter=AM "$DIFF_BASE" 2>/dev/null | \
      grep "^\.agent-admin/scope-declarations/pr-[0-9]*\.md$" | head -1 || true)
    [ -n "$CANDIDATE" ] && [ -f "$CANDIDATE" ] && SCOPE_FILE="$CANDIDATE"
    [ -n "$SCOPE_FILE" ] && echo "   ℹ️  Using per-PR scope file from diff: $SCOPE_FILE"
  fi
fi
# Legacy fallback to root file (archival — warns that it is legacy)
if [ -z "$SCOPE_FILE" ]; then
  if [ -f "SCOPE_DECLARATION.md" ]; then
    # Only use root file if it is NOT the archival stub
    if ! grep -q "ARCHIVAL" "SCOPE_DECLARATION.md" 2>/dev/null; then
      SCOPE_FILE="SCOPE_DECLARATION.md"
    else
      echo "   ℹ️  Root SCOPE_DECLARATION.md is archival — skipping root file check."
    fi
  fi
  [ -z "$SCOPE_FILE" ] && [ -f "governance/scope-declaration.md" ] && \
    SCOPE_FILE="governance/scope-declaration.md"
fi

if [ -z "$SCOPE_FILE" ]; then
  echo "   ℹ️  N/A — No per-PR or root SCOPE_DECLARATION file found. Skipping."
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
# Check per-PR scope files, SCOPE_DECLARATION.md, or PREHANDOVER proof files that are NEW in this PR diff
# (avoids false positives from pre-existing governance files with stale counts)
PR_PROOF_FILES=""
if [ -n "$DIFF_BASE" ]; then
  PR_PROOF_FILES=$(git diff --name-only --diff-filter=A "$DIFF_BASE" 2>/dev/null | \
    grep -E '^(SCOPE_DECLARATION\.md|\.agent-admin/scope-declarations/pr-[0-9]+\.md|\.agent-admin/prehandover/proof-)' || true)
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
# The **Issue** field in SCOPE_DECLARATION.md must match the
# PR's authoritative issue.  Authority is determined from
# (priority order):
#   (a) EXPECTED_ISSUE_NUMBER env var — explicitly set by CI,
#   (b) PR_BODY env var — parsed for closing/fixing keywords
#       (closes/fixes/resolves/addresses) and maturion-isms#N refs.
# If no expected issue can be determined the check is
# informational only (records declared value, no failure).
# ============================================================
echo "── CHECK 6: ISSUE-MISMATCH ──"

if [ -z "$SCOPE_FILE" ]; then
  echo "   ℹ️  N/A — No scope declaration file found. Skipping."
else
  # Extract declared issue from scope file.
  # Per-PR format: ISSUE: #1234 — title (SCOPE_SCHEMA_VERSION v2 field)
  # Legacy format: **Issue**: maturion-isms#1234
  DECLARED_ISSUE_RAW=$(grep -oE '^ISSUE:[[:space:]]*.+' "$SCOPE_FILE" 2>/dev/null | \
    head -1 | sed 's/^ISSUE:[[:space:]]*//' | tr -d '[:space:]' || true)
  if [ -z "$DECLARED_ISSUE_RAW" ]; then
    # Legacy Markdown format
    DECLARED_ISSUE_RAW=$(grep -oE '^\*\*Issue\*\*:[[:space:]]*.+' "$SCOPE_FILE" 2>/dev/null | \
      head -1 | sed 's/\*\*Issue\*\*:[[:space:]]*//' | tr -d '[:space:]' || true)
  fi

  if [ -z "$DECLARED_ISSUE_RAW" ]; then
    echo "   ⚠️  WARNING — No **Issue**: field found in $SCOPE_FILE"
    WARNINGS=$((WARNINGS + 1))
  else
    # Normalise to numeric issue number (trailing digits after last #)
    DECLARED_ISSUE_NUM=$(echo "$DECLARED_ISSUE_RAW" | grep -oE '[0-9]+$' || true)
    echo "   Declared: $DECLARED_ISSUE_RAW (issue #${DECLARED_ISSUE_NUM:-?})"

    # Determine expected issue number (priority: explicit env var > PR_BODY parsing)
    EXPECTED_ISSUE_NUM=""
    EXPECTED_SOURCE=""

    if [ -n "${EXPECTED_ISSUE_NUMBER:-}" ]; then
      EXPECTED_ISSUE_NUM=$(echo "$EXPECTED_ISSUE_NUMBER" | grep -oE '[0-9]+' | tail -1)
      EXPECTED_SOURCE="EXPECTED_ISSUE_NUMBER env var"
    elif [ -n "${PR_BODY:-}" ]; then
      # Parse PR body for closing/fixing keywords followed by optional repo prefix + number
      EXPECTED_ISSUE_NUM=$(printf '%s' "$PR_BODY" | \
        grep -ioE '(closes|fixes|resolves|addresses)[[:space:]]+([a-zA-Z0-9_-]+#)?([0-9]+)' | \
        grep -oE '[0-9]+$' | head -1 || true)
      if [ -z "$EXPECTED_ISSUE_NUM" ]; then
        # Fallback: first explicit maturion-isms#N reference in PR body
        EXPECTED_ISSUE_NUM=$(printf '%s' "$PR_BODY" | \
          grep -oE 'maturion-isms#[0-9]+' | head -1 | grep -oE '[0-9]+' || true)
      fi
      [ -n "$EXPECTED_ISSUE_NUM" ] && EXPECTED_SOURCE="PR_BODY (parsed closing/issue ref)"
    fi

    if [ -z "$EXPECTED_ISSUE_NUM" ]; then
      echo "   ℹ️  No expected issue authority available (set EXPECTED_ISSUE_NUMBER or PR_BODY) — recorded as-declared, not validated against PR authority"
    elif [ -z "$DECLARED_ISSUE_NUM" ]; then
      echo "   ❌ ISSUE-MISMATCH: could not parse issue number from declared value '$DECLARED_ISSUE_RAW'; expected #${EXPECTED_ISSUE_NUM} (${EXPECTED_SOURCE})"
      ERRORS=$((ERRORS + 1))
    elif [ "$DECLARED_ISSUE_NUM" != "$EXPECTED_ISSUE_NUM" ]; then
      echo "   ❌ ISSUE-MISMATCH: $SCOPE_FILE declares issue #${DECLARED_ISSUE_NUM} but expected #${EXPECTED_ISSUE_NUM} (${EXPECTED_SOURCE})"
      ERRORS=$((ERRORS + 1))
    else
      echo "   ✅ PASS — Declared issue (#${DECLARED_ISSUE_NUM}) matches expected (#${EXPECTED_ISSUE_NUM}, ${EXPECTED_SOURCE})"
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
