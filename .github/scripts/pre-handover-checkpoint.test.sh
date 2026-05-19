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
  TEST_CHANGED_FILES_JSON=""
  TEST_PR_UPDATED_AT=""
  TEST_PR_COMMENTS_JSON='[]'
  TEST_PR_COMMENTS_PATH=""
  TEST_CHECKPOINT_TRIGGER="/prepare-handover"
  TEST_CHECKPOINT_INTAKE_ONLY=""
  TEST_MARK_CURRENT_RUN_AS_INTAKE=""
  TEST_MERGE_CONFLICT_CHECKED="yes"
  TEST_MERGEABLE_WITH_BASE="yes"
  TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED="yes"
  TEST_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER=""
  TEST_CHECK_RUNS_PATH=""
  TEST_COMMIT_STATUSES_PATH=""
  TEST_CHANGED_FILES_PATH=""

  "$setup_fn"

  local base_sha head_sha output result handover reason
  base_sha="$(git rev-parse main)"
  head_sha="${TEST_HEAD_SHA_OVERRIDE:-$(git rev-parse HEAD)}"
  output="$(
    PR_NUMBER=9999 \
    ISSUE_NUMBER=1583 \
    PR_BODY="$TEST_PR_BODY" \
    PR_UPDATED_AT="$TEST_PR_UPDATED_AT" \
    PR_TITLE="Checkpoint hardening" \
    PR_BRANCH="copilot/test-checkpoint" \
    CHECKPOINT_TRIGGER="$TEST_CHECKPOINT_TRIGGER" \
    CHECKPOINT_INTAKE_ONLY="$TEST_CHECKPOINT_INTAKE_ONLY" \
    CHECKPOINT_MARK_CURRENT_RUN_AS_INTAKE="$TEST_MARK_CURRENT_RUN_AS_INTAKE" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    CHECKPOINT_CHECK_RUNS_PATH="$TEST_CHECK_RUNS_PATH" \
    CHECKPOINT_CHECK_RUNS_JSON="$CHECK_RUNS_JSON" \
    CHECKPOINT_COMMIT_STATUSES_PATH="$TEST_COMMIT_STATUSES_PATH" \
    CHECKPOINT_COMMIT_STATUSES_JSON="$COMMIT_STATUSES_JSON" \
    CHECKPOINT_CHANGED_FILES_JSON="${TEST_CHANGED_FILES_JSON:-}" \
    CHECKPOINT_CHANGED_FILES_PATH="$TEST_CHANGED_FILES_PATH" \
    CHECKPOINT_PR_COMMENTS_PATH="$TEST_PR_COMMENTS_PATH" \
    CHECKPOINT_PR_COMMENTS_JSON="$TEST_PR_COMMENTS_JSON" \
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

run_checkpoint_field_test() {
  local name="$1"
  local setup_fn="$2"
  local expected_result="$3"
  local expected_handover="$4"
  local expected_field_checks_json="$5"

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
  TEST_CHANGED_FILES_JSON=""
  TEST_PR_UPDATED_AT=""
  TEST_PR_COMMENTS_JSON='[]'
  TEST_PR_COMMENTS_PATH=""
  TEST_CHECKPOINT_TRIGGER="/prepare-handover"
  TEST_CHECKPOINT_INTAKE_ONLY=""
  TEST_MARK_CURRENT_RUN_AS_INTAKE=""
  TEST_MERGE_CONFLICT_CHECKED="yes"
  TEST_MERGEABLE_WITH_BASE="yes"
  TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED="yes"
  TEST_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER=""
  TEST_CHECK_RUNS_PATH=""
  TEST_COMMIT_STATUSES_PATH=""
  TEST_CHANGED_FILES_PATH=""

  "$setup_fn"

  local base_sha head_sha output
  base_sha="$(git rev-parse main)"
  head_sha="${TEST_HEAD_SHA_OVERRIDE:-$(git rev-parse HEAD)}"
  output="$(
    PR_NUMBER=9999 \
    ISSUE_NUMBER=1583 \
    PR_BODY="$TEST_PR_BODY" \
    PR_UPDATED_AT="$TEST_PR_UPDATED_AT" \
    PR_TITLE="Checkpoint hardening" \
    PR_BRANCH="copilot/test-checkpoint" \
    CHECKPOINT_TRIGGER="$TEST_CHECKPOINT_TRIGGER" \
    CHECKPOINT_INTAKE_ONLY="$TEST_CHECKPOINT_INTAKE_ONLY" \
    CHECKPOINT_MARK_CURRENT_RUN_AS_INTAKE="$TEST_MARK_CURRENT_RUN_AS_INTAKE" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    CHECKPOINT_CHECK_RUNS_PATH="$TEST_CHECK_RUNS_PATH" \
    CHECKPOINT_CHECK_RUNS_JSON="$CHECK_RUNS_JSON" \
    CHECKPOINT_COMMIT_STATUSES_PATH="$TEST_COMMIT_STATUSES_PATH" \
    CHECKPOINT_COMMIT_STATUSES_JSON="$COMMIT_STATUSES_JSON" \
    CHECKPOINT_CHANGED_FILES_JSON="${TEST_CHANGED_FILES_JSON:-}" \
    CHECKPOINT_CHANGED_FILES_PATH="$TEST_CHANGED_FILES_PATH" \
    CHECKPOINT_PR_COMMENTS_PATH="$TEST_PR_COMMENTS_PATH" \
    CHECKPOINT_PR_COMMENTS_JSON="$TEST_PR_COMMENTS_JSON" \
    CHECKPOINT_MERGE_CONFLICT_CHECKED="$TEST_MERGE_CONFLICT_CHECKED" \
    CHECKPOINT_MERGEABLE_WITH_BASE="$TEST_MERGEABLE_WITH_BASE" \
    CHECKPOINT_BASE_SYNCED_OR_CONFLICTS_RESOLVED="$TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED" \
    CHECKPOINT_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER="$TEST_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER" \
    node "$CHECKPOINT_SCRIPT"
  )"

  if OUTPUT="$output" EXPECTED_RESULT="$expected_result" EXPECTED_HANDOVER="$expected_handover" FIELD_CHECKS="$expected_field_checks_json" node - <<'EOF'
