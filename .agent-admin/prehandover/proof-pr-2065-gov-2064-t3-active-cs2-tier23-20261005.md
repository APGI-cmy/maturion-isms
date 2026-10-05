# PREHANDOVER PROOF — GOV-2064-T3 Active-CS2 Tier 2/Tier 3 Rejected-IAA Alignment

- **Builder**: active-cs2-agent (CONTRACT_READY / INACTIVE throughout)
- **Task**: GOV-2064-T3
- **PR**: #2065 (branch `copilot/prevent-rejected-iaa-handover`)
- **Issue**: #2064
- **Pre-brief**: `.agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md`
- **Head SHA at session start**: `adcce22d7270e5ef2239f407ae8484c202e76626` (GOV-2064-T1 + GOV-2064-T2 already present; neither touched or reassessed here)
- **Date**: 2026-10-05

## Scope (bounded to GOV-2064-T3 only)

Align active-CS2 Tier 2 (`merge-and-refusal-protocol.md`, `evidence-review-and-correction-protocol.md`) and Tier 3 (`tier3-context-and-continuity-protocol.md`, `job-wave-intake-and-dispatch-protocol.md`, job-wave schema/evaluator alignment) rejection-deduplication, bounded-correction, and refusal behavior so rejected/missing/stale IAA produces a typed refusal with no completion/merge/successor dispatch. Remain `CONTRACT_READY / INACTIVE`; no runtime/controller activation; no canon hand-edit; no protected agent-contract edit.

## Checklist

