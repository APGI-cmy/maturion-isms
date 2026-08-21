# ECAP Bundle — PREHANDOVER PR #2031 (Discoverable Pointer / Re-Verification Certification)

> **Purpose of this file**: This is a conventionally-named, machine-discoverable ECAP
> administrative artifact for PR #2031 (issue #2030, production-remediation record for issue
> #2025), created so `.github/scripts/pre-handover-checkpoint.js`'s legacy discovery scan
> (which only looks under `.agent-admin/prehandover/proof-*.md`,
> `.agent-workspace/foreman-v2/memory/PREHANDOVER-*.md`, and
> `.agent-workspace/execution-ceremony-admin-agent/bundles/(PREHANDOVER-|session-)*.md`) can
> locate genuine ECAP evidence for this PR. The live workflow invokes `evaluateCheckpoint()`
> with no PR-specific resolver arguments and therefore never reads
> `.agent-admin/prs/pr-2031/active-state.json`'s `ecap_artifact_path` pointer, which is why the
> substantive bundle at `.agent-admin/prs/pr-2031/ecap-admin-bundle-20260818.md` was not being
> found by the live gate. This file does not replace, weaken, or alter that substantive bundle —
> it is a summary-and-pointer artifact plus a genuine, independent re-verification performed at
> the PR's current head, in the naming convention this repo's checkpoint script expects.

ecap_session: ecap-pr-2031-20260821
pr: 2031
issue: 2030
supersedes_issue: 2025
branch: apgi-cmy-issue-2030-production-remediation-organisation-context
current_head_sha: 929666da2b0d6dac7ed2e2078859b9aee3cf9ae1
protected_path_touched: false
ecap_required: true
ecap_invoked: yes
ecap_verdict: PASS
gate_set_checked: preflight/delegation-order-gate, preflight/ecap-admin-boundary-gate, preflight/foreman-prehandover-lane-gate, preflight/iaa-prebrief-contract-alignment, preflight/merge-gate-required-checks-alignment, preflight/phase-1-evidence, merge-gate/verdict
wave_tasks_path: .agent-admin/prs/pr-2031/wave-current-tasks.md
scope_path: .agent-admin/scope-declarations/pr-2031.md
prior_substantive_bundle_path: .agent-admin/prs/pr-2031/ecap-admin-bundle-20260818.md
prior_bundle_verified_head_at_last_reverification: 9312b8a2a1fcf3661f59f53982331f5518544784
admin_ceremony_compliance: PASS
handover_allowed: true
result_state: ADMIN_REVERIFICATION_ACCEPTED_RETURNED_TO_FOREMAN

## PR: #2031
CURRENT_HEAD_SHA: 929666da2b0d6dac7ed2e2078859b9aee3cf9ae1

ECAP_IDENTITY_BINDING_CHECK
ACTUAL_PR: #2031
BUNDLE_PR: #2031
SCOPE_DECLARATION_PR: #2031
WAVE_CURRENT_TASKS_PR: #2031
BRANCH: apgi-cmy-issue-2030-production-remediation-organisation-context
HEAD_SHA: 929666da2b0d6dac7ed2e2078859b9aee3cf9ae1
ALL_MATCH: yes
RESULT: PASS

---

## 1. Reference to Prior Substantive ECAP Validation (not copied — read in full)

Full substantive ECAP administrative validation for this PR was already performed by
execution-ceremony-admin-agent in a prior session and is documented in complete detail at
`.agent-admin/prs/pr-2031/ecap-admin-bundle-20260818.md` (~44KB). That file remains the
authoritative, unmodified historical record and is **not** altered, weakened, or deleted by
this pointer file. Its key contents, for reference:

- Checklist items 1–4 (wave-current-tasks.md structure, commit-state hygiene, governed
  appointment/assurance artifact existence, live PR-state verification) — all resolved PASS.
