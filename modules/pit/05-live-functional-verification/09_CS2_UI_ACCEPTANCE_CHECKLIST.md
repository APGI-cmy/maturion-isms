# 09 — CS2 UI Acceptance Checklist
<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4 | Issue: maturion-isms#1617 -->
<!-- PIT instantiation | Issue: maturion-isms#1623 | PR: #1624 -->

## Header

| Field | Value |
|-------|-------|
| Module | PIT (Project Implementation Tracker) |
| Wave | pit-lfv-package-20260512 |
| PR | #1624 |
| Issue | maturion-isms#1623 |
| Date | 2026-05-12 |
| Author | foreman-v2-agent |
| CS2 Reviewer | Johan Ras (@APGI-cmy) |
| Status | DESIGN ARTIFACT — awaiting live deployment for execution |

---

## Purpose

This checklist is for **CS2 (Johan Ras)** to complete manually against a live deployed PIT URL. It is the final L3 closure artifact. **FUNCTIONAL_PASS cannot be claimed until Johan Ras has completed this checklist and signed off.**

CS2 must verify each item personally in a browser against the live deployment URL. Screenshots are strongly recommended as evidence for each section.

---

## Completion Instructions

1. Open the live PIT deployment URL in a browser (Chrome or Firefox recommended)
2. Use the `x-vercel-protection-bypass` query parameter if Vercel Protection is active
3. Work through each section in order
4. Check each item when verified
5. Note any failures with description and screenshot
6. Sign off at the end of the document

**Deployment URL Tested**: _________________________  
**Date of Verification**: _________________________  
**Git SHA of Deployment**: _________________________

---

## Section 1: Login and Authenticated Navigation

### 1.1 Login Page
- [ ] `/login` page renders without white screen
- [ ] Email and password fields present and accept input
- [ ] "Sign In" button present
- [ ] Login with valid `project_manager` credentials succeeds
- [ ] Redirect to `/dashboard` occurs after successful login
- [ ] No console errors on login page or post-login (check browser DevTools)

### 1.2 Session and Navigation
- [ ] Dashboard renders with user name visible in navigation
- [ ] Organisation name "PIT Test Organisation" visible in nav header
- [ ] Navigation sidebar/header shows: Dashboard, Projects, My Work, Notifications
- [ ] Session persists on page reload (no re-login required)
- [ ] Logout button functional; redirects to `/login`

### 1.3 Authentication Failure Path
- [ ] Invalid credentials show error message (not white screen, not crash)
- [ ] Error message is clear and user-actionable

**Section 1 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 2: Project Lifecycle (Create → Milestone → Deliverable → Task)

### 2.1 Project Creation
- [ ] `/projects` list renders with existing projects
- [ ] "New Project" button visible (project_manager role)
- [ ] `/projects/new` form renders with Name, Description, Start Date, End Date fields
- [ ] Create project "CS2 LFV Project [date]" succeeds
- [ ] Redirect to `/projects/:id` after creation
- [ ] "CS2 LFV Project [date]" appears in `/projects` list
- [ ] Project appears on `/dashboard` summary

### 2.2 Milestone Creation
- [ ] `/projects/:id/milestones` renders with empty state
- [ ] "Add Milestone" button present
- [ ] Milestone form renders with Name, Due Date fields
- [ ] Create milestone "CS2-M1 Milestone" succeeds
- [ ] Milestone appears in list without page reload
- [ ] Milestone available in deliverable/task milestone dropdowns

### 2.3 Deliverable Creation
- [ ] `/projects/:id/deliverables` renders
- [ ] "Add Deliverable" button present
- [ ] Deliverable form renders with Name, Milestone (dropdown), Due Date fields
- [ ] Milestone dropdown shows "CS2-M1 Milestone"
- [ ] Create deliverable "CS2-D1 Deliverable" succeeds
- [ ] Deliverable appears in list linked to correct milestone

### 2.4 Task Creation and Assignment
- [ ] `/projects/:id/tasks` renders
- [ ] "Add Task" button present
- [ ] Task form renders with Title, Assignee (dropdown), Due Date, Deliverable (dropdown) fields
- [ ] Assignee dropdown lists all org members (including contributor)
- [ ] Create task "CS2 Task — LFV" assigned to contributor succeeds
- [ ] Task appears in task list with "Not Started" badge and assignee shown
- [ ] Task visible on `/projects/:id/timeline`
- [ ] Assigned contributor sees task in `/my-work` (log in as contributor to verify)

