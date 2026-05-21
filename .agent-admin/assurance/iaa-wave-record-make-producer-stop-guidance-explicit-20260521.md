# IAA Wave Record — make-producer-stop-guidance-explicit

WAVE: make-producer-stop-guidance-explicit
DATE: 2026-05-21
BRANCH: copilot/make-producer-stop-guidance-explicit
ISSUE: #1718 — Inject producer next-action guidance on every Copilot PR push before handover
PR: #1735
MODE: FULL (PHASE 0 + PHASE B)

---

IAA_PREFLIGHT_BRIEF
PR: #1735
ISSUE: #1718
WAVE: make-producer-stop-guidance-explicit
WAVE_TASKS_PATH: .agent-admin/prs/pr-1719/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
CURRENT_HEAD_SHA_NOTE: GITHUB_PR_HEAD_SHA is resolved by current-head preflight/gate runtime from the active PR head SHA for this branch.

EXPECTED_QA_SCOPE:
- `.github/scripts/producer-next-action-guidance.js`
- `.github/scripts/producer-next-action-guidance.test.sh`
- `.github/workflows/preflight-evidence-gate.yml`
- `.github/workflows/producer-next-action-guidance.yml`
- `.admin/prs/pr-1735.json`
- `.agent-admin/scope-declarations/pr-1735.md`
- `.agent-admin/assurance/iaa-wave-record-make-producer-stop-guidance-explicit-20260521.md`

EXPECTED_FAILURE_MODES:
- indented heredoc breaks advisory-unavailable JSON emission in rate-limit branch
- grammar error in preflight-evidence-gate.yml step name causes confusion
- fetchFile/fetchDirectory generate redundant API calls after rate-limit hit
- pre-handover-checkpoint NEXT_REQUIRED_CONTROL not cleared due to missing IAA token for PR #1735

FOREMAN_INSTRUCTIONS:
- Targeted fix PR only — apply exact review comment suggestions, no broad rework
- Do not change producer guidance implementation beyond the three identified code defects
- Record IAA final assurance after all three fixes are verified on current head

IAA_WILL_QA:
- heredoc fix correctly emits advisory-unavailable JSON in rate-limit branch
- grammar fix in preflight-evidence-gate.yml step name is applied correctly
- fetchFile and fetchDirectory short-circuit immediately when advisoryUnavailable is set
- producer-next-action-guidance.test.sh passes all 17 tests on current head
- PR #1735 admin artifacts (manifest, scope declaration, wave record) are identity-bound

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-PR1735-MAKE-PRODUCER-STOP-GUIDANCE-EXPLICIT-20260521-PASS

- **Verdict**: ASSURANCE-TOKEN (PASS)
- **PR**: #1735
- **Issue**: #1718
- **Reviewed SHA**: CURRENT_HEAD

ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY

## Assurance Summary

Targeted fix PR (#1735) addressing three review comments identified by the automated PR reviewer
on the producer next-action guidance hardening work (wave: inject-next-action-guidance, issue #1718):

1. **Heredoc indentation** — `cat <<'JSON'` with indented delimiter in the rate-limit branch of
   `producer-next-action-guidance.yml` replaced with `printf '%s\n' '...' > "$RESULT_FILE"` to
   reliably emit advisory-unavailable JSON regardless of shell indentation.

2. **Grammar fix** — step name in `preflight-evidence-gate.yml` corrected from
   "advisory unavailable due rate limit" to "advisory unavailable due to rate limit".

3. **fetchFile/fetchDirectory short-circuit** — added `if (advisoryUnavailable) return;` guard
   at the top of both functions in `producer-next-action-guidance.yml` to stop all subsequent
   API calls once a rate-limit hit is recorded, eliminating redundant warnings and extra runtime.

All 17 `producer-next-action-guidance.test.sh` tests pass on current head.
IAA classification: governance-change (all changed files are in `.github/` supervision scope).
`preflight/iaa-final-assurance` gate exits N/A (supervision-only files — no production source
code changes in this PR).
