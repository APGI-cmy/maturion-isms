#!/usr/bin/env bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Gate-Changing PR Rule"
echo "  Authority: governance/canon/LIVING_AGENT_SYSTEM.md v6.2.0"
echo "  Issue: maturion-isms#1542"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [[ "${PR_LABELS:-}" == *"CS sign-off: approved"* ]]; then
  echo "✅ PASS — PR carries 'CS sign-off: approved' label."
  exit 0
fi

if [[ "${PR_LABELS:-}" == *"governance"* ]] && \
   [[ "${PR_LABELS:-}" == *"automated"* ]] && \
   [[ "${PR_LABELS:-}" == *"agent:liaison"* ]]; then
  echo "✅ PASS — Automated governance alignment PR — gate-changing rule bypassed."
  exit 0
fi

CHANGED_FILES=""
if [ -n "${BASE_SHA:-}" ]; then
  if ! CHANGED_FILES="$(git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null)"; then
    if ! CHANGED_FILES="$(git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null)"; then
      echo "❌ FAIL: Cannot compute changed files — BASE_SHA '${BASE_SHA}' is not reachable in this checkout."
      echo "  Failing closed to prevent silent gate bypass when workflow/script files may have changed."
      exit 1
    fi
  fi
elif git rev-parse origin/main >/dev/null 2>&1; then
  if ! CHANGED_FILES="$(git diff --name-only "origin/main...HEAD" 2>/dev/null)"; then
    echo "❌ FAIL: Cannot compute changed files against origin/main."
    echo "  Failing closed to prevent silent gate bypass."
    exit 1
  fi
else
  echo "❌ FAIL: Cannot compute changed files — BASE_SHA is unset and origin/main is not available."
  echo "  Failing closed to prevent silent gate bypass."
  exit 1
fi

if [ -z "$CHANGED_FILES" ]; then
  echo "✅ PASS — No files changed (empty diff against base)."
  exit 0
fi

GATE_FILES="$(echo "$CHANGED_FILES" | grep -E '^\.github/(workflows|scripts)/' || true)"
if [ -z "$GATE_FILES" ]; then
  echo "✅ PASS — No .github/workflows/ or .github/scripts/ files changed."
  exit 0
fi

echo "Gate-changing files detected:"
echo "$GATE_FILES" | while read -r f; do echo "  - $f"; done
echo ""

