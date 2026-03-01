# MANUAL AUDIT TOOL (MAT) – DEPLOYMENT ARCHITECTURE v1.1.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.1.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2026-03-01                                 |
| Governance       | Domains 3.1, 3.2                           |

---

> **Amendment v1.1.0 — 2026-03-01**: §3.3 corrected — AI Gateway platform updated from AWS ECS to Render (actual production platform). §5.3 CI/CD Pipeline Secrets added. Correction raised by foreman-v2-agent session-081 and independent-assurance-agent session-030 parking station entries following Wave 12 deployment re-do.

---

## 1. Purpose

This document defines the deployment architecture for the Manual Audit Tool (MAT) module. It covers governance completeness domains **3.1 (Deployment Target Declaration)** and **3.2 (Runtime Entrypoint and Filesystem Expectations)**, specifying where each component is deployed, how it is configured, and what filesystem layout the runtime expects.

---

## 2. Scope

| Domain | Title                                        | Coverage |
|--------|----------------------------------------------|----------|
| 3.1    | Deployment Target Declaration                | Full     |
| 3.2    | Runtime Entrypoint and Filesystem Expectations | Full   |

---

## 3. Deployment Target Declaration (Domain 3.1)

### 3.1 Frontend Deployment

| Concern                | Value                                                        |
|------------------------|--------------------------------------------------------------|
| Target Platform        | Vercel (primary) or Netlify (alternative), CDN-backed static hosting |
| Platform Version       | Vercel Node.js 20 LTS runtime for Edge Functions / SSR       |
| Platform-Specific Config | `vercel.json` for rewrites, headers, environment variables |
| Deployment Entry Point | `pnpm build` produces `dist/` directory, served as static SPA |

**Platform Limitations:**

| Constraint                  | Hobby Tier       | Pro Tier          |
|-----------------------------|------------------|-------------------|
| Serverless function timeout | 10 s             | 60 s              |
| Edge function size          | 1 MB             | 1 MB              |
| Build time                  | 45 min max       | 45 min max        |
| Static assets               | 100 MB per deploy | 100 MB per deploy |

### 3.2 Backend (Supabase) Deployment

| Concern              | Value                                                    |
|----------------------|----------------------------------------------------------|
| Target Platform      | Supabase Cloud (managed PostgreSQL 15+)                  |
| Self-hosted Option   | Docker Compose for enterprise deployments                |
| Configuration        | Project settings via Supabase Dashboard + `supabase/config.toml` |
| Entry Point          | Supabase project URL (`https://<project-ref>.supabase.co`) |

**Platform Limitations:**

| Constraint                     | Free Tier                   | Pro Tier            |
|--------------------------------|-----------------------------|---------------------|
| Database storage               | 500 MB                      | 8 GB+               |
| File storage                   | 1 GB                        | 100 GB+             |
| Edge Function invocations      | 500K / month                | Unlimited (fair use) |
| Realtime concurrent connections | 200                        | 500+                |

### 3.3 AI Microservices Deployment

| Concern            | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| Target Platform    | Render (primary) — Web Service, Docker runtime |
| Container Runtime  | Docker 24+                                                            |
| Container Image    | `python:3.11-slim` base, multi-stage builds, < 500 MB image size     |
| Entry Point        | `uvicorn main:app --host 0.0.0.0 --port 8000`                        |
| Health Check       | `GET /health` endpoint with 5 s timeout                              |

**Platform Limitations:**

| Constraint        | Range                          |
|-------------------|--------------------------------|
| CPU               | 0.5 – 4 vCPU per container    |
| Memory            | 1 – 8 GB per container        |
| Max containers    | Auto-scaling 1 – 10           |
| Request timeout   | 300 s for AI processing        |

### 3.4 CI/CD Pipeline

| Concern             | Value                                                                 |
|---------------------|-----------------------------------------------------------------------|
| Platform            | GitHub Actions                                                        |
| Pipeline stages     | Lint → Type Check → Unit Test → Integration Test → Build → Security Scan → E2E (staging) → Deploy |
| Duration target     | < 10 minutes                                                          |
| Branch protection   | PR required, 1 review minimum                                        |

### 3.5 Infrastructure as Code

