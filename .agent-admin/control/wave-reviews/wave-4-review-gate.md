# Wave Review Gate — Wave 4

```yaml
wave_review_gate:
  wave: "Wave 4 — Demote ECAP from readiness producer to admin validator"
  objective_met: true
  exit_criteria_met: true
  overreach_checked: true
  overreach_found: true
  correction_applied: true
  unresolved_drift:
    - "ECAP, Foreman, and IAA contract-body integration is deferred to Wave 5."
    - "Merge-gate required-check inventory is deferred to Wave 6."
    - "ECAP scanner validates output claims and boundary guidance, but does not yet perform full JSON Schema validation of embedded admin validation YAML/JSON."
  control_deletions_relocated: not_applicable
  rollback_or_correction_needed: false
  next_wave_allowed: true
  reviewer: "ChatGPT / CS2-directed cleanup review"
  date: "2026-06-15"
```

## Review notes

Initial Wave 4 implementation correctly separated ECAP admin validation from readiness authority, but the first scanner could flag control templates and overlays for listing forbidden language examples. That was too blunt and could fail the rule documentation itself.

Correction applied:

- Restricted forbidden readiness/assurance language scanning to ECAP output artifacts.
- Kept control overlays/templates/checklists/knowledge files in scope for admin-only boundary guidance.
- Supported both YAML and JSON-style boundary declarations.
- Renamed the allowed Foreman-review status from `READY_FOR_FOREMAN_ADMIN_REVIEW` to `ADMIN_READY_FOR_FOREMAN_REVIEW`.
- Clarified scanner scope in the Wave 4 overlay.

Exit criteria status:

- ECAP output is smaller and validation-focused: true by schema/template/overlay.
- Foreman does not depend on ECAP to create the substantive delivery story: true by overlay boundary.
- IAA reviews ECAP validation as admin evidence, not readiness authority: true by overlay boundary.
- Wave Review Gate recorded before Wave 5 starts: true.

Wave 5 may begin after CS2 accepts this correction posture.
