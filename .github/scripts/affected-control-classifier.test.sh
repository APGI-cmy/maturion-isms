#!/bin/bash
# affected-control-classifier.test.sh
# Authority: maturion-isms#1619
# Purpose: Regression tests for affected-control-classifier.sh
#
# Tests:
#   T_acc1  .github/scripts/** change → GOVERNANCE_CONTROLLED_CHANGED: true, GATE_CONTROL class
#   T_acc2  .github/workflows/** change → GOVERNANCE_CONTROLLED_CHANGED: true, GATE_CONTROL class
#   T_acc3  governance/canon/** change → GOVERNANCE_CONTROLLED_CHANGED: true, CANON_GOVERNANCE class
#   T_acc4  Non-governance path only → pre-alert N/A
#   T_acc5  PR#1620 shape: .github/scripts + .github/workflows only → GATE_CONTROL, PRODUCT_DELIVERY_REQUIRED: no
#   T_acc6  Mixed: .github/scripts + product code → PRODUCT_DELIVERY_REQUIRED: yes
#
# Usage:
#   bash .github/scripts/affected-control-classifier.test.sh
#
# Exit Codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLASSIFIER="$SCRIPT_DIR/affected-control-classifier.sh"
TEST_DIR=$(mktemp -d)
PASS_COUNT=0
FAIL_COUNT=0

echo "=== Affected-Control Classifier Tests ==="
echo "Authority: maturion-isms#1619"
echo "Test directory: $TEST_DIR"
echo ""

# ── Helper ───────────────────────────────────────────────────────────────────

run_test() {
  local test_name="$1"
  local check_func="$2"
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
  git commit -q -m "Initial commit"
  git branch -M main
  git checkout -q -b test-branch

  "$setup_func"

  set +e
  local output
  output=$(BASE_SHA="main" bash "$CLASSIFIER" 2>&1)
  local actual_exit_code=$?
  set -e

  if "$check_func" "$output" "$actual_exit_code"; then
    echo "  ✅ PASS"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "  ❌ FAIL"
    echo "$output" | sed 's/^/    /'
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi

  cd "$original_dir"
  rm -rf "$test_workspace"
  echo ""
}

# ── T_acc1: .github/scripts/** triggers GATE_CONTROL ─────────────────────────

setup_t_acc1() {
  mkdir -p .github/scripts
  echo "#!/bin/bash" > .github/scripts/some-gate.sh
  git add .
  git commit -q -m "Add .github/scripts file"
}

check_t_acc1() {
  local output="$1"
  local exit_code="$2"
  [ "$exit_code" -eq 0 ] || return 1
  echo "$output" | grep -q "GATE_CONTROL class" || return 1
  echo "$output" | grep -q "ECAP_REQUIRED" || return 1
  echo "$output" | grep -q "IAA_REQUIRED" || return 1
}

run_test "T_acc1 .github/scripts/** → GATE_CONTROL class, ECAP+IAA required" check_t_acc1 setup_t_acc1

# ── T_acc2: .github/workflows/** triggers GATE_CONTROL ───────────────────────

setup_t_acc2() {
  mkdir -p .github/workflows
  echo "name: test" > .github/workflows/test.yml
  git add .
  git commit -q -m "Add .github/workflows file"
}

check_t_acc2() {
  local output="$1"
  local exit_code="$2"
  [ "$exit_code" -eq 0 ] || return 1
  echo "$output" | grep -q "GATE_CONTROL class" || return 1
  echo "$output" | grep -q "ECAP_REQUIRED" || return 1
}

run_test "T_acc2 .github/workflows/** → GATE_CONTROL class, ECAP required" check_t_acc2 setup_t_acc2

# ── T_acc3: governance/canon/** triggers CANON_GOVERNANCE ────────────────────

setup_t_acc3() {
  mkdir -p governance/canon
  echo "# canon doc" > governance/canon/SOME_DOC.md
  git add .
  git commit -q -m "Add governance/canon file"
}

check_t_acc3() {
  local output="$1"
  local exit_code="$2"
  [ "$exit_code" -eq 0 ] || return 1
  echo "$output" | grep -q "CANON_GOVERNANCE class" || return 1
  echo "$output" | grep -q "CANON_INVENTORY_SYNC_REQUIRED: yes" || return 1
}

run_test "T_acc3 governance/canon/** → CANON_GOVERNANCE class, CANON_INVENTORY_SYNC_REQUIRED: yes" check_t_acc3 setup_t_acc3

# ── T_acc4: Non-governance path only → pre-alert N/A ─────────────────────────

setup_t_acc4() {
  mkdir -p docs
  echo "# docs" > docs/README.md
  git add .
  git commit -q -m "Add docs file"
}

check_t_acc4() {
  local output="$1"
  local exit_code="$2"
  [ "$exit_code" -eq 0 ] || return 1
  echo "$output" | grep -q "Affected-control pre-alert: N/A" || return 1
  # Must NOT emit the pre-alert block
  echo "$output" | grep -q "ECAP_REQUIRED:" && return 1
  return 0
}

run_test "T_acc4 docs/** only → pre-alert N/A, no ECAP_REQUIRED emitted" check_t_acc4 setup_t_acc4

# ── T_acc5: PR#1620 shape: .github/scripts + .github/workflows only ───────────

setup_t_acc5() {
  mkdir -p .github/scripts .github/workflows
  echo "#!/bin/bash" > .github/scripts/validate-product-delivery-gates.sh
  echo "name: preflight" > .github/workflows/preflight-evidence-gate.yml
  git add .
  git commit -q -m "PR#1620-style: .github/scripts + .github/workflows only"
}

check_t_acc5() {
  local output="$1"
  local exit_code="$2"
  [ "$exit_code" -eq 0 ] || return 1
  echo "$output" | grep -q "GATE_CONTROL class" || return 1
  echo "$output" | grep -q "PRODUCT_DELIVERY_REQUIRED:.*no" || return 1
  echo "$output" | grep -q "CANON_INVENTORY_SYNC_REQUIRED:.*no" || return 1
  echo "$output" | grep -q "ECAP_REQUIRED" || return 1
  echo "$output" | grep -q "IAA_REQUIRED" || return 1
}

run_test "T_acc5 PR#1620 shape: .github/scripts+workflows only → GATE_CONTROL, PRODUCT_DELIVERY_REQUIRED: no" check_t_acc5 setup_t_acc5

# ── T_acc6: Mixed: .github/scripts + product code → PRODUCT_DELIVERY_REQUIRED: yes

setup_t_acc6() {
  mkdir -p .github/scripts apps/mmm/src
  echo "#!/bin/bash" > .github/scripts/some-gate.sh
  echo "export const x = 1;" > apps/mmm/src/feature.ts
  git add .
  git commit -q -m "Mixed: .github/scripts + product .ts file"
}

check_t_acc6() {
  local output="$1"
  local exit_code="$2"
  [ "$exit_code" -eq 0 ] || return 1
  echo "$output" | grep -q "GATE_CONTROL class" || return 1
  echo "$output" | grep -q "PRODUCT_DELIVERY_REQUIRED:.*yes" || return 1
}

run_test "T_acc6 .github/scripts + product code → PRODUCT_DELIVERY_REQUIRED: yes" check_t_acc6 setup_t_acc6

# ── Summary ──────────────────────────────────────────────────────────────────

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
