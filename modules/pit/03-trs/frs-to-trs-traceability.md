# PIT — FRS-to-TRS Traceability Matrix

## Stage 4 — Pre-Build Specification Artifact

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | FRS-to-TRS Traceability Matrix |
| Version | v0.1-draft |
| Status | **DRAFT_CREATED — pending upstream CS2 approvals (Stage 2 and Stage 3)** |
| Derived From | `modules/pit/02-frs/functional-requirements.md` v0.1-draft → `modules/pit/03-trs/technical-requirements-specification.md` v0.1-draft |
| Date | 2026-05-07 |
| Issue | maturion-isms#1554 |

---

## Column Key

| Column | Meaning |
|---|---|
| FRS Group | Section name or logical grouping from the FRS |
| FRS Requirement ID(s) | PIT-FR-NNN or NF-NNN identifiers from FRS |
| TRS Requirement ID(s) | PIT-TR-NNN identifiers from TRS |
| Technical Domain | The TRS section/domain that implements the functional requirement |
| Future Architecture Component | Stage 5 component that will implement this |
| Future QA-to-Red Test Placeholder | Stage 6 test suite or test type |

---

## Traceability Matrix

### 1. Auth and Onboarding

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Landing / public routes | PIT-FR-003 | PIT-TR-012 | Public routes enumeration | React Router v6 public route config | E2E: landing page renders unauthenticated |
| Sign Up | PIT-FR-004 | PIT-TR-018, PIT-TR-019 | Supabase Auth, email verification | Supabase Auth + confirmation email config | E2E: sign up → email verify → protected route |
| Login | PIT-FR-005 | PIT-TR-018, PIT-TR-014 | Supabase Auth JWT, post-login redirect | AuthProvider + session handler | E2E: login → intended destination redirect |
| Email verification | PIT-FR-006 | PIT-TR-018, PIT-TR-019 | Supabase Auth email confirmation | Supabase Auth settings | E2E: verify email → onboarding redirect |
| Account recovery | PIT-FR-007 | PIT-TR-018 | Supabase Auth open signup flag | Supabase Auth settings | Unit: open signup enabled by default |
| Invitation (new user) | PIT-FR-008, PIT-FR-009 | PIT-TR-021, PIT-TR-022, PIT-TR-033, PIT-TR-084 | `validate_invitation` + `accept_invitation` Edge Functions, invitation token security | Supabase Edge Functions | E2E: valid invite → account create → onboarding |
| Invitation (existing user) | PIT-FR-010 | PIT-TR-022 | `accept_invitation` Edge Function | Supabase Edge Function | E2E: existing user invite accept → dashboard |
| Forgot password | PIT-FR-011 | PIT-TR-020 | Supabase Auth password reset | Supabase Auth | E2E: forgot password → email sent |
| Password reset | PIT-FR-012 | PIT-TR-020 | Supabase Auth password reset token | Supabase Auth + expired-token error state | E2E: reset via valid token; expired token error state |
| Onboarding flow | PIT-FR-015 | PIT-TR-028, PIT-TR-111 | Profiles table, onboarding route | `profiles` table + `/onboarding` route component | E2E: new user onboarding 4 steps + skip orientation |
| Invitation screen | PIT-FR-110 | PIT-TR-021, PIT-TR-022, PIT-TR-091 | Edge Functions + five-state UI on `/invite/[token]` | `/invite/[token]` route component | E2E: all four invitation screen states |

---

### 2. Public / Auth Route Handling

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Public route list | PIT-FR-003, PIT-FR-013 | PIT-TR-012 | Public route enumeration | React Router config | Integration: all public routes render without auth |
| Auth route discoverability | PIT-FR-003 to PIT-FR-012 | PIT-TR-017, PIT-TR-111 | Auth route registration, L-004 | React Router auth route registration | Deployment: all auth routes return correct component |

---

### 3. Protected Route Guard

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Protected route guard | PIT-FR-013 | PIT-TR-013, PIT-TR-014 | `ProtectedRoute` component + sessionStorage | `ProtectedRoute` wrapper | Integration: unauthenticated access → login redirect; post-login → intended destination |

---

