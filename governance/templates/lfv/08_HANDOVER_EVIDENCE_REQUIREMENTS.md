# 08 — Handover Evidence Requirements

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §7 | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |
| Deployment URL | [URL] |
| Head SHA | [PR head commit SHA] |
| Authenticated Role | [role used during verification] |

---

## 1. Required Evidence Artifact Checklist

All artifacts must be present before handover is claimed.

| Artifact | Description | Present? | Artifact URL |
|----------|-------------|----------|-------------|
| Screenshot | Full-page or viewport screenshot of the verified state | [ ] Yes / [ ] No | [URL] |
| Browser console log | All console output during verification run | [ ] Yes / [ ] No | [URL] |
| Network log | HAR file or equivalent capturing all HTTP requests | [ ] Yes / [ ] No | [URL] |
| Playwright trace | Trace zip for reproducing the verification run | [ ] Yes / [ ] No | [URL] |
| Workflow run URL | GitHub Actions run that produced the above artifacts | [ ] Yes / [ ] No | [URL] |
| Deployment URL | The live/preview URL that was verified | [ ] Yes / [ ] No | [URL] |
| PR / head SHA | The commit SHA deployed and verified | [ ] Yes / [ ] No | [SHA] |
| Authenticated role | The user role used during verification | [ ] Yes / [ ] No | [role name] |

---

## 2. Gate Evidence Summary

| Gate ID | Evidence Type | Evidence Present? | Evidence Link | Gate Status |
|---------|---------------|-------------------|--------------|-------------|
| `DEPLOYED_SHA_MATCH` | `LIVE_RUNTIME` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `TEST_IDENTITY_READY` | `CI_TEST` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `VERCEL_BYPASS_READY` | `CONFIG` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `LIVE_VERIFICATION_WORKFLOW_READY` | `CI_TEST` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `NO_DEAD_CTA` | `LIVE_E2E` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `DASHBOARD_STATE_REFLECTION_PROVEN` | `LIVE_E2E` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `ARTIFACTS_ATTACHED` | `ARTIFACT` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |
| `CS2_UI_ACCEPTANCE_READY` | `LIVE_RUNTIME` | [ ] Yes / [ ] No | [link] | [ ] PASS / [ ] FAIL |

**All 8 gates passed**: [ ] Yes / [ ] No

---

## 3. IAA Three-Tier Verdict Summary

| Tier | Verdict Field | Value | Basis |
|------|--------------|-------|-------|
| 1 — Admin correctness | `ADMIN_PASS` | yes / no | Governance ceremony artifacts present and correct |
| 2 — Code correctness | `CODE_PASS` | yes / no | All CI tests pass; build succeeds; no linter errors |
| 3 — Live functional verification | `FUNCTIONAL_PASS` | yes / no | All 8 LFV gates pass; deployed evidence present |

**Overall verdict**: [ ] FULL_FUNCTIONAL_DELIVERY (all three: yes) / [ ] PARTIAL_FUNCTIONAL_DELIVERY / [ ] REJECTION

---

## 4. Handover Readiness

| Check | Status |
|-------|--------|
| All 8 required evidence artifacts present | [ ] Yes / [ ] No |
| All 8 LFV gates: PASS | [ ] Yes / [ ] No |
| ADMIN_PASS: yes | [ ] Yes / [ ] No |
| CODE_PASS: yes | [ ] Yes / [ ] No |
| FUNCTIONAL_PASS: yes | [ ] Yes / [ ] No |
| CS2 UI acceptance checklist signed | [ ] Yes / [ ] No |

**Handover verdict**: [ ] READY FOR IAA FINAL ASSURANCE / [ ] NOT READY — [list blocking items]

---

## 5. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| Status | DRAFT / FINAL |
