# PIT — Stage 6 QA-to-Red Plan

## Stage 6 — Pre-Build QA Derivation Artifact

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | QA-to-Red Plan (Stage 6) |
| Version | v1.0 |
| Status | IN_PROGRESS — QA_TO_RED_DERIVATION_STARTED |
| Derived From | Stages 1–5 baseline (App Description, UX Spec, FRS, TRS, Architecture) + Stage 5b LFV Package |
| Author | foreman-v2-agent (POLC-Orchestration mode) |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |
| PR | #1626 |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.1.0 |

> **Governance Notice — Stage 6 RED Derivation Artifact Only**: This document authorises NO code implementation, schema migration, builder appointment, PBFAG pass, deployment configuration, Edge Function creation, or active workflow installation. Build Authorization remains **NOT CLEARED**. No downstream stage (Stages 7–12) may proceed without explicit CS2 gate-pass of Stage 6.

---

## 0. Stage 6 Purpose

Stage 6 is the QA-to-Red derivation phase. Its sole purpose is to define the complete set of failing (RED) test specifications that a future builder must make GREEN before the PIT build is considered functionally complete.

Stage 6 does NOT implement tests. It specifies them. The RED test suite is the contractual acceptance criteria for Stage 12 Build Execution. No build may be declared complete unless every RED test specified in this package has been made GREEN.

### Key Lesson from MMM (L-007 / PR #1590)

> Green CI and wired code paths are not enough.
> If a deployed user journey is not proven with authenticated role execution, state reflection, network/browser evidence, and CS2 acceptance, the product is not functionally complete.

No deployed LFV evidence → no functional pass.
No functional pass → no handover.
No handover → no merge.

---

## 1. Sources

Stage 6 derives RED tests from all approved/re-confirmed upstream stages:

