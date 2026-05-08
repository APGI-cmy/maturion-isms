#!/bin/bash
# Regression coverage for pre-handover checkpoint evaluation and safety-net claim parsing.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKPOINT_SCRIPT="${SCRIPT_DIR}/pre-handover-checkpoint.js"
TEST_DIR="$(mktemp -d)"
PASS_COUNT=0
FAIL_COUNT=0

echo "=== Pre-Handover Checkpoint Regression ==="
echo "Test dir: $TEST_DIR"

run_checkpoint_test() {
  local name="$1"
  local expected_result="$2"
  local expected_handover="$3"
  local expected_reason="$4"
  local setup_fn="$5"

  local ws
  ws="$(mktemp -d -p "$TEST_DIR")"
  cd "$ws"

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"
  mkdir -p .admin/prs .agent-admin/assurance .agent-admin/prehandover \
           .agent-workspace/execution-ceremony-admin-agent/bundles \
           .agent-workspace/foreman-v2/memory .agent-admin/scope-declarations
  echo "init" > README.md
  git add .
  git commit -q -m "init"
  git branch -M main
  git checkout -q -b test-branch

  TEST_PR_BODY=""
  CHECK_RUNS_JSON='[]'
  COMMIT_STATUSES_JSON='[]'
  TEST_HEAD_SHA_OVERRIDE=""

  "$setup_fn"

  local base_sha head_sha output result handover reason
  base_sha="$(git rev-parse main)"
  head_sha="${TEST_HEAD_SHA_OVERRIDE:-$(git rev-parse HEAD)}"
  output="$(
    PR_NUMBER=9999 \
    ISSUE_NUMBER=1583 \
    PR_BODY="$TEST_PR_BODY" \
    PR_TITLE="Checkpoint hardening" \
    PR_BRANCH="copilot/test-checkpoint" \
    CHECKPOINT_TRIGGER="/prepare-handover" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    CHECKPOINT_CHECK_RUNS_JSON="$CHECK_RUNS_JSON" \
    CHECKPOINT_COMMIT_STATUSES_JSON="$COMMIT_STATUSES_JSON" \
    node "$CHECKPOINT_SCRIPT"
  )"

  result="$(printf '%s\n' "$output" | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>process.stdout.write(JSON.parse(data).fields.RESULT));')"
  handover="$(printf '%s\n' "$output" | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>process.stdout.write(JSON.parse(data).fields.HANDOVER_ALLOWED));')"
  reason="$(printf '%s\n' "$output" | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>process.stdout.write(JSON.parse(data).fields.REASON));')"

  if [[ "$result" == "$expected_result" && "$handover" == "$expected_handover" && "$reason" == *"$expected_reason"* ]]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name"
    echo "   result=$result handover=$handover"
    echo "   reason=$reason"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

run_claim_test() {
  local name="$1"
  local mode="$2"
  local body="$3"
  local expected="$4"
  local actual

  actual="$(BODY="$body" MODE="$mode" node - "$CHECKPOINT_SCRIPT" <<'EOF'
const checkpoint = require(process.argv[2]);
const body = process.env.BODY || '';
const mode = process.env.MODE || '';
const value =
  mode === 'trigger'
    ? checkpoint.isCheckpointTriggerComment(body)
    : checkpoint.isHandoverClaimComment(body);
process.stdout.write(value ? 'true' : 'false');
EOF
)"

  if [[ "$actual" == "$expected" ]]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected $expected got $actual)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

seed_manifest_and_scope() {
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  cat > .admin/prs/pr-9999.json <<'EOF'
{
  "pr": 9999,
  "issue": 1583,
  "type": "governance-change",
  "owner": "Copilot",
  "scope": [
    ".admin/prs/pr-9999.json",
    ".agent-admin/scope-declarations/pr-9999.md",
    ".agent-admin/assurance/iaa-wave-record-test.md",
    ".agent-admin/prehandover/proof-test.md",
    ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test.md"
  ],
  "risk": "medium",
  "requires_iaa": true,
  "requires_ecap": true,
  "evidence_required": ["checkpoint regression"],
  "merge_authority": "CS2"
}
EOF
  cat > .agent-admin/scope-declarations/pr-9999.md <<'EOF'
# Scope Declaration — PR #9999
PR_NUMBER: 9999
ISSUE: #1583
FILES_CHANGED: 5
EOF
  git add .admin/prs/pr-9999.json .agent-admin/scope-declarations/pr-9999.md
  git commit -q -m "add manifest and scope"
  head_sha="$(git rev-parse HEAD)"
  cat > .agent-admin/scope-declarations/pr-9999.md <<EOF
# Scope Declaration — PR #9999
PR_NUMBER: 9999
ISSUE: #1583
FILES_CHANGED: 5
CURRENT_HEAD_SHA: ${head_sha}
EOF
  git add .agent-admin/scope-declarations/pr-9999.md
  git commit -q -m "refresh scope"
}

