# IAA Pre-Brief — Wave: cep-v1.8.0-programme-clearance-20260403

**Document Type**: IAA Phase 0 Pre-Brief Artifact  
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)  
**Date**: 2026-04-03  
**Wave**: cep-v1.8.0-programme-clearance-20260403  
**Branch**: copilot/foreman-v2-agent-cep-v1-8-0-update  
**Triggering Issue**: Programme clearance — CEP v1.8.0, CP closures, CL-3.5 schema, MAT Wave 13 start (2026-04-03)  
**Produced By**: independent-assurance-agent (Phase 0 — PRE-BRIEF mode)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Adoption Phase at Pre-Brief**: PHASE_B_BLOCKING

---

## Phase 0 Execution Confirmation

> This pre-brief was generated in **PRE-BRIEF mode** (Phase 0 only).  
> IAA has NOT executed Phases 1–4 assurance in this session.  
> Full Phase 2–4 assurance will execute at handover when Foreman submits the completed PREHANDOVER proof.

---

## Step 0.2 — Wave Scope Read: Declared Tasks

| Task # | Task Summary |
|--------|-------------|
| T-1 | CEP Amendment v1.8.0 — record CP-1–CP-4 CLOSED, update §14 workstream table (CL-2/CL-3/CL-4 → COMPLETE), rescope CL-12c to MMM integration, add Amendment v1.8.0 header. Update AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md to reference CEP v1.8.0. |
| T-2 | CL-3.5 Schema Delegation — delegate 007_ai_data_sources.sql to schema-builder per CL3_5_DATA_MODEL_SPEC.md v1.0.0. Update LKIAC_DEPRECATION_REGISTER.md DEP-008 note. |
| T-3 | CP-2 closure artifact — create `.agent-admin/checkpoints/cp-2-closure-20260403.md` recording CL-2 deliverable acceptance, taxonomy decisions, org_page_chunks scope, CL-6 wave-start authorisation. |
| T-4 | MAT Wave 13 orchestration — wave-current-tasks update, RED gate delegation to qa-builder, mat-specialist + ui-builder commission. Architecture FROZEN. 24 RED gate tests: T-W13-SCH-1–4, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5, T-W13-CI-1–3. |
| T-5 | CL-6 wave-start issue template — produce a wave-start issue template for CL-6 for CS2 to post. |

---

## Step 0.3 — Trigger Classification

All five tasks are QUALIFYING per the IAA Trigger Table. No tasks are EXEMPT.

