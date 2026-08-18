# Interim CS2 — Delivery and Intent Review Protocol

**Version**: 1.1.0
**Authority**: CS2-delegated review only
**Applies to**: Valid interim-CS2 reviews in `APGI-cmy/maturion-isms`

## 1. Boundary and Review State

This is an evidence-led advisory review. It does not build, alter product or governance artifacts, issue an IAA verdict, approve a waiver, or authorize merge/release. A review result is one of:

- `REVIEW_INCOMPLETE` — the valid trigger is missing required evidence.
- `REVIEW_FINDINGS_ROUTED` — one or more findings were routed.
- `REVIEW_CLEAR_FOR_FOREMAN_REENTRY` — no unresolved finding in this review; Foreman resumes the normal gate path.

`REVIEW_CLEAR_FOR_FOREMAN_REENTRY` is not `ASSURANCE-TOKEN`, `GOVERNANCE_QA_PASS`, merge approval, release approval, or proof that the application is active.

## 2. Bootstrap Gate Before Trigger Intake

Before inspecting a trigger, complete the mandatory matrix in `bootstrap-input-validation-spec.md`. It must cover every contract-required input: Tier 1, required Tier 2 files, continuity files, the selected five-session window, FAIL-ONLY-ONCE, personal learning, every expected artifact, canonical inventory integrity, the required-check manifest/parity set, and the exact current-head binding.

Each record must be `PASS`. `MISSING`, `STALE`, `CONTRADICTORY`, or `INVALID` is a hard stop. The reviewer records `PRE_REVIEW_HALT`, identifies the failed input and evidence, sends the halt to CS2, and does not begin alignment, classify delivery evidence, issue a normal review packet, or treat a partial bootstrap as equivalent.

## 3. Valid CS2 Trigger Input

Do not start substantive review until every required field is supplied and internally coherent:

| Field | Requirement |
|---|---|
| `cs2_authorization_reference` | Exact CS2 authorization and bounded purpose |
| `work_item_reference` | Issue, PR, wave, and module/application identity |
| `target_head_sha` | Immutable reviewed current-head commit SHA; must equal the bootstrap matrix `observed_head_sha` |
| `foreman_handover_reference` | Foreman handover/readiness artifact for the same work item |
| `artifact_manifest` | Path, commit/SHA, owner, and status for every chain stage in §4 |
| `scope_and_acceptance` | Intended user, outcome, acceptance criteria, exclusions, and bounded-pilot constraints where applicable |
| `required_checks_evidence` | Current-head result or evidence reference for every applicable required check |
| `tracker_reference` | Applicable `BUILD_PROGRESS_TRACKER.md` or named continuous-improvement equivalent |
| `iaa_state` | Literal IAA state and reference when IAA applies; no inferred assurance |

Missing authorization, a different current-head SHA, or a protected authority question produces `CS2_ESCALATION_PACKAGE`. Other missing required delivery evidence produces `STOP_AND_FIX` to Foreman. A failed bootstrap is not trigger intake and instead remains a `PRE_REVIEW_HALT` to CS2.

## 4. Mandatory Evidence Chain

Trace the same declared capability through every stage. Mark every row `PROVEN`, `MISSING`, `STALE`, `CONTRADICTORY`, or `NOT_APPLICABLE_WITH_RATIONALE`.

1. App description and stated purpose.
2. UX, FRS, and TRS.
3. Architecture.
4. Approved QA-to-Red evidence.
5. PBFAG.
6. Implementation plan.
7. Builder checklist and delegation/handover evidence.
8. Actual build/current-head evidence.

For each stage, record the artifact path, exact revision, mapped requirement or user journey, evidence, owner, and gap. A document that predates later requirement, architecture, implementation, or test changes is `STALE` until revalidated against `target_head_sha`.

## 5. Review Checklist

### 4.1 Intent and Fitness

- App purpose, users, outcomes, and acceptance criteria are traceable from description to current head.
- UX/FRS/TRS, architecture, implementation plan, and build evidence do not contradict each other.
- The delivered workflow is fit for purpose, not merely demonstrable as isolated code or rendered UI.
- Best practices and applicable international compatibility are considered: locale/language, date/time zone, currency/number formats, regional regulation, responsive accessibility, and cross-region assumptions.
- The specification itself is sufficient: it defines required workflows, integrations, operational behavior, error states, non-functional requirements, and acceptance evidence. A gap that makes the stated purpose unattainable is an app-breaking intent gap.

### 4.2 Approved Red QA and Build-to-Green

