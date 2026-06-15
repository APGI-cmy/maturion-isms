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
current_head_sha: <current PR head SHA>
foreman_qp_pass: true
iaa_prebrief_ready: true
scope_current: true
all_required_checks_green: true
blocking_findings: []
```

If implementation files changed, the artifact must also contain:

```yaml
builder_delegation_verified: true
delegation_precedes_implementation: true
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

The CI gate scans changed Foreman/ECAP handover artifacts for this language. It does not scan the entire repository and does not treat strategy/control documentation as a handover claim.

---

## 4. Changed-file scope

The gate is relevant only when the PR changes one or more of:

- implementation files under `modules/*/src`, `apps/*/src`, `packages/*/src`, or `supabase/functions`;
- test files matching `*.test.*`, `*.spec.*`, `tests/`, or `__tests__/`;
- Foreman memory or PREHANDOVER artifacts under `.agent-workspace/foreman-v2/memory/`;
- ECAP handover bundles under `.agent-workspace/execution-ceremony-admin-agent/bundles/`;
- changed Foreman/ECAP handover artifacts containing completion language.

If none of those changed-file conditions are true, the gate passes without requiring `handover-allowed.json`.

---

## 5. Workflow and script

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

## 6. Scope discipline

This overlay intentionally does not rewrite the Foreman contract body. It is a Wave 2 scoped control overlay and may be integrated into Foreman Tier 1 during Wave 5, or into merge-gate inventory during Wave 6.
