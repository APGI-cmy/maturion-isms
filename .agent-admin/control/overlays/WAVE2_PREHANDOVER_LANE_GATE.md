# Wave 2 Pre-Handover Lane Gate Overlay

**Status:** cleanup-branch scoped overlay  
**Applies to:** Foreman Phase 4 entry / completion language only  
**Does not apply to:** IAA final assurance semantics, ECAP authority, delegation timing proof, or Wave 5 Foreman Tier 1 simplification  

---

## 1. Purpose

Wave 2 introduces an early machine-checkable lane gate before Foreman may enter handover or use completion language.

The gate prevents late injection and retrospective compliance by requiring a current `.agent-admin/control/handover-allowed.json` control artifact before handover claims are accepted.

---

## 2. Foreman lane rule

Foreman may not use completion or handover language unless:

```text
.agent-admin/control/handover-allowed.json
```

exists, validates against:

```text
.agent-admin/control/schemas/handover-allowed.schema.json
```

and contains:

```yaml
state: PRE_HANDOVER_GATE_PASS
handover_allowed: true
current_head_sha: <current HEAD>
foreman_qp_pass: true
iaa_prebrief_ready: true
scope_current: true
all_required_checks_green: true
blocking_findings: []
```

If `ecap_required: true`, then `ecap_admin_validated` must also be true.

---

## 3. Completion language

Completion language includes:

- complete
- ready for review
- ready-for-review
- handover
- merge-ready
- released
- done

The CI gate checks for this language and fails if the handover control artifact is missing, stale, or false.

---

## 4. Workflow and script

Named required-check candidate:

```text
preflight/foreman-prehandover-lane-gate
```

Workflow:

```text
.github/workflows/foreman-prehandover-lane-gate.yml
```

Script:

```text
.github/scripts/foreman-prehandover-lane-gate.js
```

---

## 5. Scope discipline

This overlay intentionally does not rewrite the Foreman contract body. It is a Wave 2 scoped control overlay and may be integrated into Foreman Tier 1 during Wave 5, or into merge-gate inventory during Wave 6.
