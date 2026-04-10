# Wave Current Tasks — Issue 1326

wave: cl-7-personaloader-improvements-lkiac-l3
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260409.md

## Active Wave: CL-7 (LKIAC-L3 — PersonaLoader Improvements)

### Wave Description
Foreman orchestrates execution of CL-7 PersonaLoader Improvements wave per
concurrent-prebuild-and-legacy-plan.md (Track 1, Section 1.3). This is the canonical
foreman execution issue for CL-7 (maturion-isms#1326, branch: copilot/cl-7-lkiac-l3-personaloader-improvements).

CS2 Authorization: Issue maturion-isms#1326 opened by @APGI-cmy (CS2 = Johan Ras) and assigned to
foreman-v2-agent (Copilot). Issue author is CS2. CS2 wave-start confirmed.

IAA Pre-Brief: `.agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260409.md` (committed ace5912)
Prior Pre-Brief Reference: `.agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260405.md`
IAA Token: `.agent-admin/assurance/iaa-token-session-cl7-personaloader-20260409.md` (committed 466b8c48)
ASSURANCE-TOKEN: IAA-session-cl7-personaloader-20260409-PASS

### Tasks
- [x] CL-7-D1: RED gate tests — PersonaValidationError on invalid YAML front-matter
  (`packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts`)
- [x] CL-7-D2: RED gate tests — persona registry sync CI check integration test
  (`packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts`)
- [x] CL-7-D3: Implementation — PersonaValidationError type + runtime YAML validation
  (`packages/ai-centre/src/personas/PersonaLoader.ts`, `packages/ai-centre/src/types/index.ts`)
- [x] CL-7-D4: CI check — persona registry sync workflow
  (`.github/workflows/persona-registry-sync.yml`)
- [x] CL-7-D5: Scheduled workflow — overdue quarterly persona reviews
  (`.github/workflows/persona-freshness-review.yml`)
- [x] T6: QP evaluation PASS + PREHANDOVER proof committed + SCOPE_DECLARATION PASS
- [x] T7: IAA final audit PASS — ASSURANCE-TOKEN IAA-session-cl7-personaloader-20260409-PASS

### Status
MERGE GATE RELEASED. Awaiting CS2 (Johan Ras / @APGI-cmy) review and approval.
Merge authority: CS2 ONLY.

### Previous Wave (Closed)
wave: optimize-iaa-invocation-workflows (Issue #1311)
