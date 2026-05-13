# PIT — Architecture-to-RED Traceability

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Architecture-to-RED Traceability |
| Version | v1.0 |
| Source | `modules/pit/04-architecture/architecture.md` v1.0 |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |

---

## 1. Routes (27 Routes — All Covered)

| Route | Component | RED Test ID(s) | Status |
|---|---|---|---|
| `/` | LandingPage | PIT-RED-ROUTE-001 | RED_TEST_DEFINED |
| `/login` | LoginPage | PIT-RED-ROUTE-002, PIT-RED-AUTH-001 | RED_TEST_DEFINED |
| `/signup` | SignupPage | PIT-RED-ROUTE-003, PIT-RED-AUTH-004 | RED_TEST_DEFINED |
| `/forgot-password` | ForgotPasswordPage | PIT-RED-ROUTE-004, PIT-RED-AUTH-009 | RED_TEST_DEFINED |
| `/reset-password` | ResetPasswordPage | PIT-RED-ROUTE-005, PIT-RED-AUTH-010 | RED_TEST_DEFINED |
| `/invite/:token` | InviteAcceptPage | PIT-RED-ROUTE-006, PIT-RED-AUTH-006 | RED_TEST_DEFINED |
| `/dashboard` | DashboardPage (Portfolio) | PIT-RED-ROUTE-007, PIT-RED-AUTH-011 | RED_TEST_DEFINED |
| `/projects` | ProjectsPage | PIT-RED-ROUTE-008 | RED_TEST_DEFINED |
| `/projects/new` | NewProjectPage | PIT-RED-ROUTE-009, PIT-RED-PROJECT-001 | RED_TEST_DEFINED |
| `/projects/:id` | ProjectDetailPage (Implementation Page) | PIT-RED-ROUTE-010, PIT-RED-PROJECT-007 | RED_TEST_DEFINED |
| `/projects/:id/timeline` | TimelinePage | PIT-RED-ROUTE-011, PIT-RED-TIMELINE-001 | RED_TEST_DEFINED |
| `/projects/:id/milestones` | MilestonesPage | PIT-RED-ROUTE-012, PIT-RED-PROJECT-003 | RED_TEST_DEFINED |
| `/projects/:id/deliverables` | DeliverablesPage | PIT-RED-ROUTE-013, PIT-RED-PROJECT-005 | RED_TEST_DEFINED |
| `/projects/:id/tasks` | TasksPage | PIT-RED-ROUTE-014, PIT-RED-PROJECT-006 | RED_TEST_DEFINED |
| `/projects/:id/evidence` | EvidencePage | PIT-RED-ROUTE-015, PIT-RED-EVIDENCE-001 | RED_TEST_DEFINED |
| `/projects/:id/reports` | ReportsPage | PIT-RED-ROUTE-016, PIT-RED-REPORT-001 | RED_TEST_DEFINED |
| `/projects/:id/settings` | ProjectSettingsPage | PIT-RED-ROUTE-017 | RED_TEST_DEFINED |
| `/my-work` | MyWorkPage | PIT-RED-ROUTE-018 | RED_TEST_DEFINED |
| `/notifications` | NotificationsPage | PIT-RED-ROUTE-019, PIT-RED-NOTIFICATION-004 | RED_TEST_DEFINED |
| `/profile` | ProfilePage | PIT-RED-ROUTE-020 | RED_TEST_DEFINED |
| `/onboarding` | OnboardingPage | PIT-RED-ROUTE-021, PIT-RED-AUTH-014 | RED_TEST_DEFINED |
| `/admin/org` | OrgAdminPage | PIT-RED-ROUTE-022 | RED_TEST_DEFINED |
| `/admin/users` | UserManagementPage | PIT-RED-ROUTE-023 | RED_TEST_DEFINED |
| `/admin/settings` | OrgSettingsPage | PIT-RED-ROUTE-024 | RED_TEST_DEFINED |
| `/admin/audit-log` | AuditLogPage | PIT-RED-ROUTE-025, PIT-RED-AUDIT-001 | RED_TEST_DEFINED |
| `/qa-dashboard` | QaDashboardPage | PIT-RED-ROUTE-026, PIT-RED-QA-001 | RED_TEST_DEFINED |
| `*` (404) | NotFoundPage | PIT-RED-ROUTE-027 | RED_TEST_DEFINED |

**Route coverage: 27/27 — COMPLETE**

