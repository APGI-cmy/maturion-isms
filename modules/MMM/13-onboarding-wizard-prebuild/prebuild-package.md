# MMM Issue #13 — Onboarding Wizard Pre-Build Package

**Issue**: maturion-isms#13 — Harvest legacy MaturitySetup into MMM Get To Know You wizard
**Branch**: copilot/harvest-maturity-setup-into-wizard
**Date**: 2026-05-14
**Owner**: Foreman / ui-builder / api-builder

---

## 1. Scope Declaration

**In scope:**
- Replace `apps/mmm/src/pages/OnboardingPage.tsx` (2-field form) with a 10-step Get To Know You wizard
- Extend `supabase/functions/mmm-org-create/index.ts` to accept and store wizard context fields
- Add `supabase/migrations/20260514000001_mmm_onboarding_context.sql` — adds `context` JSONB and `onboarding_complete` boolean to `mmm_organisations`
- Add CSS wizard styles to `apps/mmm/src/index.css`
- Guard `apps/mmm/src/pages/FrameworkOriginPage.tsx` — redirect to `/onboarding` if `onboarding_complete = false`
- Create this pre-build governance package at `modules/MMM/13-onboarding-wizard-prebuild/`

**Out of scope:**
- ISMS public landing page
- Framework generation logic
- Evidence management
- PIT / RADAM / Risk / Incident modules
- Full schema rebuild
- Legacy app copy

---

## 2. Functional User Journey Contract — Get To Know You Wizard

| Step | Title | Purpose |
|------|-------|---------|
| 1 | Welcome | Explain AI-tailored maturity purpose, set expectations |
| 2 | Your Information | Collect fullName, title, bio |
| 3 | Organisation Identity | Collect companyName, tier (plan) |
| 4 | Industry, Region & Context | industryTags, customIndustry, regionOperating |
| 5 | Website & Domain Footprint | primaryWebsiteUrl, linkedDomains |
| 6 | Risk, Threat & Compliance | riskConcerns, complianceCommitments, threatSensitivityLevel |
| 7 | Branding & Visual Identity | primaryColor, secondaryColor, textColor |
| 8 | AI-Ready Documents (Optional) | optionalDocuments (description only — no file upload in MVP) |
| 9 | Maturity Model Name & Intent | modelName |
| 10 | Review & Confirm | Summary of all entered data + Submit |

---

## 3. Legacy Harvest Map — src/pages/MaturitySetup.tsx

| Legacy Element | Action | Target |
|----------------|--------|--------|
| `FormData.fullName` | HARVEST | Step 2 — stored in context.fullName |
| `FormData.title` | HARVEST | Step 2 — stored in context.title |
| `FormData.bio` | HARVEST (optional) | Step 2 — stored in context.bio |
| `FormData.companyName` | HARVEST | Step 3 — mmm_organisations.name |
| `FormData.primaryColor` | HARVEST | Step 7 — stored in context |
| `FormData.secondaryColor` | HARVEST | Step 7 — stored in context |
| `FormData.textColor` | HARVEST | Step 7 — stored in context |
| `FormData.modelName` | HARVEST | Step 9 — stored in context |
| `FormData.primaryWebsiteUrl` | HARVEST | Step 5 — stored in context |
| `FormData.linkedDomains` | HARVEST | Step 5 — stored in context |
| `FormData.industryTags` | HARVEST | Step 4 — stored in context |
| `FormData.customIndustry` | HARVEST | Step 4 — stored in context |
| `FormData.regionOperating` | HARVEST | Step 4 — stored in context |
| `FormData.riskConcerns` | HARVEST | Step 6 — stored in context |
| `FormData.complianceCommitments` | HARVEST | Step 6 — stored in context |
| `FormData.threatSensitivityLevel` | HARVEST | Step 6 — stored in context |
| `FormData.optionalDocuments` | DEFER (no file upload infra) | Step 8 note only |
| `LogoUploader` component | DEFER | Not in MVP |
| `BrandingPreview` component | DEFER | Not in MVP |
| `seed-org-domains` hook | DEFER | Not in MVP |
| `crawl-org-domain` hook | DEFER | Not in MVP |
| `generateModelName` AI function | HARVEST (simplified client-side) | Step 9 suggestion |
| INDUSTRY_OPTIONS constants | HARVEST | Step 4 dropdown |
| REGION_OPTIONS constants | HARVEST | Step 4 dropdown |
| RISK_CONCERN_OPTIONS constants | HARVEST | Step 6 checkboxes |
| COMPLIANCE_OPTIONS constants | HARVEST | Step 6 checkboxes |
| Save Progress button | ADAPT (auto-save in state) | Wizard state preservation |
| Step navigation | HARVEST + MODERNISE | Wizard Back/Next pattern |

---

## 4. Field Inventory and Persistence Map

