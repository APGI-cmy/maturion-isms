# 06 — Live Verification Workflow Spec
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

This spec defines the GitHub Actions workflow that MUST be used for PIT Live Functional Verification. It specifies the workflow architecture, required jobs, all 10 output fields, all 5 required artifacts, and the gate criteria that must pass before FUNCTIONAL_PASS can be claimed.

---

## Workflow File Location

### Design Artifact (this wave)
```
modules/pit/05-live-functional-verification/pit-live-verification-workflow.yml
```
This file is a DESIGN ARTIFACT only. It defines the workflow structure for review and approval.

### Active Workflow (Stage 8 — deferred)
```
.github/workflows/pit-live-verification.yml
```
**Active workflow installation is deferred to Stage 8 (Implementation Plan).** This file MUST NOT be placed in `.github/workflows/` until Stage 8 explicitly authorises active workflow installation.

> **Authority**: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §5 | Issue maturion-isms#1619

---

## Execution Environment

| Requirement | Specification |
|-------------|---------------|
| **Runtime** | GitHub Actions `ubuntu-latest` |
| **NOT** | Interactive coding agent (secrets not available; no deployment URL access) |
| **Node.js** | 20.x LTS |
| **Playwright** | Latest stable (e.g. `@playwright/test@^1.44`) |
| **Browser** | Chromium (Playwright default) |
| **Trigger** | `workflow_dispatch` (manual) or `pull_request` on `modules/pit/**` changes |

---

## Trigger Specification

### workflow_dispatch Inputs
```yaml
inputs:
  deployment_url:
    description: 'Full Vercel deployment URL to verify against'
    required: true
    type: string
  test_role:
    description: 'Role to authenticate as for primary journey'
    required: true
    type: choice
    options:
      - cs2_admin
      - org_admin
      - project_manager
      - contributor
      - viewer
    default: project_manager
```

### pull_request Trigger
```yaml
on:
  pull_request:
    paths:
      - 'modules/pit/**'
      - 'apps/pit/**'
      - 'packages/**'
```

---

## Required Environment Variables

All secrets must be pre-configured in GitHub Actions (`Settings → Secrets and variables → Actions`):

```yaml
env:
  MODULE_NAME: "PIT"
  DEPLOYMENT_URL: ${{ github.event.inputs.deployment_url || vars.PIT_PREVIEW_URL }}
  BYPASS_TOKEN: ${{ secrets.BYPASS_TOKEN }}
  TEST_ORG_ID: ${{ secrets.TEST_ORG_ID }}
  TEST_ORG_SLUG: ${{ secrets.TEST_ORG_SLUG }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  AIMC_TEST_ENABLED: ${{ secrets.AIMC_TEST_ENABLED }}
  # Role credentials mapped by test_role input:
  PIT_TEST_CS2_ADMIN_EMAIL: ${{ secrets.PIT_TEST_CS2_ADMIN_EMAIL }}
  PIT_TEST_CS2_ADMIN_PASSWORD: ${{ secrets.PIT_TEST_CS2_ADMIN_PASSWORD }}
  PIT_TEST_ORG_ADMIN_EMAIL: ${{ secrets.PIT_TEST_ORG_ADMIN_EMAIL }}
  PIT_TEST_ORG_ADMIN_PASSWORD: ${{ secrets.PIT_TEST_ORG_ADMIN_PASSWORD }}
  PIT_TEST_PROJECT_MANAGER_EMAIL: ${{ secrets.PIT_TEST_PROJECT_MANAGER_EMAIL }}
  PIT_TEST_PROJECT_MANAGER_PASSWORD: ${{ secrets.PIT_TEST_PROJECT_MANAGER_PASSWORD }}
  PIT_TEST_TEAM_LEADER_EMAIL: ${{ secrets.PIT_TEST_TEAM_LEADER_EMAIL }}
  PIT_TEST_TEAM_LEADER_PASSWORD: ${{ secrets.PIT_TEST_TEAM_LEADER_PASSWORD }}
  PIT_TEST_CONTRIBUTOR_EMAIL: ${{ secrets.PIT_TEST_CONTRIBUTOR_EMAIL }}
  PIT_TEST_CONTRIBUTOR_PASSWORD: ${{ secrets.PIT_TEST_CONTRIBUTOR_PASSWORD }}
  PIT_TEST_VIEWER_EMAIL: ${{ secrets.PIT_TEST_VIEWER_EMAIL }}
  PIT_TEST_VIEWER_PASSWORD: ${{ secrets.PIT_TEST_VIEWER_PASSWORD }}
```

