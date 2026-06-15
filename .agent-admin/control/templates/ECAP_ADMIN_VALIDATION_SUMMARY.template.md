# ECAP Administrative Validation Summary

```yaml
ecap_admin_validation:
  schema_version: "1.0.0"
  wave_id: "<wave-id>"
  pr_number: <number-or-null>
  ecap_session_id: "<session-id>"
  validation_scope:
    - "artifact path resolution"
    - "scope declaration freshness"
    - "PR admin JSON freshness"
    - "commit-state verification"
  admin_checks:
    artifact_paths_resolved: true/false
    scope_declaration_current: true/false
    pr_admin_json_current: true/false
    commit_state_verified: true/false
  artifact_paths_resolved: true/false
  scope_declaration_current: true/false
  pr_admin_json_current: true/false
  commit_state_verified: true/false
  substantive_readiness_judgment_made: false
  iaa_invoked_by_ecap: false
  foreman_qp_judgment_rewritten: false
  admin_validation_result: ADMIN_VALIDATED | ADMIN_BLOCKED
  blocking_admin_findings:
    - "<admin finding or none>"
```

## Output boundary

ECAP may report administrative validation only.

Allowed result language:

- `ADMIN_VALIDATED`
- `ADMIN_BLOCKED`
- `READY_FOR_FOREMAN_ADMIN_REVIEW`

Forbidden result language:

- `ready for IAA`
- `ready for merge`
- `build ready`
- `implementation complete`
- `ASSURANCE-TOKEN`
- `REJECTION-PACKAGE`

ECAP must not make substantive build-readiness, quality, merge-readiness, or final-assurance judgments.
