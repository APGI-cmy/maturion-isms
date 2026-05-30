# BUILD PROGRESS TRACKER

**Module**: ISMS Navigator  
**Module Slug**: isms  
**Last Updated**: 2026-05-30  
**Updated By**: foreman-agent (wave: `isms-stage6-qa-to-red-20260530`)

> **Classification**: ACTIVE — PRE-BUILD RECONCILED THROUGH STAGE 6  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0  
> **Current Governance Model**: `FOREMAN_OPERATING_MODEL.md`

---

## Stage Status Summary

| Stage | Artifact | Status | Evidence |
|---|---|---|---|
| Stage 1 | App Description | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-app-description-v1.2.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 2 | UX Workflow & Wiring Spec | COMPLETE — Approved with conditions | `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Stage 3 | FRS | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-frs-v0.1.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 4 | TRS | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-trs-v0.1.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 5 | Architecture | COMPLETE — Approved with conditions; completeness gate RED for implementation handover | `modules/isms/04-architecture/architecture-completeness-gap-analysis.md` |
| Stage 6 | QA-to-Red | COMPLETE — RED catalog specified | `modules/isms/05-qa-to-red/qa-to-red-catalog.md` |
| Stage 7 | PBFAG | NOT_STARTED — NEXT | `modules/isms/06-pbfag/` |
| Stage 8 | Implementation Plan | NOT_STARTED | `modules/isms/07-implementation-plan/` |
| Stage 9 | Builder Checklist | PARTIAL | `modules/isms/08-builder-checklist/builder-checklist.md` exists for public landing harvest |
| Stage 10 | IAA Pre-Brief | PARTIAL | `.agent-admin/assurance/` contains pre-build assurance artifacts |
| Stage 11 | Builder Appointment | PARTIAL | `.agent-admin/builder-appointments/` contains pre-build appointments |
| Stage 12 | Build Execution & Evidence | NOT_STARTED — implementation handover not authorized | `modules/isms/11-build/` |

---

## Stage 6: QA-to-Red

**Status**: COMPLETE — RED CATALOG SPECIFIED  
**Location**: `modules/isms/05-qa-to-red/`  
**Primary Artifacts**:
- `qa-to-red-catalog.md` — 120 RED tests across route wiring, module cards, free assessment, subscription/onboarding, context/handoff, AI, edge functions, Supabase/RLS, audit, deployment/CI, and architecture completeness
- `qa-to-red-traceability.md` — FRS/TRS/gap-analysis coverage matrix

**Completion Date**: 2026-05-30  
**Notes**: Stage 6 defines RED QA expectations. It does not mean tests are implemented or passing. The catalog is intentionally RED until implementation satisfies it.

---

## Current Stage Summary

**Current Stage**: Stage 7 — PBFAG is next.  
**Stages 1–6**: Approved/progressed for pre-build governance.  
**Architecture Completeness Gate**: RED for implementation handover.  
**Implementation Handover**: Not authorized.  
**Next Required Action**: Create PBFAG and ensure it blocks implementation until architecture completeness, QA, build, CI, and handover prerequisites are satisfied or explicitly waived.

---

## Governance Compliance

- [x] Stage 1 App Description approved with conditions
- [x] Stage 2 UX Workflow & Wiring Spec approved with conditions
- [x] Stage 3 FRS approved with conditions
- [x] Stage 4 TRS approved with conditions
- [x] Stage 5 Architecture reconciled to TRS and approved with conditions
- [x] FRS-to-TRS traceability created
- [x] TRS-to-Architecture traceability created
- [x] Architecture completeness gap analysis filed
- [x] Stage 6 QA-to-Red catalog created
- [x] QA-to-Red traceability created
- [ ] PBFAG complete
- [ ] Implementation handover authorized

---

## Open Conditions Carried Forward

Remaining items must carry into Stage 7 PBFAG and later implementation gates:

- canonical App Description path mismatch remains a governance cleanup item;
- architecture completeness gate remains RED for implementation handover;
- deployment target and runtime entrypoint architecture must be completed;
- environment variable registry and `.env.example` obligations must be completed;
- Supabase schema, migration, RLS, and tenant isolation must be completed where persistence is used;
- edge function registry and invocation map must be completed;
- Ask Maturion adapter, prompt, context, and failure contracts must be completed;
- full system wiring and E2E path traces must be completed;
- free assessment result implementation must avoid dead-end to private `/assessment`;
- persistent entitlement data source must be finalized before production implementation;
- audit storage/integration must be finalized before production implementation;
- build/test/CI evidence remains future-gated.

---

**Last Tracker Reconciliation**: 2026-05-30
