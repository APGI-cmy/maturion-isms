# PROXY_AUTHORITY_MODEL

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-21

---

## Purpose

Canonically defines the **conditions, required language, and enforcement model** for the Foreman acting as a CS2 proxy for protected operations — most critically, agent file creation under the Living Agent System v6.2.0.

This canon closes the gap where Foreman-proxy orchestration and bundle agent creation were operationally required but had no canonical authority model defining when and how such delegation is valid.

---

## Problem Statement

CS2 holds supreme authority over all agent contract files (see `CS2_AGENT_FILE_AUTHORITY_MODEL.md`). However, in production execution, Foreman frequently needs to orchestrate the creation of builder and specialist agents as part of wave planning and execution.

Without a canonical proxy model:
- Agents cannot determine whether Foreman has authority to create a given agent contract
- CodexAdvisor cannot validate whether agent creation was properly authorised
- Governance violations occur silently when Foreman acts without explicit CS2 delegation
- Ambiguity about what CS2 "implicitly approved" creates audit gaps

---

## Core Principle: Explicit Proxy Authority Required

**There is no implicit proxy authority.** The Foreman CANNOT assume CS2 proxy status for any protected operation based on:
- The general nature of their role
- Prior approvals for similar operations
- Verbal/conversational context not captured in the authorising issue
- Time pressure or operational necessity

**Proxy authority MUST be:**
1. Explicitly granted in a CS2-approved GitHub issue
2. Scoped to a specific operation or set of operations
3. Time/task-bounded ("for this issue only")
4. Using the required canonical language pattern (see below)

---

## Required Proxy Authority Language

### Standard Proxy Grant Statement

For Foreman to act as CS2 proxy for agent file creation, the authorising issue MUST contain the following pattern (verbatim or equivalent):

```
For this issue only, CS2 grants Foreman proxy authority to create/modify 
[agent name(s)] agent file(s) as part of [specific task description].
```

**Examples of valid proxy grants:**
```
For this issue only, CS2 grants Foreman proxy authority to create the 
security-specialist.agent.md file as part of Wave 4 specialist deployment.

For this issue only, CS2 grants Foreman proxy authority to create and 
configure the deployment-specialist.agent.md and testing-specialist.agent.md 
files as part of the MVP specialist bundle creation (Issue #362).
```

**Examples of INVALID proxy grants:**
```
❌ "Foreman has authority to create agents as needed"       (no issue scope)
❌ "CS2 approves Wave 4 work" (implicit; doesn't name agent files)
❌ "Foreman may proceed" (insufficient specificity)
❌ Verbal approval in PR comment without issue reference   (not an issue statement)
```

### Language Constraints

| Element | Required | Example |
|---------|----------|---------|
| Scope qualifier | YES | "For this issue only" |
| Granting authority | YES | "CS2 grants" |
| Recipient | YES | "Foreman proxy authority" |
| Operation | YES | "to create/modify" |
| Target file(s) | YES | Named agent file(s) or explicit bundle |
| Task context | YES | "as part of [task]" |

---

## Scope of Proxy Authority

### What Foreman CAN do under proxy authority

When an explicit proxy grant exists:
- ✅ Create named builder agent contract files
- ✅ Create named specialist agent contract files (within the issue scope)
- ✅ Create the full Agent Creation Bundle for named agents (contract + Tier 2 stubs + registry entry + routing + proof)
- ✅ Modify named existing builder contracts for workflow coordination needs

### What Foreman CANNOT do under proxy authority (EVER)

Even with explicit proxy authority:
- ❌ Modify the governance-repo-administrator contract (CS2-direct only)
- ❌ Modify the CodexAdvisor contract (CS2-direct only)
- ❌ Modify the Foreman's own contract (self-modification prohibited)
- ❌ Create agents not named in the proxy grant
- ❌ Expand proxy scope beyond the issue boundary
- ❌ Re-use a proxy grant from a closed issue for new agent creation
- ❌ Grant proxy authority to builder agents (proxy authority is non-delegable)

---

## Proxy Authority Verification Protocol

### For Foreman (Before Acting on Proxy)

Before creating any agent file under proxy authority, Foreman MUST:

```bash
# FM_H: Verify proxy authority exists
echo "[FM_H] Verifying CS2 proxy authority for agent file creation..."
# 1. Locate the authorising GitHub issue
# 2. Confirm the issue is open or was open at time of delegation
# 3. Confirm the issue contains the required proxy grant language
# 4. Confirm the target agent file(s) are named in the proxy grant
# 5. Confirm the proxy grant is from CS2 (Johan Ras in bootstrap)
# If ANY check fails: HALT, escalate to CS2, do NOT proceed

# FM_H: Confirm operation is within proxy scope
echo "[FM_H] Confirming operation within proxy scope..."
# Confirm: agent name matches what is in the proxy grant
# Confirm: issue is not closed (proxy expires with issue)
# If out of scope: HALT, request new CS2 approval
```

### For CodexAdvisor (Validation)

CodexAdvisor MUST validate proxy authority when reviewing any agent file creation:

1. **Check for CS2-approved issue**: A GitHub issue with CS2 approval MUST exist
2. **Check for explicit proxy language**: The issue MUST contain the required proxy grant pattern
3. **Check scope alignment**: The named agent(s) MUST match the PR/change being reviewed
4. **Check issue status**: The issue MUST have been open at the time the creation was authorised
5. **Flag without proxy**: Any agent file creation without verifiable proxy or direct CS2 authority is a **governance violation**

### For All Agents (General Check)

Any agent reviewing or consuming an agent contract MUST be able to trace the creation authority to either:
- Direct CS2 action (CS2 committed the file via a CS2-approved issue), OR
- Explicit Foreman proxy authority (issue contains the required proxy grant language and Foreman committed the file)

If neither is traceable, the agent MUST treat the contract as **unverified** and escalate to CS2 before relying on it.

---

## Proxy Authority Lifecycle

| Stage | Action | Evidence |
|-------|--------|----------|
| **Granted** | CS2 adds proxy grant language to issue | Issue text with standard pattern |
| **Active** | Issue is open; Foreman may execute the named operations | Issue URL + proxy grant text |
| **Consumed** | Foreman creates the bundle; records issue reference in contract YAML | `metadata.authority_issue: #NNN` in contract |
| **Expired** | Issue is closed (merged/resolved) | No further proxy actions permitted |
| **Revoked** | CS2 explicitly removes proxy grant from issue or closes without merge | Foreman must halt; re-escalate |

---

## Recording Proxy Authority

All agent contracts created under proxy authority MUST include a reference to the authorising issue in their YAML frontmatter:

```yaml
metadata:
  canonical_home: "APGI-cmy/<repo>"
  this_copy: "canonical"
  authority: "CS2-proxy via Foreman"
  authority_issue: "#<issue-number>"
  last_updated: "YYYY-MM-DD"
```

The `authority_issue` field is MANDATORY for proxy-created contracts. Absence of this field in a proxy-created contract is a governance gap that MUST be remediated.

---

## Relation to CS2 Agent File Authority Model

This canon **extends** `CS2_AGENT_FILE_AUTHORITY_MODEL.md` by specifying the mechanism for CS2-to-Foreman proxy delegation within the existing 5-level hierarchy:

| Level | Agent | Proxy Capability |
|-------|-------|-----------------|
| 0 | CS2 | Grants proxy authority (source) |
| 1 | governance-repo-administrator | Cannot hold or grant proxy authority |
| 2 | governance-liaison | Cannot hold or grant proxy authority |
| 3 | Foreman (FM) | CAN hold proxy authority via explicit CS2 grant |
| 4 | Builders | Cannot hold or grant proxy authority |

Proxy authority is a **temporary elevation** of Foreman authority, scoped to a single issue, for named file operations. It does NOT change the underlying authority level of the Foreman permanently.

---

## Consumer Implementation References

The proxy authority model was first implemented in:

- **APGI-cmy/maturion-isms#360** — Consumer implementation of proxy-authority-governed agent creation
- **APGI-cmy/maturion-isms#362** — Foreman-proxy bundle creation pattern
- **APGI-cmy/maturion-foreman-governance#361** — Canon alignment (this issue's PR)

---

## Related Canon

- `governance/canon/CS2_AGENT_FILE_AUTHORITY_MODEL.md` — Full authority hierarchy (this extends Level 3)
- `governance/canon/AGENT_CREATION_BUNDLE_REQUIREMENTS.md` — What Foreman creates under proxy
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Knowledge requirements for created agents
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` — Foreman authority boundaries
- `governance/canon/AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md` — Recruitment authority
- `governance/canon/LIVING_AGENT_SYSTEM.md` — Governance framework v6.2.0

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