**Section 2 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 3: Timeline View and Drag Behaviour

### 3.1 Timeline Load
- [ ] `/projects/:id/timeline` renders without white screen
- [ ] Gantt bars present for all tasks
- [ ] Milestone markers visible (diamond or distinct icon)
- [ ] Date axis is correct and proportional to project duration
- [ ] Hover on task bar shows tooltip: task name, assignee, dates, status
- [ ] Horizontal scroll functional

### 3.2 Timeline Drag/Resize
- [ ] Drag handle appears when hovering task bar
- [ ] Task bar can be dragged to new date position
- [ ] Date tooltip updates during drag showing proposed new dates
- [ ] On drop: PATCH sent to update task dates (visible in DevTools Network tab)
- [ ] Task bar renders at new position after save
- [ ] Page reload confirms dates persisted (not reverted)
- [ ] Resize (drag right edge) updates end date only

**Section 3 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 4: Evidence Upload and Approval Workflow

### 4.1 Evidence Upload (as contributor)
- [ ] Task detail view shows "Upload Evidence" button (contributor role)
- [ ] File picker opens on click
- [ ] Upload of `test-evidence.pdf` (≤50KB PDF) succeeds
- [ ] Success message/toast shown after upload
- [ ] Evidence item appears in task view with "Pending Review" badge
- [ ] Evidence visible at `/projects/:id/evidence` with "Pending Review" status

### 4.2 Evidence Approval (as project_manager)
- [ ] `/projects/:id/evidence` lists uploaded evidence
- [ ] Evidence detail panel opens on click
- [ ] File preview or download link present
- [ ] "Approve" button present and functional
- [ ] Clicking "Approve" changes badge to "Approved" (green)
- [ ] Reviewer name and timestamp shown on approved item
- [ ] Contributor receives notification (check notification bell)

### 4.3 Evidence Return (as project_manager)
- [ ] "Return" button present on evidence detail
- [ ] Return modal prompts for reason/comment
- [ ] Submitting return changes badge to "Returned" (amber)
- [ ] Return comment visible on evidence item
- [ ] Contributor receives "Evidence returned" notification

**Section 4 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 5: Notification Receipt and Mark-As-Read

### 5.1 Notification Generation
- [ ] Notification bell shows count incremented after task assignment (without page reload)
- [ ] Realtime notification delivery works (count changes within ~5 seconds)
- [ ] Notification dropdown opens on bell click

### 5.2 Notification Content and Navigation
- [ ] Notification items show relevant action description (e.g. "You have been assigned to: CS2 Task — LFV")
- [ ] Clicking notification navigates to relevant task/resource

### 5.3 Mark-As-Read
- [ ] "Mark Read" action (click or explicit button) marks notification as read
- [ ] Bell count decrements after marking read
- [ ] Read notification shown in grey/muted style (visually distinct from unread)
- [ ] All unread notifications can be marked read at once (if bulk-read feature present)

### 5.4 Notification History
- [ ] `/notifications` page renders all notification history
- [ ] Events include: task assignment, evidence approved/returned
- [ ] Timestamps are accurate
- [ ] Read/unread status correctly reflected in history

**Section 5 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 6: Report Generation, Download, and History

### 6.1 Report Generation
- [ ] `/projects/:id/reports` renders with empty state or existing history
- [ ] "Generate Report" button present (project_manager role)
- [ ] Report options modal opens: type (Summary/Full), format (PDF/XLSX)
- [ ] Generating "Summary PDF" report triggers loading indicator
- [ ] Report generation completes (no timeout or error)
- [ ] Report appears in history list after generation

### 6.2 Report History
- [ ] Report entry shows: filename, report type, generated date, generated by, download link
- [ ] Multiple reports can be generated and all appear in history
- [ ] History persists on page reload

### 6.3 Report Download
- [ ] Download link produces valid PDF download
- [ ] PDF opens without corruption
- [ ] PDF contains project data (project name, tasks, milestones visible in content)
- [ ] Download works from history on subsequent visits

