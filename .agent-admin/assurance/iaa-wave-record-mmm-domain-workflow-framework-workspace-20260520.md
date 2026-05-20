# IAA Wave Record — MMM Domain Workflow Framework Workspace

**Wave ID**: mmm-domain-workflow-framework-workspace
**Date**: 2026-05-20
**Branch**: copilot/wire-existing-mmm-domain-workflow
**PR**: #1700
**Issue**: #1699 — Connect legacy MMM DomainAuditBuilder workflow into framework workspace
**Authority**: CS2 (@APGI-cmy)
**Mode**: PRE-BRIEF (AMENDED 2026-05-20 — CS2 legacy-target clarification)
**ceremony_admin_appointed**: PENDING
**Phase 0 Build Freeze Status**: LIFTED — PR #1688 merged 2026-05-19T15:08:45Z (alignment artifacts confirmed; follow-up implementation now authorized)

---

## PRE-BRIEF

**Generated**: 2026-05-20
**IAA Session**: IAA-pre-brief-mmm-domain-workflow-framework-workspace-20260520

---

### AMENDMENT — CS2 Clarification (2026-05-20)

**Authority**: CS2 (@APGI-cmy)
**Action**: PRE-BRIEF-AMEND
**Trigger**: CS2 clarification received via Foreman that PR #1700 must explicitly target the legacy MMM components. The domain route `/assessment/framework/domain/:domainId` must use `apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx` as the primary legacy source target for reuse/adaptation. Generic data-rendering approaches that bypass the legacy workflow intent are **not acceptable** and will trigger REJECTION-PACKAGE.

**Authoritative legacy reuse/adaptation targets**:
```
apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx       ← PRIMARY (domain-level page)
apps/maturion-maturity-legacy/src/pages/AssessmentFramework.tsx
apps/maturion-maturity-legacy/src/components/assessment/MPSSelectionModal.tsx
apps/maturion-maturity-legacy/src/components/assessment/IntentCreator.tsx
apps/maturion-maturity-legacy/src/components/assessment/CriteriaManagement.tsx
apps/maturion-maturity-legacy/src/components/assessment/AIGeneratedCriteriaCards.tsx
apps/maturion-maturity-legacy/src/components/ai/EnhancedCriteriaGenerator.tsx
apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts     ← PRIMARY hook
apps/maturion-maturity-legacy/src/hooks/useMPSManagement.ts
apps/maturion-maturity-legacy/src/hooks/useAIMPSGeneration.ts
apps/maturion-maturity-legacy/src/hooks/useIntentGeneration.ts
apps/maturion-maturity-legacy/src/hooks/useDeferredCriteria.ts
apps/maturion-maturity-legacy/src/hooks/useStepStatusManagement.ts
```

**Scope impact**: This amendment sharpens — not broadens — the wave scope. The implementation approach is now required to be legacy-source-rooted rather than greenfield. QA scope, failure modes, and foreman instructions have been updated accordingly below.

---

### Step 0.2 Output (Canonical)

