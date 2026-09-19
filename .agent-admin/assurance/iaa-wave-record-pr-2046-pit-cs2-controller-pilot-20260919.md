# IAA Wave Record — pr-2046-pit-cs2-controller-pilot — 2026-09-19

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pr-2046-pit-cs2-controller-pilot"
  pr: "#2046"
  issue: "#2044 — PIT Operational Core — 24 September release control"
  branch: "codex/pit-cs2-controller-pilot"
  repository: "APGI-cmy/maturion-isms"
  current_head_sha: "fba039505a8c7d6720bf5f452a8eccfa36b959c6"
  work_item_id: "pit-issue-2044"
  active_register_row: "PIT-R1"
  qualifying_tasks:
    - task_id: "PIT-CTRL-001"
      summary: "Claim the authorised PIT CS2 Work Request and persist exactly one active work-register row for the controller pilot."
      assurance_category: "CI_WORKFLOW"
    - task_id: "PIT-CTRL-002"
      summary: "Dispatch Foreman for the mandatory PR-scoped IAA pre-brief before any build delegation."
      assurance_category: "CI_WORKFLOW"
    - task_id: "PIT-CTRL-003"
      summary: "Bind only the nominated same-repository PR marked with the exact active work item."
      assurance_category: "CI_WORKFLOW"
    - task_id: "PIT-CTRL-004"
      summary: "Keep scope-expansion and merge approvals human-only throughout the controller pilot."
      assurance_category: "CI_WORKFLOW"
  required_build_gates:
    - "Exact current-head binding for PR #2046 on branch codex/pit-cs2-controller-pilot."
    - "Canonical PR-scoped IAA pre-brief discoverable by .github/workflows/iaa-prebrief-inject.yml."
    - "Single active work-register row for work item pit-issue-2044."
    - "Ordinary PR-scoped PREHANDOVER/session-memory/S-033 evidence remains on-branch for final assurance."
  expected_qa_scope:
    - "Verify the controller persists exactly one active PIT work-register row for Issue #2044."
    - "Verify Foreman dispatches and consumes only the PR-scoped PRE-BRIEF for PR #2046."
    - "Verify only same-repository PRs carrying CS2-Work-Item: pit-issue-2044 can bind."
    - "Verify scope-expansion and merge decisions remain human-only."
    - "Verify the ordinary PR-scoped PREHANDOVER/session-memory/S-033 route evidence remains attributable to this exact head."
  high_risk_failure_modes:
    - "Stale or cross-wave pre-brief state is accepted instead of the active PR-scoped artifact."
    - "A PR without CS2-Work-Item: pit-issue-2044 is treated as bound."
    - "More than one active PIT work-register row can persist concurrently."
    - "Controller automation implies or performs scope expansion or merge approval."
    - "Ordinary PR-scoped PREHANDOVER/session-memory/S-033 evidence drifts to an older head and is treated as current."
  required_builder_evidence:
    - "Node test output for .github/scripts/pit-cs2-controller.test.js and .github/scripts/pit-cs2-controller-workflow.test.js."
    - "YAML parse validation for .github/workflows/pit-cs2-controller.yml, .github/workflows/iaa-prebrief-inject.yml, and .github/ISSUE_TEMPLATE/cs2-work-request.yml."
    - "PR binding evidence showing CS2-Work-Item: pit-issue-2044 on the nominated same-repository PR."
    - "On-branch route evidence for .agent-admin/prehandover/proof-pr-2046-pit-cs2-controller-pilot-20260919.md, .agent-admin/prehandover/OVL-CI-005-S033-evidence-pr-2046-pit-cs2-controller-pilot-20260919.md, and .agent-workspace/foreman-v2/memory/session-pr-2046-pit-cs2-controller-pilot-20260919.md."
  required_foreman_qp_checks:
    - "Confirm PR-bound admin artifacts all bind to exact head fba039505a8c7d6720bf5f452a8eccfa36b959c6."
    - "Confirm this PRE-BRIEF block is canonical and discoverable by the injector."
    - "Confirm the controller pilot remains within the bounded .github/** governance scope."
    - "Confirm PREHANDOVER/session-memory/S-033 artifacts remain present on-branch and attributable to this PR-scoped route."
  ecap_required: true
  ecap_expected_artifacts:
    - ".admin/prs/pr-2046.json"
    - ".agent-admin/scope-declarations/pr-2046.md"
    - ".agent-admin/prs/pr-2046/active-state.json"
    - ".agent-admin/prs/pr-2046/wave-current-tasks.md"
    - ".agent-admin/prs/pr-2046/ecap-admin-bundle-20260919.md"
    - ".agent-admin/assurance/iaa-wave-record-pr-2046-pit-cs2-controller-pilot-20260919.md"
    - ".agent-admin/prehandover/proof-pr-2046-pit-cs2-controller-pilot-20260919.md"
    - ".agent-admin/prehandover/OVL-CI-005-S033-evidence-pr-2046-pit-cs2-controller-pilot-20260919.md"
    - ".agent-workspace/foreman-v2/memory/session-pr-2046-pit-cs2-controller-pilot-20260919.md"
  final_iaa_focus:
    - "PR #2046 remains bound to exact head fba039505a8c7d6720bf5f452a8eccfa36b959c6."
    - "The controller pilot enforces one active work item and one nominated PR."
    - "Human-only approvals for scope expansion and merge are preserved."
    - "Ordinary PR-scoped PREHANDOVER/session-memory/S-033 evidence remains coherent with the same head and route."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## REJECTION_HISTORY

