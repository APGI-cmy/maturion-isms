# BUILD PROGRESS TRACKER

**Module**: ISMS Navigator  
**Module Slug**: isms  
**Last Updated**: 2026-06-16  
**Updated By**: foreman-v2-agent (slice: `isms-p1-3-preview-evidence`)

> **Classification**: W1-W8 COMPLETE — P1.3 REAL PREVIEW DEPLOY EVIDENCE RECORDED  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0  
> **Current Governance Model**: `AGENT_GATE_SYSTEM_TRANSITION_NOTICE.md` / PR #1800 gate model

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
| Stage 7 | PBFAG | ACCEPTED WITH CONDITIONS | `modules/isms/06-pbfag/pbfag-rerun-amendment-w8-cumulative-regression.md` |
| Stage 8 | Implementation Plan | COMPLETE — Planning artifact only | `modules/isms/07-implementation-plan/implementation-plan.md` |
| Stage 9 | Builder Checklist | RECONCILED WITH CONDITIONS | `modules/isms/08-builder-checklist/stage9-final-reconciliation-w8.md` |
| Stage 10 | IAA Pre-Brief + Acknowledgements | CLOSED WITH CONDITIONS | `modules/isms/09-iaa-pre-brief/iaa-pre-brief-acknowledgements.md` |
| Stage 11 | Builder Appointment | COMPLETE FOR W1-W8 ONLY | `.agent-admin/builder-appointments/isms-stage11-w1-route-public-shell-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w2-free-assessment-flow-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w3-subscribe-auth-onboarding-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w4-context-entitlement-handoff-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w5-ask-maturion-adapter-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w6-backend-persistence-audit-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w7-deployment-runtime-hardening-builder-appointment.md`; `.agent-admin/builder-appointments/isms-stage11-w8-cumulative-regression-pbfag-builder-appointment.md` |
| Stage 12 | W1 Build Execution & Evidence | MERGED — ACCEPTED FOR W1 SCOPE | `modules/isms/11-build/w1-route-public-shell-evidence.md` |
| Stage 12 | W2 Build Execution & Evidence | MERGED — ACCEPTED FOR W2 SCOPE | `modules/isms/11-build/w2-free-assessment-flow-evidence.md` |
| Stage 12 | W3 Build Execution & Evidence | MERGED — ACCEPTED FOR W3 SCOPE | `modules/isms/11-build/w3-subscribe-auth-onboarding-evidence.md` |
| Stage 12 | W4 Build Execution & Evidence | MERGED — ACCEPTED FOR W4 SCOPE | `modules/isms/11-build/w4-context-entitlement-handoff-evidence.md` |
| Stage 12 | W5 Build Execution & Evidence | MERGED — ACCEPTED FOR W5 SCOPE | `modules/isms/11-build/w5-ask-maturion-adapter-evidence.md` |
| Stage 12 | W6 Build Execution & Evidence | MERGED — ACCEPTED FOR W6 SCOPE | `modules/isms/11-build/w6-backend-persistence-audit-evidence.md` |
| Stage 12 | W7 Build Execution & Evidence | MERGED — ACCEPTED FOR W7 SCOPE | `modules/isms/11-build/w7-deployment-runtime-hardening-evidence.md` |
| Stage 12 | W8 Build Execution & Evidence | MERGED — ACCEPTED FOR W8 SCOPE | `modules/isms/11-build/w8-cumulative-regression-pbfag-evidence.md` |
| Post-W8 | P1 External Deployment Proof | VERIFIED WITH FOLLOW-UP FINDINGS | `modules/isms/12-deployment/p1-external-deployment-proof-20260615.md` |
| Post-W8 | P1.1 Deployment Hygiene Cleanup | MERGED — ACCEPTED FOR P1.1 SCOPE | `modules/isms/12-deployment/p1-1-deployment-hygiene-cleanup-20260615.md` |
| Post-W8 | P1.2 Vercel Workflow Split | MERGED — ACCEPTED FOR P1.2 SCOPE | `modules/isms/12-deployment/p1-2-vercel-workflow-split-20260616.md` |
| Post-W8 | P1.3 Real Preview Deploy Verification | MERGED — EVIDENCE RECORDED FOR P1.3 SCOPE | `modules/isms/12-deployment/p1-3-real-preview-deploy-verification-20260616.md` |

---

## Post-W8: P1 External Deployment Proof

**Status**: VERIFIED WITH FOLLOW-UP FINDINGS  
**Evidence**: `modules/isms/12-deployment/p1-external-deployment-proof-20260615.md`

**Verified**:
- production deployment `dpl_wwAYwu19XLPP1Kzm8cmvF2q1SqNC` is `READY`;
- production domain `https://maturion-isms-portal.vercel.app` returns HTTP 200;
- representative SPA deep links return HTTP 200;
- runtime log query found no logs in the checked one-hour window.

---

## Post-W8: P1.1 Deployment Hygiene Cleanup

