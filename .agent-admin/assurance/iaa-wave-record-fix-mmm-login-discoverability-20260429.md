# IAA Wave Record — fix-mmm-login-discoverability-20260429

**Wave**: fix-mmm-login-discoverability-20260429
**Date**: 2026-04-29
**Branch**: copilot/fix-mmm-login-discoverability
**Issue**: maturion-isms#1512 — Fix MMM login discoverability, SPA direct-route fallback, and password reset callback flow
**Ceremony Admin Appointed**: NO
**IAA Session**: session-fix-mmm-login-discoverability-20260429

---

## PRE-BRIEF

**Generated**: 2026-04-29
**IAA Session**: session-fix-mmm-login-discoverability-20260429
**Trigger**: `action: "PRE-BRIEF"` — Phase 0 invocation

### Qualifying Tasks

| # | Task | Trigger Category | IAA Required? |
|---|------|-----------------|---------------|
| 1 | Update `apps/mmm/src/pages/LandingPage.tsx` — add Sign In links to header nav and hero/CTA area | BUILD_CORRECTION | YES |
| 2 | Update `apps/mmm/src/pages/SignUpPage.tsx` — add login links for existing users | BUILD_CORRECTION | YES |
| 3 | Update `apps/mmm/src/pages/LoginPage.tsx` — add forgot-password link | BUILD_CORRECTION | YES |
| 4 | Create `apps/mmm/src/pages/ForgotPasswordPage.tsx` — forgot-password flow with supabase.auth.resetPasswordForEmail | BUILD_CORRECTION | YES |
| 5 | Create `apps/mmm/src/pages/ResetPasswordPage.tsx` — password reset callback using supabase.auth.updateUser | BUILD_CORRECTION | YES |
| 6 | Update `apps/mmm/src/App.tsx` — add /forgot-password and /reset-password routes | BUILD_CORRECTION | Covered under BUILD_CORRECTION ceremony |
| 7 | Update `modules/MMM/tests/B9-golden-path/b9-golden-path.test.ts` — add 18 anti-regression tests | TEST_CORRECTION | Covered under BUILD_CORRECTION ceremony |

**Qualifying tasks**: 5 BUILD_CORRECTION tasks (login discoverability, signup login links, forgot-password flow, reset-password flow, routing)
**Primary category**: BUILD_CORRECTION
**Delegated to**: ui-builder (page updates and new pages), qa-builder (anti-regression tests)

### Trigger Category Classification

**Step 1 — `.github/agents/` changes?** NO
**Step 2 — `governance/canon/` or CANON_INVENTORY.json?** NO
**Step 3 — `.github/workflows/`?** NO
**Step 4 — AAWP/MAT deliverable labels?** YES — `apps/mmm/` paths present
**Step 5–9** — N/A
**Classification**: BUILD_CORRECTION (fixing auth discoverability and missing password reset flow post-merge)

### Scope Blockers

None. Pure build-defect corrections and missing feature completions with no new feature scope beyond the issue requirements.

### Anti-Regression Obligations

| Rule | Source | Check |
|------|--------|-------|
| SPA-ROUTING | vercel.json | All SPA routes (/login, /forgot-password, /reset-password) must not return 404 on direct navigation |
| AUTH-DISCOVERY | LandingPage | Sign In link must be visible on the landing page header and CTA |
| PASSWORD-RESET | ResetPasswordPage | PASSWORD_RECOVERY event must be handled; supabase.auth.updateUser must be called |

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-session-fix-mmm-login-discoverability-20260429-PASS
- **Verdict**: ASSURANCE-TOKEN (PASS)
- **PR**: maturion-isms#1513
- **Issue**: maturion-isms#1512
- **Reviewed SHA**: d6647eed9ae780cd412383e180229e81e5b0cb4b
