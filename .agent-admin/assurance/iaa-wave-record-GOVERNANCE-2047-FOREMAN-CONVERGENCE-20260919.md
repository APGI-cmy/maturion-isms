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
      summary: "governance-liaison-isms-agent applies corresponding consumer controls in Foreman Tier 2 knowledge (foreman-tier2-operating-protocol.md, FAIL-ONLY-ONCE.md), FOREMAN_OPERATING_MODEL.md, IAA protocol/schema/workflow material (governance/canon/IAA_PRE_BRIEF_PROTOCOL.md and .agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md), and the directly applicable ECAP boundary protocol."
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
2. **Genuine open item (non-blocking for this Pre-Brief, but Foreman must resolve before handover):** the PR-scoped tracker does not currently carry a `ceremony_admin_appointed:` field (unlike the legacy-template shape). This Pre-Brief provisionally sets `ecap_required: true` given the wave's multi-builder, multi-artifact Phase 4 handover profile; Foreman must explicitly record the ceremony-admin appointment decision (yes/no) in the PR-scoped tracker so the final IAA invocation can verify it against ACR-01/ACR-09.
3. **Dual-protocol-file coherence is a named high-risk failure mode** (see above) because two separate documents govern IAA pre-brief mechanics: the CS2-amendment-gated `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` (v1.3.0) and the newer `.agent-admin/control/protocols/IAA_PREFLIGHT_BRIEF_PROTOCOL.md` ("Wave 1 canonical protocol", schema-bound). GOV-2047-03's scope explicitly includes both; Foreman/governance-liaison must reconcile them without contradiction and without exceeding the bounded ripple.
4. **Sequencing dependency:** GOV-2047-01 (ripple/layer-down assessment) is a prerequisite gate for GOV-2047-02/03 per the issue's own instruction ("Implement only where the canonical ripple assessment authorises the change"). This Pre-Brief does not authorize the Foreman to delegate GOV-2047-02/03 builders ahead of a committed GOV-2047-01 output.
5. **No product/consumer change, final token, or verdict has been issued in this invocation.** This is a PRE-BRIEF-only response under Phase 0. No Phase 1–4 assurance work, no ASSURANCE-TOKEN, no REJECTION-PACKAGE, and no ECAP invocation has occurred.

**Status**: `PRE-BRIEF ONLY — NO FINAL IAA TOKEN OR REJECTION ISSUED IN THIS INVOCATION`
