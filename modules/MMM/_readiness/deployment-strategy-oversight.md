# MMM Deployment Strategy Oversight Record

**Wave**: mmm-deploy-strategy-oversight-20260426
**Issue**: maturion-isms#1468
**Date**: 2026-04-26
**Status**: ACTIVE — oversight formally recorded; corrective governance added to PRE_BUILD_STAGE_MODEL_CANON.md §7.4

---

## 1. Oversight Statement

The MMM pre-build stages (Stages 1–12) defined the target architecture and platform topology but did **NOT** define the deployment execution model with operational precision.

**Architecture captured** (what WAS present before Stage 12):
- Deployment target: Vercel (frontend), Supabase (database + Edge Functions), Render (AI gateway)
- AIMC ownership boundaries
- Environment variable names and sources (via §7.2 Runtime/Deployment Contract)
- Infrastructure prerequisites and health check expectations

**What was missing** (what was NOT explicitly defined):
- Which workflow (by name/path) executes each deployment surface
- Workflow separation of concerns (which workflow owns what)
- Live-infrastructure access rules for GitHub-hosted runners
- Migration execution path (Supabase CLI `supabase db push` vs `psql` vs other — not explicitly chosen and frozen)
- CI/preview/production execution boundaries (what operations are CI-safe vs preview-safe vs live-only)
- Protected environment and manual CS2/approval requirements
- Runner and network assumptions per surface

**Consequence**: Downstream workflow implementation drifted into operational speculation, requiring guesswork and causing real CI/workflow failures after Stage 12. Post-hoc operational interpretation was required, documented in `modules/MMM/12-phase4-ecap/deployment-alignment.md`.

---

## 2. Missing Governance Content

The following items were not captured in the pre-build stage chain (Stages 1–12) and should have been:

| Item | Description | Where It Should Have Been |
|------|-------------|--------------------------|
| Deployment surface ownership | Which workflow (by name/path) owns each deployment surface | §7.4 Deployment Execution Contract, filed in `_readiness/` before Stage 12 |
| Workflow separation of concerns | Frontend / backend / migrations / schema verification / live validation — each owned by a named workflow | §7.4 Deployment Execution Contract |
| Live-infrastructure access rules | Whether GitHub-hosted runners may access live infrastructure (YES/NO with justification) | §7.4 Deployment Execution Contract |
| Migration execution path | Approved migration execution mechanism (Supabase CLI `supabase db push`, `psql`, Prisma, other) | §7.4 Deployment Execution Contract |
| CI/preview/production execution boundaries | What operations are CI-safe, preview-safe, and live-only | §7.4 Deployment Execution Contract |
| Protected environment and manual approval requirements | What triggers require CS2/manual approval | §7.4 Deployment Execution Contract |
| Runner and network assumptions | Per-surface runner type requirements; network assumption validation | §7.4 Deployment Execution Contract |

---

## 3. Corrective Governance Action

**Action taken**: `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` updated.

| Change | Detail |
|--------|--------|
| New section added | §7.4 Deployment Execution Contract — mandatory supporting control, same trigger as §7.2 and §7.3 |
| Version bump | PRE_BUILD_STAGE_MODEL_CANON.md v1.1.0 → v1.2.0 |
| Canonization Mandate added | Mandate #10: Deployment Execution Contract must be filed before first build wave; all mandatory items must be explicitly answered; "TBD" or blank entries are a PBFAG FAIL condition |
| Prohibitions added | Three new prohibitions covering: (1) absence of Deployment Execution Contract, (2) workflow deviation without Change-Propagation Audit, (3) operational speculation as substitute for frozen contract |
| CANON_INVENTORY.json updated | PRE_BUILD_STAGE_MODEL_CANON.md entry updated: version 1.2.0, new SHA256 hash, last_updated 2026-04-26 |

**Forward governance requirement**: All future MMM builds (and all governed builds under PRE_BUILD_STAGE_MODEL_CANON.md) **must** produce a filed and Foreman-approved Deployment Execution Contract in the module's `_readiness/` folder before the first build wave begins.

---

## 4. MMM-Specific Deployment Execution Contract Definition

This section records the retroactive Deployment Execution Contract for MMM — what SHOULD have been filed before Stage 12 Build Execution began. Reference `modules/MMM/12-phase4-ecap/deployment-alignment.md` for the post-hoc deployment alignment that was created after Stage 12.

### 4.1 Deployment Surface Ownership (Workflow by Name/Path)

| Surface | Workflow Path | Trigger |
|---------|--------------|---------|
| Frontend deployment | `.github/workflows/deploy-mmm-vercel.yml` | Push to `main` with changes to `apps/mmm/**` |
| AI Gateway (backend/API) deployment | `.github/workflows/deploy-mmm-ai-gateway.yml` | Push to `main` with changes to `apps/mat-ai-gateway/**` |
| Supabase Edge Functions deployment | `.github/workflows/deploy-mmm-edge-functions.yml` | Push to `main` with Edge Function changes |
| DB migration execution | Supabase CLI `supabase db push` via `.github/workflows/deploy-mmm-edge-functions.yml` or manual CS2 action | Protected; requires CS2/manual approval for production |
| Schema verification | Supabase CLI `supabase db diff --linked` — CS2 manual verification | Not automated in CI; CS2 operational action |
| Live operational validation | Health check endpoints post-deploy: `mmm-health` Edge Function + Vercel preview URL | Post-deploy gate before marking wave COMPLETE |

