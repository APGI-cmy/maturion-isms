# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave OVL-INJ — Add OVL-INJ-001 Injection Audit Trail check to IAA PREHANDOVER canon
**Session**: session-waveOVLINJ-20260307
**Date**: 2026-03-07
**Issue**: [CodexAdvisor] Add OVL-INJ-001: Injection Audit Trail check to IAA PREHANDOVER canon
**Branch**: copilot/add-injection-audit-trail-check
**CS2 Authorization**: Issue opened and assigned to CodexAdvisor by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-waveOVLINJ-20260307.md` — PENDING

---

## Wave Context

**Governance Change**: Add mandatory PREHANDOVER check `OVL-INJ-001: Injection Audit Trail`
to the IAA canon and category overlays.

**Scope**:
1. A new `INJECTION_AUDIT_TRAIL` overlay section added to `iaa-category-overlays.md`
   (containing `OVL-INJ-001`) — requires that an injection audit trail (posted via the
   audit workflow) is present before the IAA issues a token at handover.
2. `INDEPENDENT_ASSURANCE_AGENT_CANON.md` updated to reference the new overlay and link
   with CodexAdvisor gate `AGCFPP-001`.
3. `CANON_INVENTORY.json` updated with refreshed hashes for modified canon files.
4. IAA knowledge `index.md` version bumped to reflect updated `iaa-category-overlays.md`.

**IAA Trigger Categories**: CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE (MIXED)
**IAA Phase Mode**: PHASE_B_BLOCKING

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status | PR / Evidence |
|---|---------|------|---------|--------|---------------|
| 1 | T-OVLINJ-001 | Add `OVL-INJ-001` overlay + `INJECTION_AUDIT_TRAIL` section to `iaa-category-overlays.md` v3.1.0→v3.2.0 | CodexAdvisor-agent | 🔴 PENDING | This PR |
| 2 | T-OVLINJ-002 | Update `INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.3.0→v1.4.0 — add §INJECTION_AUDIT_TRAIL mandatory PREHANDOVER check; link with AGCFPP-001 | CodexAdvisor-agent | 🔴 PENDING | This PR |
| 3 | T-OVLINJ-003 | Bump IAA knowledge `index.md` v2.6.0→v2.7.0 — reflect updated `iaa-category-overlays.md` version | CodexAdvisor-agent | 🔴 PENDING | This PR |
| 4 | T-OVLINJ-004 | Update `governance/CANON_INVENTORY.json` — refresh hashes for `INDEPENDENT_ASSURANCE_AGENT_CANON.md` | CodexAdvisor-agent | 🔴 PENDING | This PR |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Batch | Token | Date |
|------|-------|-------|------|
| — | Wave OVL-INJ | PENDING | — |

---

## Wave Completion Gate

- [ ] T-OVLINJ-001: iaa-category-overlays.md v3.2.0 committed with OVL-INJ-001 section
- [ ] T-OVLINJ-002: INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.4.0 committed
- [ ] T-OVLINJ-003: IAA knowledge index.md v2.7.0 committed
- [ ] T-OVLINJ-004: CANON_INVENTORY.json updated and committed
- [ ] IAA Pre-Brief artifact exists at `.agent-admin/assurance/iaa-prebrief-waveOVLINJ-20260307.md`
- [ ] IAA ASSURANCE-TOKEN received for this PR
- [ ] CS2 notified for merge approval
