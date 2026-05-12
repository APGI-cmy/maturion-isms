# 01 — Functional User Journey Contract
<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4 | Issue: maturion-isms#1617 -->
<!-- PIT instantiation | Issue: maturion-isms#1619 | PR: #1624 -->

## Header

| Field | Value |
|-------|-------|
| Module | PIT (Project Implementation Tracker) |
| Wave | pit-lfv-package-20260512 |
| PR | #1624 |
| Issue | maturion-isms#1619 |
| Date | 2026-05-12 |
| Author | foreman-v2-agent |
| Status | DESIGN ARTIFACT — not a deployment claim |

---

## Purpose

This contract defines the **minimum set of functional user journeys** that MUST be demonstrated in a live, deployed PIT environment before the module can claim FUNCTIONAL_PASS. Each journey is expressed as an ordered step table with actor, action, expected result, and explicit success/failure criteria.

These journeys are derived from:
- PIT App Description v1.0 (`modules/pit/00-app-description/app-description.md`)
- UX Workflow & Wiring Spec v0.2-draft (`modules/pit/01-ux-workflow-wiring-spec/`)
- PIT FRS v0.2-hardened (`modules/pit/02-frs/functional-requirements.md`)
- PIT TRS v0.2-draft (`modules/pit/03-trs/technical-requirements-specification.md`)
- PIT Architecture (`modules/pit/04-architecture/`)

**FUNCTIONAL_PASS cannot be claimed until all 16 journeys below pass in a live deployed environment with screenshot + network evidence.**

---

## Journey 1: Login / Session Restoration

**Actor**: Unauthenticated user (any role)  
**Starting State**: User is not logged in; browser has no active session cookie; visiting `/login`  
**Ending State**: User is authenticated, `access_token` cookie set, redirected to `/dashboard`  
**Roles Required**: Any registered user (test with `project_manager`)

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | Unauthenticated user | Navigate to `https://<deployment-url>/login` | Login page renders with email + password fields; no white screen |
| 2 | Unauthenticated user | Enter valid email (`pit.pm@test.maturion.dev`) and password | Fields accept input without error |
| 3 | Unauthenticated user | Click "Sign In" button | POST to Supabase Auth `/auth/v1/token?grant_type=password`; spinner visible |
| 4 | Supabase Auth | Returns 200 with `access_token` + `refresh_token` | Session established; JWT stored in client |
| 5 | Browser | Redirect to `/dashboard` | Dashboard renders; nav shows user name + organisation |
| 6 | User | Reload the browser tab | Session restored from refresh token; dashboard still rendered (no re-login prompt) |

**Success Criteria**:
- [ ] Login page renders without white screen or console errors
- [ ] Valid credentials authenticate successfully (HTTP 200 from Supabase)
- [ ] User is redirected to `/dashboard` after login
- [ ] Dashboard renders user name and organisation in nav shell
- [ ] Session survives page reload (refresh token works)

**Failure Criteria**:
- [ ] Login page shows white screen or JavaScript error
- [ ] Authentication returns non-200 with valid credentials
- [ ] Redirect does not occur (user stuck on `/login`)
- [ ] Dashboard shows blank content panel after login
- [ ] Session lost on reload (user returned to `/login`)

---

## Journey 2: Onboarding / Organisation Context Selection

**Actor**: Newly registered user  
**Starting State**: User has completed email verification; first login; no org context set  
**Ending State**: User has selected their organisation and is routed to `/dashboard` with org context active  
**Roles Required**: `project_manager` (newly provisioned)

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | New user | First login after email verification | System detects no org context; redirects to `/onboarding` |
| 2 | New user | `/onboarding` screen renders | Organisation picker renders with list of orgs user belongs to (or invitation flow) |
| 3 | New user | Selects "PIT Test Organisation" from list | Org context stored in user session / `user_org_memberships` |
| 4 | New user | Clicks "Continue" | Redirected to `/dashboard` with org context active |
| 5 | Dashboard | Renders with org context | Org name "PIT Test Organisation" visible in top nav; projects for that org listed |

