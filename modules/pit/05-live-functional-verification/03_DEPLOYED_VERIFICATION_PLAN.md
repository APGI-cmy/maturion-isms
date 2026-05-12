# 03 — Deployed Verification Plan
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

This plan defines the concrete verification steps that MUST be executed against a live Vercel deployment of PIT to satisfy the FUNCTIONAL_PASS gate. It specifies the deployment target, bypass mechanism, required secrets, seed data, fixture files, and the 8-gate pass/fail criteria table.

---

## 1. Vercel Preview URL Strategy

### URL Format
PIT preview deployments follow the standard Vercel pattern:

```
https://maturion-isms-pit-[branch-hash].vercel.app
```

Where `[branch-hash]` is the unique deployment identifier assigned by Vercel for the branch being verified.

### Stable Preview URL (per PR)
Vercel also generates a stable PR-linked preview URL:
```
https://maturion-isms-git-[branch-name]-[org-slug].vercel.app
```

### Production URL (when deployed)
```
https://pit.maturion.app
```
or the production Vercel domain configured for the PIT module.

### URL Discovery in CI
In GitHub Actions, the deployed Vercel URL is retrieved via:
1. `vercel ls --prod` or Vercel CLI `vercel inspect` after deployment
2. Vercel GitHub integration deployment comment on the PR
3. `deployment_url` input parameter (workflow_dispatch)

---

## 2. Vercel Deployment Protection Bypass

All PIT preview deployments are protected by Vercel Deployment Protection. GitHub Actions and automation tools MUST use the bypass mechanism to access protected URLs.

### Method 1: URL Query Parameters (Browser / Playwright)
```
https://<deployment-url>/login?x-vercel-protection-bypass=<BYPASS_TOKEN>&x-vercel-set-bypass-cookie=samesitenone
```
This sets a bypass cookie for subsequent requests in the same browser session.

### Method 2: HTTP Request Header (API / fetch calls)
```
x-vercel-protection-bypass: <BYPASS_TOKEN>
```
Used for non-browser HTTP calls (e.g., health checks, API calls from curl/fetch).

### Playwright Implementation
```javascript
// Navigate with bypass token to set the session cookie
await page.goto(`${DEPLOYMENT_URL}/login?x-vercel-protection-bypass=${BYPASS_TOKEN}&x-vercel-set-bypass-cookie=samesitenone`);
// All subsequent page.goto() calls in same context bypass protection automatically
```

### Secret Reference
`BYPASS_TOKEN` must be stored as a GitHub Actions secret. See `02_AGENT_ACCESS_MATRIX.md`.

---

## 3. Required GitHub Actions Secrets

All of the following secrets MUST be configured before the verification workflow can run:

| Secret Name | Purpose |
|-------------|---------|
| `BYPASS_TOKEN` | Vercel protection bypass |
| `PIT_TEST_CS2_ADMIN_EMAIL` | cs2_admin test user email |
| `PIT_TEST_CS2_ADMIN_PASSWORD` | cs2_admin test user password |
| `PIT_TEST_ORG_ADMIN_EMAIL` | org_admin test user email |
| `PIT_TEST_ORG_ADMIN_PASSWORD` | org_admin test user password |
| `PIT_TEST_PROJECT_MANAGER_EMAIL` | project_manager test user email |
| `PIT_TEST_PROJECT_MANAGER_PASSWORD` | project_manager test user password |
| `PIT_TEST_TEAM_LEADER_EMAIL` | team_leader test user email |
| `PIT_TEST_TEAM_LEADER_PASSWORD` | team_leader test user password |
| `PIT_TEST_CONTRIBUTOR_EMAIL` | contributor test user email |
| `PIT_TEST_CONTRIBUTOR_PASSWORD` | contributor test user password |
| `PIT_TEST_VIEWER_EMAIL` | viewer test user email |
| `PIT_TEST_VIEWER_PASSWORD` | viewer test user password |
| `TEST_ORG_ID` | "PIT Test Organisation" UUID |
| `TEST_ORG_SLUG` | "pit-test-org" slug |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public API key |
| `AIMC_TEST_ENABLED` | AIMC suggestion feature flag |

