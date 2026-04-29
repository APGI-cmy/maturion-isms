#!/bin/bash
# IAA Final Assurance Gate
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_HANDOVER_AUTOMATION.md
# Purpose: Hard CI gate that fails when implementation/substantive files are changed
#          but no current, PR-specific IAA final assurance evidence is present.
#          Governance paperwork (PREHANDOVER proof alone) is NOT sufficient —
#          a committed IAA-produced token artifact is required.
# Violation class: IAA-FINAL-GATE-001
# Issue: maturion-isms#1518

set -euo pipefail

echo "=== IAA Final Assurance Gate ==="
echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_HANDOVER_AUTOMATION.md"
echo "Violation class: IAA-FINAL-GATE-001"
echo ""

# ----------------------------------------------------------------
# Environment variables (set by caller / GitHub Actions workflow)
# ----------------------------------------------------------------
BASE_SHA="${BASE_SHA:-}"
HEAD_SHA="${HEAD_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_LABELS="${PR_LABELS:-}"
PR_BODY="${PR_BODY:-}"
EXPECTED_ISSUE_NUMBER="${EXPECTED_ISSUE_NUMBER:-}"
ASSURANCE_DIR=".agent-admin/assurance"

# ----------------------------------------------------------------
# CS2 sign-off bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"CS sign-off: approved"* ]]; then
  echo "✅ PASS — PR carries 'CS sign-off: approved' label."
  echo "   IAA final assurance gate waived per CS2 supreme authority."
  exit 0
fi

# ----------------------------------------------------------------
# Automated governance PR bypass
# ----------------------------------------------------------------
if [[ "$PR_LABELS" == *"governance"* ]] && \
   [[ "$PR_LABELS" == *"automated"* ]] && \
   [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  echo "✅ PASS — Automated governance alignment PR — IAA final assurance gate bypassed."
  exit 0
fi

# ----------------------------------------------------------------
# Require BASE_SHA
# ----------------------------------------------------------------
if [ -z "$BASE_SHA" ]; then
  echo "❌ ERROR: BASE_SHA env var not set. This gate requires the PR base SHA."
  exit 1
fi

echo "PR Number    : ${PR_NUMBER:-<not provided>}"
echo "HEAD SHA     : ${HEAD_SHA:0:12}..."
echo "Issue Number : ${EXPECTED_ISSUE_NUMBER:-<not provided>}"
echo ""

# ----------------------------------------------------------------
# Step 1: Detect implementation/substantive file changes
# ----------------------------------------------------------------
echo "--- Step 1: Implementation/Substantive File Detection ---"
echo ""

CHANGED_FILES=$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || \
                git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null || true)

if [ -z "$CHANGED_FILES" ]; then
  echo "ℹ️  No changed files detected — IAA final assurance gate: not required."
  exit 0
fi

IMPLEMENTATION_CHANGED=false
IMPL_FILE_LIST=""
DOCS_ONLY_FILES=""
ALL_DOCS_ONLY=true

