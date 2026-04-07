# IAA Pre-Brief — Wave F-D3-002 — JWT Bearer Remediation

**Wave**: wave-f-d3-002-jwt-bearer-remediation-20260407
**Issue**: maturion-isms#1272 — [Remediation] POST /api/ai/feedback/approve — enforce CS2 identity on JWT Bearer path (F-D3-002)
**Branch**: copilot/fix-1272-f-d3-002-jwt-bearer-enforce-cs2-identity
**Date**: 2026-04-07
**IAA invocation mode**: PHASE_0_PRE_BRIEF
**Produced by**: independent-assurance-agent (Phase 0 only — no Phase 2–4 verdict issued here)
**CS2 Authorization**: Issue #1272 opened by @APGI-cmy. Valid wave-start authorization.

---

## TOKEN COMPLIANCE FIELD

```
PHASE_B_BLOCKING_TOKEN: IAA-PREBRIEF-wave-f-d3-002-jwt-bearer-remediation-20260407-ACKNOWLEDGED
```

> **Note**: This is the pre-brief acknowledgment token. The final ASSURANCE-TOKEN or
> REJECTION-PACKAGE will be issued in a separate Phase 2–4 invocation after the builder
> delivers the completed work. The builder MUST NOT treat this pre-brief token as a merge
> gate approval — it is not.

---

## 1. Wave Summary

**Security finding**: F-D3-002 (audit CL-11-D3-arc-approval-403-audit-20260405.md)
The `Authorization: Bearer <token>` path on `POST /api/ai/feedback/approve` accepts any
3-part token (e.g., `Bearer a.b.c`) without signature or identity verification.
Since `buildFeedbackPipeline()` constructs the pipeline with `SUPABASE_SERVICE_ROLE_KEY`,
any caller with a structurally valid JWT string can trigger `approve()`/`reject()` with
service-role privileges — bypassing all RLS controls.

**Selected remediation** (CS2-authorized, Option B):
Remove the JWT Bearer authentication path entirely. Require `x-arc-token` exclusively.

---

## 2. Trigger Classification

| Category | Triggered? | Reason |
|----------|-----------|--------|
| AGENT_CONTRACT | NO | No `.github/agents/` files touched |
| CANON_GOVERNANCE | NO | No `governance/canon/` files touched |
| CI_WORKFLOW | NO | No `.github/workflows/` files touched |
| AAWP_MAT / BUILD_DELIVERABLE | **YES — MANDATORY** | `api/ai/feedback/approve.ts` is an AI Centre API endpoint. Changes deliver executable application security behavior. BUILD_DELIVERABLE overlay applies. |
| AGENT_INTEGRITY | NO | No `governance/quality/agent-integrity/` files touched |
| KNOWLEDGE_GOVERNANCE | NO | No Tier 2 knowledge files touched |

**Primary trigger**: `AAWP_MAT` — API security remediation delivering executable behavior to
the AI Centre feedback approval pipeline.

**BUILD_DELIVERABLE overlay**: APPLIES — all BD-TIER-4 (Security) checks are mandatory.

**IAA invocation at handover**: MANDATORY. PHASE_B_BLOCKING — hard gate active.

---

## 3. Security Context (FFA-04 focus)

The threat model for this remediation:

| Vector | Pre-fix | Post-fix (required) |
|--------|---------|-------------------|
| No auth headers | 403 ✅ | 403 ✅ (unchanged) |
| Wrong x-arc-token | 403 ✅ | 403 ✅ (unchanged) |
| Valid x-arc-token | 200 ✅ | 200 ✅ (unchanged) |
| `Authorization: Bearer a.b.c` (any 3-part) | 200 ❌ **SECURITY GAP** | 403 ✅ **required** |
| `Authorization: Bearer validjwt` (real JWT, unsigned) | 200 ❌ **SECURITY GAP** | 403 ✅ **required** |

The builder MUST demonstrate that after the fix, **any Bearer token regardless of format
or validity** returns 403.

---

## 4. FFA Checks Required at Handover

These are the checks IAA will execute in the Phase 2–4 invocation. The builder MUST be
able to satisfy all of them before invoking IAA.

### FFA-01 — Structural Correctness (BLOCKING)

- [ ] `isJwtAuth` variable and block **completely removed** from `api/ai/feedback/approve.ts`
- [ ] The `Authorization: Bearer` comment block completely removed (no lingering dead comments referencing JWT path)
- [ ] The `if (isJwtAuth) { ... }` structural validation block (3-part check) completely removed
- [ ] The combined `if (!isJwtAuth && !isArcTokenAuth)` guard simplified to `if (!isArcTokenAuth)`
- [ ] `authHeader` / `authorization` header read code removed (no longer needed)
- [ ] Handler signature, factory pattern, and `createHandler()` export remain intact
- [ ] `buildFeedbackPipeline()` factory unchanged (service-role key usage is correct for ARC operations)
- [ ] File-level JSDoc comment updated to remove reference to `Authorization: Bearer` dual-path

