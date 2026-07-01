# PR-Scoped Gate Evidence Canon

## Status

**Type:** Governance canon  
**Authority:** CS2 corrective action  
**Effective Date:** 2026-07-01  
**Applies To:** ISMS repository merge gates, Foreman orchestration, implementation PR handovers

---

## 1. Purpose

This canon prevents the recurring merge-conflict / gate-failure loop caused by storing per-PR evidence in shared singleton current-wave files.

A pull request must not overwrite another pull request's merge evidence. Evidence that belongs to a specific PR must be stored in a PR-scoped immutable path.

---

## 2. Problem statement

The following singleton/current-wave paths are conflict-prone when multiple PRs are open:

```text
.agent-admin/control/delegation-order.json
.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
```

These files may still exist as local or historical agent state, but they must not be used as authoritative merge evidence for implementation PRs.

---

## 3. Required pattern

PR-specific evidence must use PR-scoped paths.

Delegation order evidence:

```text
.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json
```

Scope declaration evidence:

```text
.agent-admin/scope-declarations/pr-<PR_NUMBER>.md
```

Prehandover and assurance evidence should follow the same immutable naming discipline, using either PR number or unique wave ID in the filename.

---

## 4. Gate behaviour

Merge gates must prefer PR-scoped evidence over singleton current-wave files.

For implementation PRs, gates should fail clearly when a PR modifies a singleton current-wave evidence file instead of creating PR-scoped evidence.

Gate failure guidance must explain the expected PR-scoped replacement path.

---

## 5. Recovery rule

When a PR is trapped in a merge-conflict / gate-failure loop:

1. Stop product changes.
2. Rebase or recreate from current `main` once.
3. Carry only product files and PR-scoped evidence.
4. Do not carry singleton current-wave overwrites.
5. If a gate still requires singleton evidence, classify that as gate misalignment and fix the gate in a governance PR.

---

## 6. Immediate implementation

The delegation-order gate now requires implementation PRs to use:

```text
.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json
```

and rejects implementation PRs that modify:

```text
.agent-admin/control/delegation-order.json
```

This is the first hard enforcement step to break the loop. Scope and wave tracker singleton cleanup should follow the same pattern where they are used by workflow-backed gates.
