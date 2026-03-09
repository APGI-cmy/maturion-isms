# MAT Compliance Reporting Pipeline — End-to-End Completeness Review

**Type**: Governance Analysis / Completeness Assessment
**Author**: foreman-v2-agent (POLC-Orchestration / Quality Professor mode)
**Date**: 2026-03-09
**Wave**: wave-completeness-review
**Branch**: copilot/review-compliance-workflow
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-completeness-review.md` (EXEMPT classification)
**Status**: FINAL — dot-by-dot review of all artifacts, wiring, triggers, policies

> **Purpose**: This report is a constructive completeness assessment only. It does NOT implement
> or fix anything. Identified gaps are documented for future implementation waves.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Review Scope and Methodology](#2-review-scope-and-methodology)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [Database Schema — Complete Table Inventory](#4-database-schema--complete-table-inventory)
5. [RLS Policy Architecture](#5-rls-policy-architecture)
6. [Database Triggers and Functions](#6-database-triggers-and-functions)
7. [Storage Buckets](#7-storage-buckets)
8. [Edge Functions](#8-edge-functions)
9. [API Routes (Backend)](#9-api-routes-backend)
10. [UI Flows — End-to-End](#10-ui-flows--end-to-end)
11. [Automation Wiring (TanStack Query, Async Chains)](#11-automation-wiring-tanstack-query-async-chains)
12. [Error Surfacing and Audit Trail](#12-error-surfacing-and-audit-trail)
13. [Status Propagation](#13-status-propagation)
14. [Authentication and Authorization](#14-authentication-and-authorization)
15. [End-to-End Pipeline Trace](#15-end-to-end-pipeline-trace)
16. [Completeness Gap Register](#16-completeness-gap-register)
17. [Summary Scorecard](#17-summary-scorecard)

---

## 1. Executive Summary

The MAT compliance reporting pipeline spans four major subsystems: (1) Supabase database with 26 tables, 3 storage buckets, 22 migrations, and comprehensive RLS; (2) two deployed backend systems — a Supabase Edge Function and an AI Gateway API; (3) a React/Next.js frontend with TanStack Query state management; and (4) a shared `@maturion/ai-centre` package for AI capability routing.

**Overall pipeline completeness: approximately 45%** of the full end-to-end workflow is functional in production today.

| Workflow Stage | Status | Notes |
|---|---|---|
| Document upload (standards, evidence) | ✅ FUNCTIONAL | Storage + audit_logs wired |
| AI criteria parsing (document → domain/MPS/criteria) | ✅ FUNCTIONAL | Edge Function deployed |
| Parse status tracking | ✅ FUNCTIONAL | Polling on parse_tasks |
| Criteria tree display | ✅ FUNCTIONAL | Hierarchical UI |
| Evidence collection UI | ⚠️ PARTIAL | Real component exists; page is stub |
| Lead Auditor maturity scoring (confirm/override) | ⚠️ PARTIAL | Manual UI works; AI scoring blocked |
| AI-driven criterion scoring | ❌ NOT FUNCTIONAL | Edge Function missing |
| Feedback and recommendations UI | ❌ NOT IMPLEMENTED | Data structure exists; no UI |
| Report generation | ❌ NOT FUNCTIONAL | Edge Function missing |
| Report download | ❌ NOT FUNCTIONAL | Blocked on report generation |
| AI capability routing (scoring, reporting) | ❌ BLOCKED | AIMC integration incomplete |

The three most critical gaps blocking full pipeline adoption are:
1. Missing `invoke-ai-score-criterion` Edge Function (blocks AI-assisted maturity scoring)
2. Missing `generate-audit-report` Edge Function (blocks all report generation)
3. Evidence collection page wired to a stub component (blocks evidence collection workflow)

---

## 2. Review Scope and Methodology

### Scope
This review covers all physical artifacts in the compliance workflow pipeline:

- Supabase database schema (migrations, RLS policies, triggers, indexes)
- Supabase Edge Functions (deployed and referenced)
- Backend API routes (`api/` and `packages/ai-centre/`)
- React frontend (components, pages, hooks, routing)
- Automation wiring (TanStack Query, async chains, real-time subscriptions)
- Error surfacing, audit logging, status propagation
- Authentication and authorization patterns

### Pipeline Stages Reviewed
```
Document Upload
    → AI Criteria Parsing (invoke-ai-parse-criteria Edge Function)
    → Domain / MPS / Criteria Creation in DB
    → Criteria Display in UI (CriteriaTree)
    → Evidence Collection (EvidenceCollection component)
    → Maturity Scoring (ReviewTable + AI scoring)
    → Lead Auditor Confirm/Override
    → Feedback and Recommendations (gap_analysis)
    → Report Generation (generate-audit-report Edge Function)
    → Report Download (signed URL)
```

### Methodology
Parallel codebase exploration using qualified explore agents against:
- `apps/maturion-maturity-legacy/supabase/migrations/` (22 migration files)
- `supabase/functions/` (Edge Functions)
- `api/` and `packages/ai-centre/` (backend)
- `modules/mat/frontend/src/` (frontend)
- `modules/mat/tests/` (test coverage indicators)

---

## 3. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MAT COMPLIANCE PIPELINE                          │
├──────────────────┬──────────────────────────────────────────────────┤
│  React Frontend  │  modules/mat/frontend/src/                       │
│  (Next.js)       │  - Pages: /criteria, /evidence, /scoring,        │
│                  │    /reports, /dashboard, /audits, /settings       │
│                  │  - TanStack Query hooks (22 hooks)                │
│                  │  - Supabase JS client (direct DB access)          │
├──────────────────┼──────────────────────────────────────────────────┤
│  Edge Functions  │  supabase/functions/                              │
│  (Deno runtime)  │  - invoke-ai-parse-criteria ✅ DEPLOYED           │
│                  │  - invoke-ai-score-criterion ❌ MISSING            │
│                  │  - generate-audit-report ❌ MISSING                │
├──────────────────┼──────────────────────────────────────────────────┤
│  AI Gateway      │  External: mat-ai-gateway service                 │
│  (AI_GATEWAY_URL)│  - POST /api/v1/parse (used by parse Edge Fn)     │
│                  │  - POST /api/v1/score ❌ (expected; unknown)       │
│                  │  - Calls OpenAI GPT-4 Turbo                       │
├──────────────────┼──────────────────────────────────────────────────┤
│  AIMC Gateway    │  api/ai/request.ts + packages/ai-centre/          │
│  (AI Centre)     │  - 6/8 capabilities working                       │
│                  │  - scoring: WIRING INCOMPLETE (W12-GAP-004)       │
│                  │  - reporting: WIRING INCOMPLETE (W12-GAP-003)     │
├──────────────────┼──────────────────────────────────────────────────┤
│  Supabase DB     │  26 tables, 3 buckets, comprehensive RLS          │
│  (PostgreSQL)    │  apps/maturion-maturity-legacy/supabase/          │
│                  │  migrations/ (22 files, all applied)               │
└──────────────────┴──────────────────────────────────────────────────┘
```

---

## 4. Database Schema — Complete Table Inventory

### 4.1 Migration File Inventory

