# 04 — CTA Backend State Map

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4, §6 (NO_DEAD_CTA gate) | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |

---

## Purpose

This map ensures that every user-facing interactive element (CTA, button, link, form submit) has a declared backend target, expected HTTP status, and verifiable database state change. The `NO_DEAD_CTA` gate requires all entries in this map to pass.

---

## 1. CTA / Button / Link Map

| # | UI Label | Route / Page | HTTP Method | Backend Endpoint | Expected HTTP Status | Expected DB State Change | Auth Required | Test Evidence Required |
|---|----------|-------------|-------------|-----------------|---------------------|--------------------------|---------------|----------------------|
| 1 | [button text] | [/page/path] | [GET/POST/PUT/DELETE] | [/api/endpoint] | [200/201/204] | [table.column updated to value] | [ ] Yes / [ ] No | Screenshot + network log |
| 2 | [button text] | [/page/path] | [GET/POST/PUT/DELETE] | [/api/endpoint] | [200/201/204] | [table.column updated to value] | [ ] Yes / [ ] No | Screenshot + network log |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

---

## 2. Navigation Links (Non-Action)

| # | UI Label | Route / Href | Target Page | Expected HTTP Status | Auth Required |
|---|----------|-------------|------------|---------------------|---------------|
| 1 | [link text] | [/path or https://...] | [target page name] | 200 | [ ] Yes / [ ] No |
| ... | ... | ... | ... | ... | ... |

---

## 3. Form Submissions

| # | Form Name | Submit Endpoint | Success Response | Error Response | DB Effect |
|---|-----------|----------------|-----------------|----------------|-----------|
| 1 | [form name] | [POST /api/...] | [HTTP 201 + body shape] | [HTTP 400 + error shape] | [INSERT into table] |
| ... | ... | ... | ... | ... | ... |

---

## 4. Dead CTA Risk Register

List any CTAs/buttons/links that are known risks or require special attention during verification:

| UI Element | Risk | Mitigation |
|-----------|------|------------|
| [element] | [why it might fail — e.g. depends on env variable, auth race condition] | [how to verify it works] |

---

## 5. NO_DEAD_CTA Gate Evidence

After live verification, record the result for each entry:

| # | UI Element | Status | Evidence URL |
|---|-----------|--------|-------------|
| 1 | [element] | [ ] PASS / [ ] FAIL | [network log URL or screenshot] |
| 2 | [element] | [ ] PASS / [ ] FAIL | [network log URL or screenshot] |

**NO_DEAD_CTA gate verdict**: [ ] PASS — all CTAs verified / [ ] FAIL — [list failing CTAs]

---

## 6. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| Status | DRAFT / FINAL |
