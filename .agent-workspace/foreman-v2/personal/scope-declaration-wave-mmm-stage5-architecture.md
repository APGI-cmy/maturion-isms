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
- `modules/MMM/04-architecture/capabilities/index.md` - Capabilities index (if created)
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` - Stage 4 COMPLETE + Stage 5 progress update
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
- Produce TRS → Architecture traceability (TR-001 through TR-066)
- Pass Architecture completeness checklist (ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md)
- Resolve OQ-002 (legacy UI / MAT component boundary)
- Resolve OQ-003 (criteria duplication handling)
- Freeze integration boundaries: AIMC, PIT, KUC
- Define runtime / deployment topology
- Define state persistence architecture aligned with TRS
- Update BUILD_PROGRESS_TRACKER (Stage 4 → COMPLETE, Stage 5 → COMPLETE/IN_PROGRESS)
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
