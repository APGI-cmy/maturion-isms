# MMM Live Validation Sequence

**Version**: 1.0.0
**Date**: 2026-04-26
**Wave**: mmm-deploy-execution-strategy-20260426
**Issue**: maturion-isms#1470
**Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` §7.4 — live operational validation
**Companion**: `modules/MMM/_readiness/deployment-execution-contract.md`
**Status**: PENDING — all steps in this sequence are pending live execution

---

## Purpose

This document defines the explicit ordered sequence for post-deploy live validation of the MMM
(Maturity Management Module). Each step is listed with:
- Who executes it (workflow name or CS2 manual action)
- Prerequisites
- Evidence produced
- Evidence type label (per IAA A-037 evidence-type discipline)
- Pass / Fail definition

**IMPORTANT — A-037 Evidence-Type Discipline**:
No step in this document may be marked COMPLETE. All steps are in PENDING or OPERATIONAL status.
- PENDING: Not yet executed on the live deployment
- OPERATIONAL: Known to be functioning based on prior WORKFLOW_LOG or LIVE_RUNTIME evidence

Any step promoted to COMPLETE in a future update must cite LIVE_RUNTIME or LIVE_E2E evidence
with a specific timestamp and reference. STATIC_CODE or CONFIG evidence is not sufficient to
mark a step COMPLETE.

---

## Validation Sequence

### Step 1 — Migration Execution

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | CS2 / authorised operator (manual) |
| **Workflow** | `.github/workflows/deploy-mmm-supabase-migrations.yml` — `supabase-migrate` job |
| **Mechanism** | `supabase db push --project-ref $SUPABASE_PROJECT_REF` (MMM-native migrations); psql (legacy/AIMC cross-app exception) |
| **Prerequisites** | SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF, SUPABASE_DB_URL secrets configured in repository; `workflow_dispatch` confirmation input = `CONFIRM`; protected environment `production` gate approved |
| **Evidence produced** | GitHub Actions workflow run log showing supabase db push output and psql step outputs |
| **evidence_type** | WORKFLOW_LOG |
| **PASS** | All migration steps exit 0; supabase db push reports "All migrations applied" or "No new migrations to apply"; legacy and AIMC psql steps exit 0 |
| **FAIL** | Any step exits non-zero; supabase db push or psql reports an error; preflight-guard rejects (branch not main, or CONFIRM input absent) |

---

### Step 2 — Schema Verification

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | Automated — runs within same `workflow_dispatch` execution as Step 1 |
| **Workflow** | `.github/workflows/deploy-mmm-supabase-migrations.yml` — `schema-verification` job |
| **Prerequisites** | Step 1 (supabase-migrate job) completed successfully |
| **Evidence produced** | GitHub Actions workflow run log showing PASS/FAIL/WARN per table |
| **evidence_type** | WORKFLOW_LOG |
| **PASS** | All REQUIRED tables verified present: `audits`, `audit_logs`, `criteria`, `mps`, `domains`, `evidence`; WARN tables (`evidence_submissions`) may be absent without failing the job |
| **FAIL** | Any REQUIRED table absent; psql connection error |

---

### Step 3 — Edge Function Deployment

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | CS2 / authorised operator via `workflow_dispatch` |
| **Workflow** | `.github/workflows/deploy-mmm-edge-functions.yml` |
| **Prerequisites** | SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF secrets configured; Step 1 (schema verified — Edge Functions depend on schema objects existing before first invocation) |
| **Evidence produced** | GitHub Actions workflow run log showing Edge Function deployment output; list of deployed function names |
| **evidence_type** | WORKFLOW_LOG |
| **PASS** | All 22 MMM Edge Functions deployed without error; workflow exits 0 |
| **FAIL** | Any Edge Function deployment step exits non-zero; authentication failure; project link failure |
| **Functions deployed** | mmm-health, mmm-qiw-status, mmm-org-update, mmm-invitation-create, mmm-invitation-accept, mmm-commissioning-check, mmm-org-create, mmm-framework-init, mmm-assessment-free-respond, mmm-assessment-free-result, mmm-framework-compile, mmm-framework-publish, mmm-upload-framework-source, mmm-ai-framework-parse, mmm-ai-framework-generate, mmm-ai-framework-alter, mmm-score-confirm, mmm-upload-evidence, mmm-ai-evidence-evaluate, mmm-pit-export-send, mmm-pit-evidence-return, mmm-ai-recommend |

---

### Step 4 — Frontend Deployment

| Field | Value |
|---|---|
| **Status** | OPERATIONAL |
| **Executor** | Automated — triggers on `push` to `main` with changes in `apps/mmm/**` paths |
| **Workflow** | `.github/workflows/deploy-mmm-vercel.yml` — `deploy-production` job |
| **Prerequisites** | VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_LIVE_DEPLOYMENT_URL secrets configured; build job passes (stale-path-guard, typecheck, typecheck-api) |
| **Evidence produced** | GitHub Actions workflow run log; Vercel deployment URL output in workflow step summary |
| **evidence_type** | WORKFLOW_LOG |
| **evidence_reference** | PR #1454 — Vercel deployment path validated; workflow functioning as of wave mmm-post-stage12-backend-alignment-20260422 |
| **PASS** | `deploy-production` job exits 0; production URL logged in workflow summary; `post-deploy-smoke-test` auth-smoke check returns HTTP 200 or HTTP 401 from Supabase auth endpoint |
| **FAIL** | Build fails; Vercel deployment exits non-zero; env-var-audit fails (placeholder or missing secrets) |

---

### Step 5 — AI Gateway Deployment

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | Automated — triggers on `push` to `main` with changes to `apps/mat-ai-gateway/**`; or CS2 via `workflow_dispatch` |
| **Workflow** | `.github/workflows/deploy-mmm-ai-gateway.yml` |
| **Prerequisites** | RENDER_API_KEY, RENDER_SERVICE_ID (production) secrets configured; `apps/mat-ai-gateway/` Python FastAPI service code present |
| **Evidence produced** | GitHub Actions workflow run log showing Render deployment response |
| **evidence_type** | WORKFLOW_LOG |
| **PASS** | Render deployment API call returns success; workflow exits 0 |
| **FAIL** | Render API returns error; authentication failure; service ID not found |

---

### Step 6 — Health Check Sequence

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | CS2 manual action |
| **Prerequisites** | Steps 1–5 completed; all workflows exited 0; production environment operational |
| **evidence_type** | LIVE_RUNTIME |

**Health checks to execute (in order)**:

| # | Check | Endpoint | Expected Response | Evidence |
|---|---|---|---|---|
| H-1 | MMM health Edge Function | `GET {SUPABASE_URL}/functions/v1/mmm-health` with `apikey: {SUPABASE_ANON_KEY}` | HTTP 200; JSON body with `status: "ok"` or equivalent | LIVE_RUNTIME — CS2 curl output with timestamp |
| H-2 | Vercel production URL | `GET https://mmm.maturion.com/` | HTTP 200 or 3xx redirect; page loads without error | LIVE_RUNTIME — CS2 browser or curl confirmation with timestamp |
| H-3 | Render AI gateway health | `GET {RENDER_SERVICE_URL}/health` | HTTP 200; service responds | LIVE_RUNTIME — CS2 curl output with timestamp |

**PASS**: All three health checks return expected responses.
**FAIL**: Any health check returns unexpected status (non-200/3xx for H-2, non-200 for H-1/H-3) or
connection refused.

---

### Step 7 — Auth / Runtime Check Sequence

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | CS2 manual action |
| **Prerequisites** | Step 6 (health checks) passed |
| **evidence_type** | LIVE_RUNTIME |

**Auth checks to execute (in order)**:

| # | Check | Mechanism | Expected Result | Evidence |
|---|---|---|---|---|
| A-1 | Supabase auth endpoint reachable | `GET {SUPABASE_URL}/auth/v1/settings` with `apikey: {SUPABASE_ANON_KEY}` | HTTP 200 or HTTP 401 (both confirm auth service responding) | LIVE_RUNTIME — CS2 curl output with timestamp |
| A-2 | Service role check | CS2 verifies `SUPABASE_SERVICE_ROLE_KEY` works (Supabase dashboard or direct API call) | Service role key accepted; admin-level API call returns data | LIVE_RUNTIME — CS2 manual verification with timestamp |
| A-3 | Frontend auth flow | CS2 navigates to `https://mmm.maturion.com/` and triggers login page | Login page renders; Supabase auth flow initiates without JS errors | LIVE_RUNTIME — CS2 browser screenshot with timestamp |

**PASS**: All three auth checks succeed.
**FAIL**: Auth endpoint unreachable; service role key rejected; login page fails to render or console
shows auth errors.

---

### Step 8 — End-to-End Validation (CDV Flow)

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Executor** | CS2 manual action |
| **Prerequisites** | Steps 1–7 all passed; test organisation and test user provisioned in Supabase |
| **evidence_type** | LIVE_E2E |

**Minimum CDV flow to execute**:

1. CS2 logs in to MMM frontend (`https://mmm.maturion.com/`)
2. Creates or selects a test organisation
3. Navigates to Assessment flow (GP-001: Organisation Onboarding through Framework Assessment)
4. Completes at least one assessment question submission
5. Verifies response is stored (confirms Supabase write path is working)
6. Verifies scoring output is returned (confirms Edge Function → Supabase → frontend round-trip)

**PASS**: All 6 steps complete without errors; data persists in Supabase; scoring output matches
expected structure.
**FAIL**: Any step fails; data not persisted; scoring response absent or malformed; authentication
session lost mid-flow.

**Evidence required**: CS2 recording or screenshots documenting each step completion, with
timestamps. Reference to CDV staging validation checklist in
`modules/MMM/12-phase4-ecap/cdv-staging-validation.md`.

---

## Summary Table

| Step | Description | Executor | evidence_type | Status |
|---|---|---|---|---|
| 1 | Migration Execution | CS2 / operator via workflow_dispatch | WORKFLOW_LOG | PENDING |
| 2 | Schema Verification | Automated (within Step 1 workflow run) | WORKFLOW_LOG | PENDING |
| 3 | Edge Function Deployment | CS2 / operator via workflow_dispatch | WORKFLOW_LOG | PENDING |
| 4 | Frontend Deployment | Automated on push to main | WORKFLOW_LOG | OPERATIONAL (PR #1454) |
| 5 | AI Gateway Deployment | Automated on push / workflow_dispatch | WORKFLOW_LOG | PENDING |
| 6 | Health Check Sequence | CS2 manual | LIVE_RUNTIME | PENDING |
| 7 | Auth / Runtime Check | CS2 manual | LIVE_RUNTIME | PENDING |
| 8 | End-to-End CDV Flow | CS2 manual | LIVE_E2E | PENDING |

---

## References

| Reference | Purpose |
|---|---|
| `modules/MMM/_readiness/deployment-execution-contract.md` | Deployment surface ownership and mechanism approval |
| `modules/MMM/12-phase4-ecap/cdv-staging-validation.md` | CDV staging validation checklist with evidence slots |
| `modules/MMM/12-phase4-ecap/deployment-alignment.md` | Deployment alignment record (post-Stage-12) |
| `.github/workflows/deploy-mmm-supabase-migrations.yml` | Steps 1–2 workflow |
| `.github/workflows/deploy-mmm-edge-functions.yml` | Step 3 workflow |
| `.github/workflows/deploy-mmm-vercel.yml` | Step 4 workflow |
| `.github/workflows/deploy-mmm-ai-gateway.yml` | Step 5 workflow |
| maturion-isms#1470 | Governing issue |
| maturion-isms#1443 | CDV staging validation issue |

---

*Produced by: integration-builder*
*Wave: mmm-deploy-execution-strategy-20260426*
*Issue: maturion-isms#1470*
*Date: 2026-04-26*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
