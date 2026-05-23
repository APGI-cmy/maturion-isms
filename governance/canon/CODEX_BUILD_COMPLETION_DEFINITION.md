# CODEX BUILD COMPLETION DEFINITION

## Status

**Type**: Tier-1 Canonical Governance Definition  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-05-22  
**Owner**: Maturion Engineering Leadership  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: CodexAdvisor, Foreman-style coordinators, specialist builders, QP, ECAP, IAA, CI-confirmed build handovers, and all governed application repositories

---

## 1. Purpose

This canon defines the minimum conditions that must be satisfied before Codex,
Foreman, or any delegated AI workforce member may tell Johan that a build is
ready for final UI or product evaluation.

It closes the operational gap created by non-coder CS2 evaluation: Johan does
not review code, cannot be expected to validate diffs, and judges delivery by
the final visible product outcome. Therefore, the AI workforce must carry the
technical implementation, evidence, and assurance burden before handover.

This canon does not replace:

- `PRE_BUILD_STAGE_MODEL_CANON.md`
- `FULLY_FUNCTIONAL_DELIVERY_STANDARD.md`
- `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`
- `STOP_AND_FIX_DOCTRINE.md`
- `WE_ONLY_FAIL_ONCE_DOCTRINE.md`
- `IAA_PRE_BRIEF_PROTOCOL.md`
- `EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md`

It defines the completion checkpoint that sits after build-to-green and before
Johan is asked to inspect the product.

---

## 2. Governing Principle

> Ready for Johan means ready for non-coder product evaluation, not ready for
> Johan to discover technical defects.

The AI workforce may not shift technical review burden onto Johan. Johan
approves intent, rules, governance changes, waivers, and final visible product
acceptance. Codex, builders, QP, ECAP, IAA, and CI carry implementation and
technical assurance responsibility.

---

## 3. Completion Verdicts

### 3.1 `READY_FOR_UI_EVALUATION`

A build may receive this verdict only when all completion gates in Section 4
are satisfied.

This verdict means:

- The agreed visible outcome is implemented.
- The product can be opened or inspected in a working environment.
- All in-scope defects known to the AI workforce are fixed.
- The assurance pipeline has not left technical judgment for Johan to perform.

### 3.2 `NOT_READY_FOR_UI_EVALUATION`

This verdict is mandatory when any Section 4 gate fails.

The response is Stop-and-Fix. The build may not be presented to Johan as
complete.

### 3.3 `RULE_CHANGE_REQUIRED`

This verdict is mandatory when the build cannot satisfy the current rules
because a rule is missing, stale, contradictory, harmful, or mismatched to the
intended product outcome.

Codex or Foreman must propose the rule change plainly. Johan must approve the
rule change before the build continues under the changed rule.

### 3.4 `CS2_WAIVER_REQUIRED`

This verdict is mandatory when a protected governance exception is needed.

No agent may self-waive completion, evidence, QA, ECAP, IAA, or CI requirements.

---

## 4. Build Completion Gates

All gates in this section must pass before `READY_FOR_UI_EVALUATION`.

### Gate 1: Intent and Scope Lock

- Johan's intended visible outcome is recorded in plain language.
- In-scope and out-of-scope items are explicit.
- UI/product acceptance expectations are defined in terms Johan can inspect.
- No unresolved ambiguity remains that would cause builders to guess.

### Gate 2: Pre-Build Stage Compliance

- The applicable 12-stage pre-build model has been satisfied or a CS2-approved
  scope-specific exemption is recorded.
- QA-to-Red exists for the agreed build scope before implementation.
- PBFAG, implementation plan, builder checklist, IAA pre-brief, and builder
  appointment requirements are satisfied for governed builds.
- Any upstream change has passed change-propagation audit before build resumes.

### Gate 3: QA-to-Red and Build-to-Green Integrity

- Builders were assigned to turn scoped RED QA GREEN.
- Builders did not weaken QA to obtain GREEN.
- Builders did not reinterpret architecture or product intent.
- All scoped QA is GREEN.
- QA coverage maps to the agreed user-visible outcome.

### Gate 4: Zero Test Debt and Anti-Dodging

- No skipped, focused, disabled, removed, minimized, or rationalized tests remain
  inside the agreed scope.
- No test warnings, hidden failures, suppressed errors, or "non-blocking" test
  failures remain.
- No language minimizes remaining defects, warnings, or failures.
- Any discovered test debt triggered Stop-and-Fix before handover.

### Gate 5: Fully Functional Product Evidence

- The app, page, workflow, or service physically exists in the codebase.
- The product launches or runs in the intended local, preview, or deployed
  environment.
- The agreed user journey can be completed end to end.
- Visible calls to action are wired to implemented behavior.
- Success, loading, empty, and failure states are handled where applicable.
- Evidence is available in a form Johan can understand: URL, screenshots,
  screen path, step-by-step inspection instructions, or recorded demonstration.

### Gate 6: QP Review

- Codex or Foreman performs a Quality Professor review after builder completion.
- QP verifies that the build satisfies architecture, QA, and intended outcome.
- QP identifies overbuild, underbuild, scope drift, hidden defects, and
  incomplete UX/product behavior.
- QP findings are fixed before handover or escalated as `RULE_CHANGE_REQUIRED`
  or `CS2_WAIVER_REQUIRED`.

### Gate 7: ECAP Reconciliation

