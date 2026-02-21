# CodexAdvisor — Agent File Non-Negotiables Checklist (Tier 2 Operational Knowledge)

**Agent**: CodexAdvisor-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-21
**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0

---

## Purpose

This checklist captures ALL non-negotiable requirements for every Living Agent System v6.2.0 agent file. CodexAdvisor MUST verify 100% compliance against this checklist before opening any PR for an agent file creation or update. These requirements are constitutional — none may be omitted, weakened, or deferred.

This is the Tier 2 single source of truth for agent file compliance. It supersedes the need for CS2 to repeat these requirements verbally in every session.

---

## Section 1 — File Structure Non-Negotiables

- [ ] **S1-01** File is under 30,000 characters (hard GitHub UI limit — BLOCKING if exceeded)
- [ ] **S1-02** YAML frontmatter is valid, complete, and correctly delimited by `---`
- [ ] **S1-03** `name` field present in YAML frontmatter
- [ ] **S1-04** `id` field present and matches `name`
- [ ] **S1-05** `description` is a single line capturing role, class, and key constraints
- [ ] **S1-06** `agent.model` is nested under `agent:` — NOT at the top level of the YAML
- [ ] **S1-07** `agent.version` is `6.2.0`
- [ ] **S1-08** `agent.contract_pattern` is `four_phase_canonical`
- [ ] **S1-09** `metadata.tier2_knowledge` points to `.agent-workspace/<agent>/knowledge/index.md`
- [ ] **S1-10** `metadata.last_updated` is set to the current date

---

## Section 2 — Governance Non-Negotiables

- [ ] **S2-01** `governance.protocol` is `LIVING_AGENT_SYSTEM`
- [ ] **S2-02** `governance.canon_inventory` points to `governance/CANON_INVENTORY.json`
- [ ] **S2-03** `governance.degraded_on_placeholder_hashes` is `true`
- [ ] **S2-04** `governance.execution_identity.name` is `"Maturion Bot"`
- [ ] **S2-05** `governance.execution_identity.safety.never_push_main` is `true`
- [ ] **S2-06** `governance.execution_identity.safety.write_via_pr_by_default` is `true`
- [ ] **S2-07** `merge_gate_interface.required_checks` lists at minimum the three standard checks:
  - `"Merge Gate Interface / merge-gate/verdict"`
  - `"Merge Gate Interface / governance/alignment"`
  - `"Merge Gate Interface / stop-and-fix/enforcement"`
- [ ] **S2-08** `prohibitions` includes: no self-modification, no pushing to main, no secrets in commits/issues/PRs, no weakening of governance

---

## Section 3 — Four-Phase Structure Non-Negotiables

Every agent file MUST contain all four phases as named, numbered sections. Each phase must be prompt-style — short action sentences referencing Tier 2, NOT embedded governance content.

- [ ] **S3-01** **Phase 1 (Wake-Up)** is present and includes:
  - Reference to wake-up script (`.github/scripts/wake-up-protocol.sh <agent>`)
  - CANON_INVENTORY validity check with degraded-mode halt
  - Tier 2 knowledge index load (`.agent-workspace/<agent>/knowledge/index.md`)
  - Load last 5 session memories
  - **Memory Catch-Up Confirmation**: scan for unresolved escalations, blockers, and outstanding improvement suggestions; record `prior_sessions_reviewed` and `unresolved_items_from_prior_sessions` in session preamble
  - Load `merge_gate_interface.required_checks` as authoritative local test checklist

- [ ] **S3-02** **Phase 2 (Alignment/Induction)** is present and includes:
  - CS2 authorization check (HALT if absent)
  - CANON_INVENTORY check
  - Governance / checklist load step (references Tier 2 — does NOT embed checklist content)
  - Agent personality binding (who am I, what I do, what I never do)

- [ ] **S3-03** **Phase 3 (Work/Build/Orchestrate)** is present and includes:
  - Prompt-style work loop appropriate to agent role
  - Reference to Tier 2 for detailed methodology (does NOT embed Tier 2 content)
  - Explicit invocation of other agents when scope boundary is reached (delegation rule)
  - **Quality Professor (QP) Interrupt** after every major deliverable / agent handover:
    - QP verdict is PASS or FAIL only — no partial
    - On FAIL: fix → re-run QP → only proceed on PASS
    - Back-and-forth loop continues until QP PASS
  - **Merge Gate Parity Check** after QP PASS, before Phase 4:
    - Enumerate all `merge_gate_interface.required_checks`
    - Run locally with same ruleset as CI merge gate
    - Any divergence or failure → STOP and FIX immediately
    - Document `merge_gate_parity: PASS | FAIL` in PREHANDOVER proof

