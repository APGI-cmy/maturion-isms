#!/bin/bash
# Test suite for iaa-final-assurance-gate.sh, ecap-admin-ceremony-gate.sh,
#              pr-assurance-lifecycle.sh, and merge-ready-claim-gate.sh
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Validate IAA final assurance, ECAP/admin ceremony, lifecycle state
#          determination, and merge-ready claim CI gates against the acceptance
#          criteria in maturion-isms#1503 and maturion-isms#1514.
#
# Coverage (acceptance criteria):
#   AC-1          Missing IAA token (implementation PR, no token file)              → exit 1
#   AC-2          Stale IAA token from another PR (token references wrong PR)       → exit 1
#   AC-3          Empty PHASE_B_BLOCKING_TOKEN                                      → exit 1
#   AC-4          IAA token referencing the wrong governing issue                   → exit 1
#   AC-5          REJECTION-PACKAGE token                                           → exit 1
#   AC-6          Protected-path PR without ECAP evidence                           → exit 1
#   AC-6b         Agent contract change without ECAP evidence                       → exit 1
#   AC-6c         CI workflow change — ECAP not required                            → exit 0
#   AC-7          Protected-path PR with CS2 waiver (ecap_waiver_ref populated)     → exit 0
#   AC-8          Non-implementation documentation-only PR                          → exit 0
#   AC-8-CI       CI script/workflow only PR — IAA not required                     → exit 0
#   AC-8b         Non-protected documentation-only PR — ECAP not required           → exit 0
#   AC-9          Valid IAA token with correct PR, issue, SHA                       → exit 0
#   AC-10         Protected-path PR with valid ECAP bundle + PREHANDOVER            → exit 0
#   AC-10b        Protected-path PR with ECAP bundle + valid IAA token              → exit 0
#   AC-11         PENDING PHASE_B_BLOCKING_TOKEN                                    → exit 1
#   AC-D-NOPR     Token missing **PR**: field                                       → exit 1
#   AC-D-NOISSUE  Token missing **Issue**: field                                    → exit 1
#   AC-D-NOSHA    Token missing **Reviewed SHA**: field                             → exit 1
#   AC-D-WRONGSHA Token reviewed SHA not in PR head ancestry                        → exit 1
#   AC-WR-NOPR    Wave record ## TOKEN missing PR/issue fields                      → exit 1
#   AC-ECAP-NOBUNDLE PREHANDOVER ecap_invoked=true but no ECAP bundle committed     → exit 1
#   AC-ECAP-NVAL  ecap_required=N/A rejected on protected-path PR                  → exit 1
#   AC-MR-1       PR body contains merge-ready claim while IAA blocked              → exit 1
#   AC-MR-2       PREHANDOVER contains merge-ready claim while IAA blocked          → exit 1
#   AC-MR-3       No merge-ready claim, lifecycle clear (valid IAA token)           → exit 0
#   AC-MR-4       merge-ready claim in PR body when lifecycle is NOT blocked        → exit 0
#   AC-LC-1       Lifecycle script produces assurance-ready for valid token PR      → exit 0
#   AC-LC-2       Lifecycle script reports blocked for implementation PR no token   → exit 0
#   AC-LC-3       Lifecycle artifact JSON is written to .agent-admin/lifecycle/     → exit 0
#   AC-LC-4       Impl PR with missing EXPECTED_ISSUE_NUMBER → lifecycle exits 1    → exit 1
#   AC-LC-5       Assurance-control .github/scripts change → IAA required           lifecycle BLOCKED
#   AC-LC-6       Wave record with stale/non-existent reviewed SHA → lifecycle BLOCKED
#   AC-LC-7       ECAP bundle committed but no PASS verdict → lifecycle BLOCKED
#
# Usage:
#   .github/scripts/iaa-final-assurance-gate.test.sh
#
# Exit codes:
#   0 = All tests passed
#   1 = One or more tests failed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IAA_GATE_SCRIPT="${SCRIPT_DIR}/iaa-final-assurance-gate.sh"
ECAP_GATE_SCRIPT="${SCRIPT_DIR}/ecap-admin-ceremony-gate.sh"
LIFECYCLE_SCRIPT="${SCRIPT_DIR}/pr-assurance-lifecycle.sh"
MERGE_READY_GATE_SCRIPT="${SCRIPT_DIR}/merge-ready-claim-gate.sh"

TEST_DIR=$(mktemp -d)
TEST_PASSED=0
TEST_FAILED=0

echo "=== IAA Final Assurance Gate + ECAP Gate Test Suite ==="
echo "Test directory: $TEST_DIR"
echo ""

