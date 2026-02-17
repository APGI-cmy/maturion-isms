# Escalation: Wave 6 Deployment Credentials Required

## Type
**BLOCKER** — Authority Boundary (Infrastructure Access)

---

## Description

Wave 6 (Deployment & Commissioning) requires Vercel and Supabase credentials to proceed with deployment tasks. The Foreman agent and builder agents do not have infrastructure credentials and cannot provision cloud resources or set production environment variables.

This escalation requests CS2 approval and credential provisioning to enable Wave 6 execution.

---

## Context

**Session**: session-wave-6-20260217  
**Wave**: Wave 6 — Deployment & Commissioning  
**Module**: MAT (Manual Audit Tool)  
**Current Status**: Pre-Wave Authorization Gate executed, CONDITIONAL APPROVAL issued  
**Blocking Task**: Task 6.1 (Vercel Project Provisioning & Configuration)

**Architecture Authority**: modules/mat/02-architecture/deployment-architecture.md v1.0.0

---

## Required Credentials

### 1. Vercel Account Access

**Purpose**: Provision Vercel project for MAT frontend deployment

**Required Capabilities**:
- Create new Vercel project
- Link Vercel project to GitHub repository (APGI-cmy/maturion-isms)
- Configure environment variables on Vercel (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL)
- Configure Vercel deployment settings (build command, output directory, framework preset)
- Trigger Vercel deployments from GitHub Actions
- Access Vercel deployment logs and status

**Options for Credential Provisioning**:
1. **Vercel CLI token** for api-builder agent (stored as GitHub secret, accessible in agent environment)
2. **Vercel GitHub App** integration (automated, minimal manual intervention)
3. **Manual provisioning by CS2** (CS2 creates Vercel project, provides project ID and deployment URL)

**Recommendation**: Option 2 (Vercel GitHub App) — Most secure and canonical approach

---

### 2. Supabase Credentials

**Purpose**: Configure Vercel environment variables for Supabase connection

**Required Values**:
1. **VITE_SUPABASE_URL**: Supabase project URL (e.g., `https://xyzabc123.supabase.co`)
2. **VITE_SUPABASE_ANON_KEY**: Supabase anonymous/public key (safe for frontend use)

**Source**: Existing Supabase project for MAT module (if provisioned) or new Supabase project creation required

**Options**:
1. **Existing Supabase project**: CS2 provides URL and anon key
2. **New Supabase project**: CS2 provisions new project, provides URL and anon key
3. **Development Supabase project**: Use development instance for Wave 6 initial deployment

**Recommendation**: Option 1 if Supabase project exists, Option 3 for initial deployment if production not yet provisioned

---

### 3. GitHub Actions Secrets

**Purpose**: Enable CI/CD workflow to deploy to Vercel

**Required GitHub Secrets** (to be added to repository settings):
- `VERCEL_TOKEN`: Vercel CLI authentication token (if using Option 1 above)
- `VERCEL_ORG_ID`: Vercel organization ID (if using Vercel CLI)
- `VERCEL_PROJECT_ID`: Vercel project ID (if using Vercel CLI)
- `VITE_SUPABASE_URL`: Supabase project URL (for build-time environment injection)
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key (for build-time environment injection)

**Note**: GitHub Secrets can only be added by repository administrators (CS2)

---

## Impact Assessment

### If Credentials Not Provided

**Immediate Impact**:
- ❌ Task 6.1 (Vercel provisioning) cannot proceed
- ❌ Task 6.2 (staging deployment) blocked
- ❌ Task 6.3 (production deployment) blocked
- ❌ Task 6.4 (CWT on production) blocked
- ❌ Wave 6 cannot complete
- ❌ MAT module cannot be deployed or commissioned
- ❌ Project timeline blocked

**Cascading Impact**:
- Wave 6 closure blocked indefinitely
- No production validation possible
- No formal sign-over possible
- MAT module remains in "completed but not deployed" state
- Governance canonical workflow incomplete (Architecture → Build → **Deploy** → Validate)

### If Credentials Provided

**Immediate Impact**:
- ✅ Task 6.1 can proceed (api-builder provisions Vercel project)
- ✅ Task 6.2 can proceed (staging deployment and validation)
- ✅ Task 6.3 can proceed (production deployment)
- ✅ Task 6.4 can proceed (CWT on production, formal sign-over)
- ✅ Wave 6 can complete
- ✅ MAT module can be deployed and commissioned
- ✅ Project completes canonical workflow

---

## Recommended Approach

### Option A: Vercel GitHub App Integration (Recommended)

