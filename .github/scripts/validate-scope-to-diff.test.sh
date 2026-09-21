#!/bin/bash
# Test stubs for validate-scope-to-diff.sh
# Authority: MERGE_GATE_PHILOSOPHY.md (BL-027), SCOPE_TO_DIFF_RULE.md
# Purpose: Basic smoke tests for scope-to-diff validation script
#
# NOTE: These are minimal test stubs. Full integration testing should be done
# in actual PR workflows. These tests verify basic error handling and messaging.
#
# Usage:
#   .github/scripts/validate-scope-to-diff.test.sh
#
# Exit Codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATE_SCRIPT="$SCRIPT_DIR/validate-scope-to-diff.sh"
TEST_DIR=$(mktemp -d)
TEST_PASSED=0
TEST_FAILED=0

echo "=== Scope-to-Diff Validation Test Suite ==="
echo "Test directory: $TEST_DIR"
echo ""

# Helper function to run a test
run_test() {
    local test_name="$1"
    local expected_exit_code="$2"
    local setup_func="$3"
    
    echo "Test: $test_name"
    
    # Create test environment using mktemp for guaranteed uniqueness
    local test_workspace=$(mktemp -d -p "$TEST_DIR")
    cd "$test_workspace"
    
    # Initialize git repo
    git init -q
    git config user.email "test@example.com"
    git config user.name "Test User"
    
    # Create initial commit on main
    echo "initial" > README.md
    git add README.md
    git commit -q -m "Initial commit"
    git branch -M main
    
    # Create feature branch
    git checkout -q -b test-branch
    
    # Run test-specific setup
    unset PR_NUMBER SCOPE_DIFF_FILES_PATH SCOPE_DIFF_FILES_JSON CHANGED_FILES_PATH
    $setup_func

    if [ -f "submitted-files.json" ]; then
        export SCOPE_DIFF_FILES_PATH="$test_workspace/submitted-files.json"
    fi
    if [ -f ".agent-admin/scope-declarations/pr-2049.md" ]; then
        export PR_NUMBER=2049
    fi
    
    # Run validation script and capture output
    set +e
    local output
    output=$(bash "$VALIDATE_SCRIPT" 2>&1)
    local actual_exit_code=$?
    set -e
    
    # Check result
    if [ "$actual_exit_code" -eq "$expected_exit_code" ]; then
        echo "  ✅ PASS (exit code: $actual_exit_code)"
        TEST_PASSED=$((TEST_PASSED + 1))
    else
        echo "  ❌ FAIL (expected: $expected_exit_code, got: $actual_exit_code)"
        echo "  Output:"
        echo "$output" | sed 's/^/    /'
        TEST_FAILED=$((TEST_FAILED + 1))
    fi
    
    # Cleanup
    cd "$TEST_DIR"
    rm -rf "$test_workspace"
    echo ""
}

# Test 1: Missing SCOPE_DECLARATION.md
setup_test_1() {
    # Don't create SCOPE_DECLARATION.md
    echo "change" > file1.txt
    git add file1.txt
    git commit -q -m "Test change"
}

run_test "Missing SCOPE_DECLARATION.md" 1 "setup_test_1"

# Test 2: Empty SCOPE_DECLARATION.md with changes
setup_test_2() {
    echo "change" > file1.txt
    git add file1.txt
    git commit -q -m "Test change"
    
    # Create empty SCOPE_DECLARATION.md
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
EOF
}

run_test "Empty SCOPE_DECLARATION.md with changes" 1 "setup_test_2"

# Test 3: Malformed bullet (no backticks)
setup_test_3() {
    echo "change" > file1.txt
    git add file1.txt
    git commit -q -m "Test change"
    
    # Create SCOPE_DECLARATION.md with malformed entry (no backticks)
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
- file1.txt - Description without backticks
EOF
}

run_test "Malformed bullet (no backticks)" 1 "setup_test_3"

# Test 4: Missing file in declaration (MISSING FILES error)
setup_test_4() {
    echo "change1" > file1.txt
    echo "change2" > file2.txt
    git add file1.txt file2.txt
    git commit -q -m "Test change"
    
    # Only declare file1.txt, missing file2.txt
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
- `file1.txt` - First file
EOF
}

run_test "Missing file in declaration" 1 "setup_test_4"

# Test 5: Extra file in declaration (EXTRA FILES error)
setup_test_5() {
    echo "change1" > file1.txt
    git add file1.txt
    git commit -q -m "Test change"
    
    # Declare both file1.txt and file2.txt, but only file1.txt changed
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
- `file1.txt` - First file
- `file2.txt` - Extra file not in git diff
EOF
}

run_test "Extra file in declaration" 1 "setup_test_5"

# Test 6: Exact match (SUCCESS case)
setup_test_6() {
    echo "change1" > file1.txt
    git add file1.txt
    git commit -q -m "Test change"
    
    # Declare file1.txt correctly
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
- `file1.txt` - First file
EOF
    
    # Add SCOPE_DECLARATION.md to git diff as well
    git add SCOPE_DECLARATION.md
    git commit -q -m "Add scope declaration"
    
    # Update SCOPE_DECLARATION.md to include itself
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
- `SCOPE_DECLARATION.md` - Scope declaration
- `file1.txt` - First file
EOF
}

run_test "Exact match (canonical format)" 0 "setup_test_6"

# Test 7: Empty PR (no changes, empty declaration)
setup_test_7() {
    # Create empty SCOPE_DECLARATION.md
    cat > SCOPE_DECLARATION.md << 'EOF'
# Scope Declaration
## Changed Files
EOF
}

run_test "Empty PR (no changes)" 0 "setup_test_7"

# Test 8: Authoritative submitted file set rejects inherited extra declarations
setup_test_8() {
    mkdir -p .agent-admin/scope-declarations
    cat > submitted-files.json << 'EOF'
[".agent-admin/scope-declarations/pr-2049.md","file1.txt"]
EOF

    cat > .agent-admin/scope-declarations/pr-2049.md << 'EOF'
# Scope Declaration
FILES_CHANGED: 3
- `.agent-admin/scope-declarations/pr-2049.md`
- `file1.txt`
- `inherited-only.txt`
EOF
}

run_test "Submitted PR file set rejects extra inherited declarations" 1 "setup_test_8"

# Test 9: Authoritative submitted file set rejects missing declarations
setup_test_9() {
    mkdir -p .agent-admin/scope-declarations
    cat > submitted-files.json << 'EOF'
[".agent-admin/scope-declarations/pr-2049.md","file1.txt","file2.txt"]
EOF

    cat > .agent-admin/scope-declarations/pr-2049.md << 'EOF'
# Scope Declaration
FILES_CHANGED: 2
- `.agent-admin/scope-declarations/pr-2049.md`
- `file1.txt`
EOF
}

run_test "Submitted PR file set rejects missing declarations" 1 "setup_test_9"

# Cleanup test directory
rm -rf "$TEST_DIR"

# Summary
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
