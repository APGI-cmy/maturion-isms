# ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT

PR: #2065  
Issue: #2064  
Failure trigger: CS2 `CONTINUOUS_IMPROVEMENT_REQUIRED` directive, following the repeated PR #2058 pattern in which an IAA `REJECTION-PACKAGE` was reported to CS2 rather than supervised through correction, QP, and independent re-assurance.  
RCA classification: mandatory
Failure class: Role-boundary violation and admin-loop continuation failure; the final-token packaging conflict is also a canon conflict.  
Root cause: The Foreman state model did not make two distinctions executable together: (1) an IAA rejection ends IAA's audit, not Foreman's OPOJD delivery duty; (2) a pre-token immutable carrier is historical evidence, not an artifact to normalize after a final token. Tier 1 recognizes a PASS in the wave record, while `AGENT_HANDOVER_AUTOMATION.md` and `INDEPENDENT_ASSURANCE_AGENT_CANON.md` still describe a dedicated token file and post-token normalization without an authoritative-location precedence or immutable-carrier exception. The checkpoint can discover a wave-record token, but lacks a focused regression for that supported final-state combination.  
Was this already covered by existing guidance: yes — Foreman Tier 1 §4 State machine routes rejection to `STOP_AND_FIX / CORRECTION`, and the checkpoint already discovers `## TOKEN` wave records. Recurrence remained possible because canon packaging wording and the untested checkpoint path leave a reasonable but incorrect inference that a dedicated token/proof-refresh commit is required.
Lowest effective fix layer: L4 canon clarification for the conflicting authoritative-token requirement, implemented with the minimum L3 checkpoint regression. No new proof, token, or head-refresh artifact family is needed.  
Corrective action required:
1. The authorized governance specialist must add one Foreman registry rule and one breach-log entry in `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`, linked to PR #2058 and PR #2065: `IAA REJECTION → Foreman STOP_AND_FIX / delegated correction → QP → independent IAA`; rejection never authorizes final handover or successor release.
2. Reconcile Tier 1, Tier 2, `AGENT_HANDOVER_AUTOMATION.md`, and `INDEPENDENT_ASSURANCE_AGENT_CANON.md`: for a final current-head PASS, the active wave record is an authoritative token location when it contains the bound PASS token; a separate token file is not additionally required. Immutable pre-token carriers remain historical and must not be edited or replaced solely for post-token normalization. Retain one-time PR #2058 disposition only as the historical application of this permanent rule.
3. The checkpoint owner must add one focused regression covering a current PASS token in the wave record plus an immutable pre-token carrier, proving that the checkpoint permits non-mutating final current-head verification without manufacturing a completion claim or requiring an evidence-only artifact commit.
4. Foreman must delegate the correction, perform QP after it, then obtain independent IAA `RCA_REVIEW` and final assurance as applicable. The non-mutating current-head verification occurs after the last substantive push.

Regression needed: yes  
Tier 2 update needed: yes  
Template update needed: no  
Gate update needed: yes — regression coverage of the existing checkpoint's supported wave-record path; alter logic only if that regression reveals a defect.  
Canon issue needed: yes  
Agent contract review needed: yes  
Product backlog item needed: no  
Owner for correction: Foreman (`foreman-v2-agent`) to supervise; `governance-liaison-isms-agent` for canon/Tier 2/registry alignment; `qa-builder` for the checkpoint regression; `independent-assurance-agent` for RCA review and final independent assurance.  
IAA review required: yes  
CS2 final overview required: yes  
RCA verdict: CANON_CHANGE_REQUIRED

## Containment

PR #2058 remains governed by its one-time disposition: no proof/token/session/scope refresh commit is to be created solely to cure the historical packaging conflict. PR #2065 must not claim checks, assurance, handover, or merge readiness before they occur.

## Permanent prevention

The canon clarification and focused checkpoint regression above establish the single final-state invariant: a current, PR-bound PASS in the active wave record supports non-mutating verification; it neither changes a pre-token carrier into a completion claim nor compels a new artifact commit. The Foreman registry rule establishes the separate rejection invariant and preserves Foreman's delivery ownership after IAA ends a rejected audit.

## Risk scan

1. Checked: a stale or cross-PR wave record must not authorize final state. Existing identity/current-head validation remains required; the regression must use a current PR-bound record only.
2. Checked: a pre-IAA submission state must not be read as final handover. The existing `pre_iaa_submission_allowed` / `final_cs2_handover_allowed` split remains required and is not weakened.
3. Checked: a PASS token must not bypass independent assurance. The rule recognizes only an independently issued, current PASS; it does not allow Foreman self-certification.

## Implementation / Foreman instruction

Do not create further RCA, proof-refresh, or head-refresh artifacts. Foreman must appoint the named specialist owners, require the precise registry entry, canon/Tier 2 reconciliation, and checkpoint regression above, QP the resulting submission, and invoke IAA for mandatory RCA review. A `REFER_BACK` remains blocking; a PASS does not itself constitute CS2 merge approval.

## QP review — RCA self-check

| Criterion | Result |
| --- | --- |
| Trigger correctness | PASS — explicit CS2 continuous-improvement directive and recurrent failure class |
| Input sufficiency | PASS — PR #2058 incident/disposition, current canon, Tier 2, and checkpoint behavior inspected |
| Output-shape completeness | PASS |
| Lowest-effective-layer rationale | PASS — canon conflict requires canon clarification; test covers existing checkpoint behavior without artifact bloat |
| Role-boundary integrity | PASS — this assessment routes implementation only |
| Anti-burden compliance | PASS — one assessment, one registry update, one focused regression; no proof/head-refresh artifacts |
