# Foreman v2 Session Memory — foreman-bootstrap-repair-1969 — 2026-07-26

## Identity and authority

- agent_id: foreman-v2-agent
- agent_class: foreman
- contract_version: 2.17.0
- session_id: foreman-bootstrap-repair-1969
- date_utc: 2026-07-26
- repository: APGI-cmy/maturion-isms
- branch: agent/foreman-bootstrap-fail-closed-1969
- base_sha: 36c7f42a1a9d23fe4fd9d9f7f12a7ef7beada919
- current_head_sha: 781a7b62a07aea8a7b8a749ad806c6b41c5c2e0b
- cs2_authorization: User instruction on 2026-07-26 — open the bounded governance-repair wave, restore the missing template, correct bootstrap validation, obtain independent IAA, then resume #1959
- module_or_scope: Foreman bootstrap governance repair only; Issue #1969 / PR #1970
- operating_mode: POLC_ORCHESTRATION

## Bootstrap preamble

- tier1_contract_loaded: true
- tier2_index_loaded: true
- tier2_required_files_verified: true
- canon_inventory_status: VALID
- fail_only_once_attested: true
- fail_only_once_version: 4.5.0
- unresolved_breaches: IAA R1 findings F-001 through F-004 entered STOP-AND-FIX; producer corrections and ECAP R2 are complete; independent R2 remains pending
- prior_sessions_reviewed:
  - `.agent-workspace/foreman-v2/memory/session-wave5-polc-RCA-20260224.md`
  - `.agent-workspace/foreman-v2/memory/session-wave4-cs2-compliance-RCA-20260224.md`
  - `.agent-workspace/foreman-v2/memory/session-wave4-RCA-20260224.md`
  - `.agent-workspace/foreman-v2/memory/session-wave3-incomplete-delivery-RCA-20260224.md`
  - `.agent-workspace/foreman-v2/memory/session-wave20-atomic-write-back-20260318.md`
- unresolved_items_from_prior_sessions: none material to Issue #1969
- pending_escalations_reviewed: none
- bootstrap_result: PASS

## Task and bounded scope

- task_summary: Restore the missing Foreman session-memory template and make active-contract Tier 2 required-file validation fail closed.
- issue_or_wave: Issue #1969 / PR #1970 / `foreman-bootstrap-repair-1969`
- in_scope_files: the 14 paths declared in `.agent-admin/scope-declarations/pr-1970.md` and `.admin/prs/pr-1970.json`
- out_of_scope: protected agent contracts; product/runtime; MMM; Supabase; Vercel; infrastructure; Issue #1959 implementation; direct main push; IAA self-certification; merge
- acceptance_criteria:
  - the missing template exists at the Tier 1-declared path and is registered in the Tier 2 index
  - every active-contract Tier 2 required file is checked before memory scan or working-contract generation
  - missing controls fail nonzero, name every missing path and emit no readiness language
  - complete, populated-memory and absent-manifest paths retain correct behavior
  - independent IAA must PASS before CS2 merge review
- stop_conditions: missing canonical carrier; regression failure; false readiness; scope escape; stale QP/ECAP/CI; IAA rejection; merge without CS2

## Pre-build and lifecycle state

| Artifact or stage | Path/reference | State | Evidence or blocker |
|---|---|---|---|
| Scope authority | `.agent-admin/scope-declarations/issue-1969.md`, `.agent-admin/scope-declarations/pr-1970.md` | COMPLETE | 14 authorized paths |
| QA-to-Red | `.github/scripts/wake-up-protocol.test.sh` | COMPLETE | 4 scenarios, including 400 populated memories and 12 repeated runs |
| PBFAG | Issue #1969 acceptance and bounded appointment | COMPLETE | No separate product PBFAG applies |
| Implementation Plan | `.agent-admin/prs/pr-1970/wave-current-tasks.md` | COMPLETE | Corrected after IAA R1 |
| Builder Checklist | `.agent-admin/builder-appointments/issue-1969-codexadvisor-governance-repair.md` | COMPLETE | Bounded governance repair appointment |
| IAA pre-brief | `.agent-admin/assurance/iaa-wave-record-foreman-bootstrap-repair-1969-20260726.md` | COMPLETE | Commit `e1a9b9a95a9ef712a7d3e6f92e1aeb1327dad167` |
| Builder appointment | `.agent-admin/builder-appointments/issue-1969-codexadvisor-governance-repair.md` | COMPLETE | Commit `f6b081c8014f235543815de185958ba8f2a01ab2` |
| Build / execution | initial `7cac621b…`; R1 correction `ef8c628c…` | COMPLETE | QP R2 PASS |

