# AGENT CONTRACT FILE PROTECTION POLICY

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Effective Date**: 2026-02-24  
**Supersedes**: Partial provisions in AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md §4 re: .github/agents/ write authority

> **Amendment Authority**: Only CS2 (Johan Ras / repo owner) may amend this policy. Any PR modifying this file without CS2 sign-off is auto-FAIL at the merge gate.

---

## Purpose

This policy encodes the **strict prohibition** against agents (other than CodexAdvisor acting with explicit CS2 permission) modifying `.github/agents/` contract files. It establishes the authoritative write-authority boundary, mandatory CodexAdvisor handoff pathway, and IAA auditing requirement for all agent contract file modifications.

**Root Cause Context**: This policy was triggered by a governance breach in `APGI-cmy/maturion-isms` PR #517, where an agent executed ripple to `.github/agents/` contract files without CodexAdvisor involvement or explicit CS2 layer-down authorization. See `governance/incidents/INCIDENT-2026-02-24-PR517-AGENT-CONTRACT-BREACH.md`.

---

## Constitutional Authority

This policy derives authority from:
- `governance/canon/LIVING_AGENT_SYSTEM.md` — Core Principle: "Zero Direct Writing"
- `governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` v3.1.0 — Authority hierarchy
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.0.0 — IAA audit mandate
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.1.2 — Handover gate requirements
- CS2 (Johan Ras) — Supreme authority, Issue: Governance Breach: Agents Directly Editing .github/agents/ Contract Files

---

## 1. Absolute Prohibition

**CONSTITUTIONAL RULE — NON-BYPASSABLE:**

> **No agent — other than CodexAdvisor acting with explicit CS2 permission via a CS2-approved layer-down issue — may create, modify, or delete any file in `.github/agents/`.**

This prohibition applies:
- **Universally** to all agent types and classes
- **In all contexts** including ripple execution, governance propagation, automation
- **In all repositories** governed by this policy
- **Without exception** — there is no circumstance in which another agent may bypass this rule

---

## 2. Write Authority Matrix

| Actor | `.github/agents/` Write Authority | Condition |
|-------|----------------------------------|-----------|
| CS2 (Johan Ras / Maturion) | ✅ **FULL** | Always; no additional conditions |
| CodexAdvisor | ✅ **CONDITIONAL** | **ONLY** with explicit CS2 permission via approved layer-down issue; IAA audit required after |
| governance-repo-administrator | ❌ **PROHIBITED** | Must escalate to CS2; CS2 invokes CodexAdvisor |
| governance-liaison | ❌ **PROHIBITED** | Must escalate to CS2 |
| foreman | ❌ **PROHIBITED** | Must escalate to CS2 |
| Builders | ❌ **PROHIBITED** | Must escalate to CS2 |
| Any ripple agent | ❌ **PROHIBITED** | Must escalate to CS2; CS2 invokes CodexAdvisor |
| CI/CD automation | ❌ **PROHIBITED** | Automated writes to agent files prohibited |

**Note**: "Consumer repo `.github/agents/`" files are subject to the same rules. This policy applies cross-repository.

---

## 3. Mandatory Pathway: Agent Contract Modification via Ripple

When a ripple, governance change, or any other operation requires updates to `.github/agents/` files, the following mandatory pathway MUST be followed:

### Step 1 — Ripple Agent: Detect and Escalate (DO NOT MODIFY)

The ripple-executing agent (governance-repo-administrator, governance-liaison, or other):

1. **STOPS immediately** upon recognizing that the ripple requires `.github/agents/` modifications
2. **Does NOT modify any `.github/agents/` file** — even if this means leaving the ripple incomplete
3. **Creates a structured escalation** at `.agent-workspace/<agent>/escalation-inbox/agent-contract-modification-YYYYMMDD.md` containing:
   - The exact files to be modified
   - The exact changes required (diff spec)
   - The originating ripple/issue reference
   - The CS2 authorization request

**Template**:
```markdown
# Escalation: Agent Contract Modification Required

## Type
AGENT_CONTRACT_MODIFICATION_REQUEST

## Files Requiring Modification
- `.github/agents/<file>`: <what change and why>

## Originating Ripple / Issue
<Reference to the triggering canon change or issue>

## Proposed Diff Specification
<Exact changes proposed — CS2 reviews and approves or modifies>

## Authority
This escalation must be reviewed and approved by CS2.
CS2 then authorizes CodexAdvisor via a layer-down issue.
The ripple agent MUST NOT proceed with `.github/agents/` writes.

---
Created: <timestamp>
Agent: <agent-type>
```

### Step 2 — CS2: Review and Authorize

CS2 (Johan Ras) reviews the escalation:

1. **Reviews the proposed diff spec** — approves, modifies, or rejects
2. **Creates a CS2-approved layer-down issue** authorizing CodexAdvisor to execute the specific changes
3. **The issue MUST contain**:
   - Explicit reference to this policy
   - Exact files and changes authorized
   - Traceability to the originating ripple/governance change

### Step 3 — CodexAdvisor: Execute with Traceability

CodexAdvisor, upon receiving a CS2-approved layer-down issue:

1. **Verifies the issue is genuinely CS2-approved** (not self-authorized or inferred)
2. **Executes only the specific changes authorized** — no scope expansion
3. **Commits with full traceability**: references the CS2 issue, the originating ripple, and this policy
4. **Creates a diff record** at `.agent-admin/governance/agent-contract-diffs/diff-YYYYMMDD-<file>.md`
5. **Triggers IAA audit** (Step 4)

### Step 4 — IAA: Audit the Modification

The Independent Assurance Agent (IAA) MUST audit all `.github/agents/` modifications by CodexAdvisor:

1. **Diff check**: Verify the actual change matches the CS2-authorized spec exactly
2. **Content evaluation**: Assess semantic appropriateness of the change
3. **Authority compliance**: Verify CS2 authorization is documented and traceable per §2
4. **Protection rule check**: Verify no locked sections were modified without CS2 sign-off (per AGENT_CONTRACT_PROTECTION_PROTOCOL.md)
5. **Evidence output**: Issues `ASSURANCE-TOKEN` (approved) or `REJECTION-PACKAGE` (blocked)

A `REJECTION-PACKAGE` from IAA **blocks merge** and requires CS2 explicit sign-off to unblock.

---

## 4. IAA Auditing Checklist for Agent Contract Modifications

When the IAA audits a `.github/agents/` file modification, it MUST verify:

```
## IAA Agent Contract Audit Checklist

### Authority Verification
- [ ] CS2-approved layer-down issue exists with explicit authorization
- [ ] Issue is traceable in the commit message / PR description
- [ ] Modification was executed by CodexAdvisor (not another agent)
- [ ] No self-modification (CodexAdvisor is not modifying its own contract)

### Diff Verification
- [ ] Actual diff matches CS2-approved specification exactly
- [ ] No additional changes beyond what was authorized
- [ ] No locked sections modified without separate CS2 sign-off
- [ ] SHA256 of modified files recorded in evidence

### Content Evaluation
- [ ] Change is semantically appropriate for the stated purpose
- [ ] Change does not introduce contradictions with canon
- [ ] Change preserves FAIL-ONLY-ONCE preflight attestation sections
- [ ] Change preserves Phase 1-4 structure per AGENT_CONTRACT_ARCHITECTURE.md

### Traceability
- [ ] Commit message references CS2 issue
- [ ] PR description references this policy and originating ripple
- [ ] Diff record created at .agent-admin/governance/agent-contract-diffs/
- [ ] CANON_INVENTORY.json updated (if applicable)

### Outcome
- [ ] ASSURANCE-TOKEN issued → merge permitted
- [ ] REJECTION-PACKAGE issued → merge BLOCKED
```

---

## 5. CI/CD Enforcement: Agent Contract Audit Workflow

A GitHub Actions workflow (`.github/workflows/agent-contract-audit.yml`) enforces this policy:

- **Trigger**: Any PR modifying `.github/agents/**` files
- **Checks**:
  1. PR description references a CS2-approved issue with explicit authorization
  2. Files changed by actor consistent with CodexAdvisor or CS2 direct action
  3. Diff report generated and attached to PR for IAA review
  4. IAA assurance token artifact present (for qualifying PRs per INDEPENDENT_ASSURANCE_AGENT_CANON.md)
- **Failure**: Blocks merge if any check fails

See `.github/workflows/agent-contract-audit.yml` for implementation.

---

## 6. Breach Protocol

If ANY agent (other than CodexAdvisor with CS2 permission) modifies `.github/agents/` files:

### Immediate Actions (Agent Who Discovers Breach)

1. **HALT immediately** — do not proceed with further changes
2. **Do not merge the PR** — block merge at gate
3. **Create incident record** at `governance/incidents/INCIDENT-YYYY-MM-DD-<description>.md`
4. **Escalate to CS2** at `.agent-workspace/governance-repo-administrator/escalation-inbox/blocker-YYYYMMDD.md`
5. **Append to FAIL-ONLY-ONCE.md** at `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md`

### Remediation (CS2-Directed)

