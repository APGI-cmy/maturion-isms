# PENDING CANON REFERENCES INTERIM GUIDANCE

## Status
**Type**: Governance Guidance (Interim)  
**Authority**: CS2  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document provides **interim guidance** for handling references to canonical governance documents that may be referenced but whose locations were previously unclear. It clarifies the **current status** of critical canon files and provides **workaround guidance** for agents encountering pending or missing canon references.

This guidance exists to ensure:
- **Zero ambiguity** on canonical document locations
- **Clear fallback** when canon references are unresolved
- **Agent continuity** - work can proceed with limitations documented
- **Transparent status** - agents know what exists and what doesn't

**Core Principle**: When canon references are unclear or pending, agents must document limitations and proceed with caution, escalating to CS2 if canon is critical for work.

---

## 2. Constitutional Authority

This guidance derives authority from and implements:
- **LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md** - Pending canon reference detection
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check and canon discovery
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and inventory
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent responsibilities

---

## 3. Critical Canon Files Status (GAP-007 Resolution)

### 3.1 FM_ROLE_CANON.md

**Status**: ✅ **PUBLISHED**

**Location**: `governance/maturion/FM_ROLE_CANON.md`

**Canonical Reference**: This file exists and is the authoritative source for Foreman (FM) role, authority, autonomy, responsibilities, and prohibitions.

**Version**: Last updated 2026-01-03

**Applies To**: Foreman agents, all builder supervision, wave planning

**Agent Guidance**: Reference this file at wake-up. No workarounds needed - file is published and accessible.

---

### 3.2 WAVE_MODEL.md

**Status**: ✅ **PUBLISHED**

**Location**: `governance/canon/WAVE_MODEL.md`

**Canonical Reference**: This file exists and is the authoritative source for wave hierarchy, wave lifecycle, combined wave testing, and wave planning.

**Version**: 1.0.0, effective 2026-02-08

**Applies To**: Foreman agents, all wave execution, all application development

**Agent Guidance**: Reference this file at wake-up. No workarounds needed - file is published and accessible.

---

### 3.3 LIVING_AGENT_SYSTEM.md

**Status**: ✅ **PUBLISHED**

**Location**: `governance/canon/LIVING_AGENT_SYSTEM.md`

**Canonical Reference**: This file exists and is the authoritative source for Living Agent System (LAS v5.0.0), agent lifecycle, wake-up protocol, session closure, and dynamic memory.

**Version**: 1.0.0, effective 2026-02-04

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file at wake-up. Execute wake-up and closure protocols per this document. No workarounds needed - file is published and accessible.

---

## 4. Newly Published Canon Files (2026-02-08)

### 4.1 AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md

**Status**: ✅ **PUBLISHED** (2026-02-08)

**Location**: `governance/canon/AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md`

**Purpose**: Canonical gate protocols for each agent class (overseer, liaison, builder, foreman)

**Version**: 1.0.0

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file for merge gate requirements specific to your agent class.

---

### 4.2 GOVERNANCE_ARTIFACT_TAXONOMY.md

**Status**: ✅ **PUBLISHED** (2026-02-08)

**Location**: `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md`

**Purpose**: Canonical taxonomy of governance artifacts (7 types), testing requirements, ripple triggers

**Version**: 1.0.0

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file to classify artifacts and determine ripple/testing requirements.

---

### 4.3 SELF_ALIGNMENT_AUTHORITY_MODEL.md

**Status**: ✅ **PUBLISHED** (2026-02-08)

