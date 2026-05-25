#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="${SCRIPT_DIR}/post-handover-auto-remediation.js"

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

echo "=== Post-Handover Auto-Remediation Regression ==="

run_case \
  "1. missing active IAA preflight binding -> ADMIN_BINDING_DEFECT" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { ACTIVE_PR_IDENTITY_BINDING: 'FAIL', INJECTION_STATE: 'stale', HANDOVER_ALLOWED: 'no' },
  changedFiles: ['modules/MMM/src/index.ts'],
  manifest: { requires_ecap: true },
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "ADMIN_BINDING_DEFECT"

run_case \
  "2. requires_ecap=false + governance changes -> ADMIN_MANIFEST_DEFECT" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { HANDOVER_ALLOWED: 'no' },
  changedFiles: ['governance/canon/AGENT_HANDOVER_AUTOMATION.md'],
  manifest: { requires_ecap: false },
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "ADMIN_MANIFEST_DEFECT"

run_case \
  "3. gate-changing rule failure -> GATE_CHANGE_EVIDENCE_DEFECT" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { FAILING_CHECKS: 'preflight/gate-changing-pr-rule', HANDOVER_ALLOWED: 'no' },
  changedFiles: ['.github/scripts/iaa-preflight-contract-gate.sh'],
  manifest: { requires_ecap: true },
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "GATE_CHANGE_EVIDENCE_DEFECT"

run_case \
  "4. CodeQL rate limit -> INFRASTRUCTURE_RERUN_NEEDED with rerun action" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { HANDOVER_ALLOWED: 'no', RESULT: 'STOP_AND_FIX' },
  changedFiles: ['modules/MMM/src/index.ts'],
  manifest: { requires_ecap: true },
  checkRuns: [{
    name: 'CodeQL',
    status: 'completed',
    conclusion: 'failure',
    output: { summary: 'GitHub App installation rate limit exceeded for this run.' },
  }],
});
const body = remediation.renderAutoRemediationComment({
  decision,
  headSha: 'abc123',
  cycle: 1,
  escalated: false,
});
process.stdout.write(
  decision.failureClassification === 'INFRASTRUCTURE_RERUN_NEEDED' && body.includes('Rerun only the impacted infrastructure checks')
    ? 'true'
    : 'false'
);
EOF
)" \
  "true"

run_case \
  "5. PR comments API rate-limit -> ADVISORY_UNAVAILABLE" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  advisoryUnavailable: 'comments_api_rate_limited',
  fields: { HANDOVER_ALLOWED: 'no' },
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "ADVISORY_UNAVAILABLE"

run_case \
  "6. all gates green -> READY_FOR_HUMAN_EVALUATION" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: {
    HANDOVER_ALLOWED: 'yes',
    RESULT: 'HANDOVER_ALLOWED',
    FAILING_CHECKS: 'none',
    PENDING_CHECKS: 'none',
    MISSING_CHECKS: 'none',
    IAA_REQUIRED: 'yes',
    IAA_SATISFIED_OR_VALIDLY_WAIVED: 'yes',
    ECAP_REQUIRED: 'yes',
    ECAP_SATISFIED_OR_VALIDLY_WAIVED: 'yes',
    ACTIVE_PR_IDENTITY_BINDING: 'PASS',
  },
  manifest: { requires_ecap: true },
});
const body = remediation.renderAutoRemediationComment({ decision, headSha: 'abc123' });
process.stdout.write(body.includes('READY_FOR_HUMAN_EVALUATION') ? 'true' : 'false');
EOF
)" \
  "true"

run_case \
  "7. three unsuccessful cycles -> AUTO_REMEDIATION_ESCALATED" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const cycle = remediation.resolveRemediationCycle({
  previousStickyBody: '<!-- post-handover-auto-remediation -->\nREMEDIATION_CYCLE: 2/3\nHANDOVER_ACCEPTED: no\nCURRENT_HEAD_SHA: oldhead',
  headSha: 'newhead',
  blocked: true,
});
const body = remediation.renderAutoRemediationComment({
  decision: {
    handoverAccepted: false,
    readyForHumanEvaluation: false,
    failureClassification: 'PR_DEFECT',
    nextRequiredControl: 'FIX_REQUIRED_GATES',
    specificBlocker: 'Required check failing',
    infrastructureRerunNeeded: false,
  },
  headSha: 'newhead',
  cycle: cycle.cycle,
  escalated: cycle.escalated,
});
process.stdout.write(body.includes('AUTO_REMEDIATION_ESCALATED: yes') ? 'true' : 'false');
EOF
)" \
  "true"

run_case \
  "8. same-head sticky update keeps cycle (no duplicate cycle increments)" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const cycle = remediation.resolveRemediationCycle({
  previousStickyBody: '<!-- post-handover-auto-remediation -->\nREMEDIATION_CYCLE: 1/3\nHANDOVER_ACCEPTED: no\nCURRENT_HEAD_SHA: abc123',
  headSha: 'abc123',
  blocked: true,
});
process.stdout.write(String(cycle.cycle));
EOF
)" \
  "1"

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi

