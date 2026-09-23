# Active-CS2 — Bootstrap Input Validation Specification

## Rule

Every required bootstrap input must have `status: PASS`. `MISSING`, `STALE`, `CONTRADICTORY`, and `INVALID` are blocking and produce a fail-closed handoff.

## Required records

| input_id | Required source | Validation |
|---|---|---|
| `tier1_contract` | `.github/agents/active-cs2-agent.md` | File exists; YAML parses; identity and contract version recorded |
| `tier2_required_files` | Every `tier2_knowledge.required_files` path | Each file exists, is readable, and is indexed |
| `continuity_files` | Every `tier2_knowledge.continuity_files` path | Each file exists and is readable |
| `session_history_or_no_history` | last five session memory files or explicit none-yet note | Honest no-history state recorded for a new agent |
| `canon_inventory_integrity` | `governance/CANON_INVENTORY.json` | UTF-8 JSON parses; no reserved markers; expected artifacts present |
| `active_cs2_governance` | active-CS2 canon + control map | Paths exist and versions are recorded |
| `job_wave_schema_and_templates` | schema, merge-policy schema, job record template, dispatch template | Paths exist and are readable |
| `pr_scoped_manifest` | `.admin/prs/pr-<PR>.json` | Exists; PR/issue/branch/base/head binding coherent |
| `pr_scoped_scope` | `.agent-admin/scope-declarations/pr-<PR>.md` | Exists; exact PR and branch binding recorded |
| `pr_scoped_wave_tasks` | `.agent-admin/prs/pr-<PR>/wave-current-tasks.md` | Exists; active task set and current-head model recorded |
| `current_head_binding` | `git rev-parse HEAD` + PR-scoped records | Observed head matches intended reviewed head model |
| `iaa_prebrief_record` | PR-scoped IAA wave record | Exists before any builder/specialist implementation lane starts |

## Record schema

```yaml
input_id: iaa_prebrief_record
required_source: .agent-admin/assurance/iaa-wave-record-pr-2057-active-cs2-successor-20260923.md
validation_method: path existence + PR/issue/branch match
expected_value: PRE-BRIEF bound to PR #2057 / issue #2056
observed_value: [observed path or mismatch text]
status: PASS
checked_at_utc: <ISO-8601>
```

## Evaluation

1. Validate existence/readability first.
2. Parse JSON/YAML/text only after existence succeeds.
3. Treat missing PR-scoped carriers as blocking bootstrap defects.
4. Treat absent runtime/controller surfaces as non-bootstrap only when the current invocation is bundle drafting or loadability validation rather than live dispatch.
5. An all-`PASS` matrix permits alignment; any non-pass requires a typed halt or handoff.