# ----------------------------------------------------------------
# Helper: run_test <name> <expected_exit> <script> <setup_func>
# ----------------------------------------------------------------
run_test() {
  local test_name="$1"
  local expected_exit="$2"
  local gate_script="$3"
  local setup_func="$4"

  echo "Test: $test_name"

  local test_workspace
  test_workspace=$(mktemp -d -p "$TEST_DIR")
  cd "$test_workspace"

  # Minimal git repo setup
  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"

  # Create initial commit on main (simulates base branch)
  mkdir -p .agent-admin/assurance .agent-admin/prehandover \
           .agent-workspace/foreman-v2/memory \
           .github/agents .github/workflows governance/canon
  echo "initial" > README.md
  git add .
  git commit -q -m "Initial commit"
  git branch -M main

  # Create feature branch
  git checkout -q -b test-branch

  # Run test-specific setup (populates files / changes)
  $setup_func

  # Export required env vars for the gate
  BASE_SHA=$(git rev-parse main 2>/dev/null)
  HEAD_SHA=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")

  set +e
  local output
  output=$(BASE_SHA="$BASE_SHA" \
           HEAD_SHA="$HEAD_SHA" \
           PR_NUMBER="9999" \
           PR_LABELS="" \
           PR_BODY="Closes maturion-isms#1503" \
           EXPECTED_ISSUE_NUMBER="1503" \
           bash "$gate_script" 2>&1)
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
# Helper: commit a change to make the git diff non-empty
# ----------------------------------------------------------------
add_impl_file() {
  mkdir -p modules/mat/src
  echo "export const x = 1;" > modules/mat/src/test.ts
  git add .
  git commit -q -m "Add implementation file"
}

add_governance_file() {
  echo "# Changed canon doc" > governance/canon/SOME_DOC.md
  git add .
  git commit -q -m "Change governance canon"
}

add_ci_workflow_file() {
  cat > .github/workflows/new-gate.yml << 'EOF'
name: New Gate
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: echo "ok"
EOF
  git add .
  git commit -q -m "Add CI workflow"
}

add_valid_iaa_token() {
  local pr_num="${1:-9999}"
  local issue_num="${2:-1503}"
  local blocking_token="${3:-IAA-session-test-wave-test-20260428-PASS}"
  # Capture current HEAD as the "reviewed" SHA (parent of the token commit)
  local REVIEWED_SHA
  REVIEWED_SHA=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
  cat > .agent-admin/assurance/iaa-token-session-test-wave-test-20260428.md << EOF
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: ${blocking_token}

**Token**: ${blocking_token}
**Type**: PHASE_B_BLOCKING_TOKEN
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #${pr_num}
**Issue**: maturion-isms#${issue_num}
**Reviewed SHA**: ${REVIEWED_SHA}
EOF
  git add .
  git commit -q -m "Add IAA token"
}

add_ecap_bundle() {
  local pr_num="${1:-9999}"
  mkdir -p .agent-workspace/execution-ceremony-admin-agent/bundles
  cat > ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test-wave-20260428.md" << EOF
# ECAP Bundle — test-wave-20260428

ecap_session: ecap-session-test-wave-20260428
ecap_verdict: PASS
admin_ceremony_compliance: PASS
pr_ref: #${pr_num}
EOF
  git add .
  git commit -q -m "Add ECAP bundle"
}

add_prehandover_proof_with_ecap() {
  local ecap_invoked="${1:-true}"
  local ecap_verdict="${2:-PASS}"
  local waiver_ref="${3:-}"
  cat > .agent-admin/prehandover/proof-test-wave-20260428.md << EOF
# PREHANDOVER PROOF — test-wave-20260428

protected_path_touched: true
ecap_required: true
ecap_invoked: ${ecap_invoked}
ceremony_admin_appointed: ${ecap_invoked}
ecap_verdict: ${ecap_verdict}
${waiver_ref:+ecap_waiver_ref: ${waiver_ref}}

## Ripple/Cross-Agent Assessment
| Agent | Impact | Conclusion |
|---|---|---|
| foreman-v2-agent | governance files | NO IMPACT — governance ceremony only |
EOF
  git add .
  git commit -q -m "Add prehandover proof"
}

# ================================================================
# TEST SUITE — IAA Final Assurance Gate
# ================================================================

# AC-1: Missing IAA token — implementation files changed, no token
setup_ac1() {
  add_impl_file
}
run_test "AC-1: Missing IAA token (implementation PR, no token)" 1 "$IAA_GATE_SCRIPT" "setup_ac1"

# AC-2: Stale IAA token referencing a DIFFERENT PR number
setup_ac2() {
  add_impl_file
  # Token references PR #1234 but current PR is #9999
  cat > .agent-admin/assurance/iaa-token-session-stale-wave-20260101.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-session-stale-wave-20260101-PASS

**Token**: IAA-session-stale-wave-20260101-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #1234
**Branch**: copilot/old-wave
**Issue**: maturion-isms#1503
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add stale token from another PR"
}
run_test "AC-2: Stale IAA token referencing wrong PR" 1 "$IAA_GATE_SCRIPT" "setup_ac2"

# AC-3: Empty PHASE_B_BLOCKING_TOKEN
setup_ac3() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-empty-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN:

**Token**: (empty)
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add token with empty PHASE_B_BLOCKING_TOKEN"
}
run_test "AC-3: Empty PHASE_B_BLOCKING_TOKEN" 1 "$IAA_GATE_SCRIPT" "setup_ac3"

# AC-4: IAA token referencing a DIFFERENT governing issue
setup_ac4() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-wrongissue-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-session-wrongissue-wave-20260428-PASS

**Token**: IAA-session-wrongissue-wave-20260428-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#42
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add token referencing wrong issue"
}
run_test "AC-4: IAA token referencing wrong issue (#42 vs #1503)" 1 "$IAA_GATE_SCRIPT" "setup_ac4"

# AC-5: REJECTION-PACKAGE token
setup_ac5() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-reject-wave-20260428.md << 'EOF'
# IAA Token File — REJECTION-PACKAGE

