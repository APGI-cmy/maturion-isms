# GOV-2064-T3 — Evaluator-Entrypoint Tests (Rejected/Missing/Stale IAA)

These files are **test support only**. They are not a live controller, not wired into any
CI workflow, and do not activate active-CS2 automation. They exist to prove — against the
real, unmodified canon schema `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json` — that
this bundle's Tier 2 knowledge (`merge-and-refusal-protocol.md`,
`evidence-review-and-correction-protocol.md`, `tier3-context-and-continuity-protocol.md`,
`job-wave-intake-and-dispatch-protocol.md`) correctly describes enforceable behavior, not
just document wording.

## Files

- `rejected-iaa-wave-record.json` — a schema-valid job/wave record exercising: an initial
  IAA rejection (`MATERIAL_BLOCKER`), a duplicate finding against unchanged reviewed
  content (deduped to `NO_OP`), a blocked completion-handover attempt while IAA is missing
  (`GATE_UNSATISFIED`), a genuine substantive correction permitting exactly one bounded
  re-entry (`ACCEPTED` / `RE_ENTRY_PERMITTED_SUBSTANTIVE_DELTA`), a genuine
  protected/reserved-matter conflict escalated exactly once (`RESERVED_MATTER`), and a
  repeat of that same conflict against unchanged content deduped to `NO_OP`.
- `validate-rejected-iaa-dedup.test.py` — a Python test runner that (1) validates the
  fixture against the real canon schema, (2) asserts the wave/job never reach a
  completion/merge status while IAA is unresolved, (3) reconstructs all durable counters
  and the dedup ledger purely from the `events` array (simulating a restart), and
  (4) proves counters are **not reset** when the same `job_id` is carried by a
  replacement PR number — only an explicit human-CS2 breaker reset may do that.

## Running

```bash
python3 .agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py
```

Expected: `Passed: 15` / `Failed: 0`, exit code `0`.

## Why this is not an activation claim

No GitHub Actions workflow, merge gate, or runtime process invokes this script. It is a
manually re-runnable proof artifact only. `active-cs2-agent` remains `CONTRACT_READY /
INACTIVE` after this test exists — see `runtime-integration-handoff.md` for the full
implemented-vs-required runtime map.
