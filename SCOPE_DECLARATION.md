# SCOPE DECLARATION

**Wave**: Wave CWT-EnvVars — Pass Supabase env vars to CWT test runner
**Branch**: copilot/fix-supabase-env-vars-for-tests
**Session**: session-cwt-envvars-20260307
**Date**: 2026-03-07
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PR**: copilot/fix-supabase-env-vars-for-tests

## Files Changed in This PR

### Workflow Fix (T-CWT-EV-001)
- `.github/workflows/deploy-mat-ai-gateway.yml` — added `env:` block (step-level only) on `Run Combined Wave Tests` step; wires `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `MAT_E2E_TEST_TOKEN` from GitHub Actions secrets

### Governance / Documentation (T-CWT-EV-002)
- `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` — Wave CWT-EnvVars section appended; documents how to generate Supabase JWT, where to add GitHub secrets, env-var wiring, and expected test outcomes

### IAA Protocol Artifacts
- `.agent-admin/assurance/iaa-prebrief-wave-cwt-envvars.md` - IAA Pre-Brief for wave-cwt-envvars (pre-existing, committed by IAA)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - updated; wave context changed to wave-cwt-envvars tasks
- `SCOPE_DECLARATION.md` - this file
