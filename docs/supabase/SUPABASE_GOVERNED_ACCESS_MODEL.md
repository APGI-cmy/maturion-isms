# Supabase Governed Access Model

**Issue**: maturion-isms#1505
**Wave**: governed-supabase-access-model
**Branch**: copilot/add-supabase-migration-verification-model
**Date**: 2026-04-28
**Version**: 1.0.0
**Status**: ACTIVE — effective from wave governed-supabase-access-model

---

## 1. Overview

This document defines the two-path governed Supabase access model for the
Maturion ISMS repository. It addresses the need for agents to verify live
Supabase state without being granted unrestricted production credentials.

### 1.1 The Two-Path Model

| Path | Purpose | Who can trigger | Credential type |
|------|---------|-----------------|-----------------|
| **Mutation path** | Apply schema/data migrations | CS2 only, via approved workflow | `SUPABASE_ACCESS_TOKEN` (privileged, in approved workflow only) |
| **Verification path** | Read-only live-state checks | Agents + CS2, via `verify-supabase-readonly.yml` | `SUPABASE_ACCESS_TOKEN` (scoped to allowlisted read-only RPCs by workflow design) |

These paths are **separate by design**. Agents must not attempt to use
the mutation path directly. The mutation path workflows contain explicit
branch and confirmation guards that prevent agent misuse.

### 1.2 Guiding Principle

The repository is the single source of truth for all Supabase schema
objects. No agent, developer, or CS2 operator makes direct database
changes outside the approved workflows documented here.

---

## 2. Mutation Path — Schema/Data Migration

### 2.1 How it works

Agents propose schema changes by committing SQL migration files under
`supabase/migrations/`. The files follow the existing naming convention:

```
YYYYMMDDNNNNNN_<description>.sql
```

Schema changes are **not** applied by agents. The deployment sequence is:

```
1. Agent commits migration file(s) to a PR branch
2. PR opened — IAA review gate runs
3. IAA PASS — CS2 reviews and approves the PR
4. CS2 merges the PR to main
5. CS2 triggers: Deploy MMM Supabase Migrations workflow
   (.github/workflows/deploy-mmm-supabase-migrations.yml)
6. The workflow applies the migration via the Supabase Management API
7. Schema-verification job confirms required tables/schema objects exist
```

### 2.2 Security constraints for the mutation path

- Only `deploy-mmm-supabase-migrations.yml` may apply migrations.
- The workflow requires `CONFIRM` input before any DB mutation step runs.
- It targets `main` branch only — no PR preview or push trigger.
- It runs under the `production` GitHub environment, which may require
  CS2 approval gate before execution.
- `SUPABASE_ACCESS_TOKEN` is stored only in the GitHub/Supabase secret
  store and is never committed to the repository.

### 2.3 What agents must NOT do

- Agents must not call the Supabase Management API mutation endpoint
  (`/database/query`) with DDL or DML directly from scripts or chat.
- Agents must not connect directly to the Postgres database via psql
  or any direct TCP connection.
- Agents must not apply migrations outside the approved PR + IAA + CS2
  workflow.

---

## 3. Read-Only Verification Path

### 3.1 Purpose

Agents can verify live Supabase state through a governed set of
`SECURITY DEFINER` RPCs in the `governance_readonly` schema. These RPCs:

- Perform SELECT-only operations on approved tables
- Return sanitized metadata (no file contents, no embeddings, no PII)
- Log every invocation to `governance_readonly.verification_log`
- Are gated behind the allowlist in `verify-supabase-readonly.yml`

### 3.2 Available verification targets

| Target | RPC called | What it verifies |
|--------|-----------|-----------------|
| `mps_source_pack` | `governance_readonly.verify_mps_source_pack_status()` | Full MPS source-pack status (consolidated JSON) |
| `mps_count` | `governance_readonly.count_mmm_mps_records()` | Count of `mmm_maturity_process_steps` records |
| `criteria_count` | `governance_readonly.count_mmm_criteria_records()` | Count of `mmm_criteria` records |
| `framework_docs` | `governance_readonly.list_mmm_framework_source_documents()` | Storage object metadata in `mmm-framework-sources` bucket |
| `ai_knowledge` | `governance_readonly.search_ai_knowledge_mps_sources()` | `ai_knowledge` records related to MPS content |

### 3.3 How to trigger verification (agents)

Agents cannot trigger GitHub Actions workflows directly from within a
code session. The correct process for agents is:

1. Cite the verification workflow in the PR description or PREHANDOVER
   proof, requesting CS2 to trigger it.
2. CS2 triggers `verify-supabase-readonly.yml` via `workflow_dispatch`.
3. The workflow produces a GitHub Step Summary with sanitized output.
4. The Step Summary URL or content is cited in the PR / PREHANDOVER / IAA
   record as durable evidence.

