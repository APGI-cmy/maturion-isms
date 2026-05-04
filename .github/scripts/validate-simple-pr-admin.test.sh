#!/bin/bash
# validate-simple-pr-admin.test.sh
# Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.0.0
# Purpose: Test suite for validate-simple-pr-admin.sh
#
# Coverage:
#   T1   Missing .admin/pr.json                                → exit 1
#   T2   Invalid JSON in manifest                              → exit 1
#   T3   Missing required fields                               → exit 1
#   T4   issue is a string, not number                         → exit 1
#   T5   scope is empty list                                   → exit 1
#   T6   type is not an accepted value                         → exit 1
#   T7   risk is not low/medium/high                           → exit 1
#   T8   merge_authority is not CS2                            → exit 1
#   T9   requires_iaa is "false" (string, not boolean)         → exit 1
#   T10  governance-change with requires_iaa=false (bool)      → exit 1
#   T11  Changed file outside declared scope                   → exit 1
#   T12  Valid product-fix manifest with in-scope file         → exit 0
#   T13  Valid governance-change with both flags true          → exit 0
#
# Usage:
#   .github/scripts/validate-simple-pr-admin.test.sh
#
# Exit codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATE_SCRIPT="$SCRIPT_DIR/validate-simple-pr-admin.sh"
TEST_DIR=$(mktemp -d)
TEST_PASSED=0
TEST_FAILED=0

echo "=== MMM Simple PR Admin Validator Test Suite ==="
echo "Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.0.0"
echo "Test directory: $TEST_DIR"
echo ""

# ----------------------------------------------------------------
# Helper: run_test <name> <expected_exit> <setup_func>
# ----------------------------------------------------------------
run_test() {
    local test_name="$1"
    local expected_exit_code="$2"
    local setup_func="$3"

    echo "Test: $test_name"

    local test_workspace
    test_workspace=$(mktemp -d -p "$TEST_DIR")
    local original_dir="$PWD"
    cd "$test_workspace"

    # Minimal git repo setup — required so scope-to-diff (CHECK 9) can compute
    # a diff and not unconditionally skip.
    git init -q
    git config user.email "test@example.com"
    git config user.name "Test User"
    echo "initial" > README.md
    git add README.md
    git commit -q -m "Initial commit"
    git branch -M main
    git checkout -q -b test-branch

    "$setup_func"

    local output
    local actual_exit_code
    output=$(bash "$VALIDATE_SCRIPT" 2>&1)
    actual_exit_code=$?

    if [ "$actual_exit_code" -eq "$expected_exit_code" ]; then
        echo "  ✅ PASS (exit code: $actual_exit_code)"
        TEST_PASSED=$((TEST_PASSED + 1))
    else
        echo "  ❌ FAIL (expected: $expected_exit_code, got: $actual_exit_code)"
        echo "  Output:"
        echo "$output" | sed 's/^/    /'
        TEST_FAILED=$((TEST_FAILED + 1))
    fi

    cd "$original_dir"
    rm -rf "$test_workspace"
    echo ""
}

# ================================================================
# T1: Missing .admin/pr.json → exit 1
# ================================================================
setup_t1() {
    : # Do not create .admin/pr.json
}
run_test "T1 — Missing .admin/pr.json" 1 "setup_t1"

# ================================================================
# T2: Invalid JSON → exit 1
# ================================================================
setup_t2() {
    mkdir -p .admin
    echo "NOT VALID JSON {{{" > .admin/pr.json
    git add .admin/pr.json
    git commit -q -m "Add invalid manifest"
}
run_test "T2 — Invalid JSON in manifest" 1 "setup_t2"

# ================================================================
# T3: Missing required fields — only pr is present → exit 1
# ================================================================
setup_t3() {
    mkdir -p .admin
    echo '{"pr": 1530}' > .admin/pr.json
    git add .admin/pr.json
    git commit -q -m "Add incomplete manifest"
}
run_test "T3 — Missing required fields" 1 "setup_t3"

# ================================================================
# T4: issue is a string, not number → exit 1
# ================================================================
setup_t4() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": "1519",
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with string issue"
}
run_test "T4 — issue is a string (not number)" 1 "setup_t4"

