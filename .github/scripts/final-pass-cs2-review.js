#!/usr/bin/env node

function normalizeUpper(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeLower(value) {
  return String(value || '').trim().toLowerCase();
}

function isTruthy(value) {
  const normalized = normalizeLower(value);
  return normalized === 'yes' || normalized === 'true';
}

function isFalsey(value) {
  const normalized = normalizeLower(value);
  return normalized === 'no' || normalized === 'false';
}

function toList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }
  const text = String(value || '').trim();
  if (!text || ['none', 'not_required', 'n/a', 'na'].includes(normalizeLower(text))) return [];
  return text.split(',').map((item) => item.trim()).filter(Boolean);
}

function evaluateFinalPassCs2ReviewState(input = {}) {
  const blockers = [];
  const nextRequiredAction = normalizeUpper(input.nextRequiredAction);
  const manifestStatus = normalizeUpper(input.manifestStatus);
  const waveTasksStatus = normalizeUpper(input.waveTasksStatus);
  const finalAssurancePresent = isTruthy(input.finalAssurancePresent);
  const tokenPresent = isTruthy(input.tokenPresent);
  const tokenPending = isTruthy(input.tokenPending);
  const failingChecks = toList(input.failingChecks);
  const pendingChecks = toList(input.pendingChecks);
  const missingChecks = toList(input.missingChecks);
  const mergeConflictChecked = input.mergeConflictChecked;
  const mergeableWithBase = input.mergeableWithBase;
  const baseSyncedOrConflictsResolved = input.baseSyncedOrConflictsResolved;
  const identityBindingPass = input.identityBindingPass;
  const scopeCurrent = input.scopeCurrent;
  const substantiveDeltaAfterEvidence = isTruthy(input.substantiveDeltaAfterEvidence);
  const invalidatedEvidence = isTruthy(input.invalidatedEvidence);
  const outOfAuthorityBlocker = isTruthy(input.outOfAuthorityBlocker);

  const declaredFinalPass = nextRequiredAction === 'CS2_REVIEW'
    && finalAssurancePresent
    && tokenPresent
    && !tokenPending
    && (
      manifestStatus === 'IAA_FINAL_PASS_CS2_REVIEW'
      || waveTasksStatus === 'IAA_FINAL_PASS_CS2_REVIEW'
    );

  if (failingChecks.length > 0) blockers.push(`failing checks: ${failingChecks.join(', ')}`);
  if (pendingChecks.length > 0) blockers.push(`pending checks: ${pendingChecks.join(', ')}`);
  if (missingChecks.length > 0) blockers.push(`missing checks: ${missingChecks.join(', ')}`);
  if (mergeConflictChecked === false) blockers.push('merge/base conflict check not completed');
  if (mergeableWithBase === false) blockers.push('merge conflicts with base unresolved');
  if (baseSyncedOrConflictsResolved === false) blockers.push('base sync / conflict resolution failed');
  if (identityBindingPass === false) blockers.push('active PR identity binding mismatch');
  if (scopeCurrent === false) blockers.push('scope declaration is not current');
  if (substantiveDeltaAfterEvidence) blockers.push('substantive delta after recorded evidence invalidated final-pass posture');
  if (invalidatedEvidence) blockers.push('current evidence is stale, pending, or otherwise invalidated');
  if (outOfAuthorityBlocker) blockers.push('out-of-authority blocker is active');

  const effectiveCs2Review = declaredFinalPass && blockers.length === 0;

  return {
    declaredFinalPass,
    effectiveCs2Review,
    superseded: declaredFinalPass && blockers.length > 0,
    blockers,
  };
}

function evaluateFinalPassCs2ReviewStateFromFields(fields = {}) {
  return evaluateFinalPassCs2ReviewState({
    nextRequiredAction: fields.ACTIVE_STATE_NEXT_REQUIRED_ACTION,
    manifestStatus: fields.PR_MANIFEST_STATUS,
    waveTasksStatus: fields.WAVE_TASKS_STATUS,
    finalAssurancePresent: fields.IAA_FINAL_ASSURANCE_PRESENT || fields.IAA_TOKEN_PRESENT,
    tokenPresent: fields.IAA_TOKEN_PRESENT,
    tokenPending: fields.IAA_TOKEN_PENDING,
    failingChecks: fields.FAILING_CHECKS,
    pendingChecks: fields.PENDING_CHECKS,
    missingChecks: fields.MISSING_CHECKS,
    mergeConflictChecked: isTruthy(fields.MERGE_CONFLICT_CHECKED) ? true : (isFalsey(fields.MERGE_CONFLICT_CHECKED) ? false : null),
    mergeableWithBase: isTruthy(fields.MERGEABLE_WITH_BASE) ? true : (isFalsey(fields.MERGEABLE_WITH_BASE) ? false : null),
    baseSyncedOrConflictsResolved: isTruthy(fields.BASE_SYNCED_OR_CONFLICTS_RESOLVED) ? true : (isFalsey(fields.BASE_SYNCED_OR_CONFLICTS_RESOLVED) ? false : null),
    identityBindingPass: normalizeUpper(fields.ACTIVE_PR_IDENTITY_BINDING) === 'PASS'
      ? true
      : (normalizeUpper(fields.ACTIVE_PR_IDENTITY_BINDING) === 'FAIL' ? false : null),
    scopeCurrent: isTruthy(fields.SCOPE_CURRENT)
      ? true
      : (isFalsey(fields.SCOPE_CURRENT) ? false : null),
    substantiveDeltaAfterEvidence: fields.SUBSTANTIVE_DELTA_AFTER_EVIDENCE,
    invalidatedEvidence: isTruthy(fields.STALE_EVIDENCE_FOUND)
      || isTruthy(fields.ACTIVE_ARTIFACTS_REPORT_FAIL_OR_NO)
      || isTruthy(fields.IAA_TOKEN_PENDING)
      || isFalsey(fields.IAA_ARTIFACT_CURRENT)
      || isFalsey(fields.ECAP_CURRENT_HEAD_SHA_MATCH),
    outOfAuthorityBlocker: !['', 'none'].includes(normalizeLower(fields.OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER)),
  });
}

module.exports = {
  evaluateFinalPassCs2ReviewState,
  evaluateFinalPassCs2ReviewStateFromFields,
  isTruthy,
  normalizeLower,
  normalizeUpper,
  toList,
};
