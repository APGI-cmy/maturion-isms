#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const REQUIRED_CHECKS = [
  'preflight/phase-1-evidence',
  'preflight/admin-control-router',
  'preflight/iaa-prebrief-existence',
  'preflight/identity-binding',
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
const REJECTION_PACKAGE_EXCLUDED_GATES = new Set([
  'preflight/injection-intake-current',
]);

const CHECKPOINT_MARKER = '<!-- pre-handover-checkpoint -->';
const HANDOVER_CHECKPOINT_REQUIRED_MARKER = '<!-- handover-checkpoint-required -->';
const HANDOVER_GATE_BLOCKED_MARKER = '<!-- handover-claim-gate-blocked -->';
const HANDOVER_GATE_OK_MARKER = '<!-- handover-claim-gate-ok -->';
const AUTHORITATIVE_GATE_MARKERS = [
  CHECKPOINT_MARKER,
  HANDOVER_CHECKPOINT_REQUIRED_MARKER,
  HANDOVER_GATE_BLOCKED_MARKER,
  HANDOVER_GATE_OK_MARKER,
];
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

function parseJsonInput(pathName, jsonName, fallback) {
  const filePath = process.env[pathName];
  if (filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`${pathName} could not be read as JSON: ${error.message}`);
    }
  }
  const raw = process.env[jsonName];
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${jsonName} is not valid JSON: ${error.message}`);
  }
}

function loadActiveState(input = {}) {
  if (input.activeState && typeof input.activeState === 'object') return input.activeState;
  const raw = input.activeStateJson || process.env.ACTIVE_STATE_JSON || '';
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const candidate = input.activeStatePath || process.env.ACTIVE_STATE_PATH || '';
  if (!candidate) return null;
  const absolute = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
  return readJson(absolute);
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

function parseIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function latestIso(values) {
  const latest = values
    .map((value) => parseIsoDate(value))
    .filter(Boolean)
    .sort((left, right) => right.getTime() - left.getTime())[0];
  return latest ? latest.toISOString() : '';
}

function isAfterOrSame(leftValue, rightValue) {
  const left = parseIsoDate(leftValue);
  const right = parseIsoDate(rightValue);
  if (!right) return true;
  if (!left) return false;
  return left.getTime() >= right.getTime();
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
    /\bmerge-ready\b/i,
    /\bmerge ready\b/i,
    /\bready to merge\b/i,
    /\bready for review\b/i,
    /\bready-for-review\b/i,
    /\bhandover-ready\b/i,
    /\bhandover ready\b/i,
    /\bhandover claim\b/i,
    /\bready for cs2\b/i,
    /\bwork complete\b/i,
    /\bimplementation complete\b/i,
    /\bfinal summary\b/i,
    /\bwave closure\b/i,
    /\ball checks pass\b/i,
    /\ball gates pass\b/i,
    /\bmerge gate released\b/i,
    /\bcs2 approval\b/i,
  ];
  return claimPatterns.some((pattern) => pattern.test(text));
}

function hasExplicitReviewOrHandoverSignal(text) {
  return [
    /\bready[ -]?for[ -]?review\b/i,
    /\breview-ready\b/i,
    /\bmerge[ -]?ready\b/i,
    /\bready to merge\b/i,
    /\bhandover[ -]?ready\b/i,
    /\bhandover claim\b/i,
    /\bwork complete\b/i,
    /\bimplementation complete\b/i,
    /\ball checks pass\b/i,
    /\ball gates pass\b/i,
    /\bmerge gate released\b/i,
    /HANDOVER_ALLOWED\s*:\s*yes/i,
  ].some((pattern) => pattern.test(String(text || '')));
}

function isCs2Comment(comment) {
  const login = normalizeValue(comment?.user?.login);
  return login === 'apgi-cmy';
}

function isFailedGateSignalComment(body) {
  const text = String(body || '');
  if (!text.trim()) return false;
  if (AUTHORITATIVE_GATE_MARKERS.some((marker) => text.includes(marker))) return false;
  return /HANDOVER BLOCKED|HANDOVER_BLOCKED|CHECKPOINT REQUIRED|CHECKPOINT_REQUIRED|RESULT:\s*STOP_AND_FIX|RESULT:\s*CS2_INTERVENTION_REQUIRED|RESULT:\s*REJECTED_BACK_TO_PRODUCER|REJECTION_NOTICE|HANDOVER_ALLOWED:\s*no/i.test(text);
}

function parseChecklistItems(body) {
  const items = [];
  const regex = /^[ \t>*-]*-\s*\[([ xX])\]\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(String(body || ''))) !== null) {
    items.push({
      checked: String(match[1] || '').toLowerCase() === 'x',
      text: String(match[2] || '').trim(),
    });
  }
  return {
    all: items,
    checked: items.filter((item) => item.checked),
    unchecked: items.filter((item) => !item.checked),
  };
}

function readSimpleField(text, label) {
  const regex = new RegExp(`^[ \\t>*-]*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'im');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function parseScopeDeclaredFiles(scopeText) {
  const lines = String(scopeText || '').split('\n');
  return lines
    .map((line) => {
      const strictMatch = line.match(/^\s*-\s+`([^`]+)`\s+[-—]\s+/);
      if (strictMatch) return strictMatch[1].trim();
      const looseMatch = line.match(/^\s*-\s+`([^`]+)`/);
      return looseMatch ? looseMatch[1].trim() : '';
    })
    .filter(Boolean);
}

/**
 * Collects PR number references from common artifact identity fields.
 * Note: this helper intentionally does not apply historical/reference-section
 * exemptions; those are handled by .github/scripts/identity-binding-gate.sh.
 */
function collectPrBindings(text) {
  const source = String(text || '');
  const values = [];
  const patterns = [
    /\bPR:\s*#?(\d+)\b/gi,
    /\bPR_NUMBER:\s*(\d+)\b/gi,
    /\bpr-(\d+)\.(?:json|md)\b/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) values.push(Number(match[1]));
  }
  return values.filter((value) => Number.isFinite(value));
}