**Success Criteria**:
- [ ] Newly created user without org context is redirected to `/onboarding`
- [ ] Onboarding page renders organisation list without error
- [ ] Organisation selection persists to session
- [ ] User reaches `/dashboard` with correct org name displayed

**Failure Criteria**:
- [ ] New user lands on `/dashboard` with no org context (blank state without guidance)
- [ ] `/onboarding` page renders white screen
- [ ] Org selection does not persist; user re-prompted on next load

---

## Journey 3: Project Creation

**Actor**: `project_manager`  
**Starting State**: Logged in as `project_manager`; on `/projects` page  
**Ending State**: New project exists in `projects` table; appears on `/projects` list and `/dashboard`  
**Roles Required**: `project_manager`, `org_admin`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects` | Projects list page renders; "New Project" button visible |
| 2 | project_manager | Click "New Project" button | Routed to `/projects/new`; project creation form renders |
| 3 | project_manager | Fill in: Name "Test Project Alpha", description, start date, end date | Form fields accept input; date picker functional |
| 4 | project_manager | Click "Create Project" | POST to `/rest/v1/projects`; loading indicator shown |
| 5 | Supabase | INSERT into `projects` table | HTTP 201 returned; project record created with `org_id` and `created_by` |
| 6 | Browser | Redirect to `/projects/:id` for newly created project | Project detail page renders with project name "Test Project Alpha" |
| 7 | project_manager | Navigate to `/projects` | "Test Project Alpha" appears in the project list |
| 8 | project_manager | Navigate to `/dashboard` | Dashboard shows "Test Project Alpha" in project summary |

**Success Criteria**:
- [ ] `/projects/new` form renders all required fields
- [ ] POST to `/rest/v1/projects` returns HTTP 201
- [ ] Project appears in `projects` table (verified via Supabase dashboard or API)
- [ ] Redirect to `/projects/:id` occurs after creation
- [ ] Project appears on `/projects` list
- [ ] Project appears on `/dashboard` project summary

**Failure Criteria**:
- [ ] Create form shows white screen or missing fields
- [ ] POST returns non-201 (400/403/500)
- [ ] Project not created in database
- [ ] No redirect after creation
- [ ] Project absent from `/projects` list or `/dashboard`
- [ ] `audit_log` entry NOT written for project creation

---

## Journey 4: Milestone Creation

**Actor**: `project_manager`  
**Starting State**: Logged in; existing project "Test Project Alpha" at `/projects/:id`  
**Ending State**: New milestone exists in `milestones` table; appears on `/projects/:id/milestones`  
**Roles Required**: `project_manager`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects/:id/milestones` | Milestones screen renders; "Add Milestone" button visible; empty state message shown |
| 2 | project_manager | Click "Add Milestone" | Modal or inline form opens with Name, Due Date, Description fields |
| 3 | project_manager | Fill in: Name "M1 — Requirements Complete", Due Date (2 weeks out) | Form accepts input |
| 4 | project_manager | Click "Save Milestone" | POST to `/rest/v1/milestones`; loading state shown |
| 5 | Supabase | INSERT into `milestones` table | HTTP 201 returned; milestone linked to project via `project_id` |
| 6 | Browser | Milestone "M1 — Requirements Complete" appears in milestones list | No page reload required (optimistic or refetch) |

**Success Criteria**:
- [ ] Milestones screen renders with empty state for new project
- [ ] Add Milestone form opens with correct fields
- [ ] POST to `/rest/v1/milestones` returns HTTP 201
- [ ] Milestone appears in list without full page reload
- [ ] `audit_log` entry written for milestone creation

**Failure Criteria**:
- [ ] Milestones screen renders white screen or 403
- [ ] Milestone form missing required fields
- [ ] POST returns non-201
- [ ] Milestone not visible in list after save

---

## Journey 5: Deliverable Creation

