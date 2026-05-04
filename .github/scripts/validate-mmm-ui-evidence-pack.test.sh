#!/bin/bash
# validate-mmm-ui-evidence-pack.test.sh
# Authority: governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md v1.1.0
# Purpose: Regression test suite for validate-mmm-ui-evidence-pack.sh
#
# Coverage:
#   T-01  No prohibited phrase in proof → PASS (gate not triggered)
#   T-02  Prohibited phrase "handover ready" + no LUIEP artifact → FAIL
#   T-03  Prohibited phrase "L2 complete" + no LUIEP artifact → FAIL
#   T-04  Prohibited phrase "L3 complete" + LUIEP has screenshots_provided: NO → FAIL
#   T-05  Prohibited phrase + LUIEP cs2_sign_off: "PENDING — ..." → FAIL
#   T-06  Prohibited phrase + LUIEP ui_renders_correctly: PENDING → FAIL
#   T-07  Prohibited phrase + LUIEP auth_flow_confirmed: PENDING → FAIL
#   T-08  "operational-complete" claim + e2e_workflow_confirmed: PENDING → FAIL
#   T-09  Prohibited phrase + LUIEP missing route_inventory section → FAIL
#   T-10  Prohibited phrase + LUIEP missing required route "/forgot-password" → FAIL
#   T-11  Prohibited phrase + LUIEP all screenshot_refs PENDING → FAIL (< 9 screenshots)
#   T-12  Prohibited phrase + LUIEP missing network_api_evidence section → FAIL
#   T-13  Prohibited phrase + LUIEP network_api_evidence all endpoints PENDING → FAIL
#   T-14  Prohibited phrase + LUIEP missing operational_status_matrix section → FAIL
#   T-15  Valid L2 evidence pack → PASS
#   T-16  Valid L3 evidence pack → PASS
#   T-17  New phrase "merge ready" triggers gate (no artifact) → FAIL
#   T-18  New phrase "merge-ready" triggers gate (no artifact) → FAIL
#   T-19  New phrase "build complete" triggers gate (no artifact) → FAIL
#   T-20  New phrase "build completed" triggers gate (no artifact) → FAIL
#   T-21  New phrase "user journey complete" triggers gate (no artifact) → FAIL
#   T-22  New phrase "final_state: COMPLETE" triggers gate (no artifact) → FAIL
#   T-23  "deployment commissioned" triggers gate (no artifact) → FAIL
#   T-24  No proof file in PR diff — no phrase → PASS (gate not triggered)
#   T-25  Prohibited phrase + LUIEP operational_status_matrix present but empty → FAIL
#   T-26  Prohibited phrase + LUIEP matrix missing /dashboard row → FAIL
#   T-27  Prohibited phrase + LUIEP matrix row missing observed_behavior → FAIL
#   T-28  Prohibited phrase + LUIEP matrix row missing pass_fail → FAIL
#   T-29  Prohibited phrase + LUIEP matrix row screenshot_ref: PENDING → FAIL
#
# Usage:
#   .github/scripts/validate-mmm-ui-evidence-pack.test.sh
#
# Exit codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="${SCRIPT_DIR}/validate-mmm-ui-evidence-pack.sh"

TEST_DIR=$(mktemp -d)
TEST_PASSED=0
TEST_FAILED=0

echo "=== LUIEP Gate Test Suite (validate-mmm-ui-evidence-pack.sh) ==="
echo "Test directory: $TEST_DIR"
echo ""

