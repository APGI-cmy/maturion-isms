# Correction Addendum — DCKIS-IMPL-002 R1

**Date**: 2026-03-20
**Wave**: DCKIS-IMPL-002
**Session**: session-dckis-impl-002-foreman-20260320
**IAA REJECTION-PACKAGE**: iaa-token-session-dckis-impl-002-20260320.md (8 failures)
**Remediation type**: R1 (first remediation round)

## Corrections Applied

1. **SCOPE_DECLARATION.md updated** (BL-027): Declared all 12 files changed by DCKIS-IMPL-002 wave.
2. **process-document-v2 wired into useKnowledgeDocuments** (BD-005): Edge Function now invoked via `supabase.functions.invoke('process-document-v2', ...)` in `uploadWithRetry`.
3. **Migration 009 added** (BD-021): approval_status CHECK constraint aligned from 'retired' to 'rejected'.
4. **deploy-mat-edge-functions.yml paths updated** (CORE-023): Added `packages/ai-centre/supabase/functions/**` to paths trigger.
5. **PREHANDOVER proof token field acknowledged** (CORE-018/A-029): `iaa_audit_token` will be updated after IAA R2 issues ASSURANCE-TOKEN.

## PREHANDOVER proof status

Per §4.3b, PREHANDOVER_PROOF_DCKIS_IMPL_002.md is immutable post-commit.
`iaa_audit_token` will be populated in the IAA token file for R2 at:
`.agent-admin/assurance/iaa-token-session-dckis-impl-002-20260320-R2.md`
