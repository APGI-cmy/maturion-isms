# RCA Trigger Checklist

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
