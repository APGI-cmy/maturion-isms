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
  "pre_iaa_submission_allowed": true,
  "final_cs2_handover_allowed": false,
  "handover_allowed": false,
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

# ── GOV-2064-T4: pre_iaa_submission_allowed vs final_cs2_handover_allowed focused tests ──
#
# run_full_control_case lets each scenario override state/pre_iaa_submission_allowed/
# final_cs2_handover_allowed/handover_allowed/pr_number independently, to exercise the new
# submission-only vs final-handover split without duplicating the whole fixture per case.
run_full_control_case() {
    local name="$1"
    local state="$2"
    local pre_iaa="$3"
    local final_cs2="$4"
    local legacy_handover="$5"
    local control_pr_number="$6"
    local expected_status="$7"   # "pass" (exit 0) or "fail" (non-zero exit + CS2 trigger)
    local fixture="${TEST_ROOT}/$(echo "$name" | tr ' ' '-')"
    mkdir -p "$fixture/.agent-workspace/foreman-v2/memory" "$fixture/.agent-admin/control"
    printf 'handover_allowed: true\n' > "$fixture/.agent-workspace/foreman-v2/memory/PREHANDOVER-fixture.md"
    cat > "$fixture/.agent-admin/control/handover-allowed.json" <<JSON
{
  "schema_version": "1.0.0",
  "wave_id": "fixture",
  "pr_number": ${control_pr_number},
  "current_head_sha": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "state": "${state}",
  "pre_iaa_submission_allowed": ${pre_iaa},
  "final_cs2_handover_allowed": ${final_cs2},
  "handover_allowed": ${legacy_handover},
  "foreman_qp_pass": true,
  "builder_delegation_verified": true,
  "delegation_precedes_implementation": true,
  "iaa_prebrief_ready": true,
  "scope_current": true,
  "ecap_required": false,
  "ecap_admin_validated": true,
  "all_required_checks_green": true,
  "iaa_final_required": false,
  "blocking_findings": []
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

    if [ "$expected_status" = "pass" ]; then
        if [ "$status" -eq 0 ]; then
            record_pass "$name"
        else
            record_fail "$name" "gate was expected to PASS but failed: $(cat "$fixture/output")"
        fi
        return
    fi

    # expected_status = "fail": gate must fail, route FOREMAN_STOP_AND_FIX (never CS2_REVIEW),
    # and never be merely a missing-key error (the fixture is complete; this must be a genuine
    # semantic rejection).
    if [ "$status" -eq 0 ]; then
        record_fail "$name" "gate was expected to FAIL but passed"
        return
    fi
    if grep -q "missing required key" "$fixture/output"; then
        record_fail "$name" "gate failed only on a missing-key error, not the targeted semantic check: $(cat "$fixture/output")"
        return
    fi
    if node - "$fixture/.agent-admin/control/cs2-trigger.json" <<'NODE'
const fs = require('fs');
const [file] = process.argv.slice(2);
const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
// Rejection must route to FOREMAN_STOP_AND_FIX / CORRECTION, never CS2_REVIEW, for an ordinary
// substantive/semantic defect (no protected-authority finding present in these fixtures).
if (payload.decision !== 'FOREMAN_STOP_AND_FIX') process.exit(1);
NODE
    then
        record_pass "$name"
    else
        record_fail "$name" "rejection did not route to FOREMAN_STOP_AND_FIX: $(cat "$fixture/output")"
    fi
}

run_full_control_case \
    "final_cs2_handover_allowed true at PRE_HANDOVER_GATE_PASS must fail" \
    "PRE_HANDOVER_GATE_PASS" "true" "true" "true" "42" \
    "fail"
run_full_control_case \
    "pr_number mismatch is a stale control file and must fail" \
    "PRE_HANDOVER_GATE_PASS" "true" "false" "false" "999" \
    "fail"
run_full_control_case \
    "handover_allowed must equal final_cs2_handover_allowed" \
    "IAA_FINAL_PASS" "true" "true" "false" "42" \
    "fail"
run_full_control_case \
    "pre_iaa_submission_allowed true before PRE_HANDOVER_GATE_PASS must fail" \
    "BUILD_DELEGATED" "true" "false" "false" "42" \
    "fail"
run_full_control_case \
    "genuine final handover state with consistent fields passes" \
    "IAA_FINAL_PASS" "true" "true" "true" "42" \
    "pass"

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ "$FAIL" -ne 0 ]; then
    exit 1
fi