- QA-to-Red exists before construction and is approved for the reviewed requirement.
- The evidence identifies the Red QA commit/revision and shows that Build-to-Green is evaluated against that approved Red QA, not a builder-created substitute.
- Requirement-to-test mapping covers functional and non-functional obligations.
- Builder-first construction, absent Red QA, post-build test invention, or a green claim detached from approved Red QA is a finding.

### 4.3 Test Dodging and Debt

Inspect test source, test results, handover evidence, and current-head status for:

- skipped, todo, disabled, pending, or inert-scaffold tests;
- mock-only substitution where the requirement needs real integration, user workflow, or environment evidence;
- missing CWT and missing applicable functional, integration, accessibility, performance, security, or compliance checks;
- unaddressed failures, warnings, retries, flaky outcomes, coverage exclusions, or suppressed diagnostics;
- stale results, results for another branch/SHA, or results predating the reviewed current head.

The reviewer does not invent new tests or re-run builders' work. It identifies the evidence gap and routes it to Foreman/responsible role.

### 4.4 Current-Head and Deliverable Reality

- Current-head evidence is tied to `target_head_sha`, not only a prior PR, earlier handover, or local claim.
- Implementation-plan deliverables physically exist at their declared paths and map to architecture.
- Required user journeys, integrations, failure states, and operations are evidenced for the delivery class.
- A mock, UI shell, artifact list, green unit tests, or ceremony result cannot substitute for an actual user workflow when the stated purpose requires one.

## 6. Exact Decision Routing

| Condition | Required packet and recipient | Interim-CS2 boundary |
|---|---|---|
| Normal gate, evidence, test-debt, implementation, or current-head issue inside ordinary scope | `STOP_AND_FIX` to Foreman, naming responsible role | Do not correct or take over building |
| Protected governance or agent-authority issue; failed correction cycle; app-breaking intent gap; reserved human decision | `CS2_ESCALATION_PACKAGE` to human CS2 | Do not decide, waive, or modify protected material |
| Non-breaking improvement that does not invalidate delivery | `PARK_AND_CONTINUE` in applicable per-agent parking or continuous-improvement tracker | Do not widen current work |
| No unresolved review finding after alignment or correction | `FOREMAN_REENTRY_PACKET` to Foreman | Never direct merge; Foreman resumes normal gate/IAA/CS2 process |

A substantive deficiency requires the `STOP_AND_FIX` or `CS2_ESCALATION_PACKAGE` to state that Foreman must ensure the applicable `BUILD_PROGRESS_TRACKER.md` or continuous-improvement equivalent is updated before re-entry. A parking item cannot replace a substantive correction.

## 7. Packet Schemas

Every packet contains: `packet_type`, `work_item_reference`, `target_head_sha`, `cs2_authorization_reference`, `reviewed_chain`, `finding_id`, `classification`, `evidence_paths`, `owner`, `required_action`, `tracker_path`, `reentry_condition`, and `iaa_state`.

### PRE_REVIEW_HALT

Use only when the bootstrap matrix has a non-`PASS` required input. Include `failed_input_id`, `status`, `expected_value`, `observed_value`, `evidence_path`, `target_head_sha` if available, and the exact reason that no trigger alignment or delivery review occurred. Recipient: human CS2. This is a halt record, not an assurance, waiver, or delivery decision.

### STOP_AND_FIX

Use for ordinary delivery/gate defects. Include the failing chain stage, exact evidence gap, responsible role, required approved-Red-QA relationship, applicable check class, tracker update obligation, and evidence needed for Foreman re-entry.

### CS2_ESCALATION_PACKAGE

Use only for a protected authority/governance issue, failed correction cycle, app-breaking intent gap, or reserved human decision. Include the decision requested from CS2, viable options, affected purpose/requirement, evidence, risk of each option, and the fact that no merge/release decision was made by interim CS2.

### PARK_AND_CONTINUE

Use only where the improvement is non-breaking. Include the improvement, rationale, evidence, parking or continuous-improvement path, owner, and explicit statement that current delivery remains unaffected.

### FOREMAN_REENTRY_PACKET

Use only when this review has no unresolved finding. Include reviewed target SHA, complete chain matrix, current IAA state, required checks reviewed, tracker state, and this exact re-entry rule: `Foreman resumes normal QP, assurance, and CS2 review controls; this packet is not a merge authorization.`

## 8. Quality and Records

After compiling a packet, run a binary QP:

- `PASS` — trigger complete, every chain stage classified, every finding has evidence/owner/route, no boundary breach, and status language is literal.
- `FAIL` — correct the packet; do not issue a final route until rerun passes.

Record the final packet, evidence matrix, unresolved items, tracker obligation, and non-blank improvement note in the session memory. Record non-breaking improvements only in `.agent-workspace/interim-cs2-agent/parking-station/suggestions-log.md`.
