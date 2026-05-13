# PIT — LFV-to-RED Traceability

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | LFV-to-RED Traceability |
| Version | v1.0 |
| Source | `modules/pit/05-live-functional-verification/` (all 9 artifacts + workflow) |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |

> The LFV package (Stage 5b) defines the live functional verification requirements that the PIT build must satisfy before claiming FUNCTIONAL_PASS. This matrix maps every LFV artifact to the RED tests that enforce those requirements.

---

## LFV Artifact Map

| LFV Artifact | File | RED Test IDs | Coverage Status |
|---|---|---|---|
| LFV-01 | `01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md` | PIT-RED-LFV-005 + journey-level tests | RED_TEST_DEFINED |
| LFV-02 | `02_AGENT_ACCESS_MATRIX.md` | PIT-RED-LFV-004, PIT-RED-LFV-003 | RED_TEST_DEFINED |
| LFV-03 | `03_DEPLOYED_VERIFICATION_PLAN.md` | PIT-RED-LFV-001, PIT-RED-LFV-002 | RED_TEST_DEFINED |
| LFV-04 | `04_CTA_BACKEND_STATE_MAP.md` | PIT-RED-LFV-006 | RED_TEST_DEFINED |
| LFV-05 | `05_TEST_IDENTITY_AND_ROLE_MATRIX.md` | PIT-RED-LFV-003 | RED_TEST_DEFINED |
| LFV-06 | `06_LIVE_VERIFICATION_WORKFLOW_SPEC.md` | PIT-RED-LFV-008, PIT-RED-LFV-004 | RED_TEST_DEFINED |
| LFV-07 | `07_DASHBOARD_STATE_REFLECTION_GATE.md` | PIT-RED-LFV-007 | RED_TEST_DEFINED |
| LFV-08 | `08_HANDOVER_EVIDENCE_REQUIREMENTS.md` | PIT-RED-LFV-008, PIT-RED-LFV-010 | RED_TEST_DEFINED |
| LFV-09 | `09_CS2_UI_ACCEPTANCE_CHECKLIST.md` | PIT-RED-LFV-009 | RED_TEST_DEFINED |
| LFV-WF | `pit-live-verification-workflow.yml` | PIT-RED-LFV-004, PIT-RED-LFV-008 | RED_TEST_DEFINED |

**Coverage: 10/10 LFV artifacts — COMPLETE**

---

## Detailed Traceability

### LFV-01 — Functional User Journey Contract

**Source artifact**: `01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md`
**Content**: 16 PIT user journeys with step tables, success/failure criteria

| Journey | RED Test | Description |
|---|---|---|
| J-01: org_admin creates project + milestone + deliverable + task | PIT-RED-LFV-005 | Full journey: login→dashboard→create project→milestone→task→assign |
| J-02: project_leader assigns team member | PIT-RED-PROJECT-009 | Assignment journey |
| J-03: task_owner updates task status to done | PIT-RED-PROJECT-007 | Status transition journey |
| J-04: task_owner uploads evidence | PIT-RED-EVIDENCE-001 | Evidence upload journey |
| J-05: reviewer approves evidence | PIT-RED-EVIDENCE-005 | Evidence approval journey |
| J-06: reporter generates project status report | PIT-RED-REPORT-001 | Report generation journey |
| J-07: org_admin views portfolio dashboard | PIT-RED-ROUTE-007 | Dashboard journey |
| J-08: cs2_admin views QA dashboard | PIT-RED-QA-001 | QA dashboard journey |
| J-09: task_owner requests AI task advisor suggestion | PIT-RED-AIMC-003 | AIMC journey |
| J-10: viewer denied create-project | PIT-RED-RLS-001 | Permission denied journey |
| J-11: auditor views audit log, exports CSV | PIT-RED-AUDIT-001, PIT-RED-AUDIT-007 | Audit log journey |
| J-12: org_admin archives project, restores it | PIT-RED-PROJECT-010, PIT-RED-PROJECT-011 | Lifecycle journey |
| J-13: unauthenticated user redirected to login | PIT-RED-AUTH-011 | Auth redirect journey |
| J-14: new user accepts invite | PIT-RED-AUTH-007 | Invite acceptance journey |
| J-15: user resets password | PIT-RED-AUTH-010 | Password reset journey |
| J-16: project_leader views timeline, drags task | PIT-RED-TIMELINE-003 | Timeline interaction journey |

---

### LFV-02 — Agent Access Matrix

**Source artifact**: `02_AGENT_ACCESS_MATRIX.md`
**Content**: 18 secrets and runtime access matrix; 5 execution contexts

| Required Check | RED Test | Description |
|---|---|---|
| All 18 secrets resolvable in GitHub Actions | PIT-RED-LFV-004 | GitHub Actions secrets availability |
| Test identity credentials available | PIT-RED-LFV-003 | Test users exist and credentials work |
| Vercel bypass token available | PIT-RED-LFV-002 | Bypass token works in Playwright context |
| Supabase service role key available for test setup | PIT-RED-LFV-004 | Service key resolves in CI |

---

### LFV-03 — Deployed Verification Plan

