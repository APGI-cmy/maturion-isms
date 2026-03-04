# IAA Breach Registry

**Agent**: independent-assurance-agent
**Version**: 1.0.0
**Created**: 2026-02-26
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry records open governance breaches that IAA has identified and that require
corrective action from CodexAdvisor or other agents. Each entry is tracked until
corrective artifacts are committed and the breach is formally closed.

---

## Open Breaches

*No open breaches as of 2026-02-26. Prior session REJECTION-PACKAGEs (sessions 002–004)
were Phase A advisory, all on different PRs, and all corrective recommendations were
surfaced to CS2. No binding breach closures are pending against the current PR
(`copilot/integrate-mat-with-aimc`).*

---

## Closed Breaches

| ID | Session | PR | Finding | Corrective Action | Status |
|----|---------|-----|---------|-------------------|--------|
| B-001 | session-002-20260225 | PR #546 (post-merge retroactive) | PR merged without IAA invocation — process violation | Advisory noted to CS2; Phase A — not hard-blocked | ADVISORY RECORDED |
| B-002 | session-003-20260225 | PR #557 (retroactive) | PR opened without IAA invocation | Advisory noted to CS2; Phase A — not hard-blocked | ADVISORY RECORDED |
| B-003 | session-004-20260225 | Banner prefix PR (retroactive) | PR opened without IAA invocation | Advisory noted to CS2; Phase A — not hard-blocked | ADVISORY RECORDED |

---

## Registry Notes

All breaches above are Phase A advisory findings. Phase B blocking enforcement will
activate upon CS2 authorization. At that point, new open breaches will be hard-blocking.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
