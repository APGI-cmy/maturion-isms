# Implementation Plan — inject-next-action-guidance

Issue: #1718  
PR: #1719  
Builder issue binding: maturion-isms#1718  
Implementing agent target: `qa-builder`

## Frozen approach

1. Reuse trusted main-branch scripts and GitHub API metadata only; do not execute PR-branch code under `pull_request_target`.
2. Add or extend an advisory workflow that posts or updates a single sticky producer guidance comment on PR lifecycle events, with `pull_request_target.synchronize` as the primary trigger.
3. Centralize or reuse handover-intent phrase matching so producer guidance and the hard handover gate stay aligned.
4. Keep the existing handover gate as the hard blocker; the new injector is instructional only.
5. Update guidance/template surfaces so producers must run `/prepare-handover`, `PRE_HANDOVER_CHECKPOINT`, or `ECAP_PRE_HANDOVER_CHECKPOINT` before final summary or handover posture.

## Expected implementation surface

- `.github/scripts/pre-handover-checkpoint.js`
- `.github/scripts/pre-handover-checkpoint.test.sh`
- `.github/scripts/handover-claim-gate.test.sh`
- `.github/scripts/resolve-active-pr-state.js` and/or `.github/scripts/resolve-active-pr-state.test.sh` if needed
- `.github/workflows/pre-handover-checkpoint.yml`
- `.github/workflows/handover-claim-gate.yml`
- new or extended workflow for producer next-action injection
- `.github/copilot-instructions.md` or equivalent non-agent instruction/template surface if required for `/prepare-handover` language

## Red QA target

- Add focused regressions that fail until the new injector or phrase-centralization behavior exists.
- Preserve current `/prepare-handover` deliberate-trigger exclusion from handover-claim parsing.
- Prove sticky comment idempotence and trusted-trigger handling.
