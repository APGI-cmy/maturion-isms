# IAA Core Invariants Checklist

**Agent**: independent-assurance-agent
**Version**: 1.0.0 — STUB
**Status**: STUB — must be populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation
**Last Updated**: 2026-02-25

---

## Purpose

This checklist defines the core checks applied to EVERY IAA invocation regardless of PR category.
It is the baseline gate that all PRs must pass before category-specific overlay checks apply.

---

## Core Invariants (Stub — to be populated from canon)

| Check ID | Check Name | Description | Applies To |
|----------|-----------|-------------|------------|
| CORE-001 | YAML frontmatter valid | Agent contract YAML is parseable, all required fields present | AGENT_CONTRACT |
| CORE-002 | Agent version correct | agent.version matches LIVING_AGENT_SYSTEM version | AGENT_CONTRACT |
| CORE-003 | Contract version present | agent.contract_version is present and non-zero | AGENT_CONTRACT |
| CORE-004 | Identity block complete | identity.role, mission, class_boundary all present and non-empty | AGENT_CONTRACT |
| CORE-005 | Governance block present | governance.protocol, version, canon_inventory all present | ALL |
| CORE-006 | CANON_INVENTORY alignment | Governance artifacts listed in expected_artifacts exist in CANON_INVENTORY | ALL |
| CORE-007 | No placeholder content | No stub, TODO, or placeholder values in delivered artifacts | ALL |
| CORE-008 | Prohibitions block present | At least one prohibition with id, rule, enforcement fields | AGENT_CONTRACT |
| CORE-009 | Merge gate interface present | merge_gate_interface.required_checks is non-empty | AGENT_CONTRACT |
| CORE-010 | Tier 2 knowledge indexed | tier2_knowledge.index path is correct and index.md exists | AGENT_CONTRACT |
| CORE-011 | Four-phase structure present | Phases 1–4 all present in contract body | AGENT_CONTRACT |
| CORE-012 | Self-modification lock present | SELF-MOD prohibition with CONSTITUTIONAL enforcement present | AGENT_CONTRACT |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or IAA token reference present in PR artifacts (FAIL-ONLY-ONCE A-001) | ALL |
| CORE-014 | No class exemption claim | Invoking agent has not claimed class exemption from IAA (FAIL-ONLY-ONCE A-002) | ALL |
| CORE-015 | Session memory present | Session memory artifact included in PR bundle | ALL |

---

## Stub Population Instructions

Extract detailed check specifications from:
`governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`

Timeline: Before Phase B activation. CS2 authorization required.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
