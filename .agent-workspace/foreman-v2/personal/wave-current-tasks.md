# Wave Current Tasks — gov-simplification

**Wave**: gov-simplification  
**Branch**: copilot/gov-simplification-consolidate-artifact-model  
**Issue**: [GOV-SIMPLIFICATION] Consolidate assurance artifact model  
**Date**: 2026-04-13  
**CS2 Authorization**: CS2 supplementary instructions provided (binding)  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-gov-simplification.md` (COMMITTED)
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-gov-simplification.md

---

## Wave Sequencing (CS2 mandated — GAP 6)

### Wave A — Architecture & Schema Design
- [ ] T-A1: Define `iaa-wave-record-{wave}-{date}.md` schema/template with sections: pre-brief, PREHANDOVER, IAA token, rejection_history
- [ ] T-A2: Define scope declaration schema extension with `approved_artifact_paths[]` field
- [ ] T-A3: Define CI gate specification for governance-artifact-gate.yml (or extension point assessment)

### Wave B — Canon Document Updates
- [ ] T-B1: Update `GOVERNANCE_ARTIFACT_TAXONOMY.md` — convert to prescriptive allowlist (GAP 7)
- [ ] T-B2: Update `IAA_PRE_BRIEF_PROTOCOL.md` — reference new consolidated artifact model
- [ ] T-B3: Update `INDEPENDENT_ASSURANCE_AGENT_CANON.md` — reference new artifact paths/patterns
- [ ] T-B4: Update `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` (GAP 5)
- [ ] T-B5: Update `SCOPE_DECLARATION_SCHEMA.md` — add approved_artifact_paths[] (GAP 4)
- [ ] T-B6: Update `scope-declaration.template.md` — add approved_artifact_paths[] field (GAP 4)
- [ ] T-B7: Update `GOVERNANCE_CANON_MANIFEST.md` (GAP 3)

### Wave C — CI Implementation
- [ ] T-C1: Implement governance-artifact-gate.yml CI workflow enforcing approved file paths

### Wave D — Archival Migration
- [ ] T-D1: Archive existing `.agent-admin/assurance/` artifacts to `.agent-admin/assurance/archive/`

### Wave E — CANON_INVENTORY.json & Parity
- [ ] T-E1: Update `governance/CANON_INVENTORY.json` with new file hashes (GAP 3)
- [ ] T-E2: Final parity check

---

## Delegation Plan

| Wave | Builder | Justification |
|------|---------|---------------|
| A | governance-liaison-isms-agent | Architecture/schema is governance design |
| B | governance-liaison-isms-agent | Canon document updates |
| C | qa-builder | CI workflow implementation |
| D | governance-liaison-isms-agent | Archival is governance operations |
| E | governance-liaison-isms-agent | CANON_INVENTORY is governance metadata |