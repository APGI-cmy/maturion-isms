# CL-6 Migration Report — Knowledge Re-ingestion

**Wave**: CL-6 | LKIAC Wave 3  
**Task**: CL-6-D2 (Migration Script) / CL-6-D4 (Report)  
**Status**: TEMPLATE — populated by `runMigration()` at execution time  
**Authority**: api-builder, Wave CL-6, branch copilot/cl-6-migrate-knowledge-embeddings  

---

## Summary

| Metric | Value |
|--------|-------|
| Legacy row count | _(populated at runtime)_ |
| Rows migrated | _(populated at runtime)_ |
| Rows skipped | _(populated at runtime)_ |
| Rows flagged | _(populated at runtime)_ |
| Row count match | _(populated at runtime)_ |
| Critical failure | _(populated at runtime)_ |
| Duration | _(populated at runtime)_ |
| Timestamp | _(populated at runtime)_ |

---

## Domain Distribution

| Domain | Row Count |
|--------|-----------|
| iso27001 | _(populated at runtime)_ |
| nist | _(populated at runtime)_ |
| pci-dss | _(populated at runtime)_ |
| soc2 | _(populated at runtime)_ |
| risk-management | _(populated at runtime)_ |
| general | _(populated at runtime)_ |
| ldcs | _(populated at runtime)_ |
| diamond-industry | _(populated at runtime)_ |

---

## Validation Rules Applied

| Rule | Description | Result |
|------|-------------|--------|
| V-001 | Unknown source → FLAGGED, skip | Applied |
| V-002 | NULL source → use 'general' | Applied |
| V-003 | Unknown domain → FLAGGED, fallback to 'general' | Applied |
| V-004 | All migrated rows: approval_status = 'pending' | Applied |
| V-005 | source='criteria' → REJECT (Pipeline 1 isolation) | Applied |

---

## Pipeline 1 Isolation

- Rows with `source='criteria'`: REJECTED (not migrated)
- PIPELINE_1_SOURCE_EXCLUSION: `["criteria"]`
- Pipeline 1 isolation: ✅ PRESERVED

---

## Smart Chunk Reuse

- Deduplication by `content_hash`: ✅ ENABLED
- Conflict resolution: IGNORE DUPLICATES (upsert on content_hash)
- In-memory duplicate guard: ✅ ENABLED (processedHashes Set)

---

## Approved Source Labels

`iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`, `ldcs`, `diamond-industry`

---

## Approved Domain Labels

`iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`, `ldcs`, `diamond-industry`

---

## Running the Migration

```bash
# Set required environment variables (IAA SB-001 — NO hardcoded credentials)
export LEGACY_SUPABASE_URL="<legacy-project-url>"
export LEGACY_SUPABASE_SERVICE_KEY="<legacy-service-key>"
export AIMC_SUPABASE_URL="<aimc-project-url>"
export AIMC_SUPABASE_SERVICE_KEY="<aimc-service-key>"

# Run migration
npx tsx packages/ai-centre/src/scripts/migrate-knowledge-embeddings.ts
```

---

_Template committed by api-builder — CL-6-D4 deliverable_  
_Actual values written by `runMigration()` at execution time_  
_Wave CL-6 branch: copilot/cl-6-migrate-knowledge-embeddings_
