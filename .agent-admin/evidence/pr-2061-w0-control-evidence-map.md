# W0 Control and Evidence Map — PR #2061 / Issue #2053

Status: **BASELINE / NOT VERIFIED**  
Work item: `W0-2053`  
Source: `governance/strategy/GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md` §§5.1, 5.2, 6, and 8  

## Implemented versus proposed

- **Implemented in this PR:** PR-scoped intake, frozen scope, factual baseline, IAA pre-brief route, and QA-to-RED route only.
- **Proposed / inactive:** safety-envelope and decision-record schema, limit enforcement, kill switch, circuit breaker, stage/merge/expiry defaults, and all runtime behavior.
- **Explicit W0 limits for QA:** active work items `1`; material remediation attempts `1`; dispatch runtime `30 minutes`; total automated runtime per work item `2 hours`; spend control `runtime-only`.
- **Human boundary:** circuit-breaker reset authority is human CS2 only. No webhook, agent, token, comment, PR, or retry may reset a breaker.

## FO register baseline

The “coverage” column transcribes the strategy’s current-coverage hypothesis. It is not fresh verification or closure.

| FO | Current coverage | Owner | Target wave | Linked evidence |
|---|---|---|---|---|
| FO-001 | Implemented foundation; not verified in W0 | Controller, ECAP | W3 | Strategy §6 |
| FO-002 | Implemented foundation; not verified in W0 | Controller, QP | W3 | Strategy §6 |
| FO-003 | Contract hardening in progress | Foreman QP, controller | W1 | Strategy §6 |
| FO-004 | Path repair completed; not reclosed here | IAA | W4 | Strategy §6 |
| FO-005 | Procedural; not verified in W0 | QP, IAA | W2 | Strategy §6 |
| FO-006 | Partial | ECAP, IAA | W2 | Strategy §6 |
| FO-007 | Implemented foundation; not verified in W0 | QP | W1 | Strategy §6 |
| FO-008 | Partial | Foreman QP | W2 | Strategy §6 |
| FO-009 | Missing | Controller, QP | W3 | Strategy §6 |
| FO-010 | Partial | ECAP, controller | W2 | Strategy §6 |
| FO-011 | Contract improvement | IAA, ECAP | W2 | Strategy §6 |
| FO-012 | Partially repaired; separate injector failed | Controller | W3 | Strategy §6 |
| FO-013 | Missing | Controller | W0 | Strategy §§5.1, 6 |
| FO-014 | Strategy corrected; runtime not changed | Foreman QP, IAA | W0 | Strategy §§6, 8 |
| FO-015 | Observed and open | Controller, QP | W3 | Strategy §6 |
| FO-016 | Observed and open | Controller, QP, IAA | W3 | Strategy §6 |
| FO-017 | Observed and open | Controller, Foreman QP, IAA | W3 | Strategy §6 |
| FO-018 | Observed and open | Foreman QP, ECAP, controller | W2 | Strategy §6 |
| FO-019 | Observed and open | Foreman QP, ECAP, IAA, controller/CS2 | W2 | Strategy §6 |

## W0 QA-to-RED obligations

The QA route must express RED tests for absent, malformed, expired, task-inconsistent, and unmeasurable safety envelopes; every approved-limit trip; duplicate/reordered events; exactly one typed `LOOP_BREAK` or `BUDGET_TRIP`; and a simulated 24-hour repeat-event sequence with no live spend. The decision-record route must cover every factual field in Strategy §5.2, deterministic outcome for identical input, and typed refusal for unknown state.

The W3 historic-reference scan defect is bounded as follows: an unscoped scan that treats archival #2048/#2057 records as an active PR identity mismatch must be corrected by the W3 controller route. This W0 record neither changes nor rebinds those historical artifacts.

## Addendum — OVL-CI-005 S-033 Inherent-Limitation Exception (2026-10-06)

