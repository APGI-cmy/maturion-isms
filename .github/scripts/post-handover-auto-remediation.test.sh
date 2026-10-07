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

# ── GOV-2064-T2 regressions ───────────────────────────────────────────────────
# RCA: .agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-2065.md
# CS2 handback (PR #2065 comment 5993621656): no ADMIN_MANIFEST_DEFECT solely
# because a legacy PR has no manifest, while genuine manifest defects must
# still be flagged.

run_case \
  "9. legacy/no-manifest PR with ADMIN_MANIFEST_APPLICABLE=no -> not ADMIN_MANIFEST_DEFECT" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
// NOTE: HANDOVER_ALLOWED must be 'no' here (not 'yes') — classifyPostHandover()
// short-circuits to the "allGreen" success path before ever reaching the
// manifest-defect branch when HANDOVER_ALLOWED is 'yes', which would make this
// test pass vacuously regardless of whether the GOV-2064-T2 fix is present.
// This was caught and corrected via a temporarily-reintroduced-bug proof: with
// the pre-fix condition (`!manifest` alone, ignoring manifestApplicable)
// restored, this exact fixture returns ADMIN_MANIFEST_DEFECT; with the fix in
// place it falls through to AMBIGUOUS_ESCALATE instead.
const decision = remediation.classifyPostHandover({
  fields: {
    HANDOVER_ALLOWED: 'no',
    ADMIN_MANIFEST_APPLICABLE: 'no',
  },
  changedFiles: ['docs/some-note.md'],
  manifest: null,
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "AMBIGUOUS_ESCALATE"

run_case \
  "10. no-manifest PR with ADMIN_MANIFEST_APPLICABLE absent (default) -> still ADMIN_MANIFEST_DEFECT (strict default preserved)" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { HANDOVER_ALLOWED: 'no' },
  changedFiles: ['docs/some-note.md'],
  manifest: null,
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "ADMIN_MANIFEST_DEFECT"

run_case \
  "11. no-manifest PR with ADMIN_MANIFEST_APPLICABLE=yes (manifest genuinely required) -> still ADMIN_MANIFEST_DEFECT" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { HANDOVER_ALLOWED: 'no', ADMIN_MANIFEST_APPLICABLE: 'yes' },
  changedFiles: ['governance/canon/SOME_CANON.md'],
  manifest: null,
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "ADMIN_MANIFEST_DEFECT"

run_case \
  "12. ADMIN_MANIFEST_APPLICABLE=no does NOT suppress a genuine requires_ecap=false + governance-change defect" \
  "$(node - "$SCRIPT" <<'EOF'
const remediation = require(process.argv[2]);
const decision = remediation.classifyPostHandover({
  fields: { HANDOVER_ALLOWED: 'no', ADMIN_MANIFEST_APPLICABLE: 'no' },
  changedFiles: ['governance/canon/AGENT_HANDOVER_AUTOMATION.md'],
  manifest: { requires_ecap: false },
});
process.stdout.write(decision.failureClassification);
EOF
)" \
  "ADMIN_MANIFEST_DEFECT"

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi

