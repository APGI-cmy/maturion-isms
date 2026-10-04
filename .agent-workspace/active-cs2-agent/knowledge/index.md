# Active-CS2 Agent — Tier 2 Knowledge Index

**Agent**: active-cs2-agent  
**Version**: 1.0.0  
**Last Updated**: 2026-09-23  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

## Requirement-to-artifact map

| Requirement | Artifact | Owner / route | Validation | Current readiness |
|---|---|---|---|---|
| Tier 1 identity, authority, four phases, inactive status | `.github/agents/active-cs2-agent.md` | CodexAdvisor under exact CS2 authority; final approval by human CS2 | YAML parse, char-count, fresh-process bootstrap load, provider-boundary capture | CONTRACT_READY / INACTIVE |
| Permanent failure rules | `FAIL-ONLY-ONCE.md` | active-cs2-agent continuity | Preflight read; referenced by session memory | READY |
| Role method and truthfulness | `operating-protocol.md` | active-cs2-agent | Phase 2 load | READY |
| Bootstrap gate | `bootstrap-input-validation-spec.md` | active-cs2-agent | Wake-up + explicit matrix | READY |
| Approved job/wave intake and dispatch rules | `job-wave-intake-and-dispatch-protocol.md` | active-cs2-agent with Foreman/controller dependencies | Stage-by-stage review against schema/template | READY |
| Evidence review and correction routing | `evidence-review-and-correction-protocol.md` | active-cs2-agent / Foreman | Stage evidence checks | READY |
| Merge and typed refusal rules | `merge-and-refusal-protocol.md` | active-cs2-agent / controller / human CS2 | Policy/check/IAA prerequisites | READY |
| Shared counters, breaker, recovery, failure register | `safety-envelope-and-recovery-protocol.md` | controller + human CS2 | Envelope review | READY |
| Tier 3 dispatch envelope and continuity | `tier3-context-and-continuity-protocol.md` | active-cs2-agent | Envelope-field completeness | READY |
| Implemented-vs-required runtime map | `runtime-integration-handoff.md` | CodexAdvisor now; Foreman-appointed runtime later | Command-backed loadability + handoff review | READY |
| Session closure structure | `session-memory-template.md` | active-cs2-agent | Handover use | READY |
| New-agent continuity baseline | `memory/breach-registry.md`, `personal/*.md`, `parking-station/suggestions-log.md` | active-cs2-agent | Honest no-history content | READY |

## Operating principles

1. Contract-ready is not activation.
2. Foreman remains the only specialist appointing authority and ordinary-remediation owner.
3. Human CS2 retains reserved matters, breaker reset, activation approval, and protected merge authority.
4. IAA remains independent and final; ECAP remains administrative only.
5. Tier 3 is reconstructed from validated durable facts and cannot invent authority.
6. Metadata-only provenance or inventory-rebinding work remains a later integrity/evidence follow-up unless an actual failing check proves otherwise.

## Truthful status vocabulary

Use only: `PROPOSED`, `CONTRACT_READY`, `ACTIVATION_READY`, `ACTIVE`, plus task-level refusal/block states from Tier 2. For this bundle the truthful state is `CONTRACT_READY / INACTIVE`.
