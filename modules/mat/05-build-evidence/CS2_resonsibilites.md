# Wave 6 Pre-Deployment Manual Setup Checklist

**Module**: MAT (Manual Audit Tool)  
**Wave**: Wave 6 — Deployment & Commissioning  
**Document Type**: Build Evidence — Manual Setup Tracking  
**Version**: 1.0.0  
**Status**: IN PROGRESS  
**Owner**: Johan Ras (CS2, Bootstrap Phase)  
**Created**: 2026-02-17  
**Authority**: Derived from Implementation Plan §2.7 (Wave 6)

---

## Purpose

This checklist documents all manual setup tasks required BEFORE and DURING Wave 6 deployment execution. It serves as:

1. **Pre-flight validation**: Ensure all prerequisites are met before builder agents execute Tasks 6.1–6.4
2. **Build evidence**: Track completion of manual infrastructure provisioning
3. **Governance artifact**: Demonstrate due diligence in production deployment preparation
4. **Handover documentation**: Provide clear status for CS2 and future maintainers

**Completion Target**: All items must be checked BEFORE Task 6.4 (CWT on Production) can pass.

---

## Critical Dependencies

| Task | Requires This Checklist | Status |
|------|------------------------|--------|
| **Task 6.1** (Vercel Provisioning) | Sections 1, 2, 3 complete | ⏳ Pending |
| **Task 6.2** (Staging Validation) | Sections 1–6 complete | ⏳ Pending |
| **Task 6.3** (Production Deploy) | Sections 1–9 complete | ⏳ Pending |
| **Task 6.4** (CWT + Sign-Over) | **ALL sections** complete | ⏳ Pending |

---

## 1. Supabase Setup 🗄️

### A. Storage Buckets (Evidence & Criteria Documents)

**Reference**: `modules/mat/02-architecture/data-architecture.md` §4 (Storage Strategy)

- [ ] **Create storage bucket**: `evidence-photos`
  - [ ] Enable RLS policies for organization isolation
  - [ ] Set file size limits: 10MB per FR-014
  - [ ] Configure CORS for frontend access (production domain)
  - [ ] Test upload/download with signed URLs
  
- [ ] **Create storage bucket**: `evidence-audio`
  - [ ] Enable RLS policies
  - [ ] Set file size limits: 25MB per FR-015
  - [ ] Configure CORS
  - [ ] Test upload/download
  
- [ ] **Create storage bucket**: `evidence-files`
  - [ ] Enable RLS policies
  - [ ] Set file size limits: 50MB per FR-016
  - [ ] Configure CORS
  - [ ] Test upload/download
  
- [ ] **Create storage bucket**: `criteria-documents`
  - [ ] Enable RLS policies (Lead Auditor upload only)
  - [ ] Set file size limits: 20MB per TR-021
  - [ ] Configure CORS
  - [ ] Test upload/download

**Validation**: All buckets visible in Supabase Dashboard → Storage

---

### B. Database & RLS Verification

**Reference**: Wave 0 deliverables, `modules/mat/02-architecture/security-architecture.md` §3 (RLS Policies)

- [ ] Verify all database migrations applied (check `supabase_migrations` table)
- [ ] Verify RLS policies active on all tables (test cross-org access blocked)
- [ ] Create test organization(s) for staging validation
  - [ ] Organization 1: `Test Org Alpha` (ID: `_______________`)
  - [ ] Organization 2: `Test Org Beta` (ID: `_______________`)
- [ ] Verify multi-tenant isolation (user in Org Alpha cannot see Org Beta data)

**Validation**: Run RLS test suite (MAT-T-0042–MAT-T-0050) against staging database

---

### C. Authentication Configuration

**Reference**: `modules/mat/02-architecture/security-architecture.md` §2 (Authentication)

- [ ] Verify Supabase Auth providers enabled:
  - [ ] Email/Password (minimum required)
  - [ ] Google OAuth (optional)
  - [ ] Microsoft OAuth (optional)
- [ ] Configure MFA settings (TOTP required for Lead Auditor role per FR-031)
- [ ] Set JWT expiration: `3600` seconds (1 hour) per TR-012
- [ ] Set refresh token policy: `604800` seconds (7 days)
- [ ] Verify redirect URLs for production domain: `https://[production-url]/auth/callback`

**Validation**: Test login flow with MFA on staging

---

### D. API Keys & Secrets

**Reference**: Required for environment variables (Section 3)

