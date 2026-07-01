# PIT FRS Addendum - Entry, Signup, Auth and Standalone Journey

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Stage 3 FRS addendum |
| Slice | Stage 12 Slice 2.1 |
| Issue | #1882 |
| Date | 2026-06-30 |
| Status | ADDENDUM - PENDING REVIEW |
| Derived from | App Description and UX/Wiring Slice 2.1 addenda |

---

## 1. Purpose

This addendum defines functional requirements for PIT integrated and standalone entry, signup, authentication, entitlement, onboarding and role handling.

---

## 2. Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| PIT-FR-124 | PIT must support integrated ISMS module entry. | User can enter PIT through ISMS module/subscription/dashboard path without duplicate identity. |
| PIT-FR-125 | PIT must support standalone module entry under the Maturion umbrella. | User can start from a PIT-branded entry journey while identity, entitlement, subscription and audit remain Maturion-governed. |
| PIT-FR-126 | PIT must support signup/account creation for new standalone or integrated users. | A new user can reach a clear signup/auth step before protected runtime access. |
| PIT-FR-127 | PIT must support sign-in for existing Maturion users. | Existing users can sign in and regain PIT access based on entitlement and role. |
| PIT-FR-128 | PIT must support PIT-only entitlement. | User can be entitled to PIT without full ISMS bundle entitlement. |
| PIT-FR-129 | PIT must support full-bundle entitlement. | Full-bundle users can access PIT without separate PIT purchase. |
| PIT-FR-130 | PIT must distinguish account identity from module entitlement. | Authenticated but non-entitled users are routed to subscribe/entitlement, not runtime. |
| PIT-FR-131 | PIT must distinguish entitlement from role permission. | Entitled users lacking route permission see a permission-denied state, not subscription. |
| PIT-FR-132 | PIT must support PIT role families. | Project manager, milestone manager, deliverable manager, task manager, evidence contributor, reviewer/approver, viewer, auditor, PIT admin, org owner and CS2 roles are functionally distinguishable. |
| PIT-FR-133 | PIT navigation must hide unavailable actions by role. | Users do not see primary CTAs for actions they cannot perform, except where a deliberate permission explanation is required. |
| PIT-FR-134 | PIT onboarding must capture useful context. | Onboarding captures organisation/module context, role or workspace setup information that is needed for later PIT operation, or is combined into signup/account setup. |
| PIT-FR-135 | PIT standalone branding must not duplicate generic ISMS public landing. | PIT standalone entry is PIT-branded and clearly governed by Maturion; it does not render a generic ISMS copy. |
| PIT-FR-136 | Runtime route guards must follow auth -> entitlement -> role order. | Unauthenticated users go to sign in, authenticated non-entitled users go to subscribe, entitled unauthorized users see permission denied. |
| PIT-FR-137 | PIT must preserve auditability of signup, entitlement and role transitions. | Later implementation must allow traceable records or event hooks for signup, entitlement grant, role assignment and onboarding completion. |

---

## 3. Non-functional functional constraints

- No separate PIT-only identity silo.
- No duplicate generic ISMS public landing on PIT host.
- No runtime access before authentication and entitlement.
- No role-only denial before authentication is established.
- No project management role model may be collapsed into a single generic user role.

---

## 4. Downstream propagation

TRS, Architecture, QA-to-Red, implementation plan and builder instructions must derive from these requirements before runtime implementation.
