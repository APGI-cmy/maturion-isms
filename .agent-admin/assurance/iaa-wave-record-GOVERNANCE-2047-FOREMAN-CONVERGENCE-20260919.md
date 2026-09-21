# IAA Wave Record — GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919

**PR**: #2049 — Harden Foreman convergence and anti-loop controls
**Issue**: #2047 — Governance: harden Foreman convergence and anti-loop controls
**Branch**: copilot/governance-harden-foreman-controls
**PR-scoped task record**: `.agent-admin/prs/pr-2049/wave-current-tasks.md`
**Invocation type**: `Action: PRE-BRIEF` (Phase 0 only — no Phase 1–4 assurance executed in this invocation)

---

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919"
  pr: "#2049"
  issue: "#2047 — Governance: harden Foreman convergence and anti-loop controls"
  branch: "copilot/governance-harden-foreman-controls"
  qualifying_tasks:
    - task_id: "GOV-2047-01"
      summary: "governance-liaison-isms-agent assesses authoritative/canonical ripple and produces the consumer layer-down plan for Foreman, IAA, operating-model, and ECAP control changes before any consumer implementation."
      assurance_category: "CANON_GOVERNANCE / LIAISON_ADMIN"
    - task_id: "GOV-2047-02"
      summary: "CodexAdvisor-agent applies CS2-authorized minimal contract hardening to .github/agents/foreman-v2-agent.md and .github/agents/independent-assurance-agent.md: remediation ladder, Foreman-owned-prerequisite handling, no terminal READY_FOR_IAA state, PR-scoped-first pre-brief route with legacy fallback only when no PR record exists, and stable reviewed-head/external-attestation semantics replacing exact-current-HEAD evidence."
      assurance_category: "AGENT_CONTRACT"
    - task_id: "GOV-2047-03"
      summary: "CodexAdvisor-agent applies the corresponding consumer controls in Foreman Tier 2 knowledge (foreman-tier2-operating-protocol.md, FAIL-ONLY-ONCE.md), FOREMAN_OPERATING_MODEL.md, the consumer IAA protocol/schema/workflow material, and the directly applicable ECAP boundary protocol, while leaving the CS2-only canonical IAA_PRE_BRIEF_PROTOCOL amendment as a recommendation/blocker rather than an implemented change."
      assurance_category: "KNOWLEDGE_GOVERNANCE / CANON_GOVERNANCE"
    - task_id: "GOV-2047-04"
      summary: "pit-specialist adds focused PIT controller tests and controller documentation covering automatic IAA pre-brief invocation, IAA rejection-to-Foreman correction/reinvocation, protected-conflict CodexAdvisor routing, non-terminal READY_FOR_IAA prohibition, PR-scoped and legacy-fallback path behavior, and exact-head loop prevention. No PIT product behaviour change."
      assurance_category: "MIXED (test/controller-doc scope touching governance-controller semantics; AMBIGUITY RULE applied — treated as mandatory, not EXEMPT)"
    - task_id: "GOV-2047-05"
      summary: "qa-builder executes focused QA for the controller/contract hardening and reports results, skips, warnings, and regression evidence, preserving 100%-GREEN and zero-test-debt controls."
      assurance_category: "AAWP_MAT-adjacent evidence support (non-triggering standalone; MIXED with PR overall)"
  required_build_gates:
    - "agent-contract-format-gate.yml (GREEN, CI-confirmed, not assumed)"
    - "preflight-evidence-gate.yml (GREEN, CI-confirmed)"
    - "merge-gate-interface.yml / merge-gate-required-checks-alignment.yml parity"
    - "CANON_INVENTORY.json hash update and verification for every touched governance/canon/ file"
    - "YAML parseability and identity-field integrity for .github/agents/foreman-v2-agent.md and independent-assurance-agent.md"
    - "iaa-preflight-brief.schema.json validation for this and any future pre-brief in this wave"
  expected_qa_scope:
    - "Automatic IAA pre-brief invocation at wave start (Foreman-triggered, not self-certified)"
    - "IAA REJECTION-PACKAGE → Foreman correction → re-invocation loop, with no partial resolution accepted"
    - "Proven protected/external-boundary conflict → CodexAdvisor-agent routing (not a false stop on an ordinary Foreman-owned prerequisite)"
    - "READY_FOR_IAA is never asserted or treated as a terminal/completion state"
    - "PR-scoped-first task-record resolution (.agent-admin/prs/pr-<N>/wave-current-tasks.md) with legacy fallback (.agent-workspace/foreman-v2/personal/wave-current-tasks.md) used only when no PR-scoped record exists"
    - "Exact-current-HEAD self-referential evidence loop is not reproducible — stable reviewed-head or external-attestation model is exercised"
    - "Regression coverage confirming no PIT product/database/Supabase/deployment/secrets/release behaviour changed"
  high_risk_failure_modes:
    - "governance/canon/IAA_PRE_BRIEF_PROTOCOL.md (v1.3.0, CS2 amendment-gated) and .agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md (Wave 1 canonical protocol) drift out of coherence after this wave's edits — OVL-AC-002 contradiction risk, same failure class as PR #2048's ECAP-status contradiction finding"
    - "Reintroduction of exact-current-HEAD self-referential evidence (the precise defect PR #2046/#2047 exists to correct)"
    - "READY_FOR_IAA reintroduced or treated as a terminal/completion state in Foreman contract wording"
    - "Class-exemption claim for the AGENT_CONTRACT trigger for any agent class (FAIL-ONLY-ONCE A-002/A-019 — prohibited, no exceptions)"
    - "CodexAdvisor or Foreman self-certifying IAA assurance or merge readiness (issue #2047 explicit prohibition)"
    - "IAA independence or STOP-AND-FIX mandate weakened, removed, or waived to resolve convergence friction"
    - "Out-of-scope PIT product/DB/Supabase/deployment/secrets/release change introduced under cover of this governance wave"
    - "wave-current-tasks.md left in a status state (e.g. PREFLIGHT_PENDING / task checkboxes / iaa_prebrief_path) that contradicts the actual wave/bundle state at handover (ACR-15 pattern)"
    - "execution-ceremony-admin-agent, if appointed, writes or implies a token/verdict (ECAP-001/ECAP-02 token-writing-is-IAA-only invariant)"
    - "Cross-PR or cross-session IAA token reuse given this wave's direct lineage from PR #2046/#2048 (FAIL-ONLY-ONCE A-016/A-017)"
  required_builder_evidence:
    - "Concise change/ripple inventory showing why each modified artifact (contract, Tier 2 knowledge, FOREMAN_OPERATING_MODEL.md, both IAA protocol files, ECAP boundary protocol, PIT controller tests/docs) is necessary"
    - "Focused tests for the new behavioural rules, explicitly covering both PR-scoped and legacy-fallback IAA task-record paths"
    - "Evidence that contract/CANON/schema/workflow and current-head checks were run honestly (commit-backed, not working-tree-only per FAIL-ONLY-ONCE A-021)"
    - "governance-liaison-isms-agent ripple assessment/layer-down plan committed before consumer implementation proceeds (GOV-2047-01 gates GOV-2047-02/03)"
    - "qa-builder QA report: results, skips, warnings, regression evidence, 100%-GREEN and zero-test-debt confirmation"
    - "If ceremony-admin is appointed: PREHANDOVER proof, session memory, and (per ACR-01) a populated ECAP reconciliation summary in the Tier 3 proof bundle"
    - "PR-scoped wave-current-tasks.md kept coherent with actual task/bundle state at every checkpoint (no stale PENDING/COMPLETE contradiction)"
  required_foreman_qp_checks:
    - "Verify governance/canon/IAA_PRE_BRIEF_PROTOCOL.md and .agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md remain mutually consistent (no contradictory wording, path, or versioning) after GOV-2047-03"
    - "Verify no PIT product behaviour, database, Supabase, deployment, secrets, or release change is present in the diff"
    - "Verify CANON_INVENTORY.json hashes are updated for every touched governance/canon/ file"
    - "Verify no class-exemption language is introduced anywhere for the AGENT_CONTRACT trigger"
    - "Verify .github/agents/independent-assurance-agent.md STOP-AND-FIX mandate, independence language, and Self-Modification Lock remain unweakened"
    - "Verify READY_FOR_IAA is not defined or usable as a terminal/completion state in the amended Foreman contract"
    - "Verify token-writing remains IAA-only if execution-ceremony-admin-agent is appointed for this wave"
    - "Verify GOV-2047-01 ripple/layer-down assessment is committed and reviewed before GOV-2047-02/03 consumer edits are finalized"
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prs/pr-2049/ecap-admin-bundle-<date>.md (administrative only — no substantive readiness language)"
    - "ECAP_RECONCILIATION_SUMMARY (per ECAP_RECONCILIATION_SUMMARY.template.md), if execution-ceremony-admin-agent is appointed"
    - "PREHANDOVER proof and session memory, committed and current, referenced by the PR-scoped wave-current-tasks.md"
  final_iaa_focus:
    - "Substance: does the hardened Foreman/IAA control set actually stop false stops on ordinary Foreman-owned prerequisites while still escalating genuine protected/external boundaries?"
    - "Coherence: do all touched artifacts (contract, Tier 2 knowledge, FOREMAN_OPERATING_MODEL.md, both IAA protocol files, ECAP boundary protocol) tell one consistent story with no contradiction?"
    - "Non-regression: is IAA independence, STOP-AND-FIX authority, and the AGENT_CONTRACT no-class-exemption rule fully intact?"
    - "Scope discipline: is the ripple limited to the six bounded areas in issue #2047, with no unrelated CANON clean-up or PIT product/behaviour change?"
    - "Evidence integrity: are commit-backed, CI-confirmed gate results present — not assumed, not working-tree-only, not self-referential exact-HEAD evidence?"
    - "Tracker coherence: does wave-current-tasks.md accurately reflect true task/bundle state at handover, with no PENDING/COMPLETE contradiction (ACR-15)?"
  result: PREFLIGHT_BRIEF_COMPLETE
