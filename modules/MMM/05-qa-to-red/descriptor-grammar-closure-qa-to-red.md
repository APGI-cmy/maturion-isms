# MMM Descriptor Grammar Closure — QA-to-RED

| Field | Value |
|---|---|
| Wave ID | `wave-mmm-descriptor-grammar-closure-2026-06-30` |
| Issue | #1871 |
| Module | MMM |
| QA Type | Product runtime grammar closure |
| Status | RED expectations — no implementation in this artifact |

## Purpose

Define executable expectations for closing the remaining maturity descriptor grammar gap before signoff-route implementation continues.

The user-observed defect is that descriptor generation still sometimes preserves raw criterion wording and produces mechanical copy/paste evidence sentences instead of reconstructing the criterion into a clean auditable evidence clause.

## RED Test Group: T-MMM-DGC-001 — Requirement phrasing becomes evidence-state phrasing

Given a criterion:

```text
Security roles and responsibilities are to be clearly defined and presented in the form of a RACI chart.
```

When maturity descriptors are generated,

Then the Basic descriptor must begin with:

```text
Evidence that Security roles and responsibilities are clearly defined and presented in the form of a RACI chart is absent, weak, outdated, inconsistent, fragmented, or person-dependent.
```

And it must not contain:

```text
are to be clearly defined
```

## RED Test Group: T-MMM-DGC-002 — Gerund/opening-action criteria become auditable evidence clauses

Given a criterion:

```text
Assessing incentive schemes and measures for their impact on Security;
```

When maturity descriptors are generated,

Then the Basic descriptor must begin with:

```text
Evidence that incentive schemes and measures are assessed for their impact on Security is absent, weak, outdated, inconsistent, fragmented, or person-dependent.
```

And it must not begin with:

```text
Evidence that Assessing incentive schemes
```

## RED Test Group: T-MMM-DGC-003 — Instruction words are normalized before maturity state text is attached

Given criteria containing any of these requirement phrases:

- `are to be`
- `should be`
- `will be`
- `shall be`
- `must be`

When maturity descriptors are generated,

Then the descriptor evidence lead must read as an evidence state rather than an instruction.

Examples:

- `should be displayed` -> `is displayed`
- `will be incorporated` -> `is incorporated`
- `must be reviewed` -> `is reviewed`
- `are to be clearly defined` -> `are clearly defined`

## RED Test Group: T-MMM-DGC-004 — The criterion object/action remains specific

Given criteria about RACI charts, incentive schemes, reporting lines, role accountability, support/escalation, procedures, policy display, access authorization, incident RCA, or continuity,

When maturity descriptors are generated,

Then the descriptor must preserve the specific actor/action/object from the criterion and must not collapse the criterion into generic wording such as:

- `policy ownership, communication, display, and awareness control`
- `generic control requirement`
- `governance forum mandate`

unless that wording is genuinely the criterion object.

## RED Test Group: T-MMM-DGC-005 — Accepted descriptor edits are usable generation examples

Given the user edits a descriptor and consents to Maturion learning capture,

When a later descriptor generation is performed for a similar grammar pattern,

Then the generation prompt or deterministic fallback must have access to the approved correction pattern as a style/grammar example, where stored learning records are available.

At minimum, the builder must prove one of the following:

1. accepted descriptor learning records are retrieved and included in generation context; or
2. current storage does not yet expose learning records, and the implementation adds deterministic grammar normalization to cover the examples until retrieval is separately wired.

## RED Test Group: T-MMM-DGC-006 — Editing remains available until explicit future signoff lock

Given generated descriptors are edited and saved,

When the save completes,

Then the descriptor edit controls must remain available for another edit/save cycle unless a future explicit signoff-lock state exists.

This preserves the already-established product rule and prevents the grammar closure from reintroducing the earlier edit-lock defect.

## Acceptance Boundary

The first implementation commit must add or update executable tests before product code is changed, unless the implementation commit is a combined RED-to-GREEN commit explicitly justified by the builder and accepted by Foreman QP.

No ISMS route, subscription, onboarding, checkout, dashboard, Vercel workflow, PIT, Risk, RADAM, or signoff-route implementation is authorized by this QA-to-RED artifact.
