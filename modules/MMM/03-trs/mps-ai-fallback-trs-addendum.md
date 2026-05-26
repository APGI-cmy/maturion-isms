# MMM TRS Addendum — MPS AI Fallback Resilience

## TR-MMM-AI-FB-01 — Fallback execution path

`useAIMPSGeneration` shall return a valid `GeneratedMpsDraft[]` fallback payload when AI generation cannot complete successfully.

## TR-MMM-AI-FB-02 — Severity classification

Fallback outcomes shall be classified as `warning` UX state (non-blocking), while true action blockers (save failure, unrecoverable generation failure) remain `error`.

## TR-MMM-AI-FB-03 — Message normalization

Fallback warning text shall be normalized to user-safe copy and must not leak raw edge-function transport strings.

## TR-MMM-AI-FB-04 — Regression gate

Automated tests shall assert:

1. AI error path produces fallback list.
2. Warning banner is shown (`mps-generation-warning`).
3. Error banner (`mps-generation-error`) is not shown for fallback success.
