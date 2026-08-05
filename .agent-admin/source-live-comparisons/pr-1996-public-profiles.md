# PR #1996 — public.profiles Source / Live Comparison

The recovery is limited to 11 columns: id, organisation_id, display_name, email, language, theme, role, created_at, updated_at, full_name, and preferences.

It has id → auth.users(id) ON DELETE CASCADE and organisation_id → public.organisations(id), RLS, and the self-only profiles_select_own, profiles_insert_own, and profiles_update_own policies.

No legacy MAT audits, domains, criteria, triggers, storage, or broad grants are recovered. No operator-directed SQL was applied and no production migration is claimed.
