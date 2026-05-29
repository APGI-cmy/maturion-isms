# BUILD PROGRESS TRACKER

**Module**: ISMS Navigator  
**Module Slug**: isms  
**Last Updated**: 2026-05-29  
**Updated By**: foreman-agent (wave: `isms-stage-alignment-20260529`)

> **Classification**: ACTIVE — PRE-BUILD RECONCILED THROUGH STAGE 3  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0  
> **Current Governance Model**: `FOREMAN_OPERATING_MODEL.md`

---

## Reconciliation Note

The previous tracker state was stale. It stated that Stage 1 had not started because no `app-description.md` file existed. The current ISMS authority artifact is:

```text
modules/isms/00-app-description/ISMS_app_description.md
```

The tracker is now reconciled to the repo canonical stage model:

```text
Stage 1 = App Description
Stage 2 = UX Workflow & Wiring Spec
Stage 3 = Functional Requirements Specification
Stage 4 = Technical Requirements Specification
```

The earlier user reference to “Stage 2 / FRS” is treated as an instruction to proceed with requirements work, not as a change to the canonical stage model.

---

## Stage Status Summary

| Stage | Artifact | Status | Evidence |
|---|---|---|---|
| Stage 1 | App Description | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-app-description-v1.2.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 2 | UX Workflow & Wiring Spec | COMPLETE — Approved with conditions | `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Stage 3 | FRS | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-frs-v0.1.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 4 | TRS | NOT_STARTED — NEXT | `modules/isms/03-trs/` |
| Stage 5 | Architecture | IN_PROGRESS — requires TRS reconciliation | `modules/isms/04-architecture/` |
| Stage 6 | QA-to-Red | NOT_STARTED | `modules/isms/05-qa-to-red/` |
| Stage 7 | PBFAG | NOT_STARTED | `modules/isms/06-pbfag/` |
| Stage 8 | Implementation Plan | NOT_STARTED | `modules/isms/07-implementation-plan/` |
| Stage 9 | Builder Checklist | PARTIAL | `modules/isms/08-builder-checklist/builder-checklist.md` exists for public landing harvest |
| Stage 10 | IAA Pre-Brief | PARTIAL | `.agent-admin/assurance/` contains FRS and alignment assurance artifacts |
| Stage 11 | Builder Appointment | PARTIAL | `.agent-admin/builder-appointments/` contains pre-build appointments |
| Stage 12 | Build Execution & Evidence | NOT_STARTED — implementation handover not authorized | `modules/isms/11-build/` |

---

## Stage 1: App Description

**Status**: COMPLETE — APPROVED WITH CONDITIONS  
**Location**: `modules/isms/00-app-description/`  
**Primary Artifact**: `ISMS_app_description.md`  
**Approval Artifact**: `.agent-admin/signoffs/isms-app-description-v1.2.0-ai-cs2-proxy-signoff-20260529.md`  
**Completion Date**: 2026-05-29

Conditions carried forward:

- reconcile canonical App Description path wording;
- preserve ISMS as platform front door;
- preserve MMM as module within ISMS;
- carry open routing and handoff issues into downstream artifacts.

---

## Stage 2: UX Workflow & Wiring Spec

**Status**: COMPLETE — APPROVED WITH CONDITIONS  
**Location**: `modules/isms/01-ux-workflow-wiring-spec/`  
**Primary Artifact**: `ux-workflow-wiring-spec.md`  
**Carry-Forward Register**: `open-issues-carry-forward.md`  
**Completion Date**: 2026-05-29

Conditions carried forward:

- open issues must be addressed, deferred, or waived in TRS/Architecture;
- implementation handover remains blocked.

---

## Stage 3: Functional Requirements Specification

**Status**: COMPLETE — APPROVED WITH CONDITIONS  
**Location**: `modules/isms/02-frs/`  
**Primary Artifact**: `functional-requirements.md`  
**Approval Artifact**: `.agent-admin/signoffs/isms-frs-v0.1.0-ai-cs2-proxy-signoff-20260529.md`  
**Completion Date**: 2026-05-29

Conditions carried forward:

- Stage 4 TRS must preserve FRS traceability;
- known open issues must remain visible;
- no implementation handover from FRS alone.

---

## Stage 4: Technical Requirements Specification

**Status**: NOT_STARTED — NEXT GOVERNED STAGE  
**Location**: `modules/isms/03-trs/`

Required artifacts:

- `technical-requirements-specification.md`
- `frs-to-trs-traceability.md`
- open issue disposition table referencing `modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md`

---

## Current Stage Summary

**Current Stage**: Stage 4 — Technical Requirements Specification is next.  
**Stages 1–3**: Approved with conditions.  
**Implementation Handover**: Not authorized.  
**Next Required Action**: Create Stage 4 TRS and FRS-to-TRS traceability.

---

## Governance Compliance

- [x] Stage numbering reconciled to canonical 12-stage model
- [x] Stage 1 App Description approved with conditions
- [x] Stage 2 UX Workflow & Wiring Spec created/backfilled and approved with conditions
- [x] Stage 3 FRS approved with conditions
- [x] Open issues carry-forward register created
- [x] Traceability maintained from App Description to UX Workflow to FRS
- [ ] Stage 4 TRS complete
- [ ] Architecture reconciled to TRS
- [ ] QA-to-Red complete
- [ ] PBFAG complete
- [ ] Implementation handover authorized

---

## Open Conditions Carried Forward

See:

```text
modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md
```

Key items include onboarding route, post-checkout destination, MMM handoff, free assessment result flow, PIT future entry route, non-MMM practical exercises, Ask Maturion capability boundary, subscription entitlements, audit event contract, and implementation CI/build gates.

---

**Last Tracker Reconciliation**: 2026-05-29
