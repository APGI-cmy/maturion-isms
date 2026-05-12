# 04 — CTA Backend State Map
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
| Status | DESIGN ARTIFACT — not a deployment claim |

---

## Purpose

This map traces every primary Call-To-Action (CTA) in PIT from its UI element through to the backend state change it must produce. Each entry defines: the UI element → the route/screen → the backend target → the affected table/function/storage bucket → the expected state change → the visible confirmation to the user → and the audit/log evidence expected.

During live verification, the verifier MUST confirm both the visible confirmation AND the backend state change for each CTA.

---

## CTA 1: Create Project

| Field | Value |
|-------|-------|
| **UI Element** | "Create Project" submit button on `/projects/new` form |
| **Route / Screen** | `/projects/new` → redirect to `/projects/:id` on success |
| **Backend Endpoint** | `POST /rest/v1/projects` (Supabase REST API) |
| **Affected Table / Resource** | `projects` table — INSERT |
| **Request Body (key fields)** | `{ name, description, start_date, end_date, org_id, created_by }` |
| **Expected State Change** | New row in `projects` where `org_id = TEST_ORG_ID` and `created_by = pm_user_id` |
| **HTTP Response Expected** | 201 Created with project `id` in response body |
| **Visible Confirmation** | Redirect to `/projects/:id`; project name displayed as page heading; project appears in `/projects` list; project count increases on `/dashboard` |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'PROJECT_CREATED'`, `resource_id = project.id`, `actor_id = pm_user_id`, `org_id = TEST_ORG_ID` |
| **Verification Steps** | 1. Submit create form → 2. Confirm HTTP 201 in network tab → 3. Query `projects` table for new row → 4. Confirm project in `/projects` list → 5. Confirm audit_log entry |

---

## CTA 2: Create Milestone

| Field | Value |
|-------|-------|
| **UI Element** | "Save Milestone" button in Add Milestone modal/form on `/projects/:id/milestones` |
| **Route / Screen** | `/projects/:id/milestones` |
| **Backend Endpoint** | `POST /rest/v1/milestones` (Supabase REST API) |
| **Affected Table / Resource** | `milestones` table — INSERT |
| **Request Body (key fields)** | `{ name, description, due_date, project_id, created_by }` |
| **Expected State Change** | New row in `milestones` where `project_id = :id` |
| **HTTP Response Expected** | 201 Created with milestone `id` |
| **Visible Confirmation** | Modal closes; milestone row appears in milestones list without full page reload; milestone available in deliverable/task milestone dropdown |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'MILESTONE_CREATED'`, `resource_id = milestone.id`, `actor_id = pm_user_id` |
| **Verification Steps** | 1. Submit milestone form → 2. Confirm HTTP 201 → 3. Milestone visible in list → 4. Query `milestones` table → 5. Confirm audit_log entry |

---

## CTA 3: Create Deliverable

| Field | Value |
|-------|-------|
| **UI Element** | "Save" button in Add Deliverable form on `/projects/:id/deliverables` |
| **Route / Screen** | `/projects/:id/deliverables` |
| **Backend Endpoint** | `POST /rest/v1/deliverables` (Supabase REST API) |
| **Affected Table / Resource** | `deliverables` table — INSERT |
| **Request Body (key fields)** | `{ name, description, due_date, milestone_id, project_id, created_by }` |
| **Expected State Change** | New row in `deliverables` linked to `milestone_id` |
| **HTTP Response Expected** | 201 Created with deliverable `id` |
| **Visible Confirmation** | Deliverable appears in deliverables list grouped under correct milestone; deliverable available in task creation dropdown |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'DELIVERABLE_CREATED'`, `resource_id = deliverable.id`, `actor_id = pm_user_id` |
| **Verification Steps** | 1. Submit deliverable form → 2. Confirm HTTP 201 → 3. Deliverable visible in list → 4. Confirm milestone grouping → 5. Confirm audit_log entry |

---

## CTA 4: Create Task

| Field | Value |
|-------|-------|
| **UI Element** | "Create Task" button in Add Task form on `/projects/:id/tasks` |
| **Route / Screen** | `/projects/:id/tasks` |
| **Backend Endpoint** | `POST /rest/v1/tasks` (Supabase REST API) |
| **Affected Table / Resource** | `tasks` table — INSERT |
| **Request Body (key fields)** | `{ title, description, deliverable_id, project_id, created_by, status: 'not_started', due_date }` |
| **Expected State Change** | New row in `tasks` with `status = 'not_started'` and `assigned_to = NULL` (assignment via separate CTA 5) |
| **HTTP Response Expected** | 201 Created with task `id` |
| **Visible Confirmation** | Task appears in `/projects/:id/tasks` list with "Not Started" status badge; task visible in timeline at `/projects/:id/timeline` |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'TASK_CREATED'`, `resource_id = task.id`, `actor_id = pm_user_id` |
| **Verification Steps** | 1. Submit task form → 2. Confirm HTTP 201 → 3. Task visible in task list → 4. Task visible on timeline → 5. Confirm audit_log entry |

