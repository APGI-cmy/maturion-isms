# Agent Governance Cleanup — Waved Implementation Plan

**Status:** Strategy / pre-build plan  
**Branch:** `strategy/agent-governance-cleanup-waves`  
**Target repository:** `APGI-cmy/maturion-isms`  
**Target merge model:** single integration branch, draft PR until all waves pass local/CI validation  
**CS2 authority:** Johan Ras / `@APGI-cmy`  

---

## 1. Objective

Clean up the Foreman / Builder / ECAP / IAA agent operating model without losing the core governance value of cross-checking agents.

The cleanup must preserve:

- Foreman as orchestrator and Quality Professor only.
- Builders as the only implementation producers.
- IAA as independent assurance with binary PASS / REJECTION outcome.
- ECAP as an administrative validator / compiler, not a readiness authority.
- Build philosophy: one-time build, 100% build, zero test debt, no test dodging, no stale handover, no retrospective compliance theater.
- CI gates aligned with the new intended process before final merge to `main`.

The cleanup must reduce:

- Admin artifact loops.
- Late injection after handover.
- Conflicting pre-brief artifact expectations.
- Retroactive delegation evidence.
- Long-form agent instructions that are hard for agents to execute reliably.

---

## 2. Implementation Strategy

Use a single long-lived cleanup branch and draft PR. Implement changes in ordered waves on that branch. Do not merge to `main` until the complete control system is internally consistent and tested.

Recommended branch:

```text
strategy/agent-governance-cleanup-waves
```

Recommended PR mode:

```text
Draft PR until all waves complete and validation proves the new process works as intended.
```

Expected interim state:

- Some existing gates may fail during the middle of the cleanup because the branch will intentionally change the governance model.
- This is acceptable only while the PR remains draft and isolated from `main`.
- Final merge must not rely on broken or contradictory gates. If CS2 override is used, it must be a deliberate transition override with documented rationale, not a substitute for validation.

---

## 3. Guardrails for This Cleanup

### 3.1 Main branch safety

No partial wave should be merged to `main`.

### 3.2 Governance alignment sequencing

Governance alignment may be handled as Stage 2 after the operational cleanup, provided the Stage 1 changes do not leave contradictory live controls in the final PR.

### 3.3 No weakening by accident

This cleanup is not a reduction of control. It is a reduction of ceremony and ambiguity.

Controls should become:

- Earlier.
- More machine-checkable.
- Less dependent on long narrative artifacts.
- More specific about who may do what and when.

### 3.4 Override policy

If final merge requires CS2 override because existing gates cannot validate a transition PR, the PR must contain:

- A clear transition note.
- The changed gate model.
- Evidence that new gates were tested.
- Explicit list of old gates expected to fail and why.
- Explicit list of new gates expected to pass and why.

---

## 4. Target Operating Model

Replace the current long ceremony model with a state-machine operating model.

```text
BOOTSTRAP
  -> PREFLIGHT_LOCKED
  -> IAA_PREBRIEF_READY
  -> BUILD_DELEGATED
  -> BUILDER_HANDOVER_RECEIVED
  -> FOREMAN_QP_PASS
  -> ECAP_ADMIN_VALIDATED
  -> PRE_HANDOVER_GATE_PASS
  -> IAA_FINAL_PASS
  -> CS2_REVIEW
```

Foreman may not use completion language unless the current state permits it.

Completion language includes:

- complete
- ready for review
- handover
- merge-ready
- released
- done

---

## 5. New Control Artifact Model

Introduce one small machine-readable control artifact:

```text
.agent-admin/control/handover-allowed.json
```

Purpose:

- Prevent late injection after failed handover.
- Give Foreman a concrete lane-keeping stop.
- Allow CI to check readiness before completion language is accepted.

Minimum schema:

```json
{
  "schema_version": "1.0.0",
  "wave_id": "",
  "pr_number": null,
  "current_head_sha": "",
  "state": "PRE_HANDOVER_GATE_PASS",
  "handover_allowed": false,
  "foreman_qp_pass": false,
  "builder_delegation_verified": false,
  "delegation_precedes_implementation": false,
  "iaa_prebrief_ready": false,
  "scope_current": false,
  "ecap_required": false,
  "ecap_admin_validated": false,
  "all_required_checks_green": false,
  "iaa_final_required": true,
  "blocking_findings": []
}
```