seed_green_checks() {
  CHECK_RUNS_JSON='[
    {"name":"preflight/phase-1-evidence","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/iaa-prebrief-existence","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/iaa-token-self-certification","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/hfmc-ripple-presence","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/evidence-exactness","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/iaa-final-assurance","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/ecap-admin-ceremony","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/scope-declaration-parity","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/mmm-pr-admin","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/product-delivery-gates","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/gate-changing-pr-rule","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"}
  ]'
}

seed_checkpoint_artifacts() {
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  cat > .agent-admin/assurance/iaa-wave-record-test.md <<EOF
## PRE-BRIEF
Wave ready.

## TOKEN
**PR**: #9999
**Issue**: maturion-isms#1583
**Reviewed SHA**: ${head_sha}
PHASE_B_BLOCKING_TOKEN: IAA-session-test-PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  cat > .agent-admin/prehandover/proof-test.md <<EOF
gate_snapshot_head_sha: ${head_sha}
post_push_head_sha: ${head_sha}
ecap_invoked: yes
admin_ceremony_compliance: PASS
iaa_audit_token: .agent-admin/assurance/iaa-wave-record-test.md
EOF
  cat > .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test.md <<EOF
CURRENT_HEAD_SHA: ${head_sha}
ecap_session: ecap-session-test
ecap_verdict: PASS
EOF
  git add .agent-admin/assurance/iaa-wave-record-test.md .agent-admin/prehandover/proof-test.md .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test.md
  git commit -q -m "add checkpoint artifacts"
}

setup_green_checkpoint() {
  seed_manifest_and_scope
  seed_checkpoint_artifacts
  seed_green_checks
}
run_checkpoint_test "1. all checks/artifacts current -> HANDOVER_ALLOWED" "HANDOVER_ALLOWED" "yes" "All current-head checkpoint requirements satisfied." setup_green_checkpoint

setup_pending_checks() {
  setup_green_checkpoint
  CHECK_RUNS_JSON='[
    {"name":"preflight/phase-1-evidence","status":"completed","conclusion":"success","started_at":"2026-05-08T10:00:00Z"},
    {"name":"preflight/iaa-prebrief-existence","status":"in_progress","started_at":"2026-05-08T10:01:00Z"}
  ]'
}
run_checkpoint_test "2. pending checks -> STOP_AND_FIX" "STOP_AND_FIX" "no" "Pending checks present" setup_pending_checks

setup_failing_checks() {
  setup_green_checkpoint
  CHECK_RUNS_JSON='[
    {"name":"preflight/phase-1-evidence","status":"completed","conclusion":"failure","started_at":"2026-05-08T10:00:00Z"}
  ]'
}
run_checkpoint_test "3. failing checks -> STOP_AND_FIX" "STOP_AND_FIX" "no" "Failing checks present" setup_failing_checks

setup_missing_ecap() {
  seed_manifest_and_scope
  seed_green_checks
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  cat > .agent-admin/assurance/iaa-wave-record-test.md <<EOF
## PRE-BRIEF
## TOKEN
**Reviewed SHA**: ${head_sha}
PHASE_B_BLOCKING_TOKEN: IAA-session-test-PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  git add .agent-admin/assurance/iaa-wave-record-test.md
  git commit -q -m "iaa only"
}
run_checkpoint_test "4. missing ECAP when required -> STOP_AND_FIX" "STOP_AND_FIX" "no" "ECAP artifact missing while ECAP is required." setup_missing_ecap

setup_missing_iaa_final() {
  seed_manifest_and_scope
  seed_green_checks
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  cat > .agent-admin/assurance/iaa-wave-record-test.md <<EOF
## PRE-BRIEF
Current head ${head_sha}
EOF
  cat > .agent-admin/prehandover/proof-test.md <<EOF
gate_snapshot_head_sha: ${head_sha}
post_push_head_sha: ${head_sha}
ecap_invoked: yes
admin_ceremony_compliance: PASS
EOF
  git add .agent-admin/assurance/iaa-wave-record-test.md .agent-admin/prehandover/proof-test.md
  git commit -q -m "missing token"
}
run_checkpoint_test "5. missing IAA final assurance -> STOP_AND_FIX" "STOP_AND_FIX" "no" "IAA token artifact missing." setup_missing_iaa_final

