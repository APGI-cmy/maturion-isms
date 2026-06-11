# ISMS W5 Build Evidence — Ask Maturion Adapter

| Field | Value |
|---|---|
| Wave | W5 — Ask Maturion Adapter |
| Branch | `foreman/isms-w5-ask-maturion-adapter` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-10 |

---

## Scope delivered

Runtime scope:

- `apps/isms-portal/src/lib/aiPromptSeeds.ts`
- `apps/isms-portal/src/lib/askMaturionAdapter.ts`
- `apps/isms-portal/src/lib/askMaturionAdapter.test.ts`
- `apps/isms-portal/src/components/AskMaturionButton.tsx`
- `apps/isms-portal/src/pages/Dashboard.tsx`
- `apps/isms-portal/src/pages/MaturitySetup.tsx`

Governance scope:

- `.agent-admin/builder-appointments/isms-stage11-w5-ask-maturion-adapter-builder-appointment.md`
- `modules/isms/11-build/w5-ask-maturion-adapter-evidence.md`

---

## User journey

The W5 journey supports:

1. user opens Ask Maturion from the dashboard or maturity setup surface;
2. public or non-entitled context receives educational-only guidance;
3. authenticated and entitled module context receives a filtered-context response draft;
4. adapter never calls a live provider in W5;
5. adapter cannot create access or bypass route guards because it reads entitlement state only;
6. empty/failing prompts have a non-blocking fallback response.

---

## D6 QA mapping

| Requirement | Evidence |
|---|---|
| W5-001 Public prompts are educational only | Public prompt seeds are marked educational and adapter returns public fallback when private context is not allowed. |
| W5-002 Authenticated prompts use filtered context | Adapter only includes organisation/sector/goal context after auth and entitlement checks pass. |
| W5-003 AI cannot bypass entitlements or route guards | `canUsePrivateAskContext` requires authentication, module key and entitlement. Adapter does not grant access or navigate. |
| W5-004 Non-blocking fallback | Adapter returns deterministic local fallback text and does not call a live AI provider. |
| W5-005 Prompt seeds exist | `aiPromptSeeds.ts` includes general and module-level seeds. |
| W5-006 Tests | `askMaturionAdapter.test.ts` covers public/private/fallback behavior. |

---

## Known partials

- No live AI provider call is implemented.
- No prompt persistence, Supabase storage, RLS or audit writer is introduced.
- No production prompt logging is introduced.
- W6-W8 remain unappointed and unauthorized.

---

## Non-scope confirmation

W5 does not implement W6 backend/persistence/RLS/audit, W7 deployment hardening, or W8 cumulative regression/PBFAG rerun.

---

## Evidence still required before merge

- Build/lint/test results or CI equivalents.
- CI status inspection.
- PR-scoped functional-delivery evidence.
- IAA prebrief/wave record.
- Review conversation disposition.
