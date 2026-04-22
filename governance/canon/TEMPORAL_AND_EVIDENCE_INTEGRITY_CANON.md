# Temporal and Evidence Integrity Canon

**Version**: 1.0.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Type**: Canon — Tier 1 Governance Rule
**Effective Date**: 2026-04-22
**Layer-Down Status**: PUBLIC_API
**Applies To**: All agents, all PRs involving governance evidence, foreman review, admin ceremony, IAA audit

---

## 1. Purpose

This document establishes two mandatory integrity rules that apply to all governance evidence documents,
PREHANDOVER proofs, IAA wave records, and checklist completions across the Maturion ISMS ecosystem:

1. **Temporal integrity**: no future-dated factual claim may appear in a governance evidence artifact.
2. **Evidence-type discipline**: a checklist item requiring a specific class of evidence (e.g. live
   deployment, live E2E) must not be satisfied by a lower-fidelity evidence class (e.g. static code
   presence, merged-PR reference).

These rules were formalised following a review of PR APGI-cmy/maturion-isms#1444, which introduced a
CDV staging validation document containing: (a) a future-dated claim presented as settled historical
fact; and (b) overstated completion on deployment-oriented checklist items satisfied only by code-merge
evidence. The review gates (Foreman QP, admin ceremony, IAA final audit) did not flag these patterns.
This canon closes that gap.

---

## 2. Rule A — Temporal Integrity

### 2.1 Definition

A **future-dated factual claim** is any statement in a governance or evidence artifact that:

- presents an event as already completed when the event timestamp is later than the PR creation date
  or review date at which the statement is made;
- uses past-tense or present-perfect wording (e.g. "was deployed", "has been validated", "is live")
  where the date of the described event is in the future relative to the authoring agent's clock;
