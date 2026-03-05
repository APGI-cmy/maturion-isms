# MAT — Liveness Test Specification

**Status:** Authoritative Draft
**Version:** v1.0
**Owner:** Johan Ras (CS2 / Product Owner)
**Date:** 2026-03-05
**Authority:** CS2 direct
**Supersedes:** N/A (new artifact)
**Derived from:** MAT_UX_WORKFLOW_AND_WIRING.md v1.0 (all STEP 0–10 + AI Capability Routing Summary §7)
**Future linkage:** app_management_centre watchdog panel (green/red ticklist with drill-down)

---

## 0. Purpose of This Document

This document specifies the **MAT Liveness Test Suite** — a test suite that does not test whether the app was built correctly in theory. It tests whether the **live, deployed app is alive right now**.

The suite follows the actual UX workflow defined in `MAT_UX_WORKFLOW_AND_WIRING.md` step by step, as a real user would, and answers one question per step: **"Does this work?**

### What Makes This Different from a Unit Test or Integration Test

| Test Type | What It Asks | When It Runs |
|---|---|---|
| Unit test | Does this function return the right value? | Every PR |
| Integration test | Does this API endpoint respond correctly? | Every PR |
| **Liveness test** | **Is the live app alive and usable right now?** | **Post-deploy, on demand, continuously** |

### Outputs

For each liveness check run, the suite produces:

1. **Machine report** — JSON result with ✅ PASS / ❌ FAIL / ⚠️ WARN per check, with screenshot evidence
2. **Human summary** — Markdown assurance report for CS2 review
3. **Manual checklist** — Items that require human verification (email delivery, AI quality judgment, file inspection)
4. **Future: AMC watchdog panel** — This spec is the upstream authority for the green/red ticklist panel to be built in `app_management_centre`. Each check in this spec maps 1:1 to a row in that panel with drill-down to the screenshot and error detail.

---

## 1. Liveness Check Index

Each check has:
- **ID** — unique identifier, usable as the AMC watchdog panel row key
- **Step** — the UX workflow step it covers (from `MAT_UX_WORKFLOW_AND_WIRING.md`)
- **Type** — `AUTO` (Playwright), `VISUAL` (screenshot), `AI` (AI interface probe), `MANUAL` (human verification required)
- **Blocking** — whether a FAIL here should block the green status of the whole suite