**Actor**: `project_manager`  
**Starting State**: Logged in; milestone "M1 — Requirements Complete" exists under "Test Project Alpha"  
**Ending State**: New deliverable exists in `deliverables` table; visible on `/projects/:id/deliverables`  
**Roles Required**: `project_manager`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects/:id/deliverables` | Deliverables screen renders; "Add Deliverable" button visible |
| 2 | project_manager | Click "Add Deliverable" | Form opens with Name, Description, Milestone (dropdown), Due Date |
| 3 | project_manager | Fill Name "D1 — FRS Document", select milestone "M1", set due date | Milestone dropdown shows "M1 — Requirements Complete" |
| 4 | project_manager | Click "Save" | POST to `/rest/v1/deliverables`; HTTP 201 returned |
| 5 | Browser | Deliverable "D1 — FRS Document" appears in deliverables list | Linked to milestone M1 displayed |

**Success Criteria**:
- [ ] Deliverables screen renders without error
- [ ] Milestone dropdown is populated with project milestones
- [ ] POST to `/rest/v1/deliverables` returns HTTP 201
- [ ] Deliverable appears in list linked to correct milestone

**Failure Criteria**:
- [ ] Deliverables screen blank or 403
- [ ] Milestone dropdown empty (join not working)
- [ ] POST returns non-201
- [ ] Deliverable absent from list after save

---

## Journey 6: Task Creation and Assignment

**Actor**: `project_manager` (create + assign); `contributor` (receives assignment notification)  
**Starting State**: Logged in as `project_manager`; deliverable "D1 — FRS Document" exists  
**Ending State**: New task in `tasks` table; assigned to `contributor`; contributor sees task in `/my-work`  
**Roles Required**: `project_manager`, `contributor`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects/:id/tasks` | Tasks screen renders; "Add Task" button visible |
| 2 | project_manager | Click "Add Task" | Task creation form opens: Title, Description, Assignee (dropdown), Due Date, Deliverable (dropdown) |
| 3 | project_manager | Fill: Title "Write FRS Section 1", Assignee = contributor (`pit.contributor@test.maturion.dev`), link to D1 | Form accepts all inputs |
| 4 | project_manager | Click "Create Task" | POST to `/rest/v1/tasks`; HTTP 201 returned; task created with `assigned_to = contributor_user_id` |
| 5 | Supabase | INSERT `tasks` record + generate assignment notification | `notifications` table INSERT for contributor |
| 6 | project_manager | Task "Write FRS Section 1" visible in task list | Task shows status "Not Started", assignee "Contributor" |
| 7 | contributor | Login (separate session) and navigate to `/my-work` | "Write FRS Section 1" appears in My Work task list |
| 8 | contributor | Check notification bell | Notification count incremented; "You have been assigned a task" notification visible |

**Success Criteria**:
- [ ] Task creation form renders with assignee dropdown populated
- [ ] POST to `/rest/v1/tasks` returns HTTP 201
- [ ] Task appears in `/projects/:id/tasks` list
- [ ] Assigned contributor sees task at `/my-work`
- [ ] Assignment notification generated in `notifications` table
- [ ] Notification bell count incremented for contributor

**Failure Criteria**:
- [ ] Assignee dropdown empty (user lookup not working)
- [ ] POST returns non-201
- [ ] Task absent from task list
- [ ] Contributor does not see task in `/my-work`
- [ ] No notification generated

---

## Journey 7: Timeline View Load

**Actor**: `project_manager`  
**Starting State**: Logged in; project with tasks and milestones exists  
**Ending State**: Gantt timeline renders all tasks and milestones with correct date positions  
**Roles Required**: `project_manager`, `team_leader`, `org_admin`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects/:id/timeline` | Timeline screen initiates load; loading skeleton or spinner shown |
| 2 | Supabase | GET tasks + milestones + deliverables for project | Data returned; Gantt bars rendered at correct calendar positions |
| 3 | project_manager | Timeline fully rendered | All tasks shown as horizontal bars; milestones shown as diamonds; date axis correct |
| 4 | project_manager | Hover over task bar | Tooltip shows: task name, assignee, start/end date, status |
| 5 | project_manager | Scroll horizontally on timeline | Timeline pans; all tasks remain anchored to correct dates |

**Success Criteria**:
- [ ] `/projects/:id/timeline` renders without white screen
- [ ] All tasks and milestones visible as Gantt elements
- [ ] Date axis is correct and proportional
- [ ] Hover tooltips display task metadata
- [ ] Horizontal scroll works

**Failure Criteria**:
- [ ] Timeline shows white screen or JavaScript error
- [ ] Tasks/milestones absent from timeline
- [ ] Date axis incorrect or overflows container
- [ ] Tooltips absent or crash

---

## Journey 8: Timeline Drag/Resize

**Actor**: `project_manager`  
**Starting State**: Timeline loaded with at least one task visible  
**Ending State**: Task start/end dates updated in `tasks` table; timeline reflects new position  
**Roles Required**: `project_manager`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Hover over task bar on timeline | Drag handle / resize cursor appears |
| 2 | project_manager | Drag task bar to new date position | Bar follows cursor; date tooltip shows new proposed dates |
| 3 | project_manager | Release drag | PATCH to `/rest/v1/tasks?id=eq.:id` with new `start_date` + `end_date` |
| 4 | Supabase | UPDATE `tasks.start_date` and `tasks.end_date` | HTTP 200 returned |
| 5 | project_manager | Task bar rendered at new position | Timeline refreshes; task shown at updated position |
| 6 | project_manager | Resize task bar (drag right edge) | Bar width changes; `end_date` updated in DB |
| 7 | Supabase | Timeline override request created if drag crosses milestone | `timeline_overrides` INSERT if applicable; approval flow triggered |

**Success Criteria**:
- [ ] Drag handle appears on hover
- [ ] Drag produces a PATCH to tasks endpoint with updated dates
- [ ] Timeline re-renders task at new position after save
- [ ] Resize updates `end_date` only
- [ ] `audit_log` entry written for date change

**Failure Criteria**:
- [ ] Drag is non-functional (no cursor change)
- [ ] PATCH not fired on drop
- [ ] Timeline does not update after save
- [ ] Dates not persisted (page reload reverts position)

---

## Journey 9: Evidence Upload

**Actor**: `contributor`  
**Starting State**: Logged in as `contributor`; task "Write FRS Section 1" exists and is in progress  
**Ending State**: Evidence file stored in `pit-evidence` bucket; record in `evidence_items` table; visible on `/projects/:id/evidence`  
**Roles Required**: `contributor`, `team_leader`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | contributor | Navigate to `/projects/:id/tasks` and open task | Task detail view renders with "Upload Evidence" button |
| 2 | contributor | Click "Upload Evidence" | File picker dialog opens |
| 3 | contributor | Select `test-evidence.pdf` (≤50KB) | File selected; name shown in upload area |
| 4 | contributor | Click "Upload" | POST to `/storage/v1/object/evidence/{org_id}/{project_id}/{task_id}/test-evidence.pdf` |
| 5 | Supabase Storage | File stored in `pit-evidence` bucket | HTTP 200 returned; file path returned |
| 6 | Supabase | INSERT into `evidence_items` table | Record: `task_id`, `file_path`, `uploader_id`, `status = 'pending_review'`, `uploaded_at` |
| 7 | Browser | Success toast displayed; evidence listed under task | Evidence item "test-evidence.pdf" visible with status "Pending Review" |
| 8 | contributor | Navigate to `/projects/:id/evidence` | Evidence tab shows uploaded file with status, uploader, upload date |

**Success Criteria**:
- [ ] Upload button renders on task detail
- [ ] POST to Storage endpoint returns HTTP 200
- [ ] File is retrievable from `pit-evidence` bucket
- [ ] `evidence_items` record created with `status = 'pending_review'`
- [ ] Evidence appears on `/projects/:id/evidence`
- [ ] File size ≤50MB upload enforced (UI rejects oversized files)
- [ ] `audit_log` entry written for evidence upload

**Failure Criteria**:
- [ ] Upload button absent from task detail
- [ ] Storage POST returns non-200
- [ ] File not found in `pit-evidence` bucket
- [ ] `evidence_items` record absent
- [ ] Evidence not visible on evidence tab

---

## Journey 10: Evidence Review — Approve / Return

**Actor**: `project_manager` (reviews); `contributor` (receives notification)  
**Starting State**: `contributor` has uploaded evidence (Journey 9 complete); evidence `status = 'pending_review'`  
**Ending State**: Evidence approved (`status = 'approved'`) or returned (`status = 'returned'` with comment)  
**Roles Required**: `project_manager`, `team_leader`, `org_admin`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects/:id/evidence` | Evidence list renders; "test-evidence.pdf" shows "Pending Review" badge |
| 2 | project_manager | Click on evidence item | Evidence detail panel opens; preview or download link present |
| 3 | project_manager | Click "Approve" button | PATCH to `/rest/v1/evidence_items?id=eq.:id` body: `{status: 'approved'}` |
| 4 | Supabase | UPDATE `evidence_items.status = 'approved'` + `reviewed_by` + `reviewed_at` | HTTP 200 returned |
| 5 | Browser | Evidence badge changes to "Approved" (green) | Status reflected immediately in UI |
| 6 | Supabase | Notification INSERT for contributor | contributor notified: "Your evidence has been approved" |
| 7 | **Alternate path** | project_manager clicks "Return" instead | Modal prompts for return comment |
| 8 | project_manager | Enters return reason; clicks "Submit Return" | PATCH: `{status: 'returned', return_comment: '...'}` |
| 9 | Browser | Evidence badge changes to "Returned" (amber); comment visible | Contributor notified: "Evidence returned — action required" |

