# PIT Stage 12 Slice 2.3 Implementation Evidence - pit-specialist

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2.3 - Entry Journey Implementation |
| Issue | #1896 |
| Date | 2026-07-07 |
| Status | BUILDER IMPLEMENTATION EVIDENCE FILED |
| Appointed builder | `pit-specialist` |
| Runtime implementation | Partial implementation committed |

---

## 1. Builder return summary

`pit-specialist` added Slice 2.3 implementation work to the existing PR #1910 branch.

Implemented in this package:

- role-aware PIT workspace navigation;
- project creation CTA hidden for viewer role;
- role state exposed for browser evidence capture;
- direct route denial remains enforced at `/projects/new` by the existing role route guard;
- non-completion controls preserved.

---

## 2. Runtime files changed

| File | Purpose |
|---|---|
| `apps/isms-portal/src/pages/pit/PitWorkspaceHub.tsx` | Adds role-aware navigation and visible role-state evidence for PIT workspace users. |

---

## 3. QA mapping

| RED/GREEN item | Evidence |
|---|---|
| PIT-RED-ENTRY-001 | Integrated ISMS PIT runtime still enters `/pit/tracker` for authenticated and entitled users. |
| PIT-RED-ENTRY-004 | Existing signed-in users retain role-aware workspace outcomes. |
| PIT-RED-ENTRY-008 | Entitled but unauthorized users are prevented from direct project creation by existing `/projects/new` role guard. |
| PIT-RED-ENTRY-009 | Workspace exposes the active mock role for route/navigation evidence. |
| PIT-RED-ENTRY-010 | Create Project CTA is hidden for viewer role and visible for permitted project roles. |
| PIT-RED-ENTRY-013 | Existing route stack keeps authentication before entitlement before role permission. |
| PIT-RED-ENTRY-020 | Project manager, contributor, team leader, org admin and CS2 admin are recognized as creator-capable roles. |

---

## 4. Browser evidence expectations after deployment

Capture the following against the PR preview:

| Evidence ID | State | Route | Expected result |
|---|---|---|---|
| PIT-S23-BR-001 | Signed out | `/pit/tracker` | Redirect to sign-in with original route preserved. |
| PIT-S23-BR-002 | Signed in without PIT entitlement | `/pit/tracker` | Redirect to module selection with PIT module requested. |
| PIT-S23-BR-003 | Signed in with PIT-only entitlement and viewer role | `/pit/tracker` | Workspace visible; Create Project CTA hidden. |
| PIT-S23-BR-004 | Signed in with PIT-only entitlement and project manager role | `/pit/tracker` | Workspace visible; Create Project CTA visible. |
| PIT-S23-BR-005 | Signed in with bundle entitlement | `/pit/tracker` | Workspace visible. |
| PIT-S23-BR-006 | Viewer direct access | `/projects/new` | Permission denied route outcome. |

---

## 5. Disclosure

This implementation does not add provider-backed authentication, billing provider integration, database persistence, Supabase RLS, full project lifecycle, production role administration, or Stage 12 closure.

The standalone PIT public entry page remains governed future work unless CS2 directs this PR to expand beyond the currently accepted low-risk runtime change.

---

## 6. Non-completion notice

This evidence package does not claim full PIT completion, Stage 12 completion, production readiness, release readiness, functional pass, or handover completion.
