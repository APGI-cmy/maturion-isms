# MAT FRONTEND DEPLOYMENT RUNBOOK

| Field           | Value                                   |
|-----------------|-----------------------------------------|
| Module          | MAT – Manual Audit Tool                 |
| Component       | Frontend (React SPA)                    |
| Version         | v1.0.0                                  |
| Last Updated    | 2026-02-17                              |
| Owner           | CS2 (Infrastructure/DevOps)             |
| Classification  | Internal – Operations                   |

---

## 1. Purpose

This runbook provides **step-by-step instructions** for deploying the MAT frontend application to Vercel. It is designed for **CS2 operators** who will provision the Vercel project, configure environment variables, and execute the initial deployment.

**Audience**: CS2 (infrastructure operators with Vercel admin access)  
**Prerequisites**: Vercel account, GitHub repository access, Supabase project provisioned

---

## 2. Prerequisites Checklist

Before starting deployment, verify the following:

- [ ] **Vercel Account**: Active Vercel account with appropriate permissions (Hobby/Pro tier recommended)
- [ ] **GitHub Repository Access**: Admin access to `APGI-cmy/maturion-isms` repository
- [ ] **Supabase Project**: MAT Supabase project provisioned and database schema deployed
- [ ] **Supabase Credentials**: `SUPABASE_URL` and `SUPABASE_ANON_KEY` available
- [ ] **Domain Name** (optional): Custom domain configured (e.g., `mat.maturion.com`)
- [ ] **Vercel CLI Installed** (for manual deployments): `npm install -g vercel`

---

## 3. Vercel Project Creation

### 3.1 Create Vercel Project via Dashboard

1. **Navigate to Vercel Dashboard**:
   - Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New Project"**

2. **Import Git Repository**:
   - Select **"Import Git Repository"**
   - Choose **GitHub** as the provider
   - Search for and select **`APGI-cmy/maturion-isms`**
   - Click **"Import"**

3. **Configure Project Settings**:

   | Setting                  | Value                                      |
   |--------------------------|--------------------------------------------|
   | **Project Name**         | `maturion-mat-frontend`                    |
   | **Framework Preset**     | `Vite`                                     |
   | **Root Directory**       | `./` (leave blank, vercel.json handles it) |
   | **Build Command**        | `cd apps/mat-frontend && npm install && npm run build` |
   | **Output Directory**     | `apps/mat-frontend/dist`                   |
   | **Install Command**      | `npm install`                              |

4. **Click "Deploy"** (initial deployment will likely fail due to missing environment variables — this is expected)

### 3.2 Create Vercel Project via CLI (Alternative)

```bash
# Authenticate with Vercel
vercel login

# Link repository to Vercel (run from repository root)
cd /path/to/maturion-isms
vercel link

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your team/organization
# - Link to existing project? No
# - Project name? maturion-mat-frontend
# - In which directory is your code located? ./
```

---

## 4. Environment Variables Configuration

### 4.1 Required Environment Variables

The following environment variables **must** be configured in the Vercel project:

| Variable Name              | Description                                | Example Value                                    | Source               |
|----------------------------|--------------------------------------------|--------------------------------------------------|----------------------|
| `VITE_SUPABASE_URL`        | Supabase project URL                       | `https://abcdefgh.supabase.co`                   | Supabase Dashboard   |
| `VITE_SUPABASE_ANON_KEY`   | Supabase anonymous/public key              | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`        | Supabase Dashboard   |
| `VITE_API_BASE_URL`        | API base URL (Supabase URL or custom API)  | `https://abcdefgh.supabase.co`                   | Deployment-specific  |

### 4.2 Add Environment Variables via Vercel Dashboard

1. **Navigate to Project Settings**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select **`maturion-mat-frontend`** project
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in sidebar

2. **Add Each Variable**:
   - Click **"Add New"**
   - Enter **Name** (e.g., `VITE_SUPABASE_URL`)
   - Enter **Value** (paste from Supabase Dashboard)
   - Select **Environments**: Check **Production**, **Preview**, and **Development**
   - Click **"Save"**

3. **Repeat** for all 3 required variables

### 4.3 Add Environment Variables via CLI (Alternative)

```bash
# Production environment
vercel env add VITE_SUPABASE_URL production
# Paste value when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste value when prompted

vercel env add VITE_API_BASE_URL production
# Paste value when prompted

# Preview environment
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview
vercel env add VITE_API_BASE_URL preview
```

### 4.4 Retrieve Supabase Credentials

**Supabase Project URL and Anonymous Key**:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your MAT project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL` and `VITE_API_BASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

---

## 5. GitHub Secrets Configuration

The GitHub Actions CI/CD workflow requires the following secrets to be configured in the GitHub repository:

### 5.1 Required GitHub Secrets

