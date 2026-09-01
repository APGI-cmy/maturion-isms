# Pre-IAA Evidence Checklist — Interim CS2 IAA Rejection Remediation

**Status**: `NOT_READY_UNCOMMITTED`
**Authority**: CS2-authorized protected contract/Tier 2/evidence correction
**IAA state**: Prior combined package rejected; no renewed IAA review, PASS, or token is asserted.

## Package Boundary

The sole package boundary is the in-scope list in `.agent-admin/scope-declarations/scope-declaration-interim-cs2-iaa-remediation-20260814.md`. It includes the declared protected contract/Tier 2/evidence paths and ten user-authorized automation paths. Product artifacts and the three listed Foreman session-plan artifacts remain excluded.

## Evidence Checklist

| Check | Current state | Evidence |
|---|---|---|
| Exact CS2 authority recorded | Present | Current CS2 task instruction; scope declaration metadata |
| Protected Tier 1 corrected | Present, uncommitted | `interim-cs2-agent.md` uses `secret_env_var`, retains four phases and prohibitions |
| Historical diff-record contradiction corrected | Present, uncommitted | `diff-20260812-interim-cs2-agent.md` now states tracked/uncommitted status and actual execution identity |
| Required bootstrap inputs enumerated | Present, uncommitted | `bootstrap-input-validation-spec.md` |
| Non-pass bootstrap statuses halt review | Present, uncommitted | Tier 1 Phase 1 and delivery/intent protocol §2 |
| Required trigger/current-head binding preserved | Present, uncommitted | Delivery/intent protocol trigger table and bootstrap specification |
| LF-normalized inventory validator and its test included | Present, uncommitted | `validate-canon-inventory.js` and `validate-canon-inventory.test.sh`; IAA must verify mismatch rejection |
| Wake-up fail-closed behavior and its test included | Present, uncommitted | `wake-up-protocol.sh` and `wake-up-protocol.test.sh`; IAA must verify failed validation blocks preflight success |
| Lane-halt producer/consumer and tests included | Present, uncommitted | Declared lane-gate scripts and tests; IAA must verify normal failures route Foreman |
| Workflow boundaries included | Present, uncommitted | Declared workflows; IAA must verify exact-head validation, rerun dedupe/concurrency, and no cron/autonomous remediation |
| Scope/acceptance evidence matrix exists | Present, uncommitted | Scope declaration |
| Ripple assessment exists | Present, uncommitted | Scope declaration |
| Format and structural validation rerun | Required before freezing | Must be recorded against final content |
| Full declared scope committed | Not yet possible in this task | Required before IAA invocation |
| PR-base diff and frozen target SHA recorded | Not yet possible without commit/PR | Required before IAA invocation |
| Independent IAA review | Not invoked for corrected frozen scope | Mandatory after commit; result must be authored only by IAA |

## Required IAA Review Questions

1. Does the final frozen diff contain only the declared protected contract, Tier 2, continuity, evidence, and ten automation paths?
2. Does the Tier 1 contract exactly match the corrected diff record, especially tracked status and `execution_identity.secret_env_var`?
3. Does the bootstrap method cover every contract-required input and halt on `MISSING`, `STALE`, `CONTRADICTORY`, or `INVALID`?
4. Does the exact current-head/trigger binding prevent review of a different revision?
5. Does the package preserve interim-CS2's advisory-only, no-build, no-IAA-substitution, and no-merge boundaries?
6. Are the scope declaration, ripple assessment, session memory, validation evidence, and committed path set coherent?
7. Does LF-normalized inventory validation fail closed for invalid or mismatched required artifacts, and does wake-up propagate that failure?
8. Do normal lane-gate failures route to Foreman rather than autonomous remediation?
9. Do the declared automation paths validate the exact reviewed head, safely dedupe reruns/concurrent events, and avoid cron scheduling?

## Freeze-and-Invoke Sequence

1. Revalidate the full declared scope and capture results.
2. Commit the entire declared contract/Tier 2/evidence and automation package as one commit, without including the three excluded Foreman session-plan artifacts; only then is the scope frozen for renewed IAA.
3. Record the commit SHA, PR base, and exact `base...HEAD` path list in a new immutable PREHANDOVER proof.
4. Ask an independent IAA that did not author or contribute to the correction to review the frozen package.
5. Keep the PR draft until IAA's own final result and CS2 merge authority exist.

This checklist is not an immutable PREHANDOVER proof, not an IAA prebrief, and not an assurance result.