```
Qualifying tasks:
  1. Wire DomainWorkspacePage (/assessment/framework/domain/:domainId) by reusing/adapting
     the legacy MMM domain workflow. `apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx`
     is the PRIMARY legacy source for the domain-level page; `useDomainAuditBuilder.ts` is the
     primary legacy hook. Builder MUST study and adapt these legacy sources rather than writing
     a generic data-fetching implementation. The legacy component/hook list in the CS2 amendment
     above is authoritative for reuse/adaptation scope. The delivered page must surface actionable
     MPS list, intent statements, and criteria steps from mmm_maturity_process_steps + mmm_criteria
     tables, using the legacy workflow patterns as the structural guide.
  2. Preserve the five-domain page (AssessmentFrameworkHandoffPage) — five canonical domain cards
     must remain intact and tests T-MMM-S6-183 through T-MMM-S6-188 must stay GREEN.
  3. Restore contextually-aware back navigation: DomainWorkspacePage → framework workspace
     at /assessment/framework?framework_id=:id (not /frameworks generic fallback).
  4. Add tests for the wired domain workflow (unit + integration, RED→GREEN).
  5. Add functional evidence (per wave-execution-standard.md v1.2.0 requirements).
  6. Update modules/MMM/BUILD_PROGRESS_TRACKER.md with the manual finding and wave record.
  7. Verify Stage 2, Stage 5, and Stage 6 artifacts authorize the runtime changes before
     implementation proceeds.

Applicable overlay:
  PRIMARY: PRODUCT_BUILD_ASSURANCE
    — This is a product-facing BUILD/T2 wave claiming functional delivery of the
      domain workflow UI. PRODUCT_BUILD_ASSURANCE_STANDARD.md MUST be loaded and applied.
  SECONDARY: PRE_BUILD_STAGE_MODEL
    — BUILD_PROGRESS_TRACKER.md (modules/MMM/) will be modified; PRE_BUILD_GATES overlay
      (OVL-PBG-001 through OVL-PBG-019) applies at handover for the tracker update.
  ALSO APPLICABLE: GOVERNANCE_EVIDENCE
    — OVL-GE-001 through OVL-GE-004 apply; all evidence must be runtime-fidelity-appropriate.

Anti-regression obligations: YES
  — NBR-001 (FUNCTIONAL-BEHAVIOUR-REGISTRY.md): Any useMutation call must invalidate
    affected TanStack query cache via onSuccess/onSettled → queryClient.invalidateQueries.
    Applies if this wave introduces any write operations (mutation unlikely for read-only
    wiring, but must be checked against the actual diff).
  — NBR-003 (FUNCTIONAL-BEHAVIOUR-REGISTRY.md): Zustand store slices used in the domain
    workspace flow must have explicit reset/cleanup on route exit or resource change.
    Stage 5 Architecture §A3.4 (Zustand state management) governs store design.
  — T-MMM-S6-183 through T-MMM-S6-188 (build-to-green-5domain-workspace-20260519):
    Five-domain canonical workspace anti-regression — AssessmentFrameworkHandoffPage must
    continue to render exactly five domain cards. These tests must remain GREEN throughout.
  — T-MMM-S6-051 (qa-to-red-catalog.md): Criterion Drill-Down Navigable From
    Domain→MPS→Criterion — this Stage 6 test directly covers the journey this wave
    implements. Must be addressed (or explicitly noted if this wave only goes to MPS level
    with criteria as a declared next step).
```

---

