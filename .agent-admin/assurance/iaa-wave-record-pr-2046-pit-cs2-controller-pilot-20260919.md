# IAA Wave Record — pr-2046-pit-cs2-controller-pilot — 2026-09-19

## PRE-BRIEF

Qualifying tasks: ["CS2 Work Request claims exactly one bounded PIT job", "Foreman is dispatched for the mandatory PR-scoped IAA pre-brief", "Only the nominated same-repository PR marked with the active work item can be bound by the controller pilot"]
Applicable overlay: [CI_WORKFLOW]
Anti-regression obligations: [no — FUNCTIONAL-BEHAVIOUR-REGISTRY applies to BUILD/AAWP_MAT PRs only; PR #2046 is a bounded controller/governance workflow pilot]

## REJECTION_HISTORY

### 2026-09-19 — PR #2046 — REJECTION-PACKAGE

- **OVL-CI-001 / OVL-CI-004 — Workflow/canon path mismatch**
  - **Finding:** `.github/workflows/iaa-prebrief-inject.yml` binds pre-brief discovery to the PR-scoped task file `.agent-admin/prs/pr-${prNumber}/wave-current-tasks.md` (`.github/workflows/iaa-prebrief-inject.yml:95-97`), but the IAA Tier 1 contract still directs Phase 0 to read `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (`.github/agents/independent-assurance-agent.md:185`) and the canonical pre-brief protocol still declares the wave task record under `.agent-admin/waves/wave-<N>-current-tasks.md` (`governance/canon/IAA_PRE_BRIEF_PROTOCOL.md:204-217`). The pilot therefore redefines the authoritative pre-brief source without the required governing ripple.
  - **Fix required:** Align the controller pilot with the governing IAA contract/canon, or land the required canon/contract ripple in an explicitly authorised follow-up before relying on the PR-scoped path as the sole source of truth.

- **ACR-08 / OVL-CI-005 / A-021 — Required PR-bound assurance artifacts are not committed on the reviewed head**
  - **Finding:** No committed PR-bound IAA wave record/pre-brief exists for PR #2046 at head `2cce1a31373c6430c89bf35a36f1ca90ba208f49`, and the ECAP/bootstrap artifacts that describe the missing pre-brief remain worktree-only (`git status --short` shows `?? .admin/prs/pr-2046.json`, `?? .agent-admin/scope-declarations/pr-2046.md`, `?? .agent-admin/prs/pr-2046/active-state.json`, `?? .agent-admin/prs/pr-2046/wave-current-tasks.md`, `?? .agent-admin/prs/pr-2046/ecap-admin-bundle-20260919.md`). Uncommitted bootstrap/admin artifacts cannot satisfy assurance evidence requirements.
  - **Fix required:** Commit the truthful PR-bound bootstrap/admin artifacts, obtain the Foreman-owned job-bound IAA pre-brief on-branch, and re-invoke IAA on the new submitted head.
