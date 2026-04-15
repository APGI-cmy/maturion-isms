# MMM — Runtime/Deployment Contract

## Stage 7 — Pre-Build Gate Artifact (D3)

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Runtime/Deployment Contract (Stage 7 PBFAG — D3)
- **Status**: COMPLETE
- **Version**: 0.1.0
- **Date**: 2026-04-15
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (delegated by foreman-v2-agent)
- **Issue**: maturion-isms#1387
- **Wave**: mmm-stage7-pbfag-20260415
- **Authority Sources**: TRS §1.3, §3, TR-049–TR-053; Architecture §A2, §A3.1, §A5, §A8.4, §A16; `.env.example` v1.0.0

---

## 0. Purpose

This Runtime/Deployment Contract freezes all runtime, environment, and deployment
assumptions for the MMM module. All downstream stages (Stages 8–12) must treat this
document as the authoritative constraint set for implementation planning, builder
appointment, and build execution. No downstream stage may introduce a runtime or
deployment assumption that contradicts this contract without CS2-authorised architecture
revision.

---

## 1. Runtime Environment

### 1.1 Frontend Runtime

| Parameter | Frozen Value | Authority |
|-----------|-------------|----------|
| Framework | React ≥ 18.x | Architecture §A3.1; concurrent features required for Suspense data fetching |
| Language | TypeScript (strict mode — `tsc --strict`) | TRS TR-061; zero TypeScript warnings tolerated |
| Build Tool | Vite ≥ 5.x | Architecture §A3.1 |
| Node.js (build time) | ≥ 20.x LTS | Per Maturion platform stack convention; Vite 5 requires Node 18+; LTS 20 is the designated build target |
| State Management | Zustand ≥ 4.x | Architecture §A3.1, §A3.4 |
| Data Fetching | TanStack Query (React Query) ≥ 5.x | Architecture §A3.1; TanStack Query 5 API used |
| Styling | Tailwind CSS + Maturion Design System tokens | Architecture §A3.1; design system tokens are authoritative — no raw CSS outside token system |
| Testing: Unit/Integration | Vitest | TRS TR-054 |
| Testing: E2E | Playwright | TRS TR-056 |
| Linting | ESLint + `--max-warnings 0` | TRS TR-061; zero-warning policy is a hard gate |

### 1.2 Backend Runtime

| Parameter | Frozen Value | Authority |
|-----------|-------------|----------|
| Backend execution model | Supabase Edge Functions (Deno) ONLY | TRS TR-049; architecture §A5 |
| Deno version | Per Supabase platform default (Deno 1.x at time of build) | No custom Deno version pinning required; Supabase manages runtime |
| No Render-hosted backend | Confirmed — MMM v1.0 requires no Render server | TRS TR-049; architecture §A2 Key Decision 5 |
| Database | Supabase PostgreSQL | Architecture §A4 |
| Auth | Supabase Auth (JWT + RLS) | TRS TR-029–TR-032; architecture §A4 |
| File storage | Supabase Storage | Architecture §A4 |
| Real-time | Supabase Realtime subscriptions | Architecture §A7 (scoring cascade real-time); TRS TR-008 |
| Schema namespace | `mmm_` prefix or Supabase schema separation | Architecture §A2 Key Decision 8; TRS TR-028 |
| Tenant isolation | Row-Level Security (RLS) only — no application-layer isolation | Architecture §A2 Key Decision 2; TRS TR-043 |

---

## 2. Environment Variables

All environment variables for MMM are declared in `modules/MMM/.env.example` v1.0.0.
The table below is the canonical frozen list. No implementation may introduce
additional undeclared environment variables without an architecture revision.

### 2.1 Frontend Variables (Vite-exposed)

| Variable | Scope | Required | Secret | Notes |
|----------|-------|---------|--------|-------|
| `VITE_SUPABASE_URL` | Frontend + Edge Functions | YES | NO | Supabase project URL. Safe to expose to browser. |
| `VITE_SUPABASE_ANON_KEY` | Frontend only | YES | NO | Supabase anonymous/public key. Safe to expose to browser. |

### 2.2 Backend / Edge Function Variables (NOT Vite-exposed)

