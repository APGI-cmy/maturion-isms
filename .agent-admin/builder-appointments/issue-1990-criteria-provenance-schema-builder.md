# Conditional Builder Appointment — Issue #1990 `public.criteria` Provenance

**Appointed builder:** schema-builder / Copilot  
**Issue / PR:** #1990 / draft #1992  
**Authority chain:** Johan Ras (CS2) → Foreman → schema-builder  
**Appointment status:** ACTIVE FOR QA EXECUTION; implementation authority activates only after the committed RED suite is executed and posted.

## Authorised job

1. Run the refreshed focused suite and post the actual RED evidence.
2. After that record exists, create exactly one minimum ordered source bootstrap for `public.criteria` through the Supabase CLI migration-creation workflow.
3. Reproduce the production contract exactly: columns/defaults/nullability; four cascade FKs; PK and `(audit_id, number)` uniqueness; RLS; and the three proven policy names/role postures.
4. Update only the focused tests/evidence required to reach GREEN.
5. Return the exact head and request the Foreman-created disposable preview. Do not create the preview independently.

## Prohibited

- Do not touch `public.mmm_criteria` or `public.mmm_native_migrations`.
- No production mutation or data access; no grants/functions/triggers unless they are proven part of the production contract.
- No PR #1973, #1959, PIT feature, Edge Function, Vercel, runtime, merge, QP/ECAP, IAA-PASS, or issue-closure work.

**Approval wording:** Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.