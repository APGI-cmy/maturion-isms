# BUILD PROGRESS TRACKER

**Module**: ISMS Navigator  
**Module Slug**: isms  
**Last Updated**: 2026-06-11  
**Updated By**: foreman-agent (wave: `isms-w7-deployment-runtime-hardening`)

> **Classification**: ACTIVE — W7 DEPLOYMENT, RUNTIME, ENV, CI HARDENING OPENED  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0  
> **Current Governance Model**: `FOREMAN_OPERATING_MODEL.md`

---

## Stage Status Summary

| Stage | Artifact | Status | Evidence |
|---|---|---|---|
| Stage 1 | App Description | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-app-description-v1.2.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 2 | UX Workflow & Wiring Spec | COMPLETE — Approved with conditions | `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Stage 3 | FRS | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-frs-v0.1.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 4 | TRS | COMPLETE — Approved with conditions | `.agent-admin/signoffs/isms-frs-v0.1.0-ai-cs2-proxy-signoff-20260529.md` |
| Stage 5 | Architecture | COMPLETE — Approved with conditions; remediation pack accepted for planning | `modules/isms/04-architecture/architecture-remediation-pack.md` |
| Stage 6 | QA-to-Red | COMPLETE — RED catalog specified | `modules/isms/05-qa-to-red/qa-to-red-catalog.md` |
| Stage 7 | PBFAG | COMPLETE — Amendment accepts remediation for Stage 8 planning only | `modules/isms/06-pbfag/pbfag-amendment-architecture-remediation-acceptance.md` |
| Stage 8 | Implementation Plan | COMPLETE — Planning artifact only | `modules/isms/07-implementation-plan/implementation-plan.md` |
| Stage 9 | Builder Checklist | COMPLETE — Checklist artifact only | `modules/isms/08-builder-checklist/builder-checklist.md` |
| Stage 10 | IAA Pre-Brief + Acknowledgements | CLOSED WITH CONDITIONS | `modules/isms/09-iaa-pre-brief/iaa-pre-brief-acknowledgements.md` |
| Stage 11 | Builder Appointment | COMPLETE FOR W1-W7 ONLY | `.agent-admin/builder-appointments/isms-stage11-w1-route-public-shell-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w2-free-assessment-flow-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w3-subscribe-auth-onboarding-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w4-context-entitlement-handoff-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w5-ask-maturion-adapter-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w6-backend-persistence-audit-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w7-deployment-runtime-hardening-builder-appointment.md` |
| Stage 12 | W1 Build Execution & Evidence | MERGED — ACCEPTED FOR W1 SCOPE | `modules/isms/11-build/w1-route-public-shell-evidence.md` |
| Stage 12 | W2 Build Execution & Evidence | MERGED — ACCEPTED FOR W2 SCOPE | `modules/isms/11-build/w2-free-assessment-flow-evidence.md` |
| Stage 12 | W3 Build Execution & Evidence | MERGED — ACCEPTED FOR W3 SCOPE | `modules/isms/11-build/w3-subscribe-auth-onboarding-evidence.md` |
| Stage 12 | W4 Build Execution & Evidence | MERGED — ACCEPTED FOR W4 SCOPE | `modules/isms/11-build/w4-context-entitlement-handoff-evidence.md` |
| Stage 12 | W5 Build Execution & Evidence | MERGED — ACCEPTED FOR W5 SCOPE | `modules/isms/11-build/w5-ask-maturion-adapter-evidence.md` |
| Stage 12 | W6 Build Execution & Evidence | MERGED — ACCEPTED FOR W6 SCOPE | `modules/isms/11-build/w6-backend-persistence-audit-evidence.md` |
| Stage 12 | W7 Build Execution & Evidence | IMPLEMENTED ON BRANCH — PR/CI PENDING | `modules/isms/11-build/w7-deployment-runtime-hardening-evidence.md` |

---

## Stage 12: W1 Route Public Shell

**Status**: MERGED — ACCEPTED FOR W1 SCOPE  
**Merged PR**: #1776 (`20d226612f0be0f5c83488865d9d84b56e6204dd`)  
**Correction PR**: #1779 (`3fe209365b26a5fdd35f34f40da441c96bed001f`)

---

## Stage 12: W2 Free Assessment Result Flow

**Status**: MERGED — ACCEPTED FOR W2 SCOPE  
**Merged PR**: #1781 (`f7d592dfcd9caf3f748f78318eea629f95fe8174`)

---

## Stage 12: W3 Subscribe, Checkout Mock, Auth, Onboarding

**Status**: MERGED — ACCEPTED FOR W3 SCOPE  
**Merged PR**: #1783 (`211f979ea2f43f1c130ae9b6317979a6f9eaacb2`)

---

## Stage 12: W4 Shared Context, Entitlement, MMM Handoff

**Status**: MERGED — ACCEPTED FOR W4 SCOPE  
**Merged PR**: #1786 (`d8f8bd749179c2174955b13f75378ba168c4721e`)

---

## Stage 12: W5 Ask Maturion Adapter

**Status**: MERGED — ACCEPTED FOR W5 SCOPE  
**Merged PR**: #1789 (`d7d3a2fbfb2861eb6190cbca6f8eb794c88f8775`)

---

## Stage 12: W6 Backend Boundary, Persistence, Schema/RLS, Audit

**Status**: MERGED — ACCEPTED FOR W6 SCOPE  
**Merged PR**: #1792 (`ea12b4af23c6d40095da951ca24262818bdf142e`)  
**Primary Evidence**:
- `.agent-admin/builder-appointments/isms-stage11-w6-backend-persistence-audit-builder-appointment.md`
- `modules/isms/11-build/w6-backend-persistence-audit-evidence.md`
- `.functional-delivery/pr-1792.md`
- `.agent-admin/assurance/iaa-wave-record-pr1792-isms-w6-backend-persistence-audit.md`
- `.agent-workspace/foreman-v2/memory/session-1792-20260611.md`

W6 delivered backend boundary, schema/RLS and audit-boundary foundations. It does not claim W7-W8 delivery.

---

## Stage 12: W7 Deployment, Runtime, Env, CI Hardening

**Status**: IMPLEMENTED ON BRANCH — PR/CI PENDING  
**Branch**: `foreman/isms-w7-deployment-runtime-hardening`  
**Primary Evidence**:
- `.agent-admin/builder-appointments/isms-stage11-w7-deployment-runtime-hardening-builder-appointment.md` — W7 appointment
- `modules/isms/11-build/w7-deployment-runtime-hardening-evidence.md` — W7 implementation evidence
- `modules/isms/12-deployment/w7-deployment-runtime-runbook.md` — deployment runbook

**Runtime/deployment files changed by W7**:
- `apps/isms-portal/vercel.json`
- `apps/isms-portal/.env.example`
- `apps/isms-portal/scripts/verify-routes.mjs`
- `apps/isms-portal/package.json`
- `modules/isms/12-deployment/w7-deployment-runtime-runbook.md`

**W7 scope**:
- Vercel deployment target selection;
- SPA fallback configuration;
- env example/registry alignment;
- route verification script;
- package scripts for `verify:routes` and `ci:w7`;
- rollback/redeploy documentation;
- no W8 cumulative regression/PBFAG rerun or implementation handover.

---

## Current Stage Summary

**Current Stage**: W7 PR preparation and CI gate inspection.  
**Implementation Handover**: Not authorized.  
**Next Required Action**: Open/review the W7 PR, inspect CI/review results, complete required evidence, and only then decide whether W7 can be accepted as complete.

---

## Governance Compliance

- [x] Stage 1 App Description approved with conditions
- [x] Stage 2 UX Workflow & Wiring Spec approved with conditions
- [x] Stage 3 FRS approved with conditions
- [x] Stage 4 TRS approved with conditions
- [x] Stage 5 Architecture reconciled to TRS and approved with conditions
- [x] Architecture completeness gap analysis filed
- [x] Architecture remediation pack created
- [x] Stage 6 QA-to-Red catalog created
- [x] Stage 7 PBFAG completed
- [x] PBFAG amendment accepted remediation for Stage 8 planning
- [x] Stage 8 Implementation Plan complete
- [x] Wave evidence plan complete
- [x] Stage 9 Builder Checklist complete
- [x] Stage 10 IAA Pre-Brief filed
- [x] Stage 10 acknowledgements recorded or explicitly waived with binding Stage 11 condition
- [x] Stage 11 W1 Builder Appointment complete
- [x] Stage 12 W1 merged and corrected
- [x] Stage 11 W2 Builder Appointment complete
- [x] Stage 12 W2 merged
- [x] Stage 11 W3 Builder Appointment complete
- [x] Stage 12 W3 merged
- [x] Stage 11 W4 Builder Appointment complete
- [x] Stage 12 W4 merged
- [x] Stage 11 W5 Builder Appointment complete
- [x] Stage 12 W5 merged
- [x] Stage 11 W6 Builder Appointment complete
- [x] Stage 12 W6 merged
- [x] Stage 11 W7 Builder Appointment complete
- [x] Stage 12 W7 implementation opened on branch
- [ ] W7 PR opened
- [ ] W7 CI passed
- [ ] W7 review conversations resolved
- [ ] W7 handover authorized

---

## Open Conditions Carried Forward

Remaining items:

- canonical App Description path mismatch remains a governance cleanup item;
- W7 PR must pass CI before W7 acceptance recommendation;
- W7 review conversations must be resolved or dispositioned;
- W8 remains unappointed and unauthorized;
- implementation handover remains blocked until W8/later gates are complete or explicitly waived.

---

**Last Tracker Reconciliation**: 2026-06-11
