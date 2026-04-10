# Wave Current Tasks — Issue 1271

wave: ps-i-governance-liaison-cleanup-20260410
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-ps-i-governance-liaison-cleanup-20260410.md

## Active Wave: PS-I (Governance Liaison Session Memory Template Cleanup)

### Wave Description
CodexAdvisor-agent implements 4 cleanup changes to the governance-liaison-isms session memory template
and agent contract per issue #1271. Changes include:
- PS-I-01: Remove `iaa_invocation_result:` field from template
- PS-I-02: Update `advisory_phase: PHASE_A_ADVISORY` → `PHASE_B_BLOCKING` in agent contract
- PS-I-03: Add mandatory pre-IAA commit gate to liaison PREHANDOVER template
- PS-I-04: Add SCOPE_DECLARATION fresh-overwrite instruction

CS2 Authorization: Issue maturion-isms#1271 opened and assigned by @APGI-cmy (CS2 = Johan Ras).
Wave-start authorization confirmed.

IAA Pre-Brief: `.agent-admin/assurance/iaa-prebrief-ps-i-governance-liaison-cleanup-20260410.md` (COMMITTED)
IAA Token: PENDING

### Tasks
- [x] PS-I-01: Remove `iaa_invocation_result:` field from session memory template
  (`.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md`)
- [x] PS-I-02: Update `advisory_phase: PHASE_A_ADVISORY` → `PHASE_B_BLOCKING`
  (`.github/agents/governance-liaison-isms-agent.md`)
- [x] PS-I-03: Add mandatory pre-IAA commit gate to liaison PREHANDOVER template
  (`.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md`)
- [x] PS-I-04: Add SCOPE_DECLARATION fresh-overwrite instruction
  (`.agent-workspace/governance-liaison-isms/knowledge/session-memory-template.md`)
- [ ] T5: QP evaluation PASS + PREHANDOVER proof committed + SCOPE_DECLARATION PASS
- [ ] T6: IAA final audit PASS

### Status
IAA PRE-BRIEF PENDING — awaiting IAA Pre-Brief artifact before delegation to CodexAdvisor-agent.

### Previous Wave (Closed)
wave: cl-7-personaloader-improvements-lkiac-l3 (Issue #1326) — CLOSED
