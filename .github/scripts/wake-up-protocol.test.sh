#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROTOCOL_SCRIPT="${SCRIPT_DIR}/wake-up-protocol.sh"
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

    mkdir -p \
        "$fixture/.github/scripts" \
        "$fixture/.github/agents" \
        "$fixture/.agent-workspace/test-agent/knowledge" \
        "$fixture/.agent-workspace/no-tier-agent" \
        "$fixture/governance/canon"

    cp "$PROTOCOL_SCRIPT" "$fixture/.github/scripts/wake-up-protocol.sh"
    cp "${SCRIPT_DIR}/validate-canon-inventory.js" "$fixture/.github/scripts/validate-canon-inventory.js"
    chmod +x "$fixture/.github/scripts/wake-up-protocol.sh"

    cat > "$fixture/.github/agents/test-agent.md" <<'EOF'
---
agent:
  id: test-agent
  class: fixture
  version: 1.0.0
tier2_knowledge:
  index: .agent-workspace/test-agent/knowledge/index.md
  required_files: [index.md, alpha.md, beta.md]
---
# Test agent
EOF

    cat > "$fixture/.github/agents/no-tier-agent.md" <<'EOF'
---
agent:
  id: no-tier-agent
  class: fixture
  version: 1.0.0
---
# No Tier 2 fixture
EOF

    printf '# Fixture index\n' > "$fixture/.agent-workspace/test-agent/knowledge/index.md"
    printf '# Alpha\n' > "$fixture/.agent-workspace/test-agent/knowledge/alpha.md"
    printf '# Beta\n' > "$fixture/.agent-workspace/test-agent/knowledge/beta.md"
    printf 'canonical fixture\n' > "$fixture/governance/canon/example.md"
    local canon_hash
    canon_hash="$(sha256sum "$fixture/governance/canon/example.md" | awk '{print $1}')"
    printf '{"version":"1.0.0","total_artifacts":1,"canons":[{"path":"governance/canon/example.md","file_hash_sha256":"%s"}]}\n' \
        "$canon_hash" > "$fixture/governance/CANON_INVENTORY.json"

    (
        cd "$fixture"
        git init -q
        git config user.email "fixture@example.invalid"
        git config user.name "Wake-Up Fixture"
        git add .
        git commit -q -m "fixture"
    )
}

run_protocol() {
    local fixture="$1"
    local agent_id="$2"
    local output_file="$3"

    set +e
    (
        cd "$fixture"
        bash .github/scripts/wake-up-protocol.sh "$agent_id"
    ) >"$output_file" 2>&1
    local status=$?
    set -e
    return "$status"
}

