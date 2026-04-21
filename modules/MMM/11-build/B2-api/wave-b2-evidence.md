# MMM Wave B2 — Core API: Wave Evidence Artifact

## Wave Header

```
Wave Slug:         mmm-build-wave-b2-core-api
Module:            MMM — Maturity Management Module
Builder:           api-builder
Appointment Ref:   modules/MMM/10-builder-appointment/builder-contract.md §3.2
Issue:             maturion-isms#1428
Branch:            copilot/mmm-stage-12-build-execution-evidence
Date Completed:    2026-04-21
Status:            COMPLETE
```

---

## 1. Edge Functions Created (6 total)

| # | Function Name | Path | Route | JWT Required |
|---|---------------|------|-------|-------------|
| 1 | `mmm-health` | `supabase/functions/mmm-health/index.ts` | GET /api/health | No (public) |
| 2 | `mmm-qiw-status` | `supabase/functions/mmm-qiw-status/index.ts` | GET /api/qiw/status | Yes (ADMIN/LEAD_AUDITOR) |
| 3 | `mmm-org-update` | `supabase/functions/mmm-org-update/index.ts` | PUT /api/organisations/:id | Yes (ADMIN only) |
| 4 | `mmm-invitation-create` | `supabase/functions/mmm-invitation-create/index.ts` | POST /api/invitations | Yes (ADMIN only) |
| 5 | `mmm-invitation-accept` | `supabase/functions/mmm-invitation-accept/index.ts` | POST /api/invitations/accept | No (token-based) |
| 6 | `mmm-commissioning-check` | `supabase/functions/mmm-commissioning-check/index.ts` | Internal startup check | No (internal) |

## 2. Shared Middleware Created

| File | Purpose |
|------|---------|
| `supabase/functions/_shared/mmm-auth.ts` | `validateJWT`, `requireRole`, `jsonResponse`, `corsHeaders` |

## 3. Config Updated

`supabase/config.toml` — all 6 functions registered with correct `verify_jwt` settings.

## 4. Test Results — 28/28 PASS

### D6: Roles & Permissions (T-MMM-S6-113–120) — 8/8 PASS

| Test ID | Description | Result |
|---------|-------------|--------|
| T-MMM-S6-113 | ADMIN role required for org operations | ✅ PASS |
| T-MMM-S6-114 | JWT validation middleware present in all auth-required functions | ✅ PASS |
| T-MMM-S6-115 | Invitation create requires ADMIN role | ✅ PASS |
| T-MMM-S6-116 | Invitation accept is token-based (no JWT) | ✅ PASS |
| T-MMM-S6-117 | Role scope enforcement — requireRole defined in shared auth | ✅ PASS |
| T-MMM-S6-118 | HTTP 403 returned for insufficient scope (NBR-002) | ✅ PASS |
| T-MMM-S6-119 | JWT claims parsed correctly (userId, orgId, role) | ✅ PASS |
| T-MMM-S6-120 | Org-scoped permission checks enforced in mmm-org-update | ✅ PASS |

### D10: Infrastructure / B2 subset (T-MMM-S6-153–160) — 8/8 PASS

| Test ID | Description | Result |
|---------|-------------|--------|
| T-MMM-S6-153 | Health endpoint returns correct shape | ✅ PASS |
| T-MMM-S6-154 | Commissioning check defines all 5 gates (CHK-001–005) | ✅ PASS |
| T-MMM-S6-155 | Edge Function startup env var validation | ✅ PASS |
| T-MMM-S6-156 | All 6 function files present at expected paths | ✅ PASS |
| T-MMM-S6-157 | Shared auth middleware file exists | ✅ PASS |
| T-MMM-S6-158 | config.toml registers all 6 functions | ✅ PASS |
| T-MMM-S6-159 | JWT-required functions have verify_jwt = true | ✅ PASS |
| T-MMM-S6-160 | Public functions have verify_jwt = false | ✅ PASS |

### D11: Product Identity & Governance / B2 subset (T-MMM-S6-165–176) — 12/12 PASS

