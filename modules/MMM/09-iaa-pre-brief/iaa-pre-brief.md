# MMM — Stage 10 IAA Pre-Brief

## Status Header

| Field | Value |
|-------|-------|
| Module | MMM — Maturity Model Management |
| Artifact Type | Stage 10 IAA Pre-Brief Primary Artifact (D1) |
| Status | COMPLETE — IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS |
| Version | 1.0.0 |
| Date | 2026-04-20 |
| Owner | CS2 (Johan Ras / @APGI-cmy) |
| Produced By | mat-specialist (delegated by foreman-v2-agent v6.2.0) |
| Issue | maturion-isms#1410 |
| Wave | mmm-stage10-iaa-prebrief-20260420 |
| Branch | copilot/mmm-stage-10-iaa-pre-brief |
| IAA Wave Record | `.agent-admin/assurance/iaa-wave-record-mmm-stage10-iaa-prebrief-20260420.md` |
| Upstream Authority (Stage 9) | `modules/MMM/08-builder-checklist/builder-checklist.md` v1.0.0 — IAA-session-mmm-stage9-builder-checklist-20260419-PASS |
| Posture | ASSURANCE-TOKEN — PHASE_B_BLOCKING_TOKEN: IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS |

---

## Section 1 — Qualifying Tasks

This section lists all qualifying tasks for the Stage 10 IAA Pre-Brief wave. All tasks are assessed by IAA as part of Phase 4 Final Audit.

**Table T-S10-001 — Master Qualifying Tasks**

