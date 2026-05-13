# PIT — Live Functional RED Gates

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Live Functional RED Gates |
| Version | v1.0 |
| Source | Stage 5b LFV Package (all 9 artifacts), TRS (PIT-TR-113, PIT-TR-114), FRS (PIT-FR-103) |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |

> These gates enforce the key lesson from MMM (PR #1590): **No deployed LFV evidence, no functional pass. No functional pass, no handover. No handover, no merge.**

---

## Gate 1: Deployed Route Smoke Tests

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-001-GATE |
| Related Test | PIT-RED-LFV-001, PIT-RED-ROUTE-001 through PIT-RED-ROUTE-027 |
| Description | All 27 PIT routes must respond with 2xx in the deployed Vercel environment (not localhost) |
| Expected Failure (RED) | Routes return 404 or 500 in deployed environment; or app not deployed |
| Expected GREEN Behaviour | All 27 routes return 200 OK (or 3xx with valid resolution); SPA routes resolved via vercel.json fallback |
| Evidence Required | HAR file per route or CI smoke-test log showing 27/27 pass |
| Blocking | YES — deployment smoke must pass before claiming any functional capability |

---

## Gate 2: Vercel Deployment Protection Bypass

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-002-GATE |
| Related Test | PIT-RED-LFV-002 |
| Description | Automated Playwright tests must be able to access the protected Vercel preview deployment using the bypass token mechanism |
| Expected Failure (RED) | Playwright receives Vercel auth wall (401/redirected to vercel.com/login); bypass token not configured |
| Expected GREEN Behaviour | Navigate to `[VERCEL_URL]?x-vercel-protection-bypass=[TOKEN]&x-vercel-set-bypass-cookie=samesitenone` → app loads; bypass cookie set; subsequent navigation works without bypass params |
| Evidence Required | screenshot of app loaded via bypass URL; HAR showing bypass params in initial request |
| Blocking | YES — all E2E tests depend on bypass access |

---

## Gate 3: Deployed SHA Match

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-001-SHA |
| Related Test | PIT-RED-LFV-001 |
| Description | The deployed Vercel instance must serve the expected commit SHA. Prevents testing stale deployments. |
| Expected Failure (RED) | SHA not exposed; endpoint returns 404; SHA does not match expected commit |
| Expected GREEN Behaviour | `VERCEL_GIT_COMMIT_SHA` env var accessible via app (e.g. `/__git_info` endpoint or window.__BUILD_SHA); matches expected branch HEAD SHA |
| Evidence Required | JSON response from SHA endpoint; match confirmed in test output |
| Blocking | YES — stale deployment must be detected before tests run |

---

## Gate 4: GitHub Actions Secret Availability

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-004-GATE |
| Related Test | PIT-RED-LFV-004 |
| Description | All required secrets must be resolvable in the GitHub Actions workflow context before LFV can execute |
| Expected Failure (RED) | Secrets unavailable; workflow fails at secret resolution step; tests run with empty credentials |
| Expected GREEN Behaviour | All 18 secrets in LFV-02 Agent Access Matrix resolved to non-empty values in workflow context |
| Required Secrets | VERCEL_DEPLOYMENT_URL, VERCEL_BYPASS_TOKEN, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, TEST_CS2_ADMIN_EMAIL, TEST_CS2_ADMIN_PASSWORD, TEST_ORG_ADMIN_EMAIL, TEST_ORG_ADMIN_PASSWORD, TEST_PROJECT_LEADER_EMAIL, TEST_PROJECT_LEADER_PASSWORD, TEST_TASK_OWNER_EMAIL, TEST_TASK_OWNER_PASSWORD, TEST_REVIEWER_EMAIL, TEST_REVIEWER_PASSWORD, TEST_VIEWER_EMAIL, TEST_VIEWER_PASSWORD, SENTRY_DSN |
| Evidence Required | GitHub Actions run log showing all secrets resolved (values masked); workflow proceeds past secret check step |
| Blocking | YES — without secrets, no test identity can authenticate |

---

## Gate 5: Test Identity Login Readiness

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-003-GATE |
| Related Test | PIT-RED-LFV-003 |
| Description | All 7 test identities must be able to log in to the deployed PIT application |
| Expected Failure (RED) | Login fails for any test identity; test user accounts not seeded; wrong org context |
| Expected GREEN Behaviour | All 7 identities can log in and access appropriate screens; session persists for test duration |
| Test Identities | cs2_admin, org_admin, project_leader, task_owner, reviewer, viewer (×2 orgs), unauthenticated (redirect test) |
| Evidence Required | Screenshot of each identity logged in showing role-appropriate UI; or test output confirming login for each identity |
| Blocking | YES — identity failures cascade to all journey tests |

---

## Gate 6: Full Journey Completion

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-005-GATE |
| Related Test | PIT-RED-LFV-005 |
| Description | The core org_admin journey (login → dashboard → create project → milestone → deliverable → task → assign → update status) must complete without errors |
| Expected Failure (RED) | Any step in journey fails; white screen at any step; uncaught error; state not updated after CTA |
| Expected GREEN Behaviour | All steps complete successfully; project hierarchy created; task assigned; status updated; all actions reflected in DB and UI |
| Evidence Required | Screenshots at each journey step (min. 8 screenshots); HAR showing all API calls; DB snapshot confirming rows created |
| Blocking | YES — core journey is the minimum functional proof |

---

## Gate 7: CTA → Backend → State Reflection

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-006-GATE |
| Related Test | PIT-RED-LFV-006 |
| Description | Every CTA defined in LFV-04 must result in a verifiable backend state change AND a UI state reflection |
| Expected Failure (RED) | CTA click triggers no DB change; DB changes but UI not updated; Realtime event not emitted |
| Expected GREEN Behaviour | CTA click → Edge Function or Supabase query → DB row created/updated → Supabase Realtime event → UI reflects new state |
| Test CTAs | See LFV-04 §CTA-map (17 CTAs) |
| Evidence Required | Before/after screenshots showing UI state change; HAR showing API call; DB snapshot; Supabase Realtime event in console log |
| Blocking | YES — state reflection is the core of L3 live closure |

---

## Gate 8: Evidence Artifact Bundle

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-008-GATE |
| Related Test | PIT-RED-LFV-008 |
| Description | The LFV workflow must produce a complete evidence bundle as a GitHub Actions artifact |
| Expected Failure (RED) | No artifacts uploaded; incomplete bundle (missing screenshot or HAR); console log empty |
| Expected GREEN Behaviour | Artifact bundle includes: screenshots/ directory, playwright-trace.zip, network.har, console.log, verification-report.json |
| Artifact Structure | `lFV-evidence-bundle.zip` containing: screenshots/ (per journey), playwright-trace.zip, network.har, console.log, verification-report.json (all 10 output fields populated) |
| Evidence Required | GitHub Actions artifact download; contents verified against bundle spec |
| Blocking | YES — without evidence bundle, FUNCTIONAL_PASS cannot be claimed |

---

## Gate 9: CS2 UI Acceptance Readiness

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-009-GATE |
| Related Test | PIT-RED-LFV-009 |
| Description | CS2 (Johan Ras) must be able to manually verify the PIT application using the CS2 UI Acceptance Checklist (LFV-09) |
| Expected Failure (RED) | LFV-09 checklist items are not completeable (app not functioning); checklist not provided to CS2; CS2 review not possible |
| Expected GREEN Behaviour | All 11 LFV-09 checklist sections completeable by Johan Ras via manual review of deployed app; sign-off block signed and dated |
| Evidence Required | LFV-09 checklist with all items ticked; CS2 sign-off block completed |
| Blocking | YES — CS2 acceptance is the final gate before FUNCTIONAL_PASS |

---

## Gate 10: No FUNCTIONAL_PASS Without Deployed Evidence

| Field | Value |
|---|---|
| RED Gate ID | PIT-RED-LFV-010-GATE |
| Related Test | PIT-RED-LFV-010 |
| Description | The governance gate must block FUNCTIONAL_PASS claims unless deployed LFV evidence is present in the PREHANDOVER proof |
| Expected Failure (RED) | FUNCTIONAL_PASS claimed in PR body without evidence bundle; governance gate passes without checking for LFV evidence |
| Expected GREEN Behaviour | Any FUNCTIONAL_PASS claim in a PIT PR is blocked unless: (1) LFV workflow artifact exists, (2) CS2 acceptance checklist signed, (3) IAA token references LFV evidence |
| Enforcement Mechanism | `validate-product-delivery-gates.sh` checks for `FUNCTIONAL_PASS` claim and requires corresponding LFV evidence |
| Evidence Required | PREHANDOVER proof references lFV evidence bundle path; IAA token confirms LFV evidence reviewed |
| Blocking | YES — constitutional gate; cannot be bypassed |

---

## Evidence Bundle Specification

The complete LFV evidence bundle must contain:

```
lFV-evidence-bundle-pit-{wave}-{date}.zip
├── screenshots/
│   ├── journey-01-login-dashboard.png
│   ├── journey-01-create-project.png
│   ├── journey-01-milestone-created.png
│   ├── journey-01-task-created.png
│   ├── journey-01-task-assigned.png
│   ├── journey-02-evidence-uploaded.png
│   ├── journey-02-evidence-approved.png
│   ├── journey-03-report-generated.png
│   ├── [all other journey screenshots]
│   ├── sha-match.png
│   ├── bypass-active.png
│   └── [identity screenshots: login-cs2_admin.png ... login-viewer.png]
├── playwright-trace.zip
├── network.har
├── console.log
└── verification-report.json (fields: deployed_sha, bypass_active, test_identity_status, journey_results, evidence_status, screenshot_count, har_size, trace_size, verification_timestamp, iaa_gate_status)
```

---

## Live Verification Non-Goals

This Stage 6 specification does NOT:
- Activate `modules/pit/05-live-functional-verification/pit-live-verification-workflow.yml` in `.github/workflows/`
- Execute any live verification against a deployed instance
- Create test users or seed data
- Claim FUNCTIONAL_PASS

These actions are deferred to Stage 12 Build Execution.

---

## Summary

| Gate ID | Description | Priority | Status |
|---|---|---|---|
| PIT-RED-LFV-001-GATE | Deployed route smoke tests | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-002-GATE | Vercel bypass access | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-001-SHA | Deployed SHA match | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-004-GATE | GitHub Actions secrets | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-003-GATE | Test identity login readiness | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-005-GATE | Full journey completion | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-006-GATE | CTA→backend→state reflection | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-008-GATE | Evidence artifact bundle | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-009-GATE | CS2 UI acceptance readiness | P1 | RED_TEST_DEFINED |
| PIT-RED-LFV-010-GATE | No FUNCTIONAL_PASS without deployed evidence | P1 | RED_TEST_DEFINED |

**10 LFV RED gates defined. All P1. All mandatory for FUNCTIONAL_PASS.**
