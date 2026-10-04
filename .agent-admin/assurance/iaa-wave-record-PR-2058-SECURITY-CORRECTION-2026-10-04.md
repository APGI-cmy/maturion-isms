# IAA Wave Record — PR-2058-SECURITY-CORRECTION

## PRE-BRIEF

**Authoritative task record:** `.agent-admin/prs/pr-2058/wave-current-tasks.md`  
**PR:** [#2058 — Add explicit application Data API grants before Supabase's October change](https://github.com/APGI-cmy/maturion-isms/pull/2058)  
**Work item / wave:** `PR-2058-SECURITY-CORRECTION`  
**Branch:** `codex/explicit-data-api-grants-20260923`  
**Submitted head:** `9a537ee785ba24e1f9f57737e8c5fa15388e9aa7`  
**ceremony_admin_appointed:** Not specified in the authoritative task record; no appointment is inferred.

**CS2 historical delegation-order exception:** The task record cites CS2 comments `5978432262` and `5979407372`. Existing implementation commits predate the exception; no historical pre-brief, builder appointment, or strict commit order is claimed. The exception does not waive security changes, focused regression tests, independent assurance, or CS2 merge review.

Qualifying tasks:
1. **PR2058-SEC-01** — Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; remove authenticated grants to public MMM helpers and prevent unauthorized PIT helper RPC-oracle use with a private/non-exposed schema where supported by the trace, while preserving RLS evaluation and approved RPC write paths.
2. **PR2058-SEC-02 (evidence-table scope)** — Establish from DDL and application use whether `public.evidence_submissions` is a supported Data API table; if confirmed, add precise authenticated/service-role grants, no anon grant, and exercise it in fixture/coverage.
3. **PR2058-SEC-02 (assertion/documentation scope)** — Preserve the PostgreSQL multi-privilege `has_table_privilege` assertion and cite authoritative PostgreSQL documentation.

Applicable overlay: **BUILD_DELIVERABLE (T2 schema/API), with PRODUCT_BUILD_ASSURANCE applicable to the backend/data-access security correction.**

Anti-regression obligations: **Yes** — apply FUNCTIONAL-BEHAVIOUR-REGISTRY **NBR-002** to verify expected authorized writes and prevent silent RLS/write-path regressions; apply **NBR-005** where DDL and application table use are coupled, verifying the actual schema/use relationship rather than relying on mocks.