**Section 6 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 7: Audit Log Display (cs2_admin)

### 7.1 Audit Log Access
- [ ] Login as `cs2_admin`
- [ ] `/admin/audit-log` renders audit event table
- [ ] No white screen or 403 for cs2_admin

### 7.2 Audit Log Content
- [ ] `PROJECT_CREATED` event visible (from Section 2.1)
- [ ] `TASK_CREATED` event visible (from Section 2.4)
- [ ] `TASK_ASSIGNED` event visible (from Section 2.4)
- [ ] `EVIDENCE_UPLOADED` event visible (from Section 4.1)
- [ ] `EVIDENCE_APPROVED` event visible (from Section 4.2)
- [ ] `REPORT_GENERATED` event visible (from Section 6.1)
- [ ] Each event shows: timestamp, actor email/name, event type, resource ID

### 7.3 Audit Log Filtering
- [ ] Filter by event type works (e.g. filter to "PROJECT_CREATED" only)
- [ ] Filter by user/actor works
- [ ] Filter by date range works (if implemented)
- [ ] Clear filters restores full list

### 7.4 Org-Scoped Access (org_admin)
- [ ] Login as `org_admin`
- [ ] `/admin/audit-log` shows events for "PIT Test Organisation" only
- [ ] Cross-org events NOT visible to org_admin

### 7.5 Permission Denied (contributor)
- [ ] Login as `contributor`
- [ ] `/admin/audit-log` shows permission-denied screen (NOT the audit data)
- [ ] No 500 error — clean denial

**Section 7 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 8: QA Dashboard Visibility (cs2_admin)

### 8.1 cs2_admin Access
- [ ] Login as `cs2_admin`
- [ ] `/qa-dashboard` renders without white screen
- [ ] QA data visible: wave information, test run metrics, coverage statistics
- [ ] `qa_runs` table data visible (at least one row)
- [ ] No 403 or 500 errors

### 8.2 cs2_admin Only — Other Roles Denied
- [ ] Login as `org_admin` → `/qa-dashboard` shows permission-denied
- [ ] Login as `project_manager` → `/qa-dashboard` shows permission-denied
- [ ] Login as `contributor` → `/qa-dashboard` shows permission-denied
- [ ] Login as `viewer` → `/qa-dashboard` shows permission-denied
- [ ] None of the above receive 500 or see actual QA data

**Section 8 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 9: Permission Denied for Non-Authorised Roles

### 9.1 Viewer Role Restrictions
- [ ] Login as `viewer`
- [ ] `/projects` renders in read-only mode (no Create button)
- [ ] `/projects/new` navigated directly → permission-denied screen (not a form)
- [ ] `/projects/:id/tasks` shows tasks but no "Add Task" or edit controls
- [ ] POST `/rest/v1/projects` via DevTools returns HTTP 403 (RLS enforced)
- [ ] `/admin/org` → permission-denied
- [ ] `/admin/users` → permission-denied
- [ ] `/qa-dashboard` → permission-denied

### 9.2 Contributor Restrictions
- [ ] Login as `contributor`
- [ ] `/projects/new` → permission-denied
- [ ] Evidence approve/return buttons NOT visible (read-only evidence view)
- [ ] Report generate button NOT visible
- [ ] `/admin/audit-log` → permission-denied
- [ ] `/qa-dashboard` → permission-denied

### 9.3 Unauthenticated Access
- [ ] `/dashboard` with no session → redirect to `/login`
- [ ] `/projects` with no session → redirect to `/login`
- [ ] `/admin/audit-log` with no session → redirect to `/login`
- [ ] Public routes accessible: `/login`, `/signup`, `/forgot-password`

**Section 9 Result**: PASS / FAIL  
**Notes**: _________________________

---

## Section 10: AIMC Suggestion Flow (Accept / Dismiss)

*(Skip this section if `AIMC_TEST_ENABLED = false` in the test environment)*

### 10.1 AIMC Suggestion Request
- [ ] Login as `contributor`
- [ ] Open task detail for an assigned task
- [ ] "Get AI Suggestion" button visible
- [ ] Clicking button shows loading indicator
- [ ] Suggestion card appears with AI-generated text (within ~10 seconds)
- [ ] No white screen or error on suggestion load

