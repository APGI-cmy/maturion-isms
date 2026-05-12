# 07 — Dashboard State Reflection Gate
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

The Dashboard State Reflection Gate verifies that every backend state change is correctly reflected in the UI — not just that the write operation succeeded, but that the resulting state is **visible** in the appropriate screen. This gate catches cases where writes succeed but the UI does not re-query, cache is stale, or Realtime subscriptions are not connected.

Each reflection check requires:
1. **Before state** — screenshot or assertion before the action
2. **Action** — the CTA executed
3. **Expected After state** — the UI state that must be visible after the action
4. **Evidence Required** — the artifacts that prove the state was reflected

---

## Reflection 1: New Project Appears on /projects AND /dashboard

| Field | Value |
|-------|-------|
| **Before State** | `/projects` shows N projects; `/dashboard` shows N in project count |
| **Action** | `project_manager` creates "LFV Test Project" via Journey 3 |
| **Expected After State** | `/projects` list shows N+1 projects; "LFV Test Project" visible in list; `/dashboard` project count shows N+1 or project card visible |
| **Realtime / Refetch** | List refetch or optimistic INSERT after POST 201 |
| **Evidence Required** | Screenshot of `/projects` before + after showing count change; screenshot of `/dashboard` after showing project; network log showing POST 201 to `/rest/v1/projects` |

**Verification Assertions**:
- [ ] `await expect(page.getByText('LFV Test Project')).toBeVisible()` on `/projects`
- [ ] Project count on `/dashboard` incremented (or card present)
- [ ] No page reload required to see new project (optimistic/refetch working)

**Failure Mode**: Project created in DB (201) but list does not update without full page reload → stale cache / missing refetch → FAIL

---

## Reflection 2: Task Assignment Appears in /my-work for Assigned Contributor

| Field | Value |
|-------|-------|
| **Before State** | Contributor's `/my-work` shows M tasks (not including the new task) |
| **Action** | `project_manager` assigns task "Write FRS Section 1" to `contributor` via Journey 6 |
| **Expected After State** | Contributor's `/my-work` shows M+1 tasks; "Write FRS Section 1" visible in My Work list |
| **Session Switch Required** | Yes — must switch to contributor session after assignment |
| **Evidence Required** | Screenshot of contributor's `/my-work` before assignment; screenshot after assignment showing new task; network log showing PATCH 200 for task assignment |

**Verification Assertions**:
- [ ] Login as contributor
- [ ] `await expect(page.getByText('Write FRS Section 1')).toBeVisible()` on `/my-work`
- [ ] Task shows correct project name and due date

**Failure Mode**: Assignment PATCH 200 but contributor's `/my-work` does not include task → RLS issue or query not scoping by `assigned_to` → FAIL

---

## Reflection 3: Task Status Change Appears in /projects/:id/tasks AND /dashboard Progress

| Field | Value |
|-------|-------|
| **Before State** | Task shows "Not Started" badge; `/dashboard` shows project at X% progress |
| **Action** | `contributor` changes task status to "In Progress" then "Completed" via Journey 6 CTA 6 |
| **Expected After State** | Task badge shows "In Progress" (then "Completed"); `/dashboard` project progress percentage updates when task marked Complete |
| **Progress Roll-up** | `compute_progress_rollup` Edge Function triggered on task completion; dashboard progress reflects updated calculation |
| **Evidence Required** | Screenshot of task list before status change; screenshot after showing new badge; screenshot of `/dashboard` before + after showing progress change; network log showing PATCH 200 + Edge Function call |

**Verification Assertions**:
- [ ] Status badge updated without full page reload
- [ ] `/dashboard` progress percentage changed after task completion
- [ ] `compute_progress_rollup` Edge Function invoked (visible in network log)

**Failure Mode**: Status badge not updated without reload → optimistic update not working; or dashboard progress stale → Edge Function not triggering / invalidation not happening → FAIL

---

## Reflection 4: Evidence Upload Appears on /projects/:id/evidence (Evidence Count Increases)

| Field | Value |
|-------|-------|
| **Before State** | `/projects/:id/evidence` shows K evidence items; evidence count (if displayed) shows K |
| **Action** | `contributor` uploads `test-evidence.pdf` to task via Journey 9 |
| **Expected After State** | `/projects/:id/evidence` shows K+1 items; "test-evidence.pdf" visible with "Pending Review" badge; evidence count shows K+1 |
| **Evidence Required** | Screenshot of evidence screen before upload; screenshot after showing new item with "Pending Review" status; network log showing Storage POST 200 + evidence_items INSERT 201 |

**Verification Assertions**:
- [ ] `await expect(page.getByText('test-evidence.pdf')).toBeVisible()` on `/projects/:id/evidence`
- [ ] `await expect(page.getByText('Pending Review')).toBeVisible()`
- [ ] Evidence count (badge or heading) incremented

**Failure Mode**: File stored in bucket (200) but `evidence_items` INSERT fails → evidence not visible in UI; or evidence_items INSERT succeeds but list not refetched → FAIL

---

## Reflection 5: Evidence Approval Status Change Visible on Evidence Screen

| Field | Value |
|-------|-------|
| **Before State** | Evidence item shows "Pending Review" (amber/yellow badge) |
| **Action** | `project_manager` approves evidence via Journey 10 |
| **Expected After State** | Evidence badge changes to "Approved" (green); reviewer name + timestamp visible on evidence item |
| **Evidence Required** | Screenshot of evidence item with "Pending Review" badge; screenshot after approval showing "Approved" badge; network log showing PATCH 200 to `evidence_items` |

**Verification Assertions**:
- [ ] `await expect(page.getByText('Approved')).toBeVisible()` after approval
- [ ] Badge colour changed (green indicator)
- [ ] Reviewer attribution shown (name + date)
- [ ] Status persists on page reload

**Failure Mode**: PATCH 200 but badge remains "Pending Review" → UI not invalidating evidence_items query after patch → FAIL

---

## Reflection 6: Notification Count Changes When New Notification Generated

| Field | Value |
|-------|-------|
| **Before State** | Contributor's notification bell shows count C (or 0) |
| **Action** | `project_manager` assigns task to contributor (triggers `notifications` INSERT via Edge Function or trigger) |
| **Expected After State** | Contributor's notification bell shows count C+1 WITHOUT page reload (Supabase Realtime subscription active) |
| **Realtime Required** | Yes — Supabase Realtime subscription on `notifications` table scoped to `user_id = contributor_id` |
| **Evidence Required** | Screenshot of notification bell before (showing count C); screenshot after assignment (showing count C+1) without reload; Playwright console log showing Realtime subscription connected; network log showing Realtime WebSocket frames |

**Verification Assertions**:
- [ ] Notification bell count increments within 5 seconds of assignment (no reload)
- [ ] `page.waitForSelector('[data-testid="notification-badge"]')` shows updated count
- [ ] WebSocket connection to Supabase Realtime visible in network HAR

**Failure Mode**: Count only updates on page reload → Realtime subscription not connected or not subscribing to correct channel → FAIL (Realtime is a first-class PIT requirement)

---

## Reflection 7: Notification History Records Event in /notifications

| Field | Value |
|-------|-------|
| **Before State** | `/notifications` shows history without the new assignment notification |
| **Action** | Task assignment notification generated (from Reflection 6) |
| **Expected After State** | `/notifications` shows the new notification: "You have been assigned to: Write FRS Section 1" with timestamp |
| **Evidence Required** | Screenshot of `/notifications` page after notification generated; network log showing GET of notifications list |

**Verification Assertions**:
- [ ] Navigate to `/notifications` as contributor
- [ ] New notification appears in list
- [ ] Notification text references correct task name
- [ ] Timestamp is recent (within seconds of the assignment action)

**Failure Mode**: Bell count increments (Realtime) but `/notifications` page does not show item → `notifications` table INSERT failed or RLS blocking contributor from reading their own notifications → FAIL

---

## Reflection 8: Report Appears in Report History at /projects/:id/reports

| Field | Value |
|-------|-------|
| **Before State** | `/projects/:id/reports` shows R reports in history (or empty state) |
| **Action** | `project_manager` generates "Summary PDF" report via Journey 12 |
| **Expected After State** | `/projects/:id/reports` shows R+1 reports; new report listed with filename, timestamp, format, and download link |
| **Evidence Required** | Screenshot of report history before generation; screenshot after showing new entry; network log showing POST to `generate-report` Edge Function (200) + `report_history` record (from response or separate query) |

**Verification Assertions**:
- [ ] New report entry visible without page reload (refetch after POST)
- [ ] Download link present and functional
- [ ] Report filename includes timestamp or is unique

**Failure Mode**: Edge Function 200 + file in bucket but `report_history` INSERT failed → report not listed in UI; or `report_history` INSERT succeeded but UI not refetching → FAIL

---

## Reflection 9: Audit Log Shows State-Changing Events at /admin/audit-log (cs2_admin View)

| Field | Value |
|-------|-------|
| **Before State** | `cs2_admin` views `/admin/audit-log`; N entries present |
| **Action** | All state-changing events from Reflections 1–8 have occurred |
| **Expected After State** | `/admin/audit-log` shows all event types: PROJECT_CREATED, TASK_CREATED, TASK_ASSIGNED, EVIDENCE_UPLOADED, EVIDENCE_APPROVED, REPORT_GENERATED; each with actor, timestamp, resource ID |
| **Evidence Required** | Screenshot of audit log showing multiple event types; network log showing GET to audit_log with HTTP 200; filter test screenshot (filter by event type) |

