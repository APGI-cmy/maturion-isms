# IAA Pre-Brief — Wave 15 Schema Drift Hotfix (parse_tasks migration)

**IAA Session**: IAA-20260307-PREBRIEF-WAVE15-SCHEMADRIFT  
**Wave**: 15 — Schema Drift Remediation (parse_tasks migration)  
**Wave Slug**: wave15-schemadrift  
**Date**: 2026-03-07  
**Issue**: #971 — [Foreman] Schema Drift: Missing migration for 'parse_tasks' table (blocks CWT RED gate)  
**Branch**: `copilot/add-migration-for-parse-tasks-table`  
**Foreman Session**: session-wave15-schemadrift-20260307  
**Wave Task List**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`  
**Authority**: `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` v1.1.0  
**Canon Basis**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.3.0  
**Prior Wave 15 Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15.md` (main criteria-parsing pipeline batch — distinct scope)  
**Status**: ACTIVE

---

## Phase 0 Confirmation

This artifact is produced under **Phase 0 (PRE-BRIEF)** invocation mode only.  
IAA Phases 1–4 full assurance will execute at the PR handover gate — **not** during Pre-Brief.  
Pre-Brief invocation confirmed: `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` is present in
`.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (Wave 15 section, Schema Drift Hotfix batch).  
Prior schema-drift Pre-Brief: **ABSENT** — first generation for this hotfix batch confirmed, no duplicate.

This Pre-Brief is a **supplementary amendment** to the existing Wave 15 Pre-Brief (`iaa-prebrief-wave15.md`)
which covers the main criteria-parsing pipeline batch. That Pre-Brief remains active and in force for its
declared tasks. This document declares requirements only for the two Schema Drift hotfix tasks
(T-W15-SCH-001, T-W15-SCH-002) delivered in PR #971.

---

## Wave Hotfix Context

**Incident ID**: INC-W15-SCH-DRIFT-001  
**Root Cause**: The frontend hook `useCriteria.ts` (line 183, `useParseStatus` function) calls
`.from('parse_tasks')` to poll AI parsing status per audit. No migration ever existed for this table,
meaning the `public.parse_tasks` table is absent from the schema. This caused the CWT RED gate test
`T-W13-SCH-11` to fail with:
`Table 'parse_tasks' referenced in frontend hooks has no migration — add a CREATE TABLE migration`  
**CWT test**: `modules/mat/tests/wave13/schema-existence.test.ts` → `T-W13-SCH-11`  
**Test mechanism**: T-W13-SCH-11 reads all `.from('tableName')` references across all hook files in
`modules/mat/frontend/src/lib/hooks/`, then verifies each `tableName` appears in at least one
`CREATE TABLE` statement across all `.sql` files in `apps/maturion-maturity-legacy/supabase/migrations/`.
**Fix scope**: Add a CREATE TABLE migration for `public.parse_tasks` with RLS; record the RCA in
BUILD_PROGRESS_TRACKER.md.  
**PR strategy**: Both tasks delivered in a single PR (#971 — schema drift hotfix).

---

## Task Classification

### Task roster from wave-current-tasks.md (schema drift batch)

| Task ID | Task | Builder | Branch Status |
|---------|------|---------|--------------|
| T-W15-SCH-001 | Add migration `20260307000001_parse_tasks_table.sql` — CREATE TABLE public.parse_tasks (6 columns) + ENABLE ROW LEVEL SECURITY + SELECT policy | schema-builder | 🟡 IN PROGRESS — migration committed on branch |
| T-W15-SCH-002 | Record Schema Drift RCA in `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` | foreman-v2 (governance artifact) | 🟡 IN PROGRESS |

---

### Classification Decisions

#### T-W15-SCH-001 — QUALIFYING

| Field | Value |
|-------|-------|
| **Classification** | **QUALIFYING** |
| **IAA Trigger Category** | `AAWP_MAT` — SQL migration file in `apps/maturion-maturity-legacy/supabase/migrations/`, which is a MAT module path. Per trigger table row 4: "files match AAWP/MAT path patterns (`modules/mat/`, `packages/ai-centre/`, AAWP architecture files)" — this path is the Supabase migration store for the MAT app. Any schema change that touches the `public.*` namespace used by MAT frontend hooks is a MAT deliverable. |
| **Ceremony Level** | Full IAA invocation — Phases 1 through 4 (Preflight, Alignment, Assurance Work, Merge Gate Parity + Verdict) |
| **Rationale** | T-W13-SCH-11 is a CWT (Continuous Workflow Test) RED gate test. A migration that resolves a RED gate failure is a functional schema deliverable, not an admin artifact. The migration creates a table with security-sensitive RLS policy (org-isolation). This is exactly the class of artifact IAA is mandated to review. |

#### T-W15-SCH-002 — NON-QUALIFYING (reviewed incidentally)

| Field | Value |
|-------|-------|
| **Classification** | **NON-QUALIFYING** |
| **Reason** | `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` is an admin/housekeeping tracking document. Per `IAA_PRE_BRIEF_PROTOCOL.md §Qualifying Tasks` and consistent with prior classification of T-W15-GOV-001 in `iaa-prebrief-wave15.md`: "Admin tracking document update → NOT QUALIFYING." The RCA content does not alter this classification — BUILD_PROGRESS_TRACKER.md is a project management artefact that records events, not an executable or security-sensitive deliverable. |
| **IAA treatment** | IAA will review T-W15-SCH-002 **incidentally** during the Phase 3 assurance pass for PR #971 as part of the AAWP_MAT overlay for T-W15-SCH-001 (same PR). Incidental review verifies: RCA section is present, factually accurate, and does not contradict the migration. IAA will NOT spend focused assurance time on BUILD_PROGRESS_TRACKER.md content quality. |

---

## Qualifying Task — Assurance Declaration

### T-W15-SCH-001

| Field | Value |
|-------|-------|
| **task_id** | T-W15-SCH-001 |
| **task_summary** | Add SQL migration `20260307000001_parse_tasks_table.sql` to `apps/maturion-maturity-legacy/supabase/migrations/` creating `public.parse_tasks` with 6 columns (id, audit_id, status CHECK, error_message, created_at, updated_at), enabling Row Level Security, and adding a SELECT policy enforcing org-isolation via `audit_id → audits.organisation_id → profiles.organisation_id`. This migration resolves CWT RED gate test `T-W13-SCH-11`. |
| **iaa_trigger_category** | `AAWP_MAT` — MAT module Supabase migration path |
| **required_phases** | Phase 1 (Preflight), Phase 2 (Alignment), Phase 3 (Assurance Work), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) PREHANDOVER proof file committed on branch, referencing PR #971, listing migration file and BUILD_PROGRESS_TRACKER update as delivered artifacts, and containing a pre-populated `iaa_audit_token` field in format `IAA-session-NNN-waveY-YYYYMMDD-PASS`. (2) Producer session memory file committed on branch. (3) IAA will write its own dedicated token file at `.agent-admin/assurance/iaa-token-session-NNN-wave15-schemadrift-YYYYMMDD.md` after verdict. |
| **applicable_overlays** | `BUILD_DELIVERABLE` overlay: BD-001 (scope: migration matches declared spec), BD-022 (architecture alignment: RLS policy matches org-isolation pattern used by existing MAT tables), BD-RLS (RLS completeness: ENABLE ROW LEVEL SECURITY + at least SELECT policy present) |
| **specific_rules** | CORE-007 (no stubs/TODOs), CORE-013 (IAA invocation evidence), CORE-016 (token file present), CORE-018 (complete evidence sweep), BD-001, BD-022, plus T-W15-SCH-001-specific technical checks enumerated below |

---

#### Mandatory Technical Checks for T-W15-SCH-001

IAA **must** execute all of the following checks during Phase 3. Each is binary: PASS or FAIL.
A single FAIL = REJECTION-PACKAGE.

##### Schema Correctness

| Check ID | Check Description | Failure Indicator |
|----------|-------------------|-------------------|
| SCH-001-01 | Migration file exists at the declared path: `apps/maturion-maturity-legacy/supabase/migrations/20260307000001_parse_tasks_table.sql` | File absent from branch |
| SCH-001-02 | `CREATE TABLE IF NOT EXISTS public.parse_tasks` statement is present | Statement absent or wrong schema name |
| SCH-001-03 | Column `id` is present as `uuid PRIMARY KEY DEFAULT gen_random_uuid()` | Column absent, wrong type, or missing PK/default |
| SCH-001-04 | Column `audit_id` is present as `uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE` | Column absent, nullable, missing FK, or missing CASCADE |
| SCH-001-05 | Column `status` is present as `text NOT NULL DEFAULT 'pending'` with `CHECK (status IN ('pending', 'processing', 'completed', 'failed'))` | Column absent, default missing, or CHECK constraint absent or using different value set |
| SCH-001-06 | Column `error_message` is present as `text` (nullable — no NOT NULL constraint) | Column absent or erroneously NOT NULL |
| SCH-001-07 | Column `created_at` is present as `timestamptz NOT NULL DEFAULT now()` | Column absent, wrong type, or missing default |
| SCH-001-08 | Column `updated_at` is present as `timestamptz NOT NULL DEFAULT now()` | Column absent, wrong type, or missing default |
| SCH-001-09 | Total column count: exactly **6** columns declared in the CREATE TABLE body (id, audit_id, status, error_message, created_at, updated_at) | Fewer or more columns than spec; extra undeclared columns |

##### RLS Correctness

| Check ID | Check Description | Failure Indicator |
|----------|-------------------|-------------------|
| SCH-001-10 | `ALTER TABLE public.parse_tasks ENABLE ROW LEVEL SECURITY` statement is present | Statement absent |
| SCH-001-11 | A SELECT policy named `parse_tasks_select` (or equivalent descriptive name) is present | Policy absent |
| SCH-001-12 | SELECT policy USING clause chains `audit_id → audits.organisation_id → profiles.organisation_id` — i.e., restricts to `audit_id IN (SELECT a.id FROM public.audits a WHERE a.organisation_id IN (SELECT organisation_id FROM public.profiles WHERE id = auth.uid()))` or a semantically equivalent expression | USING clause absent, or uses a flat `auth.uid()` check without org-isolation, or only checks `auth.role() = 'authenticated'` |
| SCH-001-13 | RLS policy is guarded against duplicate creation — idempotency pattern present (e.g., `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE ...) THEN CREATE POLICY ... END IF; END $$`) | No duplicate-creation guard; policy will error on re-run |

##### Migration Hygiene & Test Alignment

| Check ID | Check Description | Failure Indicator |
|----------|-------------------|-------------------|
| SCH-001-14 | Migration filename matches Supabase naming convention: `YYYYMMDDNNNNNN_<description>.sql` (timestamp prefix is correct chronological order and does not conflict with existing migrations) | Filename format violated; timestamp out of order relative to other Wave 15 migrations |
| SCH-001-15 | T-W13-SCH-11 would pass with this migration in place: the regex `CREATE\s+TABLE[^;]*parse_tasks` matches the migration file content | Regex does not match (test would still fail) |
| SCH-001-16 | No INSERT, UPDATE, or DELETE RLS policies are present for `public.parse_tasks` — spec declares SELECT only. If present, they must be intentional and documented in a comment within the migration | Undocumented INSERT/UPDATE/DELETE policies added beyond spec |
| SCH-001-17 | No stub content, TODO comments, placeholder values, or FIXMEs in the migration file | Stub or TODO found |

##### Security & Org-Isolation Alignment

| Check ID | Check Description | Failure Indicator |
|----------|-------------------|-------------------|
| SCH-001-18 | RLS policy does NOT use `auth.role() = 'authenticated'` as the sole check (INC-W13-BUCKET-RLS-001 class of failure) | Policy is weaker than org-isolation |
| SCH-001-19 | FK ON DELETE CASCADE behaviour is intentional for the `audit_id` column: deleting an audit removes its parse_tasks rows. Verify no comment or spec note contradicts this behaviour | FK delete behaviour conflicts with stated spec |

##### Cross-Document Consistency (incidental — T-W15-SCH-002)

| Check ID | Check Description | Failure Indicator |
|----------|-------------------|-------------------|
| SCH-002-01 | `BUILD_PROGRESS_TRACKER.md` contains an RCA entry for the Wave 15 parse_tasks schema drift incident referencing: incident ID or description, the failing test (T-W13-SCH-11), the root cause (no migration for parse_tasks), and PR #971 as the fix | RCA section absent or does not reference the test or fix |
| SCH-002-02 | RCA content in BUILD_PROGRESS_TRACKER.md does not contradict the migration (e.g., does not describe different column names, different table name, or different RLS approach than what was delivered) | Factual inconsistency between RCA record and migration |

---

## Required Evidence Artifacts — Summary

Before invoking IAA for Phase 1–4 assurance on PR #971, the producing agent(s) must have committed
the following artifacts to the branch. IAA will FAIL with REJECTION-PACKAGE (CORE-018) if any item
is absent or contains a bare placeholder:

| # | Artifact | Owner | Path (suggested or declared) | Status |
|---|----------|-------|------------------------------|--------|
| 1 | Migration SQL file | schema-builder | `apps/maturion-maturity-legacy/supabase/migrations/20260307000001_parse_tasks_table.sql` | ✅ Already committed on branch |
| 2 | BUILD_PROGRESS_TRACKER.md RCA update | foreman-v2 | `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` | 🟡 Pending |
| 3 | PREHANDOVER proof | schema-builder or foreman-v2 | `.agent-admin/prehandover/prehandover-proof-wave15-schemadrift-[date].md` (or equivalent named file on branch) | 🟡 Pending |
| 4 | Producer session memory | schema-builder | `.agent-workspace/schema-builder/memory/session-NNN-[date].md` | 🟡 Pending |
| 5 | `iaa_audit_token` pre-populated in PREHANDOVER proof | schema-builder or foreman-v2 | Field within artifact #3 | 🟡 Pending — must be in format `IAA-session-NNN-wave15-schemadrift-YYYYMMDD-PASS` |

> **Note**: The migration file (artifact #1) is already committed. Artifacts #2–#5 must be committed
> before IAA is invoked for Phase 1–4 assurance. IAA will not issue a provisional token on the basis
> of the migration alone.

---

## PREHANDOVER Proof — Required Fields

The PREHANDOVER proof committed by the producing agent must contain at minimum:

```
- pr_number: 971
- branch: copilot/add-migration-for-parse-tasks-table
- wave: wave15-schemadrift
- session: session-wave15-schemadrift-20260307
- tasks_delivered:
    - T-W15-SCH-001: apps/maturion-maturity-legacy/supabase/migrations/20260307000001_parse_tasks_table.sql
    - T-W15-SCH-002: modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md
