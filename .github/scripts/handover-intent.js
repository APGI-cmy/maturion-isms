#!/usr/bin/env node

const CHECKPOINT_TRIGGER_REGEX = /^(?:ECAP_)?PRE_HANDOVER_CHECKPOINT(?:\b.*)?$|^\/prepare-handover(?:\b.*)?$/i;
const CHECKPOINT_RESULT_REGEX = /PRE_HANDOVER_CHECKPOINT_RESULT/i;
const REJECTION_NOTICE_REGEX = /(?:ADMIN_|IAA_|FOREMAN_)?REJECTION_NOTICE\b/i;
const FAILED_GATE_SIGNAL_REGEX = /HANDOVER BLOCKED|HANDOVER_BLOCKED|CHECKPOINT REQUIRED|CHECKPOINT_REQUIRED|RESULT:\s*STOP_AND_FIX|RESULT:\s*CS2_INTERVENTION_REQUIRED|RESULT:\s*REJECTED_BACK_TO_PRODUCER|REJECTION_NOTICE|HANDOVER_ALLOWED:\s*no/i;

const EXPLICIT_HANDOVER_CLAIM_PATTERNS = [
  /\bhandover[ -]?ready\b/i,
  /\bhandover claim\b/i,
  /\bmerge[ -]?ready\b/i,
  /\bready to merge\b/i,
  /\ball gates pass\b/i,
  /\bmerge gate released\b/i,
  /\bOPOJD\b/i,
  /\bPhase\s+4\b/i,
  /HANDOVER_ALLOWED\s*:\s*yes/i,
  /\b(?:work|implementation)\s+complete\b/i,
];

// Advisory producer-intent signals are intentionally broader than the hard
// handover gate. "final summary" and "ready for review" should refresh
// producer guidance / checkpoint posture without weakening the explicit
// handover-claim rules enforced by handover-claim-gate.yml.
const REVIEW_OR_HANDOVER_SIGNAL_PATTERNS = [
  /\bready[ -]?for[ -]?review\b/i,
  /\breview-ready\b/i,
  /\bfinal summary\b/i,
  /\bready for cs2\b/i,
  /\bwave closure\b/i,
  /\ball checks pass\b/i,
  /\bcs2 approval\b/i,
  ...EXPLICIT_HANDOVER_CLAIM_PATTERNS,
];

function matchesAny(patterns, text) {
  return patterns.some((pattern) => pattern.test(String(text || '')));
}

function isCheckpointTriggerComment(body) {
  return CHECKPOINT_TRIGGER_REGEX.test(String(body || '').trim());
}

function isCheckpointResultComment(body) {
  return CHECKPOINT_RESULT_REGEX.test(String(body || ''));
}

function isFailedGateSignalComment(body, options = {}) {
  const text = String(body || '');
  const authoritativeMarkers = Array.isArray(options.authoritativeMarkers)
    ? options.authoritativeMarkers
    : [];
  if (!text.trim()) return false;
  if (authoritativeMarkers.some((marker) => marker && text.includes(marker))) return false;
  return FAILED_GATE_SIGNAL_REGEX.test(text);
}

function isExplicitHandoverClaimComment(body) {
  const text = String(body || '');
  if (!text.trim()) return false;
  if (isCheckpointTriggerComment(text) || isCheckpointResultComment(text)) return false;
  if (isFailedGateSignalComment(text) || REJECTION_NOTICE_REGEX.test(text)) return false;
  return matchesAny(EXPLICIT_HANDOVER_CLAIM_PATTERNS, text);
}

function isProducerIntentComment(body) {
  const text = String(body || '');
  if (!text.trim()) return false;
  if (isCheckpointTriggerComment(text) || isCheckpointResultComment(text)) return false;
  if (isFailedGateSignalComment(text) || REJECTION_NOTICE_REGEX.test(text)) return false;
  return matchesAny(REVIEW_OR_HANDOVER_SIGNAL_PATTERNS, text);
}

function hasExplicitReviewOrHandoverSignal(text) {
  return matchesAny(REVIEW_OR_HANDOVER_SIGNAL_PATTERNS, text);
}

function shouldProcessProducerGuidanceIssueComment(body) {
  return isCheckpointTriggerComment(body) || isProducerIntentComment(body);
}

module.exports = {
  CHECKPOINT_TRIGGER_REGEX,
  CHECKPOINT_RESULT_REGEX,
  REJECTION_NOTICE_REGEX,
  EXPLICIT_HANDOVER_CLAIM_PATTERNS,
  REVIEW_OR_HANDOVER_SIGNAL_PATTERNS,
  isCheckpointTriggerComment,
  isCheckpointResultComment,
  isFailedGateSignalComment,
  isExplicitHandoverClaimComment,
  isProducerIntentComment,
  hasExplicitReviewOrHandoverSignal,
  shouldProcessProducerGuidanceIssueComment,
};