**Verification Assertions**:
- [ ] `PROJECT_CREATED` event visible in audit log
- [ ] `TASK_ASSIGNED` event visible
- [ ] `EVIDENCE_UPLOADED` event visible
- [ ] `EVIDENCE_APPROVED` event visible
- [ ] `REPORT_GENERATED` event visible
- [ ] Each entry shows actor, timestamp, event type, resource ID
- [ ] Filter by event type works
- [ ] `contributor` navigating to `/admin/audit-log` receives permission-denied (not data)

**Failure Mode**: Audit log empty despite state changes → `audit_log` INSERTs failing silently in Edge Functions/triggers; or `cs2_admin` seeing 403 on audit-log → RLS over-restrictive → FAIL

---

## Reflection 10: QA Dashboard Shows Wave Evidence for cs2_admin at /qa-dashboard

| Field | Value |
|-------|-------|
| **Before State** | `cs2_admin` is authenticated |
| **Action** | `cs2_admin` navigates to `/qa-dashboard` |
| **Expected After State** | QA dashboard renders with: current wave information, test run metrics (pass/fail counts), coverage metrics, recent QA runs |
| **Evidence Required** | Screenshot of `/qa-dashboard` showing populated data for `cs2_admin`; network log showing GET to `qa_runs` table with HTTP 200 |

**Verification Assertions**:
- [ ] `/qa-dashboard` renders without white screen for `cs2_admin`
- [ ] `qa_runs` data visible (at least one row)
- [ ] Wave evidence table populated
- [ ] No 403 or 500 errors for `cs2_admin`

**Failure Mode**: `qa_runs` RLS denying `cs2_admin` read access → policy misconfiguration; or QA dashboard component crashing → FAIL

---

## Reflection 11: Permission Denied — /qa-dashboard Returns PermissionDenied for viewer Role

| Field | Value |
|-------|-------|
| **Before State** | `viewer` is authenticated |
| **Action** | `viewer` navigates to `/qa-dashboard` |
| **Expected After State** | Permission-denied screen rendered (403 state component); NO QA data visible; no data fetched to client |
| **Evidence Required** | Screenshot of permission-denied state for `viewer`; network log showing NO request to `qa_runs` (or request returning 403); browser console showing no data leakage |

**Verification Assertions**:
- [ ] Permission-denied component visible (not white screen, not 500)
- [ ] No `qa_runs` data present in DOM or network response
- [ ] `viewer` cannot bypass permission-denied by direct URL navigation

**CRITICAL — Security Failure Criteria**:
- [ ] If `viewer` receives `qa_runs` data → **P0 security failure** — FAIL immediately, raise escalation
- [ ] If `viewer` receives 500 instead of permission-denied → routing/RLS error → FAIL

---

## State Reflection Summary Table

| # | Reflection | Route(s) | Before State | After State | Realtime? | Evidence |
|---|-----------|---------|-------------|------------|-----------|----------|
| 1 | New project on list + dashboard | `/projects`, `/dashboard` | N projects | N+1 projects | No (refetch) | Screenshot before/after + network log |
| 2 | Task in contributor's /my-work | `/my-work` | M tasks | M+1 tasks | No (refetch) | Screenshot before/after |
| 3 | Task status + dashboard progress | `/projects/:id/tasks`, `/dashboard` | "Not Started" | "Completed" + progress % | No (refetch + Edge Fn) | Screenshot before/after |
| 4 | Evidence upload on evidence screen | `/projects/:id/evidence` | K items | K+1 items | No (refetch) | Screenshot before/after |
| 5 | Evidence approval badge change | `/projects/:id/evidence` | "Pending Review" | "Approved" | No (refetch) | Screenshot before/after |
| 6 | Notification bell count (Realtime) | Global nav | Count C | Count C+1 (no reload) | **YES** | Screenshot + WS frames in HAR |
| 7 | Notification history | `/notifications` | Missing entry | New entry visible | No (refetch) | Screenshot of notifications page |
| 8 | Report in history | `/projects/:id/reports` | R reports | R+1 reports | No (refetch) | Screenshot before/after |
| 9 | Audit log events (cs2_admin) | `/admin/audit-log` | N entries | N + new events | No (refetch) | Screenshot of audit log |
| 10 | QA dashboard data (cs2_admin) | `/qa-dashboard` | — | Populated data | No | Screenshot of QA dashboard |
| 11 | Permission denied for viewer | `/qa-dashboard` | — | Permission-denied screen | N/A | Screenshot + network log (no data) |

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
