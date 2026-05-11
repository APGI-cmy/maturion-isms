# PIT — Timeline Engine Architecture Decision Record

## Architecture Decision Record (ADR)

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| ADR ID | ADR-PIT-001 |
| Title | Timeline Engine Rendering Strategy, Library Selection, and QA Architecture |
| Status | **PROPOSED — Pending CS2 Stage 5 gate-pass** |
| Date | 2026-05-11 |
| Author | foreman-v2-agent |
| TRS Authority | PIT-TR-064, PIT-TR-065, PIT-TR-066, PIT-TR-067 |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 |

> **Governance Notice**: This ADR is a Stage 5 design/gate artifact. It does NOT authorise build implementation. Library selection is the PROPOSED candidate — final confirmation occurs at Stage 7 PBFAG after Stage 6 QA-to-Red is designed.

---

## 1. Context and Problem Statement

PIT requires a complex interactive project timeline with:
- Hierarchical rows (project → milestone → deliverable → task) with exact alignment to a date-based grid
- Draggable and resizable bars showing start/end dates
- Multi-row date headers (year/quarter/month/week/day denominators)
- Exact date-to-pixel and pixel-to-date mapping
- Hover labels showing exact date at cursor position
- Progress overlay inside bars
- Virtualisation for 1,000+ rows and 10-year horizontal range
- Locked timeline override/approval workflow
- WCAG 2.1 AA accessibility (including table alternative view)
- Playwright/E2E and visual regression testability
- Styling compatibility with PIT/Maturion UI system

Prior PIT build attempts failed because the timeline/tooling layer could not deliver the required interaction and alignment behaviour. This ADR exists because Stage 4 TRS (PIT-TR-064 through PIT-TR-067) explicitly prohibits generic "Gantt chart library" wording — the architecture must make bounded, justifiable decisions.

---

## 2. Stage 4 Mandatory Capabilities (Evaluation Criteria)

Per PIT-TR-065, the timeline tool/library must be evaluated against these criteria:

| # | Capability | Weight |
|---|---|---|
| C1 | Exact date-to-pixel mapping and inverse hover/cursor date resolution | CRITICAL |
| C2 | Drag and resize handles for start/end updates | CRITICAL |
| C3 | Progress overlay rendering inside each bar | CRITICAL |
| C4 | Multi-row denominator headers (year/quarter/month/week/day) | CRITICAL |
| C5 | User-selectable denominator + viewport presets (12m, 4q, 5y, 10y) | HIGH |
| C6 | Horizontal scrolling for long ranges (minimum 10-year range) | CRITICAL |
| C7 | Row virtualisation for large datasets (1,000 rows) | CRITICAL |
| C8 | Dependency/predecessor link rendering | HIGH |
| C9 | Nested hierarchy rendering (project → milestone → deliverable → task) | CRITICAL |
| C10 | Keyboard/mouse accessibility support and compatible fallback views | CRITICAL |
| C11 | Snapshot/export support | MEDIUM |
| C12 | Styling compatibility with PIT/Maturion UI system | HIGH |
| C13 | Testability through Playwright/E2E and visual regression checks | CRITICAL |
| C14 | Licensing (open-source compatible OR commercial license budget approved) | HIGH |
| C15 | Maintainability (active maintenance, documentation quality) | MEDIUM |

**Disqualifying criteria** (any one = DISQUALIFIED):
- D1: No exact date-to-pixel mapping (calculated positions from CSS, not math engine) → DISQUALIFIED
- D2: No row virtualisation → DISQUALIFIED for 1,000+ rows
- D3: No keyboard accessibility and no fallback view → DISQUALIFIED
- D4: Locked to opaque rendering engine that blocks Playwright element introspection → DISQUALIFIED
- D5: License incompatible with Maturion deployment (GPL contagion, per-seat fees exceeding budget) → DISQUALIFIED (pending CS2 commercial budget approval)

---

## 3. Candidate Evaluation Matrix

### Candidate A: Custom DOM-Virtualised Split-Pane + Date Math Engine

**Architecture description**: Custom React implementation using:
- `@tanstack/react-virtual` for row and column virtualisation
- CSS Grid / Flexbox for split-pane layout
- `date-fns` or `dayjs` for all date calculations
- Custom pure-function date math module (`getPixelForDate`, `getDateForPixel`)
- Drag handled via pointer events with custom drag-state management
- Progress overlay via absolutely-positioned div within bar

| Capability | Assessment | Notes |
|---|---|---|
| C1 (exact date-to-pixel) | ✅ FULL | Custom math; pixel = (date - start) / range × width |
| C2 (drag/resize handles) | ✅ FULL | Custom pointer event handlers |
| C3 (progress overlay) | ✅ FULL | Inset div with width = bar_width × pct |
| C4 (multi-row headers) | ✅ FULL | Configurable header rows, visible by denominator |
| C5 (viewport presets) | ✅ FULL | Custom state for viewport_preset |
| C6 (10-year horizontal) | ✅ FULL | Column virtualisation covers arbitrary range |
| C7 (1,000 row virtualisation) | ✅ FULL | `@tanstack/react-virtual` proven for 10,000+ rows |
| C8 (predecessor links) | ⚠️ MEDIUM | SVG arrows — implementable but not zero-effort |
| C9 (nested hierarchy) | ✅ FULL | Row groups with indent level |
| C10 (accessibility) | ✅ FULL | Custom keyboard handlers + table fallback view |
| C11 (snapshot/export) | ⚠️ MEDIUM | html2canvas or Puppeteer screenshot |
| C12 (UI styling) | ✅ FULL | Full control over all CSS tokens |
| C13 (Playwright testability) | ✅ FULL | Standard DOM elements; no canvas/shadow DOM barriers |
| C14 (licensing) | ✅ FULL | All open-source, MIT/Apache licensed |
| C15 (maintainability) | ⚠️ MEDIUM | Internal maintenance cost; no upstream bug fixes for custom logic |

**Disqualifying criteria**: D1 PASS, D2 PASS, D3 PASS, D4 PASS, D5 PASS
**Score**: 13/15 FULL, 3/15 MEDIUM, 0/15 FAIL
**Verdict**: ✅ **SELECTED AS PRIMARY CANDIDATE**

**Rationale**: Only approach that guarantees exact date-to-pixel math (under full control), full Playwright testability (standard DOM), full styling control, and no commercial licensing risk. Implementation complexity is manageable with `@tanstack/react-virtual`. Prior PIT failures were caused by opaque third-party libraries with inexact rendering — this approach eliminates that risk.

---

### Candidate B: DHTMLX Gantt

**Architecture description**: Commercial Gantt library (Standard: free; PRO: paid). JavaScript-based, renders to DOM + SVG hybrid.

| Capability | Assessment | Notes |
|---|---|---|
| C1 (exact date-to-pixel) | ✅ FULL | Internal date↔x-position API exposed |
| C2 (drag/resize handles) | ✅ FULL | Built-in |
| C3 (progress overlay) | ✅ FULL | Built-in `progress` field |
| C4 (multi-row headers) | ✅ FULL | Scale array supports multiple header rows |
| C5 (viewport presets) | ✅ FULL | Configurable start_date/end_date + scale |
| C6 (10-year horizontal) | ✅ FULL | Supported |
| C7 (1,000 row virtualisation) | ⚠️ MEDIUM | Smart rendering on PRO; Standard has limitations above ~500 rows |
| C8 (predecessor links) | ✅ FULL | Built-in dependency links |
| C9 (nested hierarchy) | ✅ FULL | Tree structure supported |
| C10 (accessibility) | ⚠️ MEDIUM | ARIA roles on some elements; keyboard nav limited; table alternative: manual work required |
| C11 (snapshot/export) | ✅ FULL | Built-in export |
| C12 (UI styling) | ⚠️ MEDIUM | CSS API available but customisation constrained by library internals |
| C13 (Playwright testability) | ⚠️ MEDIUM | DOM accessible; some internal rendering may be opaque |
| C14 (licensing) | ⚠️ MEDIUM | Standard tier free; PRO license required for full virtualisation. Budget approval needed |
| C15 (maintainability) | ✅ FULL | Actively maintained, good docs |

**Disqualifying criteria**: D1 PASS, D2 CONDITIONAL (PRO required), D3 CONDITIONAL (accessibility work required), D4 PASS, D5 CONDITIONAL (PRO license budget approval required)
**Score**: 10/15 FULL, 5/15 MEDIUM, 0/15 FAIL
**Verdict**: ⚠️ **ACCEPTABLE ALTERNATIVE — conditional on CS2 PRO license approval**

---

### Candidate C: Bryntum Gantt Pro

**Architecture description**: Premium commercial Gantt library. React bindings available. Full-featured.

