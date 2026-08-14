# Scope Declaration — Interim CS2 IAA Rejection Remediation

## Meta

| Field | Value |
|---|---|
| Work item | CS2-authorized combined interim-CS2 contract/Tier 2 and automation correction package |
| Date | 2026-08-14 |
| Branch | `apgi-cmy-mmm-2000-replacement-lane` |
| Base current HEAD at assessment | `96f79ee524dc374a85e03b8fc748a92144b3f678` |
| PR | Not created |
| Commit | Not created |
| IAA state | Rejected combined package; correction scope is not yet frozen for a renewed review |
| Scope status | `UNCOMMITTED_CORRECTION_SCOPE` |

## Acceptance Evidence Matrix

| Acceptance need | In-scope artifact(s) | Current factual state | Evidence or next required fact |
|---|---|---|---|
| Tier 1 accurately declares tracked status and execution identity | `.github/agents/interim-cs2-agent.md`; `.agent-admin/governance/agent-contract-diffs/diff-20260812-interim-cs2-agent.md` | Present and uncommitted; contract uses `execution_identity.secret_env_var` | Final IAA compares the frozen committed file and diff record |
| Every contract-required bootstrap input is checked and blocking | Tier 1; `knowledge/bootstrap-input-validation-spec.md`; `knowledge/delivery-intent-review-protocol.md`; `knowledge/index.md` | Present and uncommitted | Structured matrix must show all records `PASS` before interim-CS2 trigger intake |
| Existing Tier 2/continuity requirements remain connected | `knowledge/domain-flag-index.md`; `operating-protocol.md`; `session-memory-template.md`; `specialist-registry.md`; `delivery-intent-review-protocol.md`; `memory/breach-registry.md`; `personal/lessons-learned.md`; `personal/patterns.md`; `parking-station/suggestions-log.md` | Present and uncommitted | IAA validates exact path set after commit |
| LF-normalized canonical inventory validation is fail-closed | `.github/scripts/validate-canon-inventory.js`; `.github/scripts/validate-canon-inventory.test.sh` | Present and uncommitted in the combined package | IAA validates UTF-8/LF-normalized inventory behavior, mismatch rejection, and test evidence at the frozen SHA |
| Wake-up fails closed when required artifact validation fails | `.github/scripts/wake-up-protocol.sh`; `.github/scripts/wake-up-protocol.test.sh` | Present and uncommitted in the combined package | IAA validates failure propagation and that a failed validation cannot produce a preflight-success claim |
| Bounded event-driven Foreman lane halt is safe | `.github/scripts/foreman-prehandover-lane-gate.js`; `.github/scripts/foreman-prehandover-lane-gate.test.sh`; `.github/scripts/foreman-prehandover-lane-gate-consumer.js`; `.github/scripts/foreman-prehandover-lane-gate-consumer.test.sh`; `.github/workflows/foreman-prehandover-lane-gate.yml`; `.github/workflows/foreman-prehandover-lane-gate-consumer.yml` | Present and uncommitted in the combined package | IAA validates normal-failure routing to Foreman, exact-head validation, rerun dedupe/concurrency handling, and absence of cron or autonomous remediation |
| Accountability and scope evidence are traceable | This declaration; `.agent-admin/prehandover/prehandover-interim-cs2-iaa-remediation-20260814.md`; `.agent-workspace/CodexAdvisor-agent/memory/session-066-20260814-interim-cs2-iaa-rejection-remediation.md` | Present and uncommitted | Frozen commit SHA and PR-base diff do not yet exist and therefore cannot be recorded |
| Independent assurance follows a frozen scope | Complete declared in-scope artifact set | Not yet possible: no commit and no PR | Commit exact scope, record SHA/base, then invoke an independent IAA; no PASS/token is asserted |

## In-Scope Paths