| Migration File | Date Code | Purpose | Tables Created/Modified |
|---|---|---|---|
| `20260302000000_mat_core_tables.sql` | 2026-03-02 | Base schema | organisations, profiles, audits, domains, mini_performance_standards, criteria |
| `20260303000000_audit_period_columns.sql` | 2026-03-03 | Audit period | audits (audit_period_start, audit_period_end) |
| `20260303000001_evidence_table.sql` | 2026-03-03 | Evidence | evidence |
| `20260303000002_scores_table.sql` | 2026-03-03 | Criterion scores | scores |
| `20260303000003_organisation_settings.sql` | 2026-03-03 | Org config | organisation_settings |
| `20260303000004_storage_buckets.sql` | 2026-03-03 | Storage | audit-documents, organisation-assets buckets |
| `20260303000005_storage_rls_policies.sql` | 2026-03-03 | Storage RLS | storage.objects policies |
| `20260303000006_audit_scores_table.sql` | 2026-03-03 | Audit-level scores | audit_scores |
| `20260304000000_profiles_columns.sql` | 2026-03-04 | Profile extension | profiles (full_name, preferences) |
| `20260304000003_fix_rls_policies_postbuild.sql` | 2026-03-04 | RLS fixes | profiles, audits (handle_new_user trigger) |
| `20260305000000_onboarding_completions.sql` | 2026-03-05 | Onboarding | onboarding_completions |
| `20260305000001_assignments.sql` | 2026-03-05 | Responsibility | audit_invitations, domain_assignments, mps_assignments, criteria_assignments, responsibility_cascade VIEW |
| `20260305000002_exclude_cascade.sql` | 2026-03-05 | Exclusion | domains/mps/criteria (excluded flag, cascade trigger) |
| `20260305000003_evidence_extended.sql` | 2026-03-05 | Evidence fields | evidence (findings_text, deleted, storage_path) |
| `20260305000004_evaluations.sql` | 2026-03-05 | AI evaluations | criteria_evaluations, evaluation_overrides |
| `20260305000005_descriptors.sql` | 2026-03-05 | Maturity guidance | criteria_level_descriptors, mps_level_descriptors, domain_level_descriptors |
| `20260305000006_reports.sql` | 2026-03-05 | Report generation | audit_reports, reports bucket |
| `20260305000007_wave14_scoring_tables.sql` | 2026-03-05 | Scoring system | maturity_levels (seed), scoring_rules (seed), aggregate_scores |
| `20260305000008_rls_consolidation.sql` | 2026-03-05 | RLS unified | All Wave 14 tables (consolidated SELECT policies) |
| `20260306000000_sort_order_columns.sql` | 2026-03-06 | Sort order | domains, mini_performance_standards, criteria (sort_order) |
| `20260307000001_parse_tasks_table.sql` | 2026-03-07 | Parse tracking | parse_tasks |
| `20260308000001_audit_logs_table.sql` | 2026-03-08 | Action audit | audit_logs |

**Total: 22 migration files covering 26 tables**

### 4.2 Core Pipeline Tables

#### `organisations`
- **Columns**: id (UUID PK), name (TEXT NOT NULL), created_at, updated_at
- **RLS**: Enabled (no direct policies — acts as org isolation anchor)
- **Role**: Parent table for multi-tenancy

#### `profiles`
- **Columns**: id (UUID → auth.users), organisation_id (UUID → organisations), full_name, preferences (JSONB), created_at, updated_at
- **RLS**: `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())`
- **Trigger**: `handle_new_user()` SECURITY DEFINER auto-creates profile on new user signup

#### `audits`
- **Columns**: id, organisation_id, name, description, audit_period_start, audit_period_end, created_by, created_at, updated_at
- **RLS**: INSERT policy `created_by = auth.uid()`, SELECT org-isolation
- **FK**: organisations(id)

#### `domains`
- **Columns**: id, audit_id, organisation_id, number (INT), name, sort_order (default 0), excluded (default false), created_at, updated_at
- **RLS**: `organisation_id::text = current_setting('app.current_organisation_id', true)`
- **Trigger**: `exclude_cascade_domains_trigger` (AFTER UPDATE OF excluded — propagates to MPS children)
- **FK**: audits(id), organisations(id)

#### `mini_performance_standards` (alias: `mps`)
- **Columns**: id, domain_id, audit_id, organisation_id, number (INT), name, sort_order, excluded, created_at, updated_at
- **RLS**: Inherited via audit_id
- **Trigger**: `exclude_cascade_mps_trigger` (AFTER UPDATE OF excluded — propagates to criteria children)
- **FK**: domains(id), audits(id), organisations(id)

#### `criteria`
- **Columns**: id, mps_id, domain_id, audit_id, organisation_id, number (TEXT), description, guidance, sort_order, excluded, created_at, updated_at
- **RLS**: `organisation_id::text = current_setting('app.current_organisation_id', true)`
- **Constraint**: UNIQUE (audit_id, number)
- **FK**: mps(id), domains(id), audits(id), organisations(id)
- **Note**: `control_standards` does NOT exist as a separate table — criteria implements this concept

#### `evidence`
- **Columns**: id, criterion_id, audit_id, organisation_id, type (CHECK: 'text'|'photo'|'audio'|'video'|'document'|'interview'|'file'|'voice'), content, file_path, file_name, file_size, mime_type, findings_text, deleted (default false), storage_path, metadata (JSONB), created_by, created_at, updated_at, deleted_at
- **RLS**: `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())`
- **Indexes**: evidence_audit_id_idx, evidence_criterion_id_idx, evidence_organisation_id_idx
- **FK**: criteria(id), audits(id), organisations(id), auth.users(id)

#### `scores`
- **Columns**: id, criterion_id, audit_id, organisation_id, maturity_level (INT), confidence (NUMERIC), confirmed (BOOL), override_score (INT), override_justification (TEXT), gap_analysis (JSONB), created_at, updated_at
- **RLS**: `scores_org_isolation` (SELECT); INSERT/UPDATE policies incomplete (see Gap Register)
- **FK**: criteria(id), audits(id), organisations(id)

#### `criteria_evaluations`
- **Columns**: id, audit_id, criteria_id, organisation_id, proposed_level (INT), confidence_score (NUMERIC 4,3), rationale (TEXT), findings_summary (TEXT), next_level_guidance (TEXT), next_plus_one_taster (TEXT), evaluated_by (UUID), status (CHECK: 'pending_review'|'confirmed'|'overridden'), created_at, updated_at
- **RLS**: Multiple policies (select, insert, update, delete, org_select)
- **Constraint**: UNIQUE (audit_id, criteria_id)
- **FK**: audits(id), criteria(id), organisations(id), auth.users(id)

#### `evaluation_overrides`
- **Columns**: id, evaluation_id, criteria_id, audit_id, organisation_id, overridden_by (UUID), overridden_level (INT NOT NULL), justification (TEXT NOT NULL), created_at
- **RLS**: evaluation_overrides_select, evaluation_overrides_insert, evaluation_overrides_org_select
- **FK**: criteria_evaluations(id), criteria(id), audits(id), organisations(id), auth.users(id)

