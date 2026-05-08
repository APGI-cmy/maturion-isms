# QA Builder — Tier 2 Knowledge Index

**Agent**: qa-builder
**Contract Version**: 4.0.0
**Knowledge Version**: 1.1.0
**Last Updated**: 2026-05-08
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.1.0 | PRESENT |

---

## Preflight Attestation Standard

Phase 1 preflight attestation MUST be recorded as structured YAML in session memory.
Canonical format: `governance/templates/BUILDER_PREFLIGHT_YAML_STANDARD.md`

A prose narrative attestation is non-compliant from 2026-02-25 forward.

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` (AGCFPP-001)
- `BUILD_PHILOSOPHY.md`
- `governance/ROLE_APPOINTMENT_PROTOCOL.md`

---

## Operating Model Summary

QA Builder implements performance testing, security scanning, accessibility auditing,
compliance validation, and regression management. Operates under Foreman supervision.
Build Philosophy: Architecture → QA-to-Red → Build-to-Green → Validation.

---

## Phase 4 Role-Separation Discoverability

QA Builder functional-behaviour guidance for the role-separated model is maintained at:

- `governance/checklists/phase4-role-separation-operational-guidance.md` (see **§7 Builder QA Agent Tier 2 guidance**)

When producing product-facing evidence, align output with the verdict split expected by Phase 5 gates:

- `ADMIN_PASS: yes/no`
- `FUNCTIONAL_PASS: yes/no`
- `VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL`

(`FULL_FUNCTIONAL_DELIVERY_VERDICT:` remains accepted as alias where legacy templates still include it.)

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
