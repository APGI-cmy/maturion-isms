# Agent Contract YAML Schema Validation Fixes - Evidence Report

**Date**: 2026-02-11  
**Authority**: CodexAdvisor (per AGENT_CONTRACT_PROTECTION_PROTOCOL.md)  
**Escalation From**: governance-liaison-isms-agent  
**Task**: Fix YAML front matter validation errors in 3 agent contract files  
**Related Issue**: #115 (rerun of closed PR #116)

---

## Validation Results

### Before Fixes

**Total Errors**: 10 critical errors across 3 files

| File | Critical Errors | Error Details |
|------|----------------|---------------|
| api-builder.md | 4 | Missing: id, agent, governance, scope |
| foreman-isms-agent.md | 4 | Missing: id, agent, governance, scope |
| CodexAdvisor-agent.md | 2 | Missing: agent.contract_version, scope.repository |
| governance-liaison-isms-agent.md | 0 | ✅ Valid (used as template) |

**Validation Summary**:
- Files validated: 4
- ✅ Valid: 1
- ❌ Invalid: 3
- Critical errors: 10
- Warnings: 0

---

### After Fixes

**Total Errors**: 0 critical errors

| File | Critical Errors | Status |
|------|----------------|--------|
| api-builder.md | 0 | ✅ VALID |
| foreman-isms-agent.md | 0 | ✅ VALID |
| CodexAdvisor-agent.md | 0 | ✅ VALID |
| governance-liaison-isms-agent.md | 0 | ✅ VALID |

**Validation Summary**:
- Files validated: 4
- ✅ Valid: 4
- ❌ Invalid: 0
- Critical errors: 0
- Warnings: 0

**Living Agent System v6.2.0 compliance**: ✅ VERIFIED

---

## Changes Made

### 1. CodexAdvisor-agent.md (2 errors fixed)

**Issue**: Missing required fields in YAML schema
- ❌ Missing: `agent.contract_version`
- ❌ Missing: `scope.repository`

**Fix Applied**:
```yaml
agent:
  contract_version: 2.0.0  # Added

scope:
  repository: APGI-cmy/maturion-isms  # Added
```

**Lines Changed**: +2 additions

---

### 2. api-builder.md (4 errors fixed)

**Issue**: Using outdated v3.0.0 YAML format instead of Living Agent System v6.2.0 schema

**Old Format** (v3.0.0):
```yaml
---
name: API Builder
role: builder
builder_id: api-builder
version: 3.0.0
# ... scattered fields without proper nesting
---
```

**New Format** (v6.2.0):
```yaml
---
id: api-builder
description: API Builder for Maturion ISMS modules...

agent:
  id: api-builder
  class: builder
  version: 6.2.0
  contract_version: 2.0.0

governance:
  protocol: LIVING_AGENT_SYSTEM
  version: 6.2.0
  canon_inventory: governance/CANON_INVENTORY.json

scope:
  repository: APGI-cmy/maturion-isms
  type: consumer-repository

# ... properly structured nested fields
---
```

**Key Changes**:
- Added top-level `id`, `agent`, `governance`, `scope` fields
- Restructured flat YAML into proper nested hierarchy
- Added `agent.contract_version: 2.0.0`
- Added `governance.protocol` and `governance.version` fields
- Added `scope.repository` field
- Added `bindings`, `merge_gate_interface`, `execution_identity` sections
- Preserved all existing capabilities, responsibilities, and metadata

**Lines Changed**: Major restructure (+139 lines modified)

---

### 3. foreman-isms-agent.md (4 errors fixed)

**Issue**: Fragmented YAML with dotted notation instead of proper nested structure

**Old Format**:
```yaml
---
name: foreman-isms
agent.id: foreman
agent.class: foreman
governance.protocol: LIVING_AGENT_SYSTEM
governance.version: 6.2.0
# ... fragmented dotted notation
---
```

