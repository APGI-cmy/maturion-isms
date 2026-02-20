# MAT Frontend QA-to-Red Test Suite — Coverage & Traceability Summary

**Module**: MAT (Manual Audit Tool) — Frontend Application  
**Status**: QA-to-Red (RED tests for missing frontend; service-layer tests GREEN)  
**Created**: 2026-02-16  
**Suite Location**: `apps/mat-frontend/tests/`  
**Service-Layer Tests**: `modules/mat/tests/` (98 tests, all GREEN — UNMODIFIED)

---

## Overview

This document provides the authoritative traceability mapping between:
- MAT Functional Requirements (FR-001 through FR-071)
- MAT Technical Requirements (TR-001 through TR-071)
- Frontend QA-to-Red test suite (`apps/mat-frontend/tests/`)
- Existing service-layer test suite (`modules/mat/tests/`)

### Test Suite Philosophy

Per BUILD_PHILOSOPHY.md and FULLY_FUNCTIONAL_DELIVERY_STANDARD.md:
- **RED tests** indicate required implementation — builders work to make these GREEN
- **GREEN tests** (existing service-layer) remain UNMODIFIED
- All tests map to FRS/TRS requirements with traceability comments in code
- Wave closure requires ALL tests GREEN

---

## Frontend Test Files

| File | Category | FR Coverage | Status |
|------|----------|-------------|--------|
| `frontend-scaffolding.test.ts` | CAT-FE-01 | FR-070 | RED |
| `frontend-wiring.test.ts` | CAT-FE-02 | FR-071, FR-063, FR-047 | RED |
| `dashboard-ui.test.ts` | CAT-FE-03 | FR-039, FR-040, FR-041, FR-042 | RED |
| `audit-management-ui.test.ts` | CAT-FE-04 | FR-001, FR-002, FR-003 | RED |
| `criteria-upload-ui.test.ts` | CAT-FE-05 | FR-004, FR-005, FR-006, FR-007, FR-008 | RED |
| `audit-execution-ui.test.ts` | CAT-FE-06 | FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015 | RED |
| `evidence-collection-ui.test.ts` | CAT-FE-07 | FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022 | RED |
| `findings-scoring-ui.test.ts` | CAT-FE-08 | FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-030 | RED |
| `report-generation-ui.test.ts` | CAT-FE-09 | FR-033, FR-034, FR-035, FR-036, FR-037, FR-038 | RED |
| `settings-user-management-ui.test.ts` | CAT-FE-10 | FR-043, FR-044, FR-045, FR-046, FR-049, FR-058 | RED |
| `pwa-responsive-ux.test.ts` | CAT-FE-11 | FR-047, FR-048, FR-062, FR-063, FR-064, FR-065 | RED |
| `performance-a11y-security.test.ts` | CAT-FE-12 | FR-050, FR-051, FR-052, FR-053, FR-054, FR-068, FR-069, FR-070 | RED |

---

## FR-to-Test Traceability Matrix

### Frontend Tests (apps/mat-frontend/tests/)

