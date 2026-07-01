# IAA Wave Record — wave-mmm-descriptor-hardening-retry-2026-07-01

wave: wave-mmm-descriptor-hardening-retry-2026-07-01
date: 2026-07-01
repository: APGI-cmy/maturion-isms
branch: apgi-cmy-fix-descriptor-gerund-normalization
issue: "#1883 — [Agent Task] MMM descriptor generation hardening with governed prebuild flow"
pr: PENDING
ceremony_admin_appointed: PENDING (determine post-QP)

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-descriptor-hardening-retry-2026-07-01"
  pr: "PENDING"
  issue: "#1883 — [Agent Task] MMM descriptor generation hardening with governed prebuild flow"
  branch: "apgi-cmy-fix-descriptor-gerund-normalization"
  qualifying_tasks:
    - task_id: "TASK-MMM-DHR-004"
      summary: "IAA PRE-BRIEF committed in wave record before builder execution."
      assurance_category: "PRE_BUILD_STAGE_MODEL"
    - task_id: "TASK-MMM-DHR-008"
      summary: "Builder execution delegated for descriptor hardening implementation after order-gate prerequisites."
      assurance_category: "PRODUCT_BUILD_ASSURANCE"
  required_build_gates:
    - "Order gate enforced: pre-brief commit -> builder appointment commit -> first implementation commit."
    - "Implementation scope limited to authorized files only: apps/mmm/src/components/assessment/CriteriaManagement.tsx and modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx."
    - "No .github/agents changes and no unrelated CI/deployment/routing/module work."
    - "Authorized test target must pass with deterministic assertions and no skipped/todo tests."
  expected_qa_scope:
    - "No criterion-specific hardcoded template mapping in descriptor generation."
    - "Coherent fallback semantics preserved when scoped subject knowledge is missing or partial."
    - "Gerund-led criteria normalized to evidence-state phrasing while preserving intent."
    - "Scoped MMM grounding remains active with deterministic fallback behavior."
  high_risk_failure_modes:
    - "Hardcoded criterion-identifier template mapping reintroduced in generation logic."
    - "Fallback output becomes contradictory, incomplete, or grammatically broken."
    - "Generated clauses retain literal gerund lead-ins (e.g., 'Evidence that Assessing...')."
    - "Regression tests are skipped/incomplete or non-deterministic."
  required_builder_evidence:
    - "Diff evidence removing criterion-specific branching from descriptor generation path."
    - "Regression test updates in modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx covering gerund normalization and fallback consistency."
    - "Command evidence for: pnpm exec vitest run --config vitest.mmm-b4.config.ts modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx."
  required_foreman_qp_checks:
    - "Verify TASK-MMM-DHR-004 completion and wave record canonical schema compliance."
    - "Verify order-gate sequence integrity before first implementation commit."
    - "Verify delegation-order artifact path initialization once PR number exists (TASK-MMM-DHR-007)."
    - "Verify ceremony_admin_appointed state is resolved and recorded before final handover bundle expectations."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm descriptor hardening behavior is generalized, deterministic, and non-template-specific."
    - "Confirm fallback coherence and scoped MMM grounding behavior with tests that assert user-visible correctness."
    - "Confirm wave artifacts and implementation evidence remain in-scope and order-gate compliant."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## PRE-BRIEF SUMMARY

Qualifying tasks: TASK-MMM-DHR-004, TASK-MMM-DHR-008
Applicable overlay: PRE_BUILD_STAGE_MODEL (+ PRODUCT_BUILD_ASSURANCE at final assurance)
Anti-regression obligations: yes — FUNCTIONAL-BEHAVIOUR-REGISTRY mandatory for BUILD/product-facing implementation checks.
