# MMM Descriptor Reasoning and Governed Learning Retrieval — QA-to-RED Expansion

| Field | Value |
|---|---|
| Module | MMM — Maturity Model Management |
| QA Type | Descriptor reasoning, source-mode handling, governed learning capture, governed learning retrieval |
| Status | RED expectations — no implementation in this artifact |
| Authority | CS2 — Johan Ras |
| Created | 2026-07-02 |
| Related FRS Addendum | `modules/MMM/02-frs/descriptor-reasoning-learning-frs-addendum.md` |
| Related Existing QA | `modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md` |
| Related Active Wave | `wave-mmm-descriptor-grammar-closure-2026-06-30` / issue #1871 |

---

## 1. Purpose

This QA-to-RED expansion defines executable expectations for the next MMM descriptor generation correction.

The existing descriptor grammar closure QA remains valid. This file expands that QA from simple grammar normalisation into source-mode-aware descriptor reasoning and governed learning retrieval.

A builder must not satisfy this work by adding only hard-coded one-off string replacements. The implementation must prove the product behaviour required by the FRS addendum.

---

## 2. Test Boundary

This QA expansion authorises tests only for:

1. descriptor reasoning pipeline behaviour;
2. verbatim/hybrid/new-generation source-mode handling;
3. criterion cleaning and actionable-clause reconstruction;
4. user correction learning consent;
5. descriptor-learning record shape and scope;
6. governed learning retrieval and fallback;
7. learning conflict hygiene;
8. editability after descriptor save.

This QA expansion does not authorise tests or code for:

- ISMS public routes;
- subscription, authentication, onboarding, dashboard, or entitlement handoff;
- PIT, RADAM, Risk, Incident, APW, or other module implementation;
- signoff-route implementation;
- direct AI provider integration outside AIMC governance.

---

## 3. RED Test Group: T-MMM-DRGL-001 — Verbatim nominal phrase is reconstructed

Given source mode is `verbatim_source`

And the raw criterion statement is:

```text
Review and approval of facility design changes for adequate Security measures.
```

When maturity descriptors are generated,

Then the Basic descriptor evidence lead must begin with:

```text
Evidence that facility design changes are reviewed and approved for adequate Security measures
```

And it must not contain:

```text
Evidence that Review and approval of facility design changes
```

And it must not collapse to generic wording such as:

```text
generic control requirement
policy ownership, communication, display, and awareness control
procedure execution and control workflow
```

---

## 4. RED Test Group: T-MMM-DRGL-002 — Verbatim source mode preserves raw criterion but reasons over it

Given source mode is `verbatim_source`

And the saved criterion text is awkward, nominal, or heading-like,

When descriptors are generated,

Then the saved criterion statement must remain unchanged unless the user explicitly edits the criterion,

And the descriptor subject must be reconstructed into a clean evidence-state clause,

And the generated descriptor must preserve traceability to the raw criterion.

Minimum assertion:

```text
savedCriterion.statement === originalRawCriterion.statement
basicDescriptor.descriptor_text includes reconstructed evidence-state clause
basicDescriptor.descriptor_text does not begin with raw malformed criterion stem
```

---

## 5. RED Test Group: T-MMM-DRGL-003 — Source mode is included in generation context and retrieval query

Given descriptor generation is triggered from each supported source mode:

```text
verbatim_source
hybrid_source
new_generation_context
```

When the generation context is assembled,

Then the context object passed to descriptor generation and learning retrieval must include the selected `source_mode`,

And source mode must influence reasoning behaviour.

Minimum assertions:

```text
generationContext.source_mode === selectedSourceMode
learningRetrievalQuery.source_mode === selectedSourceMode
```

---

## 6. RED Test Group: T-MMM-DRGL-004 — Notes and guidance are stripped from descriptor subject but retained as context

Given a verbatim criterion containing a parenthetical or bracketed guidance block such as:

```text
Specific Security accountabilities and performance measures should be documented within role descriptions. (Note: This is especially important during high-risk diamond handling activities.)
```

When descriptors are generated,

Then the evidence lead must be based on the actionable requirement only,

And the `Note:` content must not appear as the descriptor subject,

And the `Note:` content may remain available as contextual interpretation material.

Minimum negative assertion:

```text
descriptorEvidenceLead does not include "Note:"
descriptorEvidenceLead does not include "This is especially important"
```