**Success Criteria**:
- [ ] Evidence list distinguishes pending/approved/returned states visually
- [ ] Approve action sends PATCH; `status` updates to `'approved'` in DB
- [ ] Return action requires a comment; `status` updates to `'returned'`
- [ ] Contributor receives notification for both approve and return outcomes
- [ ] `audit_log` entry written for approval/return decision

**Failure Criteria**:
- [ ] Status badge not visible or incorrect
- [ ] Approve/Return buttons absent or non-functional
- [ ] PATCH returns non-200
- [ ] Status not persisted after page reload
- [ ] No notification generated for contributor

---

## Journey 11: Notification Generation and Mark-As-Read

**Actor**: `contributor` (receives); `project_manager` (triggers)  
**Starting State**: `contributor` is logged in; a task assignment event triggers a new notification  
**Ending State**: Notification count decremented; notification marked read in `notifications` table  
**Roles Required**: `contributor`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Assigns a task to contributor (or approves/returns evidence) | `notifications` INSERT for `contributor` via Supabase Realtime or Edge Function |
| 2 | contributor | Notification bell count increments (Realtime subscription) | Badge shows new unread count (e.g. "1") without page reload |
| 3 | contributor | Clicks notification bell | Notification dropdown or `/notifications` page opens; new notification listed |
| 4 | contributor | Clicks on notification item | Notification detail shown; navigates to relevant task/evidence |
| 5 | contributor | Mark notification as read (click "Mark Read" or auto-read on open) | PATCH to `/rest/v1/notifications?id=eq.:id` body: `{read_at: now()}` |
| 6 | Supabase | UPDATE `notifications.read_at` | HTTP 200 returned |
| 7 | Browser | Notification bell count decrements; item shown as read (grey) | Count badge removed if all read |
| 8 | contributor | Navigate to `/notifications` | Full notification history shows the event with read status |

**Success Criteria**:
- [ ] Notification badge increments without page reload (Realtime working)
- [ ] Notification item appears in dropdown/page
- [ ] Mark-as-read PATCH returns HTTP 200
- [ ] Bell count decrements after mark-as-read
- [ ] Notification history visible at `/notifications`

**Failure Criteria**:
- [ ] Notification badge does not increment (Realtime not connected)
- [ ] Notification item absent
- [ ] Mark-as-read fails (non-200 or count does not change)
- [ ] `/notifications` renders white screen

