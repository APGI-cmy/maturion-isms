# Wave 3 Delegation Order Gate Overlay

**Status:** cleanup-branch scoped overlay  
**Applies to:** implementation PRs that change build/test files  
**Does not apply to:** ECAP authority, IAA final assurance semantics, Wave 5 Foreman Tier 1 simplification, or Wave 6 merge-gate inventory alignment  

---

## 1. Purpose

Wave 3 proves delegation timing, not just delegation existence.

A builder delegation artifact is insufficient if it can be created after implementation work. Wave 3 therefore introduces machine-checkable evidence that the IAA pre-brief and builder appointment happened before the first implementation commit.

---

## 2. Delegation order artifact

Implementation PRs must provide:

```text
.agent-admin/control/delegation-order.json
```

validated by:

```text
.agent-admin/control/schemas/delegation-order.schema.json
```

Required evidence:

```yaml
delegation_order:
  prebrief_commit_sha: <commit containing canonical IAA pre-brief>
  builder_appointment_timestamp: <ISO-8601 timestamp>
  builder_appointment_commit_sha: <commit containing builder appointment/delegation evidence>
  builder_agent: <builder agent id>
  builder_task_ref: <task or checklist reference>
  first_implementation_commit_sha: <first implementation commit in this PR>
  qp_review_timestamp: <ISO-8601 timestamp>
```

The strategy listed timestamp fields. This overlay adds `builder_appointment_commit_sha` so CI can prove ordering instead of trusting timestamps alone.

---

## 3. CI ordering rules

The gate must pass only when all are true:

1. The PR changes implementation-like files.
2. `.agent-admin/control/delegation-order.json` exists.
3. `prebrief_commit_sha` resolves to a commit.
4. `builder_appointment_commit_sha` resolves to a commit.
5. `first_implementation_commit_sha` resolves to a commit.
6. `prebrief_commit_sha` is an ancestor of `builder_appointment_commit_sha`.
7. `builder_appointment_commit_sha` is an ancestor of `first_implementation_commit_sha`.
8. `first_implementation_commit_sha` equals the first implementation commit detected from changed implementation files.
9. `first_implementation_commit_sha` is an ancestor of the current PR head.

If no implementation-like files changed, the gate passes without requiring the artifact.

---

## 4. Changed-file scope

Implementation-like files are:

- `modules/*/src/**`
- `apps/*/src/**`
- `packages/*/src/**`
- `supabase/functions/**`
- files under `tests/` or `__tests__/`
- `*.test.*`
- `*.spec.*`

---

## 5. Workflow and script

Named required-check candidate:

```text
preflight/delegation-order-gate
```

Workflow:

```text
.github/workflows/delegation-order-gate.yml
```

Script:

```text
.github/scripts/delegation-order-gate.js
```

---

## 6. Scope discipline

This overlay intentionally does not rewrite Foreman or builder contracts. Contract-body integration is deferred until Wave 5. Required-check inventory alignment is deferred until Wave 6.
