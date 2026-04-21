# MMM Wave B1 — Schema, RLS, and Migrations: Wave Evidence Artifact

## Wave Header

```
Wave Slug:         mmm-build-wave-b1-schema
Module:            MMM — Maturity Management Module
Builder:           schema-builder
Appointment Ref:   modules/MMM/10-builder-appointment/builder-contract.md §3.1
Architecture Ref:  modules/MMM/04-architecture/architecture.md §A5.2, §A5.3, §A5.4
Issue:             maturion-isms#1428
Branch:            copilot/mmm-stage-12-build-execution-evidence
Date Completed:    2026-04-20
IAA Pre-Brief:     .agent-admin/assurance/iaa-wave-record-mmm-stage12-build-execution-20260420.md
Status:            COMPLETE
```

---

## 1. Migration Files Committed

| File | Description | TR References |
|------|-------------|---------------|
| `supabase/migrations/20260420000001_mmm_core_tables.sql` | All 26 mmm_ tables, immutable triggers, updated_at triggers | TR-021, TR-022, TR-026, TR-028, TR-038 |
| `supabase/migrations/20260420000002_mmm_indexes.sql` | All 10 required + 11 supporting indexes | TR-046, TR-007 |
| `supabase/migrations/20260420000003_mmm_rls_policies.sql` | RLS enabled on all 26 tables + all policies | TR-031, TR-032 |
| `supabase/migrations/20260420000004_mmm_storage_buckets.sql` | mmm-evidence and mmm-framework-sources buckets | TR-022, TR-039 |

---

## 2. Tables Created (26 total — TR-022, TR-028)

All tables use the `mmm_` namespace prefix per TR-028 and architecture §A5.2.

| # | Table | Type | Notes |
|---|-------|------|-------|
| 1 | `mmm_organisations` | Core entity | Slug UNIQUE constraint |
| 2 | `mmm_frameworks` | Core entity | Status CHECK: DRAFT/REVIEW/PUBLISHED/ARCHIVED |
| 3 | `mmm_domains` | Core entity | org-scoped via framework chain |
| 4 | `mmm_maturity_process_steps` | Core entity | org-scoped via domain→framework chain |
| 5 | `mmm_criteria` | Core entity | org-scoped via mps chain |
| 6 | `mmm_level_descriptors` | Core entity | Level CHECK: BETWEEN 1 AND 5 |
| 7 | `mmm_assessments` | Core entity | org-scoped; FK to organisations + frameworks |
| 8 | `mmm_maturity_scores` | Core entity | service-role write only |
| 9 | `mmm_score_proposals` | Core entity | service-role write only |
| 10 | `mmm_evidence` | Core entity | Status CHECK: PENDING/ACCEPTED/REJECTED |
| 11 | `mmm_findings` | Core entity | org-scoped via assessment |
| 12 | `mmm_override_log` | IMMUTABLE | INSERT-only via service role; UPDATE/DELETE blocked by triggers |
| 13 | `mmm_audit_sessions` | Core entity | Status CHECK: ACTIVE/CLOSED |
| 14 | `mmm_audit_logs` | IMMUTABLE | INSERT-only via service role; UPDATE/DELETE blocked by triggers |
| 15 | `mmm_pit_exports` | Core entity | service-role write; PIT boundary |
| 16 | `mmm_parse_jobs` | Core entity | Status CHECK: PENDING/PROCESSING/COMPLETE/FAILED |
| 17 | `mmm_ai_interactions` | Telemetry/audit | service-role write; ADMIN read |
| 18 | `mmm_profiles` | Core entity | PK = auth.users.id |
| 19 | `mmm_user_preferences` | Core entity | user_id UNIQUE FK |
| 20 | `mmm_organisation_hierarchy` | Core entity | node_type CHECK: SITE/OPERATION/SUBSIDIARY |
| 21 | `mmm_free_assessments` | Core entity | Public access; session_token UNIQUE |
| 22 | `mmm_invitations` | Core entity | token UNIQUE; ADMIN-only write |
| 23 | `mmm_proposed_domains` | Core entity | source CHECK: AI/HUMAN |
| 24 | `mmm_proposed_mps` | Core entity | FK to mmm_proposed_domains |
| 25 | `mmm_proposed_criteria` | Core entity | FK to mmm_proposed_mps |
| 26 | `mmm_parse_ambiguities` | Core entity | FK to mmm_frameworks |

---

## 3. RLS Policies Applied (TR-031, TR-032)

