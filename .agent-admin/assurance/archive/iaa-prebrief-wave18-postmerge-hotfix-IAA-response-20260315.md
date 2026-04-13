# IAA Pre-Brief Response — Wave 18 Post-Merge Hotfix

**Artifact ID**: IAA-PREBRIEF-RESPONSE-wave18-postmerge-hotfix-20260315
**Type**: IAA Phase 0 Pre-Brief Response (companion to Foreman pre-brief)
**Companion To**: `.agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md`
**Wave**: Wave 18 Post-Merge Hotfix — RLS, AI Pydantic, Prompt, Index, Artifacts, IAA
**Branch**: `copilot/fix-wave-18-post-merge-hotfixes`
**Triggering Issue**: maturion-isms#1116
**Date**: 2026-03-15
**Produced by**: independent-assurance-agent v6.2.0 (Phase 0 Pre-Brief)
**Session**: session-prebrief-wave18-postmerge-hotfix-20260315
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)

---

## PHASE 1 — IDENTITY & PREFLIGHT ATTESTATION

### Step 1.1 — Identity Declaration

> "I am **independent-assurance-agent**, class: **assurance**, version **6.2.0**.
> My role: Hard-gate merge blocker. Issues ASSURANCE-TOKEN or REJECTION-PACKAGE only.
> Class boundary: NOT a builder, foreman, or overseer. Outputs: verification verdicts and Pre-Brief artifact only.
> Independence requirement: Must never review work I produced or contributed to. If detected → HALT-001.
> STOP-AND-FIX mandate: ACTIVE — REJECTION-PACKAGE stops all work. No deferrals, no negotiations.
> No class exceptions: IAA mandatory for ALL agent contracts — Foreman, builder, overseer, specialist, every class.
> Ambiguity rule: Ambiguity about IAA requirement resolves to mandatory invocation — never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it."

### Step 1.2 — Tier 2 Knowledge

> "Tier 2 loaded. Knowledge version: **2.9.0** (as of 2026-03-11).
> Files available:
>   - index.md (v2.9.0) — PRESENT
>   - FAIL-ONLY-ONCE.md (v2.5.0, rules A-001 through A-032) — PRESENT
>   - iaa-core-invariants-checklist.md (v2.6.0, CORE-001 to CORE-022) — PRESENT
>   - iaa-trigger-table.md (v2.1.0, KNOWLEDGE_GOVERNANCE category added) — PRESENT
>   - iaa-category-overlays.md (v3.4.0, PRE_BRIEF_ASSURANCE, OVL-CI-005 carve-out) — PRESENT
>   - session-memory-template.md (v1.0.0) — PRESENT
>   - IAA_ZERO_SEVERITY_TOLERANCE.md (v1.0.0) — PRESENT
>   - IAA_AGENT_CONTRACT_AUDIT_STANDARD.md (v1.0.0) — PRESENT
> FAIL-ONLY-ONCE registry: PRESENT — A-001 through A-032 active.
> Adoption phase: PHASE_B_BLOCKING."

### Step 1.3 — Orientation Mandate

> "Orientation Mandate acknowledged. Proceeding as quality engineer, not file auditor."

### Step 1.4 — Tier 1 Governance

