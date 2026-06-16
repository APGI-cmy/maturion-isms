# Agent Gate System Transition Notice — PR #1800

PR #1800 replaced the old admin-loop-prone governance gate model with the new waved Foreman / Builder / IAA / ECAP gate model.

Effective immediately, agents working on ISMS, MMM, PIT, or related modules must observe the following:

## 1. Implementation work is not handover

Implementation-only work must satisfy pre-brief and delegation-order requirements, but it must not be blocked by pre-handover approval before a handover/completion/readiness claim is made.

## 2. Handover language is gated

Do not use handover, complete, ready-for-review, merge-ready, released, or similar language unless the pre-handover lane gate is satisfied.

## 3. Delegation order is mandatory

For implementation work, canonical order is:

IAA pre-brief → builder appointment → first implementation commit → Foreman QP → ECAP admin validation if required → pre-handover gate → IAA final assurance → CS2 review.

Retroactive delegation is not valid proof.

## 4. ECAP is admin-only

ECAP may compile and validate admin evidence. ECAP may not decide build readiness, merge readiness, or IAA assurance.

## 5. Required checks are manifest-governed

Foreman required checks are now governed by:

`.agent-admin/control/merge-gate-required-checks.json`

and validated by:

`preflight/merge-gate-required-checks-alignment`

## 6. Old admin-loop behavior is deprecated

If an old gate demands handover/admin evidence before implementation-only work reaches handover, treat it as a transition conflict and escalate to CS2 rather than looping.

## 7. Agents must refresh before continuing

Any active agent session started before PR #1800 merged must reload governance instructions before further implementation, handover, or merge-readiness claims.