1. CS2 reviews the unauthorized modifications
2. CS2 determines whether changes are acceptable (then authorizes retroactively) or must be reverted
3. If reversion: CS2 reverts the files, CodexAdvisor applies the correct changes via this policy
4. Incident record updated with remediation outcome
5. Governance gap analysis triggered if systemic

### Incident Template

```markdown
# Incident: Unauthorized Agent Contract Modification

## Type
GOVERNANCE_BREACH — UNAUTHORIZED_AGENT_CONTRACT_MODIFICATION

## Severity
HIGH — Constitutional violation

## Description
Agent <agent-type> modified `.github/agents/<file>` without CodexAdvisor
involvement or explicit CS2 layer-down authorization.

## Breach Reference
PR: <repository>#<pr-number>
Agent: <agent-type>
Files Modified: <list of files>
Date: YYYY-MM-DD

## Policy Violated
AGENT_CONTRACT_FILE_PROTECTION_POLICY.md §1 (Absolute Prohibition)

## Root Cause
<Analysis>

## Corrective Actions
1. <Action 1>
2. <Action 2>

## Status
OPEN | RESOLVED | REMEDIATED
```

---

## 7. Relationship to Existing Governance

### Supersedes (for `.github/agents/` write authority specifically)
- `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` §4 authority grants for governance-repo-administrator writing agent contracts — **this policy is stricter**: GA may NOT write to `.github/agents/`; it must escalate to CS2/CodexAdvisor
- Any prior practice of ripple agents patching agent contract files directly

### Supplements (does not supersede)
- `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` — All other provisions remain in force
- `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` — Locked section protection remains active
- `INDEPENDENT_ASSURANCE_AGENT_CANON.md` — IAA audit mandate
- `LIVING_AGENT_SYSTEM.md` — Core prohibition on agent self-writing

### Applies Alongside
- `CS2_AGENT_FILE_AUTHORITY_MODEL.md` — Granular authority model remains the framework; this policy adds a specific, stricter boundary for `.github/agents/` write authority

---

## 8. Cross-Repository Application

This policy applies to **all Maturion-governed repositories**. Each consumer repository with agent contracts in `.github/agents/` must:

1. **Adopt this policy** by copying it to `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`
2. **Deploy the audit workflow** (see §5 and `.github/workflows/agent-contract-audit.yml`)
3. **Brief all agents** operating in that repository on this policy during induction
4. **Track layer-down compliance** in `governance/layer-down/AGENT_CONTRACT_PROTECTION_LAYER_DOWN_STATUS.md`

**Layer-Down Status**: Consumer repo ripple is required. See CHANGELOG.md `[AGCFPP-001]`.

---

## 9. FAQ for Ripple Agents

**Q: I'm executing a canon ripple that requires updating agent contracts. What do I do?**  
A: Stop. Do not touch `.github/agents/`. Create a structured escalation per §3 Step 1. The ripple is "incomplete" until CS2/CodexAdvisor handles the agent contract portion. Document the gap clearly.

**Q: The canon change is small — can I just do a quick edit?**  
A: No. There are no exceptions. Even one-character changes to `.github/agents/` files require the full pathway in §3.

**Q: What if this delays the ripple significantly?**  
A: The delay is acceptable. Unauthorized agent contract modification is a constitutional breach. Escalate to CS2 with urgency if needed.

**Q: Can I update the governance/profiles/ or governance/contracts/ directories?**  
A: Yes — this policy applies only to `.github/agents/` contract files. Other governance artifacts are governed by the standard authority matrix in AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md.

**Q: What if I already made the change before reading this policy?**  
A: Follow the Breach Protocol in §6 immediately. Create an incident record, escalate to CS2. Retroactive authorization is possible but not guaranteed.

---

## Version History

**v1.0.0** (2026-02-24): Initial policy created following governance breach in `APGI-cmy/maturion-isms` PR #517. Establishes strict prohibition, mandatory CodexAdvisor handoff pathway, IAA auditing requirement, CI/CD enforcement specification, and breach protocol. Authority: CS2 (Johan Ras), Issue: Governance Breach enforcement.

---

**Authority**: CS2 (Johan Ras / Maturion)  
**Scope**: All Maturion governed repositories  
**Amendment Process**: CS2 approval required — any PR modifying this file without CS2 sign-off is auto-FAIL  
**Review Cycle**: When governance breach occurs or CS2 directs  
**Related Canon**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md, LIVING_AGENT_SYSTEM.md, INDEPENDENT_ASSURANCE_AGENT_CANON.md, AGENT_HANDOVER_AUTOMATION.md
