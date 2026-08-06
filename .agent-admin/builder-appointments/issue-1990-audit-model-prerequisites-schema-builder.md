# Conditional Builder Appointment — Issue #1990 Audit-Model Prerequisites

**Appointed builder:** schema-builder / Copilot  
**Issue / PR:** #1990 / draft #1992  
**Authority chain:** Johan Ras (CS2) → Foreman → schema-builder  
**Appointment status:** ACTIVE FOR THE BOUNDED IMPLEMENTATION BELOW.

## Precondition satisfied

The refreshed RED authority was committed before this appointment in
`b9b5422f750361394bdcd3751f0feef7b90fc3ec`; its executed result is 14 passed / 5 failed.

## Authorised job

1. Create the minimum ordered source recovery for `public.audits`, `public.domains`, and
   `public.mini_performance_standards`, using Supabase CLI-created migration filenames.
2. Preserve their proven production columns/defaults/nullability, foreign keys, unique rules,
   RLS policy forms and target roles.
3. Add only the proven `cascade_exclude_to_children` function and the
   `exclude_cascade_domains_trigger` / `exclude_cascade_mps_trigger` after the existing
   `public.criteria` bootstrap is available.
4. Take the focused suite to GREEN, post the exact command output and commit SHA on PR #1992,
   then request—not create—the Foreman-managed GitHub-backed preview.

## Non-negotiable boundaries

- No production mutation/data access, no `mmm_native_migrations`, no PR #1973 or #1959 work,
  no PIT/MMM feature work, no Edge Function/Vercel/runtime change, and no merge/closure.
- Do not copy retired legacy migration files wholesale; use them only as provenance evidence.
- Do not alter the existing profiles, criteria, or four identity-reconciliation SQL bodies.
- Do not add tables, views, storage, grants, or security-definer functions beyond the one
  proven cascade function. Stop and report if another prerequisite appears.

**Approval wording:** Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.

