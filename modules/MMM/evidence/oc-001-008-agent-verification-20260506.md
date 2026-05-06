# MMM Operational Closure — Agent Verification Evidence

**Date**: 2026-05-06  
**Issue**: maturion-isms#1536  
**PR**: maturion-isms#1537  
**Agent**: foreman-v2-agent → mat-specialist (delegated via POLC orchestration)  
**Verification method**: GitHub Actions CI logs (GitHub MCP), Supabase public endpoint probes, Playwright browser screenshots, curl network evidence  
**Live deployment URL verified**: `https://maturity-model-management.vercel.app/`  
**Supabase project verified**: `ujucvyyspfxlxlfdamda`

---

## OC-001 — Supabase project configured correctly

**Status: PARTIALLY CONFIRMED (project exists and is reachable)**

### Agent-accessible evidence

- Supabase project `ujucvyyspfxlxlfdamda` is REACHABLE:
  - `GET https://ujucvyyspfxlxlfdamda.supabase.co/rest/v1/` → HTTP 401 (`Invalid API key`) — confirms project exists and REST API is live
  - `GET https://ujucvyyspfxlxlfdamda.supabase.co/storage/v1/bucket` → HTTP 400 (requires `authorization` header) — confirms Storage API is live
  - `GET https://ujucvyyspfxlxlfdamda.supabase.co/auth/v1/settings` with anon key → HTTP 200 (CI verified) — confirms Auth API is live
