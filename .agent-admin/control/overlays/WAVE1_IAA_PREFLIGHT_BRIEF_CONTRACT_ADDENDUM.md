# Wave 1 IAA Preflight Brief Contract Addendum

**Status:** cleanup-branch scoped overlay  
**Applies to:** `.github/agents/foreman-v2-agent.md` Step 1.8 / Step 2.7 and `.github/agents/independent-assurance-agent.md` Phase 0 only  
**Does not apply to:** IAA final assurance, Foreman handover, ECAP semantics, delegation timing, merge-gate parity, or Wave 5 Foreman Tier 1 simplification  

---

## 1. Purpose

This addendum completes the Wave 1 correction pass without rewriting the Foreman or IAA contracts wholesale.

The prior Wave 1 implementation accidentally simplified broader Foreman and IAA contract behavior. That overreach has been rolled back by restoring both agent contract blobs to their pre-simplification versions.

This addendum is intentionally narrow: it only harmonizes the pre-build IAA pre-brief output.

---

## 2. Foreman Step 1.8 overlay

For Wave 1 and later waves on this cleanup branch, Foreman Step 1.8 must request the canonical pre-brief shape from IAA.

The legacy rich-field instruction in Foreman Step 1.8 is superseded only for the pre-brief payload shape.

Foreman must request:

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
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "<final assurance focus item>"
  result: PREFLIGHT_BRIEF_COMPLETE
```

Foreman must treat the pre-brief as complete only when the wave record contains all of:

- `## PRE-BRIEF`
- `IAA_PREFLIGHT_BRIEF:`
- `schema_version: "1.0.0"`
- `result: PREFLIGHT_BRIEF_COMPLETE`
- PR or wave binding

---

## 3. IAA Phase 0 overlay

For Wave 1 and later waves on this cleanup branch, IAA Phase 0 must produce the canonical `IAA_PREFLIGHT_BRIEF` block above instead of the older three-field-only output.

IAA must write that block only under `## PRE-BRIEF` in:

```text
.agent-admin/assurance/iaa-wave-record-{wave}-{date}.md
```

IAA must not create standalone pre-brief files matching:

```text
.agent-admin/assurance/iaa-prebrief-*.md
```

This overlay affects PRE-BRIEF mode only. It does not alter IAA final assurance phases or binary verdict behavior.

---

## 4. Source of truth

The canonical schema lives at:

```text
.agent-admin/control/schemas/iaa-preflight-brief.schema.json
```

The canonical protocol lives at:

```text
.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md
```

If this addendum conflicts with final assurance, merge-gate parity, ECAP, or handover instructions, those original instructions remain authoritative until their scheduled waves.