| ID | Step | Description | Type | Blocking |
|----|------|-------------|------|----------|
| LV-00-01 | STEP 0 | Sign-up page loads and form fields are present | AUTO | YES |
| LV-00-02 | STEP 0 | Sign-up form accepts input and navigates to /onboarding | AUTO | YES |
| LV-00-03 | STEP 0 | Onboarding wizard Step 1 (name) accepts input | AUTO | YES |
| LV-00-04 | STEP 0 | Onboarding wizard Step 2 (org name) accepts input and submits | AUTO | YES |
| LV-00-05 | STEP 0 | Confirmation email dispatch fires (machine confirms API call; human confirms receipt) | AUTO+MANUAL | NO |
| LV-01-01 | STEP 1 | Dashboard home loads with "Create New Audit" button visible | AUTO | YES |
| LV-01-02 | STEP 1 | Create New Audit modal/form opens on button click | AUTO | YES |
| LV-01-03 | STEP 1 | Audit creation form accepts all metadata fields | AUTO | YES |
| LV-01-04 | STEP 1 | Submitting audit creation navigates to audit workspace | AUTO | YES |
| LV-02-01 | STEP 2 | Upload Criteria Document button is present and clickable | AUTO | YES |
| LV-02-02 | STEP 2 | PDF upload is accepted by the file input | AUTO | YES |
| LV-02-03 | STEP 2 | AI document parser fires on upload (API call confirmed) | AI | YES |
| LV-02-04 | STEP 2 | Domain / MPS / Criteria hierarchy cards appear after parse | AUTO | YES |
| LV-02-05 | STEP 2 | Screenshot: hierarchy is populated, not blank | VISUAL | YES |
| LV-03-01 | STEP 3 | Domain card renders with title and toggle | AUTO | YES |
| LV-03-02 | STEP 3 | Domain card toggle (exclude) greys out domain and cascades to MPS/Criteria | AUTO | YES |
| LV-03-03 | STEP 3 | MPS card renders within domain with correct hierarchy | AUTO | YES |
| LV-03-04 | STEP 3 | Criteria card renders within MPS | AUTO | YES |
| LV-03-05 | STEP 3 | Level descriptor is visible on Criteria card | AUTO | YES |
| LV-03-06 | STEP 3 | Screenshot: Domain card — not blank | VISUAL | YES |
| LV-04-01 | STEP 4 | Invite Auditor button is present on Domain card | AUTO | YES |
| LV-04-02 | STEP 4 | Invite Auditor modal opens | AUTO | YES |
| LV-04-03 | STEP 4 | Invite form accepts email and role fields | AUTO | YES |
| LV-04-04 | STEP 4 | Invite submission fires API call (confirmed) | AUTO | YES |
| LV-04-05 | STEP 4 | Invitation email arrived in invited user's inbox | MANUAL | NO |
| LV-04-06 | STEP 4 | Invite Evidence Submitter button present at Criteria level | AUTO | YES |
| LV-05-01 | STEP 5 | Evidence upload panel opens on Criteria card | AUTO | YES |
| LV-05-02 | STEP 5 | Text evidence input field accepts text | AUTO | YES |
| LV-05-03 | STEP 5 | File evidence upload accepts a test document | AUTO | YES |
| LV-05-04 | STEP 5 | Photo upload button is present and triggers file picker | AUTO | YES |
| LV-05-05 | STEP 5 | Voice/video record button is present (click-and-hold interaction available) | AUTO | YES |
| LV-05-06 | STEP 5 | Uploaded evidence is listed in evidence card | AUTO | YES |
| LV-05-07 | STEP 5 | Evidence can be removed after upload | AUTO | YES |
| LV-05-08 | STEP 5 | Screenshot: evidence panel populated, not blank | VISUAL | YES |
| LV-06-01 | STEP 6 | Submit button is present on evidence panel | AUTO | YES |
| LV-06-02 | STEP 6 | Clicking Submit fires AI scoring request (API call confirmed) | AI | YES |
| LV-06-03 | STEP 6 | Loading/spinner state is shown while AI processes | AUTO | YES |
| LV-06-04 | STEP 6 | AI scoring result (rating + rationale) appears after Submit | AI | YES |
| LV-06-05 | STEP 6 | AI responds — response is non-empty and non-error | AI | YES |
| LV-06-06 | STEP 6 | AI next-level explanation (improvement path) is visible | AI | YES |
| LV-06-07 | STEP 6 | AI level+2 taster preview is visible | AI | YES |
| LV-06-08 | STEP 6 | AI Chat UI entry point (button/link) is present on criteria card | AUTO | YES |
| LV-06-09 | STEP 6 | AI Chat panel opens when triggered | AUTO | YES |
| LV-06-10 | STEP 6 | AI Chat responds to a test message (non-empty, non-error) | AI | YES |
| LV-06-11 | STEP 6 | Quality of AI scoring response is sensible | MANUAL | NO |
| LV-07-01 | STEP 7 | Audit Results Table is present after submission | AUTO | YES |
| LV-07-02 | STEP 7 | Results table shows Domain / MPS / Criteria / Rating / Findings / Recommendations columns | AUTO | YES |
| LV-07-03 | STEP 7 | Results table is populated (not empty rows) | AUTO | YES |
| LV-07-04 | STEP 7 | Screenshot: Results table — not blank | VISUAL | YES |
| LV-08-01 | STEP 8 | Dashboard loads with completion percentage visible | AUTO | YES |
| LV-08-02 | STEP 8 | Dashboard shows outstanding work items | AUTO | YES |
| LV-08-03 | STEP 8 | Dashboard drill-down to outstanding item navigates correctly | AUTO | YES |
| LV-08-04 | STEP 8 | "Create Report" button is inactive when outstanding work remains | AUTO | YES |
| LV-08-05 | STEP 8 | "Create Report" button becomes active when all work is addressed | AUTO | YES |
| LV-08-06 | STEP 8 | Screenshot: Dashboard — not blank | VISUAL | YES |
| LV-09-01 | STEP 9 | Criteria-level descriptor card shows current level text | AUTO | YES |
| LV-09-02 | STEP 9 | MPS-level descriptor card shows aggregated level | AUTO | YES |
| LV-09-03 | STEP 9 | Domain-level descriptor card shows aggregated level | AUTO | YES |
| LV-10-01 | STEP 10 | "Create Report" button fires AI report generation request (API call confirmed) | AI | YES |
| LV-10-02 | STEP 10 | AI report generation responds (non-empty, non-error) | AI | YES |
| LV-10-03 | STEP 10 | Report is available for download in at least one format (PDF or DOCX) | AUTO | YES |
| LV-10-04 | STEP 10 | Downloaded PDF file is non-zero bytes | AUTO | YES |
| LV-10-05 | STEP 10 | Downloaded PDF opens correctly and contains expected sections | MANUAL | NO |
| LV-10-06 | STEP 10 | Downloaded DOCX opens correctly in Word/LibreOffice | MANUAL | NO |
| LV-AI-01 | AI HEALTH | AI Centre gateway is reachable (health check endpoint responds 200) | AI | YES |
| LV-AI-02 | AI HEALTH | Document parser model is available (probe with empty payload) | AI | YES |
| LV-AI-03 | AI HEALTH | Maturity scoring model is available (probe with minimal payload) | AI | YES |
| LV-AI-04 | AI HEALTH | Report writer model is available (probe with minimal payload) | AI | YES |
| LV-AI-05 | AI HEALTH | AI chat model is available (probe with test message) | AI | YES |
| LV-AI-06 | AI HEALTH | All AI responses are received within acceptable latency (< 30s) | AI | YES |

---

## 2. Check Definitions

Each check definition specifies exactly what the automated runner must do and what constitutes PASS/FAIL.

---

### LV-00-xx — Sign Up & Onboarding

#### LV-00-01
```
Navigate to: /signup (or /auth/signup)
Assert: page title or heading contains "Sign" or "Create account"
Assert: input[name=email] is visible
Assert: input[name=password] is visible
Assert: button[type=submit] is visible
PASS: all assertions true
FAIL: any element not found or page does not load within 10s
```

#### LV-00-02
```
Navigate to: /signup
Fill: email = liveness-test-{timestamp}@liveness.test
Fill: password = LivenessTest!2026
Click: button[type=submit]
Assert: URL changes to /onboarding (or redirects to email confirmation screen)
PASS: redirect occurs within 10s
FAIL: no redirect, error message appears, or request times out
Screenshot: save as liveness-evidence/LV-00-02-signup.png
```

#### LV-00-03
```
Assert: heading contains "Name" or "Your name" or "What should we call you"
Fill: full name field = "Liveness Test User"
Click: "Next" button
Assert: wizard advances to step 2
PASS: step 2 visible within 5s
FAIL: no advance, error, or timeout
```

#### LV-00-04
```
Assert: heading contains "Organisation" or "Company" or "Workspace"
Fill: organisation name = "Liveness Test Org {timestamp}"
Click: submit/finish button
Assert: redirected to main dashboard or home screen
PASS: redirect within 10s
FAIL: no redirect or error
Screenshot: save as liveness-evidence/LV-00-04-onboarding-complete.png
```

#### LV-00-05 (AUTO component)
```
Monitor network requests during LV-00-02
Assert: POST request to auth/signup or equivalent was made
Assert: response status was 200 or 201
PASS: API call confirmed
FAIL: no request made or error response
MANUAL: Verify confirmation email arrived in liveness-test email inbox
```

---

### LV-01-xx — Create New Audit

#### LV-01-01
```
Navigate to: / (dashboard)
Assert: "Create New Audit" button or equivalent CTA is visible
Assert: no blank screen (body text length > 50 characters)
Screenshot: save as liveness-evidence/LV-01-01-dashboard.png
PASS: button visible, page not blank
FAIL: button not found or blank screen
```

#### LV-01-02
```
Click: "Create New Audit" button
Assert: modal or form appears within 3s
Assert: form contains at least one input field
PASS: form/modal visible
FAIL: nothing happens or error
```

#### LV-01-03
```
Fill: audit name = "MAT Liveness Test Audit {timestamp}"
Fill: any other required fields (organisation, date, description if present)
Assert: no validation errors on valid input
PASS: fields accept input without error
FAIL: validation error on valid input or field not fillable
```

#### LV-01-04
```
Click: submit/create/save button
Assert: navigated to audit workspace URL (e.g. /audits/{id})
Assert: audit name is visible on the workspace page
PASS: navigation within 10s
FAIL: no navigation or error
Screenshot: save as liveness-evidence/LV-01-04-audit-workspace.png
```

---

### LV-02-xx — Upload Criteria Document

#### LV-02-01
```
Assert: "Upload" or "Upload Criteria" or "Upload Document" button is visible
PASS: button visible
FAIL: button not found
```

#### LV-02-02
```
Click: upload button
Attach file: test-criteria-document.pdf (a valid, minimal PDF containing domain/criteria text)
Assert: file is accepted (no error, upload progress shown)
PASS: upload accepted within 30s
FAIL: rejection, error message, or timeout
```

#### LV-02-03 (AI check)
```
Monitor network requests during upload
Assert: a request is made to the AI document parser endpoint (e.g. /api/parse-document or equivalent)
Assert: response status is 200
Assert: response body is non-empty
PASS: AI parser API call confirmed with valid response
FAIL: no API call, error response, or empty response
AI_PROBE_TYPE: document-parser
```