## Roles invoked and delegation

| Sequence | Role or agent | Task reference | Appointment/evidence path | Commit SHA | Result |
|---|---|---|---|---|---|
| 1 | independent-assurance-agent pre-brief | GOV-1969-01–05 | canonical wave record | `e1a9b9a95a9ef712a7d3e6f92e1aeb1327dad167` | PREFLIGHT_BRIEF_COMPLETE |
| 2 | CodexAdvisor-agent | GOV-1969-01–03 | bounded appointment | `f6b081c8014f235543815de185958ba8f2a01ab2` | APPOINTED |
| 3 | CodexAdvisor-agent | implementation and R1 correction | repair files | `7cac621b9e04d83ed3149f1923051b0a4bddb0cf`, `ef8c628ca3bca433fbe084055c5dded1f13036f8` | COMPLETE |
| 4 | Foreman Quality Professor | QP R1 and R2 | `.agent-admin/quality/pr-1970-foreman-qp.md` | `ed15a811b6e617bcb2c8b30a0ec37ac4053c128d`, `610d4a4a5f4a24ec96a1cf9413c0080a635b4b95` | PASS |
| 5 | execution-ceremony-admin-agent | ECAP R1 and R2 | `.agent-admin/ecap/pr-1970-ecap.md` | `fb9f3c9e62e5390864558e519f6f58c30a8e9d64`, `781a7b62a07aea8a7b8a749ad806c6b41c5c2e0b` | ADMIN_VALIDATED |
| 6 | independent-assurance-agent final | IAA R1 / R2 | canonical wave record | `c7e283827bf0610be8e963d4bfb57fa5ae1e2d2b` / pending | R1 REJECTED; R2 PENDING |

- delegation_order_verified: true
- first_implementation_commit_sha: 7cac621b9e04d83ed3149f1923051b0a4bddb0cf
- foreman_implemented_prohibited_work: false

## Work and evidence produced

| File or external target | Operation | Owner role | Evidence/result |
|---|---|---|---|
| Foreman session-memory template | restored | CodexAdvisor-agent | present and referenced by Tier 1 and Tier 2 |
| wake-up protocol | fail-closed validation and pipefail-safe memory listing | CodexAdvisor-agent | complete; real Foreman 20/20 and IAA 12/12 |
| focused regression | added and strengthened | CodexAdvisor-agent | 4 passed, 0 failed |
| Wave 7 governance validation | wired G13 | CodexAdvisor-agent | 10/10 policy and 13/13 real gates |
| PR-scoped governance carriers | created/reconciled | Foreman / ECAP / IAA by role | QP R2 PASS; ECAP R2 ADMIN_VALIDATED; IAA R2 pending |

## Quality Professor review

- qp_applicable: true
- qp_evidence_path: `.agent-admin/quality/pr-1970-foreman-qp.md`
- tests_executed: bash syntax; focused bootstrap regression; Wave 7 governance validation; repeated real Foreman and IAA bootstrap
- tests_passed: focused 4/4; policy 10/10; real gates 13/13; Foreman 20/20; IAA 12/12
- tests_failed: 0 after R1 correction
- tests_skipped_todo_incomplete: 0
- warnings: none attributable to the corrected delta
- full_diff_reviewed: true
- architecture_and_scope_conformant: true
- qp_verdict: PASS
- qp_blocking_findings: none; final assurance remains separate

## ECAP administrative validation

