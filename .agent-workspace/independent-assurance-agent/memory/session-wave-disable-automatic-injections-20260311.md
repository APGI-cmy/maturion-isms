# IAA Session Memory — wave-disable-automatic-injections-20260311

## Metadata
- session_id: wave-disable-automatic-injections-20260311
- date: 2026-03-11
- iaa_agent_version: 6.2.0
- contract_version: 2.2.0
- authority: CS2 ONLY (@APGI-cmy)

## Invocation Context
- pr_reviewed: "#1061 / branch: copilot/disable-automatic-injections-yet-again / commit: e18eadc"
- invoking_agent: foreman-v2-agent
- producing_agent: "copilot-swe-agent[bot] (acting as CodexAdvisor proxy per CS2 issue assignment)"
- producing_agent_class: foreman/builder-proxy (CodexAdvisor role)
- wave_name: "wave-disable-automatic-injections-and-reinforce-contract"

## Classification
- pr_category: "AGENT_CONTRACT (T1 — governing category); also CI_WORKFLOW, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE"
- trigger_categories_evaluated: [AGENT_CONTRACT, CI_WORKFLOW, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE, PRE_BRIEF_ASSURANCE]

## Check Results
- checks_executed: ~48 checks across all overlays plus merge gate parity
- checks_passed: ~34
- checks_failed: 14
- merge_gate_parity_result: FAIL (4 local parity failures: PREHANDOVER absent, session memory absent, SCOPE_DECLARATION stale, CANON_INVENTORY hash mismatch)

## Verdict
- verdict: REJECTION-PACKAGE
- token_reference: IAA-session-wave-disable-automatic-injections-20260311-REJECTION
- token_file: ".agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311.md"
- adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

## Failures Cited

1. CORE-006: CANON_INVENTORY.json not updated — IAA canon v1.5.0 hash stale (inventory has v1.4.0 hash `0a5f860b`; actual file hash `5ec59f5d`)
   Fix: Update governance/CANON_INVENTORY.json IAA canon entry: version=1.5.0, hash=5ec59f5dc89b60ec0422a21b2aee8492ef5dde3ac2f9452241eeb67561721ea4

2. CORE-013: IAA invocation evidence absent — No PREHANDOVER proof on branch. A-001 violation.
   Fix: Create and commit PREHANDOVER-wave-disable-automatic-injections-20260311.md

3. CORE-015: Foreman session memory absent from branch
   Fix: Create and commit session-wave-disable-automatic-injections-20260311.md

4. CORE-018: Evidence sweep failure — (a) PREHANDOVER absent, (b) session memory absent, (c) iaa_audit_token unverifiable
   Fix: Same as CORE-013 + CORE-015

5. OVL-AC-002: Contradiction — foreman iaa_oversight.advisory_phase: PHASE_A_ADVISORY contradicts current IAA PHASE_B_BLOCKING
   Fix: Update foreman-v2-agent.md iaa_oversight.advisory_phase → PHASE_B_BLOCKING

6. OVL-AC-007: No ripple assessment in PREHANDOVER; CANON_INVENTORY ripple omitted from wave scope
   Fix: Include ripple assessment in PREHANDOVER; add CANON_INVENTORY to scope

7. OVL-AC-ADM-001: PREHANDOVER proof absent from PR bundle
   Fix: Create PREHANDOVER proof (same as CORE-013)

8. OVL-AC-ADM-002: Foreman session memory absent
   Fix: Create session memory (same as CORE-015)

9. contract_version not bumped: Wave claims 2.6.0→2.7.0 but file still says 2.6.0
   Fix: Change contract_version: 2.6.0 → 2.7.0 in foreman-v2-agent.md

10. OVL-CI-005: No CI evidence; S-033 exception not documented in PREHANDOVER
    Fix: PREHANDOVER must explicitly invoke S-033 with YAML validation evidence, pattern parity, and workflow_dispatch confirmation

11. OVL-CG-004: CANON_INVENTORY not updated for INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.5.0
    Fix: Same as CORE-006 — update CANON_INVENTORY.json

12. OVL-CG-005: Layer-down scope incomplete — CANON_INVENTORY.json missed
    Fix: Same as CORE-006

13. A-026: SCOPE_DECLARATION.md stale — references prior wave (wave-criteria-display-bugfix-1049)
    Fix: Replace SCOPE_DECLARATION.md with current wave declaration

14. Merge Gate Parity (§4.3): 4 local gate failures
    Fix: Resolve all above — PREHANDOVER, session memory, SCOPE_DECLARATION, CANON_INVENTORY

## Passing Evidence Noted
- All 5 injection workflows correctly deactivated with workflow_dispatch only and # DISABLED comment
- iaa-prebrief-inject.yml references fully removed from foreman-v2-agent.md
- 5 re-anchor reminders present at lines 250, 315, 370, 509, 522
- foreman-v2-agent.md char count 29,994 ≤ 30,000
- SELF-MOD-FM-001 CONSTITUTIONAL prohibition intact
- secret_env_var (not secret:) — A-024 compliant
- INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.5.0 correct content
- iaa-category-overlays.md v3.4.0 PRE_BRIEF_ASSURANCE rename correct
- Pre-Brief artifact: present, non-empty, correct wave slug
- All 6 workflow YAML files syntax-valid
- polc-boundary-gate.yml gate logic intact