#### LV-02-04
```
After upload completes:
Assert: at least one Domain card is visible on screen
Assert: at least one MPS card is visible within a domain
Assert: at least one Criteria card is visible within an MPS
PASS: hierarchy cards present within 60s of upload
FAIL: no cards appear or timeout
```

#### LV-02-05 (VISUAL)
```
Take screenshot of the full audit workspace after hierarchy renders
Assert: screenshot pixel entropy is above threshold (not a blank white page)
Assert: at least 3 distinct card elements are visible
Save: liveness-evidence/LV-02-05-hierarchy.png
PASS: non-blank, cards visible
FAIL: blank screen or cards absent
```

---

### LV-03-xx — Domain, MPS & Criteria Card Interaction

#### LV-03-01
```
Assert: Domain card has visible title text
Assert: Domain card has a toggle or "Exclude" control
PASS: both present
FAIL: either absent
```

#### LV-03-02
```
Click: Domain card exclude toggle
Assert: domain card becomes visually greyed out (opacity change or "excluded" label)
Assert: MPS cards within the domain are also visually marked as excluded
Assert: Criteria cards within those MPS are also marked excluded
PASS: cascade visible within 3s
FAIL: no visual change or cascade does not propagate
```

#### LV-03-03
```
Re-enable the domain (click toggle again to undo)
Assert: domain returns to normal state
Assert: MPS card within domain has visible title
Assert: MPS card has expand/collapse or its own nested cards visible
PASS: MPS visible and domain restored
FAIL: domain does not restore or MPS not visible
```

#### LV-03-04
```
Assert: Criteria card is visible within MPS
Assert: Criteria card shows criteria title text
PASS: visible with text
FAIL: not found
```

#### LV-03-05
```
Assert: Criteria card shows a level descriptor (e.g. "Level 1", "Not Started", or level text block)
PASS: descriptor visible
FAIL: descriptor absent
```

#### LV-03-06 (VISUAL)
```
Screenshot: full domain card area
Assert: non-blank, contains text
Save: liveness-evidence/LV-03-06-domain-card.png
```

---

### LV-04-xx — Invitation System

#### LV-04-01
```
Assert: Domain card contains "Invite Auditor" or equivalent button
PASS: button visible
FAIL: button absent
```

#### LV-04-02
```
Click: Invite Auditor button
Assert: modal or panel opens within 3s
PASS: modal opens
FAIL: nothing happens
```

#### LV-04-03
```
Assert: email input field present in invite modal
Assert: role selector (Domain Auditor / MPS Auditor) present
Fill: email = invited-auditor@liveness.test
Select: role
PASS: fields accept input
FAIL: fields absent or reject input
```

#### LV-04-04
```
Click: Send Invite / Submit button
Monitor: network request to invite API
Assert: API call made with status 200/201
PASS: API call confirmed
FAIL: no call or error
```

#### LV-04-05 (MANUAL)
```
MANUAL CHECK REQUIRED:
Action: Open email inbox for invited-auditor@liveness.test
Expected: Invitation email received within 5 minutes
Expected: Email contains a working accept link
Expected: Accept link navigates to signup/accept page
Record result: PASS / FAIL with timestamp
```

#### LV-04-06
```
Navigate to: a Criteria card
Assert: "Invite Evidence Submitter" or equivalent button is present at Criteria level
(This button should NOT be present at Domain level)
PASS: button present at criteria level
FAIL: button absent
```

---

### LV-05-xx — Evidence Upload Panel

#### LV-05-01
```
Click: Criteria card "Add Evidence" or "Submit Evidence" or evidence panel trigger
Assert: evidence upload panel opens within 3s
PASS: panel open
FAIL: does not open
```

#### LV-05-02
```
Assert: text input area is present
Fill: "This is liveness test evidence text submitted at {timestamp}"
Assert: text is accepted (no validation error)
PASS: accepted
FAIL: rejected or absent
```

#### LV-05-03
```
Assert: file upload button/area is present
Attach file: test-evidence.pdf (small valid PDF)
Assert: file is listed in evidence after attach
PASS: file listed
FAIL: rejected or not listed
```

#### LV-05-04
```
Assert: photo upload button or camera icon is present
Click: photo upload button
Assert: file picker opens or camera access prompt appears
PASS: interaction responds
FAIL: nothing happens
```

#### LV-05-05
```
Assert: voice/video record button is present (microphone or camera icon)
Assert: button is interactive (not disabled)
PASS: button present and enabled
FAIL: absent or disabled
```

