# IAA Session Memory — Session 160 (PS-B FAIL-ONLY-ONCE v4.2.0 Audit)

**session_id**: session-160-ps-b-fail-only-once-v420-20260407
**date**: 2026-04-07
**pr_reviewed**: copilot/ps-b-foreman-fail-only-once (PS-B: Foreman FAIL-ONLY-ONCE v4.2.0)
**invoking_agent**: foreman-v2-agent
**producing_agent**: foreman-v2-agent
**producing_agent_class**: foreman
**pr_category**: KNOWLEDGE_GOVERNANCE
**checks_executed**: 47
**checks_passed**: 39
**checks_failed**: 8
**merge_gate_parity_result**: FAIL
**verdict**: REJECTION-PACKAGE
**token_reference**: IAA-session-159-ps-b-fail-only-once-v420-20260407-REJECT
**adoption_phase_at_time_of_verdict**: PHASE_B_BLOCKING
**prior_sessions_reviewed**:
  - session-159-wave13-execution-start-20260313 (prior IAA session-159 — different wave)
  - session-158-govliaison-051-reaudit-20260306
  - session-157-wave-wf-dispatch-20260306
  - session-156-wave-ux-alert-fix-20260306
  - session-155-waveGovImpr-audit-20260305

**failures_cited**:
  - F-01 (A-021 / CORE-018a): PREHANDOVER proof not committed before IAA invocation — untracked file
  - F-02 (A-021 / CORE-015 / CORE-018b): Session memory not committed before IAA invocation — untracked file
  - F-03 (A-021 / CORE-018): FAIL-ONLY-ONCE.md v4.2.0 staged-only — git HEAD shows v4.1.0
  - F-04 (A-021): index.md v2.5.0 unstaged — git HEAD shows Knowledge Version 2.4.0
  - F-05 (prehandover-template.md v1.7.0 / A-021): PREHANDOVER proof missing mandatory "Pre-IAA Commit Gate" section
  - F-06 (IAA A-026): SCOPE_DECLARATION.md stale — contains prior wave content (pre-mmm-build-readiness)
  - F-07 (CORE-018 / merge gate parity): governance-ceremony-gate.yml equivalent would fail
  - F-08 (CORE-018 summary): Only 2 of 6 wave files committed; 4 uncommitted at IAA invocation

**substantive_quality_note**: All 6 PS-B changes (PS-B-01 through PS-B-06) are SUBSTANTIVELY CORRECT and will pass on re-invocation. No duplicate A-rule IDs (30 unique). New rules A-033/A-034/A-035 clear, grounded, and non-duplicating. Renumbering A-036/A-037/A-038 correct. Version history accurate.

---

## fail_only_once_rules_applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (IAA invocation evidence) | YES | PREHANDOVER proof exists on disk; token pre-populated — content check PASS; file not committed — A-021 violation |
| A-002 (no class exceptions) | YES | Foreman-class producing agent — IAA mandatory. No exemption claimed. PASS |
| A-021 (commit before IAA invocation) | YES | VIOLATION — 4 uncommitted artifacts detected via git ls-tree |
| A-026 (SCOPE_DECLARATION matches diff) | YES | VIOLATION — stale content from prior wave |
| A-028 (PREHANDOVER immutability) | NOTED | PREHANDOVER not yet committed — immutability does not apply yet; Foreman may still amend before initial commit |

---

## learning_notes

1. **A-021 recurring pattern**: This is a continuing pattern of invoking IAA before committing wave artifacts. The foreman committed the pre-brief (Phase 0 artifact) correctly but did not commit the remaining wave artifacts before invoking IAA. The prehandover-template.md v1.7.0 has a "Pre-IAA Commit Gate (MANDATORY STOP — A-021)" section specifically to prevent this. The PREHANDOVER proof omitted this mandatory section entirely.

2. **Partial commit pattern**: The two committed artifacts (pre-brief + wave-current-tasks.md) represent the correct pre-work. The four remaining artifacts (FAIL-ONLY-ONCE.md, index.md, PREHANDOVER proof, session memory) are all uncommitted. This suggests the foreman interpreted "commit the pre-brief first, then invoke IAA" as sufficient — but A-021 requires ALL artifacts committed.

3. **Pre-IAA Commit Gate omission**: The foreman used the prehandover-template but omitted the mandatory Pre-IAA Commit Gate section entirely. This section exists specifically to force a self-verification check (paste actual git status) before IAA is called. Its absence is both a template compliance failure and evidence of the A-021 violation.

4. **SCOPE_DECLARATION.md staleness**: The SCOPE_DECLARATION.md on the branch contained content from a completely different wave (governance-liaison-isms session-056). This is a repeat pattern (sessions 116, 120, 152 previously). A-029 + A-026 are both violated.

5. **Substantive quality high**: Unusually, the substantive content is fully correct — all 6 PS-B changes are properly implemented, no duplicate IDs, clear rule text, incident grounding, version history. The rejection is purely procedural.

---

## fail_only_once_updates

No new FAIL-ONLY-ONCE entries required this session. All patterns observed are covered by existing rules:
- A-021 (commit before IAA invocation) — ACTIVE, recurring
- A-026 (SCOPE_DECLARATION staleness) — ACTIVE, recurring  
- Pre-IAA Commit Gate omission — already captured by A-021 + template requirement

Candidate for escalation to CS2: Consider whether the A-021 violation pattern (now at minimum 4th recurrence) warrants an explicit FAIL-ONLY-ONCE entry in the IAA's own registry specifically about the Pre-IAA Commit Gate section being mandatory (not just the A-021 principle). Currently A-021 covers the principle but the template section omission is a separate observable failure mode.

---

## Suggestions for Improvement

**Concrete improvement (session 160)**: The Pre-IAA Commit Gate section in the prehandover-template.md should be enforced by a CI check — not just a template requirement. A simple `git ls-tree HEAD` check for the four mandatory files (PREHANDOVER proof, session memory, main deliverable, index.md) before governance-ceremony-gate.yml runs would catch this class of failure automatically. This would convert A-021 from "IAA finds it" to "CI blocks it." Candidate for S-XXX improvement suggestion in the Foreman's parking station.

---

## Parking Station Entry

Added to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:
`| 2026-04-07 | independent-assurance-agent | session-160 | Phase 3 | Pre-IAA Commit Gate section omission — CI check for mandatory committed artifacts before governance-ceremony-gate.yml | session-160-ps-b-fail-only-once-v420-20260407.md |`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
