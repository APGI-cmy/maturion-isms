# PIT — Timeline Engine RED Tests

## Stage 6 — QA-to-Red

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Timeline Engine RED Tests |
| Version | v1.0 |
| Source | FRS (PIT-FR-068–076), TRS (PIT-TR-064–067), Architecture ADR-PIT-001 |
| Author | foreman-v2-agent |
| Date | 2026-05-13 |
| Issue | maturion-isms#1625 |

---

## Architecture Reference

The Timeline Engine is governed by:
- `modules/pit/04-architecture/timeline-engine-architecture-decision.md` (ADR-PIT-001)
- TRS PIT-TR-064 (rendering model and alignment architecture)
- TRS PIT-TR-066 (date mathematics and alignment contract)
- TRS PIT-TR-067 (interaction, persistence, performance, QA contract)

Key architectural decisions:
- DST-safe date math (position calculation uses day offsets, not timestamps)
- Virtualisation required for large projects (>100 tasks)
- Drag/resize must persist to Supabase (not just local state)
- All timeline interactions must be keyboard-accessible

---

## RED Test Specifications

### TL-01: Timeline Route Load

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-001 |
| Source | PIT-TR-064, PIT-FR-068 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Project exists with at least 1 task with dates |
| Action | Navigate directly to timeline route (direct URL load) |
| Expected Failure (RED) | 404 or blank screen, or timeline not rendered within 500ms |
| Expected GREEN Behaviour | Timeline renders within 500ms; Gantt chart visible with task bars; today line visible |
| Harness/Tool | Playwright E2E (deployed environment) |
| Evidence Artifact | screenshot, performance trace (timeline_load.png, performance.json) |
| Priority | P1 |

---

### TL-02: Date-to-Pixel Mapping Accuracy

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-002 |
| Source | PIT-TR-066, ADR-PIT-001 |
| Route/Screen | Timeline domain (unit) |
| Actor/Role | Developer (unit test) |
| Precondition | View range: 2026-01-01 to 2026-01-31 (31 days); view width: 1000px |
| Action | Call `dateToPixel(date: '2026-01-16', viewStart: '2026-01-01', viewEnd: '2026-01-31', width: 1000)` |
| Expected Failure (RED) | Function not implemented, or returns NaN, or uses timestamps (DST-unsafe) |
| Expected GREEN Behaviour | Returns 500 (day 15 of 30-day range = 15/30 × 1000 = 500px). Calculation uses day offsets, not timestamps. |
| Harness/Tool | Vitest unit test |
| Evidence Artifact | test output (Vitest passing assertion) |
| Priority | P1 |

Additional DST-safe assertions:
- Test across DST boundary (e.g. 2026-03-29 UK Spring Forward): pixel position must not shift by 1 hour's worth of pixels.
- Test at year boundary (2025-12-31 to 2026-01-01): no discontinuity in pixel mapping.

---

### TL-03: Drag Task Bar — Persistence

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-003 |
| Source | PIT-TR-067, PIT-FR-072 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Task with dates exists in timeline; user has edit permissions |
| Action | Drag task bar 3 denominator units to the right using mouse drag |
| Expected Failure (RED) | Task bar moves visually but dates not persisted to Supabase; or drag not possible at all |
| Expected GREEN Behaviour | Task start/end dates updated in `tasks` table; changes visible after page reload; audit log entry created |
| Harness/Tool | Playwright E2E (drag simulation via `dragTo` or `mouse.move`) |
| Evidence Artifact | screenshot (before), screenshot (after), HAR showing PATCH/upsert request, DB snapshot |
| Priority | P2 |

---

### TL-04: Resize Task Bar — Persistence

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-004 |
| Source | PIT-TR-067, PIT-FR-072 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Task with dates exists in timeline |
| Action | Drag right resize handle 5 denominator units to the right |
| Expected Failure (RED) | Duration not changed; resize not possible; dates not persisted |
| Expected GREEN Behaviour | Task end date updated; start date unchanged; changes persist after reload |
| Harness/Tool | Playwright E2E |
| Evidence Artifact | screenshot (before/after), HAR |
| Priority | P2 |

---

### TL-05: Denominator Switching

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-005 |
| Source | PIT-TR-067, PIT-FR-069 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Timeline open with tasks visible |
| Action | Click "Week" button to switch denominator from Days to Weeks view |
| Expected Failure (RED) | View does not change; button has no effect; or tasks disappear |
| Expected GREEN Behaviour | Timeline re-renders with weeks as denominator; task bars proportionally re-scaled; all tasks still visible; today line repositioned |
| Harness/Tool | Playwright E2E |
| Evidence Artifact | screenshot (days view), screenshot (weeks view) |
| Priority | P2 |

---

