# MMM — Stage 9 Builder Checklist

## Section 0: Status Header

```
Module:                   MMM (Maturity Management Module)
Artifact Type:            Stage 9 Builder Checklist
Status:                   COMPLETE
Version:                  1.0.0
Date:                     2026-04-19
Owner:                    CS2 (Johan Ras / @APGI-cmy)
Produced By:              mat-specialist (delegated by foreman-v2-agent v6.2.0)
Issue:                    maturion-isms#1406
Wave:                     mmm-stage9-builder-checklist-20260419
Branch:                   copilot/mmm-stage-9-builder-checklist
IAA Pre-Brief:            .agent-admin/assurance/iaa-wave-record-mmm-stage9-builder-checklist-20260419.md — CLEARED
Upstream Authority (Stage 8 Plan):    modules/MMM/07-implementation-plan/implementation-plan.md v1.0.0
Upstream Authority (Stage 8 Addendum): modules/MMM/07-implementation-plan/convergence-governance-addendum.md v1.0.0
Upstream Authority (Stage 7):         modules/MMM/06-pbfag/pbfag-checklist.md — IAA token: IAA-session-mmm-stage7-pbfag-20260415-PASS
```

---

## Section 1: Purpose and Scope

### 1.1 Purpose

This Builder Checklist is the Stage 9 artifact in the canonical 12-stage MMM pre-build
model. Its purpose is to confirm that all designated builder agents possess the contract
currency, scope comprehension, QA comprehension, architectural understanding, and
protocol compliance required to execute Stage 12 (Build Execution) safely and correctly.

A Builder Checklist PASS for all five designated builder candidates means:
- Each builder's contract exists, is current, and includes ISMS governance constructs
- Each builder understands the full scope of their assigned wave(s)
- Each builder has internalized the 176 RED tests and the specific test domains that gate
  their wave(s) to GREEN
- Each builder understands the frozen architecture inputs (26 Edge Functions, 25 tables,
  3 integration boundaries)
- Each builder has acknowledged STOP-AND-FIX protocol and the no-wave-closure-without-evidence rule
- Each builder has confirmed the addendum carry-forward obligations (source-state law,
  ownership-boundary law, B7/B9 closure law)

### 1.2 Why Both Stage 8 Documents Are Derivation Authorities

Stage 9 derives from **two** Stage 8 artifacts, not one:

1. **`implementation-plan.md` v1.0.0** — the canonical build-wave spine. It defines all nine
   build waves (B1–B9), their exact scope, sequencing constraints, builder class assignments,
   QA gate test IDs, and completion conditions. It is the primary document from which all
   downstream stages derive.

2. **`convergence-governance-addendum.md` v1.0.0** — the required Stage 8 convergence-governance
   supplement. It imposes mandatory governance constraints on how each wave executes: source-state
   model, switchover gate conditions, B7/B9 closure laws, and ownership boundary prohibitions.
   It does not modify the wave plan; it governs how builders behave within it.

The addendum is not optional context. It is a **required derivation authority** per its own
Section 1.3 (Derivation Requirement table) and per the Stage 8 tracker gate block. Any stage
that derives only from the implementation plan and ignores the addendum is in governance defect.

### 1.3 What This Checklist Explicitly Does NOT Cover

This checklist covers Stages 9–12 planning (readiness confirmation). It does NOT cover:

- **Stage 10** (IAA Pre-Brief) — separate stage following Stage 9 PASS
- **Stage 11** (Builder Appointment) — formal appointment wave following Stage 10 IAA token
- **Stage 12** (Build Execution) — actual code production commencing only after Stage 11
- **Source retirement or platform convergence** — no source-state transitions are authorized
  by this checklist or by any Stage 12 build wave completion
- **PIT source retirement** — governed separately by CS2 switchover gate process (SG-1 through
  SG-5 per capability class); not within MMM Stage 9 scope
- **AIMC/LKIAC programme closure** — MMM implements its own contractual side of AIMC boundaries
  only; AIMC internal implementation is governed on its own timeline

---

## Section 2: Derivation Sources and Frozen Inputs

The following table lists all frozen upstream artifacts from Stages 1–8. These are the
pre-build chain inputs that every builder must treat as authoritative and immutable.