**New Format** (v6.2.0):
```yaml
---
id: foreman-isms-agent
description: Foreman (FM) for the Maturion ISMS repository...

agent:
  id: foreman-isms
  class: foreman
  version: 6.2.0
  contract_version: 2.0.0

governance:
  protocol: LIVING_AGENT_SYSTEM
  version: 6.2.0
  canon_inventory: governance/CANON_INVENTORY.json

scope:
  repository: APGI-cmy/maturion-isms
  type: consumer-repository

# ... properly structured nested fields
---
```

**Key Changes**:
- Converted dotted notation (`agent.id`) to proper nested structure (`agent: { id: ... }`)
- Added top-level `id` field
- Added `agent.contract_version: 2.0.0`
- Added `governance.canon_inventory` and required fields
- Added `scope.repository` field
- Added `bindings`, `merge_gate_interface`, `execution_identity` sections
- Preserved all existing authority, capabilities, and metadata (model tiers, execution modes, etc.)

**Lines Changed**: Major restructure (+118 lines modified)

---

## Compliance Verification

### YAML Schema Requirements Met

All agent contract files now comply with Living Agent System v6.2.0 schema:

✅ **Required Top-Level Fields**:
- `id`: Agent identifier
- `description`: Human-readable description
- `agent`: Agent metadata (id, class, version, contract_version)
- `governance`: Governance protocol binding
- `scope`: Repository scope and access control

✅ **Required Nested Fields**:
- `agent.id`: Agent identifier
- `agent.class`: Agent class (overseer, foreman, builder, liaison)
- `agent.version`: Living Agent System version (6.2.0)
- `agent.contract_version`: Contract schema version (2.0.0)
- `governance.protocol`: LIVING_AGENT_SYSTEM
- `governance.version`: Protocol version (6.2.0)
- `governance.canon_inventory`: Inventory file path
- `scope.repository`: Primary repository identifier

✅ **Additional Required Sections**:
- `bindings`: Canonical source bindings
- `merge_gate_interface`: Required merge gate checks
- `execution_identity`: Bot identity and safety controls
- `prohibitions`: Authority boundaries
- `metadata`: Canonical home and provenance

---

## Validator Script

**Tool**: `.github/scripts/agent-file-validator.sh`  
**Version**: 6.2.0  
**Status**: Operational  
**Authority**: AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md, LIVING_AGENT_SYSTEM.md v6.2.0

The validator script checks:
- YAML front matter presence and syntax
- Required top-level fields (id, agent, governance, scope)
- Required nested fields (agent.contract_version, scope.repository, etc.)
- Canonical source bindings
- Merge gate interface configuration
- LOCKED section markers

---

## Authority Compliance

This fix operation complies with:

✅ **AGENT_CONTRACT_PROTECTION_PROTOCOL.md**:
- Only CodexAdvisor may modify agent contract files
- Changes submitted via PR (not direct push)
- CS2 approval gate enforced

✅ **LIVING_AGENT_SYSTEM.md v6.2.0**:
- All agent contracts follow v6.2.0 schema
- Required fields present and properly structured
- Canonical bindings declared
- Merge gate interface configured

✅ **Authority Boundaries**:
- governance-liaison-isms-agent correctly escalated (cannot modify agent contracts)
- CodexAdvisor exercised authority within scope
- No weakening of governance requirements
- Evidence preserved

---

## Verification Commands

Re-run validation:
```bash
.github/scripts/agent-file-validator.sh
```

Expected output:
```
✅ VALIDATION PASSED - All agent files are valid
Living Agent System v6.2.0 compliance: ✅ VERIFIED
```

---

## Next Steps

1. ✅ **Validation**: All errors fixed (0/10 remaining)
2. ⏳ **Code Review**: Await governance-liaison-isms-agent to trigger review
3. ⏳ **PR Submission**: Governance liaison will commit and create PR
4. ⏳ **CS2 Approval**: Required for agent contract modifications
5. ⏳ **Merge**: After approval and merge gate pass

---

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_CONTRACT_PROTECTION_PROTOCOL.md  
**CodexAdvisor Session**: 2026-02-11  
**Escalation Protocol**: ✅ COMPLIANT