```

---

## Notes / Genuine Blockers for Foreman

1. **No blocker to issuing this Pre-Brief.** The PR-scoped prerequisite (`.agent-admin/prs/pr-2049/wave-current-tasks.md`) required by the prior STOP-AND-FIX is present, committed (`7bbc2acf58c47946d1fb3e3d5e639cc958b2dd20`), and has been used as the primary source per `IAA_PREFLIGHT_BRIEF_PROTOCOL.md §5`. The legacy path (`.agent-workspace/foreman-v2/personal/wave-current-tasks.md`) was checked and found to belong to an unrelated prior wave (issue #2016 / PR #2017) — correctly not used.
2. **Ceremony-admin appointment was resolved before final assurance.** The PR-scoped tracker now records `ceremony_admin_appointed: true`, and the PR-scoped PREHANDOVER / session-memory evidence was committed before the final IAA invocation.
3. **Dual-protocol-file coherence remained a named high-risk failure mode** (see above) and was treated as a mandatory final-assurance check because two separate documents govern IAA pre-brief mechanics: the CS2-amendment-gated `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` (v1.3.0) and the newer `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md` ("Wave 1 canonical protocol", schema-bound).
4. **Sequencing dependency satisfied:** GOV-2047-01 (ripple/layer-down assessment) remained the prerequisite gate for GOV-2047-02/03, and the final assurance reviewed the resulting committed wave after that prerequisite had already been satisfied.
5. **Final assurance has now been executed.** The PRE-BRIEF above remains the Phase 0 record for the wave, and the final PASS verdict for the completed PR-scoped handback is recorded in the TOKEN section below.

**Status**: `FINAL IAA PASS RECORDED — SEE TOKEN SECTION BELOW`

---

## TOKEN

```yaml
IAA_FINAL_ASSURANCE:
  date_utc: "2026-09-20T11:52:25Z"
  pr: "#2049 — Harden Foreman convergence and anti-loop controls"
  issue: "#2047 — Governance: harden Foreman convergence and anti-loop controls"
  category: "AGENT_CONTRACT"
  invoked_by: "foreman-v2-agent final handback route"
  produced_by:
    - "governance-liaison-isms-agent"
    - "CodexAdvisor-agent"
    - "pit-specialist"
    - "qa-builder"
    - "execution-ceremony-admin-agent"
    - "foreman-v2-agent"
  ceremony_admin: true
  independence: "CONFIRMED"
  stable_reviewed_head_sha: "54d06636c4a3968cbea0588866d0ab4e59ce40b2"
  current_head_sha: "1bbcaf02b140a47dfc630c1dca1f47fa630ebc47"
  bounded_post_review_delta:
    non_admin_files:
      - ".github/workflows/producer-next-action-guidance.yml"
    assessment: "Post-reviewed commits after the stable reviewed head are limited to PR-scoped admin/evidence normalization plus one bounded producer-guidance rate-limit workflow fix; no substantive implementation was reopened."
  local_validation:
    producer_next_action_guidance_test: "PASS (17 passed, 0 failed)"
    resolve_active_pr_state_test: "PASS (7 passed, 0 failed)"
    delegation_order_gate: "PASS"
    git_diff_check: "PASS"
  hosted_required_checks:
    merge_gate_verdict: "PASS"
    governance_alignment: "PASS"
    stop_and_fix_enforcement: "PASS"
    preflight_phase_1_evidence: "PASS"
    preflight_delegation_order_gate: "PASS"
    preflight_ecap_admin_boundary_gate: "PASS"
    preflight_merge_gate_required_checks_alignment: "PASS"
    producer_next_action_guidance: "PASS"
  active_bundle_iaa_coherence: "VERIFIED"
  checks_run: 32
  pass_count: 32
  fail_count: 0
  merge_gate_parity: "PASS"
  PHASE_B_BLOCKING_TOKEN: "IAA-session-1290-20260920-PASS"