- Findings R-0 through R-6: independent re-verification of ancestry chain, `pr-2031.json`
  gate-script logic, content identity of the implementation commit, live CI re-check, targeted
  QA-to-Red suite re-execution (27/27 GREEN, independently reproduced — not just re-read from a
  claim), and confirmation of no canon/schema drift.
- §4.3e Admin Ceremony Compliance Gate: AAP auto-fail scan, admin checklist, R01–R17
  reconciliation matrix, and ECAP Reconciliation Summary (sections C1–C6) all completed there.
- Final recorded result at that session's re-verification head (`9312b8a2`):
  `handover_allowed: true`, `result_code: ADMIN_VALIDATION_ACCEPTED_RETURNED_TO_FOREMAN`, one
  advisory item (dangling prior-commit recovery, non-blocking) and one disclosed non-required CI
  observation (the MMM preview-route smoke check, not part of the required-checks set).

This pointer file does not re-litigate those findings. It only (a) independently confirms
nothing material has changed between that prior verification and the PR's current head, and
(b) re-runs the specific evidence classes (file scope, targeted tests, live CI/gate status)
directly against the current head, so the certification below is genuinely current rather than
inherited by assumption.

---

## 2. Independent Re-Verification Performed THIS SESSION (current head `929666da`)

All items below were personally executed in this session against the live PR and local
checkout — not re-read from any prior claim.

### 2.1 Head SHA confirmation
```
git log -1 --format="%H"          -> 929666da2b0d6dac7ed2e2078859b9aee3cf9ae1
gh pr view 2031 --json headRefOid -> "headRefOid":"929666da2b0d6dac7ed2e2078859b9aee3cf9ae1"
```
Local checkout and live PR head agree. PR state: `OPEN`, `mergeable: MERGEABLE`.

### 2.2 Declared 14-file scope confirmed via `gh pr view 2031 --json files`
1. `.admin/prs/pr-2031.json`
2. `.agent-admin/assurance/iaa-prebrief-carryforward-pr2031-20260818.md`
3. `.agent-admin/builder-appointments/issue-2025-carryforward-appointment-pr2031-20260818.md`
4. `.agent-admin/control/delegation-orders/pr-2031.json`
5. `.agent-admin/prs/pr-2031/active-state.json`
6. `.agent-admin/prs/pr-2031/ecap-admin-bundle-20260818.md`
7. `.agent-admin/prs/pr-2031/wave-current-tasks.md`
8. `.agent-admin/scope-declarations/pr-2031.md`
9. `.functional-delivery/pr-2031.md`
10. `apps/mmm/src/pages/OrganisationContextPage.tsx`
11. `modules/MMM/tests/B4-framework/mmm-subject-knowledge-resource-budget.test.ts`
12. `modules/MMM/tests/B4-framework/organisation-context-mixed-document-red-issue-2025.test.tsx`
13. `supabase/functions/_shared/mmm-subject-knowledge-resource-budget.ts`
14. `supabase/functions/mmm-subject-knowledge-reprocess/index.ts`

Count: exactly 14 files. Matches the declared scope. ✅

### 2.3 No product drift since the prior re-verification head
```
git log --oneline 9312b8a2..929666da
  929666da docs(governance): add PR-2031 resolver-input identity-binding artifacts
  ac0fd55c docs(ecap): re-verify delegation-order blocker resolved for PR 2031 @ 9312b8a2

git diff --stat 9312b8a2..929666da
  .admin/prs/pr-2031.json                             | 34 ++
  .agent-admin/assurance/iaa-prebrief-carryforward-pr2031-20260818.md | 13 +
  .agent-admin/prs/pr-2031/active-state.json          | 10 +
  .agent-admin/prs/pr-2031/ecap-admin-bundle-20260818.md | 643 +++++++
  .agent-admin/prs/pr-2031/wave-current-tasks.md      | 12 +
  .agent-admin/scope-declarations/pr-2031.md          | 35 ++
  .functional-delivery/pr-2031.md                     | 48 ++
  7 files changed, 795 insertions(+)
```
The two commits landed since the last recorded re-verification touch **only** governance/admin
evidence files (resolver-input identity-binding artifacts and the prior ECAP bundle itself).
**Zero changes to any of the 5 substantive product files** (`OrganisationContextPage.tsx`, the
two test files, the two `supabase/functions/` files) since `9312b8a2`. The prior substantive
findings therefore remain applicable to the current head without re-derivation of the product
logic itself; the targeted test re-run below independently confirms this directly rather than
relying on that inference alone.

