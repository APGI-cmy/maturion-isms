#!/bin/bash
# Identity Binding Gate
# Purpose: Ensure active governance artifacts are bound to the active PR identity.

set -euo pipefail

PR_NUMBER="${PR_NUMBER:-}"
ISSUE_NUMBER="${ISSUE_NUMBER:-}"
BRANCH="${BRANCH:-${PR_BRANCH:-}}"
HEAD_SHA="${HEAD_SHA:-}"
BASE_SHA="${BASE_SHA:-}"
WAVE_TASKS_PATH="${WAVE_TASKS_PATH:-.agent-workspace/foreman-v2/personal/wave-current-tasks.md}"

if [ -z "$PR_NUMBER" ] && [ -n "${GITHUB_EVENT_PATH:-}" ] && [ -f "${GITHUB_EVENT_PATH}" ]; then
  PR_NUMBER="$(python3 - <<'PY'
import json, os
event_path = os.environ.get("GITHUB_EVENT_PATH", "")
try:
    with open(event_path, "r", encoding="utf-8") as f:
        event = json.load(f)
    pr = event.get("pull_request", {})
    print(pr.get("number", "") or "")
except Exception:
    print("")
PY
)"
fi

if [ -z "$BRANCH" ] && [ -n "${GITHUB_EVENT_PATH:-}" ] && [ -f "${GITHUB_EVENT_PATH}" ]; then
  BRANCH="$(python3 - <<'PY'
import json, os
event_path = os.environ.get("GITHUB_EVENT_PATH", "")
try:
    with open(event_path, "r", encoding="utf-8") as f:
        event = json.load(f)
    pr = event.get("pull_request", {})
    print(((pr.get("head", {}) or {}).get("ref", "")) or "")
except Exception:
    print("")
PY
)"
fi

if [ -z "$HEAD_SHA" ] && [ -n "${GITHUB_EVENT_PATH:-}" ] && [ -f "${GITHUB_EVENT_PATH}" ]; then
  HEAD_SHA="$(python3 - <<'PY'
import json, os
event_path = os.environ.get("GITHUB_EVENT_PATH", "")
try:
    with open(event_path, "r", encoding="utf-8") as f:
        event = json.load(f)
    pr = event.get("pull_request", {})
    print(((pr.get("head", {}) or {}).get("sha", "")) or "")
except Exception:
    print("")
PY
)"
fi

if [ -z "$BASE_SHA" ] && [ -n "${GITHUB_EVENT_PATH:-}" ] && [ -f "${GITHUB_EVENT_PATH}" ]; then
  BASE_SHA="$(python3 - <<'PY'
import json, os
event_path = os.environ.get("GITHUB_EVENT_PATH", "")
try:
    with open(event_path, "r", encoding="utf-8") as f:
        event = json.load(f)
    pr = event.get("pull_request", {})
    print(((pr.get("base", {}) or {}).get("sha", "")) or "")
except Exception:
    print("")
PY
)"
fi

if [ -z "$ISSUE_NUMBER" ]; then
  ISSUE_NUMBER="$(python3 - <<'PY'
import os, re
body = os.environ.get("PR_BODY", "")
m = re.search(r'(?i)\b(?:closes|fixes|resolves|addresses)\s+(?:maturion-isms)?#(\d+)', body)
print(m.group(1) if m else "")
PY
)"
fi

FAIL=false

fail() {
  echo "❌ $1"
  FAIL=true
}

info() {
  echo "ℹ️  $1"
}

echo "=== Identity Binding Gate ==="
echo "PR Number: ${PR_NUMBER:-<missing>}"
echo "Issue    : ${ISSUE_NUMBER:-<unknown>}"
echo "Branch   : ${BRANCH:-<missing>}"
echo "Head SHA : ${HEAD_SHA:-<missing>}"
echo "Base SHA : ${BASE_SHA:-<missing>}"
echo "Source   : GitHub PR event context/env"
echo ""

if [ -z "$PR_NUMBER" ]; then
  fail "PR_NUMBER is required from GitHub PR context."
fi
if [ -z "$BRANCH" ]; then
  fail "BRANCH is required from GitHub PR context."
fi

ADMIN_PATH=".admin/prs/pr-${PR_NUMBER}.json"
SCOPE_PATH=".agent-admin/scope-declarations/pr-${PR_NUMBER}.md"

if [ ! -f "$ADMIN_PATH" ]; then
  fail "Missing per-PR admin manifest: $ADMIN_PATH"
fi
if [ ! -f "$SCOPE_PATH" ]; then
  fail "Missing per-PR scope declaration: $SCOPE_PATH"
fi
if [ ! -f "$WAVE_TASKS_PATH" ]; then
  fail "Missing wave-current-tasks file: $WAVE_TASKS_PATH"
