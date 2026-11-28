# ECAP Staged Preparation Payload — PR #2072

> **Disposition: PREPARED FOR STAGED REVIEW; NOT AN ACCEPTED PREHANDOVER PROOF.**
> This record is not a final-state artifact, does not authorize IAA invocation, and
> is not a merge/readiness decision. The §4.3e return gate is blocked as recorded
> below. The earlier rejected payload remains preserved in the prior wrapper-branch
> commit `72bef26827457a5077fb84ae3cfb7331e843f78e`; this staged payload does not
> convert that history into an acceptance.

```yaml
artifact_kind: ECAP_STAGED_PREPARATION_PAYLOAD
artifact_status: PREPARED_NOT_ACCEPTED
handover_allowed: no
result: BUNDLE_BLOCKED_PENDING_AUTHORIZED_PUBLICATION_AND_LATER_ORDERED_CONTROLS
pr: 2072
review_issue: 2073
parent_issue: 2068
job_id: job-CS2-AUTOMATION-W1-W2-20261008
wave_identifier: pr-2072-setup-repair
pr_branch: codex/clarify-copilot-setup-authority-20261008
pr_head: 475f9cd0a801b60d3eed5f5c9aa2c205661c872c
stable_substantive_source: f0d4209541ce0addfef72753314cb1fbc459111e
existing_appointment_timestamp: 2026-10-09T07:06:23Z
appointment_reconciled_at: 2026-10-13T10:38:46Z
ecap_session_id: NOT_PROVIDED_NOT_INVENTED
overall_merge_gate_parity: NOT_ASSERTED
final_iaa_verdict: NOT_ISSUED
final_iaa_token: NOT_ISSUED
final_parity: BLOCKED_FOR_LATER_ORDERED_STAGE
```

## Scope and role boundary

- Existing assignment: PR #2072 / review issue #2073 / parent #2068.
- Existing parent job and wave are retained. The original effective appointment
  timestamp is retained; no appointment, session number, counter, budget, or reset
  was created.
- Scope is administrative preparation only. ECAP did not change source, PR
  manifest, task record, scope declaration, gate evidence, IAA record, token, or
  verdict. ECAP did not invoke IAA, commit, push, merge, deploy, dispatch, or
  activate anything.
- CS2 instruction #6144563432 permits proceeding after Foreman verifies the
  applicable Phase 2/3 inputs together. This is staged admission only; it does not
  waive the later ECAP acceptance controls, final IAA/token, or final parity.

## Foreman-reported substantive and staged evidence

- Source QP: **PASS**, Foreman comment `6059955248`, for the unchanged three-file
  substantive source at `f0d4209541ce0addfef72753314cb1fbc459111e`.
- Changed setup workflow execution: **SUCCESS**, run `37775683802`, job
  `113305806192`, on that exact source SHA.
- Current PR head, as independently verified by Foreman: `475f9cd0a801b60d3eed5f5c9aa2c205661c872c`
  on `codex/clarify-copilot-setup-authority-20261008`.
- Foreman-reported current-head validations: `validate-simple-pr-admin.sh` PASS;
  `validate-scope-to-diff.sh` PASS, exact 11/11; and
  `validate-governance-evidence-exactness.sh` PASS, zero errors/warnings.
- Foreman-reported inventory verification: all 217 CANON_INVENTORY hashes resolve
  and match; no null hashes.
- The current-dated IAA-owned chronology/applicability record is present at
  `.agent-admin/assurance/iaa-wave-record-pr-2072-setup-repair-20261009.md`,
  SHA256 `271e295a47199c9f5574d0de2affa20644c0044aa34747fae9f9a110aeba8815`.
  Its populated `## PRE-BRIEF` is a T4 applicability/chronology record authored
  2026-10-13. The filename date identifies the existing task only. It is not a
  retrospective pre-brief, ECAP acceptance, final parity, or final assurance.
- The historical IAA rejection and earlier ECAP halt remain historical. The
  original private rejection/token provenance was not independently recovered and
  is not reconstructed here.

## Named staged gate set

`gate_set_checked` is the **pre-ECAP staged-admission set only**. The following
current-head workflow-backed controls were reported PASS by Foreman; skipped checks
are not counted as PASS:

| Named control | Result | Job |
|---|---:|---:|
| `preflight/phase-1-evidence` | PASS | `115273594837` |
| `preflight/iaa-prebrief-contract-alignment` | PASS | `115273594834` |
| `preflight/foreman-prehandover-lane-gate` | PASS | `115273595298` |
| `preflight/delegation-order-gate` | PASS | `115273594552` |
| `preflight/ecap-admin-boundary-gate` | PASS | `115273594991` |
| `preflight/merge-gate-required-checks-alignment` | PASS | `115273595570` |

Supporting but not substituting for the named set: `preflight/wave7-governance-validation`
PASS, job `115273595231`.

Separate push-triggered `update-liveness` and `copilot-loop-watchdog` runs failed
with zero jobs and no failed-job logs. They are not in the required-check manifest:
they are neither represented as PASS nor silently treated as required controls.

