# Foreman v2 — Specialist Registry (Tier 2 Operational Knowledge)

**Agent**: foreman-v2  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Purpose

This registry lists all agents Foreman v2 may delegate to, their capabilities, and the separation-of-duties boundary that governs each delegation. Foreman **always delegates** — never executes these activities directly.

---

## Agent Registry

### Builder Agents

| Agent ID | Capabilities | Delegation Trigger | Authority Doc |
|----------|--------------|--------------------|--------------|
| `api-builder` | API routes, handlers, business logic | `build` verb + API scope | BUILDER_CONTRACT_SCHEMA.md |
| `schema-builder` | Database schema, RLS, migrations, seeds | `build` verb + schema/DB scope | BUILDER_CONTRACT_SCHEMA.md |
| `ui-builder` | React components, layout, accessibility | `build` verb + UI/frontend scope | BUILDER_CONTRACT_SCHEMA.md |
| `qa-builder` | Performance tests, security scans, accessibility audits | `QA`, `test`, `validate` + execution | BUILDER_CONTRACT_SCHEMA.md |
| `integration-builder` | Inter-module endpoints, API contracts, overrides | `build` verb + integration scope | BUILDER_CONTRACT_SCHEMA.md |

### Specialist Agents

| Agent ID | Capabilities | Delegation Trigger | Authority Doc |
|----------|--------------|--------------------|--------------|
| `pit-specialist` | PIT threat intelligence, IOC management, TTP correlation, threat hunting | PIT-specific tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `mat-specialist` | MAT workflows, LDCS, audit lifecycle | Domain-specific MAT tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `risk-platform-agent` | Threat analysis, vulnerability assessment, risk scoring | Risk-specific tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `criteria-generator-agent` | Criteria extraction, chunking, embedding | Criteria/standards tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `document-parser-agent` | Raw text extraction, structure identification | Document parsing tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `report-writer-agent` | Audit reports, maturity reports, executive summaries | Reporting tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `maturity-scoring-agent` | Maturity scores, gap analysis, roadmaps | Scoring/assessment tasks | SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |

### Governance & Oversight Agents

| Agent ID | Capabilities | Delegation Trigger | Authority Doc |
|----------|--------------|--------------------|--------------|
| `governance-liaison-isms-agent` | Governance alignment, ripple processing, canon sync | Any governance canon change | GOVERNANCE_LIAISON_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md |
| `CodexAdvisor-agent` | Agent file creation/modification (CS2-gated) | Agent contract operations | CS2_AGENT_FILE_AUTHORITY_MODEL.md |

---

## No-Builder Fallback Protocol

| Protocol | Trigger | Required Action | Authority Doc |
|----------|---------|-----------------|---------------|
| No-builder fallback → halt + escalate to CS2 | Required builder agent is unavailable or cannot be contacted | If required builder agent is unavailable, foreman MUST halt the wave immediately, record reason in session memory, and escalate to CS2. Self-implementation is not permitted. | GOV-BREACH-AIMC-W2-001 RCA, foreman-v2 contract v2.2.0 |

---

## Separation of Duties Boundary

Foreman MUST NOT perform any activity listed under an agent's "Capabilities" column above. If Foreman encounters such a task:

1. Classify via Verb Classification Gate (Section 1.4 of contract)
2. Identify the correct agent from this registry
3. Create a delegation package
4. Record the delegation in session memory (`roles_invoked` field)

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0 | **Version**: 1.1.0 | **Date**: 2026-02-21
