# ISMS W2 Build Evidence — Free Assessment Result Flow

| Field | Value |
|---|---|
| Wave | W2 — Free Assessment Result Flow |
| Branch | `foreman/isms-w2-free-assessment-flow` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-04 |

---

## Scope delivered

This W2 slice implements the public free assessment and report flow.

Runtime scope:

- `apps/isms-portal/src/lib/freeAssessment.ts`
- `apps/isms-portal/src/pages/FreeAssessment.tsx`

Governance scope:

- `.agent-admin/builder-appointments/isms-stage11-w2-free-assessment-flow-builder-appointment.md`
- `modules/isms/11-build/w2-free-assessment-flow-evidence.md`

---

## Source alignment

The W2 model is aligned to the uploaded LDCS source pack and the approved maturity descriptor methodology:

- five free-assessment domains: Leadership and Governance, Process Integrity, People and Culture, Protection, Proof;
- one operating-state question per MPS-derived assessment standard;
- five maturity choices: Basic, Reactive, Compliant, Proactive, Resilient;
- questions are phrased as observable operating-state diagnostics rather than direct yes/no compliance checks;
- report wording reflects that this is an indicative marketing assessment, not a formal audit opinion.

---

## User journey

The user can:

1. open `/free-assessment` without authentication;
2. enter organisation and sector context;
3. answer LDCS/MPS-aligned maturity questions across five domains;
4. generate an indicative report;
5. see overall and domain-level scores;
6. read one improvement paragraph per domain;
7. print or export the report;
8. navigate from the report to the main ISMS page, Journey/loss-prevention philosophy page, and subscription path.

---

## D3 QA mapping

| RED test | W2 evidence |
|---|---|
| T-ISMS-S6-021 | Existing free-assessment route remains public and reachable from public navigation. |
| T-ISMS-S6-022 | Response capture implemented with per-question radio selections. |
| T-ISMS-S6-023 | Indicative score and maturity level calculated in `createAssessmentReport`. |
| T-ISMS-S6-024 | Report offers subscribe/sign-up path and does not route users to private `/assessment`. |
| T-ISMS-S6-025 | Result state is held locally in page state; persistence/handoff remains future W4/W6. |
| T-ISMS-S6-026 | Public assessment remains separate from private MMM execution. |
| T-ISMS-S6-027 | Generate-report action is disabled until all questions are answered. |
| T-ISMS-S6-028 | Refresh/back persistence is not yet implemented; explicit known partial for W2 review. |
| T-ISMS-S6-029 | Questions use labelled radio controls and semantic fieldsets. |
| T-ISMS-S6-030 | Completion audit hook remains future W6; no persistence/audit writer introduced in W2. |

---

## Known partials

- Refresh/back navigation persistence is not implemented in this branch.
- No live AI provider call is implemented; the report uses deterministic local scoring and generated narrative.
- No Supabase persistence or audit writer is introduced.
- No private MMM handoff is implemented.
- No W3-W8 work is started.

---

## Non-scope confirmation

W2 does not implement W3 subscribe/checkout/auth/onboarding runtime, W4 entitlement/MMM handoff, W5 Ask Maturion adapter, W6 persistence/RLS/audit, W7 deployment hardening, or W8 regression/PBFAG rerun.

---

## Evidence still required before merge

- Build/lint/test results.
- CI status inspection.
- Foreman QP.
- ECAP/IAA as required by repository gates.
- Review conversation disposition.
