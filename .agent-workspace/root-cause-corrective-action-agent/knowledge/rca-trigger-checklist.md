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

## Optional

- CS2 requests learning capture without blocker intent
- Repeat-risk emerging but not yet severe
- Guidance discoverability ambiguity created avoidable friction

## Prohibited

- Clean PR with no meaningful failure signal
- Typo/wording-only cleanup
- Normal first-pass comment covered by current guidance
- Straightforward gate failure with existing-standard fix
