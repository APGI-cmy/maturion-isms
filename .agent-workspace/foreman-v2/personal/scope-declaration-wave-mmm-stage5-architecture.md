# Scope Declaration — Wave: mmm-stage5-architecture

**Wave**: mmm-stage5-architecture  
**Issue**: maturion-isms#1378  
**Branch**: copilot/mmm-stage-5-wave-start-authorization  
**Session**: mmm-stage5-architecture-20260414  
**Date**: 2026-04-14  
**Declared By**: foreman-v2-agent  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Schema Ref**: governance/canon/SCOPE_DECLARATION_SCHEMA.md §5.7  

---

## Approved Artifact Paths

APPROVED_ARTIFACT_PATHS:
- `modules/MMM/04-architecture/architecture.md` - Canonical Stage 5 Architecture document
- `modules/MMM/04-architecture/capabilities/index.md` - Capabilities index with legacy sub-folder dispositions
- `modules/MMM/04-architecture/COMPLIANCE_SCOPE.md` - ISO 27001/31000/NIST CSF control scope (TR-037)
- `modules/MMM/04-architecture/CONTROL_MAPPING.md` - Control-to-requirement traceability (TR-037)
- `modules/MMM/04-architecture/EVIDENCE_CATALOG.md` - Evidence types per control (TR-037)
- `modules/MMM/04-architecture/APP_STARTUP_REQUIREMENTS.md` - Commissioning checks CHK-001 through CHK-005 (TR-064)
- `modules/MMM/.env.example` - All 8 required environment variables documented (TR-053)
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` - Stage 4 COMPLETE + Stage 5 COMPLETE update
- `modules/MMM/harvest-map/harvest-map.md` - OQ-002 and OQ-003 resolution update
- `.agent-admin/assurance/iaa-wave-record-mmm-stage5-architecture-20260414.md` - IAA wave record (PRE-BRIEF + TOKEN sections)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage5-architecture-20260414.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-mmm-stage5-architecture-20260414.md` - Session memory
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task tracking
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-stage5-architecture.md` - This file
- `.agent-workspace/mat-specialist/memory/session-mmm-stage5-architecture-20260414.md` - mat-specialist session memory

---

## Scope Boundaries

### In Scope
- Produce canonical architecture.md replacing PLACEHOLDER content
- Normalize capabilities/ folder — disposition legacy sub-folders (erm-framework, risk-assessment, threat-module, vulnerability-module, wrac) per OQ-003
- Produce capabilities/index.md documenting legacy sub-folder dispositions
- Produce TRS → Architecture traceability (TR-001 through TR-066)
- Pass Architecture completeness checklist (ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md)
- Resolve OQ-002 (legacy UI / MAT component boundary)
- Resolve OQ-003 (criteria duplication handling)
- Freeze integration boundaries: AIMC, PIT, KUC
- Define runtime / deployment topology
- Define state persistence architecture aligned with TRS
- Produce COMPLIANCE_SCOPE.md (TR-037)
- Produce CONTROL_MAPPING.md (TR-037)
- Produce EVIDENCE_CATALOG.md (TR-037)
- Produce APP_STARTUP_REQUIREMENTS.md (TR-064)
- Produce .env.example (TR-053)
- Update BUILD_PROGRESS_TRACKER (Stage 4 → COMPLETE, Stage 5 → COMPLETE)
- Update harvest map (OQ-002, OQ-003 OPEN → RESOLVED)
- Foreman governance artifacts (wave-current-tasks, scope declaration, PREHANDOVER, session memory)

### Out of Scope
- Stage 6 QA-to-Red execution
- Stage 7 PBFAG execution
- Stage 8 Implementation Planning
- Stage 11 Builder Appointment
- Stage 12 implementation code
- Production database migrations
- Rollout or deployment execution
- Modifications to .github/agents/ files

---

## Undeclared Path Policy

Any agent-created file not listed above is a governance violation per scope declaration policy.
All paths must match an entry in APPROVED_ARTIFACT_PATHS before being committed.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Foreman**: foreman-v2-agent v6.2.0
