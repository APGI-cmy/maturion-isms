# IAA Wave Record — wave-mmm-descriptor-generation-hardening-2026-07-01

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-descriptor-generation-hardening-2026-07-01"
  pr: "PENDING"
  issue: "#1883 — descriptor generation hardening with governed prebuild flow"
  branch: "apgi-cmy-fix-descriptor-gerund-normalization"
  qualifying_tasks:
    - task_id: "2"
      summary: "Canonical IAA pre-brief in wave record"
      assurance_category: "PRE_BUILD_STAGE_MODEL"
    - task_id: "3"
      summary: "Builder appointment for hardening implementation scope"
      assurance_category: "PRE_BUILD_STAGE_MODEL"
    - task_id: "4"
      summary: "Hardening implementation (descriptor grounding + deterministic grammar normalization)"
      assurance_category: "PRODUCT_BUILD_ASSURANCE"
    - task_id: "5"
      summary: "Foreman QP review, ECAP admin validation, IAA final assurance"
      assurance_category: "MIXED"
  required_build_gates:
    - "Delegation order proof: pre-brief -> builder appointment -> first implementation commit"
    - "No foreman direct implementation; builder-only delivery ownership"
    - "Prebuild artifacts aligned and committed before delegation"
    - "Builder implementation to green with required MMM tests"
    - "IAA final assurance token required before PR open/merge flow"
  expected_qa_scope:
    - "Descriptor generation grounding path in apps/mmm CriteriaManagement"
    - "Deterministic gerund/grammar normalization output behavior"
    - "Regression coverage in modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx"
    - "Negative-path checks for malformed descriptor inputs and normalization stability"
  high_risk_failure_modes:
    - "Ungoverned foreman direct patch recurrence (LOCAL-GOV-2026-07-01-FOREMAN-DIRECT-IMPLEMENTATION)"
    - "Delegation-order breach (implementation commit before canonical pre-brief and appointment)"
    - "Descriptor output drift (non-deterministic grammar/gerund normalization)"
    - "Claimed green without complete MMM QA evidence"
  required_builder_evidence:
    - "Diff-limited implementation evidence for approved in-scope files"
    - "Test evidence for MMM workflow behavior suite (pass output and scope mapping)"
    - "Proof that descriptor normalization is deterministic across repeated runs"
    - "No out-of-scope governance/agent-contract edits"
  required_foreman_qp_checks:
    - "Verify gate_set_checked is explicit and complete in prehandover artifacts"
    - "Verify FILES_CHANGED/path/hash declarations are current and coherent across active bundle"
    - "Verify wave tracker and prehandover state are contradiction-free (no open [ ] declared complete)"
    - "Resolve ceremony_admin_appointed status from wave tracker before builder delegation"
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/builder-appointments/wave-mmm-descriptor-generation-hardening-2026-07-01.md"
    - ".agent-admin/control/delegation-order.json (ordered proof)"
    - "Tier 3 proof bundle including populated ECAP reconciliation summary"
    - "PREHANDOVER proof with active_bundle_iaa_coherence: VERIFIED and resolvable iaa_audit_token reference"
  final_iaa_focus:
    - "STOP-AND-FIX on any delegation-order, ceremony-coherence, or evidence-integrity breach"
    - "Functional confirmation that descriptor hardening behavior is deterministic and regression-safe"
    - "ACR integrity pass for ECAP-involved handover bundle before token issuance"
  result: PREFLIGHT_BRIEF_COMPLETE
```
