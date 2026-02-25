# UI Builder — Tier 2 Knowledge Index

**Agent**: ui-builder
**Contract Version**: 4.0.0
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-25
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.0.0 | PRESENT |
| `wave-component-specs.md` | Wave-specific UI component specifications | — | PRESENT |

---

## Preflight Attestation Standard

Phase 1 preflight attestation MUST be recorded as structured YAML in session memory.
Canonical format: `governance/templates/BUILDER_PREFLIGHT_YAML_STANDARD.md`

A prose narrative attestation is non-compliant from 2026-02-25 forward.

## Constitutional Character Count Limit

`.github/agents/ui-builder.md` MUST remain below 30,000 characters at all times.
CI gate `governance/ui-builder-character-count` (workflow: `governance-hardening.yml`)
will block any PR that pushes this file to or above the limit.
Verify locally before every update: `wc -c .github/agents/ui-builder.md`

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` (AGCFPP-001)
- `BUILD_PHILOSOPHY.md`
- `governance/ROLE_APPOINTMENT_PROTOCOL.md`

---

## Operating Model Summary

UI Builder implements React frontend components, layouts, responsive design, and accessibility
from frozen architecture specifications. Operates under Foreman supervision.
Build Philosophy: Architecture → QA-to-Red → Build-to-Green → Validation.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