| Capability | Assessment | Notes |
|---|---|---|
| C1 (exact date-to-pixel) | ✅ FULL | Full date math API |
| C2 (drag/resize) | ✅ FULL | Built-in |
| C3 (progress overlay) | ✅ FULL | Built-in |
| C4 (multi-row headers) | ✅ FULL | Multiple header rows |
| C5 (viewport presets) | ✅ FULL | Full configuration |
| C6 (10-year horizontal) | ✅ FULL | Supported |
| C7 (1,000 row virtualisation) | ✅ FULL | Designed for large datasets |
| C8 (predecessor links) | ✅ FULL | Built-in |
| C9 (nested hierarchy) | ✅ FULL | Built-in |
| C10 (accessibility) | ⚠️ MEDIUM | ARIA but keyboard nav requires configuration; table fallback manual |
| C11 (snapshot/export) | ✅ FULL | Built-in |
| C12 (UI styling) | ⚠️ MEDIUM | Theme system available; deep customisation constrained by library |
| C13 (Playwright testability) | ✅ FULL | Standard DOM |
| C14 (licensing) | ❌ FAIL | Commercial license: per-developer seat fees; perpetual or subscription. Requires explicit CS2 budget approval. License terms restrict redistribution. |
| C15 (maintainability) | ✅ FULL | Actively maintained |

**Disqualifying criteria**: D5 — License fees require CS2 commercial budget approval. Without explicit CS2 approval, this candidate is DISQUALIFIED.
**Score**: 10/15 FULL, 2/15 MEDIUM, 1/15 CONDITIONAL
**Verdict**: ❌ **DISQUALIFIED unless CS2 explicitly approves commercial license budget**

---

### Candidate D: gantt-task-react

**Architecture description**: Open-source React Gantt library (MIT). Lightweight.

| Capability | Assessment | Notes |
|---|---|---|
| C1 (exact date-to-pixel) | ❌ FAIL | Inexact CSS-positioned rendering; no exposed math API |
| C7 (1,000 row virtualisation) | ❌ FAIL | No virtualisation support |
| C10 (accessibility) | ❌ FAIL | No meaningful accessibility |

**Disqualifying criteria**: D1 (no exact date math), D2 (no virtualisation), D3 (no accessibility)
**Verdict**: ❌ **DISQUALIFIED** — fails three disqualifying criteria

---

### Candidate E: D3.js SVG Timeline

**Architecture description**: Custom SVG timeline using D3.js. Full control over rendering.

| Capability | Assessment | Notes |
|---|---|---|
| C1 (exact date-to-pixel) | ✅ FULL | D3 scale functions provide exact mapping |
| C7 (1,000 row virtualisation) | ❌ FAIL | SVG doesn't virtualise — 1,000 SVG elements is a performance risk |
| C10 (accessibility) | ❌ FAIL | SVG accessibility is a significant open engineering problem; no table fallback without separate implementation |
| C13 (Playwright testability) | ⚠️ MEDIUM | SVG elements accessible but visual regression harder |

**Disqualifying criteria**: D2 (no virtualisation), D3 (accessibility risk)
**Verdict**: ❌ **DISQUALIFIED** — fails two disqualifying criteria

---

## 4. Architecture Decision

**Primary candidate**: Candidate A — Custom DOM-Virtualised Split-Pane + Date Math Engine

**Bounded acceptable alternative**: Candidate B — DHTMLX Gantt PRO (if CS2 approves commercial license before Stage 7 PBFAG)

**Disqualified**: Candidates C (Bryntum — no budget approval), D (gantt-task-react — three disqualifying criteria), E (D3 SVG — virtualisation + accessibility)

**Final confirmation**: Final library/approach confirmed at Stage 7 PBFAG after Stage 6 QA-to-Red defines the full test suite against the chosen approach. Architecture bounds the acceptable options here. Selection of Candidate B requires explicit CS2 commercial budget approval posted as a GitHub issue comment on maturion-isms.

---

## 5. Timeline Data Architecture (PIT-TR-066)

### 5.1 Date Persistence Format

All project/milestone/deliverable/task dates persisted as ISO `YYYY-MM-DD` (date-only). No time component. User-facing display: `DD MMM YYYY` (e.g. `11 May 2026`).

### 5.2 Date-Math Contract (PIT-TR-066)