### 4. SPA Fallback

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| SPA fallback | PIT-FR-014 | PIT-TR-015, PIT-TR-099 | `vercel.json` rewrite, deployment contract | `vercel.json` or equivalent | Deployment: direct navigation to `/projects/123` renders correct component |

---

### 5. Role-Based Navigation and Access Control

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Role hierarchy | PIT-FR-001 | PIT-TR-023, PIT-TR-024 | `user_roles` table, RBAC | `user_roles` DB table + role context | Unit: role hierarchy is correct; Integration: role-gated nav items |
| Role-gated UI | PIT-FR-002 | PIT-TR-024, PIT-TR-025 | Role-gated navigation, permission-denied state | Sidebar component + role context | Integration: cs2_admin sees admin items; viewer does not |
| RLS enforcement | PIT-FR-001, PIT-FR-002, PIT-FR-101 | PIT-TR-026, PIT-TR-041 to PIT-TR-047, PIT-TR-082, PIT-TR-105 | RLS policy design | Supabase RLS policies | RLS role-switching tests for all tables |

---

### 6. Portfolio Dashboard

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Summary cards | PIT-FR-027 | PIT-TR-029, PIT-TR-078 | `projects` query + aggregation | Portfolio dashboard component + API | Integration: correct counts on dashboard |
| Project list with RAG | PIT-FR-028 | PIT-TR-029, PIT-TR-081 | `projects` list query, RAG calculation | Project card component | Unit: RAG calculation logic; Integration: renders project list |
| Dashboard filtering | PIT-FR-029 | PIT-TR-078, PIT-TR-038 | Filtered API query, org-scoped | Filter component + API query | Integration: filter by division returns correct projects |
| Watchdog alert banner | PIT-FR-030 | PIT-TR-027 (`watchdog_flags`) | Watchdog flags query | Watchdog banner component | Integration: banner shows when flags exist |
| Portfolio AI analysis | PIT-FR-097 | PIT-TR-052, PIT-TR-053, PIT-TR-054 | AIMC pit.portfolio-risk-analysis proxy | `pit-portfolio-risk` Edge Function | Integration: AI insights card renders; no status auto-change |

---

### 7. Implementation Page Indicators

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Implementation page | PIT-FR-036 | PIT-TR-029, PIT-TR-030, PIT-TR-091 | Projects + hierarchy queries, five-state UI | Implementation page component | E2E: 3 milestones + 6 deliverables + 12 tasks renders |
| Indicator 1 (duration + progress bar) | PIT-FR-037 | PIT-TR-065, PIT-TR-078 | Date display contract, progress calculation | Indicator 1 component | Unit: RAG logic for time-elapsed vs actual-progress |
| Indicator 2 (milestone count) | PIT-FR-038 | PIT-TR-030, PIT-TR-040 | Milestones query | Indicator 2 component | Unit: overdue badge logic |
| Indicator 3 (deliverable count) | PIT-FR-039 | PIT-TR-030 | Deliverables query | Indicator 3 component | Unit: RAG logic |
| Indicator 4 (task count + overdue) | PIT-FR-040 | PIT-TR-030, PIT-TR-078 | Tasks query + overdue count | Indicator 4 component | Unit: overdue > 10% = red chip |
| Indicator 5 (team member count) | PIT-FR-041 | PIT-TR-023, PIT-TR-027 | `user_roles` join | Indicator 5 component | Unit: avatar overflow at +5 |
| Indicator 6 (progress vs plan) | PIT-FR-042 | PIT-TR-078 | Progress delta calculation | Indicator 6 component | Unit: delta RAG logic |
| Indicator 7 (overall progress %) | PIT-FR-043 | PIT-TR-030, PIT-TR-078 | Weighted roll-up calculation | Indicator 7 component | Unit: roll-up calculation |
| Status colour coding | PIT-FR-044 | PIT-TR-091 | Row status display | Status badge component | Unit: status-to-colour mapping |
| View toggle | PIT-FR-045 | PIT-TR-091 | Frontend state | View toggle component | Integration: toggle switches between hierarchy and flat views |

---

### 8. Project Hierarchy

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Hierarchy structure | PIT-FR-046 | PIT-TR-037, PIT-TR-029 to PIT-TR-031 | FK constraints: task→deliverable→milestone→project | DB schema FK constraints | Unit: FK constraint prevents orphan tasks |
| Task cluster templates | PIT-FR-047 | PIT-TR-027 (`task_cluster_templates`, `task_cluster_items`), PIT-TR-030 | Template schema + sub-task creation | Template tables + apply-template API | Integration: apply template creates sub-tasks |

