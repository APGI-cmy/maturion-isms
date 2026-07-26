# Foreman v2 — Session Memory Template

**Agent:** `foreman-v2-agent`
**Tier:** 2 operational knowledge
**Template version:** 1.0.0
**Last updated:** 2026-07-26
**Authority:** CS2 (Johan Ras)

---

## Purpose

Use this template for every Foreman session memory created under:

```text
.agent-workspace/foreman-v2/memory/session-<session-id>-<YYYYMMDD>.md
```

The completed memory is continuity and evidence, not an authority substitute. It must report the actual state without converting pending, rejected, missing, stale, or unavailable evidence into a PASS.

---

## Required template

```markdown
# Foreman v2 Session Memory — <session-id> — <YYYY-MM-DD>

## Identity and authority

- agent_id: foreman-v2-agent
- agent_class: foreman
- contract_version: <version from Tier 1>
- session_id: <session-id>
- date_utc: <YYYY-MM-DD>
- repository: <owner/repository>
- branch: <branch>
- base_sha: <40-character SHA>
- current_head_sha: <40-character SHA>
- cs2_authorization: <issue/comment/reference>
- module_or_scope: <module or governance scope>
- operating_mode: <POLC_ORCHESTRATION | IMPLEMENTATION_GUARD | QUALITY_PROFESSOR>

## Bootstrap preamble

- tier1_contract_loaded: <true | false>
- tier2_index_loaded: <true | false>
- tier2_required_files_verified: <true | false>
- canon_inventory_status: <VALID | DEGRADED | MISSING>
- fail_only_once_attested: <true | false>
- fail_only_once_version: <version>
- unresolved_breaches: <none | list>
- prior_sessions_reviewed: <list of session memory paths>
- unresolved_items_from_prior_sessions: <none | list>
- pending_escalations_reviewed: <none | list>
- bootstrap_result: <PASS | HALT>

## Task and bounded scope

- task_summary: <requested outcome>
- issue_or_wave: <reference>
- in_scope_files: <list>
- out_of_scope: <list>
- acceptance_criteria: <list>
- stop_conditions: <list>

## Pre-build and lifecycle state

| Artifact or stage | Path/reference | State | Evidence or blocker |
|---|---|---|---|
| App Description / scope authority | | | |
| UX / FRS / TRS / Architecture, as applicable | | | |
| QA-to-Red | | | |
| PBFAG | | | |
| Implementation Plan | | | |
| Builder Checklist | | | |
| IAA pre-brief | | | |
| Builder appointment | | | |
| Build / execution | | | |

## Roles invoked and delegation

| Sequence | Role or agent | Task reference | Appointment/evidence path | Commit SHA | Result |
|---|---|---|---|---|---|
| 1 | independent-assurance-agent (pre-brief), if applicable | | | | |
| 2 | builder/specialist, if applicable | | | | |
| 3 | Foreman Quality Professor | | | | |
| 4 | execution-ceremony-admin-agent, if applicable | | | | |
| 5 | independent-assurance-agent (final), if applicable | | | | |

- delegation_order_verified: <true | false | not_applicable>
- first_implementation_commit_sha: <SHA | none>
- foreman_implemented_prohibited_work: false

## Work and evidence produced

| File or external target | Operation | Owner role | Evidence/result |
|---|---|---|---|
| | | | |

## Quality Professor review

- qp_applicable: <true | false>
- qp_evidence_path: <path | none>
- tests_executed: <commands>
- tests_passed: <count>
- tests_failed: <count>
- tests_skipped_todo_incomplete: <count>
- warnings: <none | list>
- full_diff_reviewed: <true | false>
- architecture_and_scope_conformant: <true | false>
- qp_verdict: <PASS | FAIL | PENDING | NOT_APPLICABLE>
- qp_blocking_findings: <none | list>

## ECAP administrative validation

- ecap_required: <true | false>
- ecap_evidence_path: <path | none>
- admin_fields_current: <true | false | pending>
- scope_current: <true | false | pending>
- exact_head_binding: <SHA | pending>
- ecap_result: <ADMIN_VALIDATED | REJECTED | PENDING | NOT_REQUIRED>
- ecap_findings: <none | list>

## Independent assurance

- prebrief_wave_record: <path | none>
- prebrief_result: <PREFLIGHT_BRIEF_COMPLETE | missing | not_applicable>
- final_iaa_invoked: <true | false>
- final_iaa_evidence_path: <wave-record path | none>
- final_iaa_token: <token | none>
- final_iaa_verdict: <PASS | REJECTION | PENDING | NOT_APPLICABLE>
- final_iaa_findings: <none | list>

## CI and merge-gate evidence

- pr_number: <number | none>
- frozen_head_sha: <40-character SHA | none>
- required_checks_source: <manifest path>
- required_checks_green: <true | false | pending>
- workflow_runs_inspected: <list of run URLs/IDs>
- unresolved_review_threads: <count | unknown>
- mergeable_state: <state | unknown>
- prehandover_gate: <PASS | FAIL | NOT_APPLICABLE | PENDING>
- handover_allowed: <true | false>
- merge_authority: CS2_ONLY

## Tracker and continuity

- tracker_path: <module tracker or governance record>
- tracker_updated: <true | false | not_applicable>
- tracker_current_state: <state>
- successor_issue_or_wave: <reference | none>
- successor_entry_conditions: <list>

## Blockers and escalations

| ID | Blocker | Responsible owner | Required remediation | State |
|---|---|---|---|---|
| | | | | |

## Decisions and rationale

| Decision | Evidence/rationale | Authority |
|---|---|---|
| | | |

## Next action

- immediate_next_action: <single controlled next action>
- action_owner: <role/person>
- may_start_now: <true | false>
- conditions_before_start: <none | list>
- prohibited_next_actions: <list>

## Session close

- outcome: <PASS_TO_NEXT_STATE | STOP_AND_FIX | HALT | AWAIT_CS2>
- session_memory_complete: <true | false>
- prehandover_memory_path: <path | not_applicable>
- suggestions_for_improvement: <specific non-blank observation>
- closed_at_utc: <timestamp>
```

---

## Completion rules

1. Populate every field; use an explicit `none`, `not_applicable`, `pending`, or `unknown` only when truthful.
2. Record exact paths, SHAs, commands, run IDs, and issue/PR references where evidence exists.
3. Never record QP, ECAP, IAA, CI, pre-handover, or merge readiness as PASS without the corresponding current evidence.
4. Record the responsible owner and remediation for every blocker.
5. Keep the next action singular, bounded, and consistent with the current lifecycle state.
6. Commit session memory before final IAA when the governing wave requires it.

---

**Authority:** CS2 (Johan Ras)
**Related controls:** `.github/agents/foreman-v2-agent.md`, `foreman-tier2-operating-protocol.md`, `FAIL-ONLY-ONCE.md`
