# FOREMAN STOP AND FIX RESPONSE

<!-- Template version: 1.0.0 | Authority: CS2 — issue #1593 | Tier 3 operational template -->
<!-- Use this template ONLY when one or more execution locks fail. -->
<!-- No other output is permitted when a lock fails. -->

## STOP_AND_FIX Response

```text
PR:
Current HEAD:
Date (UTC):
```

## Failing Lock(s)

```text
Failing lock(s): START_LOCK | PRODUCT_LOCK | ASSURANCE_LOCK | HANDOVER_LOCK
(list all that fail)
```

## Failure Details

```text
Failing lock:
Failing checks:
Missing artifacts:
Assigned owner:
Next action:
```

<!-- Repeat the block above for each failing lock if multiple locks fail. -->

## Prohibited Actions

```text
Completion language prohibited: yes
Handover claimed: no
Merge-ready claimed: no
Ready-for-review claimed: no
```

## Result

```text
RESULT: STOP_AND_FIX
```

## Required Follow-Up

- [ ] Missing artifact(s) created or corrected by named owner
- [ ] Execution lock re-evaluated after artifact is committed
- [ ] FOREMAN_EXECUTION_LOCK_STATUS.template.md updated to PASS for resolved lock(s)
- [ ] Failure recorded in session memory
- [ ] wave-current-tasks.md updated with failure state

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Template Version**: 1.0.0
**Issue**: #1593
