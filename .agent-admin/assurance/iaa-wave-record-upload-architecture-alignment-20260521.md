# IAA Wave Record — upload-architecture-alignment-20260521

**Wave ID**: upload-architecture-alignment-20260521  
**Date**: 2026-05-21  
**PR**: PENDING  
**Issue**: PENDING — Align upload architecture with Subject Knowledge Domain and Framework / Context Domain strategy  
**Branch**: copilot/align-upload-architecture  
**Producing Agent (expected)**: foreman-v2-agent  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

IAA_PREFLIGHT_BRIEF
PR: PENDING
ISSUE: PENDING
WAVE: upload-architecture-alignment-20260521
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: cbbf059e648cffa7f46bbe886f6843c398935e83

EXPECTED_QA_SCOPE:
- Upload architecture audit for current MMM routes/components/functions
- Legacy upload centre capability mapping
- Role-aware routing and storage target plan across Subject/Context/Framework Source/Evidence planes
- Promotion/approval guardrails aligned with MKD-RAO-001

EXPECTED_FAILURE_MODES:
- Plane conflation between framework-source, subject, context, and evidence uploads
- Role leakage allowing customer uploads into global subject knowledge
- Missing promotion governance from context to subject knowledge
- Ambiguous generic Upload routing with no plane disambiguation

FOREMAN_INSTRUCTIONS:
- Freeze upload-plane routing/storage contract before implementation delegation
- Keep `/frameworks/upload` explicitly classified as Framework Source Upload
- Document first wave selection before any production UI wiring
- Reference `Maturion/strategy/Maturion_knowledge_domains_and_runtime_agent_orchestration_strategy.md`

IAA_WILL_QA:
- Plane separation correctness
- Role authorization boundaries
- Storage and promotion rule clarity
- Presence of explicit first-wave decision and no premature production wiring

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

**Produced by**: independent-assurance-agent  
**Date**: 2026-05-21  
**Action**: PRE-BRIEF  
**Status**: COMPLETE
