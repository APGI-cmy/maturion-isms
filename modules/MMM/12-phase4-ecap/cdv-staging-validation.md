# MMM CDV Staging Validation — Post-Stage-12 Operational Follow-Up

**Document**: CDV Staging Validation  
**Module**: MMM (Maturity Management Module)  
**Issue**: [maturion-isms#1443](https://github.com/APGI-cmy/maturion-isms/issues/1443)  
**Wave**: mmm-post-stage12-cdv-validation-20260422  
**Branch**: copilot/post-stage-12-deployment-validation  
**Produced by**: foreman-v2-agent v6.2.0 (POLC-Orchestration)  
**Date**: 2026-04-22  
**Prior wave**: mmm-stage12-build-execution-20260420 (PR #1429, merged 2026-04-21, 959/959 tests GREEN)  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-wave-record-mmm-post-stage12-cdv-validation-20260422.md` (SHA b00557a)

---

## UI Build-Correctness Fix (maturion-isms#1496 — 2026-04-28)

**Issue**: [maturion-isms#1496](https://github.com/APGI-cmy/maturion-isms/issues/1496)  
**Root cause confirmed**: B3 UI wave delivered functional page components but omitted the global CSS stylesheet (`apps/mmm/src/index.css`) and its import in `apps/mmm/src/main.tsx`. All deployment workflows passed (transport working), but the deployed product UI was bare/unstyled raw HTML.

**Fix applied**:

| File | Change |
|------|--------|
| `apps/mmm/src/index.css` | **CREATED** — 995-line self-contained CSS design system (CSS reset, custom property tokens, typography, layout, all component classes) |
| `apps/mmm/src/main.tsx` | **UPDATED** — added `import './index.css'` as first import |
| `apps/mmm/src/pages/LandingPage.tsx` | **UPDATED** — full hero section, feature-card grid, CTA strip with CSS classes |
| `apps/mmm/src/pages/TutorialPage.tsx` | **UPDATED** — maturity level cards (Level 1–5) with styled layout |
| `apps/mmm/src/pages/FreeAssessmentPage.tsx` | **UPDATED** — domain cards and radio options with CSS classes (logic intact) |
| `apps/mmm/src/pages/FreeAssessmentResultPage.tsx` | **UPDATED** — styled result card (data-testid="baseline-maturity" preserved) |
| `apps/mmm/src/pages/SignUpPage.tsx` | **UPDATED** — auth card layout with labelled form groups (supabase.auth.signUp intact) |
| `apps/mmm/src/pages/OnboardingPage.tsx` | **UPDATED** — setup card with form groups (/api/organisations, NBR-001 intact) |
| `apps/mmm/src/pages/FrameworkOriginPage.tsx` | **UPDATED** — origin option cards (VERBATIM/GENERATED/HYBRID radio intact) |
| `apps/mmm/src/components/ConnectivityIndicator.tsx` | **UPDATED** — inline style replaced with `.connectivity-indicator` CSS class |
| `modules/MMM/tests/B3-ui/b3-ui.test.ts` | **UPDATED** — added T-MMM-S6-021 anti-regression test (6 assertions) |

**Anti-regression test added**: T-MMM-S6-021 — "Global CSS stylesheet exists and is imported" — asserts:
- `apps/mmm/src/index.css` exists and is non-trivial
- `main.tsx` imports `./index.css`
- `LandingPage.tsx`, `SignUpPage.tsx`, `FreeAssessmentPage.tsx` each use `className=` (not bare HTML)

**Test results after fix**: 65/65 GREEN (59 original T-MMM-S6-001–020 + 6 new T-MMM-S6-021)  
**Build result**: `tsc && vite build` — 0 errors, 0 warnings; `dist/assets/index-*.css` 16.17 kB (gzip 3.33 kB)

**CDV Validation status update**:

| Item | Previous Status | Updated Status |
|------|----------------|----------------|
| CSS bundle produced by build | ⚠️ PENDING | ✅ PASS — `vite build` produces `dist/assets/index-*.css` (16.17 kB gzip 3.33 kB) |
| Preview deployment available | ⚠️ PENDING | ✅ PASS — Vercel preview build succeeded; CSS bundle present in preview |
| Production UI validation | ❌ NOT PRESENT (root cause confirmed) | ⚠️ PENDING POST-MERGE / CS2 validation — production deploy and post-deploy auth smoke test were skipped for this PR |
| Live screenshot evidence | ❌ ABSENT | ⚠️ PENDING — awaiting CS2 post-merge validation of production URL |
| Anti-regression gate | ❌ ABSENT | ✅ T-MMM-S6-021 added — future builds cannot omit CSS and pass CI |

---

## Purpose

This document records the post-Stage-12 CDV (Critical Deliverable Validation) and staging deployment evidence for MMM. It captures:

1. **Static code evidence** for SB-003 sub-gates where derivable from code review (W3)
2. **Live staging validation checklist** with evidence slots for CS2-executed validation (W1, W2, PIT)
3. **12.1 CDV deployment checklist** per Stage 12 governance

---

## SB-003 Wiring Sub-Gates

### SB-003 Overview

SB-003 was the credential provisioning / wiring hard gate in Stage 12. Token provisioning was satisfied by CS2 (2026-04-21). The three wiring sub-gates (W1/W2/W3) document the E2E token authentication chain.

### SB-003-W3 — MMM Edge Functions Send AIMC_SERVICE_TOKEN on Outbound Calls

**Status**: ✅ CODE EVIDENCE PRESENT (static code review — 2026-04-22)

**Evidence source**: `supabase/functions/_shared/mmm-aimc-client.ts` — B7 live wire (integration-builder, merged PR #1429, 2026-04-21)

| Evidence Point | Code Reference | Description |
|----------------|---------------|-------------|
| Token read from Deno env | Line 44: `const AIMC_SERVICE_TOKEN = Deno.env.get('AIMC_SERVICE_TOKEN') ?? '';` | Token sourced exclusively from runtime environment — never hardcoded |
| Base URL from Deno env | Line 42: `const AIMC_BASE_URL = Deno.env.get('AIMC_BASE_URL') ?? '';` | AIMC gateway URL from runtime environment |
| Bearer token sent on every call | Line 114: `'Authorization': \`Bearer \${AIMC_SERVICE_TOKEN}\`` | Every AIMC HTTP call includes Authorization: Bearer header with provisioned token |
| All 9 AIMC operations covered | `callAimc()` is the single outbound path; all 9 AIMC-interfacing functions route through it | No direct LLM calls — all traffic routes through AIMC consumer boundary (OB-1/CG-002) |
| Circuit breaker protection | Lines 120–131: circuit breaker checked before call; fallback returned if OPEN | TR-009 compliance — no hung calls if AIMC unreachable |

**B7 test evidence** (from PR #1429, merged 2026-04-21):
- T-MMM-S6-099: All Nine AIMC Endpoint Paths Callable From MMM → ✅ GREEN
- T-MMM-S6-106: AIMC Calls Include Service-to-Service JWT → ✅ GREEN
- T-MMM-S6-108: AIMC Timeout and Retry Contract Honored → ✅ GREEN

**Static evidence qualification**: Static code review proves that MMM Edge Functions are *coded correctly* to send `AIMC_SERVICE_TOKEN` on all outbound AIMC calls at runtime. Live staging E2E proof (token actually observed in request headers at AIMC gateway boundary) requires CS2 live staging sign-off — see §SB-003-W1/W2 below.

---

### SB-003-W1 — AIMC Gateway Reads AIMC_SERVICE_TOKEN from Runtime Environment

**Status**: ⚠️ PROVISIONED — NOT YET LIVE-TESTED

| Criterion | Status | Notes |
|-----------|--------|-------|
| AIMC_SERVICE_TOKEN provisioned in AIMC Render service (`maturion-mat-ai-gateway-staging`) | ✅ CS2 confirmed (2026-04-21) | CS2 manually provisioned via Render service environment settings |
| AIMC gateway reads from env at startup | ⚠️ PENDING live proof | AIMC gateway source is external to this repo — requires inspection of `maturion-mat-ai-gateway-staging` service config or live request trace |
| Token present in AIMC gateway runtime process | ⚠️ PENDING live proof | Live proof: e.g., AIMC gateway health endpoint returning config summary, or request trace showing token consumed |

**Live validation evidence slot (CS2 action required)**:
- [ ] Render service environment → confirm `AIMC_SERVICE_TOKEN` present in service env vars
- [ ] AIMC gateway log or health response showing token consumed at startup
- [ ] Evidence reference: _______________
- [ ] Date validated: _______________
- [ ] Validated by: _______________

---

### SB-003-W2 — AIMC Gateway Enforces Inbound Token Authentication for MMM-Origin Requests

**Status**: ⚠️ NOT YET PROVEN

| Criterion | Status | Notes |
|-----------|--------|-------|
| Request without Authorization header → rejected (401/403) | ⚠️ PENDING live proof | Requires live HTTP test against AIMC staging endpoint |
| Request with invalid token → rejected (401/403) | ⚠️ PENDING live proof | Requires live HTTP test |
| Request with valid `AIMC_SERVICE_TOKEN` → accepted (2xx) | ⚠️ PENDING live proof | Requires live HTTP test from MMM staging path |

**Live validation evidence slot (CS2 action required)**:
- [ ] Test: `curl -X POST ${AIMC_BASE_URL}/api/ai/health` without Authorization → expect 401
- [ ] Test: `curl -X POST ${AIMC_BASE_URL}/api/ai/health -H "Authorization: Bearer invalid_token"` → expect 401/403
- [ ] Test: `curl -X POST ${AIMC_BASE_URL}/api/ai/health -H "Authorization: Bearer ${AIMC_SERVICE_TOKEN}"` → expect 200/204
- [ ] Request/response log evidence (redacted): _______________
- [ ] Date validated: _______________
- [ ] Validated by: _______________

---

## PIT Runtime Handshake Path

### PIT Configuration Status

| Parameter | Status | Notes |
|-----------|--------|-------|
| `PIT_SERVICE_TOKEN` | ✅ CS2 provisioned (2026-04-21) | Pre-provisioned in Render + Supabase project secrets |
| `PIT_BASE_URL` | ⚠️ PENDING | Live PIT endpoint URL not yet confirmed by CS2 |

### PIT Outbound Send (TR-017 7-Step Handshake)

**Code evidence** — `supabase/functions/mmm-pit-export-send/index.ts` (B6 stub → B7 live wire):

| Step | Code Reference | Status |
|------|---------------|--------|
| Step 1: Validate export record in mmm_pit_exports | Lines 86–103 | ✅ Coded |
| Step 2: Serialize findings to TR-016 JSON schema | Lines 106–145 | ✅ Coded |
| Step 3: Sign payload (HMAC-SHA256 using PIT_SERVICE_TOKEN) | Lines 151–161 | ✅ Coded |
| Step 4: POST to `${PIT_BASE_URL}/api/import/mmm-findings` with Bearer token | Lines 174–183 | ✅ Coded (live path when PIT_BASE_URL configured) |
| Step 5: Handle PIT acknowledgement `{accepted: true, pit_task_id}` | Lines 185–205 | ✅ Coded |
| Step 6: Update mmm_pit_exports: status='SENT', pit_task_id, sent_at | Lines 207–215 | ✅ Coded |
| Step 7: Log to mmm_audit_logs (action_type: 'PIT_EXPORT_SENT') | Lines 217–225 | ✅ Coded |

**Graceful stub behavior** (when `PIT_BASE_URL` not configured):
- Lines 214–215: `console.warn('[mmm-pit-export-send] PIT_BASE_URL not configured — using stub acknowledgement')`
- Returns synthetic `{accepted: true, pit_task_id}` — CI unaffected; staging requires live `PIT_BASE_URL`

**B6/B7 test evidence** (from PR #1429):
- T-MMM-S6-109: PIT Export Payload Matches TR-016 JSON Schema → ✅ GREEN
- T-MMM-S6-110: PIT Export Trigger and Handshake Per TR-017 (7 steps) → ✅ GREEN
- T-MMM-S6-088–090: PIT export status transitions → ✅ GREEN

### PIT Evidence Return (TR-018)

**Code evidence** — `supabase/functions/mmm-pit-evidence-return/index.ts` (B6 stub → B7 live wire):

| TR-018 Criterion | Code Reference | Status |
|------------------|---------------|--------|
| Endpoint: POST /api/evidence/pit-return | Function routing | ✅ Coded |
| Authentication: Supabase service-role JWT from PIT | Lines 51–55 | ✅ Coded (validates Authorization header) |
| Payload validation: pit_export_id, criterion_id, evidence_ref, implementation_status, notes | Lines 57–75 | ✅ Coded |
| Creates mmm_evidence records with source='PIT_RETURN' | Response handling | ✅ Coded |
| Triggers score re-evaluation proposal for criterion | Score trigger logic | ✅ Coded |
| Returns HTTP 201 with evidence_id, returned_at, pit_task_id | Return contract | ✅ Coded |

**B7 test evidence**:
- T-MMM-S6-101: PIT Evidence Return Processed and Linked at Criterion Level → ✅ GREEN
- T-MMM-S6-111: PIT Evidence Return Contract Per TR-018 → ✅ GREEN

### PIT Live Validation Evidence Slots (CS2 action required)

**Authoritative live PIT_BASE_URL**:
- [ ] Live PIT endpoint URL: _______________
- [ ] Confirmed reachable from MMM staging runtime: _______________
- [ ] Date confirmed: _______________

**PIT runtime handshake proof**:
- [ ] PIT_BASE_URL configured in Supabase staging secrets
- [ ] Trigger: Create a MMM assessment, generate findings, trigger PIT export
- [ ] Step 4 evidence: HTTP request log showing POST to `${PIT_BASE_URL}/api/import/mmm-findings` with Bearer token
- [ ] Step 5 evidence: PIT acknowledgement `{accepted: true, pit_task_id: "uuid"}` received
- [ ] Step 6 evidence: `mmm_pit_exports.status` = 'SENT' in Supabase after handshake
- [ ] Step 7 evidence: `mmm_audit_logs` record with `action_type = 'PIT_EXPORT_SENT'`
- [ ] Return path: PIT POST to `${MMM_STAGING_URL}/api/evidence/pit-return` with evidence payload
- [ ] Return receipt: HTTP 201 response with evidence_id, returned_at, pit_task_id
- [ ] Evidence reference (log/screenshot): _______________
- [ ] Date validated: _______________
- [ ] Validated by: _______________

---

## §12.1 CDV Deployment Validation Checklist

Per Stage 12 governance note (`BUILD_PROGRESS_TRACKER.md` §12.1), this checklist records deployment and staging E2E validation.

### A. Frontend Application

| Item | Status | Evidence |
|------|--------|----------|
| React/Vite app exists at `apps/mmm/` | ✅ PR #1429 | Code merged 2026-04-21 |
| App structure: 14+ pages, shared components (J-01–J-15) | ✅ PR #1429 | B3 evidence: `modules/MMM/11-build/B3-ui/wave-b3-evidence.md` |
| Production build succeeds without errors | ⚠️ PENDING live validation | Run `pnpm build` in `apps/mmm/` against staging env |
| App deployed to staging environment | ⚠️ PENDING | Deployment URL not yet documented |
| Deployment URL accessible and functional | ⚠️ PENDING | URL: _______________ |
| UI components render correctly | ⚠️ PENDING | Screenshot evidence: _______________ |
| Multi-page routing works | ⚠️ PENDING | Evidence: _______________ |

**Frontend staging deployment URL**: _______________  
**Date deployed**: _______________  
**Deployed by**: _______________

### B. Backend (Supabase Edge Functions)

| Item | Status | Evidence |
|------|--------|----------|
| 22 Edge Functions exist in `supabase/functions/` | ✅ PR #1429 | B2–B6 evidence in `modules/MMM/11-build/` |
| Database schema deployed (4 migration files, 26 tables) | ⚠️ PENDING staging | Migration files merged; needs staging deploy confirmation |
| Database seeded with test data | ⚠️ PENDING | `supabase/seed-mmm.sql` exists; staging seed confirmation needed |
| API endpoints respond correctly | ⚠️ PENDING | Health check: `GET ${SUPABASE_URL}/functions/v1/mmm-health` → 200 |
| Edge Functions deployed to staging | ⚠️ PENDING | Supabase staging project confirmed: _______________ |
| API URL accessible and functional | ⚠️ PENDING | URL: _______________ |

**Supabase staging project URL**: _______________  
**Migration deployment confirmed**: _______________  
**Date deployed**: _______________

### C. UI-to-Backend Wiring Validation

| Item | Status | Evidence |
|------|--------|----------|
| Frontend can call backend API (CORS OK) | ⚠️ PENDING | Browser network trace: _______________ |
| Authentication flow works (Supabase Auth) | ⚠️ PENDING | Login → JWT → API call evidence |
| Data flows: UI → API → Database → API → UI | ⚠️ PENDING | E2E trace: _______________ |
| Error handling visible in UI | ⚠️ PENDING | Screenshot: _______________ |
| AIMC integration path reachable (SB-003) | ⚠️ PENDING (depends on W1/W2/W3) | After SB-003 E2E proven |
| PIT export path functional (SB-003 + PIT_BASE_URL) | ⚠️ PENDING | After PIT_BASE_URL confirmed |

### D. End-to-End Workflow Demonstration

At least one complete MMM workflow must be demonstrated:

**Recommended golden path for CDV**: GP-001 (Create Organisation + Complete Assessment Round)

| Step | Status | Evidence |
|------|--------|----------|
| 1. Create organisation via MMM UI | ⚠️ PENDING | Screenshot: _______________ |
| 2. Initiate framework compilation | ⚠️ PENDING | Screenshot: _______________ |
| 3. Execute assessment (respond to criteria) | ⚠️ PENDING | Screenshot: _______________ |
| 4. View maturity score and findings | ⚠️ PENDING | Screenshot: _______________ |
| 5. Trigger PIT export (if PIT_BASE_URL available) | ⚠️ PENDING | Request trace: _______________ |
| 6. View AI-generated recommendations | ⚠️ PENDING | Screenshot: _______________ |

**Workflow demonstration evidence**: _______________  
**Date executed**: _______________  
**Executed by**: _______________

---

## Environment Variable Confirmation

| Variable | Configured In | Status | Notes |
|----------|--------------|--------|-------|
| `SUPABASE_URL` | Supabase + Vercel/Render | ⚠️ PENDING staging confirmation | Standard Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase + Vercel/Render | ⚠️ PENDING | Standard Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function secrets | ⚠️ PENDING | Elevated access for Edge Functions |
| `AIMC_BASE_URL` | Supabase project secrets | ✅ CS2 confirmed (2026-04-21) | Staging gateway endpoint confirmed |
| `AIMC_SERVICE_TOKEN` | AIMC Render env + Supabase secrets | ✅ CS2 provisioned (2026-04-21) | Token provisioning satisfied |
| `PIT_BASE_URL` | Supabase project secrets | ⚠️ PENDING | Live PIT endpoint not yet confirmed |
| `PIT_SERVICE_TOKEN` | Render + Supabase secrets | ✅ CS2 provisioned (2026-04-21) | Pre-provisioned |

---

## Health Check Evidence

| Endpoint | Expected Response | Status |
|----------|------------------|--------|
| `GET ${SUPABASE_EDGE_BASE}/mmm-health` | HTTP 200 `{status: "ok", version: "..."}` | ⚠️ PENDING live check |
| `GET ${AIMC_BASE_URL}/api/ai/health` | HTTP 200/204 | ⚠️ PENDING live check |
| `OPTIONS ${AIMC_BASE_URL}/api/ai/health` | HTTP 200/204/405 | ⚠️ PENDING (reachability probe per `checkAimcReachability()`) |

---

## Summary — Evidence State (2026-04-22)

| Category | Static Evidence | Live Evidence | Overall |
|----------|----------------|--------------|---------|
| SB-003-W3 (MMM sends AIMC token) | ✅ CODE CONFIRMED | ⚠️ PENDING CS2 live test | PARTIAL — static OK |
| SB-003-W1 (AIMC gateway reads token) | N/A (external service) | ⚠️ PENDING CS2 live test | PENDING |
| SB-003-W2 (AIMC gateway enforces auth) | N/A (external service) | ⚠️ PENDING CS2 live test | PENDING |
| PIT_BASE_URL confirmed | N/A | ⚠️ PENDING CS2 | PENDING |
| PIT handshake (code) | ✅ 7-step coded, tests GREEN | ⚠️ PENDING live path | PARTIAL — code OK |
| Frontend deployment | ✅ Code merged | ⚠️ PENDING staging deploy | PENDING |
| Backend deployment | ✅ Edge Functions merged | ⚠️ PENDING staging deploy | PENDING |
| CDV E2E workflow | N/A | ⚠️ PENDING live execution | PENDING |

**Action required by CS2 to complete CDV**: Staging deployment + live validation sign-off using the evidence slots above.

---

## References

- `modules/MMM/BUILD_PROGRESS_TRACKER.md` — primary live control document
- `modules/MMM/07-implementation-plan/implementation-plan.md` — Stage 8 wave spine (B1–B9)
- `modules/MMM/07-implementation-plan/convergence-governance-addendum.md` — Stage 8 addendum
- `modules/MMM/11-build/B7-integrations/wave-b7-evidence.md` — B7 boundary integrations evidence (AIMC/PIT live wire)
- `supabase/functions/_shared/mmm-aimc-client.ts` — AIMC client (SB-003-W3 static evidence)
- `supabase/functions/mmm-pit-export-send/index.ts` — PIT export handshake (TR-017)
- `supabase/functions/mmm-pit-evidence-return/index.ts` — PIT evidence return (TR-018)
- PR [#1429](https://github.com/APGI-cmy/maturion-isms/pull/1429) — Stage 12 build execution and evidence (merged 2026-04-21)
- `.agent-admin/assurance/iaa-wave-record-mmm-post-stage12-cdv-validation-20260422.md` — IAA wave record

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Produced by**: foreman-v2-agent v6.2.0 — POLC-Orchestration mode  
**IAA Pre-Brief**: CLEARED (SHA b00557a)
