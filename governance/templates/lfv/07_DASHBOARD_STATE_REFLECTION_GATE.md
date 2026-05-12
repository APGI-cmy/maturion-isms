# 07 — Dashboard State Reflection Gate

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §6 (DASHBOARD_STATE_REFLECTION_PROVEN, NO_DEAD_CTA gates) | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |

---

## 1. Dashboard / Page Under Verification

| Field | Value |
|-------|-------|
| Dashboard / page name | [e.g. "MAT Assessment Dashboard", "PIT Threat List"] |
| URL | [/dashboard or https://...] |
| Authentication required | [ ] Yes / [ ] No |
| Role required | [admin / member / viewer / N/A] |

---

## 2. Expected State After Authenticated User Journey

Describe the exact expected state of the dashboard/page after the user journey in `01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md` is complete:

| Element | Expected State Before Journey | Expected State After Journey |
|---------|------------------------------|------------------------------|
| [e.g. record count] | [0 records] | [1 record added by test action] |
| [e.g. status badge] | [PENDING] | [ACTIVE] |
| [e.g. chart/graph] | [empty] | [reflects submitted data] |
| [e.g. notification] | [none] | [success toast visible] |

---

## 3. DASHBOARD_STATE_REFLECTION_PROVEN Evidence Requirements

All of the following must be captured to prove dashboard state reflection:

| Evidence Type | Description | Captured? |
|---------------|-------------|-----------|
| Screenshot (before) | Full-page screenshot before user action | [ ] Yes / [ ] No |
| Screenshot (after) | Full-page screenshot after user action | [ ] Yes / [ ] No |
| Network log | Shows the data fetch request after action (HTTP 200 with expected response body) | [ ] Yes / [ ] No |
| Supabase evidence (optional) | Database query result confirming data was persisted | [ ] Yes / [ ] No |

---

## 4. NO_DEAD_CTA Evidence

For each CTA on the dashboard, confirm it is functional:

| CTA / Button / Link | HTTP Status Observed | Response Body (excerpt) | Status |
|--------------------|---------------------|------------------------|--------|
| [CTA label] | [200/201/204/4xx/5xx] | [first 100 chars of response] | [ ] PASS / [ ] FAIL |
| [CTA label] | [status] | [body] | [ ] PASS / [ ] FAIL |

---

## 5. Gate Verdicts

| Gate | Evidence | Verdict |
|------|----------|---------|
| `NO_DEAD_CTA` | Network log + screenshots showing all CTAs returning expected HTTP responses | [ ] PASS / [ ] FAIL |
| `DASHBOARD_STATE_REFLECTION_PROVEN` | Before/after screenshots + network log showing data fetch | [ ] PASS / [ ] FAIL |

---

## 6. Artifact Links

| Artifact | URL |
|----------|-----|
| Screenshot (before) | [artifact URL] |
| Screenshot (after) | [artifact URL] |
| Network log | [artifact URL] |
| Supabase evidence | [artifact URL or N/A] |

---

## 7. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| CS2 verified | [ ] Yes |
| Status | DRAFT / FINAL |
