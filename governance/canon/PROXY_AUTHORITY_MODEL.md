# PROXY_AUTHORITY_MODEL

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-21

---

## Purpose

Canonically defines the **conditions, required language, and enforcement model** for the Foreman acting as a CS2 proxy for protected operations — most critically, agent file creation under the Living Agent System v6.2.0.

---

## Core Principle: Explicit Proxy Authority Required

**There is no implicit proxy authority.** The Foreman CANNOT assume CS2 proxy status for any protected operation based on prior approvals, role, or operational necessity.

**Proxy authority MUST be:**
1. Explicitly granted in a CS2-approved GitHub issue
2. Scoped to a specific operation or set of operations
3. Time/task-bounded ("for this issue only")
4. Using the required canonical language pattern (see below)

---

## Required Proxy Authority Language

For Foreman to act as CS2 proxy for agent file creation, the authorising issue MUST contain:

```
For this issue only, CS2 grants Foreman proxy authority to create/modify 
[agent name(s)] agent file(s) as part of [specific task description].
```

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
- ✅ Create named builder/specialist agent contract files
- ✅ Create the full Agent Creation Bundle for named agents
- ✅ Modify named existing builder contracts for workflow coordination

### What Foreman CANNOT do under proxy authority (EVER)
- ❌ Modify the governance-repo-administrator contract (CS2-direct only)
- ❌ Modify the CodexAdvisor contract (CS2-direct only)
- ❌ Modify the Foreman's own contract (self-modification prohibited)
- ❌ Create agents not named in the proxy grant
- ❌ Re-use a proxy grant from a closed issue

---

## Proxy Authority Verification Protocol

Before creating any agent file under proxy authority, Foreman MUST:
1. Locate the authorising GitHub issue
2. Confirm the issue is open (or was open at time of delegation)
3. Confirm the required proxy grant language is present
4. Confirm the target agent file(s) are named in the proxy grant

---

## Recording Proxy Authority

All agent contracts created under proxy authority MUST include:

```yaml
metadata:
  authority: "CS2-proxy via Foreman"
  authority_issue: "#<issue-number>"
```

---

## Related Canon

- `governance/canon/CS2_AGENT_FILE_AUTHORITY_MODEL.md`
- `governance/canon/AGENT_CREATION_BUNDLE_REQUIREMENTS.md`
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`
- `governance/canon/LIVING_AGENT_SYSTEM.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