PHASE_B_BLOCKING_TOKEN: IAA-session-reject-wave-20260428-REJECTION

**Token**: IAA-session-reject-wave-20260428-REJECTION
**Verdict**: REJECTION-PACKAGE
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add REJECTION-PACKAGE token"
}
run_test "AC-5: REJECTION-PACKAGE token" 1 "$IAA_GATE_SCRIPT" "setup_ac5"

# AC-8: Documentation-only PR — IAA not required
setup_ac8() {
  mkdir -p docs
  echo "# Updated documentation" > docs/guide.md
  git add .
  git commit -q -m "Update documentation"
}
run_test "AC-8: Documentation-only PR — IAA not required" 0 "$IAA_GATE_SCRIPT" "setup_ac8"

# AC-8-CI: CI script/workflow only PR — IAA not required (governance tooling)
setup_ac8_ci() {
  add_ci_workflow_file
  mkdir -p .github/scripts
  echo "#!/bin/bash" > .github/scripts/new-gate.sh
  git add .
  git commit -q -m "Add CI gate scripts"
}
run_test "AC-8-CI: CI script/workflow only PR — IAA not required" 0 "$IAA_GATE_SCRIPT" "setup_ac8_ci"

# AC-9: Valid IAA token with correct PR and issue reference
setup_ac9() {
  add_impl_file
  add_valid_iaa_token "9999" "1503"
}
run_test "AC-9: Valid IAA token with correct PR and issue" 0 "$IAA_GATE_SCRIPT" "setup_ac9"

# AC-11: PENDING PHASE_B_BLOCKING_TOKEN
setup_ac11() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-pending-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: PENDING

**Token**: PENDING
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add token with PENDING PHASE_B_BLOCKING_TOKEN"
}
run_test "AC-11: PENDING PHASE_B_BLOCKING_TOKEN" 1 "$IAA_GATE_SCRIPT" "setup_ac11"

# AC-D-NOPR: Token missing **PR**: field — positive PR linkage required
setup_ac_nopr() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-nopr-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-session-nopr-wave-20260428-PASS

**Token**: IAA-session-nopr-wave-20260428-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**Issue**: maturion-isms#1503
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add token without PR field"
}
run_test "AC-D-NOPR: Token missing **PR**: field" 1 "$IAA_GATE_SCRIPT" "setup_ac_nopr"

# AC-D-NOISSUE: Token missing **Issue**: field — governing issue linkage required
setup_ac_noissue() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-noissue-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-session-noissue-wave-20260428-PASS

**Token**: IAA-session-noissue-wave-20260428-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add token without issue field"
}
run_test "AC-D-NOISSUE: Token missing **Issue**: field" 1 "$IAA_GATE_SCRIPT" "setup_ac_noissue"

# AC-D-NOSHA: Token missing **Reviewed SHA**: field
setup_ac_nosha() {
  add_impl_file
  cat > .agent-admin/assurance/iaa-token-session-nosha-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-session-nosha-wave-20260428-PASS

**Token**: IAA-session-nosha-wave-20260428-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
EOF
  git add .
  git commit -q -m "Add token without reviewed SHA"
}
run_test "AC-D-NOSHA: Token missing **Reviewed SHA**: field" 1 "$IAA_GATE_SCRIPT" "setup_ac_nosha"

# AC-D-WRONGSHA: Token reviewed SHA not in ancestry of HEAD
setup_ac_wrongsha() {
  add_impl_file
  # Use a fabricated SHA that is not a real commit in this repo
  cat > .agent-admin/assurance/iaa-token-session-wrongsha-wave-20260428.md << 'EOF'
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-session-wrongsha-wave-20260428-PASS

**Token**: IAA-session-wrongsha-wave-20260428-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: deadbeef00000000000000000000000000000001
EOF
  git add .
  git commit -q -m "Add token with wrong reviewed SHA"
}
run_test "AC-D-WRONGSHA: Token reviewed SHA not in PR ancestry" 1 "$IAA_GATE_SCRIPT" "setup_ac_wrongsha"

# AC-WR-NOPR: Wave record ## TOKEN section missing PR/issue/SHA fields
setup_ac_wr_nopr() {
  add_impl_file
  # Wave record with ## TOKEN but missing required linkage fields
  mkdir -p .agent-admin/assurance
  cat > .agent-admin/assurance/iaa-wave-record-nopr-20260428.md << 'EOF'
# IAA Wave Record

## STATUS
Wave in progress.

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-wave-nopr-20260428-PASS

**Verdict**: ASSURANCE-TOKEN (PASS)
**Reviewed SHA**: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "Add wave record with missing PR and issue fields"
}
run_test "AC-WR-NOPR: Wave record ## TOKEN missing PR/issue fields" 1 "$IAA_GATE_SCRIPT" "setup_ac_wr_nopr"

# ================================================================
# TEST SUITE — ECAP / Admin Ceremony Gate
# ================================================================

# AC-6: Protected-path PR without ECAP evidence
setup_ac6() {
  add_governance_file
  # No PREHANDOVER proof with ECAP fields
}
run_test "AC-6: Protected-path PR without ECAP evidence" 1 "$ECAP_GATE_SCRIPT" "setup_ac6"

