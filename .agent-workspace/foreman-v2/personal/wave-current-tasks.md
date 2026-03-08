# Wave Current Tasks — foreman-v2-agent

**Wave**: breach-rca-20260308 — Governance Breach RCA: Foreman bootstrap skip + direct implementation (PRs #986, #990)
**Session**: session-rca-breach-20260308
**Date**: 2026-03-08
**Issue**: fail-only-once: Foreman bootstrap and implementation breach — Phase 1 + NO-IMPLEMENT-001 (PRs #986, #990, 2026-03-08)
**Branch**: copilot/fix-foreman-bootstrap-issue
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-breach-rca-20260308.md` — PENDING

---

## Wave Context

**Wave Slug**: breach-rca-20260308
**Root cause summary**: On 2026-03-08, foreman-v2-agent directly implemented production test code (PR #986) and CI workflow code (PR #990) without Phase 1 bootstrap, without IAA Pre-Brief, and without qa-builder/integration-builder delegation. No session memory was written. Two IAA rejection packages were issued before final assurance token was granted. This wave records the formal RCA, locks in the new A-rule, and writes the missing session memory.

**Scope (governance artifacts only — no production code):**
1. `FAIL-ONLY-ONCE.md` — add INC-BOOTSTRAP-IMPL-001 incident record + new A-rule (A-018b or sequential new ID) + version bump
2. `.agent-workspace/foreman-v2/memory/session-rca-breach-20260308.md` — write missing session memory for 2026-03-08 breach
3. `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — append parking station entry
4. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-rca-breach-20260308.md` — handover proof
5. `.agent-admin/assurance/iaa-prebrief-breach-rca-20260308.md` — IAA Pre-Brief (PENDING)

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status | PR / Evidence |
|---|---------|------|---------|--------|---------------|
| 1 | T-RCA-001 | Add INC-BOOTSTRAP-IMPL-001 incident + new A-rule to FAIL-ONLY-ONCE.md (v2.9.0) | foreman-v2-agent (governance doc — not production code) | 🔴 PENDING | — |
| 2 | T-RCA-002 | Write session memory `session-rca-breach-20260308.md` capturing bootstrap steps, mode transitions, roles invoked, breach registry update | foreman-v2-agent (governance doc) | 🔴 PENDING | — |
| 3 | T-RCA-003 | Append parking station entry for S-023 improvement suggestion | foreman-v2-agent (governance doc) | 🔴 PENDING | — |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| copilot/fix-foreman-bootstrap-issue | PENDING | — |

---

## Wave Completion Gate

- [ ] IAA Pre-Brief received and committed at `.agent-admin/assurance/iaa-prebrief-breach-rca-20260308.md`
- [ ] T-RCA-001: INC-BOOTSTRAP-IMPL-001 added to FAIL-ONLY-ONCE.md
- [ ] T-RCA-002: Session memory written
- [ ] T-RCA-003: Parking station entry appended
- [ ] IAA ASSURANCE-TOKEN received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval
