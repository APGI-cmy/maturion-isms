# IAA Assurance Token — Session KG-overlays-20260318

**Token Reference**: IAA-session-048-20260318-PASS
**Date**: 2026-03-18
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-048-20260318-PASS

---

## PR Under Review

**Branch**: `copilot/clarify-audit-scope-overlays`
**Title**: Clarify audit scope for cross-reference consistency and version bump history in Tier 2 overlays
**Invoking Agent**: CodexAdvisor-agent (session-048-20260318)
**Producing Agent**: CodexAdvisor-agent, class: overseer
**PR Category**: KNOWLEDGE_GOVERNANCE

---

## Verbatim IAA ASSURANCE-TOKEN Output

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: Branch copilot/clarify-audit-scope-overlays
    "Clarify audit scope for cross-reference consistency and version bump history in Tier 2 overlays"
    CodexAdvisor-agent session-048 | 2026-03-18

All 27 checks PASS. Merge gate parity: PASS (6/6).
Merge permitted (subject to CS2 approval).

Token reference: IAA-session-048-20260318-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════
```

---

## Check Summary

| Layer | Checks | PASS | FAIL |
|-------|--------|------|------|
| FAIL-ONLY-ONCE learning | 4 | 4 | 0 |
| Core invariants (applicable) | 9 | 9 | 0 |
| Category overlay (CERT + KG + INJ) | 14 | 14 | 0 |
| **Total** | **27** | **27** | **0** |

---

## Merge Gate Parity (§4.3)

| Check | Result |
|-------|--------|
| YAML validation | PASS ✅ (N/A — no agent contract files modified) |
| Character count check | PASS ✅ (N/A — no .github/agents/ files modified) |
| Checklist compliance score | PASS ✅ (27/27) |
| Canon hash verification | PASS ✅ (191 entries, 0 placeholder hashes) |
| Stop-and-fix enforcement | PASS ✅ (0 findings) |
| Governance alignment | PASS ✅ (change aligns with CS2 directive) |

**Parity result**: PASS

---

## Artifacts Verified

- PREHANDOVER proof: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-048-20260318.md` — PRESENT ✅
- Session memory: `.agent-workspace/CodexAdvisor-agent/memory/session-048-20260318.md` — PRESENT ✅
- `iaa_audit_token` field: `IAA-session-048-20260318-PASS` — VALID, NON-PLACEHOLDER ✅
- `iaa-category-overlays.md` v3.6.0: header version matches index.md registration ✅
- `index.md` Knowledge Version 3.1.0: consistent with all file version updates ✅

---

## Authority

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**PREHANDOVER proof**: read-only post-commit — NOT edited by IAA (§4.3b)