| Field | Source | Persisted in | Required |
|-------|--------|-------------|---------|
| name (companyName) | Step 3 | mmm_organisations.name | YES |
| tier | Step 3 | mmm_organisations.tier | YES |
| slug | derived from name | mmm_organisations.slug | YES (auto) |
| onboarding_complete | set on submit | mmm_organisations.onboarding_complete | YES |
| fullName | Step 2 | mmm_organisations.context.fullName | YES |
| title | Step 2 | mmm_organisations.context.title | YES |
| bio | Step 2 | mmm_organisations.context.bio | NO |
| primaryColor | Step 7 | mmm_organisations.context.primaryColor | NO |
| secondaryColor | Step 7 | mmm_organisations.context.secondaryColor | NO |
| textColor | Step 7 | mmm_organisations.context.textColor | NO |
| modelName | Step 9 | mmm_organisations.context.modelName | NO |
| primaryWebsiteUrl | Step 5 | mmm_organisations.context.primaryWebsiteUrl | NO |
| linkedDomains | Step 5 | mmm_organisations.context.linkedDomains | NO |
| industryTags | Step 4 | mmm_organisations.context.industryTags | NO |
| customIndustry | Step 4 | mmm_organisations.context.customIndustry | NO |
| regionOperating | Step 4 | mmm_organisations.context.regionOperating | NO |
| riskConcerns | Step 6 | mmm_organisations.context.riskConcerns | NO |
| complianceCommitments | Step 6 | mmm_organisations.context.complianceCommitments | NO |
| threatSensitivityLevel | Step 6 | mmm_organisations.context.threatSensitivityLevel | NO |
| optionalDocuments (text notes) | Step 8 | mmm_organisations.context.documentNotes | NO |

---

## 5. UX Wizard Step Map

```
[1: Welcome] → [2: Your Info] → [3: Org Identity] → [4: Industry/Region]
→ [5: Website/Domains] → [6: Risk/Compliance] → [7: Branding]
→ [8: Documents (Optional)] → [9: Model Name] → [10: Review & Confirm]
→ [Submit → /framework-origin]
```

Navigation: Back / Next on all steps except Step 1 (Next only) and Step 10 (Back / Submit).
Progress bar shows current step / total steps (10).
All data preserved in local React state throughout wizard.

---

## 6. Backend / API Impact Assessment

| Component | Impact |
|-----------|--------|
| `supabase/functions/mmm-org-create/index.ts` | EXTEND — accept context fields in request body; store in mmm_organisations.context; set onboarding_complete=true |
| `supabase/migrations/` | ADD — 20260514000001_mmm_onboarding_context.sql adds context JSONB + onboarding_complete boolean to mmm_organisations |
| `apps/mmm/src/pages/FrameworkOriginPage.tsx` | ADD GUARD — fetch org on mount; redirect to /onboarding if onboarding_complete=false |
| `apps/mmm/src/pages/OnboardingPage.tsx` | REPLACE — 10-step wizard |
| `apps/mmm/src/index.css` | ADD — wizard step CSS |
| mmm-profiles | No change |
| mmm-frameworks | No change |
| mmm-commissioning-check | No change |

---

## 7. Data Persistence Decision Record

**Decision**: Extend `mmm_organisations` with a `context` JSONB column (nullable) and `onboarding_complete` boolean (default false).

**Rationale**:
- Smallest schema change — single JSONB column avoids many new columns
- Context JSON is AI-readable: AIMC/MMM can query `context` for onboarding intent at any time
- `onboarding_complete` flag provides a clean boolean gate for `/framework-origin` guard
- No new table required
- Backwards compatible — existing orgs continue to work with `context = null`

**Alternative rejected**: Separate `mmm_onboarding_context` table — unnecessary complexity for this phase.

---

## 8. Verification Plan

### File-based assertions (automated via existing vitest tests):
- `T-MMM-S6-005`: OnboardingPage.tsx must still invoke `mmm-org-create`, expose `mutation.isError`, `role="alert"`, retry message
- `T-MMM-S6-013`: mmm-org-create still creates mmm_organisations with slug, mmm_profiles with ADMIN
- `GP-001`: mmm-org-create imports validateJWT, has NBR-001/NBR-002 comments, creates mmm_profiles with ADMIN

### Functional live test plan:
1. Sign up new user → routed to /onboarding ✓
2. Step 1 (Welcome) renders with Next button ✓
3. Steps 2–9 collect data, Back/Next navigation ✓
4. Step 10 shows review summary ✓
5. Submit → calls mmm-org-create with full context ✓
6. On success → routed to /framework-origin ✓
7. Org has onboarding_complete=true in DB ✓
8. Return to /onboarding → already complete → can navigate normally ✓
9. Direct nav to /framework-origin before onboarding → redirected to /onboarding ✓
10. Error on submit → shows actionable error message ✓

---

## 9. Admin / IAA / ECAP Requirements Declaration

- Governance-control scope files added (.agent-admin/assurance/, .agent-admin/scope-declarations/)
- No CI workflow files modified
- Pre-build governance package created at narrow issue-specific path
- ECAP: required — governance-control files (.agent-admin/) included in PR scope
- IAA: standard PR review
- requires_ecap: true

---

## 10. Handover Evidence Checklist

```
PREBUILD_PACKAGE_PRESENT: yes — modules/MMM/13-onboarding-wizard-prebuild/prebuild-package.md
LEGACY_HARVEST_MAP_PRESENT: yes — section 3 above
FIELD_PERSISTENCE_MAP_PRESENT: yes — section 4 above
ONBOARDING_WIZARD_LOADS: to be verified in deployment
USER_CAN_COMPLETE_ALL_STEPS: to be verified in deployment
ONBOARDING_CONTEXT_PERSISTED: yes — mmm_organisations.context JSONB
FRAMEWORK_ORIGIN_BLOCKED_BEFORE_COMPLETION: yes — FrameworkOriginPage guard
FRAMEWORK_ORIGIN_AVAILABLE_AFTER_COMPLETION: yes — navigate on wizard complete
AI_CONTEXT_FIELDS_CAPTURED: yes — all legacy fields in context JSONB
FUNCTIONAL_PASS: to be verified in deployment
```
