# Module-Consumer Mode Specification Wave Tracking Record — 2026-04-20

**Wave**: aimc-strategy-followup-20260420
**Tracking artifact for**: Module-Consumer Mode Specification Wave (Item 3 from issue AC)
**Created by**: foreman-v2-agent v6.2.0
**Date**: 2026-04-20
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Objective

Per the issue acceptance criteria and Appendix C §3 of strategy v2.0.1:

> **Module-Consumer Mode Specification Wave**
> - source sections: strategy `§7` through `§8`
> - outcome: explicit H-1 / H-2 / H-3 / H-4 gate obligations for consuming modules such as MMM
> - note: MMM AI feature QA-to-Red must not proceed without this contract

---

## Status: PENDING — Linked to maturion-isms#1383

**The module-consumer mode specification is part of the MMM ↔ AIMC Convergence Bridge wave
(maturion-isms#1383).** The specification will be produced as deliverable D2 of that wave:
`modules/MMM/_readiness/mmm-ai-capability-consumption-contract.md`.

---

## Dependency Gate

**This wave MUST NOT execute until:**
1. CS2 merges the convergence bridge pre-brief PR (branch: `copilot/define-mmm-aimc-convergence-bridge`)
2. Foreman formally delegates Phase 3 execution to `mat-specialist`
3. mat-specialist produces `mmm-ai-capability-consumption-contract.md` with H-1/H-2/H-3/H-4 obligations

**Sequencing constraint (from issue):**
> Do not create new AIMC endpoints ahead of the module-consumer specification

**MMM AI feature QA-to-Red gate:**
> MMM AI feature QA-to-Red MUST NOT proceed without this contract

---

## Linked Wave

| Field | Value |
|-------|-------|
| Wave | mmm-aimc-convergence-bridge-20260417 |
| Issue | maturion-isms#1383 |
| Branch | copilot/define-mmm-aimc-convergence-bridge |
| IAA Pre-Brief | COMPLETE — SHA in `.agent-admin/assurance/iaa-wave-record-mmm-aimc-convergence-bridge-20260417-20260417.md` |
| Pre-Brief status | COMMITTED 2026-04-17 — awaiting CS2 merge |
| Phase 3 execution | NOT YET DELEGATED — pending CS2 merge of preflight PR |
| Assignee for Phase 3 | `mat-specialist` (MMM domain context) per Appendix C §3 |

---

## Module-Consumer Mode Specification — Expected Content

When produced, `mmm-ai-capability-consumption-contract.md` (D2 of convergence bridge wave) must cover:

| Section | Content | Strategy Source |
|---------|---------|-----------------|
| Module-consumer mode definition | Formal definition of what it means to be in consumer mode | §7.1 |
| H-1 Informational obligations | Display rules, Guardian gate requirements, labelling | §8.2 + rules H-1-01, H-1-02 |
| H-2 Draft-Assist obligations | Draft state, explicit confirm action, modify/reject/discard | §8.3 + rules H-2-01, H-2-02, H-2-03 |
| H-3 Recommendation obligations | Supporting evidence, no auto-approve, rejection audit trail | §8.4 + rules H-3-01, H-3-02, H-3-03, H-3-04 |
| H-4 Operational hard gate | No direct state change, explicit human confirmation, no bulk processing | §8.5 + rules H-4-01, H-4-02, H-4-03, H-4-04 |
| Endpoint → H-gate mapping | Static mapping of each endpoint to its output class | §8.6 (table) |
| TR-012 envelope compliance | H-gate determination at envelope level vs. data payload | §8.5 rule H-4-03 |

---

## Connection to PR #1386

```
Strategy v2.0.1 §7–§8
    └── mmm-ai-capability-consumption-contract.md (PENDING — issue #1383)
            └── MMM AI feature QA-to-Red (BLOCKED until contract exists)
                └── MMM Stage 12 Build (BLOCKED on QA-to-Red)
```

---

## Acceptance Criteria Check

Per the issue:
- [x] Module-consumer mode specification follow-up wave created / linked
  → Linked to maturion-isms#1383 (convergence bridge wave) as D2
  → Pre-brief committed 2026-04-17; awaiting CS2 merge and Phase 3 execution
- [ ] Module-consumer mode specification produced
  → PENDING — maturion-isms#1383 Phase 3 execution not yet started
  → DEPENDENCY-GATED: requires CS2 merge of preflight PR first

---

**Created**: 2026-04-20
**Created by**: foreman-v2-agent v6.2.0
