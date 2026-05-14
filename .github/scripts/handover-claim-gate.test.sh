#!/bin/bash
# Regression tests for handover-claim-gate ready_for_review vs explicit handover claim
# distinction (Issue: maturion-isms#1637).
#
# These tests validate the key classification logic in handover-claim-gate.yml:
#   1. ready_for_review only, checks pending, no snapshot  → CHECKPOINT_REQUIRED
#   2. Explicit merge-ready comment, checks pending          → HANDOVER_BLOCKED
#   3. Explicit handover comment, ECAP required but missing  → HANDOVER_BLOCKED
#   4. Explicit handover comment, valid snapshot, all green  → EXPLICIT_CLAIM_DETECTED
#   5. STOP_AND_FIX / CS2_INTERVENTION_REQUIRED comment      → NOT_HANDOVER_CLAIM
#
# The inline Node.js logic mirrors the corresponding detection code in the workflow.
# Tests validate comment classification only (CI state / GitHub API are not exercised here).

set -euo pipefail

PASS=0
FAIL=0

# ── Inline JS that mirrors the handover-claim-gate.yml detection logic ────────
DETECTION_JS='
const GATE_MARKERS = ["<!-- handover-claim-gate-blocked -->", "<!-- handover-claim-gate-ok -->"];
const CHECKPOINT_REQUIRED_MARKER = "<!-- handover-checkpoint-required -->";
const REJECTION_NOTICE_REGEX = /(?:ADMIN_|IAA_|FOREMAN_)?REJECTION_NOTICE/i;
const checkpointTriggerPattern = /^(?:ECAP_)?PRE_HANDOVER_CHECKPOINT(?:\b.*)?$|^\/prepare-handover(?:\b.*)?$/i;
const checkpointResultPattern = /PRE_HANDOVER_CHECKPOINT_RESULT/i;

// Returns true if a comment body is an explicit handover/merge-ready claim.
// Mirrors existingExplicitHandoverClaim detection in handover-claim-gate.yml.
const isExplicitHandoverClaimComment = (body) => {
  if (!body) return false;
  if (GATE_MARKERS.some(m => body.includes(m))) return false;
  if (body.includes(CHECKPOINT_REQUIRED_MARKER)) return false;
  if (checkpointTriggerPattern.test(body.trim()) || checkpointResultPattern.test(body)) return false;
  if (/HANDOVER_BLOCKED|STOP_AND_FIX|CS2_INTERVENTION_REQUIRED/i.test(body)) return false;
  if (REJECTION_NOTICE_REGEX.test(body)) return false;
  return (
    /\bhandover\b/i.test(body) ||
    /merge.?ready|ready.to.merge/i.test(body) ||
    /all.gates.pass|merge.gate.released/i.test(body) ||
    /\bOPOJD\b/i.test(body) ||
    /\bPhase\s+4\b/i.test(body) ||
    /HANDOVER_ALLOWED\s*:\s*yes/i.test(body) ||
    /\b(?:work|implementation)\s+complete\b/i.test(body)
  );
};

// Returns true if an issue_comment body should trigger an early-return (not a handover claim).
// Mirrors the early-return guard at the top of the gate script.
const isCheckpointOrBlockedStatus = (body) => {
  if (!body) return false;
  return (
    checkpointTriggerPattern.test(body.trim()) ||
    checkpointResultPattern.test(body) ||
    /RESULT:\s*STOP_AND_FIX/i.test(body) ||
    /RESULT:\s*CS2_INTERVENTION_REQUIRED/i.test(body) ||
    /HANDOVER_ALLOWED:\s*no/i.test(body)
  );
};

const eventName = process.env.EVENT_NAME || "pull_request_target";
const commentBody = process.env.COMMENT_BODY || "";
const existingComments = JSON.parse(process.env.EXISTING_COMMENTS || "[]");
const isIssueComment = eventName === "issue_comment";

let classification;

if (!isIssueComment) {
  // ready_for_review event
  const hasExplicitClaim = existingComments.some(c => isExplicitHandoverClaimComment(c.body || ""));
  if (!hasExplicitClaim) {
    classification = "CHECKPOINT_REQUIRED";
  } else {
    // Existing explicit claim but no current-head snapshot → gate would BLOCK
    classification = "HANDOVER_BLOCKED";
  }
} else {
  // issue_comment event
  if (isCheckpointOrBlockedStatus(commentBody)) {
    classification = "NOT_HANDOVER_CLAIM";
  } else if (isExplicitHandoverClaimComment(commentBody)) {
    // Gate would proceed to check CI state; classify presence of explicit claim
    classification = "EXPLICIT_CLAIM_DETECTED";
  } else {
    classification = "NOT_HANDOVER_CLAIM";
  }
}

