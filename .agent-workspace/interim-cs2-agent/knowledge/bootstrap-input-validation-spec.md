# Interim CS2 — Bootstrap Input Validation Specification

**Version**: 1.0.0
**Authority**: CS2-delegated review only
**Purpose**: Define the blocking, structured bootstrap check required before interim CS2 accepts a delivery-review trigger.

## 1. Rule

Every required bootstrap input must have one matrix record with `status: PASS`. The only permitted non-pass states are `MISSING`, `STALE`, `CONTRADICTORY`, and `INVALID`; each is blocking. A non-pass result produces `PRE_REVIEW_HALT` to human CS2 and prevents all trigger alignment and delivery review.

The matrix is review evidence, not an IAA verdict and not a substitute for an implementation-lane gate.

## 2. Required Matrix Records

| `input_id` | Required source | Validation |
|---|---|---|
| `tier1_contract` | `.github/agents/interim-cs2-agent.md` | Exists; YAML parses; identity and contract version are recorded |
| `tier2_required_files` | Every `tier2_knowledge.required_files` contract entry | Each path exists, is readable, and is indexed |
| `continuity_files` | Every `tier2_knowledge.continuity_files` contract entry | Each path exists and is readable |
| `session_memory_window` | Five most recent interim-CS2 session-memory records | Paths, ordering method, and count are recorded; fewer than five requires an explicit no-history/limited-history record |
| `fail_only_once` | `knowledge/FAIL-ONLY-ONCE.md` | Exists, is readable, and any open rule is recorded |
| `personal_learning` | `personal/lessons-learned.md` and `personal/patterns.md` | Exists, is readable, and is included in the record |
| `expected_artifacts` | Every `governance.expected_artifacts` contract entry | Each path exists and is represented in the canonical inventory when inventory coverage applies |
| `canon_inventory_integrity` | `governance/CANON_INVENTORY.json` | UTF-8 JSON parses; no reserved hash marker; expected artifact membership and normalized-hash comparison are recorded |
| `required_check_manifest` | `.agent-admin/control/merge-gate-required-checks.json` | UTF-8 JSON parses; contract `required_checks` and the local parity set are compared and differences recorded |
| `current_head_binding` | `git rev-parse HEAD` and trigger `target_head_sha` | Observed SHA equals target SHA; artifact revisions in the trigger do not contradict that SHA |

## 3. Structured Record Schema

Create one record per `input_id` using this schema:

```yaml
input_id: current_head_binding
required_source: git rev-parse HEAD
validation_method: exact SHA comparison
expected_value: target_head_sha from valid CS2 trigger
observed_value: git rev-parse HEAD output
evidence_path: review packet or command record path
status: PASS
checked_at_utc: ISO-8601 timestamp
```

`status` is computed, never inferred. `STALE` means a source or evidence revision predates or differs from the reviewed target. `CONTRADICTORY` means required sources assert incompatible values. `INVALID` means a required parser, schema, inventory, or integrity check fails.

## 4. Deterministic Evaluation

1. Collect records in the table order in §2.
2. Validate existence/readability before content or revision checks.
3. Parse JSON as UTF-8; compare canonical hashes using the repository-approved normalization rule and record the rule used.
4. Obtain `observed_head_sha` once from `git rev-parse HEAD`; compare it exactly with `target_head_sha`.
5. If any record is not `PASS`, stop with exit class `BOOTSTRAP_HALT`, produce `PRE_REVIEW_HALT`, and do not evaluate a delivery chain.
6. Only an all-`PASS` matrix permits valid-trigger intake.

## 5. Future Enforcement Interface

The implementation lane may enforce this specification without changing its meaning by consuming a matrix document or machine-readable equivalent with these required fields:

```text
records[]: input_id, required_source, validation_method, expected_value,
           observed_value, evidence_path, status, checked_at_utc
observed_head_sha: full Git SHA
target_head_sha: full Git SHA
overall_status: PASS | BOOTSTRAP_HALT
```

An enforcing implementation must return nonzero for any absent required record, any status other than `PASS`, an unparseable manifest/inventory, a reserved inventory hash marker, or unequal current-head SHA values. This specification authorizes no script, workflow, CI, or runtime change.
