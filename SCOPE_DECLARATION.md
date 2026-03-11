# SCOPE_DECLARATION — wave-fix-vercel-supabase-migration

**Wave**: wave-fix-vercel-supabase-migration
**Session**: session-wave-fix-vercel-supabase-migration-20260311
**Date**: 2026-03-11
**Branch**: copilot/fix-vercel-supabase-migration
**Issue**: maturion-isms#1057 — "Fix failing deployment: Vercel Apply Supabase Migrations check (Deploy MAT Frontend)"
**Agent**: foreman-v2-agent v6.2.0

---

## Files Modified in This Wave (branch diff vs main)

### Production Code (wave deliverables)
1. `apps/maturion-maturity-legacy/supabase/migrations/20260310000001_wave16_6_schema_audit_completeness.sql`
   - Added `NOT VALID` to `audit_logs_action_check` CHECK constraint
   - Fixes: "check constraint audit_logs_action_check is violated by some row" CI error
   - Updated comment to explain NOT VALID semantics

2. `.github/workflows/deploy-mat-vercel.yml`
   - "Apply pending migrations" step: added SUPABASE_DB_URL empty-check, ::error:: annotations, per-file success logging, FAILED_MIGRATION break pattern
   - "Apply AIMC package migrations" step: same improvements applied symmetrically

### Governance Artifacts
3. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — updated for this wave
4. `.agent-admin/assurance/iaa-prebrief-wave-fix-vercel-supabase-migration.md` — IAA Pre-Brief
5. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-fix-vercel-supabase-migration-20260311.md` — PREHANDOVER proof
6. `.agent-workspace/foreman-v2/memory/session-wave-fix-vercel-supabase-migration-20260311.md` — session memory
7. `.agent-admin/assurance/iaa-token-session-wave-fix-vercel-supabase-migration-20260311.md` — IAA token

### Out of Scope (not modified)
- No `.github/agents/` files
- No frontend code
- No new table schemas
- No backend API routes
