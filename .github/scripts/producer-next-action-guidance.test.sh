#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTENT_SCRIPT="${SCRIPT_DIR}/handover-intent.js"
GUIDANCE_SCRIPT="${SCRIPT_DIR}/producer-next-action-guidance.js"
CHECKPOINT_SCRIPT="${SCRIPT_DIR}/pre-handover-checkpoint.js"

PASS=0
FAIL=0

run_case() {
  local name="$1"
  local actual="$2"
  local expected="$3"

  if [[ "$actual" == "$expected" ]]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    echo "   expected: $expected"
    echo "   got:      $actual"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Producer Next Action Guidance Regression ==="

run_case \
  "1. final summary comment is selected for guidance refresh" \
  "$(BODY='Final summary: current head is ready once ceremony clears.' node - "$INTENT_SCRIPT" <<'EOF'
const intent = require(process.argv[2]);
process.stdout.write(intent.shouldProcessProducerGuidanceIssueComment(process.env.BODY || '') ? 'true' : 'false');
EOF
)" \
  "true"

run_case \
  "2. /prepare-handover comment is selected for guidance refresh" \
  "$(BODY='/prepare-handover' node - "$INTENT_SCRIPT" <<'EOF'
const intent = require(process.argv[2]);
process.stdout.write(intent.shouldProcessProducerGuidanceIssueComment(process.env.BODY || '') ? 'true' : 'false');
EOF
)" \
  "true"

run_case \
  "3. ordinary status note does not trigger guidance refresh" \
  "$(BODY='status update only' node - "$INTENT_SCRIPT" <<'EOF'
const intent = require(process.argv[2]);
process.stdout.write(intent.shouldProcessProducerGuidanceIssueComment(process.env.BODY || '') ? 'true' : 'false');
EOF
)" \
  "false"

blocked_render="$(node - "$GUIDANCE_SCRIPT" <<'EOF'
const guidance = require(process.argv[2]);
process.stdout.write(guidance.renderGuidanceComment({
  prNumber: 1719,
  headSha: '1234567890abcdef',
  fields: {
    HANDOVER_ALLOWED: 'no',
    NEXT_REQUIRED_CONTROL: 'CURRENT_HEAD_GATES_GREEN',
    INJECTION_STATE: 'current',
    FAILING_CHECKS: 'preflight/injection-intake-current',
    PENDING_CHECKS: 'none',
    MISSING_CHECKS: 'none',
    RESULT: 'STOP_AND_FIX',
    REASON: 'Current head still has failing checks.',
  },
}));
EOF
)"

run_case \
  "4. blocked guidance render carries sticky marker" \
  "$(printf '%s' "$blocked_render" | grep -c '<!-- producer-next-action-shortfall -->' || true)" \
  "1"

run_case \
  "5. blocked guidance render includes next required control" \
  "$(printf '%s' "$blocked_render" | grep -c 'NEXT_REQUIRED_CONTROL: CURRENT_HEAD_GATES_GREEN' || true)" \
  "1"

run_case \
  "6. blocked guidance render reminds producer to run /prepare-handover" \
  "$(printf '%s' "$blocked_render" | grep -c '/prepare-handover' || true)" \
  "1"

clean_render="$(node - "$GUIDANCE_SCRIPT" <<'EOF'
const guidance = require(process.argv[2]);
process.stdout.write(guidance.renderGuidanceComment({
  prNumber: 1719,
  headSha: 'abcdef1234567890',
  fields: {
    HANDOVER_ALLOWED: 'yes',
    NEXT_REQUIRED_CONTROL: 'none',
    INJECTION_STATE: 'current',
    FAILING_CHECKS: 'none',
    PENDING_CHECKS: 'none',
    MISSING_CHECKS: 'none',
    RESULT: 'HANDOVER_ALLOWED',
  },
}));
EOF
)"

run_case \
  "7. clean guidance render flips final summary posture to yes" \
  "$(printf '%s' "$clean_render" | grep -c 'FINAL_SUMMARY_ALLOWED: yes' || true)" \
  "1"

run_case \
  "8. clean guidance render flips handover posture to yes" \
  "$(printf '%s' "$clean_render" | grep -c 'HANDOVER_CLAIM_ALLOWED: yes' || true)" \
  "1"

# ── Advisory-only regression tests (issue requirements) ──────────────────────

# 9. HANDOVER_ALLOWED: no → renders "action still required" title
run_case \
  "9. HANDOVER_ALLOWED: no renders advisory title 'action still required'" \
  "$(node - "$GUIDANCE_SCRIPT" <<'EOF'
const guidance = require(process.argv[2]);
const out = guidance.renderGuidanceComment({
  prNumber: 1733,
  headSha: 'aabbccdd1234',
  fields: { HANDOVER_ALLOWED: 'no', NEXT_REQUIRED_CONTROL: 'CURRENT_HEAD_GATES_GREEN' },
});
process.stdout.write(out.includes('action still required') ? 'true' : 'false');
EOF
)" \
  "true"

