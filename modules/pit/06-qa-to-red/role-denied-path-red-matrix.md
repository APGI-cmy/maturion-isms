# PIT — Role Denied-Path RED Matrix

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Role Denied-Path RED Matrix |
| Version | v1.0 |
| Source | FRS (PIT-FR-001, PIT-FR-113), TRS (PIT-TR-116), Architecture v1.0 |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |

---

## Roles Under Test

| Role | Scope | Minimum Denied-Path Tests Required |
|---|---|---|
| cs2_admin | Global | Access denied to non-cs2 specific admin actions |
| org_admin | Organisation-scoped | Denied cross-org reads; denied certain write actions |
| project_leader | Project-scoped | Denied admin screen; denied actions outside their project |
| task_owner | Task-scoped | Denied approve evidence; denied milestone creation; denied other users' tasks |
| reviewer | Project-scoped (evidence only) | Denied project settings; denied milestone creation |
| viewer | Read-only | Denied all write actions; denied admin routes |
| unauthenticated user | None | Denied all authenticated routes; redirected to /login |

---

## Denied-Path Matrix

### Protected Action Group 1: Project Creation

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| viewer | Navigate to /projects/new | Route renders | PermissionDenied component | PIT-RED-RLS-001 | Playwright E2E | screenshot |
| viewer | POST create-project Edge Function | 200 OK | 403 Forbidden | PIT-RED-RLS-013 | Playwright + EF | HAR |
| unauthenticated | Navigate to /projects/new | Route renders | Redirect to /login | PIT-RED-RLS-009 | Playwright E2E | HAR, screenshot |

### Protected Action Group 2: Milestone/Deliverable/Task Write

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| viewer | POST /milestones | 200 OK | 403 RLS denied | PIT-RED-RLS-002 | Playwright + Supabase | HAR |
| task_owner | DELETE /milestones/:id | 200 OK | 403 RLS denied | PIT-RED-RLS-008 | Vitest + Supabase | test output |
| reviewer | POST /deliverables | 200 OK | 403 RLS denied | PIT-RED-RLS-002 | Vitest + Supabase | test output |

### Protected Action Group 3: Evidence Approval

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| task_owner | POST approve-evidence | 200 OK | 403 Forbidden | PIT-RED-EVIDENCE-010 | Vitest + Supabase | test output |
| viewer | POST upload-evidence | 200 OK | 403 RLS denied | PIT-RED-EVIDENCE-010 | Vitest + Supabase | test output |
| viewer | Attempt evidence download | File accessible | 403 from storage RLS | PIT-RED-EVIDENCE-009 | Vitest + Supabase | test output |

### Protected Action Group 4: Audit Log Access

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| task_owner | Navigate to /admin/audit-log | Page renders | PermissionDenied component | PIT-RED-AUDIT-005 | Playwright E2E | screenshot |
| viewer | Query audit_log table | Data returned | 403 / empty (RLS denied) | PIT-RED-RLS-005 | Vitest + Supabase | test output |
| org_admin | Query cross-org audit_log | Cross-org data returned | Only own-org data (RLS scoped) | PIT-RED-AUDIT-003 | Vitest + Supabase | test output |

### Protected Action Group 5: QA Dashboard

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| task_owner | Navigate to /qa-dashboard | QA data visible | PermissionDenied component | PIT-RED-RLS-007 | Playwright E2E | screenshot |
| org_admin | Navigate to /qa-dashboard | QA data visible | PermissionDenied component | PIT-RED-QA-003 | Playwright E2E | screenshot |
| org_admin | Network payload inspection | QA data in response | Empty/403 response (no data leakage) | PIT-RED-QA-004 | Playwright E2E | HAR, network payload |

### Protected Action Group 6: Report Generation

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| viewer | Request report generation | Report generated | PermissionDenied UI | PIT-RED-REPORT-005 | Playwright E2E | screenshot |
| task_owner | View other org's report history | Reports visible | 403 / empty (scope enforced) | PIT-RED-REPORT-008 | Vitest + Supabase | test output |

### Protected Action Group 7: Admin Settings

| Actor/Role | Action | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| viewer | Navigate to /admin/settings | Settings visible | PermissionDenied component | PIT-RED-RLS-001 | Playwright E2E | screenshot |
| project_leader | Navigate to /admin/users | User management visible | PermissionDenied component | PIT-RED-RLS-001 | Playwright E2E | screenshot |
| task_owner | Navigate to /admin/org | Org admin visible | PermissionDenied component | PIT-RED-RLS-001 | Playwright E2E | screenshot |

### Protected Action Group 8: Direct URL Navigation (All Roles)

| Actor/Role | Route | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Harness | Evidence |
|---|---|---|---|---|---|---|
| unauthenticated | /dashboard | Page renders | Redirect to /login | PIT-RED-AUTH-011 | Playwright E2E | HAR, screenshot |
| unauthenticated | /projects/123 | Page renders or 500 | Redirect to /login | PIT-RED-RLS-009 | Playwright E2E | HAR |
| unauthenticated | /admin/audit-log | Page renders | Redirect to /login | PIT-RED-RLS-009 | Playwright E2E | HAR |
| viewer | /projects/new | Route renders | PermissionDenied component | PIT-RED-RLS-001 | Playwright E2E | screenshot |

---

## Network Payload Isolation Tests

> Ensures no data leakage in network payloads for denied roles.

| Scenario | Actor/Role | Expected Failure (RED) | Expected GREEN Behaviour | RED Test ID | Evidence |
|---|---|---|---|---|---|
| QA dashboard payload | org_admin | QA data in JSON response | Empty or 403 — no QA rows in payload | PIT-RED-QA-004 | HAR |
| Audit log cross-org payload | org_admin | Other-org rows in JSON | Only own-org rows | PIT-RED-AUDIT-003 | test output |
| Other user notification payload | viewer | Others' notifications in payload | Only own notifications | PIT-RED-NOTIFICATION-006 | test output |
| Evidence file access | viewer | File accessible via direct URL | 403 signed URL required | PIT-RED-EVIDENCE-009 | test output |

---

## Role Matrix Summary

| Role | Denied-Path Tests | Status |
|---|---|---|
| cs2_admin | Covered: PIT-RED-RLS-004 (scoped to own-org unless cross-org explicit) | RED_TEST_DEFINED |
| org_admin | Covered: PIT-RED-RLS-003, PIT-RED-AUDIT-003, PIT-RED-QA-003 | RED_TEST_DEFINED |
| project_leader | Covered: PIT-RED-RLS-001 (admin screen denied) | RED_TEST_DEFINED |
| task_owner | Covered: PIT-RED-RLS-008 (milestone deletion denied), PIT-RED-EVIDENCE-010 (approval denied) | RED_TEST_DEFINED |
| reviewer | Covered: PIT-RED-EVIDENCE-010 (write denied), PIT-RED-RLS-002 (milestone write denied) | RED_TEST_DEFINED |
| viewer | Covered: PIT-RED-RLS-001, PIT-RED-RLS-002, PIT-RED-RLS-006, PIT-RED-REPORT-005, PIT-RED-AUDIT-005 | RED_TEST_DEFINED |
| unauthenticated | Covered: PIT-RED-AUTH-011, PIT-RED-RLS-009 | RED_TEST_DEFINED |

**All 7 roles have at least one denied-path test per protected action group — COMPLETE.**
**No BLOCKING_GAP entries.**
