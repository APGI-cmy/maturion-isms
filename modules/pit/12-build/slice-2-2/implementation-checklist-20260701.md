# PIT Stage 12 Slice 2.2 Implementation Checklist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution and Evidence |
| Slice | Slice 2.2 - Entry, Signup, Auth Implementation Planning |
| Issue | #1891 |
| Date | 2026-07-01 |
| Status | IMPLEMENTATION CHECKLIST FILED |
| Runtime implementation | Not authorized by this artifact |

---

## 1. Purpose

This checklist defines the controlled implementation sequence for the future build slice that follows Slice 2.2.

---

## 2. Pre-implementation controls

Before runtime implementation begins, the future implementation slice must confirm:

- Slice 2.1 specification baseline merged;
- Slice 2.2 planning/control pack merged;
- builder reconfirmed or reappointed;
- QA-to-Green criteria accepted;
- no unresolved blocker comments in the planning PR;
- implementation scope frozen;
- non-scope explicitly carried into the implementation PR.

---

## 3. Implementation sequence for later build slice

The later implementation slice should proceed in this order:

1. Confirm route map and host boundary.
2. Implement or refine PIT-branded standalone entry.
3. Implement or refine shared signup/auth or sign-in path using the approved mock/production boundary.
4. Implement or refine PIT subscription/entitlement selection behavior.
5. Implement or refine PIT-specific onboarding/workspace setup behavior.
6. Enforce authentication before entitlement before role permission.
7. Enforce PIT-only and full-bundle entitlement behavior.
8. Enforce role-aware navigation and route outcomes.
9. Add or update tests mapped to PIT-RED-ENTRY-001 through PIT-RED-ENTRY-020.
10. Deploy preview environment.
11. Capture browser evidence.
12. Update Stage 12 evidence tracker with slice-specific evidence only.

---

## 4. Negative controls

The future implementation slice must not:

- claim full PIT completion;
- claim full Stage 12 completion;
- implement unrelated project CRUD;
- alter unrelated MMM/Risk/RADAM modules;
- create a PIT-only identity silo;
- duplicate the generic ISMS public landing page on the PIT host;
- bypass the auth -> entitlement -> role guard order.

---

## 5. Exit criteria for later implementation slice

The later implementation slice may be considered for merge only when:

- checks are green;
- browser evidence is captured;
- QA-to-Green rows are addressed;
- role and entitlement negative paths are proven;
- host boundary is preserved;
- Stage 12 evidence tracker is updated;
- no P0/P1 functional gaps remain for the slice.