| Task # | Trigger Category | IAA Required? | Basis |
|--------|-----------------|---------------|-------|
| T-1 | CANON_GOVERNANCE | YES — MANDATORY | Modifies `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` (programme-level governance document) and `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md`. Both are governance directory files. |
| T-2 | CANON_GOVERNANCE | YES — MANDATORY | Modifies `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` (registered governance canon artifact). |
| T-3 | CANON_GOVERNANCE | YES — MANDATORY | Creates `.agent-admin/checkpoints/cp-2-closure-20260403.md` — a governance checkpoint artifact that constitutes a formal programme gate record. |
| T-4 | MIXED (CANON_GOVERNANCE + AAWP_MAT) | YES — MANDATORY | Updates `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (CANON_GOVERNANCE — wave orchestration directive). Commissions MAT deliverables from mat-specialist, ui-builder, qa-builder (AAWP_MAT trigger). AMBIGUITY RULE applies to any mixed classification — IAA is mandatory. |
| T-5 | CANON_GOVERNANCE | YES — MANDATORY | CL-6 wave-start template constitutes a formal wave initiation governance artifact. If committed to repo (per declared artifacts list), it is a governance file. |

**Overall Wave Category**: MIXED (CANON_GOVERNANCE primary; AAWP_MAT for T-4)  
**IAA Invocation**: MANDATORY for all tasks. No class exceptions. No EXEMPT tasks.

---

## Step 0.4 — Pre-Brief Artifact

### 4.1 — Task Detail: T-1 — CEP Amendment v1.8.0

| Field | Detail |
|-------|--------|
| `task_id` | T-1 |
| `task_summary` | Update AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md to Amendment v1.8.0: CP-1–CP-4 CLOSED (CS2 sign-off 2026-04-03), §14 workstream table (CL-2/CL-3/CL-4 → COMPLETE), CL-12c rescoped to MMM integration, Amendment v1.8.0 header. Update AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md CEP version reference. |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 (Alignment) + Phase 3 (Assurance) + Phase 4 (Verdict) |
| `required_evidence_artifacts` | PREHANDOVER proof (committed before IAA invocation); session memory from foreman-v2-agent; iaa_audit_token field in PREHANDOVER proof; FAIL-ONLY-ONCE attestation in session memory |
| `applicable_overlays` | Universal Ceremony Gate (CERT-001–004) + CANON_GOVERNANCE (OVL-CG-001–005, OVL-CG-ADM-001–002) |
| `specific_rules` | OVL-CG-001: CEP amendments must correctly implement the strategic intent of LKIAC-001 and the AIMC programme plan. OVL-CG-002: No contradictions with prior checkpoint records (CP-1 closure artifact, AIMC Strategy). OVL-CG-004: Ripple to AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md is declared — must be present in diff. OVL-CG-ADM-002: Version bump to v1.8.0 must be present in the document header. |

### 4.2 — Task Detail: T-2 — CL-3.5 Schema Delegation

| Field | Detail |
|-------|--------|
| `task_id` | T-2 |
| `task_summary` | Delegation note for 007_ai_data_sources.sql to schema-builder. Update LKIAC_DEPRECATION_REGISTER.md DEP-008 status note to reflect schema delegation state. |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; iaa_audit_token; FAIL-ONLY-ONCE attestation |
| `applicable_overlays` | Universal Ceremony Gate (CERT-001–004) + CANON_GOVERNANCE (OVL-CG-001–005, OVL-CG-ADM-001–002) |
| `specific_rules` | **⚠️ PRE-BRIEF NOTE — STATE ACCURACY REQUIRED**: Current state of `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` shows DEP-008 already at `PARALLEL-RUN` (recorded by governance-liaison-isms-agent in session-082, 2026-03-01). The request says "Update DEP-008 status to PARALLEL-RUN — SCHEMA DELIVERED" — this is a clarification note, not a status-change from a different state. Foreman/governance-liaison must ensure the update accurately describes the schema as already-delivered (from session-082) and does not re-declare a status that was already set. Any inaccurate historical re-declaration = REJECTION-PACKAGE. OVL-CG-ADM-002: version bump in DEPRECATION_REGISTER.md required if content changes. |

### 4.3 — Task Detail: T-3 — CP-2 Closure Artifact

| Field | Detail |
|-------|--------|
| `task_id` | T-3 |
| `task_summary` | Create `.agent-admin/checkpoints/cp-2-closure-20260403.md` — formal CP-2 gate closure record: CL-2 deliverable acceptance, extended taxonomy decisions, org_page_chunks scope, CL-6 wave-start authorisation. |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; iaa_audit_token; FAIL-ONLY-ONCE attestation; CP-2 closure artifact at the declared path |
| `applicable_overlays` | Universal Ceremony Gate (CERT-001–004) + CANON_GOVERNANCE (OVL-CG-001–005) |
| `specific_rules` | OVL-CG-001: CP-2 closure artifact must correctly record the CS2-approved CL-2 deliverables (CL-2-D1: legacy row count/schema; CL-2-D2: domain tag map; CL-2-D3: extended taxonomy). Artifact must reference the CS2 sign-off event (date: 2026-04-03, authority: @APGI-cmy). OVL-CG-002: Must not contradict the CL-2 status declared in the CEP (CL-2 was STARTED 2026-03-13 with deliverables CL-2-D1 and CL-2-D2+D3 present — the closure must reference these specifically). The extended taxonomy decisions (D3) and `org_page_chunks` scope decisions must be recorded with sufficient specificity that future waves (CL-5, CL-6) can act on them without ambiguity. |

### 4.4 — Task Detail: T-4 — MAT Wave 13 Orchestration

| Field | Detail |
|-------|--------|
| `task_id` | T-4 |
| `task_summary` | Update wave-current-tasks.md to Wave 13. Delegate RED gate (24 tests) to qa-builder. Commission mat-specialist + ui-builder. Architecture FROZEN. Tests: T-W13-SCH-1–4, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5, T-W13-CI-1–3. |
| `iaa_trigger_category` | MIXED (CANON_GOVERNANCE + AAWP_MAT) |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; iaa_audit_token; FAIL-ONLY-ONCE attestation; wave-current-tasks.md updated at declared path; RED gate delegation evidence (qa-builder issue or delegation record) |
| `applicable_overlays` | Universal Ceremony Gate (CERT-001–004) + CANON_GOVERNANCE (OVL-CG-001–005) + AAWP_MAT overlay (BD-001 completeness check for orchestration artifacts) |
| `specific_rules` | **⚠️ PRE-BRIEF SCOPE CONFLICT — REQUIRES FOREMAN CLARIFICATION BEFORE HANDOVER**: Historical evidence in `.agent-workspace/foreman-v2/memory/` and `.agent-admin/assurance/` shows that T-W13-* test IDs (T-W13-SCH, T-W13-AUTH, T-W13-E2E, T-W13-WIRE, T-W13-CI) and an IAA PASS token (`iaa-token-session-wave13-R3-20260313-PASS.md`) were produced for a "Wave 13" execution in early March 2026 (sessions 084–096, execution-start-20260313). The 24-test suite referenced in Task 4 uses matching test ID patterns. **Foreman must clarify in the PREHANDOVER proof whether**: (a) Task 4 is starting a genuinely new Wave 13 with new tests that do not conflict with prior test files, OR (b) Task 4 is re-commissioning the same Wave 13 scope that was previously executed (and if so, on what basis — was the prior execution superseded or rolled back?). IAA will REJECT if the PREHANDOVER proof does not address this clarification. |

### 4.5 — Task Detail: T-5 — CL-6 Wave-Start Issue Template

| Field | Detail |
|-------|--------|
| `task_id` | T-5 |
| `task_summary` | Produce a CL-6 wave-start issue template for CS2 to post. CL-6 is LKIAC Wave 3 — Knowledge Re-ingestion. Entry criteria: CL-2 closed + CL-4 closed. |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; iaa_audit_token; FAIL-ONLY-ONCE attestation; template artifact at declared path (or noted as PR comment) |
| `applicable_overlays` | Universal Ceremony Gate (CERT-001–004) + CANON_GOVERNANCE (OVL-CG-001–003) |
| `specific_rules` | OVL-CG-001: Template must correctly reflect CL-6 entry criteria as defined in CEP §4 Wave CL-6 (CL-2 closed + CL-4 closed — both now being recorded COMPLETE in T-1). Template must reference the correct deliverables (CL-6-D1 through CL-6-D4) and correct responsible agents (qa-builder for D1/D3, api-builder for D2/D4). OVL-CG-003: Template must be sufficiently specific that CS2 can post it directly as an actionable issue — it must declare architecture (FROZEN), RED gate first policy, and CL-6 scope without ambiguity. |

---

## Step 0.4 Continued — Required FFA Checks at Handover

The following FAIL-ONLY-ONCE rules will be applied as mandatory checks during Phase 3 of the full IAA invocation:

| Rule ID | Description | Applicable Tasks | Action if Violated |
|---------|-------------|-----------------|-------------------|
| A-001 | IAA invocation evidence present in PR artifacts | T-1 through T-5 | REJECTION-PACKAGE |
| A-002 | No class exceptions — foreman class is NOT exempt from IAA | T-1 through T-5 | REJECTION-PACKAGE |
| A-021 | Working tree clean before IAA invocation (no uncommitted artefacts) | T-1 through T-5 | REJECTION-PACKAGE |
| A-026 | SCOPE_DECLARATION.md present and matches git diff exactly | T-1 through T-5 | REJECTION-PACKAGE |
| A-029 | iaa_audit_token field in PREHANDOVER proof is a reference/placeholder (not pre-populated) | T-1 through T-5 | REJECTION-PACKAGE |
| A-033 | All artifact paths verified via `git ls-tree HEAD` — no untracked file claims | T-1 through T-5 | REJECTION-PACKAGE |
| A-034 | FUNCTIONAL-BEHAVIOUR-REGISTRY read and applied — no registered niggle patterns triggered | T-4 (AAWP_MAT) | REJECTION-PACKAGE |
| A-035 | Niggle pattern library read — no applicable patterns unaddressed | T-4 (AAWP_MAT) | REJECTION-PACKAGE |

---

## Step 0.4 Continued — Required PREHANDOVER Proof Structure

The Foreman must commit a PREHANDOVER proof file **before** calling IAA for Phase 2–4. The proof must contain all of the following fields. IAA will REJECT if any required field is absent:

```yaml
# PREHANDOVER PROOF — Wave: cep-v1.8.0-programme-clearance-20260403

