# IAA Wave Record - MMM Change Summary QA-to-Red

Wave: `wave-mmm-change-summary-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-change-summary-qa-red`
Scope record: `.agent-admin/scope-declarations/wave-mmm-change-summary-qa-red-2026-06-23.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify QA-to-red covers change-summary generation before implementation.
- Verify QA-to-red covers level 1 e-mail summary payload requirements.
- Verify QA-to-red covers accept, reject, edit/apply, request clarification, and reply-comment flows.
- Verify QA-to-red confirms canonical model content is not changed until level 1 applies a proposed change.
- Verify QA-to-red covers notification, audit, and AI learning event expectations.

EXPECTED_FAILURE_MODES:
- Building e-mail or UI behavior before QA-to-red exists.
- Sending summaries without precise domain/MPS/criteria/descriptor references.
- Applying approver changes automatically without level 1 action.
- Rejecting without reason.
- Editing without preserving original, proposed, and final values.
- Resubmitting without notifying active Level 2 approvers.
- Omitting audit and AI learning events.

FOREMAN_INSTRUCTIONS:
- Keep this wave to scope, IAA pre-brief, builder record, and QA-to-red artifacts.
- Do not implement e-mail delivery, templates, UI, database migrations, API routes, or runtime behavior in this wave.
- QA-to-red must be specific enough for the next implementation wave to convert into executable tests before code.

IAA_WILL_QA:
- IAA will check that the QA-to-red artifact derives from the merged approval workflow and DB/API contracts.
- IAA will check that this wave stays pre-code.
- IAA will check that builder record exists before implementation work begins.
- IAA will check that Step 4 does not leak into Level 3, published model view, or evidence management scope.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-change-summary-qa-red-2026-06-23"
  pr: "pending"
  branch: "foreman/mmm-change-summary-qa-red"
  qualifying_tasks:
    - "Create QA-to-red for change summary e-mail payloads."
    - "Create QA-to-red for level 1 accept/reject/edit/apply response flow."
    - "Create QA-to-red for notification, audit, and AI learning event expectations."
  required_build_gates:
    - "No runtime code changes."
    - "No database migrations."
    - "No API implementation."
    - "No e-mail delivery implementation."
    - "No UI implementation."
  expected_qa_scope:
    - "Change summary generation and exact display references."
    - "Level 1 response flow for proposed changes."
    - "Notification, audit, and AI learning event expectations."
    - "Canonical non-overwrite guarantee until level 1 applies a change."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
