#!/bin/bash
# enforce-scope-declaration-policy.test.sh
# Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521
# Purpose: Test suite for enforce-scope-declaration-policy.sh
#
# Tests AC6 requirements:
#   - PR modifying root SCOPE_DECLARATION.md fails (Gate A)
#   - PR with .agent-admin/scope-declarations/pr-1234.md passes (Gate B)
#   - PR missing per-PR scope declaration fails when scope evidence is required (Gate B)
#   - Migration-labeled PR modifying root file passes (Gate A exemption)
#
# Usage:
#   .github/scripts/enforce-scope-declaration-policy.test.sh
#
# Exit Codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="$SCRIPT_DIR/enforce-scope-declaration-policy.sh"
TEST_DIR=$(mktemp -d)
TEST_PASSED=0
TEST_FAILED=0

echo "=== Scope Declaration Policy Gate — Test Suite ==="
echo "Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521"
echo "Test directory: $TEST_DIR"
echo ""

# Helper: run a test case
run_test() {
  local test_name="$1"
  local expected_exit_code="$2"
  local setup_func="$3"

  echo "Test: $test_name"

  local test_workspace
  test_workspace=$(mktemp -d -p "$TEST_DIR")
  local original_dir="$PWD"
  cd "$test_workspace"

  # Minimal git repo
  git init -q
  git config user.email "test@example.com"
  git config user.name "Test"
  echo "initial" > README.md
  git add README.md
  git commit -q -m "Initial"
  git branch -M main
  git checkout -q -b test-branch

  "$setup_func" "$test_workspace"

  set +e
  local output
  output=$(bash "$GATE_SCRIPT" 2>&1)
  local actual_exit_code=$?
  set -e

  if [ "$actual_exit_code" -eq "$expected_exit_code" ]; then
    echo "  ✅ PASS (exit: $actual_exit_code)"
    TEST_PASSED=$((TEST_PASSED + 1))
  else
    echo "  ❌ FAIL (expected: $expected_exit_code, got: $actual_exit_code)"
    echo "$output" | sed 's/^/    /'
    TEST_FAILED=$((TEST_FAILED + 1))
  fi

  cd "$original_dir"
  rm -rf "$test_workspace"
  echo ""
}