document_type: PREHANDOVER_PROOF
wave: cep-v1.8.0-programme-clearance-20260403
branch: copilot/foreman-v2-agent-cep-v1-8-0-update
session_id: [session identifier]
date: 2026-04-03
produced_by: foreman-v2-agent
authority: CS2 (Johan Ras / @APGI-cmy)
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cep-v1.8.0-programme-clearance-20260403.md
iaa_prebrief_sha: [git SHA of this pre-brief commit]

# CS2 sign-off declarations (REQUIRED for T-1 and T-3)
cs2_signoffs:
  cp1_closed: "CS2 sign-off confirmed [date] — [evidence: issue/comment reference]"
  cp2_closed: "CS2 sign-off confirmed [date] — [evidence: issue/comment reference]"
  cp3_closed: "CS2 sign-off confirmed [date] — [evidence: issue/comment reference]"
  cp4_closed: "CS2 sign-off confirmed [date] — [evidence: issue/comment reference]"

# Wave 13 scope clarification (REQUIRED for T-4 — see Pre-Brief Scope Conflict)
wave13_scope_clarification: |
  [Foreman must explain: is this Wave 13 new or a restatement of the Wave 13 
   that produced iaa-token-session-wave13-R3-20260313-PASS? 
   What is the relationship to prior T-W13-* tests in .agent-workspace/foreman-v2/memory/?]

