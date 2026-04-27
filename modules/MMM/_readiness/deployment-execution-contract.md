# MMM Deployment Execution Contract

**Version**: 1.0.0
**Date**: 2026-04-26
**Wave**: mmm-deploy-execution-strategy-20260426
**Issue**: maturion-isms#1470
**Authority**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` §7.4
**Status**: ACTIVE — filed per §7.4 Deployment Execution Contract mandate (Mandate #10)

---

## Purpose

This document is the mandatory §7.4 Deployment Execution Contract for the MMM (Maturity Management
Module). It answers all mandatory items defined in `PRE_BUILD_STAGE_MODEL_CANON.md` §7.4 with
explicit, operational answers. No entry in this document is TBD or blank.

Per §7.4, this contract must be filed in the module's `_readiness/` folder and Foreman-approved
before the first build wave. This document is a retroactive filing for MMM, produced in wave
mmm-deploy-execution-strategy-20260426 following the oversight recorded in
`deployment-strategy-oversight.md` (issue #1468).

---

## Section 1: §7.4 Mandatory Items

### 1.1 Deployment Surface Ownership

| Deployment Surface | Workflow Name | Workflow Path | Trigger |
|---|---|---|---|
| Frontend deployment | Deploy MMM Frontend to Vercel | `.github/workflows/deploy-mmm-vercel.yml` | `push` to `main` with changes to `apps/mmm/**`, `api/**`, `packages/ai-centre/src/**`, `vercel.json`, or `pnpm-lock.yaml` |
| Backend / API service deployment | Deploy MMM AI Gateway | `.github/workflows/deploy-mmm-ai-gateway.yml` | `push` to `main` with changes to `apps/mat-ai-gateway/**` |
| DB migration execution | Deploy MMM Supabase Migrations | `.github/workflows/deploy-mmm-supabase-migrations.yml` | `workflow_dispatch` only (manual; requires CS2/operator confirmation) |
| Schema verification | Deploy MMM Supabase Migrations (schema-verification job) | `.github/workflows/deploy-mmm-supabase-migrations.yml` (schema-verification job) | Runs automatically after supabase-migrate job within the same workflow_dispatch run |
| Live operational validation | `mmm-health` Edge Function + Vercel URL + Render /health | Manual CS2 action (not automated in CI) | Post-deploy CS2 operational action; see live-validation-sequence.md |
| Supabase Edge Functions deployment | Deploy MMM Edge Functions | `.github/workflows/deploy-mmm-edge-functions.yml` | `push` to `main` with Edge Function changes; or `workflow_dispatch` |

### 1.2 GitHub-Hosted Runner Access to Live Infrastructure

**May GitHub-hosted runners access live infrastructure?**

YES — with explicit conditions:

| Context | Access Permitted | Justification |
|---|---|---|
| CI / PR builds | NO live-infrastructure access | Build, lint, type-check, unit tests only; no Supabase project access, no Vercel production writes |
| Preview deployments (PR-triggered Vercel) | PERMITTED — Vercel preview environment only | Vercel preview deployment is scoped to a preview URL; it does NOT write to the production database |
| Production deployments (`deploy-mmm-vercel.yml` on `main` push) | PERMITTED — Vercel production, gated by GitHub-hosted runner with `environment: production` gate | Protected environment gate is the control; no live DB access |
| DB migration execution (`deploy-mmm-supabase-migrations.yml`) | PERMITTED — but ONLY via `workflow_dispatch` with explicit CONFIRM input AND `environment: production` gate | Live Supabase DB mutation is permitted only on explicit manual operator trigger with protected-environment approval |
| Schema destructive operations | NOT PERMITTED without CS2 manual approval BEFORE merge | DROP TABLE, DROP COLUMN, constraint removal require CS2 sign-off before merge |

### 1.3 Self-Hosted Runners

**Are self-hosted runners required?**

NO. All MMM deployment surfaces use GitHub-hosted runners (`ubuntu-latest`). No surface
requires self-hosted runners. Production-access protection is achieved via GitHub protected
environment gates, not via runner type.

### 1.4 Approved Migration Mechanism

**Which migration mechanism is approved?**

| Mechanism | Status | Rationale |
|---|---|---|
| **`supabase db push`** via `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF` | **APPROVED** — MMM-native migrations | Official Supabase CLI migration mechanism. Integrates with Supabase's internal migration tracking (`supabase_migrations` table). Uses access token auth (not direct DB URL). Provides audit trail. Applied to files in `supabase/migrations/` only. |
| Direct `psql` via `SUPABASE_DB_URL` | **NOT APPROVED** — not viable from GitHub-hosted runners | GitHub-hosted runners cannot reach `db.<ref>.supabase.co:5432` directly (Network is unreachable). Direct psql is not used anywhere in the migration workflow. Cross-app migrations use the Supabase Management API (see Section 2). |
| Prisma migrate | NOT APPLICABLE | MMM uses Supabase-native schema management, not Prisma. |

**Credentials required for approved mechanism**:
- `SUPABASE_ACCESS_TOKEN` — GitHub Actions secret; Supabase CLI authentication
- `SUPABASE_PROJECT_REF` — GitHub Actions secret; target Supabase project identifier

### 1.5 Execution Boundaries

| Execution Context | Permitted Operations |
|---|---|
| **CI-safe** (all PR builds and push triggers) | Build (`pnpm run build`), lint (`eslint`), type-check (`tsc --noEmit`), unit tests (vitest), integration tests against mock/test doubles; NO live-infrastructure access; NO live Supabase project access |
| **Preview-safe** (PR-triggered; preview environment only) | Vercel preview deployments (Vercel preview URL; no production DB write); staging Edge Function deploys (when `SUPABASE_PROJECT_REF` points to staging project) |
| **Live-only** (production; NOT in CI or preview) | Production DB migrations (`supabase db push` → production Supabase project via `deploy-mmm-supabase-migrations.yml` `workflow_dispatch`); production Edge Function deploys; production Render AI gateway deploys; production Vercel deployment (push to `main`) |

### 1.6 Operations Requiring CS2/Manual Approval

| Operation | Requires CS2/Manual Approval | Control Mechanism | Rationale |
|---|---|---|---|
| Production DB migrations | YES — explicit `workflow_dispatch` with CONFIRM input + CS2 execution | `deploy-mmm-supabase-migrations.yml` only runs on manual trigger; input must equal `CONFIRM`; `environment: production` gate requires review approval | Schema mutation is irreversible; must be explicitly authorised |
| Schema destructive operations (DROP TABLE, DROP COLUMN, constraint removal) | YES — CS2 approval before merge | Code review gate; no automated mechanism permits this without CS2 approval on the PR | Permanent data loss risk |
| Production environment variable changes | YES — CS2 operational action on Vercel/Supabase/Render dashboards | Not automated; secrets managed via platform dashboards | Misconfiguration risk; affects live services directly |
| Production Edge Function deploys | Protected environment gate — requires CS2 review approval | `deploy-mmm-edge-functions.yml` uses `environment: production` gate | Live service impact; Edge Functions execute in production immediately on deploy |
| Production Render AI gateway deploys | Protected environment gate — requires CS2 review approval | `deploy-mmm-ai-gateway.yml` uses `environment: production` gate | Live service impact |

### 1.7 Environment Variable and Network Assumption Validation

Environment variables and network assumptions are validated before deployment using the
following mechanisms:

| Validation | Mechanism | Workflow / Step |
|---|---|---|
| Required Vercel env vars present (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_LIVE_DEPLOYMENT_URL) | `env-var-audit` step fails build if any required var is absent or placeholder | `deploy-mmm-vercel.yml` (build job, env-var-audit step) |
| SUPABASE_ACCESS_TOKEN present for migration and cross-app exception steps | Explicit `[ -z "$SUPABASE_ACCESS_TOKEN" ]` check; exits 1 if absent | `deploy-mmm-supabase-migrations.yml` (legacy, AIMC, link-project, and db push steps) |
| SUPABASE_PROJECT_REF present for migration and cross-app exception steps | Explicit check; exits 1 if absent | `deploy-mmm-supabase-migrations.yml` (legacy, AIMC, link-project, and db push steps) |
| Vercel project configuration (PROJECT_ID, ORG_ID) | `vercel pull` fails if project is not linked | `deploy-mmm-vercel.yml` (deploy steps) |
| Post-deploy health check (Vercel URL reachable) | `e2e-auth-smoke` step + `post-deploy-smoke-test` job | `deploy-mmm-vercel.yml` (post-deploy smoke test) |
| Post-deploy health check (Supabase auth endpoint) | curl to `VITE_SUPABASE_URL/auth/v1/settings` | `deploy-mmm-vercel.yml` (e2e-auth-smoke and post-deploy-smoke-test steps) |
| Legacy path guard (vercel.json still targeting apps/mmm) | `stale-path-guard` job; fails if vercel.json references legacy MAT path tokens | `deploy-mmm-vercel.yml` (stale-path-guard job) |
| Direct provider SDK import gate (T-C-010) | grep scan of apps/mmm/ for direct openai/@anthropic-ai imports | `deploy-mmm-vercel.yml` (build job, T-C-010 CI gate step) |

---

## Section 2: Cross-App Migration Exception

### 2.1 Exception Statement

The approved migration mechanism for MMM-native migrations is `supabase db push` (see §1.4).
However, two sets of cross-app migrations are applied via the Supabase Management API as an
explicit, documented exception. This section records the exception, its justification, and
its boundary.

> **Infrastructure note (2026-04-27)**: The original exception mechanism was direct `psql`
> via `SUPABASE_DB_URL`. This was replaced with the Supabase Management API because direct
> Postgres connectivity to `db.<ref>.supabase.co:5432` is not available from GitHub-hosted
> runners (Network is unreachable). The Management API uses HTTPS to `api.supabase.com`
> and is accessible from all runner environments. No change to idempotency behavior, tracking
> tables, or execution order. Tracked in maturion-isms#1474 (HTTP 201 follow-up: maturion-isms#1477).

### 2.2 Scope of Exception

| Migration Set | Directory | Exception Mechanism |
|---|---|---|
| Legacy app schema (organisations, audits, criteria, mps, domains, evidence, audit_logs) | `apps/maturion-maturity-legacy/supabase/migrations/` | Supabase Management API (`POST /v1/projects/{ref}/database/query`) via `SUPABASE_ACCESS_TOKEN`; tracked in `legacy_migrations` table |
| AIMC package schema (ai_feedback_pipeline, ai_model_capabilities) | `packages/ai-centre/supabase/migrations/` | Supabase Management API (`POST /v1/projects/{ref}/database/query`) via `SUPABASE_ACCESS_TOKEN`; tracked in `aimc_migrations` table |

### 2.3 Justification

1. **Not in canonical supabase/migrations/ directory**: `supabase db push` only manages
   migration files tracked in the `supabase/migrations/` directory (files registered in
   `supabase_migrations`). These cross-app migrations are owned by separate apps/packages
   and are not eligible for `supabase db push` without a separate cross-app migration
   governance decision.

2. **Runtime dependency for MMM**: MMM Edge Functions and frontend consume schema objects
   defined in these cross-app migrations (organisations, audits, criteria, mps, domains,
   evidence, ai_feedback). They must exist in the database before MMM-native migrations run.

3. **Execution order dependency**: AIMC migration `005_ai_feedback_pipeline.sql` references
   the `organisations` table defined in the legacy app migrations. Execution order must be
   strictly preserved: legacy → AIMC → MMM-native.

4. **Idempotency managed manually**: Each Management API execution step maintains its own
   tracking table (`legacy_migrations`, `aimc_migrations`) to ensure idempotent execution.
   This mirrors the behaviour of `supabase_migrations` for the cross-app migration sets.

### 2.4 Boundary — This Exception Does NOT Extend To

- **New MMM migrations**: Any new schema object for MMM MUST be added to `supabase/migrations/`
  and applied via `supabase db push`. The Management API exception path is not available for new MMM work.
- **New cross-app schema objects**: New shared schema objects require a governed cross-app
  architecture decision before being added to either cross-app migration set.
- **Schema destructive operations**: No DROP TABLE, DROP COLUMN, or constraint removal may
  be performed via either the Management API or `supabase db push` without CS2 approval before merge.

---

## Section 3: References

| Reference | Purpose |
|---|---|
| `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` §7.4 | Authority for this contract — mandatory items list |
| `modules/MMM/_readiness/deployment-strategy-oversight.md` §4 | Source material for this contract; retrospective §4.3 approval of `supabase db push` |
| `modules/MMM/_readiness/live-validation-sequence.md` | Companion document — explicit post-deploy live validation sequence |
| `modules/MMM/12-phase4-ecap/deployment-alignment.md` | Post-hoc deployment alignment record (pre-dates this contract; see §1 for current authoritative surface ownership) |
| `.github/workflows/deploy-mmm-vercel.yml` | Frontend deployment workflow |
| `.github/workflows/deploy-mmm-supabase-migrations.yml` | DB migration + schema verification workflow |
| `.github/workflows/deploy-mmm-edge-functions.yml` | Edge Function deployment workflow |
| `.github/workflows/deploy-mmm-ai-gateway.yml` | AI gateway deployment workflow |
| `modules/MMM/BUILD_PROGRESS_TRACKER.md` | Primary operational tracker; wave mmm-deploy-execution-strategy-20260426 |
| maturion-isms#1470 | Governing issue for this wave |
| maturion-isms#1468 | Deployment strategy oversight issue (§7.4 canon addition) |

---

*Produced by: integration-builder*
*Wave: mmm-deploy-execution-strategy-20260426*
*Issue: maturion-isms#1470*
*Date: 2026-04-26*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