| Test ID | Description | Result |
|---------|-------------|--------|
| T-MMM-S6-165 | QIW dashboard endpoint defined and structured | ✅ PASS |
| T-MMM-S6-166 | Audit log write path in mmm-health (HEALTH_CHECK) | ✅ PASS |
| T-MMM-S6-167 | Audit log write path in mmm-org-update (ORG_UPDATE) | ✅ PASS |
| T-MMM-S6-168 | All functions use Deno-compatible ESM (esm.sh) | ✅ PASS |
| T-MMM-S6-169 | NBR-001 cache invalidation comments in mutation functions | ✅ PASS |
| T-MMM-S6-170 | NBR-002 HTTP 403 enforcement documented in invitation-create | ✅ PASS |
| T-MMM-S6-171 | Health function references version string 1.0.0 | ✅ PASS |
| T-MMM-S6-172 | Commissioning check returns PASS/FAIL status field | ✅ PASS |
| T-MMM-S6-173 | Invitation accept validates expiry and email match | ✅ PASS |
| T-MMM-S6-174 | Invitation create generates token via crypto.randomUUID() | ✅ PASS |
| T-MMM-S6-175 | Invitation create sets expiry to now + 7 days | ✅ PASS |
| T-MMM-S6-176 | QIW status endpoint restricts to ADMIN or LEAD_AUDITOR | ✅ PASS |

**Total: 28 PASS / 0 FAIL / 0 SKIP**

---

## 5. NBR Compliance

### NBR-001: TanStack Query Cache Invalidation (B3 wiring)

**Status: NOTED for B3**

Cache invalidation comments present in all mutation functions:
- `supabase/functions/mmm-org-update/index.ts` — comment: `// NBR-001: B3 UI must invalidate ['organisations'] query cache after this mutation`
- `supabase/functions/mmm-invitation-create/index.ts` — comment: `// NBR-001: B3 UI must invalidate ['organisations'] query cache after this mutation`

B3 UI builder MUST honour these comments and implement `queryClient.invalidateQueries(['organisations'])` after successful mutations.

### NBR-002: HTTP 403 for Insufficient Role (ADMIN-only enforcement)

**Status: ENFORCED**

`mmm-invitation-create` returns HTTP 403 (not 500, not silent failure) in two cases:
1. Caller's role is not ADMIN → `requireRole(claims.role, ['ADMIN'])` throws `Response { status: 403 }`
2. Caller's orgId does not match target organisation_id → explicit `jsonResponse({ error: '...' }, 403)`

`mmm-org-update` enforces the same pattern for org mutations.

Verified by T-MMM-S6-118 and T-MMM-S6-120.

---

## 6. Architecture Conformance

- All 6 functions use Deno runtime (`Deno.serve`, `Deno.env.get`) ✅
- All imports use `https://esm.sh/@supabase/supabase-js@2` (Deno/ESM compatible) ✅
- No Next.js API routes — pure Supabase Edge Functions ✅
- Cold-start env var validation (`console.log` at module level) per existing pattern ✅
- CORS preflight handled in all functions ✅

---

## 7. Wave B2 Closure Declaration

**WAVE B2 STATUS: COMPLETE**

All 6 Wave B2 closure conditions satisfied:

1. ✅ All 6 Edge Function files created at `supabase/functions/mmm-*/index.ts`
2. ✅ Shared auth middleware at `supabase/functions/_shared/mmm-auth.ts`
3. ✅ `supabase/config.toml` updated with all 6 functions
4. ✅ D6 test subset GREEN (T-MMM-S6-113–T-MMM-S6-120) — 8/8 PASS
5. ✅ D10 B2 subset GREEN (T-MMM-S6-153–T-MMM-S6-160) — 8/8 PASS
6. ✅ D11 B2 subset GREEN (T-MMM-S6-165–T-MMM-S6-176) — 12/12 PASS
7. ✅ NBR-001 cache invalidation comments present in mutation functions
8. ✅ NBR-002 HTTP 403 enforcement verified (T-MMM-S6-118, T-MMM-S6-120)
9. ✅ Wave evidence artifact committed

Builder: api-builder | Date: 2026-04-21 | Total tests: 28/28 GREEN