| Stage | Artifact | Location | Status | IAA Token / Approval | Key Output |
|-------|---------|----------|--------|---------------------|-----------|
| Stage 1 | App Description v0.5.0 | `modules/MMM/00-app-description/MMM_app_description.md` | ✅ CS2-approved | maturion-isms#1298 (2026-04-08) | 42 app description sections; product vision, users, constraints |
| Stage 2 | UX Workflow & Wiring Spec v0.1.0 | `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | ✅ CS2-approved | maturion-isms#1352 (2026-04-14) | 17 UX journeys (J-01–J-17); full UI → API → schema wiring |
| Stage 3 | FRS v0.1.0 | `modules/MMM/02-frs/functional-requirements.md` | ✅ CS2-approved | maturion-isms#1366 (merged 2026-04-14) | 80 functional requirements (FR-001–FR-080) |
| Stage 4 | TRS v0.1.0 | `modules/MMM/03-trs/technical-requirements-specification.md` | ✅ CS2-approved | maturion-isms#1378 (2026-04-14) | 66 technical requirements (TR-001–TR-066) |
| Stage 5 | Architecture | `modules/MMM/04-architecture/architecture.md` | ✅ Artifacts complete; CS2 merge pending | Artifacts complete; merge pending | 26 Edge Functions, 25 tables, RLS model, 3 integration boundaries |
| Stage 6 | QA-to-Red Catalog v0.1.0 | `modules/MMM/05-qa-to-red/qa-to-red-catalog.md` | ✅ Artifacts complete; CS2 merge pending | Artifacts complete; merge pending | 176 RED tests (T-MMM-S6-001–T-MMM-S6-176) across 11 domains |
| Stage 7 | PBFAG Checklist | `modules/MMM/06-pbfag/pbfag-checklist.md` | ✅ IAA token issued | IAA-session-mmm-stage7-pbfag-20260415-PASS | PBFAG PASS; 10 golden paths (GP-001–GP-010); NBR-001/NBR-002 registry |
| Stage 7 | Golden Path Verification Pack | `modules/MMM/06-pbfag/golden-path-verification-pack.md` | ✅ IAA token issued | IAA-session-mmm-stage7-pbfag-20260415-PASS | GP-001–GP-010 definitions; NBR-001 embedded in GP-004/GP-005; NBR-002 in GP-009/GP-007 |
| Stage 8 Plan | Implementation Plan v1.0.0 | `modules/MMM/07-implementation-plan/implementation-plan.md` | ✅ Foreman-approved | session-mmm-stage8-implementation-plan-20260417 | 9 build waves (B1–B9) with scope, sequencing, builder classes, completion conditions |
| Stage 8 Addendum | Convergence-Governance Addendum v1.0.0 | `modules/MMM/07-implementation-plan/convergence-governance-addendum.md` | ✅ IAA Pre-Brief CLEARED | `.agent-admin/assurance/iaa-wave-record-mmm-stage8-addendum-20260419.md` — CLEARED | Source-state model; switchover gate conditions (SG-1–SG-5); B7/B9 closure laws; ownership boundary table; carry-forward requirements for Stage 9 |

**Frozen architecture inputs for Stage 12** (all builders must treat as immutable):

| Input Type | Count | Source |
|-----------|-------|--------|
| Functional requirements | 80 (FR-001–FR-080) | `02-frs/functional-requirements.md` |
| Technical requirements | 66 (TR-001–TR-066) | `03-trs/technical-requirements-specification.md` |
| Supabase Edge Functions | 26 named functions | `04-architecture/architecture.md` §A4.1 |
| Database tables (`mmm_` prefix) | 25 tables | `04-architecture/architecture.md` §A5.2 |
| External integration boundaries | 3 (AIMC, PIT, KUC) | `04-architecture/architecture.md` §A6 |
| RED tests | 176 (T-MMM-S6-001–T-MMM-S6-176) | `05-qa-to-red/qa-to-red-catalog.md` |
| Golden paths | 10 (GP-001–GP-010) | `06-pbfag/golden-path-verification-pack.md` |
| Anti-regression obligations | NBR-001, NBR-002 (also NBR-003–NBR-005) | `06-pbfag/pbfag-checklist.md` + `07-implementation-plan/implementation-plan.md` §8 |

---

## Section 3: Builder Candidates and Wave Assignments

The following table is derived from `implementation-plan.md` §6 (Builder Classes and
Specialist Roles). Wave assignments and scope descriptions are authoritative from §6.1
and §6.2 of the implementation plan.

| Builder | Assigned Wave(s) | Role | Scope |
|---------|-----------------|------|-------|
| `schema-builder` | B1 | Primary | All 25 `mmm_` tables, RLS policies on all tables, database indexes (TR-046), storage buckets (`mmm-framework-source`, `mmm-evidence`, `mmm-exports`), idempotent migration scripts, seed data |
| `api-builder` | B2 (primary), B3 (supporting), B4 (primary), B5 (primary), B6 (primary) | Primary B2/B4/B5/B6; Supporting B3 | All Supabase Edge Functions (Deno runtime) — 26 named functions across waves; JWT middleware; audit log write paths; all business logic; ADMIN role guard; invitation model; scoring cascade |
| `ui-builder` | B3 (primary), B4 (supporting), B5 (supporting), B6 (supporting) | Primary B3; Supporting B4/B5/B6 | React frontend (TypeScript/Vite); all 17 UX journeys (J-01–J-17) across B3–B6; Zustand state management; TanStack Query hooks; WCAG 2.1 AA; Vercel deployment |
| `integration-builder` | B7 | Primary | Live AIMC wiring (all 9 AIMC-calling Edge Functions); PIT 7-step handshake live wire; KUC live wire; circuit breaker full implementation (TR-009); J-17 AI interactions journey; convergence-governance boundary law |
| `qa-builder` | B8 (primary), B9 (primary), + parallel QA gate across all waves | Primary B8/B9; parallel QA gate B1–B9 | Cross-cutting QA (D8–D11, T-MMM-S6-129–T-MMM-S6-176, 48 tests); golden path verification (GP-001–GP-010); parallel RED→GREEN gating per wave; NBR-001/NBR-002 final sweeps |

**QA Gating Model**: `qa-builder` runs RED → GREEN gating in parallel with every build wave.
Each wave is not closeable until its designated test domain reaches GREEN. B8 and B9 are
additionally dedicated QA waves in their own right.

---

## Section 4: Builder Readiness Checks (D2)

---

### 4.1 schema-builder Readiness Check

**Agent**: `schema-builder` | **Contract**: `.github/agents/schema-builder.md` | **Assigned Wave**: B1

#### 4.1a Contract Currency

| Check | Result | Evidence |
|-------|--------|---------|
| Contract file exists at `.github/agents/schema-builder.md` | **PASS** | File present; YAML front matter + four-phase canonical contract body |
| Agent version current | **PASS** | `agent.version: 6.2.0`; `contract_version: 4.0.0` — matches current platform version |
| Four-phase canonical contract pattern | **PASS** | `metadata.contract_pattern: four_phase_canonical` — all four phases present |
| ISMS governance constructs present | **PASS** | `governance.protocol: LIVING_AGENT_SYSTEM`; `governance.version: v6.2.0`; canon inventory binding (`governance/CANON_INVENTORY.json`); BUILD_PHILOSOPHY binding; ROLE_APPOINTMENT_PROTOCOL binding |
| IAA invocation mandate | **PASS** | `no_class_exceptions: "IAA invocation is mandatory for all builder agent contracts — no class exemptions."` and `ambiguity_rule: "Any ambiguity as to IAA requirement resolves to: IAA IS required."` |
| STOP-AND-FIX mandate | **PASS** | `stop_and_fix_mandate: "STOP-AND-FIX is absolute. IAA REJECTION-PACKAGE blocks PR and merge by design."` |
| Merge gate interface declared | **PASS** | `merge_gate_interface.required_checks` fully declared with parity enforcement BLOCKING |
| Status: recruited | **PASS** | `metadata.status: recruited` |

#### 4.1b Scope Comprehension — MMM

| Check | Result | Notes |
|-------|--------|-------|
| Contract covers Supabase migrations | **PASS** | `write_access` includes `supabase/migrations/**` and `apps/*/db/**`; capabilities include `["database", "schema", "migrations", "rls-policies"]` |
| Contract covers RLS policies | **PASS** | Explicit capability; prohibition NO-RLS-WEAKEN-001 confirms RLS is treated as constitutional constraint |
| Contract covers indexes and storage buckets | **PASS** | Responsibilities: "Indexes and constraints" explicitly listed; constitutional sandbox example confirms indexing strategy as within scope |
| `mmm_` prefix requirement (TR-028) comprehension | **CONDITIONAL PASS** | Contract scope covers all schema operations; TR-028 (`mmm_` prefix) is a frozen architecture constraint that must be explicitly briefed to the builder at Stage 11 appointment |
| 25 named tables in scope | **CONDITIONAL PASS** | Contract scope covers all schema objects; the 25 specific table names from architecture.md §A5.2 must be provided to the builder as frozen input at Stage 11 |
| Forbidden: application code, Edge Functions, AI services | **PASS** | `forbidden: ["Application code (Edge Functions, frontend)", "AI services", "Cross-module logic"]` — explicitly stated |

#### 4.1c RED QA Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Understands RED→GREEN workflow | **PASS** | Sacred workflow explicitly stated: "Architecture (frozen) → QA-to-Red (failing) → Build-to-Green → Validation (100%) → Merge" |
| B1 QA gate: T-MMM-S6-139–T-MMM-S6-152 (D9 security/RLS) | **CONDITIONAL PASS** | Builder understands RED→GREEN mandate; specific test IDs for B1 (D9/D10 subsets) must be confirmed as part of Stage 11 appointment brief |
| B1 QA gate: T-MMM-S6-153–T-MMM-S6-164 (D10 infra/migration) | **CONDITIONAL PASS** | Same — builder must receive the B1 test ID list at appointment |
| Zero test debt mandate | **PASS** | `NO-QA-BYPASS-001` prohibition BLOCKING; `Critical Invariant: SCHEMA BUILDER NEVER BYPASSES QA GATES OR CREATES TEST DEBT` |
| NBR-002 checkpoint for B1 (RLS write-block, HTTP 403) | **CONDITIONAL PASS** | Builder must be explicitly informed that NBR-002 applies to B1 (schema-level RLS definition that must surface HTTP 403); flagged in implementation-plan.md §3.1.4 |

#### 4.1d Architecture Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Understands `mmm_` prefix requirement | **CONDITIONAL PASS** | Must be briefed per TR-028 at Stage 11 |
| Understands shared Supabase schema with other modules | **PASS** | Contract class_boundary explicitly limits to "Database schema, RLS, migrations, and seed data only. No application code, no AI services, no cross-module logic." |
| Understands RLS model: every table protected, org isolation | **PASS** | NO-RLS-WEAKEN-001 prohibition confirms constitutional treatment of RLS; escalation rules include "Governance ambiguity → halt_and_escalate" |
| Understands 25 tables from architecture.md §A5.2 | **CONDITIONAL PASS** | Builder must receive architecture.md §A5.2 as a frozen input at Stage 11 appointment |
| Understands immutable audit table pattern (INSERT-only via service role) | **CONDITIONAL PASS** | Specific audit log immutability pattern must be included in Stage 11 briefing |

#### 4.1e Protocol Compliance

| Check | Result | Notes |
|-------|--------|-------|
| STOP-AND-FIX acknowledged | **PASS** | Explicitly stated in contract |
| Wave evidence requirement understood | **PASS** | "Generate implementation evidence (B_H)" in What I Do section |
| Merge gate: wave B1 not releasable until all completion conditions satisfied | **PASS** | Merge gate interface fully declared; `parity_enforcement: BLOCKING` |
| No direct pushes to main | **PASS** | `NO-PUSH-MAIN-001` BLOCKING |
| IAA REJECTION-PACKAGE blocks PR and merge | **PASS** | Explicitly stated in stop_and_fix_mandate |

#### 4.1f Role Fit

| Check | Result | Notes |
|-------|--------|-------|
| schema-builder is designated builder for B1 | **PASS** | Confirmed in implementation-plan.md §6.1 and §6.2 |
| Contract scope covers all B1 scope items | **PASS** | Tables, RLS, indexes, migrations, seed data, storage buckets all within stated class_boundary |
| No scope items in B1 that fall outside schema-builder's class | **PASS** | B1 scope is entirely schema/database infrastructure; no Edge Functions, no frontend, no integration wiring in B1 |

**schema-builder B1 Readiness: READY (with Stage 11 briefing conditions)**

---

### 4.2 api-builder Readiness Check

**Agent**: `api-builder` | **Contract**: `.github/agents/api-builder.md` | **Assigned Waves**: B2 (primary), B3 (supporting), B4 (primary), B5 (primary), B6 (primary)

#### 4.2a Contract Currency

| Check | Result | Evidence |
|-------|--------|---------|
| Contract file exists at `.github/agents/api-builder.md` | **PASS** | File present; YAML front matter + four-phase canonical contract body |
| Agent version current | **PASS** | `agent.version: 6.2.0`; `contract_version: 4.0.0` |
| Four-phase canonical contract pattern | **PASS** | `metadata.contract_pattern: four_phase_canonical` |
| ISMS governance constructs present | **PASS** | `governance.protocol: LIVING_AGENT_SYSTEM`; `governance.version: v6.2.0`; canon inventory, BUILD_PHILOSOPHY, and ROLE_APPOINTMENT_PROTOCOL bindings present |
| IAA invocation mandate | **PASS** | `no_class_exceptions: "IAA invocation is mandatory for all builder agent contracts — no class exemptions."` |
| STOP-AND-FIX mandate | **PASS** | `stop_and_fix_mandate: "STOP-AND-FIX is absolute. IAA REJECTION-PACKAGE blocks PR and merge by design."` |
| Status: recruited | **PASS** | `metadata.status: recruited` |

#### 4.2b Scope Comprehension — MMM

| Check | Result | Notes |
|-------|--------|-------|
| Contract covers API routes and backend business logic | **PASS** | `capabilities.builder_operations: ["api", "backend", "business-logic", "data-processing"]`; responsibilities include "API routes, Business logic, Data validation" |
| MMM backend runtime: Supabase Edge Functions (Deno) | **PASS** | MMM Stage 12 target runtime is **Supabase Edge Functions (Deno)**. This is the confirmed, non-negotiable execution target for all B2–B6 backend deliverables. The contract mission's reference to "Next.js API routes" describes the agent's general capability class; for MMM, all backend/API work is delivered exclusively as Deno-runtime Supabase Edge Functions. There is no ambiguity in the Stage 12 execution target: backend = Supabase Edge Functions (Deno), frontend = React/Vite, schema/RLS = Supabase/Postgres. |
| 26 Edge Functions in scope across B2–B6 | **CONDITIONAL PASS** | Builder must receive the full Edge Function inventory (architecture.md §A4.1) at Stage 11 appointment |
| JWT middleware and audit log write path | **CONDITIONAL PASS** | Within API/business-logic class_boundary; must be explicitly scoped at appointment |
| AIMC stub pattern for B3–B6 | **CONDITIONAL PASS** | Builder must understand stubs are used in B3–B6 for AIMC/KUC/PIT (live wire deferred to B7); this must be confirmed in Stage 11 briefing |
| Forbidden: frontend UI, database schema changes | **PASS** | `forbidden: ["Frontend UI logic", "Cross-module logic", "Database schema changes"]` — explicitly stated |

#### 4.2c RED QA Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Understands RED→GREEN workflow | **PASS** | Sacred workflow stated; "Achieve 100% test pass rate (B_H)" |
| B2 gate: D6 (T-MMM-S6-113–T-MMM-S6-120) | **CONDITIONAL PASS** | Test IDs must be provided at Stage 11 briefing per wave |
| B3 gate: D1 (T-MMM-S6-001–T-MMM-S6-020) | **CONDITIONAL PASS** | Same |
| B4 gate: D2 (T-MMM-S6-021–T-MMM-S6-050) | **CONDITIONAL PASS** | Same |
| B5 gate: D3 (T-MMM-S6-051–T-MMM-S6-080) | **CONDITIONAL PASS** | Same |
| B6 gate: D4 (T-MMM-S6-081–T-MMM-S6-097) | **CONDITIONAL PASS** | Same |
| NBR-001 per wave (TanStack Query cache invalidation) | **CONDITIONAL PASS** | Builder must be briefed on NBR-001 per-wave obligations (implementation-plan.md §8) |
| NBR-002 per wave (HTTP 403 surface) | **CONDITIONAL PASS** | Builder must be briefed on NBR-002 obligation for every permission-gated mutation across B2–B6 |
| Zero test debt mandate | **PASS** | `NO-QA-BYPASS-001` BLOCKING; Critical Invariant stated |

#### 4.2d Architecture Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| 26 Supabase Edge Functions (Deno runtime) | **PASS** | MMM backend execution target confirmed: all 26 Edge Functions are Deno-runtime Supabase Edge Functions. Full function inventory from architecture.md §A4.1 must be provided as frozen input at Stage 11 appointment |
| Supabase service role key pattern for Edge Function writes | **CONDITIONAL PASS** | TR-038 audit log write path pattern must be in Stage 11 briefing |
| AIMC stub pattern in B3–B6 (live AIMC deferred to B7) | **CONDITIONAL PASS** | Must be confirmed at appointment: api-builder uses circuit breaker OPEN state in dev/test; live wiring is B7's responsibility |
| Scoring cascade (FR-040, TR-004, ≤2s) | **CONDITIONAL PASS** | Performance constraint must be in Stage 11 scope brief |
| Queue-and-sync model (TR-039–TR-042) for B5 walkabout mode | **CONDITIONAL PASS** | Must be explicitly briefed at appointment |

#### 4.2e Protocol Compliance

| Check | Result | Notes |
|-------|--------|-------|
| STOP-AND-FIX acknowledged | **PASS** | Explicitly stated |
| Per-wave evidence requirement | **PASS** | "Generate implementation evidence (B_H)" |
| Completion conditions from §3.2.5–§3.6.5 per wave | **CONDITIONAL PASS** | Wave completion conditions must be included in Stage 11 briefing per wave |
| No direct pushes to main | **PASS** | `NO-PUSH-MAIN-001` BLOCKING |

#### 4.2f Role Fit

| Check | Result | Notes |
|-------|--------|-------|
| api-builder leads B2 | **PASS** | Confirmed in implementation-plan.md §6.1 |
| api-builder co-leads B3 (supporting to ui-builder primary) | **PASS** | Confirmed in §6.1 (B3: primary=ui-builder, supporting=api-builder) |
| api-builder co-leads B4, B5, B6 (primary with ui-builder supporting) | **PASS** | Confirmed in §6.1 |
| Contract scope covers all assigned wave deliverables | **PASS** | API/business-logic class covers all Edge Function deliverables; MMM execution target (Deno/Supabase) is confirmed and aligned with contract capability class |

**api-builder B2–B6 Readiness: READY — MMM runtime target confirmed as Supabase Edge Functions (Deno)**

---

### 4.3 ui-builder Readiness Check

**Agent**: `ui-builder` | **Contract**: `.github/agents/ui-builder.md` | **Assigned Waves**: B3 (primary), B4 (supporting), B5 (supporting), B6 (supporting)

#### 4.3a Contract Currency

| Check | Result | Evidence |
|-------|--------|---------|
| Contract file exists at `.github/agents/ui-builder.md` | **PASS** | File present; YAML front matter + four-phase canonical contract body |
| Agent version current | **PASS** | `agent.version: 6.2.0`; `contract_version: 4.0.0` |
| Four-phase canonical contract pattern | **PASS** | `metadata.contract_pattern: four_phase_canonical` |
| ISMS governance constructs present | **PASS** | `governance.protocol: LIVING_AGENT_SYSTEM`; `governance.version: v6.2.0`; all three expected artifacts bound |
| IAA invocation mandate | **PASS** | `no_class_exceptions: "IAA invocation is mandatory for all builder agent contracts — no class exemptions."` |
| STOP-AND-FIX mandate | **PASS** | `stop_and_fix_mandate: "STOP-AND-FIX is absolute. IAA REJECTION-PACKAGE blocks PR and merge by design."` |
| Status: recruited | **PASS** | `metadata.status: recruited` |

#### 4.3b Scope Comprehension — MMM

| Check | Result | Notes |
|-------|--------|-------|
| Contract covers React frontend (TypeScript, functional components only) | **PASS** | `capabilities.builder_operations` includes `["ui", "frontend", "react-components", "responsive-design", "accessibility", "pwa-shell"]`; responsibilities: "React components (functional only)" |
| Contract covers Vite bundler | **CONDITIONAL PASS** | Vite is the MMM architecture's declared bundler (Architecture §A3.2); not explicitly mentioned in contract but falls within frontend/react-components class |
| Contract covers TanStack Query + Zustand state management | **PASS** | Responsibilities explicitly include "Client state (Zustand)" and "Server state integration (TanStack Query)" |
| Contract covers WCAG 2.1 AA accessibility | **PASS** | Responsibilities explicitly include "Accessibility (WCAG 2.1 AA)" |
| Write access covers pages, components, styles, hooks, stores | **PASS** | `write_access` includes `apps/*/components/**`, `apps/*/pages/**`, `apps/*/styles/**`, `apps/*/lib/hooks/**`, `apps/*/lib/stores/**` |
| All 17 UX journeys (J-01–J-17) across B3–B6 | **CONDITIONAL PASS** | Journey scope must be confirmed per wave in Stage 11 briefing; B3 covers J-01–J-05; B4 covers J-06–J-08; B5 covers J-09–J-11; B6 covers J-12–J-15 |
| Forbidden: backend logic, Edge Functions, schema changes, direct API calls bypassing TanStack Query | **PASS** | `forbidden` list explicitly includes all prohibited items; this protects NBR-001 integrity (all server state mutations must go through TanStack Query hooks) |

#### 4.3c RED QA Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Understands RED→GREEN workflow | **PASS** | Sacred workflow stated; 100% test pass rate mandatory |
| B3 gate: D1 (T-MMM-S6-001–T-MMM-S6-020) | **CONDITIONAL PASS** | Test IDs must be confirmed at appointment |
| B4 gate: D2 (T-MMM-S6-021–T-MMM-S6-050) | **CONDITIONAL PASS** | Same |
| B5 gate: D3 (T-MMM-S6-051–T-MMM-S6-080) | **CONDITIONAL PASS** | Same |
| B6 gate: D4 (T-MMM-S6-081–T-MMM-S6-097) | **CONDITIONAL PASS** | Same |
| NBR-001 embedded in GP-004/GP-005 (TanStack Query cache invalidation) | **CONDITIONAL PASS** | Builder must be briefed: NBR-001 is a per-wave mandatory item; `forbidden` item "Direct API calls bypassing TanStack Query" structurally enforces this |
| NBR-002 HTTP 403 surface requirement | **CONDITIONAL PASS** | ui-builder must understand that RLS write-blocks must be surfaced as explicit HTTP 403 error states in the UI (not silent empty responses) |
| Zero test debt mandate | **PASS** | `NO-QA-BYPASS-001` BLOCKING |

#### 4.3d Architecture Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Single-page application (Vite bundler, Vercel deployment) | **CONDITIONAL PASS** | Must be confirmed at Stage 11 briefing with architecture.md §A3 and §A8 as frozen inputs |
| TanStack Query cache invalidation model (NBR-001) | **PASS** | Prohibition of direct API calls bypassing TanStack Query is constitutionally encoded; builder must be briefed on per-wave invalidation obligations |
| Zustand store slices and NBR-003 (org-switch reset) | **CONDITIONAL PASS** | NBR-003 (Zustand store reset on org switch) must be explicitly briefed; it applies to B3 |
| Connectivity status indicator (TR-041) as global component from B3 | **CONDITIONAL PASS** | Must be in Stage 11 briefing for B3 scope |
| Error boundary strategy (Architecture §A3.9) | **CONDITIONAL PASS** | Must be in Stage 11 briefing |

#### 4.3e Protocol Compliance

| Check | Result | Notes |
|-------|--------|-------|
| STOP-AND-FIX acknowledged | **PASS** | Explicitly stated |
| Frontend deployment URL accessible/functional — completion condition | **CONDITIONAL PASS** | Builder must confirm understanding: Vercel staging deployment is a completion condition from B3 onward (implementation-plan.md §3.3.5 item 6) |
| No direct pushes to main | **PASS** | `NO-PUSH-MAIN-001` BLOCKING |

#### 4.3f Role Fit

| Check | Result | Notes |
|-------|--------|-------|
| ui-builder leads B3 (primary builder with api-builder supporting) | **PASS** | Confirmed in implementation-plan.md §6.1 |
| ui-builder is supporting builder on B4, B5, B6 | **PASS** | Confirmed in §6.1 |
| Contract scope covers all UI component work across B3–B6 | **PASS** | React/TypeScript/Vite frontend, state management, routing, accessibility all within class_boundary |
| No architectural misalignment detected | **PASS** | No conflicting scope between ui-builder class_boundary and B3–B6 UI deliverables |

**ui-builder B3–B6 Readiness: READY (with Stage 11 briefing conditions)**

---

### 4.4 integration-builder Readiness Check

**Agent**: `integration-builder` | **Contract**: `.github/agents/integration-builder.md` | **Assigned Wave**: B7

#### 4.4a Contract Currency

| Check | Result | Evidence |
|-------|--------|---------|
| Contract file exists at `.github/agents/integration-builder.md` | **PASS** | File present; YAML front matter + four-phase canonical contract body |
| Agent version current | **PASS** | `agent.version: 6.2.0`; `contract_version: 4.0.0` |
| Four-phase canonical contract pattern | **PASS** | `metadata.contract_pattern: four_phase_canonical` |
| ISMS governance constructs present | **PASS** | `governance.protocol: LIVING_AGENT_SYSTEM`; `governance.version: v6.2.0`; all three expected artifacts bound |
| IAA invocation mandate | **PASS** | `no_class_exceptions: "IAA invocation is mandatory for all builder agent contracts — no class exemptions."` |
| STOP-AND-FIX mandate | **PASS** | `stop_and_fix_mandate: "STOP-AND-FIX is absolute. IAA REJECTION-PACKAGE blocks PR and merge by design."` |
| Recruitment date | **PASS** | `metadata.recruitment_date: 2026-02-14`; `metadata.status: recruited` |

#### 4.4b Scope Comprehension — MMM B7

| Check | Result | Notes |
|-------|--------|-------|
| Contract covers inter-module integration endpoints | **PASS** | `capabilities.builder_operations: ["integration", "api-contract-validation", "inter-module-endpoints", "override-analysis"]`; mission explicitly includes PIT export |
| Contract covers PIT export | **PASS** | Mission statement: "Implement inter-module integration endpoints (PIT export, Maturity Roadmap export)" — PIT export explicitly named |
| Contract covers AIMC boundary wiring | **CONDITIONAL PASS** | AIMC is an inter-module integration boundary; contract class covers "integration endpoints and API contract validation." Must be confirmed at Stage 11 that the builder understands AIMC is a **consumer** boundary (MMM calls AIMC via KUC/AIMC governed path — no direct LLM wiring) |
| Contract covers KUC upload wiring | **CONDITIONAL PASS** | KUC is within integration boundary scope; must be confirmed at Stage 11 |
| Circuit breaker implementation (TR-009, TR-013) | **CONDITIONAL PASS** | Within integration class_boundary; must be explicitly scoped at appointment |
| Forbidden: core MAT business logic, UI, schema changes | **PASS** | `forbidden: ["Core MAT business logic", "Frontend UI logic", "Database schema changes"]` — protects ownership boundaries |

> **CRITICAL ADDENDUM CARRY-FORWARD FOR B7** (imported from convergence-governance-addendum.md §5):
>
> The integration-builder MUST understand and comply with the following when executing B7:
>
> - **B7 proves MMM boundary readiness, NOT broader platform closure.** B7 closes only what
>   is within MMM's own module boundary. AIMC's internal implementation, LKIAC programme, and
>   KUC build lifecycle are NOT closed by B7.
> - **DESTINATION READINESS ≠ SOURCE RETIREMENT AUTHORITY.** B7 GREEN does not authorize any
>   source-state transition for any harvested capability class.
> - **NO PIT-owned planning logic in MMM.** The integration-builder must not introduce task
>   tracking, assignment logic, plan execution, or status tracking into MMM during B7. MMM
>   owns recommendation-to-plan conversion stubs and export payload preparation only.
> - **NO direct provider/LLM wiring from MMM.** All AIMC calls route through the AIMC service
>   boundary. Direct SDK calls to AI providers are prohibited by TR-011 and Architecture §A3.1.
> - **KUC path only.** No parallel ingestion infrastructure may be created. All document uploads
>   route through the single governed KUC path.
> - **Source must remain operational until CS2 explicitly authorizes switchover.** B7 completion
>   does NOT trigger, authorize, or imply any source-state transition.
>
> These obligations are non-negotiable and must be confirmed in the Stage 11 appointment brief.

#### 4.4c RED QA Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Understands RED→GREEN workflow | **PASS** | Sacred workflow stated; 100% test pass rate mandatory |
| B7 gate: D5 (T-MMM-S6-098–T-MMM-S6-112) — Boundary Flows | **CONDITIONAL PASS** | 15 tests; must be provided at Stage 11 briefing |
| B7 gate: D7 (T-MMM-S6-121–T-MMM-S6-128) — AI Interactions | **CONDITIONAL PASS** | 8 tests; must be provided at Stage 11 briefing |
| Total B7 test scope: 23 tests | **CONDITIONAL PASS** | Confirmed from implementation-plan.md §3.7.4 |
| NBR-001 for B7 (AIMC mutation cache invalidations) | **CONDITIONAL PASS** | Must be briefed: all AIMC-calling mutations must invalidate relevant query caches |
| NBR-002 for B7 (HTTP 403 on JWT failure, not pass-through) | **CONDITIONAL PASS** | AIMC proxy Edge Functions must return HTTP 403 on JWT failure (not pass through to AIMC unauthenticated) |
| Zero test debt mandate | **PASS** | `NO-QA-BYPASS-001` BLOCKING |

#### 4.4d Architecture Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| 3 integration boundaries: AIMC (consumer), PIT (producer), KUC (consumer) | **CONDITIONAL PASS** | Must be confirmed at Stage 11 with architecture.md §A6 frozen |
| AIMC: 9 AIMC-calling Edge Functions to be live-wired in B7 | **CONDITIONAL PASS** | Full Edge Function list from architecture.md §A4.1 must be in appointment brief |
| PIT: 7-step handshake (TR-017) with live PIT endpoint | **CONDITIONAL PASS** | PIT export contract explicitly in contract mission; TR-016/TR-017/TR-018 must be confirmed |
| KUC: upload request contract (TR-019) and classification response (TR-020) | **CONDITIONAL PASS** | Must be in Stage 11 briefing |
| Circuit breaker: CLOSED / OPEN / HALF_OPEN states (TR-009) | **CONDITIONAL PASS** | Must be in appointment brief |
| `AIMC_SERVICE_TOKEN` and `PIT_SERVICE_TOKEN` are HARD BLOCKERS for B7 | **FLAG** | CS2 must provision credentials before B7 can execute. If credentials are not provisioned, B7 cannot lawfully start. Integration-builder must halt and escalate if credentials are absent at B7 wave-start. |
| Convergence-governance boundary law (addendum §4 Ownership Boundary Table) | **CONDITIONAL PASS** | Must be confirmed at Stage 11 that integration-builder has read and accepted addendum §3, §4, §5 obligations |

#### 4.4e Protocol Compliance

| Check | Result | Notes |
|-------|--------|-------|
| STOP-AND-FIX acknowledged | **PASS** | Explicitly stated |
| B7 completion conditions all satisfied before wave closure | **CONDITIONAL PASS** | 7 completion conditions from §3.7.5 must be confirmed as checklist items at appointment |
| Live endpoint tests required (not mocked) | **CONDITIONAL PASS** | Must be confirmed at appointment: D5/D7 tests must use live AIMC/PIT/KUC endpoints, not stubs |
| Credential provisioning required before B7 start | **FLAG** | `AIMC_SERVICE_TOKEN`, `PIT_SERVICE_TOKEN` must be provisioned by CS2 and confirmed available before B7 wave-start authorization |
| No direct pushes to main | **PASS** | `NO-PUSH-MAIN-001` BLOCKING |

#### 4.4f Role Fit

| Check | Result | Notes |
|-------|--------|-------|
| integration-builder is sole designated builder for B7 | **PASS** | Confirmed in implementation-plan.md §6.1 (B7: primary=integration-builder, no supporting builder) |
| Contract scope covers all B7 deliverables | **PASS** | Integration endpoints, API contract validation, PIT export, AIMC wiring — all within class_boundary |
| No scope items in B7 that fall outside integration-builder's class | **PASS** | B7 is entirely integration boundary wiring; no new UI, no schema changes, no core business logic |

**integration-builder B7 Readiness: READY (with credential-provisioning hard gate and addendum carry-forward confirmation conditions)**

---

### 4.5 qa-builder Readiness Check

**Agent**: `qa-builder` | **Contract**: `.github/agents/qa-builder.md` | **Assigned Waves**: B8, B9 (primary) + parallel QA gate B1–B9

#### 4.5a Contract Currency

| Check | Result | Evidence |
|-------|--------|---------|
| Contract file exists at `.github/agents/qa-builder.md` | **PASS** | File present; YAML front matter + four-phase canonical contract body |
| Agent version current | **PASS** | `agent.version: 6.2.0`; `contract_version: 4.0.0` |
| Four-phase canonical contract pattern | **PASS** | `metadata.contract_pattern: four_phase_canonical` |
| ISMS governance constructs present | **PASS** | `governance.protocol: LIVING_AGENT_SYSTEM`; `governance.version: v6.2.0`; all three expected artifacts bound |
| IAA invocation mandate | **PASS** | `no_class_exceptions: "IAA invocation is mandatory for all builder agent contracts — no class exemptions."` |
| STOP-AND-FIX mandate | **PASS** | `stop_and_fix_mandate: "STOP-AND-FIX is absolute. IAA REJECTION-PACKAGE blocks PR and merge by design."` |
| Status: recruited | **PASS** | `metadata.status: recruited` |

#### 4.5b Scope Comprehension — MMM B8/B9 and Parallel Gate Role

| Check | Result | Notes |
|-------|--------|-------|
| Contract covers performance testing (k6 load tests) | **PASS** | `capabilities.builder_operations: ["performance-testing", ...]`; responsibilities: "Performance testing (load, stress, spike)" |
| Contract covers security scanning (OWASP, dependency) | **PASS** | Responsibilities: "Security scanning (SAST, dependency, container)" |
| Contract covers accessibility auditing (WCAG 2.1 AA, axe-core) | **PASS** | Responsibilities: "Accessibility auditing (WCAG 2.1 AA)" |
| Contract covers compliance validation | **PASS** | Responsibilities: "Compliance validation (GDPR, POPIA)" |
| Contract covers regression suite management | **PASS** | Responsibilities: "Regression suite management"; `maintain regression suite across all waves (B_H)` |
| Read access covers all relevant directories | **PASS** | `read_access: ["foreman/**", "architecture/**", "governance/**", "apps/**", "packages/**", "modules/**"]` — comprehensive read access |
| B8 scope: 48 cross-cutting tests (T-MMM-S6-129–T-MMM-S6-176) | **CONDITIONAL PASS** | Test IDs must be confirmed at Stage 11 appointment |
| B9 scope: 10 golden paths (GP-001–GP-010) | **CONDITIONAL PASS** | Golden path definitions from pbfag golden-path-verification-pack.md must be confirmed at appointment |
| Forbidden: feature code, architecture modification, weakening test assertions | **PASS** | `forbidden` list and `NO-WEAKEN-ASSERT-001`, `NO-PARTIAL-PASS-001` prohibitions explicitly block all |

#### 4.5c RED QA Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Understands RED→GREEN workflow | **PASS** | Sacred workflow stated; "Maintain regression suite across all waves (B_H)" |
| Understands parallel QA gate role (parallel to every build wave) | **CONDITIONAL PASS** | Must be confirmed at Stage 11: qa-builder gates EVERY wave; a wave cannot close until its designated test domain is GREEN |
| B8 gate: D8 (T-MMM-S6-129–T-MMM-S6-138), D9 (T-MMM-S6-139–T-MMM-S6-152), D10 (T-MMM-S6-153–T-MMM-S6-164), D11 (T-MMM-S6-165–T-MMM-S6-176) | **CONDITIONAL PASS** | All 48 test IDs must be in Stage 11 briefing |
| B9 gate: ALL 176 tests must be GREEN (not just GP tests) | **CONDITIONAL PASS** | Must be explicitly confirmed: B9 completion requires all 176 tests GREEN, not just GP-001–GP-010 evidence |
| NBR-001 final sweep in B8 (TanStack Query invalidation audit) | **CONDITIONAL PASS** | qa-builder must understand the B8 NBR-001 sweep is a comprehensive audit across all waves |
| NBR-002 final sweep in B8 (RLS write-block non-silent confirmation) | **CONDITIONAL PASS** | Same for NBR-002 |
| NBR-001 GP verification: GP-004 (score confirmation → dashboard update) and GP-005 (override → score update) | **CONDITIONAL PASS** | Must be in Stage 11 briefing |
| NBR-002 GP verification: GP-009 (HTTP 403 visible for wrong role), GP-007 (HTTP 403 for PIT export wrong scope) | **CONDITIONAL PASS** | Must be in Stage 11 briefing |
| NO-PARTIAL-PASS-001: 99% = FAILURE | **PASS** | Explicitly stated in prohibitions; `NO-PARTIAL-PASS-001` enforcement BLOCKING |
| Zero test debt mandate | **PASS** | Multiple explicit prohibitions (NO-SKIP-TESTS-001, NO-WEAKEN-ASSERT-001); Critical Invariant stated |

#### 4.5d Architecture Comprehension

| Check | Result | Notes |
|-------|--------|-------|
| Queue-and-sync connectivity pattern (TR-039–TR-042) | **CONDITIONAL PASS** | B8 must validate queue-and-sync (localStorage queue survives reload, replays on reconnect); must be in Stage 11 briefing |
| RLS enforcement model — comprehensive B8 audit | **CONDITIONAL PASS** | B8 requires comprehensive RLS audit per TR-032; must be in Stage 11 briefing |
| Edge Function error surfacing model (HTTP 403 — NBR-002) | **CONDITIONAL PASS** | B8 NBR-002 sweep must confirm at application layer |
| 26 Edge Functions health-checked in B9 | **CONDITIONAL PASS** | All 26 Edge Functions must be deployment-verified in B9; must be in Stage 11 briefing |
| Defect-fix protocol from B8 (defects return to prior-wave owner) | **CONDITIONAL PASS** | Must be confirmed: qa-builder identifies defects in B8; fix commits attributed to relevant earlier-wave builder; qa-builder continues B8 tests in parallel |

#### 4.5e Protocol Compliance

| Check | Result | Notes |
|-------|--------|-------|
| STOP-AND-FIX for any RED test | **PASS** | Constitutionally encoded; STOP-AND-FIX is absolute |
| Parallel QA means qa-builder is a dependency checker for every wave close | **CONDITIONAL PASS** | Must be confirmed at Stage 11: no wave closes without relevant tests GREEN; qa-builder must be available in parallel with every build wave |
| No wave closes without qa-builder confirming the designated test domain GREEN | **CONDITIONAL PASS** | Must be confirmed at Stage 11 as a role obligation |
| No direct pushes to main | **PASS** | `NO-PUSH-MAIN-001` BLOCKING |

> **B9 CLOSURE LAW — CRITICAL** (imported from convergence-governance-addendum.md §6):
>
> The qa-builder MUST understand and carry forward the following B9 closure law into its work:
>
> - **B9 proves destination readiness (all 176 tests GREEN, all golden paths verified), NOT source
>   retirement authorization.** B9 GREEN is SG-1 evidence and partial SG-2 evidence only.
> - **B9 PASS does NOT authorize PIT source retirement or any source-state transition.** Every
>   capability classified in the harvest map (RR-01–RR-08, MT-01–MT-08, LG-01–LG-05) remains at
>   its current source-state until separate switchover gate evidence (SG-1 through SG-5 per
>   capability) is assembled and approved by CS2.
> - **Source retirement decisions remain separate CS2-controlled decisions**, logged in the
>   deprecation register. The qa-builder's handover evidence package must include an explicit
>   statement confirming this separation.
>
> This obligation must be confirmed in the Stage 11 appointment brief.

#### 4.5f Role Fit

| Check | Result | Notes |
|-------|--------|-------|
| qa-builder leads B8 | **PASS** | Confirmed in implementation-plan.md §6.1 |
| qa-builder leads B9 | **PASS** | Confirmed in §6.1 |
| qa-builder operates in parallel QA gate role across B1–B9 | **PASS** | Confirmed in §6.2 and §2 QA Gating Model |
| Contract scope covers all B8 and B9 deliverables | **PASS** | Performance testing, security scanning, accessibility auditing, compliance validation, regression management — all within class_boundary |
| No scope items in B8/B9 that fall outside qa-builder's class | **PASS** | B8 and B9 are dedicated QA waves; no new feature code; all verification activities |

**qa-builder B8/B9 Readiness: READY (with B9 closure-law confirmation condition)**

---

## Section 5: Stage 8 Addendum Carry-Forward (D3)

> **MANDATORY SECTION** — This section imports the convergence-governance controls from
> `modules/MMM/07-implementation-plan/convergence-governance-addendum.md` v1.0.0 into Stage 9.
> All builders must acknowledge these controls. Their presence in this Builder Checklist is
> required by addendum §7 (Stage 9 Carry-Forward Requirements) and by the addendum §9.3
> gate condition.

---

### 5.1 Source-State / Switchover Law

The following rules are imported from `convergence-governance-addendum.md` §2 and §3
and are in force for all builders throughout Stage 12.

**Rule SS-1** (from addendum §2.2 constraint 1): Completion of B3–B9 does NOT
automatically authorize source retirement or source-state transition. Build wave
completion (QA-to-Green) is evidence of destination readiness — it is not a switchover-gate pass.

**Rule SS-2** (from addendum §2.2 constraint 2): Any source-state transition still requires
the defined switchover conditions (SG-1 through SG-5) AND CS2 approval. The Foreman may propose
a gate pass; CS2 must approve. No source-state transition is self-executing.

**Rule SS-3** (from addendum §2.2 constraint 3): Source-state changes must be explicitly recorded
in the harvest map. They are NOT implied by build completion. An unrecorded source-state change is
a governance defect.

**Rule SS-4** (from addendum §2.2 constraint 4): Backward transitions require explicit CS2
authorization and must be recorded in the deprecation register with rationale.

**Rule SS-5**: The source must remain operational until CS2 explicitly authorizes the switchover.
No builder wave completion constitutes switchover authorization.

**Switchover gate conditions (SG-1 through SG-5)** — ALL five must be satisfied before any
source capability moves past `PARALLEL_RUN`:

| Gate | Condition | Responsible Party |
|------|-----------|------------------|
| SG-1 | Destination capability implemented | Builder agent + qa-builder |
| SG-2 | Destination capability verified | IAA + Foreman (QP mode) |
| SG-3 | Data/state migration completed where applicable | schema-builder |
| SG-4 | Deprecation register updated | Foreman |
| SG-5 | Source-state transition explicitly recorded | Foreman |

**Source-state declarations at Stage 9 entry** (per addendum §7.1 template):

| Capability Class | Current Source-State at Stage 9 Entry | SG-3 | Source Retirement Authorized by Build Wave Completion? | Separate CS2 Approval Required? |
|----------------|--------------------------------------|------|------------------------------------------------------|--------------------------------|
| RR-xx (Roadmap capabilities, RR-01–RR-08) | ACTIVE_SOURCE | Applicable (migration required) | **NO** | **YES** |
| MT-xx (MAT capabilities, MT-01–MT-08) | ACTIVE_SOURCE | Applicable (migration required) | **NO** | **YES** |
| LG-xx (Legacy capabilities, LG-01–LG-05) | ACTIVE_SOURCE | SG-3 may be N/A where no persistent data (state rationale required per capability) | **NO** | **YES** |

---

### 5.2 Ownership-Boundary Law

The following hard prohibitions are imported from `convergence-governance-addendum.md` §4
and are in force for **all builders** — especially api-builder (B2–B6) and integration-builder
(B7) — throughout Stage 12.

**Prohibition OB-1** (from addendum §4.2, anti-pattern 1): Hidden PIT-owned planning logic
MUST NOT remain inside MMM in any wave from B1–B9. MMM may contain recommendation-to-plan
conversion stubs and the export payload preparation step; it MUST NOT contain plan execution,
task tracking, assignment logic, or status tracking. Any such logic introduced by a builder
is an ownership boundary violation and a blocking defect.

**Prohibition OB-2** (from addendum §4.2, anti-pattern 2): Direct provider/LLM wiring from MMM
bypassing AIMC is PROHIBITED by TR-011 and Architecture §A3.1. All AI calls from MMM must route
through the AIMC service boundary. No direct SDK calls to AI providers are permitted within MMM
code. Any such wiring constitutes a governance defect and must be removed before wave closure.

**Prohibition OB-3** (from addendum §4.2, anti-pattern 3): MMM MUST NOT invent parallel
ingestion infrastructure outside the governed KUC path. All document uploads must go through the
single common ingestion path (Knowledge Upload Centre within AIMC scope). MMM must not create a
separate document parsing or upload endpoint.

**Canonical boundary assignments** (from addendum §4.1):

| Boundary | Owned By | Anti-Pattern Warning |
|----------|---------|---------------------|
| Findings / recommendations | MMM | Must not bleed into PIT-owned planning logic |
| Maturity model UX (J-01–J-17) | MMM | — |
| Scoring / evidence business flows | MMM | — |
| PIT export payload preparation | MMM | Must not execute PIT planning logic |
| Executable implementation plans | PIT | PIT owns downstream; MMM must not replicate |
| AI routing / governance / provider abstraction | AIMC | MMM must not wire directly to AI providers |
| Knowledge ingestion path | KUC (within AIMC) | MMM must not create parallel ingestion infrastructure |

---

### 5.3 B7 / B9 Closure-Law Distinctions

These closure laws are imported verbatim from `convergence-governance-addendum.md` §5 and §6
and must be carried into the execution of each respective wave.

#### B7 Closure Law

**B7 PROVES** (addendum §5.1):
- MMM-side live boundary wiring readiness: AIMC, PIT, and KUC integration contracts are implemented on the MMM side and ready for live integration
- Contract conformance at the MMM boundary: request/response shapes conform to TR-011 (AIMC), TR-017 (PIT), and KUC upload contract
- Proper AI/HITL/gateway behaviour on the MMM side: HITL confirmation gate implemented; AI proposals not auto-accepted
- All 176 S6 tests in the boundary integration domain passing GREEN

**B7 DOES NOT PROVE** (addendum §5.2):
- Broader platform-level retirement or completion of AIMC/LKIAC programme work
- Source retirement or deprecation completion elsewhere in the platform
- That AIMC's internal implementation is complete
- That PIT's downstream implementation planning capability is ready

**Explicit B7 closure statement**: Completion of wave B7 to QA-Green does NOT trigger, authorize,
or imply any source-state transition for any harvested capability. B7 is MMM boundary readiness
only. Any claim to the contrary is a governance defect.

#### B9 Closure Law

**B9 PROVES** (addendum §6.1):
- Destination readiness for MMM build execution: all 10 golden paths verified GREEN
- Golden-path and anti-regression conformance: NBR-001 and NBR-002 both verified on destination
- Stage 12 build execution is complete for MMM's own module scope: all 9 waves (B1–B9) to QA-Green

**B9 DOES NOT AUTOMATICALLY AUTHORIZE** (addendum §6.2):
- Source-state transition for ANY harvested capability (RR-01–RR-08, MT-01–MT-08, LG-01–LG-05)
- Retirement of harvested source capabilities
- Deprecation closure without separate switchover evidence and CS2 approval
- Closure of platform-level AIMC/LKIAC/KUC programme work

**Explicit B9 closure statement**: B9 PASS is SG-1 evidence and partial SG-2 evidence only.
Completion of B9 does NOT trigger, authorize, or imply any source-state transition. B9 PASS
does NOT authorize PIT source retirement. Source retirement decisions are separate CS2-controlled
decisions and must be logged in the deprecation register with explicit entries per capability class.

---

### 5.4 Checklist Imports — Mandatory Items for All Builders

The following items, imported from addendum §7 (Stage 9 Carry-Forward Requirements), are
mandatory confirmation items for all builders at Stage 11 appointment and throughout Stage 12
wave execution.

| # | Mandatory Item | Applicable Waves | Must Be Confirmed |
|---|---------------|-----------------|-------------------|
| CI-1 | Source-state and switchover conditions are understood for the harvested capability class covered by this wave | B3–B9 (any wave implementing a harvested capability) | Builder must declare: "I understand that wave completion does not authorize source-state transition for any harvested capability. Switchover gate (SG-1 through SG-5) is NOT implicitly satisfied by wave completion." |
| CI-2 | Deprecation-register update expectations are understood | Every wave that implements a harvested capability | Builder must confirm: "I will note a deprecation-register update requirement at wave close for each harvested capability implemented in this wave." No builder may remove PIT source without a deprecation-register entry authorized by CS2. |
| CI-3 | PIT boundary checks are in scope | B7 (integration-builder); awareness for all builders | integration-builder must confirm at wave close: "No PIT-owned planning logic was introduced in this wave." |
| CI-4 | AIMC/KUC ownership-conformance checks are in scope | B7 (integration-builder); B4–B6 (api-builder — stub pattern compliance) | Applicable builder must confirm at wave close: "No direct provider/LLM wiring was introduced. No parallel ingestion infrastructure was introduced." |
| CI-5 | Explicit confirmation that destination readiness (B9 PASS) and source retirement are separate decisions | B9 (qa-builder) | qa-builder's handover evidence package must include: "B9 PASS does NOT authorize source retirement. This is destination readiness only. Separate CS2 decision required for any source-state transition." |

**Per-wave PIT / AIMC / KUC conformance items** (from addendum §7.2):

At the close of every build wave in Stage 12, the responsible builder must confirm:
1. No PIT-owned planning logic was introduced in this wave.
2. No direct provider/LLM wiring was introduced in this wave.
3. No parallel document-ingestion infrastructure was introduced in this wave.
4. Deprecation register note filed (if this wave implements a harvested capability).

---

## Section 6: Foreman Verdict (D4)

The following verdicts are based on direct inspection of each builder agent contract file at
`.github/agents/[builder-id].md`. No verdict has been fabricated or inferred without contract
evidence.

---

```
Builder:       schema-builder
Verdict:       PASS
Justification: Contract exists at correct path, version 6.2.0, contract_version 4.0.0,
               four-phase canonical pattern, fully populated with ISMS governance constructs,
               IAA invocation mandate, STOP-AND-FIX mandate, and merge gate interface.
               Class boundary is correct and exclusive for B1 (schema, RLS, migrations, seed
               data, storage buckets). No architectural misalignment. No governance red flags.
Conditions:    At Stage 11 builder appointment, the following must be explicitly briefed:
               (a) TR-028 `mmm_` table prefix requirement; (b) all 25 table names from
               architecture.md §A5.2 as frozen inputs; (c) B1 test IDs (D9/D10 subsets);
               (d) NBR-002 checkpoint for B1 (RLS policy must surface HTTP 403 on cross-org
               write attempt); (e) immutable audit table pattern (INSERT-only via service role).
```

---

```
Builder:       api-builder
Verdict:       PASS
Justification: Contract exists at correct path, version 6.2.0, contract_version 4.0.0,
               four-phase canonical pattern, fully populated with ISMS governance constructs,
               IAA invocation mandate, STOP-AND-FIX mandate, and merge gate interface.
               API/business-logic class_boundary is correct for B2–B6 Edge Function scope.
               MMM execution target is confirmed: backend = Supabase Edge Functions (Deno
               runtime), frontend = React/Vite, schema/RLS = Supabase/Postgres. The contract
               mission's general reference to API capabilities covers the Deno/Supabase
               execution target within MMM scope. No governance red flags in contract structure.
Conditions:    At Stage 11 builder appointment, the following MUST be confirmed: (a) full
               Edge Function inventory (26 named functions, architecture.md §A4.1) as frozen
               inputs — all functions are Deno-runtime Supabase Edge Functions; (b) AIMC stub
               pattern for B3–B6 (live wire is B7's responsibility); (c) per-wave test IDs
               (D6, D1, D2, D3, D4) and NBR-001/NBR-002 per-wave obligations; (d) wave
               completion conditions from §3.2.5–§3.6.5.
```

---

```
Builder:       ui-builder
Verdict:       PASS
Justification: Contract exists at correct path, version 6.2.0, contract_version 4.0.0,
               four-phase canonical pattern, fully populated with ISMS governance constructs,
               IAA invocation mandate, STOP-AND-FIX mandate, and merge gate interface.
               React/TypeScript/Vite frontend class_boundary is correct for B3–B6 UI scope.
               Explicit capabilities for TanStack Query and Zustand. Structural prohibition of
               direct API calls bypassing TanStack Query (protecting NBR-001 compliance).
               No architectural misalignment. No governance red flags.
Conditions:    At Stage 11 builder appointment, the following must be briefed: (a) Vite
               bundler confirmation (not explicitly named in contract but within class boundary);
               (b) per-wave UX journey assignments (B3: J-01–J-05; B4: J-06–J-08; B5: J-09–J-11;
               B6: J-12–J-15) with architecture.md §A3 as frozen input; (c) NBR-001 per-wave
               invalidation obligations; (d) NBR-002 UI error surfacing (HTTP 403 must be shown
               as explicit error in UI, not silent); (e) NBR-003 Zustand store reset on org switch
               (B3 specific); (f) Vercel staging deployment as completion condition from B3.
```

---

```
Builder:       integration-builder
Verdict:       PASS
Justification: Contract exists at correct path, version 6.2.0, contract_version 4.0.0,
               four-phase canonical pattern, fully populated with ISMS governance constructs,
               IAA invocation mandate, STOP-AND-FIX mandate, and merge gate interface.
               Integration/API-contract-validation class_boundary is correct for B7 boundary
               wiring scope. PIT export is explicitly named in the contract mission. Class
               boundary prohibitions (no core MAT business logic, no UI, no schema changes)
               are structurally aligned with the addendum ownership-boundary law.
Conditions:    At Stage 11 builder appointment, the following MUST be confirmed: (a) Addendum
               §4, §5, §6 carry-forward obligations acknowledged (source-state law, B7 closure
               law, ownership-boundary prohibitions OB-1/OB-2/OB-3); (b) AIMC wiring as
               consumer boundary only — no direct LLM wiring permitted; (c) full 9-function
               AIMC Edge Function inventory and live wiring scope; (d) PIT 7-step handshake
               (TR-017) with live endpoint; (e) KUC upload contract (TR-019/TR-020);
               (f) circuit breaker (TR-009) full CLOSED/OPEN/HALF_OPEN implementation;
               (g) B7 test IDs (D5: T-MMM-S6-098–T-MMM-S6-112; D7: T-MMM-S6-121–T-MMM-S6-128);
               (h) HARD GATE: CS2 must provision AIMC_SERVICE_TOKEN and PIT_SERVICE_TOKEN
               before B7 wave-start — builder must halt and escalate if credentials absent.
```

---

```
Builder:       qa-builder
Verdict:       PASS
Justification: Contract exists at correct path, version 6.2.0, contract_version 4.0.0,
               four-phase canonical pattern, fully populated with ISMS governance constructs,
               IAA invocation mandate, STOP-AND-FIX mandate, and merge gate interface.
               QA class_boundary is correct for B8/B9 and parallel gate role. Explicit
               capabilities for k6 performance testing, OWASP security scanning, axe-core
               accessibility auditing, and regression management. Constitutional prohibition
               on weakening test assertions (NO-WEAKEN-ASSERT-001) and partial passes
               (NO-PARTIAL-PASS-001). Read access covers all required directories.
               No architectural misalignment. No governance red flags.
Conditions:    At Stage 11 builder appointment, the following must be confirmed: (a) Parallel
               QA gate role confirmed: qa-builder is available in parallel with every build wave
               and no wave closes without its designated test domain GREEN; (b) B8 test IDs
               (D8–D11: T-MMM-S6-129–T-MMM-S6-176, 48 tests) and completion conditions;
               (c) B9 ALL-176-tests-GREEN requirement confirmed (not just GP evidence);
               (d) NBR-001 GP-004/GP-005 verification and NBR-002 GP-009/GP-007 verification
               confirmed; (e) B9 closure-law statement: "B9 PASS does NOT authorize source
               retirement. Source retirement is a separate CS2 decision. This must be explicitly
               stated in the B9 handover evidence package."; (f) Defect-fix protocol: defects
               found in B8 return to the prior-wave builder for fix; qa-builder continues B8
               tests in parallel.
```

---

## Section 7: Summary and Stage 9 Gate

### 7.1 Builder Verdict Summary Table

| Builder | Assigned Waves | Verdict | Conditions |
|---------|---------------|---------|-----------|
| `schema-builder` | B1 | ✅ PASS | Stage 11 briefing: TR-028, 25 table names, B1 test IDs, NBR-002 B1 checkpoint, audit table immutability pattern |
| `api-builder` | B2, B3 (supporting), B4, B5, B6 | ✅ PASS | Stage 11 briefing: **Deno/Supabase Edge Function runtime clarification (critical)**, 26 function inventory, AIMC stub pattern, per-wave test IDs, NBR-001/NBR-002, completion conditions |
| `ui-builder` | B3 (primary), B4, B5, B6 (supporting) | ✅ PASS | Stage 11 briefing: Vite confirmation, per-wave journey assignments, NBR-001/NBR-002/NBR-003, Vercel deployment as completion condition |
| `integration-builder` | B7 | ✅ PASS | Stage 11 briefing: addendum §4/§5/§6 carry-forward confirmed, AIMC consumer boundary only, 9-function AIMC inventory, full B7 test IDs (D5+D7), **credential hard gate (AIMC_SERVICE_TOKEN + PIT_SERVICE_TOKEN)** |
| `qa-builder` | B8, B9 (+ parallel B1–B9) | ✅ PASS | Stage 11 briefing: parallel gate role confirmed, B8 test IDs (48 tests), B9 all-176-GREEN requirement, NBR-001/NBR-002 GP confirmations, **B9 closure-law statement in handover package** |

### 7.2 Overall Stage 9 Verdict

```
Stage 9 Overall Verdict: PASS ✅
```

All five builder candidates have received PASS verdicts. No builder has been found to have
a governance red flag, architectural misalignment, or missing ISMS governance construct that
would constitute a Stage 9 FAIL. All conditions are Stage 11 briefing requirements (not
pre-conditions for Stage 9 PASS).

### 7.3 Stage 9 Gate Statement

**Stage 9 PASS unblocks Stage 10 (IAA Pre-Brief)**. The Foreman may now authorize the Stage 10
wave-start. The IAA Pre-Brief must carry forward:
- This builder checklist document as Stage 9 evidence
- The implementation plan (§3 wave scopes) as IAA overlay context
- The credential gap status (AIMC_SERVICE_TOKEN, PIT_SERVICE_TOKEN — blocking for B7)
- NBR-001 and NBR-002 as mandatory IAA overlay items
- All convergence-governance addendum carry-forward obligations from Section 5

### 7.4 Addendum Carry-Forward Confirmation

The following addendum carry-forward obligations from `convergence-governance-addendum.md`
v1.0.0 §7 are confirmed as present in this Builder Checklist:

| Addendum §7 Requirement | Present in This Checklist | Location |
|------------------------|--------------------------|----------|
| Source-state conditions declared per capability class | ✅ | Section 5.1, source-state declaration table |
| Switchover preconditions confirmed (SG-1–SG-5 not implicitly satisfied by build wave) | ✅ | Section 5.1, Rule SS-1; SG-1–SG-5 table |
| Deprecation-register update expectations per wave | ✅ | Section 5.4, CI-2; per-wave conformance items |
| PIT boundary checks in scope | ✅ | Section 5.4, CI-3; 4.4b addendum block |
| AIMC/KUC ownership-conformance checks in scope | ✅ | Section 5.4, CI-4; Section 5.2, Prohibition OB-2/OB-3 |
| B9 PASS ≠ source retirement — explicit separation | ✅ | Section 5.3, B9 Closure Law; Section 5.4, CI-5; 4.5c B9 closure law block |

---

*End of MMM Stage 9 Builder Checklist — v1.0.0 — 2026-04-19*
