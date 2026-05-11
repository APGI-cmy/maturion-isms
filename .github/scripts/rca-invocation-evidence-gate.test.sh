#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="${SCRIPT_DIR}/rca-invocation-evidence-gate.sh"
TEST_DIR="$(mktemp -d)"

PASS=0
FAIL=0

run_test() {
  local name="$1"
  local expected_exit="$2"
  local setup_fn="$3"

  local ws
  ws="$(mktemp -d -p "$TEST_DIR")"
  cd "$ws"
  mkdir -p .agent-admin/rca

  "$setup_fn"

  set +e
  PR_NUMBER=1603 RCA_REQUIRED="${RCA_REQUIRED:-no}" bash "$GATE_SCRIPT" >/tmp/rca-gate-test.log 2>&1
  local status=$?
  set -e

  if [[ "$status" -eq "$expected_exit" ]]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected_exit, got $status)"
    cat /tmp/rca-gate-test.log
    FAIL=$((FAIL + 1))
  fi
}

setup_marker_absent() { RCA_REQUIRED="no"; }

setup_marker_missing_artifact() {
  RCA_REQUIRED="yes"
}

setup_empty_artifact() {
  RCA_REQUIRED="yes"
  : > .agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-1603.md
}

setup_incomplete_artifact() {
  RCA_REQUIRED="yes"
  cat > .agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-1603.md <<'EOF'
# ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT
PR: #1603
Issue: #1595
Failure trigger: HANDOVER BLOCKED
Failure class:
EOF
}

setup_valid_artifact() {
  RCA_REQUIRED="yes"
  cat > .agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-1603.md <<'EOF'
# ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT
PR: #1603
Issue: #1595
Failure trigger: HANDOVER BLOCKED after handover claim
Failure class: stale-head handover evidence
Root cause: stale evidence reposted without non-mutating verification
Was this already covered by existing guidance: yes
Lowest effective fix layer: CI/gate update
Corrective action required: add RCA_REQUIRED marker + evidence gate
Regression needed: yes
Tier 2 update needed: yes
Template update needed: no
Gate update needed: yes
Canon issue needed: no
Agent contract review needed: no
Product backlog item needed: no
Owner for correction: foreman-v2-agent
IAA review required: yes
CS2 final overview required: yes
RCA verdict: GATE_CHANGE_REQUIRED
EOF
}

run_test "No RCA marker active -> pass" 0 setup_marker_absent
run_test "RCA marker active but artifact missing -> fail" 1 setup_marker_missing_artifact
run_test "RCA marker active but artifact empty -> fail" 1 setup_empty_artifact
run_test "RCA marker active but required fields missing -> fail" 1 setup_incomplete_artifact
run_test "RCA marker active with complete artifact -> pass" 0 setup_valid_artifact

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

rm -rf "$TEST_DIR"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
