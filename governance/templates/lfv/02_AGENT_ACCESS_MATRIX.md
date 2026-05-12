# 02 — Agent Access Matrix

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §8 | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |

---

## ⚠️ Critical Rule

**GitHub Actions secrets must not be assumed to exist inside the interactive Copilot coding-agent runtime.**

If live verification requires secrets (BYPASS_TOKEN, TEST_USER_EMAIL, TEST_USER_PASSWORD, SUPABASE_URL, etc.), those verification steps **must** run in GitHub Actions — not inline in the coding agent session.

---

## 1. Secret / Access Item Matrix

For each required secret or access item, declare its availability in every runtime. Mark each cell as ✅ AVAILABLE, ❌ NOT AVAILABLE, or ⚠️ PARTIAL.

| Secret / Access Item | Interactive Coding Agent | GitHub Actions | Vercel Automation | Supabase Runtime | CS2 Manual |
|---------------------|--------------------------|----------------|-------------------|-----------------|------------|
| BYPASS_TOKEN (Vercel protection bypass) | ❌ NOT AVAILABLE | ✅ AVAILABLE (secret) | ✅ AVAILABLE | N/A | ✅ AVAILABLE |
| TEST_USER_EMAIL | ❌ NOT AVAILABLE | ✅ AVAILABLE (secret) | N/A | ✅ AVAILABLE | ✅ AVAILABLE |
| TEST_USER_PASSWORD | ❌ NOT AVAILABLE | ✅ AVAILABLE (secret) | N/A | ✅ AVAILABLE | ✅ AVAILABLE |
| SUPABASE_URL | ✅ AVAILABLE (env) | ✅ AVAILABLE (secret) | ✅ AVAILABLE | ✅ AVAILABLE | ✅ AVAILABLE |
| SUPABASE_ANON_KEY | ✅ AVAILABLE (env) | ✅ AVAILABLE (secret) | ✅ AVAILABLE | ✅ AVAILABLE | ✅ AVAILABLE |
| [Module-specific secret] | [status] | [status] | [status] | [status] | [status] |

---

## 2. Runtime Capability Summary

| Capability | Interactive Coding Agent | GitHub Actions | CS2 Manual |
|------------|--------------------------|----------------|------------|
| Can access deployed preview URL | ✅ Yes (if public) | ✅ Yes | ✅ Yes |
| Can bypass Vercel protection | ❌ No (no secret) | ✅ Yes | ✅ Yes (manual) |
| Can authenticate as test user | ❌ No (no secret) | ✅ Yes | ✅ Yes |
| Can run Playwright | ✅ Yes (locally) | ✅ Yes | N/A |
| Can upload artifacts | ❌ No | ✅ Yes | N/A |

---

## 3. Live Verification Runtime Decision

Based on the matrix above:

**Decision**: Live verification MUST run in: [ ] GitHub Actions / [ ] CS2 Manual / [ ] Both

**Reason**: [Explain which secrets are required and why the coding agent runtime is insufficient]

---

## 4. Missing Secrets / Blockers

| Item | Status | Action Required | Owner |
|------|--------|----------------|-------|
| [secret name] | MISSING / PRESENT | [what needs to be done] | [CS2 / DevOps] |

---

## 5. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| Status | DRAFT / FINAL |
