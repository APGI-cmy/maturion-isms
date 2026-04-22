# Scope Declaration — align-vercel-deployment-workflow

**Wave**: align-vercel-deployment-workflow
**PR**: 1454
**Date**: 2026-04-22
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Changed Files

### Added

- `apps/mmm/src/vite-env.d.ts` - Add Vite client types (`/// <reference types="vite/client" />`) so `import.meta.env` is typed correctly for the MMM app

### Modified

- `.github/workflows/deploy-mmm-vercel.yml` - Rename from `deploy-mat-vercel.yml`; update workflow name, trigger paths, working-directory, artifact names, production URL; add `stale-path-guard` job; restore `api/**`, `packages/ai-centre/src/**`, `apps/maturion-maturity-legacy/supabase/migrations/**` trigger paths for `typecheck-api` and `supabase-migrate` jobs
- `SCOPE_DECLARATION.md` - Scope declaration for this wave

### Deleted

None