---

## Journey 12: Report Generation / Download / History

**Actor**: `project_manager`  
**Starting State**: Logged in; project with tasks, milestones, deliverables exists  
**Ending State**: PDF/XLSX report in `pit-reports` bucket; record in `report_history`; report downloadable from `/projects/:id/reports`  
**Roles Required**: `project_manager`, `org_admin`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | project_manager | Navigate to `/projects/:id/reports` | Reports screen renders; "Generate Report" button visible; history list (empty) |
| 2 | project_manager | Click "Generate Report" | Report configuration modal opens: report type (Summary/Full), format (PDF/XLSX) |
| 3 | project_manager | Select "Summary PDF" and click "Generate" | POST to `/functions/v1/generate-report` with `project_id` + report options |
| 4 | Edge Function `generate_report` | Compiles project data; generates PDF | Calls AIMC Gateway for summary text if applicable |
| 5 | Edge Function | Uploads PDF to `pit-reports/{org_id}/{project_id}/{filename}` | Supabase Storage PUT |
| 6 | Edge Function | INSERT into `report_history` table | Record: `project_id`, `report_type`, `file_path`, `generated_by`, `generated_at` |
| 7 | Edge Function | Returns HTTP 200 with `{file_url, report_id}` | Client receives response |
| 8 | Browser | Report appears in report history list; progress indicator resolves | "Summary-YYYYMMDD.pdf" listed with timestamp |
| 9 | project_manager | Clicks download on report entry | GET signed URL from `/storage/v1/object/pit-reports/...` |
| 10 | Browser | PDF downloads to local machine | Browser opens Save dialog or PDF viewer |

**Success Criteria**:
- [ ] `/projects/:id/reports` renders without error
- [ ] POST to `generate-report` Edge Function returns HTTP 200
- [ ] Report file exists in `pit-reports` bucket
- [ ] `report_history` record created
- [ ] Report appears in history list
- [ ] Download link produces a valid PDF
- [ ] `audit_log` entry written for report generation

**Failure Criteria**:
- [ ] Generate Report button absent or non-functional
- [ ] Edge Function returns non-200 (400/500)
- [ ] File absent from `pit-reports` bucket
- [ ] Report absent from history list
- [ ] Download link broken or returns 403

---

## Journey 13: Audit Log Entry Creation and Display

**Actor**: `cs2_admin` (views); state-changing events (write)  
**Starting State**: Several state changes have occurred (project create, task assign, evidence upload)  
**Ending State**: All state changes visible in audit log at `/admin/audit-log`  
**Roles Required**: `cs2_admin`, `org_admin` (scoped view)

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | cs2_admin | Navigate to `/admin/audit-log` | Audit log screen renders; table of audit events shown |
| 2 | cs2_admin | View audit log entries | Project creation event present; task assignment event present; evidence upload event present |
| 3 | cs2_admin | Filter by event type "PROJECT_CREATED" | Only project creation events shown |
| 4 | cs2_admin | Filter by user (contributor) | Shows only events by contributor user |
| 5 | cs2_admin | Click export (if available) | CSV/JSON export of audit log initiated |
| 6 | org_admin | Navigate to `/admin/audit-log` | Sees audit events for their org only (row-level filter active) |
| 7 | contributor | Attempt to navigate to `/admin/audit-log` | Permission-denied screen rendered (403 state) |

**Success Criteria**:
- [ ] `/admin/audit-log` renders audit table for `cs2_admin`
- [ ] All state-changing events (project create, task create, evidence upload, report generate) appear as entries
- [ ] Each entry has: timestamp, actor, event type, resource id, before/after state
- [ ] Filter by event type works
- [ ] Filter by user works
- [ ] `org_admin` sees only org-scoped events
- [ ] `contributor` receives permission-denied (not 500)

**Failure Criteria**:
- [ ] Audit log renders white screen or 500
- [ ] State-changing events absent from log
- [ ] Filters non-functional
- [ ] `contributor` able to access audit log (security failure)
- [ ] Events lack timestamp or actor attribution

