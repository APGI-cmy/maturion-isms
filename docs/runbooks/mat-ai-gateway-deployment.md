# MAT AI Gateway — Deployment Runbook

| Field            | Value                                                              |
|------------------|--------------------------------------------------------------------|
| Service          | `mat-ai-gateway`                                                   |
| Runtime          | Python 3.11 / FastAPI / Uvicorn                                    |
| Container port   | `8000`                                                             |
| Deployment target| Render.com (Web Service)                                           |
| Health endpoint  | `GET /health` → `{"status": "ok"}`                                 |
| Gap addressed    | GAP-018 (Wave 16.8)                                                |
| Last Updated     | 2026-04-14                                                         |

> **Architecture context**: The `mat-ai-gateway` is a Python FastAPI microservice that provides
> AI-powered compliance operations (document parsing, maturity scoring, audio transcription, report
> generation, image analysis) to the MAT application. It delegates to OpenAI and persists results
> via Supabase.
>
> See `modules/mat/02-architecture/ai-architecture.md` for the full AI architecture and the
> relationship between this service and the `@maturion/ai-centre` AIMC Gateway pattern.

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [First-Time Render Deployment](#2-first-time-render-deployment)
3. [CI/CD Auto-Deploy (subsequent deployments)](#3-cicd-auto-deploy-subsequent-deployments)
4. [Health Check Verification](#4-health-check-verification)
5. [Rollback Procedure](#5-rollback-procedure)
6. [Local Verification (pre-deploy smoke test)](#6-local-verification-pre-deploy-smoke-test)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Environment Variables

### 1.1 Required Variables

The gateway validates all required variables **at startup** — the container will refuse to start
and the Render health probe will fail if any of these are absent.

| Variable                  | Description                                                                    | Example / Format                          |
|---------------------------|--------------------------------------------------------------------------------|-------------------------------------------|
| `OPENAI_API_KEY`          | OpenAI API authentication key. Required for GPT-4 Turbo, Whisper, and Vision. | `sk-...` (OpenAI secret key)              |
| `SUPABASE_URL`            | Supabase project URL. Used by all services that read/write audit data.         | `https://xxxxxxxxxxxx.supabase.co`        |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role JWT. Bypasses Row Level Security for server-side ops.  | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…` |

> ⚠️ **Security**: Never commit these values to the repository. Store them as Render Environment
> Variables (UI) or Render Secret Files. The `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are
> high-privilege secrets — rotate immediately on any suspected exposure.

### 1.2 Optional Variables

| Variable       | Default | Description                                                                                        |
|----------------|---------|----------------------------------------------------------------------------------------------------|
| `CORS_ORIGINS` | `*`     | Comma-separated list of allowed CORS origins. Set to the MAT frontend URL(s) in production to restrict cross-origin access (e.g. `https://app.maturion.com,https://staging.maturion.com`). When set to `*`, `Access-Control-Allow-Credentials` is disabled (browser security requirement). When explicit origins are set, credentials are enabled. |

---

## 2. First-Time Render Deployment

These steps create the Render Web Service from scratch. Run them once per environment
(production, staging, preview).

### Step 1 — Create a new Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New → Web Service**.
3. Connect the `APGI-cmy/maturion-isms` GitHub repository.
4. Set **Root Directory** to `apps/mat-ai-gateway`.

### Step 2 — Configure the build

| Setting            | Value                                      |
|--------------------|--------------------------------------------|
| **Environment**    | `Docker`                                   |
| **Dockerfile path**| `apps/mat-ai-gateway/Dockerfile`           |
| **Region**         | Match your Supabase project region         |
| **Instance type**  | `Starter` (512 MB RAM) or above            |
| **Port**           | `8000`                                     |

> The `Dockerfile` exposes port `8000` and runs:
> `uvicorn main:app --host 0.0.0.0 --port 8000`

### Step 3 — Set environment variables

In the Render service **Environment** tab, add the three required variables from §1.1 and any
optional variables from §1.2. Use **Secret** type for `OPENAI_API_KEY` and
`SUPABASE_SERVICE_ROLE_KEY`.

### Step 4 — Configure the health check

| Setting                | Value           |
|------------------------|-----------------|
| **Health Check Path**  | `/health`       |
| **Health Check Timeout** | `5s`          |

Render will poll `/health` after each deploy. A `200 OK` response with body `{"status":"ok"}`
marks the instance healthy. A non-`200` or no response within the timeout marks it unhealthy
and Render will retain the previous instance (automatic rollback on deploy failure).

### Step 5 — Deploy

Click **Create Web Service**. Render will:
1. Pull the repository.
2. Build the Docker image from `apps/mat-ai-gateway/Dockerfile`.
3. Start the container.
4. Poll `/health` until the service is healthy (allow up to 2 minutes on first deploy).

The deployed service URL will be `https://<service-name>.onrender.com`. Record this URL and
set `AI_GATEWAY_URL` in your MAT `.env.example` / environment to point to it
(see `.env.example` for details).

---

## 3. CI/CD Auto-Deploy (Subsequent Deployments)

Render is configured to auto-deploy on every push to the tracked branch (default: `main`).

### Normal deploy flow

1. Merge a PR to `main`.
2. Render detects the push and triggers a new build automatically.
3. The new Docker image is built and the container is started alongside the current one.
4. Render waits for `/health` to return `200 OK`.
5. Once healthy, traffic is cut over to the new instance; the old one is stopped.
6. If `/health` never returns `200 OK` within the timeout window, Render aborts and keeps the
   previous instance running (zero-downtime deploy failure).

### Manual deploy (force re-deploy without code change)

1. Open the Render Dashboard → select the `mat-ai-gateway` service.
2. Click **Manual Deploy → Deploy latest commit**.
3. Monitor the **Events** and **Logs** tabs for progress.

### Deploying a specific commit

1. Open the Render Dashboard → **Manual Deploy → Deploy a specific commit**.
2. Enter the commit SHA (full 40-character hash preferred).
3. Confirm and monitor as above.

---

## 4. Health Check Verification

### Endpoint

```
GET /health
```

**No authentication required.**

### Expected response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "ok"}
```

Any status other than `200` with `{"status": "ok"}` body indicates the service is unhealthy.

### Verifying from the command line

```bash
# Replace with your Render service URL
SERVICE_URL="https://mat-ai-gateway.onrender.com"

curl -sf "${SERVICE_URL}/health" | python3 -m json.tool
# Expected output:
# {
#     "status": "ok"
# }
```

Using `curl -sf` (silent + fail on non-2xx) means a non-zero exit code indicates a failure:

```bash
curl -sf "${SERVICE_URL}/health" && echo "HEALTHY" || echo "UNHEALTHY — check logs"
```

### Verifying via the Render Dashboard

1. Open the `mat-ai-gateway` service page.
2. Check the **Status** badge — it should read **Live**.
3. In the **Events** tab, the latest deploy event should show `Deploy live`.

### Common failure reasons

| Symptom | Likely cause |
|---------|-------------|
| `curl: (7) Failed to connect` | Service not yet started, still in cold-start, or crashed |
| `500 Internal Server Error` on first request | Required env var missing — check startup logs for `RuntimeError: Required environment variable …` |
| `200 OK` but service returns errors on API routes | OpenAI key invalid or Supabase URL/key misconfigured |

---

## 5. Rollback Procedure

Render provides two rollback paths depending on the scenario.

### 5.1 Auto-rollback (deploy failure)

Render automatically retains the previous instance when a deploy fails the health check. No
manual action is required. Verify by checking:

- **Events** tab → deploy event status shows `Deploy failed` or `Deploy cancelled`.
- **Status** badge still shows **Live** (the prior instance remains in service).

### 5.2 Manual rollback to a previous deploy

Use this when a deploy succeeded (service appeared healthy) but a regression is discovered
post-deploy.

1. Open the Render Dashboard → `mat-ai-gateway` service.
2. Click **Events** tab.
3. Find the last known-good deploy event and copy its **commit SHA** from the event details.
4. Click **Manual Deploy → Deploy a specific commit**.
5. Paste the commit SHA and confirm.
6. Monitor the **Logs** tab — the old image will be rebuilt and deployed.
7. Verify health: `curl -sf https://<service-name>.onrender.com/health`

> **Note**: Render rebuilds from source for the specified commit. This takes 1–3 minutes.
> During the rebuild the previous (currently live) instance continues to serve traffic.

### 5.3 Emergency stop (last resort)

If the service is causing active harm and must be taken offline immediately:

1. Open the Render Dashboard → `mat-ai-gateway` service.
2. Click **Suspend Service**.
3. The service stops accepting traffic. The MAT application will receive `503` errors on AI routes.
4. Investigate and fix the root cause, then click **Resume Service** followed by **Manual Deploy**.

> ⚠️ Suspending the service will break all AI-powered MAT features. Notify the on-call engineer
> and stakeholders before suspending in production.

---

## 6. Local Verification (Pre-Deploy Smoke Test)

Run the test suite locally before deploying to confirm nothing is broken.

```bash
# Navigate to the service directory
cd apps/mat-ai-gateway

# Install dependencies (preferably in a virtual environment)
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install pytest httpx

# Set required environment variables (use test/dummy values for unit tests)
export OPENAI_API_KEY="sk-test-placeholder"
export SUPABASE_URL="https://test.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJtest"

# Run tests
python -m pytest tests/ -v
```

All tests must pass before merging a change that touches `apps/mat-ai-gateway/`.

---

## 7. Troubleshooting

### Service fails to start — `RuntimeError: Required environment variable '…' is not set`

The gateway validates `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` at import
time (before the first request). If any are absent the process exits immediately.

**Fix**: Add the missing variable in Render → Environment tab → redeploy.

### CORS errors in the MAT frontend

The default `CORS_ORIGINS=*` is suitable for development. In production, set `CORS_ORIGINS` to
the exact MAT frontend origin(s):

```
CORS_ORIGINS=https://app.maturion.com,https://staging.maturion.com
```

### OpenAI rate limit or authentication errors on `/api/v1/*` routes

- Verify `OPENAI_API_KEY` is correct and the key has sufficient quota.
- Check [OpenAI status](https://status.openai.com) for outages.
- Rotate the key in OpenAI dashboard → update Render environment variable → redeploy.

### Supabase connection errors

- Verify `SUPABASE_URL` matches the project URL exactly (no trailing slash).
- Verify `SUPABASE_SERVICE_ROLE_KEY` is the **service role** key, not the **anon** key.

---

## Cross-References

| Artifact                         | Location                                                                   |
|----------------------------------|----------------------------------------------------------------------------|
| AI Architecture                  | `modules/mat/02-architecture/ai-architecture.md`                          |
| System Architecture (§3.3, §3.4) | `modules/mat/02-architecture/system-architecture.md`                      |
| Deployment Architecture (§3.3)   | `modules/mat/02-architecture/deployment-architecture.md`                  |
| Environment variable declaration | `.env.example` (`AI_GATEWAY_URL`)                                          |
| Service source                   | `apps/mat-ai-gateway/`                                                     |
| Service README                   | `apps/mat-ai-gateway/README.md`                                            |
| Dockerfile                       | `apps/mat-ai-gateway/Dockerfile`                                           |

---

**Change Log**

| Version | Date       | Author          | Notes                                     |
|---------|------------|-----------------|-------------------------------------------|
| 1.0.0   | 2026-04-14 | mat-specialist  | Initial runbook — addresses GAP-018       |
