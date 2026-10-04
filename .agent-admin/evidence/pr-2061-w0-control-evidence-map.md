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
