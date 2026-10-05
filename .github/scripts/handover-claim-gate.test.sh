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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS=0
FAIL=0
INTENT_SCRIPT="${SCRIPT_DIR}/handover-intent.js"

# ── Inline JS that mirrors the handover-claim-gate.yml detection logic ────────
DETECTION_JS='
const handoverIntent = require(process.env.INTENT_SCRIPT);
const GATE_MARKERS = ["<!-- handover-claim-gate-blocked -->", "<!-- handover-claim-gate-ok -->"];
const CHECKPOINT_REQUIRED_MARKER = "<!-- handover-checkpoint-required -->";
// GOV-2064-T2: CS2 (apgi-cmy) is the overseer/approver, never the producer. A
// factual CS2 status/checkpoint request must never be read as the producers
// own explicit handover/completion claim, regardless of wording. Mirrors
// .github/workflows/handover-claim-gate.yml CS2_LOGIN / isCs2AuthoredComment.
const CS2_LOGIN = "apgi-cmy";

const isExplicitHandoverClaimComment = (body, authorLogin) => {
  if (!body) return false;
  if (GATE_MARKERS.some(m => body.includes(m))) return false;
  if (body.includes(CHECKPOINT_REQUIRED_MARKER)) return false;
  if (String(authorLogin || "").toLowerCase() === CS2_LOGIN) return false;
  return handoverIntent.isExplicitHandoverClaimComment(body);
};

const isCheckpointOrBlockedStatus = (body) => {
  if (!body) return false;
  return (
    handoverIntent.isCheckpointTriggerComment(body) ||
    handoverIntent.isCheckpointResultComment(body) ||
    handoverIntent.isFailedGateSignalComment(body)
  );
};

const eventName = process.env.EVENT_NAME || "pull_request_target";
const commentBody = process.env.COMMENT_BODY || "";
const commentAuthor = process.env.COMMENT_AUTHOR || "";
const existingComments = JSON.parse(process.env.EXISTING_COMMENTS || "[]");
const isIssueComment = eventName === "issue_comment";
const isCs2AuthoredComment = isIssueComment && String(commentAuthor).toLowerCase() === CS2_LOGIN;

let classification;