Rule:

```text
Foreman may not enter Phase 4 handover or use completion language unless handover_allowed is true and current_head_sha equals HEAD.
```

---

## 6. Wave Plan

### Wave 0 — Strategy and isolation

**Goal:** Create this plan and open a draft PR from the cleanup branch.

**Files:**

- `Maturion/strategy/agent-governance-cleanup-waved-implementation-plan.md`

**Exit criteria:**

- Strategy file committed.
- Draft PR open.
- PR clearly marked as isolated cleanup branch.

---

### Wave 1 — Harmonize IAA pre-brief contract

**Problem:** Foreman expects a rich IAA pre-brief, while IAA Phase 0 currently constrains pre-brief output to a smaller set. This mismatch creates loops and inconsistent expectations.

**Goal:** Define one canonical pre-brief schema and align Foreman + IAA to it.

**Likely files:**

- `.github/agents/foreman-v2-agent.md`
- `.github/agents/independent-assurance-agent.md`
- relevant Tier 2 IAA / Foreman knowledge files if present
- any workflow messages that still reference standalone `iaa-prebrief-*.md`

**Target schema:**

```yaml
IAA_PREFLIGHT_BRIEF:
  wave:
  qualifying_tasks:
  required_build_gates:
  expected_qa_scope:
  high_risk_failure_modes:
  required_builder_evidence:
  required_foreman_qp_checks:
  ecap_required: yes/no
  final_iaa_focus:
  result: PREFLIGHT_BRIEF_COMPLETE
```

**Exit criteria:**

- Foreman and IAA describe the same pre-brief output.
- Standalone pre-brief artifact creation remains prohibited unless deliberately reintroduced.
- CI failure guidance points to `iaa-wave-record-*.md` with `## PRE-BRIEF`, not legacy standalone prebrief files.

---

### Wave 2 — Introduce pre-handover lane gate

**Problem:** Existing injection workflows are useful but too late; they often fire after handover language has already been used.

**Goal:** Add a pre-handover gate that blocks completion language and handover claims unless a current `handover-allowed.json` says the work is ready.

**Likely files:**

- `.github/workflows/foreman-prehandover-lane-gate.yml`
- `.github/scripts/` helper script, if needed
- `.agent-admin/control/` schema documentation
- Foreman contract references to the new gate

**Gate checks:**

- `handover-allowed.json` exists when Foreman artifacts or implementation files are present.
- `current_head_sha` matches HEAD.
- `handover_allowed` is true before handover language is present.
- `foreman_qp_pass` is true.
- `builder_delegation_verified` is true if implementation files changed.
- `delegation_precedes_implementation` is true if implementation files changed.
- `iaa_prebrief_ready` is true.
- `scope_current` is true.
- `ecap_admin_validated` is true when ECAP is required.

**Exit criteria:**

- Gate catches stale/missing handover allowance before final handover.
- Gate is visible as a named required check candidate.
- Foreman contract points to the gate before Phase 4 handover.

---

### Wave 3 — Prove delegation timing, not just delegation existence

**Problem:** Current delegation evidence can prove that delegation was recorded, but not always that it happened before implementation.

**Goal:** Require ordered delegation evidence.

**New evidence fields:**

```yaml
delegation_order:
  prebrief_commit_sha:
  builder_appointment_timestamp:
  builder_agent:
  builder_task_ref:
  first_implementation_commit_sha:
  qp_review_timestamp:
```

**Likely files:**

- `.github/workflows/polc-boundary-gate.yml`
- Foreman session memory template
- Foreman contract Phase 3 delegation instructions
- Builder appointment / checklist templates if present

**Exit criteria:**

- CI checks that delegation evidence predates first implementation file change.
- Retroactive delegation artifacts fail or warn with an explicit STOP-AND-FIX instruction.

---

### Wave 4 — Demote ECAP from readiness producer to admin validator

**Problem:** ECAP currently risks becoming a second orchestrator by producing substantive handover narratives and session memory bundles.

**Goal:** ECAP validates and compiles administrative evidence. Foreman remains owner of operational readiness and QP judgment.

**Likely files:**

- ECAP agent contract file, if present
- `.github/agents/foreman-v2-agent.md`
- ECAP checklist and templates
- PREHANDOVER / session memory templates
- ECAP anti-pattern checklist