- iaa_audit_token: IAA-session-NNN-wave15-schemadrift-YYYYMMDD-PASS
- cwt_gate_fixed: T-W13-SCH-11
- rls_policy_present: true
- org_isolation_chain: audit_id → audits.organisation_id → profiles.organisation_id
```

The `iaa_audit_token` field must NOT be blank, TBD, or PENDING. It must contain the expected token
reference in the format above. IAA will verify this field and cross-reference against its own token
file per CORE-019 (first-invocation exception applies on initial IAA run).

---

## Applicable Overlays

### BUILD_DELIVERABLE Overlay (applied to T-W15-SCH-001)

The following overlay checks from `iaa-category-overlays.md` apply in addition to core invariants:

| Overlay ID | Description | Relevance |
|------------|-------------|-----------|
| BD-001 | Scope delivered matches declared spec: all 6 columns, RLS enabled, SELECT policy with org-isolation | Migration must match this Pre-Brief's column and RLS spec exactly |
| BD-022 | Architecture alignment: RLS org-isolation pattern must match the pattern used by existing MAT tables (audits, criteria, evidence, etc.) — consistent `profiles.organisation_id` chain | Cross-table RLS consistency check |
| BD-RLS | RLS completeness: ENABLE ROW LEVEL SECURITY present; at least one policy present; no table left with RLS enabled but zero policies (which denies all access) | If RLS is enabled with no policy the table becomes read/write blocked for all users |

### Incidental Review (applied to T-W15-SCH-002)

No overlay formally applies to T-W15-SCH-002. IAA applies checks SCH-002-01 and SCH-002-02 (declared
above in the technical checks table) as the incidental consistency check. No additional ceremony.

---

## Adoption Phase Declaration

**Adoption phase at time of Pre-Brief**: PHASE_B_BLOCKING  
IAA verdicts for PR #971 are **hard-blocking**. REJECTION-PACKAGE prevents PR merge.
ASSURANCE-TOKEN is required before CS2 approves merge.

---

## Pre-Brief Status

| Item | Status |
|------|--------|
| Wave-current-tasks.md read | ✅ COMPLETE |
| Task classification complete | ✅ COMPLETE |
| Qualifying tasks declared (T-W15-SCH-001) | ✅ COMPLETE |
| Non-qualifying tasks documented (T-W15-SCH-002) | ✅ COMPLETE |
| Required evidence artifacts listed | ✅ COMPLETE |
| Technical checks enumerated (19 checks + 2 incidental) | ✅ COMPLETE |
| PREHANDOVER proof required fields declared | ✅ COMPLETE |
| Applicable overlays declared | ✅ COMPLETE |
| Adoption phase declared | ✅ COMPLETE |

**This Pre-Brief is now active.** No IAA invocation for PR #971 may proceed until artifacts #2–#5
listed in the Required Evidence Artifacts table above are committed to the branch.

---

*Generated by: independent-assurance-agent (Phase 0 — PRE-BRIEF mode)*  
*Authority: CS2 (Johan Ras / @APGI-cmy)*  
*Canon version: INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.3.0*  
*Pre-Brief protocol: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0*
