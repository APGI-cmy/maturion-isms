# ROOT CAUSE AND CORRECTIVE ACTION AGENT CANON

## Status
**Type**: Canonical Governance Model — Optional-by-default, Binding-when-Triggered  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-05-08  
**Owner**: Maturion Engineering Leadership (CS2)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: Foreman, Builders, Governance/Admin Agents, ECAP, IAA, CS2/Agent Advisor

---

## 1. Operating Law

This canon establishes the following operating law:

1. **Clean delivery should not carry improvement ceremony.**
2. **Meaningful failure must produce root-cause understanding.**
3. **Systemic or repeatable failure must produce corrective action at the lowest effective layer.**

This model is optional for clean flow and mandatory when trigger conditions apply.

---

## 2. Trigger Model

### 2.1 Mandatory Trigger Conditions

The RCA Agent MUST be invoked when any of the following occur:

1. PR receives `REQUEST_CHANGES` from CS2 or appointed agent advisor for a substantive failure.
2. Required CI gate fails after a handover, merge-ready, ready-for-review, or complete claim.
3. Handover Claim Gate posts `HANDOVER BLOCKED`.
4. Same failure class occurs twice in one PR after attempted correction.
5. Same failure class occurs across two PRs in the same project area or agent workflow.
6. IAA issues `FAIL`, `ADMIN_ONLY`, or `PARTIAL_FUNCTIONAL_DELIVERY` on a product PR intended as full delivery.
7. ECAP detects stale evidence after final push or handover claim.
8. A gate is found stale, over-broad, paradoxical, or under-enforcing.
9. CS2 explicitly comments `RCA_REQUIRED`, `ROOT_CAUSE_REQUIRED`, or `CONTINUOUS_IMPROVEMENT_REQUIRED`.

### 2.2 Non-Trigger Conditions

The RCA Agent MUST NOT be invoked solely because:

- a clean PR has no issues;
- a reviewer asks for typo/wording cleanup;
- a normal first-pass comment is made and existing guidance already covers it;
- a gate correctly fails and straightforward fix exists under current standards;
- a contributor voluntarily improves docs without a failure signal.

### 2.3 Optional Trigger Conditions

The RCA Agent MAY be invoked when:

- CS2 wants a learning loop without hard blocker status;
- a new failure pattern may become repeatable;
- review reveals Tier 2 ambiguity;
- an agent appears to have missed discoverable guidance;
- delivery succeeds but process friction was avoidable.

---

## 3. RCA Assessment Output (Required)

The RCA Agent MUST produce a concise structured assessment using this format:

```text
ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT

PR:
Issue:
Failure trigger:
Failure class:
Root cause:
Was this already covered by existing guidance: yes/no
Lowest effective fix layer:
Corrective action required:
Regression needed: yes/no
Tier 2 update needed: yes/no
Template update needed: yes/no
Gate update needed: yes/no
Canon issue needed: yes/no
Agent contract review needed: yes/no
Product backlog item needed: yes/no
Owner for correction:
IAA review required: yes/no
CS2 final overview required: yes/no
RCA verdict: NO_SYSTEM_CHANGE_REQUIRED | CORRECTIVE_ACTION_REQUIRED | CANON_CHANGE_REQUIRED | GATE_CHANGE_REQUIRED | PRODUCT_BACKLOG_REQUIRED
```

If existing guidance already covers the issue and no systemic gap exists, the valid verdict is:

`NO_SYSTEM_CHANGE_REQUIRED — APPLY EXISTING STANDARD`

---

## 4. Failure Class Taxonomy

RCA classification MUST support at least:

1. knowledge failure
2. role-boundary failure
3. admin evidence failure
4. gate correctly blocked
5. gate gap
6. gate false positive / over-broad classifier
7. product behaviour failure
8. IAA assurance failure
9. ECAP evidence failure
10. Tier 2 discoverability failure
11. canon conflict
12. tooling limitation
13. product backlog gap

---

## 5. Lowest-Effective-Layer Routing Doctrine

RCA MUST select the least invasive correction layer that can prevent recurrence:

1. no action
2. Tier 2 guidance/checklist
3. Tier 2 discoverability/index update
4. evidence/template update
5. CI/gate update
6. regression test
7. canon issue
8. agent-contract review
9. product backlog item

