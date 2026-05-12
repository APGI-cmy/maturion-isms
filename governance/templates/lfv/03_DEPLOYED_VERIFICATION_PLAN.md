# 03 — Deployed Verification Plan

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4, §6 | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |
| Deployment URL | [preview or live URL] |
| Head SHA | [PR head commit SHA] |

---

## 1. Pre-Verification Setup

Complete all setup steps before running verification:

- [ ] Test user accounts created in target environment (see `05_TEST_IDENTITY_AND_ROLE_MATRIX.md`)
- [ ] Test organisation/tenant data seeded
- [ ] Vercel bypass token configured (see `VERCEL_BYPASS_READY` gate below)
- [ ] Deployed SHA confirmed to match PR head SHA (`DEPLOYED_SHA_MATCH` gate)
- [ ] Live verification workflow configured and triggered

---

## 2. Verification Steps

| Step | Description | Expected State | Gate |
|------|-------------|----------------|------|
| 1 | Navigate to deployed URL with bypass token | HTTP 200; page loads | `DEPLOYMENT_ACCESS`, `VERCEL_BYPASS_READY` |
| 2 | Authenticate as test user | Login succeeds; redirected to dashboard | `TEST_IDENTITY_READY` |
| 3 | [Journey step 1] | [expected state] | `NO_DEAD_CTA` |
| 4 | [Journey step 2] | [expected state] | `USER_JOURNEY_COMPLETE` |
| 5 | Verify dashboard reflects updated state | Dashboard shows expected data | `DASHBOARD_STATE_REFLECTION_PROVEN` |
| 6 | Confirm all artifacts captured | Screenshot, console log, network log, trace | `ARTIFACTS_ATTACHED` |

---

## 3. Gate Pass/Fail Criteria

| Gate ID | Pass Condition | Evidence Required | Status |
|---------|---------------|-------------------|--------|
| `DEPLOYED_SHA_MATCH` | SHA of deployed build equals PR head commit SHA | Deployment log or Vercel dashboard screenshot showing SHA | [ ] PASS / [ ] FAIL |
| `TEST_IDENTITY_READY` | All required test users accessible in target env | Supabase/auth console confirmation | [ ] PASS / [ ] FAIL |
| `VERCEL_BYPASS_READY` | Bypass token returns HTTP 200 via `?x-vercel-protection-bypass=<token>&x-vercel-set-bypass-cookie=samesitenone` | Network log showing 200 response | [ ] PASS / [ ] FAIL |
| `LIVE_VERIFICATION_WORKFLOW_READY` | Workflow exists and has successful run on branch | GitHub Actions run URL | [ ] PASS / [ ] FAIL |
| `NO_DEAD_CTA` | All CTAs/buttons/links produce expected responses | Network log; no 404/500/redirect loops | [ ] PASS / [ ] FAIL |
| `DASHBOARD_STATE_REFLECTION_PROVEN` | Dashboard reflects correct state after journey | Screenshot + network log | [ ] PASS / [ ] FAIL |
| `ARTIFACTS_ATTACHED` | All required artifact files present in workflow run | Artifact download URLs | [ ] PASS / [ ] FAIL |
| `CS2_UI_ACCEPTANCE_READY` | CS2 acceptance checklist completed | Signed `09_CS2_UI_ACCEPTANCE_CHECKLIST.md` | [ ] PASS / [ ] FAIL |

---

## 4. Overall Verdict

| Field | Value |
|-------|-------|
| All 8 gates passed | [ ] Yes / [ ] No |
| FUNCTIONAL_PASS | [ ] Yes / [ ] No |
| Workflow run URL | [URL] |
| Artifacts URL | [URL] |

---

## 5. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| CS2 accepted | [ ] Yes |
| Status | DRAFT / FINAL |
