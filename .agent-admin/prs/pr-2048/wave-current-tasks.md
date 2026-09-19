# PR #2048 Wave Current Tasks

PR: #2048
Issue: #2047
Branch: cs2/codex-advisor-recovery-hardening
Base Branch: main
Base SHA: 1603f0ca201754e152f79a13d8e0a62fc4e51755
Stable Submitted Head SHA: 7e365fb5d8572e18f728fc43a23e60ba5f341e5d
CURRENT_HEAD_BINDING: CURRENT_HEAD
Status: IAA_FINAL_PASS_CS2_REVIEW
CS2_AUTHORITY: Johan Ras (@APGI-cmy)
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md
ecap_bundle_path: .agent-admin/prs/pr-2048/ecap-admin-bundle-20260919.md
prehandover_proof_path: .agent-admin/prehandover/proof-pr-2048-current-head-20260919.md
active_ecap_artifact_path: .agent-admin/prehandover/proof-pr-2048-current-head-20260919.md
ceremony_admin_appointed: execution-ceremony-admin-agent
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md
IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: ebd95de8599149fab7664ebc329ca351577109cb
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: not_required

## Authoritative binding

- PR scope is limited to the existing submitted head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d`.
- This is a CS2-direct protected own-contract repair for CodexAdvisor.
- No additional CodexAdvisor contract edits are authorised unless an evidenced correction requires them.
- The only qualifying task is to repair the PR's governance evidence binding and complete the remaining review/assurance sequence on this submitted head.

## Historical context explicitly excluded

- Inherited wave `issue-2016-retrospective-pr2006` belongs to PR #2017 and is not valid evidence for PR #2048.
- Historical wave record `.agent-admin/assurance/iaa-wave-record-issue-2016-retrospective-pr2006-20260813.md` is unusable for this PR because it is bound to a different PR, branch, subject, and wave-tasks path.
- This PR must use PR-scoped records under `.agent-admin/prs/pr-2048/` and a canonical IAA pre-brief bound to this file.

## Qualifying task (frozen)

| Task ID | Description | Owner | Status |
|---|---|---|---|
| GOV-2048-01 | Rebind IAA/Foreman/ECAP assurance to PR #2048 and the submitted head, replacing inherited retrospective context with PR-scoped evidence only | foreman-v2-agent | COMPLETE |
| IAA-2048-PB | Generate canonical PR-scoped IAA pre-brief bound to PR #2048 and mark inherited retrospective evidence unusable | independent-assurance-agent | COMPLETE |
| QP-2048 | Perform Foreman QP review on the governance-only submitted head and PR-scoped correction artifacts | foreman-v2-agent | COMPLETE |
| ECAP-2048 | Produce administrative validation bundle for the PR-scoped evidence set | execution-ceremony-admin-agent | COMPLETE |
| IAA-2048-FINAL | Perform independent final assurance on the resulting stable PR #2048 head | independent-assurance-agent | COMPLETE |

## Current evidence state

- Active PR-scoped IAA pre-brief: `.agent-admin/assurance/iaa-wave-record-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md`
- Canonical PREHANDOVER proof pointer: `.agent-admin/prehandover/proof-pr-2048-current-head-20260919.md`
- Final IAA assurance token: `IAA-session-1289-20260919-PASS`
- Historical retrospective record remains NON-ACTIVE / UNUSABLE for this PR: `.agent-admin/assurance/iaa-wave-record-issue-2016-retrospective-pr2006-20260813.md`
- Hosted CI evidence from the previously submitted substantive head `7e365fb5d8572e18f728fc43a23e60ba5f341e5d` was green at comment time; this correction adds only PR-scoped governance evidence and must now complete QP, ECAP, and final IAA on the resulting stable branch head.

gate_set_checked:
- merge-gate/verdict: PASS
- governance/alignment: PASS
- stop-and-fix/enforcement: PASS
- preflight/phase-1-evidence: PASS
- preflight/iaa-prebrief-contract-alignment: PASS
- preflight/ecap-admin-boundary-gate: PASS
- preflight/foreman-prehandover-lane-gate: PASS
- preflight/delegation-order-gate: PASS
- preflight/merge-gate-required-checks-alignment: PASS
- scope-declaration-check: PASS
- session-memory-check: PASS
- builder-involvement-check: PASS
- foreman-implementation-check: PASS
- agent-contract/cs2-authorization: PASS
- agent-contract/actor-authority: PASS
- agent-contract/authority-check: PASS
- agent-contract/iaa-assurance-token: PASS
- agent-contract/self-modification-prevention: PASS
- agent-contract-format/yaml-validation: PASS
- agent-contract-format/placeholder-check: PASS
- agent-contract-format/verdict: PASS

## Foreman Quality Professor (QP) verdict

```yaml
qp_verdict:
  reviewed_base_sha: "1603f0ca201754e152f79a13d8e0a62fc4e51755"
  reviewed_substantive_head_sha: "7e365fb5d8572e18f728fc43a23e60ba5f341e5d"
  full_diff_reviewed: true
  authorized_diff_scope:
    - ".github/agents/CodexAdvisor-agent.md"
    - ".agent-workspace/CodexAdvisor-agent/escalation-inbox/CS2-DIRECT-2047-OWN-CONTRACT-HARDENING.md"
    - ".agent-workspace/CodexAdvisor-agent/knowledge/index.md"
    - ".agent-workspace/CodexAdvisor-agent/knowledge/continuous-improvement-protocol.md"
    - ".agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md"
    - ".admin/prs/pr-2048.json"
    - ".agent-admin/scope-declarations/pr-2048.md"
    - ".agent-admin/prs/pr-2048/wave-current-tasks.md"
    - ".agent-admin/prs/pr-2048/active-state.json"
    - ".agent-admin/assurance/iaa-wave-record-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md"
  out_of_scope_changes_detected: false
  product_runtime_schema_ci_changes_detected: false
  historical_context_fallback_cleared: true
  hosted_checks_on_submitted_head: "Green at PR comment time for 7e365fb5d8572e18f728fc43a23e60ba5f341e5d; current evidence-only head still requires ECAP and final IAA completion."
  verdict: "PASS"
  blockers: []
```

## Required sequence

1. Create PR-scoped bootstrap artifacts for PR #2048.
2. Generate a canonical IAA pre-brief bound to this file and the submitted head.
3. Perform Foreman QP on the governance-only submitted head.
4. Obtain ECAP administrative validation where required.
5. Invoke independent IAA final assurance on the stable submission head.
6. Return the resulting evidence to CS2 without autonomous merge or readiness claims beyond the actual recorded evidence.

## Acceptance checks

- PR-bound task record exists at `.agent-admin/prs/pr-2048/wave-current-tasks.md`.
- Active assurance artifact path resolves to PR #2048 evidence, not historical fallback.
- Foreman QP confirms the submitted head changes only the authorised CodexAdvisor contract and local knowledge/escalation files.
- ECAP validates administrative binding only and does not substitute for readiness authority.
- Independent IAA final assurance reviews the same stable head referenced by this task record.

## Stop conditions

- Any fallback to historical PR #2017 / issue-2016 evidence as active proof.
- Any new CodexAdvisor contract edits not required by current-head assurance findings.
- Any scope expansion beyond the authorised recovery-hardening files and PR-scoped assurance artifacts.
