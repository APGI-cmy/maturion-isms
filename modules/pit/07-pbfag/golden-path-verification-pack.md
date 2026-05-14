# PIT Stage 7 — Golden Path Verification Pack (Pre-Build Definition)

## Pack Status

| Field | Value |
|---|---|
| Artifact Status | PASS |
| Execution Status | Planning only (not executed in Stage 7) |
| Source Basis | Stage 2 journeys + Stage 5b LFV + Stage 6 RED suite |

## Golden Path Matrix

| Golden Path Item | Precondition | Role / Test Identity | Route / Screen | Action Sequence | Expected Backend State | Expected Visible UI State | Required Stage 6 RED Tests | Required LFV Evidence | Handover Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| Login + session restore | Valid user and org membership | contributor | `/login` -> `/dashboard` | Sign in -> refresh -> restore | Session token valid; user context retained | Redirect to dashboard without white screen | PIT-RED-AUTH-* | Auth LFV artifact set | Screenshot + HAR + console log |
| Organisation context selection | User with multi-org access | org_admin | `/dashboard` context selector | Select org -> reload | Org-scoped data context applied | Header/context reflects selected org | PIT-RED-RLS-* | Role/context LFV evidence | Screenshot + network payload |
| Project creation | Authenticated creator role | project_leader | `/projects/new` | Open form -> submit | New project row created and scoped | Project appears in projects list | PIT-RED-PROJECT-* | Project lifecycle LFV evidence | Screenshot + API response snippet |
| Milestone creation | Existing project | project_leader | `/projects/:id/milestones` | Add milestone | Milestone linked to project | Milestone appears with status/date | PIT-RED-PROJECT-* | Milestone LFV evidence | Screenshot + table row confirmation |
| Deliverable creation | Existing milestone | project_leader | `/projects/:id/deliverables` | Add deliverable | Deliverable linked and visible | Deliverable appears with RAG defaults | PIT-RED-PROJECT-* | Deliverable LFV evidence | Screenshot + backend write evidence |
| Task creation + assignment | Existing deliverable and assignee | project_leader | `/projects/:id/tasks` | Create task -> assign user | Task row created with assignee | Task list reflects assignment/status | PIT-RED-PROJECT-* | Task lifecycle LFV evidence | Screenshot + HAR |
| Timeline view load | Project has tasks/milestones | contributor | `/projects/:id/timeline` | Open timeline | Timeline query returns scoped records | Gantt/timeline loads with controls | PIT-RED-TIMELINE-* | Timeline LFV evidence | Screenshot + console clean log |
| Timeline drag/resize/denominator switch | Timeline loaded | contributor | `/projects/:id/timeline` | Drag bar -> resize -> switch denominator | Schedule fields update and persist | Timeline redraws with updated scale | PIT-RED-TIMELINE-* | Timeline interaction LFV evidence | Before/after screenshots + network log |
| Evidence upload + review | Task exists and reviewer assigned | contributor + reviewer | `/projects/:id/evidence` | Upload -> reviewer approve/return | Evidence state transitions persisted | Status badge transitions displayed | PIT-RED-EVIDENCE-* | Evidence workflow LFV evidence | Upload proof + review action proof |
| Notification generation + mark-as-read | Trigger event exists | contributor | `/notifications` + bell | Trigger event -> open bell -> mark read | Notification row created/updated | Badge count changes and read state updates | PIT-RED-NOTIFICATION-* | Notification LFV evidence | Screenshot sequence + HAR |
| Report generation + download + history | Reporting scope exists | org_admin | `/projects/:id/reports` | Generate -> download -> view history | Report job/state/history persisted | Report card + history entry visible | PIT-RED-REPORT-* | Report LFV evidence | Download proof + history screenshot |
| Audit log entry creation + display | Representative auditable action | cs2_admin | `/admin/audit-log` | Perform action -> view audit | Audit event written with actor metadata | Audit entry visible in UI/export | PIT-RED-AUDIT-* | Audit LFV evidence | Screenshot + export proof |
| QA dashboard visibility (cs2_admin) | QA records available | cs2_admin | `/qa-dashboard` | Open dashboard | QA dataset query allowed for cs2_admin | QA panels render without leakage | PIT-RED-QA-* | QA LFV evidence | Screenshot + role assertion |
| Permission-denied path | Non-authorized role session | viewer | Protected write/admin routes | Attempt denied action | No unauthorized write/read occurs | PermissionDenied/redirect rendered | PIT-RED-RLS-* | Role-denial LFV evidence | Screenshot + blocked response |
| AIMC request via approved gateway only + accept/dismiss | AIMC feature enabled in scope | contributor | Contextual AIMC UI | Request suggestion -> accept/dismiss | Request routed via gateway endpoint only | Suggestion card + accept/dismiss outcomes | PIT-RED-AIMC-* | AIMC LFV evidence | HAR proving gateway-only call |

