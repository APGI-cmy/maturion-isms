# PIT Stage 8 — Wave-to-RED-Test Manifest (Builder-Executable Hardening)

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Exact Wave-to-RED-Test Manifest |
| Source of Truth | `modules/pit/06-qa-to-red/red-test-suite-catalog.md` |
| Stage Alignment | Stage 8 hardening (does not change Stage 8 gate-pass state) |
| Build Authorization | **NOT CLEARED** |
| Builder Appointment | **NOT APPOINTED** (Stage 11 only) |

> This manifest is planning/evidence-contract only. It does **not** claim GREEN tests and does **not** start implementation.

## Allocation and Data-Integrity Notes

- Enumerated RED test rows from catalog table entries: **147**.
- Stage 8 allocation baseline currently cites **144** tests. The catalog currently enumerates **147** table rows (3-row delta).
- **Blocking data gap to resolve before build execution**: reconcile catalog declared totals vs enumerated rows (currently +3).
- Currently identified delta rows beyond the 144 baseline allocation snapshot: `PIT-RED-ROUTE-029`, `PIT-RED-TIMELINE-011`, `PIT-RED-TIMELINE-012`.
- Test-name metadata in source is scenario-level (route/domain + action), not implementation test function names; this is recorded as a metadata gap to close before execution.

## Allocation Compliance Checks

- P1 tests without owning wave: **0** (`none`).
- P0/P1 tests without owning wave: **0** (`none`).
- Any tests without owning wave: **0** (`none`).
- Skipped/todo/pending tests are explicitly **disallowed** as completion evidence for any wave.

## Exact Test Manifest

