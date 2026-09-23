# PR #2057 Wave Current Tasks

PR: #2057
Issue: #2056 — CodexAdvisor: create active-CS2 successor with complete Tier 2/3 readiness bundle
Wave: ACTIVE-CS2-SUCCESSOR-20260923
Branch: copilot/create-active-cs2-successor
Base branch: main
Base SHA: fe854ca44febb864dc661f95a0c0f9a79d980ef2
Initial planning head SHA: 64e5db29cc65061a32aff7d1b172ff804693d7a4
CS2 authorization: issue #2056 plus PR comment 5795073517 (2026-09-23)
Status: PRE_BRIEF_ONLY
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pr-2057-active-cs2-successor-20260923.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pr-2057-active-cs2-successor-20260923.md
IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-pr-2057-active-cs2-successor-20260923.md
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: pending
current_head_binding: CURRENT_HEAD
status_note: Continue on the published ISMS baseline from PR #2055. Track PR #1413 as a later metadata-only integrity/evidence rebinding input; do not treat its open status alone as a blanket implementation blocker.

## Wave boundary

- In scope: the inactive active-CS2 Tier 1 contract, complete Tier 2 knowledge/continuity bundle, PR-scoped evidence carriers, Foreman orchestration-path assessment, and truthful non-activating loadability validation.
- Out of scope: runtime/controller implementation, activation, merge-ready claims, divergent inventory edits, W0 containment rewrite, and any interim-CS2 self-upgrade.
- Validation allowance boundary: the bounded validation surface (`mcp-servers/agent-bootstrap/*`, `.github/scripts/active-cs2-contract-bundle.test.js`) may change only if Foreman determines it is genuinely necessary for executable validation.

## Qualifying task checklist

- [ ] ACS2-2056-A1 — CodexAdvisor-agent creates `.github/agents/active-cs2-agent.md` and the complete `.agent-workspace/active-cs2-agent/knowledge/` and continuity bundle as `CONTRACT_READY / INACTIVE` only.
      builder: CodexAdvisor-agent
      qp_verdict: PENDING
      notes: No runtime, CI/workflow, deployment, permission, or activation claim is allowed in this task.

- [ ] ACS2-2056-B1 — Foreman assesses the Wave B orchestration/loadability route and determines whether any allowed validation-surface code/test change is actually necessary.
      builder: foreman-v2-agent
      qp_verdict: PENDING
      notes: Automatic agent-bootstrap discovery must be preferred over registry edits; this task records assessment/appointment only unless Foreman routes a bounded follow-on lane.

- [ ] ACS2-2056-B2 — Use the actual bootstrap/discovery surface and existing validators to prove loadability, document provider limitations, and map implemented versus still-required runtime controls in `runtime-integration-handoff.md`.
      builder: CodexAdvisor-agent
      qp_verdict: PENDING
      notes: Runtime/controller work remains future Foreman-appointed implementation; this delivery is the truthful contract/knowledge/handoff bundle only.

## IAA tokens received this wave

None yet. Canonical independent IAA pre-brief is complete at `.agent-admin/assurance/iaa-wave-record-pr-2057-active-cs2-successor-20260923.md`; no final IAA token exists for this wave.
