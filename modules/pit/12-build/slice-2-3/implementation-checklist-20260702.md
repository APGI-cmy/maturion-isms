# PIT Stage 12 Slice 2.3 Implementation Checklist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.3 - Entry Journey Implementation Governance Pack |
| Issue | #1896 |
| Date | 2026-07-02 |
| Status | IMPLEMENTATION CHECKLIST FILED - POST-MERGE TRACKER STEP RECONCILED |
| Runtime implementation | Not authorized by this artifact |

---

## 1. Purpose

This checklist defines the ordered work that a later builder implementation PR must follow.

It is not implementation evidence.

---

## 2. Pre-build gates before builder work

Before the builder changes runtime behavior, Foreman must confirm:

- [ ] Slice 2.3 scope declaration filed.
- [ ] IAA wave pre-brief recorded.
- [ ] Builder appointment and delegation evidence filed.
- [ ] Slice 2.2 QA-to-Green criteria available.
- [ ] Stage 12 tracker addendum merged.
- [ ] No unresolved pre-build conflict exists.

---

## 3. Builder implementation checklist

The later builder PR must address:

- [ ] PIT-branded standalone entry route or entry surface.
- [ ] Shared signup or sign-in path.
- [ ] Existing user sign-in route outcome.
- [ ] New user account creation route outcome.
- [ ] PIT subscription and entitlement selection behavior.
- [ ] PIT-only entitlement behavior.
- [ ] Full-bundle entitlement behavior.
- [ ] Authenticated but non-entitled route outcome.
- [ ] Entitled but unauthorized route outcome.
- [ ] Entitled and authorized route outcome.
- [ ] Role-aware navigation visibility.
- [ ] PIT onboarding or workspace setup behavior.
- [ ] Route guard order: authentication, entitlement, role permission.
- [ ] No duplicate generic ISMS public landing on PIT host.
- [ ] No disconnected PIT-only identity silo.
- [ ] Audit-event touchpoints or future-ready audit hooks for signup, entitlement, onboarding and role decisions.

---

## 4. QA-to-Green checklist

The later builder PR must provide evidence mapped to:

- [ ] `PIT-RED-ENTRY-001`
- [ ] `PIT-RED-ENTRY-002`
- [ ] `PIT-RED-ENTRY-003`
- [ ] `PIT-RED-ENTRY-004`
- [ ] `PIT-RED-ENTRY-005`
- [ ] `PIT-RED-ENTRY-006`
- [ ] `PIT-RED-ENTRY-007`
- [ ] `PIT-RED-ENTRY-008`
- [ ] `PIT-RED-ENTRY-009`
- [ ] `PIT-RED-ENTRY-010`
- [ ] `PIT-RED-ENTRY-011`
- [ ] `PIT-RED-ENTRY-012`
- [ ] `PIT-RED-ENTRY-013`
- [ ] `PIT-RED-ENTRY-014`
- [ ] `PIT-RED-ENTRY-015`
- [ ] `PIT-RED-ENTRY-016`
- [ ] `PIT-RED-ENTRY-017`
- [ ] `PIT-RED-ENTRY-018`
- [ ] `PIT-RED-ENTRY-019`
- [ ] `PIT-RED-ENTRY-020`

---

## 5. Post-builder sequence

After builder output, Foreman must perform QP review before ECAP or IAA final assurance.

The sequence remains:

```text
Builder builds to green
-> Foreman QP review
-> Update Stage 12 evidence tracker with slice-specific evidence and outstanding gaps
-> ECAP admin evidence compilation
-> IAA final assurance
-> CS2 merge decision
```

The Stage 12 tracker update for the merged Slice 2.3 implementation was completed later through PR #1921. This post-merge reconciliation records the missing sequence step without claiming that all formal browser evidence was completed.

---

## 6. Non-completion notice

This checklist does not claim that PIT Stage 12 is complete, that all Slice 2.3 browser evidence is complete, or that production readiness, release readiness or handover readiness has been achieved.
