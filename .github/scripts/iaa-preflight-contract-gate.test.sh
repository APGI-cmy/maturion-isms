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
  local use_resolver="${4:-no}"
  local expected_output_substring="${5:-}"

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
  if [ "$use_resolver" = "yes" ]; then
    WAVE_TASKS_PATH=".agent-workspace/foreman-v2/personal/wave-current-tasks.md" \
    ASSURANCE_DIR=".agent-admin/assurance" \
    PR_NUMBER="1672" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    bash "$GATE_SCRIPT" >"$output_file" 2>&1
  else
    WAVE_TASKS_PATH=".agent-workspace/foreman-v2/personal/wave-current-tasks.md" \
    ASSURANCE_DIR=".agent-admin/assurance" \
    PR_NUMBER="1672" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    NEXT_REQUIRED_ACTION="PASS" \
    bash "$GATE_SCRIPT" >"$output_file" 2>&1
  fi
  local exit_code=$?
  set -e

  if [ "$exit_code" -eq "$expected_exit" ]; then
    if [ -n "$expected_output_substring" ] && ! grep -q "$expected_output_substring" "$output_file"; then
      echo "❌ $name (missing output marker: $expected_output_substring)"
      echo "Output file: $output_file"
      cat "$output_file"
      FAIL_COUNT=$((FAIL_COUNT + 1))
    else
      echo "✅ $name"
      PASS_COUNT=$((PASS_COUNT + 1))
    fi
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
  # Admin-only delta (only assurance + wave-tasks files changed, no impl/build files).
  # With the rebase-aware gate, stale SHA is accepted when no impl files changed.
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

# Setup: stale SHA, but impl file committed AFTER prebrief's last update (prebrief is outdated) -> FAIL
setup_prebrief_stale_head_impl_after() {
  mkdir -p .agent-admin/assurance modules/mat/src
  # Step 1: Prebrief established first (satisfies "prebrief before impl" governance ordering)
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: deadbeef00000000000000000000000000000001
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
- modules/mat/src/flag.ts
EXPECTED_FAILURE_MODES:
- stale evidence
FOREMAN_INSTRUCTIONS:
- include scope in delegation
IAA_WILL_QA:
- preflight/iaa-prebrief-existence contract checks
RESULT: PREFLIGHT_BRIEF_COMPLETE
EOF
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  git add .
  GIT_AUTHOR_DATE="2020-01-01T08:00:00 +0000" GIT_COMMITTER_DATE="2020-01-01T08:00:00 +0000" \
    git commit -q -m "prebrief established first (T0)"
  # Step 2: Impl file committed AFTER prebrief — prebrief is NOT updated afterwards (stale)
  echo "export const x = 1;" > modules/mat/src/flag.ts
  git add .
  GIT_AUTHOR_DATE="2020-01-02T10:00:00 +0000" GIT_COMMITTER_DATE="2020-01-02T10:00:00 +0000" \
    git commit -q -m "impl file added after prebrief, prebrief not updated (T1 > T0)"
  # prebrief_last_touch_at (T0) < last_impl_at (T1) → stale → FAIL
}

