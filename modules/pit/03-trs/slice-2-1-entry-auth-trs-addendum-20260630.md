# PIT TRS Addendum - Entry, Signup, Auth and Standalone Journey

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Stage 4 TRS addendum |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | ADDENDUM - PENDING REVIEW |
| Derived from | FRS Slice 2.1 addendum |

---

## 1. Purpose

This addendum defines technical requirements for future implementation of PIT integrated and standalone entry, signup, authentication, entitlement, onboarding and role handling.

---

## 2. Technical requirements

| ID | Requirement |
|---|---|
| PIT-TR-127 | The route guard stack must evaluate authentication before entitlement and entitlement before role permission. |
| PIT-TR-128 | Shared Maturion identity must be used for both integrated and standalone PIT journeys. |
| PIT-TR-129 | PIT-only entitlement and full-bundle entitlement must be represented distinctly but evaluated through the same entitlement service/contract. |
| PIT-TR-130 | Standalone PIT entry must support a PIT-branded route without serving the generic ISMS landing page. |
| PIT-TR-131 | Signup/auth entry must support new-account and existing-account flows. |
| PIT-TR-132 | PIT onboarding must persist or prepare to persist organisation/module context separately from generic marketing state. |
| PIT-TR-133 | Role evaluation must support project manager, milestone manager, deliverable manager, task manager, evidence contributor, reviewer/approver, viewer, auditor, PIT admin, org owner and CS2 role families. |
| PIT-TR-134 | Navigation rendering must be role-aware and must suppress unavailable primary actions for unauthorized roles. |
| PIT-TR-135 | Route outcomes must be testable for unauthenticated, authenticated/non-entitled, entitled/unauthorized and entitled/authorized users. |
| PIT-TR-136 | All signup, entitlement and role transition behavior must be designed for future audit event capture. |

---

## 3. Implementation constraints

- Runtime implementation is not authorized by this addendum.
- Production auth provider selection remains future scope unless explicitly approved.
- Production billing provider integration remains future scope unless explicitly approved.
- Supabase schema/RLS is not changed by this addendum.
- Host policy must not regress to duplicate generic public ISMS landing on the PIT host.

---

## 4. Required downstream technical design

Before implementation, Architecture must define:

- route map for integrated and standalone entry;
- auth/entitlement/role guard ordering;
- account creation/sign-in handoff;
- onboarding data ownership;
- role hierarchy and permission matrix;
- entitlement source and evaluation contract;
- audit-event touchpoints;
- test harness / mock identity strategy for QA-to-Green.
