# Handover Evidence Checklist — ISMS Public Landing Harvest

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: foreman-v2-agent contract v6.2.0 Phase 4; OPOJD gate
**Version**: v1.0.0

---

## 1. OPOJD Gate Requirements

This checklist enforces the OPOJD (Output Quality and On-Point Delivery) gate.
ALL items must be checked before Phase 4 handover can proceed.

---

## 2. Test and Build Evidence

| Item | Required | Status |
|---|---|---|
| TypeScript compilation: zero errors | YES | [ ] |
| `pnpm run build` completes without errors | YES | [ ] |
| Existing tests pass: 0 failures | YES | [ ] |
| Zero skipped or incomplete tests | YES | [ ] |
| Zero compiler warnings | YES | [ ] |
| Zero linter warnings or errors | YES | [ ] |

---

## 3. Code Quality Evidence

| Item | Required | Status |
|---|---|---|
| Zero console.log debug statements in production code | YES | [ ] |
| No useToast on page load (anti-pattern removed) | YES | [ ] |
| No ProtectedRoute wrapping for marketing pages | YES | [ ] |
| All route constants use ROUTES.* constants (no hardcoded strings) | YES | [ ] |
| Module card names use canonical ISMS names | YES | [ ] |

---

## 4. Functional Evidence

| Item | Required | Status |
|---|---|---|
| `/` (ISMS landing page) loads in incognito browser | YES | [ ] |
| All 7 module cards visible on landing page | YES | [ ] |
| Each module card click routes to correct marketing page | YES | [ ] |
| `/free-assessment` accessible without authentication | YES | [ ] |
| `/subscribe` accessible without authentication | YES | [ ] |
| `/subscribe/checkout` accessible without authentication | YES | [ ] |
| All 6 module marketing pages accessible without authentication | YES | [ ] |
| `/journey` accessible without authentication | YES | [ ] |
| Legacy route `/risk-management-info` redirects to `/marketing/risk-management` | YES | [ ] |
| Private route `/dashboard` (if implemented) redirects to `/auth` without auth | YES | [ ] |

---

## 5. Screenshot Evidence

| Screenshot | Required | Status |
|---|---|---|
| SS-1: Landing page hero (desktop 1440px) | YES | [ ] |
| SS-2: Module cards grid (desktop 1440px, all 7 cards) | YES | [ ] |
| SS-3: Landing page (mobile 375px) | YES | [ ] |
| SS-4: Free assessment page (desktop 1440px) | YES | [ ] |
| SS-5: Subscribe/pricing page (desktop 1440px) | YES | [ ] |
| SS-6: Risk Management marketing page | YES | [ ] |
| SS-7: PIT marketing page | YES | [ ] |
| SS-8: Network tab confirming no auth redirect on `/journey` | YES | [ ] |
| SS-9: Journey page (public) | YES | [ ] |
| SS-10: Modules overview page | YES | [ ] |

---

## 6. Architecture Evidence

| Item | Required | Status |
|---|---|---|
| ISMS app description updated with legacy harvest section (§16) | YES | [x] DONE |
| Pre-build harvest package complete (9 artifacts under `modules/isms/prebuild-harvest-package/`) | YES | [x] DONE |
| Route boundary map present and aligned with App.tsx implementation | YES | [ ] Verify after ui-builder |
| Module-card inventory aligned with actual cards on page | YES | [ ] Verify after ui-builder |
| harvest-map.md classifications reflect actual implementation | YES | [ ] Verify after ui-builder |

---

## 7. Governance Artifact Evidence

| Item | Required | Status |
|---|---|---|
| `.admin/prs/pr-1646.json` committed | YES | [x] DONE |
| `.agent-admin/scope-declarations/pr-1646.md` committed | YES | [x] DONE |
| `wave-current-tasks-isms-public-landing-harvest.md` committed | YES | [x] DONE |
| IAA pre-brief wave record at `.agent-admin/assurance/iaa-wave-record-isms-public-landing-harvest-20260514.md` | YES | [ ] Pending IAA |
| IAA final assurance token in wave record `## TOKEN` section | YES | [ ] Pending IAA final |
| Foreman session memory committed | YES | [ ] Phase 4 |
| PREHANDOVER proof committed | YES | [ ] Phase 4 |

---

## 8. Acceptance Criteria from Issue #1645

| Acceptance Criterion | Status |
|---|---|
| ISMS app description is updated with the legacy pre-subscription harvest authority section | [x] DONE |
| Legacy source files are explicitly listed and classified as harvest/adapt/defer/discard | [x] DONE — harvest-map.md |
| Public/private route boundary is documented | [x] DONE — route-boundary-map.md |
| Pre-build package exists before implementation | [x] DONE — modules/isms/prebuild-harvest-package/ |
| Public ISMS landing page harvest plan is approved | [x] DONE — harvest-map.md §2.1 |
| Module marketing page harvest plan is approved | [x] DONE — harvest-map.md §2.4 |
| Implementation provides public module-card navigation and marketing pages | [ ] Pending ui-builder |
| MMM is correctly linked as Maturity Roadmap/MMM module | [ ] Pending ui-builder |
| Free assessment remains tied to MMM/Maturity Roadmap | [ ] Pending ui-builder |
| Marketing routes are public/unauthenticated | [ ] Pending ui-builder |
| Production deployment passes | [ ] Pending deployment |
| Screenshot evidence is attached | [ ] Pending ui-builder |

---

## 9. Handover Blockers

Any of the following conditions BLOCKS handover until resolved:

| Blocker | Resolved |
|---|---|
| Build fails | [ ] Verify |
| TypeScript errors | [ ] Verify |
| Any marketing route wrapped in ProtectedRoute | [ ] Verify |
| Missing screenshot evidence | [ ] Verify |
| IAA token pending/absent | [ ] Verify |
| PREHANDOVER proof absent | [ ] Phase 4 |
| Scope declaration does not match diff | [ ] Verify |

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