**New ECAP boundary:**

ECAP may:

- Check required admin fields.
- Validate scope declaration freshness.
- Validate PR admin JSON.
- Validate evidence paths resolve.
- Produce an admin validation summary.

ECAP may not:

- Decide build readiness.
- Rewrite Foreman QP judgment.
- Invoke IAA.
- Convert failed substantive work into an admin-complete handover.

**Exit criteria:**

- ECAP output is smaller and validation-focused.
- Foreman does not depend on ECAP to create the substantive delivery story.
- IAA reviews ECAP validation as admin evidence, not as readiness authority.

---

### Wave 5 — Simplify Foreman Tier 1 contract

**Problem:** The Foreman contract is too long and mixes identity, policy, operating procedure, evidence taxonomy, and ceremony.

**Goal:** Keep Tier 1 executable and move detail to Tier 2 / Tier 3.

**Target Tier 1 structure:**

```text
1. Identity
2. Non-negotiable prohibitions
3. Invocation order
4. State machine
5. Allowed outputs
6. Handover blockers
7. Tier 2 references
```

**Likely files:**

- `.github/agents/foreman-v2-agent.md`
- `.agent-workspace/foreman-v2/knowledge/index.md`
- relevant Tier 2 checklists

**Exit criteria:**

- Foreman contract becomes shorter and more executable.
- No control is removed without a Tier 2 / Tier 3 home.
- State machine is the primary operating model.

---

### Wave 6 — Align CI gate inventory and merge gate interface

**Problem:** The static merge gate list and live workflows can drift.

**Goal:** Align `merge_gate_interface.required_checks` with the actual workflow gates after cleanup.

**Likely files:**

- `.github/agents/foreman-v2-agent.md`
- `.github/workflows/*.yml`
- any merge-gate parity scripts/checklists

**Exit criteria:**

- New pre-handover lane gate is included in required checks.
- Old obsolete checks/messages are removed or mapped.
- Required checks are named consistently across contract and workflow job names.

---

### Wave 7 — Validation wave

**Goal:** Prove the new process before merging to `main`.

**Validation scenarios:**

1. Foreman-only governance/doc change with no implementation files.
2. Builder implementation change with valid pre-brief and ordered delegation.
3. Implementation change with missing builder delegation — must fail.
4. Implementation change with retroactive delegation — must fail or block.
5. Handover language without `handover-allowed.json` — must fail.
6. Stale `handover-allowed.json` where HEAD does not match — must fail.
7. ECAP admin validation missing while required — must fail.
8. IAA pre-brief missing — must fail.

**Exit criteria:**

- All intended pass scenarios pass.
- All intended fail scenarios fail with clear guidance.
- PR contains final transition note for CS2.

---

## 7. PR / Merge Strategy

### Draft PR lifecycle

1. Open draft PR from `strategy/agent-governance-cleanup-waves` to `main`.
2. Commit waves sequentially.
3. Keep PR as draft while gates are intentionally unstable.
4. After Wave 7 validation, mark ready for review only if the branch is internally consistent.

### Final merge decision

Final merge requires one of:

- All old and new gates pass, or
- CS2 explicitly approves a transition override because old gates cannot understand the new governance model.

A transition override should not be used until the new gates have proven the intended behavior.

---

## 8. Definition of Done

This cleanup is done only when:

- Foreman cannot accidentally proceed to handover before the pre-handover state permits it.
- IAA pre-brief schema is consistent across Foreman and IAA.
- ECAP is administrative only and cannot become a readiness authority.
- Delegation timing is provable.
- CI checks match the intended operating model.
- Admin artifacts are smaller and do not generate loops.
- Governance alignment work is either completed or explicitly filed as Stage 2 with no contradictory live controls left in Stage 1.

---

## 9. Stage 2 Governance Alignment

If Stage 1 changes affect canonical governance, Stage 2 should update the governance canon after the operational model is stable.

Stage 2 should align:

- canonical descriptions of Foreman / Builder / ECAP / IAA boundaries;
- artifact taxonomy;
- pre-brief protocol;
- handover protocol;
- merge gate parity policy;
- FAIL-ONLY-ONCE entries for retired failure patterns.

Stage 2 should not be used to patch operational contradictions left behind by Stage 1.