Agents may also reference prior Step Summary outputs from previous
workflow runs as evidence, provided the run is recent (within 24 hours)
and the commit SHA matches.

### 3.4 How to trigger verification (CS2 / operators)

```
GitHub → Actions → Verify Supabase Read-Only State → Run workflow
  verification_target: mps_source_pack
  caller_id: foreman-v2-agent (or your identifier)
```

The workflow will publish a durable Step Summary with the verification
result and a citation reference for governance records.

### 3.5 Security constraints for the verification path

- **No writes to business tables**: Verification RPCs perform SELECT-only
  operations on all business tables. The only write present is an INSERT
  into `governance_readonly.verification_log` via the `SECURITY DEFINER`
  audit helper `log_verification_call` — this is the intentional audit exception.
- **No DDL**: No CREATE/ALTER/DROP in any verification RPC.
- **No storage mutation**: No INSERT into `storage.objects` or `storage.buckets`.
- **No service-role bypass**: RPCs use `SET search_path` to prevent
  schema injection. `EXECUTE` is explicitly REVOKED from PUBLIC and
  granted to `service_role` only.
- **No full content**: `search_ai_knowledge_mps_sources` returns at
  most 200-character content snippets.
- **No embeddings**: No vector data is returned by any RPC.
- **Audit logged**: Every verification RPC logs its invocation to
  `governance_readonly.verification_log` via the `SECURITY DEFINER` helper
  `log_verification_call`. Each RPC accepts a `p_caller text DEFAULT 'unknown'`
  parameter so the workflow can record the caller identity.
- **Allowlist enforced by workflow**: `verify-supabase-readonly.yml`
  contains an explicit `case` allowlist — no arbitrary SQL can be
  executed through this workflow.
- **Environment gate**: The `verify-readonly` job runs under the
  `production` GitHub environment. `SUPABASE_ACCESS_TOKEN` is only
  exposed after the environment protection rules (CS2-approval gate)
  are satisfied — it is never available to arbitrary `workflow_dispatch`
  runs without prior approval.

### 3.6 Interim credential model notice

> ⚠️ **This is an interim workflow-restricted access model, not true
> credential-level read-only access.**

The `verify-supabase-readonly.yml` workflow uses `SUPABASE_ACCESS_TOKEN`
(Supabase Management API). The workflow enforces an allowlist of
`governance_readonly.*` RPCs, but the underlying credential is capable
of broader database operations if used outside this workflow.

The `production` environment gate (CS2 approval) is the primary guard
against unauthorised credential use. A genuinely credential-level
read-only path (dedicated read-only Postgres role or PostgREST JWT with
read-only grants) is a future improvement tracked in maturion-isms#1505.

---

## 4. MPS Source-Pack Verification (maturion-isms#1501)

The `mps_source_pack` target produces a JSON object with the following
fields, suitable for direct citation in Foreman/IAA evidence:

```json
{
  "mps_source_documents_found": true,
  "source_document_count": 25,
  "mps_record_count": 25,
  "criteria_record_count": 125,
  "canonical_domains_found": 5,
  "all_25_mps_represented": true,
  "ai_knowledge_mps_records": 75,
  "ai_knowledge_approved_count": 75,
  "diamond_specific_ldcs_detected": false,
  "content_classification": "generic",
  "retrievable_by_mmm_aimc": true,
  "approval_status": "approved",
  "checked_at": "2026-04-28T12:00:00Z"
}
```

`content_classification` values:

| Value | Meaning |
|-------|---------|
| `generic` | Generic MPS evidence exists and no diamond-specific LDCS indicator detected |
| `not_found` | No storage documents, no MPS records, and no `ai_knowledge` MPS records — content is absent |
| `mixed_or_diamond_specific` | Diamond-specific LDCS indicator detected in `ai_knowledge` content |

### 4.1 Interpreting the result

| Field | Expected for generic MPS pack | Action if unexpected |
|-------|-------------------------------|----------------------|
| `mps_source_documents_found` | `true` | Upload source documents to `mmm-framework-sources` bucket |
| `source_document_count` | ≥ 1 (ideally 25 for one doc per MPS) | Upload missing documents |
| `mps_record_count` | ≥ 25 | Run migration to seed generic MPS data |
| `criteria_record_count` | ≥ 125 (5 criteria × 25 MPS) | Run migration to seed generic criteria data |
| `canonical_domains_found` | 5 | Verify domain seeding migration |
| `all_25_mps_represented` | `true` | Seed missing MPS records |
| `diamond_specific_ldcs_detected` | `false` | Review and reclassify LDCS-specific content |
| `content_classification` | `"generic"` | `"not_found"`: no source content exists — upload source docs and seed MPS data; `"mixed_or_diamond_specific"`: remove LDCS-specific content from `ai_knowledge` |
| `approval_status` | `"approved"` | Approve pending `ai_knowledge` records via MAT workflow |
| `retrievable_by_mmm_aimc` | `true` | Upload content to `ai_knowledge` via AIMC pipeline |

