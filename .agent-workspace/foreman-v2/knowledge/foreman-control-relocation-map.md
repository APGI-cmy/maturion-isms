# Foreman Control Relocation Map

**Status:** Wave 5 control-preservation map  
**Purpose:** Prove that Foreman Tier 1 simplification does not silently remove controls.

---

| Original Tier 1 control area | New Tier 1 home | Tier 2 / control artifact home |
|---|---|---|
| Identity, role, authority, self-modification lock | `1. Identity` | `foreman-tier2-operating-protocol.md` §1 |
| Non-builder/no-implementation boundary | `2. Non-negotiable prohibitions` | `foreman-tier2-operating-protocol.md` §3, §8 |
| IAA pre-brief mismatch / prebuild invocation | `3. Invocation order`, `4. State machine` | `IAA_PREFLIGHT_BRIEF_PROTOCOL.md`, `WAVE1_IAA_PREFLIGHT_BRIEF_CONTRACT_ADDENDUM.md`, `foreman-tier2-operating-protocol.md` §1–2 |
| CS2 authorization gate | `4. State machine` / blockers | `foreman-tier2-operating-protocol.md` §2, §8 |
| Canon inventory and FAIL-ONLY-ONCE startup checks | `7. Tier 2 references` / blockers | `foreman-tier2-operating-protocol.md` §1, §8; `FAIL-ONLY-ONCE.md` |
| Pre-build stages 5–10 | `4. State machine` / blockers | `foreman-tier2-operating-protocol.md` §2 |
| Builder appointment and evidence | `3. Invocation order`, `4. State machine` | `foreman-tier2-operating-protocol.md` §3; `delegation-order.schema.json`; `WAVE3_DELEGATION_ORDER_GATE.md` |
| Quality Professor interrupt | `4. State machine` | `foreman-tier2-operating-protocol.md` §4; `FM_QP_ENHANCED_QUICK_REFERENCE.md` |
| Pre-handover lane gate | `4. State machine`, `6. Handover blockers` | `handover-allowed.schema.json`; `WAVE2_PREHANDOVER_LANE_GATE.md`; `foreman-tier2-operating-protocol.md` §5 |
| ECAP admin-only boundary | `3. Invocation order`, `6. Handover blockers` | `ecap-admin-validation.schema.json`; `WAVE4_ECAP_ADMIN_BOUNDARY.md`; `foreman-tier2-operating-protocol.md` §6 |
| Merge-gate parity and required checks | `6. Handover blockers` | `foreman-tier2-operating-protocol.md` §7; final inventory alignment deferred to Wave 6 |
| IAA final assurance / token ceremony | `3. Invocation order`, `4. State machine`, `6. Handover blockers` | `foreman-tier2-operating-protocol.md` §7; IAA contract remains authority for final assurance |
| Session memory / PREHANDOVER acceptance | `5. Allowed outputs`, `6. Handover blockers` | `session-memory-template.md`; `prehandover-template.md`; `foreman-tier2-operating-protocol.md` §7 |
| HALT and escalation rules | `2. Non-negotiable prohibitions`, `6. Handover blockers` | `foreman-tier2-operating-protocol.md` §8 |

---

## Deferred items

- Required-check static inventory alignment remains Wave 6.
- Full validation scenarios remain Wave 7.
- Any unresolved transition limitation remains tracked in `.agent-admin/control/wave-reviews/outstanding-transition-limitations.md`.
