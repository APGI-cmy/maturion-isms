# ISMS Stage 11 — Builder Appointment: W2 Free Assessment Result Flow

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W2 — Free Assessment Result Flow |
| Appointment ID | `isms-stage11-w2-free-assessment-flow-20260604` |
| Status | APPOINTED FOR W2 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w2-free-assessment-flow |

---

## 1. Appointment Decision

The Foreman appoints the W2 implementation builder for the ISMS free assessment result flow.

This appointment is limited to W2 only.

```text
W2 — Free Assessment Result Flow
```

This appointment does not authorize W3-W8, implementation handover, production persistence, payment implementation, entitlement implementation, private MMM execution, or full product readiness claims.

---

## 2. Builder Acknowledgement

The appointed builder must acknowledge the following before execution:

| ID | Required acknowledgement | Status |
|---|---|---|
| ACK-001 | Read and understood `modules/isms/09-iaa-pre-brief/iaa-pre-brief.md` | Acknowledged by Foreman-appointed W2 builder |
| ACK-002 | Read and understood `modules/isms/09-iaa-pre-brief/iaa-pre-brief-acknowledgements.md` | Acknowledged by Foreman-appointed W2 builder |
| ACK-003 | Read and understood `modules/isms/08-builder-checklist/builder-checklist.md` | Acknowledged by Foreman-appointed W2 builder |
| ACK-004 | Accepts W2-only scope and constraints | Acknowledged |
| ACK-005 | Accepts build/lint/test/CI evidence obligations | Acknowledged |
| ACK-006 | Accepts that implementation handover remains blocked until later gates | Acknowledged |

By accepting this appointment, the builder is bound to the Stage 10 acknowledgement conditions and Stage 9 builder checklist.

---

## 3. W2 Scope

The builder is appointed to implement only the W2 scope defined in Stage 8 and Stage 9, amended by the user-provided LDCS maturity sources supplied on 2026-06-04.

Primary scope:

- implement public free assessment entry and response capture;
- structure the assessment around the five LDCS domains: Leadership and Governance, Process Integrity, People and Culture, Protection, and Proof;
- ask one operating-state question per MPS-derived assessment standard, phrased psychometrically to reduce self-manipulation;
- use the Basic, Reactive, Compliant, Proactive, and Resilient maturity descriptor methodology;
- compute indicative maturity baseline and per-domain scores;
- render an ESCO-facing marketing report with a paragraph per domain explaining what must improve to reach the next level and what is needed for resilience;
- explain how subscription to the Maturity Roadmap supports operational excellence and resilience through sector-specific minimum performance criteria;
- support print/export of the report;
- link from the report to the main ISMS page, subject-knowledge/loss-prevention journey page, and sign-up/subscribe path;
- prevent public result dead-end into private `/assessment`.

---

## 4. Source Inputs

W2 must use these user-provided source inputs as directional authority:

- `LDCS_Maturity_Model_Descriptor_Guideline_Approved_Methodology_Reference.md`;
- `LDCS structure and criteria.docx`;
- user instruction on 2026-06-04 describing five domains, MPS-derived questions, AI-evaluated maturity scoring, ESCO-facing marketing report, print/export, and subscription conversion path.

The uploaded descriptor guideline requires maturity levels to be reconstructed into observable operating states, rather than copying criterion wording into each level.

---

## 5. Likely Files in Scope

Likely files include, but are not limited to:

- `apps/isms-portal/src/pages/FreeAssessment.tsx`;
- `apps/isms-portal/src/lib/freeAssessment.ts`;
- W2 evidence and PR-scoped functional-delivery artifacts.

Any expansion beyond W2 must be stopped and escalated to Foreman before implementation continues.

---

## 6. Explicitly Out of Scope

The builder must not implement:

- W3 subscribe/checkout/auth/onboarding runtime flows beyond linking to existing subscribe/sign-up routes;
- W4 entitlement, shared context, or MMM handoff logic;
- W5 Ask Maturion adapter or live AI provider integration;
- W6 Supabase schemas, RLS, edge/backend functions, persisted assessment storage, or audit writer;
- W7 deployment workflow or Vercel automation;
- W8 cumulative regression/PBFAG rerun;
- production handover claims.

The W2 report may describe future AI-assisted evaluation as the maturity roadmap value proposition, but live AI execution remains out of scope unless W5/W6 explicitly authorize it.

---

## 7. Required Evidence on Completion

Before Foreman QP can pass W2, the builder must provide:

| Evidence | Requirement |
|---|---|
| Scope evidence | List changed files and confirm W2-only scope |
| Source alignment | Map W2 to LDCS source files and maturity descriptors |
| Assessment evidence | Show question/domain model, response capture, score calculation, and report rendering |
| QA mapping | Map work to Stage 6 D3 RED tests |
| Build evidence | Run and record app build command or explain blocker truthfully |
| Lint evidence | Run and record lint command or explain blocker truthfully |
| Test evidence | Run and record relevant tests or explain blocker truthfully |
| CI evidence | PR checks inspected and passing or explicitly waived |
| Review evidence | Copilot/Codex conversations resolved or dispositioned |

---

## 8. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W2 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY FOR W2 FREE ASSESSMENT RESULT FLOW
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
