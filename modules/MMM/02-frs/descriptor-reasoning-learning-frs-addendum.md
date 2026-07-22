# MMM Descriptor Reasoning and Governed Learning Retrieval — FRS Addendum

| Field | Value |
|---|---|
| Module | MMM — Maturity Model Management |
| Artifact Type | Functional Requirements / Pre-Build Addendum |
| Addendum ID | `MMM-FRS-DRGL-20260702` |
| Status | PRE-BUILD ADDENDUM — CS2-requested descriptor reasoning and governed learning retrieval scope |
| Authority | CS2 — Johan Ras |
| Created | 2026-07-02 |
| Scope | Descriptor generation reasoning, source-mode handling, user correction learning, governed retrieval, and learning hygiene |
| Non-Scope | Runtime code, schema migration, production learning registry mutation, ISMS public route work, signoff route implementation, PIT/RADAM/Risk module work |
| Related Active Wave | `wave-mmm-descriptor-grammar-closure-2026-06-30` / issue #1871 |
| QA Expansion | `modules/MMM/05-qa-to-red/descriptor-reasoning-learning-qa-to-red.md` |

---

## 1. Purpose

This addendum expands the MMM descriptor-generation pre-build baseline from grammar closure into a governed reasoning and learning retrieval capability.

The defect being closed is not only bad wording. The deeper defect is that MMM can treat verbatim uploaded criteria as clean criterion grammar and mechanically wrap the uploaded wording into maturity descriptors.

That is wrong for Verbatim source mode.

In Verbatim source mode, uploaded Domains, MPSs, intent statements, and Criteria are preserved from the source material. The uploaded criterion may therefore be incomplete, nominal, awkward, guidance-heavy, or written as a heading rather than as a clean auditable requirement. Maturion must reason over that source material before descriptor generation.

---

## 2. Core Product Rule

### DRGL-CORE-001 — Descriptor reasoning before maturity wording

Before MMM generates Basic, Reactive, Compliant, Proactive, and Resilient maturity descriptors, Maturion MUST reconstruct the criterion into an observable evidence-state clause.

Maturion MUST NOT copy the raw criterion into each descriptor level.

Required transformation pattern:

```text
Uploaded / raw criterion source
  -> cleaned actionable requirement
    -> actor/action/object extraction
      -> evidence-state clause
        -> maturity-level operating state descriptors
```

Example:

```text
Raw criterion:
Review and approval of facility design changes for adequate Security measures.

Invalid evidence lead:
Evidence that Review and approval of facility design changes for adequate Security measures...

Required evidence lead:
Evidence that facility design changes are reviewed and approved for adequate Security measures...
```

---

## 3. Source-Mode Requirement

### DRGL-FR-001 — Source mode must govern reasoning behaviour

MMM descriptor generation MUST detect and respect the selected framework source mode:

1. `verbatim_source`
2. `hybrid_source`
3. `new_generation_context`

The selected source mode MUST be included in the descriptor-generation context and in any learning retrieval query.

### DRGL-FR-002 — Verbatim source mode is interpretive, not generative rewriting

When source mode is `verbatim_source`, Maturion MUST treat uploaded criteria as preserved source material that may require interpretation before descriptor generation.

Maturion MUST:

1. preserve the raw criterion as the auditable source statement;
2. avoid rewriting the saved criterion unless the user explicitly edits it;
3. derive a clean descriptor subject from the raw criterion;
4. strip descriptor-irrelevant guidance from the descriptor subject while retaining it as context;
5. preserve the criterion-specific actor/action/object in the maturity descriptors;
6. avoid generic policy/control wording unless that is genuinely the criterion object.

### DRGL-FR-003 — Hybrid source mode must merge source fidelity and Maturion improvement

When source mode is `hybrid_source`, Maturion MAY improve wording more actively than in verbatim mode, but MUST still retain traceability to uploaded source material and user-approved framework structure.

### DRGL-FR-004 — New generation context mode may use full methodology generation

When source mode is `new_generation_context`, Maturion MAY generate cleaner criteria and descriptors using approved subject knowledge, methodology, and customer context. The same descriptor reasoning pipeline still applies, but the raw uploaded-source constraint is lower because the criterion may already be Maturion-authored.

---

## 4. Descriptor Reasoning Pipeline

### DRGL-FR-005 — Descriptor pipeline stages

Maturion MUST use the following descriptor reasoning pipeline before saving or presenting generated descriptors:

```text
1. Detect source mode.
2. Load approved descriptor methodology and maturity-level definitions.
3. Load current framework context: domain, MPS, intent, criterion, source metadata.
4. Clean the criterion for descriptor purposes.
5. Retrieve governed descriptor-learning memory.
6. Reconstruct an evidence-state clause.
7. Generate five maturity-level descriptors.
8. Validate the descriptors against product rules.
9. Present editable descriptors to the user.
10. On user edit, request learning consent before writing any learning event.
```

### DRGL-FR-006 — Criterion cleaning

Criterion cleaning MUST:

1. remove or ignore descriptor-subject guidance blocks such as `Note:`, `Guidance:`, and `Reference:`;
2. preserve those guidance blocks as context for interpretation only;
3. remove upload/source suffixes such as `[uploaded_source]` from descriptor subjects;
4. identify and preserve contextual qualifiers where they materially affect the requirement;
5. avoid collapsing multi-sentence guidance into the evidence lead.

### DRGL-FR-007 — Actionable-clause reconstruction

Maturion MUST reconstruct malformed or non-sentence criteria into auditable clauses.

Required examples:

| Raw Pattern | Required Descriptor Subject Pattern |
|---|---|
| `Review and approval of X` | `X is reviewed and approved` |
| `Assessing X for Y` | `X is assessed for Y` |
| `X are to be clearly defined` | `X are clearly defined` |
| `X should be displayed` | `X is displayed` |
| `X will be incorporated` | `X is incorporated` |
| `To establish X` | `X is established` or `Evidence establishing X`, depending on grammar |

### DRGL-FR-008 — Actor/action/object preservation

Each descriptor MUST preserve the criterion-specific actor/action/object where available.

For example, a criterion about facility design changes must remain about facility design changes. It must not collapse into generic wording such as:

- `policy ownership, communication, display, and awareness control`;
- `generic control requirement`;
- `governance forum mandate`;
- `procedure execution and control workflow`;

unless that wording is genuinely the criterion object.

---

## 5. Governed Learning Capture

### DRGL-FR-009 — Learning consent required

When a user manually edits a generated descriptor, MMM MAY ask whether Maturion should remember the correction.

Maturion MUST NOT write a reusable descriptor-learning record unless the user explicitly consents.

Acceptable consent wording:

```text
Thank you for the guidance. I can use this correction to improve future descriptor generation. Would you like me to record this as a Maturion learning preference?

[Yes, record it] [No, do not record it]
```

### DRGL-FR-010 — Learning record must capture transformation, not only final text

A descriptor-learning record MUST capture the reasoning transformation, not merely the edited descriptor text.

At minimum, the learning record must include:

```text
learning_type: descriptor_generation_correction
source_mode
framework_id
organisation_id / tenant scope where applicable
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
supersedes_learning_id where applicable
conflict_status
```

### DRGL-FR-011 — Correction reason categories

The implementation MUST support correction reason classification. Initial categories:

```text
note_block_removed
gerund_rewritten
nominal_phrase_reconstructed
passive_state_reconstructed
instruction_word_normalised
actor_action_object_restored
maturity_state_too_generic
customer_context_preserved
evidence_clause_improved
grammar_only
scope_limited_preference
other
```

### DRGL-FR-012 — Learning scope must be explicit

Every descriptor-learning record MUST have an explicit reuse scope:

```text
this_criterion_only
this_framework
this_organisation
same_source_mode_pattern
anonymised_global_pattern_candidate
approved_global_methodology_pattern
```

No tenant-specific or customer-specific correction may be promoted to global methodology without governed review and explicit approval.

---

## 6. Governed Learning Retrieval

### DRGL-FR-013 — Learning retrieval before descriptor generation

Before generating descriptors, MMM MUST retrieve applicable descriptor-learning records where a governed learning store is available.

Retrieval inputs must include:

```text
source_mode
task_type = descriptor_generation
criterion_original_text
criterion_cleaned_actionable_clause
criterion grammar shape
domain / MPS context
framework_id
organisation_id / tenant scope
approved learning statuses only
```

### DRGL-FR-014 — Retrieval priority

Learning retrieval MUST apply this priority order:

```text
1. Same criterion, same framework, same organisation, approved/active learning.
2. Same framework and similar criterion grammar pattern.
3. Same organisation and similar source-mode pattern.
4. Same source mode and approved anonymised global pattern.
5. Approved global methodology pattern.
```

