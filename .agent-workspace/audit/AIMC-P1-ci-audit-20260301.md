# AIMC Phase 1 — CI/CD Audit Report

**Auditor**: integration-builder  
**Session**: 078  
**Date**: 2026-03-01  
**Wave**: CL-4  
**Tasks**: T-A-012, T-C-001, T-C-010

---

## Scope

This report covers the CI/CD audit for AIMC Phase 1, focusing on:
- **T-A-012**: Supabase CI migration pipeline (AIMC migrations 001–006)
- **T-C-001**: Single entry point verification (`@maturion/ai-centre` vs direct provider SDKs)
- **T-C-010**: CI gate for direct provider SDK imports in module code

---

## Audit Summary

| T-ID | Description | Status | Confidence |
|------|-------------|--------|-----------|
| T-A-012 | Supabase CI migration pipeline applies AIMC migrations | **PARTIAL FAIL** | HIGH |
| T-C-001 | Modules/apps use @maturion/ai-centre not direct provider SDKs | **PARTIAL FAIL** | HIGH |
| T-C-010 | CI gate rejects direct provider SDK imports in module code | **FAIL** | HIGH |

---

## T-A-012: Supabase CI Migration Pipeline

### Requirement

The CI/CD pipeline must apply all 6 AIMC migrations (`packages/ai-centre/supabase/migrations/001` through `006`) before deploying. The migration step must:
1. Exist as a named job or step
2. Cover all 6 AIMC migrations
3. Use a proper DB URL secret (not a service role key)
4. Run before deployment jobs

### Workflow Inspected

**File**: `.github/workflows/deploy-mat-vercel.yml`

### Evidence

#### Check 1 — `supabase-migrate` job exists
**Result**: ✅ PASS

Job `supabase-migrate` is defined at the root level of the workflow:

```yaml
supabase-migrate:
  name: Apply Supabase Migrations
  runs-on: ubuntu-latest
  needs: [build]
  permissions:
    contents: read
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    - name: Setup Supabase CLI
      uses: supabase/setup-cli@v1
    - name: Apply pending migrations
      working-directory: apps/maturion-maturity-legacy
      env:
        SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
      run: |
        supabase db push --db-url "$SUPABASE_DB_URL"
```

#### Check 2 — Applies all AIMC migrations (001–006)
**Result**: ❌ FAIL

The migration step sets `working-directory: apps/maturion-maturity-legacy` and runs `supabase db push`. This applies only the migrations in the `apps/maturion-maturity-legacy/supabase/migrations/` directory.

**AIMC migrations** (in `packages/ai-centre/supabase/migrations/`) are **not covered**:

| Migration File | Present in packages/ai-centre | Applied by CI? |
|----------------|-------------------------------|----------------|
| `001_ai_memory.sql` | ✅ | ❌ NOT applied |
| `002_ai_telemetry.sql` | ✅ | ❌ NOT applied |
| `003_ai_knowledge.sql` | ✅ | ❌ NOT applied |
| `004_ai_episodic_memory.sql` | ✅ | ❌ NOT applied |
| `005_ai_feedback_pipeline.sql` | ✅ | ❌ NOT applied |
| `006_ai_knowledge_metadata.sql` | ✅ | ❌ NOT applied |

No other workflow file (`deploy-mat-ai-gateway.yml`, `governance-hardening.yml`, `merge-gate-interface.yml`, etc.) contains a Supabase migration step targeting `packages/ai-centre`.

#### Check 3 — Uses proper DB URL secret (not service role key)
**Result**: ✅ PASS

The step uses `SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}`. This is a database connection URL (PostgreSQL connection string), not a Supabase service role API key (`SUPABASE_SERVICE_ROLE_KEY`). The `--db-url` flag confirms this is the correct secret type for `supabase db push`.

#### Check 4 — Migration step runs before deployment
**Result**: ✅ PASS

Job dependency graph:
```
lint ──┐
       ├──> build ──> supabase-migrate ──> deploy-preview
typecheck ──┘                          └──> deploy-production
test ──┘
```

Both `deploy-preview` and `deploy-production` declare `needs: [build, supabase-migrate]`. Deployment cannot proceed until migrations complete.

### T-A-012 Verdict

**PARTIAL FAIL** — The pipeline infrastructure is correctly structured (job exists, right secret, right ordering) but the critical gap is that AIMC migrations from `packages/ai-centre/supabase/migrations/` are never applied.

**Remediation Required**: Add a migration step for the AIMC package:
```yaml
- name: Apply AIMC migrations
  working-directory: packages/ai-centre
  env:
    SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
  run: |
    supabase db push --db-url "$SUPABASE_DB_URL"
```
Or restructure to use a monorepo-level migration runner that includes both paths.

---

## T-C-001: Single Entry Point Verification

### Requirement

All modules and apps that invoke AI capabilities must declare a dependency on `@maturion/ai-centre` and must NOT declare direct dependencies on:
- `openai`
- `@anthropic-ai/sdk`
- `@perplexity-ai/sdk`
- Any other provider-specific SDK