---

### 9. Milestones

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Milestone creation | PIT-FR-048 | PIT-TR-030, PIT-TR-047, PIT-TR-049 | `milestones` table + write RLS | Milestone creation API | Integration: create milestone → appears in hierarchy |
| Milestone date constraints | PIT-FR-049 | PIT-TR-040 | API date validation | Date constraint validation in API | Unit: milestone end > project end = warning |
| Milestone cascade on date change | PIT-FR-050 | PIT-TR-066 | Gantt cascade logic | Cascade dialog component | Integration: extend milestone prompts deliverable extension |

---

### 10. Deliverables

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Deliverable creation | PIT-FR-051 | PIT-TR-030, PIT-TR-047, PIT-TR-049 | `deliverables` table + write RLS | Deliverable creation API | Integration: create deliverable → appears in hierarchy |
| Evidence required flag | PIT-FR-052 | PIT-TR-032 (`evidence_required`), PIT-TR-063 | `deliverables.evidence_required` flag | Deliverable status guard | Integration: evidence_required=true blocks completion without approved evidence |

---

### 11. Tasks / Action Items

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Task creation | PIT-FR-053 | PIT-TR-030, PIT-TR-047, PIT-TR-059 | `tasks` table + write RLS + notification on assignment | Task creation API + notification trigger | Integration: create task with different owner → notification sent |
| Task status lifecycle | PIT-FR-054 | PIT-TR-027 (`status_logs`), PIT-TR-049 | `tasks.status` transitions + `status_logs` | Status transition API + audit log | Unit: status transition rules; Integration: transition logged |
| Task progress % | PIT-FR-055 | PIT-TR-030, PIT-TR-078 | `tasks.progress_pct` + roll-up | Progress update API | Integration: task progress update rolls up to indicator |
| Task dependencies | PIT-FR-056 | PIT-TR-031, PIT-TR-039, PIT-TR-067 | `task_dependencies` table + circular dependency detection | Dependency insert API | Unit: circular dependency rejected; Integration: dependency stored |
| Blocked task UI | PIT-FR-057 | PIT-TR-031, PIT-TR-091 | `task_dependencies` query → blocked status | Blocked indicator component | Integration: blocked task shows correct status |

---

### 12. Task Cluster Templates

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Task cluster templates | PIT-FR-047 | PIT-TR-027 (`task_cluster_templates`, `task_cluster_items`) | Template storage + apply-template API | Template management + task creation API | Integration: apply template → sub-tasks created with correct offsets |
| Template admin screen | PIT-FR-108 | PIT-TR-027, PIT-TR-047 | Admin API for template CRUD | Admin template screen + API | Integration: admin creates/edits/deletes template |

---

### 13. My Work (Stage 2 v0.2 Addition)

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| My Work screen | PIT-FR-111 | PIT-TR-030, PIT-TR-091, PIT-TR-042 | `tasks WHERE task_owner_id = auth.uid()` + org-scoped RLS + five-state UI | My Work page component + filtered tasks query | Integration: /my-work shows only current user's tasks; empty state when no tasks |
| My Work filter + actions | PIT-FR-112 | PIT-TR-030, PIT-TR-091, PIT-TR-093 | Filtered tasks query + inline status update | Filter controls + inline status update component | Integration: overdue filter, inline save, evidence shortcut, task nav link |

---

### 14. Invitation Acceptance (Stage 2 v0.2 Addition)

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Invitation acceptance screen | PIT-FR-110 | PIT-TR-021, PIT-TR-022, PIT-TR-033, PIT-TR-091 | `/invite/[token]` route + Edge Functions + five-state UI | `/invite/[token]` page component | E2E: four invitation states (validating, new user, existing user, error) |
| New user invitation path | PIT-FR-008, PIT-FR-009 | PIT-TR-021, PIT-TR-022, PIT-TR-084 | `validate_invitation` + `accept_invitation` Edge Functions, token security | Edge Functions + auth user creation | E2E: valid new-user token → password form → account creation → onboarding |
| Existing user invitation path | PIT-FR-010 | PIT-TR-022 | `accept_invitation` Edge Function | Edge Function + org membership update | E2E: existing user token → confirmation prompt → org membership added |

