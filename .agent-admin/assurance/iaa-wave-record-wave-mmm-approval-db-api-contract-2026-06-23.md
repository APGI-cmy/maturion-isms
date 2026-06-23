# IAA Wave Record - MMM Approval DB/API Contract

Wave: `wave-mmm-approval-db-api-contract-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-approval-db-api-contract`
Scope record: `.agent-admin/scope-declarations/wave-mmm-approval-db-api-contract-2026-06-23.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify the DB/API contract derives from the merged approval workflow pre-build contract.
- Verify the contract covers approval rounds, approvers, invitations, proposed edits, comments, notifications, locks, and AI learning events.
- Verify the contract includes API request/response shape and failure modes for later implementation.
- Verify no runtime code, migrations, edge functions, or UI implementation are introduced in this wave.
- Verify QA-to-red scenarios are defined for the next implementation wave.

EXPECTED_FAILURE_MODES:
- Contract omits multi-approver tracking.
- Contract allows proposed edits to overwrite canonical model fields directly.
- Contract lacks lock transition rules.
- Contract omits notification outbox/event idempotency.
- Contract does not support level 3 approver flow or level 2 copied correspondence.
- Contract does not provide enough API shape for a builder to implement safely later.

FOREMAN_INSTRUCTIONS:
- Keep this wave contract-only.
- Do not create migrations, functions, UI components, or e-mail delivery code.
- Ensure future implementation waves can write QA-to-red tests from this contract.
- Keep each contract file bounded and traceable to the merged approval workflow pre-build artifacts.

IAA_WILL_QA:
- IAA will check DB/API completeness and state transition consistency.
- IAA will check lock and notification failure modes.
- IAA will check proposed-change immutability and audit/AI learning capture.
- IAA will check that this PR remains pre-build specification work only.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-approval-db-api-contract-2026-06-23"
  pr: "pending"
  branch: "foreman/mmm-approval-db-api-contract"
  qualifying_tasks:
    - "Create MMM approval workflow DB/API contract."
    - "Create MMM approval workflow notification and lock contract."
    - "Create MMM approval workflow QA-to-red contract."
  required_build_gates:
    - "No runtime code changes."
    - "No database migrations."
    - "No API implementation."
    - "No e-mail delivery implementation."
    - "No UI implementation."
  expected_qa_scope:
    - "Verify contract coverage for approval rounds, approvers, proposed edits, comments, notifications, locks, and AI learning events."
    - "Verify API payloads and failure modes are specified."
    - "Verify QA-to-red scenarios are ready for later build wave."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
