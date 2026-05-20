# PIT Stage 8 — Timeline Engine Builder Contract (W8.6)

References:
- `modules/pit/04-architecture/timeline-engine-architecture-decision.md`
- `modules/pit/06-qa-to-red/timeline-engine-red-tests.md`
- `modules/pit/08-implementation-plan/implementation-plan.md#W8.6`

> This is a builder-executable rules contract for W8.6 planning and QA definition only. Build Authorization remains **NOT CLEARED**.

## Required algorithm and interaction rules

1. **Date-to-pixel formula**
   - `px = (dayOffset(taskDate, viewStart, canonicalTz) / dayOffset(viewEnd, viewStart, canonicalTz)) * viewportWidthPx`
   - Day offsets must use calendar-day math, not millisecond deltas.

2. **Timezone/date-normalisation rule**
   - Persist and compute timeline dates as date-only (`YYYY-MM-DD`) in canonical org timezone.
   - Convert to zoned calendar days before any offset math.

3. **Inclusive/exclusive boundary rule**
   - Start boundary inclusive; end boundary exclusive for denominator span math.
   - Visual bar width includes final displayed day using normalized day-count contract.

4. **Denominator calculation rule (week/month/quarter/year)**
   - Denominator grids are derived from normalized calendar spans.
   - Presets (week, month, quarter, year) must preserve proportional mapping and exact hover-date lookup.

5. **Bar rounding rule**
   - Render coordinates may round to integer pixels for paint stability.
   - Underlying date math remains fractional until final render step.

6. **Drag snapping rule**
   - Drag operations snap to active denominator boundaries (day/week/month etc.)
   - Snap mode must be explicit and testable.

7. **Whole-bar drag rule**
   - Whole-bar drag shifts both start and end dates by equal denominator delta while preserving duration.

8. **Dependency recalculation rule**
   - Upstream predecessor date changes trigger deterministic downstream recalculation in defined order.
   - Circular dependency updates must fail with explicit error and no partial persist.

9. **Duration/offset recalculation rule**
   - Resize updates duration; drag updates offset.
   - Calculated outputs must persist and remain stable after reload.

10. **Progress overlay calculation rule**
   - Overlay width = `barWidthPx * (progressPercentage / 100)` and clamps to `[0, barWidthPx]`.

11. **Minimum column-width rule**
   - Enforce minimum column width to preserve label/date readability and pointer target size.

12. **Proportional denominator-resizing rule**
   - Changing denominator/preset must keep bar/date alignment proportional and reversible.

13. **Large-project performance target**
   - Required representative fixture for this target: minimum 500 tasks, 4-level hierarchy (project/milestone/deliverable/task), and 24-month date range.
   - For that fixture, initial timeline render target: ≤500ms with virtualization enabled.

14. **Visual-regression fixture set**
   - Maintain fixed fixtures for: baseline timeline, zoom state, dense hierarchy, long-range horizontal scroll, dependency lines.

15. **Browser coverage expectations**
   - Must validate timeline behavior on Chromium, Firefox, and WebKit in CI-compatible suite.

16. **No-date-drift acceptance tests (explicit)**
   - Required tests across DST transitions and year boundaries; same dates must map to stable positions across reloads/zoom toggles.

## Required evidence package for wave closure (planning contract)

- Pixel/date assertion outputs
- Drag/resize HAR + persisted-date proof
- Dependency recalculation traces
- Performance trace for large fixture
- Visual regression diff results
- Cross-browser run summary
- Explicit no-date-drift test report

## Hard blockers (must reject handover)

- Any date drift across timezone/DST boundaries
- Header/grid/bar alignment desynchronisation
- Missing dependency recalculation evidence
- Missing cross-browser or visual-regression evidence
- Any skipped/todo/pending timeline RED tests claimed as complete
