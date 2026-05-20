#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESOLVER_SCRIPT="${SCRIPT_DIR}/resolve-active-pr-state.js"
TEST_DIR="$(mktemp -d)"
trap 'rm -rf "$TEST_DIR"' EXIT

PASS=0
FAIL=0

json_get() {
  local file="$1"
  local key="$2"
  python3 - "$file" "$key" <<'PY'
import json,sys
with open(sys.argv[1], "r", encoding="utf-8") as fh:
    obj=json.load(fh)
print(obj.get(sys.argv[2], ""))
PY
}

run_case() {
  local name="$1"
  local expected_action="$2"
  local setup_fn="$3"

  local ws
  ws="$(mktemp -d -p "$TEST_DIR")"
  pushd "$ws" >/dev/null

  git init -q
  git config user.email test@example.com
  git config user.name "Test"
  echo base > README.md
  git add README.md
  git commit -q -m "base"
  git branch -M main
  git checkout -q -b feature

  "$setup_fn"

  local base_sha head_sha out
  base_sha="$(git rev-parse main)"
  head_sha="$(git rev-parse HEAD)"
  out="$ws/state.json"

  PR_NUMBER=9001 BRANCH=feature BASE_SHA="$base_sha" HEAD_SHA="$head_sha" node "$RESOLVER_SCRIPT" --output="$out" >/dev/null

  local actual
  actual="$(json_get "$out" next_required_action)"
  if [[ "$actual" == "$expected_action" ]]; then
    echo "✅ $name"
    PASS=$((PASS+1))
  else
    echo "❌ $name (expected $expected_action got $actual)"
    cat "$out"
    FAIL=$((FAIL+1))
  fi

  popd >/dev/null
}

setup_bootstrap_required() {
  echo "change" > docs.md
  git add docs.md
  git commit -q -m "docs"
}

setup_blocked_mismatch() {
  mkdir -p .admin/prs .agent-admin/scope-declarations .agent-admin/prs/pr-9001
  cat > .admin/prs/pr-9001.json <<'JSON'
{"pr": 9999, "branch": "feature"}
JSON
  cat > .agent-admin/scope-declarations/pr-9001.md <<'SCOPE'
PR_NUMBER: 9001
BRANCH: wrong-branch
SCOPE
  cat > .agent-admin/prs/pr-9001/wave-current-tasks.md <<'WAVE'
PR: #9001
Branch: feature
WAVE_TASKS_PATH: .agent-admin/prs/pr-9001/wave-current-tasks.md
WAVE
  git add .
  git commit -q -m "mismatch"
}

setup_evidence_required() {
  mkdir -p .admin/prs .agent-admin/scope-declarations .agent-admin/prs/pr-9001 apps/mat/src
  cat > .admin/prs/pr-9001.json <<'JSON'
{"pr": 9001, "branch": "feature"}
JSON
  cat > .agent-admin/scope-declarations/pr-9001.md <<'SCOPE'
PR_NUMBER: 9001
BRANCH: feature
SCOPE
  cat > .agent-admin/prs/pr-9001/wave-current-tasks.md <<'WAVE'
PR: #9001
Branch: feature
WAVE
  echo "export const x = 1;" > apps/mat/src/file.ts
  git add .
  git commit -q -m "substantive without evidence"
}

setup_pass_admin_only() {
  mkdir -p .admin/prs .agent-admin/scope-declarations .agent-admin/prs/pr-9001 .agent-admin/assurance
  cat > .admin/prs/pr-9001.json <<'JSON'
{"pr": 9001, "branch": "feature"}
JSON
  cat > .agent-admin/scope-declarations/pr-9001.md <<'SCOPE'
PR_NUMBER: 9001
BRANCH: feature
SCOPE
  cat > .agent-admin/assurance/iaa-wave-record-test.md <<'WB'
IAA_PREFLIGHT_BRIEF
PR: #9001
WAVE_TASKS_PATH: .agent-admin/prs/pr-9001/wave-current-tasks.md
WB
  cat > .agent-admin/prs/pr-9001/wave-current-tasks.md <<'WAVE'
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-test.md
PR: #9001
Branch: feature
WAVE
  echo "note" > .agent-admin/note.md
  git add .
  git commit -q -m "admin only"
}

run_case "bootstrap missing artifacts" "BOOTSTRAP_REQUIRED" setup_bootstrap_required
run_case "identity contradictions block" "BLOCKED" setup_blocked_mismatch
run_case "substantive delta needs evidence" "EVIDENCE_REQUIRED" setup_evidence_required
run_case "admin-only delta with bootstrap+evidence passes" "PASS" setup_pass_admin_only

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
