# MMM Live UI Evidence Pack — Fillable Template

**Template Version**: 1.1.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Canon ref**: `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md` v1.1.0
**Checklist ref**: `governance/checklists/mmm-ui-evidence-pack-checklist.md`
**Violation class**: `INC-MMM-LUIEP-MISSING-001`
**Issue**: maturion-isms#1523

---

## Instructions for CS2

This template is to be filled by CS2 (@APGI-cmy) when live UI evidence has been gathered on the deployed MMM platform. Complete each field by replacing the `PENDING — to be filled by CS2` placeholder with the actual value after confirming the item on the live platform.

**Before filling this template**:
1. Ensure the MMM deployment URL is live and accessible via HTTPS.
2. Open the deployment URL in a real browser (not a preview, not localhost).
3. Verify each item personally on the live platform.
4. Enter the sign-off date in `cs2_sign_off` only when all LIVE_RUNTIME items are confirmed.

**Temporal integrity (A-040)**: Do NOT pre-populate YES or a date for items not yet verified. Use `PENDING` for all unconfirmed items. This template uses forward-looking language by design — status fields remain PENDING until CS2 confirms them on the live platform.

**Evidence type discipline (A-041)**: `LIVE_RUNTIME` and `LIVE_E2E` fields require direct interaction with the live deployed application. A CI run, static code review, or local dev server does NOT satisfy these fields.

---

## LUIEP — Metadata

```yaml
evidence_pack_version: "PENDING — to be filled by CS2 (e.g. 1.0.0)"
evidence_pack_date: "PENDING — to be filled by CS2 (format: YYYY-MM-DD)"
wave: "mmm-ui-evidence-pack-hardening-20260430"
issue: "maturion-isms#1523"
prepared_by: "CS2 (@APGI-cmy)"
```

**Example**:
```yaml
evidence_pack_version: "1.0.0"
evidence_pack_date: "2026-05-15"
wave: "mmm-ui-evidence-pack-hardening-20260430"
issue: "maturion-isms#1523"
prepared_by: "CS2 (@APGI-cmy)"
```

---

## Section 1: Deployment URL Confirmation

**Evidence type**: LIVE_RUNTIME — requires direct browser access to the live deployed application.

```yaml
deployment_url: "PENDING — to be filled by CS2 (e.g. https://mmm.maturion.app)"
deployment_url_confirmed: "PENDING"
```

**Instructions**: Enter the live HTTPS URL where the deployed MMM UI is accessible. Set `deployment_url_confirmed: YES` only after opening the URL in a browser and confirming the application loads.

**Example**:
```yaml
deployment_url: "https://mmm.maturion.app"
deployment_url_confirmed: "YES"
```

**Permitted values for `deployment_url_confirmed`**: `YES` | `PENDING` | `NOT_APPLICABLE`

> ⚠️ `NOT_APPLICABLE` is only valid if the MMM wave did not include a UI deployment surface. For waves claiming L2 or L3 completion, `deployment_url_confirmed` MUST be `YES`.

---

## Section 2: UI Rendering Confirmation

**Evidence type**: LIVE_RUNTIME — requires direct browser observation of the live application.

```yaml
ui_renders_correctly: "PENDING — to be filled by CS2"
ui_rendering_notes: "PENDING — describe what was observed (e.g. home page loads, no console errors, navigation works)"
```

**Instructions**: Set `ui_renders_correctly: YES` only after verifying in a browser that the MMM application pages load without errors, navigation functions correctly, and no critical console errors are present.

**Example**:
```yaml
ui_renders_correctly: "YES"
ui_rendering_notes: "Home page, media library, and upload pages all load correctly. No console errors. Navigation between pages works. Verified in Chrome on 2026-05-15."
```

**Permitted values for `ui_renders_correctly`**: `YES` | `PENDING`

---

## Section 3: Authentication Flow Confirmation

**Evidence type**: LIVE_RUNTIME — requires direct interaction with the live authentication system.

```yaml
auth_flow_confirmed: "PENDING — to be filled by CS2"
auth_flow_notes: "PENDING — describe what was tested (e.g. signup, login, logout, session persistence)"
```

**Instructions**: Set `auth_flow_confirmed: YES` only after successfully completing the login and/or signup flow on the live platform. Note which authentication paths were tested.

**Example**:
```yaml
auth_flow_confirmed: "YES"
auth_flow_notes: "Signup with email confirmed (verification email received). Login with email/password confirmed. Session persists on page refresh. Logout confirmed. Tested on live platform 2026-05-15."
```

**Permitted values for `auth_flow_confirmed`**: `YES` | `PENDING`

---

## Section 4: End-to-End Workflow Confirmation

**Evidence type**: LIVE_E2E — requires a complete user journey executed on the live platform from UI to database and back.

```yaml
e2e_workflow_confirmed: "PENDING — to be filled by CS2"
e2e_workflow_description: "PENDING — describe the complete workflow demonstrated (e.g. user logs in → uploads media file → transcription is requested → result is displayed in the UI)"
e2e_workflow_date: "PENDING — date workflow was executed on live platform (format: YYYY-MM-DD)"
```