fi

if [ -f "$ADMIN_PATH" ]; then
  if ! python3 - "$ADMIN_PATH" "$PR_NUMBER" "$BRANCH" "$HEAD_SHA" "$BASE_SHA" <<'PY'
import json, sys
path, pr, branch, head, base = sys.argv[1:]
ok = True
try:
    data = json.load(open(path, "r", encoding="utf-8"))
except Exception as exc:
    print(f"❌ {path} is not valid JSON: {exc}")
    sys.exit(1)
if str(data.get("pr", "")) != str(pr):
    print(f"❌ {path} field 'pr' must equal {pr}, got {data.get('pr')}")
    ok = False
manifest_branch = str(data.get("branch", "") or "").strip()
if manifest_branch and manifest_branch != branch:
    print(f"❌ {path} field 'branch' mismatch: {manifest_branch} != {branch}")
    ok = False
manifest_head = str(data.get("head_sha", "") or "").strip()
if head and manifest_head and manifest_head.lower() not in {"current_base", "current_head", "current"} and manifest_head.lower() != head.lower():
    print(f"❌ {path} field 'head_sha' mismatch: {manifest_head} != {head}")
    ok = False
manifest_base = str(data.get("base_sha", "") or "").strip()
if base and manifest_base and manifest_base.lower() not in {"current_base", "current_head", "current"} and manifest_base.lower() != base.lower():
    print(f"❌ {path} field 'base_sha' mismatch: {manifest_base} != {base}")
    ok = False
if not ok:
    sys.exit(1)
print(f"✅ {path} identity fields match active PR context")
PY
  then
    FAIL=true
  fi
fi

if [ -f "$SCOPE_PATH" ]; then
  grep -Eq "^PR_NUMBER:[[:space:]]*${PR_NUMBER}[[:space:]]*$" "$SCOPE_PATH" || fail "${SCOPE_PATH} PR_NUMBER does not match active PR #${PR_NUMBER}"
  grep -Eq "^BRANCH:[[:space:]]*${BRANCH}[[:space:]]*$" "$SCOPE_PATH" || fail "${SCOPE_PATH} BRANCH does not match active branch ${BRANCH}"
fi

ACTIVE_PREBRIEF_PATH=""
if [ -f "$WAVE_TASKS_PATH" ]; then
  grep -Eq "^PR:[[:space:]]*#?${PR_NUMBER}[[:space:]]*$" "$WAVE_TASKS_PATH" || fail "${WAVE_TASKS_PATH} must contain PR: #${PR_NUMBER}"
  grep -Eq "^Branch:[[:space:]]*${BRANCH}[[:space:]]*$" "$WAVE_TASKS_PATH" || fail "${WAVE_TASKS_PATH} must contain Branch: ${BRANCH}"
  ACTIVE_PREBRIEF_PATH="$(grep -E "^(iaa_wave_record_path|iaa_prebrief_path):" "$WAVE_TASKS_PATH" | head -1 | sed -E 's/^[^:]+:[[:space:]]*//')"
  if [ -z "$ACTIVE_PREBRIEF_PATH" ]; then
    fail "${WAVE_TASKS_PATH} missing iaa_wave_record_path/iaa_prebrief_path."
  elif [ ! -f "$ACTIVE_PREBRIEF_PATH" ]; then
    fail "Active IAA preflight artifact missing: ${ACTIVE_PREBRIEF_PATH}"
  else
    grep -Eq "^PR:[[:space:]]*#?${PR_NUMBER}([[:space:]]|$)" "$ACTIVE_PREBRIEF_PATH" || fail "${ACTIVE_PREBRIEF_PATH} PR field does not match active PR #${PR_NUMBER}"
    grep -Eq "^WAVE_TASKS_PATH:[[:space:]]*${WAVE_TASKS_PATH}[[:space:]]*$" "$ACTIVE_PREBRIEF_PATH" || fail "${ACTIVE_PREBRIEF_PATH} WAVE_TASKS_PATH mismatch"
  fi
fi

CHANGED_FILES=""
if [ -n "$BASE_SHA" ] && [ -n "$HEAD_SHA" ]; then
  CHANGED_FILES="$(git diff --name-only "${BASE_SHA}...${HEAD_SHA}" 2>/dev/null || git diff --name-only "$BASE_SHA" "$HEAD_SHA" 2>/dev/null || true)"
else
  CHANGED_FILES="$(git diff --name-only HEAD~1...HEAD 2>/dev/null || true)"
fi