# 10. pending checks → summarizeChecks shows "pending: ..." in advisory comment
run_case \
  "10. pending checks render advisory guidance (summarizeChecks includes 'pending')" \
  "$(node - "$GUIDANCE_SCRIPT" <<'EOF'
const guidance = require(process.argv[2]);
const summary = guidance.summarizeChecks({
  FAILING_CHECKS: 'none',
  PENDING_CHECKS: 'preflight/evidence-exactness',
  MISSING_CHECKS: 'none',
});
process.stdout.write(summary.includes('pending:') ? 'true' : 'false');
EOF
)" \
  "true"

# 11. missing checks → summarizeChecks shows "missing: ..." in advisory comment
run_case \
  "11. missing checks render advisory guidance (summarizeChecks includes 'missing')" \
  "$(node - "$GUIDANCE_SCRIPT" <<'EOF'
const guidance = require(process.argv[2]);
const summary = guidance.summarizeChecks({
  FAILING_CHECKS: 'none',
  PENDING_CHECKS: 'none',
  MISSING_CHECKS: 'preflight/iaa-final-assurance',
});
process.stdout.write(summary.includes('missing:') ? 'true' : 'false');
EOF
)" \
  "true"

# 12. NEXT_REQUIRED_CONTROL != none → guidance includes the action sentence
run_case \
  "12. NEXT_REQUIRED_CONTROL != none renders guidance sentence in comment" \
  "$(node - "$GUIDANCE_SCRIPT" <<'EOF'
const guidance = require(process.argv[2]);
const out = guidance.renderGuidanceComment({
  prNumber: 1733,
  headSha: 'aabbccdd1234',
  fields: {
    HANDOVER_ALLOWED: 'no',
    NEXT_REQUIRED_CONTROL: 'ECAP_GATE_AND_ADMIN_REPORT',
    INJECTION_STATE: 'current',
    FAILING_CHECKS: 'none',
    PENDING_CHECKS: 'none',
    MISSING_CHECKS: 'none',
    RESULT: 'STOP_AND_FIX',
  },
});
// Must include the ECAP guidance sentence (defined in NEXT_ACTION_GUIDANCE map)
process.stdout.write(out.includes('ECAP_GATE_AND_ADMIN_REPORT') ? 'true' : 'false');
EOF
)" \
  "true"

# 13. Invalid checkpoint JSON → pre-handover-checkpoint.js exits non-zero (internal error fails workflow)
_invalid_json_file="$(mktemp)"
printf 'this is not valid json\n' > "$_invalid_json_file"
_invalid_exit=0
CHECKPOINT_REPO_FILES_PATH="$_invalid_json_file" node "$CHECKPOINT_SCRIPT" > /dev/null 2>&1 || _invalid_exit=$?
rm -f "$_invalid_json_file"
run_case \
  "13. invalid checkpoint JSON causes pre-handover-checkpoint to exit non-zero" \
  "$_invalid_exit" \
  "1"

# 14. Resolver-selected active-state prevents ACTIVE_PR_IDENTITY_BINDING: FAIL
#     from historical artifacts of other PRs present in the virtual file snapshot.
_repo_files_temp="$(mktemp)"
node -e "
process.stdout.write(JSON.stringify({
  '.agent-admin/prehandover/proof-pr-1733-current.md': 'PR: #1733\nHANDOVER_ALLOWED: yes\n',
  '.agent-admin/prehandover/proof-pr-1111-old.md':     'PR: #1111\nHANDOVER_ALLOWED: yes\n',
  '.agent-admin/prehandover/proof-pr-2222-old.md':     'PR: #2222\nHANDOVER_ALLOWED: yes\n',
}));
" > "$_repo_files_temp"

_resolver_binding="$(
  CHECKPOINT_REPO_FILES_PATH="$_repo_files_temp" \
  ACTIVE_STATE_JSON='{"ecap_artifact_path":".agent-admin/prehandover/proof-pr-1733-current.md"}' \
  PR_NUMBER=1733 \
  HEAD_SHA=abc123def456 \
  CHECKPOINT_INTAKE_ONLY=true \
  node "$CHECKPOINT_SCRIPT" 2>/dev/null \
  | node -e "
    let d = '';
    process.stdin.on('data', c => { d += c; });
    process.stdin.on('end', () => {
      try { process.stdout.write(JSON.parse(d).fields.ACTIVE_PR_IDENTITY_BINDING || 'UNKNOWN'); }
      catch (e) { process.stdout.write('PARSE_ERROR'); }
    });
  "
)"
rm -f "$_repo_files_temp"

run_case \
  "14. resolver-selected active-state prevents ACTIVE_PR_IDENTITY_BINDING: FAIL from historical artifacts" \
  "$_resolver_binding" \
  "PASS"

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
