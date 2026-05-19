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
  local output_file
  output_file="$(mktemp -p "$ws" iaa-preflight-gate-out.XXXXXX.txt)"
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
  bash "$GATE_SCRIPT" >"$output_file" 2>&1
  local exit_code=$?
  set -e

  if [ "$exit_code" -eq "$expected_exit" ]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected $expected_exit got $exit_code)"
    echo "Output file: $output_file"
    cat "$output_file"
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

setup_prebrief_empty_scope_section() {
  mkdir -p .agent-admin/assurance
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
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
  git commit -q -m "prebrief empty scope section"
}

setup_prebrief_section_boundary_scope_missing() {
  mkdir -p .agent-admin/assurance
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
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
  git commit -q -m "prebrief section boundary scope missing"
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

setup_impl_path_with_not_required() {
  local path="$1"
  mkdir -p .agent-admin/assurance
  write_valid_prebrief ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  sed -i 's/BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes/BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: not_required/' \
    .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  git add .
  git commit -q -m "valid preflight contract with not_required delegation"

  mkdir -p "$(dirname "$path")"
  echo "change" > "$path"
  git add .
  git commit -q -m "change ${path}"
}

setup_impl_modules_not_required() { setup_impl_path_with_not_required "modules/mat/src/flag.ts"; }
setup_impl_apps_not_required() { setup_impl_path_with_not_required "apps/mat/src/flag.ts"; }
setup_impl_packages_not_required() { setup_impl_path_with_not_required "packages/mat/src/flag.ts"; }
setup_impl_supabase_not_required() { setup_impl_path_with_not_required "supabase/functions/flag/index.ts"; }
setup_impl_workflow_not_required() { setup_impl_path_with_not_required ".github/workflows/flag.yml"; }
setup_impl_script_not_required() { setup_impl_path_with_not_required ".github/scripts/flag.sh"; }

setup_non_impl_not_required_ok() {
  mkdir -p .agent-admin/assurance
  write_valid_prebrief ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  sed -i 's/BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes/BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: not_required/' \
    .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  git add .
  git commit -q -m "valid preflight contract with not_required delegation"

  mkdir -p docs
  echo "docs change" > docs/flag.md
  git add .
  git commit -q -m "non implementation docs change"
}

run_gate_test "1. missing pre-brief artifact -> FAIL" 1 "setup_missing_prebrief"
run_gate_test "2. pre-brief missing EXPECTED_QA_SCOPE -> FAIL" 1 "setup_prebrief_missing_scope"
run_gate_test "3. pre-brief empty EXPECTED_QA_SCOPE section -> FAIL" 1 "setup_prebrief_empty_scope_section"
run_gate_test "4. section boundary does not borrow bullets from next section -> FAIL" 1 "setup_prebrief_section_boundary_scope_missing"
run_gate_test "5. pre-brief stale CURRENT_HEAD_SHA -> FAIL" 1 "setup_prebrief_stale_head"
run_gate_test "6. missing foreman consumption fields -> FAIL" 1 "setup_missing_consumption_fields"
run_gate_test "7. rejection package exists but no pre-flight contract -> FAIL" 1 "setup_rejection_package_without_preflight"
run_gate_test "8. modules/* change with not_required delegation -> FAIL" 1 "setup_impl_modules_not_required"
run_gate_test "9. apps/* change with not_required delegation -> FAIL" 1 "setup_impl_apps_not_required"
run_gate_test "10. packages/* change with not_required delegation -> FAIL" 1 "setup_impl_packages_not_required"
run_gate_test "11. supabase/* change with not_required delegation -> FAIL" 1 "setup_impl_supabase_not_required"
run_gate_test "12. .github/workflows/* change with not_required delegation -> FAIL" 1 "setup_impl_workflow_not_required"
run_gate_test "13. .github/scripts/* change with not_required delegation -> FAIL" 1 "setup_impl_script_not_required"
run_gate_test "14. non-implementation docs change with not_required delegation -> PASS" 0 "setup_non_impl_not_required_ok"
run_gate_test "15. valid pre-flight contract -> PASS" 0 "setup_valid_contract"

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