| Variable | Scope | Required | Secret | Notes |
|----------|-------|---------|--------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only | YES | **SECRET** | Service role key. NEVER expose to frontend. VITE_ prefix PROHIBITED (TR-053). |
| `AIMC_BASE_URL` | Edge Functions only | YES | NO | AIMC gateway base URL. No trailing slash. |
| `AIMC_SERVICE_TOKEN` | Edge Functions only | YES | **SECRET** | AIMC service-to-service auth token. NEVER expose to frontend. |
| `PIT_BASE_URL` | Edge Functions only | YES | NO | PIT import endpoint base URL. No trailing slash. |
| `PIT_SERVICE_TOKEN` | Edge Functions only | YES | **SECRET** | PIT service-to-service auth token. NEVER expose to frontend. |
| `MMM_ENV` | Edge Functions only | YES | NO | Environment identifier: `development` \| `staging` \| `production`. Default: `development`. |

**Secret Management Rule (TR-053)**:
- `SUPABASE_SERVICE_ROLE_KEY`, `AIMC_SERVICE_TOKEN`, `PIT_SERVICE_TOKEN` must never be
  logged, printed, returned in API responses, or exposed to the frontend.
- These secrets must be set ONLY in: Vercel dashboard (Project → Settings → Environment Variables),
  CI/CD secrets store, or local `.env.local` (not committed to source control).
- `.env.local` must be in `.gitignore` before secret values are populated.

### 2.3 Vercel-Managed Variables (do not set manually)

| Variable | Managed By | Notes |
|----------|-----------|-------|
| `VERCEL_URL` | Vercel (auto-injected) | Do not set in `.env.local` or Vercel dashboard manually. |

---

## 3. Deployment Posture

### 3.1 Frontend Deployment

| Parameter | Value | Authority |
|-----------|-------|----------|
| Hosting platform | Vercel | Architecture §A16; TRS TR-050 |
| Deployment type | SPA (Single-Page Application) | Architecture §A3 |
| Build command | `vite build` (or workspace equivalent) | Standard Vite SPA build |
| Output directory | `dist/` | Vite default |
| Domain path | Dedicated path within Maturion portal (e.g. `/mmm` or dedicated subdomain) | FRS FR-005; TRS TR-051 |
| Deployment environments | Production, Preview (per PR), Development | Standard Vercel environments |
| Environment variable injection | All variables configured per-environment in Vercel dashboard | TR-053 |
| Framework preset | Vite | Vercel auto-detects |

### 3.2 Backend / Edge Function Deployment

| Parameter | Value | Authority |
|-----------|-------|----------|
| Edge Function platform | Supabase Edge Functions | TRS TR-049 |
| Runtime | Deno (Supabase-managed) | Architecture §A5 |
| Deployment method | Supabase CLI (`supabase functions deploy`) or CI/CD integration | Per Maturion platform convention |
| Database migrations | Supabase CLI (`supabase db push`) | Per TRS TR-055 (migration management) |
| Function naming convention | `mmm-<function-name>` (mmm-namespace prefix) | Architecture §A2 Key Decision 8 |

### 3.3 Supabase Configuration Assumptions

| Parameter | Assumption | Notes |
|-----------|-----------|-------|
| Supabase project | A dedicated or shared Maturion ISMS project | Must have MMM schema/tables deployed before Stage 12 build |
| Auth providers | Supabase Auth (email/password minimum); social auth optional | TRS TR-030 |
| RLS enabled | YES — on all MMM tables | TRS TR-031; architecture §A4 |
| Real-time enabled | YES — on `maturity_scores` and `assessments` tables | TRS TR-008; architecture §A7 |
| Storage buckets | Dedicated MMM buckets: `mmm-framework-sources`, `mmm-evidence` | Architecture §A8; TRS TR-006 |
| File size limit | ≤ 50 MB per upload | TRS TR-006 |
| SMTP (Supabase Auth emails) | Must be configured for subscription and auth confirmation emails | TRS TR-052 |

---

## 4. AIMC Dependency Posture

### 4.1 Integration Model

MMM is an **AIMC consumer only**. MMM contains zero direct AI provider integrations
(no OpenAI, Anthropic, or other AI provider credentials in the MMM codebase).

