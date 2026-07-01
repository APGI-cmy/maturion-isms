# Wave Current Tasks — foreman-v2-agent

Wave: wave-mmm-descriptor-hardening-retry-2026-07-01
Session ID: session-mmm-descriptor-hardening-retry-20260701
Date: 2026-07-01
Branch: apgi-cmy-fix-descriptor-gerund-normalization
Issue: #1883 — [Agent Task] MMM descriptor generation hardening with governed prebuild flow
PR: #1893
CS2 Authorization: Confirmed via issue #1883 opened by @APGI-cmy and assigned to Copilot.
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-hardening-retry-2026-07-01.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-hardening-retry-2026-07-01.md
implementation_plan_path: modules/MMM/07-implementation-plan/implementation-plan.md
builder_checklist_path: modules/MMM/09-builder-checklist/builder-checklist.md
qa_to_red_path: modules/MMM/05-qa-to-red/descriptor-hardening-retry-qa-to-red-2026-07-01.md
builder_appointment_path: .agent-admin/builder-appointments/wave-mmm-descriptor-hardening-retry-2026-07-01.md
delegation_order_path: .agent-admin/control/delegation-orders/pr-1893.json
ceremony_admin_appointed: true

## Wave objective

Retry MMM descriptor hardening after revert commit `41d7503c`, using full prebuild governance order:
canonical IAA pre-brief -> builder appointment -> first implementation commit.

## Active task sequence

1. ✅ Foreman preflight lock (Tier 1/Tier 2, canon inventory, FAIL-ONLY-ONCE, merge-gate checks loaded)
2. ✅ Scope declaration refreshed for retry wave
3. ✅ QA-to-Red acceptance criteria defined for retry
4. ✅ IAA pre-brief invocation and canonical wave-record completion
5. ✅ Builder appointment package prepared (pre-implementation only)
6. ✅ PR #1893 created and PR-scoped delegation-order path initialized
7. ✅ Builder implementation delegated after order-gate prerequisites
8. ✅ Builder handover received (commit `df00d65a`)