### FFA-02 — Integration Correctness (BLOCKING)

- [ ] `x-arc-token` authentication path remains fully functional (correct path, exact match, env var lookup)
- [ ] `ARC_APPROVAL_TOKEN` env var lookup unchanged
- [ ] 405 on non-POST method unchanged
- [ ] 400 on invalid body unchanged
- [ ] 200 on successful approve/reject with valid ARC token unchanged
- [ ] 500 on pipeline error unchanged

### FFA-03 — Test Coverage (BLOCKING)

Existing test `W9.4-T-009` covers: no-auth → 403, wrong-token → 403.
The following **new test case is required**:

- [ ] New test: `W9.4-T-011` (or similar): `Authorization: Bearer a.b.c` → 403
  - Must test with a structurally valid 3-part token (e.g., `Authorization: Bearer eyJ.eyJ.sig`)
  - Must test with the minimal structural token (e.g., `Authorization: Bearer a.b.c`)
  - Both must return 403, not 401 or 200
- [ ] (Advisory) New test: `Authorization: Bearer` alone (no token body) → 403
- [ ] All tests in `api/ai/feedback/approve.test.ts` pass: no skipped, no commented-out
- [ ] No test uses `vi.fn()` mock-without-expectation for security-critical paths (factory must not be called when auth fails)

### FFA-04 — Security (BLOCKING — PRIMARY CHECK for this wave)

- [ ] No hardcoded ARC tokens, JWTs, or secrets in test fixtures or production code
- [ ] `SUPABASE_SERVICE_ROLE_KEY` usage remains guarded — only reachable after valid `x-arc-token` auth
- [ ] The pipeline factory (`buildFeedbackPipeline()`) is **never called** before auth check completes
- [ ] Dead code sweep: no commented-out JWT validation logic remaining (dead auth code = future confusion risk)
- [ ] `GAP-017` design note comment (if still present) removed or updated to reflect that JWT path no longer exists
- [ ] No `Authorization` header is read, parsed, or mentioned in active code paths

### FFA-05 — Code Quality (ADVISORY)

- [ ] TypeScript compiles cleanly — `tsc --noEmit` passes for `api/ai/feedback/approve.ts`
- [ ] No unused imports introduced
- [ ] Handler body length reduced (removal of JWT block should visibly reduce LOC)
- [ ] ESLint passes on modified file

### FFA-06 — One-Time Build (BLOCKING)

- [ ] `pnpm test api/ai/feedback/approve.test.ts` passes (all tests green)
- [ ] No test file imports or types removed that are still needed elsewhere
- [ ] `CORE-023 workflow trigger check`: `api/ai/feedback/approve.ts` is referenced in test
  runner configs — vitest picks up the modified test file without path changes

---

## 5. PREHANDOVER Proof Structure Required

The builder (api-builder) MUST produce a PREHANDOVER proof committed to the branch
**before** invoking IAA. The proof MUST contain:

```
session_id: <session number>
date: 2026-04-07 (or actual date)
agent: api-builder
agent_version: <current version>
issue: maturion-isms#1272
wave: wave-f-d3-002-jwt-bearer-remediation-20260407
branch: copilot/fix-1272-f-d3-002-jwt-bearer-enforce-cs2-identity

## Scope Declaration
Files modified:
  - api/ai/feedback/approve.ts (JWT Bearer path removed)
  - api/ai/feedback/approve.test.ts (new Bearer-→-403 test added)

## Security Finding Resolution
F-D3-002: RESOLVED
  - isJwtAuth path removed
  - Structural JWT validation block removed
  - Auth guard simplified to x-arc-token exclusively
  - New test W9.4-T-011 proves Bearer → 403

## Test Evidence
Test run output showing all tests pass:
  - W9.4-T-009: 403 on no-auth, wrong-token — PASS
  - W9.4-T-010: 200 on valid ARC token — PASS
  - W9.4-T-011: 403 on Bearer token (new) — PASS

## Bundle Completeness
  - PREHANDOVER proof: [this file — committed path]
  - Session memory: [.agent-workspace/api-builder/memory/session-NNN-YYYYMMDD.md]
  - Modified source: api/ai/feedback/approve.ts — committed
  - Modified tests: api/ai/feedback/approve.test.ts — committed

## Ripple Assessment
  - api/ai/feedback/pending.ts: SAME JWT BEARER PATTERN EXISTS — see Scope Blocker §6
    Builder must declare whether pending.ts is in-scope or explicitly deferred
  - No agent contracts modified — no AGCFPP-001 ripple
  - No CI/workflow files modified — no merge gate ripple
  - No schema migrations — no RLS ripple

## iaa_audit_token
IAA-session-NNN-wave-f-d3-002-jwt-bearer-remediation-20260407-PASS
(pre-populated reference format — to be verified by IAA Phase 2–4 invocation)
```

---

## 6. Scope Blockers

### BLOCKER-01 (ADVISORY — must be declared): `pending.ts` carries the same F-D3-002 pattern