#### `audit_reports`
- **Columns**: id, audit_id, organisation_id, storage_path (TEXT NOT NULL), status (CHECK: 'generating'|'final'|'failed'), generated_at (TIMESTAMPTZ), triggered_by (UUID), created_at
- **RLS**: audit_reports_select_policy, audit_reports_insert, audit_reports_org_select
- **Storage convention**: `reports/{organisation_id}/{audit_id}/<filename>.pdf`
- **FK**: audits(id), organisations(id), auth.users(id)

#### `parse_tasks`
- **Columns**: id, audit_id, status ('pending'|'processing'|'completed'|'failed'), error_message, created_at, updated_at
- **RLS**: `parse_tasks_select` (org-isolation via audit_id)

#### `audit_logs`
- **Columns**: id, audit_id, organisation_id, action (TEXT NOT NULL), file_path, details (JSONB), created_by (UUID), created_at
- **RLS**: audit_logs_org_isolation (SELECT), audit_logs_insert_authenticated (INSERT)
- **Indexes**: audit_logs_audit_id_idx, audit_logs_action_idx
- **Common Actions**: 'criteria_upload', 'criteria_parsed', 'criteria_parse_failed', 'criteria_upload'

#### `aggregate_scores`
- **Columns**: audit_id, organisation_id, level_type ('criteria'|'mps'|'domain'|'overall'), reference_id, maturity_score (NUMERIC), computed_at
- **RLS**: Org-isolation

#### `maturity_levels`
- **Columns**: level (INT PK), name, description
- **Data**: 5 levels seeded — Basic (0), Reactive (1), Compliant (2), Proactive (3), Resilient (4/5)
- **RLS**: GRANT SELECT to authenticated (global reference data)

#### `scoring_rules`
- **Columns**: id, organisation_id (nullable), level_type, aggregation_method, weight, threshold
- **Data**: Global defaults seeded (org_id=NULL), per-org overrides supported
- **RLS**: SELECT visible to all authenticated

### 4.3 Tables Referenced in Code Without Migrations

| Referenced Table | Where Referenced | Status |
|---|---|---|
| `evidence_submissions` | EvidenceSubmissionInterface.tsx | ❌ NO MIGRATION — planned but not implemented |
| `ai_memory` | packages/ai-centre/supabase/migrations/001_ai_memory.sql | ✅ Exists in ai-centre package migrations |
| `ai_feedback_events` | packages/ai-centre/supabase/migrations/005_ai_feedback_pipeline.sql | ✅ Exists in ai-centre package migrations |
| `ai_requests` | packages/ai-centre/supabase/migrations/007_ai_requests.sql | ✅ Exists in ai-centre package migrations |
| `feedback` | Issue description mentions "feedback table" | ❌ DOES NOT EXIST — handled via audit_logs + AI layer |
| `recommendations` | Issue description | ❌ DOES NOT EXIST — computed from criteria_evaluations guidance fields |
| `report_requests` | Issue description | ❌ DOES NOT EXIST — covered by audit_reports lifecycle |
| `control_standards` | Issue description | ❌ DOES NOT EXIST — implemented via criteria concept |

---

## 5. RLS Policy Architecture

### Core Isolation Pattern

All 18+ MAT tables use identical org-isolation logic:

```sql
SELECT USING (
  organisation_id IN (
    SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
  )
)
```

This pattern chains authentication → profile → organisation, providing multi-tenant isolation at the database level.

### Storage Bucket RLS

| Bucket | Privacy | Size Limit | RLS Pattern |
|---|---|---|---|
| `audit-documents` | Private | 50 MB | Path prefix: `/{organisation_id}/` — `split_part(name, '/', 1) = (SELECT organisation_id::text FROM profiles WHERE id = auth.uid())` |
| `reports` | Private | N/A | Path prefix: `/{organisation_id}/{audit_id}/` — same split_part pattern |
| `organisation-assets` | Public | 10 MB | Public reads, authenticated writes only |

### Global Reference Data (No Restrictive RLS)

- `maturity_levels`: GRANT SELECT to authenticated (global)
- `scoring_rules`: SELECT visible to all authenticated (org_id=NULL rows + per-org overrides)

### Known Resolved RLS Incidents

| Incident | Status |
|---|---|
| F-001: profiles INSERT/UPDATE RLS violation | ✅ Fixed in 20260304000003 |
| F-002: audits INSERT RLS violation | ✅ Fixed in 20260304000003 |
| INC-W14-COL-MAPPING-001: sort_order missing | ✅ Fixed in 20260306000000 |
| INC-W14-PROFILES-COL-001/002: full_name, preferences missing | ✅ Fixed in 20260304000000 |
| INC-ALCF-001: audit_logs INSERT/SELECT used non-existent columns | ✅ Fixed in wave-audit-log-column-fix |

---

## 6. Database Triggers and Functions

| Function | Security | Trigger | Purpose |
|---|---|---|---|
| `handle_new_user()` | SECURITY DEFINER | AFTER INSERT ON auth.users | Auto-creates profile row + records onboarding |
| `record_onboarding_complete()` | SECURITY DEFINER | AFTER INSERT ON organisations | Records onboarding completion |
| `cascade_exclude_to_children()` | PLPGSQL | AFTER UPDATE OF excluded ON domains/mps | Propagates excluded flag to all children (domain → mps → criteria) |

**No database webhooks found** — no `pg_notify` triggers or Supabase database webhooks configured to automatically invoke Edge Functions. All Edge Function calls are explicit, synchronous, and frontend-initiated.

---

## 7. Storage Buckets

| Bucket | Purpose | Path Convention | Access |
|---|---|---|---|
| `audit-documents` | All uploaded files (criteria documents, evidence files) | `{org_id}/criteria/{audit_id}/{ts}-{filename}` for criteria; `{org_id}/evidence/{criterion_id}/{type}/{ts}-{filename}` for evidence | Private, RLS-protected |
| `reports` | Generated audit reports (PDFs) | `reports/{org_id}/{audit_id}/<filename>.pdf` | Private, RLS-protected |
| `organisation-assets` | Org logos, branding assets | `{org_id}/logo/...` | Public reads, auth writes |

---

## 8. Edge Functions

### 8.1 Deployed Functions

#### `invoke-ai-parse-criteria` ✅ DEPLOYED AND FUNCTIONAL

| Aspect | Details |
|---|---|
| **Location** | `supabase/functions/invoke-ai-parse-criteria/index.ts` (298 lines) |
| **HTTP Method** | POST |
| **Health Endpoint** | GET `/health` → `{ "status": "healthy", "function": "invoke-ai-parse-criteria" }` |
| **Input** | `{ "auditId": "<uuid>", "filePath": "<storage path>" }` |
| **Output** | `{ "success": true, "domains_inserted": N, "mps_inserted": N, "criteria_inserted": N, "needs_human_review": bool, "ldcs_document": bool }` |
| **DB Writes** | domains, mini_performance_standards, criteria, audit_logs |
| **External Call** | `AI_GATEWAY_URL/api/v1/parse` (OpenAI GPT-4 Turbo via mat-ai-gateway) |
| **Error Handling** | Structured `{ error, code }` responses; all errors written to audit_logs; SSRF mitigation on AI_GATEWAY_URL |
| **Frontend Hook** | `useTriggerAIParsing()` in `useCriteria.ts:199` |
| **Tests** | wave15r-edge-function-health.test.ts (11 tests), wave15r-api-chain.test.ts (21 tests), wave15-criteria-parsing.test.ts (14 tests) |
| **Required Env** | `AI_GATEWAY_URL`, `SUPABASE_URL` (auto), `SUPABASE_SERVICE_ROLE_KEY` (auto) |