- embeds a future implementation date within an otherwise historical narrative (e.g. "validation
  completed — see report dated 2026-12-01" where today is 2026-04-22).

### 2.2 Prohibited Patterns

| Pattern | Prohibited Phrasing Example | Reason |
|---------|----------------------------|--------|
| Future event as settled fact | "Deployment completed on 2026-11-15" (authored 2026-04-22) | Event has not yet occurred |
| Anticipated completion presented as past | "Validation was completed per plan" where plan date is future | Misleads reviewers |
| Future date in evidence path | "Evidence at `/reports/cdv-2026-12-01.md`" where report does not yet exist | Non-existent evidence |
| Speculative wording in completion field | "Will be validated post-merge — status: COMPLETE" | Incompatible states |

### 2.3 Mandatory Rule

> **Rule T-001**: No governance or evidence artifact may present a future event as already completed.
> Any date appearing as the timestamp of a completed fact MUST be on or before the date the artifact
> was authored (current system date at time of writing).
>
> **Rule T-002**: Anticipated future events must be presented with forward-looking language (e.g.
> "will be validated", "pending deployment", "scheduled for") and the relevant checklist item MUST
> remain INCOMPLETE/PENDING until the real event occurs and live evidence exists.

---

## 3. Rule B — Evidence-Type Discipline

### 3.1 Evidence-Type Classification

All evidence cited in governance artifacts must be classified into one of the following types. No
evidence may be used to satisfy a checklist item that requires a higher-fidelity type.

| Type Code | Evidence Type | Description | Example |
|-----------|--------------|-------------|---------|
| `STATIC_CODE` | Static code evidence | Code present in repository; PR merged | Function exists in source file, migration present |
| `CI_TEST` | CI/test evidence | Automated test run — pass/fail result | CI green, test file assertions pass |
| `CONFIG` | Configuration/provisioning evidence | Environment config, secret provisioned, infra declared | `.env` variable set, Render service configured |
| `LIVE_RUNTIME` | Live deployment/runtime evidence | Service running in target environment; health check passes | Render deployment URL responding, health endpoint 200 |
| `LIVE_E2E` | Live end-to-end operational evidence | Real user flow executed in live environment | Postman collection run against staging, CDV scenario walkthrough completed |

### 3.2 Evidence Hierarchy

Evidence types form a hierarchy from lowest to highest fidelity:

```
STATIC_CODE < CI_TEST < CONFIG < LIVE_RUNTIME < LIVE_E2E
```

A checklist item requiring `LIVE_RUNTIME` or `LIVE_E2E` evidence cannot be satisfied by
`STATIC_CODE`, `CI_TEST`, or `CONFIG` evidence alone.

### 3.3 Mandatory Rule

> **Rule E-001**: Every checklist item in a governance evidence artifact that asserts operational,
> deployment, or runtime validation must be explicitly labelled with its required evidence type
> (`evidence_type: <type_code>`).
>
> **Rule E-002**: A checklist item classified as requiring `LIVE_RUNTIME` or `LIVE_E2E` evidence
> MUST NOT be marked COMPLETE using only `STATIC_CODE`, `CI_TEST`, or `CONFIG` evidence. A
> merged-PR reference and/or code-presence evidence does not satisfy a live-deployment item.
>
> **Rule E-003**: When an agent marks a deployment/CDV/operational-validation checklist item as
> COMPLETE, the evidence section for that item MUST include: (a) the evidence type code, and
> (b) a verifiable link or description of the live evidence (URL, log excerpt, screenshot
> reference, or equivalent artefact reference).

---

## 4. Tier Mapping — Gap Classification

The review miss in PR #1444 combined failures across multiple tiers. This section classifies
the gap so the same miss pattern is not treated ad hoc in future reviews.

### 4.1 Tier 1 (Contract / Canon) Gap

**Gap**: No canonical rule prohibited future-dated claims or evidence-type mismatch before this
document was created. The absence of an explicit rule allowed the patterns to pass review gates
without a named violation class.

**Resolution**: This document (TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md) is the Tier 1 fix.
Rules T-001, T-002, E-001, E-002, E-003 are now canonical.

### 4.2 Tier 2 (Agent Knowledge) Gap

**Gap**: Foreman QP evaluation and IAA final audit lacked explicit checklist items for:
- temporal validity of evidence (does the date make sense given the PR timeline?);
- evidence-type sufficiency for each checklist item (is this a live-deployment requirement
  being satisfied with only code-merge evidence?).

**Resolution**: FAIL-ONLY-ONCE rules A-040/A-041 (Foreman) and A-036/A-037 (IAA), plus
the new GOVERNANCE_EVIDENCE overlay in `iaa-category-overlays.md` and Section E of
`wave-reconciliation-checklist.md` are the Tier 2 fixes.

### 4.3 Tier 3 (Operational/Template) Gap

**Gap**: The PREHANDOVER template and ECAP bundle templates did not require evidence-type
labeling for checklist items. Agents had no structural prompt to distinguish static from
live evidence.

**Resolution**: The `evidence_type_mapping` field added to the ECAP PREHANDOVER YAML template
is the Tier 3 fix. This field is a HANDOVER BLOCKER for any wave that includes CDV, deployment,
or operational validation items.

---

## 5. Regression Examples

These examples are derived from PR APGI-cmy/maturion-isms#1444 and serve as concrete test cases
for reviewer training and future regression detection.

### Example R-001 — Future-Dated Claim (Failure Class A)

**Context**: CDV staging validation document in PR #1444.

**Defective statement** (paraphrased):
> "CDV validation completed on [future date] — all scenarios passed as documented in
> the validation report."

**Why it fails T-001**: The date cited for "CDV validation completed" was later than the PR
creation date. The validation event had not yet occurred at the time the artifact was authored.
The statement presented a future plan as settled historical fact.

**Correct form**:
> "CDV validation scheduled for [future date]. Current status: PENDING — validation not yet executed.
> Checklist item will be updated to COMPLETE only when live validation evidence is available."

**Detection rule**: Any reviewer seeing a completion-wording statement with a future date in a
governance evidence document should immediately flag Rule T-001 violation.

### Example R-002 — Static Code Evidence for Live Deployment Item (Failure Class B)

**Context**: CDV/deployment checklist in PR #1444.

**Defective state**: A deployment-validation checklist item marked COMPLETE with the evidence
being the merged PR reference (i.e., the code was merged, therefore deployment is validated).

**Why it fails E-002**: Code merged into main is `STATIC_CODE` evidence (the code exists in
the repository). A deployment-validation item requires at minimum `LIVE_RUNTIME` evidence
(the service is actually running and responsive in the target environment). Code being merged
does not prove the service is deployed, healthy, or running the merged code.

**Correct form**: The checklist item should have remained INCOMPLETE/PENDING until:
- The service was confirmed running in the target environment (`LIVE_RUNTIME` evidence), AND
- A CDV scenario walkthrough was executed against the live environment (`LIVE_E2E` evidence).

**Detection rule**: Any deployment/CDV/operational-validation checklist item citing only a PR
merge reference as evidence should be immediately flagged as Rule E-002 violation.

---

## 6. Enforcement Points

| Review Layer | Enforcement Mechanism |
|-------------|----------------------|
| Foreman QP evaluation | FAIL-ONLY-ONCE A-040 (temporal), A-041 (evidence-type) |
| Admin ceremony (ECAP) | `evidence_type_mapping` field required in PREHANDOVER YAML |
| IAA final audit | FAIL-ONLY-ONCE A-036 (temporal), A-037 (evidence-type); GOVERNANCE_EVIDENCE overlay OVL-GE-001/002/003 |
| Wave reconciliation | Section E of `wave-reconciliation-checklist.md` |
| CI (future) | These rules are currently agent-enforced; CI automation is a follow-up candidate |

---

## 7. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-04-22 | Initial creation — temporal integrity rules T-001/T-002 and evidence-type discipline rules E-001/E-002/E-003; tier mapping; regression examples from PR #1444; per governance hardening issue maturion-isms#1445 |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governed by**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Enforcement agents**: foreman-v2-agent, execution-ceremony-admin-agent, independent-assurance-agent
**Layer-Down**: Required for all consumer repos where governance evidence is produced