classify_strict_file() {
  local file="$1"
  case "$file" in
    .github/workflows/preflight*.yml|\
    .github/workflows/handover-claim-gate.yml|\
    .github/workflows/*gate*.yml|\
    .github/scripts/*gate*|\
    .github/scripts/pre-handover-checkpoint*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

STRICT_FILES=""
OP_FILES=""
while IFS= read -r changed_file; do
  [ -z "$changed_file" ] && continue
  if classify_strict_file "$changed_file"; then
    STRICT_FILES="${STRICT_FILES}${changed_file}"$'\n'
  else
    OP_FILES="${OP_FILES}${changed_file}"$'\n'
  fi
done <<< "$GATE_FILES"
STRICT_FILES="$(printf '%s' "$STRICT_FILES" | sed '/^$/d' || true)"
OP_FILES="$(printf '%s' "$OP_FILES" | sed '/^$/d' || true)"

if [ -n "$STRICT_FILES" ]; then
  echo "STRICT_GATE_LOGIC_CHANGE files:"
  echo "$STRICT_FILES" | while read -r f; do echo "  - $f"; done
fi
if [ -n "$OP_FILES" ]; then
  echo "WORKFLOW_OPERATIONAL_CHANGE files:"
  echo "$OP_FILES" | while read -r f; do echo "  - $f"; done
fi
echo ""

if echo "${PR_BODY:-}" | grep -qiE 'CS2-GATE-TEST-WAIVER|CS2 gate test waiver'; then
  echo "✅ PASS — CS2 gate test waiver phrase found in PR body."
  exit 0
fi

if [ -n "${PR_COMMENTS_OVERRIDE:-}" ]; then
  PR_COMMENTS="$PR_COMMENTS_OVERRIDE"
else
  PR_COMMENTS=""
  if [ -n "${PR_NUMBER:-}" ] && [ -n "${GITHUB_TOKEN:-}" ] && command -v gh >/dev/null 2>&1; then
    PR_COMMENTS="$(gh api "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" --paginate --jq '.[].body' 2>/dev/null || true)"
  fi
fi

CLAIM_TEXT="$(printf '%s\n%s\n' "${PR_BODY:-}" "${PR_COMMENTS:-}" | tr '[:upper:]' '[:lower:]')"
EXPLICIT_HANDOVER_CLAIM=false
if echo "$CLAIM_TEXT" | grep -qiE 'merge.?ready|ready to merge|handover complete|handover ready|merge gate released|handover_allowed:[[:space:]]*yes|opojd:[[:space:]]*pass'; then
  EXPLICIT_HANDOVER_CLAIM=true
fi
if echo "$CLAIM_TEXT" | grep -qiE 'handover_allowed:[[:space:]]*no|result:[[:space:]]*stop_and_fix|checkpoint_required'; then
  EXPLICIT_HANDOVER_CLAIM=false
fi

EVIDENCE_SOURCE_TEXT="$(printf '%s\n%s\n' "${PR_BODY:-}" "${PR_COMMENTS:-}")"
CONCRETE_EVIDENCE=false
if echo "$EVIDENCE_SOURCE_TEXT" | grep -qiE 'actions/runs/[0-9]{6,}|run id:[[:space:]]*[0-9]{6,}|run id[[:space:]]+[0-9]{6,}|workflow[[:space:]]+[^[:cntrl:]\n]+:[[:space:]]*success[[:space:]]+on[[:space:]]+head[[:space:]]+[0-9a-f]{7,40}|validated[[:space:]]+affected[[:space:]]+workflow[[:space:]]+on[[:space:]]+head[[:space:]]+[0-9a-f]{7,40}'; then
  CONCRETE_EVIDENCE=true
fi
if echo "$EVIDENCE_SOURCE_TEXT" | grep -qiE 'local command output:[[:space:]]*[[:graph:]]'; then
  CONCRETE_EVIDENCE=true
fi

GATE_MANIFEST=""
if [ -n "${PR_NUMBER:-}" ] && [ -f ".admin/prs/pr-${PR_NUMBER}.json" ]; then
  GATE_MANIFEST=".admin/prs/pr-${PR_NUMBER}.json"
elif [ -f ".admin/pr.json" ]; then
  GATE_MANIFEST=".admin/pr.json"
fi
if [ -n "$GATE_MANIFEST" ] && command -v python3 >/dev/null 2>&1; then
  MANIFEST_EVIDENCE="$(python3 -c "import json,sys,re;m=json.load(open('${GATE_MANIFEST}'));ev='\\n'.join(m.get('evidence_required',[]));print('FOUND' if re.search(r'actions/runs/[0-9]{6,}|run id:?\\s*[0-9]{6,}|local command output:\\s*\\S|workflow\\s+[^\\n]+:\\s*success\\s+on\\s+head\\s+[0-9a-f]{7,40}|validated\\s+affected\\s+workflow\\s+on\\s+head\\s+[0-9a-f]{7,40}', ev, re.I) else 'NONE')" 2>/dev/null || echo "NONE")"
  if [ "$MANIFEST_EVIDENCE" = "FOUND" ]; then
    CONCRETE_EVIDENCE=true
  fi
fi

is_pure_action_version_bump() {
  local file="$1"
  local diff
  if ! diff="$(git diff -U0 "${BASE_SHA}...HEAD" -- "$file" 2>/dev/null)"; then
    diff="$(git diff -U0 "${BASE_SHA}" HEAD -- "$file" 2>/dev/null || true)"
  fi
  local saw_change=false
  while IFS= read -r line; do
    case "$line" in
      "+++"*|"---"*|"@@ "*|"diff --git "*|"index "*) continue ;;
      +*|-*)
        saw_change=true
        local content="${line:1}"
        content="$(echo "$content" | sed -E 's/^[[:space:]]+//')"
        if [[ "$content" =~ ^-?[[:space:]]*uses:[[:space:]]*[^[:space:]@]+/[^[:space:]@]+@[^[:space:]]+$ ]]; then
          continue
        fi
        return 1
        ;;
      *)
        continue
        ;;
    esac
  done <<< "$diff"
  $saw_change
}

PURE_ACTION_VERSION_BUMP=true
if [ -n "$STRICT_FILES" ] || [ -z "$OP_FILES" ]; then
  PURE_ACTION_VERSION_BUMP=false
else
  while IFS= read -r wf; do
    [ -z "$wf" ] && continue
    if ! is_pure_action_version_bump "$wf"; then
      PURE_ACTION_VERSION_BUMP=false
      break
    fi
  done <<< "$OP_FILES"
fi

if $PURE_ACTION_VERSION_BUMP; then
  HAS_DEPRECATION_PROOF=false
  HAS_HEAD_GREEN_PROOF=false
  HAS_NO_BANNED_PROOF=false

  if echo "$EVIDENCE_SOURCE_TEXT" | grep -qiE 'actions deprecation gate.*(actions/runs/[0-9]{6,}|run id:? *[0-9]{6,})|actions_deprecation_gate_run_id:[[:space:]]*[0-9]{6,}'; then
    HAS_DEPRECATION_PROOF=true
  fi
  if echo "$EVIDENCE_SOURCE_TEXT" | grep -qiE 'affected workflow runs green on head:[[:space:]]*yes|affected_workflow_runs_green_on_head:[[:space:]]*yes'; then
    HAS_HEAD_GREEN_PROOF=true
  fi
  if echo "$EVIDENCE_SOURCE_TEXT" | grep -qiE 'no banned action versions remain:[[:space:]]*yes|no_banned_action_versions_remain:[[:space:]]*yes|banned_action_versions_remaining:[[:space:]]*0'; then
    HAS_NO_BANNED_PROOF=true
  fi

  if $HAS_DEPRECATION_PROOF && $HAS_HEAD_GREEN_PROOF && $HAS_NO_BANNED_PROOF; then
    echo "PURE_ACTION_VERSION_BUMP_SHORTCUT: PASS"
    echo "✅ PASS — Pure action-version bump with concrete deprecation + head-green + no-banned proof."
    exit 0
  fi
fi

if $CONCRETE_EVIDENCE; then
  echo "✅ PASS — Concrete gate evidence found in PR body/comments/manifest."
  exit 0
fi

if [ -n "$STRICT_FILES" ]; then
  echo "RESULT: STOP_AND_FIX"
  echo "HANDOVER_ALLOWED: no"
  echo "❌ FAIL — STRICT_GATE_LOGIC_CHANGE without required evidence (no CS2 waiver)."
  exit 1
fi

if $EXPLICIT_HANDOVER_CLAIM; then
  echo "RESULT: STOP_AND_FIX"
  echo "HANDOVER_ALLOWED: no"
  echo "❌ FAIL — Explicit handover/merge-ready claim requires concrete evidence."
  exit 1
fi

echo "RESULT: CHECKPOINT_REQUIRED"
echo "HANDOVER_ALLOWED: no"
echo "CHECKPOINT_REQUIRED: workflow operational change has no concrete handover evidence yet."
echo "✅ ADVISORY — WORKFLOW_OPERATIONAL_CHANGE in active fix cycle may proceed without hard fail."
exit 0