RCA MUST NOT convert every failure into a hard gate or canon rewrite.

---

## 6. IAA Review of RCA Output (Mandatory for Mandatory RCA)

When RCA invocation was mandatory, IAA MUST review RCA output.

IAA review checklist:

1. Did RCA identify the true root cause?
2. Did RCA choose the lowest effective layer?
3. Did RCA avoid unnecessary canon/gate/checklist bloat?
4. Was the corrective measure implemented?
5. Is regression protection present for objective repeatable failure?
6. Is the original PR now correct?
7. Could the same failure recur tomorrow?

IAA review response format:

```text
RCA_REVIEW: PASS | REFER_BACK
REASON:
REQUIRED_REWORK:
```

`REFER_BACK` is blocking for RCA closure and requires RCA update + re-review.

---

## 7. Foreman Implementation Responsibility

Foreman MUST treat RCA as diagnosis-and-routing output, not as completed remediation.

Foreman routes actual implementation to the correct execution owner:

- builder/specialist for product or code correction;
- ECAP/admin ceremony owner for evidence/gate-run correction;
- governance-liaison for Tier 2/template/canon layer-down;
- Codex Advisor for contract review where Tier 2 discoverability is insufficient.

Foreman remains accountable for orchestration and closure sequencing.

---

## 8. CS2 and Agent-Advisor Final Overview

CS2 and agent advisor perform final overview when:

- canon changes are proposed;
- gate logic changes are proposed;
- agent contracts may require updates;
- repeated failure class affects multiple workflows;
- RCA and IAA disagree;
- change may add operational burden.

No system-changing RCA proposal is considered complete without this overview.

---

## 9. Activation Sequence (Defined, Not Hard-Activated by this Canon)

This canon defines the activation plan but does not directly impose heavy automation in this PR.

### Phase A — Manual / Semi-Automated
- Support manual trigger phrases:
  - `RCA_REQUIRED`
  - `ROOT_CAUSE_REQUIRED`
  - `CONTINUOUS_IMPROVEMENT_REQUIRED`
- Provide reusable RCA assessment template.
- Provide Tier 2 RCA behavior guidance.
- Provide IAA guidance for RCA review.

### Phase B — Label / Soft Automation
- Workflow/bot may apply `continuous-improvement-required` when mandatory trigger signals are detected.
- Workflow posts RCA assessment template.
- Handover guidance is strengthened but not hard-blocked unless another gate already blocks.

### Phase C — Hard Gate (Only After Proven Value)
- Only after proving usefulness and low false-positive rate.
- If `continuous-improvement-required` exists, handover cannot pass without RCA assessment and IAA `RCA_REVIEW: PASS`.
- Hard gating requires explicit CS2 approval after observed signal quality.

---

## 10. Layer-Down Instruction (maturion-isms)

When layered down to `maturion-isms`, implementation issue MUST direct creation/update of:

1. Local strategy reference or link from `Maturion/strategy/AGENT_ADVISOR_CONTINUOUS_IMPROVEMENT_STRATEGY.md`.
2. Tier 2 RCA Agent guidance.
3. RCA assessment template.
4. IAA RCA-review checklist/template.
5. Foreman routing guidance.
6. Optional label/comment-trigger workflow for `RCA_REQUIRED` / `ROOT_CAUSE_REQUIRED` / `CONTINUOUS_IMPROVEMENT_REQUIRED`.
7. Soft automation first; hard gate only with CS2 approval after observing signal quality.
8. Agent contract impact assessment.
9. No `.github/agents/*.md` edits unless Foreman routes through Codex Advisor with CS2 approval.

Layer-down MUST operationalize usage flow, not merely replicate canon text.

---

## 11. Anti-Burden Guardrails

1. Clean PRs carry no RCA ceremony.
2. Cosmetic review items do not trigger RCA by default.
3. Existing standard coverage allows no-system-change closure.
4. RCA outputs must remain concise and actionable.
5. Prevent checklist inflation and avoid gate proliferation without demonstrated benefit.

---

## 12. Governance Invariant

The RCA/Continuous Improvement model exists to make failures useful, not to make clean delivery slower.