---

## Journey 14: QA Dashboard Visibility

**Actor**: `cs2_admin` (authorised); `viewer` (denied)  
**Starting State**: QA evidence artifacts exist in database; `viewer` is logged in  
**Ending State**: `cs2_admin` sees QA dashboard; `viewer` receives permission denied  
**Roles Required**: `cs2_admin` (permitted), all other roles (denied)

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | cs2_admin | Navigate to `/qa-dashboard` | QA dashboard renders; wave evidence tables visible |
| 2 | cs2_admin | Views `qa_runs` data | Current wave, test run IDs, pass/fail counts, coverage metrics displayed |
| 3 | viewer | Login as `pit.viewer@test.maturion.dev` | Viewer session established |
| 4 | viewer | Navigate to `/qa-dashboard` | Permission-denied screen rendered; no QA data visible |
| 5 | viewer | Inspect network tab | No data fetched for QA tables (RLS blocks query or UI blocks navigation) |
| 6 | project_manager | Navigate to `/qa-dashboard` | Permission-denied screen rendered |
| 7 | org_admin | Navigate to `/qa-dashboard` | Permission-denied screen rendered (only cs2_admin has access) |

**Success Criteria**:
- [ ] `/qa-dashboard` renders full QA data for `cs2_admin`
- [ ] `qa_runs` table data visible with wave evidence
- [ ] `viewer` receives permission-denied state (not white screen, not 500)
- [ ] `project_manager` receives permission-denied
- [ ] `org_admin` receives permission-denied
- [ ] No data leakage in network requests for denied roles

**Failure Criteria**:
- [ ] QA dashboard blank for `cs2_admin` (RLS over-restricting)
- [ ] `viewer` can access QA dashboard (security failure — P0)
- [ ] Non-denied roles see 500 instead of permission-denied
- [ ] QA data visible in network requests despite UI block

---

## Journey 15: Permission-Denied Path

**Actor**: `viewer`  
**Starting State**: Logged in as `viewer`; viewing read-only project data  
**Ending State**: All write actions and admin routes return correct permission-denied states  
**Roles Required**: `viewer`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | viewer | Navigate to `/projects` | Projects list renders (read-only; no create button) |
| 2 | viewer | Attempt direct navigation to `/projects/new` | Permission-denied screen rendered; no form shown |
| 3 | viewer | Navigate to `/projects/:id` (assigned project) | Project detail renders in read-only mode |
| 4 | viewer | Inspect task list `/projects/:id/tasks` | Tasks shown but no "Add Task" or "Edit" buttons visible |
| 5 | viewer | Attempt API call: POST `/rest/v1/projects` (via browser dev tools / Playwright) | HTTP 403 returned (RLS denies INSERT) |
| 6 | viewer | Navigate to `/admin/org` | Permission-denied screen rendered |
| 7 | viewer | Navigate to `/admin/users` | Permission-denied screen rendered |
| 8 | viewer | Navigate to `/qa-dashboard` | Permission-denied screen rendered |

**Success Criteria**:
- [ ] `viewer` can view assigned project data (read paths work)
- [ ] `viewer` cannot see write buttons (create, edit, delete) in UI
- [ ] Direct navigation to write routes renders permission-denied (not 500)
- [ ] API-level POST to `/rest/v1/projects` returns HTTP 403
- [ ] All admin routes return permission-denied for `viewer`

**Failure Criteria**:
- [ ] Write buttons visible to `viewer` in UI
- [ ] `/projects/new` renders form for `viewer`
- [ ] API POST returns 200 (RLS failure — P0 security)
- [ ] Admin routes return 500 instead of permission-denied
- [ ] `viewer` can access `/qa-dashboard` data

---

## Journey 16: AIMC Suggestion Flow (Accept / Dismiss)

**Actor**: `contributor`  
**Starting State**: Logged in as `contributor`; task exists; `AIMC_TEST_ENABLED=true`  
**Ending State**: AI suggestion shown, accepted or dismissed; `audit_log` entry written  
**Roles Required**: `contributor`, `project_manager`, `team_leader`