The historical gate snapshot at
`.agent-admin/gates/gate-results-pr-2072-20261009.json` remains an October 9
`REQUIRES_FIX` observation; it is not rewritten as current evidence. The six
current-head controls above establish only the authorized staged admission.
**Overall/final §4.3 merge-gate parity is not asserted.**

## Current diff and evidence index

Foreman verified the current PR diff and scope declaration as exactly 11 paths.
The target commit object was also inspected read-only; its diff from `origin/main`
contains these 11 paths:

1. `.admin/prs/pr-2072.json`
2. `.agent-admin/assurance/iaa-wave-record-pr-2072-setup-repair-20261009.md`
3. `.agent-admin/gates/gate-results-pr-2072-20261009.json`
4. `.agent-admin/improvements/pr-2072-setup-repair-20261009.md`
5. `.agent-admin/prehandover/proof-pr-2072-setup-repair-20261009.md`
6. `.agent-admin/prs/pr-2072/wave-current-tasks.md`
7. `.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-2072.md`
8. `.agent-admin/scope-declarations/pr-2072.md`
9. `.github/copilot-setup-steps.yml`
10. `.github/workflows/copilot-setup-steps.yml`
11. `.github/workflows/maturion-bot-writer.yml`

The manifest binds PR/issue/parent, branch, source, T4, the exact scope, and the
existing appointment. The task record retains the appointment source and separate
reconciliation time, assigned scope, expected return paths, and staged-only parity
scope. The Foreman-owned scope declaration lists the two authorized ECAP return paths.
No changed path is a CANON_INVENTORY `PUBLIC_API` entry; ripple is not applicable
to this 11-path set. The changed workflow/setup files affect Copilot setup
consumers, but do not expand role permissions or activate a runtime controller.

## Bundle destinations and commit-state

Authorized return paths:

- `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-2072-setup-repair-20261009.md`
- `.agent-workspace/execution-ceremony-admin-agent/bundles/session-pr-2072-setup-repair-20261009.md`

Foreman verified the PR worktree clean at target head `475f9cd0a801b60d3eed5f5c9aa2c205661c872c`.
This execution environment is a separate clean wrapper checkout at
`copilot/cs2-foreman-finalize-setup-repair`, HEAD
`72bef26827457a5077fb84ae3cfb7331e843f78e`. The two destination paths here
previously contained the historical rejection payloads and are tracked in the
wrapper checkout. The updated preparation payloads are local administrative edits
only; they have not been committed or added to the PR branch. No target-branch
commit-state claim is made for these new payload contents.

## IAA and final-state references

- `iaa_wave_record_path`:
  `.agent-admin/assurance/iaa-wave-record-pr-2072-setup-repair-20261009.md`
- `iaa_audit_token`: **NOT ISSUED**. No final IAA session reference or token exists
  in the evidence provided. No expected PASS token string is fabricated.
- Final IAA verdict: **NOT ISSUED**.
- Overall/final merge-gate parity: **NOT ASSERTED**.
- Final parity remains **BLOCKED for the later ordered stage**.

## §4.3e Admin Ceremony Compliance Gate

`gate_set_checked` is populated and the staged evidence is internally scoped.
No stale gate-pass claim or contradictory overall-parity PASS is asserted.
Nevertheless, the full §4.3e gate is **BLOCKED**, so this payload is not returned as
an accepted bundle:

- **AAP-03 hit / commit-state block:** the two declared ECAP return-path artifacts
  are not yet committed on target PR head `475f9cd…`. The current files are in the
  separate wrapper checkout only. The user explicitly prohibited commit/push.
- **Admin checklist:** incomplete for accepted handback because the output
  artifacts are not committed to the target branch, and final IAA/token/parity
  controls are reserved for later ordered stages.
- **Reconciliation:** staged facts are reconciled in the companion session record;
  target-branch artifact commit state and final token/session rows remain unresolved.
- **ECAP reconciliation summary:** included in the companion session record as a
  staged summary, not represented as final acceptance.

Exact blocking clauses:

1. `governance/checklists/execution-ceremony-admin-checklist.md`, Section 2:
   **“Verify that every artifact in Section 1 is committed to the working branch,
   not just locally present.”**
2. `.github/agents/execution-ceremony-admin-agent.md`, Phase 3 Step 3.5:
   **“If ANY item is BLOCKED, INCOMPLETE, or ABSENT → DO NOT return bundle.”**

These controls prevent an **accepted/returnable** ECAP bundle while the explicit
no-commit instruction remains in force. They do not invalidate Foreman’s staged
pre-ECAP admission checks. The producer-facing disposition is therefore:

`BUNDLE BLOCKED — PREPARED STAGED PAYLOAD ONLY`
`HANDOVER_ALLOWED: no`
`FINAL_READINESS_OR_PARITY: not asserted`

## Residual publisher / later-stage actions

The authorized original publisher must place these exact two payloads on the PR
branch through the approved publication process, then Foreman must verify their
target-head commit state and complete the remaining §4.3e controls. Foreman owns
the later IAA invocation; IAA alone owns any verdict/token and its canonical wave
record token section. Final parity and any merge decision remain later obligations
under their respective authorities. The Foreman parking-station entry was not
written because the task explicitly limited output paths to the two files above;
its required update remains a publisher/Foreman action before any accepted
handover.
