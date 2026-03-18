# Wave 20 — Wire parse_write_back_atomic RPC — Current Tasks

**Wave**: Wave 20
**Issue**: maturion-isms#1143
**Branch**: copilot/implement-wire-parse-write-back-rpc
**Foreman Session**: session-wave20-atomic-write-back-20260318
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md`
**Status**: PHASE 4 — AWAITING IAA AUDIT

---

## Re-Anchor Pulse

```yaml
status: IAA_AUDIT_PENDING
iaa_prebrief: COMMITTED
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md
implementation_status: COMPLETE
tests_status: 36/36 GREEN (wave15 + wave19 + wave20)
merge_gate_parity: PASS
tasks_done: 8
tasks_total: 8
last_updated: 2026-03-18
```

---

## Task Registry

### Wave 20 — Atomic RPC Wire-Up (COMPLETE)

| Task | Description | Status |
|------|-------------|--------|
| T-W20-001 | Edge Function calls `supabase.rpc('parse_write_back_atomic')` | ✅ GREEN |
| T-W20-002 | RPC call passes all four required parameters (p_document_id, p_domains, p_mps, p_criteria) | ✅ GREEN |
| T-W20-003 | Sequential upserts for domains, MPS, criteria removed | ✅ GREEN |
| T-W20-004 | Edge Function resolves document_id before calling the RPC | ✅ GREEN |
| T-W20-005 | RPC result checked for errors and zero-insert condition | ✅ GREEN |
| T-W20-006 | Wave 20 migration fixes RPC status stamp to `pending_review` | ✅ GREEN |
| T-W20-007 | Wave 20 migration adds service_role EXECUTE grant | ✅ GREEN |
| T-W20-008 | Wave 20 migration adds service_role caller support (auth.uid() IS NULL bypass) | ✅ GREEN |

---

## Delegation Log

| Timestamp | Builder / Agent | Task | Status |
|-----------|----------------|------|--------|
| 2026-03-18T06:31 | copilot-swe-agent (api-builder role) | Wave 20 implementation: Edge Function + migration | COMPLETE |
| 2026-03-18T06:55 | independent-assurance-agent | IAA Pre-Brief + Audit | PENDING |

---

## Evidence Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Migration fix | `apps/maturion-maturity-legacy/supabase/migrations/20260318000001_fix_parse_write_back_atomic_status.sql` | COMMITTED |
| Edge Function | `supabase/functions/invoke-ai-parse-criteria/index.ts` | COMMITTED |
| Wave 20 tests | `modules/mat/tests/wave20/wave20-atomic-write-back.test.ts` | COMMITTED |
| Wave 15 test update | `modules/mat/tests/wave15/wave15-criteria-parsing.test.ts` | COMMITTED |
| Wave 19 test update | `modules/mat/tests/wave19/wave19-criteria-parsing.test.ts` | COMMITTED |
| README update | `supabase/functions/invoke-ai-parse-criteria/README.md` | COMMITTED |
| IAA Pre-Brief | `.agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md` | COMMITTED |
