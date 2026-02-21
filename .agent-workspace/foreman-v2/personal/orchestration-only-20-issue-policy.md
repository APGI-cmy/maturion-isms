# Orchestration-Only Policy — 20-Issue Rule

**Type**: Foreman Operating Constraint  
**Authority**: CS2 via Issue #1177  
**Effective Date**: 2026-02-21  
**Applies To**: foreman-v2-agent, all sessions  
**Duration**: Next 20 architecture or governance issues from effective date  
**Review Date**: After 20 qualifying issues have been processed

---

## 1. Policy Statement

For at least the next 20 architecture or governance issues (counting from the effective date of this policy), `foreman-v2-agent` is to operate **strictly in Orchestrator mode**.

This means:
- **All implementation, build, and execution requests MUST be delegated** to specialist builder agents via the specialist registry
- Foreman MUST NOT write production code, build scripts, test files, or configuration files in response to implementation requests
- Foreman MUST invoke the Implementation Guard mode for any request directed at Foreman that involves implementation verbs

---

## 2. Qualifying Issue Definition

A qualifying issue is any issue or task that is:
- Tagged with labels: `governance`, `architecture`, `build`, `orchestration`
- Assigned to `foreman-v2-agent` or `foreman-agent`
- Involves any of: architecture design, governance update, wave planning, builder recruitment, QA-to-Red creation, wave closure evaluation

---

## 3. Required Behaviour Per Issue

When processing any qualifying issue under this policy, Foreman MUST:

### 3.1 Explicit Policy Flag

Include the following statement in the issue response/execution journey:

> **[ORCHESTRATION-ONLY-POLICY ACTIVE — Issue N of 20]**  
> Per Issue #1177 and the 20-Issue Rule, foreman-v2 is operating in strict Orchestrator mode. All implementation tasks are delegated to specialist builder agents. Foreman does not write implementation code during this policy period.

### 3.2 Verb Classification Gate

Before responding to any task, classify the verb:
- **Implementation verbs** (build, code, write, implement, create files, deploy, test, run, execute) → REJECT + delegate via Implementation Guard
- **Orchestration verbs** (plan, review, approve, freeze, authorize, evaluate, recruit, escalate) → execute per POLC contract

### 3.3 Delegation Record

For each delegated task, record in session memory:
- Task description
- Delegated agent (from specialist registry)
- Delegation timestamp
- Expected deliverable

---

## 4. Issue Counter

| # | Issue | Date | Mode Enforced | Delegated Agent(s) |
|---|-------|------|---------------|--------------------|
| 1 | #1177 — Reinstate MAT Waves 5-7 Learnings | 2026-02-21 | Orchestrator-only | copilot (implementation delegation) |
| 2-20 | (to be filled as issues are processed) | | | |

*Update this table after each qualifying issue is processed.*

---

## 5. Enforcement

This policy is **self-enforcing**: Foreman MUST check this file at the start of every session and confirm whether the 20-issue window is still active.

**Completion Criteria**: This policy expires after 20 qualifying issues have been logged in Section 4's counter, OR after explicit CS2 authorization to exit the policy.

**Non-Compliance**: Any session where Foreman writes implementation code while this policy is active is a **POLC violation** requiring immediate session memory recording and escalation to CS2.

---

## 6. Rationale

This policy was instituted because:
1. Issue #1177 identified that governance processes had degraded (learnings removed, processes not followed)
2. Strict orchestrator-only operation during the remediation period reinforces the POLC contract and ensures Foreman does not bypass it under time pressure
3. Delegating implementation to specialist agents produces better quality through specialization
4. A visible policy window creates accountability and measurable compliance

---

**Authority**: CS2 | **Issue**: APGI-cmy/maturion-isms#1177  
**Foreman Contract**: POLC v2.2.0 — Phase 2: Implementation Guard  
**Specialist Registry**: `.agent-workspace/foreman-v2/knowledge/specialist-registry.md`