# ----------------------------------------------------------------
# Helper: run_test <name> <expected_exit> <setup_func>
# ----------------------------------------------------------------
run_test() {
  local test_name="$1"
  local expected_exit="$2"
  local setup_func="$3"

  echo "Test: $test_name"

  local test_workspace
  test_workspace=$(mktemp -d -p "$TEST_DIR")
  cd "$test_workspace"

  # Minimal git repo setup
  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"

  # Create initial commit on main (simulates base branch)
  mkdir -p .agent-admin/prehandover .agent-admin/assurance \
           .agent-workspace/foreman-v2/personal \
           modules/MMM/12-phase4-ecap
  echo "initial" > README.md
  git add .
  git commit -q -m "Initial commit"
  git branch -M main

  # Create PR branch
  git checkout -q -b copilot/test-luiep-pr

  # Run test-specific setup
  $setup_func

  BASE_SHA=$(git rev-parse main 2>/dev/null)

  set +e
  local output
  output=$(BASE_SHA="$BASE_SHA" bash "$GATE_SCRIPT" 2>&1)
  local actual_exit=$?
  set -e

  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✅ PASS (exit code: $actual_exit)"
    TEST_PASSED=$((TEST_PASSED + 1))
  else
    echo "  ❌ FAIL (expected: $expected_exit, got: $actual_exit)"
    echo "  Output:"
    echo "$output" | sed 's/^/    /'
    TEST_FAILED=$((TEST_FAILED + 1))
  fi

  cd "$TEST_DIR"
  rm -rf "$test_workspace"
  echo ""
}

# ----------------------------------------------------------------
# Helper: write a PREHANDOVER proof file with a given phrase
# ----------------------------------------------------------------
write_proof_with_phrase() {
  local phrase="$1"
  cat > .agent-admin/prehandover/proof-test-wave.md << EOF
# MMM PREHANDOVER Proof — Test

wave: test-wave-20260504
final_status: ${phrase}

This PREHANDOVER proof claims: ${phrase}
EOF
  git add .
  git commit -q -m "Add PREHANDOVER proof"
}

# ----------------------------------------------------------------
# Helper: write the minimal VALID route_inventory block for N routes
# (all 9 required routes, non-PENDING screenshot_refs)
# ----------------------------------------------------------------
write_valid_route_inventory() {
  cat << 'YAML'
route_inventory:
  - route: "/"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/home.png"
  - route: "/login"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/login.png"
  - route: "/signup"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/signup.png"
  - route: "/forgot-password"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/forgot-password.png"
  - route: "/reset-password"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/reset-password.png"
  - route: "/onboarding"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/onboarding.png"
  - route: "/dashboard"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/dashboard.png"
  - route: "/frameworks"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/frameworks.png"
  - route: "/frameworks/upload"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/frameworks-upload.png"
YAML
}

# ----------------------------------------------------------------
# Helper: write a complete valid operational_status_matrix
# ----------------------------------------------------------------
write_valid_matrix() {
  cat << 'YAML'
operational_status_matrix:
  - route: "/"
    expected_behavior: "Home page renders with navigation."
    observed_behavior: "Home page loaded. Navigation present."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-home.png"
  - route: "/login"
    expected_behavior: "Login form renders with email and password fields."
    observed_behavior: "Login form rendered. Auth flow confirmed."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-login.png"
  - route: "/signup"
    expected_behavior: "Signup form renders with registration fields."
    observed_behavior: "Signup form rendered correctly."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-signup.png"
  - route: "/forgot-password"
    expected_behavior: "Forgot password form renders."
    observed_behavior: "Forgot password page loaded successfully."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-forgot-password.png"
  - route: "/reset-password"
    expected_behavior: "Password reset form renders."
    observed_behavior: "Reset password page loaded successfully."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-reset-password.png"
  - route: "/onboarding"
    expected_behavior: "Onboarding wizard renders for new users."
    observed_behavior: "Onboarding steps displayed correctly."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-onboarding.png"
  - route: "/dashboard"
    expected_behavior: "Dashboard renders with user data and navigation."
    observed_behavior: "Dashboard loaded with all widgets."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-dashboard.png"
  - route: "/frameworks"
    expected_behavior: "Frameworks list renders with upload option."
    observed_behavior: "Frameworks page loaded. List displayed."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-frameworks.png"
  - route: "/frameworks/upload"
    expected_behavior: "Upload form renders with file picker."
    observed_behavior: "Upload form displayed. File picker functional."
    pass_fail: "PASS"
    screenshot_ref: "./screenshots/matrix-frameworks-upload.png"
YAML
}