---

### 15. Assignments / Invitations

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Person-picker | PIT-FR-058 | PIT-TR-023, PIT-TR-042 | `user_org_memberships` + `profiles` query | Person-picker component | Integration: picker shows only org members |
| Invite from picker | PIT-FR-059 | PIT-TR-021, PIT-TR-022, PIT-TR-033 | Invitation creation API + Edge Functions | Picker invite CTA + Edge Function | Integration: invite from picker sends invitation |
| Assignment notification | PIT-FR-060 | PIT-TR-059, PIT-TR-034, PIT-TR-056 | `notifications` insert + Realtime | Notification trigger on assignment | Integration: task assignment → notification received |
| Role assignment | PIT-FR-061 | PIT-TR-023, PIT-TR-047 | `user_roles` insert/update | Role assignment API | Integration: role assignment → effective permission change |

---

### 16. Evidence Submission / Review

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Evidence upload | PIT-FR-062 | PIT-TR-060, PIT-TR-061, PIT-TR-032 | Supabase Storage + `evidence_items` insert | File upload component + storage client | Integration: upload PDF → record in evidence_items with status=pending |
| Evidence notification (to reviewers) | PIT-FR-063 | PIT-TR-059, PIT-TR-034 | Notification on evidence submit | Notification trigger | Integration: submit evidence → reviewer receives notification |
| Evidence approval | PIT-FR-064 | PIT-TR-063, PIT-TR-049, PIT-TR-045 | `evidence_items.status = approved` + audit log | Evidence approval API | Integration: approve → status=approved; task owner notified; audit log entry |
| Evidence return | PIT-FR-065 | PIT-TR-063, PIT-TR-049 | `evidence_items.status = returned` + comment | Evidence return API | Integration: return requires comment; submitter notified |
| Evidence auto-advance | PIT-FR-066 | PIT-TR-063, PIT-TR-032 | `evidence_required` flag check on completion | Task completion guard | Integration: approved evidence → task completion unblocked |
| Evidence preview | PIT-FR-067 | PIT-TR-062 | Signed URL + inline preview | Evidence viewer component | Integration: PDF shows inline; docx shows download link |

---

### 17. Timeline / Gantt

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Gantt rendering | PIT-FR-068 | PIT-TR-064, PIT-TR-030 | Gantt library + milestones/deliverables data | Timeline page + Gantt component | Integration: project with 3M+8D renders 11 bars |
| Gantt zoom | PIT-FR-069 | PIT-TR-064 | Gantt library zoom controls | Zoom control component | Integration: zoom switches correctly |
| Gantt progress fill | PIT-FR-070 | PIT-TR-064, PIT-TR-030 | Gantt library progress fill | Gantt progress renderer | Integration: 60% deliverable shows 60% fill |
| Today line | PIT-FR-071 | PIT-TR-064 | Gantt today line | Gantt component | Integration: today line renders at current date |
| Drag-and-drop date adjust | PIT-FR-072 | PIT-TR-066 | Drag handler + confirmation dialog | Drag-and-drop component | Integration: drag 7 days → confirmation → dates updated |
| Cascade on milestone change | PIT-FR-073 | PIT-TR-066, PIT-TR-040 | Cascade check API | Cascade dialog + API | Integration: shortening milestone with conflicting deliverables → modal |
| Conflict detection | PIT-FR-074 | PIT-TR-067, PIT-TR-039 | Conflict detection + Gantt markers | Conflict indicator component | Integration: deliverable end > milestone end → amber marker |
| Date format | PIT-FR-075 | PIT-TR-065 | ISO 8601 storage + DD MMM YYYY display | Date formatting utility | Unit: date stored as YYYY-MM-DD; displayed as DD MMM YYYY |
| Task bar overlay | PIT-FR-076 | PIT-TR-064 | Gantt task bar toggle | Task bar toggle component | Integration: toggle shows/hides task bars |

---

