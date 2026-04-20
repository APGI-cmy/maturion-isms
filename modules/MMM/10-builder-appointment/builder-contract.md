# MMM — Stage 11 Builder Appointment: Builder Contract

## Status Header

```
Module:           MMM — Maturity Management Module
Artifact Type:    Stage 11 Builder Appointment (builder-contract.md)
Status:           COMPLETE
Version:          1.0.0
Date:             2026-04-20
Owner:            CS2 (Johan Ras / @APGI-cmy)
Produced By:      mat-specialist (delegated by foreman-v2-agent v6.2.0)
Issue:            maturion-isms#1426
Wave:             mmm-stage11-builder-appointment-20260420
Branch:           copilot/mmm-stage-11-builder-appointment
Upstream Stage 10 IAA Token:  IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS
Upstream Stage 9 IAA Token:   IAA-session-mmm-stage9-builder-checklist-20260419-PASS
Upstream Stage 8 Plan:        modules/MMM/07-implementation-plan/implementation-plan.md v1.0.0
Upstream Stage 8 Addendum:    modules/MMM/07-implementation-plan/convergence-governance-addendum.md v1.0.0
IAA Pre-Brief:    .agent-admin/assurance/iaa-wave-record-mmm-stage11-builder-appointment-20260420.md — CLEARED (SHA 0489924)
```

---

## Section 1 — Hard Start Condition Verification

Stage 11 may proceed only when all five hard start conditions are satisfied. This section records
the verification of each condition against the upstream evidence chain.

| # | Condition | Required Evidence | Verification Status | Reference |
|---|-----------|-------------------|---------------------|-----------|
| HSC-1 | Stage 10 IAA Pre-Brief COMPLETE — ASSURANCE-TOKEN issued | `iaa-pre-brief.md` v1.0.0 + ASSURANCE-TOKEN | ✅ SATISFIED | IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS |
| HSC-2 | Stage 10 PHASE_B_BLOCKING_TOKEN active | PHASE_B_BLOCKING_TOKEN recorded in wave record | ✅ SATISFIED | PHASE_B_BLOCKING_TOKEN: IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS |
| HSC-3 | Stage 9 Builder Checklist frozen — all 5 builders PASS | `builder-checklist.md` v1.0.0, IAA token issued | ✅ SATISFIED | builder-checklist.md v1.0.0; IAA-session-mmm-stage9-builder-checklist-20260419-PASS |
| HSC-4 | Stage 8 Implementation Plan AND convergence-governance addendum both active | Both artifacts v1.0.0 committed and accessible | ✅ SATISFIED | `implementation-plan.md` v1.0.0 + `convergence-governance-addendum.md` v1.0.0 |
| HSC-5 | No stale wave/task tracker state, token/session drift, or active-artifact contradiction | BUILD_PROGRESS_TRACKER.md and session memory reviewed; no drift detected | ✅ SATISFIED | BUILD_PROGRESS_TRACKER.md reviewed 2026-04-20; Stage 10 COMPLETE; Stage 11 entry clean |

**Hard Start Condition Summary: ALL 5 CONDITIONS SATISFIED — Stage 11 MAY PROCEED.**

### HSC-1 Detail
Stage 10 IAA Pre-Brief (`modules/MMM/09-iaa-pre-brief/iaa-pre-brief.md` v1.0.0) was completed
2026-04-20 in wave `mmm-stage10-iaa-prebrief-20260420`. The IAA independent-assurance-agent issued
ASSURANCE-TOKEN: IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS. The ECAP ceremony bundle
(PREHANDOVER + session memory + Foreman-accepted copies) was committed. §12 Wave-Level Admin
Ceremony Expectations are present (§12.1–§12.5).

### HSC-2 Detail
The Stage 10 IAA Pre-Brief explicitly established a PHASE_B_BLOCKING_TOKEN:
`IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS`. This token is the authorising gate for
all Stage 12 (Build Execution) wave-starts. It is referenced in the IAA wave record at
`.agent-admin/assurance/iaa-wave-record-mmm-stage10-iaa-prebrief-20260420.md`.

### HSC-3 Detail
Stage 9 Builder Checklist (`modules/MMM/08-builder-checklist/builder-checklist.md` v1.0.0) was
completed 2026-04-19. All five builder candidates (schema-builder, api-builder, ui-builder,
integration-builder, qa-builder) received a verdict of PASS. The IAA wave record at
`.agent-admin/assurance/iaa-wave-record-mmm-stage9-builder-checklist-20260419.md` has status
CLEARED. IAA token: IAA-session-mmm-stage9-builder-checklist-20260419-PASS.

### HSC-4 Detail
Both Stage 8 artifacts are committed and accessible:
- `modules/MMM/07-implementation-plan/implementation-plan.md` v1.0.0 (wave:
  mmm-stage8-implementation-plan-20260417; Foreman QP PASS)
- `modules/MMM/07-implementation-plan/convergence-governance-addendum.md` v1.0.0 (wave:
  mmm-stage8-addendum-20260419; IAA Pre-Brief CLEARED; gate condition §9.2 satisfied)

Both must be treated as derivation authorities for Stage 11 and Stage 12. The addendum is a
REQUIRED Stage 8 supplement — not optional context.

### HSC-5 Detail
BUILD_PROGRESS_TRACKER.md reviewed 2026-04-20. Stage 10 section shows COMPLETE ✅ with
ASSURANCE-TOKEN recorded. Stage 11 section shows NOT_STARTED with no contradictory artifact
state. No stale wave tokens, session drift, or active-artifact contradictions detected.
CG-001–CG-005 and NBR-001/NBR-002 carry-forward state is consistent across tracker, builder
checklist, and IAA pre-brief.

---

## Section 2 — Derivation Sources

All upstream authorities from Stages 1–10. Every builder is bound to treat these as frozen
inputs for Stage 12 build execution.