RLS is **ENABLED on ALL 26 tables** per architecture §A5.3 mandate: "RLS is enabled on all MMM tables without exception."

### Policy Summary by Table Class

| Table Class | Tables | Policies |
|-------------|--------|----------|
| Organisation-scoped (direct) | mmm_organisations, mmm_frameworks, mmm_assessments, mmm_audit_sessions, mmm_pit_exports, mmm_invitations, mmm_organisation_hierarchy | SELECT/INSERT/UPDATE: own org via `mmm_current_user_org_id()` |
| Framework-chain scoped | mmm_domains, mmm_maturity_process_steps, mmm_criteria, mmm_level_descriptors, mmm_proposed_domains, mmm_proposed_mps, mmm_proposed_criteria, mmm_parse_ambiguities | SELECT/INSERT: org via framework→org join |
| Assessment-scoped | mmm_maturity_scores, mmm_score_proposals, mmm_evidence, mmm_findings | SELECT: org via assessment→org join; writes: service role only (scores/proposals) or authenticated (evidence/findings) |
| Self-scoped | mmm_profiles, mmm_user_preferences | SELECT/UPDATE: WHERE id = auth.uid() |
| Immutable audit | mmm_audit_logs, mmm_override_log | SELECT: authenticated; INSERT/UPDATE/DELETE: service role only (no RLS policy for writes) |
| AI telemetry | mmm_ai_interactions | SELECT: ADMIN/LEAD_AUDITOR only; writes: service role only |
| Public | mmm_free_assessments | INSERT/SELECT: anon + authenticated (session token) |
| Read-only public | mmm_parse_jobs | SELECT: authenticated |

### Helper Functions

- `public.mmm_current_user_org_id()` — returns caller's `organisation_id` from `mmm_profiles`
- `public.mmm_current_user_role()` — returns caller's `role` from `mmm_profiles`

---

## 4. Indexes Created (TR-046)

### 10 Required Indexes (architecture §A5.4)

| # | Index Name | Table | Columns | Type |
|---|-----------|-------|---------|------|
| 1 | `idx_mmm_evidence_assessment_criterion` | `mmm_evidence` | `(assessment_id, criterion_id)` | B-tree |
| 2 | `idx_mmm_maturity_scores_assessment_entity` | `mmm_maturity_scores` | `(assessment_id, entity_type, entity_id)` | B-tree |
| 3 | `idx_mmm_audit_logs_target_entity` | `mmm_audit_logs` | `(target_entity_type, target_entity_id)` | B-tree |
| 4 | `idx_mmm_audit_logs_created_at` | `mmm_audit_logs` | `(created_at)` | B-tree |
| 5 | `idx_mmm_frameworks_org_status` | `mmm_frameworks` | `(organisation_id, status)` | B-tree |
| 6 | `idx_mmm_criteria_mps_id` | `mmm_criteria` | `(mps_id)` | B-tree |
| 7 | `idx_mmm_parse_jobs_upload_status` | `mmm_parse_jobs` | `(upload_id, status)` | B-tree |
| 8 | `idx_mmm_pit_exports_org_status` | `mmm_pit_exports` | `(organisation_id, status)` | B-tree |
| 9 | `idx_mmm_score_proposals_assessment_criterion` | `mmm_score_proposals` | `(assessment_id, criterion_id)` | B-tree |
| 10 | `idx_mmm_ai_interactions_actor_created` | `mmm_ai_interactions` | `(actor_id, created_at)` | B-tree |

### 11 Supporting Indexes

Additional indexes for common query patterns: assessments by org, domains by framework, MPS by domain, findings by assessment, override log by assessment, invitations by org and token, proposed_domains by framework, parse_ambiguities by framework, level_descriptors by criterion, audit_sessions by org.

---

## 5. Immutable Audit Table Pattern (TR-038, TR-026)

Both `mmm_audit_logs` and `mmm_override_log` are protected by:

1. **BEFORE UPDATE trigger** — raises EXCEPTION, preventing any UPDATE
2. **BEFORE DELETE trigger** — raises EXCEPTION, preventing any DELETE
3. **No authenticated INSERT RLS policy** — service role bypass only for writes

Functions:
- `public.mmm_prevent_audit_log_update()` + trigger `mmm_audit_logs_no_update`
- `public.mmm_prevent_audit_log_delete()` + trigger `mmm_audit_logs_no_delete`
- `public.mmm_prevent_override_log_update()` + trigger `mmm_override_log_no_update`
- `public.mmm_prevent_override_log_delete()` + trigger `mmm_override_log_no_delete`

---

