# Builder Record - MMM Published Model QA-to-Red

Wave: `wave-mmm-published-model-qa-red-2026-06-23`
Date: 2026-06-23
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-published-model-qa-red`
Builder role: `qa-to-red-builder`

## Task

Create QA-to-red coverage for Step 6: published maturity model view before implementation code is written.

## Required coverage

- Final-approved/final-locked model visibility.
- Published model route or entry point.
- Read-only behavior after final lock.
- Collapsible MPS-first view.
- MPS to intent to criteria to descriptors drilldown.
- Criterion cards.
- Current maturity level tab.
- Next maturity level tab.
- Maturity descriptor modal.
- Evidence management entry point placeholder.
- AI question interface placeholder.
- Domain to MPS to criterion to descriptor traceability.
- Authorization boundaries.
- Empty/loading/error states.
- No mutation from published view.

## Boundaries

This record allows QA-to-red artifacts only.

Not in scope:

- UI implementation.
- Database migrations.
- API routes or edge functions.
- Evidence management modal.
- MAT evidence harvest.
- AI question runtime behavior.
- Maturity scoring or evidence scoring.
- Approval workflow runtime behavior.

## Required output location

```text
modules/MMM/approval-workflow/
```