| Concern               | Value                                                          |
|------------------------|----------------------------------------------------------------|
| Tool                   | Terraform or Pulumi                                            |
| Managed resources      | Supabase project, DNS, CDN config, container service, secrets  |
| Environment separation | `development`, `staging`, `production`                         |

---

## 4. Runtime Entrypoint and Filesystem Expectations (Domain 3.2)

### 4.1 Frontend (React SPA)

**Application Entry Point:** `apps/mat-frontend/src/main.tsx`

**Build Output:** `apps/mat-frontend/dist/` (Vite production build)

**Static Assets** (`apps/mat-frontend/public/` → maps to `/` at deployment):

| Path              | Description                               |
|-------------------|-------------------------------------------|
| `/manifest.json`  | PWA manifest                              |
| `/sw.js`          | Service Worker (generated by Workbox)     |
| `/icons/`         | PWA icons (192×192, 512×512)              |
| `/locales/`       | i18n translation files (`en.json`, `af.json`) |

**Configuration Files:**

| File                                      | Purpose                                  |
|-------------------------------------------|------------------------------------------|
| `apps/mat-frontend/vite.config.ts`        | Build configuration                      |
| `apps/mat-frontend/tsconfig.json`         | TypeScript config (extends `tsconfig.base.json`) |
| `apps/mat-frontend/tailwind.config.ts`    | Tailwind CSS config                      |
| `apps/mat-frontend/.env.local`            | Local environment overrides (gitignored) |

**Filesystem Constraints:** Read-only after deployment; all state persists in Supabase or browser IndexedDB.

### 4.2 Backend (Supabase)

**Schema Definition:** `supabase/migrations/` – Versioned SQL migration files

**Edge Functions** (`supabase/functions/` – Deno-based serverless functions):

| Function Path                          | Responsibility           |
|----------------------------------------|--------------------------|
| `supabase/functions/ai-gateway/`       | AI service proxy         |
| `supabase/functions/report-generator/` | Report generation        |
| `supabase/functions/pit-export/`       | PIT module export        |
| `supabase/functions/maturity-export/`  | Maturity Roadmap export  |

**Seed Data:** `supabase/seed.sql` – Development seed data

**Config:** `supabase/config.toml` – Local development configuration

### 4.3 AI Microservices (Python FastAPI)

**Application Entry Point:** `apps/mat-ai-gateway/main.py`

**Service Modules:**

| Module Path                                        | Responsibility              |
|----------------------------------------------------|-----------------------------|
| `apps/mat-ai-gateway/services/parsing.py`          | Document parsing            |
| `apps/mat-ai-gateway/services/scoring.py`          | Maturity scoring            |
| `apps/mat-ai-gateway/services/transcription.py`    | Audio / video transcription |
| `apps/mat-ai-gateway/services/reporting.py`        | Report generation           |
| `apps/mat-ai-gateway/services/image_analysis.py`   | Image interpretation        |

**Build & Config:**

| File                                     | Purpose                                |
|------------------------------------------|----------------------------------------|
| `apps/mat-ai-gateway/Dockerfile`         | Multi-stage build definition           |
| `apps/mat-ai-gateway/requirements.txt`   | Python dependencies (or `pyproject.toml`) |
| `apps/mat-ai-gateway/.env`               | Environment configuration (gitignored) |

### 4.4 Shared Packages

**Location:** `packages/mat-shared/` – Shared TypeScript types, schemas, constants

| Sub-path                              | Contents                                       |
|---------------------------------------|-------------------------------------------------|
| `packages/mat-shared/src/types/`      | Domain types (`Audit`, `Criterion`, `Evidence`) |
| `packages/mat-shared/src/schemas/`    | Zod validation schemas                          |
| `packages/mat-shared/src/constants/`  | Shared constants and enums                      |

### 4.5 Monorepo Structure

