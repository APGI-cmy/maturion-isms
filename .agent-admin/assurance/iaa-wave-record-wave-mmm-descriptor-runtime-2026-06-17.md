# IAA Wave Record - MMM Descriptor Runtime

Wave: `wave-mmm-descriptor-runtime-2026-06-17`
Date: 2026-06-17
Repository: `APGI-cmy/maturion-isms`
Scope record: `.agent-admin/scope-declarations/wave-mmm-descriptor-runtime-2026-06-17.md`

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-descriptor-runtime-2026-06-17"
  pr: "1825"
  issue: "MMM descriptor-runtime recovery after PR #1818 closure"
  branch: "foreman/mmm-descriptor-runtime-clean"
  qualifying_tasks:
    - "Correct MMM descriptor sentence reconstruction for contextual qualifier criteria."
    - "Correct descriptor learning consent to operate independently per maturity level."
    - "Preserve descriptor editor availability after save absent explicit second-level sign-off lock."
  required_build_gates:
    - "Scope restricted to the two MMM product files declared in the wave scope record."
    - "QA-to-red behavior captured in MMM B4 framework domain-workflow behavior tests."
    - "No workflow, deployment, dashboard, PIT, CodeQL, shell, subscription, or onboarding changes."
  expected_qa_scope:
    - "T-MMM-DMC-044: contextual qualifier criterion reconstructs a single grammatical evidence clause."
    - "T-MMM-DMC-043: Basic and Reactive descriptor edits trigger independent per-level prompts."
    - "T-MMM-DMC-043b: descriptor edit affordance remains usable after save and can invoke a second save."
  high_risk_failure_modes:
    - "Mechanical concatenation leaves malformed multi-sentence descriptor text."
    - "Criterion-level consent suppresses later maturity-level learning prompts."
    - "Descriptor edit UI becomes unavailable after first save without an explicit sign-off lock."
    - "Replacement branch imports governance/admin artifacts from polluted PR history."
    - "Implementation commit occurs before pre-brief and builder appointment proof exists."
  required_builder_evidence:
    - "Diff limited to `apps/mmm/src/components/assessment/CriteriaManagement.tsx` and `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`."
    - "Builder notes identify descriptor sentence reconstruction behavior and per-level consent behavior."
    - "Test evidence states the MMM B4 domain-workflow test command used and observed result."
  required_foreman_qp_checks:
    - "Verify changed files remain inside declared two-file product scope."
    - "Verify descriptor text reads as coherent evidence sentence for contextual qualifier criterion."
    - "Verify Basic and Reactive consent prompts are independently keyed."
    - "Verify edit affordance remains available after save absent explicit lock."
    - "Verify no later-lane language or artifacts are introduced before lane gates apply."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Governance order proof and bounded file scope."
    - "Behavioral coverage for descriptor reconstruction and per-level prompt independence."
    - "Absence of unrelated deployment or governance artifact drift."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