---

## 2. Screens (22 Screens — All Covered)

| Screen | Primary Route | RED Test ID(s) | Five-State Tests | Status |
|---|---|---|---|---|
| Landing Page | `/` | PIT-RED-ROUTE-001 | N/A (public, no auth states) | RED_TEST_DEFINED |
| Login | `/login` | PIT-RED-AUTH-001, PIT-RED-AUTH-002 | N/A (auth screen) | RED_TEST_DEFINED |
| Signup | `/signup` | PIT-RED-AUTH-004, PIT-RED-AUTH-005 | N/A | RED_TEST_DEFINED |
| Forgot Password | `/forgot-password` | PIT-RED-AUTH-009 | N/A | RED_TEST_DEFINED |
| Reset Password | `/reset-password` | PIT-RED-AUTH-010 | N/A | RED_TEST_DEFINED |
| Invite Acceptance | `/invite/:token` | PIT-RED-AUTH-006, PIT-RED-AUTH-007 | N/A | RED_TEST_DEFINED |
| Onboarding | `/onboarding` | PIT-RED-AUTH-014 | N/A | RED_TEST_DEFINED |
| Portfolio Dashboard | `/dashboard` | PIT-RED-ROUTE-007 | route-screen-state-red-matrix.md Row 7 | RED_TEST_DEFINED |
| Projects List | `/projects` | PIT-RED-ROUTE-008 | route-screen-state-red-matrix.md Row 8 | RED_TEST_DEFINED |
| New Project | `/projects/new` | PIT-RED-PROJECT-001 | route-screen-state-red-matrix.md Row 9 | RED_TEST_DEFINED |
| Project Detail (Implementation) | `/projects/:id` | PIT-RED-ROUTE-010 | route-screen-state-red-matrix.md Row 10 | RED_TEST_DEFINED |
| Timeline/Gantt | `/projects/:id/timeline` | PIT-RED-TIMELINE-001 | route-screen-state-red-matrix.md Row 11 | RED_TEST_DEFINED |
| Evidence | `/projects/:id/evidence` | PIT-RED-EVIDENCE-001 | route-screen-state-red-matrix.md Row 15 | RED_TEST_DEFINED |
| Reports | `/projects/:id/reports` | PIT-RED-REPORT-001 | route-screen-state-red-matrix.md Row 16 | RED_TEST_DEFINED |
| My Work | `/my-work` | PIT-RED-ROUTE-018 | route-screen-state-red-matrix.md Row 18 | RED_TEST_DEFINED |
| Notification History | `/notifications` | PIT-RED-NOTIFICATION-004 | route-screen-state-red-matrix.md Row 19 | RED_TEST_DEFINED |
| Profile | `/profile` | PIT-RED-ROUTE-020 | route-screen-state-red-matrix.md Row 20 | RED_TEST_DEFINED |
| Org Admin | `/admin/org` | PIT-RED-ROUTE-022 | route-screen-state-red-matrix.md Row 22 | RED_TEST_DEFINED |
| User Management | `/admin/users` | PIT-RED-ROUTE-023 | route-screen-state-red-matrix.md Row 23 | RED_TEST_DEFINED |
| Org Settings | `/admin/settings` | PIT-RED-ROUTE-024 | route-screen-state-red-matrix.md Row 24 | RED_TEST_DEFINED |
| Audit Log | `/admin/audit-log` | PIT-RED-AUDIT-001, PIT-RED-AUDIT-006 | route-screen-state-red-matrix.md Row 25 | RED_TEST_DEFINED |
| QA Dashboard | `/qa-dashboard` | PIT-RED-QA-001, PIT-RED-QA-002 | route-screen-state-red-matrix.md Row 26 | RED_TEST_DEFINED |

**Screen coverage: 22/22 — COMPLETE**

---

## 3. Route Loaders and Permission Outcomes

| Component | Architecture Contract | RED Test ID | Status |
|---|---|---|---|
| ProtectedRoute guard | Unauthenticated → /login | PIT-RED-AUTH-011, PIT-RED-RLS-009 | RED_TEST_DEFINED |
| ProtectedRoute: stores intended path | sessionStorage['pit_intended_destination'] | PIT-RED-AUTH-003 | RED_TEST_DEFINED |
| Post-login redirect | Reads and clears stored path | PIT-RED-AUTH-003 | RED_TEST_DEFINED |
| Insufficient role → PermissionDenied | Not 404, not white screen | PIT-RED-RLS-011 | RED_TEST_DEFINED |
| SPA fallback | vercel.json rewrite works | PIT-RED-ROUTE-028 | RED_TEST_DEFINED |

