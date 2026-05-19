#!/bin/bash
# Regression coverage for identity-binding-gate.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="${SCRIPT_DIR}/identity-binding-gate.sh"
TEST_DIR="$(mktemp -d)"
PASS_COUNT=0
FAIL_COUNT=0

echo "=== Identity Binding Gate Regression ==="
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
  mkdir -p .admin/prs .agent-admin/scope-declarations .agent-admin/assurance .agent-admin/prehandover \
           .agent-workspace/foreman-v2/personal .agent-workspace/execution-ceremony-admin-agent/bundles
  echo "init" > README.md
  git add .
  git commit -q -m "init"
  git branch -M main
  git checkout -q -b test-branch

  "$setup_fn"

  local base_sha head_sha output exit_code
  base_sha="$(git rev-parse main)"
  head_sha="$(git rev-parse HEAD)"

  set +e
  # Keep 1680/1683 as fixture values to mirror the wrong-identity regression class from issue #1684.
  output="$(PR_NUMBER="1680" \
    ISSUE_NUMBER="1679" \
    BRANCH="copilot/identity-binding-test" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    PR_BODY="Fixes #1679" \
    bash "$GATE_SCRIPT" 2>&1)"
  exit_code=$?
  set -e

  if [ "$exit_code" -eq "$expected_exit" ]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected $expected_exit got $exit_code)"
    echo "$output" | sed 's/^/  /'
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

seed_matching_artifacts() {
  cat > .admin/prs/pr-1680.json <<'EOF'
{
  "pr": 1680,
  "issue": 1679,
  "branch": "copilot/identity-binding-test",
  "head_sha": "CURRENT_HEAD",
  "base_sha": "CURRENT_HEAD"
}
EOF
  cat > .agent-admin/scope-declarations/pr-1680.md <<'EOF'
SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: 1680
ISSUE: #1679 — Identity Binding
BRANCH: copilot/identity-binding-test
OWNER: Copilot
DATE_UTC: 2026-05-19T00:00:00Z
FILES_CHANGED: 4
EOF
  cat > .agent-admin/assurance/iaa-wave-record-identity-test.md <<'EOF'
IAA_PREFLIGHT_BRIEF
PR: #1680
ISSUE: #1679
WAVE: identity-test
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
- .github/scripts/identity-binding-gate.sh
EXPECTED_FAILURE_MODES:
- wrong pr
FOREMAN_INSTRUCTIONS:
- bind to active pr
IAA_WILL_QA:
- identity coherence
RESULT: PREFLIGHT_BRIEF_COMPLETE
EOF
  cat > .agent-workspace/foreman-v2/personal/wave-current-tasks.md <<'EOF'
Wave: identity-test
Branch: copilot/identity-binding-test
Issue: #1679 — Identity Binding
PR: #1680
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-identity-test.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-identity-test.md
EOF
  cat > .agent-admin/prehandover/proof-pr-1680.md <<'EOF'
PR: #1680
RESULT: STOP_AND_FIX

## ARCHIVED_CONTEXT
<!-- Intentional wrong-PR references below must be ignored by the gate (historical context). -->
PR: #1683
pr-1683.json
PR_NUMBER: 1683
EOF
  git add .
  git commit -q -m "seed matching artifacts"
}

setup_pass_matching() {
  seed_matching_artifacts
}

setup_fail_missing_manifest() {
  seed_matching_artifacts
  git rm -q .admin/prs/pr-1680.json
  git commit -q -m "remove manifest"
}

setup_fail_scope_pr_mismatch() {
  seed_matching_artifacts
  sed -i 's/^PR_NUMBER: 1680$/PR_NUMBER: 1683/' .agent-admin/scope-declarations/pr-1680.md
  git add .agent-admin/scope-declarations/pr-1680.md
  git commit -q -m "scope pr mismatch"
}

setup_fail_wave_branch_mismatch() {
  seed_matching_artifacts
  sed -i 's#^Branch: copilot/identity-binding-test$#Branch: copilot/wrong-branch#' .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  git add .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  git commit -q -m "wave branch mismatch"
}

setup_fail_wrong_active_references_1683() {
  seed_matching_artifacts
  cat > .agent-admin/assurance/iaa-token-session-1683.md <<'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-test-PASS
**PR**: #1683
**Issue**: maturion-isms#1683
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .agent-admin/assurance/iaa-token-session-1683.md
  git commit -q -m "wrong active token identity"
}

setup_pass_reference_only_allowed() {
  seed_matching_artifacts
  cat > .agent-admin/assurance/iaa-token-session-1680.md <<'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-test-PASS
**PR**: #1680
**Issue**: maturion-isms#1679
**Reviewed SHA**: CURRENT_HEAD

## REFERENCE_ONLY
PR: #1683
pr-1683.md
EOF
  git add .agent-admin/assurance/iaa-token-session-1680.md
  git commit -q -m "reference only wrong ref"
}

run_gate_test "1. matching active identity -> PASS" 0 setup_pass_matching
run_gate_test "2. missing per-PR manifest -> FAIL" 1 setup_fail_missing_manifest
run_gate_test "3. scope PR mismatch -> FAIL" 1 setup_fail_scope_pr_mismatch
run_gate_test "4. wave-current-tasks branch mismatch -> FAIL" 1 setup_fail_wave_branch_mismatch
run_gate_test "5. regression actual #1680 vs artifact #1683 -> FAIL" 1 setup_fail_wrong_active_references_1683
run_gate_test "6. wrong refs inside REFERENCE_ONLY section are allowed -> PASS" 0 setup_pass_reference_only_allowed

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
