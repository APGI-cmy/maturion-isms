# Wave 4 ECAP Administrative Boundary Overlay

**Status:** cleanup-branch scoped overlay  
**Applies to:** ECAP bundle production and administrative validation outputs  
**Does not apply to:** Foreman QP judgment, IAA final assurance semantics, delegation timing proof, Wave 5 Foreman Tier 1 simplification, or Wave 6 merge-gate inventory alignment  

---

## 1. Purpose

Wave 4 demotes ECAP from any possible readiness-producing role to a narrow administrative validator/compiler role.

ECAP validates ceremony/admin evidence. Foreman owns operational readiness and QP judgment. IAA owns independent assurance. CS2 owns merge authority.

---

## 2. ECAP may

ECAP may:

- check required admin fields;
- validate scope declaration freshness;
- validate PR admin JSON freshness;
- validate that cited evidence paths resolve;
- validate commit-state truth for admin artifacts;
- produce an administrative validation summary;
- return admin findings to Foreman.

Allowed result language:

```text
ADMIN_VALIDATED
ADMIN_BLOCKED
READY_FOR_FOREMAN_ADMIN_REVIEW
```

---

## 3. ECAP may not

ECAP may not:

- decide build readiness;
- decide merge readiness;
- declare implementation complete;
- rewrite or replace Foreman QP judgment;
- invoke IAA;
- issue or simulate an assurance token;
- issue or simulate a rejection package;
- convert failed substantive work into an admin-complete handover.

Forbidden result language includes:

```text
ready for IAA
ready for merge
merge-ready
build ready
implementation complete
assurance token
rejection package
```

---

## 4. Administrative validation artifact

ECAP administrative validation should use:

```text
.agent-admin/control/templates/ECAP_ADMIN_VALIDATION_SUMMARY.template.md
```

and should conform to:

```text
.agent-admin/control/schemas/ecap-admin-validation.schema.json
```

The artifact must explicitly report:

```yaml
substantive_readiness_judgment_made: false
iaa_invoked_by_ecap: false
foreman_qp_judgment_rewritten: false
admin_validation_result: ADMIN_VALIDATED | ADMIN_BLOCKED
```

---

## 5. IAA treatment of ECAP evidence

IAA must treat ECAP validation as administrative evidence only.

ECAP validation may support artifact/path/scope/commit-state checks. It must not be used as a substitute for Foreman QP PASS, builder evidence, current HEAD gate results, or IAA's own final assurance judgment.

---

## 6. Scope discipline

This overlay intentionally does not rewrite ECAP, Foreman, or IAA contract bodies. Contract-body integration is deferred until Wave 5. Required-check inventory alignment is deferred until Wave 6.