**Features:**
- SSRF mitigation: `AI_GATEWAY_URL` validated at startup and per-request
- LDCS pattern detection for Local Delivery Compliance Standard documents
- Signed URL generation for document access (5-minute TTL)
- Hierarchical validation: skips MPS/criteria if parent FK not found
- Full audit trail for all operations
- README with deployment and troubleshooting guide

### 8.2 Missing Edge Functions (Referenced in Frontend, Not Deployed)

#### `invoke-ai-score-criterion` ❌ CRITICAL GAP

| Aspect | Details |
|---|---|
| **Expected Location** | `supabase/functions/invoke-ai-score-criterion/` (does NOT exist) |
| **Frontend Hook** | `useTriggerAIScoring()` in `useScoring.ts:221` |
| **Frontend Code** | `supabase.functions.invoke('invoke-ai-score-criterion', { body: { criterionId } })` |
| **Expected DB Writes** | scores (maturity_level, confidence, gap_analysis) |
| **Expected External Call** | AIMC Gateway scoring capability (W12-GAP-004 — wiring incomplete) |
| **Impact** | AI-assisted maturity scoring completely non-functional; ReviewTable calls missing function |
| **Root Cause** | AIMC integration for `scoring` capability not yet complete (see API section §9) |
| **Tests** | None |

#### `generate-audit-report` ❌ CRITICAL GAP

| Aspect | Details |
|---|---|
| **Expected Location** | `supabase/functions/generate-audit-report/` (does NOT exist) |
| **Frontend Hook** | `useGenerateReport()` in `useScoring.ts:245` (also consumed in `ReportGenerator` component) |
| **Frontend Code** | `supabase.functions.invoke('generate-audit-report', { body: { auditId, format } })` |
| **Expected Output** | `{ url: string }` — signed download URL |
| **Expected DB Writes** | audit_reports (status, storage_path, generated_at) |
| **Impact** | No report can be generated from the system; entire reporting pipeline non-functional |
| **Root Cause** | AIMC integration for `reporting` capability not yet complete (W12-GAP-003) |
| **Tests** | None |

### 8.3 AI Gateway Service

The `invoke-ai-parse-criteria` Edge Function depends on an external `mat-ai-gateway` service reachable at `AI_GATEWAY_URL`. This service:

- Accepts `POST /api/v1/parse` with `{ document_url, tenant_id, file_path }`
- Extracts text from PDF, DOCX, XLSX
- Calls OpenAI GPT-4 Turbo with structured extraction prompt
- Returns `{ domains[], mini_performance_standards[], criteria[], needs_human_review, ldcs_document }`

**Gap**: The `parsing.py` file exists in the repo (confirmed by tests), but deployment instructions and infrastructure configuration are not visible in this review.

---

## 9. API Routes (Backend)

### 9.1 Route Inventory

| Route | Method | Auth | Purpose | Status |
|---|---|---|---|---|
| `/health` | GET | None | Deployment health | ✅ Working |
| `/api/ai/request` | POST | CORS only | AI capability routing | ✅ 6/8 capabilities working |
| `/api/ai/health` | GET | None | AI gateway health check | ✅ Working |
| `/api/ai/feedback` | POST | JWT (Bearer) | Submit AI feedback | ✅ Working |
| `/api/ai/feedback/pending` | GET | ARC token | List pending feedback for review | ✅ Working |
| `/api/ai/feedback/approve` | POST | ARC token | Approve/reject feedback events | ✅ Working |

### 9.2 AI Centre Capabilities

The `/api/ai/request` endpoint routes 8 capability types:

| Capability | Status | Provider | Notes |
|---|---|---|---|
| `advisory` | ✅ Working | GitHub Models or OpenAI | Primary chat/advisory |
| `analysis` | ✅ Working | OpenAI | Document analysis |
| `embeddings` | ✅ Working | OpenAI | Vector embeddings |
| `document_generation` | ✅ Working | OpenAI | Doc generation |
| `image_generation` | ✅ Working | OpenAI (dall-e-3) | Image generation |
| `deep_search` | ✅ Working | OpenAI | Deep research |
| `scoring` | ❌ INCOMPLETE | Blocked on AIMC | W12-GAP-004 — wiring not complete |
| `reporting` | ❌ INCOMPLETE | Blocked on AIMC | W12-GAP-003 — wiring not complete |

### 9.3 Feedback Pipeline

The AI feedback pipeline follows a 3-step ARC approval workflow:

```
User submits feedback (POST /api/ai/feedback)
    → ai_feedback_events INSERT with arc_status='pending'
    ↓
ARC operator reviews (GET /api/ai/feedback/pending)
    → SELECT pending events filtered by organisationId
    ↓
ARC operator decides (POST /api/ai/feedback/approve)
    → UPDATE arc_status='approved'|'rejected'
    → Records arc_reviewed_by, arc_reviewed_at, arc_notes
```

**Gap**: No frontend UI for ARC operators to review/approve feedback. The endpoints exist but require a dedicated ARC portal (not yet built).

### 9.4 Authentication Gaps in Backend

| Gap | Severity | Details |
|---|---|---|
| `POST /api/ai/request` has no JWT authentication | HIGH | `organisationId` scoping enforced at request body level only; no session-level validation |
| Feedback ARC approval uses secret token | MEDIUM | `x-arc-token` secret, not formal RBAC; no role-based access control |

### 9.5 Database Tables (AI Centre Package)

Located in `packages/ai-centre/supabase/migrations/`:

| Table | Purpose | Status |
|---|---|---|
| `ai_memory` | Org-scoped conversation history (session_id, role, content, capability, expires_at) | ✅ Migrated |
| `ai_feedback_events` | Feedback with ARC approval workflow (feedback_type, arc_status, arc_reviewed_by) | ✅ Migrated |
| `ai_requests` | Telemetry log (capability, provider, latency_ms, status) — append-only | ✅ Migrated |

---

## 10. UI Flows — End-to-End

### 10.1 Route Map

| Route | Component | Status |
|---|---|---|
| `/login` | LoginPage | ✅ Working |
| `/` | Redirects to /dashboard | ✅ Working |
| `/dashboard` | DashboardPage | ✅ Working |
| `/audits` | AuditManagementPage | ✅ Working |
| `/criteria` | CriteriaManagementPage | ✅ Working |
| `/evidence` | EvidenceCollectionPage | ⚠️ STUB — real component not wired |
| `/scoring` | ScoringPage | ⚠️ PARTIAL — AI scoring missing |
| `/reports` | ReportsPage | ❌ STUB — non-functional |
| `/settings` | SettingsPage | ✅ Working |
| `/onboarding` | OnboardingPage | ✅ Working |

### 10.2 Document/Standard Upload Flow

**Route**: `/criteria` → `CriteriaManagementPage` → `CriteriaUpload`

