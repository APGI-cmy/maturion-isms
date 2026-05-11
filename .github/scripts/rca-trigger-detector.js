#!/usr/bin/env node

const RCA_REQUIRED_MARKER = '<!-- rca-required-marker -->';
const RCA_AGENT = 'root-cause-corrective-action-agent';
const RCA_COMMAND_PATTERN = /\b(RCA_REQUIRED|ROOT_CAUSE_REQUIRED|CONTINUOUS_IMPROVEMENT_REQUIRED)\b/i;
const HANDOVER_CLAIM_PATTERN = /\b(handover(?: claim)?|merge-ready|merge ready|ready to merge|ready for review|ready-for-review|all gates pass|merge gate released)\b/i;
const STOP_AND_FIX_PATTERN = /\b(STOP_AND_FIX|HANDOVER_ALLOWED:\s*no)\b/i;
const BLOCKED_PATTERN = /\bHANDOVER BLOCKED\b/i;

const FAILURE_CLASS_PATTERNS = [
  ['stale-head handover evidence', /\b(stale[-\s]?head|stale\s+current_head_sha|current_head_sha.*stale)\b/i],
  ['stale ECAP/PREHANDOVER evidence', /\b(stale.*(ecap|prehandover)|(ecap|prehandover).*stale)\b/i],
  ['missing ECAP after protected-path changes', /\b(missing\s+ecap|ecap.*missing)\b/i],
  ['missing functional delivery evidence', /\b(missing functional delivery evidence|functional delivery evidence missing|functional_pass:\s*no)\b/i],
  ['missing or pending IAA final assurance', /\b(iaa.*(missing|pending)|iaa final assurance.*(missing|pending|fail))\b/i],
  ['repeated issue-reference / evidence-exactness mismatch', /\b(issue-mismatch|evidence-exactness mismatch)\b/i],
  ['repeated gate-changing PR proof failure', /\b(gate-changing pr rule|gate-changing.*proof failure|gate-changing.*fail)\b/i],
];

function classifyFailureClasses(text) {
  const body = String(text || '');
  return FAILURE_CLASS_PATTERNS.filter(([, pattern]) => pattern.test(body)).map(([name]) => name);
}

function extractSha(text) {
  const body = String(text || '');
  const match = body.match(/\b([0-9a-f]{7,40})\b/i);
  return match ? match[1].toLowerCase() : '';
}

function isHandoverClaim(body) {
  const text = String(body || '');
  if (!text.trim()) return false;
  if (STOP_AND_FIX_PATTERN.test(text)) return false;
  return HANDOVER_CLAIM_PATTERN.test(text);
}