| Secret Name              | Description                              | How to Obtain                                              |
|--------------------------|------------------------------------------|------------------------------------------------------------|
| `VERCEL_TOKEN`           | Vercel API token for deployments         | Vercel Dashboard → Account Settings → Tokens → Create      |
| `VERCEL_ORG_ID`          | Vercel organization/team ID              | Vercel CLI: `vercel link` → `.vercel/project.json`         |
| `VERCEL_PROJECT_ID`      | Vercel project ID                        | Vercel CLI: `vercel link` → `.vercel/project.json`         |
| `VITE_SUPABASE_URL`      | Supabase project URL                     | Supabase Dashboard → Settings → API                        |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key                   | Supabase Dashboard → Settings → API                        |
| `VITE_API_BASE_URL`      | API base URL                             | Same as `VITE_SUPABASE_URL` or custom API URL              |

### 5.2 Add GitHub Secrets

1. **Navigate to Repository Settings**:
   - Go to [https://github.com/APGI-cmy/maturion-isms](https://github.com/APGI-cmy/maturion-isms)
   - Click **"Settings"** tab (requires admin access)
   - Click **"Secrets and variables"** → **"Actions"** in sidebar

2. **Add Each Secret**:
   - Click **"New repository secret"**
   - Enter **Name** (e.g., `VERCEL_TOKEN`)
   - Enter **Value** (paste token/ID)
   - Click **"Add secret"**

3. **Repeat** for all 6 required secrets

### 5.3 Obtain Vercel Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **profile icon** (top right)
3. Navigate to **"Settings"** → **"Tokens"**
4. Click **"Create Token"**
5. Enter token name (e.g., `GitHub Actions - MAT Deployment`)
6. Select **Scope**: Your team/organization
7. Set **Expiration**: No expiration (or set appropriate expiration)
8. Click **"Create"**
9. **Copy token immediately** (it will only be shown once)
10. Add to GitHub Secrets as `VERCEL_TOKEN`

### 5.4 Obtain Vercel Organization and Project IDs

```bash
# Run from repository root
cd /path/to/maturion-isms

# Link to Vercel project (if not already linked)
vercel link

# Retrieve IDs from generated file
cat .vercel/project.json
```

**Example output**:
```json
{
  "orgId": "team_abc123xyz456",
  "projectId": "prj_def789ghi012"
}
```

- Copy `"orgId"` → Add to GitHub Secrets as `VERCEL_ORG_ID`
- Copy `"projectId"` → Add to GitHub Secrets as `VERCEL_PROJECT_ID`

---

## 6. Initial Deployment

### 6.1 Trigger Deployment via GitHub Actions

Once all environment variables and secrets are configured:

1. **Verify Configuration**:
   - Ensure all Vercel environment variables are set
   - Ensure all GitHub secrets are set
   - Verify `vercel.json` exists in repository root
   - Verify `.github/workflows/deploy-mat-vercel.yml` exists

2. **Trigger Workflow**:
   - **Option A (Automatic)**: Push a commit to `main` branch that modifies `apps/mat-frontend/**`
   - **Option B (Manual)**: Go to **Actions** tab → **Deploy MAT Frontend to Vercel** → **Run workflow**

3. **Monitor Workflow**:
   - Go to **Actions** tab in GitHub repository
   - Click on the running workflow
   - Monitor each job: `lint` → `typecheck` → `test` → `build` → `deploy-production`

4. **Verify Deployment**:
   - Check workflow summary for deployment URL
   - Visit deployment URL (e.g., `https://maturion-mat-frontend.vercel.app`)
   - Verify application loads correctly
   - Check browser console for errors

### 6.2 Manual Deployment via Vercel CLI (Alternative)

```bash
# Run from repository root
cd /path/to/maturion-isms

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 7. Custom Domain Configuration (Optional)

### 7.1 Add Custom Domain

1. **Navigate to Vercel Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select **`maturion-mat-frontend`** project
   - Click **"Settings"** → **"Domains"**

2. **Add Domain**:
   - Enter domain name (e.g., `mat.maturion.com`)
   - Click **"Add"**

3. **Configure DNS**:
   - Vercel will provide DNS configuration instructions
   - Add the required DNS records to your domain registrar:
     - **A Record**: Point to Vercel's IP (`76.76.21.21`)
     - **CNAME Record** (alternative): Point to `cname.vercel-dns.com`

4. **Verify Domain**:
   - Wait for DNS propagation (up to 48 hours, typically < 1 hour)
   - Vercel will automatically provision SSL certificate
   - Verify HTTPS access at `https://mat.maturion.com`

---

## 8. Deployment Validation Checklist

After deployment, perform the following validation checks:

### 8.1 Application Health Checks

- [ ] **Application loads**: Visit deployment URL, verify homepage renders
- [ ] **No console errors**: Open browser DevTools Console, verify no errors
- [ ] **Supabase connectivity**: Verify API calls to Supabase succeed (check Network tab)
- [ ] **Routing works**: Navigate to different pages (e.g., `/audits`, `/criteria`)
- [ ] **Authentication works**: Attempt login/signup flow
- [ ] **Offline mode** (if applicable): Test service worker and offline functionality

### 8.2 Security Validation

- [ ] **HTTPS enforced**: Verify site redirects HTTP → HTTPS
- [ ] **Security headers present**: Check response headers (use browser DevTools or `curl -I`):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] **No credentials in source**: Verify no API keys or secrets in client-side JavaScript

