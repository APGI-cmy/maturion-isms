# Wave Current Tasks — token-session-coherence-hardening-20260420

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: token-session-coherence-hardening-20260420
**Issue**: maturion-isms#1422 — Canonize active final-state token/session coherence across the active wave bundle
**Branch**: copilot/canonize-active-final-state-token
**Date**: 2026-04-20
**CS2 Authorization**: CONFIRMED — issue #1422 opened by CS2 (@APGI-cmy) and assigned to foreman-v2-agent
**ceremony_admin_appointed**: false — governance documentation wave; no ECAP ceremony admin appointed
**iaa_wave_record_path**: .agent-admin/assurance/iaa-wave-record-token-session-coherence-hardening-20260420-20260420.md
**iaa_prebrief_commit**: 56f08b8
**iaa_prebrief_status**: COMPLETE — CLEAR-WITH-BLOCKERS (BLOCKER-B: CS2 direct review required for INDEPENDENT_ASSURANCE_AGENT_CANON.md per SELF-MOD-IAA-001)

## Scope Blockers

| Blocker | Description | Resolution |
|---------|-------------|------------|
| BLOCKER-A | wave-current-tasks.md absent | ✅ RESOLVED — this file |
| BLOCKER-B | SELF-MOD-IAA-001 applies to INDEPENDENT_ASSURANCE_AGENT_CANON.md modification | CS2 DIRECT REVIEW required before merge for INDEPENDENT_ASSURANCE_AGENT_CANON.md changes |
| BLOCKER-C | Branch name discrepancy in pre-brief | ✅ RESOLVED — canonical branch: copilot/canonize-active-final-state-token |

## Tasks

| Task ID | Task | Owner | Status |
|---------|------|-------|--------|
| IAA-PRE | IAA Pre-Brief — wave record | independent-assurance-agent | ✅ COMPLETE — SHA 56f08b8 |
| D1 | Add AAP-22 (active final-state token/session incoherence) to `governance/checklists/execution-ceremony-admin-anti-patterns.md` | foreman-v2-agent (governance artifact) | ✅ COMPLETE |
| D2 | Add ACR-16 (IAA rejection trigger) + authoritative-source rule + proof-of-operation to `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` — **CS2 DIRECT REVIEW REQUIRED** | foreman-v2-agent (governance artifact) | ✅ COMPLETE — CS2 direct review required before merge |
| D3 | Add Section 5 token/session coherence checks to `governance/checklists/execution-ceremony-admin-checklist.md` | foreman-v2-agent (governance artifact) | ✅ COMPLETE |
| D4 | Add §4.3e Check L (active-bundle token/session coherence) to `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | foreman-v2-agent (governance artifact) | ✅ COMPLETE |
| D5 | Add active-bundle IAA coherence certification checklist item to `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` | foreman-v2-agent (governance artifact) | ✅ COMPLETE |
| D6 | Add `active_bundle_iaa_coherence` field to `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` | foreman-v2-agent (governance artifact) | ✅ COMPLETE |
| D7 | Update `governance/CANON_INVENTORY.json` hashes for all amended files | foreman-v2-agent (governance artifact) | ✅ COMPLETE |
| C1 | Foreman PREHANDOVER proof | foreman-v2-agent | ✅ COMPLETE — .agent-admin/prehandover/proof-token-session-coherence-20260420.md |
| C2 | Foreman session memory | foreman-v2-agent | ✅ COMPLETE — .agent-workspace/foreman-v2/memory/session-token-session-coherence-20260420.md |

## Deliverable Requirements (per issue #1422)

1. Named anti-pattern (AAP-22) for active final-state token/session contradiction
2. IAA rejection trigger (ACR-16) for this defect class
3. ECAP and/or Foreman checklist rows checking single-token/single-session coherence across active bundle
4. Authoritative-source rule for current token/session reference
5. Clarification of active-bundle vs immutable historical-archive boundaries
6. Proof-of-operation / worked examples (blocked vs allowed state)
7. Updated templates with explicit final token/session reference fields

## Scope Declaration

**Files to be amended**:
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` (v1.3.0 → v1.4.0)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` (v1.9.0 → v1.10.0) — **CS2 DIRECT REVIEW**
- `governance/checklists/execution-ceremony-admin-checklist.md` (v1.2.0 → v1.3.0)
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` (v1.6.0 → v1.7.0)
- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` (v3.1 → v3.2)
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` (v1.1.0 → v1.2.0)
- `governance/CANON_INVENTORY.json` (hash updates)

**Files to be created**:
- `.agent-workspace/foreman-v2/personal/wave-current-tasks-token-session-coherence-20260420.md` (this file)
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-token-session-coherence-20260420.md`
- `.agent-admin/prehandover/proof-token-session-coherence-20260420.md` (Phase 4)
- `.agent-workspace/foreman-v2/memory/session-token-session-coherence-20260420.md` (Phase 4)