setup_pending_token() {
  setup_green_checkpoint
  cat > .agent-admin/prehandover/proof-test.md <<'EOF'
gate_snapshot_head_sha: stale
post_push_head_sha: stale
ecap_invoked: yes
admin_ceremony_compliance: PASS
iaa_audit_token: PENDING
EOF
  git add .agent-admin/prehandover/proof-test.md
  git commit -q -m "pending token"
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  cat > .agent-admin/prehandover/proof-test.md <<EOF
gate_snapshot_head_sha: ${head_sha}
post_push_head_sha: ${head_sha}
ecap_invoked: yes
admin_ceremony_compliance: PASS
iaa_audit_token: PENDING
EOF
  git add .agent-admin/prehandover/proof-test.md
  git commit -q -m "refresh pending token proof"
}
run_checkpoint_test "6. iaa_audit_token pending -> STOP_AND_FIX" "STOP_AND_FIX" "no" "IAA token is still pending" setup_pending_token

setup_stale_ecap_sha() {
  setup_green_checkpoint
  cat > .agent-admin/prehandover/proof-test.md <<'EOF'
gate_snapshot_head_sha: deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
post_push_head_sha: deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
ecap_invoked: yes
admin_ceremony_compliance: PASS
iaa_audit_token: .agent-admin/assurance/iaa-wave-record-test.md
EOF
  git add .agent-admin/prehandover/proof-test.md
  git commit -q -m "stale ecap proof"
}
run_checkpoint_test "7. stale SHA in ECAP artifact -> STOP_AND_FIX" "STOP_AND_FIX" "no" "stale against current HEAD" setup_stale_ecap_sha

setup_product_missing_evidence() {
  seed_manifest_and_scope
  seed_green_checks
  mkdir -p apps/mmm/src
  cat > apps/mmm/src/Page.tsx <<'EOF'
export const Page = () => <button onClick={() => fetch('/api/frameworks/init')}>Run</button>;
EOF
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  cat > .agent-admin/assurance/iaa-wave-record-test.md <<EOF
## PRE-BRIEF
## TOKEN
**Reviewed SHA**: ${head_sha}
PHASE_B_BLOCKING_TOKEN: IAA-session-test-PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  cat > .agent-admin/prehandover/proof-test.md <<EOF
gate_snapshot_head_sha: ${head_sha}
post_push_head_sha: ${head_sha}
ecap_invoked: yes
admin_ceremony_compliance: PASS
EOF
  git add apps/mmm/src/Page.tsx .agent-admin/assurance/iaa-wave-record-test.md .agent-admin/prehandover/proof-test.md
  git commit -q -m "product change no evidence"
}
run_checkpoint_test "8. product-facing missing functional evidence -> STOP_AND_FIX" "STOP_AND_FIX" "no" "Functional delivery evidence missing." setup_product_missing_evidence

setup_product_functional_fail() {
  setup_product_missing_evidence
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  mkdir -p .functional-delivery
  cat > .functional-delivery/pr-9999.md <<EOF
PR: #9999
Issue: #1583
Current head SHA reviewed: ${head_sha}
Builder QA functional report reference: qa-report
FUNCTIONAL_PASS: no
VERDICT: PARTIAL_FUNCTIONAL_DELIVERY
EOF
  git add .functional-delivery/pr-9999.md
  git commit -q -m "functional pass no"
}
run_checkpoint_test "9. product-facing FUNCTIONAL_PASS no -> STOP_AND_FIX" "STOP_AND_FIX" "no" "Functional PASS verdict not confirmed." setup_product_functional_fail

run_claim_test "10. handover language without checkpoint remains claim" claim "handover complete" true
run_claim_test "11. STOP_AND_FIX summary is not a handover claim" claim $'PRE_HANDOVER_CHECKPOINT_RESULT\nRESULT: STOP_AND_FIX\nHANDOVER_ALLOWED: no' false
run_claim_test "12. draft/status comment without handover language stays false" claim "status update only" false
run_claim_test "12b. /prepare-handover is deliberate trigger, not claim" trigger "/prepare-handover" true
run_claim_test "12c. /prepare-handover is excluded from handover-claim parsing" claim "/prepare-handover" false

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
