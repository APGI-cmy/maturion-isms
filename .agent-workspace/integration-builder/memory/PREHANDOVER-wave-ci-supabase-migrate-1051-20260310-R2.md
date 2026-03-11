# Integration Builder PREHANDOVER — wave-ci-supabase-migrate-1051 (R2)

session_id: session-wave-ci-supabase-migrate-1051-20260310-R2
wave: wave-ci-supabase-migrate-1051
branch: copilot/fix-supabase-migrate-ci-job-failure
issue: maturion-isms#1051
producing_agent: integration-builder
iaa_audit_token: IAA-session-wave-ci-supabase-migrate-1051-20260310-R2-PASS

SCOPE_DECLARATION:
Files changed:
- .github/workflows/deploy-mat-vercel.yml (3 fixes)

Fix 1 — Pre-registration INSERT:
psql "$SUPABASE_DB_URL" -c "INSERT INTO legacy_migrations (name) VALUES ('20260310000001_wave16_6_schema_audit_completeness.sql') ON CONFLICT DO NOTHING;"

Fix 2 — Hardened loop INSERT:
psql "$SUPABASE_DB_URL" -c "INSERT INTO legacy_migrations (name) VALUES ('$name') ON CONFLICT DO NOTHING;"

Fix 3 — evidence_submissions verification step: ADDED (with SUPABASE_DB_URL null-guard)

A-032 Column Compliance:
- pre-reg INSERT uses only: name ✅
- loop INSERT uses only: name ✅

OVL-CI-003: -v ON_ERROR_STOP=1 preserved ✅
OVL-CI-004: evidence_submissions step has SUPABASE_DB_URL null-guard ✅
OVL-CI-002: dependency chain unchanged ✅
YAML validation: VALID ✅
CodeQL: 0 alerts ✅

merge_gate_parity: PASS