function headMatches(candidate, headSha) {
  const value = normalizeValue(String(candidate || '').replace(/[`]/g, ''));
  const head = normalizeValue(headSha);
  if (!value || !head) return false;
  // "current_head"/"current-head" token is a canonical runtime-substituted marker used by governance artifacts.
  // Treat it as current-head aligned to avoid stale-by-construction self-reference loops.
  if (value === 'current_head' || value === 'current-head') return true;
  if (!/^[0-9a-f]{7,40}$/.test(value)) return false;
  return head === value || head.startsWith(value) || value.startsWith(head);
}

function removeExcludedGates(records) {
  return (records || []).filter((record) => !REJECTION_PACKAGE_EXCLUDED_GATES.has(record.gate));
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

function readCommentTimestamp(comment) {
  return latestIso([comment?.updated_at, comment?.created_at]);
}

function latestInjectionIntake(prComments) {
  return (prComments || [])
    .filter((comment) => comment?.body && comment.body.includes(CHECKPOINT_MARKER) && /PRE_HANDOVER_CHECKPOINT_RESULT/i.test(comment.body))
    .map((comment) => ({
      comment,
      intakeAt: readCommentTimestamp(comment),
      intakeSha: readSimpleField(comment.body, 'LATEST_INJECTION_INTAKE_SHA') ||
        readSimpleField(comment.body, 'CURRENT_HEAD_SHA'),
      injectionState: readSimpleField(comment.body, 'INJECTION_STATE'),
      nextRequiredControl: readSimpleField(comment.body, 'NEXT_REQUIRED_CONTROL'),
    }))
    .sort((left, right) => {
      const rightDate = parseIsoDate(right.intakeAt);
      const leftDate = parseIsoDate(left.intakeAt);
      return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);
    })[0] || null;
}

function resolveManifest(prNumber, preferredPath = '') {
  const candidates = [];
  if (preferredPath) candidates.push(preferredPath);
  if (prNumber) candidates.push(`.admin/prs/pr-${prNumber}.json`);
  candidates.push('.admin/pr.json');
  for (const candidate of candidates) {
    const absolutePath = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
    const manifest = readJson(absolutePath);
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

function classifyProductJourney(changedFiles, prTitle, prBody) {
  const files = (changedFiles || []).map((file) => String(file || ''));
  const combinedText = `${String(prTitle || '')}\n${String(prBody || '')}\n${files.join('\n')}`.toLowerCase();
  const labels = new Set();

  const hasRouteChange = files.some((file) => /(^|\/)(route|routes|router|navigation)\b/i.test(file)) || /\b(?:route|router|navigation)\b/.test(combinedText);
  const hasHandoffChange = /\bhandoff\b/.test(combinedText);
  const hasContextHandoffChange = /\bcontext[-_\s]?handoff\b/.test(combinedText);
  const hasCompileChange = /\b(?:compile|frameworkreviewpage)\b/.test(combinedText);
  const hasPublishChange = /\b(?:publish|release)\b/.test(combinedText);
  const hasUploadChange = /\b(?:upload|uploader|ingest)\b/.test(combinedText);
  const hasGenerateChange = /\b(?:generate|generator)\b/.test(combinedText);

  if (hasRouteChange) labels.add('route-change');
  if (hasHandoffChange) labels.add('handoff-change');
  if (hasContextHandoffChange) labels.add('context-handoff-change');
  if (hasCompileChange) labels.add('compile-change');
  if (hasPublishChange) labels.add('publish-change');
  if (hasUploadChange) labels.add('upload-change');
  if (hasGenerateChange) labels.add('generate-change');

  const mmmFrameworkCompileHandoff = files.some((file) =>
    /^apps\/mmm\/.+frameworkreviewpage.+\.(tsx|jsx|ts|js)$/i.test(file)
  ) && (hasCompileChange || hasHandoffChange || hasContextHandoffChange);

  if (mmmFrameworkCompileHandoff) {
    labels.add('mmm-frameworkreviewpage-compile-handoff');
    labels.add('mmm-verify-mode-a-required');
    labels.add('mmm-verify-mode-b-required');
    labels.add('mmm-verify-mode-c-required');
    labels.add('mmm-legacy-workspace-handoff-required');
    labels.add('mmm-framework_id-preservation-required');
  }

  return {
    labels: Array.from(labels).sort(),
    mmmFrameworkCompileHandoff,
  };
}

function computeAffectedProductGates({ journey, productDeliveryRequired, requiresIaa }) {
  const required = new Set();
  if (productDeliveryRequired || journey.labels.length > 0) required.add('preflight/product-delivery-gates');
  if (requiresIaa && (productDeliveryRequired || journey.labels.length > 0)) required.add('preflight/iaa-final-assurance');
  if (journey.mmmFrameworkCompileHandoff) {
    required.add('MMM Live Dashboard Diagnosis / Verify Mode A/B/C');
    required.add('preflight/mmm-pr-admin');
  }
  return Array.from(required).sort();
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

function matchesArtifactContext(text, context) {
  const artifactText = String(text || '');
  if (context.prNumber && new RegExp(`#${context.prNumber}\\b`).test(artifactText)) return true;
  if (context.issueNumber && new RegExp(`#${context.issueNumber}\\b`).test(artifactText)) return true;
  if (context.branch && artifactText.includes(context.branch)) return true;
  return false;
}

function contextScopedArtifacts(artifacts, context) {
  if (!artifacts || artifacts.length === 0) return [];
  const scoped = artifacts.filter((artifact) => matchesArtifactContext(artifact.text, context));
  if (scoped.length > 0) return scoped;
  // If no explicit PR/issue/branch context is present, fall back to all
  // artifacts so legacy pending-token evidence is still honored.
  return artifacts;
}

function artifactFromResolverPath(relPath) {
  const candidate = String(relPath || '').trim();
  if (!candidate) return null;
  const absolute = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
  const text = safeRead(absolute);
  if (!text) return null;
  // Resolver-selected artifacts are authoritative active-state inputs.
  // Assign max score so they always outrank discovery-scored historical candidates.
  return { relPath: toPosix(path.relative(process.cwd(), absolute)), text, score: Number.MAX_SAFE_INTEGER };
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
  const failingDetails = [];
  const pendingDetails = [];
  for (const [name, run] of latestByName.entries()) {
    if (run.status === 'completed') {
      if (['success', 'skipped', 'neutral'].includes(run.conclusion)) {
        passing.push(name);
      } else {
        failing.push(name);
        failingDetails.push({
          gate: name,
          status: run.status || 'completed',
          conclusion: run.conclusion || 'failure',
          runId: run.id || '',
          jobId: '',
          updatedAt: run.completed_at || run.started_at || '',
        });
      }
    } else {
      pending.push(name);
      pendingDetails.push({
        gate: name,
        status: run.status || 'pending',
        conclusion: '',
        runId: run.id || '',
        jobId: '',
        updatedAt: run.started_at || run.completed_at || '',
      });
    }
  }

  for (const status of commitStatuses || []) {
    if (status.state === 'failure' || status.state === 'error') {
      failing.push(status.context);
      failingDetails.push({
        gate: status.context,
        status: status.state,
        conclusion: status.state,
        runId: '',
        jobId: '',
        updatedAt: status.updated_at || status.created_at || '',
      });
    }
    if (status.state === 'pending') {
      pending.push(status.context);
      pendingDetails.push({
        gate: status.context,
        status: status.state,
        conclusion: status.state,
        runId: '',
        jobId: '',
        updatedAt: status.updated_at || status.created_at || '',
      });
    }
    if (status.state === 'success') passing.push(status.context);
  }

  const observed = new Set([
    ...Array.from(latestByName.keys()),
    ...(commitStatuses || []).map((status) => status.context).filter(Boolean),
  ]);

  const missing = REQUIRED_CHECKS.filter((name) => !observed.has(name));
  const missingDetails = missing.map((name) => ({
    gate: name,
    status: 'missing',
    conclusion: 'missing',
    runId: '',
    jobId: '',
    updatedAt: '',
  }));
  return {
    total: REQUIRED_CHECKS.length,
    passing: Array.from(new Set(passing)).sort(),
    failing: Array.from(new Set(failing)).sort(),
    pending: Array.from(new Set(pending)).sort(),
    missing,
    failingDetails,
    pendingDetails,
    missingDetails,
    observed: Array.from(observed).sort(),
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
  const activeState = loadActiveState(input) || {};
  const prNumber = Number(input.prNumber || process.env.PR_NUMBER || activeState.pr || 0) || null;
  const headSha = String(input.headSha || process.env.HEAD_SHA || activeState.runtime_head_sha || git(['rev-parse', 'HEAD']) || '').trim();
  const baseSha = String(input.baseSha || process.env.BASE_SHA || activeState.base_sha || '').trim();
  const baseBranch = String(input.baseBranch || process.env.BASE_BRANCH || '').trim();
  const prBody = String(input.prBody ?? process.env.PR_BODY ?? '');
  const prTitle = String(input.prTitle ?? process.env.PR_TITLE ?? '');
  const branch = String(input.branch || process.env.PR_BRANCH || activeState.branch || git(['branch', '--show-current']) || '').trim();
  const trigger = String(input.trigger || process.env.CHECKPOINT_TRIGGER || '').trim() || 'PRE_HANDOVER_CHECKPOINT';
  const explicitMergeConflictChecked = asBoolOrNull(input.mergeConflictChecked ?? process.env.CHECKPOINT_MERGE_CONFLICT_CHECKED);
  const explicitMergeableWithBase = asBoolOrNull(input.mergeableWithBase ?? process.env.CHECKPOINT_MERGEABLE_WITH_BASE);
  const explicitBaseSynced = asBoolOrNull(input.baseSyncedOrConflictsResolved ?? process.env.CHECKPOINT_BASE_SYNCED_OR_CONFLICTS_RESOLVED);
  const outOfSandboxOrGovernanceBlocker = String(
    input.outOfSandboxOrGovernanceBlocker
    ?? process.env.CHECKPOINT_OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER
    ?? ''
  ).trim();
  const prUpdatedAt = String(input.prUpdatedAt ?? process.env.PR_UPDATED_AT ?? '').trim();
  const prComments = input.prComments || parseJsonInput('CHECKPOINT_PR_COMMENTS_PATH', 'CHECKPOINT_PR_COMMENTS_JSON', []);
  const explicitMarkCurrentRunAsIntake = asBoolOrNull(input.markCurrentRunAsIntake ?? process.env.CHECKPOINT_MARK_CURRENT_RUN_AS_INTAKE) === true;
  const intakeOnly = asBoolOrNull(input.intakeOnly ?? process.env.CHECKPOINT_INTAKE_ONLY) === true;
  const checkRuns = input.checkRuns || parseJsonInput('CHECKPOINT_CHECK_RUNS_PATH', 'CHECKPOINT_CHECK_RUNS_JSON', []);
  const commitStatuses = input.commitStatuses || parseJsonInput('CHECKPOINT_COMMIT_STATUSES_PATH', 'CHECKPOINT_COMMIT_STATUSES_JSON', []);

  const { path: manifestPath, manifest } = resolveManifest(prNumber, String(activeState.manifest_path || '').trim());
  const changedFiles = input.changedFiles || parseJsonInput('CHECKPOINT_CHANGED_FILES_PATH', 'CHECKPOINT_CHANGED_FILES_JSON', null) || computeChangedFiles(baseSha);
  const protectedPathsTouched = changedFiles.some(isProtectedPath);
  const requiresIaa = manifest?.requires_iaa !== false;
  const requiresEcap = manifest?.requires_ecap !== false;
  const adminCeremonyRequired = requiresEcap || protectedPathsTouched;
  const productDeliveryRequired = changedFiles.some(isProductPath) || prBodyClaimsProductDelivery(prBody);
  const builderQaRequired = productDeliveryRequired;
  const journey = classifyProductJourney(changedFiles, prTitle, prBody);

  const scopePath = String(activeState.scope_path || '').trim() || (prNumber ? `.agent-admin/scope-declarations/pr-${prNumber}.md` : '');
  const scopeText = scopePath ? safeRead(path.join(process.cwd(), scopePath)) : '';
  const resolverWaveTasksPath = String(activeState.wave_tasks_path || '').trim();
  let waveTasksPath = resolverWaveTasksPath || (prNumber ? `.agent-admin/prs/pr-${prNumber}/wave-current-tasks.md` : '');
  let waveTasksText = waveTasksPath ? safeRead(path.join(process.cwd(), waveTasksPath)) : '';
  if (!resolverWaveTasksPath && !waveTasksText) {
    // Legacy compatibility fallback only when no resolver-selected wave-tasks artifact exists.
    waveTasksPath = '.agent-workspace/foreman-v2/personal/wave-current-tasks.md';
    waveTasksText = safeRead(path.join(process.cwd(), waveTasksPath));
  }
  const issueNumber = resolveIssueNumber(input.issueNumber || process.env.ISSUE_NUMBER, prBody, scopeText, manifest);
  const scopeCount = Number(readSimpleField(scopeText, 'FILES_CHANGED') || 0) || null;
  const scopePresent = Boolean(scopeText);
  const scopeCountMatches = scopePresent && scopeCount === changedFiles.length;
  const scopeDeclaredFiles = parseScopeDeclaredFiles(scopeText);
  const scopeUndeclaredFiles = scopeDeclaredFiles.length > 0
    ? changedFiles.filter((file) => !scopeDeclaredFiles.includes(file))
    : [];

  const checkpointTime = input.checkpointTime || process.env.CHECKPOINT_TIME || new Date().toISOString();
  const markCurrentRunAsIntake = explicitMarkCurrentRunAsIntake || isCheckpointTriggerComment(trigger);
  const checklistItems = parseChecklistItems(prBody);
  const reviewOrHandoverClaimed = hasExplicitReviewOrHandoverSignal(`${trigger}\n${prBody}`) || isHandoverClaimComment(trigger);
  const cs2CommentTimes = prComments.filter(isCs2Comment).map(readCommentTimestamp);
  const failedGateSignalTimes = prComments.filter((comment) => isFailedGateSignalComment(comment?.body)).map(readCommentTimestamp);
  const priorIntake = latestInjectionIntake(prComments);
  const latestCs2CommentAt = latestIso(cs2CommentTimes);
  const latestFailedGateSignalAt = latestIso(failedGateSignalTimes);
  const latestRelevantInstructionAt = latestIso([latestCs2CommentAt, prUpdatedAt, latestFailedGateSignalAt]);
  const latestInjectionIntakeSha = markCurrentRunAsIntake
    ? headSha
    : String(priorIntake?.intakeSha || '').trim();
  const latestInjectionIntakeAt = markCurrentRunAsIntake
    ? checkpointTime
    : String(priorIntake?.intakeAt || '').trim();
  const latestInjectionIntakeAfterLastCs2Comment = isAfterOrSame(latestInjectionIntakeAt, latestCs2CommentAt);
  const latestInjectionIntakeAfterLastPrBodyEdit = isAfterOrSame(latestInjectionIntakeAt, prUpdatedAt);
  const latestInjectionIntakeAfterLastFailedGateSignal = isAfterOrSame(latestInjectionIntakeAt, latestFailedGateSignalAt);
  const intakeHeadCurrent = headMatches(latestInjectionIntakeSha, headSha);
  const injectionState = !latestInjectionIntakeAt
    ? 'missing'
    : (!intakeHeadCurrent
      ? 'stale'
      : (
        latestInjectionIntakeAfterLastCs2Comment &&
        latestInjectionIntakeAfterLastPrBodyEdit &&
        latestInjectionIntakeAfterLastFailedGateSignal
          ? 'current'
          : 'dirty'
      ));
  const injectionIntakeStatus = injectionState === 'current'
    ? 'CURRENT'
    : (injectionState === 'missing' ? 'MISSING' : 'STALE');
  const checks = collectCheckState(checkRuns, commitStatuses);
  const affectedProductGatesRequired = computeAffectedProductGates({ journey, productDeliveryRequired, requiresIaa });
  const observedChecks = new Set(checks.observed || []);
  const failingChecks = new Set(checks.failing || []);
  const pendingChecks = new Set(checks.pending || []);
  const missingChecks = new Set(checks.missing || []);
  const failedAffectedGates = affectedProductGatesRequired.filter((gate) => {
    if (checks.noChecksAtAll) return true;
    if (failingChecks.has(gate) || pendingChecks.has(gate) || missingChecks.has(gate)) return true;
    if (!observedChecks.has(gate)) return true;
    return false;
  });
  const passingAffectedGates = affectedProductGatesRequired.filter((gate) => (checks.passing || []).includes(gate));
  const sourceStringOnlyEvidence = journey.labels.length > 0 && passingAffectedGates.length === 0;
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

  const resolverSelectedEcapArtifact = artifactFromResolverPath(activeState.ecap_artifact_path);
  const resolverSelectedIaaArtifact = artifactFromResolverPath(activeState.iaa_artifact_path);

  let adminArtifacts = [];
  if (resolverSelectedEcapArtifact) {
    adminArtifacts = [resolverSelectedEcapArtifact];
  } else {
    // Legacy compatibility fallback: broad discovery when resolver-selected ECAP artifact is absent.
    const proofFiles = listFilesRecursive(path.join(process.cwd(), '.agent-admin/prehandover'), (relPath) => /\/proof-.*\.md$/.test(`/${relPath}`));
    const foremanPrehandoverFiles = listFilesRecursive(path.join(process.cwd(), '.agent-workspace/foreman-v2/memory'), (relPath) => /\/PREHANDOVER-.*\.md$/.test(`/${relPath}`));
    const ecapBundleFiles = listFilesRecursive(path.join(process.cwd(), '.agent-workspace/execution-ceremony-admin-agent/bundles'), (relPath) => /(PREHANDOVER-|session-).+\.md$/.test(path.basename(relPath)));
    adminArtifacts = pickBestArtifacts([...proofFiles, ...foremanPrehandoverFiles, ...ecapBundleFiles], {
      prNumber, issueNumber, branch, headSha,
    });
  }
  const adminPresent = adminArtifacts.length > 0;
  const adminInvoked = adminArtifacts.some((artifact) => /ecap_invoked:\s*(yes|true)|admin_ceremony_compliance:\s*PASS|ecap_verdict:\s*PASS/i.test(artifact.text));
  const adminCurrent = adminArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).current);
  const adminStale = adminArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).stale);

  function resolverArtifactHasIaaSection(artifact, section) {
    const text = artifact && artifact.text ? artifact.text : '';
    if (section === 'prebrief') {
      return /## PRE-BRIEF/i.test(text) && !/superseded/i.test(text);
    }
    if (section === 'preflight-brief') {
      return /IAA_PREFLIGHT_BRIEF|## PREFLIGHT BRIEF/i.test(text);
    }
    if (section === 'assurance') {
      return /## TOKEN|PHASE_B_BLOCKING_TOKEN\s*:/i.test(text);
    }
    return false;
  }

  let prebriefFiles = [];
  let preflightBriefArtifacts = [];
  let assuranceArtifacts = [];
  if (resolverSelectedIaaArtifact) {
    if (resolverArtifactHasIaaSection(resolverSelectedIaaArtifact, 'prebrief')) {
      prebriefFiles = [resolverSelectedIaaArtifact];
    }
    if (resolverArtifactHasIaaSection(resolverSelectedIaaArtifact, 'preflight-brief')) {
      preflightBriefArtifacts = [resolverSelectedIaaArtifact];
    }
    if (resolverArtifactHasIaaSection(resolverSelectedIaaArtifact, 'assurance')) {
      assuranceArtifacts = [resolverSelectedIaaArtifact];
    }
  } else {
    // Legacy compatibility fallback: broad assurance discovery when resolver-selected IAA artifact is absent.
    const assuranceDir = path.join(process.cwd(), '.agent-admin/assurance');
    const prebriefStandalone = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-prebrief-.*\.md$/.test(relPath));
    const preflightBriefFiles = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-preflight-brief-.*\.md$/.test(relPath));
    const waveRecords = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-wave-record-.*\.md$/.test(relPath));
    const tokenFiles = listFilesRecursive(assuranceDir, (relPath) => /^\.agent-admin\/assurance\/iaa-token-.*\.md$/.test(relPath));
    const prebriefWaveRecords = waveRecords.filter((relPath) => /## PRE-BRIEF/i.test(safeRead(path.join(process.cwd(), relPath))) && !/superseded/i.test(safeRead(path.join(process.cwd(), relPath))));
    const tokenWaveRecords = waveRecords.filter((relPath) => /## TOKEN/i.test(safeRead(path.join(process.cwd(), relPath))));
    prebriefFiles = pickBestArtifacts([...prebriefStandalone, ...prebriefWaveRecords], { prNumber, issueNumber, branch, headSha });
    preflightBriefArtifacts = pickBestArtifacts(preflightBriefFiles, { prNumber, issueNumber, branch, headSha });
    assuranceArtifacts = pickBestArtifacts([...tokenFiles, ...tokenWaveRecords], { prNumber, issueNumber, branch, headSha });
  }
  const preflightBriefPresent = preflightBriefArtifacts.length > 0;
  const preflightBriefCurrent = preflightBriefArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).current);
  const prebriefPresent = prebriefFiles.length > 0;
  const finalAssurancePresent = assuranceArtifacts.length > 0;
  const tokenPresent = assuranceArtifacts.length > 0;
  const iaaArtifactCurrent = assuranceArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).current);
  const iaaArtifactStale = assuranceArtifacts.some((artifact) => artifactCurrentness(artifact.text, headSha).stale);
  const tokenPending = [
    // Admin artifacts intentionally ignore issueNumber matching because issues are
    // reused across rounds and can pull unrelated historical ceremony files.
    ...contextScopedArtifacts(adminArtifacts, { prNumber, branch }),
    ...contextScopedArtifacts(assuranceArtifacts, { prNumber, issueNumber, branch }),
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

  const identityArtifacts = [];
  if (manifestPath && manifest) identityArtifacts.push({ path: manifestPath, text: JSON.stringify(manifest) });
  if (scopePresent) identityArtifacts.push({ path: scopePath, text: scopeText });
  if (waveTasksText) identityArtifacts.push({ path: waveTasksPath, text: waveTasksText });
  identityArtifacts.push(...adminArtifacts.map((artifact) => ({ path: artifact.relPath, text: artifact.text })));
  identityArtifacts.push(...assuranceArtifacts.map((artifact) => ({ path: artifact.relPath, text: artifact.text })));
  const identityMismatchFindings = [];
  if (prNumber) {
    if (manifest && Number.isInteger(manifest.pr) && manifest.pr !== prNumber) {
      identityMismatchFindings.push(`${manifestPath} declares pr=${manifest.pr}, expected ${prNumber}`);
    }
    if (scopePresent) {
      const scopePr = Number(readSimpleField(scopeText, 'PR_NUMBER') || 0) || null;
      if (scopePr && scopePr !== prNumber) {
        identityMismatchFindings.push(`${scopePath} declares PR_NUMBER=${scopePr}, expected ${prNumber}`);
      }
    }
    for (const artifact of identityArtifacts) {
      const bindings = collectPrBindings(artifact.text);
      const wrong = Array.from(new Set(bindings.filter((value) => value !== prNumber)));
      if (wrong.length > 0) {
        identityMismatchFindings.push(`${artifact.path} contains non-active PR reference(s): ${wrong.map((value) => `#${value}`).join(', ')}`);
      }
    }
  }
  const scopeBranch = scopePresent ? readSimpleField(scopeText, 'BRANCH') : '';
  if (scopeBranch && branch && scopeBranch !== branch) {
    identityMismatchFindings.push(`${scopePath} declares BRANCH=${scopeBranch}, expected ${branch}`);
  }
  const waveBranch = waveTasksText ? readSimpleField(waveTasksText, 'Branch') : '';
  if (waveBranch && branch && waveBranch !== branch) {
    identityMismatchFindings.push(`${waveTasksPath} declares Branch=${waveBranch}, expected ${branch}`);
  }
  const activeIdentityBindingPass = identityMismatchFindings.length === 0;

  const staleShaFound = adminStale || iaaArtifactStale || (functionalEvidencePresent && !functionalEvidenceCurrent) || (scopePresent && !scopeCountMatches);
  const reasons = [];
  const producerSideGatesRequired = Array.from(new Set([
    adminCeremonyRequired ? 'preflight/ecap-admin-ceremony' : '',
    requiresIaa ? 'preflight/iaa-final-assurance' : '',
    ...affectedProductGatesRequired,
  ].filter(Boolean))).sort();
  const unresolvedCheckFailures = removeExcludedGates(checks.failingDetails);
  const unresolvedCheckPending = removeExcludedGates(checks.pendingDetails);
  const unresolvedCheckMissing = removeExcludedGates(checks.missingDetails);

  const unresolvedGateRecords = [
    ...unresolvedCheckFailures,
    ...unresolvedCheckPending,
    ...unresolvedCheckMissing,
    ...failedAffectedGates.map((gate) => ({
      gate,
      status: 'failed_affected_gate',
      conclusion: 'not_green',
      runId: '',
      jobId: '',
      updatedAt: checkpointTime,
    })),
    ...(hasOutOfSandboxOrGovernanceBlocker ? [{
      gate: 'out-of-sandbox-or-governance-blocker',
      status: 'out_of_authority',
      conclusion: 'blocked',
      runId: '',
      jobId: '',
      updatedAt: checkpointTime,
    }] : []),
  ];
  const rejectionItems = unresolvedGateRecords.map((record) => {
    const gate = record.gate || 'unknown';
    if (
      (gate === 'preflight/scope-declaration-parity' || gate === 'preflight/evidence-exactness')
      && scopePresent
      && !scopeCountMatches
    ) {
      const firstUndeclaredFile = scopeUndeclaredFiles[0] || 'unable-to-resolve-missing-file';
      return {
        ...record,
        gate,
        firstConcreteRejection: `Scope declaration mismatch: declared FILES_CHANGED=${scopeCount || 0}, actual diff=${changedFiles.length}; missing scope entry ${firstUndeclaredFile}.`,
        rejectionType: 'SCOPE_DECLARATION_MISMATCH',
        requiredAction: scopeUndeclaredFiles.length > 0
          ? `Update scope/manifest to include missing file(s): ${scopeUndeclaredFiles.join(', ')} or revert unintended file changes, then rerun preflight.`
          : `Update scope declaration to match current diff count (${changedFiles.length}) or revert unintended file changes, then rerun preflight.`,
      };
    }
    if (gate === 'preflight/product-delivery-gates') {
      return {
        ...record,
        gate,
        firstConcreteRejection: 'Product-delivery gate failed for current HEAD; required product journey validation is not green.',
        rejectionType: 'PRODUCT_DELIVERY_GATE_FAILURE',
        requiredAction: 'Implement product fix for the failing journey evidence and rerun preflight/product-delivery-gates.',
      };
    }
    if (record.status === 'missing') {
      return {
        ...record,
        gate,
        firstConcreteRejection: `Required gate ${gate} is missing for current HEAD.`,
        rejectionType: 'MISSING_REQUIRED_GATE',
        requiredAction: `Run the missing gate ${gate} on current HEAD and consume its output before handover posture.`,
      };
    }
    if (record.status === 'pending') {
      return {
        ...record,
        gate,
        firstConcreteRejection: `Required gate ${gate} is pending for current HEAD.`,
        rejectionType: 'PENDING_REQUIRED_GATE',
        requiredAction: `Wait for ${gate} to complete and consume the resulting gate output before handover posture.`,
      };
    }
    if (record.status === 'failed_affected_gate') {
      return {
        ...record,
        gate,
        firstConcreteRejection: `Affected product journey gate ${gate} is not green for current HEAD.`,
        rejectionType: 'FAILED_AFFECTED_PRODUCT_GATE',
        requiredAction: `Fix the failing product journey for ${gate} and rerun affected delivery gates before handover posture.`,
      };
    }
    if (record.status === 'out_of_authority') {
      return {
        ...record,
        gate,
        firstConcreteRejection: `Out-of-authority blocker reported: ${outOfSandboxOrGovernanceBlocker}.`,
        rejectionType: 'OUT_OF_AUTHORITY_BLOCKER',
        requiredAction: `Escalate to CS2: ${outOfSandboxOrGovernanceBlocker}.`,
      };
    }
    return {
      ...record,
      gate,
      firstConcreteRejection: `Gate ${gate} reported ${record.conclusion || 'failure'} on current HEAD.`,
      rejectionType: 'FAILED_REQUIRED_GATE',
      requiredAction: `Inspect ${gate} logs, implement corrective action, and rerun the gate before any handover claim.`,
    };
  });
  const failedGateLogConsumptionRequired = rejectionItems.length > 0;
  const failedGateLogConsumption = failedGateLogConsumptionRequired ? 'no' : 'not_required';
  const unresolvedRejections = rejectionItems.length > 0
    ? rejectionItems.map((item) => item.gate).join(', ')
    : 'none';
  const qaRejectionPackageResult = rejectionItems.length === 0
    ? 'HANDOVER_ALLOWED'
    : (hasOutOfSandboxOrGovernanceBlocker ? 'CS2_INTERVENTION_REQUIRED' : 'STOP_AND_FIX');
  const qaRejectionPackageHandoverAllowed = rejectionItems.length === 0 ? 'yes' : 'no';
  const latestFailedGateAt = rejectionItems
    .map((item) => new Date(item.updatedAt || 0).getTime())
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((left, right) => right - left)[0];
  const qaPackageUpdatedAt = latestFailedGateAt
    ? new Date(Math.max(latestFailedGateAt, new Date(checkpointTime).getTime() || 0)).toISOString()
    : checkpointTime;

  if (!scopePresent && (requiresIaa || requiresEcap || productDeliveryRequired)) {
    reasons.push('Per-PR scope declaration missing.');
  } else if (scopePresent && !scopeCountMatches) {
    if (scopeUndeclaredFiles.length > 0) {
      reasons.push(`Scope declaration FILES_CHANGED (${scopeCount}) does not match current diff (${changedFiles.length}); missing file(s): ${scopeUndeclaredFiles.join(', ')}.`);
    } else {
      reasons.push(`Scope declaration FILES_CHANGED (${scopeCount}) does not match current diff (${changedFiles.length}).`);
    }
  }

  if (!manifestPath) reasons.push('PR admin manifest missing.');
  if (!activeIdentityBindingPass) {
    reasons.push(`Active PR identity binding mismatch detected: ${identityMismatchFindings.join(' | ')}`);
  }
  if (!mergeConflictChecked) reasons.push('Merge conflict check was not completed for current HEAD/base.');
  if (mergeConflictChecked && !mergeableWithBase) reasons.push('PR is not mergeable with base (merge conflicts unresolved).');
  if (mergeConflictChecked && !baseSyncedOrConflictsResolved) reasons.push('Base sync / conflict-resolution check failed.');
  if (checks.noChecksAtAll) reasons.push('No required checks were found for current HEAD.');
  if (checks.failing.length > 0) reasons.push(`Failing checks present: ${checks.failing.join(', ')}`);
  if (checks.pending.length > 0) reasons.push(`Pending checks present: ${checks.pending.join(', ')}`);
  if (checks.missing.length > 0) reasons.push(`Missing checks present: ${checks.missing.join(', ')}`);
  if (failedAffectedGates.length > 0) reasons.push(`Affected product journey gates are failing, pending, or missing: ${failedAffectedGates.join(', ')}`);

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
    if (reviewOrHandoverClaimed) {
      if (!preflightBriefPresent) reasons.push('IAA pre-flight brief artifact missing.');
      else if (!preflightBriefCurrent) reasons.push('IAA pre-flight brief artifact is stale for current HEAD.');
    }
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
  if (sourceStringOnlyEvidence) {
    reasons.push('Route/handoff/compile/publish/upload/generate/context-handoff changes require behavioral gate/evidence signal. Source-string-only evidence is insufficient.');
  }
  if (reviewOrHandoverClaimed && checklistItems.unchecked.length > 0) {
    reasons.push(`Unchecked PR checklist items remain: ${checklistItems.unchecked.map((item) => item.text).join(', ')}`);
  }
  if (injectionState === 'missing') {
    reasons.push('Injection intake missing for current PR state.');
  } else if (injectionState === 'stale') {
    reasons.push('Injection intake is stale for current HEAD.');
  } else if (injectionState === 'dirty') {
    reasons.push('Injection intake is dirty because newer relevant PR instructions/signals exist.');
  }

  if (activeArtifactsReportFailOrNo) reasons.push('An active artifact still reports FAIL or *_PASS/HANDOVER_ALLOWED: no.');
  if (hasOutOfSandboxOrGovernanceBlocker) {
    reasons.push(`I could not pass all gates because ${outOfSandboxOrGovernanceBlocker}. CS2 intervention needed.`);
  }
  if (staleShaFound && !reasons.some((reason) => reason.toLowerCase().includes('stale'))) {
    reasons.push('One or more active artifacts are stale against current HEAD.');
  }

  let nextRequiredControl = 'none';
  if (injectionState !== 'current') {
    nextRequiredControl = 'REFRESH_INJECTION_INTAKE';
  } else if (reviewOrHandoverClaimed && checklistItems.unchecked.length > 0) {
    nextRequiredControl = 'RESOLVE_PR_CHECKLIST_ITEMS';
  } else if (
    reviewOrHandoverClaimed &&
    requiresIaa &&
    ecapSatisfiedOrValidlyWaived &&
    (!preflightBriefPresent || !preflightBriefCurrent)
  ) {
    nextRequiredControl = 'IAA_PREFLIGHT_BRIEFING';
  } else if (requiresEcap && !ecapSatisfiedOrValidlyWaived) {
    nextRequiredControl = 'ECAP_GATE_AND_ADMIN_REPORT';
  } else if (requiresIaa && !iaaSatisfiedOrValidlyWaived) {
    nextRequiredControl = 'IAA_FINAL_ASSURANCE';
  } else if (builderQaRequired && !builderQaInvoked) {
    nextRequiredControl = 'BUILDER_QA_FUNCTIONAL_EVIDENCE';
  } else if (!localGatesPassing) {
    nextRequiredControl = 'CURRENT_HEAD_GATES_GREEN';
  }

  let handoverAllowed = reasons.length === 0;
  let result = handoverAllowed
    ? 'HANDOVER_ALLOWED'
    : (hasOutOfSandboxOrGovernanceBlocker ? 'CS2_INTERVENTION_REQUIRED' : 'STOP_AND_FIX');
  let reason = handoverAllowed ? 'All current-head checkpoint requirements satisfied.' : reasons.join(' ');
  if (intakeOnly && handoverAllowed) {
    handoverAllowed = false;
    result = 'INJECTION_INTAKE_CURRENT';
    reason = 'Injection intake refreshed for current PR state. Formal review/handover claim still required.';
  }

  const hasFailedGateSignal = failedGateSignalTimes.length > 0;
  const unresolvedPostFailureItems = hasFailedGateSignal && !handoverAllowed;
  const postFailurePackageType = hasFailedGateSignal ? 'POST_FAILURE_REJECTION_PACKAGE' : 'not_required';
  const postFailurePackageState = !hasFailedGateSignal
    ? 'not_required'
    : (unresolvedPostFailureItems ? 'QA_REJECTION_PACKAGE_STATUS' : 'QA_REJECTION_PACKAGE_CLOSURE');
  const qaRejectionPackageClosureAllowed = postFailurePackageState === 'QA_REJECTION_PACKAGE_CLOSURE' ? 'yes' : 'no';

  const fields = {
    PR: prNumber ? `#${prNumber}` : 'unknown',
    ISSUE: issueNumber ? `#${issueNumber}` : 'unknown',
    GOVERNING_ISSUE: issueNumber ? `#${issueNumber}` : 'unknown',
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
    INJECTION_INTAKE_STATUS: injectionIntakeStatus,
    CS2_COMMENTS_DETECTED: cs2CommentTimes.length > 0 ? 'yes' : 'no',
    PR_CHECKLIST_ITEMS_DETECTED: checklistItems.all.length > 0 ? 'yes' : 'no',
    FAILED_GATE_COMMENTS_DETECTED: failedGateSignalTimes.length > 0 ? 'yes' : 'no',
    POST_FAILURE_HANDLING_PACKAGE: postFailurePackageType,
    POST_FAILURE_REJECTION_PACKAGE_STATE: postFailurePackageState,
    QA_REJECTION_PACKAGE_CLOSURE_ALLOWED: qaRejectionPackageClosureAllowed,
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
    IAA_PREFLIGHT_BRIEF_PRESENT: yesNoNotRequired(preflightBriefPresent, requiresIaa),
    IAA_PREFLIGHT_BRIEF_CURRENT: yesNoNotRequired(preflightBriefCurrent, requiresIaa),
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
    PRODUCT_JOURNEY_CLASSIFICATION: journey.labels.length ? journey.labels.join(', ') : 'none',
    PRODUCER_SIDE_GATES_REQUIRED: producerSideGatesRequired.length ? producerSideGatesRequired.join(', ') : 'none',
    NEXT_REQUIRED_CONTROL: nextRequiredControl,
    AFFECTED_PRODUCT_GATES_REQUIRED: affectedProductGatesRequired.length ? affectedProductGatesRequired.join(', ') : 'none',
    FAILED_AFFECTED_GATES: failedAffectedGates.length ? failedAffectedGates.join(', ') : 'none',
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
    LATEST_INJECTION_INTAKE_SHA: latestInjectionIntakeSha || 'none',
    LATEST_INJECTION_INTAKE_AT: latestInjectionIntakeAt || 'none',
    LATEST_RELEVANT_INSTRUCTION_AT: latestRelevantInstructionAt || 'none',
    LATEST_INJECTION_INTAKE_AFTER_LAST_CS2_COMMENT: latestInjectionIntakeAfterLastCs2Comment ? 'yes' : 'no',
    LATEST_INJECTION_INTAKE_AFTER_LAST_PR_BODY_EDIT: latestInjectionIntakeAfterLastPrBodyEdit ? 'yes' : 'no',
    LATEST_INJECTION_INTAKE_AFTER_LAST_FAILED_GATE_SIGNAL: latestInjectionIntakeAfterLastFailedGateSignal ? 'yes' : 'no',
    INJECTION_STATE: injectionState,
    OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER: hasOutOfSandboxOrGovernanceBlocker ? outOfSandboxOrGovernanceBlocker : 'none',
    FAILED_GATE_LOG_CONSUMPTION: failedGateLogConsumption,
    QA_REJECTION_PACKAGE_REQUIRED: failedGateLogConsumptionRequired ? 'yes' : 'no',
    QA_REJECTION_PACKAGE_CURRENT_HEAD_SHA: headSha,
    QA_REJECTION_PACKAGE_UPDATED_AT: qaPackageUpdatedAt,
    QA_REJECTION_PACKAGE_UNRESOLVED_REJECTIONS: unresolvedRejections,
    QA_REJECTION_PACKAGE_OUT_OF_AUTHORITY_ITEMS: hasOutOfSandboxOrGovernanceBlocker ? outOfSandboxOrGovernanceBlocker : 'none',
    QA_REJECTION_PACKAGE_RESULT: qaRejectionPackageResult,
    QA_REJECTION_PACKAGE_HANDOVER_ALLOWED: qaRejectionPackageHandoverAllowed,
    QA_REJECTION_PACKAGE_STATUS: rejectionItems.length === 0 ? 'closed' : 'open',
    ACTIVE_PR_IDENTITY_BINDING: activeIdentityBindingPass ? 'PASS' : 'FAIL',
    ACTIVE_PR_IDENTITY_BINDING_FINDINGS: identityMismatchFindings.length ? identityMismatchFindings.join(' | ') : 'none',
    HANDOVER_ALLOWED: handoverAllowed ? 'yes' : 'no',
    RESULT: result,
    REQUIRED_ACTION: result,
    REASON: reason,
  };

  const fieldLines = Object.entries(fields).map(([key, value]) => `${key}: ${commentBodyValue(value)}`);
  const failedGateConsumptionLines = [
    '',
    'FAILED_GATE_LOG_CONSUMPTION',
    `CURRENT_HEAD_SHA: ${headSha}`,
    'FAILED_GATES:',
    ...(rejectionItems.length === 0 ? ['- none'] : rejectionItems.flatMap((item) => [
      `- gate: ${item.gate}`,
      `  run_id: ${item.runId || 'unknown'}`,
      `  job_id: ${item.jobId || 'unknown'}`,
      `  job_log_inspected: no`,
      `  first_concrete_rejection: ${item.firstConcreteRejection}`,
      `  rejection_type: ${item.rejectionType}`,
      `  required_action: ${item.requiredAction}`,
    ])),
  ];
  const qaRejectionPackageLines = [
    '',
    'QA_REJECTION_PACKAGE',
    `CURRENT_HEAD_SHA: ${headSha}`,
    'FAILED_GATES:',
    ...(rejectionItems.length === 0 ? ['- none'] : rejectionItems.flatMap((item) => [
      `- gate: ${item.gate}`,
      `  concrete_rejection: ${item.firstConcreteRejection}`,
      `  rejection_type: ${item.rejectionType}`,
      `  required_action: ${item.requiredAction}`,
      `  within_agent_authority: ${hasOutOfSandboxOrGovernanceBlocker ? 'no' : 'yes'}`,
      `  planned_resolution: ${hasOutOfSandboxOrGovernanceBlocker ? `Escalate blocker: ${outOfSandboxOrGovernanceBlocker}` : item.requiredAction}`,
    ])),
    `UNRESOLVED_REJECTIONS: ${unresolvedRejections}`,
    `OUT_OF_AUTHORITY_ITEMS: ${hasOutOfSandboxOrGovernanceBlocker ? outOfSandboxOrGovernanceBlocker : 'none'}`,
    `RESULT: ${qaRejectionPackageResult}`,
    `HANDOVER_ALLOWED: ${qaRejectionPackageHandoverAllowed}`,
  ];
  const qaRejectionPackageStatusLines = [
    '',
    'QA_REJECTION_PACKAGE_STATUS',
    `CURRENT_HEAD_SHA: ${headSha}`,
    `STATUS: ${rejectionItems.length === 0 ? 'closed' : 'open'}`,
    'REJECTION_ITEMS:',
    ...(rejectionItems.length === 0 ? ['- none'] : rejectionItems.flatMap((item) => [
      `- gate: ${item.gate}`,
      `  rejection: ${item.firstConcreteRejection}`,
      `  action_taken: ${hasOutOfSandboxOrGovernanceBlocker ? `Escalated to CS2 (${outOfSandboxOrGovernanceBlocker})` : 'Pending remediation and gate rerun'}`,
      `  evidence: ${item.runId || item.jobId ? `run_id=${item.runId || 'unknown'} job_id=${item.jobId || 'unknown'}` : 'not_available'}`,
      `  status: ${hasOutOfSandboxOrGovernanceBlocker ? 'escalated' : 'unresolved'}`,
    ])),
    'RERUN_GATES:',
    ...(rejectionItems.length === 0 ? ['- none'] : rejectionItems.flatMap((item) => [
      `- gate: ${item.gate}`,
      '  status: pending',
      '  run_id_or_evidence: pending',
      '  current_head_match: yes',
    ])),
    `REMAINING_REJECTIONS: ${unresolvedRejections}`,
    `RESULT: ${qaRejectionPackageResult}`,
    `HANDOVER_ALLOWED: ${qaRejectionPackageHandoverAllowed}`,
  ];
  const body = [
    CHECKPOINT_MARKER,
    '## PRE_HANDOVER_CHECKPOINT_RESULT',
    '',
    ...fieldLines,
    ...failedGateConsumptionLines,
    ...qaRejectionPackageLines,
    ...qaRejectionPackageStatusLines,
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
  isFailedGateSignalComment,
  hasExplicitReviewOrHandoverSignal,
  parseJsonInput,
  readJson,
  safeRead,
};

if (require.main === module) {
  const result = evaluateCheckpoint();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
