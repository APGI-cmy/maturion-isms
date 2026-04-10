# Tier 2 Knowledge Index — execution-ceremony-admin-agent

**Agent**: execution-ceremony-admin-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-04-09
**Authority**: CS2 (Johan Ras / @APGI-cmy)

## Required Files

| File | Description | Status |
|------|-------------|--------|
| `index.md` | This file — knowledge directory index | PRESENT |

## Agent Role Summary

`execution-ceremony-admin-agent` is an administrator-class agent. Its role is Phase 4
ceremony bundle preparation only: PREHANDOVER proof assembly, session memory assembly,
evidence artifact collation, and §4.3c commit-state verification.

**It does NOT invoke IAA. It does NOT issue verdicts. It does NOT build.**

## Key References

| Document | Location | Purpose |
|----------|----------|---------|
| Agent contract | `.github/agents/execution-ceremony-admin-agent.md` | Binding contract |
| ECAP-001 protocol | `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` | Role model |
| Handover automation | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | Bundle preparation requirements |
| Foreman contract | `.github/agents/foreman-v2-agent.md` | IAA invocation authority |
| IAA contract | `.github/agents/independent-assurance-agent.md` | Assurance gate authority |

## Three-Role Split Invariants

1. **Foreman**: Substantive supervisory authority — readiness judgment, IAA invocation, merge-gate release
2. **execution-ceremony-admin-agent**: Administrative Phase 4 bundle preparation ONLY
3. **IAA**: Independent assurance gate — binary verdict and token writing ONLY

These roles are mutually exclusive. No substitution permitted.
