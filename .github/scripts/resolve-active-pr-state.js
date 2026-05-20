#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function git(args) {
  try {
    return cp.execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function normalize(value) {
  return String(value || '').trim();
}

function parsePrContext() {
  const event = process.env.GITHUB_EVENT_PATH ? readJson(process.env.GITHUB_EVENT_PATH) : null;
  const pr = event && event.pull_request ? event.pull_request : null;

  const prNumber = Number(process.env.PR_NUMBER || pr?.number || 0) || null;
  const branch = normalize(process.env.BRANCH || process.env.HEAD_REF || pr?.head?.ref || git(['branch', '--show-current']));
  const runtimeHeadSha = normalize(process.env.HEAD_SHA || pr?.head?.sha || git(['rev-parse', 'HEAD']));
  const baseSha = normalize(process.env.BASE_SHA || pr?.base?.sha);
  const baseRef = normalize(process.env.BASE_REF || pr?.base?.ref);

  return { prNumber, branch, runtimeHeadSha, baseSha, baseRef, event, pr };
}

function parseSimpleField(text, key) {
  const source = String(text || '');
  const match = source.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : '';
}

function legacyWaveTasksMatchesContext(legacyPath, prNumber, branch) {
  if (!fileExists(legacyPath)) return false;
  const text = fs.readFileSync(legacyPath, 'utf8');
  const legacyPr = parseSimpleField(text, 'PR').replace(/^#/, '');
  const legacyBranch = parseSimpleField(text, 'Branch');
  if (!prNumber || !branch) return false;
  if (!legacyPr || !legacyBranch) return false;
  return String(legacyPr) === String(prNumber) && legacyBranch === branch;
}

function parseWaveTasksPathCandidate(prNumber, branch) {
  const prScoped = prNumber ? `.agent-admin/prs/pr-${prNumber}/wave-current-tasks.md` : '';
  const legacy = '.agent-workspace/foreman-v2/personal/wave-current-tasks.md';
  if (prScoped && fileExists(prScoped)) return prScoped;
  if (legacyWaveTasksMatchesContext(legacy, prNumber, branch)) return legacy;
  return prScoped || legacy;
}

function getChangedFiles(baseSha, runtimeHeadSha) {
  if (process.env.CHANGED_FILES_JSON) {
    try {
      const parsed = JSON.parse(process.env.CHANGED_FILES_JSON);
      if (Array.isArray(parsed)) {
        return [...new Set(parsed.map((v) => normalize(v)).filter(Boolean))];
      }
    } catch {
      // ignore
    }
  }

  let diff = '';
  if (baseSha && runtimeHeadSha) {
    diff = git(['diff', '--name-only', `${baseSha}...${runtimeHeadSha}`])
      || git(['diff', '--name-only', baseSha, runtimeHeadSha]);
  }
  if (!diff && baseSha) {
    diff = git(['diff', '--name-only', `${baseSha}...HEAD`]) || git(['diff', '--name-only', baseSha, 'HEAD']);
  }
  if (!diff) {
    diff = git(['diff', '--name-only', 'HEAD~1', 'HEAD']);
  }

  if (!diff) return [];
  return [...new Set(diff.split('\n').map((line) => line.trim()).filter(Boolean))];
}

function classifyDelta(changedFiles) {
  const isAdminOnlyPath = (file) => (
    /^\.admin\//.test(file)
    || /^\.agent-admin\//.test(file)
    || /^\.agent-workspace\//.test(file)
    || /^\.functional-delivery\//.test(file)
    || /^governance\//.test(file)
    || /^docs\//.test(file)
    || /^README/i.test(file)
    || /^CHANGELOG/i.test(file)
    || /(^|\/)PREHANDOVER-.*\.md$/i.test(file)
  );

  const isGateChangePath = (file) => (
    /^\.github\/(workflows|scripts)\//.test(file)
    || /^governance\/templates\//.test(file)
    || /^governance\/checklists\//.test(file)
    || file === 'governance/CANON_INVENTORY.json'
  );

  const isSubstantivePath = (file) => (
    /^(apps|modules|packages|api)\//.test(file)
    || /^supabase\/(functions|migrations)\//.test(file)
    || /\.(ts|tsx|js|jsx|py|go|java|rb|rs|sql)$/i.test(file)
  );

  const hasGateChange = changedFiles.some(isGateChangePath);
  const hasSubstantive = changedFiles.some(isSubstantivePath);
  const hasNonAdmin = changedFiles.some((f) => !isAdminOnlyPath(f));
  const adminOnly = changedFiles.length > 0 && changedFiles.every(isAdminOnlyPath) && !hasGateChange;

  const rebaseOnly = changedFiles.length === 0;

  let deltaType = 'REBASE_ONLY_DELTA';
  if (hasGateChange) {
    deltaType = 'GATE_CHANGE_DELTA';
  } else if (hasSubstantive || hasNonAdmin) {
    deltaType = 'SUBSTANTIVE_DELTA';
  } else if (adminOnly) {
    deltaType = 'ADMIN_ONLY_DELTA';
  }

  return {
    deltaType,
    rebaseOnlyDelta: deltaType === 'REBASE_ONLY_DELTA',
    adminOnlyDelta: deltaType === 'ADMIN_ONLY_DELTA',
    gateChangeDelta: deltaType === 'GATE_CHANGE_DELTA',
    substantiveDelta: deltaType === 'SUBSTANTIVE_DELTA',
    changedFiles,
  };
}

function firstCommitEpochForPaths(baseSha, paths) {
  if (!baseSha || !paths || paths.length === 0) return null;
  const cleaned = paths.filter(Boolean);
  if (cleaned.length === 0) return null;
  const out = git(['log', '--reverse', '--format=%ct', `${baseSha}..HEAD`, '--', ...cleaned]);
  if (!out) return null;
  const first = Number(out.split('\n').map((v) => v.trim()).find(Boolean));
  return Number.isFinite(first) ? first : null;
}

function lastCommitEpochForPath(pathname) {
  if (!pathname || !fileExists(pathname)) return null;
  const out = git(['log', '-1', '--format=%ct', 'HEAD', '--', pathname]);
  const epoch = Number(out || 0);
  return Number.isFinite(epoch) && epoch > 0 ? epoch : null;
}

function resolveState() {
  const context = parsePrContext();
  const { prNumber, branch, runtimeHeadSha, baseSha } = context;

  const manifestPath = prNumber ? `.admin/prs/pr-${prNumber}.json` : '.admin/pr.json';
  const scopePath = prNumber ? `.agent-admin/scope-declarations/pr-${prNumber}.md` : '';
  const activeStatePath = prNumber ? `.agent-admin/prs/pr-${prNumber}/active-state.json` : '.agent-admin/prs/pr-unknown/active-state.json';
  const waveTasksPath = parseWaveTasksPathCandidate(prNumber, branch);

  const manifest = fileExists(manifestPath) ? readJson(manifestPath) : null;
  const scopeText = scopePath && fileExists(scopePath) ? fs.readFileSync(scopePath, 'utf8') : '';
  const activeStateFromFile = fileExists(activeStatePath) ? readJson(activeStatePath) : null;
  const waveTasksText = waveTasksPath && fileExists(waveTasksPath) ? fs.readFileSync(waveTasksPath, 'utf8') : '';

  const iaaArtifactPath = normalize(
    activeStateFromFile?.iaa_artifact_path
      || parseSimpleField(waveTasksText, 'iaa_wave_record_path')
      || parseSimpleField(waveTasksText, 'iaa_prebrief_path')
      || parseSimpleField(waveTasksText, 'IAA_PREFLIGHT_BRIEF_PATH')
  );

  const ecapArtifactPath = normalize(
    activeStateFromFile?.ecap_artifact_path
      || parseSimpleField(waveTasksText, 'ecap_bundle_path')
      || parseSimpleField(waveTasksText, 'ecap_reconciliation_summary_path')
  );

  const changedFiles = getChangedFiles(baseSha, runtimeHeadSha);
  const delta = classifyDelta(changedFiles);

  const manifestMissing = prNumber ? !fileExists(manifestPath) : false;
  const scopeMissing = prNumber ? !scopePath || !fileExists(scopePath) : false;
  const waveMissing = waveTasksPath ? !fileExists(waveTasksPath) : false;
  const bootstrapRequired = manifestMissing || scopeMissing || waveMissing;

  const manifestPr = Number(manifest?.pr || 0) || null;
  const manifestBranch = normalize(manifest?.branch);
  const scopePr = Number(parseSimpleField(scopeText, 'PR_NUMBER') || 0) || null;
  const scopeBranch = normalize(parseSimpleField(scopeText, 'BRANCH'));

  const contradictions = [];
  if (prNumber && manifestPr && manifestPr !== prNumber) contradictions.push(`manifest pr=${manifestPr} != ${prNumber}`);
  if (prNumber && scopePr && scopePr !== prNumber) contradictions.push(`scope PR_NUMBER=${scopePr} != ${prNumber}`);
  if (branch && manifestBranch && manifestBranch !== branch) contradictions.push(`manifest branch=${manifestBranch} != ${branch}`);
  if (branch && scopeBranch && scopeBranch !== branch) contradictions.push(`scope BRANCH=${scopeBranch} != ${branch}`);

  const requiresEvidence = delta.substantiveDelta || delta.gateChangeDelta;
  const evidenceMissing = requiresEvidence && (!iaaArtifactPath || !fileExists(iaaArtifactPath));

  const evidenceEpoch = iaaArtifactPath ? lastCommitEpochForPath(iaaArtifactPath) : null;
  const changedEpoch = firstCommitEpochForPaths(baseSha, changedFiles);
  const evidenceStale = Boolean(requiresEvidence && evidenceEpoch && changedEpoch && evidenceEpoch < changedEpoch);

  let nextRequiredAction = 'PASS';
  if (contradictions.length > 0) {
    nextRequiredAction = 'BLOCKED';
  } else if (bootstrapRequired) {
    nextRequiredAction = 'BOOTSTRAP_REQUIRED';
  } else if (evidenceMissing) {
    nextRequiredAction = 'EVIDENCE_REQUIRED';
  } else if (evidenceStale) {
    nextRequiredAction = 'EVIDENCE_STALE';
  }

  return {
    pr: prNumber,
    branch,
    runtime_head_sha: runtimeHeadSha,
    base_sha: baseSha,
    manifest_path: manifestPath,
    scope_path: scopePath,
    active_state_path: activeStatePath,
    wave_tasks_path: waveTasksPath,
    iaa_artifact_path: iaaArtifactPath,
    ecap_artifact_path: ecapArtifactPath,
    bootstrap_required: bootstrapRequired,
    rebase_only_delta: delta.rebaseOnlyDelta,
    admin_only_delta: delta.adminOnlyDelta,
    substantive_delta_after_evidence: evidenceStale && delta.substantiveDelta,
    gate_change_delta: delta.gateChangeDelta,
    next_required_action: nextRequiredAction,
    delta_type: delta.deltaType,
    contradictions,
    changed_files: changedFiles,
  };
}

function main() {
  const state = resolveState();

  const outputPath = process.env.ACTIVE_STATE_OUTPUT_PATH
    || process.argv.slice(2).find((arg) => arg.startsWith('--output='))?.replace('--output=', '')
    || '';

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `next_required_action=${state.next_required_action}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `active_state_path=${outputPath || state.active_state_path}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `delta_type=${state.delta_type}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `bootstrap_required=${state.bootstrap_required ? 'true' : 'false'}\n`);
  }

  process.stdout.write(`${JSON.stringify(state, null, 2)}\n`);
}

main();