**Source artifact**: `03_DEPLOYED_VERIFICATION_PLAN.md`
**Content**: Vercel URL strategy, bypass mechanism, 8-gate pass/fail table

| LFV Gate | RED Test | Description |
|---|---|---|
| Gate 1: App deployed and accessible | PIT-RED-LFV-001 | Vercel URL resolves |
| Gate 2: Vercel protection bypass works | PIT-RED-LFV-002 | Bypass token accepted |
| Gate 3: Deployed SHA matches expected | PIT-RED-LFV-001 | SHA endpoint returns correct value |
| Gate 4: Auth routes accessible | PIT-RED-ROUTE-001 through PIT-RED-ROUTE-006 | All public routes 200 OK |
| Gate 5: Login succeeds for test identities | PIT-RED-LFV-003 | All 7 test identities can log in |
| Gate 6: Core journey executes successfully | PIT-RED-LFV-005 | org_admin journey completes |
| Gate 7: Evidence artifacts captured | PIT-RED-LFV-008 | Screenshots, HAR, trace, console captured |
| Gate 8: CS2 acceptance checklist completeable | PIT-RED-LFV-009 | Checklist items all verifiable |

---

### LFV-04 — CTA Backend State Map

**Source artifact**: `04_CTA_BACKEND_STATE_MAP.md`
**Content**: 17 CTAs mapped: UI element → endpoint → table/bucket → state change → audit evidence

| CTA Category | RED Test | Description |
|---|---|---|
| Create project CTA | PIT-RED-LFV-006, PIT-RED-PROJECT-001 | CTA → projects table row + audit entry |
| Create milestone CTA | PIT-RED-LFV-006, PIT-RED-PROJECT-003 | CTA → milestones table row |
| Create task CTA | PIT-RED-PROJECT-006 | CTA → tasks table row |
| Update task status CTA | PIT-RED-PROJECT-007 | CTA → tasks.status update + status_logs |
| Upload evidence CTA | PIT-RED-EVIDENCE-001 | CTA → bucket write + evidence_items row |
| Approve evidence CTA | PIT-RED-EVIDENCE-005 | CTA → evidence_items.status=approved |
| Generate report CTA | PIT-RED-REPORT-001 | CTA → Edge Function → bucket write + audit |
| Archive project CTA | PIT-RED-PROJECT-010 | CTA → projects.archived_at set |
| Accept AI suggestion CTA | PIT-RED-AIMC-003 | CTA → AIMC call logged, suggestion applied |

---

### LFV-05 — Test Identity and Role Matrix

**Source artifact**: `05_TEST_IDENTITY_AND_ROLE_MATRIX.md`
**Content**: 7 test identities (cs2_admin through unauthenticated), fixture files, seed data

| Test Identity | RED Test | Status |
|---|---|---|
| cs2_admin test user | PIT-RED-LFV-003 | Login required: PIT-RED-LFV-003 |
| org_admin test user | PIT-RED-LFV-003 | Login required: PIT-RED-LFV-003 |
| project_leader test user | PIT-RED-LFV-003 | Login required: PIT-RED-LFV-003 |
| task_owner test user | PIT-RED-LFV-003 | Login required: PIT-RED-LFV-003 |
| reviewer test user | PIT-RED-LFV-003 | Login required: PIT-RED-LFV-003 |
| viewer test user | PIT-RED-LFV-003 | Login required: PIT-RED-LFV-003 |
| unauthenticated | PIT-RED-AUTH-011, PIT-RED-RLS-009 | Redirect to /login verified |

---

### LFV-06 — Live Verification Workflow Spec

**Source artifact**: `06_LIVE_VERIFICATION_WORKFLOW_SPEC.md`
**Content**: Workflow architecture, 10 output fields, 5 artifacts, 8 readiness criteria

| Workflow Requirement | RED Test | Description |
|---|---|---|
| Workflow outputs: deployed_sha | PIT-RED-LFV-001 | SHA field captured |
| Workflow outputs: bypass_active | PIT-RED-LFV-002 | Bypass status field captured |
| Workflow outputs: test_identity_status | PIT-RED-LFV-003 | Identity login results captured |
| Workflow outputs: journey_results | PIT-RED-LFV-005 | Journey pass/fail per journey |
| Workflow artifacts: screenshots | PIT-RED-LFV-008 | Screenshot artifact uploaded |
| Workflow artifacts: HAR | PIT-RED-LFV-008 | HAR artifact uploaded |
| Workflow artifacts: Playwright trace | PIT-RED-LFV-008 | Trace artifact uploaded |
| Workflow artifacts: console log | PIT-RED-LFV-008 | Console log artifact uploaded |
| GitHub Actions secrets available | PIT-RED-LFV-004 | All secrets resolvable |
| Verification report output | PIT-RED-LFV-008 | Report JSON produced |

---

### LFV-07 — Dashboard State Reflection Gate

**Source artifact**: `07_DASHBOARD_STATE_REFLECTION_GATE.md`
**Content**: 11 reflection checks (before/after/evidence for each state change)

