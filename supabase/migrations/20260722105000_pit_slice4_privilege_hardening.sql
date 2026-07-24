-- PIT Stage 12 Slice 4 privilege hardening
-- Authenticated users require only SELECT, INSERT and UPDATE. Row access remains RLS-controlled.

revoke all on table public.projects from authenticated;
revoke all on table public.source_links from authenticated;

grant select, insert, update on table public.projects to authenticated;
grant select, insert, update on table public.source_links to authenticated;

revoke all on table public.projects from anon;
revoke all on table public.source_links from anon;