All AI calls are routed via:
`MMM Edge Function → AIMC Gateway (AIMC_BASE_URL) → AI provider`

### 4.2 Interface Contract (Frozen)

| Parameter | Value | Authority |
|-----------|-------|----------|
| Call method | HTTP POST from Edge Functions | TRS TR-011 |
| Auth mechanism | Bearer token (`AIMC_SERVICE_TOKEN`) | TRS TR-012 |
| Payload requirement | All calls include `organisation_id`, `maturity_context`, `call_type` | TRS TR-013; FRS FR-009 |
| AIMC governance | AIMC is canonical AI routing layer; MMM does not bypass AIMC | TRS TR-011; Architecture §A9 |
| Circuit breaker | MMM opens circuit after ≥5 consecutive AIMC failures in 60s window; holds 30s before probe | TRS TR-009 |
| Fallback UI | On circuit open: graceful fallback message presented; no silent failure | TRS TR-009; Architecture §A9 |
| AI telemetry | Admin-accessible AI telemetry view; AIMC returns telemetry fields in responses | TRS TR-014; FRS FR-065 |

### 4.3 Operational Prerequisite

`AIMC_BASE_URL` and `AIMC_SERVICE_TOKEN` must be provisioned by CS2 before Stage 12 Build
Execution begins. These are not required for Stage 8 (Implementation Plan) but must be in
place before any integration testing in the build wave.

---

## 5. PIT Dependency Posture

### 5.1 Integration Model

MMM is a **PIT producer only**. MMM generates findings and exports them to PIT via the
PIT import endpoint. MMM contains no PIT execution logic.

### 5.2 Interface Contract (Frozen)

| Parameter | Value | Authority |
|-----------|-------|----------|
| Call method | HTTP POST from MMM Edge Function to PIT import endpoint | TRS TR-016 |
| Auth mechanism | Bearer token (`PIT_SERVICE_TOKEN`) | TRS TR-017 |
| Payload structure | `mmm_export_payload` — findings array with `finding_id`, `domain_id`, `severity`, `recommendation_text`, `evidence_refs` | TRS TR-018; Architecture §A10 |
| Payload version | v1.0 (versioned in payload header: `"mmm_export_schema_version": "1.0"`) | Architecture §A10 |
| Export tracking | `mmm_export_jobs` table tracks export status (`pending`, `submitted`, `confirmed`, `failed`) | Architecture §A10 |
| PIT availability | PIT export is non-blocking for assessment/scoring — export path can fail without preventing findings generation | Architecture §A10; TRS TR-018 |

### 5.3 Operational Prerequisite

`PIT_BASE_URL` and `PIT_SERVICE_TOKEN` must be provisioned by CS2 before Stage 12 Build
Execution integration testing. PIT export path may be tested with a mock PIT endpoint
during initial build wave testing.

---

## 6. KUC Dependency Posture

### 6.1 Integration Model

MMM routes all document and evidence uploads through the KUC (Knowledge Upload Centre),
which is within the AIMC infrastructure scope. MMM creates no parallel upload infrastructure.

### 6.2 Interface Contract (Frozen)

| Parameter | Value | Authority |
|-----------|-------|----------|
| Upload routing | All uploads via shared KUC upload middleware | TRS TR-019; Architecture §A8 |
| Framework-source uploads | POST `/api/upload/framework-source` → KUC pipeline | FRS FR-056; Architecture §A8 |
| Evidence uploads | POST `/api/upload/evidence` → KUC pipeline | FRS FR-057; Architecture §A8 |
| Document processing | KUC handles OCR, extraction, classification | TRS TR-020; Architecture §A8 |
| KUC credentials | Shared AIMC infrastructure — no separate KUC credentials required for MMM | Architecture §A8; TRS TR-019 |
| File size enforcement | ≤ 50 MB enforced at upload boundary | TRS TR-006 |

---

## 7. Connectivity Model

