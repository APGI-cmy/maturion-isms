# PIT Slice 2.1 QA-to-Red Baseline - Entry, Signup, Auth and Standalone Journey

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Stage 6 QA-to-Red addendum |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | QA-TO-RED BASELINE FILED |
| Runtime implementation | PROHIBITED IN THIS PR |

---

## 1. Purpose

This RED baseline defines failing expectations before any implementation of the PIT dual integrated/standalone entry, signup, authentication, onboarding, entitlement and role journey.

These tests are specification-level RED tests. They must be converted to QA-to-Green evidence in a later implementation slice.

---

## 2. RED tests

| RED ID | Requirement source | RED expectation |
|---|---|---|
| PIT-RED-ENTRY-001 | PIT-FR-124 | Integrated ISMS user can reach PIT through ISMS landing/module/subscription/signup/onboarding/dashboard path. |
| PIT-RED-ENTRY-002 | PIT-FR-125 | Standalone PIT user can start from a PIT-branded entry journey under Maturion governance. |
| PIT-RED-ENTRY-003 | PIT-FR-126 | New user sees a clear signup/account creation step before protected PIT runtime access. |
| PIT-RED-ENTRY-004 | PIT-FR-127 | Existing Maturion user can sign in and recover PIT access based on entitlement and role. |
| PIT-RED-ENTRY-005 | PIT-FR-128 | PIT-only entitlement gives access to PIT without full ISMS bundle entitlement. |
| PIT-RED-ENTRY-006 | PIT-FR-129 | Full-bundle entitlement gives access to PIT without separate PIT purchase. |
| PIT-RED-ENTRY-007 | PIT-FR-130 | Authenticated non-entitled user is routed to subscribe/entitlement selection, not runtime. |
| PIT-RED-ENTRY-008 | PIT-FR-131 | Entitled unauthorized user sees permission denied, not subscription. |
| PIT-RED-ENTRY-009 | PIT-FR-132 | PIT role families are distinguishable in route and navigation behavior. |
| PIT-RED-ENTRY-010 | PIT-FR-133 | Primary CTAs are hidden when the user's role cannot perform the action. |
| PIT-RED-ENTRY-011 | PIT-FR-134 | PIT onboarding captures useful module/workspace context or is intentionally combined with account setup. |
| PIT-RED-ENTRY-012 | PIT-FR-135 | PIT standalone entry does not render duplicate generic ISMS landing. |
| PIT-RED-ENTRY-013 | PIT-FR-136 | Route guard order is auth -> entitlement -> role. |
| PIT-RED-ENTRY-014 | PIT-FR-137 | Signup, entitlement, onboarding and role changes have defined audit-event touchpoints. |
| PIT-RED-ENTRY-015 | UX addendum | PIT-branded entry screen has default, signed-in, signed-out, no-entitlement and error states. |
| PIT-RED-ENTRY-016 | UX addendum | Sign in/create account screen has default, validation error, pending, success and failure states. |
| PIT-RED-ENTRY-017 | UX addendum | PIT onboarding has default, incomplete, complete, validation error and failure states. |
| PIT-RED-ENTRY-018 | Architecture addendum | PIT host can be routed to PIT-branded entry without becoming duplicate generic ISMS public landing. |
| PIT-RED-ENTRY-019 | Architecture addendum | Entitlement evaluation supports PIT-only, bundle and future selected-module combinations. |
| PIT-RED-ENTRY-020 | Architecture addendum | Project manager, milestone manager, deliverable manager and task manager role families are represented in the route/permission model. |

---

## 3. Required future QA-to-Green evidence

A later implementation slice must provide:

- screenshots or browser traces for integrated entry;
- screenshots or browser traces for standalone PIT entry;
- signup/auth flow evidence;
- PIT-only entitlement evidence;
- full-bundle entitlement evidence;
- unauthenticated direct-route evidence;
- authenticated/non-entitled evidence;
- entitled/unauthorized role evidence;
- entitled/authorized role evidence;
- role-aware navigation evidence;
- onboarding usefulness evidence;
- host-boundary regression evidence;
- audit-event design or implementation evidence.

---

## 4. Non-completion notice

Passing these future tests will not by itself close full PIT Stage 12. It will only satisfy the Slice 2.1 entry/auth/standalone journey baseline.
