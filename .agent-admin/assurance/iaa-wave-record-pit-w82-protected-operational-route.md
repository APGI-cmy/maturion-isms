# IAA Wave Record — PIT W8.2 Protected Operational Route

| Field | Value |
|---|---|
| Wave ID | `pit-w82-protected-operational-route` |
| Governing issue | `#1810` |
| Reference PR | `#1813` |
| Implementation PR | `#1824` |
| Scope | Implementation-only protected PIT operational access route |
| W8.2 posture | `W8.2_NOT_READY` |

## PRE-BRIEF

### IAA_PREFLIGHT_BRIEF

| Field | Value |
|---|---|
| BRIEF_ID | `IAA_PREFLIGHT_BRIEF:pit-w82-protected-operational-route` |
| WAVE_ID | `pit-w82-protected-operational-route` |
| GOVERNING_ISSUE | `#1810` |
| TARGET_PR | `#1824` |
| MODULE | `PIT / ISMS portal route handoff` |
| WORK_TYPE | `implementation-only route access fix` |
| FOREMAN | `foreman-v2` |
| BUILDER | `pit-specialist / copilot-builder-resource` |
| RESULT | `PREFLIGHT_BRIEF_COMPLETE` |

### Scope to verify

- Add `ROUTES.PIT = /pit`.
- Add `ROUTES.PIT_TRACKER = /pit/tracker`.
- Add `/pit` redirect to `/pit/tracker`.
- Add protected `/pit/tracker` shell route using the existing `ProtectedRoute`, `PitErrorBoundary`, and `PitShell` pattern.
- Preserve `/subscribe` and `/subscribe/checkout` as public commercial subscription routes.

### Exclusions

- No Supabase writes.
- No fake subscription state.
- No billing fixtures.
- No auth user creation.
- No W8.2 completion claim.
- No handover or merge-readiness claim in this implementation-only stage.

### Risks to check during QP

- ISMS remains the platform front door.
- Marketing routes remain public.
- Subscription and checkout routes remain public.
- Private operational routes remain protected.
- The route patch does not alter billing or subscription semantics.
- Deployment ownership remains ISMS Portal because changed implementation files are under `apps/isms-portal/**`.

### Required post-build controls

- Foreman QP after implementation.
- ECAP admin validation if required.
- Pre-handover lane only when handover/completion/readiness language is used.
- IAA final assurance before CS2 review.

## FINAL ASSURANCE

PENDING. No final IAA assurance is claimed by this wave record.