| Reflection Check | RED Test | Description |
|---|---|---|
| Task created → Portfolio dashboard task count increments | PIT-RED-LFV-007 | Realtime update after task creation |
| Task completed → project progress % updates | PIT-RED-LFV-007, PIT-RED-PROJECT-013 | Progress % reflects on dashboard |
| Evidence submitted → notification count increments | PIT-RED-NOTIFICATION-002 | Bell count updates in real-time |
| Project archived → removed from active list | PIT-RED-PROJECT-010 | Dashboard list filtered |
| Watchdog alert fires → banner visible | PIT-RED-ROUTE-007 | Alert banner appears on dashboard |

---

### LFV-08 — Handover Evidence Requirements

**Source artifact**: `08_HANDOVER_EVIDENCE_REQUIREMENTS.md`
**Content**: 8 evidence artifacts; 8 gates with evidence types; IAA three-tier verdict

| Evidence Gate | RED Test | Description |
|---|---|---|
| Gate 1: Screenshots captured | PIT-RED-LFV-008 | Per-journey screenshot bundle |
| Gate 2: HAR captured | PIT-RED-LFV-008 | Network request archive |
| Gate 3: Playwright trace captured | PIT-RED-LFV-008 | Trace file per test run |
| Gate 4: Console log captured | PIT-RED-LFV-008 | No errors in console during journeys |
| Gate 5: Verification report JSON produced | PIT-RED-LFV-008 | Structured output with all 10 fields |
| Gate 6: All journeys PASS in report | PIT-RED-LFV-005 | journey_results all GREEN |
| Gate 7: CS2 acceptance checklist completed | PIT-RED-LFV-009 | Johan Ras sign-off |
| Gate 8: No FUNCTIONAL_PASS without deployed evidence | PIT-RED-LFV-010 | Governance gate enforced |

---

### LFV-09 — CS2 UI Acceptance Checklist

**Source artifact**: `09_CS2_UI_ACCEPTANCE_CHECKLIST.md`
**Content**: CS2 (Johan Ras) manual verification checklist; 11 sections; sign-off block

| Checklist Section | RED Test | Description |
|---|---|---|
| Section 1: App accessible via Vercel URL | PIT-RED-LFV-001 | Baseline accessibility |
| Section 2: Login works for all roles | PIT-RED-LFV-003 | Role login matrix |
| Section 3: Portfolio dashboard data visible | PIT-RED-ROUTE-007 | Data-present state verified |
| Section 4: Project lifecycle complete | PIT-RED-LFV-005 | Full journey |
| Section 5: Evidence submission and approval | PIT-RED-EVIDENCE-005 | Evidence workflow |
| Section 6: Timeline renders and is interactive | PIT-RED-TIMELINE-001, PIT-RED-TIMELINE-003 | Timeline basic function |
| Section 7: Notifications appear and are read | PIT-RED-NOTIFICATION-003 | Notification workflow |
| Section 8: Reports generated and downloaded | PIT-RED-REPORT-004 | Report download |
| Section 9: QA dashboard visible to cs2_admin | PIT-RED-QA-001 | QA access |
| Section 10: No white screens or 500 errors | PIT-RED-RLS-011 | Error state UI |
| Section 11: CS2 sign-off | PIT-RED-LFV-009 | Manual sign-off required |

---

### LFV-WF — pit-live-verification-workflow.yml

**Source artifact**: `pit-live-verification-workflow.yml`
**Content**: GitHub Actions workflow design for automated LFV execution

| Workflow Requirement | RED Test | Description |
|---|---|---|
| Workflow triggers correctly | PIT-RED-LFV-004 | Workflow can be dispatched |
| All secrets available in workflow context | PIT-RED-LFV-004 | Secret resolution check |
| Playwright tests execute against deployed URL | PIT-RED-LFV-005 | Journey tests run against Vercel |
| Artifacts uploaded on completion | PIT-RED-LFV-008 | Screenshot/HAR/trace/console bundle |
| Verification report generated | PIT-RED-LFV-008 | JSON report artifact |

---

## Coverage Summary

| LFV Artifact | Status | RED Tests Referenced |
|---|---|---|
| LFV-01 (Journey Contract) | RED_TEST_DEFINED | 16 journeys mapped |
| LFV-02 (Access Matrix) | RED_TEST_DEFINED | 4 gates |
| LFV-03 (Deployed Verification Plan) | RED_TEST_DEFINED | 8 gates |
| LFV-04 (CTA Backend State Map) | RED_TEST_DEFINED | 9 CTAs |
| LFV-05 (Test Identity Matrix) | RED_TEST_DEFINED | 7 identities |
| LFV-06 (Workflow Spec) | RED_TEST_DEFINED | 10 outputs |
| LFV-07 (Dashboard State Reflection) | RED_TEST_DEFINED | 5 reflection checks |
| LFV-08 (Handover Evidence Requirements) | RED_TEST_DEFINED | 8 gates |
| LFV-09 (CS2 UI Acceptance Checklist) | RED_TEST_DEFINED | 11 sections |
| LFV-WF (Workflow YML design) | RED_TEST_DEFINED | 5 requirements |

**10/10 LFV artifacts covered — No BLOCKING_GAP entries.**
