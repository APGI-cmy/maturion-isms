# PR-Scoped Delegation Order Evidence

This directory contains immutable delegation-order evidence for implementation pull requests.

Required path:

```text
.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json
```

Example:

```text
.agent-admin/control/delegation-orders/pr-1885.json
```

## Why this exists

The previous singleton file caused recurring merge conflicts because every active implementation PR overwrote the same current-wave evidence file:

```text
.agent-admin/control/delegation-order.json
```

That made unrelated PRs invalidate each other's proof chain and created a conflict/gate-failure loop.

## Rule

Implementation PRs must not modify the singleton delegation-order file. They must create or update only their own PR-scoped evidence file.

The required evidence fields are documented in:

```text
.agent-admin/control/overlays/WAVE3_DELEGATION_ORDER_GATE.md
```