function detectRcaRequirement(input = {}) {
  const prNumber = Number(input.prNumber || 0) || null;
  const headSha = String(input.headSha || '').trim();
  const isDraft = Boolean(input.isDraft);
  const actorLogin = String(input.actorLogin || '').trim();
  const eventName = String(input.eventName || '').trim();
  const commentBody = String(input.commentBody || '');
  const workflowRunName = String(input.workflowRunName || '');
  const workflowRunConclusion = String(input.workflowRunConclusion || '').toLowerCase();
  const comments = Array.isArray(input.comments) ? input.comments : [];

  const cs2Explicit = actorLogin.toLowerCase() === 'apgi-cmy' && RCA_COMMAND_PATTERN.test(commentBody);
  const reviewerExplicit = RCA_COMMAND_PATTERN.test(commentBody) && /\bREQUEST_CHANGES\b/i.test(commentBody);

  const claims = comments.filter((comment) => isHandoverClaim(comment.body || ''));
  const blocked = comments.filter((comment) => BLOCKED_PATTERN.test(String(comment.body || '')));
  const blockedAfterClaim = claims.length > 0 && blocked.some((block) => {
    const blockTime = new Date(block.created_at || 0).getTime();
    return claims.some((claim) => blockTime >= new Date(claim.created_at || 0).getTime());
  });

  const classCounts = new Map();
  const classShas = new Map();
  for (const comment of comments) {
    const classes = classifyFailureClasses(comment.body || '');
    for (const failureClass of classes) {
      classCounts.set(failureClass, (classCounts.get(failureClass) || 0) + 1);
      const sha = extractSha(comment.body || '');
      if (sha) {
        if (!classShas.has(failureClass)) classShas.set(failureClass, new Set());
        classShas.get(failureClass).add(sha);
      }
    }
  }

  const repeatedClass = Array.from(classCounts.entries()).find(([, count]) => count >= 2);
  const staleHeadShaSet = classShas.get('stale-head handover evidence') || new Set();
  const repeatedStaleHeadAfterCorrection =
    (classCounts.get('stale-head handover evidence') || 0) >= 2 &&
    (staleHeadShaSet.size >= 2 || staleHeadShaSet.size === 0);

  const iaaBlockingVerdict = comments.some((comment) =>
    /\bVERDICT:\s*(FAIL|ADMIN_ONLY|PARTIAL_FUNCTIONAL_DELIVERY)\b/i.test(String(comment.body || ''))
  );

  const workflowRunAllowList = new Set([
    'preflight evidence gate',
    'handover claim gate',
    'merge gate interface',
    'polc boundary validation',
    'governance ceremony gate',
  ]);

  const workflowRunFailureAfterClaim =
    eventName === 'workflow_run' &&
    workflowRunConclusion === 'failure' &&
    claims.length > 0 &&
    workflowRunAllowList.has(workflowRunName.toLowerCase());

  const triggers = [];

  if (cs2Explicit) {
    triggers.push({
      trigger: 'CS2 explicit RCA_REQUIRED comment',
      failureClass: 'explicit CS2 RCA requirement',
    });
  }

  if (reviewerExplicit) {
    triggers.push({
      trigger: 'Reviewer REQUEST_CHANGES with RCA_REQUIRED marker',
      failureClass: 'substantive review failure requiring RCA',
    });
  }

  if (blockedAfterClaim && !isDraft) {
    triggers.push({
      trigger: 'Handover Claim Gate posted HANDOVER BLOCKED after handover claim',
      failureClass: 'blocked handover after claim',
    });
  }

  if (workflowRunFailureAfterClaim && !isDraft) {
    triggers.push({
      trigger: `Required CI workflow failed after handover claim (${workflowRunName})`,
      failureClass: 'required CI gate failed after handover claim',
    });
  }

  if (iaaBlockingVerdict) {
    triggers.push({
      trigger: 'IAA posted blocking verdict',
      failureClass: 'IAA assurance failure',
    });
  }

  if (repeatedClass) {
    triggers.push({
      trigger: `Same failure class repeated (${repeatedClass[0]})`,
      failureClass: repeatedClass[0],
    });
  }

  if (repeatedStaleHeadAfterCorrection) {
    triggers.push({
      trigger: 'Repeated stale CURRENT_HEAD_SHA / stale-head evidence after corrective push',
      failureClass: 'stale-head handover evidence',
    });
  }

  const antiBurdenOnlyDraftFirstPass = isDraft && triggers.every((entry) =>
    !/explicit|repeated/i.test(entry.trigger)
  );
  const required = triggers.length > 0 && !antiBurdenOnlyDraftFirstPass;
  const selected = triggers[0] || null;
  const artifactPath = prNumber
    ? `.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-${prNumber}.md`
    : '.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-<PR_NUMBER>.md';

  return {
    required,
    prNumber,
    headSha,
    trigger: selected ? selected.trigger : '',
    failureClass: selected ? selected.failureClass : '',
    allTriggers: triggers,
    artifactPath,
  };
}

function buildRcaRequiredMarker(input = {}) {
  const prNumber = input.prNumber || '<PR_NUMBER>';
  const headSha = input.headSha || '';
  const trigger = input.trigger || '';
  const failureClass = input.failureClass || '';
  const artifactPath = input.artifactPath || `.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-${prNumber}.md`;

  return [
    RCA_REQUIRED_MARKER,
    '## RCA_REQUIRED — Root Cause and Corrective Action Agent invocation required',
    '',
    'RCA_REQUIRED: yes',
    `RCA_AGENT_REQUIRED: ${RCA_AGENT}`,
    `PR: #${prNumber}`,
    `TRIGGER: ${trigger || 'detected trigger condition'}`,
    `FAILURE_CLASS: ${failureClass || 'meaningful failure repeat / blocked handover'}`,
    `CURRENT_HEAD_SHA: ${headSha || 'unknown'}`,
    `RCA_ARTIFACT_REQUIRED: ${artifactPath}`,
    'HANDOVER_ALLOWED: no',
    'RESULT: STOP_AND_FIX',
    '',
    'The producing agent must invoke the Root Cause and Corrective Action Agent and commit the required RCA assessment before further handover / merge-ready / complete claims.',
  ].join('\n');
}

module.exports = {
  RCA_REQUIRED_MARKER,
  RCA_COMMAND_PATTERN,
  classifyFailureClasses,
  detectRcaRequirement,
  buildRcaRequiredMarker,
};

if (require.main === module) {
  const payload = process.env.RCA_TRIGGER_INPUT_JSON ? JSON.parse(process.env.RCA_TRIGGER_INPUT_JSON) : {};
  const result = detectRcaRequirement(payload);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
