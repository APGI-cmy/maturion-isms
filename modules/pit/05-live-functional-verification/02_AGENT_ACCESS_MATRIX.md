# 02 — Agent Access Matrix
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

This matrix defines which secrets, credentials, and runtime access contexts are available to each execution environment for PIT Live Functional Verification. It governs who can authenticate, what they can access, and where live verification MUST run.

---

## Critical Decision

> **All live verification that requires secret-based authentication MUST run in GitHub Actions.**  
> **Interactive Coding Agent (Copilot agent session) CANNOT authenticate as test users.**  
> The coding agent has no access to GitHub Actions secrets at runtime. Attempting to run  
> live verification from within a coding agent session will fail silently or with credential errors.

---

## PIT Secrets and Runtime Access Matrix

### Secret: `BYPASS_TOKEN`
**Purpose**: Vercel Deployment Protection bypass; allows GitHub Actions and automation to access preview deployments without manual browser authentication  
**Format**: UUID string  
**Usage**: URL parameter `?x-vercel-protection-bypass=<BYPASS_TOKEN>&x-vercel-set-bypass-cookie=samesitenone` + request header `x-vercel-protection-bypass: <BYPASS_TOKEN>`  
**GitHub Secret Name**: `BYPASS_TOKEN`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secret not available in agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.BYPASS_TOKEN }}` |
| Vercel Automation | ✅ CONFIGURED | Set in Vercel project settings as Protection Bypass secret |
| Supabase Runtime | N/A | Not applicable |
| CS2 Manual | ✅ AVAILABLE | CS2 may configure in browser manually |

---

### Secret: `PIT_TEST_CS2_ADMIN_EMAIL` / `PIT_TEST_CS2_ADMIN_PASSWORD`
**Purpose**: Authentication as `cs2_admin` role for live verification (audit log, QA dashboard, org-level operations)  
**Test User Email**: `pit.cs2admin@test.maturion.dev`  
**Role Grants**: `cs2_admin` — full system access including cross-org visibility and audit log  
**GitHub Secret Names**: `PIT_TEST_CS2_ADMIN_EMAIL`, `PIT_TEST_CS2_ADMIN_PASSWORD`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secrets not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.PIT_TEST_CS2_ADMIN_EMAIL }}` etc. |
| Vercel Automation | N/A | Not applicable for user credentials |
| Supabase Runtime | ✅ AVAILABLE | Direct Supabase Auth login in service scripts |
| CS2 Manual | ✅ AVAILABLE | Johan Ras has direct access |

---

### Secret: `PIT_TEST_ORG_ADMIN_EMAIL` / `PIT_TEST_ORG_ADMIN_PASSWORD`
**Purpose**: Authentication as `org_admin` role for live verification (org management, user management, org-scoped audit log)  
**Test User Email**: `pit.orgadmin@test.maturion.dev`  
**Role Grants**: `org_admin` — full org management within "PIT Test Organisation"  
**GitHub Secret Names**: `PIT_TEST_ORG_ADMIN_EMAIL`, `PIT_TEST_ORG_ADMIN_PASSWORD`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secrets not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.PIT_TEST_ORG_ADMIN_EMAIL }}` etc. |
| Vercel Automation | N/A | Not applicable for user credentials |
| Supabase Runtime | ✅ AVAILABLE | Direct Supabase Auth login in service scripts |
| CS2 Manual | ✅ AVAILABLE | Johan Ras has direct access |

---

### Secret: `PIT_TEST_PROJECT_MANAGER_EMAIL` / `PIT_TEST_PROJECT_MANAGER_PASSWORD`
**Purpose**: Authentication as `project_manager` role for live verification (primary happy-path role — project, milestone, deliverable, task, report management)  
**Test User Email**: `pit.pm@test.maturion.dev`  
**Role Grants**: `project_manager` — project creation, milestone/deliverable/task management, evidence review, report generation  
**GitHub Secret Names**: `PIT_TEST_PROJECT_MANAGER_EMAIL`, `PIT_TEST_PROJECT_MANAGER_PASSWORD`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secrets not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.PIT_TEST_PROJECT_MANAGER_EMAIL }}` etc. |
| Vercel Automation | N/A | Not applicable for user credentials |
| Supabase Runtime | ✅ AVAILABLE | Direct Supabase Auth login in service scripts |
| CS2 Manual | ✅ AVAILABLE | Johan Ras has direct access |

---