#### LV-05-06
```
Assert: uploaded text evidence is listed in evidence card/list
Assert: uploaded file evidence is listed
PASS: both listed
FAIL: either not shown
```

#### LV-05-07
```
Assert: remove/delete control is present next to each evidence item
Click: remove on the test file evidence
Assert: evidence item is removed from list
PASS: item removed
FAIL: not removable or control absent
```

#### LV-05-08 (VISUAL)
```
Screenshot: evidence panel with evidence listed
Assert: non-blank, items visible
Save: liveness-evidence/LV-05-08-evidence-panel.png
```

---

### LV-06-xx — Submit & AI Evaluation

#### LV-06-01
```
Assert: Submit button is visible in the evidence panel
PASS: visible
FAIL: absent
```

#### LV-06-02 (AI check)
```
Click: Submit button
Monitor: network requests
Assert: request made to AI scoring endpoint (e.g. /api/score-evidence or equivalent)
Assert: response status 200
PASS: AI scoring API called
FAIL: no call or error
AI_PROBE_TYPE: maturity-scorer
```

#### LV-06-03
```
Assert: loading spinner or progress indicator is visible after Submit click
Assert: "Processing" or equivalent status message is shown
PASS: loading state visible
FAIL: no loading state (button click appears dead)
```

#### LV-06-04 (AI check)
```
Wait up to 30s for AI response
Assert: rating result (e.g. "Level 2", "Developing") is visible on criteria card
Assert: rationale text is present (non-empty string)
PASS: rating and rationale visible
FAIL: timeout or empty result
AI_PROBE_TYPE: maturity-scorer
```

#### LV-06-05 (AI check)
```
Assert: AI response body (from LV-06-02 network intercept) is:
  - Not empty
  - Not an error message (does not contain "error", "failed", "timeout" in root key)
  - Contains expected fields (rating, rationale, or equivalent per API contract)
PASS: all assertions true
FAIL: empty, error, or missing fields
```

#### LV-06-06 (AI check)
```
Assert: "What you need to improve" or "Next level" or equivalent improvement path section is visible after scoring
Assert: text content is non-empty
PASS: visible with content
FAIL: absent or empty
```

#### LV-06-07 (AI check)
```
Assert: Level+2 taster or "What level {n+2} looks like" section is visible
Assert: text content is non-empty
PASS: visible with content
FAIL: absent or empty
```

#### LV-06-08
```
Assert: "Chat" or "Ask AI" or AI chat icon/button is visible on or near the Criteria card
PASS: present
FAIL: absent
```

#### LV-06-09
```
Click: AI Chat button
Assert: chat panel or modal opens within 3s
Assert: message input field is present
PASS: panel open with input
FAIL: does not open
```

#### LV-06-10 (AI check)
```
Fill: message input = "Explain what level 3 maturity means for this criteria"
Click: send button or press Enter
Wait up to 30s
Assert: AI response is visible in chat panel
Assert: response is non-empty
Assert: response does not contain error text
PASS: response received and non-empty
FAIL: timeout, error, or empty
AI_PROBE_TYPE: ai-chat
Screenshot: save as liveness-evidence/LV-06-10-ai-chat.png
```

#### LV-06-11 (MANUAL)
```
MANUAL CHECK REQUIRED:
Review: AI scoring result shown on criteria card
Review: AI rationale text
Review: AI improvement path text
Review: AI chat response in LV-06-10
Expected: Responses are coherent, relevant to the criteria, and not garbled
Record result: PASS / FAIL with notes on quality
```

---

### LV-07-xx — Audit Results Table

#### LV-07-01
```
Navigate to: Audit Results or Results tab (after at least one submission)
Assert: results table is visible
PASS: table present
FAIL: not found or navigation fails
```

#### LV-07-02
```
Assert: table has column headers including:
  - Domain (or equivalent)
  - MPS (or equivalent)
  - Criteria (or equivalent)
  - Rating (or equivalent)
  - Findings or Recommendations (or equivalent)
PASS: all 5 column types present
FAIL: any column type absent
```

#### LV-07-03
```
Assert: at least one data row is present in the table (not all empty)
Assert: rating cell is non-empty
PASS: row with data present
FAIL: table empty or rating cell empty
```

#### LV-07-04 (VISUAL)
```
Screenshot: full results table
Assert: non-blank, rows visible
Save: liveness-evidence/LV-07-04-results-table.png
```

---

### LV-08-xx — Dashboard

#### LV-08-01
```
Navigate to: / (dashboard)
Assert: completion percentage indicator is visible (e.g. "60% complete" or progress bar)
PASS: visible
FAIL: absent
Screenshot: save as liveness-evidence/LV-08-01-dashboard.png
```

