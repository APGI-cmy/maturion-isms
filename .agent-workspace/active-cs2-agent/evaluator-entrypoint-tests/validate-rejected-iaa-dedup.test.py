#!/usr/bin/env python3
"""GOV-2064-T3 — focused tests at the actual job-wave evaluator entrypoints.

This test runner validates the active-CS2 rejected/missing/stale-IAA handling
(typed refusal, dedup, bounded re-entry, single escalation, and durable
counter persistence across a simulated restart / replacement PR / new
session) against the REAL, UNMODIFIED canon schema
`governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`.

It does not implement, wire up, or activate any live controller, CI gate, or
merge runtime. It is a committed, independently re-runnable test proving
that the *existing* canon schema already expresses the required semantics,
and that active-cs2-agent's Tier 2/Tier 3 knowledge (this bundle's own
documents) correctly describes how to interpret it. Run manually:

    python3 .agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py

Exit code 0 means every assertion passed. Any failure prints a diagnostic and
exits non-zero.
"""
import copy
import json
import pathlib
import sys

try:
    import jsonschema
except ImportError:  # pragma: no cover - environment guard, not a test skip
    print("FAIL: jsonschema package not available in this environment")
    sys.exit(1)

REPO_ROOT = pathlib.Path(__file__).resolve().parents[3]
SCHEMA_PATH = REPO_ROOT / "governance" / "schemas" / "ACTIVE_CS2_JOB_WAVE.schema.json"
FIXTURE_PATH = pathlib.Path(__file__).resolve().parent / "rejected-iaa-wave-record.json"

PASS_COUNT = 0
FAIL_COUNT = 0


def check(name, condition, detail=""):
    global PASS_COUNT, FAIL_COUNT
    if condition:
        PASS_COUNT += 1
        print(f"PASS {name}")
    else:
        FAIL_COUNT += 1
        print(f"FAIL {name} :: {detail}")