- [x] Scope matches the appointed task (GOV-2064-T3 only; Tasks 1/2/4 not touched or reassessed)
- [x] Rejected/missing/stale IAA is typed refusal (`MATERIAL_BLOCKER`/`GATE_UNSATISFIED`/`EVIDENCE_STALE` — existing approved merge-policy codes; no new code invented)
- [x] Wave remains `CORRECTION`/`BLOCKED` (never `MERGE_ELIGIBLE`/`MERGED`/`VALIDATED`); job remains `BLOCKED`, not `COMPLETE`
- [x] No completion handover, merge, or successor-wave dispatch documented or implied
- [x] Exactly one findings packet per unique (failed obligation, reviewed-content fingerprint) — repeats are `NO_OP`, never a second IAA/ECAP invocation or proof artifact
- [x] Real substantive change permits exactly one bounded re-entry and one fresh independent IAA request
- [x] Genuine external/protected/canon-conflict blocker emits exactly one CS2 escalation while the wave stays `BLOCKED`
- [x] Rejection fingerprint, reviewed-content identity, attempts/spend counters, and NO_OP dedup events persist/reconstruct purely from the durable event ledger across a simulated restart
- [x] Counters cannot be reset by a replacement PR/session/wave carrying the same `job_id` (proven, not just asserted)
- [x] Remains `CONTRACT_READY / INACTIVE` — no activation claim, no CI wiring of the new test script
- [x] No `.github/agents/*.md` file touched (SELF-MOD-ACS2-001 and the Foreman/IAA contracts already corrected under GOV-2064-T1 respected)
- [x] No canon file touched (`governance/canon/**`, `governance/schemas/**`, `governance/templates/**`, `governance/schemas/fixtures/active-cs2-job-wave/**` are all canon-tracked in `governance/CANON_INVENTORY.json` with file hashes and lie outside this agent's `write_paths`; new test material lives only under `.agent-workspace/active-cs2-agent/`, which is in `write_paths`)
- [x] No `#2058` historical artifact touched or reassessed
- [x] Focused test evidence generated and independently re-run (15/15 PASS) plus a negative-control sanity check proving the harness is not vacuous
- [x] Evidence artifacts generated (this proof + session memory + wave-task row update)

## What changed (and why)

### Tier 2 / Tier 3 knowledge documents (`.agent-workspace/active-cs2-agent/knowledge/`)

| File | Change |
|---|---|
| `merge-and-refusal-protocol.md` | New "Rejected / missing / stale IAA" section mapping each observed IAA state to its exact existing typed-refusal code and resulting wave status, and stating the no-completion/no-merge/no-successor-dispatch consequence explicitly. |
| `evidence-review-and-correction-protocol.md` | New "Dedup identity" and "Re-entry on real substantive change" sections defining the rejection-fingerprint key, the NO_OP duplicate rule, the exactly-one-escalation rule, and the exactly-one-bounded-re-entry rule tied to `delta_class: SUBSTANTIVE` vs `ADMIN_TOKEN_ONLY`. |
| `tier3-context-and-continuity-protocol.md` | Added required durable fields (`rejection_fingerprint` ledger, `reviewed_content_identity`, `attempts`/`spend`) and a new "Persistence and reconstruction across restarts" section describing exactly how these survive a restart, new session, or replacement PR/wave carrier for the same `job_id`. |
| `job-wave-intake-and-dispatch-protocol.md` | New "Rejected / missing / stale IAA mapping" (no new refusal code invented) and "Durable counters survive replacement carriers" sections. |
| `FAIL-ONLY-ONCE.md` | New rules ACS2-005 (bounded, non-repeating rejected/missing/stale-IAA refusal) and ACS2-006 (counters/dedup ledger cannot be reset by a replacement carrier). |
| `safety-envelope-and-recovery-protocol.md` | New "Counter and dedup-ledger persistence" section cross-referencing the above and the existing `attempted-budget-reset` evaluator acceptance case. |
| `index.md` | Version/date bump; new row referencing the test-support bundle below (marked explicitly as test evidence only, no runtime activation). |
| `runtime-integration-handoff.md` | New "Validation performed in PR #2065 (GOV-2064-T3)" table recording the test run below, with an explicit statement that this remains schema/fixture/test-level only. |

No change was made to `.github/agents/active-cs2-agent.md` (or any other `.github/agents/*.md` file) and no change was made to any canon file under `governance/**`.

### New test-support bundle (`.agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/`, new directory)

- `rejected-iaa-wave-record.json` — a new, non-canon fixture (schema-valid against the **unmodified** canon `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`) with a 6-event ledger exercising: initial IAA rejection (`MATERIAL_BLOCKER`) → duplicate finding on unchanged content deduped to `NO_OP` → blocked handover attempt while IAA is missing (`GATE_UNSATISFIED`) → genuine substantive correction permitting one bounded re-entry (`ACCEPTED`/`RE_ENTRY_PERMITTED_SUBSTANTIVE_DELTA`) → genuine reserved-matter conflict escalated exactly once (`RESERVED_MATTER`) → repeat of that same conflict on unchanged content deduped to `NO_OP`.
- `validate-rejected-iaa-dedup.test.py` — a Python test runner validating the fixture against the real canon schema and asserting: no forbidden completion/merge wave or job status is ever reached; exactly 3 distinct rejection fingerprints (one per genuinely distinct failed obligation) with exactly 1 of them being the reserved-matter escalation and exactly 1 bounded re-entry; no un-deduped repeat of any rejection fingerprint; strictly monotonic/non-decreasing durable counters; a restart-reconstruction proof (independent reload + recompute from the ledger alone); and a replacement-PR proof (same `job_id`, different PR number in the evidence bindings) showing counters are **not reset**.
- `README.md` — explains scope and explicitly states this is test support only, not wired into CI, and does not activate automation.

## Test Evidence

Command: `python3 .agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py`

```
PASS fixture conforms to unmodified canon ACTIVE_CS2_JOB_WAVE.schema.json
PASS wave never advances to MERGE_ELIGIBLE/MERGED/VALIDATED while IAA unresolved
PASS wave status is CORRECTION or BLOCKED (ordinary or reserved-matter outcome)
PASS job status is BLOCKED, not COMPLETE (no completion handover)
PASS final_acceptance is null (no completion/merge/successor dispatch recorded)
PASS exactly 3 distinct rejection fingerprints raised (ac-03 MATERIAL_BLOCKER, GATE_UNSATISFIED handover attempt, RESERVED_MATTER escalation)
PASS exactly 1 escalation emitted for the genuine protected/reserved-matter blocker
PASS exactly 1 bounded re-entry permitted for the real substantive change
PASS no duplicate rejection/escalation re-emitted for an unchanged rejection fingerprint
PASS no event ever advances wave state into a forbidden completion/merge status
PASS re-entry consumed exactly the approved one material-correction budget (W0 baseline)
PASS merge was attempted and refused at least once (GATE_UNSATISFIED), never completed
PASS restart reconstruction matches original reconstruction exactly
PASS replacement-PR carrier (same job_id) reconstructs identical non-reset counters
PASS replacement-PR record still schema-valid against unmodified canon schema

Passed: 15
Failed: 0
```

Exit code: 0.

### Negative-control sanity check (ad hoc, not committed)

To confirm the test harness actually discriminates rather than vacuously passing, two corrupted copies of the fixture were checked against the same functions (then discarded, not committed):

| Injected defect | Detected by |
|---|---|
| Wave status set to `MERGED`, job status set to `COMPLETE` | `wave["status"] in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED` → `True` (would fail the corresponding `check(...)`) |
| Duplicate finding recorded as a second `REJECTED` instead of `NO_OP` | `reconstruct_counters(...)["duplicate_violations"]` → non-empty (would fail the corresponding `check(...)`) |

## Known Non-Blocking Notes

- This is this agent's **first real session** (`session-001-20261005.md`); no prior session history existed, and none was fabricated.
- No live job/wave dispatch record exists in this repository (confirmed unchanged from `runtime-integration-handoff.md`'s existing "Current delivery truth"); this task's evidence is schema/fixture/test-level only and does not claim otherwise.
- The pre-brief's `qualifying_tasks[2]` description labels `merge-and-refusal-protocol.md` as "Tier 1" — this is a pre-brief wording artifact; the file in question is in fact declared under this agent's Tier 2 `required_files` in `.github/agents/active-cs2-agent.md`. No Tier 1 (protected `.github/agents/*.md`) file was touched by this task.

## Evidence Files

- `.agent-workspace/active-cs2-agent/knowledge/merge-and-refusal-protocol.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/evidence-review-and-correction-protocol.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/tier3-context-and-continuity-protocol.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/job-wave-intake-and-dispatch-protocol.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/FAIL-ONLY-ONCE.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/safety-envelope-and-recovery-protocol.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/index.md` (updated)
- `.agent-workspace/active-cs2-agent/knowledge/runtime-integration-handoff.md` (updated)
- `.agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/rejected-iaa-wave-record.json` (new)
- `.agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py` (new)
- `.agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/README.md` (new)
- `.agent-workspace/active-cs2-agent/memory/session-001-20261005.md` (new session memory)
- `.agent-workspace/active-cs2-agent/parking-station/suggestions-log.md` (updated — one non-breaking suggestion parked)
- `.agent-admin/prs/pr-2065/wave-current-tasks.md` (row 3 marked 🟢 DONE)
- This file: `.agent-admin/prehandover/proof-pr-2065-gov-2064-t3-active-cs2-tier23-20261005.md`

## Double-QA

- **Foreman QA (build)**: pending Foreman review of this builder submission (self-QP above is binary PASS for this bounded task; Foreman retains the ordinary-remediation routing authority this task's own knowledge updates describe).
- **IAA QA (handover)**: PRE-BRIEF only recorded at `.agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md`; final IAA invocation for the whole PR #2065 bundle (Tasks 1–4) is outstanding. This proof does not itself constitute a final ASSURANCE-TOKEN, and active-cs2-agent remains `CONTRACT_READY / INACTIVE` pending that independent final IAA PASS.