# Setup: stale SHA, IAA reviewed prebrief AFTER impl (prebrief covers the impl work) -> PASS
setup_prebrief_stale_head_prebrief_after_impl() {
  mkdir -p .agent-admin/assurance modules/mat/src
  # Step 1: Prebrief established first (satisfies "prebrief before impl" governance ordering)
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: deadbeef00000000000000000000000000000001
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
- modules/mat/src/flag.ts
EXPECTED_FAILURE_MODES:
- stale evidence
FOREMAN_INSTRUCTIONS:
- include scope in delegation
IAA_WILL_QA:
- preflight/iaa-prebrief-existence contract checks
RESULT: PREFLIGHT_BRIEF_COMPLETE
EOF
  write_valid_wave_tasks ".agent-admin/assurance/iaa-wave-record-wave-20260518.md"
  git add .
  GIT_AUTHOR_DATE="2020-01-01T08:00:00 +0000" GIT_COMMITTER_DATE="2020-01-01T08:00:00 +0000" \
    git commit -q -m "prebrief established first (T0)"
  # Step 2: Impl committed after prebrief
  echo "export const x = 1;" > modules/mat/src/flag.ts
  git add .
  GIT_AUTHOR_DATE="2020-01-01T10:00:00 +0000" GIT_COMMITTER_DATE="2020-01-01T10:00:00 +0000" \
    git commit -q -m "impl file (T1)"
  # Step 3: IAA reviews impl and updates prebrief (last touch at T2 > T1, stale SHA retained)
  # The stale SHA simulates a post-rebase scenario where IAA re-confirmed but HEAD moved again.
  echo "# IAA confirmed review" >> .agent-admin/assurance/iaa-wave-record-wave-20260518.md
  git add .
  GIT_AUTHOR_DATE="2020-01-01T12:00:00 +0000" GIT_COMMITTER_DATE="2020-01-01T12:00:00 +0000" \
    git commit -q -m "IAA review update after impl (T2 > T1) — rebase-safe"
  # prebrief_last_touch_at (T2) >= last_impl_at (T1) → PASS my freshness check
  # prebrief_first_touch (T0) < first_impl (T1) → PASS existing "prebrief before impl" check
}

# Setup: symbolic ACTIVE_HEAD_RESOLVED_BY_GATE marker -> PASS
setup_prebrief_symbolic_active_head_marker() {
  mkdir -p .agent-admin/assurance
  cat > .agent-admin/assurance/iaa-wave-record-wave-20260518.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: wave-iaa-preflight-contract
CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE
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
  git commit -q -m "prebrief using ACTIVE_HEAD_RESOLVED_BY_GATE symbolic marker"
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

setup_bootstrap_required_non_cascading() {
  mkdir -p .github/scripts .agent-workspace/foreman-v2/personal
  cp "$SCRIPT_DIR/resolve-active-pr-state.js" .github/scripts/resolve-active-pr-state.js
  cat > .agent-workspace/foreman-v2/personal/wave-current-tasks.md <<'EOF'
PR: #1685
Branch: copilot/legacy-branch
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-legacy.md
EOF
  echo "docs" > docs.md
  git add .
  git commit -q -m "legacy global wave file for another pr"
}

run_gate_test "1. missing pre-brief artifact -> FAIL" 1 "setup_missing_prebrief"
run_gate_test "2. pre-brief missing EXPECTED_QA_SCOPE -> FAIL" 1 "setup_prebrief_missing_scope"
run_gate_test "3. pre-brief empty EXPECTED_QA_SCOPE section -> FAIL" 1 "setup_prebrief_empty_scope_section"
run_gate_test "4. section boundary does not borrow bullets from next section -> FAIL" 1 "setup_prebrief_section_boundary_scope_missing"
run_gate_test "5. pre-brief stale SHA, admin-only delta (rebase-safe) -> PASS" 0 "setup_prebrief_stale_head"
run_gate_test "5a. pre-brief stale SHA, impl committed AFTER prebrief -> FAIL" 1 "setup_prebrief_stale_head_impl_after"
run_gate_test "5b. pre-brief stale SHA, prebrief committed AFTER impl (rebase-safe) -> PASS" 0 "setup_prebrief_stale_head_prebrief_after_impl"
run_gate_test "5c. pre-brief ACTIVE_HEAD_RESOLVED_BY_GATE symbolic marker -> PASS" 0 "setup_prebrief_symbolic_active_head_marker"
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
run_gate_test "16. missing PR-scoped wave/prebrief -> BOOTSTRAP_REQUIRED non-cascading PASS" 0 "setup_bootstrap_required_non_cascading" "yes" "NEXT_ACTION=BOOTSTRAP_REQUIRED"

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