```

- The issue-authorized governance hardening remains substantively anchored to reviewed head `54d06636c4a3968cbea0588866d0ab4e59ce40b2`; later commits do not reopen contract/controller behavior.
- PR-scoped-first pre-brief routing, non-terminal `READY_FOR_IAA` semantics, stable reviewed-head evidence binding, ECAP admin-only boundaries, and focused controller regressions are present in the reviewed governance/controller surfaces and their committed evidence chain.
- Under the bounded admin-only delta model, the immutable PREHANDOVER/ECAP artifacts remain valid as pre-verdict artifacts; they do not require a self-referential exact-current-HEAD refresh loop merely because the final handback commit changed `HEAD`.

---

## TOKEN AMENDMENT — 2026-09-21

The earlier token `IAA-session-1290-20260920-PASS` remains wave history only. It bound the earlier handback head `1bbcaf02b140a47dfc630c1dca1f47fa630ebc47` and does **not** bind the corrected current head `c8b4a7b87065dd3350e42e84251195c6c098675f`.

CURRENT_HEAD_SHA: CURRENT_HEAD
PHASE_B_BLOCKING_TOKEN: IAA-session-1291-20260921-PASS

```yaml
IAA_FINAL_ASSURANCE_REFRESH:
  date_utc: "2026-09-21T06:06:28Z"
  pr: "#2049 — Harden Foreman convergence and anti-loop controls"
  issue: "#2047 — Governance: harden Foreman convergence and anti-loop controls"
  category: "AGENT_CONTRACT"
  invoked_by: "foreman-v2-agent refreshed final assurance route"
  produced_by:
    - "governance-liaison-isms-agent"
    - "CodexAdvisor-agent"
    - "pit-specialist"
    - "qa-builder"
    - "execution-ceremony-admin-agent"
    - "foreman-v2-agent"
  ceremony_admin: true
  independence: "CONFIRMED"
  stable_reviewed_head_sha: "54d06636c4a3968cbea0588866d0ab4e59ce40b2"
  current_head_sha: "c8b4a7b87065dd3350e42e84251195c6c098675f"
  supersedes_historical_token: "IAA-session-1290-20260920-PASS"
  bounded_post_review_delta:
    non_admin_files:
      - ".github/scripts/pre-handover-checkpoint.js"
      - ".github/scripts/pre-handover-checkpoint.test.sh"
      - ".github/scripts/producer-next-action-guidance.js"
      - ".github/scripts/producer-next-action-guidance.test.sh"
    admin_refresh_files:
      - ".admin/prs/pr-2049.json"
      - ".agent-admin/control/handover-allowed.json"
      - ".agent-admin/prs/pr-2049/active-state.json"
      - ".agent-admin/prs/pr-2049/ecap-admin-bundle-20260920.md"
      - ".agent-admin/prs/pr-2049/wave-current-tasks.md"
      - ".agent-admin/scope-declarations/pr-2049.md"
    assessment: "The corrected current-head delta is bounded to suppress false pre-brief / IAA restart guidance after a recorded final PASS and to normalize PR-scoped admin posture until this refreshed final IAA was completed. The reviewed substantive governance surface remains anchored to stable reviewed head 54d06636c4a3968cbea0588866d0ab4e59ce40b2."
  local_validation:
    producer_next_action_guidance_test: "PASS (20 passed, 0 failed)"
    pre_handover_checkpoint_test: "PASS (51 passed, 0 failed)"
    git_diff_check: "PASS"
  fail_only_once:
    A-001_invocation_evidence: "PRESENT"
    A-002_no_class_exemption: "CONFIRMED"
  core_invariants:
    CORE-020: "PASS"
    CORE-021: "PASS"
    CORE-026: "PASS"
    CORE-027: "PASS"
  overlay_checks:
    OVL-AC-001: "PASS"
    OVL-AC-002: "PASS"
    OVL-AC-003: "PASS"
    OVL-AC-004: "PASS"
    OVL-AC-005: "PASS"
    OVL-AC-006: "PASS"
    OVL-AC-007: "PASS"
  admin_ceremony_auto_reject_checks:
    ACR-01_through_ACR-16: "PASS"
  merge_gate_parity:
    merge_gate_verdict: "PASS"
    governance_alignment: "PASS"
    stop_and_fix_enforcement: "PASS"
  active_bundle_iaa_coherence: "VERIFIED"
  checks_run: 32
  pass_count: 32
  fail_count: 0
  PHASE_B_BLOCKING_TOKEN: "IAA-session-1291-20260921-PASS"