---

## CTA 5: Assign Task

| Field | Value |
|-------|-------|
| **UI Element** | Assignee dropdown + "Save" in task detail edit mode on `/projects/:id/tasks` |
| **Route / Screen** | `/projects/:id/tasks` (task detail panel or inline edit) |
| **Backend Endpoint** | `PATCH /rest/v1/tasks?id=eq.:task_id` (Supabase REST API) |
| **Affected Table / Resource** | `tasks` table — UPDATE `assigned_to` column |
| **Request Body (key fields)** | `{ assigned_to: contributor_user_id }` |
| **Expected State Change** | `tasks.assigned_to` set to `contributor_user_id`; `notifications` INSERT for assignment notification |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Assignee avatar/name shown in task row; task appears in contributor's `/my-work` list; notification generated for contributor (bell count increments) |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'TASK_ASSIGNED'`, `resource_id = task.id`, `actor_id = pm_user_id`, `meta.assigned_to = contributor_user_id` |
| **Verification Steps** | 1. Select assignee → 2. Confirm PATCH HTTP 200 → 3. Assignee shown in task row → 4. Login as contributor; confirm task in `/my-work` → 5. Confirm notification generated → 6. Confirm audit_log entry |

---

## CTA 6: Change Task Status

| Field | Value |
|-------|-------|
| **UI Element** | Status dropdown / status badge click on task row or task detail |
| **Route / Screen** | `/projects/:id/tasks`, `/my-work` |
| **Backend Endpoint** | `PATCH /rest/v1/tasks?id=eq.:task_id` |
| **Affected Table / Resource** | `tasks` table — UPDATE `status` column |
| **Valid Status Transitions** | `not_started → in_progress → completed`; also `cancelled` from any state |
| **Request Body (key fields)** | `{ status: 'in_progress' }` (or target status) |
| **Expected State Change** | `tasks.status` updated; if status → `completed`, progress rollup triggered via `compute_progress_rollup` Edge Function |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Status badge updates immediately in task list (optimistic or refetch); `/dashboard` progress percentage updates if task completed; notification generated for project_manager when contributor marks complete |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'TASK_STATUS_CHANGED'`, `resource_id = task.id`, `meta.from_status`, `meta.to_status`, `actor_id` |
| **Verification Steps** | 1. Change status → 2. Confirm PATCH HTTP 200 → 3. Badge updated in UI → 4. Confirm dashboard progress updated (if completed) → 5. Confirm notification generated → 6. Confirm audit_log entry |

---

## CTA 7: Upload Evidence

| Field | Value |
|-------|-------|
| **UI Element** | "Upload Evidence" file input + upload button on task detail screen |
| **Route / Screen** | `/projects/:id/tasks` (task detail) or `/projects/:id/evidence` |
| **Backend Endpoint** | `POST /storage/v1/object/evidence/{org_id}/{project_id}/{task_id}/{filename}` (Supabase Storage) |
| **Affected Table / Resource** | `pit-evidence` storage bucket (file stored); `evidence_items` table — INSERT |
| **Request** | Multipart form-data; file ≤50MB; `Authorization: Bearer <access_token>` |
| **Expected State Change** | File stored at `pit-evidence/{org_id}/{project_id}/{task_id}/{filename}`; `evidence_items` record with `status = 'pending_review'`, `task_id`, `uploader_id`, `file_path`, `uploaded_at` |
| **HTTP Response Expected** | 200 OK from Storage API; 201 from `evidence_items` INSERT |
| **Visible Confirmation** | Success toast; evidence listed under task with "Pending Review" badge; evidence visible at `/projects/:id/evidence`; evidence count increases |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'EVIDENCE_UPLOADED'`, `resource_id = evidence_item.id`, `actor_id = contributor_user_id`, `meta.file_name` |
| **Verification Steps** | 1. Select file → 2. Confirm Storage POST HTTP 200 → 3. File retrievable from bucket → 4. `evidence_items` record present → 5. Evidence visible at `/projects/:id/evidence` → 6. Confirm audit_log entry |

