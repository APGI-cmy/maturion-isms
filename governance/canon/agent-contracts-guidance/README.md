# Agent Contract Guidance - Canonical Repository

**Purpose**: Centralized canonical repository for ALL agent contract policies, schemas, templates, and guidance.

**Authority**: CS2 (Johan)  
**Created**: 2026-02-04  
**Last Updated**: 2026-02-04  
**Repository**: APGI-cmy/maturion-foreman-governance (CANONICAL)

---

## Overview

This folder contains the complete canonical set of agent contract guidance documents. All agent contract creation, modification, and maintenance MUST reference files in this folder as the source of truth.

**Rationale for Centralization**:
- Eliminates scattered, duplicated, or outdated guidance
- Enables atomic ripple and enforcement protocols
- Makes agent contract policy easy to find and maintain
- Ensures ripple is fully traceable

---

## Folder Structure

```
agent-contracts-guidance/
├── README.md                              # This file
├── .agent.schema.md                       # Normative schema for agent contracts
├── AGENT_FILE_CREATION_POLICY.md          # Policy for creating new agent files
├── AGENT_FILE_BINDING_REQUIREMENTS.md     # Binding requirements and governance loading
├── AGENT_CONTRACT_MIGRATION_GUIDE.md      # Migration guide for updating contracts
├── AGENT_ONBOARDING_QUICKSTART.md         # Quick start guide for agent onboarding
├── templates/
│   ├── AGENT_CONTRACT.template.md         # Standard agent contract template
│   └── AGENT_FILE_LOCKED_SECTIONS_TEMPLATE.md  # LOCKED sections template
└── runbooks/
    ├── AGENT_FILE_VALIDATION.md           # Validation procedures
    └── AGENT_FILE_MAINTENANCE.md          # Maintenance procedures
```

---

## Core Files

### Schema and Policy

| File | Purpose | Authority |
|------|---------|-----------|
| `.agent.schema.md` | Normative schema defining valid agent contract structure | Canonical, FM |
| `AGENT_FILE_CREATION_POLICY.md` | Policy governing creation of new agent contracts | Canonical, CS2 |
| `AGENT_FILE_BINDING_REQUIREMENTS.md` | Requirements for governance binding and context loading | Canonical |
| `AGENT_CONTRACT_MIGRATION_GUIDE.md` | Guide for migrating agent contracts to current standards | Canonical |
| `AGENT_ONBOARDING_QUICKSTART.md` | Quick start guide for new agent onboarding | Canonical |

### Templates

| File | Purpose | Authority |
|------|---------|-----------|
| `templates/AGENT_CONTRACT.template.md` | Standard template for new agent contracts | Canonical |
| `templates/AGENT_FILE_LOCKED_SECTIONS_TEMPLATE.md` | Template for LOCKED sections in agent contracts | Canonical, CS2 |

### Runbooks

| File | Purpose | Authority |
|------|---------|-----------|
| `runbooks/AGENT_FILE_VALIDATION.md` | Validation procedures for agent contracts | Canonical |
| `runbooks/AGENT_FILE_MAINTENANCE.md` | Maintenance procedures for agent contracts | Canonical |

---

## Usage Guidelines

### For Agent Contract Creation

1. **Start**: Read `AGENT_FILE_CREATION_POLICY.md`
2. **Schema**: Validate against `.agent.schema.md`
3. **Template**: Use `templates/AGENT_CONTRACT.template.md`
4. **Binding**: Follow `AGENT_FILE_BINDING_REQUIREMENTS.md`
5. **Validation**: Execute `runbooks/AGENT_FILE_VALIDATION.md`

### For Agent Contract Modification

1. **Authority Check**: Only CS2 can approve modifications
2. **Locked Sections**: Cannot modify without CS2 approval (see `AGENT_CONTRACT_PROTECTION_PROTOCOL.md`)
3. **Migration**: Follow `AGENT_CONTRACT_MIGRATION_GUIDE.md`
4. **Validation**: Re-run validation after changes

### For Agent Onboarding

1. **Quick Start**: `AGENT_ONBOARDING_QUICKSTART.md`
2. **Self-Governance**: Follow `AGENT_SELF_GOVERNANCE_PROTOCOL.md` (in parent canon/)
3. **Contract Review**: Understand your contract thoroughly
4. **Binding**: Verify governance bindings are current

---

## Merge Gate Protection

**CRITICAL**: No agent may write to or merge agent contracts.

- All merge gates enforce protection of agent contract files
- Only CS2/Johan may apply actual agent contract changes
- Agents MUST propose changes via issues/enhancement proposals
- See `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` for full details

---

## Cross-Repository Layer-Down

**This is the canonical source**: All consumer repositories (office-app, PartPulse, R_Roster) MUST layer down agent contract guidance from this folder.

**Ripple Requirements**:
- When files in this folder are updated, ripple MUST be executed to all consumer repos
- Follow `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` for complete ripple process
- Document ripple in `GOVERNANCE_ARTIFACT_INVENTORY.md`

**Consumer Repo Alignment**:
- Consumer repos should reference these files via governance layer-down
- Local copies in consumer repos are for execution only (not editing)
- All modifications must be proposed back to this canonical repository

---

## Agent Role Definitions

As defined in `CS2_AGENT_FILE_AUTHORITY_MODEL.md`:

- **CS2 (Johan)**: ONLY role with authority to modify agent contracts
- **governance-repo-administrator**: Can modify own contract via formal change process
- **All other agents**: CANNOT write agent contracts; must propose changes via issues
- **Foreman (FM)**: Owns Builder Appointment sections in FM contracts

---

## Self-Governance Execution

Every agent MUST execute self-governance checks before starting work:

1. Read own contract
2. Verify canonical status (if applicable)
3. Check governance canon currency
4. Check consumer alignment (for governance-repo-administrator)
5. Proceed with task

See `AGENT_SELF_GOVERNANCE_PROTOCOL.md` for complete requirements.

---

## Related Canon Files (Parent Directory)

Files that support agent contracts but are not moved to this folder:

- `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` - Protection protocol for contracts
- `AGENT_SELF_GOVERNANCE_PROTOCOL.md` - Self-governance requirements
- `CS2_AGENT_FILE_AUTHORITY_MODEL.md` - Authority model for modifications
- `AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md` - Recruitment authority
- `AGENT_ROLE_GATE_APPLICABILITY.md` - Gate applicability by role
- `GOVERNANCE_RIPPLE_MODEL.md` - Ripple effect model
- `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` - Ripple execution checklist

---

## Version History

**v1.0.0** (2026-02-04): Initial creation of centralized agent contract guidance folder. Consolidated all agent contract policies, schemas, templates, and runbooks from scattered locations into single canonical source. Implements Issue #[issue-number].

---

## Questions or Proposals

For questions, clarifications, or proposed changes to agent contract guidance:

1. Create an issue in this repository
2. Tag with "GOVERNANCE IMPROVEMENT PROPOSAL"
3. Assign to CS2 for review
4. Follow `MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md`

---

**End of README**
