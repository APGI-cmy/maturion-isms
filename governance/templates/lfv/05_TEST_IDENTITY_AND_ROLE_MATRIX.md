# 05 — Test Identity and Role Matrix

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4, §6 (TEST_IDENTITY_READY gate) | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |
| Target Environment | [preview / staging / production] |

---

## 1. Test User Accounts

All test users must be created in the target environment **before** live verification begins.

| # | Email | Role | Organisation / Tenant | Required Permissions | Available in Coding Agent? | Available in GH Actions? | Available in CS2 Manual? | Created? |
|---|-------|------|--------------------|---------------------|---------------------------|--------------------------|--------------------------|----------|
| 1 | [test@example.com] | [admin/member/viewer] | [org name or ID] | [list permissions] | ❌ No | ✅ Yes (secret) | ✅ Yes | [ ] Yes / [ ] No |
| 2 | [test2@example.com] | [role] | [org name or ID] | [list permissions] | ❌ No | ✅ Yes (secret) | ✅ Yes | [ ] Yes / [ ] No |

---

## 2. Test Organisation / Tenant Data

| Field | Value |
|-------|-------|
| Organisation name | [org name used in test] |
| Organisation ID | [UUID or slug] |
| Supabase project URL | [URL] |
| Seeded with test data? | [ ] Yes / [ ] No |
| Data seed script | [path or N/A] |

---

## 3. Required Upload / Test Fixtures

| # | Fixture Name | Description | File Path or Size | Required for Step | Present in Repo? |
|---|-------------|-------------|-------------------|------------------|-----------------|
| 1 | [fixture name] | [what it is] | [path or size limit] | [step # from journey] | [ ] Yes / [ ] No |
| 2 | [fixture name] | [what it is] | [path or size limit] | [step # from journey] | [ ] Yes / [ ] No |

---

## 4. TEST_IDENTITY_READY Gate Evidence

| Check | Status | Evidence |
|-------|--------|----------|
| All test users exist in target environment | [ ] PASS / [ ] FAIL | [Supabase/auth console screenshot or API response] |
| Test organisation/tenant data seeded | [ ] PASS / [ ] FAIL | [Database query result or screenshot] |
| All required fixtures available | [ ] PASS / [ ] FAIL | [File listing or upload confirmation] |

**TEST_IDENTITY_READY gate verdict**: [ ] PASS / [ ] FAIL

---

## 5. Secret References

| Secret Name | Used For | Must Exist In |
|-------------|----------|--------------|
| `TEST_USER_EMAIL` | Primary test user login | GitHub Actions secrets |
| `TEST_USER_PASSWORD` | Primary test user login | GitHub Actions secrets |
| `TEST_ORG_ID` | Tenant isolation | GitHub Actions secrets |
| [MODULE_SPECIFIC_SECRET] | [purpose] | [location] |

---

## 6. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| Status | DRAFT / FINAL |