### 18. Watchdog / Escalation

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Watchdog engine | PIT-FR-077 | PIT-TR-027 (`watchdog_flags`), PIT-TR-048 (`watchdog_evaluation` Edge Function) | Watchdog evaluation logic + flag storage | `watchdog_evaluation` Edge Function | Unit: overdue task flagged; stalled item flagged; evidence overdue flagged |
| Watchdog dashboard | PIT-FR-078 | PIT-TR-027 (`watchdog_flags`), PIT-TR-091 | Watchdog flags query + five-state UI | Watchdog dashboard component | Integration: 5 flagged items appear on dashboard; filter narrows list |
| Escalation actions | PIT-FR-079 | PIT-TR-027 (`escalation_log`), PIT-TR-049, PIT-TR-059 | Escalation log insert + notification + audit log | Escalation action component | Integration: Escalate action → escalation_log record + notification |
| Watchdog AI recommendation | PIT-FR-098 | PIT-TR-052, PIT-TR-053, PIT-TR-054 | AIMC pit.escalation-advisor proxy | `pit-escalation-advisor` Edge Function | Integration: AI recommendation shown; apply requires confirmation |

---

### 19. Reports / Exports

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Report types | PIT-FR-080 | PIT-TR-068 | `generate_report` Edge Function | Report type selector + Edge Function | Integration: all 5 report types available |
| Report scope selection | PIT-FR-081 | PIT-TR-068, PIT-TR-042 | Scoped query + org RLS | Report scope controls | Integration: scoped report returns only matching records |
| Output formats | PIT-FR-082 | PIT-TR-069, PIT-TR-070 | PDF + XLSX + CSV generation | PDF/XLSX/CSV generators | Integration: each format produces valid downloadable file |
| Server-side generation | PIT-FR-083 | PIT-TR-068, PIT-TR-078 | `generate_report` Edge Function streaming | Edge Function + timeout handling | Integration: 200-project report completes without timeout |
| Report history | PIT-FR-084 | PIT-TR-071, PIT-TR-027 (`report_history`) | Storage + `report_history` table | Report history component | Integration: generated report appears in history with download link |
| AI executive summary | PIT-FR-099 | PIT-TR-072, PIT-TR-052 to PIT-TR-054 | AIMC pit.report-summary proxy | AI summary section in report | Integration: checkbox → AI summary prepended; editable before download |

---

### 20. Audit Log

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Comprehensive audit log | PIT-FR-087 | PIT-TR-035, PIT-TR-073, PIT-TR-049, PIT-TR-044 | `audit_log` table, append-only, RLS | `audit_log` table + insert triggers | Integration: each wiring table event creates audit_log entry |
| CSV export | PIT-FR-088 | PIT-TR-075, PIT-TR-044 | `generate_report` audit trail type | Audit trail report type | Integration: org_admin export → valid CSV with filtered entries |
| Audit log pagination | PIT-FR-089 | PIT-TR-074, PIT-TR-078 | Keyset/offset pagination, max 50 rows | Paginated audit log query | Performance: 10,000-record dataset page load < 2s |

---

### 21. QA Dashboard

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| QA Dashboard access | PIT-FR-093 | PIT-TR-077, PIT-TR-046 | cs2_admin RLS + route guard | `/qa-dashboard` route guard | Integration: org_admin sees permission-denied; cs2_admin sees dashboard |
| QA Dashboard content | PIT-FR-094 | PIT-TR-076 | `qa_runs` table or artifact store | QA Dashboard data source | Integration: after test run, dashboard shows updated counts |

---

### 22. Admin Sub-Screens

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Organisation settings | PIT-FR-090 | PIT-TR-027 (`organisations`), PIT-TR-047 | Organisation settings API | Settings page + org API | Integration: timezone change updates date displays |
| User management | PIT-FR-091 | PIT-TR-027 (`user_org_memberships`), PIT-TR-047 | User management API | User management screen | Integration: deactivate user → login prevented |
| Watchdog sensitivity config | PIT-FR-092 | PIT-TR-027 (`integration_configs` or settings table), PIT-TR-047 | Watchdog config API | Watchdog settings screen | Integration: threshold change affects watchdog evaluation |
| Role management screen | PIT-FR-106 | PIT-TR-023, PIT-TR-047 | `user_roles` CRUD API | `/admin/roles` screen | Integration: role assignment via admin screen takes effect |
| Notification templates screen | PIT-FR-107 | PIT-TR-059, PIT-TR-047 | Notification template config API | `/admin/notifications` screen | Integration: disable template → event no longer triggers notification |
| Task cluster templates screen | PIT-FR-108 | PIT-TR-027 (`task_cluster_templates`), PIT-TR-047 | Template CRUD API | `/admin/task-clusters` screen | Integration: template created via admin available in task creation |
| Invitation settings | PIT-FR-109 | PIT-TR-033, PIT-TR-047 | Invitation expiry config | `/admin/settings` invitation section | Integration: 48h expiry → token older than 48h rejected |

