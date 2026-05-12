# RCA Operating Guidance

**Version**: 1.1.0
**Last Updated**: 2026-05-12

RCA is used to convert meaningful failures into recurrence-prevention actions.

## Operating Rules

1. Diagnose and route only; do not implement remediation.
2. Classify trigger as mandatory, optional, or prohibited before assessment.
3. Produce the required RCA assessment output shape.
4. Select the lowest effective corrective layer.
5. Do not introduce gate/checklist/canon bloat without recurrence-prevention value.
6. Mandatory RCA requires IAA review.
7. Treat `<!-- rca-required-marker -->` / `RCA_REQUIRED: yes` as a hard routing state, not advisory text.
8. When RCA_REQUIRED is active, produce and commit:
   `.agent-admin/rca/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT-pr-<PR_NUMBER>.md`
   before further handover / merge-ready / complete language.
9. `preflight/rca-invocation-evidence` is the enforcement gate for marker + artifact completeness.
10. **RCA-before-fix is the mandatory first action** after any CS2 or QA rejection, failure signal,
    or `MERGE_READY: no` verdict. No implementation or fix work begins until the RCA evidence
    artifact is committed. This rule has no exceptions.
11. RCA is an **admin-gap closure expert**, not only an explanation writer. RCA MUST either implement
    the durable prevention measure directly (when within its authority scope) OR issue precise
    Foreman instructions that specify the exact gate/rule/agent instruction/test/knowledge update
    required to prevent recurrence.

## Required RCA Output Shape (Admin-Gap Closure)

Every mandatory RCA assessment MUST produce all five sections below. Omitting any section is a
protocol violation.

```
Root cause:
  Specific missed rule, weak classifier, bad assumption, missing test, stale evidence, or
  agent instruction failure. Must name the exact rule/classifier/assumption that failed,
  not a generic description.

Containment:
  What must happen before this PR proceeds. Must be actionable and specific.

Permanent prevention:
  The exact gate/rule/agent instruction/test/knowledge update that prevents recurrence.
  Must reference the specific file and section to be updated.

Risk scan:
  Adjacent failure modes caused by the same root cause. At minimum: two adjacent modes
  explicitly checked and either confirmed absent or flagged for follow-up.

Implementation / Foreman instruction:
  Either: the implemented fix (with file path and change description), or precise next-action
  instructions for Foreman (naming the agent, file, and change required).
```

## Artifact Creep Prevention

RCA MUST prefer using existing sources: `.admin/pr.json`, existing PR comments, existing IAA
token/final assurance mechanism, existing CI gates, existing test fixtures, existing knowledge files.

RCA MUST NOT introduce:
- New mandatory markdown bundles (unless existing sources are proven insufficient)
- New token-like artifacts (use existing iaa-wave-record mechanism)
- New handover proof families (use existing PREHANDOVER mechanism)
- New duplicate issue/scope sources

Any proposed new artifact in an RCA recommendation MUST include explicit justification showing
why existing sources are insufficient. The justification must appear in the RCA assessment document
under a clearly labelled `New-Artifact Justification:` subsection.
