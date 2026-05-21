# MMM — DomainAuditBuilder Legacy Harvest Recovery Specification

## Status Header

- **Module**: MMM — Maturity Management Module
- **Artifact Type**: Governance RED Recovery / Pre-Build Alignment Addendum
- **Status**: ACTIVE — RED RECOVERY
- **Version**: 1.0.0
- **Date**: 2026-05-21
- **Produced By**: governance-liaison-isms-agent (delegated by foreman-v2-agent)
- **Issue**: [maturion-isms#1722](https://github.com/APGI-cmy/maturion-isms/issues/1722)
- **Branch**: `copilot/red-recovery-legacy-harvest-fix`
- **Follow-up Implementation Issue**: [maturion-isms#1724](https://github.com/APGI-cmy/maturion-isms/issues/1724)

---

## 1) Recorded Failure — PR #1700 / PR #1711

PR #1700 / PR #1711 restored route/data plumbing and partial AI-generation wiring,
but failed legacy behavioural parity for DomainAuditBuilder.

**Failure mode**:
- legacy request was interpreted as build/recreate instead of harvest/adapt;
- delivered DomainAuditBuilder is a thin orchestration shell;
- legacy three-card generation UX was not faithfully restored;
- MPS generation did not visibly respond in live UI testing;
- generated MPS card behaviour, description/intent/rationale, edit, accept/reject, accept-all, and save lifecycle do not match the original user expectation;
- gates passed despite missing the real legacy parity requirement.

---

## 2) Required Classification — DomainAuditBuilder Recovery Scope

### Controlling principle

```txt
Everything after the Get to Know You / framework generation wizard handoff must be classified as LEGACY HARVEST unless explicitly proven not to exist in the legacy source.
```

This is not a redesign issue and not a rebuild issue. The implementation wave is copy/extract/adapt/wire, not recreate.

### HARVEST — must be extracted/adapted from legacy source

- page reached after Get to Know You / framework generation / compile handoff
- page containing the five domain cards
- five domain-card UI and wiring, including mini-dashboard/status/counts/metrics where present in legacy
- domain-card navigation into selected domain workspace
- selected-domain workspace page containing the three creation actions/cards (MPS / Intent / Criteria)
- underlying MPS generation capability, including generated-card output
- underlying intent-generation capability
- underlying criteria-generation capability
- edit / accept / reject / accept-all / save lifecycle where present in legacy
- AI loading / error / response / persistence behaviours where present in legacy
- knowledge-domain / document-ingestion dependency needed for AI generation to receive correct Subject Knowledge Domain and Framework/Context Domain inputs
- legacy `DomainAuditBuilder` page/workflow
- legacy MPS generation card/component behaviour
- legacy MPS generated-card layout
- MPS title + description/intent/rationale display
- edit generated MPS behaviour
- accept/reject generated MPS behaviour
- accept-all generated MPS behaviour
- legacy intent generation workflow
- legacy criteria generation workflow
- legacy generated criteria card behaviour
- visible AI loading/error/result states

### BUILD / ADAPT ONLY — may be changed for current app compatibility

- current MMM route integration
- current Supabase schema mapping
- current AIMC / `mmm-ai-chat` invocation mapping
- auth/header wiring via `getEdgeInvokeHeaders()`
- replacement of missing legacy dependencies such as shadcn/lucide with current MMM primitives
- current-app query invalidation and persistence integration
- tests and governance evidence

### BUILD ONLY IF MISSING

- Any item not found in the legacy source archive may be built only after documenting search evidence and obtaining CS2 approval.

---

## 3) Required Legacy Harvest Manifest (Source of Truth)

The following legacy files are the required source-of-truth harvest set:

- `src/pages/DomainAuditBuilder.tsx`
- `src/components/assessment/MPSSelectionModal.tsx`
- `src/hooks/useDomainAuditBuilder.ts`
- `src/hooks/useAIMPSGeneration.ts`
- `src/hooks/useIntentGeneration.ts`
- `src/components/assessment/IntentCreator.tsx`
- `src/components/assessment/CriteriaManagement.tsx`
- `src/components/assessment/AIGeneratedCriteriaCards.tsx`
- `src/components/ai/EnhancedCriteriaGenerator.tsx`

### Legacy archive presence check (2026-05-21)

- `apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx` — PRESENT
- `apps/maturion-maturity-legacy/src/components/assessment/MPSSelectionModal.tsx` — PRESENT
- `apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts` — PRESENT
- `apps/maturion-maturity-legacy/src/hooks/useAIMPSGeneration.ts` — PRESENT
- `apps/maturion-maturity-legacy/src/hooks/useIntentGeneration.ts` — PRESENT
- `apps/maturion-maturity-legacy/src/components/assessment/IntentCreator.tsx` — PRESENT
- `apps/maturion-maturity-legacy/src/components/assessment/CriteriaManagement.tsx` — PRESENT
- `apps/maturion-maturity-legacy/src/components/assessment/AIGeneratedCriteriaCards.tsx` — PRESENT
- `apps/maturion-maturity-legacy/src/components/ai/EnhancedCriteriaGenerator.tsx` — PRESENT

**Missing-file rule (hard)**:
- If any listed file is missing in the uploaded legacy source archive, that absence must be explicitly recorded in the implementation evidence.
- Missing files must **not** be silently substituted with newly invented behaviour.

---

## 4) Required RED/Parity Test Specification (Follow-up Implementation Wave)

- [ ] Domain workflow renders the three generation cards, not a bare ordered list.
- [ ] MPS card opens/generates visible generated MPS cards.
- [ ] Each generated MPS card shows title plus description/intent/rationale/coverage explanation.
- [ ] Each generated MPS can be edited.
- [ ] Generated MPS can be accepted/rejected individually.
- [ ] Generated MPS can be accepted all at once.
- [ ] AI generation loading state is visible.
- [ ] AI generation error state is visible on the page/modal if invocation fails.
- [ ] Save/confirm persists accepted MPSs and refreshes loaded MPS rows.
- [ ] Intent generation preserves equivalent edit/accept/save lifecycle.
- [ ] Criteria generation preserves generated-card review/accept/save lifecycle.
- [ ] The UI/DOM structure is recognisably derived from the legacy component, with deviations documented.

---

## 5) Hard Instruction for Next Implementation PR (Non-Negotiable)

```txt
The implementation stream must not build a new post-wizard MMM workflow from scratch.
The legacy post-wizard flow is the source of truth.
The correct action is to copy/extract the legacy components, preserve behaviour and wiring, and adapt only the minimum required compatibility boundaries for the current MMM app.

Any deviation from legacy must be documented as:
Legacy behaviour -> harvested/adapted current component -> reason for deviation.
```

No implementation PR may claim legacy restoration unless it proves behaviour parity against the legacy source files.

The legacy file is the source of truth. If the current-app implementation differs from the legacy workflow, the PR must explain the compatibility constraint that forced the difference.

A missing dependency is not permission to rebuild. It is permission only to replace that dependency with an equivalent current-app primitive.

Do not redesign. Do not approximate. Do not replace with a thin shell. Harvest first; adapt only for compatibility.
