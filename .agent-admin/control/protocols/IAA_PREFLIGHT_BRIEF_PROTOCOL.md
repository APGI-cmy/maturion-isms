# IAA Preflight Brief Protocol

**Status:** Wave 1 canonical protocol  
**Schema:** `.agent-admin/control/schemas/iaa-preflight-brief.schema.json`  
**Applies to:** Foreman pre-build orchestration and IAA Phase 0 pre-brief work  

---

## 1. Purpose

This protocol removes the mismatch between Foreman's pre-brief expectation and IAA's Phase 0 output while keeping the active pre-brief bound to the same PR-scoped task record, work item, and submitted head.

The pre-brief is a compact control sheet. It is not a long narrative artifact and it is not a standalone `iaa-prebrief-*.md` file.

---

## 2. Artifact location

IAA must write the pre-brief only inside the wave record:

```text
.agent-admin/assurance/iaa-wave-record-{wave}-{date}.md
```

The pre-brief must be under:

```text
## PRE-BRIEF
```

Standalone pre-brief artifacts are prohibited:

```text
.agent-admin/assurance/iaa-prebrief-*.md
```

If an older workflow or comment instructs an agent to create a standalone `iaa-prebrief-*.md`, this protocol supersedes that instruction for the cleanup branch.

---

## 3. Canonical pre-brief payload

The `## PRE-BRIEF` section must contain exactly one `IAA_PREFLIGHT_BRIEF` block using this shape:

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "<wave-id>"
  pr: "<number-or-PENDING>"
  issue: "<issue-number-and-title-or-PENDING>"
  branch: "<branch-name>"
  current_head_sha: "<40-char SHA or approved symbolic current-head marker>"
  work_item_id: "<active work-item id or PENDING when no PR-bound work item exists>"
  qualifying_tasks:
    - task_id: "<id>"
      summary: "<task summary>"
      assurance_category: "<category>"
  required_build_gates:
    - "<gate name>"
  expected_qa_scope:
    - "<QA scope item>"
  high_risk_failure_modes:
    - "<failure mode>"
  required_builder_evidence:
    - "<evidence requirement>"
  required_foreman_qp_checks:
    - "<QP check>"
  ecap_required: true
  ecap_expected_artifacts:
    - "<artifact path or requirement>"
  final_iaa_focus:
    - "<final assurance focus item>"
  result: PREFLIGHT_BRIEF_COMPLETE
```

---

## 4. Foreman obligations

Foreman must not delegate builders until all of the following are true:

1. `wave-current-tasks.md` exists for the wave.
2. The IAA wave record exists under `.agent-admin/assurance/iaa-wave-record-*.md`.
3. The wave record contains `## PRE-BRIEF`.
4. The section contains `IAA_PREFLIGHT_BRIEF`.
5. The block contains `result: PREFLIGHT_BRIEF_COMPLETE`.
6. The pre-brief is bound to the current PR, active work item, and submitted head (or to the approved wave fallback context when no PR-bound record exists).
7. Any pre-brief status marker (`IAA_PREBRIEF_READY`, `READY_FOR_IAA`, or equivalent) is treated as an intermediate gate only, never as a completion/handover/merge-readiness claim.

Foreman must pass the pre-brief path to each builder appointment.

---

## 5. IAA obligations

When invoked with `Action: PRE-BRIEF`, IAA must:

1. Read the PR-scoped wave task file first:

```text
.agent-admin/prs/pr-<PR_NUMBER>/wave-current-tasks.md
```

2. Use the legacy wave-scoped path only if the PR-scoped file is absent:

```text
.agent-admin/waves/wave-<N>-current-tasks.md
```

3. Use the legacy personal path only if neither PR-scoped nor wave-scoped file exists:

```text
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
```

4. Reject any task record that does not match the active PR/job context or submitted head.
5. Classify qualifying tasks.
6. Produce the canonical `IAA_PREFLIGHT_BRIEF` block.
7. Commit or update the matching wave record only.
8. Reply with the wave record path and qualifying task count.
9. Do not request or induce evidence-only commits whose sole purpose is to refresh an artifact's self-reference to the latest HEAD. Assurance must bind to the stable reviewed submission head already on record, or to an explicitly independent external attestation.

IAA must not produce standalone prebrief, token, or rejection-package files for this pre-brief step.

---

## 6. Completion criteria

A pre-brief is complete only when the wave record contains:

- `## PRE-BRIEF`
- `IAA_PREFLIGHT_BRIEF`
- `schema_version: "1.0.0"`
- `current_head_sha`
- `work_item_id` for PR-bound jobs
- `result: PREFLIGHT_BRIEF_COMPLETE`
- PR/work-item/head binding (or approved no-PR wave fallback binding)

Anything else is advisory text, not a completed pre-brief.
