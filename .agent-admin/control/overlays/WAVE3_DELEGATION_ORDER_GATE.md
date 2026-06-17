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

## 3. CI strict ordering rules

The gate must pass only when all are true:

1. The PR changes implementation-like files.
2. `.agent-admin/control/delegation-order.json` exists.
3. `prebrief_commit_sha` resolves to a commit.
4. `builder_appointment_commit_sha` resolves to a commit.
5. `first_implementation_commit_sha` resolves to a commit.
6. `prebrief_commit_sha !== builder_appointment_commit_sha`.
7. `builder_appointment_commit_sha !== first_implementation_commit_sha`.
8. `prebrief_commit_sha` is a strict ancestor of `builder_appointment_commit_sha`.
9. `builder_appointment_commit_sha` is a strict ancestor of `first_implementation_commit_sha`.
10. `first_implementation_commit_sha` equals the first implementation commit detected from changed implementation files.
11. `first_implementation_commit_sha` is an ancestor of the current PR head.

Same-commit proof is not accepted. A commit that contains both the builder appointment and implementation change cannot prove that delegation happened before implementation.

If no implementation-like files changed, the gate passes without requiring the artifact.

---

## 4. STOP-AND-FIX guidance

If delegation order cannot be proven, the gate emits explicit STOP-AND-FIX guidance:

```text
STOP_AND_FIX: Delegation order could not be proven. Required order: canonical IAA pre-brief commit -> builder appointment commit -> first implementation commit. Same-commit proof is not accepted because it cannot prove delegation happened before implementation. Record/commit IAA pre-brief and builder appointment before implementation, or obtain explicit CS2 waiver outside delegation-order.json. Do not proceed to handover.
```

---

## 5. Waiver policy

Wave 3 does not add a generic waiver field to `delegation-order.json`.

If an exception is truly required, it must be an explicit CS2 waiver outside the artifact, recorded in the PR or a separate CS2-approved transition note. The delegation-order artifact itself remains proof-only and should not self-waive its own failure.

---

## 6. Changed-file scope

Implementation-like files are:

- `modules/*/src/**`
- `apps/*/src/**`
- `packages/*/src/**`
- `supabase/functions/**`
- files under `tests/` or `__tests__/`
- `*.test.*`
- `*.spec.*`

---

## 7. Workflow and script

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

## 8. Scope discipline

This overlay intentionally does not rewrite Foreman or builder contracts. Contract-body integration is deferred until Wave 5. Required-check inventory alignment is deferred until Wave 6.
