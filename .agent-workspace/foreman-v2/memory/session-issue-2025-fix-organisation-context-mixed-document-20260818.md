# Foreman v2 Session Memory — issue-2025-fix-organisation-context-mixed-document — 2026-08-18

## Identity and authority

- agent_id: foreman-v2-agent
- agent_class: foreman
- contract_version: 2.17.0
- session_id: 06e5e398-7082-484e-9d68-8b9306369803
- date_utc: 2026-08-18
- repository: APGI-cmy/maturion-isms
- branch: apgi-cmy-issue-2025-fix-organisation-context-mixed-document-b10067
- base_sha: a618e03a68e3d6da5d28f68470531f0a43542dfb
- current_head_sha: pending (this commit)
- cs2_authorization: issue #2025 (https://github.com/APGI-cmy/maturion-isms/issues/2025), authored by APGI-cmy (OWNER), body states "CS2-authorized UAT remediation"
- module_or_scope: MMM organisation-context ingestion (UI repeatable uploads + `mmm-subject-knowledge-reprocess` Edge Function resource exhaustion)
- operating_mode: POLC_ORCHESTRATION

## Bootstrap preamble

- tier1_contract_loaded: true
- tier2_index_loaded: true
- tier2_required_files_verified: true
- canon_inventory_status: VALID (204 artifacts, zero invalid SHA-256 values per wake-up-protocol.sh Phase 3)
- fail_only_once_attested: true
- fail_only_once_version: v4.7.0 (per most recent prior cycle record; all incidents REMEDIATED, no OPEN/IN_PROGRESS)
- unresolved_breaches: none
- prior_sessions_reviewed:
  - .agent-workspace/foreman-v2/memory/foreman-cycle-20260818-0906.md
  - .agent-workspace/foreman-v2/memory/foreman-cycle-20260818-0901.md
  - .agent-workspace/foreman-v2/memory/foreman-cycle-20260818-0853.md
  - .agent-workspace/foreman-v2/memory/foreman-cycle-20260818-0710.md
  - .agent-workspace/foreman-v2/memory/session-issue-2016-retrospective-pr2006-20260813.md
- unresolved_items_from_prior_sessions: prior 2026-08-18 cycles concern issue #2019 (MMM Level 2 invite workflow), a separate lane awaiting CS2 lane establishment. Not blocking for issue #2025; this session operates in an isolated clean worktree dedicated to #2025.
- pending_escalations_reviewed: none applicable to #2025
- bootstrap_result: PASS

## Task and bounded scope

- task_summary: Fix organisation-context mixed-document ingestion resource exhaustion (`mmm-subject-knowledge-reprocess` HTTP 546 WORKER_RESOURCE_LIMIT ~125.6s) and implement repeatable optional supplementary upload rows, per issue #2025 frozen requirements.
- issue_or_wave: issue #2025
- in_scope_files: see `.agent-admin/scope-declarations/issue-2025.md`
- out_of_scope: see `.agent-admin/scope-declarations/issue-2025.md`
- acceptance_criteria: see Acceptance contract in `.agent-admin/scope-declarations/issue-2025.md`
- stop_conditions: any missing/stale prerequisite per Tier 1 §6 handover blockers; no builder before IAA PRE-BRIEF is canonical and committed.

## Pre-build and lifecycle state

| Artifact or stage | Path/reference | State | Evidence or blocker |
|---|---|---|---|
| CS2 authorization | issue #2025 | CONFIRMED | OWNER-authored issue body |
| Scope declaration | `.agent-admin/scope-declarations/issue-2025.md` | DRAFTED | this commit |
| QA-to-Red | pending | NOT_STARTED | awaiting IAA pre-brief + qa-builder appointment |
| Implementation Plan | folded into scope declaration architecture section | DRAFTED | this commit |
| IAA pre-brief | `.agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md` | PENDING | to be requested next |
| Builder appointment | pending | NOT_STARTED | awaiting IAA pre-brief |
| Build / execution | pending | NOT_STARTED | |

## Roles invoked and delegation

| Sequence | Role or agent | Task reference | Appointment/evidence path | Commit SHA | Result |
|---|---|---|---|---|---|
| 1 | independent-assurance-agent (pre-brief) | issue #2025 PRE-BRIEF | pending | pending | PENDING |

- delegation_order_verified: not_applicable (pending)
- first_implementation_commit_sha: none
- foreman_implemented_prohibited_work: false

## Work and evidence produced

| File or external target | Operation | Owner role | Evidence/result |
|---|---|---|---|
| `.agent-admin/scope-declarations/issue-2025.md` | create | foreman-v2-agent (orchestration artifact, not implementation) | this commit |
| `.agent-workspace/foreman-v2/memory/session-issue-2025-fix-organisation-context-mixed-document-20260818.md` | create | foreman-v2-agent | this commit |

## Quality Professor review

- qp_applicable: false (no builder delivery yet)
- qp_verdict: NOT_APPLICABLE

## ECAP administrative validation

- ecap_required: true (implementation PR)
- ecap_result: NOT_REQUIRED yet (pending build)

## Independent assurance

- prebrief_wave_record: pending — `.agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md`
- prebrief_result: missing (to be requested)
- final_iaa_invoked: false
- final_iaa_verdict: NOT_APPLICABLE

## CI and merge-gate evidence

- pr_number: pending (draft PR to be opened this cycle)
- required_checks_source: `.agent-admin/control/merge-gate-required-checks.json`
- required_checks_green: pending
- prehandover_gate: NOT_APPLICABLE
- handover_allowed: false
- merge_authority: CS2_ONLY

## Blockers and escalations

| ID | Blocker | Responsible owner | Required remediation | State |
|---|---|---|---|---|
| none | — | — | — | — |

## Decisions and rationale

| Decision | Evidence/rationale | Authority |
|---|---|---|
| Operate as isolated clean-worktree delivery Foreman for #2025 only; do not touch parent dirty worktree or #2019 lane | Explicit instruction from parent Foreman session (CS2-relayed) and issue #2025 scope | CS2 / parent Foreman session |
| Frozen scope authored before any builder delegation | Tier 1 §3 invocation order; Tier 2 §2 alignment controls | foreman-v2-agent contract |

## Next action

- immediate_next_action: Open draft PR from this branch, then create PR-scoped `.agent-admin/prs/pr-<N>/wave-current-tasks.md`, then invoke independent-assurance-agent for canonical PRE-BRIEF bound to PR #<N> and issue #2025.
- action_owner: foreman-v2-agent
- may_start_now: true
- conditions_before_start: none
- prohibited_next_actions: delegating to any builder before IAA PRE-BRIEF is canonical and committed; implementing any product code directly.

## Session close

- outcome: PASS_TO_NEXT_STATE
- session_memory_complete: true (will be updated at each subsequent state transition)
- prehandover_memory_path: not_applicable yet
- suggestions_for_improvement: none new this cycle
- closed_at_utc: pending (session continues)