---

## 4. App Shell / Navigation / Global Styles

| Architecture Component | RED Test ID | Status |
|---|---|---|
| RootLayout renders persistent app shell | PIT-RED-ROUTE-007 | RED_TEST_DEFINED |
| Global CSS: reset + typography + CSS variables at root | PIT-RED-NFR-002, route-screen-state-red-matrix.md | RED_TEST_DEFINED |
| No layout flash | PIT-RED-ROUTE-007 | RED_TEST_DEFINED |
| App shell visible in all 5 states | route-screen-state-red-matrix.md | RED_TEST_DEFINED |
| GlobalErrorBoundary catches rendering errors | PIT-RED-ROUTE-027 | RED_TEST_DEFINED |
| Notification bell in top nav | PIT-RED-NOTIFICATION-001 | RED_TEST_DEFINED |

---

## 5. TanStack Router Behaviour

| Behaviour | RED Test ID | Status |
|---|---|---|
| File-based routing resolves all 27 routes | PIT-RED-ROUTE-001 through PIT-RED-ROUTE-027 | RED_TEST_DEFINED |
| Unknown route → catch-all → NotFoundPage | PIT-RED-ROUTE-027 | RED_TEST_DEFINED |
| Deep-link navigation (SPA fallback) | PIT-RED-ROUTE-028 | RED_TEST_DEFINED |
| Client-side navigation (<3s) | PIT-RED-NFR-001 | RED_TEST_DEFINED |

---

## 6. Supabase Client Integration

| Integration | RED Test ID | Status |
|---|---|---|
| Auth: session restoration on app load | PIT-RED-AUTH-012 | RED_TEST_DEFINED |
| Auth: JWT session, token refresh | PIT-RED-AUTH-001 | RED_TEST_DEFINED |
| Realtime: notifications subscription | PIT-RED-NOTIFICATION-002 | RED_TEST_DEFINED |
| Storage: evidence file upload | PIT-RED-EVIDENCE-001 | RED_TEST_DEFINED |
| Storage: signed URL download | PIT-RED-EVIDENCE-008 | RED_TEST_DEFINED |
| RLS enforcement on all tables | PIT-RED-RLS-010 | RED_TEST_DEFINED |

---

## 7. Database Tables (Architecture Named Tables)

| Table | RED Test ID | Status |
|---|---|---|
| profiles | PIT-RED-AUTH-001 (profile row created) | RED_TEST_DEFINED |
| projects | PIT-RED-PROJECT-001 | RED_TEST_DEFINED |
| milestones | PIT-RED-PROJECT-003 | RED_TEST_DEFINED |
| deliverables | PIT-RED-PROJECT-005 | RED_TEST_DEFINED |
| tasks | PIT-RED-PROJECT-006 | RED_TEST_DEFINED |
| task_dependencies | PIT-RED-PROJECT-015 | RED_TEST_DEFINED |
| evidence_items | PIT-RED-EVIDENCE-001 | RED_TEST_DEFINED |
| invitations | PIT-RED-AUTH-007 | RED_TEST_DEFINED |
| notifications | PIT-RED-NOTIFICATION-001 | RED_TEST_DEFINED |
| audit_log | PIT-RED-AUDIT-001 | RED_TEST_DEFINED |
| source_links | PIT-RED-PROJECT-001 | RED_TEST_DEFINED |
| user_roles | PIT-RED-RLS-001 | RED_TEST_DEFINED |

---

## 8. Storage Buckets

| Bucket | Architecture Contract | RED Test ID | Status |
|---|---|---|---|
| evidence-files | Evidence upload, signed URL access, RLS controlled | PIT-RED-EVIDENCE-001, PIT-RED-EVIDENCE-009 | RED_TEST_DEFINED |
| reports | Report PDF/XLSX stored; scoped access | PIT-RED-REPORT-001, PIT-RED-REPORT-004 | RED_TEST_DEFINED |

---

## 9. Edge Functions