## 6. Storage Buckets

| Bucket | Access | Size Limit | Purpose |
|--------|--------|-----------|---------|
| `mmm-evidence` | Private (authenticated only) | 50MB | Evidence files (ISO 27001 7-year retention) |
| `mmm-framework-sources` | Private (authenticated only) | 100MB | Framework source docs + published snapshots |

Storage RLS policies: INSERT/SELECT/UPDATE/DELETE policies on `storage.objects` for each bucket, requiring `auth.uid() IS NOT NULL`.

---

## 7. Seed Data (`supabase/seed-mmm.sql`)

| Entity | Count | Notes |
|--------|-------|-------|
| `mmm_organisations` | 2 | Org Alpha (ACTIVE) + Org Beta (TRIAL) — cross-org isolation testing |
| `mmm_frameworks` | 2 | 1 PUBLISHED (Alpha), 1 DRAFT (Beta) |
| `mmm_domains` | 2 | Information Security Governance, Risk Management |
| `mmm_maturity_process_steps` | 6 | 3 per domain |
| `mmm_criteria` | 18 | 3 per MPS |
| `mmm_level_descriptors` | 8 | Level 1–5 for ISG-001-C001; level 1–3 for RM-001-C001 |
| `mmm_assessments` | 1 | IN_PROGRESS, linked to Org Alpha |
| `mmm_audit_sessions` | 1 | ACTIVE, linked to Org Alpha |

All inserts use deterministic UUIDs and `ON CONFLICT DO NOTHING` for idempotent re-runs.

---

## 8. D9/D10 Test Results

### Test Suite: `modules/MMM/tests/B1-schema/b1-schema.test.ts`

| Test ID | Test Name | Status |
|---------|-----------|--------|
| T-MMM-S6-139 | Migration files exist (4 files) | ✅ GREEN |
| T-MMM-S6-140 | NBR-005: All tables use mmm_ prefix | ✅ GREEN |
| T-MMM-S6-141 | All 26 required tables defined in migration SQL | ✅ GREEN |
| T-MMM-S6-142 | RLS enabled on all 26 tables | ✅ GREEN |
| T-MMM-S6-143 | RLS SELECT policies for org-scoped tables | ✅ GREEN |
| T-MMM-S6-144 | mmm_profiles: own-profile access only | ✅ GREEN |
| T-MMM-S6-145 | mmm_free_assessments: public access | ✅ GREEN |
| T-MMM-S6-146 | Immutable mmm_audit_logs (triggers + no auth write) | ✅ GREEN |
| T-MMM-S6-147 | Immutable mmm_override_log (triggers + no auth write) | ✅ GREEN |
| T-MMM-S6-148 | NBR-002: Cross-org isolation via helper functions | ✅ GREEN |
| T-MMM-S6-149 | USING + WITH CHECK on write policies | ✅ GREEN |
| T-MMM-S6-150 | All 10 TR-046 required indexes present | ✅ GREEN |
| T-MMM-S6-151 | Column definitions: mandatory columns + CHECK constraints | ✅ GREEN |
| T-MMM-S6-152 | Seed data: 2 orgs, PUBLISHED framework, domains, MPS, criteria | ✅ GREEN |
| T-MMM-S6-153 | Frontend Deployment: vercel.json + package.json present | ✅ GREEN |
| T-MMM-S6-154 | Backend Deployment: supabase config + ≥4 mmm migrations | ✅ GREEN |
| T-MMM-S6-155 | Storage buckets: mmm-evidence + mmm-framework-sources | ✅ GREEN |
| T-MMM-S6-156 | TR-028: No tables outside mmm_ namespace | ✅ GREEN |
| T-MMM-S6-157 | Foreign keys stay within mmm_ namespace (§A11) | ✅ GREEN |
| T-MMM-S6-158 | Idempotency: CREATE IF NOT EXISTS everywhere | ✅ GREEN |
| T-MMM-S6-159 | updated_at auto-trigger on mutable tables | ✅ GREEN |
| T-MMM-S6-160 | mmm_score_proposals: service-role-only write | ✅ GREEN |
| T-MMM-S6-161 | mmm_maturity_scores: service-role-only write | ✅ GREEN |
| T-MMM-S6-162 | mmm_ai_interactions: admin-only read, service-role write | ✅ GREEN |
| T-MMM-S6-163 | Seed data: ON CONFLICT DO NOTHING idempotency | ✅ GREEN |
| T-MMM-S6-164 | Wave B1 evidence artifact present and valid | ✅ GREEN |

