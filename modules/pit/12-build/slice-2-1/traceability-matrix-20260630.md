# PIT Stage 12 Slice 2.1 Traceability Matrix

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Slice | Stage 12 Slice 2.1 - Entry, Signup, Auth and Standalone Journey Specification |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | TRACEABILITY MATRIX FILED |
| Runtime implementation | Not authorized by this artifact |

---

## 1. Purpose

This matrix links the Slice 2.1 product clarification to the updated pre-build artifacts and the new QA-to-Red baseline.

Slice 2.1 confirms that PIT must support both integrated ISMS module use and standalone PIT app use under the Maturion ISMS umbrella.

Standalone PIT use requires signup, authentication, account handling, entitlement and role assignment, while remaining governed by shared Maturion identity, subscription, entitlement, role, audit and host-boundary controls.

---

## 2. Artifact Chain

| Sequence | Artifact |
|---|---|
| 1 | App Description addendum |
| 2 | UX and wiring addendum |
| 3 | FRS addendum |
| 4 | TRS addendum |
| 5 | Architecture addendum |
| 6 | QA-to-Red baseline |

---

## 3. Traceability Matrix

| Product concern | App Description addendum | UX / Wiring addendum | FRS requirement IDs | TRS requirement IDs | Architecture coverage | QA-to-Red IDs |
|---|---|---|---|---|---|---|
| Integrated ISMS PIT journey | Integrated ISMS module mode | Integrated ISMS entry | PIT-FR-124 | PIT-TR-127, PIT-TR-128 | Integrated journey architecture | PIT-RED-ENTRY-001 |
| Standalone PIT journey | Standalone PIT app mode | Standalone PIT entry | PIT-FR-125 | PIT-TR-130 | Standalone journey architecture and host boundary | PIT-RED-ENTRY-002, PIT-RED-ENTRY-012, PIT-RED-ENTRY-018 |
| Shared Maturion account model | Identity rule | Sign in and create account screen | PIT-FR-126, PIT-FR-127 | PIT-TR-128, PIT-TR-131 | Shared identity and guard stack | PIT-RED-ENTRY-003, PIT-RED-ENTRY-004, PIT-RED-ENTRY-016 |
| New user signup and account creation | Identity rule | Sign in and create account screen states | PIT-FR-126 | PIT-TR-131 | Authentication entry architecture | PIT-RED-ENTRY-003, PIT-RED-ENTRY-016 |
| Existing user sign-in | Identity rule | Existing account journey | PIT-FR-127 | PIT-TR-131 | Authentication entry architecture | PIT-RED-ENTRY-004 |
| PIT-only entitlement | Identity and entitlement rule | Subscription and entitlement selection | PIT-FR-128 | PIT-TR-129 | Entitlement architecture foundation | PIT-RED-ENTRY-005, PIT-RED-ENTRY-019 |
| Full bundle entitlement | Identity and entitlement rule | Subscription and entitlement selection | PIT-FR-129 | PIT-TR-129 | Entitlement architecture foundation | PIT-RED-ENTRY-006, PIT-RED-ENTRY-019 |
| Authenticated but non-entitled user | Boundary rule | Route and wiring rules | PIT-FR-130 | PIT-TR-127, PIT-TR-135 | Guard stack | PIT-RED-ENTRY-007, PIT-RED-ENTRY-013 |
| Entitled but unauthorized user | Boundary rule | Permission-denied route behavior | PIT-FR-131 | PIT-TR-127, PIT-TR-135 | Guard stack and permission handling | PIT-RED-ENTRY-008, PIT-RED-ENTRY-013 |
| Guard ordering | Boundary rule | Route and wiring rules | PIT-FR-136 | PIT-TR-127, PIT-TR-135 | Authentication, entitlement and role ordering | PIT-RED-ENTRY-013 |
| PIT role hierarchy | Future role model foundation | Role UX expectations | PIT-FR-132 | PIT-TR-133 | Role architecture foundation | PIT-RED-ENTRY-009, PIT-RED-ENTRY-020 |
| Project manager role family | Future role model foundation | Role UX expectations | PIT-FR-132, PIT-FR-133 | PIT-TR-133, PIT-TR-134 | Role architecture foundation | PIT-RED-ENTRY-009, PIT-RED-ENTRY-010, PIT-RED-ENTRY-020 |
| Milestone manager role family | Future role model foundation | Role UX expectations | PIT-FR-132, PIT-FR-133 | PIT-TR-133, PIT-TR-134 | Role architecture foundation | PIT-RED-ENTRY-009, PIT-RED-ENTRY-010, PIT-RED-ENTRY-020 |
| Deliverable manager role family | Future role model foundation | Role UX expectations | PIT-FR-132, PIT-FR-133 | PIT-TR-133, PIT-TR-134 | Role architecture foundation | PIT-RED-ENTRY-009, PIT-RED-ENTRY-010, PIT-RED-ENTRY-020 |
| Task manager and task owner role family | Future role model foundation | Role UX expectations | PIT-FR-132, PIT-FR-133 | PIT-TR-133, PIT-TR-134 | Role architecture foundation | PIT-RED-ENTRY-009, PIT-RED-ENTRY-010, PIT-RED-ENTRY-020 |
| Role-aware navigation | Boundary and role rule | Role UX expectations | PIT-FR-133 | PIT-TR-134 | Navigation and permission architecture | PIT-RED-ENTRY-010 |
| PIT onboarding usefulness | Downstream propagation | Onboarding rule | PIT-FR-134 | PIT-TR-132 | Journey architecture and onboarding data ownership | PIT-RED-ENTRY-011, PIT-RED-ENTRY-017 |
| PIT branded entry screen states | Boundary rule | PIT branded entry states | PIT-FR-125, PIT-FR-135 | PIT-TR-130 | Host boundary and standalone entry | PIT-RED-ENTRY-015, PIT-RED-ENTRY-018 |
| Host boundary | Boundary rule | Route and wiring rules | PIT-FR-135 | PIT-TR-130 | Host boundary | PIT-RED-ENTRY-012, PIT-RED-ENTRY-018 |
| Audit touchpoints | Boundary and auditability rule | Route and wiring rules | PIT-FR-137 | PIT-TR-136 | Audit architecture foundation | PIT-RED-ENTRY-014 |

---

## 4. RED Baseline Coverage

The Slice 2.1 QA-to-Red baseline covers PIT-RED-ENTRY-001 through PIT-RED-ENTRY-020.

These RED rows cover integrated ISMS entry, standalone PIT branded entry, signup and account creation, existing user sign-in, PIT-only entitlement, full-bundle entitlement, authentication before entitlement before role, role family separation, role-aware navigation, onboarding usefulness, PIT host boundary and audit touchpoints.

---

## 5. Build Control

This matrix does not authorize implementation.

No runtime build may begin until the Slice 2.1 specification pack is reviewed and accepted, the QA-to-Red baseline is accepted, QA-to-Green criteria are derived, the builder is reconfirmed or reappointed, and a later implementation slice is opened.

---

## 6. Non-Completion Notice

This matrix does not claim PIT completion, Slice 2.1 build completion, Stage 12 completion, production readiness, release readiness, functional pass or handover completion.
