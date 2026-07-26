# Bounded Appointment — PIT W8.3 Pre-Build Alignment

## Appointment

The Foreman appoints a bounded pre-build documentation and QA-design lane for Issue `#1968` and PR `#1972`.

## Authority

- CS2 Authority: Johan Ras
- Foreman orchestration required
- IAA pre-brief: `.agent-admin/assurance/iaa-prebrief-pit-w83-prebuild-alignment-pr-1972.md`
- Scope declaration: `.agent-admin/scope-declarations/pit-w83-prebuild-strategy-alignment-1968.md`

## Permitted work

- author pre-build addenda and traceability artifacts;
- define data, API, RLS, lifecycle and integration contracts;
- define QA-to-RED tests and executable harness requirements;
- reconcile PBFAG and Stage 8 wave boundaries;
- record Foreman QP and ECAP administrative evidence.

## Prohibited work

- runtime application code;
- Supabase schema/migrations or live RLS changes;
- Vercel/Render configuration;
- builder appointment for implementation;
- enabling AIMC, evidence scoring or incident-workflow runtime;
- weakening or deleting existing RED tests;
- declaring Stage 12, PIT or production complete.

## Completion condition

The lane ends when the full pre-build chain is internally consistent, QA-to-RED is sufficiently executable, independent IAA has issued a final disposition, and CS2 has accepted or rejected the readiness recommendation.

Current status: `APPOINTED FOR PRE-BUILD ALIGNMENT ONLY — IMPLEMENTATION BUILDER NO-GO`.