# ----------------------------------------------------------------
# Helper: write a complete valid L2 LUIEP
# ----------------------------------------------------------------
write_valid_l2_luiep() {
  local luiep_path="${1:-modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md}"
  mkdir -p "$(dirname "$luiep_path")"
  cat > "$luiep_path" << EOF
# MMM Live UI Evidence Pack — Test

evidence_pack_version: "1.0.0"
evidence_pack_date: "2026-05-04"
wave: "test-wave-20260504"
issue: "maturion-isms#1523"
prepared_by: "CS2 (@APGI-cmy)"

deployment_url: "https://mmm.test.app"
deployment_url_confirmed: "YES"

ui_renders_correctly: "YES"
ui_rendering_notes: "All pages load. No console errors."

auth_flow_confirmed: "YES"
auth_flow_notes: "Login and signup confirmed on live platform."

e2e_workflow_confirmed: "PENDING"
e2e_workflow_description: "L2 claim — E2E pending"
e2e_workflow_date: "PENDING"

screenshots_provided: "YES"
screenshot_notes: "Screenshots taken in Chrome."

cs2_sign_off: "2026-05-04"
cs2_sign_off_notes: "Verified live on macOS Chrome."

$(write_valid_route_inventory)

network_api_evidence:
  - endpoint: "/auth/v1/token"
    status_code: "200"
    backend_url: "https://xxxx.supabase.co/auth/v1/token"
    description: "Auth token exchange during login"

$(write_valid_matrix)

completion_level_supported: "L2"
completion_level_rationale: "All L2 fields confirmed."
EOF
}

# ----------------------------------------------------------------
# Helper: write a complete valid L3 LUIEP
# ----------------------------------------------------------------
write_valid_l3_luiep() {
  local luiep_path="${1:-modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md}"
  mkdir -p "$(dirname "$luiep_path")"
  cat > "$luiep_path" << EOF
# MMM Live UI Evidence Pack — Test

evidence_pack_version: "1.0.0"
evidence_pack_date: "2026-05-04"
wave: "test-wave-20260504"
issue: "maturion-isms#1523"
prepared_by: "CS2 (@APGI-cmy)"

deployment_url: "https://mmm.test.app"
deployment_url_confirmed: "YES"

ui_renders_correctly: "YES"
ui_rendering_notes: "All pages load. No console errors."

auth_flow_confirmed: "YES"
auth_flow_notes: "Login and signup confirmed on live platform."

e2e_workflow_confirmed: "YES"
e2e_workflow_description: "User logs in, uploads media, transcription requested, result displayed in UI."
e2e_workflow_date: "2026-05-04"

screenshots_provided: "YES"
screenshot_notes: "Screenshots taken in Chrome."

cs2_sign_off: "2026-05-04"
cs2_sign_off_notes: "Verified live on macOS Chrome."

$(write_valid_route_inventory)

network_api_evidence:
  - endpoint: "/auth/v1/token"
    status_code: "200"
    backend_url: "https://xxxx.supabase.co/auth/v1/token"
    description: "Auth token exchange during login"
  - endpoint: "/rest/v1/frameworks"
    status_code: "200"
    backend_url: "https://xxxx.supabase.co/rest/v1/frameworks"
    description: "Frameworks list fetch"

$(write_valid_matrix)

completion_level_supported: "L3"
completion_level_rationale: "All L3 fields confirmed including E2E."
EOF
}

# ================================================================
# T-01: No prohibited phrase → PASS (gate not triggered)
# ================================================================
setup_t01() {
  cat > .agent-admin/prehandover/proof-test-wave.md << 'EOF'
# MMM PREHANDOVER Proof — Test

wave: test-wave-20260504
status: IN_PROGRESS

This wave is in progress. No completion claims made yet.
EOF
  git add .
  git commit -q -m "Add proof without prohibited phrase"
}
run_test "T-01: No prohibited phrase → PASS (gate not triggered)" 0 setup_t01

# ================================================================
# T-02: "handover ready" + no LUIEP artifact → FAIL
# ================================================================
setup_t02() {
  write_proof_with_phrase "handover ready"
}
run_test "T-02: 'handover ready' + no LUIEP artifact → FAIL" 1 setup_t02

