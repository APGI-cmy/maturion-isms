# PIT Stage 12 Slice 2.2 Evidence Expectations

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution and Evidence |
| Slice | Slice 2.2 - Entry, Signup, Auth Implementation Planning |
| Issue | #1891 |
| Date | 2026-07-01 |
| Status | EVIDENCE EXPECTATIONS FILED |
| Runtime implementation | Not authorized by this artifact |

---

## 1. Purpose

This artifact defines the evidence that a later implementation slice must capture after deploying the entry/signup/auth implementation.

Slice 2.2 itself does not produce runtime evidence.

---

## 2. Required future browser evidence

The later implementation slice must capture evidence for:

| Evidence area | Required proof |
|---|---|
| Integrated ISMS entry | User reaches PIT from approved ISMS journey. |
| Standalone PIT entry | User reaches a PIT-branded entry surface under Maturion governance. |
| New user signup | New user sees and can progress through account creation route/state. |
| Existing user sign-in | Existing user can sign in and reach appropriate post-auth state. |
| PIT-only entitlement | PIT-only user can access PIT runtime without full ISMS bundle. |
| Full-bundle entitlement | Full-bundle user can access PIT runtime without separate PIT purchase. |
| Authenticated non-entitled state | User is routed to subscribe/entitlement, not runtime. |
| Entitled unauthorized state | User sees permission denied, not subscribe redirect. |
| Entitled authorized state | User reaches PIT runtime page. |
| Role-aware navigation | User does not see primary CTAs outside role permission. |
| PIT onboarding | Onboarding captures useful PIT workspace/module context or is intentionally merged into account setup. |
| Host boundary | PIT host does not render duplicate generic ISMS public landing. |
| Audit touchpoints | Signup, entitlement, onboarding and role changes have audit hook/design evidence. |

---

## 3. Screenshot / browser capture guidance

Each browser evidence item should record:

- URL;
- user state;
- entitlement state;
- role state;
- visible page title or route outcome;
- expected result;
- actual result;
- pass/hold/fail disposition.

---

## 4. Negative-path evidence

The later implementation slice must not rely only on happy-path evidence.

It must include negative path evidence for:

- signed-out user;
- signed-in but non-entitled user;
- entitled viewer/non-creator user;
- unsupported or invalid route state;
- PIT host boundary regression.

---

## 5. Tracker update expectation

After evidence is captured, the Stage 12 evidence tracker must be updated to show:

- Slice 2 implementation status;
- Slice 2.1 specification baseline status;
- Slice 2.2 planning status;
- later implementation evidence status;
- outstanding Stage 12 gaps.

---

## 6. Non-completion notice

Evidence for the later implementation slice must remain slice-specific. It must not claim full PIT completion, Stage 12 completion, production readiness or release readiness unless separately authorized and proven.
