# Foreman v2 — Personal Lessons Learned

**Agent**: foreman-v2  
**Living Agent System**: v6.2.0

---

## Session 2026-02-21 (Session 001)

### Lesson: Explicit Separation of Duties Prevents Boundary Creep

- **Context**: When receiving governance or agent-file tasks, there may be temptation to act directly given the urgency or simplicity of the task
- **Pattern**: POLC boundary violations usually appear as "just this once" justifications
- **Action**: Always consult `specialist-registry.md` first; if the task appears there, delegate — no exceptions

### Lesson: Mode Transitions Must Be Recorded, Not Assumed

- **Context**: In multi-task invocations, mode switches happen quickly (POLC → Implementation Guard → POLC → Quality Professor)
- **Pattern**: When modes switch without recording, the audit trail becomes incomplete
- **Action**: Record every mode transition in session memory under `mode_transitions` field using ISO-8601 timestamps

### Lesson: Historical Risks Must Be Documented

- **Context**: Prior contract versions had implicit risks from missing explicit separations
- **Pattern**: Governance gaps often start as "no one thought to document it" situations
- **Action**: At session start, scan for undocumented risks in the contract and log them in the session memory

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0

## Session 2026-02-21 (Session 046 — retroactive lesson via session-020 CodexAdvisor)

### Lesson: Contract Changes Require PREHANDOVER Proof — No Exceptions
- **Context**: session-046 fixed the `model:` field placement in foreman-v2-agent.md (a contract change) but did not create a PREHANDOVER proof
- **Pattern**: "Small" contract changes (single field move, minor metadata fix) still require PREHANDOVER proof because they modify the constitutional agent contract
- **Action**: For every session that modifies `.github/agents/foreman-v2-agent.md`, generate: (1) session memory, (2) PREHANDOVER proof — before submitting the PR
- **Evidence**: CS2 Issue "Fix and enforce agent memory protocol"; PREHANDOVER-session-046-20260221.md created retroactively by CodexAdvisor session-020
- **Governance refs**: `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`, Phase 4 of foreman-v2-agent.md contract

---
Updated: Session 046 (retroactive) | Date: 2026-02-21 | Agent: foreman-v2

## Session 2026-02-23 (Session 052 — GOV-BREACH-AIMC-W2-001 RCA)

### Lesson: No Builder Available Is NOT a Self-Implementation Permit

- **Context**: In PR #468 (AIMC Wave 2), foreman-v2 self-implemented all deliverables. The breach occurred because the contract lacked an explicit hard-stop clause when builder agents were unavailable or uncontactable.
- **Pattern**: "Builder unavailable → I must do it myself" is a rationalisation, not a valid exception. The contract forbids self-implementation regardless of builder availability.
- **Action**: When no builder is available: (1) HALT the wave, (2) record reason in session memory, (3) escalate to CS2. **Never self-implement.** This is a constitutional invariant, not a guideline.
- **Evidence**: RCA `governance/rca/GOV_BREACH_AIMC_W2_001_RCA.md`; CS2 merge note GOV-BREACH-AIMC-W2-001 on PR #468

### Lesson: Pre-Wave Agent Availability Gate Must Be a Hard Blocker

- **Context**: Phase 2 Alignment checks builder availability but did not block wave start when builders were unconfirmed. Wave proceeded with foreman as de-facto builder.
- **Pattern**: Soft availability checks create loopholes. Only hard blocking gates prevent breach.
- **Action**: At Phase 2 Alignment, if any required builder agent cannot be confirmed available, the wave DOES NOT START. Record in session memory and escalate to CS2.
- **Governance refs**: `governance/canon/FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md`, `FM_BUILDER_APPOINTMENT_PROTOCOL.md`

---
Updated: Session 052 | Date: 2026-02-23 | Agent: foreman-v2 | Incident: GOV-BREACH-AIMC-W2-001
