# RCA Trigger Checklist

**Version**: 1.1.0
**Last Updated**: 2026-05-12

## Mandatory

- REQUEST_CHANGES from CS2/appointed advisor for substantive failure
- Required CI gate fails after handover/merge-ready/ready-for-review/complete claim
- Handover claim gate reports HANDOVER BLOCKED
- Same failure class recurs in one PR after attempted correction
- Same failure class recurs across two PRs in same workflow/project
- IAA verdict is FAIL / ADMIN_ONLY / PARTIAL_FUNCTIONAL_DELIVERY when full delivery expected
- ECAP detects stale evidence after final push/handover claim
- Gate is stale/paradoxical/over-broad/under-enforcing
- CS2 explicitly posts RCA_REQUIRED / ROOT_CAUSE_REQUIRED / CONTINUOUS_IMPROVEMENT_REQUIRED
- Workflow marker `<!-- rca-required-marker -->` is present with `RCA_REQUIRED: yes`
- CS2 submits a comment that identifies a failure, rejection, hold, admin defect, job defect,
  handover defect, evidence defect, or gate defect, or any comment includes `MERGE_READY: no`
  — the NEXT agent session MUST invoke RCA before implementing any fix.

## Optional

- CS2 requests learning capture without blocker intent
- Repeat-risk emerging but not yet severe
- Guidance discoverability ambiguity created avoidable friction

## Prohibited

- Clean PR with no meaningful failure signal
- Typo/wording-only cleanup
- Normal first-pass comment covered by current guidance
- Straightforward gate failure with existing-standard fix
- First-pass draft-only misses where no repeat/substantive trigger exists

## Stateful Enforcement

- RCA trigger detector workflow posts/updates one authoritative marker comment:
  `<!-- rca-required-marker -->` with `RCA_REQUIRED: yes`.
- While marker is active, handover/merge-ready/complete claims stay blocked (`HANDOVER_ALLOWED: no`).
- Required evidence path:
  `.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-<PR_NUMBER>.md`
- `preflight/rca-invocation-evidence` fails when marker is active and RCA evidence is missing/incomplete.
- **NO implementation or fix work proceeds** while the RCA marker is active and the RCA evidence
  artifact is absent or incomplete. Agents that begin fix work before committing the RCA evidence
  are in breach of this protocol and the breach must be recorded in FAIL-ONLY-ONCE.
