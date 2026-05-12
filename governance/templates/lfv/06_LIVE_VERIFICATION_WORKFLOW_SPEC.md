# 06 — Live Verification Workflow Spec

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §5 | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |

---

## 1. Workflow File Path

```
.github/workflows/[module]-live-verification.yml
```

Template available at: `governance/templates/lfv/live-verification-workflow.template.yml`

---

## 2. Trigger Conditions

| Trigger | Condition |
|---------|-----------|
| `workflow_dispatch` | Manual trigger with deployment URL input |
| `pull_request` (optional) | On push to branch when paths match `[module]/**` |

---

## 3. Required Secrets

The following secrets must be configured in the GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Required? |
|-------------|-------------|-----------|
| `BYPASS_TOKEN` | Vercel Deployment Protection bypass token | ✅ Required |
| `TEST_USER_EMAIL` | Email address of the test user account | ✅ Required |
| `TEST_USER_PASSWORD` | Password of the test user account | ✅ Required |
| `SUPABASE_URL` | Supabase project URL | ✅ Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Required |
| `[MODULE_SECRET]` | [description] | [ ] Required / [ ] Optional |

⚠️ **These secrets are NOT available in the interactive Copilot coding-agent runtime.** The workflow must run in GitHub Actions.

---

## 4. Runtime Environment

- **Required runtime**: GitHub Actions (`ubuntu-latest`)
- **Alternative**: Other approved automation runtime with access to all declared secrets
- **Prohibited**: Interactive Copilot coding-agent runtime (secrets not available)

---

## 5. Required Output Fields

The workflow must produce all of the following output fields (written to `$GITHUB_STEP_SUMMARY` and/or a verification report file):

| Field | Description | Pass Value | Fail Value |
|-------|-------------|-----------|------------|
| `DEPLOYMENT_ACCESS` | Whether the deployed URL was reachable | `yes` | `no` |
| `LOGIN_SUCCESS` | Whether test user authenticated | `yes` | `no` |
| `DASHBOARD_OR_PAGE_LOAD` | Whether target page loaded | `yes` | `no` |
| `USER_JOURNEY_COMPLETE` | Whether full journey completed | `yes` | `no` |
| `FAILING_REQUEST` | URL of failing request (if any) | `none` | `[URL]` |
| `HTTP_STATUS` | HTTP status of failing request | `200` | `4xx/5xx` |
| `RESPONSE_BODY` | Response body excerpt (if applicable) | `[expected body]` | `[error body]` |
| `CONSOLE_ERROR` | Browser console error (if any) | `none` | `[error message]` |
| `LIKELY_ROOT_CAUSE` | Best-effort root cause | `none` | `[description]` |
| `ARTIFACT_LINKS` | Links to uploaded artifacts | `[artifact URLs]` | `N/A` |

---

## 6. Required Artifacts

Every workflow run must upload the following as GitHub Actions artifacts:

| Artifact | Description | File Pattern |
|----------|-------------|-------------|
| Screenshot | Full-page or viewport screenshot | `*.png` |
| Browser console log | All console.log/error/warn output | `console-*.log` |
| Network log | HAR file or network request log | `*.har` or `network-*.json` |
| Playwright trace | Trace zip for debugging | `trace-*.zip` |
| Verification report | Text report with all output fields | `verification-report.txt` |

---

## 7. LIVE_VERIFICATION_WORKFLOW_READY Gate Criteria

| Check | Pass Condition | Status |
|-------|---------------|--------|
| Workflow file exists | `.github/workflows/[module]-live-verification.yml` is present | [ ] PASS / [ ] FAIL |
| Workflow has run successfully | At least one successful `workflow_dispatch` run on target branch | [ ] PASS / [ ] FAIL |
| All output fields present | Workflow summary contains all 10 required fields | [ ] PASS / [ ] FAIL |
| All artifacts uploaded | All 5 artifact types present in run | [ ] PASS / [ ] FAIL |

**LIVE_VERIFICATION_WORKFLOW_READY gate verdict**: [ ] PASS / [ ] FAIL  
**Workflow run URL**: [GitHub Actions run URL]

---

## 8. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| Status | DRAFT / FINAL |