**Total: 26 tests GREEN, 0 FAILING, 0 SKIPPED.**

---

## 9. NBR-002 Compliance Statement

**NBR-002 — Supabase RLS Write-Block Detection**:

The following RLS patterns enforce HTTP 403 / policy violation on cross-org write attempts:

1. **WITH CHECK on all INSERT/UPDATE policies** — Any insert or update where `organisation_id ≠ mmm_current_user_org_id()` will be blocked by Supabase with a policy violation (HTTP 403 at the API layer).

2. **No authenticated INSERT policy on immutable tables** (`mmm_audit_logs`, `mmm_override_log`, `mmm_maturity_scores`, `mmm_score_proposals`, `mmm_ai_interactions`, `mmm_pit_exports`) — Any attempt by an authenticated user to write directly to these tables returns HTTP 403.

3. **Framework chain RLS** — Attempting to insert a domain, MPS, or criterion under a framework belonging to another org is blocked at the `WITH CHECK` level.

4. **Test coverage**: T-MMM-S6-148 and T-MMM-S6-149 verify the structural presence of USING + WITH CHECK patterns that enforce 403 denial. Live 403 verification is propagated to api-builder (B2) per NBR-002 carry-forward obligation.

---

## 10. NBR-005 Compliance Statement

**NBR-005 — Schema Column Mismatch / Silent Try/Catch**:

1. All 26 table definitions exactly match architecture §A5.2 mandatory column lists.
2. All CHECK constraints are explicitly declared (status enums, level bounds, node_type, source).
3. No implicit type coercion — all columns use explicit PostgreSQL types (uuid, text, integer, numeric, timestamptz, jsonb, boolean, uuid[]).
4. Foreign key cascade behaviour is explicitly declared (ON DELETE CASCADE where appropriate).
5. Immutable table triggers raise EXCEPTION (not RETURN NULL) — no silent swallowing.
6. Migration files do not use try/catch patterns — SQL DDL errors will surface immediately.
7. `ON CONFLICT DO NOTHING` in seed data is explicit, not silent — only applies to duplicate inserts, not schema errors.

---

## 11. Governance Compliance

| Requirement | Status | Evidence |
|-------------|--------|---------|
| TR-028: mmm_ prefix on all 26 tables | ✅ COMPLIANT | All table names verified in test T-MMM-S6-140/156 |
| TR-031: RLS enabled on all tables | ✅ COMPLIANT | ALTER TABLE ... ENABLE ROW LEVEL SECURITY for all 26 |
| TR-032: Cross-org isolation guarantee | ✅ COMPLIANT | mmm_current_user_org_id() used in all org-scoped policies |
| TR-038: Audit log immutability | ✅ COMPLIANT | BEFORE UPDATE/DELETE triggers + no authenticated write policies |
| TR-046: 10 required indexes | ✅ COMPLIANT | All 10 indexes created as IF NOT EXISTS |
| TR-022: Core entity schema | ✅ COMPLIANT | All 26 entities with mandatory columns per §A5.2 |
| Architecture §A11: No external FKs | ✅ COMPLIANT | All FKs within mmm_ namespace |
| Architecture §A5.3: Free assessment public | ✅ COMPLIANT | anon role INSERT/SELECT policy |
| Builder contract §3.1: No Edge Functions | ✅ COMPLIANT | No Edge Function code in B1 |
| CG-002: No AIMC/PIT schema embedded | ✅ COMPLIANT | Only boundary ID references (pit_task_id as text) |

---

## 12. Wave B1 Closure Declaration

**WAVE B1 — mmm-build-wave-b1-schema — COMPLETE**

All closure conditions satisfied:

- [x] **26 mmm_ tables** created in migration SQL
- [x] **RLS enabled and policies applied** for all 26 tables
- [x] **All 10 required indexes** created (+ 11 supporting indexes)
- [x] **Storage buckets** configured (mmm-evidence + mmm-framework-sources)
- [x] **Seed data** committed (`supabase/seed-mmm.sql`)
- [x] **D9/D10 test subset GREEN** (26 tests: T-MMM-S6-139 to T-MMM-S6-164, all passing)
- [x] **NBR-002 RLS write-block verification** present in policies and tests
- [x] **NBR-005 column-level compliance** verified
- [x] **Wave evidence artifact** committed (`modules/MMM/11-build/B1-schema/wave-b1-evidence.md`)

This wave is ready for Foreman QA review and IAA handover invocation.

---

*Wave B1 Evidence Artifact v1.0.0 — schema-builder — 2026-04-20*
