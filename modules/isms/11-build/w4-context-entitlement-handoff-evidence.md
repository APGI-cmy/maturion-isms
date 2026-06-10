# ISMS W4 Build Evidence — Shared Context, Entitlement, MMM Handoff

| Field | Value |
|---|---|
| Wave | W4 — Shared Context, Entitlement, MMM Handoff |
| Branch | `foreman/isms-w4-context-entitlement-handoff` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-10 |

---

## Scope delivered

Runtime scope:

- `apps/isms-portal/src/context/IsmsContext.tsx`
- `apps/isms-portal/src/lib/entitlements.ts`
- `apps/isms-portal/src/lib/handoff.ts`
- `apps/isms-portal/src/pages/Dashboard.tsx`
- `apps/isms-portal/src/pages/MaturitySetup.tsx`
- `apps/isms-portal/src/App.tsx`

Governance scope:

- `.agent-admin/builder-appointments/isms-stage11-w4-context-entitlement-handoff-builder-appointment.md`
- `modules/isms/11-build/w4-context-entitlement-handoff-evidence.md`

---

## User journey

The W4 journey supports:

1. authenticated user enters the protected ISMS workspace at `/dashboard`;
2. shared ISMS context reads the local W3 mock checkout state;
3. private module cards show entitlement-aware access state;
4. unsubscribed module access routes to subscription/upgrade path;
5. subscribed maturity roadmap access creates a local MMM handoff payload;
6. `/maturity/setup` renders the protected handoff context;
7. future private module routes remain protected or explanation/upgrade-only.

---

## D5 QA mapping

| Requirement | Evidence |
|---|---|
| W4-001 Shared ISMS context provider/hook | `IsmsContext.tsx` provides entitlement state, refresh and mock grant helpers. |
| W4-002 Entitlement checks for private module access | `entitlements.ts` maps mock subscription state to module entitlements and exposes `hasModuleEntitlement`. |
| W4-003 Unsubscribed module access to explanation/upgrade | Dashboard routes locked module CTA to `/subscribe` with module/source context. |
| W4-004 MMM handoff payload to `/maturity/setup` | Dashboard stores handoff through `createMaturityRoadmapHandoff` / `storeMaturityRoadmapHandoff` before routing to `/maturity/setup`. |
| W4-005 Future module routes reserved/protected | Dashboard presents private module entry cards; non-MMM modules remain explanation/marketing paths until later implementation. |
| W4-006 Handoff audit hook | Not implemented in W4; explicitly deferred to W6 audit/persistence scope. |
| W4-007 D5 RED mapping | This section maps W4 work to D5. |
| W4-008 Evidence | CI/review/build/lint/test evidence remains pending PR checks. |

---

## Known partials

- Entitlements are local mock state derived from W3 checkout context.
- Handoff payload is local storage only.
- No real entitlement store, Supabase persistence, RLS, audit writer or backend function is introduced.
- No private MMM execution engine is invoked.
- W5-W8 remain unappointed and unauthorized.

---

## Non-scope confirmation

W4 does not implement W5 Ask Maturion, W6 backend/persistence/RLS/audit, W7 deployment hardening, or W8 cumulative regression/PBFAG rerun.

---

## Evidence still required before merge

- Build/lint/test results or CI equivalents.
- CI status inspection.
- PR-scoped functional-delivery evidence.
- IAA prebrief/wave record.
- Review conversation disposition.
