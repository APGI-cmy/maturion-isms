# ISMS Stage 11 — Builder Appointment: W1 Route Registry, Public Pages, Redirects

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Appointment |
| Stage | Stage 11 |
| Wave | W1 — Route Registry, Public Pages, Redirects |
| Appointment ID | `isms-stage11-w1-route-public-shell-20260602` |
| Status | APPOINTED FOR W1 ONLY |
| Foreman | foreman-agent |
| Builder Role | implementation-builder-w1-route-public-shell |

---

## 1. Appointment Decision

The Foreman appoints the W1 implementation builder for the first ISMS implementation wave.

This appointment is limited to W1 only.

```text
W1 — Route Registry, Public Pages, Redirects
```

This appointment does not authorize W2–W8, implementation handover, or production readiness claims.

---

## 2. Builder Acknowledgement

The appointed builder must acknowledge the following before execution:

| ID | Required acknowledgement | Status |
|---|---|---|
| ACK-001 | Read and understood `modules/isms/09-iaa-pre-brief/iaa-pre-brief.md` | Required before execution |
| ACK-002 | Read and understood `modules/isms/09-iaa-pre-brief/iaa-pre-brief-acknowledgements.md` | Required before execution |
| ACK-003 | Read and understood `modules/isms/08-builder-checklist/builder-checklist.md` | Required before execution |
| ACK-004 | Accepts W1-only scope and constraints | Required before execution |
| ACK-005 | Accepts build/lint/test/CI evidence obligations | Required before execution |
| ACK-006 | Accepts that implementation handover remains blocked until later gates | Required before execution |

By accepting this appointment, the builder is bound to the Stage 10 acknowledgement conditions and Stage 9 builder checklist.

---

## 3. W1 Scope

The builder is appointed to implement only the W1 scope defined in Stage 8 and Stage 9.

Primary scope:

- establish or validate central route constants;
- wire public routes for landing, modules overview, journey, free assessment entry, subscribe, auth, and marketing pages;
- ensure private placeholders remain protected;
- implement legacy marketing redirects to canonical `/marketing/*` routes;
- use shared module-card configuration for landing and modules overview;
- verify module cards route only to public marketing pages;
- map implementation to Stage 6 D1 and D2 RED tests;
- capture route/wiring, build, lint, test, and CI evidence.

---

## 4. Likely Files in Scope

Likely files include, but are not limited to:

- `apps/isms-portal/src/App.tsx`
- `apps/isms-portal/src/lib/routes.ts`
- `apps/isms-portal/src/lib/moduleCards.ts`
- `apps/isms-portal/src/pages/Index.tsx`
- `apps/isms-portal/src/pages/ModulesOverview.tsx`
- `apps/isms-portal/src/pages/Journey.tsx`
- `apps/isms-portal/src/pages/marketing/*`

Any expansion beyond W1 must be stopped and escalated to Foreman before implementation continues.

---

## 5. Explicitly Out of Scope

The builder must not implement:

- W2 free assessment result engine beyond route entry wiring;
- W3 subscribe/checkout/auth/onboarding runtime flows beyond route placeholders/wiring;
- W4 entitlement, shared context, or MMM handoff logic;
- W5 Ask Maturion adapter implementation;
- W6 Supabase schemas, RLS, edge/backend functions, or audit writer;
- W7 deployment workflow or Vercel automation;
- W8 cumulative regression/PBFAG rerun;
- production handover claims.

---

## 6. Required Evidence on Completion

Before Foreman QP can pass W1, the builder must provide:

| Evidence | Requirement |
|---|---|
| Scope evidence | List changed files and confirm W1-only scope |
| Route evidence | Show public/private route behavior and redirects |
| QA mapping | Map work to Stage 6 D1 and D2 RED tests |
| Build evidence | Run and record app build command or explain blocker truthfully |
| Lint evidence | Run and record lint command or explain blocker truthfully |
| Test evidence | Run and record relevant tests or explain blocker truthfully |
| CI evidence | PR checks inspected and passing or explicitly waived |
| Review evidence | Copilot/Codex conversations resolved or dispositioned |

---

## 7. Foreman QP, ECAP, and IAA Sequence

After W1 build execution is complete, Foreman must perform:

1. Foreman QP against W1 scope, route/wiring, QA mapping, and evidence;
2. ECAP evidence capture for changed files, commands, results, and known blockers;
3. IAA review/token for W1 completion evidence;
4. PR CI gate inspection;
5. handover recommendation only if scope and evidence are satisfactory.

This appointment does not itself satisfy those steps.

---

## 8. Appointment Result

```text
BUILDER APPOINTMENT: APPROVED FOR W1 ONLY
RUNTIME EXECUTION: AUTHORIZED ONLY AFTER BUILDER ACKNOWLEDGEMENT
IMPLEMENTATION HANDOVER: NOT AUTHORIZED
PRODUCTION READINESS: NOT AUTHORIZED
```
