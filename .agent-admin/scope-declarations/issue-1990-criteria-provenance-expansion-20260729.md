# Scope Expansion — Issue #1990 public.criteria Provenance

**Authority:** CS2-directed bounded expansion, 29 July 2026  
**Carrier:** draft PR #1992  
**Owner:** foreman-v2-agent  
**Status:** discovery complete; implementation gated by refreshed QA-to-RED and builder appointment.

## Objective

Restore the minimum ordered source provenance for `public.criteria` so a clean replay reproduces its proven production contract.

## Proven production contract

`public.criteria` is a legacy/root audit-model table. It is distinct from `public.mmm_criteria`.

- Columns: `id`, `mps_id`, `domain_id`, `audit_id`, `organisation_id`, `number`, `description`, `guidance`, `created_at`, `updated_at`, `excluded`, `sort_order`, `title`, `source_anchor`, `intent_statement`.
- Direct foreign keys: `mini_performance_standards`, `domains`, `audits`, and `organisations`, each cascade-on-delete.
- Integrity: primary key `id`; unique `(audit_id, number)`.
- Security: RLS enabled; SELECT restricted to `authenticated`, INSERT and UPDATE policies target `public`; each uses the existing profile-derived organisation predicate.
- No triggers and no custom indexes beyond the PK/unique indexes.

## Required ordering

The bootstrap must be after existing source definitions for `organisations`, `audits`, `domains`, `mini_performance_standards`, and `profiles`; it must be before all source objects that declare a foreign key to `criteria` or read it through replayed views.

## Explicit exclusions

- Do not alter production or access production business rows.
- Do not alter `public.mmm_criteria`, MMM runtime logic, PIT features, PR #1973, or application code.
- Do not create, alter, seed, or grant access to `public.mmm_native_migrations` in this step. Its ledger provenance remains separately inventoried.
- Do not weaken RLS, replace the proven policy roles, add triggers, or add broader grants.
- Do not create a migration until the refreshed QA-to-RED and appointment evidence are committed.

## Required proof

1. focused source test is RED before implementation and GREEN afterward;
2. exact production-equivalent criteria contract and ordering;
3. clean GitHub-backed replay reaches terminal success;
4. replay schema confirms `public.criteria` parity before inspecting the separate `mmm_native_migrations` gap.