**Location**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md`

**Purpose**: Canonical self-alignment authority model, defines what each agent class may self-align vs escalate

**Version**: 1.0.0

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file to determine self-alignment authority boundaries for your agent class.

---

### 4.4 LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md

**Status**: ✅ **PUBLISHED** (2026-02-08)

**Location**: `governance/canon/LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md`

**Purpose**: Canonical wake-up health check protocol, 7-phase workflow, drift detection, auto-remediation

**Version**: 1.0.0

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file for detailed wake-up health check procedure. Implement wake-up scripts per this protocol.

---

### 4.5 GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md

**Status**: ✅ **PUBLISHED** (2026-02-08)

**Location**: `governance/canon/GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md`

**Purpose**: Canonical ripple signaling, detection, response SLA, audit trail

**Version**: 1.0.0

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file for ripple detection, signaling mechanisms, and SLA requirements.

---

### 4.6 GOVERNANCE_VALIDATION_PROTOCOL.md

**Status**: ✅ **PUBLISHED** (2026-02-08)

**Location**: `governance/canon/GOVERNANCE_VALIDATION_PROTOCOL.md`

**Purpose**: Canonical validation protocol, agent-specific validation checklists (BtG vs non-BtG)

**Version**: 1.0.0

**Applies To**: All agents, all repositories

**Agent Guidance**: Reference this file for validation requirements specific to your agent class and artifact types.

---

## 5. Handling Pending Canon References

### 5.1 When Agent Encounters Pending Canon Reference

**Scenario**: Agent contract or governance document references a file that doesn't exist or is marked "PENDING" or "TBD"

**Procedure**:

1. **Detect Pending Reference** (during wake-up health check, Phase 3: Governance Discovery)
   - Example: Reference to `governance/canon/GOVERNANCE_ENFORCEMENT_AUTOMATION.md` (pending)
   - Example: Reference to legacy Tier-0 manifest placeholder (superseded by `CANON_INVENTORY.json`)

2. **Document Limitation** (in working contract)
   ```markdown
   ## Limitations/Warnings
   ⚠️ Pending canon referenced: GOVERNANCE_ENFORCEMENT_AUTOMATION.md
   ⚠️ Work may proceed but assumes standard enforcement rules apply
   ⚠️ Validate assumptions if canon published during session
   ```

3. **Proceed with Caution**
   - If canon is **non-critical** for work → Proceed, document assumption
   - If canon is **critical** for work → Escalate to CS2 for guidance

4. **Validate Assumptions** (if canon published during session)
   - Re-run governance discovery
   - Validate work against newly published canon
   - Adjust if needed

---

### 5.2 Critical vs Non-Critical Canon

**Critical Canon** (work cannot proceed safely without):
- Constitutional canon (BUILD_PHILOSOPHY, FM_ROLE_CANON, WAVE_MODEL, LIVING_AGENT_SYSTEM)
- Agent class gate protocols (AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS)
- Self-alignment authority model (SELF_ALIGNMENT_AUTHORITY_MODEL)
- Artifact taxonomy (GOVERNANCE_ARTIFACT_TAXONOMY)

**If critical canon missing** → **HALT** and escalate to CS2

**Non-Critical Canon** (work can proceed with documented assumptions):
- Operational runbooks
- Advanced automation protocols
- Enhancement proposals
- Specialized domain protocols

**If non-critical canon missing** → Proceed, document limitation

---

### 5.3 Escalation for Missing Critical Canon

**If critical canon missing or unclear**:

1. **Create Escalation Document**:
   ```markdown
   # Escalation: Missing Critical Canon
   
   **Agent**: <agent-id>
   **Date**: YYYY-MM-DD
   **Session**: <session-id>
   
   ## Missing Canon
   - File: <canon-file-name>
   - Referenced In: <source-file>
   - Criticality: CRITICAL
   
   ## Impact
   - Cannot validate <aspect> without canon
   - Work cannot proceed safely
   - Risk of constitutional non-compliance
   
   ## Request
   CS2 guidance:
   1. Is canon pending publication? Timeline?
   2. Interim workaround or guidance?
   3. May work proceed with documented assumptions?
   ```

2. **Notify CS2** - Create GitHub issue with label `escalation:cs2`

3. **HALT Work** - Do not proceed until CS2 provides guidance

---

## 6. Agent-Specific Interim Guidance

### 6.1 Liaison Agents

**If pending canon referenced**:
- Document in working contract
- Proceed with inventory/documentation work (low risk)
- Halt constitutional interpretation work (high risk)
- Escalate if canon affects governance artifact classification or ripple

**Safe Work Types** (can proceed with pending canon):
- Inventory updates
- Cross-reference repairs
- Documentation clarifications
- Evidence generation

**Risky Work Types** (should escalate):
- Constitutional canon modifications
- Agent contract modifications
- New governance policy creation

---

### 6.2 Builder Agents

**If pending canon referenced**:
- Builder work typically doesn't depend on governance canon (code vs governance)
- Proceed with build-to-green execution
- Escalate to Foreman (FM) if QA interpretation unclear

**Note**: Builders should NOT encounter pending canon references (builders work with application code, not governance).

---

### 6.3 Foreman Agents

**If pending canon referenced**:
- Document in wave plan and working contract
- If canon affects wave planning → Escalate to CS2
- If canon affects QA interpretation → Escalate to CS2
- If canon is operational guidance → Proceed with documented assumptions

**Critical for FM**: FM_ROLE_CANON, WAVE_MODEL, FOREMAN_MEMORY_PROTOCOL, FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL

**If any critical FM canon missing** → HALT and escalate

---

### 6.4 Overseer Agents

**If pending canon referenced**:
- Document in oversight report
- If canon affects constitutional enforcement → Escalate to CS2
- If canon affects cross-repo coordination → Escalate to CS2
- Proceed with standard oversight procedures if canon is non-critical

**Critical for Overseer**: All constitutional canon, agent gate protocols, quality gate definitions

**If any critical overseer canon missing** → HALT and escalate

---

## 7. Pending Canon Tracking

### 7.1 Known Pending Canon (As of 2026-02-08)

**Status**: No known critical pending canon files as of 2026-02-08

All critical canon referenced in GAP-007 is now published:
- ✅ FM_ROLE_CANON.md (published in governance/maturion/)
- ✅ WAVE_MODEL.md (published in governance/canon/)
- ✅ LIVING_AGENT_SYSTEM.md (published in governance/canon/)

### 7.2 Future Pending Canon

**If new pending canon identified**:

1. **Add to this document** (Section 7.1)
   - File name
   - Intended purpose
   - Expected publication date
   - Interim workaround

2. **Track in GitHub Issue** - Label: `canon:pending`

3. **Update on Publication** - Remove from pending list, update Section 3 or 4

---

## 8. Governance Inventory and Canon Manifest

### 8.1 GOVERNANCE_ARTIFACT_INVENTORY.md

**Status**: ✅ **EXISTS**

**Location**: `GOVERNANCE_ARTIFACT_INVENTORY.md` (root)

**Purpose**: Complete inventory of all governance artifacts in repository

**Last Updated**: 2026-02-08

**Agent Guidance**: Reference this file at wake-up for governance artifact discovery.

---

### 8.2 CANON_INVENTORY.json

**Status**: ✅ **EXISTS**

**Location**: `governance/CANON_INVENTORY.json`

**Purpose**: Canonical inventory of constitutional canon files in JSON format

**Agent Guidance**: Reference this file for programmatic canon discovery. Contains metadata and versions.

---

### 8.3 Legacy Tier-0 Manifest Placeholder

**Status**: ⚠️ **DEPRECATED / NOT CREATED**

**Workaround**: Use `governance/CANON_INVENTORY.json` instead

**Agent Guidance**: If agent contract or governance references the legacy Tier-0 manifest placeholder, substitute with `CANON_INVENTORY.json`. Functionally equivalent for canon discovery.

**Note**: The Tier-0 manifest filename was never implemented. `CANON_INVENTORY.json` serves the canonical purpose.

---

## 9. Validation & Maintenance

### 9.1 Guidance Validation

This guidance MUST be updated:
- **When new canon published** - Add to Section 4
- **When pending canon identified** - Add to Section 7.1
- **When canon locations change** - Update Section 3
- **Quarterly** - CS2 reviews for accuracy

### 9.2 Guidance Sunset

**This guidance becomes obsolete when**:
- All critical canon is published
- No pending canon references exist
- Agent contracts updated with correct references

**Sunset Date**: TBD (pending validation that no pending canon exists)

---

## 10. Cross-References

### 10.1 Primary Dependencies

- **LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md** - Pending canon detection (Phase 3)
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Governance discovery
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact inventory

### 10.2 Canon Files Referenced

- **FM_ROLE_CANON.md** - governance/maturion/
- **WAVE_MODEL.md** - governance/canon/
- **LIVING_AGENT_SYSTEM.md** - governance/canon/
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - governance/canon/
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - governance/canon/
- **SELF_ALIGNMENT_AUTHORITY_MODEL.md** - governance/canon/
- **LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md** - governance/canon/
- **GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md** - governance/canon/
- **GOVERNANCE_VALIDATION_PROTOCOL.md** - governance/canon/

---

## 11. Summary

**Key Takeaways**:

1. **All critical canon from GAP-007 is now published** (FM_ROLE_CANON, WAVE_MODEL, LIVING_AGENT_SYSTEM)
2. **Six new canonical protocols published 2026-02-08** (gate protocols, taxonomy, authority, health checks, ripple, validation)
3. **Legacy Tier-0 manifest placeholder does not exist** → Use CANON_INVENTORY.json instead
4. **If pending canon encountered** → Document limitation, proceed with caution OR escalate if critical
5. **Critical canon missing** → HALT and escalate to CS2

**Expected Outcome**: Agents encounter zero ambiguity on canon locations. Pending references handled gracefully with documented limitations.

---

## 12. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial guidance addressing GAP-007 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly) or when all pending canon resolved
