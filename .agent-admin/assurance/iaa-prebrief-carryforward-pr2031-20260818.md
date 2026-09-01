# PR-Scoped IAA Pre-Brief Carry-Forward Acknowledgment — PR #2031 (Issue #2030 / #2025)

PR: #2031
WAVE_TASKS_PATH: .agent-admin/prs/pr-2031/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD

## PRE-BRIEF

The canonical IAA_PREFLIGHT_BRIEF content (scope, acceptance contract, risk register) for this wave
is reaffirmed, unchanged, from `.agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md`,
carried forward into PR #2031's own commit ancestry below. This heading exists so this PR-scoped
artifact is machine-detectable as the active, current-head-bound IAA pre-brief for PR #2031 (see
`.agent-admin/prs/pr-2031/active-state.json` -> `iaa_artifact_path`), rather than requiring a
repo-wide fallback scan of historical `.agent-admin/assurance/` artifacts belonging to other PRs.

```yaml
carry_forward_acknowledgment:
  pr_number: 2031
  wave_id: "issue-2025-fix-organisation-context-mixed-document"
  canonical_prebrief_source: ".agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md"
  canonical_prebrief_original_commit_sha_pr2026: "51385abb25808e717df751a4a925a32e78da617"
  reaffirmed_for_pr: 2031
  reaffirmed_timestamp: "2026-08-18T17:00:00Z"
  reaffirming_agent: "foreman-v2-agent"
  reason: >
    PR #2026 (the original governed delivery vehicle for the same IAA pre-brief) was merged to
    main out-of-band (merge commit ed22c9a2) before the governed reconciliation/final-assurance
    chain completed, on content that was NOT the governed chain (see
    .agent-admin/prs/pr-2026/wave-current-tasks.md, BLK-2025-01/BLK-2025-02). This PR (#2031) is
    opened fresh against current main to carry the fully governed, QP-verified fix forward. The
    canonical IAA pre-brief content (scope, acceptance contract, risk register) governing this
    work is unchanged and is reaffirmed here, ahead of any implementation commit, to establish a
    PR-#2031-scoped, verifiably-ordered delegation record satisfying
    preflight/delegation-order-gate.
```

## Reaffirmed pre-brief scope (verbatim carry-forward, unchanged)

See `.agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md` for the full canonical
IAA_PREFLIGHT_BRIEF content. This reaffirmation does not alter, narrow, or widen that scope. It
exists solely to establish, within PR #2031's own commit ancestry, that the canonical pre-brief
precedes builder appointment which precedes implementation — required by
`.github/scripts/delegation-order-gate.js`.