# ================================================================
# T5: scope is empty list → exit 1
# ================================================================
setup_t5() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": [],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with empty scope"
}
run_test "T5 — scope is empty list" 1 "setup_t5"

# ================================================================
# T6: type is not an accepted value → exit 1
# ================================================================
setup_t6() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "unknown-type",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with invalid type"
}
run_test "T6 — type is invalid enum value" 1 "setup_t6"

# ================================================================
# T7: risk is not low/medium/high → exit 1
# ================================================================
setup_t7() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "critical",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with invalid risk"
}
run_test "T7 — risk is invalid enum value" 1 "setup_t7"

# ================================================================
# T8: merge_authority is not CS2 → exit 1
# ================================================================
setup_t8() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS1"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with wrong merge_authority"
}
run_test "T8 — merge_authority is not CS2" 1 "setup_t8"

# ================================================================
# T9: requires_iaa is "false" (string, not boolean) → exit 1
# A string value is truthy in Python but invalid per the schema.
# ================================================================
setup_t9() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": "false",
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with string requires_iaa"
}
run_test "T9 — requires_iaa is a string (not boolean)" 1 "setup_t9"

# ================================================================
# T10: governance-change with requires_iaa=false (correct bool) → exit 1
# governance-change requires both flags to be true
# ================================================================
setup_t10() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "governance-change",
  "owner": "Copilot",
  "scope": [".github/scripts/validate-simple-pr-admin.sh"],
  "risk": "high",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add governance manifest with requires_iaa=false"
}
run_test "T10 — governance-change with requires_iaa=false (must be true)" 1 "setup_t10"

# ================================================================
# T11: Changed file outside declared scope → exit 1
# ================================================================
setup_t11() {
    # Commit a file that is NOT listed in the scope
    mkdir -p apps/mmm/src
    echo "const x = 1;" > apps/mmm/src/UndeclaredPage.tsx
    git add apps/mmm/src/UndeclaredPage.tsx
    git commit -q -m "Change undeclared file"

    # Manifest only declares DashboardPage.tsx — UndeclaredPage.tsx is out of scope
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with limited scope"
}
run_test "T11 — changed file outside declared scope" 1 "setup_t11"

# ================================================================
# T12: Valid product-fix manifest with in-scope file → exit 0
# ================================================================
setup_t12() {
    # Commit a file that IS listed in the scope
    mkdir -p apps/mmm/src
    echo "const x = 1;" > apps/mmm/src/DashboardPage.tsx
    git add apps/mmm/src/DashboardPage.tsx
    git commit -q -m "Change DashboardPage"

    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1530,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass", "screenshot of dashboard empty state"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add valid product-fix manifest"
}
run_test "T12 — Valid product-fix manifest with in-scope file" 0 "setup_t12"

# ================================================================
# T13: Valid governance-change with requires_iaa=true and
#      requires_ecap=true → exit 0
# ================================================================
setup_t13() {
    # Commit a governance script that IS in the scope
    mkdir -p .github/scripts
    echo "# validator" > .github/scripts/validate-example.sh
    git add .github/scripts/validate-example.sh
    git commit -q -m "Add governance script"

    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1526,
  "issue": 1523,
  "type": "governance-change",
  "owner": "Copilot",
  "scope": [".github/scripts/validate-example.sh"],
  "risk": "high",
  "requires_iaa": true,
  "requires_ecap": true,
  "evidence_required": ["negative tests fail without evidence pack"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add valid governance-change manifest"
}
run_test "T13 — Valid governance-change with requires_iaa=true and requires_ecap=true" 0 "setup_t13"

# ----------------------------------------------------------------
# Cleanup
# ----------------------------------------------------------------
rm -rf "$TEST_DIR"

# ----------------------------------------------------------------
# Summary
# ----------------------------------------------------------------
echo "=== Test Summary ==="
echo "Passed: $TEST_PASSED"
echo "Failed: $TEST_FAILED"
echo ""

if [ "$TEST_FAILED" -eq 0 ]; then
    echo "✅ All tests passed"
    exit 0
else
    echo "❌ Some tests failed"
    exit 1
fi