---

## CTA 8: Approve Evidence

| Field | Value |
|-------|-------|
| **UI Element** | "Approve" button on evidence detail panel at `/projects/:id/evidence` |
| **Route / Screen** | `/projects/:id/evidence` |
| **Backend Endpoint** | `PATCH /rest/v1/evidence_items?id=eq.:evidence_id` |
| **Affected Table / Resource** | `evidence_items` table — UPDATE `status`, `reviewed_by`, `reviewed_at` |
| **Request Body (key fields)** | `{ status: 'approved', reviewed_by: pm_user_id, reviewed_at: now() }` |
| **Expected State Change** | `evidence_items.status = 'approved'`; notification INSERT for uploader (contributor) |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Evidence badge changes from "Pending Review" to "Approved" (green); contributor notification generated; reviewer name + timestamp shown |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'EVIDENCE_APPROVED'`, `resource_id = evidence_item.id`, `actor_id = pm_user_id` |
| **Verification Steps** | 1. Click Approve → 2. Confirm PATCH HTTP 200 → 3. Badge shows "Approved" → 4. Confirm `evidence_items.status = 'approved'` in DB → 5. Confirm contributor notification → 6. Confirm audit_log entry |

---

## CTA 9: Return Evidence

| Field | Value |
|-------|-------|
| **UI Element** | "Return" button → return comment modal → "Submit Return" on evidence detail |
| **Route / Screen** | `/projects/:id/evidence` |
| **Backend Endpoint** | `PATCH /rest/v1/evidence_items?id=eq.:evidence_id` |
| **Affected Table / Resource** | `evidence_items` table — UPDATE `status`, `return_comment`, `reviewed_by`, `reviewed_at` |
| **Request Body (key fields)** | `{ status: 'returned', return_comment: 'Please include version number', reviewed_by: pm_user_id, reviewed_at: now() }` |
| **Expected State Change** | `evidence_items.status = 'returned'`; `return_comment` persisted; notification INSERT for contributor |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Badge changes to "Returned" (amber); return comment visible on evidence item; contributor notified: "Evidence returned — action required" |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'EVIDENCE_RETURNED'`, `resource_id = evidence_item.id`, `actor_id = pm_user_id`, `meta.return_comment` |
| **Verification Steps** | 1. Click Return → 2. Enter comment → 3. Submit → 4. Confirm PATCH HTTP 200 → 5. Badge shows "Returned" → 6. Return comment visible → 7. Contributor notified → 8. Confirm audit_log entry |

---

## CTA 10: Generate Report

