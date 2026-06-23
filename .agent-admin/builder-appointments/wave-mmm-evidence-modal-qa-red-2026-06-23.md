# Builder Record - MMM Evidence Modal QA-to-Red

Wave: `wave-mmm-evidence-modal-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-evidence-modal-qa-red`
Builder role: `qa-to-red-builder`

## Task

Create QA-to-red coverage for Step 7: evidence modal harvest/adaptation from MAT before implementation code is written.

## Required coverage

- MAT evidence source identification.
- Evidence modal entry from a published criterion card.
- Criterion-linked context preservation.
- Document/URL upload expectation.
- Photo/image upload expectation.
- Video upload expectation.
- Voice note/audio upload expectation.
- Spreadsheet/file upload expectation.
- Text findings expectation.
- Remove/replace controls.
- Mobile capture expectations.
- Direct camera/photo/video capture expectations.
- Evidence storage path context.
- Evidence list rendering.
- AI evidence evaluation placeholder.
- Evidence re-evaluation placeholder.
- PIT/risk/incident data-link placeholders.
- Authorization and read-only boundaries.
- Non-mutation of final-approved maturity model content.

## Boundaries

This record allows QA-to-red artifacts only.

Not in scope:

- Evidence modal runtime behavior.
- File upload runtime behavior.
- Storage adapters.
- Camera/audio/video capture runtime behavior.
- AI evidence evaluation runtime behavior.
- PIT/risk/incident integrations.
- Database migrations.
- API routes or edge functions.
- Published model UI runtime behavior.
- Approval workflow runtime behavior.

## Required output location

```text
modules/MMM/approval-workflow/
```
