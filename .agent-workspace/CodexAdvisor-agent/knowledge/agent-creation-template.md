# CodexAdvisor — Agent Creation Template (Tier 2 Operational Knowledge)

**Agent**: CodexAdvisor-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-21

---

## Purpose

This is the master template for creating new Living Agent System v6.2.0 agent files. All 9 mandatory components must be present. Target size: <25,000 characters (hard limit: 30,000).

---

## The 9 Mandatory Components

1. **YAML Frontmatter** — `name`, `id`, `description`, `agent` (with `model` nested), `governance`, `merge_gate_interface`, `scope`, `escalation`, `prohibitions`, `metadata`
2. **Mission Statement** — 1-3 sentences: who I am, what I do, what I never do
3. **Phase 1: Wake-Up** — exec reference to wake-up script, CANON_INVENTORY check, Tier 2 load
4. **Phase 2: Alignment** — pre-work gates, auth checks, verb classification
5. **Phase 3: Work** — prompt-style work loop; references Tier 2 for details; QP interrupt after every handover
6. **Phase 4: Handover** — QP final verdict, evidence bundle, session memory creation
7. **Escalation Rules** — when to halt, what to escalate, to whom
8. **Prohibitions** — constitutional constraints
9. **Tier 2 Reference** — explicit pointer to `.agent-workspace/<agent>/knowledge/index.md`

---

## YAML Frontmatter Template (consumer mode)

```yaml
---
name: <agent-id>
id: <agent-id>
description: "<One-line description: role, class, key constraints>"

agent:
  id: <agent-id>
  class: <foreman|builder|specialist|overseer|liaison>
  version: 6.2.0
  contract_version: <X.Y.Z>
  contract_pattern: four_phase_canonical
  model: <claude-model-id>

governance:
  protocol: LIVING_AGENT_SYSTEM
  canon_inventory: governance/CANON_INVENTORY.json
  expected_artifacts:
    - governance/CANON_INVENTORY.json
  degraded_on_placeholder_hashes: true
  execution_identity:
    name: "Maturion Bot"
    secret: "MATURION_BOT_TOKEN"
    safety:
      never_push_main: true
      write_via_pr_by_default: true

merge_gate_interface:
  required_checks:
    - "Merge Gate Interface / merge-gate/verdict"
    - "Merge Gate Interface / governance/alignment"
    - "Merge Gate Interface / stop-and-fix/enforcement"

scope:
  repository: APGI-cmy/maturion-isms
  agent_files_location: ".github/agents"
  approval_required: <CS2_ONLY|WAVE_START_AND_CLOSE|ALL_ACTIONS>

escalation:
  authority: CS2
  rules:
    - Contract/authority changes -> escalate: true

prohibitions:
  - No self-modification of this agent contract
  - No weakening of governance, tests, or merge gates
  - No pushing to main (use PRs)
  - No secrets in commits/issues/PRs

metadata:
  canonical_home: APGI-cmy/maturion-foreman-governance
  this_copy: consumer
  authority: CS2
  last_updated: <YYYY-MM-DD>
  tier2_knowledge: .agent-workspace/<agent-id>/knowledge/index.md
---
```

---

## Phase Script Template

```markdown
## PHASE 1: WAKE-UP

**[<AGENT_HANDLE>] Run on every session start — no exceptions.**

1. Execute: `.github/scripts/wake-up-protocol.sh <agent-id>`
2. Verify `governance/CANON_INVENTORY.json` is valid, hashes not placeholder → if degraded: HALT + escalate to CS2
3. Load Tier 2 knowledge index: `.agent-workspace/<agent-id>/knowledge/index.md`
4. Load last 5 session memories from `.agent-workspace/<agent-id>/memory/`
5. Status: STANDBY → awaiting task

## PHASE 2: ALIGNMENT

**[<AGENT_HANDLE>] Before any work begins.**

1. Confirm authorization present → if absent: HALT + escalate
2. Confirm CANON_INVENTORY not degraded
3. Load relevant checklist from `governance/checklists/`
4. If any check fails → HALT + escalate to CS2

## PHASE 3: WORK

**[<AGENT_HANDLE>] Main work loop.**

[Role-specific work instructions — reference Tier 2 files, do NOT embed content]

### Quality Professor Interrupt (mandatory after every deliverable)
- Evaluate deliverable against checklist criteria
- Verdict: PASS → proceed to Phase 4 | FAIL → fix + re-evaluate

## PHASE 4: HANDOVER

**[<AGENT_HANDLE>] Only after QP PASS verdict.**

1. Create PREHANDOVER proof: `.agent-workspace/<agent-id>/memory/PREHANDOVER-session-NNN-YYYYMMDD.md`
2. Create session memory: `.agent-workspace/<agent-id>/memory/session-NNN-YYYYMMDD.md`
3. Open PR — include authorization reference
4. DO NOT merge — await approval
```

---

## Size Budgeting Rules

The **target** for a Tier 1 agent contract is **<8,000 characters** (concise, prompt-style). The **safe limit** is 25,000 characters and the **hard limit** is 30,000 characters.

| Component | Target Characters |
|-----------|------------------|
| YAML Frontmatter | 2,000 |
| Mission Statement | 200 |
| Phase 1: Wake-Up | 500 |
| Phase 2: Alignment | 800 |
| Phase 3: Work | 2,000 |
| Phase 4: Handover | 600 |
| Footer | 200 |
| **Tier 1 target total** | **<8,000** |
| **Safe limit** | **25,000** |
| **Hard limit (enforcement: BLOCKING)** | **30,000** |

> Any content that would push the agent file above the Tier 1 target belongs in Tier 2 knowledge files (referenced by path, not embedded). Files approaching 25,000 chars must be refactored before creation.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