| Field | Value |
|-------|-------|
| **UI Element** | "Generate Report" button → report options modal → "Generate" on `/projects/:id/reports` |
| **Route / Screen** | `/projects/:id/reports` |
| **Backend Endpoint** | `POST /functions/v1/generate-report` (Edge Function) |
| **Affected Table / Resource** | `report_history` table — INSERT; `pit-reports` storage bucket — file PUT |
| **Request Body (key fields)** | `{ project_id, report_type: 'summary', format: 'pdf', requested_by: pm_user_id }` |
| **AIMC Integration** | Edge Function calls AIMC Gateway for summary text generation if applicable (no direct AI provider call) |
| **Expected State Change** | PDF/XLSX file stored at `pit-reports/{org_id}/{project_id}/{filename}`; `report_history` INSERT with `file_path`, `generated_by`, `generated_at`, `report_type` |
| **HTTP Response Expected** | 200 OK from Edge Function with `{ file_url, report_id }` |
| **Visible Confirmation** | Progress indicator resolves; report entry appears in report history list with timestamp + download link |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'REPORT_GENERATED'`, `resource_id = report_history.id`, `actor_id = pm_user_id`, `meta.report_type` |
| **Verification Steps** | 1. Submit generate → 2. Confirm Edge Function HTTP 200 → 3. File in `pit-reports` bucket → 4. `report_history` record present → 5. Report in history list → 6. Confirm audit_log entry |

---

## CTA 11: Download Report

| Field | Value |
|-------|-------|
| **UI Element** | "Download" link on report history entry at `/projects/:id/reports` |
| **Route / Screen** | `/projects/:id/reports` |
| **Backend Endpoint** | `GET /storage/v1/object/pit-reports/{org_id}/{project_id}/{filename}` or signed URL from Supabase Storage |
| **Affected Table / Resource** | `pit-reports` storage bucket — READ |
| **Expected State Change** | No state change; file served to client |
| **HTTP Response Expected** | 200 OK with file content; `Content-Type: application/pdf` (or xlsx equivalent) |
| **Visible Confirmation** | Browser prompts Save dialog or opens PDF viewer; file downloads successfully |
| **Audit / Log Evidence** | `audit_log` INSERT (optional): `event_type = 'REPORT_DOWNLOADED'` — recommended for compliance audit trail |
| **Verification Steps** | 1. Click Download → 2. Confirm GET HTTP 200 → 3. File content is valid PDF → 4. Browser receives file |

---

## CTA 12: Mark Notification Read

| Field | Value |
|-------|-------|
| **UI Element** | Notification item click (auto-read) or explicit "Mark Read" button in notification dropdown / `/notifications` page |
| **Route / Screen** | Notification dropdown (global); `/notifications` history page |
| **Backend Endpoint** | `PATCH /rest/v1/notifications?id=eq.:notification_id` |
| **Affected Table / Resource** | `notifications` table — UPDATE `read_at` |
| **Request Body (key fields)** | `{ read_at: now() }` |
| **Expected State Change** | `notifications.read_at` set to current timestamp; unread count decremented |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Notification bell count decrements; notification item shown as read (grey/muted style); if all read, badge removed |
| **Audit / Log Evidence** | Not required for audit_log (not a state-changing business event); captured in application logs if needed |
| **Verification Steps** | 1. Click notification → 2. Confirm PATCH HTTP 200 → 3. Bell count decremented → 4. Item shows read style → 5. `/notifications` page shows read status |

---

## CTA 13: Request Timeline Override

| Field | Value |
|-------|-------|
| **UI Element** | "Request Override" button when drag/resize crosses milestone boundary on `/projects/:id/timeline` |
| **Route / Screen** | `/projects/:id/timeline` |
| **Backend Endpoint** | `POST /rest/v1/timeline_overrides` |
| **Affected Table / Resource** | `timeline_overrides` table — INSERT |
| **Request Body (key fields)** | `{ project_id, task_id, requested_by, new_start_date, new_end_date, justification, status: 'pending' }` |
| **Expected State Change** | New `timeline_overrides` row with `status = 'pending'`; notification generated for project_manager/org_admin |
| **HTTP Response Expected** | 201 Created |
| **Visible Confirmation** | Override request confirmation shown; task bar shown in "pending override" state (e.g. dashed outline) |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'TIMELINE_OVERRIDE_REQUESTED'`, `resource_id = timeline_override.id`, `actor_id = requester_id` |
| **Verification Steps** | 1. Drag task across boundary → 2. Override modal prompts for justification → 3. Submit → 4. Confirm HTTP 201 → 5. Override record in `timeline_overrides` → 6. Task shows pending state on timeline |

