# LIVE_FUNCTIONAL_VERIFICATION_CANON

## Status
**Type**: Tier-1 Canonical Governance Standard  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Version**: 1.0.0  
**Effective Date**: 2026-05-12  
**Owner**: Maturion Engineering Leadership  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All UI/application/product-flow builds; All Agents; All Foreman Instances; All Builders; All IAA Instances  
**Issue Reference**: APGI-cmy/maturion-isms#1617  
**Precedence**: Subordinate only to GOVERNANCE_PURPOSE_AND_SCOPE.md; co-equal with FULLY_FUNCTIONAL_DELIVERY_STANDARD.md

---

## 1. Purpose

This canon establishes **Live Functional Verification (LFV)** as the mandatory third assurance tier for all UI/application/product-flow builds.

Prior to this canon, builds could be CI-green, admin-complete, and code-correct, yet have no upfront contract for deployed functional delivery. The LFV canon closes this gap by requiring that every UI/application build include a pre-designed verification package and produce deployed evidence before handover.

---

## 2. Three-Tier Delivery Assurance Principle

The following is binding operating law for all UI/application builds:

> **Admin correctness makes a PR admissible.**  
> **Code correctness makes a PR plausible.**  
> **Live functional verification makes a PR acceptable.**

For application builds, the cascade is absolute:

> **No deployed workflow evidence → no functional pass.**  
> **No functional pass → no handover.**  
> **No handover → no merge.**

---

## 3. Scope and Applicability

### 3.1 When LFV Is Mandatory

LFV is **MANDATORY** for every build that:

- Delivers a user-facing UI component, page, or flow
- Delivers an API that is callable by a UI or by an end user
- Delivers a product-flow that includes CTAs, buttons, links, or forms
- Claims to deliver a "working application" or "deployable product"

### 3.2 When LFV Is Not Required (Explicit Exemptions)

The following wave types are exempt from the LFV package requirement:

| Wave Type | Exemption Reason |
|-----------|-----------------|
| Governance-only waves | No user-facing product delivery |
| Pure schema migrations with no UI impact | No UI behaviour change |
| Pure infrastructure/CI changes | No deployed application change |
| Documentation-only changes | No runtime behaviour |

**Note**: Exemption must be explicitly declared in the wave scope declaration. Any wave claiming a functional delivery cannot claim an LFV exemption.

---

## 4. The LFV Pre-Build Package

Every UI/application build **MUST** produce the following nine artifact templates before implementation begins. The templates are located at `governance/templates/lfv/`.

| # | Artifact | Path | Purpose |
|---|----------|------|---------|
| 01 | Functional User Journey Contract | `governance/templates/lfv/01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md` | Declares the promised end-to-end user journey |
| 02 | Agent Access Matrix | `governance/templates/lfv/02_AGENT_ACCESS_MATRIX.md` | Maps every required secret/access item across all runtimes |
| 03 | Deployed Verification Plan | `governance/templates/lfv/03_DEPLOYED_VERIFICATION_PLAN.md` | Step-by-step live verification procedure |
| 04 | CTA Backend State Map | `governance/templates/lfv/04_CTA_BACKEND_STATE_MAP.md` | Maps every CTA/button/link to its backend target |
| 05 | Test Identity and Role Matrix | `governance/templates/lfv/05_TEST_IDENTITY_AND_ROLE_MATRIX.md` | Test users, roles, tenant data, and fixtures |
| 06 | Live Verification Workflow Spec | `governance/templates/lfv/06_LIVE_VERIFICATION_WORKFLOW_SPEC.md` | Specification for the live verification workflow |
| 07 | Dashboard State Reflection Gate | `governance/templates/lfv/07_DASHBOARD_STATE_REFLECTION_GATE.md` | Dashboard/page state evidence requirements |
| 08 | Handover Evidence Requirements | `governance/templates/lfv/08_HANDOVER_EVIDENCE_REQUIREMENTS.md` | Complete evidence checklist for handover |
| 09 | CS2 UI Acceptance Checklist | `governance/templates/lfv/09_CS2_UI_ACCEPTANCE_CHECKLIST.md` | CS2 product owner acceptance sign-off |

The package must cover:

- Promised end-to-end user journey
- All CTAs/buttons/links and their backend targets
- Required test users and roles
- Test organisation / tenant data
- Deployed preview/live URL strategy
- Vercel Deployment Protection bypass strategy
- GitHub Actions secrets required for automation
- Supabase project/function/log access required
- Required upload/test fixtures
- Dashboard or state-reflection proof
- Screenshots/recordings/network logs/trace artifacts required
- Pass/fail criteria
- CS2 UI acceptance steps

---

## 5. Live Verification Workflow Requirement

### 5.1 Mandatory Workflow

Every UI/application build must include a live verification workflow:

```
.github/workflows/{module}-live-verification.yml
```

The workflow template is provided at `governance/templates/lfv/live-verification-workflow.template.yml`.

### 5.2 Runtime Requirement

The workflow **must** run from **GitHub Actions** or another approved automation runtime that has access to declared secrets.

**HARD RULE**: GitHub Actions secrets must not be assumed to exist inside the interactive Copilot coding-agent runtime. If live verification requires secrets, it must run in GitHub Actions.

### 5.3 Required Output Fields

The workflow must produce the following output fields:

| Field | Description |
|-------|-------------|
| `DEPLOYMENT_ACCESS` | Whether the deployed URL was reachable |
| `LOGIN_SUCCESS` | Whether the test user authenticated successfully |
| `DASHBOARD_OR_PAGE_LOAD` | Whether the target page/dashboard loaded |
| `USER_JOURNEY_COMPLETE` | Whether the full user journey completed without error |
| `FAILING_REQUEST` | URL of any failing request (if applicable) |
| `HTTP_STATUS` | HTTP status code of the failing request |
| `RESPONSE_BODY` | Response body excerpt (if applicable) |
| `CONSOLE_ERROR` | Browser console error (if applicable) |
| `LIKELY_ROOT_CAUSE` | Best-effort root cause assessment |
| `ARTIFACT_LINKS` | Links to uploaded verification artifacts |

### 5.4 Required Artifacts

Every workflow run must upload:

- Screenshot (full page or viewport)
- Browser console log
- Network log (HAR or equivalent)
- Playwright trace or equivalent
- Workflow run URL
- Deployment URL
- PR/head SHA
- Authenticated role used

---

## 6. Mandatory Product-Build Gates

### 6.1 Gate Definitions

The following gates apply to all UI/application builds. All eight must pass before functional delivery is claimed.

| Gate ID | Description | Evidence Type | Pass Condition |
|---------|-------------|---------------|----------------|
| `DEPLOYED_SHA_MATCH` | Deployed build matches the PR head SHA | `LIVE_RUNTIME` | SHA of deployed build equals PR head commit SHA |
| `TEST_IDENTITY_READY` | Test users/roles are available in the target environment | `CI_TEST` | All required test users confirmed as existing and accessible in target environment prior to verification run |
| `VERCEL_BYPASS_READY` | Vercel Deployment Protection bypass is configured | `CONFIG` | Bypass token is configured; bypass cookie flow (`?x-vercel-protection-bypass=<token>&x-vercel-set-bypass-cookie=samesitenone`) verified to return HTTP 200 |
| `LIVE_VERIFICATION_WORKFLOW_READY` | Live verification workflow exists and has run | `CI_TEST` | Workflow file exists at `.github/workflows/{module}-live-verification.yml` and has at least one successful run on the target branch |
| `NO_DEAD_CTA` | All CTAs, buttons, and links function correctly | `LIVE_E2E` | All CTAs/buttons/links in the delivered feature produce expected backend responses — no 404, no 500, no authentication redirect loops |
| `DASHBOARD_STATE_REFLECTION_PROVEN` | Dashboard reflects correct data state | `LIVE_E2E` | Dashboard or target page reflects expected data state after completing the authenticated user journey; evidence by screenshot and network log |
| `ARTIFACTS_ATTACHED` | All required verification artifacts are present | `ARTIFACT` | Screenshot + browser console log + network log + Playwright trace (or equivalent) all present in workflow run artifacts |
| `CS2_UI_ACCEPTANCE_READY` | CS2 product acceptance checklist is complete | `LIVE_RUNTIME` | `09_CS2_UI_ACCEPTANCE_CHECKLIST.md` completed and signed by CS2 |