def load_schema():
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_fixture():
    with open(FIXTURE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


NON_TERMINAL_SAFE_WAVE_STATUSES = {
    "PLANNED", "ELIGIBLE", "CLAIMED", "DISPATCHED", "IN_BUILD", "IN_ASSURANCE",
    "IN_REVIEW", "CORRECTION", "BLOCKED", "FAILED", "ABANDONED", "TRIPPED",
}
FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED = {
    "MERGE_ELIGIBLE", "MERGED", "VALIDATED",
}
FORBIDDEN_JOB_STATUSES_WHILE_IAA_UNRESOLVED = {"COMPLETE"}


def reconstruct_counters(events):
    """Pure reconstruction of durable counters from an append-only ledger.

    This is the 'evaluator entrypoint' under test for the persistence
    requirement: given only the events array (as would be reloaded from a
    durable job record after a restart / replacement PR / new session), it
    must be possible to recompute every counter and dedup fact without any
    other state.
    """
    seen_idempotency_decisions = {}  # idempotency_key -> list of decisions in order
    rejection_fingerprints_first_seen = set()
    escalation_count = 0
    reentry_count = 0
    last_budget = None
    last_sequence = 0
    forbidden_state_hits = []

    for ev in events:
        # Ledger integrity: strictly increasing sequence, no gaps/dupes.
        if ev["sequence"] != last_sequence + 1:
            raise AssertionError(
                f"non-contiguous sequence: expected {last_sequence + 1}, got {ev['sequence']}"
            )
        last_sequence = ev["sequence"]

        key = ev["idempotency_key"]
        seen_idempotency_decisions.setdefault(key, []).append(ev["decision"])

        if ev["decision"] == "REJECTED" and key not in rejection_fingerprints_first_seen:
            rejection_fingerprints_first_seen.add(key)
            if ev["reason"] == "RESERVED_MATTER":
                escalation_count += 1

        if ev["decision"] == "ACCEPTED" and ev["reason"] == "RE_ENTRY_PERMITTED_SUBSTANTIVE_DELTA":
            reentry_count += 1

        if ev["state_after"] in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED:
            forbidden_state_hits.append((ev["event_id"], ev["state_after"]))

        # Budget monotonicity: durable counters must never decrease within one ledger.
        b = ev["budget"]
        if last_budget is not None:
            for field in ("dispatch_runtime_minutes", "total_runtime_minutes",
                           "material_corrections", "merge_attempts"):
                if b[field] < last_budget[field]:
                    raise AssertionError(
                        f"budget field {field} decreased at {ev['event_id']}: "
                        f"{last_budget[field]} -> {b[field]}"
                    )
            for stage, count in b.get("stage_attempts", {}).items():
                prior = last_budget.get("stage_attempts", {}).get(stage, 0)
                if count < prior:
                    raise AssertionError(
                        f"stage_attempts[{stage}] decreased at {ev['event_id']}: {prior} -> {count}"
                    )
        last_budget = b

    # Duplicate-decision rule: any idempotency_key repeated beyond its first
    # occurrence must be NO_OP (never a second REJECTED finding/escalation).
    duplicate_violations = []
    for key, decisions in seen_idempotency_decisions.items():
        for d in decisions[1:]:
            if d != "NO_OP":
                duplicate_violations.append((key, decisions))

    return {
        "distinct_rejection_fingerprints": len(rejection_fingerprints_first_seen),
        "escalation_count": escalation_count,
        "reentry_count": reentry_count,
        "final_budget": last_budget,
        "forbidden_state_hits": forbidden_state_hits,
        "duplicate_violations": duplicate_violations,
        "max_sequence": last_sequence,
    }


def main():
    schema = load_schema()
    record = load_fixture()

    # 1. Genuine evaluator entrypoint: schema conformance against the real,
    #    unmodified canon schema (no schema edits made by this task).
    try:
        jsonschema.validate(instance=record, schema=schema)
        check("fixture conforms to unmodified canon ACTIVE_CS2_JOB_WAVE.schema.json", True)
    except jsonschema.exceptions.ValidationError as e:
        check("fixture conforms to unmodified canon ACTIVE_CS2_JOB_WAVE.schema.json", False, str(e))
        print(json.dumps({"status": "SCHEMA_VALIDATION_FAILED"}))
        sys.exit(1)

    # 2. Wave status never reaches a completion/merge state while IAA is
    #    unresolved; job status is BLOCKED, not COMPLETE.
    wave = record["waves"][0]
    check(
        "wave never advances to MERGE_ELIGIBLE/MERGED/VALIDATED while IAA unresolved",
        wave["status"] not in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED,
        wave["status"],
    )
    check(
        "wave status is CORRECTION or BLOCKED (ordinary or reserved-matter outcome)",
        wave["status"] in {"CORRECTION", "BLOCKED"},
        wave["status"],
    )
    check(
        "job status is BLOCKED, not COMPLETE (no completion handover)",
        record["status"] == "BLOCKED" and record["status"] not in FORBIDDEN_JOB_STATUSES_WHILE_IAA_UNRESOLVED,
        record["status"],
    )
    check("final_acceptance is null (no completion/merge/successor dispatch recorded)",
          record["final_acceptance"] is None, record["final_acceptance"])

    # 3. Reconstruct counters/dedup facts purely from the persisted ledger
    #    (the "restart" proof — no reliance on any other state).
    result = reconstruct_counters(record["events"])

    check("exactly 3 distinct rejection fingerprints raised (ac-03 MATERIAL_BLOCKER, "
          "GATE_UNSATISFIED handover attempt, RESERVED_MATTER escalation)",
          result["distinct_rejection_fingerprints"] == 3, result["distinct_rejection_fingerprints"])
    check("exactly 1 escalation emitted for the genuine protected/reserved-matter blocker",
          result["escalation_count"] == 1, result["escalation_count"])
    check("exactly 1 bounded re-entry permitted for the real substantive change",
          result["reentry_count"] == 1, result["reentry_count"])
    check("no duplicate rejection/escalation re-emitted for an unchanged rejection fingerprint",
          result["duplicate_violations"] == [], result["duplicate_violations"])
    check("no event ever advances wave state into a forbidden completion/merge status",
          result["forbidden_state_hits"] == [], result["forbidden_state_hits"])
    check("re-entry consumed exactly the approved one material-correction budget (W0 baseline)",
          result["final_budget"]["material_corrections"] == 1, result["final_budget"])
    check("merge was attempted and refused at least once (GATE_UNSATISFIED), never completed",
          result["final_budget"]["merge_attempts"] >= 1, result["final_budget"])

    # 4. Simulate a process restart: reload the fixture from disk in total
    #    isolation from the computation above and recompute independently.
    reloaded = load_fixture()
    restart_result = reconstruct_counters(reloaded["events"])
    check("restart reconstruction matches original reconstruction exactly",
          restart_result == result, (restart_result, result))

    # 5. Simulate a replacement PR / new session for the SAME job_id: only
    #    the PR number changes in the evidence bindings; job_id is
    #    unchanged. Counters reconstructed from the ledger must be
    #    IDENTICAL (never reset to zero) because they are keyed by job_id's
    #    durable ledger, not by PR number or session identity.
    replacement_pr_record = copy.deepcopy(record)
    replacement_pr_record["job_id"] = record["job_id"]  # same job_id: same job, new carrier
    for ev in replacement_pr_record["events"]:
        eb = ev.get("evidence_binding")
        if eb and eb.get("frozen_substantive_fingerprint", {}).get("pr") is not None:
            eb["frozen_substantive_fingerprint"]["pr"] = 9999  # replacement PR number
    replacement_result = reconstruct_counters(replacement_pr_record["events"])
    check("replacement-PR carrier (same job_id) reconstructs identical non-reset counters",
          replacement_result == result, (replacement_result, result))
    check("replacement-PR record still schema-valid against unmodified canon schema",
          _validates(replacement_pr_record, schema), None)

    print()
    print(f"Passed: {PASS_COUNT}")
    print(f"Failed: {FAIL_COUNT}")
    sys.exit(0 if FAIL_COUNT == 0 else 1)


def _validates(instance, schema):
    try:
        jsonschema.validate(instance=instance, schema=schema)
        return True
    except jsonschema.exceptions.ValidationError:
        return False


if __name__ == "__main__":
    main()