### Files Inspected

- `modules/mat/frontend/package.json`
- `apps/maturion-maturity-legacy/package.json`
- `apps/isms-portal/package.json`
- `packages/ai-centre/package.json` (the package itself)

### Evidence

#### Check 1 — No direct provider SDK dependencies
**Result**: ✅ PASS

Grep for `openai`, `@anthropic-ai`, `@perplexity-ai` across all `modules/` and `apps/` `package.json` files:

```
modules/mat/frontend/package.json     — (no AI deps)
apps/maturion-maturity-legacy/package.json — (no AI deps)
apps/isms-portal/package.json         — (no AI deps)
```

**No direct provider SDK declared** in any module or app package.json. ✅

#### Check 2 — Modules/apps declare `@maturion/ai-centre` dependency
**Result**: ❌ FAIL

```
modules/mat/frontend/package.json          — @maturion/ai-centre: ABSENT
apps/maturion-maturity-legacy/package.json — @maturion/ai-centre: ABSENT
apps/isms-portal/package.json              — @maturion/ai-centre: ABSENT
```

The `@maturion/ai-centre` package (`packages/ai-centre/`) is not declared as a dependency in any consuming module or application.

#### Check 3 — `@maturion/ai-centre` package is correctly structured
**Result**: ✅ PASS (package level)

`packages/ai-centre/package.json`:
```json
{
  "name": "@maturion/ai-centre",
  "version": "0.0.1",
  "private": true,
  "description": "Maturion AI Management Centre — single-gateway AI capability package",
  "main": "src/index.ts"
}
```

Package exists with correct scoped name. Entry point defined.

#### Check 4 — Test-level enforcement of no direct imports
**Result**: ✅ PASS (partial compliance signal)

`modules/mat/tests/aimc-analysis/aimc-analysis.test.ts` lines 222–227 assert:
> `analysis-service.ts must NOT import directly from "openai" package`  
> `analysis-service.ts must NOT import directly from "@anthropic-ai" package`

This enforces the single-entry-point rule at the test level for the `analysis-service.ts` file. However, this only covers that one file and is not a blanket enforcement for all module code.

### T-C-001 Verdict

**PARTIAL FAIL** — No direct provider SDK violations found (positive), but `@maturion/ai-centre` is not structurally wired as a dependency in any module or app. The single-entry-point rule is architecturally defined but not structurally enforced through package dependency declarations.

**Architecture context**: The current AI call path routes through the Python-based `apps/mat-ai-gateway/` HTTP API, not through the Node.js `@maturion/ai-centre` package. This may be intentional, but the single-entry-point requirement needs to be explicitly satisfied at the interface layer.

**Remediation Required**:
- Option A: Wire `@maturion/ai-centre` as a workspace dependency in `modules/mat` and document it as the required JS/TS gateway for all AI calls
- Option B: Declare the Python gateway as the canonical single entry point, and close this gap via T-C-010 enforcement

---

## T-C-010: CI Gate for Direct Provider Imports

### Requirement

A CI workflow must exist that rejects pull requests containing direct provider SDK import statements in module code, e.g.:
- `import OpenAI from 'openai'`
- `import Anthropic from '@anthropic-ai/sdk'`
- `import { PerplexityClient } from '@perplexity-ai/sdk'`

### Workflows Inspected

All 14 workflow files in `.github/workflows/`:
- `agent-bootstrap-inject.yml`
- `agent-contract-audit.yml`
- `copilot-setup-steps.yml`
- `deploy-mat-ai-gateway.yml`
- `deploy-mat-vercel.yml`
- `governance-hardening.yml`
- `governance-ripple-sync.yml`
- `layer-up-dispatch.yml`
- `layer-up-trigger.yml`
- `merge-gate-interface.yml`
- `model-scaling-check.yml`
- `polc-boundary-gate.yml`
- `preflight-evidence-gate.yml`
- `provider-model-ban.yml`
- `ripple-integration.yml`

### Evidence

#### Check 1 — `provider-model-ban.yml` exists and bans provider model strings
**Result**: ✅ EXISTS (but insufficient scope)

File: `.github/workflows/provider-model-ban.yml`  
Job: `AIMC Compliance / provider-model-ban`  
Trigger: `pull_request`, paths: `modules/mat/src/**`

This workflow checks for banned **model name strings** in `modules/mat/src/`:
```bash
grep -rn --include="*.ts" --include="*.tsx" \
  -E '(gpt-[0-9]|whisper-[0-9a-z]|claude-[0-9a-z]|dall-e|o3-mini|o1-mini|o1-preview|text-embedding-)' \
  modules/mat/src/
```

**This is NOT an import-path check.** It would catch:
- `const model = 'gpt-4'` ✅ (catches hardcoded model strings)

But would NOT catch:
- `import OpenAI from 'openai'` ❌
- `import Anthropic from '@anthropic-ai/sdk'` ❌

#### Check 2 — Any workflow checks import paths for provider SDKs
**Result**: ❌ FAIL — No such workflow found