### 6.2 Evidence Type Definitions

| Evidence Type | Definition |
|---------------|-----------|
| `LIVE_RUNTIME` | Evidence obtained from the live or preview deployed environment |
| `LIVE_E2E` | Evidence from an automated or manual end-to-end test running against the live environment |
| `CI_TEST` | Evidence from a CI system test run (GitHub Actions or equivalent) |
| `CONFIG` | Evidence from configuration state verification |
| `ARTIFACT` | Evidence in the form of uploaded artifact files |

---

## 7. IAA Verification Rule

### 7.1 Three-Tier Verdict Model

IAA final assurance **may not** issue a functional pass for a UI/application build unless the live verification artifacts exist. The three tiers are independent and sequential:

| Tier | Verdict Field | Definition | Sufficient for Merge? |
|------|--------------|------------|----------------------|
| 1 | `ADMIN_PASS` | All governance ceremony artifacts are present and correct | No — PR is admissible only |
| 2 | `CODE_PASS` | All CI tests pass, linters pass, type checks pass, build succeeds; code is correct as implemented | No — PR is plausible only |
| 3 | `FUNCTIONAL_PASS` | Live verification workflow ran against deployed build; all 8 gates passed; CS2 UI acceptance complete | Yes — when ADMIN_PASS + CODE_PASS + FUNCTIONAL_PASS are all `yes` |

### 7.2 Mandatory IAA Enforcement

```
ADMIN_PASS may be yes.
CODE_PASS may be yes.
FUNCTIONAL_PASS must remain no until deployed live verification passes.
```

IAA must not:
- Issue `VERDICT: FULL_FUNCTIONAL_DELIVERY` when `FUNCTIONAL_PASS: no`
- Use language such as "code quality PASS", "technically correct", "no regressions", or "ready for handover" when `FUNCTIONAL_PASS: no`
- Issue a PASS_WITH_CS2_WAIVER without explicit CS2 written waiver on the PR

---

## 8. Agent Access Matrix Rule

### 8.1 Runtime Access Declaration

The pre-build package **must** explicitly declare whether each required secret/access item is available to:

| Runtime | Description |
|---------|-------------|
| Interactive coding agent runtime | The Copilot SWE agent in the PR session |
| GitHub Actions runtime | The automated workflow execution environment |
| Vercel automation | Vercel preview/deployment automation |
| Supabase runtime | Supabase project, function, and log access |
| CS2 manual UI validation | CS2 browser-based review |

### 8.2 Critical Constraint

**GitHub Actions secrets must not be assumed to exist inside the interactive Copilot coding-agent runtime.**

If live verification requires secrets (BYPASS_TOKEN, TEST_USER_EMAIL, TEST_USER_PASSWORD, SUPABASE_URL, etc.), those verification steps must run in GitHub Actions or another approved runtime — not inline in the coding agent session.

---

## 9. Constitutional References

This canon derives authority from and integrates with:

- `FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` v2.1.0 — Fully functional delivery definition and three-tier model
- `PRE_BUILD_STAGE_MODEL_CANON.md` — Pre-build stage sequence; LFV package is part of Stage 2 (UX Workflow & Wiring) for UI builds
- `BUILD_PHILOSOPHY.md` — One-Time Build Law; live functional verification is a prerequisite to delivery acceptance
- `IAA_PRE_BRIEF_PROTOCOL.md` — IAA pre-build briefing; FUNCTIONAL_PASS category overlays apply
- `PRODUCT_BUILD_ASSURANCE_STANDARD.md` — IAA operational enforcement of three-tier verdict model

---

## 10. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-05-12 | CS2 (Johan Ras) | Initial canon. Establishes LFV as mandatory third assurance tier. Nine pre-build artifact templates. Eight mandatory product-build gates with evidence_type labels. Three-tier IAA verdict model (ADMIN_PASS, CODE_PASS, FUNCTIONAL_PASS). GitHub Actions secrets isolation rule. Governance-only wave exemption. Issue: maturion-isms#1617. |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Version**: 1.0.0  
**Living Agent System**: v6.2.0