## Stage 2 Journey 1–23 Coverage Mapping

| Stage 2 Journey | Journey Label | Mapped Golden Path Item | Mapping Type | Consolidation / Coverage Note |
|---|---|---|---|---|
| 1 | Public Landing / Unauthenticated Entry | Login + session restore | Consolidated | Entry into auth boundary is validated in the same login/session flow family. |
| 2 | Login | Login + session restore | Direct | Direct one-to-one mapping. |
| 3 | Signup | Login + session restore | Consolidated | Auth onboarding entry point covered in auth/session flow family. |
| 4 | Invitation Acceptance | Login + session restore | Consolidated | Invitation acceptance converges into authenticated session establishment. |
| 5 | Forgot Password | Login + session restore | Consolidated | Password recovery path is part of auth/session restoration readiness. |
| 6 | Reset Password | Login + session restore | Consolidated | Password reset completion rolls back into successful session establishment. |
| 7 | Protected-Route Redirect (Unauthenticated) | Permission-denied path | Consolidated | Protected route enforcement and redirect behavior are validated in denied-path checks. |
| 8 | Direct SPA Route Fallback | Login + session restore | Consolidated | Route fallback into app shell/auth handling covered in auth/session readiness. |
| 9 | Access Denied (Authenticated, Insufficient Permission) | Permission-denied path | Direct | Direct one-to-one mapping. |
| 10 | Onboarding / First-Use | Login + session restore | Consolidated | First-use onboarding is grouped under auth/session boundary validation for Stage 7 pack definition. |
| 11 | Create Project | Project creation | Direct | Direct one-to-one mapping. |
| 12 | Add Milestone | Milestone creation | Direct | Direct one-to-one mapping. |
| 13 | Add Deliverable | Deliverable creation | Direct | Direct one-to-one mapping. |
| 14 | Add Task / Action Item | Task creation + assignment | Direct | Direct one-to-one mapping. |
| 15 | Assign Owner / Invite Team Member | Task creation + assignment | Consolidated | Assignment/invite ownership behavior grouped with task assignment flow. |
| 16 | Evidence Submission | Evidence upload + review | Direct | Direct one-to-one mapping (submit half). |
| 17 | Evidence Review and Approval | Evidence upload + review | Direct | Direct one-to-one mapping (review half). |
| 18 | Timeline / Gantt View Interaction | Timeline drag/resize/denominator switch | Direct | Direct one-to-one mapping. |
| 19 | Watchdog / Escalation Review | Notification generation + mark-as-read | Consolidated | Escalation visibility is represented via notification trigger/read cycle at Stage 7 planning level. |
| 20 | Report Generation and Export | Report generation + download + history | Direct | Direct one-to-one mapping. |
| 21 | Audit Log Review | Audit log entry creation + display | Direct | Direct one-to-one mapping. |
| 22 | Admin / Settings Management | Organisation context selection | Consolidated | Admin/settings governance is represented via org-context and scoped data boundary controls. |
| 23 | View and Manage My Work (Personal Task List) | Task creation + assignment | Consolidated | Personal task lifecycle is represented in task creation/assignment flow definition. |

Coverage result: **All Stage 2 journeys 1–23 are explicitly mapped** to one or more Stage 7 Golden Path items for pre-build planning clarity.
