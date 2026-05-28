# MMM TRS Addendum — Sidebar Context + MPS L1/L2 Approval

## Technical Requirements
- Introduce a shared authenticated app shell component with sidebar + content outlet.
- Add Organisation Context page bound to `mmm_organisations.context` with update capability and audit event emission.
- Add DMC migration invoke flow using `mmm-subject-knowledge-migrate-legacy`.
- Add approval workflow persistence for:
  - MPS L1 action history and lock state,
  - domain L2 review request loop and comments.

## Data Contract Requirements
- MPS approval records must track actor, action, notes, state transition, and timestamp.
- Domain review requests must track submitter, reviewer, current status, lock state, and latest action timestamp.
- Domain review comments must preserve round-trip thread entries with author and created time.

## API Requirements
- Provide MPS approval action endpoint for `approve|reopen|reject|regenerate`.
- Provide domain approval endpoint for `submit|return|resubmit|approve`.
- Provide domain approval comment endpoint for reviewer/user loop communication.
- All endpoints must enforce JWT and organisation boundaries.
- MPS modal submit transition must call domain L2 endpoint (`mmm-domain-approval-action`, action `submit`) from in-modal context.
- MPS content edit path must persist updates to `mmm_maturity_process_steps` and emit learning-capture telemetry to `mmm_ai_interactions` (`action_type=USER_PREFERENCE_CAPTURE`).
- Learning capture must require explicit user consent via acknowledgement prompt before preference event persistence.
- Organisation Context source uploads must write to the canonical knowledge ledger with `scope_type=organisation_context`, mode tags (`source_mode:VERBATIM|HYBRID|GENERATED`), and tenant-scoped storage references.
- A shared mode-source resolver must supply MPS, Intent, and Criteria generation with:
  - framework source type,
  - organisation profile context,
  - organisation/framework source-document inventory,
  - mode-specific source rules,
  - explicit tenant-isolation flag.
- AI generation payloads must distinguish `mode_source_strategy` values:
  - `verbatim_context_document`,
  - `hybrid_gap_analysis`,
  - `new_generation_public_research`.
- Hybrid-capable generated payloads should accept `source_origin` metadata (`uploaded_source`, `ai_completion`, `subject_knowledge`) for colour-coded UX.

## QA Requirements
- Include QA-to-red contracts for:
  - sidebar persistence across authenticated pages,
  - context edit replacing wizard re-entry,
  - DMC migration telemetry visibility,
  - MPS L1 + domain L2 loop transitions and lock rules.