> "Tier 1 governance verified. CANON_INVENTORY hash check: PASS (191 canons, 0 bad hashes, 0 placeholders).
> IAA canon present: YES — `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.5.0
>   hash: 5ec59f5dc89b60ec0422a21b2aee8492ef5dde3ac2f9452241eeb67561721ea4 — VERIFIED
> AGCFPP-001 policy reference confirmed: YES
> These are the authoritative constraints for this invocation."

### Step 1.5 — Session Memory & Carry-Forward

> "Sessions reviewed:
>   1. session-prebrief-wave18-criteria-parsing-20260315 (PRE_BRIEF_ISSUED — Wave 18 Main)
>   2. session-wave16-full-batch-20260310 (ASSURANCE-TOKEN PASS — Wave 16 Full Batch)
>   3. session-wave16-orchestration-20260309-R2 (ASSURANCE-TOKEN PASS — Wave 16 Orchestration R2)
>   4. session-wave16-orchestration-20260309 (REJECTION-PACKAGE — Wave 16 Orchestration initial)
>   5. session-wave15r-impl-R2-20260308 (ASSURANCE-TOKEN PASS — Wave 15R Impl R2)
> Unresolved items carried forward: NONE — all prior REJECTION-PACKAGEs resolved and superseded.
> Open REJECTION-PACKAGEs from prior sessions: NONE.
> Learning notes from prior sessions:
>   - A-021 (commit before invocation) is a recurring operational gap — pre-brief explicitly calls this out for builders
>   - A-026 (SCOPE_DECLARATION drift) remains a risk in hotfix waves where scope changes incrementally
>   - A-032 (Schema Column Compliance) is mandatory for any migration SQL — Wave 18 hotfix T-W18P-001 introduces migration SQL; will apply at Phase 4
>   - OVL-AM-CWT-01 (CWT mandatory before IBWR): Wave 18 Main CWT status must be confirmed at handover"

### Step 1.6 — FAIL-ONLY-ONCE Registry

> "FAIL-ONLY-ONCE registry:
>   Rules loaded: 32 rules (A-001 through A-032), plus A-029b carry-forward mandate
>   A-001 (own invocation evidence): ATTESTED — will enforce at Phase 4 handover
>   A-002 (no class exceptions): ATTESTED — applies if any agent contract is modified in this wave
>   Status: CLEAR TO PROCEED"

**Governance clarification on INC-W18-CRITERIA-PIPELINE-001:**
The Foreman pre-brief references this incident as "OPEN in FAIL-ONLY-ONCE.md." IAA clarifies:
- INC-W18-CRITERIA-PIPELINE-001 is tracked in **Foreman's FAIL-ONLY-ONCE** (`.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`) as S-034 (END-TO-END-CONTENT-ASSERTION-MANDATORY), registered 2026-03-15.
- It is **NOT** in IAA's FAIL-ONLY-ONCE registry. This is architecturally correct — foreman tracks operational delivery failures; IAA tracks governance/ceremony failures.
- IAA's Phase 4 obligation: verify that the PREHANDOVER proof attests S-034 is addressed (i.e., QA tests assert actual extracted content values, not just schema existence). If missing → REJECTION-PACKAGE finding.

### Step 1.7 — Merge Gate Requirements

> "Merge gate checks loaded:
>   1. Merge Gate Interface / merge-gate/verdict
>   2. Merge Gate Interface / governance/alignment
>   3. Merge Gate Interface / stop-and-fix/enforcement
> Parity enforcement: BLOCKING. IAA will run these locally before issuing verdict at Phase 4."

### Step 1.8 — Readiness Declaration

> "PREFLIGHT COMPLETE. All steps executed. Evidence produced above.
> Adoption phase: PHASE_B_BLOCKING.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Status: PRE-BRIEF MODE — Phases 2–4 deferred to handover. Will NOT execute assurance checks now."

---

## PHASE 0 — PRE-BRIEF RESPONSE

### Step 0.1 — Pre-Brief Mode Confirmation

This session was triggered by a comment request containing `[IAA PRE-BRIEF REQUEST]` for Wave 18 Post-Merge Hotfix.
**PRE-BRIEF mode is ACTIVE. Phases 2–4 are deferred to handover. I will NOT execute assurance checks in this session.**

### Step 0.2 — Wave-Current-Tasks Review

Wave-current-tasks.md read from `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`.

**Wave**: Wave 18 Post-Merge Hotfix — RLS, AI Pydantic, Prompt, Index, Artifacts, IAA
**Branch**: `copilot/fix-wave-18-post-merge-hotfixes`
**Issue**: maturion-isms#1116

| Task ID | Description | Delegated To | Status |
|---------|-------------|--------------|--------|
| T-W18P-001 | Fix RLS: restore org-path-prefix isolation, address profiles row gaps | schema-builder | PENDING |
| T-W18P-002 | Verify/fix Pydantic serialization for AI fields | api-builder | PENDING |
| T-W18P-003 | Eliminate verbatim-only rule contradictions in AI system prompt | api-builder | PENDING |
| T-W18P-004 | Verify/correct descriptor index alignment in Edge Function | api-builder | PENDING |
| T-W18P-005 | IAA QA invocation — Wave 18 overall QA review + IAA token | independent-assurance-agent | PENDING |
| T-W18P-006 | Update governance artifacts (FRS/TRS, App Description, Implementation Plan, Progress Tracker) | mat-specialist | PENDING |
| T-W18P-007 | IAA Pre-Brief confirmed in .agent-admin/assurance/ | Foreman | COMPLETE ✅ |

### Step 0.3 — Qualifying Task Classification

Applying INDEPENDENT_ASSURANCE_AGENT_CANON.md §Trigger Table and iaa-trigger-table.md:

| Task ID | IAA Trigger Category | Qualifying? | Rationale |
|---------|---------------------|-------------|-----------|
| T-W18P-001 | **AAWP_MAT** | ✅ YES | Schema migration SQL + RLS policy changes — build deliverable with A-032 and BD-015 applicability |
| T-W18P-002 | **AAWP_MAT** | ✅ YES | Python AI service Pydantic model changes — build deliverable |
| T-W18P-003 | **AAWP_MAT** | ✅ YES | Python AI system prompt modification — build deliverable |
| T-W18P-004 | **AAWP_MAT** | ✅ YES | TypeScript Edge Function logic correction — build deliverable |
| T-W18P-005 | **AAWP_MAT + PRE_BRIEF_ASSURANCE** | ✅ YES | This IS the Phase 4 IAA assurance invocation for the wave |
| T-W18P-006 | **CANON_GOVERNANCE** | ✅ YES | FRS/TRS, Implementation Plan, Progress Tracker updates — governance artifacts |
| T-W18P-007 | **PRE_BRIEF_ASSURANCE** | ✅ YES (COMPLETE) | Pre-brief artifact existence confirmed |

**All 7 tasks are QUALIFYING.** No exempt tasks in this wave.

### Step 0.4 — IAA Pre-Brief Declarations

---

#### 4.1 — Trigger Categories Active for This Wave

| # | Trigger Category | Applied To | Notes |
|---|-----------------|------------|-------|
| 1 | **AAWP_MAT** (primary) | T-W18P-001 through T-W18P-004 | Build deliverable overlay applies in full |
| 2 | **CANON_GOVERNANCE** | T-W18P-006 | Governance artifact overlay applies |
| 3 | **PRE_BRIEF_ASSURANCE** (OVL-INJ-001) | T-W18P-007 | Pre-brief artifact existence = pass condition |

**Special compliance rules activating alongside trigger categories:**
- **A-032 Schema Column Compliance** — MANDATORY for T-W18P-001 (migration SQL). IAA will read DDL directly at Phase 4. Any INSERT/SELECT on `criteria`, `criteria_level_descriptors`, `mps_level_descriptors`, `domain_level_descriptors`, `profiles`, or `storage.objects` must have matching columns in migration DDL and Edge Function write-back.
- **BD-015 RLS Self-Check** — MANDATORY for T-W18P-001 (RLS is the primary fix). Org-scoped isolation must be verifiable from policy DDL.
- **S-034 END-TO-END-CONTENT-ASSERTION** — Foreman's FAIL-ONLY-ONCE S-034 (INC-W18-CRITERIA-PIPELINE-001). PREHANDOVER proof must attest QA tests assert actual extracted content, not just schema existence.
- **OVL-AM-CWT-01 CWT Assessment** — Wave 18 Main (PR #1115) CWT status must be declared in PREHANDOVER. If no CWT PASS evidence for Wave 18 Main exists, this hotfix wave must execute a delta-CWT covering the hotfixed modules before IBWR close.

---

#### 4.2 — FFA Checks IAA Will Run at Handover (Phase 4)

**Core Invariants (CORE-001 to CORE-022) — ALL will be executed. Key highlights:**

| Check | What IAA Will Verify |
|-------|---------------------|
| CORE-001 | PREHANDOVER proof: present, correct format, committed |
| CORE-002 | QP (Quality Pass) verdict from each builder: schema-builder (T-W18P-001), api-builder (T-W18P-002/003/004), mat-specialist (T-W18P-006) |
| CORE-003 | Zero test failures — all Wave 18 regression + new hotfix tests must be GREEN |
| CORE-004 | Zero skipped, todo, or stub tests in new/modified test files |
| CORE-005 | Zero linting warnings in modified TypeScript and Python files |
| CORE-006 | Zero deprecation warnings in Python or TypeScript |
| CORE-007 | No console.log or print debug statements left in production code |
| CORE-008 | Security: no hardcoded credentials or tokens in any committed file |
| CORE-009 | Dependency audit: no newly introduced dependency with known CVE |
| CORE-010 | API contract compliance: Pydantic model changes (T-W18P-002) must not break existing caller contracts |
| CORE-012 | POLC boundary: all code changes from builder agents only — no Foreman implementation |
| CORE-013 | IAA invocation evidence present (this pre-brief artifact = evidence) |
| CORE-014 | SCOPE_DECLARATION.md exactly matches `git diff --name-only origin/main...HEAD` (A-026) |
| CORE-015 | A-031 carve-out note present in SCOPE_DECLARATION if IAA ceremony artifacts are excluded |
| CORE-016 | IAA token file pre-populated with PENDING reference in PREHANDOVER (A-029) |
| CORE-017 | All prior-wave IAA tokens are PASS (not REJECTION-PACKAGE) before this wave closes |
| CORE-018 | Complete evidence artifact sweep — all declared evidence artifacts committed and readable |
| CORE-019 | PREHANDOVER proof is immutable post-commit (A-029) |
| CORE-020 | No agent contract files modified without CodexAdvisor + IAA audit (A-005/AGCFPP-001) |
| CORE-021 | Zero-severity-tolerance rule: no severity findings in security scan output |
| CORE-022 | `secret_env_var:` used (not `secret:`) in any modified agent contracts (A-024) |

**AAWP_MAT Category Overlay — additional checks:**

| Check | What IAA Will Verify |
|-------|---------------------|
| OVL-AM-001 | Architecture alignment: hotfixes conform to Wave 18 frozen architecture (no scope creep) |
| OVL-AM-002 | All builder QP verdicts present: schema-builder, api-builder, mat-specialist |
| OVL-AM-003 | Test coverage: each hotfixed path has at least one new or updated test |
| OVL-AM-004 | Edge Function (T-W18P-004) tested with a regression test against the fixed index alignment logic |
| OVL-AM-005 | RLS policy (T-W18P-001) has a test verifying org-scoped isolation (not just that policies exist) |
| **OVL-AM-CWT-01** | **CWT PASS evidence present, or delta-CWT commissioned for hotfixed modules** |
| **A-032** | **Migration DDL read directly. All columns in INSERT/SELECT exist in DDL and vice versa** |
| **BD-015** | **RLS policies verified per-table — org-path-prefix restriction present where required** |
| **S-034** | **QA tests assert actual extracted content values (non-null, correct field) — not just column existence** |

**CANON_GOVERNANCE Overlay — additional checks:**

| Check | What IAA Will Verify |
|-------|---------------------|
| OVL-CG-001 | FRS/TRS updates reflect Wave 18 post-merge state accurately |
| OVL-CG-002 | Progress Tracker updated: Wave 18 complete, Wave 18 Post-Merge Hotfix started/complete |
| OVL-CG-003 | Implementation Plan updated: all 7 T-W18P tasks shown as complete |
| OVL-CG-004 | No governance canon files modified without CS2 authority evidence |

**PRE_BRIEF_ASSURANCE Overlay:**

| Check | What IAA Will Verify |
|-------|---------------------|
| OVL-INJ-001 | Pre-brief artifact exists at committed path — CONFIRMED by this artifact |

---

#### 4.3 — Required PREHANDOVER Proof Structure

The PREHANDOVER proof for this wave MUST include all of the following. Absence of any item = REJECTION-PACKAGE finding:

```yaml
prehandover_proof:
  session_id: "session-wave18-postmerge-hotfix-YYYYMMDD"
  date: "2026-03-15"
  agent_version: "foreman-v2-agent v6.2.0"
  triggering_issue: "maturion-isms#1116"
  wave_description: "Wave 18 Post-Merge Hotfix — RLS, AI Pydantic, Prompt, Index, Artifacts, IAA"
  branch: "copilot/fix-wave-18-post-merge-hotfixes"
  pr_number: "TBD at time of handover"

  # Task completion attestations (all 7 required)
  task_attestations:
    T-W18P-001:
      status: COMPLETE
      builder: schema-builder
      qp_verdict: PASS
      evidence: "[migration file path(s)]"
      rls_check: "BD-015 PASS — org-path-prefix restriction confirmed"
      a032_check: "PASS — DDL columns verified against Edge Function write-back"
    T-W18P-002:
      status: COMPLETE
      builder: api-builder
      qp_verdict: PASS
      evidence: "[parsing.py or model file path(s)]"
      pydantic_fields: "CriterionResult, MpsResult, DomainResult — all AI-extractable fields included"
    T-W18P-003:
      status: COMPLETE
      builder: api-builder
      qp_verdict: PASS
      evidence: "[system prompt file path]"
      verbatim_consistency: "CONFIRMED — no contradictions"
    T-W18P-004:
      status: COMPLETE
      builder: api-builder
      qp_verdict: PASS
      evidence: "[index.ts or Edge Function path]"
      index_alignment: "CONFIRMED — descriptor index logic verified"
    T-W18P-005:
      status: COMPLETE_AT_IAA_INVOCATION
      note: "IAA invocation is this PREHANDOVER submission"
    T-W18P-006:
      status: COMPLETE
      builder: mat-specialist
      qp_verdict: PASS
      evidence: "[list of updated governance artifact paths]"
    T-W18P-007:
      status: COMPLETE
      evidence: ".agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md + IAA response"

  # Governance checks
  polc_boundary: "PASS — all code from builder agents; Foreman: orchestration only"
  scope_declaration_check: "A-026 PASS — SCOPE_DECLARATION.md matches git diff output [paste evidence]"
  a031_carve_out: "[PRESENT / NOT REQUIRED — note if IAA ceremony artifacts excluded]"
  
  # Test results
  test_results:
    all_wave18_regression: "GREEN"
    new_hotfix_tests: "GREEN"
    test_count: "[N passed / 0 failed / 0 skipped]"
    s034_content_assertion: "CONFIRMED — tests assert actual extracted field values"
  
  # CWT declaration (MANDATORY)
  cwt_declaration:
    wave18_main_cwt: "[PASS — evidence: {link} / NOT_EXECUTED — delta-CWT commissioned: {scope}]"
    hotfix_delta_cwt: "[PASS / NOT_REQUIRED — rationale]"
    note: "OVL-AM-CWT-01 requires CWT evidence before IBWR close"

  # Merge gate parity
  merge_gate_parity: "PASS — §4.3 confirmed"
  
  # IAA token reference (A-029 — pre-populate expected token, keep PENDING until IAA issues)
  iaa_audit_token: "IAA-session-prebrief-wave18-postmerge-hotfix-20260315-PENDING"
  iaa_token_note: "Per A-029: pre-populate with PENDING. IAA writes dedicated token file post-verdict."
  
  # INC-W18-CRITERIA-PIPELINE-001 closure
  inc_w18_closure:
    incident: "INC-W18-CRITERIA-PIPELINE-001 (S-034 in foreman FAIL-ONLY-ONCE)"
    status: "[REMEDIATED / PARTIALLY_REMEDIATED — explain remainder]"
    evidence: "[describe what was done in this wave to address the 8 critical gaps]"
  
  # CS2 authorization
  cs2_authorization: "maturion-isms#1116 — opened by CS2 (@APGI-cmy)"
