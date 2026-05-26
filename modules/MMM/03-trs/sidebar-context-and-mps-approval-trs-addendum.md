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

## QA Requirements
- Include QA-to-red contracts for:
  - sidebar persistence across authenticated pages,
  - context edit replacing wizard re-entry,
  - DMC migration telemetry visibility,
  - MPS L1 + domain L2 loop transitions and lock rules.