---

## 4. Supabase Project Access Required

### Supabase Project URL
Must match `SUPABASE_URL` secret. The PIT module uses a dedicated Supabase project (or the shared Maturion ISMS project with PIT-specific schemas).

### Required Supabase Access for Verification

| Resource | Purpose | Access Level |
|----------|---------|-------------|
| `projects` table | Verify project creation | SELECT (anon key with RLS) |
| `milestones` table | Verify milestone creation | SELECT (authenticated) |
| `deliverables` table | Verify deliverable creation | SELECT (authenticated) |
| `tasks` table | Verify task creation + assignment | SELECT (authenticated) |
| `evidence_items` table | Verify evidence status | SELECT (authenticated) |
| `notifications` table | Verify notification creation + read | SELECT (authenticated) |
| `report_history` table | Verify report record | SELECT (authenticated) |
| `audit_log` table | Verify audit entries | SELECT (cs2_admin only) |
| `qa_runs` table | Verify QA dashboard data | SELECT (cs2_admin only) |
| `pit-evidence` storage bucket | Verify file upload | SELECT (authenticated, scoped to org) |
| `pit-reports` storage bucket | Verify report file | SELECT (authenticated, scoped to org) |
| Edge Function logs | Debug generate_report, pit-task-advisor | CS2 / Supabase dashboard |

### Edge Function Endpoints
| Function | URL | Used By |
|----------|-----|---------|
| `generate_report` | `POST /functions/v1/generate-report` | Report generation journey |
| `pit-task-advisor` | `POST /functions/v1/pit-task-advisor` | AIMC suggestion journey |
| `send_notification_email` | `POST /functions/v1/send-notification-email` | Notification email flow |
| `compute_progress_rollup` | `POST /functions/v1/compute-progress-rollup` | Dashboard progress display |
| `watchdog_evaluation` | `POST /functions/v1/watchdog-evaluation` | Timeline override triggers |

---

## 5. Required Seed Data

Before verification begins, the following seed data MUST exist in the Supabase project:

### Test Organisation
| Field | Value |
|-------|-------|
| Name | PIT Test Organisation |
| Slug | pit-test-org |
| `org_id` | Must match `TEST_ORG_ID` secret |
| Status | Active |

### Test Users (one per role)
| Email | Role | Organisation Membership |
|-------|------|------------------------|
| `pit.cs2admin@test.maturion.dev` | `cs2_admin` | Cross-org (system-level) |
| `pit.orgadmin@test.maturion.dev` | `org_admin` | PIT Test Organisation |
| `pit.pm@test.maturion.dev` | `project_manager` | PIT Test Organisation |
| `pit.tl@test.maturion.dev` | `team_leader` | PIT Test Organisation |
| `pit.contributor@test.maturion.dev` | `contributor` | PIT Test Organisation |
| `pit.viewer@test.maturion.dev` | `viewer` | PIT Test Organisation |

All test users must:
- Have confirmed email addresses (email verification pre-completed)
- Be members of `user_org_memberships` with correct role for PIT Test Organisation
- Have passwords matching their respective `PIT_TEST_*_PASSWORD` secrets

### Baseline Project (optional, for idempotent re-runs)
A baseline project "LFV Baseline Project" may be pre-seeded to support verification runs that read project data without creating new projects. Journey 3 (Project Creation) must still create a NEW project.

---

## 6. Required Fixtures

The following fixture files must be available for upload tests. They must be committed to the repository or accessible to the CI environment.

| Fixture | Path | Size | Purpose |
|---------|------|------|---------|
| `test-evidence.pdf` | `modules/pit/05-live-functional-verification/fixtures/test-evidence.pdf` | ≤50KB | Journey 9: Evidence upload (primary) |
| `test-evidence-image.png` | `modules/pit/05-live-functional-verification/fixtures/test-evidence-image.png` | ≤100KB | Journey 9: Evidence upload (alternate type) |
| `test-evidence-spreadsheet.xlsx` | `modules/pit/05-live-functional-verification/fixtures/test-evidence-spreadsheet.xlsx` | ≤50KB | Journey 9: Evidence upload (alternate type) |

