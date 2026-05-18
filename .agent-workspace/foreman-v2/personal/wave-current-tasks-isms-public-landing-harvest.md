# Wave Current Tasks — foreman-v2-agent

**Wave**: isms-public-landing-harvest-20260514
**Session ID**: session-isms-public-landing-harvest-20260514
**Date**: 2026-05-14
**Branch**: copilot/harvest-legacy-isms-pages
**PR**: PR #1646
**Issue**: maturion-isms#1645 — Harvest legacy ISMS pre-subscription landing and module marketing pages
**iaa_prebrief_path**: `.agent-admin/assurance/iaa-wave-record-isms-public-landing-harvest-20260514.md`
**iaa_wave_record_path**: `.agent-admin/assurance/iaa-wave-record-isms-public-landing-harvest-20260514.md`
**ceremony_admin_appointed**: TBD — pending IAA pre-brief and builder completion

## Wave Description

This wave delivers:
1. ISMS app description update with Legacy Pre-Subscription Harvest Authority section
2. Pre-build harvest package (10 governance artifacts)
3. Stage-specific files: QA-to-Red, PBFAG, Builder Checklist, IAA pre-brief
4. Legacy UI harvest into isms-portal (delegated to ui-builder)

Legacy source: `apps/maturion-maturity-legacy/src/`
Target app: `apps/isms-portal/src/`

Key constraint: Public/marketing routes MUST remain unauthenticated.

## Outstanding Tasks — Wave: isms-public-landing-harvest-20260514

| # | Task | Executor | Status | Evidence |
|---|------|----------|--------|----------|
| T-1 | Create `.admin/prs/pr-1646.json` | foreman-v2-agent | 🟢 DONE | PR manifest filed |
| T-2 | Create `.agent-admin/scope-declarations/pr-1646.md` | foreman-v2-agent | 🟢 DONE | Scope declaration filed |
| T-3 | Update ISMS app description with legacy harvest section | foreman-v2-agent | 🟡 IN PROGRESS | |
| T-4 | Create pre-build harvest package (9 governance docs) | foreman-v2-agent | 🟡 IN PROGRESS | |
| T-5 | Create Stage 5 QA-to-Red plan | foreman-v2-agent | 🟡 IN PROGRESS | |
| T-6 | Create Stage 6 PBFAG document | foreman-v2-agent | 🟡 IN PROGRESS | |
| T-7 | Create Stage 8 Builder checklist | foreman-v2-agent | 🟡 IN PROGRESS | |
| T-8 | Create Stage 9 IAA pre-brief package | foreman-v2-agent | 🟡 IN PROGRESS | |
| T-9 | Invoke IAA pre-brief | foreman-v2-agent → IAA | 🟡 IN PROGRESS | |
| T-10 | Delegate UI harvest to ui-builder | foreman-v2-agent → ui-builder | 🔴 PENDING | Awaiting pre-build package completion |
| T-11 | QP evaluation of ui-builder delivery | foreman-v2-agent | 🔴 PENDING | Awaiting T-10 |
| T-12 | ECAP/handover ceremony | foreman-v2-agent → ECAP | 🔴 PENDING | Awaiting T-11 |
| T-13 | IAA final assurance | foreman-v2-agent → IAA | 🔴 PENDING | Awaiting T-12 |

---

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE | ❌ BLOCKED