| Stage | Artifact | Location | Version | Approval / IAA Token | Key Output |
|-------|---------|----------|---------|---------------------|-----------|
| Stage 1 | App Description | `modules/MMM/00-app-description/MMM_app_description.md` | v0.5.0 | CS2-approved — maturion-isms#1298 (2026-04-08) | 42 sections; product vision, users, constraints, 9 open questions |
| Stage 2 | UX Workflow & Wiring Spec | `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | v0.1.0 | CS2-approved — maturion-isms#1352 (2026-04-14) | 17 UX journeys (J-01–J-17); full UI → API → schema → boundary wiring |
| Stage 3 | Functional Requirements Specification | `modules/MMM/02-frs/functional-requirements.md` | v0.1.0 | CS2-approved — maturion-isms#1366 (merged 2026-04-14) | 80 FRs (FR-001–FR-080); all 5 functional areas; all open questions dispositioned |
| Stage 4 | Technical Requirements Specification | `modules/MMM/03-trs/technical-requirements-specification.md` | v0.1.0 | CS2-approved — maturion-isms#1378 (2026-04-14) | 66 TRs (TR-001–TR-066); AIMC interface (TR-011–TR-015); PIT export (TR-016–TR-018); KUC upload (TR-019–TR-020); circuit breaker (TR-009) |
| Stage 4 | FRS-to-TRS Traceability Matrix | `modules/MMM/03-trs/frs-to-trs-traceability.md` | v0.1.0 | CS2-approved — maturion-isms#1378 | 80/80 FRs traced to TRS requirements (100% coverage) |
| Stage 5 | Architecture | `modules/MMM/04-architecture/architecture.md` | — | Artifacts complete; CS2 merge pending | 26 Edge Functions (§A4.1); 25 mmm_ tables (§A5.2); RLS model; 3 integration boundaries; 17 journeys wired end-to-end |
| Stage 5 | Compliance Scope | `modules/MMM/04-architecture/COMPLIANCE_SCOPE.md` | — | Artifacts complete | ISO 27001/31000/NIST CSF control scope (TR-037) |
| Stage 5 | App Startup Requirements | `modules/MMM/04-architecture/APP_STARTUP_REQUIREMENTS.md` | — | Artifacts complete | Commissioning checks CHK-001–CHK-005 (TR-064) |
| Stage 6 | QA-to-Red Catalog | `modules/MMM/05-qa-to-red/qa-to-red-catalog.md` | v0.1.0 | Foreman QP PASS + IAA token | 176 RED tests (T-MMM-S6-001–T-MMM-S6-176) across 11 domains; 100% FR/TR/journey coverage |
| Stage 7 | PBFAG Checklist | `modules/MMM/06-pbfag/pbfag-checklist.md` | — | IAA-session-mmm-stage7-pbfag-20260415-PASS | PBFAG PASS; all integration contracts frozen; zero implementation spilling |
| Stage 7 | Golden Path Verification Pack | `modules/MMM/06-pbfag/golden-path-verification-pack.md` | — | IAA-session-mmm-stage7-pbfag-20260415-PASS | GP-001–GP-010; NBR-001 embedded in GP-004/GP-005; NBR-002 embedded in GP-009/GP-007 |
| Stage 7 | Runtime/Deployment Contract | `modules/MMM/06-pbfag/runtime-deployment-contract.md` | — | IAA-session-mmm-stage7-pbfag-20260415-PASS | Runtime assumptions frozen; Vite bundler; Supabase Edge Functions (Deno); Vercel frontend |
| Stage 8 Plan | Implementation Plan | `modules/MMM/07-implementation-plan/implementation-plan.md` | v1.0.0 | Foreman QP PASS — session-mmm-stage8-implementation-plan-20260417 | 9 build waves (B1–B9); scope, sequencing, builder classes, completion conditions per wave |
| Stage 8 Addendum | Convergence-Governance Addendum | `modules/MMM/07-implementation-plan/convergence-governance-addendum.md` | v1.0.0 | IAA Pre-Brief CLEARED — iaa-wave-record-mmm-stage8-addendum-20260419.md | CG-001–CG-005 governance laws; source-state model; switchover gate conditions (SG-1–SG-5); ownership boundary prohibitions (OB-1/OB-2/OB-3); B7/B9 closure laws |
| Stage 9 | Builder Checklist | `modules/MMM/08-builder-checklist/builder-checklist.md` | v1.0.0 | IAA-session-mmm-stage9-builder-checklist-20260419-PASS | All 5 builders PASS; §4.1–§4.5 per-builder verdicts; SB-002 condition: api-builder Deno brief required; SB-003 condition: credential hard gate B7 |
| Stage 10 | IAA Pre-Brief | `modules/MMM/09-iaa-pre-brief/iaa-pre-brief.md` | v1.0.0 | IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS | §1–§13 complete; §12 Wave-Level Admin Ceremony; PHASE_B_BLOCKING_TOKEN active; CG/NBR/SB carry-forwards declared |

**Frozen architecture inputs (immutable for all Stage 12 builders)**:

| Input | Count | Frozen By |
|-------|-------|-----------|
| Functional requirements | 80 (FR-001–FR-080) | `02-frs/functional-requirements.md` v0.1.0 |
| Technical requirements | 66 (TR-001–TR-066) | `03-trs/technical-requirements-specification.md` v0.1.0 |
| Database tables (mmm_ prefix) | 25 | `04-architecture/architecture.md` §A5.2 |
| Supabase Edge Functions | 26 | `04-architecture/architecture.md` §A4.1 |
| UX journeys | 17 (J-01–J-17) | `01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| RED test suite | 176 (T-MMM-S6-001–T-MMM-S6-176) | `05-qa-to-red/qa-to-red-catalog.md` |
| Golden paths | 10 (GP-001–GP-010) | `06-pbfag/golden-path-verification-pack.md` |
| Build waves | 9 (B1–B9) | `07-implementation-plan/implementation-plan.md` v1.0.0 |
| Integration boundaries | 3 (AIMC, PIT, KUC) | Architecture §A6, Addendum §4–§6 |

---

## Section 3 — Formal Builder Appointments

### 3.1 — schema-builder (B1)

**Builder**: schema-builder  
**Appointed to waves**: `mmm-build-wave-b1-schema`  
**Appointment Date**: 2026-04-20  
**Appointed By**: foreman-v2-agent v6.2.0 (via mat-specialist delegation)  
**Stage 9 Verdict Reference**: builder-checklist.md §4.1 — PASS  

#### Authorized Scope

schema-builder is authorized to execute **Wave B1 (`mmm-build-wave-b1-schema`)** with the
following exact scope:

- Create all **25 `mmm_` tables** as defined in `architecture.md` §A5.2 (table names, columns,
  foreign keys, constraints, indexes — all frozen inputs)
- Apply all **Row-Level Security (RLS) policies** for each of the 25 tables
- Create all **indexes** required by the 25-table schema (performance and uniqueness constraints)
- Configure **Supabase storage buckets** as required by the architecture
- Seed all **required test data** per architecture.md §A5.3 seeding requirements
- All migrations must carry the **`TR-028` `mmm_` table-prefix convention**; every table name
  must use the `mmm_` prefix without exception

**Frozen input — Table names**: All 25 table names are taken verbatim from `architecture.md`
§A5.2. schema-builder MUST NOT add, remove, or rename any of the 25 tables.

**Test domain authorisation**: schema-builder is responsible for bringing the following test
subsets to GREEN before B1 wave closure:
- **D9 subset**: T-MMM-S6-139–T-MMM-S6-152 (schema-level unit and constraint tests)
- **D10 subset**: T-MMM-S6-153–T-MMM-S6-164 (RLS policy tests and storage tests)

**NBR-002 obligation (B1-specific)**: schema-builder MUST verify that Supabase RLS correctly
returns **HTTP 403** on cross-org write attempts. The HTTP 403 response MUST be raised at the
schema level and must be surfaced by api-builder and ui-builder in subsequent waves. Silent
swallowing of 403 at schema level is a governance defect.

**Immutable audit table pattern**: `mmm_audit_logs` and `mmm_override_log` MUST be
INSERT-only via service role. No UPDATE or DELETE operations are permitted on these tables.
schema-builder must implement this constraint via RLS policy and Postgres function. This
pattern is non-negotiable (TR-038 / audit-integrity requirement).

#### Authority Boundaries

schema-builder is **EXPLICITLY NOT authorized** to:

- Implement any **Supabase Edge Functions** in B1 (zero Edge Function code — this is B2–B6
  scope)
- Write any **frontend or React code** of any kind
- Wire any **AIMC, PIT, or KUC integration** at schema level (integration-builder B7 scope)
- Alter or extend the **frozen table list** (25 tables only; no additions or modifications
  to table names or columns beyond what is specified in architecture.md §A5.2)
- **Close Wave B1** without all D9 and D10 tests reaching GREEN status

#### Appointment Conditions

The following conditions from builder-checklist.md §4.1 are carried forward as binding
obligations on schema-builder in Stage 12:

| Condition | Status | Obligation |
|-----------|--------|------------|
| TR-028 `mmm_` table prefix | Active | All 25 tables must use `mmm_` prefix without exception |
| Architecture §A5.2 frozen table list | Active | schema-builder must not deviate from the 25 table names as specified |
| B1 test IDs D9/D10 (T-MMM-S6-139–T-MMM-S6-164) | Active | B1 wave closure requires these tests GREEN |
| NBR-002 HTTP 403 checkpoint | Active | Cross-org write attempt must surface HTTP 403 at RLS layer |
| Immutable audit table pattern | Active | `mmm_audit_logs` and `mmm_override_log` INSERT-only via service role |
| STOP-AND-FIX protocol | Active | Any test failure during B1 must STOP build and fix before continuing |
| No-wave-closure-without-evidence rule | Active | B1 must not be declared complete without test GREEN evidence committed |
| addendum §5 source-state law | Active | No schema design decision may imply source-state transitions |
| addendum §6 ownership boundary | Active | Schema design must not embed AIMC or PIT schema logic directly |

#### Carry-Forward Obligations (from Stage 8/9/10)

- **CG-001 carry-forward**: Schema design must not imply any source retirement or platform
  convergence decision. Source-state law governs all data models — no assumptions about
  source retirement may be encoded in schema definitions or constraints.
- **CG-002 carry-forward**: Ownership boundary law (OB-1/OB-2/OB-3) applies — schema-builder
  must not embed AIMC internal schema, PIT internal schema, or KUC internal schema directly
  into `mmm_` tables. Boundary tables may reference foreign IDs but must not encode
  source-system internal logic.
- **NBR-002 carry-forward**: The RLS 403-detection pattern must be verifiable at schema level
  and must propagate correctly to api-builder and ui-builder for per-wave NBR-002 verification.

---

### 3.2 — api-builder (B2–B6)

**Builder**: api-builder  
**Appointed to waves**: `mmm-build-wave-b2-core-api`, `mmm-build-wave-b3-core-api` (supporting),
`mmm-build-wave-b4-framework-lifecycle`, `mmm-build-wave-b5-assessment-execution`,
`mmm-build-wave-b6-findings-reporting`  
**Appointment Date**: 2026-04-20  
**Appointed By**: foreman-v2-agent v6.2.0 (via mat-specialist delegation)  
**Stage 9 Verdict Reference**: builder-checklist.md §4.2 — PASS (with SB-002 condition)  

