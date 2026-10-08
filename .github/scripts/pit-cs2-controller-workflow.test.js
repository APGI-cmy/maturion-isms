'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('pilot workflow delegates controller decisions to the tested runtime module', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  assert.match(workflow, /types: \[opened\]/);
  assert.match(workflow, /cron: '17 \* \* \* \*'/);
  assert.match(workflow, /await controller\.run\(\{ github, context, core, eventName: process\.env\.EVENT_NAME \}\)/);
  assert.match(workflow, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
});

test('pre-brief injection cannot use a repository-global legacy wave record', () => {
  const workflow = read('workflows/iaa-prebrief-inject.yml');
  assert.match(workflow, /require\('\.\/\.github\/scripts\/iaa-prebrief-inject\.js'\)/);
  assert.match(workflow, /name: Collect current-head injector inputs/);
  assert.match(workflow, /name: Evaluate current-head blocker snapshot/);
  assert.match(workflow, /CHECKPOINT_CHECK_RUNS_PATH:/);
  assert.match(workflow, /ACTIVE_STATE_PATH: "\.agent-admin\/prs\/pr-\$\{\{ steps\.ctx\.outputs\.pr_number \}\}\/active-state\.json"/);
  assert.match(workflow, /CHECKPOINT_MERGEABLE_WITH_BASE:/);
  assert.match(workflow, /core\.setOutput\('injection_outcome'/);
  assert.doesNotMatch(workflow, /taskPaths\.push\('\.agent-workspace\/foreman-v2\/personal\/wave-current-tasks\.md'\)/);
  assert.match(workflow, /A pre-brief belongs only to the PR-scoped job/);
  assert.match(workflow, /core\.setOutput\('task_path', taskPath\)/);
  assert.match(workflow, /core\.setOutput\('work_item_id', workItemId\)/);
  assert.match(workflow, /core\.setOutput\('task_head_sha', taskHeadSha\)/);
  assert.match(workflow, /core\.setOutput\('terminal_state_reason'/);
  assert.match(workflow, /steps\.inspect\.outputs\.injection_outcome == 'REQUEST_PREBRIEF'/);
  assert.match(workflow, /steps\.inspect\.outputs\.injection_outcome != 'REQUEST_PREBRIEF'/);
  assert.match(workflow, /PR-scoped task record:/);
  assert.match(workflow, /Submitted head:/);
  assert.doesNotMatch(workflow, /pull_request_target:\n\s+types: \[opened, ready_for_review\]/);
});

test('pilot documentation locks the controller-facing governance route', () => {
  const guide = read('cs2-controller/pit-pilot.md');
  assert.match(guide, /Foreman must create the PR-scoped task record, invoke IAA/i);
  assert.match(guide, /Foreman → CodexAdvisor\/CS2, not PIT implementation scope/);
  assert.match(guide, /IAA rejects the\s+submission, the controller route returns to Foreman for one bounded correction/i);
  assert.match(guide, /legacy\s+personal-path consultation is a Foreman\/IAA fallback only when no PR-scoped\s+task record exists/i);
  assert.match(guide, /independent external attestation/);
  assert.doesNotMatch(guide, /`NO_CHANGE`, `STOP_AND_FIX`, `READY_FOR_IAA`, or/);
  assert.match(guide, /`READY_FOR_IAA` \(or any ready-class label\) is never a terminal completion/i);
});

// ---------------------------------------------------------------------------
// W0-2053-C — QA-to-RED coverage for the Strategy §5.1 safety envelope ceilings
// and human-CS2-only circuit breaker reset as wired into the actual pilot
// workflow entrypoint (not only the extracted module). These regressions retain
// coverage for runtime ceilings and persisted safety-control wiring.
// ---------------------------------------------------------------------------

test('W0: controller dispatch step enforces the Strategy §5.1 30-minute maximum dispatch runtime ceiling', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  assert.match(workflow, /timeout-minutes:\s*30/);
});

test('W0: controller job enforces the Strategy §5.1 two-hour maximum total runtime ceiling', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  assert.match(workflow, /timeout-minutes:\s*120/);
});