- [ ] Copy **Supabase Project URL** → Stored in: `_______________`
- [ ] Copy **Supabase Anon Key** (public) → Stored in: `_______________`
- [ ] Copy **Supabase Service Role Key** (secret) → Stored in: `_______________` ⚠️ **KEEP SECRET**
- [ ] Verify Edge Functions deployed (if any custom functions exist)
  - [ ] Function: `_______________ ` (status: deployed/pending)

**Validation**: Test API connection with anon key from staging frontend

---

## 2. Vercel Project Setup ☁️

### A. Project Creation

**Reference**: `modules/mat/02-architecture/deployment-architecture.md` §3.1 (Vercel Configuration)

- [ ] Navigate to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Import repository: `APGI-cmy/maturion-isms`
- [ ] Select **Root Directory**: `apps/mat-frontend`
- [ ] Framework Preset: **Vite** (auto-detected)
- [ ] Verify Build Command: `pnpm build`
- [ ] Verify Output Directory: `dist`
- [ ] Verify Install Command: `pnpm install --frozen-lockfile`
- [ ] Project Name: `_______________ ` (e.g., `mat-production`)

**Validation**: Vercel project visible in dashboard

---

### B. Build Configuration Files

**Reference**: `modules/mat/02-architecture/deployment-architecture.md` §3.1

- [ ] Verify `apps/mat-frontend/vercel.json` exists and contains:
  ```json
  {
    "buildCommand": "pnpm build",
    "outputDirectory": "dist",
    "framework": "vite",
    "installCommand": "pnpm install --frozen-lockfile",
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```
- [ ] Verify `apps/mat-frontend/.vercelignore` exists (excludes test files, node_modules)

**Validation**: Files committed to repository

---

### C. Domain Configuration (Optional)

- [ ] Add custom domain (if applicable): `_______________ `
- [ ] Configure DNS records (CNAME or A record)
- [ ] Verify HTTPS enabled (automatic via Vercel)
- [ ] Test domain resolves to Vercel deployment

**Validation**: Custom domain loads application (if configured)

---

## 3. Environment Variables & Secrets 🔐

### A. Environment Variable Reference File

**Reference**: Required by Task 6.1 acceptance criteria

- [ ] Verify `apps/mat-frontend/.env.example` exists with all variables documented
- [ ] Verify `.env.example` includes comments explaining each variable
- [ ] Verify `.env.example` is committed to repository (no secrets!)

**Validation**: File exists and is up-to-date

---

### B. Set Environment Variables in Vercel

**Reference**: `modules/mat/02-architecture/deployment-architecture.md` §3.4 (Environment Variables)

Navigate to: **Vercel Project Settings** → **Environment Variables**

#### Frontend Variables (VITE_ prefix = exposed to browser)

- [ ] `VITE_SUPABASE_URL`
  - Value: `https://[your-project].supabase.co`
  - Scope: ✅ Production, ✅ Preview, ☐ Development
  
- [ ] `VITE_SUPABASE_ANON_KEY`
  - Value: `[anon-key-from-supabase]`
  - Scope: ✅ Production, ✅ Preview, ☐ Development
  
- [ ] `VITE_APP_URL`
  - Value: `https://[your-vercel-domain].vercel.app`
  - Scope: ✅ Production, ✅ Preview, ☐ Development
  
- [ ] `VITE_SENTRY_DSN` (optional)
  - Value: `https://[sentry-dsn]`
  - Scope: ✅ Production, ✅ Preview, ☐ Development

#### Backend/Secret Variables (NOT exposed to browser)