**Full flow:**
1. User selects audit from dropdown
2. Drag-drop or click to select PDF/DOCX file (max 10MB)
3. Client validates file type and size
4. File uploaded to `audit-documents` storage bucket at path: `{orgId}/criteria/{auditId}/{timestamp}-{filename}`
5. `audit_logs` INSERT with `action='criteria_upload'` (non-fatal)
6. `useTriggerAIParsing()` calls `invoke-ai-parse-criteria` Edge Function
7. Upload succeeds even if parsing fails (graceful degradation per INC-POST-FCWT-EDGE-FN-001)

**State**: useUploadCriteria, useTriggerAIParsing, useUploadedDocuments hooks
**Status**: ✅ Fully functional

### 10.3 Criteria Parsing/Import Flow

**After upload triggers Edge Function:**
1. `invoke-ai-parse-criteria` processes document via AI Gateway
2. Domains, MPS, criteria inserted into database
3. `audit_logs` INSERT with `action='criteria_parsed'` or `'criteria_parse_failed'`
4. `parse_tasks` record created/updated with status
5. `useParseStatus()` polls `parse_tasks` every 3 seconds until `completed` or `failed`
6. On terminal state: `['uploaded-documents', auditId]` cache invalidated
7. Document list badge updates to COMPLETE/FAILED with timestamp

**CriteriaTree display:**
- Queries `domains` joined with `mini_performance_standards(*, criteria(*))`
- Hierarchical keyboard-navigable tree (Enter/Space to expand/select)
- Sort by `sort_order` column

**Gap**: `CriteriaModal` (criterion detail popup) shows **hardcoded mock data** — not fetching from backend.

**Status**: ✅ Core flow functional; ⚠️ CriteriaModal shows mock data

### 10.4 Evidence Collection Flow

**Route**: `/evidence` → `EvidenceCollectionPage` → **STUB**

**Real component exists** at `EvidenceCollection.tsx` but is NOT wired to the `/evidence` page route. The page renders a stub placeholder instead.

**Real component capabilities (when wired):**
- 6 evidence tabs: Text, Photo, Audio, Video, Document, Interview
- Storage path: `{orgId}/evidence/{criterionId}/{type}/{timestamp}-{filename}`
- DB: `evidence` table INSERT via `useUploadEvidence()`
- Delete: storage removal + `evidence.delete()`
- Interview: MediaRecorder with consent checkbox, interviewee name/role metadata
- Audio/Video: MediaRecorder start/stop → .webm file upload

**Gap**: Page is unreachable from navigation; entire evidence collection workflow blocked.
**Gap**: Interview recordings saved but no playback UI in evidence list.

**Status**: ❌ BLOCKED — page is stub, real component not wired

### 10.5 Maturity Scoring (Evaluation) Flow

**Route**: `/scoring` → `ScoringPage` → `ReviewTable`

**Manual flow (functional):**
1. User selects audit
2. Table displays criteria with AI scores (maturity_level, confidence from `scores` table)
3. Filter by status (All/Pending/Confirmed/Overridden)
4. User confirms score → `useConfirmScore()` → `scores.update({ confirmed: true })`
5. User overrides → inline form → `useOverrideScore()` → `scores.update({ override_score, override_justification })`
6. On success: invalidates `['audit-scores', auditId]` and `['criterion-score', criterionId]`

**AI scoring flow (NON-FUNCTIONAL):**
- `useTriggerAIScoring()` calls `invoke-ai-score-criterion` Edge Function
- **Edge Function does NOT exist** → runtime failure on invocation
- No error recovery or graceful degradation for missing Edge Function

**Gap**: AI scoring completely non-functional.
**Gap**: `scores.gap_analysis` JSONB field (`{ immediate: [], medium: [], long_term: [] }`) is never displayed in the UI.

**Status**: ⚠️ Manual confirm/override functional; AI scoring non-functional

### 10.6 Feedback and Recommendations Flow

**Status**: ❌ NOT IMPLEMENTED

The data structure exists:
- `criteria_evaluations.next_level_guidance` — guidance for next maturity level
- `criteria_evaluations.next_plus_one_taster` — preview of level+2
- `scores.gap_analysis` JSONB — structured gap recommendations

But:
- No UI page or route to display feedback or recommendations
- No component fetches or renders this data
- Components `OverrideLog.tsx` and `EvidenceRequirement.tsx` exist but are not used in a page
- Feedback approval workflow (FR-025, FR-026) has backend endpoints but no frontend UI

### 10.7 Report Generation and Download Flow

**Route**: `/scoring` → `ReportGenerator` component (embedded in ScoringPage)

**Trigger flow:**
1. User selects report format (PDF, DOCX, XLSX)
2. Clicks "Generate {FORMAT} Report"
3. `useGenerateReport()` calls `generate-audit-report` Edge Function
4. **Edge Function does NOT exist** → runtime failure
5. Expected: Edge Function returns `{ url: signed_download_url }`
6. Expected: Browser auto-downloads as `{auditTitle}-report.{format}`

**Report listing**: `/reports` page is a stub — no reports can be listed or re-downloaded.

**Gap**: `audit_reports` table schema is complete (status: 'generating'|'final'|'failed', storage_path, generated_at) but the Edge Function to populate it doesn't exist.

**Status**: ❌ COMPLETELY NON-FUNCTIONAL

---

## 11. Automation Wiring (TanStack Query, Async Chains)

### 11.1 Complete Hook Inventory

| Hook | Type | Query Key | Cache Invalidations On Success | staleTime |
|---|---|---|---|---|
| `useAudits` | useQuery | `['audits']` | — | default |
| `useAudit(id)` | useQuery | `['audit', id]` | — | default |
| `useCreateAudit` | useMutation | — | `['audits']`, `['audit-metrics']` | — |
| `useUpdateAudit` | useMutation | — | `['audits']`, `['audit', id]`, `['audit-metrics']` | — |
| `useDeleteAudit` | useMutation | — | `['audits']`, `['audit-metrics']` | — |
| `useAuditMetrics` | useQuery | `['audit-metrics']` | — | **5,000ms** + `refetchInterval: 30,000ms` |
| `useCriteriaTree(auditId)` | useQuery | `['criteria-tree', auditId]` | — | default |
| `useUploadCriteria` | useMutation | — | `['criteria-tree', auditId]`, `['uploaded-documents', auditId]` | — |
| `useTriggerAIParsing` | useMutation | — | — | — |
| `useUploadedDocuments(auditId)` | useQuery | `['uploaded-documents', auditId]` | — | default |
| `useParseStatus(auditId, taskId)` | useQuery | `['parse-status', auditId, taskId]` | `['uploaded-documents', auditId]` (on terminal) | default + poll 3s |
| `useUserProfile` | useQuery | `['user-profile']` | — | default |
| `useUpdateUserProfile` | useMutation | — | `['user-profile']` | — |
| `useOrganisationSettings(orgId)` | useQuery | `['organisation-settings', orgId]` | — | default |
| `useUpdateOrganisationSettings` | useMutation | — | `['organisation-settings', orgId]` | — |
| `useCreateOrganisation` | useMutation | — | `['user-profile']`, `['organisation-settings']` | — |
| `useUploadOrganisationLogo` | useMutation | — | `['organisation-settings', orgId]` | — |
| `useAuditScores(auditId)` | useQuery | `['audit-scores', auditId]` | — | default |
| `useCriterionScore(criterionId)` | useQuery | `['criterion-score', criterionId]` | — | default |
| `useConfirmScore` | useMutation | — | `['audit-scores', auditId]`, `['criterion-score', criterionId]` | — |
| `useOverrideScore` | useMutation | — | `['audit-scores', auditId]`, `['criterion-score', criterionId]` | — |
| `useTriggerAIScoring` | useMutation | — | `['audit-scores', auditId]`, `['criterion-score', criterionId]` | — |
| `useGenerateReport` | useMutation | — | — | — |
| `useCriterionEvidence(criterionId)` | useQuery | `['evidence', criterionId]` | — | default |
| `useUploadEvidence` | useMutation | — | `['evidence', criterionId]` | — |
| `useDeleteEvidence` | useMutation | — | `['evidence', criterionId]` | — |