const output = JSON.parse(process.env.OUTPUT || '{}');
const fields = output.fields || {};
const expectedResult = process.env.EXPECTED_RESULT || '';
const expectedHandover = process.env.EXPECTED_HANDOVER || '';
const checks = JSON.parse(process.env.FIELD_CHECKS || '[]');
let ok = true;

if (fields.RESULT !== expectedResult) {
  console.error(`result mismatch: expected ${expectedResult} got ${fields.RESULT}`);
  ok = false;
}
if (fields.HANDOVER_ALLOWED !== expectedHandover) {
  console.error(`handover mismatch: expected ${expectedHandover} got ${fields.HANDOVER_ALLOWED}`);
  ok = false;
}

for (const check of checks) {
  const actual = String(fields[check.field] || '');
  if (check.equals !== undefined && actual !== String(check.equals)) {
    console.error(`${check.field} mismatch: expected ${check.equals} got ${actual}`);
    ok = false;
  }
  if (check.contains && !actual.includes(check.contains)) {
    console.error(`${check.field} missing substring: ${check.contains}; actual=${actual}`);
    ok = false;
  }
}

process.exit(ok ? 0 : 1);
EOF
  then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name"
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

run_failed_gate_signal_test() {
  local name="$1"
  local body="$2"
  local expected="$3"
  local actual

  actual="$(BODY="$body" node - "$CHECKPOINT_SCRIPT" <<'EOF'
const checkpoint = require(process.argv[2]);
const body = process.env.BODY || '';
process.stdout.write(checkpoint.isFailedGateSignalComment(body) ? 'true' : 'false');
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

run_invalid_json_fallback_test() {
  local name="$1"
  local actual

  actual="$(node - "$CHECKPOINT_SCRIPT" <<'EOF'
const checkpoint = require(process.argv[2]);
process.env.CHECKPOINT_PR_COMMENTS_PATH = '';
process.env.CHECKPOINT_PR_COMMENTS_JSON = 'not-json';
try {
  checkpoint.parseJsonInput('CHECKPOINT_PR_COMMENTS_PATH', 'CHECKPOINT_PR_COMMENTS_JSON', []);
  process.stdout.write('no-error');
} catch (error) {
  process.stdout.write(error.message);
}
EOF
)"

  if [[ "$actual" == *"CHECKPOINT_PR_COMMENTS_JSON is not valid JSON"* ]]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (unexpected output: $actual)"
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

setup_file_backed_checkpoint_inputs() {
  mkdir -p checkpoint-inputs
  printf '%s\n' "$CHECK_RUNS_JSON" > checkpoint-inputs/check-runs.json
  printf '%s\n' "$COMMIT_STATUSES_JSON" > checkpoint-inputs/commit-statuses.json
  printf '%s\n' "$TEST_PR_COMMENTS_JSON" > checkpoint-inputs/pr-comments.json
  git diff --name-only main...HEAD > checkpoint-inputs/changed-files.jsonl
  node -e '
    const fs = require("fs");
    const lines = fs.readFileSync("checkpoint-inputs/changed-files.jsonl", "utf8")
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    fs.writeFileSync("checkpoint-inputs/changed-files.json", JSON.stringify(lines));
  '
  TEST_CHECK_RUNS_PATH="$PWD/checkpoint-inputs/check-runs.json"
  TEST_COMMIT_STATUSES_PATH="$PWD/checkpoint-inputs/commit-statuses.json"
  TEST_PR_COMMENTS_PATH="$PWD/checkpoint-inputs/pr-comments.json"
  TEST_CHANGED_FILES_PATH="$PWD/checkpoint-inputs/changed-files.json"
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

setup_mmm_compile_handoff_missing_verify_gate() {
  setup_green_checkpoint
  mkdir -p apps/mmm/src/pages
  mkdir -p .functional-delivery
  cat > apps/mmm/src/pages/FrameworkReviewPage.compile-handoff.tsx <<'EOF'
export const FrameworkReviewPage = () => <div>compile handoff with framework_id + legacy workspace</div>;
EOF
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  cat > .functional-delivery/pr-9999.md <<EOF
PR: #9999
Issue: #1583
Current head SHA reviewed: ${head_sha}
Builder QA functional report reference: qa-report
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  git add apps/mmm/src/pages/FrameworkReviewPage.compile-handoff.tsx .functional-delivery/pr-9999.md
  git commit -q -m "mmm framework compile handoff update"
  TEST_HEAD_SHA_OVERRIDE="$(git rev-parse HEAD)"
}
run_checkpoint_field_test \
  "10b. PR-1653-style MMM compile handoff missing verify gate -> STOP_AND_FIX and explicit journey fields" \
  setup_mmm_compile_handoff_missing_verify_gate \
  "STOP_AND_FIX" \
  "no" \
  '[
    {"field":"PRODUCT_JOURNEY_CLASSIFICATION","contains":"mmm-frameworkreviewpage-compile-handoff"},
    {"field":"PRODUCT_JOURNEY_CLASSIFICATION","contains":"mmm-verify-mode-a-required"},
    {"field":"PRODUCT_JOURNEY_CLASSIFICATION","contains":"mmm-verify-mode-b-required"},
    {"field":"PRODUCT_JOURNEY_CLASSIFICATION","contains":"mmm-verify-mode-c-required"},
    {"field":"PRODUCT_JOURNEY_CLASSIFICATION","contains":"mmm-legacy-workspace-handoff-required"},
    {"field":"PRODUCT_JOURNEY_CLASSIFICATION","contains":"mmm-framework_id-preservation-required"},
    {"field":"AFFECTED_PRODUCT_GATES_REQUIRED","contains":"MMM Live Dashboard Diagnosis / Verify Mode A/B/C"},
    {"field":"AFFECTED_PRODUCT_GATES_REQUIRED","contains":"preflight/product-delivery-gates"},
    {"field":"AFFECTED_PRODUCT_GATES_REQUIRED","contains":"preflight/iaa-final-assurance"},
    {"field":"FAILED_AFFECTED_GATES","contains":"MMM Live Dashboard Diagnosis / Verify Mode A/B/C"},
    {"field":"REQUIRED_ACTION","equals":"STOP_AND_FIX"},
    {"field":"FAILED_GATE_LOG_CONSUMPTION","equals":"no"},
    {"field":"QA_REJECTION_PACKAGE_RESULT","equals":"STOP_AND_FIX"},
    {"field":"QA_REJECTION_PACKAGE_HANDOVER_ALLOWED","equals":"no"},
    {"field":"QA_REJECTION_PACKAGE_UNRESOLVED_REJECTIONS","contains":"MMM Live Dashboard Diagnosis / Verify Mode A/B/C"}
  ]'

setup_pr1661_scope_mismatch_regression() {
  setup_green_checkpoint
  TEST_CHANGED_FILES_JSON='[
    ".admin/prs/pr-9999.json",
    ".agent-admin/scope-declarations/pr-9999.md",
    ".agent-admin/assurance/iaa-wave-record-test.md",
    ".agent-admin/prehandover/proof-test.md",
    ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test.md",
    ".functional-delivery/pr-9999.md",
    ".agent-workspace/foreman-v2/memory/PREHANDOVER-test.md",
    "apps/mmm/src/pages/FrameworkReviewPage.compile-handoff.tsx",
    ".github/workflows/handover-claim-gate.yml",
    ".github/scripts/handover-claim-gate.test.sh"
  ]'
  cat > .agent-admin/scope-declarations/pr-9999.md <<'EOF'
# Scope Declaration — PR #9999
PR_NUMBER: 9999
ISSUE: #1583
FILES_CHANGED: 9
- `.admin/prs/pr-9999.json` - manifest
- `.agent-admin/scope-declarations/pr-9999.md` - scope
- `.agent-admin/assurance/iaa-wave-record-test.md` - assurance
- `.agent-admin/prehandover/proof-test.md` - prehandover proof
- `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-test.md` - ecap bundle
- `.functional-delivery/pr-9999.md` - product delivery
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-test.md` - foreman memory
- `apps/mmm/src/pages/FrameworkReviewPage.compile-handoff.tsx` - mmm compile handoff
- `.github/workflows/handover-claim-gate.yml` - workflow
EOF
  mkdir -p .functional-delivery
  cat > .functional-delivery/pr-9999.md <<'EOF'
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
Builder QA functional report reference: qa-report
EOF
  CHECK_RUNS_JSON='[
    {"name":"preflight/evidence-exactness","status":"completed","conclusion":"failure","id":99001,"started_at":"2026-05-18T10:00:00Z","completed_at":"2026-05-18T10:01:00Z"},
    {"name":"preflight/mmm-pr-admin","status":"completed","conclusion":"failure","id":99002,"started_at":"2026-05-18T10:00:30Z","completed_at":"2026-05-18T10:01:30Z"},
    {"name":"preflight/product-delivery-gates","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/phase-1-evidence","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/iaa-prebrief-existence","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/iaa-token-self-certification","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/hfmc-ripple-presence","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/iaa-final-assurance","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/ecap-admin-ceremony","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/scope-declaration-parity","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"},
    {"name":"preflight/gate-changing-pr-rule","status":"completed","conclusion":"success","started_at":"2026-05-18T10:00:00Z"}
  ]'
}
run_checkpoint_field_test \
  "10c. PR-1661 style mismatch surfaces missing 10th file in QA rejection package" \
  setup_pr1661_scope_mismatch_regression \
  "STOP_AND_FIX" \
  "no" \
  '[
    {"field":"FAILED_GATE_LOG_CONSUMPTION","equals":"no"},
    {"field":"QA_REJECTION_PACKAGE_RESULT","equals":"STOP_AND_FIX"},
    {"field":"QA_REJECTION_PACKAGE_HANDOVER_ALLOWED","equals":"no"},
    {"field":"QA_REJECTION_PACKAGE_UNRESOLVED_REJECTIONS","contains":"preflight/evidence-exactness"},
    {"field":"REASON","contains":"missing file(s): .github/scripts/handover-claim-gate.test.sh"}
  ]'

setup_early_injection_control_classification() {
  seed_manifest_and_scope
  seed_green_checks
  TEST_CHECKPOINT_TRIGGER="AUTO_INJECTION_INTAKE"
  TEST_CHECKPOINT_INTAKE_ONLY="true"
  TEST_MARK_CURRENT_RUN_AS_INTAKE="true"
  mkdir -p governance/canon
  cat > governance/canon/TEST_RULE.md <<'EOF'
Early governance change requiring ceremony.
EOF
  git add governance/canon/TEST_RULE.md
  git commit -q -m "governance change"
  TEST_HEAD_SHA_OVERRIDE="$(git rev-parse HEAD)"
}
run_checkpoint_field_test \
  "10d. early injection intake classifies ECAP/IAA before manual prompting" \
  setup_early_injection_control_classification \
  "STOP_AND_FIX" \
  "no" \
  '[
    {"field":"INJECTION_INTAKE_STATUS","equals":"CURRENT"},
    {"field":"INJECTION_STATE","equals":"current"},
    {"field":"ECAP_REQUIRED","equals":"yes"},
    {"field":"IAA_REQUIRED","equals":"yes"},
    {"field":"PRODUCER_SIDE_GATES_REQUIRED","contains":"preflight/ecap-admin-ceremony"},
    {"field":"PRODUCER_SIDE_GATES_REQUIRED","contains":"preflight/iaa-final-assurance"},
    {"field":"NEXT_REQUIRED_CONTROL","equals":"ECAP_GATE_AND_ADMIN_REPORT"},
    {"field":"HANDOVER_ALLOWED","equals":"no"}
  ]'

setup_stale_intake_after_cs2_comment() {
  setup_green_checkpoint
  TEST_CHECKPOINT_TRIGGER="AUTO_INJECTION_INTAKE"
  TEST_CHECKPOINT_INTAKE_ONLY="true"
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  TEST_PR_COMMENTS_JSON="$(cat <<EOF
[
  {
    "body": "<!-- pre-handover-checkpoint -->\n## PRE_HANDOVER_CHECKPOINT_RESULT\nCURRENT_HEAD_SHA: ${head_sha}\nLATEST_INJECTION_INTAKE_SHA: ${head_sha}\nLATEST_INJECTION_INTAKE_AT: 2026-05-18T09:00:00Z\nINJECTION_STATE: current\nNEXT_REQUIRED_CONTROL: none\nHANDOVER_ALLOWED: yes\nRESULT: HANDOVER_ALLOWED",
    "created_at": "2026-05-18T09:00:00Z",
    "updated_at": "2026-05-18T09:00:00Z",
    "user": {"login": "github-actions[bot]"}
  },
  {
    "body": "CS2: update the control mapping before review.",
    "created_at": "2026-05-18T10:00:00Z",
    "updated_at": "2026-05-18T10:00:00Z",
    "user": {"login": "APGI-cmy"}
  }
]
EOF
)"
}
run_checkpoint_field_test \
  "10e. stale intake after later CS2 comment -> dirty STOP_AND_FIX" \
  setup_stale_intake_after_cs2_comment \
  "STOP_AND_FIX" \
  "no" \
  '[
    {"field":"CS2_COMMENTS_DETECTED","equals":"yes"},
    {"field":"LATEST_INJECTION_INTAKE_AFTER_LAST_CS2_COMMENT","equals":"no"},
    {"field":"INJECTION_STATE","equals":"dirty"},
     {"field":"NEXT_REQUIRED_CONTROL","equals":"REFRESH_INJECTION_INTAKE"}
   ]'

setup_post_failure_package_status() {
  setup_green_checkpoint
  TEST_CHECKPOINT_TRIGGER="AUTO_INJECTION_INTAKE"
  TEST_CHECKPOINT_INTAKE_ONLY="true"
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  TEST_PR_COMMENTS_JSON="$(cat <<EOF
[
  {
    "body": "HANDOVER BLOCKED\\nRESULT: STOP_AND_FIX\\nQA_REJECTION_PACKAGE_STATUS: unresolved",
    "created_at": "2026-05-18T08:00:00Z",
    "updated_at": "2026-05-18T08:00:00Z",
    "user": {"login": "github-actions[bot]"}
  }
]
EOF
)"
}
run_checkpoint_field_test \
  "10da. unresolved failed-gate signal emits post-failure status (not closure)" \
  setup_post_failure_package_status \
  "STOP_AND_FIX" \
  "no" \
  '[
    {"field":"FAILED_GATE_COMMENTS_DETECTED","equals":"yes"},
    {"field":"POST_FAILURE_HANDLING_PACKAGE","equals":"POST_FAILURE_REJECTION_PACKAGE"},
    {"field":"POST_FAILURE_REJECTION_PACKAGE_STATE","equals":"QA_REJECTION_PACKAGE_STATUS"},
    {"field":"QA_REJECTION_PACKAGE_CLOSURE_ALLOWED","equals":"no"}
  ]'

setup_review_ready_before_ecap_iaa() {
  seed_manifest_and_scope
  seed_green_checks
  TEST_CHECKPOINT_TRIGGER="AUTO_INJECTION_INTAKE"
  TEST_CHECKPOINT_INTAKE_ONLY="true"
  local head_sha
  head_sha="$(git rev-parse HEAD)"
  TEST_HEAD_SHA_OVERRIDE="$head_sha"
  TEST_PR_BODY=$'## Status\n- [x] Scope declared\n\nReady for review once ceremony clears.'
  TEST_PR_COMMENTS_JSON="$(cat <<EOF
[
  {
    "body": "<!-- pre-handover-checkpoint -->\n## PRE_HANDOVER_CHECKPOINT_RESULT\nCURRENT_HEAD_SHA: ${head_sha}\nLATEST_INJECTION_INTAKE_SHA: ${head_sha}\nLATEST_INJECTION_INTAKE_AT: 2026-05-18T10:00:00Z\nINJECTION_STATE: current\nNEXT_REQUIRED_CONTROL: none\nHANDOVER_ALLOWED: no\nRESULT: INJECTION_INTAKE_CURRENT",
    "created_at": "2026-05-18T10:00:00Z",
    "updated_at": "2026-05-18T10:00:00Z",
    "user": {"login": "github-actions[bot]"}
  }
]
EOF
)"
}
run_checkpoint_field_test \
  "10f. review-ready language before ECAP/IAA invocation stays blocked" \
  setup_review_ready_before_ecap_iaa \
  "STOP_AND_FIX" \
  "no" \
  '[
    {"field":"INJECTION_STATE","equals":"current"},
    {"field":"ECAP_REQUIRED","equals":"yes"},
    {"field":"IAA_REQUIRED","equals":"yes"},
    {"field":"NEXT_REQUIRED_CONTROL","equals":"ECAP_GATE_AND_ADMIN_REPORT"},
    {"field":"HANDOVER_ALLOWED","equals":"no"}
  ]'

setup_unchecked_checklist_without_claim() {
  setup_green_checkpoint
  TEST_CHECKPOINT_TRIGGER="AUTO_INJECTION_INTAKE"
  TEST_CHECKPOINT_INTAKE_ONLY="true"
  TEST_MARK_CURRENT_RUN_AS_INTAKE="true"
  TEST_PR_BODY=$'## Status\n- [ ] Informational checklist item still open\n\nStill in progress.'
}
run_checkpoint_field_test \
  "10fa. unchecked checklist items do not block in-progress intake refresh" \
  setup_unchecked_checklist_without_claim \
  "INJECTION_INTAKE_CURRENT" \
  "no" \
  '[
    {"field":"INJECTION_STATE","equals":"current"},
    {"field":"NEXT_REQUIRED_CONTROL","equals":"none"},
    {"field":"HANDOVER_ALLOWED","equals":"no"}
  ]'

setup_file_backed_inputs_preferred() {
  setup_green_checkpoint
  setup_file_backed_checkpoint_inputs
  TEST_PR_COMMENTS_JSON='not-json'
  CHECK_RUNS_JSON='not-json'
  COMMIT_STATUSES_JSON='not-json'
}
run_checkpoint_field_test \
  "10g. file-backed checkpoint inputs are preferred over env JSON" \
  setup_file_backed_inputs_preferred \
  "HANDOVER_ALLOWED" \
  "yes" \
  '[
    {"field":"INJECTION_INTAKE_STATUS","equals":"CURRENT"},
    {"field":"HANDOVER_ALLOWED","equals":"yes"}
  ]'

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
run_checkpoint_field_test \
  "12a. out-of-sandbox blocker emits QA rejection package escalation fields" \
  setup_out_of_sandbox_blocker \
  "CS2_INTERVENTION_REQUIRED" \
  "no" \
  '[
    {"field":"FAILED_GATE_LOG_CONSUMPTION","equals":"no"},
    {"field":"QA_REJECTION_PACKAGE_RESULT","equals":"CS2_INTERVENTION_REQUIRED"},
    {"field":"QA_REJECTION_PACKAGE_HANDOVER_ALLOWED","equals":"no"},
    {"field":"QA_REJECTION_PACKAGE_OUT_OF_AUTHORITY_ITEMS","contains":"preflight/phase-1-evidence depends on protected-file change requiring CS2 authority"}
  ]'

setup_base_not_synced_without_explicit_signal() {
  setup_green_checkpoint
  TEST_BASE_SYNCED_OR_CONFLICTS_RESOLVED=""

  git checkout -q main
  echo "base advanced" >> README.md
  git add README.md
  git commit -q -m "advance base branch"
  git checkout -q test-branch
}
run_checkpoint_test "12b. base behind current main -> STOP_AND_FIX when sync check is derived from git" "STOP_AND_FIX" "no" "Base sync / conflict-resolution check failed." setup_base_not_synced_without_explicit_signal

run_virtual_file_test "13. virtual mode safeRead does not fall back to disk" safeRead '{}' ""
run_virtual_file_test "14. virtual mode readJson does not fall back to disk" readJson '{}' "null"
run_virtual_file_test "15. virtual file path provides readJson content" readJson '{".admin/pr.json":"{\"virtual\":\"present\"}"}' '{"virtual":"present"}'
run_invalid_json_fallback_test "15b. invalid env JSON without file path still fails explicitly"

run_claim_test "16. handover-ready language without checkpoint remains claim" claim "handover-ready" true
run_claim_test "17. STOP_AND_FIX summary is not a handover claim" claim $'PRE_HANDOVER_CHECKPOINT_RESULT\nRESULT: STOP_AND_FIX\nHANDOVER_ALLOWED: no' false
run_claim_test "17b. CS2_INTERVENTION_REQUIRED summary is not a handover claim" claim $'PRE_HANDOVER_CHECKPOINT_RESULT\nRESULT: CS2_INTERVENTION_REQUIRED\nOUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER: missing required secret\nHANDOVER_ALLOWED: no' false
run_claim_test "17c. REJECTION_NOTICE summary is not a handover claim" claim $'FOREMAN_REJECTION_NOTICE\nRESULT: REJECTED_BACK_TO_PRODUCER\nHANDOVER_ALLOWED: no' false
run_claim_test "18. draft/status comment without handover language stays false" claim "status update only" false
run_claim_test "18a. narrative handover topic without ready/claim posture stays false" claim "This PR updates handover gating behavior." false
run_claim_test "18b. /prepare-handover is deliberate trigger, not claim" trigger "/prepare-handover" true
run_claim_test "18c. /prepare-handover is excluded from handover-claim parsing" claim "/prepare-handover" false
run_failed_gate_signal_test "18d. handover checkpoint-required advisory is not a failed-gate signal" $'<!-- handover-checkpoint-required -->\nRESULT: CHECKPOINT_REQUIRED\nHANDOVER_ALLOWED: no' false

# ── Corrective producer comment predicate (operator-precedence regression) ──
# Mirrors the fixed logic in handover-claim-gate.yml:
#   c.user?.login === producerLogin &&
#   new Date(c.created_at) > blockedAt &&
#   ( /HANDOVER_BLOCKED|STOP_AND_FIX|CS2_INTERVENTION_REQUIRED/.test(c.body||'') || REJECTION_NOTICE_REGEX.test(c.body||'') )
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
    /HANDOVER_BLOCKED|STOP_AND_FIX|CS2_INTERVENTION_REQUIRED/i.test(c.body || '') ||
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

# 21. Non-producer CS2_INTERVENTION_REQUIRED after prior HANDOVER_BLOCKED must NOT unlock.
run_corrective_comment_test \
  "21. non-producer CS2_INTERVENTION_REQUIRED after HANDOVER_BLOCKED does NOT unlock" \
  "producer-agent" \
  "2026-01-01T10:00:00Z" \
  '[{"user":{"login":"other-user"},"created_at":"2026-01-01T11:00:00Z","body":"RESULT: CS2_INTERVENTION_REQUIRED"}]' \
  "false"

# 22. Producer CS2_INTERVENTION_REQUIRED after prior HANDOVER_BLOCKED MAY unlock next claim.
run_corrective_comment_test \
  "22. producer CS2_INTERVENTION_REQUIRED after HANDOVER_BLOCKED DOES unlock" \
  "producer-agent" \
  "2026-01-01T10:00:00Z" \
  '[{"user":{"login":"producer-agent"},"created_at":"2026-01-01T11:00:00Z","body":"RESULT: CS2_INTERVENTION_REQUIRED"}]' \
  "true"

# ── Injection compliance gate validation (§12 CS2 Injection Compliance) ──────
# Mirrors the enforcement added to handover-claim-gate.yml for full-ceremony PRs.
# Authority: governance/checklists/phase4-role-separation-operational-guidance.md §12
#            maturion-isms#1648

run_injection_compliance_test() {
  local name="$1"
  local comment_body="$2"
  local expected_blocked="$3"  # "true" = should generate precondition failure, "false" = should pass
  local actual

  actual="$(
    COMMENT_BODY="$comment_body" \
    node - <<'JSEOF'
// Mirrors the injection compliance validation logic from handover-claim-gate.yml §12.
// Authority: governance/checklists/phase4-role-separation-operational-guidance.md §12
const commentBody = process.env.COMMENT_BODY || '';
const preconditionFailures = [];

const escapeRegex = (s) => {
  const special = '\\\\^$*+?.()|{}[]';
  return String(s).split('').map((ch) => (special.includes(ch) ? '\\' + ch : ch)).join('');
};
const readField = (text, fieldName) => {
  const m = String(text || '').match(new RegExp('^\\s*(?:[-*]\\s+)?' + escapeRegex(fieldName) + ':\\s*(.+)\\s*$', 'im'));
  return m ? m[1].trim() : '';
};
const isNonEmptySignal = (value) => {
  const t = String(value || '').trim().toLowerCase();
  return t !== '' && !['none', 'n/a', 'na', '0', '[]', '{}', 'not_applicable'].includes(t);
};

const injectionComplianceResult = readField(commentBody, 'INJECTION_COMPLIANCE_RESULT');
const uncheckedRequiredItems = readField(commentBody, 'UNCHECKED_REQUIRED_ITEMS');
const unauthorizedDeviations = readField(commentBody, 'UNAUTHORIZED_DEVIATIONS');
if (!injectionComplianceResult) {
  preconditionFailures.push('INJECTION_COMPLIANCE_RESULT field missing from snapshot.');
} else if (!/^COMPLIANT$/i.test(injectionComplianceResult.trim())) {
  preconditionFailures.push('INJECTION_COMPLIANCE_RESULT (' + injectionComplianceResult + ') is not COMPLIANT.');
}
if (!uncheckedRequiredItems) {
  preconditionFailures.push('UNCHECKED_REQUIRED_ITEMS field missing from snapshot.');
} else if (isNonEmptySignal(uncheckedRequiredItems)) {
  preconditionFailures.push('UNCHECKED_REQUIRED_ITEMS (' + uncheckedRequiredItems + ') must be none before handover.');
}
if (!unauthorizedDeviations) {
  preconditionFailures.push('UNAUTHORIZED_DEVIATIONS field missing from snapshot.');
} else if (isNonEmptySignal(unauthorizedDeviations)) {
  preconditionFailures.push('UNAUTHORIZED_DEVIATIONS (' + unauthorizedDeviations + ') must be none before handover.');
}

process.stdout.write(preconditionFailures.length > 0 ? 'true' : 'false');
JSEOF
  )"

  if [[ "$actual" == "$expected_blocked" ]]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected blocked=$expected_blocked got blocked=$actual)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

# 23. Full-ceremony PR with missing INJECTION_COMPLIANCE_RESULT → blocked.
run_injection_compliance_test \
  "23. full-ceremony PR missing INJECTION_COMPLIANCE_RESULT -> blocked" \
  "CURRENT_HEAD_SHA: abc123
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "true"

# 24. Full-ceremony PR with INJECTION_COMPLIANCE_RESULT: STOP_AND_FIX → blocked.
run_injection_compliance_test \
  "24. full-ceremony PR INJECTION_COMPLIANCE_RESULT=STOP_AND_FIX -> blocked" \
  "CURRENT_HEAD_SHA: abc123
INJECTION_COMPLIANCE_RESULT: STOP_AND_FIX
UNCHECKED_REQUIRED_ITEMS: validate affected workflows
UNAUTHORIZED_DEVIATIONS: none
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "true"

# 25. Full-ceremony PR with INJECTION_COMPLIANCE_RESULT: CS2_INTERVENTION_REQUIRED → blocked.
run_injection_compliance_test \
  "25. full-ceremony PR INJECTION_COMPLIANCE_RESULT=CS2_INTERVENTION_REQUIRED -> blocked" \
  "CURRENT_HEAD_SHA: abc123
INJECTION_COMPLIANCE_RESULT: CS2_INTERVENTION_REQUIRED
UNCHECKED_REQUIRED_ITEMS: none
UNAUTHORIZED_DEVIATIONS: none
HANDOVER_ALLOWED: no
RESULT: CS2_INTERVENTION_REQUIRED" \
  "true"

# 26. Full-ceremony PR with UNCHECKED_REQUIRED_ITEMS non-none → blocked even if COMPLIANT.
run_injection_compliance_test \
  "26. full-ceremony PR UNCHECKED_REQUIRED_ITEMS non-none -> blocked" \
  "CURRENT_HEAD_SHA: abc123
INJECTION_COMPLIANCE_RESULT: COMPLIANT
UNCHECKED_REQUIRED_ITEMS: validate deployment workflow runs
UNAUTHORIZED_DEVIATIONS: none
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "true"

# 27. Full-ceremony PR with UNAUTHORIZED_DEVIATIONS non-none → blocked.
run_injection_compliance_test \
  "27. full-ceremony PR UNAUTHORIZED_DEVIATIONS non-none -> blocked" \
  "CURRENT_HEAD_SHA: abc123
INJECTION_COMPLIANCE_RESULT: COMPLIANT
UNCHECKED_REQUIRED_ITEMS: none
UNAUTHORIZED_DEVIATIONS: skipped gate-changing-pr-rule validation
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "true"

# 28. Full-ceremony PR fully compliant → not blocked.
run_injection_compliance_test \
  "28. full-ceremony PR fully compliant INJECTION_COMPLIANCE_RESULT=COMPLIANT -> not blocked" \
  "CURRENT_HEAD_SHA: abc123
INJECTION_COMPLIANCE_RESULT: COMPLIANT
UNCHECKED_REQUIRED_ITEMS: none
UNAUTHORIZED_DEVIATIONS: none
CS2_WAIVERS: none
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "false"

# 29. Missing UNCHECKED_REQUIRED_ITEMS / UNAUTHORIZED_DEVIATIONS remains blocked even with COMPLIANT.
run_injection_compliance_test \
  "29. COMPLIANT without UNCHECKED_REQUIRED_ITEMS/UNAUTHORIZED_DEVIATIONS -> blocked" \
  "CURRENT_HEAD_SHA: abc123
INJECTION_COMPLIANCE_RESULT: COMPLIANT
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "true"

# 30. PR #1647-calibration: checklist items unchecked + no injection compliance → blocked.
# Regression for scenario where: checklist items remain unchecked, affected deployment
# workflows are failing, and agent claims handover without INJECTION_COMPLIANCE_REPORT.
run_injection_compliance_test \
  "30. PR-1647-calibration: incomplete checklist + no injection compliance report -> blocked" \
  "ECAP_GATE_AND_ADMIN_REPORT
CURRENT_HEAD_SHA: deadbeef1234
MERGE_CONFLICT_CHECKED: yes
MERGEABLE_WITH_BASE: yes
BASE_SYNCED_OR_CONFLICTS_RESOLVED: yes
FAILING_CHECKS: none
PENDING_CHECKS: none
MISSING_CHECKS: none
ECAP_REQUIRED: yes
IAA_REQUIRED: yes
HANDOVER_ALLOWED: yes
RESULT: HANDOVER_ALLOWED" \
  "true"

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