## Prior Sessions Reviewed
- Last 5: session-wave16-full-batch-20260310, session-wave-wf-contract-audit-20260310, session-waveOVLINJ-20260307, session-gov-improvement-s032-s033-s007-s023-20260310-R2, session-wave-ldcs-parse-bugfix-20260310
- All prior sessions: ASSURANCE-TOKEN. No open REJECTION-PACKAGEs carried forward.
- Breach registry: clear

## Unresolved Items Carried Forward
- None beyond this REJECTION-PACKAGE itself

## FAIL-ONLY-ONCE Rules Applied
- A-001: FAIL — PREHANDOVER proof absent (produced CORE-013 finding)
- A-002: PASS — no class exemption claimed; Foreman contract subject to IAA
- A-021: PASS — all changes committed in commit e18eadc before IAA invocation
- A-022: PASS — all 4 trigger categories evaluated (AGENT_CONTRACT, CI_WORKFLOW, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE)
- A-023: FAIL (cascades) — OVL-AC-007/ripple assessment absent (no PREHANDOVER to contain it)
- A-024: PASS — secret_env_var used
- A-025: PASS — iaa_audit_token: PENDING in pre-brief (valid pre-populated reference)
- A-026: FAIL — SCOPE_DECLARATION.md stale (prior wave content)
- A-029: Noted — PREHANDOVER must be created before re-invocation; immutability rule applies after first commit

## FAIL-ONLY-ONCE Updates
No new FAIL-ONLY-ONCE rules required this session. Existing rules (A-001, A-021, A-026) correctly triggered and produced findings. The CANON_INVENTORY staleness pattern (failing to update CANON_INVENTORY.json when updating a canon file) is a recurring pattern — already partially captured under CORE-006 but would benefit from explicit codification. Flagging as a suggestion below.

## Learning Notes
1. **CANON_INVENTORY update is a mandatory ripple for every canon file change.** This was missed in this wave. The canon file SHA changed (v1.4.0 → v1.5.0) but CANON_INVENTORY.json was not in the PR diff. Agents modifying `governance/canon/*.md` files must always also update `governance/CANON_INVENTORY.json` in the same commit. Consider adding a FAIL-ONLY-ONCE rule (A-033 candidate): "Any PR that modifies a canon file must also update CANON_INVENTORY.json with the new hash in the same wave. Omission = CORE-006/OVL-CG-004 FAIL."

2. **contract_version must be bumped when contract content changes.** This is the third wave where a contract was modified but the version bump was omitted or inconsistently stated. When the wave description says "v2.6.0 → v2.7.0" but the YAML still says 2.6.0, the fix was planned but not delivered. Producers should include the version bump as a final checklist item in the PREHANDOVER proof.

3. **iaa_oversight.advisory_phase stale field in foreman contract.** The Foreman contract has had `advisory_phase: PHASE_A_ADVISORY` since IAA was first added to Foreman oversight. IAA has been PHASE_B_BLOCKING since the adoption phase upgrade. This field has been stale for multiple waves and was not corrected. Future AGENT_CONTRACT waves for foreman-v2-agent.md should include this field update.

4. **SCOPE_DECLARATION.md persists from prior waves on the same repo.** When a new branch is cut from main, the prior wave's SCOPE_DECLARATION.md is inherited. Producers consistently forget to update it. This is A-026 pattern — well-established. The fix is simple but keeps recurring.

5. **S-033 exception (OVL-CI-005) requires explicit PREHANDOVER documentation** — it cannot be satisfied by IAA's independent file inspection. Even though IAA confirmed `workflow_dispatch` is retained and YAML is valid, the S-033 clause requires the *producing agent* to explicitly invoke it in the PREHANDOVER. IAA's own verification does not substitute.

## Suggestions for Improvement
1. **FAIL-ONLY-ONCE A-033 candidate**: "Canon file modifications require CANON_INVENTORY.json update in the same wave. Omission produces CORE-006/OVL-CG-004 FAIL. Add `governance/CANON_INVENTORY.json` to SCOPE_DECLARATION and PREHANDOVER ripple assessment whenever any `governance/canon/*.md` file is modified." — This pattern has now occurred at least twice and should be codified.
2. **Prehandover template improvement**: Add a mandatory `## Canon File Changes` section to the PREHANDOVER template that lists each `governance/canon/*.md` file modified and the corresponding CANON_INVENTORY.json update (old hash → new hash). This makes the ripple check self-documenting.
3. **polc-boundary-gate.yml pre-brief check**: The gate already checks for `iaa-prebrief-*.md` existence but does NOT check for PREHANDOVER proof or session memory. Extending the gate to flag missing PREHANDOVER proof would catch the most common REJECTION-PACKAGE trigger before IAA invocation.

## Parking Station Entry
Logged to: `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0 | **IAA version**: 6.2.0