---

## Required Output Fields

The verification workflow MUST produce all 10 of the following output fields in `GITHUB_STEP_SUMMARY` and `verification-report.txt`:

| # | Field Name | Type | Description |
|---|-----------|------|-------------|
| 1 | `DEPLOYMENT_ACCESS` | PASS / FAIL | Whether the deployment URL returned HTTP 200 with bypass token applied |
| 2 | `LOGIN_SUCCESS` | PASS / FAIL | Whether the selected test role authenticated successfully (valid Supabase JWT obtained) |
| 3 | `DASHBOARD_OR_PAGE_LOAD` | PASS / FAIL | Whether `/dashboard` (or role-appropriate landing page) rendered without white screen or uncaught errors |
| 4 | `USER_JOURNEY_COMPLETE` | PASS / FAIL / PARTIAL | Whether the primary LFV journey completed all steps (project create → milestone → task → evidence → notification → report) |
| 5 | `FAILING_REQUEST` | PASS / FAIL | Whether any unexpected non-2xx responses were detected on happy-path API calls (expected 403s on denied routes do NOT count as failures) |
| 6 | `HTTP_STATUS` | String | Summary of HTTP status codes observed (e.g. "200×12, 201×5, 403×2 (expected)") |
| 7 | `RESPONSE_BODY` | String | Truncated response body from any failing requests (empty if all passed) |
| 8 | `CONSOLE_ERROR` | PASS / FAIL | Whether any `console.error` calls or unhandled promise rejections were detected during happy-path execution |
| 9 | `LIKELY_ROOT_CAUSE` | String | AI-assisted or pattern-matched diagnosis of any failures (empty if all passed) |
| 10 | `ARTIFACT_LINKS` | String | Comma-separated list of uploaded artifact names and their GitHub Actions artifact URLs |

### Output Field Example (all passing)
```
DEPLOYMENT_ACCESS: PASS
LOGIN_SUCCESS: PASS
DASHBOARD_OR_PAGE_LOAD: PASS
USER_JOURNEY_COMPLETE: PASS
FAILING_REQUEST: PASS (0 unexpected failures)
HTTP_STATUS: 200×18, 201×7, 403×3 (expected: viewer permission-denied)
RESPONSE_BODY: (none — all requests succeeded)
CONSOLE_ERROR: PASS (0 errors detected)
LIKELY_ROOT_CAUSE: (none)
ARTIFACT_LINKS: screenshot.png, console-abc1234.log, network.har, trace-abc1234.zip, verification-report.txt
```

---

## Required Artifacts

The workflow MUST upload all 5 of the following artifacts on every run (pass or fail):

| # | Artifact Name | Format | Content | Upload Condition |
|---|--------------|--------|---------|-----------------|
| 1 | `screenshot.png` | PNG image | Full-page screenshot of the final state (last page visited); additional screenshots for key journey steps | Always |
| 2 | `console-{sha}.log` | Plain text | All browser console output (log, warn, error, debug) captured during the Playwright session | Always |
| 3 | `network.har` | HAR (JSON) | Full network request/response log (HTTP Archive) for all requests made during the session | Always |
| 4 | `trace-{sha}.zip` | Playwright Trace ZIP | Full Playwright trace archive (screenshots, DOM snapshots, network, console at each step) | Always |
| 5 | `verification-report.txt` | Plain text | Structured report with all 10 output fields, timestamp, git SHA, deployment URL, gate summary | Always |

Where `{sha}` is the first 7 characters of `github.sha` (e.g. `console-abc1234.log`).

### Artifact Retention
- Retained for: 30 days (default GitHub Actions retention)
- Artifacts must be attached to the PR check run that produced them

---

## Workflow Jobs Architecture

### Job 1: `preflight`
- Verify deployment URL is accessible (HTTP 200 with bypass)
- Verify deployed SHA matches PR head SHA
- Output: `DEPLOYMENT_ACCESS`, `DEPLOYED_SHA_MATCH`
- Fails fast if deployment not accessible

### Job 2: `verify-project-manager-journey` (depends on `preflight`)
- Authenticates as `project_manager`
- Executes: login → dashboard → create project → create milestone → create task → change task status → generate report
- Captures: screenshot, console log, network HAR, Playwright trace
- Outputs: `LOGIN_SUCCESS`, `DASHBOARD_OR_PAGE_LOAD`, `USER_JOURNEY_COMPLETE` (partial)

