#!/bin/bash
# Test suite for iaa-final-assurance-gate.sh and ecap-admin-ceremony-gate.sh
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Validate IAA final assurance and ECAP/admin ceremony CI gates
#          against the acceptance criteria in maturion-isms#1503.
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
#   MMM-IAA-1     product-fix manifest requires_iaa=false — IAA gate waived        → exit 0
#   MMM-IAA-2     manifest requires_iaa=true — IAA gate still enforces             → exit 1
#   MMM-IAA-3     manifest requires_iaa=false — bypass fires regardless of paths   → exit 0
#   MMM-ECAP-1    product-fix manifest requires_ecap=false — ECAP gate waived      → exit 0
#   MMM-ECAP-2    governance-change manifest requires_ecap=true — gate enforces    → exit 1
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
# TEST SUITE — MMM Simple PR Admin Model bypass
# ================================================================

# MMM-IAA-1: .admin/pr.json with requires_iaa: false — IAA gate waived
# Product-fix PR with no IAA token — should PASS due to manifest bypass
setup_mmm_iaa_1() {
  add_impl_file
  mkdir -p .admin
  cat > .admin/pr.json << 'EOF'
{
  "pr": 9999,
  "issue": 1530,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["modules/mat/src/test.ts"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
  git add .admin/pr.json
  git commit -q -m "Add product-fix manifest with requires_iaa: false"
}
run_test "MMM-IAA-1: product-fix manifest requires_iaa=false — IAA gate waived" 0 "$IAA_GATE_SCRIPT" "setup_mmm_iaa_1"

# MMM-IAA-2: .admin/pr.json with requires_iaa: true — IAA gate still enforces
# Product-fix PR with requires_iaa: true but no token — should FAIL
setup_mmm_iaa_2() {
  add_impl_file
  mkdir -p .admin
  cat > .admin/pr.json << 'EOF'
{
  "pr": 9999,
  "issue": 1530,
  "type": "database-migration",
  "owner": "Copilot",
  "scope": ["modules/mat/src/test.ts"],
  "risk": "high",
  "requires_iaa": true,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
  git add .admin/pr.json
  git commit -q -m "Add database-migration manifest with requires_iaa: true"
}
run_test "MMM-IAA-2: manifest requires_iaa=true — IAA gate still enforces" 1 "$IAA_GATE_SCRIPT" "setup_mmm_iaa_2"

# MMM-IAA-3: .admin/pr.json with requires_iaa: false — governance-protected path
# When requires_iaa: false is declared and a governance path changed, the bypass
# still fires (validate-simple-pr-admin.sh prevents this case at manifest-level,
# but the IAA gate itself respects the manifest declaration).
setup_mmm_iaa_3() {
  add_governance_file
  mkdir -p .admin
  cat > .admin/pr.json << 'EOF'
{
  "pr": 9999,
  "issue": 1530,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["governance/canon/SOME_DOC.md"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
  git add .admin/pr.json
  git commit -q -m "Add manifest with requires_iaa: false"
}
run_test "MMM-IAA-3: manifest requires_iaa=false — bypass fires regardless of changed paths" 0 "$IAA_GATE_SCRIPT" "setup_mmm_iaa_3"

# MMM-ECAP-1: .admin/pr.json with requires_ecap: false — ECAP gate waived
# Protected-path PR (governance canon changed) but manifest says requires_ecap: false
setup_mmm_ecap_1() {
  add_governance_file
  mkdir -p .admin
  cat > .admin/pr.json << 'EOF'
{
  "pr": 9999,
  "issue": 1530,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": ["governance/canon/SOME_DOC.md"],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
  git add .admin/pr.json
  git commit -q -m "Add product-fix manifest with requires_ecap: false"
}
run_test "MMM-ECAP-1: product-fix manifest requires_ecap=false — ECAP gate waived" 0 "$ECAP_GATE_SCRIPT" "setup_mmm_ecap_1"

# MMM-ECAP-2: .admin/pr.json with requires_ecap: true — ECAP gate still enforces
# Protected-path PR with requires_ecap: true and no ECAP evidence — should FAIL
setup_mmm_ecap_2() {
  add_governance_file
  mkdir -p .admin
  cat > .admin/pr.json << 'EOF'
{
  "pr": 9999,
  "issue": 1530,
  "type": "governance-change",
  "owner": "Copilot",
  "scope": ["governance/canon/SOME_DOC.md"],
  "risk": "high",
  "requires_iaa": true,
  "requires_ecap": true,
  "evidence_required": ["tests pass"],
  "merge_authority": "CS2"
}
EOF
  git add .admin/pr.json
  git commit -q -m "Add governance-change manifest with requires_ecap: true"
}
run_test "MMM-ECAP-2: governance-change manifest requires_ecap=true — ECAP gate still enforces" 1 "$ECAP_GATE_SCRIPT" "setup_mmm_ecap_2"

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
