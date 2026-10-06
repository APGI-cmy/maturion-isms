#!/usr/bin/env python3
"""GOV-2064-T3 — schema-valid protocol-model fixture consistency coverage.

This manually run script validates a fixture against the real, unmodified
canon schema `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json` and checks
the consistency of fixture data and locally calculated protocol-model
expectations. The assertions cover typed refusal values, dedup, bounded
re-entry, counters, stale-fingerprint handling, blocked completion/merge,
and an undispatched successor as represented by the fixture and local model.

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
    check("successor dependency points to the rejected current wave",
          successor["depends_on"] == [wave["wave_id"]], successor["depends_on"])

    # 3. Recalculate counters/dedup facts from fixture events. This checks
    #    modeled consistency only; it does not exercise restart behavior.
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

    # 6. A prior IAA PASS bound to an older fingerprint is stale against the
    #    current reviewed fingerprint. Its EVIDENCE_STALE refusal blocks
    #    handover, merge eligibility, and any dependent successor dispatch.
    (stale_record, stale_wave, stale_successor, stale_pass_binding,
     current_fingerprint) = build_stale_iaa_scenario(record)
    check("stale-IAA scenario conforms to unmodified canon schema",
          _validates(stale_record, schema), None)
    stale_refusal = stale_record["events"][-1]
    check("stale PASS/current-fingerprint mismatch emits typed EVIDENCE_STALE refusal",
          stale_pass_binding["frozen_substantive_fingerprint"][
              "reviewed_content_sha256"
          ] != current_fingerprint["reviewed_content_sha256"]
          and stale_pass_binding["frozen_substantive_fingerprint"]["head_sha"]
          != current_fingerprint["head_sha"]
          and stale_pass_binding["current_merge_head_sha"]
          == current_fingerprint["head_sha"]
          and stale_refusal["decision"] == "REJECTED"
          and stale_refusal["reason"] == "EVIDENCE_STALE",
          stale_refusal)
    check("stale IAA blocks completion handover",
          stale_record["status"] == "BLOCKED"
          and stale_record["final_acceptance"] is None,
          (stale_record["status"], stale_record["final_acceptance"]))
    check("stale IAA blocks merge eligibility and keeps current_wave_id unchanged",
          stale_wave["status"] == "CORRECTION"
          and stale_record["current_wave_id"] == stale_wave["wave_id"]
          and not any(
              ev["state_after"] in FORBIDDEN_WAVE_STATUSES_WHILE_IAA_UNRESOLVED
              for ev in stale_record["events"]
          ),
          (stale_wave["status"], stale_record["current_wave_id"]))
    check("stale IAA keeps dependent successor undispatched",
          stale_successor["status"] == "PLANNED"
          and stale_successor["wave_id"] not in {
              ev["wave_id"] for ev in stale_record["events"]
          },
          stale_successor)

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


def build_stale_iaa_scenario(record):
    """Create a schema-valid stale-PASS/current-fingerprint-mismatch case."""
    stale_record = copy.deepcopy(record)
    stale_wave = stale_record["waves"][0]
    successor_wave = stale_record["waves"][1]
    stale_record["status"] = "BLOCKED"
    stale_record["current_wave_id"] = stale_wave["wave_id"]
    stale_record["final_acceptance"] = None
    stale_wave["status"] = "CORRECTION"
    stale_record["events"] = stale_record["events"][:4]

    stale_pass_binding = copy.deepcopy(
        record["events"][0]["evidence_binding"]
    )
    current_fingerprint = record["events"][3]["evidence_binding"][
        "frozen_substantive_fingerprint"
    ]
    stale_pass_binding["current_merge_head_sha"] = current_fingerprint["head_sha"]
    stale_wave["merge_evidence"] = {
        "policy_version": "stale-iaa-test-policy-v1",
        "evidence_binding": stale_pass_binding,
        "iaa_reference": (
            "stale-IAA-PASS:"
            + stale_pass_binding["frozen_substantive_fingerprint"][
                "reviewed_content_sha256"
            ]
        ),
    }
    stale_record["events"].append(
        {
            "event_id": "evt-stale-iaa-refusal",
            "idempotency_key": (
                "stale-iaa-pass::"
                + stale_pass_binding["frozen_substantive_fingerprint"][
                    "reviewed_content_sha256"
                ]
                + "::"
                + current_fingerprint["reviewed_content_sha256"]
            ),
            "sequence": 5,
            "wave_id": stale_wave["wave_id"],
            "stage": "FINAL_IAA",
            "event_type": "stale_iaa_pass_detected",
            "input_revision": "rev-2",
            "state_before": "IN_REVIEW",
            "state_after": "CORRECTION",
            "decision": "REJECTED",
            "reason": "EVIDENCE_STALE",
            "owner": "active-cs2-agent",
            "envelope_id": stale_record["envelope"]["envelope_id"],
            "delta_class": "UNKNOWN",
            "evidence_binding": copy.deepcopy(stale_pass_binding),
            "evidence_references": [stale_wave["merge_evidence"]["iaa_reference"]],
            "material_blockers": [
                "IAA PASS fingerprint differs from current reviewed-content fingerprint"
            ],
            "budget": copy.deepcopy(record["events"][3]["budget"]),
        }
    )
    return stale_record, stale_wave, successor_wave, stale_pass_binding, current_fingerprint


if __name__ == "__main__":
    main()
