# Builder Appointment - MMM Descriptor Edit Save and Learning Replay Hotfix

Issue: #1929
Prebuild PR: #1930
Wave: wave-mmm-descriptor-edit-save-learning-replay-hotfix-2026-07-12
Builder: ui-builder
Status: appointed for bounded implementation after merged QA-to-red PR #1930

## Scope

Patch Criteria Management so unsaved descriptor edits cannot be silently overwritten by descriptor regeneration before saving and Maturion learning capture.

## Authorised areas

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- focused MMM tests that validate the descriptor edit / save / regenerate workflow
- PR-scoped delegation evidence only if required by governance gates

## Required behaviour

- If descriptor edits are pending for a criterion, regeneration must not overwrite them.
- The UI must either save edits before regeneration or block regeneration with a clear message instructing the user to save maturity descriptors first.
- The implementation should prefer the safer hotfix: block regeneration when unsaved descriptor edits exist.
- Saving descriptors must remain the path that persists learning consent and replayable learning records.

## Anti-hard-coding instruction

Do not hard-code criterion code `D001.MPS002.C017`, the acronym `DCC`, exact screenshot text, or one corrected descriptor copied into all five levels.

## Required evidence

- A pending descriptor edit blocks regeneration.
- The user receives a clear message to save maturity descriptors first.
- Existing descriptor save and learning consent behaviour remains intact.
- Regeneration still works when no unsaved descriptor edits exist.

## Non-scope

No global Subject Knowledge promotion, AI-provider orchestration, PIT/RADAM/Risk/Incident/APW, ISMS public journey, subscription/auth/onboarding/dashboard, `.github/agents`, Vercel workflows, unrelated Supabase schema work, or non-MMM modules.