| FRS ID | Test ID(s) | Test File | Status |
|--------|-----------|-----------|--------|
| FR-001 | MAT-FE-T-024, MAT-FE-T-025 | audit-management-ui | RED |
| FR-002 | MAT-FE-T-025, MAT-FE-T-026 | audit-management-ui | RED |
| FR-003 | MAT-FE-T-027 | audit-management-ui | RED |
| FR-004 | MAT-FE-T-028, MAT-FE-T-032 | criteria-upload-ui | RED |
| FR-005 | MAT-FE-T-029 | criteria-upload-ui | RED |
| FR-006 | MAT-FE-T-031 | criteria-upload-ui | RED |
| FR-007 | MAT-FE-T-031 | criteria-upload-ui | RED |
| FR-008 | MAT-FE-T-030 | criteria-upload-ui | RED |
| FR-009 | MAT-FE-T-033 | audit-execution-ui | RED |
| FR-010 | MAT-FE-T-033, MAT-FE-T-039 | audit-execution-ui | RED |
| FR-011 | MAT-FE-T-034 | audit-execution-ui | RED |
| FR-012 | MAT-FE-T-035 | audit-execution-ui | RED |
| FR-013 | MAT-FE-T-036 | audit-execution-ui | RED |
| FR-014 | MAT-FE-T-037 | audit-execution-ui | RED |
| FR-015 | MAT-FE-T-038 | audit-execution-ui | RED |
| FR-016 | MAT-FE-T-040 | evidence-collection-ui | RED |
| FR-017 | MAT-FE-T-041 | evidence-collection-ui | RED |
| FR-018 | MAT-FE-T-042 | evidence-collection-ui | RED |
| FR-019 | MAT-FE-T-043 | evidence-collection-ui | RED |
| FR-020 | MAT-FE-T-044 | evidence-collection-ui | RED |
| FR-021 | MAT-FE-T-044 | evidence-collection-ui | RED |
| FR-022 | MAT-FE-T-045 | evidence-collection-ui | RED |
| FR-023 | MAT-FE-T-046 | findings-scoring-ui | RED |
| FR-024 | MAT-FE-T-051 | findings-scoring-ui | RED |
| FR-025 | MAT-FE-T-047 | findings-scoring-ui | RED |
| FR-026 | MAT-FE-T-048 | findings-scoring-ui | RED |
| FR-027 | MAT-FE-T-050 | findings-scoring-ui | RED |
| FR-028 | MAT-FE-T-046 | findings-scoring-ui | RED |
| FR-029 | — | Covered by service-layer (ai-services.test.ts) | GREEN |
| FR-030 | MAT-FE-T-049 | findings-scoring-ui | RED |
| FR-031 | — | Covered by service-layer (ai-services.test.ts) | GREEN |
| FR-032 | — | Covered by service-layer (ai-services.test.ts) | GREEN |
| FR-033 | MAT-FE-T-052 | report-generation-ui | RED |
| FR-034 | MAT-FE-T-053 | report-generation-ui | RED |
| FR-035 | MAT-FE-T-054 | report-generation-ui | RED |
| FR-036 | MAT-FE-T-055 | report-generation-ui | RED |
| FR-037 | MAT-FE-T-055 | report-generation-ui | RED |
| FR-038 | MAT-FE-T-056 | report-generation-ui | RED |
| FR-039 | MAT-FE-T-019, MAT-FE-T-023 | dashboard-ui | RED |
| FR-040 | MAT-FE-T-020 | dashboard-ui | RED |
| FR-041 | MAT-FE-T-021 | dashboard-ui | RED |
| FR-042 | MAT-FE-T-022 | dashboard-ui | RED |
| FR-043 | MAT-FE-T-059 | settings-user-management-ui | RED |
| FR-044 | MAT-FE-T-059 | settings-user-management-ui | RED |
| FR-045 | MAT-FE-T-060 | settings-user-management-ui | RED |
| FR-046 | MAT-FE-T-060 | settings-user-management-ui | RED |
| FR-047 | MAT-FE-T-062 | pwa-responsive-ux | RED |
| FR-048 | — | Covered by service-layer (offline-sync.test.ts) | GREEN |
| FR-049 | MAT-FE-T-057 | settings-user-management-ui | RED |
| FR-050 | MAT-FE-T-066 | performance-a11y-security | RED |
| FR-051 | — | Covered by service-layer (security-rls.test.ts) | GREEN |
| FR-052 | — | Covered by service-layer (security-rls.test.ts) | GREEN |
| FR-053 | — | Covered by service-layer (evidence-collection.test.ts) | GREEN |
| FR-054 | MAT-FE-T-070 | performance-a11y-security | RED |
| FR-055 | — | Covered by service-layer (integration.test.ts) | GREEN |
| FR-056 | — | Covered by service-layer (integration.test.ts) | GREEN |
| FR-057 | — | Covered by service-layer (integration.test.ts) | GREEN |
| FR-058 | MAT-FE-T-058 | settings-user-management-ui | RED |
| FR-059 | — | Covered by service-layer (watchdog-observability.test.ts) | GREEN |
| FR-060 | — | Covered by service-layer (watchdog-observability.test.ts) | GREEN |
| FR-061 | — | Covered by service-layer (watchdog-observability.test.ts) | GREEN |
| FR-062 | MAT-FE-T-063 | pwa-responsive-ux | RED |
| FR-063 | MAT-FE-T-061, MAT-FE-T-017 | pwa-responsive-ux, frontend-wiring | RED |
| FR-064 | MAT-FE-T-064 | pwa-responsive-ux | RED |
| FR-065 | MAT-FE-T-065 | pwa-responsive-ux | RED |
| FR-066 | — | Covered by service-layer (data-privacy-compliance.test.ts) | GREEN |
| FR-067 | — | Covered by service-layer (data-privacy-compliance.test.ts) | GREEN |
| FR-068 | — | Covered by service-layer (performance.test.ts) | GREEN |
| FR-069 | — | Covered by service-layer (performance.test.ts) | GREEN |
| FR-070 | MAT-FE-T-001 to MAT-FE-T-008 | frontend-scaffolding | RED |
| FR-071 | MAT-FE-T-009 to MAT-FE-T-018 | frontend-wiring | RED |