### 4.2 When CS2 action is required vs. agent self-service

| Scenario | Agent can act | CS2 action required |
|----------|--------------|---------------------|
| Check if MPS source pack exists | ✅ Trigger `verify-supabase-readonly.yml` | Not required |
| Count MPS records | ✅ Trigger `verify-supabase-readonly.yml` | Not required |
| Count criteria records | ✅ Trigger `verify-supabase-readonly.yml` | Not required |
| Check storage document metadata | ✅ Trigger `verify-supabase-readonly.yml` | Not required |
| Apply a new migration | ❌ Agents propose via PR only | CS2 runs `deploy-mmm-supabase-migrations.yml` |
| Upload source documents to storage | ❌ Not via agent workflow | CS2 uploads via Supabase dashboard or Edge Function |
| Approve `ai_knowledge` records | ❌ Requires MAT admin workflow | CS2/operator approves via MAT approval UI |
| Modify RLS policies | ❌ Via migration PR only | CS2 applies migration |
| Add new verification RPCs | ❌ Via migration PR only | CS2 applies migration |

---

## 5. Schema: governance_readonly

The `governance_readonly` schema is created by migration
`supabase/migrations/20260428000001_mmm_governance_readonly.sql`.

### 5.1 Objects

| Object | Type | Purpose |
|--------|------|---------|
| `governance_readonly` | Schema | Namespace for all governed verification objects |
| `governance_readonly.verification_log` | Table | Append-only audit log for verification calls |
| `governance_readonly.log_verification_call(text, text)` | Function (SECURITY DEFINER) | Internal audit logger — called by verification RPCs |
| `governance_readonly.verify_mps_source_pack_status(text)` | Function (SECURITY DEFINER) | Consolidated MPS source-pack check |
| `governance_readonly.list_mmm_framework_source_documents(text, text)` | Function (SECURITY DEFINER) | Lists storage object metadata |
| `governance_readonly.count_mmm_mps_records(uuid, text)` | Function (SECURITY DEFINER) | Counts MPS records |
| `governance_readonly.count_mmm_criteria_records(uuid, text)` | Function (SECURITY DEFINER) | Counts criteria records |
| `governance_readonly.search_ai_knowledge_mps_sources(text, text)` | Function (SECURITY DEFINER) | Searches `ai_knowledge` with content snippet only |

### 5.2 Grants

```sql
GRANT USAGE ON SCHEMA governance_readonly TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.verify_mps_source_pack_status(text)          TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.list_mmm_framework_source_documents(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.count_mmm_mps_records(uuid, text)            TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.count_mmm_criteria_records(uuid, text)       TO service_role;
GRANT EXECUTE ON FUNCTION governance_readonly.search_ai_knowledge_mps_sources(text, text)  TO service_role;
```

No direct SELECT grants are made on base tables through this schema.
For these governed RPCs, the effective safety boundary is the allowlisted
`SECURITY DEFINER` function surface and the sanitised, purpose-limited data
those functions return; this path must not be treated as relying on base-table
RLS for read restriction when executed by `service_role`.

---

## 6. Adding New Verification Capabilities

To add a new governed verification target:

1. Add a new SECURITY DEFINER function to the `governance_readonly` schema
   in a new migration file (e.g., `20260428000002_mmm_governance_readonly_ext.sql`).
2. Ensure the function performs SELECT-only operations.
3. Grant EXECUTE to `service_role`.
4. Add the new target to the `case` allowlist in
   `.github/workflows/verify-supabase-readonly.yml`.
5. Update this document with the new target.
6. Open a PR, IAA review, CS2 merge, and apply the migration as usual.

New verification targets must not:
- Accept arbitrary SQL as input (no dynamic SQL from caller-supplied strings
  without strict validation)
- Return file contents, full embeddings, or PII
- Perform writes, DDL, or storage mutations

---

## 7. Related Documents and Issues

- `supabase/migrations/20260428000001_mmm_governance_readonly.sql` — migration
- `.github/workflows/verify-supabase-readonly.yml` — verification workflow
- `.github/workflows/deploy-mmm-supabase-migrations.yml` — mutation workflow
- `docs/supabase/MMM_SUPABASE_OPERATING_PROCEDURE.md` — general Supabase operating procedure
- `maturion-isms#1505` — this issue
- `maturion-isms#1501` — MPS source-pack verification (primary use case)
- `maturion-isms#1502` — Track A migration-gap analysis (context)
