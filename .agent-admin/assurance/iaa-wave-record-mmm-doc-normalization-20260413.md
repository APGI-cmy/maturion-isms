# IAA Wave Record — mmm-doc-normalization-20260413

**Agent**: independent-assurance-agent  
**Contract Version**: 2.6.0  
**Adoption Phase**: PHASE_B_BLOCKING  
**Wave**: mmm-doc-normalization-20260413  
**Issue**: maturion-isms#1358  
**Branch**: copilot/normalize-pre-build-documents  
**CS2 Authorization**: Confirmed — issue #1358 opened directly by @APGI-cmy  
**Created**: 2026-04-13  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

### Wave Summary

Foreman normalizes and operationalizes all MMM pre-build documents to current state.
This is a governance document normalization wave — no implementation code, no FRS/TRS,
no schema changes, no builder appointment, no builder delegation, no Stage 3 FRS drafting.

### Qualifying Tasks

| task_id | task_summary | iaa_trigger_category | required_phases | required_evidence_artifacts | applicable_overlays | specific_rules |
|---------|-------------|---------------------|----------------|---------------------------|--------------------|--------------  |
| D1-BPT | Update BUILD_PROGRESS_TRACKER.md to current state as primary live stage-state document | PRE_BUILD_STAGE_MODEL | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Verdict) | PREHANDOVER proof, session memory, diff evidence | PRE_BUILD_GATES (OVL-PBG-001–OVL-PBG-016), Core Invariants | OVL-PBG-006: verify 12-stage model used; OVL-PBG-008: verify stage gating respected (no claimed stages beyond actual completion) |
| D1-HM | Update harvest-map.md — resolve stale pre-Stage-2 references and LKIAC open questions | PRE_BUILD_STAGE_MODEL (AMBIGUITY RULE — module lifecycle artifact) | Phase 2, Phase 3, Phase 4 | PREHANDOVER proof, session memory, diff evidence | Core Invariants | Verify pre-Stage-2 references updated to reflect current state; no false stage-advancement claims |
| D1-STRAT | Update PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md blocker statuses | PRE_BUILD_STAGE_MODEL (AMBIGUITY RULE — pre-build lifecycle blockers) | Phase 2, Phase 3, Phase 4 | PREHANDOVER proof, session memory, diff evidence | Core Invariants | Verify blocker statuses reflect actual current state; no false resolution claims |
| D2 | Create mmm-document-control-baseline.md — NEW document classification baseline | PRE_BUILD_STAGE_MODEL (AMBIGUITY RULE — module lifecycle meta-governance) | Phase 2, Phase 3, Phase 4 | PREHANDOVER proof, session memory, new file | Core Invariants | Verify classification is consistent with BUILD_PROGRESS_TRACKER and actual file states |
| D3 | Define MMM document maintenance protocol | Covered by D1/D2 files | Phase 3 (embedded), Phase 4 | Embedded in D2 artifact | Core Invariants | Verify protocol is practical and enforceable |
| D4 | Reconcile BUILD_PROGRESS_TRACKER as primary live stage-state document | PRE_BUILD_STAGE_MODEL | Phase 2, Phase 3, Phase 4 | PREHANDOVER proof, diff evidence | PRE_BUILD_GATES | OVL-PBG-006: 12-stage model; verify primacy claim is consistent with other MMM documents |

### PR Category Classification

**Category**: PRE_BUILD_STAGE_MODEL  
**Trigger**: Explicit match — `modules/*/BUILD_PROGRESS_TRACKER.md` in trigger table step 8  
**Overlay**: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-016) + Core Invariants  
**IAA Mandatory**: YES  

**Scope Clarification**: This wave NORMALIZES documents to current state. It does NOT advance
build stages. PRE_BUILD_GATES overlay checks apply in "verify current state is accurately
reflected" mode, not in stage-advancement mode. Stage gating checks (OVL-PBG-008) verify
the normalization does not claim stages that are not actually complete.

### PREHANDOVER Structure Expectations

At handover, the Foreman's PREHANDOVER proof MUST include:

1. **Standard fields**: `session_id`, `date`, `wave`, `issue_ref`, `branch`, `producing_agent`,
   `producing_agent_class`, `cs2_authorization`, `iaa_audit_token` (pre-populated with expected
   reference per A-029)
2. **Scope declaration**: Explicit list of files modified/created with diff summary
3. **Stage-state attestation**: Current MMM stage declared (which stage is complete, which is in
   progress) — must match what BUILD_PROGRESS_TRACKER claims after normalization
4. **No-stage-advancement declaration**: Explicit statement that this wave does not advance any
   stage — it normalizes documents to reflect current state
5. **Document classification summary**: For each file in scope, state whether it is live/historical/reference
6. **FAIL-ONLY-ONCE attestation**: Producing agent attests rules reviewed
7. **All template placeholders replaced** — no `[commit hash]`, `[to be populated]`, or similar
   unresolved markers (anti-regression per session-wave15r-gov-20260308)