### 10.2 Accept Flow
- [ ] "Accept" button present on suggestion card
- [ ] Clicking "Accept" applies suggestion text to task description/notes
- [ ] Success confirmation shown
- [ ] Task content updated on page
- [ ] Audit log (cs2_admin view) shows `AIMC_SUGGESTION_ACCEPTED` event

### 10.3 Dismiss Flow
- [ ] "Dismiss" button present on suggestion card
- [ ] Clicking "Dismiss" removes suggestion card
- [ ] Task content unchanged after dismiss
- [ ] Audit log (cs2_admin view) shows `AIMC_SUGGESTION_DISMISSED` event

### 10.4 AIMC Gateway Verification
- [ ] DevTools Network tab shows call to `/functions/v1/pit-task-advisor` (Edge Function)
- [ ] NO direct calls to OpenAI, Anthropic, or other AI provider endpoints visible
- [ ] All AI traffic routes through the Maturion AIMC Gateway

**Section 10 Result**: PASS / FAIL / SKIPPED (if AIMC disabled)  
**Notes**: _________________________

---

## Section 11: Mobile Responsiveness (if applicable)

*(Optional — verify if mobile responsiveness is a Stage 2/3 requirement for PIT)*

### 11.1 Mobile Viewport (375px width — iPhone 14 equivalent)
- [ ] `/login` renders correctly (no overflow, no cropped inputs)
- [ ] `/dashboard` renders correctly (responsive layout active)
- [ ] `/projects/:id/tasks` renders correctly (task list readable)
- [ ] Navigation collapses to hamburger or bottom nav on mobile
- [ ] Forms are usable on mobile viewport (no inputs cut off)

### 11.2 Tablet Viewport (768px width — iPad equivalent)
- [ ] `/projects/:id/timeline` renders on tablet (Gantt visible, may show simplified view)
- [ ] `/projects/:id/evidence` renders on tablet

**Section 11 Result**: PASS / FAIL / N/A  
**Notes**: _________________________

---

## IAA Verdict Fields

| Field | Value (to be completed by CS2) |
|-------|-------------------------------|
| **ADMIN_PASS** | yes / no |
| **ADMIN_PASS notes** | (Evidence: LFV artifacts present in PR #1624) |
| **CODE_PASS** | yes / no |
| **CODE_PASS notes** | (Evidence: CI build/test results from PR checks) |
| **FUNCTIONAL_PASS** | yes / no |
| **FUNCTIONAL_PASS notes** | (Evidence: This checklist + LFV workflow artifacts) |

> **FUNCTIONAL_PASS requires**:
> 1. Deployed LFV workflow evidence (all 8 gates PASS, all 5 artifacts present)
> 2. CS2 manual verification of this checklist (all sections PASS)
> 3. CS2 sign-off below

---

## CS2 Sign-Off

| Field | Value |
|-------|-------|
| **Reviewer** | Johan Ras (@APGI-cmy) |
| **Deployment URL Verified** | ___________________________ |
| **Git SHA Verified** | ___________________________ |
| **Date of Verification** | ___________________________ |
| **Overall Result** | PASS / FAIL |
| **Sections Failed** | (list section numbers, or "none") |
| **Blocking Issues** | (describe any P0 failures, or "none") |
| **FUNCTIONAL_PASS Granted** | yes / no |
| **CS2 Signature** | @APGI-cmy |

---

## Distinction Between ADMIN, CODE, and FUNCTIONAL PASS

| Tier | Definition | Who Grants | When |
|------|-----------|-----------|------|
| **ADMIN_PASS** | All governance ceremony artifacts present in the PR | IAA (automated check) | When PR #1624 merges with all 10 LFV files present |
| **CODE_PASS** | CI tests pass, build succeeds, lint clean | IAA (CI gates) | When Stage 12 build wave CI is green |
| **FUNCTIONAL_PASS** | Deployed LFV workflow evidence + CS2 UI acceptance | CS2 (Johan Ras) manually | After Stage 12 build, deployment, and LFV workflow run |

> **FUNCTIONAL_PASS: yes CANNOT be claimed based on governance artifacts alone.**  
> It requires live deployment + live verification workflow run + this checklist completed by CS2.  
> This wave (PR #1624) claims ADMIN_PASS only.

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