### Secret: `PIT_TEST_TEAM_LEADER_EMAIL` / `PIT_TEST_TEAM_LEADER_PASSWORD`
**Purpose**: Authentication as `team_leader` role for live verification (task oversight within assigned projects)  
**Test User Email**: `pit.tl@test.maturion.dev`  
**Role Grants**: `team_leader` — task management within assigned projects; evidence review; read-access to milestones/deliverables  
**GitHub Secret Names**: `PIT_TEST_TEAM_LEADER_EMAIL`, `PIT_TEST_TEAM_LEADER_PASSWORD`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secrets not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.PIT_TEST_TEAM_LEADER_EMAIL }}` etc. |
| Vercel Automation | N/A | Not applicable for user credentials |
| Supabase Runtime | ✅ AVAILABLE | Direct Supabase Auth login in service scripts |
| CS2 Manual | ✅ AVAILABLE | Johan Ras has direct access |

---

### Secret: `PIT_TEST_CONTRIBUTOR_EMAIL` / `PIT_TEST_CONTRIBUTOR_PASSWORD`
**Purpose**: Authentication as `contributor` role for live verification (task completion, evidence upload, notification receipt, AIMC suggestion flow)  
**Test User Email**: `pit.contributor@test.maturion.dev`  
**Role Grants**: `contributor` — task status updates, evidence upload, view assigned projects  
**GitHub Secret Names**: `PIT_TEST_CONTRIBUTOR_EMAIL`, `PIT_TEST_CONTRIBUTOR_PASSWORD`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secrets not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.PIT_TEST_CONTRIBUTOR_EMAIL }}` etc. |
| Vercel Automation | N/A | Not applicable for user credentials |
| Supabase Runtime | ✅ AVAILABLE | Direct Supabase Auth login in service scripts |
| CS2 Manual | ✅ AVAILABLE | Johan Ras has direct access |

---

### Secret: `PIT_TEST_VIEWER_EMAIL` / `PIT_TEST_VIEWER_PASSWORD`
**Purpose**: Authentication as `viewer` role for live verification (permission-denied paths; read-only access verification; QA dashboard denial)  
**Test User Email**: `pit.viewer@test.maturion.dev`  
**Role Grants**: `viewer` — read-only access to assigned project data; all write operations and admin routes denied  
**GitHub Secret Names**: `PIT_TEST_VIEWER_EMAIL`, `PIT_TEST_VIEWER_PASSWORD`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Secrets not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.PIT_TEST_VIEWER_EMAIL }}` etc. |
| Vercel Automation | N/A | Not applicable for user credentials |
| Supabase Runtime | ✅ AVAILABLE | Direct Supabase Auth login in service scripts |
| CS2 Manual | ✅ AVAILABLE | Johan Ras has direct access |

---

### Secret: `TEST_ORG_ID`
**Purpose**: The UUID of "PIT Test Organisation" in the Supabase database. Used to scope all test data operations and to construct storage paths `{org_id}/{project_id}/{task_id}/{filename}`  
**Format**: UUID  
**GitHub Secret Name**: `TEST_ORG_ID`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.TEST_ORG_ID }}` |
| Vercel Automation | N/A | Not applicable |
| Supabase Runtime | ✅ AVAILABLE | Readable from `organisations` table after auth |
| CS2 Manual | ✅ AVAILABLE | Visible in Supabase dashboard |

---

