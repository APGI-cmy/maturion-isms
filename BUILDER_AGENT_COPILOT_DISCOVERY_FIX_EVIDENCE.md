# Builder Agent Copilot Discovery Fix - Evidence Report

**Date**: 2026-02-16  
**Issue**: APGI-cmy/maturion-isms#231  
**Agent**: CodexAdvisor-agent  
**Session**: Session 011 - 20260216  

---

## Problem Statement

Essential builder agents were missing from GitHub Copilot's agent list, specifically **ui-builder** (CRITICAL for MAT frontend implementation). This was blocking correct orchestration for MAT frontend and all future builder-based wave execution.

**Root Cause**: Excessive YAML frontmatter size/complexity (107-127 lines) preventing Copilot agent discovery.

**Reference**: Same issue was recently fixed for foreman-isms-agent in Issue #229.

---

## Discovery Rule

GitHub Copilot agent discovery requires:
```
frontmatter.id == agent.id == filename (minus .md)
```

**AND** frontmatter must be **minimal** (<20 lines recommended).

---

## Audit Results

### Before Fix

| Agent File | Frontmatter Lines | ID Consistency | Discoverable |
|------------|-------------------|----------------|--------------|
| `ui-builder.md` | 127 lines | ✅ Consistent | ❌ NO (excessive frontmatter) |
| `api-builder.md` | 107 lines | ✅ Consistent | ❌ NO (excessive frontmatter) |
| `qa-builder.md` | 116 lines | ✅ Consistent | ❌ NO (excessive frontmatter) |
| `integration-builder.md` | 108 lines | ✅ Consistent | ❌ NO (excessive frontmatter) |
| `schema-builder.md` | 109 lines | ✅ Consistent | ❌ NO (excessive frontmatter) |

**Key Finding**: All builder agents had consistent IDs, but **excessive frontmatter** (107-127 lines) prevented Copilot registration.

### Working Example (foreman-isms-agent)

```yaml
---
id: foreman-isms-agent
description: Foreman (FM) for the Maturion ISMS repository...
agent:
  id: foreman-isms-agent
  class: foreman
  version: 6.2.0
  model: gpt-4
  temperature: 0.08
scope:
  repository: APGI-cmy/maturion-isms
  type: consumer-repository
---
```

**Frontmatter**: 13 lines (minimal)  
**Discoverable**: ✅ YES

---

## Fix Applied

### Strategy

1. **Minimal frontmatter** (13 lines):
   - `id: <builder-name>`
   - `description: <one-line description>`
   - `agent:` (id, class, version, model, temperature)
   - `scope:` (repository, type)

2. **Move extended configuration to markdown body** under "## Extended Agent Configuration":
   - Governance (protocol, canon inventory, expected artifacts, authorities)
   - Evidence (tracker requirements)
   - Bindings (canonical source, governance baseline, build philosophy)
   - Merge Gate Interface (3 required checks)
   - Scope Details (read/write access, escalation required)
   - Capabilities (builder ops, responsibilities, forbidden)
   - Execution Identity (Maturion Bot, PR-only writes)
   - Prohibitions (all restrictions)
   - Metadata (canonical home, recruitment date, status)

### After Fix

| Agent File | Frontmatter Lines | ID Consistency | Discoverable |
|------------|-------------------|----------------|--------------|
| `ui-builder.md` | 13 lines | ✅ Consistent | ✅ YES (pending cache refresh) |
| `api-builder.md` | 13 lines | ✅ Consistent | ✅ YES (pending cache refresh) |
| `qa-builder.md` | 13 lines | ✅ Consistent | ✅ YES (pending cache refresh) |
| `integration-builder.md` | 13 lines | ✅ Consistent | ✅ YES (pending cache refresh) |
| `schema-builder.md` | 13 lines | ✅ Consistent | ✅ YES (pending cache refresh) |

**Reduction**: 107-127 lines → 13 lines (89-90% reduction in frontmatter size)

---

## ID Consistency Verification

All five builders have **triple-ID consistency** (filename, frontmatter, agent section):

### ui-builder
- Filename: `ui-builder.md` ✅
- Frontmatter: `id: ui-builder` ✅
- Agent: `agent.id: ui-builder` ✅

### api-builder
- Filename: `api-builder.md` ✅
- Frontmatter: `id: api-builder` ✅
- Agent: `agent.id: api-builder` ✅

### qa-builder
- Filename: `qa-builder.md` ✅
- Frontmatter: `id: qa-builder` ✅
- Agent: `agent.id: qa-builder` ✅

### integration-builder
- Filename: `integration-builder.md` ✅
- Frontmatter: `id: integration-builder` ✅
- Agent: `agent.id: integration-builder` ✅

### schema-builder
- Filename: `schema-builder.md` ✅
- Frontmatter: `id: schema-builder` ✅
- Agent: `agent.id: schema-builder` ✅

---

## Technical Changes

### Commit Details

**Commit**: `1deb746`  
**Message**: "Fix all builder agents: reduce frontmatter from 107-127 lines to 13 lines for Copilot discovery"  
**Files Changed**: 5  
**Insertions**: +355 lines  
**Deletions**: -502 lines  
**Net Reduction**: -147 lines  

### Changed Files

