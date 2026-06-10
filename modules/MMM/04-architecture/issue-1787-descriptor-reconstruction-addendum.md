# MMM Architecture Addendum — Issue 1787 Global Descriptor Reconstruction

- **Module**: MMM
- **Stage**: 5 Architecture Addendum
- **Issue**: #1787
- **Wave**: `mmm-dmc-descriptor-reconstruction-20260610`
- **Status**: ACTIVE pre-build authority

## 1. Purpose

This addendum records the global DMC descriptor-generation correction raised during CS2 live testing.

The correction is not limited to one criterion. It applies to every generated maturity descriptor across every accepted criterion, MPS, domain, source mode, and maturity level.

## 2. Global Descriptor Sentence-Reconstruction Rule

Maturity descriptor generation must reconstruct accepted criteria into grammatically correct audit-evidence sentences.

The generator must not produce descriptors by blindly copying the full accepted criterion and appending the maturity-level posture.

Invalid pattern:

```text
Evidence that <full criterion text> <level posture suffix>.
```

Required pattern:

```text
Evidence that <criterion actor/action/object/context compiled into one auditable clause> <maturity-level evidence state>.
```

## 3. Required Descriptor Authoring Behaviour

For each Basic, Reactive, Compliant, Proactive, and Resilient descriptor:

1. Preserve the accepted criterion's actor, action, object, and material context.
2. Compress supporting criterion clauses into one readable auditable evidence clause.
3. Integrate contextual phrases such as `especially during...`, `where possible...`, `as applicable...`, and similar qualifiers into the sentence grammatically.
4. Remove explanatory `Note:`, `Guidance:`, and `Reference:` material from the descriptor evidence clause while retaining it in the accepted criterion for user context.
5. Avoid malformed sentence starts such as `Evidence that To...`, `Evidence that Where...`, or a full copied criterion followed by `is absent...`.
6. Phrase the output as the observed state of evidence, not as a future obligation.
7. Apply the rule in Verbatim, Hybrid, and New Generation modes.

## 4. AI and Deterministic Generator Boundary

Both deterministic descriptor fallback and AI-refined descriptor output must pass the same reconstruction and validation rules before display or save.

AI refinement is allowed only as a refinement layer. It must not bypass deterministic validation or present copied criteria as maturity descriptors.

If AI returns a descriptor that materially resembles `criterion copy + maturity suffix`, the UI must reject it and use the governed deterministic reconstruction path instead.

## 5. Learning Consent Reliability Rule

Descriptor edit learning must be level-independent.

The Maturion learning prompt must appear when an edited descriptor is closed or saved for any maturity level where learning consent has not yet been captured for that edited level or criterion, including:

- Basic;
- Reactive;
- Compliant;
- Proactive;
- Resilient.

Reactive and later level edits must not silently skip the learning prompt because Basic already exercised the pathway in another edit session.

## 6. Persistent Edit-Until-Signoff Rule

Descriptor editing remains available until second-level/final descriptor sign-off locks the criterion.

Before sign-off:

- `Edit descriptor` remains visible for every level;
- users may perform multiple edits on the same descriptor;
- saving a descriptor persists the draft but does not remove the edit capability;
- closing an editor after an edit still triggers learning consent when required.

After sign-off:

- editing is locked;
- the locked/sign-off state is visible;
- descriptor text is preserved as the approved descriptor set.

## 7. QA Binding

This addendum is bound to the issue #1787 QA-to-RED addendum:

```text
modules/MMM/05-qa-to-red/issue-1787-descriptor-reconstruction-qa-to-red.md
```

Runtime implementation must not be treated as complete until the RED tests in that artifact are GREEN.