# AC-6b: Protected-path PR (agent contract) without ECAP evidence
setup_ac6b() {
  echo "# Modified agent contract" > .github/agents/test-agent.md
  git add .
  git commit -q -m "Change agent contract"
  # No PREHANDOVER proof with ECAP fields
}
run_test "AC-6b: Agent contract change without ECAP evidence" 1 "$ECAP_GATE_SCRIPT" "setup_ac6b"

# AC-6c: CI workflow change — NOT a protected path, ECAP not required
setup_ac6c() {
  add_ci_workflow_file
  # No PREHANDOVER proof — and none needed since CI workflows are not protected paths
}
run_test "AC-6c: CI workflow change — ECAP not required (CI tooling)" 0 "$ECAP_GATE_SCRIPT" "setup_ac6c"

# AC-7: Protected-path PR with CS2 waiver (ecap_waiver_ref populated)
setup_ac7() {
  add_governance_file
  cat > .agent-admin/prehandover/proof-test-waiver-20260428.md << 'EOF'
# PREHANDOVER PROOF — test-waiver-20260428

protected_path_touched: true
ecap_required: false
ecap_waiver_ref: CS2-waiver-comment-PR9999-@APGI-cmy-2026-04-28

## Ripple/Cross-Agent Assessment
| Agent | Impact | Conclusion |
|---|---|---|
| foreman-v2-agent | governance canon | NO IMPACT — ceremony-only wave |
EOF
  git add .
  git commit -q -m "Add prehandover proof with CS2 waiver"
}
run_test "AC-7: Protected-path PR with CS2 waiver" 0 "$ECAP_GATE_SCRIPT" "setup_ac7"

# AC-8b: Non-protected documentation-only PR — ECAP not required
setup_ac8b() {
  mkdir -p docs
  echo "# Updated docs" > docs/guide.md
  git add .
  git commit -q -m "Update documentation"
}
run_test "AC-8b: Documentation-only PR — ECAP not required" 0 "$ECAP_GATE_SCRIPT" "setup_ac8b"

# AC-ECAP-NOBUNDLE: Protected-path PR with PREHANDOVER ecap_invoked=true
#                   but no ECAP bundle artifact committed → FAIL (self-certification rejected)
setup_ac_ecap_nobundle() {
  add_governance_file
  add_prehandover_proof_with_ecap "true" "PASS"
  # No ECAP bundle committed to .agent-workspace/execution-ceremony-admin-agent/bundles/
}
run_test "AC-ECAP-NOBUNDLE: PREHANDOVER ecap_invoked=true but no ECAP bundle" 1 "$ECAP_GATE_SCRIPT" "setup_ac_ecap_nobundle"

# AC-10: Protected-path PR with valid ECAP evidence (PREHANDOVER + ECAP bundle)
setup_ac10() {
  add_governance_file
  add_prehandover_proof_with_ecap "true" "PASS"
  add_ecap_bundle "9999"
}
run_test "AC-10: Protected-path PR with valid ECAP evidence + bundle" 0 "$ECAP_GATE_SCRIPT" "setup_ac10"

# AC-10b: Protected-path PR with ECAP evidence — IAA PASS also present
setup_ac10b() {
  add_governance_file
  add_prehandover_proof_with_ecap "true" "PASS"
  add_ecap_bundle "9999"
  add_valid_iaa_token "9999" "1503"
}
run_test "AC-10b: Protected-path PR with ECAP bundle + valid IAA token" 0 "$ECAP_GATE_SCRIPT" "setup_ac10b"

# AC-ECAP-NVAL: ecap_required: N/A is rejected (anti-self-certification)
setup_ac_nval() {
  add_governance_file
  cat > .agent-admin/prehandover/proof-test-nval-20260428.md << 'EOF'
# PREHANDOVER PROOF — test-nval-20260428

protected_path_touched: true
ecap_required: N/A
ecap_invoked: N/A
ecap_verdict: N/A

## Ripple/Cross-Agent Assessment
| Agent | Impact | Conclusion |
|---|---|---|
| foreman-v2-agent | governance | NO IMPACT |
EOF
  git add .
  git commit -q -m "Add prehandover proof with N/A ECAP fields"
}
run_test "AC-ECAP-NVAL: ecap_required=N/A rejected on protected-path PR" 1 "$ECAP_GATE_SCRIPT" "setup_ac_nval"


