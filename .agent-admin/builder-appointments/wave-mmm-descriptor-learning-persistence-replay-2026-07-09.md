# Builder Appointment - MMM Descriptor Learning Persistence and Replay

Issue: #1914
Wave: wave-mmm-descriptor-learning-persistence-replay-2026-07-09
Builder: ui-builder
Status: appointed for bounded implementation after merged QA-to-red PR #1915

## Scope

Implement governed descriptor-learning persistence and replay for MMM maturity descriptors.

The implementation must teach reusable reasoning patterns from consented descriptor edits, not hard-code one criterion or copy/paste one descriptor.

## Authorised areas

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `apps/mmm/src/lib/descriptorReasoning.ts`
- `apps/mmm/src/lib/descriptorLearningRetrieval.ts`
- `apps/mmm/src/lib/descriptorLearningPersistence.ts`
- `supabase/functions/mmm-level-descriptor-save/index.ts`
- focused MMM tests

## Anti-hard-coding instruction

Do not hard-code criterion code `D001.MPS002.C017`, the acronym `DCC`, exact screenshot text, or one corrected descriptor copied into all five levels.

## Required evidence

- accepted consent persists scoped learning metadata;
- declined consent does not persist reusable learning;
- same-criterion regeneration can apply learning;
- similar-criterion regeneration applies only valid scoped learning;
- all five maturity levels are influenced by learned evidence subject without copying one level;
- tenant isolation and conflict exclusion remain enforced.

## Non-scope

No ISMS public journey, subscription/auth/onboarding/dashboard, PIT/RADAM/Risk/Incident/APW, Vercel workflow, `.github/agents`, global Subject Knowledge promotion, or unrelated schema work.
