# MMM — Stage 8 Implementation Plan

## Stage 8 — Pre-Build Specification Artifact

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Implementation Plan (Stage 8)
- **Status**: COMPLETE
- **Version**: 1.0.0
- **Date**: 2026-04-17
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (delegated by foreman-v2-agent v6.2.0)
- **Issue**: [maturion-isms#1400](https://github.com/APGI-cmy/maturion-isms/issues/1400)
- **Wave**: mmm-stage8-implementation-plan-20260417
- **Branch**: copilot/mmm-stage-8-implementation-plan
- **IAA Pre-Brief**: `.agent-admin/assurance/iaa-wave-record-mmm-stage8-implementation-plan-20260417.md` (SHA 12ba60a) — CLEARED
- **Foreman Session**: session-mmm-stage8-implementation-plan-20260417
- **Upstream Authority (Stage 7)**: `modules/MMM/06-pbfag/pbfag-checklist.md` — IAA token: IAA-session-mmm-stage7-pbfag-20260415-PASS
- **Upstream Authority (Stage 6)**: `modules/MMM/05-qa-to-red/qa-to-red-catalog.md` v0.1.0 — 176 RED tests (T-MMM-S6-001–T-MMM-S6-176)
- **Upstream Authority (Stage 5)**: `modules/MMM/04-architecture/architecture.md`
- **Upstream Authority (Stage 4)**: `modules/MMM/03-trs/technical-requirements-specification.md` v0.1.0 — 66 TRs
- **Upstream Authority (Stage 3)**: `modules/MMM/02-frs/functional-requirements.md` v0.1.0 — 80 FRs
- **Upstream Authority (Stage 2)**: `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.1.0 — 17 journeys
- **Upstream Authority (Stage 1)**: `modules/MMM/00-app-description/MMM_app_description.md` v0.5.0

> **Governance Note**: This document supersedes the partial predecessor artifact
> `concurrent-prebuild-and-legacy-plan.md` (filed 2026-04-08, a concurrent programme
> planning document, not a full build wave decomposition). That artifact remains in this
> folder for historical reference only and MUST NOT be treated as an implementation
> plan for Stage 12 build execution.
>
> All downstream stages (Stage 9: Builder Checklist; Stage 10: IAA Pre-Brief;
> Stage 11: Builder Appointment; Stage 12: Build Execution) derive from THIS document.

---

## 0. Document Purpose

This Implementation Plan answers the eight mandatory planning questions established by
the Stage 8 wave authorization (maturion-isms#1400):

1. **What are the named implementation waves for MMM build execution readiness?** → §2
2. **What is the exact scope of each wave?** → §3 (wave-by-wave breakdown)
3. **Which waves run sequentially, and which can later parallelize?** → §4
4. **What dependencies must be carried into Stage 9 Builder Checklist?** → §5.2
5. **What dependencies must be carried into Stage 10 IAA Pre-Brief?** → §5.3
6. **What builder classes / specialist roles are expected for later stages?** → §6
7. **What is the explicit boundary between planning waves and actual build waves?** → §7
8. **What are the entry conditions for the first lawful Stage 11 builder appointment?** → §5.4

**Anti-Regression Obligations (from Stage 7 PBFAG)**:
This plan incorporates NBR-001 and NBR-002 as mandatory verification requirements
within all build waves in Stage 12 (§3 per-wave and §8):
- **NBR-001**: TanStack Query mutation cache invalidation — all mutation-triggering
  Edge Function calls must invalidate affected TanStack Query cache entries.
- **NBR-002**: Supabase RLS write-block detection — all Edge Functions must surface
  HTTP 403 to the frontend; no silent swallowing of RLS write blocks permitted.

**Zero placeholder waves. Zero TBD scope entries. Zero ambiguous ownership.**
Every wave in this document carries concrete scope, named FRs/TRs/tests, a named
builder class, and explicit completion conditions.

---

## 1. Derivation Sources

### 1.1 Stage Inputs (Frozen)

| Stage | Artifact | Status | Key Output |
|-------|---------|--------|-----------|
| Stage 1 | `MMM_app_description.md` v0.5.0 | ✅ CS2-approved (#1298) | 42 AD sections, product vision |
| Stage 2 | `ux-workflow-wiring-spec.md` v0.1.0 | ✅ CS2-approved (#1352) | 17 UX journeys (J-01–J-17) |
| Stage 3 | `functional-requirements.md` v0.1.0 | ✅ CS2-approved (#1366) | 80 FRs (FR-001–FR-080) |
| Stage 4 | `technical-requirements-specification.md` v0.1.0 | ✅ CS2-approved (#1378) | 66 TRs (TR-001–TR-066) |
| Stage 5 | `architecture.md` | ✅ Artifacts complete; CS2 merge pending | 26 Edge Functions, 25 tables, RLS model, 3 integration boundaries |
| Stage 6 | `qa-to-red-catalog.md` v0.1.0 | ✅ Artifacts complete; CS2 merge pending | 176 RED tests (T-MMM-S6-001–T-MMM-S6-176) |
| Stage 7 | `pbfag-checklist.md` + Golden Path Pack | ✅ IAA token issued (IAA-session-mmm-stage7-pbfag-20260415-PASS) | 10 golden paths, NBR-001/NBR-002, PBFAG PASS |

### 1.2 Architecture Summary (Frozen Inputs for Wave Design)

| Component | Technology | Notes |
|-----------|-----------|-------|
| Frontend | React (TypeScript), Vite | Single-page application on Vercel |
| Backend | Supabase Edge Functions (Deno) | All business logic; 26 named functions |
| Database | Supabase PostgreSQL | 25 tables with `mmm_` prefix; shared schema |
| Auth | Supabase Auth (JWT + RLS) | All tables RLS-enabled without exception |
| State | Zustand + TanStack Query | Client-side state; cache invalidation via NBR-001 |
| Integrations | AIMC (consumer), PIT (producer), KUC (consumer) | 3 frozen external boundaries |

### 1.3 Credential Gap (Non-Blocking for Stages 8–11; Blocking for Stage 12)

The following credentials must be provisioned by CS2 before Stage 12 Build Execution
can lawfully start. They are NOT required for Stages 8–11:

| Credential | Purpose | Required By |
|-----------|---------|------------|
| `AIMC_SERVICE_TOKEN` | Service-to-service JWT for AIMC calls (TR-011) | Wave B7 and any wave wiring AIMC |
| `PIT_SERVICE_TOKEN` | Service JWT for PIT export handshake (TR-017) | Wave B7 (PIT boundary) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for RLS bypass in Edge Functions | Wave B1 onward |
| `SUPABASE_ANON_KEY` | Public anon key for frontend | Wave B3 onward |
| `VITE_SUPABASE_URL` | Supabase project URL | Wave B3 onward |

---

## 2. Named Implementation Waves

The following nine build waves constitute the complete MMM Stage 12 implementation scope.
All waves are build waves (Stage 12). The wave slugs below are the canonical identifiers
for use in Stage 9 Builder Checklist and Stage 10 IAA Pre-Brief.

| Wave | Slug | Name | Builder Class(es) | Sequential Constraint |
|------|------|------|-------------------|----------------------|
| B1 | `mmm-build-wave-b1-schema` | Foundation: Schema, RLS, Migrations | `schema-builder` | First wave; no predecessors |
| B2 | `mmm-build-wave-b2-core-api` | Core API: Auth, Health, Org, Invitations | `api-builder` | After B1 |
| B3 | `mmm-build-wave-b3-core-ui` | Core UI: Onboarding (J-01–J-05) | `api-builder` + `ui-builder` | After B2 |
| B4 | `mmm-build-wave-b4-framework-lifecycle` | Framework Lifecycle (J-06–J-08) | `api-builder` + `ui-builder` | After B3 |
| B5 | `mmm-build-wave-b5-assessment-execution` | Assessment Execution (J-09–J-11) | `api-builder` + `ui-builder` | After B4 |
| B6 | `mmm-build-wave-b6-findings-reporting` | Findings and Reporting (J-12–J-15) | `api-builder` + `ui-builder` | After B5 |
| B7 | `mmm-build-wave-b7-boundary-integrations` | Boundary Integrations (AIMC, PIT, KUC) | `integration-builder` | After B6 |
| B8 | `mmm-build-wave-b8-cross-cutting` | Cross-Cutting: Performance, Security, Governance | `qa-builder` | After B7 |
| B9 | `mmm-build-wave-b9-golden-path-verification` | Integration Verification: Golden Path Proving | `qa-builder` | After B8 (final wave) |

**QA Gating Model**: `qa-builder` runs RED → GREEN gating in parallel with each build wave
(not as a separate sequential step). Each wave is complete only when its designated test
domain reaches GREEN. This is in addition to B8 and B9 which are dedicated QA waves.

---

## 3. Wave-by-Wave Delivery Plan

---

### Wave B1 — Foundation: Schema, RLS, and Migrations

**Slug**: `mmm-build-wave-b1-schema`
**Builder Class**: `schema-builder`

#### 3.1.1 Scope

All Supabase PostgreSQL database infrastructure for MMM, including:

**Tables** (25, all with `mmm_` prefix per TR-028):
`mmm_organisations`, `mmm_frameworks`, `mmm_domains`, `mmm_maturity_process_steps`,
`mmm_criteria`, `mmm_level_descriptors`, `mmm_assessments`, `mmm_maturity_scores`,
`mmm_score_proposals`, `mmm_evidence`, `mmm_findings`, `mmm_override_log`,
`mmm_audit_sessions`, `mmm_audit_logs`, `mmm_pit_exports`, `mmm_parse_jobs`,
`mmm_ai_interactions`, `mmm_profiles`, `mmm_user_preferences`,
`mmm_organisation_hierarchy`, `mmm_free_assessments`, `mmm_invitations`,
`mmm_proposed_domains`, `mmm_proposed_mps`, `mmm_proposed_criteria`,
`mmm_parse_ambiguities`

**RLS Policies** (per TR-031–TR-032, Architecture §A5.3):
- All tables: RLS enabled without exception
- Organisation-scoped tables: `organisation_id` must match JWT claim
- Immutable audit tables (`mmm_audit_logs`, `mmm_override_log`): INSERT only via service role; no UPDATE/DELETE RLS pathway
- Score proposals: SELECT by authenticated user in own org; INSERT/UPDATE via service role only
- Free assessment table: INSERT/SELECT by session token (no auth required for these operations)
- Published framework records: No write pathway via RLS (service role compile/publish only)

**Database Indexes** (per TR-046, Architecture §A5.4):
All required indexes as specified in architecture §A5.4 covering high-cardinality query
patterns: `organisation_id`, `framework_id`, `assessment_id`, `criterion_id`,
`actor_id` (audit_logs), `status` (where applicable), composite indexes as declared.

**Data Retention Architecture** (per TR-023):
Immutability constraints for audit logs (7-year, ISO 27001) and override log entries
(7-year, non-repudiation). Scheduled Edge Function stub for invitation expiry (30-day
hard-delete pathway declared in schema but full Edge Function in B2).

**Supabase Storage** (per TR-047):
Storage buckets declared: `mmm-framework-source` (framework documents), `mmm-evidence`
(evidence files), `mmm-exports` (PIT export packages). Bucket policies: authenticated
users in own org; no public access.

**Commissioning State** (per TR-051):
`mmm_commissioning_state` table (if used by commissioning check function) or equivalent
in-schema representation for the 5-check commissioning state machine.

**Seed Data**:
- Five default canonical domains per FR-019 (if pre-seeded at schema level)
- Default org tier configuration records (if applicable per commissioning model)

**Required FRs addressed in this wave**: FR-002, FR-003, FR-079
**Required TRs addressed in this wave**: TR-021, TR-022, TR-023, TR-024, TR-025, TR-026,
TR-027, TR-028, TR-031, TR-032, TR-046, TR-047, TR-050

#### 3.1.2 Out of Scope for B1

- Edge Functions (none deployed in this wave)
- Frontend code (none in this wave)
- AIMC, PIT, KUC integration wiring
- Seed data that requires Edge Function execution
- Authentication provider configuration (Supabase Auth config managed in B2)
- Environment variable configuration at Vercel level (B2)

#### 3.1.3 Dependencies

- No predecessor build waves
- Requires: Supabase project URL and service role key provisioned by CS2
  (`SUPABASE_SERVICE_ROLE_KEY` — see §1.3 Credential Gap)
- Architecture document §A5 (Data Architecture) — frozen input

#### 3.1.4 QA Gating (RED → GREEN for B1)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D9: Security & Compliance (schema/RLS tests) | T-MMM-S6-139–T-MMM-S6-152 (subset) | RLS enforcement, org isolation |
| D10: Infrastructure & Quality Gates (schema/migration tests) | T-MMM-S6-153–T-MMM-S6-164 (subset) | Schema migration, commissioning |

**NBR-002 checkpoint**: At least one dedicated test in this wave must confirm that an attempt
to write across `organisation_id` boundaries is blocked at the RLS level (HTTP 403 returned).

#### 3.1.5 Completion Condition

Wave B1 is complete when:
1. All 25 `mmm_` tables exist in the Supabase schema with correct columns (TR-022)
2. RLS is enabled on all tables (TR-031); verified by `SELECT * FROM pg_policies WHERE tablename LIKE 'mmm_%'` confirming policies exist for all tables
3. All required indexes are deployed (TR-046)
4. Storage buckets exist with correct policies (TR-047)
5. Schema migration is idempotent (re-runnable without error)
6. Designated test subset (D9/D10 schema tests) passes GREEN
7. Foreman schema sign-off recorded

---

### Wave B2 — Core API: Authentication, Health, Organisation, and Invitations

**Slug**: `mmm-build-wave-b2-core-api`
**Builder Class**: `api-builder`

#### 3.2.1 Scope

All foundational Edge Functions required before any UI work can begin:

**Edge Functions deployed in B2**:
- `mmm-health` (`GET /api/health`) — health and telemetry endpoint (TR-052, FR-067)
- `mmm-qiw-status` (`GET /api/qiw/status`) — QIW dashboard API (TR-060, TR-065, FR-068)
- `mmm-org-update` (`PUT /api/organisations/:id`) — organisation update (JWT + ADMIN)
- `mmm-invitation-create` (`POST /api/invitations`) — user invitation (J-16, TR-035)
- `mmm-invitation-accept` (`POST /api/invitations/accept`) — invitation acceptance (TR-035)
- `mmm-commissioning-check` (internal startup) — commissioning state machine (TR-051)

**Auth/JWT foundation** (per TR-029–TR-030):
JWT validation middleware shared across all Edge Functions, implementing Supabase Auth
bearer token validation. Role extraction from JWT claims. ADMIN role guard.

**Audit log write path** (per TR-038):
Service-role write path to `mmm_audit_logs` established for use by all subsequent
Edge Functions. Audit log record format and `action_type` vocabulary defined.

**Invitation security model** (per TR-035):
Expiry enforcement, token-based acceptance flow, ADMIN-only invitation creation.

**Scope-based permission enforcement** (per TR-036):
Middleware establishing organisation-scoped permission checks from JWT claims.

**Environment configuration** (per TR-053):
All required environment variables (Supabase URL, anon key, service role key,
AIMC base URL stub, PIT base URL stub) loaded and validated at function startup.
Startup validation fails loudly if required variables are absent.

**Required FRs**: FR-001, FR-005, FR-060, FR-061, FR-062, FR-067, FR-068
**Required TRs**: TR-029, TR-030, TR-035, TR-036, TR-038, TR-051, TR-052, TR-053,
TR-060, TR-065

#### 3.2.2 Out of Scope for B2

- Frontend code
- Free assessment Edge Functions (in B3)
- Organisation creation Edge Function `mmm-org-create` (in B3, used in J-04)
- Framework initialisation Edge Function `mmm-framework-init` (in B3, used in J-05)
- Framework lifecycle, assessment, scoring, findings Edge Functions (B4–B6)
- AIMC/PIT/KUC boundary wiring (B7)
- UI journeys J-01 through J-17 (B3 onward)

#### 3.2.3 Dependencies

- B1 complete: All tables and RLS policies must exist before Edge Functions attempt writes
- CS2 credential provisioning: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL`

#### 3.2.4 QA Gating (RED → GREEN for B2)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D6: Roles & Permissions | T-MMM-S6-113–T-MMM-S6-120 | ADMIN gate, invitation create/accept, scope permissions |
| D10: Infrastructure (health/commissioning) | T-MMM-S6-153–T-MMM-S6-160 (subset) | Health endpoint, commissioning check, env validation |
| D11: Product Identity & Governance | T-MMM-S6-165–T-MMM-S6-176 (subset) | QIW dashboard, audit log write |

**NBR-002 checkpoint**: Confirm `mmm-invitation-create` returns HTTP 403 (not silent failure)
when caller has insufficient scope.

#### 3.2.5 Completion Condition

Wave B2 is complete when:
1. `GET /api/health` returns `{ "status": "healthy" }` with HTTP 200 (TR-052)
2. Commissioning check passes all 5 gates on startup (TR-051)
3. All JWT middleware tests GREEN (valid JWT accepted; invalid JWT rejected with HTTP 401)
4. Invitation create/accept lifecycle tests GREEN (D6 tests)
5. QIW dashboard endpoint returns well-formed response (TR-065)
6. All B2 Edge Functions start without error in Deno runtime
7. Designated test subset (D6, D10 subset, D11 subset) GREEN

---

### Wave B3 — Core UI: User Entry and Onboarding (J-01–J-05)

**Slug**: `mmm-build-wave-b3-core-ui`
**Builder Class**: `api-builder` + `ui-builder`

#### 3.3.1 Scope

**UX Journeys covered**: J-01 (Pre-Subscription Landing), J-02 (Free Assessment and
Results), J-03 (Subscription and Sign-Up), J-04 (Organisation Onboarding), J-05
(Framework-Origin Decision).

**Edge Functions deployed in B3**:
- `mmm-assessment-free-respond` (`POST /api/assessment/free/respond`) — free assessment submission (J-02)
- `mmm-assessment-free-result` (`GET /api/assessment/free/result`) — free assessment results (J-02)
- `mmm-org-create` (`POST /api/organisations`) — organisation creation (J-04)
- `mmm-framework-init` (`POST /api/frameworks/init`) — framework record initialisation (J-05)

**React UI components and pages**:
- Landing page (`/mmm/` or `/`) — unauthenticated; heading, maturity explanation, CTAs (FR-006)
- Maturity explanation/tutorial page — unauthenticated (FR-006)
- Free assessment flow — domain-level response collection, score calculation, results display,
  subscribe CTA (FR-007, FR-008)
- Subscription and sign-up flow — Supabase Auth sign-up integration (FR-010)
- Organisation onboarding — org name, tier selection (FR-011)
- Framework-origin decision fork — verbatim upload vs new generation vs hybrid (FR-012)
- Connectivity status indicator (TR-041) — global component deployed from B3 onward
- Error boundary strategy (Architecture §A3.9) — deployed as shared component

**Routing** (per Architecture §A3.3): All public routes (`/mmm/`, `/mmm/free-assessment`,
`/mmm/tutorial`) and authenticated onboarding routes (`/mmm/onboarding/*`) declared.
Supabase Auth session management wired.

**State management** (per Architecture §A3.4): Zustand store initialisation; organisation
context slice; user context slice; free assessment session slice.

**Data fetching** (per Architecture §A3.5): TanStack Query provider initialisation; first
hooks for free assessment submission and org creation.

**Required FRs**: FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012
**Required TRs**: TR-001 (page load ≤ 2.5s), TR-029, TR-030, TR-048 (Vercel frontend deployment)

#### 3.3.2 Out of Scope for B3

- Framework lifecycle pages and API (B4)
- Assessment execution pages and API (B5)
- Findings and reporting pages (B6)
- AIMC-powered interpretation on free assessment result (deferred to B7; free assessment
  in B3 uses simplified scoring only, not AIMC)
- Role/permission administration UI (B3 covers sign-up; RBAC admin in B6)
- Notification system (declared in B8)

#### 3.3.3 Dependencies

- B1 complete: `mmm_free_assessments`, `mmm_organisations`, `mmm_frameworks`,
  `mmm_profiles` tables must exist
- B2 complete: Auth JWT middleware, org-update, commissioning check, invitation model in place

#### 3.3.4 QA Gating (RED → GREEN for B3)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D1: User Entry & Onboarding | T-MMM-S6-001–T-MMM-S6-020 | Full J-01 through J-05 |

**NBR-001 checkpoint**: `mmm-org-create` mutation must invalidate TanStack Query cache
entry for organisation list. `mmm-assessment-free-respond` submission must invalidate
free assessment result cache.

**NBR-002 checkpoint**: `mmm-org-create` must return HTTP 403 when caller lacks required
scope; confirmed by dedicated D1 test T-MMM-S6-017 (or equivalent RLS test).

#### 3.3.5 Completion Condition

Wave B3 is complete when:
1. All 20 D1 tests (T-MMM-S6-001–T-MMM-S6-020) GREEN
2. Landing page renders without auth (HTTP 200; no auth cookie required)
3. Free assessment submits domain-level responses and returns `baseline_maturity` score
4. Organisation creation route produces org record in `mmm_organisations`
5. Subscription/sign-up flow creates Supabase Auth user and `mmm_profiles` record
6. Frontend deploys to Vercel staging without error (TR-048)
7. Lighthouse TTI ≤ 2.5s on landing page (TR-001 — initial check)

---

### Wave B4 — Framework Lifecycle: Ingestion, Creation, Activation (J-06–J-08)

**Slug**: `mmm-build-wave-b4-framework-lifecycle`
**Builder Class**: `api-builder` + `ui-builder`

#### 3.4.1 Scope

**UX Journeys covered**: J-06 (Framework Ingestion — Verbatim Upload/Parse), J-07
(Framework Creation — New Generation or Hybrid), J-08 (Framework Review, Approval,
Activation).

**Edge Functions deployed in B4**:
- `mmm-framework-compile` (`POST /api/frameworks/:id/compile`) — compile parsed/proposed → canonical domains/MPS/criteria
- `mmm-framework-publish` (`POST /api/frameworks/:id/publish`) — publish framework (JWT + ADMIN)
- `mmm-upload-framework-source` (`POST /api/upload/framework-source`) — KUC upload proxy for framework documents
- `mmm-ai-framework-parse` (`POST /api/ai/framework-parse`) — AIMC proxy for verbatim parse (Mode A)
- `mmm-ai-framework-generate` (`POST /api/ai/framework-generate`) — AIMC proxy for new framework generation (Mode B)
- `mmm-ai-framework-alter` (`POST /api/ai/framework-alter`) — AIMC proxy for AI alter mechanism

> **Note on AIMC in B4**: In B4, AIMC calls use stub responses (circuit breaker in OPEN
> state by default in dev/test). Real AIMC wire with live tokens happens in B7. B4
> verifies the full flow end-to-end using stubs.

**React UI pages and components**:
- Framework source upload page — document upload UI, role classification (FR-014, FR-015)
- Verbatim parse mode (Mode A) — upload → parse job → parse result display → Domain/MPS/Criteria proposal review (FR-020, FR-021)
- New framework generation (Mode B) — AI-guided framework proposal, alter mechanism (FR-022, FR-023)
- Hybrid framework mode (FR-028) — timing and decision UI
- Intent statement display (FR-024)
- Criteria card component (FR-025)
- Three-tier review and approval workflow (FR-026) — Domain Expert, Framework Owner, Org Admin roles
- Framework compilation — proposed → canonical promotion (FR-017, FR-018)
- Framework publication (FR-027)
- Parse ambiguity resolution UI (Architecture §A5.2 `mmm_parse_ambiguities`)
- Framework version history (FR-080, TR-027)

**Business logic (Edge Functions)**:
- Hierarchy validation (FR-017): Domain → MPS → Criteria; minimum 1 MPS per domain; minimum 1 criterion per MPS
- Hierarchical numbering rule (FR-018): Auto-assigned codes during compilation
- No-hallucination enforcement (FR-021): AIMC parse response must be verbatim extraction, not generation; validation layer in Edge Function
- Five default canonical domains (FR-019): Seeded or created during framework init
- FR-016: Framework-source vs evidence-source pipeline separation enforced at Edge Function routing level

**Required FRs**: FR-013–FR-028, FR-056, FR-059, FR-080
**Required TRs**: TR-006 (file upload SLA ≤ 30s), TR-019 (KUC upload contract — stubbed), TR-020 (KUC classification response — stubbed), TR-027 (framework versioning)

#### 3.4.2 Out of Scope for B4

- Evidence upload (uses same KUC mechanism but in B5)
- Assessment execution against the published framework (B5)
- Findings derived from assessment (B6)
- Full KUC live wire with production tokens (B7)
- Full AIMC live wire with production tokens (B7)
- Framework ingestion via AIMC using live `AIMC_SERVICE_TOKEN` (B7 wires live; B4 uses stub)

#### 3.4.3 Dependencies

- B1 complete: `mmm_frameworks`, `mmm_domains`, `mmm_maturity_process_steps`, `mmm_criteria`,
  `mmm_level_descriptors`, `mmm_proposed_domains`, `mmm_proposed_mps`, `mmm_proposed_criteria`,
  `mmm_parse_jobs`, `mmm_parse_ambiguities` tables exist with correct RLS
- B2 complete: Auth middleware, ADMIN role guard, audit log write path
- B3 complete: Framework-origin decision fork (J-05) is B3's completion; B4 begins from J-06

#### 3.4.4 QA Gating (RED → GREEN for B4)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D2: Framework Lifecycle — Ingestion | T-MMM-S6-021–T-MMM-S6-050 | Full J-06 through J-08 |

**NBR-001 checkpoint**: Framework publication (`mmm-framework-publish`) must invalidate
framework list query cache. Framework compilation must invalidate proposed-domains and
canonical-domains cache entries.

**NBR-002 checkpoint**: Framework publish must return HTTP 403 (not silent failure) when
called without ADMIN role — confirmed by dedicated test in D2.

#### 3.4.5 Completion Condition

Wave B4 is complete when:
1. All 30 D2 tests (T-MMM-S6-021–T-MMM-S6-050) GREEN
2. Verbatim upload flow (Mode A) produces a parse job and parse result using AIMC stub
3. New framework generation (Mode B) produces proposed Domain/MPS/Criteria tree using AIMC stub
4. Framework compilation promotes proposed → canonical structure in `mmm_domains`, `mmm_maturity_process_steps`, `mmm_criteria`
5. Framework publication updates `mmm_frameworks.status` to `PUBLISHED`; RLS write block confirmed for re-publish attempt
6. Three-tier approval workflow produces correct state transitions
7. Framework version history records create/update events correctly

---

### Wave B5 — Assessment Execution: Audit Workbench, Evidence, and Scoring (J-09–J-11)

**Slug**: `mmm-build-wave-b5-assessment-execution`
**Builder Class**: `api-builder` + `ui-builder`

#### 3.5.1 Scope

**UX Journeys covered**: J-09 (Criterion Drill-Down and Assessment Workbench), J-10
(Evidence Workspace), J-11 (Audit Workbench / Walkabout Mode).

**Edge Functions deployed in B5**:
- `mmm-score-confirm` (`POST /api/scores/confirm`) — human HITL score confirmation (TR-033); requires `{ "confirm": true }` in payload
- `mmm-score-cascade` (internal trigger) — full 6-step scoring cascade triggered on evidence confirmation (FR-040): criterion → MPS → domain → organisation → dashboard refresh
- `mmm-upload-evidence` (`POST /api/upload/evidence`) — KUC upload proxy for evidence files (stubbed in B5; live wire in B7)
- `mmm-ai-evidence-evaluate` (`POST /api/ai/evidence-evaluate`) — AIMC evidence evaluation (stubbed in B5; live wire in B7)

**React UI pages and components**:
- Assessment workbench — criterion list per MPS/domain, evidence status indicators (FR-029)
- Evidence workspace modal (FR-030) — file/URL/text evidence types, decision workflow
- Evidence type support (FR-031): file upload, URL reference, free-text attestation
- Evidence decision flow (FR-032): AI-proposed score → human review → accept/reject/override
- Evidence non-acceptance paths (FR-033): reject with reason, request resubmission
- Evidence freshness and staleness indicators (FR-034, TR-025)
- Re-evaluation flow (FR-035)
- Human override logging (FR-036) — rationale required; written to `mmm_override_log`
- Five-level maturity scale display (FR-037)
- Evidence capability constraint enforcement (FR-038): no evidence → no score assignment
- Continuous live maturity engine display (FR-039): real-time score updates via TanStack Query invalidation and/or Supabase realtime
- Scoring cascade visual feedback (FR-040): criterion → MPS → domain → org score cascade visible in UI
- Audit workbench / walkabout mode (FR-041, TR-039–TR-042): queue-and-sync localStorage model for offline operation; connectivity status UI (TR-041); CONNECTIVITY-REQUIRED boundary declaration (TR-039); queue replay on reconnect (TR-040)
- MAT label survival consideration (FR-042) — display adaptation (OQ-008 resolved)
- Independent auditor flow (FR-043) — separate auditor role access in assessment

**Business logic (Edge Functions)**:
- Scoring cascade (FR-040, TR-004): full 6-step cascade must complete ≤ 2 seconds from event receipt
- AI Human Oversight enforcement (TR-033): score proposals written to `mmm_score_proposals`; confirmed scores written to `mmm_maturity_scores` only on explicit `confirm: true` flag
- Queue-and-sync model (TR-040): localStorage queue on connectivity loss; auto-replay on reconnect
- Evidence freshness tracking (TR-025): freshness_days from org settings applied per evidence record

**Required FRs**: FR-029–FR-043, FR-057
**Required TRs**: TR-004 (cascade ≤ 2s), TR-007 (audit session load), TR-008 (real-time update ≤ 1s), TR-009 (circuit breaker — triggered by AIMC stub in B5), TR-025, TR-033, TR-039, TR-040, TR-041, TR-042

#### 3.5.2 Out of Scope for B5

- Findings generation from completed assessments (B6)
- Report generation and PIT export (B6)
- Full AIMC live wire for evidence evaluation (B7 — stubbed in B5)
- Full KUC live wire for evidence upload (B7 — stubbed in B5)

#### 3.5.3 Dependencies

- B1–B4 complete: A published framework must exist in `mmm_frameworks` (status = PUBLISHED) before assessments can be created against it
- `mmm_assessments`, `mmm_evidence`, `mmm_score_proposals`, `mmm_maturity_scores`, `mmm_override_log`, `mmm_audit_sessions` tables from B1

#### 3.5.4 QA Gating (RED → GREEN for B5)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D3: Assessment Execution | T-MMM-S6-051–T-MMM-S6-080 | Full J-09 through J-11 |

**NBR-001 checkpoint**: After `mmm-score-confirm` is called, TanStack Query cache for
assessment scores, MPS scores, domain scores, and org dashboard must be invalidated.
No stale score may remain in cache post-confirmation.

**NBR-002 checkpoint**: `mmm-score-confirm` must return HTTP 403 (not silently succeed)
if called by a user whose `organisation_id` does not match the assessment's org.

#### 3.5.5 Completion Condition

Wave B5 is complete when:
1. All 30 D3 tests (T-MMM-S6-051–T-MMM-S6-080) GREEN
2. Scoring cascade completes ≤ 2 seconds from evidence confirmation (TR-004)
3. Score proposals appear in `mmm_score_proposals`; confirmed scores in `mmm_maturity_scores`
4. Queue-and-sync stores evidence responses in localStorage on connectivity loss; replays on reconnect
5. Human override recorded in `mmm_override_log` with rationale
6. AI evaluation stub returns mock score proposal; human can confirm or override
7. Evidence freshness threshold enforced (stale evidence flagged)

---

### Wave B6 — Findings, Recommendations, and Reporting (J-12–J-15)

**Slug**: `mmm-build-wave-b6-findings-reporting`
**Builder Class**: `api-builder` + `ui-builder`

#### 3.6.1 Scope

**UX Journeys covered**: J-12 (Findings Review and Management), J-13 (Report Generation),
J-14 (Dashboard Publication), J-15 (PIT Export and Handshake).

**Edge Functions deployed in B6**:
- `mmm-pit-export-send` (`POST /api/pit-export/:id/send`) — initiates PIT export 7-step handshake (TR-016, TR-017); stubbed PIT endpoint in B6; live wire in B7
- `mmm-pit-evidence-return` (`POST /api/evidence/pit-return`) — receives PIT → MMM evidence return (TR-018); stubbed in B6; live wire in B7
- `mmm-ai-recommend` (`POST /api/ai/recommend`) — AIMC recommendations (stubbed in B6; live wire in B7)

**React UI pages and components**:
- Findings management view (FR-044) — shared findings model display
- No-duplicate-truth rule enforcement (FR-045) — single canonical findings list
- Output fork decision (FR-046) — report output vs PIT export decision
- Report output view (FR-047) — report generation with org branding, domain breakdown,
  maturity level, gap analysis, recommendations section
- Report configuration (FR-048) — scope, domain filter, output format
- PIT export flow (FR-049, TR-016, TR-017) — 7-step handshake UI, export status tracking, `mmm_pit_exports` record
- Dashboard publication (FR-050) — organisation maturity dashboard rendered with published framework data
- Dashboard CL-13 carry-over alignment (FR-051) — consistent with AIMC CL-13 D5/D6/D7 dashboard spec
- Dashboard wow factor (FR-052) — visual maturity level indicators, trend lines, domain heatmap
- PIT export payload serialisation (TR-016): converts findings/recommendations to TR-016 JSON schema
- Maturity score version history (TR-026): exposed in report as score history timeline

**Required FRs**: FR-044–FR-052
**Required TRs**: TR-016, TR-017, TR-018, TR-026, TR-005 (dashboard render ≤ 1.5s cached / ≤ 3s initial)

#### 3.6.2 Out of Scope for B6

- Live PIT endpoint connection (B7 — stubbed in B6)
- Live AIMC recommendation calls (B7 — stubbed in B6)
- Boundary verification testing against real PIT/AIMC (B7 and B9)

#### 3.6.3 Dependencies

- B1–B5 complete: `mmm_findings`, `mmm_pit_exports` tables exist; assessment data and maturity scores are populated from B5

#### 3.6.4 QA Gating (RED → GREEN for B6)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D4: Findings & Reporting | T-MMM-S6-081–T-MMM-S6-097 | Full J-12 through J-15 |

**NBR-001 checkpoint**: Dashboard `useQuery` hook must be invalidated by findings
creation and PIT export status changes. No stale findings displayed after mutation.

**NBR-002 checkpoint**: PIT export initiation must return HTTP 403 if caller lacks
ADMIN or FRAMEWORK_OWNER role.

#### 3.6.5 Completion Condition

Wave B6 is complete when:
1. All 17 D4 tests (T-MMM-S6-081–T-MMM-S6-097) GREEN
2. Findings list renders from `mmm_findings` with correct maturity position and gap-to-next
3. Report generation produces well-formed output with all required sections (FR-047)
4. PIT export creates `mmm_pit_exports` record; stub handshake completes 7-step sequence
5. Dashboard renders full maturity view within 1.5s (cached data, TR-005)
6. Dashboard renders within 3s on cold cache with production-representative dataset (≥ 5 domains, ≥ 20 MPSs, ≥ 100 criteria)

---

### Wave B7 — Boundary Integrations: AIMC, PIT, and KUC (J-17)

**Slug**: `mmm-build-wave-b7-boundary-integrations`
**Builder Class**: `integration-builder`

#### 3.7.1 Scope

Full live wiring of all three external integration boundaries, replacing stubs deployed
in B4–B6, plus AI interactions journey (J-17).

**AIMC Integration (full live wire)** — Architecture §A6.1:
- Service-to-service JWT authentication using `AIMC_SERVICE_TOKEN` (TR-011)
- AIMC canonical request/response envelope (TR-012)
- AIMC routing and versioning strategy (TR-013)
- Per-operation timeout and retry policy (TR-014)
- All 9 AIMC-calling Edge Functions wired live (TR-015):
  `mmm-ai-framework-parse`, `mmm-ai-framework-generate`, `mmm-ai-framework-alter`,
  `mmm-ai-evidence-evaluate`, `mmm-ai-recommend`, `mmm-ai-chat`, `mmm-ai-explain`,
  `mmm-ai-explain`, `mmm-ai-assessment-interpret`
- Circuit breaker full implementation (TR-009, Architecture §A4.5): `CLOSED | OPEN | HALF_OPEN` states; retry budget; fallback response `{ "fallback": true, "reason": "AIMC_CIRCUIT_OPEN" }`
- AI governance logging to `mmm_ai_interactions` (TR-034)

**PIT Integration (full live wire)** — Architecture §A6.2:
- Full 7-step PIT export handshake (TR-017) wired to live PIT endpoint
- PIT export payload schema v1.0 (TR-016) serialised correctly
- PIT → MMM evidence return flow (TR-018) wired and validated
- `mmm_pit_exports` status machine verified against live PIT responses
- Using `PIT_SERVICE_TOKEN` for authentication

**KUC Integration (full live wire)** — Architecture §A6.3:
- KUC upload request contract (TR-019) wired for both `mmm-upload-framework-source`
  and `mmm-upload-evidence`
- KUC classification response contract (TR-020) handled and stored
- File type validation and size limits enforced (TR-006)

**AI Interactions Journey (J-17)**:
- `mmm-ai-chat` (`POST /api/ai/chat`) — contextual chat within assessment context (FR-063, FR-064)
- `mmm-ai-explain` (`POST /api/ai/explain`) — contextual explanation of criteria, scores
- `mmm-ai-assessment-interpret` (`POST /api/ai/assessment-interpret`) — assessment result interpretation
- AI human oversight enforcement (TR-033, FR-064): all AI outputs require human review before affecting scores
- Back-office AI administration interface (FR-066, TR-066): admin view for AI interaction history

**Required FRs**: FR-053, FR-054, FR-055, FR-063, FR-064, FR-065, FR-066
**Required TRs**: TR-011, TR-012, TR-013, TR-014, TR-015, TR-016, TR-017, TR-018, TR-019, TR-020, TR-033, TR-034, TR-066

#### 3.7.2 Out of Scope for B7

- Cross-cutting performance validation (B8)
- Golden path end-to-end proving (B9)
- Any new UI journeys (J-17 completes all journeys)

#### 3.7.3 Dependencies

- B1–B6 complete: All base features must be functional before boundary live-wiring
- **CS2 credential provisioning (HARD BLOCKER for B7)**:
  - `AIMC_SERVICE_TOKEN` must be provisioned and loaded in Supabase Edge Function secrets
  - `PIT_SERVICE_TOKEN` must be provisioned
  - Live AIMC and PIT endpoints must be accessible from Supabase Edge Function runtime
- Architecture §A6 (Integration Boundaries) — frozen contract specifications

#### 3.7.4 QA Gating (RED → GREEN for B7)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D5: Boundary Flows | T-MMM-S6-098–T-MMM-S6-112 | AIMC, PIT, KUC integration tests |
| D7: AI Interactions | T-MMM-S6-121–T-MMM-S6-128 | J-17 AI chat, explain, interpret |

**NBR-001 checkpoint**: All AIMC-calling mutations must invalidate relevant query caches.
AI recommendation acceptance must invalidate findings list cache.

**NBR-002 checkpoint**: AIMC proxy Edge Functions must return HTTP 403 on JWT failure (not
pass through to AIMC unauthenticated). PIT export must return HTTP 403 on scope failure.

#### 3.7.5 Completion Condition

Wave B7 is complete when:
1. All 15 D5 tests (T-MMM-S6-098–T-MMM-S6-112) GREEN with live AIMC/PIT/KUC endpoints
2. All 8 D7 tests (T-MMM-S6-121–T-MMM-S6-128) GREEN
3. Circuit breaker transitions correctly: CLOSED → OPEN on threshold; HALF_OPEN on recovery probe; fallback response returned when OPEN
4. Full 7-step PIT export handshake completes with live PIT endpoint
5. Evidence upload reaches KUC and returns classification response
6. AI governance log entries appear in `mmm_ai_interactions` for all AIMC calls
7. Score confirmation requires `{ "confirm": true }` — AI score proposals NOT auto-confirmed

---

### Wave B8 — Cross-Cutting: Performance, Security, Accessibility, and Governance

**Slug**: `mmm-build-wave-b8-cross-cutting`
**Builder Class**: `qa-builder`

#### 3.8.1 Scope

Dedicated verification wave covering all cross-cutting concerns. This wave does NOT add
new features; it validates the full deployed system against all quality and compliance
requirements.

**Performance Validation** (per TR-001–TR-010):
- Lighthouse CI: TTI ≤ 2.5s all primary routes (TR-001); Lighthouse score ≥ 90 desktop / ≥ 75 mobile
- API response time: p95 ≤ 500ms (non-AI); p95 ≤ 5,000ms (AI) — k6 load test (TR-002)
- Concurrent user test: 50 concurrent users per org, API p95 maintained (TR-003)
- Scoring cascade latency: ≤ 2s end-to-end (TR-004)
- Dashboard render: ≤ 1.5s cached, ≤ 3.0s cold (TR-005)
- File upload SLA: ≤ 30s for ≤ 50MB (TR-006)
- Audit session load: benchmark with representative dataset (TR-007)
- Real-time scoring update: ≤ 1s from Edge Function completion to UI update (TR-008)
- Circuit breaker threshold: correctly triggers at defined failure count (TR-009)
- Health endpoint: ≤ 200ms (TR-010)

**Security Scan** (per TR-058):
- OWASP dependency audit: zero critical vulnerabilities in production dependencies
- Authentication bypass: all JWT-gated routes reject unauthenticated requests (HTTP 401)
- RLS bypass: no cross-organisation data leakage (comprehensive RLS audit per TR-032)
- Audit log immutability: no UPDATE/DELETE pathway confirmed
- Invitation token expiry: tokens expire after 30 days (TR-035)
- AI governance logging completeness: all AIMC calls produce `mmm_ai_interactions` records

**Accessibility Audit** (per TR-059):
- WCAG 2.1 AA compliance: automated axe-core scan on all primary routes; zero critical violations
- Keyboard navigation: all interactive elements reachable and operable via keyboard
- Screen reader: ARIA labels and roles verified on assessment workbench and evidence workspace

**Quality Gate Validation** (per TR-054–TR-061):
- Unit test coverage ≥ 80% for all Edge Functions (TR-054)
- Integration test coverage: all Edge Function endpoints have ≥ 1 integration test (TR-055)
- E2E test coverage: all 17 user journeys have ≥ 1 E2E test GREEN (TR-056)
- Performance gate: k6 pass/fail on TR-057 thresholds
- Security gate: zero critical findings on TR-058 scan
- Accessibility gate: zero critical WCAG 2.1 AA violations (TR-059)
- Zero-warning CI policy (TR-061): TypeScript `tsc --noEmit` zero warnings; ESLint zero errors

**Notification System** (per TR-062, FR-075):
- Notification model implemented and tested: email/in-app notifications for invitation,
  evidence decision, report ready, PIT export status
- Notification delivery tested in integration (not just unit)

**State Persistence Validation** (per TR-063, FR-076):
- Server-side persistence: all entity state changes persisted and recoverable
- Client-side persistence: TanStack Query cache hydration; Zustand store init from server
- Queue-and-sync: localStorage queue survives page refresh; replays correctly on reconnect

**QIW Dashboard** (per TR-060, TR-065, FR-068):
- QIW dashboard endpoint returns accurate metrics for active waves, failed tests, code health
- QIW data contract (TR-065) satisfied

**Required FRs**: FR-069–FR-080
**Required TRs**: TR-001–TR-010, TR-054–TR-063, TR-065

#### 3.8.2 Out of Scope for B8

- New feature implementation
- Golden path end-to-end proving with full user journeys (B9)
- Any schema or Edge Function changes (B8 is verification only; defects found by B8 trigger
  fix commits attributed to the relevant earlier wave)

#### 3.8.3 Dependencies

- B1–B7 complete: All features and all boundary integrations must be deployed
- Live environment with production-representative data

#### 3.8.4 QA Gating (RED → GREEN for B8)

| Test Domain | Test IDs | Coverage |
|-------------|---------|---------|
| D8: Performance & Reliability | T-MMM-S6-129–T-MMM-S6-138 | Performance SLAs, circuit breaker |
| D9: Security & Compliance | T-MMM-S6-139–T-MMM-S6-152 | OWASP, RLS, auth bypass, audit log |
| D10: Infrastructure & Quality Gates | T-MMM-S6-153–T-MMM-S6-164 | Coverage, CI gates, deployment validation |
| D11: Product Identity & Governance | T-MMM-S6-165–T-MMM-S6-176 | QIW, notification, state persistence |

**NBR-001 final sweep**: Comprehensive TanStack Query invalidation audit across all mutation
operations in the deployed system. Any missing invalidation found by B8 is a blocking defect.

**NBR-002 final sweep**: Comprehensive RLS write-block audit. All HTTP 403 surfaces confirmed
at application layer (not silently swallowed). Any silent failure found by B8 is a blocking defect.

#### 3.8.5 Completion Condition

Wave B8 is complete when:
1. All 48 cross-cutting tests (T-MMM-S6-129–T-MMM-S6-176) GREEN
2. k6 load test passes TR-057 thresholds
3. OWASP scan: zero critical vulnerabilities
4. Lighthouse CI passes all primary routes
5. WCAG 2.1 AA: zero critical violations via axe-core scan
6. TypeScript `tsc --noEmit` zero warnings; ESLint zero errors (TR-061)
7. NBR-001 sweep: all mutation invalidations confirmed present
8. NBR-002 sweep: all RLS 403 surfaces confirmed non-silent

---

### Wave B9 — Integration Verification: Golden Path Proving

**Slug**: `mmm-build-wave-b9-golden-path-verification`
**Builder Class**: `qa-builder`

#### 3.9.1 Scope

End-to-end verification of all 10 canonical golden paths defined in Stage 7 PBFAG
(`modules/MMM/06-pbfag/golden-path-verification-pack.md`). This is the final wave
before Stage 12 closure.

**Golden Paths to verify** (from PBFAG GP-001–GP-010):
- GP-001: Unauthenticated Attraction, Free Assessment, and Subscription
- GP-002: New Organisation Onboarding with Framework Creation (Mode B — New Generation)
- GP-003: Verbatim Framework Upload and Activation (Mode A)
- GP-004: Full Assessment Cycle — Evidence Collection, Scoring Cascade, Score Confirmation
- GP-005: Human Override with Override Log and Audit Trail
- GP-006: Findings Review and Report Generation
- GP-007: PIT Export Initiation and 7-Step Handshake
- GP-008: AI Chat and Contextual Explanation within Assessment
- GP-009: Role Invitation, Acceptance, and Permission Enforcement
- GP-010: Dashboard Publication and Real-Time Maturity Update

**Minimum verification evidence per golden path** (as specified in PBFAG verification pack):
- Test execution log showing GREEN for all steps
- Screenshot or UI recording of critical steps
- Database state verification (confirm records created/updated)
- Timing confirmation for latency-critical paths (GP-004 cascade timing, GP-010 dashboard render)

**NBR-001 mandatory verification in B9** (as carried forward from Stage 7 PBFAG):
- In GP-004: after score confirmation, demonstrate that dashboard score updates in UI
  without page reload (TanStack Query invalidation confirmed)
- In GP-005: after human override, demonstrate that maturity score in dashboard reflects
  override immediately

**NBR-002 mandatory verification in B9** (as carried forward from Stage 7 PBFAG):
- In GP-009: demonstrate that a user with insufficient role receives HTTP 403 (visible in
  UI as explicit error, not silent empty response)
- In GP-007: demonstrate that PIT export initiation with wrong org scope returns HTTP 403

**Deployment verification** (per Architecture §A8):
- Frontend deployed and accessible at Vercel URL
- Edge Functions deployed to Supabase
- All 26 Edge Functions health-checked
- At least ONE complete end-to-end golden path demonstrated with production credentials

**Required FRs**: All (regression verification)
**Required TRs**: TR-056 (E2E coverage)

#### 3.9.2 Out of Scope for B9

- New feature development
- New defect remediation (defects found in B9 return to the relevant prior wave for fix
  and re-verification; B9 is not a fix wave)
- PREHANDOVER ceremony (handled by `execution-ceremony-admin-agent` after B9 completes)

#### 3.9.3 Dependencies

- B1–B8 complete: All features, boundary integrations, and cross-cutting verifications
  must be GREEN before golden path proving begins
- Live environment accessible with production-representative data and credentials

#### 3.9.4 QA Gating (RED → GREEN for B9)

All 10 golden paths must pass all defined steps. A partial golden path pass is not
acceptable — each golden path is all-or-nothing.

| Golden Path | Minimum Evidence | Latency Gate |
|------------|-----------------|-------------|
| GP-001 | Test log + baseline_maturity value in mmm_free_assessments | — |
| GP-002 | Test log + mmm_frameworks.status = PUBLISHED | — |
| GP-003 | Test log + mmm_domains/mps/criteria populated from parse | — |
| GP-004 | Test log + cascade timing ≤ 2s (TR-004) | ≤ 2s |
| GP-005 | Test log + mmm_override_log record + UI confirmation | — |
| GP-006 | Test log + report output document (any format) | Dashboard ≤ 1.5s cached |
| GP-007 | Test log + mmm_pit_exports.status = SENT (or equivalent final state) | — |
| GP-008 | Test log + mmm_ai_interactions record | AI ≤ 5,000ms (TR-002) |
| GP-009 | Test log + HTTP 403 confirmed for unauthorized role | — |
| GP-010 | Test log + real-time update visible in UI within ≤ 1s of score confirmation (TR-008) | ≤ 1s |

#### 3.9.5 Completion Condition

Wave B9 is complete when:
1. All 10 golden paths (GP-001–GP-010) produce complete passing evidence packages
2. NBR-001 verified: TanStack Query invalidation demonstrated in GP-004 and GP-005
3. NBR-002 verified: HTTP 403 surfaces demonstrated in GP-009 and GP-007
4. All 176 QA-to-Red tests (T-MMM-S6-001–T-MMM-S6-176) in GREEN state
5. Frontend deployment URL accessible and functional
6. Backend (Supabase Edge Functions) deployed and responding
7. Database populated with at least one complete demonstration org/framework/assessment
8. Handover evidence package compiled by `qa-builder` for Foreman review

---

## 4. Sequencing Model: Sequential vs Parallelizable Work

### 4.1 Primary Sequential Chain

The following dependency chain is **strictly sequential**. No wave may begin until its
predecessor is complete and GREEN:

```
B1 (Schema) → B2 (Core API) → B3 (Core UI) → B4 (Framework Lifecycle)
    → B5 (Assessment Execution) → B6 (Findings & Reporting)
        → B7 (Boundary Integrations) → B8 (Cross-Cutting) → B9 (Golden Path)
```

**Rationale**:

| Constraint | Reason |
|-----------|--------|
| B1 before B2 | Edge Functions cannot write to tables that do not exist; RLS policies enforce org isolation from first Edge Function call |
| B2 before B3 | UI requires auth JWT middleware, org creation, and health endpoint to function |
| B3 before B4 | Framework-origin decision fork (J-05, B3's closing action) is the entry point for J-06 (B4's opening action) |
| B4 before B5 | Assessments require a published framework (`mmm_frameworks.status = PUBLISHED`). No framework → no assessment |
| B5 before B6 | Findings are derived from completed assessment scores. No assessment data → no findings |
| B6 before B7 | AIMC/PIT/KUC live wiring targets the full feature surface (framework parse, evidence evaluate, findings recommend, PIT export). All features must be stable before live wiring |
| B7 before B8 | Cross-cutting verification (performance, security, accessibility) must test the full deployed system including live boundary integrations |
| B8 before B9 | Golden path proving is the final evidence layer; it requires all cross-cutting gates GREEN before proceeding |

### 4.2 Permitted Parallelism

The following forms of **within-stage parallelism** are permitted:

| Parallel Pattern | Permitted From | Notes |
|-----------------|---------------|-------|
| QA gating (RED → GREEN) runs in parallel with its build wave | Every wave | `qa-builder` is always parallel to the build wave's `api-builder`/`ui-builder`/`schema-builder` |
| B3 `api-builder` and B3 `ui-builder` sub-tasks run in parallel | B3 start | The 4 B3 Edge Functions and the React pages/components within B3 can be built concurrently |
| B4 `api-builder` and B4 `ui-builder` sub-tasks run in parallel | B4 start | Same pattern as B3 |
| B5, B6, B7 multi-builder parallelism | Per wave start | Within each wave, `api-builder` and `ui-builder` tasks are parallel |
| Defect-fix commits from B8/B9 go to prior-wave owner | B8 start | If B8 finds a defect in B4's code, `api-builder` or `ui-builder` fixes it in parallel with the B8 qa-builder continuing other B8 tests |

### 4.3 Explicitly Prohibited Parallelism

The following cross-wave parallelism is **prohibited**:

| Prohibited Pattern | Reason |
|-------------------|--------|
| B4 cannot start before B3 is complete | B4 builds on B3 routing/component patterns and requires B3's org/framework-init API contracts to be finalised |
| B7 cannot start before B6 is complete | Live boundary wiring on incomplete features creates integration uncertainty that invalidates B7's evidence |
| B9 cannot start before B8 is complete | Golden path evidence must be collected on a system that has passed all cross-cutting gates |
| Any wave can not start before B1 is complete | Schema is the absolute foundation |

---

## 5. Dependency Model

### 5.1 Dependencies Inherited from Stages 1–7 (Frozen Inputs)

The following are frozen. No downstream stage may modify them without CS2 re-authorization.
Any change to these inputs requires a new Stage re-run from the modified stage forward.

| Input | Artifact | Key Constraint on Stage 12 |
|-------|---------|--------------------------|
| 80 FRs | `02-frs/functional-requirements.md` | Implementation must satisfy all 80 FRs; no FR may be skipped |
| 66 TRs | `03-trs/technical-requirements-specification.md` | All technical constraints are binding (performance SLAs, RLS, connectivity model) |
| 26 Edge Functions | `04-architecture/architecture.md` §A4.1 | Exact function names, routes, and auth requirements declared; must match implementation |
| 25 Database Tables | `04-architecture/architecture.md` §A5.2 | Exact table names (with `mmm_` prefix), mandatory columns, and RLS model declared |
| 3 Integration Boundaries | `04-architecture/architecture.md` §A6 | AIMC, PIT, KUC contracts are frozen; MMM must conform to provider contracts |
| 176 RED Tests | `05-qa-to-red/qa-to-red-catalog.md` | ALL tests must reach GREEN by end of Stage 12; no test may be removed or skipped |
| 10 Golden Paths | `06-pbfag/golden-path-verification-pack.md` | All 10 must produce complete passing evidence at end of B9 |
| NBR-001 | Stage 7 PBFAG | TanStack Query cache invalidation on mutation — mandatory verification in every build wave |
| NBR-002 | Stage 7 PBFAG | Supabase RLS write-block surface (HTTP 403 not silently swallowed) — mandatory in every build wave |
| CONNECTIVITY-REQUIRED | `03-trs/technical-requirements-specification.md` §6 (OQ-001 resolved) | MMM requires connectivity for all API operations; queue-and-sync only for audit workbench walkabout mode (TR-039–TR-042) |

### 5.2 What Must Be True Before Stage 9 (Builder Checklist) Can Begin

Stage 9 (Builder Checklist) may begin immediately upon Stage 8 completion (this document
committed and Foreman-approved). No build work is required before Stage 9.

**Stage 9 Entry Conditions**:
1. `modules/MMM/07-implementation-plan/implementation-plan.md` committed to branch
   and Foreman-approved (Stage 8 complete)
2. `modules/MMM/BUILD_PROGRESS_TRACKER.md` updated to Stage 8 COMPLETE
3. Stage 9 wave-start authorized by CS2

**What Stage 9 Builder Checklist must carry forward from Stage 8**:
- Full wave inventory (B1–B9 slugs and builder class assignments from §2)
- All 9 wave completion conditions (§3 per wave) as checklist items
- NBR-001 and NBR-002 as mandatory per-wave checklist items
- Credential gap from §1.3 (AIMC_SERVICE_TOKEN, PIT_SERVICE_TOKEN,
  SUPABASE_SERVICE_ROLE_KEY must be in builder checklist for B7 blocker confirmation)
- Builder class assignments: `schema-builder` (B1), `api-builder` (B2–B6), `ui-builder` (B3–B6), `integration-builder` (B7), `qa-builder` (B8–B9)
- Dependency chain from §4 (sequential constraints must be confirmed by builder)
- All 176 test IDs (T-MMM-S6-001–T-MMM-S6-176) as acceptance criteria

### 5.3 What Must Be True Before Stage 10 (IAA Pre-Brief) Can Begin

**Stage 10 Entry Conditions**:
1. Stage 9 Builder Checklist COMPLETE with PASS status for all builder candidates
2. All designated builder agents have confirmed:
   - Architecture comprehension (all 26 Edge Functions, all 25 tables, all 3 integration boundaries)
   - QA-to-Red comprehension (all 176 tests, all 10 golden paths)
   - STOP-AND-FIX protocol acknowledged
   - Evidence requirements understood
   - NBR-001 and NBR-002 anti-regression obligations accepted
3. Stage 10 wave-start authorized by CS2

**What Stage 10 IAA Pre-Brief must carry forward from Stage 8**:
- This implementation plan document (§3 wave scopes as context for IAA overlay)
- Credential gap status from §1.3 (IAA must confirm credentials are in-flight before issuing ASSURANCE-TOKEN)
- NBR-001 and NBR-002 as mandatory IAA overlay items for the build
- Wave B7 hard dependency on credential provisioning (§3.7.3)
- All 9 completion conditions from §3 as IAA gate criteria for Stage 12 wave closure

### 5.4 What Must Be True Before Stage 11 (Builder Appointment) Can Begin

**Stage 11 Entry Conditions** (all hard gates):
1. Stage 10 IAA Pre-Brief complete with `ASSURANCE-TOKEN` issued by IAA
   (not `PHASE_A_ADVISORY` — a `PHASE_A_ADVISORY` blocks builder appointment)
2. Pre-Brief acknowledged by Foreman and all designated builders
3. Stage 11 wave-start authorized by CS2
4. All Stages 1–10 formally closed in `BUILD_PROGRESS_TRACKER.md`:
   - Stages 5, 6, 7 must have CS2 merge/approval confirmed (currently pending merge)
   - Stages 8, 9, 10 must complete in sequence

**Stage 11 Builder Appointment must specify**:
- Named agents for each builder class: `schema-builder`, `api-builder`, `ui-builder`,
  `integration-builder`, `qa-builder`
- Wave assignment per agent (from §2 wave table)
- Foreman authority and escalation path (STOP-AND-FIX protocol)
- Merge gate specification (IAA final audit required before any wave's PR is merged)

### 5.5 What Must Be True Before Stage 12 (Build Execution) Can Lawfully Start

**Stage 12 Entry Conditions** (all hard gates):
1. Stage 11 Builder Appointment complete; formal appointment issued by Foreman
2. All Stages 1–11 formally closed and CS2-approved
3. **CS2 must have provisioned all credentials** from §1.3:
   - `AIMC_SERVICE_TOKEN` loaded in Supabase Edge Function secrets
   - `PIT_SERVICE_TOKEN` loaded in Supabase Edge Function secrets
   - `SUPABASE_SERVICE_ROLE_KEY` loaded in Supabase Edge Function secrets
   - `SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` available to frontend deployment
   - (Credentials for B7 specifically — B1–B6 may proceed with `SUPABASE_SERVICE_ROLE_KEY` only)
4. Build repository confirmed clean (no uncommitted schema changes, no residual stubs
   that were not designated as stubs in this plan)
5. `qa-builder` confirms RED test infrastructure is deployable (all 176 tests are
   executable and fail correctly in RED state before any build code is written)

---

## 6. Builder Classes and Specialist Roles

### 6.1 Builder Class Assignments by Wave

| Wave | Slug | Primary Builder | Supporting Builder | QA Gate |
|------|------|----------------|--------------------|---------|
| B1 | `mmm-build-wave-b1-schema` | `schema-builder` | — | `qa-builder` (D9/D10 subset) |
| B2 | `mmm-build-wave-b2-core-api` | `api-builder` | — | `qa-builder` (D6, D10/D11 subset) |
| B3 | `mmm-build-wave-b3-core-ui` | `ui-builder` | `api-builder` | `qa-builder` (D1) |
| B4 | `mmm-build-wave-b4-framework-lifecycle` | `api-builder` | `ui-builder` | `qa-builder` (D2) |
| B5 | `mmm-build-wave-b5-assessment-execution` | `api-builder` | `ui-builder` | `qa-builder` (D3) |
| B6 | `mmm-build-wave-b6-findings-reporting` | `api-builder` | `ui-builder` | `qa-builder` (D4) |
| B7 | `mmm-build-wave-b7-boundary-integrations` | `integration-builder` | — | `qa-builder` (D5, D7) |
| B8 | `mmm-build-wave-b8-cross-cutting` | `qa-builder` | — | `qa-builder` (self: D8–D11) |
| B9 | `mmm-build-wave-b9-golden-path-verification` | `qa-builder` | — | `qa-builder` (self: GP-001–GP-010) |

### 6.2 Specialist Role Descriptions

| Builder Class | Role in MMM Build | Waves |
|--------------|-------------------|-------|
| `schema-builder` | Owns all Supabase database schema, RLS policies, migration scripts, index definitions, and storage bucket configuration | B1 |
| `api-builder` | Owns all Supabase Edge Functions (Deno runtime), business logic, data transformation, JWT middleware, and audit log write paths | B2, B3, B4, B5, B6 |
| `ui-builder` | Owns all React/TypeScript/Vite frontend components, pages, routing, Zustand stores, TanStack Query hooks, and accessibility implementation | B3, B4, B5, B6 |
| `integration-builder` | Owns all external boundary wiring: AIMC service JWT + circuit breaker, PIT 7-step handshake, KUC upload contract, and J-17 AI interactions | B7 |
| `qa-builder` | Owns RED → GREEN test gating (parallel per wave), performance test suite (k6), security scan execution, accessibility audit, and golden path evidence compilation | B1–B9 (parallel) + B8, B9 (primary) |

### 6.3 Foreman Role (Stage 12)

- **Authority**: Foreman delegates each wave to the designated builder; reviews QA gate
  evidence before wave closure; enforces STOP-AND-FIX protocol
- **STOP-AND-FIX**: Any blocking defect found during any wave must halt the wave; builder
  fixes before progressing. No wave may be declared complete with known blocking defects.
- **Wave closure**: Foreman formally closes each wave upon confirmed GREEN gate and
  evidence review; commits closure record to `BUILD_PROGRESS_TRACKER.md`

---

## 7. Planning vs Build Wave Boundary

### 7.1 Planning Waves (Stages 1–11)

The following stages are **planning waves**. They produce governance, specification,
and readiness artifacts. They do NOT produce functional code, database migrations,
test implementations, or deployments.

| Stage | Name | Type | Produces |
|-------|------|------|---------|
| Stage 1 | App Description | Planning | Product vision and capability declaration |
| Stage 2 | UX Workflow & Wiring Spec | Planning | 17 user journeys, boundary wiring |
| Stage 3 | FRS | Planning | 80 functional requirements |
| Stage 4 | TRS | Planning | 66 technical requirements |
| Stage 5 | Architecture | Planning | Frozen architecture specification |
| Stage 6 | QA-to-Red | Planning | 176 RED test specifications (no implementation) |
| Stage 7 | PBFAG | Planning | PBFAG verdict, 10 golden paths, NBR registry |
| **Stage 8** | **Implementation Plan** | **Planning** | **This document — 9 named build waves, dependency model** |
| Stage 9 | Builder Checklist | Planning | Builder readiness confirmation per wave |
| Stage 10 | IAA Pre-Brief | Planning | IAA ASSURANCE-TOKEN or advisory |
| Stage 11 | Builder Appointment | Planning | Formal builder appointment by Foreman |

### 7.2 Build Waves (Stage 12)

All functional code, test implementations, database migrations, and deployments occur
exclusively in Stage 12, within the 9 named build waves (B1–B9).

**The boundary is absolute**:
- No functional code is written in Stages 1–11
- No Stage 12 build code may be produced before Stage 11 Builder Appointment is complete
- No build wave may be skipped or re-ordered without Foreman + CS2 re-authorization

### 7.3 Reference to Deployment Contract

All Stage 12 deployment targets and runtime constraints are declared in:
- Architecture §A8 (Deployment and Runtime Topology): Vercel frontend, Supabase Edge Functions, Supabase PostgreSQL
- `modules/MMM/04-architecture/APP_STARTUP_REQUIREMENTS.md` (TR-064 commissioning model)
- `modules/MMM/06-pbfag/runtime-deployment-contract.md` (Stage 7 PBFAG D5)

Stage 12 must satisfy all deployment constraints declared in these documents.

---

## 8. Anti-Regression Registry Forward Reference

The following anti-regression obligations, identified in Stage 7 PBFAG, are mandatory
for ALL build waves in Stage 12. Each wave's QA gate must include verification of the
relevant NBR items.

### NBR-001 — TanStack Query Cache Invalidation on Mutation

**Mandatory in**: B3, B4, B5, B6, B7 (all mutation-bearing waves)

Every Edge Function call that mutates server state must result in explicit TanStack
Query cache invalidation of the affected query keys before the mutation is considered
complete. The following invalidation obligations apply per wave:

| Wave | Mutations | Required Cache Invalidations |
|------|----------|------------------------------|
| B3 | `mmm-org-create`, `mmm-assessment-free-respond` | Organisation list, free assessment result |
| B4 | `mmm-framework-compile`, `mmm-framework-publish` | Framework list, proposed domains, canonical domains, framework detail |
| B5 | `mmm-score-confirm`, `mmm-score-cascade` | Criterion scores, MPS scores, domain scores, org maturity score, assessment dashboard |
| B6 | `mmm-pit-export-send`, `mmm-ai-recommend` | PIT export status, findings list, recommendations |
| B7 | All AIMC proxy mutations | Relevant cache entries per operation type |

**Verification**: At least one dedicated test per mutation must confirm that the relevant
TanStack Query cache is invalidated (not just that the mutation succeeds). This test is
part of the wave's designated test domain.

### NBR-002 — Supabase RLS Write-Block Detection (HTTP 403 Surface)

**Mandatory in**: B1 (schema: RLS policy definition), B2–B7 (all Edge Function waves)

All Edge Functions must surface HTTP 403 explicitly when an RLS write-block or permission
denial occurs. Silent failure (returning HTTP 200 with no record written, or swallowing
the error without an HTTP error response) is a blocking defect.

**Verification**: At least one dedicated test per permission-gated mutation must confirm
that unauthorized calls return HTTP 403. This test is part of each wave's designated test domain.

### NBR-003 — Zustand Store Reset on Organisation Switch

**Mandatory in**: B3 (Zustand store initialisation wave)

When a user switches active organisation context, all Zustand store slices containing
org-scoped data must be reset. Any stale org data in client state after org switch
is a blocking defect.

### NBR-004 — Optimistic Update Rollback

**Mandatory in**: B5, B6 (waves with optimistic UI updates)

If any UI component implements optimistic updates (showing UI change before server confirmation),
the rollback path must be implemented and tested. Optimistic update stuck in UI on server
failure is a blocking defect.

### NBR-005 — Schema Migration Column Mismatch

**Mandatory in**: B1 (and any subsequent schema change commits)

All Edge Function code must match the deployed schema version. Column name mismatches
between Edge Function queries and actual schema columns are a blocking defect.
TypeScript types generated from schema must be regenerated after any schema change.

---

## 9. Wave Hygiene Declaration

This implementation plan satisfies the Stage 8 wave hygiene requirements:

| Hygiene Requirement | Satisfied? | Evidence |
|--------------------|-----------|---------|
| No placeholder waves | ✅ YES | All 9 waves have concrete scope; no "TBD" waves |
| No TBD scope entries | ✅ YES | All FRs, TRs, test IDs, and Edge Functions are named per wave |
| No ambiguous ownership | ✅ YES | Every wave has a named builder class (§6) |
| No missing dependency declarations | ✅ YES | Every wave declares its dependencies explicitly (§3 per wave §.X.3) |
| Downstream handoff conditions explicit | ✅ YES | Stage 9, 10, 11 entry conditions declared in §5.2–5.4 |
| Stage 12 entry conditions explicit | ✅ YES | §5.5 declares all hard gates |
| NBR-001 referenced per build wave | ✅ YES | §8 NBR-001 per-wave table; per-wave checkpoint in §3 |
| NBR-002 referenced per build wave | ✅ YES | §8 NBR-002; per-wave checkpoint in §3 |
| OVL-PBG-008 stage gating respected | ✅ YES | Planning/build boundary declared in §7 |
| OVL-PBG-011 Stage 6 QA-to-Red confirmed | ✅ YES | 176 RED tests (T-MMM-S6-001–T-MMM-S6-176) referenced throughout |
| OVL-PBG-012 Stage 7 PBFAG confirmed | ✅ YES | GP-001–GP-010, NBR-001/002 from IAA-session-mmm-stage7-pbfag-20260415-PASS |
| OVL-PBG-015 Deployment Contract referenced | ✅ YES | §7.3 cites architecture §A8, APP_STARTUP_REQUIREMENTS.md, runtime-deployment-contract.md |
| OVL-PBG-016 Golden Path referenced | ✅ YES | §3.9 B9 wave cites golden-path-verification-pack.md GP-001–GP-010 |

---

## 10. Open Questions Register

**No open questions remain.** All OQ items (OQ-001 through OQ-009) were resolved in
Stages 3–5. The following confirms closure:

| OQ | Resolution Stage | Disposition |
|----|-----------------|-------------|
| OQ-001 | Stage 4 (TRS) | RESOLVED: CONNECTIVITY-REQUIRED (TR-039–TR-042); queue-and-sync for audit workbench only |
| OQ-002 | Stage 5 (Architecture) | RESOLVED: `capabilities/index.md` legacy sub-folder retained for reference only |
| OQ-003 | Stage 5 (Architecture) | RESOLVED: duplication audit complete (architecture.md §A12) |
| OQ-004 through OQ-009 | Stage 3 (FRS) | RESOLVED: see harvest-map §Open Questions Register |

No new open questions are introduced by this implementation plan. All scope is declared.

---

## 11. Foreman Approval

**QP Verdict**: PASS ✅  
**Approved By**: foreman-v2-agent v6.2.0 (POLC Supervisor)  
**Approval Date**: 2026-04-17  
**Approval Basis**: Quality Professor evaluation in session session-mmm-stage8-implementation-plan-20260417  
**Evidence checked**:
- All 9 waves carry concrete scope with named FRs, TRs, test IDs, and Edge Functions ✅
- All dependency declarations present per wave ✅
- No placeholder waves; no TBD scope entries ✅
- Stage 9, 10, 11 entry conditions explicit (§5.2–5.4) ✅
- Stage 12 entry conditions explicit (§5.5) ✅
- NBR-001 and NBR-002 referenced per build wave (§8) ✅
- All OVL-PBG overlay checks satisfied (§9) ✅
- Upstream Stage 1–7 artifacts correctly referenced; no post-Stage 7 drift ✅

**Foreman Verdict**: This implementation plan is approved as the canonical Stage 8 artifact for MMM.
All downstream stages (Stage 9: Builder Checklist; Stage 10: IAA Pre-Brief; Stage 11: Builder Appointment;
Stage 12: Build Execution) MUST derive from this document.

**Authority**: CS2 (Johan Ras / @APGI-cmy) is the approval authority for Stage 8 formal closure.
This Foreman approval records the internal QP gate only. CS2 merge approval is required for formal Stage 8 closure.

---

*End of MMM Stage 8 Implementation Plan — Version 1.0.0*
*Produced by: mat-specialist | Delegated by: foreman-v2-agent v6.2.0*
*Wave: mmm-stage8-implementation-plan-20260417 | Issue: maturion-isms#1400*
*QP PASS — Foreman approved 2026-04-17 | Pending CS2 merge approval*
