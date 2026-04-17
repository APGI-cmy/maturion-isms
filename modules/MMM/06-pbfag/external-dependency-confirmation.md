# MMM — External Dependency Confirmation

## Stage 7 — Pre-Build Gate Artifact (D5)

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: External Dependency Confirmation (Stage 7 PBFAG — D5)
- **Status**: COMPLETE
- **Version**: 0.1.0
- **Date**: 2026-04-15
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (delegated by foreman-v2-agent)
- **Issue**: maturion-isms#1387
- **Wave**: mmm-stage7-pbfag-20260415
- **Authority Sources**: TRS §3, TR-011–TR-020, TR-049–TR-053; Architecture §A2, §A8, §A9, §A10, §A16

---

## 0. Purpose

This External Dependency Confirmation explicitly assesses the availability, contract
status, and readiness posture of all external dependencies that MMM requires at runtime
or during the build wave. It answers the question:

> *Are all required external dependencies actually available and confirmed — or are any
> still assumed rather than confirmed?*

Each dependency is assessed against:
1. **Contract Status** — is the interface contract frozen at the architecture level?
2. **Availability Status** — is the dependency deployed and reachable?
3. **Credential/Secret Status** — are required credentials provisioned?
4. **Operational Risk** — what is the impact if the dependency is unavailable?
5. **Pre-Stage-12 Action Required** — what must happen before Stage 12 Build begins?

---

## 1. AIMC (AI Management Centre)

**Role in MMM**: AIMC is the canonical AI gateway. MMM routes ALL AI calls through AIMC
exclusively. MMM contains zero direct AI provider integrations.

| Parameter | Status | Notes |
|-----------|--------|-------|
| Interface contract | ✅ FROZEN | TRS TR-011–TR-015; Architecture §A9. Payload schema, auth mechanism (Bearer `AIMC_SERVICE_TOKEN`), circuit breaker pattern, telemetry fields — all frozen. |
| Dependency direction | MMM → AIMC (consumer only) | MMM is producer of context; AIMC is the AI router. MMM does not own AI provider relationships. |
| AIMC deployment availability | ⚠️ ASSUMED — not confirmed for this wave | AIMC is an existing Maturion platform component (CS2-managed). Exact deployment URL (`AIMC_BASE_URL`) must be confirmed and provisioned by CS2 before Stage 12. |
| `AIMC_SERVICE_TOKEN` provisioned | ⚠️ NOT YET — required before Stage 12 | CS2 must generate and provision the MMM → AIMC service token before build wave integration testing. |
| Mock/stub acceptable | YES — for unit and integration tests | Integration tests may use a mock AIMC interceptor. E2E and staging tests require live AIMC. |
| Operational risk (AIMC unavailable) | MEDIUM — AI features degraded; core assessment (non-AI) still functional | Circuit breaker (TR-009) ensures AIMC failures do not cause unhandled exceptions. Fallback UI presented. |
| Non-AI assessment path | AVAILABLE — users can respond to criteria and upload evidence without AI evaluation | AI evaluation is a value-add, not a mandatory gate for assessment completion. |
| Pre-Stage-12 action | CS2 must confirm `AIMC_BASE_URL` value and provision `AIMC_SERVICE_TOKEN` for staging environment. | Blocking for E2E tests and final acceptance, not for Stage 8–11 planning stages. |

**Dependency Status: CONTRACT CONFIRMED — CREDENTIALS REQUIRED BEFORE STAGE 12**

---

## 2. PIT (Penetration and Implementation Tracker)

**Role in MMM**: PIT receives MMM findings exports. MMM generates findings; PIT consumes
them. MMM does not execute implementation plans.

