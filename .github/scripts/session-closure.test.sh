#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROTOCOL_SCRIPT="${SCRIPT_DIR}/session-closure.sh"
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
    shift
    printf '   %s\n' "$@"
    FAIL=$((FAIL + 1))
}

create_fixture() {
    local fixture="$1"
    local inventory="$2"

    mkdir -p \
        "$fixture/.github/scripts" \
        "$fixture/.github/agents" \
        "$fixture/.agent-workspace/test-agent" \
        "$fixture/governance"

    cp "$PROTOCOL_SCRIPT" "$fixture/.github/scripts/session-closure.sh"
    chmod +x "$fixture/.github/scripts/session-closure.sh"

    cat > "$fixture/.github/agents/test-agent.md" <<'EOF'
---
agent:
  id: test-agent
  class: fixture
  version: 1.0.0
merge_gate_interface:
  required_checks: []
---
# Test agent
EOF

    printf '%s\n' "$inventory" > "$fixture/governance/CANON_INVENTORY.json"

    (
        cd "$fixture"
        git init -q
        git config user.email "fixture@example.invalid"
        git config user.name "Session Closure Fixture"
        git add .
        git commit -q -m "fixture"
    )
}

create_parser_mask_path() {
    local destination="$1"
    local include_node="$2"

    mkdir -p "$destination"
    printf '#!/usr/bin/env bash\nexit 127\n' > "$destination/jq"
    chmod +x "$destination/jq"

    if [ "$include_node" != "true" ]; then
        printf '#!/usr/bin/env bash\nexit 127\n' > "$destination/node"
        chmod +x "$destination/node"
    fi
}

run_closure() {
    local fixture="$1"
    local output_file="$2"
    local parser_mask_path="$3"

    set +e
    (
        cd "$fixture"
        PATH="$parser_mask_path:$PATH" \
        CHECK_RUNS_JSON='{"check_runs":[]}' \
        COMMIT_STATUSES_JSON='{"statuses":[]}' \
        "$BASH" .github/scripts/session-closure.sh test-agent
    ) >"$output_file" 2>&1
    local status=$?
    set -e
    return "$status"
}

node_only_path="${TEST_ROOT}/node-only-path"
parserless_path="${TEST_ROOT}/parserless-path"
create_parser_mask_path "$node_only_path" true
create_parser_mask_path "$parserless_path" false

valid_fixture="${TEST_ROOT}/valid"
create_fixture "$valid_fixture" '{"version":"1.0.0","total_artifacts":0,"canons":[]}'
valid_output="${TEST_ROOT}/valid.out"
if run_closure "$valid_fixture" "$valid_output" "$node_only_path"; then
    valid_status=0
else
    valid_status=$?
fi
if [ "$valid_status" -ne 0 ] \
    && grep -q "CANON_INVENTORY.json valid" "$valid_output" \
    && ! grep -q "CANON_INVENTORY.json invalid" "$valid_output" \
    && ! grep -q "CANON_INVENTORY.json malformed" "$valid_output"; then
    record_pass "Node.js fallback accepts valid JSON without jq before merge-check gating"
else
    record_fail "Node.js fallback accepts valid JSON without jq before merge-check gating" "$(cat "$valid_output")"
fi

malformed_fixture="${TEST_ROOT}/malformed"
create_fixture "$malformed_fixture" '{"version":'
malformed_output="${TEST_ROOT}/malformed.out"
if ! run_closure "$malformed_fixture" "$malformed_output" "$node_only_path" \
    && grep -q "CANON_INVENTORY.json invalid" "$malformed_output" \
    && grep -q "CANON_INVENTORY.json malformed" "$malformed_output"; then
    record_pass "Node.js fallback rejects malformed JSON"
else
    record_fail "Node.js fallback rejects malformed JSON" "$(cat "$malformed_output")"
fi

parserless_fixture="${TEST_ROOT}/parserless"
create_fixture "$parserless_fixture" '{"version":"1.0.0","total_artifacts":0,"canons":[]}'
parserless_output="${TEST_ROOT}/parserless.out"
if ! run_closure "$parserless_fixture" "$parserless_output" "$parserless_path" \
    && grep -q "JSON parser/tooling unavailable" "$parserless_output" \
    && ! grep -q "CANON_INVENTORY.json invalid" "$parserless_output" \
    && ! grep -q "CANON_INVENTORY.json malformed" "$parserless_output"; then
    record_pass "missing JSON parser fails closed as tooling"
else
    record_fail "missing JSON parser fails closed as tooling" "$(cat "$parserless_output")"
fi

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ "$FAIL" -ne 0 ]; then
    exit 1
fi

echo "Session closure JSON parser regression suite passed."
