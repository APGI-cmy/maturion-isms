#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTENT_SCRIPT="${SCRIPT_DIR}/handover-intent.js"
GUIDANCE_SCRIPT="${SCRIPT_DIR}/producer-next-action-guidance.js"

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

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
