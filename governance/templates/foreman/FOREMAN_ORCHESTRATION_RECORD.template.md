# FOREMAN ORCHESTRATION RECORD

<!-- Template version: 1.0.0 | Authority: CS2 — issue #1593 | Tier 3 operational template -->
<!-- Use for every wave with implementation, product, governance, workflow, schema, test, or evidence-producing work -->
<!-- Commit this record BEFORE delegating to any builder — START_LOCK requires it -->

## Orchestration Record Metadata

```text
PR:
Issue:
Branch:
Current HEAD:
Wave:
Date (UTC):
Task classification:
Scope summary:
```

## Scope Classification

```text
Implementation files expected: yes/no
Product/runtime files expected: yes/no
Governance/protected paths expected: yes/no
Agent files expected: yes/no
```

## Agent Delegation Matrix

```text
agents_delegated_to:
  - agent:
    role:
    assigned_scope:
    required_evidence:

  - agent:
    role:
    assigned_scope:
    required_evidence:
```

## Role Assignments

```text
Implementation owner:
Builder QA owner:
ECAP owner:
IAA owner:
CodexAdvisor owner (if Tier 1 files touched):
```

## Evidence Paths

```text
Per-PR scope declaration:   .agent-admin/scope-declarations/pr-<PR>.md
Functional delivery evidence:  .functional-delivery/pr-<PR>.md
ECAP / PREHANDOVER proof:
IAA pre-brief:              .agent-admin/assurance/iaa-wave-record-<wave>-<date>.md (## PRE-BRIEF)
IAA final assurance:        .agent-admin/assurance/iaa-wave-record-<wave>-<date>.md (## TOKEN)
Final checkpoint comment:
```

## Execution Lock Status

```text
START_LOCK:       PASS | STOP_AND_FIX
PRODUCT_LOCK:     PASS | NOT_REQUIRED | STOP_AND_FIX
ASSURANCE_LOCK:   PASS | STOP_AND_FIX
HANDOVER_LOCK:    PASS | STOP_AND_FIX

HANDOVER_ALLOWED: yes/no
RESULT:           HANDOVER_ALLOWED | STOP_AND_FIX
```

## Notes

<!-- Add any wave-specific notes, blockers, or escalations here -->

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Template Version**: 1.0.0
**Issue**: #1593
