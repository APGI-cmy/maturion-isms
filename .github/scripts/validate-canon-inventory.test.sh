#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATOR="${SCRIPT_DIR}/validate-canon-inventory.js"
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

write_inventory() {
    local root="$1"
    local hash="$2"
    local declared_path="${3:-governance/canon/example.md}"
    printf '{"version":"1.0.0","total_artifacts":1,"canons":[{"path":"%s","file_hash_sha256":"%s"}]}\n' \
        "$declared_path" "$hash" > "$root/governance/CANON_INVENTORY.json"
}

run_validator() {
    local root="$1"
    node "$VALIDATOR" --inventory "$root/governance/CANON_INVENTORY.json" --root "$root"
}

create_fixture() {
    local root="$1"
    mkdir -p "$root/governance/canon"
    printf 'first line\nsecond line\n' > "$root/governance/canon/example.md"
}

fixture="${TEST_ROOT}/fixture"
create_fixture "$fixture"
canonical_hash="$(node -e "const c=require('crypto'); process.stdout.write(c.createHash('sha256').update('first line\\nsecond line\\n','utf8').digest('hex'))")"
write_inventory "$fixture" "$canonical_hash"

if run_validator "$fixture" >/dev/null; then
    record_pass "LF canonical content validates"
else
    record_fail "LF canonical content validates" "validator rejected the LF fixture"
fi

printf 'first line\r\nsecond line\r\n' > "$fixture/governance/canon/example.md"
if run_validator "$fixture" >/dev/null; then
    record_pass "CRLF content matches LF-normalized inventory hash"
else
    record_fail "CRLF content matches LF-normalized inventory hash" "validator did not normalize CRLF"
fi

printf 'first line\r\nchanged line\r\n' > "$fixture/governance/canon/example.md"
if ! output="$(run_validator "$fixture" 2>&1)" && grep -q "canon content hash mismatch" <<<"$output"; then
    record_pass "content modification fails integrity validation"
else
    record_fail "content modification fails integrity validation" "${output:-validator unexpectedly passed}"
fi

printf 'first line\nsecond line\n' > "$fixture/governance/canon/declared.md"
write_inventory "$fixture" "$canonical_hash" "governance/canon/declared.md"
if run_validator "$fixture" >/dev/null; then
    record_pass "validator uses each entry's declared path"
else
    record_fail "validator uses each entry's declared path" "validator did not honor the declared path"
fi

write_inventory "$fixture" "$canonical_hash" "governance/canon/missing.md"
if ! output="$(run_validator "$fixture" 2>&1)" && grep -q "declared canon path is missing" <<<"$output"; then
    record_pass "missing declared path fails closed"
else
    record_fail "missing declared path fails closed" "${output:-validator unexpectedly passed}"
fi

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ "$FAIL" -ne 0 ]; then
    exit 1
fi
