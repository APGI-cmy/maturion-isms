#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const REQUIRED_CHECKS = [
  'preflight/phase-1-evidence',
  'preflight/iaa-prebrief-existence',
  'preflight/iaa-token-self-certification',
  'preflight/hfmc-ripple-presence',
  'preflight/evidence-exactness',
  'preflight/iaa-final-assurance',
  'preflight/ecap-admin-ceremony',
  'preflight/scope-declaration-parity',
  'preflight/mmm-pr-admin',
  'preflight/product-delivery-gates',
  'preflight/gate-changing-pr-rule',
];

const CHECKPOINT_MARKER = '<!-- pre-handover-checkpoint -->';
const VIRTUAL_FILES = (() => {
  const filePath = process.env.CHECKPOINT_REPO_FILES_PATH;
  if (filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`CHECKPOINT_REPO_FILES_PATH could not be read as JSON: ${error.message}`);
    }
  }
  const raw = process.env.CHECKPOINT_REPO_FILES_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`CHECKPOINT_REPO_FILES_JSON is not valid JSON: ${error.message}`);
  }
})();

function toPosix(filePath) {
  return String(filePath || '').split(path.sep).join('/');
}

function safeRead(filePath) {
  const repoRelativePath = toPosix(path.isAbsolute(filePath)
    ? path.relative(process.cwd(), filePath)
    : filePath);
  if (VIRTUAL_FILES) {
    if (Object.prototype.hasOwnProperty.call(VIRTUAL_FILES, repoRelativePath)) {
      return String(VIRTUAL_FILES[repoRelativePath] || '');
    }
    // In virtual-file mode the provided snapshot is authoritative for this HEAD.
    // Do not fall back to disk, or missing virtual paths can accidentally read stale local files.
    return '';
  }
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function readJson(filePath) {
  const text = safeRead(filePath);
  if (text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
  // Keep JSON reads inside the virtual snapshot only when virtual-file mode is active.
  if (VIRTUAL_FILES) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function parseJsonEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${name} is not valid JSON: ${error.message}`);
  }
}

function git(args) {
  try {
    return cp.execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function listFilesRecursive(rootDir, predicate) {
  if (VIRTUAL_FILES) {
    const rootPrefix = `${toPosix(path.isAbsolute(rootDir) ? path.relative(process.cwd(), rootDir) : rootDir).replace(/\/$/, '')}/`;
    return Object.keys(VIRTUAL_FILES)
      .filter((relPath) => relPath.startsWith(rootPrefix))
      .filter((relPath) => !predicate || predicate(relPath, path.join(process.cwd(), relPath)))
      .sort();
  }
  const results = [];
  if (!fs.existsSync(rootDir)) return results;
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(fullPath, predicate));
      continue;
    }
    const relPath = toPosix(path.relative(process.cwd(), fullPath));
    if (!predicate || predicate(relPath, fullPath)) {
      results.push(relPath);
    }
  }
  return results.sort();
}

function normalizeValue(value) {
  return String(value || '').trim().toLowerCase();
}

function isTruthyYes(value) {
  const normalized = normalizeValue(value);
  return normalized === 'yes' || normalized === 'true';
}

function isFalseNo(value) {
  const normalized = normalizeValue(value);
  return normalized === 'no' || normalized === 'false';
}

function yesNoNotRequired(flag, required) {
  if (!required) return 'not_required';
  return flag ? 'yes' : 'no';
}

function yesNoUnknown(flag) {
  if (flag === true) return 'yes';
  if (flag === false) return 'no';
  return 'unknown';
}

function asBoolOrNull(value) {
  const normalized = normalizeValue(value);
  if (normalized === 'yes' || normalized === 'true') return true;
  if (normalized === 'no' || normalized === 'false') return false;
  return null;
}

function hasNonEmptyValue(value) {
  const normalized = normalizeValue(value);
  return normalized !== '' && !['none', 'n/a', 'na', 'not_applicable', 'null'].includes(normalized);
}

function commentBodyValue(value) {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  return String(value);
}

function isCheckpointTriggerComment(body) {
  const text = String(body || '').trim();
  return /^(?:ECAP_)?PRE_HANDOVER_CHECKPOINT(?:\b.*)?$/i.test(text) ||
    /^\/prepare-handover(?:\b.*)?$/i.test(text);
}

function isCheckpointResultComment(body) {
  return /PRE_HANDOVER_CHECKPOINT_RESULT/i.test(String(body || ''));
}

function isHandoverClaimComment(body) {
  const text = String(body || '');
  const rejectionNoticePattern = /(?:ADMIN_|IAA_|FOREMAN_)?REJECTION_NOTICE\b/i;
  if (!text.trim()) return false;
  if (isCheckpointTriggerComment(text) || isCheckpointResultComment(text)) return false;
  if (
    /RESULT:\s*STOP_AND_FIX/i.test(text) ||
    /RESULT:\s*CS2_INTERVENTION_REQUIRED/i.test(text) ||
    /RESULT:\s*REJECTED_BACK_TO_PRODUCER/i.test(text) ||
    /HANDOVER_ALLOWED:\s*no/i.test(text) ||
    rejectionNoticePattern.test(text)
  ) return false;
  const claimPatterns = [
    /\bhandover\b/i,
    /\bmerge-ready\b/i,
    /\bmerge ready\b/i,
    /\bready to merge\b/i,
    /\bready for review\b/i,
    /\bready-for-review\b/i,
    /\bready for cs2\b/i,
    /\bwork complete\b/i,
    /\bimplementation complete\b/i,
    /\bcomplete\b/i,
    /\bcompletion\b/i,
    /\bfinal summary\b/i,
    /\bwave closure\b/i,
    /\ball checks pass\b/i,
    /\ball gates pass\b/i,
    /\bmerge gate released\b/i,
    /\bcs2 approval\b/i,
  ];
  return claimPatterns.some((pattern) => pattern.test(text));
}

function readSimpleField(text, label) {
  const regex = new RegExp(`^[ \\t>*-]*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'im');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function headMatches(candidate, headSha) {
  const value = normalizeValue(String(candidate || '').replace(/[`]/g, ''));
  const head = normalizeValue(headSha);
  if (!value || !head) return false;
  if (!/^[0-9a-f]{7,40}$/.test(value)) return false;
  return head === value || head.startsWith(value) || value.startsWith(head);
}

function artifactCurrentness(text, headSha) {
  const fieldValues = [
    'CURRENT_HEAD_SHA',
    'gate_snapshot_head_sha',
    'post_push_head_sha',
    'Current head SHA reviewed',
    'Reviewed SHA',
    'HEAD SHA',
    'Commit SHA',
  ]
    .map((label) => readSimpleField(text, label))
    .filter(Boolean);

  if (fieldValues.length > 0) {
    // Explicit SHA fields are authoritative: every declared SHA must match the current head
    // so one refreshed field cannot mask another stale field in the same artifact.
    const matches = fieldValues.every((value) => headMatches(value, headSha));
    return {
      current: matches,
      stale: !matches,
    };
  }

  const rawMatch = normalizeValue(text).includes(normalizeValue(headSha));
  return {
    current: rawMatch,
    stale: !rawMatch,
  };
}

function resolveManifest(prNumber) {
  const candidates = [];
  if (prNumber) candidates.push(`.admin/prs/pr-${prNumber}.json`);
  candidates.push('.admin/pr.json');
  for (const candidate of candidates) {
    const manifest = readJson(path.join(process.cwd(), candidate));
    if (manifest) {
      return { path: candidate, manifest };
    }
  }
  return { path: '', manifest: null };
}

function computeChangedFiles(baseSha) {
  if (baseSha) {
    const diff = git(['diff', '--name-only', `${baseSha}...HEAD`]) || git(['diff', '--name-only', baseSha, 'HEAD']);
    return diff ? diff.split('\n').map((file) => file.trim()).filter(Boolean) : [];
  }
  const mainRef = git(['rev-parse', 'origin/main']) || git(['rev-parse', 'main']);
  if (mainRef) {
    const diff = git(['diff', '--name-only', `${mainRef}...HEAD`]);
    return diff ? diff.split('\n').map((file) => file.trim()).filter(Boolean) : [];
  }
  const fallback = git(['diff', '--name-only', 'HEAD~1...HEAD']);
  return fallback ? fallback.split('\n').map((file) => file.trim()).filter(Boolean) : [];
}

function isProtectedPath(file) {
  return /^\.github\/agents\/.+\.md$/.test(file) ||
    /^governance\/canon\//.test(file) ||
    /^governance\/checklists\//.test(file) ||
    /^governance\/templates\//.test(file) ||
    file === 'governance/CANON_INVENTORY.json';
}

function isProductPath(file) {
  if (/^(\.github|governance|docs|\.agent-admin|\.agent-workspace)\//.test(file)) return false;
  if (file === '.functional-delivery/pr-template.md') return false;
  if (/^(apps|packages|supabase\/functions|api)\/.+\.(tsx|jsx|ts|js|py|go)$/.test(file)) return true;
  if (/^modules\/[^/]+\/(src|app|api|frontend|backend|pages?|components?|routes?)\/.+\.(tsx|jsx|ts|js|py|go)$/.test(file)) return true;
  return /\.(tsx|jsx|ts|js|py|go)$/.test(file) && /(^|\/)(src|app|api|pages?|components?|routes?)\//.test(file);
}

function prBodyClaimsProductDelivery(prBody) {
  const text = String(prBody || '');
  return [
    /Functional-Delivery-Artifact:\s*\S+/i,
    /FUNCTIONAL_PASS:\s*yes/i,
    /FULL_FUNCTIONAL_DELIVERY_VERDICT:\s*FULL_FUNCTIONAL_DELIVERY(?:\s*$)/im,
    /VERDICT:\s*FULL_FUNCTIONAL_DELIVERY(?:\s*$)/im,
    /Pass\/fail result:\s*pass(?:\s*$)/im,
  ].some((pattern) => pattern.test(text));
}

function resolveIssueNumber(explicitIssue, prBody, scopeText, manifest) {
  if (explicitIssue) return Number(explicitIssue);
  const manifestIssue = manifest && Number.isInteger(manifest.issue) ? manifest.issue : null;
  if (manifestIssue) return manifestIssue;
  const scopeIssue = readSimpleField(scopeText, 'ISSUE').match(/#?(\d+)/);
  if (scopeIssue) return Number(scopeIssue[1]);
  const prBodyMatch = String(prBody || '').match(/(?:closes|fixes|resolves|addresses)\s+(?:maturion-isms)?#(\d+)/i);
  return prBodyMatch ? Number(prBodyMatch[1]) : null;
}

function pickBestArtifacts(files, context) {
  const scored = files.map((relPath) => {
    const text = safeRead(path.join(process.cwd(), relPath));
    let score = 0;
    if (context.prNumber && new RegExp(`#${context.prNumber}\\b`).test(text)) score += 4;
    if (context.issueNumber && new RegExp(`#${context.issueNumber}\\b`).test(text)) score += 3;
    if (context.branch && text.includes(context.branch)) score += 3;
    if (context.headSha && artifactCurrentness(text, context.headSha).current) score += 5;
    return { relPath, text, score };
  });
  scored.sort((left, right) => right.score - left.score || left.relPath.localeCompare(right.relPath));
  return scored;
}

function collectCheckState(checkRuns, commitStatuses) {
  const latestByName = new Map();
  for (const run of checkRuns || []) {
    const existing = latestByName.get(run.name);
    const runTime = new Date(run.started_at || run.completed_at || 0).getTime();
    const existingTime = existing ? new Date(existing.started_at || existing.completed_at || 0).getTime() : -1;
    if (!existing || runTime >= existingTime) latestByName.set(run.name, run);
  }

  const passing = [];
  const failing = [];
  const pending = [];
  for (const [name, run] of latestByName.entries()) {
    if (run.status === 'completed') {
      if (['success', 'skipped', 'neutral'].includes(run.conclusion)) {
        passing.push(name);
      } else {
        failing.push(name);
      }
    } else {
      pending.push(name);
    }
  }

  for (const status of commitStatuses || []) {
    if (status.state === 'failure' || status.state === 'error') failing.push(status.context);
    if (status.state === 'pending') pending.push(status.context);
    if (status.state === 'success') passing.push(status.context);
  }

  const observed = new Set([
    ...Array.from(latestByName.keys()),
    ...(commitStatuses || []).map((status) => status.context).filter(Boolean),
  ]);

  const missing = REQUIRED_CHECKS.filter((name) => !observed.has(name));
  return {
    total: REQUIRED_CHECKS.length,
    passing: Array.from(new Set(passing)).sort(),
    failing: Array.from(new Set(failing)).sort(),
    pending: Array.from(new Set(pending)).sort(),
    missing,
    noChecksAtAll: observed.size === 0,
  };
}

function detectMergeabilityFromGit(baseSha, headSha) {
  if (!baseSha || !headSha) return null;
  const mergeBase = git(['merge-base', baseSha, headSha]);
  if (!mergeBase) return null;
  try {
    const output = cp.execFileSync('git', ['merge-tree', mergeBase, baseSha, headSha], { encoding: 'utf8' });
    const hasConflict = /<<<<<<<|>>>>>>>|changed in both/i.test(output);
    return !hasConflict;
  } catch {
    return null;
  }
}

function detectBaseSyncedFromGit(baseSha, headSha) {
  if (!baseSha || !headSha) return null;
  try {
    cp.execFileSync('git', ['merge-base', '--is-ancestor', baseSha, headSha], { stdio: 'ignore' });
    return true;
  } catch (error) {
    if (typeof error?.status === 'number' && error.status === 1) return false;
    console.warn(`[pre-handover-checkpoint] Unable to verify base-sync ancestry (${baseSha} -> ${headSha}): ${error?.message || 'unknown error'}`);
    return null;
  }
}

function readFunctionalEvidence(prNumber, prBody) {
  const bodyMatch = String(prBody || '').match(/Functional-Delivery-Artifact:\s*(\S+)/i);
  const candidates = [
    process.env.FUNCTIONAL_DELIVERY_EVIDENCE_PATH || '',
    bodyMatch ? bodyMatch[1] : '',
    prNumber ? `.functional-delivery/pr-${prNumber}.md` : '',
  ].filter(Boolean);

  for (const candidate of candidates) {
    const absolutePath = path.join(process.cwd(), candidate);
    const text = safeRead(absolutePath);
    if (text) {
      return { path: candidate, text };
    }
  }
  return { path: '', text: '' };
}

function evaluateCheckpoint(input = {}) {
  const prNumber = Number(input.prNumber || process.env.PR_NUMBER || 0) || null;
  const headSha = String(input.headSha || process.env.HEAD_SHA || git(['rev-parse', 'HEAD']) || '').trim();
  const baseSha = String(input.baseSha || process.env.BASE_SHA || '').trim();
  const baseBranch = String(input.baseBranch || process.env.BASE_BRANCH || '').trim();
  const prBody = String(input.prBody ?? process.env.PR_BODY ?? '');
  const prTitle = String(input.prTitle ?? process.env.PR_TITLE ?? '');
  const branch = String(input.branch || process.env.PR_BRANCH || git(['branch', '--show-current']) || '').trim();
  const trigger = String(input.trigger || process.env.CHECKPOINT_TRIGGER || '').trim() || 'PRE_HANDOVER_CHECKPOINT';
  const explicitMergeConflictChecked = asBoolOrNull(input.mergeConflictChecked ?? process.env.CHECKPOINT_MERGE_CONFLICT_CHECKED);
  const explicitMergeableWithBase = asBoolOrNull(input.mergeableWithBase ?? process.env.CHECKPOINT_MERGEABLE_WITH_BASE);
  const explicitBaseSynced = asBoolOrNull(input.baseSyncedOrConflictsResolved ?? process.env.CHECKPOINT_BASE_SYNCED_OR_CONFLICTS_RESOLVED);
  const outOfSandboxOrGovernanceBlocker = String(
    input.outOfSandboxOrGovernanceBlocker
    ?? process.env.CHECKPOINT_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER
    ?? ''
  ).trim();
  const checkRuns = input.checkRuns || parseJsonEnv('CHECKPOINT_CHECK_RUNS_JSON', []);
  const commitStatuses = input.commitStatuses || parseJsonEnv('CHECKPOINT_COMMIT_STATUSES_JSON', []);

  const { path: manifestPath, manifest } = resolveManifest(prNumber);
  const changedFiles = input.changedFiles || parseJsonEnv('CHECKPOINT_CHANGED_FILES_JSON', null) || computeChangedFiles(baseSha);
  const protectedPathsTouched = changedFiles.some(isProtectedPath);
  const requiresIaa = manifest?.requires_iaa !== false;
  const requiresEcap = manifest?.requires_ecap !== false;
  const adminCeremonyRequired = requiresEcap || protectedPathsTouched;
  const productDeliveryRequired = changedFiles.some(isProductPath) || prBodyClaimsProductDelivery(prBody);
  const builderQaRequired = productDeliveryRequired;

  const scopePath = prNumber ? `.agent-admin/scope-declarations/pr-${prNumber}.md` : '';
  const scopeText = scopePath ? safeRead(path.join(process.cwd(), scopePath)) : '';
  const issueNumber = resolveIssueNumber(input.issueNumber || process.env.ISSUE_NUMBER, prBody, scopeText, manifest);
  const scopeCount = Number(readSimpleField(scopeText, 'FILES_CHANGED') || 0) || null;
  const scopePresent = Boolean(scopeText);
  const scopeCountMatches = scopePresent && scopeCount === changedFiles.length;

  const checkpointTime = input.checkpointTime || process.env.CHECKPOINT_TIME || new Date().toISOString();
  const checks = collectCheckState(checkRuns, commitStatuses);
  const localGatesRun = !checks.noChecksAtAll;
  const localGatesPassing = localGatesRun && checks.failing.length === 0 && checks.pending.length === 0 && checks.missing.length === 0;
  const currentHeadCiChecked = localGatesRun;
  const detectedMergeableWithBase = detectMergeabilityFromGit(baseSha, headSha);
  const detectedBaseSynced = detectBaseSyncedFromGit(baseSha, headSha);
  const mergeConflictChecked = explicitMergeConflictChecked !== null
    ? explicitMergeConflictChecked
    : (explicitMergeableWithBase !== null || detectedMergeableWithBase !== null);
  const mergeableWithBase = explicitMergeableWithBase !== null
    ? explicitMergeableWithBase
    : (detectedMergeableWithBase !== null ? detectedMergeableWithBase : false);
  const baseSyncedOrConflictsResolved = explicitBaseSynced !== null
    ? explicitBaseSynced
    : (detectedBaseSynced !== null ? detectedBaseSynced : (mergeConflictChecked && mergeableWithBase));

  const proofFiles = listFilesRecursive(path.join(process.cwd(), '.agent-admin/prehandover'), (relPath) => /\/proof-.*\.md$/.test(`/${relPath}`));
  const foremanPrehandoverFiles = listFilesRecursive(path.join(process.cwd(), '.agent-workspace/foreman-v2/memory'), (relPath) => /\/PREHANDOVER-.*\.md$/.test(`/${relPath}`));
  const ecapBundleFiles = listFilesRecursive(path.join(process.cwd(), '.agent-workspace/execution-ceremony-admin-agent/bundles'), (relPath) => /(PREHANDOVER-|session-).+\.md$/.test(path.basename(relPath)));
  const adminArtifacts = pickBestArtifacts([...proofFiles, ...foremanPrehandoverFiles, ...ecapBundleFiles], {
    prNumber, issueNumber, branch, headSha,
  });
  const adminPresent = adminArtifacts.length > 0;
  const adminInvoked = adminArtifacts.some((artifact) => /ecap_invoked:\s*(yes|true)|admin_ceremony_compliance:\s*PASS|ecap_verdict:\s*PASS/i.test(artifact.text));
  const adminCurrent = adminArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).current);
  const adminStale = adminArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).stale);

  const assuranceDir = path.join(process.cwd(), '.agent-admin/assurance');
  const prebriefStandalone = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-prebrief-.*\.md$/.test(relPath));
  const waveRecords = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-wave-record-.*\.md$/.test(relPath));
  const tokenFiles = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-token-.*\.md$/.test(relPath));
  const prebriefWaveRecords = waveRecords.filter((relPath) => /## PRE-BRIEF/i.test(safeRead(path.join(process.cwd(), relPath))) && !/superseded/i.test(safeRead(path.join(process.cwd(), relPath))));
  const tokenWaveRecords = waveRecords.filter((relPath) => /## TOKEN/i.test(safeRead(path.join(process.cwd(), relPath))));
  const prebriefFiles = pickBestArtifacts([...prebriefStandalone, ...prebriefWaveRecords], { prNumber, issueNumber, branch, headSha });
  const assuranceArtifacts = pickBestArtifacts([...tokenFiles, ...tokenWaveRecords], { prNumber, issueNumber, branch, headSha });
  const prebriefPresent = prebriefFiles.length > 0;
  const finalAssurancePresent = assuranceArtifacts.length > 0;
  const tokenPresent = assuranceArtifacts.length > 0;
  const iaaArtifactCurrent = assuranceArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).current);
  const iaaArtifactStale = assuranceArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).stale);
  const tokenPending = [
    ...adminArtifacts,
    ...assuranceArtifacts,
  ].some((artifact) => /iaa_audit_token:\s*PENDING|PHASE_B_BLOCKING_TOKEN:\s*PENDING/i.test(artifact.text));

  const functionalEvidence = readFunctionalEvidence(prNumber, prBody);
  const functionalEvidencePresent = Boolean(functionalEvidence.text);
  const functionalEvidenceCurrent = functionalEvidencePresent && artifactCurrentness(functionalEvidence.text, headSha).current;
  const builderQaRef = readSimpleField(functionalEvidence.text, 'Builder QA functional report reference');
  const builderQaInvoked = Boolean(builderQaRef) && !/^(none|n\/a|not_applicable|pending)$/i.test(builderQaRef);

  const activeArtifactTexts = [
    ...adminArtifacts.map((artifact) => artifact.text),
    ...assuranceArtifacts.map((artifact) => artifact.text),
    functionalEvidence.text,
  ].filter(Boolean);
  const activeArtifactsReportFailOrNo = activeArtifactTexts.some((text) =>
    /(?:ADMIN_PASS|FUNCTIONAL_PASS|HANDOVER_ALLOWED):\s*no\b|(?:VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT):\s*FAIL\b|final_state:\s*BLOCKED\b|merge_gate_verdict:\s*FAIL\b|admin_ceremony_compliance:\s*FAIL\b|ecap_verdict:\s*FAIL\b/i.test(text)
  );

  const functionalPassPositive = activeArtifactTexts.some((text) => /FUNCTIONAL_PASS:\s*yes\b/i.test(text));
  const functionalPassNegative = activeArtifactTexts.some((text) => /FUNCTIONAL_PASS:\s*no\b/i.test(text));
  const functionalPass = functionalPassPositive && !functionalPassNegative;
  const ecapWaiverPresent = activeArtifactTexts.some((text) => /\becap_waiver_ref:\s*(?!none\b|n\/a\b|not_applicable\b)\S+/i.test(text));
  const iaaWaiverPresent = activeArtifactTexts.some((text) => /\biaa_waiver_ref:\s*(?!none\b|n\/a\b|not_applicable\b)\S+/i.test(text));
  const ecapSatisfiedOrValidlyWaived = !requiresEcap || (adminPresent && adminCurrent) || ecapWaiverPresent;
  const iaaSatisfiedOrValidlyWaived = !requiresIaa || ((finalAssurancePresent && iaaArtifactCurrent && !tokenPending) || iaaWaiverPresent);
  const hasOutOfSandboxOrGovernanceBlocker = hasNonEmptyValue(outOfSandboxOrGovernanceBlocker);

  const staleShaFound = adminStale || iaaArtifactStale || (functionalEvidencePresent && !functionalEvidenceCurrent) || (scopePresent && !scopeCountMatches);
  const reasons = [];

  if (!scopePresent && (requiresIaa || requiresEcap || productDeliveryRequired)) {
    reasons.push('Per-PR scope declaration missing.');
  } else if (scopePresent && !scopeCountMatches) {
    reasons.push(`Scope declaration FILES_CHANGED (${scopeCount}) does not match current diff (${changedFiles.length}).`);
  }

  if (!manifestPath) reasons.push('PR admin manifest missing.');
  if (!mergeConflictChecked) reasons.push('Merge conflict check was not completed for current HEAD/base.');
  if (mergeConflictChecked && !mergeableWithBase) reasons.push('PR is not mergeable with base (merge conflicts unresolved).');
  if (mergeConflictChecked && !baseSyncedOrConflictsResolved) reasons.push('Base sync / conflict-resolution check failed.');
  if (checks.noChecksAtAll) reasons.push('No required checks were found for current HEAD.');
  if (checks.failing.length > 0) reasons.push(`Failing checks present: ${checks.failing.join(', ')}`);
  if (checks.pending.length > 0) reasons.push(`Pending checks present: ${checks.pending.join(', ')}`);
  if (checks.missing.length > 0) reasons.push(`Missing checks present: ${checks.missing.join(', ')}`);

  if (adminCeremonyRequired) {
    if (!adminInvoked) reasons.push('Admin Ceremony/ECAP invocation evidence missing.');
    if (!adminPresent) reasons.push('Admin Ceremony/ECAP artifact missing.');
    if (adminPresent && !adminCurrent) reasons.push('Admin Ceremony/ECAP artifact is stale for current HEAD.');
  }

  if (requiresEcap && !ecapSatisfiedOrValidlyWaived) {
    if (!adminPresent) reasons.push('ECAP artifact missing while ECAP is required.');
    if (adminPresent && !adminCurrent) reasons.push('ECAP current-head SHA match failed.');
  }

  if (requiresIaa && !iaaSatisfiedOrValidlyWaived) {
    if (!prebriefPresent) reasons.push('IAA pre-brief artifact missing.');
    if (!finalAssurancePresent) reasons.push('IAA final assurance artifact missing.');
    if (!tokenPresent) reasons.push('IAA token artifact missing.');
    if (tokenPending) reasons.push('IAA token is still pending in an active artifact.');
    if (finalAssurancePresent && !iaaArtifactCurrent) reasons.push('IAA final assurance artifact is stale for current HEAD.');
  }

  if (builderQaRequired) {
    if (!builderQaInvoked) reasons.push('Builder QA invocation/reference missing for product-facing PR.');
    if (!functionalEvidencePresent) reasons.push('Builder QA functional evidence missing.');
  }

  if (productDeliveryRequired) {
    if (!functionalEvidencePresent) reasons.push('Functional delivery evidence missing.');
    if (functionalEvidencePresent && !functionalEvidenceCurrent) reasons.push('Functional delivery evidence is stale for current HEAD.');
    if (!functionalPass) reasons.push('Functional PASS verdict not confirmed.');
  }

  if (activeArtifactsReportFailOrNo) reasons.push('An active artifact still reports FAIL or *_PASS/HANDOVER_ALLOWED: no.');
  if (hasOutOfSandboxOrGovernanceBlocker) {
    reasons.push(`I could not pass all gates because ${outOfSandboxOrGovernanceBlocker}. CS2 intervention needed.`);
  }
  if (staleShaFound && !reasons.some((reason) => reason.toLowerCase().includes('stale'))) {
    reasons.push('One or more active artifacts are stale against current HEAD.');
  }

  const handoverAllowed = reasons.length === 0;
  const result = handoverAllowed
    ? 'HANDOVER_ALLOWED'
    : (hasOutOfSandboxOrGovernanceBlocker ? 'CS2_INTERVENTION_REQUIRED' : 'STOP_AND_FIX');
  const reason = handoverAllowed ? 'All current-head checkpoint requirements satisfied.' : reasons.join(' ');

  const fields = {
    PR: prNumber ? `#${prNumber}` : 'unknown',
    ISSUE: issueNumber ? `#${issueNumber}` : 'unknown',
    CURRENT_HEAD_SHA: headSha,
    BASE_BRANCH: baseBranch || 'unknown',
    BASE_SHA: baseSha || 'unknown',
    MERGE_CONFLICT_CHECKED: mergeConflictChecked ? 'yes' : 'no',
    MERGEABLE_WITH_BASE: mergeableWithBase ? 'yes' : 'no',
    BASE_SYNCED_OR_CONFLICTS_RESOLVED: baseSyncedOrConflictsResolved ? 'yes' : 'no',
    CHECKPOINT_TRIGGER: trigger,
    CHECKPOINT_TIME: checkpointTime,
    LOCAL_GATES_RUN: localGatesRun ? 'yes' : 'no',
    LOCAL_GATES_PASSING: localGatesPassing ? 'yes' : 'no',
    CURRENT_HEAD_CI_CHECKED: currentHeadCiChecked ? 'yes' : 'no',
    ADMIN_CEREMONY_REQUIRED: adminCeremonyRequired ? 'yes' : 'no',
    ADMIN_CEREMONY_INVOKED: yesNoNotRequired(adminInvoked, adminCeremonyRequired),
    ADMIN_CEREMONY_ARTIFACT_PRESENT: yesNoNotRequired(adminPresent, adminCeremonyRequired),
    ADMIN_CEREMONY_ARTIFACT_CURRENT: yesNoNotRequired(adminCurrent, adminCeremonyRequired),
    ECAP_REQUIRED: requiresEcap ? 'yes' : 'no',
    ECAP_INVOKED: yesNoNotRequired(adminInvoked, requiresEcap),
    ECAP_ARTIFACT_PRESENT: yesNoNotRequired(adminPresent, requiresEcap),
    ECAP_ARTIFACT_CURRENT: yesNoNotRequired(adminCurrent, requiresEcap),
    ECAP_CURRENT_HEAD_SHA_MATCH: yesNoNotRequired(adminCurrent, requiresEcap),
    ECAP_SATISFIED_OR_VALIDLY_WAIVED: yesNoUnknown(ecapSatisfiedOrValidlyWaived),
    IAA_REQUIRED: requiresIaa ? 'yes' : 'no',
    IAA_PREBRIEF_PRESENT: yesNoNotRequired(prebriefPresent, requiresIaa),
    IAA_FINAL_ASSURANCE_PRESENT: yesNoNotRequired(finalAssurancePresent, requiresIaa),
    IAA_TOKEN_PRESENT: yesNoNotRequired(tokenPresent, requiresIaa),
    IAA_TOKEN_PENDING: yesNoNotRequired(tokenPending, requiresIaa),
    IAA_ARTIFACT_CURRENT: yesNoNotRequired(iaaArtifactCurrent, requiresIaa),
    IAA_SATISFIED_OR_VALIDLY_WAIVED: yesNoUnknown(iaaSatisfiedOrValidlyWaived),
    BUILDER_QA_REQUIRED: builderQaRequired ? 'yes' : 'no',
    BUILDER_QA_INVOKED: yesNoNotRequired(builderQaInvoked, builderQaRequired),
    BUILDER_QA_EVIDENCE_PRESENT: yesNoNotRequired(functionalEvidencePresent, builderQaRequired),
    PRODUCT_DELIVERY_REQUIRED: productDeliveryRequired ? 'yes' : 'no',
    FUNCTIONAL_DELIVERY_EVIDENCE_PRESENT: yesNoNotRequired(functionalEvidencePresent, productDeliveryRequired),
    FUNCTIONAL_DELIVERY_EVIDENCE_CURRENT: yesNoNotRequired(functionalEvidenceCurrent, productDeliveryRequired),
    FUNCTIONAL_PASS: yesNoNotRequired(functionalPass, productDeliveryRequired),
    REQUIRED_CHECKS_TOTAL: String(checks.total),
    LOCAL_OR_CURRENT_HEAD_CI_CHECKS_RUN: checks.noChecksAtAll ? 'no' : 'yes',
    PASSING_CHECKS: checks.passing.length ? checks.passing.join(', ') : 'none',
    FAILING_CHECKS: checks.failing.length ? checks.failing.join(', ') : 'none',
    PENDING_CHECKS: checks.pending.length ? checks.pending.join(', ') : 'none',
    MISSING_CHECKS: checks.noChecksAtAll ? 'all' : (checks.missing.length ? checks.missing.join(', ') : 'none'),
    STALE_CHECKS_OR_EVIDENCE: staleShaFound ? 'yes' : 'no',
    STALE_EVIDENCE_FOUND: staleShaFound ? 'yes' : 'no',
    ACTIVE_ARTIFACTS_REPORT_FAIL_OR_NO: activeArtifactsReportFailOrNo ? 'yes' : 'no',
    STALE_SHA_FOUND: staleShaFound ? 'yes' : 'no',
    OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER: hasOutOfSandboxOrGovernanceBlocker ? outOfSandboxOrGovernanceBlocker : 'none',
    HANDOVER_ALLOWED: handoverAllowed ? 'yes' : 'no',
    RESULT: result,
    REASON: reason,
  };

  const fieldLines = Object.entries(fields).map(([key, value]) => `${key}: ${commentBodyValue(value)}`);
  const body = [
    CHECKPOINT_MARKER,
    '## PRE_HANDOVER_CHECKPOINT_RESULT',
    '',
    ...fieldLines,
  ].join('\n');

  return {
    fields,
    body,
    helper: {
      checkpointMarker: CHECKPOINT_MARKER,
      manifestPath,
      scopePath,
      functionalEvidencePath: functionalEvidence.path || 'none',
      changedFiles,
    },
  };
}

module.exports = {
  CHECKPOINT_MARKER,
  REQUIRED_CHECKS,
  artifactCurrentness,
  evaluateCheckpoint,
  isCheckpointTriggerComment,
  isCheckpointResultComment,
  isHandoverClaimComment,
  readJson,
  safeRead,
};

if (require.main === module) {
  const result = evaluateCheckpoint();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
