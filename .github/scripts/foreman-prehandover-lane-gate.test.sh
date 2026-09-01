#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE="${SCRIPT_DIR}/foreman-prehandover-lane-gate.js"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT

PASS=0
FAIL=0

record_pass() {
    echo "✅ $1"
    PASS=$((PASS + 1))
}

record_fail() {
    echo "❌ $1"
    printf '   %s\n' "$2"
    FAIL=$((FAIL + 1))
}

run_case() {
    local name="$1"
    local changed_files="$2"
    local expected_decision="$3"
    local fixture="${TEST_ROOT}/$(echo "$name" | tr ' ' '-')"
    mkdir -p "$fixture/.agent-workspace/foreman-v2/memory"
    printf 'handover_allowed: true\n' > "$fixture/.agent-workspace/foreman-v2/memory/PREHANDOVER-fixture.md"

    set +e
    (
        cd "$fixture"
        PR_NUMBER=42 \
        PR_HEAD_SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
        PR_BASE_SHA=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb \
        GITHUB_SHA=cccccccccccccccccccccccccccccccccccccccc \
        SOURCE_WORKFLOW_RUN_ID=12345 \
        SOURCE_WORKFLOW_NAME='Foreman Pre-Handover Lane Gate' \
        CHANGED_FILES="$changed_files" \
        node "$GATE"
    ) >"$fixture/output" 2>&1
    local status=$?
    set -e

    if [ "$status" -eq 0 ] || [ ! -f "$fixture/.agent-admin/control/cs2-trigger.json" ]; then
        record_fail "$name" "gate did not fail with a trigger artifact: $(cat "$fixture/output")"
        return
    fi

    if node - "$fixture/.agent-admin/control/cs2-trigger.json" "$expected_decision" <<'NODE'
const fs = require('fs');
const [file, decision] = process.argv.slice(2);
const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
if (payload.decision !== decision || payload.pr_number !== 42 || payload.source_run_id !== '12345') {
  process.exit(1);
}
NODE
    then
        record_pass "$name"
    else
        record_fail "$name" "trigger payload did not contain the expected bounded decision and source identity"
    fi
}

run_case \
    "ordinary lane failure routes to Foreman" \
    ".agent-workspace/foreman-v2/memory/PREHANDOVER-fixture.md" \
    "FOREMAN_STOP_AND_FIX"
run_case \
    "ordinary missing control remains Foreman-owned with protected paths" \
    $'.agent-workspace/foreman-v2/memory/PREHANDOVER-fixture.md\n.github/workflows/foreman-prehandover-lane-gate.yml\n.github/agents/example.md\ngovernance/canon/POLICY.md' \
    "FOREMAN_STOP_AND_FIX"

run_control_case() {
    local name="$1"
    local current_head_sha="$2"
    local findings="$3"
    local expected_decision="$4"
    local fixture="${TEST_ROOT}/$(echo "$name" | tr ' ' '-')"
    mkdir -p "$fixture/.agent-workspace/foreman-v2/memory" "$fixture/.agent-admin/control"
    printf 'handover_allowed: true\n' > "$fixture/.agent-workspace/foreman-v2/memory/PREHANDOVER-fixture.md"
    cat > "$fixture/.agent-admin/control/handover-allowed.json" <<JSON
{
  "schema_version": "1.0.0",
  "wave_id": "fixture",
  "pr_number": 42,
  "current_head_sha": "${current_head_sha}",
  "state": "PRE_HANDOVER_GATE_PASS",
  "handover_allowed": true,
  "foreman_qp_pass": true,
  "builder_delegation_verified": true,
  "delegation_precedes_implementation": true,
  "iaa_prebrief_ready": true,
  "scope_current": true,
  "ecap_required": false,
  "ecap_admin_validated": true,
  "all_required_checks_green": true,
  "iaa_final_required": false,
  "blocking_findings": ${findings}
}
JSON

    set +e
    (
        cd "$fixture"
        PR_NUMBER=42 \
        PR_HEAD_SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
        PR_BASE_SHA=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb \
        GITHUB_SHA=cccccccccccccccccccccccccccccccccccccccc \
        SOURCE_WORKFLOW_RUN_ID=12345 \
        SOURCE_WORKFLOW_NAME='Foreman Pre-Handover Lane Gate' \
        CHANGED_FILES=".agent-workspace/foreman-v2/memory/PREHANDOVER-fixture.md" \
        node "$GATE"
    ) >"$fixture/output" 2>&1
    local status=$?
    set -e

    if [ "$status" -eq 0 ] || ! grep -q "current_head_sha must equal PR head SHA" "$fixture/output" && [ "$findings" = "[]" ]; then
        record_fail "$name" "gate did not fail with the expected control validation error: $(cat "$fixture/output")"
        return
    fi
    if node - "$fixture/.agent-admin/control/cs2-trigger.json" "$expected_decision" <<'NODE'
const fs = require('fs');
const [file, decision] = process.argv.slice(2);
const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
if (payload.decision !== decision) process.exit(1);
NODE
    then
        record_pass "$name"
    else
        record_fail "$name" "trigger payload did not contain the expected decision"
    fi
}

run_control_case \
    "stale handover control fails exact head check" \
    "dddddddddddddddddddddddddddddddddddddddd" \
    "[]" \
    "FOREMAN_STOP_AND_FIX"
run_control_case \
    "explicit protected authority finding escalates to CS2 review" \
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" \
    '["protected governance authority requires human decision"]' \
    "CS2_ESCALATION_REQUIRED"

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ "$FAIL" -ne 0 ]; then
    exit 1
fi