while IFS= read -r file; do
  [ -z "$file" ] && continue

  # ── Supervision / governance / CI-tooling paths — do NOT trigger IAA gate ──
  #
  # IAA final assurance is required for production source code changes only.
  # The following are governance/supervision artifacts, not implementation:
  #   - Agent workspace files (.agent-workspace/, .agent-admin/)
  #   - All markdown files (documentation, governance, PREHANDOVER proofs, etc.)
  #   - Governance canon, checklists, templates, SCOPE_DECLARATION.md
  #   - CI scripts and workflows (.github/)
  #   - Config files at repo root (package.json, tsconfig, .eslint, etc.)
  #
  # Aligns with polc-boundary-gate.yml implementation detection:
  #   modules/.*/src, apps/.*/src, packages/.*/src, supabase/functions, test files

  # Agent workspace / admin artifacts
  if [[ "$file" =~ ^\.agent-workspace/ ]] || [[ "$file" =~ ^\.agent-admin/ ]]; then
    DOCS_ONLY_FILES="${DOCS_ONLY_FILES}\n  - ${file}"
    continue
  fi

  # All markdown files (docs, governance, PREHANDOVER proofs, session memory)
  if [[ "$file" =~ \.md$ ]]; then
    DOCS_ONLY_FILES="${DOCS_ONLY_FILES}\n  - ${file}"
    continue
  fi

  # CI/governance tooling — scripts, workflows, agent contracts
  if [[ "$file" =~ ^\.github/ ]]; then
    DOCS_ONLY_FILES="${DOCS_ONLY_FILES}\n  - ${file}"
    continue
  fi

  # Governance directory — canon, checklists, templates, SCOPE_DECLARATION
  if [[ "$file" =~ ^governance/ ]] || [[ "$file" =~ ^SCOPE_DECLARATION ]] || \
     [[ "$file" =~ ^README ]] || [[ "$file" =~ ^CHANGELOG ]]; then
    DOCS_ONLY_FILES="${DOCS_ONLY_FILES}\n  - ${file}"
    continue
  fi

  # ── Production source code — triggers IAA gate ───────────────────────────
  # Only trigger for application source code (same scope as POLC gate):
  #   modules/.*/src/**  |  apps/.*/src/**  |  packages/.*/src/**
  #   supabase/functions/**  |  test/spec files in those directories
  if [[ "$file" =~ ^(modules|apps|packages)/[^/]+/src/ ]] || \
     [[ "$file" =~ ^(modules|apps|packages)/[^/]+/tests?/ ]] || \
     [[ "$file" =~ ^supabase/functions/ ]] || \
     [[ "$file" =~ ^supabase/migrations/ ]] || \
     [[ "$file" =~ \.(ts|tsx|js|jsx|py|sql)$ ]]; then
    ALL_DOCS_ONLY=false
    IMPLEMENTATION_CHANGED=true
    IMPL_FILE_LIST="${IMPL_FILE_LIST}\n  - ${file}"
  else
    # Everything else (config files, other non-source assets) — supervision
    DOCS_ONLY_FILES="${DOCS_ONLY_FILES}\n  - ${file}"
  fi

done <<< "$CHANGED_FILES"

if [ "$ALL_DOCS_ONLY" = true ] || [ "$IMPLEMENTATION_CHANGED" = false ]; then
  echo "ℹ️  PR contains only documentation/supervision changes — IAA final assurance not required."
  if [ -n "$DOCS_ONLY_FILES" ]; then
    echo "   Documentation/supervision files:"
    echo -e "$DOCS_ONLY_FILES"
  fi
  exit 0
fi

echo "Implementation/substantive files changed:"
echo -e "$IMPL_FILE_LIST"
echo ""
echo "IAA final assurance gate: REQUIRED"
echo ""

# ----------------------------------------------------------------
# Step 2: Find IAA final tokens NEW or MODIFIED in this PR
# ----------------------------------------------------------------
echo "--- Step 2: IAA Final Assurance Token Search ---"
echo ""

# Tokens introduced or updated by this PR only (not inherited from base)
TOKEN_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-token-.*\.md$" || true)

# Wave record files with ## TOKEN section, introduced or updated by this PR
WAVE_RECORD_FILES_IN_PR=$(git diff "${BASE_SHA}...HEAD" --name-only --diff-filter=AM 2>/dev/null \
  | grep "^${ASSURANCE_DIR}/iaa-wave-record-.*\.md$" || true)

VALID_TOKEN_FOUND=false
FAIL=false
FAIL_REASONS=""

# ── Parse expected issue number from PR body if not supplied directly ────────
if [ -z "$EXPECTED_ISSUE_NUMBER" ] && [ -n "$PR_BODY" ]; then
  EXPECTED_ISSUE_NUMBER=$(echo "$PR_BODY" | \
    grep -ioE '(closes|fixes|resolves|addresses)[[:space:]]+(maturion-isms)?#([0-9]+)' | \
    grep -oE '[0-9]+$' | head -1 || true)
fi

