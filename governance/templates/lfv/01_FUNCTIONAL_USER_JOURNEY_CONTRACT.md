# 01 — Functional User Journey Contract

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4 | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Issue | [issue number] |
| Date | [YYYY-MM-DD] |
| Author Agent | [agent ID] |

---

## 1. Promised End-to-End User Journey

Describe the complete, sequential user journey that this build promises to deliver. Each step must be verifiable.

| Step | Actor | Action | Expected Result |
|------|-------|--------|----------------|
| 1 | [user/role] | [what the user does] | [what should happen] |
| 2 | [user/role] | [what the user does] | [what should happen] |
| ... | ... | ... | ... |

**Starting state**: [Describe the state of the system before the journey begins — e.g. "user is unauthenticated", "organisation has no existing records"]

**Ending state**: [Describe the expected state after the journey completes — e.g. "record persisted in Supabase, dashboard shows updated count"]

---

## 2. User Roles Required

| Role | Description | Available in Target Env? |
|------|-------------|--------------------------|
| [role name] | [what this role can do] | [ ] Yes / [ ] No |

---

## 3. Success Criteria

All of the following must be true for this journey to be considered complete:

- [ ] [Criterion 1 — specific, verifiable]
- [ ] [Criterion 2 — specific, verifiable]
- [ ] [Criterion 3 — specific, verifiable]

---

## 4. Failure Criteria

The journey has failed if any of the following occur:

- [ ] Login redirect loop or authentication failure
- [ ] HTTP 4xx/5xx on any CTA or API call
- [ ] Dashboard does not reflect expected data state after action
- [ ] [Module-specific failure condition]

---

## 5. Sign-off

| Field | Value |
|-------|-------|
| Author | [agent ID] |
| Foreman reviewed | [ ] Yes |
| CS2 accepted | [ ] Yes |
| Status | DRAFT / FINAL |