if [ -n "$CHANGED_FILES" ]; then
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    if [[ "$f" =~ ^\.admin/prs/pr-([0-9]+)\.json$ ]]; then
      n="${BASH_REMATCH[1]}"
      if [ "$n" != "$PR_NUMBER" ]; then
        fail "Changed admin manifest references wrong PR path: $f (expected pr-${PR_NUMBER}.json)"
      fi
    fi
    if [[ "$f" =~ ^\.agent-admin/scope-declarations/pr-([0-9]+)\.md$ ]]; then
      n="${BASH_REMATCH[1]}"
      if [ "$n" != "$PR_NUMBER" ]; then
        fail "Changed scope declaration references wrong PR path: $f (expected pr-${PR_NUMBER}.md)"
      fi
    fi
  done <<< "$CHANGED_FILES"
fi

declare -a ACTIVE_ARTIFACTS=("$ADMIN_PATH" "$SCOPE_PATH" "$WAVE_TASKS_PATH")
if [ -n "$ACTIVE_PREBRIEF_PATH" ]; then
  ACTIVE_ARTIFACTS+=("$ACTIVE_PREBRIEF_PATH")
fi

if [ -n "$CHANGED_FILES" ]; then
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    case "$f" in
      .agent-admin/assurance/iaa-token-*.md|\
      .agent-admin/assurance/iaa-wave-record-*.md|\
      .agent-admin/prehandover/proof-*.md|\
      .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-*.md|\
      .agent-workspace/foreman-v2/memory/PREHANDOVER-*.md)
        ACTIVE_ARTIFACTS+=("$f")
        ;;
    esac
  done <<< "$CHANGED_FILES"
fi

UNIQ_ACTIVE_ARTIFACTS="$(printf "%s\n" "${ACTIVE_ARTIFACTS[@]}" | awk 'NF && !seen[$0]++')"
if [ -z "$UNIQ_ACTIVE_ARTIFACTS" ]; then
  fail "No active PR-bound artifacts discovered for identity scanning."
fi

if ! ACTIVE_ARTIFACTS_LIST="$UNIQ_ACTIVE_ARTIFACTS" python3 - "$PR_NUMBER" <<'PY'; then
import os, re, sys
actual_pr = str(sys.argv[1]).strip()
files = [p.strip() for p in os.environ.get("ACTIVE_ARTIFACTS_LIST", "").splitlines() if p.strip() and os.path.exists(p.strip())]
# Historical/reference sections are explicitly exempt from active identity checks.
# These blocks preserve audit history and prior rejection context.
allowed_labels = {"REJECTION_HISTORY", "PRIOR_REJECTION", "REFERENCE_ONLY", "ARCHIVED_CONTEXT"}
violations = []

patterns = [
    ("PR", re.compile(r"(?:\bPR\b|\*\*PR\*\*)\s*:\s*#?(\d+)\b", re.IGNORECASE)),
    ("PR_NUMBER", re.compile(r"(?:\bPR_NUMBER\b|\*\*PR_NUMBER\*\*)\s*:\s*(\d+)\b", re.IGNORECASE)),
    ("PR_PATH", re.compile(r"\bpr-(\d+)\.(?:json|md)\b", re.IGNORECASE)),
    ("PR_REPO_REF", re.compile(r"\bPR\b[^\n]*?\bmaturion-isms#(\d+)\b", re.IGNORECASE)),
]

for fp in files:
    allow = False
    try:
        with open(fp, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception:
        continue
    for idx, raw in enumerate(lines, start=1):
        line = raw.rstrip("\n")
        heading = re.match(r"^\s*#+\s*(.+?)\s*$", line)
        bare = re.match(r"^\s*([A-Z_]+)\s*:?\s*$", line)
        if heading:
            label = re.sub(r"[^A-Z_]", "", heading.group(1).upper())
            allow = any(k in label for k in allowed_labels)
        elif bare:
            allow = bare.group(1) in allowed_labels
        elif re.match(r"^\s*##+\s+", line):
            allow = False
        if allow:
            continue
        for kind, pat in patterns:
            for m in pat.finditer(line):
                found = m.group(1)
                if found != actual_pr:
                    snippet = line.strip()
                    violations.append((fp, idx, kind, found, snippet[:220]))

if violations:
    print("❌ Active artifact contains wrong PR reference(s):")
    for fp, idx, kind, found, snippet in violations:
        print(f"  - {fp}:{idx} [{kind}] references PR #{found} (active #{actual_pr}) :: {snippet}")
    sys.exit(1)
print("✅ Active artifact identity references match current PR (or are in allowed historical sections)")
PY
  FAIL=true
fi

if [ "$FAIL" = true ]; then
  echo ""
  echo "❌ FAIL — Identity Binding Gate"
  exit 1
fi

echo ""
echo "✅ PASS — Identity Binding Gate"