echo "Scanning for IAA token files introduced/modified by this PR..."
echo "  Token files : $(echo "$TOKEN_FILES_IN_PR" | grep -c . || echo 0)"
echo "  Wave records: $(echo "$WAVE_RECORD_FILES_IN_PR" | grep -c . || echo 0)"
echo ""

# ── Validate each iaa-token-*.md file ────────────────────────────────────────
while IFS= read -r token_file; do
  [ -z "$token_file" ] && continue
  [ ! -f "$token_file" ] && continue

  echo "Checking token file: $token_file"
  FILE_VALID=true

  # Check A: Not a REJECTION-PACKAGE
  if head -15 "$token_file" 2>/dev/null | grep -qi "REJECTION[-.]PACKAGE\|REJECTION-PACKAGE"; then
    echo "  ❌ REJECTION-PACKAGE — this is not a valid final assurance token [IAA-FINAL-GATE-003]"
    FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: REJECTION-PACKAGE (fix all findings and re-invoke IAA)"
    FILE_VALID=false
    FAIL=true
    continue
  fi

  # Check B: PHASE_B_BLOCKING_TOKEN present, non-empty, non-PENDING
  TOKEN_VALUE=$(grep "PHASE_B_BLOCKING_TOKEN:" "$token_file" 2>/dev/null | head -1 | \
    sed 's/.*PHASE_B_BLOCKING_TOKEN://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

  if [ -z "$TOKEN_VALUE" ]; then
    echo "  ❌ PHASE_B_BLOCKING_TOKEN missing or empty [IAA-FINAL-GATE-001]"
    FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: PHASE_B_BLOCKING_TOKEN field missing or empty"
    FILE_VALID=false
    FAIL=true
  elif [ "$TOKEN_VALUE" = "PENDING" ]; then
    echo "  ❌ PHASE_B_BLOCKING_TOKEN is PENDING — IAA invocation not yet complete [IAA-FINAL-GATE-002]"
    FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: PHASE_B_BLOCKING_TOKEN = PENDING (IAA not yet finalised)"
    FILE_VALID=false
    FAIL=true
  else
    echo "  ✅ PHASE_B_BLOCKING_TOKEN: $TOKEN_VALUE"
  fi

  # Check C: Verdict must not be a blocking/rejection verdict
  # Parse both plain `Verdict:` and Markdown `**Verdict**:` / `- **Verdict**:` formats.
  VERDICT_LINE=$(grep -iE \
    "^[[:space:]]*(-[[:space:]]*)?\*\*[Vv]erdict\*\*[[:space:]]*:[[:space:]]|^[[:space:]]*(Verdict|VERDICT):[[:space:]]" \
    "$token_file" 2>/dev/null | head -1 || true)
  if echo "$VERDICT_LINE" | grep -qi "REJECTION\|BLOCKED\|FAIL\|REJECT"; then
    echo "  ❌ IAA verdict is rejection/blocking: $VERDICT_LINE [IAA-FINAL-GATE-004]"
    FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: verdict is blocking/rejection"
    FILE_VALID=false
    FAIL=true
  else
    # Fallback: scan entire file for any verdict line containing blocking keywords,
    # catching format variations (e.g. **Verdict**: ASSURANCE-TOKEN (FAIL)) that the
    # primary grep may have missed.
    FALLBACK_BLOCK=$(grep -iE "[Vv]erdict[[:space:]]*:[[:space:]]*.*\b(REJECTION|BLOCKED|REJECT|FAIL)\b" \
      "$token_file" 2>/dev/null | head -1 || true)
    if [ -n "$FALLBACK_BLOCK" ]; then
      echo "  ❌ IAA verdict is rejection/blocking: $FALLBACK_BLOCK [IAA-FINAL-GATE-004]"
      FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: verdict is blocking/rejection"
      FILE_VALID=false
      FAIL=true
    else
      if [ -n "$VERDICT_LINE" ]; then
        echo "  ✅ Verdict line: $VERDICT_LINE"
      fi
    fi
  fi

  # Check D: PR reference — compare only the dedicated PR field in the token
  if [ -n "$PR_NUMBER" ]; then
    TOKEN_PR_LINE=$(grep -iE '^[[:space:]]*(-[[:space:]]*)?\*\*PR\*\*:[[:space:]]*#?[0-9]+' \
      "$token_file" 2>/dev/null | head -1 || true)
    TOKEN_PR_NUMBER=$(echo "$TOKEN_PR_LINE" | grep -oE '#?[0-9]+' | head -1 | tr -d '#' || true)

    if [ -n "$TOKEN_PR_NUMBER" ]; then
      if [ "$TOKEN_PR_NUMBER" != "$PR_NUMBER" ]; then
        echo "  ❌ Token references a different PR (#${TOKEN_PR_NUMBER}) — stale or wrong PR token [IAA-FINAL-GATE-005]"
        FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: references PR #${TOKEN_PR_NUMBER}, not current PR #${PR_NUMBER}"
        FILE_VALID=false
        FAIL=true
      else
        echo "  ✅ PR reference correct (current PR: #${PR_NUMBER})"
      fi
    else
      echo "  ✅ No dedicated PR field found to conflict with current PR #${PR_NUMBER}"
    fi
  fi

  # Check E: Issue reference — token must not reference a DIFFERENT governing issue
  if [ -n "$EXPECTED_ISSUE_NUMBER" ]; then
    # Look for any maturion-isms#NNNN or Issue: NNNN that is NOT the expected issue
    OTHER_ISSUE=$(grep -oiE '(maturion-isms#|Issue:[[:space:]]*)([0-9]+)' \
      "$token_file" 2>/dev/null | grep -oE '[0-9]+$' | \
      grep -v "^${EXPECTED_ISSUE_NUMBER}$" | head -1 || true)
    if [ -n "$OTHER_ISSUE" ]; then
      echo "  ❌ Token references issue #${OTHER_ISSUE}, not governing issue #${EXPECTED_ISSUE_NUMBER} [IAA-FINAL-GATE-006]"
      FAIL_REASONS="${FAIL_REASONS}\n  - ${token_file}: references issue #${OTHER_ISSUE} (expected #${EXPECTED_ISSUE_NUMBER})"
      FILE_VALID=false
      FAIL=true
    else
      echo "  ✅ Issue reference correct (governing issue: #${EXPECTED_ISSUE_NUMBER})"
    fi
  fi

  if [ "$FILE_VALID" = true ]; then
    VALID_TOKEN_FOUND=true
    echo "  ✅ Token file VALID: $token_file"
  fi
  echo ""

done <<< "$TOKEN_FILES_IN_PR"

# ── Check wave record files for ## TOKEN section ─────────────────────────────
while IFS= read -r wave_file; do
  [ -z "$wave_file" ] && continue
  [ ! -f "$wave_file" ] && continue

  if grep -q "^## TOKEN" "$wave_file" 2>/dev/null; then
    echo "Checking wave record (## TOKEN section): $wave_file"
    WR_TOKEN_VALUE=$(awk '/^## TOKEN/{found=1} found && /PHASE_B_BLOCKING_TOKEN:/{print; exit}' \
      "$wave_file" 2>/dev/null | \
      sed 's/.*PHASE_B_BLOCKING_TOKEN://;s/^[[:space:]]*//;s/[[:space:]]*$//' || true)

    if [ -n "$WR_TOKEN_VALUE" ] && \
       [ "$WR_TOKEN_VALUE" != "PENDING" ] && \
       ! echo "$WR_TOKEN_VALUE" | grep -qi "REJECTION"; then
      echo "  ✅ PHASE_B_BLOCKING_TOKEN in wave record: $WR_TOKEN_VALUE"
      VALID_TOKEN_FOUND=true
    else
      echo "  ⚠️  ## TOKEN section found but PHASE_B_BLOCKING_TOKEN is missing/PENDING/REJECTION"
    fi
    echo ""
  fi

done <<< "$WAVE_RECORD_FILES_IN_PR"

# ----------------------------------------------------------------
# Step 3: Verdict
# ----------------------------------------------------------------
echo "--- Step 3: Verdict ---"
echo ""

if [ "$VALID_TOKEN_FOUND" = false ] && [ "$FAIL" = false ]; then
  FAIL=true
  FAIL_REASONS="${FAIL_REASONS}\n  - No current PR-specific IAA final assurance token found in ${ASSURANCE_DIR}/"
fi

if [ "$FAIL" = true ]; then
  echo "❌ FAIL — IAA Final Assurance Gate: BLOCKED"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "🚨 IAA-FINAL-GATE-001: IMPLEMENTATION PR WITHOUT VALID FINAL IAA ASSURANCE"
  echo ""
  echo "Failure reasons:"
  echo -e "$FAIL_REASONS"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "REQUIRED ACTIONS — this PR CANNOT pass governance unless the"
  echo "following artifacts exist and are current to this PR's head SHA:"
  echo ""
  echo "STEP 1 — Classify changed paths and determine ECAP requirement"
  echo "  - Scan all changed files for protected paths"
  echo "  - Record protected_path_touched and ecap_required in PREHANDOVER proof"
  echo "  - If ecap_required: true → complete ECAP ceremony BEFORE invoking IAA"
  echo ""
  echo "STEP 2 — Invoke execution-ceremony-admin-agent if ECAP required"
  echo "  - If protected paths touched: task(agent_type: 'execution-ceremony-admin-agent')"
  echo "  - Provide: wave context, changed file list, PREHANDOVER draft, session memory"
  echo "  - ECAP must produce an ecap_verdict: PASS artifact before IAA invocation"
  echo ""
  echo "STEP 3 — Invoke IAA for FINAL ASSURANCE (not just pre-brief)"
  echo "  - task(agent_type: 'independent-assurance-agent')"
  echo "  - Provide ALL of the following:"
  echo "    * Current PR number: #${PR_NUMBER:-<PR_NUMBER>}"
  echo "    * Governing issue number: #${EXPECTED_ISSUE_NUMBER:-<ISSUE_NUMBER>}"
  echo "    * HEAD SHA (reviewed commit): ${HEAD_SHA:-<HEAD_SHA>}"
  echo "    * Complete changed-file list: git diff --name-only"
  echo "    * PREHANDOVER proof path + content"
  echo "    * Session memory path + content"
  echo "    * Test/CI status evidence (all checks GREEN)"
  echo "    * ECAP ceremony evidence (if ECAP was required)"
  echo "    * Any open review findings"
  echo ""
  echo "STEP 4 — Commit the IAA-produced token artifact"
  echo "  - IAA must commit a token file to:"
  echo "    .agent-admin/assurance/iaa-token-session-NNN-wave-<slug>-YYYYMMDD.md"
  echo "  - OR populate the ## TOKEN section of the wave record:"
  echo "    .agent-admin/assurance/iaa-wave-record-<slug>-YYYYMMDD.md"
  echo "  - The artifact MUST contain:"
  echo "    * PHASE_B_BLOCKING_TOKEN: <non-empty, non-PENDING value>"
  echo "    * Final verdict: PASS or PASS_WITH_CS2_WAIVER"
  echo "    * Reference to current PR (#${PR_NUMBER:-NNN}) or HEAD SHA"
  echo ""
  echo "STEP 5 — Do NOT mark merge-ready until CI confirms all gates GREEN"
  echo "  - Foreman PREHANDOVER proof alone is NOT evidence of IAA invocation"
  echo "  - Claims of 'Quality Professor PASS' or 'merge-ready' are not accepted"
  echo "    without the committed IAA token artifact above"
  echo ""
  echo "If IAA returns a REJECTION-PACKAGE:"
  echo "  - Fix ALL cited findings"
  echo "  - Regenerate PREHANDOVER proof (new commit)"
  echo "  - Re-invoke IAA (you own this loop — do not skip)"
  echo ""
  echo "Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | AGENT_HANDOVER_AUTOMATION.md"
  echo "Violation: IAA-FINAL-GATE-001 (implementation PR without current IAA assurance)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 1
fi

echo "✅ PASS — IAA Final Assurance Gate passed."
echo "   Valid, current, PR-specific IAA final assurance token confirmed."
