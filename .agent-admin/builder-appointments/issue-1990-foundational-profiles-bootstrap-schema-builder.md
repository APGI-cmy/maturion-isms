# Builder Appointment — Issue #1990 Foundational `public.profiles` Bootstrap

**Appointed builder:** schema-builder  
**Appointment state:** ACTIVE  
**Issue / PR:** #1990 / draft #1992  
**Authority chain:** Johan Ras (CS2) → Foreman → schema-builder  
**Preconditions satisfied:** expanded scope recorded; refreshed IAA pre-brief committed; executable QA-to-RED committed at `a42fab96ae46dd2386ecc6b3ff7c33b7fbddde90`.

## Permitted job

Create the minimum ordered, Supabase-CLI-generated source migration required to bootstrap `public.profiles` before PIT projects references it, preserving:

- `profiles.id` → `auth.users(id)` with cascade deletion;
- `profiles.organisation_id` → `public.organisations(id)`;
- RLS enabled with own-row SELECT, INSERT and UPDATE policies;
- existing Issue #1990 migration identity files unchanged.

Add only the focused test/evidence updates needed to take the refreshed suite from 6 GREEN / 3 RED to all GREEN, then obtain a GitHub-backed disposable preview replay.

## Prohibited

- production database or data mutation;
- changes to PR #1973 / Issue #1959, approval workflow, PIT feature scope, Edge Functions, Vercel, application runtime, grants, private helpers, or unrelated RLS;
- reuse or wholesale transplantation of retired MAT legacy material;
- creating a migration before this appointment record;
- merge, QP/ECAP/IAA PASS claims, or issue closure before the required preview and independent assurance.

**Approval wording:** Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
