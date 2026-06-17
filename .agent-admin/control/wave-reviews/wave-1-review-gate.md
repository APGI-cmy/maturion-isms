# Wave Review Gate — Wave 1

```yaml
wave_review_gate:
  wave: "Wave 1 — Harmonize IAA pre-brief contract"
  objective_met: true
  exit_criteria_met: true
  overreach_checked: true
  overreach_found: true
  correction_applied: true
  unresolved_drift:
    - "Foreman/IAA broad contract simplification was reverted to pre-simplification blobs."
    - "Wave 1 scoped overlay now carries pre-brief-only alignment until scheduled contract simplification in Wave 5."
  control_deletions_relocated: not_applicable
  rollback_or_correction_needed: false
  next_wave_allowed: true
  reviewer: "ChatGPT / CS2-directed cleanup review"
  date: "2026-06-11"
```

## Review notes

Wave 1 originally overreached by rewriting and simplifying the Foreman and IAA contracts. That was outside the Wave 1 exit criteria and belonged to Wave 5.

Correction applied:

- Restored `.github/agents/foreman-v2-agent.md` to its pre-simplification blob.
- Restored `.github/agents/independent-assurance-agent.md` to its pre-simplification blob.
- Kept Wave 1 alignment in scoped control artifacts only:
  - `.agent-admin/control/schemas/iaa-preflight-brief.schema.json`
  - `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md`
  - `.agent-admin/control/overlays/WAVE1_IAA_PREFLIGHT_BRIEF_CONTRACT_ADDENDUM.md`
  - `.github/workflows/iaa-prebrief-contract-alignment.yml`
  - `.github/workflows/iaa-prebrief-inject.yml`

Scope decision:

- No final-assurance behavior changes are intended in Wave 1.
- No ECAP behavior changes are intended in Wave 1.
- No delegation-timing behavior changes are intended in Wave 1.
- No merge-gate semantic changes are intended in Wave 1, except pre-brief schema/artifact guidance.

Wave 2 may begin after CS2 accepts this correction posture.