> **Note**: Fixture files are small, benign test files. The PDF must be a valid PDF (not just renamed). The PNG must be a valid image. The XLSX must be a valid spreadsheet. All must be ≤50MB (well under the PIT upload limit).

---

## 7. SHA-Match Rule

**The deployed Vercel build MUST match the PR head commit SHA.**

This ensures verification is performed against the exact code under review, not a stale deployment.

### Verification Steps
1. Record the PR head commit SHA: `${{ github.event.pull_request.head.sha }}`
2. Fetch the deployed SHA from the Vercel deployment metadata
3. Compare: if `DEPLOYED_SHA != PR_HEAD_SHA` → fail the `DEPLOYED_SHA_MATCH` gate
4. Do not proceed with functional verification if SHA mismatch detected

### Acceptable Tolerance
- No tolerance: exact SHA match required
- If SHA mismatch occurs, re-trigger deployment and re-run verification

---

## 8. Pre-Verification Setup Steps

Before executing the verification journey steps, the following must be confirmed:

| # | Setup Step | How to Verify | Failure Action |
|---|-----------|---------------|----------------|
| 1 | Vercel deployment is live and returns HTTP 200 | `curl -I <deployment-url>` | Wait for deployment or fail |
| 2 | Deployed SHA matches PR head SHA | Compare Vercel metadata vs `github.sha` | Fail `DEPLOYED_SHA_MATCH` gate; do not continue |
| 3 | Vercel bypass token is functional | `curl -I "<deployment-url>?x-vercel-protection-bypass=<token>"` returns 200 | Check `BYPASS_TOKEN` secret |
| 4 | Supabase is reachable | `curl -I <SUPABASE_URL>/rest/v1/` | Check `SUPABASE_URL` secret |
| 5 | Test users exist in Supabase Auth | Query `auth.users` or attempt login | Run seed script |
| 6 | "PIT Test Organisation" exists | Query `organisations` where `slug = 'pit-test-org'` | Run seed script |
| 7 | All 6 test users are members of test org | Query `user_org_memberships` | Run seed script |
| 8 | Fixture files exist in CI workspace | `ls fixtures/test-evidence.*` | Commit fixtures to repo |
| 9 | Node.js + Playwright installed in CI | `npx playwright --version` | Install in workflow setup step |

---

## 9. Verification Steps Table

Execute in order. Each step must pass before proceeding to the next.

