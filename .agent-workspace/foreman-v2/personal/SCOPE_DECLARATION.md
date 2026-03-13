# SCOPE DECLARATION — Wave 13 Execution Start

**Wave**: 13 — Live Deployment Wiring Regression Fix & Continuous Improvement (Execution Start)
**Branch**: copilot/mat-wave-13-live-deployment-fix
**Date**: 2026-03-13
**Fresh overwrite**: YES (per A-029)

## Files Modified (git diff origin/main...HEAD --name-only)

| File | Type | Justification |
|------|------|---------------|
| `.agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md` | IAA governance | Pre-Brief artifact — required per A-031 |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Governance | Wave 13 task register — BLOCKER-1 resolution |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Governance | This file — A-026 compliance |
| `modules/mat/tests/wave13/wave13-gate.test.ts` | Test | 24 RED gate tests (all Wave 13 IDs) |
| `modules/mat/tests/wave13/auth-app-wiring.test.tsx` | Test | Auth app wiring tests |
| `modules/mat/tests/wave13/auth-session-wiring.test.ts` | Test | Auth session wiring tests |
| `modules/mat/tests/wave13/ci-gates.test.ts` | Test | CI gate tests |
| `modules/mat/tests/wave13/e2e-live-deployment.test.ts` | Test | E2E live deployment tests |
| `modules/mat/tests/wave13/frontend-page-wiring.test.tsx` | Test | Frontend page wiring tests |
| `modules/mat/tests/wave13/schema-existence.test.ts` | Test | Schema existence tests |
| `.github/workflows/deploy-mat-vercel.yml` | CI | schema-existence-check job + env-var-audit fix + F-03 exit 1 |
| `apps/maturion-maturity-legacy/supabase/migrations/20260313000001_mps_view.sql` | Schema | public.mps view migration |
| `apps/maturion-maturity-legacy/supabase/migrations/20260313000002_user_profiles_view.sql` | Schema | public.user_profiles view migration |
| `.agent-admin/prehandover/proof-wave13-task13.1-20260313.md` | Governance | schema-builder PREHANDOVER proof |
| `modules/mat/05-build-evidence/PBFAG-mat-20260313.md` | Governance | PBFAG Wave 13 baseline — BLOCKER-2 resolution |
| `.agent-workspace/schema-builder/memory/session-wave13-task13.1-20260313.md` | Governance | schema-builder session memory |
| `.agent-workspace/qa-builder/memory/session-wave13-red-gate-20260313.md` | Governance | qa-builder session memory |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave13-execution-start-20260313.md` | Governance | Foreman PREHANDOVER proof |
| `.agent-workspace/foreman-v2/memory/session-wave13-execution-start-20260313.md` | Governance | Foreman session memory |
| `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | Governance | Parking station entry |