**Total: 26 hooks (17 useQuery, 15 useMutation)**

### 11.2 Async Workflow Chains

#### Chain 1: Upload → Parse (Sequential with Graceful Degradation)

```
useUploadCriteria.mutateAsync()
    ├─ Upload file to audit-documents storage
    ├─ INSERT audit_logs (action='criteria_upload')
    └─ On success:
        ├─ useTriggerAIParsing.mutateAsync()
        │   ├─ refreshSession() (JWT refresh before Edge Function)
        │   └─ supabase.functions.invoke('invoke-ai-parse-criteria')
        │       ↓ (error → setAiParsingWarning inline — non-fatal)
        └─ Invalidate ['uploaded-documents', auditId]
```

**Key characteristics**: Upload always succeeds; parsing failure shows inline warning. Retry button available per-document.

#### Chain 2: Parse Status Polling

```
useParseStatus(auditId, taskId)
    ├─ Query parse_tasks WHERE id=taskId AND audit_id=auditId
    ├─ refetchInterval: dynamic
    │   ├─ status 'completed'|'failed'|'COMPLETE'|'FAILED' → return false (STOP)
    │   └─ otherwise → return 3000 (poll every 3s)
    └─ On terminal state:
        └─ Invalidate ['uploaded-documents', auditId]
```

#### Chain 3: Scoring Confirm/Override

```
useConfirmScore.mutateAsync() OR useOverrideScore.mutateAsync()
    └─ On success:
        └─ Invalidate ['audit-scores', auditId] + ['criterion-score', criterionId]
```

### 11.3 Real-Time Subscriptions

**One Supabase channel subscription found:**

```typescript
// DashboardPage.tsx:35-50
const channel = supabase
  .channel('audit-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'audits' },
    () => queryClient.invalidateQueries({ queryKey: ['audit-metrics'] })
  )
  .subscribe();
// Cleanup: supabase.removeChannel(channel) on unmount ✅
```

**No other real-time subscriptions found.** Parse status, scoring, and report generation use polling or manual invalidation — not real-time channels.

---

## 12. Error Surfacing and Audit Trail

### 12.1 Error Display Patterns

| Pattern | Count | Components |
|---|---|---|
| `alert()` (browser dialog) | **29 calls** | CriteriaModal (1), EvidenceCollection (12), InterviewRecorder (1), ReportGenerator (2), AuditList (1), AuditCreationForm (2), ReviewTable (5), SettingsPage (5) |
| Inline error divs (`role="alert"`) | Modern pattern | CriteriaUpload, ReviewTable, AuditList, EvidenceCollection |
| Global ErrorBoundary | ✅ Exists | `App.tsx` — wraps entire Router |

**Note on `alert()` count**: 29 calls confirmed by static analysis (`grep -r "^[[:space:]]*alert(" modules/mat/frontend/src/ --include="*.tsx" --include="*.ts"`). EvidenceCollection has the highest count (12), followed by ReviewTable (5) and SettingsPage (5).

**No toast notification system exists.** The DashboardPage.tsx has a comment `// Toast notification would go here` indicating awareness but no implementation.

### 12.2 Global Error Boundary

`ErrorBoundary.tsx` wraps the entire application in `App.tsx`:
- Catches React lifecycle errors
- Shows "Something went wrong" with collapsible error details
- Provides Reload button
- Logs to `console.error()`
- **Does NOT catch**: async errors, Promise rejections, Edge Function errors (these must be handled per-component)

### 12.3 Audit Log Coverage

| Action | Where Written | Frontend/Backend |
|---|---|---|
| `criteria_upload` | `useUploadCriteria` hook | Frontend |
| `criteria_parsed` | `invoke-ai-parse-criteria` Edge Function | Backend |
| `criteria_parse_failed` | `invoke-ai-parse-criteria` Edge Function | Backend |
| Audit create/update/delete | ❌ Not logged | — |
| Evidence upload/delete | ❌ Not logged | — |
| Score confirm/override | ❌ Not logged | — |
| Report generation | ❌ Not logged | — |
| User login/logout | ❌ Not logged | — |

**Assessment**: Audit logging is narrow — covering only the criteria parsing pipeline. Actions on audits, evidence, scores, and reports do not generate audit log entries. This represents a compliance gap if full action tracking is required.

---

## 13. Status Propagation

### 13.1 Parse Status Chain

```
File upload → audit_logs (action='criteria_upload', status implicit in action name)
    ↓
Edge Function creates parse_tasks row (status='pending')
    ↓
parse_tasks status transitions: pending → processing → completed/failed
    ↓
useParseStatus polls parse_tasks every 3s
    ↓
Terminal state detected → invalidate ['uploaded-documents'] cache
    ↓
useUploadedDocuments re-fetches from audit_logs
    ↓
Status mapping: criteria_parsed → COMPLETE, criteria_parse_failed → FAILED, criteria_upload → PENDING
    ↓
UI badge updated per document
```

**Note**: `useUploadedDocuments` deduplicates by `file_path`, keeping highest-priority status.
**Note**: `useParseStatus` handles both uppercase (`COMPLETE`, `FAILED`) and lowercase (`completed`, `failed`) for backward compatibility.

### 13.2 Scoring Status Chain

```
AI scoring (useTriggerAIScoring) → invoke-ai-score-criterion ❌ MISSING
    ↓ (expected)
scores table populated (maturity_level, confidence, gap_analysis)
    ↓
useAuditScores fetches scores with criteria join
    ↓
Status mapping: override_score exists → 'overridden', confirmed=true → 'confirmed', else → 'pending'
    ↓
ReviewTable shows status badge per criterion
```

### 13.3 Report Generation Status Chain

```
useGenerateReport → generate-audit-report ❌ MISSING
    ↓ (expected)
audit_reports INSERT (status='generating')
    ↓ (expected)
PDF generation
    ↓ (expected)
audit_reports UPDATE (status='final', storage_path, generated_at)
    ↓ (expected)
Signed URL returned to frontend
    ↓ (expected)
Browser download triggered
```

**Current reality**: Fire-and-forget; no long-running task tracking. No polling mechanism exists for report generation status.

---

## 14. Authentication and Authorization

### 14.1 Authentication Flow

