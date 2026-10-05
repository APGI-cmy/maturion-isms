# Active-CS2 — Evidence Review and Correction Protocol

## Review target

Review only bounded evidence returned for the active wave:

- Foreman QP result
- ECAP administrative validation when required
- independent final IAA result
- current checks/conflict/base-sync evidence
- reviewed-content fingerprint and any bounded token-only evidence delta

## Stage-aware rule

Initial dispatch and pre-brief must not require their own future final evidence. Evidence requirements increase only with stage progression.

## Findings packet

When evidence fails, return a packet naming:

- failed obligation
- exact evidence path or check
- owner (`Foreman`, `specialist`, `ECAP`, `human CS2`)
- required re-entry stage
- whether the defect is ordinary remediation or a reserved matter

## Routing boundary

- Ordinary implementation or evidence defects return to Foreman.
- Protected authority, new cost/credential, breaker reset, destructive action, and constitutional ambiguity escalate to human CS2.
- IAA is never used as a correction owner.

## Dedup identity: same finding + same reviewed content

Every findings packet and every escalation is keyed by a stable **rejection fingerprint** = `hash(failed_obligation, reviewed_content_sha256)` (the reviewed-content identity is the job-wave schema's `evidenceBinding.frozen_substantive_fingerprint` / event `evidence_binding`, never a token-only append).

- The **first** observation of a given rejection fingerprint produces exactly **one** findings packet (ordinary) or exactly **one** escalation (reserved matter), recorded as a durable event with `decision: REJECTED`.
- Any **later** observation of the **same rejection fingerprint** against the **same reviewed-content fingerprint** (no change to `reviewed_content_sha256`, `base_sha`, policy, authority, dependencies, or gate results) is a **duplicate**, not a new defect: it is recorded as `decision: NO_OP` using the same `idempotency_key` as the original. It never re-invokes IAA, never re-invokes ECAP, never produces a second findings packet, a second escalation, or a new PREHANDOVER/proof artifact.
- This applies symmetrically to ordinary Foreman findings and to human-CS2 escalations: **exactly one escalation** is ever emitted per genuine protected/external/canon-conflict blocker while the wave remains `BLOCKED` and the underlying content is unchanged.

## Re-entry on real substantive change

A wave only leaves `CORRECTION` for re-review when the reviewed-content fingerprint actually changes materially (job-wave schema `delta_class: SUBSTANTIVE`, i.e. a new `reviewed_content_sha256` that is not merely a token-only/admin append per `evidenceBinding.token_only_delta_verified`).

- A genuine substantive change permits **exactly one** re-entry event (`decision: ACCEPTED`, `state_after` moving from `CORRECTION` back to the review/IAA stage) and **one** fresh independent final-IAA request bound to the new fingerprint.
- A token-only or administrative-only append (`delta_class: ADMIN_TOKEN_ONLY`) never triggers re-entry, never consumes a re-entry attempt, and never re-invokes IAA/ECAP.
- Re-entry still counts against the approved `max_material_corrections` envelope limit (W0 baseline: one). Exhausting it without resolution is itself a typed refusal (`BUDGET_EXHAUSTED`), not grounds to bypass the dedup rule above.
