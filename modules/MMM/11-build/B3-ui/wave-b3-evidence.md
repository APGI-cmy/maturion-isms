# Wave B3 Evidence — Core UI: Onboarding

**Wave Slug**: mmm-build-wave-b3-ui  
**Issue**: maturion-isms#1428  
**Builder**: ui-builder  
**Date**: 2026-04-22  
**Status**: ✅ COMPLETE

---

## Files Created

### Edge Functions (4)
| Function | Path | JWT Required |
|---|---|---|
| `mmm-assessment-free-respond` | `supabase/functions/mmm-assessment-free-respond/index.ts` | No (public) |
| `mmm-assessment-free-result` | `supabase/functions/mmm-assessment-free-result/index.ts` | No (public) |
| `mmm-org-create` | `supabase/functions/mmm-org-create/index.ts` | Yes |
| `mmm-framework-init` | `supabase/functions/mmm-framework-init/index.ts` | Yes (ADMIN) |

### React App Scaffold (20 files)
| File | Purpose |
|---|---|
| `apps/mmm/package.json` | App dependencies |
| `apps/mmm/index.html` | Entry HTML |
| `apps/mmm/vite.config.ts` | Vite configuration |
| `apps/mmm/tsconfig.json` | TypeScript configuration |
| `apps/mmm/src/lib/supabase.ts` | Supabase client |
| `apps/mmm/src/lib/queryClient.ts` | TanStack Query client |
| `apps/mmm/src/store/orgStore.ts` | Organisation state (NBR-003) |
| `apps/mmm/src/store/userStore.ts` | User state |
| `apps/mmm/src/store/freeAssessmentStore.ts` | Free assessment state |
| `apps/mmm/src/components/ConnectivityIndicator.tsx` | Online/offline indicator (TR-041) |
| `apps/mmm/src/components/ErrorBoundary.tsx` | Error boundary (§A3.9) |
| `apps/mmm/src/components/ProtectedRoute.tsx` | Auth guard |
| `apps/mmm/src/pages/LandingPage.tsx` | J-01, FR-006 |
| `apps/mmm/src/pages/TutorialPage.tsx` | Tutorial |
| `apps/mmm/src/pages/FreeAssessmentPage.tsx` | J-02, FR-007, FR-008 |
| `apps/mmm/src/pages/FreeAssessmentResultPage.tsx` | Assessment result display |
| `apps/mmm/src/pages/SignUpPage.tsx` | J-03, FR-010 |
| `apps/mmm/src/pages/OnboardingPage.tsx` | J-04, FR-011 |
| `apps/mmm/src/pages/FrameworkOriginPage.tsx` | J-05, FR-012 |
| `apps/mmm/src/App.tsx` | Router with all B3-B6 routes |
| `apps/mmm/src/main.tsx` | Entry point |

---

## Test Results

**Config**: `vitest.mmm-b3.config.ts`  
**Test File**: `modules/MMM/tests/B3-ui/b3-ui.test.ts`  
**Test IDs**: T-MMM-S6-001–T-MMM-S6-020

| Result | Count |
|---|---|
| ✅ PASSED | 59 |
| ❌ FAILED | 0 |
| ⏭️ SKIPPED | 0 |

**Exit Code**: 0 (100% GREEN)

---

## NBR Compliance

### NBR-001 (UI Cache Invalidation)
- ✅ `OnboardingPage.tsx` calls `queryClient.invalidateQueries({ queryKey: ['organisations'] })` after org create
- ✅ `FrameworkOriginPage.tsx` calls `queryClient.invalidateQueries({ queryKey: ['frameworks'] })` after framework init
- ✅ `mmm-org-create` has `// NBR-001: UI must call queryClient.invalidateQueries(['organisations'])` comment
- ✅ `mmm-framework-init` has `// NBR-001: UI must invalidate ['frameworks'] query cache` comment

### NBR-002 (JWT/Role Enforcement)
- ✅ `mmm-org-create` uses `validateJWT` — throws HTTP 401/403 for missing/invalid JWT
- ✅ `mmm-framework-init` uses `validateJWT` + `requireRole(['ADMIN'])` — returns HTTP 403 for non-ADMIN

### NBR-003 (Org Switch Reset)
- ✅ `orgStore.ts` implements `resetOnOrgSwitch()` which clears `currentOrgId` and `currentFrameworkId`
- ✅ NBR-003 comment present in store

---

## Wave Closure Declaration

Wave B3 (Core UI: Onboarding) is COMPLETE.

All 4 Edge Functions deployed, React app scaffold created with all B3 pages, stores, and components. All 59 tests (T-MMM-S6-001–020) GREEN with 0 failures. NBR-001, NBR-002, NBR-003 obligations fully met.