process.stdout.write(classification);
'

# ── Test runner ───────────────────────────────────────────────────────────────
run_gate_classification_test() {
  local name="$1"
  local event_name="$2"
  local comment_body="$3"
  local existing_comments_json="$4"
  local expected_classification="$5"

  local actual
  actual="$(
    EVENT_NAME="$event_name" \
    COMMENT_BODY="$comment_body" \
    EXISTING_COMMENTS="$existing_comments_json" \
    node -e "$DETECTION_JS"
  )"

  if [[ "$actual" == "$expected_classification" ]]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    echo "   expected: $expected_classification"
    echo "   got:      $actual"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Handover Claim Gate — Classification Regression Tests ==="
echo ""
echo "Scenario 1: ready_for_review only, checks pending, no snapshot"

run_gate_classification_test \
  "S1a: bare ready_for_review, no existing comments → CHECKPOINT_REQUIRED" \
  "pull_request_target" \
  "" \
  "[]" \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "S1b: bare ready_for_review, only gate-bot BLOCKED comment exists → CHECKPOINT_REQUIRED (gate-bot not a handover claim)" \
  "pull_request_target" \
  "" \
  '[{"body":"<!-- handover-claim-gate-blocked -->\n## 🚫 HANDOVER BLOCKED\nSome checks failed."}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "S1c: bare ready_for_review, only CHECKPOINT advisory exists → CHECKPOINT_REQUIRED" \
  "pull_request_target" \
  "" \
  '[{"body":"<!-- handover-checkpoint-required -->\n## ⏸️ CHECKPOINT REQUIRED"}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "S1d: bare ready_for_review, STOP_AND_FIX comment only → CHECKPOINT_REQUIRED (blocked status not a handover claim)" \
  "pull_request_target" \
  "" \
  '[{"body":"RESULT: STOP_AND_FIX\nPENDING_CHECKS: preflight/scope-declaration-parity"}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "S1e: bare ready_for_review, REJECTION_NOTICE comment only → CHECKPOINT_REQUIRED" \
  "pull_request_target" \
  "" \
  '[{"body":"REJECTION_NOTICE: missing ECAP evidence"}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "S1f: bare ready_for_review, PRE_HANDOVER_CHECKPOINT_RESULT comment only → CHECKPOINT_REQUIRED (checkpoint result not a handover claim)" \
  "pull_request_target" \
  "" \
  '[{"body":"PRE_HANDOVER_CHECKPOINT_RESULT\nHANDOVER_ALLOWED: no\nRESULT: STOP_AND_FIX"}]' \
  "CHECKPOINT_REQUIRED"

echo ""
echo "Scenario 2: Explicit merge-ready comment, checks pending → gate would BLOCK"

run_gate_classification_test \
  "S2a: ready_for_review, existing 'merge-ready' comment → HANDOVER_BLOCKED" \
  "pull_request_target" \
  "" \
  '[{"body":"merge-ready: all work complete, please merge"}]' \
  "HANDOVER_BLOCKED"

run_gate_classification_test \
  "S2b: ready_for_review, existing 'ready to merge' comment → HANDOVER_BLOCKED" \
  "pull_request_target" \
  "" \
  '[{"body":"The PR is ready to merge. All changes verified."}]' \
  "HANDOVER_BLOCKED"

run_gate_classification_test \
  "S2c: issue_comment 'merge-ready' body → EXPLICIT_CLAIM_DETECTED" \
  "issue_comment" \
  "merge-ready: snapshot attached, all checks green" \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED"

echo ""
echo "Scenario 3: Explicit handover comment, ECAP required but missing → gate would BLOCK"

run_gate_classification_test \
  "S3a: issue_comment 'handover complete' → EXPLICIT_CLAIM_DETECTED" \
  "issue_comment" \
  "handover complete — ECAP bundle committed, snapshot below" \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED"

run_gate_classification_test \
  "S3b: ready_for_review, existing 'handover' comment → HANDOVER_BLOCKED (gate enforces full check)" \
  "pull_request_target" \
  "" \
  '[{"body":"handover complete — all checks green per local run"}]' \
  "HANDOVER_BLOCKED"

run_gate_classification_test \
  "S3c: ready_for_review, existing 'HANDOVER_ALLOWED: yes' comment → HANDOVER_BLOCKED (explicit claim)" \
  "pull_request_target" \
  "" \
  '[{"body":"HANDOVER_ALLOWED: yes\nRESULT: HANDOVER_ALLOWED\nECAP_REQUIRED: yes\nECAP_ARTIFACT_PRESENT: yes"}]' \
  "HANDOVER_BLOCKED"

echo ""
echo "Scenario 4: Explicit handover comment, valid snapshot, all checks green"
echo "  (CI state not testable here; EXPLICIT_CLAIM_DETECTED means gate will proceed to CI check)"

run_gate_classification_test \
  "S4a: issue_comment with OPOJD keyword → EXPLICIT_CLAIM_DETECTED" \
  "issue_comment" \
  "OPOJD: all gates pass. Snapshot attached below." \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED"

run_gate_classification_test \
  "S4b: issue_comment with 'merge gate released' → EXPLICIT_CLAIM_DETECTED" \
  "issue_comment" \
  "Merge gate released. Wave 9 complete." \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED"

run_gate_classification_test \
  "S4c: issue_comment with 'work complete' → EXPLICIT_CLAIM_DETECTED" \
  "issue_comment" \
  "implementation complete — all required artifacts committed" \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED"

echo ""
echo "Scenario 5: STOP_AND_FIX / CS2_INTERVENTION_REQUIRED → not treated as handover claim"

run_gate_classification_test \
  "S5a: issue_comment 'RESULT: STOP_AND_FIX' → NOT_HANDOVER_CLAIM (early return)" \
  "issue_comment" \
  "RESULT: STOP_AND_FIX\nFAILING_CHECKS: preflight/ecap-admin-ceremony\nHANDOVER_ALLOWED: no" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

run_gate_classification_test \
  "S5b: issue_comment 'RESULT: CS2_INTERVENTION_REQUIRED' → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "RESULT: CS2_INTERVENTION_REQUIRED\nOUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER: protected branch policy\nHANDOVER_ALLOWED: no" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

run_gate_classification_test \
  "S5c: issue_comment 'HANDOVER_ALLOWED: no' → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "HANDOVER_ALLOWED: no\nRESULT: STOP_AND_FIX" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

run_gate_classification_test \
  "S5d: issue_comment PRE_HANDOVER_CHECKPOINT trigger → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "PRE_HANDOVER_CHECKPOINT" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

run_gate_classification_test \
  "S5e: issue_comment ECAP_PRE_HANDOVER_CHECKPOINT trigger → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "ECAP_PRE_HANDOVER_CHECKPOINT" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

run_gate_classification_test \
  "S5f: issue_comment /prepare-handover trigger → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "/prepare-handover" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

echo ""
echo "Additional edge cases"

run_gate_classification_test \
  "E1: ready_for_review, existing 'Phase 4' comment → HANDOVER_BLOCKED (Foreman governance signal)" \
  "pull_request_target" \
  "" \
  '[{"body":"Phase 4 — handover complete. Awaiting CS2 review."}]' \
  "HANDOVER_BLOCKED"

run_gate_classification_test \
  "E2: ready_for_review, existing gate-bot OK comment → CHECKPOINT_REQUIRED (gate-bot not a handover claim)" \
  "pull_request_target" \
  "" \
  '[{"body":"<!-- handover-claim-gate-ok -->\n## ✅ HANDOVER CLAIM ACKNOWLEDGED"}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "E3: issue_comment 'PRE_HANDOVER_CHECKPOINT_RESULT' body → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "PRE_HANDOVER_CHECKPOINT_RESULT\nHANDOVER_ALLOWED: yes\nRESULT: HANDOVER_ALLOWED" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

run_gate_classification_test \
  "E4: ready_for_review, existing PRE_HANDOVER_CHECKPOINT_RESULT (no handover keywords) → CHECKPOINT_REQUIRED" \
  "pull_request_target" \
  "" \
  '[{"body":"PRE_HANDOVER_CHECKPOINT_RESULT\nHANDOVER_ALLOWED: yes\nRESULT: HANDOVER_ALLOWED"}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "E5: issue_comment FOREMAN_REJECTION_NOTICE → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "FOREMAN_REJECTION_NOTICE: missing ECAP bundle at expected path" \
  "[]" \
  "NOT_HANDOVER_CLAIM"

echo ""
echo "=== Results: ${PASS} passed, ${FAIL} failed ==="

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