---

### 23. Notifications

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Root NotificationProvider | PIT-FR-022 | PIT-TR-007, PIT-TR-056 | Root-level Supabase Realtime subscription | `NotificationProvider` component | Integration: notification received on any authenticated page without navigation |
| Real-time delivery | PIT-FR-023 | PIT-TR-056, PIT-TR-034 | Supabase Realtime subscription | Realtime subscription | Integration: notification appears in bell without page reload |
| Notification bell and drawer | PIT-FR-024 | PIT-TR-034, PIT-TR-007 | Notification query + bell component | Bell component + drawer | Integration: 5 unread → badge "5"; click → drawer with 5 notifications |
| Notification types | PIT-FR-025 | PIT-TR-034, PIT-TR-059 | `notifications` insert per event | Notification trigger per event type | Integration: each of the 10 event types creates correct notification record |
| Email delivery | PIT-FR-026 | PIT-TR-057, PIT-TR-058 | Edge Function email delivery + preference check | Email trigger Edge Function | Integration: user with email disabled → no email sent for that type |

---

### 24. AIMC Touchpoints

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| AIMC Gateway mandatory | PIT-FR-095 | PIT-TR-052, PIT-TR-083 | Zero direct AI provider calls | All AIMC Edge Functions | Code audit: zero direct provider calls in all source files |
| Task AI Advisor | PIT-FR-096 | PIT-TR-052, PIT-TR-053, PIT-TR-054, PIT-TR-090 | `pit-task-advisor` Edge Function + audit log | AI Advisor panel on Task page | Integration: advisor panel expands; suggestion apply logs acceptance |
| Portfolio Risk Highlight | PIT-FR-097 | PIT-TR-052, PIT-TR-053, PIT-TR-054 | `pit-portfolio-risk` Edge Function | AI Risk Insights card | Integration: analyse button → insights card; no status auto-change |
| Watchdog Escalation Recommendation | PIT-FR-098 | PIT-TR-052, PIT-TR-053, PIT-TR-054 | `pit-escalation-advisor` Edge Function | Escalation recommendation panel | Integration: AI recommendation inline; apply requires confirmation |
| AI Executive Summary | PIT-FR-099 | PIT-TR-052, PIT-TR-053, PIT-TR-072 | `pit-report-summary` Edge Function + report | AI summary section | Integration: checkbox → summary prepended; editable |

---

### 25. Cross-Module Integration Intake

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Source link integration | PIT-FR-100 | PIT-TR-036, PIT-TR-027 (`source_links`) | `source_links` table + project creation API | Source link selector in project wizard | Integration: link to Risk #R-007 → source_links record |
| Cross-org data scoping | PIT-FR-101 | PIT-TR-038, PIT-TR-042, PIT-TR-043, PIT-TR-082 | Org-scoped RLS + cs2_admin bypass | RLS policies on all tables | RLS role-switching: Org A user cannot read Org B data |
| Integration settings | PIT-FR-102 | PIT-TR-027 (`integration_configs`), PIT-TR-047 | Integration config API | `/admin/integrations` screen | Integration: save config → integration_configs table updated |

---

### 26. Deployment Surface Verification

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Complete route coverage | PIT-FR-103 | PIT-TR-011, PIT-TR-106 | All 27 routes registered + deployment verification | React Router config + deployment contract | Deployment: all 27 routes return correct component (not 404) |
| 404 Not Found page | PIT-FR-104 | PIT-TR-016 | Catch-all route + 404 component | 404 page component | Integration: unknown route → 404 page with Go Home link |
| Evidence storage provisioning | PIT-FR-105 | PIT-TR-060, PIT-TR-085, PIT-TR-098 | Supabase Storage private bucket | Deployment contract storage section | Deployment: evidence bucket created, private, access via signed URL only |

