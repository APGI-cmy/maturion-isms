# PIT Stage 12 Slice 2 Implementation Checklist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Issue | #1868 |
| Date | 2026-06-30 |
| Status | IMPLEMENTATION CHECKLIST FILED - BUILD NOT STARTED |

---

## 1. Purpose

This checklist defines the minimum implementation controls for the Slice 2 builder PR.

It is not an implementation artifact and does not authorize coding until the governance pack is accepted.

---

## 2. Pre-implementation checklist

- [ ] Scope declaration read and acknowledged.
- [ ] IAA pre-brief contract read and acknowledged.
- [ ] Builder reconfirmation read and acknowledged.
- [ ] QA-to-Green criteria read and acknowledged.
- [ ] Issue #1868 linked in the implementation PR.
- [ ] Implementation PR states whether any data persistence is included. Default is no persistence.
- [ ] Implementation PR states that ISMS-owned public/acquisition surfaces are out of scope.

---

## 3. Implementation checklist

- [ ] `/pit/tracker` remains protected and reachable for entitled users.
- [ ] `/pit/tracker` provides a visible Project Register/workspace action.
- [ ] `/projects` renders a PIT Project Register foundation.
- [ ] `/projects/new` renders a PIT Create Project foundation.
- [ ] The implemented UI avoids unsupported claims about persistence, full CRUD, audit, reporting, AI, or production readiness.
- [ ] Non-entitled route behavior is preserved.
- [ ] PIT deployment host redirect behavior is preserved.
- [ ] Admin and QA route guards are not weakened.
- [ ] Tests/build checks pass.
- [ ] Browser evidence is captured after deployment.

---

## 4. Prohibited scope

The builder must not perform these actions in Slice 2:

- Change ISMS public landing, `/modules`, marketing, subscription, checkout, auth, onboarding, dashboard, or entitlement handoff.
- Add Supabase schema or RLS changes without a separate approved data scope.
- Add production billing/payment behavior.
- Alter MMM, Risk Management, RADAM, or other module runtime behavior.
- Claim full PIT completion, full Stage 12 completion, production readiness, release readiness, functional pass, or handover completion.

---

## 5. Evidence checklist

The implementation PR must include or link evidence for:

- [ ] `/pit/tracker` browser rendering;
- [ ] `/projects` browser rendering;
- [ ] `/projects/new` browser rendering;
- [ ] non-entitled direct-route behavior;
- [ ] PIT host redirect preservation;
- [ ] CI/build/test results;
- [ ] QP/IAA/CS2 final Slice 2 disposition.

---

## 6. Disposition

```text
Slice 2 implementation checklist is ready for builder use after governance-pack acceptance.
```
