# Delta-Assurance Block — harden-iaa-ecap-invocation-20260504

prior_reviewed_sha: 2e4c24aff6d04868f79422a0fcb1ca21e3789143
current_head_sha: 64c140d00729cdabc0544a50655c220066d1581f
delta_classification: non-substantive
pr: maturion-isms#1515
issue: maturion-isms#1514
date: 2026-05-04

## Scope of Delta

Post-IAA commits between `2e4c24aff6d0` (IAA reviewed SHA, session-216) and `64c140d00729` (this delta-assurance commit's parent) are:

| Commit | Description | Files changed | Impl? |
|--------|-------------|---------------|-------|
| `7ccc883` | IAA Final Assurance — ASSURANCE-TOKEN for PR #1515 | `.agent-admin/assurance/iaa-wave-record-harden-iaa-ecap-invocation-20260504.md` | NO — `.agent-admin/` excluded |
| `959f279` | Refresh scope declaration timestamp to re-trigger CI | `.agent-admin/scope-declarations/pr-1515.md` | NO — `.agent-admin/` excluded |
| `52091d2` | Refresh scope declaration timestamp (re-trigger CI) | `.agent-admin/scope-declarations/pr-1515.md` | NO — `.agent-admin/` excluded |
| `59b159b` | fix: remove invalid `local` declarations outside function in `pr-assurance-lifecycle.sh` | `.github/scripts/pr-assurance-lifecycle.sh` | YES — Bash syntax fix |
| `64c140d` | fix: lifecycle script exits 1 when BLOCKED; update AC-LC-2 expected exit to 1 | `.github/scripts/pr-assurance-lifecycle.sh`, `.github/scripts/iaa-final-assurance-gate.test.sh` | YES — behavioural alignment |

## Justification: Non-Substantive Classification

**`59b159b` — Bash syntax fix (`local` outside function)**

The `local` keyword is only valid inside a Bash function body. At commit `59b159b`, two erroneous `local` declarations in the wave-record post-review check block were replaced with plain variable assignments:

```diff
- local wr_has_post_impl=false
- local wr_post_file
+ wr_has_post_impl=false
+ wr_post_file=""
```

This was a pure correctness fix: the script was crashing with `local: can only be used in a function` before this change. The fix restores the intended behaviour that session-216 reviewed — it does not add, remove, or alter any logic. The wave-record SHA validation and post-review implementation-change detection that session-216 audited are unchanged in semantics.

**`64c140d` — Lifecycle script exits 1 when BLOCKED**

Added `exit 1` at the end of `pr-assurance-lifecycle.sh` when `LIFECYCLE_STATUS != "assurance-ready"`. This makes the CI job hard-fail as intended by the reviewed design — the reviewed version always exited 0, which was the gap the CS2 review at session-216 identified as a blocker. The corresponding test update (`AC-LC-2` expected exit 0 → 1) and header comment align the test suite with the corrected behaviour.

Both changes are corrective alignment of the implementation with the audited design intent. No logic, security property, or gate enforcement rule is weakened or bypassed.

## Verification

- All 38 tests pass with these changes (including AC-LC-2, AC-LC-8, AC-LC-9)
- `is_impl_file` correctly excludes `.agent-admin/` files; this delta-assurance artifact does not add any impl change after `current_head_sha`
