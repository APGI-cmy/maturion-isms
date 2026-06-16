# PIT Stage 12 W8.2 Final Verification Scope Declaration

SCOPE_SCHEMA_VERSION: 1
PR_NUMBER: TBD
ISSUE: TBD
BRANCH: pit-stage12-w82-final-verification-wave
OWNER: APGI-cmy
DATE_UTC: 2026-06-11

## Authority

- Wave: pit-stage12-w82-final-verification
- Governing W8.2 issue: APGI-cmy/maturion-isms#1774
- Stage 12 authorization: APGI-cmy/maturion-isms#1767
- Module: PIT
- Foreman: foreman-v2-agent
- Builder: pit-specialist (assumed; subject to explicit CS2 authorization before builder execution begins)
- Status: proposed/authorized wave-start admin setup only
- Build Authorization: PENDING — builder execution and Supabase seed blocked pending later CS2 approval

## IN_SCOPE

- Actor-based RLS evidence for W8.2.
- Deployed denied-path evidence for W8.2 protected routes.
- Governance wave-start artifacts for this wave only.

## OUT_OF_SCOPE

- Supabase seeding (blocked — requires later CS2-approved seed plan).
- Migration changes.
- Application code changes.
- `.github/agents/*` changes.
- Creation of new auth users.
- W8.3 or later work.
- Stage 12 completion claim.
- PIT FUNCTIONAL_PASS claim.
- W8.2 completion claim.

## FILES_CHANGED

- .agent-admin/scope-declarations/pit-stage12-w82-final-verification.md
- .agent-admin/builder-appointments/pit-stage12-w82-final-verification-builder-task.md
- .agent-admin/assurance/iaa-wave-record-pit-stage12-w82-final-verification-2026-06-11.md
- .agent-admin/ecap/pit-stage12-w82-final-verification-ecap.md
- modules/pit/12-build/w82-final-role-matrix-denied-path-evidence.md

## Exit posture

This scope declaration covers governance/admin wave-start artifacts only. Builder execution and Supabase seed remain blocked until CS2 issues a separate approval. No completion, merge-readiness, or FUNCTIONAL_PASS claim is made.
