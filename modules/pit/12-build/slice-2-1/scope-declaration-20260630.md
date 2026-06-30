# PIT Stage 12 Slice 2.1 Scope Declaration

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.1 - Entry, Signup, Auth and Standalone Journey Specification |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | SCOPE CONFIRMED - SPECIFICATION ONLY |
| Classification | PIT pre-build update / journey clarification |
| Runtime implementation | PROHIBITED IN THIS SLICE |

---

## 1. Trigger

Slice 2 runtime evidence confirmed that the workspace foundation renders, but it exposed an under-specified journey question:

- PIT always sits under the Maturion ISMS umbrella;
- users may still choose PIT as a standalone subscribed app;
- standalone use requires signup/auth/account creation and PIT-specific role assignment;
- the current onboarding-only handoff is too thin to explain or support the future dual-mode journey.

---

## 2. Scope decision

Slice 2.1 is opened as a governance/design slice to update pre-build artifacts before any further runtime build.

This slice must define the integrated and standalone PIT entry, signup, auth, subscription, entitlement, onboarding, and role journey.

---

## 3. Product rule

PIT supports two valid use modes:

1. **Integrated ISMS module mode**
   - User enters through the ISMS platform.
   - Subscription, signup/auth, onboarding, dashboard entitlement, and PIT runtime are handled by the ISMS umbrella journey.

2. **Standalone PIT app mode**
   - User may enter through a PIT-branded module entry journey.
   - Signup/auth and subscription are still governed by Maturion identity, entitlement, audit, and subscription rules.
   - PIT may be used without purchasing the full ISMS bundle.

Standalone does not mean outside governance. It means module-specific entry under shared Maturion platform controls.

---

## 4. In scope

Slice 2.1 may update or add specification artifacts for:

- App Description clarification;
- UX Workflow & Wiring clarification;
- FRS addendum;
- TRS addendum;
- Architecture addendum;
- QA-to-Red baseline for entry/auth/standalone journeys;
- traceability matrix;
- IAA pre-brief contract;
- builder hold / no-build notice;
- evidence expectations for a later implementation slice.

---

## 5. Out of scope

Slice 2.1 must not implement:

- runtime UI changes;
- production auth provider integration;
- production billing provider integration;
- Supabase schema/RLS changes;
- PIT role administration runtime;
- account invitation runtime;
- route redirects or host policy changes;
- PIT completion or Stage 12 completion claims.

---

## 6. Acceptance criteria

Slice 2.1 is accepted only when:

- the dual integrated/standalone journey is specified;
- signup/auth/account creation expectations are clear;
- PIT role hierarchy is defined at foundation level;
- entitlement model supports PIT-only and full-bundle users;
- host and route boundary rules are explicit;
- QA-to-Red tests exist before implementation;
- implementation remains blocked until a subsequent governed build slice.

---

## 7. Disposition

```text
Slice 2.1 is a specification/governance slice only.
No runtime implementation is authorized by this artifact.
```