# ================================================================
# Helper: run_test_with_pr_body <name> <expected_exit> <script> <setup_func> <pr_body>
# Like run_test but allows a custom PR_BODY value.
# ================================================================
run_test_with_pr_body() {
  local test_name="$1"
  local expected_exit="$2"
  local gate_script="$3"
  local setup_func="$4"
  local pr_body="$5"

  echo "Test: $test_name"

  local test_workspace
  test_workspace=$(mktemp -d -p "$TEST_DIR")
  cd "$test_workspace"

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"

  mkdir -p .agent-admin/assurance .agent-admin/prehandover \
           .agent-workspace/foreman-v2/memory \
           .github/agents .github/workflows governance/canon
  echo "initial" > README.md
  git add .
  git commit -q -m "Initial commit"
  git branch -M main

  git checkout -q -b test-branch

  $setup_func

  BASE_SHA=$(git rev-parse main 2>/dev/null)
  HEAD_SHA=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")

  set +e
  local output
  output=$(BASE_SHA="$BASE_SHA" \
           HEAD_SHA="$HEAD_SHA" \
           PR_NUMBER="9999" \
           PR_LABELS="" \
           PR_BODY="$pr_body" \
           EXPECTED_ISSUE_NUMBER="1503" \
           bash "$gate_script" 2>&1)
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

# ================================================================
# Helper: run_lifecycle_test <name> <expected_exit> <setup_func> <expected_status> [<pr_body>]
# Runs the pr-assurance-lifecycle.sh script and checks both exit code
# and that expected_status string appears in the output.
# ================================================================
run_lifecycle_test() {
  local test_name="$1"
  local expected_exit="$2"
  local setup_func="$3"
  local expected_status="$4"
  local pr_body="${5:-Closes maturion-isms#1503}"

  echo "Test: $test_name"

  local test_workspace
  test_workspace=$(mktemp -d -p "$TEST_DIR")
  cd "$test_workspace"

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"

  mkdir -p .agent-admin/assurance .agent-admin/prehandover \
           .agent-admin/lifecycle \
           .agent-workspace/foreman-v2/memory \
           .github/agents .github/workflows governance/canon
  echo "initial" > README.md
  git add .
  git commit -q -m "Initial commit"
  git branch -M main

  git checkout -q -b test-branch

  $setup_func

  BASE_SHA=$(git rev-parse main 2>/dev/null)
  HEAD_SHA=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")

  set +e
  local output
  output=$(BASE_SHA="$BASE_SHA" \
           HEAD_SHA="$HEAD_SHA" \
           PR_NUMBER="9999" \
           PR_LABELS="" \
           PR_BODY="$pr_body" \
           EXPECTED_ISSUE_NUMBER="1503" \
           bash "$LIFECYCLE_SCRIPT" 2>&1)
  local actual_exit=$?
  set -e

  local status_ok=true
  if [ -n "$expected_status" ]; then
    if ! echo "$output" | grep -qi "$expected_status"; then
      status_ok=false
    fi
  fi

  if [ "$actual_exit" -eq "$expected_exit" ] && [ "$status_ok" = true ]; then
    echo "  ✅ PASS (exit: $actual_exit, status: ${expected_status:-any})"
    TEST_PASSED=$((TEST_PASSED + 1))
  else
    echo "  ❌ FAIL (expected exit: $expected_exit, got: $actual_exit; status expected: '${expected_status:-any}')"
    [ "$status_ok" = false ] && echo "  Status '${expected_status}' not found in output"
    echo "  Output:"
    echo "$output" | sed 's/^/    /'
    TEST_FAILED=$((TEST_FAILED + 1))
  fi

  cd "$TEST_DIR"
  rm -rf "$test_workspace"
  echo ""
}

# ================================================================
# TEST SUITE — Merge-Ready Claim Gate (maturion-isms#1514)
# ================================================================

# AC-MR-1: PR body contains merge-ready claim while IAA is blocked (no token)
setup_ac_mr1() {
  add_impl_file
  # No IAA token committed — lifecycle is blocked
}
run_test_with_pr_body \
  "AC-MR-1: PR body merge-ready claim while IAA blocked" \
  1 \
  "$MERGE_READY_GATE_SCRIPT" \
  "setup_ac_mr1" \
  "Closes maturion-isms#1503

Merge gate released. Wave N complete. Awaiting CS2 review. Merge authority: CS2 ONLY."

# AC-MR-2: PREHANDOVER proof contains merge-ready claim while IAA is blocked
setup_ac_mr2() {
  add_impl_file
  # PREHANDOVER with merge-ready language, but no IAA token
  cat > .agent-admin/prehandover/proof-test-mr2-20260428.md << 'EOPF'
# PREHANDOVER PROOF — test-mr2-20260428

## Summary
Merge gate released. All gates GREEN.

## Ripple/Cross-Agent Assessment
| Agent | Impact | Conclusion |
|---|---|---|
| foreman-v2-agent | implementation | NO DOWNSTREAM IMPACT |
EOPF
  git add .
  git commit -q -m "Add prehandover with merge-ready claim"
}
run_test_with_pr_body \
  "AC-MR-2: PREHANDOVER merge-ready claim while IAA blocked" \
  1 \
  "$MERGE_READY_GATE_SCRIPT" \
  "setup_ac_mr2" \
  "Closes maturion-isms#1503"

# AC-MR-3: No merge-ready claim, valid IAA token present — lifecycle NOT blocked
setup_ac_mr3() {
  add_impl_file
  add_valid_iaa_token "9999" "1503"
}
run_test_with_pr_body \
  "AC-MR-3: No merge-ready claim, valid IAA token — lifecycle clear" \
  0 \
  "$MERGE_READY_GATE_SCRIPT" \
  "setup_ac_mr3" \
  "Closes maturion-isms#1503

This PR implements the new feature. CI is green."

# AC-MR-4: merge-ready language in PR body but lifecycle NOT blocked (valid token)
setup_ac_mr4() {
  add_impl_file
  add_valid_iaa_token "9999" "1503"
}
run_test_with_pr_body \
  "AC-MR-4: merge-ready claim present but lifecycle is NOT blocked — allowed" \
  0 \
  "$MERGE_READY_GATE_SCRIPT" \
  "setup_ac_mr4" \
  "Closes maturion-isms#1503

Merge gate released. Wave N complete. Awaiting CS2 review."

# ================================================================
# TEST SUITE — PR Assurance Lifecycle Script (maturion-isms#1514)
# ================================================================

# AC-LC-1: Implementation PR with valid IAA token → lifecycle reports assurance-ready
setup_ac_lc1() {
  add_impl_file
  add_valid_iaa_token "9999" "1503"
}
run_lifecycle_test \
  "AC-LC-1: Implementation PR with valid token — lifecycle assurance-ready" \
  0 "setup_ac_lc1" "assurance-ready"

# AC-LC-2: Implementation PR with no token → lifecycle reports blocked
setup_ac_lc2() {
  add_impl_file
}
run_lifecycle_test \
  "AC-LC-2: Implementation PR with no token — lifecycle BLOCKED (IAA)" \
  0 "setup_ac_lc2" "BLOCKED"

# AC-LC-3: Lifecycle script writes JSON artifact to .agent-admin/lifecycle/
echo "Test: AC-LC-3: Lifecycle script writes JSON artifact to .agent-admin/lifecycle/"
lc3_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc3_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/prehandover \
         .agent-admin/lifecycle \
         .agent-workspace/foreman-v2/memory \
         .github/agents .github/workflows governance/canon
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
add_impl_file
add_valid_iaa_token "9999" "1503"
lc3_base=$(git rev-parse main 2>/dev/null)
lc3_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
BASE_SHA="$lc3_base" HEAD_SHA="$lc3_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="Closes maturion-isms#1503" EXPECTED_ISSUE_NUMBER="1503" \
  bash "$LIFECYCLE_SCRIPT" > /dev/null 2>&1
lc3_exit=$?
set -e
lc3_json=".agent-admin/lifecycle/pr-9999-assurance-state.json"
if [ "$lc3_exit" -eq 0 ] && [ -f "$lc3_json" ]; then
  if grep -q '"pr"' "$lc3_json" && \
     grep -q '"iaa_required"' "$lc3_json" && \
     grep -q '"handover_allowed"' "$lc3_json" && \
     grep -q '"merge_ready_allowed"' "$lc3_json"; then
    echo "  ✅ PASS (lifecycle JSON written with required fields)"
    TEST_PASSED=$((TEST_PASSED + 1))
  else
    echo "  ❌ FAIL — lifecycle JSON missing required fields"
    cat "$lc3_json"
    TEST_FAILED=$((TEST_FAILED + 1))
  fi
else
  echo "  ❌ FAIL (exit: $lc3_exit, file present: $([ -f "$lc3_json" ] && echo yes || echo no))"
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc3_workspace"
echo ""

# AC-LC-4: Implementation PR with no EXPECTED_ISSUE_NUMBER → lifecycle fails hard
echo "Test: AC-LC-4: Implementation PR with missing EXPECTED_ISSUE_NUMBER — lifecycle must fail"
lc4_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc4_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/prehandover \
         .agent-admin/lifecycle \
         .agent-workspace/foreman-v2/memory \
         .github/agents .github/workflows governance/canon
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
add_impl_file
lc4_base=$(git rev-parse main 2>/dev/null)
lc4_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
BASE_SHA="$lc4_base" HEAD_SHA="$lc4_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="No issue reference here" EXPECTED_ISSUE_NUMBER="" \
  bash "$LIFECYCLE_SCRIPT" > /dev/null 2>&1
lc4_exit=$?
set -e
if [ "$lc4_exit" -eq 1 ]; then
  echo "  ✅ PASS (exit: 1 — hard fail when issue number missing and IAA required)"
  TEST_PASSED=$((TEST_PASSED + 1))
else
  echo "  ❌ FAIL (exit: $lc4_exit — expected 1)"
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc4_workspace"
echo ""

# AC-LC-5: Assurance-control script change (.github/scripts/*iaa*.sh) → IAA required
echo "Test: AC-LC-5: Assurance-control script change — lifecycle must require IAA"
lc5_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc5_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/prehandover \
         .agent-admin/lifecycle \
         .agent-workspace/foreman-v2/memory \
         .github/agents .github/workflows .github/scripts governance/canon
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
# Add an assurance-control script (matches *iaa*.sh pattern)
cat > .github/scripts/iaa-final-assurance-gate.sh << 'SH'
#!/bin/bash
echo "changed gate"
SH
git add .
git commit -q -m "Modify assurance-control script"
lc5_base=$(git rev-parse main 2>/dev/null)
lc5_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
lc5_output=$(BASE_SHA="$lc5_base" HEAD_SHA="$lc5_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="Closes maturion-isms#1514" EXPECTED_ISSUE_NUMBER="1514" \
  bash "$LIFECYCLE_SCRIPT" 2>&1)
lc5_exit=$?
set -e
# Should exit 0 (lifecycle script itself does not block, just reports)
# but IAA_REQUIRED must be true and lifecycle must be BLOCKED (no token)
if echo "$lc5_output" | grep -q "assurance-control" && \
   echo "$lc5_output" | grep -q "BLOCKED"; then
  echo "  ✅ PASS (assurance-control change detected; lifecycle BLOCKED)"
  TEST_PASSED=$((TEST_PASSED + 1))
else
  echo "  ❌ FAIL — expected assurance-control detection and BLOCKED status"
  echo "  Output excerpt:"
  echo "$lc5_output" | grep -E "assurance-control|IAA required|BLOCKED|LIFECYCLE" | head -5
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc5_workspace"
echo ""

# AC-LC-6: Wave-record with stale reviewed SHA → lifecycle must remain BLOCKED
echo "Test: AC-LC-6: Wave record with stale reviewed SHA — lifecycle must remain BLOCKED"
lc6_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc6_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/prehandover \
         .agent-admin/lifecycle \
         .agent-workspace/foreman-v2/memory \
         .github/agents .github/workflows governance/canon
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
# Add implementation file (so IAA is required)
mkdir -p modules/mat/src
echo "export const x = 1;" > modules/mat/src/impl.ts
git add .
git commit -q -m "Add impl"
# Record the SHA before adding more commits (stale SHA)
STALE_SHA=$(git rev-parse HEAD 2>/dev/null)
# Add another commit to move HEAD forward (so stale SHA is no longer HEAD)
echo "more work" > modules/mat/src/impl2.ts
git add .
git commit -q -m "More impl"
# Now add a wave-record with the STALE SHA (not an ancestor that equals HEAD but still valid ancestor)
# For this test we need a SHA that is an ancestor but the reviewer used it BEFORE final changes
# Actually, we need to test the other direction: a SHA from BEFORE base (not reachable from test-branch)
# Create a sha that doesn't exist in this repo at all — simplest approach
FAKE_SHA="deadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
cat > .agent-admin/assurance/iaa-wave-record-test-wave.md << EOF
# IAA Wave Record — test-wave

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-test-PASS

**Token**: IAA-test-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: ${FAKE_SHA}
EOF
git add .
git commit -q -m "Add wave record with stale SHA"
lc6_base=$(git rev-parse main 2>/dev/null)
lc6_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
lc6_output=$(BASE_SHA="$lc6_base" HEAD_SHA="$lc6_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="Closes maturion-isms#1503" EXPECTED_ISSUE_NUMBER="1503" \
  bash "$LIFECYCLE_SCRIPT" 2>&1)
lc6_exit=$?
set -e
if echo "$lc6_output" | grep -q "BLOCKED"; then
  echo "  ✅ PASS (wave record with stale SHA → lifecycle BLOCKED)"
  TEST_PASSED=$((TEST_PASSED + 1))
else
  echo "  ❌ FAIL — expected lifecycle BLOCKED for wave record with non-existent reviewed SHA"
  echo "  Output excerpt:"
  echo "$lc6_output" | grep -E "BLOCKED|LIFECYCLE|assurance-ready|wave.record" | head -8
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc6_workspace"
echo ""

# AC-LC-7: ECAP bundle with no PASS verdict → lifecycle must remain BLOCKED
echo "Test: AC-LC-7: ECAP bundle with no PASS verdict — lifecycle must remain BLOCKED"
lc7_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc7_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/prehandover \
         .agent-admin/lifecycle \
         .agent-workspace/foreman-v2/memory \
         .agent-workspace/execution-ceremony-admin-agent/bundles \
         .github/agents governance/canon governance/checklists
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
# Add a governance canon change (triggers ECAP required)
echo "# Changed canon" > governance/canon/SOME_DOC.md
git add .
git commit -q -m "Change governance canon"
# Add an ECAP bundle with NO PASS verdict (verdict says PENDING)
cat > .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test-wave-no-pass.md << 'EOF'
# ECAP Bundle — test-wave-no-pass

ecap_session: ecap-session-test
admin_ceremony_compliance: PENDING
ecap_verdict: PENDING
pr: TBD
EOF
git add .
git commit -q -m "Add ECAP bundle without PASS verdict"
lc7_base=$(git rev-parse main 2>/dev/null)
lc7_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
lc7_output=$(BASE_SHA="$lc7_base" HEAD_SHA="$lc7_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="Closes maturion-isms#1503" EXPECTED_ISSUE_NUMBER="1503" \
  bash "$LIFECYCLE_SCRIPT" 2>&1)
lc7_exit=$?
set -e
if echo "$lc7_output" | grep -q "BLOCKED" || \
   echo "$lc7_output" | grep -qi "no PASS verdict\|No valid current ECAP"; then
  echo "  ✅ PASS (ECAP bundle without PASS verdict → lifecycle BLOCKED)"
  TEST_PASSED=$((TEST_PASSED + 1))
else
  echo "  ❌ FAIL — expected lifecycle BLOCKED for ECAP bundle with no PASS verdict"
  echo "  Output excerpt:"
  echo "$lc7_output" | grep -E "BLOCKED|LIFECYCLE|ecap|ECAP|PASS|verdict" | head -8
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc7_workspace"
echo ""

# AC-LC-8: Post-IAA implementation commit with no delta-assurance block → lifecycle BLOCKED
echo "Test: AC-LC-8: Post-IAA implementation commit without delta-assurance — lifecycle must remain BLOCKED"
lc8_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc8_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/lifecycle modules/mat/src
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
# Add implementation file
mkdir -p modules/mat/src
echo "export const x = 1;" > modules/mat/src/feature.ts
git add .
git commit -q -m "Add impl file"
# Add valid IAA token (REVIEWED_SHA = impl commit, before post-IAA change)
IMPL_SHA=$(git rev-parse HEAD)
cat > .agent-admin/assurance/iaa-token-test-lc8.md << EOF
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-test-lc8-PASS

**Token**: IAA-test-lc8-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: ${IMPL_SHA}
EOF
git add .
git commit -q -m "Add IAA token"
# BAD: add a new implementation file AFTER the IAA token (post-review impl change)
echo "export const y = 2;" > modules/mat/src/post-iaa.ts
git add .
git commit -q -m "Post-IAA implementation change (bad)"
lc8_base=$(git rev-parse main 2>/dev/null)
lc8_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
lc8_output=$(BASE_SHA="$lc8_base" HEAD_SHA="$lc8_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="Closes maturion-isms#1503" EXPECTED_ISSUE_NUMBER="1503" \
  bash "$LIFECYCLE_SCRIPT" 2>&1)
lc8_exit=$?
set -e
if echo "$lc8_output" | grep -q "BLOCKED" || \
   echo "$lc8_output" | grep -qi "implementation files changed after reviewed SHA\|no delta-assurance"; then
  echo "  ✅ PASS (post-IAA impl commit without delta-assurance → lifecycle BLOCKED)"
  TEST_PASSED=$((TEST_PASSED + 1))
else
  echo "  ❌ FAIL — expected lifecycle BLOCKED for post-IAA impl commit with no delta-assurance"
  echo "  Output excerpt:"
  echo "$lc8_output" | grep -E "BLOCKED|LIFECYCLE|IAA|impl|delta|SHA" | head -10
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc8_workspace"
echo ""

# AC-LC-9: Post-IAA implementation commit WITH valid delta-assurance block → lifecycle assurance-ready
echo "Test: AC-LC-9: Post-IAA implementation commit with valid delta-assurance block — lifecycle assurance-ready"
lc9_workspace=$(mktemp -d -p "$TEST_DIR")
cd "$lc9_workspace"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"
mkdir -p .agent-admin/assurance .agent-admin/lifecycle modules/mat/src
echo "initial" > README.md
git add .
git commit -q -m "Initial commit"
git branch -M main
git checkout -q -b test-branch
# Add implementation file
echo "export const x = 1;" > modules/mat/src/feature.ts
git add .
git commit -q -m "Add impl file"
# Add valid IAA token (REVIEWED_SHA = impl commit)
IMPL_SHA2=$(git rev-parse HEAD)
cat > .agent-admin/assurance/iaa-token-test-lc9.md << EOF
# IAA Assurance Token

PHASE_B_BLOCKING_TOKEN: IAA-test-lc9-PASS

**Token**: IAA-test-lc9-PASS
**Verdict**: ASSURANCE-TOKEN (PASS)
**PR**: #9999
**Issue**: maturion-isms#1503
**Reviewed SHA**: ${IMPL_SHA2}
EOF
git add .
git commit -q -m "Add IAA token"
# Add a post-review implementation file
echo "export const y = 2;" > modules/mat/src/post-iaa.ts
git add .
git commit -q -m "Post-IAA implementation change"
FINAL_SHA=$(git rev-parse HEAD)
# Add a delta-assurance block.
# current_head_sha = FINAL_SHA (the post-IAA impl commit, not the upcoming delta-assurance commit).
# The delta-assurance commit itself only adds a .agent-admin/ file, so no impl change
# occurs after FINAL_SHA, and the block is valid.
cat > .agent-admin/assurance/iaa-delta-assurance-test-lc9.md << EOF
# Delta-Assurance Block

prior_reviewed_sha: ${IMPL_SHA2}
current_head_sha: ${FINAL_SHA}
delta_classification: non-substantive
pr: #9999
issue: maturion-isms#1503
justification: Post-IAA change adds test scaffolding only — no logic change.
EOF
git add .
git commit -q -m "Add delta-assurance block"
lc9_base=$(git rev-parse main 2>/dev/null)
lc9_head=$(git rev-parse HEAD 2>/dev/null || echo "HEAD")
set +e
lc9_output=$(BASE_SHA="$lc9_base" HEAD_SHA="$lc9_head" PR_NUMBER="9999" PR_LABELS="" \
  PR_BODY="Closes maturion-isms#1503" EXPECTED_ISSUE_NUMBER="1503" \
  bash "$LIFECYCLE_SCRIPT" 2>&1)
lc9_exit=$?
set -e
if echo "$lc9_output" | grep -q "assurance-ready"; then
  echo "  ✅ PASS (post-IAA impl commit with valid delta-assurance block → lifecycle assurance-ready)"
  TEST_PASSED=$((TEST_PASSED + 1))
else
  echo "  ❌ FAIL — expected lifecycle assurance-ready when valid delta-assurance block present"
  echo "  Output excerpt:"
  echo "$lc9_output" | grep -E "assurance-ready|BLOCKED|LIFECYCLE|delta|SHA" | head -10
  TEST_FAILED=$((TEST_FAILED + 1))
fi
cd "$TEST_DIR"
rm -rf "$lc9_workspace"
echo ""

# ================================================================
# Cleanup
# ================================================================
rm -rf "$TEST_DIR"

echo "=== Test Summary ==="
echo "Passed: $TEST_PASSED"
echo "Failed: $TEST_FAILED"
echo ""

if [ "$TEST_FAILED" -gt 0 ]; then
  echo "❌ ${TEST_FAILED} test(s) FAILED"
  exit 1
fi

echo "✅ All ${TEST_PASSED} tests PASSED"
exit 0
