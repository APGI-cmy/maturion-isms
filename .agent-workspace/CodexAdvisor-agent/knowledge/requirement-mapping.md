# CodexAdvisor — Requirement Mapping (Tier 2 Operational Knowledge)

**Agent**: CodexAdvisor-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-21

---

## Purpose

Maps the 56 agent contract requirements (REQ-CM-001 through REQ-AG-004) to checklist items and YAML fields. Use during REVIEW phase to verify all requirements are addressed in a new agent contract.

---

## Requirement Categories

| Category | Range | Count | Description |
|----------|-------|-------|-------------|
| Contract Metadata | REQ-CM-001 — REQ-CM-010 | 10 | YAML frontmatter completeness |
| Governance | REQ-GV-001 — REQ-GV-008 | 8 | Protocol, inventory, identity |
| Merge Gate | REQ-MG-001 — REQ-MG-005 | 5 | Required CI checks |
| Scope | REQ-SC-001 — REQ-SC-006 | 6 | Repository, approval, POLC |
| Escalation | REQ-ES-001 — REQ-ES-005 | 5 | Authority, rules, halt conditions |
| Prohibitions | REQ-PB-001 — REQ-PB-006 | 6 | Constitutional constraints |
| Phase Scripts | REQ-PS-001 — REQ-PS-008 | 8 | Four-phase canonical structure |
| Quality Professor | REQ-QP-001 — REQ-QP-004 | 4 | QP interrupt, self-evaluation |
| Agent-Specific | REQ-AG-001 — REQ-AG-004 | 4 | Role-specific requirements |
| **Total** | | **56** | |

---

## Core Requirements (REQ-CM-001 — REQ-CM-010)

| ID | Requirement | YAML Field | Checklist |
|----|-------------|-----------|-----------|
| REQ-CM-001 | `name` field present | `name:` | ✓ |
| REQ-CM-002 | `id` field present and matches `name` | `id:` | ✓ |
| REQ-CM-003 | `description` field: one-line, role + constraints | `description:` | ✓ |
| REQ-CM-004 | `agent.id` nested under `agent:` | `agent.id:` | ✓ |
| REQ-CM-005 | `agent.class` is one of valid classes | `agent.class:` | ✓ |
| REQ-CM-006 | `agent.version` is `6.2.0` | `agent.version:` | ✓ |
| REQ-CM-007 | `agent.contract_version` follows semver | `agent.contract_version:` | ✓ |
| REQ-CM-008 | `agent.model` nested under `agent:` (not top-level) | `agent.model:` | ✓ |
| REQ-CM-009 | `metadata.tier2_knowledge` points to knowledge index | `metadata.tier2_knowledge:` | ✓ |
| REQ-CM-010 | `metadata.last_updated` present | `metadata.last_updated:` | ✓ |

---

## Governance Requirements (REQ-GV-001 — REQ-GV-008)

| ID | Requirement | YAML Field |
|----|-------------|-----------|
| REQ-GV-001 | `governance.protocol` is `LIVING_AGENT_SYSTEM` | `governance.protocol:` |
| REQ-GV-002 | `governance.canon_inventory` points to `governance/CANON_INVENTORY.json` | `governance.canon_inventory:` |
| REQ-GV-003 | `governance.expected_artifacts` lists at minimum `CANON_INVENTORY.json` | `governance.expected_artifacts:` |
| REQ-GV-004 | `governance.degraded_on_placeholder_hashes: true` | `governance.degraded_on_placeholder_hashes:` |
| REQ-GV-005 | `governance.execution_identity.name` is `"Maturion Bot"` | `governance.execution_identity.name:` |
| REQ-GV-006 | `governance.execution_identity.secret` is `"MATURION_BOT_TOKEN"` | `governance.execution_identity.secret:` |
| REQ-GV-007 | `governance.execution_identity.safety.never_push_main: true` | `governance.execution_identity.safety.never_push_main:` |
| REQ-GV-008 | `governance.execution_identity.safety.write_via_pr_by_default: true` | `governance.execution_identity.safety.write_via_pr_by_default:` |

---

## Phase Script Requirements (REQ-PS-001 — REQ-PS-008)

| ID | Requirement |
|----|-------------|
| REQ-PS-001 | Phase 1 (Wake-Up) references wake-up-protocol.sh |
| REQ-PS-002 | Phase 1 includes CANON_INVENTORY validation with HALT on degraded |
| REQ-PS-003 | Phase 1 loads Tier 2 knowledge index |
| REQ-PS-004 | Phase 2 (Alignment) includes pre-work authorization check |
| REQ-PS-005 | Phase 3 (Work) references Tier 2 for details, does not embed content |
| REQ-PS-006 | Phase 3 includes QP interrupt after every deliverable |
| REQ-PS-007 | Phase 4 (Handover) creates session memory and PREHANDOVER proof |
| REQ-PS-008 | Phase 4 requires QP PASS before proceeding |

---

## Quality Professor Requirements (REQ-QP-001 — REQ-QP-004)

| ID | Requirement |
|----|-------------|
| REQ-QP-001 | QP interrupt is mandatory after EVERY deliverable/handover |
| REQ-QP-002 | QP verdict is binary: PASS or FAIL (no partial) |
| REQ-QP-003 | QP FAIL triggers remediation order, blocks handover |
| REQ-QP-004 | QP check for agent file creation includes: character count ≤30K, 9 components, checklist compliance |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
