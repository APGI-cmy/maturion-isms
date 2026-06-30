# IAA Wave Record - ISMS MMM Routing Handoff

Wave: `wave-isms-mmm-routing-handoff-20260630`
Date: 2026-06-30
Scope record: `.agent-admin/scope-declarations/wave-isms-mmm-routing-handoff-20260630.md`

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-isms-mmm-routing-handoff-20260630"
  pr: "1876"
  issue: "Entitled Maturity Roadmap users land on ISMS preview instead of MMM app"
  branch: "isms-mmm-routing-gated"
  qualifying_tasks:
    - "Route entitled ISMS Maturity Roadmap entries to MMM app host."
    - "Keep non-entitled users on ISMS-owned acquisition paths."
  required_build_gates:
    - "Builder Delegation Order Gate"
    - "POLC Boundary Validation"
  expected_qa_scope:
    - "Dashboard Maturity Roadmap opens MMM for entitled user."
    - "Modules page Maturity Roadmap opens MMM for entitled user."
    - "Non-entitled Maturity Roadmap remains in ISMS marketing/subscription path."
  high_risk_failure_modes:
    - "ISMS implements MMM runtime behavior."
    - "Non-entitled users bypass ISMS acquisition."
  required_builder_evidence:
    - "Diff remains limited to ISMS routing and evidence files."
    - "MMM runtime files remain untouched."
  required_foreman_qp_checks:
    - "Verify boundary discipline and route helper tests."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "ISMS handoff only; MMM runtime untouched."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```

## FINAL ASSURANCE

PENDING.