```typescript
// Pure functions — exported for unit testing
export function getPixelForDate(date: Date, config: TimelineConfig): number {
  const totalMs = config.endDate.getTime() - config.startDate.getTime();
  const dateMs = date.getTime() - config.startDate.getTime();
  return (dateMs / totalMs) * config.viewportWidthPx;
}

export function getDateForPixel(px: number, config: TimelineConfig): Date {
  const totalMs = config.endDate.getTime() - config.startDate.getTime();
  const dateMs = (px / config.viewportWidthPx) * totalMs;
  return new Date(config.startDate.getTime() + dateMs);
}
```

Where `TimelineConfig = { startDate: Date, endDate: Date, viewportWidthPx: number, denominator: Denominator }`.

DST and timezone: all date calculations use `date-fns-tz` with the organisation's canonical timezone. Internal boundaries are in canonical timezone; no UTC/local conversion ambiguity.

### 5.3 Predecessor + Offset + Duration Formula

```
calculated_start_date = MAX(
  predecessor.calculated_end_date + offset_days,
  milestone.start_date
)
calculated_end_date = calculated_start_date + duration_days
```

If no predecessor: `calculated_start_date = milestone.start_date + offset_days`.
If `duration_days = NULL` and `explicit_due_date` is set: `calculated_end_date = explicit_due_date`.

Computation: triggered by DB trigger or `compute_progress_rollup` Edge Function on:
- `task_dependencies` insert/delete
- `tasks.offset_days` change
- `tasks.duration_days` change
- parent `milestone.start_date` change

### 5.4 Progress Overlay

```
progress_overlay_width = bar_width × (task.progress_pct / 100)
```

Rendered as absolutely-positioned div inset within bar. `progress_pct` is the source of truth stored in `tasks`.

### 5.5 Locked Timeline Architecture

Database columns: `timeline_locked: boolean`, `lock_override_requested_at: timestamptz`, `lock_override_requested_by: uuid`.

State machine:
```
UNLOCKED → (org_admin/cs2_admin sets lock) → LOCKED
LOCKED → (user requests override) → LOCKED_OVERRIDE_REQUESTED
LOCKED_OVERRIDE_REQUESTED → (admin approves) → UNLOCKED + audit event
LOCKED_OVERRIDE_REQUESTED → (admin rejects) → LOCKED + rejection reason in audit event
```

All state transitions logged in `audit_log` with `action_type: LOCK | UNLOCK | OVERRIDE_REQUEST | OVERRIDE_APPROVE | OVERRIDE_REJECT`.

---

## 6. QA Architecture Hooks (PIT-TR-067 §12)

### 6.1 Unit-Testable Pure Functions

```typescript
// Both functions exported for direct unit testing
export function getPixelForDate(date: Date, config: TimelineConfig): number
export function getDateForPixel(px: number, config: TimelineConfig): Date
export function getProgressOverlayWidth(barWidth: number, progressPct: number): number
export function calculateTaskStartDate(predecessorEndDate: Date | null, offsetDays: number, milestoneStartDate: Date): Date
export function calculateTaskEndDate(startDate: Date, durationDays: number): Date
export function computeRollupProgress(childProgressValues: number[]): number
```

All functions are pure (no side effects) and exported from the timeline utility module.

### 6.2 Playwright E2E Test Targets

| Test Scenario | Playwright Approach |
|---|---|
| Date-to-pixel exactness | Compute expected pixel position from config, compare to bar element `getBoundingClientRect().left` |
| Pixel-to-date hover accuracy | Hover at known pixel position, read tooltip text, compare to expected date string |
| Drag start handle — correct date update | Drag start handle N pixels left, read persisted `tasks.calculated_start_date` from DB |
| Drag end handle — correct date update | Drag end handle M pixels right, read persisted `tasks.calculated_end_date` from DB |
| Drag bar body — correct date update | Drag bar body, verify both start and end dates updated by same offset |
| Auto-scroll while dragging | Drag handle to viewport edge, assert grid scrolled, bar position updated |
| Denominator switch — re-render | Click denominator button, assert header rows updated, bar positions recalculated |
| Viewport preset selection | Select "5 years", assert timeline range spans 5 years from today |
| Descriptor/grid alignment | Measure bounding boxes of descriptor rows and corresponding timeline grid rows; assert top position match within 1px tolerance |
| Progress overlay proportionality | Set task progress to 60%, measure overlay width / total bar width, assert = 0.60 ± 0.01 |
| Predecessor scheduling propagation | Change milestone start date, assert child task calculated_start_date updated via Edge Function |
| Locked timeline override flow | Request override → admin approves → assert bar becomes draggable |
| Locked timeline rejection flow | Request override → admin rejects → assert bar remains locked + audit entry |
| Visual regression — timeline grid | `toHaveScreenshot()` on `<TimelinePage />` for main rendering area |
| Visual regression — denominator day | Switch to day denominator, `toHaveScreenshot()` |
| Accessibility — zero axe violations | `@axe-core/playwright` on `/projects/:id/timeline` |
| Table fallback view | Click "Table View" toggle, assert `<table>` element rendered with all rows |
| Keyboard navigation on bar | Focus bar, press arrow key, assert date changes; Tab to next bar |