# ================================================================
# T-03: "L2 complete" + no LUIEP artifact → FAIL
# ================================================================
setup_t03() {
  write_proof_with_phrase "L2 complete"
}
run_test "T-03: 'L2 complete' + no LUIEP artifact → FAIL" 1 setup_t03

# ================================================================
# T-04: "L2 complete" + LUIEP has screenshots_provided: NO → FAIL
# ================================================================
setup_t04() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Override screenshots_provided to NO (matches both quoted and unquoted YAML)
  sed -i "s/screenshots_provided: [\"']\?YES[\"']\?/screenshots_provided: NO/" \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  # Update proof to cite the artifact
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with NO screenshots"
}
run_test "T-04: LUIEP screenshots_provided: NO → FAIL" 1 setup_t04

# ================================================================
# T-05: "L2 complete" + LUIEP cs2_sign_off: "PENDING — ..." → FAIL
# ================================================================
setup_t05() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  sed -i 's/cs2_sign_off: "2026-05-04"/cs2_sign_off: "PENDING — to be filled by CS2"/' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with PENDING cs2_sign_off"
}
run_test "T-05: LUIEP cs2_sign_off: PENDING variant → FAIL" 1 setup_t05

# ================================================================
# T-06: "L2 complete" + LUIEP ui_renders_correctly: PENDING → FAIL
# ================================================================
setup_t06() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  sed -i 's/ui_renders_correctly: "YES"/ui_renders_correctly: "PENDING"/' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with PENDING ui_renders_correctly"
}
run_test "T-06: LUIEP ui_renders_correctly: PENDING → FAIL" 1 setup_t06

# ================================================================
# T-07: "L2 complete" + LUIEP auth_flow_confirmed: PENDING → FAIL
# ================================================================
setup_t07() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  sed -i 's/auth_flow_confirmed: "YES"/auth_flow_confirmed: "PENDING"/' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with PENDING auth_flow_confirmed"
}
run_test "T-07: LUIEP auth_flow_confirmed: PENDING → FAIL" 1 setup_t07

# ================================================================
# T-08: "operational-complete" + e2e_workflow_confirmed: PENDING → FAIL
#        (STRICT_E2E triggered by operational-complete phrase)
# ================================================================
setup_t08() {
  write_proof_with_phrase "operational-complete"
  write_valid_l3_luiep
  # Revert e2e to PENDING to trigger STRICT_E2E fail
  sed -i 's/e2e_workflow_confirmed: "YES"/e2e_workflow_confirmed: "PENDING"/' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP operational-complete with e2e PENDING"
}
run_test "T-08: 'operational-complete' + e2e_workflow_confirmed: PENDING → FAIL" 1 setup_t08

# ================================================================
# T-09: Prohibited phrase + LUIEP missing route_inventory section → FAIL
# ================================================================
setup_t09() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove route_inventory block from the LUIEP
  # (strip from 'route_inventory:' to the blank line after the last route entry)
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
# Remove route_inventory block (multi-line YAML block)
content = re.sub(r'route_inventory:.*?(?=\nnetwork_api_evidence:)', '', content, flags=re.DOTALL)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP missing route_inventory"
}
run_test "T-09: LUIEP missing route_inventory section → FAIL" 1 setup_t09

# ================================================================
# T-10: Prohibited phrase + LUIEP missing required route /forgot-password → FAIL
# ================================================================
setup_t10() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove /forgot-password route entry from the file
  sed -i '/route: "\/forgot-password"/,/screenshot_ref: ".*forgot-password.*"/d' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP missing /forgot-password route"
}
run_test "T-10: LUIEP missing required route /forgot-password → FAIL" 1 setup_t10

# ================================================================
# T-11: Prohibited phrase + LUIEP all screenshot_refs PENDING → FAIL
# ================================================================
setup_t11() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Set all screenshot_refs to PENDING
  sed -i 's|screenshot_ref: "\./screenshots/[^"]*"|screenshot_ref: "PENDING"|g' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with all screenshot_refs PENDING"
}
run_test "T-11: LUIEP all screenshot_refs PENDING (< 9 confirmed) → FAIL" 1 setup_t11