> ⚠️ **CRITICAL — SB-002 RESOLUTION (MANDATORY PRE-READ FOR api-builder)**
>
> The Stage 9 Builder Checklist (§4.2) identified a critical scope clarification condition
> (SB-002): api-builder's contract mission document references "Next.js API routes" as the
> backend pattern. **This is NOT the target runtime for MMM Stage 12.**
>
> **RESOLVED IN THIS APPOINTMENT** (per Stage 11 authority):
>
> For ALL api-builder work in Waves B2–B6:
> - **Target runtime**: **Supabase Edge Functions (Deno runtime) EXCLUSIVELY**
> - **Deployment target**: `supabase/functions/` directory
> - **NOT authorized**: Next.js API routes (any file under `pages/api/` or `app/api/` is OUT OF SCOPE)
> - The 26 Edge Functions defined in `architecture.md` §A4.1 are the complete and exclusive
>   backend implementation surface for MMM Stage 12
> - api-builder MUST treat Deno/Supabase as its only runtime; Next.js-style routes are
>   explicitly prohibited in MMM Stage 12 work
>
> This resolution is binding from the moment api-builder begins Wave B2. Any Next.js API route
> implementation constitutes a scope violation and will be treated as a Stage 12 governance defect.

#### Authorized Scope

api-builder is authorized to execute **Waves B2–B6** with the following exact scope per wave:

**Wave B2 (`mmm-build-wave-b2-core-api`) — 6 foundational Edge Functions**:
- `mmm-health` — health check endpoint
- `mmm-qiw-status` — QIW (queue-in-waiting) status
- `mmm-org-update` — organisation update
- `mmm-invitation-create` — invitation creation
- `mmm-invitation-accept` — invitation acceptance
- `mmm-commissioning-check` — app startup commissioning checks (CHK-001–CHK-005)

All 6 functions target `supabase/functions/` and use Deno runtime exclusively.

**Wave B3 (`mmm-build-wave-b3-core-api` — supporting api for onboarding)**:
- `mmm-org-create` — organisation creation
- `mmm-framework-init` — framework initialisation
- `mmm-free-assessment` — free/public assessment entry point
- Supporting Edge Function logic for journeys J-01–J-05

**Wave B4 (`mmm-build-wave-b4-framework-lifecycle`)**:
- Framework lifecycle Edge Functions for journeys J-06–J-08
- Scope per implementation-plan.md §3.4 wave scope definition

**Wave B5 (`mmm-build-wave-b5-assessment-execution`)**:
- Assessment execution Edge Functions for journeys J-09–J-11
- Scope per implementation-plan.md §3.5 wave scope definition

**Wave B6 (`mmm-build-wave-b6-findings-reporting`)**:
- Findings and reporting Edge Functions for journeys J-12–J-15
- Scope per implementation-plan.md §3.6 wave scope definition

**Complete Edge Function inventory**: All 26 Edge Functions are defined in `architecture.md`
§A4.1. This list is frozen. api-builder must not add, remove, or rename any of the 26
functions.

**AIMC stub pattern (B3–B6)**: For any Edge Function in B3–B6 that requires AIMC boundary
calls, api-builder MUST implement a **stub** (mock response with correct interface shape).
Live AIMC wiring is **B7 scope** (integration-builder). api-builder stub pattern must:
- Return correct TypeScript interface-shaped responses
- Emit structured stub log entries for traceability
- Be clearly marked `// AIMC_STUB — B7 LIVE WIRE PENDING` in code

#### Authority Boundaries

api-builder is **EXPLICITLY NOT authorized** to:

- Implement **Next.js API routes** — Deno/Supabase Edge Functions are the ONLY permitted
  backend implementation form (SB-002 resolved above)
- Write any **React/TypeScript frontend code** (ui-builder responsibility for B3–B6)
- Make any **schema changes** — schema-builder B1 must be complete and frozen before B2 begins
- Wire **AIMC live endpoints** in B2–B6 — stub pattern required; live wiring is B7 scope
- Wire **PIT live data feed** in B2–B6 — stub pattern required; live wiring is B7 scope
- Perform any **integration-builder boundary wiring** — ownership boundary law (OB-1–OB-3) applies
- **Close any wave** (B2–B6) without the designated test domain reaching GREEN status

#### Appointment Conditions

Conditions from builder-checklist.md §4.2 carried forward as binding obligations:

| Condition | Status | Obligation |
|-----------|--------|------------|
| SB-002 Deno/Supabase declaration | ✅ RESOLVED IN THIS APPOINTMENT | api-builder must implement ALL backend as Supabase Edge Functions (Deno); zero Next.js API routes |
| Full Edge Function inventory (26 functions, §A4.1) | Active | All 26 functions as frozen inputs; no additions or deletions |
| AIMC stub pattern B3–B6 | Active | Live AIMC wiring deferred to B7; stub responses required with structured logs |
| Per-wave test IDs from implementation-plan.md §3.x.4 | Active | Each wave (B2–B6) must reach GREEN on its designated test subsets |
| NBR-001 per-wave obligation | Active | All mutations via Edge Functions must support cache invalidation (TanStack Query consumers) |
| NBR-002 per-wave obligation | Active | All write Edge Functions must return HTTP 403 on RLS violation (no silent error swallowing) |
| Wave completion conditions §3.2.5–§3.6.5 | Active | Each wave closure requires evidence commit per implementation-plan.md conditions |
| STOP-AND-FIX protocol | Active | Any test failure must halt the wave for fix before continuing |

#### Carry-Forward Obligations (from Stage 8/9/10)

- **CG-001 carry-forward**: api-builder's Edge Function implementations must not encode
  source-state assumptions. No Edge Function may assume source retirement has occurred or
  that a convergence switchover is in effect unless SG-1–SG-5 conditions have been satisfied
  (which they have not at Stage 12 start).
- **CG-002 carry-forward**: Ownership boundary law applies to B2–B6. Edge Functions may
  call AIMC/PIT boundary via stub in B3–B6; they must not embed source-system internal
  logic. Consumer boundary only.
- **CG-003 carry-forward**: api-builder's B2–B6 wave closures prove only that MMM Edge
  Function implementation is complete to spec. They do NOT prove AIMC internal completion
  or source retirement eligibility.
- **NBR-001 carry-forward**: Every Edge Function that mutates state (INSERT/UPDATE/DELETE
  via mmm_ tables) must be designed to support downstream TanStack Query cache invalidation
  at the UI layer. This is a design constraint on response envelope design.
- **NBR-002 carry-forward**: Every write Edge Function must propagate Supabase RLS HTTP 403
  responses to callers without swallowing them.

---

### 3.3 — ui-builder (B3–B6)

**Builder**: ui-builder  
**Appointed to waves**: `mmm-build-wave-b3-core-ui` (primary), `mmm-build-wave-b4-framework-lifecycle`,
`mmm-build-wave-b5-assessment-execution`, `mmm-build-wave-b6-findings-reporting`  
**Appointment Date**: 2026-04-20  
**Appointed By**: foreman-v2-agent v6.2.0 (via mat-specialist delegation)  
**Stage 9 Verdict Reference**: builder-checklist.md §4.3 — PASS  

#### Authorized Scope

ui-builder is authorized to execute **Waves B3–B6** with the following exact scope per wave:

**Wave B3 (`mmm-build-wave-b3-core-ui`) — Journeys J-01–J-05 (Onboarding)**:
- J-01: Organisation registration and initial setup
- J-02: Framework selection and activation
- J-03: Team member invitation and acceptance
- J-04: Free/public assessment entry point
- J-05: Commissioning check and system health display

ui-builder is the **primary builder** in Wave B3. ui-builder and api-builder execute in
parallel during B3: api-builder produces supporting onboarding Edge Functions; ui-builder
produces the React/TypeScript/Vite frontend for J-01–J-05. Both must be GREEN at B3 closure.

**Wave B4 (`mmm-build-wave-b4-framework-lifecycle`) — Journeys J-06–J-08**:
- Framework lifecycle management UI (create, configure, activate, deactivate frameworks)
- Per architecture.md §A3 frontend architecture patterns

**Wave B5 (`mmm-build-wave-b5-assessment-execution`) — Journeys J-09–J-11**:
- Assessment execution UI (assessment initiation, evidence collection, scoring display)
- Per architecture.md §A3 frontend architecture patterns

