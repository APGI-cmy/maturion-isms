# MMM FRS Addendum — Criteria Deferred Routing + Modal Submit Semantics

Date: 2026-05-28  
Scope: Leadership & Governance Criteria card workflow hardening

## Functional Requirements

1. Criteria modal must support a modal-level `Accept / Submit` action that persists all accepted generated criteria for the active modal context.
2. User may add custom criteria (`Add More Criteria`) before final submit.
3. Added criteria must be classified:
   - `user_added` when it belongs to current MPS.
   - `deferred_user` when routing logic detects a better-fit target MPS.
4. Deferred criteria must persist to the resolved target MPS on submit.
5. AI fallback message must only represent true unavailability and not parsing-format variance.
6. Criteria source tag must be visible in-modal (`uploaded_source`, `ai_completion`, `subject_knowledge`, `user_added`, `deferred_user`).

## Acceptance

- User can generate, edit by adding criteria, accept selected, and submit from a single modal close-out action.
- Deferred routing is explicit and non-silent.