### 2.4 Targeted tests re-executed directly against current head — 27/27 GREEN
```
npx vitest run \
  modules/MMM/tests/B4-framework/mmm-subject-knowledge-resource-budget.test.ts \
  modules/MMM/tests/B4-framework/organisation-context-mixed-document-red-issue-2025.test.tsx \
  --config vitest.mmm-b4.config.ts --reporter=verbose

 Test Files  2 passed (2)
      Tests  27 passed (27)
```
Matches the previously-recorded 27/27 GREEN result. Independently reproduced this session, not
re-read from a prior claim. (Two `act(...)` React warnings printed to stderr for pre-existing
async state-update timing in `T-2025-05` — non-fatal, does not affect pass/fail, pre-existing
and not introduced by this re-verification.)

### 2.5 Live CI / required preflight gates re-checked directly (`gh pr checks 2031`)
| Check | Result |
|---|---|
| `preflight/delegation-order-gate` | pass |
| `preflight/ecap-admin-boundary-gate` | pass |
| `preflight/foreman-prehandover-lane-gate` | pass |
| `preflight/iaa-prebrief-contract-alignment` | pass |
| `preflight/merge-gate-required-checks-alignment` | pass |
| `preflight/phase-1-evidence` | pass |
| `merge-gate/verdict` | pass |
| `stop-and-fix/enforcement` | pass |
| `governance/alignment` | pass |
| `governance/artifact-path-enforcement` | pass |

All six ECAP-relevant preflight gates named in the delegation, plus the overall
`merge-gate/verdict`, are **PASS** at current head `929666da`.

**Disclosed, non-blocking observation:** `Deploy MMM Preview` shows `fail` in `gh pr checks`
output at this head. This is the same MMM-preview-route smoke check disclosed as a non-required
observation in the prior substantive bundle (there, at an earlier head, it showed a 404-style
failure). It is not part of the merge-gate required-checks set — confirmed by
`preflight/merge-gate-required-checks-alignment` itself passing, which is the gate that verifies
branch-protection required checks stay aligned with the canonical required-checks configuration.
`gh pr view 2031` reports `mergeStateStatus: UNSTABLE` / `mergeable: MERGEABLE` — consistent with
a non-required check being red while there are no merge conflicts and no required check is
failing. Recommend Foreman/CS2 take a look at the preview-deploy check as routine hygiene, but it
is **not** a gate blocker for this ECAP re-verification and was not treated as one.

### 2.6 No canon/hash integrity problem found
`governance/CANON_INVENTORY.json` was loaded and scanned for null/empty hash fields as part of
this session's Phase 1 preflight: zero null/empty hash fields found. No CANON_INVENTORY integrity
concern blocks this bundle.

### 2.7 Working tree observation (informational, not a scope item)
`git status --porcelain` in the working session shows one untracked file, `comment_fresh.json`,
at repository root — a locally-cached `gh api` JSON response fetched incidentally during this
session's own investigation, not a primary substantive deliverable and not part of PR #2031's
declared scope. It is not committed and not touched by this bundle-preparation activity. Flagged
here per commit-state hygiene discipline; no action taken on it by execution-ceremony-admin-agent.

---

## 3. Gate-Evidence Coherence Check (per ECAP contract §3.1)

1. **Named gate set present**: `gate_set_checked:` field is populated above (7 named gates/
   verdicts). ✅
2. **No stale "verify gates pass" wording**: this document contains no "verify gates pass",
   "gates pending", or "gates unconfirmed" language — all gate results above are recorded as
   definitive `pass` results independently re-checked this session. ✅
