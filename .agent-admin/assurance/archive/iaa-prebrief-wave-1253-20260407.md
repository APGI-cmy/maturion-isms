# IAA Pre-Brief — Wave 1253 — Foreman 12-Stage Alignment

**Wave**: wave-1253-foreman-12stage-alignment
**Issue**: maturion-isms#1253
**Branch**: copilot/align-foreman-contract-logic
**Date**: 2026-04-07
**IAA session**: pre-brief

---

## Trigger Classification

- AGENT_CONTRACT: YES — modifying `.github/agents/foreman-v2-agent.md` (AGCFPP-001 applies)
- GOVERNANCE_UPDATE: YES — adding new pre-build model and HALT conditions

## FFA Checks at Handover

- [ ] YAML frontmatter valid (contract_version: 2.9.0)
- [ ] All four phases present and non-empty
- [ ] Character count ≤ 30,000
- [ ] No placeholder/stub/TODO content
- [ ] Prohibition block complete (NO-SKIP-PREBUILD-001 present)
- [ ] HALT conditions complete (HALT-009/010/011 present)
- [ ] Phase 2 steps 2.5a/b/c present
- [ ] Phase 3 Step 3.3 references all 6 pre-build gates
- [ ] Phase 3 Step 3.4a present
- [ ] PREHANDOVER proof committed (git)
- [ ] Session memory committed (git)
- [ ] Ripple assessment included in PREHANDOVER proof

## PREHANDOVER Proof Structure Required

- Session ID, date, agent version, issue ref
- Job summary (all 9 changes listed)
- QP verdict: PASS
- OPOJD gate: PASS
- CANON_INVENTORY: ALIGNED
- Bundle completeness table
- Ripple assessment (NO DOWNSTREAM RIPPLE REQUIRED)
- IAA audit token reference (§4.3b)

## Scope Blockers

None identified. CS2 authorization confirmed. Content scope is Foreman-internal orchestration
logic — no downstream builder contract changes required.
