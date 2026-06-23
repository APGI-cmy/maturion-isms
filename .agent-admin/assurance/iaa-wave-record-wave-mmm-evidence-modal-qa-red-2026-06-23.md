# IAA Wave Record - MMM Evidence Modal QA-to-Red

Wave: `wave-mmm-evidence-modal-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-evidence-modal-qa-red`
Scope record: `.agent-admin/scope-declarations/wave-mmm-evidence-modal-qa-red-2026-06-23.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify QA-to-red covers MAT evidence modal source identification before implementation.
- Verify QA-to-red covers criterion-linked evidence modal entry from the published model view.
- Verify QA-to-red covers all required evidence type expectations: document/URL, photo/image, video, voice note/audio, spreadsheet/file, and text findings.
- Verify QA-to-red covers remove/replace controls, mobile capture, direct camera/photo/video capture, and evidence list rendering.
- Verify QA-to-red covers AI evidence evaluation and re-evaluation placeholders without implementing AI runtime behavior.
- Verify QA-to-red covers PIT/risk/incident link placeholders, authorization boundaries, and non-mutation of final-approved model content.

EXPECTED_FAILURE_MODES:
- Implementing evidence upload runtime before QA-to-red exists.
- Harvesting MAT evidence behavior without preserving criterion/domain/MPS context.
- Losing storage path context from organisation, audit/framework, and criterion identity.
- Omitting voice note, video, image, spreadsheet/file, document/URL, or text findings expectations.
- Allowing evidence changes to mutate final-approved maturity model content.
- Implementing AI evidence evaluation, PIT/risk integrations, storage adapters, or capture runtime in this QA-to-red wave.

FOREMAN_INSTRUCTIONS:
- Keep this wave to scope, IAA pre-brief, builder record, and QA-to-red artifacts.
- Do not implement evidence modal UI, upload runtime, storage adapters, camera/audio/video capture, AI evaluation, PIT/risk integrations, API routes, or database migrations in this wave.
- QA-to-red must be specific enough for the next implementation wave to convert into executable tests before code.

IAA_WILL_QA:
- IAA will check that the QA-to-red artifact derives from the published model QA-to-red baseline and MAT evidence source.
- IAA will check that this wave stays pre-code.
- IAA will check that builder record exists before implementation work begins.
- IAA will check that Step 7 does not leak into evidence runtime implementation.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-evidence-modal-qa-red-2026-06-23"
  pr: "pending"
  branch: "foreman/mmm-evidence-modal-qa-red"
  qualifying_tasks:
    - "Create QA-to-red for evidence modal source identification from MAT."
    - "Create QA-to-red for criterion-linked evidence modal entry and context preservation."
    - "Create QA-to-red for evidence type, remove/replace, mobile capture, AI placeholder, and integration placeholder expectations."
  required_build_gates:
    - "No runtime code changes."
    - "No database migrations."
    - "No API implementation."
    - "No evidence modal implementation."
    - "No upload/capture runtime implementation."
  expected_qa_scope:
    - "MAT evidence source identification."
    - "Criterion-linked evidence context preservation."
    - "Evidence type expectations and controls."
    - "AI/PIT/risk/incident placeholders only."
    - "Authorization and non-mutation boundaries."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
