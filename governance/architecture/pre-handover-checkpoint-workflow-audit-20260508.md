# Pre-Handover Checkpoint Workflow Audit — 2026-05-08

**Issue**: maturion-isms#1583  
**Purpose**: Classify the existing handover-adjacent workflows so deliberate checkpointing is the preferred path and advisory safety nets remain non-disruptive.

---

## Classification legend

- `ADVISORY_ONLY` — comment/reminder/injection only; does not by itself block handover or merge.
- `REQUIRED_BLOCKING_GATE` — must stop handover or merge when the condition is not satisfied.
- `PRE_HANDOVER_CHECKPOINT_INPUT` — a required current-head signal that the deliberate checkpoint reads before handover is allowed.

---

## Workflow / gate audit

| Workflow / gate | Trigger event | Classification | Advisory or blocking | Does it fail the job or only comment? | Timing | False-positive risk | Recommended action |
|---|---|---|---|---|---|---|---|
| `.github/workflows/pre-handover-checkpoint.yml` | `issue_comment` on explicit checkpoint commands | `REQUIRED_BLOCKING_GATE` | Blocking handover eligibility, but deliberate/manual trigger only | Posts structured checkpoint result comment; does not auto-draft or auto-close | **Before** handover | Low — exact command trigger only | Keep as the preferred deliberate path. |
| `.github/workflows/handover-claim-gate.yml` | `issue_comment` handover language; `pull_request_target.ready_for_review` | `REQUIRED_BLOCKING_GATE` | Blocking | Comments with HANDOVER BLOCKED / ACKNOWLEDGED gate result | **At** handover / ready-for-review | Medium if deliberate trigger comments are misread as claims | Exclude deliberate checkpoint trigger/result comments; require a successful current-head checkpoint result. |
| `.github/workflows/governance-watchdog.yml` | `push`; `pull_request_target` opened/ready/synchronize | `ADVISORY_ONLY` | Advisory | Comments / alerts only | Usually **after** a bad state already exists | Medium — intentional safety net behavior | Keep non-blocking; use as escalation and education, not as the primary handover path. |
| `.github/workflows/iaa-prebrief-inject.yml` | `push`; `pull_request_target`; manual `/iaa-prebrief` | `ADVISORY_ONLY` | Advisory trigger | Posts invocation reminders / injection text | **Before** and **during** wave execution | Medium — injection can exist without committed artifact | Keep as reminder/invocation aid; checkpoint must verify committed pre-brief artifact, not injection text. |
| `.github/workflows/iaa-prebrief-gate.yml` | `pull_request_target`; `workflow_dispatch` | `ADVISORY_ONLY` | Advisory | Reminder comment only | **Before** handover, but non-blocking | Low | Keep reminder-only; checkpoint consumes the hard `preflight/iaa-prebrief-existence` signal instead. |
| `preflight/iaa-prebrief-existence` (`preflight-evidence-gate.yml`) | `pull_request` | `PRE_HANDOVER_CHECKPOINT_INPUT` | Blocking CI gate | Fails job | **Before** handover, current HEAD | Low | Continue using as required checkpoint input. |
| `preflight/iaa-final-assurance` (`preflight-evidence-gate.yml`) | `pull_request` | `PRE_HANDOVER_CHECKPOINT_INPUT` | Blocking CI gate | Fails job | **Before** handover, current HEAD | Low | Continue using as required checkpoint input. |
| `preflight/ecap-admin-ceremony` (`preflight-evidence-gate.yml`) | `pull_request` | `PRE_HANDOVER_CHECKPOINT_INPUT` | Blocking CI gate | Fails job | **Before** handover, current HEAD | Low | Continue using as required checkpoint input. |
| `preflight/scope-declaration-parity` (`preflight-evidence-gate.yml`) | `pull_request` | `PRE_HANDOVER_CHECKPOINT_INPUT` | Blocking CI gate | Fails job | **Before** handover, current HEAD | Low | Continue using as required checkpoint input. |
| `preflight/product-delivery-gates` (`preflight-evidence-gate.yml`) | `pull_request` | `PRE_HANDOVER_CHECKPOINT_INPUT` | Blocking CI gate | Fails job | **Before** handover, current HEAD | Medium for non-product governance PRs if classifier regresses | Continue using as required checkpoint input and keep regression coverage current. |
| `preflight/mmm-pr-admin` (`preflight-evidence-gate.yml`) | `pull_request` | `PRE_HANDOVER_CHECKPOINT_INPUT` | Blocking CI gate | Fails job | **Before** handover, current HEAD | Low | Continue using as required checkpoint input for manifest truth. |
| `merge-gate/verdict` (`merge-gate-interface.yml`) | `pull_request_target` | `REQUIRED_BLOCKING_GATE` | Blocking merge, not handover | Fails job | **After** handover and before merge | Medium because it is later than the deliberate checkpoint | Keep as merge-stage safety net; do not rely on it as the first handover check. |
| `.github/workflows/injection-audit-report.yml` | `workflow_dispatch` | `ADVISORY_ONLY` | Advisory | Posts audit report comment | **After** injections, usually handover-adjacent | Low | Keep as evidence support for IAA; not a checkpoint gate. |

---

## Operational conclusion

Preferred path:

```text
ECAP_PRE_HANDOVER_CHECKPOINT -> PRE_HANDOVER_CHECKPOINT_RESULT (HANDOVER_ALLOWED: yes) -> handover claim / ready-for-review
```

Safety-net path:

```text
handover claim without successful current-head checkpoint -> handover-claim-gate BLOCKED
```

This preserves the issue intent:

- deliberate checkpoint first;
- existing watchdogs stay useful but non-disruptive;
- no auto-draft or other disruptive automation was added in this phase.