```
maturion-isms/
├── apps/
│   ├── mat-frontend/                   # React SPA (Vite)
│   │   ├── public/
│   │   │   ├── manifest.json
│   │   │   ├── sw.js
│   │   │   ├── icons/
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       └── af.json
│   │   ├── src/
│   │   │   ├── main.tsx                # Application entry point
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── stores/
│   │   │   └── utils/
│   │   ├── dist/                       # Build output (gitignored)
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   └── .env.local                  # Local overrides (gitignored)
│   │
│   └── mat-ai-gateway/                 # Python FastAPI service
│       ├── main.py                     # Application entry point
│       ├── services/
│       │   ├── parsing.py
│       │   ├── scoring.py
│       │   ├── transcription.py
│       │   ├── reporting.py
│       │   └── image_analysis.py
│       ├── Dockerfile
│       ├── requirements.txt
│       └── .env                        # Environment config (gitignored)
│
├── packages/
│   └── mat-shared/                     # Shared TypeScript package
│       └── src/
│           ├── types/
│           ├── schemas/
│           └── constants/
│
├── supabase/
│   ├── migrations/                     # Versioned SQL migrations
│   ├── functions/
│   │   ├── ai-gateway/
│   │   ├── report-generator/
│   │   ├── pit-export/
│   │   └── maturity-export/
│   ├── seed.sql
│   └── config.toml
│
├── infrastructure/                     # IaC (Terraform / Pulumi)
├── modules/                            # Architecture & governance docs
├── package.json
├── pnpm-workspace.yaml
└── vercel.json                         # Frontend deployment config
```

### 4.6 Data Persistence Paths

| Storage Medium     | Purpose                                                              | Path / Location                                                          |
|--------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------|
| PostgreSQL         | All relational data                                                  | Supabase managed instance                                                |
| Supabase Storage   | Evidence files                                                       | `{org_id}/{audit_id}/{criterion_id}/{evidence_type}/{filename}`          |
| IndexedDB          | Client-side structured data for offline mode                         | Browser-managed (`mat-offline-db`)                                       |
| Cache API / OPFS   | Client-side evidence file cache for offline mode                     | Browser-managed                                                          |

> **Invariant:** No local filesystem persistence exists. All data is stored in cloud services (Supabase) or browser storage APIs (IndexedDB, Cache API, OPFS).

---

## 5. Environment Variables

### 5.1 Frontend (Runtime)

| Variable                         | Description                    | Required |
|----------------------------------|--------------------------------|----------|
| `VITE_SUPABASE_URL`             | Supabase project URL           | Yes      |
| `VITE_SUPABASE_ANON_KEY`        | Supabase anonymous key         | Yes      |
| `VITE_AI_GATEWAY_URL`           | AI microservice base URL       | Yes      |
| `VITE_SENTRY_DSN`               | Error tracking DSN             | No       |

### 5.2 AI Gateway (Runtime)

| Variable                         | Description                    | Required |
|----------------------------------|--------------------------------|----------|
| `SUPABASE_URL`                   | Supabase project URL           | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase service-role key      | Yes      |
| `OPENAI_API_KEY`                 | OpenAI API key                 | Yes      |
| `MODEL_NAME`                     | LLM model identifier           | Yes      |
| `LOG_LEVEL`                      | Logging verbosity              | No       |

---

## 5.3 CI/CD Pipeline Secrets

The following GitHub Actions secrets must be provisioned for the deployment pipeline to function. All secrets are stored in the repository's GitHub Actions secrets store (Settings → Secrets and variables → Actions).

### Frontend (Vercel)

| Secret | Purpose |
|--------|---------|
| `VERCEL_TOKEN` | Vercel API token for deployment |
| `VERCEL_ORG_ID` | Vercel organisation identifier |
| `VERCEL_PROJECT_ID` | Vercel project identifier |
| `VITE_SUPABASE_URL` | Supabase project URL (build-time env) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (build-time env) |
| `VITE_API_BASE_URL` | AI Gateway base URL (build-time env) |

### AI Gateway (Render)

| Secret | Purpose |
|--------|---------|
| `RENDER_API_KEY` | Render API token for deployment trigger |
| `RENDER_SERVICE_ID` | Render service identifier for `mat-ai-gateway` |
| `RENDER_SERVICE_URL` | Production URL for post-deploy health check |

### Backend (Supabase)

| Secret | Purpose |
|--------|---------|
| `SUPABASE_DB_URL` | Supabase database URL (for migrations) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

---

## 6. Revision History

| Version | Date       | Author                 | Changes         |
|---------|------------|------------------------|-----------------|
| v1.0.0  | 2025-01-01 | Maturion Platform Team | Initial release |
| v1.1.0  | 2026-03-01 | foreman-v2-agent / independent-assurance-agent | §3.3 corrected to Render; §5.3 CI/CD Pipeline Secrets added |