Grep across all workflow files for import-path enforcement patterns:
```
grep "import.*from.*openai"   → 0 matches in workflows
grep "import.*from.*anthropic" → 0 matches in workflows
grep "from ['\"]openai"       → 0 matches in workflows
grep "@anthropic-ai"          → 0 matches in workflows
```

**No CI workflow contains a gate that rejects** `import ... from 'openai'` or equivalent direct provider SDK import statements.

### T-C-010 Verdict

**FAIL** — The `provider-model-ban.yml` workflow exists and correctly bans hardcoded provider model name strings, but no CI gate exists that detects and rejects direct provider SDK **import declarations** in module code. This is a distinct and uncovered gap.

**Remediation Required**: Add a step to `provider-model-ban.yml` (or create `provider-import-ban.yml`):

```yaml
- name: Check for direct provider SDK imports
  run: |
    echo "Checking for direct provider SDK import statements..."
    if grep -rn --include="*.ts" --include="*.tsx" \
      -E "from ['\"]openai['\"]|from ['\"]@anthropic-ai|from ['\"]@perplexity" \
      modules/; then
      echo "❌ BANNED: Direct provider SDK imports found in modules/"
      echo "All AI calls must route through @maturion/ai-centre or the MAT AI Gateway."
      exit 1
    else
      echo "✅ No direct provider SDK imports found."
    fi
```

---

## Workflow Coverage Matrix

| Workflow File | Contains Migration Step? | Contains Provider Import Check? | Notes |
|---------------|--------------------------|--------------------------------|-------|
| `deploy-mat-vercel.yml` | ✅ (legacy app only) | ❌ | AIMC migrations absent |
| `deploy-mat-ai-gateway.yml` | ❌ | ❌ | Python app, no migration step |
| `provider-model-ban.yml` | ❌ | Partial (model strings only) | Import path ban missing |
| `polc-boundary-gate.yml` | ❌ | ❌ | POLC author check only |
| `governance-hardening.yml` | ❌ | ❌ | Agent file protection only |
| `merge-gate-interface.yml` | ❌ | ❌ | General merge gates |
| `preflight-evidence-gate.yml` | ❌ | ❌ | Bootstrap preflight only |
| All others | ❌ | ❌ | Not relevant to audit scope |

---

## Gaps Identified

| Gap ID | T-ID | Description | Risk | Priority |
|--------|------|-------------|------|----------|
| CI-GAP-001 | T-A-012 | AIMC migrations (001–006) not applied in any CI/CD pipeline | HIGH — AIMC schema not provisioned in deployment environments | HIGH |
| CI-GAP-002 | T-C-001 | `@maturion/ai-centre` not declared as dependency in any module/app | MEDIUM — no structural enforcement of single-entry-point | MEDIUM |
| CI-GAP-003 | T-C-010 | No CI gate for direct provider SDK import declarations | HIGH — provider SDKs could be added without detection | HIGH |

---

## Recommendations

### CI-GAP-001 (T-A-012) — Add AIMC migration step
**Action**: Extend `deploy-mat-vercel.yml` `supabase-migrate` job with AIMC migration step:
```yaml
- name: Apply AIMC package migrations
  working-directory: packages/ai-centre
  env:
    SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
  run: supabase db push --db-url "$SUPABASE_DB_URL"
```
**Owner**: Foreman to assign (requires `.github/workflows/` modification — escalation_required per integration-builder scope)

### CI-GAP-002 (T-C-001) — Wire @maturion/ai-centre or document gateway
**Action**: Either declare `@maturion/ai-centre` as workspace dependency in `modules/mat/package.json`, or formally document the Python HTTP gateway as the single entry point and close via CI-GAP-003 fix.  
**Owner**: Foreman to assign (architecture decision required)

### CI-GAP-003 (T-C-010) — Add provider import ban
**Action**: Add import-path grep to `provider-model-ban.yml` covering modules/ and apps/ directories.  
**Owner**: Foreman to assign (requires `.github/workflows/` modification — escalation_required per integration-builder scope)

---

## Note on Scope Boundary

Per integration-builder contract (`scope.escalation_required`), modifications to `.github/workflows/**` require Foreman escalation. This audit report documents the gaps and recommendations but does **not** implement workflow changes. Foreman must assign the remediation to an appropriate builder or directly via CS2 authority.

---

## IAA Invocation Status

Phase A Advisory: IAA invocation logged. No IAA deployment confirmed in this environment.  
Status: `PHASE_A_ADVISORY` — PR flagged for IAA review upon availability.

---

## Session Attestation

I, integration-builder (Session 078), attest that:
1. All evidence in this report is derived from direct file inspection and command execution
2. All workflow files in `.github/workflows/` were examined
3. All `package.json` files in `modules/` and `apps/` were inspected for provider dependencies
4. All PASS results reference specific file names, job names, and step names
5. All FAIL results include the specific gaps identified with no concealment
6. No fabricated evidence appears in this report

**Auditor**: integration-builder  
**Session**: 078  
**Wave**: CL-4  
**Audit completed**: 2026-03-01