---

## CTA 14: Approve Timeline Override

| Field | Value |
|-------|-------|
| **UI Element** | "Approve" button on timeline override request in project settings or timeline view |
| **Route / Screen** | `/projects/:id/settings` or timeline override panel |
| **Backend Endpoint** | `PATCH /rest/v1/timeline_overrides?id=eq.:override_id` |
| **Affected Table / Resource** | `timeline_overrides` table — UPDATE `status`; `tasks` table — UPDATE `start_date`, `end_date` |
| **Request Body (key fields)** | `{ status: 'approved', approved_by: pm_user_id, approved_at: now() }` |
| **Expected State Change** | `timeline_overrides.status = 'approved'`; `tasks` dates updated to overridden values; timeline reflects new dates |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Task bar moves to new position on timeline; override status shows "Approved"; requester notified |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'TIMELINE_OVERRIDE_APPROVED'`, `resource_id = override.id`, `actor_id = pm_user_id` |
| **Verification Steps** | 1. Click Approve → 2. Confirm PATCH HTTP 200 → 3. Task dates updated → 4. Timeline reflects new position → 5. Override shows approved → 6. Confirm audit_log entry |

---

## CTA 15: Reject Timeline Override

| Field | Value |
|-------|-------|
| **UI Element** | "Reject" button → rejection reason prompt on override request |
| **Route / Screen** | `/projects/:id/settings` or timeline override panel |
| **Backend Endpoint** | `PATCH /rest/v1/timeline_overrides?id=eq.:override_id` |
| **Affected Table / Resource** | `timeline_overrides` table — UPDATE `status`, `rejection_reason` |
| **Request Body (key fields)** | `{ status: 'rejected', rejection_reason: 'Does not align with milestone', rejected_by: pm_user_id, rejected_at: now() }` |
| **Expected State Change** | `timeline_overrides.status = 'rejected'`; task dates NOT changed; requester notified of rejection |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Override shows "Rejected" status with reason; task bar remains at original dates; requester notified |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'TIMELINE_OVERRIDE_REJECTED'`, `resource_id = override.id`, `actor_id = pm_user_id`, `meta.rejection_reason` |
| **Verification Steps** | 1. Click Reject → 2. Enter reason → 3. Confirm PATCH HTTP 200 → 4. Override status = 'rejected' → 5. Task dates unchanged → 6. Requester notified → 7. Confirm audit_log entry |

---

## CTA 16: AIMC Suggestion Accept