```

---

### Step 0.5 — Scope Blockers and Governance Conflicts

| # | Item | Severity | Status |
|---|------|----------|--------|
| SB-001 | **INC-W18-CRITERIA-PIPELINE-001 incident registry location ambiguity** | LOW | ⚠️ CLARIFIED — incident is in Foreman's FAIL-ONLY-ONCE (S-034), NOT IAA's. Foreman pre-brief wording was ambiguous. IAA Phase 4 will verify S-034 addressed in PREHANDOVER. No blocker. |
| SB-002 | **Wave 18 Main CWT status** | MEDIUM | ⚠️ UNCONFIRMED — Wave 18 Main ASSURANCE-TOKEN PASS confirmed (PR #1115), but CWT PASS evidence was not reviewed in this pre-brief. Foreman MUST declare CWT PASS evidence (or commission delta-CWT) in PREHANDOVER proof. Absence = OVL-AM-CWT-01 REJECTION finding. |
| SB-003 | **A-032 Schema Column Compliance scope** | MEDIUM | ⚠️ REQUIRES ATTENTION — T-W18P-001 introduces migration SQL touching `profiles` table (at minimum) and potentially criteria/descriptor tables. IAA will read migration DDL directly at Phase 4. Builders must NOT silently expand column scope. |
| SB-004 | **No agent contract changes in this wave** | INFO | ✅ CONFIRMED — wave-current-tasks.md shows no `.github/agents/` modifications. CORE-020/AGCFPP-001 check will confirm at Phase 4. |
| SB-005 | **SCOPE_DECLARATION.md not yet updated** | INFO | ⚠️ EXPECTED — A-026 requires SCOPE_DECLARATION updated before IAA Phase 4 invocation. Branch currently has only pre-brief artifacts committed. Foreman must ensure SCOPE_DECLARATION is updated and matches PR diff exactly before invoking Phase 4. |
| SB-006 | **No governance conflicts visible** | INFO | ✅ CLEAR — Wave 18 architecture is frozen and hotfixes are corrections to existing implementation. No new architecture document required per Foreman pre-brief. IAA confirms this is consistent with the wave scope. |

### Step 0.6 — IAA Readiness Confirmation

> "IAA Pre-Brief response COMPLETE.
> Pre-Brief artifact path: `.agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-IAA-response-20260315.md`
> Companion Foreman pre-brief: `.agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md`
>
> Qualifying tasks found: ALL 7 (T-W18P-001 through T-W18P-007)
> Trigger categories declared: AAWP_MAT (primary), CANON_GOVERNANCE, PRE_BRIEF_ASSURANCE
> Special compliance rules: A-032 (Schema Column), BD-015 (RLS), S-034 (Content Assertion), OVL-AM-CWT-01 (CWT)
>
> IAA is READY to execute Phase 4 assurance at handover.
> Handover invocation condition: All 7 tasks COMPLETE, PREHANDOVER proof committed, SCOPE_DECLARATION updated.
> Phase 4 will be BLOCKING (PHASE_B_BLOCKING). One FAIL = REJECTION-PACKAGE. No deferrals.
>
> Pending items Foreman must resolve before Phase 4 invocation:
>   1. Execute and document CWT status (Wave 18 Main + delta-CWT if needed) — SB-002
>   2. Ensure SCOPE_DECLARATION.md matches full PR diff — SB-005
>   3. Populate PREHANDOVER proof per §4.3 structure above — complete all required fields
>   4. Confirm S-034 addressed in test suite — evidence of content assertion tests required"

---

## APPENDIX — Session Memory Reference

**Session**: session-prebrief-wave18-postmerge-hotfix-20260315
**Verdict type**: PRE_BRIEF_ISSUED (not ASSURANCE-TOKEN or REJECTION-PACKAGE — Phase 0 only)
**Phase 4 session file will be**: `.agent-workspace/independent-assurance-agent/memory/session-wave18-postmerge-hotfix-YYYYMMDD.md`
**Phase 4 token file will be**: `.agent-admin/assurance/iaa-token-session-wave18-postmerge-hotfix-YYYYMMDD-[PASS/REJECTION].md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Contract Version**: 2.2.0 | **Agent Version**: 6.2.0
**Pre-Brief Issued**: 2026-03-15
**Phase B Hard Gate**: ACTIVE
**STOP-AND-FIX Mandate**: ACTIVE — No class exceptions — Ambiguity resolves to mandatory invocation