| # | Step | Tool | Role | Expected Outcome | Gate |
|---|------|------|------|-----------------|------|
| 1 | Navigate to deployment URL with bypass token | Playwright | None | `/login` page renders; no white screen | `DEPLOYMENT_ACCESS` |
| 2 | Login as `project_manager` | Playwright | project_manager | Redirect to `/dashboard`; no error | `LOGIN_SUCCESS` |
| 3 | Verify `/dashboard` renders correctly | Playwright | project_manager | Dashboard shell visible; nav + org name present | `DASHBOARD_OR_PAGE_LOAD` |
| 4 | Create project "LFV Test Project" | Playwright | project_manager | Project created; appears in `/projects` list | `USER_JOURNEY_COMPLETE` |
| 5 | Create milestone "M1 — LFV Milestone" | Playwright | project_manager | Milestone visible in `/projects/:id/milestones` | `USER_JOURNEY_COMPLETE` |
| 6 | Create deliverable "D1 — LFV Deliverable" | Playwright | project_manager | Deliverable visible; linked to M1 | `USER_JOURNEY_COMPLETE` |
| 7 | Create task; assign to contributor | Playwright | project_manager | Task visible; contributor notified | `USER_JOURNEY_COMPLETE` |
| 8 | Login as `contributor`; check `/my-work` | Playwright | contributor | Assigned task appears | `USER_JOURNEY_COMPLETE` |
| 9 | Upload `test-evidence.pdf` to task | Playwright | contributor | Evidence `status = 'pending_review'` | `USER_JOURNEY_COMPLETE` |
| 10 | Login as `project_manager`; approve evidence | Playwright | project_manager | Evidence `status = 'approved'` | `USER_JOURNEY_COMPLETE` |
| 11 | Check notification bell count | Playwright | contributor | Count incremented (Realtime) | `USER_JOURNEY_COMPLETE` |
| 12 | Mark notification as read | Playwright | contributor | Count decremented; `read_at` set | `USER_JOURNEY_COMPLETE` |
| 13 | Generate "Summary PDF" report | Playwright | project_manager | Report in `pit-reports`; history entry created | `USER_JOURNEY_COMPLETE` |
| 14 | Download report | Playwright | project_manager | PDF download succeeds | `USER_JOURNEY_COMPLETE` |
| 15 | Login as `cs2_admin`; view audit log | Playwright | cs2_admin | All events visible; filters work | `USER_JOURNEY_COMPLETE` |
| 16 | Login as `viewer`; attempt `/projects/new` | Playwright | viewer | Permission-denied screen | `USER_JOURNEY_COMPLETE` |
| 17 | `viewer` attempts to access `/qa-dashboard` | Playwright | viewer | Permission-denied screen | `USER_JOURNEY_COMPLETE` |
| 18 | `cs2_admin` views `/qa-dashboard` | Playwright | cs2_admin | QA dashboard renders with wave data | `USER_JOURNEY_COMPLETE` |
| 19 | Timeline drag/resize (if AIMC=false) | Playwright | project_manager | Date update persisted | `USER_JOURNEY_COMPLETE` |
| 20 | AIMC suggestion flow (if AIMC_TEST_ENABLED=true) | Playwright | contributor | Suggestion shown; accept/dismiss logged | `USER_JOURNEY_COMPLETE` |
| 21 | Capture all 5 artifacts | GitHub Actions | CI | screenshot, console log, HAR, trace, report | `ARTIFACT_LINKS` |
| 22 | Write gate summary to GITHUB_STEP_SUMMARY | GitHub Actions | CI | Summary visible in workflow run | All gates |

---

## 10. Gate Pass/Fail Criteria Table

All 8 gates must PASS for FUNCTIONAL_PASS to be claimed.

| Gate | Description | Pass Criteria | Fail Criteria |
|------|-------------|---------------|---------------|
| **DEPLOYMENT_ACCESS** | Live deployment accessible | HTTP 200 from deployment URL with bypass token | Non-200 HTTP; timeout; white screen on first load |
| **DEPLOYED_SHA_MATCH** | Build SHA matches PR head | `DEPLOYED_SHA == PR_HEAD_SHA` | SHA mismatch; cannot determine deployed SHA |
| **LOGIN_SUCCESS** | All test roles can authenticate | All 6 test users achieve valid Supabase session | Any role fails to login; session not established |
| **DASHBOARD_OR_PAGE_LOAD** | Post-login page renders | `/dashboard` or role-appropriate landing page renders without white screen or JS error | White screen; uncaught exception in console; blank content |
| **USER_JOURNEY_COMPLETE** | All 16 journeys pass | All journeys in `01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md` complete with success criteria met | Any journey fails; any success criterion not met |
| **FAILING_REQUEST** | No unexpected HTTP failures | Zero non-200/non-201 responses on happy-path flows (excluding known expected 403s for permission-denied paths) | Any 400/500 response on happy-path; any unexpected 403 |
| **CONSOLE_ERROR** | No blocking console errors | Zero `console.error` or unhandled promise rejections on happy-path flows | Any `console.error` from application code; unhandled rejection |
| **ARTIFACT_LINKS** | All 5 evidence artifacts uploaded | screenshot.png, console-{sha}.log, network.har, trace-{sha}.zip, verification-report.txt all present as workflow artifacts | Any artifact absent; artifact file size 0 bytes |

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
