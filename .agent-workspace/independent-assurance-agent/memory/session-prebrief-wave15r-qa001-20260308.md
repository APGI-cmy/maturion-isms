# IAA Session Memory — session-prebrief-wave15r-qa001-20260308

## Session Identity
- session_id: session-prebrief-wave15r-qa001-20260308
- date: 2026-03-08
- agent_version: 6.2.0
- contract_version: 2.2.0
- invocation_mode: PRE-BRIEF (Phase 0 only — no assurance verdict issued)

## Invocation Context
- pr_reviewed: N/A — Phase 0 PRE-BRIEF invocation only. No PR assurance this session.
- invoking_agent: foreman-v2-agent (IAA PRE-BRIEF REQUEST comment on branch copilot/create-red-tests-wave-15r)
- producing_agent: foreman-v2-agent (wave work not yet produced — pre-brief precedes production)
- producing_agent_class: foreman
- issue: maturion-isms#1000

## Classification
- pr_category: AAWP_MAT (GOVERNANCE_CEREMONY) — governance closure for MAT QA deliverable T-W15R-QA-001
- ambiguity_rule_applied: NO — category clear; IAA explicitly named as required task (IAA-AUDIT-001) in wave-current-tasks.md
- foreman_builder_mandate_applied: YES — foreman class wave, IAA mandatory per AGCFPP-001 and maturion-isms#523/#528/#531

## Checks Executed
- checks_executed: 0 — Phase 0 only; Phases 2–4 checks will execute at IAA-AUDIT-001
- fail_only_once_checks: 0
- core_invariants_checks: 0
- category_overlay_checks: 0

## Merge Gate Parity
- merge_gate_parity_result: N/A — Pre-Brief session; no parity check run

## Verdict
- verdict: PRE-BRIEF ISSUED — not an assurance verdict
- token_reference: N/A — no token issued this session
- token_file_path: N/A
- adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

## Prior Sessions Reviewed
- session-prebrief-wave15r-20260308
- session-prebrief-wave15r-closure-20260308
- session-prebrief-wave15r-impl-20260308
- session-rca-breach-20260308-R1
- session-rca-breach-20260308-R2
- Prior IAA tokens reviewed: iaa-token-session-wave15r-gov-20260308-R3-PASS, iaa-token-session-wave15r-impl-20260308-R2-PASS (both resolved)

## FAIL-ONLY-ONCE Rules Applied
- A-001 invocation evidence check: N/A — Pre-Brief; no PREHANDOVER proof exists yet; will check at IAA-AUDIT-001
- A-002 no-class-exceptions check: CONFIRMED — foreman class does not exempt from IAA
- A-003 ambiguity rule: NOT TRIGGERED — category clear (IAA named in task list)
- A-021 commit-before-invocation: NOTED — flagged as hard blocker in pre-brief (Section 5, Blocker 3)
- A-026 SCOPE_DECLARATION match: NOTED — flagged as hard blocker in pre-brief (Section 5, Blocker 4)
- A-029 token pre-population: DECLARED — PREHANDOVER proof template specifies required pre-populated format
- A-031 IAA ceremony artifact carve-out: NOTED — pre-brief artifact itself may appear in diff; A-031 note may be needed in SCOPE_DECLARATION.md

## Pre-Brief Artifact
- path: .agent-admin/assurance/iaa-prebrief-wave15r-qa001.md
- wave: Wave 15R Batch C — T-W15R-QA-001
- qualifying_tasks: 2 (QP-EVAL-001, PREHANDOVER-001)
- trigger_categories_declared: AAWP_MAT (GOVERNANCE_CEREMONY)
- ffa_checks_declared: 22 CORE + 4 CERT + 6 GOV-specific
- prehandover_structure_declared: YES — Section 4 fully specified
- scope_blockers_identified: 4 (S-025/A-033 advisory; QA-to-Red documentation requirement; A-021 commit gate; A-026 scope match)

## Learning Notes
1. **Governance closure waves are AAWP_MAT category**: Even when no `modules/mat/` or `packages/ai-centre/` files appear in the diff, a wave that exists solely to close the governance loop on a MAT deliverable qualifies as AAWP_MAT (governance ceremony). IAA IS required. The PREHANDOVER proof documenting a QP evaluation of a MAT deliverable is an AAWP_MAT governance artifact.

2. **INC-OPOJD-W15R-QA-001 recovery pattern**: The corrective action for a missing GitHub issue on a builder delegation is: (a) create the issue retroactively, (b) produce a full governance closure wave with PREHANDOVER proof + QP evaluation, (c) IAA verifies the closure is complete. The QA-to-Red bypass is acknowledged and documented — the closure is valid because the incident is formally recorded.

3. **A-031 applies to IAA pre-brief artifacts**: The pre-brief artifact itself (committed by IAA) will appear in `git diff --name-only origin/main...HEAD`. The Foreman must use the A-031 carve-out note for IAA-owned files or declare them explicitly. This is a recurring pattern in governance-only waves where IAA commits ceremony artifacts to the branch.

4. **S-025 / A-033 promotion is a carry-forward mandate**: The FAIL-ONLY-ONCE suggestion S-025 (DELEGATION-ISSUE-REQUIRED) has been open since v3.1.0. IAA will issue a Carry-Forward Mandate at IAA-AUDIT-001 if A-033 has not been formally promoted by that point.

## Suggestions for Improvement
1. **Pre-Brief artifact path pattern for Batch waves**: The current pattern `.agent-admin/assurance/iaa-prebrief-wave<N>.md` doesn't account for batch identifiers. This wave uses `iaa-prebrief-wave15r-qa001.md` which is clear and correct, but the canonical capability YAML says `pre_brief_artifact_path_pattern: ".agent-admin/assurance/iaa-prebrief-wave<N>.md"`. The pattern should be updated to `.agent-admin/assurance/iaa-prebrief-wave<N>[-<batch>].md` to reflect batch/recovery wave naming. Recommend flagging to CodexAdvisor for YAML update at next governance ripple.

## Parking Station Reference
- Logged to: .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md

## fail_only_once_updates
- None this session. All active rules (A-001 through A-031) remain current. No new recurring patterns detected that require immediate A-rule addition.
