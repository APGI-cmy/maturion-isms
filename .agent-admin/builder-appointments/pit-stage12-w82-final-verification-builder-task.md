# Builder Task Order — PIT Stage 12 W8.2 Final Verification

Issue: APGI-cmy/maturion-isms#1774
Wave: pit-stage12-w82-final-verification
Builder: pit-specialist
Foreman: foreman-v2-agent
Date: 2026-06-11

## Appointment basis

Stage 11 appointed pit-specialist for PIT Stage 12. W8.2 final verification executes under that existing appointment, subject to explicit CS2 authorization before any builder execution begins.

## Builder task

Execute actor-based RLS verification and deployed denied-path evidence collection for W8.2, as defined in `modules/pit/12-build/w82-final-role-matrix-denied-path-evidence.md`.

## Hard constraints

- **No Supabase seeding may occur until a later CS2-approved seed plan exists and is explicitly authorized.** The seed plan must be reviewed and signed off by CS2 before any test data is inserted. This constraint is absolute and may not be waived by the builder.
- Do not modify migrations.
- Do not modify application code unless explicitly authorized by CS2 for a targeted fix within this scope.
- Do not modify `.github/agents/*`.
- Do not create new auth users without CS2 approval.
- Do not claim W8.2 completion.
- Do not claim Stage 12 completion.
- Do not claim PIT FUNCTIONAL_PASS.
- Do not expand into W8.3, W8.5, W8.6, or AIMC/provider work.

## Evidence requirements

The builder must populate all evidence ledger tables in `modules/pit/12-build/w82-final-role-matrix-denied-path-evidence.md` before any handover claim:

- Pre-seed counts (actual database state before any seed).
- Seed approval record (CS2 authorization reference — must exist before seeding).
- Actor map (all actors and their membership/role assignments).
- RLS allow/deny matrix (results per actor per table).
- Deployed route denied-path matrix (browser evidence per route per actor).
- Protected data exposure checks.
- Cleanup/retention decision.
- Final W8.2 verification decision.

## Non-overclaim

The final verification decision in the evidence ledger must remain NOT_READY until every required evidence row is completed and passing. The builder may not advance the final status until Foreman/QP reviews and confirms.

## Foreman/QP gate

After builder handover, Foreman will inspect the diff, run QP, and either issue a STOP_AND_FIX package or proceed to ECAP/IAA/gate management. This task order does not constitute a merge-ready claim.