# DEP-008 state accuracy (REQUIRED for T-2)
dep008_current_state: "PARALLEL-RUN (set session-082, 2026-03-01)"
dep008_proposed_update: "[describe the precise text change being made — not a status change but a note addition]"

# Deliverables committed (REQUIRED — list each file and git SHA)
deliverables:
  - path: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
    sha: [git SHA]
    status: COMMITTED
  - path: governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md
    sha: [git SHA]
    status: COMMITTED
  - path: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md
    sha: [git SHA]
    status: COMMITTED
  - path: governance/aimc/LKIAC_DEPRECATION_REGISTER.md
    sha: [git SHA]
    status: COMMITTED
  - path: .agent-admin/checkpoints/cp-2-closure-20260403.md
    sha: [git SHA]
    status: COMMITTED
  - path: "[CL-6 template path or PR comment reference]"
    sha: "[git SHA or N/A — comment reference]"
    status: COMMITTED or POSTED

# Session memory (REQUIRED)
session_memory_path: [path to session memory file]
session_memory_sha: [git SHA]

# FAIL-ONLY-ONCE attestation (REQUIRED)
fail_only_once_attested: true
fail_only_once_registry_version: "[version read this session]"

# IAA audit token (DO NOT PRE-POPULATE — IAA fills this)
iaa_audit_token: "[IAA FILLS AT PHASE 4]"
```

---

## Step 0.5 — Scope Blockers and Governance Conflicts

The following items are visible NOW and must be resolved before or during the full Phase 2–4 IAA invocation. Items marked **[HARD BLOCKER]** will trigger a REJECTION-PACKAGE if unresolved at handover.

### SB-001 — Wave 13 Test ID Conflict [HARD BLOCKER]

**Conflict**: T-W13-* test IDs (T-W13-SCH-1–4, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5, T-W13-CI-1–3) appear in historical Wave 13 execution artifacts from early March 2026. Specifically:
- `iaa-token-session-wave13-R3-20260313-PASS.md` — IAA PASS token exists for a prior Wave 13
- Session memories 084–096 and PREHANDOVER files for Wave 13 steps (plan, step0, CST/CWT/FCWT, addendum B+C) confirm a prior Wave 13 was executed
- IAA rejection and fix sessions for T-W13-E2E-1, T-W13-E2E-4, T-W13-AUTH-APP-1–5 are present in `.agent-admin/assurance/`
- The parking station records "Wave 13 Execution Start: RED gate 24/24 confirmed" (2026-03-13)

**Required resolution**: Foreman must provide in the PREHANDOVER proof a clear declaration of whether Task 4 constitutes:
- (a) A genuinely NEW Wave 13 with distinct scope from the prior Wave 13 (in which case: what is the relationship between the test IDs? Are prior Wave 13 tests being superseded?), OR
- (b) A re-start of the same Wave 13 that was not cleanly closed (in which case: what happened to the prior IAA PASS token and the sessions 084–096 deliverables?), OR  
- (c) A continuation/extension of prior Wave 13 (in which case: what is the delta?)

Without this clarification, IAA cannot assess whether T-4 introduces test ID conflicts, orphaned test files, or governance contradictions with the prior IAA PASS.

### SB-002 — DCKIS-CL11 Wave Transition [ADVISORY — may become HARD BLOCKER]

**State**: `wave-current-tasks.md` currently declares `Active Wave: DCKIS-CL11` with all deliverables at `PENDING` status. The CEP (v1.7.0) shows CL-11 with outstanding items (D3: GAP-008 ARC approval audit; D4: GAP-009 episodic write path) and CP-11 awaiting CS2 approval.

**Concern**: Task 4 (T-4) updates wave-current-tasks.md to Wave 13, effectively superseding DCKIS-CL11 as the active wave. If CL-11 D3/D4 remain PENDING and CP-11 is not formally signed off, this transition may leave DCKIS-CL11 governance incomplete.

**Required resolution**: Foreman should declare in the PREHANDOVER proof the disposition of DCKIS-CL11 (still outstanding and tracked separately, or CS2 has de-scoped/deferred D3/D4). IAA will not hard-block on this but will require a clear explanation. If CL-12 dependency on CP-11 is unresolved, it must be noted.

### SB-003 — CP-1 Sign-Off Evidence [HARD BLOCKER if evidence absent]

**State**: CEP v1.7.0 records CP-1 as "PENDING CS2 SIGN-OFF" — `.agent-admin/checkpoints/cp-1-closure-20260313.md` was produced but awaiting CS2 comment. Task 1 asks to record CP-1 as CLOSED with CS2 sign-off 2026-04-03.

**Required resolution**: The PREHANDOVER proof must include a reference to the CS2 sign-off event (GitHub issue comment, PR approval, or explicit CS2 instruction) that authorises the CP-1 closure. IAA will verify this reference at Phase 3. If no evidence of CS2 sign-off is present → REJECTION-PACKAGE on T-1.

### SB-004 — CL-4 PENDING → COMPLETE Status Change [ADVISORY]

**State**: CEP v1.7.0 workstream table shows CL-4 (AIMC Audit Phase A) as "⏳ PENDING" — "awaiting wave-start issue from CS2". Task 1 asks to mark CL-4 COMPLETE. If CL-4 was genuinely pending (not started), recording it as COMPLETE in the CEP would be a false governance state.

**Required resolution**: If CL-4 deliverables (T-A-001 to T-C-010 audit suite) were actually executed and CS2 has signed off CP-4, Foreman must reference this in the PREHANDOVER proof with evidence of CL-4 completion (wave session IDs, test evidence paths). IAA will verify this before accepting the CEP status change. CS2 sign-off for CP-4 (2026-04-03) is cited in the wave scope — this is accepted as sufficient if the PREHANDOVER proof declares the CL-4 completion evidence path.

### SB-005 — DEP-008 Update Accuracy [ADVISORY]

**State**: DEP-008 is already `PARALLEL-RUN` in `LKIAC_DEPRECATION_REGISTER.md` (set session-082, 2026-03-01, with note: "CL-3.5 complete: ai_data_sources migration, 4 Edge Functions, admin UI panel, 244/244 GREEN"). The wave request says "Update DEP-008 status to PARALLEL-RUN — SCHEMA DELIVERED."

**Observation**: The schema was delivered in session-082. The text update "PARALLEL-RUN — SCHEMA DELIVERED" may be a clarification note to the existing PARALLEL-RUN status. This is acceptable if framed as adding specificity to an already-correct status, not as a new status change. The PREHANDOVER proof must explain the exact change being made to avoid IAA flagging it as a historically inaccurate re-declaration.

---

## Step 0.6 — Qualifying Tasks Summary

| Task | Qualifying? | Trigger Category | Required Phases | Scope Blockers |
|------|------------|-----------------|-----------------|----------------|
| T-1: CEP Amendment v1.8.0 | ✅ QUALIFYING | CANON_GOVERNANCE | Phase 2–4 | SB-003 (CP-1 evidence), SB-004 (CL-4 completion evidence) |
| T-2: CL-3.5 Schema Delegation | ✅ QUALIFYING | CANON_GOVERNANCE | Phase 2–4 | SB-005 (DEP-008 accuracy) |
| T-3: CP-2 Closure Artifact | ✅ QUALIFYING | CANON_GOVERNANCE | Phase 2–4 | None — artifact is new creation |
| T-4: MAT Wave 13 Orchestration | ✅ QUALIFYING | MIXED (CG + AAWP_MAT) | Phase 2–4 | **SB-001 HARD BLOCKER** (Wave 13 test ID conflict), SB-002 (CL-11 transition) |
| T-5: CL-6 Wave-Start Template | ✅ QUALIFYING | CANON_GOVERNANCE | Phase 2–4 | None — new artifact, dependent on T-1 completing CL-6 entry criteria |

**Total qualifying tasks**: 5 / 5  
**Hard blockers visible now**: 2 (SB-001, SB-003 if evidence absent)  
**Advisory items**: 3 (SB-002, SB-004, SB-005)

---

## Step 0.6 — Pre-Brief Completion Confirmation

Pre-Brief artifact path: `.agent-admin/assurance/iaa-prebrief-cep-v1.8.0-programme-clearance-20260403.md`  
Pre-Brief status: **COMPLETE — ready for Foreman to act on**

**Next steps for Foreman**:
1. Address SB-001 (Wave 13 scope clarification) — this is a HARD BLOCKER. Resolve before producing the PREHANDOVER proof.
2. Gather CS2 sign-off evidence for CP-1, CP-2, CP-3, CP-4 (SB-003 — required in PREHANDOVER proof).
3. Confirm or clarify CL-4 completion evidence (SB-004).
4. Confirm DCKIS-CL11 disposition (SB-002).
5. Produce all 7 declared governance artifacts and commit them.
6. Commit PREHANDOVER proof (using required structure above) to the branch.
7. Invoke IAA for Phase 2–4 full assurance by replying with IAA invocation comment.

**IAA will not issue verdict until Foreman completes the above and submits the PREHANDOVER proof.**

---

*Pre-Brief produced by independent-assurance-agent (Phase 0 — PRE-BRIEF mode only)*  
*Full Phase 2–4 assurance to execute at Foreman handover*  
*Authority: CS2 (Johan Ras / @APGI-cmy)*