#### LV-08-02
```
Assert: outstanding work section or list is visible
Assert: at least one outstanding item is listed (given the liveness test audit has incomplete criteria)
PASS: list visible with items
FAIL: not visible
```

#### LV-08-03
```
Click: one outstanding work item
Assert: navigates to the relevant criteria card
Assert: that criteria card is visible
PASS: navigation and card visible
FAIL: navigation fails or wrong destination
```

#### LV-08-04
```
Assert: "Create Report" button is present
Assert: "Create Report" button is disabled/inactive (outstanding work exists)
PASS: button present and inactive
FAIL: button absent OR button is active when outstanding work exists (gate failure)
```

#### LV-08-05
```
NOTE: This check requires a complete audit (all criteria addressed).
In liveness test mode, assert button becomes active after all criteria are submitted.
If test audit is incomplete: SKIP this check and flag for next full liveness run.
PASS: button active on completion
SKIP: test audit not complete
FAIL: button remains inactive despite all criteria being addressed
```

#### LV-08-06 (VISUAL)
```
Screenshot: dashboard full view
Assert: non-blank
Save: liveness-evidence/LV-08-06-dashboard-full.png
```

---

### LV-09-xx — Level Descriptor Cards

#### LV-09-01
```
Navigate to: a Criteria card with a rating already assigned
Assert: criteria-level descriptor block is visible (the text block describing what the current level means)
Assert: descriptor text is non-empty
PASS: visible with content
FAIL: absent or empty
```

#### LV-09-02
```
Navigate to: an MPS card with at least one rated criteria beneath it
Assert: MPS-level descriptor block is visible showing aggregated level
Assert: descriptor text is non-empty
PASS: visible with content
FAIL: absent or empty
```

#### LV-09-03
```
Navigate to: a Domain card with at least one rated MPS beneath it
Assert: Domain-level descriptor block is visible showing aggregated level
Assert: descriptor text is non-empty
PASS: visible with content
FAIL: absent or empty
```

---

### LV-10-xx — Create Report

#### LV-10-01 (AI check)
```
Pre-condition: All criteria submitted (or LV-08-05 passed)
Click: "Create Report" button
Monitor: network requests
Assert: request to AI report writer endpoint is made
Assert: response status 200
PASS: AI report writer API called
FAIL: no call or error
AI_PROBE_TYPE: report-writer
```

#### LV-10-02 (AI check)
```
Wait up to 120s (report generation may take longer)
Assert: AI report writer response is non-empty
Assert: response does not contain error
PASS: valid response received
FAIL: timeout, error, or empty
```

#### LV-10-03
```
Assert: download options are presented (PDF and/or DOCX buttons visible)
PASS: at least one download option visible
FAIL: no download option
```

#### LV-10-04
```
Click: PDF download
Assert: downloaded file is received by browser
Assert: file size > 0 bytes (non-empty)
PASS: file downloaded and non-empty
FAIL: download fails or file is 0 bytes
```

#### LV-10-05 (MANUAL)
```
MANUAL CHECK REQUIRED:
Action: Open downloaded PDF in PDF reader
Expected: PDF opens without error
Expected: PDF contains report title
Expected: PDF contains Domain / MPS / Criteria sections
Expected: PDF contains ratings and recommendations
Record result: PASS / FAIL with notes
```

#### LV-10-06 (MANUAL)
```
MANUAL CHECK REQUIRED:
Action: Open downloaded DOCX in Word or LibreOffice (if DOCX export available)
Expected: File opens without error
Expected: Document is formatted correctly with expected sections
Record result: PASS / FAIL with notes
```

---

### LV-AI-xx — AI Health Probes

These checks run independently of the UX flow. They probe the AI Centre gateway directly to confirm all AI capabilities are available before any UX-level AI check is attempted. If any LV-AI-xx check fails, all dependent AI checks should be marked SKIP (not FAIL) until the AI health issue is resolved.

#### LV-AI-01
```
Request: GET /api/ai/health (or equivalent health endpoint)
Assert: response status 200
Assert: response body indicates healthy state
PASS: health endpoint 200 and healthy
FAIL: non-200 or unhealthy
```

#### LV-AI-02
```
Request: POST /api/ai/document-parser (probe with minimal test payload)
Assert: response status 200 or 422 (422 = endpoint reachable but payload too minimal — acceptable as probe)
Assert: response is NOT 500 or 503
PASS: endpoint reachable
FAIL: 500 or 503 or connection refused
AI_PROBE_TYPE: document-parser
```