| Step | Actor | Action | Expected Result |
|------|-------|--------|-----------------|
| 1 | contributor | Open task detail for "Write FRS Section 1" | Task detail renders; "Get AI Suggestion" button visible (AIMC enabled) |
| 2 | contributor | Click "Get AI Suggestion" | POST to `/functions/v1/pit-task-advisor` |
| 3 | Edge Function `pit-task-advisor` | Calls AIMC Gateway → AI provider | Request routed via AIMC Gateway (NO direct provider call) |
| 4 | AIMC Gateway | Returns suggestion text | Suggestion returned to Edge Function |
| 5 | Edge Function | Returns HTTP 200 with `{suggestion, suggestion_id}` | Client receives suggestion text |
| 6 | Browser | AI suggestion card renders | Suggestion text shown with "Accept" and "Dismiss" buttons |
| 7 | contributor | Clicks "Accept" | POST or PATCH applies suggestion text to task description / notes; `audit_log` INSERT: `event_type = 'AIMC_SUGGESTION_ACCEPTED'` |
| 8 | Browser | Task updated with suggestion content | Success toast; task description updated |
| 9 | **Alternate path** | contributor clicks "Dismiss" | PATCH suggestion: `{status: 'dismissed'}`; `audit_log` INSERT: `event_type = 'AIMC_SUGGESTION_DISMISSED'` |
| 10 | Browser | Suggestion card removed | No change to task description |

**Success Criteria**:
- [ ] "Get AI Suggestion" button visible when AIMC enabled
- [ ] POST to `pit-task-advisor` Edge Function returns HTTP 200
- [ ] AIMC Gateway is in the call chain (no direct provider calls)
- [ ] Suggestion card renders with Accept/Dismiss options
- [ ] Accept: task content updated; `audit_log` entry with `AIMC_SUGGESTION_ACCEPTED`
- [ ] Dismiss: task unchanged; `audit_log` entry with `AIMC_SUGGESTION_DISMISSED`

**Failure Criteria**:
- [ ] Suggestion button absent (AIMC not wired to UI)
- [ ] Edge Function returns non-200
- [ ] Direct AI provider call detected (bypasses AIMC — P0 governance)
- [ ] Accept does not update task content
- [ ] `audit_log` entry absent for accept/dismiss action

---

## Journey Summary Table

| # | Journey | Primary Role | Key Route(s) | Blocking for FUNCTIONAL_PASS |
|---|---------|-------------|--------------|-------------------------------|
| 1 | Login / Session Restoration | any | `/login`, `/dashboard` | Yes |
| 2 | Onboarding / Org Selection | new user | `/onboarding`, `/dashboard` | Yes |
| 3 | Project Creation | project_manager | `/projects/new`, `/projects` | Yes |
| 4 | Milestone Creation | project_manager | `/projects/:id/milestones` | Yes |
| 5 | Deliverable Creation | project_manager | `/projects/:id/deliverables` | Yes |
| 6 | Task Creation and Assignment | project_manager | `/projects/:id/tasks`, `/my-work` | Yes |
| 7 | Timeline View Load | project_manager | `/projects/:id/timeline` | Yes |
| 8 | Timeline Drag/Resize | project_manager | `/projects/:id/timeline` | Yes |
| 9 | Evidence Upload | contributor | `/projects/:id/evidence` | Yes |
| 10 | Evidence Review (Approve/Return) | project_manager | `/projects/:id/evidence` | Yes |
| 11 | Notification Generation + Mark-Read | contributor | `/notifications` | Yes |
| 12 | Report Generation/Download/History | project_manager | `/projects/:id/reports` | Yes |
| 13 | Audit Log Display | cs2_admin | `/admin/audit-log` | Yes |
| 14 | QA Dashboard Visibility | cs2_admin / viewer | `/qa-dashboard` | Yes |
| 15 | Permission-Denied Path | viewer | multiple | Yes |
| 16 | AIMC Suggestion Flow | contributor | task detail | Yes |

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
