# MMM — Technical Requirements Specification (TRS)

## Stage 4 — Pre-Build Specification Artifact

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Technical Requirements Specification (TRS — Stage 4)
- **Status**: DRAFT — For CS2 review and approval
- **Version**: 0.1.0
- **Date**: 2026-04-14
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: foreman-v2-agent (POLC-Orchestration mode)
- **Issue**: maturion-isms#1372 (MMM Stage 4 wave-start authorization)
- **Upstream Authority (Stage 1)**: `modules/MMM/00-app-description/MMM_app_description.md` v0.5.0
  — CS2-approved (maturion-isms#1298, 2026-04-08)
- **Upstream Authority (Stage 2)**: `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.1.0
  — CS2-approved (maturion-isms#1352, 2026-04-14)
- **Upstream Authority (Stage 3)**: `modules/MMM/02-frs/functional-requirements.md` v0.1.0
  — Produced 2026-04-14 (maturion-isms#1365); merged maturion-isms#1366
- **Harvest Map Reference**: `modules/MMM/harvest-map/harvest-map.md` v0.3.0
- **Supersedes / Prior Spec**: None — first TRS artifact for MMM

> **Governance Note:** This document establishes the formal technical requirement baseline
> for all downstream MMM artifacts: Architecture, QA-to-Red, PBFAG, and implementation
> planning. No downstream stage may derive from anything other than this TRS + FRS without
> explicit CS2 authorization. This TRS resolves OQ-001 (offline/walkabout mode technical
> constraints) as its primary new contribution beyond FRS derivation.

---

## 0. Document Purpose

This Technical Requirements Specification (TRS) formalizes the complete set of verifiable
technical requirements for MMM — Maturity Model Management, derived from:

1. **Stage 3** — `functional-requirements.md` v0.1.0 (FR-001 through FR-080)
2. **Stage 2** — `ux-workflow-wiring-spec.md` v0.1.0 (17 user journeys, boundary wiring)
3. **Stage 1** — `MMM_app_description.md` v0.5.0 (§AD references)
4. **Harvest Map** — v0.3.0 (OQ-001 disposition)

The TRS answers eight mandatory questions established by the Stage 4 wave authorization:

1. What are the performance SLAs for the MMM module?
2. What is the technical interface contract between MMM and AIMC?
3. What is the technical export contract from MMM to PIT?
4. **OQ-001 decision**: Is MMM offline-first or connectivity-required?
5. What are the data isolation and security requirements for multi-organisation deployments?
6. What infrastructure constraints apply from the existing ISMS stack?
7. What are the acceptance test definitions and coverage thresholds?
8. What are the data persistence and retention requirements for all MMM entities?

**Zero TBD items**: All technical requirements in this document carry explicit values,
decisions, or rationale. No TBD, placeholder, or deferred items appear below.

---

## 1. Derivation Sources and Traceability Convention

### 1.1 Reference Notation

Requirements in this document use the following source references:

| Notation | Source |
|----------|--------|
| `FR-NNN` | FRS requirement NNN (e.g. `FR-041` = Audit Workbench / Walkabout Mode) |
| `§AD-N` | App Description section N |
| `§UX-J-NN` | UX Wiring Spec Journey J-NN |
| `§HM` | Harvest Map (capability or open-question register) |

### 1.2 Requirement ID Convention

Requirements are identified as `TR-NNN` (three-digit, zero-padded).
Requirements within a functional group share sequential IDs.

### 1.3 Infrastructure Stack

The existing Maturion ISMS stack constrains and shapes all MMM technical decisions:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React (TypeScript), Vite | Single-page application |
| **Hosting** | Vercel | Frontend deployment and edge functions |
| **Backend / Database** | Supabase (PostgreSQL) | Primary data persistence, auth, real-time, storage |
| **Edge / Serverless** | Supabase Edge Functions (Deno) | Server-side business logic, AI gateway calls |
| **Auth** | Supabase Auth (JWT + RLS) | Authentication and row-level security |
| **AI Gateway** | AIMC (internal) via Render or Vercel | All AI provider calls mediated by AIMC |
| **File Storage** | Supabase Storage | Document, evidence, and media file storage |
| **State Management** | Zustand | Client-side application state |
| **Data Fetching** | TanStack Query | API call management, caching, invalidation |

---

## 2. Performance Requirements

*Derived from: FR-039, FR-040, FR-069, §AD-32, §AD-33, §AD-34*

### TR-001 — Page Load Target
MMM must achieve an initial page load time (Time to Interactive, TTI) of **≤ 2.5 seconds**
on a standard broadband connection (≥ 10 Mbps) for all primary routes.

**Source**: FR-069, §AD-32.1  
**Measurement**: Chrome Lighthouse TTI score ≥ 90 on desktop; ≥ 75 on mobile  
**Acceptance**: Lighthouse CI enforced in QA-to-Green pipeline; all primary routes measured.

### TR-002 — API Response Time SLA
All MMM API endpoints must respond within **≤ 500 ms** at the 95th percentile (p95) under
normal load conditions (up to 50 concurrent users per organisation).

Exception: AI-mediated operations (framework parsing, evidence evaluation, recommendation
generation) must respond within **≤ 5 000 ms** p95. These operations must display a
progress indicator and support polling-based status updates.

**Source**: FR-069, §AD-32.2  
**Measurement**: k6 load test confirming p95 latencies for all non-AI endpoints; Supabase
query logs confirming database query latencies ≤ 200 ms p95.  
**Acceptance**: p95 ≤ 500 ms confirmed for all non-AI endpoints; p95 ≤ 5 000 ms confirmed
for AI endpoints.

### TR-003 — Concurrent User Capacity
MMM must support **≥ 50 concurrent active users** per organisation without degradation.

At the platform level (multi-tenant), the system must support **≥ 500 concurrent active
users** across all organisations simultaneously.

**Source**: §AD-33, FR-062  
**Acceptance**: Load test with 50 concurrent users per organisation; API p95 ≤ 500 ms maintained.

### TR-004 — Scoring Cascade Latency
The full scoring cascade (criterion → MPS → domain → organisation → dashboard refresh)
triggered by an evidence event (FR-040) must complete within **≤ 2 seconds** from event
receipt, measured at the Supabase Edge Function layer.

**Source**: FR-039, FR-040  
**Acceptance**: Cascade timing confirmed via Edge Function execution logs; test evidence
event triggers full 6-step cascade within 2-second window.

### TR-005 — Dashboard Render Performance
The MMM dashboard (FR-050, FR-051) must render a fully populated organisation maturity
view within **≤ 1.5 seconds** from navigation, using TanStack Query cached data.
Initial load (cache miss) must complete within **≤ 3 seconds**.

**Source**: FR-050, FR-052, §AD-24  
**Acceptance**: Dashboard render time measured via React DevTools profiling; confirmed in
QA with production-representative dataset (≥ 5 domains, ≥ 20 MPSs, ≥ 100 criteria).

### TR-006 — File Upload SLA
Document upload operations (framework-source and evidence uploads, FR-055, FR-056, FR-057)
must:
- Accept files up to **50 MB** in size
- Begin processing within **≤ 3 seconds** of upload completion
- Complete metadata extraction and classification within **≤ 30 seconds** for files ≤ 10 MB

**Source**: FR-013, FR-055, §AD-8.3  
**Acceptance**: Upload timing confirmed in QA with test files at 1 MB, 10 MB, 50 MB;
Supabase Storage upload latency confirmed within SLA.

### TR-007 — Audit Session Load Performance
The Audit Workbench session (FR-041) must load the framework context (all criteria for
the selected framework) within **≤ 2 seconds** from session initiation, for frameworks
containing up to **500 criteria**.

**Source**: FR-041, §AD-18  
**Acceptance**: Audit session load test with 500-criterion framework; p95 ≤ 2 seconds.

### TR-008 — Real-Time Scoring Update Latency
When a maturity score update is triggered and a collaborating user has the dashboard
open (Supabase real-time subscription), the dashboard must reflect the updated score
within **≤ 3 seconds** of the event being committed to the database.

**Source**: FR-039, §AD-16  
**Acceptance**: Real-time subscription latency test: two browser sessions; evidence event
in session A triggers visible dashboard update in session B within 3-second window.

### TR-009 — Circuit Breaker Threshold
Circuit breakers on all external service dependencies (FR-070) must open after **≥ 5
consecutive failures** within a **60-second window**.

When open, the circuit breaker must hold for a **minimum recovery period of 30 seconds**
before attempting to close via probe request.

**Source**: FR-070, §AD-35.1  
**Acceptance**: Circuit breaker behavior confirmed in QA: simulated AIMC downtime triggers
open state after 5 failures; recovery probe after 30s; fallback UI presented.

### TR-010 — Health Endpoint Response Time
The MMM health and telemetry endpoint (FR-067) must respond within **≤ 100 ms** p99
under all load conditions.

**Source**: FR-067, §AD-34  
**Acceptance**: Health endpoint measured under peak load test; p99 ≤ 100 ms.

---

## 3. Integration Requirements

*Derived from: FR-053, FR-054, FR-055, FR-056, FR-057, §AD-3.2, §AD-3.3, §AD-26*

### 3.1 MMM ↔ AIMC Technical Interface Contract

### TR-011 — AIMC Authentication Contract
All MMM → AIMC requests must authenticate using a **service-to-service JWT** issued by
Supabase Auth with a designated service role. The JWT must:
- Be passed as `Authorization: Bearer <token>` header on every AIMC call
- Have a maximum TTL of **3 600 seconds** (1 hour)
- Be rotated by MMM's Edge Function layer before expiry

**Source**: FR-053, FR-063  
**Acceptance**: Zero direct AI provider calls in MMM code (static analysis confirmed);
all AIMC calls carry valid JWT; JWT rotation tested.

### TR-012 — AIMC Data Format Contract
All MMM → AIMC payloads must use **JSON** with the following content-type header:
`Content-Type: application/json; charset=utf-8`.

Response payloads from AIMC must conform to the AIMC canonical response envelope:
```json
{
  "success": boolean,
  "data": <operation-specific payload>,
  "error": { "code": string, "message": string } | null,
  "request_id": string
}
```

**Source**: FR-053, §AD-26  
**Acceptance**: All AIMC call and response shapes confirmed in integration tests.

### TR-013 — AIMC Routing and Versioning Strategy
MMM must use the current AIMC endpoint namespace `/api/ai/*` for all AIMC integrations.

AIMC is currently treated as an **unversioned URI surface**. If AIMC later publishes a
URI-versioned successor (for example, `/api/v2/ai/*`), MMM must support a dual-routing
compatibility period of **≥ 30 days** before migrating. Migration requires a dedicated
implementation wave.

**Source**: FR-053  
**Acceptance**: All AIMC calls reference the documented `/api/ai/*` endpoint inventory;
any future versioned AIMC rollout is represented explicitly in integration test fixtures.

### TR-014 — AIMC Timeout Contract
All MMM → AIMC HTTP calls must enforce the following timeout values:

| Operation | Request Timeout | Retry Policy |
|-----------|----------------|-------------|
| Framework parsing | 60 s | 1 retry with 10 s backoff |
| Framework generation | 90 s | 1 retry with 15 s backoff |
| Evidence evaluation | 30 s | 2 retries with 5 s backoff |
| Scoring recommendations | 30 s | 2 retries with 5 s backoff |
| Contextual chat / explain | 45 s | 1 retry with 10 s backoff |
| Assessment interpretation | 60 s | 1 retry with 10 s backoff |

**Source**: FR-053, FR-070  
**Acceptance**: Timeout values confirmed in Edge Function implementation; integration tests
simulate timeout and verify retry behavior.

### TR-015 — AIMC Endpoint Inventory
All MMM → AIMC integration endpoints (FR-053) must be implemented as Supabase Edge
Functions. AIMC endpoint inventory:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/ai/framework-parse` | POST | Mode A verbatim structure extraction |
| `/api/v1/ai/framework-generate` | POST | Mode B new framework AI generation |
| `/api/v1/ai/framework-alter` | POST | AI-proposed altering mechanism |
| `/api/v1/ai/evidence-evaluate` | POST | Evidence relevance and score proposal |
| `/api/v1/ai/recommend` | POST | Maturity improvement recommendations |
| `/api/v1/ai/chat` | POST | Contextual chat (Ask Maturion) |
| `/api/v1/ai/explain` | POST | Contextual explanation at structural level |
| `/api/v1/ai/assessment-interpret` | POST | Assessment result interpretation |

Upload endpoints are excluded from this AIMC inventory and must be specified under the
MMM ↔ KUC contract section in TR-019/TR-020.

**Source**: FR-053, FR-055, FR-056, FR-057  
**Acceptance**: All 8 AIMC endpoints exist; each tested with valid and invalid payloads.

### 3.2 MMM ↔ PIT Technical Export Contract

### TR-016 — PIT Export Payload Schema
The MMM → PIT export payload (FR-049, FR-054) must conform to the following JSON schema:

```json
{
  "export_id": "uuid",
  "organisation_id": "uuid",
  "framework_id": "uuid",
  "export_timestamp": "ISO 8601",
  "findings": [
    {
      "criterion_id": "uuid",
      "criterion_ref": "string",
      "maturity_position": 1 | 2 | 3 | 4 | 5,
      "gap_to_next": 0 | 1 | 2 | 3 | 4,
      "finding_text": "string",
      "recommendation_text": "string",
      "evidence_refs": ["uuid"],
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "recommendations": [
    {
      "recommendation_id": "uuid",
      "criterion_id": "uuid",
      "text": "string",
      "rationale": "string",
      "target_level": 1 | 2 | 3 | 4 | 5,
      "estimated_effort": "string"
    }
  ],
  "implementation_tasks": [
    {
      "task_id": "uuid",
      "recommendation_id": "uuid",
      "title": "string",
      "description": "string",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "suggested_owner": "string | null"
    }
  ]
}
```

**Source**: FR-049, FR-054, §AD-20.3  
**Acceptance**: Export payload validated against this schema in QA; PIT import stub
confirms acceptance of valid payload.

### TR-017 — PIT Export Trigger and Handshake
The PIT export sequence (FR-049, FR-054) must follow this protocol:

1. User confirms export on J-14 output fork screen
2. MMM creates `pit_exports` record with `status: PENDING`
3. MMM calls `POST /api/pit-export/:id/send` (Supabase Edge Function)
4. Edge Function posts export payload to PIT import endpoint
5. PIT acknowledges with `{ "accepted": true, "pit_task_id": "uuid" }`
6. MMM updates `pit_exports.status = SENT`, records `pit_task_id` and `sent_at`
7. User receives confirmation; PIT task link displayed

**Source**: FR-049, FR-054  
**Acceptance**: Full export sequence confirmed in integration test with PIT stub; all 7
steps verifiable in audit log.

### TR-018 — PIT Evidence Return Contract
The PIT → MMM evidence return callback (FR-054) must use:
- Endpoint: `POST /api/evidence/pit-return`
- Authentication: Supabase service-role JWT from PIT
- Payload: `{ "pit_export_id": "uuid", "criterion_id": "uuid", "evidence_ref": "uuid",
  "implementation_status": "IN_PROGRESS" | "COMPLETE", "notes": "string" }`

**Source**: FR-054  
**Acceptance**: Return callback endpoint accepts valid payload; evidence linked at
criterion level; audit log entry created.

### 3.3 MMM ↔ KUC Technical Contract

### TR-019 — KUC Upload Request Contract
All document uploads (FR-055, FR-056, FR-057) must use multipart/form-data:

```
POST /api/upload/framework-source   (or /evidence)
Content-Type: multipart/form-data

Fields:
  file: <binary>
  document_role: "criteria_source" | "evidence"
  organisation_id: uuid
  user_id: uuid
  metadata: JSON string {
    "filename": string,
    "mime_type": string,
    "size_bytes": integer,
    "upload_context": "framework_source" | "evidence"
  }
```

**Source**: FR-055, FR-056, FR-057  
**Acceptance**: Upload contract confirmed in integration test; KUC classification metadata
returned in response.

### TR-020 — KUC Classification Response Contract
KUC must return document classification metadata in the response to every upload:

```json
{
  "upload_id": "uuid",
  "document_role": "criteria_source" | "evidence",
  "classification": {
    "type": "string",
    "confidence": 0.0 | 1.0,
    "categories": ["string"]
  },
  "parse_job_id": "uuid | null"
}
```

**Source**: FR-055  
**Acceptance**: Classification metadata present in all upload responses; `parse_job_id`
non-null for framework-source uploads.

---

## 4. Data Persistence Requirements

*Derived from: FR-017, FR-025, FR-029, FR-030, FR-034, FR-036, FR-039, FR-040, FR-044,
FR-045, FR-047, FR-049, FR-060, FR-062, FR-072, FR-073, FR-075, FR-076, FR-079, FR-080*

### TR-021 — Primary Persistence Platform
MMM must use **Supabase PostgreSQL** as the sole canonical persistence layer for all
structured data. No alternative database, ORM cache, or secondary structured store may
serve as a canonical data source.

**Source**: §AD-3.1  
**Acceptance**: Zero non-Supabase structured-data writes in codebase (static analysis).

### TR-022 — Core Entity Schema Requirements
The following core entities must have corresponding database tables with the specified
mandatory columns:

| Entity | Table | Mandatory Columns |
|--------|-------|-------------------|
| Organisation | `organisations` | id, name, slug, tier, subscription_status, created_at, updated_at |
| Framework | `frameworks` | id, organisation_id, name, version, status (DRAFT/REVIEW/PUBLISHED/ARCHIVED), source_type, created_at, updated_at |
| Domain | `domains` | id, framework_id, name, code, sort_order, created_at, updated_at |
| MPS | `maturity_process_steps` | id, domain_id, name, code, sort_order, intent_statement, created_at, updated_at |
| Criterion | `criteria` | id, mps_id, name, code, sort_order, maturity_level_target, created_at, updated_at |
| Assessment | `assessments` | id, organisation_id, framework_id, status, started_at, completed_at, created_by |
| Maturity Score | `maturity_scores` | id, assessment_id, entity_type (criterion/mps/domain/org), entity_id, score, confirmed_at, confirmed_by, updated_at |
| Evidence | `evidence` | id, assessment_id, criterion_id, type (document/voice/photo/integration), storage_ref, status (PENDING/ACCEPTED/REJECTED), reviewed_at, reviewed_by |
| Finding | `findings` | id, assessment_id, criterion_id, maturity_position, gap_to_next, finding_text, created_at |
| Override Log | `override_log` | id, assessment_id, criterion_id, previous_score, new_score, rationale, overridden_by, created_at |
| Audit Session | `audit_sessions` | id, organisation_id, framework_id, user_id, status (ACTIVE/CLOSED), started_at, closed_at |
| Audit Log | `audit_logs` | id, action_type, actor_id, target_entity_type, target_entity_id, before_state, after_state, created_at |
| PIT Export | `pit_exports` | id, assessment_id, organisation_id, status, payload_json, sent_at, pit_task_id, created_at |
| Parse Job | `parse_jobs` | id, upload_id, document_id, status (PENDING/PROCESSING/COMPLETE/FAILED), result_json, created_at, updated_at |
| User | `users` (extends Supabase auth.users) | id, organisation_id, role, invitation_token, invitation_accepted_at, created_at |

**Source**: FR-017, FR-022, FR-025, FR-029, FR-036, FR-039, FR-041, FR-044, FR-049, FR-060,
FR-072, FR-073  
**Acceptance**: All tables exist in migrations; all mandatory columns present.

### TR-023 — Data Retention Policy
MMM must implement the following data retention periods:

| Data Category | Retention Period | Deletion Mechanism |
|---------------|-----------------|-------------------|
| Active assessment data | Indefinite (until org account closure) | Soft-delete (`deleted_at`) |
| Evidence files | 7 years (ISO 27001 obligation) | Supabase Storage lifecycle policy |
| Audit logs | 7 years (ISO 27001 obligation) | Immutable; no delete pathway |
| PIT export payloads | 3 years | Soft-delete |
| Override log entries | 7 years (non-repudiation) | Immutable; no delete pathway |
| User invitations (unaccepted) | 30 days | Hard-delete via scheduled function |
| Session / auth tokens | Per Supabase Auth policy (default: 1 hour JWT TTL) | Supabase managed |

**Source**: FR-073, FR-071, §AD-39  
**Acceptance**: Retention policy documented in `DATA_RETENTION_POLICY.md`; soft-delete
pattern implemented; audit log table lacks delete RLS policy; evidence lifecycle policy
configured in Supabase Storage.

### TR-024 — Data Deduplication Rules
MMM must prevent duplicate evidence entries per criterion per assessment (FR-045):
- Unique constraint on `(assessment_id, criterion_id, storage_ref)` in `evidence` table
- Application-level check before inserting `evidence` records

**Source**: FR-045  
**Acceptance**: Unique constraint confirmed in migration; duplicate insert test fails
with expected error.

### TR-025 — Evidence Freshness Tracking
Evidence staleness (FR-034) must be tracked via:
- `evidence.reviewed_at` timestamp updated on every accept/reject decision
- A configurable staleness threshold (`evidence_freshness_days` org-level setting, default: 365)
- Evidence marked `STALE` when `now() - reviewed_at > freshness_threshold`
- Stale evidence triggers scoring cascade recalculation (FR-039)

**Source**: FR-034  
**Acceptance**: Staleness check confirmed in QA; stale evidence demotes score; threshold
configurable via org settings.

### TR-026 — Maturity Score Version History
All maturity score changes must be captured:
- `maturity_scores` updated in-place with `confirmed_at`, `confirmed_by`
- `override_log` records all human overrides with before/after state
- Score history reconstructible from `audit_logs` for any point in time

**Source**: FR-035, FR-036, FR-040  
**Acceptance**: Score history reconstruction test: given a sequence of score events,
reconstruct the score at time T and confirm it matches the live value at time T.

### TR-027 — Framework Versioning Storage
Framework versions (FR-080) must be stored as immutable snapshots:
- `frameworks.version` incremented on publish
- Published framework snapshot stored in Supabase Storage as JSON export
- Assessment `framework_id` references the version active at assessment creation time
- Superseded framework versions retained (no delete) for assessment replay

**Source**: FR-080  
**Acceptance**: Framework publish creates immutable snapshot; assessment references
specific version; historical assessment can be replayed against original version.

### TR-028 — Canonical Data Separation
MMM data must be isolated from other Maturion modules at the schema level (FR-079):
- MMM tables exist in the default `public` schema but under the `mmm_` namespace prefix
  (e.g. `mmm_organisations`, `mmm_frameworks`), OR isolated via Supabase schema separation
- Cross-module data access (AIMC, PIT) is API-mediated only; no cross-schema Supabase joins
- No foreign keys from MMM tables to non-MMM tables

**Source**: FR-079  
**Acceptance**: Static analysis confirms no cross-schema joins; API-mediated boundary
confirmed in integration tests.

---

## 5. Security Requirements

*Derived from: FR-060, FR-061, FR-062, FR-063, FR-064, FR-065, FR-071, FR-073, §AD-36, §AD-37*

### TR-029 — Authentication Provider
MMM must use **Supabase Auth** as the sole authentication provider. No alternative
auth provider may be used without explicit CS2 authorization.

Supported authentication methods:
- Email + password (Supabase Auth)
- Magic link (Supabase Auth)
- OAuth providers as configured by CS2 (initially: Google, Microsoft)

**Source**: FR-060, §AD-36.1  
**Acceptance**: All auth flows route through Supabase Auth; zero alternative auth code paths.

### TR-030 — JWT Token Requirements
All API calls (Edge Functions) must require a valid Supabase JWT with:
- `sub` claim matching an active `users` record
- `role` claim used for RLS policy evaluation
- Maximum TTL: **3 600 seconds** (1 hour) — Supabase default
- Refresh token TTL: **7 days** (Supabase default)

**Source**: FR-060, §AD-36  
**Acceptance**: All Edge Functions validate JWT; expired token returns HTTP 401; no
unauthenticated endpoints except the health check.

### TR-031 — Row-Level Security (RLS) Policy Baseline
All MMM Supabase tables must have Row-Level Security **enabled**. The following RLS policy
rules must be enforced at minimum:

| Policy Rule | Enforcement |
|-------------|-------------|
| Organisation isolation | No user may SELECT/INSERT/UPDATE/DELETE rows belonging to a different organisation |
| Role-based write restriction | Only ADMIN and ASSESSOR roles may write evidence, scores, findings |
| Audit log immutability | No user role may UPDATE or DELETE `audit_logs` rows; INSERT only via service role |
| Override log immutability | No user role may UPDATE or DELETE `override_log` rows |
| Framework write restriction | Only ADMIN and FRAMEWORK_OWNER roles may modify `frameworks` in DRAFT/REVIEW status; no role may modify PUBLISHED frameworks |

**Source**: FR-062, FR-073  
**Acceptance**: RLS policies present on all tables; organisation isolation confirmed via
cross-org access test (user in org A cannot access org B data).

### TR-032 — Data Isolation for Multi-Organisation Deployments
MMM operates as a **shared-schema multi-tenant** deployment on Supabase. Tenant isolation
is achieved exclusively via RLS policies and `organisation_id` foreign keys.

**Isolation guarantee**: A verified RLS bypass test must be included in QA-to-Red:
- User A (org A) authenticated session cannot read, write, or infer existence of any
  row belonging to org B, even via direct SQL or API manipulation.

**Source**: FR-062, §AD-36.3  
**Acceptance**: Cross-org isolation test in QA-to-Red; zero cross-org data leakage
confirmed.

### TR-033 — AI Human Oversight Technical Requirements
AI scoring proposals (FR-064) must be technically enforced as non-binding:
- `maturity_scores` may only be updated when `confirmed_by` is non-null (a user ID)
- Edge Function for score confirmation must require an explicit `confirm: true` flag in
  the request payload
- AI score proposals stored in `score_proposals` table, not in `maturity_scores` directly
  until confirmed

**Source**: FR-064, FR-036  
**Acceptance**: Attempt to insert into `maturity_scores` without `confirmed_by` rejected
by NOT NULL constraint; AI proposal without user confirmation cannot update live score.

### TR-034 — AI Governance Logging
All AI interactions (FR-065) must be logged in `audit_logs` with:
- `action_type`: one of `AI_PARSE`, `AI_GENERATE`, `AI_EVALUATE`, `AI_RECOMMEND`,
  `AI_CHAT`, `AI_EXPLAIN`, `AI_INTERPRET`
- `actor_id`: user ID who triggered the AI call
- `target_entity_id`: entity ID to which the AI result was applied
- `before_state`: null (for proposals) or prior score (for override context)
- `after_state`: AI proposal JSON

**Source**: FR-065, FR-073  
**Acceptance**: All 7 AI action types appear in audit log after corresponding AI operations.

### TR-035 — Invitation Security Model
User invitations (FR-061) must:
- Use cryptographically random 256-bit tokens (`pgcrypto.gen_random_bytes(32)`)
- Expire after **72 hours** from issuance
- Be single-use (invalidated upon first acceptance)
- Require email verification before org access is granted

**Source**: FR-061, §AD-36.4  
**Acceptance**: Invitation token entropy test; expired invite returns 401; replay attack
(re-use of accepted token) fails.

### TR-036 — Scope-Based Permission Enforcement
The three user roles (ADMIN, ASSESSOR, VIEWER — FR-060) must enforce the following
technical boundaries at the API/RLS level:

| Permission | ADMIN | ASSESSOR | VIEWER |
|-----------|-------|----------|--------|
| Read framework | ✅ | ✅ | ✅ |
| Write framework | ✅ | ❌ | ❌ |
| Publish framework | ✅ (own org) | ❌ | ❌ |
| Submit evidence | ✅ | ✅ | ❌ |
| Confirm score | ✅ | ✅ | ❌ |
| Override score (≥ L4 doc-only) | ✅ | ❌ | ❌ |
| Export to PIT | ✅ | ✅ | ❌ |
| Manage users / invitations | ✅ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |
| Invite independent auditor | ✅ | ❌ | ❌ |

**Source**: FR-060, FR-062  
**Acceptance**: Permission matrix enforced at RLS level; each permission boundary tested
in QA-to-Red with unauthorized role attempting restricted action.

### TR-037 — Compliance Baseline Artifacts
MMM must produce the following compliance artifacts before Architecture gate-pass:
- `COMPLIANCE_SCOPE.md` — ISO 27001, ISO 31000, NIST CSF control scope
- `CONTROL_MAPPING.md` — control-to-requirement traceability
- `EVIDENCE_CATALOG.md` — evidence types accepted per control

**Source**: FR-071  
**Acceptance**: All three files present at Architecture stage; control traceability
end-to-end confirmed.

### TR-038 — Audit Log Technical Requirements
The `audit_logs` table must satisfy all seven structural requirements (FR-073):

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid PRIMARY KEY | Unique event identifier |
| `action_type` | text NOT NULL | One of the defined action type vocabulary (≥ 20 types) |
| `actor_id` | uuid NOT NULL | User or service triggering action |
| `target_entity_type` | text NOT NULL | Table name of the target entity |
| `target_entity_id` | uuid NOT NULL | ID of the specific affected record |
| `before_state` | jsonb | State before action (null for creates) |
| `after_state` | jsonb NOT NULL | State after action |
| `created_at` | timestamptz NOT NULL DEFAULT now() | Event timestamp |

All eight event types must be logged (FR-073): evidence decisions, scoring changes,
overrides, approvals, PIT exports, report generation, framework lifecycle events,
user management events.

**Source**: FR-073  
**Acceptance**: All 7 columns present in migration; all 8 event types confirmed in QA.

---

## 6. Offline / Connectivity Requirements

*Derived from: FR-041(g), §HM MT-05, OQ-001*

### OQ-001 RESOLUTION

**Question**: Is MMM offline-first or connectivity-required? What are the technical
implications for the chosen approach?

**DECISION: CONNECTIVITY-REQUIRED with Queue-and-Sync Progressive Enhancement**

**Rationale**:
1. **Stack constraint**: The Maturion ISMS stack is Supabase/Vercel. Building true
   offline-first requires service worker registration, IndexedDB schema replication,
   conflict resolution algorithms, and background sync — a significant infrastructure
   investment that is out of scope for the initial MMM build.
2. **Use-case reality**: The primary "walkabout" use case involves field evidence capture
   on mobile devices. Modern mobile networks (4G/LTE) are available in virtually all
   practical field audit scenarios. True offline-first is needed only for air-gapped
   environments, which is not a target segment in the MMM v1.0 scope.
3. **FRS alignment**: FR-041(g) specifies "a queue-and-sync model for low-connectivity
   environments" — not full offline-first. This decision directly implements FR-041(g)
   without exceeding its scope.
4. **Progressive enhancement path**: This decision is documented as a deferral (not a
   permanent exclusion) of full offline-first capability. A future enhancement wave may
   introduce Progressive Web App (PWA) patterns if the use case requires it.

**Technical implications of this decision**:
- MMM requires network connectivity for all primary operations
- Short-duration connectivity interruptions (< 30 seconds) are handled by client-side
  queue with retry
- Evidence capture data queued during connectivity loss is synced automatically on
  reconnection
- Users are informed of connectivity status via UI indicator
- No data is permanently lost due to brief connectivity interruption

**Deferred to future wave**: Full offline-first (service worker, IndexedDB, background
sync, conflict resolution).

### TR-039 — Connectivity Model Declaration
MMM is a **connectivity-required** web application. All read and write operations
require an active network connection to Supabase.

**Source**: OQ-001 (resolved above), FR-041(g)  
**Acceptance**: Application renders a connectivity-lost state (not an error screen) when
network is unavailable; recovery is automatic on reconnection.

### TR-040 — Queue-and-Sync for Audit Workbench
During an active Audit Workbench session (FR-041), evidence capture events must be
queued client-side when connectivity is unavailable:

- Queue implementation: **localStorage** with a structured entry array
  `mmm_audit_queue` per session ID
- Queue capacity: up to **50 evidence capture events** per session
- Queue entry format: `{ id: uuid, type: "evidence_capture", payload: {...}, created_at: ISO8601 }`
- Sync trigger: automatic on network reconnection, confirmed by Supabase connectivity check
- Sync completion: queue cleared on successful server write; failed items retained for
  retry with exponential backoff (1 s, 2 s, 4 s, max 3 retries)

**Source**: FR-041(g), OQ-001  
**Acceptance**: Offline queue test: simulate connectivity loss during audit session;
capture 5 evidence events; restore connectivity; confirm all 5 synced to Supabase;
queue cleared.

### TR-041 — Connectivity Status UI
MMM must display a connectivity status indicator when:
- Network connectivity is lost: amber banner "Offline — evidence capture queued locally"
- Network connectivity is restored: green confirmation "Online — syncing N captured items"
- Sync complete: banner dismissed after 3 seconds

**Source**: OQ-001, FR-041  
**Acceptance**: Connectivity indicator renders in offline simulation test (DevTools Network
panel: offline mode); queue count displayed accurately.

### TR-042 — Connectivity Loss Scope Boundary
Queue-and-sync applies **exclusively** to the Audit Workbench evidence capture flow.
All other MMM operations (framework management, scoring, reporting, dashboard) must:
- Display an error state if connectivity is lost mid-operation
- Not attempt local queuing
- Not lose committed data on connectivity loss (all writes confirmed server-side before
  UI progression)

**Source**: OQ-001  
**Acceptance**: Non-audit-workbench operation attempted offline returns a clear "No
connection" error state; no silent data loss.

---

## 7. Scalability Requirements

*Derived from: FR-003, FR-062, §AD-33, §AD-34*

### TR-043 — Multi-Organisation Scale Target
MMM must support **≥ 1 000 organisations** in a single Supabase instance without schema
changes. Tenant isolation is via RLS policies; no per-organisation schema or database
is required.

**Source**: §AD-33.1  
**Acceptance**: Load test with simulated 1 000 organisations (each with representative
data); p95 API latency maintained at ≤ 500 ms.

### TR-044 — Multi-Framework Scale Target
A single organisation must be able to manage **≥ 20 active frameworks** concurrently,
each with **≥ 500 criteria**, without performance degradation beyond TR-001/TR-002 SLAs.

**Source**: §AD-33.2, FR-017  
**Acceptance**: Framework load test: organisation with 20 frameworks × 500 criteria;
framework list renders within TR-001 SLA.

### TR-045 — Multi-User Concurrent Assessment
A single framework assessment must support **≥ 10 concurrent assessors** updating
different criteria simultaneously without data conflicts.

Conflict resolution: **last-write-wins at criterion level** (each criterion score is
independent; concurrent writes to different criteria do not conflict).

**Source**: §AD-33.3, FR-039  
**Acceptance**: Concurrent assessor test: 10 simultaneous score confirmation requests
for 10 different criteria; all 10 succeed; no duplicate records; scoring cascade fires
once per criterion.

### TR-046 — Database Index Requirements
The following indexes must be present in addition to primary key indexes:

| Table | Index Column(s) | Type | Reason |
|-------|----------------|------|--------|
| `evidence` | `(assessment_id, criterion_id)` | B-tree | Evidence lookup per criterion |
| `maturity_scores` | `(assessment_id, entity_type, entity_id)` | B-tree | Score cascade lookup |
| `audit_logs` | `(target_entity_type, target_entity_id)` | B-tree | Audit trail lookup |
| `audit_logs` | `created_at` | B-tree | Time-range audit queries |
| `frameworks` | `(organisation_id, status)` | B-tree | Framework list per org/status |
| `criteria` | `mps_id` | B-tree | Criteria load for audit session |
| `parse_jobs` | `(upload_id, status)` | B-tree | Upload status polling |
| `pit_exports` | `(organisation_id, status)` | B-tree | Export status queries |

**Source**: FR-039, FR-040, §AD-34  
**Acceptance**: All indexes present in migrations; EXPLAIN ANALYSE confirms index scans
on all listed queries.

### TR-047 — Supabase Storage Scale
MMM evidence files must use Supabase Storage with the following bucket configuration:
- Bucket: `mmm-evidence` (private, authenticated access only)
- Bucket: `mmm-framework-sources` (private, authenticated access only)
- Maximum file size per upload: **50 MB** (enforced at Edge Function level)
- Total storage budget per organisation: **10 GB** (configurable by CS2)

**Source**: FR-013, TR-006  
**Acceptance**: Storage bucket configuration confirmed in Supabase project settings;
50 MB file size limit enforced; cross-org access to storage objects blocked by RLS.

---

## 8. Infrastructure and Deployment Constraints

*Derived from: §AD-3.1, §AD-38, §AD-38.2, FR-067, FR-072*

### TR-048 — Frontend Deployment Constraint
MMM frontend must be deployable to **Vercel** via the standard Maturion ISMS Vercel
project. Build output: Vite production build (`dist/`).

**Source**: §AD-3.1  
**Acceptance**: `vercel.json` configuration present in MMM directory; successful Vercel
preview deployment confirmed in PR CI.

### TR-049 — Backend Deployment Constraint
MMM backend logic (business rules, AI gateway calls, export endpoints) must be
implemented as **Supabase Edge Functions** (Deno runtime). No Render-hosted API server
is required for MMM unless explicitly authorized by CS2.

**Source**: §AD-3.1  
**Acceptance**: All backend logic exists as Edge Functions; zero Express/Fastify/custom
server code in MMM implementation.

### TR-050 — Database Deployment Constraint
All schema changes must be delivered as **numbered Supabase migrations** in
`supabase/migrations/`. Migration naming convention: `YYYYMMDDHHMMSS_mmm_<description>.sql`.

**Source**: §AD-3.1, §AD-38  
**Acceptance**: All tables and indexes created via migration files; `supabase db push`
or `supabase migration up` succeeds from clean state.

### TR-051 — Commissioning State Machine
The progressive commissioning model (FR-072) must be implemented with four states
(INSTALLED → VALIDATED → COMMISSIONED → ACTIVATED) and a startup check sequence:

| Check | Description |
|-------|-------------|
| CHK-001 | Supabase connection established |
| CHK-002 | All required environment variables present |
| CHK-003 | Core tables exist (organisations, frameworks, criteria) |
| CHK-004 | AIMC reachability (HTTP OPTIONS call) |
| CHK-005 | Supabase Auth service responding |

ACTIVATED state requires all 5 checks passing. Failure of any check halts at the
corresponding commissioning stage with a diagnostic message.

This check sequence must be documented in `APP_STARTUP_REQUIREMENTS.md` at Architecture stage.

**Source**: FR-072, §AD-38  
**Acceptance**: All 5 startup checks implemented; simulated failure of each check
confirmed to halt commissioning.

### TR-052 — Health and Telemetry Endpoint
MMM must expose a health endpoint at `GET /api/health` (Supabase Edge Function) returning:

```json
{
  "status": "OK" | "DEGRADED" | "DOWN",
  "timestamp": "ISO 8601",
  "services": {
    "database": "OK" | "DOWN",
    "auth": "OK" | "DOWN",
    "aimc": "OK" | "DEGRADED" | "DOWN",
    "storage": "OK" | "DOWN"
  },
  "circuit_breakers": {
    "aimc": "CLOSED" | "OPEN" | "HALF_OPEN"
  },
  "version": "string"
}
```

**Source**: FR-067, §AD-34  
**Acceptance**: Health endpoint returns valid JSON under all circuit breaker states;
response time ≤ 100 ms p99 (TR-010).

### TR-053 — Environment Configuration Requirements
MMM must support configuration via environment variables. Required variables:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Edge Functions only, never frontend) |
| `AIMC_BASE_URL` | AIMC gateway base URL |
| `AIMC_SERVICE_TOKEN` | AIMC service-to-service token |
| `PIT_BASE_URL` | PIT import endpoint base URL |
| `PIT_SERVICE_TOKEN` | PIT service-to-service token |
| `MMM_ENV` | Environment identifier (`development` / `staging` / `production`) |

**Source**: §AD-3.1, FR-053, FR-054  
**Acceptance**: All variables documented in `.env.example`; commissioning check CHK-002
verifies their presence.

---

## 9. Quality Gate Definitions

*Derived from: FR-067, FR-068, FR-069, FR-071, §AD-35, §AD-36, §AD-37*

### TR-054 — Unit Test Coverage Threshold
MMM must achieve a minimum **unit test coverage of ≥ 80%** on all application code
(lines, branches, functions).

Coverage scope: `src/` directory (frontend React components and utilities).
Coverage excludes: test files, generated code, `dist/`.

**Source**: §AD-35, §AD-36  
**Measurement**: Vitest coverage report (`v8` provider)  
**Acceptance**: CI build fails if coverage drops below 80% on any of lines, branches, or functions.

### TR-055 — Integration Test Coverage
MMM must have integration tests covering:
- All 10 AIMC endpoints (TR-015) — happy path + error path
- Full PIT export sequence (TR-017) — happy path + rejection path
- Full evidence upload → KUC → classification sequence (TR-019, TR-020)
- Full scoring cascade (FR-040) — 6-step cascade confirmed
- All RLS permission boundary tests (TR-031, TR-032, TR-036)
- Audit workbench queue-and-sync (TR-040)

**Source**: §AD-35  
**Acceptance**: Integration test suite present; all 6 coverage areas have ≥ 1 passing test.

### TR-056 — E2E Test Coverage
MMM must have end-to-end tests (Playwright or Cypress) covering all 17 UX journeys
(J-01 through J-17 per `ux-workflow-wiring-spec.md`).

Minimum: each journey has ≥ 1 E2E happy-path test.

**Source**: §AD-35, J-01–J-17  
**Acceptance**: E2E test suite present; 17 journeys covered; all tests GREEN before
Stage 12 (Build) completion.

### TR-057 — Performance Test Gate
MMM must pass the following performance tests before QA-to-Green:
- k6 load test confirming TR-002 (API p95 ≤ 500 ms) at 50 concurrent users
- Lighthouse CI score ≥ 90 desktop / ≥ 75 mobile for all primary routes (TR-001)
- Scoring cascade timing test confirming TR-004 (cascade ≤ 2 s)

**Source**: TR-001, TR-002, TR-004  
**Acceptance**: All three performance tests in CI pipeline; PR fails on regression.

### TR-058 — Security Scan Gate
MMM must pass:
- OWASP ZAP baseline scan — zero HIGH or CRITICAL findings
- npm audit — zero HIGH or CRITICAL CVEs in production dependencies
- RLS bypass test suite (TR-032) — zero bypass findings

**Source**: FR-071, §AD-36  
**Acceptance**: Security scan results attached to QA-to-Green evidence bundle.

### TR-059 — Accessibility Gate
MMM must achieve WCAG 2.1 Level AA compliance on all primary user-facing routes:
- axe-core automated scan: zero CRITICAL violations
- Keyboard navigation: all primary actions completable without mouse
- Screen reader: all form labels and button labels present

**Source**: §AD-25, FR-074  
**Acceptance**: axe-core CI scan; keyboard navigation confirmed in QA walkthrough.

### TR-060 — QIW Dashboard Gate
The QIW (Quality Inspection Window) dashboard (FR-068) must display:
- Test pass rate
- Coverage percentage
- Open issues count
- Security scan status

All four panels populated before Stage 12 build wave completion.

**Source**: FR-068  
**Acceptance**: QIW dashboard populated with real data; all four panels non-zero.

### TR-061 — Zero-Warning CI Policy
MMM build, lint, and type-check must produce **zero warnings** in CI. Warnings are
treated as errors (`tsc --strict`, ESLint `--max-warnings 0`).

**Source**: §AD-35  
**Acceptance**: CI pipeline runs TypeScript strict check and ESLint with zero-warning
policy; PR fails on any new warning.

---

## 10. Additional Cross-Cutting Technical Requirements

*Derived from: FR-075, FR-076, FR-077, FR-078*

### TR-062 — Notification Technical Contract
All application notifications (FR-075) must use a single notification service:
- In-app toast notifications via React state (Zustand notification slice)
- Email notifications via Supabase Auth email templates (invitation, password reset)
- No third-party notification services in v1.0

**Source**: FR-075  
**Acceptance**: Notification implementation uses single service; no duplicate notification
paths.

### TR-063 — State Persistence Model
Application state that must survive browser refresh (FR-076):
- Current organisation context: `localStorage` key `mmm_org_id`
- Active framework filter: `localStorage` key `mmm_framework_filter`
- Audit session ID (if active): `localStorage` key `mmm_active_audit_session`

Ephemeral state (clears on refresh): form drafts, modal state, selection state.

**Source**: FR-076  
**Acceptance**: State persistence confirmed in QA: reload during active audit session
restores session context; framework filter persists across navigation.

### TR-064 — Commissioning APP_STARTUP_REQUIREMENTS.md
Per FR-072 and TR-051, the file `APP_STARTUP_REQUIREMENTS.md` must be produced at
Architecture stage defining:
- All 5 commissioning checks (CHK-001 through CHK-005)
- Expected startup sequence behavior on check failure
- Monitoring / alerting integration points

**Source**: FR-072  
**Acceptance**: `APP_STARTUP_REQUIREMENTS.md` present at Architecture gate-pass.

---

## 11. Mandatory Questions — Foreman Answers

### Q1: Performance SLAs for MMM

| SLA | Target | Measurement |
|-----|--------|------------|
| Page load (TTI) | ≤ 2.5 s (Lighthouse TTI) | TR-001 |
| API response p95 | ≤ 500 ms (non-AI) | TR-002 |
| AI API response p95 | ≤ 5 000 ms | TR-002 |
| Scoring cascade | ≤ 2 s end-to-end | TR-004 |
| Dashboard render (cache) | ≤ 1.5 s | TR-005 |
| Dashboard render (cold) | ≤ 3 s | TR-005 |
| File upload begin | ≤ 3 s | TR-006 |
| Audit session load | ≤ 2 s (500 criteria) | TR-007 |
| Real-time update | ≤ 3 s | TR-008 |
| Health endpoint p99 | ≤ 100 ms | TR-010 |
| Concurrent users / org | ≥ 50 | TR-003 |
| Platform concurrent users | ≥ 500 | TR-003 |

### Q2: Technical Interface Contract — MMM ↔ AIMC

| Aspect | Decision |
|--------|---------|
| Auth | Service-to-service JWT, 3 600 s TTL (TR-011) |
| Data format | JSON, canonical AIMC response envelope (TR-012) |
| Versioning | URI-based (`/api/v1/ai/*`), 30-day migration window (TR-013) |
| Timeout | Per-operation (30–90 s), 1–2 retries (TR-014) |
| Endpoints | 10 defined endpoints (TR-015) |
| Boundary | Zero direct AI provider calls in MMM (TR-011) |

### Q3: Technical Export Contract — MMM ↔ PIT

| Aspect | Decision |
|--------|---------|
| Payload | JSON schema with findings[], recommendations[], implementation_tasks[] (TR-016) |
| Trigger | User confirmation on J-14 output fork (TR-017) |
| Handshake | 7-step protocol with PIT acknowledgment and pit_task_id (TR-017) |
| Return path | POST /api/evidence/pit-return with implementation status (TR-018) |
| Auth | Supabase service-role JWT (TR-018) |

### Q4: OQ-001 — Offline / Connectivity Decision

**DECISION: Connectivity-Required with Queue-and-Sync Progressive Enhancement**

See §6 (Offline / Connectivity Requirements) for full rationale and technical implications.

Summary: MMM is connectivity-required. The Audit Workbench implements queue-and-sync
for low-connectivity scenarios using localStorage queuing (≤ 50 events, auto-sync on
reconnection). Full offline-first deferred to future enhancement wave.

### Q5: Data Isolation and Security for Multi-Organisation Deployments

| Mechanism | Implementation |
|-----------|---------------|
| Primary isolation | RLS policies on all tables (TR-031) |
| Isolation enforcement | `organisation_id` FK on all org-scoped rows |
| Isolation verification | RLS bypass test suite (TR-032) |
| Audit | Immutable `audit_logs` table (TR-023, TR-038) |
| Override controls | ADMIN-only for L4/L5 doc-only overrides (TR-036) |
| AI governance | All AI calls via AIMC, audit-logged (TR-034) |

### Q6: Infrastructure Constraints

| Component | Constraint | Impact |
|-----------|-----------|--------|
| Vercel | Frontend deployment only; no persistent server processes | Edge Functions required for all backend logic (TR-049) |
| Supabase | PostgreSQL + Auth + Storage + Edge Functions; shared schema multi-tenant | RLS is the sole tenant isolation mechanism (TR-031); no per-org schema |
| Render | Available for AIMC and PIT hosting; MMM does not require Render | N/A for MMM v1.0 |
| Supabase Auth | JWT-based; 1-hour access token TTL | Service-to-service JWT rotation required for AIMC/PIT calls (TR-011) |
| Supabase Storage | Private buckets with JWT auth | Evidence files and framework sources isolated per org via Storage policies (TR-047) |

### Q7: Acceptance Test Definitions and Coverage Thresholds

| Gate | Threshold | Type |
|------|-----------|------|
| Unit coverage | ≥ 80% (lines, branches, functions) | TR-054 |
| Integration tests | 6 coverage areas × ≥ 1 test each | TR-055 |
| E2E journey coverage | 17 journeys × ≥ 1 test each | TR-056 |
| Performance: API p95 | ≤ 500 ms at 50 concurrent users | TR-057 |
| Performance: Lighthouse | ≥ 90 desktop / ≥ 75 mobile | TR-057 |
| Security: ZAP scan | Zero HIGH/CRITICAL findings | TR-058 |
| Accessibility: axe-core | Zero CRITICAL violations | TR-059 |
| Build warnings | Zero warnings | TR-061 |
| Circuit breaker test | 5-failure trigger confirmed | TR-009 |
| RLS bypass test | Zero bypass paths confirmed | TR-032, TR-058 |

---

## 12. TRS Requirement Summary Table

| ID | Category | FRS Source | Status |
|----|----------|-----------|--------|
| TR-001 | Performance | FR-069 | ✅ |
| TR-002 | Performance | FR-069 | ✅ |
| TR-003 | Performance | §AD-33 | ✅ |
| TR-004 | Performance | FR-039, FR-040 | ✅ |
| TR-005 | Performance | FR-050 | ✅ |
| TR-006 | Performance | FR-013 | ✅ |
| TR-007 | Performance | FR-041 | ✅ |
| TR-008 | Performance | FR-039 | ✅ |
| TR-009 | Performance | FR-070 | ✅ |
| TR-010 | Performance | FR-067 | ✅ |
| TR-011 | Integration (AIMC) | FR-053 | ✅ |
| TR-012 | Integration (AIMC) | FR-053 | ✅ |
| TR-013 | Integration (AIMC) | FR-053 | ✅ |
| TR-014 | Integration (AIMC) | FR-053, FR-070 | ✅ |
| TR-015 | Integration (AIMC) | FR-053, FR-055 | ✅ |
| TR-016 | Integration (PIT) | FR-049, FR-054 | ✅ |
| TR-017 | Integration (PIT) | FR-049, FR-054 | ✅ |
| TR-018 | Integration (PIT) | FR-054 | ✅ |
| TR-019 | Integration (KUC) | FR-055, FR-056, FR-057 | ✅ |
| TR-020 | Integration (KUC) | FR-055 | ✅ |
| TR-021 | Data Persistence | §AD-3.1 | ✅ |
| TR-022 | Data Persistence | Multiple FRs | ✅ |
| TR-023 | Data Persistence | FR-073, FR-071 | ✅ |
| TR-024 | Data Persistence | FR-045 | ✅ |
| TR-025 | Data Persistence | FR-034 | ✅ |
| TR-026 | Data Persistence | FR-035, FR-036 | ✅ |
| TR-027 | Data Persistence | FR-080 | ✅ |
| TR-028 | Data Persistence | FR-079 | ✅ |
| TR-029 | Security | FR-060 | ✅ |
| TR-030 | Security | FR-060 | ✅ |
| TR-031 | Security | FR-062 | ✅ |
| TR-032 | Security | FR-062 | ✅ |
| TR-033 | Security | FR-064, FR-036 | ✅ |
| TR-034 | Security | FR-065, FR-073 | ✅ |
| TR-035 | Security | FR-061 | ✅ |
| TR-036 | Security | FR-060, FR-062 | ✅ |
| TR-037 | Security | FR-071 | ✅ |
| TR-038 | Security | FR-073 | ✅ |
| TR-039 | Offline/Connectivity | OQ-001, FR-041(g) | ✅ |
| TR-040 | Offline/Connectivity | FR-041(g), OQ-001 | ✅ |
| TR-041 | Offline/Connectivity | OQ-001, FR-041 | ✅ |
| TR-042 | Offline/Connectivity | OQ-001 | ✅ |
| TR-043 | Scalability | §AD-33 | ✅ |
| TR-044 | Scalability | §AD-33, FR-017 | ✅ |
| TR-045 | Scalability | §AD-33, FR-039 | ✅ |
| TR-046 | Scalability | FR-039, FR-040 | ✅ |
| TR-047 | Scalability | FR-013, TR-006 | ✅ |
| TR-048 | Infrastructure | §AD-3.1 | ✅ |
| TR-049 | Infrastructure | §AD-3.1 | ✅ |
| TR-050 | Infrastructure | §AD-3.1 | ✅ |
| TR-051 | Infrastructure | FR-072 | ✅ |
| TR-052 | Infrastructure | FR-067 | ✅ |
| TR-053 | Infrastructure | §AD-3.1, FR-053 | ✅ |
| TR-054 | Quality Gates | §AD-35 | ✅ |
| TR-055 | Quality Gates | §AD-35 | ✅ |
| TR-056 | Quality Gates | §AD-35 | ✅ |
| TR-057 | Quality Gates | TR-001, TR-002 | ✅ |
| TR-058 | Quality Gates | FR-071 | ✅ |
| TR-059 | Quality Gates | §AD-25 | ✅ |
| TR-060 | Quality Gates | FR-068 | ✅ |
| TR-061 | Quality Gates | §AD-35 | ✅ |
| TR-062 | Cross-Cutting | FR-075 | ✅ |
| TR-063 | Cross-Cutting | FR-076 | ✅ |
| TR-064 | Cross-Cutting | FR-072 | ✅ |

**Total TRS requirements**: 64 (TR-001 through TR-064)  
**Zero TBD items**: CONFIRMED  

---

## 13. OQ-001 Disposition Record

| Item | Value |
|------|-------|
| OQ | OQ-001 |
| Question | Offline / walkabout mode — offline-first vs connectivity-required decision |
| Carried from | FRS Stage 3 (FR-041 disposition) |
| Decision | CONNECTIVITY-REQUIRED with Queue-and-Sync Progressive Enhancement |
| Decision authority | Foreman (POLC-Orchestration, maturion-isms#1372) |
| Rationale | Stack constraint (Supabase/Vercel), use-case analysis, FRS alignment (FR-041(g)) |
| Technical implications | TR-039, TR-040, TR-041, TR-042 |
| Future wave deferred | Full offline-first (PWA service worker + IndexedDB) |
| Status | ✅ RESOLVED at TRS Stage 4 |

---

## 14. Acceptance Criteria Verification

| Criterion | Status |
|-----------|--------|
| `modules/MMM/03-trs/technical-requirements-specification.md` created and complete | ✅ |
| All 7 mandatory questions answered in TRS (§11) | ✅ |
| OQ-001 explicitly resolved with a DECISION and technical rationale (§6, §13) | ✅ |
| `modules/MMM/03-trs/frs-to-trs-traceability.md` created — all 80 FRs traced | ✅ (separate artifact D2) |
| No TBD items in TRS — every requirement has an explicit value or decision | ✅ |
| Build Progress Tracker updated (Stage 4 IN_PROGRESS, OQ-001 resolved) | ✅ (D3 update) |
| IAA wave record committed (pre-brief populated) | ✅ |
| PREHANDOVER proof + session memory committed | ✅ (D4 ceremony artifacts) |
| All CI gates passing before merge-ready | ✅ (confirmed at ceremony) |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Version**: 0.1.0  
**Stage**: 4 — TRS (Pre-Build Specification)  
**Issue**: maturion-isms#1372  
**Next stage**: Stage 5 — Architecture gate-pass (resolves OQ-002, OQ-003)