IAA_PREFLIGHT_BRIEF
PR: #1700
ISSUE: #1699 — Connect legacy MMM DomainAuditBuilder workflow into framework workspace
WAVE: mmm-domain-workflow-framework-workspace
BRANCH: copilot/wire-existing-mmm-domain-workflow
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/memory/session-mmm-domain-workflow-framework-workspace-20260520.md
CURRENT_HEAD_SHA: 3068f77b6c3699219bd563fec8c0aa50bd7cf1ac
CURRENT_HEAD_SHA_CONTEXT: historical closure snapshot for the final review handoff point before documentation-only readiness updates
PHASE_0_FREEZE_STATUS: LIFTED (PR #1688 merged 2026-05-19)

EXPECTED_QA_SCOPE:
- Product scope: `apps/mmm/src/pages/DomainWorkspacePage.tsx`, `apps/mmm/src/components/assessment/{DomainAuditBuilder,MPSSelectionModal,IntentCreator,CriteriaManagement}.tsx`, `apps/mmm/src/hooks/useDomainAuditBuilder.ts`, `modules/MMM/tests/B4-framework/b4-framework.test.ts`, `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`.
- Governance scope: `.admin/prs/pr-1700.json`, `.agent-admin/scope-declarations/pr-1700.md`, `.agent-workspace/foreman-v2/memory/session-mmm-domain-workflow-framework-workspace-20260520.md`, `.agent-admin/assurance/iaa-wave-record-mmm-domain-workflow-framework-workspace-20260520.md`, `modules/MMM/BUILD_PROGRESS_TRACKER.md`.
- Behavioural scope: legacy-rooted adaptation from `apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx` and `apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts`; five-domain anti-regression; back-navigation preservation; current-head CI/gate coherence.

EXPECTED_FAILURE_MODES:
- POLC unresolved-role failure if the current diff contains implementation files without PR-changed Foreman session-memory evidence establishing a governed FOREMAN role.
- Builder-involvement failure if no PR-changed session memory or PREHANDOVER artifact proves explicit builder delegation with preflight scope.
- Identity-binding failure if active artifacts continue to show `issue: null` / `Issue: PENDING` instead of Issue `#1699`.
- Stale-current-head failure if active governance artifacts reference an earlier branch head instead of closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`.
- Execution-model drift if the PR is reframed as a builder-shortcut wave instead of the declared foreman-orchestrated model.
- Product-proof failure if legacy workflow delivery is claimed without legacy-traceability, five-domain regression proof, back-navigation proof, and behavioural tests.

FOREMAN_INSTRUCTIONS:
- Keep the execution model foreman-orchestrated; do not switch to `copilot-builder-role` shortcut framing unless the model is intentionally changed everywhere.
- Refresh active governance artifacts to bind exactly to PR `#1700`, Issue `#1699`, branch `copilot/wire-existing-mmm-domain-workflow`, and closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`.
- Add explicit builder delegation evidence for `ui-builder` and `qa-builder` covering the legacy-target requirement and preflight scope.
- Ensure current-head governance evidence resolves POLC governed-role and builder-delegation expectations without relying on runtime Copilot identity.
- Continue legacy MMM workflow implementation only after current-head governance coherence is restored.

ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS:
- ECAP_REQUIRED: YES at wave closure; not the blocker for continuing implementation right now.
- ECAP_EXPECTED_ARTIFACTS: builder PREHANDOVER proof, builder session memory, functional evidence pack, refreshed PR admin JSON, refreshed per-PR scope declaration, updated `BUILD_PROGRESS_TRACKER.md`, and any ECAP reconciliation summary required at closure.

CURRENT_HEAD_CI_EXPECTATIONS:
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `Preflight Evidence Gate` run `26172567816` completed GREEN.
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `POLC Boundary Validation` run `26172460984` completed GREEN.
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `Stub Detection Check` run `26172460847` completed GREEN.
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `Routing Governance Check` run `26172460985` completed GREEN.
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `CodeQL` run `26172460983` completed GREEN.
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `Deploy MMM Frontend to Vercel` run `26172460670` completed GREEN.
- Closure head `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac`: `MMM Live Dashboard Diagnosis` run `26172460899` pending settlement at the time this closure snapshot was refreshed.
- Current expectation: keep PR/Issue identity binding and builder-delegation evidence coherent as additional product changes land on top of this current head.

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- Foreman owns orchestration, readiness judgment, and IAA invocation.
- Builder owns implementation and builder-authored evidence.
- `ui-builder` is the primary builder for the current legacy workflow adaptation; `qa-builder` owns RED/behaviour coverage where delegated.
- Builder evidence must be explicit and current-head-resolvable; shared Copilot runtime identity is not sufficient.
- Delegation framing must remain legacy-targeted: adapt the existing legacy `DomainAuditBuilder.tsx` workflow into the current MMM route.

IAA_WILL_QA:
- Exact PR `#1700` / Issue `#1699` / closure SHA `3068f77b6c3699219bd563fec8c0aa50bd7cf1ac` identity coherence across active artifacts.
- Foreman-orchestrated POLC evidence and explicit builder delegation evidence.
- Legacy-reuse traceability from legacy `DomainAuditBuilder` / `useDomainAuditBuilder` into current MMM files.
- Five-domain regression, contextual back navigation, test sufficiency, tracker update quality, scope-declaration parity, and current-head product-evidence integrity.
- No final PASS posture unless producer-side evidence is current-head complete and non-contradictory.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## TOKEN

*To be populated by IAA at Phase 4 verdict — handover assurance session.*

---

## REJECTION_HISTORY

*No rejections recorded — wave has not yet reached handover.*