**Authority and finding:** CS2 proxy instruction in PR #2061 comment `6017588110`, responding to IAA's
`OVL-CI-005` REJECTION-PACKAGE at `72bbbe3`. This addendum is the one bounded evidence
correction for the three W0 manual-control steps in
`.github/workflows/pit-cs2-controller.yml`; it does not change code, workflow behavior, scope,
or activation state.

**Exception invoked:** A valid branch `workflow_dispatch` cannot provide runtime evidence for
these unmerged W0 changes. The workflow deliberately checks out the trusted repository default
branch (`.github/workflows/pit-cs2-controller.yml:76-80`), so such a dispatch would execute
trusted `main`, not this PR's controller. Changing that checkout to run unmerged PR code would
widen the trusted execution and activation boundary. No branch dispatch is claimed as evidence.

### S-033 substitute 1 — YAML validation

Reproducible command and result, run against the submitted W0 bundle at
`b20a769e3bd8cf4b77a67f295b699bb1457f2357` before this evidence-only correction:

```text
$ yamllint --version
yamllint 1.38.0

$ yamllint -d '{extends: default, rules: {document-start: disable, truthy: disable, line-length: disable}}' .github/workflows/pit-cs2-controller.yml
exit code: 0
```

The disabled style rules reflect GitHub Actions syntax (`on`) and the repository's existing
long, descriptive workflow step names; they do not suppress YAML parse or structural validation.

### S-033 substitute 2 — workflow/controller/static-regression parity

`node --test .github/scripts/pit-cs2-controller.test.js .github/scripts/pit-cs2-controller-workflow.test.js`
passed **73/73**, with **0 failures, skips, or todos**. The following static workflow regressions
read the real workflow entrypoint, and each manual action is directly wired to an exported
controller function:

| Manual action | Workflow step and call | Exported controller function | Passing static workflow regression |
|---|---|---|---|
| `evaluate-envelope` | `.github/workflows/pit-cs2-controller.yml:97-119` selects the action and calls `controller.evaluateSafetyEnvelope` | `.github/scripts/pit-cs2-controller.js:278-310`, exported at `:918` | `W0: controller workflow evaluates the safety envelope before claiming, binding, or dispatching a work item` (`.github/scripts/pit-cs2-controller-workflow.test.js:70-74`) |
| `reset-circuit-breaker` | `.github/workflows/pit-cs2-controller.yml:121-148` selects the action and calls `controller.resetCircuitBreaker` | `.github/scripts/pit-cs2-controller.js:350-363`, exported at `:921` | `W0: controller workflow exposes a human-CS2-only circuit breaker reset path` (`.github/scripts/pit-cs2-controller-workflow.test.js:76-81`) |
| `kill-switch` | `.github/workflows/pit-cs2-controller.yml:150-183` selects the action and calls `controller.invokeKillSwitch` | `.github/scripts/pit-cs2-controller.js:379-410`, exported at `:922` | `W0: controller workflow exposes a human-invocable kill switch independent of any agent run` (`.github/scripts/pit-cs2-controller-workflow.test.js:93-98`) |

The same focused command also verifies the controller's fail-closed envelope behavior, exact
`1`/`1`/`1800s`/`7200s`/runtime-only limits, human-CS2-only reset, exactly-once trip handling,
and in-process 24-hour no-live-spend simulation.

### S-033 substitute 3 — retained manual control surface

`workflow_dispatch` remains declared at `.github/workflows/pit-cs2-controller.yml:28-58`, with
the three retained choices at `:41-43`. It is a human-CS2-only observation/decision surface:
each manual step reports a controller decision only and makes no claim, bind, merge, successor,
or deployment operation (`:112-119`, `:136-148`, `:165-183`). The trusted-main checkout remains
in place and the surface remains non-activating until ordinary human merge approval.

**Honest limitation and result:** this is static, code-level evidence—not a live branch dispatch
claim. The three substitutes above satisfy the CS2-authorized S-033 exception while retaining the
security boundary that prevents unmerged code from executing through the trusted workflow.
No FO register entry is closed by this addendum, and W0-BLK-002 remains correctly assigned to W3.
