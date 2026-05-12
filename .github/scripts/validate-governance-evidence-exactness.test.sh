#!/bin/bash
# validate-governance-evidence-exactness.test.sh
# Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521
# Purpose: Tests for the ISSUE-MISMATCH (Check 6) section of
#          validate-governance-evidence-exactness.sh
#
# Specifically tests:
#   1. "ISSUE: #1521 — long title" parses declared issue as 1521
#   2. "Closes #1521" in PR body establishes expected issue authority
#   3. Mismatch between per-PR ISSUE: #N and PR body authority fails
#   4. "Fixes maturion-isms#1521" in PR body still works
#   5. "Addresses #1521" in PR body works
#
# Usage:
#   .github/scripts/validate-governance-evidence-exactness.test.sh
#
# Exit Codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="$SCRIPT_DIR/validate-governance-evidence-exactness.sh"
TEST_DIR=$(mktemp -d)
TEST_PASSED=0
TEST_FAILED=0

echo "=== Governance Evidence Exactness — ISSUE-MISMATCH Tests ==="
echo "Authority: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521"
echo "Test directory: $TEST_DIR"
echo ""

# ----------------------------------------------------------------
# Helper: run a test targeting the Check 6 output only
# ----------------------------------------------------------------
run_issue_test() {
  local test_name="$1"
  local expected_exit_code="$2"
  local setup_func="$3"

  echo "Test: $test_name"

  local test_workspace
  test_workspace=$(mktemp -d -p "$TEST_DIR")
  local original_dir="$PWD"
  cd "$test_workspace"

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
# Helper: minimal valid per-PR scope file
# Lists only the scope file itself as the changed file
# (keeps Check 1 PATH-MISMATCH silent so tests isolate Check 6)
# ----------------------------------------------------------------
make_per_pr_scope_file() {
  local pr_num="$1"
  local issue_num="$2"
  local issue_title="${3:-Test Issue Title}"
  local dest=".agent-admin/scope-declarations/pr-${pr_num}.md"
  mkdir -p "$(dirname "$dest")"
  cat > "$dest" << EOF
SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: ${pr_num}
ISSUE: #${issue_num} — ${issue_title}
BRANCH: test-branch
OWNER: test-agent
DATE_UTC: 2026-04-30T00:00:00Z
OUT_OF_SCOPE:
- Tests
FILES_CHANGED: 1
- \`.agent-admin/scope-declarations/pr-${pr_num}.md\`
EOF
}

# ============================================================
# TEST 1: "ISSUE: #1521 — long title" parses declared issue as 1521
#         (declared == expected via EXPECTED_ISSUE_NUMBER) → PASS
# ============================================================
setup_test_issue_long_title() {
  make_per_pr_scope_file "1234" "1521" "Hardening — Enforce per-PR scope declarations and block root SCOPE_DECLARATION.md rewrites"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export PR_NUMBER="1234"
export PR_BODY=""
export EXPECTED_ISSUE_NUMBER="1521"

run_issue_test "ISSUE: #1521 — long title parses as 1521 (match) → PASS" 0 "setup_test_issue_long_title"

# ============================================================
# TEST 2: "Closes #1521" in PR body establishes expected authority
#         (declared == expected from PR body) → PASS
# ============================================================
setup_test_closes_bare() {
  make_per_pr_scope_file "1234" "1521" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Closes #1521"

run_issue_test "'Closes #1521' establishes expected authority (match) → PASS" 0 "setup_test_closes_bare"

# ============================================================
# TEST 3: "Fixes maturion-isms#1521" still works → PASS
# ============================================================
setup_test_fixes_prefixed() {
  make_per_pr_scope_file "1234" "1521" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Fixes maturion-isms#1521"

run_issue_test "'Fixes maturion-isms#1521' establishes authority (match) → PASS" 0 "setup_test_fixes_prefixed"

# ============================================================
# TEST 4: "Addresses #1521" in PR body works → PASS
# ============================================================
setup_test_addresses_bare() {
  make_per_pr_scope_file "1234" "1521" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Addresses #1521"

run_issue_test "'Addresses #1521' establishes authority (match) → PASS" 0 "setup_test_addresses_bare"

# ============================================================
# TEST 5: Mismatch between per-PR ISSUE: #1521 and PR body #9999 → FAIL
# ============================================================
setup_test_issue_mismatch() {
  make_per_pr_scope_file "1234" "1521" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Closes #9999"

run_issue_test "ISSUE: #1521 but PR body says Closes #9999 (mismatch) → FAIL" 1 "setup_test_issue_mismatch"

# ============================================================
# TEST 6: ISSUE field missing entirely → WARNING only (not error) → PASS
# ============================================================
setup_test_issue_missing() {
  mkdir -p .agent-admin/scope-declarations
  cat > .agent-admin/scope-declarations/pr-1234.md << 'EOF'
SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: 1234
BRANCH: test
OWNER: test
DATE_UTC: 2026-04-30T00:00:00Z
OUT_OF_SCOPE:
- Tests
FILES_CHANGED: 1
- `.agent-admin/scope-declarations/pr-1234.md`
EOF
  git add .agent-admin/
  git commit -q -m "Add scope without ISSUE field"
}

export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Closes #1521"

run_issue_test "ISSUE field missing — WARNING only, gate still passes → PASS" 0 "setup_test_issue_missing"

# ============================================================
# TEST 7: Legacy **Issue**: maturion-isms#1521 format still parses correctly → PASS
# ============================================================
setup_test_legacy_issue_format() {
  mkdir -p .agent-admin/scope-declarations
  cat > .agent-admin/scope-declarations/pr-1234.md << 'EOF'
SCOPE_SCHEMA_VERSION: v1
**Issue**: maturion-isms#1521
BRANCH: test
OWNER: test
DATE_UTC: 2026-04-30T00:00:00Z
FILES_CHANGED: 1
- `.agent-admin/scope-declarations/pr-1234.md`
EOF
  git add .agent-admin/
  git commit -q -m "Add scope with legacy issue format"
}

export EXPECTED_ISSUE_NUMBER="1521"
export PR_BODY=""

run_issue_test "Legacy **Issue**: maturion-isms#1521 format parses correctly → PASS" 0 "setup_test_legacy_issue_format"

# ============================================================
# TEST 8: "Resolves #1521" in PR body → PASS
# ============================================================
setup_test_resolves_bare() {
  make_per_pr_scope_file "1234" "1521" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Resolves #1521"

run_issue_test "'Resolves #1521' establishes authority (match) → PASS" 0 "setup_test_resolves_bare"

# ============================================================
# PR#1618-style regression tests
# Tests covering the incidental historical reference case observed in
# PR APGI-cmy/maturion-isms#1618.
# ============================================================

# TEST 9: Historical reference + explicit Governing-Issue → Governing-Issue wins
# PR body: "PR APGI-cmy/maturion-isms#1590 exposed a gap..." (historical)
#          + "Governing-Issue: APGI-cmy/maturion-isms#1617" (explicit)
# Scope: ISSUE: #1617
# Expected: Governing-Issue field takes priority → match → PASS
setup_test_governing_issue_priority_over_historical_ref() {
  make_per_pr_scope_file "1618" "1617" "Add mandatory LFV package"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file for PR#1618-style test"
}

export PR_NUMBER="1618"
export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Governance-only PR. Historical reference: PR APGI-cmy/maturion-isms#1590 exposed a gap in the pre-build assurance model. This PR closes that gap at the governance/canon level.

Governing-Issue: APGI-cmy/maturion-isms#1617"

run_issue_test "PR#1618-style: historical ref #1590 + Governing-Issue: #1617 → Governing-Issue wins (match) → PASS" 0 "setup_test_governing_issue_priority_over_historical_ref"

# TEST 10: Historical reference only (no Governing-Issue, no closing keyword)
# PR body: "PR APGI-cmy/maturion-isms#1590 exposed a gap..." (historical only)
# Scope: ISSUE: #1617
# Expected: No authoritative source found → informational only → PASS
# (historical reference must NOT be treated as expected issue anchor)
setup_test_historical_ref_no_authority() {
  make_per_pr_scope_file "1618" "1617" "Add mandatory LFV package"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export PR_NUMBER="1618"
export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Governance-only PR. Historical reference: PR APGI-cmy/maturion-isms#1590 exposed a gap. No closing keyword, no Governing-Issue field."

run_issue_test "PR#1618-style: historical ref #1590 only, no authority → informational only → PASS" 0 "setup_test_historical_ref_no_authority"

# TEST 11: Governing-Issue field overrides closing keyword in same PR body
# PR body: "Closes #9999" + "Governing-Issue: #1617"
# Scope: ISSUE: #1617
# Expected: Governing-Issue takes priority over closing keyword → match → PASS
setup_test_governing_issue_beats_closing_keyword() {
  make_per_pr_scope_file "1618" "1617" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export PR_NUMBER="1618"
export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Closes #9999

Governing-Issue: #1617"

run_issue_test "Governing-Issue: #1617 overrides 'Closes #9999' closing keyword → match → PASS" 0 "setup_test_governing_issue_beats_closing_keyword"

# TEST 12: Governing-Issue with mismatch
# PR body: "Governing-Issue: #9999"
# Scope: ISSUE: #1617
# Expected: Governing-Issue #9999 ≠ declared #1617 → FAIL
setup_test_governing_issue_mismatch() {
  make_per_pr_scope_file "1618" "1617" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export PR_NUMBER="1618"
export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Governing-Issue: APGI-cmy/maturion-isms#9999"

run_issue_test "Governing-Issue: #9999 vs scope #1617 (mismatch) → FAIL" 1 "setup_test_governing_issue_mismatch"

# TEST 13: Governing-Issue bare format (#N without repo prefix)
# PR body: "Governing-Issue: #1617"
# Scope: ISSUE: #1617
# Expected: match → PASS
setup_test_governing_issue_bare() {
  make_per_pr_scope_file "1618" "1617" "Test issue"
  git add .agent-admin/
  git commit -q -m "Add per-PR scope file"
}

export PR_NUMBER="1618"
export EXPECTED_ISSUE_NUMBER=""
export PR_BODY="Governing-Issue: #1617"

run_issue_test "Governing-Issue: #1617 (bare format) → match → PASS" 0 "setup_test_governing_issue_bare"

# ============================================================
# Cleanup
# ============================================================
rm -rf "$TEST_DIR"
unset PR_NUMBER PR_BODY EXPECTED_ISSUE_NUMBER

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
