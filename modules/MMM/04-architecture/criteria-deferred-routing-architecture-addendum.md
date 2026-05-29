# MMM Architecture Addendum — Criteria Deferred Routing

Date: 2026-05-28

## Component-level changes

- `CriteriaManagement.tsx`
  - Adds resilient parser for AI criteria payloads.
  - Adds user-driven criteria augmentation (`Add More Criteria`).
  - Adds deferred target MPS routing metadata.
  - Adds modal-level submit orchestration.
- `AIGeneratedCriteriaCards.tsx`
  - Adds in-row source-origin display for traceability.

## Data-flow update

1. Generate/augment criteria in memory state.
2. Classify source + optional deferred target.
3. User accepts/rejects.
4. Modal submit persists selected criteria:
   - default: current MPS
   - deferred: resolved target MPS

## Risk controls

- Deferred routing always visible to user before save.
- Parsing hardening reduces false fallback paths.
