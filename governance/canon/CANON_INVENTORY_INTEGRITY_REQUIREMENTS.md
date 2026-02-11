# CANON INVENTORY INTEGRITY REQUIREMENTS

## Status
**Type**: Canonical Governance Policy  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-10  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to GOVERNANCE_RIPPLE_MODEL.md, GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md

---

## 1. Purpose

This canon defines integrity requirements for `governance/CANON_INVENTORY.json` and any inventories consumed by alignment workflows. It ensures consumers can verify canonical governance artifacts without ambiguity.

---

## 2. Hash Requirements

- **Placeholder hashes are forbidden** for any artifact required by consumers
- Required algorithm: **full sha256** (git blob SHA optional)
- Truncated hashes may be stored only if full sha256 is also recorded elsewhere

---

## 3. Provenance Requirements

Every inventory entry must record:
- Canonical commit SHA that produced the entry
- Canon effective date
- Artifact path

---

## 4. Degraded Mode Behavior

If a consumer detects:
- Missing inventory
- Placeholder hashes
- Missing canonical commit SHA

Then the consumer must:
1. Mark alignment status as `DEGRADED`
2. Block merge gates until resolved
3. Create an escalation issue in the governance repo

---

## 5. Escalation Path

**Required escalation**: Governance Change Request issue with CS2 authorization.

The issue must include:
- Inventory entry or file in violation
- Evidence of missing integrity fields
- Proposed remediation

---

## 6. Compliance Enforcement

`merge-gate/verdict` must fail if inventory integrity is compromised for required artifacts.