| Parameter | Value | Authority |
|-----------|-------|----------|
| Connectivity requirement | CONNECTIVITY-REQUIRED (OQ-001 RESOLVED) | TRS TR-039 |
| Progressive enhancement | Queue-and-sync for Audit Workbench sessions | TRS TR-039–TR-042 |
| Queue implementation | `auditQueueStore` (Zustand) backed by `localStorage` key `mmm_audit_queue` | Architecture §A3.4 |
| Queue payload | Evidence capture events: `criterion_id`, `response`, `evidence_refs`, `timestamp` | TRS TR-040 |
| Sync trigger | On reconnect: all queued events POST to `/api/audit/sync-queue` | TRS TR-041 |
| Offline UI indicator | `<ConnectivityBanner>` component driven by `connectivityStore` | Architecture §A3.2, §A3.4 |
| Full offline-first | DEFERRED — future enhancement wave (not in MMM v1.0 scope) | TRS TR-042; Architecture §A7 |

---

## 8. Performance and Reliability Assumptions

The following SLAs from TRS §2 are frozen runtime assumptions. Implementation must be
planned and tested to meet all of these:

| SLA | Target | Authority |
|-----|--------|----------|
| TTI (Time to Interactive) | ≤ 2.5 s on ≥ 10 Mbps | TR-001 |
| API response p95 (non-AI) | ≤ 500 ms | TR-002 |
| AI endpoint response p95 | ≤ 5,000 ms | TR-002 |
| Concurrent users per org | ≥ 50 | TR-003 |
| Platform concurrent users | ≥ 500 | TR-003 |
| Scoring cascade latency | ≤ 2 s end-to-end | TR-004 |
| Dashboard render (cached) | ≤ 1.5 s | TR-005 |
| Dashboard render (cache miss) | ≤ 3 s | TR-005 |
| File upload begin processing | ≤ 3 s after upload completes | TR-006 |
| Audit session load (500 criteria) | ≤ 2 s | TR-007 |
| Real-time score update (Supabase RT) | ≤ 3 s | TR-008 |
| Health endpoint p99 | ≤ 100 ms | TR-010 |

---

## 9. Code Quality and Compliance Assumptions

| Constraint | Requirement | Authority |
|-----------|------------|----------|
| TypeScript | Strict mode; zero warnings (`tsc --strict --noEmit`) | TR-061 |
| ESLint | Zero warnings (`--max-warnings 0`) | TR-061 |
| Test coverage | ≥ 80% line coverage on core business logic | TR-054 |
| WCAG | 2.1 AA for all interactive components | TR-065 |
| GDPR | Data residency in Supabase EU region; PII fields masked in logs | TR-064; TR-053 |
| ISO 27001 | Controls mapped in `CONTROL_MAPPING.md` | Architecture `COMPLIANCE_SCOPE.md` |
| SAST | No HIGH or CRITICAL findings in SAST scan gate | TR-062 |

---

## 10. Stub vs Live Expectations

The following components have staged readiness requirements before full integration testing:

| Component | Stub Acceptable For | Must Be Live Before |
|-----------|-------------------|-------------------|
| AIMC | Unit and integration tests (mock AIMC interceptor) | E2E tests and Stage 12 acceptance testing |
| PIT endpoint | Unit and integration tests (mock PIT endpoint) | E2E export path tests and Stage 12 acceptance |
| KUC pipeline | Unit tests (mock KUC middleware) | Integration tests of upload flows |
| Supabase (local) | All local development and CI tests | Staging/production deployment |
| Real-time subscriptions | Mockable in unit tests | Integration and E2E tests |

**Recommendation**: Stage 12 build wave should begin with Supabase local CLI (`supabase start`)
for database, mocked AIMC and PIT endpoints, and only move to live credentials for
staging/production integration confirmation testing.

---

## 11. Summary — Downstream Stages Must Honour

All downstream stages (Stage 8 Implementation Plan, Stage 9 Builder Checklist, Stage 11
Builder Appointment, Stage 12 Build) **must** honour this contract without modification.
Any deviation from the frozen values in this document requires:

1. CS2-authorized architecture revision wave
2. Updated PBFAG Runtime/Deployment Contract (version increment)
3. Foreman notification and BUILD_PROGRESS_TRACKER.md update

**This contract is FROZEN as of wave mmm-stage7-pbfag-20260415 (2026-04-15).**

---

*End of MMM Stage 7 — Runtime/Deployment Contract*

**Produced by**: mat-specialist | **Wave**: mmm-stage7-pbfag-20260415 | **Date**: 2026-04-15