**Instructions**: Set `e2e_workflow_confirmed: YES` only after executing at least one complete user workflow on the live platform — from UI interaction through API call to database operation and visible UI response. Describe the workflow in detail.

**Example**:
```yaml
e2e_workflow_confirmed: "YES"
e2e_workflow_description: "User logs into MMM (authenticated via Supabase Auth) → navigates to Media Library → uploads a 30-second MP4 file → transcription request is triggered → transcription result appears in the UI within 60 seconds. All steps completed on live platform at https://mmm.maturion.app on 2026-05-15."
e2e_workflow_date: "2026-05-15"
```

**Permitted values for `e2e_workflow_confirmed`**: `YES` | `PENDING`

> ⚠️ For L2 (Deployment Commissioned) claims: `e2e_workflow_confirmed: PENDING` is permitted.
> For L3 (Operationally Closed) claims: `e2e_workflow_confirmed: YES` is REQUIRED.

---

## Section 5: Screenshot Evidence

**Evidence type**: LIVE_RUNTIME — screenshots MUST be of the live deployed application.

```yaml
screenshots_provided: "PENDING — to be filled by CS2"
screenshot_references:
  - "PENDING — path or description of screenshot 1 (e.g. ./screenshots/mmm-home-live-20260515.png)"
screenshot_notes: "PENDING — describe what each screenshot shows"
```

**Instructions**: Set `screenshots_provided: YES` only after providing at least one screenshot of the live MMM application rendering in a browser connected to the live deployment URL. Screenshots MUST NOT be of a local dev server, Storybook, or CI preview environment.

**Example**:
```yaml
screenshots_provided: "YES"
screenshot_references:
  - "./screenshots/mmm-home-live-20260515.png"
  - "./screenshots/mmm-media-library-live-20260515.png"
  - "./screenshots/mmm-upload-flow-live-20260515.png"
screenshot_notes: "Screenshots taken in Chrome on macOS. URL bar shows https://mmm.maturion.app in all screenshots. Timestamp visible in system clock."
```

**Permitted values for `screenshots_provided`**: `YES` | `NO` | `PENDING`

> ⚠️ `screenshots_provided: PENDING` is permitted only as a pre-signoff placeholder in this template and must be replaced during CS2 completion. `screenshots_provided: NO` is a violation of Rule U-004 when the PREHANDOVER proof claims L2 or L3 completion. At minimum one screenshot MUST be provided.

---

## Section 6: CS2 Sign-Off

**Evidence type**: LIVE_RUNTIME — sign-off date must reflect the date CS2 personally verified the live platform.

```yaml
cs2_sign_off: "PENDING — to be filled by CS2 (format: YYYY-MM-DD)"
cs2_sign_off_notes: "PENDING — optional notes about the sign-off (e.g. platform access method, browser used)"
```

**Instructions**: Enter the date on which CS2 (@APGI-cmy) personally verified the live platform and confirms all applicable LUIEP fields. This date MUST NOT be pre-populated; it is entered only at the moment of actual sign-off.

**Example**:
```yaml
cs2_sign_off: "2026-05-15"
cs2_sign_off_notes: "Verified live on macOS Chrome. Confirmed deployment URL, UI rendering, auth flow, and E2E media upload workflow. All LUIEP fields verified as accurate."
```

**Permitted values for `cs2_sign_off`**: `YYYY-MM-DD` date (post-verification) | `PENDING` (pre-verification)

> ⚠️ A PREHANDOVER proof claiming L2 or L3 completion MUST NOT be committed with `cs2_sign_off: PENDING`. The sign-off date MUST be entered before the PREHANDOVER proof is submitted for QP evaluation and IAA audit.

---

## Section 7: Route Inventory (Rule U-006)

**Evidence type**: LIVE_RUNTIME — each route MUST be verified directly in a browser connected to the live deployment URL.

Provide one entry per required application route. Set `accessible: YES` and `screenshot_ref` to a real path only after verifying each route on the live platform.

```yaml
route_inventory:
  - route: "/"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING — path/to/screenshot (e.g. ./screenshots/mmm-home-live-20260515.png)"
  - route: "/login"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/signup"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/forgot-password"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/reset-password"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/onboarding"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/dashboard"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/frameworks"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
  - route: "/frameworks/upload"
    accessible: "PENDING"
    http_status: "PENDING"
    screenshot_ref: "PENDING"
```

**Instructions**: Replace each `PENDING` with the confirmed value. `screenshot_ref` MUST point to a committed screenshot file showing the live application at that route.

**Example entry**:
```yaml
  - route: "/login"
    accessible: "YES"
    http_status: "200"
    screenshot_ref: "./screenshots/mmm-login-live-20260515.png"
```

**Permitted values for `accessible`**: `YES` | `PENDING`
**Required**: every listed route's `screenshot_ref` MUST be non-PENDING for L2/L3 claims.