- ecap_required: true
- ecap_evidence_path: `.agent-admin/ecap/pr-1970-ecap.md`
- admin_fields_current: true
- scope_current: true
- exact_head_binding: 610d4a4a5f4a24ec96a1cf9413c0080a635b4b95
- ecap_result: ADMIN_VALIDATED
- ecap_findings: none; 14/14 authorized scope paths, with this session memory the final declared path

## Independent assurance

- prebrief_wave_record: `.agent-admin/assurance/iaa-wave-record-foreman-bootstrap-repair-1969-20260726.md`
- prebrief_result: PREFLIGHT_BRIEF_COMPLETE
- final_iaa_invoked: true
- final_iaa_evidence_path: `.agent-admin/assurance/iaa-wave-record-foreman-bootstrap-repair-1969-20260726.md`
- final_iaa_token: none
- final_iaa_verdict: PENDING
- final_iaa_findings: R1 F-001 through F-004 corrected; independent R2 must verify closure

## CI and merge-gate evidence

- pr_number: 1970
- frozen_head_sha: 781a7b62a07aea8a7b8a749ad806c6b41c5c2e0b
- required_checks_source: `.agent-admin/control/merge-gate-required-checks.json`
- required_checks_green: true at evidence head
- workflow_runs_inspected: `30203411460`, `30203411466`, `30203411481`, `30203411482`, `30203411483`, `30203411485`, `30203411488`, `30203411494`, `30203411496`, `30203411536`; all success
- unresolved_review_threads: 0
- mergeable_state: mergeable / draft
- prehandover_gate: PASS at evidence head; immutable PREHANDOVER carrier still to be committed
- handover_allowed: false
- merge_authority: CS2_ONLY

## Tracker and continuity

- tracker_path: `.agent-admin/prs/pr-1970/wave-current-tasks.md`
- tracker_updated: true
- tracker_current_state: QP R2 PASS; ECAP R2 COMPLETE; PREHANDOVER and independent IAA R2 pending
- successor_issue_or_wave: #1959
- successor_entry_conditions: PR #1970 merged/closed by CS2; post-merge bootstrap verification; preserve the `app_private` helper model

## Blockers and escalations

| ID | Blocker | Responsible owner | Required remediation | State |
|---|---|---|---|---|
| IAA-R2 | Final independent assurance has not passed | independent-assurance-agent | Review immutable PREHANDOVER head and append verdict | OPEN |
| CS2-MERGE | Governance repair is not merged | CS2 | Review and merge only after IAA PASS and exact-head gates | OPEN |
| MMM-1959 | RLS remediation cannot start under the repaired contract until repair closure | Foreman / CS2 | Close #1969, verify main, then resume #1959 | BLOCKED |

## Decisions and rationale

| Decision | Evidence/rationale | Authority |
|---|---|---|
| Preserve fail-closed Tier 2 validation | Missing required Tier 2 control previously passed silently | CS2 authorization / Issue #1969 |
| Reject early-closing `sort | head` under pipefail | IAA R1 reproduced 9 failures across Foreman and IAA histories | IAA R1 / STOP-AND-FIX |
| Preserve independent verdict append | IAA cannot be self-certified by producer, Foreman, builder or ECAP | Foreman Tier 1 / PR scope |
| Keep #1959 out of this PR | Bounded governance repair must not mix MMM or Supabase implementation | CS2 authorization |

## Next action

- immediate_next_action: Commit the immutable PREHANDOVER proof, wait for exact-head hosted checks, then invoke independent IAA R2.
- action_owner: foreman-v2-agent, followed by independent-assurance-agent
- may_start_now: true
- conditions_before_start: this session memory is committed; PREHANDOVER evidence binds to its exact commit
- prohibited_next_actions: self-certify IAA; merge; modify main; start #1959; change product/MMM/Supabase/Vercel; weaken tests or governance

## Session close

- outcome: PASS_TO_NEXT_STATE
- session_memory_complete: true
- prehandover_memory_path: `.agent-workspace/foreman-v2/memory/session-foreman-bootstrap-repair-1969-20260726.md`
- suggestions_for_improvement: retain the populated-memory repeated-run fixture because single empty-memory bootstraps cannot expose early-closing pipeline failures under `pipefail`
- closed_at_utc: 2026-07-26T13:10:00Z
