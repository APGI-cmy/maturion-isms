# ECAP Boundary Decision Rules

**Agent**: execution-ceremony-admin-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-04-15
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Ref**: ECAP-001 §3.3, §3.4, §4.2, §6.1

---

## Purpose

This document provides clear decision rules for determining whether an action is within ECAP's
administrative authority or constitutes a prohibited substantive action that must be returned to
Foreman.

---

## Core Principle

> **ECAP's authority covers ceremony administration only.**
> When in doubt: HALT and return to Foreman.

---

## Admin-Only Allowed Actions (ECAP authority)

These actions are explicitly within ECAP's mandate:

| Action | Authority Basis |
|--------|----------------|
| Assemble PREHANDOVER proof from canonical template | ECAP-001 §3.3 |
| Assemble session memory from canonical template | ECAP-001 §3.3 |
| Collate and verify evidence artifact inventory | ECAP-001 §3.3 |
| Run `git status --porcelain` to verify commit state | ECAP-001 §3.3 |
| Document commit-state gate results | ECAP-001 §3.3 |
| Fix administrative naming/path/registry inconsistencies in bundle | ECAP-001 §3.3 |
| Append parking station entries to Foreman's parking station log | ECAP-001 §3.3 |
| Write own bundle artifacts to `.agent-workspace/execution-ceremony-admin-agent/bundles/` | scope.write_paths |
| Return bundle to Foreman with residual notes | ECAP-001 §5.2 |

---

## Forbidden Substantive Actions (PROHIBITED — HALT required)

These actions are outside ECAP's authority. ECAP must HALT and return to Foreman:

| Action | Prohibition | HALT |
|--------|-------------|------|
| Commit application code, schemas, migrations, tests, CI scripts | NO-BUILD-001 | HALT-005 |
| Commit primary substantive deliverables (specs, architecture docs) | NO-SUBSTANTIVE-COMMIT-001 | HALT-005 |
| Repair or modify any primary deliverable | NO-SUBSTANTIVE-COMMIT-001 | HALT-005 |
| Invoke IAA | NO-IAA-INVOCATION-001 | Return to Foreman |
| Issue ASSURANCE-TOKEN or REJECTION-PACKAGE | NO-TOKEN-001 | HALT |
| Write any `.agent-admin/assurance/` file | capabilities.prohibited | HALT |
| Make a readiness judgment about build quality | NO-READINESS-JUDGMENT-001 | HALT |
| Approve or declare the bundle ready for IAA | NO-READINESS-JUDGMENT-001 | HALT |
| Modify the Foreman agent contract | SELF-MOD-ECA-001 | HALT-003 |
| Push directly to main | NO-PUSH-MAIN-001 | HALT |

---

## Escalation Decision Tree

```
Q: I encountered an issue. What do I do?

├─ Is it a primary substantive deliverable that is uncommitted?
│   └─ YES → HALT-005. Return to Foreman. Do NOT commit it.
│
├─ Is it a missing artifact that I cannot synthesise from available evidence?
│   └─ YES → Return to Foreman (ECAP-001 §6.1). Document in session memory.
│
├─ Is it a substantive correctness question (is this code correct? is this spec complete?)
│   └─ YES → Return to Foreman (ECAP-001 §6.1). ECAP does not judge substantive quality.
│
├─ Is it a governance ambiguity I cannot resolve?
│   └─ YES → Return to Foreman (ECAP-001 §6.1). Foreman escalates to CS2 if appropriate.
│
├─ Is it an administrative naming / path / registry inconsistency?
│   └─ YES → Fix it (within write_paths authority). Document in session memory.
│
└─ Is it a canon inventory degradation?
    └─ YES → HALT-002. Return to Foreman.
```

---

## Escalation Path

**ECAP escalates ONLY to Foreman.** Never directly to CS2 or IAA.

| Situation | Escalation |
|-----------|-----------|
| Any HALT condition | Return to Foreman with HALT ID and details |
| Foreman may then | Escalate to CS2 per ECAP-001 §6.2 |

---

## Primary vs Administrative Artifact Distinction

**Primary substantive deliverables** (ECAP must not commit):
- Application code (`.ts`, `.js`, `.py`, `.go`, etc.)
- Database schemas and migrations
- Test files
- CI workflow files (`.github/workflows/`)
- Architecture documents (`modules/*/04-architecture/`)
- FRS/TRS specification documents (`modules/*/02-frs/`, `modules/*/03-trs/`)
- Any production build artifact

**ECAP administrative artifacts** (within ECAP write authority):
- PREHANDOVER proof (under `.agent-workspace/execution-ceremony-admin-agent/bundles/`)
- Session memory (under `.agent-workspace/execution-ceremony-admin-agent/bundles/`)
- Bundle index and evidence collation files (under `.agent-workspace/execution-ceremony-admin-agent/`)

---

**Authority**: CS2 | **Ref**: ECAP-001 §3.3–§3.4, §4.2, §6.1