### Job 3: `verify-contributor-journey` (depends on `verify-project-manager-journey`)
- Authenticates as `contributor`
- Executes: login → `/my-work` (verify task assigned in Job 2) → upload evidence → check notifications → mark-as-read
- Captures: screenshot, console log, trace
- Outputs: `USER_JOURNEY_COMPLETE` (partial — evidence + notifications)

### Job 4: `verify-cs2-admin-journey` (depends on `preflight`)
- Authenticates as `cs2_admin`
- Executes: login → `/admin/audit-log` (verify events from Jobs 2+3) → `/qa-dashboard`
- Captures: screenshot, console log
- Outputs: `USER_JOURNEY_COMPLETE` (audit + QA dashboard)

### Job 5: `verify-permission-denied-paths` (depends on `preflight`)
- Authenticates as `viewer`
- Attempts all write routes and admin routes
- Verifies all return permission-denied (not 500)
- Outputs: `USER_JOURNEY_COMPLETE` (permission-denied paths)

### Job 6: `verify-aimc-flow` (depends on `preflight`, conditional on `AIMC_TEST_ENABLED=true`)
- Authenticates as `contributor`
- Executes AIMC suggestion flow: get suggestion → accept → verify audit_log entry
- Also verifies dismiss flow
- Outputs: `USER_JOURNEY_COMPLETE` (AIMC journey)

### Job 7: `report` (depends on all verify jobs, `always()`)
- Aggregates all gate results
- Computes `FAILING_REQUEST`, `CONSOLE_ERROR`, `LIKELY_ROOT_CAUSE`
- Writes `verification-report.txt`
- Uploads all 5 artifacts
- Writes `GITHUB_STEP_SUMMARY`
- Determines overall PASS / FAIL

---

## LIVE_VERIFICATION_WORKFLOW_READY Gate Criteria

The workflow is considered READY when ALL of the following criteria are met. These criteria must be verified before the active workflow is installed in `.github/workflows/`:

| # | Criterion | Evidence Required |
|---|-----------|------------------|
| 1 | All 18 required secrets are configured in GitHub Actions | Screenshot of `Settings → Secrets` showing all secret names (values masked) |
| 2 | Vercel bypass token is functional for PIT preview deployments | `DEPLOYMENT_ACCESS: PASS` in at least one successful workflow run |
| 3 | All 6 test user identities exist in Supabase Auth | Query result showing 6 confirmed users |
| 4 | "PIT Test Organisation" is seeded with correct `org_id` | Query result showing org with `slug = 'pit-test-org'` |
| 5 | Fixture files committed to repository | `ls modules/pit/05-live-functional-verification/fixtures/` showing 3 fixture files |
| 6 | Workflow file produces all 5 required artifacts on first run | GitHub Actions artifact panel showing all 5 files |
| 7 | SHA-match check passes (deployed SHA = PR head SHA) | `DEPLOYED_SHA_MATCH: PASS` in workflow output |
| 8 | All 10 output fields are present in `verification-report.txt` | Content of `verification-report.txt` artifact |

---

## Step Summary Template (GITHUB_STEP_SUMMARY)

The `report` job MUST write the following structure to `$GITHUB_STEP_SUMMARY`:

```markdown
## PIT Live Functional Verification — {PASS|FAIL}

**Module**: PIT (Project Implementation Tracker)  
**Deployment URL**: {deployment_url}  
**PR Head SHA**: {github.sha}  
**Deployed SHA**: {deployed_sha}  
**Timestamp**: {ISO 8601 timestamp}  
**Test Role**: {test_role input}

### Gate Results

| Gate | Result |
|------|--------|
| DEPLOYMENT_ACCESS | {PASS/FAIL} |
| DEPLOYED_SHA_MATCH | {PASS/FAIL} |
| LOGIN_SUCCESS | {PASS/FAIL} |
| DASHBOARD_OR_PAGE_LOAD | {PASS/FAIL} |
| USER_JOURNEY_COMPLETE | {PASS/FAIL/PARTIAL} |
| FAILING_REQUEST | {PASS/FAIL} |
| HTTP_STATUS | {summary} |
| CONSOLE_ERROR | {PASS/FAIL} |
| LIKELY_ROOT_CAUSE | {diagnosis or 'none'} |
| ARTIFACT_LINKS | {artifact names} |

### Artifacts
- [screenshot.png]({artifact_url})
- [console-{sha}.log]({artifact_url})
- [network.har]({artifact_url})
- [trace-{sha}.zip]({artifact_url})
- [verification-report.txt]({artifact_url})
```

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
