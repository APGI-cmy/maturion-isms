# IAA Session Memory — session-prebrief-wave18-postmerge-hotfix-20260315

```yaml
session_id: session-prebrief-wave18-postmerge-hotfix-20260315
date: 2026-03-15
session_type: PRE_BRIEF
wave: wave18-postmerge-hotfix
branch: copilot/fix-wave-18-post-merge-hotfixes
issue: maturion-isms#1116
invoking_agent: foreman-v2-agent (via comment request [IAA PRE-BRIEF REQUEST])
producing_agent: N/A (pre-brief only — no build deliverables reviewed this session)
producing_agent_class: N/A
pr_category: PRE_BRIEF (Phase 0 only — Phases 2-4 deferred to handover)
checks_executed: 0 (Pre-Brief mode)
checks_passed: 0
checks_failed: 0
merge_gate_parity_result: N/A (Pre-Brief session — parity deferred to Phase 4)
verdict: PRE_BRIEF_ISSUED (not ASSURANCE-TOKEN or REJECTION-PACKAGE — Phase 0 only)
token_reference: IAA-PREBRIEF-RESPONSE-wave18-postmerge-hotfix-20260315
token_file: N/A (token written at Phase 4 handover only)
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-prebrief-wave18-criteria-parsing-20260315 (PRE_BRIEF_ISSUED — Wave 18 Main pre-brief)
  - session-wave16-full-batch-20260310 (ASSURANCE-TOKEN PASS — Wave 16 Full Batch)
  - session-wave16-orchestration-20260309-R2 (ASSURANCE-TOKEN PASS — Wave 16 Orchestration R2)
  - session-wave16-orchestration-20260309 (REJECTION-PACKAGE — Wave 16 Orchestration initial)
  - session-wave15r-impl-R2-20260308 (ASSURANCE-TOKEN PASS — Wave 15R Impl R2)

trigger_categories_declared:
  primary: AAWP_MAT (T-W18P-001 through T-W18P-004 — build deliverables)
  secondary:
    - CANON_GOVERNANCE (T-W18P-006 — governance artifact updates)
    - PRE_BRIEF_ASSURANCE (T-W18P-007 — OVL-INJ-001 artifact existence confirmed by this artifact)

special_compliance_rules_active:
  - A-032 (Schema Column Compliance — T-W18P-001 migration SQL)
  - BD-015 (RLS Self-Check — T-W18P-001 RLS fix is primary)
  - S-034 (Foreman FAIL-ONLY-ONCE — END-TO-END-CONTENT-ASSERTION — INC-W18-CRITERIA-PIPELINE-001)
  - OVL-AM-CWT-01 (CWT mandatory — Wave 18 Main CWT status must be declared at handover)
  - A-021 (Commit before invocation — pre-declared for Phase 4)
  - A-026 (SCOPE_DECLARATION match — pre-declared for Phase 4)
  - A-029 (PREHANDOVER immutability — pre-declared)
  - A-031 (IAA carve-out — pre-declared if applicable)

fail_only_once_rules_applied:
  - rule: A-001
    outcome: ATTESTED — will enforce at Phase 4 (IAA invocation evidence = this pre-brief artifact)
  - rule: A-002
    outcome: ATTESTED — no agent contracts modified in this wave (confirmed from wave-current-tasks.md)
  - rule: A-021
    outcome: PRE-DECLARED — builders must commit before Phase 4 invocation
  - rule: A-026
    outcome: PRE-DECLARED — SCOPE_DECLARATION must match PR diff before Phase 4
  - rule: A-029
    outcome: PRE-DECLARED — PREHANDOVER is READ-ONLY post-commit; token pre-populated with PENDING
  - rule: A-031
    outcome: PRE-DECLARED — carve-out note required if IAA ceremony artifacts excluded from scope
  - rule: A-032
    outcome: PRE-DECLARED as CRITICAL — T-W18P-001 migration DDL must be read directly at Phase 4

blockers_identified:
  - SB-001: INC-W18-CRITERIA-PIPELINE-001 registry location clarified (Foreman FAIL-ONLY-ONCE, not IAA)
  - SB-002: Wave 18 Main CWT status unconfirmed — PREHANDOVER must declare CWT PASS or delta-CWT
  - SB-003: A-032 scope — T-W18P-001 migration DDL must be verified by IAA at Phase 4
  - SB-005: SCOPE_DECLARATION not yet updated — must match PR diff before Phase 4 invocation

governance_clarifications_issued:
  - INC-W18-CRITERIA-PIPELINE-001 is in Foreman FAIL-ONLY-ONCE (S-034), NOT in IAA FAIL-ONLY-ONCE
  - This is architecturally correct — each agent maintains their own failure registry
  - IAA Phase 4 obligation: verify PREHANDOVER attests S-034 addressed in test suite

wave18_main_status:
  pr_number: 1115
  token_file: .agent-admin/assurance/iaa-token-session-wave18-criteria-parsing-repair-20260315.md
  verdict: ASSURANCE-TOKEN PASS
  cwt_status: UNCONFIRMED (not reviewed in this pre-brief session; must be declared at Phase 4 handover)

prebrief_artifacts:
  foreman_prebrief: .agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md
  iaa_response: .agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-IAA-response-20260315.md

fail_only_once_updates: none — no new patterns identified this session

learning_notes:
  - Foreman pre-brief referenced incident in "FAIL-ONLY-ONCE.md" without specifying whose registry — future pre-briefs should explicitly state "foreman FAIL-ONLY-ONCE" vs "IAA FAIL-ONLY-ONCE" to avoid ambiguity
  - CWT status for completed waves should be explicitly confirmed in post-merge pre-briefs, not left for Phase 4 to discover
  - Post-merge hotfix waves are higher governance risk than fresh waves because scope can creep incrementally; SCOPE_DECLARATION drift (A-026) risk is elevated
  - A-032 applies to any migration SQL regardless of whether it is a "hotfix" — no hotfix exemption from schema column compliance
```

## Suggestions for Improvement

**Suggestion 1 (Process)**: Foreman pre-brief artifacts should explicitly identify *whose* FAIL-ONLY-ONCE registry contains each referenced incident (e.g., "INC-X in Foreman FAIL-ONLY-ONCE" vs "in IAA FAIL-ONLY-ONCE"). This would eliminate the ambiguity IAA had to clarify this session.

**Suggestion 2 (CWT)**: Wave closure and post-merge pre-briefs should include an explicit CWT attestation field pre-populated with evidence from the completed wave's IBWR, so IAA does not have to flag it as unconfirmed. A standing CWT status block in the wave-current-tasks.md template would prevent this gap.

**Suggestion 3 (Pre-Brief template)**: The PREHANDOVER proof template should include an `inc_closure` section as a standing field for any open FAIL-ONLY-ONCE incidents carried into the wave, to ensure their closure is explicitly tracked.