### TL-06: Progress Overlay

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-006 |
| Source | PIT-TR-067, PIT-FR-070, PIT-FR-076 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Task exists with progress_percentage = 40 |
| Action | View task bar in timeline |
| Expected Failure (RED) | No progress fill on task bar; or full bar filled regardless of percentage |
| Expected GREEN Behaviour | Progress fill covers 40% of task bar width; visual fill uses distinct colour from total bar |
| Harness/Tool | Playwright E2E |
| Evidence Artifact | screenshot with annotated measurement |
| Priority | P2 |

---

### TL-07: Virtualisation Performance

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-007 |
| Source | PIT-TR-079, PIT-TR-067 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Project with 500 tasks (created via seed script) |
| Action | Load timeline page |
| Expected Failure (RED) | >500ms render time; or all 500 DOM nodes present in DOM (no virtualisation); or visible jank |
| Expected GREEN Behaviour | Timeline renders within 500ms; only visible rows present in DOM (~20–30 items); scroll performance smooth |
| Harness/Tool | Playwright E2E with Chromium performance trace |
| Evidence Artifact | performance.json (timeline_render trace), screenshot showing row count via DOM inspection |
| Priority | P2 |

---

### TL-08: Keyboard and Accessibility Fallback

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-008 |
| Source | PIT-TR-087, PIT-TR-067, PIT-FR-122 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | keyboard user (any authenticated role with edit permissions) |
| Precondition | Timeline open with tasks visible |
| Action | Tab to first task bar; use arrow keys to attempt date adjustment |
| Expected Failure (RED) | Task bars are not focusable via Tab; no keyboard interaction possible; no ARIA roles |
| Expected GREEN Behaviour | Task bars are reachable via Tab; arrow keys adjust dates or show "use drag mode" instruction; no axe-core violations on timeline page |
| Harness/Tool | Playwright E2E + axe-core |
| Evidence Artifact | accessibility-report.json, screenshot showing focused state |
| Priority | P2 |

---

### TL-09: Zoom Controls

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-009 |
| Source | PIT-FR-069 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Timeline open |
| Action | Click zoom-in button twice |
| Expected Failure (RED) | No zoom effect; task positions unchanged |
| Expected GREEN Behaviour | Timeline zoom level increases; task bars scaled proportionally; tasks remain visible and proportional |
| Harness/Tool | Playwright E2E |
| Evidence Artifact | screenshot (before/after zoom) |
| Priority | P3 |

---

### TL-10: Today Line Visibility

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-010 |
| Source | PIT-FR-071 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Timeline open; view range includes today's date |
| Action | View timeline |
| Expected Failure (RED) | No today line visible; or today line not at current date position |
| Expected GREEN Behaviour | Vertical today line rendered at correct position for current date; position matches date-to-pixel calculation |
| Harness/Tool | Playwright E2E |
| Evidence Artifact | screenshot with today line visible |
| Priority | P3 |

---

### TL-11: Visual Regression Baseline

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-011 |
| Source | PIT-TR-067 (QA contract: visual regression expectation) |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Timeline with 5 tasks of known dates |
| Action | Capture screenshot as visual regression baseline |
| Expected Failure (RED) | No baseline screenshot committed; visual regression not tracked |
| Expected GREEN Behaviour | Baseline screenshot committed to repository; subsequent builds compare against baseline; deviations flagged |
| Harness/Tool | Playwright E2E with `toHaveScreenshot()` |
| Evidence Artifact | baseline screenshot (timeline-baseline.png) committed to test fixtures |
| Priority | P2 |

---

### TL-12: Horizontal Scroll

| Field | Value |
|---|---|
| RED Test ID | PIT-RED-TIMELINE-012 |
| Source | PIT-TR-067 |
| Route/Screen | `/projects/:id/timeline` |
| Actor/Role | project_leader |
| Precondition | Tasks span 6 months; viewport shows 1 month at a time |
| Action | Scroll timeline horizontally to view future tasks |
| Expected Failure (RED) | Scroll not possible; tasks outside viewport not accessible |
| Expected GREEN Behaviour | Horizontal scroll works; tasks beyond viewport visible after scroll; virtual rows load seamlessly |
| Harness/Tool | Playwright E2E |
| Evidence Artifact | screenshot (before/after scroll) |
| Priority | P2 |

---

## Summary

| RED Test ID | Domain | Priority | Status |
|---|---|---|---|
| PIT-RED-TIMELINE-001 | Route load | P1 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-002 | Date-to-pixel math | P1 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-003 | Drag persistence | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-004 | Resize persistence | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-005 | Denominator switching | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-006 | Progress overlay | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-007 | Virtualisation performance | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-008 | Keyboard/accessibility | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-009 | Zoom controls | P3 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-010 | Today line | P3 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-011 | Visual regression baseline | P2 | RED_TEST_DEFINED |
| PIT-RED-TIMELINE-012 | Horizontal scroll | P2 | RED_TEST_DEFINED |

**12 timeline RED tests defined — All architecture timeline contracts covered.**
