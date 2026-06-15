#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = process.cwd();
const workflowSha = process.env.GITHUB_SHA || '';
const prHeadSha = process.env.PR_HEAD_SHA || workflowSha;
const prBaseSha = process.env.PR_BASE_SHA || '';

const ecapOutputPattern = /(^|\/)\.agent-workspace\/execution-ceremony-admin-agent\/bundles\/.*\.(md|txt|json|yml|yaml)$|(^|\/)\.agent-admin\/prehandover\/ecap.*\.(md|txt|json|yml|yaml)$/i;
const ecapBoundarySourcePattern = /(^|\/)governance\/templates\/execution-ceremony-admin\/.*\.(md|txt|json|yml|yaml)$|(^|\/)governance\/checklists\/execution-ceremony-admin.*\.(md|txt|json|yml|yaml)$|(^|\/)\.agent-workspace\/execution-ceremony-admin-agent\/knowledge\/.*\.(md|txt|json|yml|yaml)$|(^|\/)\.agent-admin\/control\/templates\/ECAP_ADMIN_VALIDATION_SUMMARY\.template\.md$|(^|\/)\.agent-admin\/control\/overlays\/WAVE4_ECAP_ADMIN_BOUNDARY\.md$|(^|\/)\.agent-admin\/control\/schemas\/ecap-admin-validation\.schema\.json$/i;

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

const requiredBoundaryFieldPatterns = [
  /(?:^|[\s{,])['"]?substantive_readiness_judgment_made['"]?\s*[:=]\s*false\b/i,
  /(?:^|[\s{,])['"]?iaa_invoked_by_ecap['"]?\s*[:=]\s*false\b/i,
  /(?:^|[\s{,])['"]?foreman_qp_judgment_rewritten['"]?\s*[:=]\s*false\b/i,
];

const requiredBoundaryFieldNames = [
  'substantive_readiness_judgment_made',
  'iaa_invoked_by_ecap',
  'foreman_qp_judgment_rewritten',
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
    requiredBoundaryFieldPatterns.forEach((pattern, index) => {
      if (!pattern.test(body)) {
        findings.push(`${file}: ECAP admin validation output is missing boundary declaration '${requiredBoundaryFieldNames[index]}: false' in YAML or JSON form`);
      }
    });
  }
  return findings;
}

function inspectBoundaryGuidance(files) {
  const findings = [];
  const guidanceFiles = files.filter((file) => ecapBoundarySourcePattern.test(file));
  for (const file of guidanceFiles) {
    const body = readFile(file);
    const hasAdminOnlyBoundary = /administrative|admin/i.test(body) && /(must not|may not|prohibited|forbidden|const\s*[:=]\s*false)/i.test(body);
    if (!hasAdminOnlyBoundary) {
      findings.push(`${file}: ECAP boundary guidance changed without an obvious admin-only boundary statement`);
    }
  }
  return findings;
}

const changedFiles = getChangedFiles();
const ecapOutputFiles = changedFiles.filter((file) => ecapOutputPattern.test(file));
const ecapBoundarySourceFiles = changedFiles.filter((file) => ecapBoundarySourcePattern.test(file));
const ecapRelevantFiles = [...new Set([...ecapOutputFiles, ...ecapBoundarySourceFiles])];

console.log('=== ECAP Admin Boundary Gate ===');
console.log(`Workflow SHA: ${workflowSha || 'unknown'}`);
console.log(`PR head SHA: ${prHeadSha || 'unknown'}`);
console.log(`PR base SHA: ${prBaseSha || 'unknown'}`);
console.log(`Changed files: ${changedFiles.length}`);
console.log(`ECAP output files changed: ${ecapOutputFiles.length}`);
console.log(`ECAP boundary source files changed: ${ecapBoundarySourceFiles.length}`);

if (ecapRelevantFiles.length === 0) {
  console.log('No ECAP output/template/knowledge files changed. ECAP admin boundary gate passes.');
  process.exit(0);
}

const forbiddenFindings = inspectForbiddenLanguage(ecapOutputFiles);
const boundaryFindings = inspectBoundaryDeclarations(ecapOutputFiles);
const guidanceFindings = inspectBoundaryGuidance(ecapBoundarySourceFiles);
const findings = [...forbiddenFindings, ...boundaryFindings, ...guidanceFindings];

if (findings.length > 0) {
  console.error('ECAP admin boundary gate failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  console.error('STOP_AND_FIX: ECAP must remain administrative only. Replace readiness/assurance language in ECAP output with ADMIN_VALIDATED or ADMIN_BLOCKED, return substantive findings to Foreman, and do not invoke IAA or decide build/merge readiness. Forbidden-language examples inside control overlays/templates are allowed only as rule documentation, not as ECAP output.');
  process.exit(1);
}

console.log('ECAP admin boundary gate passed.');