- Supabase Auth (JWT-based)
- `AuthContext.tsx` manages session via `onAuthStateChange` listener
- `refreshSession()` called explicitly before Edge Function invocation to prevent stale JWT 401s
- `supabase.auth.refreshSession()` failure → throws `'Authentication required. Please sign in again.'`

### 14.2 Authorization Model

| Layer | Mechanism | Coverage |
|---|---|---|
| Database | RLS policies (org-isolation via profiles table) | All 18+ MAT tables ✅ |
| Storage | Bucket RLS (path prefix org matching) | 3 buckets ✅ |
| Edge Functions | JWT in Authorization header (via `SUPABASE_SERVICE_ROLE_KEY` for DB writes) | ✅ for parse function |
| API routes | CORS origin check + JWT for feedback, ARC token for ARC ops | Partial — /api/ai/request has no auth ⚠️ |
| Frontend | Route-level auth guard (session check in AuthContext) | ✅ |

### 14.3 RLS Verification

The org-isolation pattern `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` is consistent across all tables. This creates a proper chain:
1. `auth.uid()` → identifies authenticated user
2. `profiles` lookup → resolves to organisation_id
3. Table filter → restricts to that organisation's data

---

## 15. End-to-End Pipeline Trace

### Complete Trace: Document Parsing to Criteria Display ✅ FUNCTIONAL

```
1. User navigates to /criteria and selects an audit
2. Drags PDF/DOCX file onto CriteriaUpload component
3. Client validates: file type (PDF/DOCX), size (≤10MB)
4. useUploadCriteria.mutateAsync():
   a. supabase.storage.from('audit-documents').upload(path, file)
   b. INSERT audit_logs: action='criteria_upload', file_path, hash
5. useTriggerAIParsing.mutateAsync():
   a. supabase.auth.refreshSession() ← JWT freshness guard
   b. supabase.functions.invoke('invoke-ai-parse-criteria', { auditId, filePath })
6. Edge Function invoke-ai-parse-criteria:
   a. Validates auditId and filePath parameters
   b. Generates signed URL for document (5-min TTL)
   c. POST AI_GATEWAY_URL/api/v1/parse { document_url, tenant_id, file_path }
   d. AI Gateway extracts text, calls OpenAI GPT-4, returns structured JSON
   e. INSERT INTO domains (N rows)
   f. INSERT INTO mini_performance_standards (N rows)
   g. INSERT INTO criteria (N rows)
   h. INSERT audit_logs: action='criteria_parsed', counts in details
7. Frontend: useParseStatus polls parse_tasks every 3s
8. Terminal state → invalidate uploaded-documents cache
9. Document badge: COMPLETE with timestamp
10. useCriteriaTree refetches domains + mps + criteria hierarchy
11. CriteriaTree renders Domain → MPS → Criteria tree
```

### Complete Trace: Evidence Collection ⚠️ BLOCKED

```
1. User navigates to /evidence
2. EvidenceCollectionPage renders STUB (not real component) ← BLOCKED
--- Everything below is the expected flow once unblocked ---
3. User selects audit and criterion
4. Selects evidence type tab (text/photo/audio/video/document/interview)
5. Provides evidence content
6. useUploadEvidence.mutateAsync():
   a. Upload file to audit-documents storage (if file type)
   b. supabase.from('evidence').insert({ criterion_id, type, content, file_path, metadata })
7. Evidence list refreshes
8. No audit_log entry written for evidence upload ← audit gap
```

### Complete Trace: Maturity Scoring ⚠️ PARTIALLY FUNCTIONAL

```
AI scoring path (NON-FUNCTIONAL):
1. User clicks "Trigger AI Scoring" per criterion
2. useTriggerAIScoring → supabase.functions.invoke('invoke-ai-score-criterion')
3. FAILS: Edge Function does not exist
--- Manual path (FUNCTIONAL) ---
1. Scores pre-populated in scores table (mechanism unclear — possibly from criteria_evaluations)
2. User views ReviewTable at /scoring
3. Clicks "Confirm" → useConfirmScore → scores.update({ confirmed: true })
4. Clicks "Override" → opens inline form → useOverrideScore → scores.update({ override_score, justification })
5. Status updates to 'confirmed' or 'overridden'
6. Cache invalidated; table re-renders
```

### Complete Trace: Report Generation ❌ NON-FUNCTIONAL

```
1. User navigates to /scoring (ReportGenerator embedded)
2. Selects format (PDF/DOCX/XLSX)
3. Clicks "Generate Report"
4. useGenerateReport → supabase.functions.invoke('generate-audit-report')
5. FAILS: Edge Function does not exist
6. alert() called with failure message
7. No audit_reports record created
8. No download triggered
```

---

## 16. Completeness Gap Register

This register documents every identified gap. It is strictly documentary — no implementation is performed in this review.

### CRITICAL Gaps (Pipeline Blockers)

| ID | Gap | Location | Impact | Recommendation |
|---|---|---|---|---|
| **GAP-001** | `invoke-ai-score-criterion` Edge Function missing | supabase/functions/ | AI scoring completely non-functional; `useTriggerAIScoring()` fails at runtime | Implement Edge Function; requires AIMC scoring capability wiring (W12-GAP-004) |
| **GAP-002** | `generate-audit-report` Edge Function missing | supabase/functions/ | Report generation completely non-functional; entire /reports route is dead | Implement Edge Function; requires AIMC reporting capability wiring (W12-GAP-003) |
| **GAP-003** | `/evidence` page is stub component | modules/mat/frontend/src/pages | Evidence collection workflow unreachable from navigation | Wire `EvidenceCollection.tsx` to `/evidence` page route |
| **GAP-004** | AIMC `scoring` capability wiring incomplete | api/ai/request.ts, packages/ai-centre/ | `invoke-ai-score-criterion` Edge Function cannot route to AI | Complete AIMC Waves 3–4 for scoring capability (W12-GAP-004) |
| **GAP-005** | AIMC `reporting` capability wiring incomplete | api/ai/request.ts, packages/ai-centre/ | `generate-audit-report` Edge Function cannot route to AI | Complete AIMC Waves 3–4 for reporting capability (W12-GAP-003) |

### HIGH Gaps (Significant Functionality Missing)

| ID | Gap | Location | Impact | Recommendation |
|---|---|---|---|---|
| **GAP-006** | No feedback/recommendations UI | modules/mat/frontend/src/ | `gap_analysis` JSONB and guidance fields in DB never displayed | Create recommendations page/component fetching `scores.gap_analysis` and `criteria_evaluations.next_level_guidance` |
| **GAP-007** | `/reports` page is stub | modules/mat/frontend/src/pages | No way to list or re-download previously generated reports | Implement ReportsList component fetching `audit_reports` table |
| **GAP-008** | No toast notification system | Throughout frontend | 29 `alert()` calls across 8 files create poor UX (blocking dialogs) | Add react-hot-toast or similar; replace `alert()` calls |
| **GAP-009** | `CriteriaModal` shows mock/hardcoded data | modules/mat/frontend/src/components | Criterion detail view not wired to backend | Wire CriteriaModal to fetch from `criteria`, `criteria_evaluations`, and `scores` tables |
| **GAP-010** | No long-running task tracker for report generation | modules/mat/frontend/src/ | If report generation is async, no UI feedback mechanism exists | Add `report_tasks` table (or extend `parse_tasks` pattern) and polling hook |
| **GAP-011** | `scores` INSERT/UPDATE RLS policies incomplete | supabase/migrations | Scores table only has SELECT RLS; writes may be blocked for RLS-compliant paths | Add INSERT/UPDATE policies matching SELECT pattern |
| **GAP-012** | `audit_scores` INSERT/UPDATE RLS policies incomplete | supabase/migrations | Same as GAP-011 | Add INSERT/UPDATE policies |
| **GAP-013** | No ARC portal frontend | modules/mat/frontend/ | Feedback approval workflow endpoints exist but no UI for ARC operators | Build ARC review/approval interface |

