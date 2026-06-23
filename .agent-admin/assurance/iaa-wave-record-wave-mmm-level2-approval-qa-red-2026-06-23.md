# IAA Wave Record - MMM Level 2 Approval QA-to-Red

Wave: `wave-mmm-level2-approval-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-level2-approval-qa-red`
Scope record: `.agent-admin/scope-declarations/wave-mmm-level2-approval-qa-red-2026-06-23.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify QA-to-red covers Level 2 invite modal behavior before implementation.
- Verify QA-to-red covers multi-approver add/remove/validation behavior.
- Verify QA-to-red covers API contract integration with `mmm-approval-round-create` without implementing the API.
- Verify QA-to-red covers Level 2 approval workspace rendering and action boundaries.
- Verify QA-to-red confirms proposed changes cannot silently overwrite canonical domain/MPS/criteria/descriptor content.

EXPECTED_FAILURE_MODES:
- Building UI before QA-to-red exists.
- Treating a single approver invite as sufficient when multiple approvers are required.
- Failing to validate duplicate approver e-mails.
- Allowing approver edits to mutate canonical content directly.
- Failing to preserve scoped approver access boundaries.
- Writing runtime code, migrations, API implementation, or e-mail delivery in this QA-to-red wave.

FOREMAN_INSTRUCTIONS:
- Keep this wave to scope, IAA pre-brief, builder appointment, and QA-to-red artifacts.
- Do not implement Level 2 UI or backend behavior in this wave.
- QA-to-red must be specific enough for the next builder to implement tests and then code.
- Preserve the CS2 sequence: Step 3 starts with Level 2 invite modal and approval workspace, after merged Step 2 DB/API contract.

IAA_WILL_QA:
- IAA will check that QA-to-red is derived from the merged DB/API and approval pre-build contracts.
- IAA will check that this wave stays pre-code.
- IAA will check that builder appointment exists before any implementation commit.
- IAA will check that Level 2 workspace scope does not leak into Level 3 or evidence-management work.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-level2-approval-qa-red-2026-06-23"
  pr: "pending"
  branch: "foreman/mmm-level2-approval-qa-red"
  qualifying_tasks:
    - "Create QA-to-red for Level 2 invite modal."
    - "Create QA-to-red for Level 2 approval workspace."
    - "Record builder appointment for later implementation wave."
  required_build_gates:
    - "No runtime code changes."
    - "No database migrations."
    - "No API implementation."
    - "No e-mail delivery implementation."
    - "No UI implementation."
  expected_qa_scope:
    - "Level 2 multi-approver invitation behavior."
    - "Approval workspace rendering and scoped action behavior."
    - "Proposed-change non-overwrite guarantee."
    - "API contract integration expectations."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
