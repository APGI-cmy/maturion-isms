# Active-CS2 — Merge and Refusal Protocol

## Merge prerequisites

Routine merge is permitted only when all of the following are true:

1. A versioned machine-readable merge policy exists for the repository/branch/path/job/wave.
2. Required checks are current and passing.
3. Final independent IAA assurance binds the reviewed content.
4. No unresolved substantive review thread or merge conflict remains.
5. Fresh head/base validation and compare-and-set merge binding succeed.
6. No envelope breach, breaker condition, reserved matter, or authority/safety self-change is present.

## Current bundle truth

This PR creates contract and knowledge readiness only. The merge-policy interface, compare-and-set merge action, and uncertain-outcome reconciliation runtime do not exist in this bundle. Therefore the truthful current merge outcome is `TYPED_REFUSAL: RUNTIME_NOT_IMPLEMENTED`.

## Refusal minimum content

Every refusal must name the code, blocking condition, evidence source, owner, and next required action. Unknown or unverifiable values fail closed.

## Rejected / missing / stale IAA (HALT-ACS2-006, ACS2-NO-REJECTED-IAA-MERGE-001)

Prerequisite 3 above ("final independent IAA binds the reviewed content") is never satisfied by anything less than a current final IAA PASS bound to the exact reviewed-content fingerprint. The following observed states are each a **typed refusal**, not a partial pass:

| Observed IAA state | Typed refusal code (from the approved merge-policy `refusal_codes` vocabulary — no new code is invented) | Resulting wave status |
|---|---|---|
| IAA issued a REJECTION-PACKAGE for the reviewed content | `MATERIAL_BLOCKER` | `CORRECTION` (ordinary correctable) or `BLOCKED` (protected/external/canon-conflict) |
| No final IAA verdict exists yet for the reviewed content (pre-brief only, or no invocation) | `GATE_UNSATISFIED` | `CORRECTION` or current pre-merge status unchanged — never advanced |
| A prior final IAA PASS exists but no longer binds the current reviewed-content fingerprint (stale/superseded head, policy, dependency, or gate result) | `EVIDENCE_STALE` | `CORRECTION` |

In every one of these states:

1. **No completion handover** is issued to Foreman or recorded as PR-scoped PREHANDOVER readiness beyond "typed refusal pending correction/escalation".
2. **No merge** occurs through the routine or any other interface.
3. **No successor-wave dispatch** occurs — `current_wave_id` is not advanced and no later wave in `depends_on` order is released.
4. The wave remains `CORRECTION` (ordinary remediation owed to Foreman) or `BLOCKED` (reserved matter escalated to human CS2) per the job-wave schema's `wave.status` enum — never `MERGE_ELIGIBLE`, `MERGED`, `VALIDATED`, or `COMPLETE`.

This rule binds regardless of how many times the same rejected/missing/stale condition is observed for the same reviewed-content fingerprint — see the dedup and re-entry rules in `evidence-review-and-correction-protocol.md`, which this protocol incorporates by reference for merge-stage findings and escalations.
