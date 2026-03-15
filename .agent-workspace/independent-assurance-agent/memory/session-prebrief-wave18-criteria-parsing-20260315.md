# IAA Session Memory — session-prebrief-wave18-criteria-parsing-20260315

```yaml
session_id: session-prebrief-wave18-criteria-parsing-20260315
date: 2026-03-15
session_type: PRE_BRIEF
wave: wave18-criteria-parsing-repair
branch: copilot/repair-mat-criteria-parsing-pipeline
issue: maturion-isms#1114
invoking_agent: foreman-v2-agent (via comment request)
producing_agent: N/A (pre-brief only — no build deliverables reviewed this session)
producing_agent_class: N/A
pr_category: PRE_BRIEF (Phase 0 only — no Phase 2-4 this session)
checks_executed: 0 (Pre-Brief mode — Phase 2-4 checks deferred to handover)
checks_passed: 0
checks_failed: 0
merge_gate_parity_result: N/A (Pre-Brief session)
verdict: PRE_BRIEF_ISSUED (not ASSURANCE-TOKEN or REJECTION-PACKAGE — this is Phase 0 only)
token_reference: IAA-PREBRIEF-wave18-criteria-parsing-repair-20260315
token_file: N/A (token file written at Phase 4 handover, not Pre-Brief)
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave16-full-batch-20260310
  - session-wave16-orchestration-20260309-R2
  - session-wave16-orchestration-20260309
  - session-wave15r-gov-20260308-R2
  - session-wave15r-impl-R2-20260308
fail_only_once_rules_applied:
  - rule: A-001
    outcome: ATTESTED — will enforce at handover (IAA invocation evidence)
  - rule: A-002
    outcome: ATTESTED — no class exceptions (not applicable this session — no agent contracts)
  - rule: A-021
    outcome: PRE-DECLARED for handover — all artifacts must be committed before IAA invocation
  - rule: A-026
    outcome: PRE-DECLARED for handover — SCOPE_DECLARATION must match PR diff exactly
  - rule: A-029
    outcome: PRE-DECLARED for handover — PREHANDOVER is READ-ONLY post-commit
  - rule: A-032
    outcome: PRE-DECLARED as CRITICAL for handover — 4 tables (criteria, criteria_level_descriptors,
             mps_level_descriptors, domain_level_descriptors) require DDL read at handover
prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave18-criteria-parsing-repair.md
trigger_categories_declared:
  primary: AAWP_MAT (BUILD_DELIVERABLE overlay — all 6 builder tasks)
  secondary:
    - A-032 SCHEMA COLUMN COMPLIANCE (criteria migration + 3 descriptor tables)
    - BD-015 RLS POLICIES (upload bucket + new columns + descriptor tables)
    - PRE_BRIEF_ASSURANCE OVL-INJ-001 (this artifact committed before builder tasks)
    - OVL-AM-CST-01 CST CHECKPOINT (warranted after T-W18-008 + T-W18-009 complete)
    - OVL-AM-CWT-01 CWT MANDATORY (before IBWR closure)
blockers_identified:
  - B-01: Build work blocked until this Pre-Brief artifact is committed (RESOLVED by this commit)
  - B-02: Foreman must complete Phase 1 governance overlays before delegating builder tasks
advisories_issued:
  - A-01: CORE-023 Workflow Integrity — conditional activation if api-builder touches workflow-adjacent paths
  - A-02: mat-specialist assist boundary — advisory only, no code artifacts
  - A-03: CST commissioning responsibility — Foreman schedules after T-W18-008 + T-W18-009
  - A-04: source_anchor Gap 8 not cosmetic — required for LDCS audit traceability; cannot be split from Gap 3 migration
fail_only_once_updates: none — no new patterns identified this session
```

## Learning Notes

1. **Wave 18 has highest A-032 exposure of any wave reviewed** — 4 tables with column-level
   accuracy risk: `criteria` (2 new columns), `criteria_level_descriptors`, `mps_level_descriptors`,
   `domain_level_descriptors` (all existing but column name accuracy unverified for write-back).
   At handover, IAA must read DDL files for all 4 tables before reviewing Edge Function code.

2. **Upload failure (Gap 1) is both a storage config issue AND an RLS issue** — BD-015 and
   the upload fix are tightly coupled. schema-builder RLS policy fix and api-builder storage
   config fix must be reviewed as a unit, not independently. IAA will trace the complete
   upload path at handover.

3. **AI system prompt changes are architecture-adjacent** — mat-specialist expertise is needed
   to determine if the 5-level maturity descriptor extraction is correctly structured for the
   LDCS domain. IAA should prompt Foreman to include mat-specialist verification sign-off
   in the PREHANDOVER proof for T-W18-007 correctness.

4. **CST is clearly warranted** — this wave spans 4 distinct architectural layers
   (Storage → AI Gateway → Edge Function → UI). Integration risk is high. Foreman should
   not attempt to skip CST without strong rationale.

## Suggestions for Improvement

**Continuous improvement note**: Wave 18 scope involves a well-characterized bug-fix pipeline
(known gaps, known layers, known builders). Future Pre-Briefs for repair waves of this type
should consider declaring a "Repair Wave Fast-Track" protocol — where the 8 gaps are numbered
and each gap's Gap-Closure Attestation directly maps to a BD check (e.g., Gap 1 → BD-015 + BD-005,
Gap 3 → A-032 + BD-006). This would make self-checking by Foreman more efficient and reduce
handover REJECTION-PACKAGE risk. Recommend adding to PREHANDOVER template for repair waves.

---

**Authority**: CS2 (@APGI-cmy)
**independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING**