### 2026-09-19 — PR #2046 — REJECTION-PACKAGE

- **OVL-CI-001 / OVL-CI-004 — Workflow/canon path mismatch**
  - **Finding:** `.github/workflows/iaa-prebrief-inject.yml` binds pre-brief discovery to the PR-scoped task file `.agent-admin/prs/pr-${prNumber}/wave-current-tasks.md` (`.github/workflows/iaa-prebrief-inject.yml:95-97`), but the IAA Tier 1 contract still directs Phase 0 to read `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (`.github/agents/independent-assurance-agent.md:185`) and the canonical pre-brief protocol still declares the wave task record under `.agent-admin/waves/wave-<N>-current-tasks.md` (`governance/canon/IAA_PRE_BRIEF_PROTOCOL.md:204-217`). The pilot therefore redefines the authoritative pre-brief source without the required governing ripple.
  - **Fix required:** Align the controller pilot with the governing IAA contract/canon, or land the required canon/contract ripple in an explicitly authorised follow-up before relying on the PR-scoped path as the sole source of truth.

- **ACR-08 / OVL-CI-005 / A-021 — Required PR-bound assurance artifacts are not committed on the reviewed head**
  - **Finding:** No committed PR-bound IAA wave record/pre-brief exists for PR #2046 at head `2cce1a31373c6430c89bf35a36f1ca90ba208f49`, and the ECAP/bootstrap artifacts that describe the missing pre-brief remain worktree-only (`git status --short` shows `?? .admin/prs/pr-2046.json`, `?? .agent-admin/scope-declarations/pr-2046.md`, `?? .agent-admin/prs/pr-2046/active-state.json`, `?? .agent-admin/prs/pr-2046/wave-current-tasks.md`, `?? .agent-admin/prs/pr-2046/ecap-admin-bundle-20260919.md`). Uncommitted bootstrap/admin artifacts cannot satisfy assurance evidence requirements.
  - **Fix required:** Commit the truthful PR-bound bootstrap/admin artifacts, obtain the Foreman-owned job-bound IAA pre-brief on-branch, and re-invoke IAA on the new submitted head.

### 2026-09-19 — PR #2046 @ `4aae78170f5f2e704c04541ca6b0ab6583654540` — REJECTION-PACKAGE

- **ACR-03 / ACR-04 / ACR-07 — Current-head admin evidence is stale across the active PR bundle**
  - **Finding:** The exact reviewed head is `4aae78170f5f2e704c04541ca6b0ab6583654540`, but the active PR-bound artifacts still declare older heads: `.admin/prs/pr-2046.json:11`, `.agent-admin/prs/pr-2046/active-state.json:4,10`, `.agent-admin/prs/pr-2046/wave-current-tasks.md:8`, and `.agent-admin/scope-declarations/pr-2046.md:24` all bind to `b6090b91d63beb492cbe0299461e5c4bc6110efe`, while `.agent-admin/prs/pr-2046/ecap-admin-bundle-20260919.md:12,24,105-117` still records `2cce1a31373c6430c89bf35a36f1ca90ba208f49` and `b6090b91d63beb492cbe0299461e5c4bc6110efe`. The scope declaration also declares `FILES_CHANGED: 8` even though the exact base→head diff contains 14 files (8 `.github/**` files plus 6 PR-bound admin/assurance artifacts).
  - **Fix required:** Regenerate the PR manifest, scope declaration, active-state file, wave task record, and ECAP bundle so every current-state field, head SHA, and file-count statement is truthful for head `4aae78170f5f2e704c04541ca6b0ab6583654540`, then re-invoke IAA on that exact committed head.

- **OVL-CI-001 / OVL-CI-005 / OVL-INJ-001 — Committed wave record is not a canonical PR-scoped IAA PRE-BRIEF artifact**
  - **Finding:** `.github/workflows/iaa-prebrief-inject.yml:132-140` only treats a wave record as canonical when it contains `## PRE-BRIEF`, `IAA_PREFLIGHT_BRIEF:`, `schema_version:`, and `result: PREFLIGHT_BRIEF_COMPLETE`, and when it is bound to the active PR/work item/head. `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md:118-125` requires the same completion fields. The committed wave record at `.agent-admin/assurance/iaa-wave-record-pr-2046-pit-cs2-controller-pilot-20260919.md:3-7` contains only free-text lines and no `IAA_PREFLIGHT_BRIEF` block, schema version, result marker, PR binding, work-item binding, or current-head binding, so the injector cannot truthfully resolve the mandatory pre-brief as complete on this head.
  - **Fix required:** Replace the current PRE-BRIEF section with the canonical `IAA_PREFLIGHT_BRIEF` block bound to PR #2046, the active PIT work item, and head `4aae78170f5f2e704c04541ca6b0ab6583654540`, or regenerate the truthful PR-scoped wave record via the governed pre-brief path before requesting final assurance again.

### 2026-09-19 — PR #2046 @ `25238cb119d2c0e1b894a51fc6a53fb2260532e9` — REJECTION-PACKAGE

- **ACR-03 / ACR-04 / ACR-07 / ACR-08 / ACR-15 — Exact-head administrative truth remains stale on the reviewed commit**
  - **Finding:** The exact reviewed head is `25238cb119d2c0e1b894a51fc6a53fb2260532e9`, but the active PR-bound artifacts still bind to the prior head `4aae78170f5f2e704c04541ca6b0ab6583654540`: `.admin/prs/pr-2046.json:11`, `.agent-admin/prs/pr-2046/active-state.json:4,13`, `.agent-admin/prs/pr-2046/wave-current-tasks.md:8,16,34`, `.agent-admin/scope-declarations/pr-2046.md:9,28,41`, `.agent-admin/prs/pr-2046/ecap-admin-bundle-20260919.md:12,24,32,75,80`, and `.agent-admin/assurance/iaa-wave-record-pr-2046-pit-cs2-controller-pilot-20260919.md:13,48,60,78-86`. No reviewed artifact names or binds `25238cb119d2c0e1b894a51fc6a53fb2260532e9`, so the PR bundle is not truthful for the submitted head.
  - **Fix required:** Regenerate every PR-2046 current-state/admin artifact so the committed truth binds to `25238cb119d2c0e1b894a51fc6a53fb2260532e9`, then re-invoke IAA on that exact committed head.

- **OVL-CI-001 / OVL-CI-004 — PR-scoped pre-brief routing remains misaligned with governing contract/canon**
  - **Finding:** `.github/workflows/iaa-prebrief-inject.yml:95-97` resolves the task source only from `.agent-admin/prs/pr-${prNumber}/wave-current-tasks.md`, and `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md:95-105` endorses that PR-scoped-first behavior, but the IAA Tier 1 contract still directs Phase 0 to read `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (`.github/agents/independent-assurance-agent.md:192-193`) while `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md:204-217,286-292,353` still declares `.agent-admin/waves/wave-<N>-current-tasks.md` as the canonical path. The workflow therefore implements a routing model that remains in contradiction with higher-order governance sources.
  - **Fix required:** Align the workflow/protocol path model with the governing IAA contract and canon, or land the required authorised ripple before relying on PR-scoped path resolution as the sole canonical source.

- **A-015 / OVL-CI-005 — Triggered workflow PR still lacks full PREHANDOVER/session-memory ceremony and explicit S-033 exception invocation**
  - **Finding:** The exact base→head diff for `1603f0ca201754e152f79a13d8e0a62fc4e51755..25238cb119d2c0e1b894a51fc6a53fb2260532e9` contains no PREHANDOVER proof file and no Foreman/IAA session-memory artifact, and the committed PR-bound bundle does not explicitly invoke the OVL-CI-005 S-033 self-referential-workflow exception with its required justification set. Local validation evidence (`11 pass, 0 fail` and YAML parse success) exists, but the mandated ceremony artifact set for a triggered CI_WORKFLOW PR is still incomplete.
  - **Fix required:** Commit the required PREHANDOVER proof and session-memory artifacts for this PR, and explicitly document the OVL-CI-005/S-033 basis for using local validation evidence in lieu of a hosted run of the modified workflows before re-invoking IAA.