#### LV-AI-03
```
Request: POST /api/ai/score (probe with minimal test payload)
Assert: response is NOT 500 or 503
PASS: endpoint reachable
FAIL: 500 or 503
AI_PROBE_TYPE: maturity-scorer
```

#### LV-AI-04
```
Request: POST /api/ai/report (probe with minimal test payload)
Assert: response is NOT 500 or 503
PASS: endpoint reachable
FAIL: 500 or 503
AI_PROBE_TYPE: report-writer
```

#### LV-AI-05
```
Request: POST /api/ai/chat (probe with message: "ping")
Assert: response is NOT 500 or 503
Assert: response body is non-empty
PASS: chat endpoint responds
FAIL: 500 or 503 or empty
AI_PROBE_TYPE: ai-chat
```

#### LV-AI-06
```
For each AI API call made during LV-06-02, LV-06-04, LV-06-10, LV-10-01:
Assert: response received within 30 seconds
If report generation (LV-10-01): allow up to 120 seconds
PASS: all AI responses within time limits
FAIL: any AI response exceeds time limit
WARN: response received but took > 15 seconds (flag for investigation)
```

---

## 3. Manual Liveness Checklist

Print or export this checklist after every automated run. Items marked `(MANUAL)` require human verification.

```
MAT MANUAL LIVENESS CHECKLIST
Generated from: MAT_LIVENESS_TEST_SPEC.md v1.0
Run date: _______________
Run by: _______________
Environment: _______________

INVITATIONS
[ ] LV-04-05: Invitation email arrived in invited user's inbox within 5 minutes
[ ] LV-04-05: Invitation email contains working accept link
[ ] LV-04-05: Accept link navigates to signup/accept page

AI QUALITY (JUDGMENT REQUIRED)
[ ] LV-06-11: AI scoring result is coherent and relevant to the criteria
[ ] LV-06-11: AI rationale text is sensible (not garbled/empty/generic)
[ ] LV-06-11: AI improvement path is actionable
[ ] LV-06-11: AI chat response is relevant and not an error message

REPORT OUTPUT
[ ] LV-10-05: PDF report opens without error in PDF reader
[ ] LV-10-05: PDF contains report title, Domain/MPS/Criteria sections, ratings, recommendations
[ ] LV-10-06: DOCX report opens without error in Word or LibreOffice
[ ] LV-10-06: DOCX is correctly formatted with expected sections

ADDITIONAL HUMAN CHECKS (not covered by automation)
[ ] Notifications: Push notifications received on mobile device (if enabled)
[ ] Audio: Voice recording playback works correctly in evidence panel
[ ] Video: Video recording playback works correctly in evidence panel
[ ] Offline: Evidence capture works when network is disconnected (reconnects on restore)

OVERALL MANUAL VERDICT: __________ (PASS / FAIL / PARTIAL)
Notes: _______________
```

---

## 4. Screenshot Evidence Manifest

Every automated run must produce the following screenshot files:

| File | Check | What to Look For |
|------|-------|-----------------|
| `liveness-evidence/LV-00-02-signup.png` | LV-00-02 | Sign-up form visible and filled |
| `liveness-evidence/LV-00-04-onboarding-complete.png` | LV-00-04 | Dashboard after onboarding |
| `liveness-evidence/LV-01-01-dashboard.png` | LV-01-01 | Dashboard with Create button |
| `liveness-evidence/LV-01-04-audit-workspace.png` | LV-01-04 | Audit workspace after creation |
| `liveness-evidence/LV-02-05-hierarchy.png` | LV-02-05 | Domain/MPS/Criteria hierarchy populated |
| `liveness-evidence/LV-03-06-domain-card.png` | LV-03-06 | Domain card with controls |
| `liveness-evidence/LV-05-08-evidence-panel.png` | LV-05-08 | Evidence panel with items listed |
| `liveness-evidence/LV-06-10-ai-chat.png` | LV-06-10 | AI chat with response visible |
| `liveness-evidence/LV-07-04-results-table.png` | LV-07-04 | Results table with data rows |
| `liveness-evidence/LV-08-01-dashboard.png` | LV-08-01 | Dashboard with completion % |
| `liveness-evidence/LV-08-06-dashboard-full.png` | LV-08-06 | Full dashboard view |

---

## 5. Assurance Report Format

After each run, the automated suite must produce a Markdown assurance report in the following format:

