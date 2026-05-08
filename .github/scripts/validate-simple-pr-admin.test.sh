#!/bin/bash
# validate-simple-pr-admin.test.sh
# Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0
# Purpose: Test suite for validate-simple-pr-admin.sh
#
# Coverage:
#   T1   Missing .admin/pr.json (no PR_NUMBER)                 → exit 1
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
#   T14  governance-control file changed + product-fix + flags false → exit 1
#   T15  governance-control file changed + flags true          → exit 0
#   T16  non-governance product file changed + flags false     → exit 0
#   T17  evidence_required is empty list                       → exit 1
#   T18  Per-PR manifest at .admin/prs/pr-N.json (no legacy)   → exit 0
#   T19  Both per-PR and legacy manifest for same PR number    → exit 1 (MANIFEST-CONFLICT)
#   T20  Implementation scope + missing execution_model         → exit 1
#   T21  Implementation scope + invalid execution_model value   → exit 1
#   T22  builder-governed + missing implementing_agent          → exit 1
#   T23  foreman-orchestrated + missing orchestrating_agent     → exit 1
#   T24  foreman-orchestrated + missing implementing_agent      → exit 1
#   T25  cs2-hotfix-override + missing cs2_justification        → exit 1
#   T26  builder-governed + implementing_agent present          → exit 0
#   T27  foreman-orchestrated + both companions present         → exit 0
#   T28  cs2-hotfix-override + justification present            → exit 0
#   T29  .agent-workspace/**/knowledge/** changed + flags false → exit 1
#   T30  .agent-workspace/**/knowledge/** changed + flags true  → exit 0
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
echo "Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0"
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
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
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
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
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
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
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

# ================================================================
# T14: governance-control file changed + type=product-fix + flags false → exit 1
# Regression: the path-based check must fire even when declared type
# is product-fix (not governance-change/agent-contract-change).
# ================================================================
setup_t14() {
    # Commit a file under .github/workflows/ (governance-control path)
    mkdir -p .github/workflows
    echo "name: gate" > .github/workflows/some-gate.yml
    git add .github/workflows/some-gate.yml
    git commit -q -m "Change governance-control workflow"

    # Manifest declares type=product-fix and flags=false — should fail CHECK 8
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1531,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": [".github/workflows/some-gate.yml"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with governance file but flags false"
}
run_test "T14 — governance-control file changed + product-fix + flags false" 1 "setup_t14"

# ================================================================
# T15: governance-control file changed + flags true → exit 0
# Regression: when flags are correctly set to true the path-based
# check must pass, regardless of declared type.
# ================================================================
setup_t15() {
    # Commit a file under .github/scripts/ (governance-control path)
    mkdir -p .github/scripts
    echo "# script" > .github/scripts/some-validator.sh
    git add .github/scripts/some-validator.sh
    git commit -q -m "Change governance-control script"

    # Manifest declares type=product-fix but flags=true — should pass CHECK 8
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1531,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": [".github/scripts/some-validator.sh"],
  "risk": "high",
  "requires_iaa": true,
  "requires_ecap": true,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with governance file and flags true"
}
run_test "T15 — governance-control file changed + flags true" 0 "setup_t15"

# ================================================================
# T16: non-governance product file changed + product-fix + flags false → exit 0
# Regression: governance-control flag check must NOT fire when only
# product/app files are changed.
# ================================================================
setup_t16() {
    # Commit a file under apps/mmm/ (not a governance-control path)
    mkdir -p apps/mmm/src
    echo "const y = 2;" > apps/mmm/src/SomePage.tsx
    git add apps/mmm/src/SomePage.tsx
    git commit -q -m "Change non-governance product file"

    # Manifest declares type=product-fix and flags=false — should pass CHECK 8
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1531,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/SomePage.tsx"],
  "risk": "low",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest for non-governance product change"
}
run_test "T16 — non-governance product file changed + product-fix + flags false" 0 "setup_t16"