**Finding**: `api/ai/feedback/pending.ts` implements the **identical** dual-auth pattern:
- `Authorization: Bearer` path accepted with structural-only JWT validation
- Same service-role-key pipeline construction pattern

**Source evidence**:
```
api/ai/feedback/pending.ts:52:  // Authentication: accept either Supabase session JWT (Authorization: Bearer)
api/ai/feedback/pending.ts:60:  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
```

**IAA position**: The declared wave scope covers `approve.ts` only. The builder MUST declare
one of the following in the PREHANDOVER proof:

> **Option A**: `pending.ts` is out of scope for this wave. A separate issue will be raised
> for `pending.ts` remediation (cite issue number).

> **Option B**: `pending.ts` is included in this wave's scope (expand scope with CS2 approval).

**FAILURE TO DECLARE** = IAA will flag as a SCOPE COHERENCE finding at Phase 3. Silence on
this point is not acceptable. The PREHANDOVER proof MUST contain an explicit `pending.ts`
disposition statement.

### BLOCKER-02 (BLOCKING): A-021 — Commit before IAA invocation

Per FAIL-ONLY-ONCE A-021: **all artifacts must be committed to the branch before IAA is
invoked.** IAA verifies the committed branch, not the working tree.

The builder MUST NOT invoke IAA until:
1. `api/ai/feedback/approve.ts` change is committed
2. `api/ai/feedback/approve.test.ts` change is committed
3. PREHANDOVER proof file is committed
4. Session memory file is committed

### BLOCKER-03 (INFORMATIONAL): `GAP-017` design note reference cleanup

The source code contains:
```
// signature verification is intentionally omitted here. Supabase RLS enforces actual auth
// in production; offline/CI tests use structurally valid unsigned tokens. Same contract as
// api/ai/request.ts validateAuthHeader() (see GAP-017 design note).
```

After the JWT path is removed, this comment becomes misleading. The builder must remove or
update this design note comment. Leaving it intact = CORE-007 (no dead/misleading content).

---

## 7. IAA Checklist Preview (Phase 2–4 will execute these)

| Check | Category | Expected at Handover |
|-------|----------|---------------------|
| CORE-018 | Evidence sweep | PREHANDOVER proof + session memory on branch |
| CORE-013 | IAA invocation evidence | iaa_audit_token in PREHANDOVER proof |
| CORE-015 | Session memory | Builder session memory file committed |
| CORE-016 | IAA token file | `.agent-admin/assurance/iaa-token-session-NNN-...md` |
| CORE-021 | Zero-severity tolerance | Any finding = REJECTION-PACKAGE |
| CORE-023 | Workflow integrity | `approve.ts` in test runner paths — verify no breakage |
| CORE-024 | PHASE_B_BLOCKING_TOKEN | Token file must contain non-empty, non-PENDING token |
| BD-000 | User journey trace | Bearer caller gets 403, x-arc-token caller gets 200 |
| BD-015 | RLS policies | Not applicable — no schema changes |
| BD-016 | No hardcoded secrets | ARC_APPROVAL_TOKEN never hardcoded |
| FFA-04 | Security (primary) | JWT Bearer path fully excised, no reachable service-role without ARC token |
| FFA-03 | Test coverage | New test W9.4-T-011 present and passing |
| A-021 | Commit before IAA | All artifacts committed before IAA invoked |
| A-026 | SCOPE_DECLARATION.md | SCOPE_DECLARATION.md updated (if present in repo) |

---

## 8. Builder Appointment

**Appointed builder**: api-builder
**Foreman delegate**: foreman-v2-agent (Issue #1272 assignee)
**CS2 authority**: @APGI-cmy (issue opener)

The api-builder must:
1. Read this pre-brief before beginning
2. Implement the JWT Bearer removal per §4 (FFA checks) above
3. Address BLOCKER-01 (pending.ts declaration) in the PREHANDOVER proof
4. Commit all artifacts per BLOCKER-02 (A-021)
5. Invoke IAA (independent-assurance-agent) via task tool for Phase 2–4 verdict

---

## 9. Qualification Summary

| Field | Value |
|-------|-------|
| Wave qualifies as EXEMPT? | **NO** — executable application security changes |
| IAA required at handover? | **YES — MANDATORY (PHASE_B_BLOCKING)** |
| Trigger category | AAWP_MAT / BUILD_DELIVERABLE |
| Applicable overlays | BUILD_DELIVERABLE (primary), BD-TIER-4 Security |
| Pre-brief status | COMPLETE — builder may proceed |
| Final verdict (this session) | PRE-BRIEF ONLY — no Phase 2–4 verdict issued |

---

*Produced by independent-assurance-agent (Phase 0 — Pre-Brief mode)*
*Authority: CS2 (@APGI-cmy)*
*IAA Version: 6.2.0 | Contract: 2.4.0*
*This pre-brief does not constitute a merge gate approval. Phase 2–4 assurance required.*