**Wave B6 (`mmm-build-wave-b6-findings-reporting`) — Journeys J-12–J-15**:
- Findings display, maturity report UI, gap analysis view, recommendation display

**All waves B3–B6**:
- Build tool: **Vite bundler** (confirmed in runtime/deployment-contract.md — frozen)
- Framework: **React/TypeScript** (architecture.md §A3)
- State management: **Zustand** (per architecture.md §A3.3)
- Data fetching: **TanStack Query** (per architecture.md §A3.4)
- Vercel staging deployment is a **completion condition from B3 onward** — ui-builder must
  deploy to Vercel staging and provide the deployment URL as B3 (and each subsequent wave)
  completion evidence

#### Authority Boundaries

ui-builder is **EXPLICITLY NOT authorized** to:

- Implement any **Supabase Edge Functions or backend code** of any kind (api-builder scope)
- Make any **direct AIMC, PIT, or KUC boundary API calls** from the frontend — all boundary
  calls must go through MMM Edge Functions (integration-builder B7 wires the boundaries;
  ui-builder only calls MMM's own Edge Function interface)
- Implement any **PIT-specific domain logic** in the React application — the frontend renders
  MMM data only
- Make any **schema changes** (schema-builder B1 scope)
- **Close any wave** (B3–B6) without Vercel staging deployment URL committed and designated
  test domain GREEN

#### Appointment Conditions

Conditions from builder-checklist.md §4.3 carried forward as binding obligations:

| Condition | Status | Obligation |
|-----------|--------|------------|
| Vite bundler confirmed | Active | All frontend code must use Vite as the build tool (frozen from runtime/deployment-contract.md) |
| Architecture.md §A3 as frozen frontend input | Active | React/TypeScript/Zustand/TanStack Query patterns per §A3 — no substitutions |
| NBR-001: useMutation cache invalidation | Active | All `useMutation` hooks (TanStack Query) MUST invalidate relevant caches on success; no mutation may leave stale cache |
| NBR-002: HTTP 403 explicit UI error | Active | HTTP 403 from Supabase RLS MUST be surfaced as an explicit error message in the UI — no silent failure, no generic "something went wrong" |
| NBR-003: Zustand store reset on org switch | Active | Zustand store MUST be reset when the active organisation context changes — no stale org data must persist across org switches (B3 specific) |
| Vercel staging deployment as completion condition | Active | Each wave B3–B6 closure requires Vercel staging deployment URL committed as evidence |
| Per-journey coverage | Active | All UX journeys assigned to each wave must be fully implemented and wired before wave closure |
| STOP-AND-FIX protocol | Active | Any test failure must halt the wave for fix before continuing |

#### Carry-Forward Obligations (from Stage 8/9/10)

- **CG-001 carry-forward**: The UI must not assume or display state based on source retirement.
  All source-state assumptions are governed by CG-001/SG-1–SG-5 — the UI should reflect
  MMM's current knowledge without implying AIMC or PIT source retirement.
- **CG-002 carry-forward**: Ownership boundary law applies — the frontend must not expose
  AIMC or PIT internal data models directly. Only MMM Edge Function responses are rendered.
- **NBR-001 carry-forward**: Every TanStack Query `useMutation` call must include an
  `onSuccess` handler that calls `queryClient.invalidateQueries(...)` for all affected
  query keys. This is verified by qa-builder via GP-004 and GP-005.
- **NBR-002 carry-forward**: HTTP 403 responses from Supabase RLS must be caught at the
  API layer and surfaced as explicit user-facing errors (not swallowed). Verified by
  qa-builder via GP-009.
- **NBR-003 carry-forward**: Zustand store reset on org switch is a hard B3 obligation. The
  state management architecture must include an explicit `resetStore()` or equivalent
  triggered on `useOrgContext` change.

---

### 3.4 — integration-builder (B7)

**Builder**: integration-builder  
**Appointed to waves**: `mmm-build-wave-b7-boundary-integrations`  
**Appointment Date**: 2026-04-20  
**Appointed By**: foreman-v2-agent v6.2.0 (via mat-specialist delegation)  
**Stage 9 Verdict Reference**: builder-checklist.md §4.4 — PASS (with SB-003 hard gate)  

> ⚠️ **CREDENTIAL HARD GATE — SB-003 ACTIVE — B7 WAVE-START IS BLOCKED**
>
> Wave B7 (`mmm-build-wave-b7-boundary-integrations`) **CANNOT begin** until CS2 provisions
> both of the following service credentials:
>
> - **`AIMC_SERVICE_TOKEN`** — required for AIMC boundary wiring (9-function live wire)
> - **`PIT_SERVICE_TOKEN`** — required for PIT data feed integration (7-step handshake)
>
> integration-builder **MUST halt and escalate to CS2** if either credential is absent at
> the point of B7 wave-start. Under no circumstances may integration-builder substitute,
> mock, or stub credentials to bypass this gate.
>
> SB-003 is a **CS2-provisioned hard gate**. It is not resolved in this appointment. It
> remains OPEN until CS2 explicitly confirms both credentials are provisioned in the
> repository secrets or Supabase vault.

#### Authorized Scope

integration-builder is authorized to execute **Wave B7 (`mmm-build-wave-b7-boundary-integrations`)**
with the following exact scope (contingent on SB-003 credential gate being lifted by CS2):

**AIMC Boundary Wiring (9-function live wire)**:
- Replace all AIMC stubs (created by api-builder in B3–B6) with live AIMC boundary calls
- All 9 AIMC-interfacing Edge Functions as defined in `architecture.md` §A6.1
- Consumer boundary pattern ONLY — integration-builder must call AIMC's published
  interface; it must not wire direct LLM endpoints or bypass AIMC's service layer
- AIMC interface contract from TRS TR-011–TR-015 is the binding specification

**PIT Data Feed Integration (7-step export handshake — TR-017)**:
- Implement the PIT export handshake per TRS TR-017 specification
- 7-step handshake sequence must be fully implemented and verified
- Live endpoint wiring replaces any PIT stubs from B3–B6
- PIT interface contract from TRS TR-016–TR-018 is the binding specification

**KUC Upload Contract (TR-019/TR-020)**:
- Implement the KUC upload contract per TRS TR-019 and TR-020
- Upload handshake and acknowledgement pattern per the KUC interface specification

**Circuit Breaker (TR-009) — Full Implementation**:
- CLOSED/OPEN/HALF_OPEN state machine per TR-009 specification
- Applies to all 3 integration boundaries (AIMC, PIT, KUC)
- State transitions must be observable (logged per audit integrity requirements)
- B7 test domain includes circuit breaker state transition verification

**B7 Test Domain**:
- **D5**: T-MMM-S6-098–T-MMM-S6-112 (AIMC boundary integration tests)
- **D7**: T-MMM-S6-121–T-MMM-S6-128 (boundary cross-cutting and circuit breaker tests)
- B7 wave closure requires both D5 and D7 test subsets to be GREEN

#### Authority Boundaries

integration-builder is **EXPLICITLY NOT authorized** to:

- Implement any **core MMM business logic** — domain logic is B2–B6 scope
- Write any **React/TypeScript frontend code** (ui-builder scope)
- Make any **schema changes** (schema-builder B1 scope, frozen before B7 begins)
- Wire **direct LLM endpoints** — AIMC consumer boundary ONLY; no direct OpenAI/Anthropic
  or equivalent wiring within MMM
- **Begin Wave B7** until SB-003 credentials are confirmed provisioned by CS2
- Claim **AIMC internal completion** on the basis of B7 closure — B7 proves MMM boundary
  readiness only (CG-003)
- Claim **source retirement eligibility** on the basis of B7 closure — source retirement
  requires separate CS2 process under SG-1–SG-5 (CG-001)
- **Close Wave B7** without D5 and D7 test subsets GREEN and without CG-003 boundary
  readiness declaration committed

#### Appointment Conditions

Conditions from builder-checklist.md §4.4 carried forward as binding obligations:

| Condition | Status | Obligation |
|-----------|--------|------------|
| SB-003 Credential Hard Gate | ⚠️ OPEN | B7 wave-start BLOCKED until CS2 provisions AIMC_SERVICE_TOKEN + PIT_SERVICE_TOKEN |
| Addendum §4 source-state carry-forward | Active | Source-state law governs all boundary wiring decisions |
| Addendum §5 B7 closure-law | Active | B7 PASS proves MMM boundary readiness ONLY — not AIMC completion, not source retirement |
| Addendum §6 ownership-boundary prohibitions (OB-1/OB-2/OB-3) | Active | OB-1: no direct LLM wiring; OB-2: no PIT internal schema embedding; OB-3: no KUC internal logic |
| AIMC consumer boundary pattern | Active | 9-function AIMC live wire via AIMC service interface only |
| PIT 7-step handshake (TR-017) | Active | Full 7-step sequence with live endpoint |
| KUC upload contract (TR-019/TR-020) | Active | Upload handshake and acknowledgement per TRS spec |
| Circuit breaker (TR-009) full implementation | Active | CLOSED/OPEN/HALF_OPEN state machine for all 3 boundaries |
| B7 test IDs D5 + D7 | Active | T-MMM-S6-098–T-MMM-S6-112 and T-MMM-S6-121–T-MMM-S6-128 must be GREEN at B7 closure |
| STOP-AND-FIX protocol | Active | Any test failure during B7 must halt the wave for fix |

#### Carry-Forward Obligations (from Stage 8/9/10)

- **CG-001 carry-forward (source-state law)**: B7 integration wiring must not assume source
  retirement. The circuit breaker implementation must account for both states: source active
  and source retired. No switchover assumption may be hard-coded.
- **CG-002 carry-forward (ownership-boundary law)**: OB-1 — no direct LLM wiring; OB-2 — no
  PIT internal schema encoded in MMM; OB-3 — no KUC internal logic in MMM. These are hard
  prohibitions, not guidelines.
- **CG-003 carry-forward (B7 closure-law)**: The B7 closure statement MUST explicitly declare:
  "B7 PASS PROVES: MMM boundary wiring is complete and integration boundaries are functional.
  B7 PASS DOES NOT PROVE: AIMC internal completion; source retirement eligibility of any
  AIMC/PIT/KUC source; platform convergence readiness."
- **NBR-002 carry-forward**: Integration-level HTTP 403 responses from Supabase RLS during
  boundary calls must be propagated correctly — no silent swallowing at the integration layer.

---

### 3.5 — qa-builder (B8/B9 + Parallel Gate)

**Builder**: qa-builder  
**Appointed to waves**: `mmm-build-wave-b8-cross-cutting`, `mmm-build-wave-b9-golden-path-verification`
+ parallel QA gate role across B1–B9  
**Appointment Date**: 2026-04-20  
**Appointed By**: foreman-v2-agent v6.2.0 (via mat-specialist delegation)  
**Stage 9 Verdict Reference**: builder-checklist.md §4.5 — PASS  

#### Authorized Scope

qa-builder is authorized to execute **Waves B8 and B9** and the **parallel QA gate role**
across all nine build waves:

**Parallel QA Gate Role (B1–B9)**:
- No build wave (B1–B9) may be declared closed without qa-builder confirming that the wave's
  designated test domain has reached GREEN status
- qa-builder holds gate authority for all 11 test domains (D1–D11) and their assignment to
  the corresponding build wave
- qa-builder is the sole authority for GREEN verdicts on the 176 RED tests

**Wave B8 (`mmm-build-wave-b8-cross-cutting`) — 48 tests (D8–D11)**:
- **Performance testing** using k6 load testing framework
- **Security scanning** using OWASP ZAP or equivalent (per architecture security requirements)
- **Governance and compliance validation** (per TRS TR-037; COMPLIANCE_SCOPE.md inputs)
- **Test range**: T-MMM-S6-129–T-MMM-S6-176 (48 tests across D8–D11 domains)
- Performance baselines from TRS TR-001–TR-008 (response time, throughput, concurrency)
- Security scan must cover all 26 Edge Function endpoints and Supabase RLS surface

**Wave B9 (`mmm-build-wave-b9-golden-path-verification`) — Final verification**:
- **Accessibility audit**: WCAG 2.1 AA compliance using axe-core (per architecture §A3.6)
- **All-176-tests-GREEN final verification**: qa-builder must confirm all 176 RED tests
  (T-MMM-S6-001–T-MMM-S6-176) are GREEN before B9 closure — not a subset, ALL 176
- **Golden path proving**: GP-001–GP-010 verified end-to-end (from golden-path-verification-pack.md)
- **Regression management**: No test previously GREEN may be RED at B9 closure
- **Defect-fix protocol**: Defects found in B8 or B9 that originate in prior waves are
  returned to the responsible prior-wave builder for fix; qa-builder does not implement fixes

**NBR final verification (B9 specific)**:
- NBR-001 final verification via **GP-004** (TanStack Query cache invalidation end-to-end)
  and **GP-005** (mutation rollback on error)
- NBR-002 final verification via **GP-009** (cross-org write attempt — 403 surfaced in UI)
  and **GP-007** (RLS enforcement under assessment context)

> **B9 Closure-Law Statement (CG-004 — BINDING)**:
>
> "B9 PASS PROVES: The MMM destination system is ready to receive production traffic. All
> 176 tests are GREEN. All 10 golden paths are proven. All NBR obligations are verified.
> B9 PASS DOES NOT PROVE: Source system retirement eligibility. Switchover readiness.
> Source retirement is a separate CS2 decision governed by SG-1–SG-5 conditions in
> `convergence-governance-addendum.md` v1.0.0. No claim of platform convergence or source
> retirement may be made on the basis of B9 PASS alone."

#### Authority Boundaries

qa-builder is **EXPLICITLY NOT authorized** to:

- Implement any **new business logic** or fix defects in prior-wave builder code — qa-builder
  identifies and returns defects to the responsible builder
- Make any **schema changes** (schema-builder scope)
- **Authorize source retirement** — B9 PASS is not a source retirement authorization (CG-004)
- Declare **convergence or switchover** based on B9 results — CS2 SG-1–SG-5 process required
- **Close Wave B9** without ALL 176 tests GREEN (not 175, not 174 — ALL 176)

#### Appointment Conditions

Conditions from builder-checklist.md §4.5 carried forward as binding obligations:

| Condition | Status | Obligation |
|-----------|--------|------------|
| Parallel QA gate role confirmed for B1–B9 | Active | No wave closes without qa-builder GREEN verdict on the wave's test domain |
| B8 test IDs (D8–D11, T-MMM-S6-129–T-MMM-S6-176) | Active | 48 tests; performance, security, governance, compliance |
| B9 ALL-176-tests-GREEN requirement | Active | B9 MUST NOT close unless all 176 tests are GREEN |
| NBR-001 final verification (GP-004/GP-005) | Active | Golden paths GP-004 and GP-005 must be proven GREEN at B9 |
| NBR-002 final verification (GP-009/GP-007) | Active | Golden paths GP-009 and GP-007 must be proven GREEN at B9 |
| Defect-fix protocol | Active | Defects found in B8 return to prior-wave builder; qa-builder does not implement fixes |
| CG-004 B9 closure-law | Active | B9 PASS = destination readiness only; source retirement requires separate CS2 sign-off |
| STOP-AND-FIX protocol | Active | Any test failure must halt the wave for fix before continuing |
| Accessibility: WCAG 2.1 AA via axe-core | Active | All UI components must pass axe-core accessibility audit at B9 |

#### Carry-Forward Obligations (from Stage 8/9/10)

- **CG-004 carry-forward (B9 closure-law)**: qa-builder's B9 closure declaration MUST
  include the explicit statement reproduced above. The closure statement is non-negotiable
  and must be present in qa-builder's B9 evidence commit.
- **CG-001 carry-forward**: qa-builder's test suite must include tests that verify MMM
  correctly handles both source-active and source-retired states without assuming any
  particular state.
- **NBR-001 carry-forward**: GP-004 and GP-005 are the final verification checkpoints for
  TanStack Query cache invalidation obligations. These golden paths must be proven with
  end-to-end observable evidence.
- **NBR-002 carry-forward**: GP-009 and GP-007 are the final verification checkpoints for
  Supabase RLS 403 detection. These golden paths must produce observable HTTP 403 events
  with explicit UI error display evidence.

---

## Section 4 — Stage 10 Pre-Brief Carry-Forward Mapping

The Stage 10 IAA Pre-Brief (`iaa-pre-brief.md` v1.0.0) established a set of task-level and
wave-level assurance obligations. This section explicitly maps those obligations into Stage 11
and their downstream Stage 12 obligations.

### 4.1 Task-Level Assurance Carry-Forward

| Pre-Brief Task ID | Pre-Brief Description | Stage 11 Mapping | Stage 12 Obligation |
|-------------------|-----------------------|------------------|---------------------|
| T-S10-001 | SB-002 must be resolved in Stage 11 appointment text | ✅ RESOLVED in §3.2 of this document | api-builder briefed; Next.js prohibited; Deno/Supabase declared exclusive |
| T-S10-002 | SB-003 credential hard gate must be preserved | ✅ PRESERVED as hard gate in §3.4 and §5 | B7 wave-start blocked until CS2 provisions AIMC_SERVICE_TOKEN + PIT_SERVICE_TOKEN |
| T-S10-003 | CG-001–CG-005 must be explicitly carried into all Stage 12 waves | ✅ DECLARED in §6 of this document | Per-wave IAA conformance required at Stage 12 |
| T-S10-004 | NBR-001/NBR-002 must be embedded in all Stage 12 per-wave obligations | ✅ DECLARED in §7 of this document and per-builder §§3.1–3.5 | Per-wave verification by qa-builder |
| T-S10-005 | Builder appointments must include explicit authority boundaries | ✅ ALL 5 BUILDERS — authority boundaries declared in §§3.1–3.5 | Builders are bound to their authority boundaries from Stage 12 first commit |

### 4.2 Wave-Level Admin Ceremony Expectations (§12 Carry-Forward)

The Stage 10 Pre-Brief §12 established the following Wave-Level Admin Ceremony Expectations
for all Stage 12 waves:

| §12 Item | Expectation | Stage 12 Obligation |
|----------|-------------|---------------------|
| §12.1 | Each Stage 12 build wave must begin with a wave-start declaration | Every B1–B9 wave-start requires Foreman wave-start authorization; builders may not self-start |
| §12.2 | Each Stage 12 build wave must close with a QA GREEN verdict | qa-builder parallel gate role (§3.5) enforces this for all waves |
| §12.3 | Evidence commits are mandatory at each wave closure | No wave may be declared closed without an evidence commit; applies to all 5 builders |
| §12.4 | ECAP ceremony bundle (PREHANDOVER + session memory) required at each Stage 12 wave closure | All builders must complete the ECAP ceremony bundle per governance/templates/ |
| §12.5 | IAA conformance check required for waves B7 and B9 specifically | integration-builder B7 and qa-builder B9 require explicit IAA conformance at closure; pending maturion-isms#1420 |

### 4.3 Applicable Canon Overlays

The following canon overlays from Stage 10 §11 apply to all Stage 12 build waves:

| Overlay | Description | Applies To |
|---------|-------------|-----------|
| OVL-PBG-001–016 | Pre-Build Gate overlays (all 16) | All Stage 12 waves; Foreman QP evaluation |
| OVL-PBG-ADM-001 | Admin ceremony overlay | Every wave closure ECAP bundle |
| OVL-INJ series | Injection prevention overlays | All builders — scope injection detection |
| CERT-001–004 | Stage 12 certification requirements | B9 final certification package |

### 4.4 Evidence/Proof Posture for Stage 12

Each Stage 12 wave must produce the following evidence classes for downstream Stage 12 IAA
and eventual Stage 12 closure certification:

| Evidence Class | Produced By | Required At |
|---------------|-------------|------------|
| GREEN test run output | qa-builder (parallel gate) | Every wave closure |
| Evidence commit SHA | All builders | Every wave closure |
| Wave-level scope compliance declaration | All builders | Every wave closure |
| Vercel staging deployment URL | ui-builder (B3–B9) | Every B3–B9 wave closure |
| CG-003/CG-004 closure-law statement | integration-builder (B7) / qa-builder (B9) | B7 and B9 closure only |
| ECAP ceremony bundle | All builders | Every wave closure |

---

## Section 5 — Blocker and Gate Declaration

The following blockers and gates are formally declared for Stage 12:

| Blocker ID | Description | Status | Resolution Path | Blocking What |
|------------|-------------|--------|-----------------|---------------|
| SB-002 | api-builder contract mission references "Next.js API routes" only. MMM Stage 12 uses Supabase Edge Functions (Deno runtime) EXCLUSIVELY. | ✅ **RESOLVED IN THIS APPOINTMENT** (§3.2) | Explicit declaration in §3.2: api-builder appointment declares Deno/Supabase as the EXCLUSIVE target runtime; Next.js API routes explicitly prohibited | Stage 12 B2 wave-start was conditional on this resolution — CONDITION MET |
| SB-003 | B7 credential hard gate: `AIMC_SERVICE_TOKEN` + `PIT_SERVICE_TOKEN` not yet provisioned by CS2 | ⚠️ **OPEN — Hard gate active** | CS2 must provision both tokens in repository secrets or Supabase vault; integration-builder must receive explicit confirmation from CS2 before B7 wave-start | Stage 12 B7 wave-start (all other waves B1–B6, B8–B9 are unaffected by SB-003) |
| CG-001–CG-005 | Convergence-governance carry-forwards (source-state/switchover law, ownership-boundary law, B7/B9 closure laws, builder-readiness) | **ACTIVE — carried forward into all Stage 12 waves** | Per-wave IAA conformance required at Stage 12; each wave closure must include CG compliance declaration | All Stage 12 build waves (CG-001–CG-005 binding throughout) |
| NBR-001 | TanStack Query mutation cache invalidation — all Stage 12 mutations must invalidate relevant caches | **ACTIVE — Stage 12 per-wave obligation** | Per-wave verification by qa-builder; final verification via GP-004/GP-005 at B9 | Stage 12 B2–B9 waves (all waves involving ui-builder and api-builder mutations) |
| NBR-002 | Supabase RLS write-block detection — no silent swallowing of HTTP 403 | **ACTIVE — Stage 12 per-wave obligation** | Per-wave verification by qa-builder; final verification via GP-009/GP-007 at B9 | Stage 12 B1–B9 waves (all waves involving any write path through RLS) |

---

## Section 6 — Convergence-Governance Carry-Forward (CG-001–CG-005)

Each convergence-governance law from `convergence-governance-addendum.md` v1.0.0 is restated
explicitly below. These laws are **binding throughout Stage 12** and are not waivable by any
builder without CS2 authority.

### CG-001 — Source-State/Switchover Law

**Law Statement**: No Stage 12 build wave, no MMM module artifact, and no builder agent action
may assume, imply, or encode that any source system (AIMC, PIT, KUC) has been retired,
decommissioned, or replaced. The MMM destination system must be built to function correctly
in both states: source active AND source retired.

**Switchover Gate Conditions (SG-1–SG-5)**: A source system may only be considered for
retirement after ALL five conditions are satisfied:
- SG-1: MMM destination system is live in production with all 176 tests GREEN
- SG-2: Data migration or parallel-run period complete per CS2 decision
- SG-3: Stakeholder acceptance testing complete
- SG-4: Rollback capability verified and documented
- SG-5: CS2 explicit sign-off on retirement decision

**None of SG-1–SG-5 are satisfied at Stage 11. No source retirement is in scope for Stage 12.**

**Applies to**: All 5 builders, all 9 waves (B1–B9).

### CG-002 — Ownership-Boundary Law

**Law Statement**: MMM builders must respect strict ownership boundaries between MMM and
its integration partners (AIMC, PIT, KUC). No builder may embed source-system internal
logic, schema, or data models inside MMM components.

**OB-1 (AIMC boundary)**: MMM may call AIMC's published consumer interface only. No direct
LLM wiring. No embedding of AIMC internal prompt engineering, model selection, or evaluation
logic in MMM code.

**OB-2 (PIT boundary)**: MMM may consume PIT's published export interface only. No direct
PIT database access. No embedding of PIT internal data models or business logic in MMM schema
or Edge Functions.

**OB-3 (KUC boundary)**: MMM may call KUC's published upload interface only. No direct KUC
database access. No embedding of KUC internal processing logic in MMM.

**Per-wave IAA conformance required**: Each Stage 12 wave closure must include a declaration
that OB-1/OB-2/OB-3 have been respected within the wave's scope.

### CG-003 — B7 Closure-Law

**Law Statement**: Wave B7 PASS proves ONE thing and ONE thing only: MMM's boundary wiring
to AIMC, PIT, and KUC is complete and functional as per the architecture specification.

**B7 PASS DOES NOT PROVE**:
- AIMC internal implementation is complete or production-ready
- PIT source data export pipeline is complete
- KUC upload processing is complete
- Any source system is ready for retirement
- Platform convergence is achievable on any particular timeline

**B7 closure statement obligation**: integration-builder must commit the B7 closure-law
statement (verbatim from §3.4 above) as part of the B7 evidence commit.

### CG-004 — B9 Closure-Law

**Law Statement**: Wave B9 PASS proves ONE thing and ONE thing only: The MMM destination
system is ready to receive production traffic (all 176 tests GREEN, all 10 golden paths
proven, WCAG 2.1 AA verified).

**B9 PASS DOES NOT PROVE**:
- Source system retirement eligibility
- Switchover readiness
- Platform convergence completion
- That SG-1–SG-5 conditions are satisfied

**B9 closure statement obligation**: qa-builder must commit the B9 closure-law statement
(verbatim from §3.5 above) as part of the B9 evidence commit. This statement is a required
closure condition for Wave B9 and for Stage 12 overall.

### CG-005 — Builder-Readiness Carry-Forward

**Law Statement**: Stage 9 builder readiness verdicts (PASS for all 5 builders) are frozen
at the time of Stage 9 IAA token issuance. No re-assessment of builder readiness is required
or permitted in Stage 11.

**Implication**: The builder appointments in §§3.1–3.5 of this document are the authoritative
Stage 11 outputs. They derive directly from the Stage 9 verdicts. No builder's scope,
authority boundaries, or appointment conditions may be altered in Stage 12 without a formal
Stage 11 amendment wave authorised by CS2.

---

## Section 7 — Anti-Regression Obligations (NBR-001–NBR-005)

The following anti-regression obligations are binding for all Stage 12 build waves. They
derive from `golden-path-verification-pack.md` (Stage 7), `implementation-plan.md` §8
(Stage 8), and `iaa-pre-brief.md` §9 (Stage 10).

### NBR-001 — TanStack Query Cache Invalidation

**Obligation**: Every mutation operation (INSERT/UPDATE/DELETE path) that originates in a
React component via `useMutation` (TanStack Query) MUST include an `onSuccess` callback
that calls `queryClient.invalidateQueries(...)` for all affected query keys.

**Applies to**: All build waves B2–B9 (any wave involving ui-builder mutation hooks or
api-builder mutation-triggering Edge Functions).

**Verification**: qa-builder verifies per-wave compliance. Final verification via GP-004
(cache invalidation smoke test) and GP-005 (optimistic update with rollback) at Wave B9.

**Prohibition**: No mutation hook may be merged with a missing `invalidateQueries` call.
This is a hard rule enforced via code review and test suite. Violations are B9-blocking defects.

### NBR-002 — Supabase RLS 403 Detection

**Obligation**: Every write path (INSERT/UPDATE/DELETE via Supabase RLS) must propagate
HTTP 403 responses to callers. The UI MUST render an explicit, user-visible error message
when a 403 is received. "Silent swallowing" (catching the error and doing nothing) is
prohibited at all layers (schema, Edge Function, UI).

**Applies to**: All build waves B1–B9 (schema B1, Edge Functions B2–B6, UI B3–B6,
boundary B7, verification B8–B9).

**Verification**: qa-builder verifies per-wave compliance. Final verification via GP-009
(cross-org write attempt) and GP-007 (RLS enforcement under assessment context) at Wave B9.

**HTTP 403 surface requirement**: The error must appear as a user-visible error message in the
UI — not a console log, not a generic "error occurred" toast, but a specific indication that
the operation was denied due to access control.

### NBR-003 — Zustand Store Reset on Org Switch

**Obligation**: The Zustand store (all slices that contain org-scoped data) MUST be explicitly
reset when the active organisation context changes. No org-scoped data may persist in memory
after an org switch.

**Applies to**: Wave B3 (ui-builder, J-01–J-05 org switch path).

**Verification**: qa-builder B9 final verification — GP golden path covering org context
switch must verify Zustand store is empty/reset after org switch.

**Implementation requirement**: ui-builder must implement a `resetOrgStore()` call or
equivalent Zustand action, triggered from the `useOrgContext` change handler.

### NBR-004 — Optimistic Update Rollback on Error

**Obligation**: Any UI mutation that implements optimistic updates MUST implement a rollback
(`onError` handler calling `queryClient.setQueryData(...)` with the previous snapshot) to
restore the previous state on failure.

**Applies to**: All waves involving ui-builder mutation hooks (B3–B6).

**Verification**: qa-builder GP-005 (optimistic update with rollback) at Wave B9.

### NBR-005 — Schema Migration Column Mismatch Detection

**Obligation**: Any schema migration that adds, removes, or renames a column must be
accompanied by a corresponding TypeScript type update in the shared types package. No
migration may be deployed if the TypeScript type definitions are out of sync with the schema.

**Applies to**: Wave B1 (schema-builder). Any subsequent schema amendment wave (none
currently planned — schema is frozen after B1).

**Verification**: qa-builder must include a schema/type sync check in the B8 cross-cutting
test suite (D10 domain subset).

---

## Section 8 — Wave Sequencing and Dependency Map

The following diagram and dependency table describes the Stage 12 build wave execution order.

```
Stage 12 Build Wave Sequencing (B1 → B9)
─────────────────────────────────────────────────────────────────────────────

                        ┌─────────────────────────────┐
                        │  PREREQUISITE: Stage 11      │
                        │  Builder Appointment COMPLETE │
                        │  (this document)             │
                        └──────────────┬──────────────┘
                                       │
                              Foreman wave-start auth
                                       │
                                       ▼
                           ┌─────────────────────┐
                    B1 ──► │   schema-builder     │  25 mmm_ tables, RLS, indexes,
                           │   Wave B1            │  storage buckets, seed data
                           └──────────┬──────────┘
                                      │ B1 D9+D10 GREEN ✅
                              Foreman wave-start auth
                                      │
                  ┌───────────────────▼──────────────────┐
    B2 ──────────►│          api-builder                 │  6 foundational
                  │          Wave B2                      │  Edge Functions
                  └───────────────────┬──────────────────┘
                                      │ B2 GREEN ✅
                              Foreman wave-start auth
                                      │
             ┌────────────────────────▼────────────────────────┐
             │   PARALLEL: B3 api-builder + B3 ui-builder       │
             │                                                   │
    B3-api ─►│  api-builder (Wave B3 supporting)                │  J-01–J-05
             │  org-create, framework-init, free-assessment EF  │  onboarding
             │                                                   │  api+ui
    B3-ui  ─►│  ui-builder (Wave B3 primary)                    │  both must
             │  React/Vite frontend J-01–J-05                   │  be GREEN
             │                                                   │  for B3 close
             └────────────────────────┬────────────────────────┘
                                      │ B3 D1–D3 GREEN ✅ + Vercel deploy ✅
                              Foreman wave-start auth
                                      │
             ┌────────────────────────▼────────────────────────┐
             │   PARALLEL: B4 api-builder + B4 ui-builder       │
    B4-api ─►│  Framework lifecycle Edge Functions J-06–J-08   │  J-06–J-08
    B4-ui  ─►│  React/Vite framework lifecycle UI              │
             └────────────────────────┬────────────────────────┘
                                      │ B4 GREEN ✅ + Vercel deploy ✅
                              Foreman wave-start auth
                                      │
             ┌────────────────────────▼────────────────────────┐
             │   PARALLEL: B5 api-builder + B5 ui-builder       │
    B5-api ─►│  Assessment execution Edge Functions J-09–J-11  │  J-09–J-11
    B5-ui  ─►│  React/Vite assessment execution UI             │
             └────────────────────────┬────────────────────────┘
                                      │ B5 GREEN ✅ + Vercel deploy ✅
                              Foreman wave-start auth
                                      │
             ┌────────────────────────▼────────────────────────┐
             │   PARALLEL: B6 api-builder + B6 ui-builder       │
    B6-api ─►│  Findings/reporting Edge Functions J-12–J-15    │  J-12–J-15
    B6-ui  ─►│  React/Vite findings/reporting UI               │
             └────────────────────────┬────────────────────────┘
                                      │ B6 GREEN ✅ + Vercel deploy ✅
                              Foreman wave-start auth
                                      │
                           ┌──────────▼──────────┐
                    B7 ──► │ integration-builder  │  AIMC (9fn live wire),
                ⚠️ SB-003   │ Wave B7             │  PIT 7-step handshake,
                GATE FIRST  │                     │  KUC upload contract,
                           │                     │  circuit breaker (TR-009)
                           └──────────┬──────────┘
                                      │ B7 D5+D7 GREEN ✅ + CG-003 closure-law
                              Foreman wave-start auth
                                      │
                           ┌──────────▼──────────┐
                    B8 ──► │   qa-builder         │  k6 perf, OWASP security,
                           │   Wave B8             │  governance/compliance
                           │   (D8–D11, 48 tests) │  T-MMM-S6-129–176
                           └──────────┬──────────┘
                                      │ B8 D8–D11 GREEN ✅
                              Foreman wave-start auth
                                      │
                           ┌──────────▼──────────┐
                    B9 ──► │   qa-builder         │  WCAG 2.1 AA axe-core,
                           │   Wave B9             │  ALL-176-GREEN,
                           │   (ALL 176 tests)    │  GP-001–GP-010,
                           └──────────┬──────────┘  regression management
                                      │ ALL 176 GREEN ✅ + CG-004 closure-law
                                      │ + GP-001–GP-010 proven
                                      │
                           ┌──────────▼──────────┐
                           │  Stage 12 COMPLETE   │
                           │  → Stage 13 (CS2)    │
                           └─────────────────────┘
```

**QA Gate Role (parallel throughout B1–B9)**:
qa-builder operates as a **continuous parallel gate** across all waves. It does not execute
as a sequential step for B1–B6; it gates every wave closure. No wave may close without
qa-builder's GREEN verdict on the wave's designated test domain.

**Dependency constraints (hard)**:

| Wave | Depends On | Hard Constraint |
|------|-----------|-----------------|
| B2 | B1 COMPLETE | schema-builder B1 must be fully GREEN and frozen before api-builder begins any Edge Function |
| B3 | B2 COMPLETE | api-builder B2 (6 foundational EF) must be GREEN before B3 parallel work begins |
| B4 | B3 COMPLETE (both api + ui) | Both B3-api and B3-ui must be GREEN and Vercel deployed |
| B5 | B4 COMPLETE (both api + ui) | Both B4 components GREEN and deployed |
| B6 | B5 COMPLETE (both api + ui) | Both B5 components GREEN and deployed |
| B7 | B6 COMPLETE + SB-003 LIFTED | B6 fully GREEN AND CS2 must have provisioned AIMC_SERVICE_TOKEN + PIT_SERVICE_TOKEN |
| B8 | B7 COMPLETE | integration-builder B7 must be fully GREEN including CG-003 closure-law statement |
| B9 | B8 COMPLETE | qa-builder B8 must be GREEN before B9 final verification begins |

---

## Section 9 — What Remains Blocked After This Appointment

Stage 11 Builder Appointment authorises builder readiness and formally appoints all five
builders. The following items remain blocked AFTER this appointment is complete:

1. **Stage 12 B7 Wave-Start** — **BLOCKED until SB-003 credentials provisioned by CS2**.
   CS2 must explicitly provision `AIMC_SERVICE_TOKEN` and `PIT_SERVICE_TOKEN` in the
   repository secrets or Supabase vault. integration-builder must receive written confirmation
   from CS2 before commencing B7. All other waves (B1–B6, B8–B9) are unaffected by SB-003.

2. **Source Retirement of Any AIMC/PIT/KUC Source** — **BLOCKED until CG-001 SG-1–SG-5
   conditions are all satisfied**. At the time of this appointment (2026-04-20), none of
   SG-1–SG-5 are satisfied. No stage of Stage 12 build execution constitutes a source
   retirement authorisation.

3. **Platform Convergence or Closure Claims** — **NOT authorized by Stage 12 build
   completion alone**. The completion of all 9 build waves (including B9 PASS) authorises
   the MMM destination system to receive production traffic. It does not authorise any
   claim of platform convergence, AIMC programme completion, or strategic milestone closure.
   These are CS2 authority decisions, not builder authority decisions.

4. **Stage 12 Build Execution Per Wave** — **This appointment authorises builder readiness
   only**. Actual Stage 12 wave-start for each individual wave (B1 through B9) requires a
   **separate Foreman wave-start authorisation** per wave. Builders may not self-start any
   build wave. Each wave must await Foreman wave-start authority before the appointed builder
   begins work.

5. **Stage 11 IAA ASSURANCE-TOKEN** — Stage 11 does not reach formal COMPLETE status until
   the IAA independent-assurance-agent issues an ASSURANCE-TOKEN for this wave. The token
   is expected as Phase 4 of the Stage 11 wave ceremony. BUILD_PROGRESS_TRACKER.md will be
   updated to reflect IAA ASSURANCE-TOKEN status when issued.

---

## Section 10 — Stage 11 Completion Conditions

Stage 11 (Builder Appointment) is complete when ALL of the following conditions are met:

| # | Condition | Status |
|---|-----------|--------|
| SC11-1 | `builder-contract.md` v1.0.0 committed to branch `copilot/mmm-stage-11-builder-appointment` | ✅ COMPLETE (this document) |
| SC11-2 | All 5 builders explicitly appointed with scope and authority boundaries documented in §§3.1–3.5 | ✅ COMPLETE |
| SC11-3 | SB-002 resolved in appointment text (Deno/Supabase declared as exclusive runtime for api-builder) | ✅ COMPLETE — §3.2 |
| SC11-4 | SB-003 preserved as explicit hard gate in §3.4 and §5 (not resolved — preserved) | ✅ COMPLETE |
| SC11-5 | CG-001–CG-005 stated per law in §6 (not just "carry forward" — full law statement) | ✅ COMPLETE |
| SC11-6 | Stage 8/9/10 obligations explicitly carried forward in §§3.1–3.5 per builder | ✅ COMPLETE |
| SC11-7 | Wave sequencing and dependency map present in §8 | ✅ COMPLETE |
| SC11-8 | Blocker and gate declaration table present in §5 | ✅ COMPLETE |
| SC11-9 | BUILD_PROGRESS_TRACKER.md Stage 11 updated to COMPLETE | ✅ COMPLETE (D5) |
| SC11-10 | IAA ASSURANCE-TOKEN obtained at Phase 4 | ⏳ PENDING — IAA to issue at Phase 4 |

**Stage 11 enters COMPLETE upon IAA ASSURANCE-TOKEN issuance (SC11-10).**

### Mandatory Questions — maturion-isms#1426 Answers

The following 8 mandatory questions from issue #1426 are answered by this document:

| Q | Question | Answered In |
|---|----------|-------------|
| MQ-1 | Are all 5 hard start conditions satisfied? | Section 1 — all 5 SATISFIED |
| MQ-2 | What is the complete derivation chain for Stage 11? | Section 2 — Stages 1–10 derivation table |
| MQ-3 | Is SB-002 (api-builder Deno/Next.js) resolved? | Section 3.2, Section 5 — ✅ RESOLVED |
| MQ-4 | Is SB-003 (credential hard gate) preserved and declared? | Section 3.4, Section 5 — ⚠️ OPEN/ACTIVE |
| MQ-5 | Are CG-001–CG-005 laws stated per law? | Section 6 — all 5 laws stated verbatim |
| MQ-6 | Are NBR-001–NBR-005 anti-regression obligations declared for all Stage 12 waves? | Section 7 — all 5 NBRs declared with per-wave scope |
| MQ-7 | What remains blocked after Stage 11 completion? | Section 9 — 5 items explicitly stated |
| MQ-8 | What is the wave sequencing and dependency model for Stage 12? | Section 8 — full dependency map |

---

## Section 11 — Authority

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Appointment Issued By**: foreman-v2-agent v6.2.0 (via mat-specialist delegation per
issue maturion-isms#1426)  
**Derivation Authorities**:
- `modules/MMM/07-implementation-plan/implementation-plan.md` v1.0.0
- `modules/MMM/07-implementation-plan/convergence-governance-addendum.md` v1.0.0
- `modules/MMM/08-builder-checklist/builder-checklist.md` v1.0.0
- `modules/MMM/09-iaa-pre-brief/iaa-pre-brief.md` v1.0.0

**Stage 11 Governance Chain**:
1. CS2 authorised Stage 11 wave (maturion-isms#1426)
2. foreman-v2-agent v6.2.0 delegated Stage 11 production to mat-specialist
3. mat-specialist produced this builder-contract.md v1.0.0
4. Foreman QP evaluation required before CS2 merge
5. IAA independent-assurance-agent to issue ASSURANCE-TOKEN at Phase 4
6. CS2 to merge PR — formal Stage 11 closure on main branch

**Builder Appointment Authority Statement**:  
All five builder appointments (§§3.1–3.5) are issued under CS2 authority, effective from the
date of this document (2026-04-20). The appointments are binding from the moment each
builder receives Foreman wave-start authorisation for their assigned wave(s). No builder
appointment requires further CS2 sign-off to be effective — CS2 authority is vested in
foreman-v2-agent for Stage 11 builder appointment delivery.

---

*Stage 11 Builder Appointment — builder-contract.md v1.0.0 — 2026-04-20*  
*MMM — Maturity Management Module — maturion-isms#1426*  
*Wave: mmm-stage11-builder-appointment-20260420*
