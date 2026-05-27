# MMM QA Trace Map — Build-to-Green Runtime Set (2026-05-27)

## Scope
Runtime artifacts used by active MMM routes and edge-function workflows in Wave B4/B4.5.

## Traced Runtime Artifacts (QA-linked)

| Artifact | Runtime Path | QA / Test Link |
|---|---|---|
| `apps/mmm/src/pages/DocumentManagementCenterPage.tsx` | `/dmc` | `T-MMM-DMC-001..008`, `dmc-subject-knowledge-routing.test.ts` |
| `apps/mmm/src/pages/OrganisationContextPage.tsx` | `/organisation-context` | `T-MMM-S6-189`, `T-MMM-S6-197`, `sidebar-context-and-mps-approval.test.ts`, `edge-runtime-fallbacks.test.ts` |
| `apps/mmm/src/components/AuthenticatedAppShell.tsx` | Protected shell + sidebar | `T-MMM-S6-188`, `T-MMM-S6-194`, `T-MMM-S6-195`, `sidebar-context-and-mps-approval.test.ts` |
| `apps/mmm/src/pages/FrameworkOriginPage.tsx` | `/framework-origin` | `T-MMM-S6-196`, `framework-origin-routing.test.ts` |
| `apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx` | `/assessment/framework` | `T-MMM-S6-185`, `framework-handoff-resilience.test.tsx` |
| `apps/mmm/src/pages/DomainWorkspacePage.tsx` | `/assessment/framework/domain/:domainId` | `T-MMM-S6-186`, `T-MMM-S6-190`, `domain-workspace-resilience.test.tsx`, `domain-workflow-behavior.test.tsx` |
| `apps/mmm/src/components/assessment/MPSSelectionModal.tsx` | MPS generation modal | `T-MMM-S6-AI-001`, `T-MMM-S6-199`, `domain-workflow-behavior.test.tsx`, `ai-linkage-fallbacks.test.ts` |
| `apps/mmm/src/components/assessment/IntentCreator.tsx` | Intent generation modal | `T-MMM-S6-AI-002`, `T-MMM-S6-200`, `domain-workflow-behavior.test.tsx`, `ai-linkage-fallbacks.test.ts` |
| `apps/mmm/src/components/assessment/CriteriaManagement.tsx` | Criteria generation modal | `T-MMM-S6-AI-003`, `T-MMM-S6-201`, `domain-workflow-behavior.test.tsx`, `ai-linkage-fallbacks.test.ts` |
| `supabase/functions/mmm-subject-knowledge-list` | DMC inventory | `T-MMM-DMC-002`, routing + fallback tests |
| `supabase/functions/mmm-subject-knowledge-upload` | DMC upload | `T-MMM-DMC-005`, routing tests |
| `supabase/functions/mmm-subject-knowledge-reprocess` | DMC reprocess | `T-MMM-DMC-005`, routing tests |
| `supabase/functions/mmm-subject-knowledge-migrate-legacy` | DMC migration check | `T-MMM-S6-190`, matrix + DMC suite |
| `supabase/functions/mmm-ai-chat-user` | user AI route | `T-MMM-S6-199..201`, `ai-linkage-fallbacks.test.ts` |

## Untraced Runtime Artifacts Found

| Artifact | Reason | Action |
|---|---|---|
| `apps/mmm/src/components/AIPageAssistant.tsx` | No imports, no active route usage, no QA mapping | **Removed** |
| `/assessment-framework` route alias | Duplicate of `/assessment/framework`, no QA mapping | **Removed** |
| `/audit/domain/:domainId` route alias | Duplicate of `/assessment/framework/domain/:domainId`, no QA mapping | **Removed** |

## Quarantine Rule Applied
- Runtime artifacts without explicit QA trace are removed from active runtime paths unless promoted with a new QA-to-red gate.

## Verification Gate
- Full B4 suite must pass after cleanup. If any failure appears, cleanup change is rejected.
