# Wave 19 — MAT Criteria Parsing Holistic Repair — Current Tasks

**Wave**: Wave 19
**Issue**: maturion-isms#1137
**Branch**: copilot/wave-19-holistic-mat-criteria-repair
**Foreman Session**: session-wave19-orchestration-20260317
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md`
**Status**: PHASE 3 — BATCH A COMPLETE (RED), BATCHES B/C/D IN PROGRESS

---

## Re-Anchor Pulse

```yaml
status: BATCH_A_COMPLETE_DELEGATING_BATCHES_BCD
iaa_prebrief: COMMITTED
batch_a_status: COMPLETE (16 RED tests written — T-W19-001 through T-W19-016)
batch_b_status: IN_PROGRESS (schema-builder delegated)
batch_c_status: IN_PROGRESS (api-builder delegated)
batch_d_status: IN_PROGRESS (ui-builder delegated)
batch_e_status: PENDING (depends on batch_b+c)
batch_f_status: PENDING (depends on batch_a-e)
tasks_done: 12
tasks_total: 16
last_updated: 2026-03-17
```

---

## Task Registry

### Batch A — QA-to-Red (BLOCKING — must complete first)
| Task | Test | Status |
|------|------|--------|
| T-W19A-001 | T-W19-002 criteria.number TEXT assertion | PENDING |
| T-W19A-002 | T-W19-001/015 criteria.number = '1.4.1' format | PENDING |
| T-W19A-003 | T-W19-003 MPS intent_statement column | PENDING |
| T-W19A-004 | T-W19-004/012 MPS intent_statement non-null | PENDING |
| T-W19A-005 | T-W19-005/006 audit_logs criteria_parsed row | PENDING |
| T-W19A-006 | T-W19-007 zero-insert → criteria_parse_failed | PENDING |
| T-W19A-007 | T-W19-008 criteria INSERT fail → rollback atomicity | PENDING |
| T-W19A-008 | T-W19-010 Edge Fn startup validation | PENDING |
| T-W19A-009 | T-W19-013 poll timeout user error | PENDING |
| T-W19A-010 | T-W19-016 AI Gateway startup ValueError | PENDING |
| T-W19A-011 | T-W19-011 CI schema validation | PENDING |
| T-W19A-012 | T-W19-014 E2E LDCS fixture content | PENDING |

### Batch B — Schema Migrations (depends on Batch A RED)
| Task | Migration | Status |
|------|-----------|--------|
| T-W19B-001 | 20260317000001 criteria.number → TEXT | PENDING |
| T-W19B-002 | 20260317000002 MPS intent_statement/guidance | PENDING |
| T-W19B-003 | 20260317000003 parse_write_back_atomic RPC | PENDING |
| T-W19B-004 | RLS policies for new MPS columns | PENDING |

### Batch C — API/Edge Function (depends on Batch B)
| Task | File | Status |
|------|------|--------|
| T-W19C-001 | Edge Fn: c.number (not idx+1) | PENDING |
| T-W19C-002 | Edge Fn: MPS intent_statement + guidance | PENDING |
| T-W19C-003 | Edge Fn: zero-insert assertion | PENDING |
| T-W19C-004 | Edge Fn: atomic RPC wired | PENDING |
| T-W19C-005 | Edge Fn: startup validation (AI_GATEWAY_URL) | PENDING |
| T-W19C-006 | AI Gateway: MpsResult fields | PENDING |
| T-W19C-007 | AI Gateway: system prompt update | PENDING |
| T-W19C-008 | AI Gateway: SUPABASE_STORAGE_URL assertion | PENDING |
| T-W19C-009 | Edge Fn: MPS number via normaliseMpsNumber TEXT | PENDING |

### Batch D — UI (depends on Batch A)
| Task | File | Status |
|------|------|--------|
| T-W19D-001 | Poll timeout 30min useCriteria.ts | PENDING |

### Batch E — Integration (depends on B+C)
| Task | Description | Status |
|------|-------------|--------|
| T-W19E-001 | AI_GATEWAY_URL Supabase secrets | PENDING |
| T-W19E-002 | SUPABASE_STORAGE_URL Render env | PENDING |
| T-W19E-003 | .env.example update | PENDING |
| T-W19E-004 | CI schema validation check | PENDING |

### Batch F — E2E Validation (depends on A-E)
| Task | Description | Status |
|------|-------------|--------|
| T-W19F-001 | LDCS test fixture | PENDING |
| T-W19F-002 | E2E test upload→criteria | PENDING |
| T-W19F-003 | E2E staging smoke test | PENDING |

---

## Delegation Log

| Timestamp | Builder | Batch | Status |
|-----------|---------|-------|--------|
| 2026-03-17T16:00 | qa-builder | Batch A | DELEGATED |

