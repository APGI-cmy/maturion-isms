# MMM Build Process — Improvement Register

**Module**: MMM (Maturity Management Module)
**Document Role**: Oversight and continuous-improvement artifact for one-time build escapes
**Created**: 2026-04-30
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Related Issue**: maturion-isms#1535

---

## Purpose

This register records UI completeness and build-process oversights discovered after the
initial one-time build (Waves B1–B9) passed their automated test gates. Each entry documents
what escaped, why it escaped, the fix applied, and the governance improvement made to
prevent the same class of escape in future waves.

---

## Oversight Register

### OVS-001 — Login Discoverability Escape

| Field | Value |
|---|---|
| **ID** | OVS-001 |
| **Date Discovered** | 2026-04-28 |
| **Discovered By** | CS2 (production observation) |
| **Severity** | HIGH — blocks new users from starting |
| **Fix PR** | maturion-isms#1513 |
| **Related Test** | T-MMM-S6-021 |

**Observation**: The MMM app shipped without a visible "Sign In" button or navigation path
from the landing page. A logged-out user could reach the landing page but could not navigate
to `/login` without manually typing the URL.

**Root cause**: The B3 UI tests validated that `LandingPage.tsx` existed and had an `<h1>`,
but did not assert that a visible `/login` navigation link was present.

**Fix applied**: Added Sign In link to LandingPage nav (PR #1513). Anti-regression test
T-MMM-S6-021 added to ensure `LandingPage.tsx` contains `to="/login"`.

**Process improvement**: Updated prebuild requirement (see §Governance Updates below).

---

### OVS-002 — Post-Login Dashboard Completeness Escape

| Field | Value |
|---|---|
| **ID** | OVS-002 |
| **Date Discovered** | 2026-04-29/30 |
| **Discovered By** | CS2 (production observation post-login) |
| **Severity** | HIGH — blocks all post-login workflows |
| **Fix PR** | maturion-isms#1535 |
| **Related Tests** | T-MMM-S6-177, T-MMM-S6-178, T-MMM-S6-179, T-MMM-S6-180 |

**Observation**: After login, `/dashboard` showed only sparse headings and blank metric
labels. There was no app shell/navigation, no workflow guidance, no empty-state explanation,
and no actionable next step. The page was not a usable product UI.

**Root cause**:
- B6 dashboard tests (T-MMM-S6-086, T-MMM-S6-092, T-MMM-S6-093) validated that the file
  existed, contained a heading, called `/api/qiw/status`, and used `staleTime`. None of
  these asserted that the UI was navigable, showed useful empty states, or handled errors.
- The DashboardPage implementation did not check `res.ok` before calling `res.json()`,
  so any API failure silently produced blank values.
- A route existing and an endpoint being wired was treated as sufficient evidence of a
  complete post-login experience.

**Fix applied** (maturion-isms#1535):
1. `DashboardPage.tsx` rebuilt with:
   - App shell/nav (`AppNav` component) visible on all states (loading, error, content)
   - Nav links to `/dashboard`, `/frameworks`, `/frameworks/upload`, `/onboarding`
   - HTTP response status checked before `res.json()`; 403 and other errors thrown explicitly
   - Permission failure state: clear message directing user to contact administrator
   - Network/server error state: clear message with retry guidance
   - Empty state: explicit "No framework source-pack data has been uploaded yet" message
     with CTA button to `/frameworks/upload`
   - Data state: pipeline status cards with status badges, 7-day trend stat cards
   - Always-visible action bar with upload and frameworks links
2. CSS added to `index.css` (sections 22–23):
   - `.app-shell`, `.app-shell__header`, `.app-nav`, `.app-nav__link` — authenticated nav
   - `.dashboard-page`, `.dashboard-section`, `.dashboard-pipeline`, `.dashboard-stats`
   - `.dashboard-stat`, `.dashboard-empty-state`, `.dashboard-actions`
3. Regression tests T-MMM-S6-177 through T-MMM-S6-180 added to `b6-findings.test.ts`

---

### OVS-003 — Dashboard Error/Empty-State Oversight

| Field | Value |
|---|---|
| **ID** | OVS-003 |
| **Date Discovered** | 2026-04-29/30 |
| **Discovered By** | CS2 (code review during issue analysis) |
| **Severity** | MEDIUM — blank UI instead of user guidance |
| **Fix PR** | maturion-isms#1535 (merged into OVS-002 fix) |
| **Related Tests** | T-MMM-S6-179 |

**Observation**: The original DashboardPage did not distinguish between:
- Empty data (no frameworks uploaded yet)
- API permission failure (user lacks ADMIN/LEAD_AUDITOR role)
- Network/server failure
- Malformed response

All cases produced the same blank-values UI.

**Fix applied**: Covered by OVS-002 fix. See T-MMM-S6-179 for regression coverage.

---

### OVS-004 — Prebuild/Test Gap (File/String Tests Passing Despite Unusable UI)

| Field | Value |
|---|---|
| **ID** | OVS-004 |
| **Date Discovered** | 2026-04-29/30 |
| **Discovered By** | CS2 (code review during issue analysis) |
| **Severity** | PROCESS — test strategy weakness |
| **Fix PR** | maturion-isms#1535 |
| **Related Tests** | T-MMM-S6-177 through T-MMM-S6-180 |

**Observation**: File-existence and string-presence tests passed for DashboardPage despite
the product UI being unusable. Tests confirmed:
- File exists ✅
- Contains "Maturity Dashboard" heading ✅
- Calls `/api/qiw/status` ✅
- Uses `staleTime: 30_000` ✅

None of these asserted visible navigation, empty/error states, or that the user could
perform any post-login workflow.

**Fix applied**: Added tests T-MMM-S6-177 through T-MMM-S6-180 that assert structural
completeness requirements (nav links, empty state, error state, CTA). See §Governance
Updates for checklist requirements added.

---

## Governance Updates

### Prebuild Evidence Requirements for User-Facing Pages

Effective from maturion-isms#1535, the following evidence requirements apply to all
user-facing pages before a wave is considered complete. A route is NOT complete merely because:

- ❌ The file exists
- ❌ The route is registered in `App.tsx`
- ❌ A heading exists in the file
- ❌ A fetch/query call exists in the file

**Required prebuild evidence for every user-facing page**:

| Evidence | Description |
|---|---|
| Navigation path | The page must be reachable from the authenticated app shell or public nav |
| App shell / nav | Authenticated pages must render a visible nav with links to the primary workflow routes |
| Empty state | When the primary data is absent, the page must render a clear message and actionable next step (not blank labels) |
| Error state | When the API returns a non-success response, the page must distinguish permission failure from network/server failure and render a clear message |
| CTA to next workflow step | The page must provide a visible action button/link guiding the user to the next task |
| HTTP response check | Before calling `res.json()`, the component must check `res.ok` / `res.status` and handle error cases |

**Test requirement**: For each user-facing page, the test suite must include at least one
test asserting each of the above evidence items. String-existence tests for headings and
file existence are insufficient on their own.

### Updated Builder Checklist Requirement

Builder agents delivering user-facing pages must include in their handover evidence:

> **UI Completeness Evidence** (required for every page component):
> - [ ] App shell/nav present and linked to primary workflow routes
> - [ ] Empty state renders useful message + CTA (not blank values)
> - [ ] Error state renders distinct messages for permission failure vs. network/server failure
> - [ ] HTTP response status checked before JSON parsing
> - [ ] Regression tests assert nav, empty state, error state, and CTA (not just file/heading existence)

This requirement applies retroactively to any page that was built before this register was
established and has not yet been verified against these criteria.