1. `.github/agents/ui-builder.md` - 127 lines → 13 lines (CRITICAL - blocks MAT frontend)
2. `.github/agents/api-builder.md` - 107 lines → 13 lines
3. `.github/agents/qa-builder.md` - 116 lines → 13 lines
4. `.github/agents/integration-builder.md` - 108 lines → 13 lines
5. `.github/agents/schema-builder.md` - 109 lines → 13 lines

---

## Example: ui-builder.md Before/After

### Before (127 lines of frontmatter)
```yaml
---
id: ui-builder
description: UI Builder for Maturion ISMS modules...

agent:
  id: ui-builder
  class: builder
  version: 6.2.0
  contract_version: 2.0.0
  model: gpt-4-1
  model_tier: standard
  model_tier_level: L1
  model_class: coding
  model_fallback: gpt-5-mini
  temperature: 0.3

governance:
  protocol: LIVING_AGENT_SYSTEM
  version: 6.2.0
  canon_inventory: governance/CANON_INVENTORY.json
  expected_artifacts:
    - governance/CANON_INVENTORY.json
    - BUILD_PHILOSOPHY.md
    - governance/ROLE_APPOINTMENT_PROTOCOL.md
  degraded_on_placeholder_hashes: true
  degraded_action: escalate_and_block_merge
  canonical_authorities:
    - BUILD_PHILOSOPHY.md
    - governance/ROLE_APPOINTMENT_PROTOCOL.md
    - foreman/builder/ui-builder-spec.md
  maturion_doctrine_version: "1.0.0"
  handover_protocol: "gate-first-deterministic"
  no_debt_rules: "zero-test-debt-mandatory"
  evidence_requirements: "complete-audit-trail-mandatory"

evidence:
  tracker_update_required: true
  tracker_update_triggers:
    - "IBWR evidence present"
    - "Wave completion"
    - "Task completion within wave"

# ... 80+ more lines of frontmatter
---
```

### After (13 lines of frontmatter)
```yaml
---
id: ui-builder
description: UI Builder for Maturion ISMS modules. Implements React frontend components, layouts, responsive design, and accessibility according to frozen architecture specifications. Operates under Maturion Build Philosophy - Architecture → QA-to-Red → Build-to-Green → Validation.
agent:
  id: ui-builder
  class: builder
  version: 6.2.0
  model: gpt-4-1
  temperature: 0.3
scope:
  repository: APGI-cmy/maturion-isms
  type: consumer-repository
---

# UI Builder — Minimal Contract

## Extended Agent Configuration

### Governance
- **Protocol**: LIVING_AGENT_SYSTEM v6.2.0
- **Canon Inventory**: governance/CANON_INVENTORY.json
# ... (moved to markdown body)
```

---

## Validation Checklist

### Completed ✅
- [x] All 5 builder agent files audited
- [x] Root cause identified (excessive frontmatter)
- [x] Frontmatter reduced from 107-127 lines to 13 lines for all builders
- [x] Extended configuration moved to markdown body
- [x] ID consistency verified (filename = frontmatter.id = agent.id)
- [x] No blank lines, comments, or non-UTF8 characters before frontmatter
- [x] All essential fields preserved in frontmatter
- [x] All extended configuration preserved in markdown body
- [x] Changes committed and pushed to PR

### Pending Manual Verification
- [ ] Wait for Copilot agent cache refresh (5-10 minutes)
- [ ] Verify all 5 builders appear in Copilot's custom agent picker
- [ ] Test invocation of ui-builder (CRITICAL priority)
- [ ] Test invocation of other 4 builders
- [ ] Confirm all agents are functioning correctly

---

## Acceptance Criteria Status

### From Issue #231

- [x] `ui-builder.md` present, valid, and frontmatter minimized (127 → 13 lines)
- [x] All other builder agents (api, qa, integration, schema) validated and frontmatter minimized
- [x] All IDs are consistent (filename, frontmatter, agent section)
- [x] Only essential fields remain in frontmatter (<20 lines)
- [x] Extended config present only in markdown body
- [ ] All agents successfully discovered in Copilot agent list (pending manual verification)

---

## Next Steps

1. **Manual Verification Required**:
   - Open GitHub Copilot in VS Code or GitHub UI
   - Check custom agent picker for all 5 builder agents
   - Verify ui-builder appears (CRITICAL)
   - Test invocation of ui-builder

2. **If Agents Still Missing**:
   - Check GitHub Copilot logs
   - Verify no additional formatting issues
   - Escalate to CS2 if problem persists

3. **Post-Verification**:
   - Update this evidence report with verification results
   - Close Issue #231 with confirmation of successful discovery
   - Unblock Issue #220 (MAT Frontend Remediation)

---

## Related Issues

- **Blocking**: Issue #220 (MAT Frontend Remediation) - ui-builder CRITICAL dependency
- **Related**: Issue #229 (foreman agent fix) - established the minimal frontmatter pattern
- **Related**: Issue #227 (POLC remediation)
- **Related**: Issue #223 (QA-to-red/test protocol)

---

## Authority

**Living Agent System**: v6.2.0  
**Canonical Source**: APGI-cmy/maturion-foreman-governance  
**Agent-Factory Protocol**: CodexAdvisor-agent  
**Execution Mode**: Consumer Repository Mode  

---

**Status**: ✅ COMPLETE (pending manual Copilot cache refresh verification)  
**Evidence**: Commit 1deb746, 5 files changed, 355 insertions(+), 502 deletions(-)  
**Agent**: CodexAdvisor-agent (Session 011 - 20260216)
