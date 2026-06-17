# Wave 6 Merge Gate Required Checks Alignment Overlay

**Status:** cleanup-branch scoped overlay  
**Applies to:** Foreman `merge_gate_interface.required_checks`, required-check manifest, and live workflow-backed gate names  
**Does not apply to:** Wave 7 pass/fail scenario validation or final merge approval  

---

## 1. Purpose

Wave 6 aligns the static Foreman required-check list with the cleanup branch's required-check manifest and workflow-backed gate names.

The authority for the required-check inventory is now:

```text
.agent-admin/control/merge-gate-required-checks.json
```

The parity enforcement script is:

```text
.github/scripts/merge-gate-required-checks-alignment.js
```

The workflow check name is:

```text
preflight/merge-gate-required-checks-alignment
```

---

## 2. Required checks added by Wave 6

Wave 6 adds the cleanup gates to Foreman `merge_gate_interface.required_checks`:

```text
preflight/iaa-prebrief-contract-alignment
preflight/foreman-prehandover-lane-gate
preflight/delegation-order-gate
preflight/ecap-admin-boundary-gate
preflight/merge-gate-required-checks-alignment
```

---

## 3. Mapping rule

Every required check must be one of:

1. workflow-backed and discoverable by live workflow job name; or
2. explicitly mapped as legacy/external in the manifest with a reason.

Unmapped required checks are not allowed.

---

## 4. Wave 7 boundary

Wave 6 aligns the inventory and naming. It does not prove behavioral pass/fail scenarios.

Wave 7 must still validate scenarios including missing pre-brief, missing delegation, retroactive delegation, stale handover artifact, ECAP admin validation missing when required, and handover language without `handover-allowed.json`.

---

## 5. Review posture

Wave 6 should receive critical review before Wave 7 starts, with attention to:

- manifest/Foreman list drift;
- workflow job-name mismatch;
- legacy/external checks that should be removed rather than mapped;
- required checks that are mapped but not behaviorally validated until Wave 7.
