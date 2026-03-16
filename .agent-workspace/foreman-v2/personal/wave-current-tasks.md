# Wave Current Tasks — foreman-v2-agent — Wave Node/CLI Ripple

**Wave**: Wave Node/CLI Ripple — CI/CD workflow Node.js & Supabase CLI version corrections
**Session**: session-wave-node-ripple-20260316
**Date**: 2026-03-16
**Branch**: copilot/update-node-supabase-cli-workflows
**Triggering Issue**: maturion-isms#1121 — "Foreman Orchestration: Ripple Node.js & Supabase CLI version corrections throughout CI/CD workflows"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) with Priority: Critical — constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration → Phase-4-Handover
**IAA Pre-Brief**: PHASE_A_ADVISORY (small CI config ripple; no architecture/production changes)

---

## Wave Scope

Ripple Node.js version 20→22 and verify Supabase CLI tags across all CI/CD workflows.

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-WNR-001 | deploy-mat-ai-gateway.yml: node-version 20→22 | Foreman (CI config) | ✅ COMPLETE |
| 2 | T-WNR-002 | liveness.yml: node-version 20→22 | Foreman (CI config) | ✅ COMPLETE |
| 3 | T-WNR-003 | Scan all workflows for supabase/setup-cli@v2 | Foreman (scan) | ✅ VERIFIED CLEAN |
| 4 | T-WNR-004 | Verify deploy-mat-vercel.yml already on 22 | Foreman (scan) | ✅ VERIFIED |
| 5 | T-WNR-005 | Verify deploy-mat-edge-functions.yml on @v1 | Foreman (scan) | ✅ VERIFIED |
| 6 | T-WNR-IAA | IAA Phase 4 audit + token | independent-assurance-agent | ⏳ R2 INVOKED (R1 REJECTION addressed) |

---

## Re-Anchor Pulse

```yaml
re_anchor_pulse:
  status: IAA_R2_INVOKED
  tasks_done: 5
  tasks_pending: 1
  iaa_prebrief: PHASE_A_ADVISORY
  iaa_assurance_token: PENDING
  session: session-wave-node-ripple-20260316
  date: 2026-03-16
```

---

*Wave authorized by CS2 — maturion-isms#1121. POLC-Orchestration mode. No Foreman implementation.*
