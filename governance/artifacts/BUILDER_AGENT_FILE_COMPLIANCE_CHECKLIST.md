# BUILDER AGENT FILE COMPLIANCE CHECKLIST

**Status**: Canonical Governance Artifact  
**Version**: 1.1.0  
**Authority**: Maturion Engineering Leadership (Johan Ras)  
**Created**: 2026-02-14  
**Purpose**: Machine-checkable checklist for builder agent file creation and compliance validation  
**Usage**: Foreman and builder recruitment validation

---

## Executive Summary

This document provides a **comprehensive, machine-checkable compliance checklist** for builder agent file creation. It consolidates requirements from canonical governance, ensuring all builders are properly constituted, bound, and equipped for one-time build correctness.

**Critical Principle**: A builder agent file is INCOMPLETE and the agent is OUT OF GOVERNANCE if ANY required element is missing or non-compliant.

**Canonical References**:
- `governance/CANON_INVENTORY.json` - Canon alignment validation
- `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` - Binding completeness
- `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md` - Appointment requirements
- `governance/canon/BUILD_PHILOSOPHY.md` - One-Time Build Law, Zero Test Debt
- `governance/canon/OPOJD_DOCTRINE.md` - Continuous execution mandate

---

## Usage Instructions

### For Foreman (FM)

When creating builder agent files:
1. Use this checklist as the canonical validation baseline
2. For each item, verify presence and compliance in the builder agent file
3. Mark items as ✅ (present and compliant) or ❌ (missing or non-compliant)
4. A builder agent file is VALID only if ALL required items are ✅
5. Do NOT appoint builders until ALL ❌ items are resolved

### For Validation Tooling

Automated validators MUST:
1. Parse builder agent file (`.github/agents/*.md` format)
2. For each checklist item, verify presence and correctness
3. Generate validation report showing pass/fail for each item
4. Return VALID only if all required items pass
5. Block recruitment/execution if validation fails

### For Governance Auditors

When auditing builder compliance:
1. Use this checklist as validation baseline
2. Verify builder agent files contain all required elements
3. Verify elements are correctly specified (not placeholders)
4. Document any gaps or non-compliance
5. Require remediation before agent may continue operating

---

## Version History

### Version 1.1.0 (2026-02-14)
- **BREAKING CHANGE**: Removed all "Tier-0" terminology
- Replaced "Tier-0 bindings" with "Canon Inventory alignment" throughout
- Updated all references to point to `governance/CANON_INVENTORY.json` as authoritative source
- Added explicit Canon Inventory SHA256 validation requirement
- Added Canon Inventory version tracking requirement
- Clarified that Canon Inventory is the single source of truth for canonical governance
- Added canonical reference to `CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`
- Rationale: Align with governance ripple directive to eliminate legacy Tier-0 terminology confusion

### Version 1.0.0 (Initial - Not Released)
- Initial draft with Tier-0 terminology (superseded by v1.1.0)

---

## Canonical Authority

**This checklist is derived from and implements**:
- `governance/CANON_INVENTORY.json` - Canon alignment validation authority
- `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` - Binding completeness authority
- `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md` - Appointment protocol authority
- `governance/canon/BUILD_PHILOSOPHY.md` - Execution model authority
- `governance/canon/OPOJD_DOCTRINE.md` - Continuous execution authority
- `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` - Integrity validation authority
- `governance/canon/agent-contracts-guidance/AGENT_FILE_BINDING_REQUIREMENTS.md` - Binding guidance authority

**Precedence**: This checklist implements canonical governance requirements. In case of conflict, canonical governance takes precedence. Escalate ambiguities to CS2/Foreman.

---

**Authority**: Maturion Engineering Leadership (Johan Ras)  
**Version**: 1.1.0  
**Effective Date**: 2026-02-14  
**Template Usage**: Foreman MUST use this checklist for all builder agent file creation and validation

---

## Full Checklist Sections

*Note: This is an abbreviated version. The full checklist contains 8 comprehensive sections covering all aspects of builder agent file compliance. For complete details on all validation criteria, please refer to the canonical version in the maturion-foreman-governance repository.*

### Key Requirements Summary:
1. **YAML Frontmatter Requirements** - Agent metadata, governance bindings, scope declaration
2. **Canon Inventory Alignment** - SHA256 validation, canon binding list, version tracking
3. **Build Philosophy Binding** - One-Time Build Law, Zero Test Debt, OPOJD Doctrine
4. **Evidence and Artifact Requirements** - Evidence bundles, test documentation, handover checklists
5. **Merge Gate Compliance** - Gate interface awareness, failure response protocols
6. **Escalation Protocol** - Trigger list, escalation steps
7. **Specialty Requirements** - Role-specific requirements (UI, API, Schema, Integration, QA builders)
8. **Validation Summary** - Completion criteria, automated validation, manual review checklist