Lower-priority learning MUST NOT override higher-priority learning where they conflict.

### DRGL-FR-015 — Retrieval limit and scoring

Descriptor generation MUST use a small, high-signal learning set rather than dumping all historical corrections into context.

Initial retrieval target:

```text
minimum: 0
preferred maximum: 3 to 7 learning examples
hard maximum: 10 learning examples unless CS2 approves otherwise
```

Each learning candidate should be scored against:

```text
source-mode match
criterion grammar-shape match
same criterion/framework/organisation proximity
approval status
freshness
reuse success count
conflict status
specialist/methodology confidence
```

### DRGL-FR-016 — Memory unavailable fallback

If governed learning retrieval is unavailable, empty, blocked, or below confidence threshold, Maturion MUST still use the deterministic approved descriptor methodology fallback.

The system MUST NOT pretend that learning was applied when no learning record was used.

---

## 7. Learning Hygiene and Conflict Control

### DRGL-FR-017 — Learning lifecycle status

Descriptor-learning records MUST support lifecycle status:

```text
candidate
active
validated
superseded
rejected
retired
conflict_flagged
```

Only records with allowed statuses may influence generation. Initial generation should use `active` and `validated` records only, unless a later CS2-approved rule allows candidate use.

### DRGL-FR-018 — Conflict handling

If retrieved learning records conflict, Maturion MUST NOT silently merge them.

Conflict handling priority:

```text
1. Approved methodology pattern beats ordinary preference.
2. Same organisation/framework beats cross-organisation/global pattern.
3. Same criterion beats similar criterion.
4. Latest validated correction beats older active correction at the same scope.
5. Conflict_flagged records are excluded unless explicitly selected for review.
```

Where conflict could affect descriptor correctness, Maturion must surface the issue for human review rather than choose silently.

### DRGL-FR-019 — Tenant isolation

Descriptor-learning retrieval MUST enforce tenant and organisation boundaries.

Customer-specific correction records MUST NOT be retrieved for another organisation unless they have been anonymised, reviewed, and promoted into an approved global methodology pattern.

### DRGL-FR-020 — No uncontrolled globalisation

User corrections from customer frameworks may not automatically become Subject Knowledge Domain content or global Maturion doctrine.

Promotion to global methodology requires governed approval consistent with Maturion self-learning governance.

---

## 8. Runtime Specialist Alignment

### DRGL-FR-021 — Orchestrator/specialist reasoning model

Descriptor generation is a runtime Maturion orchestration task, not a single UI string operation.

The intended runtime reasoning chain is:

```text
Runtime Maturion
  -> loads source mode and current MMM state
  -> retrieves Subject Knowledge Domain methodology
  -> retrieves Framework / Context Domain material where applicable
  -> consults document-parser logic for uploaded/verbatim source interpretation where needed
  -> consults criteria-generator logic for clean requirement reconstruction where needed
  -> consults maturity-scoring / MMM methodology logic for maturity state differentiation
  -> validates output against descriptor guardrails
  -> presents editable descriptors to the user
```

This addendum does not activate runtime specialist agents by itself. It defines the functional behaviour that later runtime implementation must satisfy.

---

## 9. Output Validation Rules

### DRGL-FR-022 — Descriptor validation gate

Before presentation, generated descriptors MUST be checked for:

1. no raw malformed criterion stem at evidence lead;
2. no forbidden instruction wording where evidence-state wording is required;
3. no copied `Note:`, `Guidance:`, or `Reference:` block in descriptor subject;
4. actor/action/object preserved;
5. Basic, Reactive, Compliant, Proactive, and Resilient states are meaningfully distinct;
6. source mode respected;
7. learning records used only where consent, scope, and lifecycle status allow;
8. descriptor editing remains available after save until a future explicit signoff lock exists.

---

## 10. Build Boundary

This addendum authorises only pre-build and QA alignment for descriptor reasoning and governed learning retrieval.

Implementation remains blocked until QA-to-red exists and the builder is appointed under the normal MMM governance sequence.

No implementation may use this addendum to build:

- ISMS public journey changes;
- subscription/auth/onboarding/dashboard routes;
- PIT, RADAM, Risk, or other module behaviour;
- signoff-route implementation;
- production learning registry mutation without explicit schema/API pre-build coverage;
- direct AI provider calls outside AIMC governance.