**Steps**:
1. CS2 installs Vercel GitHub App on APGI-cmy/maturion-isms repository
2. CS2 creates Vercel project via Vercel dashboard
3. CS2 links Vercel project to GitHub repository
4. CS2 configures environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL` = (CS2 provides value)
   - `VITE_SUPABASE_ANON_KEY` = (CS2 provides value)
   - `VITE_API_BASE_URL` = http://localhost:54321 (default for development)
5. CS2 enables automatic deployments on merge to main
6. api-builder creates `vercel.json` and `.github/workflows/deploy-mat-vercel.yml` (configuration only, no credentials in code)
7. Merge to main triggers automatic Vercel deployment

**Advantages**:
- No credentials stored in code or agent environment
- Automated deployments (zero manual intervention after setup)
- Canonical approach (infrastructure-as-code + managed credentials)
- Secure (credentials managed by Vercel, not exposed to agents)

**Disadvantages**:
- Requires CS2 manual setup (one-time)
- CS2 must have Vercel account with appropriate permissions

---

### Option B: Vercel CLI Token (Alternative)

**Steps**:
1. CS2 creates Vercel account and generates CLI token
2. CS2 adds GitHub secrets to repository:
   - `VERCEL_TOKEN` = (CS2 generates token)
   - `VERCEL_ORG_ID` = (CS2 provides from Vercel account)
   - `VITE_SUPABASE_URL` = (CS2 provides value)
   - `VITE_SUPABASE_ANON_KEY` = (CS2 provides value)
3. api-builder creates `vercel.json` and `.github/workflows/deploy-mat-vercel.yml` (uses GitHub secrets)
4. Merge to main triggers GitHub Actions workflow with Vercel CLI deployment

**Advantages**:
- More control over deployment process
- CLI-based (infrastructure-as-code friendly)
- Can be scripted and audited

**Disadvantages**:
- Requires GitHub secrets management (CS2 must add secrets)
- CLI token has broader permissions (security consideration)
- More complex workflow (more points of failure)

---

### Option C: Manual Provisioning by CS2 (Fallback)

**Steps**:
1. CS2 manually creates Vercel project
2. CS2 manually configures environment variables in Vercel dashboard
3. CS2 manually triggers Vercel deployments
4. CS2 provides deployment URLs to Foreman
5. Foreman/qa-builder validates deployment manually

**Advantages**:
- No agent credentials required
- Complete CS2 control
- Zero automation risk

**Disadvantages**:
- Not canonical (manual process, not infrastructure-as-code)
- Not repeatable (no CI/CD)
- High manual effort (CS2 must trigger every deployment)
- Not scalable (doesn't work for future modules)

---

## Recommendation

**Foreman recommends Option A (Vercel GitHub App Integration)** as the most canonical, secure, and scalable approach.

This approach:
- Follows infrastructure-as-code principles
- Keeps credentials out of code and agent environments
- Enables automated deployments (canonical CI/CD)
- Is repeatable and scalable for future modules
- Minimizes manual intervention after one-time setup

---

## Requested Action from CS2

1. **Approve Wave 6 to proceed** after credential provisioning
2. **Choose credential provisioning approach** (Option A, B, or C)
3. **Provision credentials** according to chosen approach:
   - If Option A: Install Vercel GitHub App, create Vercel project, configure env vars
   - If Option B: Generate Vercel CLI token, add GitHub secrets
   - If Option C: Manual Vercel provisioning, provide deployment URLs
4. **Provide Supabase credentials**:
   - `VITE_SUPABASE_URL` = ?
   - `VITE_SUPABASE_ANON_KEY` = ?
5. **Notify Foreman** when credentials are provisioned and ready

---

## Alternative: Mock Deployment for Testing

If production credentials are not yet ready but Wave 6 testing is desired, CS2 could:

1. Provision a **development Supabase project** (separate from production)
2. Use **Vercel preview deployments** (no production deployment)
3. Allow api-builder to proceed with Tasks 6.1 and 6.2 (staging only)
4. Skip Tasks 6.3 and 6.4 until production credentials ready
5. Partial Wave 6 completion (staged for production later)

**Note**: This approach is **non-canonical** and should only be used if production deployment must be deferred.

---

## Session Context

**Pre-Wave Authorization Gate**: Executed (see `.agent-workspace/foreman-agent/wave-6-pre-authorization-gate.md`)

**Gate Status**: ⚠️ CONDITIONAL APPROVAL (escalation required)

**Blocked Until**: Vercel and Supabase credentials provisioned by CS2

**Estimated Impact**: 1-3 days delay if credentials require provisioning, zero delay if credentials already exist

---

**Created**: 2026-02-17  
**Session**: session-wave-6-20260217  
**Foreman**: foreman-agent  
**Status**: AWAITING CS2 RESPONSE  
**Priority**: FM_H (High — Wave 6 blocker)