### 8.3 Performance Validation

- [ ] **Lighthouse score**: Run Lighthouse audit (target: Performance > 90)
- [ ] **Load time**: Verify initial page load < 3 seconds
- [ ] **Static assets cached**: Verify `Cache-Control` headers on CSS/JS files

### 8.4 CI/CD Pipeline Validation

- [ ] **Workflow succeeds**: Verify GitHub Actions workflow completes successfully
- [ ] **Preview deployments work**: Create a test PR, verify preview deployment
- [ ] **Production deployments work**: Merge to `main`, verify production deployment

---

## 9. Troubleshooting

### 9.1 Build Failures

**Symptom**: Vercel build fails with error `"Build Command failed"`

**Common Causes**:
- Missing environment variables → Add required variables (Section 4)
- TypeScript errors → Fix type errors in `apps/mat-frontend/src/`
- Missing dependencies → Verify `package.json` includes all dependencies

**Debug Steps**:
1. Check Vercel deployment logs in dashboard
2. Run build locally: `cd apps/mat-frontend && npm run build`
3. Fix errors, commit, push

### 9.2 Runtime Errors

**Symptom**: Application loads but shows errors in browser console

**Common Causes**:
- Incorrect Supabase URL/key → Verify environment variables
- CORS issues → Check Supabase project CORS settings
- API endpoint unreachable → Verify `VITE_API_BASE_URL`

**Debug Steps**:
1. Open browser DevTools Console
2. Check Network tab for failed requests
3. Verify environment variables in Vercel dashboard
4. Test API endpoints manually (e.g., `curl https://<supabase-url>/rest/v1/`)

### 9.3 GitHub Actions Failures

**Symptom**: GitHub Actions workflow fails

**Common Causes**:
- Missing GitHub secrets → Add secrets (Section 5)
- Incorrect Vercel token → Regenerate token
- Workflow syntax error → Validate YAML syntax

**Debug Steps**:
1. Check workflow run logs in GitHub Actions
2. Verify all secrets are configured
3. Re-run workflow after fixing issues

### 9.4 Environment Variable Issues

**Symptom**: Application cannot connect to Supabase

**Common Causes**:
- Environment variables not set → Add via Vercel dashboard (Section 4)
- Environment variables set for wrong environment → Set for all environments (production, preview, development)
- Typo in variable name → Verify exact names (e.g., `VITE_SUPABASE_URL` not `VITE_SUPABASE_URI`)

**Debug Steps**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all 3 required variables are present
3. Verify values are correct (copy from Supabase Dashboard)
4. Redeploy application

---

## 10. Rollback Procedure

If deployment introduces critical issues, follow this rollback procedure:

### 10.1 Rollback via Vercel Dashboard

1. **Navigate to Deployments**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select **`maturion-mat-frontend`** project
   - Click **"Deployments"** tab

2. **Identify Previous Stable Deployment**:
   - Find the last known-good deployment (before the problematic deployment)
   - Click **"..."** menu on that deployment
   - Click **"Promote to Production"**

3. **Verify Rollback**:
   - Visit production URL
   - Verify application is functional
   - Monitor error logs

### 10.2 Rollback via Git

1. **Revert Git Commit**:
   ```bash
   git revert <problematic-commit-sha>
   git push origin main
   ```

2. **Trigger Redeploy**:
   - GitHub Actions will automatically trigger
   - Monitor workflow completion

---

## 11. Monitoring and Maintenance

### 11.1 Monitoring

- **Vercel Analytics**: Enable in Vercel Dashboard → Project → Analytics
- **Error Tracking**: Integrate Sentry (optional, see `VITE_SENTRY_DSN` in architecture)
- **Uptime Monitoring**: Use external service (e.g., UptimeRobot, Pingdom)

### 11.2 Maintenance Tasks

| Task                              | Frequency    | Owner |
|-----------------------------------|--------------|-------|
| Review deployment logs            | Weekly       | CS2   |
| Check Vercel usage/quotas         | Monthly      | CS2   |
| Rotate Vercel API tokens          | Quarterly    | CS2   |
| Review and update dependencies    | Monthly      | Devs  |
| Test disaster recovery procedure  | Quarterly    | CS2   |

---

## 12. Reference Links

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Vercel CLI Reference**: [https://vercel.com/docs/cli](https://vercel.com/docs/cli)
- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **MAT Deployment Architecture**: `modules/mat/02-architecture/deployment-architecture.md`
- **MAT Implementation Plan**: `modules/mat/03-implementation-plan/implementation-plan.md`
- **GitHub Actions Workflow**: `.github/workflows/deploy-mat-vercel.yml`

---

## 13. Change Log

| Version | Date       | Author      | Changes                 |
|---------|------------|-------------|-------------------------|
| v1.0.0  | 2026-02-17 | api-builder | Initial runbook created |

---

**END OF DEPLOYMENT RUNBOOK**
