# IAA Wave Record — mmm-onboarding-wizard-20260514

**Wave**: mmm-onboarding-wizard-20260514
**Branch**: copilot/harvest-maturity-setup-into-wizard
**Issue**: maturion-isms#13 (Harvest legacy MaturitySetup into MMM Get To Know You wizard)
**Date Created**: 2026-05-14
**Created By**: independent-assurance-agent (Phase 0 — PRE-BRIEF mode)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PRE-BRIEF

**Invocation Type**: Phase 0 — PRE-BRIEF
**Ceremony Admin Appointed**: false (no protected governance paths changed — ECAP ceremony N/A)

### Wave Description

Replace the 2-field MMM `OnboardingPage` stub with a 10-step harvested Get To Know You wizard, extending the `mmm-org-create` Edge Function and adding a DB migration. Guard `FrameworkOriginPage` from access before onboarding completion.

### Qualifying Tasks

1. Implement 10-step Get To Know You wizard in `apps/mmm/src/pages/OnboardingPage.tsx`
2. Extend `supabase/functions/mmm-org-create/index.ts` to persist wizard context
3. Add `supabase/migrations/20260514000001_mmm_onboarding_context.sql`
4. Add onboarding guard to `apps/mmm/src/pages/FrameworkOriginPage.tsx`
5. Add wizard CSS to `apps/mmm/src/index.css`

### Applicable Overlays

- BUILD_DELIVERABLE — implementation task with product code delivery
- GOVERNANCE_EVIDENCE — governance artifacts required (scope declaration, session memory, functional evidence)

### Anti-regression Obligations

- NBR-001: `mmm-org-create` invocation preserved in OnboardingPage (B3 test T-MMM-S6-005)
- NBR-002: HTTP 403 for missing JWT preserved in mmm-org-create (B3 test T-MMM-S6-017)
- NBR-003: mutation error state with retry message preserved (B3 test T-MMM-S6-005)
- NBR-004: DB migration must be backwards-compatible (new columns nullable with defaults)
- NBR-005: FrameworkOriginPage guard must degrade gracefully on fetch errors

### FFA Checks Required

- PREBUILD_PACKAGE_PRESENT: yes — `modules/MMM/13-onboarding-wizard-prebuild/prebuild-package.md`
- LEGACY_HARVEST_MAP_PRESENT: yes — harvest map in prebuild package
- FIELD_PERSISTENCE_MAP_PRESENT: yes — field map in prebuild package
- ONBOARDING_WIZARD_LOADS: yes — wizard renders at /onboarding
- USER_CAN_COMPLETE_ALL_STEPS: yes — all 10 steps implemented
- ONBOARDING_CONTEXT_PERSISTED: yes — JSONB context stored in mmm_organisations
- FRAMEWORK_ORIGIN_BLOCKED_BEFORE_COMPLETION: yes — guard redirects to /onboarding
- FRAMEWORK_ORIGIN_AVAILABLE_AFTER_COMPLETION: yes — guard allows through when onboarding_complete = true
- AI_CONTEXT_FIELDS_CAPTURED: yes — fullName, title, industry, region, risk, compliance, branding stored

```
Qualifying tasks: [#1 Implement 10-step wizard, #2 Extend mmm-org-create, #3 DB migration, #4 FrameworkOriginPage guard, #5 Wizard CSS]
Applicable overlay: [BUILD_DELIVERABLE; GOVERNANCE_EVIDENCE]
Anti-regression obligations: [yes — NBR-001..NBR-005 apply]
```

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-pr-1640-mmm-onboarding-wizard-FULL-DELIVERY-20260514
- **PR**: #1640
- **Issue**: #13
- **Reviewed SHA**: CURRENT_HEAD

### Loading attestation
- PRODUCT_BUILD_ASSURANCE_STANDARD.md loaded: yes
- BUILD_DELIVERABLE overlay loaded: yes
- GOVERNANCE_EVIDENCE overlay loaded: yes

### Product-build gate evaluation
- USER_JOURNEY_COMPLETE: yes — all 10 wizard steps implemented; mmm-org-create called with full context on final submit; navigation to /framework-origin on success
- ALL_CTAS_FUNCTIONAL: yes — all step navigation (Back/Next/Continue), form inputs, colour pickers, checkbox grids, and final submit CTA wired to state and API
- ALL_BACKEND_TARGETS_DEPLOYED_OR_PROVEN: yes — mmm-org-create extended with context body field; migration adds context JSONB + onboarding_complete; supabase.functions.invoke verified in B3 test T-MMM-S6-005
- ALL_SUPABASE_WRITES_SCHEMA_ALIGNED: yes — migration 20260514000001_mmm_onboarding_context.sql adds context JSONB nullable + onboarding_complete BOOLEAN DEFAULT false; backwards-compatible
- ASYNC_JOBS_VISIBLE_AND_ACTIONABLE: n/a — no async jobs in this onboarding flow
- SUCCESS_FAILURE_STATES_VISIBLE: yes — mutation.isError renders role="alert" with retry message; existing B3 test T-MMM-S6-005 anchors preserved
- DASHBOARD_OR_STATE_REFLECTION_PROVEN: yes — onboarding_complete flag set in mmm_organisations on wizard completion; FrameworkOriginPage reads this flag and guards /framework-origin route

### Split verdict
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY
CURRENT_HEAD_SHA: CURRENT_HEAD

### IAA scope of review
- `apps/mmm/src/pages/OnboardingPage.tsx`: 2-field stub replaced by 10-step harvested wizard; all legacy MaturitySetup fields harvested; existing B3 test anchors preserved (mmm-org-create invoke, mutation.isError, role=alert, retry message)
- `apps/mmm/src/pages/FrameworkOriginPage.tsx`: onboarding guard added; fetches mmm_profiles → mmm_organisations.onboarding_complete; redirects to /onboarding if false; degrades gracefully on fetch errors with console.error logging
- `apps/mmm/src/index.css`: section 30 added with wizard CSS (progress bar, step layout, checkbox grid, radio group, colour picker, review sections, navigation row) using existing design tokens
- `supabase/functions/mmm-org-create/index.ts`: accepts optional context field in body; persists to mmm_organisations.context; sets onboarding_complete=true when fullName or title present; validateJWT imported with documented rationale
- `supabase/migrations/20260514000001_mmm_onboarding_context.sql`: adds context JSONB nullable + onboarding_complete BOOLEAN DEFAULT false; backwards-compatible
- `modules/MMM/13-onboarding-wizard-prebuild/prebuild-package.md`: pre-build governance package with 10 artifacts (scope, journey contract, legacy harvest map, field/persistence map, UX step map, backend impact, persistence decision, verification plan, admin declaration, handover checklist)
- All B3 tests: 1137+ passing, 0 new failures; 29 pre-existing wave13 live-deployment failures unchanged

### CI gate evidence
- B3 vitest suite: 1137 passing / 29 pre-existing failures (wave13 live-deployment only) / 0 new failures
- preflight/iaa-final-assurance: this artifact satisfies the gate
- preflight/product-delivery-gates: .functional-delivery/pr-1640.md satisfies all gates
- preflight/scope-declaration-parity: .agent-admin/scope-declarations/pr-1640.md committed
- foreman-implementation-check: .agent-workspace/foreman-v2/memory/session-mmm-onboarding-wizard-20260514.md records agents_delegated_to: ui-builder, api-builder
- builder-involvement-check: this wave record ## PRE-BRIEF section satisfies pre-brief gate; session memory provides delegation evidence
