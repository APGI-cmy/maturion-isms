# Foreman v2 — Tier 2 Knowledge Index

**Agent**: foreman-v2  
**Contract Version**: 2.17.0-transition  
**Knowledge Version**: 2.12.0  
**Last Updated**: 2026-06-15  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

This directory contains operational domain knowledge for the Foreman v2 agent. Tier 1 stays executable; detailed controls live here or in explicit control overlays/schemas.

### Files

| File | Purpose | Version |
|------|---------|---------|
| `index.md` (this file) | Knowledge entry point and version reference | 2.12.0 |
| `foreman-tier2-operating-protocol.md` | Wave 5 relocation target for detailed Foreman bootstrap, alignment, delegation, QP, ECAP, pre-handover, handover, AGCFPP, HALT, and escalation controls | 1.0.0 |
| `foreman-control-relocation-map.md` | Wave 5 audit map proving Tier 1 simplification did not silently delete controls; includes fidelity levels | 1.0.0 |
| `FAIL-ONLY-ONCE.md` | Breach registry, Universal A-rules, incident log, open improvements; must be self-attested every session before work | 4.5.0 |
| `specialist-registry.md` | Registry of delegable agents with capabilities and separation-of-duties boundary | 1.0.0 |
| `domain-flag-index.md` | Mode flags, orchestration pattern flags, degraded mode flags, domain boundaries | 1.0.0 |
| `prehandover-template.md` | PREHANDOVER proof template and ceremony evidence structure | 1.9.0 |
| `FM_QP_ENHANCED_QUICK_REFERENCE.md` | Quality Professor quick reference for builder referral, QP failures, and progress tracker enforcement | 1.1.0 |
| `WAVE-CURRENT-TASKS-PROTOCOL.md` | `wave-current-tasks.md` creation and maintenance mandate | 1.2.0 |
| `wave-reconciliation-checklist.md` | Wave close checklist for incident/NBR, liveness, evidence completeness, temporal and evidence-type audit | 1.3.0 |
| `session-memory-template.md` | Foreman session memory template referenced by Tier 1 | current |

---

## Wave 5 Transition Notes

Wave 5 intentionally shortened `.github/agents/foreman-v2-agent.md`. The shortened Tier 1 is valid only together with:

- `foreman-tier2-operating-protocol.md`
- `foreman-control-relocation-map.md`
- `.agent-admin/control/overlays/WAVE5_FOREMAN_TIER1_SIMPLIFICATION.md`
- `.agent-admin/control/wave-reviews/outstanding-transition-limitations.md`

If any of these are missing, stale, or contradictory, Foreman must halt and escalate to CS2.

Required-check inventory alignment remains pending until Wave 6. Validation scenarios remain pending until Wave 7.

---

## Operating Mode Summary

Per `governance/canon/ECOSYSTEM_VOCABULARY.md` Mode Reference Table:

| Mode | Trigger Verbs | Authority |
|------|--------------|-----------|
| POLC-Orchestration | orchestrate, plan, organize, lead, coordinate, delegate | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| Implementation Guard | implement, build, code, write, fix directed at Foreman | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| Quality Professor | review, evaluate, QA, assess, validate, audit | EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md |

Mode flags and activation states: see `domain-flag-index.md`.

---

## Separation of Duties Quick Reference

Foreman never executes implementation directly. All operations are delegated per `specialist-registry.md`:

- implementation to builder agents;
- governance alignment to governance-support agents where authorized;
- agent file operations through CS2/CodexAdvisor process;
- QA execution to QA-capable builder/support agents where applicable.

---

## Phase 4 Role-Separation Discoverability

Foreman orchestration checklist and assignment matrix guidance:

- `governance/checklists/phase4-role-separation-operational-guidance.md`
- `governance/templates/execution-ceremony-admin/FOREMAN_ADMIN_READINESS_HANDBACK.template.md`
- `.agent-admin/control/overlays/WAVE4_ECAP_ADMIN_BOUNDARY.md`

ECAP validation is administrative evidence only and cannot substitute for Foreman QP PASS or IAA final assurance.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 2.12.0 | 2026-06-15 | Registered Wave 5 Tier 2 relocation files: `foreman-tier2-operating-protocol.md` and `foreman-control-relocation-map.md`; added Wave 5 transition notes and explicit pending Wave 6/Wave 7 limitations. |
| 2.11.0 | 2026-05-14 | Added §12 CS2 Injection Compliance Tier 2 summary and updated knowledge version. |
| 2.9.0 | 2026-04-22 | Stage 10 ceremony contract integration and prehandover template updates. |
| 2.8.0 | 2026-04-19 | Knowledge version/date alignment for cl6-wave3-knowledge-reingestion. |
| 2.7.0 and earlier | historical | Historical entries retained in repository history before Wave 5 simplification. |

---

**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.3.0 transition