create_constrained_path() {
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

run_protocol_with_path() {
    local fixture="$1"
    local agent_id="$2"
    local output_file="$3"
    local constrained_path="$4"

    set +e
    (
        cd "$fixture"
        PATH="$constrained_path:$PATH" "$BASH" .github/scripts/wake-up-protocol.sh "$agent_id"
    ) >"$output_file" 2>&1
    local status=$?
    set -e
    return "$status"
}

fixture="${TEST_ROOT}/fixture"
create_fixture "$fixture"
node_only_path="${TEST_ROOT}/node-only-path"
parserless_path="${TEST_ROOT}/parserless-path"
create_constrained_path "$node_only_path" true
create_constrained_path "$parserless_path" false

happy_output="${TEST_ROOT}/happy.out"
if run_protocol "$fixture" "test-agent" "$happy_output" \
    && grep -q "Tier 2 required-file validation passed" "$happy_output" \
    && grep -q "content hashes verified using LF-normalized UTF-8" "$happy_output" \
    && grep -q "All health checks PASSED" "$happy_output"; then
    record_pass "complete declared Tier 2 set passes"
else
    record_fail "complete declared Tier 2 set passes" "$(cat "$happy_output")"
fi

node_fallback_output="${TEST_ROOT}/node-fallback.out"
if run_protocol_with_path "$fixture" "test-agent" "$node_fallback_output" "$node_only_path" \
    && grep -q "JSON parser: node" "$node_fallback_output" \
    && grep -q "All JSON files valid" "$node_fallback_output" \
    && grep -q "All health checks PASSED" "$node_fallback_output"; then
    record_pass "Node.js fallback validates valid JSON without jq"
else
    record_fail "Node.js fallback validates valid JSON without jq" "$(cat "$node_fallback_output")"
fi

printf '{"version":\n' > "$fixture/governance/CANON_INVENTORY.json"
malformed_output="${TEST_ROOT}/malformed.out"
if ! run_protocol_with_path "$fixture" "test-agent" "$malformed_output" "$node_only_path" \
    && grep -q "JSON parser: node" "$malformed_output" \
    && grep -q "CANON_INVENTORY.json is invalid JSON" "$malformed_output" \
    && ! grep -q "All health checks PASSED" "$malformed_output"; then
    record_pass "Node.js fallback rejects malformed JSON"
else
    record_fail "Node.js fallback rejects malformed JSON" "$(cat "$malformed_output")"
fi

printf '{"version":"1.0.0","total_artifacts":0,"canons":[]}\n' > "$fixture/governance/CANON_INVENTORY.json"
parserless_output="${TEST_ROOT}/parserless.out"
if ! run_protocol_with_path "$fixture" "test-agent" "$parserless_output" "$parserless_path" \
    && grep -q "JSON parser/tooling unavailable" "$parserless_output" \
    && ! grep -q "invalid JSON" "$parserless_output" \
    && ! grep -q "All health checks PASSED" "$parserless_output"; then
    record_pass "missing JSON parser fails closed as tooling"
else
    record_fail "missing JSON parser fails closed as tooling" "$(cat "$parserless_output")"
fi

mkdir -p "$fixture/.agent-workspace/test-agent/memory"
for session_number in $(seq -w 1 400); do
    printf '# Fixture session %s\n' "$session_number" \
        >"$fixture/.agent-workspace/test-agent/memory/session-${session_number}-20260726.md"
done

populated_memory_failed=0
populated_memory_failure_detail=""
for attempt in $(seq 1 12); do
    populated_output="${TEST_ROOT}/populated-${attempt}.out"
    if ! run_protocol "$fixture" "test-agent" "$populated_output"; then
        populated_memory_failed=1
        populated_memory_failure_detail="attempt=${attempt}; $(tail -20 "$populated_output")"
        break
    fi
    if grep -q "Broken pipe" "$populated_output" \
        || [ "$(grep -c '^    • session-' "$populated_output")" -ne 5 ] \
        || ! grep -q "All health checks PASSED" "$populated_output"; then
        populated_memory_failed=1
        populated_memory_failure_detail="attempt=${attempt}; $(tail -20 "$populated_output")"
        break
    fi
done

if [ "$populated_memory_failed" -eq 0 ]; then
    record_pass "populated memory history passes 12 repeated complete-manifest bootstraps"
else
    record_fail \
        "populated memory history passes 12 repeated complete-manifest bootstraps" \
        "$populated_memory_failure_detail"
fi

rm -f \
    "$fixture/.agent-workspace/test-agent/working-contract.md" \
    "$fixture/.agent-workspace/test-agent/environment-health.json" \
    "$fixture/.agent-workspace/test-agent/knowledge/beta.md"

missing_output="${TEST_ROOT}/missing.out"
if run_protocol "$fixture" "test-agent" "$missing_output"; then
    missing_status=0
else
    missing_status=$?
fi

if [ "$missing_status" -ne 0 ] \
    && grep -q "Required Tier 2 file missing: beta.md" "$missing_output" \
    && grep -q "bootstrap halted before memory scan and working-contract generation" "$missing_output" \
    && ! grep -q "All health checks PASSED" "$missing_output" \
    && ! grep -q "Agent is ready to begin session work" "$missing_output" \
    && [ ! -e "$fixture/.agent-workspace/test-agent/working-contract.md" ]; then
    record_pass "missing declared Tier 2 file fails closed and names the file"
else
    record_fail \
        "missing declared Tier 2 file fails closed and names the file" \
        "exit=${missing_status}" \
        "working_contract_exists=$([ -e "$fixture/.agent-workspace/test-agent/working-contract.md" ] && echo yes || echo no)" \
        "$(cat "$missing_output")"
fi

no_tier_output="${TEST_ROOT}/no-tier.out"
if run_protocol "$fixture" "no-tier-agent" "$no_tier_output" \
    && grep -q "Tier 2 required-file manifest: NOT DECLARED" "$no_tier_output" \
    && grep -q "All health checks PASSED" "$no_tier_output"; then
    record_pass "agent without Tier 2 manifest preserves existing bootstrap behavior"
else
    record_fail "agent without Tier 2 manifest preserves existing bootstrap behavior" "$(cat "$no_tier_output")"
fi

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ "$FAIL" -ne 0 ]; then
    exit 1
fi

echo "Wake-up protocol Tier 2 regression suite passed."