- Migrations workflow (Run #11, 2026-05-06T07:59:52Z) confirms the project is linked and schema is applied:
  - `SUPABASE_PROJECT_REF` secret points to `ujucvyyspfxlxlfdamda` (confirmed by successful link + migration apply)
  - Schema verification job: `PASS` — all required tables exist in the live project

### Requires CS2 confirmation

| Setting | Why not agent-verifiable |
|---|---|
| Auth settings (email provider, redirect URLs, site URL) | Requires Supabase dashboard access — not accessible via public API without service_role_key |
| JWT secret configuration | Cannot inspect key value via API |

---

## OC-002 — Supabase secrets set

**Status: CONFIRMED (all critical secrets present and functional)**

### Agent-accessible evidence (GitHub Actions CI — Run #90, 2026-05-06T08:13:22Z)

All secrets listed below were confirmed present by successful CI workflow execution:

| Secret | System | Status | Evidence |
|---|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | GitHub Secrets | ✅ PRESENT | Used by migrations (#11) and edge functions (#9) workflows — both succeeded |
| `SUPABASE_PROJECT_REF` | GitHub Secrets | ✅ PRESENT | Used by migrations (#11) and edge functions (#9) workflows — both succeeded; points to `ujucvyyspfxlxlfdamda` |
| `VITE_SUPABASE_URL` | GitHub Secrets | ✅ PRESENT | Used by Vercel deploy (#90) — auth endpoint returned HTTP 200 |
| `VITE_SUPABASE_ANON_KEY` | GitHub Secrets | ✅ PRESENT | Used by Vercel deploy (#90) — auth endpoint returned HTTP 200 |
| `VITE_API_BASE_URL` | GitHub Secrets | ✅ PRESENT | Used by Vercel build job (#90) |
| `VERCEL_TOKEN` | GitHub Secrets | ✅ PRESENT | Vercel deploy succeeded (#90) |
| `VERCEL_ORG_ID` | GitHub Secrets | ✅ PRESENT | Vercel deploy succeeded (#90) |
| `VERCEL_PROJECT_ID` | GitHub Secrets | ✅ PRESENT | Vercel deploy succeeded (#90); project `rassie-ras-projects/maturity-model-management` |
| `MATURION_BOT_TOKEN` | GitHub Secrets | ✅ PRESENT | Edge functions deploy (#9) succeeded |
| `RENDER_API_KEY` | GitHub Secrets | ✅ PRESENT | AI gateway deploy (#22) succeeded |
| `RENDER_SERVICE_ID` | GitHub Secrets | ✅ PRESENT | AI gateway deploy (#22) succeeded — Render deploy triggered HTTP 201 |
| `RENDER_SERVICE_URL` | GitHub Secrets | ✅ PRESENT | AI gateway health check returned HTTP 200 |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Secrets | ✅ PRESENT | AI gateway deploy (#22) succeeded (masked in logs) |

---

## OC-003 — Storage buckets created

**Status: CONDITIONALLY CONFIRMED (migrations applied; bucket existence not directly inspectable)**

### Agent-accessible evidence

- Storage migrations included in B1 schema build (wave: mmm-storage-model-codification-20260422, issue #1458)
- Supabase Storage API is reachable (`/storage/v1/bucket` returns HTTP 400 requiring auth, not 404)
- Migrations workflow Run #11 (2026-05-06T07:59:52Z) applied all MMM-native migrations successfully, including storage bucket migrations
- Schema verification job: PASS

### Requires CS2 confirmation

| Setting | Why not agent-verifiable |
|---|---|
| Bucket list (framework-sources, evidence-files, etc.) | Requires `service_role_key` to list via `GET /storage/v1/bucket` — not held by agent |
| Bucket RLS policies | Requires dashboard or service_role_key access |

---

## OC-004 — SMTP / auth setup confirmed

**Status: PARTIALLY CONFIRMED (auth API live; SMTP settings not agent-inspectable)**

### Agent-accessible evidence

- Supabase Auth API: `GET /auth/v1/settings` with anon key → HTTP 200 (confirmed in CI Run #90 smoke test)
- Auth is accepting valid API keys and responding to settings endpoint

### Requires CS2 confirmation

| Setting | Why not agent-verifiable |
|---|---|
| SMTP provider (host, port, user, pass) | Requires Supabase dashboard — Auth → SMTP Settings |
| Auth email redirect URL / site URL | Requires Supabase dashboard — Auth → URL Configuration |
| Email templates (invite, confirm, password reset) | Requires Supabase dashboard |

---

## OC-005 — Vercel environment variables confirmed

**Status: CONFIRMED (critical env vars present); FINDING: `VITE_LIVE_DEPLOYMENT_URL` / `NEXT_PUBLIC_SITE_URL` appear unset**

### Agent-accessible evidence

From Vercel deploy workflow Run #90 (2026-05-06T08:13:22Z):

| Variable | Status | Evidence |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ PRESENT | CI logs show masked `***`, auth endpoint check HTTP 200 |
| `VITE_SUPABASE_ANON_KEY` | ✅ PRESENT | CI logs show masked `***`, auth endpoint check HTTP 200 |
| `VITE_API_BASE_URL` | ✅ PRESENT | CI logs show masked `***`, build succeeded |
| `VERCEL_TOKEN` | ✅ PRESENT | Deployment succeeded |
| `VERCEL_ORG_ID` | ✅ PRESENT | Deployment succeeded |
| `VERCEL_PROJECT_ID` | ✅ PRESENT | Deployment succeeded; project `rassie-ras-projects/maturity-model-management` |

**⚠️ FINDING — `NEXT_PUBLIC_SITE_URL` / `VITE_LIVE_DEPLOYMENT_URL` NOT SET:**

CI log line: `PRODUCTION_SITE_URL: ` (empty) — this means `NEXT_PUBLIC_SITE_URL` secret maps to an empty value. The smoke test defaults to `https://mmm.maturion.com` which does NOT resolve (HTTP 000). The live app is deployed at `https://maturity-model-management.vercel.app/`, not `https://mmm.maturion.com`. **CS2 should set `NEXT_PUBLIC_SITE_URL` (and/or `VITE_LIVE_DEPLOYMENT_URL`) to `https://maturity-model-management.vercel.app` in GitHub secrets, and optionally configure `mmm.maturion.com` as a Vercel custom domain alias.**

---

## OC-006 — GitHub secrets aligned

**Status: CONFIRMED (all required deployment secrets present)**

All secrets required by the four MMM deployment workflows are present and verified through successful CI execution. See OC-002 table above for the complete list.

**⚠️ FINDING — Staging secrets not confirmed:**

| Secret | Status |
|---|---|
| `RENDER_SERVICE_ID_STAGING` | NOT CONFIRMED — staging deploy was skipped in workflow Run #22 |
| `RENDER_SERVICE_URL_STAGING` | NOT CONFIRMED — staging health check log says "Staging health check skipped -- configure RENDER_SERVICE_URL_STAGING to enable" |
| `LIVENESS_TEST_EMAIL` | NOT CONFIRMED — not used in any recent run |
| `LIVENESS_TEST_PASSWORD` | NOT CONFIRMED — not used in any recent run |

---

## OC-007 — AIMC / PIT live endpoint values confirmed

**Status: PARTIALLY CONFIRMED (AIMC gateway healthy; PIT still pending)**

### Agent-accessible evidence

- AIMC Render gateway (`RENDER_SERVICE_URL/health`): HTTP 200 — HEALTHY (CI Run #22, 2026-05-06T07:01:37Z)
- Render deploy triggered successfully: HTTP 201 (deploy ID `dep-d7teevreo5us73ba5tkg`)
- `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `RENDER_SERVICE_URL` all confirmed PRESENT and working

### Requires CS2 confirmation

| Setting | Why not agent-verifiable | CS2 action needed |
|---|---|---|
| `PIT_BASE_URL` | Not present in any accessible CI log | Confirm live PIT endpoint exists and is deployed/reachable |
| `AIMC_BASE_URL` exact value | Masked in CI logs; previously confirmed as staging gateway in tracker | Confirm same endpoint is still active or update if changed |

---

## OC-008 — External service envs on Render confirmed

**Status: PARTIALLY CONFIRMED (Render service healthy; service-level secrets not inspectable)**

### Agent-accessible evidence

- Render service health check: HTTP 200 — HEALTHY (CI Run #22)
- `RENDER_API_KEY` PRESENT — Render API call succeeded (HTTP 201)
- `RENDER_SERVICE_URL` PRESENT — health check passed
- `SUPABASE_SERVICE_ROLE_KEY` PRESENT in AI gateway workflow env block (masked)

### Requires CS2 confirmation

| Setting | Why not agent-verifiable | CS2 action needed |
|---|---|---|
| `AIMC_SERVICE_TOKEN` value | Masked in Render service env vars | Confirm token is set and matches expected value |
| `PIT_SERVICE_TOKEN` value | Not visible in any CI log | Confirm token is set in Render service environment |
| `SUPABASE_SERVICE_ROLE_KEY` exact target | Masked | Confirm correct project key for `ujucvyyspfxlxlfdamda` |

---

## OC-009 — Live E2E validation

**Status: ❌ NOT CONFIRMED — NO COMPLETE WORKFLOW DEMONSTRATED**

See Product-Fix Queue below.

---

## CS2 Verification Required — Summary Table

| OC item | System | Setting/Secret name | Why agent cannot verify | CS2 action needed |
|---|---|---|---|---|
| OC-001 | Supabase dashboard | Auth settings (email provider, redirect URLs, site URL) | Requires dashboard access | Verify Auth → SMTP and URL Configuration in Supabase dashboard |
| OC-001 | Supabase dashboard | JWT secret configuration | Cannot inspect value via API | Confirm JWT secret is set |
| OC-003 | Supabase Storage API | Bucket list (framework-sources, evidence-files) | Requires `service_role_key` | Run `supabase storage ls` or check Storage in dashboard |
| OC-003 | Supabase dashboard | Bucket RLS policies | Requires dashboard access | Verify policies match schema migration definitions |
| OC-004 | Supabase dashboard | SMTP provider (host, port, credentials) | Requires dashboard — Auth → SMTP Settings | Configure or confirm SMTP provider |
| OC-004 | Supabase dashboard | Auth email redirect URL / site URL | Requires dashboard — Auth → URL Configuration | Set site URL to `https://maturity-model-management.vercel.app` |
| OC-005 | GitHub Secrets / Vercel | `NEXT_PUBLIC_SITE_URL` (currently empty) | CI log shows blank value | Set to `https://maturity-model-management.vercel.app` in GitHub secrets and/or Vercel project env vars |
| OC-005 | Vercel | Custom domain `mmm.maturion.com` | Not configured in Vercel dashboard (domain doesn't resolve) | Either configure domain alias in Vercel or update smoke test URL |
| OC-006 | GitHub Secrets | `RENDER_SERVICE_ID_STAGING`, `RENDER_SERVICE_URL_STAGING` | Staging deploy was skipped | Confirm staging service exists or mark as not required |
| OC-006 | GitHub Secrets | `LIVENESS_TEST_EMAIL`, `LIVENESS_TEST_PASSWORD` | Not used in recent CI | Confirm these are set for future use or remove from workflows |
| OC-007 | Render / PIT | `PIT_BASE_URL` | Not visible in any accessible CI log | Confirm live PIT endpoint is deployed, reachable, and URL is set as secret |
| OC-007 | Render / AIMC | `AIMC_BASE_URL` exact URL | Masked in CI | Confirm value is correct and the endpoint is live |
| OC-008 | Render env vars | `AIMC_SERVICE_TOKEN` | Masked | Confirm token is set and correct |
| OC-008 | Render env vars | `PIT_SERVICE_TOKEN` | Not visible in CI logs | Confirm token is set |
| OC-008 | Render env vars | `SUPABASE_SERVICE_ROLE_KEY` | Masked | Confirm correct service role key for project `ujucvyyspfxlxlfdamda` |

---

## Live UI Evidence — Screenshots and Network Analysis

**Deployment**: `https://maturity-model-management.vercel.app/`  
**Deployed at**: 2026-05-06T08:15:10Z (CI Run #90, SHA `514f7a2b8fea24e04b329611459a8289011f4bdf`)

### Root page `/`

**Result**: ✅ HTTP 200 — Landing page renders correctly  
**Screenshot**: `modules/MMM/evidence/screenshot-landing-page-20260506.png`  
**Content**: Maturion MMM marketing landing page — "Know Your Maturity. Grow With Confidence." — Sign In / Sign Up / Try Free links present

### Dashboard `/dashboard` (direct navigation)

**Result**: ❌ HTTP 404 — `NOT_FOUND` — `iad1::lrdxg-1778056848621-4c271ad29b16`  
**Screenshot**: `modules/MMM/evidence/screenshot-dashboard-404-20260506.png`  
**Error**: Vercel routing 404 — `The vercel.json file should be inside of the provided root directory` warning in CI logs suggests `vercel.json` rewrites are not applied for this deployment  
**Note**: CS2 can reach the dashboard via client-side navigation (after login at `/`); the 404 only affects direct/hard navigation. App shell renders via React Router after initial load at root.

### Frameworks `/frameworks` (direct navigation)

**Result**: ❌ HTTP 404 — `NOT_FOUND`  
**Screenshot**: `modules/MMM/evidence/screenshot-frameworks-404-20260506.png`  
**Error**: Same Vercel routing issue as `/dashboard`

### Framework Source Upload `/frameworks/upload` (direct navigation)

**Result**: ❌ HTTP 404 — `NOT_FOUND`  
**Screenshot**: `modules/MMM/evidence/screenshot-upload-404-20260506.png`  
**Error**: Same Vercel routing issue as `/dashboard`

---

## Network / API Evidence — Dashboard Data Load Failure

### Root cause analysis

The dashboard data load failure (`Unable to load dashboard data. Please check your connection and try again.`) is caused by **undeployed MMM Edge Functions**:

1. **What the deploy-mmm-edge-functions.yml workflow deploys**: Only `invoke-ai-parse-criteria` (1 function)
2. **What is defined in supabase/config.toml**: 27 MMM-specific functions including `mmm-health`, `mmm-dashboard`, `mmm-qiw-status`, `mmm-org-update`, `mmm-invitation-create`, and more
3. **Result**: All MMM-specific Edge Functions return HTTP 404 when called by the frontend

**Evidence**:

```
GET https://ujucvyyspfxlxlfdamda.supabase.co/functions/v1/mmm-health
→ HTTP 404: {"code":"NOT_FOUND","message":"Requested function was not found"}
```

The dashboard page calls MMM Edge Functions to load org data, QIW status, and assessment summaries. These functions are not deployed. The Edge Functions workflow is limited to `invoke-ai-parse-criteria` only.

### Secondary issue — Vercel SPA routing

The `vercel.json` contains a rewrite rule:
```json
{
  "source": "/((?!api/|assets/|manifest\\.json$|sw\\.js$).*)",
  "destination": "/index.html"
}
```

The Vercel deployment log shows warning: `"The vercel.json file should be inside of the provided root directory."` This suggests Vercel is not applying the rewrites for sub-path direct navigation. Direct navigation to `/dashboard`, `/frameworks`, `/frameworks/upload` returns 404 from the Vercel routing layer.

---

## Product-Fix Queue (Priority Order)

1. **[P1] Deploy all MMM Edge Functions** — Update `deploy-mmm-edge-functions.yml` to deploy all 27 MMM functions listed in `supabase/config.toml`, not just `invoke-ai-parse-criteria`. This is the **primary blocker** for dashboard data loading.

2. **[P2] Fix Vercel SPA routing** — Investigate and fix the `vercel.json` routing issue (warning: "vercel.json file should be inside provided root directory"). Consider moving `vercel.json` rewrites to `apps/mmm/vercel.json` or ensuring Vercel project root is configured correctly.

3. **[P3] Set `NEXT_PUBLIC_SITE_URL`** — Set this GitHub secret to `https://maturity-model-management.vercel.app` to fix the smoke test and ensure the correct URL is used for auth redirects.

4. **[P4] Build Frameworks page layout** — The page is skeletal (heading + Upload link). Requires proper data loading from deployed Edge Functions + UI components for listing frameworks.

5. **[P5] Style Framework Source upload flow** — Currently renders as unstyled radio buttons. Requires CSS/component alignment with app design system.

6. **[P6] Demonstrate live E2E workflow** — Complete at least one full workflow (onboarding → framework → assessment → dashboard view) to satisfy OC-009 and validate end-to-end system health.

---

## Verifiable Confirmation Summary

| OC | Status | Evidence ref |
|---|---|---|
| OC-001 | ⚠️ PARTIALLY CONFIRMED (project reachable, schema applied; auth settings require CS2) | Supabase endpoint probes, CI Run #11 |
| OC-002 | ✅ CONFIRMED (all critical secrets present) | CI Runs #90, #11, #9, #22 |
| OC-003 | ⚠️ PARTIALLY CONFIRMED (migrations applied; bucket list requires CS2) | CI Run #11 |
| OC-004 | ⚠️ PARTIALLY CONFIRMED (auth API live; SMTP config requires CS2) | CI Run #90 smoke test |
| OC-005 | ⚠️ PARTIALLY CONFIRMED (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` present; `NEXT_PUBLIC_SITE_URL` NOT SET) | CI Run #90 |
| OC-006 | ✅ CONFIRMED (all deployment workflow secrets present) | CI Runs #90, #11, #9, #22 |
| OC-007 | ⚠️ PARTIALLY CONFIRMED (AIMC Render health HTTP 200; PIT_BASE_URL pending) | CI Run #22 |
| OC-008 | ⚠️ PARTIALLY CONFIRMED (Render service health HTTP 200; service tokens masked) | CI Run #22 |
| OC-009 | ❌ NOT CONFIRMED | No E2E workflow demonstrated |