# ----------------------------------------------------------------
# Minimal valid per-PR scope file content
# ----------------------------------------------------------------
make_valid_scope_file() {
  local pr_num="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  cat > "$dest" << EOF
# Scope Declaration — PR #${pr_num}

SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: ${pr_num}
ISSUE: #1521 — Hardening scope declarations
BRANCH: copilot/test-branch
OWNER: foreman-v2-agent
DATE_UTC: 2026-04-30T08:00:00Z

## PR Responsibility Domain
RESPONSIBILITY_DOMAIN: scope-declaration-hardening

## Explicitly In Scope
IN_SCOPE:
- scope declaration CI gate

## Explicitly Out of Scope
OUT_OF_SCOPE:
- Tests
- CI

## Expected Verification Signal
EXPECTED_VERIFICATION:
- CI: GREEN

## Scope Freeze Declaration
SCOPE_FROZEN: YES

## FILES_CHANGED

FILES_CHANGED: 2

- \`SCOPE_DECLARATION.md\`
- \`README.md\`
EOF
}

# ----------------------------------------------------------------
# TEST 1: Root SCOPE_DECLARATION.md modified → should FAIL (Gate A)
# ----------------------------------------------------------------
setup_test_1() {
  echo "changed" > SCOPE_DECLARATION.md
  git add SCOPE_DECLARATION.md
  git commit -q -m "Rewrite root scope declaration"
}

export BASE_SHA=""
export PR_NUMBER="1234"
export PR_LABELS=""
export PR_BODY=""
export ENFORCE_SCOPE="false"

run_test "Root SCOPE_DECLARATION.md modified (no exemption) → FAIL" 1 "setup_test_1"

# ----------------------------------------------------------------
# TEST 2: Root SCOPE_DECLARATION.md modified with migration label → PASS
# ----------------------------------------------------------------
setup_test_2() {
  echo "changed" > SCOPE_DECLARATION.md
  git add SCOPE_DECLARATION.md
  git commit -q -m "Rewrite root scope declaration"
}

export PR_LABELS="scope-declaration-migration"
export ENFORCE_SCOPE="false"

run_test "Root SCOPE_DECLARATION.md modified with migration label → PASS" 0 "setup_test_2"
export PR_LABELS=""

# ----------------------------------------------------------------
# TEST 3: Root SCOPE_DECLARATION.md modified with CS2 waiver in body → PASS
# ----------------------------------------------------------------
setup_test_3() {
  echo "changed" > SCOPE_DECLARATION.md
  git add SCOPE_DECLARATION.md
  git commit -q -m "Rewrite root scope declaration"
}

export PR_BODY="Fixes #1521. CS2-SCOPE-MIGRATION-WAIVER granted by @APGI-cmy."
export ENFORCE_SCOPE="false"

run_test "Root SCOPE_DECLARATION.md modified with CS2 waiver in body → PASS" 0 "setup_test_3"
export PR_BODY=""

# ----------------------------------------------------------------
# TEST 4: Per-PR scope file present and valid → PASS (Gate B)
# ----------------------------------------------------------------
setup_test_4() {
  make_valid_scope_file "1234" ".agent-admin/scope-declarations/pr-1234.md"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope declaration"
}

export PR_NUMBER="1234"
export ENFORCE_SCOPE="true"

run_test "Per-PR scope file present and valid → PASS" 0 "setup_test_4"

# ----------------------------------------------------------------
# TEST 5: Per-PR scope file missing → FAIL (Gate B)
# ----------------------------------------------------------------
setup_test_5() {
  echo "some change" > some-file.txt
  git add some-file.txt
  git commit -q -m "Some change"
}

export PR_NUMBER="9999"
export ENFORCE_SCOPE="true"

run_test "Per-PR scope file missing → FAIL" 1 "setup_test_5"

# ----------------------------------------------------------------
# TEST 6: Per-PR scope file present but missing required fields → FAIL
# ----------------------------------------------------------------
setup_test_6() {
  mkdir -p .agent-admin/scope-declarations
  cat > .agent-admin/scope-declarations/pr-5678.md << 'EOF'
# Scope Declaration — PR #5678

Some content but missing required YAML fields.
EOF
  git add .agent-admin/
  git commit -q -m "Add incomplete scope declaration"
}

export PR_NUMBER="5678"
export ENFORCE_SCOPE="true"

run_test "Per-PR scope file with missing required fields → FAIL" 1 "setup_test_6"

# ----------------------------------------------------------------
# TEST 7: CS sign-off label bypasses all gates
# ----------------------------------------------------------------
setup_test_7() {
  echo "changed" > SCOPE_DECLARATION.md
  git add SCOPE_DECLARATION.md
  git commit -q -m "Rewrite root scope"
}

export PR_LABELS="CS sign-off: approved"
export ENFORCE_SCOPE="true"
export PR_NUMBER="1234"

run_test "CS sign-off: approved label → all gates bypassed → PASS" 0 "setup_test_7"
export PR_LABELS=""

# ----------------------------------------------------------------
# TEST 8: No root modification, no scope required (ENFORCE_SCOPE=false)
#         → PASS (Gate A and B both pass trivially)
# ----------------------------------------------------------------
setup_test_8() {
  echo "change" > some-other-file.txt
  git add some-other-file.txt
  git commit -q -m "Some other change"
}

export PR_NUMBER="4242"
export ENFORCE_SCOPE="false"

run_test "No root modification, Gate B skipped → PASS" 0 "setup_test_8"

# ----------------------------------------------------------------
# TEST 9: Per-PR scope file has PR_NUMBER mismatch → FAIL
# ----------------------------------------------------------------
setup_test_9() {
  # Create scope file for PR 999 but we'll test with PR_NUMBER=1111 (file is pr-1111.md)
  make_valid_scope_file "999" ".agent-admin/scope-declarations/pr-1111.md"
  # The file declares PR_NUMBER: 999 but the expected PR is 1111 — mismatch
  git add .agent-admin/
  git commit -q -m "Add mismatched scope declaration"
}

export PR_NUMBER="1111"
export ENFORCE_SCOPE="true"

run_test "Per-PR scope file PR_NUMBER mismatch → FAIL" 1 "setup_test_9"

# ----------------------------------------------------------------
# Cleanup
# ----------------------------------------------------------------
rm -rf "$TEST_DIR"

echo "=== Test Summary ==="
echo "Passed: $TEST_PASSED"
echo "Failed: $TEST_FAILED"
echo ""

if [ "$TEST_FAILED" -eq 0 ]; then
  echo "✅ All tests passed"
  exit 0
else
  echo "❌ $TEST_FAILED test(s) failed"
  exit 1
fi