### 6.3 Visual Regression Architecture

- Playwright `expect(page).toHaveScreenshot('timeline-main.png')` for main timeline render.
- Baseline screenshots committed to `modules/pit/04-architecture/qa/visual-baselines/`.
- Tolerance: 1px threshold for layout alignment; pixel-exact for bar positions.
- Visual regression run: per CI commit on timeline-affecting changes.

---

## 7. Accessibility Architecture for Timeline (PIT-TR-125)

### 7.1 Table Alternative View

A button labelled "Switch to table view" (accessible name: "Switch to accessible table view") renders the timeline data as an HTML `<table>`:

| Project / Entity | Type | Start Date | End Date | Progress % | Status |
|---|---|---|---|---|---|
| My Project | Project | 11 May 2026 | 30 Nov 2026 | 45% | Active |
| Milestone 1 | Milestone | 11 May 2026 | 30 Jun 2026 | 60% | In Progress |

Table includes: caption, `<thead>`, `<tbody>`, sortable columns, keyboard navigation (arrow keys), row focus.

### 7.2 Keyboard Interaction on Timeline Bars

- `Tab` focus moves between bars.
- `ArrowLeft` / `ArrowRight` on a focused bar: adjusts start date by 1 denominator unit.
- `Shift + ArrowLeft` / `Shift + ArrowRight`: adjusts end date by 1 denominator unit.
- `Enter` on a bar: opens edit dialog.
- `Escape`: cancels drag/focus.

Screen reader label on focused bar: `{entity_type}: {name}, start {start_date}, end {end_date}, {progress_pct}% progress, {status}`.

### 7.3 Denominator Switcher and Viewport Controls

All toolbar controls: visible labels or `aria-label`. Keyboard-operable via Tab + Enter/Space.

---

## 8. Decision Summary

| Category | Decision | Status |
|---|---|---|
| Rendering family | DOM-virtualised split-pane + custom date math | SELECTED (Candidate A) |
| Virtualisation library | `@tanstack/react-virtual` | PROPOSED |
| Date math library | `date-fns` + `date-fns-tz` | PROPOSED |
| Date precision | ISO date-only (`YYYY-MM-DD`); no time component | CONFIRMED |
| Drag implementation | Custom pointer events | PROPOSED |
| Accessibility | Custom keyboard handlers + table alternative view | CONFIRMED |
| Testability | Standard DOM + exported pure functions | CONFIRMED |
| Predecessor scheduling | Server-side computation via DB trigger / Edge Function | CONFIRMED |
| Locked timeline | State machine with approval workflow + audit log | CONFIRMED |
| Progress overlay | Inset div, `bar_width × pct` | CONFIRMED |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Custom drag implementation has edge cases (auto-scroll, touch, multi-touch) | MEDIUM | HIGH | Playwright E2E suite validates all scenarios before Stage 12 build completion |
| Predecessor scheduling triggers cause performance issues on large datasets | MEDIUM | MEDIUM | Batch computation in Edge Function; debounce trigger frequency |
| Row/column alignment drift under zoom or resize | MEDIUM | HIGH | Architecture contract: shared row index + px-exact bounding box QA test |
| DHTMLX PRO license approval delayed | LOW | MEDIUM | Candidate A (custom) is the fallback; no dependency on commercial approval |
| Timeline visual regression flakiness in CI | MEDIUM | MEDIUM | Threshold tolerance (1px) + retry logic in Playwright config |

---

**End of ADR-PIT-001 — Timeline Engine Architecture Decision Record**

---

**Date**: 2026-05-11
**Author**: foreman-v2-agent (POLC-Orchestration mode)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
