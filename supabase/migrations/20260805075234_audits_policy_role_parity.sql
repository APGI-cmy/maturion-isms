-- Production-parity policy-role corrections for public.audits.
-- Corrects audits_insert_authenticated and audits_org_isolation to TO public,
-- matching production's role posture identified in replay #1998 metadata comparison.

-- Recreate INSERT policy: TO public with full production predicate
drop policy if exists audits_insert_authenticated on public.audits;
create policy audits_insert_authenticated
on public.audits
as permissive for insert
to public
with check (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Recreate ALL policy: TO public with profile-derived organisation predicate
drop policy if exists audits_org_isolation on public.audits;
create policy audits_org_isolation
on public.audits
as permissive for all
to public
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);
