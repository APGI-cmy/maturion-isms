# IAA Wave Record — Maturion Thin-Core Contract Correction

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "maturion-thin-core-20260713"
  pr: 1933
  issue: "#1932 — Maturion thin-core orchestrator contract correction"
  branch: "codexadvisor-issue-1932-maturion-thin-core"
  qualifying_tasks:
    - task_id: "MAT-T1-1933"
      summary: "Protected Maturion Tier 1 orchestrator contract correction"
      assurance_category: "agent-contract-change"
  required_build_gates:
    - "Contract structure validation"
    - "PR-scoped identity validation"
    - "Administrative waiver proof validation"
    - "Protected-file authority validation"
    - "Hosted required checks"
  expected_qa_scope:
    - "Verify Issue #1932 authority and changed-path parity"
    - "Verify bounded specialist invocation and Maturion output review"
    - "Verify runtime Maturion remains separate from Maturion-as-CS2"
    - "Verify missing Wave 4 dependencies remain unavailable"
    - "Verify no runtime or Tier 2 expansion"
  high_risk_failure_modes:
    - "Unbounded invocation authority"
    - "Runtime authority expansion"
    - "False readiness for missing dependencies"
    - "Path or evidence drift"
    - "Premature handover signal"
  required_builder_evidence:
    - ".agent-admin/governance/agent-contract-diffs/diff-20260712-maturion-agent-thin-core.md"
    - ".agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md"
    - ".agent-workspace/CodexAdvisor-agent/memory/session-064-20260712.md"
    - ".admin/prs/pr-1933.json"
    - ".agent-admin/scope-declarations/pr-1933.md"
    - ".agent-admin/prs/pr-1933/wave-current-tasks.md"
    - ".agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md"
  required_foreman_qp_checks:
    - "Authority and changed-path parity"
    - "Protected-owner compliance"
    - "Four-phase structure preservation"
    - "No runtime or Tier 2 expansion"
    - "No premature handover signal"
    - "Hosted checks against current head"
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md"
  final_iaa_focus:
    - "Issue authority and scope parity"
    - "Role separation"
    - "Bounded invocation and response review"
    - "Runtime-versus-CS2 boundary"
    - "Evidence coherence"
  result: PREFLIGHT_BRIEF_COMPLETE

PR: #1933
ISSUE: #1932
WAVE: maturion-thin-core-20260713
WAVE_TASKS_PATH: .agent-admin/prs/pr-1933/wave-current-tasks.md
CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE
EXPECTED_QA_SCOPE:
- Verify authority, scope, bounded invocation, response review, runtime boundary, and unavailable dependencies.
EXPECTED_FAILURE_MODES:
- Detect authority drift, path drift, stale evidence, false readiness, or premature handover.
FOREMAN_INSTRUCTIONS:
- Keep PR #1933 in draft while final independent review remains outstanding.
- Use the Issue #1932 administrative bundle waiver and do not enter the handover lane.
- Reject product, runtime, Tier 2, deployment, schema, activation, or workflow expansion.
IAA_WILL_QA:
- Review the protected contract and PR-scoped evidence against Issue #1932.
- Record the final result in this wave record after independent review.
RESULT: PREFLIGHT_BRIEF_COMPLETE

## PREHANDOVER_EMBEDDED

- Protected implementation: `.github/agents/maturion-agent.md`
- Diff record: `.agent-admin/governance/agent-contract-diffs/diff-20260712-maturion-agent-thin-core.md`
- Implementer proof: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md`
- Session memory: `.agent-workspace/CodexAdvisor-agent/memory/session-064-20260712.md`
- Manifest: `.admin/prs/pr-1933.json`
- Scope declaration: `.agent-admin/scope-declarations/pr-1933.md`
- Wave tasks: `.agent-admin/prs/pr-1933/wave-current-tasks.md`
- Administrative waiver proof: `.agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md`
- Invocation head: `6ff0aff8163221098b6722c9bdaab1c056806713`
- Hosted checks observed at invocation head: successful.
- Final review status: HALT-001 — separate reviewer required.

## TOKEN

PHASE_B_BLOCKING_TOKEN: PENDING
Verdict: HALT-001
Reviewed head: NOT REVIEWED

No final assurance verdict was issued.

## REJECTION_HISTORY

### HALT-001 — 2026-07-13

The reviewer had previously contributed to PR #1933 remediation. The IAA contract prohibits reviewing contributed work. Review stopped during independence preflight. PR #1933 remains draft and requires a separate IAA reviewer who has not contributed to the branch.

## REJECTION-PACKAGE — FINAL (2026-07-20)

═══════════════════════════════════════
REJECTION-PACKAGE
PR: #1933 — CodexAdvisor: correct Maturion thin-core orchestrator contract
4 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
FAILURES:
  RP-1933-01 — Assured-head drift: PR evidence binds protected state to commit `dbdf1d41b759fb2333903d3f13c371d96c525959` and blob `cace19f9c9fd28ada324e39258a3d03fd0cfbca1`, but live review head is `213f5cb5b94461b19cbd860a706a99e5bdb45042` and current protected blob is `c6a6a086d192eee2e0c872ec268eee767a407637`. — Fix required: regenerate authoritative diff/proof artifacts against the current substantive head or restore the declared assured state. — Classification: Substantive
  RP-1933-02 — PREHANDOVER immutability breach: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md` states later implementation changes require a new PREHANDOVER + renewed assurance, but subsequent protected-file commits (`f90c88c...`, `213f5cb...`) occurred without a new PREHANDOVER artifact. — Fix required: create a new immutable PREHANDOVER for the actual substantive head and re-run independent assurance. — Classification: Ceremony
  RP-1933-03 — ECAP waiver proof contradiction: `.agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md` declares “No substantive Maturion contract change was made during gate remediation,” contradicted by two later protected-contract commits modifying `.github/agents/maturion-agent.md`. — Fix required: correct proof claims to match git history and re-attest scope truthfully. — Classification: Systemic
  RP-1933-04 — Hosted-check completion not yet evidenced at final review point: PR task binding still records `HOSTED-1933` as `IN_PROGRESS`, and current check run set includes an in-progress job (`copilot`). — Fix required: complete hosted checks and provide final green required-check evidence at reviewed head. — Classification: Ceremony
This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════

IAA_REJECTION_NOTICE
- RCA_REVIEW: REFER_BACK
- HANDOVER_ALLOWED: no
- RESULT: REJECTED_BACK_TO_PRODUCER