- [ ] `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **SECRET**
  - Value: `[service-role-key]`
  - Scope: ✅ Production, ✅ Preview, ☐ Development
  
- [ ] `OPENAI_API_KEY` ⚠️ **SECRET**
  - Value: `sk-[your-openai-key]`
  - Scope: ✅ Production, ✅ Preview, ☐ Development
  
- [ ] `WHISPER_API_KEY` ⚠️ **SECRET**
  - Value: `sk-[whisper-key]` (may be same as OpenAI key)
  - Scope: ✅ Production, ✅ Preview, ☐ Development
  
- [ ] `SENTRY_AUTH_TOKEN` ⚠️ **SECRET** (optional)
  - Value: `[sentry-token]`
  - Scope: ✅ Production, ✅ Preview, ☐ Development

**Validation**: All variables visible in Vercel dashboard (values hidden for secrets)

---

## 4. OpenAI API Setup 🤖

### A. API Key & Organization

**Reference**: `modules/mat/02-architecture/ai-architecture.md` §2 (Model Selection), §4 (Cost Management)

- [ ] Create OpenAI API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- [ ] API Key Name: `MAT Production` (or similar)
- [ ] Copy key → Stored in Vercel environment variables (Section 3.B)
- [ ] Set usage limits/quotas:
  - [ ] Daily limit: `$_______________ ` (recommended: $50/day)
  - [ ] Monthly limit: `$_______________ ` (recommended: $500/month per architecture)
- [ ] Verify access to required models:
  - [ ] **GPT-4 Turbo** (primary for criteria parsing & scoring)
  - [ ] **GPT-4o Mini** (fallback model)
  - [ ] **Whisper API** (audio transcription)

**Validation**: Test API key with simple completion request

---

### B. Cost Monitoring

**Reference**: TR-057 (Cost Tracking), `modules/mat/02-architecture/ai-architecture.md` §4

- [ ] Set up billing alerts in OpenAI dashboard:
  - [ ] Alert at 50% of monthly budget
  - [ ] Alert at 80% of monthly budget
  - [ ] Alert at 100% of monthly budget
- [ ] Define monthly budget cap: `$_______________ `
- [ ] Monitor usage dashboard during Wave 6 CWT

**Validation**: Billing alerts configured and tested

---

## 5. Sentry Error Monitoring (Optional but Recommended) 📊

### A. Project Setup

**Reference**: `modules/mat/02-architecture/observability-architecture.md` §2 (Error Tracking)

- [ ] Create Sentry project at [sentry.io](https://sentry.io)
- [ ] Select platform: **React**
- [ ] Project name: `MAT Frontend` (or similar)
- [ ] Copy **DSN** → Stored in Vercel environment variables
- [ ] Copy **Auth Token** → Stored in Vercel environment variables
- [ ] Organization: `_______________ `

**Validation**: Sentry project visible in dashboard

---

### B. Configuration

- [ ] Enable source maps upload (for error stack traces)
- [ ] Configure alert rules:
  - [ ] Alert on error rate > 1% (or appropriate threshold)
  - [ ] Alert on new issue detected
- [ ] Set up team notifications:
  - [ ] Email: `_______________ `
  - [ ] Slack: `_______________ ` (optional)

**Validation**: Test error captured in Sentry from staging

---

## 6. GitHub Actions / CI/CD Verification ⚙️

### A. Vercel Integration

**Reference**: `modules/mat/02-architecture/deployment-architecture.md` §3.1

- [ ] Verify Vercel GitHub App installed on `APGI-cmy/maturion-isms`
- [ ] Verify auto-deployments enabled:
  - [ ] ✅ Deploy on push to `main` → Production
  - [ ] ✅ Deploy on PR → Preview/Staging
- [ ] Test CI/CD pipeline:
  - [ ] Create test commit to non-main branch
  - [ ] Verify Vercel preview deployment triggers
  - [ ] Verify preview URL accessible

**Validation**: Preview deployment URL: `_______________ `

---

### B. GitHub Secrets (if using custom workflows)

- [ ] `VERCEL_TOKEN` added to GitHub Secrets (if needed for custom workflows)
- [ ] `SUPABASE_ACCESS_TOKEN` added (if using Supabase CLI in CI)

**Validation**: Secrets visible in GitHub repository settings

---

## 7. Database Migrations & Seed Data 🗃️

### A. Production Database Preparation

**Reference**: Task 6.3 acceptance criteria (no test-only artifacts)

- [ ] Verify all migrations applied to production Supabase instance
  - [ ] Migration count: `_______________ ` applied
  - [ ] Latest migration: `_______________ `
- [ ] **DO NOT** seed test data in production
- [ ] Create initial production data:
  - [ ] Organization 1 (your organization):
    - Name: `_______________ `
    - ID: `_______________ `
  - [ ] Lead Auditor user (admin):
    - Email: `_______________ `
    - Role: `Lead Auditor`
    - MFA enabled: ☐ Yes
  - [ ] Test audit (for smoke testing):
    - Audit ID: `_______________ `
    - Status: `Draft`

**Validation**: Production database contains minimal operational data only

---

### B. Staging Database (if separate from production)

- [ ] Apply all migrations to staging database
- [ ] Seed realistic test data:
  - [ ] Multi-organization data (2+ orgs)
  - [ ] Multi-user data (all 4 roles represented)
  - [ ] Sample audits with evidence and scores
- [ ] Verify data isolation (cross-org access blocked)

**Validation**: Staging database ready for Task 6.2 smoke testing

---

## 8. Health Check & Monitoring Endpoints 🏥

### A. Verify Health Endpoints Exist

**Reference**: Task 0.3 deliverables, Task 6.2 acceptance criteria

- [ ] Frontend health check endpoint exists:
  - Path: `/health` (or equivalent)
  - Expected response: `200 OK` with service status
- [ ] Backend/Edge Functions health check:
  - [ ] Supabase connectivity verified
  - [ ] Database connectivity verified
  - [ ] Storage connectivity verified
- [ ] Test health check from local environment:
  - [ ] Frontend: `curl https://[staging-url]/health`
  - [ ] Response: `_______________ `