---

## Section 8: Network/API Evidence (Rule U-007)

**Evidence type**: LIVE_RUNTIME — API calls MUST be observed on the live deployed platform, not reconstructed from code review.

```yaml
network_api_evidence:
  - endpoint: "PENDING — e.g. /api/auth/signin"
    status_code: "PENDING — e.g. 200"
    backend_url: "PENDING — e.g. https://api.mmm.maturion.app"
    description: "PENDING — describe what the endpoint does and what was tested"
  - endpoint: "PENDING"
    status_code: "PENDING"
    backend_url: "PENDING"
    description: "PENDING"
```

**Instructions**: Record at least one API call observed during live testing. Include the full endpoint path, HTTP status code returned, backend URL, and what the call does. Add additional entries for each major endpoint exercised.

**Example**:
```yaml
network_api_evidence:
  - endpoint: "/auth/v1/token"
    status_code: "200"
    backend_url: "https://xxxx.supabase.co/auth/v1/token"
    description: "Supabase Auth token exchange during login — returns JWT"
  - endpoint: "/rest/v1/frameworks"
    status_code: "200"
    backend_url: "https://xxxx.supabase.co/rest/v1/frameworks"
    description: "Frameworks list fetch on /frameworks route — returns JSON array"
```

---

## Section 9: Operational Status Matrix (Rule U-008)

**Evidence type**: LIVE_RUNTIME — consolidated operational status summary per route.

```yaml
operational_status_matrix:
  - route: "/"
    status: "PENDING"
    notes: "PENDING"
  - route: "/login"
    status: "PENDING"
    notes: "PENDING"
  - route: "/signup"
    status: "PENDING"
    notes: "PENDING"
  - route: "/forgot-password"
    status: "PENDING"
    notes: "PENDING"
  - route: "/reset-password"
    status: "PENDING"
    notes: "PENDING"
  - route: "/onboarding"
    status: "PENDING"
    notes: "PENDING"
  - route: "/dashboard"
    status: "PENDING"
    notes: "PENDING"
  - route: "/frameworks"
    status: "PENDING"
    notes: "PENDING"
  - route: "/frameworks/upload"
    status: "PENDING"
    notes: "PENDING"
```

**Permitted values for `status`**: `OPERATIONAL` | `DEGRADED` | `UNAVAILABLE` | `PENDING`

**Example entry**:
```yaml
  - route: "/dashboard"
    status: "OPERATIONAL"
    notes: "Loads correctly with user data. Media list populated. No console errors."
```

---

## Section 10: Completion Level Declaration

Declare which completion level this LUIEP supports. See `modules/MMM/BUILD_PROGRESS_TRACKER.md` §12.3 for the L1/L2/L3 completion model.

```yaml
completion_level_supported: "PENDING — to be filled by CS2 (L2 or L3)"
completion_level_rationale: "PENDING — explain which fields confirm this level"
```

**Example**:
```yaml
completion_level_supported: "L3"
completion_level_rationale: "All LUIEP fields confirmed: deployment_url_confirmed YES, ui_renders_correctly YES, auth_flow_confirmed YES, e2e_workflow_confirmed YES, screenshots_provided YES, cs2_sign_off 2026-05-15. Route inventory: all 9 required routes verified with screenshots. Network/API evidence: 2 endpoints confirmed. L3 (Operationally Closed) requirements fully met."
```

**Permitted values for `completion_level_supported`**: `L2` | `L3`

---

## Validation Checklist (Self-Check Before Committing)

Before committing this LUIEP artifact, verify:

- [ ] All `PENDING — to be filled by CS2` placeholders have been replaced with real values
- [ ] `cs2_sign_off` is a date (not `PENDING`)
- [ ] `deployment_url_confirmed: YES` (for L2 or L3 claims)
- [ ] `ui_renders_correctly: YES` (for L2 or L3 claims)
- [ ] `auth_flow_confirmed: YES` (for L2 or L3 claims)
- [ ] `e2e_workflow_confirmed: YES` (for L3 claims)
- [ ] `screenshots_provided: YES` (for L2 or L3 claims)
- [ ] `evidence_pack_date` is the date this pack was prepared (today's date)
- [ ] `route_inventory` covers all 9 required routes (`/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/onboarding`, `/dashboard`, `/frameworks`, `/frameworks/upload`)
- [ ] Each route's `screenshot_ref` is a real committed screenshot path (not `PENDING`)
- [ ] `network_api_evidence` has at least one confirmed (non-PENDING) `endpoint` with a `status_code`
- [ ] `operational_status_matrix` is present and covers all required routes
- [ ] No fields claim completion of items that have not been personally verified on the live platform
- [ ] LUIEP path is referenced in the PREHANDOVER proof

---

**Template Version**: 1.1.0
**Canon ref**: `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md` v1.1.0
**Checklist ref**: `governance/checklists/mmm-ui-evidence-pack-checklist.md`
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Effective Date**: 2026-04-30
