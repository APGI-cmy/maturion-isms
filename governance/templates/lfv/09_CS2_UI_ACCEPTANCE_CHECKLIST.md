# 09 — CS2 UI Acceptance Checklist

<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §6 (CS2_UI_ACCEPTANCE_READY gate) | Issue: maturion-isms#1617 -->

## Header

| Field | Value |
|-------|-------|
| Module | [module name] |
| Wave | [wave identifier] |
| PR | [PR number] |
| Date | [YYYY-MM-DD] |
| CS2 Reviewer | Johan Ras (@APGI-cmy) |
| Deployment URL | [URL] |
| Head SHA | [PR head commit SHA] |

---

## CS2 Acceptance Criteria

This checklist must be completed and signed by CS2 before `CS2_UI_ACCEPTANCE_READY: yes` can be declared.

### 1. User Journey Verified

- [ ] Opened the deployment URL in browser
- [ ] Authenticated as [test user role]
- [ ] Completed the full promised user journey (see `01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md`)
- [ ] No unexpected errors, redirects, or blank screens observed

### 2. All CTAs Functional

- [ ] Reviewed all CTAs, buttons, and links listed in `04_CTA_BACKEND_STATE_MAP.md`
- [ ] All CTAs produce expected results without errors
- [ ] No dead links or 404/500 responses observed

### 3. Dashboard Reflects Correct State

- [ ] Dashboard/target page loaded correctly after completing the user journey
- [ ] Data displayed matches expected post-journey state (see `07_DASHBOARD_STATE_REFLECTION_GATE.md`)
- [ ] No stale data, empty states, or loading errors visible

### 4. Evidence Artifacts Reviewed

- [ ] Screenshot reviewed — matches expected application state
- [ ] Browser console log reviewed — no unexpected errors
- [ ] Network log reviewed — all requests returned expected HTTP statuses
- [ ] Playwright trace reviewed (if applicable)
- [ ] Workflow run URL confirmed: [URL]

### 5. Additional Observations

[CS2 to record any observations, concerns, or conditional acceptances here]

---

## CS2 Acceptance Decision

| Decision | Value |
|----------|-------|
| **ACCEPTED** | [ ] The delivered build satisfies all user journey requirements and is acceptable for merge |
| **REJECTED** | [ ] The delivered build does not satisfy requirements — see findings below |

**If REJECTED, list findings**:

| # | Finding | Severity | Required Action |
|---|---------|----------|----------------|
| 1 | [description] | [BLOCKING / NON-BLOCKING] | [what must be fixed] |

---

## CS2 Signature

> By signing below, CS2 confirms that the delivered UI/application build has been verified against the promised user journey and meets the acceptance criteria above.

**Signed**: Johan Ras (@APGI-cmy)  
**Date**: [YYYY-MM-DD]  
**Decision**: [ ] ACCEPTED / [ ] REJECTED  

---

**CS2_UI_ACCEPTANCE_READY gate**: [ ] PASS (ACCEPTED) / [ ] FAIL (REJECTED or unsigned)