| Parameter | Status | Notes |
|-----------|--------|-------|
| Interface contract | ✅ FROZEN | TRS TR-016–TR-018; Architecture §A10. Import endpoint URL (`PIT_BASE_URL`), auth mechanism (Bearer `PIT_SERVICE_TOKEN`), payload schema v1.0 (`mmm_export_payload`) — all frozen. |
| Dependency direction | MMM → PIT (producer only) | One-way. PIT does not call back into MMM. |
| PIT deployment availability | ⚠️ ASSUMED — not confirmed for this wave | PIT is an existing Maturion platform component. Exact `PIT_BASE_URL` must be confirmed by CS2 before Stage 12 integration testing. |
| `PIT_SERVICE_TOKEN` provisioned | ⚠️ NOT YET — required before Stage 12 | CS2 must generate and provision the MMM → PIT service token. |
| Mock/stub acceptable | YES — for all local and CI integration tests | Mock PIT endpoint can be used for all integration tests. Live PIT only required for staging E2E. |
| Operational risk (PIT unavailable) | LOW — export path is non-blocking for assessment, findings, and report flows | PIT unavailability must NOT block findings screen or report generation. `mmm_export_jobs.status = 'failed'` is a graceful outcome. |
| Export tracking | `mmm_export_jobs` table tracks all export attempts and outcomes. Export idempotency must be implemented (re-submit on failure). | Architecture §A10 |
| Pre-Stage-12 action | CS2 must confirm `PIT_BASE_URL` and provision `PIT_SERVICE_TOKEN` for staging. | Blocking for staging integration, not for Stage 8–11. |

**Dependency Status: CONTRACT CONFIRMED — CREDENTIALS REQUIRED BEFORE STAGE 12**

---

## 3. KUC (Knowledge Upload Centre — within AIMC scope)

**Role in MMM**: KUC handles all document and evidence uploads for MMM. Both
framework-source uploads (Mode A verbatim) and evidence uploads route through KUC.
MMM creates no parallel upload infrastructure.

| Parameter | Status | Notes |
|-----------|--------|-------|
| Interface contract | ✅ FROZEN | TRS TR-019–TR-020; Architecture §A8. Common upload middleware, document management service shared infrastructure. |
| KUC infrastructure scope | Within AIMC scope — no separate KUC credentials needed | KUC is an internal capability of AIMC infrastructure. MMM accesses KUC via the shared AIMC Edge Function infrastructure. |
| Dependency direction | MMM → KUC (consumer) | MMM uploads; KUC processes and returns document metadata. |
| Availability | ⚠️ CO-DEPENDENT ON AIMC — KUC availability is tied to AIMC deployment | When `AIMC_BASE_URL` is confirmed, KUC availability is implicitly confirmed. |
| Mock/stub acceptable | YES — for unit tests | Mock KUC middleware for unit tests. Integration and E2E tests require active KUC infrastructure. |
| Operational risk (KUC unavailable) | MEDIUM — framework upload (Mode A) and evidence upload blocked; Mode B (AI generation) also affected | Without KUC, no document processing. Assessment sessions that don't require document upload still functional. |
| Upload SLAs | ≤ 3 s to begin processing; ≤ 30 s for metadata extraction (≤ 10 MB files) | TRS TR-006; must be confirmed in staging test |
| Pre-Stage-12 action | No separate action — covered by AIMC readiness confirmation above. | KUC readiness is implicit in AIMC deployment confirmation. |

**Dependency Status: CONTRACT CONFIRMED — NO SEPARATE CREDENTIAL ACTION NEEDED**

---

## 4. Supabase

**Role in MMM**: Supabase is the primary data persistence, authentication, real-time, and
file storage platform for MMM. It is the most critical runtime dependency.