```text
.github/agents/interim-cs2-agent.md
.agent-workspace/interim-cs2-agent/knowledge/index.md
.agent-workspace/interim-cs2-agent/knowledge/operating-protocol.md
.agent-workspace/interim-cs2-agent/knowledge/delivery-intent-review-protocol.md
.agent-workspace/interim-cs2-agent/knowledge/bootstrap-input-validation-spec.md
.agent-workspace/interim-cs2-agent/knowledge/domain-flag-index.md
.agent-workspace/interim-cs2-agent/knowledge/session-memory-template.md
.agent-workspace/interim-cs2-agent/knowledge/specialist-registry.md
.agent-workspace/interim-cs2-agent/memory/breach-registry.md
.agent-workspace/interim-cs2-agent/personal/lessons-learned.md
.agent-workspace/interim-cs2-agent/personal/patterns.md
.agent-workspace/interim-cs2-agent/parking-station/suggestions-log.md
.agent-admin/governance/agent-contract-diffs/diff-20260812-interim-cs2-agent.md
.agent-admin/scope-declarations/scope-declaration-interim-cs2-iaa-remediation-20260814.md
.agent-admin/prehandover/prehandover-interim-cs2-iaa-remediation-20260814.md
.agent-workspace/CodexAdvisor-agent/memory/session-066-20260814-interim-cs2-iaa-rejection-remediation.md
.github/scripts/validate-canon-inventory.js
.github/scripts/validate-canon-inventory.test.sh
.github/scripts/wake-up-protocol.sh
.github/scripts/wake-up-protocol.test.sh
.github/scripts/foreman-prehandover-lane-gate.js
.github/scripts/foreman-prehandover-lane-gate.test.sh
.github/scripts/foreman-prehandover-lane-gate-consumer.js
.github/scripts/foreman-prehandover-lane-gate-consumer.test.sh
.github/workflows/foreman-prehandover-lane-gate.yml
.github/workflows/foreman-prehandover-lane-gate-consumer.yml
```

## Existing Unrelated Workspace Changes — Excluded

These changes were present in the workspace and are explicitly excluded from this protected contract/Tier 2/evidence scope:

```text
.agent-workspace/foreman-v2/memory/continuous-improvement-cycle-20260814.md
.agent-workspace/foreman-v2/memory/foreman-cycle-plan-20260814-0939.md
.agent-workspace/foreman-v2/memory/mmm-batch-1-next-cycle-instructions-20260814.md
```

`.agent-workspace/CodexAdvisor-agent/memory/session-065-20260812.md` is a retained historical record; it is not edited in this correction scope. Its earlier statements are superseded for the current package by the corrected diff record and Session 066.

## Ripple Assessment

| Surface | Impact | Required action |
|---|---|---|
| Interim CS2 | Bootstrap becomes explicitly matrix-gated; no activation is created | IAA verifies Tier 1/Tier 2 consistency after commit |
| Foreman and responsible roles | May receive only normal packets after an all-`PASS` bootstrap; the bounded lane consumer routes normal failures to Foreman | IAA validates routing and no autonomous remediation |
| Independent IAA | Must review the final frozen combined contract/Tier 2/automation/evidence package | New independent review required; no assurance result is predeclared |
| Canon/consumer repositories | No canon or routing source changes | No propagation action authorized |
| Automation scripts and workflows | Included only at the ten declared paths | IAA validates LF normalization, fail-closed wake-up, exact-head safety, dedupe/concurrency, and event-driven-only behavior |
| Product/runtime | Excluded | No product or runtime implementation is authorized |

## Hard Boundaries

- No product code, schemas, migrations, deployment, activation, canon, routing implementation, cron schedule, or autonomous remediation.
- Automation changes are limited to the ten declared script/workflow/test paths and must route ordinary failure to Foreman.
- No commit or PR in this correction task.
- No IAA token, assurance verdict, merge-ready claim, or merge authorization.
- A fresh IAA review is mandatory only after all declared artifacts are committed as one frozen scope.
