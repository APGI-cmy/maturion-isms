# IAA Wave Record — Maturion Thin-Core Contract Correction

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "maturion-thin-core-20260713"
  pr: 1933
  issue: "#1932 — CS2-authorised CodexAdvisor layer-down — Maturion thin-core orchestrator contract correction"
  branch: "codexadvisor-issue-1932-maturion-thin-core"
  qualifying_tasks:
    - task_id: "MAT-T1-1933"
      summary: "Protected Maturion Tier 1 orchestrator contract correction"
      assurance_category: "agent-contract-change"
  required_build_gates:
    - "Agent contract YAML and four-phase structure validation"
    - "PR-scoped scope, manifest, and identity binding"
    - "ECAP administrative ceremony evidence"
    - "Protected-file actor and authority validation"
    - "Hosted required checks"
  expected_qa_scope:
    - "Verify exact Issue #1932 authority and authorised path parity"
    - "Verify bounded specialist invocation and mandatory Maturion output review"
    - "Verify runtime Maturion remains separate from Maturion-as-CS2"
    - "Verify missing Wave 4 dependencies are represented as unavailable"
    - "Verify no runtime, Tier 2, deployment, schema, or activation work entered scope"
  high_risk_failure_modes:
    - "Unbounded specialist invocation or self-registration authority"
    - "Silent expansion of runtime Maturion into CS2 or production-write authority"
    - "False runtime-readiness claim for missing Tier 2 dependencies"
    - "Protected-path change without PR-scoped ECAP, scope, or manifest evidence"
    - "Self-review or non-independent final IAA verdict"
  required_builder_evidence:
    - ".agent-admin/governance/agent-contract-diffs/diff-20260712-maturion-agent-thin-core.md"
    - ".agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md"
    - ".agent-workspace/CodexAdvisor-agent/memory/session-064-20260712.md"
    - ".admin/prs/pr-1933.json"
    - ".agent-admin/scope-declarations/pr-1933.md"
    - ".agent-admin/prs/pr-1933/wave-current-tasks.md"
    - ".agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md"
    - ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1933-maturion-thin-core-20260713.md"
  required_foreman_qp_checks:
    - "Issue-to-diff and authorised-path parity"
    - "CodexAdvisor protected-owner and execution-identity compliance"
    - "Four mandatory phases and SELF-MOD-MATURION-001 preservation"
    - "No runtime or Tier 2 scope expansion"
    - "Hosted gate completion against the current PR head"
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md"
    - ".agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1933-maturion-thin-core-20260713.md"
  final_iaa_focus:
    - "Exact Issue #1932 authority and changed-path parity"
    - "Maturion and CodexAdvisor separation of duties"
    - "Bounded invocation, mandatory response review, and truthful degradation"
    - "Runtime-versus-CS2 authority boundary"
    - "Evidence coherence and hosted checks"
  result: PREFLIGHT_BRIEF_COMPLETE

PR: #1933
ISSUE: #1932
WAVE: maturion-thin-core-20260713
WAVE_TASKS_PATH: .agent-admin/prs/pr-1933/wave-current-tasks.md
CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE
EXPECTED_QA_SCOPE:
- Verify exact authority, path parity, bounded invocation, response review, runtime/CS2 separation, and unavailable Wave 4 dependencies.
EXPECTED_FAILURE_MODES:
- Detect authority drift, path drift, stale evidence, false readiness, unbounded invocation, or non-independent assurance.
FOREMAN_INSTRUCTIONS:
- Keep PR #1933 draft until a genuinely independent IAA verdict and all required hosted checks are complete.
- Treat the original pre-brief commit as the pre-implementation control point; this revision only adds canonical machine-readable fields and PR-scoped bindings.
- Reject any product, runtime, Tier 2, deployment, schema, activation, or CI scope expansion.
IAA_WILL_QA:
- Review the unchanged protected contract implementation and all PR-scoped evidence against Issue #1932.
- Issue only an ASSURANCE-TOKEN, REJECTION-PACKAGE, or constitutional HALT.
RESULT: PREFLIGHT_BRIEF_COMPLETE

## PREHANDOVER_EMBEDDED

- Protected implementation: `.github/agents/maturion-agent.md`
- Exact diff record: `.agent-admin/governance/agent-contract-diffs/diff-20260712-maturion-agent-thin-core.md`
- Immutable implementer proof: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md`
- Implementer session memory: `.agent-workspace/CodexAdvisor-agent/memory/session-064-20260712.md`
- PR-scoped manifest: `.admin/prs/pr-1933.json`
- PR-scoped scope declaration: `.agent-admin/scope-declarations/pr-1933.md`
- PR-scoped wave tasks: `.agent-admin/prs/pr-1933/wave-current-tasks.md`
- ECAP proof: `.agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md`
- ECAP bundle: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1933-maturion-thin-core-20260713.md`
- Final IAA status: PENDING — independent identity required.

## TOKEN

PHASE_B_BLOCKING_TOKEN: PENDING
Verdict: PENDING
Reviewed head: PENDING

No assurance token has been issued. The implementation role must not populate this section.

## REJECTION_HISTORY

None.