**Status**: MERGED — ACCEPTED FOR P1.1 SCOPE  
**Merged PR**: #1809 (`07535ab07f14ce3bb5b8238eecf6e5d9e04233b9`)  
**Evidence**: `modules/isms/12-deployment/p1-1-deployment-hygiene-cleanup-20260615.md`

**Scope delivered**:
- confirms stale PR #1795 is closed and unmerged;
- bounds root Node engine to `>=20 <23`;
- keeps pnpm package manager unchanged because lockfile is `lockfileVersion: '9.0'`;
- patches API bearer validation TypeScript surface in `api/ai/feedback/pending.ts` and `api/ai/feedback/approve.ts`.

---

## Post-W8: P1.2 Vercel Workflow Split

**Status**: MERGED — ACCEPTED FOR P1.2 SCOPE  
**Merged PR**: #1812 (`50785d5b6084fd7a2100cad8e946b596ac8b89a6`)  
**Evidence**: `modules/isms/12-deployment/p1-2-vercel-workflow-split-20260616.md`

**Scope delivered**:
- adds `MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md` coordination artifact;
- adds `.github/workflows/deploy-isms-portal-vercel.yml`;
- scopes ISMS deploy workflow to `apps/isms-portal/**` and ISMS workflow/docs paths;
- leaves MMM and PIT workflow implementation for their owning agents;
- avoids broad `api/**` ownership in the ISMS workflow.

**Post-merge verification**:
- PR #1812 was merged on 2026-06-16;
- PR-scoped CI passed, including `Deploy ISMS Preview`;
- actual Vercel deploy/smoke steps remained conditional on repository secrets: `ISMS_VERCEL_ORG_ID`, `ISMS_VERCEL_PROJECT_ID`, `ISMS_VERCEL_TOKEN`, and optional `ISMS_VERCEL_AUTOMATION_BYPASS_SECRET`.

---

## Post-W8: P1.3 Real Preview Deploy Verification

**Status**: MERGED — EVIDENCE RECORDED FOR P1.3 SCOPE  
**Merged PR**: #1819 (`52606466798c5bf39509ae6c0fad136dff1d21f6`)  
**Evidence**: `modules/isms/12-deployment/p1-3-real-preview-deploy-verification-20260616.md`

**Scope recorded**:
- ISMS app-specific Vercel secrets were configured by the owner before verification;
- PR #1819 triggered the ISMS-only Vercel workflow on an ISMS app path;
- `Deploy ISMS Portal to Vercel` passed on the latest PR head before merge;
- `Deploy ISMS Preview` performed a real Vercel preview deploy rather than the previous missing-secret skip path;
- Vercel reported the ISMS project preview as `Ready`;
- the workflow smoke step passed after treating Vercel preview `401/403` as protected-preview posture rather than SPA route failure.

**Preview URL recorded**:
- `https://maturion-isms-portal-git-foreman-ism-d5f042-rassie-ras-projects.vercel.app`

**Caveat**:
- Vercel's GitHub integration still reported PIT preview activity on the ISMS verification PR. MMM/PIT workflow ownership issues #1815 and #1816 remain active coordination work.

---

## Owner Final Decision

**Status**: RECORDED — ACCEPTED WITH CONDITIONS  
**Decision Record**: `.agent-admin/owner-decisions/isms-w8-owner-final-decision-20260615.md`

Accepted conditions:
- W1-W8 are complete for appointed scope only;
- production auth/payment hardening remains future-gated;
- live AI provider integration remains future-gated;
- runtime persistence hooks remain future-gated;
- audit writer invocation remains future-gated;
- external live deployment proof remains future-gated or conditional.

---

## Current Stage Summary

**Current Stage**: Post-W8 P1.3 real preview deploy evidence has been recorded.  
**Implementation Transfer**: Owner final decision remains recorded with conditions.  
**Next Required Action**: Continue MMM/PIT workflow split coordination through issues #1815 and #1816, then choose the next separately authorized productionization lane.

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
- [x] Stage 7 PBFAG completed and W8 amendment filed
- [x] Stage 8 Implementation Plan complete
- [x] Wave evidence plan complete
- [x] Stage 9 Builder Checklist complete and W8 final reconciliation filed
- [x] Stage 10 IAA Pre-Brief filed
- [x] Stage 10 acknowledgements recorded or explicitly waived with binding Stage 11 condition
- [x] Stage 11 W1-W8 Builder Appointments complete
- [x] Stage 12 W1-W8 merged
- [x] W8 owner final decision recorded
- [x] P1 external deployment proof recorded
- [x] P1.1 deployment hygiene merged
- [x] P1.2 workflow split PR opened
- [x] P1.2 workflow split CI passed
- [x] P1.2 workflow split review conversations resolved
- [x] P1.3 real preview deploy evidence recorded

---

## Future-Gated Items

The following remain outside W1-W8 appointed scope and require separate future authorization:

- production auth/payment hardening;
- live AI provider integration;
- runtime persistence hooks;
- audit writer invocation;
- MMM workflow split implementation by MMM agent;
- PIT workflow split implementation by PIT agent;
- bundle-size review;
- canonical App Description path mismatch cleanup.

---

**Last Tracker Reconciliation**: 2026-06-16