### 4.2 Runner Access Rules

| Rule | Value |
|------|-------|
| GitHub-hosted runners for CI checks | PERMITTED — build, lint, test, type-check only; no live-infrastructure access |
| GitHub-hosted runners for preview deployments | PERMITTED — Vercel preview deployments and staging Edge Function deploys |
| GitHub-hosted runners for live infrastructure | NOT PERMITTED without explicit CS2 approval or protected environment gate |
| Self-hosted runners required | NO — no surface requires self-hosted runners; all surfaces use GitHub-hosted runners with protected environment gates for production |

### 4.3 Migration Execution Mechanism

| Mechanism | Status | Rationale |
|-----------|--------|-----------|
| **Supabase CLI `supabase db push`** | **APPROVED** | Official Supabase migration mechanism; uses `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF`; integrates with Supabase migration tracking |
| Direct `psql` | NOT APPROVED | Bypasses Supabase migration tracking; no audit trail |
| Prisma migrate | NOT APPLICABLE | Project uses Supabase-native schema management, not Prisma |

**Credentials required**: `SUPABASE_ACCESS_TOKEN` (GitHub secret), `SUPABASE_PROJECT_REF` (GitHub secret)

### 4.4 Execution Boundaries

| Execution Context | Permitted Operations |
|------------------|---------------------|
| **CI-safe** (all PR builds) | Build, lint, type-check, unit tests, integration tests (against mock/test Supabase), no live-infra access |
| **Preview-safe** (preview/staging only) | Vercel preview deployments, staging Edge Function deploys (`SUPABASE_PROJECT_REF` → staging project), staging AI gateway |
| **Live-only** (production only; NOT in CI or preview) | Production DB migrations (`supabase db push` → production project), production Edge Function deploys, production Render AI gateway deploys |

### 4.5 CS2/Manual Approval Requirements

| Operation | Requires CS2/Manual Approval | Rationale |
|-----------|------------------------------|-----------|
| Production DB migrations | YES — CS2 manual action or protected environment gate | Schema destructive risk; irreversible |
| Schema destructive operations | YES — CS2 approval before merge | DROP TABLE, DROP COLUMN, constraint removal |
| Production environment variable changes | YES — CS2 operational action on Vercel/Supabase/Render dashboards | Not automated; secrets management |
| Production Edge Function deploys | Protected environment gate — CS2 approval required | Live service impact |
| Production Render AI gateway deploys | Protected environment gate — CS2 approval required | Live service impact |

### 4.6 Environment Validation Before Deployment

Health check endpoints must be verified post-deploy before marking any wave COMPLETE:
- `mmm-health` Edge Function: `GET /functions/v1/mmm-health` must return HTTP 200
- Vercel frontend: preview or production URL must load without error
- AI Gateway: Render health check endpoint (`RENDER_SERVICE_URL/health`) must return HTTP 200
- CS2 must confirm environment variables and secrets are correctly provisioned before live deployment

---

## 5. Lesson Learned

| # | Lesson | Corrective Action |
|---|--------|-------------------|
| L-001 | Architecture topology alone is insufficient; deployment execution model must be frozen separately and explicitly before build begins | §7.4 Deployment Execution Contract is now mandatory in PRE_BUILD_STAGE_MODEL_CANON.md for all governed builds |
| L-002 | Absence of a Deployment Execution Contract creates operational drift — downstream workflow implementation fills the gap with speculation | PBFAG FAIL condition for missing or incomplete Deployment Execution Contract |
| L-003 | "Deployment contract" and "deployment execution contract" are distinct: the former defines WHAT infrastructure exists; the latter defines HOW it is deployed and by WHOM | §7.2 (Runtime/Deployment Contract) and §7.4 (Deployment Execution Contract) are both required and complementary |
| L-004 | Real CI/workflow failures resulted from the missing execution model — this is not a theoretical risk | Enforcement: Deviation from approved Deployment Execution Contract requires Change-Propagation Audit before merging |

---

## 6. References

| Reference | Purpose |
|-----------|---------|
| `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` §7.4 | Corrective governance — mandatory Deployment Execution Contract control |
| `modules/MMM/12-phase4-ecap/deployment-alignment.md` | Post-hoc deployment alignment record (created after Stage 12) |
| `modules/MMM/06-pbfag/runtime-deployment-contract.md` | Stage 7 PBFAG D5 — §7.2 Runtime/Deployment Contract (complementary to §7.4) |
| `modules/MMM/BUILD_PROGRESS_TRACKER.md` §Post-Stage-12 Governance Oversight | Tracker record for this oversight wave |
| `modules/MMM/07-implementation-plan/implementation-plan.md` §7.4 | Implementation plan mandate for Deployment Execution Contract on future MMM builds |
| maturion-isms#1468 | Governing issue for this oversight wave |

---

*Produced by: governance-liaison-isms-agent*
*Wave: mmm-deploy-strategy-oversight-20260426*
*Issue: maturion-isms#1468*
*Date: 2026-04-26*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