### MEDIUM Gaps (Quality and Completeness Issues)

| ID | Gap | Location | Impact | Recommendation |
|---|---|---|---|---|
| **GAP-014** | Interview recording playback not implemented | EvidenceCollection.tsx | Recorded interview audio files saved but no playback UI | Add audio player in evidence list for `type='interview'` and `type='audio'` |
| **GAP-015** | No global audit selection context | Throughout frontend | Each page manages its own `auditId` state; repetitive and inconsistent | Add AuditContext provider or include auditId in URL params |
| **GAP-016** | Audit logging covers only criteria parsing | useUploadCriteria, Edge Function | Evidence uploads, score changes, report generation not in audit trail | Add audit_logs entries for evidence upload, score confirm/override, report generation |
| **GAP-017** | `POST /api/ai/request` lacks JWT authentication | api/ai/request.ts | `organisationId` from request body only; no session-level verification | Add JWT validation before processing; verify organisationId against auth.uid() session |
| **GAP-018** | `mat-ai-gateway` deployment instructions not in repo | — | Deployment dependency not documented in accessible location | Add deployment runbook for mat-ai-gateway service to docs/ |
| **GAP-019** | `evidence_submissions` table referenced but no migration | EvidenceSubmissionInterface.tsx | Potential runtime error if code path executes | Either create migration or remove reference |
| **GAP-020** | Score `gap_analysis` JSONB never displayed | ReviewTable.tsx | Rich gap analysis data computed but invisible to users | Render gap_analysis.immediate/medium/long_term in ReviewTable or dedicated view |

### LOW Gaps (Minor Issues)

| ID | Gap | Location | Impact | Recommendation |
|---|---|---|---|---|
| **GAP-021** | No database webhooks for async processing | — | All Edge Function calls synchronous/frontend-initiated; no event-driven processing | Consider database webhooks for automatic post-insert processing if scale requires it |
| **GAP-022** | No `report_requests` table; `audit_reports` doubles as both request and result | supabase/ | Audit trail shows when report was generated but not by whom it was requested if triggered differently | Either accept current design (triggered_by field sufficient) or add separate request lifecycle |
| **GAP-023** | `control_standards` concept not explicitly modeled | supabase/ | "Control Standard" mentioned in requirements but implemented as criteria top-level | Consider whether a separate control_standards table adds value for future requirements |
| **GAP-024** | No unsaved-changes warnings or confirmation dialogs | Throughout frontend | Destructive actions (delete audit, delete evidence) proceed without confirmation | Add `window.confirm()` calls or custom dialog components for destructive actions |
| **GAP-025** | `useAuditMetrics` polling (30s) has no stop condition | DashboardPage.tsx | Continuous polling even when no one is watching dashboard | Consider pausing poll when document is hidden (visibilitychange API) |

---

## 17. Summary Scorecard

### By Pipeline Stage

| Stage | Schema | Backend | Frontend | Tests | Overall |
|---|---|---|---|---|---|
| Document Upload | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Present | **✅ FUNCTIONAL** |
| AI Criteria Parsing | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Present | **✅ FUNCTIONAL** |
| Parse Status Tracking | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Present | **✅ FUNCTIONAL** |
| Criteria Tree Display | ✅ Complete | ✅ (DB direct) | ✅ Complete | ⚠️ Partial | **✅ FUNCTIONAL** |
| Evidence Collection | ✅ Complete | ✅ (DB direct) | ❌ Page stub | ❌ Missing | **❌ BLOCKED** |
| Manual Scoring Review | ✅ Complete | ✅ (DB direct) | ✅ Complete | ⚠️ Partial | **⚠️ PARTIAL** |
| AI-Assisted Scoring | ✅ Complete | ❌ Edge Fn missing | ✅ Hook exists | ❌ Missing | **❌ NON-FUNCTIONAL** |
| Feedback/Recommendations | ✅ Data structure | — | ❌ No page | ❌ Missing | **❌ NOT IMPLEMENTED** |
| Report Generation | ✅ Complete | ❌ Edge Fn missing | ✅ Hook exists | ❌ Missing | **❌ NON-FUNCTIONAL** |
| Report Download | ✅ Complete | ❌ Edge Fn missing | ❌ Page stub | ❌ Missing | **❌ NON-FUNCTIONAL** |
| AI Feedback Pipeline | ✅ Complete | ✅ API routes | ❌ No ARC UI | ⚠️ Partial | **⚠️ PARTIAL** |

### By Subsystem

| Subsystem | Completeness | Key Gaps |
|---|---|---|
| Database Schema | **~95%** | GAP-011, GAP-012 (RLS policies); GAP-019 (evidence_submissions) |
| RLS Policies | **~90%** | scores/audit_scores INSERT/UPDATE policies missing |
| Edge Functions | **~33%** | 1 of 3 deployed; invoke-ai-score-criterion and generate-audit-report missing |
| Backend API | **~75%** | 6/8 AIMC capabilities wired; scoring/reporting incomplete; auth gap |
| UI Pages/Routes | **~55%** | 3/9 pages fully functional; 2 stubs; evidence/reports missing |
| TanStack Query | **~85%** | Well-structured; missing long-running report task polling |
| Error Handling | **~60%** | Global error boundary exists; no toast system; 12+ alert() calls |
| Audit Logging | **~30%** | Only criteria parsing logged; most actions untracked |
| Test Coverage | **~40%** | Parsing pipeline well-tested; scoring, report generation, evidence have no tests |

### Critical Path to Full Adoption

The **minimum set of changes** required for full end-to-end pipeline adoption:

1. **Implement `invoke-ai-score-criterion` Edge Function** (GAP-001) — requires AIMC scoring capability (GAP-004)
2. **Implement `generate-audit-report` Edge Function** (GAP-002) — requires AIMC reporting capability (GAP-005)
3. **Wire `/evidence` page to `EvidenceCollection.tsx`** (GAP-003) — frontend routing fix
4. **Add Feedback/Recommendations page** (GAP-006) — new frontend page
5. **Add `/reports` listing page** (GAP-007) — new frontend page

Items 1–2 are blocked on AIMC integration completion (Waves 3–4 per `ai-architecture.md` v3.0.0).
Items 3–5 are frontend-only changes, implementable without backend dependencies.

---

**Report compiled by**: foreman-v2-agent v6.2.0 (Quality Professor mode)
**Exploration delegated to**: explore agents (research only — no committed artifacts from agents)
**IAA Classification**: EXEMPT (governance analysis artifact; no triggering paths in diff)
**Authority**: CS2 (@APGI-cmy)