| Field | Value |
|-------|-------|
| **UI Element** | "Get AI Suggestion" → suggestion card → "Accept" button on task detail |
| **Route / Screen** | `/projects/:id/tasks` (task detail) |
| **Backend Endpoint** | `POST /functions/v1/pit-task-advisor` (Edge Function → AIMC Gateway → AI provider) |
| **Affected Table / Resource** | Task content updated (PATCH `/rest/v1/tasks`); `audit_log` INSERT |
| **AIMC Call Chain** | Client → `pit-task-advisor` Edge Function → AIMC Gateway → AI provider (ZERO direct provider calls) |
| **Request Body (key fields)** | `{ task_id, context: { title, description, project_context }, action: 'suggest' }` |
| **Expected State Change (Accept)** | Suggestion text applied to task description/notes; `audit_log` INSERT: `event_type = 'AIMC_SUGGESTION_ACCEPTED'` |
| **HTTP Response Expected** | 200 OK from Edge Function with `{ suggestion, suggestion_id }` |
| **Visible Confirmation** | Suggestion card renders with text; "Accept" updates task content; success toast shown |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'AIMC_SUGGESTION_ACCEPTED'`, `resource_id = task.id`, `actor_id = contributor_user_id`, `meta.suggestion_id` |
| **Verification Steps** | 1. Click Get Suggestion → 2. Confirm Edge Function HTTP 200 → 3. Suggestion card renders → 4. Click Accept → 5. Task content updated → 6. Confirm AIMC Gateway in call chain (no direct provider) → 7. Confirm audit_log entry |

---

## CTA 17: AIMC Suggestion Dismiss

| Field | Value |
|-------|-------|
| **UI Element** | "Get AI Suggestion" → suggestion card → "Dismiss" button on task detail |
| **Route / Screen** | `/projects/:id/tasks` (task detail) |
| **Backend Endpoint** | `PATCH /rest/v1/tasks?id=eq.:task_id` or dedicated dismiss endpoint `{ suggestion_dismissed: true }` |
| **Affected Table / Resource** | Suggestion dismissed (no task content change); `audit_log` INSERT |
| **Expected State Change (Dismiss)** | Task content unchanged; suggestion marked dismissed; `audit_log` INSERT: `event_type = 'AIMC_SUGGESTION_DISMISSED'` |
| **HTTP Response Expected** | 200 OK |
| **Visible Confirmation** | Suggestion card removed; task content unchanged; no toast (or subtle "Suggestion dismissed" message) |
| **Audit / Log Evidence** | `audit_log` INSERT: `event_type = 'AIMC_SUGGESTION_DISMISSED'`, `resource_id = task.id`, `actor_id = contributor_user_id`, `meta.suggestion_id` |
| **Verification Steps** | 1. Click Get Suggestion → 2. Suggestion card renders → 3. Click Dismiss → 4. Confirm Dismiss HTTP 200 → 5. Task content unchanged → 6. Suggestion card removed → 7. Confirm audit_log entry |

---

## State Change Summary Table

| CTA | Endpoint Type | Primary Table | State Change | audit_log Event |
|-----|--------------|---------------|-------------|----------------|
| 1. Create Project | Supabase REST | `projects` | INSERT | `PROJECT_CREATED` |
| 2. Create Milestone | Supabase REST | `milestones` | INSERT | `MILESTONE_CREATED` |
| 3. Create Deliverable | Supabase REST | `deliverables` | INSERT | `DELIVERABLE_CREATED` |
| 4. Create Task | Supabase REST | `tasks` | INSERT | `TASK_CREATED` |
| 5. Assign Task | Supabase REST | `tasks.assigned_to` | UPDATE | `TASK_ASSIGNED` |
| 6. Change Task Status | Supabase REST | `tasks.status` | UPDATE | `TASK_STATUS_CHANGED` |
| 7. Upload Evidence | Supabase Storage + REST | `pit-evidence` + `evidence_items` | BUCKET PUT + INSERT | `EVIDENCE_UPLOADED` |
| 8. Approve Evidence | Supabase REST | `evidence_items.status` | UPDATE → `'approved'` | `EVIDENCE_APPROVED` |
| 9. Return Evidence | Supabase REST | `evidence_items.status` | UPDATE → `'returned'` | `EVIDENCE_RETURNED` |
| 10. Generate Report | Edge Function | `pit-reports` + `report_history` | BUCKET PUT + INSERT | `REPORT_GENERATED` |
| 11. Download Report | Supabase Storage | `pit-reports` | READ | `REPORT_DOWNLOADED` (optional) |
| 12. Mark Notification Read | Supabase REST | `notifications.read_at` | UPDATE | Not required |
| 13. Request Override | Supabase REST | `timeline_overrides` | INSERT | `TIMELINE_OVERRIDE_REQUESTED` |
| 14. Approve Override | Supabase REST | `timeline_overrides.status` + `tasks` dates | UPDATE × 2 | `TIMELINE_OVERRIDE_APPROVED` |
| 15. Reject Override | Supabase REST | `timeline_overrides.status` | UPDATE → `'rejected'` | `TIMELINE_OVERRIDE_REJECTED` |
| 16. AIMC Accept | Edge Function | `tasks` content + `audit_log` | UPDATE + INSERT | `AIMC_SUGGESTION_ACCEPTED` |
| 17. AIMC Dismiss | Supabase REST | `audit_log` only (no task change) | INSERT | `AIMC_SUGGESTION_DISMISSED` |

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
