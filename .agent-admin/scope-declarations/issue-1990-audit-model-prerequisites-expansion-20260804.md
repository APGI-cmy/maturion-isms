# Scope Expansion — Issue #1990 `criteria` Prerequisites

**Authority:** Johan Ras, CS2 — 4 August 2026  
**Carrier:** draft PR #1992  
**Status:** INVENTORIED; implementation blocked pending refreshed QA-to-RED and appointment.

## Objective

Recover the minimum replayable, production-equivalent source provenance for the three
missing direct predecessors of `public.criteria`:

1. `public.audits`
2. `public.domains`
3. `public.mini_performance_standards`

The required order is existing `organisations` / `profiles` → `audits` → `domains` →
`mini_performance_standards` → existing `criteria` bootstrap. The recovery must preserve
the production contract, including RLS and the two exclusion-cascade triggers that belong
to the `domains` and MPS behaviour.

## Inventory result

- `audits` is organisation-scoped, has auth-user references, production columns and
  constraints established through the historical audit-model sequence, and has RLS.
- `domains` depends on `audits` and `organisations`, has unique `(audit_id, number)`, RLS,
  and the `exclude_cascade_domains_trigger` trigger.
- `mini_performance_standards` depends on `domains`, `audits`, and `organisations`, has
  unique `(audit_id, number)`, a read-only authenticated RLS posture, and the
  `exclude_cascade_mps_trigger` trigger.
- The repository contains historical material that explains origin, but active
  `supabase/migrations` has no source definitions for the three tables. Historical material
  is evidence only; it must not be copied wholesale.

## Authorised implementation boundary

- Create only the smallest ordered recovery needed for the three tables and their proven
  cascade behaviour. Any new migration filenames must be created by the Supabase CLI.
- Preserve the existing `profiles` and `criteria` recovery files, four identity reconciliations,
  and all unrelated source migrations.
- Reproduce the live RLS policy names, commands, target roles, and organisation predicate;
  do not modernise or broaden their semantics inside this recovery.
- Add focused executable source-contract tests before implementation, then prove GREEN and
  one clean GitHub-backed replay before any assurance or merge decision.

## Explicit exclusions

- No production mutation or production data access.
- No `public.mmm_native_migrations` recovery, PR #1973 change, PIT/MMM feature work,
  Edge Function/Vercel/runtime change, merge, or issue closure.
- No recovery of other legacy tables, views, storage, functions, or grants. If the three-table
  recovery reveals another missing prerequisite, stop and return it for CS2 direction.

