# IAA Wave Record — PR #2048 CS2-Direct CodexAdvisor Recovery Hardening

IAA_PREFLIGHT_BRIEF
PR: #2048
ISSUE: #2047
WAVE: pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919
WAVE_TASKS_PATH: .agent-admin/prs/pr-2048/wave-current-tasks.md
CURRENT_HEAD_SHA: 7e365fb5d8572e18f728fc43a23e60ba5f341e5d
QUALIFYING_TASKS:
- GOV-2048-01 — Rebind IAA/Foreman/ECAP assurance to PR #2048 and the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, replacing inherited retrospective context with PR-scoped evidence only.
APPLICABLE_OVERLAY: AGENT_CONTRACT
ANTI_REGRESSION_OBLIGATIONS: no — `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed; this is governance/agent-contract recovery-hardening only, with no product/runtime/deployment/schema/CI deliverable in scope.
EXPECTED_QA_SCOPE:
- Qualify only GOV-2048-01 for PR #2048 on the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
- Keep active evidence bound to `.agent-admin/prs/pr-2048/wave-current-tasks.md`; no product/runtime/deployment/schema/CI scope is included in this pre-brief.
- Treat `.agent-admin/assurance/iaa-wave-record-issue-2016-retrospective-pr2006-20260813.md` as NON-ACTIVE / UNUSABLE for PR #2048 because it binds to PR `#2017` and a different wave-tasks path.
EXPECTED_FAILURE_MODES:
- Historical PR `#2017` / `issue-2016-retrospective-pr2006` evidence is reused as active proof for PR #2048.
- Scope expands beyond GOV-2048-01 into product/runtime/deployment/schema/CI or into unauthorized new CodexAdvisor contract edits.
- Any final PASS / REJECTION token is claimed from this pre-brief-only invocation.
FOREMAN_INSTRUCTIONS:
- Keep PR #2048 bound to GOV-2048-01, `WAVE_TASKS_PATH: .agent-admin/prs/pr-2048/wave-current-tasks.md`, and the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
- Do not use the historical retrospective wave record as active evidence for PR #2048.
- Do not treat this invocation as final assurance; independent final IAA assurance remains a separate later step.
IAA_WILL_QA:
- QA the PR-bound governance evidence binding, qualifying-task identity, and submitted-head relevance for PR #2048 only.
- QA that the historical retrospective artifact remains explicitly NON-ACTIVE / UNUSABLE for PR #2048.
- QA that no product/runtime/deployment/schema/CI scope is imported into this pre-brief.
RESULT: PREFLIGHT_BRIEF_COMPLETE

Wave: `pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919`
Date: 2026-09-19
Repository: `APGI-cmy/maturion-isms`
PR: #2048
Issue: #2047
Branch: `cs2/codex-advisor-recovery-hardening`
Base SHA: `1603f0ca201754e152f79a13d8e0a62fc4e51755`
Current Submitted Head SHA: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
Wave Tasks Path: `.agent-admin/prs/pr-2048/wave-current-tasks.md`
Status: `PRE-BRIEF ONLY — NO FINAL IAA TOKEN OR REJECTION ISSUED IN THIS INVOCATION`

## PRE-BRIEF

Qualifying tasks:
- `GOV-2048-01` — Rebind IAA/Foreman/ECAP assurance to PR #2048 and the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`, replacing inherited retrospective context with PR-scoped evidence only.

Applicable overlay: `AGENT_CONTRACT`

Anti-regression obligations: no — `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed; this PR-scoped task is governance/agent-contract recovery-hardening only, with no product/runtime/deployment/schema/CI deliverable in scope.

## BINDING

- Bound task record: `.agent-admin/prs/pr-2048/wave-current-tasks.md`
- Bound repository: `APGI-cmy/maturion-isms`
- Bound PR / Issue: `#2048` / `#2047`
- Bound branch: `cs2/codex-advisor-recovery-hardening`
- Bound review head: `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`
- Bound base SHA: `1603f0ca201754e152f79a13d8e0a62fc4e51755`
- Scope discipline: only the recovery-hardening task above qualifies; no product/runtime/deployment/schema/CI changes are in scope; no new CodexAdvisor contract edits are authorised unless a later evidenced correction requires them.
- Ceremony-admin appointment: not declared in `.agent-admin/prs/pr-2048/wave-current-tasks.md` at pre-brief time.

## ACTIVE-EVIDENCE BOUNDARY

- Historical wave record `.agent-admin/assurance/iaa-wave-record-issue-2016-retrospective-pr2006-20260813.md` is explicitly **NON-ACTIVE / UNUSABLE** for PR #2048.
- Reason: that historical record is bound to PR `#2017`, branch `apgi-cmy-issue-2016-retrospective-governance-pr-2`, and wave-tasks path `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`; it is not bound to PR `#2048` or to the PR-scoped task record required here.
- Therefore no inherited retrospective context from that artifact may be relied on as active evidence, active assurance, or active head binding for PR #2048.
- Active evidence for PR #2048 must remain PR-scoped and anchored to `.agent-admin/prs/pr-2048/wave-current-tasks.md` plus the submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.

## PRE-BRIEF RECORD

- Phase 1 preflight completed for this invocation: contract YAML parseable; Tier 2 required files present; `governance/CANON_INVENTORY.json` contained no null/empty/zeroed `file_hash_sha256` values and included `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`; FAIL-ONLY-ONCE loaded with no open IAA breach blocking pre-brief execution.
- Trigger basis for this pre-brief: submitted-head diff includes `.github/agents/CodexAdvisor-agent.md`, therefore `AGENT_CONTRACT` is the controlling trigger category for current gate expectations.
- This artifact is the sole canonical IAA pre-brief record for PR #2048 in this invocation.
