# Phase 5 — Specialist Addition Lessons Learned

**Agent**: foreman-v2  
**Wave**: Phase 4-5 (Issue #356)  
**Date**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Closes**: #356

---

## Overview

This artifact documents the lessons learned from executing the Phase 5 specialist addition workflow: creating, registering, and validating the `pit-specialist` using the template/checklist approach.

---

## Specialist Added: pit-specialist

| Attribute | Value |
|---|---|
| Agent ID | `pit-specialist` |
| Domain | PIT threat intelligence, IOC management, TTP correlation, vulnerability tracking |
| Orchestrator | `maturion-agent` |
| Contract | `.github/agents/pit-specialist.md` |
| Status | ACTIVE |
| Version | 1.0.0 |
| Phase | 4-5 |

---

## Specialist Addition Workflow (Executed)

### Step 1: CS2 Issue Creation
- Issue #356 created by CS2 authorising specialist addition
- Scope defined: pit-specialist for PIT app domain

### Step 2: Template Loading
- Loaded `governance/templates/SPECIALIST_AGENT_TEMPLATE.md`
- Loaded `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`

### Step 3: Agent Contract Creation
- Created `.github/agents/pit-specialist.md` following YAML frontmatter requirements
- All mandatory YAML fields present per Section 1.1 of checklist:
  - `id: pit-specialist` ✅
  - `agent.class: specialist` ✅
  - `agent.version: 6.2.0` ✅
  - `governance.protocol: LIVING_AGENT_SYSTEM` ✅
  - `specialist.registered_orchestrator: maturion-agent` ✅
  - `prohibitions: [list]` ✅
  - `metadata.authority: CS2` ✅
- Four-phase structure (Preflight, Induction, Execution, Handover) ✅

### Step 4: Knowledge Base Creation
- Created `.agent-workspace/pit-specialist/knowledge/`
- Knowledge files created:
  - `threat-intelligence-model.md` (STIX/TAXII feed types, normalisation)
  - `ioc-management.md` (IOC types, ingestion workflow, lifecycle states)
  - `ttp-correlation.md` (MITRE ATT&CK mapping, heat map generation)
  - `vulnerability-tracking.md` (CVSS scoring, prioritisation model, remediation workflow)

### Step 5: Orchestrator Registration
- Updated `.agent-workspace/maturion-agent/knowledge/specialist-registry.md`:
  - Added pit-specialist entry with ACTIVE status
  - Promoted from PLANNED → ACTIVE
  - Version bumped from 2.0.0 → 2.1.0
- Updated `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md`:
  - Added "PIT Threat Intelligence" domain entry
  - Added 20 trigger phrases
  - Promoted from "PENDING Phase 4" → ACTIVE entry
  - Version bumped from 1.0.0 → 1.1.0
- Updated `.agent-workspace/maturion-agent/knowledge/routing-rules.md`:
  - Changed PIT App default specialist from `risk-platform-agent` → `pit-specialist`
  - Updated PIT routing keyword mappings
  - Updated Cross-App Specialist Availability entry

### Step 6: Foreman Registry Update
- Updated `.agent-workspace/foreman-v2/knowledge/specialist-registry.md`:
  - Added `pit-specialist` row to Specialist Agents table
  - Version bumped to 1.1.0

### Step 7: PR Review + CS2 Approval
- PR created with all changes
- Pending CS2 merge approval

---

## Checklist Compliance

| Checklist Item | Status |
|---|---|
| YAML frontmatter complete | ✅ |
| Mission statement present | ✅ |
| Four-phase contract structure | ✅ |
| Domain boundaries IN/OUT SCOPE defined | ✅ |
| Prohibitions list present | ✅ |
| Knowledge base (Tier 1, 2, 3) defined | ✅ |
| Graceful degradation protocol | ✅ |
| Result package format defined | ✅ |
| Session memory location defined | ✅ |
| Escalation authority defined | ✅ |
| Registered in specialist-registry.md | ✅ |
| Domain flag index entry added | ✅ |
| Routing rules updated | ✅ |
| Foreman specialist registry updated | ✅ |

---

## Lessons Learned

### What Worked Well
1. **Template approach** — `SPECIALIST_AGENT_TEMPLATE.md` provided a complete scaffold; all mandatory sections were present without guesswork
2. **Checklist-driven compliance** — `SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` provided a machine-checkable validation gate; no mandatory fields were missed
3. **Registry cascade** — updating specialist-registry, domain-flag-index, routing-rules, and foreman-registry as a single atomic operation kept all files consistent
4. **Existing specialist patterns** — using `mat-specialist` and `risk-platform-agent` as reference implementations accelerated contract creation and ensured consistency

### What Was Challenging
1. **Routing conflict resolution**: Activating pit-specialist for PIT app required updating the routing-rules to replace `risk-platform-agent` as the PIT default specialist. Required careful precedence rule documentation to prevent regression for risk-scoring queries in PIT context.
2. **Domain boundary definition**: PIT threat intelligence and general risk scoring overlap (both involve threats, vulnerabilities). Required explicit IN/OUT SCOPE documentation and cross-domain routing rules.

### What Future Sessions Should Know
1. When activating a new specialist for an app that previously defaulted to a cross-app specialist, always update both the app-specific routing rule AND the cross-app routing rule to preserve backward compatibility
2. Domain flag index trigger_phrases must be distinct from existing entries to avoid multi-match ambiguity
3. The four-step registration cascade (specialist-registry → domain-flag-index → routing-rules → foreman-registry) must always be completed atomically in a single PR

### Recommended Process Improvement
- Add a "pre-registration checklist" step to the specialist addition workflow that explicitly checks for routing conflicts before updating any files
- Document the "routing conflict resolution" decision pattern as a reusable template in `governance/canon/AGENT_DELEGATION_PROTOCOL.md`

---

## Evidence Artifacts

| Artifact | Location |
|---|---|
| pit-specialist contract | `.github/agents/pit-specialist.md` |
| Knowledge base | `.agent-workspace/pit-specialist/knowledge/` |
| Specialist registry (updated) | `.agent-workspace/maturion-agent/knowledge/specialist-registry.md` |
| Domain flag index (updated) | `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` |
| Routing rules (updated) | `.agent-workspace/maturion-agent/knowledge/routing-rules.md` |
| Foreman registry (updated) | `.agent-workspace/foreman-v2/knowledge/specialist-registry.md` |
| Session memory | `.agent-workspace/foreman-v2/memory/session-047-20260221.md` |

---

**Authority**: CS2 (Johan Ras) | **Agent**: foreman-v2 | **Date**: 2026-02-21  
**Closes**: Issue #356
