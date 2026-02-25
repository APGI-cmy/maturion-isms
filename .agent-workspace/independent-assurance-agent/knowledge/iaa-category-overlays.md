# IAA Category Overlays

**Agent**: independent-assurance-agent
**Version**: 1.0.0 — STUB
**Status**: STUB — must be populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation
**Last Updated**: 2026-02-25

---

## Purpose

This file defines per-category additional checks that supplement the core invariants checklist.
IAA loads the overlay for the classified PR category in Phase 2 Step 2.4.

---

## AGENT_CONTRACT Overlay

Applied when PR category is `AGENT_CONTRACT`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-AC-001 | AGCFPP-001 policy reference | governance.policy_refs includes AGCFPP-001 with correct path |
| OVL-AC-002 | IAA oversight block | iaa_oversight block present (for foreman/builder class agents) OR policy_refs confirms IAA authority |
| OVL-AC-003 | Four-phase canonical structure | All four phases complete with mandatory evidence output declarations |
| OVL-AC-004 | Self-modification prohibition | CONSTITUTIONAL enforcement on SELF-MOD prohibition |
| OVL-AC-005 | No Tier 2 content embedded | No Tier 2 content inlined in the contract body |
| OVL-AC-006 | PREHANDOVER proof in bundle | PR bundle contains PREHANDOVER proof artifact |
| OVL-AC-007 | Session memory in bundle | PR bundle contains session memory artifact |
| OVL-AC-008 | Tier 2 stub present | `.agent-workspace/<agent>/knowledge/index.md` exists |
| OVL-AC-009 | Character count within limit | Contract body is under 30,000 characters |
| OVL-AC-010 | No hardcoded version strings | Phase body reads identity from YAML, not hardcoded strings |

---

## CANON_GOVERNANCE Overlay

Applied when PR category is `CANON_GOVERNANCE`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-CG-001 | CANON_INVENTORY updated | Changes reflected in CANON_INVENTORY.json with new hashes |
| OVL-CG-002 | No placeholder hashes | No `null`, `""`, `000000`, or truncated hash values |
| OVL-CG-003 | Version bump present | Updated document has bumped version number |
| OVL-CG-004 | Ripple impact assessed | Any impacted agents are flagged for governance ripple update |

---

## CI_WORKFLOW Overlay

Applied when PR category is `CI_WORKFLOW`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-CI-001 | Merge gate checks preserved | All required merge_gate_interface checks remain present |
| OVL-CI-002 | No gate weakening | No check removed, softened, or made non-blocking |
| OVL-CI-003 | Parity enforcement maintained | parity_required and parity_enforcement remain BLOCKING |

---

## AAWP_MAT Overlay

Applied when PR category is `AAWP_MAT`.

| Check ID | Check Name | Description |
|----------|-----------|-------------|
| OVL-AM-001 | Stub population complete | No stub/TODO content in AAWP/MAT deliverables |
| OVL-AM-002 | Evidence artifacts present | Required evidence bundle artifacts present |
| OVL-AM-003 | Governance alignment | Deliverables align with current canon version |

---

## Stub Population Instructions

Extract detailed overlay check specifications from:
`governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`

Timeline: Before Phase B activation. CS2 authorization required.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
