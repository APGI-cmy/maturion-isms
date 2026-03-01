# LKIAC Deprecation Register

Version: v1.2.0  
Date: 2026-03-01  
**Amendment v1.2.0**: v1.2.0 — 2026-03-01: CL-3.5-D5 — DEP-008 status updated to `PARALLEL-RUN` per CL-3.5 wave completion (session-082).

## 3 Component Register

| Component | Status | Notes |
|-----------|--------|-------|
| Foreman Office App | PARALLEL-RUN | CL-3.5 complete (session-082, 2026-03-01). `ai_data_sources` table (migration 007) with RLS, 4 AIMC Edge Functions (connect-data-source, sync-data-source, query-data-source, test-data-sources-api), and AIMCDataSourcesPanel.tsx admin UI all delivered and 100% GREEN (244/244 tests). DEP-008 status → PARALLEL-RUN per CL-3.5-D5. Decommission of DataSourcesManagement.tsx pending CS2 sign-off (CP-3). |

## 8 Audit Trail

| Date | Change | Author | Remarks |
|-------|--------|--------|---------|
| 2026-03-01 | DEP-008 status updated ACTIVE → PARALLEL-RUN (CL-3.5-D5) — CL-3.5 wave complete: ai_data_sources migration, 4 Edge Functions, admin UI panel, 244/244 GREEN | governance-liaison-isms-agent (session-082) | CL-3.5 exit criteria met. Awaiting CS2 CP-3 sign-off for decommission gate. |

---

Footer:  
Version: v1.2.0