ECAP is required for medium-risk, high-risk, protected-path, governance, CI,
workflow, schema, migration, agent, or evidence-sensitive work.

ECAP verifies:

- Changed file inventory.
- Protected path classification.
- Evidence bundle completeness.
- Gate and verification results.
- Handover readiness.
- Rollback path.

Protected-path work requires ECAP before IAA unless CS2 grants a waiver.

### Gate 8: IAA Assurance

IAA is required for high-risk, protected-path, governance-sensitive, or
product-significant work.

IAA verifies independently:

- Builder claims are supported by evidence.
- QP findings were resolved.
- ECAP evidence is present where required.
- Product-facing work receives split verdict treatment where applicable.
- Functional delivery is not confused with admin correctness.

IAA should be performed by a separate sub-agent or separate session when
independence materially improves assurance.

### Gate 9: CI Confirmation

- CI is confirmatory, not diagnostic.
- Practical local checks have already passed before CI is treated as confirmation.
- CI failures are classified as upstream preflight failure or governance defect.
- No handover relies on Johan reading CI logs.

### Gate 10: Plain-Language Handover for Johan

Every completed build handover to Johan must include:

- What changed, in plain language.
- Where Johan can inspect the result.
- What Johan should do or click.
- What Johan should expect to see.
- Verification performed.
- Any explicitly approved exclusions.
- Residual risk, if any.
- Rollback path.

If this handover cannot be written clearly, the build is not ready for Johan.

---

## 5. Non-Coder CS2 Protection

The process must never require Johan to:

- Read code to determine correctness.
- Inspect diffs to detect hidden defects.
- Read CI logs to diagnose failure.
- Validate technical architecture from implementation details.
- Detect test debt, test dodging, or governance drift manually.

When a build reaches Johan, the remaining question should be:

> Does the visible product satisfy the agreed intent?

If Johan rejects the product outcome, the AI workforce must Stop-and-Fix and
record the failure class under We Only Fail Once.

---

## 6. Rule Change Protocol

If existing rules do not produce the intended outcome, the correct response is
not to work around the rules. The correct response is to change the rules under
CS2 authority and then continue inside the updated rules.

Rule changes must follow this sequence:

1. Identify the rule gap, contradiction, or harmful constraint.
2. Explain the product or governance consequence in plain language.
3. Propose the rule change and the affected files.
4. Obtain CS2 approval.
5. Update canon or local governance.
6. Layer down to affected repos when required.
7. Resume work under the updated rule.

No silent rule changes are permitted.

---

## 7. Failure Learning Protocol

Every failed Johan UI evaluation, QP review, ECAP pass, IAA pass, local gate, or
CI confirmation must trigger the learning loop.

Required response:

1. Stop.
2. Fix the immediate failure.
3. Identify why the process allowed the failure.
4. Record the lesson or memory entry.
5. Update QA, checklist, canon, template, or working contract when needed.
6. Verify the same failure class is prevented next time.

The second occurrence of the same root cause is catastrophic and must be
escalated under `WE_ONLY_FAIL_ONCE_DOCTRINE.md`.

---

## 8. Prohibited Completion Patterns

The following patterns must not be accepted as complete:

- "Mostly done" delivery.
- "Non-blocking" known defects inside agreed scope.
- UI shell presented as functional workflow.
- Admin correctness presented as product correctness.
- Tests green but product not runnable.
- Product runnable but user journey incomplete.
- CI passed but local verification or evidence missing.
- Handover that requires Johan to find technical defects.
- Builder self-certification without QP, ECAP, or IAA where required.
- Same-thread IAA for high-risk work when separate assurance is available and
  materially improves independence.

---

## 9. Completion Checklist

Before declaring `READY_FOR_UI_EVALUATION`, the responsible coordinator must
answer YES to every applicable item:

| Check | Required Answer |
|-------|-----------------|
| Intent and visible acceptance agreed with Johan | YES |
| Applicable pre-build stages complete | YES |
| QA-to-Red existed before build | YES |
| Scoped QA is GREEN | YES |
| Zero test debt verified | YES |
| Test dodging scan passed | YES |
| Product launches or runs | YES |
| Agreed user journey works end to end | YES |
| QP review complete and findings resolved | YES |
| ECAP complete where required | YES or NOT REQUIRED WITH JUSTIFICATION |
| IAA complete where required | YES or NOT REQUIRED WITH JUSTIFICATION |
| CI/local gates confirm expected status | YES |
| Plain-language handover prepared | YES |
| No known in-scope defects remain | YES |

Any answer other than the required answer blocks completion.

---

## 10. Layer-Down Requirements

This canon is `PUBLIC_API` governance and must be layered down to governed
consumer repositories that operate under Maturion one-time build discipline.

Minimum layer-down targets:

- `maturion-foreman-office-app`
- `app_management_centre`
- `maturion-isms`
- `PartPulse`
- `R_Roster`

Consumer repos must treat this canon as binding for CodexAdvisor, Foreman,
builder, QP, ECAP, IAA, and CI handover behavior.

---

## 11. Version History

| Version | Date | Authority | Change |
|---------|------|-----------|--------|
| 1.0.0 | 2026-05-22 | CS2 Johan Ras | Initial canon. Defines completion gates before Codex or the AI workforce may present a build to Johan for non-coder UI/product evaluation. |

---

**End of CODEX_BUILD_COMPLETION_DEFINITION.md**