if (!isIssueComment) {
  // ready_for_review event
  const hasExplicitClaim = existingComments.some(c => isExplicitHandoverClaimComment(c.body || "", c.author || ""));
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
  } else if (isCs2AuthoredComment) {
    // GOV-2064-T2: factual CS2 status/checkpoint request is never a producer claim.
    classification = "NOT_HANDOVER_CLAIM";
  } else if (isExplicitHandoverClaimComment(commentBody, commentAuthor)) {
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
  local comment_author="${6:-}"

  local actual
  actual="$(
    INTENT_SCRIPT="$INTENT_SCRIPT" \
    EVENT_NAME="$event_name" \
    COMMENT_BODY="$comment_body" \
    COMMENT_AUTHOR="$comment_author" \
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
  "S3a: issue_comment 'handover-ready' → EXPLICIT_CLAIM_DETECTED" \
  "issue_comment" \
  "handover-ready — ECAP bundle committed, snapshot below" \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED"

run_gate_classification_test \
  "S3b: ready_for_review, existing 'handover-ready' comment → HANDOVER_BLOCKED (gate enforces full check)" \
  "pull_request_target" \
  "" \
  '[{"body":"handover-ready — all checks green per local run"}]' \
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
echo "Scenario 7 (GOV-2064-T2 bullet d): CS2 status/checkpoint request is never a producer completion claim"

run_gate_classification_test \
  "T2-D1: issue_comment, CS2-authored, claim-like wording ('merge-ready, is this handover complete?') → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "merge-ready — is this handover complete? Please confirm current status." \
  "[]" \
  "NOT_HANDOVER_CLAIM" \
  "apgi-cmy"

run_gate_classification_test \
  "T2-D2: issue_comment, CS2-authored (mixed case login), explicit claim wording → NOT_HANDOVER_CLAIM" \
  "issue_comment" \
  "handover-ready — all checks green, ready to merge" \
  "[]" \
  "NOT_HANDOVER_CLAIM" \
  "APGI-CMY"

run_gate_classification_test \
  "T2-D3 (control): identical claim wording from a NON-CS2 (producer) author → EXPLICIT_CLAIM_DETECTED (no blanket weakening)" \
  "issue_comment" \
  "merge-ready — is this handover complete? Please confirm current status." \
  "[]" \
  "EXPLICIT_CLAIM_DETECTED" \
  "some-producer-bot"

run_gate_classification_test \
  "T2-D4: ready_for_review, only a CS2-authored prior comment with claim-like wording exists → CHECKPOINT_REQUIRED (not read back as producer's own prior claim)" \
  "pull_request_target" \
  "" \
  '[{"body":"merge-ready: is this PR done yet? status check.","author":"apgi-cmy"}]' \
  "CHECKPOINT_REQUIRED"

run_gate_classification_test \
  "T2-D5 (control): ready_for_review, identical wording from a non-CS2 prior comment → HANDOVER_BLOCKED (producer's own claim still enforced)" \
  "pull_request_target" \
  "" \
  '[{"body":"merge-ready: is this PR done yet? status check.","author":"some-producer-bot"}]' \
  "HANDOVER_BLOCKED"

# ── Protected-path ECAP classification tests ─────────────────────────────────
# These tests validate the inline protected-path detection logic that mirrors
# the workflow's PROTECTED_PATH_PATTERNS and ECAP evidence detection.

PROTECTED_PATH_JS='
const PROTECTED_PATH_PATTERNS = [
  /^governance\/templates\//,
  /^governance\/checklists\//,
  /^governance\/canon\//,
  /^\.github\/agents\//,
  /^governance\/CANON_INVENTORY\.json$/,
];
const prFilenames = JSON.parse(process.env.PR_FILES || "[]");
const requiresEcap = process.env.REQUIRES_ECAP !== "false";

const protectedFilesChanged = prFilenames.filter(f =>
  PROTECTED_PATH_PATTERNS.some(p => p.test(f))
);
const hasProtectedPaths = protectedFilesChanged.length > 0;

const prehandoverProofPresent = prFilenames.some(f =>
  /^\.agent-admin\/prehandover\/proof-.*\.md$/.test(f) ||
  /^\.agent-workspace\/foreman-v2\/memory\/PREHANDOVER-.*\.md$/.test(f)
);
const ecapBundlePresent = prFilenames.some(f =>
  /^\.agent-workspace\/execution-ceremony-admin-agent\/bundles\/PREHANDOVER-.*\.md$/.test(f)
);
const ecapArtifactPresent = prehandoverProofPresent && ecapBundlePresent;
const ecapRequiredForAdvisory = hasProtectedPaths || requiresEcap;
const ecapEvidenceMissing = ecapRequiredForAdvisory && !ecapArtifactPresent;

const result = {
  hasProtectedPaths,
  ecapRequiredForAdvisory,
  ecapArtifactPresent,
  prehandoverProofPresent,
  ecapBundlePresent,
  ecapEvidenceMissing,
  advisoryResult: ecapEvidenceMissing ? "STOP_AND_FIX" : "CHECKPOINT_REQUIRED",
};
process.stdout.write(JSON.stringify(result));
'

run_protected_path_test() {
  local name="$1"
  local pr_files_json="$2"
  local requires_ecap="$3"
  local expected_protected="$4"
  local expected_ecap_required="$5"
  local expected_evidence_missing="$6"
  local expected_result="$7"

  local output actual_protected actual_ecap_required actual_evidence_missing actual_result
  output="$(
    PR_FILES="$pr_files_json" \
    REQUIRES_ECAP="$requires_ecap" \
    node -e "$PROTECTED_PATH_JS"
  )"

  actual_protected="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(JSON.parse(d).hasProtectedPaths ? "yes" : "no"))')"
  actual_ecap_required="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(JSON.parse(d).ecapRequiredForAdvisory ? "yes" : "no"))')"
  actual_evidence_missing="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(JSON.parse(d).ecapEvidenceMissing ? "yes" : "no"))')"
  actual_result="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(JSON.parse(d).advisoryResult))')"

  if [[ "$actual_protected" == "$expected_protected" && \
        "$actual_ecap_required" == "$expected_ecap_required" && \
        "$actual_evidence_missing" == "$expected_evidence_missing" && \
        "$actual_result" == "$expected_result" ]]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    echo "   protected=$actual_protected (expected $expected_protected)"
    echo "   ecap_required=$actual_ecap_required (expected $expected_ecap_required)"
    echo "   evidence_missing=$actual_evidence_missing (expected $expected_evidence_missing)"
    echo "   result=$actual_result (expected $expected_result)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "Scenario 6: Protected-path ECAP classification"

run_protected_path_test \
  "P1: governance/templates file, no ECAP evidence → STOP_AND_FIX" \
  '["governance/templates/execution-ceremony-admin/PREHANDOVER.template.md", "README.md"]' \
  "true" \
  "yes" "yes" "yes" "STOP_AND_FIX"

run_protected_path_test \
  "P2: governance/checklists file, no ECAP evidence → STOP_AND_FIX" \
  '["governance/checklists/phase4-role-separation-operational-guidance.md"]' \
  "true" \
  "yes" "yes" "yes" "STOP_AND_FIX"

run_protected_path_test \
  "P3: governance/canon file, no ECAP evidence → STOP_AND_FIX" \
  '["governance/canon/LIVING_AGENT_SYSTEM.md"]' \
  "true" \
  "yes" "yes" "yes" "STOP_AND_FIX"

run_protected_path_test \
  "P4: .github/agents file, no ECAP evidence → STOP_AND_FIX" \
  '[".github/agents/foreman-v2-agent.md"]' \
  "true" \
  "yes" "yes" "yes" "STOP_AND_FIX"

run_protected_path_test \
  "P5: governance/CANON_INVENTORY.json, no ECAP evidence → STOP_AND_FIX" \
  '["governance/CANON_INVENTORY.json"]' \
  "true" \
  "yes" "yes" "yes" "STOP_AND_FIX"

run_protected_path_test \
  "P6: non-protected files, ECAP not required by manifest → no STOP_AND_FIX" \
  '[".github/workflows/handover-claim-gate.yml", ".github/scripts/handover-claim-gate.test.sh"]' \
  "false" \
  "no" "no" "no" "CHECKPOINT_REQUIRED"

run_protected_path_test \
  "P7: protected path + proof present but no bundle → still evidence missing (both required)" \
  '["governance/templates/foo.md", ".agent-admin/prehandover/proof-pr-9999-test.md"]' \
  "true" \
  "yes" "yes" "yes" "STOP_AND_FIX"

run_protected_path_test \
  "P8: protected path + both proof and bundle present → evidence present, CHECKPOINT_REQUIRED" \
  '["governance/templates/foo.md", ".agent-admin/prehandover/proof-pr-9999-test.md", ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-9999-test.md"]' \
  "true" \
  "yes" "yes" "no" "CHECKPOINT_REQUIRED"

run_protected_path_test \
  "P9: no protected paths, ECAP not required, no evidence → no STOP_AND_FIX" \
  '[".github/workflows/handover-claim-gate.yml"]' \
  "false" \
  "no" "no" "no" "CHECKPOINT_REQUIRED"

run_protected_path_test \
  "P10: foreman PREHANDOVER memory file counts as proof evidence" \
  '["governance/canon/ECOSYSTEM_VOCABULARY.md", ".agent-workspace/foreman-v2/memory/PREHANDOVER-session-058-wave9.1-20260514.md", ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-9999-test.md"]' \
  "true" \
  "yes" "yes" "no" "CHECKPOINT_REQUIRED"

# ── Required-checks class-scoping tests (GOV-2064-T2 bullet b) ───────────────
# Mirrors .github/workflows/handover-claim-gate.yml's REQUIRED_CHECKS /
# IAA_SCOPED_CHECKS / ECAP_SCOPED_CHECKS / applicableRequiredChecks logic:
# the canonical REQUIRED_CHECKS catalog (and its length, used for
# REQUIRED_CHECKS_TOTAL reconciliation) is untouched, but a check that this
# PR's resolved class does not require (requires_iaa=false / requires_ecap=false)
# must not be inventoried as "missing" purely because an absent legacy
# manifest would otherwise default to requiring everything.
CHECKS_SCOPE_JS='
const REQUIRED_CHECKS = [
  "preflight/phase-1-evidence",
  "preflight/admin-control-router",
  "preflight/iaa-prebrief-existence",
  "preflight/iaa-token-self-certification",
  "preflight/hfmc-ripple-presence",
  "preflight/evidence-exactness",
  "preflight/iaa-final-assurance",
  "preflight/ecap-admin-ceremony",
  "preflight/scope-declaration-parity",
  "preflight/mmm-pr-admin",
  "preflight/product-delivery-gates",
  "preflight/gate-changing-pr-rule",
];
const IAA_SCOPED_CHECKS = new Set([
  "preflight/iaa-prebrief-existence",
  "preflight/iaa-token-self-certification",
  "preflight/iaa-final-assurance",
]);
const ECAP_SCOPED_CHECKS = new Set([
  "preflight/ecap-admin-ceremony",
]);
const requiresIaa = process.env.REQUIRES_IAA === "true";
const requiresEcap = process.env.REQUIRES_ECAP === "true";
const observedNames = new Set(JSON.parse(process.env.OBSERVED_CHECKS || "[]"));

const applicableRequiredChecks = REQUIRED_CHECKS.filter((name) => {
  if (IAA_SCOPED_CHECKS.has(name)) return requiresIaa;
  if (ECAP_SCOPED_CHECKS.has(name)) return requiresEcap;
  return true;
});
const missing = applicableRequiredChecks.filter((req) => !observedNames.has(req));

process.stdout.write(JSON.stringify({
  requiredChecksTotal: REQUIRED_CHECKS.length,
  applicableCount: applicableRequiredChecks.length,
  missing,
}));
'

run_required_checks_scope_test() {
  local name="$1"
  local requires_iaa="$2"
  local requires_ecap="$3"
  local observed_checks_json="$4"
  local expected_required_checks_total="$5"
  local expected_applicable_count="$6"
  local expected_missing_json="$7"

  local output actual_total actual_applicable actual_missing
  output="$(
    REQUIRES_IAA="$requires_iaa" \
    REQUIRES_ECAP="$requires_ecap" \
    OBSERVED_CHECKS="$observed_checks_json" \
    node -e "$CHECKS_SCOPE_JS"
  )"

  actual_total="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(String(JSON.parse(d).requiredChecksTotal)))')"
  actual_applicable="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(String(JSON.parse(d).applicableCount)))')"
  actual_missing="$(printf '%s' "$output" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>process.stdout.write(JSON.stringify(JSON.parse(d).missing)))')"

  if [[ "$actual_total" == "$expected_required_checks_total" && \
        "$actual_applicable" == "$expected_applicable_count" && \
        "$actual_missing" == "$expected_missing_json" ]]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    echo "   requiredChecksTotal=$actual_total (expected $expected_required_checks_total)"
    echo "   applicableCount=$actual_applicable (expected $expected_applicable_count)"
    echo "   missing=$actual_missing (expected $expected_missing_json)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "Scenario 8 (GOV-2064-T2 bullet b): required-check derivation is class-scoped, not unconditional-default-to-all"

run_required_checks_scope_test \
  "T2-B1: legacy/no-manifest, product-only class (requires_iaa=false, requires_ecap=false), no IAA/ECAP checks observed → NOT missing (class doesn't require them)" \
  "false" "false" \
  '["preflight/phase-1-evidence","preflight/admin-control-router","preflight/hfmc-ripple-presence","preflight/evidence-exactness","preflight/scope-declaration-parity","preflight/mmm-pr-admin","preflight/product-delivery-gates","preflight/gate-changing-pr-rule"]' \
  "12" "8" "[]"

run_required_checks_scope_test \
  "T2-B2 (control): legacy PR that DOES touch governance-control paths (requires_iaa=true, requires_ecap=true), IAA/ECAP checks absent → correctly flagged missing (genuine requirement still enforced)" \
  "true" "true" \
  '["preflight/phase-1-evidence","preflight/admin-control-router","preflight/hfmc-ripple-presence","preflight/evidence-exactness","preflight/scope-declaration-parity","preflight/mmm-pr-admin","preflight/product-delivery-gates","preflight/gate-changing-pr-rule"]' \
  "12" "12" '["preflight/iaa-prebrief-existence","preflight/iaa-token-self-certification","preflight/iaa-final-assurance","preflight/ecap-admin-ceremony"]'

run_required_checks_scope_test \
  "T2-B3: requires_iaa=false but requires_ecap=true (mixed class) — only ECAP check enforced, IAA checks excluded from applicable set" \
  "false" "true" \
  '["preflight/phase-1-evidence","preflight/admin-control-router","preflight/hfmc-ripple-presence","preflight/evidence-exactness","preflight/scope-declaration-parity","preflight/mmm-pr-admin","preflight/product-delivery-gates","preflight/gate-changing-pr-rule"]' \
  "12" "9" '["preflight/ecap-admin-ceremony"]'

run_required_checks_scope_test \
  "T2-B4: REQUIRED_CHECKS_TOTAL (canonical catalog length) is unaffected by class — always 12 regardless of requires_iaa/requires_ecap" \
  "false" "false" \
  '[]' \
  "12" "8" '["preflight/phase-1-evidence","preflight/admin-control-router","preflight/hfmc-ripple-presence","preflight/evidence-exactness","preflight/scope-declaration-parity","preflight/mmm-pr-admin","preflight/product-delivery-gates","preflight/gate-changing-pr-rule"]'

echo ""
echo "=== Results: ${PASS} passed, ${FAIL} failed ==="

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