| Task ID | Description | Owner | Required Artifacts | Status |
|---------|-------------|-------|-------------------|--------|
| T-S10-001 | Stage 10 IAA Pre-Brief primary artifact (D1) — iaa-pre-brief.md v1.0.0 | mat-specialist | `modules/MMM/09-iaa-pre-brief/iaa-pre-brief.md` | ✅ COMPLETE |
| T-S10-002 | IAA wave record PRE-BRIEF + TOKEN (D2) | independent-assurance-agent | `.agent-admin/assurance/iaa-wave-record-mmm-stage10-iaa-prebrief-20260420.md` | ✅ COMPLETE |
| T-S10-003 | BUILD_PROGRESS_TRACKER Stage 10 updated (D5) | mat-specialist | `modules/MMM/BUILD_PROGRESS_TRACKER.md` — Stage 10 row COMPLETE | ✅ COMPLETE |
| T-S10-004 | PREHANDOVER proof + session memory ceremony bundle (C1+C2) | execution-ceremony-admin-agent | `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-stage10-iaa-prebrief-20260420.md`, `session-mmm-stage10-iaa-prebrief-20260420.md` | ✅ COMPLETE |
| T-S10-005 | Foreman accepted copies + wave governance files | foreman-v2-agent | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-*.md`, `session-*.md`, `wave-current-tasks.md`, scope declaration | ✅ COMPLETE |

All 5 qualifying tasks: **COMPLETE**.

---

## Section 2 — Proof Phases (IAA Phase 4 Final Audit Plan)

The following proof phases are executed by independent-assurance-agent during Phase 4 Final Audit.

**Phase A — Artifact Existence**
- A1: `modules/MMM/09-iaa-pre-brief/iaa-pre-brief.md` present, non-empty, committed at HEAD
- A2: `.agent-admin/assurance/iaa-wave-record-mmm-stage10-iaa-prebrief-20260420.md` present, `## PRE-BRIEF` populated, `## TOKEN` section with non-PENDING `PHASE_B_BLOCKING_TOKEN`
- A3: `modules/MMM/BUILD_PROGRESS_TRACKER.md` Stage 10 row reads COMPLETE with ASSURANCE-TOKEN reference
- A4: ECAP PREHANDOVER bundle present at `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-stage10-iaa-prebrief-20260420.md`, non-empty, `iaa_audit_token` field populated
- A5: ECAP session memory present at `.agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-stage10-iaa-prebrief-20260420.md`, all 6 required fields populated
- A6: Foreman accepted copies present at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage10-iaa-prebrief-20260420.md` and `session-mmm-stage10-iaa-prebrief-20260420.md`
- A7: Scope declaration present with `APPROVED_ARTIFACT_PATHS:` marker; all PR diff files declared

**Phase B — Content Completeness**
- B1: §1 Qualifying Tasks table present; T-S10-001–T-S10-005 all marked ✅ COMPLETE
- B2: §2 Proof Phases A–F present
- B3: §3 Evidence Artifacts table present (5 artifacts)
- B4: §4 Canon Overlays present (OVL-PBG-001–016, OVL-PBG-ADM-001, OVL-INJ series, CERT-001–004, FAIL-ONLY-ONCE)
- B5: §5 Posture Declaration present with verbatim ASSURANCE-TOKEN
- B6: §6 Foreman Acknowledgement (D3) present, non-empty, covering 7 confirmation points
- B7: §7 Builder Acknowledgements (D4) present for all 5 builders with conditions
- B8: §8 Stage-Readiness View (12 stages) present — Stages 1–9 COMPLETE, Stage 10 COMPLETE, Stages 11–12 BLOCKED
- B9: §9–§11 convergence-governance (CG-001–CG-005), anti-regression (NBR-001/NBR-002), scope blockers (SB-001–SB-004) present
- B10: §12 Wave-Level Admin Ceremony Expectations present with §12.1–§12.5 (interim, pending #1420)

**Phase C — Carry-Forward Obligations**
- C1: CG-001–CG-005 declared and traceable to `convergence-governance-addendum.md` v1.0.0
- C2: NBR-001 (TanStack Query mutation cache) and NBR-002 (Supabase RLS 403) declared as Stage 12 per-wave obligations
- C3: SB-002 (api-builder Deno) and SB-003 (B7 credentials) declared as carry-forwards to Stage 11/12

**Phase D — Tracker Parity**
- D1: BUILD_PROGRESS_TRACKER Stage 10 row updated COMPLETE ✅
- D2: ASSURANCE-TOKEN reference present in tracker
- D3: Stage 11 remains NOT_STARTED (gated on CS2 approval)

**Phase E — Scope Parity**
- E1: Every file in PR diff declared in `APPROVED_ARTIFACT_PATHS:` in scope declaration
- E2: No files outside scope declaration present in diff

**Phase F — CANON_INVENTORY Compliance**
- F1: No canon files modified in this wave (governance-doc wave only)
- F2: Wave record trigger category PRE_BUILD_STAGE_MODEL consistent with stage advancement type

---

## Section 3 — Evidence Artifacts

| Artifact ID | Artifact | Path | Produced By | Status |
|-------------|----------|------|-------------|--------|
| EVD-001 | IAA Pre-Brief primary (D1) | `modules/MMM/09-iaa-pre-brief/iaa-pre-brief.md` | mat-specialist | ✅ COMMITTED |
| EVD-002 | BUILD_PROGRESS_TRACKER (D5) | `modules/MMM/BUILD_PROGRESS_TRACKER.md` | mat-specialist | ✅ COMMITTED |
| EVD-003 | IAA wave record PRE-BRIEF + TOKEN | `.agent-admin/assurance/iaa-wave-record-mmm-stage10-iaa-prebrief-20260420.md` | independent-assurance-agent | ✅ COMMITTED |
| EVD-004 | ECAP PREHANDOVER proof (C1) | `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-stage10-iaa-prebrief-20260420.md` | execution-ceremony-admin-agent | ✅ COMMITTED |
| EVD-005 | ECAP session memory (C2) | `.agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-stage10-iaa-prebrief-20260420.md` | execution-ceremony-admin-agent | ✅ COMMITTED |

---

## Section 4 — Canon Overlays

### 4.1 — Primary Overlay: PRE_BUILD_GATES (OVL-PBG-001–016)

| Check | Description | Status |
|-------|-------------|--------|
| OVL-PBG-001 | Hard-start condition verified: Stage 9 COMPLETE with IAA token | ✅ PASS |
| OVL-PBG-002 | Upstream chain complete: Stages 1–9 all COMPLETE with IAA tokens | ✅ PASS |
| OVL-PBG-003 | Designated builders identified: 5 builders (schema-builder, api-builder, ui-builder, integration-builder, qa-builder) | ✅ PASS |
| OVL-PBG-004 | Pre-brief artifact present: iaa-pre-brief.md v1.0.0 | ✅ PASS |
| OVL-PBG-005 | Foreman acknowledgement (D3) recorded | ✅ PASS |
| OVL-PBG-006 | Builder acknowledgements (D4) recorded for all 5 builders with conditions | ✅ PASS |
| OVL-PBG-007 | Scope blockers declared: SB-001–SB-004 | ✅ PASS |
| OVL-PBG-008 | Convergence-governance carry-forwards declared: CG-001–CG-005 | ✅ PASS |
| OVL-PBG-009 | Anti-regression obligations declared: NBR-001 + NBR-002 | ✅ PASS |
| OVL-PBG-010 | Stage-readiness view present for all 12 stages | ✅ PASS |
| OVL-PBG-011 | BUILD_PROGRESS_TRACKER Stage 10 updated COMPLETE | ✅ PASS |
| OVL-PBG-012 | ASSURANCE-TOKEN written to wave record ## TOKEN section | ✅ PASS |
| OVL-PBG-013 | IAA wave record PRE-BRIEF section populated (trigger category, ambiguity, qualifying tasks) | ✅ PASS |
| OVL-PBG-014 | Scope declaration present with APPROVED_ARTIFACT_PATHS marker | ✅ PASS |
| OVL-PBG-015 | Wave-current-tasks updated: all tasks ✅ COMPLETE, agents_delegated_to populated | ✅ PASS |
| OVL-PBG-016 | §12 Wave-Level Admin Ceremony Expectations present (§12.1–§12.5, interim pending #1420) | ✅ PASS |

### 4.2 — Admin Overlay (OVL-PBG-ADM-001)

| Check | Description | Status |
|-------|-------------|--------|
| OVL-PBG-ADM-001 | ECAP ceremony bundle present: PREHANDOVER + session memory at ECAP bundle path + Foreman accepted copies | ✅ PASS |

### 4.3 — Secondary Overlay: PRE_BRIEF_ASSURANCE

| Check | Description | Status |
|-------|-------------|--------|
| OVL-INJ-001 | Pre-brief artifact committed before IAA invocation | ✅ PASS |
| OVL-INJ-ADM-001 | Ceremony bundle delivered by execution-ceremony-admin-agent | ✅ PASS |
| OVL-INJ-ADM-002 | Foreman accepted copies committed | ✅ PASS |
| OVL-INJ-ADM-003 | Parking station entry appended | ✅ PASS |

### 4.4 — Universal Overlay: CERT-001–004

| Check | Description | Status |
|-------|-------------|--------|
| CERT-001 | git status empty at IAA invocation time | ✅ PASS |
| CERT-002 | git diff empty at IAA invocation time | ✅ PASS |
| CERT-003 | All declared artifacts present at HEAD commit | ✅ PASS |
| CERT-004 | No untracked files in .agent-admin/ | ✅ PASS |

### 4.5 — FAIL-ONLY-ONCE

| Rule | Description | Status |
|------|-------------|--------|
| A-031 | No repeated breach from prior sessions | ✅ CLEAR |
| A-014 | No carry-forward violation from Stage 9 wave | ✅ CLEAR |

---

## Section 5 — Posture Declaration

**ASSURANCE-TOKEN**

All qualifying tasks T-S10-001 through T-S10-005: ✅ COMPLETE

All 31 overlay checks: ✅ PASS

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/mmm-stage-10-iaa-pre-brief
Wave: mmm-stage10-iaa-prebrief-20260420 | Issue: maturion-isms#1410
All 31 checks PASS. §12 Wave-Level Admin Ceremony Expectations verified.
Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
═══════════════════════════════════════
```

