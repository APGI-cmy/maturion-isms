# PR #1672 — Strict Gate Logic Change Evidence (STOP_AND_FIX)

Date: 2026-05-19  
Issue: #1671  
Branch: `copilot/restore-iaa-pre-flight-briefing`  
Owner: Copilot

## Changed strict-gate files

- `.github/scripts/iaa-final-assurance-gate.sh`
- `.github/scripts/iaa-final-assurance-gate.test.sh`
- `.github/scripts/iaa-preflight-contract-gate.sh`
- `.github/scripts/iaa-preflight-contract-gate.test.sh`
- `.github/scripts/pre-handover-checkpoint.js`
- `.github/scripts/pre-handover-checkpoint.test.sh`
- `.github/workflows/preflight-evidence-gate.yml`

## Before/After behavior summary

- **Before**: `preflight/iaa-prebrief-existence` validated mainly existence/path references and did not enforce proactive, machine-checkable pre-flight QA contract content or consumption posture.
- **After**: pre-flight gate enforces contract fields, relevance, consumption evidence, and timing checks; final IAA gate enforces pre-flight cross-reference fields; checkpoint output explicitly classifies unresolved failed-gate posture as post-failure status (not closure).

## Impacted gates

- `preflight/iaa-prebrief-existence`
- `preflight/iaa-final-assurance`
- `preflight/gate-changing-pr-rule`
- `preflight/scope-declaration-parity`
- `preflight/mmm-pr-admin`

## No-weakening statement

No governance weakening was introduced. All changes increase strictness and traceability:
- stronger pre-flight contract validation,
- stricter final IAA linkage requirements,
- explicit post-failure state semantics that prevent premature closure claims.

## Local regression evidence

- local command output: `bash .github/scripts/iaa-preflight-contract-gate.test.sh` → Passed: 15, Failed: 0
- local command output: `bash .github/scripts/iaa-final-assurance-gate.test.sh` → Passed: 32, Failed: 0
- local command output: `bash .github/scripts/pre-handover-checkpoint.test.sh` → Passed: 45, Failed: 0

## Current-head preflight evidence

- Preflight Evidence Gate workflow rerun completed and passing after STOP_AND_FIX remediations.
- Actions run URL: `https://github.com/APGI-cmy/maturion-isms/actions/runs/26087697991`
- Head SHA validated: `8dd1c3d6eb1d09cff78652b3d395b1335264fd0b`
- PREFLIGHT_PATH_ANCHOR_INTENTIONAL: yes — retained issue-1660 filename in `iaa_prebrief_path` is intentional for deterministic path anchoring; content in that file is the authority for PR #1672 / Issue #1671.