| Parameter | Status | Notes |
|-----------|--------|-------|
| Supabase project availability | ✅ ASSUMED AVAILABLE — platform-level dependency | Supabase is the foundational Maturion ISMS platform. An existing Supabase project exists. |
| `VITE_SUPABASE_URL` provisioned | ⚠️ ENVIRONMENT-SPECIFIC — must be configured per environment | Dev, staging, and production Supabase URLs must be set in Vercel dashboard per environment. |
| `VITE_SUPABASE_ANON_KEY` provisioned | ⚠️ ENVIRONMENT-SPECIFIC | As above. |
| `SUPABASE_SERVICE_ROLE_KEY` provisioned | ⚠️ SECRET — must be set in Vercel dashboard (Edge Functions env) | Secret. Never exposed to frontend. Must be set before Edge Functions can run against Supabase. |
| MMM schema/tables deployed | ⚠️ NOT YET — schema must be deployed before Stage 12 build testing | Architecture §A4 defines all entity schemas. Supabase migration files must be created and deployed as part of Stage 12 build. |
| RLS policies deployed | ⚠️ NOT YET — part of Stage 12 schema migration work | All RLS policies defined in Architecture §A4 must be deployed and tested (see GP-010 NBR-002). |
| Supabase Realtime enabled | ⚠️ CONFIGURATION ACTION REQUIRED | Supabase Realtime must be enabled for `maturity_scores` and `assessments` tables before real-time tests. |
| Supabase Storage buckets | ⚠️ CONFIGURATION ACTION REQUIRED | `mmm-framework-sources` and `mmm-evidence` storage buckets must be created before upload testing. |
| Supabase Auth (email/password) | ⚠️ CONFIGURATION ACTION REQUIRED | Auth provider must be enabled; SMTP configured for confirmation emails; JWT secret configured. |
| Local Supabase CLI | ✅ AVAILABLE — standard Maturion dev tooling | `supabase start` available for local development; standard platform convention. |
| Operational risk (Supabase unavailable) | CRITICAL — entire MMM is non-functional without Supabase | No fallback; Supabase is the foundational layer. |
| Pre-Stage-12 action | Schema migration files produced (Stage 12); Supabase env vars configured; Realtime, Storage, Auth settings confirmed. | BLOCKING for Stage 12 |

**Dependency Status: PLATFORM CONFIRMED — CONFIGURATION AND SCHEMA REQUIRED AT STAGE 12**

---

## 5. Vercel (Frontend Hosting)

**Role in MMM**: Vercel hosts the MMM React SPA frontend. Edge Functions are hosted
on Supabase (not Vercel); Vercel handles SPA routing only.

| Parameter | Status | Notes |
|-----------|--------|-------|
| Vercel availability | ✅ CONFIRMED — Maturion platform already uses Vercel | Existing Vercel project for Maturion ISMS. MMM is an additional deployment target. |
| Vercel project configuration | ⚠️ CONFIGURATION ACTION REQUIRED — MMM-specific Vercel project or monorepo config needed | A new Vercel deployment target for MMM or a monorepo path-based deployment must be configured before Stage 12. |
| Environment variables in Vercel | ⚠️ NOT YET — must be configured per environment (Production, Preview, Development) | All 7 non-Vercel-managed variables must be set in Vercel dashboard before deployment. |
| SPA routing | Standard Vite SPA; Vercel handles routing natively with `vercel.json` rewrites | No special Vercel configuration beyond standard SPA routing required. |
| Vercel preview deployments | ✅ AVAILABLE — per-PR preview deployments via Vercel CI integration | Standard capability; useful for build wave branch testing. |
| Custom domain | ⚠️ PLATFORM DECISION REQUIRED — MMM domain path vs subdomain TBD | Not a Stage 7 blocker; must be decided and configured before production launch. This is a deployment planning item for Stage 12. |
| Operational risk (Vercel unavailable) | HIGH — frontend not accessible | Standard Vercel SLA applies; no application-specific mitigation needed. |
| Pre-Stage-12 action | Vercel project/deployment target configured; env vars set per environment. | BLOCKING for Stage 12 |

**Dependency Status: PLATFORM CONFIRMED — CONFIGURATION REQUIRED AT STAGE 12**

---

## 6. Governance and Control Dependencies

### 6.1 CS2 Authorization Chain

| Control | Status | Notes |
|---------|--------|-------|
| CS2 Stage 7 PBFAG authorization | ✅ CONFIRMED — CS2 opened maturion-isms#1387 | Stage 7 wave-start authorized. |
| IAA Stage 7 PBFAG ASSURANCE-TOKEN | ⚠️ PENDING — issued after IAA Phase 4 final audit | ASSURANCE-TOKEN for this wave required before Stage 8 may begin. |
| CS2 Stage 8 Implementation Plan authorization | ⚠️ PENDING — requires Stage 7 IAA token | Stage 8 wave-start requires Stage 7 token. |