# ================================================================
# T17: evidence_required is empty list → exit 1
# ================================================================
setup_t17() {
    mkdir -p .admin
    cat > .admin/pr.json << 'EOF'
{
  "pr": 1531,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": [],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Add manifest with empty evidence_required"
}
run_test "T17 — evidence_required is empty list" 1 "setup_t17"

# ================================================================
# T18: Per-PR manifest at .admin/prs/pr-9999.json (no legacy) → exit 0
# Validates that the validator resolves per-PR manifest when PR_NUMBER
# is set and no legacy .admin/pr.json exists.
# ================================================================
setup_t18() {
    # Commit a file that IS listed in the scope
    mkdir -p apps/mmm/src
    echo "const x = 1;" > apps/mmm/src/DashboardPage.tsx
    git add apps/mmm/src/DashboardPage.tsx
    git commit -q -m "Change DashboardPage"

    mkdir -p .admin/prs
    cat > .admin/prs/pr-9999.json << 'EOF'
{
  "pr": 9999,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "low",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass", "screenshot of dashboard"],
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
}
EOF
    git add .admin/prs/pr-9999.json
    git commit -q -m "Add per-PR manifest"
    export PR_NUMBER="9999"
}
run_test "T18 — per-PR manifest at .admin/prs/pr-9999.json (no legacy)" 0 "setup_t18"
unset PR_NUMBER

# ================================================================
# T19: Both per-PR manifest and legacy .admin/pr.json exist for
#      the SAME PR number → exit 1 (MANIFEST-CONFLICT)
# ================================================================
setup_t19() {
    mkdir -p .admin/prs
    cat > .admin/prs/pr-8888.json << 'EOF'
{
  "pr": 8888,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "low",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    # Legacy manifest with the SAME PR number — conflict
    cat > .admin/pr.json << 'EOF'
{
  "pr": 8888,
  "issue": 1519,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/DashboardPage.tsx"],
  "risk": "low",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/prs/pr-8888.json .admin/pr.json
    git commit -q -m "Add both per-PR and legacy manifests for same PR"
    export PR_NUMBER="8888"
}
run_test "T19 — per-PR and legacy manifest for same PR number (MANIFEST-CONFLICT)" 1 "setup_t19"
unset PR_NUMBER

# ================================================================
# T20: Implementation scope + missing execution_model → exit 1
# ================================================================
setup_t20() {
    mkdir -p apps/mmm/src .admin
    echo "export const x = 1;" > apps/mmm/src/DashboardPage.tsx
    git add apps/mmm/src/DashboardPage.tsx
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2001,
  "issue": 1561,
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
    git commit -q -m "Manifest missing execution_model"
}
run_test "T20 — implementation scope missing execution_model" 1 "setup_t20"

# ================================================================
# T21: Implementation scope + invalid execution_model value → exit 1
# ================================================================
setup_t21() {
    mkdir -p apps/mmm/src .admin
    echo "export const x = 2;" > apps/mmm/src/Feature.tsx
    git add apps/mmm/src/Feature.tsx
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2002,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/Feature.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "random-model"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Manifest with invalid execution_model"
}
run_test "T21 — implementation scope invalid execution_model" 1 "setup_t21"

# ================================================================
# T22: builder-governed + missing implementing_agent → exit 1
# ================================================================
setup_t22() {
    mkdir -p apps/mmm/src .admin
    echo "export const x = 3;" > apps/mmm/src/Builder.tsx
    git add apps/mmm/src/Builder.tsx
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2003,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/Builder.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "builder-governed"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Missing implementing_agent for builder-governed"
}
run_test "T22 — builder-governed missing implementing_agent" 1 "setup_t22"

# ================================================================
# T23: foreman-orchestrated + missing orchestrating_agent → exit 1
# ================================================================
setup_t23() {
    mkdir -p modules/pit .admin
    echo "# PIT doc" > modules/pit/functional.md
    git add modules/pit/functional.md
    git commit -q -m "Change implementation path under modules"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2004,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["modules/pit/functional.md"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "foreman-orchestrated",
  "implementing_agent": "pit-specialist"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Missing orchestrating_agent for foreman-orchestrated"
}
run_test "T23 — foreman-orchestrated missing orchestrating_agent" 1 "setup_t23"

# ================================================================
# T24: foreman-orchestrated + missing implementing_agent → exit 1
# ================================================================
setup_t24() {
    mkdir -p modules/pit .admin
    echo "# PIT spec" > modules/pit/spec.md
    git add modules/pit/spec.md
    git commit -q -m "Change implementation path under modules"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2005,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["modules/pit/spec.md"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "foreman-orchestrated",
  "orchestrating_agent": "foreman-v2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Missing implementing_agent for foreman-orchestrated"
}
run_test "T24 — foreman-orchestrated missing implementing_agent" 1 "setup_t24"

# ================================================================
# T25: cs2-hotfix-override + missing cs2_justification → exit 1
# ================================================================
setup_t25() {
    mkdir -p apps/mmm/src .admin
    echo "export const x = 4;" > apps/mmm/src/Hotfix.tsx
    git add apps/mmm/src/Hotfix.tsx
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2006,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/Hotfix.tsx"],
  "risk": "high",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "cs2-hotfix-override"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Missing cs2_justification for hotfix override"
}
run_test "T25 — cs2-hotfix-override missing cs2_justification" 1 "setup_t25"

# ================================================================
# T26: builder-governed + implementing_agent present → exit 0
# ================================================================
setup_t26() {
    mkdir -p apps/mmm/src .admin
    echo "export const x = 5;" > apps/mmm/src/BuilderValid.tsx
    git add apps/mmm/src/BuilderValid.tsx
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2007,
  "issue": 1561,
  "type": "product-fix",
  "owner": "ui-builder",
  "scope": ["apps/mmm/src/BuilderValid.tsx"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "builder-governed",
  "implementing_agent": "ui-builder"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Valid builder-governed execution model"
}
run_test "T26 — builder-governed valid companion field" 0 "setup_t26"

# ================================================================
# T27: foreman-orchestrated + both companions present → exit 0
# ================================================================
setup_t27() {
    mkdir -p modules/pit .admin
    echo "# PIT implementation doc" > modules/pit/implementation.md
    git add modules/pit/implementation.md
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2008,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["modules/pit/implementation.md"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "foreman-orchestrated",
  "orchestrating_agent": "foreman-v2",
  "implementing_agent": "pit-specialist"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Valid foreman-orchestrated execution model"
}
run_test "T27 — foreman-orchestrated valid companion fields" 0 "setup_t27"

# ================================================================
# T28: cs2-hotfix-override + justification present → exit 0
# ================================================================
setup_t28() {
    mkdir -p apps/mmm/src .admin
    echo "export const x = 6;" > apps/mmm/src/HotfixValid.tsx
    git add apps/mmm/src/HotfixValid.tsx
    git commit -q -m "Change implementation file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2009,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["apps/mmm/src/HotfixValid.tsx"],
  "risk": "high",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2",
  "execution_model": "cs2-hotfix-override",
  "cs2_justification": "CS2 emergency approval: issue #1561"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Valid cs2-hotfix-override execution model"
}
run_test "T28 — cs2-hotfix-override valid justification" 0 "setup_t28"

# ================================================================
# T29: .agent-workspace/**/knowledge/** changed + flags false → exit 1
# Regression: tier-2 knowledge paths are governance-control and
# must require requires_iaa/requires_ecap=true.
# ================================================================
setup_t29() {
    mkdir -p .agent-workspace/governance-liaison-isms/knowledge .admin
    echo "# updated knowledge" > .agent-workspace/governance-liaison-isms/knowledge/index.md
    git add .agent-workspace/governance-liaison-isms/knowledge/index.md
    git commit -q -m "Change tier-2 knowledge file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2010,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": [".agent-workspace/governance-liaison-isms/knowledge/index.md"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Knowledge-path manifest with flags false"
}
run_test "T29 — .agent-workspace/**/knowledge/** changed + flags false" 1 "setup_t29"

# ================================================================
# T30: .agent-workspace/**/knowledge/** changed + flags true → exit 0
# ================================================================
setup_t30() {
    mkdir -p .agent-workspace/governance-liaison-isms/knowledge .admin
    echo "# updated knowledge" > .agent-workspace/governance-liaison-isms/knowledge/patterns.md
    git add .agent-workspace/governance-liaison-isms/knowledge/patterns.md
    git commit -q -m "Change tier-2 knowledge file"
    cat > .admin/pr.json << 'EOF'
{
  "pr": 2011,
  "issue": 1561,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": [".agent-workspace/governance-liaison-isms/knowledge/patterns.md"],
  "risk": "high",
  "requires_iaa": true,
  "requires_ecap": true,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
    git add .admin/pr.json
    git commit -q -m "Knowledge-path manifest with flags true"
}
run_test "T30 — .agent-workspace/**/knowledge/** changed + flags true" 0 "setup_t30"

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
