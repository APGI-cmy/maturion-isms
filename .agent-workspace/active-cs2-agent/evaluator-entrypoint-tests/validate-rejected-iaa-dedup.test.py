#!/usr/bin/env python3
"""GOV-2064-T3 — schema-valid protocol-model fixture consistency coverage.

This manually run script validates a fixture against the real, unmodified
canon schema `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json` and checks
the consistency of fixture data and locally calculated protocol-model
expectations. The assertions cover typed refusal values, dedup, bounded
re-entry, counters, stale-fingerprint handling, blocked completion/merge, and
an undispatched successor as represented by the fixture and local model. A
separate isolated stale-only scenario removes the fixture's unrelated
preceding rejection and reserved-matter event effects from the
state-transition assertion.

This is only schema-valid protocol-model fixture consistency coverage. It
does NOT execute or prove active-CS2 evaluator/controller behavior. The script
does not call or implement an evaluator, controller, CI gate, or merge
runtime, and a passing result is not evidence that such behavior is enforced.
Run manually:

    python3 .agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py

Exit code 0 means every fixture/schema/model-consistency assertion passed.
The final output explicitly states the coverage limitation. Any failure
prints a diagnostic and exits non-zero.
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
SUCCESSOR_RELEASE_OR_MERGE_STATUSES = {
    "ELIGIBLE", "CLAIMED", "DISPATCHED", "IN_BUILD", "IN_ASSURANCE",
    "IN_REVIEW", "MERGE_ELIGIBLE", "MERGED", "VALIDATED",
}
FORBIDDEN_JOB_STATUSES_WHILE_IAA_UNRESOLVED = {"COMPLETE"}


def reconstruct_counters(events):
    """Recalculate counters from fixture events to check model consistency.

    This local calculation does not load a durable job record or exercise a
    live evaluator/controller. It checks whether the represented event data
    is internally consistent with the fixture's modeled expectations.
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

    # 1. Validate fixture conformance against the real, unmodified canon
    #    schema (no schema edits made by this task).
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
    successor = record["waves"][1]
    check("current_wave_id remains on the rejected/blocked wave",
          record["current_wave_id"] == wave["wave_id"], record["current_wave_id"])
    check("dependent successor remains PLANNED and undispatched",
          successor["status"] == "PLANNED"
          and successor["wave_id"] not in {ev["wave_id"] for ev in record["events"]},
          successor)
    check("dependent successor is ineligible for release or merge while predecessor is unresolved",
          wave["status"] in {"CORRECTION", "BLOCKED"}
          and successor["status"] not in SUCCESSOR_RELEASE_OR_MERGE_STATUSES
          and not any(
              ev["wave_id"] == successor["wave_id"]
              and ev["stage"] in {"DISPATCH", "MERGE"}
              for ev in record["events"]
          ),
          (wave["status"], successor["status"]))
    check("successor dependency points to the rejected current wave",
          successor["depends_on"] == [wave["wave_id"]], successor["depends_on"])

    # 3. Recalculate counters/dedup facts from fixture events. This checks
    #    modeled consistency only; it does not exercise restart behavior.
    result = reconstruct_counters(record["events"])

    check("exactly 4 distinct rejection fingerprints raised (MATERIAL_BLOCKER, "
          "GATE_UNSATISFIED, RESERVED_MATTER, EVIDENCE_STALE)",
          result["distinct_rejection_fingerprints"] == 4, result["distinct_rejection_fingerprints"])
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

    # 4. Reload the fixture from disk and recompute independently, checking
    #    fixture/model consistency only (not actual process restart behavior).
    reloaded = load_fixture()
    restart_result = reconstruct_counters(reloaded["events"])
    check("restart reconstruction matches original reconstruction exactly",
          restart_result == result, (restart_result, result))

    # 5. Model a replacement PR / new session for the SAME job_id by changing
    #    only the PR number in the fixture copy. Check that local calculations
    #    remain identical; this does not test any live persistence behavior.
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

    # 6. The fixture explicitly records a stale PASS and EVIDENCE_STALE
    #    refusal. These assertions check only fixture/model consistency.
    stale_refusal = next(
        ev for ev in record["events"] if ev["reason"] == "EVIDENCE_STALE"
    )
    stale_pass_binding = stale_refusal["evidence_binding"]
    stale_fingerprint = stale_pass_binding["frozen_substantive_fingerprint"]
    current_fingerprint = record["events"][3]["evidence_binding"][
        "frozen_substantive_fingerprint"
    ]
    check("fixture contains an explicit stale-PASS EVIDENCE_STALE refusal event",
          stale_refusal["event_type"] == "stale_iaa_pass_detected"
          and stale_refusal["decision"] == "REJECTED"
          and stale_refusal["evidence_references"]
          == [record["waves"][0]["merge_evidence"]["iaa_reference"]]
          and record["waves"][0]["merge_evidence"]["iaa_reference"].startswith(
              "stale-IAA-PASS:"
          ),
          stale_refusal)
    check("stale PASS fingerprint mismatches current reviewed fingerprint and head",
          stale_fingerprint["reviewed_content_sha256"]
          != current_fingerprint["reviewed_content_sha256"]
          and stale_fingerprint["head_sha"] != current_fingerprint["head_sha"]
          and stale_pass_binding["current_merge_head_sha"]
          == current_fingerprint["head_sha"],
          (stale_fingerprint, current_fingerprint))
    check("stale PASS mismatch keeps final_acceptance blocked",
          record["status"] == "BLOCKED" and record["final_acceptance"] is None,
          (record["status"], record["final_acceptance"]))
    check("stale PASS mismatch blocks merge eligibility for the unresolved current wave",
          record["current_wave_id"] == wave["wave_id"]
          and wave["status"] in {"CORRECTION", "BLOCKED"}
          and wave["status"] not in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED
          and not any(
              ev["state_after"] in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED
              for ev in record["events"]
          ),
          (wave["status"], record["current_wave_id"]))
    check("stale PASS mismatch leaves dependent successor undispatched and ineligible",
          successor["depends_on"] == [wave["wave_id"]]
          and successor["status"] == "PLANNED"
          and successor["status"] not in SUCCESSOR_RELEASE_OR_MERGE_STATUSES
          and successor["wave_id"] not in {
              ev["wave_id"] for ev in record["events"]
          },
          successor)

    # 7. Isolate stale-PASS handling from evt-1..evt-6, especially the prior
    #    RESERVED_MATTER transition at evt-5. Preserve evt-7's explicit stale
    #    binding and resulting state so a mutation of only its blocking
    #    transition cannot be hidden by the main fixture's already-BLOCKED
    #    state. The isolated scenario starts at pre-review IN_REVIEW and has
    #    exactly one event: the stale-PASS refusal itself.
    stale_only_record = copy.deepcopy(record)
    stale_only_event = copy.deepcopy(stale_refusal)
    stale_only_event["sequence"] = 1
    stale_only_event["state_before"] = "IN_REVIEW"
    stale_only_record["events"] = [stale_only_event]
    stale_only_record["waves"][0]["status"] = stale_only_event["state_after"]
    stale_only_record["status"] = "BLOCKED"
    stale_only_wave = stale_only_record["waves"][0]
    stale_only_successor = stale_only_record["waves"][1]

    check("stale-only isolated scenario conforms to unmodified canon schema",
          _validates(stale_only_record, schema), None)
    check("stale-only scenario has no preceding event or blocker",
          len(stale_only_record["events"]) == 1
          and stale_only_event["reason"] == "EVIDENCE_STALE"
          and stale_only_event["decision"] == "REJECTED",
          stale_only_record["events"])
    check("STALE_ONLY_BLOCKING_TRANSITION: EVIDENCE_STALE from IN_REVIEW transitions to CORRECTION or BLOCKED",
          stale_only_event["state_before"] == "IN_REVIEW"
          and stale_only_event["state_after"] in {"CORRECTION", "BLOCKED"}
          and stale_only_wave["status"] == stale_only_event["state_after"],
          (stale_only_event["state_before"], stale_only_event["state_after"]))
    check("stale-only refusal keeps final_acceptance null",
          stale_only_record["final_acceptance"] is None,
          stale_only_record["final_acceptance"])
    check("stale-only refusal leaves current wave merge-ineligible",
          stale_only_record["current_wave_id"] == stale_only_wave["wave_id"]
          and stale_only_wave["status"] in {"CORRECTION", "BLOCKED"}
          and stale_only_wave["status"] not in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED
          and not any(ev["stage"] == "MERGE" for ev in stale_only_record["events"]),
          stale_only_wave["status"])
    check("stale-only refusal leaves dependent successor PLANNED and undispatched",
          stale_only_successor["depends_on"] == [stale_only_wave["wave_id"]]
          and stale_only_successor["status"] == "PLANNED"
          and stale_only_successor["wave_id"] not in {
              ev["wave_id"] for ev in stale_only_record["events"]
          },
          stale_only_successor)
    check("stale-only refusal keeps dependent successor ineligible",
          stale_only_wave["status"] in {"CORRECTION", "BLOCKED"}
          and stale_only_successor["status"] not in SUCCESSOR_RELEASE_OR_MERGE_STATUSES
          and not any(
              ev["wave_id"] == stale_only_successor["wave_id"]
              and ev["stage"] in {"DISPATCH", "MERGE"}
              for ev in stale_only_record["events"]
          ),
          (stale_only_wave["status"], stale_only_successor["status"]))

    print()
    print(f"Passed: {PASS_COUNT}")
    print(f"Failed: {FAIL_COUNT}")
    print(
        "Coverage: schema-valid protocol-model fixture consistency only; "
        "active-CS2 evaluator/controller behavior NOT executed or proven."
    )
    sys.exit(0 if FAIL_COUNT == 0 else 1)


def _validates(instance, schema):
    try:
        jsonschema.validate(instance=instance, schema=schema)
        return True
    except jsonschema.exceptions.ValidationError:
        return False


if __name__ == "__main__":
    main()
