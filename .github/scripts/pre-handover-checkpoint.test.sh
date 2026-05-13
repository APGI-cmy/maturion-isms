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
  TEST_MERGE_CONFLICT_CHECKED="yes"
  TEST_MERGEABLE_WITH_BASE="yes"
  TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED="yes"
  TEST_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER=""

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
    CHECKPOINT_MERGE_CONFLICT_CHECKED="$TEST_MERGE_CONFLICT_CHECKED" \
    CHECKPOINT_MERGEABLE_WITH_BASE="$TEST_MERGEABLE_WITH_BASE" \
    CHECKPOINT_BASE_SYNCED_OR_CONFLICTS_RESOLVED="$TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED" \
    CHECKPOINT_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER="$TEST_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER" \
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

run_virtual_file_test() {
  local name="$1"
  local mode="$2"
  local virtual_files_json="$3"
  local expected="$4"
  local ws actual

  ws="$(mktemp -d -p "$TEST_DIR")"
  mkdir -p "$ws/.admin"
  printf '%s\n' '{"disk":"present"}' > "$ws/.admin/pr.json"
  printf '%s\n' "$virtual_files_json" > "$ws/virtual-files.json"

  actual="$(WORKSPACE="$ws" MODE="$mode" node - "$CHECKPOINT_SCRIPT" <<'EOF'
const path = require('path');
process.chdir(process.env.WORKSPACE);
process.env.CHECKPOINT_REPO_FILES_PATH = path.join(process.env.WORKSPACE, 'virtual-files.json');
const checkpoint = require(process.argv[2]);

let value;
if (process.env.MODE === 'safeRead') {
  value = checkpoint.safeRead(path.join(process.env.WORKSPACE, '.admin/pr.json'));
} else if (process.env.MODE === 'readJson') {
  value = checkpoint.readJson(path.join(process.env.WORKSPACE, '.admin/pr.json'));
} else {
  throw new Error(`Unknown MODE: ${process.env.MODE}`);
}

process.stdout.write(typeof value === 'string' ? value : JSON.stringify(value));
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

setup_mixed_ecap_sha() {
  setup_green_checkpoint
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  cat > .agent-admin/prehandover/proof-test.md <<EOF
gate_snapshot_head_sha: ${head_sha}
post_push_head_sha: deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
ecap_invoked: yes
admin_ceremony_compliance: PASS
iaa_audit_token: .agent-admin/assurance/iaa-wave-record-test.md
EOF
  git add .agent-admin/prehandover/proof-test.md
  git commit -q -m "mixed ecap proof"
}
run_checkpoint_test "8. mixed explicit SHA fields require all current -> STOP_AND_FIX" "STOP_AND_FIX" "no" "stale against current HEAD" setup_mixed_ecap_sha

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
run_checkpoint_test "9. product-facing missing functional evidence -> STOP_AND_FIX" "STOP_AND_FIX" "no" "Functional delivery evidence missing." setup_product_missing_evidence

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
run_checkpoint_test "10. product-facing FUNCTIONAL_PASS no -> STOP_AND_FIX" "STOP_AND_FIX" "no" "Functional PASS verdict not confirmed." setup_product_functional_fail

setup_merge_conflict_not_resolved() {
  setup_green_checkpoint
  TEST_MERGE_CONFLICT_CHECKED="yes"
  TEST_MERGEABLE_WITH_BASE="no"
  TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED="no"
}
run_checkpoint_test "11. unresolved merge conflicts -> STOP_AND_FIX" "STOP_AND_FIX" "no" "mergeable with base" setup_merge_conflict_not_resolved

setup_out_of_sandbox_blocker() {
  setup_green_checkpoint
  TEST_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER="preflight/phase-1-evidence depends on protected-file change requiring CS2 authority"
}
run_checkpoint_test "12. out-of-sandbox blocker -> CS2_INTERVENTION_REQUIRED" "CS2_INTERVENTION_REQUIRED" "no" "CS2 intervention needed" setup_out_of_sandbox_blocker

run_virtual_file_test "13. virtual mode safeRead does not fall back to disk" safeRead '{}' ""
run_virtual_file_test "14. virtual mode readJson does not fall back to disk" readJson '{}' "null"
run_virtual_file_test "15. virtual file path provides readJson content" readJson '{".admin/pr.json":"{\"virtual\":\"present\"}"}' '{"virtual":"present"}'

run_claim_test "16. handover language without checkpoint remains claim" claim "handover complete" true
run_claim_test "17. STOP_AND_FIX summary is not a handover claim" claim $'PRE_HANDOVER_CHECKPOINT_RESULT\nRESULT: STOP_AND_FIX\nHANDOVER_ALLOWED: no' false
run_claim_test "17b. CS2_INTERVENTION_REQUIRED summary is not a handover claim" claim $'PRE_HANDOVER_CHECKPOINT_RESULT\nRESULT: CS2_INTERVENTION_REQUIRED\nOUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER: missing required secret\nHANDOVER_ALLOWED: no' false
run_claim_test "17c. REJECTION_NOTICE summary is not a handover claim" claim $'FOREMAN_REJECTION_NOTICE\nRESULT: REJECTED_BACK_TO_PRODUCER\nHANDOVER_ALLOWED: no' false
run_claim_test "18. draft/status comment without handover language stays false" claim "status update only" false
run_claim_test "18b. /prepare-handover is deliberate trigger, not claim" trigger "/prepare-handover" true
run_claim_test "18c. /prepare-handover is excluded from handover-claim parsing" claim "/prepare-handover" false

# ── Corrective producer comment predicate (operator-precedence regression) ──
# Mirrors the fixed logic in handover-claim-gate.yml:
#   c.user?.login === producerLogin &&
#   new Date(c.created_at) > blockedAt &&
#   ( /HANDOVER_BLOCKED|STOP_AND_FIX/.test(c.body||'') || REJECTION_NOTICE_REGEX.test(c.body||'') )
# Without the parentheses the || escapes both &&-guards so any REJECTION_NOTICE
# from any user at any time incorrectly satisfies the corrective-comment check.

run_corrective_comment_test() {
  local name="$1"
  local producer_login="$2"
  local blocked_at_iso="$3"
  local comments_json="$4"
  local expected="$5"
  local actual

  actual="$(
    PRODUCER_LOGIN="$producer_login" \
    BLOCKED_AT="$blocked_at_iso" \
    COMMENTS_JSON="$comments_json" \
    node - <<'JSEOF'
const REJECTION_NOTICE_REGEX = /(?:ADMIN_|IAA_|FOREMAN_)?REJECTION_NOTICE/i;
const producerLogin = process.env.PRODUCER_LOGIN || '';
const blockedAt = new Date(process.env.BLOCKED_AT || 0);
const comments = JSON.parse(process.env.COMMENTS_JSON || '[]');
// Fixed predicate (parentheses around the || alternatives)
const correctiveProducerComment = comments.some(c =>
  c.user?.login === producerLogin &&
  new Date(c.created_at) > blockedAt &&
  (
    /HANDOVER_BLOCKED|STOP_AND_FIX/i.test(c.body || '') ||
    REJECTION_NOTICE_REGEX.test(c.body || '')
  )
);
process.stdout.write(correctiveProducerComment ? 'true' : 'false');
JSEOF
  )"

  if [[ "$actual" == "$expected" ]]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected $expected got $actual)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

# 19. Non-producer REJECTION_NOTICE after prior HANDOVER_BLOCKED must NOT unlock.
run_corrective_comment_test \
  "19. non-producer REJECTION_NOTICE after HANDOVER_BLOCKED does NOT unlock" \
  "producer-agent" \
  "2026-01-01T10:00:00Z" \
  '[{"user":{"login":"other-user"},"created_at":"2026-01-01T11:00:00Z","body":"FOREMAN_REJECTION_NOTICE"}]' \
  "false"

# 20. Producer REJECTION_NOTICE after prior HANDOVER_BLOCKED MAY unlock next claim.
run_corrective_comment_test \
  "20. producer REJECTION_NOTICE after HANDOVER_BLOCKED DOES unlock" \
  "producer-agent" \
  "2026-01-01T10:00:00Z" \
  '[{"user":{"login":"producer-agent"},"created_at":"2026-01-01T11:00:00Z","body":"FOREMAN_REJECTION_NOTICE"}]' \
  "true"

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