---

## 7. RED Test Group: T-MMM-DRGL-005 — Gerund and instruction wording remain covered

Given source mode is `verbatim_source`

And the raw criterion contains one of these patterns:

```text
Assessing incentive schemes and measures for their impact on Security;
Security roles and responsibilities are to be clearly defined and presented in the form of a RACI chart.
The policy should be prominently displayed.
The requirement will be incorporated into site procedures.
```

When descriptors are generated,

Then the evidence lead must use evidence-state phrasing:

```text
incentive schemes and measures are assessed for their impact on Security
Security roles and responsibilities are clearly defined and presented in the form of a RACI chart
the policy is prominently displayed
the requirement is incorporated into site procedures
```

And the descriptor must not preserve the raw instruction wording as the evidence subject.

---

## 8. RED Test Group: T-MMM-DRGL-006 — Learning consent gates memory write

Given a user edits a generated descriptor,

When the edit is saved,

Then MMM may display a learning consent prompt,

And no reusable descriptor-learning record may be created unless the user selects an affirmative consent action.

Minimum assertions:

```text
if userConsent === false:
  descriptor is saved
  descriptor_learning record is not created

if userConsent === true:
  descriptor is saved
  descriptor_learning record is created with consent_status = "granted"
```

---

## 9. RED Test Group: T-MMM-DRGL-007 — Learning record stores transformation evidence

Given the user consents to recording a descriptor correction,

When the learning event is created,

Then the record must store before/after and reasoning metadata, not only the final corrected descriptor text.

Minimum expected fields:

```text
learning_type
source_mode
framework_id
organisation_id or tenant scope
domain_id
mps_id
criterion_id
criterion_code
criterion_original_text
criterion_cleaned_actionable_clause
descriptor_level
maturion_original_descriptor
user_corrected_descriptor
correction_reason_category
approved_for_reuse_scope
consent_status
review_status
created_by
created_at
conflict_status
```

The test must fail if only `user_corrected_descriptor` is persisted.

---

## 10. RED Test Group: T-MMM-DRGL-008 — Learning reuse scope prevents uncontrolled globalisation

Given a descriptor-learning record is created from a customer or organisation-specific framework,

When that learning is saved,

Then it must have an explicit reuse scope,

And it must not be available as global methodology unless reviewed and promoted through governed approval.

Minimum assertions:

```text
learning.approved_for_reuse_scope is not null
learning.approved_for_reuse_scope !== "approved_global_methodology_pattern" unless review_status === "approved_global"
```

---

## 11. RED Test Group: T-MMM-DRGL-009 — Prior accepted correction influences similar future descriptor

Given an approved descriptor-learning record exists for source mode `verbatim_source`

And the learning pattern records that a nominal phrase such as:

```text
Review and approval of X
```

must become:

```text
X is reviewed and approved
```

When a later similar criterion is processed:

```text
Review and approval of emergency response changes for adequate Security measures.
```

Then descriptor generation must retrieve the prior learning or apply the equivalent deterministic methodology fallback,

And the generated descriptor must begin with:

```text
Evidence that emergency response changes are reviewed and approved for adequate Security measures
```

And it must not begin with:

```text
Evidence that Review and approval of emergency response changes
```

---

## 12. RED Test Group: T-MMM-DRGL-010 — Learning retrieval uses priority order

Given multiple learning records match a descriptor generation request,

When learning retrieval ranks candidates,

Then the priority order must be:

```text
1. Same criterion, same framework, same organisation.
2. Same framework and similar criterion grammar pattern.
3. Same organisation and similar source-mode pattern.
4. Same source mode and approved anonymised global pattern.
5. Approved global methodology pattern.
```

Minimum assertion:

```text
rankedLearningCandidates[0] is the highest-priority permitted match
```

Lower-priority global patterns must not override higher-priority same-framework learning.

---

## 13. RED Test Group: T-MMM-DRGL-011 — Retrieval is bounded to high-signal examples

Given many historical descriptor-learning records exist,

When descriptor generation requests learning examples,

Then the retrieval result must be bounded.

Minimum assertions:

```text
retrievedLearningExamples.length <= 10
preferredLearningExamples.length <= 7 where scoring supports it
```

The test must fail if all matching historical records are injected into descriptor context without ranking or limit.

---

## 14. RED Test Group: T-MMM-DRGL-012 — Conflicting learning is not silently merged

