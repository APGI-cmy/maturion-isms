# Wave Review Gate — Wave 3

```yaml
wave_review_gate:
  wave: "Wave 3 — Prove delegation timing, not just delegation existence"
  objective_met: true
  exit_criteria_met: true
  overreach_checked: true
  overreach_found: true
  correction_applied: true
  unresolved_drift:
    - "Foreman/builder contract-body integration is deferred to Wave 5."
    - "Merge-gate required-check inventory is deferred to Wave 6."
    - "No generic waiver field exists in delegation-order.json; explicit CS2 waiver must be recorded outside the artifact if ever required."
  control_deletions_relocated: not_applicable
  rollback_or_correction_needed: false
  next_wave_allowed: true
  reviewer: "ChatGPT / CS2-directed cleanup review"
  date: "2026-06-15"
```

## Review notes

Initial Wave 3 implementation proved ancestry but allowed same-commit proof. Same-commit proof is insufficient because a commit containing both delegation evidence and implementation cannot prove delegation happened before implementation.

Correction applied:

- Enforced `prebrief_commit_sha !== builder_appointment_commit_sha`.
- Enforced `builder_appointment_commit_sha !== first_implementation_commit_sha`.
- Enforced strict ancestry from pre-brief commit to builder appointment commit.
- Enforced strict ancestry from builder appointment commit to first implementation commit.
- Added explicit STOP-AND-FIX guidance on failure.
- Updated the Wave 3 overlay to document strict ordering and no same-commit proof.
- Kept waiver authority outside `delegation-order.json`; the artifact remains proof-only.

Exit criteria status:

- CI checks that delegation evidence predates first implementation file change: true.
- Retroactive delegation artifacts fail or warn with explicit STOP-AND-FIX guidance: true.
- Wave Review Gate recorded before Wave 4 starts: true.

Wave 4 may begin after CS2 accepts this correction posture.
