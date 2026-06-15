#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = process.cwd();
const workflowSha = process.env.GITHUB_SHA || '';
const prHeadSha = process.env.PR_HEAD_SHA || workflowSha;
const prBaseSha = process.env.PR_BASE_SHA || '';

const ecapOutputPattern = /(^|\/)\.agent-workspace\/execution-ceremony-admin-agent\/bundles\/.*\.(md|txt|json|yml|yaml)$|(^|\/)\.agent-admin\/prehandover\/ecap.*\.(md|txt|json|yml|yaml)$/i;
const ecapBoundarySourcePattern = /(^|\/)governance\/templates\/execution-ceremony-admin\/.*\.(md|txt|json|yml|yaml)$|(^|\/)governance\/checklists\/execution-ceremony-admin.*\.(md|txt|json|yml|yaml)$|(^|\/)\.agent-workspace\/execution-ceremony-admin-agent\/knowledge\/.*\.(md|txt|json|yml|yaml)$/i;

const forbiddenSubstantivePatterns = [
  /\bready\s+for\s+IAA\b/i,
  /\bready\s+for\s+merge\b/i,
  /\bmerge-ready\b/i,
  /\bbuild\s+ready\b/i,
  /\bimplementation\s+complete\b/i,
  /\bI\s+invoked\s+IAA\b/i,
  /\bECAP\s+invoked\s+IAA\b/i,
  /\bassurance[-\s]?token\b/i,
  /\brejection[-\s]?package\b/i,
  /\bsubstantive\s+readiness\s*:\s*(PASS|APPROVED|READY)\b/i,
  /\bbuild\s+quality\s*:\s*(PASS|APPROVED|READY)\b/i,
];

const requiredBoundaryPhrases = [
  'substantive_readiness_judgment_made: false',
  'iaa_invoked_by_ecap: false',
  'foreman_qp_judgment_rewritten: false',
];

function fail(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`::warning::${message}`);
}

function runGit(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function getChangedFiles() {
  if (process.env.CHANGED_FILES && process.env.CHANGED_FILES.trim()) {
    return process.env.CHANGED_FILES.split(/\r?\n/).map((file) => file.trim()).filter(Boolean);
  }

  if (prBaseSha && prHeadSha) {
    try {
      return runGit(['diff', '--name-only', `${prBaseSha}...${prHeadSha}`])
        .split(/\r?\n/)
        .map((file) => file.trim())
        .filter(Boolean);
    } catch (error) {
      warn(`Could not diff PR base/head (${prBaseSha}...${prHeadSha}): ${error.message}`);
    }
  }

  try {
    return runGit(['diff', '--name-only', 'HEAD~1', 'HEAD'])
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter(Boolean);
  } catch (error) {
    warn(`Could not determine changed files from git fallback: ${error.message}`);
    return [];
  }
}

function readFile(file) {
  try {
    return fs.readFileSync(path.join(repoRoot, file), 'utf8');
  } catch (error) {
    warn(`Could not read ${file}: ${error.message}`);
    return '';
  }
}

function inspectForbiddenLanguage(files) {
  const findings = [];
  for (const file of files) {
    const body = readFile(file);
    for (const pattern of forbiddenSubstantivePatterns) {
      if (pattern.test(body)) {
        findings.push(`${file}: forbidden substantive/assurance-readiness wording matched ${pattern}`);
      }
    }
  }
  return findings;
}

function inspectBoundaryDeclarations(files) {
  const findings = [];
  const outputFiles = files.filter((file) => ecapOutputPattern.test(file));
  for (const file of outputFiles) {
    const body = readFile(file);
    const hasAdminValidationBlock = /ecap_admin_validation|ECAP Administrative Validation Summary|admin_validation_result/i.test(body);
    if (!hasAdminValidationBlock) continue;
    for (const phrase of requiredBoundaryPhrases) {
      if (!body.includes(phrase)) {
        findings.push(`${file}: ECAP admin validation output is missing boundary declaration '${phrase}'`);
      }
    }
  }
  return findings;
}

const changedFiles = getChangedFiles();
const ecapRelevantFiles = changedFiles.filter((file) => ecapOutputPattern.test(file) || ecapBoundarySourcePattern.test(file));

console.log('=== ECAP Admin Boundary Gate ===');
console.log(`Workflow SHA: ${workflowSha || 'unknown'}`);
console.log(`PR head SHA: ${prHeadSha || 'unknown'}`);
console.log(`PR base SHA: ${prBaseSha || 'unknown'}`);
console.log(`Changed files: ${changedFiles.length}`);
console.log(`ECAP-relevant changed files: ${ecapRelevantFiles.length}`);

if (ecapRelevantFiles.length === 0) {
  console.log('No ECAP output/template/knowledge files changed. ECAP admin boundary gate passes.');
  process.exit(0);
}

const forbiddenFindings = inspectForbiddenLanguage(ecapRelevantFiles);
const boundaryFindings = inspectBoundaryDeclarations(ecapRelevantFiles);
const findings = [...forbiddenFindings, ...boundaryFindings];

if (findings.length > 0) {
  console.error('ECAP admin boundary gate failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  console.error('STOP_AND_FIX: ECAP must remain administrative only. Replace readiness/assurance language with ADMIN_VALIDATED or ADMIN_BLOCKED, return substantive findings to Foreman, and do not invoke IAA or decide build/merge readiness.');
  process.exit(1);
}

console.log('ECAP admin boundary gate passed.');