### 6.2 Agent Governance Dependencies

| Dependency | Status | Notes |
|-----------|--------|-------|
| `foreman-v2-agent` contract | ✅ ACTIVE — v6.2.0 | Foreman delegated this wave. |
| `mat-specialist` contract | ✅ ACTIVE — stub v1.0.0 | This wave being produced under mat-specialist mandate. |
| `execution-ceremony-admin-agent` appointment | ⚠️ REQUIRED BEFORE PREHANDOVER | BLOCKER-S7-001: `ceremony_admin_appointed` field must be added to wave-current-tasks by Foreman before PREHANDOVER ceremony. Not a Stage 8 blocker. |
| IAA (independent-assurance-agent) | ✅ ACTIVE — pre-brief complete | Pre-brief confirmed in iaa-wave-record-mmm-stage7-pbfag-20260415.md |

---

## 7. Dependency Still Assumed (Not Yet Confirmed)

The following dependencies are assumed to exist based on platform architecture but have
not been explicitly confirmed as ready for MMM build wave integration:

| Dependency | Assumption | Risk | Required Action |
|-----------|-----------|------|----------------|
| `AIMC_BASE_URL` live endpoint | AIMC is deployed and reachable at a stable URL | MEDIUM | CS2 to confirm URL and provide `AIMC_SERVICE_TOKEN` before Stage 12 |
| `PIT_BASE_URL` live endpoint | PIT is deployed and reachable at a stable URL | LOW | CS2 to confirm URL and provide `PIT_SERVICE_TOKEN` before Stage 12 |
| MMM Supabase schema migration | Schema defined in Architecture §A4 but migration files not yet written | HIGH (blocks all DB testing) | Stage 12 build wave must produce migration files as a first deliverable |
| Supabase Realtime configuration | Realtime enabled on specific MMM tables | MEDIUM | Stage 12 configuration action |
| Supabase Storage buckets | `mmm-framework-sources` and `mmm-evidence` buckets not yet created | MEDIUM | Stage 12 configuration action |
| Vercel MMM project configuration | Vercel project or path-routing for MMM not yet set up | HIGH (blocks frontend deployment) | Stage 12 setup action |

**None of these assumptions constitute a PBFAG blocker** — they are operational
prerequisites for Stage 12, not pre-build governance gate items. They are recorded here
to ensure Stage 8 (Implementation Plan) includes them as explicit build wave prerequisites.

---

## 8. Summary: Dependency Readiness Matrix

| Dependency | Contract Frozen | Available Now | Credentials Ready | Pre-Stage-12 Action |
|-----------|----------------|--------------|------------------|-------------------|
| AIMC | ✅ YES | ⚠️ ASSUMED | ❌ NOT YET | CS2: confirm URL + provision token |
| PIT | ✅ YES | ⚠️ ASSUMED | ❌ NOT YET | CS2: confirm URL + provision token |
| KUC | ✅ YES (via AIMC) | ⚠️ CO-DEPENDENT | N/A | Covered by AIMC action |
| Supabase | ✅ YES | ✅ YES (platform) | ❌ NOT YET (schema/config) | Stage 12: schema migration + config |
| Vercel | ✅ YES | ✅ YES (platform) | N/A (config only) | Stage 12: project config + env vars |

### Overall Assessment

**No confirmed show-stopper dependency gap that blocks Stage 7 PBFAG PASS or Stage 8
Implementation Plan.**

All interface contracts are frozen. All operational dependencies exist at the platform
level. All outstanding items are Stage 12 build wave prerequisites, not pre-build gate
blockers. The Stage 12 implementation plan (Stage 8) must explicitly enumerate these
prerequisites as a mandatory "Day 0" build checklist.

---

*End of MMM Stage 7 — External Dependency Confirmation*

**Produced by**: mat-specialist | **Wave**: mmm-stage7-pbfag-20260415 | **Date**: 2026-04-15
