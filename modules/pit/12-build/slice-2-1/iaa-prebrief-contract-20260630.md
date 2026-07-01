# PIT Stage 12 Slice 2.1 IAA Pre-Brief Contract

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | IAA PREFLIGHT CONTRACT FILED |

---

IAA_PREFLIGHT_BRIEF:

EXPECTED_QA_SCOPE:
  - Verify that the dual integrated and standalone PIT journey is specified before implementation.
  - Verify that shared Maturion identity remains the controlling account model.
  - Verify that PIT-only and full-bundle entitlement expectations are specified.
  - Verify that the route guard order is authentication, entitlement, then role permission.
  - Verify that PIT role families include project, milestone, deliverable and task responsibility levels.
  - Verify that the PIT host boundary prevents duplicate generic ISMS landing behavior.
  - Verify that QA-to-Red tests are filed before implementation.

EXPECTED_FAILURE_MODES:
  - Specification treats PIT as integrated only and omits standalone use.
  - Specification creates a disconnected PIT-only identity silo.
  - Specification allows duplicate generic ISMS public landing on PIT host.
  - Specification skips PIT-only entitlement.
  - Specification collapses role families into a single generic user role.
  - Specification proceeds to implementation without RED tests.
  - Specification claims Slice 2.1 or Stage 12 completion.

FOREMAN_INSTRUCTIONS:
  - Keep Slice 2.1 specification-only.
  - Do not authorize runtime implementation from this PR.
  - Ensure all pre-build addenda exist before any later build slice.
  - Ensure QA-to-Red is filed and traceable.
  - Preserve Maturion umbrella governance for standalone PIT use.
  - Do not reopen the old duplicate PIT host defect.

IAA_WILL_QA:
  - Review the App Description, UX, FRS, TRS, Architecture and QA-to-Red addenda for consistency.
  - Confirm that standalone PIT means module-specific entry under Maturion governance.
  - Confirm no runtime code is included.
  - Confirm no Supabase, auth-provider, billing-provider or host-policy implementation is included.
  - Confirm non-completion wording.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## Final assurance

PENDING. Final assurance must occur after review of this specification pack.
