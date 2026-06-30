# PIT Stage 12 Slice 2 QA-to-Green Criteria

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice | Slice 2 - Project Workspace Foundation |
| Issue | #1868 |
| Date | 2026-06-30 |
| Status | QA-TO-GREEN CRITERIA FILED |

---

## 1. Purpose

This artifact defines the minimum QA-to-Green criteria for Slice 2 implementation.

These criteria convert the Slice 2 scope into evidence requirements before implementation starts.

---

## 2. QA-to-Green table

| ID | Area | Criteria | Evidence required |
|---|---|---|---|
| PIT-S12S2-GREEN-001 | Entitled entry | Entitled dashboard Project Implementation Tracker opens `/pit/tracker`. | Browser screenshot and URL trace |
| PIT-S12S2-GREEN-002 | PIT hub | `/pit/tracker` renders a PIT workspace hub with a visible Project Register action/link. | Browser screenshot |
| PIT-S12S2-GREEN-003 | Project Register | `/projects` renders a PIT Project Register foundation, not a generic-only placeholder shell. | Browser screenshot |
| PIT-S12S2-GREEN-004 | Create Project positive path | `/projects/new` renders a PIT Create Project foundation for a permitted project creator role, not a generic-only placeholder shell. | Browser screenshot with creator-capable mock role |
| PIT-S12S2-GREEN-005 | Non-entitled route guard | Non-entitled direct access to runtime routes is blocked or routed predictably. | Incognito URL trace |
| PIT-S12S2-GREEN-006 | Host boundary | `maturion-pit.vercel.app` continues redirecting to canonical ISMS host. | Browser URL trace |
| PIT-S12S2-GREEN-007 | No cross-module regression | Public landing, subscription, auth, onboarding, dashboard entitlement, and module card behavior are not changed. | Diff review and smoke evidence |
| PIT-S12S2-GREEN-008 | Role guards | Admin and QA route protections remain unchanged. | Role matrix or targeted route screenshots |
| PIT-S12S2-GREEN-009 | Scope honesty | UI does not claim persistence, full CRUD, reports, audit, AI, or production readiness unless implemented. | Text review and screenshots |
| PIT-S12S2-GREEN-010 | Build/test | CI, route registry, and relevant app tests pass. | GitHub checks |
| PIT-S12S2-GREEN-011 | Create Project denied path | `/projects/new` preserves the existing creator-only guard: viewer/non-creator actors must see the denied state and unauthenticated users must not reach the create surface. | Viewer/non-creator denied screenshot plus unauthenticated redirect/denied URL trace |

---

## 3. Minimum production evidence pack

After implementation and deployment, the evidence pack must include:

1. canonical host dashboard to `/pit/tracker` journey;
2. `/pit/tracker` PIT workspace hub screenshot;
3. `/projects` Project Register foundation screenshot;
4. `/projects/new` Create Project foundation screenshot for a creator-capable role;
5. `/projects/new` viewer/non-creator denied evidence;
6. `/projects/new` unauthenticated redirect or denied evidence;
7. incognito direct-route negative evidence;
8. PIT host redirect evidence;
9. statement that no ISMS-owned surfaces were changed unless explicitly authorized;
10. final QP/IAA/CS2 disposition for Slice 2.

---

## 4. Non-completion notice

Passing Slice 2 QA-to-Green does not equal full PIT completion, full Stage 12 completion, production readiness, release readiness, functional pass, or handover completion.
