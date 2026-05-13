# PIT — FRS-to-RED Traceability

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | FRS-to-RED Traceability |
| Version | v1.0 |
| Source | `modules/pit/02-frs/functional-requirements.md` v0.2-hardened |
| Total FRS Requirements | 123 (PIT-FR-001 through PIT-FR-123) |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1634 |

---

## Traceability Table

**Status values**: `RED_TEST_DEFINED` | `NOT_TESTABLE_WITH_JUSTIFICATION` | `BLOCKING_GAP`

| FRS ID | Behaviour Under Test | RED Test ID(s) | Test Type | Evidence Expected | Status |
|---|---|---|---|---|---|
| PIT-FR-001 | Role hierarchy enforcement; viewer blocked from add-milestone | PIT-RED-RLS-001, PIT-RED-RLS-002 | E2E + RLS unit | screenshot, HAR, test output | RED_TEST_DEFINED |
| PIT-FR-002 | Role-based navigation visibility; admin menu hidden from viewer | PIT-RED-RLS-012 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-003 | Authenticated user landing redirect to /dashboard | PIT-RED-AUTH-001 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-004 | Login credential validation; valid credentials → session | PIT-RED-AUTH-001, PIT-RED-AUTH-002 | E2E | HAR, screenshot | RED_TEST_DEFINED |
| PIT-FR-005 | Post-login redirect to intended destination | PIT-RED-AUTH-003 | E2E | screenshot, console | RED_TEST_DEFINED |
| PIT-FR-006 | Signup flow; account created, email verification sent | PIT-RED-AUTH-004 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-007 | Invite-only signup configuration | PIT-RED-AUTH-005 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-008 | Invitation token validation and acceptance | PIT-RED-AUTH-006 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-009 | Invitation acceptance — new user path | PIT-RED-AUTH-007 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-010 | Invitation acceptance — existing user path | PIT-RED-AUTH-008 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-011 | Forgot password flow; reset email sent | PIT-RED-AUTH-009 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-012 | Password reset flow; password changed | PIT-RED-AUTH-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-013 | Protected route guard; unauthenticated → /login | PIT-RED-AUTH-011, PIT-RED-RLS-009 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-014 | SPA fallback route; deep-link loads app | PIT-RED-ROUTE-028 | E2E | HAR, screenshot | RED_TEST_DEFINED |
| PIT-FR-015 | Onboarding flow; completes → dashboard | PIT-RED-AUTH-014 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-016 | Universal five-state UI contract (loading/empty/denied/error/data) | PIT-RED-ROUTE-007 through PIT-RED-ROUTE-026, all route tests | E2E | screenshots per state | RED_TEST_DEFINED |
| PIT-FR-017 | App shell persistence across all five states | PIT-RED-NFR-002 + route tests | E2E | screenshot per state | RED_TEST_DEFINED |
| PIT-FR-018 | Persistent app shell layout (sidebar + top nav) | PIT-RED-ROUTE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-019 | Organisation switcher | PIT-RED-AUTH-015 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-020 | Global search | PIT-RED-ROUTE-007 (search bar visible) | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-021 | Breadcrumb navigation | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-022 | Root-level notification provider; bell visible | PIT-RED-NOTIFICATION-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-023 | Real-time in-app notification delivery | PIT-RED-NOTIFICATION-002 | E2E | screenshot, console | RED_TEST_DEFINED |
| PIT-FR-024 | Notification bell and drawer | PIT-RED-NOTIFICATION-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-025 | Notification types (assignment, evidence, status, escalation) | PIT-RED-NOTIFICATION-001, PIT-RED-NOTIFICATION-002 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-026 | Optional email notification delivery | PIT-RED-NOTIFICATION-005 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-027 | Portfolio dashboard summary cards | PIT-RED-ROUTE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-028 | Project list with RAG status | PIT-RED-ROUTE-007, PIT-RED-ROUTE-008 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-RED-FR-029 (mapped) | Portfolio dashboard filtering | PIT-RED-ROUTE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-029 | Portfolio dashboard filtering | PIT-RED-ROUTE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-030 | Watchdog alert banner on portfolio dashboard | PIT-RED-ROUTE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-031 | Project creation modal/wizard | PIT-RED-PROJECT-001 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-032 | Project type classification | PIT-RED-PROJECT-002 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-033 | Quick-win type classification | PIT-RED-PROJECT-002 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-034 | Source link for projects | PIT-RED-PROJECT-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-035 | Project CAPEX/OPEX tracking | PIT-RED-PROJECT-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-036 | Implementation page as primary execution screen | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-037 | Indicator 1: Project duration with visual progress | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-038 | Indicator 2: Milestone count | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-039 | Indicator 3: Deliverable count | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-040 | Indicator 4: Task count with overdue sub-count | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-041 | Indicator 5: Team member count with avatar row | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-042 | Indicator 6: Progress against plan % | PIT-RED-ROUTE-010, PIT-RED-PROJECT-013 | E2E + unit | screenshot, test output | RED_TEST_DEFINED |
| PIT-FR-043 | Indicator 7: Overall progress % | PIT-RED-ROUTE-010, PIT-RED-PROJECT-013 | E2E + unit | screenshot, test output | RED_TEST_DEFINED |
| PIT-FR-044 | Implementation page status colour coding | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-045 | Implementation page view toggle (list/board) | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-046 | Project hierarchy structure (Milestone→Deliverable→Task) | PIT-RED-PROJECT-003 through PIT-RED-PROJECT-006 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-047 | Task cluster templates | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-048 | Milestone creation | PIT-RED-PROJECT-003 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-049 | Milestone date constraints | PIT-RED-PROJECT-004 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-050 | Milestone cascade on date change | PIT-RED-PROJECT-004 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-051 | Deliverable creation | PIT-RED-PROJECT-005 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-052 | Deliverable evidence requirement flag | PIT-RED-EVIDENCE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-053 | Task creation | PIT-RED-PROJECT-006 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-054 | Task status lifecycle (todo→in_progress→done) | PIT-RED-PROJECT-007, PIT-RED-PROJECT-008 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-055 | Task progress percentage | PIT-RED-PROJECT-013 | Unit + E2E | test output, screenshot | RED_TEST_DEFINED |
| PIT-FR-056 | Task dependency management | PIT-RED-PROJECT-015 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-057 | Blocked task UI | PIT-RED-PROJECT-015 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-058 | Team member assignment via person-picker | PIT-RED-PROJECT-009 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-059 | Invitation from person-picker | PIT-RED-AUTH-007 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-060 | Assignment notification | PIT-RED-NOTIFICATION-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-061 | Team member role assignment | PIT-RED-PROJECT-009 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-062 | Evidence upload | PIT-RED-EVIDENCE-001 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-063 | Evidence submission notification to reviewers | PIT-RED-EVIDENCE-004 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-064 | Evidence approval | PIT-RED-EVIDENCE-005 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-065 | Evidence return for revision | PIT-RED-EVIDENCE-006 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-066 | Evidence auto-advance on completion | PIT-RED-EVIDENCE-005 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-067 | Evidence file preview | PIT-RED-EVIDENCE-008 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-068 | Gantt chart rendering | PIT-RED-TIMELINE-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-069 | Gantt zoom controls | PIT-RED-TIMELINE-009 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-070 | Gantt progress fill | PIT-RED-TIMELINE-006 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-071 | Today line | PIT-RED-TIMELINE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-072 | Drag-and-drop date adjustment | PIT-RED-TIMELINE-003 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-073 | Cascade on milestone date change | PIT-RED-TIMELINE-003 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-074 | Conflict detection and indicators | PIT-RED-PROJECT-016 | Unit + E2E | test output, screenshot | RED_TEST_DEFINED |
| PIT-FR-075 | Date format standards (ISO 8601) | PIT-RED-TIMELINE-002 | Unit | test output | RED_TEST_DEFINED |
| PIT-FR-076 | Task bar optional overlay | PIT-RED-TIMELINE-006 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-077 | Watchdog engine | PIT-RED-ROUTE-022 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-078 | Watchdog dashboard display | PIT-RED-ROUTE-022 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-079 | Escalation actions | PIT-RED-ROUTE-022 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-080 | Report types (project status, timeline, team, audit) | PIT-RED-REPORT-001 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-081 | Report scope selection | PIT-RED-REPORT-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-082 | Report output formats (PDF, XLSX, CSV) | PIT-RED-REPORT-001, PIT-RED-REPORT-002 | E2E | downloaded file | RED_TEST_DEFINED |
| PIT-FR-083 | Server-side report generation | PIT-RED-REPORT-001 | E2E | HAR | RED_TEST_DEFINED |
| PIT-FR-084 | Report history | PIT-RED-REPORT-003 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-085 | Implementation page filter bar | PIT-RED-ROUTE-010 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-086 | Audit log search and filter | PIT-RED-AUDIT-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-087 | Comprehensive audit log | PIT-RED-AUDIT-001, PIT-RED-AUDIT-002, PIT-RED-AUDIT-007 | Unit + E2E | test output, file | RED_TEST_DEFINED |
| PIT-FR-088 | Audit log CSV export | PIT-RED-AUDIT-007 | E2E | downloaded file | RED_TEST_DEFINED |
| PIT-FR-089 | Audit log pagination | PIT-RED-AUDIT-006 | E2E | screenshot, performance | RED_TEST_DEFINED |
| PIT-FR-090 | Organisation settings | PIT-RED-ROUTE-024 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-091 | User management screen | PIT-RED-ROUTE-023 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-092 | Watchdog sensitivity configuration | PIT-RED-ROUTE-022 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-093 | QA dashboard access control | PIT-RED-QA-001, PIT-RED-QA-003 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-094 | QA dashboard content | PIT-RED-QA-002 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-095 | AIMC gateway routing mandatory (no direct provider calls) | PIT-RED-AIMC-001, PIT-RED-AIMC-002 | E2E | HAR | RED_TEST_DEFINED |
| PIT-FR-096 | Task AI advisor (suggest/accept/dismiss) | PIT-RED-AIMC-003, PIT-RED-AIMC-004 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-097 | Portfolio risk highlight | PIT-RED-ROUTE-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-098 | Watchdog escalation recommendation (AIMC) | PIT-RED-AIMC-001 | E2E | HAR | RED_TEST_DEFINED |
| PIT-FR-099 | AI executive summary in reports | PIT-RED-REPORT-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-100 | Source link integration with upstream modules | PIT-RED-PROJECT-001 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-101 | Cross-organisation data scoping | PIT-RED-RLS-003 | RLS unit | test output | RED_TEST_DEFINED |
| PIT-FR-102 | Integration settings management | PIT-RED-ROUTE-024 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-103 | Complete route coverage (all 27 routes accessible) | PIT-RED-ROUTE-001 through PIT-RED-ROUTE-027 | E2E | screenshot per route | RED_TEST_DEFINED |
| PIT-FR-104 | 404 not found page | PIT-RED-ROUTE-027 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-105 | Evidence file storage provisioning | PIT-RED-EVIDENCE-001 | E2E | HAR | RED_TEST_DEFINED |
| PIT-FR-106 | Role management screen | PIT-RED-ROUTE-022 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-107 | Notification templates screen | PIT-RED-ROUTE-024 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-108 | Task cluster templates screen | PIT-RED-ROUTE-024 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-109 | Invitation settings screen | PIT-RED-ROUTE-024 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-110 | Invitation acceptance screen | PIT-RED-AUTH-006, PIT-RED-AUTH-007 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-111 | My Work screen | PIT-RED-ROUTE-018 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-112 | My Work filter and task actions | PIT-RED-ROUTE-018 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-113 | Permission negative-path contract | PIT-RED-RLS-001 through PIT-RED-RLS-013 | E2E + RLS unit | screenshot, HAR, test output | RED_TEST_DEFINED |
| PIT-FR-114 | Progress roll-up method | PIT-RED-PROJECT-013, PIT-RED-PROJECT-014 | Unit | test output | RED_TEST_DEFINED |
| PIT-FR-115 | Notification read and mark-as-read behaviour | PIT-RED-NOTIFICATION-003 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-116 | Notification history view | PIT-RED-NOTIFICATION-004 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-117 | Notification preferences | PIT-RED-NOTIFICATION-005 | E2E | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-118 | Report generation permissions and states | PIT-RED-REPORT-005, PIT-RED-REPORT-006 | E2E | screenshot | RED_TEST_DEFINED |
| PIT-FR-119 | Report history scope | PIT-RED-REPORT-008 | RLS unit | test output | RED_TEST_DEFINED |
| PIT-FR-120 | QA dashboard enhanced requirements | PIT-RED-QA-001 through PIT-RED-QA-005 | E2E + RLS | screenshot, HAR | RED_TEST_DEFINED |
| PIT-FR-121 | Lifecycle removal semantics (archive/restore/cancel/soft-delete) | PIT-RED-PROJECT-010, PIT-RED-PROJECT-011, PIT-RED-PROJECT-012, PIT-RED-PROJECT-014 | E2E + unit | screenshot, test output | RED_TEST_DEFINED |
| PIT-FR-122 | Minimum accessibility outcomes (WCAG AA, axe-core, keyboard nav) | PIT-RED-NFR-002, PIT-RED-TIMELINE-008 | E2E + axe | accessibility report, screenshot | RED_TEST_DEFINED |
| PIT-FR-123 | Bulk operations/CSV import/templates — explicit v1 non-scope | — | — | — | NOT_TESTABLE_WITH_JUSTIFICATION |

---

## Non-Testable Justifications

| FRS ID | Justification |
|---|---|
| PIT-FR-123 | Explicitly out of scope for v1 per FRS §2.2. No test required or possible for a v1 non-scope item. |

---

## Coverage Summary

| Status | Count | Percentage |
|---|---|---|
| RED_TEST_DEFINED | 122 | 99.2% |
| NOT_TESTABLE_WITH_JUSTIFICATION | 1 | 0.8% |
| BLOCKING_GAP | 0 | 0.0% |
| **TOTAL** | **123** | **100%** |

**No BLOCKING_GAP entries. Full FRS coverage achieved.**
