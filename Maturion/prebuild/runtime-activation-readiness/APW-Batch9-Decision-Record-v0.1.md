# APW Batch 9 Decision Record v0.1

Status: Draft decision record
Date: 2026-07-02
Authority: CS2 - Johan Ras

## Decision question

Should APW Specialist public integration move beyond controlled preview?

## Evidence standard

The Batch 8 runbook requires a preview record with target environment, health check result, prompt and route samples, rollback result, and reviewer decision.

## Evidence currently verified in this PR

Batch 8 has been merged. The preview runbook and automated tests exist. A completed live preview record has not yet been verified in this PR.

## Decision state

DEFERRED_PENDING_PREVIEW_EVIDENCE

## Reason

The available evidence is sufficient to confirm the controlled preview package, but not sufficient to approve broader use.

## Boundary

No runtime setting is changed by this decision record. Maturion remains the final public response authority. APW Specialist remains behind Maturion.

## Next step

Capture the required preview evidence, then open a separate enablement decision if CS2 approves.