**Validation**: Health endpoints return 200 with correct status

---

### B. Monitoring Setup

**Reference**: `modules/mat/02-architecture/observability-architecture.md`

- [ ] Verify Sentry frontend monitoring active (if enabled)
- [ ] Verify backend error logging (Supabase logs accessible)
- [ ] Set up uptime monitoring (optional):
  - [ ] Service: `_______________ ` (e.g., UptimeRobot, Vercel Analytics)
  - [ ] URL monitored: `_______________ `
  - [ ] Check interval: `_______________ ` minutes

**Validation**: Monitoring dashboard accessible

---

## 9. Security & Compliance 🔒

### A. CORS Configuration

**Reference**: `modules/mat/02-architecture/security-architecture.md` §5 (API Security)

- [ ] Verify Supabase CORS settings allow production domain:
  - [ ] Domain: `https://[production-url]`
  - [ ] Configured in Supabase Dashboard → Settings → API
- [ ] Verify Vercel headers configuration (in `vercel.json`):
  ```json
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
  ```
- [ ] Test CORS from production URL (browser console, no errors)

**Validation**: No CORS errors in browser console

---

### B. HTTPS & Certificates

- [ ] Verify HTTPS enabled on Vercel (automatic)
- [ ] Verify no mixed content warnings (all resources loaded via HTTPS)
- [ ] Test SSL/TLS: [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=[production-url])
  - Grade: `_______________ ` (target: A or A+)

**Validation**: HTTPS working, no certificate warnings

---

### C. Data Privacy Compliance (GDPR/POPIA)

**Reference**: FR-067–FR-069, `modules/mat/02-architecture/security-architecture.md` §6

- [ ] Verify RLS policies enforce organization isolation (tested in Section 1.B)
- [ ] Verify no PII logged in error tracking:
  - [ ] Sentry scrubbing enabled for email addresses
  - [ ] Sentry scrubbing enabled for user IDs (if applicable)
- [ ] Verify data retention policies:
  - [ ] Soft-deleted audits retention: `_______________ ` days (per FR-003)
  - [ ] Error logs retention: `_______________ ` days

**Validation**: Data privacy controls verified and documented

---

## 10. Pre-Deployment Checklist Summary 📋

### Before Task 6.1 (Vercel Provisioning) Can Complete:

- [ ] ✅ All Supabase storage buckets created (Section 1.A)
- [ ] ✅ All Supabase RLS policies active (Section 1.B)
- [ ] ✅ Supabase API keys copied (Section 1.D)
- [ ] ✅ OpenAI API key created (Section 4.A)
- [ ] ✅ Vercel project created (Section 2.A)
- [ ] ✅ All environment variables set in Vercel (Section 3.B)
- [ ] ✅ `.env.example` file exists and documented (Section 3.A)
- [ ] ✅ GitHub-Vercel integration verified (Section 6.A)

### Before Task 6.2 (Staging Validation) Can Complete:

- [ ] ✅ All Section 10 prerequisites met
- [ ] ✅ Staging database has test data (Section 7.B)
- [ ] ✅ Health check endpoints functional (Section 8.A)
- [ ] ✅ CORS configuration tested (Section 9.A)

### Before Task 6.3 (Production Deploy) Can Complete:

- [ ] ✅ All Section 10 prerequisites met
- [ ] ✅ Staging validation passed (Task 6.2 complete)
- [ ] ✅ Production database has minimal operational data (Section 7.A)
- [ ] ✅ No test-only artifacts in codebase

### Before Task 6.4 (CWT on Production) Can Complete:

- [ ] ✅ **ALL sections of this checklist complete**
- [ ] ✅ Production deployment live and accessible (Task 6.3 complete)
- [ ] ✅ All monitoring/alerting active (Section 5, 8)
- [ ] ✅ Security controls validated (Section 9)

---

## 11. Quick Reference: Where to Find Keys 🔑

| Service | Dashboard URL | Keys/Info Needed | Status |
|---------|--------------|------------------|--------|
| **Supabase** | https://supabase.com/dashboard/project/[project-id] | Project URL, Anon Key, Service Role Key | ☐ |
| **OpenAI** | https://platform.openai.com/api-keys | API Key | ☐ |
| **Vercel** | https://vercel.com/dashboard | (Auto-configured via GitHub App) | ☐ |
| **Sentry** | https://sentry.io/settings/[org]/projects/[project] | DSN, Auth Token | ☐ |

---

## 12. Execution Timeline & Notes 📅

### Execution Start Date
- [ ] Started: `_______________ ` (YYYY-MM-DD HH:MM UTC)

### Critical Milestones
- [ ] Section 1–3 complete (Supabase + Vercel + Env Vars): `_______________ `
- [ ] Section 4–6 complete (OpenAI + Sentry + CI/CD): `_______________ `
- [ ] Section 7–9 complete (Database + Health + Security): `_______________ `
- [ ] All sections complete: `_______________ `

### Execution Completion Date
- [ ] Completed: `_______________ ` (YYYY-MM-DD HH:MM UTC)

### Total Time Spent
- Duration: `_______________ ` hours

---

## 13. Issues & Deviations Log 🚨

**Purpose**: Document any blockers, deviations, or issues encountered during manual setup.

| Date | Section | Issue Description | Resolution | Status |
|------|---------|------------------|------------|--------|
| YYYY-MM-DD | X.X | Example: Supabase storage bucket creation failed | Resolved by... | ✅ Resolved |
|  |  |  |  |  |
|  |  |  |  |  |

---

## 14. Sign-Off & Validation ✅

### Manual Setup Completion Certification

I certify that all sections of this checklist have been completed according to the specifications in:
- Implementation Plan §2.7 (Wave 6)
- Architecture documents (modules/mat/02-architecture/)
- Functional Requirements (FR-001–FR-071)
- Technical Requirements (TR-001–TR-071)

**Completed By**: `_______________ ` (Name)  
**Role**: `_______________ ` (e.g., CS2, DevOps Engineer)  
**Date**: `_______________ ` (YYYY-MM-DD)  
**Signature**: `_______________ `

### Validation Checklist

- [ ] All 100+ checklist items marked complete
- [ ] No open items in Issues & Deviations Log (Section 13)
- [ ] All credentials securely stored (password manager or secrets vault)
- [ ] `.env.example` committed to repository (no secrets)
- [ ] Environment variables set in Vercel (production + preview)
- [ ] Staging deployment tested and functional
- [ ] Ready for api-builder to execute Task 6.3 (Production Deploy)

---

## 15. References & Cross-Links 📚

| Document | Location | Relevant Section |
|----------|----------|-----------------|
| Implementation Plan | `modules/mat/03-implementation-plan/implementation-plan.md` | §2.7 (Wave 6) |
| Deployment Architecture | `modules/mat/02-architecture/deployment-architecture.md` | §3.1–§3.5 |
| Security Architecture | `modules/mat/02-architecture/security-architecture.md` | §2 (Auth), §3 (RLS), §5 (API Security) |
| Data Architecture | `modules/mat/02-architecture/data-architecture.md` | §4 (Storage Strategy) |
| AI Architecture | `modules/mat/02-architecture/ai-architecture.md` | §2 (Models), §4 (Cost) |
| Observability Architecture | `modules/mat/02-architecture/observability-architecture.md` | §2 (Error Tracking), §3 (Monitoring) |
| FRS | `modules/mat/01-frs/functional-requirements.md` | FR-014–FR-016 (Evidence), FR-030–FR-035 (Auth), FR-067–FR-069 (Privacy) |
| TRS | `modules/mat/01.5-trs/technical-requirements-specification.md` | TR-012 (JWT), TR-021 (File Sizes), TR-057 (Costs) |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Johan Ras (CS2) | Initial checklist created for Wave 6 manual setup tracking |

---

**END OF CHECKLIST**

**Next Action**: Begin execution in sequential order (Sections 1→2→3→...→9). Mark each item complete as you progress. Document any issues in Section 13.
