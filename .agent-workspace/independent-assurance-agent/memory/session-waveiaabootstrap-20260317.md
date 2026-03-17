# IAA Session Memory — session-waveiaabootstrap-20260317

```yaml
session_id: session-waveiaabootstrap-20260317
date: 2026-03-17
session_type: PHASE_4_ASSURANCE
wave: maturion-iaa-bootstrap
branch: copilot/adopt-standardized-bootstrap-workflow
invoking_agent: foreman-v2-agent (Phase 4 Handover Audit Request)
producing_agent: Copilot coding agent (builder class) under Foreman orchestration
producing_agent_class: builder
pr_category: CI_WORKFLOW (primary) + PRE_BRIEF_ASSURANCE (overlay)
checks_executed: 21
checks_passed: 20
checks_failed: 1
merge_gate_parity_result: PASS (all three gate checks confirmed locally)
verdict: REJECTION-PACKAGE
token_reference: IAA-REJECTION-session-waveiaabootstrap-20260317
rejection_artifact: .agent-admin/assurance/iaa-rejection-session-waveiaabootstrap-20260317.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-wave18-postmerge-hotfix-20260315-AUDIT (REJECTION-PACKAGE — different PR, resolved)
  - session-waveOVLINJ-20260307 (ASSURANCE-TOKEN — different PR)
  - session-wave16-full-batch-20260310 (ASSURANCE-TOKEN — different PR)
  - session-wave16-orchestration-20260309-R2 (ASSURANCE-TOKEN — different PR)
  - session-wave16-orchestration-20260309 (REJECTION-PACKAGE — resolved)

unresolved_items_from_prior: none

failures_cited:
  - finding: FINDING-1
    check: OVL-CI-001 / CORE-021
    detail: ".github/runner/Dockerfile line 58 has 'COPY scripts/agent-runner.sh' but build context per README is .github/runner/ — no scripts/ subdirectory exists there; actual script is at .github/scripts/agent-runner.sh; docker build will fail when Phase 2 is implemented"
    fix_required: "Update Dockerfile COPY path to '../scripts/agent-runner.sh' OR update README build command to use '.github/' as context — three options documented in rejection artifact"

fail_only_once_rules_applied:
  - rule: A-001
    outcome: PASS — Pre-Brief committed at 789d6fc before builder artifacts at 2bb0274; PREHANDOVER references IAA token
  - rule: A-026
    outcome: APPLIED — 3 governance ceremony files (PREHANDOVER proof, session memory, parking station) in diff but not in PREHANDOVER Scope Declaration tables; assessed as governance overhead carve-out (analogous to A-031); all acknowledged in Evidence Bundle section; NOT a failing check
  - rule: A-029
    outcome: PASS — PREHANDOVER proof read-only post-commit; iaa_audit_token pre-populated with expected reference IAA-session-waveiaabootstrap-20260317-PASS; IAA rejection artifact written as new dedicated file
  - rule: A-031
    outcome: APPLIED — carve-out spirit extended to Foreman's own governance ceremony artifacts (PREHANDOVER proof self-reference, session memory, parking station)

checks_passed_detail:
  - A-001 IAA invocation evidence PASS
  - CORE-005 Governance block N/A-CI-PASS
  - CORE-006 CANON_INVENTORY 191 entries, 0 bad hashes PASS
  - CORE-007 Documented stubs acceptable PASS
  - CORE-013 IAA invocation evidence pre-brief + PREHANDOVER PASS
  - CORE-014 No class exemption PASS
  - CORE-015 Session memory present PASS
  - CORE-016 First Invocation Exception PASS
  - CORE-017 Zero .github/agents/ files PASS
  - CORE-018 Evidence sweep complete PASS
  - CORE-019 First Invocation Exception PASS
  - CORE-020 Zero partial pass PASS
  - CORE-023 Workflow integrity ripple PASS
  - OVL-CI-002 Merge gate integrity / AGCFPP-001 intact PASS
  - OVL-CI-003 No silent failure risk PASS
  - OVL-CI-004 Environment parity PASS
  - OVL-CI-005 S-033 exception all 3 conditions met PASS
  - OVL-INJ-001 Pre-brief artifact existence PASS

learning_notes:
  - "Container scaffold Dockerfiles should be verified for build context consistency at time of creation — COPY paths must align with documented build commands and actual file structure. A scaffold with incorrect paths is worse than no scaffold: it misleads Phase 2 implementors."
  - "A-026 governance ceremony carve-out: Foreman's own PREHANDOVER proof, session memory, and parking station entries are analogous to IAA's A-031 carve-out — they are governance overhead, not task deliverables. These are always acknowledged in the Evidence Bundle section. Consider codifying this as A-033 to avoid repeated assessment."
  - "YAML 'on:' key parsed as boolean True in Python yaml.safe_load (YAML 1.1 behavior). IAA must use parsed.get(True, {}) not parsed.get('on', {}) when validating workflow triggers programmatically."
  - "OVL-CI-005 S-033 exception was properly invoked in PREHANDOVER with all three conditions. Pattern of correct S-033 usage established — this is the reference implementation."

fail_only_once_updates:
  - proposed: "A-033 — Governance ceremony files (PREHANDOVER proof, session memory, parking station entries) are implicitly carved out from A-026 SCOPE_DECLARATION exact-match requirement when they ARE acknowledged in the Evidence Bundle section of the PREHANDOVER proof. The A-026 requirement applies to TASK DELIVERABLES only, not governance overhead artifacts."
  - status: PROPOSED — requires CS2 ratification before addition to FAIL-ONLY-ONCE.md

suggestions_for_improvement:
  - "Container Dockerfile scaffolds should be validated for build-context consistency at creation time: the COPY path must be resolvable from the documented build command's context directory. This is a scope check that can be added to OVL-CI-001 as a sub-condition for PRs introducing Dockerfile scaffolds. Recommend adding to iaa-category-overlays.md OVL-CI-001 detail: 'If PR includes Dockerfile, verify COPY/ADD paths resolve correctly from documented build context.'"

parking_station:
  - date: 2026-03-17
    agent: independent-assurance-agent
    session: session-waveiaabootstrap-20260317
    phase: PHASE_3
    summary: "Dockerfile COPY path consistency should be an explicit OVL-CI-001 sub-condition for PRs introducing container scaffolding. Add to category-overlays.md."
    file: session-waveiaabootstrap-20260317.md
```