```

### Acceptance-Criteria Evidence Matrix

1. **Concise change/ripple inventory** — PASS
   Evidence: `.agent-admin/governance/pr-2049-gov-2047-01-ripple-assessment.md`; `.agent-admin/governance/agent-contract-diffs/diff-20260919-gov-2047-02-03-foreman-iaa-hardening.md`; `.agent-admin/scope-declarations/pr-2049.md`.
2. **Focused tests for new behavioural rules and both PR-scoped and legacy-fallback IAA paths** — PASS
   Evidence: `bash .github/scripts/producer-next-action-guidance.test.sh` → `20 passed, 0 failed`; `bash .github/scripts/pre-handover-checkpoint.test.sh` → `51 passed, 0 failed`; targeted CS2-review suppression cases in `.github/scripts/producer-next-action-guidance.test.sh:284-317` and `.github/scripts/pre-handover-checkpoint.test.sh:1026-1075`.
3. **Contract/CANON/schema/workflow/current-head checks run honestly** — PASS
   Evidence: `git diff --check` → PASS; `governance/CANON_INVENTORY.json` hash integrity re-verified; corrected runtime logic in `.github/scripts/producer-next-action-guidance.js:45-52,67-75,116-129` and `.github/scripts/pre-handover-checkpoint.js:858-897,1133-1171`.
4. **Handback to Foreman for QP → ECAP → independent IAA** — PASS
   Evidence: `.agent-workspace/foreman-v2/memory/PREHANDOVER-pr-2049-governance-foreman-convergence-20260920.md`; `.agent-workspace/foreman-v2/memory/session-pr-2049-governance-foreman-convergence-20260920.md`; `.agent-admin/prs/pr-2049/ecap-admin-bundle-20260920.md`; this amended wave record.
5. **PASS demonstrates sandbox continuation and escalation only for genuine protected/external decisions** — PASS
   Evidence: final-PASS / `CS2_REVIEW` handling now suppresses false producer-side pre-brief/IAA restart instructions while preserving STOP-AND-FIX behavior for genuine pending/failing gates in `.github/scripts/producer-next-action-guidance.js:45-52,116-129` and `.github/scripts/pre-handover-checkpoint.js:890-897,1166-1171`.

### Independent Risk Challenge

1. **What could still fail after merge?**
   A future regression could reintroduce producer guidance that treats a recorded final PASS as pending pre-brief/IAA work.
2. **What evidence would prove it does not fail?**
   Current-head code paths must explicitly detect `CS2_REVIEW` / final-PASS posture and the regression suites must assert that no pre-brief or IAA-refresh instructions are emitted.
3. **Is that evidence present?**
   Yes — the current code and focused suites above prove the corrected posture for both guidance rendering and checkpoint evaluation.
4. **Is there any contradiction between issue intent, architecture requirements, and PR evidence?**
   No — the correction narrows runtime behavior to the issue-authorized anti-loop intent without reopening the reviewed contract/canon/controller scope.
5. **Would a reasonable production owner accept this as merge-ready?**
   Yes — for the corrected current head, because the only post-review delta is the bounded runtime/admin correction and the current-head regression evidence is GREEN.

═══════════════════════════════════════
ASSURANCE-TOKEN
PR: #2049 — Harden Foreman convergence and anti-loop controls
All 32 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-1291-20260921-PASS
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════