test('W0: the mutating controller entrypoint loads and evaluates persisted safety state before register or dispatch writes', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  const controllerSource = read('scripts/pit-cs2-controller.js');
  const envelopeSchema = read('cs2-controller/safety-envelope.schema.json');
  const claimStart = controllerSource.indexOf("if (activeEventName === 'issues')");
  const bindStart = controllerSource.indexOf("if (activeEventName === 'pull_request_target')");
  const issueCommentStart = controllerSource.indexOf("if (activeEventName === 'issue_comment'");
  const claimSource = controllerSource.slice(claimStart, bindStart);
  const bindSource = controllerSource.slice(bindStart, issueCommentStart);
  assert.match(workflow, /await controller\.run\(\{ github, context, core, eventName: process\.env\.EVENT_NAME \}\)/);
  assert.ok(claimSource.indexOf('await loadStateForWorkItem') >= 0);
  assert.ok(claimSource.indexOf('evaluateSafetyEnvelope(') > claimSource.indexOf('await loadStateForWorkItem'));
  assert.ok(claimSource.indexOf('await appendStateDecision(') > claimSource.indexOf('evaluateSafetyEnvelope('));
  assert.ok(claimSource.indexOf('await writeRegister(') > claimSource.indexOf('await appendStateDecision('));
  assert.ok(claimSource.indexOf('await dispatchForeman(') > claimSource.indexOf('await writeRegister('));
  assert.ok(bindSource.indexOf('await loadStateForWorkItem') >= 0);
  assert.ok(bindSource.indexOf('evaluateSafetyEnvelope(') > bindSource.indexOf('await loadStateForWorkItem'));
  assert.ok(bindSource.indexOf('await appendStateDecision(') > bindSource.indexOf('evaluateSafetyEnvelope('));
  assert.ok(bindSource.indexOf('await writeRegister(') > bindSource.indexOf('await appendStateDecision('));
});

test('W0: manual safety actions authenticate the Actions actor and load persisted state, never caller-supplied identity or envelope', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  const controllerSource = read('scripts/pit-cs2-controller.js');
  const envelopeSchema = read('cs2-controller/safety-envelope.schema.json');
  assert.match(workflow, /reset-circuit-breaker/);
  assert.match(workflow, /action: 'reset-circuit-breaker'/);
  assert.match(workflow, /action: 'kill-switch'/);
  assert.match(workflow, /action: 'evaluate-envelope'/);
  assert.match(workflow, /inputs\.work_item_issue_number/);
  assert.doesNotMatch(workflow, /reset_actor_login|SAFETY_ENVELOPE_JSON/);
  assert.match(controllerSource, /const login = String\(context\.actor \|\| ''\)/);
  assert.match(controllerSource, /github\.rest\.users\.getByUsername/);
  assert.match(controllerSource, /actor\.type !== 'User'/);
  assert.match(controllerSource, /source: 'human_cs2', actor/);
  assert.match(envelopeSchema, /human_cs2_only/);
});

// ---------------------------------------------------------------------------
// W0-2053-C follow-up — Foreman QP scope omission: the human kill switch must
// be independently invocable (usable without another agent run) through the
// real workflow entrypoint, not only the extracted module. `workflow_dispatch`
// is the manual, human-triggerable entrypoint this workflow already declares;
// it must wire to the kill switch so a human can invoke it directly. This
// assertion verifies the manual workflow action routes through the persisted,
// authenticated safety-control entrypoint.
// ---------------------------------------------------------------------------

test('W0: controller workflow exposes a human-invocable kill switch independent of any agent run', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  const controllerSource = read('scripts/pit-cs2-controller.js');
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /action: 'kill-switch'/);
  assert.match(workflow, /runManualSafetyAction/);
  assert.match(controllerSource, /invokeKillSwitch\(found\.state\.safety_envelope/);
  assert.match(controllerSource, /kill_switch_state: killed\.kill_switch_state/);
});