### Secret: `TEST_ORG_SLUG`
**Purpose**: The URL slug for "PIT Test Organisation" (value: `pit-test-org`). Used in URL construction and org-context lookups.  
**Format**: String (lowercase, hyphenated)  
**Value**: `pit-test-org`  
**GitHub Secret Name**: `TEST_ORG_SLUG`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Not available in coding agent session |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.TEST_ORG_SLUG }}` |
| Vercel Automation | N/A | Not applicable |
| Supabase Runtime | ✅ AVAILABLE | Readable from `organisations` table |
| CS2 Manual | ✅ AVAILABLE | Known value |

---

### Secret: `SUPABASE_URL`
**Purpose**: The Supabase project URL for the PIT environment (e.g. `https://<project-ref>.supabase.co`). Required for all direct API calls in verification scripts.  
**Format**: HTTPS URL  
**GitHub Secret Name**: `SUPABASE_URL`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Not available in coding agent session for test auth |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.SUPABASE_URL }}` |
| Vercel Automation | ✅ AVAILABLE | Set as environment variable in Vercel project |
| Supabase Runtime | ✅ AVAILABLE | Intrinsic to Edge Function execution context |
| CS2 Manual | ✅ AVAILABLE | Visible in Supabase dashboard |

---

### Secret: `SUPABASE_ANON_KEY`
**Purpose**: The Supabase anonymous/public API key. Used for public endpoint calls and as the starting point for authenticated sessions in verification scripts.  
**Format**: JWT string  
**GitHub Secret Name**: `SUPABASE_ANON_KEY`

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Not available in coding agent session for test operations |
| GitHub Actions | ✅ AVAILABLE | Injected via `${{ secrets.SUPABASE_ANON_KEY }}` |
| Vercel Automation | ✅ AVAILABLE | Set as `VITE_SUPABASE_ANON_KEY` or equivalent in Vercel |
| Supabase Runtime | ✅ AVAILABLE | Intrinsic to Edge Function context |
| CS2 Manual | ✅ AVAILABLE | Visible in Supabase dashboard → Project Settings → API |

---

### Flag: `AIMC_TEST_ENABLED`
**Purpose**: Feature flag to enable AIMC suggestion UI in test environment. When `true`, the "Get AI Suggestion" button appears in task detail and AIMC flows are active. When `false`, AIMC suggestion UI is hidden (graceful degradation).  
**Format**: Boolean string (`"true"` / `"false"`)  
**GitHub Secret/Variable Name**: `AIMC_TEST_ENABLED`  
**Default for LFV**: `"true"` — AIMC flows must be verified in live verification

| Context | Access | Notes |
|---------|--------|-------|
| Interactive Coding Agent | ❌ CANNOT USE | Cannot toggle feature flags in deployed environment |
| GitHub Actions | ✅ AVAILABLE | Set as env var or secret; passed to Playwright test |
| Vercel Automation | ✅ AVAILABLE | Set as `AIMC_TEST_ENABLED=true` in Vercel preview env |
| Supabase Runtime | N/A | Not a Supabase flag |
| CS2 Manual | ✅ AVAILABLE | CS2 can toggle in Vercel dashboard or verify manually |

---

## Consolidated Access Summary

| Secret / Credential | Interactive Coding Agent | GitHub Actions | Vercel Automation | Supabase Runtime | CS2 Manual |
|--------------------|--------------------------|----------------|-------------------|-----------------|------------|
| `BYPASS_TOKEN` | ❌ | ✅ | ✅ | N/A | ✅ |
| `PIT_TEST_CS2_ADMIN_EMAIL/PASSWORD` | ❌ | ✅ | N/A | ✅ | ✅ |
| `PIT_TEST_ORG_ADMIN_EMAIL/PASSWORD` | ❌ | ✅ | N/A | ✅ | ✅ |
| `PIT_TEST_PROJECT_MANAGER_EMAIL/PASSWORD` | ❌ | ✅ | N/A | ✅ | ✅ |
| `PIT_TEST_TEAM_LEADER_EMAIL/PASSWORD` | ❌ | ✅ | N/A | ✅ | ✅ |
| `PIT_TEST_CONTRIBUTOR_EMAIL/PASSWORD` | ❌ | ✅ | N/A | ✅ | ✅ |
| `PIT_TEST_VIEWER_EMAIL/PASSWORD` | ❌ | ✅ | N/A | ✅ | ✅ |
| `TEST_ORG_ID` | ❌ | ✅ | N/A | ✅ | ✅ |
| `TEST_ORG_SLUG` | ❌ | ✅ | N/A | ✅ | ✅ |
| `SUPABASE_URL` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `SUPABASE_ANON_KEY` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `AIMC_TEST_ENABLED` | ❌ | ✅ | ✅ | N/A | ✅ |

---

## GitHub Actions Required Secrets Checklist

Before running `pit-live-verification.yml`, confirm ALL of the following secrets are registered in the GitHub repository (`Settings → Secrets and variables → Actions`):

- [ ] `BYPASS_TOKEN`
- [ ] `PIT_TEST_CS2_ADMIN_EMAIL`
- [ ] `PIT_TEST_CS2_ADMIN_PASSWORD`
- [ ] `PIT_TEST_ORG_ADMIN_EMAIL`
- [ ] `PIT_TEST_ORG_ADMIN_PASSWORD`
- [ ] `PIT_TEST_PROJECT_MANAGER_EMAIL`
- [ ] `PIT_TEST_PROJECT_MANAGER_PASSWORD`
- [ ] `PIT_TEST_TEAM_LEADER_EMAIL`
- [ ] `PIT_TEST_TEAM_LEADER_PASSWORD`
- [ ] `PIT_TEST_CONTRIBUTOR_EMAIL`
- [ ] `PIT_TEST_CONTRIBUTOR_PASSWORD`
- [ ] `PIT_TEST_VIEWER_EMAIL`
- [ ] `PIT_TEST_VIEWER_PASSWORD`
- [ ] `TEST_ORG_ID`
- [ ] `TEST_ORG_SLUG`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `AIMC_TEST_ENABLED`

---

## Security Notes

1. **Test credentials are separate from production**: All `pit.*@test.maturion.dev` accounts are test-only and have no access to production data.
2. **Never commit secrets to source**: All secrets are stored in GitHub Actions Secrets, not in code or YAML files.
3. **Least privilege**: Each test user has only the role required for their verification journey; no test user has elevated privileges beyond their defined role.
4. **Seed data isolation**: All test data is scoped to `TEST_ORG_ID` ("PIT Test Organisation") and is not shared with production org data.
5. **BYPASS_TOKEN rotation**: The Vercel bypass token should be rotated after each major verification cycle.

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