Given two applicable learning records conflict,

When descriptor generation retrieves both records,

Then MMM must either:

1. select the record that wins under the governed priority rules; or
2. exclude conflict-flagged records; or
3. surface the conflict for human review.

MMM must not silently blend contradictory corrections into one descriptor.

Minimum assertions:

```text
conflict_flagged records are not used for generation by default
conflicting same-priority records trigger review/selection path
```

---

## 15. RED Test Group: T-MMM-DRGL-013 — Tenant isolation governs learning retrieval

Given a descriptor-learning record belongs to Organisation A,

When Organisation B generates descriptors,

Then Organisation B must not retrieve Organisation A's tenant-specific learning unless that learning has been anonymised, reviewed, and promoted to an approved global methodology pattern.

Minimum assertion:

```text
retrievedLearningRecords.every(record =>
  record.organisation_id === currentOrganisationId ||
  record.approved_for_reuse_scope in ["approved_global_methodology_pattern", "anonymised_global_pattern_candidate"] && record.review_status permits use
)
```

---

## 16. RED Test Group: T-MMM-DRGL-014 — Memory unavailable fallback is honest and deterministic

Given descriptor-learning retrieval is unavailable, blocked, empty, or below confidence threshold,

When descriptors are generated,

Then MMM must use deterministic approved descriptor methodology fallback,

And it must not claim that prior learning was applied.

Minimum assertions:

```text
generation.learningApplied === false
fallbackMethodologyApplied === true
descriptor still passes evidence-state grammar checks
```

---

## 17. RED Test Group: T-MMM-DRGL-015 — Maturity levels remain distinct operating states

Given a reconstructed evidence-state clause,

When five descriptors are generated,

Then each maturity level must represent a different observable operating state:

```text
Basic: absent / weak / inconsistent / person-dependent
Reactive: exists but mainly after incidents, audits, pressure, or visible failures
Compliant: approved, implemented, recorded, and evidenced at minimum standard
Proactive: risk-based, owner-led, measured, trended, and improved
Resilient: embedded, system-supported, monitored, exception-driven, recoverable, and independent of single individuals
```

The test must fail if the same descriptor is copied across levels with only the level label changed.

---

## 18. RED Test Group: T-MMM-DRGL-016 — Descriptor editing remains available after save

Given descriptors have been generated and saved,

When the save completes,

Then descriptor edit controls must remain available for another edit/save cycle unless a future explicit signoff lock exists.

This prevents the reasoning/learning work from reintroducing the earlier edit-lock defect.

---

## 19. RED Test Group: T-MMM-DRGL-017 — Learning capture does not self-promote to Subject Knowledge Domain

Given a user correction is recorded as descriptor learning,

When the learning record is saved,

Then it must not automatically become Subject Knowledge Domain content or approved global methodology.

Minimum assertions:

```text
newLearning.review_status in ["candidate", "active"]
newLearning.approved_for_reuse_scope !== "approved_global_methodology_pattern" unless explicit governed approval evidence exists
```

---

## 20. RED Test Group: T-MMM-DRGL-018 — Descriptor generation context includes current framework state

Given descriptors are generated for a criterion,

When the descriptor reasoning context is assembled,

Then it must include:

```text
framework_id
domain_id
domain name or code where available
mps_id
mps name or code where available
intent statement where available
criterion_id
criterion_code
criterion_original_text
source_mode
```

This ensures Maturion reasons from the current MMM state rather than isolated criterion text only.

---

## 21. Required Builder Evidence

A future implementation builder must provide evidence showing:

1. executable tests were added or updated for these RED groups before or with the implementation;
2. descriptor generation passes the verbatim nominal phrase example;
3. learning consent prevents memory writes when declined;
4. learning records store transformation metadata;
5. retrieval is scoped, ranked, and bounded;
6. tenant-specific learning cannot bleed into another organisation;
7. deterministic fallback still produces valid descriptors when learning retrieval is unavailable;
8. no ISMS/PIT/RADAM/Risk/signoff-route scope was touched.

---

## 22. Acceptance Boundary

This QA expansion is satisfied only when the runtime behaviour is proven through executable tests or explicitly documented pre-build-only status.

A documentation-only PR may add this QA artifact without implementation, but it must not claim descriptor runtime completion, production readiness, merge readiness, or user-facing fix completion.