```markdown
# MAT Liveness Assurance Report
**Date:** {date}
**Environment:** {url}
**Run duration:** {duration}
**Triggered by:** {manual | post-deploy | scheduled}

## Summary
| Category | Total | PASS | FAIL | SKIP | WARN |
|----------|-------|------|------|------|------|
| AUTO checks | {n} | {n} | {n} | {n} | {n} |
| VISUAL checks | {n} | {n} | {n} | {n} | {n} |
| AI checks | {n} | {n} | {n} | {n} | {n} |
| MANUAL (pending) | {n} | — | — | — | — |
| **TOTAL** | **{n}** | **{n}** | **{n}** | **{n}** | **{n}** |

## Overall Verdict
{✅ LIVE | ❌ DEGRADED | ⚠️ PARTIAL}

## Failed Checks
{list of FAIL checks with error detail and screenshot reference}

## Warnings
{list of WARN checks}

## AI Health Summary
| AI Capability | Status | Latency |
|---|---|---|
| Document Parser | ✅ / ❌ | {ms} |
| Maturity Scorer | ✅ / ❌ | {ms} |
| Report Writer | ✅ / ❌ | {ms} |
| AI Chat | ✅ / ❌ | {ms} |

## Screenshots
{links to screenshot evidence files}

## Manual Checklist Status
Pending human verification — see Section 3 of MAT_LIVENESS_TEST_SPEC.md
```

---

## 6. AMC Watchdog Panel Integration (Future)

This spec is designed to be the upstream authority for the **app_management_centre (AMC) watchdog panel**.

When the AMC watchdog panel is built, each row in the green/red ticklist maps directly to a check ID in this document:

| AMC Panel Row Key | Source Check | Drill-Down |
|---|---|---|
| `mat.liveness.signup` | LV-00-01 to LV-00-04 | Screenshot + error log |
| `mat.liveness.create-audit` | LV-01-01 to LV-01-04 | Screenshot + error log |
| `mat.liveness.document-upload` | LV-02-01 to LV-02-05 | Screenshot + AI response |
| `mat.liveness.hierarchy` | LV-03-01 to LV-03-06 | Screenshot |
| `mat.liveness.invitations` | LV-04-01 to LV-04-06 | API call log |
| `mat.liveness.evidence` | LV-05-01 to LV-05-08 | Screenshot |
| `mat.liveness.ai-submit` | LV-06-01 to LV-06-10 | AI response + screenshot |
| `mat.liveness.results-table` | LV-07-01 to LV-07-04 | Screenshot |
| `mat.liveness.dashboard` | LV-08-01 to LV-08-06 | Screenshot |
| `mat.liveness.descriptors` | LV-09-01 to LV-09-03 | Screenshot |
| `mat.liveness.report` | LV-10-01 to LV-10-04 | Download log |
| `mat.liveness.ai-health` | LV-AI-01 to LV-AI-06 | Health probe log + latency |

The AMC panel must support:
- **One-hit run**: trigger the full liveness suite from a single button
- **Green/red status**: per check ID and per category group
- **Drill-down**: click any row to see screenshot, error message, AI response, and timestamp
- **Last run timestamp** and **run history** (last 10 runs)
- **Manual checklist integration**: display manual checklist items with a checkbox interface for human sign-off

---

## 7. File Structure

When implemented, the liveness suite lives here:

```
modules/mat/tests/liveness/
├── mat-liveness.spec.ts          ← Playwright E2E — LV-00 to LV-10
├── mat-ai-health.spec.ts         ← AI health probes — LV-AI-01 to LV-AI-06
├── mat-visual.spec.ts            ← Screenshot/blank-screen checks (VISUAL type)
├── fixtures/
│   ├── test-criteria-document.pdf  ← Minimal valid PDF for upload tests
│   └── test-evidence.pdf           ← Minimal valid PDF for evidence tests
├── liveness-evidence/            ← Screenshot output directory (gitignored, populated at runtime)
└── reports/                      ← Assurance report output (gitignored, populated at runtime)
```

---

## 8. Authority and Linkage

| Authority | Reference |
|---|---|
| UX workflow source of truth | `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` v1.0 |
| AI capability routing | `MAT_UX_WORKFLOW_AND_WIRING.md §7` |
| Test implementation location | `modules/mat/tests/liveness/` |
| AMC watchdog panel (future) | `app_management_centre` — watchdog requirements (links to Section 6 above) |
| CI trigger | Post-deploy hook in `.github/workflows/deploy-mat-vercel.yml` (future `liveness` job) |
| Human sign-off | Section 3 Manual Checklist |
| Assurance report format | Section 5 |

**This document is the commissioning authority for:**
1. The QA-builder implementing `modules/mat/tests/liveness/`
2. The AMC-builder implementing the watchdog panel in `app_management_centre`
3. Any CI job that runs liveness checks post-deploy

**CS2 approval required** to modify Sections 1 (Check Index), 2 (Check Definitions), or 6 (AMC Integration).