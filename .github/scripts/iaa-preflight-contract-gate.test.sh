#!/bin/bash
# Regression coverage for iaa-preflight-contract-gate.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="${SCRIPT_DIR}/iaa-preflight-contract-gate.sh"
TEST_DIR="$(mktemp -d)"
PASS_COUNT=0
FAIL_COUNT=0

echo "=== IAA Pre-Flight Contract Gate Regression ==="
echo "Test dir: $TEST_DIR"

run_gate_test() {
  local name="$1"
  local expected_exit="$2"
  local setup_fn="$3"

  local ws
  ws="$(mktemp -d -p "$TEST_DIR")"
  cd "$ws"

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"
  mkdir -p .agent-admin/assurance .agent-workspace/foreman-v2/personal modules/mat/src
  echo "init" > README.md
  git add .
  git commit -q -m "init"
  git branch -M main
  git checkout -q -b test-branch

  "$setup_fn"

  local base_sha head_sha
  base_sha="$(git rev-parse main)"
  head_sha="$(git rev-parse HEAD)"

  set +e
  WAVE_TASKS_PATH=".agent-workspace/foreman-v2/personal/wave-current-tasks.md" \
  ASSURANCE_DIR=".agent-admin/assurance" \
  PR_NUMBER="1672" \
  BASE_SHA="$base_sha" \
  HEAD_SHA="$head_sha" \
  bash "$GATE_SCRIPT" >/tmp/iaa-preflight-gate-out.txt 2>&1
  local exit_code=$?
  set -e

  if [ "$exit_code" -eq "$expected_exit" ]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected $expected_exit got $exit_code)"
    cat /tmp/iaa-preflight-gate-out.txt
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

write_valid_prebrief() {
  local prebrief_path="$1"
  cat > "$prebrief_path" <<EOF
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
FOREMAN_OBJECTIVE: restore proactive pre-flight contract
EXPECTED_QA_SCOPE:
- .github/workflows/preflight-evidence-gate.yml
EXPECTED_FAILURE_MODES:
- stale evidence
FOREMAN_INSTRUCTIONS:
- include pre-flight scope in builder delegation
IAA_WILL_QA:
- preflight/iaa-prebrief-existence contract checks
RESULT: PREFLIGHT_BRIEF_COMPLETE
EOF
}

write_valid_wave_tasks() {
  local prebrief_path="$1"
  local prebrief_sha
  prebrief_sha="$(git rev-parse HEAD)"
  cat > .agent-workspace/foreman-v2/personal/wave-current-tasks.md <<EOF
iaa_wave_record_path: ${prebrief_path}
IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: ${prebrief_path}
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: ${prebrief_sha}
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes
EOF
}

setup_missing_prebrief() {
  cat > .agent-workspace/foreman-v2/personal/wave-current-tasks.md <<'EOF'
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-missing.md
EOF
  git add .
  git commit -q -m "wave tasks without prebrief"
}

setup_prebrief_missing_scope() {
  mkdir -p .agent-admin/assurance
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_FAILURE_MODES:
- stale evidence
FOREMAN_INSTRUCTIONS:
- do the work
IAA_WILL_QA:
- check evidence
RESULT: PREFLIGHT_BRIEF_COMPLETE
EOF
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  git add .
  git commit -q -m "prebrief missing expected qa scope"
}

setup_prebrief_stale_head() {
  mkdir -p .agent-admin/assurance
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: deadbeef00000000000000000000000000000001
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
- .github/workflows/preflight-evidence-gate.yml
EXPECTED_FAILURE_MODES:
- stale evidence
FOREMAN_INSTRUCTIONS:
- include pre-flight scope in builder delegation
IAA_WILL_QA:
- preflight/iaa-prebrief-existence contract checks
RESULT: PREFLIGHT_BRIEF_COMPLETE
EOF
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  git add .
  git commit -q -m "prebrief stale head sha"
}

setup_missing_consumption_fields() {
  mkdir -p .agent-admin/assurance
  write_valid_prebrief ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  cat > .agent-workspace/foreman-v2/personal/wave-current-tasks.md <<'EOF'
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-wave-20260518.md
IAA_PREFLIGHT_BRIEF_REVIEWED: no
EOF
  git add .
  git commit -q -m "missing consumption evidence"
}

setup_valid_contract() {
  mkdir -p .agent-admin/assurance
  write_valid_prebrief ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  git add .
  git commit -q -m "valid preflight contract"
}

setup_rejection_package_without_preflight() {
  cat > .agent-workspace/foreman-v2/personal/wave-current-tasks.md <<'EOF'
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-missing.md
EOF
  cat > .agent-admin/assurance/iaa-token-session-rejection-wave-20260518.md <<'EOF'
# IAA Token File — REJECTION-PACKAGE
PHASE_B_BLOCKING_TOKEN: IAA-session-rejection-wave-20260518-REJECTION
**Verdict**: REJECTION-PACKAGE
EOF
  git add .
  git commit -q -m "rejection package without preflight brief"
}

run_gate_test "1. missing pre-brief artifact -> FAIL" 1 "setup_missing_prebrief"
run_gate_test "2. pre-brief missing EXPECTED_QA_SCOPE -> FAIL" 1 "setup_prebrief_missing_scope"
run_gate_test "3. pre-brief stale CURRENT_HEAD_SHA -> FAIL" 1 "setup_prebrief_stale_head"
run_gate_test "4. missing foreman consumption fields -> FAIL" 1 "setup_missing_consumption_fields"
run_gate_test "5. rejection package exists but no pre-flight contract -> FAIL" 1 "setup_rejection_package_without_preflight"
run_gate_test "6. valid pre-flight contract -> PASS" 0 "setup_valid_contract"

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
