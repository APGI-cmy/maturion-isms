# PIT W8.2 QP / IAA / CS2 Evidence Disposition

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 12 - Build Execution & Evidence |
| Slice / Wave | W8.2 boundary and entitlement handoff correction |
| Disposition date | 2026-06-29 |
| Status | W8.2 BOUNDARY/HANDOFF EVIDENCE ACCEPTED FOR THIS SLICE |
| Production host | `https://maturion-isms-portal.vercel.app` |
| PIT deployment host | `https://maturion-pit.vercel.app` |
| Related PRs | #1847, #1850, #1853, #1861, #1865 |
| CS2 evidence source | Browser verification supplied by Johan Ras / CS2 |

---

## 1. Purpose

This artifact records the QP / IAA / CS2 disposition for the PIT W8.2 boundary and entitlement handoff correction.

It closes the specific W8.2 boundary/linkup evidence question that blocked progression after PR #1847. It does not close the full PIT Stage 12 build, does not create a functional pass for all PIT capability, and does not authorize handover or release readiness.

---

## 2. Background

Post-PR #1847 production evidence showed that:

- `maturion-pit.vercel.app` and `maturion-isms-portal.vercel.app` both rendered the ISMS public acquisition landing page;
- mock entitlement state could split across browser origins;
- the canonical ISMS subscription/onboarding journey could return to the dashboard without a usable PIT entitlement;
- clicking PIT could send the user back to subscription;
- therefore W8.2 could not be treated as complete.

PR #1850 established the platform/module boundary authority. PR #1853 aligned PIT pre-build artifacts to that authority. PR #1861 corrected the canonical ISMS entitlement handoff. PR #1865 corrected the remaining PIT deployment-host boundary by redirecting the PIT host to the canonical ISMS host.

---

## 3. Evidence reviewed

### 3.1 Canonical ISMS host boundary

CS2 browser evidence confirmed:

- `https://maturion-isms-portal.vercel.app/` remains on the canonical ISMS host;
- the ISMS landing page renders the Maturion ISMS public shell;
- scrolling to the module grid shows Project Implementation Tracker as the active PIT card;
- clicking Project Implementation Tracker opens the PIT runtime route when entitlement is already active.

### 3.2 PIT deployment host boundary

CS2 browser evidence confirmed:

- `https://maturion-pit.vercel.app/` redirects to `https://maturion-isms-portal.vercel.app/`;
- `https://maturion-pit.vercel.app/pit/tracker` redirects to `https://maturion-isms-portal.vercel.app/pit/tracker`;
- the PIT deployment host no longer presents itself as a duplicate public acquisition front door.

### 3.3 Non-entitled direct PIT runtime behavior

CS2 incognito evidence confirmed:

```text
https://maturion-isms-portal.vercel.app/pit/tracker
  -> https://maturion-isms-portal.vercel.app/subscribe?modules=project-implementation&source=direct-pit-tracker
```

This satisfies the expected non-entitled direct-route behavior for the W8.2 boundary slice.

### 3.4 Subscription / checkout / onboarding handoff

CS2 browser evidence confirmed:

- subscribing from the direct PIT runtime subscription path displays the subscription journey;
- completing mock checkout displays the checkout summary;
- signing in reaches the W3 mock authentication shell;
- onboarding captures organisation context;
- continuing to the protected dashboard reaches the ISMS workspace.

### 3.5 Dashboard entitlement state

CS2 browser evidence confirmed:

- the dashboard displays `Full mock bundle entitlement is active`;
- module cards display `Open module` actions;
- Project Implementation Tracker is available from the dashboard.

### 3.6 PIT runtime shell

CS2 browser evidence confirmed that opening Project Implementation Tracker from the dashboard renders:

```text
PIT STAGE 12 SLICE 1
Project Implementation Tracker
Protected Project Implementation Tracker workspace entry for entitled authenticated users.
Runtime state: data
Runtime shell ready. Stage 12 feature content will be delivered through governed slices.
```

The journey stops at this shell by design for the current slice. That is not a defect.

---

## 4. RED test disposition

| RED / evidence item | Result | Notes |
|---|---:|---|
| PIT-RED-BND-001 - public card non-entitled path | GREEN | Canonical ISMS routing and marketing/subscription path verified in prior evidence |
| PIT-RED-BND-003 - checkout/onboarding establishes entitlement | GREEN | Dashboard shows full mock bundle entitlement active |
| PIT-RED-BND-004 - entitled dashboard card opens runtime | GREEN | Dashboard `Open module` opens `/pit/tracker` |
| PIT-RED-BND-005 - non-entitled direct `/pit/tracker` behavior | GREEN | Incognito direct route redirects to subscription with `project-implementation` module query |
| PIT-RED-BND-006 - entitled direct/runtime shell | GREEN | Runtime shell renders for entitled user |
| PIT-RED-BND-007 - PIT host duplicate public acquisition surface | GREEN | PIT host root and runtime route redirect to canonical ISMS host |
| PR #1861 canonical entitlement-loop fix | GREEN | Subscription loop no longer reproduced in CS2 evidence |
| PR #1865 host-policy correction | GREEN | Canonical redirect behavior verified in production browser evidence |

---

## 5. QP disposition

QP accepts the W8.2 boundary/linkup evidence for this slice.

The evidence is sufficient to say:

```text
PIT W8.2 boundary and entitlement handoff correction is evidence-accepted for this slice.
```

QP does not accept any broader claim that the full PIT module is functionally complete.

---

## 6. IAA disposition

IAA challenge questions for this slice are satisfied:

- The canonical ISMS host remains the public acquisition host.
- The PIT deployment host no longer acts as a duplicate public acquisition front door.
- Non-entitled PIT runtime access redirects predictably.
- Completed mock checkout/onboarding establishes dashboard entitlement state.
- Entitled dashboard access opens the PIT runtime shell.
- The current runtime stop point is the expected Stage 12 Slice 1 shell.

IAA does not close full Stage 12 and does not certify release readiness from this slice alone.

---

## 7. CS2 disposition

CS2 browser evidence supports accepting W8.2 boundary/linkup correction evidence.

Accepted CS2 wording:

```text
W8.2 boundary and ISMS/PIT handoff evidence accepted. Proceed to next governed PIT Stage 12 slice.
```

Rejected wording:

```text
PIT is complete.
Stage 12 is complete.
Production ready.
Functional pass.
Release ready.
Handover complete.
```

---

## 8. Remaining Stage 12 posture

PIT Stage 12 remains active and incomplete.

The next work should proceed through a governed slice that builds actual PIT runtime feature content beyond the current shell.

The current runtime shell evidence is a valid handoff foundation, not an end-state module delivery.

---

## 9. Next authorized planning step

Open the next governed PIT Stage 12 slice with:

- explicit slice objective;
- pre-build traceability to PIT FRS/TRS/Architecture/QA-to-Red;
- builder appointment or reconfirmation;
- QA-to-Green criteria;
- production evidence expectations;
- no cross-module boundary expansion unless explicitly classified and approved.

---

## 10. Final disposition statement

```text
PIT W8.2 boundary and entitlement handoff evidence is accepted for this slice.
PIT-RED-BND-007 is green on production browser evidence.
The canonical ISMS -> PIT entitlement handoff remains green.
PIT Stage 12 remains incomplete and must continue through governed runtime slices.
```
