# GOV-2064-T3 — Protocol-Model Fixture Consistency Tests

These files provide **only schema-valid protocol-model fixture consistency coverage**.
The runner checks that the fixture conforms to the real, unmodified canon schema
`governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json` and that fixture data and local
calculations are consistent with the expected protocol model. It does **NOT** execute or
prove active-CS2 evaluator/controller behavior. It does not call a live evaluator or
controller, and it is not wired into any CI workflow or runtime.

## Files

- `rejected-iaa-wave-record.json` — a schema-valid protocol-model fixture encoding expected
  values for an IAA rejection (`MATERIAL_BLOCKER`), duplicate finding (`NO_OP`), blocked
  completion attempt while IAA is missing (`GATE_UNSATISFIED`), one modeled bounded re-entry,
  one modeled protected/reserved-matter escalation, and an explicit stale-PASS
  `EVIDENCE_STALE` event whose evidence fingerprint differs from the current reviewed
  fingerprint. Its dependent successor remains `PLANNED` and ineligible for release or merge
  while the current wave is unresolved. These are fixture values, not observed runtime
  outcomes.
- `validate-rejected-iaa-dedup.test.py` — a Python test runner that validates the fixture
  against the real canon schema and checks consistency of fixture fields and local
  calculations. Its focused assertions tie stale-PASS/current-fingerprint mismatch to blocked
  `final_acceptance`, blocked merge eligibility, and an undispatched/ineligible dependent
  successor. Other assertions cover dedup and modeled counters. They do not exercise durable
  storage, process restart, evaluator, or controller behavior.

## Running

```bash
python3 .agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py
```

Expected output:

```text
Passed: 24
Failed: 0
Coverage: schema-valid protocol-model fixture consistency only; active-CS2 evaluator/controller behavior NOT executed or proven.
```

Exit code `0` means only that the schema and protocol-model fixture consistency assertions
passed. It is not evidence that active-CS2 evaluator/controller behavior is executed or
enforced.

## Why this is not an activation claim

No GitHub Actions workflow, merge gate, or runtime process invokes this script. It is a
manually re-runnable consistency test only. `active-cs2-agent` remains `CONTRACT_READY /
INACTIVE` — see `runtime-integration-handoff.md` for the implemented-vs-required runtime map.