---

### 27. Non-Functional Placeholders (Resolved in TRS)

| NF ID | Placeholder | TRS Resolution | TRS ID(s) |
|---|---|---|---|
| NF-001 | API response time targets | < 200ms single fetch; < 500ms list | PIT-TR-078 |
| NF-002 | Concurrent user capacity | 100 concurrent active users | PIT-TR-080 |
| NF-003 | Database schema + RLS policies | Canonical table candidates + RLS design | PIT-TR-027 to PIT-TR-047 |
| NF-004 | Email delivery provider | Resend (candidate); alternatives Postmark, Supabase default | PIT-TR-057 |
| NF-005 | Report generation library | Puppeteer (PDF candidate), ExcelJS (XLSX) | PIT-TR-069, PIT-TR-070 |
| NF-006 | AIMC Gateway endpoint path | `/api/aimc/pit/...` — subject to AIMC module owner confirmation (A-004) | PIT-TR-053 |
| NF-007 | Supabase Edge Function runtime | Deno runtime, secrets vault, 25s timeout | PIT-TR-048 to PIT-TR-051 |
| NF-008 | Data retention and backup | Deferred to Architecture (PIT-TR-097 staging parity) | PIT-TR-097 |
| NF-009 | Security penetration testing scope | OWASP top 10 — deferred to Stage 6 | PIT-TR-102 |
| NF-010 | WCAG accessibility compliance level | WCAG 2.1 AA; Lighthouse ≥ 80 | PIT-TR-087, PIT-TR-103 |

---

### 28. MMM Carry-Forward Controls

| MMM Control | Definition | TRS ID(s) | Future QA-to-Red Test Placeholder |
|---|---|---|---|
| L-001 | L1/L2/L3 closure model | PIT-TR-108 | L3: CS2 live verification in production |
| L-002 | UI rendering completeness; global CSS + app shell first-class test | PIT-TR-109, PIT-TR-009 | Test: root layout renders app shell in all five states; no white screen |
| L-003 | Five UI states for every primary post-login page | PIT-TR-110, PIT-TR-091 | Test: all five states on every primary page |
| L-004 | Auth route discoverability; onboarding route design | PIT-TR-111, PIT-TR-017 | Deployment: all auth routes return correct component |
| L-005 | Runtime/UI behaviour validation (not file-existence checks) | PIT-TR-112, PIT-TR-099, PIT-TR-105 | Tests: runtime behaviour proven (RLS role-switching, SPA in deployed env) |
| L-006 | Deployment execution contract | PIT-TR-113, PIT-TR-098 | Deployment contract artifact filed before Stage 7 PBFAG |
| L-007 | Live operational closure evidence | PIT-TR-114 | L3: live E2E navigation log + screenshots in production |
| L-008 | Continuous improvement register propagation | PIT-TR-115 | Improvement register updated at start of each wave |

---

## Derivation Completeness Summary

| Coverage Category | Count | Status |
|---|---|---|
| FRS functional requirements traced | 112 of 112 (PIT-FR-001 to PIT-FR-112) | COMPLETE |
| NF placeholders resolved in TRS | 10 of 10 (NF-001 to NF-010) | COMPLETE |
| MMM controls carried forward | 8 of 8 (L-001 to L-008) | COMPLETE |
| TRS requirements created | PIT-TR-001 to PIT-TR-115 | COMPLETE |
| Traceability domains covered | 28 domains | COMPLETE |
| Stage 2 v0.2 additions traced | My Work (PIT-FR-111, PIT-FR-112); Invitation Acceptance (PIT-FR-110) | COMPLETE |
| AIMC touchpoints traced | 4 touchpoints (PIT-FR-095 to PIT-FR-099) | COMPLETE |
| Deployment surface traced | All 27 routes (PIT-FR-103 to PIT-FR-105) | COMPLETE |

---

**End of PIT FRS-to-TRS Traceability Matrix v0.1-draft**

---

**Template Version**: 1.0.0
**Template Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0
**Last Updated**: 2026-05-07
**Authority**: CS2 (Johan Ras / @APGI-cmy)
