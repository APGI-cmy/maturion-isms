# IAA Wave Record - ISMS PIT Entitlement Handoff

Wave: `wave-isms-pit-entitlement-handoff-20260626`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
Scope record: `.agent-admin/scope-declarations/wave-isms-pit-entitlement-handoff-20260626.md`

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-isms-pit-entitlement-handoff-20260626"
  pr: "1861"
  issue: "ISMS to PIT entitlement loop"
  branch: "fix-pit-entitlement-loop-gated"
  qualifying_tasks:
    - "Fix ISMS-owned PIT checkout selection and entitlement handoff."
  required_build_gates:
    - "Builder Delegation Order Gate"
    - "POLC Boundary Validation"
  expected_qa_scope:
    - "Completed project-implementation checkout grants PIT entitlement."
    - "Entitled users reach /pit/tracker without subscription loopback."
  high_risk_failure_modes:
    - "Captured-but-incomplete checkout is treated as entitlement."
    - "ISMS change drifts into PIT runtime ownership."
  required_builder_evidence:
    - "Diff limited to declared ISMS portal files and build evidence."
    - "Regression tests cover PIT entitlement mapping and stored completed checkout."
  required_foreman_qp_checks:
    - "Verify bounded scope and no PIT runtime implementation."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Boundary discipline and entitlement handoff evidence."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```

## FINAL ASSURANCE

PENDING.