### FFA (FAIL-ONLY-ONCE) Check Requirements

At handover, IAA will execute these FFA checks against this wave:

| FFA Rule | Applicability | Check Description |
|----------|--------------|------------------|
| A-001 | APPLICABLE | IAA invocation evidence present in PR artifacts (PREHANDOVER proof references IAA) |
| A-002 | N/A | No agent contract changes in this wave |
| A-025/A-029 | APPLICABLE | PREHANDOVER proof `iaa_audit_token` field uses expected-reference pattern (not PENDING) |
| A-026 | APPLICABLE | SCOPE_DECLARATION.md updated for this wave (if applicable) |

### Applicable PRE_BUILD_GATES Overlay Checks (at Handover)

| OVL Check | Applicable? | Notes |
|-----------|-------------|-------|
| OVL-PBG-001 | YES | Module manifest slug/directory match |
| OVL-PBG-002 | YES | BUILD_PROGRESS_TRACKER identity consistency |
| OVL-PBG-003 | ADVISORY | Architecture doc module name (no architecture changes expected) |
| OVL-PBG-004 | YES | IAA Pre-Brief existence (this artifact) |
| OVL-PBG-005 | ADVISORY | AGENT_HANDOVER_AUTOMATION canonical version |
| OVL-PBG-006 | YES — PRIMARY | BUILD_PROGRESS_TRACKER uses full 12-stage model |
| OVL-PBG-007 | ADVISORY | Architecture doc full lifecycle (no arch changes expected) |
| OVL-PBG-008 | YES — PRIMARY | Stage gating respected — no claimed stages beyond actual completion |
| OVL-PBG-009 | ADVISORY | Legacy directory numbering advisory |
| OVL-PBG-010 through OVL-PBG-016 | N/A | Stage advancement and build-start checks — not applicable for normalization-only wave |

### Scope Blockers Identified

| Blocker ID | Description | Severity | Status |
|-----------|-------------|----------|--------|
| SB-001 | `modules/MMM/_readiness/mmm-document-control-baseline.md` does not exist yet — must be CREATED by Foreman (D2 task) | INFO | Expected — new file |
| SB-002 | If BUILD_PROGRESS_TRACKER normalization changes any stage status (e.g., marking a stage as COMPLETE that was previously unmarked), this constitutes a STAGE ADVANCEMENT claim and triggers full OVL-PBG-008 enforcement | CONDITIONAL | Monitor at handover |
| SB-003 | If harvest-map.md or PRE_MMM_IMPLEMENTATION_UPGRADE_STRATEGY.md changes contradict BUILD_PROGRESS_TRACKER state, IAA will issue REJECTION-PACKAGE for state inconsistency | CONDITIONAL | Monitor at handover |
| SB-004 | No builder delegation or appointment permitted in this wave per Foreman scope declaration — if any task references builder work, REJECTION-PACKAGE | BLOCKING | Verify at handover |

### Anti-Regression Obligations

| Pattern | Source | Check at Handover |
|---------|--------|------------------|
| PREHANDOVER template placeholders not replaced | session-wave15r-gov-20260308, R2 | Binary: any unresolved placeholder → FAIL |
| PREHANDOVER missing required sections | session-061, session-052 | Verify all standard sections present |
| Stage claims exceeding actual completion | PRE_BUILD_GATES design intent | OVL-PBG-008 enforcement |

### Ceremony-Admin Appointment

**ceremony_admin_appointed**: NO  
**ECAP three-role split check at handover**: N/A

### Evidence Artifact Requirements (Complete List)

At Phase 4 handover, the following artifacts MUST be present or IAA will issue REJECTION-PACKAGE:

1. **PREHANDOVER proof** — per structure expectations above
2. **Session memory** — with FAIL-ONLY-ONCE attestation, learning_notes, suggestions
3. **Diff evidence** — all 4 files in scope must show in PR diff
4. **New file created** — `modules/MMM/_readiness/mmm-document-control-baseline.md`
5. **BUILD_PROGRESS_TRACKER consistency** — 12-stage model, no false stage claims
6. **IAA audit token field** — pre-populated in PREHANDOVER proof with expected reference

### Pre-Brief Status

**Status**: COMPLETE  
**IAA Trigger**: YES — PRE_BUILD_STAGE_MODEL (mandatory)  
**Overlay**: PRE_BUILD_GATES + Core Invariants  
**Wave record committed**: This file  
**IAA awaits Phase 4 handover invocation from Foreman.**

---

## PREHANDOVER (Embedded — populated at handover)

_To be populated when Foreman invokes IAA for Phase 4 handover._

---

## TOKEN

_To be populated after IAA Phase 3–4 assurance verdict._

PHASE_B_BLOCKING_TOKEN: PENDING

---

## REJECTION_HISTORY

_No rejections recorded._

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Version**: independent-assurance-agent v6.2.0  
**Contract Version**: 2.6.0  
**Wave Record Version**: 1.0.0