| Stage | Artifact | Status |
|---|---|---|
| Stage 1 | `docs/governance/PIT_APP_DESCRIPTION.md` v1.0 | CS2_APPROVED — 2026-05-06 (maturion-isms#1540) |
| Stage 2 | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2 | CS2_APPROVED_RECONFIRMED — 2026-05-11 |
| Stage 3 | `modules/pit/02-frs/functional-requirements.md` v0.2-hardened | CS2_RECONFIRMED — 2026-05-11 (123 FRs) |
| Stage 4 | `modules/pit/03-trs/technical-requirements-specification.md` v0.2-draft | CS2_APPROVED — 2026-05-11 (maturion-isms#1604, 126 TRs) |
| Stage 5 | `modules/pit/04-architecture/architecture.md` v1.0 | RECONCILIATION_COMPLETE — READY_FOR_CS2_REVIEW (PR #1612) |
| Stage 5b | `modules/pit/05-live-functional-verification/` (9 artifacts + workflow) | MERGED — PR #1624 closed and merged |

> **Note**: Stage 5 Architecture is READY_FOR_CS2_REVIEW (not yet CS2-approved). Stage 5b LFV is merged and available as Stage 6 input. Stage 6 gate-pass is blocked until Stage 5 Architecture is CS2-approved and merged.

---

## 2. Scope

### 2.1 What Stage 6 Covers

Stage 6 derives RED test specifications for:

1. **FRS Coverage** — Every PIT functional requirement (PIT-FR-001 through PIT-FR-123)
2. **TRS Coverage** — Every testable technical requirement (PIT-TR-001 through PIT-TR-126)
3. **Architecture Coverage** — All 27 routes, all 22 screens, all architectural domains
4. **LFV Coverage** — All 9 LFV artifacts + 1 workflow design artifact
5. **Route/Screen State Matrix** — All 27 routes × 5 UI states for primary screens
6. **Role Denied-Path Matrix** — All roles × protected action groups
7. **Timeline Engine Tests** — Full RED suite for Gantt/Timeline domain
8. **Live Functional RED Gates** — Deployed verification gates derived from Stage 5b

### 2.2 What Stage 6 Does NOT Cover

- Implementation of any test (Stage 12)
- Database schema design (Stage 4 — complete)
- Architecture decisions (Stage 5 — complete)
- Builder appointment (Stage 11)
- PBFAG (Stage 7)
- Implementation Plan (Stage 8)
- Builder Checklist (Stage 9)
- Any production code, migrations, or active workflow installations

---

## 3. RED Test ID Convention

All RED tests use stable, prefixed IDs:

| Category | Prefix | Example |
|---|---|---|
| Route/Screen Rendering | PIT-RED-ROUTE | PIT-RED-ROUTE-001 |
| Auth/Onboarding | PIT-RED-AUTH | PIT-RED-AUTH-001 |
| Role/RLS Negative Paths | PIT-RED-RLS | PIT-RED-RLS-001 |
| Project Hierarchy/Lifecycle | PIT-RED-PROJECT | PIT-RED-PROJECT-001 |
| Timeline Engine | PIT-RED-TIMELINE | PIT-RED-TIMELINE-001 |
| Evidence Workflow | PIT-RED-EVIDENCE | PIT-RED-EVIDENCE-001 |
| Notifications | PIT-RED-NOTIFICATION | PIT-RED-NOTIFICATION-001 |
| Reports | PIT-RED-REPORT | PIT-RED-REPORT-001 |
| Audit Log | PIT-RED-AUDIT | PIT-RED-AUDIT-001 |
| QA Dashboard | PIT-RED-QA | PIT-RED-QA-001 |
| AIMC AI Touchpoints | PIT-RED-AIMC | PIT-RED-AIMC-001 |
| Live Functional Verification | PIT-RED-LFV | PIT-RED-LFV-001 |
| Performance/Accessibility | PIT-RED-NFR | PIT-RED-NFR-001 |

### RED Test Row Format

Each RED test row includes:

| Field | Description |
|---|---|
| RED Test ID | Stable ID (e.g. PIT-RED-ROUTE-001) |
| Source Requirement(s) | FRS/TRS/Architecture/LFV reference |
| Route/Screen/Domain | Specific route, screen, or domain under test |
| Actor/Role | User role executing the test |
| Precondition | State required before the test |
| Action | What the actor does |
| Expected Failure (RED) | What happens in RED state (before implementation) |
| Expected GREEN Behaviour | What must be true after implementation |
| Harness/Tool | Test harness, e.g. Playwright, Vitest, axe-core |
| Evidence Artifact | What evidence is captured |
| Priority/Severity | P1 (blocker), P2 (high), P3 (medium), P4 (low) |

---

## 4. Stage 6 Gate Criteria

Stage 6 gate-pass requires ALL of the following:

### 4.1 Coverage Completeness Gates

- [ ] Every FRS requirement (PIT-FR-001–PIT-FR-123) has at least one RED test or `NOT_TESTABLE_WITH_JUSTIFICATION`
- [ ] Every testable TRS requirement (PIT-TR-001–PIT-TR-126) has at least one RED test (excluding PIT-TR-126 non-scope)
- [ ] All 27 architecture routes have direct browser-load RED tests
- [ ] All 22 screens have five-state RED tests
- [ ] All 9 LFV artifacts + workflow are mapped to RED gates
- [ ] No `BLOCKING_GAP` status remains

### 4.2 Domain Completeness Gates

- [ ] Route/screen rendering — 27 routes covered
- [ ] Auth/onboarding — login, signup, invite, reset, session, redirect, expired session
- [ ] Role/RLS — all 7 primary roles with denied-path tests
- [ ] Project lifecycle — create/milestone/deliverable/task/assignment/status/archive/restore/cancel/delete
- [ ] Timeline engine — date math, drag, resize, denominator, overlay, virtualisation, a11y, visual regression
- [ ] Evidence workflow — upload, bucket, metadata, pending, approve, return, blocked completion, denied
- [ ] Notifications — generation, realtime bell, mark-read, history, preferences, permission scoping, failure
- [ ] Reports — generation, storage, history, download, permission denial, failure, audit event
- [ ] Audit log — event creation, attribution, before/after, role visibility, denied
- [ ] QA Dashboard — cs2_admin visibility, denied roles, data isolation, empty/error states
- [ ] AIMC — no direct provider calls, through gateway, suggest/accept/dismiss, audit, disabled state
- [ ] Deployment/LFV — route smoke, Vercel bypass, SHA match, secrets, screenshots, HAR, trace, CS2 acceptance

### 4.3 Blocking Status Gates

- [ ] Zero `BLOCKING_GAP` rows unless PR explicitly marked `BLOCKED_WITH_GAPS` and gate-pass not claimed
- [ ] No implementation code introduced
- [ ] No migrations, no active workflow installations, no deployment config
- [ ] BUILD_PROGRESS_TRACKER.md updated with Stage 6 posture
- [ ] Build Authorization remains NOT CLEARED

### 4.4 Prerequisite Gates (Blocking for final gate-pass)

- [ ] Stage 5 Architecture CS2 gate-pass received (PR #1612 merged)
- [x] Stage 5b LFV Package merged (PR #1624 closed and merged)

---

## 5. Non-Goals (Hard Boundaries)

This Stage 6 package MUST NOT:

- Implement application runtime code
- Create or alter database migrations
- Create Supabase RLS policies
- Create or deploy Edge Functions
- Activate `.github/workflows/pit-live-verification.yml`
- Create active deployment configuration
- Appoint a builder
- Start PBFAG
- Start Implementation Plan
- Start build execution
- Claim CODE_PASS for the PIT application
- Claim FUNCTIONAL_PASS
- Clear Build Authorization
- Advance Stage 7 or later stages

---

## 6. Artifact Index

| Required Category | File | Status |
|---|---|---|
| Stage 6 Methodology and Plan | `qa-to-red-plan.md` (this file) | CREATED |
| RED Test Suite Catalog | `red-test-suite-catalog.md` | CREATED |
| FRS-to-RED Traceability | `frs-to-red-traceability.md` | CREATED |
| TRS-to-RED Traceability | `trs-to-red-traceability.md` | CREATED |
| Architecture-to-RED Traceability | `architecture-to-red-traceability.md` | CREATED |
| LFV-to-RED Traceability | `lfv-to-red-traceability.md` | CREATED |
| Route/Screen/State RED Matrix | `route-screen-state-red-matrix.md` | CREATED |
| Role Denied-Path RED Matrix | `role-denied-path-red-matrix.md` | CREATED |
| Timeline Engine RED Tests | `timeline-engine-red-tests.md` | CREATED |
| Live Functional RED Gates | `live-functional-red-gates.md` | CREATED |
| Stage 6 Gate Readiness Checklist | `stage6-gate-readiness-checklist.md` | CREATED |

---

## 7. Governing References

- `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.1.0
- `governance/canon/LIVE_FUNCTIONAL_VERIFICATION_CANON.md`
- `governance/canon/FULLY_FUNCTIONAL_DELIVERY_STANDARD.md`
- `modules/pit/02-frs/functional-requirements.md` v0.2-hardened
- `modules/pit/03-trs/technical-requirements-specification.md` v0.2-draft
- `modules/pit/04-architecture/architecture.md` v1.0
- `modules/pit/04-architecture/stage5-architecture-reconciliation.md`
- `modules/pit/04-architecture/trs-to-architecture-traceability.md`
- `modules/pit/04-architecture/timeline-engine-architecture-decision.md`
- `modules/pit/05-live-functional-verification/` (all 9 artifacts + workflow)
- `modules/pit/BUILD_PROGRESS_TRACKER.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governing Issue**: maturion-isms#1625
**Wave**: pit-stage6-qa-to-red-20260513
