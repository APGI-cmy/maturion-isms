# Conditional Builder Appointment — Issue #1990 `mmm_native_migrations` Recovery

**Appointed builder:** schema-builder / Copilot  
**Issue:** #1990  
**Replacement PR:** PENDING — to be opened on this branch after the first lawful implementation commit  
**Authority chain:** Johan Ras (CS2) → Foreman → schema-builder  
**Appointment status:** ACTIVE FOR THE BOUNDED IMPLEMENTATION BELOW

## Precondition satisfied

The refreshed IAA pre-brief for this bounded lane was committed before this appointment at:

- `5bb9f2806528bcbdfbe10f90943d98042cbe10df`

No implementation-like change for this lane predates this appointment on this branch.

## Authorised job

1. Add the focused RED test/evidence changes needed to establish the lawful `mmm_native_migrations`
   recovery lane if not already present on the replacement branch.
2. Create the minimum ordered source bootstrap for `public.mmm_native_migrations`, using a
   Supabase-CLI-created migration filename.
3. Preserve the proven source contract:
   - `name text primary key`;
   - `applied_at timestamptz not null default now()`;
   - RLS enabled;
   - no policies, triggers, foreign keys, client-role grants, or seed rows.
4. Keep all previously merged Issue #1990 baseline-reconciliation migrations and workflows
   byte-for-byte unchanged unless a focused test-only correction is required inside this lane.
5. Take the focused suite to GREEN, then request — not self-authorise — the GitHub-backed preview,
   QP, ECAP, and independent IAA sequence.

## Non-negotiable boundaries

- No production mutation or production data access.
- No PR #1973 / approval-runtime / PIT/MMM feature work.
- No changes to unrelated migration bodies, workflow files, grants, policies, helper functions, or
  application runtime.
- No merge-ready, handover, or PASS claims before the replacement lane has its own draft PR,
  PR-scoped delegation evidence, preview proof, and independent assurance.

**Approval wording:** Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
