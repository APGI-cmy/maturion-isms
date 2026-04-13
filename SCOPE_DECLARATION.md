# SCOPE_DECLARATION — Session 057 (CodexAdvisor-agent) — Wave agent-contract-wave-record-model

**Session**: session-057-20260413
**Wave**: agent-contract-wave-record-model
**Issue**: maturion-isms — [CODEXADVISOR WAVE] Update agent contracts for single-file assurance artifact model
**Branch**: copilot/update-agent-contracts-model
**Date**: 2026-04-13
**Authority**: CS2 issue (follow-up to PRs #1348, #1349)

---

## Files Changed in This Wave

- `SCOPE_DECLARATION.md` - Root scope declaration for session-057 (this file)
- `.github/agents/independent-assurance-agent.md` — IAA contract: wave record model alignment, standalone artifact prohibitions (v2.5.0→v2.6.0)
- `.github/agents/foreman-v2-agent.md` — Foreman contract: wave record references, scope declaration gate (v2.11.0→v2.12.0)
- `.github/agents/execution-ceremony-admin-agent.md` — Ceremony-admin contract: prohibited list, evidence checks (v1.0.0→v1.1.0)
- `.github/agents/governance-liaison-isms-agent.md` — Liaison contract: restricted write_access, assurance path prohibition (v3.3.0→v3.4.0)
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-057-20260413.md` - CodexAdvisor PREHANDOVER proof
- `.agent-workspace/CodexAdvisor-agent/memory/session-057-20260413.md` - CodexAdvisor session memory for session-057

**Total declared files**: 7

## Implementation Status

All 4 agent contracts updated for single-file assurance artifact model:
- Standalone prebrief/token/rejection patterns replaced with iaa-wave-record-{wave}-{date}.md
- Prohibitions added for standalone artifact creation
- Governance-liaison write path restricted from .agent-admin/** to .agent-admin/governance/**
- Scope declaration gate added to Foreman Phase 2 Step 2.7
- All 4 files pass QP S1-S9 and are under 30,000 character limit
