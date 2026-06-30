# PIT Stage 12 Slice 2 IAA Pre-Brief Contract

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Issue | #1868 |
| Date | 2026-06-30 |
| Status | IAA PRE-BRIEF CONTRACT FILED |
| Classification | PIT-only runtime slice |

---

IAA_PREFLIGHT_BRIEF:

EXPECTED_QA_SCOPE:
  - Verify that `/pit/tracker` remains reachable for entitled users after the ISMS handoff.
  - Verify that `/pit/tracker` provides visible navigation or action into the project workspace foundation.
  - Verify that `/projects` renders a PIT Project Register foundation instead of a generic placeholder-only shell.
  - Verify that `/projects/new` renders a PIT Create Project foundation instead of a generic placeholder-only shell.
  - Verify that non-entitled direct access to PIT runtime routes remains blocked or redirected predictably.
  - Verify that PIT deployment host redirect behavior from PR #1865 does not regress.
  - Verify that admin and QA route protections do not regress.
  - Verify that the UI does not claim persistence, full project lifecycle, reports, audit, AI, or production readiness unless implemented in-scope.

EXPECTED_FAILURE_MODES:
  - `/projects` or `/projects/new` renders a white screen.
  - `/projects` or `/projects/new` remains a generic placeholder without PIT-specific workspace meaning.
  - Entitlement/auth protection is bypassed or weakened.
  - The implementation changes ISMS-owned public acquisition, subscription, auth, onboarding, dashboard, or entitlement handoff behavior.
  - The PIT deployment host begins rendering public acquisition surfaces again.
  - The UI implies full project CRUD, database persistence, evidence lifecycle, report generation, or production readiness without implementation evidence.
  - Admin or QA route role protections regress.

FOREMAN_INSTRUCTIONS:
  - Treat Slice 2 as PIT-only runtime work after the accepted W8.2 handoff.
  - Do not allow cross-module changes without separate classification.
  - Do not allow Supabase/RLS/database work without a separate data-scope artifact.
  - Do not claim full Stage 12 completion from Slice 2.
  - Require browser evidence after deployment before marking Slice 2 evidence accepted.
  - Preserve W8.2 boundary and host-policy behavior.

IAA_WILL_QA:
  - Review the diff for PIT-only runtime scope containment.
  - Confirm that `/pit/tracker`, `/projects`, and `/projects/new` satisfy the Slice 2 QA-to-Green criteria.
  - Confirm that non-scope areas are untouched or explicitly justified.
  - Confirm that evidence wording avoids full completion, production readiness, release readiness, functional pass, and handover claims.
  - Confirm that test/build gates and browser evidence are available before final Slice 2 disposition.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## Final assurance

PENDING. Final assurance must be performed after implementation and evidence capture.
