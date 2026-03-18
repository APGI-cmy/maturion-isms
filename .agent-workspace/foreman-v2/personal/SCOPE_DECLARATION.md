# SCOPE_DECLARATION — wave20-atomic-write-back

**Wave**: Wave 20 — Wire parse_write_back_atomic RPC into Edge Function for atomic DB write-back
**Branch**: copilot/implement-wire-parse-write-back-rpc
**Issue**: maturion-isms#1143
**Date**: 2026-03-18
**Type**: BUILD wave — schema migration, Edge Function code, tests, documentation

## Files Changed (must match `git diff --name-only origin/main...HEAD`)

### New Files (production)
- `apps/maturion-maturity-legacy/supabase/migrations/20260318000001_fix_parse_write_back_atomic_status.sql` — Wave 20 RPC correction: status `'pending_review'`, service_role support, GRANT EXECUTE

### Modified Files (production)
- `supabase/functions/invoke-ai-parse-criteria/index.ts` — sequential upserts replaced with atomic RPC call
- `supabase/functions/invoke-ai-parse-criteria/README.md` — atomic write-back path documented

### New Files (tests)
- `modules/mat/tests/wave20/wave20-atomic-write-back.test.ts` — 8 new tests T-W20-001 through T-W20-008

### Modified Files (tests)
- `modules/mat/tests/wave15/wave15-criteria-parsing.test.ts` — T-W15-CP-007/008/009 updated for RPC pattern
- `modules/mat/tests/wave19/wave19-criteria-parsing.test.ts` — T-W19-004 updated for RPC path

### IAA Ceremony Files
- `.agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md` — IAA Pre-Brief artifact
- `.agent-workspace/foreman-v2/personal/wave-current-tasks-wave20.md` — Wave 20 task registry
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave20-atomic-write-back-20260318.md` — PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave20-atomic-write-back-20260318.md` — Foreman session memory
- `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` — This file (Wave 20 overwrite)
- `.agent-admin/assurance/iaa-token-session-wave20-atomic-write-back-20260318.md` — IAA REJECTION-PACKAGE R1 (committed by IAA at aed08091)
- `.agent-admin/assurance/iaa-token-session-wave20-atomic-write-back-20260318-R2.md` — IAA ASSURANCE-TOKEN R2 (expected after IAA R2 PASS)

## No Implementation by Foreman Attestation
Foreman did not write any production code. All production changes were delegated to
copilot-swe-agent (api-builder role) and committed at 116b6ae.
