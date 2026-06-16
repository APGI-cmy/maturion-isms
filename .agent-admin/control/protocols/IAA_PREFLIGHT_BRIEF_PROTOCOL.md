# IAA Preflight Brief Protocol

**Status:** Wave 1 canonical protocol  
**Schema:** `.agent-admin/control/schemas/iaa-preflight-brief.schema.json`  
**Applies to:** Foreman pre-build orchestration and IAA Phase 0 pre-brief work  

---

## 1. Purpose

This protocol removes the mismatch between Foreman's pre-brief expectation and IAA's Phase 0 output.

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
6. The pre-brief is bound to the current PR or wave.

Foreman must pass the pre-brief path to each builder appointment.

---

## 5. IAA obligations

When invoked with `Action: PRE-BRIEF`, IAA must:

1. Read the PR-scoped wave task file first:

```text
.agent-admin/prs/pr-<PR_NUMBER>/wave-current-tasks.md
```

2. Use the legacy personal path only if the PR-scoped file is absent:

```text
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
```

3. Classify qualifying tasks.
4. Produce the canonical `IAA_PREFLIGHT_BRIEF` block.
5. Commit or update the matching wave record only.
6. Reply with the wave record path and qualifying task count.

IAA must not produce standalone prebrief, token, or rejection-package files for this pre-brief step.

---

## 6. Completion criteria

A pre-brief is complete only when the wave record contains:

- `## PRE-BRIEF`
- `IAA_PREFLIGHT_BRIEF`
- `schema_version: "1.0.0"`
- `result: PREFLIGHT_BRIEF_COMPLETE`
- PR or wave binding

Anything else is advisory text, not a completed pre-brief.