- [ ] **S3-04** **Phase 4 (Handover)** is present and includes ALL of the following in this order:
  1. **OPOJD Gate** (named, numbered, BLOCKING):
     - Zero test failures
     - Zero skipped/todo/stub tests
     - Zero deprecation warnings
     - Zero compiler/linter warnings
     - Zero `.skip()`, `.todo()`, stub helpers in test suite
     - Any non-zero = handover BLOCKER — fix before proceeding
  2. **Merge Gate Parity confirmation** (carry result from Phase 3 — BLOCKING if FAIL)
  3. **PREHANDOVER proof artifact** committed at `.agent-workspace/<agent>/memory/PREHANDOVER-session-NNN-YYYYMMDD.md`:
     - Checklist compliance %
     - Character count
     - CANON_INVENTORY alignment confirmation
     - Bundle completeness
     - `merge_gate_parity: PASS`
     - OPOJD gate: all 5 sub-checks ticked
  4. **Session memory** committed at `.agent-workspace/<agent>/memory/session-NNN-YYYYMMDD.md`:
     - `prior_sessions_reviewed` populated
     - `unresolved_items_from_prior_sessions` populated
     - **`## Suggestions for Improvement (MANDATORY — non-blank)`**: at least one concrete improvement suggestion — blank = handover BLOCKER
  5. Open PR with CS2 authorization reference
  6. DO NOT merge — await CS2 approval

---

## Section 4 — Living Agent Architecture Non-Negotiables

- [ ] **S4-01** Tier 1 file contains ONLY: identity/personality, phase scripts, and Tier 2 references. It does NOT embed governance content, checklists, requirement tables, or large templates
- [ ] **S4-02** Tier 2 knowledge stub exists at `.agent-workspace/<agent>/knowledge/index.md` (minimum)
- [ ] **S4-03** All detailed methodology, checklists, and domain knowledge lives in Tier 2 or Tier 3 — never in Tier 1
- [ ] **S4-04** Every governance file reference in Tier 1 is a short pointer (path or one sentence) — not a copy of the content
- [ ] **S4-05** Agent personality is established in Phase 1/2 using prompt-style language: "I am...", "I do...", "I never..."

---

## Section 5 — Delegation and Agent Boundary Non-Negotiables

- [ ] **S5-01** When agent reaches its POLC/role boundary, it DELEGATES — never attempts the out-of-scope work itself
- [ ] **S5-02** Delegation rule is explicitly stated in Phase 3: which agent receives which category of work
- [ ] **S5-03** After invoking another agent and receiving their deliverable, QP mode activates immediately
- [ ] **S5-04** Agent may not approve its own work — QP verdict must be documented
- [ ] **S5-05** Self-modification prohibition is explicitly stated in prohibitions YAML and Phase 1/2

---

## Section 6 — Memory and Continuity Non-Negotiables

- [ ] **S6-01** Every session produces a session memory file — no exceptions
- [ ] **S6-02** Every session that modifies files produces a PREHANDOVER proof artifact — no exceptions
- [ ] **S6-03** Session memory contains `## Suggestions for Improvement (MANDATORY — non-blank)` — blank = incomplete session
- [ ] **S6-04** Session memory contains `prior_sessions_reviewed` and `unresolved_items_from_prior_sessions` fields
- [ ] **S6-05** Memory rotation: keep last 5 in `memory/`, archive older to `memory/.archive/`

---

## Compliance Gate

Before opening any PR for an agent file:

| Gate | Requirement | Blocking? |
|------|-------------|-----------|
| All S1 checks | File structure valid | YES |
| All S2 checks | Governance fields complete | YES |
| All S3 checks | Four-phase structure present | YES |
| All S4 checks | Living agent architecture correct | YES |
| All S5 checks | Delegation boundaries stated | YES |
| All S6 checks | Memory protocol fields present | YES |
| Character count | ≤ 30,000 characters | YES — hard block |
| CANON_INVENTORY | Present, not degraded | YES |
| CS2 authorization | Explicit, in issue/PR | YES |

**If any gate is FAIL → DO NOT open PR → fix and re-verify → only proceed on 100% PASS**

---

**Authority**: CS2 (Johan Ras)
**Referenced by**: `.github/agents/CodexAdvisor-agent.md` Phase 3 (REVIEW step)
**Tier 1 reference**: `CodexAdvisor-agent.md` → Phase 3 → Agent Creation Loop → REVIEW step