| RED Test ID | Test Name / Description | Priority | Owning Wave | Route/Screen | FRS IDs | TRS IDs | Evidence Required | Blocking Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PIT-RED-AIMC-001 | AI task advisor — Click "Get AI suggestion" | P1 | W8.9 | AI task advisor | PIT-FR-095 | PIT-TR-052, PIT-TR-083 | HAR (verify endpoint host) | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AIMC-002 | No direct provider call — Intercept network requests | P1 | W8.9 | No direct provider call | Not explicitly tagged | PIT-TR-083 | HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AIMC-003 | Accept AI suggestion — Click "Accept" | P2 | W8.9 | Accept AI suggestion | PIT-FR-096 | Not explicitly tagged | screenshot, HAR | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AIMC-004 | Dismiss AI suggestion — Click "Dismiss" | P3 | W8.9 | Dismiss AI suggestion | PIT-FR-096 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AIMC-005 | Human approval required — No human action | P1 | W8.9 | Human approval required | Not explicitly tagged | PIT-TR-054 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AIMC-006 | AIMC call audit — View audit log | P2 | W8.9 | AIMC call audit | Not explicitly tagged | PIT-TR-090 | test output | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AIMC-007 | AIMC unavailable state — Click "Get AI suggestion" | P2 | W8.9 | AIMC unavailable state | Not explicitly tagged | PIT-TR-052 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-001 | Audit event creation — Create milestone | P1 | W8.5 | Audit event creation | PIT-FR-087 | PIT-TR-035 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-002 | Append-only audit log — Attempt to update/delete audit entry | P1 | W8.5 | Append-only audit log | Not explicitly tagged | PIT-TR-073 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-003 | Audit log cross-org isolation — Query audit log | P1 | W8.5 | Audit log cross-org isolation | Not explicitly tagged | PIT-TR-044 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-004 | cs2_admin global visibility — Query audit log | P1 | W8.5 | cs2_admin global visibility | PIT-FR-087 | PIT-TR-044 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-005 | contributor/viewer denied — Navigate to /admin/audit-log | P1 | W8.5 | contributor/viewer denied | PIT-FR-087 | PIT-TR-044 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-006 | Audit log pagination — Load audit log page | P2 | W8.5 | Audit log pagination | Not explicitly tagged | PIT-TR-074 | screenshot, performance | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUDIT-007 | Audit log CSV export — Export CSV | P3 | W8.5 | Audit log CSV export | PIT-FR-088 | PIT-TR-075 | downloaded file | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-001 | `/login` — Submit valid credentials | P1 | W8.1 | `/login` | PIT-FR-004 | PIT-TR-018 | HAR, screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-002 | `/login` — Submit wrong password | P1 | W8.1 | `/login` | PIT-FR-004 | Not explicitly tagged | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-003 | `/login` — Login successfully | P2 | W8.1 | `/login` | PIT-FR-005 | PIT-TR-014 | screenshot, console | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-004 | `/signup` — Submit signup form | P2 | W8.1 | `/signup` | PIT-FR-006 | PIT-TR-019 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-005 | `/signup` — Access signup without invite | P2 | W8.1 | `/signup` | PIT-FR-007 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-006 | `/invite/:token` — Navigate to invite URL | P2 | W8.1 | `/invite/:token` | PIT-FR-008 | PIT-TR-021 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-007 | `/invite/:token` — Complete invite acceptance (new user) | P1 | W8.1 | `/invite/:token` | PIT-FR-009 | PIT-TR-022 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-008 | `/invite/:token` — Accept invite as existing user | P2 | W8.1 | `/invite/:token` | PIT-FR-010 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-009 | `/forgot-password` — Submit forgot password | P2 | W8.1 | `/forgot-password` | PIT-FR-011 | PIT-TR-020 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-010 | `/reset-password` — Submit new password | P2 | W8.1 | `/reset-password` | PIT-FR-012 | PIT-TR-020 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-011 | Protected route — Navigate to `/dashboard` | P1 | W8.1 | Protected route | PIT-FR-013 | PIT-TR-013 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-012 | Session restoration — Reload app with valid session | P1 | W8.1 | Session restoration | Not explicitly tagged | PIT-TR-008 | screenshot, console | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-013 | Session expiry — Continue using app after expiry | P2 | W8.1 | Session expiry | Not explicitly tagged | PIT-TR-008 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-014 | `/onboarding` — Complete onboarding steps | P2 | W8.1 | `/onboarding` | PIT-FR-015 | PIT-TR-014 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-AUTH-015 | Organisation switcher — Switch organisation | P3 | W8.1 | Organisation switcher | PIT-FR-019 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-001 | Evidence upload — Upload evidence file (PDF, <10MB) | P1 | W8.5 | Evidence upload | PIT-FR-062 | PIT-TR-060 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-002 | Oversized file — Upload 50MB file | P2 | W8.5 | Oversized file | Not explicitly tagged | PIT-TR-061 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-003 | Invalid file type — Upload .exe file | P2 | W8.5 | Invalid file type | Not explicitly tagged | PIT-TR-061 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-004 | Evidence submission notification — Submit evidence for review | P2 | W8.5 | Evidence submission notification | PIT-FR-063 | PIT-TR-059 | screenshot, realtime check | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-005 | Evidence approval — Approve evidence | P1 | W8.5 | Evidence approval | PIT-FR-064 | Not explicitly tagged | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-006 | Evidence return — Return evidence with comment | P2 | W8.5 | Evidence return | PIT-FR-065 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-007 | Task blocked by missing evidence — Try to mark task done | P1 | W8.5 | Task blocked by missing evidence | PIT-FR-052, PIT-FR-066 | Not explicitly tagged | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-008 | File download via signed URL — Click download | P2 | W8.5 | File download via signed URL | Not explicitly tagged | PIT-TR-062 | HAR, network | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-009 | Evidence storage access control — Attempt direct bucket access | P1 | W8.5 | Evidence storage access control | Not explicitly tagged | PIT-TR-085 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-EVIDENCE-010 | Evidence RLS denied write — POST to evidence_items | P1 | W8.5 | Evidence RLS denied write | Not explicitly tagged | PIT-TR-045 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-001 | Deployed SHA match — Query `/__git_info` or env var | P1 | W8.10 | Deployed SHA match | Not explicitly tagged | PIT-TR-114 | JSON response | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-002 | Vercel bypass access — Navigate with bypass token | P1 | W8.10 | Vercel bypass access | Not explicitly tagged | PIT-TR-099 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-003 | Test identity readiness — Attempt login with test identity | P1 | W8.10 | Test identity readiness | Not explicitly tagged | Not explicitly tagged | screenshot per identity | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-004 | GitHub Actions secrets — Check secrets availability | P1 | W8.10 | GitHub Actions secrets | Not explicitly tagged | Not explicitly tagged | workflow log | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-005 | Full journey — org_admin — Complete: login→dashboard→create project→milestone→task→assign | P1 | W8.10 | Full journey — org_admin | Not explicitly tagged | Not explicitly tagged | screenshots, HAR, console log | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-006 | CTA → backend state reflection — Click "Create Milestone" CTA → verify DB row + Supabase channel update | P1 | W8.10 | CTA → backend state reflection | Not explicitly tagged | Not explicitly tagged | HAR, DB snapshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-007 | Dashboard state reflection — View Portfolio Dashboard | P1 | W8.10 | Dashboard state reflection | Not explicitly tagged | Not explicitly tagged | screenshot before/after | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-008 | Screenshot/HAR/trace artifacts — Review run artifacts | P1 | W8.10 | Screenshot/HAR/trace artifacts | Not explicitly tagged | Not explicitly tagged | artifact bundle | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-009 | CS2 UI acceptance readiness — CS2 manually reviews UI | P1 | W8.10 | CS2 UI acceptance readiness | Not explicitly tagged | Not explicitly tagged | signed checklist | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-LFV-010 | No functional pass without evidence — Attempt to claim FUNCTIONAL_PASS | P1 | W8.10 | No functional pass without evidence | Not explicitly tagged | Not explicitly tagged | PREHANDOVER proof | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-001 | API response time — Execute typical query | P2 | W8.10 | API response time | Not explicitly tagged | PIT-TR-078, PIT-TR-081 | performance report | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-002 | Accessibility (axe-core) — Run axe-core on page | P1 | W8.10 | Accessibility (axe-core) | PIT-FR-122 | PIT-TR-087, PIT-TR-125 | accessibility report | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-003 | TypeScript strict compilation — Run `tsc --noEmit` | P1 | W8.10 | TypeScript strict compilation | Not explicitly tagged | PIT-TR-100 | CI log | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-004 | ESLint zero errors — Run `eslint .` | P1 | W8.10 | ESLint zero errors | Not explicitly tagged | PIT-TR-101 | CI log | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-005 | Bundle size — Run Vite build | P2 | W8.10 | Bundle size | Not explicitly tagged | PIT-TR-107 | build output | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-006 | No secrets in repository — Grep for secrets | P1 | W8.10 | No secrets in repository | Not explicitly tagged | PIT-TR-096 | scan report | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-007 | No stub tests — Grep for expect(true) | P1 | W8.10 | No stub tests | Not explicitly tagged | PIT-TR-104 | CI log | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NFR-008 | Test coverage gate — Run coverage | P2 | W8.10 | Test coverage gate | Not explicitly tagged | PIT-TR-102 | coverage report | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-001 | Notification bell — View app header | P1 | W8.4 | Notification bell | PIT-FR-022 | PIT-TR-056 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-002 | Real-time notification — Trigger event in another session | P2 | W8.4 | Real-time notification | PIT-FR-023 | PIT-TR-056 | screenshot, console | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-003 | Mark as read — Click notification | P2 | W8.4 | Mark as read | PIT-FR-115 | PIT-TR-118 | screenshot, HAR | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-004 | Notification history — Navigate to /notifications | P2 | W8.4 | Notification history | PIT-FR-116 | PIT-TR-119 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-005 | Notification preferences — Navigate to preferences, disable email | P3 | W8.4 | Notification preferences | PIT-FR-117 | PIT-TR-120 | screenshot, HAR | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-006 | Notification permission scoping — Receive notification for other user's action | P1 | W8.4 | Notification permission scoping | Not explicitly tagged | PIT-TR-058 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-NOTIFICATION-007 | Realtime failure state — Continue using app | P3 | W8.4 | Realtime failure state | Not explicitly tagged | PIT-TR-056 | console, screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-001 | Project creation — Submit project creation form | P1 | W8.3 | Project creation | PIT-FR-031 | PIT-TR-029 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-002 | Project type classification — Set type to "initiative" | P3 | W8.3 | Project type classification | PIT-FR-032 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-003 | Milestone creation — Create milestone | P1 | W8.3 | Milestone creation | PIT-FR-048 | PIT-TR-030 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-004 | Milestone date constraints — Set milestone end before start | P2 | W8.3 | Milestone date constraints | PIT-FR-049 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-005 | Deliverable creation — Create deliverable | P1 | W8.3 | Deliverable creation | PIT-FR-051 | PIT-TR-030 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-006 | Task creation — Create task | P1 | W8.3 | Task creation | PIT-FR-053 | PIT-TR-030 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-007 | Task status: todo→in_progress — Update task status to in_progress | P1 | W8.3 | Task status: todo→in_progress | PIT-FR-054 | Not explicitly tagged | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-008 | Task status: in_progress→done — Mark task done (with required evidence) | P2 | W8.3 | Task status: in_progress→done | PIT-FR-054 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-009 | Team member assignment — Assign user to task | P2 | W8.3 | Team member assignment | PIT-FR-058 | PIT-TR-033 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-010 | Project archive — Archive project | P2 | W8.3 | Project archive | PIT-FR-121 | PIT-TR-124 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-011 | Project restore — Restore project | P2 | W8.3 | Project restore | PIT-FR-121 | PIT-TR-124 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-012 | Task cancel — Cancel task | P2 | W8.3 | Task cancel | PIT-FR-121 | PIT-TR-124 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-013 | Progress roll-up computation — View project progress | P1 | W8.7 | Progress roll-up computation | PIT-FR-114 | PIT-TR-117 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-014 | Progress excludes cancelled — View progress after cancel | P1 | W8.7 | Progress excludes cancelled | PIT-FR-114 | PIT-TR-117 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-015 | Task dependency — Set task B depends on task A | P3 | W8.3 | Task dependency | PIT-FR-056 | PIT-TR-031 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-PROJECT-016 | Circular dependency — Set B depends on A | P2 | W8.3 | Circular dependency | PIT-FR-039 | PIT-TR-039 | test output | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-QA-001 | `/qa-dashboard` — Navigate to /qa-dashboard | P1 | W8.7 | `/qa-dashboard` | PIT-FR-093, PIT-FR-120 | PIT-TR-077 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-QA-002 | QA wave evidence — View QA dashboard | P2 | W8.7 | QA wave evidence | PIT-FR-094 | PIT-TR-076 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-QA-003 | QA dashboard denied role — Navigate to /qa-dashboard | P1 | W8.7 | QA dashboard denied role | PIT-FR-120 | PIT-TR-077 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-QA-004 | QA data isolation — Inspect network payloads | P1 | W8.7 | QA data isolation | PIT-FR-093 | PIT-TR-046 | HAR, network payload | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-QA-005 | QA empty state — View QA dashboard | P3 | W8.7 | QA empty state | PIT-FR-120 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-001 | Report generation — Request project status report (PDF) | P1 | W8.8 | Report generation | PIT-FR-080 | PIT-TR-068 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-002 | XLSX generation — Request report in XLSX | P2 | W8.8 | XLSX generation | PIT-FR-082 | PIT-TR-070 | downloaded file | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-003 | Report history — View report history | P2 | W8.8 | Report history | PIT-FR-084 | PIT-TR-071 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-004 | Report download — Click download | P2 | W8.8 | Report download | PIT-FR-118 | PIT-TR-121 | HAR | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-005 | Report permission denial — Request report generation | P1 | W8.8 | Report permission denial | PIT-FR-118 | PIT-TR-121 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-006 | Report generation failure — Request report | P3 | W8.8 | Report generation failure | Not explicitly tagged | PIT-TR-068 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-007 | Report audit event — Generate report | P2 | W8.8 | Report audit event | PIT-FR-087 | PIT-TR-073 | test output | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-REPORT-008 | Report history scope — View history | P1 | W8.8 | Report history scope | PIT-FR-119 | PIT-TR-122 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-001 | `/projects/new` — Navigate to /projects/new | P1 | W8.2 | `/projects/new` | PIT-FR-001 | PIT-TR-026, PIT-TR-041 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-002 | Milestone creation — POST /milestones API call | P1 | W8.2 | Milestone creation | PIT-FR-113 | PIT-TR-116 | HAR, network payload | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-003 | Project read — GET /projects?org_id=other_org | P1 | W8.2 | Project read | Not explicitly tagged | PIT-TR-042 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-004 | Audit log cross-org — Query audit_log without cs2_admin role | P1 | W8.2 | Audit log cross-org | Not explicitly tagged | PIT-TR-043 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-005 | Audit log — Query audit_log | P1 | W8.2 | Audit log | Not explicitly tagged | PIT-TR-044 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-006 | Evidence upload — Attempt evidence upload | P1 | W8.2 | Evidence upload | Not explicitly tagged | PIT-TR-045 | HAR, screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-007 | QA dashboard — Navigate to /qa-dashboard | P1 | W8.2 | QA dashboard | PIT-FR-093 | PIT-TR-046 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-008 | Task deletion — DELETE /tasks/:id (not owner) | P2 | W8.2 | Task deletion | PIT-FR-001 | PIT-TR-047 | test output | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-009 | Protected URL navigation — Navigate directly to /projects/123 | P1 | W8.2 | Protected URL navigation | PIT-FR-113 | Not explicitly tagged | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-010 | RLS all tables — Direct Supabase query without RLS | P1 | W8.2 | RLS all tables | Not explicitly tagged | PIT-TR-082 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-011 | Permission denied state — Access action requiring higher role | P1 | W8.2 | Permission denied state | PIT-FR-113 | PIT-TR-025 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-012 | Role-gated navigation — Admin menu items visible in nav | P2 | W8.2 | Role-gated navigation | Not explicitly tagged | PIT-TR-024 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-RLS-013 | API-level denial — POST create-project Edge Function | P1 | W8.2 | API-level denial | PIT-FR-113 | Not explicitly tagged | HAR, network payload | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-001 | `/` (LandingPage) — Navigate directly to `/` | P1 | W8.1 | `/` (LandingPage) | PIT-FR-103 | PIT-TR-011 | screenshot, HAR | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-002 | `/login` — Navigate to `/login` | P1 | W8.1 | `/login` | Not explicitly tagged | PIT-TR-012 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-003 | `/signup` — Navigate to `/signup` | P1 | W8.1 | `/signup` | Not explicitly tagged | PIT-TR-012 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-004 | `/forgot-password` — Navigate to `/forgot-password` | P1 | W8.1 | `/forgot-password` | Not explicitly tagged | PIT-TR-012 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-005 | `/reset-password` — Navigate to `/reset-password?token=...` | P1 | W8.1 | `/reset-password` | Not explicitly tagged | PIT-TR-012 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-006 | `/invite/:token` — Navigate to `/invite/VALID_TOKEN` | P1 | W8.1 | `/invite/:token` | Not explicitly tagged | PIT-TR-012 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-007 | `/dashboard` — Navigate to `/dashboard` | P1 | W8.1 | `/dashboard` | Not explicitly tagged | PIT-TR-011, PIT-TR-013 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-008 | `/projects` — Navigate to `/projects` | P1 | W8.1 | `/projects` | Not explicitly tagged | PIT-TR-011 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-009 | `/projects/new` — Navigate to `/projects/new` | P1 | W8.1 | `/projects/new` | Not explicitly tagged | PIT-TR-011 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-010 | `/projects/:id` — Navigate to `/projects/PROJECT_ID` | P1 | W8.3 | `/projects/:id` | Not explicitly tagged | PIT-TR-011 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-011 | `/projects/:id/timeline` — Navigate to timeline route | P1 | W8.6 | `/projects/:id/timeline` | Not explicitly tagged | PIT-TR-011 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-012 | `/projects/:id/milestones` — Navigate to milestones route | P2 | W8.3 | `/projects/:id/milestones` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-013 | `/projects/:id/deliverables` — Navigate to deliverables route | P2 | W8.3 | `/projects/:id/deliverables` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-014 | `/projects/:id/tasks` — Navigate to tasks route | P2 | W8.3 | `/projects/:id/tasks` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-015 | `/projects/:id/evidence` — Navigate to evidence route | P2 | W8.5 | `/projects/:id/evidence` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-016 | `/projects/:id/reports` — Navigate to reports route | P2 | W8.8 | `/projects/:id/reports` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-017 | `/projects/:id/settings` — Navigate to settings route | P2 | W8.3 | `/projects/:id/settings` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-018 | `/my-work` — Navigate to `/my-work` | P2 | W8.4 | `/my-work` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-019 | `/notifications` — Navigate to `/notifications` | P2 | W8.4 | `/notifications` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-020 | `/profile` — Navigate to `/profile` | P2 | W8.4 | `/profile` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-021 | `/onboarding` — Navigate to `/onboarding` | P2 | W8.1 | `/onboarding` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-022 | `/admin/org` — Navigate to `/admin/org` | P1 | W8.2 | `/admin/org` | Not explicitly tagged | PIT-TR-011 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-023 | `/admin/users` — Navigate to `/admin/users` | P2 | W8.2 | `/admin/users` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-024 | `/admin/settings` — Navigate to `/admin/settings` | P2 | W8.2 | `/admin/settings` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-025 | `/admin/audit-log` — Navigate to `/admin/audit-log` | P2 | W8.2 | `/admin/audit-log` | Not explicitly tagged | PIT-TR-011 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-026 | `/qa-dashboard` — Navigate to `/qa-dashboard` | P1 | W8.2 | `/qa-dashboard` | Not explicitly tagged | PIT-TR-011, PIT-TR-046 | screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-027 | `*` (404) — Navigate to `/unknown-route` | P2 | W8.2 | `*` (404) | Not explicitly tagged | PIT-TR-016 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-028 | SPA fallback — Navigate directly to `/projects/123` | P1 | W8.1 | SPA fallback | PIT-FR-014 | PIT-TR-015 | HAR, screenshot | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-ROUTE-029 | Global error boundary — Trigger an unhandled client-side rendering error | P1 | W8.1 | Global error boundary | PIT-FR-104 | PIT-TR-089 | screenshot, telemetry/log capture | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-001 | `/projects/:id/timeline` — Load timeline page | P1 | W8.6 | `/projects/:id/timeline` | PIT-FR-068 | PIT-TR-064 | screenshot, performance trace | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-002 | Date-to-pixel math — Inspect task bar position | P1 | W8.6 | Date-to-pixel math | Not explicitly tagged | PIT-TR-066 | test output | BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-003 | Drag task bar — Drag task bar to new position | P2 | W8.6 | Drag task bar | Not explicitly tagged | PIT-TR-067 | screenshot, HAR | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-004 | Resize task bar — Resize right edge | P2 | W8.6 | Resize task bar | Not explicitly tagged | PIT-TR-067 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-005 | Denominator switching — Switch from days to weeks view | P2 | W8.6 | Denominator switching | Not explicitly tagged | PIT-TR-064 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-006 | Progress overlay — View timeline | P2 | W8.6 | Progress overlay | PIT-FR-070 | PIT-TR-064 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-007 | Virtualisation performance — Load timeline | P2 | W8.6 | Virtualisation performance | Not explicitly tagged | PIT-TR-079 | performance trace, screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-008 | Keyboard accessibility — Tab to task bar, use arrow keys | P2 | W8.6 | Keyboard accessibility | Not explicitly tagged | PIT-TR-067, PIT-TR-087 | accessibility report | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-009 | Zoom controls — Click zoom in/out | P3 | W8.6 | Zoom controls | PIT-FR-069 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-010 | Today line — View current date on timeline | P3 | W8.6 | Today line | PIT-FR-071 | Not explicitly tagged | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-011 | Visual regression baseline — Capture timeline baseline screenshot | P3 | W8.6 | Visual regression baseline | Not explicitly tagged | PIT-TR-080 | visual regression screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
| PIT-RED-TIMELINE-012 | Horizontal scroll — Scroll horizontally through timeline | P2 | W8.6 | Horizontal scroll | PIT-FR-068 | PIT-TR-065 | screenshot | NON_BLOCKING | No skipped/todo/pending allowed as completion evidence. |
