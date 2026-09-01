# PR-Scoped Builder Appointment Carry-Forward Acknowledgment — PR #2031 (Issue #2030 / #2025)

```yaml
carry_forward_appointment:
  pr_number: 2031
  wave_id: "issue-2025-fix-organisation-context-mixed-document"
  reaffirmed_timestamp: "2026-08-18T17:05:00Z"
  reaffirming_agent: "foreman-v2-agent"
  original_builder_appointments_carried_forward:
    - agent: "qa-builder"
      original_pr: 2026
      appointment_ref: ".agent-admin/builder-appointments/issue-2025-qa-to-red-pr2026-20260818.md"
      original_first_implementation_commit_sha: "1a2fdbd87c57e84f4df38d5e57b9dc165b4c7dc5"
      reconciliation_appointment_ref: ".agent-admin/builder-appointments/issue-2025-qa-red-reconciliation-pr2026-20260818.md"
      reconciliation_implementation_commit_sha: "c1409922dd579c74208f3bc164165da293867ff7"
    - agent: "ui-builder"
      original_pr: 2026
      appointment_ref: ".agent-admin/builder-appointments/issue-2025-ui-builder-pr2026-20260818.md"
      original_implementation_commit_sha: "70d102ef1833dda3a09755a8fb5c6f058d3dbcc9"
      reconciliation_appointment_ref: ".agent-admin/builder-appointments/issue-2025-ui-reconciliation-pr2026-20260818.md"
      reconciliation_implementation_commit_sha: "f4234d5b1f6bdfa5dd69a550ebd8d0fc6540b057"
    - agent: "api-builder"
      original_pr: 2026
      appointment_ref: ".agent-admin/builder-appointments/issue-2025-api-builder-pr2026-20260818.md"
      implementation_commit_sha: "b07ebf38ca5becec449ee1baf00b5f125551b71a"
  reason: >
    All three builder appointments above were made, QP-reviewed, and PASS-verified on the
    original PR #2026 delivery branch. That PR was merged out-of-band on unrelated ungoverned
    content before this governed lineage reached main (see
    .agent-admin/prs/pr-2026/wave-current-tasks.md, BLK-2025-01/BLK-2025-02). This acknowledgment
    reaffirms those completed appointments as the delegation basis for PR #2031, and is committed
    to PR #2031's own branch ancestry, strictly after the pre-brief carry-forward commit and
    strictly before the implementation commit that ports the governed file set onto this branch
    — satisfying preflight/delegation-order-gate's PR-scoped, non-same-commit ordering
    requirement.
  builder_task_ref_for_this_pr: ".agent-admin/builder-appointments/issue-2025-qa-red-reconciliation-pr2026-20260818.md"
```
