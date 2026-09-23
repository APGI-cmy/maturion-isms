# Active-CS2 — Bootstrap Input Validation Specification

## Rule

Every input becomes mandatory only at the stage where that input is actually due. Once due, `MISSING`, `STALE`, `CONTRADICTORY`, and `INVALID` are blocking and produce a fail-closed halt, refusal, or handoff.

## Stage model

1. **Session bootstrap** — identity, knowledge, and governance load for any invocation.
2. **Approved-job intake** — the first moment an exact CS2-approved parent job and wave plan are received.
3. **PR-bound repository execution** — a stage where the job is bound to a concrete PR/reviewed head and repository handoff path.
4. **Wave handover** — QP/ECAP/admin validation for the produced repository packet.
5. **Final merge / refusal** — current checks, merge policy, and final independent assurance.

## Session bootstrap prerequisites

| input_id | Required source | Validation |
|---|---|---|
| `tier1_contract` | `.github/agents/active-cs2-agent.md` | File exists; YAML parses; identity, lock, and contract version recorded |
| `tier2_required_files` | Every `tier2_knowledge.required_files` path | Each file exists, is readable, and is indexed |
| `continuity_files` | Every `tier2_knowledge.continuity_files` path | Each file exists and is readable |
| `session_history_or_no_history` | last five session memory files or explicit none-yet note | Honest no-history state recorded for a new agent |
| `canon_inventory_integrity` | `governance/CANON_INVENTORY.json` | UTF-8 JSON parses; no reserved markers; expected artifacts present |
| `active_cs2_governance` | active-CS2 canon + control map | Paths exist and versions are recorded |
| `job_wave_schema_and_templates` | schema, merge-policy schema, job record template, dispatch template | Paths exist and are readable |

## Approved-job intake prerequisites

| input_id | Required source | Validation |
|---|---|---|
| `approved_parent_job_record` | exact CS2-approved parent job record | Record exists, names one job, and conforms to the approved schema/version |
| `approved_wave_plan` | approved wave collection inside the job record | Non-empty wave set, stable `wave_id` / `ordinal`, and dependency graph acceptable for evaluation |
| `authority_reference` | CS2 approval reference bound to the job | Exact authority reference is present and non-empty |
| `job_envelope_and_fingerprint` | approved scope/envelope plus repository or content fingerprint available at intake | Envelope exists and the observed intake fingerprint matches the approved job context |

## PR-bound repository execution prerequisites

| input_id | Required source | Validation |
|---|---|---|
| `pr_scoped_manifest` | `.admin/prs/pr-<PR>.json` | Exists; PR/issue/branch/base/head binding coherent |
| `pr_scoped_scope` | `.agent-admin/scope-declarations/pr-<PR>.md` | Exists; exact PR and branch binding recorded |
| `pr_scoped_wave_tasks` | `.agent-admin/prs/pr-<PR>/wave-current-tasks.md` | Exists; active task set and current-head model recorded |
| `current_head_binding` | `git rev-parse HEAD` + PR-scoped records | Observed head matches the reviewed-head model required for the current stage |
| `iaa_prebrief_record` | PR-scoped IAA wave record or equivalent approved pre-brief carrier | Exists before PR-bound implementation/handover is advanced to final ceremony |

## Wave handover prerequisites

| input_id | Required source | Validation |
|---|---|---|
| `qp_result` | stage-appropriate QP evidence | Binary PASS/FAIL exists for the current deliverable |
| `ecap_admin_bundle_when_required` | PR-scoped ECAP artifact when the wave requires ceremony-admin validation | Present only when ECAP is actually required; absent ECAP is blocking only for ECAP-bound handover stages |
| `prehandover_and_session_memory` | PR-scoped PREHANDOVER proof and session memory | Paths exist, are current for the reviewed bundle, and do not overclaim assurance or readiness |

## Final merge / refusal prerequisites

| input_id | Required source | Validation |
|---|---|---|
| `merge_policy` | approved machine-readable merge policy | Exists, matches repository/branch/path/job/wave scope, and is current |
| `current_required_checks` | live required checks for the reviewed head | Current, passing, and aligned to the reviewed submission |
| `final_independent_iaa` | final independent IAA verdict bound to the reviewed content | Genuine final PASS or rejection package exists; pre-brief alone is never sufficient |
| `fresh_compare_and_set_binding` | current reviewed fingerprint / merge head binding | Fresh enough for final merge or explicit refusal logic |

## Record schema

```yaml
input_id: approved_parent_job_record
stage_due: approved_job_intake
required_source: <exact job record path or authority carrier>
validation_method: existence + schema + authority-reference check
expected_value: exact CS2-approved parent job record
observed_value: [observed path or mismatch text]
status: PASS
checked_at_utc: <ISO-8601>
```

## Evaluation

1. Validate existence/readability first.
2. Parse JSON/YAML/text only after existence succeeds.
3. Never require a stage's own future outputs as a bootstrap prerequisite.
4. When a stage is not yet active, record later-stage inputs as `NOT_DUE_YET`, not `MISSING`.
5. An all-`PASS` matrix for the active stage permits progression; any due non-pass requires a typed halt, refusal, or handoff.
