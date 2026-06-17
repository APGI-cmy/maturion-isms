# Wave 5 Foreman Tier 1 Simplification Overlay

**Status:** cleanup-branch scoped overlay  
**Applies to:** `.github/agents/foreman-v2-agent.md` Tier 1 contract body  
**Does not apply to:** final required-check inventory alignment (Wave 6) or validation scenarios (Wave 7)  

---

## 1. Purpose

Wave 5 reduces Foreman Tier 1 to an executable state-machine contract and relocates detailed procedure into Tier 2/control artifacts.

The goal is simplification without weakening: every removed detail must have a named Tier 2 or control artifact home.

---

## 2. New Tier 1 shape

Foreman Tier 1 now follows the planned structure:

1. Identity
2. Non-negotiable prohibitions
3. Invocation order
4. State machine
5. Allowed outputs
6. Handover blockers
7. Tier 2 references

---

## 3. Relocated controls

Detailed operational controls were moved to:

```text
.agent-workspace/foreman-v2/knowledge/foreman-tier2-operating-protocol.md
.agent-workspace/foreman-v2/knowledge/foreman-control-relocation-map.md
```

The relocation map is the audit artifact proving that the simplification is not a control deletion.

---

## 4. Deferred items

Wave 5 does not align the final `merge_gate_interface.required_checks` list with live workflow inventory. That remains Wave 6.

Wave 5 does not prove pass/fail scenarios. That remains Wave 7.

---

## 5. Review posture

Wave 5 is high risk because it edits the Foreman agent contract body. It requires a critical review before Wave 6 starts, with special attention to:

- missing controls;
- weakened blockers;
- accidental transfer of Foreman authority to ECAP or IAA;
- new contradictions between Tier 1 and Tier 2;
- required-check inventory drift deferred to Wave 6 but still visible.
