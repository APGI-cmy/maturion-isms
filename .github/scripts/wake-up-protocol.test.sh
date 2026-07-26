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
        "$fixture/governance"

    cp "$PROTOCOL_SCRIPT" "$fixture/.github/scripts/wake-up-protocol.sh"
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
    printf '{"version":"1.0.0","total_artifacts":0,"canons":[]}\n' > "$fixture/governance/CANON_INVENTORY.json"

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

fixture="${TEST_ROOT}/fixture"
create_fixture "$fixture"

happy_output="${TEST_ROOT}/happy.out"
if run_protocol "$fixture" "test-agent" "$happy_output" \
    && grep -q "Tier 2 required-file validation passed" "$happy_output" \
    && grep -q "All health checks PASSED" "$happy_output"; then
    record_pass "complete declared Tier 2 set passes"
else
    record_fail "complete declared Tier 2 set passes" "$(cat "$happy_output")"
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
