# PR #1685 — Strict Gate Logic Change Evidence

Date: 2026-05-19  
Issue: #1684  
Branch: `copilot/harden-active-pr-identity-binding`  
Owner: Copilot

## Changed strict-gate files

- `.github/scripts/ecap-admin-ceremony-gate.sh`
- `.github/scripts/iaa-final-assurance-gate.sh`
- `.github/scripts/iaa-final-assurance-gate.test.sh`
- `.github/scripts/identity-binding-gate.sh`
- `.github/scripts/identity-binding-gate.test.sh`
- `.github/scripts/pre-handover-checkpoint.js`
- `.github/scripts/pre-handover-checkpoint.test.sh`
- `.github/workflows/preflight-evidence-gate.yml`

## Before/After behavior summary

- **Before**: Active governance artifacts could be coherent but still point to another PR identity, and ECAP/IAA identity exactness was not enforced as a strict current-PR binding condition.
- **After**: Active artifacts are hard-bound to GitHub PR identity context (PR/branch/head/base). Wrong-PR active bundles fail via `preflight/identity-binding`; ECAP/IAA identity verdict blocks require explicit `ALL_MATCH: yes`.

## Identity-binding wrong-PR regression coverage

- Added/validated wrong-PR failure reproduction for `actual PR #1680` vs `artifact PR #1683` in:
  - `.github/scripts/identity-binding-gate.test.sh`
- Reference-only sections remain allowlisted and covered.

## Impacted gates

- `preflight/identity-binding`
- `preflight/ecap-admin-ceremony`
- `preflight/iaa-final-assurance`
- `preflight/gate-changing-pr-rule`
- `preflight/scope-declaration-parity`
- `preflight/evidence-exactness`

## No-weakening statement

No governance weakening was introduced. The change set tightens enforcement by failing closed on identity mismatch, requiring explicit ECAP identity evidence, and requiring IAA identity verdict coherence before PASS posture.

## Local regression evidence

- local command output: `bash .github/scripts/identity-binding-gate.test.sh` → Passed: 6, Failed: 0
- local command output: `bash .github/scripts/pre-handover-checkpoint.test.sh` → Passed: 47, Failed: 0
- local command output: `bash .github/scripts/iaa-preflight-contract-gate.test.sh` → Passed: 15, Failed: 0
- local command output: `PR_NUMBER=1685 BASE_SHA=$(git merge-base origin/main HEAD) HEAD_SHA=$(git rev-parse HEAD) bash .github/scripts/ecap-admin-ceremony-gate.sh` → PASS (after adding PREHANDOVER+ECAP artifacts)
- local command output: `PR_NUMBER=1685 BASE_SHA=$(git merge-base origin/main HEAD) bash .github/scripts/gate-changing-pr-rule.sh` → PASS

## Current-head full Preflight evidence

- workflow Preflight Evidence Gate: full execution on head `dc2a4e5bf39ba0dc04b4eb502d4943bb829e8a28` where required jobs executed:
  - `preflight/identity-binding` (success)
  - `preflight/ecap-admin-ceremony` (success)
  - `preflight/gate-changing-pr-rule` (success)
  - `preflight/iaa-final-assurance` (success)
  - `preflight/scope-declaration-parity` (success)
  - `preflight/evidence-exactness` (success)
- Actions run URL: `https://github.com/APGI-cmy/maturion-isms/actions/runs/26102136492`
