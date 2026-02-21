# EVIDENCE ARTIFACT BUNDLE STANDARD

## Status
**Type**: Canonical Governance Policy  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-10  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to BUILD_PHILOSOPHY.md, GOVERNANCE_VALIDATION_PROTOCOL.md

---

## 1. Purpose

This canon defines the **mandatory evidence bundle** for every governed PR. Evidence must be deterministic, machine-readable, and stored under a standard path.

---

## 2. Required Root

All evidence artifacts must live under:

```
.agent-admin/
```

---

## 3. Required Subpaths

Minimum required subpaths:

- `.agent-admin/prehandover/`
- `.agent-admin/gates/`
- `.agent-admin/rca/`
- `.agent-admin/improvements/`
- `.agent-admin/governance/` (sync_state)

---

## 4. Mandatory Evidence Artifacts (per PR)

1. **Prehandover Proof** (human-readable or JSON)
2. **Gate Results Summary** (machine-readable JSON)
3. **Continuous Improvement Capture** (mandatory; may be "PARKED")
4. **RCA** (required when stop-and-fix occurred OR when any gate failed and was repaired)

---

## 5. Machine-Readable Requirement

The Gate Results Summary **must** be structured JSON validated against a schema. Narrative-only claims are forbidden.

---

## 6. No Minimizing Language Enforcement

The following locations are subject to minimizing-language enforcement:
- PR title/body
- Prehandover proof
- RCA

Any banned language per `POLICY-NO-ONLY-LANGUAGE.md` must fail the gate.

---

## 7. Evidence-First Error Standard

All failures must report:
- Missing artifact path
- Required schema
- Action to remediate

No log archaeology is allowed.
