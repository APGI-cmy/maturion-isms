# PIT Stage 12 Slice 2.2 QA-to-Green Criteria

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.2 - Entry, Signup, Auth Implementation Planning |
| Issue | #1891 |
| Date | 2026-07-01 |
| Status | QA-TO-GREEN CRITERIA FILED |
| Runtime implementation | Not authorized by this artifact |

---

## 1. Purpose

This artifact maps the Slice 2.1 RED baseline to future QA-to-Green evidence expectations.

The criteria below are not passing evidence. They define what a later implementation slice must prove.

---

## 2. QA-to-Green matrix

| RED ID | Future GREEN criterion |
|---|---|
| PIT-RED-ENTRY-001 | Integrated ISMS user can reach PIT through the approved ISMS landing/module/subscription/signup/onboarding/dashboard path. |
| PIT-RED-ENTRY-002 | Standalone user can start from a PIT-branded entry journey under Maturion governance. |
| PIT-RED-ENTRY-003 | New user sees a clear signup/account creation path before protected PIT runtime access. |
| PIT-RED-ENTRY-004 | Existing Maturion user can sign in and regain PIT access based on entitlement and role. |
| PIT-RED-ENTRY-005 | PIT-only entitlement grants PIT access without requiring full ISMS bundle entitlement. |
| PIT-RED-ENTRY-006 | Full-bundle entitlement grants PIT access without requiring a separate PIT purchase. |
| PIT-RED-ENTRY-007 | Authenticated non-entitled user is routed to subscribe or entitlement selection, not runtime. |
| PIT-RED-ENTRY-008 | Entitled unauthorized user receives permission denied, not subscription redirect. |
| PIT-RED-ENTRY-009 | PIT role families are distinguishable in route and navigation behavior. |
| PIT-RED-ENTRY-010 | Primary CTAs are hidden when the user's role cannot perform the action. |
| PIT-RED-ENTRY-011 | PIT onboarding captures useful PIT workspace/module context or is intentionally combined with account setup. |
| PIT-RED-ENTRY-012 | PIT standalone entry does not render a duplicate generic ISMS landing page. |
| PIT-RED-ENTRY-013 | Runtime route guard order is authentication, then entitlement, then role permission. |
| PIT-RED-ENTRY-014 | Signup, entitlement, onboarding and role changes have defined audit-event touchpoints or future-ready hooks. |
| PIT-RED-ENTRY-015 | PIT-branded entry screen has default, signed-in, signed-out, no-entitlement and error states. |
| PIT-RED-ENTRY-016 | Sign in/create account screen has default, validation error, pending, success and failure states. |
| PIT-RED-ENTRY-017 | PIT onboarding has default, incomplete, complete, validation error and failure states. |
| PIT-RED-ENTRY-018 | PIT host can be routed to PIT-branded entry without becoming a duplicate generic ISMS public landing. |
| PIT-RED-ENTRY-019 | Entitlement evaluation supports PIT-only, bundle and future selected-module combinations. |
| PIT-RED-ENTRY-020 | Project manager, milestone manager, deliverable manager and task manager role families are represented in the route/permission model. |

---

## 3. Minimum future evidence set

A later implementation PR must provide:

- browser evidence for integrated ISMS entry;
- browser evidence for standalone PIT entry;
- signup/account creation evidence;
- existing sign-in evidence;
- PIT-only entitlement evidence;
- full-bundle entitlement evidence;
- unauthenticated direct-route evidence for a protected PIT route, proving authentication is evaluated before entitlement and role permission;
- authenticated but non-entitled evidence;
- entitled but unauthorized evidence;
- entitled and authorized evidence;
- role-aware navigation evidence;
- onboarding evidence;
- host-boundary evidence;
- audit hook or audit-event design evidence.

---

## 4. Non-completion notice

These criteria do not claim that the future implementation has passed. They define the evidence required for a later implementation slice.
