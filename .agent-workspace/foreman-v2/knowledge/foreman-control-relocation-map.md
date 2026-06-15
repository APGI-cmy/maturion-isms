# Foreman Control Relocation Map

**Status:** Wave 5 control-preservation map  
**Purpose:** Prove that Foreman Tier 1 simplification does not silently remove controls.

---

| Original Tier 1 control area | New Tier 1 home | Tier 2 / control artifact home | Fidelity |
|---|---|---|---|
| Identity, role, authority, self-modification lock | `1. Identity` | `foreman-tier2-operating-protocol.md` §1 | summarized |
| Non-builder/no-implementation boundary | `2. Non-negotiable prohibitions` | `foreman-tier2-operating-protocol.md` §3, §9 | summarized |
| IAA pre-brief mismatch / prebuild invocation | `3. Invocation order`, `4. State machine` | `IAA_PREFLIGHT_BRIEF_PROTOCOL.md`, `WAVE1_IAA_PREFLIGHT_BRIEF_CONTRACT_ADDENDUM.md`, `foreman-tier2-operating-protocol.md` §1–2 | moved to protocol/overlay |
| CS2 authorization gate | `4. State machine` / blockers | `foreman-tier2-operating-protocol.md` §2, §9 | summarized |
| Canon inventory and FAIL-ONLY-ONCE startup checks | `7. Tier 2 references` / blockers | `foreman-tier2-operating-protocol.md` §1, §9; `FAIL-ONLY-ONCE.md` | summarized with existing Tier 2 authority retained |
| Pre-build stages 5–10 | `4. State machine` / blockers | `foreman-tier2-operating-protocol.md` §2 | summarized |
| Builder appointment and evidence | `3. Invocation order`, `4. State machine` | `foreman-tier2-operating-protocol.md` §3; `delegation-order.schema.json`; `WAVE3_DELEGATION_ORDER_GATE.md` | moved to schema/overlay |
| Quality Professor interrupt | `4. State machine` | `foreman-tier2-operating-protocol.md` §4; `FM_QP_ENHANCED_QUICK_REFERENCE.md` | summarized with existing Tier 2 authority retained |
| Pre-handover lane gate | `4. State machine`, `6. Handover blockers` | `handover-allowed.schema.json`; `WAVE2_PREHANDOVER_LANE_GATE.md`; `foreman-tier2-operating-protocol.md` §6 | moved to schema/overlay |
| ECAP admin-only boundary | `3. Invocation order`, `6. Handover blockers` | `ecap-admin-validation.schema.json`; `WAVE4_ECAP_ADMIN_BOUNDARY.md`; `foreman-tier2-operating-protocol.md` §5 | moved to schema/overlay |
| Merge-gate parity and required checks | `6. Handover blockers` | `foreman-tier2-operating-protocol.md` §7; final inventory alignment deferred to Wave 6 | deferred to Wave 6 for inventory alignment |
| IAA final assurance / pass marker ceremony | `3. Invocation order`, `4. State machine`, `6. Handover blockers` | `foreman-tier2-operating-protocol.md` §7; IAA contract remains authority for final assurance | summarized with IAA authority retained |
| Session memory / PREHANDOVER acceptance | `5. Allowed outputs`, `6. Handover blockers` | `session-memory-template.md`; `prehandover-template.md`; `foreman-tier2-operating-protocol.md` §7 | summarized with existing Tier 2 authority retained |
| Agent-contract modification compliance | `2. Non-negotiable prohibitions`, `7. Tier 2 references` | `foreman-tier2-operating-protocol.md` §8; `WAVE5_FOREMAN_TIER1_SIMPLIFICATION.md`; AGCFPP-001 | moved to Wave 5 control note |
| HALT and escalation rules | `2. Non-negotiable prohibitions`, `6. Handover blockers` | `foreman-tier2-operating-protocol.md` §9 | summarized |

---

## Fidelity definitions

- `verbatim`: preserved exactly or near-exactly in Tier 2.
- `summarized`: preserved as a shorter operational rule; original detail is intentionally compressed.
- `moved to schema/overlay`: enforcement now lives primarily in Wave 1–4 control artifacts.
- `deferred to Wave 6`: visible but intentionally not finalized until required-check inventory alignment.
- `existing Tier 2 authority retained`: detailed behavior remains in already-existing Tier 2/canon docs referenced by the map.

---

## Deferred items

- Required-check static inventory alignment remains Wave 6.
- Full validation scenarios remain Wave 7.
- Any unresolved transition limitation remains tracked in `.agent-admin/control/wave-reviews/outstanding-transition-limitations.md`.
