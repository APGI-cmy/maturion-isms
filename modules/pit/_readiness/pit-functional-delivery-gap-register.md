# PIT Functional Delivery Gap Register

**Module**: PIT (Project Implementation Tracker)  
**Wave**: pit-prebuilt-retrofit-20260508  
**Governing Issue**: maturion-isms#1575  
**PR**: #1576  
**Reviewed By**: foreman-v2-agent (POLC-Orchestration mode)  
**Date**: 2026-05-08  
**Status**: ACTIVE — gaps identified; resolution required before stage re-confirmation

---

## Purpose

This register records functional delivery gaps identified during the PIT pre-build functional delivery retrofit review (maturion-isms#1575). Each entry identifies a specific gap, its severity, the affected artifact, and the required resolution action.

A "functional delivery gap" is a missing specification, missing technical control, or missing evidence requirement that would prevent a builder, QA-to-Red agent, PBFAG reviewer, or CS2 verifier from deriving or verifying a complete, working, deployable, visually correct, permission-safe, and operationally verifiable app without filling gaps by assumption.

---

## Gap Register

### UX-GAP-001 — 404 Route State and Wiring Entries Missing

| Field | Value |
|---|---|
| Gap ID | UX-GAP-001 |
| Severity | **NON-BLOCKING** — does not block Stage 2 re-confirmation |
| Affected Artifact | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Affected Sections | Section 4 (UI States matrix), Section 7 (Screen-to-Data Wiring) |
| Gap Description | The 404 Not Found route (`/*` catch-all, rendering 404 Not Found page) is listed in Section 9 (Deployment Surface Map) but its 5-state UI matrix entry (Section 4) and screen-to-data wiring entry (Section 7) are absent. The 404 route has a simpler state model than primary pages — it is data-only with no loading, empty, permission-denied, or network-error states applicable — but its absence from Sections 4 and 7 leaves a minor documentation gap. |
| Derivation | PIT-FR-104 (404 Not Found route requirement); PIT-TR-016 (Catch-all 404 route TRS requirement) |
| Required Resolution | Add 404 route entry to Section 4 of the UX Spec (state: data-only — `loading`, `empty`, `permission-denied`, `network-error` states N/A for a static 404 page) and Section 7 (wiring: static — no API calls, no data dependencies). This is a documentation completeness action, not a design decision. |
| Blocking Stage | Does not block Stage 2 re-confirmation. Must be resolved before Stage 5 Architecture gate-pass. |
| Resolution Status | ❌ OPEN |
| Resolution PR | — |
| Resolution Date | — |

---

### UX-GAP-002 — Notification History Screen Spec Missing

| Field | Value |
|---|---|
| Gap ID | UX-GAP-002 |
| Severity | **BLOCKING — blocks Stage 2 re-confirmation** |
| Affected Artifact | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Affected Sections | Section 2 (Primary App Screens), Section 4 (UI States matrix), Section 7 (Screen-to-Data Wiring) |
| Gap Description | The `/notifications` route is listed in Section 9 (Deployment Surface Map) and corresponds to the notification history view (PIT-FR-116). However, the screen specification (Section 2), the 5-state UI matrix entry (Section 4), and the screen-to-data wiring entry (Section 7) for the notification history screen are absent from the UX Spec v0.2-draft. This gap was introduced when PIT-FR-116 (Notification History View) was added to the FRS in the hardening wave (maturion-isms#1556) after the UX Spec was completed. The notification history screen is a primary authenticated page and requires full coverage. |
| Derivation | PIT-FR-116 (Notification History View); PIT-TR-119 (Notification History View Technical Contract); Route: `/notifications` (Appendix A row 25) |
| Required Resolution | Add the following to Stage 2 UX Spec: (1) Screen 22: Notification History — Section 2 screen spec with screen description, route, authentication requirement, role access, layout, key components, primary actions, empty state; (2) Section 4 entry for Notification History with all 5 UI states (loading → skeleton cards; empty → "No notifications" state; permission-denied → N/A (all authenticated users can view their own notifications); network-error → retry CTA; data → paginated notification list); (3) Section 7 wiring entry for Notification History (data source: `notifications` table filtered to current user, sorted by `created_at DESC`, paginated by 20; API: `GET /notifications?page=N`). |
| Blocking Stage | **BLOCKING for Stage 2 re-confirmation**. Must be resolved before Stage 2 can be re-confirmed by CS2. Must also be resolved before Stage 5 Architecture gate-pass. |
| Resolution Status | ❌ OPEN |
| Resolution PR | — |
| Resolution Date | — |

---

### TRS-GAP-001 — RESOLVED — FRS v0.2-Hardened Propagation

| Field | Value |
|---|---|
| Gap ID | TRS-GAP-001 |
| Severity | Was BLOCKING — now RESOLVED |
| Affected Artifact | `modules/pit/03-trs/technical-requirements-specification.md` |
| Gap Description | TRS v0.1-draft derived from FRS v0.1-draft and had not incorporated PIT-FR-113 through PIT-FR-123, which were added in the FRS hardening wave (maturion-isms#1556). The stale maturion-isms#1556 dependency notice indicated the propagation was pending. |
| Resolution | PIT-TR-116 through PIT-TR-126 added in Section 31 of TRS (PR #1576). TRS derivation updated to FRS v0.2-hardened. FRS-to-TRS traceability Section 30 added. All 123 FRS requirements now traced. |
| Resolution Status | ✅ RESOLVED — PR #1576 (2026-05-08) |
| Resolution PR | #1576 |
| Resolution Date | 2026-05-08 |

---

## Summary

| Gap ID | Description | Severity | Status |
|---|---|---|---|
| UX-GAP-001 | 404 route state/wiring entries missing from UX Spec | NON-BLOCKING | ❌ OPEN |
| UX-GAP-002 | Notification history screen spec missing from UX Spec | **BLOCKING (Stage 2 re-confirmation)** | ❌ OPEN |
| TRS-GAP-001 | FRS v0.2-hardened not propagated into TRS | BLOCKING (Stage 4 approval) | ✅ RESOLVED (PR #1576) |

**Open Blocking Gaps**: 1 (UX-GAP-002)  
**Open Non-Blocking Gaps**: 1 (UX-GAP-001)  
**Resolved Gaps**: 1 (TRS-GAP-001)

---

## Gap Resolution Instructions

**For UX-GAP-001**: A non-material documentation completeness PR to add 404 route entries to UX Spec Sections 4 and 7. Can be delegated to pit-specialist or handled in the next Stage 2 amendment wave.

**For UX-GAP-002**: Requires a Stage 2 UX Spec amendment PR adding the notification history screen specification (Screen 22) to Sections 2, 4, and 7. This PR requires Foreman review and CS2 approval as a Stage 2 amendment. The notification history screen must be added before Stage 2 can be re-confirmed. Can be delegated to pit-specialist with Foreman QP review.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Last Updated**: 2026-05-08 (maturion-isms#1575 / PR #1576)
