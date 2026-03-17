# Wave Current Tasks — foreman-v2-agent — Wave maturion-iaa-bootstrap

**Wave**: maturion-iaa-bootstrap — Adopt standardized Maturion agent bootstrap workflow
**Session**: session-waveiaabootstrap-20260317
**Date**: 2026-03-17
**Branch**: copilot/adopt-standardized-bootstrap-workflow
**Triggering Issue**: maturion-isms — Adopt standardized Maturion agent bootstrap workflow for governance ceremonies
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) — constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration → Phase-4-Handover
**IAA Pre-Brief**: PHASE_B_BLOCKING — artifact at `.agent-admin/assurance/iaa-prebrief-waveiaabootstrap-20260317.md`

---

## Wave Scope

Replace four DISABLED legacy injection workflows with a single comment-triggered
`maturion-iaa-bootstrap.yml` workflow. Add stub agent runner and container scaffolding.

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-IAB-001 | Create maturion-iaa-bootstrap.yml | Copilot coding agent | ✅ COMPLETE |
| 2 | T-IAB-002 | Create .github/scripts/agent-runner.sh stub | Copilot coding agent | ✅ COMPLETE |
| 3 | T-IAB-003 | Remove 4 DISABLED conflicting workflows | Copilot coding agent | ✅ COMPLETE |
| 4 | T-IAB-004 | Create .github/runner/ container scaffolding | Copilot coding agent | ✅ COMPLETE |
| 5 | T-IAB-005 | MATURION_BOT_TOKEN wired in new workflow | Copilot coding agent | ✅ COMPLETE |
| 6 | T-IAB-006 | Write path restriction enforced | Copilot coding agent | ✅ COMPLETE |
| 7 | T-IAB-IAA | IAA Phase 4 audit + token | independent-assurance-agent | ⏳ PENDING |

---

## Re-Anchor Pulse

```yaml
re_anchor_pulse:
  status: IAA_PRE_BRIEF_COMMITTED
  tasks_done: 6
  tasks_pending: 1
  iaa_prebrief: PHASE_B_BLOCKING
  iaa_assurance_token: PENDING
  session: session-waveiaabootstrap-20260317
  date: 2026-03-17
```

---

*Wave authorized by CS2 — issue opened by @APGI-cmy. POLC-Orchestration mode. No Foreman implementation.*
