# Tier 2 Knowledge Index — execution-ceremony-admin-agent

**Agent**: execution-ceremony-admin-agent
**Knowledge Version**: 1.2.0
**Last Updated**: 2026-04-15
**Authority**: CS2 (Johan Ras / @APGI-cmy)

## Required Files

| File | Description | Status |
|------|-------------|--------|
| `index.md` | This file — knowledge directory index | PRESENT |
| `bundle-checklist.md` | Exact bundle contents, required fields, handback contents, readiness gate | PRESENT |
| `boundary-decision-rules.md` | Admin-allowed vs forbidden substantive actions, escalation decision tree | PRESENT |
| `handoff-examples.md` | Annotated good/bad handoff examples | PRESENT |
| `foreman-ecap-appointment-template.md` | Minimal appointment brief template for Foreman use | PRESENT |

## Key Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Agent contract | `.github/agents/execution-ceremony-admin-agent.md` | Binding contract |
| ECAP-001 protocol | `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` | Role model |
| Handover automation | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | Bundle preparation requirements |
| Foreman contract | `.github/agents/foreman-v2-agent.md` | IAA invocation authority and mandatory PREHANDOVER field list |
| IAA contract | `.github/agents/independent-assurance-agent.md` | Assurance gate authority and token ceremony |
| **Artifact taxonomy** | `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` | **Prescriptive allowlist — authoritative list of permitted artifact types and write paths** |
| PREHANDOVER template | `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` | Template for PREHANDOVER proof assembly |
| Session memory template | `.agent-workspace/foreman-v2/knowledge/session-memory-template.md` | Template for session memory assembly |

## Agent Role Summary

`execution-ceremony-admin-agent` is an administrator-class agent. Its role is Phase 4
ceremony bundle preparation only: PREHANDOVER proof assembly, session memory assembly,
evidence artifact collation, and §4.3c commit-state verification.

**It does NOT invoke IAA. It does NOT issue verdicts. It does NOT build.
It does NOT commit primary substantive deliverables. Escalation is to Foreman only.**

## Three-Role Split Invariants

1. **Foreman**: Substantive supervisory authority — readiness judgment, IAA invocation, merge-gate release
2. **execution-ceremony-admin-agent**: Administrative Phase 4 bundle preparation ONLY
3. **IAA**: Independent assurance gate — binary verdict and token writing ONLY

These roles are mutually exclusive. No substitution permitted.
