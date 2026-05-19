# IAA Wave Record — build-to-green-5domain-workspace-20260519

**Wave ID**: build-to-green-5domain-workspace-20260519
**Date**: 2026-05-19
**PR**: #1683
**Issue**: #1682 — Build 5-domain framework configuration workspace after RED/pre-build alignment
**Branch**: copilot/build-to-green-runtime-fix
**Producing Agent (expected)**: ui-builder (delegated by foreman-v2-agent)
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

**Produced by**: independent-assurance-agent
**Date**: 2026-05-19
**Action**: PRE-BRIEF
**Status**: COMPLETE

```
Qualifying tasks:
  1. Implement 5-domain canonical dashboard cards on AssessmentFrameworkHandoffPage.tsx
     (Leadership and Governance, Process Integrity, People and Culture, Protection,
     Proof It Works) — replaces raw harvested domain list
  2. Implement DomainWorkspacePage.tsx (new transitional route for domain click-through)
  3. Register /assessment/framework/domain/:domainId route in App.tsx
  4. Update useFrameworkHandoffContext.ts to support 5-domain mini-dashboard metadata
  5. Add new B4 RED→GREEN tests (new T-MMM-S6-183+ range) for 5-domain workspace
  6. Update scripts/mmm-live-dashboard-diagnosis/verify-mmm-modes.mjs for 5-card assertion
  7. Update modules/MMM/BUILD_PROGRESS_TRACKER.md to record RED finding and wave state
  8. Create .agent-admin/scope-declarations/pr-1683.md
  9. Update .agent-workspace/foreman-v2/personal/wave-current-tasks.md to new wave
     (currently stale — still shows wave pr1676-foreman-contract-hardening)

Applicable overlay:
  PRIMARY: PRODUCT_BUILD_ASSURANCE (product-facing BUILD/T2 — UI/app behaviour delivery)
    → PRODUCT_BUILD_ASSURANCE_STANDARD.md mandatory loading at Phase 3
    → BD-000 through BD-024 + FFA summary apply
    → NBR functional-behaviour pattern checks at Step 3.1 apply
  SECONDARY: PRE_BUILD_STAGE_MODEL (BUILD_PROGRESS_TRACKER.md modified)
    → OVL-PBG series applicable to tracker update accuracy
  CLASSIFICATION: MIXED (both triggers present) — IAA mandatory, no exemption path

Anti-regression obligations:
  YES — FUNCTIONAL-BEHAVIOUR-REGISTRY.md applies:
  NBR-001: TanStack Query cache invalidation — applies IF any useMutation is introduced
    (currently useFrameworkHandoffContext.ts is read-only; no mutation path declared for
    this wave. If mutation is added → NBR-001 mandatory check)
  NBR-003: Zustand store reset — applies IF any Zustand store slice is introduced or
    modified for domain workspace state scope management (DomainWorkspacePage.tsx scoped
    flow is a candidate). IAA will verify reset mechanism at route unmount.
  NBR-005: Schema migration column mismatch — NOT applicable (no schema changes in scope)
  NBR-002: RLS silent write block — NOT applicable (no Supabase write operations in scope)
  NBR-004: Optimistic update rollback — NOT applicable (no optimistic mutations in scope)

  ANTI-REGRESSION HAZARD (PRE-BRIEF FLAG):
  Existing test T-MMM-S6-179 asserts:
    expect(src).toContain('Back to Frameworks')
  If the builder replaces ALL instances of "Back to Frameworks" text with "Back to Review
  Framework", this test will FAIL → 115 currently-passing tests will no longer all pass.
  Resolution: preserve "Back to Frameworks" in error-state recovery links (missing
  framework_id error block) — change only the workspace-level navigation CTA. Foreman
  must include this in builder delegation brief.
```

---

## TOKEN

*To be populated by IAA after Phase 3 assurance at PR handover.*

---

## REJECTION_HISTORY

*To be populated if any REJECTION-PACKAGE is issued for this wave.*