---

## TRS Coverage Summary

| TRS Requirement | Frontend Test Coverage | Service Test Coverage |
|-----------------|----------------------|----------------------|
| TR-001 (React 18+, Vite 5+, TS strict) | MAT-FE-T-001 to MAT-FE-T-008 | — |
| TR-006 (Node 20 LTS) | MAT-FE-T-002 | — |
| TR-007 (Performance <3s LCP) | MAT-FE-T-023, MAT-FE-T-067 | performance.test.ts |
| TR-012 (PostgreSQL data) | — | audit-lifecycle, criteria-management |
| TR-015 (File storage) | MAT-FE-T-040 | evidence-collection.test.ts |
| TR-016 (Supabase integration) | MAT-FE-T-066 | wiring-invariants.test.ts |
| TR-022 (Security) | MAT-FE-T-057, MAT-FE-T-059 | security-rls.test.ts |
| TR-023 (RBAC) | MAT-FE-T-059 | security-rls.test.ts |
| TR-033 (WCAG 2.1 AA) | MAT-FE-T-064 | ui-accessibility.test.ts |
| TR-034 (Responsive) | MAT-FE-T-063 | ui-accessibility.test.ts |
| TR-036 (PWA) | MAT-FE-T-061, MAT-FE-T-062 | offline-sync.test.ts |
| TR-037 (AI pipelines) | MAT-FE-T-029, MAT-FE-T-046 | ai-services.test.ts |
| TR-047 (Component architecture) | All CAT-FE tests | ui-accessibility.test.ts |
| TR-051 (Testing) | This entire suite | All service tests |

---

## Non-Destructive Guarantee

- **Existing tests UNMODIFIED**: All 98 service-layer tests in `modules/mat/tests/` remain GREEN and unchanged.
- **Root vitest.config.ts UNMODIFIED**: Includes only `modules/mat/tests/**/*.test.ts`.
- **Frontend tests ISOLATED**: Run via `apps/mat-frontend/vitest.config.ts` which includes only `tests/**/*.test.ts`.
- **No file deletions**: No existing files were removed or altered.
- **Additive only**: All changes are new files in `apps/mat-frontend/`.

---

## Test Execution

```bash
# Run existing service-layer tests (should remain 98/98 GREEN)
npx vitest run

# Run frontend QA-to-Red tests (expected RED until frontend is built)
cd apps/mat-frontend && npx vitest run
```

---

*END OF COVERAGE & TRACEABILITY SUMMARY*