# ================================================================
# T-12: Prohibited phrase + LUIEP missing network_api_evidence section → FAIL
# ================================================================
setup_t12() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove network_api_evidence block
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
content = re.sub(r'network_api_evidence:.*?(?=\noperational_status_matrix:)', '', content, flags=re.DOTALL)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP missing network_api_evidence"
}
run_test "T-12: LUIEP missing network_api_evidence section → FAIL" 1 setup_t12

# ================================================================
# T-13: Prohibited phrase + LUIEP network_api_evidence all PENDING → FAIL
# ================================================================
setup_t13() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Set all endpoint/status_code values to PENDING
  sed -i 's|endpoint: "/auth/v1/token"|endpoint: "PENDING"|g' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  sed -i 's|status_code: "200"|status_code: "PENDING"|g' \
    modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with all network_api_evidence PENDING"
}
run_test "T-13: LUIEP network_api_evidence all PENDING → FAIL" 1 setup_t13

# ================================================================
# T-14: Prohibited phrase + LUIEP missing operational_status_matrix → FAIL
# ================================================================
setup_t14() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove operational_status_matrix block
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
content = re.sub(r'\noperational_status_matrix:.*?(?=\ncompletion_level_supported:)', '', content, flags=re.DOTALL)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP missing operational_status_matrix"
}
run_test "T-14: LUIEP missing operational_status_matrix section → FAIL" 1 setup_t14

# ================================================================
# T-15: Valid L2 evidence pack → PASS
# ================================================================
setup_t15() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + valid L2 LUIEP"
}
run_test "T-15: Valid L2 evidence pack → PASS" 0 setup_t15

# ================================================================
# T-16: Valid L3 evidence pack → PASS
# ================================================================
setup_t16() {
  write_proof_with_phrase "L3 complete"
  write_valid_l3_luiep
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + valid L3 LUIEP"
}
run_test "T-16: Valid L3 evidence pack → PASS" 0 setup_t16

# ================================================================
# T-17: New phrase "merge ready" triggers gate (no artifact) → FAIL
# ================================================================
setup_t17() {
  write_proof_with_phrase "merge ready"
}
run_test "T-17: 'merge ready' triggers gate (no artifact) → FAIL" 1 setup_t17

# ================================================================
# T-18: New phrase "merge-ready" triggers gate (no artifact) → FAIL
# ================================================================
setup_t18() {
  write_proof_with_phrase "merge-ready"
}
run_test "T-18: 'merge-ready' triggers gate (no artifact) → FAIL" 1 setup_t18

# ================================================================
# T-19: New phrase "build complete" triggers gate (no artifact) → FAIL
# ================================================================
setup_t19() {
  write_proof_with_phrase "build complete"
}
run_test "T-19: 'build complete' triggers gate (no artifact) → FAIL" 1 setup_t19

# ================================================================
# T-20: New phrase "build completed" triggers gate (no artifact) → FAIL
# ================================================================
setup_t20() {
  write_proof_with_phrase "build completed"
}
run_test "T-20: 'build completed' triggers gate (no artifact) → FAIL" 1 setup_t20

# ================================================================
# T-21: New phrase "user journey complete" triggers gate (no artifact) → FAIL
# ================================================================
setup_t21() {
  write_proof_with_phrase "user journey complete"
}
run_test "T-21: 'user journey complete' triggers gate (no artifact) → FAIL" 1 setup_t21

# ================================================================
# T-22: New phrase "final_state: COMPLETE" triggers gate (no artifact) → FAIL
# ================================================================
setup_t22() {
  cat > .agent-admin/prehandover/proof-test-wave.md << 'EOF'
# MMM PREHANDOVER Proof — Test

wave: test-wave-20260504
final_state: COMPLETE

This PREHANDOVER proof uses final_state: COMPLETE as its status field.
EOF
  git add .
  git commit -q -m "Add proof with final_state: COMPLETE"
}
run_test "T-22: 'final_state: COMPLETE' triggers gate (no artifact) → FAIL" 1 setup_t22

