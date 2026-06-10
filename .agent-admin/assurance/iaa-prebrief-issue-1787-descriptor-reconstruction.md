# IAA Pre-Brief — Issue 1787 Descriptor Reconstruction

- **Repository**: `APGI-cmy/maturion-isms`
- **PR**: #1788
- **Issue**: #1787
- **Module**: MMM
- **Wave**: `mmm-dmc-descriptor-reconstruction-20260610`
- **Status**: PRE-BRIEF

## PRE-BRIEF

Implementation files are changed in this wave. Independent assurance is required before any merge recommendation.

## Scope Under Assurance

1. Global descriptor sentence reconstruction for MMM DMC maturity descriptors.
2. Contextual clause grammar integration.
3. Per-level learning-consent prompt behavior.
4. Persistent descriptor editing before second-level/final sign-off.
5. Explicit sign-off lock seam or lock behavior.
6. Test and CI evidence for RED gates T-MMM-DMC-044 through T-MMM-DMC-048.

## Assurance Questions

IAA must independently check:

- Does the implementation apply globally, not only to the sample Leadership criterion?
- Does descriptor text avoid `criterion copy + maturity suffix` output?
- Are Basic, Reactive, Compliant, Proactive, and Resilient edits all routed through the same learning-consent logic?
- Can a user edit a descriptor more than once before sign-off?
- Is any sign-off limitation explicit and not hidden?
- Are tests present and mapped to the RED gate IDs?
- Are CI failures resolved or honestly classified before merge?

## Initial Risk View

- **Risk**: Medium-high, because the defect affects user trust in AI-generated audit descriptors.
- **Product impact**: MMM criteria generation and descriptor authoring.
- **Governance risk**: High if PR is merged while CI gates remain red or if runtime implementation is accepted without evidence.

## Initial IAA Direction

IAA should not approve merge until:

- Foreman QP is complete;
- ECAP record is filed;
- final IAA review is filed;
- all required CI gates are green or explicitly waived by CS2;
- runtime behavior and tests support the global rule.
