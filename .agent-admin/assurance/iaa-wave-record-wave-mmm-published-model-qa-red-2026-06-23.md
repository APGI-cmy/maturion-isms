# IAA Wave Record - MMM Published Model QA-to-Red

Wave: `wave-mmm-published-model-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-published-model-qa-red`
Scope record: `.agent-admin/scope-declarations/wave-mmm-published-model-qa-red-2026-06-23.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify QA-to-red covers published model visibility only after final approval/final lock.
- Verify QA-to-red covers collapsible MPS-first view and drilldown layers.
- Verify QA-to-red covers criterion cards, current/next maturity tabs, and descriptor modal expectations.
- Verify QA-to-red covers evidence management and AI question placeholders without implementing runtime evidence/AI behavior.
- Verify QA-to-red covers read-only behavior, traceability, authorization boundaries, and error states.

EXPECTED_FAILURE_MODES:
- Publishing a model before final approval/final lock.
- Allowing published view to mutate final-approved content.
- Losing traceability between domain, MPS, intent, criterion, and descriptor layers.
- Implementing evidence modal or AI runtime behavior in this QA-to-red wave.
- Omitting authorization boundaries for published model access.
- Implementing runtime UI/API behavior in this QA-to-red wave.

FOREMAN_INSTRUCTIONS:
- Keep this wave to scope, IAA pre-brief, builder record, and QA-to-red artifacts.
- Do not implement published model UI, API routes, database migrations, evidence modal, AI question runtime, or approval workflow runtime behavior in this wave.
- QA-to-red must be specific enough for the next implementation wave to convert into executable tests before code.

IAA_WILL_QA:
- IAA will check that the QA-to-red artifact derives from merged approval workflow and published view contracts.
- IAA will check that this wave stays pre-code.
- IAA will check that builder record exists before implementation work begins.
- IAA will check that Step 6 does not leak into evidence modal harvest/adaptation implementation.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-published-model-qa-red-2026-06-23"
  pr: "pending"
  branch: "foreman/mmm-published-model-qa-red"
  qualifying_tasks:
    - "Create QA-to-red for published model visibility and read-only behavior."
    - "Create QA-to-red for collapsible MPS-first view and drilldown layers."
    - "Create QA-to-red for criterion cards, maturity tabs, descriptor modal, evidence placeholder, and AI question placeholder."
  required_build_gates:
    - "No runtime code changes."
    - "No database migrations."
    - "No API implementation."
    - "No evidence modal implementation."
    - "No UI implementation."
  expected_qa_scope:
    - "Final-approved/final-locked published model access."
    - "Collapsible published model navigation."
    - "Criterion detail cards and maturity tabs."
    - "Traceability, authorization, and read-only boundaries."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
