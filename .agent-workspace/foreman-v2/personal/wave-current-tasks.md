# Wave Current Tasks — foreman-v2-agent

Wave: mmm-ai-generation-wiring-20260520
Session ID: session-mmm-ai-generation-wiring-20260520
Date: 2026-05-20
Branch: copilot/wire-legacy-mmm-ai-generation-workflow
Issue: #1710 — PR1700 deferred: complete legacy AI generation wiring for DomainAuditBuilder
PR: #1711
CS2 Authorization: Issue #1710 opened by CS2 (@APGI-cmy) and assigned to Copilot
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-mmm-ai-generation-wiring-20260520.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-mmm-ai-generation-wiring-20260520.md
ceremony_admin_appointed: NO

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-mmm-ai-generation-wiring-20260520.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-20T15:55:13Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes

FOREMAN_DECISIONS:
  DECISION-001: Use mmm-ai-chat edge function for all three AI generation steps (MPS, intent, criteria). Builder constructs structured domain prompts and parses reply field from response.
  DECISION-002: Auth sourced from getEdgeInvokeHeaders() (apps/mmm/src/lib/supabase.ts). No useOrganization hook needed. User context from JWT session claims.
  DECISION-003: AI generate buttons conditional on authenticated session. Handle 401/403 from ADMIN role gate gracefully with user-visible error message.

BUILDER_DELEGATION:
  primary_builder: ui-builder
  scope: apps/mmm/src/components/assessment/ + apps/mmm/src/hooks/ + modules/MMM/tests/
  pre_build_gates: authorized (Stage 5 architecture FROZEN, Stage 6 QA-to-Red COMPLETE, Stages 7-10 COMPLETE)
  iaa_prebrief_path_for_builder: .agent-admin/assurance/iaa-wave-record-mmm-ai-generation-wiring-20260520.md

TASKS:
  1. [BUILDER] Wire useAIMPSGeneration adaptation into MPSSelectionModal (generate/accept/refine/save lifecycle) using mmm-ai-chat + getEdgeInvokeHeaders()
  2. [BUILDER] Wire useIntentGeneration adaptation into IntentCreator (generate/accept/refine/save per MPS) using mmm-ai-chat + getEdgeInvokeHeaders()
  3. [BUILDER] Wire AIGeneratedCriteriaCards + EnhancedCriteriaGenerator adaptations into CriteriaManagement (generate/accept/save) without shadcn/lucide — plain HTML/CSS only
  4. [BUILDER] Extend useDomainAuditBuilder.ts or add companion hooks to carry AI generation state (generating/generated/accepted/error) through the 3-step workflow
  5. [BUILDER] Preserve legacy step order (MPSs → Intent → Criteria); no routing changes
  6. [BUILDER] Add behavior coverage tests for AI generation lifecycle (idle/loading/generated/accept/reject/error/save/reset) for all three steps in modules/MMM/tests/B4-framework/ or B5-assessment/
  7. [BUILDER] Update modules/MMM/BUILD_PROGRESS_TRACKER.md with wave record
  8. [FOREMAN] Phase 4: Appoint ECAP for ceremony bundle; invoke IAA for final assurance