| Edge Function | Architecture Contract | RED Test ID | Status |
|---|---|---|---|
| invitation-accept | Validate and accept invite token | PIT-RED-AUTH-006, PIT-RED-AUTH-007 | RED_TEST_DEFINED |
| create-project | Authorized project creation | PIT-RED-PROJECT-001, PIT-RED-RLS-013 | RED_TEST_DEFINED |
| generate-report | PDF/XLSX/CSV report generation | PIT-RED-REPORT-001, PIT-RED-REPORT-002 | RED_TEST_DEFINED |
| send-notification | Email via Resend + notification row insert | PIT-RED-NOTIFICATION-002, PIT-RED-AUTH-004 | RED_TEST_DEFINED |
| aimc-gateway | Route AI requests to AIMC only | PIT-RED-AIMC-001, PIT-RED-AIMC-002 | RED_TEST_DEFINED |
| watchdog-check | Evaluate escalation triggers | PIT-RED-ROUTE-022 | RED_TEST_DEFINED |
| audit-export | Audit log CSV export | PIT-RED-AUDIT-007 | RED_TEST_DEFINED |
| evidence-approve | Evidence approval state transitions | PIT-RED-EVIDENCE-005 | RED_TEST_DEFINED |
| evidence-upload | File validation + bucket write | PIT-RED-EVIDENCE-001, PIT-RED-EVIDENCE-002 | RED_TEST_DEFINED |
| lifecycle-transition | Archive/restore/cancel state changes | PIT-RED-PROJECT-010, PIT-RED-PROJECT-012 | RED_TEST_DEFINED |

---

## 10. Timeline Engine Architecture

See `timeline-engine-red-tests.md` for full coverage.

| Architecture Component | RED Test ID | Status |
|---|---|---|
| Date-to-pixel math contract (ADR-PIT-001) | PIT-RED-TIMELINE-002 | RED_TEST_DEFINED |
| Drag/resize persistence | PIT-RED-TIMELINE-003, PIT-RED-TIMELINE-004 | RED_TEST_DEFINED |
| Denominator switching | PIT-RED-TIMELINE-005 | RED_TEST_DEFINED |
| Progress overlay | PIT-RED-TIMELINE-006 | RED_TEST_DEFINED |
| Virtualisation performance | PIT-RED-TIMELINE-007 | RED_TEST_DEFINED |
| Keyboard/accessibility fallback | PIT-RED-TIMELINE-008 | RED_TEST_DEFINED |

---

## 11. Access Control Architecture

| Control | RED Test ID | Status |
|---|---|---|
| RLS on every table | PIT-RED-RLS-010 | RED_TEST_DEFINED |
| Org-scoped read policy | PIT-RED-RLS-003 | RED_TEST_DEFINED |
| cs2_admin cross-org policy | PIT-RED-AUDIT-004 | RED_TEST_DEFINED |
| Write policy (role-scoped) | PIT-RED-RLS-008 | RED_TEST_DEFINED |
| Evidence storage RLS | PIT-RED-EVIDENCE-009 | RED_TEST_DEFINED |
| QA Dashboard RLS | PIT-RED-QA-004 | RED_TEST_DEFINED |

---

## 12. Deployment / Vercel Runtime Assumptions

| Assumption | RED Test ID | Status |
|---|---|---|
| Vercel deployment live | PIT-RED-LFV-001 | RED_TEST_DEFINED |
| SPA fallback active in Vercel | PIT-RED-ROUTE-028 | RED_TEST_DEFINED |
| Vercel protection bypass works | PIT-RED-LFV-002 | RED_TEST_DEFINED |
| SHA match between branch and deployed instance | PIT-RED-LFV-001 | RED_TEST_DEFINED |
| All env vars available in Vercel | PIT-RED-LFV-004 | RED_TEST_DEFINED |

---

## Coverage Summary

| Category | Coverage | Status |
|---|---|---|
| Routes | 27/27 | COMPLETE |
| Screens | 22/22 | COMPLETE |
| Route loaders / permission outcomes | 5/5 | COMPLETE |
| App shell / global styles | 6/6 | COMPLETE |
| TanStack Router behaviour | 4/4 | COMPLETE |
| Supabase client integration | 6/6 | COMPLETE |
| Database tables | 12/12 | COMPLETE |
| Storage buckets | 2/2 | COMPLETE |
| Edge Functions | 10/10 | COMPLETE |
| Timeline engine | 6/6 | COMPLETE |
| Access control | 6/6 | COMPLETE |
| Deployment/Vercel | 5/5 | COMPLETE |

**Architecture coverage: 100% — No BLOCKING_GAP entries.**