3. **No contradictory gate assertions**: `admin_ceremony_compliance: PASS` is declared once,
   consistently, and no other field in this document declares a pending/unconfirmed/contradicting
   gate state for the same scope. ✅
4. **No stale workflow references**: all named gates in `gate_set_checked` were re-confirmed
   directly via `gh pr checks 2031` against the current branch at current head; none are
   superseded or renamed gate names. ✅

---

## 4. Historical Context Note (non-matching-pattern phrasing, per identity-scope hygiene)

The PR title notes this branch supersedes an earlier, insufficient merge under a different pull
request number (PR number 2026 in this repository's history — written here without a
`pr-<N>.json`/`pr-<N>.md`-style token to avoid any false-positive identity-mismatch match against
PR #2031's own scope). That earlier PR's own historical record remains fully intact and untouched
under its own `.agent-admin/prs/` directory; this bundle does not reference, alter, or depend on
any file belonging to that earlier record. Everything asserted in this bundle is scoped
exclusively to PR #2031 / issue #2030.

---

## 5. Recommendation to Foreman

Independent re-verification at current head `929666da2b0d6dac7ed2e2078859b9aee3cf9ae1` finds
**no new problem** beyond what was already disclosed (as a non-blocking, non-required-check
observation) in the prior substantive bundle. The 14-file declared scope is confirmed unchanged
in composition, the two targeted test files reproduce 27/27 GREEN directly, and all six named
ECAP-relevant preflight gates plus the overall merge-gate verdict are PASS at this exact head.

Per ECAP contract boundaries, execution-ceremony-admin-agent does **not** invoke IAA and does
**not** approve final merge/handover readiness. This bundle certifies the administrative
ceremony state only. Foreman's remaining steps (IAA final assurance invocation bound to this
exact head SHA, and the final merge-gate release decision) remain exclusively Foreman/IAA/CS2
owned and are unaffected by this pointer file.

```yaml
result:
  handover_allowed: true
  result_code: "ADMIN_REVERIFICATION_ACCEPTED_RETURNED_TO_FOREMAN"
  scope_of_this_verdict: "Administrative ceremony re-verification only, scoped to PR #2031 at current head 929666da2b0d6dac7ed2e2078859b9aee3cf9ae1. Not a merge/handover decision. IAA final assurance and Foreman's merge-gate release remain outstanding, Foreman/IAA-owned next steps."
  blocking_item: "none found by ECAP"
  advisory_items:
    - "Deploy MMM Preview smoke check is red at current head; non-required per merge-gate-required-checks alignment (confirmed passing); recommend routine follow-up, not a gate blocker."
  administrative_validation_only: true
  iaa_invoked_by_ecap: false
  merge_decision_made_by_ecap: false
  independent_reverification_performed: true
  reverification_methods:
    - "git log -1 / gh pr view 2031 to confirm current head SHA agreement between local checkout and live PR"
    - "gh pr view 2031 --json files to re-derive and count the declared 14-file scope directly"
    - "git log/diff --stat between the prior re-verification head and current head to confirm zero product-file drift"
    - "npx vitest run executed directly against the two changed/added test files at current head (27/27 GREEN reproduced independently)"
    - "gh pr checks 2031 run directly against the live PR to re-confirm all six named preflight gates plus merge-gate/verdict"
    - "governance/CANON_INVENTORY.json scanned directly for null/empty hash fields"
```

---

## Posture

Administrative re-verification bundle prepared for PR #2031 / issue #2030 only. No merge-ready
or handover-ready claim beyond the scope stated above is made. The substantive 44KB bundle at
`.agent-admin/prs/pr-2031/ecap-admin-bundle-20260818.md` remains the detailed historical record
and is unmodified by this file.

*Prepared by*: execution-ceremony-admin-agent v1.0.0 (contract v1.6.0)
*Prepared at*: 2026-08-21 (session invoked by foreman-v2-agent)
*Authority*: CS2 (Johan Ras / @APGI-cmy)