# ================================================================
# T-23: "deployment commissioned" triggers gate (no artifact) → FAIL
# ================================================================
setup_t23() {
  write_proof_with_phrase "deployment commissioned"
}
run_test "T-23: 'deployment commissioned' triggers gate (no artifact) → FAIL" 1 setup_t23

# ================================================================
# T-24: No proof file in diff → PASS (gate not triggered)
# ================================================================
setup_t24() {
  # Only add a non-proof file to the PR (governance dir created here)
  mkdir -p governance
  echo "# Updated governance doc" > governance/SOME_CHANGE.md
  git add .
  git commit -q -m "Add non-proof governance file"
}
run_test "T-24: No proof file in PR diff → PASS (gate not triggered)" 0 setup_t24

# ================================================================
# T-25: Prohibited phrase + operational_status_matrix present but empty → FAIL
# ================================================================
setup_t25() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Replace the matrix content with an empty section
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
content = re.sub(
    r'operational_status_matrix:.*?(?=\ncompletion_level_supported:)',
    'operational_status_matrix: []',
    content, flags=re.DOTALL)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP with empty operational_status_matrix"
}
run_test "T-25: LUIEP operational_status_matrix present but empty → FAIL" 1 setup_t25

# ================================================================
# T-26: Prohibited phrase + LUIEP matrix missing /dashboard row → FAIL
# ================================================================
setup_t26() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove the /dashboard row from the matrix
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
content = re.sub(
    r'  - route: \"/dashboard\".*?(?=  - route:|\ncompletion_level_supported:)',
    '', content, flags=re.DOTALL)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP matrix missing /dashboard"
}
run_test "T-26: LUIEP matrix missing /dashboard row → FAIL" 1 setup_t26

# ================================================================
# T-27: Prohibited phrase + LUIEP matrix row missing observed_behavior → FAIL
# ================================================================
setup_t27() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove all observed_behavior fields from the matrix section
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
content = re.sub(r'\n    observed_behavior:[^\n]+', '', content)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP matrix missing observed_behavior"
}
run_test "T-27: LUIEP matrix row missing observed_behavior → FAIL" 1 setup_t27

# ================================================================
# T-28: Prohibited phrase + LUIEP matrix row missing pass_fail → FAIL
# ================================================================
setup_t28() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Remove all pass_fail fields from the matrix section
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
content = re.sub(r'\n    pass_fail:[^\n]+', '', content)
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP matrix missing pass_fail"
}
run_test "T-28: LUIEP matrix row missing pass_fail → FAIL" 1 setup_t28

# ================================================================
# T-29: Prohibited phrase + LUIEP matrix screenshot_ref: PENDING → FAIL
# ================================================================
setup_t29() {
  write_proof_with_phrase "L2 complete"
  write_valid_l2_luiep
  # Replace all matrix screenshot_ref values with PENDING
  python3 -c "
import re
content = open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md').read()
# Only replace screenshot_ref lines within the operational_status_matrix section
m = re.search(r'^(operational_status_matrix:.*?)(?=^[a-zA-Z_]|\Z)', content, re.MULTILINE | re.DOTALL)
if m:
    section = m.group(0)
    new_section = re.sub(r'(screenshot_ref:)[^\n]+', r'\1 \"PENDING\"', section)
    content = content[:m.start()] + new_section + content[m.end():]
open('modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md', 'w').write(content)
"
  echo 'luiep_artifact_path: modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-test.md' \
    >> .agent-admin/prehandover/proof-test-wave.md
  git add .
  git commit -q -m "Add proof + LUIEP matrix screenshot_ref PENDING"
}
run_test "T-29: LUIEP matrix screenshot_ref PENDING → FAIL" 1 setup_t29

# ================================================================
# Summary
# ================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Results: $TEST_PASSED passed, $TEST_FAILED failed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

rm -rf "$TEST_DIR"

if [ "$TEST_FAILED" -gt 0 ]; then
  exit 1
else
  exit 0
fi
