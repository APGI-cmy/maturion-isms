# BUILD PROGRESS TRACKER

**Module**: MMM (Maturity Management Module)  
**Module Slug**: MMM  
**Last Updated**: 2026-07-02  
**Updated By**: foreman-v2-agent (wave: wave-mmm-descriptor-reasoning-learning-prebuild-2026-07-02 — CS2-requested pre-build/QA expansion for descriptor reasoning and governed learning retrieval)

> **Classification**: ACTIVE — DESCRIPTOR REASONING AND GOVERNED LEARNING RETRIEVAL PRE-BUILD / QA EXPANSION OPEN BEFORE RUNTIME IMPLEMENTATION
> **Document Role**: PRIMARY LIVE CONTROL DOCUMENT — CS2 should use this document as the main live progress dashboard.
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0
> **Baseline Issue**: [maturion-isms#1871](https://github.com/APGI-cmy/maturion-isms/issues/1871) — original descriptor grammar closure issue; the DRGL lane is a CS2-requested successor pre-build scope and should receive a successor implementation issue before runtime build work starts.
> **Update Rule**: This document MUST be updated immediately after every MMM stage issue, wave completion, approval, or readiness/blocker change.

## Current Live Status

MMM approval workflow pre-build and QA-to-red work for Steps 1-8 is complete and merged to `main`.

PR #1850 introduced shared ISMS/module boundary authority. PR #1854 aligned MMM pre-build artifacts to that authority. Runtime public journey/linkup work remains ISMS/MMM boundary-governed and must not be mixed into MMM descriptor grammar closure.

Current active MMM descriptor lane:

- Wave: `wave-mmm-descriptor-reasoning-learning-prebuild-2026-07-02`
- Branch: `foreman/mmm-descriptor-reasoning-learning`
- Builds on: `wave-mmm-descriptor-grammar-closure-2026-06-30` / baseline issue `#1871`
- Tracking note: `#1871` remains the baseline descriptor grammar closure issue. The descriptor reasoning and governed learning retrieval lane is a successor pre-build scope; open a successor issue before any runtime implementation is appointed.
- Purpose: extend the descriptor grammar closure lane into a governed descriptor reasoning and learning retrieval design so Maturion reasons over verbatim source criteria, consults consented descriptor-learning records, and avoids repeating corrected failures.
- Status: pre-build artifact and QA-to-red expansion only; no runtime implementation claim.

## Descriptor Reasoning + Governed Learning Retrieval Authority

Active pre-build / QA artifacts added for CS2 review:

- `modules/MMM/02-frs/descriptor-reasoning-learning-frs-addendum.md`
- `modules/MMM/05-qa-to-red/descriptor-reasoning-learning-qa-to-red.md`

These artifacts expand the descriptor grammar closure lane from string-level grammar correction into a reasoning pipeline:

1. detect source mode (`verbatim_source`, `hybrid_source`, `new_generation_context`);
2. preserve raw verbatim criteria while deriving clean descriptor subjects;
3. strip `Note:`, `Guidance:`, and `Reference:` material from the descriptor evidence subject while preserving it as context;
4. reconstruct nominal, gerund, passive, and instruction-style criteria into evidence-state clauses;
5. retrieve consented descriptor-learning records before generation where a governed learning store is available;
6. rank and bound retrieved learning examples;
7. prevent tenant-specific learning from bleeding into other organisations;
8. prevent uncontrolled globalisation of customer-specific corrections;
9. keep descriptor editing available after save until a future explicit signoff lock exists.

## Descriptor Grammar Closure Authority

Previously active wave artifacts:

- `.agent-admin/scope-declarations/wave-mmm-descriptor-grammar-closure-2026-06-30.md`
- `modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md`
- `.agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-grammar-closure-2026-06-30.md`
- `.agent-admin/builder-appointments/wave-mmm-descriptor-grammar-closure-2026-06-30.md`

Primary intended implementation files remain:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

Conditional extension only if justified:

- Supabase edge-function or descriptor-learning retrieval logic related to reusable accepted descriptor corrections.

## Descriptor Grammar / Reasoning QA Obligations

Future implementation under the baseline issue #1871 or a successor descriptor-reasoning issue must verify:

1. `are to be clearly defined` is normalised to `are clearly defined` in evidence clauses.
2. `Assessing incentive schemes and measures for their impact on Security` is normalised to `incentive schemes and measures are assessed for their impact on Security`.
3. Instruction wording such as `should be`, `will be`, `shall be`, and `must be` is converted into evidence-state phrasing before maturity-state text is attached.
4. The criterion-specific actor/action/object remains visible and is not replaced with generic policy/control wording.
5. Accepted user descriptor edits are used as future generation examples where learning records are available, or deterministic grammar normalisation covers the observed examples until retrieval is separately wired.
6. Descriptor editing remains available after save until a future explicit signoff lock exists.
7. Verbatim nominal phrases such as `Review and approval of facility design changes...` are reconstructed as `facility design changes are reviewed and approved...`.
8. Learning is not recorded unless the user consents.
9. Descriptor-learning records store the transformation pattern, before/after text, correction category, scope, lifecycle, and consent metadata.
10. Learning retrieval is scoped, ranked, bounded, and tenant-safe.
11. Conflicting descriptor-learning records are not silently merged.
12. If learning retrieval is unavailable, Maturion uses deterministic methodology fallback and does not claim learning was applied.

## Boundary Authority Still Adopted

MMM must continue to treat these artifacts as shared pre-build boundary authority:

- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`

Operating principle:

- ISMS owns public landing, modules overview, public free-assessment entry, marketing routes, subscription, authentication, onboarding, dashboard, and entitlement/journey-state handoff.
- MMM owns Maturity Roadmap runtime behavior only after approved ISMS handoff.
- MMM may power assessment, scoring, roadmap logic, and module-specific runtime workflows, but it must not become the ISMS platform shell.
- MMM agent must not build ISMS, PIT, Risk Management, RADAM / Systems Integration, or other module runtime.
- ISMS agent must not build MMM runtime.
- Cross-module linkup must be governed before build.

## Merged Approval Workflow Pre-Build / QA / Alignment Sequence

| Step | PR | Status | Output |
|---:|---|---|---|
| 1 | #1831 | Merged | Approval workflow gap analysis / pre-build alignment |
| 2 | #1833 | Merged | DB/API, notification, lock, audit, and AI learning contract |
| 3 | #1837 | Merged | Level 2 invite modal and approver workspace QA-to-red |
| 4 | #1838 | Merged | Change-summary e-mail and Level 1 response QA-to-red |
| 5 | #1840 | Merged | Level 3 approval expansion QA-to-red |
| 6 | #1842 | Merged | Published maturity model view QA-to-red |
| 7 | #1844 | Merged | Evidence modal harvest/adaptation from MAT QA-to-red |
| 8 | #1845 | Merged | FRS/TRS/Architecture alignment addendum |
| Boundary | #1850 | Merged | Shared ISMS/module boundary linkup authority |
| MMM Boundary | #1854 | Merged | MMM-side boundary pre-build alignment baseline |
| Descriptor Grammar | Issue #1871 | Active | Focused descriptor grammar closure before signoff route build |
| Descriptor Reasoning + Learning | Pre-build branch | Open | CS2-requested reasoning pipeline and governed learning retrieval expansion |

## Boundary-Aligned Pre-Build References

MMM boundary alignment is recorded in addenda under:

- `modules/MMM/00-app-description/platform-boundary-linkup-app-description-addendum.md`
- `modules/MMM/01-ux-workflow-wiring-spec/platform-boundary-linkup-ux-wiring-addendum.md`
- `modules/MMM/02-frs/platform-boundary-linkup-frs-addendum.md`
- `modules/MMM/03-trs/platform-boundary-linkup-trs-addendum.md`
- `modules/MMM/04-architecture/platform-boundary-linkup-architecture-addendum.md`
- `modules/MMM/05-qa-to-red/platform-boundary-linkup-qa-to-red.md`
- `modules/MMM/06-pbfag/platform-boundary-linkup-pbfag-addendum.md`
- `modules/MMM/07-implementation-plan/platform-boundary-linkup-implementation-addendum.md`
- `modules/MMM/08-builder-checklist/platform-boundary-linkup-builder-checklist-addendum.md`
- `modules/MMM/10-builder-appointment/platform-boundary-linkup-builder-contract-addendum.md`

## Linkup QA-to-Red Obligations

Future MMM/ISMS linkup QA-to-red must verify:

1. ISMS public landing routes MMM-related entry points to the ISMS-owned public route or approved assessment entry.
2. Public free assessment remains an ISMS-owned acquisition/trust surface unless CS2 explicitly delegates otherwise.
3. Subscription, authentication, onboarding, and dashboard states are preserved where MMM handoff requires them.
4. Eligible users reach MMM runtime/workflow without looping back to subscription, authentication, onboarding, or public assessment unexpectedly.
5. Any MMM-specific host does not expose a duplicate public acquisition loop.
6. Cross-origin local-storage assumptions are not used as proof of journey continuity.
7. MMM runtime does not alter PIT, Risk Management, RADAM, or other module routes.
8. MMM changes do not make MMM the ISMS platform shell by accident.

## Active Build-to-GREEN Constraint

Descriptor reasoning and learning retrieval may proceed only as a focused MMM descriptor runtime lane after pre-build / QA-to-red alignment.

No ISMS public journey, subscription, auth, onboarding, dashboard, entitlement handoff, signoff-route, Vercel workflow, PIT, Risk Management, RADAM, or other module implementation is authorized by the descriptor reasoning / learning expansion.

## Claim Restriction

No completion, release, production-readiness, fully functional, handover, ready-for-review, or merge-ready claim may be made from the descriptor reasoning / learning setup artifacts alone.

## Required Build Sequence

1. Keep the current lane bounded to MMM descriptor reasoning and governed learning retrieval.
2. Use both descriptor QA-to-red artifacts before implementation:
   - `modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md`
   - `modules/MMM/05-qa-to-red/descriptor-reasoning-learning-qa-to-red.md`
3. Preserve IAA pre-brief -> builder appointment -> first implementation commit ordering.
4. Build only the authorized MMM descriptor runtime behaviour to green.
5. Capture Foreman QP after builder implementation.
6. Invoke ECAP/IAA/CS2 review only in the appropriate lane and order.
