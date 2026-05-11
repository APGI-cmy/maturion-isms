# PIT — FRS-to-TRS Traceability Matrix

## Stage 4 — Pre-Build Specification Artifact

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | FRS-to-TRS Traceability Matrix |
| Version | v0.2-draft |
| Status | **DRAFT_UPDATED — Stage 2 and Stage 3 baselines re-confirmed; Stage 4 traceability prepared for CS2 review (maturion-isms#1604)** |
| Derived From | `modules/pit/02-frs/functional-requirements.md` **v0.2-hardened baseline** → `modules/pit/03-trs/technical-requirements-specification.md` v0.2-draft |
| Coverage | All 123 FRS requirements (PIT-FR-001 through PIT-FR-123) + 10 NF placeholders + 8 MMM controls |
| Date | 2026-05-07 (original); updated 2026-05-08 (retrofit wave maturion-isms#1575 / PR #1576 — traceability rows for PIT-FR-113 to PIT-FR-123 added) |
| Issue | maturion-isms#1554 (original); maturion-isms#1575 (retrofit) |

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

### 5A. App Shell, Five-State UI, and Navigation Cross-Cutting (PIT-FR-016 to PIT-FR-021)

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Five UI states (every primary post-login page) | PIT-FR-016 | PIT-TR-091, PIT-TR-110 | Universal five-state UI contract (L-003) | All page components implementing the 5-state pattern | Test: all five states verified on every primary page |
| App shell persistence across all states | PIT-FR-017 | PIT-TR-092, PIT-TR-109, PIT-TR-009 | Root layout + app shell in all five states (L-002) | Root layout component + sidebar + top nav | Test: app shell renders in loading, empty, permission-denied, error, and data states |
| Sidebar navigation | PIT-FR-018 | PIT-TR-024, PIT-TR-006 | Role-gated sidebar + root layout | Sidebar component + role context | Integration: sidebar renders role-appropriate items |
| Top navigation bar | PIT-FR-019 | PIT-TR-006, PIT-TR-034 | Root layout + notification bell | Top nav component | Integration: top nav renders with notification bell |
| Page header / breadcrumb | PIT-FR-020 | PIT-TR-006 | Page header component | Page header component | Integration: breadcrumb reflects current route |
| Secondary navigation tabs | PIT-FR-021 | PIT-TR-006, PIT-TR-091 | Tab navigation component | Tab nav component | Integration: tabs render on pages with sub-sections |

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

### 6A. Project Creation and Management (PIT-FR-031 to PIT-FR-035)

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Project creation modal / wizard | PIT-FR-031 | PIT-TR-029, PIT-TR-047, PIT-TR-049 | `projects` table + write RLS + project creation API | Project creation modal component | Integration: create project → appears in portfolio dashboard |
| Project type classification | PIT-FR-032 | PIT-TR-029 (`projects.type`: `project \| operational \| improvement`) | `projects.type` field in data model | Project type selector component | Unit: valid project types accepted; invalid types rejected |
| Project type sub-classification | PIT-FR-033 | PIT-TR-029 (`projects.quick_win_type`: `quick_win \| medium_term \| long_term`) | `projects.quick_win_type` field in data model | Project sub-type selector | Unit: quick_win_type values validated |
| Project leader assignment and source link | PIT-FR-034 | PIT-TR-029 (`projects.project_leader_id`), PIT-TR-036 (`source_links`), PIT-TR-023 | Leader assignment + source_links table | Project wizard leader picker + source link selector | Integration: project leader assigned → role entry created; source link stored |
| Project editing (post-creation updates) | PIT-FR-035 | PIT-TR-029, PIT-TR-047, PIT-TR-049 | Project update API + write RLS | Project settings / edit screen | Integration: edit project name/dates → change persists; audit log entry created |

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

### 17A. Implementation Page Filter Bar (PIT-FR-085, PIT-FR-086)

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Filter bar — implementation page | PIT-FR-085 | PIT-TR-091, PIT-TR-042 | Frontend filter state + org-scoped API queries | Filter bar component on implementation page | Integration: filter by status / owner narrows the task/deliverable list |
| Persistent filter state | PIT-FR-086 | PIT-TR-091 | Frontend state management (React state or URL params) | Filter state persistence component | Integration: filter survives intra-page navigation; reset clears all filters |

---

### 17. Timeline / Gantt

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Gantt rendering | PIT-FR-068 | PIT-TR-064, PIT-TR-065, PIT-TR-067 | Rendering model contract + tooling criteria + interaction/performance/QA contract | Timeline split-plane engine + virtualised grid + interaction layer | Integration: project with 3M+8D renders aligned bars; Visual regression: no row/grid drift |
| Gantt zoom | PIT-FR-069 | PIT-TR-064, PIT-TR-065, PIT-TR-067 | Denominator and viewport controls contract | Zoom/denominator control component | Integration: denominator switches day/week/month/quarter/year; viewport preset remains scrollable |
| Gantt progress fill | PIT-FR-070 | PIT-TR-064, PIT-TR-066, PIT-TR-067 | Progress overlay render + width calculation contract | Bar overlay renderer | Integration: 60% deliverable shows proportional 60% fill |
| Today line | PIT-FR-071 | PIT-TR-064 | Timeline calendar-axis rendering contract | Timeline header/grid renderer | Integration: today line renders at current date position |
| Drag-and-drop date adjust | PIT-FR-072 | PIT-TR-066, PIT-TR-067 | Date math contract + drag interaction contract | Drag body + handle interactions | Integration: drag/resize updates visible start/end labels and persisted dates |
| Cascade on milestone change | PIT-FR-073 | PIT-TR-066, PIT-TR-067, PIT-TR-040 | Cascade + locked-change approval/audit contract | Cascade dialog + override request workflow | Integration: conflicting date move requires cascade resolution and records approval/audit event |
| Conflict detection | PIT-FR-074 | PIT-TR-067, PIT-TR-039 | Dependency/conflict + server validation contract | Conflict indicator component + dependency API | Integration: deliverable end > milestone end shows marker; circular dependency rejected server-side |
| Date format | PIT-FR-075 | PIT-TR-064, PIT-TR-066 | Date display/ISO storage + timeline mapping contract | Date formatting and timeline mapping utility | Unit: UI dates render as DD MMM YYYY, persisted values remain ISO date-only, and timeline hover/drag labels resolve consistently with the same canonical dates |
| Task bar overlay | PIT-FR-076 | PIT-TR-064, PIT-TR-067 | Optional task overlay + performance contract | Task bar toggle component | Integration: toggle shows/hides task bars with no alignment drift |

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
| FRS functional requirements traced | **123 of 123** (PIT-FR-001 to PIT-FR-123; PIT-FR-113 to PIT-FR-123 added in retrofit wave maturion-isms#1575) | COMPLETE |
| NF placeholders resolved in TRS | 10 of 10 (NF-001 to NF-010) | COMPLETE |
| MMM controls carried forward | 8 of 8 (L-001 to L-008) | COMPLETE |
| TRS requirements created | PIT-TR-001 to PIT-TR-126 (PIT-TR-116 to PIT-TR-126 added in retrofit wave maturion-isms#1575) | COMPLETE |
| Traceability domains covered | 32 domains (Section 30 added in retrofit wave for FRS v0.2-hardened additions) | COMPLETE |
| Stage 2 v0.2 additions traced | My Work (PIT-FR-111, PIT-FR-112); Invitation Acceptance (PIT-FR-110) | COMPLETE |
| AIMC touchpoints traced | 4 touchpoints (PIT-FR-095 to PIT-FR-099) | COMPLETE |
| Deployment surface traced | All 27 routes (PIT-FR-103 to PIT-FR-105) | COMPLETE |
| FRS v0.2-hardened additions traced | PIT-FR-113 to PIT-FR-123 → PIT-TR-116 to PIT-TR-126 (Section 30) | COMPLETE |

**Coverage Note:** Every PIT-FR-NNN identifier appears in at least one explicit table row in this matrix. Cross-cutting requirements (PIT-FR-016 to PIT-FR-021: App Shell / Five-State UI) are captured in Section 5A. Project creation requirements (PIT-FR-031 to PIT-FR-035) are captured in Section 6A. Implementation page filter bar requirements (PIT-FR-085, PIT-FR-086) are captured in Section 17A. FRS v0.2-hardened additions (PIT-FR-113 to PIT-FR-123) are captured in Section 30.

---

## 30. FRS v0.2-Hardened Additions Traceability (Retrofit Wave maturion-isms#1575)

*This section was added in PR #1576 to cover PIT-FR-113 through PIT-FR-123, which were added to the FRS in the hardening wave (maturion-isms#1556). See TRS Section 31 for the full technical requirement definitions.*

| FRS Group | FRS ID(s) | TRS ID(s) | Technical Domain | Future Architecture Component | Future QA-to-Red Test Placeholder |
|---|---|---|---|---|---|
| Permission Negative-Path Contract | PIT-FR-113 | PIT-TR-116 | RBAC / RLS enforcement — both allowed-path and denied-path | Role-check middleware; RLS policies; permission-denied UI component | E2E denied: non-owner cannot read/write protected entity; API returns 403; UI renders permission-denied state |
| Progress Roll-Up Method | PIT-FR-114 | PIT-TR-117 | Data model, API — server-side progress computation | Progress computation Edge Function or database trigger | Unit: roll-up computation returns correct % for known dataset; E2E: project progress updates after task status change |
| Notification Read / Mark-as-Read | PIT-FR-115 | PIT-TR-118 | Notification system — read/unread state management | `notifications` table `read_at` column; PATCH endpoint; bell badge | E2E: mark notification as read → badge count decrements; real-time badge update |
| Notification History View | PIT-FR-116 | PIT-TR-119 | Notification system — paginated history page | `/notifications` route component; paginated query | E2E: navigate to `/notifications`; pagination works; all five UI states present |
| Notification Preferences | PIT-FR-117 | PIT-TR-120 | Notification system — per-user email opt-in storage | `notification_preferences` table; Settings UI | Unit: email not sent when preference disabled; E2E: toggle preference → subsequent notification skips email |
| Report Generation Permissions / States | PIT-FR-118 | PIT-TR-121 | Reporting — access control and state transitions | `report_history.status` column; role-check in `generate_report` Edge Function | E2E: viewer cannot generate report (403); org_admin can generate project report; status transitions visible in UI |
| Report History Retention | PIT-FR-119 | PIT-TR-122 | Reporting — retention policy and storage | Retention purge scheduler; `report_history` RLS; re-sign URL on demand | E2E: expired signed URL → re-sign succeeds; record older than retention window removed |
| QA Dashboard Enhanced Requirements | PIT-FR-120 | PIT-TR-123 | QA Dashboard — evidence visibility, run details | `qa_runs` table; evidence artifact links; `/qa-dashboard` component | E2E: cs2_admin sees wave evidence links; non-admin sees permission-denied; all five states present |
| Lifecycle Removal Semantics | PIT-FR-121 | PIT-TR-124 | Data model / API — soft-delete, archive, restore, cancel | `archived_at` column on entity tables; restore API; archive/restore audit log | E2E: archive task → excluded from progress roll-up; restore → re-included; cancel → cancellation_reason stored |
| Accessibility Minimum Outcomes | PIT-FR-122 | PIT-TR-125 | Frontend — WCAG 2.1 AA compliance | Axe-core integration; keyboard focus management; colour contrast enforcement | Build: axe-core zero violations; E2E: keyboard navigation to all primary actions; Lighthouse accessibility ≥ 90 |
| Bulk Operations Non-Scope | PIT-FR-123 | PIT-TR-126 | Non-functional — explicit v1 exclusion | No implementation required in v1 | Test: no bulk-create, CSV-import, or project-template routes exist in deployed app |

---

**End of PIT FRS-to-TRS Traceability Matrix v0.2-draft**

---

**Template Version**: 1.0.0
**Template Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0
**Last Updated**: 2026-05-08 (retrofit wave maturion-isms#1575 / PR #1576 — Section 30 added; coverage updated to 123 FRS requirements)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
