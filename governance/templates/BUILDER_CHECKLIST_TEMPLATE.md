# {APP_NAME} — Builder Checklist

## Status Header

| Field | Value |
|-------|-------|
| Version | {VERSION} (e.g., 1.0) |
| Status | `Draft` → `PASS` → `FAIL` |
| Module | {MODULE_NAME} |
| Wave / Build Scope | {WAVE_NUMBER or "Full Build"} |
| Foreman | {FOREMAN_IDENTIFIER} |
| Date Executed | {YYYY-MM-DD} |
| Authority | Johan Ras |
| Canonical Location | `modules/{module-slug}/09-builder-checklist/builder-checklist-{YYYYMMDD}.md` |
| Policy Authority | `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 — Stage 9 |

---

## Purpose

This Builder Checklist is executed at **Stage 9** of the canonical pre-build sequence per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0. It verifies builder role-fit, scope comprehension, protocol compliance, dependency readiness, and execution eligibility before any builder is formally appointed by the Foreman.

**This is a DISTINCT GOVERNANCE STAGE — not buried inside architecture or implementation planning.**

Gate Condition: Every builder candidate must achieve a PASS result before the Foreman may proceed to IAA Pre-Brief (Stage 10) and Builder Appointment (Stage 11).

---

## Upstream Prerequisites Verified (REQUIRED)

Before executing this checklist, confirm that all prior stages are gate-passed:

| Stage | Artifact | Status |
|-------|----------|--------|
| Stage 1 — App Description | `{APP}_APP_DESCRIPTION.md` | [ ] Approved |
| Stage 2 — UX Workflow & Wiring Spec | `{APP}_UX_WORKFLOW_WIRING_SPEC.md` | [ ] Approved |
| Stage 3 — FRS | `{APP}_FRS.md` | [ ] Approved |
| Stage 4 — TRS | `{APP}_TRS.md` | [ ] Approved |
| Stage 5 — Architecture | `{APP}_ARCHITECTURE.md` | [ ] Approved |
| Stage 6 — QA-to-Red | RED test suite | [ ] Signed off by Foreman |
| Stage 7 — PBFAG | PBFAG checklist | [ ] PASS |
| Stage 8 — Implementation Plan | `{APP}_IMPLEMENTATION_PLAN.md` | [ ] Approved |

**Gate**: If any prerequisite is not PASS/Approved, this checklist MUST NOT proceed. Resolve prerequisites first.

---

## Builder Candidate Record

**Builder Agent ID / Name**: {BUILDER_IDENTIFIER}  
**Agent Contract Location**: {path to agent contract file}  
**Contract Version**: {VERSION}  
**Role Being Appointed**: {Builder / Specialist / Infra Builder / etc.}  
**Wave Scope**: {WAVE_NUMBER — explicit wave scope this builder will execute}

---

## Section A: Agent Contract and Identity Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| A-01 | Builder agent contract exists at declared location | [ ] PASS / [ ] FAIL | |
| A-02 | Agent contract is current (not expired or superseded) | [ ] PASS / [ ] FAIL | |
| A-03 | Agent contract contains a FAIL-ONLY-ONCE preflight attestation section (Phase 1) | [ ] PASS / [ ] FAIL / [ ] N/A | |
| A-04 | Agent contract declares builder-class authority | [ ] PASS / [ ] FAIL | |
| A-05 | Agent contract references this module's governance documents | [ ] PASS / [ ] FAIL / [ ] N/A | |

**Section A Outcome**: [ ] PASS (all A-0x = PASS) | [ ] FAIL (one or more A-0x = FAIL)

---

## Section B: Governance Canon Comprehension

| # | Check | Result | Notes |
|---|-------|--------|-------|
| B-01 | Builder confirms reading `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 | [ ] PASS / [ ] FAIL | |
| B-02 | Builder confirms reading `BUILD_PHILOSOPHY.md` (One-Time Build Law) | [ ] PASS / [ ] FAIL | |
| B-03 | Builder confirms reading `STOP_AND_FIX_DOCTRINE.md` | [ ] PASS / [ ] FAIL | |
| B-04 | Builder confirms reading `MERGE_GATE_INTERFACE_STANDARD.md` | [ ] PASS / [ ] FAIL | |
| B-05 | Builder confirms reading `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | [ ] PASS / [ ] FAIL | |
| B-06 | Builder confirms reading the PREHANDOVER proof requirements | [ ] PASS / [ ] FAIL | |
| B-07 | Builder confirms reading and acknowledging all module-specific canon files listed in the Implementation Plan | [ ] PASS / [ ] FAIL | |

**Section B Outcome**: [ ] PASS (all B-0x = PASS) | [ ] FAIL (one or more B-0x = FAIL)

---

## Section C: Scope Comprehension

| # | Check | Result | Notes |
|---|-------|--------|-------|
| C-01 | Builder can summarise the App Description purpose in their own words (Foreman-verified) | [ ] PASS / [ ] FAIL | |
| C-02 | Builder confirms they have read the UX Workflow & Wiring Spec and can name all primary user journeys in scope | [ ] PASS / [ ] FAIL | |
| C-03 | Builder confirms FRS understanding — can name the key functional requirement areas in their wave scope | [ ] PASS / [ ] FAIL | |
| C-04 | Builder confirms TRS understanding — can identify the binding technical constraints for their wave scope | [ ] PASS / [ ] FAIL | |
| C-05 | Builder confirms Architecture understanding — can describe the components they will implement | [ ] PASS / [ ] FAIL | |
| C-06 | Builder confirms wave-by-wave scope understanding (Stages 1–N as defined in Implementation Plan) | [ ] PASS / [ ] FAIL | |
| C-07 | Builder confirms understanding of the Golden Path Verification Pack (can name the golden paths) | [ ] PASS / [ ] FAIL | |
| C-08 | Builder confirms understanding of the Runtime/Deployment Contract | [ ] PASS / [ ] FAIL | |
| C-09 | Builder confirms no scope items are ambiguous or unclear | [ ] PASS / [ ] FAIL | Record any ambiguities below |

**Section C Outcome**: [ ] PASS (all C-0x = PASS) | [ ] FAIL (one or more C-0x = FAIL)

**C-09 Ambiguity Register** (if any):

| Ambiguity ID | Description | Artifact | Owner | Resolution |
|-------------|-------------|---------|-------|------------|
| {AMB-001} | {Description} | {Artifact} | {Owner} | {Resolution or "Blocked"} |

---

## Section D: RED QA Suite Comprehension

| # | Check | Result | Notes |
|---|-------|--------|-------|
| D-01 | Builder confirms the RED QA suite exists and has been reviewed | [ ] PASS / [ ] FAIL | |
| D-02 | Builder confirms all RED tests are currently failing (confirming pre-implementation state) | [ ] PASS / [ ] FAIL | |
| D-03 | Builder can identify which RED tests correspond to their wave scope | [ ] PASS / [ ] FAIL | |
| D-04 | Builder confirms understanding of the QA-to-Green target at wave closure | [ ] PASS / [ ] FAIL | |
| D-05 | Builder confirms no test may be modified to make it pass without FM approval | [ ] PASS / [ ] FAIL | |

**Section D Outcome**: [ ] PASS (all D-0x = PASS) | [ ] FAIL (one or more D-0x = FAIL)

---

## Section E: Dependency and Readiness Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| E-01 | Builder confirms no unresolved dependency blockers exist for their wave scope | [ ] PASS / [ ] FAIL | |
| E-02 | Builder confirms the Runtime/Deployment Contract is understood and achievable | [ ] PASS / [ ] FAIL | |
| E-03 | Builder confirms access to all required tools, environments, and credentials (or has a plan to obtain them) | [ ] PASS / [ ] FAIL | |
| E-04 | Builder confirms all external dependencies listed in the Implementation Plan are available or planned | [ ] PASS / [ ] FAIL | |
| E-05 | Builder confirms no personal capacity constraints will prevent wave completion in the agreed timeframe | [ ] PASS / [ ] FAIL | |

**Section E Outcome**: [ ] PASS (all E-0x = PASS) | [ ] FAIL (one or more E-0x = FAIL)

---

## Section F: Protocol Compliance Acknowledgement

| # | Check | Result | Notes |
|---|-------|--------|-------|
| F-01 | Builder acknowledges STOP-AND-FIX doctrine — will halt and escalate on any blocking issue | [ ] PASS / [ ] FAIL | |
| F-02 | Builder acknowledges evidence requirements — will file required evidence artifacts per wave | [ ] PASS / [ ] FAIL | |
| F-03 | Builder acknowledges merge gate requirements — will not merge code that does not pass all gates | [ ] PASS / [ ] FAIL | |
| F-04 | Builder acknowledges PREHANDOVER proof requirement — will file proof before each wave handover | [ ] PASS / [ ] FAIL | |
| F-05 | Builder acknowledges they may NOT modify governance artifacts, canon files, or agent contracts | [ ] PASS / [ ] FAIL | |
| F-06 | Builder acknowledges they may NOT deviate from approved wave scope without FM approval | [ ] PASS / [ ] FAIL | |
| F-07 | Builder acknowledges Change-Propagation Audit obligation — any scope change triggers re-propagation before build continues | [ ] PASS / [ ] FAIL | |

**Section F Outcome**: [ ] PASS (all F-0x = PASS) | [ ] FAIL (one or more F-0x = FAIL)

---

## Section G: Foreman Role-Fit Assessment

> _Completed by the Foreman only. This section is not self-assessed by the builder._

| # | Assessment | Result | Notes |
|---|-----------|--------|-------|
| G-01 | Builder's demonstrated competencies match the technical requirements of this wave scope | [ ] PASS / [ ] FAIL | |
| G-02 | Builder's communication of scope comprehension (Section C) was accurate and complete | [ ] PASS / [ ] FAIL | |
| G-03 | Builder's agent contract explicitly covers the authority scope required for this wave | [ ] PASS / [ ] FAIL | |
| G-04 | No known performance history or FAIL-ONLY-ONCE violations suggest elevated risk for this assignment | [ ] PASS / [ ] FAIL | |
| G-05 | Foreman confirms this builder is the correct fit for this specific build context | [ ] PASS / [ ] FAIL | |

**Section G Outcome**: [ ] PASS (all G-0x = PASS) | [ ] FAIL (one or more G-0x = FAIL)

---

## Overall Checklist Outcome

| Section | Outcome |
|---------|---------|
| A — Agent Contract & Identity | [ ] PASS / [ ] FAIL |
| B — Governance Canon Comprehension | [ ] PASS / [ ] FAIL |
| C — Scope Comprehension | [ ] PASS / [ ] FAIL |
| D — RED QA Suite Comprehension | [ ] PASS / [ ] FAIL |
| E — Dependency & Readiness | [ ] PASS / [ ] FAIL |
| F — Protocol Compliance | [ ] PASS / [ ] FAIL |
| G — Foreman Role-Fit Assessment | [ ] PASS / [ ] FAIL |

**FINAL RESULT**: [ ] **PASS** — Builder is eligible for appointment at Stage 11 | [ ] **FAIL** — Builder appointment BLOCKED; see failures above

**Foreman Sign-Off**: {FOREMAN_IDENTIFIER}  
**Date**: {YYYY-MM-DD}

> If FAIL: All failed checks must be resolved or the builder replaced before proceeding to Stage 10 (IAA Pre-Brief) and Stage 11 (Builder Appointment). Any FAIL blocks the entire appointment.

---

## Failure Resolution Register (if FAIL)

| Check ID | Failure Description | Resolution Required | Status | Resolved Date |
|----------|---------------------|--------------------|---------|----|
| {A-0x / B-0x / ...} | {Description of failure} | {What must change} | Open / Resolved | {Date or "—"} |

---

**Document Metadata**:
- Template ID: BUILDER_CHECKLIST_TEMPLATE_V1.0
- Stage: Stage 9 — per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0
- Required By: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 §Stage 9; `BUILDER_CONTRACT_BINDING_CHECKLIST.md`; `FM_BUILDER_APPOINTMENT_PROTOCOL.md`
- Template Version: v1.0
- Template Location: `governance/templates/BUILDER_CHECKLIST_TEMPLATE.md`
- Effective Date: 2026-04-05
