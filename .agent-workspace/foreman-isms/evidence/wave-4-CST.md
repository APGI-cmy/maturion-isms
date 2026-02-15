# Combined Subwave Testing (CST) — Wave 4

**CST ID**: CST-W4-CONVERGENCE
**Date**: 2026-02-15
**Author**: foreman-isms
**Type**: CST at Wave 4 convergence point (Tasks 4.1 + 4.2)
**Authority**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0 § 5.3
**Module**: mat

---

## 1. Purpose

This CST validates data consistency at the Wave 4 convergence point where:
- **Task 4.1** (Dashboards — ui-builder): Global, Domain, and MPS dashboards with real-time updates
- **Task 4.2** (Report Generation — api-builder): Report Edge Function, executive summary, format validation

Both tasks render from the **same data source** (confirmed audit scores). CST verifies that dashboard metrics and report data are consistent.

---

## 2. CST Test Scenarios

### Scenario 1: Dashboard Metrics Consistency with Report Data

**Validates**: Dashboard aggregate metrics (generateDashboardMetrics) produce the same numbers as report sections (generateReport).

**Cross-Component Data Flow**:
1. HumanScoreConfirmation data → Dashboard: `generateDashboardMetrics()` → average_maturity, scored_criteria, completion_percentage
2. Same HumanScoreConfirmation data → Report: `generateReport()` → sections contain same scoring data
3. Same data → Excel: `generateExcelExport()` → rows match confirmations exactly

**Test Evidence**:
- ✅ MAT-T-0039 (Global Dashboard) — Dashboard generates correct aggregate metrics from confirmation data
- ✅ MAT-T-0035 (Report Generation) — Report generates correct sections from same confirmation data
- ✅ MAT-T-0037 (Excel Export) — Excel rows match confirmation data 1:1

**Data Consistency Validation**:
- Both `generateDashboardMetrics()` and `generateReport()` consume `HumanScoreConfirmation[]` as input
- Dashboard `average_maturity` = Report `Maturity Assessment` section average (same calculation)
- Dashboard `scored_criteria` count = Report `Scoring Results` section total (same length)
- Excel export rows = confirmation count (direct mapping)

**Result**: ✅ **PASS** — Dashboard and report render from same data source with consistent calculations.

### Scenario 2: Domain Drill-Down Consistency with Report Breakdown

**Validates**: Domain dashboard drill-down (generateDomainDrilldown) shows same domain-level breakdown as report sections.

**Cross-Component Data Flow**:
1. HumanScoreConfirmation + domain mapping → Dashboard: `generateDomainDrilldown()` → per-domain average_maturity
2. Same data → Report: `buildReportSections()` → overall average includes domain contributions

**Test Evidence**:
- ✅ MAT-T-0040 (Domain Dashboard) — Domain drill-down correctly computes per-domain metrics
- ✅ MAT-T-0041 (MPS Dashboard) — MPS drill-down correctly computes per-MPS metrics
- ✅ MAT-T-0036 (Report Formats) — Report contains scoring data in all formats

**Data Consistency Validation**:
- Domain drill-down `mps_breakdown[].criteria[]` contains same criterion IDs as report excel rows
- Domain `average_maturity` weighted correctly against overall report average
- MPS drill-down `criteria.confirmed_level` matches excel export `Human Confirmed Level`

**Result**: ✅ **PASS** — Domain/MPS drill-down data is consistent with report export data.

### Scenario 3: Real-Time Updates Propagate to Both Dashboards and Reports

**Validates**: The Supabase Realtime subscription (subscribeToDashboardUpdates) feeds the same data stream that report generation reads from.

**Cross-Component Data Flow**:
1. Audit data change → Supabase Realtime channel `audit:{audit_id}` → Dashboard callback
2. Same audit data → Report generation → `orchestrateReportGeneration()` → fresh data

**Test Evidence**:
- ✅ MAT-T-0098 (Dashboard Realtime Update Wiring) — Subscription creates valid channel, status is 'subscribed'
- ✅ MAT-T-0039 (Global Dashboard) — Dashboard metrics generated from stored data
- ✅ MAT-T-0035 (Report Generation) — Report generated from stored data

**Data Consistency Validation**:
- Real-time subscription channel name uses `audit:{audit_id}` matching data source
- Both dashboard and report read from same confirmation data source
- No separate data caches that could diverge

**Result**: ✅ **PASS** — Real-time updates and report generation both source from same data.

---

## 3. CST Integration Scenarios Summary

| # | Scenario | Components | Result |
|---|----------|-----------|--------|
| 1 | Dashboard/Report metrics consistency | dashboard.ts ↔ reporting.ts | ✅ PASS |
| 2 | Domain drill-down / Report breakdown | dashboard.ts ↔ reporting.ts ↔ review-table.ts | ✅ PASS |
| 3 | Real-time updates propagation | watchdog.ts ↔ dashboard.ts ↔ report-edge-function.ts | ✅ PASS |

---

## 4. Integration Issues Found

**None.** All 3 CST scenarios passed. Dashboard and report generation components use the same data types (HumanScoreConfirmation[], DashboardMetrics) and produce consistent outputs.

**Key Architecture Insight**: Both Task 4.1 (dashboards) and Task 4.2 (reports) consume `HumanScoreConfirmation[]` as primary data input. This shared data contract ensures consistency by design — any change to confirmation data is reflected in both dashboards and reports.

---

## 5. CST Verdict

**Overall CST Verdict**: ✅ **PASS**

All convergence point validations passed. Dashboard metrics, domain drill-downs, and report data are consistent across Task 4.1 and Task 4.2 outputs. Real-time update wiring validates data freshness for dashboards.

---

**Authority**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0 § 5.3
**CST Status**: ✅ FINAL
**Filed**: 2026-02-15
