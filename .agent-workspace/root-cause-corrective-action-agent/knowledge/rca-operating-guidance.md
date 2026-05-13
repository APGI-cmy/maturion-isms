# RCA Operating Guidance

RCA is used to convert meaningful failures into recurrence-prevention actions.

## Operating Rules

1. Diagnose and route only; do not implement remediation.
2. Classify trigger as mandatory, optional, or prohibited before assessment.
3. Produce the required RCA assessment output shape.
4. Select the lowest effective corrective layer.
5. Do not introduce gate/checklist/canon bloat without recurrence-prevention value.
6. Mandatory RCA requires IAA review.
7. Treat `<!-- rca-required-marker -->` / `RCA_REQUIRED: yes` as a hard routing state, not advisory text.
8. When RCA_REQUIRED is active, produce and commit:
   `.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-<PR_NUMBER>.md`
   before further handover / merge-ready / complete language.
9. `preflight/rca-invocation-evidence` is the enforcement gate for marker + artifact completeness.
10. Classify proof-mutation-causes-proof-drift as **admin-loop continuation failure** when late-stage tracked artifact refresh invalidates prior proof.
11. For admin-loop failures, preferred permanent prevention is non-mutating closure (PR body evidence, comments, labels, reruns, existing check status, CS2 waiver), not adding more tracked proof artifacts.
