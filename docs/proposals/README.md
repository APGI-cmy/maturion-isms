# Governance Proposals

This directory contains **draft proposals** for governance artifacts that are pending CS2 (Chief System Steward) approval before becoming canonical governance.

## ⚠️ Important: Proposals Are NOT Governance

Files in this directory are **proposals only**. They are NOT authoritative governance until:

1. ✅ CS2 reviews and approves the proposal
2. ✅ Canonical version published in `APGI-cmy/maturion-foreman-governance`
3. ✅ Governance ripple triggered to consumer repositories
4. ✅ Governance Liaison layers down approved canonical version

**DO NOT USE proposals for enforcement or compliance checking.**

---

## Governance Authority Chain

### Correct Process for New Governance

```
Governance Liaison → CS2 → Canonical Creation → Ripple to Consumers → Layer Down
```

1. **Governance Liaison** identifies need for new governance
2. **Escalates to CS2** with draft proposal
3. **CS2 reviews** and approves (may modify)
4. **CS2 creates canonical version** in maturion-foreman-governance
5. **Governance ripple** dispatched to consumer repos
6. **Governance Liaison layers down** canonical version in consumer repos

### Why This Process Matters

**Governance Fork Risk**: If consumer repos create "canonical" governance that doesn't exist in the canonical source, two versions can diverge over time. Which is authoritative?

**Prevention**: Canonical source (maturion-foreman-governance) is always authoritative. Consumer repos layer down from canonical, never create governance locally without CS2 approval.

---

## Current Proposals

### BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST_DRAFT.md

**Status**: DRAFT PROPOSAL - Pending CS2 Approval  
**Version**: 2.0.0-DRAFT  
**Created**: 2026-02-14  
**Author**: Codex Agent (via Governance Liaison escalation)

**Purpose**: Machine-checkable checklist for builder agent file creation and compliance validation

**Content Summary**:
- 77 requirements across 8 sections
- 25 BLOCKER, 30 HIGH, 21 MEDIUM severity
- 81 canonical references (pending verification)
- Machine-checkable validation rules

**Escalation**: `.agent-workspace/governance-liaison-isms/escalation-inbox/cs2-builder-checklist-approval-20260214.md`

**CS2 Action Required**: Review draft, verify canonical references, create canonical version or provide feedback

**Related PR**: copilot/complete-builder-agent-checklist

---

## How to Use This Directory

### For Governance Liaison Agents

When new governance is needed:

1. ✅ Check if canonical version exists in maturion-foreman-governance
2. ✅ If not, escalate to Codex Agent or CS2 for drafting
3. ✅ Place draft in `docs/proposals/` with `_DRAFT` suffix
4. ✅ Add clear "DRAFT PROPOSAL" warnings in header and footer
5. ✅ Create escalation document in `.agent-workspace/governance-liaison-isms/escalation-inbox/`
6. ✅ Update PR description to clarify PROPOSAL status
7. ❌ Do NOT place in `governance/` as if canonical

### For CS2 (Chief System Steward)

When reviewing proposals:

1. Review draft proposal in this directory
2. Verify all canonical references exist and are correct
3. Decide: Approve (with or without modifications) or Reject
4. If approved: Create canonical version in maturion-foreman-governance
5. Trigger governance ripple to consumer repos
6. Governance Liaison will layer down canonical version

### For Other Agents

**Do NOT use proposals for enforcement or compliance.**

Wait for:
- CS2 approval
- Canonical version creation
- Governance ripple
- Governance Liaison to layer down canonical version

Only use governance from `governance/` directory after canonical version is layered down.

---

## Version History

### 2026-02-14
- Created proposals directory
- Added BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST_DRAFT.md (v2.0.0-DRAFT)
- Documented governance authority chain and proposal process

---

**Authority**: Governance Liaison Agent (governance-liaison-isms)  
**Canonical Source**: APGI-cmy/maturion-foreman-governance  
**Consumer Repository**: APGI-cmy/maturion-isms
