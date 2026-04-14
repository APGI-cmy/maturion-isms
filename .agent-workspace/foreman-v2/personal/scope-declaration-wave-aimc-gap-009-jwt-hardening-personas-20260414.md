# Scope Declaration — Wave aimc-gap-009-jwt-hardening-personas-20260414

wave: aimc-gap-009-jwt-hardening-personas-20260414
branch: copilot/aimc-gap-009-harden-jwt-auth
date: 2026-04-14
authority: foreman-v2-agent v6.2.0 | CS2 authorization: issue opened by @APGI-cmy
schema_ref: governance/canon/SCOPE_DECLARATION_SCHEMA.md §5.7

APPROVED_ARTIFACT_PATHS:
- packages/ai-centre/src/agents/mat-advisor.md - Improved mat-advisor persona (Wave 5)
- packages/ai-centre/src/agents/isms-navigator.md - Improved isms-navigator persona (Wave 5)
- packages/ai-centre/src/agents/risk-advisor.md - Improved risk-advisor persona (Wave 5)
- packages/ai-centre/src/agents/xdetect-advisor.md - Improved xdetect-advisor persona (Wave 5)
- packages/ai-centre/src/agents/maturity-roadmap-advisor.md - Improved maturity-roadmap-advisor persona (Wave 5)
- packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts - GAP-009 Supabase persistence (Wave 1, verify)
- packages/ai-centre/supabase/migrations/004_ai_episodic_memory.sql - ai_episodic_events DDL (Wave 1)
- packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts - GAP-009 test evidence (Wave 1)
- packages/ai-centre/src/__tests__/memory/EpisodicMemorySchema.test.ts - Schema test evidence (Wave 1)
- api/ai/feedback/approve.ts - F-D3-002 JWT hardening (Wave 2, verify)
- api/ai/feedback/approve.test.ts - F-D3-002 security test evidence (Wave 2)
- api/ai/wave16.6-jwt-auth.test.ts - JWT auth additional tests (Wave 2)
- packages/ai-centre/src/personas/PersonaLoader.ts - CL-7 PersonaLoader improvements (Wave 4)
- packages/ai-centre/src/types/index.ts - PersonaValidationError type (Wave 4)
- packages/ai-centre/src/__tests__/personas/PersonaLoader.validation.test.ts - CL-7 test evidence (Wave 4)
- governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md - GRS v0.1.0 prepared for CS2 sign-off (Wave 6)
- governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md - CL-6 knowledge inventory update (Wave 3)
- .agent-workspace/foreman-v2/personal/wave-current-tasks-aimc-gap-009-jwt-hardening-personas-20260414.md - Wave governance artifact
- .agent-workspace/foreman-v2/personal/scope-declaration-wave-aimc-gap-009-jwt-hardening-personas-20260414.md - This scope declaration
- .agent-admin/assurance/iaa-wave-record-aimc-gap-009-jwt-hardening-personas-20260414.md - IAA wave record (pre-brief)
- .agent-workspace/foreman-v2/memory/session-aimc-gap-009-jwt-hardening-personas-20260414.md - Session memory (Phase 4)
- .agent-workspace/foreman-v2/memory/PREHANDOVER-session-aimc-gap-009-jwt-hardening-personas-20260414.md - PREHANDOVER proof (Phase 4)
- .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-aimc-gap-009-jwt-hardening-personas-20260414.md - ECAP bundle (Phase 4)
- .agent-workspace/execution-ceremony-admin-agent/bundles/session-aimc-gap-009-jwt-hardening-personas-20260414.md - ECAP session memory (Phase 4)

## Approved Artifact Paths

- `packages/ai-centre/src/agents/mat-advisor.md` - Improved mat-advisor persona (Wave 5)
- `packages/ai-centre/src/agents/isms-navigator.md` - Improved isms-navigator persona (Wave 5)
- `packages/ai-centre/src/agents/risk-advisor.md` - Improved risk-advisor persona (Wave 5)
- `packages/ai-centre/src/agents/xdetect-advisor.md` - Improved xdetect-advisor persona (Wave 5)
- `packages/ai-centre/src/agents/maturity-roadmap-advisor.md` - Improved maturity-roadmap-advisor persona (Wave 5)
- `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts` - GAP-009 Supabase persistence (Wave 1)
- `packages/ai-centre/supabase/migrations/004_ai_episodic_memory.sql` - ai_episodic_events DDL (Wave 1)
- `packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts` - GAP-009 test evidence
- `packages/ai-centre/src/__tests__/memory/EpisodicMemorySchema.test.ts` - Schema test evidence
- `api/ai/feedback/approve.ts` - F-D3-002 JWT hardening (Wave 2)
- `api/ai/feedback/approve.test.ts` - F-D3-002 security test evidence
- `api/ai/wave16.6-jwt-auth.test.ts` - JWT auth tests
- `packages/ai-centre/src/personas/PersonaLoader.ts` - CL-7 PersonaLoader improvements
- `packages/ai-centre/src/types/index.ts` - PersonaValidationError type
- `packages/ai-centre/src/__tests__/personas/PersonaLoader.validation.test.ts` - CL-7 test evidence
- `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` - GRS sign-off prep (Wave 6)
- `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` - CL-6 knowledge inventory update
- `.agent-workspace/foreman-v2/personal/wave-current-tasks-aimc-gap-009-jwt-hardening-personas-20260414.md` - Wave governance
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-aimc-gap-009-jwt-hardening-personas-20260414.md` - This file
- `.agent-admin/assurance/iaa-wave-record-aimc-gap-009-jwt-hardening-personas-20260414.md` - IAA wave record
- `.agent-workspace/foreman-v2/memory/session-aimc-gap-009-jwt-hardening-personas-20260414.md` - Session memory
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-aimc-gap-009-jwt-hardening-personas-20260414.md` - PREHANDOVER proof
- `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-aimc-gap-009-jwt-hardening-personas-20260414.md` - ECAP bundle
- `.agent-workspace/execution-ceremony-admin-agent/bundles/session-aimc-gap-009-jwt-hardening-personas-20260414.md` - ECAP session memory
