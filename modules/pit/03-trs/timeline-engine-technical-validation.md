# PIT Stage 4 — Timeline Engine Technical Validation

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | Stage 4 technical validation evidence |
| Stage | 4 — TRS |
| Wave | Re-confirm PIT Stage 4 TRS with timeline engine technical validation |
| Issue | maturion-isms#1604 |
| Date | 2026-05-11 |
| Authority | CS2 (Johan Ras / @APGI-cmy) |

---

## 1) Legacy failure risk recap

Prior PIT build attempts failed at timeline/tooling practicality, not at requirement wording.  
This validation hardens Stage 4 so Stage 5 Architecture must evaluate a technically buildable timeline model instead of accepting generic "Gantt chart" language.

---

## 2) Rendering strategy constraints (Stage 5 decision envelope)

Stage 5 must select and justify one rendering family (DOM virtualised grid, SVG, Canvas, or hybrid) and prove:

- date-grid and bar alignment stability under scroll/zoom/resize;
- split-pane stability (fixed descriptors + scrollable timeline grid);
- draggable/resizable interactions;
- long horizontal range support (minimum 10 years);
- accessible fallback rendering for keyboard/screen-reader users.

Selection cannot be justified only by integration ease.

---

## 3) Tool/library selection criteria (mandatory)

Architecture must score candidate tooling against:

- exact date↔pixel mapping + inverse hover-date mapping;
- drag body + drag handles (start/end);
- progress overlay inside bars;
- multi-row headers (year/quarter/month/week/day);
- denominator switching + viewport presets;
- dependency/predecessor links;
- hierarchy rendering (project→milestone→deliverable→task);
- virtualisation for high row counts;
- export/snapshot compatibility;
- styling compatibility with PIT UI system;
- Playwright/E2E + visual regression testability.

---

## 4) Date-math contract summary

- canonical timezone: organisation timezone;
- project/milestone/deliverable boundaries stored as ISO dates;
- task planning supports predecessor + offset + duration precision;
- inclusive start / exclusive internal end contract for deterministic math;
- snap behavior per denominator;
- shared contract for bar labels, hover labels, and drag labels;
- DST-safe calendar-cell calculations before display formatting.

---

## 5) Interaction and persistence contract summary

- visual timeline creation and editing in timeline view;
- deliverable/task schedule derivation from predecessor/offset/duration paths;
- drag + resize with visible date labels and auto-scroll;
- denominator switching and viewport presets with full-range horizontal scroll;
- filters by project/milestone/deliverable/task/responsible/company/department/date/status;
- persistence of timeline view settings, denominator/viewport selections, collapse state, predecessor links, offsets, durations, and progress overlay values;
- locked timeline changes require override approval flow + audit event trail.

---

## 6) Performance and QA-to-Red obligations

Stage 5/6 target envelope:

- 10-year horizontal range support;
- 1,000-row virtualised hierarchy support;
- initial render ≤ 2s (reference dataset);
- drag interaction target ≥ 30 FPS where practical;
- zero row/header/bar alignment drift under interaction.

Stage 6 must include timeline-specific tests for:

- date-to-pixel exactness;
- hover-date and drag-date accuracy;
- progress overlay proportionality;
- denominator switching behavior;
- viewport preset behavior while timeline remains scrollable off-screen;
- alignment integrity of descriptor/progress/date-grid/bars;
- predecessor/offset/duration-derived scheduling correctness;
- locked timeline override/approval behavior and audit evidence.

---

## 7) Legacy Action tracker requirement coverage and gap classification

Legacy source reviewed: `apps/pit/Legacy/Action tracker.docx`.

| Legacy requirement cluster | Coverage classification | Evidence |
|---|---|---|
| Visual matrix timeline with drag/resize and exact grid alignment | Covered by Stage 1 + 2 + 3 + 4 | App Description timeline sections; UX timeline screen; FRS PIT-FR-068–076; TRS PIT-TR-064/065/066/067 |
| Denominators year/quarter/month/week/day + configurable viewport + long scroll | Covered by Stage 1 + 2 + 4 | App Description + UX controls + TRS PIT-TR-064/065/067 |
| Hover exact date + visible labels during drag + auto-scroll while dragging | Covered by Stage 2 + 3 + 4 | UX interactions + FRS PIT-FR-072/075 + TRS PIT-TR-066/067 |
| Progress overlay inside timeline bars | Covered by Stage 1 + 3 + 4 | App Description + FRS PIT-FR-070 + TRS PIT-TR-064/066 |
| Filters (project/milestone/deliverable/task/person/company/department/date/status) | Covered by Stage 1 + 2 + 3 + 4 | App Description + UX + FRS PIT-FR-085/086 + TRS PIT-TR-067 |
| Predecessor/offset/duration-driven scheduling | Covered by Stage 1 + 3 + 4 | App Description + FRS PIT-FR-056/072/073 + TRS PIT-TR-066/067 |
| Locked timeline changes require approval/override with audit trail | Covered by Stage 1 + 3 + 4 | App Description governance clauses + FRS escalation/audit controls + TRS PIT-TR-067 |
| QA must validate functional behavior, not file existence only | Covered by Stage 1 + 2 + 3 + 4 | MMM L-005 propagation + Stage 6 derivation clauses + TRS PIT-TR-067/PIT-TR-112 |

**Gap statement:** No unclassified legacy timeline gaps remain in Stage 4 after this validation pass.

---

**Build Authorization**: NOT CLEARED  
**Stage 5 Architecture**: remains blocked until Stage 4 CS2 approval/gate-pass