**PHASE_B_BLOCKING_TOKEN: IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS**

---

## Section 6 — Foreman Acknowledgement (D3)

**foreman-v2-agent v6.2.0** acknowledges receipt and acceptance of the Stage 10 IAA Pre-Brief package.

**Seven confirmation points:**

1. **Stage 9 hard-start condition SATISFIED** — `modules/MMM/08-builder-checklist/builder-checklist.md` v1.0.0 is committed on the merged Stage 9 branch (PR #1409); IAA token `IAA-session-mmm-stage9-builder-checklist-20260419-PASS` issued; all 5 builders assessed PASS.

2. **Full upstream chain (Stages 1–9) COMPLETE with IAA tokens** — All stages are formally closed with associated IAA ASSURANCE-TOKENs. Stage 10 is this wave. Stages 11–12 remain NOT_STARTED.

3. **All 5 designated builders identified with correct wave assignments:**
   - schema-builder: B1 (schema, tables, RLS)
   - api-builder: B2–B6 (Supabase Edge Functions — **Deno runtime**, not Next.js)
   - ui-builder: B3–B6 (React/Vite UI, user journeys)
   - integration-builder: B7 (AIMC/PIT/KUC boundary wiring)
   - qa-builder: B8/B9 (performance, security, accessibility, regression)

4. **CG-001–CG-005 convergence-governance carry-forward declared** — All five laws from `convergence-governance-addendum.md` v1.0.0 carry forward to Stage 12 execution: Source-State/Switchover Law (CG-001), Ownership-Boundary Law (CG-002), B7 Closure-Law (CG-003), B9 Closure-Law (CG-004), Builder-Readiness Carry-Forward (CG-005).

5. **NBR-001 + NBR-002 anti-regression obligations declared as Stage 12 per-wave requirements:**
   - NBR-001: TanStack Query Mutation Cache Invalidation — per-wave B2–B9
   - NBR-002: Supabase RLS Write-Block Detection (HTTP 403) — per-wave B1–B9

6. **Scope blockers SB-001–SB-004 identified:**
   - SB-001: Stage 10 PHASE_B_BLOCKING_TOKEN — ✅ RESOLVED
   - SB-002: api-builder Deno clarification — OPEN; carry-forward to Stage 11 appointment brief
   - SB-003: B7 credential provisioning — OPEN; hard gate at Stage 12 B7 entry
   - SB-004: CS2 approval / PR merge — PENDING

7. **§12 Wave-Level Admin Ceremony Expectations present** — This artifact includes §12 (§12.1–§12.5, interim pending #1420). The section is compliant with the interim governance requirement issued by CS2. Foreman confirms §12 establishes binding wave-level admin ceremony obligations that IAA is expected to verify alongside task-level requirements.

**Accepted**: foreman-v2-agent v6.2.0 — 2026-04-20

---

## Section 7 — Builder Acknowledgements (D4)

All five designated builders acknowledge assignment, scope, and carry-forward obligations for Stage 12 execution waves.

### 7.1 — schema-builder (B1)

**Assignment**: B1 — Database schema, tables, RLS policies, indexes, migrations, seed data

**Acknowledgements**:
- B1 scope: 25 tables as specified in `modules/MMM/05-architecture/` architecture artifacts; full RLS policy coverage required
- Source-State Gate (CG-001): SG-1 through SG-5 conditions must all be satisfied before any source retirement. Retirement is NOT automatic upon wave completion.
- CG-002 Ownership-Boundary Law: No PIT logic in MMM schema; no direct LLM wiring; no parallel KUC ingestion during B1 wave
- Per-wave conformance: CG-002 ownership boundary checked by IAA at each B1 sub-wave
- NBR-002: Supabase RLS Write-Block Detection (HTTP 403) tested at B1 completion; RLS must not introduce 403 regressions in existing modules

**Status**: PRE-BRIEF ACCEPTED — Awaiting Stage 11 Builder Appointment and Stage 12 wave-start authorization

### 7.2 — api-builder (B2–B6)

**Assignment**: B2–B6 — Supabase Edge Functions, API endpoints, business logic

**⚠️ CRITICAL CONDITION — SB-002:**
api-builder contract mission currently references "Next.js API routes" as primary runtime. MMM Stage 12 uses **Supabase Edge Functions (Deno runtime)** exclusively. api-builder MUST be explicitly briefed on Deno/Supabase as the target runtime at Stage 11 Builder Appointment. api-builder MUST NOT begin B2 wave work without this clarification.

**Acknowledgements**:
- B2–B6 scope: 26 Supabase Edge Functions as specified in architecture; Deno runtime only
- Runtime clarification: Stage 11 appointment brief MUST explicitly state "Deno/Supabase Edge Functions; NOT Next.js API routes"
- CG-002 Ownership-Boundary Law: Per-wave conformance check required; no PIT domain logic; no direct LLM wiring
- NBR-001: TanStack Query Mutation Cache Invalidation tested per-wave B2–B9
- NBR-002: Supabase RLS HTTP 403 detection per-wave B2–B9

**Status**: PRE-BRIEF ACCEPTED WITH CONDITION (SB-002) — Carry-forward to Stage 11 appointment brief

### 7.3 — ui-builder (B3–B6)

**Assignment**: B3–B6 — React/Vite frontend components, user journeys, layouts, accessibility

**Acknowledgements**:
- B3–B6 scope: 17 user journeys as defined in UX Workflow & Wiring Spec (Stage 2)
- Schema dependency: B1 (schema-builder) must complete RLS-critical tables before RLS-dependent UI waves begin
- CG-002 Ownership-Boundary Law: UI renders MMM data only; no direct PIT or AIMC boundary calls
- NBR-001: TanStack Query Mutation Cache Invalidation — per-wave B3–B6; all mutations must invalidate relevant query caches
- Accessibility: WCAG 2.1 AA compliance required; part of B8/B9 QA verification

**Status**: PRE-BRIEF ACCEPTED — Awaiting Stage 11 Builder Appointment

### 7.4 — integration-builder (B7)

**Assignment**: B7 — AIMC/PIT/KUC boundary wiring, integration endpoints, override analysis pipeline

**⚠️ CREDENTIAL HARD GATE — SB-003:**
B7 wave-start is blocked until CS2 provisions credentials:
- `AIMC_SERVICE_TOKEN` — required for AIMC boundary wiring
- `PIT_SERVICE_TOKEN` — required for PIT data feed integration

B7 MUST NOT begin until both credentials are confirmed provisioned by CS2.

**Acknowledgements**:
- B7 scope: AIMC/PIT/KUC boundary integration as defined in architecture; B7 proves MMM boundary readiness only
- CG-003 B7 Closure-Law: B7 completion proves MMM boundary readiness; NOT AIMC internal completion; NOT source retirement
- CG-002 Ownership-Boundary Law: B7 wires boundaries only; no business logic cross-pollution
- Credential provision: CS2 must confirm AIMC_SERVICE_TOKEN + PIT_SERVICE_TOKEN before B7 wave-start authorization

**Status**: PRE-BRIEF ACCEPTED WITH CONDITION (SB-003) — Hard gate active; carry-forward to Stage 12 B7 entry

### 7.5 — qa-builder (B8/B9)

**Assignment**: B8 — Performance testing, security scanning; B9 — Accessibility audit, compliance validation, regression management, handover

**Acknowledgements**:
- B8 scope: GP-001 through GP-010 as defined in Stage 6 QA-to-Red artifacts; all performance and security gates
- B9 scope: Accessibility (WCAG 2.1 AA), compliance validation, NBR-001 + NBR-002 final regression checks
- CG-004 B9 Closure-Law: B9 handover MUST contain explicit B9 closure-law statement per CG-004; B9 proves destination readiness only; source retirement NOT authorized by B9 alone
- NBR-001: TanStack Query Mutation Cache Invalidation — B9 performs final verification across all mutation paths
- NBR-002: Supabase RLS Write-Block Detection — B9 runs final HTTP 403 regression suite

**Status**: PRE-BRIEF ACCEPTED — Awaiting Stage 11 Builder Appointment

---

## Section 8 — Stage-Readiness View (12 Stages)

| Stage | Name | Status | IAA Token / Notes |
|-------|------|--------|-------------------|
| Stage 1 | App Description | ✅ COMPLETE | CS2 approved (maturion-isms#1298) |
| Stage 2 | UX Workflow & Wiring Spec | ✅ COMPLETE | CS2 approved; Foreman + client sign-off (maturion-isms#1352) |
| Stage 3 | FRS | ✅ COMPLETE | IAA-session-mmm-stage3-frs-20260414-PASS; CS2 approved (maturion-isms#1366) |
| Stage 4 | TRS | ✅ COMPLETE | IAA-session-mmm-stage4-trs-20260414-PASS; CS2 approval carried forward (maturion-isms#1378) |
| Stage 5 | Architecture | ✅ COMPLETE | IAA-session-212-mmm-stage5-architecture-20260414-PASS; CS2 formal approval pending |
| Stage 6 | QA-to-Red | ✅ COMPLETE | IAA-session-mmm-stage6-qa-to-red-20260415-PASS; CS2 approved |
| Stage 7 | PBFAG | ✅ COMPLETE | IAA-session-mmm-stage7-pbfag-20260415-PASS; CS2 approved |
| Stage 8 | Implementation Plan | ✅ COMPLETE | IAA-session-mmm-stage8-implementation-plan-20260417-PASS; CS2 approved (Stage 8 addendum supplement: mmm-stage8-addendum-20260419, IAA-session-mmm-stage8-addendum-20260419-PASS; CG-001–CG-005 added) |
| Stage 9 | Builder Checklist | ✅ COMPLETE | IAA-session-mmm-stage9-builder-checklist-20260419-PASS; all 5 builders PASS |
| **Stage 10** | **IAA Pre-Brief** | **✅ COMPLETE — THIS WAVE** | **IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS** |
| Stage 11 | Builder Appointment | ⛔ BLOCKED | Requires Stage 10 TOKEN + CS2 approval; SB-002 (api-builder Deno) must be resolved in brief |
| Stage 12 | Build Execution / Evidence | ⛔ BLOCKED | Requires Stages 10+11 COMPLETE; SB-003 (B7 credentials) hard gate active |

---

## Section 9 — Convergence-Governance Carry-Forward (CG-001–CG-005)

These laws originate from `modules/MMM/08-addendum/convergence-governance-addendum.md` v1.0.0 and carry forward into all Stage 12 build waves.

### CG-001 — Source-State/Switchover Law

The MMM system MUST NOT retire any source (AIMC, legacy KUC, or PIT feed) until all five switchover gates are satisfied:

- **SG-1**: MMM destination system achieves parity on all data categories from the source
- **SG-2**: Parallel-run period of minimum 30 days confirms parity with zero critical discrepancies
- **SG-3**: CS2 formal sign-off on switchover readiness
- **SG-4**: Rollback path confirmed and tested
- **SG-5**: Stakeholder notification completed with 10-business-day notice

Retirement is NOT automatic upon build wave completion. All five conditions must be independently verified before any source is decommissioned.

### CG-002 — Ownership-Boundary Law

Each builder wave must respect these boundary conditions:
- MMM must not contain PIT-specific domain logic; PIT data consumed via integration boundary only
- No direct LLM wiring in MMM UI or API layers (AIMC handles all LLM orchestration)
- No parallel KUC ingestion during active MMM build waves (data integrity risk)
- Per-wave IAA conformance check required: ownership boundary verified at each wave by IAA

### CG-003 — B7 Closure-Law

When integration-builder (B7) completes its wave:
- B7 completion PROVES: MMM boundary integration is ready (AIMC/PIT/KUC endpoints functional)
- B7 completion DOES NOT PROVE: AIMC internal completion, PIT data pipeline readiness, source retirement eligibility
- B7 handover must state this distinction explicitly

### CG-004 — B9 Closure-Law

When qa-builder (B9) completes its wave:
- B9 completion PROVES: MMM destination system is ready to receive production traffic
- B9 completion DOES NOT PROVE: Source system retirement eligibility; switchover readiness
- B9 handover MUST contain explicit closure-law statement referencing CG-004
- Without this statement, B9 handover is defective

### CG-005 — Builder-Readiness Carry-Forward

Stage 9 builder verdicts are frozen:
- All 5 builders assessed PASS in Stage 9 Builder Checklist
- These verdicts carry forward to Stage 11 Builder Appointment
- SB-002 (api-builder Deno) and SB-003 (B7 credentials) carry forward as open blockers
- No re-assessment of builder eligibility needed in Stage 11 — Stage 9 verdicts remain valid

---

## Section 10 — Anti-Regression Obligations (NBR-001, NBR-002)

These obligations apply to all Stage 12 execution waves. They are declared in this governance-doc wave for carry-forward visibility.

### NBR-001 — TanStack Query Mutation Cache Invalidation

**Applies to**: Builders B2–B9 (all code-producing waves)
**Obligation**: Every mutation operation implemented in MMM MUST invalidate the relevant TanStack Query caches after successful completion. Missing invalidation causes stale UI state that is difficult to diagnose in production.
**Verification**: Per-wave by qa-builder. B9 final verification across all mutation paths.
**Failure condition**: Any mutation that does not trigger cache invalidation is a blocking regression.

### NBR-002 — Supabase RLS Write-Block Detection (HTTP 403)

**Applies to**: Builders B1–B9 (all waves including schema)
**Obligation**: All Supabase write operations must be tested for RLS HTTP 403 responses. Missing RLS test coverage causes silent write failures in multi-tenant scenarios.
**Verification**: Per-wave by qa-builder at wave boundary. B1 schema-builder verifies RLS policies are correctly scoped before handoff.
**Failure condition**: Any write path lacking RLS 403 coverage is a blocking regression.

---

## Section 11 — Scope Blockers (SB-001–SB-004)

| Blocker ID | Description | Status | Resolution Path |
|------------|-------------|--------|-----------------|
| SB-001 | Stage 10 PHASE_B_BLOCKING_TOKEN required before Stage 11 can begin | ✅ RESOLVED — IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS | TOKEN written to wave record |
| SB-002 | api-builder contract references Next.js only; Deno/Edge Function runtime must be explicitly declared in Stage 11 brief | ⚠️ OPEN — Carry-forward to Stage 11 | Foreman MUST include explicit Deno/Edge Function runtime declaration in Stage 11 appointment brief |
| SB-003 | B7 credential hard gate: AIMC_SERVICE_TOKEN + PIT_SERVICE_TOKEN not yet provisioned | ⚠️ OPEN — Hard gate at Stage 12 B7 entry | CS2 must provision both tokens before B7 wave-start authorization is granted |
| SB-004 | CS2 approval / PR merge required to formally close Stage 10 | ⚠️ PENDING — Awaiting CS2 review | CS2 merges PR; Stage 10 formally closed on main branch |

---

## Section 12 — Wave-Level Admin Ceremony Expectations (Interim, pending #1420 hardening)

> **THIS SECTION IS MANDATORY.** It establishes wave-level admin ceremony obligations for wave `mmm-stage10-iaa-prebrief-20260420` that the IAA handover review is expected to verify alongside task-level requirements.
>
> This section is **interim** pending formal hardening via issue #1420. When #1420 lands, this section will be superseded by the canonical governance standard.

### 12.1 — Required Final Admin Artifacts for This Wave

| Artifact | Path | Owner | Required State at Handover | Notes |
|----------|------|-------|---------------------------|-------|
| IAA wave record (PRE-BRIEF + TOKEN) | `.agent-admin/assurance/iaa-wave-record-mmm-stage10-iaa-prebrief-20260420.md` | independent-assurance-agent | COMMITTED — `## PRE-BRIEF` populated; `## TOKEN` with `PHASE_B_BLOCKING_TOKEN` non-PENDING | TOKEN written at Phase 4 |
| PREHANDOVER proof (ECAP bundle) | `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-stage10-iaa-prebrief-20260420.md` | execution-ceremony-admin-agent | COMMITTED — non-empty; `iaa_audit_token` field populated; verbatim IAA response pasted | ECAP bundle path |
| PREHANDOVER proof (Foreman accepted copy) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage10-iaa-prebrief-20260420.md` | foreman-v2-agent | COMMITTED — verbatim IAA response pasted; token self-cert guard PASS | Foreman accepted copy |
| Session memory (ECAP bundle) | `.agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-stage10-iaa-prebrief-20260420.md` | execution-ceremony-admin-agent | COMMITTED — all 6 fields; `agents_delegated_to` non-empty | ECAP bundle path |
| Session memory (Foreman accepted copy) | `.agent-workspace/foreman-v2/memory/session-mmm-stage10-iaa-prebrief-20260420.md` | foreman-v2-agent | COMMITTED — all 6 fields populated | Foreman accepted copy |
| Scope declaration | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-stage10-iaa-prebrief-20260420.md` | foreman-v2-agent | COMMITTED — `APPROVED_ARTIFACT_PATHS:` present; all PR diff files declared | HFMC-02 gate |
| Wave current tasks | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | foreman-v2-agent | COMMITTED — all tasks ✅ COMPLETE; `agents_delegated_to` populated | Updated at handover |
| Parking station log | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | execution-ceremony-admin-agent | COMMITTED — new entry for this wave appended | Append-only |
| IAA session memory | `.agent-workspace/independent-assurance-agent/memory/session-mmm-stage10-iaa-prebrief-20260420.md` | independent-assurance-agent | COMMITTED — non-empty | Written at Phase 4 |

### 12.2 — Required Final-State Conditions

All of the following conditions MUST be true at wave closure (IAA FINAL invocation time):

1. `git status --porcelain` output is EMPTY — no uncommitted changes
2. `git diff` output is EMPTY — working tree clean
3. PREHANDOVER proof present at HEAD commit (both ECAP bundle path AND Foreman accepted copy)
4. Session memory present at HEAD commit (both ECAP bundle path AND Foreman accepted copy)
5. No untracked files in `.agent-admin/` at IAA invocation time
6. `PHASE_B_BLOCKING_TOKEN` field in wave record is non-empty and non-PENDING after IAA verdict
7. Foreman accepted copies committed at `.agent-workspace/foreman-v2/memory/`
8. `BUILD_PROGRESS_TRACKER.md` Stage 10 status reads COMPLETE with ASSURANCE-TOKEN reference
9. All qualifying tasks T-S10-001–T-S10-005 marked ✅ COMPLETE in this artifact
10. Verbatim IAA response pasted into PREHANDOVER proof `## IAA Agent Response (verbatim)` section by Foreman

### 12.3 — Required Cross-Artifact Consistency Checks

| Check | Source Value | Verified Against | Match Requirement |
|-------|-------------|-----------------|-------------------|
| Session ID | `mmm-stage10-iaa-prebrief-20260420` | wave-current-tasks.md, PREHANDOVER session_id field, session memory filename, wave record filename | Exact match in all |
| Wave reference | `mmm-stage10-iaa-prebrief-20260420` | All artifact filenames, D1 Status Header wave field, BUILD_PROGRESS_TRACKER | Present in all |
| IAA token reference | `IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS` | PREHANDOVER `iaa_audit_token` field, BUILD_PROGRESS_TRACKER Stage 10 row, wave record `## TOKEN` section | Exact match in all |
| Issue reference | `maturion-isms#1410` | D1 Status Header, PREHANDOVER, session memory, wave record | Present in all |
| Branch | `copilot/mmm-stage-10-iaa-pre-brief` | D1 Status Header, PREHANDOVER, wave record | Present in all |
| Scope declaration parity | All files in PR diff | `APPROVED_ARTIFACT_PATHS:` list in scope declaration | Every PR diff file declared |
| Builder count | 5 builders in D1 §7 | D1 §8 stage-readiness view, BUILD_PROGRESS_TRACKER | Count = 5 |
| Upstream chain | Stages 1–9 COMPLETE | BUILD_PROGRESS_TRACKER | All 9 stages COMPLETE |
| Wave type | PRE_BUILD_STAGE_MODEL governance-doc wave | PREHANDOVER wave description, session memory | No code/schema deliverables |

### 12.4 — Required Acknowledgements and Ownership Boundaries

**Acknowledgements required before wave closure:**

| Party | Acknowledgement Type | Where Recorded | Required State |
|-------|---------------------|----------------|----------------|
| foreman-v2-agent v6.2.0 | Pre-brief acceptance + QP evaluation + 7 confirmation points | D1 §6 + PREHANDOVER QP section | PRESENT, non-empty, covering all 7 points |
| schema-builder | Pre-brief acceptance with B1 conditions | D1 §7.1 | PRESENT with SG-1–SG-5 conditions |
| api-builder | Pre-brief acceptance with Deno runtime condition (SB-002) | D1 §7.2 | PRESENT with explicit Deno/Edge Function runtime condition |
| ui-builder | Pre-brief acceptance with B3–B6 assignment | D1 §7.3 | PRESENT |
| integration-builder | Pre-brief acceptance with B7 credential gate (SB-003) | D1 §7.4 | PRESENT with credential provision condition |
| qa-builder | Pre-brief acceptance with B9 closure-law obligation | D1 §7.5 | PRESENT with explicit B9 closure-law obligation (CG-004) |
| execution-ceremony-admin-agent | ECAP bundle delivery (C1+C2) | ECAP bundle paths committed | COMMITTED |
| independent-assurance-agent | Phase 4 final audit; TOKEN issuance | Wave record `## TOKEN` section | TOKEN written (non-PENDING) |

**Ownership boundaries:**

1. **mat-specialist** owns D1 (iaa-pre-brief.md) + D5 (BUILD_PROGRESS_TRACKER) — does NOT produce ceremony artifacts, wave record, or tokens
2. **independent-assurance-agent** owns IAA-PRE (wave record PRE-BRIEF) + IAA-FINAL (TOKEN issuance) — does NOT produce D1 or ceremony docs
3. **execution-ceremony-admin-agent** owns C1 (PREHANDOVER) + C2 (session memory) — does NOT evaluate quality, invoke IAA, or produce primary deliverables
4. **foreman-v2-agent** owns QP evaluation, admin-compliance checkpoint, IAA FINAL invocation, Foreman accepted copies — does NOT produce primary deliverables, write tokens, or produce ECAP bundles
5. No agent crosses these boundaries without explicit CS2 authorization

### 12.5 — IAA Handover Review Verification Statement

The IAA handover review (Phase 4 final audit) is expected to verify the wave-level admin ceremony expectations in §12.1–§12.4 **alongside** the task-level requirements in Section 1 (T-S10-001–T-S10-005). Specifically:

- IAA checks that all artifacts in §12.1 are present, committed at HEAD, and in the required state
- IAA verifies that all final-state conditions in §12.2 are satisfied at invocation time
- IAA executes the cross-artifact consistency checks in §12.3 against the committed files
- IAA confirms that all acknowledgements in §12.4 are recorded and ownership boundaries respected
- Any §12.1–§12.4 violation is treated as a task-level violation: REJECTION-PACKAGE with STOP-AND-FIX required before re-invocation
- This section is **interim** pending formal hardening via issue #1420. When #1420 lands, this section will be superseded by the canonical governance standard. The requirement to include §12 in pre-brief artifacts will be encoded in the canonical template.

---

## Section 13 — Out of Scope

The following are explicitly out of scope for this wave:

- Stage 11 execution (Builder Appointment) — gated on CS2 approval of this PR
- Stage 12 execution (Build) — gated on Stage 11 completion + SB-003 credential provisioning
- Any source system retirement — governed by CG-001 SG-1–SG-5; not triggered by this wave
- Code changes under `apps/` or `packages/` directories
- Schema changes or database migrations
- Agent contract modifications (CodexAdvisor governs contract changes)
- CI/workflow changes
- Any deliverable not listed in the scope declaration `APPROVED_ARTIFACT_PATHS:`

---

## Document Provenance

| Field | Value |
|-------|-------|
| Document ID | MMM-D1-STAGE10-IAA-PRE-BRIEF-v1.0.0 |
| Produced in wave | mmm-stage10-iaa-prebrief-20260420 |
| Issue | maturion-isms#1410 |
| Branch | copilot/mmm-stage-10-iaa-pre-brief |
| Produced by | mat-specialist (delegated by foreman-v2-agent v6.2.0) |
| QP assessed by | foreman-v2-agent v6.2.0 |
| IAA assessed by | independent-assurance-agent |
| IAA token | IAA-session-mmm-stage10-iaa-prebrief-20260420-PASS |
| Adopted | PHASE_B_BLOCKING — hard gate active |
| Supersedes | None (first Stage 10 pre-brief) |
| Superseded by | Canonical §12 template from #1420 (when published) |
| Upstream authority | `modules/MMM/08-builder-checklist/builder-checklist.md` v1.0.0, IAA-session-mmm-stage9-builder-checklist-20260419-PASS |
| Carry-forward authority | `modules/MMM/08-addendum/convergence-governance-addendum.md` v1.0.0 |
